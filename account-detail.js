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
    <div class="detail-stat"><b>${acc.level}</b><span>ເລເວວ</span></div>
    <div class="detail-stat"><b>${acc.skins}</b><span>ສກິນ</span></div>
    <div class="detail-stat"><b>${acc.rareItems}</b><span>ໄອເທມຫາຍາກ</span></div>`;
  detailPriceEl.textContent = formatKip(acc.price);
  detailStockEl.textContent = acc.stock ? 'ມີສິນຄ້າ' : 'ຂາຍໝົດ';
  detailStockEl.className = 'detail-stock ' + (acc.stock ? 'in' : 'out');
  detailBuyBtn.disabled = !acc.stock;
  detailBuyBtn.textContent = acc.stock ? 'ຊື້ບັນຊີ' : 'ສິນຄ້າໝົດ';

  detailTabNav.querySelectorAll('.tab-btn').forEach(b => b.classList.toggle('active', b.dataset.tab === 'info'));
  detailTabPanels.innerHTML = `
    <div class="tab-panel active" data-panel="info">
      <ul><li>ເກມ: ${game.name}</li><li>ເລເວວ: ${acc.level}</li><li>ສກິນທີ່ປົດລັອກ: ${acc.skins}</li><li>ໄອເທມຫາຍາກ: ${acc.rareItems}</li></ul>
    </div>
    <div class="tab-panel" data-panel="desc"><p>${acc.description}</p></div>
    <div class="tab-panel" data-panel="details"><ul>${acc.details.map(d => `<li>${d}</li>`).join('')}</ul></div>
    <div class="tab-panel" data-panel="safety"><ul>${acc.safety.map(s => `<li>${s}</li>`).join('')}</ul></div>`;

  initGallery(acc.images);
  const backBtn = document.getElementById('detailBackBtn');
  if (backBtn) backBtn.href = `accounts.html?game=${encodeURIComponent(acc.gameId)}`;
}

detailTabNav.addEventListener('click', (e) => {
  const btn = e.target.closest('.tab-btn');
  if (!btn) return;
  detailTabNav.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  detailTabPanels.querySelectorAll('.tab-panel').forEach(p => p.classList.toggle('active', p.dataset.panel === btn.dataset.tab));
});

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

/* ---- page init: read ?id= from the URL and load that account.
   Called from account-detail.html AFTER gallery.js/image-viewer.js/purchase.js
   have loaded, since openAccountDetail() needs initGallery() to exist. ---- */
function initAccountDetailPage(){
  const params = new URLSearchParams(location.search);
  const accountId = params.get('id');
  const acc = accountId && findAccount(accountId);
  if (!acc){
    detailTitleEl.textContent = 'ບໍ່ພົບບັນຊີ';
    detailTabPanels.innerHTML = '<div class="tab-panel active"><p>ລິ້ງບັນຊີນີ້ບໍ່ຖືກຕ້ອງ. <a href="index.html">ກັບໄປໜ້າຫຼັກ</a>.</p></div>';
    return;
  }
  openAccountDetail(accountId);
}

