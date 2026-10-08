/* Base Completa: exportação de textos nativos em TXT e ZIP para administradores. */
(function(w){
'use strict';
if(w.__bcExportText)return;w.__bcExportText=true;
if(!w.BASE_COMPLETA_USER||w.BASE_COMPLETA_USER.role!=='admin')return;
const DISC=[
 ['adm','Direito Administrativo',20],['cf','Direito Constitucional',15],
 ['civil','Direito Civil',15],['penal','Direito Penal',17],
 ['cpc','Direito Processual Civil',20],['cpp','Direito Processual Penal',22],
 ['trabalho','Direito do Trabalho',18],['pt','Português',24]
];
const EXCLUDE='script,style,iframe,object,embed,nav,button,input,textarea,select,form,svg,.bc-native-study-progress,.bc-native-internal-review,.bc-native-reader-progress,.bc-native-reader-tools,.dt-central-bar,.dt-tec-panel,.quiz,.questions,.question-card,.cf-native-question,.cv-question-card,[data-pt-complete]';
const pad=n=>String(n).padStart(2,'0');
const kind=m=>m==='summary'?'RESUMIDA':'COMPLETA';
function slug(v){return String(v||'texto').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/gi,'-').replace(/^-|-$/g,'').slice(0,90)}
function escapeHtml(s){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function htmlText(html,full){
 const doc=new DOMParser().parseFromString(html,'text/html'),root=full?doc.querySelector('main')||doc.body:doc.body;
 if(!root)return '';
 root.querySelectorAll(EXCLUDE).forEach(el=>el.remove());
 root.querySelectorAll('details').forEach(el=>{if(/quest[aã]o|gabarito|exerc[ií]cio/i.test(el.querySelector('summary')?.textContent||''))el.remove()});
 function walk(n){
  if(n.nodeType===3)return n.nodeValue.replace(/[ \t\r\n]+/g,' ');
  if(n.nodeType!==1)return '';
  const t=n.tagName;
  if(t==='BR')return '\n';
  if(t==='HR')return '\n\n---\n\n';
  if(t==='TABLE')return '\n\n'+Array.from(n.querySelectorAll('tr')).map(tr=>Array.from(tr.children).filter(c=>/^(TD|TH)$/.test(c.tagName)).map(c=>c.textContent.replace(/\s+/g,' ').trim()).join(' | ')).filter(Boolean).join('\n')+'\n\n';
  if(t==='PRE')return '\n\n'+n.textContent+'\n\n';
  const s=Array.from(n.childNodes).map(walk).join('');
  if(t==='LI')return '\n• '+s.trim();
  return /^(H1|H2|H3|H4|H5|H6|P|DIV|SECTION|MAIN|ARTICLE|UL|OL|BLOCKQUOTE|HEADER|FOOTER)$/.test(t)?'\n\n'+s+'\n\n':s;
 }
 return walk(root).replace(/\u00a0/g,' ').replace(/[ \t]+\n/g,'\n').replace(/\n[ \t]+/g,'\n').replace(/\n{3,}/g,'\n\n').trim();
}
function addScript(path){return new Promise((ok,fail)=>{const s=document.createElement('script');s.src=path;s.onload=ok;s.onerror=()=>fail(Error('Falha ao carregar '+path));document.head.appendChild(s)})}
async function ensure(id){const loader=w.CentralDisciplineLoader;if(loader&&loader.load&&!loader.isReady(id))await loader.load(id)}
async function packed(id){
 const civil=id==='civil',varName=civil?'CIVIL_NATIVE_PACKED_B64':'CPP_NATIVE_PACKED_B64',store=civil?'CIVIL_NATIVE_CONTENT':'CPP_NATIVE_CONTENT';
 if(w[store]&&Object.keys(w[store]).length)return w[store];
 if(!w[varName])await addScript(civil?'/content/civil/civil-native-content-packed.js?v=20261005civil1':'/content/cpp/cpp-native-content-packed.js?v=cpp20261005prod1');
 if(!w.DecompressionStream)throw Error('O navegador não suporta a descompactação deste curso');
 const bytes=Uint8Array.from(atob(w[varName]),c=>c.charCodeAt(0));
 const text=await new Response(new Blob([bytes]).stream().pipeThrough(new DecompressionStream('gzip'))).text();
 w[store]=Object.assign(w[store]||{},JSON.parse(text));
 return w[store];
}
async function readDiscipline(id){
 if(id==='pt'){
  const c=w.CentralPortugueseCourse;if(!c||!c.load)throw Error('Curso indisponível');
  const texts=await c.load();return (c.modules||[]).map(m=>({n:m.num,title:m.title,complete:texts[m.id],completeHtml:true}));
 }
 if(id==='trabalho'){
  const out=[];
  for(let n=1;n<=18;n++){
   const r=await fetch('/modules/trabalho/base-completa/m'+pad(n)+'.html');
   if(!r.ok){out.push({n,title:'Módulo '+n,error:'HTTP '+r.status});continue}
   const html=await r.text(),d=new DOMParser().parseFromString(html,'text/html');
   out.push({n,title:d.querySelector('h1')?.textContent||d.title||'Módulo '+n,complete:html,completeHtml:true,whole:true});
  }
  return out;
 }
 await ensure(id);
 if(id==='civil'||id==='cpp'){
  const data=await packed(id),idx=id==='civil'?w.CIVIL_NATIVE_INDEX:w.CPP_NATIVE_INDEX;
  if(!idx||!Array.isArray(idx.modules))throw Error('Índice não carregado');
  return idx.modules.map(m=>({n:m.number,title:m.title,summary:data[m.uid]?.summaryHtml,summaryHtml:true,complete:data[m.uid]?.completeHtml,completeHtml:true}));
 }
 if(id==='adm'){
  const idx=w.ADM_NATIVE_INDEX,content=w.ADM_NATIVE_CONTENT||{};
  if(!idx)throw Error('Índice Administrativo não carregado');
  return Object.values(idx.modules||{}).map(m=>({n:m.number,title:m.title,summary:content[m.uid]?.summaryHtml,summaryHtml:true,complete:null,note:'Teoria completa permanece no acervo legado'}));
 }
 const data=w.BASE_NATIVE_CONTENT?.[id];if(!data)throw Error('Fonte não carregada');
 return Object.entries(data).filter(([key,v])=>v&&typeof v==='object'&&(v.number||/^m\d+$/.test(key))).map(([key,v])=>({n:Number(v.number||key.slice(1)),title:v.title||'Módulo',summary:v.summary,complete:v.complete}));
}
function makeText(d,row,mode){
 const raw=row[mode];if(typeof raw!=='string'||!raw.trim())return '';
 return row[mode+'Html']?htmlText(raw,!!row.whole):raw.replace(/\r\n?/g,'\n').trim();
}
const nameFor=(d,r,m)=>slug(d[1])+'_M'+pad(r.n)+'_'+kind(m)+'.txt';
function header(d,r,m,text){return 'BASE COMPLETA | '+d[1]+'\nM'+pad(r.n)+' — '+r.title+'\n'+kind(m)+'\n'+'='.repeat(54)+'\n\n'+text+'\n'}
function linkDownload(filename,blob){
 const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=filename;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),30000);
}
const txtBlob=t=>new Blob(['\uFEFF',t],{type:'text/plain;charset=utf-8'});
function crc32(bytes){let crc=-1;for(const b of bytes){crc^=b;for(let n=0;n<8;n++)crc=(crc>>>1)^((crc&1)?0xedb88320:0)}return (crc^-1)>>>0}
function zip(entries){
 const enc=new TextEncoder(),locals=[],centers=[];let offset=0,size=0;
 for(const entry of entries){
  const n=enc.encode(entry.name),data=enc.encode('\uFEFF'+entry.text),crc=crc32(data);
  const l=new Uint8Array(30+n.length),a=new DataView(l.buffer);
  a.setUint32(0,0x04034b50,true);a.setUint16(4,20,true);a.setUint16(6,0x0800,true);a.setUint32(14,crc,true);a.setUint32(18,data.length,true);a.setUint32(22,data.length,true);a.setUint16(26,n.length,true);l.set(n,30);
  const c=new Uint8Array(46+n.length),v=new DataView(c.buffer);
  v.setUint32(0,0x02014b50,true);v.setUint16(4,20,true);v.setUint16(6,20,true);v.setUint16(8,0x0800,true);v.setUint32(16,crc,true);v.setUint32(20,data.length,true);v.setUint32(24,data.length,true);v.setUint16(28,n.length,true);v.setUint32(42,offset,true);c.set(n,46);
  locals.push(l,data);centers.push(c);offset+=l.length+data.length;size+=c.length;
 }
 const e=new Uint8Array(22),v=new DataView(e.buffer);v.setUint32(0,0x06054b50,true);v.setUint16(8,entries.length,true);v.setUint16(10,entries.length,true);v.setUint32(12,size,true);v.setUint32(16,offset,true);
 return new Blob([...locals,...centers,e],{type:'application/zip'});
}
function show(){
 if(document.querySelector('.bc-text-export-mask'))return;
 const mask=document.createElement('div');mask.className='bc-text-export-mask';
 mask.innerHTML='<section class="bc-text-export-dialog" role="dialog" aria-modal="true" aria-label="Exportar textos"><h2>Exportar textos dos módulos</h2><p>Escolha uma disciplina ou baixe todas. Os textos completos e resumidos ficam em arquivos separados. Um relatório identifica conteúdos indisponíveis.</p><label>Disciplina<select data-export-disc><option value="all">Todas as disciplinas</option>'+DISC.map(d=>'<option value="'+d[0]+'">'+escapeHtml(d[1])+'</option>').join('')+'</select></label><label>Módulo (opcional)<input type="number" min="1" max="99" placeholder="Todos os módulos" data-export-number disabled></label><label>Versão<select data-export-mode><option value="both">Completa e resumida</option><option value="summary">Somente resumida</option><option value="complete">Somente completa</option></select></label><div class="bc-text-export-actions"><button type="button" data-export-start>Baixar</button><button type="button" data-export-cancel>Fechar</button></div><p data-export-status role="status" aria-live="polite"></p></section>';
 document.body.appendChild(mask);
 const select=mask.querySelector('[data-export-disc]'),mod=mask.querySelector('[data-export-number]'),mode=mask.querySelector('[data-export-mode]'),btn=mask.querySelector('[data-export-start]'),status=mask.querySelector('[data-export-status]');
 function close(){mask.remove();document.removeEventListener('keydown',key)}
 function key(e){if(e.key==='Escape')close()}
 document.addEventListener('keydown',key);
 mask.querySelector('[data-export-cancel]').onclick=close;mask.onclick=e=>{if(e.target===mask)close()};
 select.onchange=()=>{mod.disabled=select.value==='all';if(mod.disabled)mod.value=''};
 btn.onclick=async()=>{
  btn.disabled=true;const modes=mode.value==='both'?['summary','complete']:[mode.value],target=DISC.filter(d=>select.value==='all'||select.value===d[0]),n=mod.value?Number(mod.value):null,files=[],issues=[];
  for(let i=0;i<target.length;i++){
   const d=target[i];status.textContent='Lendo '+d[1]+' ('+(i+1)+' de '+target.length+')...';
   try{
    const rows=await readDiscipline(d[0]),selected=n?rows.filter(r=>r.n===n):rows,seen=new Set();
    if(!selected.length)issues.push(d[1]+': módulo não encontrado');
    selected.sort((a,b)=>a.n-b.n);
    for(const r of selected){
     seen.add(r.n);
     for(const m of modes){
      if(m==='summary'&&(d[0]==='pt'||d[0]==='trabalho'))continue;
      const t=makeText(d,r,m);
      if(t)files.push({name:nameFor(d,r,m),text:header(d,r,m,t)});
      else issues.push(d[1]+' M'+pad(r.n)+' '+kind(m)+': '+(r.note||r.error||'texto indisponível'));
     }
    }
    if(!n)for(let j=1;j<=d[2];j++)if(!seen.has(j))issues.push(d[1]+' M'+pad(j)+': fonte ausente');
   }catch(e){issues.push(d[1]+': '+(e.message||e))}
  }
  const report='BASE COMPLETA — RELATÓRIO DE EXPORTAÇÃO\n'+new Date().toLocaleString('pt-BR')+'\nArquivos exportados: '+files.length+'\n\nPENDÊNCIAS\n'+(issues.join('\n')||'Nenhuma')+'\n\nObservação: o lote usa as fontes nativas de origem. Edições feitas pelo editor visual podem não constar aqui. Para obter a versão editada, abra o leitor e use Baixar texto.';
  if(!files.length){status.textContent='Não foi encontrado texto para exportar.\n'+issues.slice(0,8).join('\n');btn.disabled=false;return}
  try{
   if(files.length===1&&!issues.length)linkDownload(files[0].name,txtBlob(files[0].text));
   else linkDownload('BASE_COMPLETA_TEXTOS_'+(select.value==='all'?'GERAL':select.value.toUpperCase())+'.zip',zip([...files,{name:'RELATORIO_EXPORTACAO.txt',text:report}]));
   status.textContent=files.length+' arquivo(s) preparado(s); '+issues.length+' aviso(s). Consulte o relatório dentro do ZIP.';
  }catch(e){status.textContent='Falha ao exportar: '+(e.message||e)}
  btn.disabled=false;
 };
 btn.focus();
}
function readerButton(o){
 const tools=o.querySelector('.bc-native-reader-tools,.cf-native-reader>aside'),article=o.querySelector('.bc-native-article,.cf-native-reader article');
 if(!tools||!article||!article.textContent.trim()||tools.querySelector('[data-bc-download-text]'))return;
 const b=document.createElement('button');b.type='button';b.className='bc-export-text-btn';b.dataset.bcDownloadText='1';b.textContent='↓ Baixar texto';
 b.onclick=()=>{
  if(article.classList.contains('bc-block-editing')){alert('Salve ou cancele as alterações antes de exportar.');return}
  const title=o.querySelector('.bc-native-reader-title b,.cf-native-shell>header b')?.textContent||'Módulo',sub=o.querySelector('.bc-native-reader-title small,.cf-native-shell>header small')?.textContent||'';
  const content=htmlText(article.innerHTML,false);
  if(!content){alert('Texto indisponível.');return}
  linkDownload(slug(title+'-'+sub)+'.txt',txtBlob(title+'\n'+sub+'\n\n'+content+'\n'));
 };
 tools.appendChild(b);
}
const style=document.createElement('style');style.textContent='.bc-export-text-btn{border:1px solid #448ca8!important;border-radius:8px!important;padding:8px 11px!important;background:transparent!important;color:inherit!important;cursor:pointer}.bc-text-export-mask{position:fixed;inset:0;z-index:200000;background:#061025bc;display:grid;place-items:center;padding:14px}.bc-text-export-dialog{width:min(490px,100%);max-height:90vh;overflow:auto;background:#102137;color:#f2f7ff;border:1px solid #45617e;border-radius:14px;padding:22px;box-shadow:0 15px 60px #0007}.bc-text-export-dialog h2{font-size:20px;margin:0}.bc-text-export-dialog p{font-size:12px;color:#cbd6e8;line-height:1.5}.bc-text-export-dialog label{display:block;margin:13px 0;font-size:12px;font-weight:700}.bc-text-export-dialog select,.bc-text-export-dialog input{display:block;box-sizing:border-box;margin-top:6px;width:100%;padding:10px;background:#203951;color:#fff;border:1px solid #7890a6;border-radius:8px}.bc-text-export-actions{display:flex;gap:10px;margin-top:18px}.bc-text-export-actions button{padding:11px 16px;border:1px solid #7890a6;background:#243b54;color:#fff;border-radius:8px;cursor:pointer}.bc-text-export-actions [data-export-start]{background:#117eaf;border-color:#117eaf}.bc-text-export-dialog [role=status]{white-space:pre-wrap}';
document.head.appendChild(style);
let scheduled=false;
function scan(){
 if(scheduled)return;scheduled=true;
 requestAnimationFrame(()=>{
  scheduled=false;
  const actions=document.querySelector('.topbar .top-actions');
  if(actions&&!actions.querySelector('[data-bc-export-open]')){
   const b=document.createElement('button');b.className='bc-export-text-btn';b.dataset.bcExportOpen='1';b.type='button';b.textContent='↓ Exportar textos';b.onclick=show;actions.insertBefore(b,actions.firstChild);
  }
  document.querySelectorAll('.bc-native-reader-overlay,.cf-native-overlay').forEach(readerButton);
 });
}
function boot(){scan();new MutationObserver(scan).observe(document.body,{childList:true,subtree:true})}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
w.BaseCompletaTextExport={htmlText,zip,readDiscipline,show};
})(window);
