(function(){
'use strict';
var VERSION='6.6.82';

function makeButton(){
  if(document.getElementById('central-update-btn')) return;
  var btn=document.createElement('button');
  btn.id='central-update-btn';
  btn.type='button';
  btn.textContent='↻ Atualizar Central';
  btn.title='Buscar a versão mais recente da Central de Estudos';
  btn.style.cssText='position:fixed;right:14px;bottom:14px;z-index:2147483000;border:0;border-radius:14px;padding:11px 14px;font:600 14px system-ui,-apple-system,Segoe UI,Roboto,sans-serif;box-shadow:0 4px 18px rgba(0,0,0,.22);cursor:pointer;background:#111827;color:#fff;';
  var status=document.createElement('span');
  status.style.cssText='display:none;position:fixed;right:14px;bottom:62px;z-index:2147483000;max-width:290px;padding:9px 12px;border-radius:10px;background:#111827;color:#fff;font:13px system-ui,-apple-system,Segoe UI,Roboto,sans-serif;box-shadow:0 4px 18px rgba(0,0,0,.2)';
  document.body.appendChild(status);
  document.body.appendChild(btn);

  function say(msg){status.textContent=msg;status.style.display='block';}

  btn.addEventListener('click',async function(){
    if(btn.disabled) return;
    btn.disabled=true;
    btn.textContent='Atualizando...';
    say('Buscando a versão mais recente. Seu progresso será preservado.');
    try{
      if('serviceWorker' in navigator){
        var regs=await navigator.serviceWorker.getRegistrations();
        await Promise.all(regs.map(function(r){return r.update().catch(function(){})}));
      }
      if(window.caches){
        var keys=await caches.keys();
        await Promise.all(keys.filter(function(k){return /^central-v/i.test(k)}).map(function(k){return caches.delete(k)}));
      }
      try{sessionStorage.setItem('central:last-manual-update',String(Date.now()))}catch(_){}
      var u=new URL(location.href);
      u.searchParams.set('_central_update',Date.now().toString(36));
      location.replace(u.toString());
    }catch(err){
      btn.disabled=false;
      btn.textContent='↻ Atualizar Central';
      say('Não foi possível atualizar agora. Verifique a internet e tente novamente.');
    }
  });

  var badge=document.createElement('span');
  badge.textContent='v'+VERSION;
  badge.style.cssText='opacity:.7;margin-left:7px;font-size:11px';
  btn.appendChild(badge);
}

if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',makeButton); else makeButton();
})();
