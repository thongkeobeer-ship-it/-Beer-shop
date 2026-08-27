/* ---------------------------------------------------------------
   NAVBAR + SCROLL-REVEAL SHELL (index.html)
   - Adds "scrolled" style to the navbar once the page is scrolled
   - Reveals every ".reveal" element (section heads, category cards,
     product cards) by adding the ".in" class once it enters view
   --------------------------------------------------------------- */
(function initNavbarReveal(){
  const navbar = document.getElementById('navbar');

  function onScroll(){
    if (!navbar) return;
    navbar.classList.toggle('scrolled', window.scrollY > 8);
  }
  onScroll();
  window.addEventListener('scroll', onScroll, { passive:true });

  const revealEls = document.querySelectorAll('.reveal');
  if (!revealEls.length) return;

  if ('IntersectionObserver' in window){
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting){
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    revealEls.forEach(el => io.observe(el));
  } else {
    // fallback: no IntersectionObserver support, just reveal everything
    revealEls.forEach(el => el.classList.add('in'));
  }
})();
