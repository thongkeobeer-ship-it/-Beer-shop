/* ---------------------------------------------------------------
   IMAGE VIEWER SYSTEM (fullscreen, swipe, double-tap zoom)
   --------------------------------------------------------------- */
const imageViewer    = document.getElementById('imageViewer');
const viewerImg       = document.getElementById('viewerImg');
const viewerCounter   = document.getElementById('viewerCounter');
const viewerStage     = document.getElementById('viewerStage');
const viewerPrev      = document.getElementById('viewerPrev');
const viewerNext      = document.getElementById('viewerNext');
const viewerCloseBtn  = document.getElementById('viewerClose');

function openViewer(idx){
  setViewerImage(idx, null);
  imageViewer.classList.add('open');
  imageViewer.setAttribute('aria-hidden', 'false');
  lockBody();
}
function closeViewer(){
  imageViewer.classList.remove('open');
  imageViewer.setAttribute('aria-hidden', 'true');
  viewerImg.classList.remove('vw-zoomed');
  unlockBodyIfClear();
}
function setViewerImage(idx, direction){
  if (idx < 0 || idx >= currentImages.length) return;
  const doSwap = () => {
    viewerImg.src = currentImages[idx];
    viewerImg.classList.remove('vw-out-l', 'vw-out-r', 'vw-zoomed');
    flowState.imgIndex = idx;
    viewerCounter.textContent = `${String(idx + 1).padStart(2, '0')} / ${currentImages.length}`;
    setMainImage(idx, null); // keep detail gallery in sync
  };
  if (!direction){ doSwap(); return; }
  viewerImg.classList.add(direction === 'next' ? 'vw-out-l' : 'vw-out-r');
  setTimeout(doSwap, 180);
}
viewerPrev.addEventListener('click', () => setViewerImage((flowState.imgIndex - 1 + currentImages.length) % currentImages.length, 'prev'));
viewerNext.addEventListener('click', () => setViewerImage((flowState.imgIndex + 1) % currentImages.length, 'next'));
viewerCloseBtn.addEventListener('click', closeViewer);

let lastTap = 0;
viewerImg.addEventListener('click', (e) => {
  const now = Date.now();
  if (now - lastTap < 300){ viewerImg.classList.toggle('vw-zoomed'); }
  lastTap = now;
});

document.addEventListener('keydown', (e) => {
  if (!imageViewer.classList.contains('open')) return;
  if (e.key === 'ArrowRight') setViewerImage((flowState.imgIndex + 1) % currentImages.length, 'next');
  if (e.key === 'ArrowLeft') setViewerImage((flowState.imgIndex - 1 + currentImages.length) % currentImages.length, 'prev');
});

(function attachSwipe(el, onLeft, onRight){
  let startX = 0, startY = 0, tracking = false;
  el.addEventListener('touchstart', (e) => { const t = e.touches[0]; startX = t.clientX; startY = t.clientY; tracking = true; }, { passive:true });
  el.addEventListener('touchend', (e) => {
    if (!tracking) return;
    tracking = false;
    const t = e.changedTouches[0];
    const dx = t.clientX - startX, dy = t.clientY - startY;
    if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy) * 1.2){
      if (dx < 0) onLeft(); else onRight();
    }
  }, { passive:true });
})(viewerStage, () => setViewerImage((flowState.imgIndex + 1) % currentImages.length, 'next'),
               () => setViewerImage((flowState.imgIndex - 1 + currentImages.length) % currentImages.length, 'prev'));

