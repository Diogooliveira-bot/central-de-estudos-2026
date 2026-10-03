(function(){
  function fix(){
    var m=document.querySelector('#subjects .subject[data-id="penal"] .cf-module[data-cf="p10"]');
    if(!m)return;
    var t=m.querySelector('.cf-module-title');
    if(t)t.textContent='Crimes contra o Patrimônio';
    var s=m.querySelector('.cf-module-subtitle');
    if(s)s.textContent='CP, arts. 155 a 183-A';
  }
  fix();
  setTimeout(fix,120);
})();