/* Base Completa — Objetivo de estudos: visibilidade por concurso, sem apagar progresso.
 * General: disciplinas existentes; GMF: programa de referência do edital 2023.
 * Seleção é local ao navegador, não altera plano nem permissões de acesso.
 */
(function(global){
 'use strict';
 if(global.GmfStudyObjective)return;
 const KEY='central-v6:study-objective-v1';
 const DEFAULT='general';
 const GMF='gmf-fortaleza';
 const EXTRA=new Set(['atual','fortaleza','legesp','dh']);
 const GMF_IDS=new Set(['pt','rlm','info','cf','adm','penal','cpp','atual','fortaleza','legesp','dh']);
 const esc=s=>String(s??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
 function current(){
   try{return global.localStorage?.getItem(KEY)===GMF?GMF:DEFAULT}catch(_){return DEFAULT}
 }
 function allowsSubject(id){
   const code=String(id??'');
   return current()===GMF?GMF_IDS.has(code):!EXTRA.has(code);
 }
 function state(){
   const value=current();
   global.document.documentElement.dataset.gmfStudyGoal=value;
   const select=global.document.getElementById('gmfStudyGoalSelect');
   if(select&&select.value!==value)select.value=value;
   const hint=global.document.getElementById('gmfStudyGoalHint');
   if(hint)hint.textContent=value===GMF
     ? 'Programa de referência do edital GMF 2023. Matérias específicas visíveis; módulos em desenvolvimento identificados.'
     : 'Disciplinas gerais da Central. As matérias exclusivas da GMF permanecem ocultas.';
   const agenda=global.document.getElementById('agendaDisc');
   if(agenda){
     for(const option of Array.from(agenda.options||[])){
       const available=allowsSubject(option.value);
       option.hidden=!available;
       option.disabled=!available;
     }
     if(agenda.selectedOptions?.[0]?.disabled){
       const fallback=Array.from(agenda.options||[]).find(option=>!option.disabled);
       if(fallback){agenda.value=fallback.value;agenda.dispatchEvent(new Event('change',{bubbles:true}));}
     }
   }
 }
 function install(){
   const grid=global.document.getElementById('disciplineGrid');
   if(!grid||!grid.parentNode)return;
   let wrap=global.document.getElementById('gmfStudyGoalChooser');
   if(!wrap){
     wrap=global.document.createElement('section');
     wrap.id='gmfStudyGoalChooser';
     wrap.className='gmf-goal-chooser';
     wrap.setAttribute('aria-label','Objetivo de estudos');
     wrap.innerHTML='<div class="gmf-goal-control"><div><label for="gmfStudyGoalSelect">Meu objetivo de estudos</label>'+
       '<p id="gmfStudyGoalHint">Selecione o concurso para mostrar as matérias correspondentes.</p></div>'+
       '<select id="gmfStudyGoalSelect" aria-describedby="gmfStudyGoalHint">'+
       '<option value="general">Estudo geral</option>'+
       '<option value="gmf-fortaleza">Guarda Municipal de Fortaleza</option></select></div>';
     grid.parentNode.insertBefore(wrap,grid);
     wrap.querySelector('select').addEventListener('change',event=>choose(event.target.value));
   }
   state();
 }
 function choose(value,{navigate=false}={}){
   const target=value===GMF?GMF:DEFAULT;
   try{global.localStorage?.setItem(KEY,target)}catch(_){}
   global.BaseCompletaFocusNavigation?.backToSubjects?.();
   state();
   try{global.renderAll?.()}catch(error){console.warn('[Objetivo GMF] não foi possível atualizar a página inicial',error)}
   try{global.renderDisciplineGrid?.()}catch(error){console.warn('[Objetivo GMF] não foi possível atualizar as disciplinas',error)}
   if(navigate){
     try{global.openDisciplines?.()}catch(_){}
   }
   global.document.dispatchEvent(new CustomEvent('central:study-objective-changed',{detail:{objective:target}}));
   return target;
 }
 const style=global.document.createElement('style');
 style.id='gmf-study-objective-css';
 style.textContent=[
   /* A ocultação por CSS também protege contra cartões estáticos anteriores à renderização dinâmica. */
   'html:not([data-gmf-study-goal="gmf-fortaleza"]) .subject[data-id="atual"],html:not([data-gmf-study-goal="gmf-fortaleza"]) .subject[data-id="fortaleza"],html:not([data-gmf-study-goal="gmf-fortaleza"]) .subject[data-id="legesp"],html:not([data-gmf-study-goal="gmf-fortaleza"]) .subject[data-id="dh"]{display:none!important}',
   'html:not([data-gmf-study-goal="gmf-fortaleza"]) .disc-card[data-id="atual"],html:not([data-gmf-study-goal="gmf-fortaleza"]) .disc-card[data-id="fortaleza"],html:not([data-gmf-study-goal="gmf-fortaleza"]) .disc-card[data-id="legesp"],html:not([data-gmf-study-goal="gmf-fortaleza"]) .disc-card[data-id="dh"]{display:none!important}',
   'html:not([data-gmf-study-goal="gmf-fortaleza"]) .bcqa-card[data-disc="atual"],html:not([data-gmf-study-goal="gmf-fortaleza"]) .bcqa-card[data-disc="fortaleza"],html:not([data-gmf-study-goal="gmf-fortaleza"]) .bcqa-card[data-disc="legesp"],html:not([data-gmf-study-goal="gmf-fortaleza"]) .bcqa-card[data-disc="dh"]{display:none!important}',
   'html[data-gmf-study-goal="gmf-fortaleza"] .subject[data-id="civil"],html[data-gmf-study-goal="gmf-fortaleza"] .subject[data-id="cpc"],html[data-gmf-study-goal="gmf-fortaleza"] .disc-card[data-id="civil"],html[data-gmf-study-goal="gmf-fortaleza"] .disc-card[data-id="cpc"],html[data-gmf-study-goal="gmf-fortaleza"] .bcqa-card[data-disc="civil"],html[data-gmf-study-goal="gmf-fortaleza"] .bcqa-card[data-disc="cpc"]{display:none!important}',
   '.gmf-goal-chooser{margin:0 0 16px;padding:17px 19px;background:var(--panel,#fff);border:1px solid var(--line,#e1e7ed);border-radius:12px}',
   '.gmf-goal-control{display:flex;align-items:center;justify-content:space-between;gap:18px}',
   '.gmf-goal-control label{display:block;font:700 15px/1.45 system-ui;color:var(--text,#253346)}',
   '.gmf-goal-control p{margin:5px 0 0;font:400 12px/1.5 system-ui;color:var(--muted,#687585);max-width:660px}',
   '.gmf-goal-control select{width:min(100%,330px);min-height:43px;background:var(--panel,#fff);color:var(--text,#253346);border:1px solid var(--line,#cbd5df);border-radius:8px;padding:10px;font:600 13px system-ui}',
   '.gmf-goal-control select:focus-visible{outline:2px solid #426f93;outline-offset:2px}',
   '@media(max-width:680px){.gmf-goal-chooser{padding:14px}.gmf-goal-control{align-items:stretch;flex-direction:column;gap:10px}.gmf-goal-control select{width:100%;max-width:none}}'
 ].join('');
 global.document.head.appendChild(style);
 global.GmfStudyObjective=Object.freeze({installed:true,key:KEY,options:[DEFAULT,GMF],current,allowsSubject,choose,sync:state});
 state();
 if(global.document.readyState==='loading')global.document.addEventListener('DOMContentLoaded',install,{once:true});
 else install();
})(window);
