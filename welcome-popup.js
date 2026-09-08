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

  document.getElementById('wpClose')?.addEventListener('click', hidePopup);
  document.getElementById('wpOk')?.addEventListener('click', hidePopup);

  document.getElementById('wpNoMore')?.addEventListener('click', () => {
    try{ localStorage.setItem(HIDE_FOREVER_KEY, 'true'); }catch(e){}
    hidePopup();
  });

  document.getElementById('wp1hr')?.addEventListener('click', () => {
    try{ localStorage.setItem(HIDE_UNTIL_KEY, String(Date.now() + 60*60*1000)); }catch(e){}
    hidePopup();
  });

  // Click outside the modal card also closes it (without saving a preference)
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) hidePopup();
  });

  if (shouldShow()){
    setTimeout(showPopup, 400);
  }
})();
