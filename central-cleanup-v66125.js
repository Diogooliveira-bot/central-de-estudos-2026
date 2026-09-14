/* Central de Estudos — v6.6.125 visual enxuto
   Mantém um único botão funcional para o Cronograma na página inicial. */
(function(){
  'use strict';

  function activate(){
    var button=document.querySelector('#homeView .hero > .btn.primary');
    if(!button)return;
    button.onclick=function(){
      return window.openEmbeddedTool('cronograma',{},button);
    };
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',activate,{once:true});
  else activate();
})();
