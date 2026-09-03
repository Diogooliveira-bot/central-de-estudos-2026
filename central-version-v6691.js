(function(){
'use strict';
var VERSION='6.6.91';
window.CENTRAL_VERSION=VERSION;

var SKIP={SCRIPT:1,STYLE:1,NOSCRIPT:1,TEXTAREA:1,CODE:1,PRE:1};
var VERSION_RE=/\bv6\.6\.(?:82|90)\b/g;

function patchText(node){
  if(!node || node.nodeType!==3) return;
  var p=node.parentElement;
  if(!p || SKIP[p.tagName]) return;
  var before=node.nodeValue;
  if(!before || before.indexOf('v6.6.')<0) return;
  var after=before.replace(VERSION_RE,'v'+VERSION);
  if(after!==before) node.nodeValue=after;
}

function patchTree(root){
  if(!root) return;
  if(root.nodeType===3){patchText(root);return;}
  if(root.nodeType!==1 && root.nodeType!==9 && root.nodeType!==11) return;
  if(root.nodeType===1 && SKIP[root.tagName]) return;
  var walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);
  var n;
  while((n=walker.nextNode())) patchText(n);
}

function start(){
  patchTree(document.body);
  var obs=new MutationObserver(function(mutations){
    mutations.forEach(function(m){
      if(m.type==='characterData') patchText(m.target);
      if(m.addedNodes) m.addedNodes.forEach(patchTree);
    });
  });
  obs.observe(document.body,{subtree:true,childList:true,characterData:true});
}

if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',start); else start();
})();
