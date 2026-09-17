import { fingerGuideTarget } from "./project-hands/fingerGuide";

/** A live, compact reference to Tachyboard's typing session. */
const demo = document.querySelector<HTMLElement>("[data-typing-demo]");

if (demo) {
  const root = demo.closest<HTMLElement>("[data-showtell]")!;
  const field = demo.querySelector<HTMLElement>("[data-demo-field]")!;
  const flow = demo.querySelector<HTMLElement>("[data-demo-flow]")!;
  const manualFlow = demo.querySelector<HTMLElement>("[data-demo-manual]")!;
  const cursor = demo.querySelector<HTMLElement>("[data-demo-cursor]")!;
  const input = demo.querySelector<HTMLInputElement>("[data-demo-input]")!;
  const keyboard = demo.querySelector<HTMLElement>("[data-demo-keyboard]")!;
  const chars = [...flow.querySelectorAll<HTMLElement>(".demoChar")];
  const passage = [...(demo.dataset.passage || "")];
  const progress = demo.querySelector<HTMLElement>("[data-demo-progress]")!;
  const progressControl = progress.parentElement!;
  const cue = demo.querySelector<HTMLElement>("[data-demo-cue]")!;
  const state = demo.querySelector<HTMLElement>("[data-demo-state]")!;
  const reduced = matchMedia("(prefers-reduced-motion: reduce)");
  const targetWpm = 95;
  const keyInterval = Math.round(60000 / (targetWpm * 5));
  type Step = { index: number; key: string; kind: "type" | "error" | "delete"; delay: number };
  const steps: Step[] = [];
  const correction = (demo.dataset.passage || "").indexOf("curbs") + 2;
  passage.forEach((key, index) => {
    if (index === correction) steps.push({ index, key: "z", kind: "error", delay: 195 }, { index, key: "Backspace", kind: "delete", delay: 160 });
    steps.push({ index, key, kind: "type", delay: key === "\n" ? Math.round(keyInterval * 1.94) : /[.!?]/.test(key) ? Math.round(keyInterval * 1.35) : keyInterval - 16 + (index % 4) * 7 });
  });

  let step = 0;
  let completed = 0;
  let timer = 0;
  let visible = false;
  let manual = false;
  let failed = false;
  let loops = 0;
  type Spring = { p: number; v: number };
  const cursorAnimation: { x: Spring; y: Spring; flow: Spring } = {
    x: { p: 0, v: 0 },
    y: { p: 0, v: 0 },
    flow: { p: 0, v: 0 },
  };
  const cursorStretch: Spring = { p: 1, v: 0 };
  const cursorTarget = { x: 0, y: 0, flow: 0, ready: false };
  let cursorFrame = 0;
  let cursorLastFrame = 0;
  let cursorIdleTimer = 0;
  let cursorWidth = 0;

  function signal(key?: string) {
    root.dispatchEvent(new CustomEvent("projectdemokeystroke", { detail: { key } }));
  }

  function cueFor(key: string) {
    if (key === "Backspace") return "Delete · Right little finger";
    return fingerGuideTarget(key).cue;
  }

  function stepSpring(state: Spring, target: number, seconds: number, omega: number) {
    const duration = Math.min(seconds, .064);
    for (let step = 0; step < 2; step++) {
      const half = duration / 2;
      const acceleration = omega * omega * (target - state.p) - 2 * omega * state.v;
      state.v += acceleration * half;
      state.p += state.v * half;
    }
  }

  function paintCursor() {
    const x = cursorAnimation.x.p - ((cursorStretch.p - 1) * cursorWidth) / 2;
    cursor.style.transform = `translate3d(${x.toFixed(3)}px, ${cursorAnimation.y.p.toFixed(3)}px, 0) scaleX(${cursorStretch.p.toFixed(4)})`;
    flow.style.transform = `translate3d(0, ${(-cursorAnimation.flow.p).toFixed(3)}px, 0)`;
  }

  function stopCursor() {
    cancelAnimationFrame(cursorFrame);
    cursorFrame = 0;
    cursorLastFrame = 0;
    clearTimeout(cursorIdleTimer);
    cursor.classList.remove("idle");
  }

  function animateCursor(timestamp: number) {
    cursorFrame = 0;
    if (!visible || document.hidden || manual || reduced.matches || !cursorTarget.ready) return;
    const seconds = cursorLastFrame ? Math.min((timestamp - cursorLastFrame) / 1000, .064) : 0;
    cursorLastFrame = timestamp;
    if (seconds) {
      const largeMove = Math.abs(cursorTarget.x - cursorAnimation.x.p) > 1500 || Math.abs(cursorTarget.y - cursorAnimation.y.p) > 500;
      if (largeMove) {
        cursorAnimation.x = { p: cursorTarget.x, v: 0 };
        cursorAnimation.y = { p: cursorTarget.y, v: 0 };
        cursorAnimation.flow = { p: cursorTarget.flow, v: 0 };
      } else {
        stepSpring(cursorAnimation.x, cursorTarget.x, seconds, 26);
        stepSpring(cursorAnimation.y, cursorTarget.y, seconds, 26);
        stepSpring(cursorAnimation.flow, cursorTarget.flow, seconds, 26);
      }
      stepSpring(cursorStretch, 1 + Math.min(1.67, Math.abs(cursorAnimation.x.v) / 900), seconds, 18);
      paintCursor();
    }
    cursorFrame = requestAnimationFrame(animateCursor);
  }

  function ensureCursorAnimation() {
    if (!cursorFrame && visible && !document.hidden && !manual && !reduced.matches)
      cursorFrame = requestAnimationFrame(animateCursor);
  }

  function positionCursor(immediate = false) {
    requestAnimationFrame(() => {
      const current = chars[Math.min(completed, chars.length - 1)];
      if (!current) return;
      cursorTarget.x = current.offsetLeft;
      cursorTarget.y = current.offsetTop;
      cursorTarget.flow = 0;
      if (immediate || !cursorTarget.ready) {
        cursorAnimation.x = { p: cursorTarget.x, v: 0 };
        cursorAnimation.y = { p: cursorTarget.y, v: 0 };
        cursorAnimation.flow = { p: cursorTarget.flow, v: 0 };
        cursorStretch.p = 1;
        cursorStretch.v = 0;
        cursorWidth = cursor.offsetWidth || 3;
        paintCursor();
      }
      cursorTarget.ready = true;
      cursor.classList.remove("idle");
      clearTimeout(cursorIdleTimer);
      cursorIdleTimer = window.setTimeout(() => cursor.classList.add("idle"), 530);
      ensureCursorAnimation();
    });
  }

  function draw(immediate = false) {
    chars.forEach((char, index) => {
      char.textContent = passage[index];
      char.toggleAttribute("data-done", index < completed);
      char.toggleAttribute("data-current", index === completed);
      char.toggleAttribute("data-error", failed && index === completed);
      if (failed && index === completed) char.textContent = "z";
    });
    const value = Math.min(completed, passage.length);
    progress.style.width = `${(value / passage.length) * 100}%`;
    progressControl.setAttribute("aria-valuenow", String(value));
    progressControl.setAttribute("aria-valuetext", `${value} of ${passage.length} characters`);
    demo!.dataset.demoStep = String(step);
    positionCursor(immediate);
  }

  function renderManual() {
    stopCursor();
    manualFlow.textContent = input.value;
    demo!.dataset.manual = "true";
    state.textContent = "Live practice";
    progress.style.width = "0";
    progressControl.setAttribute("aria-valuenow", "0");
    progressControl.setAttribute("aria-valuetext", "Live practice");
  }

  function clear() {
    clearTimeout(timer);
    timer = 0;
    signal();
  }

  function schedule(delay = 260) {
    clearTimeout(timer);
    if (!visible || document.hidden || manual || reduced.matches) return;
    timer = window.setTimeout(tick, delay);
  }

  function tick() {
    if (!visible || document.hidden || manual || reduced.matches) return;
    if (step === steps.length) {
      step = 0;
      completed = 0;
      failed = false;
      loops++;
      demo!.dataset.demoLoops = String(loops);
      draw(true);
      signal();
      cue.textContent = "A · Left little finger · Right Shift";
      schedule(850);
      return;
    }
    const item = steps[step++];
    failed = item.kind === "error";
    completed = item.kind === "type" ? item.index + 1 : item.index;
    cue.textContent = cueFor(item.key);
    demo!.dataset.demoKey = item.key === "\n" ? "Enter" : item.key;
    signal(item.key);
    draw();
    schedule(item.delay);
  }

  function sync() {
    clear();
    if (reduced.matches) {
      stopCursor();
      manual = false;
      demo!.dataset.manual = "false";
      completed = 22;
      failed = false;
      state.textContent = "Fresh words";
      cue.textContent = "A · Left little finger · Right Shift";
      draw(true);
      return;
    }
    if (!manual) {
      state.textContent = "0 segments";
      demo!.dataset.manual = "false";
      schedule();
      ensureCursorAnimation();
    }
  }

  function beginManual() {
    if (reduced.matches) return;
    manual = true;
    clear();
    renderManual();
  }

  keyboard.tabIndex = 0;
  keyboard.setAttribute("aria-label", "Start typing in the Tachyboard sample");
  field.addEventListener("click", () => input.focus());
  keyboard.addEventListener("click", () => input.focus());
  keyboard.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      input.focus();
    }
  });
  input.addEventListener("focus", beginManual);
  input.addEventListener("input", renderManual);
  input.addEventListener("keydown", (event) => {
    if (event.metaKey || event.ctrlKey || event.altKey || event.key === "Tab") return;
    beginManual();
    if (event.key === "Enter") event.preventDefault();
    signal(event.key);
    cue.textContent = cueFor(event.key);
  });
  demo.addEventListener("focusout", () => {
    window.setTimeout(() => {
    if (!manual || demo.contains(document.activeElement)) return;
    manual = false;
    step = 0;
    completed = 0;
    failed = false;
    input.value = "";
    draw(true);
    sync();
    }, 0);
  });

  const observer = new IntersectionObserver((entries) => {
    visible = entries[0].isIntersecting;
    if (!visible) stopCursor();
    sync();
  }, { threshold: 0.08 });
  observer.observe(demo);
  reduced.addEventListener("change", () => { step = 0; completed = 0; stopCursor(); sync(); });
  document.addEventListener("visibilitychange", () => { if (document.hidden) stopCursor(); sync(); });
  window.addEventListener("resize", () => draw(true));
  window.addEventListener("pageshow", sync);
  window.addEventListener("pagehide", () => { clear(); stopCursor(); });
  draw(true);
  sync();
}
