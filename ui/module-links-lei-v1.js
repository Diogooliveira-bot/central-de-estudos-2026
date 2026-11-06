/* Base Completa — ordem dos módulos com legislação correspondente.
   Teoria completa → Versão de revisão → links do QConcursos/TEC → Lei em Dia do módulo.
   Apenas reposiciona elementos já renderizados; não altera conteúdo, progresso nem filtros.
   Processo Penal já nasce nesta ordem (ui/cpp-native-study-v1.js). */
(function (g) {
  'use strict';
  if (g.CentralModuleLinksLei) return;
  const LAW_TEXT = /lei em dia/i;
  // anchor: último cartão de teoria. law: bloco de Lei em Dia existente a reposicionar.
  // trigger: botão já ligado ao módulo, usado pelo cartão novo quando não há bloco próprio.
  const CONFIG = [
    { id: 'cf', modules: '#subjects .subject[data-id="cf"] .cf-module[data-cf]', body: ':scope > .cf-module-body',
      anchor: '.cf-native-cards > .cf-study-review', law: '.cf-native-cards > .cf-study-law' },
    { id: 'cpc', modules: '#subjects .subject[data-id="cpc"] .cf-module[data-cf]', body: ':scope > .cf-module-body',
      anchor: ':scope > .bc-native-materials', law: ':scope > .cpc-bottom-grid' },
    { id: 'penal', modules: '#subjects .subject[data-id="penal"] .cf-module[data-cf]', body: ':scope > .cf-module-body',
      anchor: ':scope > .bc-native-materials', trigger: '.penal-approved-extra button, .ds-footer-tools [onclick*="decorando"]', hideLaw: '.penal-approved-extra' },
    { id: 'civil', modules: '#subjects .subject[data-id="civil"] [data-civil-native-module]', body: ':scope > .cv-module-body > .cv-zone',
      anchor: ':scope > .cv-cards', trigger: '.cv-tools [onclick*="decorando"]' },
    { id: 'adm', modules: '#subjects .subject[data-id="adm"] [data-adm-native]', body: null,
      anchor: ':scope > .adm-cf-cards', trigger: '.adm-native-module-tools [onclick*="decorando"]' }
  ];
  const TOOL_BUTTONS = '.ds-footer-tools .chips > *, .cv-tools button, .adm-native-module-tools button';

  function slotFor(body, anchor) {
    let slot = body.querySelector('[data-bc-module-links]');
    if (!slot) {
      slot = document.createElement('section');
      slot.className = 'bc-module-links';
      slot.setAttribute('data-bc-module-links', '1');
      slot.setAttribute('data-bcq-module-slot', '1');
      slot.innerHTML = '<div class="bc-module-links-head"><span>QUESTÕES DO MÓDULO</span><b>Links do QConcursos e do TEC</b></div>';
    }
    if (anchor.nextElementSibling !== slot) anchor.after(slot);
    return slot;
  }
  function lawCard(body, cfg) {
    let card = body.querySelector('[data-bc-module-law]');
    if (card) return card;
    card = document.createElement('article');
    card.className = 'bc-module-law-card';
    card.setAttribute('data-bc-module-law', cfg.id);
    card.innerHTML = '<div class="bc-module-law-icon" aria-hidden="true">⚖️</div><div class="bc-module-law-copy"><span>LEI EM DIA</span><h4>Lei em Dia do módulo</h4><p>Artigos e questões de lei seca já filtrados para este módulo.</p></div><div class="bc-module-law-actions"><button type="button" class="bc-module-law-open">Abrir Lei em Dia</button></div>';
    card.querySelector('button').addEventListener('click', () => {
      const trigger = body.querySelector(cfg.trigger) || body.closest(cfg.modules)?.querySelector(cfg.trigger);
      trigger?.click();
    });
    return card;
  }
  function apply(cfg, module) {
    const body = cfg.body ? module.querySelector(cfg.body) : module;
    if (!body) return;
    const anchor = body.querySelector(cfg.anchor);
    if (!anchor) return;
    let law = cfg.law ? body.querySelector(cfg.law) : null;
    if (cfg.law && law && !LAW_TEXT.test(law.textContent)) law = null;
    if (!law && cfg.trigger) {
      if (!body.querySelector(cfg.trigger)) return;
      law = lawCard(body, cfg);
    }
    if (!law) return;
    const slot = slotFor(body, anchor);
    const panel = body.querySelector('[data-bcq-module-panel]');
    if (panel && panel.parentElement !== slot) slot.append(panel);
    if (slot.hidden !== !panel) slot.hidden = !panel;
    if (slot.nextElementSibling !== law) slot.after(law);
    if (cfg.hideLaw) body.querySelectorAll(cfg.hideLaw).forEach(node => node.classList.add('bc-law-relocated'));
    body.querySelectorAll(TOOL_BUTTONS).forEach(button => {
      if (LAW_TEXT.test(button.textContent) && !button.closest('[data-bc-module-law]')) button.classList.add('bc-law-relocated');
    });
  }
  function refresh() {
    CONFIG.forEach(cfg => document.querySelectorAll(cfg.modules).forEach(module => {
      try { apply(cfg, module); } catch (error) { console.warn('[Links e Lei em Dia]', cfg.id, error); }
    }));
  }
  let queued = false;
  function schedule() {
    if (queued) return;
    queued = true;
    g.requestAnimationFrame(() => { queued = false; refresh(); });
  }
  g.CentralModuleLinksLei = { refresh, config: CONFIG };
  function start() {
    refresh();
    new MutationObserver(schedule).observe(document.documentElement, { childList: true, subtree: true });
    document.addEventListener('central:discipline-ready', schedule);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, { once: true });
  else start();
})(window);
