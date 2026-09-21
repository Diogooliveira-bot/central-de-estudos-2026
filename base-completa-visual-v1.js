/* Base Completa — padronização exclusivamente visual de rótulos */
(function(){
  'use strict';
  const replaceUnit=(text)=>String(text||'')
    .replace(/(\\b\\d+\\s*\\/\\s*\\d+\\s+)metas?\\b/gi,'$1módulos')
    .replace(/\\bmetas concluídas\\b/gi,'Módulos concluídos')
    .replace(/\\btópicos do edital\\b/gi,'módulos do edital')
    .replace(/\\btópicos reais recuperados\\b/gi,'módulos estruturados');
  const applyBrand=()=>{
    document.title='Base Completa — Estude, revise e evolua';
    const icon=document.querySelector('.brand-icon');
    if(icon){if(icon.textContent!=='BC')icon.textContent='BC';icon.setAttribute('aria-label','Base Completa')}
    const brand=document.querySelector('.brand-copy');
    if(brand){
      const name=brand.querySelector('b'),sub=brand.querySelector('small');
      if(name&&name.textContent!=='BASE COMPLETA')name.textContent='BASE COMPLETA';
      if(sub&&sub.textContent!=='Estude. Revise. Evolua.')sub.textContent='Estude. Revise. Evolua.';
    }
    const title=document.querySelector('.topbar > b');
    if(title&&title.textContent!=='BASE COMPLETA')title.textContent='BASE COMPLETA';
  };
  const applyLabels=(root=document)=>{
    root.querySelectorAll?.('.subject-count,.disc-meta,.schedule-intro .eyebrow,.disc-card small').forEach(el=>{
      const next=replaceUnit(el.textContent);
      if(next!==el.textContent)el.textContent=next;
    });
  };
  let queued=false;
  const refresh=()=>{
    queued=false;applyBrand();applyLabels(document);
  };
  const schedule=()=>{if(!queued){queued=true;requestAnimationFrame(refresh)}};
  const init=()=>{
    refresh();
    const observer=new MutationObserver(schedule);
    observer.observe(document.body,{childList:true,subtree:true});
  };
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();