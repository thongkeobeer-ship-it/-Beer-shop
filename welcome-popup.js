(function initWelcomePopup(){
  const HIDE_FOREVER_KEY = 'bjBeerShop_hidePopupForever';
  const HIDE_UNTIL_KEY   = 'bjBeerShop_hidePopupUntil';

  const overlay = document.getElementById('wpOverlay');
  if (!overlay) return;

  function shouldShow(){
    try{
      if (localStorage.getItem(HIDE_FOREVER_KEY) === 'true') return false;
      const until = Number(localStorage.getItem(HIDE_UNTIL_KEY) || 0);
      if (until && Date.now() < until) return false;
      return true;
    }catch(e){
      // localStorage unavailable (private mode etc.) — show popup by default
      return true;
    }
  }

  function showPopup(){
    overlay.classList.add('show');
    document.body.style.overflow = 'hidden';
  }
  function hidePopup(){
    overlay.classList.remove('show');
    document.body.style.overflow = '';
  }

  // Only wpNoMore and wp1hr exist in the markup.
  document.getElementById('wpNoMore')?.addEventListener('click', (e) => {
    e.stopPropagation();
    try{ localStorage.setItem(HIDE_FOREVER_KEY, 'true'); }catch(err){}
    hidePopup();
  });

  document.getElementById('wp1hr')?.addEventListener('click', (e) => {
    e.stopPropagation();
    try{ localStorage.setItem(HIDE_UNTIL_KEY, String(Date.now() + 60*60*1000)); }catch(err){}
    hidePopup();
  });

  // Clicking the dark backdrop (or the image itself) closes it without
  // saving a preference — only the two explicit buttons persist a choice.
  overlay.addEventListener('click', () => hidePopup());
  overlay.querySelector('.wp-modal')?.addEventListener('click', (e) => e.stopPropagation());
  overlay.querySelector('.wp-img-wrap img')?.addEventListener('click', hidePopup);

  if (shouldShow()){
    setTimeout(showPopup, 400);
  }
})();
