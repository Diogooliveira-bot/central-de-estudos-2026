(function(){
'use strict';
if(window.__PORTUGUES_NATIVE_V1__)return;
window.__PORTUGUES_NATIVE_V1__=true;
window.PT_NATIVE_DATA=window.PT_NATIVE_DATA||{};

const PREFIX='base-completa:pt:v1:';
const OPEN_KEY=PREFIX+'open-module';
const MANIFEST=[
 {id:'m1',num:1,title:'Ortografia e Acentuação',sections:10},
 {id:'m2',num:2,title:'Classes Nominais',sections:10},
 {id:'m3',num:3,title:'Conectivos',sections:10},
 {id:'m4',num:4,title:'Pronomes',sections:10},
 {id:'m5',num:5,title:'Colocação Pronominal',sections:6},
 {id:'m6',num:6,title:'Verbos',sections:11},
 {id:'m7',num:7,title:'Correlação e Vozes',sections:7},
 {id:'m8',num:8,title:'Sintaxe da Oração',sections:8},
 {id:'m9',num:9,title:'Sintaxe do Período',sections:8},
 {id:'m10',num:10,title:'Pontuação',sections:10},
 {id:'m11',num:11,title:'Concordância',sections:20},
 {id:'m12',num:12,title:'Regência Verbal e Nominal',sections:7},
 {id:'m13',num:13,title:'Crase',sections:7},
 {id:'m14',num:14,title:'Coesão e Coerência',sections:7},
 {id:'m15',num:15,title:'Semântica Geral',sections:8},
 {id:'m16',num:16,title:'Interpretação de Textos',sections:8},
 {id:'m17',num:17,title:'Tipologia Textual',sections:7}
];
const byId=Object.fromEntries(MANIFEST.map(m=>[m.id,m]));
const loading={};

function esc(v){return String(v==null?'':v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function escAttr(v){return esc(v).replace(/\x60/g,'&#96;')}
function js(v){return String(v==null?'':v).replace(/\\/g,'\\\\').replace(/'/g,"\\'").replace(/\r?\n/g,' ')}
function stateKey(id){return PREFIX+'module:'+id+':progress'}
function tabKey(id){return PREFIX+'module:'+id+':last-tab'}
function scrollKey(id){return PREFIX+'module:'+id+':scroll'}
function blankState(){return {sections:{},reviewDone:false,rounds:{r1:'',r2:'',final:''},answers:{},errors:[],migrated:false}}

function readState(id){
 let st=blankState();
 try{const x=JSON.parse(localStorage.getItem(stateKey(id))||'null');if(x&&typeof x==='object')st={...st,...x,sections:{...(x.sections||{})},rounds:{...st.rounds,...(x.rounds||{})},answers:{...(x.answers||{})},errors:Array.isArray(x.errors)?x.errors:[]}}catch(_){}
 if(!st.migrated){st=migrateLegacy(id,st);writeState(id,st)}
 return st;
}
function writeState(id,st){try{localStorage.setItem(stateKey(id),JSON.stringify(st))}catch(_){}}
function oldKey(id){
 if(id==='m1')return 'central-v6:pt:m1:v3';
 return 'central-v6:pt:'+id+':v1';
}
function migrateLegacy(id,st){
 try{
  const old=JSON.parse(localStorage.getItem(oldKey(id))||'null');
  if(old&&typeof old==='object'){
   if(old.sessions&&typeof old.sessions==='object')Object.entries(old.sessions).forEach(([k,v])=>{if(v&&(v.done===true||v===true))st.sections[k]=true});
   if(old.read&&typeof old.read==='object')Object.entries(old.read).forEach(([k,v])=>{if(v)st.sections[k]=true});
   if(old.done&&typeof old.done==='object')Object.entries(old.done).forEach(([k,v])=>{if(v)st.sections[k]=true});
   if(old.rounds&&typeof old.rounds==='object'){
    const val=x=>x&&typeof x==='object'?(x.correct??x.pct??''):x;
    st.rounds.r1=val(old.rounds.r1)??st.rounds.r1;
    st.rounds.r2=val(old.rounds.r2)??st.rounds.r2;
    st.rounds.final=val(old.rounds.final??old.rounds.rf)??st.rounds.final;
   }
   if(Array.isArray(old.errors))st.errors=old.errors;
  }
 }catch(_){}
 st.migrated=true;
 return st;
}
function modulePct(id){
 const m=byId[id],st=readState(id);if(!m)return 0;
 const done=Object.values(st.sections||{}).filter(Boolean).length;
 return m.sections?Math.min(100,Math.round(done/m.sections*100)):0;
}
function stats(){
 const done=MANIFEST.filter(m=>modulePct(m.id)===100).length;
 return {total:MANIFEST.length,done,pct:Math.round(done/MANIFEST.length*100),unit:'módulos'};
}
window.ptNativeStats=stats;

function installStyle(){
 if(document.getElementById('pt-native-v1-style'))return;
 const s=document.createElement('style');s.id='pt-native-v1-style';
 s.textContent=`
 .ptn-master{display:grid;gap:10px}
 .ptn-intro{display:flex;align-items:flex-start;justify-content:space-between;gap:14px;padding:14px;border:1px solid var(--line);border-radius:14px;background:var(--soft)}
 .ptn-intro h3{margin:0 0 5px;font-size:15px}.ptn-intro p{margin:0;color:var(--muted);font-size:11px;line-height:1.5}
 .ptn-pill{white-space:nowrap;border:1px solid rgba(139,124,255,.5);background:rgba(139,124,255,.10);color:#b7adff;border-radius:999px;padding:6px 9px;font-size:10px;font-weight:900}
 .subject[data-id="pt"]{--discipline-accent:#8b7cff;--discipline-accent-soft:rgba(139,124,255,.12)}
 .disc-card[data-id="pt"]{--discipline-accent:#8b7cff}
 .ptn-module-body{padding-top:10px}
 .ptn-tabs{display:flex;gap:7px;flex-wrap:wrap;border-bottom:1px solid var(--line);padding-bottom:10px;margin-bottom:10px}
 .ptn-tab{border:1px solid var(--line2);background:var(--panel2);color:var(--text);border-radius:9px;padding:8px 11px;font-size:11px;font-weight:850;cursor:pointer}
 .ptn-tab.active{border-color:#8b7cff;background:rgba(139,124,255,.14);color:#fff}
 .ptn-loading{padding:18px;border:1px solid var(--line);border-radius:11px;background:var(--panel);color:var(--muted);font-size:12px}
 .ptn-content{font-size:var(--central-reading-font-large,15px);line-height:1.68;color:var(--text)}
 .ptn-content h3{font-size:calc(var(--central-reading-font-large,16px) * 1.125);margin:16px 0 7px}
 .ptn-content h4{font-size:var(--central-reading-font-large,15px);margin:14px 0 6px}
 .ptn-content p{margin:7px 0;color:var(--text)}.ptn-content ul,.ptn-content ol{padding-left:22px}.ptn-content li{margin:5px 0}
 .ptn-content table{width:100%;border-collapse:collapse;margin:10px 0;font-size:.92em}.ptn-content th,.ptn-content td{border:1px solid var(--line);padding:8px;text-align:left;vertical-align:top}
 .ptn-session{border:1px solid var(--line);background:var(--panel);border-radius:11px;margin:9px 0;overflow:hidden}
 .ptn-session>summary{list-style:none;cursor:pointer;display:grid;grid-template-columns:34px minmax(0,1fr) auto;align-items:center;gap:9px;padding:12px}
 .ptn-session>summary::-webkit-details-marker{display:none}.ptn-session-no{font-size:10px;font-weight:900;color:#9d92ff}.ptn-session-title b{display:block;font-size:12px}.ptn-session-title small{display:block;color:var(--muted);font-size:9.5px;margin-top:2px}
 .ptn-session-state{font-size:9px;font-weight:900;color:var(--muted)}.ptn-session.done .ptn-session-state{color:var(--green)}
 .ptn-session-body{border-top:1px solid var(--line);padding:13px}
 .ptn-done{display:flex;align-items:center;gap:8px;border-top:1px dashed var(--line2);margin-top:14px;padding-top:11px;font-weight:800;font-size:11px}.ptn-done input{width:18px;height:18px;accent-color:var(--green)}
 .ptn-part,.alert,.warning,.exam,.remember,.procedure,.evidence,.takeaway,.ptm2-trap{border-left:3px solid #8b7cff;background:var(--soft);border-radius:0 9px 9px 0;padding:10px 12px;margin:10px 0}
 .warning,.ptm2-trap{border-left-color:#f59e0b}.exam{border-left-color:#4f8cff}.remember,.takeaway{border-left-color:#13bd6b}
 .ptn-compare{display:grid;grid-template-columns:1fr 1fr;gap:9px}.ptn-compare>div{border:1px solid var(--line);border-radius:9px;padding:10px;background:var(--panel)}
 .ptn-review-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:9px}.ptn-review-card{border:1px solid var(--line);background:var(--panel);border-radius:10px;padding:11px}
 .ptn-review-card b{display:block;margin-bottom:5px}.ptn-review-card p{margin:0;color:var(--muted);font-size:12px;line-height:1.5}
 .ptn-question{border:1px solid var(--line);background:var(--panel);border-radius:11px;padding:12px;margin:9px 0}.ptn-question-context{color:var(--muted);font-size:11px;margin-bottom:5px}.ptn-question-title{font-weight:800;font-size:12px;line-height:1.5}
 .ptn-options{display:grid;gap:6px;margin-top:9px}.ptn-option{border:1px solid var(--line2);background:var(--soft);color:var(--text);border-radius:8px;padding:9px 10px;text-align:left;cursor:pointer}
 .ptn-option.selected{border-color:#8b7cff}.ptn-option.correct{border-color:var(--green);background:rgba(19,189,107,.10)}.ptn-option.wrong{border-color:var(--red);background:rgba(239,68,68,.10)}
 .ptn-feedback{margin-top:8px;border-radius:8px;padding:9px;background:var(--soft);font-size:11px;line-height:1.5}
 .ptn-content .quiz{border:1px solid var(--line);background:var(--soft);border-radius:10px;padding:11px;margin:11px 0}
 .ptn-content .quiz-title,.ptn-content .label{display:block;font-size:10px;font-weight:900;text-transform:uppercase;letter-spacing:.04em;color:#9d92ff;margin-bottom:7px}
 .ptn-content .quiz-options{display:grid;gap:6px;margin-top:8px}.ptn-content .quiz-opt,.ptn-content .show-answer{border:1px solid var(--line2);background:var(--panel2);color:var(--text);border-radius:8px;padding:8px 10px;text-align:left;cursor:pointer;font:inherit}
 .ptn-content .quiz-opt.correct{border-color:var(--green);background:rgba(19,189,107,.10)}.ptn-content .quiz-opt.wrong{border-color:var(--red);background:rgba(239,68,68,.10)}
 .ptn-content .quiz-feedback{margin-top:8px;font-size:11px;line-height:1.5;color:var(--muted)}.ptn-content .answer{display:none;margin-top:8px;padding:9px;border-left:3px solid var(--green);background:rgba(19,189,107,.08);border-radius:0 8px 8px 0}.ptn-content .answer.open{display:block}
 .ptn-content .contrast,.ptn-content .mini-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px;margin:10px 0}.ptn-content .contrast>div,.ptn-content .mini-grid>div{border:1px solid var(--line);background:var(--soft);border-radius:9px;padding:10px}
 .ptn-content .contrast span{display:block;color:var(--muted);font-size:.92em;margin-top:4px}.ptn-content .analyst,.ptn-content .formula{border-left:3px solid #4f8cff;background:rgba(79,140,255,.08);border-radius:0 9px 9px 0;padding:10px 12px;margin:10px 0}.ptn-content .flow{display:flex;gap:7px;align-items:center;flex-wrap:wrap}
 .ptn-rounds{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px}.ptn-round{border:1px solid var(--line);background:var(--panel);border-radius:10px;padding:11px}.ptn-round input{width:100%;margin-top:7px;border:1px solid var(--line2);background:var(--bg);color:var(--text);border-radius:7px;padding:8px}
 .ptn-actions{display:flex;gap:8px;flex-wrap:wrap;margin-top:11px}.ptn-btn{border:1px solid var(--line2);background:var(--panel2);color:var(--text);border-radius:8px;padding:8px 11px;font-size:11px;font-weight:850;cursor:pointer}.ptn-btn.primary{border-color:#765fff;background:#35276b}
 .ptn-progress-note{font-size:10px;color:var(--muted);margin:8px 0 0}
 @media(max-width:720px){.ptn-intro{display:block}.ptn-pill{display:inline-block;margin-top:8px}.ptn-review-grid,.ptn-compare,.ptn-rounds{grid-template-columns:1fr}.ptn-session>summary{grid-template-columns:28px minmax(0,1fr) auto;padding:10px 9px}.ptn-content{font-size:var(--central-reading-font-large,15px)}}
 `;
 document.head.appendChild(s);
}

function addScript(src){
 return new Promise((resolve,reject)=>{
  const old=document.querySelector('script[data-pt-native-src="'+src+'"]');
  if(old){if(old.dataset.loaded==='1')resolve();else old.addEventListener('load',resolve,{once:true});return}
  const s=document.createElement('script');s.src=src;s.async=true;s.dataset.ptNativeSrc=src;
  s.onload=()=>{s.dataset.loaded='1';resolve()};s.onerror=()=>reject(new Error('Falha ao carregar '+src));document.head.appendChild(s);
 });
}
function loadData(id){
 if(window.PT_NATIVE_DATA[id])return Promise.resolve(window.PT_NATIVE_DATA[id]);
 if(loading[id])return loading[id];
 loading[id]=addScript('/portugues-native-data/'+id+'.js?v=20260921n1').then(()=>{
   const d=window.PT_NATIVE_DATA[id];if(!d)throw new Error('Dados não registrados para '+id);return d;
 }).finally(()=>{delete loading[id]});
 return loading[id];
}

function renderPortugueseMaster(){
 installStyle();
 const s=stats();
 const html='<div class="ptn-master"><div class="ptn-intro"><div><h3>Português</h3><p>17 módulos nativos. O conteúdo só é carregado quando você abre o módulo.</p></div><span class="ptn-pill">'+s.done+'/'+s.total+' concluídos · '+s.pct+'%</span></div><div class="cf-modules">'+MANIFEST.map(renderModuleShell).join('')+'</div></div>';
 setTimeout(()=>{const open=localStorage.getItem(OPEN_KEY);if(open&&byId[open])mount(open)},0);
 return html;
}
window.renderPortugueseMaster=renderPortugueseMaster;

function renderModuleShell(m){
 const open=localStorage.getItem(OPEN_KEY)===m.id,p=modulePct(m.id);
 return '<section class="cf-module '+(open?'open':'')+'" data-ptn-module="'+m.id+'">'+
  '<button class="cf-module-head" onclick="return togglePtNativeModule(\''+m.id+'\')">'+
   '<span class="cf-module-no">MÓDULO '+m.num+'</span><span class="cf-module-title">'+esc(m.title)+'</span>'+
   '<span class="cf-module-stat" data-ptn-stat="'+m.id+'">'+p+'% • '+m.sections+' sessões</span><span class="chev">⌄</span>'+
  '</button><div class="cf-module-body ptn-module-body"><div class="cf-module-bar"><span data-ptn-bar="'+m.id+'" style="width:'+p+'%"></span></div><div data-ptn-host="'+m.id+'">'+(open?'<div class="ptn-loading">Carregando módulo…</div>':'')+'</div></div></section>';
}

function toggle(id){
 const el=document.querySelector('.cf-module[data-ptn-module="'+id+'"]');if(!el)return false;
 const opening=!el.classList.contains('open');
 document.querySelectorAll('.cf-module[data-ptn-module].open').forEach(x=>{if(x!==el)x.classList.remove('open')});
 el.classList.toggle('open',opening);
 if(opening){
  localStorage.setItem(OPEN_KEY,id);
  try{if(typeof saveLast==='function')saveLast({ptModule:id,title:'Português • Módulo '+byId[id].num+' • '+byId[id].title,at:Date.now()})}catch(_){}
  mount(id);
 }else localStorage.removeItem(OPEN_KEY);
 return false;
}
window.togglePtNativeModule=toggle;

function mount(id){
 const host=document.querySelector('[data-ptn-host="'+id+'"]');if(!host)return;
 host.innerHTML='<div class="ptn-loading">Carregando somente '+id.toUpperCase()+'…</div>';
 loadData(id).then(data=>{
  const tab=localStorage.getItem(tabKey(id))||'teoria';
  host.innerHTML=renderModuleContent(id,data,tab);
  hydrate(id,data,tab);
 }).catch(err=>{console.error('[Português nativo]',err);host.innerHTML='<div class="ptn-loading">Não foi possível carregar este módulo. Feche e abra novamente.</div>'});
}
window.ptNativeMount=mount;

function renderModuleContent(id,data,tab){
 const tabs=[['teoria','Teoria'],['revisao','Revisão'],['questoes','Questões'],['tec','TEC']];
 return '<div class="ptn-tabs">'+tabs.map(x=>'<button type="button" class="ptn-tab '+(tab===x[0]?'active':'')+'" onclick="return ptNativeTab(\''+id+'\',\''+x[0]+'\')">'+x[1]+'</button>').join('')+'</div>'+
  '<div class="ptn-content">'+(tab==='teoria'?renderTheory(id,data):tab==='revisao'?renderReview(id,data):tab==='questoes'?renderQuestions(id,data):renderTec(id,data))+'</div>';
}
function setTab(id,tab){
 localStorage.setItem(tabKey(id),tab);
 loadData(id).then(data=>{const host=document.querySelector('[data-ptn-host="'+id+'"]');if(!host)return;host.innerHTML=renderModuleContent(id,data,tab);hydrate(id,data,tab)});
 return false;
}
window.ptNativeTab=setTab;

function renderTheory(id,data){
 const st=readState(id);
 return (data.sections||[]).map((s,i)=>{
  const done=!!st.sections[s.id];
  return '<details class="ptn-session '+(done?'done':'')+'" data-ptn-session="'+escAttr(s.id)+'" '+(i===0?'open':'')+'>'+
   '<summary><span class="ptn-session-no">'+String(i+1).padStart(2,'0')+'</span><span class="ptn-session-title"><b>'+esc(s.title)+'</b><small>'+esc(s.goal||s.priority||'')+'</small></span><span class="ptn-session-state">'+(done?'CONCLUÍDA':'PENDENTE')+'</span></summary>'+
   '<div class="ptn-session-body">'+(s.html||'')+(Array.isArray(s.remember)&&s.remember.length?'<div class="remember"><b>O que levar para a prova</b><ul>'+s.remember.map(x=>'<li>'+esc(x)+'</li>').join('')+'</ul></div>':'')+
   '<label class="ptn-done"><input type="checkbox" data-ptn-done="'+escAttr(s.id)+'" '+(done?'checked':'')+'> Li e concluí esta sessão</label></div></details>';
 }).join('');
}
function rememberItems(data){
 const out=[];for(const s of data.sections||[])for(const x of s.remember||[])if(x&&!out.includes(x))out.push(x);
 return out;
}
function renderReview(id,data){
 const st=readState(id),items=rememberItems(data);
 let html='';
 if(Array.isArray(data.review)&&data.review.length)html+=data.review.join('');
 html+='<div class="ptn-review-grid">'+(items.length?items.map((x,i)=>'<div class="ptn-review-card"><b>'+(i+1)+'. Ponto de revisão</b><p>'+esc(x)+'</p></div>').join(''):'<div class="ptn-review-card"><b>Revisão ativa</b><p>Releia somente as sessões em que houve dúvida ou erro. Use o caderno de erros e o TEC como recuperação ativa.</p></div>')+'</div>';
 html+='<label class="ptn-done"><input type="checkbox" data-ptn-review '+(st.reviewDone?'checked':'')+'> Revisão deste módulo concluída</label>';
 return html;
}
function allQuestions(data){
 const out=[];
 for(const q of data.questions||[])out.push(q);
 for(const s of data.sections||[])for(const q of s.quiz||[])out.push({id:s.id+':'+out.length,text:q.q||q.text||'',prompt:q.prompt||'',options:q.options||[],correct:q.correct,explanation:q.explanation||''});
 return out;
}
function renderQuestions(id,data){
 const st=readState(id),qs=allQuestions(data);
 let html='';
 if(qs.length){
  html+='<p class="ptn-progress-note">'+qs.length+' questão(ões) migradas para o motor nativo.</p>';
  html+=qs.map((q,i)=>{
   const qid=String(q.id||('q'+i)),chosen=st.answers[qid];
   const answered=Number.isInteger(chosen),ok=answered&&chosen===q.correct;
   return '<div class="ptn-question"><div class="ptn-question-context">'+esc(q.text||'')+'</div><div class="ptn-question-title">'+(i+1)+'. '+esc(q.prompt||q.text||'Questão')+'</div>'+
    '<div class="ptn-options">'+(q.options||[]).map((o,oi)=>{
      let cls='ptn-option';if(answered){if(oi===q.correct)cls+=' correct';else if(oi===chosen)cls+=' wrong'}else if(oi===chosen)cls+=' selected';
      return '<button type="button" class="'+cls+'" onclick="return ptNativeAnswer(\''+id+'\',\''+js(qid)+'\','+oi+')">'+String.fromCharCode(65+oi)+') '+esc(o)+'</button>';
    }).join('')+'</div>'+(answered?'<div class="ptn-feedback"><b>'+(ok?'✓ Correto.':'✗ Revise.')+'</b> '+esc(q.explanation||'')+'</div>':'')+'</div>';
  }).join('');
 }else{
  html+='<div class="ptn-review-card"><b>Treino por rodadas</b><p>O conteúdo teórico deste módulo já foi migrado. Registre abaixo o desempenho das rodadas e use o caderno TEC na aba seguinte.</p></div>';
 }
 html+='<div class="ptn-rounds">'+[['r1','R1 / 20'],['r2','R2 / 25'],['final','Final / 30']].map(x=>'<label class="ptn-round"><b>'+x[1]+'</b><input type="number" min="0" data-ptn-round="'+x[0]+'" value="'+escAttr(st.rounds[x[0]]??'')+'" placeholder="Acertos"></label>').join('')+'</div>';
 return html;
}
function answer(id,qid,choice){
 const st=readState(id);st.answers[qid]=Number(choice);writeState(id,st);
 loadData(id).then(data=>{const host=document.querySelector('[data-ptn-host="'+id+'"]');if(host){host.innerHTML=renderModuleContent(id,data,'questoes');hydrate(id,data,'questoes')}});
 return false;
}
window.ptNativeAnswer=answer;

const VERIFIED_TEC={
 m3:{name:'PORT 08 — Advérbio, preposição, conjunção e outras classes',url:'https://www.tecconcursos.com.br/questoes/cadernos/101831187',count:455},
 m17:{name:'PORT 02 — Tipologia, gêneros, coesão e discurso',url:'https://www.tecconcursos.com.br/questoes/cadernos/101818338',count:770}
};
function renderTec(id){
 const t=VERIFIED_TEC[id];
 if(t)return '<div class="ptn-review-card"><b>'+esc(t.name)+'</b><p>'+t.count+' questões · link já existente no material anterior deste módulo.</p><div class="ptn-actions"><button class="ptn-btn primary" onclick="window.open(\''+escAttr(t.url)+'\',\'_blank\',\'noopener\')">Abrir TEC ↗</button></div></div>';
 return '<div class="ptn-review-card"><b>Cadernos TEC de Língua Portuguesa</b><p>Abra a área de Cadernos TEC da Central e filtre a disciplina. Nenhum endereço novo é inventado pelo módulo.</p><div class="ptn-actions"><button class="ptn-btn primary" onclick="return ptNativeOpenTec()">Abrir Cadernos TEC</button></div></div>';
}
function openTec(){
 try{
  if(typeof window.openTecCadernos==='function')window.openTecCadernos();
  else if(typeof window.centralSidebarAction==='function')window.centralSidebarAction('tec-cadernos');
  setTimeout(()=>{const sel=document.getElementById('tecMateria');if(sel&&[...sel.options].some(o=>o.value==='Língua Portuguesa'))sel.value='Língua Portuguesa';if(typeof window.tecCadernosRender==='function')window.tecCadernosRender()},30);
 }catch(e){console.warn('[PT TEC]',e)}
 return false;
}
window.ptNativeOpenTec=openTec;

function hydrateInlineStudy(host){
 if(!host)return;
 host.querySelectorAll('.show-answer').forEach(btn=>{
  btn.addEventListener('click',()=>{
   let ans=btn.nextElementSibling;
   if(!ans||!ans.classList.contains('answer'))ans=btn.parentElement&&btn.parentElement.querySelector('.answer');
   if(ans){const open=ans.classList.toggle('open');btn.textContent=open?'Ocultar gabarito':'Ver gabarito'}
  });
 });
 host.querySelectorAll('.quiz[data-answer]').forEach(box=>{
  const correct=String(box.dataset.answer||'').toLowerCase(),explanation=box.dataset.explanation||'';
  box.querySelectorAll('.quiz-opt').forEach(opt=>opt.addEventListener('click',()=>{
   box.querySelectorAll('.quiz-opt').forEach(x=>x.classList.remove('correct','wrong'));
   const chosen=String(opt.dataset.choice||'').toLowerCase();
   if(chosen===correct)opt.classList.add('correct');else{opt.classList.add('wrong');const right=box.querySelector('.quiz-opt[data-choice="'+CSS.escape(correct)+'"]');if(right)right.classList.add('correct')}
   const fb=box.querySelector('.quiz-feedback');if(fb)fb.innerHTML='<b>'+(chosen===correct?'✓ Correto.':'✗ Revise.')+'</b> '+esc(explanation);
  }));
 });
}
function hydrate(id,data,tab){
 if(tab==='teoria'){
  const host=document.querySelector('[data-ptn-host="'+id+'"]');if(!host)return;
  host.querySelectorAll('[data-ptn-done]').forEach(cb=>cb.addEventListener('change',()=>{
   const st=readState(id);st.sections[cb.dataset.ptnDone]=cb.checked;writeState(id,st);
   const details=cb.closest('.ptn-session');if(details){details.classList.toggle('done',cb.checked);const lab=details.querySelector('.ptn-session-state');if(lab)lab.textContent=cb.checked?'CONCLUÍDA':'PENDENTE'}
   refreshProgress(id);
  }));
 }else if(tab==='revisao'){
  const cb=document.querySelector('[data-ptn-host="'+id+'"] [data-ptn-review]');if(cb)cb.addEventListener('change',()=>{const st=readState(id);st.reviewDone=cb.checked;writeState(id,st)});
 }else if(tab==='questoes'){
  const host=document.querySelector('[data-ptn-host="'+id+'"]');if(host)host.querySelectorAll('[data-ptn-round]').forEach(inp=>inp.addEventListener('change',()=>{const st=readState(id);st.rounds[inp.dataset.ptnRound]=inp.value;writeState(id,st)}));
 }
 hydrateInlineStudy(document.querySelector('[data-ptn-host="'+id+'"]'));
}
function refreshProgress(id){
 const p=modulePct(id),stat=document.querySelector('[data-ptn-stat="'+id+'"]'),bar=document.querySelector('[data-ptn-bar="'+id+'"]');
 if(stat)stat.textContent=p+'% • '+byId[id].sections+' sessões';if(bar)bar.style.width=p+'%';
 const s=stats(),subject=document.querySelector('.subject[data-id="pt"]');
 if(subject){const count=subject.querySelector('.subject-count'),pct=subject.querySelector('.subject-pct'),b=subject.querySelector('.subject-bar span');if(count)count.textContent=s.done+'/'+s.total+' módulos';if(pct){pct.textContent=s.pct+'%';pct.classList.toggle('done',s.pct===100)}if(b)b.style.width=s.pct+'%'}
}

function openLast(id){
 try{if(typeof openHome==='function')openHome();localStorage.setItem('central-v6:open:pt','1');localStorage.setItem(OPEN_KEY,id);if(typeof renderSubjects==='function')renderSubjects();setTimeout(()=>{const el=document.querySelector('.cf-module[data-ptn-module="'+id+'"]');if(el){el.classList.add('open');mount(id);el.scrollIntoView({behavior:'auto',block:'start'})}},20)}catch(e){console.warn('[PT continuar]',e)}
 return false;
}
window.openPtNativeLast=openLast;

function installSubject(){
 try{
  if(typeof SUBJECTS!=='undefined'&&Array.isArray(SUBJECTS)&&!SUBJECTS.some(s=>s.id==='pt')){
   SUBJECTS.unshift({id:'pt',name:'Português',special:'17 módulos • estudo nativo',topics:MANIFEST.map(m=>({uid:'pt-'+m.id,title:m.title,origin:'Módulo '+m.num,type:'Curso',sourceStats:null,tips:[]}))});
  }
 }catch(e){console.warn('[PT subject]',e)}
 try{
  const agenda=document.getElementById('agendaDisc');if(agenda&&![...agenda.options].some(o=>/Português/i.test(o.textContent||''))){const o=document.createElement('option');o.value='pt';o.textContent='Português';agenda.insertBefore(o,agenda.firstChild)}
 }catch(_){}
 try{if(typeof renderAll==='function')renderAll();if(typeof renderDisciplineGrid==='function')renderDisciplineGrid()}catch(e){console.warn('[PT render init]',e)}
}
installStyle();
setTimeout(installSubject,0);
})();
