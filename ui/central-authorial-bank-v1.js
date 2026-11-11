/* Base Completa · Banco de questões de IA (10 por módulo, plano gratuito).
 * Cada módulo fica em um arquivo próprio e só é baixado quando o aluno abre
 * o questionário, para não pesar a abertura da Central.
 * As questões são autorais (feitas por IA e revisadas): nunca são apresentadas
 * como questões de banca.
 */
(function(g){
'use strict';
if(g.CentralAuthorialBank)return;
// Atualize VERSION sempre que um arquivo de questões mudar (renova o cache do aparelho).
const VERSION='20261111ia4';
// Módulos que já têm arquivo de questões. O teste unitário confere esta lista com a pasta.
const AVAILABLE={
 adm:[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19],
 cpc:[1,2,3,4,5,6,7,17],
 pt:[17,21],
 penal:[],
 cpp:[],
 cf:[],
 civil:[],
 rlm:[]
};
const SOURCES={
 adm:{dir:'/content/adm/',get:n=>g.BC_ADM_AUTHORIAL_OVERRIDES?.[n]},
 cpc:{dir:'/content/cpc/',get:n=>g.BC_CPC_AUTHORIAL_OVERRIDES?.[n]},
 pt:{dir:'/content/portugues/',get:n=>g.BC_PT_AUTHORIAL_OVERRIDES?.[n]},
 penal:{dir:'/content/penal/',get:n=>g.BC_PENAL_AUTHORIAL_OVERRIDES?.[n]},
 cpp:{dir:'/content/cpp/',get:n=>g.BC_CPP_AUTHORIAL_OVERRIDES?.[n]},
 cf:{dir:'/content/cf/',get:n=>g.BC_CF_AUTHORIAL_OVERRIDES?.[n]},
 civil:{dir:'/content/civil/',get:n=>g.BC_CIVIL_AUTHORIAL_OVERRIDES?.[n]},
 rlm:{dir:'/content/rlm-tjce-2026/',get:n=>g.BC_RLM_AUTHORIAL_OVERRIDES?.[n]}
};
const pending={};
function file(discipline,n){return SOURCES[discipline].dir+'m'+String(n).padStart(2,'0')+'-authorial10-v1.js?v='+VERSION}
function has(discipline,n){return !!AVAILABLE[discipline]?.includes(Number(n))}
// Resolve com as 10 questões do módulo, ou null se o módulo ainda não tem arquivo
// ou se o download falhar (quem chama usa o comportamento anterior).
function ensure(discipline,number){
 const src=SOURCES[discipline],n=Number(number);
 if(!src||!Number.isInteger(n))return Promise.resolve(null);
 const ready=src.get(n);
 if(Array.isArray(ready))return Promise.resolve(ready);
 if(!has(discipline,n)||typeof document==='undefined')return Promise.resolve(null);
 const key=discipline+':'+n;
 if(!pending[key])pending[key]=new Promise(resolve=>{
  const s=document.createElement('script');
  let done=false;
  const finish=()=>{if(done)return;done=true;clearTimeout(timer);s.remove();const items=src.get(n);if(!Array.isArray(items))delete pending[key];resolve(Array.isArray(items)?items:null)};
  const timer=setTimeout(finish,15000);
  s.src=file(discipline,n);s.async=true;s.onload=finish;s.onerror=finish;
  document.head.appendChild(s);
 });
 return pending[key];
}
g.CentralAuthorialBank=Object.freeze({ensure,has,file,version:VERSION,available:AVAILABLE});
})(window);
