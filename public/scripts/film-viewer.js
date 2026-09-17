(() => {
  const dialog = document.querySelector('[data-film-viewer]');
  if (!(dialog instanceof HTMLDialogElement)) return;
  const image = dialog.querySelector('[data-viewer-image]');
  let trigger;
  let overflow;
  document.addEventListener('click', event => {
    const link = event.target.closest('[data-film-image]');
    if (!link || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    trigger = link;
    const source = link.querySelector('img');
    image.src = link.href;
    image.alt = source.alt;
    overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    dialog.showModal();
  });
  dialog.querySelector('[data-viewer-close]').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => {if(event.target===dialog){const b=dialog.getBoundingClientRect();if(event.clientX<b.left||event.clientX>b.right||event.clientY<b.top||event.clientY>b.bottom)dialog.close();}});
  dialog.addEventListener('close', () => {document.body.style.overflow=overflow||'';image.removeAttribute('src');trigger?.focus({preventScroll:true});});
})();
