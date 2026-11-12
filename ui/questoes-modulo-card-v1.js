/* Base Completa — cartão "Questões do módulo" dentro de cada módulo, logo depois da Lei em Dia
 * (mesmo padrão: um cartão no módulo que abre a tela já filtrada pelo módulo).
 * Não altera conteúdo, progresso nem os filtros do QC/TEC. */
(function (g) {
  'use strict';
  if (g.BCQuestoesModuloCard) return;
  const dig = v => { const m = /(\d+)/.exec(String(v == null ? '' : v)); return m ? Number(m[1]) : 0; };
  // modules: cada módulo na tela. num: número do módulo. body: onde ficam os cartões. after: depois de quê.
  const CONFIG = [
    { disc: 'cf', modules: '#subjects .subject[data-id="cf"] .cf-module[data-cf]', num: m => dig(m.dataset.cf), body: ':scope > .cf-module-body',
      after: '[data-bc-module-law], .cf-native-cards > .cf-study-law, .cf-native-cards > .cf-study-primary:last-of-type, .cf-native-cards > *:last-child' },
    { disc: 'cpc', modules: '#subjects .subject[data-id="cpc"] .cf-module[data-cf]', num: m => dig(m.dataset.cf), body: ':scope > .cf-module-body',
      after: '[data-bc-module-law], .cpc-bottom-grid, .bc-native-materials' },
    { disc: 'penal', modules: '#subjects .subject[data-id="penal"] .cf-module[data-cf]', num: m => dig(m.dataset.cf), body: ':scope > .cf-module-body',
      after: '[data-bc-module-law], .bc-native-materials' },
    { disc: 'civil', modules: '#subjects .subject[data-id="civil"] [data-civil-native-module]', num: m => dig(m.dataset.civilNativeModule), body: ':scope > .cv-module-body > .cv-zone',
      after: '[data-bc-module-law], .cv-cards' },
    { disc: 'adm', modules: '#subjects .subject[data-id="adm"] [data-adm-native]', num: m => { const x = /^adm-(\d+)/.exec(m.dataset.admNative || ''); return x ? Number(x[1]) : dig(m.dataset.admNative); }, body: null,
      after: '[data-bc-module-law], .adm-cf-cards' },
    { disc: 'cpp', modules: '#subjects .subject[data-id="cpp"] [data-cpp-native-module]', num: m => dig(m.dataset.cppNativeModule), body: ':scope .adm-native-material-grid',
      after: '.cpp-native-lei-card, .adm-native-card:last-of-type' },
    { disc: 'pt', modules: '#subjects .subject[data-id="pt"] .cf-module[data-pt-current]', num: m => dig(m.dataset.ptCurrent), body: ':scope > .cf-module-body',
      after: '.pt-cf-module-inside > .pt-cf-cards' },
    { disc: 'rlm', modules: '#subjects .subject[data-id="rlm"] .bc-rlm-module[data-rlm-module]', num: m => dig(m.dataset.rlmModule), body: ':scope > .cf-module-body',
      after: '.bc-native-materials' }
  ];
  function card(disc, n) {
    const el = document.createElement('article');
    el.className = 'bcqa-module-card';
    el.setAttribute('data-bc-questoes-area', '1');
    el.setAttribute('data-bcqa-module-card', disc + ':' + n);
    el.innerHTML = '<div class="bcqa-mc-icon" aria-hidden="true">✍️</div><div class="bcqa-mc-copy"><span class="bcqa-mc-tag">QUESTÕES</span><h4>Questões do módulo</h4><p>10 questões inéditas, com correção na hora e comentário.</p></div><button type="button" class="bcqa-btn" data-bcqa-abrir>Resolver questões</button>';
    el.querySelector('[data-bcqa-abrir]').addEventListener('click', ev => { ev.stopPropagation(); g.BCQuestoesArea?.openModule(disc, n); });
    return el;
  }
  function apply(cfg, module) {
    const n = cfg.num(module);
    if (!n || !g.BCQuestoes?.has(cfg.disc, n)) return;
    const body = cfg.body ? module.querySelector(cfg.body) : module;
    if (!body) return;
    let el = body.querySelector('[data-bcqa-module-card]');
    if (!el) el = card(cfg.disc, n);
    let ref = null;
    for (const sel of cfg.after.split(/\s*,\s*(?![^()]*\))/)) { ref = body.querySelector(sel); if (ref) break; }
    if (!ref) return;
    // Lei em Dia (se existir) vem antes; o cartão de questões fica logo depois dela.
    const lei = body.querySelector('[data-bc-module-law], .cpp-native-lei-card');
    const anchor = lei && lei !== el ? lei : ref;
    if (anchor.nextElementSibling !== el) anchor.after(el);
  }
  function refresh() {
    CONFIG.forEach(cfg => document.querySelectorAll(cfg.modules).forEach(module => {
      try { apply(cfg, module); } catch (e) { console.warn('[Questões do módulo]', cfg.disc, e); }
    }));
  }
  let fila = false;
  function schedule() { if (fila) return; fila = true; (g.requestAnimationFrame || g.setTimeout)(() => { fila = false; try { refresh(); } catch (_) { /* janela encerrada */ } }, 60); }
  g.BCQuestoesModuloCard = { refresh, config: CONFIG };
  function start() {
    refresh();
    new MutationObserver(schedule).observe(document.body, { childList: true, subtree: true });
    document.addEventListener('central:discipline-ready', schedule);
  }
  if (document.body) start(); else document.addEventListener('DOMContentLoaded', start, { once: true });
})(window);
