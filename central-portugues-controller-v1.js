(function(){
'use strict';
if(window.__CENTRAL_PT_CONTROLLER_V2__)return;
window.__CENTRAL_PT_CONTROLLER_V2__=true;

var TAB_KEY='central-v6:pt:active-module';
var FONT_KEY='central-v6:reading-font-size';
var modules=[
 {id:'m1',name:'Ortografia e Acentuação',legacy:'m1'},
 {id:'m2',name:'Classes Nominais',legacy:'m2'},
 {id:'m3',name:'Conectivos',src:'portugues-m3-preview-v1.html'},
 {id:'m4',name:'Pronomes',src:'portugues-m4-preview-v1.html'},
 {id:'m5',name:'Colocação Pronominal',src:'portugues-m5-preview-v1.html'},
 {id:'m6',name:'Verbos',src:'portugues-m6-v1.html'},
 {id:'m7',name:'Correlação e Vozes',src:'portugues-m7-v1.html'},
 {id:'m8',name:'Sintaxe da Oração',src:'portugues-m8-v1.html'},
 {id:'m9',name:'Sintaxe do Período',src:'portugues-m9-v1.html'},
 {id:'m10',name:'Pontuação',src:'portugues-m10-v1.html'},
 {id:'m11',name:'Concordância',src:'portugues-m11-v1.html'},
 {id:'m12',name:'Regência Verbal e Nominal',src:'portugues-m12-v1.html'},
 {id:'m13',name:'Crase',src:'portugues-m13-v1.html'},
 {id:'m14',name:'Coesão e Coerência',src:'portugues-m14-v1.html'},
 {id:'m15',name:'Semântica Geral',src:'portugues-m15-v1.html'},
 {id:'m16',name:'Interpretação de Textos',src:'portugues-m16-v1.html'},
 {id:'m17',name:'Tipologia Textual',src:'portugues-m17-v1.html'}
];
var byId={},loading={},fontValue=readFont();
modules.forEach(function(module){byId[module.id]=module});

function readFont(){
 try{return Math.max(85,Math.min(250,Number(localStorage.getItem(FONT_KEY)||100)))}catch(_){return 100}
}
function escapeHtml(value){return String(value).replace(/[&<>"']/g,function(char){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]})}
function active(){try{var id=localStorage.getItem(TAB_KEY)||'hub';return id==='hub'||byId[id]?id:'hub'}catch(_){return'hub'}}
function style(){
 if(document.getElementById('pt-controller-v2-style'))return;
 var el=document.createElement('style');el.id='pt-controller-v2-style';
 el.textContent='.ptc{--pt-scale:var(--central-pt-font-scale,1);margin-top:12px;min-width:0}.ptc-head{display:flex;justify-content:space-between;align-items:center;gap:12px;margin:0 0 14px;flex-wrap:wrap}.ptc-title{font-size:calc(18px * var(--pt-scale));font-weight:800;color:var(--text,#172033)}.ptc-back{border:1px solid var(--line,#dde2ea);background:var(--panel,#fff);color:var(--text,#172033);border-radius:8px;padding:8px 11px;font:inherit;font-size:calc(13px * var(--pt-scale));font-weight:700;cursor:pointer}.ptc-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px}.ptc-module{display:flex;flex-direction:column;align-items:flex-start;gap:5px;min-height:84px;border:1px solid var(--line,#dde2ea);background:var(--panel,#fff);border-radius:8px;padding:13px;color:var(--text,#172033);text-align:left;font:inherit;cursor:pointer}.ptc-module:hover{border-color:#3568d4;background:#f7f9ff}.ptc-code{font-size:calc(11px * var(--pt-scale));font-weight:800;color:#3568d4}.ptc-name{font-size:calc(14px * var(--pt-scale));font-weight:750;line-height:1.3}.ptc-frame{width:100%;min-height:500px;border:0;display:block;background:transparent}.ptc-loading{padding:18px 0;color:var(--muted,#677386);font-size:calc(13px * var(--pt-scale))}@media(max-width:720px){.ptc-grid{grid-template-columns:repeat(2,minmax(0,1fr));gap:8px}.ptc-module{min-height:76px;padding:11px}.ptc-title{font-size:calc(16px * var(--pt-scale))}}';
 document.head.appendChild(el);
}
function hub(){
 return '<div class="ptc"><div class="ptc-head"><div><div class="ptc-title">Língua Portuguesa</div><div class="muted small">17 módulos organizados para estudo, revisão e questões.</div></div></div><div class="ptc-grid">'+modules.map(function(module){return '<button type="button" class="ptc-module" onclick="PtControllerV1.open(\''+module.id+'\')"><span class="ptc-code">'+module.id.toUpperCase()+'</span><span class="ptc-name">'+escapeHtml(module.name)+'</span></button>'}).join('')+'</div></div>';
}
function frame(module){
 var id='ptc-'+module.id+'-frame';
 return '<div class="ptc"><div class="ptc-head"><button type="button" class="ptc-back" onclick="PtControllerV1.back()">Voltar aos módulos</button><div class="ptc-title">'+module.id.toUpperCase()+' — '+escapeHtml(module.name)+'</div></div><div class="ptc-loading" id="'+id+'-loading">Carregando módulo...</div><iframe id="'+id+'" class="ptc-frame" src="'+module.src+'" title="Português '+module.id.toUpperCase()+' — '+escapeHtml(module.name)+'" onload="PtControllerV1.loaded(this)"></iframe></div>';
}
function enhanced(module){
 return module.id==='m1'?window.__PT_M1_ENHANCED_RENDER__:window.__PT_M2_ENHANCED_RENDER__;
}
function loadLegacy(module){
 if(loading[module.id])return;
 loading[module.id]=true;
 var load=window.ensurePortugueseModule;
 if(typeof load!=='function')return;
 Promise.resolve(load(module.id)).then(function(){
  delete loading[module.id];
  if(active()===module.id)redraw();
 }).catch(function(error){
  delete loading[module.id];
  console.error('[Português '+module.id+']',error);
  if(active()===module.id)redraw();
 });
}
function legacy(module){
 var render=enhanced(module);
 if(typeof render!=='function'){
  setTimeout(function(){loadLegacy(module)},0);
  return '<div class="ptc"><div class="ptc-head"><button type="button" class="ptc-back" onclick="PtControllerV1.back()">Voltar aos módulos</button><div class="ptc-title">'+module.id.toUpperCase()+' — '+escapeHtml(module.name)+'</div></div><div class="ptc-loading">Carregando módulo...</div></div>';
 }
 var html=render();
 setTimeout(function(){applyTextScale(document.querySelector('.subject[data-id="pt"] .ptc'),fontValue)},0);
 return '<div class="ptc"><div class="ptc-head"><button type="button" class="ptc-back" onclick="PtControllerV1.back()">Voltar aos módulos</button><div class="ptc-title">'+module.id.toUpperCase()+' — '+escapeHtml(module.name)+'</div></div><div class="ptc-content">'+html+'</div></div>';
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
  window.renderPortugueseMaster=render;
  if(typeof window.renderAll==='function')window.renderAll();
  else if(typeof window.renderSubjects==='function')window.renderSubjects();
 }catch(error){console.warn('[PT controller]',error)}
}
function applyTextScale(root,value){
 if(!root)return;
 var scale=Math.max(.85,Math.min(2.5,Number(value||100)/100));
 root.querySelectorAll('p,li,span,b,strong,em,small,label,button,input,textarea,select,option,h1,h2,h3,h4,h5,h6,td,th,summary,a,blockquote,code,pre,figcaption,legend').forEach(function(element){
  try{
   if(!element.dataset.ptBaseFont)element.dataset.ptBaseFont=String(parseFloat(getComputedStyle(element).fontSize)||16);
   element.style.setProperty('font-size',(Number(element.dataset.ptBaseFont)*scale).toFixed(2)+'px','important');
  }catch(_){}
 });
}
function fit(frame){
 try{
  var doc=frame.contentDocument||frame.contentWindow.document;
  if(!doc||!doc.body)return;
  applyTextScale(doc.body,fontValue);
  function resize(){try{frame.style.height=Math.max(500,doc.documentElement.scrollHeight,doc.body.scrollHeight)+'px'}catch(_){}}
  resize();setTimeout(resize,80);setTimeout(resize,350);setTimeout(resize,900);
  var loadingEl=document.getElementById(frame.id+'-loading');if(loadingEl)loadingEl.remove();
  if(!frame.__ptFontObserver&&typeof MutationObserver!=='undefined'){
   frame.__ptFontObserver=new MutationObserver(function(){applyTextScale(doc.body,fontValue);resize()});
   frame.__ptFontObserver.observe(doc.body,{subtree:true,childList:true});
  }
  doc.addEventListener('click',function(event){
   var anchor=event.target&&event.target.closest&&event.target.closest('a[href]');if(!anchor)return;
   var path=new URL(anchor.href,location.href).pathname;
   if(/\/(?:index\.html|central-v119\.html)?$/.test(path)){event.preventDefault();window.PtControllerV1.back()}
  });
 }catch(error){console.warn('[PT frame]',error)}
}
function setReadingFont(value){
 fontValue=Math.max(85,Math.min(250,Number(value)||100));
 document.documentElement.style.setProperty('--central-pt-font-scale',String(fontValue/100));
 applyTextScale(document.querySelector('.subject[data-id="pt"] .ptc-content'),fontValue);
 document.querySelectorAll('.ptc-frame').forEach(function(frame){fit(frame)});
 return fontValue;
}
window.PtControllerV1={
 open:function(id){if(!byId[id])return;try{localStorage.setItem(TAB_KEY,id)}catch(_){}redraw()},
 back:function(){try{localStorage.setItem(TAB_KEY,'hub')}catch(_){}redraw()},
 loaded:fit,setReadingFont:setReadingFont,
 audit:function(){return {registered:modules.map(function(module){return module.id}),active:active(),font:fontValue}}
};
window.__PT_CONTROLLER_RENDER__=render;
window.renderPortugueseMaster=render;
setReadingFont(fontValue);
setTimeout(redraw,0);
})();