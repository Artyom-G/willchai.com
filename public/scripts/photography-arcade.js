(() => {
  const arcade = document.querySelector('[data-shoot-arcade]');
  if (!arcade) return;
  const form = arcade.querySelector('[data-shoot-builder]');
  const scene = arcade.querySelector('[data-gold-scene]');
  const stage = arcade.querySelector('.arcadeStageStack');
  const replay = arcade.querySelector('[data-replay-scene]');
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  const nameInput = form.elements.namedItem('title');
  const budgetInput = form.elements.namedItem('budget');
  const guidance = form.elements.namedItem('guidance');
  const subject = arcade.querySelector('[data-inquiry-subject]');
  const message = arcade.querySelector('[data-inquiry-message]');
  const copy = arcade.querySelector('[data-copy-inquiry]');
  const status = arcade.querySelector('[data-inquiry-status]');
  const next = arcade.querySelector('[data-shoot-next]');
  const nextLabel = arcade.querySelector('[data-next-label]');
  const back = arcade.querySelector('[data-shoot-back]');
  const window = arcade.querySelector('[data-shoot-steps]');
  const steps = [...arcade.querySelectorAll('[data-shoot-step]')];
  const token = key => {
    const value = getComputedStyle(document.documentElement).getPropertyValue(key).trim();
    const amount = parseFloat(value) || 0;
    return amount * (value.endsWith('ms') ? 1 : value.endsWith('s') ? 1000 : 1);
  };
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
  let emailTimer = 0;
  const image = arcade.querySelector('[data-shoot-image]');
  const defaultImage = {src:image.src,alt:image.alt};

  const finishScene = () => {
    scene.classList.remove('isReady','isPlaying');
    stage.classList.remove('isSceneReady','isScenePlaying');
    replay.hidden = motion.matches;
  };
  const playScene = () => {
    if (motion.matches) return finishScene();
    played = true;
    scene.classList.remove('isPlaying');
    stage.classList.remove('isScenePlaying');
    scene.classList.add('isReady');
    stage.classList.add('isSceneReady');
    void scene.offsetWidth;
    scene.classList.add('isPlaying');
    stage.classList.add('isScenePlaying');
    replay.hidden = false;
  };
  const sceneObserver = new IntersectionObserver(entries => {
    if(entries.some(entry=>entry.isIntersecting) && !played) {
      playScene();
      sceneObserver.disconnect();
    }
  },{rootMargin:'-10% 0px -10% 0px',threshold:.55});
  const engage = () => { played=true; finishScene(); sceneObserver.disconnect(); };
  if (!motion.matches && location.hash !== '#pricing') {
    scene.classList.add('isReady');
    stage.classList.add('isSceneReady');
  }
  if (location.hash === '#pricing') engage(); else sceneObserver.observe(scene);
  scene.addEventListener('animationend',event => { if(event.target.classList.contains('pushingWill')) finishScene(); });
  replay.addEventListener('click',()=>{ arcade.scrollIntoView({block:'start',behavior:motion.matches?'instant':'smooth'}); playScene(); });
  form.addEventListener('focusin',engage);
  form.addEventListener('pointerdown',engage);
  document.addEventListener('photography:shuffle',engage);
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
    const summary=arcade.querySelector('[data-shoot-summary]');
    summary.textContent=[place,date].filter(Boolean).join(' · ');
    summary.hidden=!summary.textContent;
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
    next.dataset.emailHref='mailto:me@willchai.com?subject='+encodeURIComponent(subject.textContent)+'&body='+encodeURIComponent(inquiryBody);
    fitName();
  };
  const syncStep = () => {
    steps.forEach((element,index)=>{ element.hidden=index!==step; element.inert=index!==step; element.classList.remove('isOutgoing'); element.querySelector('[data-step-grip]').style.left=''; element.querySelector('[data-step-grip]').style.right=''; });
    window.classList.remove('isChanging');
    window.style.height='';
    next.hidden=false;
    nextLabel.textContent=step===2?'Open email':'Next';
    next.classList.remove('isEmailOpening');
    next.classList.toggle('isEmail',step===2);
    back.hidden=step===0;
    next.disabled=back.disabled=false;
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
    step=target;
    const focusStep = () => {
      const focus = target===2 ? next : incoming.querySelector('input,textarea');
      const bounds = focus.getBoundingClientRect();
      if(bounds.top<24 || bounds.bottom>innerHeight-24) {
        const heading=window.getBoundingClientRect();
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
    const length=token('--wc-duration-fold');
    transitions=[
      outgoing.animate([
        {clipPath:'inset(0)',transform:'translateY(0)'},
        {clipPath:direction>0?'inset(0 0 100% 0)':'inset(100% 0 0 0)',transform:`translateY(${-direction*24}px)`}
      ],{duration:length*.75,easing:ease,fill:'both'}),
      incoming.animate([
        {clipPath:direction>0?'inset(100% 0 0 0)':'inset(0 0 100% 0)',transform:`translateY(${direction*24}px)`},
        {clipPath:'inset(0)',transform:'translateY(0)'}
      ],{duration:length,delay:length*.12,easing:ease,fill:'both'}),
      window.animate([{height:fromHeight+'px'},{height:toHeight+'px'}],{duration:length,easing:ease,fill:'both'})
    ];
    await Promise.all(transitions.map(animation=>animation.finished.catch(()=>{})));
    if(version!==transitionVersion) return;
    transitions.forEach(animation=>animation.cancel());
    transitions=[];
    syncStep();
    focusStep();
  };
  form.addEventListener('submit',event=>{
    event.preventDefault();
    if(step<2) return moveTo(step+1);
    if(next.classList.contains('isEmailOpening')) return;
    next.classList.add('isEmailOpening');
    next.disabled=true;
    nextLabel.textContent='Opening email…';
    announce('Opening your email app. Copy text is ready if it stays here.');
    requestAnimationFrame(()=>{
      location.href=next.dataset.emailHref||'mailto:me@willchai.com?subject=Photography%20inquiry';
      clearTimeout(emailTimer);
      emailTimer=setTimeout(()=>{
        next.classList.remove('isEmailOpening');
        next.disabled=false;
        nextLabel.textContent='Open email';
      },1200);
    });
  });
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
    stage.classList.toggle('isPaused',document.hidden);
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
