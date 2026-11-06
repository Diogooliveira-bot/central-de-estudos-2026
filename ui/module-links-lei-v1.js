/* Base Completa — ordem dos módulos com legislação correspondente.
   Versão de revisão → Teoria completa → Lei em Dia do módulo → links do QConcursos/TEC.
   Apenas reposiciona elementos já renderizados; não altera conteúdo, progresso nem filtros.
   Processo Penal já nasce nesta ordem (ui/cpp-native-study-v1.js).
   O atalho "Cadernos do TEC" das ferramentas some quando o módulo já mostra os filtros. */
(function (g) {
  'use strict';
  if (g.CentralModuleLinksLei) return;
  const LAW_TEXT = /lei em dia/i;
  // anchor: último cartão de teoria (a teoria completa vem depois da revisão). law: bloco de Lei em Dia existente a reposicionar.
  // trigger: botão já ligado ao módulo, usado pelo cartão novo quando não há bloco próprio.
  const CONFIG = [
    { id: 'cf', modules: '#subjects .subject[data-id="cf"] .cf-module[data-cf]', body: ':scope > .cf-module-body',
      anchor: '.cf-native-cards > .cf-study-primary', law: '.cf-native-cards > .cf-study-law',
      // Módulos sem cartão próprio (ex.: M03–M05) abrem a Lei em Dia do módulo pelo mesmo atalho do Constitucional.
      open: module => g.CfNativeStudy?.openDecorando?.(Number(String(module.dataset.cf || '').replace(/\D/g, ''))) },
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
  const TEC_TOOL_TEXT = /cadernos\s+(?:do\s+)?tec/i;
  // Com os filtros do QC/TEC já no bloco de links do módulo, o atalho "Cadernos do TEC"
  // nas ferramentas repetia o mesmo destino. Ele volta a aparecer se o módulo ficar sem filtros.
  function syncTecTool(container, hasLinks) {
    container.querySelectorAll(TOOL_BUTTONS).forEach(button => {
      if (!TEC_TOOL_TEXT.test(button.textContent)) return;
      if (button.classList.contains('bc-tool-relocated') !== hasLinks) button.classList.toggle('bc-tool-relocated', hasLinks);
    });
  }

  function slotFor(body, after) {
    let slot = body.querySelector('[data-bc-module-links]');
    if (!slot) {
      slot = document.createElement('section');
      slot.className = 'bc-module-links';
      slot.setAttribute('data-bc-module-links', '1');
      slot.setAttribute('data-bcq-module-slot', '1');
      slot.innerHTML = '<div class="bc-module-links-head"><span>QUESTÕES DO MÓDULO</span><b>Links do QConcursos e do TEC</b></div>';
    }
    if (after.nextElementSibling !== slot) after.after(slot);
    return slot;
  }
  function lawCard(body, cfg, module) {
    let card = body.querySelector('[data-bc-module-law]');
    if (card) return card;
    card = document.createElement('article');
    card.className = 'bc-module-law-card';
    card.setAttribute('data-bc-module-law', cfg.id);
    card.innerHTML = '<div class="bc-module-law-icon" aria-hidden="true">⚖️</div><div class="bc-module-law-copy"><span>LEI EM DIA</span><h4>Lei em Dia do módulo</h4><p>Artigos e questões de lei seca já filtrados para este módulo.</p></div><div class="bc-module-law-actions"><button type="button" class="bc-module-law-open">Abrir Lei em Dia</button></div>';
    card.querySelector('button').addEventListener('click', () => {
      const trigger = cfg.trigger && (body.querySelector(cfg.trigger) || module.querySelector(cfg.trigger));
      if (trigger) trigger.click(); else cfg.open?.(module);
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
    if (!law && (cfg.trigger || cfg.open)) {
      if (!cfg.open && !body.querySelector(cfg.trigger)) return;
      law = lawCard(body, cfg, module);
    }
    if (!law) return;
    if (anchor.nextElementSibling !== law) anchor.after(law);
    const slot = slotFor(body, law);
    const panel = body.querySelector('[data-bcq-module-panel]');
    if (panel && panel.parentElement !== slot) slot.append(panel);
    if (slot.hidden !== !panel) slot.hidden = !panel;
    if (cfg.hideLaw) body.querySelectorAll(cfg.hideLaw).forEach(node => node.classList.add('bc-law-relocated'));
    body.querySelectorAll(TOOL_BUTTONS).forEach(button => {
      if (LAW_TEXT.test(button.textContent) && !button.closest('[data-bc-module-law]')) button.classList.add('bc-law-relocated');
    });
    syncTecTool(body, !!panel);
  }
  function refresh() {
    CONFIG.forEach(cfg => document.querySelectorAll(cfg.modules).forEach(module => {
      try { apply(cfg, module); } catch (error) { console.warn('[Links e Lei em Dia]', cfg.id, error); }
    }));
    // Processo Penal já renderiza o bloco de links; aqui só se evita o atalho repetido.
    document.querySelectorAll('#subjects .subject[data-id="cpp"] [data-cpp-native-module]').forEach(module => {
      syncTecTool(module, !!module.querySelector('[data-cpp-links-slot] [data-bcq-module-panel]'));
    });
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
