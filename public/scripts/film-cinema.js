(() => {
  const root = document.querySelector('.filmCinema');
  if (!root) return;
  const chapters = [...root.querySelectorAll('[data-film-chapter]')];
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const wide = matchMedia('(min-width: 68rem) and (min-height: 38rem)');
  let scenes = [];
  let frame = 0;
  let enabled = false;
  const clamp = value => Math.max(0, Math.min(1, value));
  const smooth = value => value * value * (3 - 2 * value);
  function render() {
    frame = 0;
    if (!enabled || document.hidden) return;
    const viewport = innerHeight;
    const positions = scenes.map(scene => scene.el.getBoundingClientRect().top);
    scenes.forEach((scene, index) => {
      const top = positions[index];
      if (top > viewport || top < -scene.height) return;
      const growth = scene.first ? clamp((scene.intro - top) / Math.max(1, scene.intro)) : 1;
      const stageHeight = scene.base + (viewport - scene.base) * growth;
      const progress = clamp((scene.intro - top) / Math.max(1, scene.height - viewport + scene.intro));
      const image = scene.el.querySelector('.filmFrameSecond');
      const ready = image instanceof HTMLImageElement && image.complete && image.naturalWidth > 0;
      scene.el.style.setProperty('--film-stage-height', `${stageHeight}px`);
      scene.el.style.setProperty('--film-progress', String(progress));
      scene.el.style.setProperty('--film-shot', String(ready ? smooth(clamp((progress - .22) / .65)) : 0));
    });
  }
  function schedule() {
    if (!frame && enabled && !document.hidden) frame = requestAnimationFrame(render);
  }
  function measure() {
    root.classList.remove('filmMotion');
    scenes = [];
    enabled = !reduced.matches && wide.matches;
    if (!enabled) return;
    const viewport = innerHeight;
    scenes = chapters.map((el, index) => {
      const content = el.querySelector('.filmHeroContent');
      const first = index === 0;
      const intro = first ? el.getBoundingClientRect().top + scrollY : 0;
      const base = Math.max(content.scrollHeight + 220, first ? viewport - intro : viewport);
      const height = viewport * 1.65;
      return { el, first, intro, base, height };
    });
    // Use the natural document layout when enlarged text needs more vertical room.
    if (scenes.some(scene => scene.base > viewport)) { enabled = false; return; }
    scenes.forEach(scene => {
      scene.el.style.setProperty('--film-chapter-height', `${scene.height}px`);
      scene.el.style.setProperty('--film-stage-height', `${scene.base}px`);
    });
    root.classList.add('filmMotion');
    render();
  }
  addEventListener('scroll', schedule, { passive: true });
  addEventListener('resize', measure, { passive: true });
  addEventListener('pageshow', measure);
  addEventListener('pagehide', () => { if (frame) cancelAnimationFrame(frame); frame = 0; });
  document.addEventListener('visibilitychange', () => {
    if (document.hidden && frame) { cancelAnimationFrame(frame); frame = 0; }
    else schedule();
  });
  reduced.addEventListener('change', measure);
  wide.addEventListener('change', measure);
  root.querySelectorAll('.filmFrameSecond').forEach(image => image.addEventListener('load', schedule, { once: true }));
  document.fonts.ready.then(measure);
  measure();

  const durationValue = getComputedStyle(document.documentElement).getPropertyValue('--wc-duration-film').trim();
  const duration = parseFloat(durationValue) * (durationValue.endsWith('ms') ? 1 : 1000) || 0;
  const easing = getComputedStyle(document.documentElement).getPropertyValue('--wc-ease-settle').trim();
  const animations = new Set();
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      observer.unobserve(entry.target);
      if (reduced.matches) return;
      const animation = entry.target.animate([
        { opacity: .55, transform: 'translateY(24px)' },
        { opacity: 1, transform: 'translateY(0)' }
      ], { duration, easing });
      animations.add(animation);
      animation.finished.catch(() => {}).finally(() => animations.delete(animation));
    });
  }, { threshold: .16 });
  root.querySelectorAll('[data-film-reveal]').forEach(element => observer.observe(element));
  reduced.addEventListener('change', () => { if (reduced.matches) animations.forEach(animation => animation.cancel()); });
})();
