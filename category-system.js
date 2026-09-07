  // ============ CATEGORY CARDS ============
  // Click animation removed — ready for a new flow to be wired in here.
  document.querySelectorAll('.cat-row[data-cat]').forEach(card => {
    card.addEventListener('click', () => {
      const catKey = card.dataset.cat;
      // TODO: hook up new destination/behavior here.
    });
  });
