/* ---------------------------------------------------------------
   GAME SELECTION PAGE (games.html)
   --------------------------------------------------------------- */
const gameGrid          = document.getElementById('gameGrid');
const gamesTitleEl      = document.getElementById('gamesTitle');
const gamesSubtitleEl   = document.getElementById('gamesSubtitle');
const gamesIconEl       = document.getElementById('gamesIcon');
const gamesSearchToggle = document.getElementById('gamesSearchToggle');
const gamesSearchWrap   = document.getElementById('gamesSearchWrap');
const gamesSearchInput  = document.getElementById('gamesSearchInput');

let currentCat = 'games';

function renderGameGrid(query){
  const ids = CATEGORY_GAMES[currentCat] || CATEGORY_GAMES.games;
  const q = (query || '').trim().toLowerCase();
  const list = GAMES.filter(g => ids.includes(g.id) && (!q || g.name.toLowerCase().includes(q)));
  if (!list.length){
    gameGrid.innerHTML = '<div class="flow-empty">ບໍ່ພົບເກມທີ່ຄົ້ນຫາ.</div>';
    return;
  }
  gameGrid.innerHTML = list.map((g, i) => {
    const count = generateAccounts(g).length;
    return `
      <a class="game-card" style="--game-accent:${g.accent}; animation-delay:${i * 0.05}s"
         href="accounts.html?game=${encodeURIComponent(g.id)}&cat=${encodeURIComponent(currentCat)}">
        <div class="game-card-media">${iconSVG(g.icon)}</div>
        <span class="game-card-sweep"></span>
        <div class="game-card-overlay">
          <div class="game-card-name">${g.name}</div>
          <div class="game-card-count">ມີ ${count} ບັນຊີ</div>
          <span class="game-card-explore">ສຳຫຼວດ →</span>
        </div>
      </a>`;
  }).join('');
}

gamesSearchToggle.addEventListener('click', () => {
  gamesSearchWrap.classList.toggle('open');
  gamesSearchToggle.classList.toggle('is-active');
  if (gamesSearchWrap.classList.contains('open')) gamesSearchInput.focus();
});
gamesSearchInput.addEventListener('input', () => renderGameGrid(gamesSearchInput.value));

/* ---- page init: read ?cat= from the URL ---- */
(function initGamesPage(){
  const params = new URLSearchParams(location.search);
  currentCat = params.get('cat') || 'games';
  const meta = CATEGORY_META[currentCat] || CATEGORY_META.games;
  setFlowAccent(meta.accent);
  gamesTitleEl.textContent = meta.title;
  gamesSubtitleEl.textContent = meta.subtitle;
  gamesIconEl.innerHTML = iconSVG(meta.icon);
  renderGameGrid('');
})();
