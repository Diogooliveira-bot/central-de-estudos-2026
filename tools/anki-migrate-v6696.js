(function(){
'use strict';
var VERSION='6696';
var HIDDEN='central-v6:anki-hidden-decks';
var MIGRATION='6680';
var hiddenCache=null;

function norm(s){return String(s||'').trim().toLocaleLowerCase('pt-BR')}
function sameOrChild(deck,target){var d=norm(deck),t=norm(target);return !!t&&(d===t||d.indexOf(t+'::')===0)}
function readHidden(){
 if(hiddenCache)return hiddenCache;
 try{var v=JSON.parse(localStorage.getItem(HIDDEN)||'[]');hiddenCache=Array.isArray(v)?v:[]}catch(_){hiddenCache=[]}
 return hiddenCache;
}
function invalidateHidden(){hiddenCache=null}
function isHidden(deck){var hs=readHidden();for(var i=0;i<hs.length;i++)if(sameOrChild(deck,hs[i]))return true;return false}

function filterRuntimeObject(obj){
 if(!obj||typeof obj!=='object')return;
 if(Array.isArray(obj.cards))obj.cards=obj.cards.filter(function(c){return !(c&&c.deck&&isHidden(c.deck))});
 if(Array.isArray(obj.decks))obj.decks=obj.decks.filter(function(d){return !isHidden(d)});
 if(obj.meta&&Array.isArray(obj.meta.decks))obj.meta.decks=obj.meta.decks.filter(function(d){return !isHidden(d)});
 if('totalCards' in obj&&Array.isArray(obj.cards))obj.totalCards=obj.cards.length;
 if('deckCount' in obj&&Array.isArray(obj.decks))obj.deckCount=obj.decks.length;
}

function applyHiddenRuntime(){
 invalidateHidden();
 try{filterRuntimeObject(window.ANKI_SITE_DATA)}catch(_){}
 try{if(typeof SOURCE!=='undefined')filterRuntimeObject(SOURCE)}catch(_){}
 try{if(window.S&&Array.isArray(window.S.cards))window.S.cards=window.S.cards.filter(function(c){return !(c&&c.deck&&isHidden(c.deck))})}catch(_){}
}

function boot(){
 applyHiddenRuntime();
 try{if(localStorage.getItem('central:anki:migracao')!==MIGRATION)localStorage.setItem('central:anki:migracao',MIGRATION)}catch(_){}
 window.addEventListener('central-cloud-applied',function(){setTimeout(applyHiddenRuntime,0)});
 window.addEventListener('storage',function(e){if(e&&e.key===HIDDEN)applyHiddenRuntime()});
 window.centralAnkiMigrationGuard={version:VERSION,refresh:applyHiddenRuntime};
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
