(() => {
  const stage = document.querySelector('[data-photographer-hello]');
  if (!stage) return;
  const sprite = stage.querySelector('.photographyCharacterSprite');
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  const key = 'willchai.photography.hello.v3';
  const token = key => {
    const value = getComputedStyle(document.documentElement).getPropertyValue(key).trim();
    const amount = parseFloat(value) || 0;
    return amount * (value.endsWith('ms') ? 1 : value.endsWith('s') ? 1000 : 1);
  };
  let played = false;
  let visible = false;
  let ready = false;
  let animations = [];
  try { played = sessionStorage.getItem(key) === 'played'; } catch {}
  const observer = new IntersectionObserver(entries => {
    visible = entries.some(entry => entry.isIntersecting);
    play();
  }, { threshold:0.6 });
  function play() {
    if (!ready || !visible || played || motion.matches || document.hidden) return;
    played = true;
    try { sessionStorage.setItem(key, 'played'); } catch {}
    observer.disconnect();
    const speed = Number(document.querySelector('[data-motion-speed]')?.value) || 1;
    const duration = token('--wc-duration-scene') / speed;
    animations = [
      sprite.animate([
        { transform:'translateY(100%)', offset:0, easing:'cubic-bezier(0.16,1,0.3,1)' },
        { transform:'translateY(0)', offset:0.15 },
        { transform:'translateY(0)', offset:0.76, easing:'ease-in-out' },
        { transform:'translateY(12px)', offset:0.83, easing:'cubic-bezier(0.55,0,1,1)' },
        { transform:'translateY(100%)', offset:1 }
      ], { duration, fill:'forwards' }),
      sprite.animate([
        { backgroundPositionX:'0%', offset:0, easing:'steps(1,end)' },
        { backgroundPositionX:'33.333333%', offset:0.24, easing:'steps(1,end)' },
        { backgroundPositionX:'66.666667%', offset:0.46, easing:'steps(1,end)' },
        { backgroundPositionX:'100%', offset:0.7, easing:'steps(1,end)' },
        { backgroundPositionX:'100%', offset:1 }
      ], { duration, fill:'forwards' })
    ];
  }
  const atlas = new Image();
  atlas.src = stage.dataset.atlas || '/photography/pixel-photographer.png';
  Promise.all([atlas.decode().catch(() => {}), document.fonts?.ready]).then(() => { ready = true; play(); });
  observer.observe(stage);
  document.querySelector('[data-replay-hello]')?.addEventListener('click', () => {
    animations.forEach(animation => animation.cancel());
    played = false; visible = true; play();
  });
  motion.addEventListener('change', () => { if (motion.matches) animations.forEach(animation => animation.cancel()); });
  document.addEventListener('visibilitychange', () => {
    animations.forEach(animation => document.hidden ? animation.pause() : animation.play());
    if (!document.hidden) play();
  });
})();
