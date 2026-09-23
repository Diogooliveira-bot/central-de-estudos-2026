/* BASE COMPLETA — resolução única de tema */
(function(){
  'use strict';
  if(window.__bcThemeV1)return;window.__bcThemeV1=true;
  var media=window.matchMedia?window.matchMedia('(prefers-color-scheme: dark)'):null;
  function requested(){
    try{
      var saved=typeof window.centralThemeMode==='function'?String(window.centralThemeMode()||'').toLowerCase():'';
      if(saved==='oled'||saved==='dark'||saved==='light'||saved==='system')return saved;
    }catch(_){}
    var root=document.documentElement;
    var value=(root.getAttribute('data-central-theme')||root.getAttribute('data-theme')||'').toLowerCase();
    if(value==='oled'||value==='dark'||value==='light'||value==='system')return value;
    return 'dark';
  }
  function palette(theme){
    if(theme==='dark')return {bg:'#07141C',surface:'#0E2531',text:'#F1F5F9',text2:'#B6C6CF',border:'#29424F',primary:'#2DD4BF',accent:'#22D3EE'};
    if(theme==='oled')return {bg:'#000000',surface:'#091116',text:'#F8FAFC',text2:'#C3D0D7',border:'#23323B',primary:'#2DD4BF',accent:'#22D3EE'};
    return {bg:'#F7FAFC',surface:'#FFFFFF',text:'#0F172A',text2:'#475569',border:'#CBD5E1',primary:'#0F766E',accent:'#0E7490'};
  }
  function applyFrame(frame,resolved){
    try{
      var doc=frame.contentDocument;if(!doc)return;
      var p=palette(resolved);
      var style=doc.getElementById('base-completa-font-bridge');
      if(!style){style=doc.createElement('style');style.id='base-completa-font-bridge';(doc.head||doc.documentElement).appendChild(style)}
      style.textContent=':root{--bc-color-bg:'+p.bg+';--bc-color-surface:'+p.surface+';--bc-color-text:'+p.text+';--bc-color-text-secondary:'+p.text2+';--bc-color-border:'+p.border+';--bc-color-primary:'+p.primary+';--bc-color-accent:'+p.accent+'}html,body,button,input,textarea,select{font-family:Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Arial,sans-serif!important}html,body{background:'+p.bg+';color:'+p.text+'}';
      doc.documentElement.setAttribute('data-bc-theme',resolved);
    }catch(_){}
  }
  function applyFrames(resolved){
    document.querySelectorAll('iframe').forEach(function(frame){
      applyFrame(frame,resolved);
      if(!frame.dataset.bcThemeBound){frame.dataset.bcThemeBound='1';frame.addEventListener('load',function(){applyFrame(frame,document.documentElement.getAttribute('data-bc-theme')||resolved)})}
    });
  }
  function resolve(){
    var value=requested(),resolved=value;
    if(value==='system')resolved=media&&media.matches?'dark':'light';
    document.documentElement.setAttribute('data-bc-theme',resolved);
    document.documentElement.setAttribute('data-bc-theme-choice',value);
    applyFrames(resolved);
    document.dispatchEvent(new CustomEvent('bc:themechange',{detail:{choice:value,resolved:resolved}}));
    return resolved;
  }
  var obs=new MutationObserver(function(mutations){
    for(var i=0;i<mutations.length;i++){
      if(mutations[i].attributeName==='data-central-theme'||mutations[i].attributeName==='data-theme'){resolve();break}
    }
  });
  obs.observe(document.documentElement,{attributes:true,attributeFilter:['data-central-theme','data-theme']});
  if(media&&media.addEventListener)media.addEventListener('change',function(){if(requested()==='system')resolve()});
  else if(media&&media.addListener)media.addListener(function(){if(requested()==='system')resolve()});
  window.bcResolveTheme=resolve;
  resolve();
})();