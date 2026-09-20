(function(){
'use strict';
if(window.__CENTRAL_PT_LAZY_M1M2_V2__)return;
window.__CENTRAL_PT_LAZY_M1M2_V2__=true;

var M1_SCRIPTS=[
 'portugues-m1-v3.js?v=20260920c',
 'portugues-m1-theory-v1.js?v=20260920c',
 'portugues-m1-theory-v2.js?v=20260920c',
 'portugues-m1-theory-v3.js?v=20260920c',
 'portugues-m1-no-anki-v1.js?v=20260920c',
 'portugues-m1-apostila-v2.js?v=20260920c'
];
var M2_SCRIPTS=[
 'portugues-m2-v1.js?v=20260920c',
 'portugues-m2-tec-link-v1.js?v=20260920c'
];
var loaded=false,loading=null;

function addScript(src){
 return new Promise(function(resolve,reject){
  var s=document.createElement('script');
  s.src='/'+src;s.async=false;
  s.onload=function(){resolve(src)};
  s.onerror=function(){reject(new Error('Falha ao carregar '+src))};
  document.head.appendChild(s);
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

   await loadSeq(M1_SCRIPTS);
   if(typeof window.renderPortugueseMaster==='function'&&window.renderPortugueseMaster!==canonical){
     window.__PT_M1_ENHANCED_RENDER__=window.renderPortugueseMaster;
   }else if(window.PtM1V3&&typeof window.PtM1V3.render==='function'){
     window.__PT_M1_ENHANCED_RENDER__=window.PtM1V3.render;
   }
   if(canonical)window.renderPortugueseMaster=canonical;

   await loadSeq(M2_SCRIPTS);
   if(canonical)window.renderPortugueseMaster=canonical;

   loaded=true;
   return true;
 })().catch(function(err){
   loading=null;
   if(window.__PT_CANONICAL_RENDER__)window.renderPortugueseMaster=window.__PT_CANONICAL_RENDER__;
   console.error('[PT M1-M2 lazy v2]',err);
   throw err;
 });
 return loading;
}
window.ensurePortugueseLoaded=ensurePt;

// Start warming M1/M2 only after the user opens the Portuguese discipline.
// This does not block the Central boot.
document.addEventListener('click',function(ev){
 try{
   var head=ev.target&&ev.target.closest&&ev.target.closest('.subject[data-id="pt"] > .subject-head');
   if(head)setTimeout(function(){ensurePt().catch(function(){})},0);
 }catch(_){}
},true);

})();