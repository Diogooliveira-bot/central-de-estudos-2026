/* Base Completa — Português M01–M24: bateria autoral a partir da leitura,
 * preservando todos os registros e evitando qualquer atribuição de banca.
 */
(function(g){
'use strict';
if(g.BcPortugueseAuthorial)return;
const idOK=id=>/^m(?:0[1-9]|1\d|2[0-4])$/.test(String(id||''));
async function open(id){
 if(!idOK(id))return false;
 const course=g.CentralPortugueseCourse,mod=course?.modules.find(m=>m.id===id);
 if(!mod)return false;
 try{
  const data=await course.load(),markup=data[id],questions=g.BcGroundedQuestions?.build({html:markup,discipline:'Português',module:id.toUpperCase(),title:mod.title})||[];
  if(questions.length!==10||!questions.every(g.CentralAuthorialQuiz?.valid||(()=>false))){
   alert('As dez questões autorais deste módulo ainda precisam ser conferidas.');return false;
  }
  return g.CentralAuthorialQuiz.open({discipline:'Português',module:id.toUpperCase(),title:mod.title,items:questions});
 }catch(e){console.warn('[Português questões autorais]',e);alert('Não foi possível carregar as questões neste momento.');return false}
}
function notice(id){
 if(!idOK(id))return false;
 const mod=g.CentralPortugueseCourse?.modules.find(m=>m.id===id);
 return g.CentralInternalQuestionPolicy?.modal('Português',mod?.title||id.toUpperCase());
}
function strip(root){
 if(!root)return 0;
 const doc=root.querySelector('.pt-doc')||root;
 let count=0;
 const section=/^(?:\d+\.\s*)?(?:pr[aá]tica (?:independente|guiada|de fixa[çc][aã]o)|mini[\s-]*teste(?: de dom[ií]nio)?|teste (?:final|de sa[ií]da)|gabarito(?: comentado| do| da)?|respostas? (?:comentadas|do teste|esperadas)|revis[aã]o ativa|quest[õo]es de fixa[çc][aã]o|segunda bateria|bloco extra)\b/i;
 // Section headings must be direct children of the lesson content.
 for(const h of [...doc.children].filter(n=>/^H[2-4]$/.test(n.tagName)&&section.test(n.textContent.trim()))){
  if(!h.isConnected)continue;
  let node=h;
  while(node){
   const next=node.nextElementSibling;
   if(node!==h&&node.tagName==='H2')break;
   node.remove();count++;node=next;
  }
 }
 // Some lessons wrap assessments; remove only clearly marked exercise elements.
 for(const node of doc.querySelectorAll('.pta-question,.pta-feedback,.pta-module-summary,.pt-native-practice-collection')){
  node.remove();count++;
 }
 return count;
}
g.BcPortugueseAuthorial=Object.freeze({open,notice,strip,idOK});
})(window);
