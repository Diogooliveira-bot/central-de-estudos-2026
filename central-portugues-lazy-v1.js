(function(){
'use strict';
if(window.__CENTRAL_PT_LAZY_V2__)return;
window.__CENTRAL_PT_LAZY_V2__=true;

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

var MODULES=[
 ['m1','Ortografia e Acentuação',null],
 ['m2','Classes Nominais',null],
 ['m3','Conectivos','portugues-m3-preview-v1.html'],
 ['m4','Pronomes','portugues-m4-preview-v1.html'],
 ['m5','Colocação Pronominal','portugues-m5-preview-v1.html'],
 ['m6','Verbos','portugues-m6-v1.html'],
 ['m7','Correlação Verbal e Vozes Verbais','portugues-m7-v1.html'],
 ['m8','Sintaxe da Oração','portugues-m8-v1.html'],
 ['m9','Sintaxe do Período','portugues-m9-v1.html'],
 ['m10','Pontuação','portugues-m10-v1.html'],
 ['m11','Concordância','portugues-m11-v1.html'],
 ['m12','Regência Verbal e Nominal','portugues-m12-v1.html'],
 ['m13','Crase','portugues-m13-v1.html'],
 ['m14','Coesão e Coerência','portugues-m14-v1.html'],
 ['m15','Semântica Geral','portugues-m15-v1.html'],
 ['m16','Interpretação de Textos','portugues-m16-v1.html'],
 ['m17','Tipologia Textual','portugues-m17-v1.html']
];

var TAB_KEY='central-v6:pt:active-module';
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
function esc(v){return String(v==null?'':v).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}
function style(){
 if(document.getElementById('pt-canonical-v2-style'))return;
 var e=document.createElement('style');e.id='pt-canonical-v2-style';
 e.textContent='.ptcanon-tabs{display:grid;grid-template-columns:1fr;gap:7px;margin:0 0 14px}.ptcanon-tab{width:100%;text-align:left;border:1px solid var(--line2);background:var(--panel);color:var(--muted);border-radius:10px;padding:11px 14px;font-size:13px;font-weight:800}.ptcanon-tab.active{background:var(--blue);border-color:var(--blue);color:#fff}.ptcanon-shell{margin-top:12px}.ptcanon-frame{display:block;width:100%;min-height:2200px;border:0;background:transparent}@media(max-width:720px){.ptcanon-frame{min-height:3200px}.ptcanon-tab{font-size:12px;padding:10px 12px}}';
 document.head.appendChild(e);
}
function fit(frame){
 try{
  var doc=frame.contentDocument||frame.contentWindow.document;if(!doc)return;
  function run(){try{frame.style.height=Math.max(1800,doc.documentElement.scrollHeight,doc.body?doc.body.scrollHeight:0)+'px'}catch(_){}}
  run();setTimeout(run,80);setTimeout(run,350);setTimeout(run,900);
  if(frame.contentWindow&&frame.contentWindow.MutationObserver){var obs=new frame.contentWindow.MutationObserver(run);obs.observe(doc.body,{subtree:true,childList:true,attributes:true})}
 }catch(e){console.warn('[PT canonical resize]',e)}
}
function tabs(active){
 return '<div class="ptcanon-tabs">'+MODULES.map(function(m){
   return '<button class="ptcanon-tab '+(m[0]===active?'active':'')+'" onclick="PtCanonical.switchTab(\''+m[0]+'\')">'+m[0].toUpperCase()+' · '+esc(m[1])+'</button>';
 }).join('')+'</div>';
}
function installCanonical(){
 style();
 window.PtCanonical={
  switchTab:function(id){
   localStorage.setItem(TAB_KEY,id);
   try{if(typeof window.renderAll==='function')window.renderAll();else if(typeof window.renderSubjects==='function')window.renderSubjects()}catch(e){console.warn('[PT canonical]',e)}
  },
  resize:fit
 };
 window.renderPortugueseMaster=function(){
   var active=localStorage.getItem(TAB_KEY)||'m1';
   var m=MODULES.find(function(x){return x[0]===active})||MODULES[0];
   var body='';
   if(active==='m1'&&window.PtM1V3&&typeof window.PtM1V3.render==='function')body=window.PtM1V3.render();
   else if(active==='m2'&&window.PtM2V1&&typeof window.PtM2V1.render==='function')body=window.PtM2V1.render();
   else body='<div class="ptcanon-shell"><iframe class="ptcanon-frame" src="/'+m[2]+'" title="Português '+m[0].toUpperCase()+' — '+esc(m[1])+'" onload="PtCanonical.resize(this)"></iframe></div>';
   return tabs(active)+body;
 };
 try{if(typeof window.renderAll==='function')window.renderAll();else if(typeof window.renderSubjects==='function')window.renderSubjects()}catch(e){console.warn('[PT canonical install]',e)}
}
async function ensurePt(){
 if(loaded)return true;
 if(loading)return loading;
 loading=(async function(){
  for(var i=0;i<PT_SCRIPTS.length;i++)await addScript(PT_SCRIPTS[i]);
  installCanonical();
  loaded=true;return true;
 })().catch(function(err){loading=null;console.error('[PT lazy]',err);throw err});
 return loading;
}
function patchSubjectOpen(){
 if(window.__PT_LAZY_PATCHED_V2__)return true;
 var old=window.centralHardSubject;
 if(typeof old!=='function')return false;
 window.__PT_LAZY_PATCHED_V2__=true;
 window.centralHardSubject=function(id){
  var args=arguments,ctx=this;
  if(id!=='pt')return old.apply(ctx,args);
  ensurePt().then(function(){old.apply(ctx,args)}).catch(function(err){alert('Não foi possível carregar Português. Tente novamente.');console.error(err)});
  return false;
 };
 return true;
}
var tries=0,t=setInterval(function(){tries++;if(patchSubjectOpen()||tries>100)clearInterval(t)},50);
window.ensurePortugueseLoaded=ensurePt;
})();