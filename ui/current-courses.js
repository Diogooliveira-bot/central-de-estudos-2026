/* Canonical courses used by the Central and its study links. */
(function(global){
'use strict';
function esc(value){return String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function modules(){return global.CentralPortugueseCourse?.modules||[]}
const ptInfographicModules={1:'/assets/portugues-infograficos/m01.webp',2:'/assets/portugues-infograficos/m02.webp',3:'/assets/portugues-infograficos/m03.webp',4:'/assets/portugues-infograficos/m04.webp',5:'/assets/portugues-infograficos/m05.webp',6:'/assets/portugues-infograficos/m06.webp',7:'/assets/portugues-infograficos/m07.webp',8:'/assets/portugues-infograficos/m08.webp',9:'/assets/portugues-infograficos/m09.webp',10:'/assets/portugues-infograficos/m10.webp',11:'/assets/portugues-infograficos/m11.webp',12:'/assets/portugues-infograficos/m12.webp',13:'/assets/portugues-infograficos/m13.webp',14:'/assets/portugues-infograficos/m14.webp',15:'/assets/portugues-infograficos/m15.webp',16:'/assets/portugues-infograficos/m16.webp',17:'/assets/portugues-infograficos/m17.webp',18:'/assets/portugues-infograficos/m18.webp',19:'/assets/portugues-infograficos/m19.webp',20:'/assets/portugues-infograficos/m20.webp',21:'/assets/portugues-infograficos/m21.webp',22:'/assets/portugues-infograficos/m22.webp',23:'/assets/portugues-infograficos/m23.webp',24:'/assets/portugues-infograficos/m24.webp'};
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
function openPtInfographic(num){
 const image=ptInfographicModules[Number(num)];if(!image)return false;
 const module=modules().find(m=>Number(m.num)===Number(num));
 const title=module?.title||('Módulo '+num);
 const label='Português M'+String(num).padStart(2,'0')+' — '+title;
 const filename='Portugues-M'+String(num).padStart(2,'0')+'-Infografico.webp';
 const overlay=document.createElement('div');overlay.id='pt-infographic-overlay';overlay.className='cf-native-overlay';
 overlay.innerHTML='<section class="cf-native-shell" role="dialog" aria-modal="true" aria-label="'+esc(label)+'"><header><div><b>'+esc(label)+'</b><small>Infográfico do módulo • imagem para visualizar e baixar</small></div><button type="button" data-close aria-label="Fechar infográfico">×</button></header><div class="cf-native-map"><img src="'+image+'?v=20261018ptinfographics1" alt="'+esc(label)+'" decoding="async"></div><footer style="display:flex;justify-content:center;padding:10px 14px 14px;border-top:1px solid var(--line)"><a class="cf-btn primary" href="'+image+'?v=20261018ptinfographics1" download="'+filename+'">⬇ Baixar infográfico</a></footer></section>';
 document.body.appendChild(overlay);document.body.style.overflow='hidden';
 const close=()=>{overlay.remove();document.body.style.overflow='';document.removeEventListener('keydown',onKey)};
 const onKey=e=>{if(e.key==='Escape')close()};
 overlay.querySelector('[data-close]').onclick=close;
 overlay.addEventListener('click',e=>{if(e.target===overlay)close()});
 document.addEventListener('keydown',onKey);
 return false;
}
/**
 * 24-module Portuguese visual shell, aligned with the approved CF layout.
 * The lessons, interactive question state, review and downloadable infographic
 * remain managed by their existing, authoritative components.
 */
function ptMaster(){
 const course=global.CentralPortugueseCourse;
 if(!course)return '';
 const all=course.modules.concat([course.review]);
 const card=(id,type,icon,title,description,labels,actionLabel,mode,quizLabel,quizMode)=>{
  const action=type==='map'
   ? 'return openPtInfographic('+Number(id.slice(1))+')'
   : 'return CentralPortugueseReader.open(\''+id+'\',\''+mode+'\')';
  const quiz=quizMode
   ? '<button type="button" class="pt-cf-button pt-cf-button-quiz" data-pt-cf-quiz="'+esc(quizMode)+'" onclick="return CentralPortugueseReader.open(\''+id+'\',\''+quizMode+'\')">'+esc(quizLabel)+'</button>'
   : '';
  return '<article class="pt-cf-card pt-cf-card-'+type+'">'+
    '<span class="pt-cf-icon" aria-hidden="true">'+icon+'</span>'+
    '<b>'+esc(title)+'</b><small>'+esc(description)+'</small>'+
    '<span class="pt-cf-tags" aria-hidden="true">'+labels.map(x=>'<span>'+esc(x)+'</span>').join('')+'</span>'+
    '<div class="pt-cf-actions"><button type="button" class="pt-cf-button pt-cf-button-open" data-pt-cf-open="'+type+'" onclick="'+action+'">'+esc(actionLabel)+'</button>'+quiz+'</div>'+
    '</article>';
 };
 return '<div class="cf-modules pt-cf-modules">'+all.map(m=>{
  const done=localStorage.getItem('central-v6:pt:auto24:done:'+m.id)==='1';
  const open=localStorage.getItem('central-v6:pt:auto24:open')===m.id;
  const pct=done?100:0,review=!!m.review,hasInfographic=!review&&Boolean(ptInfographicModules[Number(m.num)]);
  const orientation=review?[
   'Retome os principais conceitos estudados do M01 ao M24.',
   'Resolva a revisão cumulativa antes de consultar as respostas.',
   'Identifique os assuntos que ainda precisam de reforço.'
  ]:[
   'Estude o assunto "'+m.title+'" por meio da teoria completa.',
   'Destaque regras, conceitos e exemplos que costumam aparecer em provas.',
   'Resolva os exercícios e use a revisão ativa para verificar o que aprendeu.'
  ];
  const oriented='<section class="pt-cf-oriented" aria-label="Leitura orientada inicial">'+
   '<div class="pt-cf-oriented-top"><span class="pt-cf-oriented-symbol" aria-hidden="true">📖</span>'+
   '<div><b>'+(review?'Leitura orientada da revisão final':'Leitura orientada inicial')+'</b>'+
   '<small>'+(review?'Organize sua revisão cumulativa em etapas.':'Comece entendendo o tema antes de praticar.')+'</small></div></div>'+
   '<details><summary>Ver pontos para observar</summary><ul>'+orientation.map(line=>'<li>'+esc(line)+'</li>').join('')+'</ul></details></section>';
  const reading='<section class="pt-cf-reading" aria-label="Progresso de leitura do módulo">'+
   '<div class="pt-cf-reading-line"><div><b>Leitura</b><small>'+(done?'Módulo concluído.':'Marque a conclusão ao terminar o conteúdo.')+'</small></div>'+
   '<strong>'+pct+'%</strong></div><div class="pt-cf-progress-track" role="progressbar" aria-label="Conclusão de leitura" aria-valuemin="0" aria-valuemax="100" aria-valuenow="'+pct+'"><span style="width:'+pct+'%"></span></div></section>';
  const full=card(m.id,'primary','📚',review?'Revisão cumulativa completa':'Teoria completa',
   review?'Material integral de revisão dos 24 módulos, com índice e busca.':'Apostila integral do módulo, com índice, busca e ajuste de fonte.',
   review?['Revisão final','Conteúdo integral']:['Apostila','Conteúdo completo'],
   review?'Estudar revisão':'Estudar conteúdo','complete',
   review?'Resolver questões cumulativas':'Resolver 10 questões',review?'cumulative':'exam');
  const summary=card(m.id,'review','⚡',review?'Revisão ativa final':'Versão de revisão',
   review?'Recupere os conteúdos estudados com perguntas e respostas comentadas.':'Retome os pontos essenciais e faça recuperação ativa.',
   ['Resumo','Revisão ativa'],review?'Revisar conteúdos':'Revisar conteúdo','review',
   review?'Praticar revisão final':'Resolver 5 questões',review?'cumulative':'active');
  const infographic=hasInfographic?card(m.id,'map','🧠','Infográfico',
   'Imagem de revisão visual do módulo, com opção de download.',
   ['Imagem','Revisão visual'],'Visualizar infográfico','infographic','',''):'';
  const content='<div class="pt-cf-module-inside">'+reading+oriented+
   '<section class="pt-cf-cards" aria-label="Materiais e exercícios do módulo">'+full+summary+infographic+'</section></div>';
  return '<section class="cf-module pt-cf-module '+(open?'open':'')+'" data-pt-current="'+esc(m.id)+'">'+
   '<button type="button" class="cf-module-head" onclick="return togglePtCurrentModule(\''+m.id+'\')" aria-expanded="'+(open?'true':'false')+'">'+
    '<span class="cf-module-no">'+(review?'REVISÃO FINAL':'MÓDULO '+m.num)+'</span>'+
    '<span class="cf-module-title">'+esc(m.title)+'</span>'+
    '<span class="cf-module-stat">'+pct+'%</span><span class="chev">⌄</span></button>'+
   '<div class="cf-module-body">'+content+'</div></section>';
 }).join('')+'</div>';
}
if(!global.__centralCurrentPortuguese){
 global.__centralCurrentPortuguese=true;
 global.ptNativeStats=ptStats;
 const originalGoalDone=global.goalDone;
 global.goalDone=function(uid){if(/^pt-auto24-/.test(uid))return localStorage.getItem('central-v6:pt:auto24:done:'+uid.replace('pt-auto24-',''))==='1';return originalGoalDone(uid)};
 global.renderPortugueseMaster=ptMaster;
 global.openPtInfographic=openPtInfographic;
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
 return '<section class="cf-module '+(open?'open':'')+'" data-cf="'+w.id+'"><button class="cf-module-head" type="button" onclick="togglePenalModule(\''+w.id+'\')"><span class="cf-module-no">MÓDULO '+w.num+'</span><span class="cf-module-title">'+esc(w.title)+'</span><span class="cf-module-stat">'+pct+'%</span><span class="chev">⌄</span></button><div class="cf-module-body"><div class="cf-subtitle">'+esc(w.subtitle)+'</div><section class="bc-native-materials bc-native-materials-static" data-bc-native-'+key+'><section class="bc-native-metrics" aria-label="Indicadores do módulo"><article class="bc-native-metric-card"><div class="bc-native-ring" data-native-ring="theory"><div class="bc-native-ring-inner"><b data-ring-value>'+pct+'%</b><span>teoria</span></div></div><div class="bc-native-metric-copy"><small>COBERTURA DA TEORIA</small><strong data-native-metric-detail="theory">Progresso de leitura</strong><span>Checks dos capítulos + questões internas.</span></div></article><article class="bc-native-metric-card"><div class="bc-native-ring" data-native-ring="external"><div class="bc-native-ring-inner"><b data-ring-value>—</b><span>externas</span></div></div><div class="bc-native-metric-copy"><small>ACERTO EM QUESTÕES EXTERNAS</small><strong data-native-metric-detail="external">Nenhuma questão externa respondida</strong><span data-native-metric-meta="external">Registre questões externas no final do módulo.</span></div></article></section><div class="bc-native-materials-head"><div><b>Materiais do módulo</b><small>Escolha como estudar</small></div><small>'+key.toUpperCase()+' • conteúdo nativo</small></div><div class="bc-native-material-grid">'+button('summary','Conteúdo resumido','Primeira leitura, revisão rápida e revisão ativa.','⚡')+button('complete','Conteúdo completo','Teoria integral, índice, busca e progresso de leitura.','📚')+button('mindmap','Mapa mental','Mapa interativo com zoom e tela cheia.','🧠')+'</div></section><div class="cf-resource-box"><h4>Lei em Dia</h4><button class="cf-btn primary" onclick="openEmbeddedTool(\'decorando\',{discipline:\'penal\',module:\'pen-m'+String(w.num).padStart(2,'0')+'\'},this)">Abrir questões deste módulo</button></div></div></section>';
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
if(global.CPP_NATIVE_INDEX&&typeof SUBJECTS!=='undefined'){
 const subject=SUBJECTS.find(s=>s.id==='cpp');
 if(subject){
  subject.special='22 módulos • curso nativo completo';
  subject.topics=global.CPP_NATIVE_INDEX.modules.map(m=>({
   uid:m.uid,
   title:String(m.number).padStart(2,'0')+' '+m.title.toUpperCase(),
   origin:'Módulo '+String(m.number).padStart(2,'0')+' do curso nativo',
   type:'Curso',
   studyUrl:null,
   ankiDeck:null,
   sourceInfo:'Conteúdo resumido, teoria completa e questões de fixação do módulo.',
   sourceStats:{cards:0,views:0,correct:0,wrong:0,accuracy:null},
   tips:['Estude primeiro o conteúdo resumido e depois a teoria completa.','Finalize com 5 questões do resumido e 10 do completo.']
  }));
 }
}
if(typeof global.renderAll==='function')global.renderAll();
if(typeof global.renderDisciplineGrid==='function')global.renderDisciplineGrid();
})(window);

(function(){
 if(window.CentralDisciplineLoader||window.__cpcM07Autoload)return;window.__cpcM07Autoload=true;
 const files=[
  '/content/cpc/m07-native-data.js?v=20261018cpcjur1',
  '/ui/cpc-m07-native-study-reader.js?v=20261003cpcm07v1',
  '/cpc-study-m07-lite.js?v=20261003cpcm07v1'
 ];
 let i=0;function next(){if(i>=files.length)return;const s=document.createElement('script');s.src=files[i++];s.onload=next;document.head.appendChild(s)}next();
})();
