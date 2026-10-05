/* Reveal the Central only after the current home is ready. */
(function(){
  'use strict';
  var root=document.documentElement,started=Date.now(),build=root.dataset.centralBuild;
  var failed=false,timer;
  function fail(){
    failed=true;
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
    requestAnimationFrame(function(){requestAnimationFrame(function(){
      if(failed)return;
      root.classList.remove('central-boot-pending');
      document.getElementById('central-boot-screen').remove();
      root.dataset.centralReady='true';
      document.dispatchEvent(new CustomEvent('central:ready'));
    })});
  }
  window.addEventListener('error',function(event){
    if(event.target?.tagName==='SCRIPT'&&root.classList.contains('central-boot-pending')){
      clearTimeout(timer);fail();
    }
  },true);
  // A worker update is a single transition per build, covered by the same loading screen.
  if('serviceWorker' in navigator){
    var controlled=!!navigator.serviceWorker.controller;
    var key='central:pwa-reload:'+build;
    navigator.serviceWorker.addEventListener('controllerchange',function(){
      if(!controlled)return;
      try{
        if(sessionStorage.getItem(key))return;
        sessionStorage.setItem(key,'1');
      }catch(_){return;}
      location.reload();
    });
    navigator.serviceWorker.getRegistration().then(function(reg){if(reg)reg.update().catch(function(){})}).catch(function(){});
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',check,{once:true});
  else check();
})();
