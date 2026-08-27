/* ---------------------------------------------------------------
   SHARED PAGE STATE + SHELL HELPERS
   Used by games.html / accounts.html / account-detail.html.
   These are now real, separate pages (not an overlay flow), so this
   file only keeps the bits every page still needs in common.
   --------------------------------------------------------------- */
const flowState = { imgIndex:0 };

const flowPageEl = document.getElementById('flowPage');

function setFlowAccent(hex){
  if (flowPageEl) flowPageEl.style.setProperty('--flow-accent', hex);
}

// account-detail.html still opens the image viewer / purchase confirm as
// in-page dialogs (that's normal for a zoom viewer / confirm step, not a
// full page) — these two helpers lock/unlock background scroll for them.
function lockBody(){ document.body.classList.add('flow-lock'); }
function unlockBodyIfClear(){
  const viewerOpen  = typeof imageViewer !== 'undefined' && imageViewer.classList.contains('open');
  const confirmOpen = typeof purchaseConfirm !== 'undefined' && purchaseConfirm.classList.contains('open');
  if (!viewerOpen && !confirmOpen) document.body.classList.remove('flow-lock');
}

document.addEventListener('keydown', (e) => {
  if (e.key !== 'Escape') return;
  if (typeof purchaseConfirm !== 'undefined' && purchaseConfirm.classList.contains('open')) return closePurchaseConfirm();
  if (typeof imageViewer !== 'undefined' && imageViewer.classList.contains('open')) return closeViewer();
});
