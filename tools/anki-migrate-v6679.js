(function(){
'use strict';
var REMOVE={'06 LEGISLAÇÃO':1,'99 ARQUIVO FORA DO EDITAL':1,'QUESTÕES':1,'RLM':1};
var PT='03 PORTUGUÊS';
var MIGRATION='6680';

function root(deck){return String(deck||'').split('::',1)[0].trim().toUpperCase()}
function clone(v){return JSON.parse(JSON.stringify(v))}
function siteData(){
  var d=null;
  try{d=window.ANKI_SITE_DATA||null}catch(_){}
  if(!d){
    try{if(typeof SITE_DATA!=='undefined')d=SITE_DATA}catch(_){}
  }
  if(d&&Array.isArray(d.cards)){
    try{window.ANKI_SITE_DATA=d}catch(_){}
    return d;
  }
  return null;
}
function expectedCards(){
  var d=siteData();
  if(!d)return [];
  return d.cards.filter(function(c){return root(c&&c.deck)===PT});
}
function expectedDecks(exp){
  var out={};
  (exp||expectedCards()).forEach(function(c){if(c&&c.deck)out[c.deck]=1});
  return Object.keys(out).sort(function(a,b){return a.localeCompare(b,'pt-BR')});
}
function preserveProgress(base,old){
  var c=clone(base);
  if(old&&typeof old==='object'){
    if(old.stats&&typeof old.stats==='object')c.stats=clone(old.stats);
    if(typeof old.suspended==='boolean')c.suspended=old.suspended;
    if(old.createdAt)c.createdAt=old.createdAt;
  }
  return c;
}
function mergeCards(cards,exp){
  exp=exp||expectedCards();
  if(exp.length!==160)return cards;
  var oldById={};
  (cards||[]).forEach(function(c){if(c&&c.id)oldById[c.id]=c});
  var out=(cards||[]).filter(function(c){var r=root(c&&c.deck);return r!==PT&&!REMOVE[r]});
  exp.forEach(function(c){out.push(preserveProgress(c,oldById[c.id]))});
  return out;
}
function mergeDecks(decks,exp){
  var keep={};
  (decks||[]).forEach(function(d){if(typeof d==='string'){var r=root(d);if(r!==PT&&!REMOVE[r])keep[d]=1}});
  expectedDecks(exp).forEach(function(d){keep[d]=1});
  return Object.keys(keep).sort(function(a,b){return a.localeCompare(b,'pt-BR')});
}
function hasTargetCards(a){return Array.isArray(a)&&a.some(function(c){return c&&typeof c==='object'&&c.deck&&(root(c.deck)===PT||REMOVE[root(c.deck)])})}
function hasTargetDecks(a){return Array.isArray(a)&&a.some(function(d){return typeof d==='string'&&(root(d)===PT||REMOVE[root(d)])})}
function migrateObject(obj,depth,exp){
  if(!obj||typeof obj!=='object'||depth>5)return false;
  var changed=false;
  if(Array.isArray(obj)){
    if(hasTargetCards(obj)){
      var merged=mergeCards(obj,exp);
      if(merged!==obj){obj.splice.apply(obj,[0,obj.length].concat(merged));return true}
    }
    if(hasTargetDecks(obj)){
      var decks=mergeDecks(obj,exp);
      obj.splice.apply(obj,[0,obj.length].concat(decks));
      return true;
    }
    obj.forEach(function(v){if(v&&typeof v==='object'&&migrateObject(v,depth+1,exp))changed=true});
    return changed;
  }
  if(Array.isArray(obj.cards)&&hasTargetCards(obj.cards)){
    obj.cards=mergeCards(obj.cards,exp);
    if(Array.isArray(obj.decks))obj.decks=mergeDecks(obj.decks,exp);
    if('totalCards' in obj)obj.totalCards=obj.cards.length;
    if('deckCount' in obj&&Array.isArray(obj.decks))obj.deckCount=obj.decks.length;
    if('version' in obj)obj.version='6.6.80-portugues-organizado';
    changed=true;
  }else if(Array.isArray(obj.decks)&&hasTargetDecks(obj.decks)){
    obj.decks=mergeDecks(obj.decks,exp);changed=true;
  }
  Object.keys(obj).forEach(function(k){
    if(k==='cards'||k==='decks')return;
    var v=obj[k];if(v&&typeof v==='object'&&migrateObject(v,depth+1,exp))changed=true;
  });
  return changed;
}
function cleanRuntime(exp){
  var d=siteData();
  if(!d||exp.length!==160)return false;
  var before='';
  try{before=JSON.stringify([d.cards,d.decks||null])}catch(_){}
  d.cards=mergeCards(d.cards,exp);
  if(Array.isArray(d.decks))d.decks=mergeDecks(d.decks,exp);
  if('totalCards' in d)d.totalCards=d.cards.length;
  if('deckCount' in d&&Array.isArray(d.decks))d.deckCount=d.decks.length;
  try{return before!==JSON.stringify([d.cards,d.decks||null])}catch(_){return true}
}
function migrate(){
  var exp=expectedCards();
  if(exp.length!==160){
    try{console.warn('[Central Anki] Migração '+MIGRATION+' aguardando SITE_DATA com 160 cards de Português; encontrados:',exp.length)}catch(_){}
    return false;
  }
  var changed=cleanRuntime(exp), expById={};
  exp.forEach(function(c){expById[c.id]=c});
  var keys=[];try{for(var i=0;i<localStorage.length;i++)keys.push(localStorage.key(i))}catch(_){return changed}
  keys.forEach(function(k){
    if(!k)return;
    var raw;try{raw=localStorage.getItem(k)}catch(_){return}
    if(!raw)return;
    var value;try{value=JSON.parse(raw)}catch(_){return}
    if(value&&typeof value==='object'&&!Array.isArray(value)&&value.id&&value.deck&&('fields' in value)){
      var r=root(value.deck);
      if(r===PT||REMOVE[r]){
        if(r===PT&&expById[value.id])localStorage.setItem(k,JSON.stringify(preserveProgress(expById[value.id],value)));
        else localStorage.removeItem(k);
        changed=true;
      }
      return;
    }
    var before;try{before=JSON.stringify(value)}catch(_){return}
    if(migrateObject(value,0,exp)){
      var after=JSON.stringify(value);
      if(after!==before){localStorage.setItem(k,after);changed=true}
    }
  });
  try{localStorage.setItem('central:anki:migracao',MIGRATION)}catch(_){}
  if(changed){window.__centralAnkiMigrated6680=true;window.__centralAnkiMigrated6679=true;}
  return changed;
}
function migrateAndReload(){
  var changed=migrate();
  if(!changed)return;
  try{
    var key='central:anki:migracao-reload';
    if(sessionStorage.getItem(key)!==MIGRATION){
      sessionStorage.setItem(key,MIGRATION);
      setTimeout(function(){location.reload()},150);
    }
  }catch(_){}
}
window.centralMigrateAnki6680=migrate;
window.centralMigrateAnki6679=migrate;
window.addEventListener('central-cloud-applied',function(){migrate();setTimeout(migrateAndReload,0)});
migrateAndReload();
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',function(){setTimeout(migrate,0)});
setTimeout(migrate,500);
setTimeout(migrate,1500);
})();
