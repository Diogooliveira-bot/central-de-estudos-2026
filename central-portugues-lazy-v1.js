(function(){
'use strict';
if(window.__CENTRAL_PT_LAZY_M1M2_V1__)return;
window.__CENTRAL_PT_LAZY_M1M2_V1__=true;

var PT_SCRIPTS=[
 'portugues-m1-v3.js?v=20260914a',
 'portugues-m1-theory-v1.js?v=20260914a',
 'portugues-m1-theory-v2.js?v=20260914a',
 'portugues-m1-theory-v3.js?v=20260914a',
 'portugues-m1-no-anki-v1.js?v=20260914a',
 'portugues-m1-apostila-v2.js?v=20260914c',
 'portugues-m1-clean-slate-v1.js?v=20260915a',
 'portugues-m2-v1.js?v=20260915a',
 'portugues-m2-tec-link-v1.js?v=20260915a',
 'portugues-m2-vertical-tabs-v1.js?v=20260915a'
];
var loaded=false,loading=null;
function addScript(src){
 return new Promise(function(resolve,reject){
  var s=document.createElement('script');s.src='/'+src;s.async=false;
  s.onload=function(){resolve(src)};s.onerror=function(){reject(new Error('Falha ao carregar '+src))};
  document.head.appendChild(s);
 });
}
async function ensurePt(){
 if(loaded)return true;
 if(loading)return loading;
 loading=Promise.all(PT_SCRIPTS.map(addScript)).then(function(){loaded=true;return true}).catch(function(err){loading=null;console.error('[PT M1-M2 lazy]',err);throw err});
 return loading;
}
window.ensurePortugueseLoaded=ensurePt;

})();