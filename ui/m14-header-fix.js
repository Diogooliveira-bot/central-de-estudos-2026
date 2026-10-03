(function(){
  function fix(){
    var m=document.querySelector('#subjects .subject[data-id="penal"] .cf-module[data-cf="p14"]');
    if(!m)return;
    var t=m.querySelector('.cf-module-title'); if(t)t.textContent='Abuso de Autoridade';
    var s=m.querySelector('.cf-module-subtitle'); if(s)s.textContent='Lei 13.869/2019';
  }
  fix(); setTimeout(fix,120);
})();