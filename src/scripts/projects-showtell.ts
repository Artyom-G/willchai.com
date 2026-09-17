import atlas from "../data/projects-will-frames.json";
import poster from "../data/projects-hands-poster.json";
type Pose = keyof typeof atlas.frames;
type Step = {
  pose?: Pose;
  duration: number;
  action?: "pull" | "open" | "hold" | "place" | "hop";
  prop?: string;
  support?: "hadal";
};
type Point = { x: number; y: number };

function startProjects(root: HTMLElement) {
  const scenes = [...root.querySelectorAll<HTMLElement>("[data-scene]")];
  const actor = root.querySelector<HTMLElement>("[data-guide]")!;
  const sprite = root.querySelector<HTMLElement>("[data-guide-sprite]")!;
  const prop = root.querySelector<HTMLImageElement>("[data-guide-prop]")!;
  const bubble = root.querySelector<HTMLElement>("[data-guide-bubble]")!;
  const speech = root.querySelector<HTMLElement>("[data-guide-speech]")!;
  const toggle = root.querySelector<HTMLButtonElement>("[data-guide-toggle]")!;
  const reduced = matchMedia("(prefers-reduced-motion: reduce)");
  const travelDuration = Number.parseFloat(getComputedStyle(root).getPropertyValue("--wc-duration-show-hop")) || 780;
  const completed = new Set<HTMLElement>();
  let current = scenes[0],
    feet: Point = { x: 0, y: 0 },
    enabled = true;
  let released: HTMLImageElement[] = [];
  let task = new AbortController(),
    animations: Animation[] = [],
    scrollFrame = 0,
    idleTimer = 0,
    speechTimer = 0;
  const speechDuration = 4600;
  let lastScroll = scrollY,
    busy = false,
    selected = "",
    hadal = false;
  let hands:
    | Awaited<
        ReturnType<typeof import("./project-hands/scene").createProjectHands>
      >
    | undefined;
  const handsHost = root.querySelector<HTMLElement>("[data-hands]")!;
  const jumpButton = root.querySelector<HTMLButtonElement>("[data-guide-jump]")!;
  let latestKey: string | undefined,
    releaseTimer = 0,
    handVisible = false,
    handLoading = false;
  const sea = scenes.find((scene) => scene.dataset.scene === "conspirasea")!;
  const crew = [...sea.querySelectorAll<HTMLButtonElement>("[data-character]")];
  let roleTarget: HTMLButtonElement | undefined;
  let queuedRole: HTMLButtonElement | undefined;
  let hoveredControl: HTMLElement | undefined;
  function activeControl() {
    const control = current.querySelector<HTMLElement>("[data-primary]");
    return control && (hoveredControl === control || control === document.activeElement) ? control : undefined;
  }
  function presentControl() {
    const control = activeControl();
    if (!control || !enabled || busy) return;
    const target = control.getBoundingClientRect(), origin = root.getBoundingClientRect();
    const below = target.top > feet.y + origin.top - actor.clientHeight * .3;
    setPose(current === sea && selected ? selected === "scylla" ? "strain" : "hold" : below ? "point_down" : "point");
    sprite.style.transform = target.left + target.width / 2 < feet.x + origin.left && !selected ? "scaleX(-1)" : "";
    clearTimeout(idleTimer);
  }

  function setPose(next: Pose) {
    const frame = atlas.frames[next];
    sprite.style.backgroundSize = `${Object.keys(atlas.frames).length * 100}% 100%`;
    sprite.style.backgroundPosition = `${(frame.index / (Object.keys(atlas.frames).length - 1)) * 100}% 0`;
    actor.dataset.pose = next;
    const scale = actor.clientWidth / 32;
    prop.style.left = `${frame.prop[0] * scale}px`;
    prop.style.top = `${frame.prop[1] * scale}px`;
    position(feet);
  }
  function position(point: Point) {
    feet = point;
    const scale = actor.clientWidth / 32;
    const frame = atlas.frames[(actor.dataset.pose as Pose) || "rest"];
    const footX = (frame.feet[0][0] + frame.feet[1][0]) / 2,
      footY = Math.max(frame.feet[0][1], frame.feet[1][1]);
    actor.style.transform = `translate(${Math.round(point.x - footX * scale)}px,${Math.round(point.y - footY * scale)}px)`;
    actor.dataset.footX = String(point.x);
    actor.dataset.footY = String(point.y);
    const left = point.x - footX * scale;
    if (bubble.hidden) return;
    const width = bubble.offsetWidth;
    const right = left + 23 * scale + 8;
    const before = left + 9 * scale - width - 8;
    let bubbleLeft: number;
    if (current === sea && before >= 8) {
      bubble.dataset.side = "left";
      bubbleLeft = before;
    } else if (right + width <= root.clientWidth - 8) {
      bubble.dataset.side = "right";
      bubbleLeft = right;
    } else if (before >= 8) {
      bubble.dataset.side = "left";
      bubbleLeft = before;
    } else {
      bubble.dataset.side = "above";
      bubbleLeft = Math.max(8, Math.min(point.x - width / 2, root.clientWidth - width - 8));
    }
    bubble.style.top = `${bubble.dataset.side === "above" ? 4 * scale - bubble.offsetHeight - 8 : 4 * scale}px`;
    bubble.style.bottom = "auto";
    bubble.style.left = `${bubbleLeft - left}px`;
    bubble.style.right = "auto";
    bubble.style.setProperty("--tail-left", `${Math.max(12, Math.min(width - 22, point.x - bubbleLeft))}px`);
  }
  function support(scene = current, onHadal = hadal): Point {
    if (scene === sea && roleTarget) {
      const card = roleTarget.querySelector<HTMLElement>(".crewArt")!;
      const rect = card.getBoundingClientRect();
      const base = root.getBoundingClientRect();
      return {
        x: rect.left - base.left + rect.width / 2,
        y: rect.top - base.top,
      };
    }
    const pin = scene.querySelector<HTMLElement>(
      onHadal && scene === sea ? "[data-hadal-support]" : "[data-support]",
    );
    if (!pin) return feet;
    const base = root.getBoundingClientRect();
    if (scene.dataset.scene === "tachyboard") {
      const rect = handsHost.getBoundingClientRect();
      if (hands) {
        const point = hands.supportPoint();
        return {
          x: rect.left - base.left + point.x,
          y: rect.top - base.top + point.y,
        };
      }
      const still = innerWidth <= 600 ? poster.mobile : poster;
      const scale = Math.min(
        rect.width / still.width,
        rect.height / still.height,
      );
      return {
        x:
          rect.left -
          base.left +
          (rect.width - still.width * scale) / 2 +
          still.support.x * scale,
        y:
          rect.top -
          base.top +
          (rect.height - still.height * scale) / 2 +
          still.support.y * scale,
      };
    }
    pin.style.left = `${Number(innerWidth < 600 && pin.dataset.mobileX ? pin.dataset.mobileX : pin.dataset.x) * 100}%`;
    pin.style.top = `${Number(pin.dataset.y) * 100}%`;
    const rect = pin.getBoundingClientRect();
    return { x: rect.left - base.left, y: rect.top - base.top };
  }
  function speak(text = current.dataset.speech || "") {
    clearTimeout(speechTimer);
    speech.textContent = text;
    bubble.hidden = !text || !enabled;
    position(feet);
    speechTimer = window.setTimeout(() => (bubble.hidden = true), speechDuration);
  }
  function showProp(name: string) {
    const source = roleTarget?.dataset.roleCard || sea.querySelector<HTMLButtonElement>(`[data-character="${name}"]`)?.dataset.roleCard;
    prop.src = source || `/assets/projects-v3/${name}.webp`;
    prop.hidden = false;
    prop.dataset.character = name;
  }
  function placeProp(name: string, duration: number) {
    const target = sea.querySelector<HTMLElement>(
      `[data-character="${name}"]`,
    )!;
    if (reduced.matches || !enabled) {
      prop.hidden = true;
      target.querySelector<HTMLImageElement>("img")!.style.visibility = "visible";
      return;
    }
    const image = prop.cloneNode() as HTMLImageElement,
      from = prop.getBoundingClientRect(),
      to = target.querySelector("img")!.getBoundingClientRect(),
      base = root.getBoundingClientRect();
    image.removeAttribute("data-guide-prop");
    image.className = "releasedProp";
    image.hidden = false;
    image.style.cssText = `position:absolute;z-index:6;left:0;top:0;width:${from.width}px;height:${from.height}px;object-fit:contain;pointer-events:none;transform-origin:0 0;`;
    root.append(image);
    released.push(image);
    prop.hidden = true;
    const scale = Math.min(to.width / from.width, to.height / from.height),
      x = to.left - base.left + (to.width - from.width * scale) / 2,
      y = to.top - base.top + (to.height - from.height * scale) / 2;
    const animation = image.animate(
      [
        {
          transform: `translate(${from.left - base.left}px,${from.top - base.top}px) scale(1)`,
        },
        { transform: `translate(${x}px,${y}px) scale(${scale})` },
      ],
      { duration, easing: "cubic-bezier(.4,0,.8,1)", fill: "forwards" },
    );
    animations.push(animation);
    void animation.finished
      .then(() => {
        image.remove();
        released = released.filter((item) => item !== image);
        target.querySelector<HTMLImageElement>("img")!.style.visibility = "visible";
      })
      .catch(() => image.remove());
  }
  function settle(scene: HTMLElement) {
    completed.add(scene);
    scene.dataset.complete = "true";
    if (scene === sea) delete scene.dataset.dealing;
    scene
      .querySelector<HTMLElement>("[data-magazine]")
      ?.setAttribute("data-open", "true");
    scene
      .querySelectorAll<HTMLElement>("[data-character]")
      .forEach((button) => { button.style.visibility = ""; button.querySelector<HTMLImageElement>("img")!.style.visibility = ""; });
  }
  function cancel() {
    task.abort();
    task = new AbortController();
    sprite.style.transform = "";
    animations.forEach((animation) => animation.cancel());
    animations = [];
    released.forEach((image) => image.remove());
    released = [];
    clearTimeout(idleTimer);
    clearTimeout(speechTimer);
    bubble.hidden = true;
    busy = false;
    queuedRole = undefined;
    prop.hidden = true;
    if (current) settle(current);
  }
  function wait(ms: number, signal: AbortSignal) {
    return new Promise<void>((resolve, reject) => {
      if (signal.aborted) {
        reject(new DOMException("Cancelled", "AbortError"));
        return;
      }
      const abort = () => {
        clearTimeout(timer);
        reject(new DOMException("Cancelled", "AbortError"));
      };
      const timer = window.setTimeout(() => {
        signal.removeEventListener("abort", abort);
        resolve();
      }, ms);
      signal.addEventListener("abort", abort, { once: true });
    });
  }
  function hop(
    destination: () => Point,
    duration: number,
    signal: AbortSignal,
  ) {
    if (reduced.matches || !enabled) {
      position(destination());
      return Promise.resolve();
    }
    const from = { ...feet };
    setPose("crouch");
    return new Promise<void>((resolve, reject) => {
      let frame = 0;
      const start = performance.now();
      const abort = () => {
        cancelAnimationFrame(frame);
        reject(new DOMException("Cancelled", "AbortError"));
      };
      signal.addEventListener("abort", abort, { once: true });
      function tick(now: number) {
        if (signal.aborted) return;
        const t = Math.min(1, (now - start) / duration),
          to = destination();
        if (t < 0.13) {
          setPose("crouch");
          position(from);
        } else if (t > 0.86) {
          setPose("land");
          position(to);
        } else {
          const u = (t - 0.13) / 0.73;
          setPose(u < 0.18 ? "launch" : "air");
          position({
            x: from.x + (to.x - from.x) * u,
            y:
              from.y +
              (to.y - from.y) * u -
              Math.sin(u * Math.PI) *
                Math.min(180, 80 + Math.abs(to.x - from.x) * 0.14),
          });
        }
        if (t < 1) frame = requestAnimationFrame(tick);
        else {
          signal.removeEventListener("abort", abort);
          setPose("rest");
          position(to);
          resolve();
        }
      }
      frame = requestAnimationFrame(tick);
    });
  }
  async function performSeaEntrance(signal: AbortSignal) {
    busy = true;
    sea.dataset.dealing = "true";
    for (const [index, button] of crew.entries()) {
      if (signal.aborted) return;
      roleTarget = button;
      selected = button.dataset.character || "";
      button.querySelector<HTMLImageElement>("img")!.style.visibility = "hidden";
      if (index) await hop(() => support(sea), 420, signal);
      setPose(index === crew.length - 1 ? "lift" : "hold");
      showProp(selected);
      await wait(index === crew.length - 1 ? 620 : 420, signal);
      placeProp(selected, 220);
      await wait(220, signal);
    }
    const finalLanding = support(sea);
    selected = "";
    roleTarget = undefined;
    settle(sea);
    busy = false;
    prop.hidden = true;
    setPose("rest");
    position(finalLanding);
    speak();
    scheduleIdle();
    drainQueuedRole();
  }
  async function perform(scene: HTMLElement, signal: AbortSignal) {
    if (scene === sea) {
      await performSeaEntrance(signal);
      return;
    }
    busy = true;
    const steps: Step[] = JSON.parse(scene.dataset.entrance || "[]");
    speak();
    for (const step of steps) {
      if (signal.aborted) return;
      if (step.pose) setPose(step.pose);
      if (step.action === "pull") {
        const object = scene.querySelector<HTMLElement>("[data-scene-object]")!;
        const animation = object.animate(
          [
            { transform: "translateX(34px) rotate(1deg)" },
            { transform: "translateX(0) rotate(0)" },
          ],
          { duration: step.duration, easing: "cubic-bezier(.22,1,.36,1)" },
        );
        animations.push(animation);
        const follow = () => {
          if (signal.aborted || animation.playState !== "running") return;
          position(support());
          requestAnimationFrame(follow);
        };
        requestAnimationFrame(follow);
      }
      if (step.action === "open")
        scene.querySelector<HTMLElement>("[data-magazine]")!.dataset.open =
          "true";
      if (step.action === "hold" && step.prop) showProp(step.prop);
      if (step.action === "place" && step.prop)
        placeProp(step.prop, step.duration);
      if (step.action === "hop") {
        hadal = step.support === "hadal";
        await hop(() => support(scene), step.duration, signal);
      } else await wait(step.duration, signal);
    }
    settle(scene);
    busy = false;
    prop.hidden = true;
    restoreInspection();
    position(support());
    scheduleIdle();
  }
  function restoreInspection() {
    sprite.style.transform = "";
    if (current === sea && selected && roleTarget) {
      setPose("hold");
      showProp(selected);
    } else {
      prop.hidden = true;
      setPose("rest");
    }
    presentControl();
  }
  function returnToSupport(scene = current) {
    actor.hidden = !enabled;
    actor.dataset.scene = scene.dataset.scene;
    const landing = support(scene);
    position(landing);
    return landing;
  }
  function scheduleIdle() {
    clearTimeout(idleTimer);
    if (!enabled || reduced.matches || document.hidden || busy || activeControl()) return;
    const signal = task.signal;
    idleTimer = window.setTimeout(async () => {
      if (
        current.getBoundingClientRect().bottom <= 0 ||
        current.getBoundingClientRect().top >= innerHeight
      )
        return;
      if (!(current === sea && selected)) {
        try {
          setPose("blink");
          await wait(130, signal);
          setPose("shift");
          await wait(240, signal);
          restoreInspection();
        } catch {
          return;
        }
      }
      scheduleIdle();
    }, 8000);
  }
  async function activate(scene: HTMLElement, immediate = false) {
    if (current === scene && !immediate) return;
    const changedScene = current !== scene;
    cancel();
    current = scene;
    hadal = false;
    actor.dataset.scene = scene.dataset.scene;
    const signal = task.signal;
    busy = true;
    try {
      if (immediate || reduced.matches || !enabled) position(support());
      else await hop(() => support(), travelDuration, signal);
      if (!enabled || reduced.matches) {
        settle(scene);
        busy = false;
        restoreInspection();
        return;
      }
      if (!completed.has(scene)) await perform(scene, signal);
      else {
        busy = false;
        restoreInspection();
        if (changedScene) speak();
        scheduleIdle();
      }
    } catch (error) {
      if (!(error instanceof DOMException && error.name === "AbortError"))
        console.error(error);
    } finally {
      if (signal !== task.signal || !busy) return;
      busy = false;
      returnToSupport(scene);
      restoreInspection();
      scheduleIdle();
    }
  }
  function activeFromViewport() {
    if (scrollY < 70) return scenes[0];
    const line = innerHeight * 0.47;
    return (
      scenes.find((scene) => {
        const r = scene.getBoundingClientRect();
        return r.top <= line && r.bottom > line;
      }) ||
      scenes.reduce(
        (best, scene) =>
          Math.abs(scene.getBoundingClientRect().top - line) <
          Math.abs(best.getBoundingClientRect().top - line)
            ? scene
            : best,
        scenes[0],
      )
    );
  }
  function onScroll() {
    if (scrollFrame) return;
    scrollFrame = requestAnimationFrame(() => {
      scrollFrame = 0;
      const distance = Math.abs(scrollY - lastScroll);
      lastScroll = scrollY;
      const scene = activeFromViewport();
      if (scene !== current) void activate(scene, distance > innerHeight * 0.9);
    });
  }
  function reflow() {
    if (!enabled) return;
    cancel();
    hadal = false;
    position(support());
    restoreInspection();
    scheduleIdle();
  }
  toggle.hidden = false;
  toggle.addEventListener("click", () => {
    enabled = !enabled;
    actor.hidden = !enabled;
    root.dataset.guideHidden = String(!enabled);
    toggle.setAttribute("aria-pressed", String(enabled));
    toggle.textContent = enabled ? "Hide Will" : "Show Will";
    cancel();
    scenes.forEach(settle);
    if (enabled) {
      position(support());
      restoreInspection();
      scheduleIdle();
    }
  });
  for (const scene of scenes) {
    const control = scene.querySelector<HTMLElement>("[data-primary]");
    const leave = () => {
      if (current === scene && !busy) {
        restoreInspection();
        scheduleIdle();
      }
    };
    control?.addEventListener("pointerenter", () => {
      hoveredControl = control;
      presentControl();
    });
    control?.addEventListener("pointerleave", () => {
      if (hoveredControl === control) hoveredControl = undefined;
      leave();
    });
    control?.addEventListener("focus", () => {
      if (current !== scene) void activate(scene, true);
      presentControl();
    });
    control?.addEventListener("blur", leave);
  }
  async function presentRole(button: HTMLButtonElement) {
    const character = button.dataset.character || "";
    if (!enabled) {
      selected = character;
      roleTarget = button;
      crew.forEach((item) =>
        item.setAttribute("aria-pressed", String(item === button)),
      );
      return;
    }
    if (current === sea && roleTarget === button && selected === character) {
      if (!busy) restoreInspection();
      return;
    }
    if (current === sea && busy) {
      queuedRole = button;
      return;
    }
    const standingCard = current === sea ? roleTarget : undefined;
    cancel();
    if (standingCard) {
      roleTarget = standingCard;
      position(support(sea));
    }
    current = sea;
    actor.dataset.scene = "conspirasea";
    selected = character;
    roleTarget = button;
    crew.forEach((item) =>
      item.setAttribute("aria-pressed", String(item === button)),
    );
    const signal = task.signal;
    busy = true;
    try {
      if (reduced.matches) position(support(sea));
      else await hop(() => support(sea), 460, signal);
      if (signal.aborted) return;
      busy = false;
      restoreInspection();
      scheduleIdle();
      drainQueuedRole();
    } catch {}
  }
  function drainQueuedRole() {
    const next = queuedRole;
    queuedRole = undefined;
    if (!next || current !== sea || !enabled || next === roleTarget) return;
    void presentRole(next);
  }
  crew.forEach((button) => {
    button.addEventListener("pointerenter", () => void presentRole(button));
    button.addEventListener("focus", () => void presentRole(button));
    button.addEventListener("click", () => void presentRole(button));
  });
  sea.addEventListener("conspirasearoleschange", () => {
    queuedRole = undefined;
    cancel();
    selected = "";
    roleTarget = undefined;
    crew.forEach((button) => button.setAttribute("aria-pressed", "false"));
    if (current === sea) {
      position(support(sea));
      setPose("rest");
      settle(sea);
      scheduleIdle();
    }
  });
  root.addEventListener("focusin", (event) => {
    const scene = (event.target as HTMLElement).closest<HTMLElement>(
      "[data-scene]",
    );
    if (scene && scenes.includes(scene) && current !== scene) void activate(scene, true);
  });
  function input(character?: string) {
    latestKey = character;
    hands?.select(character);
    clearTimeout(releaseTimer);
    releaseTimer = window.setTimeout(() => hands?.select(), 230);
  }
  root.addEventListener("projectdemokeystroke", (event) => {
    input((event as CustomEvent<{key?: string}>).detail?.key);
  });
  const guideRest = () => {
    if (!enabled || busy) return;
    actor.dataset.guideHover = "false";
    restoreInspection();
    scheduleIdle();
  };
  jumpButton.addEventListener("pointerenter", () => {
    if (!enabled || busy) return;
    actor.dataset.guideHover = "true";
    clearTimeout(idleTimer);
    setPose("wave");
  });
  jumpButton.addEventListener("pointerleave", guideRest);
  jumpButton.addEventListener("focus", () => {
    if (!enabled || busy) return;
    actor.dataset.guideHover = "true";
    clearTimeout(idleTimer);
    setPose("wave");
  });
  jumpButton.addEventListener("blur", guideRest);
  jumpButton.addEventListener("click", async () => {
    if (!enabled || busy) return;
    const scene = activeFromViewport();
    cancel();
    current = scene;
    hadal = false;
    actor.dataset.scene = scene.dataset.scene;
    actor.hidden = false;
    const landing = returnToSupport(scene);
    restoreInspection();
    const signal = task.signal;
    busy = true;
    try {
      if (reduced.matches) {
        setPose("wave");
        await wait(350, signal);
      } else await hop(() => landing, travelDuration, signal);
    } catch (error) {
      if (!(error instanceof DOMException && error.name === "AbortError"))
        console.error(error);
    } finally {
      if (signal !== task.signal) return;
      busy = false;
      returnToSupport(scene);
      restoreInspection();
      scheduleIdle();
    }
  });
  const loader = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting && !handLoading) {
          handLoading = true;
          void import("./project-hands/scene")
            .then((module) => module.createProjectHands(handsHost))
            .then((scene) => {
              hands = scene;
              scene.setVisible(handVisible && !document.hidden);
              scene.select(latestKey);
              if (current.dataset.scene === "tachyboard") reflow();
              if (latestKey)
                releaseTimer = window.setTimeout(() => scene.select(), 350);
            })
            .catch((error) => {
              handsHost.dataset.error = "true";
              handsHost.setAttribute("aria-label", "A still preview of the Tachyboard keyboard");
              console.error("Finger guide preview unavailable", error);
            });
        }
      }
    },
    { rootMargin: "350px" },
  );
  loader.observe(handsHost);
  const visibility = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      handVisible = entry.isIntersecting;
      hands?.setVisible(handVisible && !document.hidden);
    }
  });
  visibility.observe(handsHost);
  handsHost.addEventListener("projecthandsresize", () => {
    if (current.dataset.scene === "tachyboard") reflow();
  });
  const resize = new ResizeObserver(() => reflow());
  scenes.forEach((scene) => resize.observe(scene));
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("scrollend", () => {
    const scene = activeFromViewport();
    if (scene !== current) void activate(scene, true);
  }, { passive: true });
  window.addEventListener("resize", reflow);
  window.visualViewport?.addEventListener("resize", reflow);
  window.addEventListener(
    "hashchange",
    () => void activate(activeFromViewport(), true),
  );
  window.addEventListener("pageshow", () => {
    hands?.setVisible(handVisible && !document.hidden);
    void activate(activeFromViewport(), true);
  });
  document.addEventListener("visibilitychange", () => {
    hands?.setVisible(handVisible && !document.hidden);
    if (document.hidden) {
      cancel();
      position(support());
      restoreInspection();
    } else scheduleIdle();
  });
  reduced.addEventListener("change", () => {
    if (reduced.matches) scenes.forEach(settle);
    reflow();
  });
  window.addEventListener("pagehide", (event) => {
    cancel();
    hands?.setVisible(false);
    if (!event.persisted) {
      hands?.dispose();
      loader.disconnect();
      visibility.disconnect();
      resize.disconnect();
    }
  });
  const image = new Image();
  image.src = "/assets/projects-v3/will-host.png";
  void Promise.all([document.fonts.ready, image.decode().catch(() => {})]).then(
    () => {
      const navigation = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming | undefined;
      let anchor: HTMLElement | null = null;
      try { anchor = document.getElementById(decodeURIComponent(location.hash.slice(1))); } catch {}
      if (navigation?.type === "navigate" && anchor && scenes.includes(anchor))
        anchor.scrollIntoView({ block: "start", behavior: "instant" });
      actor.hidden = !enabled;
      current = activeFromViewport();
      hadal = false;
      actor.dataset.scene = current.dataset.scene;
      position(support());
      if (reduced.matches) {
        scenes.forEach(settle);
        restoreInspection();
      } else void perform(current, task.signal).catch(() => {});
    },
  );
}
const root = document.querySelector<HTMLElement>("[data-showtell]");
if (root) startProjects(root);
