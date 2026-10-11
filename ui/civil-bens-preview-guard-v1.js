/* Preview-only compatibility guard for Civil M03 Bens.
   Ensures the M03 formatter runs even when a legacy reader renderer supersedes CivilNative.openReader. */
(function(g){
 'use strict';
 const selector='#civil-native-reader';
 function apply(){
  const overlay=document.querySelector(selector);
  if(!overlay)return;
  const title=overlay.querySelector('.bc-native-reader-title');
  if(!title || !/\bBens\b/.test(title.textContent||'') || !/M[ÓO]DULO\s*0?3/i.test(title.textContent||''))return;
  const body=overlay.querySelector('.bc-native-scroll');
  if(!body || !body.querySelector('pre.civil-source-table'))return;
  const complete=/COMPLETA/i.test(title.textContent||'');
  if(!g.CivilBensApostila?.enhance)return;
  if(g.CivilBensApostila.enhance(body,complete?'complete':'summary')){
   const toc=overlay.querySelector('.bc-native-toc');
   if(toc){
    toc.replaceChildren();
    [...body.querySelectorAll('h1,h2,h3')].forEach((h,i)=>{
     if(!h.id)h.id='bc-bens-heading-'+i;
     const btn=document.createElement('button');
     btn.type='button';btn.textContent=h.textContent;
     btn.addEventListener('click',()=>h.scrollIntoView({behavior:'smooth',block:'start'}));
     toc.appendChild(btn);
    });
   }
  }
 }
 const observer=new MutationObserver(()=>apply());
 function start(){observer.observe(document.body,{childList:true,subtree:true});apply();}
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});
 else start();
})(window);
