(function(){
'use strict';
if(window.__centralEditorV1)return;window.__centralEditorV1=true;

var state={active:false,secret:'',dirty:new Map(),docs:new Set(),cache:new Map(),applying:false};
var API='/api/editor';
var SESSION_KEY='central-editor:session-secret';
var SHARED_SECRET_KEY='central-backup:session-secret';
var TOOLBAR_ID='centralEditorToolbarV1';
var BTN_ID='centralEditorToggleV1';
var CANDIDATE_ATTR='data-central-editor-candidate';
var SELECTOR_ATTR='data-central-editor-selector';
var PAGE_ATTR='data-central-editor-page';

function escCss(value){
  if(window.CSS&&typeof window.CSS.escape==='function')return window.CSS.escape(String(value));
  return String(value).replace(/[^a-zA-Z0-9_-]/g,function(ch){return '\\'+ch.charCodeAt(0).toString(16)+' '});
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
function contextLabel(doc){
  try{
    if(doc!==document)return '';
    var crumb=doc.getElementById('crumb');
    var txt=String(crumb&&crumb.textContent||'').trim().replace(/\s+/g,' ').slice(0,160);
    return txt&&txt.toLowerCase()!=='início'?'|ctx='+txt:'';
  }catch(_){return ''}
}
function pageKey(doc){
  try{
    var u=new URL(doc.location.href);
    return (u.pathname||'/')+contextLabel(doc);
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
  while(node&&node.nodeType===1&&node!==doc.body&&guard++<18){
    var idSel=uniqueIdSelector(node,doc);
    if(idSel){parts.unshift(idSel);break}
    var tag=String(node.tagName||'div').toLowerCase();
    var parent=node.parentElement;
    if(!parent){parts.unshift(tag);break}
    var same=Array.from(parent.children).filter(function(x){return x.tagName===node.tagName});
    var nth=same.indexOf(node)+1;
    parts.unshift(tag+(same.length>1?':nth-of-type('+nth+')':''));
    node=parent;
  }
  return parts.join(' > ');
}
function editableScopes(doc){
  if(doc!==document)return [doc.body];
  var mv=doc.getElementById('moduleView');
  if(mv&&!mv.classList.contains('hidden'))return [mv];
  return [];
}
function isCandidate(el){
  if(!el||!el.isConnected)return false;
  if(el.closest&&el.closest('#'+TOOLBAR_ID+',#'+BTN_ID))return false;
  if(el.matches('button,input,textarea,select,option,script,style,nav,aside'))return false;
  if(el.querySelector('button,input,textarea,select,iframe,video,audio'))return false;
  var text=String(el.textContent||'').trim();
  if(text.length<2)return false;
  return true;
}
function candidateElements(doc){
  var out=[];
  editableScopes(doc).forEach(function(scope){
    scope.querySelectorAll('h1,h2,h3,h4,h5,h6,p,li,td,th,blockquote,figcaption,.card-title,.card-text,.title,.subtitle,.section-title,.topic-title,[data-editor-text]').forEach(function(el){
      if(isCandidate(el)&&out.indexOf(el)<0)out.push(el);
    });
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
    state.cache.set(page,list);
    return list;
  }catch(e){
    console.warn('[Editor] falha ao carregar alterações',page,e);
    return [];
  }
}
async function applyOverrides(doc,force){
  if(!doc||!doc.body)return;
  var list=await fetchOverrides(doc,force);
  state.applying=true;
  try{
    list.forEach(function(item){
      try{
        var el=doc.querySelector(item.selector);
        if(!el)return;
        var dirtyKey=pageKey(doc)+'@@'+item.selector;
        if(state.dirty.has(dirtyKey))return;
        var html=sanitizeHtml(item.html);
        if(el.innerHTML!==html)el.innerHTML=html;
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
  el.classList.add('central-editor-dirty-v1');
  updateStatus(state.dirty.size+' alteração(ões) não salva(s)','warn');
}
function enableDoc(doc){
  if(!doc||!doc.body)return;
  state.docs.add(doc);
  candidateElements(doc).forEach(function(el){
    if(el.getAttribute(CANDIDATE_ATTR)==='1')return;
    var selector=cssPath(el,doc);if(!selector)return;
    el.setAttribute(CANDIDATE_ATTR,'1');
    el.setAttribute(SELECTOR_ATTR,selector);
    el.setAttribute(PAGE_ATTR,pageKey(doc));
    el.setAttribute('contenteditable','true');
    el.setAttribute('spellcheck','true');
    el.addEventListener('input',function(){markDirty(el,doc)});
    el.addEventListener('paste',function(){setTimeout(function(){markDirty(el,doc)},0)});
  });
  injectEditorStyle(doc);
}
function disableDoc(doc){
  if(!doc||!doc.body)return;
  try{
    doc.querySelectorAll('['+CANDIDATE_ATTR+'="1"]').forEach(function(el){
      el.removeAttribute('contenteditable');
      el.removeAttribute('spellcheck');
      el.removeAttribute(CANDIDATE_ATTR);
      el.classList.remove('central-editor-dirty-v1');
    });
  }catch(_){}
}
function injectEditorStyle(doc){
  if(doc.getElementById('centralEditorStyleV1'))return;
  var st=doc.createElement('style');st.id='centralEditorStyleV1';st.textContent=
    '['+CANDIDATE_ATTR+'="1"]{outline:1px dashed rgba(124,92,255,.45);outline-offset:3px;border-radius:3px;cursor:text;transition:outline-color .15s,background .15s}'+
    '['+CANDIDATE_ATTR+'="1"]:hover,['+CANDIDATE_ATTR+'="1"]:focus{outline:2px solid #7c5cff;background:rgba(124,92,255,.08)}'+
    '.central-editor-dirty-v1{outline-color:#f59e0b!important;background:rgba(245,158,11,.08)!important}';
  (doc.head||doc.documentElement).appendChild(st);
}
function scanFrames(){
  document.querySelectorAll('iframe').forEach(function(frame){
    if(frame.__centralEditorBoundV1)return;frame.__centralEditorBoundV1=true;
    var run=function(){var doc=safeDoc(frame);if(!doc)return;watchDoc(doc);applyOverrides(doc,true);if(state.active)enableDoc(doc)};
    frame.addEventListener('load',function(){setTimeout(run,120)});
    setTimeout(run,80);
  });
}
function watchDoc(doc){
  if(!doc||doc.__centralEditorWatchV1)return;doc.__centralEditorWatchV1=true;state.docs.add(doc);
  var timer=null;
  try{
    var mo=new MutationObserver(function(){
      clearTimeout(timer);timer=setTimeout(function(){applyOverrides(doc,false);if(state.active)enableDoc(doc)},180);
    });
    mo.observe(doc.body,{childList:true,subtree:true});
  }catch(_){}
}
function getSecret(){
  if(state.secret)return state.secret;
  try{state.secret=sessionStorage.getItem(SESSION_KEY)||sessionStorage.getItem(SHARED_SECRET_KEY)||''}catch(_){}
  return state.secret;
}
async function apiPost(body){
  var secret=getSecret();
  if(!secret)throw new Error('Chave do editor não informada');
  var r=await fetch(API,{method:'POST',headers:{'Content-Type':'application/json','X-Backup-Key':secret},body:JSON.stringify(body)});
  var txt=await r.text(),j={};try{j=txt?JSON.parse(txt):{}}catch(_){j={error:txt||('HTTP '+r.status)}}
  if(!r.ok){var e=new Error(j.error||('HTTP '+r.status));e.status=r.status;throw e}
  return j;
}
async function ensureAuthorized(){
  var secret=getSecret();
  if(!secret){
    secret=String(prompt('Digite a chave de administração usada pela Central:')||'').trim();
    if(!secret)return false;
    state.secret=secret;
  }
  try{
    await apiPost({action:'verify'});
    try{sessionStorage.setItem(SESSION_KEY,state.secret)}catch(_){}
    return true;
  }catch(e){
    state.secret='';
    try{sessionStorage.removeItem(SESSION_KEY)}catch(_){}
    alert('Não foi possível ativar o editor: '+e.message);
    return false;
  }
}
function updateStatus(msg,type){
  var el=document.getElementById('centralEditorStatusV1');if(!el)return;
  el.textContent=msg||'';el.className='central-editor-status-v1 '+(type||'');
}
async function save(){
  var changes=Array.from(state.dirty.values()).map(function(x){return {page:x.page,selector:x.selector,html:sanitizeHtml(x.html)}});
  if(!changes.length){updateStatus('Nenhuma alteração pendente.','ok');return}
  updateStatus('Salvando online...','warn');
  try{
    var r=await apiPost({action:'save',changes:changes});
    changes.forEach(function(ch){
      var k=ch.page+'@@'+ch.selector,entry=state.dirty.get(k);
      if(entry&&entry.el)entry.el.classList.remove('central-editor-dirty-v1');
      state.dirty.delete(k);
      state.cache.delete(ch.page);
    });
    updateStatus((r.saved||changes.length)+' alteração(ões) salva(s) online.','ok');
  }catch(e){updateStatus('Falha ao salvar: '+e.message,'err')}
}
async function toggle(){
  if(!state.active){
    if(!(await ensureAuthorized()))return;
    state.active=true;document.body.classList.add('central-editor-active-v1');
    state.docs.forEach(enableDoc);scanFrames();enableDoc(document);
    document.getElementById(BTN_ID).textContent='✓ Editor ativo';
    showToolbar(true);updateStatus('Clique no texto para editar. Depois use Salvar.','ok');
  }else{
    if(state.dirty.size&&!confirm('Existem alterações não salvas. Sair do editor e descartá-las?'))return;
    state.active=false;document.body.classList.remove('central-editor-active-v1');
    state.docs.forEach(disableDoc);disableDoc(document);state.dirty.clear();
    document.getElementById(BTN_ID).textContent='✏ Modo Editor';
    showToolbar(false);
    state.docs.forEach(function(doc){applyOverrides(doc,true)});
  }
}
function showToolbar(show){
  var tb=document.getElementById(TOOLBAR_ID);if(tb)tb.style.display=show?'flex':'none';
}
function injectUi(){
  if(document.getElementById(BTN_ID))return;
  var style=document.createElement('style');style.textContent=
    '#'+BTN_ID+'{position:fixed;right:18px;bottom:18px;z-index:2147483000;border:1px solid #6d5dfc;background:#6d5dfc;color:#fff;border-radius:12px;padding:11px 14px;font-weight:800;box-shadow:0 10px 30px rgba(0,0,0,.28)}'+
    '#'+TOOLBAR_ID+'{position:fixed;left:50%;bottom:16px;transform:translateX(-50%);z-index:2147482999;display:none;align-items:center;gap:8px;max-width:calc(100vw - 190px);background:#0d1727;color:#f1f5fb;border:1px solid #334760;border-radius:14px;padding:8px 10px;box-shadow:0 12px 36px rgba(0,0,0,.35)}'+
    '#'+TOOLBAR_ID+' button{border:1px solid #334760;background:#111d2f;color:#f1f5fb;border-radius:9px;padding:8px 11px;font-weight:750}'+
    '#'+TOOLBAR_ID+' .save{background:#6d5dfc;border-color:#6d5dfc;color:#fff}'+
    '.central-editor-status-v1{font-size:12px;color:#a9b8cd;min-width:180px}.central-editor-status-v1.ok{color:#66d99a}.central-editor-status-v1.warn{color:#f6c85f}.central-editor-status-v1.err{color:#ff7b7b}'+
    '@media(max-width:700px){#'+BTN_ID+'{right:10px;bottom:10px}#'+TOOLBAR_ID+'{left:10px;right:10px;bottom:62px;transform:none;max-width:none;flex-wrap:wrap}.central-editor-status-v1{flex:1 1 100%;min-width:0}}';
  document.head.appendChild(style);
  var btn=document.createElement('button');btn.id=BTN_ID;btn.type='button';btn.textContent='✏ Modo Editor';btn.onclick=toggle;document.body.appendChild(btn);
  var tb=document.createElement('div');tb.id=TOOLBAR_ID;tb.innerHTML='<span id="centralEditorStatusV1" class="central-editor-status-v1">Editor ativo</span><button type="button" class="save" id="centralEditorSaveV1">💾 Salvar online</button><button type="button" id="centralEditorExitV1">Sair</button>';
  document.body.appendChild(tb);
  document.getElementById('centralEditorSaveV1').onclick=save;
  document.getElementById('centralEditorExitV1').onclick=toggle;
}
function boot(){
  injectUi();watchDoc(document);applyOverrides(document,true);scanFrames();
  var mo=new MutationObserver(function(){scanFrames();clearTimeout(boot._t);boot._t=setTimeout(function(){applyOverrides(document,false);if(state.active)enableDoc(document)},180)});
  mo.observe(document.body,{childList:true,subtree:true});
  var crumb=document.getElementById('crumb');
  if(crumb){new MutationObserver(function(){state.cache.delete(pageKey(document));setTimeout(function(){applyOverrides(document,true);if(state.active)enableDoc(document)},80)}).observe(crumb,{childList:true,subtree:true,characterData:true})}
  window.addEventListener('focus',function(){scanFrames()});
}
window.CentralEditorV1={toggle:toggle,save:save,apply:function(){return applyOverrides(document,true)}};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();