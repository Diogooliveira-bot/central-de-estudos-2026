/* Controle editorial: todos os módulos e eventos atribuídos ao ADM autenticado. */
(function(){
'use strict';
const $=id=>document.getElementById(id);
const disciplineNames={cf:'Direito Constitucional',adm:'Direito Administrativo',civil:'Direito Civil',
 cpc:'Processo Civil',cpp:'Processo Penal',penal:'Direito Penal',pt:'Português',rlm:'Raciocínio Lógico',info:'Informática'};
const catalog=window.BCReviewCatalog||{};
const state={items:new Map(),events:[],all:[],busy:new Set()};
function fmt(value){if(!value)return '—';try{return new Date(value).toLocaleString('pt-BR')}catch(_){return '—'}}
function shortKey(key){const parts=key.split(':');return (disciplineNames[parts[0]]||parts[0])+' · M'+parts[1]}
async function api(path,options){
 const response=await fetch(path,Object.assign({credentials:'same-origin',cache:'no-store'},options||{}));
 let body={};try{body=await response.json()}catch(_){}
 if(!response.ok)throw new Error(body.error||'Não foi possível concluir a solicitação');
 return body;
}
function message(text,error){
 const el=$('notice');el.textContent=text||'';
 el.className=error?'alert':'';
}
function buildCatalog(){
 const entries=[];
 for(const [disc,modules] of Object.entries(catalog)){
  for(const mod of modules){
   const key=disc+':'+String(mod.number).padStart(2,'0');
   entries.push({key,disc,title:mod.title,number:mod.number});
  }
 }
 const keys=new Set(entries.map(x=>x.key));
 for(const key of state.items.keys()){
  if(keys.has(key))continue;
  const [disc,n]=key.split(':');
  entries.push({key,disc,title:'Módulo '+n,number:Number(n)});
 }
 entries.sort((a,b)=>(disciplineNames[a.disc]||a.disc).localeCompare(disciplineNames[b.disc]||b.disc,'pt-BR')||a.number-b.number);
 state.all=entries;
}
function statusOf(item){
 if(item&&item.reviewed)return 'done';
 if(item&&item.lastEditedBy)return 'changed';
 return 'pending';
}
function el(tag,txt,cls){
 const node=document.createElement(tag);
 if(txt!==undefined)node.textContent=txt;
 if(cls)node.className=cls;
 return node;
}
function stats(){
 const total=state.all.length,done=state.all.filter(x=>state.items.get(x.key)?.reviewed).length;
 $('stat-total').textContent=String(total);$('stat-done').textContent=String(done);
 $('stat-pending').textContent=String(total-done);
 $('stat-percent').textContent=total?Math.round(done/total*100)+'%':'0%';
 const subject=$('discipline').value;
 const list=subject?state.all.filter(x=>x.disc===subject):state.all;
 const reviewed=list.filter(x=>state.items.get(x.key)?.reviewed).length;
 $('progress').textContent=(subject?disciplineNames[subject]:'Todas as disciplinas')+': '+reviewed+' de '+list.length+' módulos revisados.';
}
async function update(key,reviewed){
 if(state.busy.has(key))return;
 const existing=state.items.get(key)||{key,version:0,reviewed:false};
 state.busy.add(key);render();
 try{
  const response=await api('/api/content-review',{
   method:'POST',headers:{'Content-Type':'application/json'},
   body:JSON.stringify({key,reviewed,expectedVersion:existing.version})
  });
  state.items.set(key,response.item);
  message('Revisão atualizada com sucesso.',false);
  await load(true);
 }catch(err){
  message(err.message||'Não foi possível marcar a revisão.',true);
  await load(true).catch(()=>{});
 }finally{state.busy.delete(key);render()}
}
function render(){
 const query=$('search').value.trim().toLocaleLowerCase('pt-BR');
 const discipline=$('discipline').value,filter=$('status').value;
 const body=$('rows');body.replaceChildren();
 stats();
 const list=state.all.filter(m=>{
  const item=state.items.get(m.key),status=statusOf(item);
  return (!discipline||m.disc===discipline)&&(!filter||status===filter)
   &&(!query||(disciplineNames[m.disc]+' '+m.title+' '+m.key+' '+(item?.lastEditedBy||'')+' '+(item?.reviewedBy||'')).toLocaleLowerCase('pt-BR').includes(query));
 });
 if(!list.length){const row=el('tr');const cell=el('td','Nenhum módulo encontrado.');cell.colSpan=5;row.append(cell);body.append(row);return}
 for(const mod of list){
  const item=state.items.get(mod.key)||{key:mod.key,version:0,reviewed:false};
  const row=el('tr');const checkTd=el('td');
  const check=el('input');check.type='checkbox';check.checked=!!item.reviewed;
  check.disabled=state.busy.has(mod.key);check.setAttribute('aria-label','Marcar '+shortKey(mod.key)+' como revisado');
  check.addEventListener('change',()=>update(mod.key,check.checked));
  checkTd.append(check);row.append(checkTd);
  const nameTd=el('td');nameTd.append(el('strong',mod.title),el('small',shortKey(mod.key)));row.append(nameTd);
  const status=statusOf(item);const statusTd=el('td');
  statusTd.append(el('span',status==='done'?'Revisado':status==='changed'?'Editado · revisar':'Pendente','pill '+(status==='done'?'done':status==='changed'?'changed':'')));
  row.append(statusTd);
  const edit=el('td',item.lastEditedBy||'—');
  edit.append(el('small',fmt(item.lastEditedAt)));row.append(edit);
  const review=el('td',item.reviewedBy||'—');
  review.append(el('small',fmt(item.reviewedAt)));row.append(review);
  body.append(row);
 }
}
function renderHistory(){
 const host=$('history');host.replaceChildren();
 if(!state.events.length){host.append(el('p','Nenhuma atividade registrada desde a ativação do painel.'));return}
 const actions={publish:'publicou conteúdo',restore:'restaurou o conteúdo original',review:'marcou como revisado',reopen:'retirou o check de revisão'};
 for(const entry of state.events){
  const row=el('div',undefined,'event');
  const main=el('div');
  main.append(el('strong',entry.by+' '+(actions[entry.action]||entry.action)),
    el('div',shortKey(entry.key)+(entry.revision?' · versão '+entry.revision:'')));
  row.append(main,el('small',fmt(entry.at)));host.append(row);
 }
}
async function load(silent=false){
 const payload=await api('/api/content-review');
 state.items=new Map((payload.items||[]).map(item=>[item.key,item]));
 state.events=payload.events||[];
 buildCatalog();render();renderHistory();
 if(!silent)message('',false);
}
async function start(){
 try{
  const me=await api('/api/auth?action=me');
  if(!me.authenticated||me.user?.role!=='admin')throw new Error('Acesso exclusivo dos administradores.');
  const names=new Set(state.all.map(x=>x.disc));
  Object.keys(catalog).forEach(x=>names.add(x));
  const select=$('discipline');
  for(const disc of Object.keys(disciplineNames).filter(x=>names.has(x))){
   const option=el('option',disciplineNames[disc]);option.value=disc;select.append(option);
  }
  $('reload').addEventListener('click',()=>load().catch(err=>message(err.message,true)));
  ['search','discipline','status'].forEach(id=>$(id).addEventListener(id==='search'?'input':'change',render));
  await load();
 }catch(err){
  message(err.message||'Não foi possível abrir o painel.',true);
  $('rows').replaceChildren(el('tr'));$('rows').firstChild.append(el('td','Acesso indisponível.'));
 }
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();