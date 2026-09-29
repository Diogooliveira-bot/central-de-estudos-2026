(function(){
'use strict';
if(window.__baseCpcFinal20260928)return;
window.__baseCpcFinal20260928=true;
var original=window.renderCpcModule;
if(typeof original!=='function'){console.error('CPC final: renderer não encontrado');return}

function installVisualPolish(){
 var style=document.getElementById('cpc-visual-polish');
 if(style){document.head.appendChild(style);return;}
 style=document.createElement('style');
 style.id='cpc-visual-polish';
 style.textContent=[
  '/* CPC — hierarquia visual v2 */',
  '.home-grid:has(.subject.open){grid-template-columns:minmax(0,1fr)!important}',
  '.home-grid:has(.subject.open) .side-col{display:none!important}',
  '.subject[data-id="cpc"]{max-width:1120px;margin-inline:auto}',
  '.subject[data-id="cpc"] .subject-body{padding:0 16px 20px}',
  '.subject[data-id="cpc"] .cf-module-body{padding:0 4px 16px}',
  '.subject[data-id="cpc"] .cf-module-head{min-height:62px;padding:13px 15px}',
  '.subject[data-id="cpc"] .cf-steps{gap:10px}',
  '.subject[data-id="cpc"] .cf-step{border-radius:10px}',
  '.subject[data-id="cpc"] .cf-step-head{padding:12px 13px}',
  '.subject[data-id="cpc"] .cf-step-body{padding:0 13px 13px}',
  '.subject[data-id="cpc"] .cf-reading{border-left-width:3px;padding:12px}',
  '.subject[data-id="cpc"] .cf-theory-grid{gap:10px;margin-top:4px}',
  '.subject[data-id="cpc"] .base-cpc-full{border:1px solid #2c6680!important;border-radius:12px!important;background:#0b2335!important;overflow:hidden;box-shadow:0 10px 24px rgba(0,21,35,.16)}',
  '.subject[data-id="cpc"] .base-cpc-full>summary{padding:13px 15px;min-height:48px;display:flex;align-items:center;gap:8px;background:linear-gradient(90deg,#102f45,#0d2639);color:#f2fcff!important;font-size:12px;letter-spacing:.01em}',
  '.subject[data-id="cpc"] .base-cpc-full>summary::marker{color:#2bdce6}',
  '.subject[data-id="cpc"] .base-cpc-full .cf-theory-text{padding:10px;background:#0b2335!important;color:#c3dce5!important}',
  '.subject[data-id="cpc"] .base-cpc-full iframe{display:block;width:100%!important;min-height:720px;height:auto;border:0!important;border-radius:8px;background:#fffdf8!important;box-shadow:0 2px 8px rgba(0,0,0,.12)}',
  '.subject[data-id="cpc"] .cf-actions{gap:8px;margin-top:12px;padding-top:2px}',
  '.subject[data-id="cpc"] .cf-btn{min-height:40px;padding:9px 13px;border-radius:9px;font-size:11px;line-height:1.2}',
  '.subject[data-id="cpc"] .cf-btn:not(.primary):not(.good):not(.bad){background:#15364b;border-color:#39708a;color:#effcff!important}',
  '.subject[data-id="cpc"] .cf-btn.primary{background:linear-gradient(135deg,#007d9f,#14bdce)!important;border-color:#39dce4!important;color:#fff!important;box-shadow:0 5px 14px rgba(0,140,177,.2)}',
  '.subject[data-id="cpc"] .cf-btn.good{background:#0d5b43;border-color:#2caa80;color:#e2fff3!important}',
  '.subject[data-id="cpc"] .cf-btn.bad{background:#6a2937;border-color:#c05b69;color:#fff1f3!important}',
  '.subject[data-id="cpc"] .cpc-coverage-warning{background:#332c22!important;border-color:#9a7548!important;color:#ffe7b5!important;border-radius:9px}',
  '.subject[data-id="cpc"] .cf-resource-grid{gap:10px}',
  '.subject[data-id="cpc"] .cf-resource-box{border-radius:10px;padding:11px;background:#0e2a3d!important}',
  '@media(max-width:680px){',
    '.subject[data-id="cpc"] .cf-module{background:#0b2335!important;border-color:#2c6680!important;color:#effcff!important}',
  '.subject[data-id="cpc"] .cf-module.open{border-color:#3b8ba1!important}',
  '.subject[data-id="cpc"] .cf-module-head{background:#0b2335!important;color:#effcff!important;border:0!important}',
  '.subject[data-id="cpc"] .cf-module-head:hover{background:#123149!important}',
  '.subject[data-id="cpc"] .cf-module-no,.subject[data-id="cpc"] .cf-module-title{color:#effcff!important}',
  '.subject[data-id="cpc"] .cf-module-stat{color:#bdd8e3!important}',
  '.subject[data-id="cpc"] .cf-module-body{background:#0b2335!important;color:#effcff!important}',
  '.subject[data-id="cpc"] .cf-module-bar{background:#17435a!important}',
' .home-grid:has(.subject.open){grid-template-columns:minmax(0,1fr)!important}',
  ' .subject[data-id="cpc"] .subject-body{padding:0 10px 16px}',
  ' .subject[data-id="cpc"] .cf-module-head{grid-template-columns:1fr 22px;gap:6px}',
  ' .subject[data-id="cpc"] .cf-module-stat{grid-column:1;text-align:left;margin-top:-4px}',
  ' .subject[data-id="cpc"] .cf-resource-grid{grid-template-columns:1fr}',
  ' .subject[data-id="cpc"] .cf-actions .cf-btn{flex:1 1 140px}',
  ' .subject[data-id="cpc"] .base-cpc-full iframe{min-height:620px}',
  '}'
 ].join('');
 document.head.appendChild(style);
}

function polishReader(frame){
 if(!frame||frame.dataset.cpcReaderPolished==='1')return;
 var apply=function(){
  try{
   var doc=frame.contentDocument;
   if(!doc||!doc.head)return;
   if(doc.getElementById('cpc-reader-polish'))return;
   var style=doc.createElement('style');
   style.id='cpc-reader-polish';
   style.textContent=[
    '/* Leitura CPC — contraste fixo e superfície clara */',
    ':root{color-scheme:light!important}',
    'html,body{background:#fffdf8!important;color:#24312d!important}',
    'body{font-family:Inter,system-ui,-apple-system,"Segoe UI",sans-serif!important}',
    'article{max-width:920px!important;margin:0 auto!important}',
    'h1,h2,h3,h4{color:#174f47!important}',
    'h2,hr{border-color:#d8e8e0!important}',
    'p,li{color:#24312d!important}',
    'a{color:#176b72!important}',
    'blockquote{background:#edf8f2!important;border-left-color:#2c8c72!important}',
    'th,td{border-color:#cbd8d1!important}',
    'th{background:#e6f4ed!important;color:#173d36!important}',
    'pre{background:#f0f4f1!important;color:#24312d!important}',
    '@media(max-width:650px){body{font-size:15px!important;line-height:1.75!important}}'
   ].join('');
   doc.head.appendChild(style);
   frame.dataset.cpcReaderPolished='1';
  }catch(_){}
 };
 frame.addEventListener('load',apply,{once:false});
 setTimeout(apply,80);
}



function cleanCpcSubtitle(){
 document.querySelectorAll('.subject[data-id="cpc"] .cf-step-copy small').forEach(function(el){
  if(/Teoria desenvolvida integral do módulo auditado/.test(el.textContent))el.textContent='Teoria desenvolvida integral do módulo auditado; depois vêm as questões e o resumo.';
 });
}

function syncOpenLayout(){
 var cpc=document.querySelector('.subject[data-id="cpc"]');
 var grid=cpc&&cpc.closest('.home-grid');
 if(!grid)return;
 var side=grid.querySelector('.side-col');
 cleanCpcSubtitle();
 var open=!!(cpc&&cpc.classList.contains('open'));
 grid.style.setProperty('grid-template-columns',open?'minmax(0,1fr)':'','important');
 if(side)side.style.setProperty('display',open?'none':'','important');
}
document.addEventListener('click',function(event){
 setTimeout(syncOpenLayout,0);
},true);

installVisualPolish();
window.addEventListener('load',installVisualPolish);
window.addEventListener('load',syncOpenLayout);
setTimeout(installVisualPolish,250);

window.renderCpcModule=function(w){
 var markup=original(w).replace(/30\\/07\\/2027/g,'31/07/2027');
 if(!w||!/^cpc(?:[1-9]|1[0-9]|20)$/.test(w.id))return markup;
 var no=String(w.num).padStart(2,'0');
 var moduleOpen=typeof cpcModuleOpenKey==='function'&&localStorage.getItem(cpcModuleOpenKey(w.id))==='1';
 var openAttr=moduleOpen?' open':'';
 var srcAttr=moduleOpen?' src="/cpc-final-20260928/M'+no+'.html"':'';
 var panel='<div class="cf-theory-grid"><details class="cf-theory cpc-apostila-topic base-cpc-full" data-cpc-doc="M'+no+'"'+openAttr+'><summary>Teoria completa • M'+no+' (módulo auditado)</summary><div class="cf-theory-text"><iframe title="Teoria completa de Processo Civil M'+no+'" loading="lazy"'+srcAttr+' data-cpc-src="/cpc-final-20260928/M'+no+'.html" style="display:block;width:100%;height:620px;border:0;background:#fffdf8"></iframe></div></details></div>';
 try{
  var parser=new DOMParser();
  var doc=parser.parseFromString('<div id="cpc-render-host">'+markup+'</div>','text/html');
  var host=doc.getElementById('cpc-render-host');
  var target=Array.prototype.slice.call(host.querySelectorAll('.cf-step')).find(function(step){
   var heading=step.querySelector('.cf-step-copy b');
   return heading&&heading.textContent.trim()==='Teoria nuclear';
  });
  if(target){
   var heading=target.querySelector('.cf-step-copy b');
   if(heading)heading.textContent='Teoria completa';
   var small=target.querySelector('.cf-step-copy small');
   if(small)small.textContent='Teoria desenvolvida integral do módulo auditado; depois vêm as questões e o resumo.';
   var grid=target.querySelector('.cf-theory-grid');
   if(grid)grid.outerHTML=panel;
   return host.innerHTML;
  }
 }catch(error){console.error('CPC final: normalização do módulo',error)}
 return markup;
};
function openFullTheory(module){
 var detail=module&&module.querySelector?module.querySelector('.base-cpc-full'):null;
 if(!detail)return;
 detail.open=true;
 var frame=detail.querySelector('iframe[data-cpc-src]');
 if(frame){
  if(!frame.src)frame.src=frame.dataset.cpcSrc;
  polishReader(frame);
 }
}
document.addEventListener('click',function(event){
 var head=event.target&&event.target.closest?event.target.closest('.cf-module-head'):null;
 if(!head)return;
 setTimeout(function(){
  var module=head.closest('.cf-module');
  if(module&&module.classList.contains('open'))openFullTheory(module);
 },0);
},true);
document.addEventListener('toggle',function(event){
 var detail=event.target;
 if(!detail.matches?.('.base-cpc-full')||!detail.open)return;
 var frame=detail.querySelector('iframe[data-cpc-src]');
 if(frame){
  if(!frame.src)frame.src=frame.dataset.cpcSrc;
  polishReader(frame);
 }
},true);
window.addEventListener('message',function(event){
 if(event.origin!==location.origin||event.data?.type!=='base-cpc-doc-height')return;
 var mod=event.data.module;
 if(!/^M(?:0[1-9]|1[0-9]|20)$/.test(mod))return;
 var h=Number(event.data.height);
 if(!Number.isFinite(h)||h<400||h>100000)return;
 document.querySelectorAll('.base-cpc-full[data-cpc-doc="'+mod+'"] iframe').forEach(function(frame){
  if(frame.contentWindow===event.source)frame.style.height=(h+12)+'px';
 });
});
try{if(typeof window.renderAll==='function')window.renderAll()}catch(error){console.error('CPC final: atualização de tela',error)}
var cpcLayoutTimer=setInterval(syncOpenLayout,250);setTimeout(function(){clearInterval(cpcLayoutTimer)},6000);
})();