(function(){
'use strict';
if(window.__centralMinimal66119Loaded)return;
window.__centralMinimal66119Loaded=true;
var VERSION='6.6.119';
function apply(){
 var root=document.documentElement;if(!root)return;
 root.classList.add('central-minimal-v66119');
 root.setAttribute('data-central-visual','minimal-v66119');
 root.style.setProperty('--central-reading-max','790px');
}
apply();
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',apply,{once:true});
window.addEventListener('pageshow',apply);
var observer=new MutationObserver(function(){apply()});
try{observer.observe(document.documentElement,{attributes:true,attributeFilter:['class','data-theme','data-mode']})}catch(_){ }
window.__centralMinimal66119SelfTest=function(){return {version:VERSION,rootClass:document.documentElement.classList.contains('central-minimal-v66119'),visual:document.documentElement.getAttribute('data-central-visual')}};
})();
