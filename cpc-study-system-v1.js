/* CPC Study System v1 — staging
   Nova arquitetura de estudo para Direito Processual Civil.
   Não apaga nem migra dados legados; usa namespace próprio.
*/
(function(global){
'use strict';

const KEY='central-v6:cpc-study-v1';
const M01={
  id:'w1',
  module:'M01',
  title:'Normas fundamentais, fontes, aplicação e direito intertemporal',
  summaryUrl:'https://drive.google.com/file/d/1L7MyxtUOND57JHnGBjb4HiLX5TkJE3xp/view?usp=drivesdk',
  fullUrl:'https://drive.google.com/file/d/1Af-NiQTt92QpM3yTT8nPPlS7wpB-PR7W/view?usp=drivesdk',
  mapUrl:'tools/cpc-m01-mapa.html',
  summaryParts:[
    'Visão geral',
    'Teoria essencial',
    'Artigos para decorar',
    'Pegadinhas de prova',
    'Revisão ativa'
  ],
  fullParts:[
    'Visão geral, matriz e leitura orientada',
    'Constitucionalização e devido processo legal',
    'Inércia, acesso à justiça e sistema multiportas',
    'Duração razoável, boa-fé, cooperação, paridade e art. 8º',
    'Contraditório: arts. 9º e 10',
    'Publicidade, fundamentação e ordem cronológica',
    'Fontes e precedentes qualificados',
    'Interpretação, integração e equidade',
    'Aplicação territorial e direito intertemporal — arts. 13 a 15',
    'Ponte para M02: jurisdição, ação, arbitragem e cooperação internacional',
    'Jurisprudência e atualizações legislativas',
    'Exemplos, pegadinhas, decore e revisão final'
  ]
};

const DIFF={easy:'Fácil',medium:'Média',hard:'Difícil'};
let quizSession=null;

function fresh(){return {modules:{},quizAnswers:{},external:{}}}
function load(){
  try{return Object.assign(fresh(),JSON.parse(localStorage.getItem(KEY)||'{}'))}
  catch(_){return fresh()}
}
function save(st){localStorage.setItem(KEY,JSON.stringify(st))}
function moduleState(id){
  const st=load(); st.modules=st.modules||{};
  const x=st.modules[id]||{};
  x.map=!!x.map; x.decorando=!!x.decorando;
  x.summaryReads=x.summaryReads||{};
  x.fullReads=x.fullReads||{};
  st.modules[id]=x; save(st); return x;
}
function updateModule(id,patch){
  const st=load();st.modules=st.modules||{};
  st.modules[id]=Object.assign({},st.modules[id]||{},patch);
  save(st);try{renderAll()}catch(_){try{renderSubjects()}catch(__){}}
}
function toggleRead(id,track,index,value){
  const st=load(),m=st.modules[id]||{},k=track==='summary'?'summaryReads':'fullReads';
  m[k]=m[k]||{};m[k][index]=!!value;st.modules[id]=m;save(st);
  try{renderAll()}catch(_){renderSubjects?.()}
}
function extState(id){
  const st=load();st.external=st.external||{};
  const x=st.external[id]||{done:0,correct:0};
  return {done:Math.max(0,Number(x.done)||0),correct:Math.max(0,Number(x.correct)||0)}
}
function setExternal(id){
  const done=Math.max(0,parseInt(document.getElementById('cpc-ext-done-'+id)?.value||'0',10)||0);
  let correct=Math.max(0,parseInt(document.getElementById('cpc-ext-correct-'+id)?.value||'0',10)||0);
  correct=Math.min(correct,done);
  const st=load();st.external=st.external||{};st.external[id]={done,correct};save(st);
  try{renderAll()}catch(_){renderSubjects?.()}
}
function quizKey(id,track,qid){return id+':'+track+':'+qid}
function answerState(id,track,qid){return load().quizAnswers?.[quizKey(id,track,qid)]||null}
function answeredCount(id,track,list){return list.filter(q=>!!answerState(id,track,q.id)).length}

function complexity(q){
  const prompt=String(q.q||''),opts=(q.o||[]).join(' ');
  let s=prompt.length+Math.round(opts.length*.18);
  if(/\bI\.|\bII\.|\bIII\.|considere|assertiv|itens/i.test(prompt))s+=120;
  if(/ajuizou|ingressou|pretende|processo|sentença|tribunal|juiz|autor|réu/i.test(prompt))s+=45;
  if(/jurisprud|STJ|STF|tema|súmula|precedente/i.test(prompt+' '+(q.subject||'')))s+=75;
  return s;
}
function cpcWeeks(){return Array.isArray(global.__CPC_WEEKS)?global.__CPC_WEEKS:[]}
function cpcPoolSafe(w){try{return typeof global.__cpcPool==='function'?global.__cpcPool(w):[]}catch(_){return []}}
function legacyId(id){return id==='w1'?'cpc1':id}
function studyId(id){return id==='cpc1'?'w1':id}
function localOpenKey(id){return 'central-v6:cpc-open:'+id}
function localNoteKey(id){return 'central-v6:cpc-note:'+id}
function bucketed(id){
  const w=cpcWeeks().find(x=>x.id===legacyId(id));
  if(!w)return {easy:[],medium:[],hard:[]};
  const pool=cpcPoolSafe(w).filter(q=>q&&Array.isArray(q.o)&&q.o.length>=4).slice().sort((a,b)=>complexity(a)-complexity(b));
  const n=pool.length,a=Math.max(1,Math.floor(n/3)),b=Math.max(a+1,Math.floor(n*2/3));
  return {easy:pool.slice(0,a),medium:pool.slice(a,b),hard:pool.slice(b)};
}
function pick(list,n,seed){
  const a=list.slice();let h=2166136261;
  for(const c of String(seed))h=(Math.imul(h^c.charCodeAt(0),16777619))>>>0;
  return a.map((q,i)=>({q,k:(h^Math.imul(i+1,2654435761))>>>0})).sort((x,y)=>x.k-y.k).slice(0,n).map(x=>x.q);
}
function internalQuestions(id,track){
  const b=bucketed(id),need=track==='summary'?{easy:2,medium:2,hard:1}:{easy:4,medium:4,hard:2};
  const out=[];
  for(const level of ['easy','medium','hard']){
    let src=b[level],chosen=pick(src,need[level],id+track+level);
    chosen.forEach(q=>out.push(Object.assign({},q,{_difficulty:level})));
  }
  // complete lacunas com o pool geral sem repetir, se um terço ficou pequeno
  const target=track==='summary'?5:10;
  if(out.length<target){
    const w=cpcWeeks().find(x=>x.id===legacyId(id)),pool=w?cpcPoolSafe(w):[];
    const used=new Set(out.map(q=>q.id));
    for(const q of pick(pool.filter(q=>!used.has(q.id)),target-out.length,id+track+'fill')){
      out.push(Object.assign({},q,{_difficulty:out.length<Math.ceil(target*.4)?'easy':out.length<Math.ceil(target*.8)?'medium':'hard'}));
    }
  }
  // garante a proporção visual pedida, preservando as questões escolhidas
  const labels=track==='summary'
    ? ['easy','easy','medium','medium','hard']
    : ['easy','easy','easy','easy','medium','medium','medium','medium','hard','hard'];
  return out.slice(0,target).map((q,i)=>Object.assign({},q,{_difficulty:labels[i]}));
}
function quizDone(id,track){
  const list=internalQuestions(id,track);return list.length>0&&answeredCount(id,track,list)===list.length;
}

function nativeChapterCount(mode){
 const ids=mode==='summary'?['s1','s2','s3','s4','s5']:['c1','c2','c3','c4','c5','c6','c7','c8','c9','c10','c11','c12'];
 const prefix='central-v6:native-reader:cpc:cpc1:chapter:'+mode+':';
 return {done:ids.filter(id=>localStorage.getItem(prefix+id)==='1').length,total:ids.length};
}
function progress(id){
 id=studyId(id);
 if(id!=='w1')return 0;
 const m=moduleState(id),sq=internalQuestions(id,'summary'),fq=internalQuestions(id,'full');
 const sr=nativeChapterCount('summary'),fr=nativeChapterCount('complete');
 const total=1+sr.total+sq.length+fr.total+fq.length+1;
 let done=(m.map?1:0)+sr.done+answeredCount(id,'summary',sq)+fr.done+answeredCount(id,'full',fq)+(m.decorando?1:0);
 return total?Math.round(done/total*100):0;
}
function progressDetail(id){
 id=studyId(id);
 const m=moduleState(id),sq=internalQuestions(id,'summary'),fq=internalQuestions(id,'full');
 const sr=nativeChapterCount('summary'),fr=nativeChapterCount('complete');
 return {
   pct:progress(id),map:m.map?1:0,
   summaryRead:sr.done,summaryTotal:sr.total,
   summaryQuiz:answeredCount(id,'summary',sq),summaryQuizTotal:sq.length,
   fullRead:fr.done,fullTotal:fr.total,
   fullQuiz:answeredCount(id,'full',fq),fullQuizTotal:fq.length,
   decorando:m.decorando?1:0
 };
}

function esc(s){return String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function openUrl(u){try{if(typeof global.openExternalUrl==='function')global.openExternalUrl(u);else window.open(u,'_blank','noopener')}catch(_){window.open(u,'_blank','noopener')}}

function injectStyle(){
 if(document.getElementById('cpc-study-v1-style'))return;
 const s=document.createElement('style');s.id='cpc-study-v1-style';s.textContent=`
 .bc-cpc-map-card{display:none!important}
 .cpc-study-intro{display:flex;align-items:center;justify-content:space-between;gap:14px;padding:14px;border:1px solid rgba(56,189,248,.28);border-radius:14px;background:rgba(56,189,248,.07);margin-bottom:12px}
 .cpc-study-intro h3{margin:0 0 3px;font-size:15px}.cpc-study-intro p{margin:0;color:var(--muted);font-size:11.5px;line-height:1.45}
 .cpc-study-pct{font-size:25px;font-weight:950;color:#38bdf8;white-space:nowrap}
 .cpc-study-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px;margin:12px 0}
 .cpc-study-card{border:1px solid var(--line);border-radius:13px;background:var(--soft,#0b1525);overflow:hidden}
 .cpc-study-card.map{border-color:rgba(56,189,248,.38)}.cpc-study-card.summary{border-color:rgba(34,197,94,.33)}.cpc-study-card.full{border-color:rgba(124,92,255,.36)}
 .cpc-study-cover{height:126px;display:flex;align-items:center;justify-content:center;background:linear-gradient(145deg,rgba(56,189,248,.16),rgba(124,92,255,.10));font-size:42px}
 .cpc-study-cover iframe{width:100%;height:100%;border:0;pointer-events:none;background:#eef4fb}
 .cpc-study-card-body{padding:12px}.cpc-study-card-body small{font-size:9px;font-weight:900;letter-spacing:.08em;color:var(--muted)}
 .cpc-study-card-body h4{margin:4px 0 5px;font-size:13px}.cpc-study-card-body p{margin:0 0 10px;color:var(--muted);font-size:10.5px;line-height:1.45}
 .cpc-study-actions{display:flex;gap:6px;flex-wrap:wrap}.cpc-study-actions .cf-btn{flex:1 1 120px}
 .cpc-reading{margin-top:9px;border-top:1px solid var(--line);padding-top:9px}.cpc-reading summary{cursor:pointer;font-size:10.5px;font-weight:850;color:var(--muted)}
 .cpc-checks{display:grid;gap:5px;margin-top:8px}.cpc-check{display:flex;gap:8px;align-items:flex-start;padding:7px 8px;border:1px solid var(--line);border-radius:9px;background:rgba(255,255,255,.025);font-size:10.5px;line-height:1.35}
 .cpc-check input{margin-top:2px;accent-color:#13bd6b}
 .cpc-bottom-grid{display:grid;grid-template-columns:minmax(0,1fr) minmax(280px,.7fr);gap:10px;margin:10px 0}
 .cpc-mini-panel{border:1px solid var(--line);border-radius:12px;padding:12px;background:var(--soft,#0b1525)}
 .cpc-mini-panel h4{margin:0 0 5px;font-size:12px}.cpc-mini-panel p{margin:0;color:var(--muted);font-size:10.5px;line-height:1.45}
 .cpc-external-form{display:grid;grid-template-columns:1fr 1fr auto;gap:7px;margin-top:9px}.cpc-external-form label{font-size:9px;color:var(--muted);font-weight:800}.cpc-external-form input{width:100%;min-height:38px;background:var(--panel2);border:1px solid var(--line2);color:var(--text);border-radius:8px;padding:7px}
 .cpc-ext-score{margin-top:8px;font-size:11px}.cpc-progress-row{display:grid;grid-template-columns:repeat(5,1fr);gap:6px;margin:10px 0}.cpc-progress-chip{border:1px solid var(--line);border-radius:9px;padding:7px 8px;text-align:center;background:rgba(255,255,255,.025)}.cpc-progress-chip b{display:block;font-size:12px}.cpc-progress-chip small{font-size:8.5px;color:var(--muted)}
 .cpc-q-overlay{position:fixed;inset:0;z-index:2147483600;background:rgba(3,8,20,.86);display:flex;align-items:stretch;justify-content:center;padding:12px}
 .cpc-q-shell{width:min(100%,920px);height:100%;background:var(--bg);color:var(--text);border:1px solid var(--line);border-radius:18px;overflow:hidden;display:flex;flex-direction:column}
 .cpc-q-head{padding:13px 15px;border-bottom:1px solid var(--line);display:flex;gap:12px;align-items:center;background:var(--panel)}.cpc-q-head div{flex:1}.cpc-q-head b{font-size:14px}.cpc-q-head small{display:block;color:var(--muted);font-size:10px;margin-top:2px}.cpc-q-head button{border:1px solid var(--line2);background:var(--panel2);color:var(--text);border-radius:9px;padding:8px 11px;font-weight:800}
 .cpc-q-body{padding:16px;overflow:auto;flex:1}.cpc-q-meta{display:flex;gap:6px;flex-wrap:wrap;margin-bottom:10px}.cpc-q-chip{font-size:9px;font-weight:850;padding:4px 7px;border-radius:999px;border:1px solid var(--line2);color:var(--muted)}.cpc-q-body h3{font-size:16px;line-height:1.5;margin:0 0 12px}
 .cpc-q-options{display:grid;gap:8px}.cpc-q-opt{display:grid;grid-template-columns:28px 1fr;gap:8px;align-items:start;text-align:left;border:1px solid var(--line2);background:var(--panel2);color:var(--text);border-radius:10px;padding:10px;cursor:pointer}.cpc-q-opt .l{width:24px;height:24px;border-radius:7px;display:grid;place-items:center;background:rgba(124,92,255,.15);font-size:10px;font-weight:900}.cpc-q-opt.sel{border-color:#7c5cff}.cpc-q-opt.ok{border-color:#13bd6b;background:rgba(19,189,107,.10)}.cpc-q-opt.bad{border-color:#ef4444;background:rgba(239,68,68,.10)}
 .cpc-q-feedback{margin-top:10px;border:1px solid var(--line);border-radius:10px;padding:10px;font-size:11px;line-height:1.5}.cpc-q-foot{display:flex;gap:8px;align-items:center;justify-content:space-between;padding:12px 15px;border-top:1px solid var(--line);background:var(--panel)}.cpc-q-foot .cf-btn{min-width:110px}
 @media(max-width:900px){.cpc-study-grid{grid-template-columns:1fr}.cpc-study-cover{height:190px}.cpc-bottom-grid{grid-template-columns:1fr}.cpc-progress-row{grid-template-columns:1fr 1fr}.cpc-external-form{grid-template-columns:1fr 1fr}.cpc-external-form .cf-btn{grid-column:1/-1}}
 @media(max-width:680px){.cpc-q-overlay{padding:0}.cpc-q-shell{border-radius:0}.cpc-study-cover{height:230px}.cpc-study-intro{align-items:flex-start}.cpc-study-pct{font-size:22px}}
 `;document.head.appendChild(s)
}

function checklist(id,track,parts,checked){
 return '<details class="cpc-reading"><summary>Leitura por blocos · '+Object.values(checked||{}).filter(Boolean).length+'/'+parts.length+'</summary><div class="cpc-checks">'+
   parts.map((p,i)=>'<label class="cpc-check"><input type="checkbox" '+(checked?.[i]?'checked':'')+' onchange="cpcStudyToggleRead(\''+id+'\',\''+track+'\','+i+',this.checked)"><span><b>Bloco '+(i+1)+'</b> · '+esc(p)+'</span></label>').join('')+
   '</div></details>';
}
function quizStatus(id,track){
 const list=internalQuestions(id,track),n=answeredCount(id,track,list),done=list.length&&n===list.length;
 return {list,n,done,label:n+'/'+list.length+' respondidas'};
}

function m01Html(w){
 const m=moduleState('w1'),d=progressDetail('w1'),ext=extState('w1'),sq=quizStatus('w1','summary'),fq=quizStatus('w1','full');
 const acc=ext.done?Math.round(ext.correct/ext.done*1000)/10:0;
 const open=localStorage.getItem(localOpenKey(w.id))==='1';
 return `<section class="cf-module ${open?'open':''}" data-cf="${w.id}">
  <button class="cf-module-head" onclick="toggleCpcModule('${w.id}')">
   <span class="cf-module-no">MÓDULO ${w.num}</span><span class="cf-module-title">${esc(w.title)}</span>
   <span class="cf-module-stat">Cobertura ${d.pct}% · externas ${ext.done?acc+'%':'—'}</span><span class="chev">⌄</span>
  </button>
  <div class="cf-module-body">
   <div class="cf-module-bar"><span style="width:${d.pct}%"></span></div>

   <section class="bc-native-metrics" aria-label="Indicadores do módulo">
    <article class="bc-native-metric-card"><div class="bc-native-ring" style="--pct:${d.pct}"><div class="bc-native-ring-inner"><b>${d.pct}%</b><span>teoria</span></div></div><div class="bc-native-metric-copy"><small>COBERTURA DA TEORIA</small><strong>${d.summaryRead+d.summaryQuiz+d.fullRead+d.fullQuiz+d.map+d.decorando} pontos concluídos</strong><span>Leitura + questões internas + mapa + Decorando.</span></div></article>
    <article class="bc-native-metric-card"><div class="bc-native-ring" style="--pct:${ext.done?acc:0}"><div class="bc-native-ring-inner"><b>${ext.done?acc+'%':'—'}</b><span>externas</span></div></div><div class="bc-native-metric-copy"><small>ACERTO EM QUESTÕES EXTERNAS</small><strong>${ext.done?ext.correct+' acertos em '+ext.done:'Nenhuma questão externa registrada'}</strong><span>Este indicador não altera a cobertura da teoria.</span></div></article>
   </section>

   <section class="bc-native-materials bc-native-materials-static">
    <div class="bc-native-materials-head"><div><b>Materiais do módulo</b><small>Escolha como estudar e volte sempre ao M01.</small></div><small>CPC M01 • conteúdo nativo</small></div>
    <div class="bc-native-material-grid">
      <button type="button" class="bc-native-material-card" onclick="CpcNativeReader.open('summary')"><span class="bc-native-material-icon">⚡</span><span><strong>Conteúdo resumido</strong><small>Leitura incorporada ao site, 5 capítulos, retomada automática e busca.</small></span><span class="bc-native-material-action"><span>${d.summaryRead}/${d.summaryTotal} capítulos</span><span>→</span></span></button>
      <button type="button" class="bc-native-material-card" onclick="CpcNativeReader.open('complete')"><span class="bc-native-material-icon">📚</span><span><strong>Conteúdo completo</strong><small>Teoria integral convertida do PDF para página de estudo nativa.</small></span><span class="bc-native-material-action"><span>${d.fullRead}/${d.fullTotal} capítulos</span><span>→</span></span></button>
      <button type="button" class="bc-native-material-card" onclick="baseCompletaOpenCpcMap()"><span class="bc-native-material-icon">🧠</span><span><strong>Mapa mental</strong><small>Carrossel de revisão rápida. Use como complemento, não como tela principal de estudo.</small></span><span class="bc-native-material-action"><span>${m.map?'✓ Concluído':'Abrir carrossel'}</span><span>→</span></span></button>
    </div>
   </section>

   <section class="cpc-study-intro" style="margin-top:12px"><div><h3>Fixação interna</h3><p>As questões ficam separadas da leitura para não quebrar seu fluxo de estudo.</p></div><div class="cpc-study-actions"><button class="cf-btn ${sq.done?'good':''}" onclick="cpcStudyOpenQuiz('w1','summary')">5 do resumido · ${sq.n}/${sq.list.length}</button><button class="cf-btn ${fq.done?'good':''}" onclick="cpcStudyOpenQuiz('w1','full')">10 do completo · ${fq.n}/${fq.list.length}</button></div></section>

   <div class="cpc-bottom-grid">
    <section class="cpc-mini-panel"><h4>⚖️ Decorando a Lei</h4><p>Artigos do módulo. Entra na cobertura quando você concluir.</p><div class="cpc-study-actions" style="margin-top:9px"><button class="cf-btn primary" onclick="openLeiSecaEnxuta(null,'cpc','cpc-m01')">Abrir Decorando</button><button class="cf-btn ${m.decorando?'good':''}" onclick="cpcStudySetModule('w1',{decorando:${!m.decorando}})">${m.decorando?'✓ Concluído':'Marcar concluído'}</button></div></section>
    <section class="cpc-mini-panel"><h4>🎯 Questões externas</h4><p>Registro separado da cobertura da teoria.</p><div class="cpc-external-form"><label>Feitas<input id="cpc-ext-done-w1" type="number" min="0" value="${ext.done}"></label><label>Acertos<input id="cpc-ext-correct-w1" type="number" min="0" value="${ext.correct}"></label><button class="cf-btn" onclick="cpcStudySaveExternal('w1')">Salvar</button></div><div class="cpc-ext-score"><b>${ext.done?acc+'%':'—'}</b> · ${ext.correct} acertos · ${Math.max(0,ext.done-ext.correct)} erros</div></section>
   </div>

   <details class="cf-resources"><summary class="muted small" style="cursor:pointer">Ferramentas e anotações</summary><div class="cf-resource-grid" style="margin-top:8px">
    <div class="cf-resource-box"><h4>Cadernos TEC</h4><button class="cf-btn" onclick="centralSidebarAction('tec-cadernos',this)">Abrir cadernos</button></div>
    <div class="cf-resource-box"><h4>Vade Mecum</h4><button class="cf-btn" onclick="openEmbeddedTool('vade',{},this)">Abrir Vade Mecum</button></div>
    <div class="cf-resource-box" style="grid-column:1/-1"><h4>Anotações do módulo</h4><textarea class="cf-notes" id="cf-note-${w.id}" placeholder="Regra, artigo, pegadinha ou dúvida...">${esc(localStorage.getItem(localNoteKey(w.id))||'')}</textarea><div class="cf-actions"><button class="cf-btn" onclick="saveCpcNote('${w.id}')">Salvar anotação</button></div></div>
   </div></details>
  </div>
 </section>`;
}

function openQuiz(id,track){
 const list=internalQuestions(id,track);
 const target=track==='summary'?5:10;
 if(list.length<target){alert('Banco interno ainda não tem questões suficientes para esta etapa.');return false}
 quizSession={id,track,list,index:0,selected:null,submitted:false};
 renderQuiz();return false;
}
function closeQuiz(){document.getElementById('cpcStudyQuizOverlay')?.remove();quizSession=null;document.documentElement.style.overflow='';document.body.style.overflow=''}
function renderQuiz(){
 if(!quizSession)return;
 injectStyle();
 let ov=document.getElementById('cpcStudyQuizOverlay');if(!ov){ov=document.createElement('div');ov.id='cpcStudyQuizOverlay';ov.className='cpc-q-overlay';document.body.appendChild(ov)}
 const q=quizSession.list[quizSession.index],saved=answerState(quizSession.id,quizSession.track,q.id);
 quizSession.selected=null;quizSession.submitted=!!saved;
 const current=saved?.selected;
 const letters=['A','B','C','D','E'];
 const options=(q.o||[]).map((txt,i)=>{
   let cls='cpc-q-opt';
   if(current===i)cls+=' sel';
   if(saved&&i===q.a)cls+=' ok';
   else if(saved&&i===current&&current!==q.a)cls+=' bad';
   return '<button class="'+cls+'" '+(saved?'disabled':'')+' onclick="cpcStudySelectQuiz('+i+')"><span class="l">'+letters[i]+'</span><span>'+esc(txt)+'</span></button>';
 }).join('');
 const n=answeredCount(quizSession.id,quizSession.track,quizSession.list);
 ov.innerHTML='<section class="cpc-q-shell"><header class="cpc-q-head"><div><b>'+M01.module+' · '+(quizSession.track==='summary'?'Fixação do resumido':'Fixação do completo')+'</b><small>'+n+'/'+quizSession.list.length+' respondidas · a conclusão conta no progresso, o acerto não</small></div><button onclick="cpcStudyCloseQuiz()">✕ Fechar</button></header><main class="cpc-q-body"><div class="cpc-q-meta"><span class="cpc-q-chip">'+DIFF[q._difficulty]+'</span><span class="cpc-q-chip">'+esc(q.bankLabel||'Questão do banco interno')+'</span></div><h3>'+esc(q.q)+'</h3><div class="cpc-q-options">'+options+'</div>'+(saved?'<div class="cpc-q-feedback"><b>'+(saved.correct?'✓ Correto':'✕ Incorreto · gabarito '+letters[q.a])+'</b><div style="margin-top:5px">'+esc(q.e||'Revise o ponto correspondente no módulo.')+'</div></div>':'')+'</main><footer class="cpc-q-foot"><button class="cf-btn" onclick="cpcStudyMoveQuiz(-1)" '+(quizSession.index===0?'disabled':'')+'>← Anterior</button><span class="muted small">'+(quizSession.index+1)+' / '+quizSession.list.length+'</span>'+(saved?'<button class="cf-btn primary" onclick="cpcStudyMoveQuiz(1)">'+(quizSession.index+1===quizSession.list.length?'Concluir':'Próxima →')+'</button>':'<button class="cf-btn primary" id="cpcStudySubmitBtn" disabled onclick="cpcStudySubmitQuiz()">Responder</button>')+'</footer></section>';
 document.documentElement.style.overflow='hidden';document.body.style.overflow='hidden';
}
function selectQuiz(i){if(!quizSession)return;quizSession.selected=i;document.querySelectorAll('.cpc-q-opt').forEach((b,n)=>b.classList.toggle('sel',n===i));const bt=document.getElementById('cpcStudySubmitBtn');if(bt)bt.disabled=false}
function submitQuiz(){
 if(!quizSession||quizSession.selected==null)return;
 const q=quizSession.list[quizSession.index],st=load();st.quizAnswers=st.quizAnswers||{};
 st.quizAnswers[quizKey(quizSession.id,quizSession.track,q.id)]={selected:quizSession.selected,correct:quizSession.selected===q.a,at:Date.now()};
 save(st);renderQuiz();try{renderAll()}catch(_){}
}
function moveQuiz(delta){
 if(!quizSession)return;
 const ni=quizSession.index+delta;
 if(ni>=quizSession.list.length){closeQuiz();try{renderAll()}catch(_){renderSubjects?.()}return}
 if(ni<0)return;quizSession.index=ni;renderQuiz()
}

function studyRenderMaster(){
 injectStyle();
 const w=cpcWeeks().find(x=>x.id==='cpc1');
 if(!w)return '<div class="card" style="padding:18px">CPC M01 indisponível no momento.</div>';
 return '<div class="cpc-study-only-badge" style="margin:0 0 10px;padding:10px 12px;border:1px solid rgba(56,189,248,.32);border-radius:12px;background:rgba(56,189,248,.07)"><b>Novo CPC</b><div class="muted small" style="margin-top:3px">O conteúdo anterior foi removido. Esta disciplina agora usa somente a nova estrutura.</div></div><div id="cpc-session-host"></div><div class="cf-modules">'+m01Html(w)+'</div>';
}

function install(){
 injectStyle();
 if(typeof renderCpcModule!=='function'||typeof cpcWeekPct!=='function'||typeof renderCpcMaster!=='function'){
   setTimeout(install,120);
   return;
 }
 if(global.CpcStudyV1&&global.CpcStudyV1.installed)return;

 if(!global.__cpcLegacyRenderModule)global.__cpcLegacyRenderModule=renderCpcModule;
 if(!global.__cpcLegacyWeekPct)global.__cpcLegacyWeekPct=cpcWeekPct;
 if(!global.__cpcLegacyRenderMaster)global.__cpcLegacyRenderMaster=renderCpcMaster;

 global.renderCpcModule=function(w){
   if(w&&w.id==='cpc1')return m01Html(w);
   return '';
 };

 global.cpcWeekPct=function(w){
   if(w&&w.id==='cpc1')return progress('w1');
   return 0;
 };

 global.renderCpcMaster=studyRenderMaster;

 global.CpcStudyV1=Object.assign(global.CpcStudyV1||{}, {
   progress,progressDetail,state:load,renderMaster:studyRenderMaster,version:'2026-10-03-staging-m01-v4',installed:true
 });

 try{
   localStorage.setItem('central-v6:open:cpc','1');
   renderAll();
   setTimeout(()=>{
     try{
       const section=document.querySelector('.subject[data-id="cpc"]');
       if(section&&!section.classList.contains('open'))section.classList.add('open');
     }catch(_){}
   },50);
 }catch(e){console.warn('CPC Study v1 render',e)}
}

global.cpcStudyToggleRead=toggleRead;
global.cpcStudySetModule=updateModule;
global.cpcStudySaveExternal=setExternal;
global.cpcStudyOpenUrl=openUrl;
global.cpcStudyOpenQuiz=openQuiz;
global.cpcStudyCloseQuiz=closeQuiz;
global.cpcStudySelectQuiz=selectQuiz;
global.cpcStudySubmitQuiz=submitQuiz;
global.cpcStudyMoveQuiz=moveQuiz;
global.CpcStudyV1=Object.assign(global.CpcStudyV1||{},{progress,progressDetail,state:load,renderMaster:studyRenderMaster,refresh:()=>{try{renderAll()}catch(_){try{renderSubjects()}catch(__){}}},version:'2026-10-03-native-m01-v5'});

global.addEventListener('message',e=>{
  try{
    if(e.origin!==location.origin)return;
    if(e.data&&e.data.type==='cpc-map-complete'&&e.data.module==='w1'){
      const m=moduleState('w1');
      if(!m.map)updateModule('w1',{map:true});
    }
  }catch(_){}
});
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(install,20),{once:true});setTimeout(install,20);setTimeout(install,500);
})(window);
