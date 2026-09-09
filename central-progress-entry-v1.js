(function(){
'use strict';
function addProgressEntry(){
  if(document.getElementById('central-progress-entry-v1'))return;
  var a=document.createElement('a');
  a.id='central-progress-entry-v1';
  a.href='./tools/progresso.html';
  a.textContent='📊 Meu progresso';
  a.setAttribute('aria-label','Abrir Meu progresso');
  a.style.cssText='position:fixed;right:16px;bottom:18px;z-index:2147483000;display:flex;align-items:center;gap:7px;padding:11px 14px;border-radius:999px;background:#6d5dfc;color:#fff;text-decoration:none;font:800 12px/1.2 system-ui,-apple-system,Segoe UI,sans-serif;box-shadow:0 8px 24px rgba(30,35,60,.24);border:1px solid rgba(255,255,255,.25);';
  a.addEventListener('pointerdown',function(){a.style.transform='scale(.98)'});
  a.addEventListener('pointerup',function(){a.style.transform=''});
  document.body.appendChild(a);
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',addProgressEntry,{once:true});else addProgressEntry();
})();
