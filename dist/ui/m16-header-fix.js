(function(){
  function fix(){
    var m=document.querySelector('#subjects .subject[data-id="penal"] .cf-module[data-cf="p16"]');
    if(!m)return;
    var t=m.querySelector('.cf-module-title'); if(t)t.textContent='Crimes em Licitações e Contratos';
    var s=m.querySelector('.cf-module-subtitle'); if(s)s.textContent='CP, arts. 337-E a 337-P';
  }
  fix(); setTimeout(fix,120);
})();