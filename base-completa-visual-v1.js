/* Base Completa — padronização exclusivamente visual de rótulos */
(function(){
  'use strict';
  const replaceUnit=(text)=>String(text||'')
    .replace(/(\b\d+\s*\/\s*\d+\s+)metas?\b/gi,'$1módulos')
    .replace(/\bmetas concluídas\b/gi,'Módulos concluídos')
    .replace(/\btópicos do edital\b/gi,'módulos do edital')
    .replace(/\btópicos reais recuperados\b/gi,'módulos estruturados');
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

  const applyFrameTypography=(frame)=>{
    try{
      const doc=frame.contentDocument;if(!doc||doc.getElementById('base-completa-font-bridge'))return;
      const style=doc.createElement('style');style.id='base-completa-font-bridge';
      style.textContent='html,body,button,input,textarea,select{font-family:Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Arial,sans-serif!important}body{color:#082c40!important}';
      (doc.head||doc.documentElement).appendChild(style);
    }catch(_){}
  };
  const standardizeFrames=()=>{
    document.querySelectorAll('iframe').forEach(frame=>{
      applyFrameTypography(frame);
      if(!frame.dataset.bcFontBound){frame.dataset.bcFontBound='1';frame.addEventListener('load',()=>applyFrameTypography(frame));}
    });
  };


  const escapeHtml=(value)=>String(value==null?'':value).replace(/[&<>"']/g,char=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[char]));

  const openBaseTool=(tool)=>{
    try{
      if(tool==='anki'&&typeof window.openAnkiIntegrated==='function')window.openAnkiIntegrated();
      if(tool==='decorando'){
        if(typeof window.openLeiSecaEnxuta==='function')window.openLeiSecaEnxuta();
        else if(typeof window.openEmbeddedTool==='function')window.openEmbeddedTool('decorando',{},null);
      }
      if(tool==='tec'){
        if(typeof window.openTecCadernos==='function')window.openTecCadernos();
        else if(typeof window.centralSidebarAction==='function')window.centralSidebarAction('tec-cadernos');
      }
      if(tool==='vade'){
        if(typeof window.openVadeMecum==='function')window.openVadeMecum();
        else if(typeof window.openEmbeddedTool==='function')window.openEmbeddedTool('vade',{},null);
      }
    }catch(e){console.warn('Ferramenta Base Completa',tool,e)}
    return false;
  };
  window.baseCompletaOpenTool=openBaseTool;
  const renderTools=(id,extraClass='')=>{
    const items=(id==='pt'||id==='rlm')
      ? [['tec','Cadernos TEC']]
      : [['decorando','Decorando'],['tec','Cadernos TEC'],['vade','Vade Mecum']];
    return '<div class="bc-kit-tools '+extraClass+'" aria-label="Atalhos da disciplina">'+items.map(item=>'<button type="button" onclick="return baseCompletaOpenTool(&quot;'+item[0]+'&quot;)">'+item[1]+'</button>').join('')+'</div>';
  };
  const renderDisciplineKits=()=>{
    document.querySelectorAll('.subject[data-id]').forEach(section=>{
      const id=section.dataset.id||'';
      if(id==='civil'){
        const target=section.querySelector('.civil-master-intro .civil-target');
        if(!target||target.querySelector('.bc-civil-tools'))return;
        target.insertAdjacentHTML('beforeend',renderTools(id,'bc-civil-tools'));
        return;
      }
      const body=section.querySelector('.subject-body');if(!body||body.querySelector(':scope > .bc-discipline-kit'))return;
      const name=(section.querySelector('.subject-name')?.textContent||'Disciplina').trim();
      let stats={done:0,total:0,pct:0};
      try{const subject=Array.isArray(window.SUBJECTS)?window.SUBJECTS.find(item=>item&&item.id===id):null;if(typeof window.subjStats==='function')stats=window.subjStats(subject||{id,topics:[]})||stats}catch(_){}
      if(!Number.isFinite(Number(stats.total))||!stats.total){
        const text=section.querySelector('.subject-count')?.textContent||'';const m=text.match(/(\d+)\s*\/\s*(\d+)/);
        if(m)stats={done:Number(m[1]),total:Number(m[2]),pct:Math.round(Number(m[1])/Math.max(1,Number(m[2]))*100)};
      }
      const done=Math.max(0,Number(stats.done)||0),total=Math.max(0,Number(stats.total)||0),pct=Math.max(0,Math.min(100,Number(stats.pct)||0));
      const kit='<section class="bc-discipline-kit" data-bc-kit="'+escapeHtml(id)+'">'+
        '<div class="bc-kit-head"><div><span class="bc-kit-eyebrow">BASE COMPLETA</span><h3>'+escapeHtml(name)+'</h3></div>'+
        '<div class="bc-kit-stat"><b>'+done+'/'+total+'</b><small>Módulos concluídos · '+pct+'%</small></div></div>'+
        '<div class="bc-kit-meter"><span style="width:'+pct+'%"></span></div>'+
        '<div class="bc-kit-grid"><article class="bc-kit-card"><b>Seu percurso está preservado</b><p>Teoria, revisões, questões e registros existentes continuam no mesmo módulo.</p></article>'+
        renderTools(id)+'</div></section>';
      const anchor=body.querySelector('.subject-bar');if(anchor)anchor.insertAdjacentHTML('afterend',kit);else body.insertAdjacentHTML('afterbegin',kit);
    });
  };

  let queued=false;
  const refresh=()=>{
    queued=false;applyBrand();applyLabels(document);standardizeFrames();renderDisciplineKits();
  };
  const schedule=()=>{if(!queued){queued=true;requestAnimationFrame(refresh)}};
  const init=()=>{
    refresh();
    const observer=new MutationObserver(schedule);
    observer.observe(document.body,{childList:true,subtree:true});
  };
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();