/* Compatibilidade: o antigo editor agora carrega o editor visual por blocos v2. */
(function(){
'use strict';
if(window.__bcBlockEditorV2)return;
var s=document.createElement('script');
s.src='/ui/block-editor-v2.js?v=20261007block1';
s.defer=true;
document.head.appendChild(s);
})();
