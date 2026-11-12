(function(){
'use strict';
if(window.__PORTUGUES_M2_VERTICAL_TABS_V1__)return;
window.__PORTUGUES_M2_VERTICAL_TABS_V1__=true;
function apply(){
  if(document.getElementById('pt-m2-vertical-tabs-v1-style'))return;
  var e=document.createElement('style');
  e.id='pt-m2-vertical-tabs-v1-style';
  e.textContent='.ptm2-tabs{display:grid!important;grid-template-columns:minmax(0,1fr)!important;gap:7px!important;align-items:stretch!important}.ptm2-tab{width:100%!important;text-align:left!important;display:block!important}';
  document.head.appendChild(e);
}
apply();
})();
