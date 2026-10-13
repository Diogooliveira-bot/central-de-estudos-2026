/* Base Completa — atividades interativas do Português Autodidata M01.
   Melhoria exclusiva de apresentação: preserva integralmente o texto e o gabarito. */
(function(global){
'use strict';
if(global.BasePtM01Activities)return;
const PREFIX='central-v6:pt:auto24:m01:activities:';
const css=`
.pta-reveal{margin:.75em 0 1.2em;padding:.65em .9em;border:1px solid #52676b;border-radius:10px;background:rgba(63,170,165,.08);font-family:system-ui,sans-serif;font-size:.67em}
.pta-reveal>summary{cursor:pointer;color:#69d4c8;font-weight:700;list-style:none;min-height:38px;display:flex;align-items:center}
.pta-reveal>summary::-webkit-details-marker{display:none}
.pta-reveal>summary:after{content:"⌄";margin-left:auto}
.pta-reveal[open]>summary:after{content:"⌃"}
.pta-reveal-answer{padding-top:.4em;border-top:1px solid rgba(170,190,190,.2)}
.pta-writing{margin:.7em 0 1.3em;font-family:system-ui,sans-serif;font-size:.65em}
.pta-writing label{display:block;font-weight:650;margin-bottom:.4em}
.pta-writing textarea{display:block;width:100%;min-height:110px;resize:vertical;box-sizing:border-box;border:1px solid #647177;border-radius:10px;padding:12px;background:rgba(120,130,135,.09);color:inherit;font:inherit;line-height:1.5}
.pta-writing small{display:block;margin-top:.35em;opacity:.72}
.pta-choice{cursor:pointer;border:1px solid #647177;border-radius:10px;padding:.65em .8em;margin:.4em 0;transition:background .15s,border-color .15s}
.pta-choice:focus-visible{outline:3px solid #42bdb8;outline-offset:3px}
.pta-choice[aria-pressed="true"]{background:rgba(48,177,174,.18);border-color:#40bdb9;box-shadow:inset 4px 0 0 #40bdb9}
.pta-choice[aria-pressed="true"]:before{content:"✓  ";color:#54cfca;font-weight:bold}
.pta-choice-note{font-family:system-ui,sans-serif;font-size:.57em;opacity:.7;margin:.3em 0 1em}
`;
function read(k){try{return localStorage.getItem(PREFIX+k)||''}catch(_){return ''}}
function write(k,v){try{localStorage.setItem(PREFIX+k,v)}catch(_){}}
function hash(v){let n=2166136261;for(const ch of v){n^=ch.charCodeAt(0);n=Math.imul(n,16777619)}return(n>>>0).toString(36)}
function clean(v){return(v||'').replace(/\s+/g,' ').trim()}
function addStyle(){if(document.getElementById('pta-m01-style'))return;let s=document.createElement('style');s.id='pta-m01-style';s.textContent=css;document.head.appendChild(s)}
function enhance(article){
 if(!article||article.dataset.ptaM01Enhanced==='1')return;
 article.dataset.ptaM01Enhanced='1';addStyle();
 const headings=[...article.querySelectorAll('h2,h3,h4')];
 const guided=headings.find(h=>/prática guiada/i.test(clean(h.textContent)));
 const independent=headings.find(h=>/prática independente/i.test(clean(h.textContent)));
 if(guided){
  const all=[...article.querySelectorAll('h2,h3,h4,p,blockquote,div')];
  const guideQuestions=headings.filter(h=>/^questão guiada\s*\d+/i.test(clean(h.textContent))&&!!(guided.compareDocumentPosition(h)&Node.DOCUMENT_POSITION_FOLLOWING)&&(!independent||!!(h.compareDocumentPosition(independent)&Node.DOCUMENT_POSITION_FOLLOWING)));
  guideQuestions.forEach((h)=>{
   const candidates=[];let node=h.nextElementSibling;
   while(node&&!/^H[234]$/.test(node.tagName)){
    if(/^(?:passo\s*\d+\s*:|conclusão\s*:)/i.test(clean(node.textContent)))candidates.push(node);
    node=node.nextElementSibling;
   }
   if(!candidates.length)return;
   const details=document.createElement('details');details.className='pta-reveal';
   const sum=document.createElement('summary');sum.textContent='Mostrar raciocínio e resposta';details.appendChild(sum);
   const answer=document.createElement('div');answer.className='pta-reveal-answer';details.appendChild(answer);
   candidates[0].before(details);candidates.forEach(p=>answer.appendChild(p));
  });
 }
 if(!independent)return;
 // A seção de gabarito permanece intacta. Intervenções somente antes dela.
 const following=headings.filter(h=>!!(independent.compareDocumentPosition(h)&Node.DOCUMENT_POSITION_FOLLOWING));
 const answerHeading=following.find(h=>/^(?:\d+\.\s*)?(?:gabarito|respostas? comentadas?|correção)/i.test(clean(h.textContent)));
 const elements=[...article.querySelectorAll('p,li')].filter(el=>{
  const pos=independent.compareDocumentPosition(el);
  return !!(pos&Node.DOCUMENT_POSITION_FOLLOWING)&&(!answerHeading||!!(el.compareDocumentPosition(answerHeading)&Node.DOCUMENT_POSITION_FOLLOWING));
 });
 const questions=elements.filter(el=>/^\d{1,3}\.\s+\S/.test(clean(el.textContent))&&
   !el.closest('.pta-reveal,.pta-writing')&&!(el.tagName==='LI'&&el.parentElement?.closest('li')));
 questions.forEach((q)=>{
  const title=clean(q.textContent);const key=hash(title);
  const candidates=[];let node=q.nextElementSibling;
  while(node&&candidates.length<5){
   const tx=clean(node.textContent);
   if(/^[A-E][).]\s+\S/i.test(tx)){candidates.push(node);node=node.nextElementSibling;continue}
   break;
  }
  if(candidates.length>=2){
   candidates.forEach((el)=>{
    const letter=clean(el.textContent).match(/^([A-E])[).]/i)?.[1]?.toUpperCase();
    if(!letter)return;
    el.classList.add('pta-choice');el.setAttribute('role','button');el.tabIndex=0;
    const choose=()=>{
      candidates.forEach(p=>p.setAttribute('aria-pressed',p===el?'true':'false'));
      write('choice:'+key,letter);
    };
    el.setAttribute('aria-pressed',read('choice:'+key)===letter?'true':'false');
    el.addEventListener('click',choose);
    el.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();choose()}});
   });
   const note=document.createElement('p');note.className='pta-choice-note';note.textContent='Toque em uma alternativa para registrar sua escolha. Confira o gabarito ao final do módulo.';
   candidates[candidates.length-1].after(note);
  }else{
   const box=document.createElement('div');box.className='pta-writing';
   const label=document.createElement('label');const id='pta-answer-'+key;label.htmlFor=id;label.textContent='Sua resposta / anotação';
   const textarea=document.createElement('textarea');textarea.id=id;textarea.placeholder='Escreva seu raciocínio aqui…';textarea.value=read('text:'+key);
   textarea.addEventListener('input',()=>write('text:'+key,textarea.value));
   const hint=document.createElement('small');hint.textContent='Salvo automaticamente neste navegador.';
   box.append(label,textarea,hint);q.after(box);
  }
 });
}
global.BasePtM01Activities={enhance};
})(window);
