(() => {
  const root = document.querySelector('.filmCinema');
  if (!root) return;
  const chapters = [...root.querySelectorAll('[data-film-chapter]')];
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const wide = matchMedia('(min-width: 44rem) and (min-height: 38rem)');
  let enabled = false;
  let frame = 0;
  const animations = new Set();
  const clamp = n => Math.min(1, Math.max(0, n));
  function render() {
    frame = 0;
    if (!enabled || document.hidden) return;
    const geometry = chapters.map(el => ({el, box: el.getBoundingClientRect()}));
    geometry.forEach(({el, box}) => {
      if (box.bottom < 0 || box.top > innerHeight) return;
      const image = el.querySelector('.filmAperture img');
      const ready = image instanceof HTMLImageElement && image.complete && image.naturalWidth > 0;
      const progress = ready ? clamp(-box.top / Math.max(1, box.height - innerHeight)) : 0;
      el.style.setProperty('--film-progress', String(progress * progress * (3 - 2 * progress)));
    });
  }
  function schedule() { if (!frame && enabled && !document.hidden) frame = requestAnimationFrame(render); }
  function measure() {
    root.classList.remove('filmMotion');
    enabled = wide.matches && !reduced.matches && chapters.every(el => el.querySelector('.filmHeroContent').scrollHeight < innerHeight * .65);
    root.classList.toggle('filmMotion', enabled);
    if (enabled) render();
  }
  addEventListener('scroll', schedule, {passive:true});
  addEventListener('resize', measure, {passive:true});
  addEventListener('pageshow', measure);
  addEventListener('pagehide', () => {cancelAnimationFrame(frame);frame=0;});
  document.addEventListener('visibilitychange', () => {if(document.hidden){cancelAnimationFrame(frame);frame=0;}else schedule();});
  reduced.addEventListener('change', () => {animations.forEach(a => a.cancel());measure();});
  wide.addEventListener('change', measure);
  chapters.forEach(el => el.querySelector('.filmAperture img')?.addEventListener('load',schedule));
  document.fonts.ready.then(measure);
  measure();
  const styles = getComputedStyle(root);
  const raw = styles.getPropertyValue('--wc-duration-film').trim();
  const duration = parseFloat(raw) * (raw.endsWith('ms') ? 1 : 1000);
  const easing = styles.getPropertyValue('--wc-ease-settle').trim();
  const observer = new IntersectionObserver(entries => entries.forEach(entry => {
    if(!entry.isIntersecting) return;
    observer.unobserve(entry.target);
    if(reduced.matches) return;
    const a=entry.target.animate([{clipPath:'inset(8% 0 0)',transform:'translateY(16px)'},{clipPath:'inset(0)',transform:'translateY(0)'}],{duration,easing});
    animations.add(a);a.finished.catch(()=>{}).finally(()=>animations.delete(a));
  }),{threshold:.1});
  root.querySelectorAll('[data-film-reveal]').forEach(el=>observer.observe(el));
})();
