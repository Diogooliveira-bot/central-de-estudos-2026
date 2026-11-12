(function(){
  function fix(){
    var m=document.querySelector('#subjects .subject[data-id="penal"] .cf-module[data-cf="p12"]');
    if(!m)return;
    var t=m.querySelector('.cf-module-title'); if(t)t.textContent='Crimes contra a Dignidade Sexual';
    var s=m.querySelector('.cf-module-subtitle'); if(s)s.textContent='CP, arts. 213 a 234-B';
  }
  fix(); setTimeout(fix,120);
})();