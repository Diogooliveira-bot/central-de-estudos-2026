/* Central de Estudos — v6.6.126 ajuste persistente da fonte da leitura */
(function(){
  'use strict';

  var STORAGE_KEY='central-v6:reading-font-size';
  var MIN=85;
  var MAX=135;
  var STEP=5;
  var DEFAULT=100;
  var observer=null;
  var refreshTimer=0;
  var LARGE_SELECTORS=[
    '#homeView .ct-rich .ct-lead','#homeView .ct-section p','#homeView .ct-section li',
    '#homeView .ct-callout p','#homeView .ct-callout li','#homeView .cf-reading strong',
    '#homeView .cf-reading li','#homeView .cf-theory-text','#homeView .cf-advanced div',
    '#homeView .cf-notes','#homeView .cpc-law-card p','#homeView .cpc-law-card li'
  ].join(',');
  var MEDIUM_SELECTORS=[
    '#homeView .pt-lesson-section p','#homeView .pt-lesson-section li','#homeView .pt-reading-text',
    '#homeView .civil-a-card p','#homeView .civil-a-list','#homeView .civil-theory p',
    '#homeView .civil-theory li','#homeView .civil-law-card span'
  ].join(',');

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

  function forceReadingText(value){
    var scale=value/100;
    var large=(16*scale).toFixed(1)+'px';
    var medium=(13*scale).toFixed(1)+'px';
    document.querySelectorAll(LARGE_SELECTORS).forEach(function(element){
      element.style.setProperty('font-size',large,'important');
    });
    document.querySelectorAll(MEDIUM_SELECTORS).forEach(function(element){
      element.style.setProperty('font-size',medium,'important');
    });
  }

  function apply(value,persist){
    value=clamp(value);
    var scale=value/100;
    var root=document.documentElement;
    root.dataset.centralReadingFont=String(value);
    root.style.setProperty('--central-reading-font-large',(16*scale).toFixed(1)+'px');
    root.style.setProperty('--central-reading-font-medium',(13*scale).toFixed(1)+'px');
    forceReadingText(value);
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

  function watchReading(){
    var home=document.getElementById('homeView');
    if(!home||observer||typeof MutationObserver==='undefined')return;
    observer=new MutationObserver(function(){
      clearTimeout(refreshTimer);
      refreshTimer=setTimeout(function(){forceReadingText(read())},30);
    });
    observer.observe(home,{childList:true,subtree:true});
  }

  function ready(){
    injectControl();
    forceReadingText(read());
    watchReading();
  }

  window.centralReadingFontSet=function(value){return apply(value,true)};
  window.centralReadingFontChange=change;

  apply(read(),false);
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',ready,{once:true});
  else ready();
})();
