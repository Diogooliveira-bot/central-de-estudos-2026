/* Base Completa — navegação móvel V2 (somente prévia).
   Os atalhos existentes continuam sendo a única origem das ações e permissões.
   Caso o menu não esteja disponível, a navegação original permanece intacta. */
(function (global) {
  'use strict';
  if (global.BCVisualCleanMobileNav) return;
  const items = [
    { key:'vade', label:'Vade Mecum', hint:'Consultar leis' },
    { key:'edital', label:'Edital', hint:'Acompanhar assuntos' },
    { key:'filters', label:'Filtros', hint:'Filtrar questões' }
  ];
  function install() {
    const panel = document.getElementById('studentMorePanel');
    const trigger = document.getElementById('studentMoreButton');
    const grid = panel?.querySelector('.student-more-grid');
    const rail = document.querySelector('#centralSidebar .student-nav-scroll');
    if (!panel || !trigger || !grid || !rail) return false;
    if (panel.querySelector('.bc-clean-tool-group')) {
      document.documentElement.classList.add('bc-clean-nav-ready');
      return true;
    }
    const origins = items.map(item => rail.querySelector('[data-student-primary-nav="'+item.key+'"]'));
    if (origins.some(button => !button)) return false;
    const group = document.createElement('section');
    group.className = 'bc-clean-tool-group';
    group.setAttribute('aria-label', 'Ferramentas de estudo');
    const heading = document.createElement('strong');
    heading.className = 'bc-clean-tool-heading';
    heading.textContent = 'Ferramentas de estudo';
    group.appendChild(heading);
    const list = document.createElement('div');
    list.className = 'bc-clean-tool-list';
    items.forEach((item,index) => {
      const original = origins[index];
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'bc-clean-tool-option';
      const icon = document.createElement('span');
      icon.className = 'bc-clean-tool-icon';
      icon.setAttribute('aria-hidden','true');
      const svg = original.querySelector('.nav-icon svg');
      if (svg) icon.appendChild(svg.cloneNode(true));
      else icon.textContent = '•';
      const words = document.createElement('span');
      const title = document.createElement('b');
      title.textContent = item.label;
      const hint = document.createElement('small');
      hint.textContent = item.hint;
      words.append(title,hint);
      button.append(icon,words);
      button.addEventListener('click', () => {
        if (!panel.hidden) trigger.click();
        original.click(); /* mesma rota, regras e evento do botão nativo */
      });
      list.appendChild(button);
    });
    group.appendChild(list);
    panel.insertBefore(group,grid);
    /* Oculta atalhos redundantes APENAS em celulares quando as cópias funcionais já existem. */
    document.documentElement.classList.add('bc-clean-nav-ready');
    return true;
  }
  function start() {
    if (install()) return;
    if (!document.body) return;
    const observer = new MutationObserver(() => { if (install()) observer.disconnect(); });
    observer.observe(document.body,{childList:true,subtree:true});
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded',start,{once:true});
  } else start();
  global.BCVisualCleanMobileNav = { check:install };
})(window);
