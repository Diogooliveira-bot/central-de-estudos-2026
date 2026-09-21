(function(){
'use strict';
if(window.__PORTUGUES_M2_TEC_LINK_V1__)return;
window.__PORTUGUES_M2_TEC_LINK_V1__=true;
var TEC_URL='https://www.tecconcursos.com.br/questoes/cadernos/101827083';
var oldRender=window.renderPortugueseMaster;
if(typeof oldRender!=='function')return;
window.renderPortugueseMaster=function(){
 var html=oldRender.apply(this,arguments);
 if(typeof html!=='string')return html;
 return html.replace('<span>TEC principal: PORT 05</span>','<a href="'+TEC_URL+'" target="_blank" rel="noopener">Abrir TEC PORT 05 · 177 questões ↗</a>');
};
})();