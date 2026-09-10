(() => {
  const viewer = document.querySelector('[data-photo-viewer]');
  if (!viewer || typeof viewer.showModal !== 'function') return;

  const image = viewer.querySelector('[data-viewer-image]');
  const caption = viewer.querySelector('[data-viewer-caption]');
  const count = viewer.querySelector('[data-viewer-count]');
  const close = viewer.querySelector('[data-viewer-close]');
  const previous = viewer.querySelector('[data-viewer-previous]');
  const next = viewer.querySelector('[data-viewer-next]');
  let origin = null;
  let group = [];
  let current = 0;

  const draw = () => {
    const photo = group[current];
    if (!photo) return;
    const source = photo.querySelector('img');
    image.src = photo.href;
    image.alt = source?.alt || '';
    caption.textContent = photo.dataset.caption || '';
    if (count) count.textContent = '';
    previous.disabled = current === 0;
    next.disabled = current === group.length - 1;
  };

  const show = index => {
    current = Math.max(0, Math.min(index, group.length - 1));
    draw();
  };

  document.addEventListener('click', event => {
    const link = event.target.closest('[data-photo-open]');
    if (!link) return;
    event.preventDefault();
    origin = link;
    group = [...document.querySelectorAll('[data-photo-open]')].filter(candidate => candidate.dataset.photoGroup === link.dataset.photoGroup);
    show(group.indexOf(link));
    viewer.showModal();
    close.focus();
  });

  close.addEventListener('click', () => viewer.close());
  previous.addEventListener('click', () => show(current - 1));
  next.addEventListener('click', () => show(current + 1));
  viewer.addEventListener('close', () => origin?.focus({ preventScroll: true }));
  viewer.addEventListener('keydown', event => {
    if (event.key === 'ArrowLeft') show(current - 1);
    if (event.key === 'ArrowRight') show(current + 1);
  });
})();
