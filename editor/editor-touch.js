(function(){
'use strict';
if(window.__centralEditorTouchV1)return;window.__centralEditorTouchV1=true;

var CACHE_KEY='central-editor-overrides-v1';
var state={payload:{},revision:0,selected:null,active:!!window.__CENTRAL_EDITOR_REQUESTED__,key:''};
var editableSelector='h1,h2,h3,h4,h5,h6,p,a,button,label,li,td,th,.card,[class*="card"],[class*="tile"],[class*="module"],[class*="disciplina"]';

function qs(s,r){return (r||document).querySelector(s)}
function esc(v){return window.CSS&&CSS.escape?CSS.escape(v):String(v).replace(/(["\\.#:[\]()])/g,'\\$1')}
function textOf(el){return String(el&&el.textContent||'').replace(/\s+/g,' ').trim()}
function visible(el){if(!el||!el.getBoundingClientRect)return false;var r=el.getBoundingClientRect(),s=getComputedStyle(el);return r.width>6&&r.height>6&&s.display!=='none'&&s.visibility!=='hidden'}
function nth(el){var i=1,p=el;while((p=p.previousElementSibling))if(p.tagName===el.tagName)i++;return i}
function pathFor(el){
 if(el.id)return '#'+esc(el.id);
 var parts=[],cur=el,limit=0;
 while(cur&&cur!==document.body&&limit++<7){
  if(cur.id){parts.unshift('#'+esc(cur.id));break}
  var part=cur.tagName.toLowerCase()+':nth-of-type('+nth(cur)+')';
  parts.unshift(part);cur=cur.parentElement;
 }
 return 'body>'+parts.join('>');
}
function locatorFor(el){
 return {id:el.id||'',path:pathFor(el),tag:(el.tagName||'').toLowerCase(),classes:Array.from(el.classList||[]).slice(0,8),originalText:textOf(el).slice(0,1000)}
}
function keyFor(loc){
 var s=[loc.id,loc.path,loc.tag,(loc.classes||[]).join('.'),loc.originalText].join('|'),h=2166136261;
 for(var i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619)}
 return 'ce-'+(h>>>0).toString(16);
}
function locate(loc){
 if(!loc)return null;
 if(loc.id){var byId=document.getElementById(loc.id);if(byId)return byId}
 if(loc.path){try{var byPath=document.querySelector(loc.path);if(byPath)return byPath}catch(_){}}
 var candidates=Array.from(document.querySelectorAll(loc.tag||'*')).filter(visible);
 var target=(loc.originalText||'').trim();
 if(target){
  var exact=candidates.find(function(el){return textOf(el)===target});if(exact)return exact;
 }
 if(loc.classes&&loc.classes.length){
  var classMatch=candidates.find(function(el){return loc.classes.every(function(c){return el.classList.contains(c)})});if(classMatch)return classMatch;
 }
 return null;
}
function applyItem(item){
 var el=locate(item.locator);if(!el)return;
 if(typeof item.text==='string'&&textOf(el)!==item.text)el.textContent=item.text;
 if(item.styles)Object.keys(item.styles).forEach(function(k){try{el.style[k]=item.styles[k]}catch(_){}});
 if(item.orderDelta){
  var p=el.parentElement;if(p){
   var kids=Array.from(p.children),idx=kids.indexOf(el),target=Math.max(0,Math.min(kids.length-1,idx+item.orderDelta));
   if(target!==idx){if(target>idx)p.insertBefore(el,kids[target].nextSibling);else p.insertBefore(el,kids[target])}
  }
 }
}
function applyAll(){Object.keys(state.payload||{}).forEach(function(k){applyItem(state.payload[k])})}
async function load(){
 try{
  var r=await fetch('/api/editor',{cache:'no-store'});if(!r.ok)throw new Error('HTTP '+r.status);
  var j=await r.json();state.payload=j.payload||{};state.revision=Number(j.revision||0);localStorage.setItem(CACHE_KEY,JSON.stringify({payload:state.payload,revision:state.revision}));
 }catch(_){
  try{var c=JSON.parse(localStorage.getItem(CACHE_KEY)||'{}');state.payload=c.payload||{};state.revision=Number(c.revision||0)}catch(__){}
 }
 applyAll();setTimeout(applyAll,800);setTimeout(applyAll,2200);
}
function toast(msg){var t=qs('#centralEditorToast');if(!t)return;t.textContent=msg;t.hidden=false;clearTimeout(t._timer);t._timer=setTimeout(function(){t.hidden=true},2400)}
function getExistingSecret(){
 return new Promise(function(resolve){
  try{var r=indexedDB.open('central-sync-device-v1',1);r.onsuccess=function(){try{var tx=r.result.transaction('kv','readonly'),g=tx.objectStore('kv').get('secret');g.onsuccess=function(){resolve(String(g.result||''))};g.onerror=function(){resolve('')}}catch(_){resolve('')}};r.onerror=function(){resolve('')}}catch(_){resolve('')}
 })
}
async function editorKey(){
 if(state.key)return state.key;
 state.key=await getExistingSecret();
 if(state.key)return state.key;
 var entered=window.prompt('Digite a chave do editor:','')||'';state.key=entered.trim();return state.key;
}
async function saveCloud(){
 var key=await editorKey();if(!key){toast('Chave do editor não informada');return false}
 var r=await fetch('/api/editor',{method:'POST',headers:{'Content-Type':'application/json','X-Editor-Key':key},body:JSON.stringify({payload:state.payload,baseRevision:state.revision})});
 var txt=await r.text(),j={};try{j=txt?JSON.parse(txt):{}}catch(_){}
 if(r.status===409){toast('Há alteração mais recente. Recarregue antes de salvar.');return false}
 if(!r.ok){if(r.status===401)state.key='';toast(j.error||('Falha ao salvar: '+r.status));return false}
 state.revision=Number(j.revision||state.revision+1);localStorage.setItem(CACHE_KEY,JSON.stringify({payload:state.payload,revision:state.revision}));toast('Alteração salva na nuvem');return true;
}
function closestEditable(target){
 if(!target||!target.closest)return null;
 var el=target.closest(editableSelector);
 if(!el||el.closest('#centralEditorTopbar,#centralEditorSheet,#centralEditorFab,#centralEditorToast'))return null;
 return visible(el)?el:null;
}
function itemFor(el){
 var loc=locatorFor(el),key=keyFor(loc),item=state.payload[key];
 if(!item){item={locator:loc,styles:{}};state.payload[key]=item}
 return {key:key,item:item};
}
function select(el){
 if(state.selected)state.selected.classList.remove('central-editor-selected');
 state.selected=el;if(!el)return;
 el.classList.add('central-editor-selected');openSheet(el);
}
function openSheet(el){
 var ref=itemFor(el),item=ref.item,s=qs('#centralEditorSheet');s.hidden=false;s.dataset.key=ref.key;
 qs('#ceText').value=typeof item.text==='string'?item.text:textOf(el);
 var cs=getComputedStyle(el);
 qs('#ceFontSize').value=parseInt(item.styles.fontSize||cs.fontSize)||16;
 qs('#ceWeight').value=item.styles.fontWeight||cs.fontWeight||'400';
 qs('#ceAlign').value=item.styles.textAlign||cs.textAlign||'left';
 qs('#ceColor').value=rgbToHex(item.styles.color||cs.color)||'#ffffff';
 qs('#ceBg').value=rgbToHex(item.styles.backgroundColor||cs.backgroundColor)||'#111d2f';
}
function rgbToHex(v){
 if(!v)return'';if(/^#[0-9a-f]{6}$/i.test(v))return v;
 var m=String(v).match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/i);if(!m)return'';
 return '#'+[m[1],m[2],m[3]].map(function(n){return Number(n).toString(16).padStart(2,'0')}).join('');
}
function updateSelected(saveText){
 var el=state.selected;if(!el)return;
 var key=qs('#centralEditorSheet').dataset.key,item=state.payload[key];if(!item)return;
 if(saveText){item.text=qs('#ceText').value;el.textContent=item.text}
 item.styles=item.styles||{};
 item.styles.fontSize=qs('#ceFontSize').value+'px';
 item.styles.fontWeight=qs('#ceWeight').value;
 item.styles.textAlign=qs('#ceAlign').value;
 item.styles.color=qs('#ceColor').value;
 item.styles.backgroundColor=qs('#ceBg').value;
 applyItem(item);
}
function move(delta){
 var el=state.selected;if(!el||!el.parentElement)return;
 var key=qs('#centralEditorSheet').dataset.key,item=state.payload[key];item.orderDelta=(item.orderDelta||0)+delta;
 var p=el.parentElement,kids=Array.from(p.children),idx=kids.indexOf(el),target=Math.max(0,Math.min(kids.length-1,idx+delta));
 if(target===idx)return;if(target>idx)p.insertBefore(el,kids[target].nextSibling);else p.insertBefore(el,kids[target]);
 openSheet(el);
}
function resetSelected(){
 var el=state.selected;if(!el)return;var key=qs('#centralEditorSheet').dataset.key;delete state.payload[key];localStorage.setItem(CACHE_KEY,JSON.stringify({payload:state.payload,revision:state.revision}));toast('Alteração local removida; recarregue para ver o original');
}
function activate(){
 state.active=true;document.body.classList.add('central-editor-active');qs('#centralEditorTopbar').hidden=false;qs('#centralEditorFab').hidden=true;toast('Modo editor ativado');
}
function deactivate(){
 state.active=false;document.body.classList.remove('central-editor-active');qs('#centralEditorTopbar').hidden=true;qs('#centralEditorFab').hidden=false;qs('#centralEditorSheet').hidden=true;if(state.selected)state.selected.classList.remove('central-editor-selected');state.selected=null;
}
function buildUi(){
 var fab=document.createElement('button');fab.id='centralEditorFab';fab.type='button';fab.textContent='✏️';fab.title='Editar página';fab.hidden=!state.active;document.body.appendChild(fab);
 var top=document.createElement('div');top.id='centralEditorTopbar';top.hidden=!state.active;top.innerHTML='<div class="ce-title">Editor Visual • Tablet</div><button id="ceClose" type="button">Sair</button><button id="ceSaveTop" class="ce-primary" type="button">Salvar</button>';document.body.appendChild(top);
 var sheet=document.createElement('section');sheet.id='centralEditorSheet';sheet.hidden=true;sheet.innerHTML='<div class="ce-handle"></div><label>Texto<textarea id="ceText"></textarea></label><div class="ce-row"><label>Tamanho<input id="ceFontSize" type="number" min="10" max="72" step="1"></label><label>Peso<select id="ceWeight"><option value="400">Normal</option><option value="500">Médio</option><option value="600">Semibold</option><option value="700">Negrito</option><option value="800">Extra</option></select></label></div><div class="ce-row"><label>Alinhamento<select id="ceAlign"><option value="left">Esquerda</option><option value="center">Centro</option><option value="right">Direita</option><option value="justify">Justificado</option></select></label><label>Cor do texto<input id="ceColor" type="color"></label></div><div class="ce-row"><label>Fundo<input id="ceBg" type="color"></label><div></div></div><div class="ce-row three"><button id="ceUp" type="button">↑ Subir</button><button id="ceDown" type="button">↓ Descer</button><button id="ceReset" type="button">Restaurar</button></div><div class="ce-actions"><button id="ceApply" type="button">Aplicar</button><button id="ceSave" class="ce-primary" type="button">Salvar na nuvem</button><button id="ceDismiss" type="button">Fechar</button></div>';document.body.appendChild(sheet);
 var toastEl=document.createElement('div');toastEl.id='centralEditorToast';toastEl.hidden=true;document.body.appendChild(toastEl);
 fab.onclick=activate;qs('#ceClose').onclick=deactivate;qs('#ceSaveTop').onclick=function(){saveCloud()};qs('#ceApply').onclick=function(){updateSelected(true);toast('Aplicado nesta página')};qs('#ceSave').onclick=async function(){updateSelected(true);await saveCloud()};qs('#ceDismiss').onclick=function(){sheet.hidden=true;if(state.selected)state.selected.classList.remove('central-editor-selected');state.selected=null};qs('#ceUp').onclick=function(){move(-1)};qs('#ceDown').onclick=function(){move(1)};qs('#ceReset').onclick=resetSelected;
 ['#ceFontSize','#ceWeight','#ceAlign','#ceColor','#ceBg'].forEach(function(id){qs(id).addEventListener('input',function(){updateSelected(false)})});
 document.addEventListener('click',function(e){if(!state.active)return;var el=closestEditable(e.target);if(!el)return;e.preventDefault();e.stopPropagation();select(el)},true);
 if(state.active)activate();
}
function boot(){buildUi();load();var mo=new MutationObserver(function(){applyAll()});mo.observe(document.documentElement,{childList:true,subtree:true});setTimeout(function(){mo.disconnect()},10000)}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();
