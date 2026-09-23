/* BASE COMPLETA — resolução única de tema */
(function(){
  'use strict';
  if(window.__bcThemeV1)return;window.__bcThemeV1=true;
  var media=window.matchMedia?window.matchMedia('(prefers-color-scheme: dark)'):null;
  function requested(){
    var root=document.documentElement;
    var value=(root.getAttribute('data-central-theme')||root.getAttribute('data-theme')||'').toLowerCase();
    if(value==='oled'||value==='dark'||value==='light'||value==='system')return value;
    return 'dark';
  }
  function resolve(){
    var value=requested(),resolved=value;
    if(value==='system')resolved=media&&media.matches?'dark':'light';
    document.documentElement.setAttribute('data-bc-theme',resolved);
    document.documentElement.setAttribute('data-bc-theme-choice',value);
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