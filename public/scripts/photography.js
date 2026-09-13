const shuffleGallery = document.querySelector('[data-shuffle-gallery]');
const shuffleButton = document.querySelector('[data-shuffle-more]');
const shuffleReset = document.querySelector('[data-shuffle-reset]');
const shuffleStatus = document.querySelector('[data-shuffle-status]');

if (shuffleGallery && shuffleButton) {
  let items = [...shuffleGallery.querySelectorAll('[data-shuffle-item]')];
  let visibleCount = Math.min(36, items.length);
  let automaticLoading = location.hash !== '#photography-contact';
  let resizeFrame = 0;
  let lastWidth = 0;
  let shuffling = false;
  let shuffleAnimations = [];
  let theatre = null;
  const section = shuffleGallery.closest('.shuffleSection');
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  const randomize = () => {
    for (let i = items.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [items[i], items[j]] = [items[j], items[i]];
    }
    shuffleGallery.append(...items);
  };
  const finishShuffle = () => {
    shuffleAnimations.forEach(animation => animation.cancel());
    shuffleAnimations = [];
    theatre?.remove();
    theatre = null;
    shuffling = false;
    shuffleGallery.inert = false;
    shuffleGallery.removeAttribute('aria-busy');
    shuffleReset.removeAttribute('aria-disabled');
    shuffleReset.disabled = shuffleButton.disabled = false;
    if (automaticLoading) observer.observe(shuffleButton);
  };
  const layout = () => {
    const width = shuffleGallery.clientWidth;
    if (!width) return;
    lastWidth = width;
    const style = getComputedStyle(shuffleGallery);
    const columns = Number(style.getPropertyValue('--shuffle-columns')) || 2;
    const gap = parseFloat(style.columnGap) || 12;
    const itemWidth = (width - gap * (columns - 1)) / columns;
    const heights = Array(columns).fill(0);
    shuffleGallery.classList.add('isMasonry');
    items.slice(0, visibleCount).forEach(item => {
      const img = item.querySelector('img');
      const height = itemWidth * Number(img.getAttribute('height')) / Number(img.getAttribute('width'));
      const column = heights.indexOf(Math.min(...heights));
      Object.assign(item.style, { width: `${itemWidth}px`, height: `${height}px`, left: `${column * (itemWidth + gap)}px`, top: `${heights[column]}px` });
      heights[column] += height + gap;
    });
    shuffleGallery.style.height = `${Math.max(0, ...heights) - gap}px`;
  };
  const render = () => {
    items.forEach((item, index) => {
      item.hidden = index >= visibleCount;
      if (item.hidden) return;
      const img = item.querySelector('img[data-src]');
      if (img) { img.src = img.dataset.src; img.removeAttribute('data-src'); }
    });
    layout();
    shuffleButton.hidden = visibleCount >= items.length;
    if (shuffleStatus) shuffleStatus.textContent = `${visibleCount} photographs shown`;
  };
  const more = () => { if (shuffling) return; visibleCount = Math.min(visibleCount + 36, items.length); render(); };
  shuffleButton.addEventListener('click', more);
  const observer = new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting && automaticLoading && !shuffleButton.hidden && !document.activeElement?.closest('.photographyFooter')) more();
  }, { rootMargin: '500px 0px' });
  document.querySelectorAll('a[href="#photography-contact"]').forEach(link => link.addEventListener('click', () => { automaticLoading = false; observer.disconnect(); }));
  addEventListener('hashchange', () => {
    automaticLoading = location.hash !== '#photography-contact';
    if (automaticLoading) observer.observe(shuffleButton); else observer.disconnect();
  });
  shuffleReset?.addEventListener('click', () => {
    if (shuffling || items.length < 2) return;
    document.dispatchEvent(new CustomEvent('photography:shuffle'));
    const capture = () => items.slice(0, 4).map(item => ({
      src:item.querySelector('img').src,
      x:parseFloat(item.style.left), y:parseFloat(item.style.top),
      width:parseFloat(item.style.width), height:parseFloat(item.style.height)
    }));
    const outgoing = capture();
    observer.disconnect();
    randomize();
    visibleCount = Math.min(36, items.length);
    render();
    automaticLoading = true;
    if (motion.matches) { observer.observe(shuffleButton); return; }
    shuffling = true;
    shuffleReset.setAttribute('aria-disabled','true');
    shuffleButton.disabled = true;
    shuffleGallery.inert = true;
    shuffleGallery.setAttribute('aria-busy','true');
    const incoming = capture();
    const galleryBounds = shuffleGallery.getBoundingClientRect();
    const sectionBounds = section.getBoundingClientRect();
    const deckWidth = Math.min(112, galleryBounds.width * .3);
    const deckX = galleryBounds.width - deckWidth - 12;
    const deckY = 16;
    const rootStyle = getComputedStyle(document.documentElement);
    const time = rootStyle.getPropertyValue('--wc-duration-shuffle').trim();
    const duration = parseFloat(time) * (time.endsWith('ms') ? 1 : 1000) || 1100;
    const ease = rootStyle.getPropertyValue('--wc-ease-settle').trim();
    theatre = document.createElement('div');
    theatre.className = 'shuffleTheatre';
    theatre.setAttribute('aria-hidden','true');
    Object.assign(theatre.style,{left:galleryBounds.left-sectionBounds.left+'px',top:galleryBounds.top-sectionBounds.top+'px',width:galleryBounds.width+'px'});
    section.append(theatre);
    const deal = (photo,index,arriving) => {
      const card = document.createElement('img');
      card.className = 'shuffleDealtPhoto'; card.src = photo.src; card.alt = '';
      Object.assign(card.style,{width:photo.width+'px',height:photo.height+'px',zIndex:String((arriving?20:10)+index)});
      theatre.append(card);
      const spread = `translate3d(${photo.x}px,${photo.y}px,0) rotate(0deg) scale(1)`;
      const pileX = deckX + (index % 2 ? deckWidth * .36 : -deckWidth * .36) + (Math.floor(index / 2) * 3);
      const pileY = deckY + Math.floor(index / 2) * 4;
      const splitPile = `translate3d(${pileX}px,${pileY}px,0) rotate(${(index % 2 ? 1 : -1) * 8}deg) scale(${deckWidth/photo.width})`;
      const wovenDeck = `translate3d(${deckX+index*3}px,${deckY+index*3}px,0) rotate(${(index-1)*4}deg) scale(${deckWidth/photo.width})`;
      const frames = arriving ? [
        {transform:splitPile,opacity:0,offset:0},
        {transform:splitPile,opacity:0,offset:.36},
        {transform:splitPile,opacity:1,offset:.4+index*.025,easing:ease},
        {transform:wovenDeck,opacity:1,offset:.62+index*.035,easing:ease},
        {transform:spread,opacity:1,offset:.84+index*.03},
        {transform:spread,opacity:0,offset:1}
      ] : [
        {transform:spread,opacity:1,offset:0,easing:ease},
        {transform:splitPile,opacity:1,offset:.34+index*.025},
        {transform:splitPile,opacity:0,offset:.52},
        {transform:splitPile,opacity:0,offset:1}
      ];
      shuffleAnimations.push(card.animate(frames,{duration,fill:'both'}));
    };
    outgoing.forEach((photo,index)=>deal(photo,index,false));
    incoming.forEach((photo,index)=>deal(photo,index,true));
    const actor = document.createElement('span');
    actor.className = 'shufflePerformer';
    Object.assign(actor.style,{left:deckX-72+'px',top:'-96px'});
    const sprite = document.createElement('span'); sprite.className='shufflePerformerSprite'; actor.append(sprite); theatre.append(actor);
    shuffleAnimations.push(actor.animate([
      {transform:'translate3d(-12px,32px,0)',opacity:0,offset:0},
      {transform:'translate3d(0,-8px,0)',opacity:1,offset:.18},
      {transform:'translate3d(0,0,0)',opacity:1,offset:.3},
      {transform:'translate3d(0,-4px,0)',opacity:1,offset:.48},
      {transform:'translate3d(-4px,0,0)',opacity:1,offset:.7},
      {transform:'translate3d(0,0,0)',opacity:1,offset:.8},
      {transform:'translate3d(0,24px,0)',opacity:0,offset:1}
    ].map(frame=>({...frame,easing:ease})),{duration,fill:'both'}));
    shuffleAnimations.push(sprite.animate([
      {backgroundPositionX:'0%',offset:0},
      {backgroundPositionX:'33.333333%',offset:.24},
      {backgroundPositionX:'66.666667%',offset:.4},
      {backgroundPositionX:'33.333333%',offset:.62},
      {backgroundPositionX:'100%',offset:.8}
    ].map(frame=>({...frame,easing:'steps(1,end)'})),{duration,fill:'both'}));
    const reveal = shuffleGallery.animate([{opacity:0,offset:0},{opacity:0,offset:.72},{opacity:1,offset:1}],{duration,fill:'both'});
    shuffleAnimations.push(reveal);
    reveal.finished.then(finishShuffle).catch(()=>{});
  });
  motion.addEventListener('change',()=>{ if (motion.matches && shuffling) finishShuffle(); });
  document.addEventListener('visibilitychange',()=>{ if (document.hidden && shuffling) finishShuffle(); });
  new ResizeObserver(() => {
    if (shuffleGallery.clientWidth === lastWidth || resizeFrame) return;
    if (shuffling) finishShuffle();
    resizeFrame = requestAnimationFrame(() => { resizeFrame = 0; layout(); });
  }).observe(shuffleGallery);
  randomize();
  render();
  if (automaticLoading) observer.observe(shuffleButton);
}

const contactTickets = document.querySelectorAll("[data-contact-ticket]");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

if (contactTickets.length) {
  class ContactTicket {
    constructor(card) {
      this.card = card;
      this.surface = card.querySelector(".photographyTicketSurface");
      this.status = card.querySelector("[data-ticket-status]");
      this.originalStatus = this.status?.textContent || "";
      this.targetX = 0;
      this.currentX = 0;
      this.targetY = 0;
      this.currentY = 0;
      this.targetScale = 1;
      this.currentScale = 1;
      this.bounce = 0;
      this.velocity = 0;
      this.isVisible = false;
      this.isHovering = false;
      this.isJiggling = false;
      this.frame = 0;
      this.jiggleTimer = 0;
      this.jigglePhases = [];
      this.statusTimer = 0;
      this.hologramTimer = 0;
      this.observe();
      this.listen();
    }

    observe() {
      this.observer = new IntersectionObserver(
        ([entry]) => {
          this.isVisible = entry.isIntersecting;
          if (this.isVisible) this.scheduleJiggle();
          else this.stop();
        },
        { rootMargin: "50px", threshold: 0.1 },
      );
      this.observer.observe(this.card);
    }

    listen() {
      this.card.addEventListener("mouseenter", () => {
        if (reducedMotion.matches) return;
        this.cancelJiggle();
        this.isHovering = true;
        this.targetScale = 1.1;
        this.animate();
      });

      this.card.addEventListener("mousemove", (event) => {
        if (reducedMotion.matches) return;
        const bounds = this.card.getBoundingClientRect();
        const x = event.clientX - bounds.left;
        const y = event.clientY - bounds.top;
        this.targetX = ((y - bounds.height / 2) / (bounds.height / 2)) * -20;
        this.targetY = ((x - bounds.width / 2) / (bounds.width / 2)) * 20;
        this.card.style.setProperty("--mouse-x", `${(x / bounds.width) * 100}%`);
        this.card.style.setProperty("--mouse-y", `${(y / bounds.height) * 100}%`);
        this.animate();
      });

      this.card.addEventListener("mouseleave", () => {
        this.isHovering = false;
        this.targetX = 0;
        this.targetY = 0;
        this.targetScale = 1;
        this.scheduleJiggle();
        this.animate();
      });

      this.card.addEventListener("click", () => this.activate());
    }

    animate() {
      if (!this.isVisible || reducedMotion.matches || this.frame) return;
      this.card.classList.add("isMoving");
      this.frame = window.requestAnimationFrame(() => this.update());
    }

    update() {
      this.frame = 0;

      if (this.velocity !== 0) {
        this.velocity -= 0.004;
        this.bounce += this.velocity;
        this.velocity *= 0.95;
        if (this.bounce < 0) {
          this.bounce = 0;
          this.velocity = 0;
        }
      }

      this.currentX += (this.targetX - this.currentX) * 0.075;
      this.currentY += (this.targetY - this.currentY) * 0.075;
      this.currentScale += (this.targetScale - this.currentScale) * 0.075;

      const angle = 180 + this.currentY * 2 + this.currentX * 2;
      this.card.style.setProperty("--gradient-angle", `${angle}deg`);
      this.card.style.setProperty("--gradient-angle-inv", `${-angle}deg`);
      this.card.style.setProperty("--holo-rot-x", `${this.currentX * 1.5}deg`);
      this.card.style.setProperty("--holo-rot-y", `${this.currentY * 1.5}deg`);
      this.card.style.transform = `perspective(1200px) rotateX(${this.currentX}deg) rotateY(${this.currentY}deg) scale(${this.currentScale + this.bounce})`;

      const settled =
        Math.abs(this.targetX - this.currentX) < 0.01 &&
        Math.abs(this.targetY - this.currentY) < 0.01 &&
        Math.abs(this.targetScale - this.currentScale) < 0.0005 &&
        this.velocity === 0 &&
        this.bounce === 0 &&
        !this.isJiggling;

      if (settled) this.card.classList.remove("isMoving");
      else this.animate();
    }

    scheduleJiggle() {
      window.clearTimeout(this.jiggleTimer);
      if (!this.isVisible || this.isHovering || reducedMotion.matches) return;
      this.jiggleTimer = window.setTimeout(() => this.playJiggle(), 3000);
    }

    playJiggle() {
      if (!this.isVisible || this.isHovering) return;
      this.isJiggling = true;
      this.targetY = 12;
      this.animate();
      this.jigglePhases = [
        window.setTimeout(() => {
          this.targetY = -12;
          this.animate();
        }, 150),
        window.setTimeout(() => {
          this.targetY = 0;
          this.isJiggling = false;
          this.jigglePhases = [];
          this.scheduleJiggle();
          this.animate();
        }, 300),
      ];
    }

    cancelJiggle() {
      window.clearTimeout(this.jiggleTimer);
      this.jigglePhases.forEach((timer) => window.clearTimeout(timer));
      this.jigglePhases = [];
      this.isJiggling = false;
    }

    stop() {
      this.cancelJiggle();
      if (this.frame) window.cancelAnimationFrame(this.frame);
      this.frame = 0;
      this.card.classList.remove("isMoving");
    }

    async activate() {
      this.card.classList.add("isHolographic");
      window.clearTimeout(this.hologramTimer);
      this.hologramTimer = window.setTimeout(() => this.card.classList.remove("isHolographic"), 4000);
      this.velocity = reducedMotion.matches ? 0 : 0.02;
      this.animate();

      try {
        await navigator.clipboard.writeText("me@willchai.com");
        if (this.status) this.status.textContent = "copied to clipboard!";
      } catch {
        if (this.status) this.status.textContent = "me@willchai.com, ready to copy";
      }

      window.clearTimeout(this.statusTimer);
      this.statusTimer = window.setTimeout(() => {
        if (this.status) this.status.textContent = this.originalStatus;
      }, 4000);
    }
  }

  contactTickets.forEach((ticket) => new ContactTicket(ticket));
}
