(() => {
  const arcade = document.querySelector('[data-shoot-arcade]');
  if (!arcade) return;
  const form = arcade.querySelector('[data-shoot-builder]');
  const scene = arcade.querySelector('[data-gold-scene]');
  const replay = arcade.querySelector('[data-replay-scene]');
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  const image = arcade.querySelector('[data-shoot-image]');
  const summary = arcade.querySelector('[data-shoot-summary]');
  const note = arcade.querySelector('[data-shoot-note]');
  const send = arcade.querySelector('[data-shoot-send]');
  const assetRoot = arcade.dataset.assetRoot || '';
  const options = {
    'Portraits': { image:'/photography/portrait-lakeshore.webp', alt:'Lakeshore portrait', width:1707, height:2560, note:'We can choose a place and make time to get comfortable in front of the camera.' },
    'Events': { image:'/photography/concert-mcmaster.avif', alt:'Live performance at McMaster University', width:1920, height:2400, note:'Share the occasion and the schedule. We can plan coverage around the moments you want to remember.' },
    'Another idea': { image:'/photography/product-eyewear.webp', alt:'Eyewear photograph', width:1920, height:2333, note:'Tell me what you’re making or imagining. We can work out the photographs together.' },
  };
  let played = false;
  let replayFrame = 0;
  let previewAnimation = null;
  const finish = () => { scene.classList.remove('isReady','isPlaying'); replay.hidden = motion.matches; };
  const play = () => {
    cancelAnimationFrame(replayFrame);
    if (motion.matches) return finish();
    played = true;
    scene.classList.remove('isPlaying');
    scene.classList.add('isReady');
    void scene.offsetWidth;
    scene.classList.add('isPlaying');
    replay.hidden = false;
  };
  if (!motion.matches) scene.classList.add('isReady');
  const observer = new IntersectionObserver(entries => {
    if (entries.some(entry => entry.isIntersecting) && !played) { play(); observer.disconnect(); }
  }, { rootMargin:'0px 0px -20% 0px', threshold:0 });
  observer.observe(arcade.querySelector('.arcadeCabinet'));
  scene.addEventListener('animationend', event => { if (event.target.classList.contains('goldPlan')) finish(); });
  replay.addEventListener('click', play);
  form.addEventListener('focusin', () => { played = true; finish(); observer.disconnect(); });
  form.addEventListener('pointerdown', () => { played = true; finish(); observer.disconnect(); });
  const values = () => Object.fromEntries(new FormData(form));
  const update = () => {
    const data = values();
    const selected = options[data.kind] || options.Portraits;
    summary.textContent = [data.kind, data.duration, data.location.trim(), data.date.trim()].filter(Boolean).join(' · ');
    note.textContent = selected.note;
    send.href = emailFor(data);
    const imagePath = assetRoot + selected.image;
    if (image.getAttribute('src') !== imagePath) {
      previewAnimation?.cancel();
      image.src = imagePath; image.alt = selected.alt; image.width = selected.width; image.height = selected.height;
      if (!motion.matches) previewAnimation = image.animate([{ opacity:0.35, transform:'translateX(12px)' },{ opacity:1, transform:'none' }], { duration:360, easing:'ease-out' });
    }
  };
  form.addEventListener('input', update);
  form.addEventListener('change', update);
  const emailFor = data => {
    const body = ['Hi Will,', '', `I’m planning: ${data.kind}`, `Time: ${data.duration}`, `Location: ${data.location.trim() || 'Let’s work it out'}`, `Date: ${data.date.trim() || 'Let’s work it out'}`, '', data.idea.trim(), '', 'Could you put together a quote for me?'].join('\n');
    return `mailto:me@willchai.com?subject=${encodeURIComponent(`Photography inquiry: ${data.kind}`)}&body=${encodeURIComponent(body)}`;
  };
  form.addEventListener('submit', event => { event.preventDefault(); location.href = emailFor(values()); });
  motion.addEventListener('change', () => { if (motion.matches) { finish(); previewAnimation?.cancel(); } });
  document.addEventListener('visibilitychange', () => scene.classList.toggle('isPaused', document.hidden));
  update();
})();
