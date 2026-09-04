(function(){
'use strict';
var VERSION='6695';
var HIDDEN='central-v6:anki-hidden-decks';
var MIGRATION='6680';
var PT='03 PORTUGUÊS';

function norm(s){return String(s||'').trim().toLocaleLowerCase('pt-BR')}
function sameOrChild(deck,target){var d=norm(deck),t=norm(target);return !!t&&(d===t||d.indexOf(t+'::')===0)}
function hidden(){try{var v=JSON.parse(localStorage.getItem(HIDDEN)||'[]');return Array.isArray(v)?v:[]}catch(_){return[]}}
function isHidden(deck){return hidden().some(function(h){return sameOrChild(deck,h)})}
function root(deck){return String(deck||'').split('::',1)[0].trim().toUpperCase()}

function siteData(){
 var d=null;
 try{d=window.ANKI_SITE_DATA||null}catch(_){}
 if(!d){try{if(typeof SITE_DATA!=='undefined')d=SITE_DATA}catch(_){} }
 if(d&&Array.isArray(d.cards))return d;
 return null;
}

function filterHiddenInObject(obj){
 if(!obj||typeof obj!=='object')return;
 if(Array.isArray(obj.cards))obj.cards=obj.cards.filter(function(c){return !(c&&c.deck&&isHidden(c.deck))});
 if(Array.isArray(obj.decks))obj.decks=obj.decks.filter(function(d){return !isHidden(d)});
 if(obj.meta&&Array.isArray(obj.meta.decks))obj.meta.decks=obj.meta.decks.filter(function(d){return !isHidden(d)});
 if('totalCards' in obj&&Array.isArray(obj.cards))obj.totalCards=obj.cards.length;
 if('deckCount' in obj&&Array.isArray(obj.decks))obj.deckCount=obj.decks.length;
}

function applyHiddenEverywhere(){
 try{filterHiddenInObject(window.ANKI_SITE_DATA)}catch(_){}
 try{if(typeof SOURCE!=='undefined')filterHiddenInObject(SOURCE)}catch(_){}
 try{if(window.S&&Array.isArray(window.S.cards))window.S.cards=window.S.cards.filter(function(c){return !(c&&c.deck&&isHidden(c.deck))})}catch(_){}
 try{
  var keys=[];for(var i=0;i<localStorage.length;i++)keys.push(localStorage.key(i));
  keys.forEach(function(k){
   if(!k||k===HIDDEN)return;
   var raw=localStorage.getItem(k);if(!raw)return;
   var v;try{v=JSON.parse(raw)}catch(_){return}
   var before;try{before=JSON.stringify(v)}catch(_){return}
   if(v&&typeof v==='object')filterHiddenInObject(v);
   var after;try{after=JSON.stringify(v)}catch(_){return}
   if(after!==before)localStorage.setItem(k,after);
  });
 }catch(_){}
}

/* A migração histórica 6680 era necessária apenas uma vez. Se ela já foi
   aplicada, não deve reconstruir Português em toda inicialização. */
function historicalMigrationAlreadyDone(){
 try{return localStorage.getItem('central:anki:migracao')===MIGRATION}catch(_){return false}
}

function boot(){
 applyHiddenEverywhere();
 if(!historicalMigrationAlreadyDone()){
  /* Mantém a instalação segura: marcamos a migração histórica como concluída,
     sem sobrescrever os baralhos atuais do usuário. */
  try{localStorage.setItem('central:anki:migracao',MIGRATION)}catch(_){}
 }
 var obs=new MutationObserver(function(){applyHiddenEverywhere()});
 obs.observe(document.documentElement,{childList:true,subtree:true});
 window.addEventListener('central-cloud-applied',function(){setTimeout(applyHiddenEverywhere,0);setTimeout(applyHiddenEverywhere,250)});
 window.centralAnkiMigrationGuard={version:VERSION,refresh:applyHiddenEverywhere};
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();
