/* Reveal the Central only after the current home is ready. */
(function(){
  'use strict';
  var root=document.documentElement,started=Date.now(),build=root.dataset.centralBuild;
  var failed=false,timer;
  function fail(){
    failed=true;
    if(!document.getElementById('status')){document.addEventListener('DOMContentLoaded',fail,{once:true});return;}
    document.getElementById('status').textContent='Não foi possível concluir o carregamento. Verifique a conexão e tente novamente.';
    document.querySelector('#central-boot-screen .spinner').hidden=true;
    var retry=document.getElementById('retry');retry.hidden=false;retry.onclick=function(){location.reload()};
  }
  function ready(){
    if(!root.classList.contains('bc-ui-v1')||!root.classList.contains('bc-topnav')||!root.classList.contains('bc-home-v3-active'))return false;
    return Array.from(document.querySelectorAll('link[rel="stylesheet"]')).every(function(link){return !!link.sheet});
  }
  function check(){
    if(failed)return;
    if(!ready()){
      if(Date.now()-started>60000){fail();return;}
      timer=setTimeout(check,50);return;
    }
    // Apply the final render before revealing it; layout decorators use animation frames.
    try{window.renderAll()}catch(error){console.error('[Central startup]',error);fail();return;}
    // Every fresh opening starts with expandable study groups collapsed.
    // This changes presentation only; progress, notes and academic state are untouched.
    try{
      document.querySelectorAll('.subject.open,.cf-module.open,.civil-module.open,.cpc-module.open,.penal-module.open,.cpp-module.open,.adm-module.open').forEach(function(node){node.classList.remove('open')});
      document.querySelectorAll('details[open].tec-group').forEach(function(node){node.removeAttribute('open')});
    }catch(error){console.warn('[Central startup collapse]',error);}
    requestAnimationFrame(function(){requestAnimationFrame(function(){
      if(failed)return;
      root.classList.remove('central-boot-pending');
      document.getElementById('central-boot-screen').remove();
      root.dataset.centralReady='true';
      document.dispatchEvent(new CustomEvent('central:ready'));
    })});
  }
  window.addEventListener('error',function(event){
    if(!root.classList.contains('central-boot-pending'))return;
    if(event.target?.tagName==='SCRIPT'){
      // A free account may be denied optional Premium-only scripts (HTTP 403).
      // Rendering must decide whether a missing dependency is actually fatal;
      // one rejected Premium file must not lock the entire study dashboard.
      console.warn('[Central startup] Recurso JS indisponível:',event.target?.src||'(sem URL)');
      return;
    }
    if(event.target?.rel==='stylesheet'){
      clearTimeout(timer);fail();
    }
  },true);
  // Update the worker in the background without reloading the current page.
  // A forced reload here caused the loading screen to appear twice on PWA/mobile opens.
  if('serviceWorker' in navigator){
    navigator.serviceWorker.getRegistration().then(function(reg){
      if(reg)reg.update().catch(function(){});
    }).catch(function(){});
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',check,{once:true});
  else check();
})();
