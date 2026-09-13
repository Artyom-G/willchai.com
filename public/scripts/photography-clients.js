(() => {
  const section = document.querySelector('[data-client-proof]');
  if (!section) return;

  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
  let active = false;
  let frame = 0;

  const render = () => {
    frame = 0;
    if (!active || motion.matches || document.hidden) return;
    const bounds = section.getBoundingClientRect();
    const progress = clamp((innerHeight - bounds.top) / (innerHeight + bounds.height), 0, 1);
    section.style.setProperty('--client-photo-shift', `${(progress - 0.5) * 28}px`);
  };

  const schedule = () => {
    if (!frame && active && !motion.matches) frame = requestAnimationFrame(render);
  };

  const observer = new IntersectionObserver(([entry]) => {
    active = entry.isIntersecting;
    if (active) section.classList.add('isClientVisible');
    schedule();
  }, { threshold: 0.12, rootMargin: '5% 0px' });

  const configure = () => {
    if (motion.matches) {
      section.classList.remove('isClientMotion');
      section.classList.add('isClientVisible');
      section.style.removeProperty('--client-photo-shift');
      return;
    }
    section.classList.add('isClientMotion');
    schedule();
  };

  addEventListener('scroll', schedule, { passive: true });
  addEventListener('resize', schedule, { passive: true });
  document.addEventListener('visibilitychange', schedule);
  motion.addEventListener('change', configure);
  configure();
  observer.observe(section);
})();
