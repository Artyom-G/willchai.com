(() => {
  const collection = document.querySelector('[data-photo-collection]');
  if (!collection) return;
  const toggle = collection.querySelector('[data-collection-toggle]');
  const label = collection.querySelector('[data-collection-label]');
  const status = collection.querySelector('[data-collection-status]');
  const passage = collection.querySelector('[data-featured-passage]');
  const pin = passage?.querySelector('.passagePin');
  const track = collection.querySelector('[data-passage-track]');
  const cards = [...collection.querySelectorAll('[data-collection-photo]')];
  const reveals = [...document.querySelectorAll('[data-reveal]')];
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  const duration = name => parseFloat(getComputedStyle(document.documentElement).getPropertyValue(name)) || 0;
  const ease = 'cubic-bezier(0.2, 0.8, 0.2, 1)';
  const clamp = n => Math.max(0, Math.min(1, n));
  let frame = 0;
  let travel = 0;
  let scrollDistance = 0;
  let animations = [];
  let restoringViewerFocus = false;
  const render = () => {
    frame = 0;
    if (document.hidden || motion.matches) return;
    if (collection.dataset.layout === 'sequence' && track && passage) {
      const progress = clamp((16 - passage.getBoundingClientRect().top) / Math.max(1, scrollDistance));
      track.style.transform = `translate3d(${-progress * travel}px,0,0)`;
    }
    reveals.forEach(el => {
      const top = el.getBoundingClientRect().top;
      const progress = clamp((innerHeight * 0.99 - top) / Math.min(280, innerHeight * 0.38));
      el.style.setProperty('--reveal', String(progress));
    });
  };
  function schedule() { if (!frame && !document.hidden) frame = requestAnimationFrame(render); }
  const measure = () => {
    if (!passage || !pin || !track) return;
    track.style.transform = '';
    const enabled = !motion.matches && collection.dataset.layout === 'sequence' && innerHeight > 480;
    collection.classList.toggle('hasScrollPassage', enabled);
    travel = enabled ? Math.max(0, track.scrollWidth - passage.clientWidth) : 0;
    scrollDistance = Math.min(travel * 0.55, innerHeight * 0.85);
    passage.style.height = enabled ? `${pin.offsetHeight + scrollDistance}px` : '';
    schedule();
  };
  const setLayout = (layout, animate = true) => {
    animations.forEach(a => a.cancel()); animations = [];
    const before = cards.map(el => el.getBoundingClientRect());
    collection.dataset.layout = layout;
    label.textContent = layout === 'sheet' ? 'Play sequence' : 'View together';
    status.textContent = layout === 'sheet' ? `${cards.length} featured photographs arranged together.` : 'Featured photograph sequence.';
    measure();
    if (frame) cancelAnimationFrame(frame); render();
    if (animate && !motion.matches) cards.forEach((el, i) => {
      const a = before[i], b = el.getBoundingClientRect();
      if (!a.width || !b.width || (a.top > innerHeight && b.top > innerHeight)) return;
      animations.push(el.animate([{ transform: `translate(${a.left-b.left}px,${a.top-b.top}px) scale(${a.width/b.width},${a.height/b.height})`, transformOrigin:'0 0' }, { transform:'none', transformOrigin:'0 0' }], { duration: duration('--wc-duration-layout'), easing:ease }));
    });
  };
  toggle.hidden = false;
  setLayout(motion.matches ? 'sheet' : 'sequence', false);
  toggle.addEventListener('click', () => setLayout(collection.dataset.layout === 'sheet' ? 'sequence' : 'sheet'));
  addEventListener('scroll', schedule, { passive:true });
  addEventListener('resize', measure, { passive:true });
  document.fonts?.ready.then(measure);
  new ResizeObserver(measure).observe(pin);
  track?.addEventListener('focusin', event => {
    if (restoringViewerFocus || !collection.classList.contains('hasScrollPassage')) return;
    const card = event.target.closest('.passagePhoto');
    if (card) scrollTo({ top:scrollY + passage.getBoundingClientRect().top - 16 + (Math.min(travel, card.offsetLeft) / Math.max(1, travel)) * scrollDistance, behavior:'instant' });
  });
  motion.addEventListener('change', () => {
    animations.forEach(a=>a.cancel());
    if (motion.matches) { setLayout('sheet', false); reveals.forEach(el => el.style.setProperty('--reveal','1')); }
    else measure();
  });
  document.addEventListener('visibilitychange', () => { if (document.hidden) { cancelAnimationFrame(frame); frame=0; } else measure(); });
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
    restoringViewerFocus = true;
    origin?.focus({ preventScroll: true });
    restoringViewerFocus = false;
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
