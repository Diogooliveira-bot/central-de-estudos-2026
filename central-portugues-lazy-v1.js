(function(){
'use strict';
if(window.__CENTRAL_PT_LOADER_V2__)return;
window.__CENTRAL_PT_LOADER_V2__=true;
var scripts={},modules={},queue=Promise.resolve(),boot;
function addScript(path){
 if(scripts[path])return scripts[path];
 scripts[path]=new Promise(function(resolve,reject){
  var s=document.createElement('script');
  s.src='/'+path+'?v=20260920-pt3';s.async=false;
  s.onload=function(){resolve()};
  s.onerror=function(){s.remove();delete scripts[path];reject(new Error('Falha ao carregar '+path))};
  document.head.appendChild(s);
 });
 return scripts[path];
}
function addScriptsInOrder(paths){
 var jobs=paths.map(addScript);
 return jobs.reduce(function(chain,job){return chain.then(function(){return job})},Promise.resolve());
}
window.ensurePortugueseLoaded=function(id){
 if(id!=='m1'&&id!=='m2')return boot||Promise.resolve();
 if(modules[id])return modules[id];
 // Serialize legacy decorators and restore host rendering even after errors.
 var task=queue.then(async function(){
  var master=window.renderPortugueseMaster,subjects=window.renderSubjects,all=window.renderAll;
  window.renderSubjects=function(){};window.renderAll=function(){};
  try{
   if(id==='m1'){
    await addScript('portugues-m1-v3.js');
    window.renderPortugueseMaster=window.PtM1V3.render;
    var files=['portugues-m1-theory-v1.js','portugues-m1-theory-v2.js','portugues-m1-theory-v3.js','portugues-m1-no-anki-v1.js','portugues-m1-apostila-v2.js'];
    await addScriptsInOrder(files);
    window.__PT_M1_ENHANCED_RENDER__=window.renderPortugueseMaster;
   }else{
    await addScript('portugues-m2-v1.js');
    window.renderPortugueseMaster=window.PtM2V1.render;
    await addScript('portugues-m2-tec-link-v1.js');
    window.__PT_M2_ENHANCED_RENDER__=window.renderPortugueseMaster;
   }
  }finally{
   window.renderPortugueseMaster=master;window.renderSubjects=subjects;window.renderAll=all;
  }
 });
 modules[id]=task.catch(function(error){delete modules[id];throw error});
 queue=modules[id].catch(function(){});
 return modules[id];
};
function start(){
 boot=addScript('central-portugues-controller-v1.js').then(function(){
  if(typeof window.renderSubjects==='function')window.renderSubjects();
 }).catch(function(error){
  boot=null;console.error('[Português]',error);
  document.querySelectorAll('[data-pt-bootstrap]').forEach(function(host){
   host.innerHTML='<p>Não foi possível abrir Português.</p><button type="button" onclick="ptRetryBootstrap()">Tentar novamente</button>';
  });
 });
 return boot;
}
window.ptRetryBootstrap=start;
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();