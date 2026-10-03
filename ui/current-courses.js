/* Canonical courses used by the Central and its study links. */
(function(global){
'use strict';
function esc(value){return String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function modules(){return global.CentralPortugueseCourse?.modules||[]}
function ptStats(){const total=modules().length,done=modules().filter(m=>localStorage.getItem('central-v6:pt:auto24:done:'+m.id)==='1').length;return {total,done,pct:total?Math.round(done/total*100):0,unit:'módulos'}}
function openPt(id){
 const course=global.CentralPortugueseCourse;
 if(!course)return false;
 const item=course.modules.concat([course.review]).find(m=>m.id===id);
 if(typeof global.jumpSubject==='function')global.jumpSubject('pt');
 if(!item)return false;
 localStorage.setItem('central-v6:pt:auto24:open',id);
 const url=new URL(location.href);url.searchParams.set('subject','pt');url.searchParams.set('module',id);history.replaceState(null,'',url);
 if(typeof global.renderSubjects==='function')global.renderSubjects();
 if(typeof global.saveLast==='function')global.saveLast({ptAutoModule:id,title:'Português • '+item.title,at:Date.now()});
 requestAnimationFrame(()=>document.querySelector('[data-pt-current="'+id+'"]')?.scrollIntoView({block:'start',behavior:'auto'}));
 return false;
}
function togglePt(id){
 const el=document.querySelector('[data-pt-current="'+id+'"]');
 if(el?.classList.contains('open')){el.classList.remove('open');localStorage.removeItem('central-v6:pt:auto24:open');const url=new URL(location.href);url.searchParams.delete('module');history.replaceState(null,'',url);return false}
 return openPt(id);
}
function ptMaster(){
 const course=global.CentralPortugueseCourse;if(!course)return '';
 return '<div class="cf-modules">'+course.modules.concat([course.review]).map(m=>{
 const done=localStorage.getItem('central-v6:pt:auto24:done:'+m.id)==='1';
 const open=localStorage.getItem('central-v6:pt:auto24:open')===m.id;
 const card=(mode,title,text,icon)=>'<button type="button" class="bc-native-material-card" data-pt-material="'+mode+'" onclick="CentralPortugueseReader.open(\''+m.id+'\',\''+mode+'\')"><span class="bc-native-material-icon">'+icon+'</span><span><strong>'+title+'</strong><small>'+text+'</small></span><span class="bc-native-material-action">Abrir →</span></button>';
 return '<section class="cf-module '+(open?'open':'')+'" data-pt-current="'+m.id+'"><button type="button" class="cf-module-head" onclick="return togglePtCurrentModule(\''+m.id+'\')"><span class="cf-module-no">'+(m.review?'REVISÃO FINAL':'MÓDULO '+m.num)+'</span><span class="cf-module-title">'+esc(m.title)+'</span><span class="cf-module-stat">'+(done?'100%':'0%')+'</span><span class="chev">⌄</span></button><div class="cf-module-body"><div class="cf-subtitle">'+(m.review?'Revisão cumulativa dos 24 módulos.':m.lessons?m.lessons+' aulas • Português Autodidata':'Português Autodidata')+'</div><section class="bc-native-materials"><section class="bc-native-metrics"><article class="bc-native-metric-card"><div class="bc-native-ring" style="--pct:'+(done?100:0)+'"><div class="bc-native-ring-inner"><b>'+ (done?'100%':'0%')+'</b><span>módulo</span></div></div><div class="bc-native-metric-copy"><small>CONCLUSÃO DO MÓDULO</small><strong>'+(done?'Concluído':'Em estudo')+'</strong><span>Marque a conclusão ao terminar o material.</span></div></article></section><div class="bc-native-materials-head"><div><b>Materiais do módulo</b><small>Escolha como estudar</small></div><small>'+ (m.review?'REVISÃO':m.id.toUpperCase())+' • conteúdo nativo</small></div><div class="bc-native-material-grid">'+card('complete','Conteúdo completo','Apostila integral com índice, busca e ajuste de fonte.','📚')+card('review','Revisão e exercícios','Acesse a consolidação e a prática do próprio módulo.','⚡')+card('mindmap','Mapa mental','Mapa dos tópicos do módulo com zoom e tela cheia.','🧠')+'</div></section></div></section>';
 }).join('');
}
if(!global.__centralCurrentPortuguese){
 global.__centralCurrentPortuguese=true;
 global.ptNativeStats=ptStats;
 const originalGoalDone=global.goalDone;
 global.goalDone=function(uid){if(/^pt-auto24-/.test(uid))return localStorage.getItem('central-v6:pt:auto24:done:'+uid.replace('pt-auto24-',''))==='1';return originalGoalDone(uid)};
 global.renderPortugueseMaster=ptMaster;
 global.openPtCurrentModule=openPt;
 global.togglePtCurrentModule=togglePt;
 // Old saved module numbers belong to a different syllabus. Retain their data,
 // and reopen the current course without assigning the old progress to new lessons.
 global.openPtNativeLast=()=>openPt();
 let subject=typeof SUBJECTS!=='undefined'?SUBJECTS.find(s=>s.id==='pt'):null;
 if(!subject&&typeof SUBJECTS!=='undefined'){subject={id:'pt',name:'Português',topics:[]};SUBJECTS.unshift(subject)}
 if(subject){subject.special='24 módulos • Português Autodidata';subject.topics=modules().map(m=>({uid:'pt-auto24-'+m.id,title:m.title,origin:'Módulo '+m.num,type:'Curso',tips:[]}))}
}
function penalMasterModule(w){
 const key='m'+String(w.num).padStart(2,'0');
 const apiName=w.num===1?'BaseNativeReader':'BaseNativeReaderM'+String(w.num).padStart(2,'0');
 const api=global[apiName],stats=api?.theoryStats?.();
 const pct=stats?.pct||0;
 const open=localStorage.getItem('central-v6:penal-open:'+w.id)==='1';
 const button=(kind,title,description,icon)=>'<button type="button" class="bc-native-material-card" data-native-kind="'+kind+'" onclick="'+(kind==='mindmap'?"BaseMindMap.open('penal','"+w.id+"')":apiName+".open('"+kind+"')")+'"><span class="bc-native-material-icon">'+icon+'</span><span><strong>'+title+'</strong><small>'+description+'</small></span><span class="bc-native-material-action">Abrir →</span></button>';
 return '<section class="cf-module '+(open?'open':'')+'" data-cf="'+w.id+'"><button class="cf-module-head" type="button" onclick="togglePenalModule(\''+w.id+'\')"><span class="cf-module-no">MÓDULO '+w.num+'</span><span class="cf-module-title">'+esc(w.title)+'</span><span class="cf-module-stat">'+pct+'%</span><span class="chev">⌄</span></button><div class="cf-module-body"><div class="cf-subtitle">'+esc(w.subtitle)+'</div><section class="bc-native-materials bc-native-materials-static" data-bc-native-'+key+'><section class="bc-native-metrics" aria-label="Indicadores do módulo"><article class="bc-native-metric-card"><div class="bc-native-ring" data-native-ring="theory"><div class="bc-native-ring-inner"><b data-ring-value>'+pct+'%</b><span>teoria</span></div></div><div class="bc-native-metric-copy"><small>COBERTURA DA TEORIA</small><strong data-native-metric-detail="theory">Progresso de leitura</strong><span>Checks dos capítulos + questões internas.</span></div></article><article class="bc-native-metric-card"><div class="bc-native-ring" data-native-ring="external"><div class="bc-native-ring-inner"><b data-ring-value>—</b><span>externas</span></div></div><div class="bc-native-metric-copy"><small>ACERTO EM QUESTÕES EXTERNAS</small><strong data-native-metric-detail="external">Nenhuma questão externa respondida</strong><span data-native-metric-meta="external">Registre questões externas no final do módulo.</span></div></article></section><div class="bc-native-materials-head"><div><b>Materiais do módulo</b><small>Escolha como estudar</small></div><small>'+key.toUpperCase()+' • conteúdo nativo</small></div><div class="bc-native-material-grid">'+button('summary','Conteúdo resumido','Primeira leitura, revisão rápida e revisão ativa.','⚡')+button('complete','Conteúdo completo','Teoria integral, índice, busca e progresso de leitura.','📚')+button('mindmap','Mapa mental','Mapa interativo com zoom e tela cheia.','🧠')+'</div></section></div></section>';
}
// Loaded again at the end of the boot, after all native readers are registered.
if(global.BaseNativeReader&&!global.__centralCurrentPenal){
 global.__centralCurrentPenal=true;
 global.renderPenalModule=penalMasterModule;
 PENAL_WEEKS.forEach(function(w){
  const data=global.BASE_NATIVE_CONTENT?.penal?.['m'+String(w.num).padStart(2,'0')];
  if(data?.chapters?.complete&&global.BaseMindMap)global.BaseMindMap.register('penal',w.id,{label:data.title,expanded:true,children:data.chapters.complete.map(c=>({label:c.title,children:[]}))});
 });
 const originalStats=global.subjStats;
 global.subjStats=function(subject){
  if(subject.id!=='penal')return originalStats(subject);
  const stats=PENAL_WEEKS.map(w=>global[w.num===1?'BaseNativeReader':'BaseNativeReaderM'+String(w.num).padStart(2,'0')]?.theoryStats?.()||{pct:0});
  const done=stats.filter(s=>s.pct===100).length;
  return {total:stats.length,done,pct:Math.round(stats.reduce((sum,s)=>sum+s.pct,0)/stats.length),unit:'módulos'};
 };
 global.subjStats.__bcCounts=true;
}
if(typeof global.renderAll==='function')global.renderAll();
if(typeof global.renderDisciplineGrid==='function')global.renderDisciplineGrid();
})(window);

(function(){
 if(window.__cpcM07Autoload)return;window.__cpcM07Autoload=true;
 const files=[
  '/content/cpc/m07-native-data.js?v=20261003cpcm07v1',
  '/ui/cpc-m07-native-study-reader.js?v=20261003cpcm07v1',
  '/cpc-study-m07-lite.js?v=20261003cpcm07v1'
 ];
 let i=0;function next(){if(i>=files.length)return;const s=document.createElement('script');s.src=files[i++];s.onload=next;document.head.appendChild(s)}next();
})();