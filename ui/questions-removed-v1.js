/* Base Completa — desativação de questões no ambiente de estudos.
   Preserva as leituras, anotações e registros históricos; não apaga dados de alunos.
   Executar antes dos renderizadores, inclusive em módulos carregados dinamicamente. */
(function(global){
 'use strict';
 if(global.BCQuestionsRemoved)return;
 global.BCQuestionsRemoved=true;
 const selector=[
  '.pt-cf-button-quiz','[data-pt-cf-quiz]','.pta-question','.pta-feedback','.pta-practice',
  '.cv-standard-quiz','.cv-standard-card .cv-standard-quiz','.cv-question-card','#civil-native-questions',
  '.adm-cf-quiz','.adm-native-card-actions button.ghost',
  '.cf-study-quiz','.cf-study-law','.cpp-native-lei-card','.cpp-native-question',
  '.bc-native-quiz-card','.bc-native-internal-review','.bc-native-quiz-options',
  '.bc-rlm-quiz','.bc-rlm-exam-question','.bc-rlm-exam-status','.bc-rlm-exam-score',
  '[data-rlm-kind="quiz"]','[data-rlm-kind="exam"]','[data-rlm-kind="review"]','[data-rlm-kind="errors"]',
  '[data-rlm-module="RF"]',
  '[data-penal-approved-questions]','.penal-approved-questions',
  '.cpc-approved-card .cpc-approved-secondary',
  '.cf-question','.cf-questions','.cf-qtop','.cf-qbar','.cf-option-row','.cf-result-grid',
  '.bcq-module-panels','[data-bcq-module-panel]','[data-bcq-module-slot]',
  '.bcq-page-layout','.bcq-center-panel','.bcq-center-tabs','.bcq-page-head',
  '.tec-validated-panel','.cpp-native-tec-panel','.adm-native-tec-filter',
  '.cpc-external-form','.cpp-native-round','.cv-rounds','.adm-native-external-entry',
  '[data-bc-question-center]','[data-bcq-platform]','.bc-question-center',
  '#leiEmDiaOverlay','#centralQuestionOverlay','#bcQuestionCenterOverlay',
  '.bc-iq','.bc-iq-answer','.bc-iq-check','.bc-iq-button',
  '.pt-questions','.pt-quiz','.pt-native-quiz','.pt-active-quiz',
  '.cf-native-quiz','.cf-native-options',
  '.bc-rlm-exam','.bc-rlm-errors','.bc-rlm-review-quiz',
  '.penal-approved-progress-card:nth-child(2)',
  '.cv-progress-grid > .cv-progress-card:nth-child(2)',
  '.adm-native-progress-panel .adm-native-progress-line:nth-child(2)'
 ].join(',');
 const actions=/^(?:resolver|fazer|praticar|iniciar|abrir|ver|revisar|corrigir|refazer|acessar|visualizar|filtrar|registrar)\s+(?:\d+\s+)?(?:as?\s+|meus?\s+|novas?\s+)?(?:quest[õo]es?|exerc[ií]cios?|simulados?|cadernos?(?:\s+tec)?|gabaritos?|erros(?:\s+das?\s+quest[õo]es?)?|lei em dia|central de quest[õo]es?|filtros?\s+(?:tec|qc))/i;
 const standalone=/^(?:quest[õo]es?|central de quest[õo]es|lei em dia|cadernos? (?:tec|qc)|simulados?|revisar meus erros|resolver (?:5|10|20) quest[õo]es|quest[õo]es internas indispon[ií]veis)$/i;
 const handlers=/\b(?:openQuiz|openQuestions|startPenalQuiz|openLeiSecaEnxuta|openTecCadernos|tecAbrirCaderno|openQuestionCenter|RlmExam\.|openEmbeddedTool\(['"]decorando|CentralReaderQuestions\.)/i;
 const hrefs=/\/(?:central-de-questoes|tools\/(?:decorando|lei-em-dia-gratis)\.html)(?:[?#]|$)/i;
 const sectionTitles=/^(?:\d+[\s.\-–:]*)?(?:quest[õo]es?(?:\s+(?:internas?|comentadas?|de\s+fixa[çc][ãa]o|de\s+revis[ãa]o|de\s+prova|para\s+praticar|para\s+resolver))?|bateria de quest[õo]es|simulado(?:\s+(?:final|cumulativo|do\s+m[oó]dulo))?|exerc[ií]cios?\s+(?:de\s+fixa[çc][ãa]o|comentados?))$/i;
 const word=s=>String(s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/\s+/g,' ').trim();
 const hit=(s,rx)=>rx.test(word(s));
 const exactSpecial=(label)=>/^(?:lei em dia|cadernos?(?: tec| qc)?|central de questoes|questoes|simulados?|revisar meus erros|filtro de questoes|filtro tec|filtro qc)$/i.test(word(label));
 function isQuestionAction(el){
  if(!el||el.nodeType!==1)return false;
  const label=String(el.getAttribute('aria-label')||el.textContent||'').replace(/\s+/g,' ').trim().slice(0,135);
  const action=el.getAttribute('onclick')||'';
  const href=el.getAttribute('href')||'';
  return hit(label,actions)||hit(label,standalone)||exactSpecial(label)||
   handlers.test(action)||hrefs.test(href)||
   /^(?:quiz|questions|exam|errors|cumulative-review|active)$/.test(el.dataset.ptCfQuiz||'')||
   /^(?:quiz|exam|errors)$/.test(el.dataset.rlmKind||'');
 }
 function kill(el){if(el?.isConnected)el.remove()}
 function removeSections(scope){
  const roots=scope.querySelectorAll?.('.bc-native-article,.pt-doc,.cf-native-reader article,.cv-reader-article,.adm-native-article,.cpp-native-article,.bc-rlm-article')||[];
  roots.forEach(root=>{
   // Parágrafos explícitos de questões e gabaritos, não explicações sobre o assunto.
   root.querySelectorAll('p,li,h3,h4').forEach(el=>{
    if(!el.isConnected||el.closest('blockquote,.cf-native-table,table'))return;
    const t=word(el.textContent).slice(0,160);
    if(/^(?:questao\s*(?:no?\.?\s*)?\d+\s*[:.)-]|gabarito(?:\s+comentado)?\s*[:.]|alternativas?\s*[:.]|resposta correta\s*:)/.test(t)){
     if(el.children.length===0||el.matches('h3,h4'))kill(el);
    }
   });
   root.querySelectorAll('section,article,details').forEach(el=>{
    if(!el.isConnected)return;
    const h=el.querySelector(':scope > h2,:scope > h3,:scope > h4,:scope > summary');
    if(h&&sectionTitles.test(word(h.textContent))&& !/(?:leitura|teoria|revisao da teoria)/.test(word(el.className)))kill(el);
   });
  });
 }
 function sweep(){
  if(!document.body)return;
  document.querySelectorAll(selector).forEach(kill);
  document.querySelectorAll('button,a,[role="button"],[role="tab"]').forEach(el=>{
   if(!isQuestionAction(el))return;
   const box=el.closest('.cf-resource-box,.cpp-native-links,.bc-resource-card');
   if(box&&exactSpecial(box.querySelector('h4,b,h3')?.textContent))kill(box);
   else kill(el);
  });
  document.querySelectorAll('#centralSidebar .nav > *,#studentMorePanel a,#studentMorePanel button,.bc-bottom-nav button,.bc-bottom-nav a').forEach(el=>{
   if(exactSpecial(el.textContent))kill(el);
  });
  document.querySelectorAll('.cf-module-stat,.cv-module-head small,.bc-rlm-stage-progress').forEach(el=>{
   if(!el.isConnected)return;
   if(/quest[õo]es?\s+(?:resumidas|completas)|5\s*\+\s*10\s+quest[õo]es/i.test(el.textContent))el.textContent=el.textContent.replace(/[•·]?\s*(?:\d+\s+quest[õo]es?\s+resumidas\s*[•·]\s*\d+\s+quest[õo]es?\s+completas|5\s*\+\s*10\s+quest[õo]es?.*)/i,'').trim();
  });
  removeSections(document);
 }
 let scheduled=false;
 function schedule(){
  if(scheduled)return;
  scheduled=true;
  (global.requestAnimationFrame||global.setTimeout)(()=>{scheduled=false;sweep()},60);
 }
 function block(event){
  const item=event.target?.closest?.('button,a,[role="button"],[role="tab"]');
  if(!item||!isQuestionAction(item))return;
  event.preventDefault();event.stopImmediatePropagation();
 }
 document.addEventListener('click',block,true);
 document.addEventListener('submit',event=>{if(event.target?.closest?.('.bcq-page-layout,.bc-native-quiz-card,.cf-question,.bc-rlm-exam')){event.preventDefault();event.stopImmediatePropagation()}},true);
 function start(){
  sweep();
  const observer=new MutationObserver(records=>{
   if(!records.some(rec=>Array.from(rec.addedNodes).some(n=>n.nodeType===1)))return;
   schedule();
  });
  observer.observe(document.body,{childList:true,subtree:true});
  document.addEventListener('central:discipline-ready',schedule);
  global.BCQuestionsRemovedUI={sweep,schedule};
 }
 if(document.body)start();
 else document.addEventListener('DOMContentLoaded',start,{once:true});
})(window);
