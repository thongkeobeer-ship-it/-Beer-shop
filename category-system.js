  // ============ CATEGORY SHOWCASE ============
  const categoryShowcases = {
    games: {
      accent: '#7CC9FF',
      title: 'Games',
      subtitle: 'Top-up currency and passes for the titles players grind the most — PC and console included.',
      icon: '<rect x="2" y="7" width="20" height="11" rx="4"/><path d="M7 12h.01M6 15h2m6-3h.01M17 12h.01"/>',
      stats: [ { value:'42+', label:'Titles' }, { value:'128', label:'Sellers' }, { value:'4.9★', label:'Rating' } ],
      itemIdxs: [0, 1, 2, 3, 6],
      cta: 'Browse Games'
    },
    gift: {
      accent: '#B18CFF',
      title: 'Gift Cards',
      subtitle: 'Digital codes delivered instantly for the platforms your wallet already trusts.',
      icon: '<rect x="2" y="6" width="20" height="14" rx="3"/><path d="M2 10h20M6 15h4"/>',
      stats: [ { value:'6', label:'Platforms' }, { value:'<5m', label:'Delivery' }, { value:'100%', label:'Genuine' } ],
      itemIdxs: [4, 7],
      cta: 'Browse Gift Cards'
    },
    topup: {
      accent: '#FFB25C',
      title: 'Top Up',
      subtitle: 'Instant in-game credit — pay, confirm, and the balance lands in your account.',
      icon: '<path d="M13 2 3 14h8l-1 8 10-12h-8l1-8Z"/>',
      stats: [ { value:'~2m', label:'Avg. Time' }, { value:'99.8%', label:'Success' }, { value:'24/7', label:'Uptime' } ],
      itemIdxs: [0, 1, 2, 5],
      cta: 'Top Up Now'
    },
    best: {
      accent: '#FFC24B',
      title: 'Best Seller',
      subtitle: "This week's most-bought items, restocked and price-checked daily.",
      icon: '<path d="M12 2c1.5 3 1 4.5-1 6.5C9 10.5 8 12 8 14a4 4 0 0 0 8 0c0-1.2-.5-2-1.2-2.8.9.4 2.2 1.6 2.2 3.8a5 5 0 0 1-10 0c0-3.5 2-5 3-8 .5-1.2.7-2.2 1-5Z"/>',
      stats: [ { value:'#1', label:'Trending' }, { value:'2.3K', label:'Sold' }, { value:'4.8★', label:'Rating' } ],
      itemIdxs: [0, 3, 6, 2],
      cta: 'View All'
    }
  };

  const rarityColor = { 'Best Seller':'#FFC24B', 'Popular':'#B18CFF', 'New':'#7CC9FF', 'Trending':'#7CC9FF', 'Gift Card':'#7CE2C4' };
  const rarityLabel = { 'Best Seller':'Legendary', 'Popular':'Epic', 'New':'Rare', 'Trending':'Rare', 'Gift Card':'Rare' };

  const catShowcase = document.getElementById('catShowcase');
  const csPanel = document.getElementById('csPanel');
  const csContent = document.getElementById('csContent');
  const csBackdrop = document.getElementById('csBackdrop');
  const csClose = document.getElementById('csClose');
  let csBusy = false;

  function csItemHTML(product){
    const c = rarityColor[product.badge] || '#8FD8FF';
    const r = rarityLabel[product.badge] || 'Normal';
    return `
      <div class="cs-item" style="--rarity-c:${c}">
        <span class="cs-item-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">${product.icon}</svg></span>
        <div class="cs-item-name">${product.name}</div>
        <span class="cs-item-rarity">${r}</span>
      </div>`;
  }

  function buildShowcaseHTML(cfg){
    const statsHTML = cfg.stats.map((s, i) =>
      `<div class="cs-stat" style="animation-delay:${0.28 + i * 0.07}s"><b>${s.value}</b><span>${s.label}</span></div>`
    ).join('');
    const itemsHTML = cfg.itemIdxs.map((idx, i) =>
      csItemHTML(products[idx]).replace('class="cs-item"', `class="cs-item" data-delay="${i}"`)
    ).join('');
    return `
      <div class="cs-hero">
        <div class="cs-hero-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">${cfg.icon}</svg></div>
        <span class="cs-badge">Category</span>
        <div class="cs-title">${cfg.title}</div>
        <p class="cs-subtitle">${cfg.subtitle}</p>
      </div>
      <div class="cs-stats">${statsHTML}</div>
      <div class="cs-section-label">Inside this category</div>
      <div class="cs-items">${itemsHTML}</div>
      <div class="cs-cta-row">
        <a href="#products" class="cs-cta" id="csCtaBtn">${cfg.cta}</a>
        <button class="cs-cta-secondary" id="csCancelBtn">Close</button>
      </div>`;
  }

  function openCategoryShowcase(catKey){
    const cfg = categoryShowcases[catKey];
    if(!cfg) return;
    csPanel.style.setProperty('--cs-accent', cfg.accent);
    csContent.innerHTML = buildShowcaseHTML(cfg);
    // stagger each item's entrance a touch after the stats
    csContent.querySelectorAll('.cs-item').forEach(el => {
      const d = parseInt(el.dataset.delay || '0', 10);
      el.style.animationDelay = (0.55 + d * 0.06) + 's';
    });
    document.body.style.overflow = 'hidden';
    catShowcase.classList.add('open');
    catShowcase.setAttribute('aria-hidden', 'false');
    csClose.focus({ preventScroll:true });
    document.getElementById('csCancelBtn').addEventListener('click', closeCategoryShowcase);
    document.getElementById('csCtaBtn').addEventListener('click', closeCategoryShowcase);
  }

  function closeCategoryShowcase(){
    catShowcase.classList.remove('open');
    catShowcase.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  // ---- click sequence: press -> glow -> flash -> shockwave -> particles -> reveal ----
  function spawnBurst(cx, cy, accent){
    const burst = document.createElement('div');
    burst.className = 'fx-burst';
    burst.style.setProperty('--fx-accent', accent);
    burst.style.left = cx + 'px';
    burst.style.top = cy + 'px';

    burst.appendChild(Object.assign(document.createElement('div'), { className:'fx-flash' }));
    burst.appendChild(Object.assign(document.createElement('div'), { className:'fx-ring' }));
    burst.appendChild(Object.assign(document.createElement('div'), { className:'fx-ring fx-ring-2' }));

    const isMobile = window.matchMedia('(max-width: 640px)').matches;
    const particleCount = isMobile ? 6 : 12;
    for(let i = 0; i < particleCount; i++){
      const p = document.createElement('div');
      p.className = 'fx-particle';
      const angle = (Math.PI * 2 * i) / particleCount + (Math.random() * 0.4 - 0.2);
      const dist = 60 + Math.random() * 50;
      p.style.setProperty('--px', Math.cos(angle) * dist + 'px');
      p.style.setProperty('--py', Math.sin(angle) * dist + 'px');
      p.style.animationDelay = (Math.random() * 0.05) + 's';
      burst.appendChild(p);
    }

    document.body.appendChild(burst);
    setTimeout(() => burst.remove(), 700);
  }

  function handleCatCardClick(e){
    if(csBusy) return;
    const card = e.currentTarget;
    const catKey = card.dataset.cat;
    const cfg = categoryShowcases[catKey];
    if(!cfg) return;

    csBusy = true;
    const rect = card.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;

    card.style.setProperty('--cs-card-accent', cfg.accent);
    card.classList.add('cs-press');

    setTimeout(() => {
      card.classList.remove('cs-press');
      card.classList.add('cs-charging');
      spawnBurst(cx, cy, cfg.accent);

      setTimeout(() => {
        card.classList.remove('cs-charging');
        if (typeof openGameSelection === 'function') {
          openGameSelection(catKey, cfg.accent);
        } else {
          openCategoryShowcase(catKey);
        }
        csBusy = false;
      }, 260);
    }, 120);
  }

  document.querySelectorAll('.cat-card[data-cat]').forEach(card => {
    card.addEventListener('click', handleCatCardClick);
    card.addEventListener('keydown', (e) => {
      if(e.key === 'Enter' || e.key === ' '){ e.preventDefault(); handleCatCardClick(e.currentTarget ? e : { currentTarget: card }); }
    });
  });

  csClose.addEventListener('click', closeCategoryShowcase);
  csBackdrop.addEventListener('click', closeCategoryShowcase);
  document.addEventListener('keydown', (e) => {
    if(e.key === 'Escape' && catShowcase.classList.contains('open')) closeCategoryShowcase();
  });
