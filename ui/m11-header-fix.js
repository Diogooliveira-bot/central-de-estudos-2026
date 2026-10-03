(function(){
  function fix(){
    var m=document.querySelector('#subjects .subject[data-id="penal"] .cf-module[data-cf="p11"]');
    if(!m)return;
    var t=m.querySelector('.cf-module-title'); if(t)t.textContent='Crimes contra a Fé Pública';
    var s=m.querySelector('.cf-module-subtitle'); if(s)s.textContent='CP, arts. 289 a 311-A';
  }
  fix(); setTimeout(fix,120);
})();