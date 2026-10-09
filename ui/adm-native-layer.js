(function(g){'use strict';
const INDEX=(g.ADM_NATIVE_INDEX&&g.ADM_NATIVE_INDEX.modules)||{};
const CONTENT=g.ADM_NATIVE_CONTENT=g.ADM_NATIVE_CONTENT||{};
const LEGACY=g.ADM_NATIVE_LEGACY=g.ADM_NATIVE_LEGACY||{};
const loaded={};
const k=(uid,kind,suffix)=>`central-v6:adm-native:${uid}:${kind}:${suffix}`;
const clamp=n=>Math.max(0,Math.min(100,Math.round(Number(n)||0)));
function num(uid){return Number(INDEX[uid]?.number)||0}
function progress(uid,kind){return clamp(localStorage.getItem(k(uid,kind,'read'))||0)}
function moduleProgress(uid){return Math.round((progress(uid,'summary')+progress(uid,'complete'))/2)}
function stats(){const uids=Object.keys(INDEX),vals=uids.map(moduleProgress),done=vals.filter(x=>x>=100).length,pct=Math.round(vals.reduce((a,b)=>a+b,0)/(vals.length||1));return {total:uids.length,done,pct,unit:'módulos'}}
function loadData(uid){if(CONTENT[uid])return Promise.resolve(CONTENT[uid]);if(loaded[uid])return loaded[uid];const n=String(num(uid)).padStart(2,'0');loaded[uid]=new Promise((resolve,reject)=>{const script=document.createElement('script');script.src='/content/adm/m'+n+'-native-data-lite.js?v=20261005adm1';script.onload=()=>{if(CONTENT[uid])resolve(CONTENT[uid]);else{loaded[uid]=null;reject(new Error('Conteúdo ADM M'+n+' não localizado'))}};script.onerror=()=>{loaded[uid]=null;reject(new Error('Falha ao carregar conteúdo ADM M'+n))};document.head.appendChild(script)});return loaded[uid]}
function esc(s){return String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function escAttr(s){return esc(s).replace(/`/g,'&#96;')}
function existingTopic(uid){try{return typeof g.topicByUid==='function'?g.topicByUid(uid):null}catch(_){return null}}
function toolButton(uid,kind,label){const x=existingTopic(uid),t=x?.t;const jsUid=String(uid).replace(/'/g,"\\'");if(kind==='anki')return `<button onclick="AdmNative.tool('${jsUid}','anki')">${label}</button>`;if(kind==='decorando')return `<button onclick="AdmNative.tool('${jsUid}','decorando')">${label}</button>`;if(kind==='vade')return `<button onclick="AdmNative.tool('${jsUid}','vade')">${label}</button>`;if(kind==='tec')return `<button onclick="AdmNative.tool('${jsUid}','tec')">${label}</button>`;return `<button class="is-disabled" disabled>${label}</button>`}
function tools(uid){return `<div class="adm-native-module-tools"><span>FERRAMENTAS DO MÓDULO</span><div>${toolButton(uid,'anki','🧠 Anki')}${toolButton(uid,'decorando','📖 Lei em Dia')}${toolButton(uid,'vade','⚖ Vade Mecum')}${toolButton(uid,'tec','▤ Cadernos TEC')}</div></div>`}
function externalStats(uid){let rows=[];try{const rawKey=`central-v6:module-rounds:${uid}`;rows=JSON.parse(localStorage.getItem(rawKey)||'[]');if(!Array.isArray(rows)||!rows.length){const perf=typeof g.getPerf==='function'?g.getPerf(uid):[];if(Array.isArray(perf)&&perf.length)rows=perf.slice(-3).map(x=>({done:x.q,correct:x.c}))}}catch(_){rows=[]}const normalized=(Array.isArray(rows)?rows:[]).slice(0,3).map(r=>({done:Math.max(0,Number(r.done??r.valid??r.q)||0),correct:Math.max(0,Number(r.correct??r.c)||0)}));while(normalized.length<3)normalized.push({done:0,correct:0});const completed=normalized.filter(r=>r.done>0).length,done=normalized.reduce((n,r)=>n+r.done,0),correct=normalized.reduce((n,r)=>n+Math.min(r.correct,r.done),0),accuracy=done?Math.round(correct/done*100):null;return {completed,rounds:3,done,correct,accuracy,pct:Math.round(completed/3*100)}}
function progressPanel(uid){const theory=moduleProgress(uid),ext=externalStats(uid);return `<section class="adm-native-progress-panel"><div class="adm-native-progress-line"><div class="adm-native-progress-copy"><b>Progresso da teoria</b><span>${theory}% concluído</span></div><div class="adm-native-wide-bar"><i data-adm-theory-bar style="width:${theory}%"></i></div><small>Versão resumida + versão completa</small></div><div class="adm-native-progress-line"><div class="adm-native-progress-copy"><b>Questões externas</b><span>${ext.pct}% · ${ext.completed}/3 rodadas</span></div><div class="adm-native-wide-bar external"><i data-adm-external-bar style="width:${ext.pct}%"></i></div><small>${ext.done?`${ext.done} feitas · ${ext.correct} acertos · ${ext.accuracy}% de aproveitamento`:'Nenhuma rodada registrada ainda'}</small></div></section>`}
function noteStorageKey(uid){try{if(typeof g.key==='function')return g.key(uid,'notes')}catch(_){}return `central-v6:${uid}:notes`}
function readNotes(uid){try{if(typeof g.getNotes==='function'){const x=g.getNotes(uid);if(Array.isArray(x))return x}const x=JSON.parse(localStorage.getItem(noteStorageKey(uid))||'[]');return Array.isArray(x)?x:[]}catch(_){return []}}
function notesPanel(uid){const notes=readNotes(uid);return `<section class="adm-native-notes"><div class="adm-native-notes-head"><div><span>ANOTAÇÕES DO MÓDULO</span><b>Registre sua dúvida, regra ou pegadinha</b></div><small>${notes.length} salva${notes.length===1?'':'s'}</small></div><textarea data-adm-note-input="${escAttr(uid)}" placeholder="Escreva uma anotação sobre este módulo..."></textarea><div class="adm-native-note-actions"><button onclick="AdmNative.saveNote('${String(uid).replace(/'/g,"\\'")}')">Salvar anotação</button></div><div class="adm-native-note-list">${notes.slice().reverse().slice(0,8).map(n=>`<article><p>${esc(n.text||'')}</p><small>${n.at?new Date(n.at).toLocaleString('pt-BR'):''}</small></article>`).join('')||'<small>Nenhuma anotação salva neste módulo.</small>'}</div></section>`}
function card(uid,kind,title,desc,qs){const p=progress(uid,kind);return `<article class="adm-native-card" data-kind="${kind}"><div class="adm-native-card-top"><span>${kind==='summary'?'RESUMO':'TEORIA'}</span><b>${p}% lido</b></div><h4>${title}</h4><p>${desc}</p><div class="adm-native-mini-bar"><i style="width:${p}%"></i></div><div class="adm-native-card-actions"><button onclick="AdmNative.open('${uid}','${kind}',false)">Abrir leitura</button><button class="ghost" onclick="AdmNative.open('${uid}','${kind}',true)">${qs} questões</button></div></article>`}
function visualCard(uid){const m=INDEX[uid];return `<article class="adm-native-card adm-native-visual"><div class="adm-native-card-top"><span>VISUAL REAL</span><b>Imagem do pacote</b></div><h4>Infográfico do módulo</h4><p>Arte original anexada ao pacote atualizado. Não altera o percentual de leitura.</p><div class="adm-native-card-actions"><button onclick="AdmNative.openImage('${uid}')">Abrir infográfico</button></div></article>`}
function cards(uid){const m=INDEX[uid];if(!m)return '';return `<section class="adm-native-zone" data-adm-native="${uid}"><div class="adm-native-zone-head"><div><span>MÓDULO ${String(m.number).padStart(2,'0')}</span><b>${esc(m.title)}</b></div><strong>${moduleProgress(uid)}% leitura</strong></div>${tools(uid)}${progressPanel(uid)}<div class="adm-native-material-grid">${card(uid,'summary','Versão resumida','Revisão objetiva do módulo, com 5 questões internas no final.',5)}${card(uid,'complete','Versão completa','Teoria integral do módulo, com 10 questões internas no final.',10)}${visualCard(uid)}</div>${sharingPanel(uid)}<div class="adm-native-hint">As questões internas ficam junto da leitura. O progresso externo acompanha as 3 rodadas do módulo.</div></section>`}
function sharingPanel(uid){const number=num(uid),code=`M${String(number).padStart(2,'0')}`,all=Array.isArray(g.ADM_SHARING_LINKS?.items)?g.ADM_SHARING_LINKS.items:[],rows=all.filter(x=>x.modulo===code);if(!rows.length)return '';return `<section class="adm-native-preserved adm-native-sharing" aria-label="Cadernos de questões ${esc(code)}"><div class="adm-native-preserved-head"><b>Cadernos de questões</b><small>${rows.length} caderno${rows.length===1?'':'s'} vinculado${rows.length===1?'':'s'} ao ${esc(code)}</small></div><div class="adm-native-sharing-list">${rows.map(x=>{const reviewed=x.status==='Em revisão',label=x.subdivisao?`${x.subdivisao} · ${x.titulo}`:`${code} geral · ${x.titulo}`,detail=reviewed?`${x.status} · ${x.pendencia}`:`${Number(x.quantidade)} questões`;return `<a class="adm-native-sharing-link${reviewed?' is-review':''}" href="${escAttr(x.link)}" target="_blank" rel="noopener noreferrer" data-adm-share="${escAttr(x.subdivisao||code)}"><span><b>${esc(label)}</b><small>${esc(detail)}</small></span><span class="adm-native-sharing-action">Abrir caderno ↗</span></a>`}).join('')}</div></section>`}
function moduleSpecific(el,n){if(!el||el.nodeType!==1)return false;const s=((el.id||'')+' '+(el.className||'')).toLowerCase();const pats=[`adm-m${n}`,`adm-m${String(n).padStart(2,'0')}`,`adm${n}x`,`adm${String(n).padStart(2,'0')}x`];return pats.some(p=>s.includes(p))}
function cleanLegacyHtml(html,uid){
 const n=num(uid),host=document.createElement('div');host.innerHTML=html;
 const legacy=[];
 [...host.children].forEach(el=>{if(moduleSpecific(el,n)){legacy.push(el.outerHTML)}});
 if(legacy.length)LEGACY[uid]=legacy.join('\n');
 let tec='';
 host.querySelectorAll('.resource').forEach(el=>{const label=el.querySelector('.resource-label')?.textContent||'';if(/Filtro do TEC/i.test(label)){el.classList.add('adm-native-tec-filter');tec=el.outerHTML}});
 let perf='';
 const form=host.querySelector('.perf-form');
 if(form){perf+=form.outerHTML;let el=form.nextElementSibling;while(el&&(el.classList.contains('history-label')||el.classList.contains('hist'))){perf+=el.outerHTML;el=el.nextElementSibling}}
 const shell=document.createElement('div');
 shell.innerHTML=cards(uid)+(tec?`<section class="adm-native-preserved"><div class="adm-native-preserved-head"><b>Filtro do TEC deste módulo</b><small>Mapeamento original preservado</small></div>${tec}</section>`:'')+(perf?`<section class="adm-native-preserved adm-native-external-entry"><div class="adm-native-preserved-head"><b>Registrar questões externas</b><small>Alimenta a barra de 3 rodadas</small></div>${perf}</section>`:'')+notesPanel(uid);
 return shell.innerHTML
}
function patchRenderDetail(){if(g.__admNativeRenderDetailPatched||typeof g.renderDetail!=='function')return false;const base=g.renderDetail;g.renderDetail=function(s,t,r){const html=base.apply(this,arguments);if(!s||s.id!=='adm'||!t||!INDEX[t.uid])return html;return cleanLegacyHtml(html,t.uid)};g.__admNativeRenderDetailPatched=true;try{g.renderAll&&g.renderAll()}catch(_){}return true}
function patchSubjStats(){if(g.__admNativeSubjStatsPatched||typeof g.subjStats!=='function')return;const base=g.subjStats;g.subjStats=function(s){if(s&&s.id==='adm')return stats();return base.apply(this,arguments)};g.__admNativeSubjStatsPatched=true}
function setRead(uid,kind,v){const old=progress(uid,kind),next=Math.max(old,clamp(v));localStorage.setItem(k(uid,kind,'read'),String(next));updateCards(uid);updateSubject()}
function updateCards(uid){
  document.querySelectorAll(`[data-adm-native="${uid}"]`).forEach(z=>{
    const strong=z.querySelector('.adm-native-zone-head strong');
    if(strong)strong.textContent=moduleProgress(uid)+'% leitura';
    ['summary','complete'].forEach(kind=>{
      const c=z.querySelector(`[data-kind="${kind}"]`);if(!c)return;
      const p=progress(uid,kind),b=c.querySelector('.adm-native-card-top b'),i=c.querySelector('.adm-native-mini-bar i');
      if(b)b.textContent=p+'% lido';if(i)i.style.width=p+'%';
    });
    const theory=moduleProgress(uid),th=z.querySelector('[data-adm-theory-bar]');
    if(th)th.style.width=theory+'%';
    const theoryCopy=z.querySelector('.adm-native-progress-line:first-child .adm-native-progress-copy span');
    if(theoryCopy)theoryCopy.textContent=theory+'% concluído';
    const ext=externalStats(uid),ex=z.querySelector('[data-adm-external-bar]');
    if(ex)ex.style.width=ext.pct+'%';
    const extLine=z.querySelectorAll('.adm-native-progress-line')[1];
    if(extLine){
      const span=extLine.querySelector('.adm-native-progress-copy span'),small=extLine.querySelector('small');
      if(span)span.textContent=`${ext.pct}% · ${ext.completed}/3 rodadas`;
      if(small)small.textContent=ext.done?`${ext.done} feitas · ${ext.correct} acertos · ${ext.accuracy}% de aproveitamento`:'Nenhuma rodada registrada ainda';
    }
  });
}
function updateSubject(){const el=document.querySelector('.subject[data-id="adm"]');if(!el)return;const uids=Object.keys(INDEX),vals=uids.map(moduleProgress),pct=Math.round(vals.reduce((a,b)=>a+b,0)/(vals.length||1)),done=vals.filter(x=>x>=100).length;const c=el.querySelector('.subject-count'),p=el.querySelector('.subject-pct'),bar=el.querySelector('.subject-bar span');if(c)c.textContent=`${done}/${uids.length} módulos`;if(p){p.textContent=pct+'%';p.classList.toggle('done',pct===100)}if(bar)bar.style.width=pct+'%';el.querySelectorAll('.topic-item').forEach(row=>{const uid=row.dataset.uid;if(!INDEX[uid])return;row.classList.add('adm-native-module-row');const origin=row.querySelector('.topic-origin');if(origin)origin.textContent=`Módulo ${String(num(uid)).padStart(2,'0')}`;const type=row.querySelector('.type');if(type)type.textContent=moduleProgress(uid)+'%';})}
let active=null;
function buildToc(body){const hs=[...body.querySelectorAll('h1,h2,h3')].filter(h=>!h.closest('details'));return hs.slice(0,40).map((h,i)=>{if(!h.id)h.id='adm-native-h-'+i;return `<button onclick="document.getElementById('${h.id}').scrollIntoView({behavior:'smooth',block:'start'})">${esc(h.textContent)}</button>`}).join('')}
async function open(uid,kind,jump){
 if(!INDEX[uid])return;
 close();
 const session=active={uid,kind},reader=g.CentralNativeReadingSession;
 const o=reader.create({id:'adm-native-reader',subject:'adm',title:INDEX[uid].title,
  eyebrow:`DIREITO ADMINISTRATIVO · MÓDULO ${String(num(uid)).padStart(2,'0')} · ${kind==='summary'?'RESUMIDO':'COMPLETO'}`,
  close,finish:()=>markRead(100)});
 document.documentElement.classList.add('adm-native-reader-open');
 reader.percent(o,progress(uid,kind));
 try{
  const d=await loadData(uid);if(active!==session)return;
  if(!d)throw new Error('Conteúdo ADM não localizado');
  let content=kind==='summary'?d.summaryHtml:LEGACY[uid];
  if(!content)throw new Error('Teoria ADM não localizada');
  if(kind==='complete'&&d.completeAppendHtml)content+=d.completeAppendHtml;
  const body=reader.show(o,content,buildToc,Number(localStorage.getItem(k(uid,kind,'scroll'))||0),onScroll);
  if(jump)requestAnimationFrame(()=>requestAnimationFrame(()=>{if(active!==session)return;const q=[...body.querySelectorAll('h1,h2,h3')].find(h=>/quest/i.test(h.textContent));q?.scrollIntoView({block:'start'})}));
  localStorage.setItem('central-v6:last',JSON.stringify({topicUid:uid,title:`Direito Administrativo · Módulo ${d.number} · ${d.title}`,at:Date.now()}));
  g.renderContinue?.();
 }catch(error){if(active===session){console.warn('[ADM reader]',error);reader.fail(o,()=>open(uid,kind,jump))}}
}
function onScroll(){
 const o=document.getElementById('adm-native-reader'),body=o?.querySelector('.bc-native-scroll');
 if(!active||!g.CentralNativeReadingSession.canTrack(o,body))return;
 const available=body.scrollHeight-body.clientHeight;
 if(available>0)markRead(body.scrollTop/available*100);
 localStorage.setItem(k(active.uid,active.kind,'scroll'),String(Math.round(body.scrollTop)));
}
function markRead(value){
 const o=document.getElementById('adm-native-reader'),body=o?.querySelector('.bc-native-scroll');
 if(!active||!g.CentralNativeReadingSession.canTrack(o,body))return;
 setRead(active.uid,active.kind,value);g.CentralNativeReadingSession.percent(o,progress(active.uid,active.kind));
}
function close(){
 document.getElementById('adm-native-reader')?.remove();document.documentElement.classList.remove('adm-native-reader-open');active=null;
 try{g.renderDisciplineGrid?.()}catch(_){}
}
function fontSize(){ /* Font size is controlled by the shared reading appearance. */ }
function openImage(uid){
 const m=INDEX[uid],sprite=g.ADM_NATIVE_INDEX?.sprite;if(!m||!sprite)return;
 let v=document.getElementById('adm-native-image-viewer');
 if(!v){document.body.insertAdjacentHTML('beforeend',`<div id="adm-native-image-viewer" class="adm-native-image-viewer" hidden><header><b id="adm-native-image-title"></b><button onclick="AdmNative.closeImage()">✕</button></header><div id="adm-native-image-host"></div></div>`);v=document.getElementById('adm-native-image-viewer')}
 v.querySelector('#adm-native-image-title').textContent=`Módulo ${m.number} · ${m.title}`;
 const host=v.querySelector('#adm-native-image-host');
 host.innerHTML=`<svg class="adm-native-infographic-svg" viewBox="0 0 ${sprite.width} ${m.spriteHeight}" role="img" aria-label="Infográfico do módulo ${m.number}"><image href="${sprite.src}" x="0" y="-${m.spriteY}" width="${sprite.width}" height="${sprite.height}" preserveAspectRatio="xMinYMin meet"/></svg>`;
 v.hidden=false
}
function closeImage(){const v=document.getElementById('adm-native-image-viewer');if(v)v.hidden=true}
function tool(uid,kind){const x=existingTopic(uid),t=x?.t;try{if(kind==='anki'){if(t?.ankiDeck&&typeof g.openAnkiDeck==='function')return g.openAnkiDeck(t.ankiDeck,t.title);return alert('O baralho Anki deste módulo será aberto pela Central integrada.')}if(kind==='decorando'){if(typeof g.openEmbeddedTool==='function')return g.openEmbeddedTool('decorando',{discipline:'adm',module:uid},null);return alert('Lei em Dia estará disponível na Central integrada.')}if(kind==='vade'){if(typeof g.openEmbeddedTool==='function')return g.openEmbeddedTool('vade',{},null);return alert('Vade Mecum estará disponível na Central integrada.')}if(kind==='tec'){const zone=document.querySelector(`[data-adm-native="${CSS.escape(uid)}"]`)?.closest('.detail-panel');const filter=zone?.querySelector('.adm-native-tec-filter');if(filter){filter.scrollIntoView({behavior:'smooth',block:'center'});filter.classList.add('adm-native-pulse');setTimeout(()=>filter.classList.remove('adm-native-pulse'),1200);return}if(typeof g.centralSidebarAction==='function')return g.centralSidebarAction('tec-cadernos',null);if(typeof g.openTecCadernos==='function')return g.openTecCadernos();return alert('Cadernos TEC estarão disponíveis na Central integrada.')}}catch(e){console.warn('ADM tool',e)}}
function saveNativeNote(uid){const input=document.querySelector(`[data-adm-note-input="${CSS.escape(uid)}"]`),text=String(input?.value||'').trim();if(!text)return;if(typeof g.saveNote==='function'&&document.getElementById(`note-${uid}`)){try{return g.saveNote(uid)}catch(_){}}const notes=readNotes(uid);notes.push({id:Date.now(),text,at:new Date().toISOString()});localStorage.setItem(noteStorageKey(uid),JSON.stringify(notes));if(input)input.value='';document.querySelectorAll(`[data-adm-native="${CSS.escape(uid)}"]`).forEach(z=>{const old=z.closest('.detail-panel')?.querySelector('.adm-native-notes');if(old){const tmp=document.createElement('div');tmp.innerHTML=notesPanel(uid);old.replaceWith(tmp.firstElementChild)}})}
function install(){if(!patchRenderDetail())return false;patchSubjStats();updateSubject();const host=document.getElementById('subjects');if(host){const opts={childList:true,subtree:true};const mo=new MutationObserver(()=>{mo.disconnect();try{updateSubject();Object.keys(INDEX).forEach(updateCards)}finally{mo.observe(host,opts)}});mo.observe(host,opts)}return true}
function boot(){if(install())return;let n=0,t=setInterval(()=>{if(install()||++n>160)clearInterval(t)},50)}
g.AdmNative={open,close,font:fontSize,openImage,closeImage,progress,moduleProgress,stats,updateSubject,tool,saveNote:saveNativeNote,externalStats,version:'2026.10.05-prod1'};if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})(window);
