import {
  AmbientLight,
  BoxGeometry,
  BufferAttribute,
  CanvasTexture,
  Color,
  DirectionalLight,
  EqualDepth,
  Group,
  Mesh,
  MeshBasicMaterial,
  MeshStandardMaterial,
  OrthographicCamera,
  PlaneGeometry,
  Scene,
  SRGBColorSpace,
  Vector3,
  WebGLRenderer,
} from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { createHandRig, type HandRig } from "./fingerGuideRig";
import { fingerGuideTarget, getGuideKeyboard } from "./fingerGuide";

// Uses Tachyboard's own models, keyboard geometry and anatomical pose solver.
export async function createProjectHands(host: HTMLElement) {
  const reduced = matchMedia("(prefers-reduced-motion: reduce)");
  const compact = matchMedia("(max-width: 600px)");
  const renderer = new WebGLRenderer({
    alpha: true,
    antialias: true,
    powerPreference: "low-power",
  });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));
  renderer.outputColorSpace = SRGBColorSpace;
  renderer.domElement.setAttribute("aria-hidden", "true");
  host.append(renderer.domElement);
  const scene = new Scene();
  const camera = new OrthographicCamera(-0.2, 0.2, 0.15, -0.15, 0.01, 3);
  scene.add(new AmbientLight(0xffffff, 1.8));
  const light = new DirectionalLight(0xffffff, 2.3);
  light.position.set(-0.3, 0.8, 0.3);
  scene.add(light);
  const fill = new DirectionalLight(0xffffff, 0.6);
  fill.position.set(0.4, 0.2, -0.3);
  scene.add(fill);
  const keyboard = new Group();
  scene.add(keyboard);
  const platform = /Mac|iPhone|iPad/.test(navigator.platform) ? "mac" : "win";
  const keys = getGuideKeyboard(platform).map((key) => {
    const material = new MeshStandardMaterial({
      color: 0xf0f0f0,
      roughness: 0.85,
    });
    const mesh = new Mesh(
      new BoxGeometry(key.drawWidth * 0.00042, 0.005, 0.0168),
      material,
    );
    mesh.position.set(
      (key.left + key.drawWidth / 2 - 364) * 0.00042,
      0,
      (key.top + 20 - 112) * 0.00042,
    );
    keyboard.add(mesh);
    return { key, mesh, material };
  });
  // On phones, live labels retain a readable size above the translucent guide.
  const labels = document.createElement("span");
  labels.setAttribute("aria-hidden", "true");
  labels.dataset.keyboardLabels = "";
  labels.hidden = true;
  labels.style.cssText = "position:absolute;inset:0;pointer-events:none;";
  host.append(labels);
  const compactLabels: Record<string, string> = {
    Tab: platform === "mac" ? "tab" : "TAB", CapsLock: platform === "mac" ? "caps" : "CAPS", ShiftLeft: platform === "mac" ? "shift" : "SHIFT", ShiftRight: platform === "mac" ? "shift" : "SHIFT",
    Backspace: platform === "mac" ? "delete" : "Del", Enter: platform === "mac" ? "return" : "Enter", ControlLeft: platform === "mac" ? "⌃" : "ctrl", ControlRight: platform === "mac" ? "⌃" : "ctrl",
    AltLeft: platform === "mac" ? "⌥" : "alt", AltRight: platform === "mac" ? "⌥" : "alt", MetaLeft: platform === "mac" ? "⌘" : "⊞", MetaRight: platform === "mac" ? "⌘" : "⊞",
    Space: "SPACE", Escape: "esc",
  };
  const keyLabels = keys.map(({ key }) => {
    const element = document.createElement("span");
    element.textContent = compactLabels[key.code] ?? key.display.toUpperCase();
    element.style.cssText = 'position:absolute;transform:translate(-50%,-50%);font:400 14px/14px "Funnel Sans",sans-serif;color:#333;';
    labels.append(element);
    return element;
  });
  const base = new Mesh(
    new BoxGeometry(0.309, 0.004, 0.096),
    new MeshStandardMaterial({ color: 0xcdcdcd, roughness: 0.8 }),
  );
  base.position.set(0, -0.004, -0.00084);
  keyboard.add(base);
  const label = document.createElement("canvas");
  label.width = 1456;
  label.height = 448;
  const context = label.getContext("2d")!;
  const texture = new CanvasTexture(label);
  texture.colorSpace = SRGBColorSpace;
  const labelMesh = new Mesh(
    new PlaneGeometry(728 * 0.00042, 224 * 0.00042),
    new MeshStandardMaterial({
      map: texture,
      transparent: true,
      depthWrite: false,
      roughness: 1,
    }),
  );
  labelMesh.rotation.x = -Math.PI / 2;
  labelMesh.position.y = 0.0027;
  keyboard.add(labelMesh);
  const rigs: HandRig[] = [];
  const skin = new Color(0xc9a698),
    accent = new Color(0x168fe0),
    color = new Color();
  const wristFades = new Map<HandRig, Float32Array>();
  let frame = 0,
    disposed = false,
    visible = true;
  let poses: {
    rig: HandRig;
    position: typeof camera.position;
    rotation: typeof camera.quaternion;
    bones: (typeof camera.quaternion)[];
    targetPosition: typeof camera.position;
    targetRotation: typeof camera.quaternion;
    targetBones: (typeof camera.quaternion)[];
  }[] = [];
  let start = 0,
    current: string | undefined,
    pressingSpace = false;
  function paint(character?: string) {
    const target =
      character === "Backspace"
        ? {
            cue: "Backspace",
            keyCode: "Backspace",
            hand: "right" as const,
            finger: "pinky" as const,
            shiftHand: undefined,
          }
        : fingerGuideTarget(character);
    context.clearRect(0, 0, label.width, label.height);
    context.save();
    context.scale(2, 2);
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.font = '15px "Funnel Sans", sans-serif';
    for (const [index, { key, material, mesh }] of keys.entries()) {
      const active =
        key.code === target.keyCode ||
        key.code ===
          (target.shiftHand === "left"
            ? "ShiftLeft"
            : target.shiftHand === "right"
              ? "ShiftRight"
              : "");
      material.color.set(active ? accent : 0xf0f0f0);
      mesh.position.y = active ? -0.001 : 0;
      context.fillStyle = active ? "#ffffff" : "#41434b";
      if (host.clientWidth >= 950)
        context.fillText(compactLabels[key.code] ?? key.display.toUpperCase(), key.left + key.drawWidth / 2, key.top + 20);
      keyLabels[index].style.color = active ? "#ffffff" : "#333333";
    }
    context.restore();
    texture.needsUpdate = true;
  }
  function render(now: number) {
    frame = 0;
    if (disposed || !visible || document.hidden) return;
    const elapsed = now - start,
      finished = reduced.matches || elapsed >= (pressingSpace ? 170 : 240),
      t = reduced.matches ? 1 : pressingSpace
        ? elapsed < 70 ? elapsed / 70 : Math.max(0, 1 - (elapsed - 70) / 100)
        : Math.min(1, elapsed / 240),
      ease = t * t * (3 - 2 * t);
    for (const pose of poses) {
      pose.rig.root.position.lerpVectors(
        pose.position,
        pose.targetPosition,
        ease,
      );
      pose.rig.root.quaternion.slerpQuaternions(
        pose.rotation,
        pose.targetRotation,
        ease,
      );
      pose.rig.mesh.skeleton.bones.forEach((bone, index) =>
        bone.quaternion.slerpQuaternions(
          pose.bones[index],
          pose.targetBones[index],
          ease,
        ),
      );
    }
    if (pressingSpace) {
      keys.find(({ key }) => key.code === "Space")!.mesh.position.y = -0.0015 * ease;
      host.dataset.spacePress = finished ? "idle" : elapsed < 70 ? "pressing" : "releasing";
    }
    renderer.render(scene, camera);
    host.dataset.motion = finished ? "settled" : "moving";
    if (!finished) frame = requestAnimationFrame(render);
  }
  function requestFrame() {
    if (!disposed && visible && !document.hidden && !frame)
      frame = requestAnimationFrame(render);
  }
  function select(character?: string) {
    // Repeated spaces reuse the pose before the preceding thumb press.
    if (character === " " && pressingSpace)
      poses.forEach(({ rig, bones }) => rig.mesh.skeleton.bones.forEach((bone, index) => bone.quaternion.copy(bones[index])));
    pressingSpace = character === " ";
    host.dataset.spacePress = pressingSpace ? "pressing" : "idle";
    current = character;
    const target =
      character === "Backspace"
        ? {
            cue: "Backspace",
            keyCode: "Backspace",
            hand: "right" as const,
            finger: "pinky" as const,
            shiftHand: undefined,
          }
        : fingerGuideTarget(character);
    poses = rigs.map((rig) => {
      const position = rig.root.position.clone(),
        rotation = rig.root.quaternion.clone(),
        bones = rig.mesh.skeleton.bones.map((bone) => bone.quaternion.clone());
      const result = rig.pose(target);
      if (result.active === "thumb") rig.pressThumb();
      const targetPosition = rig.root.position.clone(),
        targetRotation = rig.root.quaternion.clone(),
        targetBones = rig.mesh.skeleton.bones.map((bone) =>
          bone.quaternion.clone(),
        );
      const geometry = rig.mesh.geometry,
        indices = geometry.getAttribute("skinIndex"),
        weights = geometry.getAttribute("skinWeight"),
        colors = geometry.getAttribute("color") as BufferAttribute;
      for (let vertex = 0; vertex < colors.count; vertex++) {
        let weight = 0;
        for (let slot = 0; slot < 4; slot++) {
          const name =
            rig.mesh.skeleton.bones[indices.getComponent(vertex, slot)].name;
          if (
            result.active &&
            name.startsWith(
              result.active === "thumb" ? "thumb-" : `${result.active}-finger-`,
            ) &&
            !name.endsWith("metacarpal")
          )
            weight += weights.getComponent(vertex, slot);
        }
        color.copy(skin).lerp(accent, Math.min(1, weight));
        colors.setXYZW(
          vertex,
          color.r,
          color.g,
          color.b,
          (0.42 + Math.min(1, weight) * 0.46) * wristFades.get(rig)![vertex],
        );
      }
      colors.needsUpdate = true;
      rig.root.position.copy(position);
      rig.root.quaternion.copy(rotation);
      rig.mesh.skeleton.bones.forEach((bone, index) => bone.quaternion.copy(bones[index]));
      return {
        rig,
        position,
        rotation,
        bones,
        targetPosition,
        targetRotation,
        targetBones,
      };
    });
    paint(character);
    start = performance.now();
    host.dataset.target = target.keyCode || "rest";
    host.dataset.activeFingers = [target.hand && target.finger ? `${target.hand}-${target.finger}` : "", target.shiftHand ? `${target.shiftHand}-pinky` : ""].filter(Boolean).join(" ");
    requestFrame();
  }
  function resize() {
    const width = host.clientWidth,
      height = host.clientHeight;
    if (!width || !height) return;
    renderer.setSize(width, height, false);
    const view = compact.matches ? 0.34 : 0.415,
      halfHeight = (view * height) / width / 2;
    camera.left = -view / 2;
    camera.right = view / 2;
    camera.top = halfHeight;
    camera.bottom = -halfHeight;
    camera.position.set(-0.005, 0.68, 0.2);
    camera.lookAt(-0.005, 0.015, compact.matches ? 0.035 : 0.055);
    camera.updateProjectionMatrix();
    camera.updateMatrixWorld(true);
    labels.hidden = width >= 950;
    for (const [index, { mesh }] of keys.entries()) {
      const point = mesh.position.clone();
      point.y += 0.003;
      point.project(camera);
      keyLabels[index].style.left = `${((point.x + 1) * width) / 2}px`;
      keyLabels[index].style.top = `${((1 - point.y) * height) / 2}px`;
    }
    paint(current);
    host.dispatchEvent(new Event("projecthandsresize"));
    requestFrame();
  }
  const loader = new GLTFLoader();
  try {
    const assets = await Promise.all(
      (["left", "right"] as const).map(async (hand) => {
        const model = await loader.loadAsync(
          `/assets/projects-showtell/hands/${hand}.glb`,
        );
        return createHandRig(model.scene, hand);
      }),
    );
    for (const rig of assets) {
      const original = rig.mesh.material;
      (Array.isArray(original) ? original : [original]).forEach((material) =>
        material.dispose(),
      );
      const positions = rig.mesh.geometry.getAttribute("position"),
        fade = new Float32Array(positions.count),
        point = new Vector3();
      for (let index = 0; index < positions.count; index++) {
        rig.mesh.localToWorld(point.fromBufferAttribute(positions, index));
        const amount = Math.max(
          0,
          Math.min(1, (rig.root.position.z + 0.012 - point.z) / 0.04),
        );
        fade[index] = amount * amount * (3 - 2 * amount);
      }
      wristFades.set(rig, fade);
      rig.mesh.geometry.setAttribute(
        "color",
        new BufferAttribute(new Float32Array(positions.count * 4), 4),
      );
      rig.mesh.material = new MeshStandardMaterial({
        vertexColors: true,
        roughness: 0.8,
        transparent: true,
        depthWrite: false,
        depthFunc: EqualDepth,
      });
      const depth = rig.mesh.clone(false);
      depth.material = new MeshBasicMaterial({
        colorWrite: false,
        depthWrite: true,
        transparent: true,
      });
      depth.renderOrder = 2;
      depth.frustumCulled = false;
      rig.mesh.parent!.add(depth);
      rig.mesh.renderOrder = 3;
      rig.mesh.frustumCulled = false;
      rigs.push(rig);
      scene.add(rig.root);
    }
  } catch (error) {
    renderer.dispose();
    renderer.domElement.remove();
    labels.remove();
    throw error;
  }
  const observer = new ResizeObserver(resize);
  observer.observe(host);
  function stop() {
    cancelAnimationFrame(frame);
    frame = 0;
  }
  function motionChange() {
    stop();
  }
  reduced.addEventListener("change", motionChange);
  select();
  resize();
  host.dataset.ready = "true";
  return {
    select,
    supportPoint() {
      camera.updateMatrixWorld(true);
      const point = new Vector3(-0.137, -0.002, compact.matches ? -0.04884 : 0.047).project(camera);
      return {
        x: ((point.x + 1) * host.clientWidth) / 2,
        y: ((1 - point.y) * host.clientHeight) / 2,
      };
    },
    setVisible(next: boolean) {
      visible = next;
      if (!next) stop();
      else {
        select(current);
        requestFrame();
      }
    },
    dispose() {
      disposed = true;
      cancelAnimationFrame(frame);
      observer.disconnect();
      reduced.removeEventListener("change", motionChange);
      scene.traverse((object) => {
        if (object instanceof Mesh) {
          object.geometry.dispose();
          (Array.isArray(object.material)
            ? object.material
            : [object.material]
          ).forEach((material) => material.dispose());
        }
      });
      texture.dispose();
      renderer.dispose();
      renderer.domElement.remove();
      labels.remove();
    },
  };
}
