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
  const kindLabel = arcade.querySelector('[data-shoot-kind]');
  const hint = arcade.querySelector('[data-shoot-hint]');
  const budgetSummary = arcade.querySelector('[data-budget-summary]');
  const subject = arcade.querySelector('[data-inquiry-subject]');
  const message = arcade.querySelector('[data-inquiry-message]');
  const send = arcade.querySelector('[data-shoot-send]');
  const copy = arcade.querySelector('[data-copy-inquiry]');
  const copyAddress = arcade.querySelector('[data-copy-address]');
  const status = arcade.querySelector('[data-inquiry-status]');
  const fold = arcade.querySelector('[data-inquiry-fold]');
  const toggle = arcade.querySelector('[data-inquiry-toggle]');
  const assetRoot = arcade.dataset.assetRoot || '';
  const token = key => parseFloat(getComputedStyle(document.documentElement).getPropertyValue(key)) || 0;
  const ease = getComputedStyle(document.documentElement).getPropertyValue('--wc-ease-settle').trim();
  const tidy = value => String(value || '').replace(/[\r\n\t]+/g, ' ').trim();
  const options = {
    Portraits: { image:'/photography/portrait-lakeshore.webp', alt:'Lakeshore portrait', width:1707, height:2560, title:'Your portrait session', hint:'For example, Graduation with friends.', description:'portrait photography' },
    Events: { image:'/photography/concert-mcmaster.avif', alt:'A vocalist performing at McMaster University', width:1920, height:2400, title:'Your event', hint:'For example, Our end of year celebration.', description:'event photography' },
    'Another idea': { image:'/photography/product-eyewear.webp', alt:'Eyewear photograph', width:1920, height:2333, title:'Your idea', hint:'For example, Photographs for our new project.', description:'a photography project' }
  };
  let image = arcade.querySelector('[data-shoot-image]');
  let imageVersion = 0;
  let imageAnimations = [];
  let foldAnimation = null;
  let foldOpen = false;
  let played = false;
  let lastKind = '';
  let inquiryBody = '';
  let statusTimer = 0;

  const finishScene = () => {
    scene.classList.remove('isReady', 'isPlaying');
    replay.hidden = motion.matches;
  };
  const sceneObserver = new IntersectionObserver(entries => {
    if (entries.some(entry => entry.isIntersecting) && !played) {
      playScene();
      sceneObserver.disconnect();
    }
  }, { rootMargin:'0px 0px -22% 0px', threshold:0 });
  const playScene = () => {
    if (motion.matches) return finishScene();
    played = true;
    scene.classList.remove('isPlaying');
    scene.classList.add('isReady');
    void scene.offsetWidth;
    scene.classList.add('isPlaying');
    replay.hidden = false;
  };
  if (!motion.matches) scene.classList.add('isReady');
  sceneObserver.observe(arcade.querySelector('.arcadeCabinet'));
  scene.addEventListener('animationend', event => {
    if (event.target.classList.contains('pushingWill')) finishScene();
  });
  replay.addEventListener('click', playScene);
  const engage = () => { played = true; finishScene(); sceneObserver.disconnect(); };
  form.addEventListener('focusin', engage);
  form.addEventListener('pointerdown', engage);

  const cancelImageAnimations = () => {
    imageAnimations.forEach(animation => animation.cancel());
    imageAnimations = [];
    image.parentElement.querySelectorAll('img').forEach(node => { if (node !== image) node.remove(); });
  };
  const changeImage = async selected => {
    const version = ++imageVersion;
    const next = new Image(selected.width, selected.height);
    next.src = assetRoot + selected.image;
    next.alt = selected.alt;
    next.decoding = 'async';
    try { await next.decode(); } catch { return; }
    if (version !== imageVersion) return;
    cancelImageAnimations();
    const previous = image;
    const parent = previous.parentElement;
    image = next;
    parent.append(next);
    previous.alt = '';
    previous.setAttribute('aria-hidden', 'true');
    if (motion.matches) { previous.remove(); return; }
    next.classList.add('isIncoming');
    const arrival = next.animate([
      { clipPath:'inset(0 0 0 100%)', transform:'translateX(8px)' },
      { clipPath:'inset(0 0 0 0)', transform:'none' }
    ], { duration:token('--wc-duration-reveal'), easing:ease });
    imageAnimations.push(arrival);
    await arrival.finished.catch(() => {});
    if (version === imageVersion) {
      previous.remove();
      next.classList.remove('isIncoming');
      imageAnimations = [];
    }
  };
  const fitName = () => {
    nameInput.style.height = 'auto';
    nameInput.style.height = nameInput.scrollHeight + 'px';
  };
  const fitMessage = () => {
    if (fold.hidden) return;
    message.style.height = 'auto';
    message.style.height = message.scrollHeight + 'px';
  };
  const update = () => {
    budgetInput.disabled = guidance.checked;
    const data = Object.fromEntries(new FormData(form));
    const kind = data.kind || 'Portraits';
    const selected = options[kind] || options.Portraits;
    const namedTitle = tidy(data.title);
    const title = namedTitle || selected.title;
    const budget = guidance.checked ? '' : tidy(data.budget);
    nameInput.placeholder = selected.title;
    hint.textContent = selected.hint;
    kindLabel.textContent = kind;
    subject.textContent = title + ' | Photography inquiry';
    budgetSummary.textContent = budget ? 'Your budget: ' + budget + ' CAD' : 'We can work out the budget together.';
    inquiryBody = [
      'Hi Will,',
      '',
      namedTitle ? 'I’m planning ' + namedTitle + ' and would like to talk about ' + selected.description + '.' : 'I’d like to talk about ' + selected.description + '.',
      '',
      budget ? 'My photography budget is ' + budget + ' CAD.' : 'I’d appreciate your guidance on the budget.',
      'Could you suggest an approach and put together a quote?',
      '',
      'Date and place: ',
      'A little more about the shoot: ',
      ''
    ].join('\n');
    message.value = inquiryBody;
    fitMessage();
    send.href = 'mailto:me@willchai.com?subject=' + encodeURIComponent(subject.textContent) + '&body=' + encodeURIComponent(inquiryBody);
    if (kind !== lastKind) {
      if (lastKind) changeImage(selected);
      lastKind = kind;
    }
    fitName();
  };
  const setFold = async (open, animate = true) => {
    const from = fold.hidden ? 0 : fold.getBoundingClientRect().height;
    foldAnimation?.cancel();
    foldAnimation = null;
    foldOpen = open;
    toggle.setAttribute('aria-expanded', String(open));
    toggle.querySelector('span').textContent = open ? 'Close inquiry preview' : 'Review your inquiry';
    fold.hidden = false;
    fitMessage();
    if (motion.matches || !animate) { fold.hidden = !open; return; }
    const animation = fold.animate([
      { height:from + 'px', opacity:open ? 0.45 : 1 },
      { height:(open ? fold.scrollHeight : 0) + 'px', opacity:open ? 1 : 0.45 }
    ], { duration:token('--wc-duration-fold'), easing:ease, fill:'both' });
    foldAnimation = animation;
    if (open) fold.querySelector('.inquiryLetter').animate([
      { transform:'perspective(1000px) rotateX(-7deg)', transformOrigin:'50% 0' },
      { transform:'none', transformOrigin:'50% 0' }
    ], { duration:token('--wc-duration-fold'), easing:ease });
    await animation.finished.catch(() => {});
    if (foldAnimation === animation) {
      fold.hidden = !foldOpen;
      animation.cancel();
      foldAnimation = null;
    }
  };
  const announce = text => {
    clearTimeout(statusTimer);
    status.textContent = text;
    statusTimer = setTimeout(() => { status.textContent = ''; }, 7000);
  };
  copy.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(inquiryBody);
      announce('Inquiry copied. Paste it into your email or message.');
    } catch {
      await setFold(true);
      message.focus();
      message.select();
      announce('Your inquiry is selected and ready to copy.');
    }
  });
  copyAddress.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText('me@willchai.com');
      announce('Email address copied.');
    } catch {
      const selection = getSelection();
      const range = document.createRange();
      range.selectNodeContents(copyAddress);
      selection.removeAllRanges();
      selection.addRange(range);
      announce('The email address is selected and ready to copy.');
    }
  });
  toggle.addEventListener('click', () => setFold(!foldOpen));
  form.addEventListener('input', update);
  form.addEventListener('change', update);
  form.addEventListener('submit', event => { event.preventDefault(); location.href = send.href; });
  copy.hidden = copyAddress.hidden = toggle.hidden = false;
  motion.addEventListener('change', () => {
    if (motion.matches) {
      finishScene();
      cancelImageAnimations();
      setFold(foldOpen, false);
    }
  });
  document.addEventListener('visibilitychange', () => scene.classList.toggle('isPaused', document.hidden));
  document.fonts?.ready.then(fitName);
  let nameWidth = 0;
  new ResizeObserver(() => {
    const width = nameInput.clientWidth;
    if (width !== nameWidth) { nameWidth = width; fitName(); fitMessage(); }
  }).observe(nameInput.parentElement);
  update();
})();
