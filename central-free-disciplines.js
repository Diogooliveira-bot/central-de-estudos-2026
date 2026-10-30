/* Free-reader: render only authenticated summary projections. */
(function(g){
'use strict';
const loader=g.CentralDisciplineLoader;if(!loader)return;
const originalOpen=loader.open.bind(loader),originalPlaceholder=loader.placeholder.bind(loader);
const counts={cf:15,penal:17,cpc:20,adm:20,civil:15,cpp:22};
const names={cf:'Direito Constitucional',penal:'Direito Penal',cpc:'Direito Processual Civil',adm:'Direito Administrativo',civil:'Direito Civil',cpp:'Direito Processual Penal'};
const opened=new Set(),selection={},tabs={},cache={},loading=new Set();
let plan=null;
const isFree=()=>plan?.plan==='free'&&plan?.isStaff!==true;
const escape=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const mm=n=>'m'+String(n).padStart(2,'0');
const getPlan=fetch('/api/plans?action=me',{cache:'no-store',credentials:'same-origin'})
 .then(async r=>{if(!r.ok)throw Error('Plano indisponível');plan=await r.json();return plan})
 .catch(e=>{console.warn('[FreeReader] Plano',e);return null});
const style=document.createElement('style');
style.id='bc-free-unified-modules';
style.textContent=[
'.central-free-study{display:block!important;width:100%;padding:0!important;text-align:left!important;border:0!important;background:transparent!important;color:var(--bc-color-text,var(--text,#17344a))!important}',
'.central-free-study .bc-free-list{display:grid;gap:12px}',
'.central-free-study .bc-free-module{display:block!important;scroll-margin-top:100px;overflow:hidden}',
'.central-free-study .bc-free-module-head{width:100%;cursor:pointer}',
'.central-free-study .bc-free-module-head .cf-module-stat{color:var(--bc-color-text-secondary,var(--muted,#607686))}',
'.central-free-study .bc-free-module-body{min-width:0}',
'.central-free-study .bc-free-module:not(.open) .bc-free-module-body{display:none!important}',
'.central-free-study .bc-free-module.open .bc-free-module-body{display:block!important}',
'.central-free-study .bc-free-tabs{display:flex;flex-wrap:wrap;gap:8px;border-bottom:1px solid var(--bc-color-border,var(--line,#d9e4ec));padding:0 0 12px;margin:0 0 15px}',
'.central-free-study .bc-free-tab{min-height:44px!important;min-width:0;border:1px solid var(--bc-color-border-interactive,var(--line2,#c5d8e4))!important;border-radius:9px!important;background:var(--bc-color-surface-elevated,var(--panel2,#f5f9fc))!important;color:var(--bc-color-text,var(--text,#15364c))!important;padding:9px 13px!important;font:700 13px/1.35 var(--bc-font,system-ui)!important;cursor:pointer;white-space:normal!important}',
'.central-free-study .bc-free-tab[aria-selected="true"]{background:var(--bc-color-primary,var(--discipline-accent,#0d4260))!important;color:#fff!important;border-color:var(--bc-color-primary,var(--discipline-accent,#0d4260))!important}',
'.central-free-study .bc-free-lock{font-size:12px;margin-right:4px;opacity:.8}',
'.central-free-study .bc-free-panel{min-width:0;scroll-margin-top:90px}',
'.central-free-study .bc-free-reading,.central-free-study .bc-free-lock-panel{background:var(--bc-color-surface-elevated,var(--panel2,#f7fafc));border:1px solid var(--bc-color-border,var(--line,#d9e4ec));border-radius:11px;padding:18px}',
'.central-free-study .bc-free-reading h4{font:750 17px/1.45 var(--bc-font,system-ui);margin:0 0 14px;color:var(--bc-color-text,var(--text,#16364d))}',
'.central-free-study .bc-free-reading-text{white-space:pre-wrap;overflow-wrap:anywhere;font:400 var(--central-reading-font-large,16px)/1.8 var(--bc-font,system-ui);color:var(--bc-color-text,var(--text,#17344a))}',
'.central-free-study .bc-free-reading-text.bc-free-rich{white-space:normal}',
'.central-free-study .bc-free-rich :is(h1,h2,h3,h4,h5,h6){margin:16px 0 8px;line-height:1.4;color:var(--bc-color-text,var(--text,#17344a))}',
'.central-free-study .bc-free-rich :is(p,li,blockquote){font-size:inherit;line-height:1.8;margin:8px 0}',
'.central-free-study .bc-free-rich :is(ul,ol){padding-left:22px;margin:8px 0 14px}',
'.central-free-study .bc-free-rich :is(table){width:100%;border-collapse:collapse;display:block;overflow-x:auto}',
'.central-free-study .bc-free-rich :is(td,th){border:1px solid var(--bc-color-border,var(--line,#ddd));padding:9px}',

'.central-free-study .bc-free-hint{font:400 13px/1.6 var(--bc-font,system-ui);color:var(--bc-color-text-secondary,var(--muted,#617585));margin:0}',
'.central-free-study .bc-free-lock-panel strong{font:750 16px/1.5 var(--bc-font,system-ui);color:var(--bc-color-text,var(--text,#17344a))}',
'.central-free-study .bc-free-lock-panel p{margin:7px 0 12px;line-height:1.55}',
'.central-free-study .bc-free-upgrade{display:inline-block;font:700 13px/1.4 var(--bc-font,system-ui);color:var(--bc-color-primary,var(--discipline-accent,#136a94));text-decoration:underline;text-underline-offset:3px}',
'.central-free-study :is(button,a):focus-visible{outline:3px solid var(--bc-color-accent,var(--discipline-accent,#1886c5))!important;outline-offset:2px}',
'@media(max-width:680px){.central-free-study .bc-free-tabs{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:6px}.central-free-study .bc-free-tab{padding:9px 4px!important;font-size:12px!important}.central-free-study .bc-free-reading,.central-free-study .bc-free-lock-panel{padding:13px}.central-free-study .bc-free-module-head .cf-module-stat{display:none}}'
].join('');
document.head.appendChild(style);
function titleFor(topic,num){
 const raw=String(topic?.title||'Módulo '+num).trim();
 return raw.replace(/^(?:M\s*0*\d{1,2}[\s.:-]+|0*\d{1,2}[\s.:-]+)/i,'').trim()||raw;
}
function tabMarkup(id,tab,caption,locked){
 return '<button type="button" class="ptn-tab bc-free-tab" role="tab" id="bc-free-tab-'+id+'-'+tab+'" aria-selected="'+((tabs[id]||'summary')===tab)+'" aria-controls="bc-free-panel-'+id+'" onclick="return CentralFreeReader.tab(\''+id+'\',\''+tab+'\')">'+(locked?'<span class="bc-free-lock" aria-hidden="true">🔒</span>':'')+caption+'</button>';
}
function panelMarkup(id,n){
 const active=tabs[id]||'summary',state=cache[id+':'+n],wait=loading.has(id+':'+n);
 let content;
 if(active==='complete'){
  content='<div class="bc-free-lock-panel"><strong>Teoria completa — Premium</strong><p class="bc-free-hint">O plano Gratuito inclui o resumo. A teoria completa e as questões internas são recursos exclusivos do Premium.</p><a class="bc-free-upgrade" href="/conheca.html#acesso">Conhecer o Premium</a></div>';
 }else if(active==='infographic'){
  content='<div class="bc-free-lock-panel"><strong>Infográfico indisponível no Gratuito</strong><p class="bc-free-hint">Este material é restrito. A disponibilidade depende das permissões e do módulo.</p><a class="bc-free-upgrade" href="/conheca.html#acesso">Conhecer os planos</a></div>';
 }else if(wait){
  content='<p role="status" class="bc-free-hint">Carregando resumo do módulo...</p>';
 }else if(state?.error){
  content='<p role="alert" class="bc-free-hint">'+escape(state.error)+'</p>';
 }else if(state){
  content='<article class="ptn-content bc-free-reading"><h4>'+escape(state.title)+'</h4><div class="bc-free-reading-text'+(state.summaryHtml?' bc-free-rich':'')+'">'+(state.summaryHtml||escape(state.summary))+'</div></article>';
 }else{
  content='<p class="bc-free-hint">Preparando o resumo deste módulo...</p>';
 }
 return '<div class="cf-module-body ptn-module-body bc-free-module-body" id="bc-free-body-'+id+'-'+n+'"><div class="ptn-tabs bc-free-tabs" role="tablist" aria-label="Recursos do módulo M'+String(n).padStart(2,'0')+'">'+
 tabMarkup(id,'summary','Resumo',false)+tabMarkup(id,'complete','Completo',true)+tabMarkup(id,'infographic','Infográfico',true)+
 '</div><div class="bc-free-panel" role="tabpanel" id="bc-free-panel-'+id+'" aria-labelledby="bc-free-tab-'+id+'-'+active+'">'+content+'</div></div>';
}
function placeholder(subject){
 if(!opened.has(subject.id)||!isFree())return originalPlaceholder(subject);
 const id=subject.id,n=selection[id]||0,topics=subject.topics||[];
 const cards=Array.from({length:counts[id]},(_,i)=>{
  const num=i+1,active=num===n,title=titleFor(topics[i],num);
  return '<section class="cf-module bc-free-module'+(active?' open':'')+'" data-bc-free-module="'+id+'-'+num+'">'+
   '<button type="button" class="cf-module-head bc-free-module-head" aria-expanded="'+active+'" aria-controls="bc-free-body-'+id+'-'+num+'" onclick="return CentralFreeReader.module(\''+id+'\','+num+')">'+
   '<span class="cf-module-no">MÓDULO '+String(num).padStart(2,'0')+'</span>'+
   '<span class="cf-module-title">'+escape(title)+'</span>'+
   '<span class="cf-module-stat">'+(active?'Resumo aberto':'Resumo disponível')+'</span>'+
   '<span class="chev" aria-hidden="true">⌄</span></button>'+
   (active?panelMarkup(id,num):'<div class="cf-module-body ptn-module-body bc-free-module-body" id="bc-free-body-'+id+'-'+num+'" hidden></div>')+
   '</section>';
 }).join('');
 // Mesmo invólucro, cabeçalhos, expansão e tipografia do Português nativo.
 return '<section class="central-discipline-loading ptn-master central-free-study" aria-label="Módulos de '+escape(names[id])+'"><div class="cf-modules bc-free-list">'+cards+'</div></section>';
}
loader.placeholder=placeholder;
function refresh(){try{g.renderSubjects?.();g.renderDisciplineGrid?.()}catch(e){console.warn('[FreeReader] Render',e)}}
function freeOpen(id){
 opened.add(id);
 if(!(id in selection)){
  const saved=Number(localStorage.getItem('central-v6:free-module:'+id));
  selection[id]=Number.isInteger(saved)&&saved>0&&saved<=counts[id]?saved:0;
 }
 tabs[id]??='summary';
 g.openHome?.();localStorage.setItem('central-v6:open:'+id,'1');refresh();
 requestAnimationFrame(()=>document.querySelector('.subject[data-id="'+id+'"]')?.scrollIntoView({block:'start'}));
 if(selection[id])module(id,selection[id],true,true);
 return false;
}
loader.open=function(id,after){
 if(!counts[id])return originalOpen(id,after);
 if(plan)return isFree()?freeOpen(id):originalOpen(id,after);
 getPlan.then(p=>{if(p?.plan==='free'&&!p.isStaff)freeOpen(id);else originalOpen(id,after)});
 return false;
};
// Navigation adapters can replace the legacy inline click handlers. Route the
// visible subject and discipline-card actions to the free reader explicitly.
// This runs ONLY for a confirmed free plan; paid routing is untouched.
document.addEventListener('click',event=>{
 const card=event.target.closest('#disciplineGrid .disc-card[data-id]');
 const goal=event.target.closest('#disciplineGrid [data-study-open-subject]');
 const head=event.target.closest('#subjects .subject-head');
 const id=card?.dataset.id||goal?.dataset.studyOpenSubject||head?.closest('.subject')?.dataset.id;
 if(!id||!counts[id]||!isFree())return;
 event.preventDefault();event.stopImmediatePropagation();freeOpen(id);
},true);
// Preserva a estrutura editorial dos resumos; elimina scripts, links e atributos.
// O backend já projeta somente os campos do plano Gratuito; esta camada trata a apresentação.
function safeSummaryHtml(html){
 const root=document.createElement('div');root.innerHTML=String(html||'');
 const allowed=new Set(['H1','H2','H3','H4','H5','H6','P','DIV','SECTION','ARTICLE','STRONG','B','EM','I','U','UL','OL','LI','BLOCKQUOTE','BR','HR','TABLE','THEAD','TBODY','TFOOT','TR','TH','TD','CODE','PRE','MARK','SMALL','SUP','SUB','SPAN','DETAILS','SUMMARY']);
 const denied=new Set(['SCRIPT','STYLE','IFRAME','OBJECT','EMBED','FORM','BUTTON','INPUT','SELECT','TEXTAREA','SVG','MATH','IMG','VIDEO','AUDIO','LINK','META','BASE']);
 function clean(parent){
  for(const child of Array.from(parent.childNodes)){
   if(child.nodeType===8){child.remove();continue}
   if(child.nodeType!==1){if(child.nodeType!==3)child.remove();continue}
   if(denied.has(child.tagName)){child.remove();continue}
   clean(child);
   if(!allowed.has(child.tagName)){child.replaceWith(...Array.from(child.childNodes));continue}
   for(const attr of Array.from(child.attributes))child.removeAttribute(attr.name);
  }
 }
 clean(root);
 return root.innerHTML;
}

function execute(source){
 const script=document.createElement('script');script.textContent=source;document.head.appendChild(script);script.remove();
}
async function unpack(base64){
 if(!base64||typeof DecompressionStream!=='function')throw Error('O leitor de resumos compactados não é compatível com este navegador.');
 const raw=Uint8Array.from(atob(base64),char=>char.charCodeAt(0));
 const stream=new Blob([raw]).stream().pipeThrough(new DecompressionStream('gzip'));
 return JSON.parse(await new Response(stream).text());
}
async function read(id,n){
 const path=id==='civil'||id==='cpp'?'/content/'+id+'/'+id+'-native-content-packed.js':
  id==='adm'?'/content/adm/'+mm(n)+'-native-data-lite.js':'/content/'+id+'/'+mm(n)+'-native-data.js';
 const response=await fetch(path,{credentials:'same-origin',cache:'no-store'});
 if(!response.ok)throw Error(response.status===403?'Resumo indisponível para o plano gratuito.':'Este resumo ainda não está disponível.');
 if(!(response.headers.get('content-type')||'').includes('javascript'))throw Error('Formato de resumo inválido.');
 execute(await response.text());
 let record;
 if(id==='civil'||id==='cpp'){
  const data=await unpack(g[id==='civil'?'CIVIL_NATIVE_PACKED_B64':'CPP_NATIVE_PACKED_B64']);
  record=data[mm(n)]||Object.values(data).find(x=>Number(x?.number)===n)||Object.values(data)[n-1];
 }else if(id==='adm')record=Object.values(g.ADM_NATIVE_CONTENT||{}).find(x=>Number(x?.number)===n);
 else record=g.BASE_NATIVE_CONTENT?.[id]?.[mm(n)];
 if(!record)throw Error('Resumo ainda não cadastrado para este módulo.');
 const html=record.summaryHtml||'',plain=document.createElement('div');plain.innerHTML=html;
 const summary=record.summary||plain.textContent;
 if(!String(summary||'').trim())throw Error('Resumo ainda não cadastrado para este módulo.');
 return {title:record.title||'Módulo '+n,summary,summaryHtml:html?safeSummaryHtml(html):''};
}
async function module(id,n,silent=false,restore=false){
 if(!isFree()||!counts[id]||!Number.isInteger(n)||n<1||n>counts[id])return false;
 if(!restore&&selection[id]===n){
  selection[id]=0;localStorage.removeItem('central-v6:free-module:'+id);refresh();return false;
 }
 if(selection[id]!==n)tabs[id]='summary';
 selection[id]=n;localStorage.setItem('central-v6:free-module:'+id,String(n));
 const key=id+':'+n;
 if(!cache[key]&&!loading.has(key)){
  loading.add(key);refresh();
  try{cache[key]=await read(id,n)}catch(e){cache[key]={error:e.message||'Não foi possível abrir o resumo.'}}
  finally{loading.delete(key)}
 }
 refresh();
 if(!silent)document.getElementById('bc-free-body-'+id+'-'+n)?.scrollIntoView({block:'nearest'});
 return false;
}
function tab(id,value){
 if(!isFree()||!opened.has(id)||!counts[id]||!['summary','complete','infographic'].includes(value))return false;
 tabs[id]=value;refresh();
 if(value==='summary'&&selection[id]&&!cache[id+':'+selection[id]])module(id,selection[id],true,true);
 return false;
}
g.CentralFreeReader={module,tab,isFree,isOpen:id=>isFree()&&opened.has(id)};
})(window);
