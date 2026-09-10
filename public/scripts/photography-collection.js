(() => {
  const collection = document.querySelector('[data-photo-collection]');
  if (!collection) return;
  const rail = collection.querySelector('.collectionImages');
  const toggle = collection.querySelector('[data-collection-toggle]');
  const label = collection.querySelector('[data-collection-label]');
  const status = collection.querySelector('[data-collection-status]');
  const cards = [...collection.querySelectorAll('[data-collection-photo]')];
  const paging = collection.querySelector('[data-collection-paging]');
  const previous = collection.querySelector('[data-strip-previous]');
  const next = collection.querySelector('[data-strip-next]');
  const stripCount = collection.querySelector('[data-collection-count]');
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  const duration = key => {
    const value = getComputedStyle(document.documentElement).getPropertyValue(key).trim();
    return (parseFloat(value) || 0) * (value.endsWith('ms') ? 1 : value.endsWith('s') ? 1000 : 1);
  };
  const ease = getComputedStyle(document.documentElement).getPropertyValue('--wc-ease-settle').trim();
  let frame = 0;
  let active = 0;
  let offsets = [];
  let velocity = 0;
  let lastScroll = rail.scrollLeft;
  let lastTime = performance.now();
  let lastEvent = 0;
  let stretch = 0;
  let composing = false;
  let composed = false;
  let composition = [];
  const cleanFrames = () => cards.forEach(card => {
    card.querySelector('[data-photo-open]').style.transform = '';
  });
  const announceComposition = () => {
    composing = false;
    composition.forEach(a => a.cancel());
    composition = [];
    collection.classList.remove('isComposing');
    document.dispatchEvent(new CustomEvent('photography:composed'));
  };
  const render = time => {
    frame = 0;
    if (document.hidden || collection.dataset.layout !== 'strip') return;
    active = offsets.reduce((best,x,i) => Math.abs(x-rail.scrollLeft)<Math.abs(offsets[best]-rail.scrollLeft)?i:best,0);
    if(rail.scrollLeft>=rail.scrollWidth-rail.clientWidth-2) active=cards.length-1;
    stripCount.textContent = String(active+1).padStart(2,'0')+' / '+cards.length;
    previous.disabled = rail.scrollLeft < 2;
    next.disabled = rail.scrollLeft >= rail.scrollWidth-rail.clientWidth-2;
    const target = time-lastEvent<70 && !motion.matches && !composing ? Math.min(.16,Math.abs(velocity)*.055) : 0;
    stretch += (target-stretch)*.22;
    if (!composing) {
      cards.forEach((card,i) => {
        const visible = offsets[i]+card.offsetWidth>rail.scrollLeft && offsets[i]<rail.scrollLeft+rail.clientWidth;
        card.querySelector('[data-photo-open]').style.transform = visible && stretch>.001 ? `scaleX(${1+stretch}) scaleY(${1-stretch*.35})` : '';
      });
    }
    if(stretch>.001 || target>0) frame=requestAnimationFrame(render);
  };
  const schedule = () => { if(!frame) frame=requestAnimationFrame(render); };
  const measure = () => {
    const left = cards[0]?.offsetLeft || 0;
    offsets = cards.map(card=>card.offsetLeft-left);
    schedule();
  };
  const go = index => {
    announceComposition();
    const target = Math.max(0,Math.min(cards.length-1,index));
    cards.slice(target,target+3).forEach(card=>card.querySelector('img').loading='eager');
    rail.scrollTo({left:offsets[target],behavior:motion.matches?'instant':'smooth'});
  };
  const setLayout = layout => {
    announceComposition(); cleanFrames();
    collection.dataset.layout=layout;
    label.textContent=layout==='sheet'?'View strip':'View together';
    paging.hidden=layout==='sheet';
    rail.tabIndex=layout==='strip'?0:-1;
    rail.setAttribute('aria-label',layout==='strip'?'Featured photographs. Scroll sideways to browse.':'Featured photographs arranged together.');
    status.textContent=layout==='sheet'?cards.length+' featured photographs arranged together.':'Featured photographs in a horizontal strip.';
    measure();
  };
  const compose = async () => {
    if(composed) return;
    composed=true;
    if(motion.matches || rail.scrollLeft>8 || collection.dataset.layout!=='strip') return announceComposition();
    const bounds=rail.getBoundingClientRect();
    const visible=cards.filter(card=>card.getBoundingClientRect().left<bounds.right).slice(0,4);
    await Promise.all(visible.map(card=>card.querySelector('img').decode().catch(()=>{})));
    if(rail.scrollLeft>8 || motion.matches || collection.dataset.layout!=='strip') return announceComposition();
    composing=true;
    collection.classList.add('isComposing');
    const centre=bounds.left+Math.min(bounds.width*.5,480);
    composition=visible.map((card,i)=>{
      const box=card.getBoundingClientRect();
      const x=centre-(box.left+box.width/2);
      const angle=(i-(visible.length-1)/2)*9;
      return card.querySelector('[data-photo-open]').animate([
        {transform:`translate(${x}px,28px) rotate(${angle}deg) scale(.72)`,offset:0},
        {transform:`translate(${x*.75}px,-12px) rotate(${angle*.65}deg) scale(.85)`,offset:.24,easing:ease},
        {transform:'translate(0,0) rotate(0) scale(1)',offset:1}
      ],{duration:duration('--wc-duration-photo-compose'),delay:i*55,easing:'linear',fill:'both'});
    });
    await Promise.all(composition.map(a=>a.finished.catch(()=>{})));
    announceComposition();
  };
  toggle.hidden=false; paging.hidden=false;
  if(motion.matches) setLayout('sheet');
  toggle.addEventListener('click',()=>setLayout(collection.dataset.layout==='strip'?'sheet':'strip'));
  previous.addEventListener('click',()=>go(active-1));
  next.addEventListener('click',()=>go(active+1));
  rail.addEventListener('scroll',()=>{
    const now=performance.now();
    velocity=(rail.scrollLeft-lastScroll)/Math.max(8,now-lastTime);
    lastScroll=rail.scrollLeft; lastTime=now; lastEvent=now;
    if(composing) announceComposition();
    schedule();
  },{passive:true});
  rail.addEventListener('pointerdown',()=>{ if(composing) announceComposition(); },{passive:true});
  rail.addEventListener('keydown',event=>{
    if(event.target!==rail || collection.dataset.layout!=='strip') return;
    const destinations={ArrowRight:active+1,ArrowLeft:active-1,Home:0,End:cards.length-1};
    if(event.key in destinations) { event.preventDefault(); go(destinations[event.key]); }
  });
  const prepare=new IntersectionObserver(entries=>entries.forEach(entry=>{
    if(!entry.isIntersecting) return;
    prepare.unobserve(entry.target);
    entry.target.querySelector('img').loading='eager';
  }),{root:rail,rootMargin:'0px 100%'});
  cards.forEach(card=>prepare.observe(card));
  const entrance=new IntersectionObserver(entries=>{
    if(entries.some(entry=>entry.isIntersecting)) { entrance.disconnect(); compose(); }
  },{threshold:.25});
  entrance.observe(rail);
  new ResizeObserver(measure).observe(rail);
  document.fonts?.ready.then(measure);
  motion.addEventListener('change',()=>{ announceComposition(); cleanFrames(); if(motion.matches) setLayout('sheet'); });
  document.addEventListener('visibilitychange',()=>{
    if(document.hidden) { cancelAnimationFrame(frame); frame=0; if(composing) announceComposition(); cleanFrames(); }
    else { stretch=0; measure(); }
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
    if(composing) announceComposition();
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
    schedule();
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
