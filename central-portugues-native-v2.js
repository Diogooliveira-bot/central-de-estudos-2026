/* Central de Estudos — Português nativo v2, arquitetura de cartões do CF. */
(function(){
'use strict';
if(window.__CENTRAL_PT_NATIVE_V4__)return;
window.__CENTRAL_PT_NATIVE_V4__=true;

var VERSION='20260921ptv2';
var OPEN_PREFIX='central-v6:pt-module-open:';
var ACTIVE_KEY='central-v6:pt:active-module';
var FONT_KEY='central-v6:reading-font-size';
var assets=Object.create(null);
var states=Object.create(null);
var stashes=Object.create(null);
var observers=Object.create(null);

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
  return {'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#39;'};
 });
}
function safeRead(key,fallback){
 try{var value=localStorage.getItem(key);return value==null?fallback:value}catch(_){return fallback}
}
function isOpen(id){return safeRead(OPEN_PREFIX+id,'0')==='1'}
function setOpen(id,value){
 try{localStorage.setItem(OPEN_PREFIX+id,value?'1':'0')}catch(_){}
}
function setActive(id){
 try{
  if(id)localStorage.setItem(ACTIVE_KEY,id);
  else localStorage.removeItem(ACTIVE_KEY);
 }catch(_){}
}
function readFont(){
 var value=Number(safeRead(FONT_KEY,'100'));
 return Math.max(85,Math.min(250,Math.round(value/5)*5||100));
}
function hostFor(id){
 return document.getElementById('pt-host-'+id);
}
function stateFor(id){
 return states[id]||(states[id]={promise:null,loaded:false});
}
function stashFor(id){
 return stashes[id]||(stashes[id]=document.createElement('div'));
}
function moveChildren(from,to){
 while(from&&from.firstChild)to.appendChild(from.firstChild);
}
function preserveMounted(){
 document.querySelectorAll('.pt-native-host[data-pt-host]').forEach(function(host){
  var id=host.getAttribute('data-pt-host');
  if(id&&host.childNodes.length)moveChildren(host,stashFor(id));
 });
}
function restoreStash(id,host){
 var stash=stashFor(id);
 if(!stash.childNodes.length)return false;
 moveChildren(stash,host);
 host.dataset.ptMounted='1';
 applyFont(host,readFont());
 return true;
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
 if(!observers[root.dataset.ptId]&&typeof MutationObserver!=='undefined'){
  observers[root.dataset.ptId]=new MutationObserver(function(){applyFont(root,readFont())});
  observers[root.dataset.ptId].observe(root,{childList:true,subtree:true});
 }
}
function setReadingFont(value){
 value=Math.max(85,Math.min(250,Math.round(Number(value||100)/5)*5||100));
 try{localStorage.setItem(FONT_KEY,String(value))}catch(_){}
 document.querySelectorAll('.pt-native-surface').forEach(function(root){applyFont(root,value)});
 return value;
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
 return String(css||'').replace(/(^|[{}])([^{}]+)\{/g,function(all,prefix,selectors){
  var raw=selectors.trim();
  if(!raw||raw.charAt(0)==='@'||/^(from|to|[0-9.]+%)$/.test(raw))return all;
  return prefix+raw.split(',').map(function(part){return scopeSelector(part,scope)}).join(', ')+'{';
 });
}
function installStyles(id,styles){
 var styleId='central-pt-native-v2-style-'+id;
 var old=document.getElementById(styleId);
 if(old)old.remove();
 if(!styles.length)return;
 var style=document.createElement('style');
 style.id=styleId;
 var scope='.pt-native-surface[data-pt-id="'+id+'"]';
 style.textContent=styles.map(function(css){return scopeCss(css,scope)}).join('\n');
 document.head.appendChild(style);
}
function installNativeTheme(id){
 var styleId='central-pt-native-v2-theme-'+id;
 var old=document.getElementById(styleId);
 if(old)old.remove();
 var scope='.pt-native-surface[data-pt-id="'+id+'"]';
 var style=document.createElement('style');
 style.id=styleId;
 style.textContent=
  scope+'{background:#f7f7f3!important;color:#24282f!important;font-family:Inter,system-ui,-apple-system,"Segoe UI",sans-serif!important;color-scheme:light!important;}'+
  scope+' .wrap,'+scope+' .top,'+scope+' .card,'+scope+' .session,'+scope+' .body,'+scope+' .trap,'+scope+' .exam,'+scope+' .remember,'+scope+' .warning,'+scope+' .panel,'+scope+' .tabs{background:#fffefb!important;color:#24282f!important;border-color:#e1e3de!important;}'+
  scope+' h1,'+scope+' h2,'+scope+' h3,'+scope+' h4,'+scope+' h5,'+scope+' h6,'+scope+' p,'+scope+' li,'+scope+' td,'+scope+' th,'+scope+' label,'+scope+' summary,'+scope+' strong,'+scope+' b,'+scope+' em,'+scope+' span,'+scope+' a{color:#24282f!important;}'+
  scope+' .muted{color:#7d8796!important;}'+
  scope+' .progress{background:#ebece8!important;}'+
  scope+' .progress span{background:#3568d4!important;}'+
  scope+' .tab,'+scope+' .card button,'+scope+' input,'+scope+' select,'+scope+' textarea{background:#fff!important;color:#24282f!important;border-color:#d9ddd7!important;}'+
  scope+' .tab.active,'+scope+' .tec-link{background:#3568d4!important;color:#fff!important;border-color:#3568d4!important;}'+
  scope+' .tab.active *,'+scope+' .tec-link *{color:#fff!important;}'+
  scope+' button{color:#24282f!important;}'+
  scope+' .hero,'+scope+' .teccard,'+scope+' .session,'+scope+' .qcard,'+scope+' .round,'+scope+' .method,'+scope+' .panel,'+scope+' .audit{background:#fffefb!important;color:#24282f!important;border-color:#e1e3de!important;}'+
  scope+' .flow b,'+scope+' .chip,'+scope+' .num,'+scope+' .qopt,'+scope+' .back,'+scope+' .ghost,'+scope+' .tab,'+scope+' .tecbtn{background:#fff!important;color:#24282f!important;border-color:#d9ddd7!important;}'+
  scope+' .tab.active,'+scope+' .tecbtn{background:#3568d4!important;color:#fff!important;border-color:#3568d4!important;}'+
  scope+' .tab.active *,'+scope+' .tecbtn *{color:#fff!important;}'+
  scope+' .sub,'+scope+' .goal,'+scope+' .state,'+scope+' .small,'+scope+' .audit,'+scope+' .progressmeta,'+scope+' .label{color:#7d8796!important;}'+
  scope+' .progressline,'+scope+' .soft,'+scope+' .method,'+scope+' .flow b,'+scope+' .chip{background:#f2f4f1!important;}'+
  scope+' .body th,'+scope+' .alert,'+scope+' .procedure,'+scope+' .evidence,'+scope+' .exam,'+scope+' .takeaway{background:#f2f4f1!important;color:#24282f!important;border-color:#dfe4de!important;}'+
  scope+' .qopt.selected{outline-color:#3568d4!important;}'+
  scope+' .round input{background:#fff!important;color:#24282f!important;border-color:#d9ddd7!important;}';
 document.head.appendChild(style);
}
function assetName(src){
 var url=new URL(src,window.location.href);
 return url.pathname.replace(/^\//,'')+url.search;
}
function hostScript(src){
 var raw=String(src||'');
 return raw.indexOf('_next-live/')>=0||raw.indexOf('vercel.live')>=0||raw.indexOf('feedback/feedback.js')>=0;
}
function versioned(src){
 var key=assetName(src);
 return key+(key.indexOf('?')>=0?'&':'?')+'v='+VERSION;
}
function loadScript(src){
 var key=assetName(src);
 if(hostScript(key))return Promise.resolve(key);
 if(assets[key])return assets[key];
 assets[key]=new Promise(function(resolve,reject){
  var script=document.createElement('script');
  script.src='/'+key;
  script.async=false;
  script.dataset.centralPtV2=key;
  script.onload=function(){resolve(key)};
  script.onerror=function(){delete assets[key];reject(new Error('Falha ao carregar '+key))};
  document.head.appendChild(script);
 });
 return assets[key];
}
function loadSequence(list){
 return list.reduce(function(chain,item){return chain.then(function(){return loadScript(item)})},Promise.resolve());
}
function scopedDocument(root){
 var scoped=Object.create(document);
 function localQuery(selector){
  var value=String(selector||'');
  if(value==='body')return root;
  if(value==='html')return document.documentElement;
  if(/^body(?:$|[.#[:])/.test(value)){
   var bodySelector=':scope'+value.slice(4);
   return root.matches(bodySelector)?root:root.querySelector(bodySelector);
  }
  return root.querySelector(value);
 }
 function localQueryAll(selector){
  var value=String(selector||'');
  if(value==='body')return [root];
  if(value==='html')return [document.documentElement];
  if(/^body(?:$|[.#[:])/.test(value)){
   var bodySelector=':scope'+value.slice(4);
   return root.matches(bodySelector)?[root]:root.querySelectorAll(bodySelector);
  }
  return root.querySelectorAll(value);
 }
 scoped.getElementById=function(id){
  if(id==null)return null;
  return root.querySelector('[id="'+String(id).replace(/"/g,'\\\"')+'"]');
 };
 scoped.querySelector=localQuery;
 scoped.querySelectorAll=localQueryAll;
 scoped.getElementsByClassName=function(name){return root.getElementsByClassName(name)};
 scoped.getElementsByTagName=function(name){return root.getElementsByTagName(name)};
 scoped.body=root;
 scoped.createElement=document.createElement.bind(document);
 scoped.createTextNode=document.createTextNode.bind(document);
 scoped.createDocumentFragment=document.createDocumentFragment.bind(document);
 scoped.addEventListener=function(type,handler,options){
  if(type==='DOMContentLoaded'){setTimeout(function(){handler.call(scoped,{type:type})},0);return}
  document.addEventListener(type,handler,options);
 };
 scoped.removeEventListener=function(type,handler,options){
  if(type==='DOMContentLoaded')return;
  document.removeEventListener(type,handler,options);
 };
 return scoped;
}
function runScoped(code,id,index,root){
 var doc=scopedDocument(root);
 var source=String(code||'')+'\\n//# sourceURL=central-pt-v2-'+id+'-'+index+'.js';
 return Function('document','window','globalThis',source)(doc,window,window);
}
var scopedAssets=Object.create(null);
function loadScopedScript(src,id,index,root){
 var key=assetName(src);
 if(hostScript(key))return Promise.resolve(key);
 if(!scopedAssets[key]){
  scopedAssets[key]=fetch('/'+key,{credentials:'same-origin',cache:'no-store'}).then(function(response){
   if(!response.ok)throw new Error('HTTP '+response.status+' ao carregar '+key);
   return response.text();
  });
 }
 return scopedAssets[key].then(function(source){
  runScoped(source,id,index,root);
  return key;
 });
}
function runInline(code,id,index,root){
 return runScoped(code,id,index,root);
}
function fetchMarkup(path){
 var request=path+(path.indexOf('?')>=0?'&':'?')+'v='+VERSION;
 return fetch('/'+request,{credentials:'same-origin',cache:'no-store'}).then(function(response){
  if(!response.ok)throw new Error('HTTP '+response.status+' ao carregar '+path);
  return response.text();
 });
}
function setHostHtml(id,host,html,styles){
 var current=hostFor(id);
 var target=current&&current.isConnected?current:stashFor(id);
 target.innerHTML=html||'<p>Conteúdo indisponível.</p>';
 installStyles(id,styles||[]);
 target.dataset.ptId=id;
 target.dataset.ptMounted='1';
 target.classList.add('pt-native-surface');
 applyFont(target,readFont());
 if(target!==current&&current&&current.isConnected)moveChildren(target,current);
 return current&&current.isConnected?current:target;
}
function legacyScripts(id){
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
function loadLegacy(id,host){
 var originalMaster=window.renderPortugueseMaster;
 var originalSubjects=window.renderSubjects;
 var originalAll=window.renderAll;
 var list=legacyScripts(id);
 var restored=false;
 function restore(){
  if(restored)return;
  restored=true;
  window.renderPortugueseMaster=originalMaster;
  window.renderSubjects=originalSubjects;
  window.renderAll=originalAll;
 }
 window.renderSubjects=function(){};
 window.renderAll=function(){};
 window.__PT_CANONICAL_HOST__=true;
 return loadScript(list[0]).then(function(){
  var api=id==='m1'?window.PtM1V3:window.PtM2V1;
  var base=api&&typeof api.render==='function'?api.render:null;
  if(!base)throw new Error('Renderer do '+id.toUpperCase()+' indisponível');
  window.renderPortugueseMaster=base;
  setHostHtml(id,host,base(),[]);
  return loadSequence(list.slice(1)).then(function(){
   var renderer=typeof window.renderPortugueseMaster==='function'?window.renderPortugueseMaster:base;
   setHostHtml(id,host,renderer(),[]);
   return host;
  });
 }).then(function(result){restore();return result},function(error){restore();throw error});
}
function loadHtmlModule(module,host){
 return fetchMarkup(module.src).then(function(markup){
  var doc=new DOMParser().parseFromString(markup,'text/html');
  var styles=Array.prototype.slice.call(doc.querySelectorAll('style')).map(function(style){return style.textContent});
  var scripts=Array.prototype.slice.call(doc.querySelectorAll('script')).filter(function(script){
   var src=script.getAttribute('src')||'';
   return !hostScript(src);
  });
  Array.prototype.slice.call(doc.querySelectorAll('script')).forEach(function(script){script.remove()});
  Array.prototype.slice.call(doc.querySelectorAll('a.back,a[href="index.html"],a[href="./index.html"],a[href="/index.html"]')).forEach(function(link){link.remove()});
  var body=doc.body?doc.body.innerHTML:'';
  host.innerHTML=body;
  host.dataset.ptId=module.id;
  host.classList.add('pt-native-surface');
  installStyles(module.id,styles);
  installNativeTheme(module.id);
  applyFont(host,readFont());
  return scripts.reduce(function(chain,script,index){
   return chain.then(function(){
    var src=script.getAttribute('src');
    if(src)return loadScopedScript(versioned(src),module.id,index,host);
    runInline(script.textContent,module.id,index,host);
   });
  },Promise.resolve()).then(function(){
   applyFont(host,readFont());
   return host;
  });
 });
}
function mount(module,host){
 var id=module.id;
 var state=stateFor(id);
 if(!host)return Promise.reject(new Error('Host '+id+' indisponível'));
 if(host.dataset.ptMounted==='1')return Promise.resolve(host);
 if(state.promise)return state.promise;
 if(restoreStash(id,host))return Promise.resolve(host);
 host.innerHTML='<div class="pt-native-loading">Carregando '+esc(module.title)+'…</div>';
 var job=(id==='m1'||id==='m2')?loadLegacy(id,host):loadHtmlModule(module,host);
 state.promise=job.then(function(result){
  state.loaded=true;
  if(result&&result.dataset)result.dataset.ptMounted='1';
  return result;
 }).catch(function(error){
  state.loaded=false;
  host.innerHTML='<div class="pt-native-error"><strong>Não foi possível abrir este módulo.</strong><p>'+esc(error.message||error)+'</p><button type="button" onclick="retryPtModule(\''+id+'\')">Tentar novamente</button></div>';
  console.error('[Português v2 '+id+']',error);
  throw error;
 }).then(function(result){
  state.promise=null;
  return result;
 },function(error){
  state.promise=null;
  throw error;
 });
 return state.promise;
}
function retryPtModule(id){
 var section=document.querySelector('.cf-module[data-pt-module="'+id+'"]');
 if(!section)return false;
 if(!section.classList.contains('open')){
  togglePtModule(id);
  return false;
 }
 var host=section.querySelector('[data-pt-host]');
 var state=stateFor(id);
 state.promise=null;
 state.loaded=false;
 if(host){
  host.removeAttribute('data-pt-mounted');
  host.innerHTML='<div class="pt-native-loading">Tentando carregar novamente…</div>';
  mount(BY_ID[id],host).catch(function(){});
 }
 return false;
}
function togglePtModule(id){
 var section=document.querySelector('.cf-module[data-pt-module="'+id+'"]');
 if(!section)return false;
 var opening=!section.classList.contains('open');
 section.classList.toggle('open',opening);
 section.setAttribute('aria-expanded',opening?'true':'false');
 setOpen(id,opening);
 setActive(opening?id:'');
 if(opening){
  var host=section.querySelector('[data-pt-host]');
  mount(BY_ID[id],host).catch(function(){});
 }
 return opening;
}
function renderModule(module){
 var open=isOpen(module.id);
 var mounted=stateFor(module.id).loaded;
 return '<section class="cf-module pt-native-module'+(open?' open':'')+'" data-pt-module="'+module.id+'" aria-expanded="'+(open?'true':'false')+'">'+
  '<button class="cf-module-head" type="button" onclick="togglePtModule(\''+module.id+'\')" aria-controls="pt-host-'+module.id+'">'+
   '<span class="cf-module-no">MÓDULO '+module.num+'</span><span class="cf-module-title">'+esc(module.title)+'</span>'+
   '<span class="cf-module-stat">Teoria • revisão • questões • TEC</span><span class="chev">⌄</span>'+
  '</button>'+
  '<div class="cf-module-body"><div class="cf-module-bar"><span style="width:0%"></span></div>'+
   '<div class="pt-native-host" id="pt-host-'+module.id+'" data-pt-host="'+module.id+'">'+
    (open?(mounted?'':'<div class="pt-native-loading">Preparando conteúdo…</div>'):'')+
   '</div>'+
  '</div>'+
 '</section>';
}
function renderPortugueseMaster(){
 preserveMounted();
 var html='<div class="cf-modules pt-native-modules" data-pt-native="v2">'+MODULES.map(renderModule).join('')+'</div>';
 setTimeout(function(){
  var subject=document.querySelector('.subject[data-id="pt"]');
  if(subject&&!subject.classList.contains('open'))return;
  MODULES.forEach(function(module){
   if(!isOpen(module.id))return;
   var host=hostFor(module.id);
   if(!host)return;
   if(restoreStash(module.id,host))return;
   if(host.dataset.ptMounted!=='1')mount(module,host).catch(function(){});
  });
 },0);
 return html;
}
function ptStats(subject){
 if(subject&&subject.id==='pt')return {total:17,done:0,pct:0,unit:'módulos'};
 return null;
}
var oldStats=window.subjStats;
if(typeof oldStats==='function')window.subjStats=function(subject){return ptStats(subject)||oldStats(subject)};

window.__PT_NATIVE_HOST__=true;
window.__PT_NATIVE_V2__=true;
window.__PT_NATIVE_MODULES__=MODULES.slice();
window.__PT_NATIVE_PROGRESS__=function(){
 return MODULES.map(function(module){
  var key='central-v6:pt:'+module.id+':v1';
  return {id:module.id,key:key,present:!!safeRead(key,'')};
 });
};
window.PtControllerV2={
 setReadingFont:setReadingFont,
 loaded:function(root){applyFont(root,readFont())},
 audit:function(){return {native:true,modules:MODULES.map(function(module){return module.id}),iframes:0,fontMax:250}}
};
window.setPortugueseFont=setReadingFont;
window.ensurePortugueseLoaded=function(){return Promise.resolve(true)};
window.ensurePortugueseModule=function(id){
 if(!BY_ID[id])return Promise.reject(new Error('Módulo Português inválido: '+id));
 var host=hostFor(id);
 return host?mount(BY_ID[id],host):Promise.reject(new Error('Módulo fora da Central'));
};
window.togglePtModule=togglePtModule;
window.retryPtModule=retryPtModule;
window.renderPortugueseMaster=renderPortugueseMaster;
if(typeof window.renderAll==='function')window.renderAll();
})();