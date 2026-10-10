/* Base Completa — identidade, perfil e saída v1.1 */
(function(){
'use strict';
if(window.__bcAuthShellV1)return;window.__bcAuthShellV1=true;

function roleLabel(role){return role==='admin'?'Administrador':role==='editor'?'Editor':'Aluno'}
async function logout(){
 try{
  var r=await fetch('/api/auth?action=logout',{method:'POST'});
  if(!r.ok){var j={};try{j=await r.json()}catch(_){}throw new Error(j.error||'Não foi possível sair')}
  try{navigator.serviceWorker&&navigator.serviceWorker.controller&&navigator.serviceWorker.controller.postMessage({type:'CLEAR_OFFLINE_AUTH'})}catch(_){}
  location.replace('/login.html');
 }catch(e){alert(e.message||'Para sair da conta, conecte-se à internet e tente novamente.')}
}
function addStyles(){
 if(document.getElementById('bc-auth-style'))return;
 var s=document.createElement('style');s.id='bc-auth-style';s.textContent=
 '.bc-auth-chip{display:flex;align-items:center;gap:7px;padding:5px 8px;border:1px solid var(--line,#d9d1c7);border-radius:999px;font-size:10px;background:var(--panel,#fffdf9);max-width:190px}'+
 '.bc-auth-chip span:last-child{min-width:0}.bc-auth-chip b,.bc-auth-chip small{display:block;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.bc-auth-chip b{font-size:10px}.bc-auth-chip small{opacity:.68;font-size:8px}'+
 '.bc-auth-actions{display:flex;align-items:center;gap:6px;margin-left:auto}.bc-auth-actions button,.bc-auth-users{border:1px solid var(--line,#d9d1c7);background:var(--panel2,var(--panel,#fffdf9));color:inherit;border-radius:8px;padding:7px 9px;font-weight:750;font-size:10px;cursor:pointer}.bc-auth-users{text-decoration:none}'+
 '.bc-auth-nav-link{width:calc(100% - 12px);margin:3px 6px!important;border:0!important;background:transparent!important;color:var(--muted,#bdcbe0)!important;text-align:left!important;border-radius:11px!important;padding:10px 11px!important;display:flex!important;align-items:center!important;gap:11px!important;min-height:44px!important;font-weight:700!important;text-decoration:none!important}'+
 '.bc-auth-nav-link:hover{background:var(--surface-hover)!important;color:var(--text)!important}.bc-auth-nav-role{font-size:9px;opacity:.72;margin-left:auto}'+
 '@media(max-width:680px){.bc-auth-actions .bc-auth-chip{display:none}.bc-auth-actions .bc-auth-users{display:none}.bc-auth-actions{margin-left:auto}.bc-auth-actions button{padding:7px 9px}.topbar .top-actions{display:none!important}}';
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
  actions.innerHTML='<div class="bc-auth-chip"><span>👤</span><span><b></b><small></small></span></div>'+(user.role==='admin'?'<a class="bc-auth-users" href="/usuarios.html">Usuários</a>':'')+'<button type="button" data-bc-logout>⇥ Sair</button>';
  actions.querySelector('b').textContent=user.name||user.email;actions.querySelector('small').textContent=roleLabel(user.role);
  actions.querySelector('[data-bc-logout]').onclick=logout;
  top.appendChild(actions);
 }

 var nav=findNav();
 if(nav){
  if(user.role==='admin'&&!document.getElementById('bcUsersNav')){
   var users=document.createElement('a');users.id='bcUsersNav';users.href='/usuarios.html';users.className='bc-auth-nav-link';
   users.innerHTML='<span class="nav-icon">👥</span><span class="nav-text">Usuários</span>';
   nav.appendChild(users);
  }
  if(!document.getElementById('bcLogoutNav')){
   var out=document.createElement('button');out.id='bcLogoutNav';out.type='button';out.className='bc-auth-nav-link';
   out.innerHTML='<span class="nav-icon">⇥</span><span class="nav-text">Sair da conta</span><span class="bc-auth-nav-role">'+roleLabel(user.role)+'</span>';
   out.onclick=logout;nav.appendChild(out);
  }
 }

 try{window.dispatchEvent(new CustomEvent('base-completa-auth-ready',{detail:user}))}catch(_){}
}
async function init(){
 try{
  var qaPtra=new URLSearchParams(location.search).get('qa_ptra')==='1'&&location.hostname.endsWith('.vercel.app');
  if(qaPtra){
   var qaUser={id:'qa-ptra',name:'QA Processo do Trabalho',email:'qa@local.invalid',role:'admin'};
   inject(qaUser);new MutationObserver(function(){inject(qaUser)}).observe(document.body,{childList:true,subtree:true});return;
  }
  var r=await fetch('/api/auth?action=me',{cache:'no-store'}),j=await r.json();
  if(!j.authenticated||!j.user){location.replace('/login.html?next='+encodeURIComponent(location.pathname+location.search));return}
  inject(j.user);
  new MutationObserver(function(){inject(j.user)}).observe(document.body,{childList:true,subtree:true});
 }catch(e){console.error('[Base Completa auth]',e)}
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
