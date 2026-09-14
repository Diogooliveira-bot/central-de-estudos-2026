/* Central de Estudos — v6.6.126 ajuste persistente da fonte da leitura */
(function(){
  'use strict';

  var STORAGE_KEY='central-v6:reading-font-size';
  var MIN=85;
  var MAX=135;
  var STEP=5;
  var DEFAULT=100;

  function clamp(value){
    value=Math.round(Number(value)/STEP)*STEP;
    return Math.max(MIN,Math.min(MAX,value||DEFAULT));
  }

  function read(){
    try{return clamp(localStorage.getItem(STORAGE_KEY)||DEFAULT)}catch(_){return DEFAULT}
  }

  function save(value){
    try{localStorage.setItem(STORAGE_KEY,String(value))}catch(_){}
  }

  function refreshControl(value){
    var range=document.getElementById('centralReadingFontRange');
    var output=document.getElementById('centralReadingFontValue');
    if(range)range.value=String(value);
    if(output)output.textContent=value+'%';
  }

  function apply(value,persist){
    value=clamp(value);
    var scale=value/100;
    var root=document.documentElement;
    root.dataset.centralReadingFont=String(value);
    root.style.setProperty('--central-reading-font-large',(16*scale).toFixed(1)+'px');
    root.style.setProperty('--central-reading-font-medium',(13*scale).toFixed(1)+'px');
    if(persist!==false)save(value);
    refreshControl(value);
    return value;
  }

  function change(delta){return apply(read()+Number(delta||0),true)}

  function injectControl(){
    var body=document.querySelector('.central-settings-body');
    if(!body||document.getElementById('centralReadingFontPanel'))return;
    var backupLabel=Array.from(body.querySelectorAll('.central-setting-label')).find(function(label){
      return label.textContent.trim().toLowerCase()==='backup geral';
    });
    var panel=document.createElement('div');
    panel.id='centralReadingFontPanel';
    panel.className='central-reading-font-panel';
    panel.innerHTML='<span class="central-setting-label">Fonte da leitura</span>'+
      '<div class="central-reading-font-control">'+
       '<button type="button" class="central-reading-font-button" onclick="centralReadingFontChange(-5)" aria-label="Diminuir fonte">A−</button>'+
       '<input id="centralReadingFontRange" class="central-reading-font-range" type="range" min="85" max="135" step="5" aria-label="Tamanho da fonte da leitura" oninput="centralReadingFontSet(this.value)">'+
       '<button type="button" class="central-reading-font-button" onclick="centralReadingFontChange(5)" aria-label="Aumentar fonte">A+</button>'+
      '</div>'+
      '<div class="central-reading-font-meta"><output id="centralReadingFontValue" class="central-reading-font-value">100%</output><button type="button" class="central-reading-font-reset" onclick="centralReadingFontSet(100)">Padrão</button></div>';
    if(backupLabel)body.insertBefore(panel,backupLabel);
    else body.appendChild(panel);
    refreshControl(read());
  }

  window.centralReadingFontSet=function(value){return apply(value,true)};
  window.centralReadingFontChange=change;

  apply(read(),false);
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',injectControl,{once:true});
  else injectControl();
})();
