(function(){
'use strict';
if(window.__PT_M1_NO_ANKI_V1__)return;window.__PT_M1_NO_ANKI_V1__=true;

function clean(html){
  if(!html||typeof html!=='string')return html;
  var host=document.createElement('div');
  host.innerHTML=html;

  host.querySelectorAll('.ptm1-section').forEach(function(section){
    var text=(section.textContent||'').trim();
    if(/Anki seletivo/i.test(text))section.remove();
  });

  host.querySelectorAll('[data-ptm1] .ptm1-head small').forEach(function(el){
    el.textContent=(el.textContent||'').replace(/\s*·\s*Anki-base:\s*[^·]+$/i,'').trim();
  });

  host.querySelectorAll('[data-ptm1] li').forEach(function(li){
    if(/\bAnki\b/i.test(li.textContent||''))li.remove();
  });

  host.querySelectorAll('.ptm1-rev small').forEach(function(el){
    var text=(el.textContent||'').trim();
    if(/Anki/i.test(text)){
      if(/5–10 min/i.test(text))el.textContent='5–10 min, pontos marcados + revisão dirigida da teoria.';
      else if(/caderno de erros/i.test(text))el.textContent='Caderno de erros + ~10 questões do TEC.';
      else el.textContent=text.replace(/Anki\s*\+?\s*/gi,'');
    }
  });

  return host.innerHTML;
}

function install(){
  if(!window.PtM1V3||typeof window.PtM1V3.render!=='function')return setTimeout(install,60);
  if(window.PtM1V3.__noAnki)return;

  var baseRender=window.PtM1V3.render;
  window.PtM1V3.render=function(){return clean(baseRender())};
  window.PtM1V3.__noAnki=true;

  if(typeof window.renderPortugueseMaster==='function'){
    var baseMaster=window.renderPortugueseMaster;
    window.renderPortugueseMaster=function(){return clean(baseMaster())};
  }

  try{if(typeof window.renderSubjects==='function')window.renderSubjects()}catch(e){console.warn('[PT M1 NO ANKI]',e)}
}

if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',install,{once:true});else install();
})();
