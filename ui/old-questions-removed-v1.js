/* Base Completa — retirada das questões internas ANTIGAS (5 do resumo + 10 da teoria completa).
   Mantém: teoria, revisão, notas, progresso de leitura, Lei em Dia, filtros e links do QConcursos/TEC,
   registros históricos do aluno e a nova área de Questões (elementos dentro de [data-bc-questoes-area]).
   Nada é apagado do armazenamento do aluno. */
(function(global){
 'use strict';
 if(global.BCQuestionsRemoved)return;
 // Sinaliza aos leitores de cada disciplina que as questões antigas não devem ser exibidas.
 global.BCQuestionsRemoved=true;
 const NOVA_AREA='[data-bc-questoes-area]';
 const selector=[
  '.pt-cf-button-quiz','[data-pt-cf-quiz]','.pta-question','.pta-feedback','.pta-practice','.pta-guided','.pta-module-summary',
  '.cv-standard-quiz','#civil-native-questions','.cv-question-card',
  '.adm-cf-quiz','.adm-native-card-actions button.ghost',
  '.cf-study-quiz','.cpp-native-question',
  '.bc-native-quiz-card','.bc-native-internal-review','.bc-native-quiz-options',
  '.bc-rlm-quiz','.bc-rlm-exam-question','.bc-rlm-exam-status','.bc-rlm-exam-score',
  '[data-rlm-kind="quiz"]','[data-rlm-kind="exam"]','[data-rlm-kind="review"]','[data-rlm-kind="errors"]',
  '[data-rlm-module="RF"]',
  '[data-penal-approved-questions]','.penal-approved-questions',
  '.cpc-approved-card .cpc-approved-secondary',
  '.cf-question','.cf-questions','.cf-qtop','.cf-qbar','.cf-option-row','.cf-result-grid',
  '.bc-iq','.bc-iq-answer','.bc-iq-check','.bc-iq-button',
  '.pt-questions','.pt-quiz','.pt-native-quiz','.pt-active-quiz',
  '.cf-native-quiz','.cf-native-options',
  '.bc-rlm-exam','.bc-rlm-errors','.bc-rlm-review-quiz',
  '.penal-approved-progress-card:nth-child(2)',
  '.cv-progress-grid > .cv-progress-card:nth-child(2)',
  '.adm-native-progress-panel .adm-native-progress-line:nth-child(2)'
 ].join(',');
 // Botões das questões internas antigas: "Resolver 5/10 questões", "10 questões autorais…", "Questões de fixação", simulados.
 const actions=/^(?:resolver|fazer|praticar|iniciar|refazer)\s+(?:\d+\s+)?(?:as?\s+|meus?\s+|novas?\s+)?(?:quest[õo]es|exerc[ií]cios)(?:\s+(?:internas?|autorais?|comentadas?|de fixa[çc][ãa]o|do (?:resumo|completo|m[óo]dulo)))?$|^\d+\s+quest[õo]es\s+autorais\b|^\d+\s+quest[õo]es\s+de\s+bancas?\b|^quest[õo]es\s+de\s+fixa[çc][ãa]o$|^simulados?$|^revisar meus erros$|^quest[õo]es\s+internas\s+indispon[ií]veis$/i;
 // Funções que abrem as questões internas antigas (o QC/TEC e a Lei em Dia usam outras).
 const handlers=/\b(?:openQuiz|openQuestions|startPenalQuiz|cpcStudyOpenQuiz|BcCpcInternal\.open|RlmExam\.|CentralReaderQuestions\.)/i;
 const sectionTitles=/^(?:\d+[\s.\-–:]*)?(?:quest[õo]es?\s+(?:internas?|comentadas?|de\s+fixa[çc][ãa]o|de\s+revis[ãa]o|de\s+prova|para\s+praticar|para\s+resolver)|bateria de quest[õo]es)\b/i;
 const word=s=>String(s||'').normalize('NFD').replace(/[̀-ͯ]/g,'').toLowerCase().replace(/\s+/g,' ').trim();
 const dentroDaNova=el=>!!el.closest?.(NOVA_AREA);
 function isQuestionAction(el){
  if(!el||el.nodeType!==1||dentroDaNova(el))return false;
  const label=String(el.getAttribute('aria-label')||el.textContent||'').replace(/\s+/g,' ').trim().slice(0,135);
  const action=el.getAttribute('onclick')||'';
  return actions.test(label)||handlers.test(action)||
   /^(?:quiz|questions|exam|errors|cumulative-review|active)$/.test(el.dataset.ptCfQuiz||'')||
   /^(?:quiz|exam|errors)$/.test(el.dataset.rlmKind||'');
 }
 function kill(el){if(el?.isConnected&&!dentroDaNova(el))el.remove()}
 function removeSections(scope){
  const roots=scope.querySelectorAll?.('.bc-native-article,.pt-doc,.cf-native-reader article,.cv-reader-article,.adm-native-article,.cpp-native-article,.bc-rlm-article')||[];
  roots.forEach(root=>{
   root.querySelectorAll('p,li,h3,h4').forEach(el=>{
    if(!el.isConnected||el.closest('blockquote,.cf-native-table,table'))return;
    const t=word(el.textContent).slice(0,160);
    if(/^(?:questao\s*(?:no?\.?\s*)?\d+\s*[:.)-]|gabarito(?:\s+comentado)?\s*[:.]|alternativas?\s*[:.]|resposta correta\s*:)/.test(t)){
     if(!el.querySelector('table,img,video'))kill(el);
    }
   });
   root.querySelectorAll('section,article,details').forEach(el=>{
    if(!el.isConnected)return;
    const h=el.querySelector(':scope > h2,:scope > h3,:scope > h4,:scope > summary');
    if(h&&sectionTitles.test(word(h.textContent))&&!/(?:leitura|teoria|revisao da teoria)/.test(word(el.className)))kill(el);
   });
  });
 }
 function sweep(){
  if(!document.body)return;
  document.querySelectorAll(selector).forEach(kill);
  document.querySelectorAll('button,a,[role="button"],[role="tab"]').forEach(el=>{if(isQuestionAction(el))kill(el)});
  document.querySelectorAll('.cf-module-stat,.cv-module-head small,.bc-rlm-stage-progress').forEach(el=>{
   if(!el.isConnected)return;
   if(/quest[õo]es?\s+(?:resumidas|completas)|5\s*\+\s*10\s+quest[õo]es/i.test(el.textContent))el.textContent=el.textContent.replace(/[•·]?\s*(?:\d+\s+quest[õo]es?\s+resumidas\s*[•·]\s*\d+\s+quest[õo]es?\s+completas|5\s*\+\s*10\s+quest[õo]es)/gi,'').trim();
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
