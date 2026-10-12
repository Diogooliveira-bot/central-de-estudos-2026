/* Direito Civil: apresentação fiel para M01 M02 M05 M06 M07 M10 M12 M14.
   Apenas o DOM da leitura é alterado. Texto da fonte é preservado byte a byte
   em termos de caracteres textContent, inclusive espaços e pontuação. */
(function(g){
'use strict';
const MODULES=new Set([1,2,5,6,7,10,12,14]);
const CSS_ID='civil-eight-apostilas-v1-css';
function type(line){
 const s=line.trim();
 if(/^\d{1,2}\.\d{1,2}(?:\.\d{1,2})?\s+\S/.test(s))return 'subsection';
 if(/^(?:\d{1,2}\.\s+\S|CAP[IÍ]TULO\s+\S|PARTE\s+\S|SEÇÃO\s+\S)/i.test(s))return 'section';
 if(/^[•●▪◦]\s+/.test(s))return 'bullet';
 if(/^(?:ATENÇÃO|ATENCAO|CAI MUITO|PEGADINHA|NÃO CONFUNDIR|NAO CONFUNDIR|JURISPRUDÊNCIA|JURISPRUDENCIA|STJ|STF|REGRA DE BOLSO|MACETE|ALERTA)\b/i.test(s))return 'callout';
 if(/\S[ \t]{3,}\S/.test(line))return 'column';
 return 'paragraph';
}
function splitGroups(source){
 const lines=source.split('\n'),groups=[];
 lines.forEach((line,i)=>{
  const kind=type(line),p=groups[groups.length-1];
  if(p&&p.kind===kind&&kind!=='section'&&kind!=='subsection'&&(kind!=='paragraph'||line.trim()))p.end=i;
  else groups.push({kind,start:i,end:i});
 });
 return {lines,groups};
}
function format(pre){
 const original=pre.textContent;
 if(!original||!original.trim())return false;
 const {lines,groups}=splitGroups(original),result=document.createElement('div');
 result.className='cv-eight-flow';
 groups.forEach(part=>{
  const tag=part.kind==='section'?'h2':part.kind==='subsection'?'h3':'div';
  const element=document.createElement(tag);
  element.className='cv-eight-'+part.kind;
  element.textContent=lines.slice(part.start,part.end+1).join('\n');
  result.appendChild(element);
  if(part.end<lines.length-1)result.appendChild(document.createTextNode('\n'));
 });
 if(result.textContent!==original){console.error('[Civil] Conteúdo divergente; renderização cancelada');return false}
 pre.replaceWith(result);
 return true;
}
function installStyles(){
 if(document.getElementById(CSS_ID))return;
 const style=document.createElement('style');style.id=CSS_ID;
 style.textContent=[
 '.cv-eight-apostila .civil-source-content{max-width:860px;margin-inline:auto;min-width:0;overflow-wrap:anywhere;font-family:Inter,system-ui,-apple-system,"Segoe UI",sans-serif;line-height:1.78}',
 '.cv-eight-apostila .cv-eight-flow{min-width:0;max-width:100%}',
 '.cv-eight-apostila .cv-eight-section{font:750 1.35rem/1.4 Inter,system-ui,sans-serif;letter-spacing:-.015em;margin:2rem 0 .85rem;border-bottom:1px solid var(--line,#d8e0ed);padding-bottom:.6rem;white-space:normal;color:var(--text,#183153)}',
 '.cv-eight-apostila .cv-eight-subsection{font:700 1.13rem/1.45 Inter,system-ui,sans-serif;margin:1.35rem 0 .65rem;white-space:normal;color:var(--text,#183153)}',
 '.cv-eight-apostila .cv-eight-paragraph{white-space:pre-line;overflow-wrap:anywhere;line-height:1.84;margin:.65rem 0 1.04rem;font-family:inherit}',
 '.cv-eight-apostila .cv-eight-bullet{white-space:pre-line;line-height:1.75;background:rgba(90,125,185,.06);border-left:3px solid #8ca8cc;padding:.7rem .9rem;margin:.75rem 0;border-radius:0 .5rem .5rem 0}',
 '.cv-eight-apostila .cv-eight-callout{white-space:pre-line;overflow-wrap:anywhere;line-height:1.72;background:rgba(90,125,185,.07);border-left:4px solid #507dab;padding:1rem 1.15rem;margin:1rem 0;border-radius:0 .5rem .5rem 0}',
 '.cv-eight-apostila .cv-eight-column{white-space:pre-wrap;overflow-wrap:anywhere;word-break:normal;font-family:inherit;line-height:1.75;background:rgba(96,124,167,.055);border:1px solid var(--line,#d7dfed);padding:1rem;margin:1rem 0;border-radius:.7rem;max-width:100%;overflow-x:hidden}',
 '.cv-eight-apostila .civil-source-content pre{white-space:pre-wrap!important;overflow-wrap:anywhere!important;max-width:100%;overflow-x:hidden!important}',
 '@media(max-width:680px){.cv-eight-apostila .civil-source-content{font-size:.98rem}.cv-eight-apostila .cv-eight-section{font-size:1.2rem}.cv-eight-apostila .cv-eight-subsection{font-size:1.06rem}.cv-eight-apostila .cv-eight-column{padding:.8rem}}'
 ].join('\n');
 document.head.appendChild(style);
}
function enhance(body,n){
 if(!MODULES.has(Number(n)))return false;
 const article=body?.querySelector('.bc-native-article');
 if(!article)return false;
 const original=[...article.querySelectorAll('pre.civil-source-table')];
 if(!original.length)return false;
 installStyles();
 let converted=0;
 original.forEach(pre=>{if(format(pre))converted++});
 if(!converted)return false;
 article.classList.add('cv-eight-apostila');
 article.dataset.civilSourcePreserved='true';
 return true;
}
function apply(){
 const overlay=document.getElementById('civil-native-reader');
 const label=overlay?.querySelector('.bc-native-reader-title')?.textContent||'';
 const match=label.match(/M[ÓO]DULO\s*0?(\d{1,2})/i);
 if(!match)return;
 const n=Number(match[1]);
 if(!MODULES.has(n))return;
 const body=overlay.querySelector('.bc-native-scroll');
 if(!body?.querySelector('pre.civil-source-table'))return;
 if(enhance(body,n)){
  const toc=overlay.querySelector('.bc-native-toc');
  if(toc){
   toc.replaceChildren();
   [...body.querySelectorAll('h1,h2,h3')].forEach((heading,i)=>{
    if(!heading.id)heading.id='cv-eight-heading-'+n+'-'+i;
    const button=document.createElement('button');
    button.type='button';button.textContent=heading.textContent;
    button.addEventListener('click',()=>heading.scrollIntoView({behavior:'smooth',block:'start'}));
    toc.appendChild(button);
   });
  }
 }
}
let busy=false;
function scan(){if(busy)return;busy=true;try{apply()}finally{busy=false}}
function boot(){new MutationObserver(scan).observe(document.body,{childList:true,subtree:true});scan()}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});
else boot();
g.CivilEightApostilas={enhance,splitGroups,type};
})(window);
