const portraitSwitcher = document.querySelector("[data-portrait-switcher]");

if (portraitSwitcher) {
  const portraits = [...portraitSwitcher.querySelectorAll("[data-portrait]")];
  let portraitIndex = 0;

  const setPortraitRatio = (portrait) => {
    const width = Number(portrait.getAttribute("width")) || portrait.naturalWidth || 1;
    const height = Number(portrait.getAttribute("height")) || portrait.naturalHeight || 1;
    portraitSwitcher.style.setProperty("--portrait-ratio", `${width} / ${height}`);
  };

  setPortraitRatio(portraits[portraitIndex]);

  portraitSwitcher.addEventListener("click", () => {
    portraitIndex = (portraitIndex + 1) % portraits.length;
    setPortraitRatio(portraits[portraitIndex]);
    portraits.forEach((portrait, index) => {
      portrait.classList.toggle("is-visible", index === portraitIndex);
    });
    portraitSwitcher.setAttribute(
      "aria-label",
      portraitIndex === portraits.length - 1
        ? "Show Will's formal portrait"
        : "Show another portrait of Will",
    );
  });
}

const projectLinks = document.querySelectorAll(".project-panel .panel-link");
const hasFinePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const slowUpdate = window.matchMedia("(update: slow)");

const vertexShaderSource = `
  attribute vec2 a_position;
  varying vec2 v_uv;

  void main() {
    v_uv = a_position * 0.5 + 0.5;
    gl_Position = vec4(a_position, 0.0, 1.0);
  }
`;

const fragmentShaderSource = `
  precision highp float;

  varying vec2 v_uv;
  uniform sampler2D u_scene;
  uniform sampler2D u_label;
  uniform vec2 u_resolution;
  uniform vec2 u_center;
  uniform float u_horizon;
  uniform float u_tilt;
  uniform float u_reveal;

  const float PI = 3.141592653589793;

  mat2 rotate2d(float angle) {
    float sine = sin(angle);
    float cosine = cos(angle);
    return mat2(cosine, -sine, sine, cosine);
  }

  float gaussian(float value, float center, float width) {
    float offset = (value - center) / width;
    return exp(-(offset * offset));
  }

  void main() {
    vec2 aspect = vec2(u_resolution.x / u_resolution.y, 1.0);
    vec2 point = (v_uv - u_center) * aspect;
    float distanceToCenter = length(point);
    float horizon = u_horizon * mix(0.72, 1.0, u_reveal);
    float field = horizon * 4.45;
    float fieldMask = 1.0 - smoothstep(field * 0.68, field, distanceToCenter);
    float visibleMask = fieldMask * smoothstep(0.0, 0.72, u_reveal);

    if (visibleMask < 0.001) {
      gl_FragColor = vec4(0.0);
      return;
    }

    vec2 direction = point / max(distanceToCenter, 0.0001);
    float pull = 1.0 - smoothstep(horizon * 1.02, field, distanceToCenter);
    float denominator = max(distanceToCenter - horizon * 0.72, horizon * 0.2);
    float deflection = (horizon * horizon * 0.56 / denominator) * pull * u_reveal;
    float sourceRadius = distanceToCenter + deflection;
    float frameDrag = u_tilt * pull * 0.085;
    vec2 warpedPoint = rotate2d(frameDrag) * direction * sourceRadius;
    vec2 warpedUv = u_center + warpedPoint / aspect;
    warpedUv = clamp(warpedUv, vec2(0.001), vec2(0.999));

    vec3 warpedScene = texture2D(u_scene, warpedUv).rgb;

    float normalizedRadius = distanceToCenter / horizon;
    float gravityShade = smoothstep(0.88, 1.65, normalizedRadius);
    vec3 color = warpedScene * mix(0.42, 1.0, gravityShade);

    vec2 diskPoint = rotate2d(-u_tilt) * point;
    float diskRadius = length(vec2(diskPoint.x, diskPoint.y * 7.6)) / horizon;
    float diskBand = gaussian(diskRadius, 1.62, 0.055);
    float diskHaze = gaussian(diskRadius, 1.64, 0.2) * 0.08;
    float diskCutout = smoothstep(1.01, 1.12, normalizedRadius);
    float streaks = 0.78 + 0.22 * sin(diskPoint.x / horizon * 43.0 + diskPoint.y / horizon * 8.0);
    float doppler = mix(0.46, 1.0, smoothstep(-1.8, 1.8, diskPoint.x / horizon));
    float disk = (diskBand * streaks + diskHaze) * diskCutout * doppler * u_reveal;
    vec3 diskColor = mix(vec3(1.0, 0.43, 0.12), vec3(1.0, 0.94, 0.78), doppler);
    color += diskColor * disk * 0.42;

    float eventHorizon = 1.0 - smoothstep(0.91, 1.025, normalizedRadius);
    color = mix(color, vec3(0.0), eventHorizon);

    vec2 labelPoint = rotate2d(-u_tilt * 0.12) * point;
    vec2 labelUv = labelPoint / vec2(horizon * 1.46, horizon * 0.46) * 0.5 + 0.5;
    float labelBounds = step(0.0, labelUv.x) * step(labelUv.x, 1.0) *
      step(0.0, labelUv.y) * step(labelUv.y, 1.0);
    float labelCurve = pow(abs(labelUv.x - 0.5) * 2.0, 2.0);
    labelUv.y += labelCurve * 0.055 * u_reveal;
    labelUv.x += (labelUv.x - 0.5) * abs(labelUv.y - 0.5) * 0.035 * u_reveal;
    vec4 label = texture2D(u_label, clamp(labelUv, 0.0, 1.0));
    float labelMask = label.a * labelBounds * eventHorizon * u_reveal * u_reveal;
    color = mix(color, label.rgb * 0.9, labelMask);

    gl_FragColor = vec4(color, visibleMask);
  }
`;

const clamp = (value, minimum, maximum) => Math.min(Math.max(value, minimum), maximum);
const snapshotCache = new WeakMap();

const waitForImage = async (image) => {
  if (image.complete && image.naturalWidth > 0) return;

  try {
    await Promise.race([
      image.decode(),
      new Promise((resolve) => window.setTimeout(resolve, 450)),
    ]);
  } catch {
    // A missing decorative image should not block the link or the interaction.
  }
};

const drawCoverImage = (context, image, width, height) => {
  if (!image.naturalWidth || !image.naturalHeight) return;

  const scale = Math.max(width / image.naturalWidth, height / image.naturalHeight);
  const renderedWidth = image.naturalWidth * scale;
  const renderedHeight = image.naturalHeight * scale;
  const objectPosition = window.getComputedStyle(image).objectPosition.split(" ");
  const positionX = Number.parseFloat(objectPosition[0]) / 100 || 0.5;
  const positionY = Number.parseFloat(objectPosition[1] || objectPosition[0]) / 100 || 0.5;
  const x = (width - renderedWidth) * positionX;
  const y = (height - renderedHeight) * positionY;

  context.drawImage(image, x, y, renderedWidth, renderedHeight);
};

const makePanelSnapshot = async (projectLink, bounds, renderScale) => {
  const cacheKey = `${Math.round(bounds.width)}x${Math.round(bounds.height)}@${renderScale}`;
  const cached = snapshotCache.get(projectLink);
  if (cached?.key === cacheKey) return cached.canvas;

  const images = [...projectLink.querySelectorAll("img")];
  await Promise.all(images.map(waitForImage));

  const snapshot = document.createElement("canvas");
  snapshot.width = Math.max(1, Math.round(bounds.width * renderScale));
  snapshot.height = Math.max(1, Math.round(bounds.height * renderScale));
  const context = snapshot.getContext("2d", { alpha: false });
  context.scale(renderScale, renderScale);

  const panel = projectLink.closest(".project-panel");
  context.fillStyle = window.getComputedStyle(panel).backgroundColor || "#111317";
  context.fillRect(0, 0, bounds.width, bounds.height);

  const coverImage = projectLink.querySelector(".panel-image");
  if (coverImage) drawCoverImage(context, coverImage, bounds.width, bounds.height);

  projectLink.querySelectorAll(".film-poster").forEach((poster) => {
    if (!poster.naturalWidth) return;
    const posterBounds = poster.getBoundingClientRect();
    context.drawImage(
      poster,
      posterBounds.left - bounds.left,
      posterBounds.top - bounds.top,
      posterBounds.width,
      posterBounds.height,
    );
  });

  const shade = projectLink.querySelector(".panel-shade");
  if (shade) {
    context.fillStyle = window.getComputedStyle(shade).backgroundColor;
    context.fillRect(0, 0, bounds.width, bounds.height);
  }

  snapshotCache.set(projectLink, { key: cacheKey, canvas: snapshot });
  return snapshot;
};

class BlackHoleRenderer {
  constructor() {
    this.canvas = document.createElement("canvas");
    this.canvas.className = "black-hole-canvas";
    this.canvas.setAttribute("aria-hidden", "true");
    this.renderScale = Math.min(window.devicePixelRatio || 1, hasFinePointer.matches ? 1.35 : 1);
    this.sceneToken = 0;
    this.ready = false;
    this.available = false;

    const gl = this.canvas.getContext("webgl", {
      alpha: true,
      antialias: false,
      depth: false,
      stencil: false,
      premultipliedAlpha: false,
      preserveDrawingBuffer: false,
      powerPreference: "low-power",
    });

    if (!gl) return;

    try {
      this.gl = gl;
      this.program = this.createProgram(vertexShaderSource, fragmentShaderSource);
      this.positionLocation = gl.getAttribLocation(this.program, "a_position");
      this.uniforms = {
        scene: gl.getUniformLocation(this.program, "u_scene"),
        label: gl.getUniformLocation(this.program, "u_label"),
        resolution: gl.getUniformLocation(this.program, "u_resolution"),
        center: gl.getUniformLocation(this.program, "u_center"),
        horizon: gl.getUniformLocation(this.program, "u_horizon"),
        tilt: gl.getUniformLocation(this.program, "u_tilt"),
        reveal: gl.getUniformLocation(this.program, "u_reveal"),
      };

      this.vertexBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
      gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
        gl.STATIC_DRAW,
      );

      this.sceneTexture = this.createTexture(0);
      this.labelTexture = this.createTexture(1);
      this.updateLabelTexture();
      this.available = true;

      this.canvas.addEventListener("webglcontextlost", (event) => {
        event.preventDefault();
        this.available = false;
        this.ready = false;
        this.canvas.remove();
      });
    } catch {
      this.available = false;
      this.canvas.remove();
    }
  }

  createShader(type, source) {
    const shader = this.gl.createShader(type);
    this.gl.shaderSource(shader, source);
    this.gl.compileShader(shader);

    if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
      throw new Error(this.gl.getShaderInfoLog(shader) || "Unable to compile black-hole shader");
    }

    return shader;
  }

  createProgram(vertexSource, fragmentSource) {
    const program = this.gl.createProgram();
    this.gl.attachShader(program, this.createShader(this.gl.VERTEX_SHADER, vertexSource));
    this.gl.attachShader(program, this.createShader(this.gl.FRAGMENT_SHADER, fragmentSource));
    this.gl.linkProgram(program);

    if (!this.gl.getProgramParameter(program, this.gl.LINK_STATUS)) {
      throw new Error(this.gl.getProgramInfoLog(program) || "Unable to link black-hole shader");
    }

    return program;
  }

  createTexture(textureUnit) {
    const texture = this.gl.createTexture();
    this.gl.activeTexture(this.gl.TEXTURE0 + textureUnit);
    this.gl.bindTexture(this.gl.TEXTURE_2D, texture);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.LINEAR);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.LINEAR);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.CLAMP_TO_EDGE);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.CLAMP_TO_EDGE);
    return texture;
  }

  updateLabelTexture() {
    const labelCanvas = document.createElement("canvas");
    labelCanvas.width = 512;
    labelCanvas.height = 128;
    const context = labelCanvas.getContext("2d");
    const letters = [..."ENTER"];
    const tracking = -1.5;

    context.clearRect(0, 0, labelCanvas.width, labelCanvas.height);
    context.fillStyle = "#ffffff";
    context.font = '600 64px "Unbounded", Arial, sans-serif';
    context.lineJoin = "round";
    context.lineWidth = 1.5;
    context.strokeStyle = "#ffffff";
    context.textBaseline = "middle";

    const letterWidths = letters.map((letter) => context.measureText(letter).width);
    const wordWidth = letterWidths.reduce((sum, width) => sum + width, 0) + tracking * (letters.length - 1);
    let x = (labelCanvas.width - wordWidth) / 2;

    letters.forEach((letter, index) => {
      context.strokeText(letter, x, labelCanvas.height / 2 + 1);
      context.fillText(letter, x, labelCanvas.height / 2 + 1);
      x += letterWidths[index] + tracking;
    });

    this.gl.activeTexture(this.gl.TEXTURE1);
    this.gl.bindTexture(this.gl.TEXTURE_2D, this.labelTexture);
    this.gl.pixelStorei(this.gl.UNPACK_FLIP_Y_WEBGL, true);
    this.gl.texImage2D(
      this.gl.TEXTURE_2D,
      0,
      this.gl.RGBA,
      this.gl.RGBA,
      this.gl.UNSIGNED_BYTE,
      labelCanvas,
    );
  }

  resize(bounds) {
    this.bounds = bounds;
    const width = Math.max(1, Math.round(bounds.width * this.renderScale));
    const height = Math.max(1, Math.round(bounds.height * this.renderScale));

    if (this.canvas.width !== width || this.canvas.height !== height) {
      this.canvas.width = width;
      this.canvas.height = height;
    }

    this.gl.viewport(0, 0, width, height);
  }

  async setScene(projectLink, bounds) {
    const token = ++this.sceneToken;
    this.ready = false;
    projectLink.classList.remove("is-black-hole-ready");
    projectLink.append(this.canvas);
    this.resize(bounds);

    const snapshot = await makePanelSnapshot(projectLink, bounds, this.renderScale);
    if (token !== this.sceneToken || !this.available) return false;

    this.gl.activeTexture(this.gl.TEXTURE0);
    this.gl.bindTexture(this.gl.TEXTURE_2D, this.sceneTexture);
    this.gl.pixelStorei(this.gl.UNPACK_FLIP_Y_WEBGL, true);
    this.gl.texImage2D(
      this.gl.TEXTURE_2D,
      0,
      this.gl.RGBA,
      this.gl.RGBA,
      this.gl.UNSIGNED_BYTE,
      snapshot,
    );

    this.ready = true;
    projectLink.classList.add("is-black-hole-ready");
    return true;
  }

  render(x, y, tilt, reveal) {
    if (!this.available || !this.ready || !this.bounds) return;

    const gl = this.gl;
    const horizonPixels = clamp(Math.min(this.bounds.width, this.bounds.height) * 0.13, 44, 68);
    gl.useProgram(this.program);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
    gl.enableVertexAttribArray(this.positionLocation);
    gl.vertexAttribPointer(this.positionLocation, 2, gl.FLOAT, false, 0, 0);
    gl.uniform1i(this.uniforms.scene, 0);
    gl.uniform1i(this.uniforms.label, 1);
    gl.uniform2f(this.uniforms.resolution, this.canvas.width, this.canvas.height);
    gl.uniform2f(this.uniforms.center, x / this.bounds.width, 1 - y / this.bounds.height);
    gl.uniform1f(this.uniforms.horizon, horizonPixels / this.bounds.height);
    gl.uniform1f(this.uniforms.tilt, tilt);
    gl.uniform1f(this.uniforms.reveal, reveal);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
  }
}

let blackHoleRenderer;
let activeProjectLink;
let activeBounds;
let animationFrame = 0;
let layoutFrame = 0;
let lastFrameTime = 0;
let lastPointer;
let keyboardNavigation = false;

const motion = {
  x: 0,
  y: 0,
  targetX: 0,
  targetY: 0,
  velocityX: 0,
  velocityY: 0,
  tilt: 0,
  targetTilt: 0,
  tiltVelocity: 0,
  reveal: 0,
  targetReveal: 0,
};

const requestGravityFrame = () => {
  if (!animationFrame && !document.hidden) {
    lastFrameTime = performance.now();
    animationFrame = window.requestAnimationFrame(renderGravityFrame);
  }
};

const ensureBlackHoleRenderer = () => {
  if (reducedMotion.matches || slowUpdate.matches) return undefined;
  if (!blackHoleRenderer) blackHoleRenderer = new BlackHoleRenderer();
  return blackHoleRenderer.available ? blackHoleRenderer : undefined;
};

const setGravityTarget = (clientX, clientY) => {
  if (!activeProjectLink || !activeBounds) return;

  motion.targetX = clientX - activeBounds.left;
  motion.targetY = clientY - activeBounds.top;
  const horizontalPosition = clamp(motion.targetX / activeBounds.width, 0, 1);
  motion.targetTilt = (horizontalPosition - 0.5) * (40 * Math.PI / 180);
};

const activateBlackHole = (projectLink, clientX, clientY) => {
  const renderer = ensureBlackHoleRenderer();
  if (!renderer) return false;

  if (activeProjectLink && activeProjectLink !== projectLink) {
    activeProjectLink.classList.remove("is-black-hole-ready", "is-entering");
  }

  const isNewPanel = activeProjectLink !== projectLink;
  activeProjectLink = projectLink;
  activeBounds = projectLink.getBoundingClientRect();
  lastPointer = { x: clientX, y: clientY };
  setGravityTarget(clientX, clientY);

  if (isNewPanel) {
    motion.x = motion.targetX;
    motion.y = motion.targetY;
    motion.velocityX = 0;
    motion.velocityY = 0;
    motion.tilt = 0;
    motion.tiltVelocity = 0;
    motion.reveal = 0;
    renderer.setScene(projectLink, activeBounds).then((ready) => {
      if (ready && activeProjectLink === projectLink) requestGravityFrame();
    });
  }

  motion.targetReveal = 1;
  requestGravityFrame();
  return true;
};

const hideBlackHole = (projectLink = activeProjectLink) => {
  if (!activeProjectLink || projectLink !== activeProjectLink) return;
  lastPointer = undefined;
  motion.targetReveal = 0;
  requestGravityFrame();
};

function renderGravityFrame(time) {
  animationFrame = 0;
  if (!activeProjectLink || !blackHoleRenderer?.available) return;

  const frameScale = clamp((time - lastFrameTime) / 16.667, 0.45, 1.9);
  lastFrameTime = time;
  const positionDamping = Math.pow(0.79, frameScale);
  const tiltDamping = Math.pow(0.76, frameScale);

  motion.velocityX = (motion.velocityX + (motion.targetX - motion.x) * 0.046 * frameScale) * positionDamping;
  motion.velocityY = (motion.velocityY + (motion.targetY - motion.y) * 0.046 * frameScale) * positionDamping;
  motion.x += motion.velocityX * frameScale;
  motion.y += motion.velocityY * frameScale;

  motion.tiltVelocity = (motion.tiltVelocity + (motion.targetTilt - motion.tilt) * 0.04 * frameScale) * tiltDamping;
  motion.tilt += motion.tiltVelocity * frameScale;
  motion.reveal += (motion.targetReveal - motion.reveal) * (1 - Math.pow(0.82, frameScale));

  blackHoleRenderer.render(motion.x, motion.y, motion.tilt, motion.reveal);

  const positionSettled = Math.abs(motion.targetX - motion.x) < 0.04 &&
    Math.abs(motion.targetY - motion.y) < 0.04 &&
    Math.abs(motion.velocityX) < 0.025 &&
    Math.abs(motion.velocityY) < 0.025;
  const tiltSettled = Math.abs(motion.targetTilt - motion.tilt) < 0.0005 &&
    Math.abs(motion.tiltVelocity) < 0.0003;
  const revealSettled = Math.abs(motion.targetReveal - motion.reveal) < 0.003;

  if (motion.targetReveal === 0 && revealSettled) {
    const hiddenLink = activeProjectLink;
    motion.reveal = 0;
    blackHoleRenderer.render(motion.x, motion.y, motion.tilt, 0);
    hiddenLink.classList.remove("is-black-hole-ready");
    if (!hiddenLink.classList.contains("is-entering")) activeProjectLink = undefined;
    return;
  }

  if (!positionSettled || !tiltSettled || !revealSettled) requestGravityFrame();
}

const refreshActiveBounds = () => {
  layoutFrame = 0;
  if (!activeProjectLink || !lastPointer || motion.targetReveal === 0) return;

  const nextBounds = activeProjectLink.getBoundingClientRect();
  const pointerIsInside = lastPointer.x >= nextBounds.left && lastPointer.x <= nextBounds.right &&
    lastPointer.y >= nextBounds.top && lastPointer.y <= nextBounds.bottom;

  if (!pointerIsInside) {
    hideBlackHole(activeProjectLink);
    return;
  }

  const sizeChanged = Math.abs(nextBounds.width - activeBounds.width) > 1 ||
    Math.abs(nextBounds.height - activeBounds.height) > 1;
  activeBounds = nextBounds;
  blackHoleRenderer.bounds = nextBounds;
  setGravityTarget(lastPointer.x, lastPointer.y);

  if (sizeChanged) {
    blackHoleRenderer.setScene(activeProjectLink, nextBounds).then((ready) => {
      if (ready) requestGravityFrame();
    });
  } else {
    requestGravityFrame();
  }
};

const scheduleBoundsRefresh = () => {
  if (!layoutFrame) layoutFrame = window.requestAnimationFrame(refreshActiveBounds);
};

projectLinks.forEach((projectLink) => {
  projectLink.addEventListener("pointerenter", (event) => {
    if (!hasFinePointer.matches || event.pointerType === "touch" || reducedMotion.matches) return;
    activateBlackHole(projectLink, event.clientX, event.clientY);
  });

  projectLink.addEventListener("pointermove", (event) => {
    if (!hasFinePointer.matches || event.pointerType === "touch" || reducedMotion.matches) return;
    lastPointer = { x: event.clientX, y: event.clientY };
    if (activeProjectLink !== projectLink) {
      activateBlackHole(projectLink, event.clientX, event.clientY);
      return;
    }
    setGravityTarget(event.clientX, event.clientY);
    motion.targetReveal = 1;
    requestGravityFrame();
  }, { passive: true });

  projectLink.addEventListener("pointerleave", () => {
    if (!projectLink.classList.contains("is-entering")) hideBlackHole(projectLink);
  });

  projectLink.addEventListener("focus", () => {
    if (!keyboardNavigation || reducedMotion.matches) return;
    const bounds = projectLink.getBoundingClientRect();
    activateBlackHole(projectLink, bounds.left + bounds.width / 2, bounds.top + bounds.height / 2);
  });

  projectLink.addEventListener("blur", () => hideBlackHole(projectLink));

  projectLink.addEventListener("click", (event) => {
    if (
      hasFinePointer.matches ||
      reducedMotion.matches ||
      slowUpdate.matches ||
      projectLink.classList.contains("is-entering")
    ) return;

    event.preventDefault();
    const bounds = projectLink.getBoundingClientRect();
    const clientX = event.clientX || bounds.left + bounds.width / 2;
    const clientY = event.clientY || bounds.top + bounds.height / 2;
    if (!activateBlackHole(projectLink, clientX, clientY)) {
      window.location.assign(projectLink.href);
      return;
    }

    projectLink.classList.add("is-entering");
    window.setTimeout(() => window.location.assign(projectLink.href), 760);
  });
});

window.addEventListener("keydown", (event) => {
  if (event.key === "Tab") keyboardNavigation = true;
});

window.addEventListener("pointerdown", () => {
  keyboardNavigation = false;
}, { passive: true });

window.addEventListener("scroll", scheduleBoundsRefresh, { passive: true, capture: true });
window.addEventListener("resize", scheduleBoundsRefresh, { passive: true });

document.addEventListener("visibilitychange", () => {
  if (document.hidden && animationFrame) {
    window.cancelAnimationFrame(animationFrame);
    animationFrame = 0;
  } else if (!document.hidden && activeProjectLink) {
    requestGravityFrame();
  }
});

document.fonts?.ready.then(() => blackHoleRenderer?.updateLabelTexture());

const contactTicket = document.querySelector("[data-contact-ticket]");

if (contactTicket) {
  class OptimizedBusinessCard {
    constructor(card) {
      this.card = card;
      this.surface = card.querySelector(".contact-ticket__surface");
      this.targetX = 0;
      this.currentX = 0;
      this.targetY = 0;
      this.currentY = 0;
      this.targetScale = 1;
      this.currentScale = 1;
      this.isHovering = false;
      this.easing = 0.075;
      this.jiggleInterval = 3000;
      this.isJiggling = false;
      this.jiggleTimer = null;
      this.jigglePhaseTimers = [];
      this.bounceScale = 0;
      this.bounceVelocity = 0;
      this.bounceGravity = 0.004;
      this.bounceFriction = 0.95;
      this.isVisible = false;
      this.animationId = null;
      this.lastFrameTime = 0;
      this.frameInterval = 1000 / 60;
      this.observer = null;
      this.holoTimeout = null;
      this.subtitleTimeout = null;
      this.originalSubtitleText =
        this.card.querySelector("[data-ticket-status]")?.textContent || "";
      this.init();
    }

    init() {
      this.setupIntersectionObserver();
      this.setupEventListeners();
    }

    setupIntersectionObserver() {
      this.observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              this.startAnimation();
            } else {
              this.stopAnimation();
            }
          });
        },
        { root: null, rootMargin: "50px", threshold: 0.1 },
      );
      this.observer.observe(this.card);
    }

    startAnimation() {
      if (!this.isVisible && !reducedMotion.matches) {
        this.isVisible = true;
        this.scheduleJiggle();
        this.requestAnimation();
      }
    }

    stopAnimation() {
      this.isVisible = false;
      this.cancelJiggle();
      if (this.animationId) {
        cancelAnimationFrame(this.animationId);
        this.animationId = null;
      }
      this.lastFrameTime = 0;
      this.card.classList.remove("is-moving");
    }

    requestAnimation() {
      if (!this.isVisible || reducedMotion.matches || this.animationId) return;
      this.card.classList.add("is-moving");
      this.lastFrameTime ||= performance.now();
      this.animationId = requestAnimationFrame((time) => this.animationLoop(time));
    }

    animationLoop(currentTime) {
      this.animationId = null;
      if (!this.isVisible) return;
      const deltaTime = currentTime - this.lastFrameTime;

      if (deltaTime >= this.frameInterval) {
        this.updateAnimation();
        this.lastFrameTime = currentTime - (deltaTime % this.frameInterval);
      }

      if (this.isSettled()) {
        this.lastFrameTime = 0;
        this.card.classList.remove("is-moving");
      } else {
        this.animationId = requestAnimationFrame((time) => this.animationLoop(time));
      }
    }

    isSettled() {
      return (
        Math.abs(this.targetX - this.currentX) < 0.01 &&
        Math.abs(this.targetY - this.currentY) < 0.01 &&
        Math.abs(this.targetScale - this.currentScale) < 0.0005 &&
        this.bounceVelocity === 0 &&
        this.bounceScale === 0 &&
        !this.isJiggling
      );
    }

    cancelJiggle() {
      window.clearTimeout(this.jiggleTimer);
      this.jiggleTimer = null;
      this.jigglePhaseTimers.forEach((timer) => window.clearTimeout(timer));
      this.jigglePhaseTimers = [];
      this.isJiggling = false;
    }

    scheduleJiggle() {
      window.clearTimeout(this.jiggleTimer);
      if (!this.isVisible || this.isHovering || reducedMotion.matches) return;
      this.jiggleTimer = window.setTimeout(() => this.playJiggle(), this.jiggleInterval);
    }

    playJiggle() {
      if (!this.isVisible || this.isHovering) return;
      this.isJiggling = true;
      this.targetY = 12;
      this.requestAnimation();
      this.jigglePhaseTimers = [
        window.setTimeout(() => {
          this.targetY = -12;
          this.requestAnimation();
        }, 150),
        window.setTimeout(() => {
          this.targetY = 0;
          this.isJiggling = false;
          this.jigglePhaseTimers = [];
          this.scheduleJiggle();
          this.requestAnimation();
        }, 300),
      ];
    }

    updateAnimation() {
      if (this.bounceVelocity !== 0) {
        this.bounceVelocity -= this.bounceGravity;
        this.bounceScale += this.bounceVelocity;
        this.bounceVelocity *= this.bounceFriction;
        if (this.bounceScale < 0) {
          this.bounceScale = 0;
          this.bounceVelocity = 0;
        }
      }

      this.currentX += (this.targetX - this.currentX) * this.easing;
      this.currentY += (this.targetY - this.currentY) * this.easing;
      this.currentScale += (this.targetScale - this.currentScale) * this.easing;

      const effectiveScale = this.currentScale + this.bounceScale;
      const gradientAngle = 180 + this.currentY * 2 + this.currentX * 2;
      this.card.style.setProperty("--gradient-angle", `${gradientAngle}deg`);
      this.card.style.setProperty("--gradient-angle-inv", `${-gradientAngle}deg`);
      this.card.style.setProperty("--holo-rot-x", `${this.currentX * 1.5}deg`);
      this.card.style.setProperty("--holo-rot-y", `${this.currentY * 1.5}deg`);
      this.card.style.transform = `perspective(1200px) rotateX(${this.currentX}deg) rotateY(${this.currentY}deg) scale(${effectiveScale})`;
    }

    setupEventListeners() {
      this.card.addEventListener("mouseenter", () => {
        if (reducedMotion.matches) return;
        this.cancelJiggle();
        this.isHovering = true;
        this.targetX = 0;
        this.targetY = 0;
        this.targetScale = 1.1;
        this.requestAnimation();
      });

      this.card.addEventListener("mousemove", (event) => {
        if (reducedMotion.matches) return;
        const rect = this.card.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        const centerX = this.card.offsetWidth / 2;
        const centerY = this.card.offsetHeight / 2;

        this.targetX = ((y - centerY) / centerY) * -20;
        this.targetY = ((x - centerX) / centerX) * 20;
        this.card.style.setProperty("--mouse-x", `${(x / this.card.offsetWidth) * 100}%`);
        this.card.style.setProperty("--mouse-y", `${(y / this.card.offsetHeight) * 100}%`);
        this.requestAnimation();
      });

      this.card.addEventListener("mouseleave", () => {
        this.isHovering = false;
        this.targetX = 0;
        this.targetY = 0;
        this.targetScale = 1;
        this.scheduleJiggle();
        this.requestAnimation();
      });

      this.card.addEventListener("click", async () => {
        this.card.classList.add("is-holographic");
        window.clearTimeout(this.holoTimeout);
        this.holoTimeout = window.setTimeout(() => {
          this.card.classList.remove("is-holographic");
        }, 4000);

        this.surface.style.transition = "none";
        this.card.classList.add("is-flashing");
        void this.surface.offsetWidth;
        this.surface.style.transition =
          "background-color 0.5s ease-out, box-shadow 0.5s ease-out";
        this.card.classList.remove("is-flashing");
        this.bounceVelocity = reducedMotion.matches ? 0 : 0.02;
        this.requestAnimation();

        const subtitle = this.card.querySelector("[data-ticket-status]");
        try {
          await navigator.clipboard.writeText("me@willchai.com");
          subtitle.textContent = "copied to clipboard!";
        } catch {
          subtitle.textContent = "me@willchai.com — ready to copy";
        }

        window.clearTimeout(this.subtitleTimeout);
        this.subtitleTimeout = window.setTimeout(() => {
          subtitle.textContent = this.originalSubtitleText;
          this.targetX = 0;
          this.targetY = 0;
          this.targetScale = 1;
          this.requestAnimation();
        }, 4000);
      });
    }
  }

  new OptimizedBusinessCard(contactTicket);
}
