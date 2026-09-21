(function(){
'use strict';
if(window.__CENTRAL_PT_LAZY_V2__)return;
window.__CENTRAL_PT_LAZY_V2__=true;

var M1_BASE='portugues-m1-v3.js?v=20260921pt1';
var M1_DECORATORS=[
 'portugues-m1-theory-v1.js?v=20260921pt1',
 'portugues-m1-theory-v2.js?v=20260921pt1',
 'portugues-m1-theory-v3.js?v=20260921pt1',
 'portugues-m1-no-anki-v1.js?v=20260921pt1',
 'portugues-m1-apostila-v2.js?v=20260921pt1'
];
var M2_BASE='portugues-m2-v1.js?v=20260921pt1';
var M2_DECORATOR='portugues-m2-tec-link-v1.js?v=20260921pt1';
var CONTROLLER_SCRIPT='central-portugues-controller-v1.js?v=20260921pt1';
var scripts={},modules={},boot=null;

function addScript(src){
 if(scripts[src])return scripts[src];
 scripts[src]=new Promise(function(resolve,reject){
  var script=document.createElement('script');
  script.src='/'+src;script.async=false;
  script.onload=function(){resolve(src)};
  script.onerror=function(){delete scripts[src];reject(new Error('Falha ao carregar '+src))};
  document.head.appendChild(script);
 });
 return scripts[src];
}
function loadInOrder(list){
 var jobs=list.map(addScript);
 return jobs.reduce(function(chain,job){return chain.then(function(){return job})},Promise.resolve());
}
function preloadScript(src){
 var href='/'+src;
 if(document.querySelector('link[data-pt-preload="'+src+'"]'))return;
 var link=document.createElement('link');link.rel='preload';link.as='script';link.href=href;link.dataset.ptPreload=src;
 document.head.appendChild(link);
}
function controllerRender(){return window.__PT_CONTROLLER_RENDER__||window.renderPortugueseMaster}
function ensureHub(){
 if(boot)return boot;
 boot=addScript(CONTROLLER_SCRIPT).then(function(){
  if(typeof window.renderSubjects==='function')window.renderSubjects();
  return true;
 }).catch(function(error){boot=null;console.error('[Português]',error);throw error});
 return boot;
}
async function loadModule(id){
 await ensureHub();
 var master=window.renderPortugueseMaster,subjects=window.renderSubjects,all=window.renderAll,controller=controllerRender();
 window.renderSubjects=function(){};window.renderAll=function(){};
 try{
  if(id==='m1'){
   M1_DECORATORS.forEach(preloadScript);
   await addScript(M1_BASE);
   window.renderPortugueseMaster=window.PtM1V3&&window.PtM1V3.render;
   await loadInOrder(M1_DECORATORS);
   window.__PT_M1_ENHANCED_RENDER__=window.renderPortugueseMaster||(window.PtM1V3&&window.PtM1V3.render);
  }else if(id==='m2'){
   preloadScript(M2_DECORATOR);
   await addScript(M2_BASE);
   window.renderPortugueseMaster=window.PtM2V1&&window.PtM2V1.render;
   await addScript(M2_DECORATOR);
   window.__PT_M2_ENHANCED_RENDER__=window.renderPortugueseMaster||(window.PtM2V1&&window.PtM2V1.render);
  }
 }finally{
  window.renderPortugueseMaster=controller||master;
  window.renderSubjects=subjects;window.renderAll=all;
 }
 return true;
}
window.ensurePortugueseLoaded=ensureHub;
window.ensurePortugueseModule=function(id){
 if(id!=='m1'&&id!=='m2')return Promise.resolve(true);
 if(modules[id])return modules[id];
 modules[id]=loadModule(id).catch(function(error){delete modules[id];throw error});
 return modules[id];
};
document.addEventListener('click',function(event){
 try{
  var head=event.target&&event.target.closest&&event.target.closest('.subject[data-id="pt"] > .subject-head');
  if(head)setTimeout(function(){ensureHub().catch(function(){})},0);
 }catch(_){}
},true);
})();