(() => {
  const collection = document.querySelector('[data-photo-collection]');
  if (!collection) return;
  const toggle = collection.querySelector('[data-collection-toggle]');
  const label = collection.querySelector('[data-collection-label]');
  const status = collection.querySelector('[data-collection-status]');
  const cards = [...collection.querySelectorAll('[data-collection-photo]')];
  const opening = collection.querySelector('[data-opening-stack]');
  const pin = collection.querySelector('.stackPin');
  const openingCards = [...opening.querySelectorAll('[data-collection-photo]')];
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  const booking = document.querySelector('[data-booking-visual]');
  let frame = 0;
  let transitions = [];
  let geometry = null;

  let lastStackProgress = -1;
  let lastBookingProgress = -1;

  const duration = (name) => parseFloat(getComputedStyle(document.documentElement).getPropertyValue(name)) || 0;
  const ease = 'cubic-bezier(0.2, 0.8, 0.2, 1)';
  const clamp = (value) => Math.max(0, Math.min(1, value));
  const cancelTransitions = () => {
    transitions.forEach((animation) => animation.cancel());
    transitions = [];
  };
  const measure = () => {
    lastStackProgress = lastBookingProgress = -1;
    geometry = {
      width: pin.clientWidth,
      cards: openingCards.map((card) => ({ left: card.offsetLeft, top: card.offsetTop, width: card.offsetWidth })),
      travel: Math.max(1, opening.offsetHeight - pin.offsetHeight),
      top: parseFloat(getComputedStyle(pin).top) || 0,
    };
    schedule();
  };
  const render = () => {
    frame = 0;
    if (document.hidden || motion.matches) return;
    if (collection.dataset.layout === 'stack' && geometry) {
      const bounds = opening.getBoundingClientRect();
      const progress = clamp((geometry.top - bounds.top) / geometry.travel);
      const eased = progress * progress * (3 - 2 * progress);
      if (progress !== lastStackProgress) openingCards.forEach((card, index) => {
        const box = geometry.cards[index];
        const destination = (geometry.width - box.width) / 2 + (index - 1) * 16;
        card.style.setProperty('--stack-x', `${(destination - box.left) * eased}px`);
        card.style.setProperty('--stack-y', `${(index * 16 - box.top) * eased}px`);
      });
      lastStackProgress = progress;
    }
    if (booking) {
      const bounds = booking.getBoundingClientRect();
      const progress = clamp((innerHeight * 0.95 - bounds.top) / (innerHeight * 0.65));
      if (progress !== lastBookingProgress) booking.style.setProperty('--booking-reveal', `${progress * -80}px`);
      lastBookingProgress = progress;
    }
  };
  function schedule() {
    if (!frame && !document.hidden) frame = requestAnimationFrame(render);
  }

  const setLayout = (layout, animate = true) => {
    cancelTransitions();
    const before = cards.map((card) => card.getBoundingClientRect());
    collection.dataset.layout = layout;
    openingCards.forEach((card) => {
      card.style.removeProperty('--stack-x');
      card.style.removeProperty('--stack-y');
    });
    const spread = layout === 'sheet';
    label.textContent = spread ? 'Stack' : 'Spread out';
    toggle.title = spread ? 'Arrange the featured photographs as a stack' : 'Arrange the featured photographs as a contact sheet';
    status.textContent = spread ? `All ${cards.length} featured photographs arranged in a contact sheet.` : 'Featured photographs arranged as a stack and gallery.';
    measure();
    // Apply the final scroll position before measuring the destination rectangles.
    if (frame) cancelAnimationFrame(frame);
    render();
    if (!animate || motion.matches) return;
    cards.forEach((card, index) => {
      const first = before[index];
      const last = card.getBoundingClientRect();
      if (!first.width || !last.width) return;
      const rest = getComputedStyle(card).transform;
      const delta = `translate(${first.left - last.left}px, ${first.top - last.top}px) scale(${first.width / last.width}, ${first.height / last.height})`;
      const animation = card.animate([
        { transform: `${delta} ${rest === 'none' ? '' : rest}`, transformOrigin: '0 0' },
        { transform: rest, transformOrigin: '0 0' },
      ], { duration: duration('--wc-duration-layout'), easing: ease });
      transitions.push(animation);
    });
  };

  toggle.hidden = false;
  setLayout(motion.matches ? 'sheet' : 'stack', false);
  if (!motion.matches) {
    collection.classList.add('isArriving');
    setTimeout(() => collection.classList.remove('isArriving'), 1000);
  }
  toggle.addEventListener('click', () => setLayout(collection.dataset.layout === 'sheet' ? 'stack' : 'sheet'));
  addEventListener('scroll', schedule, { passive: true });
  addEventListener('resize', () => { cancelTransitions(); measure(); }, { passive: true });
  document.fonts?.ready.then(measure);
  motion.addEventListener('change', () => {
    cancelTransitions();
    if (motion.matches) {
      setLayout('sheet', false);
      booking?.style.removeProperty('--booking-reveal');
    } else measure();
  });
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      cancelAnimationFrame(frame);
      frame = 0;
      cancelTransitions();
    } else measure();
  });

  const viewer = document.querySelector('[data-photo-viewer]');
  if (!viewer || typeof viewer.showModal !== 'function') return;
  const image = viewer.querySelector('[data-viewer-image]');
  const caption = viewer.querySelector('[data-viewer-caption]');
  const count = viewer.querySelector('[data-viewer-count]');
  const closeButton = viewer.querySelector('[data-viewer-close]');
  const previousButton = viewer.querySelector('[data-viewer-previous]');
  const nextButton = viewer.querySelector('[data-viewer-next]');
  const stage = viewer.querySelector('[data-viewer-stage]');
  let origin = null;
  let group = [];
  let current = 0;
  let closing = false;
  let previousOverflow = '';
  let imageAnimation = null;
  let touchStart = null;
  let swipeConsumed = false;

  const visibleLinks = (name) => [...document.querySelectorAll('[data-photo-open]')].filter((link) => (
    link.dataset.photoGroup === name && !link.closest('[hidden]')
  ));
  const showImage = (index) => {
    imageAnimation?.cancel();
    current = (index + group.length) % group.length;
    const link = group[current];
    const thumbnail = link.querySelector('img');
    image.width = thumbnail?.getAttribute('width') || 1920;
    image.height = thumbnail?.getAttribute('height') || 1280;
    image.alt = thumbnail?.alt || 'Portfolio photograph';
    image.src = link.href;
    caption.textContent = link.dataset.caption || '';
    count.textContent = `${current + 1} / ${group.length}`;
    previousButton.disabled = nextButton.disabled = group.length < 2;
  };
  const imageTransform = (from, to) => `translate(${from.left - to.left}px, ${from.top - to.top}px) scale(${from.width / to.width}, ${from.height / to.height})`;
  const open = (link) => {
    if (viewer.open || closing) return;
    origin = link;
    group = visibleLinks(link.dataset.photoGroup);
    const source = link.querySelector('img')?.getBoundingClientRect();
    previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    showImage(group.indexOf(link));
    viewer.showModal();
    closeButton.focus({ preventScroll: true });
    const target = image.getBoundingClientRect();
    if (!motion.matches && source?.width && target.width) {
      imageAnimation = image.animate([
        { transform: imageTransform(source, target), transformOrigin: '0 0' },
        { transform: 'none', transformOrigin: '0 0' },
      ], { duration: duration('--wc-duration-image'), easing: ease });
    }
  };
  const close = async () => {
    if (!viewer.open || closing) return;
    closing = true;
    imageAnimation?.cancel();
    const sourceLink = group[current];
    const destination = sourceLink?.querySelector('img')?.getBoundingClientRect();
    const from = image.getBoundingClientRect();
    const returnsToOrigin = sourceLink === origin && destination?.bottom > 0 && destination.top < innerHeight;
    if (!motion.matches) {
      imageAnimation = image.animate([
        { transform: 'none', opacity: 1, transformOrigin: '0 0' },
        returnsToOrigin
          ? { transform: imageTransform(destination, from), opacity: 1, transformOrigin: '0 0' }
          : { opacity: 0, transform: 'scale(0.985)', transformOrigin: '50% 50%' },
      ], { duration: duration('--wc-duration-image'), easing: ease, fill: 'forwards' });
      await imageAnimation.finished.catch(() => {});
    }
    viewer.close();
    imageAnimation?.cancel();
    document.body.style.overflow = previousOverflow;
    origin?.focus({ preventScroll: true });
    closing = false;
    schedule();
  };
  const step = (amount) => {
    if (closing) return;
    showImage(current + amount);
    if (!motion.matches) imageAnimation = image.animate([{ opacity: 0 }, { opacity: 1 }], { duration: duration('--wc-duration-interface'), easing: ease });
  };

  document.addEventListener('click', (event) => {
    const link = event.target.closest('[data-photo-open]');
    if (!link || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    open(link);
  });
  closeButton.addEventListener('click', close);
  viewer.addEventListener('cancel', (event) => { event.preventDefault(); close(); });
  viewer.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowRight') { event.preventDefault(); step(1); }
    if (event.key === 'ArrowLeft') { event.preventDefault(); step(-1); }
  });
  viewer.addEventListener('click', (event) => {
    if (swipeConsumed) { swipeConsumed = false; return; }
    if (event.target === viewer || event.target === stage) close();
  });
  previousButton.addEventListener('click', () => step(-1));
  nextButton.addEventListener('click', () => step(1));
  stage.addEventListener('pointerdown', (event) => {
    swipeConsumed = false;
    touchStart = event.pointerType === 'touch' && event.isPrimary ? { x: event.clientX, y: event.clientY } : null;
  });
  stage.addEventListener('pointerup', (event) => {
    if (!touchStart) return;
    const x = event.clientX - touchStart.x;
    const y = event.clientY - touchStart.y;
    touchStart = null;
    if (Math.abs(x) > 60 && Math.abs(y) < 60) { swipeConsumed = true; step(x < 0 ? 1 : -1); }
  });
  stage.addEventListener('pointercancel', () => { touchStart = null; });
  motion.addEventListener('change', () => { if (motion.matches) imageAnimation?.cancel(); });
})();
