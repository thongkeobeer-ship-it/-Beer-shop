/* ---------------------------------------------------------------
   ACCOUNT DETAIL SYSTEM
   --------------------------------------------------------------- */
const detailBadge   = document.getElementById('detailBadge');
const detailTitleEl = document.getElementById('detailTitle');
const detailGameEl  = document.getElementById('detailGame');
const detailStats   = document.getElementById('detailStats');
const detailPriceEl = document.getElementById('detailPrice');
const detailStockEl = document.getElementById('detailStock');
const detailBuyBtn  = document.getElementById('detailBuyBtn');
const detailTabNav  = document.getElementById('detailTabNav');
const detailTabPanels = document.getElementById('detailTabPanels');

function openAccountDetail(accountId){
  const acc = findAccount(accountId);
  if (!acc) return;
  const game = GAME_BY_ID[acc.gameId];
  flowState.accountId = accountId;
  setFlowAccent(game.accent);

  detailBadge.textContent = acc.badge;
  detailTitleEl.textContent = acc.title;
  detailGameEl.textContent = game.name;
  detailStats.innerHTML = `
    <div class="detail-stat"><b>${acc.level}</b><span>Level</span></div>
    <div class="detail-stat"><b>${acc.skins}</b><span>Skins</span></div>
    <div class="detail-stat"><b>${acc.rareItems}</b><span>Rare Items</span></div>`;
  detailPriceEl.textContent = formatKip(acc.price);
  detailStockEl.textContent = acc.stock ? 'IN STOCK' : 'SOLD OUT';
  detailStockEl.className = 'detail-stock ' + (acc.stock ? 'in' : 'out');
  detailBuyBtn.disabled = !acc.stock;
  detailBuyBtn.textContent = acc.stock ? 'BUY ACCOUNT' : 'OUT OF STOCK';

  detailTabNav.querySelectorAll('.tab-btn').forEach(b => b.classList.toggle('active', b.dataset.tab === 'info'));
  detailTabPanels.innerHTML = `
    <div class="tab-panel active" data-panel="info">
      <ul><li>Game: ${game.name}</li><li>Level: ${acc.level}</li><li>Skins unlocked: ${acc.skins}</li><li>Rare items: ${acc.rareItems}</li></ul>
    </div>
    <div class="tab-panel" data-panel="desc"><p>${acc.description}</p></div>
    <div class="tab-panel" data-panel="details"><ul>${acc.details.map(d => `<li>${d}</li>`).join('')}</ul></div>
    <div class="tab-panel" data-panel="safety"><ul>${acc.safety.map(s => `<li>${s}</li>`).join('')}</ul></div>`;

  initGallery(acc.images);
  showFlowStep(stepDetail);
}

detailTabNav.addEventListener('click', (e) => {
  const btn = e.target.closest('.tab-btn');
  if (!btn) return;
  detailTabNav.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  detailTabPanels.querySelectorAll('.tab-panel').forEach(p => p.classList.toggle('active', p.dataset.panel === btn.dataset.tab));
});

document.getElementById('detailBackBtn').addEventListener('click', () => showFlowStep(stepAccounts));

detailBuyBtn.addEventListener('click', (e) => {
  if (detailBuyBtn.disabled) return;
  spawnRipple(detailBuyBtn, e);
  const acc = findAccount(flowState.accountId);
  if (acc) openPurchaseConfirm(acc);
});

function spawnRipple(btn, e){
  const rect = btn.getBoundingClientRect();
  const r = document.createElement('span');
  r.className = 'buy-ripple';
  const size = Math.max(rect.width, rect.height) * 1.4;
  r.style.width = r.style.height = size + 'px';
  r.style.left = (e.clientX - rect.left - size / 2) + 'px';
  r.style.top = (e.clientY - rect.top - size / 2) + 'px';
  btn.appendChild(r);
  setTimeout(() => r.remove(), 600);
}

