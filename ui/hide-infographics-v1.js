/* Infográficos independentes removidos da interface das disciplinas, em todos
   os perfis. Arquivos históricos ficam preservados e não são apagados.
   Não afeta imagens didáticas dentro das apostilas nem questões e progresso. */
(function(g){
'use strict';
// Mesmo padrão visual para aluno, administrador, editor e visitante da prévia.

// Cartões de imagem de cada disciplina (Português, CF, Penal, CPC, CPP, Civil, ADM).
const CARDS=['.pt-cf-card-map','.cf-study-map','[data-native-kind="mindmap"]','[data-cpc-approved-card="map"]',
 '.adm-native-visual','[data-kind="infographic"]','.cv-card-infographic','.adm-cf-card-map',
 '.bc-rlm-study-map','.cpc-approved-map','.bc-mindmap-entry','.bc-infographic-hidden'];
const LABEL=/^(?:Visualizar (?:infográfico|mapa mental)|Abrir infográfico de revisão)$/i;
const SELECTOR=CARDS.join(',');

document.documentElement.classList.add('bc-infographics-hidden');
const style=document.createElement('style');
style.textContent='html.bc-infographics-hidden :is('+SELECTOR+'){display:none!important}';
(document.head||document.documentElement).appendChild(style);

// Cartões com outro formato: identifica pelo rótulo do botão.
function mark(root){
 root.querySelectorAll?.('button,[role="button"],a').forEach(el=>{
  if(!LABEL.test(el.textContent.replace(/\s+/g,' ').trim())&&!LABEL.test(el.getAttribute('aria-label')||''))return;
  const card=el.closest('article')||el;
  if(!card.classList.contains('bc-infographic-hidden'))card.classList.add('bc-infographic-hidden');
 });
}
// Segurança extra: um clique que ainda chegue a um desses cartões não abre a imagem.
document.addEventListener('click',event=>{
 if(!event.target.closest?.(SELECTOR))return;
 event.preventDefault();event.stopImmediatePropagation();
},true);

function start(){
 mark(document);
 let queued=false;
 new MutationObserver(()=>{if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;mark(document)})})
  .observe(document.body,{childList:true,subtree:true});
}
if(document.body)start();else document.addEventListener('DOMContentLoaded',start,{once:true});
g.BCInfographicsHidden=true;
})(window);
