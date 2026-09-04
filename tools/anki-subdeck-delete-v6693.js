(function(){
'use strict';
var VERSION='6693';
var DB='anki-offline-tauanne-v1';
var HIDDEN='central-v6:anki-hidden-decks';
var CUSTOM='central-v6:anki-custom-decks';

function norm(s){return String(s||'').trim().toLocaleLowerCase('pt-BR')}
function sameOrChild(deck,target){var d=norm(deck),t=norm(target);return !!t&&(d===t||d.indexOf(t+'::')===0)}
function readList(key){try{var v=JSON.parse(localStorage.getItem(key)||'[]');return Array.isArray(v)?v:[]}catch(_){return[]}}
function writeList(key,list){var out=[];(list||[]).forEach(function(x){x=String(x||'').trim();if(x&&!out.some(function(y){return norm(y)===norm(x)}))out.push(x)});out.sort(function(a,b){return a.localeCompare(b,'pt-BR',{numeric:true})});localStorage.setItem(key,JSON.stringify(out))}
function hidden(){return readList(HIDDEN)}
function isHidden(deck){return hidden().some(function(h){return sameOrChild(deck,h)})}
function esc(s){return String(s||'').replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}

function openDB(){return new Promise(function(ok,no){var r=indexedDB.open(DB,1);r.onsuccess=function(){ok(r.result)};r.onerror=function(){no(r.error||new Error('Não foi possível abrir o banco do Anki.'))}})}
function allCards(){return openDB().then(function(d){return new Promise(function(ok,no){var tx=d.transaction('cards','readonly'),r=tx.objectStore('cards').getAll();r.onsuccess=function(){try{d.close()}catch(_){}ok(r.result||[])};r.onerror=function(){try{d.close()}catch(_){}no(r.error)}})})}

function deckFromRow(row){
 if(!row)return '';
 var direct=row.getAttribute('data-full-deck')||(row.dataset&&row.dataset.fullDeck)||'';
 if(direct)return direct;
 var bt=row.querySelector('.anki-duo-deckbutton');
 if(!bt)return '';
 var bd=bt.getAttribute('data-full-deck')||(bt.dataset&&bt.dataset.fullDeck)||'';
 if(bd)return bd;
 var oc=bt.getAttribute('onclick')||'';
 var m=oc.match(/ankiDuoSelectDeck\('((?:\\'|[^'])*)'\)/);
 if(m)return m[1].replace(/\\'/g,"'");
 return '';
}

async function collectDecks(){
 var map={};
 function add(x){x=String(x||'').trim();if(x&&!isHidden(x))map[x]=1}
 try{var meta=window.ANKI_SITE_DATA&&window.ANKI_SITE_DATA.meta;((meta&&meta.decks)||[]).forEach(add)}catch(_){}
 readList(CUSTOM).forEach(add);
 try{(await allCards()).forEach(function(c){if(c&&c.deck&&!c.suspended)add(c.deck)})}catch(_){}
 document.querySelectorAll('.anki-duo-table-row').forEach(function(row){add(deckFromRow(row))});
 return Object.keys(map).sort(function(a,b){return a.localeCompare(b,'pt-BR',{numeric:true})})
}

async function deleteDeck(target){
 target=String(target||'').trim();
 if(!target)throw Error('Selecione um baralho ou subbaralho.');
 var d=await openDB(),count=0;
 await new Promise(function(ok,no){
  var tx=d.transaction('cards','readwrite'),st=tx.objectStore('cards'),req=st.openCursor();
  req.onsuccess=function(e){
   var cur=e.target.result;if(!cur)return;
   var c=cur.value||{};
   var hit=sameOrChild(c.deck,target)||sameOrChild(c.centralOriginalDeck,target)||sameOrChild(c.centralDeletedDeck,target);
   if(hit){cur.delete();count++}
   cur.continue();
  };
  req.onerror=function(){no(req.error||new Error('Falha ao ler os cartões.'))};
  tx.oncomplete=ok;
  tx.onerror=function(){no(tx.error||new Error('Falha ao excluir os cartões.'))};
  tx.onabort=function(){no(tx.error||new Error('A exclusão foi cancelada pelo banco.'))};
 });
 try{d.close()}catch(_){}
 writeList(CUSTOM,readList(CUSTOM).filter(function(x){return !sameOrChild(x,target)}));
 var hs=hidden();hs.push(target);writeList(HIDDEN,hs);
 localStorage.setItem('central-v6:anki-last-deleted-deck',JSON.stringify({deck:target,cards:count,deletedAt:Date.now(),version:VERSION}));
 return count;
}

function applyHidden(){
 var hs=hidden();
 function keep(d){return !hs.some(function(h){return sameOrChild(d,h)})}
 try{if(window.ANKI_SITE_DATA&&window.ANKI_SITE_DATA.meta&&Array.isArray(window.ANKI_SITE_DATA.meta.decks))window.ANKI_SITE_DATA.meta.decks=window.ANKI_SITE_DATA.meta.decks.filter(keep)}catch(_){}
 try{if(window.ANKI_SITE_DATA&&Array.isArray(window.ANKI_SITE_DATA.cards))window.ANKI_SITE_DATA.cards=window.ANKI_SITE_DATA.cards.filter(function(c){return !(c&&c.deck&&!keep(c.deck))})}catch(_){}
 try{if(window.S&&Array.isArray(window.S.cards))window.S.cards=window.S.cards.filter(function(c){return !(c&&c.deck&&!keep(c.deck))})}catch(_){}
 document.querySelectorAll('.anki-duo-table-row').forEach(function(row){var d=deckFromRow(row);if(d&&!keep(d))row.remove()});
}

function labelFor(deck){return deck.split('::').join(' › ')}
function status(pane,msg,bad){var s=pane.querySelector('#clean-delete-status');if(s){s.textContent=msg;s.style.color=bad?'#b91c1c':'#166534'}}

async function installDeletePane(modal){
 if(!modal||modal.dataset.cleanDelete6693==='1')return;
 var pane=modal.querySelector('[data-pane="delete"]');
 if(!pane)return;
 modal.dataset.cleanDelete6693='1';
 var decks=await collectDecks();
 pane.innerHTML='<div style="background:#f1f5f9;border-radius:10px;padding:11px;margin:4px 0 12px"><b>Exclusão limpa v6.6.93</b><br><span style="color:#64748b">Escolha o caminho completo. Ao excluir um subbaralho, o baralho-pai e os irmãos permanecem.</span></div><label for="clean-delete-select" style="display:block;font-weight:700;margin-bottom:6px">Baralho / subbaralho</label><select id="clean-delete-select" style="width:100%;box-sizing:border-box;padding:11px;border:1px solid #cfd7e3;border-radius:10px;background:#fff"><option value="">Selecione...</option>'+decks.map(function(d){return '<option value="'+esc(d)+'">'+esc(labelFor(d))+'</option>'}).join('')+'</select><p style="margin:12px 0 6px"><button type="button" id="clean-delete-button" style="border:0;background:#b91c1c;color:#fff;border-radius:10px;padding:11px 14px;font-weight:800">Excluir selecionado</button></p><div id="clean-delete-status" style="font-weight:700;min-height:22px"></div>';
 var btn=pane.querySelector('#clean-delete-button');
 btn.onclick=async function(e){
  e.preventDefault();e.stopPropagation();
  var sel=pane.querySelector('#clean-delete-select');var target=sel&&sel.value?sel.value.trim():'';
  if(!target){status(pane,'Selecione um baralho ou subbaralho.',true);return}
  var parts=target.split('::');var leaf=parts[parts.length-1];
  var msg='Excluir definitivamente “'+leaf+'”?\n\nCaminho: '+target+'\n\nSomente este caminho e seus filhos serão apagados. O baralho-pai e os demais subbaralhos serão preservados.';
  if(!confirm(msg))return;
  btn.disabled=true;status(pane,'Excluindo '+target+'...',false);
  try{
   var n=await deleteDeck(target);
   applyHidden();
   status(pane,'Excluído com sucesso: '+target+' ('+n+' cartões).',false);
   setTimeout(function(){location.replace(location.pathname+'?subdeck_deleted=6693-'+Date.now())},500);
  }catch(err){btn.disabled=false;status(pane,'Erro: '+(err&&err.message?err.message:String(err)),true)}
 };
}

function scan(){
 applyHidden();
 var modal=document.getElementById('cadm-modal');
 if(modal)installDeletePane(modal);
}
function boot(){
 scan();
 var obs=new MutationObserver(scan);obs.observe(document.documentElement,{childList:true,subtree:true});
 window.centralAnkiSubdeckDelete={version:VERSION,deleteDeck:deleteDeck,refresh:applyHidden};
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();
