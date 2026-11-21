/* Base Completa — visual das apostilas: agrupa visualmente os blocos que começam por um rótulo
 * (TEORIA, DECORE, EXEMPLO, COMPARAÇÃO, CASO PRÁTICO, PEGADINHAS, STF/STJ…) marcando-os com classes.
 * Não move, não cria e não apaga elementos: só adiciona classes de aparência. */
(function(g){
'use strict';
if(g.__bcApostilaSkin)return;g.__bcApostilaSkin=true;
const ROOTS='.bc-native-reader-body,.cpc-apostila,.cf-apostila,.bc-bens-flow,.bc-m01-paper,.bc-apostila-teoria,.bc-native-article';
const LABEL=/^[^A-Za-zÀ-ÿ]*(TEORIA|DECORE|EXEMPLOS?|COMPARA[ÇC][ÃA]O|QUADRO(?:\s+(?:OBRIGAT[ÓO]RIO|CENTRAL))?|CASO PR[ÁA]TICO|PEGADINHAS?(?:\s+DE\s+PROVA)?|STF\/STJ|JURISPRUD[ÊE]NCIA)\b/i;
const kindOf=t=>/ATEN[ÇC][ÃA]O|N[ÃA]O CONFUNDA|CUIDADO|ERRO|ARMADILHA/i.test(t)?'peg':/PEGADINHA/i.test(t)?'peg':/STF|STJ|JURISPRUD/i.test(t)?'jur':/DECORE/i.test(t)?'decore':/EXEMPLO/i.test(t)?'exemplo':/CASO/i.test(t)?'caso':/COMPARA|QUADRO/i.test(t)?'comp':'teoria';
const isHead=e=>/^H[1-4]$/.test(e.tagName);
function isLabel(e){
 if(!/^(P|H3|H4|DIV)$/.test(e.tagName))return false;
 if(e.children.length>3)return false;
 const t=(e.textContent||'').replace(/\s+/g,' ').trim();
 const m=LABEL.exec(t);
 if(t.length>0&&t.length<90&&!!m&&m[1]===m[1].toUpperCase())return true;
 // Título em caixa-alta, curto e sem numeração (ex.: CONCEITO-CHAVE, DOUTRINA — AUTOR): vira quadro de destaque.
 return /^(H3|H4)$/.test(e.tagName)&&t.length>=4&&t.length<60&&!/^\d/.test(t)&&t===t.toUpperCase()&&/[A-ZÀ-Ý]{4}/.test(t);
}
const stops=e=>isHead(e)||e.tagName==='HR'||e.tagName==='SECTION'||e.matches('details,.bc-native-toc,.penv-hero,.bc-native-study-progress,button,nav');
function mark(root){
 if(root.__skDone===root.childElementCount+':'+root.textContent.length)return;
 root.querySelectorAll('.sk-in').forEach(e=>{e.classList.remove('sk-in','sk-first','sk-last','sk-label','sk-teoria','sk-decore','sk-exemplo','sk-caso','sk-comp','sk-peg','sk-jur')});
 const labels=[...root.querySelectorAll('p,h3,h4,div')].filter(isLabel);
 for(const l of labels){
  if(l.classList.contains('sk-in'))continue;
  const k=kindOf(l.textContent);const group=[l];let n=l.nextElementSibling;
  while(n&&!isLabel(n)&&!(stops(n)&&!(k==='comp'&&n.matches('.bc-table-scroll')))){
   if(n.matches('details,[class*="law"]'))break;group.push(n);n=n.nextElementSibling}
  group.forEach((e,i)=>{e.classList.add('sk-in','sk-'+k);if(i===0)e.classList.add('sk-label','sk-first');if(i===group.length-1)e.classList.add('sk-last')});
 }
 root.__skDone=root.childElementCount+':'+root.textContent.length;
}
let timer=0;
function run(){timer=0;document.querySelectorAll(ROOTS).forEach(r=>{try{mark(r)}catch(e){}})}
function schedule(){if(!timer)timer=setTimeout(run,200)}
new MutationObserver(schedule).observe(document.documentElement,{childList:true,subtree:true});
schedule();
})(window);
