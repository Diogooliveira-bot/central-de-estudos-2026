(function(){
'use strict';
function setActiveSubject(){
  try{
    document.querySelectorAll('#centralSidebar .nav button').forEach(function(button){button.classList.remove('active')});
  }catch(_){}
}
function showPortuguese(){
  if(typeof window.renderPortugueseMaster!=='function'){
    console.error('[Português rápido] motor nativo indisponível');
    return false;
  }
  var ids=['homeView','disciplinesView','agendaView','performanceView','tecCadernosView','ankiView','leiSecaView','vadeMecumView','moduleView'];
  ids.forEach(function(id){var view=document.getElementById(id);if(view)view.classList.add('hidden')});
  var view=document.getElementById('moduleView');
  if(!view)return false;
  view.className='view module-view central-pt-fast-view';
  view.style.overflow='auto';
  view.style.padding='0';
  view.innerHTML='<div class="central-pt-fast-head"><button type="button" class="central-pt-fast-back" onclick="return window.centralFastPortugueseBack()">← Voltar</button><span>Português</span></div><div class="central-pt-fast-content">'+window.renderPortugueseMaster()+'</div>';
  var crumb=document.getElementById('crumb');if(crumb)crumb.textContent='Português';
  setActiveSubject();
  try{window.scrollTo(0,0)}catch(_){}
  try{view.scrollTop=0}catch(_){}
  return false;
}
window.centralFastPortugueseBack=function(){
  if(typeof window.openHome==='function')return window.openHome();
  var view=document.getElementById('moduleView');if(view)view.classList.add('hidden');
  var home=document.getElementById('homeView');if(home)home.classList.remove('hidden');
  var crumb=document.getElementById('crumb');if(crumb)crumb.textContent='Início';
  return false;
};
var previous=window.jumpSubject;
window.jumpSubject=function(id){
  if(String(id)==='pt')return showPortuguese();
  if(typeof previous==='function')return previous.apply(this,arguments);
  return false;
};
var nativeHardSubject=window.centralHardSubject;
window.centralHardSubject=function(id){
  if(String(id)==='pt')return showPortuguese();
  if(typeof nativeHardSubject==='function')return nativeHardSubject.apply(this,arguments);
  return false;
};
var style=document.createElement('style');
style.textContent='.central-pt-fast-view{background:var(--bg);color:var(--text)}.central-pt-fast-head{position:sticky;top:0;z-index:30;display:flex;align-items:center;gap:12px;min-height:56px;padding:8px 14px;border-bottom:1px solid var(--line);background:var(--panel)}.central-pt-fast-head span{font-weight:800;font-size:14px}.central-pt-fast-back{border:1px solid var(--line2);background:var(--panel2);color:var(--text);border-radius:9px;padding:8px 11px;font:700 12px/1 system-ui;cursor:pointer}.central-pt-fast-content{padding:18px 22px 32px}@media(max-width:680px){.central-pt-fast-head{min-height:52px;padding:7px 10px}.central-pt-fast-content{padding:12px 10px 24px}}';
document.head.appendChild(style);
})();