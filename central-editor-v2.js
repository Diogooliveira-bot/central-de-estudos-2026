(function(){
'use strict';
if(window.__centralEditorV2)return;window.__centralEditorV2=true;

var API='/api/editor';
var SESSION_KEY='central-editor-v2:secret';
var BTN_ID='centralEditorToggleV2';
var TOOLBAR_ID='centralEditorToolbarV2';
var MODAL_ID='centralEditorLoginV2';
var CANDIDATE_ATTR='data-central-editor-v2';
var SELECTOR_ATTR='data-central-editor-selector-v2';
var PAGE_ATTR='data-central-editor-page-v2';
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
function isCandidate(el){
  if(!el||!el.isConnected||!visible(el))return false;
  if(el.closest&&el.closest('#'+TOOLBAR_ID+',#'+BTN_ID+',#'+MODAL_ID+',nav,aside,.sidebar,.central-settings,.central-settings-backdrop'))return false;
  if(el.matches('button,input,textarea,select,option,script,style,a,svg,path,iframe'))return false;
  if(el.querySelector('button,input,textarea,select,iframe,video,audio'))return false;
  var text=String(el.textContent||'').trim();
  if(text.length<2)return false;
  return true;
}
function candidateElements(doc){
  var selector=[
    '[data-editor-text]','h1','h2','h3','h4','h5','h6','p','li','td','th','blockquote','figcaption',
    '.card-title','.card-text','.title','.subtitle','.section-title','.topic-title',
    '.civil-step-title b','.civil-step-title small','.civil-scope-note','.civil-anki-note',
    '.theory-title','.theory-subtitle','.theory-text','.theory-section p',
    '.module-title','.module-subtitle','.module-content p','.module-content li',
    '.content-card p','.content-card li','.content-card h3','.content-card h4'
  ].join(',');
  var out=[];
  editableScopes(doc).forEach(function(scope){
    try{
      scope.querySelectorAll(selector).forEach(function(el){
        if(isCandidate(el)&&out.indexOf(el)<0)out.push(el);
      });
    }catch(_){}
  });
  return out;
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
  }catch(e){console.warn('[Editor v2] leitura',page,e);return []}
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
  el.classList.add('central-editor-dirty-v2');
  status(state.dirty.size+' alteração(ões) não salva(s)','warn');
}
function injectDocStyle(doc){
  if(doc.getElementById('centralEditorStyleV2'))return;
  var st=doc.createElement('style');st.id='centralEditorStyleV2';st.textContent=
    '['+CANDIDATE_ATTR+'="1"]{outline:1px dashed rgba(124,92,255,.6)!important;outline-offset:3px;border-radius:3px;cursor:text}'+
    '['+CANDIDATE_ATTR+'="1"]:hover,['+CANDIDATE_ATTR+'="1"]:focus{outline:2px solid #7c5cff!important;background:rgba(124,92,255,.10)!important}'+
    '.central-editor-dirty-v2{outline:2px solid #f59e0b!important;background:rgba(245,158,11,.10)!important}';
  (doc.head||doc.documentElement).appendChild(st);
}
function enableDoc(doc){
  if(!doc||!doc.body)return 0;state.docs.add(doc);injectDocStyle(doc);
  var count=0;
  candidateElements(doc).forEach(function(el){
    if(el.getAttribute(CANDIDATE_ATTR)!=='1'){
      var selector=cssPath(el,doc);if(!selector)return;
      el.setAttribute(CANDIDATE_ATTR,'1');
      el.setAttribute(SELECTOR_ATTR,selector);
      el.setAttribute(PAGE_ATTR,pageKey(doc));
      el.setAttribute('contenteditable','true');el.setAttribute('spellcheck','true');
      el.addEventListener('input',function(){markDirty(el,doc)});
      el.addEventListener('paste',function(){setTimeout(function(){markDirty(el,doc)},0)});
    }
    count++;
  });
  return count;
}
function disableDoc(doc){
  if(!doc||!doc.body)return;
  try{doc.querySelectorAll('['+CANDIDATE_ATTR+'="1"]').forEach(function(el){
    el.removeAttribute('contenteditable');el.removeAttribute('spellcheck');el.removeAttribute(CANDIDATE_ATTR);
    el.classList.remove('central-editor-dirty-v2');
  })}catch(_){}
}
function watchDoc(doc){
  if(!doc||!doc.body||doc.__centralEditorWatchV2)return;doc.__centralEditorWatchV2=true;state.docs.add(doc);
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
    if(frame.__centralEditorBoundV2)return;frame.__centralEditorBoundV2=true;
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
  else status('Editor ativo, mas não encontrei texto editável nesta tela. Abra um módulo e tente novamente.','warn');
  return total;
}
function status(msg,type){
  var el=document.getElementById('centralEditorStatusV2');if(!el)return;
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
  var m=document.getElementById(MODAL_ID),input=document.getElementById('centralEditorPasswordV2'),msg=document.getElementById('centralEditorLoginMsgV2');
  if(msg)msg.textContent='Digite a chave de administração para ativar o editor.';
  if(input)input.value='';
  if(m)m.classList.add('show');
  setTimeout(function(){try{input.focus()}catch(_){}},50);
}
async function submitLogin(){
  var input=document.getElementById('centralEditorPasswordV2'),msg=document.getElementById('centralEditorLoginMsgV2');
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
      if(entry&&entry.el)entry.el.classList.remove('central-editor-dirty-v2');
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
    '#'+MODAL_ID+' .cem-actions{display:flex;justify-content:flex-end;gap:8px;margin-top:14px}#'+MODAL_ID+' button{border:1px solid #334760;background:#111d2f;color:#fff;border-radius:9px;padding:9px 12px;font-weight:750}#'+MODAL_ID+' .primary{background:#6d5dfc;border-color:#6d5dfc}#centralEditorLoginMsgV2{min-height:18px;color:#f6c85f;font-size:12px}'+
    '@media(max-width:700px){#'+BTN_ID+'{right:10px;bottom:10px}#'+TOOLBAR_ID+'{left:10px;right:10px;bottom:62px;transform:none;max-width:none;flex-wrap:wrap}.central-editor-status-v2{flex:1 1 100%;min-width:0}}';
  document.head.appendChild(style);
  var btn=document.createElement('button');btn.id=BTN_ID;btn.type='button';btn.textContent='✏ Modo Editor';btn.addEventListener('click',requestActivate);document.body.appendChild(btn);
  var tb=document.createElement('div');tb.id=TOOLBAR_ID;tb.innerHTML='<span id="centralEditorStatusV2" class="central-editor-status-v2">Editor</span><button type="button" class="save" id="centralEditorSaveV2">💾 Salvar online</button><button type="button" id="centralEditorRefreshV2">↻ Detectar textos</button><button type="button" id="centralEditorExitV2">Sair</button>';document.body.appendChild(tb);
  var modal=document.createElement('div');modal.id=MODAL_ID;modal.innerHTML='<div class="cem-card" role="dialog" aria-modal="true" aria-labelledby="centralEditorLoginTitleV2"><h3 id="centralEditorLoginTitleV2">Modo Editor</h3><p>Somente alterações autorizadas são gravadas no site.</p><input id="centralEditorPasswordV2" type="password" autocomplete="current-password" placeholder="Chave de administração"><div id="centralEditorLoginMsgV2">Digite a chave de administração para ativar o editor.</div><div class="cem-actions"><button type="button" id="centralEditorCancelV2">Cancelar</button><button type="button" class="primary" id="centralEditorEnterV2">Entrar</button></div></div>';document.body.appendChild(modal);
  document.getElementById('centralEditorSaveV2').onclick=save;
  document.getElementById('centralEditorRefreshV2').onclick=refreshEditable;
  document.getElementById('centralEditorExitV2').onclick=deactivate;
  document.getElementById('centralEditorCancelV2').onclick=hideLogin;
  document.getElementById('centralEditorEnterV2').onclick=submitLogin;
  document.getElementById('centralEditorPasswordV2').addEventListener('keydown',function(e){if(e.key==='Enter')submitLogin()});
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
window.CentralEditorV2={open:requestActivate,save:save,refresh:refreshEditable};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();