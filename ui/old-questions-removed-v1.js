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
 // Questões embutidas na teoria (completa e revisão): o banco externo tem isolamento próprio.
 const theoryRoots='.bc-native-article,.pt-doc,.cf-native-reader article,.cv-reader-article,.adm-native-article,.cpp-native-article,.bc-rlm-article,.bc-info-reader-article,.bc-info-reader-content,.gmf-reader-prose,.pt-native-reader article';
 const practiceTitle=/^(?:\d{1,2}[.):-]?\s*){0,2}(?:questoes(?:\s+(?:internas?(?:\s+de\s+fixacao)?|de\s+(?:fixacao|revisao|compreensao|prova|concursos?)|comentadas?|autorais?|para\s+(?:praticar|resolver)))?(?:\s*[-–—:(]\s*.*)?|questao\s+\d+\b.*|exercicios?\s+(?:de\s+)?(?:fixacao|revisao|compreensao)\b.*|testes?\s+de\s+compreensao\b.*|perguntas?\s+de\s+revisao\b.*|bateria\s+de\s+questoes\b.*)$/i;
 const standaloneQuestion=/^(?:questao|pergunta|item)\s*(?:n[ºo.]?\s*)?\d{1,3}\s*[:.)–—-]/i;
 const answerOrAlternative=/^(?:[a-e]\s*[).:-]|gabarito(?:\s+(?:oficial|comentado))?\s*[:–-]|resposta(?:\s+(?:correta|comentada))?\s*[:–-]|comentario(?:\s+da\s+questao)?\s*[:–-])/i;

 // Referências são conteúdo editorial: deslocar os mesmos nós, na mesma ordem,
 // para o rodapé da seção/capítulo que os contém, sem recriar ou alterar o texto.
 const referenceTitle=/^(?:\d{1,2}\s*[.)–-]?\s*)?(?:referencias(?:\s+(?:bibliograficas|e fontes(?: de consulta)?|utilizadas))?|bibliografia(?:\s+consultada)?|fontes\s+(?:consultadas|de consulta|bibliograficas|oficiais))(?:\s*[:.])?$/i;
 const trailingUi='footer,[role="contentinfo"],.bc-info-reader-end,.gmf-reader-done,.bc-native-reader-end,.bc-native-completion,.adm-session-reader-check,.adm-reading-check-list';
 function moveReferencesToEnd(root){
  const titles=[...root.querySelectorAll('h2,h3,h4,h5,p')].filter(el=>{
   if(!el.isConnected||dentroDaNova(el)||el.closest('blockquote,table,.bc-native-toc,[contenteditable]'))return false;
   if(el.tagName==='P'&&(el.textContent.length>95||el.querySelector('a,table,img')))return false;
   return referenceTitle.test(word(el.textContent));
  });
  titles.forEach(title=>{
   if(!title.isConnected)return;
   const parent=title.parentElement;
   if(!parent||!root.contains(parent))return;
   const level=/^H[2-5]$/.test(title.tagName)?Number(title.tagName[1]):2;
   const group=[title];
   let next=title.nextElementSibling;
   while(next){
    if(/^H[1-6]$/.test(next.tagName)&&(title.tagName==='P'||Number(next.tagName[1])<=level))break;
    if(next.matches('.synthesis,.overview,[data-adm-session],.bc-info-reader-chapter,.gmf-reader-chapter'))break;
    if(next.matches(trailingUi)||dentroDaNova(next))break;
    group.push(next);next=next.nextElementSibling;
   }
   let anchor=null,tail=parent.lastElementChild;
   while(tail&&tail.matches(trailingUi)){anchor=tail;tail=tail.previousElementSibling}
   const last=group[group.length-1];
   if((anchor&&last.nextElementSibling===anchor)||(!anchor&&!last.nextElementSibling))return;
   group.forEach(node=>parent.insertBefore(node,anchor));
  });
 }
 function removeQuestionsFromTheory(root){
  if(!root.isConnected||dentroDaNova(root))return;
  // Os blocos de testes de compreensão de CF e os exercícios em <details> não são teoria.
  root.querySelectorAll('details.question,section.question,.bc-iq,.bc-iq-answer,.cpc-native-question').forEach(kill);
  // "Pegadinha", "Erro comum" e "Não confundir" são explicações, não questões.
  root.querySelectorAll('.cf-native-callout.question,.cf-native-callout.answer').forEach(el=>{
   const label=word(el.querySelector('strong')?.textContent||el.textContent);
   if(/^(?:teste de compreensao|resposta comentada)\b/.test(label))kill(el);
  });
  // Se o bloco inteiro é uma seção de questões, retirá-lo antes dos títulos evita caixas vazias.
  root.querySelectorAll('section,article,details').forEach(el=>{
   if(!el.isConnected||dentroDaNova(el))return;
   const heading=el.querySelector(':scope > h2,:scope > h3,:scope > h4,:scope > summary');
   if(heading&&practiceTitle.test(word(heading.textContent)))kill(el);
  });
  // Remover a seção inteira evita deixar alternativas/gabaritos soltos no texto.
  root.querySelectorAll('h2,h3,h4,h5').forEach(h=>{
   if(!h.isConnected||dentroDaNova(h)||!practiceTitle.test(word(h.textContent)))return;
   const level=Number(h.tagName.slice(1));let next=h.nextElementSibling;
   while(next){
    if(/^H[1-6]$/.test(next.tagName)&&Number(next.tagName.slice(1))<=level)break;
    // O bloco de síntese e os checklists de leitura pertencem à teoria, não ao quiz.
    if(next.matches('footer,[role="contentinfo"],.synthesis,.overview,.adm-session-reader-check,[data-adm-session],.adm-reading-check-list'))break;
    const after=next.nextElementSibling;kill(next);next=after;
   }
   kill(h);
  });

  // Algumas apostilas aprovadas possuem baterias certo/errado como títulos
  // enumerados, sem a palavra "Questão" (ADM M02/M04/M05). Preservar
  // definições e listas da teoria; só retirar grupos de 3+ itens resolvidos.
  const answeredStatement=/^\d{1,2}\.\s*[“"'(]?.{12,}?\b(?:certo|errado)\b(?:[.!;,)\s–—-]|$)/i;
  const groups=new Map();
  root.querySelectorAll('h3,h4,p').forEach(el=>{
   if(!el.isConnected||dentroDaNova(el)||el.closest('blockquote,table'))return;
   const t=word(el.textContent).slice(0,550);
   if(!answeredStatement.test(t))return;
   const group=groups.get(el.parentElement)||[];
   group.push(el);groups.set(el.parentElement,group);
  });
  groups.forEach(nodes=>{
   let run=[];
   const flush=()=>{if(run.length>=3)run.forEach(kill);run=[]};
   nodes.forEach(el=>{if(run.length&&el.previousElementSibling!==run[run.length-1])flush();run.push(el)});
   flush();
  });
  root.querySelectorAll('p').forEach(el=>{
   if(!el.isConnected||dentroDaNova(el))return;
   if(/^etapa\s+\d+\s*[·.:\-–—]\s*fixacao do conteudo (?:completo|resumido)$/.test(word(el.textContent)))kill(el);
  });
  // Algumas apostilas têm questões isoladas sem título de seção.
  root.querySelectorAll('p,li').forEach(el=>{
   if(!el.isConnected||dentroDaNova(el)||el.closest('blockquote,table,.cf-native-table'))return;
   const t=word(el.textContent).slice(0,180);
   if(!standaloneQuestion.test(t))return;
   // Quando enunciado, alternativas e gabarito são parágrafos soltos, retirar
   // a bateria inteira SOMENTE se houver um gabarito/resposta identificável.
   const trail=[];let next=el.nextElementSibling,hasAnswer=false;
   while(next&&trail.length<14&&/^(?:P|UL|OL|LI)$/.test(next.tagName)&&!dentroDaNova(next)){
    const t=word(next.textContent).slice(0,220);
    if(standaloneQuestion.test(t)||referenceTitle.test(t))break;
    trail.push(next);
    if(/^(?:gabarito(?:\s+(?:oficial|comentado))?|resposta(?:\s+(?:correta|comentada))?)\s*[:–-]/.test(t)){
     hasAnswer=true;
     const explanation=next.nextElementSibling;
     if(explanation?.tagName==='P'&&/^(?:explicacao|justificativa|comentario)\s*[:–-]/.test(word(explanation.textContent)))
      trail.push(explanation);
     break;
    }
    next=next.nextElementSibling;
   }
   if(hasAnswer)trail.forEach(kill);
   else{
    next=el.nextElementSibling;
    while(next&&/^(?:P|UL|OL|LI)$/.test(next.tagName)&&
       ((next.tagName==='UL'||next.tagName==='OL')||answerOrAlternative.test(word(next.textContent).slice(0,160)))){
     const after=next.nextElementSibling;kill(next);next=after;
    }
   }
   kill(el);
  });
 }
 function removeSections(scope){
  const roots=scope.querySelectorAll?.(theoryRoots)||[];
  roots.forEach(root=>{
   removeQuestionsFromTheory(root);
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
   moveReferencesToEnd(root);
  });
 }
 function removeAdmM1CompleteImages(){
  const overlay=document.getElementById('adm-native-reader');
  if(!overlay)return;
  const label=overlay.querySelector('.bc-native-reader-title small')?.textContent||'';
  // Restringe ao M01 completo: revisão guiada e outros módulos seguem inalterados.
  if(!/M[ÓO]DULO\s*0?1\b/i.test(label)||!/\bCOMPLETO\b/i.test(label))return;
  overlay.querySelectorAll('.bc-native-article figure,.bc-native-article picture,.bc-native-article img,.bc-native-article svg,.bc-native-article canvas').forEach(kill);
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
  removeAdmM1CompleteImages();
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
