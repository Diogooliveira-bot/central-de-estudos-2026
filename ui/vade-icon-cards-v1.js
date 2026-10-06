(function(){
'use strict';

var ICONS={
 CF:'<path d="M3 10h18"/><path d="M5 10v10"/><path d="M9 10v10"/><path d="M15 10v10"/><path d="M19 10v10"/><path d="M2 20h20"/><path d="m12 3 9 5H3l9-5Z"/>',
 CC:'<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M4 4v15.5"/><path d="M6.5 2H20v15H6.5A2.5 2.5 0 0 0 4 19.5"/>',
 CPC:'<path d="M12 4v16"/><path d="M5 8h14"/><path d="m5 8-3 6h6L5 8Z"/><path d="m19 8-3 6h6l-3-6Z"/>',
 CP:'<path d="m14 4 6 6"/><path d="m12 6 6 6"/><path d="m4 14 6 6"/><path d="m5 13 8-8 6 6-8 8-6-6Z"/><path d="M3 21h8"/>',
 CPP:'<path d="M12 3 20 6v6c0 5-3.4 8.2-8 9-4.6-.8-8-4-8-9V6l8-3Z"/><path d="m9 12 2 2 4-4"/>',
 CLT:'<rect x="3" y="7" width="18" height="13" rx="2"/><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><path d="M3 12h18"/>',
 NLLC:'<path d="M9 3h6l1 2h3v16H5V5h3l1-2Z"/><path d="m9 12 2 2 4-4"/>',
 LIA:'<path d="M12 3 20 6v6c0 5-3.4 8.2-8 9-4.6-.8-8-4-8-9V6l8-3Z"/><path d="M12 8v5"/><path d="M12 17h.01"/>',
 RJU:'<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/>',
 'PROCESSO ADM.':'<path d="M7 4h10"/><path d="M7 20h10"/><path d="M12 4v4"/><path d="M12 16v4"/><rect x="4" y="8" width="16" height="8" rx="2"/>',
 'PROCESSO ADM':'<path d="M7 4h10"/><path d="M7 20h10"/><path d="M12 4v4"/><path d="M12 16v4"/><rect x="4" y="8" width="16" height="8" rx="2"/>',
 LAI:'<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h8"/><path d="M14 2v6h6"/><circle cx="16" cy="16" r="3"/><path d="m18.5 18.5 2.5 2.5"/>',
 LINDB:'<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M4 4v15.5"/><path d="M6.5 2H20v15H6.5A2.5 2.5 0 0 0 4 19.5"/><path d="M9 6h7"/><path d="M9 10h7"/>'
};

var FALLBACK='<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z"/><path d="M14 2v6h6"/><path d="M8 13h8"/><path d="M8 17h6"/>';

function css(){
 return '.vm-quick-btn .vm-code.vm-professional-icon{width:52px;height:52px;min-width:52px;min-height:52px;padding:0;border-radius:13px;display:grid;place-items:center;background:linear-gradient(145deg,#18b5c8,#0784aa);color:#fff;box-shadow:0 7px 16px rgba(7,132,170,.16)}'+
 '.vm-quick-btn .vm-code.vm-professional-icon svg{width:27px;height:27px;display:block;fill:none;stroke:currentColor;stroke-width:1.9;stroke-linecap:round;stroke-linejoin:round}'+
 '@media(max-width:520px){.vm-quick-btn .vm-code.vm-professional-icon{width:48px;height:48px;min-width:48px;min-height:48px;border-radius:12px}.vm-quick-btn .vm-code.vm-professional-icon svg{width:25px;height:25px}}';
}

function decorate(doc){
 if(!doc||!doc.querySelectorAll)return;
 if(!doc.getElementById('bc-vade-professional-icons-style')){
  var s=doc.createElement('style');s.id='bc-vade-professional-icons-style';s.textContent=css();doc.head&&doc.head.appendChild(s);
 }
 doc.querySelectorAll('.vm-quick-btn .vm-code').forEach(function(el){
  if(el.classList.contains('vm-professional-icon'))return;
  var code=String(el.textContent||'').trim().toUpperCase().replace(/\s+/g,' ');
  el.dataset.vmLawCode=code;
  el.innerHTML='<svg viewBox="0 0 24 24" aria-hidden="true">'+(ICONS[code]||FALLBACK)+'</svg>';
  el.classList.add('vm-professional-icon');
 });
}

function attach(frame){
 try{
  var doc=frame.contentDocument;if(!doc)return;
  decorate(doc);
  if(frame.__bcVadeIconObserver)frame.__bcVadeIconObserver.disconnect();
  frame.__bcVadeIconObserver=new MutationObserver(function(){decorate(doc)});
  frame.__bcVadeIconObserver.observe(doc.documentElement,{childList:true,subtree:true});
 }catch(e){console.warn('[Base Completa] ícones do Vade não puderam ser aplicados',e)}
}

function boot(){
 var frame=document.getElementById('vadeMecumFrame');
 if(!frame)return;
 frame.addEventListener('load',function(){attach(frame)});
 if(frame.contentDocument&&frame.contentDocument.readyState!=='loading')attach(frame);
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();