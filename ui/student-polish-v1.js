(function (global) {
  'use strict';
  if (global.__centralStudentPolishV1) return;
  global.__centralStudentPolishV1 = true;

  function refreshDisciplineCards() {
    if (typeof SUBJECTS === 'undefined') return;
    for (const subject of SUBJECTS) {
      const percentages = global.CentralDisciplineLoader?.percentages(subject);
      if (!Array.isArray(percentages) || !percentages.length) continue;
      const total = percentages.length;
      const done = percentages.filter((value) => value === 100).length;
      const percent = Math.round(percentages.reduce((sum, value) => sum + (Number(value) || 0), 0) / total);
      const card = document.querySelector(`#disciplineGrid .disc-card[data-id="${subject.id}"]`);
      if (!card) continue;
      const description = card.querySelector('small');
      const meta = card.querySelector('.disc-meta');
      const descriptionText = `${total} módulos • curso integrado`;
      const metaText = `${done}/${total} módulos · ${percent}%`;
      if (description && description.textContent !== descriptionText) description.textContent = descriptionText;
      if (meta && meta.textContent !== metaText) meta.textContent = metaText;
    }
  }

  function install() {
    const original = global.renderDisciplineGrid;
    if (typeof original === 'function' && !original.__studentPolishWrapped) {
      const wrapped = function () {
        const result = original.apply(this, arguments);
        refreshDisciplineCards();
        requestAnimationFrame(refreshDisciplineCards);
        return result;
      };
      wrapped.__studentPolishWrapped = true;
      global.renderDisciplineGrid = wrapped;
    }
    const host = document.getElementById('disciplineGrid');
    if (host && !host.__studentPolishObserved) {
      host.__studentPolishObserved = true;
      new MutationObserver(refreshDisciplineCards).observe(host, { childList: true, subtree: true });
    }
    refreshDisciplineCards();
  }

  global.CentralStudentPolish = { refreshDisciplineCards };
  if (document.readyState === 'complete') install();
  else global.addEventListener('load', install, { once: true });
  document.addEventListener('central:discipline-ready', () => setTimeout(refreshDisciplineCards, 0));
  global.addEventListener('central-cloud-applied', () => setTimeout(refreshDisciplineCards, 0));
})(window);
