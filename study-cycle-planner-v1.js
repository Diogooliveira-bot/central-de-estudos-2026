(function(){
'use strict';

const PREFIX='central-v6:agenda:';
const CURSOR_KEY='central-v6:study-cycle:cursor';
const SOURCE='study-cycle-v1';
const DEFAULT_SUBJECTS=['cf','adm','cpc','civil','penal','cpp','pt','rlm','trab','ptra'];
const LABELS={
  pt:'Português',
  cf:'Direito Constitucional',
  adm:'Direito Administrativo',
  civil:'Direito Civil',
  cpc:'Direito Processual Civil',
  penal:'Direito Penal',
  cpp:'Direito Processual Penal',
  rlm:'Raciocínio Lógico-Matemático',
  trab:'Direito do Trabalho',
  ptra:'Direito Processual do Trabalho'
};
const LEGAL=new Set(['cf','adm','civil','cpc','penal','cpp','trab','ptra']);

// Ciclo ponderado: matérias jurídicas centrais reaparecem com maior frequência,
// mas o cursor continua de uma semana para a seguinte.
const WEIGHTED=[
  'cf','cpc','adm','penal','civil','cpp','pt','rlm',
  'cf','adm','cpc','civil','penal','cpp',
  'trab','ptra'
];

function el(id){return document.getElementById(id)}
function iso(d){
  return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');
}
function fromISO(s){
  const m=String(s||'').match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if(!m)return new Date();
  return new Date(Number(m[1]),Number(m[2])-1,Number(m[3]),12,0,0,0);
}
function availableSubjects(){
  const select=el('agendaDisc');
  const ids=[];
  if(select){
    [...select.options].forEach(o=>{
      const v=String(o.value||'').trim();
      if(LABELS[v]&&!ids.includes(v))ids.push(v);
    });
  }
  document.querySelectorAll('[data-id]').forEach(n=>{
    const v=String(n.getAttribute('data-id')||'').trim();
    if(LABELS[v]&&!ids.includes(v))ids.push(v);
  });
  return ids.length?ids:DEFAULT_SUBJECTS.slice(0,8);
}
function cyclePool(){
  const av=new Set(availableSubjects());
  const pool=WEIGHTED.filter(id=>av.has(id));
  return pool.length>=2?pool:DEFAULT_SUBJECTS.filter(id=>av.has(id));
}
function nextStudyDate(start, offset){
  const d=new Date(start);
  let count=0;
  while(count<offset || d.getDay()===0 || d.getDay()===6){
    if(d.getDay()!==0 && d.getDay()!==6)count++;
    if(count<=offset)d.setDate(d.getDate()+1);
  }
  return d;
}
function getStudyDates(start,count){
  const dates=[];
  const d=new Date(start);
  while(dates.length<count){
    if(d.getDay()!==0&&d.getDay()!==6)dates.push(new Date(d));
    d.setDate(d.getDate()+1);
  }
  return dates;
}
function read(date){
  try{
    const raw=localStorage.getItem(PREFIX+date);
    const v=raw?JSON.parse(raw):[];
    return Array.isArray(v)?v:[];
  }catch(_){return []}
}
function write(date,tasks){
  localStorage.setItem(PREFIX+date,JSON.stringify(tasks));
}
function cursor(){
  const n=Number(localStorage.getItem(CURSOR_KEY)||0);
  return Number.isFinite(n)&&n>=0?n:0;
}
function setCursor(n){localStorage.setItem(CURSOR_KEY,String(Math.max(0,n|0)))}
function nextPair(pool,cur){
  if(pool.length<2)return [pool[0],pool[0]];
  const a=pool[cur%pool.length];
  let step=1,b=pool[(cur+step)%pool.length];
  while(b===a&&step<pool.length){step++;b=pool[(cur+step)%pool.length]}
  return [a,b];
}
function taskText(id){
  if(id==='rlm')return '1 tópico — continuar do próximo não concluído • teoria + exercícios guiados • 15 questões • revisar os erros';
  if(id==='pt')return '1 tópico — continuar do próximo não concluído • teoria/leitura ativa • 15 questões • revisar os erros';
  if(LEGAL.has(id))return '1 tópico — continuar do próximo não concluído • teoria/leitura ativa • lei seca do tópico • 15 questões • revisar os erros';
  return '1 tópico — continuar do próximo não concluído • teoria/leitura ativa • 15 questões • revisar os erros';
}
function addAuto(date,id,slot){
  const tasks=read(date);
  const already=tasks.some(t=>t&&t.source===SOURCE&&t.discipline===id);
  if(already)return false;
  tasks.push({
    id:'auto-'+date+'-'+id+'-'+Date.now().toString(36)+'-'+slot,
    time:'',
    discipline:id,
    task:taskText(id),
    done:false,
    source:SOURCE,
    autoCycle:true
  });
  write(date,tasks);
  return true;
}
function status(msg,kind){
  const host=el('agendaStandaloneStatus');
  if(host){
    host.textContent=msg;
    host.className='agenda-standalone-status'+(kind?' '+kind:'');
  }
}
function refresh(){
  try{window.CentralAgenda&&CentralAgenda.render&&CentralAgenda.render()}catch(_){}
  try{window.CentralAgenda&&CentralAgenda.renderHomeSummary&&CentralAgenda.renderHomeSummary()}catch(_){}
}
function generate(days=5){
  try{
    const pool=cyclePool();
    if(pool.length<2){
      status('Não encontrei disciplinas suficientes para montar o ciclo.','warning');
      return false;
    }
    const base=fromISO(el('agendaDate')?.value||iso(new Date()));
    const dates=getStudyDates(base,Math.max(1,Math.min(20,Number(days)||5)));
    let cur=cursor(),added=0;
    dates.forEach(d=>{
      const date=iso(d);
      const pair=nextPair(pool,cur);
      if(addAuto(date,pair[0],1))added++;
      if(addAuto(date,pair[1],2))added++;
      cur+=2;
    });
    setCursor(cur);
    if(el('agendaDate'))el('agendaDate').value=iso(dates[0]);
    refresh();
    status('Ciclo criado: '+dates.length+' dias de estudo, 2 disciplinas por dia e 1 tópico por disciplina. '+added+' tarefa(s) adicionada(s).','success');
    return false;
  }catch(e){
    status('Não foi possível gerar o ciclo neste navegador.','error');
    return false;
  }
}
function removeFuture(){
  try{
    const start=fromISO(el('agendaDate')?.value||iso(new Date()));
    let removed=0;
    for(let i=0;i<60;i++){
      const d=new Date(start);d.setDate(d.getDate()+i);
      const date=iso(d),tasks=read(date);
      const kept=tasks.filter(t=>!(t&&t.source===SOURCE));
      removed+=tasks.length-kept.length;
      if(kept.length!==tasks.length)write(date,kept);
    }
    refresh();
    status(removed?removed+' tarefa(s) automáticas removida(s).':'Não havia tarefas automáticas futuras para remover.','success');
  }catch(_){status('Não foi possível limpar as tarefas automáticas.','error')}
  return false;
}

window.CentralStudyPlanner={generate,removeFuture};

function inject(){
  const add=el('agendaAddButton');
  if(!add||el('studyCycleGenerate'))return;
  const row=add.parentElement;
  const gen=document.createElement('button');
  gen.id='studyCycleGenerate';
  gen.type='button';
  gen.className='btn green';
  gen.textContent='Gerar próxima semana';
  gen.onclick=()=>generate(5);
  const clear=document.createElement('button');
  clear.id='studyCycleClear';
  clear.type='button';
  clear.className='btn';
  clear.textContent='Limpar automáticas';
  clear.onclick=removeFuture;
  row.insertBefore(gen,add);
  row.insertBefore(clear,add);
  const note=document.createElement('div');
  note.className='muted small';
  note.style.marginTop='9px';
  note.textContent='Ciclo contínuo: 5 dias úteis, 2 disciplinas por dia e 1 tópico por disciplina. Não substitui tarefas que você adicionar manualmente.';
  row.parentElement.insertBefore(note,el('agendaStandaloneStatus'));
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',inject,{once:true});else inject();
})();