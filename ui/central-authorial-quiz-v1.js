/* Base Completa — 10 questões autorais em ambiente independente da leitura.
 * A origem dos itens deve ser declarada: nesta primeira migração, são reutilizadas
 * questões autorais existentes e conferidas, NÃO questões reais de bancas.
 */
(function(g){
'use strict';
if(g.CentralAuthorialQuiz)return;
const OVER='bc-authorial-quiz',PREFIX='central-v6:authorial-ten:';
const esc=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const letters='ABCDE';
let session=null,lastFocus=null;
function storage(key){try{const x=JSON.parse(localStorage.getItem(key)||'{}');return x&&typeof x==='object'&&!Array.isArray(x)?x:{}}catch(_){return {}}}
function save(key,value){try{localStorage.setItem(key,JSON.stringify(value));return true}catch(_){return false}}
function valid(q){return !!(q&&typeof q.q==='string'&&q.q.trim()&&typeof q.explanation==='string'&&q.explanation.trim()&&(q.type==='open'?typeof q.answerText==='string'&&q.answerText.trim():Array.isArray(q.options)&&q.options.length>=2&&q.options.length<=5&&q.options.every(x=>typeof x==='string'&&x.trim())&&Number.isInteger(q.answer)&&q.answer>=0&&q.answer<q.options.length))}
function lesson(d){
 const pool=g.CentralInternalQuestionPolicy?.authorial(d?.summary||[],d?.complete||[])||[];
 return pool.length===10&&pool.every(valid)?pool:null;
}
function recordId(q,i){
 const id=String(q.id||q.n||i+1);
 return (q._bcSource||'item')+':'+id+':'+i;
}
function counts(items,answers){let answered=0,correct=0;items.forEach((q,i)=>{const c=answers[recordId(q,i)];if(q.type==='open'){if(c==='revealed')answered++}else if(Number.isInteger(c)&&c>=0&&c<q.options.length){answered++;if(c===q.answer)correct++}});return {answered,correct};}
function close(){document.getElementById(OVER)?.remove();document.body.classList.remove('bc-authorial-open');if(lastFocus?.isConnected)lastFocus.focus();session=null;}
function renderCard(q,i){
 const key=recordId(q,i),chosen=session.answers[key],answered=q.type==='open'?chosen==='revealed':Number.isInteger(chosen)&&chosen>=0&&chosen<q.options.length;
 if(q.type==='open')return '<section class="bc-authorial-question" data-authorial-index="'+i+'"><p class="bc-authorial-meta">QUESTÃO '+String(i+1).padStart(2,'0')+' DE 10 · AUTORAL</p><h3>'+esc(q.q)+'</h3>'+
 (answered?'<div class="bc-authorial-feedback" role="status"><b>Resposta explicada</b><p>'+esc(q.answerText)+'</p><p>'+esc(q.explanation)+'</p><button class="bc-authorial-retry" type="button" data-retry>Refazer esta questão</button></div>':'<button class="bc-authorial-retry" type="button" data-reveal>Mostrar resposta comentada</button>')+'</section>';
 return '<section class="bc-authorial-question" data-authorial-index="'+i+'"><p class="bc-authorial-meta">QUESTÃO '+String(i+1).padStart(2,'0')+' DE 10 · AUTORAL</p>'+
 '<h3>'+esc(q.q)+'</h3><div class="bc-authorial-options">'+q.options.map((option,j)=>{
  const status=answered?(j===q.answer?' correct':j===chosen?' wrong':''):(j===chosen?' selected':'');
  return '<button type="button" class="bc-authorial-option'+status+'" data-answer="'+j+'" '+(answered?'disabled':'')+
  ' aria-pressed="'+(j===chosen)+'"><b>'+letters[j]+'</b><span>'+esc(option)+'</span></button>';
 }).join('')+'</div>'+
 (answered?'<div class="bc-authorial-feedback" role="status"><b>'+(chosen===q.answer?'✓ Resposta correta':'✕ Resposta incorreta · gabarito '+letters[q.answer])+'</b><p>'+esc(q.explanation)+'</p><button class="bc-authorial-retry" type="button" data-retry>Refazer esta questão</button></div>':'')+'</section>';
}
function updateScores(){
 if(!session)return;
 const n=counts(session.items,session.answers),node=document.querySelector('#'+OVER+' [data-quiz-stats]');
 if(node)node.textContent=n.answered+'/10 concluídas · '+n.correct+' acertos em itens objetivos';
 const bar=document.querySelector('#'+OVER+' [data-quiz-progress]');
 if(bar)bar.style.width=n.answered*10+'%';
}
function bindCard(node,index){
 if(!node||!session)return;
 node.querySelector('[data-reveal]')?.addEventListener('click',()=>{
  if(!session)return;
  const q=session.items[index];session.answers[recordId(q,index)]='revealed';save(session.key,session.answers);
  node.outerHTML=renderCard(q,index);bindCard(document.querySelector('#'+OVER+' [data-authorial-index="'+index+'"]'),index);updateScores();
 });
 node.querySelectorAll('[data-answer]').forEach(btn=>btn.addEventListener('click',()=>{
  if(!session)return;
  const q=session.items[index],choice=Number(btn.dataset.answer),key=recordId(q,index);
  if(Number.isInteger(session.answers[key])||!Number.isInteger(choice)||choice<0||choice>=q.options.length)return;
  session.answers[key]=choice;save(session.key,session.answers);
  node.outerHTML=renderCard(q,index);
  bindCard(document.querySelector('#'+OVER+' [data-authorial-index="'+index+'"]'),index);
  updateScores();
 }));
 node.querySelector('[data-retry]')?.addEventListener('click',()=>{
  if(!session)return;
  const q=session.items[index];delete session.answers[recordId(q,index)];
  save(session.key,session.answers);node.outerHTML=renderCard(q,index);
  bindCard(document.querySelector('#'+OVER+' [data-authorial-index="'+index+'"]'),index);
  updateScores();
 });
}
function open({discipline,module,title,items}){
 close();
 if(!Array.isArray(items)||items.length!==10||!items.every(valid)){
  g.alert?.('Ainda não há uma bateria de 10 questões autorais revisadas neste módulo.');
  return false;
 }
 const id=String(discipline||'geral')+':'+String(module||'m01');
 const key=PREFIX+id;
 lastFocus=document.activeElement;session={key,id,items,answers:storage(key)};
 const overlay=document.createElement('div');overlay.id=OVER;overlay.className='bc-authorial-overlay';
 overlay.innerHTML='<div role="dialog" aria-modal="true" aria-label="10 questões autorais" class="bc-authorial-dialog">'+
  '<header><div><b>'+esc(title||'Questões autorais')+'</b><small>'+esc(discipline)+' · versão resumida</small></div><button type="button" data-authorial-close aria-label="Fechar">×</button></header>'+
  '<div class="bc-authorial-content"><div class="bc-authorial-intro"><h2>10 questões autorais</h2><p>Pratique os conceitos do módulo. Questões objetivas têm correção imediata; nas discursivas, revele a resposta comentada.</p>'+
  '<strong data-quiz-stats></strong><div class="bc-authorial-track"><span data-quiz-progress></span></div></div>'+
  items.map(renderCard).join('')+'<footer><button type="button" data-authorial-close>Voltar ao módulo</button></footer></div></div>';
 overlay.addEventListener('mousedown',e=>{if(e.target===overlay)close()});
 overlay.querySelectorAll('[data-authorial-close]').forEach(b=>b.addEventListener('click',close));
 document.body.appendChild(overlay);document.body.classList.add('bc-authorial-open');
 overlay.querySelectorAll('[data-authorial-index]').forEach(el=>bindCard(el,Number(el.dataset.authorialIndex)));
 updateScores();overlay.querySelector('[data-authorial-close]')?.focus();
 return false;
}
async function openPenal(number){
 const n=Number(number),code=String(n).padStart(2,'0');if(!Number.isInteger(n)||n<1||n>17)return false;
 let d=g.BASE_NATIVE_CONTENT?.penal?.['m'+code];
 if(!d){
  try{await new Promise((res,rej)=>{const s=document.createElement('script');s.src='/content/penal/m'+code+'-native-data.js';s.onload=res;s.onerror=rej;document.head.appendChild(s)})}
  catch(_){g.alert?.('Não foi possível carregar as questões. Tente novamente.');return false;}
  d=g.BASE_NATIVE_CONTENT?.penal?.['m'+code];
 }
 if(!d)return false;
 const list=lesson(d.internalQuestions);
 if(!list){g.alert?.('Esta bateria ainda não tem dez questões autorais validadas.');return false;}
 return open({discipline:'Direito Penal',module:'M'+code,title:'M'+code+' · '+d.title,items:list});
}
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&session)close()});
g.CentralAuthorialQuiz=Object.freeze({open,openPenal,close,lesson,valid,counts});
})(window);
