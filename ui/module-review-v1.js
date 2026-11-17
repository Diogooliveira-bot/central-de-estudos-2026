/* Controles editoriais dos administradores — módulos, leitura e menu Mais. */
(function(){
'use strict';
if(window.BCModuleReview)return;
var ALIASES={
 cf:'cf',constitucional:'cf',adm:'adm',administrativo:'adm',
 penal:'penal',pen:'penal',civil:'civil',civ:'civil',
 cpc:'cpc',cpp:'cpp',rlm:'rlm',
 portugues:'pt',pt:'pt',informatica:'info',info:'info',inf:'info'
};
function norm(value){return String(value||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/\s+/g,' ').trim()}
function discipline(value){
 var n=norm(value);
 if(/(?:direito\s+)?processual\s+penal|processo\s+penal/.test(n))return 'cpp';
 if(/(?:direito\s+)?processual\s+civil|processo\s+civil/.test(n))return 'cpc';
 if(/direito\s+constitucional/.test(n))return 'cf';
 if(/direito\s+administrativo/.test(n))return 'adm';
 if(/direito\s+penal/.test(n))return 'penal';
 if(/direito\s+civil/.test(n))return 'civil';
 if(/raciocinio\s+logico/.test(n))return 'rlm';
 if(/informatica/.test(n))return 'info';
 if(/portugues/.test(n))return 'pt';
 var prefix=/^(?:base completa\s*[-|•]\s*)?(cf|adm|pen|penal|cpc|cpp|civil|civ|pt|portugues|rlm|info|inf)(?=\s|$)/.exec(n);
 return prefix?ALIASES[prefix[1]]:'';
}
function numberOf(value){
 var raw=norm(value), m=/(?:modulo|module|\bm)\s*[-#:]?\s*0*(\d{1,2})(?!\d)/i.exec(raw);
 if(!m && /^\s*0*(\d{1,2})\s*$/.test(raw))m=/^\s*0*(\d{1,2})\s*$/.exec(raw);
 if(!m)return 0;
 var n=Number(m[1]);return n>=1&&n<=99?n:0;
}
function keyForList(subject,value,index){
 var id=ALIASES[norm(subject)]||discipline(subject);
 var n=numberOf(value)||index+1;
 return id&&n>=1&&n<=99?id+':'+String(n).padStart(2,'0'):'';
}
function keyOf(overlay){
 if(!overlay||overlay.matches('.bc-guided-overlay'))return '';
 var direct=String(overlay.getAttribute('data-bc-review-key')||'');
 if(/^(cf|adm|civil|cpc|cpp|penal|rlm|info|pt):(?:0[1-9]|[1-9]\d)$/.test(direct))return direct;
 var head=(overlay.querySelector('.bc-native-reader-title b,.cf-native-shell>header b,.bc-info-reader-top small')||{}).textContent||'';
 var sub=(overlay.querySelector('.bc-native-reader-title small,.cf-native-shell>header small')||{}).textContent||'';
 var combined=norm(head+' | '+sub);
 // Leitores PEN M01, RLM M01 e similares usam a sigla no cabeçalho.
 var coded=/(?:^|[\s|/•])(?:cf|adm|pen|penal|cpc|cpp|civ|civil|pt|rlm|info|inf)\s*(?:m|modulo)?\s*0*(\d{1,2})(?!\d)/.exec(combined);
 var id=discipline(head)||discipline(sub);
 var n=numberOf(head)||numberOf(sub);
 if(coded){
  var prefix=/(?:^|[\s|/•])(cf|adm|pen|penal|cpc|cpp|civ|civil|pt|rlm|info|inf)\s*(?:m|modulo)?\s*0*\d{1,2}/.exec(combined);
  if(prefix)id=ALIASES[prefix[1]]||id;
  n=Number(coded[1])||n;
 }
 // Ex.: Português apresenta título e modo, mas não repete M02 na janela.
 // Nesses casos, usar a disciplina e o módulo que a navegação abriu.
 if(!id||!n){
  var focus=window.BaseCompletaFocusNavigation&&window.BaseCompletaFocusNavigation.state;
  if(focus&&focus.stage==='reading'){
   id=id||ALIASES[norm(focus.subject)]||discipline(focus.subject);
   n=n||numberOf(focus.moduleNumber);
  }
 }
 return id&&n>=1&&n<=99?id+':'+String(n).padStart(2,'0'):'';
}
async function call(url,options){
 var response=await fetch(url,Object.assign({cache:'no-store',credentials:'same-origin'},options||{}));
 var result={};try{result=await response.json()}catch(_){}
 if(!response.ok)throw new Error(result.error||'Não foi possível salvar a revisão');
 return result;
}
function date(value){if(!value)return '';try{return new Date(value).toLocaleString('pt-BR')}catch(_){return ''}}
var authorized=false,loaded=false,items=new Map(),busy=new Set();
var mounted=new WeakMap(),queued=false;
function renderControl(wrapper){
 var key=wrapper.dataset.bcReviewKey;
 var item=items.get(key)||{reviewed:false,version:0};
 var input=wrapper.querySelector('input[type=checkbox]');
 var info=wrapper.querySelector('.bc-module-review-meta');
 if(!input||!info)return;
 input.checked=!!item.reviewed;
 input.disabled=!loaded||busy.has(key);
 var message=!loaded?'Consultando revisão…':item.reviewed
  ?'Revisado por '+(item.reviewedBy||'ADM')+(item.reviewedAt?' · '+date(item.reviewedAt):'')
  :item.lastEditedBy?'Pendente · editado por '+item.lastEditedBy
  :'Pendente de revisão';
 if(info.textContent!==message)info.textContent=message;
 wrapper.classList.toggle('bc-review-done',!!item.reviewed);
}
function renderAll(){
 document.querySelectorAll('[data-bc-review-key]').forEach(renderControl);
}
async function load(){
 var response=await call('/api/content-review');
 items=new Map((response.items||[]).map(function(item){return [item.key,item]}));
 loaded=true;renderAll();
}
async function toggle(key,wanted){
 if(busy.has(key))return;
 busy.add(key);renderAll();
 var old=items.get(key)||{key:key,version:0,reviewed:false};
 try{
  var result=await call('/api/content-review',{
   method:'POST',headers:{'Content-Type':'application/json'},
   body:JSON.stringify({key:key,reviewed:wanted,expectedVersion:old.version})
  });
  items.set(key,result.item);
  window.dispatchEvent(new CustomEvent('bc:module-review-changed',{detail:{key:key}}));
 }catch(err){
  alert(err.message||'A revisão não foi salva. Atualize e tente novamente.');
  await load().catch(function(){});
 }finally{busy.delete(key);renderAll()}
}
function control(key,kind){
 var wrapper=document.createElement('span');
 wrapper.className='bc-module-review-wrap bc-review-'+kind;
 wrapper.dataset.bcReviewKey=key;
 var label=document.createElement('label');label.className='bc-module-review-control';
 var input=document.createElement('input');input.type='checkbox';
 input.setAttribute('aria-label','Marcar '+key+' como conteúdo revisado');
 var caption=document.createElement('span');caption.textContent='Conteúdo revisado';
 label.append(input,caption);
 var meta=document.createElement('small');meta.className='bc-module-review-meta';
 wrapper.append(label,meta);
 wrapper.addEventListener('click',function(event){event.stopPropagation()});
 input.addEventListener('change',function(event){event.stopPropagation();toggle(key,input.checked)});
 renderControl(wrapper);
 return wrapper;
}
function mountReader(overlay){
 var key=keyOf(overlay);
 if(!key)return;
 var tools=overlay.querySelector('.bc-native-reader-tools,.cf-native-reader>aside,.bc-m01-toolbar,.bc-info-reader-top,.bc-native-reader-head');
 if(!tools)return;
 var old=mounted.get(overlay);
 if(old&&old.wrap.isConnected&&old.key===key)return;
 if(old&&old.wrap.isConnected)old.wrap.remove();
 var wrap=control(key,'reader');
 tools.appendChild(wrap);
 mounted.set(overlay,{key:key,wrap:wrap});
}
function mountModules(){
 var list=document.querySelector('#bcFocusModules');
 var focus=window.BaseCompletaFocusNavigation&&window.BaseCompletaFocusNavigation.state;
 if(!list||list.hidden||!focus||focus.stage!=='modules')return;
 var id=ALIASES[norm(focus.subject)]||discipline(focus.subject);
 if(!id)return;
 var cards=Array.from(list.querySelectorAll(':scope > .bc-focus-module-card:not(.bc-focus-fallback)'));
 cards.forEach(function(card,index){
  var count=card.querySelector('.bc-focus-module-number');
  var key=keyForList(id,count&&count.textContent,index);
  if(!key)return;
  var outer=document.createElement('div');
  outer.className='bc-review-card-wrap';
  var mark=control(key,'list');
  card.parentNode.insertBefore(outer,card);
  outer.append(card,mark);
 });
}
function menu(){
 // O menu do aluno esconde links adicionados à navegação principal.
 // Inserir o acesso exclusivamente em "Mais", visível aos administradores.
 var grid=document.querySelector('#studentMorePanel .student-more-grid');
 if(grid&&!grid.querySelector('[data-bc-review-menu]')){
  var button=document.createElement('button');button.type='button';
  button.className='bc-module-review-menu-button';
  button.dataset.bcReviewMenu='1';
  button.innerHTML='<span aria-hidden="true">✓</span><span><b>Revisão de conteúdos</b><small>Checks, histórico e administradores</small></span>';
  button.addEventListener('click',function(){location.assign('/tools/painel-revisao.html')});
  var anchor=grid.querySelector('[data-student-more-action="logout"]');
  grid.insertBefore(button,anchor||null);
 }
 var home=document.querySelector('#homeView #disciplinasHome');
 if(home&&!home.querySelector('.bc-review-home-link')){
  var link=document.createElement('a');
  link.className='bc-review-home-link';
  link.href='/tools/painel-revisao.html';
  link.textContent='✓ Painel de revisão dos módulos';
  home.appendChild(link);
 }
}
function scan(){
 if(!authorized)return;
 menu();
 mountModules();
 document.querySelectorAll('.bc-native-reader-overlay,.cf-native-overlay,.bc-info-overlay').forEach(mountReader);
}
function schedule(){
 if(queued)return;
 queued=true;
 requestAnimationFrame(function(){queued=false;scan()});
}
async function start(){
 try{
  var auth=await call('/api/auth?action=me');
  authorized=!!(auth.authenticated&&auth.user&&auth.user.role==='admin'&&auth.previewGuest!==true);
 }catch(_){authorized=false}
 if(!authorized)return;
 scan();
 new MutationObserver(schedule).observe(document.body,{childList:true,subtree:true});
 window.addEventListener('central-cloud-applied',schedule);
 window.addEventListener('pageshow',function(){load().catch(function(){});schedule()});
 try{await load()}catch(_){loaded=false;renderAll()}
 schedule();
}
window.BCModuleReview={keyOf:keyOf,keyForList:keyForList,refresh:load};
window.addEventListener('bc:module-published',function(){if(authorized)load().catch(function(){})});
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();