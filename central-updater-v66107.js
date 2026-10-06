(function(){
'use strict';
var VERSION='6.6.119';
window.__centralUpdater66119=true;window.__centralUpdater66118=true;window.__centralUpdater66117=true;window.__centralUpdater66116=true;window.__centralUpdater66115=true;window.__centralUpdater66114=true;window.__centralUpdater66113=true;window.__centralUpdater66112=true;window.__centralUpdater66111=true;window.__centralUpdater66110=true;window.__centralUpdater66109=true;window.__centralUpdater66108=true;window.__centralUpdater66107=true;window.__centralUpdater66106=true;window.__centralUpdater66105=true;window.__centralUpdater66104=true;window.__centralUpdater66103=true;window.__centralUpdater66102=true;window.__centralUpdater6682=true;
function makeButton(){
 var role=String(window.__BASE_COMPLETA_USER_ROLE__||window.BASE_COMPLETA_USER&&window.BASE_COMPLETA_USER.role||'');
 var previous=document.getElementById('central-update-btn');
 if(role!=='admin'){if(previous)previous.remove();var oldStatus=document.getElementById('central-update-status');if(oldStatus)oldStatus.remove();return;}
 if(previous&&previous.getAttribute('data-central-version')===VERSION)return;
 if(previous)previous.remove();
 var previousStatus=document.getElementById('central-update-status');if(previousStatus)previousStatus.remove();
 var style=document.createElement('style');style.textContent='#central-update-btn{position:fixed;right:18px;top:74px;bottom:auto;z-index:2147483000;border:0;border-radius:14px;padding:11px 14px;font:600 14px system-ui,-apple-system,Segoe UI,Roboto,sans-serif;box-shadow:0 4px 18px rgba(0,0,0,.22);cursor:pointer;background:#111827;color:#fff}#central-update-status{display:none;position:fixed;right:18px;top:126px;bottom:auto;z-index:2147483000;max-width:290px;padding:9px 12px;border-radius:10px;background:#111827;color:#fff;font:13px system-ui,-apple-system,Segoe UI,Roboto,sans-serif;box-shadow:0 4px 18px rgba(0,0,0,.2)}@media(max-width:560px){#central-update-btn{right:12px;top:68px;bottom:auto}#central-update-status{right:12px;top:120px;bottom:auto}}';document.head.appendChild(style);
 var btn=document.createElement('button');btn.id='central-update-btn';btn.type='button';btn.setAttribute('data-central-version',VERSION);btn.textContent='↻ Atualizar Central';btn.title='Buscar a versão mais recente da Central de Estudos';
 var status=document.createElement('span');status.id='central-update-status';document.body.appendChild(status);document.body.appendChild(btn);
 var badge=document.createElement('span');badge.textContent='v'+VERSION;badge.style.cssText='opacity:.7;margin-left:7px;font-size:11px';btn.appendChild(badge);
 btn.addEventListener('click',function(){if(btn.disabled)return;btn.disabled=true;btn.textContent='Atualizando...';status.textContent='Abrindo o atualizador seguro. Seu progresso será preservado.';status.style.display='block';var u=new URL('/update-central.html',location.origin);u.searchParams.set('target','66119');u.searchParams.set('_central_update',Date.now().toString(36));location.href=u.toString()});
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',makeButton,{once:true});else makeButton();
setTimeout(makeButton,1800);setTimeout(makeButton,4800);
})();
