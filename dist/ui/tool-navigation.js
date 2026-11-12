/* One return control in normal document flow, shared by the study tools. */
(function () {
  'use strict';
  function mount() {
    if (document.getElementById('centralToolNavigation')) return;
    const nav = document.createElement('nav');
    nav.id = 'centralToolNavigation';
    nav.className = 'central-tool-navigation';
    nav.setAttribute('aria-label','Retorno à Central');
    const link = document.createElement('a');
    link.id = 'centralToolReturn';
    link.href = '../central-v119.html?direct=34';
    try {
      const context = JSON.parse(sessionStorage.getItem('central-v6:tool-return') || 'null');
      if (context && typeof context === 'object') {
        const query = new URLSearchParams();
        ['subject','module','view'].forEach(key => {
          if (typeof context[key] === 'string') query.set(key,context[key]);
        });
        link.href = '../central-v119.html' + (query.size ? '?' + query.toString() : '');
        if (context.module) link.textContent = 'Voltar ao módulo';
      }
    } catch (_) {}
    if (!link.textContent) link.textContent = '← Voltar à Central';
    nav.appendChild(link);
    document.body.prepend(nav);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded',mount,{once:true});
  else mount();
})();
