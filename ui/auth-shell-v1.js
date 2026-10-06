/* Base Completa — identidade e permissões visuais v1 */
(function(){
'use strict';
if(window.__bcAuthShellV1)return;window.__bcAuthShellV1=true;

function roleLabel(role){return role==='admin'?'Administrador':role==='editor'?'Editor':'Aluno'}
function addStyles(){
 if(document.getElementById('bc-auth-style'))return;
 var s=document.createElement('style');s.id='bc-auth-style';s.textContent=
 '.bc-auth-chip{display:flex;align-items:center;gap:8px;padding:6px 9px;border:1px solid var(--bc-line,#d9d1c7);border-radius:999px;font-size:11px;background:rgba(255,255,255,.55)}'+
 '.bc-auth-chip b{font-size:11px}.bc-auth-chip small{opacity:.68}.bc-auth-actions{display:flex;align-items:center;gap:7px;margin-left:auto}.bc-auth-actions button,.bc-auth-users{border:1px solid currentColor;background:transparent;border-radius:8px;padding:6px 9px;font:700 11px inherit;cursor:pointer}.bc-auth-users{text-decoration:none;color:inherit}';
 document.head.appendChild(s);
}
function findTopbar(){return document.querySelector('.topbar,.central-topbar,.bc-topbar,header.topbar')}
function findNav(){return document.querySelector('#centralSidebar .nav,#centralSidebar nav,aside .nav')}
function inject(user){
 addStyles();window.BASE_COMPLETA_USER=user;
 document.documentElement.setAttribute('data-bc-role',user.role);
 if(user.role!=='admin'){
  document.getElementById('central-update-btn')?.remove();
  document.getElementById('central-update-status')?.remove();
 }

 var top=findTopbar();
 if(top&&!document.getElementById('bcAuthActions')){
  var actions=document.createElement('div');actions.id='bcAuthActions';actions.className='bc-auth-actions';
  actions.innerHTML='<div class="bc-auth-chip"><span>👤</span><span><b></b><small></small></span></div>'+(user.role==='admin'?'<a class="bc-auth-users" href="/usuarios.html">Usuários</a>':'')+'<button type="button" data-bc-logout>Sair</button>';
  actions.querySelector('b').textContent=user.name||user.email;actions.querySelector('small').textContent=roleLabel(user.role);
  actions.querySelector('[data-bc-logout]').onclick=async function(){
   try{
    var r=await fetch('/api/auth?action=logout',{method:'POST'});
    if(!r.ok){var j={};try{j=await r.json()}catch(_){}throw new Error(j.error||'Não foi possível sair')}
    try{navigator.serviceWorker&&navigator.serviceWorker.controller&&navigator.serviceWorker.controller.postMessage({type:'CLEAR_OFFLINE_AUTH'})}catch(_){}
    location.replace('/login.html');
   }catch(e){alert(e.message||'Para sair da conta, conecte-se à internet e tente novamente.')}
  };
  top.appendChild(actions);
 }
 var nav=findNav();
 if(nav&&user.role==='admin'&&!document.getElementById('bcUsersNav')){
  var a=document.createElement('a');a.id='bcUsersNav';a.href='/usuarios.html';a.className='bc-auth-users';a.textContent='👥 Usuários';a.style.cssText='display:flex;align-items:center;gap:9px;margin:8px 6px;padding:9px 10px;border-radius:9px;text-decoration:none;color:inherit';
  nav.appendChild(a);
 }
 try{window.dispatchEvent(new CustomEvent('base-completa-auth-ready',{detail:user}))}catch(_){}
}
async function init(){
 try{
  var r=await fetch('/api/auth?action=me',{cache:'no-store'}),j=await r.json();
  if(!j.authenticated||!j.user){location.replace('/login.html?next='+encodeURIComponent(location.pathname+location.search));return}
  inject(j.user);
  new MutationObserver(function(){inject(j.user)}).observe(document.body,{childList:true,subtree:true});
 }catch(e){console.error('[Base Completa auth]',e)}
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
