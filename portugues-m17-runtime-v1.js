(function(){
"use strict";
if(window.__PORTUGUES_M17_RUNTIME_V1__)return;
window.__PORTUGUES_M17_RUNTIME_V1__=true;
const KEY="central-v6:pt:m17:v1";
const SESSIONS=Array.isArray(window.PT_M17_SESSIONS)?window.PT_M17_SESSIONS:[];
const VERIFIED_TEC={id:"port-02",nome:"PORT 02 - Tipologia, gêneros, coesão e discurso",grupo:"portugues",grupoNome:"Língua Portuguesa",url:"https://www.tecconcursos.com.br/questoes/cadernos/101818338",questoes:770,verifiedAt:"2026-09-17"};
function fresh(){return{done:{},quiz:{},tec:{rounds:[{pct:"",done:false},{pct:"",done:false},{pct:"",done:false}]},theme:"auto"}}
function load(){try{const x=JSON.parse(localStorage.getItem(KEY)||"null");if(x&&typeof x==="object"){const b=fresh();return Object.assign(b,x,{done:Object.assign({},b.done,x.done||{}),quiz:Object.assign({},b.quiz,x.quiz||{}),tec:Object.assign({},b.tec,x.tec||{})})}}catch(e){}return fresh()}
let state=load();
function save(){try{localStorage.setItem(KEY,JSON.stringify(state))}catch(e){}}
function esc(s){return String(s).replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[m]))}
function centralCadernos(){try{if(window.parent&&window.parent!==window&&window.parent.TEC_CADERNOS_DATA&&Array.isArray(window.parent.TEC_CADERNOS_DATA.cadernos))return window.parent.TEC_CADERNOS_DATA.cadernos}catch(e){}try{if(window.TEC_CADERNOS_DATA&&Array.isArray(window.TEC_CADERNOS_DATA.cadernos))return window.TEC_CADERNOS_DATA.cadernos}catch(e){}return[]}
function validTec(c){return !!(c&&c.id==="port-02"&&/tipologia/i.test(c.nome||"")&&/tecconcursos\.com\.br\/questoes\/cadernos\//.test(c.url||""))}
function resolveTec(){const live=centralCadernos().find(c=>c.id==="port-02");return validTec(live)?Object.assign({},VERIFIED_TEC,live):VERIFIED_TEC}
function applyTheme(){if(state.theme==="light"||state.theme==="dark")document.body.dataset.theme=state.theme;else delete document.body.dataset.theme}
function updateProgress(){const n=SESSIONS.filter(s=>state.done[s.id]).length;const pct=SESSIONS.length?Math.round(n/SESSIONS.length*100):0;const f=document.getElementById("progressFill"),l=document.getElementById("progressLabel"),p=document.getElementById("progressPct");if(f)f.style.width=pct+"%";if(l)l.textContent=n+"/"+SESSIONS.length+" sessões concluídas";if(p)p.textContent=pct+"%"}
function renderTheory(){
 const host=document.getElementById("m17Theory");if(!host)return;
 const openIds=new Set(Array.from(host.querySelectorAll("details.session[open]")).map(el=>el.dataset.session));
 const hadOpen=openIds.size>0;
 const scrollBox=host.closest(".view")||host.closest(".workspace")||null;
 const scrollTop=scrollBox?scrollBox.scrollTop:(window.scrollY||0);
 host.innerHTML=SESSIONS.map((s,idx)=>{
   const done=!!state.done[s.id];
   const quiz=(s.quiz||[]).map((q,qi)=>{
     const key=s.id+":"+qi, chosen=state.quiz[key];
     const opts=q.options.map((o,oi)=>'<button class="qopt'+(chosen===oi?' selected':'')+'" data-q="'+esc(key)+'" data-o="'+oi+'" type="button">'+String.fromCharCode(65+oi)+") "+esc(o)+'</button>').join("");
     let fb="";
     if(Number.isInteger(chosen)){const ok=chosen===q.correct;fb='<div class="feedback"><b>'+(ok?'✓ Correto.':'✗ Revise.')+'</b> '+esc(q.explanation)+'</div>'}
     const shouldOpen=hadOpen?openIds.has(s.id):idx===0;
     return '<details class="session" data-session="'+esc(s.id)+'" '+(shouldOpen?'open':'')+'><summary><span class="num">'+(idx+1)+'</span><span class="sumtxt"><b>'+esc(s.title)+'</b><span class="goal">'+esc(s.goal||"")+'</span></span><span class="state">'+(done?'CONCLUÍDA':'PENDENTE')+'</span></summary><div class="body">'+s.html+'<div class="quiz"><span class="label">Checagem rápida — estilo FCC, autoral</span>'+quiz+'</div><div class="donebox"><label><input type="checkbox" data-done="'+esc(s.id)+'" '+(done?'checked':'')+'> Concluir sessão</label></div></div></details>'
 }).join("");
 host.querySelectorAll("[data-done]").forEach(el=>el.addEventListener("change",e=>{state.done[e.target.dataset.done]=e.target.checked;save();renderTheory();updateProgress()}));
 host.querySelectorAll("[data-q]").forEach(el=>el.addEventListener("click",e=>{state.quiz[e.currentTarget.dataset.q]=Number(e.currentTarget.dataset.o);save();renderTheory()}));
 const restoreScroll=()=>{if(scrollBox)scrollBox.scrollTop=scrollTop;else try{window.scrollTo(0,scrollTop)}catch(_){}};
 if(typeof requestAnimationFrame==="function")requestAnimationFrame(restoreScroll);else setTimeout(restoreScroll,0);
}
function normalizeRounds(){if(!state.tec||typeof state.tec!=="object")state.tec={};if(!Array.isArray(state.tec.rounds))state.tec.rounds=[];while(state.tec.rounds.length<3)state.tec.rounds.push({pct:"",done:false});state.tec.rounds=state.tec.rounds.slice(0,3).map(r=>({pct:r&&r.pct!==undefined?r.pct:"",done:!!(r&&r.done)}))}
function renderTec(){
 normalizeRounds();const host=document.getElementById("m17Tec");if(!host)return;const c=resolveTec();
 const rounds=state.tec.rounds.map((r,i)=>'<div class="round"><div><b>Rodada '+(i+1)+'</b><div class="small">Registre seu percentual de acerto.</div></div><label><input data-pct="'+i+'" type="number" min="0" max="100" step="1" value="'+esc(r.pct)+'" placeholder="%">%</label><label><input data-rdone="'+i+'" type="checkbox" '+(r.done?'checked':'')+'> Feita</label></div>').join("");
 host.innerHTML='<div class="tecgrid"><div class="teccard"><span class="label">Caderno real validado na Central</span><h2>'+esc(c.nome)+'</h2><p><b>'+esc(c.questoes)+'</b> questões no cadastro da Central • '+esc(c.grupoNome||"Língua Portuguesa")+'</p><p class="small">ID '+esc(c.id)+' • conferido em produção em 17/09/2026. O M17 usa este caderno porque ele cobre diretamente tipologia e gêneros; não foi criado um ID fictício “port-17”.</p><button id="openTec" class="tecbtn" type="button">Abrir caderno no TEC ↗</button></div><div class="teccard"><span class="label">3 rodadas</span>'+rounds+'</div></div>';
 const b=document.getElementById("openTec");if(b)b.addEventListener("click",()=>window.open(c.url,"_blank","noopener"));
 host.querySelectorAll("[data-pct]").forEach(el=>el.addEventListener("change",e=>{const i=Number(e.target.dataset.pct);let v=e.target.value===""?"":Math.max(0,Math.min(100,Number(e.target.value)));state.tec.rounds[i].pct=v;save();renderTec()}));
 host.querySelectorAll("[data-rdone]").forEach(el=>el.addEventListener("change",e=>{state.tec.rounds[Number(e.target.dataset.rdone)].done=e.target.checked;save()}));
}
document.querySelectorAll(".tab").forEach(b=>b.addEventListener("click",()=>{document.querySelectorAll(".tab").forEach(x=>x.classList.toggle("active",x===b));document.querySelectorAll(".panel").forEach(x=>x.classList.toggle("active",x.id===b.dataset.tab));if(b.dataset.tab==="tec")renderTec()}));
const themeBtn=document.getElementById("themeBtn");if(themeBtn)themeBtn.addEventListener("click",()=>{const dark=matchMedia("(prefers-color-scheme: dark)").matches;state.theme=state.theme==="auto"?(dark?"light":"dark"):state.theme==="light"?"dark":"auto";save();applyTheme();themeBtn.textContent=state.theme==="auto"?"Tema: auto":"Tema: "+state.theme});
applyTheme();if(themeBtn)themeBtn.textContent=state.theme==="auto"?"Tema: auto":"Tema: "+state.theme;
renderTheory();renderTec();updateProgress();
window.__PT_M17_AUDIT__=function(){const c=resolveTec();return{guard:!!window.__PORTUGUES_M17_RUNTIME_V1__,key:KEY,sessionCount:SESSIONS.length,uniqueSessionIds:new Set(SESSIONS.map(s=>s.id)).size===SESSIONS.length,sessionIds:SESSIONS.map(s=>s.id),tecId:c.id,tecName:c.nome,tecQuestions:c.questoes,tecUrl:c.url,tecValid:validTec(c),progressKeysTouched:[KEY],hasThreeTecRounds:state.tec.rounds.length===3,method:"FINALIDADE → TRAÇOS PREDOMINANTES → ORGANIZAÇÃO → MARCAS LINGUÍSTICAS → TIPO PRINCIPAL → CONFIRMAÇÃO"}};
})();
