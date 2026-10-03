/* Canonical courses used by the Central and its study links. */
(function(global){
'use strict';
function esc(value){return String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function modules(){return global.CentralPortugueseCourse?.modules||[]}
function ptStats(){const total=modules().length,done=modules().filter(m=>localStorage.getItem('central-v6:pt:auto24:done:'+m.id)==='1').length;return {total,done,pct:total?Math.round(done/total*100):0,unit:'módulos'}}
function openPt(id){
 const m=modules().find(m=>m.id===id);
 const url=new URL('/portugues.html',location.origin);
 if(m||id==='review')url.searchParams.set('module',id);
 location.assign(url.href);return false;
}
function ptMaster(){
 const course=global.CentralPortugueseCourse;if(!course)return '';
 return '<div class="ptn-master"><h3>Português Autodidata</h3><p>24 módulos e revisão cumulativa final.</p><div class="cf-modules">'+course.modules.concat([course.review]).map(m=>
 '<section class="cf-module" data-pt-current="'+m.id+'"><button type="button" class="cf-module-head" onclick="return openPtCurrentModule(\''+m.id+'\')"><span class="cf-module-no">'+(m.review?'REVISÃO':'MÓDULO '+m.num)+'</span><span class="cf-module-title">'+esc(m.title)+'</span><span class="cf-module-stat">'+(localStorage.getItem('central-v6:pt:auto24:done:'+m.id)==='1'?'Concluído':'Abrir conteúdo')+'</span><span class="chev">→</span></button></section>').join('')+'</div></div>';
}
if(!global.__centralCurrentPortuguese){
 global.__centralCurrentPortuguese=true;
 global.ptNativeStats=ptStats;
 const originalGoalDone=global.goalDone;
 global.goalDone=function(uid){if(/^pt-auto24-/.test(uid))return localStorage.getItem('central-v6:pt:auto24:done:'+uid.replace('pt-auto24-',''))==='1';return originalGoalDone(uid)};
 global.renderPortugueseMaster=ptMaster;
 global.openPtCurrentModule=openPt;
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
