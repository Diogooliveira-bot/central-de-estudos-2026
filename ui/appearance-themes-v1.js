/* BASE COMPLETA — integração visual dos sete temas */
(function(){
  'use strict';
  if(window.__bcAppearanceThemesV1)return;window.__bcAppearanceThemesV1=true;

  var KEY='central-v6:appearance';
  var THEMES=['paper-yellow','paper-white','sage-study','editorial-gray','legal-mist','dark-premium','oled-black'];
  var LEGACY={light:'paper-white',dark:'dark-premium',oled:'oled-black'};
  var progressSelector='.progress-line,.subject-bar,.cf-module-bar,.cf-qbar,.anki-duo-progress,.ct-meter,.bc-progress';

  function savedTheme(){
    var value='';
    try{value=localStorage.getItem(KEY)||''}catch(_){}
    if(value==='system')value=window.matchMedia&&window.matchMedia('(prefers-color-scheme: dark)').matches?'dark-premium':'paper-white';
    value=LEGACY[value]||value;
    return THEMES.indexOf(value)>=0?value:'paper-yellow';
  }

  function persistMigration(theme){
    try{if(localStorage.getItem(KEY)!==theme)localStorage.setItem(KEY,theme)}catch(_){}
  }

  function refreshCards(theme){
    document.querySelectorAll('.central-theme-card[data-theme-card]').forEach(function(card){
      var active=card.getAttribute('data-theme-card')===theme;
      card.classList.toggle('active',active);
      card.setAttribute('aria-current',active?'true':'false');
    });
    document.querySelectorAll('[data-central-theme-choice]').forEach(function(button){
      var active=button.getAttribute('data-central-theme-choice')===theme;
      button.classList.toggle('active',active);
      button.setAttribute('aria-pressed',active?'true':'false');
      button.textContent=active?'Tema ativo':'Aplicar tema';
    });
  }

  function apply(theme,save){
    theme=LEGACY[theme]||theme;
    if(THEMES.indexOf(theme)<0)theme='paper-yellow';
    if(save!==false){try{localStorage.setItem(KEY,theme)}catch(_){}}
    var root=document.documentElement;
    root.setAttribute('data-central-theme',theme);
    root.setAttribute('data-bc-theme',theme);
    root.style.colorScheme=theme==='dark-premium'||theme==='oled-black'?'dark':'light';
    refreshCards(theme);
    if(typeof window.bcResolveTheme==='function')window.bcResolveTheme();
    document.dispatchEvent(new CustomEvent('bc:appearancechange',{detail:{theme:theme}}));
    return theme;
  }

  function percentage(bar){
    var value=bar.getAttribute('aria-valuenow');
    if(value!==null&&value!=='')return Math.max(0,Math.min(100,Math.round(Number(value)||0)));
    var fill=bar.firstElementChild;
    if(!fill)return null;
    var raw=fill.style.width||fill.getAttribute('data-width')||'';
    var match=String(raw).match(/([\d.]+)%/);
    if(match)return Math.max(0,Math.min(100,Math.round(Number(match[1])||0)));
    var total=bar.getBoundingClientRect().width,current=fill.getBoundingClientRect().width;
    return total>0?Math.max(0,Math.min(100,Math.round(current/total*100))):null;
  }

  function enhanceProgress(root){
    var scope=root&&root.querySelectorAll?root:document;
    scope.querySelectorAll(progressSelector).forEach(function(bar){
      bar.classList.add('bc-global-progress');
      var pct=percentage(bar);
      if(pct!==null&&bar.getAttribute('data-progress-label')!==pct+'%')bar.setAttribute('data-progress-label',pct+'%');
    });
  }

  function init(){
    var themeSheet=Array.from(document.querySelectorAll('link[rel="stylesheet"]')).find(function(link){return /appearance-themes-v1\.css/.test(link.href)});
    if(themeSheet&&document.head.lastElementChild!==themeSheet)document.head.appendChild(themeSheet);
    var theme=savedTheme();persistMigration(theme);apply(theme,false);enhanceProgress(document);
    var observer=new MutationObserver(function(records){
      records.forEach(function(record){
        if(record.type==='childList')record.addedNodes.forEach(function(node){if(node.nodeType===1)enhanceProgress(node)});
        if(record.type==='attributes'&&record.target.closest&&record.target.closest(progressSelector))enhanceProgress(record.target.parentElement||document);
      });
    });
    observer.observe(document.body,{childList:true,subtree:true,attributes:true,attributeFilter:['style','aria-valuenow','class']});
  }

  window.bcAppearanceThemes={themes:THEMES.slice(),get:savedTheme,apply:function(theme){return apply(theme,true)}};
  document.addEventListener('bc:themechange',function(event){var theme=event.detail&&event.detail.choice;if(theme)refreshCards(LEGACY[theme]||theme)});
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
