(function (global) {
  'use strict';

  const map = global.CPC_SHARING_LINKS;
  const styleId = 'cpc-sharing-links-style';
  const installedFlag = '__cpcSharingLinksInstalled';

  function escapeHtml(value) {
    return String(value ?? '').replace(/[&<>"']/g, character => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    })[character]);
  }

  function validLink(item) {
    if (!item || item.public !== true) return false;
    try {
      const url = new URL(item.link);
      return url.origin === 'https://www.qconcursos.com'
        && url.pathname === '/questoes-de-concursos/questoes'
        && url.searchParams.get('notebook_ids[]') === String(item.id);
    } catch (_) {
      return false;
    }
  }

  function renderItem(item, kind) {
    if (!validLink(item)) return '';
    const code = escapeHtml(item.code);
    const title = escapeHtml(item.title);
    const count = Number(item.count);
    const label = kind === 'general' ? 'Caderno geral' : code;
    return '<a class="cf-btn cpc-sharing-link" data-cpc-qc-link="' + code
      + '" data-cpc-qc-id="' + escapeHtml(item.id)
      + '" data-cpc-qc-count="' + count
      + '" href="' + escapeHtml(item.link)
      + '" target="_blank" rel="noopener noreferrer" aria-label="Abrir '
      + escapeHtml(label + ': ' + item.title + ', ' + count + ' questões')
      + '"><span>' + escapeHtml(label) + ' · ' + title + '</span><b>'
      + count + ' questões ↗</b></a>';
  }

  function renderModule(moduleCode) {
    if (map?.locked === true) {
      return '<section class="cpc-sharing-panel" data-cpc-sharing-code="' + escapeHtml(moduleCode)
        + '" aria-label="Recurso Premium QConcursos de ' + escapeHtml(moduleCode) + '">'
        + '<div class="cpc-sharing-heading"><h3>QConcursos · 🔒 Premium</h3><span>Cadernos e filtros exclusivos</span></div>'
        + '<p>Este recurso é exclusivo do Base Completa Premium.</p>'
        + '<button type="button" class="cf-btn" data-cpc-premium-cta>Conhecer o Premium</button></section>';
    }
    const module = map?.modules?.[moduleCode];
    if (!module?.general) return '';
    const general = renderItem(module.general, 'general');
    const subdivisions = (module.subdivisions || []).map(item => renderItem(item, 'subdivision')).filter(Boolean);
    return '<section class="cpc-sharing-panel" data-cpc-sharing-code="' + escapeHtml(moduleCode)
      + '" aria-label="Cadernos de questões de ' + escapeHtml(moduleCode) + '">'
      + '<div class="cpc-sharing-heading"><h3>Questões do módulo</h3><span>'
      + escapeHtml(moduleCode) + ' · ' + escapeHtml(module.title) + '</span></div>'
      + '<div class="cpc-sharing-general">' + general + '</div>'
      + (subdivisions.length ? '<div class="cpc-sharing-subdivisions" aria-label="Subdivisões temáticas">'
        + subdivisions.join('') + '</div>' : '')
      + '</section>';
  }

  function moduleCodeFromCard(card) {
    const match = String(card?.dataset?.cf || '').match(/^cpc(\d{1,2})$/);
    return match ? 'M' + match[1].padStart(2, '0') : '';
  }

  function addStyles() {
    if (document.getElementById(styleId)) return;
    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = '.cpc-sharing-panel{margin:16px 0 0;padding:16px;border:1px solid var(--line,#d8d5cd);border-radius:14px;background:var(--panel,#fff)}'
      + '.cpc-sharing-heading{display:flex;align-items:baseline;justify-content:space-between;gap:12px;margin-bottom:12px}'
      + '.cpc-sharing-heading h3{margin:0;font-size:15px}.cpc-sharing-heading>span{color:var(--muted,#706b64);font-size:12px}'
      + '.cpc-sharing-general{margin-bottom:8px}.cpc-sharing-subdivisions{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px}'
      + '.cpc-sharing-link{display:flex!important;align-items:center;justify-content:space-between;gap:12px;min-height:44px;text-align:left;white-space:normal!important;text-decoration:none!important}'
      + '.cpc-sharing-link b{flex:none;font-size:12px}.cpc-sharing-link:focus-visible{outline:3px solid var(--discipline-accent,#38bdf8);outline-offset:2px}'
      + '@media(max-width:680px){.cpc-sharing-panel{padding:12px;margin:12px 0 0}.cpc-sharing-heading{display:block}.cpc-sharing-heading>span{display:block;margin-top:4px}.cpc-sharing-subdivisions{grid-template-columns:1fr}.cpc-sharing-link{align-items:flex-start;flex-direction:column;gap:4px}}';
    document.head.appendChild(style);
  }

  function decorate(html) {
    const template = document.createElement('template');
    template.innerHTML = html;
    template.content.querySelectorAll('.cf-module[data-cf]').forEach(card => {
      const moduleCode = moduleCodeFromCard(card);
      if (!moduleCode) return;
      const body = card.querySelector(':scope > .cf-module-body');
      if (!body) return;
      body.querySelector('[data-cpc-sharing-code]')?.remove();
      const markup = renderModule(moduleCode);
      if (!markup) return;
      const panel = document.createElement('template');
      panel.innerHTML = markup;
      const element = panel.content.firstElementChild;
      element?.querySelector('[data-cpc-premium-cta]')?.addEventListener('click', () => global.alert('Este recurso é exclusivo do Base Completa Premium.'));
      body.appendChild(element);
    });
    return template.innerHTML;
  }

  function install() {
    if (global[installedFlag]) return;
    if (!map || !global.CpcStudyV1 || typeof global.CpcStudyV1.renderMaster !== 'function') {
      global.setTimeout(install, 80);
      return;
    }
    addStyles();
    const base = global.CpcStudyV1.renderMaster;
    function renderMasterWithCpcSharingLinks() {
      return decorate(base.apply(this, arguments));
    }
    renderMasterWithCpcSharingLinks.__cpcSharingLinks = true;
    global.CpcStudyV1.renderMaster = renderMasterWithCpcSharingLinks;
    global[installedFlag] = true;
    try { global.renderAll?.(); } catch (_) { /* render on the next Central refresh */ }
  }

  global.CpcSharingLinks = { renderModule, validLink };
  global.setTimeout(install, 0);
})(window);
