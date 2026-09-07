(function initStatCounters(){
  const STAT_DATA = { users: 12500, products: 180, orders: 9800, hours: 24 };
  const statGrid = document.getElementById('statGrid');
  if (!statGrid) return;
  const numEls = statGrid.querySelectorAll('.stat-num[data-stat]');
  if (!numEls.length) return;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function easeOutExpo(t){ return t === 1 ? 1 : 1 - Math.pow(2, -10 * t); }
  function formatNumber(n){ return Math.round(n).toLocaleString('en-US'); }

  function animateCount(el, target){
    if (reduceMotion || !target){ el.textContent = formatNumber(target || 0); return; }
    const duration = 1800;
    const start = performance.now();
    el.classList.add('is-counting');
    function tick(now){
      const elapsed = now - start;
      const t = Math.min(elapsed / duration, 1);
      const value = target * easeOutExpo(t);
      el.textContent = formatNumber(value);
      if (t < 1){ requestAnimationFrame(tick); }
      else { el.textContent = formatNumber(target); el.classList.remove('is-counting'); }
    }
    requestAnimationFrame(tick);
  }

  function playEntrance(){
    requestAnimationFrame(() => requestAnimationFrame(() => statGrid.classList.add('in')));
  }

  function renderStats(data){
    numEls.forEach(el => {
      const key = el.dataset.stat;
      const target = Number(data[key] ?? el.dataset.target ?? 0);
      animateCount(el, target);
    });
  }

  playEntrance();
  renderStats(STAT_DATA);
  window.renderShopStats = renderStats;
})();
