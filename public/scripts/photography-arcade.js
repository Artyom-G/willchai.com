(() => {
  const arcade = document.querySelector('[data-shoot-arcade]');
  if (!arcade) return;
  const form = arcade.querySelector('[data-shoot-builder]');
  const scene = arcade.querySelector('[data-gold-scene]');
  const replay = arcade.querySelector('[data-replay-scene]');
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  const nameInput = form.elements.namedItem('title');
  const budgetInput = form.elements.namedItem('budget');
  const guidance = form.elements.namedItem('guidance');
  const subject = arcade.querySelector('[data-inquiry-subject]');
  const message = arcade.querySelector('[data-inquiry-message]');
  const send = arcade.querySelector('[data-shoot-send]');
  const copy = arcade.querySelector('[data-copy-inquiry]');
  const status = arcade.querySelector('[data-inquiry-status]');
  const next = arcade.querySelector('[data-shoot-next]');
  const back = arcade.querySelector('[data-shoot-back]');
  const window = arcade.querySelector('[data-shoot-steps]');
  const steps = [...arcade.querySelectorAll('[data-shoot-step]')];
  const pointer = arcade.querySelector('[data-builder-pointer]');
  const token = key => parseFloat(getComputedStyle(document.documentElement).getPropertyValue(key)) || 0;
  const ease = getComputedStyle(document.documentElement).getPropertyValue('--wc-ease-settle').trim();
  const tidy = value => String(value || '').replace(/[\r\n\t]+/g,' ').trim();
  let step = 0;
  let changing = false;
  let transitions = [];
  let transitionVersion = 0;
  let played = false;
  let inquiryBody = '';
  let references = [];
  let imageVersion = 0;
  let statusTimer = 0;
  const image = arcade.querySelector('[data-shoot-image]');
  const defaultImage = {src:image.src,alt:image.alt};

  const finishScene = () => {
    scene.classList.remove('isReady','isPlaying');
    replay.hidden = motion.matches;
  };
  const playScene = () => {
    if (motion.matches) return finishScene();
    played = true;
    scene.classList.remove('isPlaying');
    scene.classList.add('isReady');
    void scene.offsetWidth;
    scene.classList.add('isPlaying');
    replay.hidden = false;
  };
  const sceneObserver = new IntersectionObserver(entries => {
    if(entries.some(entry=>entry.isIntersecting) && !played) {
      playScene();
      sceneObserver.disconnect();
    }
  },{rootMargin:'0px 0px -22% 0px',threshold:0});
  const engage = () => { played=true; finishScene(); sceneObserver.disconnect(); };
  if (!motion.matches && location.hash !== '#pricing') scene.classList.add('isReady');
  if (location.hash === '#pricing') engage(); else sceneObserver.observe(arcade.querySelector('.arcadeCabinet'));
  scene.addEventListener('animationend',event => { if(event.target.classList.contains('pushingWill')) finishScene(); });
  replay.addEventListener('click',playScene);
  form.addEventListener('focusin',engage);
  form.addEventListener('pointerdown',engage);
  document.querySelectorAll('a[href="#pricing"]').forEach(link => link.addEventListener('click',engage));

  const fitName = () => {
    nameInput.style.height='auto';
    nameInput.style.height=nameInput.scrollHeight+'px';
  };
  const update = () => {
    budgetInput.disabled=guidance.checked;
    const data=Object.fromEntries(new FormData(form));
    const title=tidy(data.title);
    const place=tidy(data.location);
    const date=tidy(data.date);
    const budget=guidance.checked?'':tidy(data.budget);
    const notes=String(data.idea||'').trim();
    arcade.querySelector('[data-shoot-summary-title]').textContent=title||'Your shoot';
    arcade.querySelector('[data-shoot-summary]').textContent=[place,date].filter(Boolean).join(' · ')||'Your plans, taking shape.';
    const budgetSummary=arcade.querySelector('[data-budget-summary]');
    budgetSummary.hidden=!(budget||guidance.checked);
    budgetSummary.textContent=budget?'Your budget: '+budget+' CAD':'I’d like guidance on the budget.';
    subject.textContent=(title||'Photography inquiry')+(title?' | Photography inquiry':'');
    const details=[place?'Place: '+place:'',date?'Date: '+date:''].filter(Boolean);
    inquiryBody=[
      'Hi Will,','',
      title?'I’m planning '+title+' and would like to talk about photography.':'I’d like to talk about a photography shoot.',
      ...(details.length?['',...details]:[]),
      '',budget?'My photography budget is '+budget+' CAD.':'I’d appreciate your guidance on the budget.',
      ...(notes?['',notes]:[]),
      ...(references.length?['','Photographs I have in mind:',...references.map((ref,index)=>(index+1)+'. '+ref.caption+'\n'+ref.url)]:[]),
      '','Could you suggest an approach and put together a quote?',''
    ].join('\n');
    message.value=inquiryBody;
    send.href='mailto:me@willchai.com?subject='+encodeURIComponent(subject.textContent)+'&body='+encodeURIComponent(inquiryBody);
    fitName();
  };
  const syncStep = () => {
    steps.forEach((element,index)=>{ element.hidden=index!==step; element.inert=index!==step; element.classList.remove('isOutgoing'); element.querySelector('[data-step-grip]').style.left=''; element.querySelector('[data-step-grip]').style.right=''; });
    window.classList.remove('isChanging');
    window.style.height='';
    next.hidden=step===2;
    back.hidden=step===0;
    next.disabled=back.disabled=false;
    arcade.querySelector('[data-step-label]').textContent=['Your plans','A little more, if you like','Your inquiry is ready'][step];
    arcade.querySelector('[data-step-count]').textContent=(step+1)+' of 3';
    changing=false;
  };
  const moveTo = async target => {
    if(changing || target<0 || target>2 || target===step) return;
    engage();
    const version=++transitionVersion;
    const outgoing=steps[step];
    const incoming=steps[target];
    const direction=target>step?1:-1;
    const fromHeight=window.getBoundingClientRect().height;
    const pointerBounds=pointer.getBoundingClientRect();
    const handle=outgoing.querySelector('[data-step-grip]');
    if(direction<0) { handle.style.left='0'; handle.style.right='auto'; }
    const grip=handle.getBoundingClientRect();
    const width=window.clientWidth;
    const reachX=grip.left-pointerBounds.left-pointerBounds.width*.05;
    const reachY=grip.top+4-pointerBounds.top-pointerBounds.width*.05;
    step=target;
    const focusStep = () => {
      const focus = target===2 ? send : incoming.querySelector('input,textarea');
      const bounds = focus.getBoundingClientRect();
      if(bounds.top<24 || bounds.bottom>innerHeight-24) {
        const heading=arcade.querySelector('.shootStepHeading').getBoundingClientRect();
        scrollTo({top:scrollY+heading.top-24,behavior:motion.matches?'instant':'smooth'});
      }
      focus.focus({preventScroll:true});
    };
    if(motion.matches) { syncStep(); focusStep(); return; }
    changing=true;
    next.disabled=back.disabled=true;
    outgoing.classList.add('isOutgoing');
    outgoing.inert=true;
    incoming.hidden=false;
    incoming.inert=true;
    window.classList.add('isChanging');
    const toHeight=incoming.getBoundingClientRect().height;
    const length=token('--wc-duration-layout');
    const motionFrames=(from,to)=>[
      {transform:from,offset:0},
      {transform:from,offset:.24,easing:ease},
      {transform:to,offset:.8},
      {transform:to,offset:1}
    ];
    const pull=-direction*(width+16);
    transitions=[
      outgoing.animate(motionFrames('translateX(0)',`translateX(${pull}px)`),{duration:length,fill:'both'}),
      incoming.animate(motionFrames(`translateX(${-pull}px)`,'translateX(0)'),{duration:length,fill:'both'}),
      pointer.animate([
        {transform:'translate(0,0)',offset:0,easing:ease},
        {transform:`translate(${reachX}px,${reachY}px)`,offset:.2},
        {transform:`translate(${reachX}px,${reachY+3}px)`,offset:.24,easing:ease},
        {transform:`translate(${reachX+pull}px,${reachY+3}px)`,offset:.8,easing:ease},
        {transform:'translate(0,0)',offset:1}
      ],{duration:length,fill:'both'}),
      window.animate([{height:fromHeight+'px',offset:0},{height:fromHeight+'px',offset:.24},{height:toHeight+'px',offset:1}],{duration:length,easing:ease,fill:'both'})
    ];
    await Promise.all(transitions.map(animation=>animation.finished.catch(()=>{})));
    if(version!==transitionVersion) return;
    transitions.forEach(animation=>animation.cancel());
    transitions=[];
    syncStep();
    focusStep();
  };
  form.addEventListener('submit',event=>{ event.preventDefault(); if(step<2) moveTo(step+1); });
  back.addEventListener('click',()=>moveTo(step-1));
  form.addEventListener('input',update);
  form.addEventListener('change',update);
  const announce=text=>{ clearTimeout(statusTimer); status.textContent=text; statusTimer=setTimeout(()=>{status.textContent='';},7000); };
  copy.addEventListener('click',async()=>{
    try { await navigator.clipboard.writeText(inquiryBody); announce('Inquiry copied. Paste it into your email or message.'); }
    catch { message.focus(); message.select(); announce('Your inquiry is selected and ready to copy.'); }
  });
  const updateReferences = async selected => {
    references=selected;
    const holder=arcade.querySelector('[data-shoot-references]');
    const list=arcade.querySelector('[data-reference-images]');
    holder.hidden=!references.length;
    arcade.querySelector('[data-reference-heading]').textContent=references.length+' reference'+(references.length===1?'':'s');
    list.replaceChildren(...references.map(ref=>{
      const item=document.createElement('figure');
      item.className='shootReference';
      const thumb=new Image(); thumb.src=ref.src; thumb.alt=ref.caption; thumb.loading='lazy';
      const remove=document.createElement('button'); remove.type='button';
      remove.setAttribute('aria-label','Remove reference: '+ref.caption);
      remove.innerHTML='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18" /></svg>';
      remove.addEventListener('click',()=>{
        document.dispatchEvent(new CustomEvent('photography:remove-reference',{detail:ref.id}));
        (list.querySelector('button')||nameInput).focus({preventScroll:true});
      });
      item.append(thumb,remove); return item;
    }));
    update();
    const chosen=references.at(-1)||defaultImage;
    if(image.src===chosen.src) return;
    const version=++imageVersion;
    const replacement=new Image(); replacement.src=chosen.src;
    try { await replacement.decode(); } catch { return; }
    if(version!==imageVersion) return;
    image.src=chosen.src; image.alt=chosen.alt;
    if(!motion.matches) image.animate([{opacity:.35},{opacity:1}],{duration:token('--wc-duration-image'),easing:ease});
  };
  document.addEventListener('photography:references',event=>updateReferences(event.detail));
  motion.addEventListener('change',()=>{
    if(!motion.matches) return;
    finishScene();
    ++transitionVersion;
    transitions.forEach(animation=>animation.cancel());
    transitions=[];
    syncStep();
  });
  document.addEventListener('visibilitychange',()=>{
    scene.classList.toggle('isPaused',document.hidden);
    transitions.forEach(animation=>document.hidden?animation.pause():animation.play());
  });
  document.fonts?.ready.then(fitName);
  let nameWidth=0;
  new ResizeObserver(()=>{
    if(nameInput.clientWidth===nameWidth) return;
    nameWidth=nameInput.clientWidth;
    fitName();
    if(changing) { ++transitionVersion; transitions.forEach(animation=>animation.cancel()); transitions=[]; syncStep(); }
  }).observe(nameInput);
  syncStep();
  update();
})();
