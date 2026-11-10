/* Approved ADM presentation. Content bundles retain the normal course access rules. */
(function(g){
 'use strict';
 const pending=new Map();
 const reviewScripts=new Map();
 function styles(){if(document.querySelector('link[data-adm-apostila-style]'))return;const link=document.createElement('link');link.rel='stylesheet';link.href='/ui/adm-apostila-reading-v1.css?v=20261108adm1';link.dataset.admApostilaStyle='1';document.head.append(link);}
 async function load(number,mode){
  if(!Number.isInteger(number)||number<1||number>20||!['complete','summary'].includes(mode))throw new Error('Material ADM inválido');
  styles();const key=number+':'+mode;if(pending.has(key))return pending.get(key);
  const task=(async()=>{
   if(!g.ADM_APOSTILA_PACKED?.[key])await new Promise((resolve,reject)=>{const s=document.createElement('script');s.src='/content/adm/m'+String(number).padStart(2,'0')+'-apostila-'+mode+'.js?v=20261108adm1';s.onload=()=>{s.remove();g.ADM_APOSTILA_PACKED?.[key]?resolve():reject(new Error('Material ADM não localizado'));};s.onerror=()=>{s.remove();reject(new Error('Falha ao carregar a leitura ADM'));};document.head.append(s);});
   const bytes=Uint8Array.from(atob(g.ADM_APOSTILA_PACKED[key]),c=>c.charCodeAt(0));
   const originalHtml=await new Response(new Blob([bytes]).stream().pipeThrough(new DecompressionStream('gzip'))).text();
   if(mode!=='summary')return originalHtml;
   const group=number<=5?'m01-m05':number<=10?'m06-m10':number<=15?'m11-m15':'m16-m20';
   if(!g.ADM_REVIEW_V2_DATA?.[number]){
    if(!reviewScripts.has(group)){
     const ready=new Promise((resolve,reject)=>{
      const s=document.createElement('script');
      s.src='/content/adm/adm-review-didactic-'+group+'.js?v=20261109admreview2';
      s.onload=()=>{s.remove();resolve();};
      s.onerror=()=>{s.remove();reject(new Error('Não foi possível carregar a revisão didática ADM'));};
      document.head.append(s);
     }).catch(error=>{reviewScripts.delete(group);throw error});
     reviewScripts.set(group,ready);
    }
    await reviewScripts.get(group);
   }
   const review=g.ADM_REVIEW_V2_DATA?.[number];
   if(!review||!Array.isArray(review.sections)||!review.sections.length)
    throw new Error('Revisão didática do módulo M'+number+' não localizada');
   const escape=value=>String(value??'').replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
   const header='<h1>'+escape(review.title)+'</h1><p class="lead">'+escape(review.intro)+'</p>';
   const lessons=review.sections.map(([heading,paragraphs,example])=>'<h2>'+escape(heading)+'</h2>'
    +(paragraphs||[]).map(p=>'<p>'+escape(p)+'</p>').join('')
    +(example?'<p><strong>Exemplo prático:</strong> '+escape(example.replace(/^Exemplo:\s*/i,'').replace(/^Exemplo prático:\s*/i,''))+'</p>':'')).join('');
   const memorize='<h2>Revisão final — o que lembrar</h2><ul>'+(review.remember||[]).map(item=>'<li>'+escape(item)+'</li>').join('')+'</ul>';
   const law='<details class="law"><summary>Consultar legislação citada</summary><ul>'+(review.laws||[]).map(([label,url])=>'<li><a href="'+escape(url)+'" target="_blank" rel="noopener noreferrer">'+escape(label)+'</a></li>').join('')+'</ul></details>';
   // O trecho de questões permanece intacto: os botões de fixação e seus gabaritos não mudam.
   const questionStart=originalHtml.search(/<h2\b[^>]*>\s*5\s+Questões Internas[^<]*<\/h2>/i);
   if(questionStart<0)throw new Error('Bloco de questões da revisão ADM não encontrado; substituição cancelada');
   return header+lessons+memorize+law+originalHtml.slice(questionStart);
  })().catch(error=>{pending.delete(key);throw error;});pending.set(key,task);return task;
 }
 g.AdmApostilaReading={load};
})(window);
