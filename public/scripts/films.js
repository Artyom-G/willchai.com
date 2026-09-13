(() => {
  const modal = document.querySelector('[data-film-trailer]');
  const source = document.querySelector('#filmTrailerData');
  if (!(modal instanceof HTMLDialogElement) || !source) return;
  const films = JSON.parse(source.textContent);
  const closeButton = modal.querySelector('[data-trailer-close]');
  const title = modal.querySelector('[data-trailer-title]');
  const screen = modal.querySelector('[data-trailer-screen]');
  const status = modal.querySelector('[data-trailer-status]');
  const page = modal.querySelector('[data-trailer-page]');
  const external = modal.querySelector('[data-trailer-external]');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let opener = null;
  let loadingTimer;
  let oldOverflow = '';
  let oldPadding = '';
  let generation = 0;
  let active = false;
  const animations = new Set();
  const token = name => {
    const value = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
    return Number.parseFloat(value) * (value.endsWith('ms') ? 1 : 1000) || 0;
  };
  function animate(element, frames, options) {
    if (reduced.matches) return;
    const animation = element.animate(frames, options);
    animations.add(animation);
    animation.finished.catch(() => {}).finally(() => animations.delete(animation));
  }
  function cleanUp() {
    if (!active) return;
    active = false;
    generation++;
    clearTimeout(loadingTimer);
    screen.querySelector('iframe')?.remove();
    screen.setAttribute('aria-busy', 'false');
    document.documentElement.style.overflow = oldOverflow;
    document.body.style.paddingRight = oldPadding;
    animations.forEach(animation => animation.cancel());
    animations.clear();
    if (opener?.isConnected) opener.focus({ preventScroll: true });
  }
  function openTrailer(link) {
    const film = films.find(item => item.slug === link.dataset.trailer);
    if (!film || active || modal.open) return false;
    const video = new URL(film.href).searchParams.get('v');
    if (!video || !/^[\w-]{11}$/.test(video)) return false;
    opener = link;
    active = true;
    title.textContent = film.title;
    page.href = `/films/${film.slug}/`;
    external.href = film.href;
    status.hidden = false;
    status.textContent = 'Loading trailer…';
    screen.setAttribute('aria-busy', 'true');
    const current = ++generation;
    const player = document.createElement('iframe');
    player.title = `${film.title} trailer on YouTube`;
    player.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
    player.allowFullscreen = true;
    player.referrerPolicy = 'strict-origin-when-cross-origin';
    player.src = `https://www.youtube-nocookie.com/embed/${video}?autoplay=1&playsinline=1&rel=0&cc_load_policy=1`;
    player.addEventListener('load', () => {
      if (current !== generation) return;
      clearTimeout(loadingTimer);
      screen.setAttribute('aria-busy', 'false');
      status.hidden = true;
    }, { once: true });
    player.addEventListener('error', () => {
      if (current !== generation) return;
      clearTimeout(loadingTimer);
      status.textContent = 'You can watch this trailer on YouTube.';
      screen.setAttribute('aria-busy', 'false');
      player.remove();
    }, { once: true });
    oldOverflow = document.documentElement.style.overflow;
    oldPadding = document.body.style.paddingRight;
    const scrollbar = innerWidth - document.documentElement.clientWidth;
    document.documentElement.style.overflow = 'hidden';
    if (scrollbar > 0) document.body.style.paddingRight = `${scrollbar}px`;
    modal.showModal();
    screen.append(player);
    closeButton.focus({ preventScroll: true });
    animate(modal, [
      { clipPath: 'inset(12% 0 12% 0)', transform: 'scale(.97)' },
      { clipPath: 'inset(0)', transform: 'scale(1)' }
    ], { duration: token('--wc-duration-fold'), easing: getComputedStyle(document.documentElement).getPropertyValue('--wc-ease-settle').trim() });
    loadingTimer = setTimeout(() => {
      if (current !== generation || !modal.open) return;
      screen.setAttribute('aria-busy', 'false');
      status.textContent = 'You can also watch this trailer on YouTube.';
    }, 12000);
    return true;
  }
  document.querySelectorAll('a[data-trailer]').forEach(link => {
    link.setAttribute('aria-haspopup', 'dialog');
    link.addEventListener('click', event => {
      if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      if (openTrailer(link)) event.preventDefault();
    });
  });
  function closeTrailer() {
    if (modal.open) modal.close();
    cleanUp();
  }
  closeButton.addEventListener('click', closeTrailer);
  modal.addEventListener('cancel', event => { event.preventDefault(); closeTrailer(); });
  modal.addEventListener('close', () => { if (!modal.open) cleanUp(); });
  let backdropDown = false;
  modal.addEventListener('pointerdown', event => { backdropDown = event.target === modal; });
  modal.addEventListener('click', event => {
    if (event.target === modal && backdropDown) closeTrailer();
    backdropDown = false;
  });
  addEventListener('pagehide', closeTrailer);
  reduced.addEventListener('change', () => {
    if (!reduced.matches) return;
    animations.forEach(animation => animation.cancel());
    animations.clear();
  });
})();
