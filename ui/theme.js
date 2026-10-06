/* BASE COMPLETA — resolução global dos sete temas */
(function(){
  'use strict';
  if(window.__bcThemeV2)return;window.__bcThemeV2=true;
  var KEY='central-v6:appearance';
  var THEMES=['paper-yellow','paper-white','sage-study','editorial-gray','legal-mist','dark-premium','oled-black'];
  var LEGACY={light:'paper-white',dark:'dark-premium',oled:'oled-black'};
  var PALETTES={
    'paper-yellow':{bg:'#F4ECDD',surface:'#FFF9ED',soft:'#EEE4D2',card:'#FFFDF7',border:'#D8CAB3',text:'#2D2924',muted:'#726B61',accent:'#0F8B8D',accentSoft:'#D7EFEB',button:'#0D7779',buttonText:'#FFFFFF',track:'#DED4C3',fill:'#10A5A6'},
    'paper-white':{bg:'#F8F7F3',surface:'#FFFEFB',soft:'#F2F0EA',card:'#FFFFFF',border:'#DDD8CE',text:'#20282D',muted:'#667177',accent:'#0E8583',accentSoft:'#DDF2EF',button:'#0D7777',buttonText:'#FFFFFF',track:'#E2E3DF',fill:'#0FA4A3'},
    'sage-study':{bg:'#EAF0E9',surface:'#F5F9F4',soft:'#DEE8DF',card:'#FAFCF9',border:'#C8D5CA',text:'#22312B',muted:'#627168',accent:'#176F6B',accentSoft:'#D3EBE5',button:'#175F5D',buttonText:'#FFFFFF',track:'#D2DED3',fill:'#198E87'},
    'editorial-gray':{bg:'#EFF0EF',surface:'#F8F8F7',soft:'#E5E7E6',card:'#FFFFFF',border:'#D1D4D2',text:'#252B2D',muted:'#687174',accent:'#167E82',accentSoft:'#D8ECED',button:'#146E72',buttonText:'#FFFFFF',track:'#DADDDC',fill:'#159CA0'},
    'legal-mist':{bg:'#EAF0F5',surface:'#F4F8FB',soft:'#DDE7EF',card:'#FAFCFE',border:'#C7D4DE',text:'#20303C',muted:'#617280',accent:'#0F8087',accentSoft:'#D6ECEE',button:'#116C73',buttonText:'#FFFFFF',track:'#D1DDE5',fill:'#10A0A6'},
    'dark-premium':{bg:'#071820',surface:'#0B222C',soft:'#102D38',card:'#0E2833',border:'#294753',text:'#F1F6F7',muted:'#A9BDC4',accent:'#31C9C0',accentSoft:'#123C40',button:'#2CC3BB',buttonText:'#042326',track:'#223B46',fill:'#32D0C6'},
    'oled-black':{bg:'#000000',surface:'#060A0C',soft:'#0C1215',card:'#090E11',border:'#242D31',text:'#F4F8F9',muted:'#ABB8BD',accent:'#2AD0C5',accentSoft:'#0B3333',button:'#2AD0C5',buttonText:'#001817',track:'#1A2327',fill:'#2AD9CE'}
  };
  function requested(){
    var saved='';
    try{saved=typeof window.centralThemeMode==='function'?String(window.centralThemeMode()||''):String(localStorage.getItem(KEY)||'')}catch(_){}
    if(saved==='system')saved=window.matchMedia&&window.matchMedia('(prefers-color-scheme: dark)').matches?'dark-premium':'paper-white';
    saved=LEGACY[saved]||saved;
    return THEMES.indexOf(saved)>=0?saved:'paper-yellow';
  }
  function bridgeCss(p){return ':root{--bg:'+p.bg+';--surface:'+p.surface+';--surface-soft:'+p.soft+';--card:'+p.card+';--border:'+p.border+';--text:'+p.text+';--text-muted:'+p.muted+';--accent:'+p.accent+';--accent-soft:'+p.accentSoft+';--button-bg:'+p.button+';--button-text:'+p.buttonText+';--progress-track:'+p.track+';--progress-fill:'+p.fill+';--bc-color-bg:'+p.bg+';--bc-color-bg-secondary:'+p.soft+';--bc-color-surface:'+p.card+';--bc-color-surface-elevated:'+p.surface+';--bc-color-border:'+p.border+';--bc-color-text:'+p.text+';--bc-color-text-secondary:'+p.muted+';--bc-color-primary:'+p.button+';--bc-color-accent:'+p.accent+';--panel:'+p.surface+';--panel2:'+p.card+';--soft:'+p.soft+';--line:'+p.border+';--line2:'+p.border+';--ink:'+p.text+';--muted:'+p.muted+';--purple:'+p.accent+';--purple2:'+p.button+'}html,body,button,input,textarea,select{font-family:Inter,"Segoe UI",Roboto,Helvetica,Arial,sans-serif!important}html,body,#app,.app,.workspace,.view,.vm-shell,.vm-main{background:'+p.bg+'!important;color:'+p.text+'!important}.card,.panel,.subject,.module,.vm-header,.vm-sidebar,.vm-toolbar,.vm-intro,.vm-article,.vm-index,.modal,[role="dialog"],table{background:'+p.card+'!important;color:'+p.text+'!important;border-color:'+p.border+'!important}input,textarea,select,button{border-color:'+p.border+'}.muted,small,.meta,.hint{color:'+p.muted+'!important}.btn.primary,.primary,.vm-filter.active{background:'+p.button+'!important;color:'+p.buttonText+'!important;border-color:'+p.button+'!important}.progress-line,.subject-bar,.cf-module-bar,.cf-qbar,.anki-duo-progress,.ct-meter{background:'+p.track+'!important}.progress-line>span,.subject-bar>span,.cf-module-bar>span,.cf-qbar>span,.anki-duo-progress>span,.ct-meter>span{background:'+p.fill+'!important}';}
  function applyFrame(frame,theme){
    try{
      var doc=frame.contentDocument;if(!doc)return;
      var style=doc.getElementById('base-completa-theme-bridge');
      if(!style){style=doc.createElement('style');style.id='base-completa-theme-bridge';(doc.head||doc.documentElement).appendChild(style)}
      style.textContent=bridgeCss(PALETTES[theme]);
      doc.documentElement.setAttribute('data-central-theme',theme);doc.documentElement.setAttribute('data-bc-theme',theme);
      doc.documentElement.style.colorScheme=/^(dark-premium|oled-black)$/.test(theme)?'dark':'light';
    }catch(_){}
  }
  function applyFrames(theme){
    document.querySelectorAll('iframe').forEach(function(frame){
      applyFrame(frame,theme);
      if(!frame.dataset.bcThemeBound){frame.dataset.bcThemeBound='1';frame.addEventListener('load',function(){applyFrame(frame,requested())})}
    });
  }
  function resolve(){
    var theme=requested(),root=document.documentElement;
    if(root.getAttribute('data-central-theme')!==theme)root.setAttribute('data-central-theme',theme);
    if(root.getAttribute('data-bc-theme')!==theme)root.setAttribute('data-bc-theme',theme);
    if(root.getAttribute('data-bc-theme-choice')!==theme)root.setAttribute('data-bc-theme-choice',theme);
    root.style.colorScheme=/^(dark-premium|oled-black)$/.test(theme)?'dark':'light';
    applyFrames(theme);
    document.dispatchEvent(new CustomEvent('bc:themechange',{detail:{choice:theme,resolved:theme}}));
    return theme;
  }
  var observer=new MutationObserver(function(records){
    if(records.some(function(record){return record.attributeName==='data-central-theme'||record.attributeName==='data-theme'}))resolve();
  });
  observer.observe(document.documentElement,{attributes:true,attributeFilter:['data-central-theme','data-theme']});
  window.bcResolveTheme=resolve;
  resolve();
})();
