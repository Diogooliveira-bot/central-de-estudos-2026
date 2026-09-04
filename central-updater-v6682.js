(function(){
'use strict';
var VERSION='6.6.97';
var TARGET='6697';
window.CENTRAL_VERSION=VERSION;
window.__centralLegacyUpdaterCompat=TARGET;

var SKIP={SCRIPT:1,STYLE:1,NOSCRIPT:1,TEXTAREA:1,CODE:1,PRE:1};
var RE=/\bv6\.6\.\d+\b/g;
function patchText(n){
 if(!n||n.nodeType!==3)return;
 var p=n.parentElement;if(!p||SKIP[p.tagName])return;
 var before=n.nodeValue;if(!before||before.indexOf('v6.6.')<0)return;
 var after=before.replace(RE,'v'+VERSION);if(after!==before)n.nodeValue=after;
}
function patchTree(root){
 if(!root)return;
 if(root.nodeType===3){patchText(root);return}
 if(root.nodeType!==1&&root.nodeType!==9&&root.nodeType!==11)return;
 if(root.nodeType===1&&SKIP[root.tagName])return;
 var w=document.createTreeWalker(root,NodeFilter.SHOW_TEXT),n;
 while((n=w.nextNode()))patchText(n);
}

function configureButton(){
 var btn=document.getElementById('central-update-btn');
 if(!btn){
  btn=document.createElement('button');btn.id='central-update-btn';btn.type='button';
  btn.style.cssText='position:fixed;right:14px;bottom:14px;z-index:2147483000;border:0;border-radius:14px;padding:11px 14px;font:600 14px system-ui,-apple-system,Segoe UI,Roboto,sans-serif;box-shadow:0 4px 18px rgba(0,0,0,.22);cursor:pointer;background:#111827;color:#fff;';
  document.body.appendChild(btn);
 }
 btn.disabled=false;btn.replaceChildren(document.createTextNode('↻ Atualizar Central'));
 var badge=document.createElement('span');badge.textContent='v'+VERSION;badge.style.cssText='opacity:.7;margin-left:7px;font-size:11px';btn.appendChild(badge);
 btn.onclick=function(e){
  e.preventDefault();
  var u=new URL('/update-central.html',location.origin);
  u.searchParams.set('target',TARGET);u.searchParams.set('_central_update',Date.now().toString(36));
  location.href=u.toString();
 };
}

function start(){
 patchTree(document.body);configureButton();
 /* Observa apenas novos nós visuais; não toca em cards, IndexedDB ou localStorage. */
 var o=new MutationObserver(function(ms){
  ms.forEach(function(m){m.addedNodes&&m.addedNodes.forEach(patchTree);if(m.type==='characterData')patchText(m.target)});
 });
 o.observe(document.body,{subtree:true,childList:true,characterData:true});
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
