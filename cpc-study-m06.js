(function(g){
'use strict';
const SID='w6',LEG='cpc6',KEY='central-v6:cpc-study-v1';
let quiz=null;
const weeks=()=>Array.isArray(g.__CPC_WEEKS)?g.__CPC_WEEKS:[];
const week=()=>weeks().find(x=>x.id===LEG);
function state(){try{return Object.assign({modules:{},quizAnswers:{},external:{}},JSON.parse(localStorage.getItem(KEY)||'{}'))}catch(_){return {modules:{},quizAnswers:{},external:{}}}}
function save(s){localStorage.setItem(KEY,JSON.stringify(s))}
function mod(){const s=state();s.modules=s.modules||{};s.modules[SID]=Object.assign({map:false,decorando:false},s.modules[SID]||{});save(s);return s.modules[SID]}
function setMod(p){const s=state();s.modules=s.modules||{};s.modules[SID]=Object.assign({},s.modules[SID]||{},p);save(s);refresh()}
function ext(){const x=state().external?.[SID]||{};return {done:Math.max(0,+x.done||0),correct:Math.max(0,+x.correct||0)}}
function saveExt(){const d=Math.max(0,+document.getElementById('cpc-ext-done-w6')?.value||0),c=Math.min(d,Math.max(0,+document.getElementById('cpc-ext-correct-w6')?.value||0));const s=state();s.external=s.external||{};s.external[SID]={done:d,correct:c};save(s);refresh()}
function pool(){const w=week();return w&&g.__cpcPool?g.__cpcPool(w).filter(q=>q&&Array.isArray(q.o)&&q.o.length>=4):[]}
function score(q){let n=String(q.q||'').length+(q.o||[]).join(' ').length*.15;if(/STJ|STF|tema|súmula|precedente|jurisprud/i.test((q.q||'')+' '+(q.subject||'')))n+=80;if(/I\.|II\.|III\.|assertiv|considere/i.test(q.q||''))n+=90;return n}
function questions(track){
 const p=pool().slice().sort((a,b)=>score(a)-score(b)),n=p.length,a=Math.max(1,Math.floor(n/3)),b=Math.max(a+1,Math.floor(n*2/3));
 const groups=[p.slice(0,a),p.slice(a,b),p.slice(b)],need=track==='summary'?[2,2,1]:[4,4,2],out=[];
 groups.forEach((grp,gi)=>grp.slice(0,need[gi]).forEach(q=>out.push(Object.assign({},q,{_d:['Fácil','Média','Difícil'][gi]}))));
 const target=track==='summary'?5:10,used=new Set(out.map(q=>q.id));
 for(const q of p){if(out.length>=target)break;if(!used.has(q.id)){used.add(q.id);out.push(Object.assign({},q,{_d:'Média'}))}}
 return out.slice(0,target);
}
function akey(track,id){return SID+':'+track+':'+id}
function answer(track,id){return state().quizAnswers?.[akey(track,id)]||null}
function answered(track){return questions(track).filter(q=>answer(track,q.id)).length}
function native(track){return g.CpcM06NativeReader?.stats?g.CpcM06NativeReader.stats(track):{done:0,total:track==='summary'?5:15,pct:0}}
function detail(){
 const m=mod(),sr=native('summary'),fr=native('complete'),sq=questions('summary').length,fq=questions('full').length;
 const done=(m.map?1:0)+sr.done+answered('summary')+fr.done+answered('full')+(m.decorando?1:0),total=1+sr.total+sq+fr.total+fq+1;
 return {m,sr,fr,sq:answered('summary'),sqt:sq,fq:answered('full'),fqt:fq,pct:total?Math.round(done/total*100):0};
}
function esc(s){return String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function openMap(){
 if(document.getElementById('bcCpcM06MapOverlay'))return false;
 const o=document.createElement('div');o.id='bcCpcM06MapOverlay';o.className='bc-cpc-map-overlay';
 o.innerHTML='<div class="bc-cpc-map-overlay-head"><div><b>CPC M06 — Mapa Mental</b><span>Carrossel de fixação e revisão rápida</span></div><button class="bc-cpc-map-close" onclick="cpcM06CloseMap()">← Voltar ao M06</button></div><iframe class="bc-cpc-map-frame" src="tools/cpc-m06-mapa.html" title="Mapa mental CPC M06"></iframe>';
 document.body.appendChild(o);document.documentElement.style.overflow='hidden';document.body.style.overflow='hidden';return false;
}
function closeMap(){document.getElementById('bcCpcM06MapOverlay')?.remove();document.documentElement.style.overflow='';document.body.style.overflow='';setTimeout(()=>document.querySelector('[data-cf="cpc6"]')?.scrollIntoView({behavior:'smooth',block:'start'}),40);return false}
function render(w){
 const d=detail(),x=ext(),acc=x.done?Math.round(x.correct/x.done*1000)/10:0,open=localStorage.getItem('central-v6:cpc-open:'+LEG)==='1';
 return `<section class="cf-module ${open?'open':''}" data-cf="cpc6"><button class="cf-module-head" onclick="toggleCpcModule('cpc6')"><span class="cf-module-no">MÓDULO 6</span><span class="cf-module-title">${esc(w?.title||'Juiz, auxiliares da justiça, Ministério Público, Advocacia Pública e Defensoria Pública')}</span><span class="cf-module-stat">Cobertura ${d.pct}% · externas ${x.done?acc+'%':'—'}</span><span class="chev">⌄</span></button><div class="cf-module-body">
 <div class="cf-module-bar"><span style="width:${d.pct}%"></span></div>
 <section class="bc-native-metrics"><article class="bc-native-metric-card"><div class="bc-native-ring" style="--pct:${d.pct}"><div class="bc-native-ring-inner"><b>${d.pct}%</b><span>teoria</span></div></div><div class="bc-native-metric-copy"><small>COBERTURA DA TEORIA</small><strong>M06 em andamento</strong><span>Leitura + fixação interna + mapa + Decorando.</span></div></article><article class="bc-native-metric-card"><div class="bc-native-ring" style="--pct:${x.done?acc:0}"><div class="bc-native-ring-inner"><b>${x.done?acc+'%':'—'}</b><span>externas</span></div></div><div class="bc-native-metric-copy"><small>ACERTO EM QUESTÕES EXTERNAS</small><strong>${x.done?x.correct+' acertos em '+x.done:'Nenhuma questão externa registrada'}</strong><span>Não altera a cobertura da teoria.</span></div></article></section>
 <section class="bc-native-materials bc-native-materials-static"><div class="bc-native-materials-head"><div><b>Materiais do módulo</b><small>Leitura incorporada + revisão rápida.</small></div><small>CPC M06 • conteúdo nativo</small></div><div class="bc-native-material-grid">
 <button class="bc-native-material-card" onclick="CpcM06NativeReader.open('summary')"><span class="bc-native-material-icon">⚡</span><span><strong>Conteúdo resumido</strong><small>5 capítulos, busca e retomada automática.</small></span><span class="bc-native-material-action"><span>${d.sr.done}/${d.sr.total} capítulos</span><span>→</span></span></button>
 <button class="bc-native-material-card" onclick="CpcM06NativeReader.open('complete')"><span class="bc-native-material-icon">📚</span><span><strong>Conteúdo completo</strong><small>Teoria integral em 15 blocos de estudo.</small></span><span class="bc-native-material-action"><span>${d.fr.done}/${d.fr.total} capítulos</span><span>→</span></span></button>
 <button class="bc-native-material-card" onclick="cpcM06OpenMap()"><span class="bc-native-material-icon">🧠</span><span><strong>Mapa mental</strong><small>Carrossel complementar com retorno direto ao M06.</small></span><span class="bc-native-material-action"><span>${d.m.map?'✓ Concluído':'Abrir carrossel'}</span><span>→</span></span></button></div></section>
 <section class="cpc-study-intro" style="margin-top:12px"><div><h3>Fixação interna</h3><p>Questões separadas da leitura.</p></div><div class="cpc-study-actions"><button class="cf-btn ${d.sq===d.sqt?'good':''}" onclick="cpcM06Quiz('summary')">5 do resumido · ${d.sq}/${d.sqt}</button><button class="cf-btn ${d.fq===d.fqt?'good':''}" onclick="cpcM06Quiz('full')">10 do completo · ${d.fq}/${d.fqt}</button></div></section>
 <div class="cpc-bottom-grid"><section class="cpc-mini-panel"><h4>⚖️ Decorando a Lei</h4><p>Artigos do M06. Entra na cobertura.</p><div class="cpc-study-actions" style="margin-top:9px"><button class="cf-btn primary" onclick="openLeiSecaEnxuta(null,'cpc','cpc-m06')">Abrir Decorando</button><button class="cf-btn ${d.m.decorando?'good':''}" onclick="cpcM06Set({decorando:${!d.m.decorando}})">${d.m.decorando?'✓ Concluído':'Marcar concluído'}</button></div></section>
 <section class="cpc-mini-panel"><h4>🎯 Questões externas</h4><p>Desempenho separado da teoria.</p><div class="cpc-external-form"><label>Feitas<input id="cpc-ext-done-w6" type="number" min="0" value="${x.done}"></label><label>Acertos<input id="cpc-ext-correct-w6" type="number" min="0" value="${x.correct}"></label><button class="cf-btn" onclick="cpcM06SaveExternal()">Salvar</button></div><div class="cpc-ext-score"><b>${x.done?acc+'%':'—'}</b> · ${x.correct} acertos · ${Math.max(0,x.done-x.correct)} erros</div></section></div>
 </div></section>`;
}
function openQuiz(track){const list=questions(track);if(!list.length){alert('Banco de questões do M06 ainda não carregou.');return}quiz={track,list,index:0,selected:null};drawQuiz()}
function drawQuiz(){
 if(!quiz)return;let o=document.getElementById('cpcM06Quiz');if(!o){o=document.createElement('div');o.id='cpcM06Quiz';o.className='cpc-q-overlay';document.body.appendChild(o)}
 const q=quiz.list[quiz.index],a=answer(quiz.track,q.id),L=['A','B','C','D','E'];
 o.innerHTML='<section class="cpc-q-shell"><header class="cpc-q-head"><div><b>CPC M06 · Fixação</b><small>'+answered(quiz.track)+'/'+quiz.list.length+' respondidas</small></div><button onclick="cpcM06CloseQuiz()">✕ Fechar</button></header><main class="cpc-q-body"><div class="cpc-q-meta"><span class="cpc-q-chip">'+q._d+'</span></div><h3>'+esc(q.q)+'</h3><div class="cpc-q-options">'+q.o.map((t,i)=>'<button class="cpc-q-opt '+(a&&i===q.a?'ok':a&&i===a.selected&&i!==q.a?'bad':'')+'" '+(a?'disabled':'')+' onclick="cpcM06Select('+i+')"><span class="l">'+L[i]+'</span><span>'+esc(t)+'</span></button>').join('')+'</div>'+(a?'<div class="cpc-q-feedback"><b>'+(a.correct?'✓ Correto':'✕ Incorreto · gabarito '+L[q.a])+'</b><div style="margin-top:5px">'+esc(q.e||'Revise o ponto no módulo.')+'</div></div>':'')+'</main><footer class="cpc-q-foot"><button class="cf-btn" onclick="cpcM06Move(-1)" '+(quiz.index===0?'disabled':'')+'>← Anterior</button><span class="muted small">'+(quiz.index+1)+' / '+quiz.list.length+'</span>'+(a?'<button class="cf-btn primary" onclick="cpcM06Move(1)">'+(quiz.index+1===quiz.list.length?'Concluir':'Próxima →')+'</button>':'<button id="cpcM06Submit" class="cf-btn primary" disabled onclick="cpcM06Submit()">Responder</button>')+'</footer></section>';
 document.documentElement.style.overflow='hidden';document.body.style.overflow='hidden';
}
function select(i){if(!quiz)return;quiz.selected=i;document.querySelectorAll('#cpcM06Quiz .cpc-q-opt').forEach((b,n)=>b.classList.toggle('sel',n===i));const bt=document.getElementById('cpcM06Submit');if(bt)bt.disabled=false}
function submit(){if(!quiz||quiz.selected==null)return;const q=quiz.list[quiz.index],s=state();s.quizAnswers=s.quizAnswers||{};s.quizAnswers[akey(quiz.track,q.id)]={selected:quiz.selected,correct:quiz.selected===q.a};save(s);quiz.selected=null;drawQuiz();refresh()}
function move(n){if(!quiz)return;const i=quiz.index+n;if(i>=quiz.list.length){closeQuiz();refresh();return}if(i<0)return;quiz.index=i;quiz.selected=null;drawQuiz()}
function closeQuiz(){document.getElementById('cpcM06Quiz')?.remove();quiz=null;document.documentElement.style.overflow='';document.body.style.overflow=''}
function refresh(){try{renderAll()}catch(_){try{renderSubjects()}catch(__){}}}
function install(){
 if(!g.CpcStudyV1||!week()){setTimeout(install,120);return}
 if(g.CpcStudyM06?.installed)return;
 const prevMaster=g.CpcStudyV1.renderMaster,prevProgress=g.CpcStudyV1.progress;
 g.CpcStudyV1.progress=id=>(id===LEG||id===SID)?detail().pct:prevProgress(id);
 g.CpcStudyV1.renderMaster=function(){const base=prevMaster(),w=week();const pos=base.lastIndexOf('</div>');return pos>=0?base.slice(0,pos)+render(w)+base.slice(pos):base+render(w)};
 g.CpcStudyM06={installed:true,progress:()=>detail().pct};refresh();
}
g.cpcM06OpenMap=openMap;g.cpcM06CloseMap=closeMap;g.cpcM06Set=setMod;g.cpcM06SaveExternal=saveExt;g.cpcM06Quiz=openQuiz;g.cpcM06Select=select;g.cpcM06Submit=submit;g.cpcM06Move=move;g.cpcM06CloseQuiz=closeQuiz;
g.addEventListener('message',e=>{if(e.origin===location.origin&&e.data?.type==='cpc-map-complete'&&e.data?.module==='w6'&&!mod().map)setMod({map:true})});
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(install,0),{once:true});else setTimeout(install,0);
})(window);