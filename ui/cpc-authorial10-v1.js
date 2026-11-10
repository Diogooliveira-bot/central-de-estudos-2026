/* Base Completa | CPC: 10 questões autorais de revisão textual / 10 de banca futura.
 * A fonte CPC-FIXATION-QUESTIONS contém questões FCC reais e NÃO é usada aqui.
 */
(function(g){
'use strict';
if(g.BcCpcInternal)return;
const pending={};
function numm(n){const x=Number(String(n).replace(/[^\d]/g,''));return Number.isInteger(x)&&x>=1&&x<=20?x:null}
async function getModule(n){
 const id='m'+String(n).padStart(2,'0');
 const cached=g.BASE_NATIVE_CONTENT?.cpc?.[id];if(cached)return cached;
 if(!pending[id])pending[id]=new Promise((resolve,reject)=>{
  const s=document.createElement('script');s.src='/content/cpc/'+id+'-native-data.js?v=20261110questionmode1';
  s.onload=()=>{s.remove();const data=g.BASE_NATIVE_CONTENT?.cpc?.[id];data?resolve(data):reject(new Error('Dados do CPC ausentes'))};
  s.onerror=()=>{s.remove();reject(new Error('Falha ao carregar o módulo de CPC'))};
  document.head.appendChild(s);
 }).catch(e=>{delete pending[id];throw e});
 return pending[id];
}
async function open(number,kind='summary'){
 const n=numm(number);if(!n)return false;
 const id='M'+String(n).padStart(2,'0');
 if(kind==='complete'||kind==='full'||kind==='fixation')return g.CentralInternalQuestionPolicy?.modal('Direito Processual Civil',id);
 try{
  const d=await getModule(n);
  const result=g.BcGroundedQuestions?.build({html:d.summaryHtml||'',text:d.summary||'',discipline:'Direito Processual Civil',module:id,title:d.title})||[];
  if(result.length!==10||!result.every(g.CentralAuthorialQuiz?.valid||(()=>false))){
   alert('As dez questões autorais deste módulo ainda precisam ser revisadas e completadas.');return false;
  }
  return g.CentralAuthorialQuiz.open({discipline:'Direito Processual Civil',module:id,title:d.title,items:result});
 }catch(e){console.warn('[CPC questões autorais]',e);alert('Não foi possível abrir as questões autorais neste momento.');return false}
}
g.BcCpcInternal=Object.freeze({open,getModule});
})(window);
