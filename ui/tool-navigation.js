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
    link.textContent = '← Voltar à Central';
    nav.appendChild(link);
    document.body.prepend(nav);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded',mount,{once:true});
  else mount();
})();
