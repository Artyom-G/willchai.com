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
  const desktop = matchMedia('(min-width: 62rem) and (hover: hover) and (pointer: fine)');
  const duration = name => parseFloat(getComputedStyle(document.documentElement).getPropertyValue(name)) || 0;
  const ease = getComputedStyle(document.documentElement).getPropertyValue('--wc-ease-settle').trim();
  const clamp = n => Math.max(0, Math.min(1, n));
  const smooth = n => { const x = clamp(n); return x * x * x * (x * (x * 6 - 15) + 10); };
  const travelAt = progress => {
    if (progress < 0.12) return 0;
    if (progress < 0.44) return smooth((progress - 0.12) / 0.32) * 0.5;
    if (progress < 0.56) return 0.5;
    if (progress < 0.9) return 0.5 + smooth((progress - 0.56) / 0.34) * 0.5;
    return 1;
  };
  let frame = 0;
  let travel = 0;
  let scrollDistance = 0;
  let animations = [];
  let restoringViewerFocus = false;
  const render = () => {
    frame = 0;
    if (document.hidden || motion.matches || !collection.classList.contains('hasScrollPassage')) return;
    const progress = clamp((16 - passage.getBoundingClientRect().top) / Math.max(1, scrollDistance));
    track.style.transform = 'translate3d(' + (-travelAt(progress) * travel) + 'px,0,0)';
  };
  const schedule = () => { if (!frame && !document.hidden) frame = requestAnimationFrame(render); };
  const measure = () => {
    if (!passage || !pin || !track) return;
    track.style.transform = '';
    const enabled = !motion.matches && desktop.matches && innerHeight > 600 && collection.dataset.layout === 'sequence';
    collection.classList.toggle('hasScrollPassage', enabled);
    travel = enabled ? Math.max(0, track.scrollWidth - passage.clientWidth) : 0;
    scrollDistance = travel ? Math.min(Math.max(travel * 0.95, innerHeight), innerHeight * 1.6) : 0;
    passage.style.height = enabled && travel ? (pin.offsetHeight + scrollDistance) + 'px' : '';
    if (!travel) collection.classList.remove('hasScrollPassage');
    schedule();
  };
  const setLayout = (layout, animate = true) => {
    animations.forEach(a => a.cancel()); animations = [];
    const before = cards.map(el => el.getBoundingClientRect());
    collection.dataset.layout = layout;
    label.textContent = layout === 'sheet' ? 'Play sequence' : 'View together';
    status.textContent = layout === 'sheet' ? cards.length + ' featured photographs arranged together.' : 'Featured photograph sequence.';
    measure();
    if (frame) cancelAnimationFrame(frame);
    render();
    if (animate && !motion.matches) cards.forEach((el, index) => {
      const a = before[index], b = el.getBoundingClientRect();
      if (!a.width || !b.width || (a.top > innerHeight && b.top > innerHeight) || (a.bottom < 0 && b.bottom < 0)) return;
      animations.push(el.animate([
        { transform:'translate(' + (a.left-b.left) + 'px,' + (a.top-b.top) + 'px) scale(' + (a.width/b.width) + ',' + (a.height/b.height) + ')', transformOrigin:'0 0' },
        { transform:'none', transformOrigin:'0 0' }
      ], { duration:duration('--wc-duration-layout'), easing:ease }));
    });
  };
  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(async entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      revealObserver.unobserve(el);
      if (motion.matches || (el.closest('.photoCollection') && collection.dataset.layout === 'sheet')) return;
      const image = el.querySelector('img');
      if (image) { try { await image.decode(); } catch { return; } }
      const bounds = el.getBoundingClientRect();
      if (bounds.bottom <= 0 || bounds.top >= innerHeight || motion.matches) return;
      if (el.classList.contains('collectionPhoto')) {
        const photograph = el.querySelector('a');
        photograph.animate([
          { clipPath:'inset(0 0 12% 0)', transform:'translateY(8px)' },
          { clipPath:'inset(0)', transform:'none' }
        ], { duration:duration('--wc-duration-reveal'), easing:ease });
        el.querySelector('figcaption')?.animate([
          { opacity:0, transform:'translateY(4px)' }, { opacity:1, transform:'none' }
        ], { duration:duration('--wc-duration-image'), delay:100, easing:ease, fill:'backwards' });
      } else {
        el.animate([{ opacity:0.45, transform:'translateY(8px)' }, { opacity:1, transform:'none' }], { duration:duration('--wc-duration-reveal'), easing:ease });
      }
    });
  }, { rootMargin:'0px 0px -4% 0px', threshold:0.04 });
  reveals.forEach(el => revealObserver.observe(el));
  toggle.hidden = false;
  setLayout(motion.matches ? 'sheet' : 'sequence', false);
  toggle.addEventListener('click', () => setLayout(collection.dataset.layout === 'sheet' ? 'sequence' : 'sheet'));
  addEventListener('scroll', schedule, { passive:true });
  addEventListener('resize', measure, { passive:true });
  document.fonts?.ready.then(measure);
  new ResizeObserver(measure).observe(pin);
  desktop.addEventListener('change', measure);
  track?.addEventListener('focusin', event => {
    if (restoringViewerFocus || !collection.classList.contains('hasScrollPassage')) return;
    const card = event.target.closest('.passagePhoto');
    if (!card) return;
    const target = clamp(card.offsetLeft / Math.max(1, travel));
    let lo = 0, hi = 1;
    for (let index = 0; index < 20; index++) { const mid = (lo + hi) / 2; if (travelAt(mid) < target) lo = mid; else hi = mid; }
    scrollTo({ top:scrollY + passage.getBoundingClientRect().top - 16 + (lo + hi) / 2 * scrollDistance, behavior:'instant' });
  });
  motion.addEventListener('change', () => {
    animations.forEach(a => a.cancel());
    reveals.forEach(el => el.getAnimations({ subtree:true }).forEach(animation => animation.cancel()));
    if (motion.matches) setLayout('sheet', false); else measure();
  });
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) { cancelAnimationFrame(frame); frame = 0; } else measure();
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
