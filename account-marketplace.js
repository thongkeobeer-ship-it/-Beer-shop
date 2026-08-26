/* ---------------------------------------------------------------
   ACCOUNT MARKETPLACE SYSTEM
   --------------------------------------------------------------- */
const accountGrid        = document.getElementById('accountGrid');
const accountsTitleEl    = document.getElementById('accountsTitle');
const accountsSubtitleEl = document.getElementById('accountsSubtitle');
const accountsIconEl     = document.getElementById('accountsIcon');
const accountFilters     = document.getElementById('accountFilters');
const accountsSearchInput= document.getElementById('accountsSearchInput');

function openAccountMarketplace(gameId){
  flowState.gameId = gameId;
  flowState.filter = 'all';
  flowState.search = '';
  const game = GAME_BY_ID[gameId];
  setFlowAccent(game.accent);
  accountsTitleEl.textContent = game.name;
  const total = generateAccounts(game).length;
  accountsSubtitleEl.textContent = `${total} Accounts Available`;
  accountsIconEl.innerHTML = iconSVG(game.icon);
  accountFilters.querySelectorAll('.filter-chip').forEach(c => c.classList.toggle('active', c.dataset.filter === 'all'));
  accountsSearchInput.value = '';
  renderAccountGrid();
  showFlowStep(stepAccounts);
}

function getFilteredAccounts(){
  const game = GAME_BY_ID[flowState.gameId];
  let list = generateAccounts(game).slice();
  const q = flowState.search.trim().toLowerCase();
  if (q) list = list.filter(a => a.title.toLowerCase().includes(q));
  switch (flowState.filter){
    case 'cheapest':  list.sort((a, b) => a.price - b.price); break;
    case 'newest':    list = list.slice().reverse(); break;
    case 'rare':      list = list.filter(a => a.rareItems >= 8); break;
    case 'highlevel': list = list.filter(a => a.level >= 70); break;
    case 'premium':   list = list.filter(a => a.badge === 'PREMIUM'); break;
  }
  return list;
}

function renderAccountGrid(){
  const list = getFilteredAccounts();
  if (!list.length){
    accountGrid.innerHTML = '<div class="flow-empty">No accounts match this filter.</div>';
    return;
  }
  accountGrid.innerHTML = list.map((a, i) => `
    <div class="account-card" style="animation-delay:${i * 0.04}s" data-account="${a.id}">
      <div class="account-media">
        <img src="${a.images[0]}" alt="${a.title}" loading="lazy">
        <span class="account-media-badge">${a.badge}</span>
        <span class="account-media-stock ${a.stock ? 'in' : 'out'}">${a.stock ? 'In Stock' : 'Sold Out'}</span>
      </div>
      <div class="account-body">
        <div class="account-title">${a.title}</div>
        <div class="account-stats">
          <span>Level ${a.level}</span>
          <span>${a.skins} Skins</span>
          <span>${a.rareItems} Rare</span>
        </div>
        <div class="account-foot">
          <span class="account-price">${formatKip(a.price)}</span>
          <span class="account-view">VIEW →</span>
        </div>
      </div>
    </div>`).join('');
}

accountFilters.addEventListener('click', (e) => {
  const chip = e.target.closest('.filter-chip');
  if (!chip) return;
  accountFilters.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
  chip.classList.add('active');
  flowState.filter = chip.dataset.filter;
  renderAccountGrid();
});
accountsSearchInput.addEventListener('input', () => { flowState.search = accountsSearchInput.value; renderAccountGrid(); });

accountGrid.addEventListener('click', (e) => {
  const card = e.target.closest('.account-card');
  if (!card) return;
  openAccountDetail(card.dataset.account);
});

document.getElementById('accountsBackBtn').addEventListener('click', () => showFlowStep(stepGames));

