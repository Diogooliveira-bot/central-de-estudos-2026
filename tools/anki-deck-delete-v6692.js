(function(){
'use strict';
var VERSION='6692';
var DB='anki-offline-tauanne-v1';
var HIDDEN='central-v6:anki-hidden-decks';
var CUSTOM='central-v6:anki-custom-decks';

function norm(s){return String(s||'').trim().toLocaleLowerCase('pt-BR')}
function sameOrChild(deck,target){var d=norm(deck),t=norm(target);return !!t&&(d===t||d.indexOf(t+'::')===0)}
function readList(key){try{var x=JSON.parse(localStorage.getItem(key)||'[]');return Array.isArray(x)?x:[]}catch(_){return[]}}
function writeList(key,a){var out=[];a.forEach(function(x){x=String(x||'').trim();if(x&&!out.some(function(y){return norm(y)===norm(x)}))out.push(x)});out.sort(function(a,b){return a.localeCompare(b,'pt-BR',{numeric:true})});localStorage.setItem(key,JSON.stringify(out))}
function hidden(){return readList(HIDDEN)}
function isHidden(deck){return hidden().some(function(h){return sameOrChild(deck,h)})}

function openDB(){return new Promise(function(ok,no){var r=indexedDB.open(DB,1);r.onsuccess=function(){ok(r.result)};r.onerror=function(){no(r.error||new Error('Não foi possível abrir o banco do Anki.'))}})}

/* Exclusão física. Também remove cartões deixados pelas tentativas antigas,
   identificados por centralDeletedDeck/centralOriginalDeck. */
async function deleteDeckPermanently(target){
 target=String(target||'').trim();
 if(!target)throw Error('Selecione um baralho.');
 var d=await openDB(),count=0;
 await new Promise(function(ok,no){
  var tx=d.transaction('cards','readwrite'),st=tx.objectStore('cards'),req=st.openCursor();
  req.onsuccess=function(e){
   var cur=e.target.result;if(!cur)return;
   var c=cur.value||{};
   var hit=sameOrChild(c.deck,target)||sameOrChild(c.centralDeletedDeck,target)||sameOrChild(c.centralOriginalDeck,target);
   if(hit){cur.delete();count++}
   cur.continue();
  };
  req.onerror=function(){no(req.error||new Error('Falha ao ler os cartões.'))};
  tx.oncomplete=function(){ok()};
  tx.onerror=function(){no(tx.error||new Error('Falha ao excluir os cartões.'))};
  tx.onabort=function(){no(tx.error||new Error('Exclusão cancelada pelo banco.'))};
 });
 try{d.close()}catch(_){}

 /* Remove o baralho personalizado e descendentes. */
 writeList(CUSTOM,readList(CUSTOM).filter(function(x){return !sameOrChild(x,target)}));

 /* Mantém o caminho oculto para impedir que SOURCE.meta.decks o recrie. */
 var hs=hidden();hs.push(target);writeList(HIDDEN,hs);
 try{localStorage.setItem('central-v6:anki-last-deleted-deck',JSON.stringify({deck:target,deletedAt:Date.now(),cards:count,version:VERSION}))}catch(_){}
 return count;
}

function fullDeckFromRow(row){
 if(!row)return '';
 var direct=row.getAttribute('data-full-deck')||row.dataset&&row.dataset.fullDeck||'';
 if(direct)return direct;
 var bt=row.querySelector('.anki-duo-deckbutton');
 if(!bt)return '';
 var bdirect=bt.getAttribute('data-full-deck')||bt.dataset&&bt.dataset.fullDeck||'';
 if(bdirect)return bdirect;
 var oc=bt.getAttribute('onclick')||'';
 var m=oc.match(/ankiDuoSelectDeck\('((?:\\'|[^'])*)'\)/);
 if(m)return m[1].replace(/\\'/g,"'");
 return '';
}

function filterStaticSources(){
 var hs=hidden();
 function keep(d){return !hs.some(function(h){return sameOrChild(d,h)})}
 try{if(window.ANKI_SITE_DATA&&window.ANKI_SITE_DATA.meta&&Array.isArray(window.ANKI_SITE_DATA.meta.decks))window.ANKI_SITE_DATA.meta.decks=window.ANKI_SITE_DATA.meta.decks.filter(keep)}catch(_){}
 try{if(typeof SOURCE!=='undefined'&&SOURCE&&SOURCE.meta&&Array.isArray(SOURCE.meta.decks))SOURCE.meta.decks=SOURCE.meta.decks.filter(keep)}catch(_){}
 try{if(typeof S!=='undefined'&&S&&Array.isArray(S.cards))S.cards=S.cards.filter(function(c){return !(c&&c.deck&&isHidden(c.deck))})}catch(_){}
}

function removeHiddenRows(){
 filterStaticSources();
 document.querySelectorAll('.anki-duo-table-row').forEach(function(row){
  var deck=fullDeckFromRow(row);
  if(deck&&isHidden(deck))row.remove();
 });
 /* Alguns layouts usam data-full-deck fora de .anki-duo-table-row. */
 document.querySelectorAll('[data-full-deck]').forEach(function(el){
  var deck=el.getAttribute('data-full-deck');
  if(deck&&isHidden(deck)){
   var row=el.closest('.anki-duo-table-row');
   if(row)row.remove();
  }
 });
}

function status(modal,msg,bad){
 var st=modal&&modal.querySelector('#cadm-ds');if(st){st.textContent=msg;st.style.color=bad?'#b91c1c':'#166534'}
}

async function runDelete(modal){
 var sel=modal&&modal.querySelector('#cadm-deck');
 var target=sel&&sel.value?String(sel.value).trim():'';
 if(!target){status(modal,'Selecione um baralho.',true);return}
 var warning='Excluir definitivamente “'+target+'”?\n\nSomente este baralho/subbaralho e os filhos dele serão apagados. O baralho-pai e os irmãos serão preservados.';
 if(!confirm(warning))return;
 status(modal,'Excluindo definitivamente...',false);
 try{
  var n=await deleteDeckPermanently(target);
  removeHiddenRows();
  status(modal,'Excluído: '+target+' ('+n+' cartões). Atualizando a lista...',false);
  setTimeout(function(){location.replace(location.pathname+'?deck_delete=6692-'+Date.now())},350);
 }catch(e){status(modal,'Erro ao excluir: '+(e&&e.message?e.message:String(e)),true)}
}

/* Captura antes dos onclick antigos v6685/v6688 e impede execução dupla. */
document.addEventListener('click',function(e){
 var btn=e.target&&e.target.closest?e.target.closest('#cadm-delete'):null;
 if(!btn)return;
 e.preventDefault();
 e.stopPropagation();
 if(e.stopImmediatePropagation)e.stopImmediatePropagation();
 var modal=btn.closest('#cadm-modal')||document.getElementById('cadm-modal');
 runDelete(modal);
},true);

function boot(){
 filterStaticSources();removeHiddenRows();
 var obs=new MutationObserver(function(){removeHiddenRows()});
 obs.observe(document.documentElement,{childList:true,subtree:true});
 window.centralAnkiDeleteV6692={version:VERSION,deleteDeck:deleteDeckPermanently,refresh:removeHiddenRows};
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();
