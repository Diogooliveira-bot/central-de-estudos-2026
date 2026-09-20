(function(){
'use strict';
if(window.__CENTRAL_PT_LAZY_V1__)return;
window.__CENTRAL_PT_LAZY_V1__=true;

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
 'portugues-m2-vertical-tabs-v1.js?v=20260915a',
 'portugues-m3-v1.js?v=20260915a',
 'portugues-m4-v1.js?v=20260917a',
 'portugues-m5-v1.js?v=20260917a',
 'portugues-m6-v1.js?v=20260920a'
];
var loaded=false,loading=null;

function addScript(src){
 return new Promise(function(resolve,reject){
  var s=document.createElement('script');
  s.src='/'+src;
  s.async=false;
  s.onload=function(){resolve(src)};
  s.onerror=function(){reject(new Error('Falha ao carregar '+src))};
  document.head.appendChild(s);
 });
}
async function ensurePt(){
 if(loaded)return true;
 if(loading)return loading;
 loading=(async function(){
  for(var i=0;i<PT_SCRIPTS.length;i++)await addScript(PT_SCRIPTS[i]);
  loaded=true;
  return true;
 })().catch(function(err){
  loading=null;
  console.error('[PT lazy]',err);
  throw err;
 });
 return loading;
}
function patchSubjectOpen(){
 if(window.__PT_LAZY_PATCHED__)return true;
 var old=window.centralHardSubject;
 if(typeof old!=='function')return false;
 window.__PT_LAZY_PATCHED__=true;
 window.centralHardSubject=function(id){
  var args=arguments,ctx=this;
  if(id!=='pt')return old.apply(ctx,args);
  var card=document.querySelector('.disc-card[data-id="pt"] .disc-meta');
  if(card)card.textContent='Carregando Português…';
  ensurePt().then(function(){
    if(card)card.textContent='Abrir disciplina';
    old.apply(ctx,args);
  }).catch(function(){
    if(card)card.textContent='Falha ao carregar · toque novamente';
  });
  return false;
 };
 return true;
}
var tries=0,t=setInterval(function(){
 tries++;
 if(patchSubjectOpen()||tries>100)clearInterval(t);
},50);
window.ensurePortugueseLoaded=ensurePt;
})();