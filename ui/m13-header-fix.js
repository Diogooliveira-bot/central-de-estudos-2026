(function(){
  function fix(){
    var m=document.querySelector('#subjects .subject[data-id="penal"] .cf-module[data-cf="p13"]');
    if(!m)return;
    var t=m.querySelector('.cf-module-title'); if(t)t.textContent='Crimes contra a Administração Pública';
    var s=m.querySelector('.cf-module-subtitle'); if(s)s.textContent='CP, arts. 312 a 359-H';
  }
  fix(); setTimeout(fix,120);
})();