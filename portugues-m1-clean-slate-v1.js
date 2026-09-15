/* Português — limpeza do modelo antigo
 * Mantém integralmente o M1 atual e a sua chave de progresso.
 * Não remove nem altera dados existentes no navegador.
 */
(function(){
  'use strict';
  if(window.__PORTUGUES_M1_CLEAN_SLATE_V1__)return;
  window.__PORTUGUES_M1_CLEAN_SLATE_V1__=true;

  var LEGACY_SELECTORS=[
    '.pt-weeks','.pt-study-nav','.pt-phase-tabs','.pt-week-tabs',
    '.pt-week-focus','.pt-week-guide','.pt-day-route-title','.pt-support-panel',
    '.pt-integrated','.pt-master-panel'
  ];

  function withoutLegacy(markup){
    if(typeof markup!=='string')return markup;
    var box=document.createElement('div');
    box.innerHTML=markup;
    LEGACY_SELECTORS.forEach(function(selector){
      box.querySelectorAll(selector).forEach(function(node){
        /* Nunca retirar um contêiner que pertença ao M1 atual. */
        if(!node.querySelector('.ptm1')&&!node.classList.contains('ptm1'))node.remove();
      });
    });
    return box.innerHTML;
  }

  function removeLegacyDom(root){
    var host=root||document;
    LEGACY_SELECTORS.forEach(function(selector){
      host.querySelectorAll(selector).forEach(function(node){
        if(!node.querySelector('.ptm1')&&!node.classList.contains('ptm1'))node.remove();
      });
    });
  }

  function install(){
    var current=window.renderPortugueseMaster;
    if(typeof current==='function'&&!current.__m1Only){
      var m1Only=function(){return withoutLegacy(current.apply(this,arguments));};
      m1Only.__m1Only=true;
      window.renderPortugueseMaster=m1Only;
    }
    removeLegacyDom(document);
    window.__PORTUGUES_LEGADO_REMOVIDO__=true;
  }

  var observer=new MutationObserver(function(){removeLegacyDom(document);});
  function boot(){
    install();
    observer.observe(document.documentElement,{childList:true,subtree:true});
    setTimeout(install,120);
    setTimeout(install,500);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});
  else boot();
})();
