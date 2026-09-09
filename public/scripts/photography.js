const shuffleGallery = document.querySelector("[data-shuffle-gallery]");
const shuffleButton = document.querySelector("[data-shuffle-more]");
const shuffleReset = document.querySelector("[data-shuffle-reset]");
const shuffleStatus = document.querySelector("[data-shuffle-status]");

if (shuffleGallery && shuffleButton) {
  const batches = Array.from(shuffleGallery.querySelectorAll("[data-shuffle-batch]"));
  const items = Array.from(shuffleGallery.querySelectorAll("[data-shuffle-item]"));
  const batchSize = 36;
  let automaticLoading = window.location.hash !== "#photography-contact";

  const updateStatus = () => {
    const visibleCount = batches
      .filter((batch) => !batch.hidden)
      .reduce((count, batch) => count + batch.childElementCount, 0);
    if (shuffleStatus) shuffleStatus.textContent = `${visibleCount} photographs shown`;
    shuffleButton.hidden = visibleCount === items.length;
  };

  const revealBatch = (batch) => {
    if (!batch) return;
    batch.querySelectorAll("img[data-src]").forEach((image) => {
      image.src = image.dataset.src;
      image.removeAttribute("data-src");
    });
    batch.hidden = false;
    updateStatus();
  };

  const revealNextBatch = () => revealBatch(batches.find((batch) => batch.hidden));
  shuffleButton.addEventListener("click", revealNextBatch);

  const observer = "IntersectionObserver" in window
    ? new IntersectionObserver(([entry]) => {
        const footerIsFocused = document.activeElement?.closest(".photographyFooter");
        if (entry.isIntersecting && automaticLoading && !footerIsFocused && !shuffleButton.hidden) {
          revealNextBatch();
        }
      }, { rootMargin: "600px 0px" })
    : null;

  if (automaticLoading) observer?.observe(shuffleButton);

  // A contact jump pauses loading so the destination stays in place.
  document.querySelectorAll('a[href="#photography-contact"]').forEach((link) => {
    link.addEventListener("click", () => {
      automaticLoading = false;
      observer?.disconnect();
    });
  });

  window.addEventListener("hashchange", () => {
    automaticLoading = window.location.hash !== "#photography-contact";
    if (automaticLoading) observer?.observe(shuffleButton);
    else observer?.disconnect();
  });

  shuffleReset?.addEventListener("click", () => {
    observer?.disconnect();
    const order = [...items];
    for (let index = order.length - 1; index > 0; index--) {
      const swapIndex = Math.floor(Math.random() * (index + 1));
      [order[index], order[swapIndex]] = [order[swapIndex], order[index]];
    }
    // Each batch owns its columns so loading leaves earlier photographs in place.
    batches.forEach((batch, index) => {
      batch.replaceChildren(...order.slice(index * batchSize, (index + 1) * batchSize));
      batch.hidden = index > 0;
    });
    revealBatch(batches[0]);
    automaticLoading = true;
    observer?.observe(shuffleButton);
  });
}

const contactTickets = document.querySelectorAll("[data-contact-ticket]");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

if (contactTickets.length) {
  class ContactTicket {
    constructor(card) {
      this.card = card;
      this.surface = card.querySelector(".photographyTicketSurface");
      this.status = card.querySelector("[data-ticket-status]");
      this.originalStatus = this.status?.textContent || "";
      this.targetX = 0;
      this.currentX = 0;
      this.targetY = 0;
      this.currentY = 0;
      this.targetScale = 1;
      this.currentScale = 1;
      this.bounce = 0;
      this.velocity = 0;
      this.isVisible = false;
      this.isHovering = false;
      this.isJiggling = false;
      this.frame = 0;
      this.jiggleTimer = 0;
      this.jigglePhases = [];
      this.statusTimer = 0;
      this.hologramTimer = 0;
      this.observe();
      this.listen();
    }

    observe() {
      this.observer = new IntersectionObserver(
        ([entry]) => {
          this.isVisible = entry.isIntersecting;
          if (this.isVisible) this.scheduleJiggle();
          else this.stop();
        },
        { rootMargin: "50px", threshold: 0.1 },
      );
      this.observer.observe(this.card);
    }

    listen() {
      this.card.addEventListener("mouseenter", () => {
        if (reducedMotion.matches) return;
        this.cancelJiggle();
        this.isHovering = true;
        this.targetScale = 1.1;
        this.animate();
      });

      this.card.addEventListener("mousemove", (event) => {
        if (reducedMotion.matches) return;
        const bounds = this.card.getBoundingClientRect();
        const x = event.clientX - bounds.left;
        const y = event.clientY - bounds.top;
        this.targetX = ((y - bounds.height / 2) / (bounds.height / 2)) * -20;
        this.targetY = ((x - bounds.width / 2) / (bounds.width / 2)) * 20;
        this.card.style.setProperty("--mouse-x", `${(x / bounds.width) * 100}%`);
        this.card.style.setProperty("--mouse-y", `${(y / bounds.height) * 100}%`);
        this.animate();
      });

      this.card.addEventListener("mouseleave", () => {
        this.isHovering = false;
        this.targetX = 0;
        this.targetY = 0;
        this.targetScale = 1;
        this.scheduleJiggle();
        this.animate();
      });

      this.card.addEventListener("click", () => this.activate());
    }

    animate() {
      if (!this.isVisible || reducedMotion.matches || this.frame) return;
      this.card.classList.add("isMoving");
      this.frame = window.requestAnimationFrame(() => this.update());
    }

    update() {
      this.frame = 0;

      if (this.velocity !== 0) {
        this.velocity -= 0.004;
        this.bounce += this.velocity;
        this.velocity *= 0.95;
        if (this.bounce < 0) {
          this.bounce = 0;
          this.velocity = 0;
        }
      }

      this.currentX += (this.targetX - this.currentX) * 0.075;
      this.currentY += (this.targetY - this.currentY) * 0.075;
      this.currentScale += (this.targetScale - this.currentScale) * 0.075;

      const angle = 180 + this.currentY * 2 + this.currentX * 2;
      this.card.style.setProperty("--gradient-angle", `${angle}deg`);
      this.card.style.setProperty("--gradient-angle-inv", `${-angle}deg`);
      this.card.style.setProperty("--holo-rot-x", `${this.currentX * 1.5}deg`);
      this.card.style.setProperty("--holo-rot-y", `${this.currentY * 1.5}deg`);
      this.card.style.transform = `perspective(1200px) rotateX(${this.currentX}deg) rotateY(${this.currentY}deg) scale(${this.currentScale + this.bounce})`;

      const settled =
        Math.abs(this.targetX - this.currentX) < 0.01 &&
        Math.abs(this.targetY - this.currentY) < 0.01 &&
        Math.abs(this.targetScale - this.currentScale) < 0.0005 &&
        this.velocity === 0 &&
        this.bounce === 0 &&
        !this.isJiggling;

      if (settled) this.card.classList.remove("isMoving");
      else this.animate();
    }

    scheduleJiggle() {
      window.clearTimeout(this.jiggleTimer);
      if (!this.isVisible || this.isHovering || reducedMotion.matches) return;
      this.jiggleTimer = window.setTimeout(() => this.playJiggle(), 3000);
    }

    playJiggle() {
      if (!this.isVisible || this.isHovering) return;
      this.isJiggling = true;
      this.targetY = 12;
      this.animate();
      this.jigglePhases = [
        window.setTimeout(() => {
          this.targetY = -12;
          this.animate();
        }, 150),
        window.setTimeout(() => {
          this.targetY = 0;
          this.isJiggling = false;
          this.jigglePhases = [];
          this.scheduleJiggle();
          this.animate();
        }, 300),
      ];
    }

    cancelJiggle() {
      window.clearTimeout(this.jiggleTimer);
      this.jigglePhases.forEach((timer) => window.clearTimeout(timer));
      this.jigglePhases = [];
      this.isJiggling = false;
    }

    stop() {
      this.cancelJiggle();
      if (this.frame) window.cancelAnimationFrame(this.frame);
      this.frame = 0;
      this.card.classList.remove("isMoving");
    }

    async activate() {
      this.card.classList.add("isHolographic");
      window.clearTimeout(this.hologramTimer);
      this.hologramTimer = window.setTimeout(() => this.card.classList.remove("isHolographic"), 4000);
      this.velocity = reducedMotion.matches ? 0 : 0.02;
      this.animate();

      try {
        await navigator.clipboard.writeText("me@willchai.com");
        if (this.status) this.status.textContent = "copied to clipboard!";
      } catch {
        if (this.status) this.status.textContent = "me@willchai.com, ready to copy";
      }

      window.clearTimeout(this.statusTimer);
      this.statusTimer = window.setTimeout(() => {
        if (this.status) this.status.textContent = this.originalStatus;
      }, 4000);
    }
  }

  contactTickets.forEach((ticket) => new ContactTicket(ticket));
}
