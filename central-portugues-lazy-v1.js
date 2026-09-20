(function(){
'use strict';
if(window.__CENTRAL_PT_LAZY_CONTROLLER_V1__)return;
window.__CENTRAL_PT_LAZY_CONTROLLER_V1__=true;

var M1_SCRIPTS=[
 'portugues-m1-v3.js?v=20260920d',
 'portugues-m1-theory-v1.js?v=20260920d',
 'portugues-m1-theory-v2.js?v=20260920d',
 'portugues-m1-theory-v3.js?v=20260920d',
 'portugues-m1-no-anki-v1.js?v=20260920d',
 'portugues-m1-apostila-v2.js?v=20260920d'
];
var M2_SCRIPTS=[
 'portugues-m2-v1.js?v=20260920d',
 'portugues-m2-tec-link-v1.js?v=20260920d'
];
var CONTROLLER_SCRIPT='central-portugues-controller-v1.js?v=20260920d';
var loaded=false,loading=null;

function addScript(src){
 return new Promise(function(resolve,reject){
  var existing=document.querySelector('script[data-central-src="'+src+'"]');
  if(existing){resolve(src);return}
  var script=document.createElement('script');
  script.src='/'+src;
  script.async=false;
  script.dataset.centralSrc=src;
  script.onload=function(){resolve(src)};
  script.onerror=function(){reject(new Error('Falha ao carregar '+src))};
  document.head.appendChild(script);
 });
}
async function loadSeq(list){
 for(var i=0;i<list.length;i++)await addScript(list[i]);
}
async function ensurePt(){
 if(loaded)return true;
 if(loading)return loading;
 loading=(async function(){
   var canonical=window.__PT_CANONICAL_RENDER__||window.renderPortugueseMaster;
   var realRenderSubjects=window.renderSubjects,realRenderAll=window.renderAll;
   window.renderSubjects=function(){};
   window.renderAll=function(){};

   await loadSeq(M1_SCRIPTS);
   if(typeof window.renderPortugueseMaster==='function'&&window.renderPortugueseMaster!==canonical){
     window.__PT_M1_ENHANCED_RENDER__=window.renderPortugueseMaster;
   }else if(window.PtM1V3&&typeof window.PtM1V3.render==='function'){
     window.__PT_M1_ENHANCED_RENDER__=window.PtM1V3.render;
   }
   if(canonical)window.renderPortugueseMaster=canonical;

   await loadSeq(M2_SCRIPTS);
   if(typeof window.renderPortugueseMaster==='function'&&window.renderPortugueseMaster!==canonical){
     window.__PT_M2_ENHANCED_RENDER__=window.renderPortugueseMaster;
   }
   if(canonical)window.renderPortugueseMaster=canonical;

   await addScript(CONTROLLER_SCRIPT);
   window.renderSubjects=realRenderSubjects;
   window.renderAll=realRenderAll;
   loaded=true;
   return true;
 })().catch(function(error){
   loading=null;
   if(window.__PT_CANONICAL_RENDER__)window.renderPortugueseMaster=window.__PT_CANONICAL_RENDER__;
   console.error('[PT lazy controller]',error);
   throw error;
 });
 return loading;
}
window.ensurePortugueseLoaded=ensurePt;
document.addEventListener('click',function(event){
 try{
   var head=event.target&&event.target.closest&&event.target.closest('.subject[data-id="pt"] > .subject-head');
   if(head)setTimeout(function(){ensurePt().catch(function(){})},0);
 }catch(_){}
},true);
})();