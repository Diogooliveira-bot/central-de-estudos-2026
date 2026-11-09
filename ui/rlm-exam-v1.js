/* Base Completa | RLM etapa 3: simulado modo prova e caderno de erros.
 * Usa as questões autorais existentes, sem regravar gabaritos ou respostas de treino.
 * Os registros ficam no dispositivo, separados dos dados do simulado antigo.
 */
(function(g){
'use strict';
if(g.RlmExam)return;
const KEY='central-v6:rlm-tjce2026:exam:v1';
const OLD='central-v6:rlm-tjce2026:answers:';
const ESC=v=>String(v==null?'':v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const letters=['A','B','C','D','E'];
function read(key){try{const x=JSON.parse(localStorage.getItem(key)||'{}');return x&&typeof x==='object'&&!Array.isArray(x)?x:{}}catch(_){return {}}}
function data(){
 const d=read(KEY);
 return {draft:d.draft&&typeof d.draft==='object'&&!Array.isArray(d.draft)?d.draft:{},
  last:d.last&&typeof d.last==='object'?d.last:null,
  attempts:Array.isArray(d.attempts)?d.attempts.slice(-10):[]};
}
function save(value){try{localStorage.setItem(KEY,JSON.stringify(value));return true}catch(_){return false}}
function spec(){return g.RlmNative?.reviewSpec||[]}
function question(id,index){return g.RLM_CURSO_AULAS?.[id]?.questions?.[index]||null}
function itemKey(id,index){return id+'-'+index}
function validChoice(choice){return Number.isInteger(choice)&&choice>=0&&choice<5}
function counts(answers){
 let correct=0,answered=0;for(const [id,index] of spec()){
  const q=question(id,index),v=answers[itemKey(id,index)];
  if(q&&validChoice(v)){answered++;if(v===q.answer)correct++}
 }
 return {correct,answered,total:spec().length,pct:spec().length?Math.round(100*correct/spec().length):0};
}
function summary(){
 const d=data();return d.last?{...counts(d.last.answers||{}),submitted:true,attempts:d.attempts.length}:
 {...counts(d.draft),submitted:false,attempts:d.attempts.length};
}
function select(position,choice){
 if(!validChoice(choice)||!Number.isInteger(position)||position<0||position>=spec().length)return;
 const d=data();if(d.last)return;
 const [id,index]=spec()[position];if(!question(id,index))return;
 d.draft[itemKey(id,index)]=choice;if(save(d))g.RlmNative?.refreshBody?.();
}
function submit(){
 const d=data();if(d.last)return;
 const score=counts(d.draft);if(!score.answered)return;
 if(score.answered<score.total&&typeof g.confirm==='function'&&!g.confirm('Existem questões em branco. Elas contam como incorretas. Entregar assim mesmo?'))return;
 const last={answers:{...d.draft},correct:score.correct,answered:score.answered,total:score.total,endedAt:new Date().toISOString()};
 d.last=last;d.attempts=[...d.attempts,{correct:last.correct,answered:last.answered,total:last.total,endedAt:last.endedAt}].slice(-10);d.draft={};
 if(save(d))g.RlmNative?.refreshBody?.();
}
function retry(){
 const d=data();if(!d.last)return;
 d.last=null;d.draft={};if(save(d))g.RlmNative?.refreshBody?.();
}
function renderExam(){
 const d=data(),finished=!!d.last,score=summary(),selected=finished?d.last.answers||{}:d.draft;
 const heading='<span class="bc-rlm-kicker">Base Completa · Simulado cumulativo</span><h2>Simulado — modo prova</h2>'+
  '<p class="bc-rlm-article-lead">20 questões autorais, cobrindo Lógica, Matemática e Estatística. O gabarito e os comentários são exibidos somente após a entrega.</p>';
 const top=finished?
  '<section class="bc-rlm-exam-score" role="status"><h3>Resultado: '+score.correct+'/'+score.total+' acertos · '+score.pct+'%</h3><p>'+score.answered+' questões respondidas. Confira o comentário de cada questão e abra seu caderno de erros.</p>'+
  '<div class="bc-rlm-exam-actions"><button type="button" class="bc-rlm-btn" onclick="RlmNative.open(\'RF\',\'errors\')">Revisar meus erros</button>'+
  '<button type="button" class="bc-rlm-btn" onclick="RlmExam.retry()">Fazer novo simulado</button></div></section>':
  '<section class="bc-rlm-exam-status" role="status"><strong>'+score.answered+'/'+score.total+' respondidas</strong>'+
  '<p>Respostas salvas neste dispositivo. Você pode sair e continuar depois. Questões em branco contam como incorretas na entrega.</p></section>';
 const questions=spec().map(([id,index],position)=>{
  const q=question(id,index);if(!q)return '';
  const key=itemKey(id,index),chosen=selected[key],has=validChoice(chosen),correct=finished&&chosen===q.answer;
  return '<section class="bc-rlm-quiz bc-rlm-exam-question" id="bcRlmExamQ-'+position+'">'+
   '<div class="bc-rlm-quiz-meta">Questão '+String(position+1).padStart(2,'0')+' · '+ESC(id)+' · '+ESC(q.level)+' · Autoral</div>'+
   '<h3>'+ESC(q.prompt)+'</h3><div class="bc-rlm-options">'+q.options.map((label,choice)=>{
    const state=finished?(choice===q.answer?' right':choice===chosen?' wrong':''):(choice===chosen?' selected':'');
    return '<button type="button" class="bc-rlm-option'+state+'" aria-pressed="'+(choice===chosen)+'" '+
     (finished?'disabled ':'')+'onclick="RlmExam.select('+position+','+choice+')"><b>'+letters[choice]+'</b><span>'+ESC(label)+'</span></button>';
   }).join('')+'</div>'+
   (finished?'<div class="bc-rlm-feedback'+(correct?'':' wrong')+'" role="status"><b>'+
    (correct?'✓ Resposta correta':'✕ '+(!has?'Em branco':'Resposta incorreta'))+
    ' · Gabarito: '+letters[q.answer]+'</b><p>'+ESC(q.explanation)+'</p></div>':'')+
   '</section>';
 }).join('');
 const footer=finished?
  (d.attempts.length>1?'<p class="bc-rlm-exam-history">Tentativas registradas neste dispositivo: '+d.attempts.length+'. Última: '+score.pct+'%.</p>':''):
  '<div class="bc-rlm-exam-actions"><button type="button" class="bc-rlm-btn primary"'+(score.answered?'':' disabled')+
  ' onclick="RlmExam.submit()">Entregar e corrigir simulado</button></div>';
 return heading+top+questions+footer;
}
function mistakes(){
 const result=new Map(),add=(id,index,choice,source)=>{
  const q=question(id,index);if(!q||!validChoice(choice)||choice===q.answer)return;
  const k=itemKey(id,index),prior=result.get(k);
  if(!prior)result.set(k,{id,index,q,choice,sources:[source]});
  else if(!prior.sources.includes(source))prior.sources.push(source);
 };
 for(const id of Object.keys(g.RLM_CURSO_AULAS||{})){
  const saved=read(OLD+id),q=g.RLM_CURSO_AULAS[id].questions||[];
  q.forEach((_,index)=>add(id,index,saved[String(index)],'Questões do módulo'));
 }
 const practice=read(OLD+'RF');for(const [id,index] of spec())add(id,index,practice['R'+id+'-'+index],'Revisão final');
 const last=data().last;
 if(last)for(const [id,index] of spec())add(id,index,last.answers?.[itemKey(id,index)],'Simulado');
 return [...result.values()].sort((a,b)=>Number(a.id.slice(1))-Number(b.id.slice(1))||a.index-b.index);
}
function renderErrors(){
 const items=mistakes();
 const start='<span class="bc-rlm-kicker">Base Completa · Revisão dirigida</span><h2>Revisar meus erros</h2>'+
  '<p class="bc-rlm-article-lead">Questões respondidas incorretamente na prática ou no simulado, agrupadas por módulo. Os registros existentes não são apagados.</p>';
 if(!items.length)return start+'<p class="bc-rlm-empty-errors">Nenhuma questão errada registrada neste dispositivo. Resolva exercícios para criar seu caderno de revisão.</p>';
 return start+'<p class="bc-rlm-errors-count">'+items.length+' questão(ões) para revisar</p>'+
 items.map(({id,index,q,choice,sources})=>'<section class="bc-rlm-error-item">'+
  '<h3>'+ESC(id)+' · Questão '+(index+1)+'</h3><p>'+ESC(q.prompt)+'</p>'+
  '<p><strong>Sua resposta:</strong> '+letters[choice]+' — '+ESC(q.options[choice])+'</p>'+
  '<p><strong>Resposta correta:</strong> '+letters[q.answer]+' — '+ESC(q.options[q.answer])+'</p>'+
  '<p class="bc-rlm-error-explanation">'+ESC(q.explanation)+'</p>'+
  '<small>Origem: '+ESC(sources.join(', '))+'</small>'+
  '<div class="bc-rlm-module-next"><button class="bc-rlm-btn" type="button" onclick="RlmNative.open(\''+id+'\',\'quiz\')">Abrir módulo '+id+'</button></div></section>').join('');
}
g.RlmExam=Object.freeze({renderExam,renderErrors,select,submit,retry,summary,mistakes});
})(window);
