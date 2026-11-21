(function(){
'use strict';
if(window.__centralLazyTheoryV66119)return;
window.__centralLazyTheoryV66119=true;

var groups={
 civil:[
  'content/civil/civil-native-index.js?v=20261018civiljur1',
  'content/civil/civil-sharing-links.js?v=20261009civilsharing2',
  'ui/civil-native-study-v1.js?v=20261113orient1'
 ],
 cpc:['cpc-theory-module1-v66119.js?v=66119b2','content/cpc/cpc-sharing-links.js?v=20261010cpcsharing1','ui/cpc-sharing-links.js?v=20261118r1'],
 // Direito Administrativo: as apostilas atuais (Revisão e Teoria completa) vêm dos leitores nativos, módulo a módulo.
 // Os 39 arquivos legados (adm-mN-theory/content/runtime e o pacote M9–M20, ~1,7 MB) saíram do carregamento: medido em
 // 4 módulos (M1, M5, M13, M20), lista, página do módulo, Revisão e Teoria completa ficam idênticas sem eles.
 // O Plano Gratuito já abria o ADM sem esses arquivos (403 ignorado pelo carregador).
 adm:['content/adm/adm-native-index.js?v=20261102admguide1','content/adm/adm-sharing-links.js?v=20261008admsharing1','content/adm/adm-session-index.js?v=20261024admsessoes1','ui/adm-native-layer.js?v=20261121adm-m03-artes1']
};
window.CentralTheoryFiles=groups;
if(window.CentralDisciplineLoader){window.loadCentralTheoryGroup=function(id){return window.CentralDisciplineLoader.load(id)};return;}
var states={};

function setBusy(id,busy,failed){
 var section=document.querySelector('.subject[data-id="'+id+'"]');
 if(!section)return;
 var head=section.querySelector('.subject-head');
 if(head)head.setAttribute('aria-busy',busy?'true':'false');
 var old=section.querySelector('.central-lazy-status');
 if(old)old.remove();
 if(!busy&&!failed)return;
 var note=document.createElement('div');
 note.className='central-lazy-status';
 note.textContent=failed?'Não foi possível carregar a teoria. Toque novamente para tentar.':'Carregando a teoria completa…';
 var body=section.querySelector('.subject-body');
 if(body)body.insertBefore(note,body.firstChild);
}

function loadGroup(id){
 if(states[id]==='ready')return Promise.resolve();
 if(states[id]&&typeof states[id].then==='function')return states[id];
 var files=groups[id];
 if(!files)return Promise.resolve();
 setBusy(id,true,false);
 var pending=new Promise(function(resolve,reject){
  var remaining=files.length,failed=false;
  files.forEach(function(src){
   var script=document.createElement('script');
   script.src='/'+src;
   script.async=false;
   script.onload=function(){remaining-=1;if(!remaining){failed?reject(new Error('Falha ao carregar teoria')):resolve()}};
   script.onerror=function(){failed=true;remaining-=1;if(!remaining)reject(new Error('Falha ao carregar '+src))};
   document.body.appendChild(script);
  });
 });
 states[id]=pending.then(function(){states[id]='ready';setBusy(id,false,false)}).catch(function(error){states[id]=null;setBusy(id,false,true);console.error('[Central] teoria sob demanda',error);throw error});
 return states[id];
}

window.loadCentralTheoryGroup=loadGroup;

function preloadCore(){
 loadGroup('cpc').catch(function(){});
 loadGroup('adm').catch(function(){});
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',preloadCore,{once:true});
else preloadCore();

document.addEventListener('click',function(event){
 var head=event.target&&event.target.closest?event.target.closest('.subject-head'):null;
 if(!head)return;
 var section=head.closest('.subject[data-id]');
 if(section&&groups[section.dataset.id])loadGroup(section.dataset.id).catch(function(){});
},true);

function warmOffline(){
 if(!('serviceWorker' in navigator))return;
 navigator.serviceWorker.ready.then(function(){
  var files=groups.civil.concat(groups.cpc,groups.adm),index=0;
  function next(){
   if(index>=files.length)return;
   fetch('/'+files[index++],{cache:'force-cache'}).catch(function(){}).then(function(){setTimeout(next,40)});
  }
  if('requestIdleCallback' in window)requestIdleCallback(next,{timeout:10000});
  else setTimeout(next,10000);
 }).catch(function(){});
}
if(document.readyState==='complete')warmOffline();
else window.addEventListener('load',warmOffline,{once:true});

var style=document.createElement('style');
style.textContent='.central-lazy-status{margin:10px 0;padding:10px 12px;border:1px solid rgba(109,93,252,.35);border-radius:10px;background:rgba(109,93,252,.08);font:700 12px/1.4 system-ui;color:inherit}.subject-head[aria-busy="true"]{cursor:progress}';
document.head.appendChild(style);
})();
