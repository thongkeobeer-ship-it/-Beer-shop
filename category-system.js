  // ============ CATEGORY CARDS → navigate straight to games.html ============
  const CATEGORY_ACCENT = { games:'#7CC9FF', gift:'#B18CFF', topup:'#FFB25C', best:'#FFC24B' };
  let csBusy = false;

  // ---- click sequence: press -> glow -> flash -> shockwave -> particles -> navigate ----
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
    const accent = CATEGORY_ACCENT[catKey] || CATEGORY_ACCENT.games;

    csBusy = true;
    const rect = card.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;

    card.style.setProperty('--cs-card-accent', accent);
    card.classList.add('cs-press');

    setTimeout(() => {
      card.classList.remove('cs-press');
      card.classList.add('cs-charging');
      spawnBurst(cx, cy, accent);

      setTimeout(() => {
        location.href = `games.html?cat=${encodeURIComponent(catKey)}`;
      }, 260);
    }, 120);
  }

  document.querySelectorAll('.cat-card[data-cat]').forEach(card => {
    card.addEventListener('click', handleCatCardClick);
    card.addEventListener('keydown', (e) => {
      if(e.key === 'Enter' || e.key === ' '){ e.preventDefault(); handleCatCardClick(e.currentTarget ? e : { currentTarget: card }); }
    });
  });
