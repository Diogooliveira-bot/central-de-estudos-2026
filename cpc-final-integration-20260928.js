(function(){
'use strict';
if(window.__baseCpcFinal20260928)return;
window.__baseCpcFinal20260928=true;
var original=window.renderCpcModule;
if(typeof original!=='function'){console.error('CPC final: renderer não encontrado');return}
window.renderCpcModule=function(w){
 var markup=original(w).replace(/30\/07\/2027/g,'31/07/2027');
 if(!w||!/^cpc(?:[1-9]|1[0-9]|20)$/.test(w.id))return markup;
 var start=markup.indexOf('<div class="cf-theory-grid">');
 var end=start<0?-1:markup.indexOf('<div class="cf-actions">',start);
 if(end<0)return markup;
 var no=String(w.num).padStart(2,'0');
 var moduleOpen=typeof cpcModuleOpenKey==='function'&&localStorage.getItem(cpcModuleOpenKey(w.id))==='1';
 var openAttr=moduleOpen?' open':'';
 var srcAttr=moduleOpen?' src="/cpc-final-20260928/M'+no+'.html"':'';
 var panel='<div class="cf-theory-grid"><details class="cf-theory cpc-apostila-topic base-cpc-full" data-cpc-doc="M'+no+'"'+openAttr+'><summary>Teoria completa • M'+no+' (módulo auditado)</summary><div class="cf-theory-text"><iframe title="Teoria completa de Processo Civil M'+no+'" loading="lazy"'+srcAttr+' data-cpc-src="/cpc-final-20260928/M'+no+'.html" style="display:block;width:100%;height:620px;border:0;background:#fffdf8"></iframe></div></details></div>';
 markup=markup.replace('>Teoria nuclear<','>Teoria completa<').replace('>Base completa antes da segunda bateria.<','>Teoria desenvolvida integral do módulo auditado; depois vêm as questões e o resumo.<');
 return markup.slice(0,start)+panel+markup.slice(end);
};
function openFullTheory(module){
 var detail=module&&module.querySelector?module.querySelector('.base-cpc-full'):null;
 if(!detail)return;
 detail.open=true;
 var frame=detail.querySelector('iframe[data-cpc-src]');
 if(frame&&!frame.src)frame.src=frame.dataset.cpcSrc;
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
 if(frame&&!frame.src){frame.src=frame.dataset.cpcSrc}
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
})();