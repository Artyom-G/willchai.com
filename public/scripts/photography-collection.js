(() => {
  const collection = document.querySelector('[data-photo-collection]');
  if (!collection) return;
  const toggle = collection.querySelector('[data-collection-toggle]');
  const label = collection.querySelector('[data-collection-label]');
  const status = collection.querySelector('[data-collection-status]');
  const cards = [...collection.querySelectorAll('[data-collection-photo]')];
  const chapters = [...collection.querySelectorAll('[data-featured-chapter]')].map(element => ({
    element, window:element.querySelector('.chapterWindow'), cards:[...element.querySelectorAll('[data-collection-photo]')], distance:0, height:0
  }));
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  const phone = matchMedia('(max-width: 46rem)');
  const duration = name => parseFloat(getComputedStyle(document.documentElement).getPropertyValue(name)) || 0;
  const ease = getComputedStyle(document.documentElement).getPropertyValue('--wc-ease-settle').trim();
  const clamp = value => Math.max(0, Math.min(1, value));
  const smooth = value => { const x = clamp(value); return x*x*x*(x*(x*6-15)+10); };
  let frame = 0;
  let columns = 2;
  const cardStates = new WeakMap();
  let restoringViewerFocus = false;
  const render = () => {
    frame = 0;
    if (document.hidden || !collection.classList.contains('hasPhotoSequence')) return;
    chapters.forEach(chapter => {
      const bounds = chapter.element.getBoundingClientRect();
      const rowCount = Math.ceil(chapter.cards.length / columns);
      const progress = clamp((chapter.pinTop - bounds.top) / Math.max(1,chapter.distance)) * (rowCount - 1);
      chapter.cards.forEach((card,index) => {
        const row = Math.floor(index / columns);
        const rowImages = chapter.cards.slice(row*columns,(row+1)*columns).map(el => el.querySelector('img'));
        const ready = rowImages.every(img => img.complete && img.naturalWidth);
        const arrival = row === 0 ? 1 : (ready ? smooth((progress - (row-1) - .16) / .68) : 0);
        const y = Math.round((1-arrival)*(chapter.height+16));
        const previous = cardStates.get(card);
        if(previous?.y !== y) card.style.transform = `translate3d(0,${y}px,0)`;
        const nextImages = chapter.cards.slice((row+1)*columns,(row+2)*columns).map(el => el.querySelector('img'));
        const covered = nextImages.length && nextImages.every(img => img.complete && img.naturalWidth) && progress >= row+.84;
        const visible = arrival > 0 && !covered;
        if(previous?.visible !== visible) {
          card.setAttribute('aria-hidden', String(!visible));
          card.querySelector('a').tabIndex = visible ? 0 : -1;
        }
        cardStates.set(card,{y,visible});
      });
    });
  };
  const schedule = () => { if (!frame && !document.hidden) frame = requestAnimationFrame(render); };
  const measure = () => {
    columns = phone.matches ? 1 : 2;
    const enabled = !motion.matches && collection.dataset.layout === 'sequence' && innerHeight >= 520;
    collection.classList.toggle('hasPhotoSequence',enabled);
    chapters.forEach(chapter => {
      chapter.element.style.height = '';
      chapter.element.style.removeProperty('--photo-stage');
      if (enabled) {
        const stableHeight = parseFloat(getComputedStyle(chapter.window).height);
        chapter.height = Math.round(phone.matches ? Math.min(stableHeight,chapter.window.clientWidth*1.5+58,608) : stableHeight);
        chapter.distance = Math.round(chapter.height*.8*(Math.ceil(chapter.cards.length/columns)-1));
        chapter.element.style.setProperty('--photo-stage',chapter.height+'px');
        chapter.element.style.height = (chapter.height+chapter.distance)+'px';
        chapter.pinTop = parseFloat(getComputedStyle(chapter.element.querySelector('.chapterPin')).top) || 16;
      }
      chapter.cards.forEach((card,index) => {
        cardStates.delete(card);
        card.style.setProperty('--photo-column',String(index%columns));
        card.style.zIndex = String(Math.floor(index/columns)+1);
        if (!enabled) {
          card.style.transform = '';
          card.removeAttribute('aria-hidden');
          card.querySelector('a').removeAttribute('tabindex');
        }
      });
    });
    schedule();
  };
  const setLayout = layout => {
    collection.dataset.layout = layout;
    label.textContent = layout === 'sheet' ? 'Play sequence' : 'View together';
    status.textContent = layout === 'sheet' ? cards.length+' featured photographs arranged together.' : 'Featured photograph sequence.';
    measure();
  };
  const prepare = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      prepare.unobserve(entry.target);
      entry.target.querySelectorAll('img').forEach(img => {
        img.loading = 'eager';
        img.decode().then(schedule).catch(schedule);
      });
    });
  }, { rootMargin:'120% 0px' });
  chapters.forEach(chapter => prepare.observe(chapter.element));
  toggle.hidden = false;
  setLayout(motion.matches ? 'sheet' : 'sequence');
  toggle.addEventListener('click', () => setLayout(collection.dataset.layout === 'sheet' ? 'sequence' : 'sheet'));
  addEventListener('scroll',schedule,{passive:true});
  addEventListener('resize',measure,{passive:true});
  document.fonts?.ready.then(measure);
  let width = collection.clientWidth;
  new ResizeObserver(() => { if (width !== collection.clientWidth) { width=collection.clientWidth; measure(); } }).observe(collection);
  collection.addEventListener('focusin',event => {
    if (restoringViewerFocus || !collection.classList.contains('hasPhotoSequence')) return;
    const card = event.target.closest('[data-collection-photo]');
    const chapter = chapters.find(item => item.cards.includes(card));
    if (!chapter) return;
    const row = Math.floor(chapter.cards.indexOf(card)/columns);
    const rows = Math.ceil(chapter.cards.length/columns)-1;
    const top = scrollY+chapter.element.getBoundingClientRect().top-chapter.pinTop+(row/Math.max(1,rows))*chapter.distance;
    if (Math.abs(scrollY-top)>chapter.height*.25) scrollTo({top,behavior:'instant'});
  });
  motion.addEventListener('change',() => { if(motion.matches) setLayout('sheet'); else measure(); });
  document.addEventListener('visibilitychange',() => {
    if(document.hidden) { cancelAnimationFrame(frame); frame=0; } else measure();
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
  const imageTransform = (from, to) => `translate(${from.left - to.left}px, ${from.top - to.top}px) scale(${from.width / to.width}, ${from.height / to.height})`;
  const open = (link) => {
    if (viewer.open || closing) return;
    origin = link;
    group = visibleLinks(link.dataset.photoGroup);
    const source = link.querySelector('img')?.getBoundingClientRect();
    previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    showImage(group.indexOf(link));
    viewer.showModal();
    closeButton.focus({ preventScroll: true });
    const target = image.getBoundingClientRect();
    if (!motion.matches && source?.width && target.width) {
      imageAnimation = image.animate([
        { transform: imageTransform(source, target), transformOrigin: '0 0' },
        { transform: 'none', transformOrigin: '0 0' },
      ], { duration: duration('--wc-duration-image'), easing: ease });
    }
  };
  const close = async () => {
    if (!viewer.open || closing) return;
    closing = true;
    imageAnimation?.cancel();
    const sourceLink = group[current];
    const destination = sourceLink?.querySelector('img')?.getBoundingClientRect();
    const from = image.getBoundingClientRect();
    const returnsToOrigin = sourceLink === origin && destination?.bottom > 0 && destination.top < innerHeight;
    if (!motion.matches) {
      imageAnimation = image.animate([
        { transform: 'none', opacity: 1, transformOrigin: '0 0' },
        returnsToOrigin
          ? { transform: imageTransform(destination, from), opacity: 1, transformOrigin: '0 0' }
          : { opacity: 0, transform: 'scale(0.985)', transformOrigin: '50% 50%' },
      ], { duration: duration('--wc-duration-image'), easing: ease, fill: 'forwards' });
      await imageAnimation.finished.catch(() => {});
    }
    viewer.close();
    imageAnimation?.cancel();
    document.body.style.overflow = previousOverflow;
    restoringViewerFocus = true;
    origin?.focus({ preventScroll: true });
    restoringViewerFocus = false;
    closing = false;
    schedule();
  };
  const step = (amount) => {
    if (closing) return;
    showImage(current + amount);
    if (!motion.matches) imageAnimation = image.animate([{ opacity: 0 }, { opacity: 1 }], { duration: duration('--wc-duration-interface'), easing: ease });
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
  motion.addEventListener('change', () => { if (motion.matches) imageAnimation?.cancel(); });
})();
