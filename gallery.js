/* ---------------------------------------------------------------
   GALLERY SYSTEM (main image + thumbnail strip, swipe, crossfade)
   --------------------------------------------------------------- */
const galleryMain    = document.getElementById('galleryMain');
const galleryMainImg = document.getElementById('galleryMainImg');
const galleryMainImgNext = document.getElementById('galleryMainImgNext');
const galleryCounter = document.getElementById('galleryCounter');
const galleryThumbs  = document.getElementById('galleryThumbs');
const galleryPrev    = document.getElementById('galleryPrev');
const galleryNext    = document.getElementById('galleryNext');

let currentImages = [];
let activeImg = galleryMainImg;
let idleImg   = galleryMainImgNext;

function initGallery(images){
  currentImages = images;
  flowState.imgIndex = 0;
  galleryThumbs.innerHTML = images.map((src, i) =>
    `<div class="gallery-thumb${i === 0 ? ' active' : ''}" data-idx="${i}"><img src="${src}" alt="Thumbnail ${i + 1}" loading="lazy"></div>`
  ).join('');
  setMainImage(0, null);
}

function positionInstant(el, sideClass){
  el.classList.add('gm-no-transition');
  el.classList.remove('gm-left', 'gm-right');
  if (sideClass) el.classList.add(sideClass);
  void el.offsetWidth; // force reflow so the jump applies before re-enabling the transition
  el.classList.remove('gm-no-transition');
}

function updateChrome(idx){
  flowState.imgIndex = idx;
  galleryCounter.textContent = `${String(idx + 1).padStart(2, '0')} / ${currentImages.length}`;
  galleryThumbs.querySelectorAll('.gallery-thumb').forEach(t => t.classList.toggle('active', +t.dataset.idx === idx));
  const activeThumb = galleryThumbs.querySelector(`.gallery-thumb[data-idx="${idx}"]`);
  if (activeThumb) activeThumb.scrollIntoView({ behavior:'smooth', inline:'center', block:'nearest' });
}

function setMainImage(idx, direction){
  if (idx < 0 || idx >= currentImages.length) return;

  if (!direction){
    activeImg.src = currentImages[idx];
    updateChrome(idx);
    return;
  }

  const incoming = idleImg;
  const outgoing = activeImg;
  const fromSide = direction === 'next' ? 'gm-right' : 'gm-left';
  const toSide   = direction === 'next' ? 'gm-left'  : 'gm-right';

  incoming.src = currentImages[idx];
  positionInstant(incoming, fromSide);

  // wait a frame so the browser paints the start position, then animate both layers together
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      incoming.classList.remove(fromSide);
      outgoing.classList.remove('gm-left', 'gm-right');
      outgoing.classList.add(toSide);
    });
  });

  updateChrome(idx);
  activeImg = incoming;
  idleImg = outgoing;
}

galleryPrev.addEventListener('click', (e) => { e.stopPropagation(); setMainImage((flowState.imgIndex - 1 + currentImages.length) % currentImages.length, 'prev'); });
galleryNext.addEventListener('click', (e) => { e.stopPropagation(); setMainImage((flowState.imgIndex + 1) % currentImages.length, 'next'); });
galleryThumbs.addEventListener('click', (e) => {
  const thumb = e.target.closest('.gallery-thumb');
  if (!thumb) return;
  const idx = +thumb.dataset.idx;
  setMainImage(idx, idx > flowState.imgIndex ? 'next' : 'prev');
});
galleryMain.addEventListener('click', () => openViewer(flowState.imgIndex));

// swipe on main gallery image (mobile)
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
})(galleryMain, () => setMainImage((flowState.imgIndex + 1) % currentImages.length, 'next'),
               () => setMainImage((flowState.imgIndex - 1 + currentImages.length) % currentImages.length, 'prev'));

