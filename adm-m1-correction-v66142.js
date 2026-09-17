(function(){
'use strict';
if(window.__admM1CorrectionV66142)return;
window.__admM1CorrectionV66142=true;
var UID='adm-01-01-regime-juridico-e-principios';
function install(){
 if(window.__admM1CorrectionInstalledV66142)return true;
 if(typeof window.renderDetail!=='function')return false;
 var base=window.renderDetail;
 window.renderDetail=function(s,t,r){
  var html=base.apply(this,arguments);
  if(!t||t.uid!==UID||!s||s.id!=='adm')return html;
  return String(html).replace('proporcionalidade, moralidade, ampla defesa','proporcionalidade, ampla defesa');
 };
 window.__admM1CorrectionInstalledV66142=true;
 try{if(typeof window.renderAll==='function')window.renderAll()}catch(error){console.warn('[ADM M1] correção de classificação',error)}
 return true;
}
function schedule(){
 if(install())return;
 var tries=0,timer=setInterval(function(){tries+=1;if(install()||tries>80)clearInterval(timer)},50);
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',schedule,{once:true});else schedule();
})();
