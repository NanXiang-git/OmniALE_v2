(() => {
  const prior = window.OmniResults;
  if (!prior) return;
  const key = 'task-captaincook4d';
  const url = 'captaincook4d-v2/index.html';
  function link() {
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.className = 'button';
    anchor.textContent = 'V2 普通话讲解 · 新版评测 ↗';
    return anchor;
  }
  window.OmniResults = Object.freeze({...prior,
    render(entry, row, target) {
      prior.render(entry, row, target);
      if (entry.key === key) target.prepend(link());
    },
    overview(cases, results, target) {
      prior.overview(cases, results, target);
      const row = target.querySelector('a[href="#' + key + '/results"]')?.closest('tr');
      if (row) row.lastElementChild.append(link());
    }
  });
})();