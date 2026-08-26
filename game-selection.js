/* ---------------------------------------------------------------
   GAME SELECTION SYSTEM
   --------------------------------------------------------------- */
const gameGrid          = document.getElementById('gameGrid');
const gamesTitleEl      = document.getElementById('gamesTitle');
const gamesSubtitleEl   = document.getElementById('gamesSubtitle');
const gamesIconEl       = document.getElementById('gamesIcon');
const gamesSearchToggle = document.getElementById('gamesSearchToggle');
const gamesSearchWrap   = document.getElementById('gamesSearchWrap');
const gamesSearchInput  = document.getElementById('gamesSearchInput');

function openGameSelection(catKey, accent){
  flowState.category = catKey;
  flowState.accent = accent || '#7CC9FF';
  setFlowAccent(flowState.accent);

  const meta = CATEGORY_META[catKey] || CATEGORY_META.games;
  gamesTitleEl.textContent = meta.title;
  gamesSubtitleEl.textContent = meta.subtitle;
  gamesIconEl.innerHTML = iconSVG((categoryShowcases[catKey] || categoryShowcases.games).icon);
  gamesSearchWrap.classList.remove('open');
  gamesSearchInput.value = '';

  renderGameGrid('');
  lockBody();
  flowScreen.classList.add('open');
  flowScreen.setAttribute('aria-hidden', 'false');
  showFlowStep(stepGames);
}

function renderGameGrid(query){
  const ids = CATEGORY_GAMES[flowState.category] || CATEGORY_GAMES.games;
  const q = (query || '').trim().toLowerCase();
  const list = GAMES.filter(g => ids.includes(g.id) && (!q || g.name.toLowerCase().includes(q)));
  if (!list.length){
    gameGrid.innerHTML = '<div class="flow-empty">No games match your search.</div>';
    return;
  }
  gameGrid.innerHTML = list.map((g, i) => {
    const count = generateAccounts(g).length;
    return `
      <div class="game-card" style="--game-accent:${g.accent}; animation-delay:${i * 0.05}s" data-game="${g.id}">
        <div class="game-card-media">${iconSVG(g.icon)}</div>
        <span class="game-card-sweep"></span>
        <div class="game-card-overlay">
          <div class="game-card-name">${g.name}</div>
          <div class="game-card-count">${count} Accounts Available</div>
          <span class="game-card-explore">EXPLORE →</span>
        </div>
      </div>`;
  }).join('');
}

gamesSearchToggle.addEventListener('click', () => {
  gamesSearchWrap.classList.toggle('open');
  gamesSearchToggle.classList.toggle('is-active');
  if (gamesSearchWrap.classList.contains('open')) gamesSearchInput.focus();
});
gamesSearchInput.addEventListener('input', () => renderGameGrid(gamesSearchInput.value));

gameGrid.addEventListener('click', (e) => {
  const card = e.target.closest('.game-card');
  if (!card) return;
  const media = card.querySelector('.game-card-media');
  if (media) media.style.transform = 'scale(1.08)';
  card.style.transition = 'transform .18s var(--ease)';
  setTimeout(() => { openAccountMarketplace(card.dataset.game); if (media) media.style.transform = ''; }, 140);
});

document.getElementById('gamesBackBtn').addEventListener('click', closeFlow);

