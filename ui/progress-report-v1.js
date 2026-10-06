/* Base Completa — resumo pedagógico por usuário v1
   Apenas lê o estado já calculado pela Central e envia um resumo administrativo. */
(function(){
'use strict';
if(window.__bcProgressReportV1)return;window.__bcProgressReportV1=true;

var ACTIVE_KEY='base-completa:user-activity:v1';
var lastInteraction=Date.now(),tick=null,reportTimer=null;

function readJson(key,fallback){
  try{var x=JSON.parse(localStorage.getItem(key)||'null');return x==null?fallback:x}catch(_){return fallback}
}
function writeJson(key,value){try{localStorage.setItem(key,JSON.stringify(value))}catch(_){}}
function activity(){
  var a=readJson(ACTIVE_KEY,null);
  return a&&typeof a==='object'?a:{studySeconds:0,lastStudy:null};
}
function markActive(){lastInteraction=Date.now()}
['pointerdown','keydown','scroll','touchstart'].forEach(function(name){addEventListener(name,markActive,{passive:true})});

function tickActivity(){
  if(document.visibilityState!=='visible')return;
  if(Date.now()-lastInteraction>120000)return;
  var a=activity();a.studySeconds=Math.max(0,Number(a.studySeconds)||0)+30;a.lastStudy=new Date().toISOString();writeJson(ACTIVE_KEY,a);
}

function textPct(el){
  var m=String(el&&el.textContent||'').match(/(\d+(?:[.,]\d+)?)\s*%/);
  return m?Math.max(0,Math.min(100,Math.round(Number(m[1].replace(',','.'))))):null;
}
function disciplineRows(){
  var rows=[];
  document.querySelectorAll('#subjects > .subject[data-id]').forEach(function(s){
    var id=String(s.dataset.id||'').trim();if(!id)return;
    var name=(s.querySelector('.subject-name')||{}).textContent||id;
    var pct=textPct(s.querySelector('.subject-pct'));
    if(pct==null){
      var bar=s.querySelector('.subject-bar span');
      if(bar){var w=parseFloat(bar.style.width||'');if(Number.isFinite(w))pct=Math.round(w)}
    }
    if(pct==null)pct=0;
    rows.push({id:id,name:String(name).trim(),pct:pct});
  });
  return rows;
}
function safeCall(name){
  try{return typeof window[name]==='function'?window[name]():null}catch(_){return null}
}
function questionsFromKnownStores(){
  var total=0;
  ['cfStats','penalStats','cpcStats'].forEach(function(name){var x=safeCall(name);if(x&&Number.isFinite(Number(x.answered)))total+=Math.max(0,Number(x.answered))});
  try{
    if(window.CivilNative&&typeof CivilNative.extStats==='function')for(var i=1;i<=40;i++){var c=CivilNative.extStats(i);if(!c)break;total+=Math.max(0,Number(c.done)||0)}
  }catch(_){}
  try{
    if(window.CppNative&&typeof CppNative.externalStats==='function')for(var j=1;j<=60;j++){var p=CppNative.externalStats(j);if(!p)break;total+=Math.max(0,Number(p.done)||0)}
  }catch(_){}

  try{
    for(var k=0;k<localStorage.length;k++){
      var key=localStorage.key(k);if(!key)continue;
      if(/^central-v6:perf:/.test(key)){
        var perf=readJson(key,[]);if(Array.isArray(perf))perf.forEach(function(r){total+=Math.max(0,Number(r&&r.q)||0)});
      }else if(/^central-v6:module-rounds:/.test(key)){
        var rounds=readJson(key,[]);if(Array.isArray(rounds))rounds.forEach(function(r){total+=Math.max(0,Number(r&&(r.done!=null?r.done:r.valid))||0)});
      }else if(/^base-completa:pt:v1:module:.*:progress$/.test(key)){
        var pt=readJson(key,{}),answers=pt&&pt.answers&&typeof pt.answers==='object'?Object.keys(pt.answers).length:0;total+=answers;
      }
    }
  }catch(_){}
  return Math.round(total);
}
function lastStudy(){
  var a=activity(),latest=a.lastStudy?new Date(a.lastStudy).getTime():0;
  try{
    var x=readJson('central-v6:last',null),t=Number(x&&x.at||0);if(t>latest)latest=t;
  }catch(_){}
  return latest?new Date(latest).toISOString():null;
}
function snapshot(){
  var disciplines=disciplineRows();
  var overall=disciplines.length?Math.round(disciplines.reduce(function(n,d){return n+d.pct},0)/disciplines.length):0;
  var a=activity();
  return {
    overallPct:overall,
    questions:questionsFromKnownStores(),
    studySeconds:Math.max(0,Math.round(Number(a.studySeconds)||0)),
    lastStudy:lastStudy(),
    disciplines:disciplines
  };
}
async function report(){
  if(!navigator.onLine)return;
  try{
    await fetch('/api/progress-summary',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({summary:snapshot()}),keepalive:true});
  }catch(_){}
}
function start(){
  setTimeout(report,5000);
  tick=setInterval(tickActivity,30000);
  reportTimer=setInterval(report,120000);
  document.addEventListener('visibilitychange',function(){if(document.visibilityState==='hidden')report();else markActive()});
  window.addEventListener('beforeunload',report);
  window.addEventListener('central-cloud-applied',function(){setTimeout(report,1200)});
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
