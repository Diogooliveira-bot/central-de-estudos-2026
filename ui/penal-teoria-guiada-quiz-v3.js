
(function(){
'use strict';
const all=window.BC_PEN_GUIDED_MODULES||{};
const style=document.createElement('style');style.id='bc-pen-guided-quiz-style-v3';style.textContent=".off-quiz-button{background:#f8fbff;color:#204b7a;border:1px solid #c9dcec}\n.off-quiz-overlay{position:fixed;inset:0;z-index:2147483200;background:#101f3ebd;display:flex;justify-content:center;align-items:center;padding:12px}\n.off-quiz-panel{background:#f8fafc;color:#193457;border-radius:16px;max-width:760px;width:100%;max-height:min(94dvh,1000px);display:flex;flex-direction:column;box-shadow:0 24px 80px #0c1a36aa;overflow:hidden}\n.off-quiz-head{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:17px 22px;border-bottom:1px solid #dce5ee;background:white}\n.off-quiz-head h2{font-size:19px;line-height:1.3;letter-spacing:-.02em;margin:0;color:#173859}\n.off-quiz-close{border:1px solid #ccd9e6;background:white;border-radius:8px;padding:8px 12px;color:#153c62;font-size:14px}\n.off-quiz-body{padding:19px;overflow:auto;overscroll-behavior:contain}\n.off-quiz-note{padding:11px 14px;background:#eaf1f9;border:1px solid #cedcea;border-radius:9px;color:#45617f;font-size:12px;margin:0 0 14px}\n.off-q{background:white;padding:17px 17px 13px;border:1px solid #dce5ee;border-radius:12px;margin-bottom:12px}\n.off-q h3{margin:0 0 12px;font-size:15px;line-height:1.55}\n.off-choice{display:flex;align-items:flex-start;gap:10px;border:1px solid #e1e8ef;border-radius:8px;padding:10px;margin:7px 0;line-height:1.55;font-size:14px;cursor:pointer}\n.off-choice input{margin-top:3px;accent-color:#274d76}\n.off-choice.correct{background:#e8f6ef;border-color:#92c9a9}\n.off-choice.wrong{background:#ffefee;border-color:#daa6a2}\n.off-explanation{display:none;background:#eff5fb;border-radius:8px;color:#2c4766;padding:12px;font-size:13px;line-height:1.65;margin-top:12px}\n.off-explanation.visible{display:block}\n.off-submit{position:sticky;bottom:0;display:flex;justify-content:space-between;gap:12px;align-items:center;background:white;padding:13px 20px;border-top:1px solid #dce5ef}\n.off-submit button{border:0;background:#173d6a;color:white;font-weight:700;padding:11px 17px;border-radius:8px}\n.off-score{font-weight:700;color:#28517c;font-size:13px}\n.off-quiz-panel{max-height:100dvh;border-radius:10px}\n.off-quiz-body{padding:12px}\n.off-quiz-head{padding:14px}\n.off-quiz-head h2{font-size:16px}\n.off-quiz-overlay{padding:5px}\n.off-q{padding:13px}\n\n.off-submit{flex-wrap:wrap}\n.off-submit-actions{display:flex;gap:8px;flex-wrap:wrap;justify-content:flex-end}\n.off-submit [hidden]{display:none!important}\n.off-submit .off-secondary{background:#fff;color:#173d6a;border:1px solid #9db9d6}\n.off-review{display:block;margin:10px 0 0;padding:4px 0;border:0;background:none;color:#245586;font-weight:700;font-size:13px;text-align:left;text-decoration:underline;text-underline-offset:3px}";if(!document.getElementById(style.id))document.head.append(style);
const questions=window.BC_PEN_GUIDED_QUIZZES_V3||{};
function escapeHtml(v){return String(v==null?'':v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
function pad(n){return String(n).padStart(2,'0');}
function plural(k,one,many){return k+' '+(k===1?one:many);}
function openModule(n){window.BcPenalGuidedReader?.open(n);}
/* Embaralha as alternativas a cada tentativa: nas questões originais a resposta certa ficava na letra B em 43 de 85 casos. */
function mix(a){const b=a.slice();for(let i=b.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));const t=b[i];b[i]=b[j];b[j]=t;}return b;}
function deal(list){return list.map(q=>({q:q,order:mix(q.options.map((_,i)=>i))}));}
function topicLabel(n,i){const d=all[n],t=d&&d.topics[i];return t?pad(n)+'.'+pad(i+1)+' '+t[0]:'';}
function quizMarkup(n,items,again){
 const d=all[n]||{};
 const title='M'+pad(n)+' · '+plural(items.length,'questão','questões')+(again?' · só as que faltam':'');
 const note=again
  ?'Refazendo só as questões que você errou ou deixou em branco. As alternativas foram embaralhadas de novo.'
  :(d.pilot
    ?'Banco refeito no piloto: casos práticos com gabarito comentado. As alternativas são embaralhadas a cada tentativa. Este treino não altera o progresso oficial da Central.'
    :'Questões originais da Central, com as alternativas embaralhadas a cada tentativa. Este treino não altera o progresso oficial da Central.');
 const cards=items.map((it,i)=>'<article class="off-q" data-q="'+i+'"><h3>'+(i+1)+'. '+escapeHtml(it.q.q)+'</h3>'+it.order.map((j,pos)=>'<label class="off-choice"><input type="radio" name="q'+i+'" value="'+j+'"><span>'+String.fromCharCode(65+pos)+') '+escapeHtml(it.q.options[j])+'</span></label>').join('')+'<div class="off-explanation" data-explanation></div></article>').join('');
 return '<section class="off-quiz-panel" role="dialog" aria-modal="true" aria-labelledby="off-quiz-title"><div class="off-quiz-head"><h2 id="off-quiz-title">'+escapeHtml(title)+'</h2><button class="off-quiz-close" data-close>✕ Fechar</button></div><div class="off-quiz-body"><p class="off-quiz-note">'+escapeHtml(note)+'</p>'+cards+'</div><div class="off-submit"><span class="off-score" data-score>Responda e confira o gabarito.</span><span class="off-submit-actions"><button class="off-secondary" data-again hidden>Refazer só as erradas</button><button data-correct>Corrigir respostas</button></span></div></section>';
}
let oldFocus=null,priorOverflow='';
function closeQuiz(){const x=document.querySelector('.off-quiz-overlay');if(x)x.remove();document.body.style.overflow=priorOverflow;if(oldFocus&&oldFocus.isConnected)oldFocus.focus();}
function mount(wrap,n,items,again){
 wrap.innerHTML=quizMarkup(n,items,again);
 wrap._redo=[];
 wrap.querySelector('[data-close]').addEventListener('click',closeQuiz);
 wrap.querySelector('[data-correct]').addEventListener('click',()=>grade(wrap,n,items));
 wrap.querySelector('[data-again]').addEventListener('click',()=>{if(wrap._redo.length)mount(wrap,n,deal(wrap._redo.map(it=>it.q)),true);});
 wrap.querySelector('[data-close]').focus();
}
function openQuiz(n){
 n=Number(n);const list=questions[n];if(!list)return false;
 window.BcPenalGuidedReader?.close();closeQuiz();oldFocus=document.activeElement;priorOverflow=document.body.style.overflow;
 const wrap=document.createElement('div');wrap.className='off-quiz-overlay';
 document.body.appendChild(wrap);document.body.style.overflow='hidden';
 wrap.addEventListener('click',e=>{
  if(e.target===wrap){closeQuiz();return;}
  const r=e.target.closest('[data-review]');
  if(r){const i=Number(r.getAttribute('data-review'));closeQuiz();window.BcPenalGuidedReader?.open(n,i);}
 });
 mount(wrap,n,deal(list),false);
 return true;
}
function grade(wrap,n,items){
 let hits=0,answered=0;const redo=[];
 items.forEach((it,i)=>{
  const section=wrap.querySelector('[data-q="'+i+'"]');
  const checked=section.querySelector('input:checked');
  const right=it.q.answer;
  if(checked)answered++;
  const ok=!!checked&&Number(checked.value)===right;
  if(ok)hits++;else redo.push(it);
  section.querySelectorAll('.off-choice').forEach(el=>{
   const v=Number(el.querySelector('input').value);
   el.classList.toggle('correct',v===right);
   el.classList.toggle('wrong',!!checked&&Number(checked.value)===v&&v!==right);
  });
  const pos=it.order.indexOf(right);
  let html='<b>Gabarito: '+String.fromCharCode(65+pos)+'.</b> '+escapeHtml(it.q.explanation);
  if(Number.isInteger(it.q.topic)&&all[n]&&all[n].topics[it.q.topic])html+='<button type="button" class="off-review" data-review="'+it.q.topic+'">Rever o assunto '+escapeHtml(topicLabel(n,it.q.topic))+' ›</button>';
  const exp=section.querySelector('[data-explanation]');
  exp.innerHTML=html;exp.classList.add('visible');
 });
 wrap._redo=redo;
 const total=items.length;
 wrap.querySelector('[data-score]').textContent='Acertos: '+hits+'/'+total+(answered<total?' · '+(total-answered)+' sem resposta':'')+(hits===total?' · Tudo certo!':'');
 const again=wrap.querySelector('[data-again]');
 again.hidden=redo.length===0;again.textContent='Refazer só as erradas ('+redo.length+')';
 wrap.querySelector('[data-correct]').textContent='Rever respostas';
}
window.BcPenalGuidedQuizV3=Object.freeze({open:openQuiz,close:closeQuiz,questionCount:n=>(questions[n]||[]).length});
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeQuiz()});

})();