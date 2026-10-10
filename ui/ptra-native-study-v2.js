/* Base Completa — Direito Processual do Trabalho — integração nativa M01–M21 (preview) */
(function(global){
'use strict';
if(global.__PTRA_NATIVE_V1)return; global.__PTRA_NATIVE_V1=true;
const INDEX=global.PTRA_NATIVE_INDEX||{modules:[],tecs:{}};
const NS='base-completa:ptra:v2:';
const LEGACY_MARK=NS+'migration';
let reader=null, quiz=null, imageZoom=1;
const MODULES=global.PTRA_NATIVE_MODULES||{};
const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>Array.from(r.querySelectorAll(s));
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const pad=n=>String(n).padStart(2,'0');
const clamp=n=>Math.max(0,Math.min(100,Math.round(Number(n)||0)));
function get(k){try{return localStorage.getItem(k)}catch(_){return null}}
function set(k,v){try{localStorage.setItem(k,String(v));return true}catch(_){return false}}
function read(k,fallback=null){try{const x=JSON.parse(get(NS+k)||'null');return x??fallback}catch(_){return fallback}}
function write(k,v){set(NS+k,JSON.stringify(v));}
function readPct(n,kind){return clamp(read(`m${pad(n)}:reading:${kind}`,{}).pct||0)}
function theoryPct(n){return Math.round((readPct(n,'resumido')+readPct(n,'completo'))/2)}
function markGenericDone(n){const uid=`ptra-m${pad(n)}`;try{localStorage.setItem(`central-v6:done:${uid}`,theoryPct(n)>=100?'1':'0')}catch(_){}}
function stats(){const total=INDEX.modules.length||21,values=INDEX.modules.map(m=>theoryPct(m.number)),done=values.filter(p=>p>=100).length;return {total,done,pct:total?Math.round(values.reduce((a,b)=>a+b,0)/total):0}}
function extStats(n){const rows=read(`m${pad(n)}:tec:rounds`,[]);const done=rows.reduce((s,r)=>s+(Number(r?.done)||0),0),correct=rows.reduce((s,r)=>s+(Number(r?.correct)||0),0);return {done,correct,pct:done?Math.round(correct/done*100):0}}
function noteList(n){return read(`m${pad(n)}:notes`,[])}
function qHistory(n,kind){return read(`m${pad(n)}:questions:${kind}`,[])}
function moduleMeta(n){return INDEX.modules.find(m=>Number(m.number)===Number(n))||null}
function tecMeta(id){
 const live=global.TEC_CADERNOS_DATA?.cadernos?.find(x=>x.id===id);
 if(live)return {id,name:live.nome,url:live.url,count:Number(live.questoes)||0};
 const saved=INDEX.tecs?.[id];return saved?{id,name:saved.name,url:saved.url,count:Number(saved.count)||0}:null;
}
function preserveLegacy(){
 if(get(LEGACY_MARK))return;
 const legacy=[];try{for(let i=0;i<localStorage.length;i++){const k=localStorage.key(i);if(k&&(/ptra-a\d+/.test(k)||/central-v6:.*ptra/.test(k)))legacy.push(k)}}catch(_){ }
 set(LEGACY_MARK,JSON.stringify({at:new Date().toISOString(),legacyKeysPreserved:legacy.length,automaticRemap:false,reason:'A matriz antiga de 11 aulas não possui equivalência 1:1 segura com os 21 módulos novos.'}));
}
function mutateSubject(){
 try{
  if(typeof SUBJECTS==='undefined'||!Array.isArray(SUBJECTS))return false;
  const s=SUBJECTS.find(x=>x.id==='ptra');if(!s)return false;
  s.special='BASE COMPLETA • 21 módulos • PDFs aprovados + infográficos + questões interativas';
  s.topics=INDEX.modules.map(m=>({uid:m.uid,title:`${pad(m.number)} ${m.title.toUpperCase()}`,origin:'BASE COMPLETA • Processo do Trabalho',type:'Módulo',studyUrl:null,ankiDeck:null,sourceInfo:'Material aprovado e preservado do pacote final de Processo do Trabalho.',sourceStats:{questions:(m.summaryQuestions||0)+(m.completeQuestions||0)},tips:[]}));
  return true;
 }catch(_){return false}
}
function introHTML(){const s=stats();return `<header class="ptra-native-intro"><div><span>PROCESSO DO TRABALHO</span><h3>Trilha oficial • 21 módulos</h3><p>Versão resumida, versão completa, questões internas interativas e infográfico original de cada módulo.</p></div><div class="ptra-native-course-stat"><b>${s.pct}%</b><small>${s.done}/${s.total} módulos com teoria concluída</small></div></header>`}
function meter(p,cls=''){return `<div class="ptra-native-meter ${cls}"><i style="width:${clamp(p)}%"></i></div>`}
function moduleHTML(m){
 const n=m.number,open=get(`${NS}open:m${pad(n)}`)==='1',rp=readPct(n,'resumido'),cp=readPct(n,'completo'),tp=theoryPct(n),ex=extStats(n);
 return `<section class="ptra-native-mod ${open?'open':''}" data-ptra-module="${n}">
 <button type="button" class="ptra-native-mod-head" data-ptra-toggle="${n}"><span class="ptra-native-no">MÓDULO ${pad(n)}</span><span class="ptra-native-title">${esc(m.title)}<small>${m.summaryPages} págs. resumido • ${m.completePages} págs. completo</small></span><span class="ptra-native-head-pct"><b>${tp}%</b><small>teoria</small></span><span class="ptra-native-chev">⌄</span></button>
 <div class="ptra-native-mod-body">${open?zoneHTML(m,rp,cp,tp,ex):''}</div></section>`
}
function roundRows(n){const rows=read(`m${pad(n)}:tec:rounds`,[]);return [0,1,2].map(i=>{const r=rows[i]||{};return `<div class="ptra-native-round" data-round="${i}"><label>FEITAS<input type="number" min="0" inputmode="numeric" value="${r.done??''}"></label><label>ACERTOS<input type="number" min="0" inputmode="numeric" value="${r.correct??''}"></label><label>OBSERVAÇÃO<input type="text" value="${esc(r.note||'')}"></label><button type="button" class="ptra-native-btn" data-ptra-save-round="${i}">Salvar ${i+1}</button></div>`}).join('')}
function notesHTML(n){const notes=noteList(n);return notes.length?notes.slice().reverse().map(x=>`<article class="ptra-native-note"><p>${esc(x.text)}</p><small>${new Date(x.at).toLocaleString('pt-BR')}</small></article>`).join(''):'<small class="ptra-native-empty">Nenhuma anotação salva.</small>'}
function tecHTML(m){const tecs=(m.tec||[]).map(tecMeta).filter(Boolean);if(!tecs.length)return '<span class="ptra-native-empty">Sem caderno TEC específico mapeado. Nenhum link foi inventado.</span>';return tecs.map(x=>`<button type="button" class="ptra-native-tec-chip" data-ptra-tec="${esc(x.id)}">${esc(x.name)} <small>${x.count}q</small></button>`).join('')}
function zoneHTML(m,rp,cp,tp,ex){const n=m.number;return `<div class="ptra-native-zone">
 <div class="ptra-native-tools"><span>FERRAMENTAS DO MÓDULO</span><div><button type="button" data-ptra-tool="decorando">Decorando a Lei / Lei em Dia</button><button type="button" data-ptra-tool="vade">Vade Mecum</button><button type="button" data-ptra-tool="tec">Cadernos TEC</button></div></div>
 <div class="ptra-native-progress-grid"><article><div><b>Progresso da teoria</b><strong>${tp}%</strong></div>${meter(tp)}<small>Média da leitura real: resumida ${rp}% + completa ${cp}%.</small></article><article><div><b>Questões externas / TEC</b><strong>${ex.done?ex.pct:0}%</strong></div>${meter(ex.pct,'external')}<small>${ex.done} feitas • ${ex.correct} acertos. Não interfere na teoria.</small></article></div>
 <div class="ptra-native-card-grid"><article class="ptra-native-card"><div class="ptra-native-card-top"><span>VERSÃO RESUMIDA</span><span>${rp}% lido</span></div><h4>Leitura objetiva</h4><p>Conteúdo integral extraído do PDF aprovado, com retomada da posição de leitura.</p>${meter(rp)}<div class="ptra-native-card-actions"><button type="button" class="primary" data-ptra-read="resumido">ABRIR LEITURA</button><button type="button" data-ptra-quiz="resumido">${m.summaryQuestions} QUESTÕES</button></div></article>
 <article class="ptra-native-card"><div class="ptra-native-card-top"><span>VERSÃO COMPLETA</span><span>${cp}% lido</span></div><h4>Estudo completo</h4><p>Conteúdo integral extraído do PDF aprovado, sem atualização jurídica automática.</p>${meter(cp)}<div class="ptra-native-card-actions"><button type="button" class="primary" data-ptra-read="completo">ABRIR LEITURA</button><button type="button" data-ptra-quiz="completo">${m.completeQuestions} QUESTÕES</button></div></article>
 <article class="ptra-native-card ptra-native-visual"><div class="ptra-native-card-top"><span>INFOGRÁFICO / MAPA VISUAL</span><span>ORIGINAL</span></div><h4>Revisão visual</h4><p>Imagem correspondente a este módulo, preservada do material aprovado.</p><div class="ptra-native-card-actions"><button type="button" class="primary" data-ptra-image>AMPLIAR INFOGRÁFICO</button></div></article></div>
 ${m.warning?`<div class="ptra-native-warning"><b>ALERTA PRESERVADO:</b> ${esc(m.warning)}</div>`:''}
 <div class="ptra-native-bottom"><section class="ptra-native-panel ptra-native-tec"><h4>Questões externas / TEC</h4><div class="ptra-native-tec-list">${tecHTML(m)}</div><div class="ptra-native-rounds">${roundRows(n)}</div></section><section class="ptra-native-panel ptra-native-notes"><h4>Anotações do módulo</h4><textarea placeholder="Regra, dúvida, pegadinha, observação..."></textarea><div class="ptra-native-note-actions"><button type="button" class="ptra-native-btn primary" data-ptra-save-note>SALVAR ANOTAÇÃO</button></div><div class="ptra-native-note-list">${notesHTML(n)}</div></section></div>
 </div>`}
function renderMaster(){return `<div class="ptra-native-master">${introHTML()}<div class="ptra-native-list">${INDEX.modules.map(moduleHTML).join('')}</div></div>`}
function patchHead(subject){const st=stats(),count=$('.subject-count',subject),pct=$('.subject-pct',subject),bar=$('.subject-bar span',subject);if(count)count.textContent=`${st.done}/${st.total} módulos`;if(pct){pct.textContent=`${st.pct}%`;pct.classList.toggle('done',st.pct===100)}if(bar)bar.style.width=`${st.pct}%`}
function hydrate(){
 const subject=document.querySelector('.subject[data-id="ptra"]');if(!subject)return;
 patchHead(subject);if(!subject.classList.contains('open'))return;
 const body=$('.subject-body',subject);if(!body)return;
 body.innerHTML=`<div class="subject-bar"><span style="width:${stats().pct}%"></span></div>${renderMaster()}`;
 bindMaster(subject);
}
function bindMaster(subject){
 subject.onclick=function(event){
  const target=event.target.closest('button');if(!target)return;
  const mod=target.closest('[data-ptra-module]'),n=Number(mod?.dataset.ptraModule||0),meta=moduleMeta(n);
  if(target.dataset.ptraToggle){event.preventDefault();toggleModule(Number(target.dataset.ptraToggle));return}
  if(!n||!meta)return;
  if(target.dataset.ptraRead){event.preventDefault();openReader(n,target.dataset.ptraRead);return}
  if(target.dataset.ptraQuiz){event.preventDefault();openQuiz(n,target.dataset.ptraQuiz,false);return}
  if(target.hasAttribute('data-ptra-image')){event.preventDefault();openImage(n);return}
  if(target.dataset.ptraTool){event.preventDefault();openTool(target.dataset.ptraTool,n);return}
  if(target.dataset.ptraTec){event.preventDefault();openTec(target.dataset.ptraTec);return}
  if(target.dataset.ptraSaveRound!=null){event.preventDefault();saveRound(mod,n,Number(target.dataset.ptraSaveRound));return}
  if(target.hasAttribute('data-ptra-save-note')){event.preventDefault();saveNote(mod,n);return}
 };
}
function toggleModule(n){const key=`${NS}open:m${pad(n)}`,opening=get(key)!=='1';set(key,opening?'1':'0');if(opening){try{global.saveLast?.({ptraModule:n,title:`Processo do Trabalho • Módulo ${pad(n)} • ${moduleMeta(n)?.title||''}`,at:Date.now()})}catch(_){}}hydrate();if(opening)setTimeout(()=>document.querySelector(`[data-ptra-module="${n}"]`)?.scrollIntoView({block:'start',behavior:'smooth'}),30)}
function openModule(n){
 n=Number(n);if(!moduleMeta(n))return false;
 try{localStorage.setItem('central-v6:open:ptra','1')}catch(_){ }
 try{global.openHome?.()}catch(_){ }
 try{global.renderSubjects?.()}catch(_){ }
 set(`${NS}open:m${pad(n)}`,'1');hydrate();
 setTimeout(()=>document.querySelector(`[data-ptra-module="${n}"]`)?.scrollIntoView({block:'start',behavior:'auto'}),50);
 try{global.saveLast?.({ptraModule:n,title:`Processo do Trabalho • Módulo ${pad(n)} • ${moduleMeta(n)?.title||''}`,at:Date.now()})}catch(_){ }
 return false;
}
function saveRound(mod,n,i){const row=mod.querySelector(`.ptra-native-round[data-round="${i}"]`),inputs=$$('input',row);if(inputs.length<3)return;const done=Math.max(0,Number(inputs[0].value)||0),correct=Math.min(done,Math.max(0,Number(inputs[1].value)||0)),note=inputs[2].value.trim(),rows=read(`m${pad(n)}:tec:rounds`,[]);rows[i]={done,correct,note,date:new Date().toISOString()};write(`m${pad(n)}:tec:rounds`,rows);hydrate()}
function saveNote(mod,n){const ta=$('textarea',mod),text=ta?.value.trim();if(!text)return;const notes=noteList(n);notes.push({text,at:Date.now()});write(`m${pad(n)}:notes`,notes);hydrate()}
function openTool(tool,n){
 try{
  if(tool==='decorando'&&typeof global.openEmbeddedTool==='function')return global.openEmbeddedTool('decorando',{discipline:'ptra',topicId:`ptra-m${pad(n)}`},null);
  if(tool==='vade'&&typeof global.openEmbeddedTool==='function')return global.openEmbeddedTool('vade',{},null);
  if(tool==='tec'){
   if(typeof global.tecAbrirListaContexto==='function')return global.tecAbrirListaContexto('Direito Processual do Trabalho','');
   if(typeof global.openTecCadernos==='function')return global.openTecCadernos();
  }
 }catch(e){console.warn('Ferramenta Processo do Trabalho',e)}
 return false;
}
function openTec(id){const t=tecMeta(id);if(!t)return false;try{if(typeof global.tecAbrirCaderno==='function')return global.tecAbrirCaderno(t.url);global.open?.(t.url,'_blank','noopener')}catch(_){ }return false}
async function moduleData(n){const d=MODULES[String(Number(n))]||MODULES[Number(n)];if(!d)throw new Error('Módulo não encontrado no pacote aprovado.');return d}
function ensureOverlay(){
 let o=$('#ptra-native-overlay');if(o)return o;
 o=document.createElement('div');o.id='ptra-native-overlay';o.className='ptra-native-overlay';o.hidden=true;o.innerHTML=`<div class="ptra-native-overlay-shell"><header><button type="button" data-ptra-close>← Fechar</button><div><small id="ptra-ov-kicker"></small><h2 id="ptra-ov-title"></h2></div><div id="ptra-ov-actions" class="ptra-native-overlay-actions"></div></header><div class="ptra-native-overlay-progress"><i id="ptra-ov-progress"></i><b id="ptra-ov-pct"></b></div><main id="ptra-ov-content" class="ptra-native-overlay-content"></main></div>`;document.body.appendChild(o);
 $('[data-ptra-close]',o).onclick=closeOverlay;document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!o.hidden)closeOverlay()});return o;
}
function showLoading(meta,label){const o=ensureOverlay();o.hidden=false;document.documentElement.classList.add('ptra-native-reader-open');$('#ptra-ov-kicker',o).textContent=`MÓDULO ${pad(meta.number)} • ${label}`;$('#ptra-ov-title',o).textContent=meta.title;$('#ptra-ov-actions',o).innerHTML='';$('#ptra-ov-progress',o).style.width='0%';$('#ptra-ov-pct',o).textContent='';$('#ptra-ov-content',o).innerHTML='<div class="ptra-native-loading">Carregando material…</div>';return o}
async function openReader(n,kind){
 const meta=moduleMeta(n),o=showLoading(meta,kind==='resumido'?'VERSÃO RESUMIDA':'VERSÃO COMPLETA');reader={n,kind};quiz=null;
 try{const d=await moduleData(n),mat=d[kind],state=read(`m${pad(n)}:reading:${kind}`,{pct:0,scroll:0});const c=$('#ptra-ov-content',o);c.className='ptra-native-overlay-content ptra-native-reader';c.innerHTML=`<article class="ptra-native-reader-article"><div class="ptra-native-source-note">Fonte preservada: ${esc(mat.pdf)} • ${mat.pages.length} páginas extraídas do PDF aprovado.</div>${mat.pages.map((p,i)=>`<section class="ptra-native-page" data-page="${i+1}"><div class="ptra-native-page-no">PÁGINA ${i+1}</div><div class="ptra-native-page-text">${esc(p)}</div></section>`).join('')}</article>`;
  const act=$('#ptra-ov-actions',o);act.innerHTML='<a class="ptra-native-overlay-link" href="'+esc(mat.pdf)+'" target="_blank" rel="noopener">PDF ORIGINAL ↗</a><button type="button" data-font-minus>A−</button><button type="button" data-font-plus>A+</button>';let fs=Number(read('reader:font',16))||16;const apply=()=>{c.style.setProperty('--ptra-reader-font',fs+'px');write('reader:font',fs)};apply();$('[data-font-minus]',o).onclick=()=>{fs=Math.max(13,fs-1);apply()};$('[data-font-plus]',o).onclick=()=>{fs=Math.min(24,fs+1);apply()};
  requestAnimationFrame(()=>{c.scrollTop=Math.max(0,Number(state.scroll)||0);updateRead(false)});c.onscroll=()=>updateRead(false);
 }catch(e){showError(e)}
}
function updateRead(force){if(!reader)return;const o=ensureOverlay(),c=$('#ptra-ov-content',o);if(!c||!c.scrollHeight)return;const prev=read(`m${pad(reader.n)}:reading:${reader.kind}`,{pct:0,scroll:0});const raw=c.scrollHeight<=c.clientHeight?100:(c.scrollTop/(c.scrollHeight-c.clientHeight))*100;const pct=Math.max(clamp(prev.pct||0),clamp(raw),force?clamp(raw):0);write(`m${pad(reader.n)}:reading:${reader.kind}`,{pct:pct>=99?100:pct,scroll:c.scrollTop,complete:pct>=99,at:Date.now()});$('#ptra-ov-progress',o).style.width=(pct>=99?100:pct)+'%';$('#ptra-ov-pct',o).textContent=(pct>=99?100:pct)+'%';markGenericDone(reader.n)}
function qKey(n,kind){return `m${pad(n)}:questions:${kind}`}
async function openQuiz(n,kind,reviewErrors){
 const meta=moduleMeta(n),o=showLoading(meta,`QUESTÕES ${kind.toUpperCase()}`);reader=null;
 try{const d=await moduleData(n),all=d[kind].questions||[],history=qHistory(n,kind),wrongLast=history.length?(history[history.length-1].wrong||[]):[],qs=reviewErrors?all.filter(q=>wrongLast.includes(q.n)):all;if(!qs.length&&reviewErrors)return openQuiz(n,kind,false);quiz={n,kind,d,qs,idx:0,answers:{},confirmed:{},reviewErrors:!!reviewErrors};$('#ptra-ov-content',o).className='ptra-native-overlay-content ptra-native-quiz';renderQuestion()}catch(e){showError(e)}
}
function renderQuestion(){const s=quiz;if(!s)return;const o=ensureOverlay(),q=s.qs[s.idx],sel=s.answers[q.n],conf=s.confirmed[q.n];$('#ptra-ov-progress',o).style.width=((s.idx+1)/s.qs.length*100)+'%';$('#ptra-ov-pct',o).textContent=`${s.idx+1}/${s.qs.length}`;$('#ptra-ov-content',o).innerHTML=`<div class="ptra-native-q-shell"><div class="ptra-native-q-meta"><span>Questão ${s.idx+1} de ${s.qs.length}</span><span>${s.reviewErrors?'REVISÃO DE ERROS':'BATERIA ORIGINAL'}</span></div><h3>${esc(q.stem)}</h3><div class="ptra-native-options">${(q.options||[]).map(opt=>`<label class="ptra-native-option ${sel===opt.letter?'selected':''} ${conf?(opt.letter===q.answer?'correct':sel===opt.letter?'wrong':''):''}"><input type="radio" name="ptra-opt" value="${esc(opt.letter)}" ${sel===opt.letter?'checked':''} ${conf?'disabled':''}><b>${esc(opt.letter)}</b><span>${esc(opt.text)}</span></label>`).join('')}</div>${conf?`<div class="ptra-native-feedback ${sel===q.answer?'good':'bad'}"><b>${sel===q.answer?'Resposta correta.':'Resposta incorreta.'}</b><div>Gabarito: ${esc(q.answer)}</div>${q.comment?`<div>${esc(q.comment)}</div>`:'<div>O PDF não traz comentário individual adicional para esta questão.</div>'}</div>`:''}<div class="ptra-native-q-actions"><button type="button" data-q-prev ${s.idx===0?'disabled':''}>ANTERIOR</button><button type="button" class="primary" data-q-confirm ${(!sel||conf)?'disabled':''}>CONFIRMAR RESPOSTA</button><button type="button" data-q-next>${s.idx===s.qs.length-1?'FINALIZAR':'PRÓXIMA'}</button></div></div>`;
 $$('input[name="ptra-opt"]',$('#ptra-ov-content',o)).forEach(x=>x.onchange=()=>{s.answers[q.n]=x.value;renderQuestion()});const confBtn=$('[data-q-confirm]',o);if(confBtn)confBtn.onclick=()=>{s.confirmed[q.n]=true;renderQuestion()};$('[data-q-prev]',o).onclick=()=>{if(s.idx>0){s.idx--;renderQuestion()}};$('[data-q-next]',o).onclick=()=>{if(s.idx<s.qs.length-1){s.idx++;renderQuestion()}else finishQuiz()};
}
function finishQuiz(){const s=quiz,o=ensureOverlay(),answered=s.qs.filter(q=>s.confirmed[q.n]),correct=answered.filter(q=>s.answers[q.n]===q.answer),wrong=answered.filter(q=>s.answers[q.n]!==q.answer).map(q=>q.n),pct=answered.length?Math.round(correct.length/answered.length*100):0,h=qHistory(s.n,s.kind);h.push({at:Date.now(),answered:answered.length,correct:correct.length,wrong,pct,review:s.reviewErrors});write(qKey(s.n,s.kind),h);const best=Math.max(0,...h.map(x=>Number(x.pct)||0));$('#ptra-ov-progress',o).style.width='100%';$('#ptra-ov-pct',o).textContent='100%';$('#ptra-ov-content',o).innerHTML=`<div class="ptra-native-result"><span>RESULTADO</span><h2>${s.kind==='resumido'?'Versão resumida':'Versão completa'}</h2><div class="ptra-native-result-grid"><article><b>${answered.length}</b><small>respondidas</small></article><article><b>${correct.length}</b><small>acertos</small></article><article><b>${pct}%</b><small>aproveitamento</small></article></div><p>Último resultado: ${pct}% • Melhor resultado: ${best}%</p><div class="ptra-native-result-actions"><button type="button" class="primary" data-q-redo>REFAZER QUESTÕES</button><button type="button" data-q-errors ${wrong.length?'':'disabled'}>REVISAR MEUS ERROS (${wrong.length})</button></div></div>`;$('[data-q-redo]',o).onclick=()=>openQuiz(s.n,s.kind,false);const er=$('[data-q-errors]',o);if(er&&!er.disabled)er.onclick=()=>openQuiz(s.n,s.kind,true)}
async function imageData(n){const meta=moduleMeta(n),src=meta.infographic||`/assets/ptra/infographics/m${pad(n)}.avif`;const r=await fetch(src,{cache:'force-cache'});if(!r.ok)throw new Error('Infográfico não encontrado no pacote.');return URL.createObjectURL(await r.blob())}
async function openImage(n){const meta=moduleMeta(n),o=showLoading(meta,'INFOGRÁFICO / MAPA VISUAL');reader=null;quiz=null;imageZoom=1;try{const src=await imageData(n);$('#ptra-ov-progress',o).style.width='100%';$('#ptra-ov-pct',o).textContent='ORIGINAL';$('#ptra-ov-actions',o).innerHTML='<button type="button" data-img-minus>−</button><button type="button" data-img-plus>+</button><button type="button" data-img-fit>Ajustar</button>';const c=$('#ptra-ov-content',o);c.className='ptra-native-overlay-content ptra-native-image-viewer';c.innerHTML=`<img src="${src}" alt="Infográfico do Módulo ${pad(n)} — ${esc(meta.title)}">`;const img=$('img',c),apply=()=>{img.style.width=(imageZoom*100)+'%';img.style.maxWidth=imageZoom===1?'1050px':'none'};$('[data-img-minus]',o).onclick=()=>{imageZoom=Math.max(.5,imageZoom-.25);apply()};$('[data-img-plus]',o).onclick=()=>{imageZoom=Math.min(3,imageZoom+.25);apply()};$('[data-img-fit]',o).onclick=()=>{imageZoom=1;apply()};apply()}catch(e){showError(e)}}
function showError(e){const o=ensureOverlay();$('#ptra-ov-content',o).innerHTML=`<div class="ptra-native-error"><b>Não foi possível abrir este material.</b><p>${esc(e?.message||e)}</p></div>`}
function closeOverlay(){const o=ensureOverlay();if(reader)updateRead(true);o.hidden=true;$('#ptra-ov-content',o).innerHTML='';$('#ptra-ov-content',o).onscroll=null;reader=null;quiz=null;document.documentElement.classList.remove('ptra-native-reader-open');try{global.renderSubjects?.()}catch(_){hydrate()}}
function wrapRender(){
 const original=global.renderSubjects;if(typeof original==='function'&&!original.__ptraWrapped){const wrapped=function(){mutateSubject();const r=original.apply(this,arguments);hydrate();return r};wrapped.__ptraWrapped=true;global.renderSubjects=wrapped}
 const grid=global.renderDisciplineGrid;if(typeof grid==='function'&&!grid.__ptraWrapped){const wrappedGrid=function(){mutateSubject();const r=grid.apply(this,arguments);const card=document.querySelector('#disciplineGrid .disc-card[data-id="ptra"]');if(card){const sm=$('small',card),meta=$('.disc-meta',card),st=stats();if(sm)sm.textContent='21 módulos • curso integrado';if(meta)meta.textContent=`${st.done}/${st.total} módulos · ${st.pct}%`}return r};wrappedGrid.__ptraWrapped=true;global.renderDisciplineGrid=wrappedGrid}
 const resume=global.centralResumeLast;if(typeof resume==='function'&&!resume.__ptraWrapped){const wrappedResume=function(){let x=null;try{x=JSON.parse(localStorage.getItem('central-v6:last')||'null')}catch(_){ }if(x?.ptraModule)return openModule(x.ptraModule);return resume.apply(this,arguments)};wrappedResume.__ptraWrapped=true;global.centralResumeLast=wrappedResume}
 const originalStats=global.subjStats;if(typeof originalStats==='function'&&!originalStats.__ptraWrapped){const wrappedStats=function(subject){if(subject?.id==='ptra')return {...stats(),unit:'módulos'};return originalStats.apply(this,arguments)};wrappedStats.__ptraWrapped=true;global.subjStats=wrappedStats}
 const originalMapPct=global.mapaTopicPct;if(typeof originalMapPct==='function'&&!originalMapPct.__ptraWrapped){const wrappedMapPct=function(s,idx,t){if(s?.id==='ptra')return theoryPct(Number(idx)+1);return originalMapPct.apply(this,arguments)};wrappedMapPct.__ptraWrapped=true;global.mapaTopicPct=wrappedMapPct}
 const map=global.mapaOpenTopic;if(typeof map==='function'&&!map.__ptraWrapped){const wrappedMap=function(sid,uid,idx){if(sid==='ptra')return openModule(Number(idx)+1);return map.apply(this,arguments)};wrappedMap.__ptraWrapped=true;global.mapaOpenTopic=wrappedMap}
}
const api={stats,renderMaster,hydrate,openModule,openReader,openQuiz,openImage,moduleData,legacyMigration:()=>{try{return JSON.parse(get(LEGACY_MARK)||'null')}catch(_){return null}}};global.PtraNative=api;
preserveLegacy();mutateSubject();wrapRender();ensureOverlay();
function boot(){mutateSubject();wrapRender();try{global.renderAll?.()}catch(_){try{global.renderSubjects?.()}catch(__){}}hydrate();}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(boot,0));else setTimeout(boot,0);
})(window);