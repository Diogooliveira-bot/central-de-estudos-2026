/* BASE COMPLETA — atualização visual dos indicadores da Home.
   A estrutura é estática em index.html; este script não move componentes. */
(function(){
  'use strict';
  function decorateSubject(section){
    if(!section) return;
    const pctEl=section.querySelector('.subject-pct');
    if(!pctEl) return;
    const match=String(pctEl.textContent||'').match(/(\d+(?:[.,]\d+)?)\s*%/);
    const pct=match?Math.max(0,Math.min(100,Number(String(match[1]).replace(',','.'))||0)):0;
    section.style.setProperty('--bc-pct',String(pct));
    pctEl.setAttribute('data-bc-pct',Math.round(pct)+'%');
  }
  function update(){
    document.querySelectorAll('#homeView #subjects>.subject[data-id]').forEach(decorateSubject);
  }
  let queued=false;
  function schedule(){
    if(queued)return;
    queued=true;
    requestAnimationFrame(function(){queued=false;update()});
  }
  function init(){
    update();
    const subjects=document.getElementById('subjects');
    if(subjects)new MutationObserver(schedule).observe(subjects,{childList:true,subtree:true,characterData:true});
    window.addEventListener('storage',schedule);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});
  else init();
})();