/* Limpeza visual reversível de controles redundantes nos módulos.
   Não remove dados, listeners, progresso, questões ou registros. */
(function () {
  'use strict';
  const norm = (s) => String(s || '').replace(/\\s+/g, ' ').trim().toLowerCase();
  const isModule = (node) => !!node?.closest('.cf-module,.topic-item,.civil-module,.cpp-mod,.cv-module,[data-uid],[data-cf],.subject-body');
  const exact = (node, label) => norm(node.textContent) === label;
  function mark(node, reason) {
    if (!node || node.dataset.moduleDuplicateHidden) return;
    node.dataset.moduleDuplicateHidden = reason;
    node.hidden = true;
    node.style.setProperty('display', 'none', 'important');
  }
  function clean(root) {
    const scope = root?.querySelectorAll ? root : document;
    const buttons = scope.querySelectorAll('button,a');
    for (const button of buttons) {
      if (!isModule(button) || button.closest('#centralSidebar,#questionFiltersView,.bcq-center-content')) continue;
      const label = norm(button.textContent);
      if (label === 'abrir materiais') {
        const box = button.closest('.card,.resource,.resource-box,.module-progress-card,.progress-card') || button.parentElement;
        if (box && /materiais/i.test(box.textContent) && box.querySelectorAll('button,a').length <= 2) mark(box, 'materials');
      } else if (label === 'abrir questões e registros') {
        const box = button.closest('.card,.resource,.resource-box,.module-progress-card,.progress-card') || button.parentElement;
        if (box && /questões\\s*\\/\\s*tec/i.test(box.textContent) && box.querySelectorAll('button,a').length <= 2) mark(box, 'question-summary');
      }
    }
    const groups = scope.querySelectorAll('div,nav,section');
    for (const group of groups) {
      if (!isModule(group) || group.closest('#centralSidebar,#questionFiltersView')) continue;
      const children = Array.from(group.children).filter(el => el.matches('button,a'));
      if (children.length !== 4 || group.children.length !== 4) continue;
      const labels = children.map(el => norm(el.textContent));
      if (['conteúdo','questões / tec','ferramentas','anotações'].every(label => labels.includes(label))) mark(group, 'shortcut-bar');
    }
  }
  let pending = false;
  const schedule = () => {
    if (pending) return;
    pending = true;
    requestAnimationFrame(() => { pending = false; clean(document); });
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', schedule, {once:true});
  else schedule();
  new MutationObserver(schedule).observe(document.documentElement, {childList:true,subtree:true});
})();
