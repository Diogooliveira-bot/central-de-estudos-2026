/* Base Completa — M01–M20: apostilas fornecidas pelo autor nas revisões.
   Não altera a teoria completa nem os blocos existentes de questões. */
(function(g){
'use strict';
const pending=new Map();
function styles(){
 if(document.querySelector('link[data-adm-apostila-style]'))return;
 const link=document.createElement('link');
 link.rel='stylesheet';link.dataset.admApostilaStyle='1';
 link.href='/ui/adm-apostila-reading-v1.css?v=20261121admm03arts1';
 document.head.append(link);
}
async function decompress(base64){
 const bytes=Uint8Array.from(atob(base64),c=>c.charCodeAt(0));
 return await new Response(new Blob([bytes]).stream().pipeThrough(new DecompressionStream('gzip'))).text();
}
function esc(value){return String(value||'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function addGuidedReviewArts(html,number){
 if(![2,3].includes(number)||html.includes('data-adm-review-art='))return html;
 const matches=[...html.matchAll(/<h2\b[^>]*>([\s\S]*?)<\/h2>/gi)];
 const chapters=matches.map((m,index)=>({index,start:m.index,end:m.index+m[0].length,title:m[1].replace(/<[^>]+>/g,'').trim()})).filter(x=>/^\d{2}\s+/.test(x.title));
 const expectedM03=['01 O que é um ato administrativo?','02 Os cinco elementos de validade','03 Motivo, motivação e teoria dos motivos determinantes','04 Atributos dos atos administrativos','05 Atos vinculados, discricionários e mérito','06 Principais classificações dos atos','07 Perfeição, validade, eficácia e efeitos','08 Anulação, revogação e convalidação','09 Um caso completo: da decisão à revisão'];
 if(chapters.length!==9||chapters.some((x,i)=>!x.title.startsWith(String(i+1).padStart(2,'0')+' ')))throw new Error('A revisão guiada ADM M'+String(number).padStart(2,'0')+' não contém os nove capítulos esperados.');
 if(number===3&&chapters.some((x,i)=>x.title!==expectedM03[i]))throw new Error('Os títulos da revisão guiada ADM M03 diferem do inventário validado; as artes não foram inseridas.');
 let result=html;
 for(let i=chapters.length-1;i>=0;i--){
  const chapter=chapters[i],next=matches.find(x=>x.index>chapter.start),end=next?next.index:result.length;
  const n=String(i+1).padStart(2,'0'),mod=String(number).padStart(2,'0'),title=chapter.title.replace(/^\d{2}\s+/,''),alt=`Arte de revisão: capítulo ${n} — ${title}`;
  const figure=`<figure class="adm-guided-review-art" data-adm-review-art="${mod}-${n}"><img src="/assets/adm/revisao-guiada/m${mod}/ADM-M${mod}-C${n}.webp" alt="${esc(alt)}" loading="lazy" decoding="async"><figcaption>Resumo visual · Capítulo ${n}: ${esc(title)}</figcaption></figure>`;
  result=result.slice(0,end)+figure+result.slice(end);
 }
 return result;
}
function cleanComplete(html,number){
 const host=document.createElement('div');host.innerHTML=html;
 // Exercícios ficam exclusivamente na área independente de Questões.
 host.querySelectorAll('details.question,section.question,.adm-quiz').forEach(el=>el.remove());
 host.querySelectorAll('h2,h3').forEach(h=>{
  if(!/^(?:(?:5|10)\s+)?quest[oõ]es?\s+(?:internas?|de\s+fixa[çc][ãa]o)\b/i.test(h.textContent.trim()))return;
  const level=Number(h.tagName.slice(1));let next=h.nextElementSibling;
  while(next&&(!/^H[1-6]$/.test(next.tagName)||Number(next.tagName.slice(1))>level)){
   const following=next.nextElementSibling;next.remove();next=following;
  }
  h.remove();
 });
 if(number===1){
  // M01: retirar somente ilustrações da teoria COMPLETA, não da revisão.
  host.querySelectorAll('figure,picture,img,svg,canvas').forEach(el=>{
   if(!el.closest('figure,picture')||el.matches('figure,picture'))el.remove();
  });
 }
 return host.innerHTML;
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
  if(mode==='complete')return cleanComplete(originalHtml,number);
  if(!g.ADM_SUBMITTED_REVIEW?.[number]){
    await script('/content/adm/autor-20261110/adm-m'+String(number).padStart(2,'0')+'-submitted-review.js?v=20261116revjur1',()=>!!g.ADM_SUBMITTED_REVIEW?.[number]);
  }
  const authored=addGuidedReviewArts(await decompress(g.ADM_SUBMITTED_REVIEW[number]),number);
  const label=String(number).padStart(2,'0');
  const header='<header class="adm-author-overview"><span>DIREITO ADMINISTRATIVO · MÓDULO '+label+'</span><h1>Revisão: apostila teórica</h1><p>Leia em sequência. Entenda o caso e a explicação antes de consultar tabelas e artigos.</p></header>';
  const footer='<section class="adm-author-review-tip"><h2>Consolide a aprendizagem</h2><p>Explique o conceito com suas palavras e retome os exemplos mais importantes.</p></section>';
  return '<section class="adm-author-reading">'+header+authored+footer+'</section>';
 })().catch(error=>{pending.delete(key);throw error;});
 pending.set(key,task);return task;
}
g.AdmApostilaReading={load};
})(window);
