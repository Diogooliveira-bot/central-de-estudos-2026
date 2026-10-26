/* Free-reader: render only authenticated summary projections. */
(function(g){
'use strict';
const loader=g.CentralDisciplineLoader;if(!loader)return;
const originalOpen=loader.open.bind(loader),originalPlaceholder=loader.placeholder.bind(loader);
const counts={cf:15,penal:17,cpc:20,adm:20,civil:15,cpp:22};
const names={cf:'Direito Constitucional',penal:'Direito Penal',cpc:'Direito Processual Civil',adm:'Direito Administrativo',civil:'Direito Civil',cpp:'Direito Processual Penal'};
const opened=new Set(),selection={},cache={},loading=new Set();
let plan=null;
const isFree=()=>plan?.plan==='free'&&plan?.isStaff!==true;
const escape=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const mm=n=>'m'+String(n).padStart(2,'0');
const getPlan=fetch('/api/plans?action=me',{cache:'no-store',credentials:'same-origin'})
 .then(async r=>{if(!r.ok)throw Error('Plano indisponível');plan=await r.json();return plan})
 .catch(e=>{console.warn('[FreeReader] Plano',e);return null});
const style=document.createElement('style');
style.textContent='.central-free-study{display:block!important;width:100%;padding:18px!important;text-align:left!important;border:1px solid #dce5ee;border-radius:14px;background:white}.central-free-study h3{font:700 23px system-ui;margin:0 0 12px}.central-free-study p{line-height:1.6}.central-free-cards{display:grid;grid-template-columns:repeat(auto-fit,minmax(170px,1fr));gap:9px}.central-free-cards button{font:650 14px/1.4 system-ui;color:#12384e;background:#f4f8fb;border:1px solid #c9dbe5;border-radius:9px;padding:13px;text-align:left;cursor:pointer}.central-free-cards button[aria-pressed=true]{color:white;background:#133c54}.central-free-result{margin-top:15px;border:1px solid #d9e4ec;border-radius:12px;padding:15px;background:#f9fbfd}.central-free-result pre{font:15px/1.7 system-ui;white-space:pre-wrap;overflow-wrap:anywhere}.central-free-note{font:13px/1.55 system-ui;color:#607686}';
document.head.appendChild(style);
function placeholder(subject){
 if(!opened.has(subject.id)||!isFree())return originalPlaceholder(subject);
 const id=subject.id,n=selection[id],state=cache[id+':'+n],wait=loading.has(id+':'+n),topics=subject.topics||[];
 const buttons=Array.from({length:counts[id]},(_,i)=>{const num=i+1,title=topics[i]?.title||'Módulo '+num;
 return '<button type="button" aria-pressed="'+(num===n)+'" onclick="return CentralFreeReader.module(\''+id+'\','+num+')">M'+String(num).padStart(2,'0')+' · '+escape(title)+'</button>'}).join('');
 const result=!n?'<p class="central-free-note">Selecione um módulo para abrir a teoria resumida.</p>':
  wait?'<p role="status">Carregando resumo...</p>':
  state?.error?'<p role="alert">'+escape(state.error)+'</p>':
  state?'<article class="central-free-result"><h3>'+escape(state.title)+'</h3><pre>'+escape(state.summary)+'</pre><p class="central-free-note">Teoria completa, questões internas e cadernos externos são exclusivos do Premium.</p></article>':'';
 return '<section class="central-discipline-loading central-free-study" aria-busy="'+wait+'"><h3>'+escape(names[id])+'</h3><p class="central-free-note">Resumos liberados para o seu plano. Escolha um módulo.</p><div class="central-free-cards">'+buttons+'</div><div id="centralFreeResult">'+result+'</div></section>';
}
loader.placeholder=placeholder;
function refresh(){try{g.renderSubjects?.();g.renderDisciplineGrid?.()}catch(e){console.warn('[FreeReader] Render',e)}}
function freeOpen(id){
 opened.add(id);g.openHome?.();localStorage.setItem('central-v6:open:'+id,'1');refresh();
 requestAnimationFrame(()=>document.querySelector('.subject[data-id="'+id+'"]')?.scrollIntoView({block:'start'}));
 return false;
}
loader.open=function(id,after){
 if(!counts[id])return originalOpen(id,after);
 if(plan)return isFree()?freeOpen(id):originalOpen(id,after);
 getPlan.then(p=>{if(p?.plan==='free'&&!p.isStaff)freeOpen(id);else originalOpen(id,after)});
 return false;
};
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
 return {title:record.title||'Módulo '+n,summary};
}
async function module(id,n){
 if(!isFree()||!counts[id]||!Number.isInteger(n)||n<1||n>counts[id])return false;
 selection[id]=n;const key=id+':'+n;
 if(!cache[key]&&!loading.has(key)){
  loading.add(key);refresh();
  try{cache[key]=await read(id,n)}catch(e){cache[key]={error:e.message||'Não foi possível abrir o resumo.'}}
  finally{loading.delete(key)}
 }
 refresh();document.getElementById('centralFreeResult')?.scrollIntoView({block:'nearest'});
 return false;
}
g.CentralFreeReader={module,isFree,isOpen:id=>isFree()&&opened.has(id)};
})(window);
