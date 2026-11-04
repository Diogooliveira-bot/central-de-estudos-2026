/* Infográficos e mapas mentais em revisão: ficam ocultos para alunos até a
   edição correta. Administradores e editores continuam vendo para revisar.
   Para liberar de novo, basta retirar este arquivo da lista de scripts da Central.
   É uma ocultação de interface, não um controle de acesso às imagens. */
(function(g){
'use strict';
const user=g.BASE_COMPLETA_USER||{};
const role=String(g.__BASE_COMPLETA_USER_ROLE__||user.role||'aluno');
if(g.__BASE_COMPLETA_PREVIEW_GUEST__!==true&&(role==='admin'||role==='editor'))return;

// Cartões de imagem de cada disciplina (Português, CF, Penal, CPC, CPP, Civil, ADM).
const CARDS=['.pt-cf-card-map','.cf-study-map','[data-native-kind="mindmap"]','[data-cpc-approved-card="map"]',
 '.adm-native-visual','[data-kind="infographic"]','.cv-card-infographic','.adm-cf-card-map','.bc-infographic-hidden'];
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
