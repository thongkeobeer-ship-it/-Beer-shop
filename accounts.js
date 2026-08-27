/* ---------------------------------------------------------------
   ACCOUNT MARKETPLACE PAGE (accounts.html)
   --------------------------------------------------------------- */
const accountGrid        = document.getElementById('accountGrid');
const accountsTitleEl    = document.getElementById('accountsTitle');
const accountsSubtitleEl = document.getElementById('accountsSubtitle');
const accountsIconEl     = document.getElementById('accountsIcon');
const accountFilters     = document.getElementById('accountFilters');
const accountsSearchInput= document.getElementById('accountsSearchInput');

let currentGameId = null;
let currentCat = '';
let currentFilter = 'all';
let currentSearch = '';

function getFilteredAccounts(){
  const game = GAME_BY_ID[currentGameId];
  let list = generateAccounts(game).slice();
  const q = currentSearch.trim().toLowerCase();
  if (q) list = list.filter(a => a.title.toLowerCase().includes(q));
  switch (currentFilter){
    case 'cheapest':  list.sort((a, b) => a.price - b.price); break;
    case 'newest':    list = list.slice().reverse(); break;
    case 'rare':      list = list.filter(a => a.rareItems >= 8); break;
    case 'highlevel': list = list.filter(a => a.level >= 70); break;
    case 'premium':   list = list.filter(a => a.badge === 'ພຣີເມຍມ'); break;
  }
  return list;
}

function renderAccountGrid(){
  const list = getFilteredAccounts();
  if (!list.length){
    accountGrid.innerHTML = '<div class="flow-empty">ບໍ່ພົບບັນຊີທີ່ຕົງກັບການກັ່ນຕອງນີ້.</div>';
    return;
  }
  accountGrid.innerHTML = list.map((a, i) => `
    <a class="account-card" style="animation-delay:${i * 0.04}s" href="account-detail.html?id=${encodeURIComponent(a.id)}">
      <div class="account-media">
        <img src="${a.images[0]}" alt="${a.title}" loading="lazy">
        <span class="account-media-badge">${a.badge}</span>
        <span class="account-media-stock ${a.stock ? 'in' : 'out'}">${a.stock ? 'ມີສິນຄ້າ' : 'ຂາຍໝົດ'}</span>
      </div>
      <div class="account-body">
        <div class="account-title">${a.title}</div>
        <div class="account-stats">
          <span>ເລເວວ ${a.level}</span>
          <span>${a.skins} ສກິນ</span>
          <span>${a.rareItems} ຫາຍາກ</span>
        </div>
        <div class="account-foot">
          <span class="account-price">${formatKip(a.price)}</span>
          <span class="account-view">ເບິ່ງ →</span>
        </div>
      </div>
    </a>`).join('');
}

accountFilters.addEventListener('click', (e) => {
  const chip = e.target.closest('.filter-chip');
  if (!chip) return;
  accountFilters.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
  chip.classList.add('active');
  currentFilter = chip.dataset.filter;
  renderAccountGrid();
});
accountsSearchInput.addEventListener('input', () => { currentSearch = accountsSearchInput.value; renderAccountGrid(); });

/* ---- page init: read ?game=&cat= from the URL ---- */
(function initAccountsPage(){
  const params = new URLSearchParams(location.search);
  currentGameId = params.get('game');
  currentCat = params.get('cat') || '';
  const game = GAME_BY_ID[currentGameId];
  const backBtn = document.getElementById('accountsBackBtn');

  if (!game){
    accountsTitleEl.textContent = 'ບໍ່ພົບເກມ';
    accountsSubtitleEl.textContent = '';
    accountGrid.innerHTML = '<div class="flow-empty">ລິ້ງເກມນີ້ບໍ່ຖືກຕ້ອງ. <a href="index.html">ກັບໄປໜ້າຫຼັກ</a>.</div>';
    if (backBtn) backBtn.href = 'index.html#categories';
    return;
  }

  if (backBtn) backBtn.href = `games.html?cat=${encodeURIComponent(currentCat || 'games')}`;
  setFlowAccent(game.accent);
  accountsTitleEl.textContent = game.name;
  const total = generateAccounts(game).length;
  accountsSubtitleEl.textContent = `ມີ ${total} ບັນຊີ`;
  accountsIconEl.innerHTML = iconSVG(game.icon);
  renderAccountGrid();
})();
