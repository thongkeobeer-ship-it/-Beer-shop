  const products = [
    { badge:'Best Seller', cat:'Mobile Legends', name:'Diamonds — 500 pack', price:'85,000 ₭', stock:'In stock', icon:'<path d="M6 3h12l4 6-10 12L2 9l4-6Z"/><path d="M2 9h20M9 3l3 6-3 12M15 3l-3 6 3 12"/>' },
    { badge:'Popular', cat:'PUBG Mobile', name:'UC — 660 Unknown Cash', price:'120,000 ₭', stock:'In stock', icon:'<circle cx="12" cy="12" r="8"/><path d="M12 2v4M12 18v4M2 12h4M18 12h4"/><circle cx="12" cy="12" r="2"/>' },
    { badge:'New', cat:'Valorant', name:'Points — 1075 VP', price:'210,000 ₭', stock:'In stock', icon:'<path d="M12 2 3 7v6c0 5 4 8 9 9 5-1 9-4 9-9V7l-9-5Z"/><path d="M9 12l2 2 4-4"/>' },
    { badge:'Best Seller', cat:'Free Fire', name:'Diamonds — 1080 pack', price:'100,000 ₭', stock:'In stock', icon:'<path d="M12 2c1.5 3 1 4.5-1 6.5C9 10.5 8 12 8 14a4 4 0 0 0 8 0c0-1.2-.5-2-1.2-2.8.9.4 2.2 1.6 2.2 3.8a5 5 0 0 1-10 0c0-3.5 2-5 3-8 .5-1.2.7-2.2 1-5Z"/>' },
    { badge:'Gift Card', cat:'Steam Wallet', name:'Code — $20 USD', price:'460,000 ₭', stock:'In stock', icon:'<rect x="2" y="6" width="20" height="14" rx="3"/><path d="M2 10h20M6 15h4"/>' },
    { badge:'Trending', cat:'Garena Shells', name:'Shells — 100 pack', price:'22,000 ₭', stock:'In stock', icon:'<circle cx="12" cy="12" r="9"/><path d="M9 12a3 3 0 1 0 6 0 3 3 0 0 0-6 0Z"/><path d="M12 3v2M12 19v2"/>' },
    { badge:'Popular', cat:'Genshin Impact', name:'Genesis Crystals — 980', price:'190,000 ₭', stock:'Low stock', icon:'<path d="M12 2 2 9l10 13L22 9 12 2Z"/><path d="M2 9h20M8 9l4 13 4-13M12 2v7"/>' },
    { badge:'Gift Card', cat:'Google Play', name:'Gift Card — 100,000 ₭', price:'100,000 ₭', stock:'In stock', icon:'<path d="M6 8V6a6 6 0 0 1 12 0v2"/><rect x="3" y="8" width="18" height="13" rx="2"/><path d="M9 12a3 3 0 0 0 6 0"/>' },
  ];

  const buyIcon = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><path d="M6 6h15l-1.5 9h-12L6 6Zm0 0L5 3H2"/><circle cx="9" cy="20" r="1"/><circle cx="18" cy="20" r="1"/></svg>';

  const stackModal = document.getElementById('stackModal');
  const stackViewport = document.getElementById('stackViewport');
  const stackBackdrop = document.getElementById('stackBackdrop');
  const stackClose = document.getElementById('stackClose');

  // ---- state: which product is the hero, and which 3 sit in the fan ----
  let heroIdx = 0;
  let fanIdxs = [];
  let isSwapping = false; // guard against double-clicks mid-animation

  function heroInnerHTML(product){
    return `
      <div class="stack-media">
        <span class="stack-badge">${product.badge}</span>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">${product.icon}</svg>
      </div>
      <span class="stack-cat">${product.cat}</span>
      <div class="stack-name">${product.name}</div>
      <div class="stack-cta">
        <div><div class="stack-price">${product.price}</div><span class="stack-stock">${product.stock}</span></div>
        <button class="stack-buy">Buy Now</button>
      </div>`;
  }

  function fanInnerHTML(product){
    return `
      <span class="fan-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">${product.icon}</svg></span>
      <div class="fan-name">${product.name}</div>
      <span class="fan-price">${product.price}</span>`;
  }

  function buildHero(product){
    const el = document.createElement('div');
    el.className = 'stack-hero';
    el.innerHTML = heroInnerHTML(product);
    return el;
  }

  function buildFanCard(product, prodIdx){
    const el = document.createElement('div');
    el.className = 'fan-card';
    el.dataset.idx = prodIdx;
    el.innerHTML = fanInnerHTML(product);
    return el;
  }

  // fresh open (from a "View More" button): hero + 3 cards fan out from scratch
  function openProductStack(startIndex){
    heroIdx = startIndex;
    fanIdxs = [];
    for(let k = 1; k <= 3; k++) fanIdxs.push((startIndex + k) % products.length);

    stackViewport.innerHTML = '';

    const hero = buildHero(products[heroIdx]);
    stackViewport.appendChild(hero);

    const fan = document.createElement('div');
    fan.className = 'stack-fan';
    fanIdxs.forEach(idx => fan.appendChild(buildFanCard(products[idx], idx)));
    stackViewport.appendChild(fan);

    document.body.style.overflow = 'hidden';
    stackModal.classList.add('open');
  }

  function closeProductStack(){
    stackModal.classList.remove('open');
    document.body.style.overflow = '';
  }

  // Tapping a fanned card swaps places with the hero: the tapped card glides
  // down/up into the hero spot while the old hero glides into its old slot.
  function swapCardToHero(fanCardEl){
    if (isSwapping) return;
    const heroEl = stackViewport.querySelector('.stack-hero');
    if (!heroEl || !fanCardEl) return;

    const slotPos = Array.from(fanCardEl.parentElement.children).indexOf(fanCardEl);
    const clickedIdx = parseInt(fanCardEl.dataset.idx, 10);
    const oldHeroIdx = heroIdx;

    const heroRect = heroEl.getBoundingClientRect();
    const fanRect = fanCardEl.getBoundingClientRect();

    isSwapping = true;

    // floating clones cover the visual transition — kept at their OWN
    // natural size (never stretched to match the other box), so nothing
    // warps or distorts; they just slide, shrink/grow a touch, and fade.
    const heroClone = heroEl.cloneNode(true);
    const fanClone = fanCardEl.cloneNode(true);
    heroClone.className = 'flip-clone is-hero';
    fanClone.className = 'flip-clone is-fan';

    Object.assign(heroClone.style, {
      top: heroRect.top + 'px', left: heroRect.left + 'px',
      width: heroRect.width + 'px', height: heroRect.height + 'px',
      borderRadius: '28px', transformOrigin: '50% 50%',
      transform: 'translate3d(0,0,0) scale(1)', opacity: '1'
    });
    Object.assign(fanClone.style, {
      top: fanRect.top + 'px', left: fanRect.left + 'px',
      width: fanRect.width + 'px', height: fanRect.height + 'px',
      borderRadius: '18px', transformOrigin: '50% 50%',
      transform: 'translate3d(0,0,0) scale(1)', opacity: '1'
    });

    document.body.appendChild(heroClone);
    document.body.appendChild(fanClone);

    // instantly bring the real DOM to its final state, hidden under the clones
    heroIdx = clickedIdx;
    fanIdxs[slotPos] = oldHeroIdx;

    heroEl.innerHTML = heroInnerHTML(products[heroIdx]);
    heroEl.style.transition = 'none';
    heroEl.style.opacity = '0';

    fanCardEl.dataset.idx = fanIdxs[slotPos];
    fanCardEl.innerHTML = fanInnerHTML(products[fanIdxs[slotPos]]);
    fanCardEl.style.transition = 'none';
    fanCardEl.style.opacity = '0';

    // travel distance = the gap between the two boxes' centers
    const heroCenter = { x: heroRect.left + heroRect.width / 2,  y: heroRect.top + heroRect.height / 2 };
    const fanCenter  = { x: fanRect.left  + fanRect.width  / 2,  y: fanRect.top  + fanRect.height  / 2 };
    const dxHero = fanCenter.x - heroCenter.x, dyHero = fanCenter.y - heroCenter.y;
    const dxFan  = heroCenter.x - fanCenter.x, dyFan  = heroCenter.y - fanCenter.y;

    const MOVE_DUR = 460;   // ms — the slide
    const FADE_DUR = 200;   // ms — crossfade window at the tail end
    const FADE_DELAY = MOVE_DUR - FADE_DUR;

    // force layout to flush the start state before animating
    void heroClone.offsetWidth;
    void fanClone.offsetWidth;

    heroClone.style.transition = `transform ${MOVE_DUR}ms cubic-bezier(.22,.61,.36,1), opacity ${FADE_DUR}ms ease ${FADE_DELAY}ms`;
    fanClone.style.transition  = `transform ${MOVE_DUR}ms cubic-bezier(.22,.61,.36,1), opacity ${FADE_DUR}ms ease ${FADE_DELAY}ms`;

    // hero clone slides down into the fan slot, shrinking uniformly (no stretch)
    heroClone.style.transform = `translate3d(${dxHero}px, ${dyHero}px, 0) scale(0.32)`;
    heroClone.style.opacity = '0';

    // fan clone slides up into the hero spot, growing uniformly (no stretch)
    fanClone.style.transform = `translate3d(${dxFan}px, ${dyFan}px, 0) scale(1.9)`;
    fanClone.style.opacity = '0';

    // the real cards crossfade in right as the clones fade out, so the
    // handoff to their correctly-sized final layout is invisible
    requestAnimationFrame(() => {
      heroEl.style.transition = `opacity ${FADE_DUR}ms ease ${FADE_DELAY}ms`;
      fanCardEl.style.transition = `opacity ${FADE_DUR}ms ease ${FADE_DELAY}ms`;
      heroEl.style.opacity = '1';
      fanCardEl.style.opacity = '1';
    });

    setTimeout(() => {
      heroClone.remove();
      fanClone.remove();
      heroEl.style.transition = '';
      heroEl.style.opacity = '';
      fanCardEl.style.transition = '';
      fanCardEl.style.opacity = '';
      isSwapping = false;
    }, MOVE_DUR + 40);
  }

  stackViewport.addEventListener('click', (e) => {
    const fanCard = e.target.closest('.fan-card');
    if(!fanCard) return;
    swapCardToHero(fanCard);
  });

  document.querySelectorAll('.p-viewmore[data-idx]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      openProductStack(parseInt(btn.dataset.idx, 10));
    });
  });
  document.querySelectorAll('.p-card .buy-btn').forEach(btn => {
    btn.addEventListener('click', (e) => e.stopPropagation());
  });

  stackClose.addEventListener('click', closeProductStack);
  stackBackdrop.addEventListener('click', closeProductStack);
  document.addEventListener('keydown', (e) => {
    if(e.key === 'Escape' && stackModal.classList.contains('open')) closeProductStack();
  });


