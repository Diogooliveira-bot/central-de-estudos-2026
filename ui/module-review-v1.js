/* Check editorial da Central; exibição somente para contas administrativas. */
(function(){
'use strict';
if(window.BCModuleReview)return;
const names={
 'direito constitucional':'cf','constitucional':'cf',
 'direito administrativo':'adm','administrativo':'adm',
 'direito civil':'civil','civil':'civil',
 'direito processual civil':'cpc','processo civil':'cpc','processual civil':'cpc',
 'direito processual penal':'cpp','processo penal':'cpp','processual penal':'cpp',
 'direito penal':'penal','penal':'penal',
 'raciocinio logico matematico':'rlm','raciocinio logico':'rlm','rlm':'rlm',
 'informatica':'info','portugues':'pt'
};
function keyOf(overlay){
 if(!overlay||overlay.matches('.bc-guided-overlay'))return '';
 const title=(overlay.querySelector('.bc-native-reader-title b,.cf-native-shell>header b')||{}).textContent||'';
 const sub=(overlay.querySelector('.bc-native-reader-title small,.cf-native-shell>header small')||{}).textContent||'';
 const normal=title.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/\s+/g,' ').trim();
 const match=/(?:m[oó]dulo|module|\bm)\s*[-#]?\s*0*(\d{1,2})(?!\d)/i.exec(sub);
 const subject=names[normal];
 return match&&subject?subject+':'+String(Number(match[1])).padStart(2,'0'):'';
}
function fmt(value){if(!value)return '';try{return new Date(value).toLocaleString('pt-BR')}catch(_){return ''}}
async function call(path,options){
 const res=await fetch(path,Object.assign({cache:'no-store',credentials:'same-origin'},options||{}));
 let data={};try{data=await res.json()}catch(_){}
 if(!res.ok)throw new Error(data.error||'Falha de conexão');
 return data;
}
let authorized=false;
const mounted=new WeakMap();
async function refresh(overlay){
 const state=mounted.get(overlay);if(!state)return;
 try{
  const {item}=await call('/api/content-review?key='+encodeURIComponent(state.key));
  state.item=item;state.check.checked=!!item.reviewed;state.check.disabled=false;
  state.text.textContent=item.reviewed?'Revisado por '+(item.reviewedBy||'administrador')+' · '+fmt(item.reviewedAt):
      item.lastEditedBy?'Revisão pendente · última edição: '+item.lastEditedBy:'Ainda não revisado';
 }catch(_){
  state.check.disabled=true;state.text.textContent='Revisão indisponível';
 }
}
function mount(overlay){
 if(mounted.has(overlay))return;
 const key=keyOf(overlay);
 const tools=overlay.querySelector('.bc-native-reader-tools,.cf-native-reader>aside,.bc-m01-toolbar');
 if(!key||!tools)return;
 const label=document.createElement('label');label.className='bc-module-review-control';
 const cb=document.createElement('input');cb.type='checkbox';cb.disabled=true;cb.setAttribute('aria-label','Marcar módulo como revisado');
 const caption=document.createElement('span');caption.textContent='Conteúdo revisado';
 label.append(cb,caption);
 const summary=document.createElement('small');summary.className='bc-module-review-meta';summary.textContent='Consultando...';
 const container=document.createElement('span');container.className='bc-module-review-wrap';container.append(label,summary);
 tools.appendChild(container);
 mounted.set(overlay,{key,check:cb,text:summary,item:null});
 cb.addEventListener('change',async function(){
  const state=mounted.get(overlay);if(!state||!state.item)return;
  const wanted=cb.checked;
  cb.disabled=true;summary.textContent='Salvando revisão...';
  try{
   const response=await call('/api/content-review',{method:'POST',headers:{'Content-Type':'application/json'},
    body:JSON.stringify({key,reviewed:wanted,expectedVersion:state.item.version})});
   state.item=response.item;await refresh(overlay);
   window.dispatchEvent(new CustomEvent('bc:module-review-changed',{detail:{key}}));
  }catch(e){summary.textContent=e.message;cb.checked=!!state.item.reviewed;cb.disabled=false}
 });
 refresh(overlay);
}
function menu(){
 const nav=document.querySelector('#centralSidebar .nav');
 if(!nav||nav.querySelector('.bc-module-review-entry'))return;
 const a=document.createElement('a');a.className='bc-module-review-entry';a.href='/tools/painel-revisao.html';
 a.textContent='Painel de revisão';a.title='Acompanhar revisões e alterações dos administradores';
 nav.appendChild(a);
}
function scan(){if(!authorized)return;menu();document.querySelectorAll('.bc-native-reader-overlay,.cf-native-overlay').forEach(mount)}
let queued=false;
function schedule(){if(queued)return;queued=true;requestAnimationFrame(function(){queued=false;scan()})}
window.BCModuleReview={keyOf,refresh};
window.addEventListener('bc:module-published',function(event){
 const key=event.detail&&event.detail.key;
 document.querySelectorAll('.bc-native-reader-overlay,.cf-native-overlay').forEach(function(overlay){
  if(keyOf(overlay)===key)refresh(overlay);
 });
});
async function start(){
 try{const data=await call('/api/auth?action=me');authorized=!!(data.authenticated&&data.user&&data.user.role==='admin')}
 catch(_){authorized=false}
 if(!authorized)return;
 scan();new MutationObserver(schedule).observe(document.body,{childList:true,subtree:true});
 window.addEventListener('central-cloud-applied',schedule);
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();