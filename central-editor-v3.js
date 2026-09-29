(function(){
'use strict';
if(window.__centralEditorV3)return;window.__centralEditorV3=true;

var API='/api/editor';
var SESSION_KEY='central-editor-v3:secret';
var BTN_ID='centralEditorToggleV3';
var TOOLBAR_ID='centralEditorToolbarV3';
var MODAL_ID='centralEditorLoginV3';
var CANDIDATE_ATTR='data-central-editor-v3';
var SELECTOR_ATTR='data-central-editor-selector-v3';
var PAGE_ATTR='data-central-editor-page-v3';
var state={active:false,secret:'',dirty:new Map(),docs:new Set(),cache:new Map(),applying:false};

function escCss(value){
  if(window.CSS&&typeof window.CSS.escape==='function')return window.CSS.escape(String(value));
  return String(value).replace(/[^a-zA-Z0-9_-]/g,function(ch){return '\\'+ch.charCodeAt(0).toString(16)+' '});
}
function visible(el){
  if(!el||!el.isConnected)return false;
  try{
    var s=el.ownerDocument.defaultView.getComputedStyle(el);
    return s.display!=='none'&&s.visibility!=='hidden'&&el.getClientRects().length>0;
  }catch(_){return true}
}
function safeDoc(frame){try{return frame&&frame.contentDocument&&frame.contentDocument.body?frame.contentDocument:null}catch(_){return null}}
function sanitizeHtml(html){
  var t=document.createElement('template');t.innerHTML=String(html==null?'':html);
  t.content.querySelectorAll('script,iframe,object,embed,style,link,meta,form,input,button,textarea,select').forEach(function(n){n.remove()});
  t.content.querySelectorAll('*').forEach(function(n){
    Array.from(n.attributes||[]).forEach(function(a){
      if(/^on/i.test(a.name)||a.name==='srcdoc')n.removeAttribute(a.name);
      if((a.name==='href'||a.name==='src')&&/^\s*javascript:/i.test(a.value||''))n.removeAttribute(a.name);
    });
  });
  return t.innerHTML;
}
function activeViewId(doc){
  if(doc!==document)return '';
  var views=Array.from(doc.querySelectorAll('.view')).filter(function(el){return !el.classList.contains('hidden')&&visible(el)});
  return views.length&&views[0].id?views[0].id:'';
}
function contextLabel(doc){
  try{
    if(doc!==document)return '';
    var crumb=doc.getElementById('crumb');
    return String(crumb&&crumb.textContent||'').trim().replace(/\s+/g,' ').slice(0,180);
  }catch(_){return ''}
}
function pageKey(doc){
  try{
    var u=new URL(doc.location.href),base=u.pathname||'/';
    if(doc===document){
      var v=activeViewId(doc),c=contextLabel(doc);
      if(v)base+='|view='+v;
      if(c)base+='|ctx='+c;
    }
    return base;
  }catch(_){return '/'}
}
function uniqueIdSelector(el,doc){
  if(!el.id)return '';
  var sel='#'+escCss(el.id);
  try{return doc.querySelectorAll(sel).length===1?sel:''}catch(_){return ''}
}
function cssPath(el,doc){
  var byId=uniqueIdSelector(el,doc);if(byId)return byId;
  var parts=[],node=el,guard=0;
  while(node&&node.nodeType===1&&node!==doc.body&&guard++<20){
    var idSel=uniqueIdSelector(node,doc);
    if(idSel){parts.unshift(idSel);break}
    var tag=String(node.tagName||'div').toLowerCase(),parent=node.parentElement;
    if(!parent){parts.unshift(tag);break}
    var same=Array.from(parent.children).filter(function(x){return x.tagName===node.tagName});
    var nth=same.indexOf(node)+1;
    parts.unshift(tag+(same.length>1?':nth-of-type('+nth+')':''));
    node=parent;
  }
  return parts.join(' > ');
}
function topScopes(doc){
  var views=Array.from(doc.querySelectorAll('.view')).filter(function(el){
    return !el.classList.contains('hidden')&&visible(el);
  });
  if(views.length)return views;
  var main=doc.querySelector('main,.main,.content,.app-main');
  return main?[main]:[doc.body];
}
function editableScopes(doc){return doc===document?topScopes(doc):[doc.body]}
function excluded(el){
  if(!el||!el.isConnected)return true;
  if(el.closest&&el.closest('#'+TOOLBAR_ID+',#'+BTN_ID+',#'+MODAL_ID+',nav,aside,.sidebar,.central-settings,.central-settings-backdrop'))return true;
  if(el.matches('script,style,svg,path,iframe,object,embed,canvas,video,audio,input,textarea,select,option'))return true;
  return false;
}
function hasDirectText(el){
  try{return Array.from(el.childNodes||[]).some(function(n){return n.nodeType===3&&String(n.nodeValue||'').trim().length>0})}catch(_){return false}
}
function isCandidate(el){
  if(excluded(el)||!visible(el))return false;
  var text=String(el.textContent||'').trim();
  if(text.length<1)return false;
  if(el.matches('button,[role="button"],input,textarea,select,option'))return false;
  if(el.querySelector('input,textarea,select,iframe,video,audio,canvas'))return false;
  return hasDirectText(el)||el.children.length===0||el.hasAttribute('data-editor-text');
}
function candidateElements(doc){
  var out=[];
  editableScopes(doc).forEach(function(scope){
    try{
      var all=[scope].concat(Array.from(scope.querySelectorAll('*')));
      all.forEach(function(el){
        if(!isCandidate(el)||out.indexOf(el)>=0)return;
        var parent=el.parentElement;
        while(parent&&parent!==scope){
          if(out.indexOf(parent)>=0&&/^(P|LI|TD|TH|H1|H2|H3|H4|H5|H6|BLOCKQUOTE|FIGCAPTION)$/i.test(parent.tagName||''))return;
          parent=parent.parentElement;
        }
        out.push(el);
      });
    }catch(_){}
  });
  return out;
}
function fallbackEditableFromTarget(target,doc){
  var el=target&&target.nodeType===1?target:target&&target.parentElement;
  var scopes=editableScopes(doc);
  while(el&&el!==doc.body&&el!==doc.documentElement){
    if(scopes.some(function(s){return s===el||s.contains(el)})){
      if(!excluded(el)&&visible(el)&&String(el.textContent||'').trim().length>0&&!el.matches('button,[role="button"],input,textarea,select,option,script,style,svg,path,iframe')){
        return el;
      }
    }
    el=el.parentElement;
  }
  return null;
}
async function fetchOverrides(doc,force){
  var page=pageKey(doc);
  if(!force&&state.cache.has(page))return state.cache.get(page);
  try{
    var r=await fetch(API+'?page='+encodeURIComponent(page),{cache:'no-store'});
    var j=await r.json();
    if(!r.ok)throw new Error(j.error||('HTTP '+r.status));
    var list=Array.isArray(j.overrides)?j.overrides:[];
    state.cache.set(page,list);return list;
  }catch(e){console.warn('[Editor v3] leitura',page,e);return []}
}
async function applyOverrides(doc,force){
  if(!doc||!doc.body)return;
  var list=await fetchOverrides(doc,force);
  state.applying=true;
  try{
    list.forEach(function(item){
      try{
        var el=doc.querySelector(item.selector);if(!el)return;
        var k=pageKey(doc)+'@@'+item.selector;if(state.dirty.has(k))return;
        var html=sanitizeHtml(item.html);if(el.innerHTML!==html)el.innerHTML=html;
      }catch(_){}
    });
  }finally{state.applying=false}
  if(state.active)enableDoc(doc);
}
function markDirty(el,doc){
  if(state.applying)return;
  var selector=el.getAttribute(SELECTOR_ATTR)||cssPath(el,doc);
  var page=el.getAttribute(PAGE_ATTR)||pageKey(doc);
  if(!selector||!page)return;
  el.setAttribute(SELECTOR_ATTR,selector);el.setAttribute(PAGE_ATTR,page);
  state.dirty.set(page+'@@'+selector,{page:page,selector:selector,html:sanitizeHtml(el.innerHTML),el:el});
  el.classList.add('central-editor-dirty-v3');
  status(state.dirty.size+' alteração(ões) não salva(s)','warn');
}
function injectDocStyle(doc){
  if(doc.getElementById('centralEditorStyleV3'))return;
  var st=doc.createElement('style');st.id='centralEditorStyleV3';st.textContent=
    '['+CANDIDATE_ATTR+'="1"]{outline:1px dashed rgba(124,92,255,.6)!important;outline-offset:3px;border-radius:3px;cursor:text}'+
    '['+CANDIDATE_ATTR+'="1"]:hover,['+CANDIDATE_ATTR+'="1"]:focus{outline:2px solid #7c5cff!important;background:rgba(124,92,255,.10)!important}'+
    '.central-editor-dirty-v3{outline:2px solid #f59e0b!important;background:rgba(245,158,11,.10)!important}';
  (doc.head||doc.documentElement).appendChild(st);
}
function makeEditable(el,doc){
  if(!el||excluded(el))return false;
  if(el.getAttribute(CANDIDATE_ATTR)!=='1'){
    var selector=cssPath(el,doc);if(!selector)return false;
    el.setAttribute(CANDIDATE_ATTR,'1');
    el.setAttribute(SELECTOR_ATTR,selector);
    el.setAttribute(PAGE_ATTR,pageKey(doc));
    el.setAttribute('contenteditable','true');el.setAttribute('spellcheck','true');
    el.addEventListener('input',function(){markDirty(el,doc)});
    el.addEventListener('paste',function(){setTimeout(function(){markDirty(el,doc)},0)});
  }
  return true;
}
function bindUniversalClick(doc){
  if(!doc||!doc.body||doc.__centralEditorClickV3)return;doc.__centralEditorClickV3=true;
  doc.addEventListener('click',function(e){
    if(!state.active)return;
    var t=e.target;
    if(!t||excluded(t))return;
    var el=fallbackEditableFromTarget(t,doc);
    if(!el)return;
    if(el.closest&&el.closest('a[href]'))e.preventDefault();
    if(makeEditable(el,doc)){
      try{el.focus({preventScroll:true})}catch(_){try{el.focus()}catch(__){}}
    }
  },true);
}
function enableDoc(doc){
  if(!doc||!doc.body)return 0;state.docs.add(doc);injectDocStyle(doc);bindUniversalClick(doc);
  var count=0;
  candidateElements(doc).forEach(function(el){if(makeEditable(el,doc))count++});
  return count;
}
function disableDoc(doc){
  if(!doc||!doc.body)return;
  try{doc.querySelectorAll('['+CANDIDATE_ATTR+'="1"]').forEach(function(el){
    el.removeAttribute('contenteditable');el.removeAttribute('spellcheck');el.removeAttribute(CANDIDATE_ATTR);
    el.classList.remove('central-editor-dirty-v3');
  })}catch(_){}
}
function watchDoc(doc){
  if(!doc||!doc.body||doc.__centralEditorWatchV3)return;doc.__centralEditorWatchV3=true;state.docs.add(doc);bindUniversalClick(doc);
  var timer=null;
  try{
    var mo=new MutationObserver(function(){
      clearTimeout(timer);timer=setTimeout(function(){
        applyOverrides(doc,false);
        if(state.active)refreshEditable();
      },220);
    });
    mo.observe(doc.body,{childList:true,subtree:true});
  }catch(_){}
}
function scanFrames(){
  document.querySelectorAll('iframe').forEach(function(frame){
    if(frame.__centralEditorBoundV3)return;frame.__centralEditorBoundV3=true;
    function run(){
      var doc=safeDoc(frame);if(!doc)return;watchDoc(doc);applyOverrides(doc,true);
      if(state.active)refreshEditable();
    }
    frame.addEventListener('load',function(){setTimeout(run,120)});
    setTimeout(run,100);
  });
}
function refreshEditable(){
  if(!state.active)return 0;
  var total=0;state.docs.forEach(function(doc){total+=enableDoc(doc)||0});
  scanFrames();
  if(total)status('Editor ativo • '+total+' campo(s) editável(is)','ok');
  else status('Editor ativo. Clique em qualquer texto do conteúdo; se ele não estiver marcado, o editor tentará habilitá-lo ao clicar.','warn');
  return total;
}
function status(msg,type){
  var el=document.getElementById('centralEditorStatusV3');if(!el)return;
  el.textContent=msg||'';el.className='central-editor-status-v2 '+(type||'');
}
async function post(secret,body){
  var r=await fetch(API,{method:'POST',headers:{'Content-Type':'application/json','X-Backup-Key':secret},body:JSON.stringify(body)});
  var txt=await r.text(),j={};try{j=txt?JSON.parse(txt):{}}catch(_){j={error:txt||('HTTP '+r.status)}}
  if(!r.ok)throw new Error(j.error||('HTTP '+r.status));return j;
}
function hideLogin(){var m=document.getElementById(MODAL_ID);if(m)m.classList.remove('show')}
function showLogin(){
  injectUi();
  var m=document.getElementById(MODAL_ID),input=document.getElementById('centralEditorPasswordV3'),msg=document.getElementById('centralEditorLoginMsgV3');
  if(msg)msg.textContent='Digite a chave de administração para ativar o editor.';
  if(input)input.value='';
  if(m)m.classList.add('show');
  setTimeout(function(){try{input.focus()}catch(_){}},50);
}
async function submitLogin(){
  var input=document.getElementById('centralEditorPasswordV3'),msg=document.getElementById('centralEditorLoginMsgV3');
  var secret=String(input&&input.value||'').trim();
  if(!secret){if(msg)msg.textContent='Digite a chave de administração.';return}
  if(msg)msg.textContent='Verificando...';
  try{
    await post(secret,{action:'verify'});state.secret=secret;
    try{sessionStorage.setItem(SESSION_KEY,secret)}catch(_){}
    hideLogin();activate();
  }catch(e){if(msg)msg.textContent='Chave inválida ou indisponível. '+e.message}
}
function activate(){
  state.active=true;document.body.classList.add('central-editor-active-v2');
  var b=document.getElementById(BTN_ID);if(b)b.textContent='✓ Editor ativo';
  showToolbar(true);refreshEditable();
  setTimeout(refreshEditable,300);setTimeout(refreshEditable,1000);
}
async function requestActivate(){
  if(state.active)return deactivate();
  var existing='';try{existing=sessionStorage.getItem(SESSION_KEY)||''}catch(_){}
  if(existing){
    try{await post(existing,{action:'verify'});state.secret=existing;activate();return}catch(_){
      try{sessionStorage.removeItem(SESSION_KEY)}catch(__){}
    }
  }
  showLogin();
}
function deactivate(){
  if(state.dirty.size&&!confirm('Existem alterações não salvas. Sair do editor e descartá-las?'))return;
  state.active=false;document.body.classList.remove('central-editor-active-v2');
  state.docs.forEach(disableDoc);state.dirty.clear();
  var b=document.getElementById(BTN_ID);if(b)b.textContent='✏ Modo Editor';
  showToolbar(false);status('');
}
async function save(){
  var changes=Array.from(state.dirty.values()).map(function(x){return {page:x.page,selector:x.selector,html:sanitizeHtml(x.html)}});
  if(!changes.length){status('Nenhuma alteração pendente.','ok');return}
  if(!state.secret){status('Sessão do editor expirada. Saia e entre novamente.','err');return}
  status('Salvando online...','warn');
  try{
    var r=await post(state.secret,{action:'save',changes:changes});
    changes.forEach(function(ch){
      var k=ch.page+'@@'+ch.selector,entry=state.dirty.get(k);
      if(entry&&entry.el)entry.el.classList.remove('central-editor-dirty-v3');
      state.dirty.delete(k);state.cache.delete(ch.page);
    });
    status((r.saved||changes.length)+' alteração(ões) salva(s) online.','ok');
  }catch(e){status('Falha ao salvar: '+e.message,'err')}
}
function showToolbar(show){var t=document.getElementById(TOOLBAR_ID);if(t)t.style.display=show?'flex':'none'}
function injectUi(){
  if(document.getElementById(BTN_ID))return;
  var style=document.createElement('style');style.textContent=
    '#'+BTN_ID+'{position:fixed;right:18px;bottom:18px;z-index:2147483000;border:1px solid #6d5dfc;background:#6d5dfc;color:#fff;border-radius:12px;padding:11px 14px;font-weight:800;box-shadow:0 10px 30px rgba(0,0,0,.35)}'+
    '#'+TOOLBAR_ID+'{position:fixed;left:50%;bottom:16px;transform:translateX(-50%);z-index:2147482999;display:none;align-items:center;gap:8px;max-width:calc(100vw - 190px);background:#0d1727;color:#f1f5fb;border:1px solid #334760;border-radius:14px;padding:8px 10px;box-shadow:0 12px 36px rgba(0,0,0,.4)}'+
    '#'+TOOLBAR_ID+' button{border:1px solid #334760;background:#111d2f;color:#f1f5fb;border-radius:9px;padding:8px 11px;font-weight:750}#'+TOOLBAR_ID+' .save{background:#6d5dfc;border-color:#6d5dfc}'+
    '.central-editor-status-v2{font-size:12px;color:#a9b8cd;min-width:220px}.central-editor-status-v2.ok{color:#66d99a}.central-editor-status-v2.warn{color:#f6c85f}.central-editor-status-v2.err{color:#ff7b7b}'+
    '#'+MODAL_ID+'{position:fixed;inset:0;z-index:2147483646;display:none;align-items:center;justify-content:center;padding:20px;background:rgba(2,8,23,.78);backdrop-filter:blur(5px)}#'+MODAL_ID+'.show{display:flex}'+
    '#'+MODAL_ID+' .cem-card{width:min(440px,100%);background:#0d1727;color:#f1f5fb;border:1px solid #334760;border-radius:16px;padding:22px;box-shadow:0 24px 70px rgba(0,0,0,.5)}'+
    '#'+MODAL_ID+' h3{margin:0 0 6px;font-size:19px}#'+MODAL_ID+' p{margin:0 0 16px;color:#a9b8cd;font-size:13px}#'+MODAL_ID+' input{width:100%;border:1px solid #334760;background:#08111e;color:#fff;border-radius:10px;padding:12px;margin-bottom:10px}'+
    '#'+MODAL_ID+' .cem-actions{display:flex;justify-content:flex-end;gap:8px;margin-top:14px}#'+MODAL_ID+' button{border:1px solid #334760;background:#111d2f;color:#fff;border-radius:9px;padding:9px 12px;font-weight:750}#'+MODAL_ID+' .primary{background:#6d5dfc;border-color:#6d5dfc}#centralEditorLoginMsgV3{min-height:18px;color:#f6c85f;font-size:12px}'+
    '@media(max-width:700px){#'+BTN_ID+'{right:10px;bottom:10px}#'+TOOLBAR_ID+'{left:10px;right:10px;bottom:62px;transform:none;max-width:none;flex-wrap:wrap}.central-editor-status-v2{flex:1 1 100%;min-width:0}}';
  document.head.appendChild(style);
  var btn=document.createElement('button');btn.id=BTN_ID;btn.type='button';btn.textContent='✏ Modo Editor';btn.addEventListener('click',requestActivate);document.body.appendChild(btn);
  var tb=document.createElement('div');tb.id=TOOLBAR_ID;tb.innerHTML='<span id="centralEditorStatusV3" class="central-editor-status-v2">Editor</span><button type="button" class="save" id="centralEditorSaveV3">💾 Salvar online</button><button type="button" id="centralEditorRefreshV3">↻ Atualizar campos</button><button type="button" id="centralEditorExitV3">Sair</button>';document.body.appendChild(tb);
  var modal=document.createElement('div');modal.id=MODAL_ID;modal.innerHTML='<div class="cem-card" role="dialog" aria-modal="true" aria-labelledby="centralEditorLoginTitleV3"><h3 id="centralEditorLoginTitleV3">Modo Editor</h3><p>Somente alterações autorizadas são gravadas no site.</p><input id="centralEditorPasswordV3" type="password" autocomplete="current-password" placeholder="Chave de administração"><div id="centralEditorLoginMsgV3">Digite a chave de administração para ativar o editor.</div><div class="cem-actions"><button type="button" id="centralEditorCancelV3">Cancelar</button><button type="button" class="primary" id="centralEditorEnterV3">Entrar</button></div></div>';document.body.appendChild(modal);
  document.getElementById('centralEditorSaveV3').onclick=save;
  document.getElementById('centralEditorRefreshV3').onclick=refreshEditable;
  document.getElementById('centralEditorExitV3').onclick=deactivate;
  document.getElementById('centralEditorCancelV3').onclick=hideLogin;
  document.getElementById('centralEditorEnterV3').onclick=submitLogin;
  document.getElementById('centralEditorPasswordV3').addEventListener('keydown',function(e){if(e.key==='Enter')submitLogin()});
}
function boot(){
  injectUi();watchDoc(document);applyOverrides(document,true);scanFrames();
  var timer=null;
  try{
    new MutationObserver(function(){
      scanFrames();clearTimeout(timer);timer=setTimeout(function(){applyOverrides(document,false);if(state.active)refreshEditable()},220);
    }).observe(document.body,{childList:true,subtree:true});
  }catch(_){}
  window.addEventListener('focus',function(){scanFrames();if(state.active)refreshEditable()});
}
window.CentralEditorV3={open:requestActivate,save:save,refresh:refreshEditable};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();