/* Fresh course files on demand; the home reads progress without downloading theory. */
(function(global){
'use strict';
const groups=global.__centralDisciplineFiles||{},states={},executed=new Set();
const pending=new Set(['cf','penal','cpc','cpp','civil','adm']);
const names={cf:'Direito Constitucional',penal:'Direito Penal',cpc:'Direito Processual Civil',cpp:'Direito Processual Penal',civil:'Direito Civil',adm:'Direito Administrativo'};
const data=global.CentralHomeProgressData||{};
const json=key=>{try{return JSON.parse(localStorage.getItem(key)||'{}')||{}}catch(_){return {}}};
const escape=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const isReady=id=>!pending.has(id)||states[id]?.ready===true;
const isLoading=id=>!!states[id]?.promise;
const count=(ids,key)=>ids.filter(id=>localStorage.getItem(key+id)==='1').length;
const readingPercent=key=>Math.max(0,Math.min(100,Math.round(Number(localStorage.getItem(key))||0)));
function stats(subject){
 if(isReady(subject.id))return null;
 let percentages=[];
 if(subject.id==='cf'){
  const native=json('central-v6:cf-native-v2').modules||{};
  for(let n=1;n<=15;n++){
   const m=native[n]||{},reading=typeof global.cfWeekState==='function'?global.cfWeekState('w'+n).reading:false;
   percentages.push(Math.round([reading,m.map,m.summaryRead,m.summaryQuiz,m.completeRead,m.completeQuiz,m.decorando].filter(Boolean).length/7*100));
  }
 }else if(subject.id==='cpc'){
  const saved=json('central-v6:cpc-study-v1'),legacy=json('cpc_tjce_fcc_guided_v34');
  for(let n=1;n<=20;n++){
   const m=saved.modules?.['w'+n]||{},info=data.cpc?.['m'+String(n).padStart(2,'0')];
   if(!info){percentages.push(0);continue;}
   const prefix=n===8?'central-v6:cpc-m08:':'central-v6:native-reader:cpc:cpc'+n+':chapter:';
   let done=(m.map?1:0)+(m.decorando?1:0),total=2;
   for(const mode of ['summary','complete']){const ids=info.chapters[mode];total+=ids.length;done+=count(ids,prefix+mode+':');}
   if(n<=6){
    for(const track of ['summary','full']){const ids=info.quiz[track];total+=ids.length;done+=ids.filter(id=>!!saved.quizAnswers?.['w'+n+':'+track+':'+id]).length;}
   }else{
    total+=15;
    if(n>=18){const quiz=json('central-v6:cpc-m'+n+'-fixacao-v1');done+=(quiz.summary?.done?5:0)+(quiz.complete?.done?10:0);}
    else{const quiz=legacy.weeks?.['cpc'+n]||{};done+=(quiz.intermediate?5:0)+(quiz.fixation?10:0);}
   }
   percentages.push(total?Math.round(done/total*100):0);
  }
 }else if(subject.id==='penal'){
  for(let n=1;n<=17;n++){
   const info=data.penal?.['m'+String(n).padStart(2,'0')],prefix='central-v6:native-reader:penal:p'+n+':';
   let done=0,total=0;
   for(const mode of ['summary','complete']){
    const chapters=info?.chapters?.[mode]||[],questions=info?.questions?.[mode]||[];
    total+=chapters.length+questions.length;done+=count(chapters,prefix+'chapter:'+mode+':')+questions.filter(id=>{try{return !!JSON.parse(localStorage.getItem(prefix+'internal:'+mode+':'+id)||'null')}catch(_){return false}}).length;
   }
   percentages.push(total?Math.round(done/total*100):0);
  }
 }else if(subject.id==='adm'){
  for(const uid of data.admModuleIds||[]){
   const prefix='central-v6:adm-native:'+uid+':';
   percentages.push(Math.round((readingPercent(prefix+'summary:read')+readingPercent(prefix+'complete:read'))/2));
  }
 }else if(subject.id==='civil'){
  const legacy=json('central-v6:civil-study-progress-v1').modules||{};
  const ids=['civ-pessoa-natural','civ-pessoa-juridica','civ-bens','civ-negocio','civ-prescricao-prova','civ-obrigacoes','civ-contratos-geral','civ-contratos-especie','civ-responsabilidade','civ-empresa','civ-posse','civ-propriedade','civ-direitos-reais','civ-familia','civ-sucessoes'];
  for(let n=1;n<=15;n++){
   const nn=String(n).padStart(2,'0'),sk='central-v6:civil-native:m'+nn+':summary:read',ck='central-v6:civil-native:m'+nn+':complete:read';
   const hasS=localStorage.getItem(sk)!==null,hasC=localStorage.getItem(ck)!==null,old=legacy[ids[n-1]]||{},reading=old.reading||{};
   const legacyPct=Math.round(['coverage','theory','jurisprudence','examples','traps'].filter(key=>!!reading[key]).length/5*100);
   const summary=hasS?readingPercent(sk):legacyPct,complete=hasC?readingPercent(ck):legacyPct;
   percentages.push(Math.round((summary+complete)/2));
  }
 }else if(subject.id==='cpp'){
  const legacy=json('central-v6:cpp:curso22:v1').modules||{};
  for(let n=1;n<=22;n++){
   const nn=String(n).padStart(2,'0'),sk='central-v6:cpp-native:m'+nn+':summary:read',ck='central-v6:cpp-native:m'+nn+':complete:read';
   const hasS=localStorage.getItem(sk)!==null,hasC=localStorage.getItem(ck)!==null,old=legacy[n]||{};
   const migrate=!hasS&&!hasC&&old.reading;
   const summary=migrate?100:readingPercent(sk);
   const complete=migrate?100:readingPercent(ck);
   percentages.push(Math.round((summary+complete)/2));
  }
 }else return null;
 const total=percentages.length,done=percentages.filter(p=>p===100).length;
 const pct=['penal','adm','cpp','civil'].includes(subject.id)?Math.round(percentages.reduce((a,p)=>a+p,0)/(total||1)):Math.round(done/(total||1)*100);
 return {total,done,pct,unit:'módulos'};
}
const style=document.createElement('style');style.id='central-discipline-loading-style';
style.textContent='.central-subject-pending .subject-body>:not(.central-discipline-loading){display:none!important}.central-subject-pending .subject-body{min-height:320px}.central-discipline-loading{display:grid;justify-items:center;gap:12px;text-align:center;padding:36px 20px;color:var(--text,#302b28)}.central-discipline-loading img{width:108px;height:108px;object-fit:contain}.central-discipline-loading h3,.central-discipline-loading p{margin:0}.central-discipline-loading h3{font:500 24px Georgia,serif}.central-discipline-loading p{font-size:14px;color:var(--muted,#766d67)}.central-discipline-loading .loading-track{width:150px;height:3px;overflow:hidden;background:rgba(109,91,136,.15);border-radius:3px}.central-discipline-loading .loading-track span{display:block;width:45%;height:100%;background:#6d5b88;animation:central-discipline-pulse 1.3s ease-in-out infinite}@keyframes central-discipline-pulse{from{transform:translateX(-100%)}to{transform:translateX(330%)}}@media(prefers-reduced-motion:reduce){.central-discipline-loading .loading-track span{animation:none;width:100%}}';
document.head.appendChild(style);
function placeholder(subject){
 const failed=states[subject.id]?.error;
 return '<section class="central-discipline-loading" role="status" aria-live="polite" aria-busy="'+(!failed)+'"><img src="/assets/base-completa-symbol.webp" alt="Logomarca Base Completa"><h3>'+escape(failed?'Não foi possível carregar':'Carregando '+subject.name)+'</h3><p>'+escape(failed?'Verifique sua conexão e tente novamente.':'Preparando seus módulos para estudar…')+'</p>'+(failed?'<button type="button" class="btn primary" onclick="CentralDisciplineLoader.open(\''+subject.id+'\')">Tentar novamente</button>':'<div class="loading-track" aria-hidden="true"><span></span></div>')+'</section>';
}
async function download(files){
 const sources=new Array(files.length);let index=0;
 await Promise.all(Array.from({length:Math.min(6,files.length)},async()=>{
  while(index<files.length){const i=index++,url=new URL(files[i],location.origin);const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),25000);
   try{const response=await fetch(url.href,{cache:'no-store',signal:controller.signal});if(!response.ok)throw new Error('HTTP '+response.status+': '+url.pathname);sources[i]=await response.text();}finally{clearTimeout(timer);}
  }
 }));
 return sources;
}
function nativeReady(id){
 if(id==='cf')return !!global.CfNativeStudy;
 if(id==='penal')return !!global.__centralCurrentPenal;
 if(id==='cpp')return !!global.CppNative;
 if(id==='adm')return !!global.AdmNative;
 if(id==='civil')return !!global.CivilNative;
 if(id!=='cpc')return true;
 if(!global.CpcStudyV1?.installed||!global.__M08Installed)return false;
 for(let n=2;n<=20;n++){if(n===8)continue;const module=global['CpcStudyM'+String(n).padStart(2,'0')];if(module!==true&&!module?.installed)return false;}
 return true;
}
function waitForNative(id){return new Promise((resolve,reject)=>{const start=Date.now();function check(){if(nativeReady(id))return resolve();if(Date.now()-start>15000)return reject(new Error('Registro da disciplina incompleto'));setTimeout(check,30)}check()})}
function resumeOffline(){if(!Object.values(states).some(state=>state.promise))navigator.serviceWorker?.controller?.postMessage({type:'RESUME_OFFLINE'})}
function refresh(){try{global.renderAll?.();global.renderDisciplineGrid?.()}catch(error){console.error('[Central discipline render]',error)}}
function filesFor(id){
 const files=(groups[id]||[]).concat(global.CentralTheoryFiles?.[id]||[]);
 const seen=new Set();return files.filter(src=>{const path=new URL(src,location.origin).pathname;if(seen.has(path)||executed.has(path))return false;seen.add(path);return true});
}
function load(id){
 if(isReady(id))return Promise.resolve();
 if(states[id]?.promise)return states[id].promise;
 const state=states[id]={ready:false,error:null};
 state.promise=(async()=>{
  navigator.serviceWorker?.controller?.postMessage({type:'PAUSE_OFFLINE'});
  document.dispatchEvent(new CustomEvent('central:discipline-loading',{detail:{id}}));
  const files=filesFor(id),sources=await download(files);
  await new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)));
  // Download the whole ordered group before executing it, so connection retries do not redeclare globals.
  for(let i=0;i<files.length;i++){
   const path=new URL(files[i],location.origin).pathname,script=document.createElement('script');
   script.dataset.centralDiscipline=id;script.textContent=sources[i]+'\n//# sourceURL='+path;document.head.appendChild(script);script.remove();executed.add(path);
  }
  await waitForNative(id);state.ready=true;state.promise=null;refresh();resumeOffline();
  document.dispatchEvent(new CustomEvent('central:discipline-ready',{detail:{id}}));
 })().catch(error=>{state.promise=null;state.error=error;refresh();resumeOffline();console.error('[Central discipline load]',id,error);throw error});
 return state.promise;
}
function open(id,after){
 global.openHome?.();localStorage.setItem('central-v6:open:'+id,'1');
 const result=load(id);refresh();
 const section=document.querySelector('.subject[data-id="'+id+'"]');
 section?.scrollIntoView({block:'start',behavior:'auto'});
 result.then(()=>{if(after)after();else global.jumpSubject?.(id)}).catch(()=>{});
 return false;
}
function prepareOffline(reg){
 const schedule=()=>setTimeout(()=>{
  if(!navigator.onLine)return;
  if(document.visibilityState!=='visible'||Object.values(states).some(state=>state.promise)){schedule();return;}
  const post=()=>reg.active?.postMessage({type:'PREPARE_OFFLINE'});
  if('requestIdleCallback' in global)requestIdleCallback(post,{timeout:10000});else post();
 },15000);
 if(document.documentElement.dataset.centralReady==='true')schedule();else document.addEventListener('central:ready',schedule,{once:true});
}
global.CentralDisciplineLoader={isReady,isLoading,hasError:id=>!!states[id]?.error,stats,placeholder,load,open,prepareOffline};
})(window);
