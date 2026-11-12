(function(){
'use strict';
if(window.__centralMinimalUI66119Loaded)return;
window.__centralMinimalUI66119Loaded=true;
var VERSION='6.6.119';
function apply(){
 try{
  document.documentElement.classList.add('central-minimal-v66119');
  document.documentElement.setAttribute('data-central-minimal-version','66119');
  if(document.body)document.body.classList.add('central-minimal-v66119');
 }catch(e){console.error('Central minimal UI v6.6.119',e)}
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',apply,{once:true});else apply();
setTimeout(apply,0);setTimeout(apply,400);setTimeout(apply,1600);
var obs=new MutationObserver(function(){if(document.body&&!document.body.classList.contains('central-minimal-v66119'))apply()});
function observe(){if(document.documentElement)obs.observe(document.documentElement,{childList:true,subtree:false})}
observe();
window.__centralMinimalUI66119SelfTest=function(){return {version:VERSION,root:document.documentElement.classList.contains('central-minimal-v66119'),body:!!document.body&&document.body.classList.contains('central-minimal-v66119'),dataVersion:document.documentElement.getAttribute('data-central-minimal-version')}};
})();
