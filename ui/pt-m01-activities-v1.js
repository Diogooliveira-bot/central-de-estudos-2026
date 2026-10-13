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
 const tidy=el=>clean(el?.innerText||el?.textContent||'');
 const heading=el=>/^(H[1-6])$/.test(el.tagName);
 const blocks=[...article.querySelectorAll('h2,h3,h4,h5,p,li,blockquote')].filter(el=>!el.parentElement?.closest('p,li,blockquote'));
 const guidedStart=blocks.find(el=>/^(?:16\.\s*)?prática guiada$/i.test(tidy(el)));
 const independentStart=blocks.find(el=>/^(?:17\.\s*)?prática independente$/i.test(tidy(el)));
 const after=(a,b)=>!!(a.compareDocumentPosition(b)&Node.DOCUMENT_POSITION_FOLLOWING);
 const inRange=(el,start,end)=>!!start&&after(start,el)&&(!end||after(el,end));
 // Respostas guiadas são passos e conclusões; manter o enunciado visível.
 if(guidedStart){
  const qs=blocks.filter(el=>inRange(el,guidedStart,independentStart)&&/^questão guiada\s*\d+/i.test(tidy(el)));
  qs.forEach((q,i)=>{
   const next=qs[i+1]||independentStart;
   const segment=blocks.filter(el=>inRange(el,q,next));
   const responses=segment.filter(el=>/^(?:passo\s*\d+\s*:|conclusão\s*:)/i.test(tidy(el)));
   if(!responses.length)return;
   const first=responses[0];
   const details=document.createElement('details');details.className='pta-reveal';
   const summary=document.createElement('summary');summary.textContent='Mostrar raciocínio e resposta';
   const answer=document.createElement('div');answer.className='pta-reveal-answer';
   details.append(summary,answer);first.before(details);responses.forEach(el=>answer.append(el));
  });
 }
 if(!independentStart)return;
 const later=blocks.filter(el=>after(independentStart,el));
 const answerHeading=later.find(el=>/^(?:\d+\.\s*)?(?:gabarito|respostas? comentadas?|correção)(?:\s|$)/i.test(tidy(el)));
 const until=answerHeading||null;
 const work=blocks.filter(el=>inRange(el,independentStart,until));
 const questions=work.filter(el=>/^\d{1,3}\.\s+\S/.test(tidy(el))&&(!el.closest('ol')||el.tagName==='LI'));
 questions.forEach((q,i)=>{
   const key=hash(tidy(q));const next=questions[i+1]||until;
   const siblings=work.filter(el=>inRange(el,q,next)&&!el.closest('.pta-writing,.pta-reveal'));
   const choices=[];
   for(const el of siblings){
     if(/^[A-E][).]\s*\S/i.test(tidy(el)))choices.push(el);
   }
   // Alguns exercícios usam alternativas separadas apenas por <br>.
   for(const el of siblings){
     if(choices.length>=2)break;
     if(!el.querySelector('br'))continue;
     const parts=el.innerHTML.split(/<br\s*\/?\s*>/i);
     if(parts.filter(s=>/^(?:\s|<[^>]*>)*[A-E][).]/i.test(s)).length<2)continue;
     const fragment=document.createDocumentFragment();
     parts.forEach(part=>{if(!part.trim())return;const p=document.createElement('p');p.innerHTML=part;fragment.append(p);if(/^[A-E][).]/i.test(tidy(p)))choices.push(p)});
     el.replaceWith(fragment);
   }
   if(choices.length>=2){
     choices.forEach(el=>{
       const letter=tidy(el).match(/^([A-E])[).]/i)?.[1]?.toUpperCase();if(!letter)return;
       el.classList.add('pta-choice');el.setAttribute('role','button');el.tabIndex=0;
       const choose=()=>{choices.forEach(p=>p.setAttribute('aria-pressed',p===el?'true':'false'));write('choice:'+key,letter)};
       el.setAttribute('aria-pressed',read('choice:'+key)===letter?'true':'false');
       el.addEventListener('click',choose);
       el.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();choose()}});
     });
     const note=document.createElement('p');note.className='pta-choice-note';note.textContent='Marque a alternativa e confira o gabarito no final.';
     choices[choices.length-1].after(note);return;
   }
   // Sem opções identificáveis: somente perguntas de resposta livre recebem campo.
   const field=document.createElement('div');field.className='pta-writing';
   const label=document.createElement('label'),textarea=document.createElement('textarea'),tip=document.createElement('small');
   textarea.id='pta-answer-'+key;label.htmlFor=textarea.id;label.textContent='Sua resposta / anotação';
   textarea.placeholder='Escreva seu raciocínio aqui…';textarea.value=read('text:'+key);
   textarea.addEventListener('input',()=>write('text:'+key,textarea.value));
   tip.textContent='Salvo automaticamente neste navegador.';field.append(label,textarea,tip);
   q.after(field);
 });
}

global.BasePtM01Activities={enhance};
})(window);
