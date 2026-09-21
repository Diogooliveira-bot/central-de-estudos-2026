/* Central de Estudos — Português nativo, mesmo fluxo estrutural do CF. */
(function(){
'use strict';
if(window.__CENTRAL_PT_NATIVE_V3__)return;
window.__CENTRAL_PT_NATIVE_V3__=true;
window.__CENTRAL_PT_LOADER_V2__=true;

var VERSION='20260921ptnative1';
var ACTIVE_KEY='central-v6:pt:active-module';
var OPEN_PREFIX='central-v6:pt-module-open:';
var FONT_KEY='central-v6:reading-font-size';
var scripts=Object.create(null);
var moduleLoads=Object.create(null);
var mounts=Object.create(null);
var fontObserver=null;

var MODULES=[
 {id:'m1',num:1,title:'Ortografia e Acentuação'},
 {id:'m2',num:2,title:'Classes Nominais'},
 {id:'m3',num:3,title:'Conectivos',src:'portugues-m3-preview-v1.html'},
 {id:'m4',num:4,title:'Pronomes',src:'portugues-m4-preview-v1.html'},
 {id:'m5',num:5,title:'Colocação Pronominal',src:'portugues-m5-preview-v1.html'},
 {id:'m6',num:6,title:'Verbos',src:'portugues-m6-v1.html'},
 {id:'m7',num:7,title:'Correlação e Vozes',src:'portugues-m7-v1.html'},
 {id:'m8',num:8,title:'Sintaxe da Oração',src:'portugues-m8-v1.html'},
 {id:'m9',num:9,title:'Sintaxe do Período',src:'portugues-m9-v1.html'},
 {id:'m10',num:10,title:'Pontuação',src:'portugues-m10-v1.html'},
 {id:'m11',num:11,title:'Concordância',src:'portugues-m11-v1.html'},
 {id:'m12',num:12,title:'Regência Verbal e Nominal',src:'portugues-m12-v1.html'},
 {id:'m13',num:13,title:'Crase',src:'portugues-m13-v1.html'},
 {id:'m14',num:14,title:'Coesão e Coerência',src:'portugues-m14-v1.html'},
 {id:'m15',num:15,title:'Semântica Geral',src:'portugues-m15-v1.html'},
 {id:'m16',num:16,title:'Interpretação de Textos',src:'portugues-m16-v1.html'},
 {id:'m17',num:17,title:'Tipologia Textual',src:'portugues-m17-v1.html'}
];
var BY_ID=MODULES.reduce(function(out,module){out[module.id]=module;return out},{});

function esc(value){
 return String(value==null?'':value).replace(/[&<>\"']/g,function(char){
  return {'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#39;'}[char];
 });
}
function readActive(){
 try{
  var id=localStorage.getItem(ACTIVE_KEY);
  return BY_ID[id]?id:'';
 }catch(_){return ''}
}
function writeOpen(id,value){
 try{localStorage.setItem(OPEN_PREFIX+id,value?'1':'0')}catch(_){}
}
function writeActive(id){
 try{
  if(id)localStorage.setItem(ACTIVE_KEY,id);
  else localStorage.removeItem(ACTIVE_KEY);
 }catch(_){}
}
function readFont(){
 try{
  var value=Number(localStorage.getItem(FONT_KEY)||100);
  return Math.max(85,Math.min(250,Math.round(value/5)*5||100));
 }catch(_){return 100}
}
function setModuleState(section,open){
 if(!section)return;
 section.classList.toggle('open',!!open);
 section.setAttribute('aria-expanded',open?'true':'false');
}

function scopeSelector(selector,scope){
 var value=selector.trim();
 if(!value)return value;
 if(value===':root')return scope;
 if(/^html(?:\s|$|[.#[:])/.test(value))return value.replace(/^html/,scope);
 if(/^body(?:\s|$|[.#[:])/.test(value))return value.replace(/^body/,scope);
 return scope+' '+value;
}
function scopeCss(css,scope){
 return String(css||'').replace(/(^|})([^{}]+)\{/g,function(all,prefix,selectors){
  var raw=selectors.trim();
  if(!raw||raw.charAt(0)==='@'||/^(from|to|[0-9.]+%)$/.test(raw))return all;
  return prefix+raw.split(',').map(function(part){return scopeSelector(part,scope)}).join(', ')+'{';
 });
}
function installModuleStyles(id,styles){
 var styleId='central-pt-native-style-'+id;
 var old=document.getElementById(styleId);
 if(old)old.remove();
 var style=document.createElement('style');
 style.id=styleId;
 var scope='.pt-native-surface[data-pt-id="'+id+'"]';
 style.textContent=styles.map(function(css){return scopeCss(css,scope)}).join('\n');
 document.head.appendChild(style);
}
function assetName(src){
 var url=new URL(src,window.location.href);
 return url.pathname.replace(/^\//,'')+url.search;
}
function addScript(src){
 var key=assetName(src);
 if(scripts[key])return scripts[key];
 scripts[key]=new Promise(function(resolve,reject){
  var script=document.createElement('script');
  script.src='/'+key;
  script.async=false;
  script.dataset.centralPtAsset=key;
  script.onload=function(){resolve(key)};
  script.onerror=function(){delete scripts[key];reject(new Error('Falha ao carregar '+key))};
  document.head.appendChild(script);
 });
 return scripts[key];
}
function sequence(list){
 return list.reduce(function(chain,item){return chain.then(function(){return addScript(item)})},Promise.resolve());
}
function executeInline(code,id,index){
 var script=document.createElement('script');
 script.type='text/javascript';
 script.dataset.centralPtInline=id;
 script.text=String(code||'')+'\n//# sourceURL=central-pt-'+id+'-inline-'+index+'.js';
 document.head.appendChild(script);
 script.remove();
}
function fetchText(path){
 return fetch('/'+path,{credentials:'same-origin',cache:'default'}).then(function(response){
  if(!response.ok)throw new Error('HTTP '+response.status+' ao carregar '+path);
  return response.text();
 });
}
function applyFont(root,value){
 if(!root)return;
 value=Math.max(85,Math.min(250,Number(value)||100));
 root.style.setProperty('--central-pt-font-scale',String(value/100));
 var selector='p,li,span,strong,b,em,small,label,button,input,textarea,select,option,summary,h1,h2,h3,h4,h5,h6,dt,dd,td,th,blockquote,a';
 root.querySelectorAll(selector).forEach(function(element){
  var base=Number(element.dataset.centralPtBaseFont);
  if(!base){
   base=parseFloat(window.getComputedStyle(element).fontSize)||16;
   element.dataset.centralPtBaseFont=String(base);
  }
  element.style.setProperty('font-size',(base*value/100).toFixed(2)+'px','important');
 });
}
function applyFontEverywhere(value){
 document.querySelectorAll('.pt-native-surface').forEach(function(root){applyFont(root,value)});
}
function setReadingFont(value){
 value=Math.max(85,Math.min(250,Math.round(Number(value||100)/5)*5||100));
 try{localStorage.setItem(FONT_KEY,String(value))}catch(_){}
 applyFontEverywhere(value);
 return value;
}
function makeSurface(host,id){
 host.classList.add('pt-native-surface');
 host.dataset.ptId=id;
 applyFont(host,readFont());
 if(typeof MutationObserver==='undefined'||fontObserver)return;
 fontObserver=new MutationObserver(function(){applyFont(host,readFont())});
 fontObserver.observe(host,{childList:true,subtree:true});
}
function moveChildren(from,to){
 while(from&&from.firstChild)to.appendChild(from.firstChild);
}
function preserveMountedContent(){
 document.querySelectorAll('.pt-native-host[data-pt-host]').forEach(function(host){
  var id=host.getAttribute('data-pt-host');
  if(!id||!host.childNodes.length)return;
  var record=mounts[id]||(mounts[id]={stash:document.createElement('div')});
  moveChildren(host,record.stash);
 });
}
function restoreStash(host,id){
 var record=mounts[id];
 if(!record||!record.stash||!record.stash.childNodes.length)return false;
 moveChildren(record.stash,host);
 makeSurface(host,id);
 return true;
}
function moduleScriptList(id){
 var common='?v='+VERSION;
 if(id==='m1')return [
  'portugues-m1-v3.js'+common,
  'portugues-m1-theory-v1.js'+common,
  'portugues-m1-theory-v2.js'+common,
  'portugues-m1-theory-v3.js'+common,
  'portugues-m1-no-anki-v1.js'+common,
  'portugues-m1-apostila-v2.js'+common
 ];
 if(id==='m2')return [
  'portugues-m2-v1.js'+common,
  'portugues-m2-tec-link-v1.js'+common
 ];
 return [];
}
function renderNativeM1M2(id){
 var original=window.renderPortugueseMaster;
 var list=moduleScriptList(id);
 return addScript(list[0]).then(function(){
  var base=id==='m1'?(window.PtM1V3&&window.PtM1V3.render):(window.PtM2V1&&window.PtM2V1.render);
  if(typeof base!=='function')throw new Error('Renderer nativo ausente para '+id);
  window.renderPortugueseMaster=base;
  return sequence(list.slice(1));
 }).then(function(){
  var html=typeof window.renderPortugueseMaster==='function'?window.renderPortugueseMaster():''; 
  window.renderPortugueseMaster=original;
  return html;
 },function(error){
  window.renderPortugueseMaster=original;
  throw error;
 });
}
function renderHtmlModule(id,host,module){
 return fetchText(module.src).then(function(markup){
  var doc=new DOMParser().parseFromString(markup,'text/html');
  var styles=Array.prototype.slice.call(doc.querySelectorAll('style')).map(function(style){return style.textContent});
  var scriptsInDoc=Array.prototype.slice.call(doc.querySelectorAll('script'));
  scriptsInDoc.forEach(function(script){script.remove()});
  host.innerHTML=doc.body?doc.body.innerHTML:'';
  installModuleStyles(id,styles);
  makeSurface(host,id);
  var jobs=scriptsInDoc.reduce(function(chain,script,index){
   return chain.then(function(){
    if(script.src)return addScript(assetName(script.src));
    executeInline(script.textContent,id,index);
   });
  },Promise.resolve());
  return jobs.then(function(){applyFont(host,readFont());return host});
 });
}
function mount(module,host){
 var id=module.id;
 var record=mounts[id]||(mounts[id]={stash:document.createElement('div')});
 if(restoreStash(host,id))return Promise.resolve(host);
 host.innerHTML='<div class="pt-native-loading">Carregando '+esc(module.title)+'…</div>';
 var job;
 if(id==='m1'||id==='m2'){
  job=renderNativeM1M2(id).then(function(html){
   host.innerHTML=html||'<p>Conteúdo indisponível.</p>';
   installModuleStyles(id,[]);
   makeSurface(host,id);
   applyFont(host,readFont());
   return host;
  });
 }else{
  job=renderHtmlModule(id,host,module);
 }
 record.promise=job;
 return job.catch(function(error){
  host.innerHTML='<div class="pt-native-error"><strong>Não foi possível abrir este módulo.</strong><p>'+esc(error.message||error)+'</p><button type="button" onclick="togglePtModule(\''+id+'\')">Tentar novamente</button></div>';
  console.error('[Português nativo '+id+']',error);
  throw error;
 });
}
function closeCurrentExcept(id){
 document.querySelectorAll('.cf-module[data-pt-module]').forEach(function(section){
  var other=section.getAttribute('data-pt-module');
  var open=other===id;
  setModuleState(section,open);
  writeOpen(other,open);
  if(!open){
   var host=section.querySelector('[data-pt-host]');
   if(host&&host.childNodes.length){
    var record=mounts[other]||(mounts[other]={stash:document.createElement('div')});
    moveChildren(host,record.stash);
   }
  }
 });
}
function openModule(id){
 var module=BY_ID[id],section=document.querySelector('.cf-module[data-pt-module="'+id+'"]');
 if(!module||!section)return Promise.resolve(false);
 closeCurrentExcept(id);
 writeActive(id);
 setModuleState(section,true);
 var host=section.querySelector('[data-pt-host]');
 return mount(module,host).then(function(){applyFont(host,readFont());return true});
}
function togglePtModule(id){
 var active=readActive();
 if(active===id){
  closeCurrentExcept('');
  writeActive('');
  return false;
 }
 return openModule(id).catch(function(){return false});
}
function backToPortugueseHub(){
 var active=readActive();
 closeCurrentExcept('');
 writeActive('');
 if(active)applyFontEverywhere(readFont());
 return true;
}
function renderModule(module,active){
 var open=module.id===active;
 return '<section class="cf-module pt-native-module'+(open?' open':'')+'" data-pt-module="'+module.id+'" aria-expanded="'+(open?'true':'false')+'">'+
  '<button class="cf-module-head" type="button" onclick="togglePtModule(\''+module.id+'\')" aria-controls="pt-host-'+module.id+'">'+
   '<span class="cf-module-title"><span class="cf-module-number">M'+module.num+'</span> '+esc(module.title)+'</span>'+
   '<span class="cf-module-meta">Abrir módulo <span aria-hidden="true">⌄</span></span>'+
  '</button>'+
  '<div class="cf-module-body"><div class="pt-native-host" id="pt-host-'+module.id+'" data-pt-host="'+module.id+'">'+
   (open?'<div class="pt-native-loading">Preparando conteúdo…</div>':'')+
  '</div></div>'+
 '</section>';
}
function renderPortugueseMaster(){
 preserveMountedContent();
 var active=readActive();
 var html='<div class="pt-cf-modules pt-native-modules" data-pt-native="true">'+
  '<div class="pt-native-heading"><strong>Português</strong><span>17 módulos • teoria, revisão, questões e TEC</span></div>'+
  MODULES.map(function(module){return renderModule(module,active)}).join('')+
  '</div>';
 setTimeout(function(){
  if(!active)return;
  var ptSubject=document.querySelector('.subject[data-id="pt"]');
  if(ptSubject&&!ptSubject.classList.contains('open'))return;
  var section=document.querySelector('.cf-module[data-pt-module="'+active+'"]');
  if(section){
   var host=section.querySelector('[data-pt-host]');
   mount(BY_ID[active],host).catch(function(){});
  }
 },0);
 return html;
}
function nativeStats(subject){
 if(subject&&subject.id==='pt')return {total:17,done:0,pct:0,unit:'módulos'};
 return null;
}
var previousStats=window.subjStats;
if(typeof previousStats==='function'){
 window.subjStats=function(subject){return nativeStats(subject)||previousStats(subject)};
}
window.__PT_CANONICAL_HOST__=true;
window.__PT_NATIVE_MODULES__=MODULES.slice();
window.__PT_NATIVE_RENDER__=renderPortugueseMaster;
window.__PT_NATIVE_PROGRESS__=function(){
 return MODULES.map(function(module){
  var key='central-v6:pt:'+module.id+':v1',value=null;
  try{value=JSON.parse(localStorage.getItem(key)||'null')}catch(_){}
  return {id:module.id,key:key,present:!!value};
 });
};
window.PtControllerV1={
 setReadingFont:setReadingFont,
 loaded:function(root){applyFont(root,readFont())},
 back:backToPortugueseHub,
 audit:function(){return {native:true,modules:MODULES.map(function(module){return module.id}),iframeCount:document.querySelectorAll('.pt-native-modules iframe').length,fontMax:250}}
};
window.setPortugueseFont=setReadingFont;
window.ensurePortugueseLoaded=function(){return Promise.resolve(true)};
window.ensurePortugueseModule=function(id){
 if(!BY_ID[id])return Promise.reject(new Error('Módulo Português inválido: '+id));
 var section=document.querySelector('.cf-module[data-pt-module="'+id+'"]');
 return section?openModule(id):Promise.resolve(true);
};
window.togglePtModule=togglePtModule;
window.backToPortugueseHub=backToPortugueseHub;
window.togglePtCanonicalModule=togglePtModule;
window.ptCanonicalMount=function(){};
window.ptCanonicalContent=function(){return ''};
window.__PT_CONTROLLER_RENDER__=renderPortugueseMaster;
window.renderPortugueseMaster=renderPortugueseMaster;
if(typeof window.renderAll==='function')window.renderAll();
})();