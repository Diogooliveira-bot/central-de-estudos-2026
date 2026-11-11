/* Base Completa — simplificação visual de todos os módulos no modo de leitura.
   Remove apenas elementos redundantes; não altera armazenamentos, questões ou progresso. */
(function (global) {
  'use strict';
  if (global.BCModuleCleanV1) return;

  function norm(value) {
    return String(value || '').normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/\s+/g, ' ').trim().toLowerCase();
  }

  function removeStudySequence(view) {
    // O roteiro sugerido é apenas uma orientação duplicada; as ações originais permanecem.
    for (const label of view.querySelectorAll('small,span,b,strong,p,h2,h3,h4,div')) {
      if (label.childElementCount || label.textContent.length > 45 ||
          norm(label.textContent) !== 'sequencia sugerida') continue;
      let parent = label.parentElement;
      let panel = null;
      for (let depth = 0; parent && parent !== view && depth < 6; depth++, parent = parent.parentElement) {
        const copy = norm(parent.textContent);
        if (copy.length > 600) break;
        if (copy.includes('avance uma etapa por vez') && copy.includes('conclua') &&
            !parent.querySelector('.bc-focus-current-module,.cv-module,.cf-module,.cpp-mod,.topic-item')) {
          panel = parent;
        }
      }
      if (panel) panel.remove();
    }
  }

  function removeExternalProgress(module) {
    // Remove apenas o cartão-resumo de rodadas externas, nunca as questões e seus registros.
    for (const label of module.querySelectorAll('b,strong,h3,h4,span')) {
      if (label.childElementCount || norm(label.textContent) !== 'questoes externas') continue;
      const grid = label.closest('.cv-progress-grid,.penal-approved-progress');
      if (!grid) continue;
      let card = label;
      while (card.parentElement && card.parentElement !== grid) card = card.parentElement;
      if (card.parentElement === grid && norm(card.textContent).includes('rodadas')) card.remove();
    }
  }

  function removeQuestionCountSubtitle(module) {
    for (const label of module.querySelectorAll('small')) {
      if (label.childElementCount) continue;
      const description = norm(label.textContent);
      if (!/^\d+ questoes resumidas\s*[·•-]\s*\d+ questoes completas$/.test(description)) continue;
      if (label.closest('.cv-module-head,.cf-module-head,.cpp-mod-head,.topic-head,.module-head,.ds-module-head')) {
        label.remove();
      }
    }
  }

  function update() {
    const view = document.getElementById('homeView');
    if (!view || !view.classList.contains('bc-focus-has-module')) return;
    removeStudySequence(view);
    const module = view.querySelector('.subject.bc-focus-selected-subject .bc-focus-current-module');
    if (!module) return;
    removeExternalProgress(module);
    removeQuestionCountSubtitle(module);
  }

  let scheduled = false;
  function schedule() {
    if (scheduled) return;
    scheduled = true;
    setTimeout(function () { scheduled = false; update(); }, 80);
  }

  function start() {
    const view = document.getElementById('homeView');
    if (!view) { setTimeout(start, 300); return; }
    new MutationObserver(schedule).observe(view, {
      childList: true, subtree: true, attributes: true, attributeFilter: ['class']
    });
    schedule();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start, { once: true });
  } else {
    start();
  }
  global.BCModuleCleanV1 = { update };
})(window);
