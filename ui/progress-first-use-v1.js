/* Base Completa — Progresso no primeiro uso (Fase C).
   Enquanto o aluno ainda não registrou sessões nem questões, a tela mostra primeiro o convite
   para começar ("Faça seu primeiro bloco de questões" + "Montar meu plano") e esconde o
   gráfico vazio e a lista de disciplinas com zeros. Com a primeira atividade registrada, a
   tela volta ao formato completo. Só apresentação: nenhum dado é lido de fora da página. */
(function (g) {
  'use strict';
  if (g.BCProgressFirstUse) return;
  function isEmpty(view) {
    const stats = [...view.querySelectorAll('.bc-stat-strip .bc-stat')];
    if (!stats.length) return false;
    // Cada indicador termina no valor ("Sessões" + "0"): vazio quando todos são 0 ou "—".
    return stats.every(s => /^(?:0%?|—|-)$/.test((s.lastElementChild || s).textContent.trim()));
  }
  function update() {
    const view = document.getElementById('performanceView');
    if (!view) return;
    const empty = isEmpty(view);
    view.classList.toggle('bc-progress-empty', empty);
    const card = view.querySelector('#studentPerformanceInsight');
    if (!card) return;
    let plan = card.querySelector('[data-bc-first-plan]');
    if (empty && !plan && typeof g.CentralAgenda?.open === 'function') {
      plan = document.createElement('button');
      plan.type = 'button';
      plan.className = 'btn bc-button bc-button--secondary';
      plan.dataset.bcFirstPlan = '1';
      plan.textContent = 'Montar meu plano';
      plan.addEventListener('click', () => g.CentralAgenda.open());
      card.appendChild(plan);
    }
    if (plan) plan.hidden = !empty;
  }
  let queued = false;
  function schedule() { if (queued) return; queued = true; setTimeout(() => { queued = false; update(); }, 80); }
  function start() {
    const view = document.getElementById('performanceView');
    if (!view) { setTimeout(start, 500); return; }
    new MutationObserver(schedule).observe(view, { childList: true, subtree: true, characterData: true, attributes: true, attributeFilter: ['class'] });
    schedule();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, { once: true }); else start();
  g.BCProgressFirstUse = { update, isEmpty };
})(window);
