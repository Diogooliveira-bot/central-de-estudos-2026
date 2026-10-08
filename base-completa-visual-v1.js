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
      : [['decorando','Lei em Dia'],['tec','Cadernos TEC'],['vade','Vade Mecum']];
    return '<div class="bc-kit-tools '+extraClass+'" aria-label="Atalhos da disciplina">'+items.map(item=>'<button type="button" onclick="return baseCompletaOpenTool(&quot;'+item[0]+'&quot;)">'+item[1]+'</button>').join('')+'</div>';
  };
  const renderDisciplineKits=()=>{
    document.querySelectorAll('.subject[data-id]').forEach(section=>{
      const id=section.dataset.id||'';
      const body=section.querySelector('.subject-body');
      if(!body||body.querySelector(':scope > .bc-discipline-kit'))return;
      if(id==='civil'){
        const legacy=section.querySelector('.civil-master-intro');
        if(legacy)legacy.classList.add('bc-civil-legacy-intro');
      }
      const name=(section.querySelector('.subject-name')?.textContent||'Disciplina').trim();
      let stats={done:0,total:0,pct:0};
      try{const subject=Array.isArray(window.SUBJECTS)?window.SUBJECTS.find(item=>item&&item.id===id):null;if(typeof window.subjStats==='function')stats=window.subjStats(subject||{id,topics:[]})||stats}catch(_){}
      if(!Number.isFinite(Number(stats.total))||!stats.total){
        const text=section.querySelector('.subject-count')?.textContent||'';const m=text.match(/(\d+)\s*\/\s*(\d+)/);
        if(m)stats={done:Number(m[1]),total:Number(m[2]),pct:Math.round(Number(m[1])/Math.max(1,Number(m[2]))*100)};
      }
      const done=Math.max(0,Number(stats.done)||0),total=Math.max(0,Number(stats.total)||0),pct=Math.max(0,Math.min(100,Number(stats.pct)||0));
      const preserved=id==='civil'
        ? 'Teoria completa, jurisprudência, exemplos e pegadinhas organizados em 15 módulos para Analista Judiciário.'
        : 'Teoria, revisões, questões e registros existentes continuam no mesmo módulo.';
      const kit='<section class="bc-discipline-kit" data-bc-kit="'+escapeHtml(id)+'">'+
        '<div class="bc-kit-head"><div><span class="bc-kit-eyebrow">BASE COMPLETA</span><h3>'+escapeHtml(name)+'</h3></div>'+
        '<div class="bc-kit-stat"><b>'+done+'/'+total+'</b><small>Módulos concluídos · '+pct+'%</small></div></div>'+
        '<div class="bc-kit-meter"><span style="width:'+pct+'%"></span></div>'+
        '<div class="bc-kit-grid"><article class="bc-kit-card"><b>Seu percurso está preservado</b><p>'+escapeHtml(preserved)+'</p></article>'+
        renderTools(id)+'</div></section>';
      const anchor=body.querySelector('.subject-bar');if(anchor)anchor.insertAdjacentHTML('afterend',kit);else body.insertAdjacentHTML('afterbegin',kit);
    });
  };


  const ensureCpcMapStyles=()=>{
    if(document.getElementById('bc-cpc-map-style'))return;
    const style=document.createElement('style');style.id='bc-cpc-map-style';
    style.textContent=`
      .bc-cpc-map-card{margin:14px 0 4px;border:1px solid rgba(56,189,248,.32);border-radius:16px;overflow:hidden;background:linear-gradient(145deg,rgba(56,189,248,.10),rgba(124,92,255,.08));cursor:pointer;box-shadow:0 12px 28px rgba(0,0,0,.13)}
      .bc-cpc-map-card:hover{border-color:rgba(56,189,248,.60);transform:translateY(-1px)}
      .bc-cpc-map-preview{height:330px;background:#eef4fb;overflow:hidden;border-bottom:1px solid rgba(56,189,248,.22);position:relative}
      .bc-cpc-map-preview iframe{width:100%;height:100%;border:0;display:block;pointer-events:none;background:#eef4fb}
      .bc-cpc-map-copy{padding:14px 16px 16px;display:flex;align-items:center;gap:14px}
      .bc-cpc-map-copy>div{min-width:0;flex:1}.bc-cpc-map-copy small{display:block;color:var(--muted);font-size:10px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;margin-bottom:4px}
      .bc-cpc-map-copy b{display:block;color:var(--text);font-size:15px}.bc-cpc-map-copy p{margin:4px 0 0;color:var(--muted);font-size:11.5px;line-height:1.45}
      .bc-cpc-map-open{flex:0 0 auto;border:1px solid rgba(56,189,248,.45);background:#103453;color:#dff5ff;border-radius:10px;padding:9px 12px;font-size:11px;font-weight:850}
      .bc-cpc-map-overlay{position:fixed;inset:0;z-index:2147483600;background:#07111f;display:flex;flex-direction:column}
      .bc-cpc-map-overlay-head{height:58px;flex:0 0 58px;display:flex;align-items:center;gap:12px;padding:8px 12px;border-bottom:1px solid #26364f;background:#0a1423;color:#f1f5fb}
      .bc-cpc-map-overlay-head b{font-size:13px}.bc-cpc-map-overlay-head span{font-size:10.5px;color:#92a6c2;display:block;margin-top:2px}
      .bc-cpc-map-close{margin-left:auto;border:1px solid #334760;background:#111d2f;color:#fff;border-radius:10px;padding:9px 12px;font-weight:850}
      .bc-cpc-map-frame{width:100%;flex:1;min-height:0;border:0;background:#f5f7fb}
      @media(max-width:680px){.bc-cpc-map-preview{height:390px}.bc-cpc-map-copy{align-items:flex-start;flex-direction:column}.bc-cpc-map-open{width:100%}.bc-cpc-map-overlay-head{height:54px;flex-basis:54px}}
    `;
    document.head.appendChild(style);
  };
  window.baseCompletaCloseCpcMap=()=>{
    const overlay=document.getElementById('bcCpcMapOverlay');if(overlay)overlay.remove();
    document.documentElement.style.overflow='';document.body.style.overflow='';
    setTimeout(()=>document.querySelector('#subjects .subject[data-id="cpc"] .cf-module[data-cf="cpc1"]')?.scrollIntoView({behavior:'smooth',block:'start'}),40);
    return false;
  };
  window.baseCompletaOpenCpcMap=()=>{
    ensureCpcMapStyles();
    if(document.getElementById('bcCpcMapOverlay'))return false;
    const overlay=document.createElement('div');overlay.id='bcCpcMapOverlay';overlay.className='bc-cpc-map-overlay';
    overlay.innerHTML='<div class="bc-cpc-map-overlay-head"><div><b>CPC M01 — Mapa Mental</b><span>Carrossel de fixação e revisão rápida</span></div><button type="button" class="bc-cpc-map-close" onclick="return baseCompletaCloseCpcMap()">← Voltar ao M01</button></div><iframe class="bc-cpc-map-frame" src="tools/cpc-m01-mapa.html" title="Mapa mental CPC M01"></iframe>';
    document.body.appendChild(overlay);document.documentElement.style.overflow='hidden';document.body.style.overflow='hidden';
    return false;
  };
  const renderCpcMapCard=()=>{
    if(window.CentralDisciplineLoader&&!CentralDisciplineLoader.isReady('cpc'))return;
    ensureCpcMapStyles();
    const section=document.querySelector('.subject[data-id="cpc"]');if(!section)return;
    const body=section.querySelector('.subject-body');if(!body||body.querySelector(':scope > .bc-cpc-map-card'))return;
    const card=document.createElement('section');card.className='bc-cpc-map-card';card.setAttribute('role','button');card.tabIndex=0;
    card.innerHTML='<div class="bc-cpc-map-preview"><iframe src="tools/cpc-m01-mapa.html?preview=1" tabindex="-1" aria-hidden="true"></iframe></div><div class="bc-cpc-map-copy"><div><small>MAPA MENTAL · M01</small><b>Normas fundamentais, fontes, aplicação e direito intertemporal</b><p>Abra o carrossel e revise cada bloco individualmente. No final, veja o mapa completo.</p></div><button type="button" class="bc-cpc-map-open">Abrir carrossel →</button></div>';
    card.addEventListener('click',()=>window.baseCompletaOpenCpcMap());
    card.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();window.baseCompletaOpenCpcMap()}});
    const kit=body.querySelector(':scope > .bc-discipline-kit');if(kit)kit.insertAdjacentElement('afterend',card);else body.insertAdjacentElement('afterbegin',card);
  };

  let queued=false;
  const refresh=()=>{
    queued=false;applyBrand();applyLabels(document);standardizeFrames();renderDisciplineKits();renderCpcMapCard();
  };
  const schedule=()=>{if(!queued){queued=true;requestAnimationFrame(refresh)}};
  const init=()=>{
    refresh();
    const observer=new MutationObserver(schedule);
    observer.observe(document.body,{childList:true,subtree:true});
  };
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();