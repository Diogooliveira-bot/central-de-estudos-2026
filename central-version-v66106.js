(function(){
'use strict';
var VERSION='6.6.106';window.CENTRAL_VERSION=VERSION;
var SKIP={SCRIPT:1,STYLE:1,NOSCRIPT:1,TEXTAREA:1,CODE:1,PRE:1};var RE=/\bv6\.6\.\d+\b/g;
function patchText(n){if(!n||n.nodeType!==3)return;var p=n.parentElement;if(!p||SKIP[p.tagName])return;var b=n.nodeValue;if(!b||b.indexOf('v6.6.')<0)return;var a=b.replace(RE,'v'+VERSION);if(a!==b)n.nodeValue=a}
function patchTree(root){if(!root)return;if(root.nodeType===3){patchText(root);return}if(root.nodeType!==1&&root.nodeType!==9&&root.nodeType!==11)return;if(root.nodeType===1&&SKIP[root.tagName])return;var w=document.createTreeWalker(root,NodeFilter.SHOW_TEXT),n;while((n=w.nextNode()))patchText(n)}
function start(){patchTree(document.body)}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
setTimeout(start,0);setTimeout(start,350);setTimeout(start,1400);setTimeout(start,3200);setTimeout(start,6400);
var observer=new MutationObserver(function(changes){changes.forEach(function(change){if(change.type==='characterData')patchText(change.target);else Array.prototype.forEach.call(change.addedNodes,patchTree)})});
function observe(){if(document.documentElement)observer.observe(document.documentElement,{subtree:true,childList:true,characterData:true})}
observe();if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',observe,{once:true});
window.addEventListener('pageshow',start);
})();
