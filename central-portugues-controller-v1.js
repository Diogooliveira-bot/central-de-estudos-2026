(function(){
'use strict';
if(window.__CENTRAL_PT_CONTROLLER_V1__)return;
window.__CENTRAL_PT_CONTROLLER_V1__=true;

var TAB_KEY='central-v6:pt:active-module';
var modules=[
 {id:'m1',name:'Ortografia e Acentuacao',legacy:'m1'},
 {id:'m2',name:'Classes Nominais',legacy:'m2'},
 {id:'m3',name:'Conectivos',src:'portugues-m3-preview-v1.html'},
 {id:'m4',name:'Pronomes',src:'portugues-m4-preview-v1.html'},
 {id:'m5',name:'Colocacao Pronominal',src:'portugues-m5-preview-v1.html'},
 {id:'m6',name:'Verbos',src:'portugues-m6-v1.html'},
 {id:'m7',name:'Correlacao e Vozes',src:'portugues-m7-v1.html'},
 {id:'m8',name:'Sintaxe da Oracao',src:'portugues-m8-v1.html'},
 {id:'m9',name:'Sintaxe do Periodo',src:'portugues-m9-v1.html'},
 {id:'m10',name:'Pontuacao',src:'portugues-m10-v1.html'},
 {id:'m11',name:'Concordancia',src:'portugues-m11-v1.html'},
 {id:'m12',name:'Regencia Verbal e Nominal',src:'portugues-m12-v1.html'},
 {id:'m13',name:'Crase',src:'portugues-m13-v1.html'},
 {id:'m14',name:'Coesao e Coerencia',src:'portugues-m14-v1.html'},
 {id:'m15',name:'Semantica Geral',src:'portugues-m15-v1.html'},
 {id:'m16',name:'Interpretacao de Textos',src:'portugues-m16-v1.html'},
 {id:'m17',name:'Tipologia Textual',src:'portugues-m17-v1.html'}
];
var byId={};
modules.forEach(function(module){byId[module.id]=module});
var canonical=window.__PT_CANONICAL_RENDER__||window.renderPortugueseMaster;
var legacyM1=window.__PT_M1_ENHANCED_RENDER__||(window.PtM1V3&&window.PtM1V3.render);
var legacyM2=window.__PT_M2_ENHANCED_RENDER__;

function style(){
 if(document.getElementById('pt-controller-v1-style'))return;
 var el=document.createElement('style');
 el.id='pt-controller-v1-style';
 el.textContent='.ptc{margin-top:12px}.ptc-head{display:flex;justify-content:space-between;align-items:center;gap:12px;margin:0 0 14px}.ptc-title{font-size:18px;font-weight:800;color:var(--text,#172033)}.ptc-back{border:1px solid var(--line,#dde2ea);background:var(--panel,#fff);color:var(--text,#172033);border-radius:8px;padding:8px 11px;font:inherit;font-size:13px;font-weight:700;cursor:pointer}.ptc-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px}.ptc-module{display:flex;flex-direction:column;align-items:flex-start;gap:5px;min-height:84px;border:1px solid var(--line,#dde2ea);background:var(--panel,#fff);border-radius:8px;padding:13px;color:var(--text,#172033);text-align:left;font:inherit;cursor:pointer}.ptc-module:hover{border-color:#3568d4;background:#f7f9ff}.ptc-code{font-size:11px;font-weight:800;color:#3568d4}.ptc-name{font-size:14px;font-weight:750;line-height:1.3}.ptc-frame{width:100%;min-height:1400px;border:0;display:block;background:transparent}.ptc-loading{padding:18px 0;color:var(--muted,#677386);font-size:13px}@media(max-width:720px){.ptc-grid{grid-template-columns:repeat(2,minmax(0,1fr));gap:8px}.ptc-module{min-height:76px;padding:11px}.ptc-frame{min-height:1900px}.ptc-title{font-size:16px}}';
 document.head.appendChild(el);
}
function escapeHtml(value){return String(value).replace(/[&<>"']/g,function(char){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]})}
function active(){var id=localStorage.getItem(TAB_KEY)||'hub';return id==='hub'||byId[id]?id:'hub'}
function hub(){
 return '<div class="ptc"><div class="ptc-head"><div><div class="ptc-title">Lingua Portuguesa</div><div class="muted small">17 modulos organizados para estudo, revisao e questoes.</div></div></div><div class="ptc-grid">'+modules.map(function(module){return '<button type="button" class="ptc-module" onclick="PtControllerV1.open(\''+module.id+'\')"><span class="ptc-code">'+module.id.toUpperCase()+'</span><span class="ptc-name">'+escapeHtml(module.name)+'</span></button>'}).join('')+'</div></div>';
}
function frame(module){
 var id='ptc-'+module.id+'-frame';
 return '<div class="ptc"><div class="ptc-head"><button type="button" class="ptc-back" onclick="PtControllerV1.back()">Voltar aos modulos</button><div class="ptc-title">'+module.id.toUpperCase()+' - '+escapeHtml(module.name)+'</div></div><div class="ptc-loading" id="'+id+'-loading">Carregando modulo...</div><iframe id="'+id+'" class="ptc-frame" src="'+module.src+'" title="Portugues '+module.id.toUpperCase()+' - '+escapeHtml(module.name)+'" onload="PtControllerV1.loaded(this)"></iframe></div>';
}
function legacy(module){
 var render=module.id==='m1'?legacyM1:legacyM2;
 if(typeof render!=='function'){
   return '<div class="ptc"><div class="ptc-head"><button type="button" class="ptc-back" onclick="PtControllerV1.back()">Voltar aos modulos</button></div><div class="ptc-loading">Este modulo ainda esta sendo preparado. Tente abrir novamente em alguns segundos.</div></div>';
 }
 var html=render();
 return '<div class="ptc"><div class="ptc-head"><button type="button" class="ptc-back" onclick="PtControllerV1.back()">Voltar aos modulos</button><div class="ptc-title">'+module.id.toUpperCase()+' - '+escapeHtml(module.name)+'</div></div>'+html+'</div>';
}
function render(){
 style();
 var id=active();
 if(id==='hub')return hub();
 var module=byId[id];
 return module.legacy?legacy(module):frame(module);
}
function redraw(){
 try{
  if(typeof window.renderAll==='function')window.renderAll();
  else if(typeof window.renderSubjects==='function')window.renderSubjects();
 }catch(error){console.warn('[PT controller]',error)}
}
function resize(frame){
 try{
  var doc=frame.contentDocument||frame.contentWindow.document;
  if(!doc)return;
  function fit(){try{frame.style.height=Math.max(900,doc.documentElement.scrollHeight,doc.body?doc.body.scrollHeight:0)+'px'}catch(_){}}
  fit();setTimeout(fit,80);setTimeout(fit,350);setTimeout(fit,900);
  var loading=document.getElementById(frame.id+'-loading');
  if(loading)loading.remove();
  if(frame.contentWindow&&frame.contentWindow.MutationObserver&&doc.body){
   var observer=new frame.contentWindow.MutationObserver(fit);
   observer.observe(doc.body,{subtree:true,childList:true,attributes:true});
  }
 }catch(error){console.warn('[PT controller resize]',error)}
}
window.PtControllerV1={
 open:function(id){if(!byId[id])return;localStorage.setItem(TAB_KEY,id);redraw()},
 back:function(){localStorage.setItem(TAB_KEY,'hub');redraw()},
 loaded:resize,
 audit:function(){return {registered:modules.map(function(module){return module.id}),active:active(),legacyM1:typeof legacyM1==='function',legacyM2:typeof legacyM2==='function'}}
};
window.renderPortugueseMaster=render;
setTimeout(redraw,0);
})();