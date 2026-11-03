/* Base Completa: navegação segura do plano personalizado para a disciplina/módulo real.
 * A função de foco atual continua responsável pelo conteúdo e progresso.
 * A ausência de correspondência só abre a lista real de módulos.
 */
(function(){
 'use strict';
 const params=new URLSearchParams(location.search);
 const subject=String(params.get('bc_plan_subject')||'');
 const uid=String(params.get('bc_plan_uid')||'');
 const subjects=new Set(['pt','cf','adm','civil','cpc','penal','cpp','rlm']);
 if(!subjects.has(subject)|| (uid&&!/^[a-z0-9][a-z0-9-]{0,110}$/.test(uid)))return;
 const normalized=v=>String(v||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase()
  .replace(/[^a-z0-9]+/g,' ').trim();
 const words=v=>normalized(v).replace(/^\d+\s*/,'').split(' ')
  .map(t=>t.replace(/s$/,''))
  .filter(t=>t.length>=5&&!['modulo','modulo','estudo','direito','direita'].includes(t));
 let expected=null,openedSubject=false,openedModule=false;
 let lastTry=0;
 const started=Date.now();
 function notice(message){
  const container=document.getElementById('bcFocusModules');
  if(!container||document.getElementById('bc-plan-link-notice'))return;
  const el=document.createElement('p');el.id='bc-plan-link-notice';
  el.style.cssText='border-left:3px solid #1ca4c7;padding:10px 13px;background:#eff6fa;color:#184663;border-radius:5px;font:500 13px/1.5 system-ui;margin:10px 0';
  el.textContent=message;
  container.prepend(el);
 }
 function targetMatch(card,entry){
  const label=card.querySelector('strong')?.textContent||card.textContent;
  const expectedNum=Number(normalized(entry.titulo).match(/^(\d{1,2})\b/)?.[1]);
  const actualNum=Number(normalized(card.querySelector('.bc-focus-module-number')?.textContent).match(/(\d{1,2})/)?.[1]);
  if(!expectedNum||!actualNum||actualNum!==expectedNum)return false;
  const names=new Set(words(label));
  return words(entry.titulo).some(word=>names.has(word));
 }
 function tryOpen(){
  if(openedModule||Date.now()-started>25000)return;
  if(Date.now()-lastTry<175)return;
  lastTry=Date.now();
  const nav=window.BaseCompletaFocusNavigation;
  const root=document.getElementById('subjects');
  if(!nav||!root||![...root.children].some(n=>n.dataset.id===subject))return;
  if(!openedSubject){
   if(typeof window.openHome==='function')window.openHome();
   nav.chooseSubject(subject);openedSubject=true;
  }
  if(!uid)return;
  if(!expected)return;
  const box=document.getElementById('bcFocusModules');
  if(!box||box.hidden)return;
  const cards=[...box.querySelectorAll('.bc-focus-module-card')].filter(x=>!x.classList.contains('bc-focus-fallback'));
  if(!cards.length)return;
  const matches=cards.map((card,index)=>({card,index})).filter(x=>targetMatch(x.card,expected));
  if(matches.length===1){
   openedModule=true;
   nav.openModule(matches[0].index);
  }else{
   // Catálogo antigo, mudança editorial, módulo indisponível ou numeração conflitante.
   // O aluno escolhe na lista existente; nunca abrir conteúdo errado.
   notice('Disciplina aberta. Escolha o módulo na lista: o nome ou a numeração do plano precisa de confirmação.');
  }
 }
 if(uid){
  fetch('/api/study-plans?action=catalog',{credentials:'same-origin',cache:'no-store'})
  .then(r=>r.ok?r.json():null)
  .then(data=>{expected=(data?.modulos||[]).find(m=>m.uid===uid&&m.disciplina_id===subject)||null;tryOpen();})
  .catch(()=>{});
 }
 const interval=setInterval(()=>{
  tryOpen();
  if(openedModule||Date.now()-started>25000)clearInterval(interval);
 },300);
 document.addEventListener('central:discipline-ready',e=>{if(e.detail?.id===subject)tryOpen()});
 document.addEventListener('DOMContentLoaded',tryOpen,{once:true});
 window.addEventListener('load',tryOpen,{once:true});
})();