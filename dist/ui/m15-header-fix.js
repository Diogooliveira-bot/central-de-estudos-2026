(function(){
  function fix(){
    var m=document.querySelector('#subjects .subject[data-id="penal"] .cf-module[data-cf="p15"]');
    if(!m)return;
    var t=m.querySelector('.cf-module-title'); if(t)t.textContent='Lavagem de Dinheiro';
    var s=m.querySelector('.cf-module-subtitle'); if(s)s.textContent='Lei 9.613/1998';
  }
  fix(); setTimeout(fix,120);
})();