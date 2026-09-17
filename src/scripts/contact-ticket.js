const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
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
      for (const src of [
        "/assets/willchai-mark.avif",
        "/assets/projects-v3/ticket-noise.webp",
      ]) {
        const image = new Image();
        image.src = src;
        image.decode().catch(() => {});
      }
      document.addEventListener("visibilitychange", () => {
        if (document.hidden) this.stopAnimation();
        else if (
          this.card.getBoundingClientRect().bottom > 0 &&
          this.card.getBoundingClientRect().top < innerHeight
        )
          this.startAnimation();
      });
      reducedMotion.addEventListener("change", () => {
        this.stopAnimation();
        this.targetX = this.targetY = 0;
        this.currentX = this.currentY = 0;
        this.card.style.transform = "";
        if (!reducedMotion.matches) this.startAnimation();
      });
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
      this.animationId = requestAnimationFrame((time) =>
        this.animationLoop(time),
      );
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
        this.animationId = requestAnimationFrame((time) =>
          this.animationLoop(time),
        );
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
      this.jiggleTimer = window.setTimeout(
        () => this.playJiggle(),
        this.jiggleInterval,
      );
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
      this.card.style.setProperty(
        "--gradient-angle-inv",
        `${-gradientAngle}deg`,
      );
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
        this.card.style.setProperty(
          "--mouse-x",
          `${(x / this.card.offsetWidth) * 100}%`,
        );
        this.card.style.setProperty(
          "--mouse-y",
          `${(y / this.card.offsetHeight) * 100}%`,
        );
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

        this.surface.getAnimations().forEach((animation) => animation.cancel());
        if (!reducedMotion.matches)
          this.surface.animate(
            [
              {
                backgroundColor: "#ffffff",
                boxShadow: "0 0 50px 25px rgba(255,255,255,.8)",
              },
              {
                backgroundColor: "#ffffff",
                boxShadow: "0 0 0 0 rgba(255,255,255,0)",
              },
            ],
            { duration: 500, easing: "ease-out" },
          );
        this.bounceVelocity = reducedMotion.matches ? 0 : 0.02;
        this.requestAnimation();

        const subtitle = this.card.querySelector("[data-ticket-status]");
        try {
          await navigator.clipboard.writeText("me@willchai.com");
          subtitle.textContent = "copied to clipboard!";
        } catch {
          subtitle.textContent = "me@willchai.com, ready to copy";
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
