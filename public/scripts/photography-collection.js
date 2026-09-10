(() => {
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  const duration = key => {
    const value = getComputedStyle(document.documentElement).getPropertyValue(key).trim();
    return (parseFloat(value) || 0) * (value.endsWith('ms') ? 1 : value.endsWith('s') ? 1000 : 1);
  };
  const ease = getComputedStyle(document.documentElement).getPropertyValue('--wc-ease-settle').trim();
  const viewer = document.querySelector('[data-photo-viewer]');
  if (!viewer || typeof viewer.showModal !== 'function') return;
  const image = viewer.querySelector('[data-viewer-image]');
  const caption = viewer.querySelector('[data-viewer-caption]');
  const count = viewer.querySelector('[data-viewer-count]');
  const closeButton = viewer.querySelector('[data-viewer-close]');
  const previousButton = viewer.querySelector('[data-viewer-previous]');
  const nextButton = viewer.querySelector('[data-viewer-next]');
  const stage = viewer.querySelector('[data-viewer-stage]');
  const referenceButton = viewer.querySelector('[data-viewer-reference]');
  const viewerStatus = viewer.querySelector('[data-viewer-status]');
  const references = new Map();
  let origin = null;
  let group = [];
  let current = 0;
  let closing = false;
  let previousOverflow = '';
  let imageAnimation = null;
  let touchStart = null;
  let swipeConsumed = false;

  const updateReference = () => {
    const selected = references.has(group[current]?.href);
    referenceButton.setAttribute('aria-pressed',String(selected));
    referenceButton.querySelector('span').textContent = selected ? 'Reference added' : 'Add reference';
    referenceButton.querySelector('path').setAttribute('d',selected ? 'm5 12 4 4L19 6' : 'M12 5v14M5 12h14');
  };
  const publishReferences = () => {
    const selected = [...references.values()];
    document.querySelectorAll('[data-reference-return]').forEach(link => {
      link.hidden = !selected.length;
      link.textContent = 'Your shoot · '+selected.length+' reference'+(selected.length===1?'':'s');
    });
    document.dispatchEvent(new CustomEvent('photography:references',{detail:selected}));
    updateReference();
  };
  referenceButton.addEventListener('click',() => {
    const link = group[current];
    if (!link) return;
    const thumb = link.querySelector('img');
    if (references.has(link.href)) {
      references.delete(link.href);
      viewerStatus.textContent = 'Reference removed from your shoot.';
    } else {
      references.set(link.href,{id:link.href,src:link.href,url:link.href,alt:thumb.alt,caption:link.dataset.caption||thumb.alt,width:thumb.width,height:thumb.height});
      viewerStatus.textContent = 'Reference added to your shoot. You can keep looking through the photographs.';
    }
    publishReferences();
  });
  document.addEventListener('photography:remove-reference',event => {
    references.delete(event.detail);
    publishReferences();
  });

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
    viewerStatus.textContent = '';
    updateReference();
  };
  let viewerVersion=0;
  let requestedImage=0;
  let departing=null;
  let departureAnimation=null;
  const clearTransition=()=>{
    imageAnimation?.cancel(); departureAnimation?.cancel();
    departing?.remove(); departing=null;
  };
  const revealImage=(direction=1)=>{
    if(motion.matches) return;
    imageAnimation=image.animate([
      {clipPath:direction>0?'inset(0 100% 0 0)':'inset(0 0 0 100%)',transform:'scaleX(1.22)',transformOrigin:direction>0?'0 50%':'100% 50%'},
      {clipPath:'inset(0)',transform:'scaleX(1)',transformOrigin:direction>0?'0 50%':'100% 50%'}
    ],{duration:duration('--wc-duration-photo-stretch'),easing:ease});
  };
  const open = (link) => {
    if (viewer.open || closing) return;
    origin = link;
    group = visibleLinks(link.dataset.photoGroup);
    previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    requestedImage=group.indexOf(link);
    showImage(requestedImage);
    viewer.showModal();
    closeButton.focus({preventScroll:true});
    const version=++viewerVersion;
    image.decode().catch(()=>{}).then(()=>{ if(version===viewerVersion && viewer.open) revealImage(); });
  };
  const close = () => {
    if(!viewer.open || closing) return;
    ++viewerVersion; clearTransition();
    viewer.close();
    document.body.style.overflow=previousOverflow;
    origin?.focus({preventScroll:true});
  };
  const step = async amount => {
    if(closing || !viewer.open) return;
    const version=++viewerVersion;
    requestedImage=(requestedImage+amount+group.length)%group.length;
    const target=requestedImage;
    const prepared=new Image(); prepared.src=group[target].href;
    try { await prepared.decode(); }
    catch { if(version===viewerVersion) viewerStatus.textContent='Please try opening this photograph again.'; return; }
    if(version!==viewerVersion || !viewer.open) return;
    clearTransition();
    if(!motion.matches) {
      departing=image.cloneNode(false);
      departing.removeAttribute('data-viewer-image');
      departing.className='viewerDeparting';
      departing.alt=''; departing.setAttribute('aria-hidden','true');
      stage.append(departing);
      departureAnimation=departing.animate([
        {clipPath:'inset(0)',transform:'scaleX(1)',transformOrigin:amount>0?'100% 50%':'0 50%'},
        {clipPath:amount>0?'inset(0 0 0 100%)':'inset(0 100% 0 0)',transform:'scaleX(.78)',transformOrigin:amount>0?'100% 50%':'0 50%'}
      ],{duration:duration('--wc-duration-photo-stretch'),easing:ease,fill:'forwards'});
    }
    showImage(target); revealImage(amount);
    await imageAnimation?.finished.catch(()=>{});
    if(version===viewerVersion) { departing?.remove(); departing=null; departureAnimation?.cancel(); }
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
  motion.addEventListener('change', () => { if (motion.matches) clearTransition(); });
})();
