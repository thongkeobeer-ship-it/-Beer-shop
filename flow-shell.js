/* ---------------------------------------------------------------
   SHARED FLOW STATE + SHELL CONTROLS
   --------------------------------------------------------------- */
const flowState = { category:null, accent:null, gameId:null, filter:'all', search:'', accountId:null, imgIndex:0 };

const flowScreen   = document.getElementById('flowScreen');
const stepGames     = document.getElementById('stepGames');
const stepAccounts  = document.getElementById('stepAccounts');
const stepDetail    = document.getElementById('stepDetail');

function iconSVG(pathData){ return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">${pathData}</svg>`; }

function setFlowAccent(hex){
  flowScreen.style.setProperty('--flow-accent', hex);
}

function showFlowStep(stepEl){
  [stepGames, stepAccounts, stepDetail].forEach(s => {
    if (s === stepEl){
      s.classList.add('active');
      requestAnimationFrame(() => requestAnimationFrame(() => s.classList.add('step-in')));
    } else if (s.classList.contains('active')) {
      s.classList.remove('step-in');
      setTimeout(() => { if (s !== stepEl) s.classList.remove('active'); }, 480);
    }
  });
  stepEl.querySelector('.flow-body') && (stepEl.querySelector('.flow-body').scrollTop = stepEl.dataset.savedScroll ? +stepEl.dataset.savedScroll : stepEl.querySelector('.flow-body').scrollTop);
}

function lockBody(){ document.body.classList.add('flow-lock'); }
function unlockBodyIfClear(){
  const anyOpen = flowScreen.classList.contains('open') || imageViewer.classList.contains('open') || purchaseConfirm.classList.contains('open');
  if (!anyOpen) document.body.classList.remove('flow-lock');
}

document.querySelectorAll('.flow-close-btn').forEach(btn => btn.addEventListener('click', closeFlow));
function closeFlow(){
  flowScreen.classList.remove('open');
  flowScreen.setAttribute('aria-hidden', 'true');
  unlockBodyIfClear();
}

document.addEventListener('keydown', (e) => {
  if (e.key !== 'Escape') return;
  if (purchaseConfirm.classList.contains('open')) return closePurchaseConfirm();
  if (imageViewer.classList.contains('open')) return closeViewer();
  if (flowScreen.classList.contains('open')) return closeFlow();
});

