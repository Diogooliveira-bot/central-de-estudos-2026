/* Base Completa — M01–M20: apostilas fornecidas pelo autor nas revisões.
   Não altera a teoria completa nem os blocos existentes de questões. */
(function(g){
'use strict';
const pending=new Map();
function styles(){
 if(document.querySelector('link[data-adm-apostila-style]'))return;
 const link=document.createElement('link');
 link.rel='stylesheet';link.dataset.admApostilaStyle='1';
 link.href='/ui/adm-apostila-reading-v1.css?v=20261121admm02arts1';
 document.head.append(link);
}
async function decompress(base64){
 const bytes=Uint8Array.from(atob(base64),c=>c.charCodeAt(0));
 return await new Response(new Blob([bytes]).stream().pipeThrough(new DecompressionStream('gzip'))).text();
}
function esc(value){return String(value||'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function addGuidedReviewArts(html,number){
 if(number!==2||html.includes('data-adm-review-art='))return html;
 const matches=[...html.matchAll(/<h2\b[^>]*>([\s\S]*?)<\/h2>/gi)];
 const chapters=matches.map((m,index)=>({index,start:m.index,end:m.index+m[0].length,title:m[1].replace(/<[^>]+>/g,'').trim()})).filter(x=>/^\d{2}\s+/.test(x.title));
 if(chapters.length!==9||chapters.some((x,i)=>!x.title.startsWith(String(i+1).padStart(2,'0')+' ')))throw new Error('A revisão guiada ADM M02 não contém os nove capítulos esperados.');
 let result=html;
 for(let i=chapters.length-1;i>=0;i--){
  const chapter=chapters[i],next=matches.find(x=>x.index>chapter.start),end=next?next.index:result.length;
  const n=String(i+1).padStart(2,'0'),title=chapter.title.replace(/^\d{2}\s+/,''),alt=`Arte de revisão: capítulo ${n} — ${title}`;
  const figure=`<figure class="adm-guided-review-art" data-adm-review-art="02-${n}"><img src="/assets/adm/revisao-guiada/m02/ADM-M02-C${n}.webp" alt="${esc(alt)}" loading="lazy" decoding="async"><figcaption>Resumo visual · Capítulo ${n}: ${esc(title)}</figcaption></figure>`;
  result=result.slice(0,end)+figure+result.slice(end);
 }
 return result;
}
function script(src,verify){return new Promise((resolve,reject)=>{
 const tag=document.createElement('script');tag.src=src;
 tag.onload=()=>{tag.remove();verify()?resolve():reject(new Error('Apostila não localizada após carregamento: '+src))};
 tag.onerror=()=>{tag.remove();reject(new Error('Não foi possível carregar: '+src))};
 document.head.append(tag);
})}
async function load(number,mode){
 if(!Number.isInteger(number)||number<1||number>20||!['complete','summary'].includes(mode))throw new Error('Material ADM inválido');
 styles();const key=number+':'+mode;
 if(pending.has(key))return pending.get(key);
 const task=(async()=>{
  if(!g.ADM_APOSTILA_PACKED?.[key])await script('/content/adm/m'+String(number).padStart(2,'0')+'-apostila-'+mode+'.js?v=20261108adm1',()=>!!g.ADM_APOSTILA_PACKED?.[key]);
  const originalHtml=await decompress(g.ADM_APOSTILA_PACKED[key]);
  if(mode==='complete')return originalHtml;
  if(!g.ADM_SUBMITTED_REVIEW?.[number]){
    await script('/content/adm/autor-20261110/adm-m'+String(number).padStart(2,'0')+'-submitted-review.js?v=20261116revjur1',()=>!!g.ADM_SUBMITTED_REVIEW?.[number]);
  }
  const authored=addGuidedReviewArts(await decompress(g.ADM_SUBMITTED_REVIEW[number]),number);
  const start=originalHtml.search(/<h2\b[^>]*>\s*5\s+Questões Internas[^<]*<\/h2>/i);
  if(start<0)throw new Error('Questões do M'+number+' não encontradas — atualização cancelada');
  const label=String(number).padStart(2,'0');
  const header='<header class="adm-author-overview"><span>DIREITO ADMINISTRATIVO · MÓDULO '+label+'</span><h1>Revisão: apostila teórica</h1><p>Leia em sequência. Entenda o caso e a explicação antes de consultar tabelas, artigos e questões.</p></header>';
  const footer='<section class="adm-author-review-tip"><h2>Consolide a aprendizagem</h2><p>Explique o conceito com suas palavras, retome o exemplo e só então responda às questões abaixo.</p></section>';
  return '<section class="adm-author-reading">'+header+authored+footer+'</section>'+originalHtml.slice(start);
 })().catch(error=>{pending.delete(key);throw error;});
 pending.set(key,task);return task;
}
g.AdmApostilaReading={load};
})(window);
