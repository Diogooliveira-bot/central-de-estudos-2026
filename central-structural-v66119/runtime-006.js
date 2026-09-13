const CPC_STORAGE_KEY='cpc_tjce_fcc_guided_v34';
const CPC_LEGACY_STORAGE_KEY='cpc_tjce_fcc_guided_v33';
const CPC_LETTERS=['A','B','C','D','E'];
let cpcSession=null;

function cpcFresh(){return {answers:{},weeks:{},lastWeek:'w1'}}
function cpcState(){
 try{
   const raw=localStorage.getItem(CPC_STORAGE_KEY)||localStorage.getItem(CPC_LEGACY_STORAGE_KEY)||'{}';
   return {...cpcFresh(),...JSON.parse(raw)};
 }catch(e){return cpcFresh()}
}
function cpcSave(st){localStorage.setItem(CPC_STORAGE_KEY,JSON.stringify(st))}
function cpcWeekState(id){
 const st=cpcState(),x=st.weeks?.[id]||{};
 ['diagnostic','reading','theory','intermediate','deep','fixation'].forEach(k=>{if(typeof x[k]!=='boolean')x[k]=false});
 return x;
}
function cpcUpdateWeek(id,patch){
 const st=cpcState();st.weeks=st.weeks||{};st.weeks[id]={...(st.weeks[id]||{}),...patch};st.lastWeek=id;cpcSave(st);renderAll();
}
function cpcWeekPct(w){
 const st=cpcWeekState(w.id),keys=['diagnostic','reading','theory','intermediate','deep','fixation'];
 return Math.round(keys.filter(k=>st[k]).length/keys.length*100);
}
function cpcPool(w){return CPC_QUESTIONS.filter(q=>w.topics.includes(q.t))}
function cpcStats(){
 const st=cpcState();let answered=0,correct=0,wrongIds=[];
 CPC_QUESTIONS.forEach(q=>{
   const a=st.answers?.[q.id];
   if(a?.attempts){answered++;if(a.lastCorrect)correct++;if(a.everWrong&&!a.lastCorrect)wrongIds.push(q.id)}
 });
 return {answered,correct,wrongIds,accuracy:answered?Math.round(correct/answered*1000)/10:0};
}
function cpcModuleErrors(w){const ids=new Set(cpcStats().wrongIds);return cpcPool(w).filter(q=>ids.has(q.id))}
function cpcModuleOpenKey(id){return `central-v6:cpc-open:${id}`}
function toggleCpcModule(id){
 const el=document.querySelector(`.cf-module[data-cf="${id}"]`);if(!el)return;
 const open=!el.classList.contains('open');el.classList.toggle('open',open);localStorage.setItem(cpcModuleOpenKey(id),open?'1':'0');
 if(open){const w=CPC_WEEKS.find(x=>x.id===id);if(w)saveLast({cpcWeek:id,title:`Processo Civil • Módulo ${w.num} • ${w.title}`,at:Date.now()})}
}
function openCpcLast(id){
 openHome();localStorage.setItem('central-v6:open:cpc','1');localStorage.setItem(cpcModuleOpenKey(id),'1');
 setTimeout(()=>{renderSubjects();document.querySelector(`.cf-module[data-cf="${id}"]`)?.scrollIntoView({behavior:'smooth',block:'start'})},40);
}
function cpcDeterministic(list,count,seed){
 if(!list.length)return[];
 const st=cpcState(),unseen=list.filter(q=>!st.answers?.[q.id]?.attempts),seen=list.filter(q=>st.answers?.[q.id]?.attempts),src=[...unseen,...seen];
 let h=2166136261;for(const c of String(seed))h=(Math.imul(h^c.charCodeAt(0),16777619))>>>0;
 return src.map((q,i)=>({q,k:(h^(Math.imul(i+1,2654435761)))>>>0})).sort((a,b)=>a.k-b.k).slice(0,Math.min(count,src.length)).map(x=>x.q);
}
function cpcOptionOrder(q,mode){
 const st=cpcState(),a=[0,1,2,3,4];let h=2166136261;
 const seed=q.id+':'+(st.answers?.[q.id]?.attempts||0)+':'+mode;
 for(const c of seed)h=(Math.imul(h^c.charCodeAt(0),16777619))>>>0;
 for(let i=a.length-1;i>0;i--){h=(Math.imul(h^(h>>>13),1597334677))>>>0;const j=h%(i+1);[a[i],a[j]]=[a[j],a[i]]}
 return a;
}
function cpcSourceKind(q){return q.real===false?'AUTORAL • cobertura do edital':'FCC real'}
function cpcLegalUpdate(q){
 if(q.update)return q.update;
 return '';
}
const CPC_ANKI={"cpc1":"PROCESSO CIVIL::01 NORMAS FUNDAMENTAIS, FONTES E APLICAÇÃO","cpc2":"PROCESSO CIVIL::02 JURISDIÇÃO, AÇÃO, PROCESSO E PRESSUPOSTOS","cpc3":"PROCESSO CIVIL::03 COMPETÊNCIA, CONEXÃO E CONFLITOS","cpc4":"PROCESSO CIVIL::04 PARTES, PROCURADORES, DESPESAS E GRATUIDADE","cpc5":"PROCESSO CIVIL::05 LITISCONSÓRCIO E INTERVENÇÃO DE TERCEIROS","cpc6":"PROCESSO CIVIL::06 JUIZ, AUXILIARES, MP, ADVOCACIA E DEFENSORIA","cpc7":"PROCESSO CIVIL::07 ATOS PROCESSUAIS, NEGÓCIOS E PRAZOS","cpc8":"PROCESSO CIVIL::08 COMUNICAÇÃO DOS ATOS E NULIDADES","cpc9":"PROCESSO CIVIL::09 TUTELA PROVISÓRIA","cpc10":"PROCESSO CIVIL::10 FORMAÇÃO, SUSPENSÃO E PETIÇÃO INICIAL","cpc11":"PROCESSO CIVIL::11 DEFESA, REVELIA, SANEAMENTO E JULGAMENTO","cpc12":"PROCESSO CIVIL::12 PROVAS","cpc13":"PROCESSO CIVIL::13 SENTENÇA, REMESSA, COISA JULGADA E LIQUIDAÇÃO","cpc14":"PROCESSO CIVIL::14 CUMPRIMENTO DE SENTENÇA","cpc15":"PROCESSO CIVIL::15 RECURSOS, PRECEDENTES E REPETITIVOS","cpc16":"PROCESSO CIVIL::16 EXECUÇÃO, TÍTULOS, OBRIGAÇÕES E FAZENDA","cpc17":"PROCESSO CIVIL::17 PENHORA, EXPROPRIAÇÃO E EMBARGOS","cpc18":"PROCESSO CIVIL::18 PROCEDIMENTOS ESPECIAIS PREVISTOS","cpc19":"PROCESSO CIVIL::19 AÇÕES COLETIVAS, CONSTITUCIONAIS E CONTROLE","cpc20":"PROCESSO CIVIL::20 TRIBUNAIS, RESCISÓRIA, IAC, IRDR E RECLAMAÇÃO"};
function cpcResKey(id){return `central-v6:cpc-res:${id}`}
function cpcResources(id){try{return JSON.parse(localStorage.getItem(cpcResKey(id))||'{}')}catch(e){return {}}}
function editCpcResource(id,kind){
 const r=cpcResources(id),v=prompt(`Cole o link de ${kind==='tec'?'TEC Concursos':'QConcursos'}:`,r[kind]||'https://');
 if(v===null)return;const value=v.trim();if(!value){r[kind]='';localStorage.setItem(cpcResKey(id),JSON.stringify(r));renderSubjects();return}
 const u=safeUrl(value);if(!u){alert('Link inválido.');return}r[kind]=u;localStorage.setItem(cpcResKey(id),JSON.stringify(r));renderSubjects();
}
function openCpcResource(id,kind){const r=cpcResources(id),u=safeUrl(r[kind]);if(u)openExternalUrl(u);else editCpcResource(id,kind)}
function cpcNoteKey(id){return `central-v6:cpc-note:${id}`}
function saveCpcNote(id){const el=document.getElementById(`cf-note-${id}`);if(!el)return;localStorage.setItem(cpcNoteKey(id),el.value);alert('Anotação salva.')}
function cpcStep(n,title,desc,done,body){
 return `<section class="cf-step ${done?'done':''}"><div class="cf-step-head"><div class="cf-step-no">${done?'✓':n}</div><div class="cf-step-copy"><b>${title}</b><small>${desc}</small></div></div><div class="cf-step-body">${body}</div></section>`;
}
function renderCpcMaster(){
 const st=cpcStats(),real=CPC_QUESTIONS.filter(q=>q.real!==false).length,ined=CPC_QUESTIONS.length-real;
 return `<div class="cf-master-tools">
   <button onclick="renderCpcErrorPanel()">⚠ Erros ${st.wrongIds.length?`(${st.wrongIds.length})`:''}</button>
   <button onclick="exportCpcProgress()">💾 Backup</button>
   <button onclick="document.getElementById('cpc-import-file').click()">↥ Restaurar</button>
   <input class="cf-file" id="cpc-import-file" type="file" accept=".json,application/json" onchange="importCpcProgress(this)">
 </div>
 <div class="cf-metrics">
   <div class="cf-metric"><small>Banco do curso</small><b>${CPC_QUESTIONS.length}</b></div>
   <div class="cf-metric"><small>Respondidas</small><b>${st.answered}</b></div>
   <div class="cf-metric"><small>Aproveitamento</small><b>${st.answered?st.accuracy+'%':'—'}</b></div>
   <div class="cf-metric"><small>Erros pendentes</small><b>${st.wrongIds.length}</b></div>
 </div>
 <div id="cpc-session-host"></div>
 <div id="cpc-errors-host"></div>
 <div class="cf-modules">${CPC_WEEKS.map(renderCpcModule).join('')}</div>`;
}
function cpcDecorandoButton(w,resource=false){
 if(w.editalModule==='cpc-m19')return '<span class="muted small">Sem artigos relacionados mapeados no Decorando.</span>';
 return `<button class="cf-btn${resource?'':' primary'}" onclick="openLeiSecaEnxuta(null,'cpc','${w.editalModule}')">${resource?'Abrir artigos deste módulo':'📖 Decorando deste módulo'}</button>`;
}
function renderCpcModule(w){
 const ws=cpcWeekState(w.id),pct=cpcWeekPct(w),pool=cpcPool(w),real=pool.filter(q=>q.real!==false),ined=pool.filter(q=>q.real===false),errors=cpcModuleErrors(w);
 const open=localStorage.getItem(cpcModuleOpenKey(w.id))==='1';
 const diag=Math.min(5,real.length),inter=Math.min(8,real.length),finalN=Math.min(15,real.length),extra=real.length,r=cpcResources(w.id),tecAuto=(typeof window.tecContextButtons==='function'?window.tecContextButtons(w.id,'cf-btn'):'');
 return `<section class="cf-module ${open?'open':''}" data-cf="${w.id}">
   <button class="cf-module-head" onclick="toggleCpcModule('${w.id}')">
     <span class="cf-module-no">MÓDULO ${w.num}</span><span class="cf-module-title">${esc(w.title)}</span>
     <span class="cf-module-stat">${pct}% • ${real.length} FCC reais</span><span class="chev">⌄</span>
   </button>
   <div class="cf-module-body">
     <div class="cf-module-bar"><span style="width:${pct}%"></span></div>
     <div class="cf-subtitle">${esc(w.subtitle)}</div>
     <details class="cf-syllabus"><summary>Matriz do edital • ${w.outline.length} pontos</summary><div class="cf-micro-grid">${w.outline.map(x=>`<span class="cf-micro">${esc(x)}</span>`).join('')}</div></details>
     ${w.questionGaps?.length?`<aside class="cpc-coverage-warning"><div class="cpc-warning-title">⚠ Complementação externa de questões</div><p>O banco FCC local não cobre suficientemente: <b>${w.questionGaps.map(esc).join("; ")}</b>.</p><p>A teoria e a leitura esquematizada abaixo cobrem todo o conteúdo. Faça questões adicionais desses pontos no TEC ou QConcursos.</p></aside>`:``}
     <div class="cf-steps">
       ${cpcStep(1,'Diagnóstico','Questões FCC antes da teoria.',ws.diagnostic,real.length?`<button class="cf-btn primary" onclick="startCpcQuiz('${w.id}','diagnostic',${diag})">${ws.diagnostic?'Refazer diagnóstico':'Começar '+diag+' FCC'}</button>`:`<span class="muted small">Sem questões reais suficientes.</span>`)}
       ${cpcStep(2,'Leitura orientada','Dispositivos e pontos para observar na legislação processual civil.',ws.reading,`<div class="cf-reading"><strong>${esc(w.read)}</strong><ul>${w.read_focus.map(x=>`<li>${esc(x)}</li>`).join('')}</ul></div>${(w.lawScheme||[]).length?`<div class="cpc-law-heading"><b>Lei seca esquematizada</b><span>${w.lawScheme.length} blocos de leitura</span></div><div class="cpc-law-grid">${w.lawScheme.map((item,i)=>`<article class="cpc-law-card"><div class="cpc-law-kicker">BLOCO ${i+1}</div><h4>${esc(item.title)}</h4><strong>${esc(item.articles)}</strong><ul>${item.checkpoints.map(point=>`<li>${esc(point)}</li>`).join('')}</ul></article>`).join('')}</div>`:``}<div class="cf-actions">${cpcDecorandoButton(w)}<button class="cf-btn" onclick="openVadeMecum(null,'cpc')">Abrir Vade Mecum CPC</button><button class="cf-btn ${ws.reading?'good':''}" onclick="cpcUpdateWeek('${w.id}',{reading:${!ws.reading}})">${ws.reading?'✓ Concluída':'Marcar concluída'}</button></div>`)}
       ${cpcStep(3,'Teoria nuclear','Base completa antes da segunda bateria.',ws.theory,`<div class="cf-theory-grid">${w.theory.map((t,i)=>`<details class="cf-theory" ${i===0?'open':''}><summary>${esc(t[0])}</summary><div class="cf-theory-text">${esc(t[1])}</div></details>`).join('')}</div><div class="cf-actions"><button class="cf-btn ${ws.theory?'good':''}" onclick="cpcUpdateWeek('${w.id}',{theory:${!ws.theory}})">${ws.theory?'✓ Teoria concluída':'Marcar teoria concluída'}</button></div>`)}
       ${cpcStep(4,'Questões intermediárias','Bateria curta depois da teoria.',ws.intermediate,real.length?`<button class="cf-btn primary" onclick="startCpcQuiz('${w.id}','intermediate',${inter})">${ws.intermediate?'Refazer '+inter+' FCC':'Fazer '+inter+' FCC'}</button>`:`<span class="muted small">Sem fila real suficiente.</span>`)}
       ${cpcStep(5,'Aprofundamento FCC','Distinções, exceções e pegadinhas de nível mais alto.',ws.deep,`<div class="cf-advanced-grid">${w.advanced.map(t=>`<div class="cf-advanced"><b>${esc(t[0])}</b><div>${esc(t[1])}</div></div>`).join('')}</div><div class="cf-actions"><button class="cf-btn ${ws.deep?'good':''}" onclick="cpcUpdateWeek('${w.id}',{deep:${!ws.deep}})">${ws.deep?'✓ Aprofundamento concluído':'Marcar aprofundamento concluído'}</button></div>`)}
       ${cpcStep(6,'Bateria final FCC','Misture literalidade, exceções e casos concretos.',ws.fixation,`<div class="cf-actions">${real.length?`<button class="cf-btn primary" onclick="startCpcQuiz('${w.id}','fixation',${finalN})">FCC real • ${finalN}</button>${extra>finalN?`<button class="cf-btn" onclick="startCpcQuiz('${w.id}','extra',${extra})">Banco completo • ${extra}</button>`:''}`:''}${ined.length?`<button class="cf-btn" onclick="startCpcQuiz('${w.id}','coverage',${Math.min(15,ined.length)})">Cobertura inédita • ${Math.min(15,ined.length)}</button>`:''}</div><div class="cf-coverage">${real.length} questões FCC reais neste módulo. Os pontos sem cobertura local estão no aviso acima.</div>`)}
       ${cpcStep(7,'Revisão de erros',errors.length?`${errors.length} erro(s) pendente(s) neste módulo.`:'Nenhum erro pendente.',errors.length===0,errors.length?`<button class="cf-btn bad" onclick="startCpcQuiz('${w.id}','errors',999)">Refazer ${errors.length} erro(s)</button>`:`<span class="muted small">A fila fica vazia quando a questão é acertada novamente.</span>`)}
     </div>
     <details class="cf-resources"><summary class="muted small" style="cursor:pointer">Recursos do módulo • TEC/QC, Anki e anotações</summary>
       <div class="cf-resource-grid" style="margin-top:8px">
         <div class="cf-resource-box"><h4>Questões externas</h4><div class="cf-actions">${tecAuto}${r.tec?`<button class="cf-btn" onclick="openCpcResource('${w.id}','tec')">TEC personalizado ↗</button>`:(tecAuto?'':`<button class="cf-btn" onclick="openCpcResource('${w.id}','tec')">+ TEC</button>`)}<button class="cf-btn" onclick="openCpcResource('${w.id}','qc')">${r.qc?'Abrir QC':'+ QC'}</button></div></div>
         <div class="cf-resource-box"><h4>Decorando a Lei</h4>${cpcDecorandoButton(w,true)}</div>
         <div class="cf-resource-box"><h4>Anki</h4>${CPC_ANKI[w.id]?`<button class="cf-btn" onclick="openAnkiDeck('${escJs(CPC_ANKI[w.id])}','${escJs(w.title)}')">Abrir baralho</button>`:'<span class="muted small">Sem subbaralho específico mapeado.</span>'}</div>
         <div class="cf-resource-box" style="grid-column:1/-1"><h4>Anotação</h4><textarea class="cf-notes" id="cf-note-${w.id}" placeholder="Regra, artigo, pegadinha ou dúvida...">${esc(localStorage.getItem(cpcNoteKey(w.id))||'')}</textarea><div class="cf-actions"><button class="cf-btn" onclick="saveCpcNote('${w.id}')">Salvar anotação</button></div></div>
       </div>
     </details>
   </div>
 </section>`;
}
function startCpcQuiz(id,mode,count){
 const w=CPC_WEEKS.find(x=>x.id===id);if(!w)return;
 let list=cpcPool(w),st=cpcState();
 if(mode==='errors')list=list.filter(q=>st.answers?.[q.id]?.everWrong&&!st.answers?.[q.id]?.lastCorrect);
 else if(mode==='coverage')list=list.filter(q=>q.real===false);
 else {const real=list.filter(q=>q.real!==false);if(real.length)list=real}
 if(!list.length){alert('Não há questões nessa fila.');return}
 list=cpcDeterministic(list,Math.min(count,list.length),id+mode+Object.keys(st.answers||{}).length);
 cpcSession={week:w,mode,list,index:0,score:0,errors:[],answered:false,order:null};
 localStorage.setItem('central-v6:open:cpc','1');localStorage.setItem(cpcModuleOpenKey(id),'1');
 renderCpcQuestion();
}
function cpcModeName(mode){return ({diagnostic:'Diagnóstico',intermediate:'Questões intermediárias',fixation:'Bateria final FCC',extra:'Bateria extra',coverage:'Cobertura inédita',errors:'Revisão de erros'})[mode]||'Questões'}
function renderCpcQuestion(){
 if(!cpcSession)return;const host=document.getElementById('cpc-session-host');if(!host)return;
 const q=cpcSession.list[cpcSession.index];cpcSession.answered=false;cpcSession.order=cpcOptionOrder(q,cpcSession.mode);
 const legal=cpcLegalUpdate(q);
 host.innerHTML=`<section class="cf-session">
   <div class="cf-session-head"><div><b>${cpcModeName(cpcSession.mode)} • Módulo ${cpcSession.week.num}</b><br><span class="muted small">${esc(cpcSession.week.title)}</span></div><button class="pt-inline-close" onclick="closeCpcSession()">✕ fechar</button></div>
   <div class="cf-session-body">
     <div class="cf-qtop"><span>${cpcSession.index+1}/${cpcSession.list.length}</span><span>${cpcSourceKind(q)}</span></div>
     <div class="cf-qbar"><span style="width:${((cpcSession.index)/cpcSession.list.length)*100}%"></span></div>
     <article class="cf-question">
       <div class="cf-qmeta"><span class="cf-chip">${cpcSourceKind(q)}</span><span class="cf-chip">${esc(q.subject||cpcSession.week.title)}</span>${legal?'<span class="cf-chip">⚠ atualização</span>':''}</div>
       <h3>${esc(q.q)}</h3>
       <div class="cf-options">${cpcSession.order.map((orig,display)=>`<div class="cf-option-row"><button class="cf-option" data-cf-opt="${orig}" onclick="answerCpcQuestion(${orig})"><span class="cf-letter">${CPC_LETTERS[display]}</span><span>${esc(q.o[orig])}</span></button><button class="cf-strike" data-cf-strike="${orig}" onclick="toggleCpcStrike(${orig})">S̶</button></div>`).join('')}</div>
       <div id="cf-feedback"></div><div class="cf-actions" style="justify-content:flex-end"><button id="cf-next" class="cf-btn primary hidden" onclick="nextCpcQuestion()">${cpcSession.index+1===cpcSession.list.length?'Ver resultado':'Próxima questão'}</button></div>
     </article>
   </div>
 </section>`;
 host.scrollIntoView({behavior:'smooth',block:'start'});
}
function toggleCpcStrike(i){
 if(!cpcSession||cpcSession.answered)return;
 document.querySelector(`[data-cf-opt="${i}"]`)?.classList.toggle('struck');
 document.querySelector(`[data-cf-strike="${i}"]`)?.classList.toggle('active');
}
function answerCpcQuestion(i){
 if(!cpcSession||cpcSession.answered)return;cpcSession.answered=true;
 const q=cpcSession.list[cpcSession.index],ok=i===q.a,st=cpcState(),prev=st.answers?.[q.id]||{attempts:0,everWrong:false,lastCorrect:false};
 prev.attempts++;prev.lastCorrect=ok;prev.everWrong=prev.everWrong||!ok;prev.lastAt=Date.now();st.answers=st.answers||{};st.answers[q.id]=prev;cpcSave(st);
 if(ok)cpcSession.score++;else cpcSession.errors.push(q.id);
 document.querySelectorAll('[data-cf-opt]').forEach(b=>{const orig=Number(b.dataset.cpcOpt);b.disabled=true;if(orig===q.a)b.classList.add('correct');if(orig===i&&!ok)b.classList.add('wrong')});
 document.querySelectorAll('[data-cf-strike]').forEach(b=>b.disabled=true);
 const correctDisplay=cpcSession.order.indexOf(q.a),legal=cpcLegalUpdate(q),fb=document.getElementById('cf-feedback');
 const perAlt=Array.isArray(q.oe)?`<details style="margin-top:8px"><summary style="cursor:pointer;font-weight:800">Análise das alternativas</summary><div style="margin-top:6px">${cpcSession.order.map((orig,disp)=>`<div style="border-top:1px solid rgba(255,255,255,.08);padding:6px 0"><b>${CPC_LETTERS[disp]} • ${orig===q.a?'CORRETA':'ERRADA'}</b><br>${esc(q.oe[orig]||'')}</div>`).join('')}</div></details>`:'';
 fb.className=`cf-feedback ${ok?'good':'bad'}`;fb.innerHTML=`<b>${ok?'Correto.':'Incorreto. Gabarito: '+CPC_LETTERS[correctDisplay]}</b><div style="margin-top:5px">${esc(q.e||'Revise o ponto correspondente no módulo.')}</div>${legal?`<div class="cf-update"><b>Atualização jurídica:</b> ${esc(legal)}</div>`:''}${perAlt}<div class="cf-source">${esc(q.r||q.source||'Banco FCC')}${q.url?` • <a href="${escAttr(q.url)}" target="_blank" rel="noopener">abrir no TEC ↗</a>`:''}</div>`;
 document.getElementById('cf-next').classList.remove('hidden');renderSummary();
}
function nextCpcQuestion(){
 if(!cpcSession||!cpcSession.answered)return;
 if(cpcSession.index+1<cpcSession.list.length){cpcSession.index++;renderCpcQuestion()}else finishCpcQuiz();
}
function finishCpcQuiz(){
 const sess=cpcSession,w=sess.week,st=cpcState();st.weeks=st.weeks||{};const ws=st.weeks[w.id]||{};
 if(sess.mode==='diagnostic')ws.diagnostic=true;if(sess.mode==='intermediate')ws.intermediate=true;if(sess.mode==='fixation')ws.fixation=true;
 st.weeks[w.id]=ws;st.lastWeek=w.id;cpcSave(st);
 const total=sess.list.length,pct=Math.round(sess.score/total*100),host=document.getElementById('cpc-session-host');
 host.innerHTML=`<section class="cf-session"><div class="cf-session-head"><b>${cpcModeName(sess.mode)} concluído</b><button class="pt-inline-close" onclick="closeCpcSession()">✕</button></div><div class="cf-session-body cf-result"><div class="cf-score">${pct}%</div><div class="cf-result-grid"><div><b>${sess.score}</b><small>acertos</small></div><div><b>${total-sess.score}</b><small>erros</small></div><div><b>${cpcWeekPct(w)}%</b><small>módulo</small></div></div><div class="cf-actions" style="justify-content:center"><button class="cf-btn primary" onclick="closeCpcSession();openCpcLast('${w.id}')">Voltar ao módulo</button>${sess.errors.length?`<button class="cf-btn bad" onclick="startCpcQuiz('${w.id}','errors',999)">Refazer erros</button>`:''}</div></div></section>`;
 renderAll();localStorage.setItem('central-v6:open:cpc','1');localStorage.setItem(cpcModuleOpenKey(w.id),'1');
 setTimeout(()=>{const h=document.getElementById('cpc-session-host');if(h)h.innerHTML=host.innerHTML},0);
}
function closeCpcSession(){cpcSession=null;const h=document.getElementById('cpc-session-host');if(h)h.innerHTML=''}
function renderCpcErrorPanel(){
 const host=document.getElementById('cpc-errors-host');if(!host)return;
 const ids=new Set(cpcStats().wrongIds),list=CPC_QUESTIONS.filter(q=>ids.has(q.id));
 if(!list.length){host.innerHTML='<div class="cf-error-panel"><b>Nenhum erro pendente.</b></div>';return}
 const weak={};list.forEach(q=>{const k=q.subject||'Assunto';weak[k]=(weak[k]||0)+1});
 const top=Object.entries(weak).sort((a,b)=>b[1]-a[1]).slice(0,6);
 host.innerHTML=`<div class="cf-error-panel"><div style="display:flex;justify-content:space-between;gap:8px"><div><b>Caderno automático de erros</b><div class="muted small">${list.length} questão(ões) pendente(s)</div></div><button class="pt-inline-close" onclick="document.getElementById('cpc-errors-host').innerHTML=''">✕</button></div><div class="cf-micro-grid">${top.map(([x,n])=>`<span class="cf-micro">${esc(x)} • ${n}</span>`).join('')}</div><div class="cf-actions"><button class="cf-btn bad" onclick="startCpcGlobalErrors()">Refazer todos</button></div>${CPC_WEEKS.map(w=>{const n=cpcModuleErrors(w).length;return n?`<div class="cf-error-row"><b>Módulo ${w.num} • ${esc(w.title)}</b><small>${n} erro(s)</small><div class="cf-actions"><button class="cf-btn" onclick="startCpcQuiz('${w.id}','errors',999)">Revisar módulo</button></div></div>`:''}).join('')}</div>`;
 host.scrollIntoView({behavior:'smooth',block:'start'});
}
function startCpcGlobalErrors(){
 const st=cpcState(),list=CPC_QUESTIONS.filter(q=>st.answers?.[q.id]?.everWrong&&!st.answers?.[q.id]?.lastCorrect);if(!list.length)return;
 cpcSession={week:CPC_WEEKS[0],mode:'errors',list:cpcDeterministic(list,list.length,'global-errors'),index:0,score:0,errors:[],answered:false,order:null};renderCpcQuestion();
}
function exportCpcProgress(){
 const payload={app:'Processo Civil FCC',version:'3.4-central',exportedAt:new Date().toISOString(),storageKey:CPC_STORAGE_KEY,state:cpcState()};
 const blob=new Blob([JSON.stringify(payload,null,2)],{type:'application/json'}),url=URL.createObjectURL(blob),a=document.createElement('a');
 a.href=url;a.download=`backup-cpc-${todayISO()}.json`;a.click();setTimeout(()=>URL.revokeObjectURL(url),500);
}
async function importCpcProgress(input){
 const file=input.files?.[0];if(!file)return;
 try{const obj=JSON.parse(await file.text()),st=obj.state||obj;if(!st.answers||!st.weeks)throw new Error();if(!confirm('Restaurar este progresso de Processo Civil?'))return;cpcSave({...cpcFresh(),...st});renderAll();alert('Progresso restaurado.')}catch(e){alert('Backup inválido.')}input.value='';
}



function ptDayKey(week,day,kind){return `central-v6:pt:w${week}:d${day}:${kind}`}
function getPtModuleState(){
 try{return JSON.parse(localStorage.getItem('dominio_portugues_site_v01')||'{}')}catch(e){return {}}
}
function ptAutoTaskDone(week,day,kind){
 if(week!==1)return false;
 const state=getPtModuleState();
 const split=PT_CONFIG.week1Splits[String(day)]||PT_CONFIG.week1Splits[day];
 if(!split)return false;
 if(kind==='pre')return split.pre.length>0 && split.pre.every(id=>state.answers && state.answers[id]);
 if(kind==='post')return split.post.length>0 && split.post.every(id=>state.answers && state.answers[id]);
 if(kind==='theory' && day<=6)return !!(state.theoryCompleted && state.theoryCompleted[String(day)]);
 return false;
}
function ptTaskDone(week,day,kind){
 return ptAutoTaskDone(week,day,kind) || localStorage.getItem(ptDayKey(week,day,kind))==='1';
}
function ptSetTask(week,day,kind,value){
 if(ptAutoTaskDone(week,day,kind))return;
 localStorage.setItem(ptDayKey(week,day,kind),value?'1':'0');
 renderAll();
}
function ptDayDone(week,day){return ['pre','theory','post'].every(k=>ptTaskDone(week,day,k))}

function ptFilterMetricKey(week,day,source,metric){return `central-v6:pt-filter:${week}:${day}:${source}:${metric}`}
function oldPtFilterCountKey(week,day,source){return `central-v6:pt-filter-count:${week}:${day}:${source}`}
function getPtFilterMetric(week,day,source,metric){
 const direct=localStorage.getItem(ptFilterMetricKey(week,day,source,metric));
 if(direct!==null)return Math.max(0,Number(direct)||0);
 if(metric==='made'){
   const old=localStorage.getItem(oldPtFilterCountKey(week,day,source));
   if(old!==null)return Math.max(0,Number(old)||0);
 }
 return 0;
}
function getPtFilterStats(week,day,source){
 const made=getPtFilterMetric(week,day,source,'made');
 const correct=Math.min(made,getPtFilterMetric(week,day,source,'correct'));
 return {made,correct,wrong:Math.max(0,made-correct),accuracy:made?Math.round(correct/made*1000)/10:0};
}
function setPtFilterMetric(week,day,source,metric,value){
 let n=Math.max(0,Math.floor(Number(value)||0));
 const st=getPtFilterStats(week,day,source);
 if(metric==='correct' && n>st.made){
   n=st.made;
   alert('As certas não podem ser maiores que as feitas.');
 }
 localStorage.setItem(ptFilterMetricKey(week,day,source,metric),String(n));
 if(metric==='made'){
   const c=getPtFilterMetric(week,day,source,'correct');
   if(c>n)localStorage.setItem(ptFilterMetricKey(week,day,source,'correct'),String(n));
 }
 renderAll();
}
function ptDayFilterStats(week,day){
 const a=getPtFilterStats(week,day,'tec'),b=getPtFilterStats(week,day,'qc');
 const made=a.made+b.made,correct=a.correct+b.correct;
 return {made,correct,wrong:made-correct,accuracy:made?Math.round(correct/made*1000)/10:0};
}
function ptWeekFilterStats(week){
 const w=PT_CONFIG.weeks.find(x=>x.week===week);
 let made=0,correct=0;
 if(w)w.days.forEach(d=>{const st=ptDayFilterStats(week,d.day);made+=st.made;correct+=st.correct});
 return {made,correct,wrong:made-correct,accuracy:made?Math.round(correct/made*1000)/10:0};
}
function ptAllFilterStats(){
 let made=0,correct=0;
 PT_CONFIG.weeks.forEach(w=>w.days.forEach(d=>{const st=ptDayFilterStats(w.week,d.day);made+=st.made;correct+=st.correct}));
 return {made,correct,wrong:made-correct,accuracy:made?Math.round(correct/made*1000)/10:0};
}
function ptDayQuestionTotal(week,day){return ptDayFilterStats(week,day).made}
function ptWeekQuestionTotal(week){return ptWeekFilterStats(week).made}
function ptAllQuestionTotal(){return ptAllFilterStats().made}

function ptDayProgress(week,day){return ['pre','theory','post'].filter(k=>ptTaskDone(week,day,k)).length}
function ptWeekStats(week){
 const w=PT_CONFIG.weeks.find(x=>x.week===week);
 const done=w.days.filter(d=>ptDayDone(week,d.day)).length;
 return {done,total:7,pct:Math.round(done/7*100)};
}
function ptWeekOpenKey(week){return `central-v6:pt-week-open:${week}`}
function ptDayOpenKey(week,day){return `central-v6:pt-day-open:${week}:${day}`}
function togglePtWeek(week){
 const el=document.querySelector(`.pt-week[data-week="${week}"]`);
 if(!el)return;
 const open=!el.classList.contains('open');
 el.classList.toggle('open',open);
 localStorage.setItem(ptWeekOpenKey(week),open?'1':'0');
}
function togglePtDay(week,day){
 const el=document.querySelector(`.pt-day[data-daykey="${week}-${day}"]`);
 if(!el)return;
 const open=!el.classList.contains('open');
 // Um dia por vez: evita transformar a disciplina em uma página muito longa.
 PT_CONFIG.weeks.find(w=>w.week===week)?.days.forEach(d=>{
   if(d.day===day)return;
   localStorage.setItem(ptDayOpenKey(week,d.day),'0');
   document.querySelector(`.pt-day[data-daykey="${week}-${d.day}"]`)?.classList.remove('open');
 });
 el.classList.toggle('open',open);
 localStorage.setItem(ptDayOpenKey(week,day),open?'1':'0');
 if(open){
   saveLast({ptWeek:week,ptDay:day,title:`Português • Semana ${week} • Dia ${day}`,at:Date.now()});
   setTimeout(()=>el.scrollIntoView({behavior:'smooth',block:'start'}),0);
 }
}
function ptResourceKey(week,day){return `central-v6:pt-resource:${week}:${day}`}
function getPtResources(week,day){try{return JSON.parse(localStorage.getItem(ptResourceKey(week,day))||'{}')}catch(e){return {}}}
function savePtResources(week,day,r){localStorage.setItem(ptResourceKey(week,day),JSON.stringify(r));renderSubjects()}
function editPtLink(week,day,kind){
 const r=getPtResources(week,day);
 const label={youtube:'YouTube',tec:'Filtro TEC Concursos',qc:'Filtro QConcursos'}[kind]||kind;
 const v=prompt(`Cole o link de ${label}:`,r[kind]||'https://');
 if(v===null)return;
 const value=v.trim();
 if(!value){r[kind]='';savePtResources(week,day,r);return}
 const valid=safeUrl(value);
 if(!valid){alert('Link inválido. Use um endereço http:// ou https://.');return}
 r[kind]=valid;
 if(kind==='youtube'){
   const title=prompt('Nome do vídeo (opcional):',r.youtubeTitle||'Videoaula');
   if(title!==null)r.youtubeTitle=title.trim()||'Videoaula';
 }
 savePtResources(week,day,r);
}
function openPtSaved(week,day,kind){
 const r=getPtResources(week,day),url=safeUrl(r[kind]);
 if(url)openExternalUrl(url);
 else editPtLink(week,day,kind);
}
function openPortugueseReal(week,day,stage){
 if(week===1){
   openPtIntegratedStage(week,day,stage||'theory');
   return;
 }
 // Semanas 2–16 ainda têm apenas o planejamento real do V030.
 openPtIntegratedPlanning(week,day);
}

function getPtOldState(){
 try{
   const raw=JSON.parse(localStorage.getItem('dominio_portugues_site_v01')||'{}');
   return {
     answers:raw.answers||{},
     errors:raw.errors||{},
     theoryCompleted:raw.theoryCompleted||{},
     finalPassedAt:raw.finalPassedAt||null,
     delayedPassed:raw.delayedPassed||false,
     ...raw
   };
 }catch(e){
   return {answers:{},errors:{},theoryCompleted:{}};
 }
}
function savePtOldState(st){localStorage.setItem('dominio_portugues_site_v01',JSON.stringify(st))}
function ptDayQuestions(day){
 const qs=(PT_CONTENT.week1||[]).filter(q=>Number(q.day)===Number(day) && !q.delayed);
 if(day===7)return {pre:qs.slice(0,10),post:qs.slice(10),all:qs};
 const cut=Math.min(5,qs.length);
 return {pre:qs.slice(0,cut),post:qs.slice(cut),all:qs};
}
function ptIntegratedId(week,day){return `pt-integrated-${week}-${day}`}
function closePtIntegrated(week,day){
 const el=document.getElementById(ptIntegratedId(week,day));
 if(el)el.innerHTML='';
}
function openPtIntegratedStage(week,day,stage){
 const host=document.getElementById(ptIntegratedId(week,day));
 if(!host)return;
 if(week!==1){openPtIntegratedPlanning(week,day);return}
 if(stage==='pre')renderPtQuestionSession(host,day,'pre');
 else if(stage==='post')renderPtQuestionSession(host,day,'post');
 else renderPtTheoryInside(host,day);
 host.scrollIntoView({behavior:'smooth',block:'center'});
}
function openPtIntegratedPlanning(week,day){
 const host=document.getElementById(ptIntegratedId(week,day));
 if(!host)return;
 const w=PT_CONFIG.weeks.find(x=>x.week===week);
 host.innerHTML=`<div class="pt-integrated">
   <div class="pt-integrated-head"><div><b>Semana ${week} · Dia ${day}</b><br><small>${esc(w?.title||'Planejamento')}</small></div><button class="pt-inline-close" onclick="closePtIntegrated(${week},${day})">✕ fechar</button></div>
   <div class="pt-integrated-body">
     <div class="pt-stage-lock"><b>Estrutura incorporada.</b><br>O conteúdo completo deste dia ainda será preenchido.</div>
   </div>
 </div>`;
}
function ptAnswerRecord(q,selected,source){
 const st=getPtOldState();
 const correct=selected===q.correctIndex;
 const previous=st.answers[q.id];
 st.answers[q.id]={
   selectedIndex:selected,correct,
   topic:q.topic||'Semana 1',subskill:q.subskill||'',errorType:q.errorType||'',
   source,answeredAt:new Date().toISOString()
 };
 if(!correct){
   const k=q.errorType||q.subskill||q.id;
   const old=st.errors[k];
   st.errors[k]={
     key:k,questionId:q.id,topic:q.topic||'Semana 1',subskill:q.subskill||'',
     errorType:q.errorType||'Erro de análise',prompt:q.prompt,
     selectedAnswer:q.options[selected],correctAnswer:q.options[q.correctIndex],
     explanation:q.explanation||'',
     recurrence:old ? (old.recurrence||1)+(previous&&!previous.correct?0:1) : 1,
     resolved:false,lastAt:new Date().toISOString()
   };
 }
 savePtOldState(st);
}
function ptQuestionCompleted(q){return !!getPtOldState().answers?.[q.id]}
function renderPtQuestionSession(host,day,stage,startIndex=null){
 const split=ptDayQuestions(day);
 const qs=stage==='pre'?split.pre:split.post;
 if(!qs.length){
   host.innerHTML=`<div class="pt-integrated"><div class="pt-integrated-head"><b>Sem questões nesta etapa</b><button class="pt-inline-close" onclick="closePtIntegrated(1,${day})">✕</button></div></div>`;
   return;
 }
 const state=getPtOldState();
 let idx=startIndex==null ? Math.max(0,qs.findIndex(q=>!state.answers[q.id])) : startIndex;
 if(idx<0)idx=0;
 if(idx>=qs.length){renderPtQuestionResult(host,day,stage);return}
 const q=qs[idx],saved=state.answers[q.id]||null;
 const selected=saved?.selectedIndex;
 const checked=!!saved;
 const options=q.options.map((opt,i)=>{
   let cl='pt-option';
   if(selected===i)cl+=' selected';
   if(checked&&i===q.correctIndex)cl+=' correct';
   if(checked&&selected===i&&i!==q.correctIndex)cl+=' wrong';
   return `<button class="${cl}" ${checked?'disabled':''} onclick="ptSelectIntegratedAnswer(${day},'${stage}',${idx},${i})"><span class="pt-letter">${String.fromCharCode(65+i)}</span><span>${esc(opt)}</span></button>`;
 }).join('');
 const answered=qs.filter(x=>state.answers[x.id]).length;
 host.innerHTML=`<div class="pt-integrated">
   <div class="pt-integrated-head"><div><b>${stage==='pre'?'Questões iniciais':'Questões depois'} · Dia ${day}</b><br><small>Conteúdo original do Português V030 incorporado</small></div><button class="pt-inline-close" onclick="closePtIntegrated(1,${day})">✕ fechar</button></div>
   <div class="pt-integrated-body">
     <div class="pt-q-progress"><span>${esc(q.subskill||'Semana 1')}</span><span>${idx+1}/${qs.length} · ${answered} respondidas</span></div>
     <div class="pt-qbar"><span style="width:${((idx+1)/qs.length)*100}%"></span></div>
     <article class="pt-question-card">
       <div class="pt-q-tags"><span class="pt-q-tag">${esc(q.difficulty||'concurso')}</span>${q.errorType?`<span class="pt-q-tag">${esc(q.errorType)}</span>`:''}</div>
       <h3>${esc(q.prompt)}</h3>
       <div class="pt-options">${options}</div>
       ${checked?`<div class="pt-feedback ${saved.correct?'good':'bad'}"><b>${saved.correct?'Certo.':'Errado.'}</b> ${esc(q.explanation||'')}${!saved.correct&&q.errorType?`<br><b>Padrão:</b> ${esc(q.errorType)}`:''}</div>`:''}
       <div class="pt-q-actions">
         <button class="btn sm" ${idx===0?'disabled':''} onclick="renderPtQuestionSession(document.getElementById('${ptIntegratedId(1,day)}'),${day},'${stage}',${idx-1})">← Anterior</button>
         <div>
           ${checked?`<button class="btn primary sm" onclick="${idx===qs.length-1?`renderPtQuestionResult(document.getElementById('${ptIntegratedId(1,day)}'),${day},'${stage}')`:`renderPtQuestionSession(document.getElementById('${ptIntegratedId(1,day)}'),${day},'${stage}',${idx+1})`}">${idx===qs.length-1?'Ver resultado':'Próxima →'}</button>`:''}
         </div>
       </div>
     </article>
   </div>
 </div>`;
}
function ptSelectIntegratedAnswer(day,stage,idx,selected){
 const qs=stage==='pre'?ptDayQuestions(day).pre:ptDayQuestions(day).post;
 const q=qs[idx];
 if(!q||ptQuestionCompleted(q))return;
 ptAnswerRecord(q,selected,`central-week1-${stage}`);
 // Mantém a mesma questão aberta depois de responder. O avanço só ocorre pelo botão "Próxima".
 localStorage.setItem(ptWeekOpenKey(1),'1');
 localStorage.setItem(ptDayOpenKey(1,day),'1');
 renderAll();
 setTimeout(()=>{
   const host=document.getElementById(ptIntegratedId(1,day));
   if(!host)return;
   renderPtQuestionSession(host,day,stage,idx);
   host.scrollIntoView({behavior:'auto',block:'nearest'});
 },0);
}
function renderPtQuestionResult(host,day,stage){
 const qs=stage==='pre'?ptDayQuestions(day).pre:ptDayQuestions(day).post;
 const st=getPtOldState();
 const results=qs.map(q=>st.answers[q.id]).filter(Boolean);
 const correct=results.filter(x=>x.correct).length;
 const pct=qs.length?Math.round(correct/qs.length*100):0;
 if(day===7 && stage==='post'){
   const all=ptDayQuestions(7).all;
   const allResults=all.map(q=>st.answers[q.id]).filter(Boolean);
   const allCorrect=allResults.filter(x=>x.correct).length;
   if(allResults.length===all.length && allCorrect/all.length>=.85 && !st.finalPassedAt){
     st.finalPassedAt=new Date().toISOString();savePtOldState(st);
   }
 }
 host.innerHTML=`<div class="pt-integrated">
   <div class="pt-integrated-head"><div><b>Resultado · ${stage==='pre'?'Questões iniciais':'Questões depois'}</b><br><small>Dia ${day}</small></div><button class="pt-inline-close" onclick="closePtIntegrated(1,${day})">✕ fechar</button></div>
   <div class="pt-integrated-body pt-result">
     <div class="pt-result-score">${pct}%</div>
     <b>${correct} de ${qs.length} questões corretas</b>
     <p class="muted small">${results.length<qs.length?`${qs.length-results.length} questão(ões) ainda não respondida(s).`:'Etapa concluída e salva no mesmo histórico do Português V030.'}</p>
     <div class="q-actions" style="margin-top:10px">
       <button class="btn sm" onclick="renderPtQuestionSession(document.getElementById('${ptIntegratedId(1,day)}'),${day},'${stage}',0)">Rever questões</button>
       ${stage==='pre'?`<button class="btn primary sm" onclick="openPtIntegratedStage(1,${day},'theory')">Ir para teoria →</button>`:''}
       ${stage==='post'?`<button class="btn green sm" onclick="closePtIntegrated(1,${day})">Concluir etapa</button>`:''}
     </div>
   </div>
 </div>`;
}
function renderPtTheoryInside(host,day){
 const lesson=PT_CONTENT.week1Lessons?.[String(day)];
 if(day===7){renderPtWeek1Review(host);return}
 if(!lesson){
   host.innerHTML=`<div class="pt-integrated"><div class="pt-integrated-head"><b>Teoria não encontrada</b><button class="pt-inline-close" onclick="closePtIntegrated(1,${day})">✕</button></div></div>`;return
 }
 const reading=(PT_CONTENT.week1Readings||[]).find(r=>Number(r.day)===Number(day));
 const st=getPtOldState(),done=!!st.theoryCompleted?.[String(day)];
 host.innerHTML=`<div class="pt-integrated">
   <div class="pt-integrated-head"><div><b>Teoria completa · Dia ${day}</b><br><small>${esc(lesson.title)}</small></div><button class="pt-inline-close" onclick="closePtIntegrated(1,${day})">✕ fechar</button></div>
   <div class="pt-integrated-body">
    <article class="pt-lesson">
      <div class="pt-lesson-objective"><strong>OBJETIVO DO DIA</strong><p>${esc(lesson.objective)}</p></div>
      ${lesson.sections.map(sec=>`<section class="pt-lesson-section"><h3>${esc(sec[0])}</h3><p>${esc(sec[1])}</p></section>`).join('')}
      <section class="pt-lesson-section"><h3>Como aplicar na questão</h3><ol>${lesson.procedure.map(x=>`<li>${esc(x)}</li>`).join('')}</ol></section>
      <section class="pt-lesson-section"><h3>Exemplos guiados</h3><div class="pt-guided">${lesson.guided.map((g,i)=>`<details><summary>${i+1} · ${esc(g[0])}</summary><p><b>Análise:</b> ${esc(g[1])}</p></details>`).join('')}</div></section>
      <section class="pt-lesson-section"><h3>Aplicação em leitura real</h3><p>${esc(lesson.application)}</p></section>
      <div class="pt-lesson-summary"><h3>Resumo para guardar</h3><ul>${lesson.summary.map(x=>`<li>${esc(x)}</li>`).join('')}</ul></div>
      ${reading?`<section class="pt-reading-preview"><span class="pt-q-tag">${esc(reading.sourceType)}</span><h3>${esc(reading.title)}</h3><p>${esc(reading.text.slice(0,900))}${reading.text.length>900?'…':''}</p><div class="muted small">${esc(reading.source)} · ${esc(reading.reference)}</div><div style="margin-top:8px"><button class="pt-day-reading-button" onclick="openDayReading(${day})">Abrir leitura completa + questões</button></div></section>`:''}
      <div class="q-actions">
        <button class="btn ${done?'':'green'}" onclick="completePtTheory(${day})">${done?'Teoria concluída ✓':'Marcar teoria como concluída'}</button>
        <button class="btn primary" onclick="openPtIntegratedStage(1,${day},'post')">Questões depois →</button>
      </div>
    </article>
   </div>
 </div>`;
}
function completePtTheory(day){
 const st=getPtOldState();st.theoryCompleted=st.theoryCompleted||{};st.theoryCompleted[String(day)]=true;savePtOldState(st);
 localStorage.setItem(ptDayKey(1,day,'theory'),'1');
 localStorage.setItem(ptWeekOpenKey(1),'1');
 localStorage.setItem(ptDayOpenKey(1,day),'1');
 renderAll();
 setTimeout(()=>openPtIntegratedStage(1,day,'theory'),0);
}
function renderPtWeek1Review(host){
 const theories=Object.values(PT_CONTENT.week1Theory||{});
 host.innerHTML=`<div class="pt-integrated">
   <div class="pt-integrated-head"><div><b>Dia 7 · Revisão da Semana 1</b><br><small>Fechamento incorporado na Central</small></div><button class="pt-inline-close" onclick="closePtIntegrated(1,7)">✕ fechar</button></div>
   <div class="pt-integrated-body">
     <div class="pt-lesson">
       ${theories.map((t,i)=>`<section class="pt-lesson-section"><h3>${i+1} · ${esc(t.title)}</h3><p><b>Regras-chave:</b></p><ul>${t.rules.map(x=>`<li>${esc(x)}</li>`).join('')}</ul><p><b>Pegadinhas:</b></p><ul>${t.traps.map(x=>`<li>${esc(x)}</li>`).join('')}</ul></section>`).join('')}
       <div class="q-actions"><button class="btn green" onclick="ptSetTask(1,7,'theory',true);openPtIntegratedStage(1,7,'post')">Concluir revisão e ir à parte 2 →</button></div>
     </div>
   </div>
 </div>`;
}

function ptFilterButtons(week,day){
 const r=getPtResources(week,day);
 return `<button class="btn sm" onclick="openPtSaved(${week},${day},'tec')">${r.tec?'Abrir TEC':'+ TEC'}</button>
         <button class="btn sm" onclick="openPtSaved(${week},${day},'qc')">${r.qc?'Abrir QC':'+ QC'}</button>`;
}

const PT_IMAGE_DB='central-estudos-pt-images-v1';
const PT_IMAGE_STORE='images';
let ptImageDbPromise=null;

function openPtImageDb(){
 if(ptImageDbPromise)return ptImageDbPromise;
 ptImageDbPromise=new Promise((resolve,reject)=>{
   const req=indexedDB.open(PT_IMAGE_DB,1);
   req.onupgradeneeded=()=>{
     const db=req.result;
     if(!db.objectStoreNames.contains(PT_IMAGE_STORE))db.createObjectStore(PT_IMAGE_STORE);
   };
   req.onsuccess=()=>resolve(req.result);
   req.onerror=()=>reject(req.error);
 });
 return ptImageDbPromise;
}
async function putPtImage(id,file){
 const db=await openPtImageDb();
 return new Promise((resolve,reject)=>{
   const tx=db.transaction(PT_IMAGE_STORE,'readwrite');
   tx.objectStore(PT_IMAGE_STORE).put(file,id);
   tx.oncomplete=()=>resolve();
   tx.onerror=()=>reject(tx.error);
 });
}
async function getPtImage(id){
 if(!id)return null;
 const db=await openPtImageDb();
 return new Promise((resolve,reject)=>{
   const tx=db.transaction(PT_IMAGE_STORE,'readonly');
   const req=tx.objectStore(PT_IMAGE_STORE).get(id);
   req.onsuccess=()=>resolve(req.result||null);
   req.onerror=()=>reject(req.error);
 });
}
async function deletePtImage(id){
 if(!id)return;
 const db=await openPtImageDb();
 return new Promise((resolve,reject)=>{
   const tx=db.transaction(PT_IMAGE_STORE,'readwrite');
   tx.objectStore(PT_IMAGE_STORE).delete(id);
   tx.oncomplete=()=>resolve();
   tx.onerror=()=>reject(tx.error);
 });
}
function ptNotesKey(week,day){return `central-v6:pt-notes:${week}:${day}`}
function getPtDayNotes(week,day){
 try{return JSON.parse(localStorage.getItem(ptNotesKey(week,day))||'[]')}catch(e){return []}
}
function savePtDayNotes(week,day,notes){localStorage.setItem(ptNotesKey(week,day),JSON.stringify(notes))}
function ptSelectedImageName(week,day,input){
 const el=document.getElementById(`pt-note-file-name-${week}-${day}`);
 if(el)el.textContent=input.files?.[0]?`Imagem selecionada: ${input.files[0].name}`:'';
}
async function savePtDayNote(week,day){
 const textEl=document.getElementById(`pt-note-text-${week}-${day}`);
 const fileEl=document.getElementById(`pt-note-file-${week}-${day}`);
 const text=(textEl?.value||'').trim();
 const file=fileEl?.files?.[0]||null;
 if(!text&&!file){alert('Escreva uma anotação ou selecione uma imagem.');return}
 if(file && !file.type.startsWith('image/')){alert('Selecione um arquivo de imagem.');return}
 if(file && file.size>6*1024*1024){alert('A imagem deve ter no máximo 6 MB.');return}

 const noteId=Date.now();
 let imageId=null;
 if(file){
   imageId=`pt-note-img-${week}-${day}-${noteId}`;
   try{await putPtImage(imageId,file)}catch(e){alert('Não foi possível salvar a imagem neste navegador.');return}
 }
 const notes=getPtDayNotes(week,day);
 notes.unshift({id:noteId,text,imageId,at:new Date().toISOString()});
 savePtDayNotes(week,day,notes);
 if(textEl)textEl.value='';
 if(fileEl)fileEl.value='';
 renderSubjects();
 setTimeout(()=>hydratePtNoteImages(week,day),20);
}
async function deletePtDayNote(week,day,id){
 const notes=getPtDayNotes(week,day);
 const note=notes.find(n=>n.id===id);
 if(note?.imageId){try{await deletePtImage(note.imageId)}catch(e){}}
 savePtDayNotes(week,day,notes.filter(n=>n.id!==id));
 renderSubjects();
}
function renderPtNotes(week,day){
 const notes=getPtDayNotes(week,day);
 if(!notes.length)return '<div class="pt-note-empty">Nenhuma anotação neste dia.</div>';
 return notes.map(n=>`<article class="pt-note">
   ${n.text?`<div class="pt-note-text">${esc(n.text)}</div>`:''}
   ${n.imageId?`<div data-pt-note-image="${escAttr(n.imageId)}"><span class="muted small">Carregando imagem...</span></div>`:''}
   <div class="pt-note-meta">${new Date(n.at).toLocaleString('pt-BR')}</div>
   <div class="pt-note-actions"><button class="btn red sm" onclick="deletePtDayNote(${week},${day},${n.id})">Excluir</button></div>
 </article>`).join('');
}
async function hydratePtNoteImages(week=null,day=null){
 const nodes=[...document.querySelectorAll('[data-pt-note-image]')];
 for(const node of nodes){
   if(node.dataset.loaded==='1')continue;
   const id=node.getAttribute('data-pt-note-image');
   try{
     const blob=await getPtImage(id);
     if(blob){
       const url=URL.createObjectURL(blob);
       node.innerHTML=`<img class="pt-note-image" src="${url}" alt="Imagem da anotação">`;
       node.dataset.loaded='1';
     }else{
       node.innerHTML='<span class="muted small">Imagem não encontrada.</span>';
     }
   }catch(e){
     node.innerHTML='<span class="muted small">Não foi possível carregar a imagem.</span>';
   }
 }
}


function renderPortugueseMaster(){
 return `<div class="pt-master-tools">
   <button onclick="togglePtMasterPanel('readings')">📖 Leituras completas</button>
   <button onclick="togglePtMasterPanel('errors')">⚠ Caderno de erros <span id="pt-error-count-inline">${ptErrorCount()}</span></button>
   <button onclick="togglePtMasterPanel('progress')">📊 Mapa de progresso</button>
   <button onclick="togglePtMasterPanel('library')">🎓 Repertórios</button>
   <button onclick="togglePtMasterPanel('backup')">💾 Backup / Restaurar</button>
 </div>
 <div id="pt-master-panel">${renderPtMasterPanel()}</div>
 ${renderPortugueseWeeks()}`;
}
function ptMasterKey(){return 'central-v6:pt-master-panel'}
function togglePtMasterPanel(panel){
 const current=localStorage.getItem(ptMasterKey())||'';
 localStorage.setItem(ptMasterKey(),current===panel?'':panel);
 renderSubjects();
 setTimeout(()=>hydratePtNoteImages(),0);
}
function closePtMasterPanel(){localStorage.setItem(ptMasterKey(),'');renderSubjects()}
function renderPtMasterPanel(){
 const panel=localStorage.getItem(ptMasterKey())||'';
 if(!panel)return '';
 if(panel==='readings')return renderPtReadingsPanel();
 if(panel==='errors')return renderPtErrorsPanel();
 if(panel==='progress')return renderPtProgressPanel();
 if(panel==='library')return renderPtLibraryPanel();
 if(panel==='backup')return renderPtBackupPanel();
 return '';
}
function masterPanel(title,body){
 return `<section class="pt-master-panel">
   <div class="pt-master-head"><h3>${title}</h3><button class="pt-inline-close" onclick="closePtMasterPanel()">✕ fechar</button></div>
   <div class="pt-master-body">${body}</div>
 </section>`;
}


function renderPtReadingsPanel(){
 const body=`<div class="pt-reading-list">${(PT_CONTENT.week1Readings||[]).map(r=>renderFullReadingCard(r)).join('')}</div>`;
 return masterPanel('📖 Leituras completas da Semana 1',body);
}
function renderFullReadingCard(r){
 const state=getPtOldState();
 return `<article class="pt-reading-card" id="full-reading-${escAttr(r.id)}">
   <div class="pt-reading-meta"><span class="pt-q-tag">Dia ${r.day}</span><span class="pt-q-tag">${esc(r.sourceType)}</span><span class="pt-q-tag">${esc(r.source)}</span></div>
   <h3>${esc(r.title)}</h3>
   <div class="muted small">${esc(r.reference)}</div>
   <div class="pt-reading-text">${esc(r.text)}</div>
   <section class="pt-reading-section"><h4>Tese central</h4><p>${esc(r.thesis)}</p></section>
   <section class="pt-reading-section"><h4>Argumentos aproveitáveis</h4><ul>${(r.arguments||[]).map(x=>`<li>${esc(x)}</li>`).join('')}</ul></section>
   <section class="pt-reading-section"><h4>Repertórios para redação</h4><ul>${(r.repertoires||[]).map(x=>`<li>${esc(x)}</li>`).join('')}</ul></section>
   <section class="pt-reading-section"><h4>Exercício de escrita</h4><p>${esc(r.writingPrompt)}</p></section>
   <section class="pt-reading-section"><h4>Questões da leitura</h4>${(r.questions||[]).map(q=>renderReadingQuestion(q,state)).join('')}</section>
 </article>`;
}
function renderReadingQuestion(q,state){
 const saved=state.answers?.[q.id];
 return `<div class="pt-reading-question">
   <b>${esc(q.prompt)}</b>
   <div class="pt-rq-options">${q.options.map((o,i)=>{
      let cl='pt-rq-option';
      if(saved && i===q.correctIndex)cl+=' correct';
      if(saved && saved.selectedIndex===i && i!==q.correctIndex)cl+=' wrong';
      return `<button class="${cl}" ${saved?'disabled':''} onclick="answerReadingQuestion('${escJs(q.id)}',${i})">${String.fromCharCode(65+i)}. ${esc(o)}</button>`;
   }).join('')}</div>
   ${saved?`<div class="pt-feedback ${saved.correct?'good':'bad'}"><b>${saved.correct?'Certo.':'Errado.'}</b> ${esc(q.explanation||'')}</div>`:''}
 </div>`;
}
function findPtQuestionById(id){
 for(const r of (PT_CONTENT.week1Readings||[])){
   const q=(r.questions||[]).find(x=>x.id===id);if(q)return q;
 }
 for(const q of (PT_CONTENT.week1||[]))if(q.id===id)return q;
 for(const rep of (PT_CONTENT.repertoires||[])){
   const q=(rep.questions||[]).find(x=>x.id===id);if(q)return q;
 }
 return null;
}
function answerReadingQuestion(id,selected){
 const q=findPtQuestionById(id);if(!q)return;
 if(getPtOldState().answers?.[id])return;
 ptAnswerRecord(q,selected,'central-reading');
 renderSubjects();
 localStorage.setItem(ptMasterKey(),'readings');
}
function openDayReading(day){
 localStorage.setItem(ptMasterKey(),'readings');
 renderSubjects();
 setTimeout(()=>document.getElementById(`full-reading-${(PT_CONTENT.week1Readings||[]).find(r=>Number(r.day)===Number(day))?.id}`)?.scrollIntoView({behavior:'smooth',block:'start'}),40);
}


function ptErrorsArray(){
 const st=getPtOldState();
 return Object.values(st.errors||{}).sort((a,b)=>String(b.lastAt||'').localeCompare(String(a.lastAt||'')));
}
function ptErrorCount(){return ptErrorsArray().filter(e=>!e.resolved).length}
function renderPtErrorsPanel(){
 const errors=ptErrorsArray();
 const active=errors.filter(e=>!e.resolved),resolved=errors.filter(e=>e.resolved);
 const body=`<div class="summary" style="margin:0 0 10px">
   <div class="sum"><small>Erros ativos</small><b>${active.length}</b></div>
   <div class="sum"><small>Resolvidos</small><b>${resolved.length}</b></div>
 </div>
 ${errors.length?`<div class="pt-error-list">${errors.map(renderErrorCard).join('')}</div>`:'<div class="pt-empty-state">Nenhum erro registrado ainda. Quando você errar uma questão incorporada, ela aparecerá aqui automaticamente.</div>'}`;
 return masterPanel('⚠ Caderno de erros',body);
}
function renderErrorCard(e){
 return `<article class="pt-error-card ${e.resolved?'pt-error-resolved':''}">
   <div class="pt-error-title">${esc(e.prompt||'Questão')}</div>
   <div class="pt-error-meta">
     <span class="pt-error-chip">${esc(e.topic||'Português')}</span>
     ${e.subskill?`<span class="pt-error-chip">${esc(e.subskill)}</span>`:''}
     ${e.errorType?`<span class="pt-error-chip">${esc(e.errorType)}</span>`:''}
     <span class="pt-error-chip">Reincidência: ${Number(e.recurrence||1)}</span>
     <span class="pt-error-chip">${e.resolved?'Resolvido':'Ativo'}</span>
   </div>
   <div class="pt-error-answer"><strong>Sua resposta:</strong> ${esc(e.selectedAnswer||'—')}</div>
   <div class="pt-error-answer"><strong>Resposta correta:</strong> ${esc(e.correctAnswer||'—')}</div>
   <div class="pt-error-explanation">${esc(e.explanation||'')}</div>
   <div class="action-row">
     <button class="btn sm ${e.resolved?'':'green'}" onclick="togglePtErrorResolved('${escJs(e.key)}')">${e.resolved?'Reabrir erro':'Marcar como resolvido'}</button>
   </div>
 </article>`;
}
function togglePtErrorResolved(key){
 const st=getPtOldState();if(!st.errors?.[key])return;
 st.errors[key].resolved=!st.errors[key].resolved;
 st.errors[key].resolvedAt=st.errors[key].resolved?new Date().toISOString():null;
 savePtOldState(st);localStorage.setItem(ptMasterKey(),'errors');renderSubjects();
}


function ptInternalQuestionStats(){
 const st=getPtOldState();
 const all=[];
 (PT_CONTENT.week1||[]).forEach(q=>all.push(q));
 (PT_CONTENT.week1Readings||[]).forEach(r=>(r.questions||[]).forEach(q=>all.push(q)));
 const answered=all.filter(q=>st.answers?.[q.id]);
 const correct=answered.filter(q=>st.answers[q.id].correct);
 return {available:all.length,answered:answered.length,correct:correct.length,accuracy:answered.length?Math.round(correct.length/answered.length*1000)/10:0};
}
function renderPtProgressPanel(){
 const stats=ptInternalQuestionStats();
 const totalDays=PT_CONFIG.weeks.length*7;
 let doneDays=0;PT_CONFIG.weeks.forEach(w=>w.days.forEach(d=>{if(ptDayDone(w.week,d.day))doneDays++}));
 const theoryDone=Object.values(getPtOldState().theoryCompleted||{}).filter(Boolean).length;
 const body=`<div class="pt-progress-summary">
   <div class="pt-progress-stat"><small>Dias concluídos</small><b>${doneDays}/${totalDays}</b></div>
   <div class="pt-progress-stat"><small>Questões internas</small><b>${stats.answered}/${stats.available}</b></div>
   <div class="pt-progress-stat"><small>Acerto interno</small><b>${stats.answered?stats.accuracy+'%':'—'}</b></div>
   <div class="pt-progress-stat"><small>Erros ativos</small><b>${ptErrorCount()}</b></div>
 </div>
 <div class="pt-progress-list">${PT_CONFIG.weeks.map(w=>{
   const st=ptWeekStats(w.week);return `<div class="pt-progress-card pt-progress-week">
     <b>Semana ${w.week}</b>
     <div class="pt-progress-weekbar"><span style="width:${st.pct}%"></span></div>
     <span class="muted small">${st.done}/7</span>
   </div>`;
 }).join('')}</div>
 <div class="notice" style="margin-top:10px">As questões dos filtros TEC/QC continuam contabilizadas separadamente. Este mapa mostra também o desempenho das questões internas incorporadas.</div>`;
 return masterPanel('📊 Mapa de progresso de Português',body);
}


function renderPtLibraryPanel(){
 const reps=PT_CONTENT.repertoires||[],cult=PT_CONTENT.culturalLibrary||[];
 const body=`<div class="resource-label">Repertórios argumentativos</div>
 <div class="pt-library-grid">${reps.map(r=>`<article class="pt-library-card">
   <small>${esc(r.thinker||'')}</small><h3>${esc(r.title)}</h3>
   <div class="pt-reading-text">${esc(r.text)}</div>
   <div class="pt-reading-section"><h4>Como usar na redação</h4><p>${esc(r.writingUse||'')}</p></div>
   <div class="pt-library-tags">${(r.themes||[]).map(x=>`<span>${esc(x)}</span>`).join('')}</div>
 </article>`).join('')}</div>
 <div class="resource-label" style="margin-top:15px">Biblioteca cultural</div>
 <div class="pt-library-grid">${cult.map(r=>`<article class="pt-library-card">
   <small>${esc(r.category)} · ${esc(r.creator)}</small><h3>${esc(r.work)}</h3>
   <div class="pt-reading-text">${esc(r.summary)}</div>
   <div class="pt-reading-section"><h4>Ideia-chave</h4><p>${esc(r.keyIdea)}</p></div>
   <div class="pt-reading-section"><h4>Uso em redação</h4><p>${esc(r.writingUse)}</p></div>
   <div class="pt-library-tags">${(r.themes||[]).map(x=>`<span>${esc(x)}</span>`).join('')}</div>
 </article>`).join('')}</div>`;
 return masterPanel('🎓 Repertórios e biblioteca cultural',body);
}


function blobToDataUrl(blob){
 return new Promise((resolve,reject)=>{
   const fr=new FileReader();fr.onload=()=>resolve(fr.result);fr.onerror=()=>reject(fr.error);fr.readAsDataURL(blob);
 });
}
function dataUrlToBlob(dataUrl){
 const [meta,b64]=String(dataUrl).split(',');
 const mime=(meta.match(/data:([^;]+)/)||[])[1]||'application/octet-stream';
 const bin=atob(b64||''),arr=new Uint8Array(bin.length);
 for(let i=0;i<bin.length;i++)arr[i]=bin.charCodeAt(i);
 return new Blob([arr],{type:mime});
}
async function buildPortugueseBackup(){
 const data={version:'central-portugues-v6.6',exportedAt:new Date().toISOString(),localStorage:{},images:[]};
 for(let i=0;i<localStorage.length;i++){
   const k=localStorage.key(i);
   if(k==='dominio_portugues_site_v01'||k.startsWith('central-v6:pt')||k.startsWith('central-v6:open:pt')){
     data.localStorage[k]=localStorage.getItem(k);
   }
 }
 const imageIds=new Set();
 Object.entries(data.localStorage).forEach(([k,v])=>{
   if(!k.startsWith('central-v6:pt-notes:'))return;
   try{(JSON.parse(v)||[]).forEach(n=>{if(n.imageId)imageIds.add(n.imageId)})}catch(e){}
 });
 for(const id of imageIds){
   try{
     const blob=await getPtImage(id);
     if(blob)data.images.push({id,type:blob.type||'image/jpeg',dataUrl:await blobToDataUrl(blob)});
   }catch(e){}
 }
 return data;
}
async function downloadPtBackup(){
 const data=await buildPortugueseBackup();
 const blob=new Blob([JSON.stringify(data,null,2)],{type:'application/json'});
 const url=URL.createObjectURL(blob),a=document.createElement('a');
 a.href=url;a.download=`backup-portugues-${todayISO()}.json`;a.click();
 setTimeout(()=>URL.revokeObjectURL(url),500);
}
function triggerPtRestore(){document.getElementById('pt-backup-file')?.click()}
async function restorePtBackup(input){
 const file=input.files?.[0];if(!file)return;
 try{
   const data=JSON.parse(await file.text());
   if(!data.localStorage||typeof data.localStorage!=='object')throw new Error('Formato inválido');
   Object.entries(data.localStorage).forEach(([k,v])=>localStorage.setItem(k,v));
   for(const img of (data.images||[])){
     if(img.id&&img.dataUrl){
       try{await putPtImage(img.id,dataUrlToBlob(img.dataUrl))}catch(e){}
     }
   }
   alert(`Backup de Português restaurado${(data.images||[]).length?` com ${(data.images||[]).length} imagem(ns)`:''}.`);
   localStorage.setItem(ptMasterKey(),'backup');renderAll();
 }catch(e){alert('Não foi possível restaurar este arquivo de backup.')}
 input.value='';
}
function clearPortugueseProgress(){
 if(!confirm('Apagar o progresso de Português salvo nesta Central? Esta ação não pode ser desfeita sem backup.'))return;
 const keys=[];for(let i=0;i<localStorage.length;i++){const k=localStorage.key(i);if(k==='dominio_portugues_site_v01'||k.startsWith('central-v6:pt'))keys.push(k)}
 keys.forEach(k=>localStorage.removeItem(k));renderAll();
}
function renderPtBackupPanel(){
 const body=`<div class="pt-backup-actions">
   <button class="btn primary" onclick="downloadPtBackup()">⬇ Exportar backup</button>
   <button class="btn" onclick="triggerPtRestore()">⬆ Restaurar backup</button>
   <input class="pt-file-hidden" id="pt-backup-file" type="file" accept=".json,application/json" onchange="restorePtBackup(this)">
 </div>
 <div class="pt-backup-note"><b>O que o backup preserva:</b> respostas, caderno de erros, teorias concluídas, semanas/dias, filtros TEC/QC, contadores, anotações em texto, revisões e configurações de Português.</div>
 <div class="pt-backup-note" style="margin-top:7px"><b>Imagens das anotações:</b> também são incluídas no backup e restauradas junto com os demais dados.</div>
 <div class="action-row"><button class="btn red sm" onclick="clearPortugueseProgress()">Apagar progresso de Português</button></div>`;
 return masterPanel('💾 Backup e restauração de Português',body);
}

function ptActiveWeekKey(){return 'central-v6:pt-active-week'}
function setPtActiveWeek(week){
 const n=Math.max(1,Math.min(16,Number(week)||1));
 localStorage.setItem(ptActiveWeekKey(),String(n));
 localStorage.setItem(ptWeekOpenKey(n),'1');
 renderAll();
 setTimeout(()=>document.querySelector('.pt-study-nav')?.scrollIntoView({behavior:'smooth',block:'start'}),0);
}
function renderPortugueseWeeks(){
 const stored=Number(localStorage.getItem(ptActiveWeekKey())||1);
 const activeWeek=Math.max(1,Math.min(16,stored||1));
 const w=PT_CONFIG.weeks.find(x=>x.week===activeWeek)||PT_CONFIG.weeks[0];
 const rememberedOpenDays=w.days.filter(d=>localStorage.getItem(ptDayOpenKey(w.week,d.day))==='1');
 if(rememberedOpenDays.length>1)rememberedOpenDays.slice(1).forEach(d=>localStorage.setItem(ptDayOpenKey(w.week,d.day),'0'));
 const st=ptWeekStats(w.week);
 const phases=[
   {id:'grammar',title:'1 · Gramática e sintaxe',subtitle:'Semanas 1–8',from:1,to:8},
   {id:'text',title:'2 · Texto e interpretação',subtitle:'Semanas 9–12',from:9,to:12},
   {id:'writing',title:'3 · Redação',subtitle:'Semanas 13–16',from:13,to:16}
 ];
 const phase=phases.find(p=>activeWeek>=p.from&&activeWeek<=p.to)||phases[0];
 const phaseWeeks=PT_CONFIG.weeks.filter(x=>x.week>=phase.from&&x.week<=phase.to);
 const prev=activeWeek>1?activeWeek-1:null,next=activeWeek<16?activeWeek+1:null;
 return `<div class="pt-study-shell">
   <section class="pt-study-nav">
     <div class="pt-study-nav-head">
       <div><span class="pt-study-kicker">ROTEIRO DE ESTUDO</span><h3>Português dividido por etapas</h3><p>Escolha a fase, depois a semana e abra somente o dia que vai estudar.</p></div>
       <div class="pt-study-current"><small>Agora</small><b>Semana ${activeWeek}</b><span>${st.pct}% concluída</span></div>
     </div>
     <div class="pt-phase-tabs">${phases.map(p=>`<button class="${phase.id===p.id?'active':''}" onclick="setPtActiveWeek(${p.from})"><b>${p.title}</b><small>${p.subtitle}</small></button>`).join('')}</div>
     <div class="pt-week-tabs">${phaseWeeks.map(x=>{const s=ptWeekStats(x.week);return `<button class="${x.week===activeWeek?'active':''}" onclick="setPtActiveWeek(${x.week})"><span>S${x.week}</span><small>${s.pct}%</small></button>`}).join('')}</div>
   </section>

   <section class="pt-week pt-week-focus open" data-week="${w.week}">
     <div class="pt-focus-head">
       <button class="pt-focus-arrow" ${prev?'':'disabled'} onclick="${prev?`setPtActiveWeek(${prev})`:''}" aria-label="Semana anterior">←</button>
       <div class="pt-focus-title"><span>SEMANA ${w.week}</span><h3>${esc(w.title)}</h3><small>${st.done}/7 dias concluídos · ${ptWeekFilterStats(w.week).made} questões externas registradas</small></div>
       <button class="pt-focus-arrow" ${next?'':'disabled'} onclick="${next?`setPtActiveWeek(${next})`:''}" aria-label="Próxima semana">→</button>
     </div>
     <div class="pt-week-body">
       <div class="pt-week-bar"><span style="width:${st.pct}%"></span></div>
       <div class="pt-week-guide"><b>Fluxo:</b> abra um dia → faça as questões iniciais → estude a teoria → faça as questões depois. Os materiais extras ficam recolhidos no fim do dia.</div>
       ${typeof window.tecContextPanel==='function'?window.tecContextPanel('pt-w'+w.week,'Cadernos TEC desta semana'):''}
       ${w.days.map(d=>renderPortugueseDay(w,d)).join('')}
     </div>
   </section>
 </div>`;
}
function renderPortugueseDay(w,d){
 const progress=ptDayProgress(w.week,d.day);
 const open=localStorage.getItem(ptDayOpenKey(w.week,d.day))==='1';
 const r=getPtResources(w.week,d.day);
 const isReal=w.week===1;
 const autoPre=ptAutoTaskDone(w.week,d.day,'pre'),autoTheory=ptAutoTaskDone(w.week,d.day,'theory'),autoPost=ptAutoTaskDone(w.week,d.day,'post');
 const theoryDesc=isReal && d.day<=6 ? d.title : (isReal ? 'Teste final e revisão da semana' : `Conteúdo planejado: ${w.title}`);
 return `<div class="pt-day ${open?'open':''}" data-daykey="${w.week}-${d.day}">
   <button class="pt-day-head" onclick="togglePtDay(${w.week},${d.day})">
     <span class="pt-day-label">DIA ${d.day}</span>
     <span class="pt-day-title">${esc(d.title)}</span>
     <span class="pt-day-status">${progress}/3 etapas • ${ptDayFilterStats(w.week,d.day).made} feitas · ${ptDayFilterStats(w.week,d.day).correct} certas</span>
     <span class="chev">⌄</span>
   </button>
   <div class="pt-day-body">
     <div class="pt-day-route-title"><span>ROTEIRO PRINCIPAL</span><small>Conclua na ordem 1 → 2 → 3</small></div>
     <div class="pt-flow">
       ${renderPtStep(w.week,d.day,'pre','1 · Questões iniciais','Tente antes de receber a teoria.',autoPre,
         isReal?`openPortugueseReal(${w.week},${d.day},'pre')`:`openPtSaved(${w.week},${d.day},'tec')`,
         isReal?'Abrir aqui':'Abrir filtro')}
       ${renderPtStep(w.week,d.day,'theory','2 · Teoria',theoryDesc,autoTheory,
         `openPortugueseReal(${w.week},${d.day},'theory')`,
         isReal?'Abrir aqui':'Ver planejamento')}
       ${renderPtStep(w.week,d.day,'post','3 · Questões depois','Aplicar o conteúdo depois da teoria.',autoPost,
         isReal?`openPortugueseReal(${w.week},${d.day},'post')`:`openPtSaved(${w.week},${d.day},'tec')`,
         isReal?'Abrir aqui':'Abrir filtro')}
     </div>

     <div id="pt-integrated-${w.week}-${d.day}"></div>

     <details class="pt-support-panel">
       <summary><div><b>Materiais e registros do dia</b><small>Vídeo · filtros TEC/QC · leitura · anotações</small></div><span>⌄</span></summary>
       <div class="pt-support-body">
         <div class="pt-resources">
           <div class="pt-resource">
             <h4>Vídeo do YouTube</h4>
             ${r.youtube?`<a class="pt-video-link" href="${escAttr(safeUrl(r.youtube))}" target="_blank" rel="noopener">▶ ${esc(r.youtubeTitle||'Videoaula')}</a>`:'<div class="muted small">Nenhum vídeo adicionado.</div>'}
             <div class="pt-resource-actions"><button class="btn sm" onclick="editPtLink(${w.week},${d.day},'youtube')">${r.youtube?'Trocar vídeo':'+ Adicionar vídeo'}</button></div>
           </div>

           <div class="pt-resource">
             <h4>Filtros de questões</h4>
             <div class="pt-filter-source">
               <div class="pt-filter-top"><span><b>TEC Concursos</b></span><div class="pt-resource-actions"><button class="btn sm" onclick="openPtSaved(${w.week},${d.day},'tec')">${r.tec?'Abrir filtro':'+ Adicionar filtro'}</button></div></div>
               <div class="pt-filter-count"><label>Feitas</label><input type="number" min="0" value="${getPtFilterStats(w.week,d.day,'tec').made||''}" placeholder="0" onchange="setPtFilterMetric(${w.week},${d.day},'tec','made',this.value)"></div>
               <div class="pt-filter-count"><label>Certas</label><input type="number" min="0" value="${getPtFilterStats(w.week,d.day,'tec').correct||''}" placeholder="0" onchange="setPtFilterMetric(${w.week},${d.day},'tec','correct',this.value)"></div>
               <div class="pt-hint">${getPtFilterStats(w.week,d.day,'tec').made?`${getPtFilterStats(w.week,d.day,'tec').wrong} erradas · ${getPtFilterStats(w.week,d.day,'tec').accuracy}%`:'Sem registro'}</div>
             </div>
             <div class="pt-filter-source">
               <div class="pt-filter-top"><span><b>QConcursos</b></span><div class="pt-resource-actions"><button class="btn sm" onclick="openPtSaved(${w.week},${d.day},'qc')">${r.qc?'Abrir filtro':'+ Adicionar filtro'}</button></div></div>
               <div class="pt-filter-count"><label>Feitas</label><input type="number" min="0" value="${getPtFilterStats(w.week,d.day,'qc').made||''}" placeholder="0" onchange="setPtFilterMetric(${w.week},${d.day},'qc','made',this.value)"></div>
               <div class="pt-filter-count"><label>Certas</label><input type="number" min="0" value="${getPtFilterStats(w.week,d.day,'qc').correct||''}" placeholder="0" onchange="setPtFilterMetric(${w.week},${d.day},'qc','correct',this.value)"></div>
               <div class="pt-hint">${getPtFilterStats(w.week,d.day,'qc').made?`${getPtFilterStats(w.week,d.day,'qc').wrong} erradas · ${getPtFilterStats(w.week,d.day,'qc').accuracy}%`:'Sem registro'}</div>
             </div>
           </div>
         </div>

         <div class="pt-day-total"><span>TEC/QC no dia</span><b>${ptDayFilterStats(w.week,d.day).made} feitas · ${ptDayFilterStats(w.week,d.day).correct} certas · ${ptDayFilterStats(w.week,d.day).wrong} erradas · ${ptDayFilterStats(w.week,d.day).made?ptDayFilterStats(w.week,d.day).accuracy+'%':'—'}</b></div>

         ${isReal?`<div style="margin-top:8px"><button class="pt-day-reading-button" onclick="openDayReading(${d.day})">📖 Abrir leitura completa do Dia ${d.day}</button></div>`:''}

         <section class="pt-notes">
           <div class="resource-label">Anotações do dia</div>
           <div class="pt-note-compose">
             <div><textarea id="pt-note-text-${w.week}-${d.day}" placeholder="Anote uma regra, dúvida, pegadinha, exemplo..."></textarea><div class="pt-note-selected" id="pt-note-file-name-${w.week}-${d.day}"></div></div>
             <div><input class="pt-note-image-input" id="pt-note-file-${w.week}-${d.day}" type="file" accept="image/*" onchange="ptSelectedImageName(${w.week},${d.day},this)"><label class="pt-note-image-label" for="pt-note-file-${w.week}-${d.day}">🖼 Adicionar imagem</label><button class="btn primary sm" style="display:block;margin-top:6px;width:100%" onclick="savePtDayNote(${w.week},${d.day})">Salvar anotação</button></div>
           </div>
           <div class="pt-note-list">${renderPtNotes(w.week,d.day)}</div>
         </section>

         ${isReal?`<div class="pt-hint" style="margin-top:9px">Semana 1: questões, teoria e leituras disponíveis dentro da Central.</div>`:`<div class="pt-hint" style="margin-top:9px"><span class="pt-planned">PLANEJADA</span> A estrutura deste dia já está pronta; o conteúdo interno desta semana ainda será alimentado no módulo de Português.</div>`}
       </div>
     </details>
   </div>
 </div>`;
}
function renderPtStep(week,day,kind,title,desc,autoDone,action,label){
 const done=ptTaskDone(week,day,kind);
 return `<div class="pt-step ${done?'done':''}">
   <input type="checkbox" ${done?'checked':''} ${autoDone?'disabled title="Concluído no conteúdo incorporado de Português"':''} onchange="ptSetTask(${week},${day},'${kind}',this.checked)">
   <div>
     <b>${title}${autoDone?' • salvo':''}</b>
     <small>${esc(desc)}</small>
   </div>
   <button class="btn sm" onclick="${action}">${label}</button>
 </div>`;
}

function renderTopic(s,t){
 const done=goalDone(t.uid),r=getResources(t.uid),stats=t.sourceStats;
 const topicIsOpen=localStorage.getItem(topicOpenKey(t.uid))==='1';
 return `<div class="topic-item ${topicIsOpen?'open':''}" data-uid="${t.uid}">
  <div class="topic-row">
   <input type="checkbox" ${done?'checked':''} onchange="toggleGoal('${t.uid}',this.checked,event)">
   <div class="topic-title ${done?'done':''}">${esc(t.title)}${stats?` <span class="muted" style="font-weight:400">· ${stats.cards!=null?stats.cards+' cards':stats.questions!=null?stats.questions+' questões':stats.blocks!=null?stats.blocks+' blocos':'dados'}</span>`:''}</div>
   <div class="topic-origin">${esc(t.origin)}</div>
   <div><span class="type">${esc(t.type)}</span></div>
   <button class="open-topic" onclick="toggleTopic('${t.uid}')">⌄</button>
  </div>
  <div class="topic-detail"><div class="detail-panel">${renderDetail(s,t,r)}</div></div>
 </div>`
}
function renderDetail(s,t,r){
 const perf=getPerf(t.uid),q=perf.reduce((a,x)=>a+x.q,0),c=perf.reduce((a,x)=>a+x.c,0);
 const tecAuto=(typeof window.tecContextButtons==='function'?window.tecContextButtons(t.uid,'chip'):'');
 const decorandoId=s.id==='cpp'?`cpp-${String(s.topics.indexOf(t)+1).padStart(2,'0')}`:'';
 const pre=(r.prestudy||[]);
 const preHtml=`<div class="prestudy"><div class="pre-title">▶ ${pre.length?pre.length+' AULA'+(pre.length>1?'S':'')+' / ORIENTAÇÃO'+(pre.length>1?'ÕES':''):'AULAS / ORIENTAÇÕES ANTES DE ESTUDAR'}</div>${pre.length?pre.map((x,i)=>`<div class="pre-row"><span>${i+1}</span><a href="${escAttr(safeUrl(x.url))}" target="_blank">${esc(x.name)}</a><span>→</span></div>`).join(''):`<div class="pre-row"><span>+</span><a href="#" onclick="editNamedLinks('${t.uid}','prestudy');return false">Adicionar aula, mentoria ou orientação preparatória</a><span>→</span></div>`}</div>`;
 const tips=(r.tips&&r.tips.length?r.tips:t.tips||[]);
 const realButtons=[
   t.studyUrl?`<a class="chip real" href="#" onclick="openInternal('${escJs(t.studyUrl)}','${escJs(s.name+' • '+t.title)}');return false">▶ Estudar módulo real</a>`:'',
   t.ankiDeck?`<a class="chip anki" href="#" onclick="openAnkiDeck('${escJs(t.ankiDeck)}','${escJs(t.title)}');return false">🧠 Abrir este baralho</a>`:'',
   decorandoId?`<a class="chip real" href="#" onclick="openLeiSecaEnxuta(null,'cpp','${decorandoId}');return false">📖 Decorando deste tópico</a>`:''
 ].filter(Boolean).join('');
 const hist=perf.length?perf.slice(0,8).map((x,i)=>`<div class="hist"><span>${i?'Anterior':'Atual'}</span><span>${x.q} feitas · ${x.c} certas</span><span class="rate ${x.pct>=80?'good':x.pct>=60?'mid':'bad'}">${x.pct}%</span><button class="btn red sm" onclick="deletePerf('${t.uid}',${x.id})">×</button></div>`).join(''):`<div class="muted small" style="padding:8px 0">Nenhum resultado registrado.</div>`;
 const notes=getNotes(t.uid);
 return `${preHtml}
  <div class="inline-tools"><button onclick="toggleTopic('${t.uid}')">⌃ Fechar</button><button onclick="focusNote('${t.uid}')">✎ Anotar</button><button onclick="startTimer('${t.uid}',this)">◷ <span data-timer="${t.uid}">${formatTimer(Number(localStorage.getItem(key(t.uid,'timer'))||0))}</span></button><button onclick="quickReview('${t.uid}')">▣ Agendar revisão</button></div>
  <div class="tips"><div class="tips-title">💡 Dicas</div><ul>${tips.map(x=>`<li>${x}</li>`).join('')}</ul><button class="edit-link" onclick="editTips('${t.uid}')">editar dicas</button></div>
  <div class="resource"><div class="resource-label">O que já existe neste tópico</div><div class="chips">${realButtons||'<span class="muted small">Sem módulo teórico separado; o conteúdo existente é o baralho/recursos abaixo.</span>'}</div></div>
  <div class="resource"><div class="resource-label">Questões</div><div class="chips">${tecAuto}${r.tec?linkChip(r.tec,'↗ TEC personalizado','',t.uid,'tec'):(tecAuto?'':linkChip(r.tec,'+ TEC Concursos','',t.uid,'tec'))}${linkChip(r.qc,'↗ QConcursos','',t.uid,'qc')}<button class="edit-link" onclick="editLink('${t.uid}','tec')">TEC manual</button><button class="edit-link" onclick="editLink('${t.uid}','qc')">QC</button></div></div>
  <div class="resource"><div class="resource-label">Lei Seca</div><div class="chips">${linkChip(r.law,'⚖ Lei / artigo','law',t.uid,'law')}<a class="chip law" href="#" onclick="openInternal('modules/lei-seca-juridica/index.html','Lei Seca Jurídica');return false">⚖ Biblioteca geral</a><button class="edit-link" onclick="editLink('${t.uid}','law')">editar link</button></div></div>
  <div class="resource"><div class="resource-label">Videoaulas</div><div class="chips">${namedLinks(r.videos,'video')}<button class="edit-link" onclick="editNamedLinks('${t.uid}','videos')">+ videoaula</button></div></div>
  <div class="resource"><div class="resource-label">Materiais</div><div class="chips">${namedLinks(r.materials,'')}<button class="edit-link" onclick="editNamedLinks('${t.uid}','materials')">+ material</button></div></div>
  ${t.sourceStats?`<div class="resource"><div class="resource-label">${t.sourceStats.cards!=null?'Dados do pacote Anki recuperado':'Dados deste tópico'}</div><div class="muted small">${t.sourceStats.cards!=null?t.sourceStats.cards+' cartões · '+t.sourceStats.views+' visualizações · '+t.sourceStats.correct+' acertos · '+t.sourceStats.wrong+' erros'+(t.sourceStats.accuracy!=null?' · '+t.sourceStats.accuracy+'%':''):t.sourceStats.questions!=null?t.sourceStats.questions+' questões reais disponíveis':t.sourceStats.blocks!=null?t.sourceStats.blocks+' blocos de treino mecânico':'dados disponíveis'}</div></div>`:''}
  <div class="perf-form"><div class="field"><label>Questões feitas</label><input id="q-${t.uid}" type="number" min="0" placeholder="—"></div><div class="field"><label>Questões certas</label><input id="c-${t.uid}" type="number" min="0" placeholder="—"></div><button class="btn green" onclick="registerPerf('${t.uid}')">✓ Registrar</button></div>
  <div class="history-label">Histórico · total ${q} feitas · ${c} certas</div>${hist}
  <div class="notes"><div class="resource-label">Anotações</div><div class="field"><textarea id="note-${t.uid}" placeholder="Regra, dúvida, pegadinha, observação..."></textarea></div><div class="action-row"><button class="btn primary sm" onclick="saveNote('${t.uid}')">Salvar anotação</button></div>${notes.map(n=>`<div class="note-item">${esc(n.text)}<br><small>${new Date(n.at).toLocaleString('pt-BR')}</small> <button class="edit-link" style="float:right;color:#ef7777" onclick="deleteNote('${t.uid}',${n.id})">×</button></div>`).join('')}</div>
  <div class="resource"><div class="resource-label">Revisão</div><div class="chips"><input id="rev-${t.uid}" type="date" value="${localStorage.getItem(key(t.uid,'review'))||todayISO()}" style="border:1px solid var(--line2);background:#091525;color:#eaf2ff;border-radius:6px;padding:6px"><button class="btn sm" onclick="scheduleReview('${t.uid}')">Agendar revisão</button>${localStorage.getItem(key(t.uid,'review'))?`<span class="muted small">marcada para ${formatDate(localStorage.getItem(key(t.uid,'review')))}</span>`:''}</div></div>`
}
function safeUrl(raw){
 if(!raw)return '';
 try{
   const u=new URL(String(raw).trim(),location.href);
   if(['http:','https:','file:'].includes(u.protocol))return u.href;
 }catch(e){}
 return '';
}
function openExternalUrl(raw){
 const valid=safeUrl(raw);
 if(!valid){alert('Link inválido ou indisponível.');return false}
 let opened=null;
 try{opened=window.open(valid,'_blank')}catch(e){}
 if(opened){try{opened.opener=null}catch(e){};return false}
 try{window.location.assign(valid)}catch(e){window.location.href=valid}
 return false;
}
function installExternalLinkRouter(){
 if(window.__centralExternalLinkRouterInstalled)return;
 window.__centralExternalLinkRouterInstalled=true;
 document.addEventListener('click',event=>{
  const anchor=event.target?.closest?.('a[href]');if(!anchor)return;
  const raw=anchor.getAttribute('href');if(!raw||raw==='#'||/^javascript:/i.test(raw))return;
  const valid=safeUrl(raw);if(!/^https?:/i.test(valid))return;
  event.preventDefault();openExternalUrl(valid);
 },true);
}
installExternalLinkRouter();
function linkChip(url,label,cls,uid,kind){
 const valid=safeUrl(url);
 return valid?`<a class="chip ${cls}" href="${escAttr(valid)}" target="_blank" rel="noopener">${label}</a>`:`<button class="chip ${cls}" style="opacity:.55" onclick="editLink('${uid}','${kind}')">+ ${label}</button>`;
}
function namedLinks(arr,cls){
 return (arr||[]).map((x,i)=>{
   const valid=safeUrl(x.url);
   if(!valid)return '';
   return `<span><a class="chip ${cls}" href="${escAttr(valid)}" target="_blank" rel="noopener">${esc(x.name)}</a></span>`;
 }).join('');
}

function resKey(uid){return key(uid,'resources')}function getResources(uid){return JSON.parse(localStorage.getItem(resKey(uid))||'{}')}function saveResources(uid,r){localStorage.setItem(resKey(uid),JSON.stringify(r));renderSubjects()}
function editLink(uid,kind){
 const r=getResources(uid),v=prompt(`Cole o link de ${kind.toUpperCase()}:`,r[kind]||'https://');
 if(v===null)return;
 const value=v.trim();
 if(!value){r[kind]='';saveResources(uid,r);return}
 const valid=safeUrl(value);
 if(!valid){alert('Link inválido. Use um endereço http:// ou https:// válido.');return}
 r[kind]=valid;saveResources(uid,r);
}
function editNamedLinks(uid,kind){
 const r=getResources(uid),arr=r[kind]||[];
 const existing=arr.map((x,i)=>`${i+1}. ${x.name} — ${x.url}`).join('\n');
 const action=prompt(`${existing?existing+'\n\n':''}Digite:\n+ para adicionar\n-1, -2... para excluir\nOu deixe vazio para cancelar`, '+');
 if(action===null||!action.trim())return;
 if(/^-[0-9]+$/.test(action.trim())){
   const ix=Math.abs(Number(action.trim()))-1;
   if(ix>=0&&ix<arr.length){arr.splice(ix,1);r[kind]=arr;saveResources(uid,r)}
   return;
 }
 const name=prompt('Nome do recurso:','');
 if(name===null)return;
 const url=prompt('Link do recurso:','https://');
 if(url===null)return;
 const valid=safeUrl(url);
 if(!valid){alert('Link inválido. Use um endereço http:// ou https:// válido.');return}
 arr.push({name:name.trim()||'Recurso',url:valid});
 r[kind]=arr;saveResources(uid,r);
}
function editTips(uid){const x=topicByUid(uid),r=getResources(uid),current=(r.tips||x.t.tips||[]).map(v=>String(v).replace(/<[^>]*>/g,'')).join('\n');const v=prompt('Uma dica por linha:',current);if(v===null)return;r.tips=v.split('\n').map(x=>esc(x.trim())).filter(Boolean);saveResources(uid,r)}

function openAnkiDeck(deck,title){return openEmbeddedTool('anki',{deck:deck||null,title:title||'Anki'},null);}
function perfKey(uid){return key(uid,'perf')}function getPerf(uid){return JSON.parse(localStorage.getItem(perfKey(uid))||'[]')}
function registerPerf(uid){const q=Number($(`q-${uid}`).value||0),c=Number($(`c-${uid}`).value||0);if(q<=0||c<0||c>q){alert('Confira questões feitas e certas.');return}const a=getPerf(uid);a.unshift({id:Date.now(),q,c,pct:Math.round(c/q*1000)/10,date:todayISO()});localStorage.setItem(perfKey(uid),JSON.stringify(a));renderAll()}
function deletePerf(uid,id){localStorage.setItem(perfKey(uid),JSON.stringify(getPerf(uid).filter(x=>x.id!==id)));renderAll()}
function notesKey(uid){return key(uid,'notes')}function getNotes(uid){return JSON.parse(localStorage.getItem(notesKey(uid))||'[]')}function saveNote(uid){const el=$(`note-${uid}`),v=el.value.trim();if(!v)return;const a=getNotes(uid);a.unshift({id:Date.now(),text:v,at:new Date().toISOString()});localStorage.setItem(notesKey(uid),JSON.stringify(a));renderSubjects()}function deleteNote(uid,id){localStorage.setItem(notesKey(uid),JSON.stringify(getNotes(uid).filter(x=>x.id!==id)));renderSubjects()}function focusNote(uid){$(`note-${uid}`)?.focus()}

let timerHandles={};function startTimer(uid,btn){if(timerHandles[uid]){clearInterval(timerHandles[uid]);delete timerHandles[uid];return}let sec=Number(localStorage.getItem(key(uid,'timer'))||0);timerHandles[uid]=setInterval(()=>{sec++;localStorage.setItem(key(uid,'timer'),sec);const el=document.querySelector(`[data-timer="${uid}"]`);if(el)el.textContent=formatTimer(sec)},1000)}
function formatTimer(s){return `${String(Math.floor(s/60)).padStart(2,'0')}:${String(s%60).padStart(2,'0')}`}
function quickReview(uid){const d=new Date();d.setDate(d.getDate()+7);const iso=d.toISOString().slice(0,10);localStorage.setItem(key(uid,'review'),iso);addReviewAgenda(uid,iso);renderAll();alert('Revisão agendada para 7 dias.')}
function scheduleReview(uid){const v=$(`rev-${uid}`).value;if(!v)return;localStorage.setItem(key(uid,'review'),v);addReviewAgenda(uid,v);renderAll()}
function addReviewAgenda(uid,date){const x=topicByUid(uid);if(!x)return;const a=getAgenda(date);if(!a.some(i=>i.reviewUid===uid)){a.push({id:Date.now(),time:'',discipline:x.s.name,task:'Revisão — '+x.t.title,done:false,reviewUid:uid});saveAgenda(date,a)}}
function formatDate(iso){return new Date(iso+'T12:00:00').toLocaleDateString('pt-BR')}

function agendaKey(d){return `central-v6:agenda:${d}`}
function getAgenda(d){
 const k=agendaKey(d);let raw=null;
 try{raw=localStorage.getItem(k)}catch(e){console.warn('Agenda sem acesso ao armazenamento',e)}
 if(raw){
  try{const parsed=JSON.parse(raw);if(Array.isArray(parsed))return parsed;throw new Error('formato inválido')}
  catch(e){console.warn('Agenda armazenada inválida; registro ignorado',e);try{localStorage.removeItem(k)}catch(_){}}
 }
 if(d===todayISO()){
  const a=[{id:1,time:'06:40',discipline:'Direito Constitucional',task:'Continuar módulo atual',done:false},{id:2,time:'07:20',discipline:'Anki',task:'Revisar baralhos pendentes',done:false},{id:3,time:'19:30',discipline:'Português',task:'Continuar semana atual',done:false}];
  try{saveAgenda(d,a)}catch(_){}return a
 }
 return []
}
function saveAgenda(d,a){try{localStorage.setItem(agendaKey(d),JSON.stringify(Array.isArray(a)?a:[]));return true}catch(e){console.warn('Não foi possível salvar Agenda',e);return false}}
function toggleAgenda(d,id,v){const a=getAgenda(d),x=a.find(i=>i.id===id);if(x)x.done=v;saveAgenda(d,a);renderAll();renderAgendaEditor()}
function deleteAgenda(d,id){saveAgenda(d,getAgenda(d).filter(x=>x.id!==id));renderAll();renderAgendaEditor()}
function addAgenda(){const d=$('agendaDate').value||todayISO(),task=$('agendaTask').value.trim();if(!task)return;const a=getAgenda(d);a.push({id:Date.now(),time:$('agendaTime').value||'',discipline:$('agendaDisc').value,task,done:false});saveAgenda(d,a);$('agendaTask').value='';renderAll();renderAgendaEditor()}
function renderHomeAgenda(){const d=todayISO(),a=getAgenda(d),done=a.filter(x=>x.done).length,p=a.length?Math.round(done/a.length*100):0;$('dayCount').textContent=`${done} de ${a.length}`;$('dayBar').style.width=p+'%';$('dayPct').textContent=p+'%';$('homeAgenda').innerHTML=a.length?a.map(x=>`<div class="agenda-row ${x.done?'done':''}"><input type="checkbox" ${x.done?'checked':''} onchange="toggleAgenda('${d}',${x.id},this.checked)"><div class="agenda-time">${esc(x.time||'—')}</div><div class="agenda-copy"><b>${esc(x.discipline)}</b><small>${esc(x.task)}</small></div><button class="btn sm" onclick="openAgenda()">Editar</button></div>`).join(''):'<div class="muted small" style="padding:12px">Agenda vazia.</div>'}
function renderAgendaEditor(){
 const host=$('agendaEditor');if(!host)return;
 const dateEl=$('agendaDate');const d=(dateEl&&dateEl.value)||todayISO();
 let a=[];try{a=getAgenda(d)}catch(e){console.warn('Falha ao ler agenda',e);a=[]}
 host.innerHTML=a.length?a.map(x=>`<div class="agenda-edit-row"><span>${esc(x.time||'—')}</span><span><b>${esc(x.discipline||'')}</b><br><span class="muted">${esc(x.task||'')}</span></span><input type="checkbox" ${x.done?'checked':''} onchange="toggleAgenda('${d}',${Number(x.id)||0},this.checked)"><button class="btn red sm" onclick="deleteAgenda('${d}',${Number(x.id)||0})">×</button></div>`).join(''):'<div class="muted small">Nenhuma tarefa neste dia.</div>'
}

function allPerf(){const out=[];for(const s of SUBJECTS)for(const t of s.topics)getPerf(t.uid).forEach(x=>out.push({...x,sid:s.id,subject:s.name}));return out}
function countReviews(){let n=0;for(const s of SUBJECTS)for(const t of s.topics)if(localStorage.getItem(key(t.uid,'review')))n++;return n}
function renderSummary(){
 let total=0,done=0;
 SUBJECTS.forEach(s=>{const st=subjStats(s);total+=st.total;done+=st.done});
 const p=allPerf(),manualQ=p.reduce((a,x)=>a+x.q,0),manualC=p.reduce((a,x)=>a+x.c,0);
 const pt=ptAllFilterStats(),cf=cfStats();
 const q=manualQ+pt.made+cf.answered,correct=manualC+pt.correct+cf.correct;
 const g=$('sumGoals'),sq=$('sumQ'),sa=$('sumAcc'),sr=$('sumRev');
 if(g)g.textContent=`${done}/${total}`;
 if(sq)sq.textContent=q;
 if(sa)sa.textContent=q?Math.round(correct/q*1000)/10+'%':'—';
 if(sr)sr.textContent=countReviews();
}
function renderPerformance(){const p=allPerf(),q=p.reduce((a,x)=>a+x.q,0),c=p.reduce((a,x)=>a+x.c,0);$('gpSessions').textContent=p.length;$('gpQ').textContent=q;$('gpC').textContent=c;$('gpA').textContent=q?Math.round(c/q*1000)/10+'%':'—';$('perfBySubject').innerHTML=SUBJECTS.map(s=>{const a=p.filter(x=>x.sid===s.id),sq=a.reduce((z,x)=>z+x.q,0),sc=a.reduce((z,x)=>z+x.c,0);return `<div class="hist"><span>${esc(s.name)}</span><span>${sq} questões</span><span class="rate ${sq&&sc/sq>=.8?'good':sq&&sc/sq>=.6?'mid':'bad'}">${sq?Math.round(sc/sq*1000)/10+'%':'—'}</span><span></span></div>`}).join('');try{if(typeof window.renderMapaEstudos==='function')window.renderMapaEstudos()}catch(e){console.warn('mapa',e)}
}
function renderDisciplineGrid(){
 const host=$('disciplineGrid');if(!host)return;
 let list=[];try{list=Array.isArray(SUBJECTS)?SUBJECTS:[]}catch(e){console.warn('SUBJECTS indisponível',e)}
 if(!list.length){host.innerHTML='<div class="card" style="padding:18px"><b>Disciplinas</b><div class="muted small" style="margin-top:7px">O conteúdo ainda está terminando de carregar. Toque novamente em Disciplinas.</div></div>';return}
 host.innerHTML=list.map(s=>{
  try{
   let st;try{st=subjStats(s)}catch(err){st={done:0,total:(s.id==='pt'?112:(s.topics?.length||0)),pct:0}}
   const cards=(s.topics||[]).reduce((a,t)=>a+(t.sourceStats?.cards||0),0),guided=['cf','civil','penal','cpc'].includes(s.id);
   const desc=s.id==='pt'?'16 semanas • 7 dias por semana':guided?`${s.topics.length} módulos • curso integrado`:s.id==='rlm'?'9 módulos teóricos • cálculo rápido • 200 FCC':(s.id==='trab'||s.id==='ptra')?`${s.topics.length} aulas • Mentoria AJAJ`:`${s.topics.length} tópicos reais recuperados`;
   const unit=s.id==='pt'?'dias':guided?'módulos':s.id==='rlm'?'itens':(s.id==='trab'||s.id==='ptra')?'aulas':'tópicos';
   return `<button type="button" class="disc-card" data-id="${escAttr(s.id)}" onclick="return jumpSubject('${escJs(s.id)}')"><b>${esc(s.name)}</b><small>${esc(desc)}</small><span class="disc-meta">${Number(st.done)||0}/${Number(st.total)||0} ${unit} · ${Number(st.pct)||0}%${!guided&&s.id!=='rlm'&&cards?' · '+cards+' cards':''}</span></button>`
  }catch(e){console.warn('Falha em cartão de disciplina',s?.id,e);return ''}
 }).join('')
}
function jumpSubject(id){
 try{
  const sid=String(id||'');
  openHome();
  try{localStorage.setItem(`central-v6:open:${sid}`,'1')}catch(_){}
  try{renderSubjects()}catch(e){console.warn('Falha ao renderizar disciplina',sid,e)}
  setTimeout(()=>{
   const el=document.querySelector(`.subject[data-id="${sid.replace(/"/g,'\"')}"]`);
   if(el){try{el.scrollIntoView({behavior:'auto',block:'start'})}catch(_){el.scrollIntoView()}}
   else console.warn('Disciplina não localizada na página',sid)
  },20)
 }catch(e){console.error('Falha ao abrir disciplina',id,e)}
 return false
}
function renderAll(){
 renderHomeAgenda();renderSubjects();renderContinue();renderSummary();
 setTimeout(()=>hydratePtNoteImages(),0);
}

function esc(v){return String(v??'').replace(/[&<>"']/g,s=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[s]))}
function escAttr(v){return esc(v).replace(/`/g,'&#96;')}function escJs(v){return String(v??'').replace(/\\/g,'\\\\').replace(/'/g,"\\'")}

try{applyCentralTheme()}catch(e){console.warn('Tema',e)}
try{applySidebarCollapse()}catch(e){console.warn('Sidebar',e)}
try{renderAll()}catch(e){
 console.error('Inicialização parcial da Central',e);
 try{renderDisciplineGrid()}catch(_){}
}
