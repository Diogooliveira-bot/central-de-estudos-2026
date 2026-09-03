(function(){
'use strict';
var VERSION='6688',DB='anki-offline-tauanne-v1',HIDDEN='central-v6:anki-hidden-decks',CUSTOM='central-v6:anki-custom-decks';
function norm(s){return String(s||'').trim().toLocaleLowerCase('pt-BR')}
function sameOrChild(deck,target){var d=norm(deck),t=norm(target);return !!t&&(d===t||d.indexOf(t+'::')===0)}
function hidden(){try{return JSON.parse(localStorage.getItem(HIDDEN)||'[]')}catch(_){return[]}}
function setHidden(a){var out=[];a.forEach(function(x){if(x&&!out.some(function(y){return norm(y)===norm(x)}))out.push(x)});localStorage.setItem(HIDDEN,JSON.stringify(out.sort(function(a,b){return a.localeCompare(b,'pt-BR',{numeric:true})})))}
function custom(){try{return JSON.parse(localStorage.getItem(CUSTOM)||'[]')}catch(_){return[]}}
function setCustom(a){var out=[];a.forEach(function(x){if(x&&!out.some(function(y){return norm(y)===norm(x)}))out.push(x)});localStorage.setItem(CUSTOM,JSON.stringify(out.sort(function(a,b){return a.localeCompare(b,'pt-BR',{numeric:true})})))}
function openDB(){return new Promise(function(ok,no){var r=indexedDB.open(DB,1);r.onsuccess=function(){ok(r.result)};r.onerror=function(){no(r.error)}})}
function getAll(d){return new Promise(function(ok,no){var tx=d.transaction('cards','readonly'),r=tx.objectStore('cards').getAll();r.onsuccess=function(){ok(r.result||[])};r.onerror=function(){no(r.error)}})}
async function normalizePreviouslyDeleted(){
 try{
  var d=await openDB(),cards=await getAll(d),fix=[];
  cards.forEach(function(c){if(c&&c.suspended&&c.centralDeletedDeck&&c.deck&&sameOrChild(c.deck,c.centralDeletedDeck))fix.push(c)});
  if(!fix.length)return 0;
  await new Promise(function(ok,no){var tx=d.transaction('cards','readwrite'),st=tx.objectStore('cards');fix.forEach(function(c){c.centralOriginalDeck=c.centralOriginalDeck||c.deck;c.deck='';c.modifiedAt=Date.now();st.put(c)});tx.oncomplete=ok;tx.onerror=function(){no(tx.error)}});
  return fix.length;
 }catch(_){return 0}
}
async function deleteDeck(target){
 target=String(target||'').trim();if(!target)throw Error('Selecione um baralho.');
 var d=await openDB(),cards=await getAll(d),affected=[];
 cards.forEach(function(c){var deck=(c&&c.deck)||'';if(deck&&sameOrChild(deck,target))affected.push(c)});
 await new Promise(function(ok,no){var tx=d.transaction('cards','readwrite'),st=tx.objectStore('cards');affected.forEach(function(c){c.centralOriginalDeck=c.centralOriginalDeck||c.deck;c.centralDeletedDeck=target;c.suspended=true;c.deck='';c.modifiedAt=Date.now();st.put(c)});tx.oncomplete=ok;tx.onerror=function(){no(tx.error)}});
 setCustom(custom().filter(function(x){return !sameOrChild(x,target)}));
 var h=hidden();h.push(target);setHidden(h);
 return affected.length;
}
function deckFromButton(bt){
 var oc=bt&&bt.getAttribute('onclick')||'',m=oc.match(/ankiDuoSelectDeck\('((?:\\'|[^'])*)'\)/);if(m)return m[1].replace(/\\'/g,"'");
 return bt?bt.textContent.trim():'';
}
function hideDeletedRows(){
 var hs=hidden();document.querySelectorAll('.anki-duo-table-row').forEach(function(row){var bt=row.querySelector('.anki-duo-deckbutton');if(!bt)return;var deck=deckFromButton(bt);var hide=hs.some(function(x){return sameOrChild(deck,x)});row.style.display=hide?'none':''});
}
function wireDeleteButton(){
 var modal=document.getElementById('cadm-modal');if(!modal)return;var btn=modal.querySelector('#cadm-delete');if(!btn||btn.dataset.fix6688)return;btn.dataset.fix6688='1';
 btn.onclick=async function(){var sel=modal.querySelector('#cadm-deck'),target=sel&&sel.value,st=modal.querySelector('#cadm-ds');if(!target){if(st)st.textContent='Selecione um baralho.';return}if(!confirm('Excluir “'+target+'”? Somente esse baralho/subbaralho e os filhos dele serão removidos.'))return;if(st)st.textContent='Excluindo...';try{var n=await deleteDeck(target);if(st)st.textContent='Excluído ('+n+' cartões). Atualizando...';hideDeletedRows();setTimeout(function(){location.reload()},450)}catch(e){if(st)st.textContent='Erro: '+(e&&e.message?e.message:String(e))}};
}
function patchApi(){if(window.centralAnkiDeckManager)window.centralAnkiDeckManager.deleteDeck=deleteDeck}
async function boot(){await normalizePreviouslyDeleted();patchApi();wireDeleteButton();hideDeletedRows();var obs=new MutationObserver(function(){patchApi();wireDeleteButton();hideDeletedRows()});obs.observe(document.documentElement,{childList:true,subtree:true})}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
window.centralAnkiDeckDeleteFix={version:VERSION,deleteDeck:deleteDeck,repair:normalizePreviouslyDeleted};
})();
