/* Central de Estudos v6.6.97 — ajuste estrutural seguro r1
   Escopo desta etapa: somente resumo de Direito Civil. */
(function(){
  'use strict';

  function patchCivilSummary(){
    var scope=document.querySelector('.subject[data-id="civil"]');
    if(!scope)return;

    var count=scope.querySelector('.subject-count');
    var pct=scope.querySelector('.subject-pct');
    if(count){
      var m=(count.textContent||'').trim().match(/^(\d+)\/\d+\s+m[oó]dulos$/i);
      if(m){
        var done=Math.min(Number(m[1])||0,15);
        count.textContent=done+'/15 módulos';
        if(pct)pct.textContent=Math.round(done/15*100)+'%';
      }
    }

    var walker=document.createTreeWalker(scope,NodeFilter.SHOW_TEXT);
    var n;
    while((n=walker.nextNode())){
      if((n.nodeValue||'').trim()==='Atualizado em 17/08/2026'){
        n.nodeValue=n.nodeValue.replace('Atualizado em 17/08/2026','Conteúdo revisado em 17/08/2026');
      }
    }
  }

  function wrapRenderSubjects(){
    var fn=window.renderSubjects;
    if(typeof fn!=='function'||fn.__centralR1Wrapped)return;
    var wrapped=function(){
      var out=fn.apply(this,arguments);
      Promise.resolve().then(patchCivilSummary);
      return out;
    };
    wrapped.__centralR1Wrapped=true;
    window.renderSubjects=wrapped;
  }

  function boot(){
    wrapRenderSubjects();
    patchCivilSummary();
    setTimeout(function(){wrapRenderSubjects();patchCivilSummary();},400);
    setTimeout(patchCivilSummary,1200);
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});
  else boot();
})();
