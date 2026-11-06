/* Base Completa — barra de ação no topo do módulo (Fase C).
   Ao abrir um módulo, o aluno vê logo de início os três caminhos de estudo: teoria completa,
   revisão e questões. Cada botão aciona o botão original do módulo (mesma ação, mesmo
   progresso); nada é duplicado ou recriado. A caixa repetida "Disciplina · 0/N módulos" e
   avisos internos saem de cima do módulo, pois o cabeçalho fixo já mostra disciplina e módulo. */
(function (g) {
  'use strict';
  if (g.BCModuleQuickActions) return;
  const ACTIONS = [
    { key: 'theory', match: /^Estudar conteúdo$/, icon: '📚', title: 'Teoria completa', hint: 'Apostila integral' },
    { key: 'review', match: /^Revisar conteúdo$/, icon: '⚡', title: 'Revisão', hint: 'Pontos essenciais' },
    // Lei em Dia do próprio módulo: cada disciplina já tem o seu botão com o filtro do módulo
    // (Penal/Civil/CPP/ADM: onclick com "decorando"; CF: openDecorando; CPC: data-cpc-law).
    { key: 'law', selector: 'button[onclick*="decorando" i],button[onclick*="openLeiSeca"],button[data-cpc-law]', icon: '📖', title: 'Lei em Dia', hint: 'Lei seca deste módulo' },
    { key: 'quiz', match: /^Resolver \d+ questões$/, icon: '✍️', title: 'Questões', hint: '' }
  ];
  const label = b => b.textContent.replace(/\s+/g, ' ').trim();
  const visible = b => !!b && b.offsetParent !== null && !b.disabled;
  // Botões genéricos (sem filtro de módulo) não contam como "Lei em Dia deste módulo".
  const moduleLaw = b => !b.disabled && !/decorando'\s*,\s*\{\s*\}/.test(b.getAttribute('onclick') || '');

  function findActions(box) {
    const buttons = [...box.querySelectorAll('button')].filter(b => !b.closest('.bc-module-quickbar'));
    return ACTIONS.map(a => {
      if (a.selector) {
        const laws = buttons.filter(b => b.matches(a.selector) && moduleLaw(b));
        return { ...a, target: laws.find(visible) || laws[0] };
      }
      return { ...a, target: buttons.find(b => a.match.test(label(b)) && visible(b)) };
    }).filter(a => a.target);
  }
  function build(box, actions) {
    const bar = document.createElement('nav');
    bar.className = 'bc-module-quickbar';
    bar.setAttribute('aria-label', 'Estudar este módulo');
    bar.dataset.module = box.dataset.focusKey || label(box).slice(0, 60);
    actions.forEach((a, i) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'bc-module-quick' + (i === 0 ? ' bc-module-quick-primary' : '');
      btn.dataset.quick = a.key;
      const hint = a.key === 'quiz' ? label(a.target).replace(/^Resolver /, '') : a.hint;
      btn.innerHTML = '<span class="bc-module-quick-icon" aria-hidden="true"></span><span class="bc-module-quick-text"><b></b><small></small></span>';
      btn.querySelector('.bc-module-quick-icon').textContent = a.icon;
      btn.querySelector('b').textContent = a.title;
      btn.querySelector('small').textContent = hint;
      btn.addEventListener('click', () => { if (a.target.isConnected) a.target.click(); });
      bar.appendChild(btn);
    });
    return bar;
  }
  function update() {
    const home = document.getElementById('homeView');
    const reading = home && home.classList.contains('bc-focus-has-module');
    const box = reading ? document.querySelector('.subject.bc-focus-selected-subject .bc-focus-current-module') : null;
    document.querySelectorAll('.bc-module-quickbar').forEach(bar => { if (!box || bar.nextElementSibling !== box) bar.remove(); });
    if (!box) return;
    const actions = findActions(box);
    const existing = box.previousElementSibling?.classList.contains('bc-module-quickbar') ? box.previousElementSibling : null;
    const signature = actions.map(a => a.key + ':' + label(a.target)).join('|');
    if (existing && existing.dataset.signature === signature) return;
    existing?.remove();
    if (actions.length < 2) return;
    const bar = build(box, actions);
    bar.dataset.signature = signature;
    box.before(bar);
  }
  let queued = false;
  function schedule() { if (queued) return; queued = true; setTimeout(() => { queued = false; update(); }, 60); }
  function start() {
    const home = document.getElementById('homeView');
    if (!home) { setTimeout(start, 400); return; }
    new MutationObserver(schedule).observe(home, { attributes: true, attributeFilter: ['class'], subtree: true, childList: true });
    schedule();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, { once: true }); else start();
  g.BCModuleQuickActions = { update };
})(window);
