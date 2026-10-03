(function(){
  function fix(){
    var m=document.querySelector('#subjects .subject[data-id="penal"] .cf-module[data-cf="p17"]');
    if(!m)return;
    var t=m.querySelector('.cf-module-title'); if(t)t.textContent='Constituição Penal, Responsabilidade Penal da Pessoa Jurídica, Súmulas e Consolidação';
    var s=m.querySelector('.cf-module-subtitle'); if(s)s.textContent='CF, art. 5º; CF, art. 225, §3º; Lei 9.605/1998; súmulas STF/STJ';
  }
  fix(); setTimeout(fix,120);
})();