/* Central de Estudos — ajustes estruturais v6.6.98
   Não altera conteúdo didático, questões, Anki ou Decorando. */
(() => {
  'use strict';

  const VERSION = '6.6.98';
  const PLAN_KEY = 'CENTRAL_CRONOGRAMA_6M_V2';
  let planCache = null;
  let planLoading = null;
  let renderTimer = 0;
  let applying = false;

  window.__CENTRAL_VERSION__ = VERSION;

  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({
    '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'
  }[c]));
  const pad = (n) => String(n).padStart(2, '0');
  const todayISO = () => {
    const d = new Date();
    return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`;
  };
  const dateObj = (s) => {
    const [y,m,d] = String(s).split('-').map(Number);
    return new Date(y, m-1, d);
  };
  const iso = (d) => `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`;
  const addDays = (s,n) => { const d=dateObj(s); d.setDate(d.getDate()+n); return iso(d); };
  const diffDays = (a,b) => Math.round((dateObj(b)-dateObj(a))/86400000);
  const nextWeekday = (s) => {
    const d=dateObj(s);
    while (d.getDay()===0 || d.getDay()===6) d.setDate(d.getDate()+1);
    return iso(d);
  };

  function injectStyle(){
    if (document.getElementById('central-ui-v6698-style')) return;
    const style=document.createElement('style');
    style.id='central-ui-v6698-style';
    style.textContent=`
      .central-plan-agenda-v6698{border-top:1px solid var(--line,#dfe5ee);margin-top:8px;padding-top:8px}
      .central-plan-head-v6698{display:flex;align-items:center;justify-content:space-between;gap:8px;padding:6px 2px 8px}
      .central-plan-head-v6698 b{font-size:12px}.central-plan-head-v6698 span{font-size:10px;color:var(--muted,#64748b)}
      .central-plan-row-v6698{position:relative}.central-plan-row-v6698 .central-late-v6698{display:inline-flex;margin-left:6px;padding:1px 6px;border-radius:999px;font-size:9px;font-weight:800;border:1px solid #c96b78;color:#b4233b}
      .central-plan-row-v6698 .central-stage-v6698{font-weight:800}
      .central-flow-v6698{border:1px solid var(--line,#dfe5ee);border-radius:12px;padding:10px;margin:10px 0 14px;background:color-mix(in srgb,var(--card,#fff) 96%,#806cff 4%)}
      .central-flow-v6698 strong{display:block;font-size:11px;margin-bottom:8px}
      .central-flow-chips-v6698{display:flex;gap:6px;flex-wrap:wrap}
      .central-flow-chips-v6698 button{border:1px solid var(--line,#dfe5ee);background:transparent;color:inherit;border-radius:999px;padding:6px 9px;font:inherit;font-size:10px;font-weight:800;cursor:pointer}
      .central-flow-chips-v6698 button:hover{border-color:#806cff}
    `;
    document.head.appendChild(style);
  }

  let versionTextPatched=false;
  function patchVersionText(){
    if(versionTextPatched) return;
    const w=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);
    let n;
    while((n=w.nextNode())){
      if(n.nodeValue && n.nodeValue.trim()==='v6.6.97'){
        n.nodeValue=n.nodeValue.replace('v6.6.97','v6.6.98');
        versionTextPatched=true;
        break;
      }
    }
  }

  function fixCivilSummary(){
    const scope=document.querySelector('.subject[data-id="civil"]');
    if(!scope) return;
    const count=scope.querySelector('.subject-count');
    const pctEl=scope.querySelector('.subject-pct');
    if(count){
      const m=(count.textContent||'').trim().match(/^(\d+)\/\d+\s+m[oó]dulos$/i);
      if(m){
        const done=Math.min(Number(m[1])||0,15);
        count.textContent=`${done}/15 módulos`;
        if(pctEl) pctEl.textContent=`${Math.round(done/15*100)}%`;
      }
    }
    const w=document.createTreeWalker(scope,NodeFilter.SHOW_TEXT);
    let n;
    while((n=w.nextNode())){
      if(n.nodeValue && n.nodeValue.trim()==='Atualizado em 17/08/2026')
        n.nodeValue=n.nodeValue.replace('Atualizado em 17/08/2026','Conteúdo revisado em 17/08/2026');
    }
  }

  function findByText(scope, selector, re){
    return [...scope.querySelectorAll(selector)].find((el)=>re.test((el.textContent||'').trim())) || null;
  }

  function moduleScopeFromActions(actions){
    let n=actions;
    for(let i=0;i<8 && n;i++,n=n.parentElement){
      const txt=n.textContent||'';
      if(/Teoria essencial/i.test(txt) && /Decorando deste m[oó]dulo/i.test(txt)) return n;
    }
    return null;
  }

  function addCivilFlow(){
    const actions=[...document.querySelectorAll('.civ-module-actions')];
    for(const actionBox of actions){
      const scope=moduleScopeFromActions(actionBox);
      if(!scope || scope.querySelector(':scope > .central-flow-v6698, .central-flow-v6698')) continue;
      const theory=findByText(scope,'h1,h2,h3,h4,h5,h6',/^Teoria essencial$/i);
      if(!theory) continue;
      const jurisprudence=findByText(scope,'h1,h2,h3,h4,h5,h6',/Jurisprud[eê]ncia e entendimentos-chave/i);
      const decorando=findByText(scope,'button,a',/Decorando deste m[oó]dulo/i);
      const questions=findByText(actionBox,'button,a',/Quest[oõ]es|TEC/i);
      const anki=findByText(actionBox,'button,a',/Anki deste m[oó]dulo/i);
      const complete=findByText(actionBox,'button,a',/Marcar como revisado|Revisado/i);
      const flow=document.createElement('div');
      flow.className='central-flow-v6698';
      const chips=document.createElement('div');
      chips.className='central-flow-chips-v6698';
      const defs=[
        ['1. Teoria',theory,'scroll'],
        ['2. Jurisprudência',jurisprudence,'scroll'],
        ['3. O que decorar',decorando,'click'],
        ['4. Questões',questions,'click'],
        ['5. Anki',anki,'click'],
        ['6. Concluir',complete,'click']
      ].filter((x)=>x[1]);
      for(const [label,target,mode] of defs){
        const b=document.createElement('button');b.type='button';b.textContent=label;
        b.addEventListener('click',()=>{
          if(mode==='click' && typeof target.click==='function') target.click();
          else target.scrollIntoView({behavior:'smooth',block:'start'});
        });
        chips.appendChild(b);
      }
      flow.innerHTML='<strong>Fluxo do módulo</strong>';
      flow.appendChild(chips);
      theory.parentNode.insertBefore(flow,theory);
    }
  }

  function applyStaticPatches(){
    if(applying) return;
    applying=true;
    try{
      injectStyle();
      patchVersionText();
      fixCivilSummary();
      addCivilFlow();
    } finally { applying=false; }
  }

  async function loadPlan(){
    if(planCache) return planCache;
    if(planLoading) return planLoading;
    planLoading=fetch('./tools/cronograma.html',{cache:'no-store'})
      .then((r)=>{if(!r.ok) throw new Error('cronograma '+r.status); return r.text();})
      .then((html)=>{
        const m=html.match(/const PLAN_DATA=(\{[\s\S]*?\});<\/script>/);
        if(!m) throw new Error('PLAN_DATA não encontrado');
        const p=JSON.parse(m[1]);
        if(!p || !p.version || !Array.isArray(p.tasks) || !p.catalog) throw new Error('PLAN_DATA inválido');
        planCache=p;
        return p;
      })
      .catch((e)=>{console.warn('[v6.6.98] agenda do cronograma indisponível',e);return null;})
      .finally(()=>{planLoading=null});
    return planLoading;
  }

  function loadPlanState(plan){
    try{
      const x=JSON.parse(localStorage.getItem(PLAN_KEY)||'null');
      if(x && x.version===plan.version){
        if(!x.completed || typeof x.completed!=='object') x.completed={};
        if(!Array.isArray(x.reinforce)) x.reinforce=[];
        return x;
      }
    }catch(_){ }
    return {version:plan.version,completed:{},reinforce:[],selected:null};
  }

  function effectiveDate(plan,state,t){
    if(t.kind!=='review') return t.date;
    const done=state.completed['study:'+t.topicUid]||null;
    if(!done) return t.date;
    const delta=diffDays(t.studyBaseDate,done);
    return nextWeekday(addDays(t.date,delta));
  }

  function blocked(state,t,now){
    return t.kind==='review' && !state.completed['study:'+t.topicUid] && t.studyBaseDate<now;
  }

  function dueForToday(plan,state){
    const now=todayISO(), out=[];
    const all=(plan.tasks||[]).concat(state.reinforce||[]);
    for(const t of all){
      if(blocked(state,t,now)) continue;
      const ed=t.kind==='reinforce'?t.date:effectiveDate(plan,state,t);
      if(ed===now) out.push({...t,_date:ed});
      else if(ed<now && !state.completed[t.id]) out.push({...t,_date:ed,_late:true});
    }
    const order={study:0,review:1,weekly:2,final:3,reinforce:1};
    return out.sort((a,b)=>(a._late===b._late?0:(a._late?-1:1))||String(a._date).localeCompare(String(b._date))||((order[a.kind]??9)-(order[b.kind]??9)));
  }

  function taskMeta(plan,t){
    const topic=t.topicUid?plan.catalog[t.topicUid]:null;
    const subject=topic?.subject || (t.kind==='weekly'?'Revisão semanal':'Cronograma');
    const title=topic?.title || t.title || '';
    const label=t.kind==='study'?'Estudo novo':t.kind==='review'?(t.stage||'Revisão'):t.kind==='weekly'?'Erros da semana':t.kind==='reinforce'?'Reforço extra':'Consolidação';
    return {subject,title,label};
  }

  function getManualAgenda(){
    const key=`central-v6:agenda:${todayISO()}`;
    try{const x=JSON.parse(localStorage.getItem(key)||'[]');return Array.isArray(x)?x:[]}catch(_){return[]}
  }

  function savePlanToggle(id,checked){
    if(!planCache) return;
    const state=loadPlanState(planCache);
    if(checked) state.completed[id]=todayISO(); else delete state.completed[id];
    localStorage.setItem(PLAN_KEY,JSON.stringify(state));
    renderCombinedAgenda();
  }
  window.centralPlanToggle6698=savePlanToggle;

  async function renderCombinedAgenda(){
    const host=document.getElementById('homeAgenda');
    if(!host) return;
    const plan=await loadPlan();
    if(!plan || !document.getElementById('homeAgenda')) return;
    const state=loadPlanState(plan);
    const due=dueForToday(plan,state);
    const manual=getManualAgenda();
    const existing=document.getElementById('central-plan-agenda-v6698');
    const signature=JSON.stringify({m:manual.map(x=>[x&&x.id,!!(x&&x.done)]),p:due.map(t=>[t.id,!!state.completed[t.id],t._date,!!t._late])});
    const unchanged=host.dataset.planAgendaV6698===signature && ((due.length&&existing)||(!due.length&&!existing));
    if(!unchanged){
      if(existing) existing.remove();
    }

    if(due.length && !unchanged){
      const empty=[...host.querySelectorAll('.muted.small')].find((el)=>el.textContent.trim()==='Agenda vazia.');
      if(empty) empty.remove();
      const wrap=document.createElement('div');
      wrap.id='central-plan-agenda-v6698';
      wrap.className='central-plan-agenda-v6698';
      const rows=due.map((t)=>{
        const m=taskMeta(plan,t);
        const done=!!state.completed[t.id];
        return `<div class="agenda-row central-plan-row-v6698 ${done?'done':''}">
          <input type="checkbox" ${done?'checked':''} onchange="centralPlanToggle6698('${esc(t.id)}',this.checked)">
          <div class="agenda-time">${Number(t.minutes)||0} min</div>
          <div class="agenda-copy"><b>${esc(m.subject)}</b><small><span class="central-stage-v6698">${esc(m.label)}</span> · ${esc(m.title)}${t._late?'<span class="central-late-v6698">PENDENTE</span>':''}</small></div>
        </div>`;
      }).join('');
      wrap.innerHTML=`<div class="central-plan-head-v6698"><div><b>Do cronograma de 6 meses</b><br><span>Hoje + pendências liberadas</span></div><button type="button" class="btn sm" id="central-open-plan-v6698">Abrir cronograma</button></div>${rows}`;
      host.appendChild(wrap);
      host.dataset.planAgendaV6698=signature;
      const open=wrap.querySelector('#central-open-plan-v6698');
      if(open) open.addEventListener('click',()=>{
        if(typeof window.openEmbeddedTool==='function') window.openEmbeddedTool('cronograma',{},open);
        else location.href='./tools/cronograma.html';
      });
    }

    if(!due.length) host.dataset.planAgendaV6698=signature;

    const manualDone=manual.filter((x)=>x&&x.done).length;
    const planDone=due.filter((t)=>!!state.completed[t.id]).length;
    const total=manual.length+due.length;
    const done=manualDone+planDone;
    const pct=total?Math.round(done/total*100):0;
    const count=document.getElementById('dayCount');
    const bar=document.getElementById('dayBar');
    const percent=document.getElementById('dayPct');
    if(count) count.textContent=`${done} de ${total}`;
    if(bar) bar.style.width=`${pct}%`;
    if(percent) percent.textContent=`${pct}%`;
  }

  function wrapNativeSubjectsRenderer(){
    const fn=window.renderSubjects;
    if(typeof fn!=='function' || fn.__v6698Wrapped) return;
    const wrapped=function(){
      const result=fn.apply(this,arguments);
      Promise.resolve().then(applyStaticPatches);
      return result;
    };
    wrapped.__v6698Wrapped=true;
    window.renderSubjects=wrapped;
  }

  function wrapNativeAgendaRenderer(){
    const fn=window.renderHomeAgenda;
    if(typeof fn!=='function' || fn.__v6698Wrapped) return;
    const wrapped=function(){
      const result=fn.apply(this,arguments);
      Promise.resolve().then(renderCombinedAgenda);
      return result;
    };
    wrapped.__v6698Wrapped=true;
    window.renderHomeAgenda=wrapped;
  }

  function scheduleApply(){
    clearTimeout(renderTimer);
    renderTimer=setTimeout(()=>{
      wrapNativeSubjectsRenderer();
      wrapNativeAgendaRenderer();
      applyStaticPatches();
      renderCombinedAgenda();
    },80);
  }

  function boot(){
    wrapNativeSubjectsRenderer();
    wrapNativeAgendaRenderer();
    applyStaticPatches();
    renderCombinedAgenda();
    const mo=new MutationObserver((list)=>{
      if(applying) return;
      if(list.some((m)=>m.addedNodes.length || m.removedNodes.length)) scheduleApply();
    });
    mo.observe(document.body,{childList:true,subtree:true});
    window.addEventListener('storage',(e)=>{
      if(e.key===PLAN_KEY || (e.key||'').startsWith('central-v6:agenda:')) renderCombinedAgenda();
    });
  }

  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',boot,{once:true});
  else boot();
})();
