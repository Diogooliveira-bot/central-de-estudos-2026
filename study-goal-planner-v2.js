(function () {
'use strict';
// Planejamento pessoal da Agenda: preserva o contrato de tarefas central-v6:agenda:AAAA-MM-DD.
const PREFIX='central-v6:agenda:';
const GOAL_KEY='central-v6:study-goal:v2';
const SOURCE='study-goal-v2';
const LEGACY='study-cycle-v1';
const WEEK=[['1','Segunda'],['2','Terça'],['3','Quarta'],['4','Quinta'],['5','Sexta'],['6','Sábado'],['0','Domingo']];
const LABELS={pt:'Português',cf:'Direito Constitucional',adm:'Direito Administrativo',civil:'Direito Civil',cpc:'Direito Processual Civil',penal:'Direito Penal',cpp:'Direito Processual Penal',rlm:'Raciocínio Lógico-Matemático'};
const ORDER=['cf','cpc','adm','penal','civil','cpp','pt','rlm','cf','adm','cpc','civil','penal','cpp'];
const el=id=>document.getElementById(id);
const esc=s=>String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function iso(d){return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0')}
function dateOf(s){if(!/^\d{4}-\d{2}-\d{2}$/.test(String(s||'')))return null;const [y,m,d]=s.split('-').map(Number);const x=new Date(y,m-1,d,12);return iso(x)===s?x:null}
function plusMonths(date,n){const first=new Date(date.getFullYear(),date.getMonth()+n,1,12);const last=new Date(first.getFullYear(),first.getMonth()+1,0,12).getDate();first.setDate(Math.min(date.getDate(),last));return first}
function readableMinutes(minutes){const h=Math.floor(minutes/60),m=minutes%60;return h+(m?('h'+String(m).padStart(2,'0')):'h')}
function defaultGoal(){const h={};WEEK.forEach(([day])=>{h[day]=Number(day)>=1&&Number(day)<=5?120:0});return {version:2,start:iso(new Date()),months:6,hours:h,subjects:Object.keys(LABELS)}}
function loadGoal(){try{const v=JSON.parse(localStorage.getItem(GOAL_KEY)||'null');if(v&&v.version===2&&dateOf(v.start)&&Number.isInteger(v.months)&&v.months>=1&&v.months<=24&&v.hours&&typeof v.hours==='object'&&Array.isArray(v.subjects))return v}catch(_){}return null}
function saveGoal(goal){localStorage.setItem(GOAL_KEY,JSON.stringify(goal))}
function existingTasks(date){try{const v=JSON.parse(localStorage.getItem(PREFIX+date)||'[]');return Array.isArray(v)?v:[]}catch(_){return []}}
function keys(){const result=[];try{for(let i=0;i<localStorage.length;i++){const k=localStorage.key(i);if(k&&k.startsWith(PREFIX)&&dateOf(k.slice(PREFIX.length)))result.push(k.slice(PREFIX.length))}}catch(_){}return result}
function isAuto(task){return task&&(task.source===SOURCE||task.source===LEGACY)}
function status(message,kind){const node=el('agendaStandaloneStatus');if(node){node.textContent=message;node.className='agenda-standalone-status '+(kind||'')}}
function available(){const select=el('agendaDisc'),ids=select?[...select.options].map(x=>x.value).filter(x=>LABELS[x]):Object.keys(LABELS);return [...new Set(ids.length?ids:Object.keys(LABELS))]}
function goalFromForm(){
 const start=el('studyGoalStart')?.value,months=Number(el('studyGoalMonths')?.value);
 const hours={};WEEK.forEach(([day])=>{const active=el('studyDay'+day)?.checked;const raw=Number(el('studyHours'+day)?.value);hours[day]=active?Math.round(raw*60):0});
 const subjects=[...document.querySelectorAll('input[name="studySubjects"]:checked')].map(x=>x.value);
 if(!dateOf(start)||start<iso(new Date()))throw Error('Escolha uma data de início válida, a partir de hoje.');
 if(!Number.isInteger(months)||months<1||months>24)throw Error('Escolha um prazo de 1 a 24 meses.');
 if(!WEEK.some(([d])=>hours[d]>0))throw Error('Escolha pelo menos um dia de estudo.');
 if(WEEK.some(([d])=>hours[d]!==0&&(!Number.isInteger(hours[d])||hours[d]<30||hours[d]>720||hours[d]%15!==0)))throw Error('Escolha de 30 minutos a 12 horas por dia, em intervalos de 15 minutos.');
 if(!subjects.length)throw Error('Escolha pelo menos uma disciplina.');
 return {version:2,start,months,hours,subjects}
}
function dates(goal){
 const start=dateOf(goal.start),end=plusMonths(start,goal.months),out=[];
 for(let d=new Date(start);d<end;d.setDate(d.getDate()+1)){
  const mins=Number(goal.hours[String(d.getDay())])||0;
  if(mins>0)out.push({date:iso(d),minutes:mins,day:d.getDay()});
 }
 return out;
}
function sessions(goal){
 const pool=ORDER.filter(id=>goal.subjects.includes(id)&&available().includes(id));
 const unique=goal.subjects.filter(id=>available().includes(id));
 if(!pool.length||!unique.length)return [];
 let cursor=0,out=[];
 dates(goal).forEach(day=>{
  const quantity=day.minutes>=90&&unique.length>1?2:1;
  const chosen=[];
  while(chosen.length<quantity){
   let next=pool[cursor%pool.length];cursor++;
   if(chosen.includes(next)){next=unique.find(id=>!chosen.includes(id));if(!next)break}
   chosen.push(next);
  }
  const first=quantity===2?Math.floor(day.minutes/30)*15:day.minutes;
  chosen.forEach((id,index)=>{
   const minutes=chosen.length===1?day.minutes:(index===0?first:day.minutes-first);
   out.push({id:'goal-'+day.date+'-'+index+'-'+id,date:day.date,discipline:LABELS[id],disciplineId:id,time:'',task:readableMinutes(minutes)+' · teoria, revisão e questões',durationMinutes:minutes,done:false,source:SOURCE,autoCycle:true});
  });
 });
 return out;
}
function readControls(goal){
 el('studyGoalStart').value=goal.start<iso(new Date())?iso(new Date()):goal.start;
 el('studyGoalMonths').value=goal.months;
 WEEK.forEach(([day])=>{
  const n=Number(goal.hours[day]||0),checked=n>0;
  el('studyDay'+day).checked=checked;
  el('studyHours'+day).value=checked?n/60:2;
  el('studyHours'+day).disabled=!checked;
  el('studyWeekDay'+day).classList.toggle('is-on',checked);
 });
 document.querySelectorAll('input[name="studySubjects"]').forEach(n=>{n.checked=goal.subjects.includes(n.value)});
 refreshPreview();
}
function renderSummary(){
 const goal=loadGoal(),pane=el('studyGoalSummary');
 if(!pane)return;
 if(!goal){pane.innerHTML='<span class="study-unset">Nenhuma meta definida</span>';return}
 const studyDays=dates(goal),weekly=WEEK.reduce((total,[day])=>total+(Number(goal.hours[day])||0),0);
 let completed=0,total=0;
 keys().forEach(date=>{if(date>=goal.start&&date<iso(plusMonths(dateOf(goal.start),goal.months)))existingTasks(date).forEach(t=>{if(t&&t.source===SOURCE){total++;if(t.done)completed++}})});
 const pct=total?Math.round(completed/total*100):0;
 pane.innerHTML='<div class="study-numbers"><div><strong>'+readableMinutes(weekly)+'</strong><small>por semana</small></div><div><strong>'+WEEK.filter(([d])=>Number(goal.hours[d])>0).length+'</strong><small>dias/semana</small></div><div><strong>'+goal.months+'</strong><small>meses</small></div><div><strong>'+readableMinutes(studyDays.reduce((n,x)=>n+x.minutes,0))+'</strong><small>planejadas</small></div></div>'+
 '<div class="study-completion"><span>'+completed+' de '+total+' sessões concluídas</span><b>'+pct+'%</b></div><div class="study-progress"><span style="width:'+pct+'%"></span></div>';
}
function refreshPreview(){
 const host=el('studyGoalPreview');if(!host)return;
 try{
  const g=goalFromForm(),list=dates(g),preview=sessions(g);
  const mins=WEEK.reduce((n,[d])=>n+g.hours[d],0),days=WEEK.filter(([d])=>g.hours[d]>0).length;
  el('studyLiveTotal').textContent=readableMinutes(mins)+' por semana · '+days+' dias · '+readableMinutes(list.reduce((n,x)=>n+x.minutes,0))+' no período';
  const grouped={};preview.forEach(t=>{(grouped[t.date]||(grouped[t.date]=[])).push(t)});
  host.innerHTML='<div class="study-preview-head">Primeiros dias do plano</div>'+Object.keys(grouped).slice(0,5).map(date=>'<div class="study-preview-row"><b>'+new Intl.DateTimeFormat('pt-BR',{weekday:'short',day:'2-digit',month:'2-digit'}).format(dateOf(date))+'</b><span>'+esc(grouped[date].map(t=>t.discipline+' ('+readableMinutes(t.durationMinutes)+')').join(' · '))+'</span></div>').join('');
 }catch(err){el('studyLiveTotal').textContent=err.message;host.innerHTML=''}
}
function editGoal(open){
 el('studyGoalForm').hidden=!open;
 el('studyGoalEdit').textContent=open?'Fechar':'Editar meta';
 if(open)refreshPreview();
}
function generate(){
 let goal;
 try{goal=goalFromForm()}catch(err){status(err.message,'warning');return false}
 const list=sessions(goal);
 if(!list.length){status('Nenhuma disciplina disponível para o plano.','warning');return false}
 const today=iso(new Date()),oldDates=keys().filter(d=>d>=today&&existingTasks(d).some(t=>isAuto(t)&&!t.done));
 if(oldDates.length&&!window.confirm('Substituir as sessões automáticas ainda não concluídas? Suas tarefas manuais e sessões concluídas serão mantidas.'))return false;
 const grouped=new Map();list.forEach(t=>{if(!grouped.has(t.date))grouped.set(t.date,[]);grouped.get(t.date).push(t)});
 const allDates=[...new Set([...oldDates,...grouped.keys()])];
 const previous=new Map();let created=0,updated=[];
 try{
  allDates.forEach(date=>{
   const current=existingTasks(date);previous.set(date,localStorage.getItem(PREFIX+date));
   const kept=current.filter(t=>!(isAuto(t)&&!t.done));
   const next=grouped.get(date)||[];
   const append=next.filter(t=>!kept.some(k=>isAuto(k)&&k.done&&k.disciplineId===t.disciplineId));
   created+=append.length;
   localStorage.setItem(PREFIX+date,JSON.stringify(kept.concat(append)));updated.push(date);
  });
  saveGoal(goal);
 }catch(err){
  updated.forEach(date=>{try{const raw=previous.get(date);if(raw===null)localStorage.removeItem(PREFIX+date);else localStorage.setItem(PREFIX+date,raw)}catch(_){}});
  status('Não foi possível salvar o plano neste navegador.','error');return false;
 }
 if(el('agendaDate'))el('agendaDate').value=goal.start;
 renderSummary();refreshAgenda();editGoal(false);
 status('Plano criado: '+created+' sessões distribuídas em '+dates(goal).length+' dias.','success');
 return false;
}
function clearAuto(){
 const today=iso(new Date()),target=keys().filter(d=>d>=today&&existingTasks(d).some(t=>isAuto(t)&&!t.done));
 if(!target.length){status('Nenhuma sessão automática pendente.','warning');return false}
 if(!window.confirm('Excluir sessões automáticas pendentes? Tarefas manuais e sessões concluídas serão mantidas.'))return false;
 let count=0;
 try{target.forEach(date=>{const a=existingTasks(date),b=a.filter(t=>!(isAuto(t)&&!t.done));count+=a.length-b.length;localStorage.setItem(PREFIX+date,JSON.stringify(b))})}
 catch(_){status('Não foi possível remover todas as sessões.','error');return false}
 renderSummary();refreshAgenda();status(count+' sessões automáticas removidas.','success');return false;
}
function refreshAgenda(){try{window.CentralAgenda?.render?.();window.CentralAgenda?.renderHomeSummary?.()}catch(_){}}
function style(){
 if(el('studyGoalStyle'))return;
 const s=document.createElement('style');s.id='studyGoalStyle';
 s.textContent='.study-goal-card{border:1px solid #294365;border-radius:17px;padding:17px;margin:16px 0;background:linear-gradient(120deg,#111f35,#0b1728);color:#f1f5fb}.study-goal-head,.study-day-head,.study-agenda-head{display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap}.study-goal-head h2,.study-agenda-head h2{font-size:19px;margin:0}.study-goal-card button,.study-goal-card input{font:inherit}.study-numbers{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:9px;margin-top:15px}.study-numbers>div{padding:12px;border:1px solid #30415a;border-radius:12px;background:#0b192e}.study-numbers strong,.study-numbers small{display:block}.study-numbers strong{font-size:21px}.study-numbers small{font-size:11px;color:#a5b7ce}.study-unset{display:block;padding:18px 0;color:#a8b8cb}.study-completion{display:flex;justify-content:space-between;font-size:12px;color:#afc0d3;margin-top:13px}.study-progress{background:#29384a;height:7px;border-radius:8px;overflow:hidden;margin-top:6px}.study-progress span{display:block;height:100%;background:#53a9ec}.study-goal-form{margin-top:17px;border-top:1px solid #34435a;padding-top:16px}.study-fields{display:grid;grid-template-columns:1fr 1fr;gap:11px}.study-fields label{display:grid;gap:7px;font-weight:700;font-size:12px;color:#c5d4e5}.study-goal-form input[type=date],.study-goal-form input[type=number]{width:100%;min-width:0;border-radius:9px;border:1px solid #405777;background:#0b1728;color:#f4f6f9;padding:10px}.study-goal-form h3{font-size:13px;margin:17px 0 9px}.study-days{display:grid;grid-template-columns:repeat(7,minmax(0,1fr));gap:7px}.study-week-day{background:#0b192c;border:1px solid #334b65;border-radius:11px;padding:8px;min-width:0;display:grid;gap:8px}.study-week-day.is-on{border-color:#70a7d7;background:#152e4b}.study-week-day label{font-size:11px;font-weight:750;display:flex;align-items:center;gap:4px}.study-week-day input[type=number]{padding:8px 4px;text-align:center}.study-week-day input:disabled{opacity:.35}.study-subjects{display:flex;gap:7px;flex-wrap:wrap}.study-subjects label{display:flex;align-items:center;gap:7px;padding:8px 10px;border-radius:9px;border:1px solid #3b5370;background:#101e34;font-size:12px}.study-preview-head{font-weight:700;font-size:12px;margin:13px 0 5px}.study-preview-row{display:grid;grid-template-columns:82px minmax(0,1fr);gap:10px;border-bottom:1px solid #263b53;padding:8px 0;font-size:12px}.study-preview-row span{color:#c5d0de}.study-live-total{font-size:12px;color:#a9d5f2;margin-top:14px}.study-plan-actions{display:flex;gap:9px;justify-content:flex-end;flex-wrap:wrap;margin-top:15px}.study-agenda-head{margin-bottom:12px}.study-agenda-head .field{min-width:154px;margin:0}.study-manual{border-top:1px solid #2d405a;padding:12px 0;margin:10px 0}.study-manual summary{cursor:pointer;color:#c3dcf3;font-weight:750}.study-manual .form-grid{margin-top:12px}#agendaView .agenda-edit-row{grid-template-columns:60px minmax(0,1fr) auto 28px 30px;min-width:0}#agendaView .agenda-edit-row>span:nth-child(2){min-width:0;overflow-wrap:anywhere}@media(max-width:850px){.study-days{grid-template-columns:repeat(4,minmax(0,1fr))}.study-numbers{grid-template-columns:repeat(2,minmax(0,1fr))}}@media(max-width:480px){.study-goal-card{padding:13px}.study-days{grid-template-columns:repeat(2,minmax(0,1fr))}.study-fields{grid-template-columns:1fr}#agendaView .agenda-edit-row{display:flex;align-items:center;flex-wrap:wrap;gap:9px}#agendaView .agenda-edit-row>span:nth-child(2){flex:1 1 60%}}';
 document.head.appendChild(s);
}
function inject(){
 const view=el('agendaView'),existing=el('agendaEditor')?.closest('.card');
 if(!view||!existing||el('studyGoalCard'))return;
 style();
 const hero=view.querySelector('.hero p');if(hero)hero.textContent='Seu ritmo. Seu planejamento.';
 const card=document.createElement('section');card.className='study-goal-card';card.id='studyGoalCard';
 const days=WEEK.map(([day,name])=>'<div class="study-week-day" id="studyWeekDay'+day+'"><label><input type="checkbox" id="studyDay'+day+'"> '+name+'</label><input type="number" id="studyHours'+day+'" min="0.5" max="12" step="0.25" aria-label="Horas de '+name+'"><small>horas</small></div>').join('');
 const subjects=available().map(id=>'<label><input type="checkbox" name="studySubjects" value="'+id+'">'+esc(LABELS[id])+'</label>').join('');
 card.innerHTML='<div class="study-goal-head"><h2>Minha meta de estudo</h2><button class="btn" type="button" id="studyGoalEdit">Configurar meta</button></div><div id="studyGoalSummary" aria-live="polite"></div>'+
 '<div class="study-goal-form" id="studyGoalForm" hidden><div class="study-fields"><label>Começar em<input type="date" id="studyGoalStart"></label><label>Prazo (meses)<input type="number" id="studyGoalMonths" min="1" max="24" step="1"></label></div>'+
 '<h3>Dias e horas de estudo</h3><div class="study-days">'+days+'</div>'+
 '<h3>Disciplinas</h3><div class="study-subjects">'+subjects+'</div>'+
 '<div id="studyLiveTotal" class="study-live-total" aria-live="polite"></div><div id="studyGoalPreview"></div>'+
 '<div class="study-plan-actions"><button class="btn" type="button" id="studyGoalClear">Limpar sessões futuras</button><button class="btn primary" type="button" id="studyGoalCreate">Montar meu plano</button></div></div>';
 existing.parentElement.insertBefore(card,existing);
 const head=document.createElement('div');head.className='study-agenda-head';head.innerHTML='<h2>Tarefas do dia</h2>';
 const dateField=el('agendaDate')?.closest('.field');if(dateField)head.appendChild(dateField);
 existing.insertBefore(head,existing.firstChild);
 const details=document.createElement('details');details.className='study-manual';details.innerHTML='<summary>Adicionar tarefa avulsa</summary>';
 const grid=existing.querySelector('.form-grid'),row=existing.querySelector('.action-row'),message=el('agendaStandaloneStatus');
 if(grid)details.appendChild(grid);if(row)details.appendChild(row);
 existing.insertBefore(details,el('agendaEditor'));
 if(message)existing.insertBefore(message,el('agendaEditor'));
 const saved=loadGoal();readControls(saved||defaultGoal());renderSummary();
 editGoal(!saved);el('studyGoalEdit').textContent=saved?'Editar meta':'Configurar meta';
 el('studyGoalEdit').onclick=()=>editGoal(el('studyGoalForm').hidden);
 el('studyGoalCreate').onclick=generate;
 el('studyGoalClear').onclick=clearAuto;
 card.addEventListener('input',event=>{const t=event.target;if(t?.id?.startsWith('studyDay')){const d=t.id.slice(8);el('studyHours'+d).disabled=!t.checked;el('studyWeekDay'+d).classList.toggle('is-on',t.checked)}refreshPreview()});
 card.addEventListener('change',refreshPreview);
 document.addEventListener('change',event=>{if(event.target.closest('#homeAgenda,#agendaEditor'))setTimeout(renderSummary,0)});
 window.addEventListener('storage',event=>{if(event.key===GOAL_KEY||event.key?.startsWith(PREFIX))renderSummary()});
}
window.CentralStudyPlanner={generate,removeFuture:clearAuto,renderSummary,preview:sessions};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',inject,{once:true});else inject();
})();