/* Loads only the Civil presentation; no student APIs or progress storage. */
(function(g){
 'use strict';
 let pending=null;
 function styles(){
  if(document.getElementById('civil-visual-apostila-style'))return;
  const link=document.createElement('link');link.id='civil-visual-apostila-style';link.rel='stylesheet';link.href='/ui/civil-visual-apostila-v1.css?v=20261107civil2';document.head.append(link);
 }
 async function data(){
  if(!pending)pending=(async()=>{
   await new Promise((resolve,reject)=>{const s=document.createElement('script');s.src='/content/civil/civil-visual-apostila-packed.js?v=20261107civil2';s.onload=resolve;s.onerror=()=>reject(new Error('Falha ao carregar a apostila de Civil'));document.head.append(s);});
   const bytes=Uint8Array.from(atob(g.CIVIL_APOSTILA_PACKED_B64),c=>c.charCodeAt(0));
   return JSON.parse(await new Response(new Blob([bytes]).stream().pipeThrough(new DecompressionStream('gzip'))).text());
  })().catch(error=>{pending=null;throw error;});
  return pending;
 }
 g.CivilVisualApostila={async html(n){styles();const all=await data();if(!all[n]?.html)throw new Error('Apostila de Civil não localizada');return all[n].html;}};
})(window);
