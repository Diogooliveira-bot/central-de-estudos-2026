/* Base Completa — Direito Penal M01–M17: conectar Teoria Guiada ao card nativo de revisão.
   Leitores completos, questões nativas, métricas e armazenamento oficial permanecem intactos. */
(function(global){
'use strict';
if(global.__BC_PENAL_GUIDED_BRIDGE_V1__)return;
global.__BC_PENAL_GUIDED_BRIDGE_V1__=true;
const ROOT='#subjects .subject[data-id="penal"]';
const nativeReaders={
  1:()=>global.BaseNativeReader,
  2:()=>global.BaseNativeReaderM02,
  3:()=>global.BaseNativeReaderM03,
  4:()=>global.BaseNativeReaderM04,
  5:()=>global.BaseNativeReaderM05,
  6:()=>global.BaseNativeReaderM06,
  7:()=>global.BaseNativeReaderM07,
  8:()=>global.BaseNativeReaderM08,
  9:()=>global.BaseNativeReaderM09,
  10:()=>global.BaseNativeReaderM10,
  11:()=>global.BaseNativeReaderM11,
  12:()=>global.BaseNativeReaderM12,
  13:()=>global.BaseNativeReaderM13,
  14:()=>global.BaseNativeReaderM14,
  15:()=>global.BaseNativeReaderM15,
  16:()=>global.BaseNativeReaderM16,
  17:()=>global.BaseNativeReaderM17
};
function moduleNumber(el){
 const m=el?.closest(ROOT+' .cf-module[data-cf]')?.getAttribute('data-cf')?.match(/^p([1-9]|1[0-7])$/);
 return m?Number(m[1]):null;
}
function paint(){
 document.querySelectorAll(ROOT+' .cf-module[data-cf] [data-native-kind="summary"]').forEach(card=>{
  const n=moduleNumber(card);
  if(!n)return;
  const title=card.querySelector('strong');
  if(title&&title.textContent!=='Teoria guiada')title.textContent='Teoria guiada';
  const desc=card.querySelector('small');
  const copy='Explicações, exemplos, aprofundamento, pegadinhas e revisão rápida.';
  if(desc&&desc.textContent!==copy)desc.textContent=copy;
  const icon=card.querySelector('.bc-native-material-icon');
  if(icon&&icon.textContent!=='▤')icon.textContent='▤';
 });
}
function click(event){
 const card=event.target?.closest?.('[data-native-kind="summary"]');
 const n=moduleNumber(card);
 if(!n)return;
 if(!global.BcPenalGuidedReader?.open(n))return;
 event.preventDefault();
 event.stopImmediatePropagation();
}
function openQuestions(n){
 const reader=nativeReaders[Number(n)]?.();
 if(!reader?.open)return false;
 reader.open('summary'); // O bloco de questões permanece dentro do leitor oficial, com gabarito e progresso originais.
 global.requestAnimationFrame(()=>{
  const section=document.querySelector('.bc-native-reader-overlay .bc-native-internal-review');
  if(section)section.scrollIntoView({block:'start',behavior:'instant'});
 });
 return true;
}
function init(){
 paint();
 document.addEventListener('click',click,true);
 const host=document.getElementById('subjects');
 if(host){
  const observer=new MutationObserver(()=>{clearTimeout(init.timer);init.timer=setTimeout(paint,60);});
  observer.observe(host,{childList:true,subtree:true});
 }
}
global.BcPenalGuidedBridge=Object.freeze({openQuestions,refresh:paint});
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})(window);
