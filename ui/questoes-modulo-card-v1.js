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
  function cardHtml(cls, icone, titulo, desc, tags, botao, botaoCls) {
    return '<div class="bcmc-icon" aria-hidden="true">' + icone + '</div><div class="bcmc-copy"><h3>' + titulo + '</h3><p>' + desc + '</p><div class="bcmc-tags">' + tags.map(t => '<span>' + t + '</span>').join('') + '</div></div><div class="bcmc-actions"><button type="button" class="bcmc-primary' + (botaoCls ? ' ' + botaoCls : '') + '">' + botao + '</button></div>';
  }
  function card(disc, n) {
    const el = document.createElement('article');
    el.className = 'bcmc-card bcmc-questions';
    el.setAttribute('data-bc-questoes-area', '1');
    el.setAttribute('data-bcqa-module-card', disc + ':' + n);
    el.innerHTML = cardHtml('', '✍️', 'Questões do módulo', 'Questões inéditas, com correção na hora e comentário.', ['Questões inéditas', 'Com comentário'], 'Resolver questões', 'bcqa-abrir');
    el.querySelector('.bcqa-abrir').addEventListener('click', ev => { ev.stopPropagation(); g.BCQuestoesArea?.openModule(disc, n); });
    return el;
  }
  // Lei em Dia no mesmo padrão: o bloco original continua existindo (escondido) e é ele que abre a Lei em Dia.
  const LEI_NATIVA = [
    { disc: 'cpc', modules: '#subjects .subject[data-id="cpc"] .cf-module[data-cf]', native: '.cpc-mini-panel', gatilho: 'button[onclick*="openLeiSecaEnxuta"]', texto: /lei em dia/i },
    { disc: 'cf', modules: '#subjects .subject[data-id="cf"] .cf-module[data-cf]', native: '.cf-study-law', gatilho: 'button' },
    { disc: 'cpp', modules: '#subjects .subject[data-id="cpp"] [data-cpp-native-module]', native: '.cpp-native-lei-card', gatilho: 'button' }
  ];
  function leiPadrao(cfg, module) {
    const nativos = [...module.querySelectorAll(cfg.native)].filter(el => !cfg.texto || cfg.texto.test((el.querySelector('h4,h3,b')||el).textContent));
    nativos.forEach(nat => {
      if (nat.dataset.bcmcDone) return;
      const trig = nat.querySelector(cfg.gatilho);
      if (!trig) return;
      nat.dataset.bcmcDone = '1';
      const el = document.createElement('article');
      el.className = 'bc-module-law-card bcmc-card bcmc-law';
      el.setAttribute('data-bc-module-law', cfg.disc);
      el.innerHTML = cardHtml('', '⚖️', 'Lei em Dia', 'Artigos e questões de lei seca já filtrados para este módulo.', ['Lei seca', 'Vinculado ao módulo'], 'Abrir Lei em Dia', 'bc-module-law-open');
      el.querySelector('button').addEventListener('click', () => trig.click());
      // No Processo Civil o bloco nativo vive numa grade de dois painéis (cartão antes da grade); no Constitucional, a grade só tem revisão e teoria (cartão depois dela, em largura total).
      const grade = nat.parentElement && nat.parentElement.matches('.cpc-bottom-grid, .cf-native-cards') ? nat.parentElement : null;
      if (grade && grade.matches('.cf-native-cards')) grade.after(el); else if (grade) grade.before(el); else nat.after(el);
      nat.classList.add('bc-law-relocated');
      // Algumas disciplinas forçam o layout dos cartões nativos com !important; o inline garante que o bloco antigo não apareça duplicado.
      nat.style.setProperty('display', 'none', 'important');
    });
  }
  // Rodapé de todos os módulos: "Ferramentas do módulo" e "Questões feitas por rodadas" saem da tela.
  // Ficam só escondidos (os atalhos internos continuam funcionando para a Lei em Dia).
  const RODAPE = '.ds-footer-tools, .ds-footer-questions, .adm-native-module-tools, .cv-tools';
  function limparRodape() {
    document.querySelectorAll('#subjects ' + RODAPE.split(',').map(x => x.trim()).join(', #subjects ')).forEach(el => el.classList.add('bc-footer-removed'));
    document.querySelectorAll('#subjects .ds-module-footer').forEach(f => {
      const resto = [...f.children].some(c => !c.classList.contains('bc-footer-removed') && !c.matches(RODAPE));
      f.classList.toggle('bc-footer-removed', !resto);
    });
  }
  // Ordem do módulo: Revisão → Teoria completa → Lei em Dia → Questões → filtros QC/TEC → Anotações → Agendar revisão.
  // Só troca a posição de blocos já existentes (Português e RLM); nada é recriado. No rodapé, a ordem Anotações → Agendar revisão vem do CSS (order).
  function ordenar() {
    document.querySelectorAll('#subjects .pt-cf-cards').forEach(g0 => {
      const rev = g0.querySelector(':scope > .pt-cf-card-review'), prim = g0.querySelector(':scope > .pt-cf-card-primary');
      if (rev && prim && rev.compareDocumentPosition(prim) & Node.DOCUMENT_POSITION_PRECEDING) g0.insertBefore(rev, prim);
    });
    document.querySelectorAll('#subjects .bc-rlm-study-grid').forEach(g0 => {
      const rev = g0.querySelector(':scope > .bc-rlm-study-recap'), teo = g0.querySelector(':scope > .bc-rlm-study-theory');
      if (rev && teo && rev.nextElementSibling !== teo) rev.after(teo);
    });
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
    const lei = body.querySelector('[data-bc-module-law]') || body.querySelector('.cpp-native-lei-card');
    const anchor = lei && lei !== el ? lei : ref;
    if (anchor.nextElementSibling !== el) anchor.after(el);
  }
  function refresh() {
    LEI_NATIVA.forEach(cfg => document.querySelectorAll(cfg.modules).forEach(m => { try { leiPadrao(cfg, m); } catch (e) { console.warn('[Lei em Dia]', cfg.disc, e); } }));
    limparRodape();
    ordenar();
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
