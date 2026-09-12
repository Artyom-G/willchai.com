(() => {
  const section = document.querySelector('[data-photo-collection]');
  if (!section) return;

  const viewport = section.querySelector('.collectionViewport');
  const cards = [...section.querySelectorAll('[data-collection-photo]')];
  const characterStage = section.querySelector('[data-collection-character]');
  const status = section.querySelector('[data-collection-status]');
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
  let frame = 0;
  let sectionTop = 0;
  let stickyTop = 0;
  let width = 1;
  let height = 1;
  let cardStep = 1;
  let distance = 1;
  let active = false;
  let keyboardIntent = false;
  let composed = false;
  let currentCard = -1;
  let scrolling = false;
  let pendingMeasure = false;
  let resizeTimer = 0;
  let scrollTimer = 0;

  const clearCardMotion = () => {
    cards.forEach((card) => {
      card.style.removeProperty('--orbit-card-width');
      card.style.removeProperty('--orbit-card-height');
      card.style.removeProperty('transform');
      card.style.removeProperty('z-index');
      card.style.removeProperty('opacity');
      card.style.removeProperty('pointer-events');
      card.style.removeProperty('will-change');
    });
    if (characterStage) {
      characterStage.style.removeProperty('--orbit-card-width');
      characterStage.style.removeProperty('--orbit-card-height');
      characterStage.style.removeProperty('transform');
      characterStage.style.removeProperty('opacity');
    }
  };

  const render = () => {
    frame = 0;
    if (motion.matches || document.hidden) return;

    const progress = clamp((scrollY - sectionTop + stickyTop) / distance, 0, 1);
    const cursor = progress * (cards.length - 1);
    const mobile = width <= 640;
    const nearest = Math.round(cursor);
    if (nearest !== currentCard) {
      currentCard = nearest;
      if (status) status.textContent = `Featured photograph ${nearest + 1} of ${cards.length}`;
    }

    cards.forEach((card, index) => {
      const q = index - cursor;
      const x = q * width * (mobile ? 0.56 : 0.49) + Math.sin(q * 0.8) * width * 0.035;
      const y = q * height * (mobile ? 0.38 : 0.4) + Math.sin(q * 0.8) * height * 0.025 + (mobile ? 24 : 32);
      const proximity = Math.abs(q);
      const scale = 1 - Math.min(proximity, 2) * 0.075;
      const angle = clamp(q, -2, 2) * (mobile ? 6 : 8);
      const transform = `translate(-50%,-50%) translate3d(${x}px,${y}px,0) rotate(${angle}deg) scale(${scale})`;
      const opacity = clamp((2.3 - proximity) / 0.5, 0, 1);
      card.style.transform = transform;
      card.style.zIndex = String(100 - Math.round(proximity * 10));
      card.style.opacity = String(opacity);
      card.style.pointerEvents = proximity < 1.5 ? 'auto' : 'none';
      card.style.willChange = active && proximity < 2.3 ? 'transform' : 'auto';
      if (proximity < 2.5) card.querySelector('img').loading = 'eager';
      if (index === 0 && characterStage) {
        characterStage.style.transform = transform;
        characterStage.style.opacity = String(opacity);
      }
    });

    if (!composed) {
      composed = true;
      document.dispatchEvent(new CustomEvent('photography:composed'));
    }
  };

  const schedule = () => {
    if (!frame && !motion.matches && (active || !composed)) frame = requestAnimationFrame(render);
  };

  const measure = () => {
    if (motion.matches) {
      section.classList.remove('isOrbit');
      section.style.removeProperty('height');
      clearCardMotion();
      return;
    }

    section.classList.add('isOrbit');
    sectionTop = section.getBoundingClientRect().top + scrollY;
    section.style.setProperty('--orbit-opening-space',`${Math.round(sectionTop)}px`);
    width = viewport.clientWidth;
    height = viewport.clientHeight;
    stickyTop = parseFloat(getComputedStyle(viewport).top) || 0;
    const mobile = width <= 640;
    cardStep = height * (mobile ? 0.72 : 0.68);
    distance = cardStep * (cards.length - 1);
    section.style.height = `${height + distance}px`;

    cards.forEach((card) => {
      const image = card.querySelector('img');
      const intrinsicWidth = Number(image.getAttribute('width')) || image.naturalWidth;
      const intrinsicHeight = Number(image.getAttribute('height')) || image.naturalHeight;
      const ratio = intrinsicWidth / intrinsicHeight || 3 / 4;
      const maximumHeight = Math.min(height * (mobile ? 0.69 : 0.79), height - (mobile ? 144 : 176));
      const cardWidth = Math.min(width * (mobile ? 0.86 : 0.68), maximumHeight * ratio);
      card.style.setProperty('--orbit-card-width', `${cardWidth}px`);
      card.style.setProperty('--orbit-card-height', `${cardWidth / ratio}px`);
      if (card === cards[0] && characterStage) {
        characterStage.style.setProperty('--orbit-card-width', `${cardWidth}px`);
        characterStage.style.setProperty('--orbit-card-height', `${cardWidth / ratio}px`);
      }
    });
    schedule();
  };

  const runPendingMeasure = () => {
    scrolling = false;
    clearTimeout(scrollTimer);
    if (!pendingMeasure) return;
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      pendingMeasure = false;
      measure();
    }, 120);
  };

  const requestMeasure = ({ force = false } = {}) => {
    const nextWidth = viewport.clientWidth;
    const mobileHeightOnlyChange = nextWidth <= 640 && Math.abs(nextWidth - width) < 2;
    if (mobileHeightOnlyChange && !force) {
      schedule();
      return;
    }
    pendingMeasure = true;
    if (!scrolling) runPendingMeasure();
  };

  addEventListener('scroll', () => {
    scrolling = true;
    schedule();
    clearTimeout(scrollTimer);
    scrollTimer = setTimeout(runPendingMeasure, 180);
  }, { passive: true });
  addEventListener('scrollend', runPendingMeasure, { passive: true });
  addEventListener('resize', requestMeasure, { passive: true });
  addEventListener('keydown', (event) => {
    if (event.key === 'Tab') keyboardIntent = true;
  });
  addEventListener('pointerdown', () => {
    keyboardIntent = false;
  }, { passive: true });
  motion.addEventListener('change', () => {
    pendingMeasure = false;
    measure();
  });
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      cancelAnimationFrame(frame);
      frame = 0;
    } else {
      schedule();
    }
  });

  const observer = new IntersectionObserver((entries) => {
    active = entries.some((entry) => entry.isIntersecting);
    schedule();
  });
  observer.observe(section);

  cards.forEach((card) => {
    card.addEventListener('focusin', () => {
      if (!motion.matches && keyboardIntent) {
        scrollTo({ top: sectionTop - stickyTop + cards.indexOf(card) * cardStep, behavior: 'auto' });
        render();
      }
    });
  });

  document.fonts?.ready.then(() => requestMeasure({ force: true }));
  measure();
})();
