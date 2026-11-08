/* Approved ADM presentation. Content bundles retain the normal course access rules. */
(function(g){
 'use strict';
 const pending=new Map();
 function styles(){if(document.querySelector('link[data-adm-apostila-style]'))return;const link=document.createElement('link');link.rel='stylesheet';link.href='/ui/adm-apostila-reading-v1.css?v=20261108adm1';link.dataset.admApostilaStyle='1';document.head.append(link);}
 async function load(number,mode){
  if(!Number.isInteger(number)||number<1||number>20||!['complete','summary'].includes(mode))throw new Error('Material ADM inválido');
  styles();const key=number+':'+mode;if(pending.has(key))return pending.get(key);
  const task=(async()=>{
   if(!g.ADM_APOSTILA_PACKED?.[key])await new Promise((resolve,reject)=>{const s=document.createElement('script');s.src='/content/adm/m'+String(number).padStart(2,'0')+'-apostila-'+mode+'.js?v=20261108adm1';s.onload=()=>{s.remove();g.ADM_APOSTILA_PACKED?.[key]?resolve():reject(new Error('Material ADM não localizado'));};s.onerror=()=>{s.remove();reject(new Error('Falha ao carregar a leitura ADM'));};document.head.append(s);});
   const bytes=Uint8Array.from(atob(g.ADM_APOSTILA_PACKED[key]),c=>c.charCodeAt(0));
   return new Response(new Blob([bytes]).stream().pipeThrough(new DecompressionStream('gzip'))).text();
  })().catch(error=>{pending.delete(key);throw error;});pending.set(key,task);return task;
 }
 g.AdmApostilaReading={load};
})(window);
