import { Bone, Euler, Group, Matrix4, Quaternion, SkinnedMesh, Vector3 } from "three";
import { guideKeyByCode, type FingerGuideTarget, type GuideHand } from "./fingerGuide";

const SCALE = 0.00042;
export function guideKeyPosition(code: string): Vector3 {
  const key = guideKeyByCode.get(code)!;
  return new Vector3((key.left + key.drawWidth / 2 - 364) * SCALE, 0.012, (key.top + 20 - 112) * SCALE);
}
export function guideContactPosition(code: string): Vector3 {
  const position = guideKeyPosition(code);
  const key = guideKeyByCode.get(code)!;
  if (code === "ShiftLeft") position.x += key.drawWidth * SCALE / 2 - 0.012;
  if (code === "ShiftRight" || code === "Enter") position.x -= key.drawWidth * SCALE / 2 - 0.012;
  return position;
}
const fingers = ["thumb", "index", "middle", "ring", "pinky"] as const;
type Finger = typeof fingers[number];
type Joint = { bone: Bone; rest: Quaternion; x: Vector3; y: Vector3; z: Vector3; flex: number; spread: number; twist: number; min: number; max: number; allowSpread: boolean };
const homeCodes = { left: ["Space", "KeyF", "KeyD", "KeyS", "KeyA"], right: ["Space", "KeyJ", "KeyK", "KeyL", "Semicolon"] };
function jointNames(finger: Finger) {
  return finger === "thumb"
    ? ["thumb-metacarpal", "thumb-phalanx-proximal", "thumb-phalanx-distal", "thumb-tip"]
    : [`${finger}-finger-metacarpal`, `${finger}-finger-phalanx-proximal`, `${finger}-finger-phalanx-intermediate`, `${finger}-finger-phalanx-distal`, `${finger}-finger-tip`];
}
const tempA = new Vector3();
const axisRotation = new Quaternion();

export function createHandRig(asset: Group, hand: GuideHand) {
  const wrist = asset.getObjectByName("wrist") as Bone;
  const mesh = asset.getObjectByProperty("type", "SkinnedMesh") as SkinnedMesh;
  if (!wrist || !mesh) throw new Error("Hand asset requires a wrist and skin weights");
  asset.updateMatrixWorld(true);
  const back = wrist.getWorldPosition(new Vector3()).sub(asset.getObjectByName("middle-finger-phalanx-proximal")!.getWorldPosition(new Vector3())).normalize();
  const index = asset.getObjectByName("index-finger-phalanx-proximal")!.getWorldPosition(new Vector3());
  const pinky = asset.getObjectByName("pinky-finger-phalanx-proximal")!.getWorldPosition(new Vector3());
  const right = hand === "left" ? index.sub(pinky) : pinky.sub(index);
  right.addScaledVector(back, -right.dot(back)).normalize();
  const up = back.clone().cross(right).normalize();
  const root = new Group();
  const orientation = new Group();
  root.add(orientation);
  orientation.add(asset);
  orientation.quaternion.setFromRotationMatrix(new Matrix4().makeBasis(right, up, back)).invert();
  root.updateMatrixWorld(true);
  orientation.position.sub(wrist.getWorldPosition(new Vector3()));
  root.updateMatrixWorld(true);
  const chains = fingers.map(finger => {
    const bones = jointNames(finger).map(name => {
      const bone = asset.getObjectByName(name) as Bone;
      if (!bone) throw new Error(`Hand asset requires ${name}`);
      return bone;
    });
    let parent = wrist;
    for (const bone of bones) { parent.attach(bone); parent = bone; }
    return { finger, bones, tip: bones[bones.length - 1] };
  });
  root.updateMatrixWorld(true);
  const boneRest = mesh.skeleton.bones.map(bone => ({ bone, position: bone.position.clone(), quaternion: bone.quaternion.clone() }));
  const joints = chains.map(chain => chain.bones.slice(chain.finger === "thumb" ? 0 : 1, -1).map((bone, i): Joint => {
    const inverse = bone.getWorldQuaternion(new Quaternion()).normalize().invert();
    const direction = chain.tip.getWorldPosition(new Vector3()).sub(bone.getWorldPosition(new Vector3()));
    const longAxis = direction.clone().normalize();
    // WebXR joints use local X for flexion and local Y for abduction.
    // Retain the thumb pad orientation encoded in the asset.
    const hinge = direction.cross(new Vector3(0, 1, 0)).normalize();
    return { bone, rest: bone.quaternion.clone().normalize(), x: chain.finger === "thumb" ? new Vector3(1, 0, 0) : hinge.applyQuaternion(inverse).normalize(), y: chain.finger === "thumb" ? new Vector3(0, 1, 0) : new Vector3(0, 1, 0).applyQuaternion(inverse).normalize(), z: longAxis.applyQuaternion(inverse).normalize(), twist: 0, flex: chain.finger === "thumb" ? 0 : -0.3, spread: 0, min: chain.finger === "thumb" ? (i === 0 ? -0.35 : i === 1 ? -0.45 : -0.35) : i === 2 ? -0.85 : i === 1 ? -1.45 : -1.15, max: chain.finger === "thumb" ? (i === 0 ? -0.2 : i === 1 ? 0.4 : 0.15) : i === 0 ? 0.18 : 0, allowSpread: i === 0 };
  }));
  // The wrists sit behind the home keys with a small inward angle.
  const homeYaw = hand === "left" ? -0.15 : 0.15;
  const homeRotation = new Quaternion().setFromAxisAngle(new Vector3(0, 1, 0), homeYaw);
  const basePosition = new Vector3(guideKeyPosition(homeCodes[hand][2]).x + (hand === "left" ? -0.0205 : 0.0205), 0.058, hand === "left" ? 0.141 : 0.1415);
  root.position.copy(basePosition); root.quaternion.copy(homeRotation);
  root.updateMatrixWorld(true);

  function apply(joint: Joint) {
    joint.bone.quaternion.copy(joint.rest)
      .multiply(axisRotation.setFromAxisAngle(joint.y, joint.spread))
      .multiply(axisRotation.setFromAxisAngle(joint.x, joint.flex))
      .multiply(axisRotation.setFromAxisAngle(joint.z, joint.twist)).normalize();
  }
  function solve(chainIndex: number, goal: Vector3) {
    const chain = chains[chainIndex], controls = joints[chainIndex];
    function update() {
      // Couple the two outer hinges into one curl while preserving segment lengths.
      if (chain.finger !== "thumb") controls[2].flex = controls[1].flex * 0.55;
      controls.forEach(apply);
      controls[0].bone.updateWorldMatrix(false, true);
    }
    function error() { return chain.tip.getWorldPosition(tempA).distanceToSquared(goal); }
    const variables = chain.finger === "thumb" ? [[0, "flex"], [0, "spread"]] as const : [[0, "flex"], [0, "spread"], [1, "flex"]] as const;
    update();
    for (const step of [0.24, 0.12, 0.06, 0.03, 0.015]) {
      for (let iteration = 0; iteration < 6; iteration++) {
        let improved = false;
        for (const [index, axis] of variables) {
          const joint = controls[index], initial = joint[axis];
          let best = initial, bestError = error();
          for (const sign of [-1, 1]) {
            const spreadLimit = chain.finger === "pinky" ? 0.45 : 0.35;
            joint[axis] = Math.max(axis === "flex" ? joint.min : -spreadLimit, Math.min(axis === "flex" ? joint.max : spreadLimit, initial + step * sign));
            update();
            const candidate = error();
            if (candidate < bestError) { bestError = candidate; best = joint[axis]; improved = true; }
          }
          joint[axis] = best; update();
        }
        if (!improved || error() < 0.0000005) break;
      }
    }
  }
  function homeGoal(index: number) {
    return guideKeyPosition(homeCodes[hand][index]);
  }
  // Retain the thumb web and a relaxed bend. Space articulates at the thumb base.
  Object.assign(joints[0][0], { flex: -0.22, spread: hand === "left" ? 0.19 : -0.19, twist: 0 });
  Object.assign(joints[0][1], { flex: -0.3 });
  Object.assign(joints[0][2], { flex: -0.1 });
  for (const control of joints.flat()) { apply(control); }
  root.updateMatrixWorld(true);
  chains.forEach((_, index) => { if (index > 0) solve(index, homeGoal(index)); });
  const thumbAnchor = chains[0].tip.getWorldPosition(new Vector3());
  thumbAnchor.y = guideKeyPosition("Space").y;
  thumbAnchor.z = guideKeyPosition("Space").z;
  solve(0, thumbAnchor);
  const homePose = mesh.skeleton.bones.map(bone => ({ position: bone.position.clone(), quaternion: bone.quaternion.clone() }));
  const homeControls = joints.flat().map(joint => ({ flex: joint.flex, spread: joint.spread, twist: joint.twist }));
  const poseCache = new Map<string, { position: Vector3; rotation: Quaternion; rotations: Quaternion[]; controls: { flex: number; spread: number; twist: number }[] }>();
  function pose(target: FingerGuideTarget) {
    const shift = target.shiftHand === hand;
    const active = shift ? "pinky" : target.hand === hand ? target.finger : undefined;
    const activeCode = shift ? (hand === "left" ? "ShiftLeft" : "ShiftRight") : target.keyCode;
    // Space preserves the current palms and finger reach. Its press is separate.
    if (target.keyCode === "Space") return { active, tip: active ? chains[0].tip.getWorldPosition(new Vector3()) : undefined };
    const cacheKey = active && activeCode ? `${active}:${activeCode}` : "rest";
    const cached = poseCache.get(cacheKey);
    root.position.copy(cached?.position ?? basePosition);
    root.quaternion.copy(cached?.rotation ?? homeRotation);
    mesh.skeleton.bones.forEach((bone, index) => {
      bone.position.copy(homePose[index].position);
      bone.quaternion.copy(cached?.rotations[index] ?? homePose[index].quaternion);
    });
    joints.flat().forEach((joint, index) => Object.assign(joint, cached?.controls[index] ?? homeControls[index]));
    root.updateMatrixWorld(true);
    if (!cached && active && activeCode) {
      const index = fingers.indexOf(active);
      const goal = guideContactPosition(activeCode);
      const home = homeGoal(index);
      const delta = goal.clone().sub(home);
      const yaw = Math.max(-0.24, Math.min(0.24, -delta.x * 5));
      const pitch = Math.max(-0.06, Math.min(0.06, delta.z));
      root.quaternion.setFromEuler(new Euler(pitch, homeYaw + yaw, -yaw * 0.2, "YXZ"));
      root.position.add(new Vector3(delta.x * 0.12, 0, delta.z * 0.12));
      root.updateMatrixWorld(true);
      // Outer keys use a bounded wrist reach; passive fingers travel with the palm.
      for (let attempt = 0; attempt < 5; attempt++) {
        solve(index, goal);
        const residual = goal.clone().sub(chains[index].tip.getWorldPosition(new Vector3()));
        if (residual.length() < 0.002) break;
        root.position.x = Math.max(basePosition.x - 0.035, Math.min(basePosition.x + 0.035, root.position.x + residual.x * 0.85));
        root.position.y = Math.max(basePosition.y - 0.012, Math.min(basePosition.y + 0.012, root.position.y + residual.y * 0.5));
        root.position.z = Math.max(basePosition.z - 0.06, Math.min(basePosition.z + 0.018, root.position.z + residual.z * 0.85));
        root.updateMatrixWorld(true);
      }
      solve(index, goal);
    }
    root.updateMatrixWorld(true);
    if (!cached) poseCache.set(cacheKey, {
      position: root.position.clone(), rotation: root.quaternion.clone(),
      rotations: mesh.skeleton.bones.map(bone => bone.quaternion.clone()),
      controls: joints.flat().map(joint => ({ flex: joint.flex, spread: joint.spread, twist: joint.twist })),
    });
    return { active, tip: active ? chains[fingers.indexOf(active)].tip.getWorldPosition(new Vector3()) : undefined };
  }
  function pressThumb(amount = 1) {
    const base = joints[0][0].bone;
    base.quaternion.multiply(new Quaternion().setFromAxisAngle(new Vector3(0, 1, 0), (hand === "left" ? -1 : 1) * 0.045 * amount));
    root.updateMatrixWorld(true);
    return chains[0].tip.getWorldPosition(new Vector3());
  }
  return { root, mesh, pose, pressThumb, joints: joints.flat(), boneRest, chains, hand };
}
export type HandRig = ReturnType<typeof createHandRig>;
