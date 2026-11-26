/* Base Completa — Seleção progressiva de disciplinas na versão oficial.
   Antecipa títulos públicos; abre exclusivamente os módulos renderizados pela Central.
   Nenhum dado, autorização ou script editorial é substituído. */
(function (global) {
  'use strict';
  // Publicação: navegação ativada para alunos autenticados, sem privilégios novos.
  if (global.BaseCompletaFocusNavigation) return;
  const SELECTORS = '.cf-module > .cf-module-head, .cv-module > .cv-module-head, .ds-module > .ds-module-head, .pt-module-card > .pt-module-head, .topic-item .open-topic, [data-civil-native-module] > button, .civil-module > button, .module > .module-head';
  const BOX_SELECTOR = '.cf-module,.cv-module,.ds-module,.pt-module-card,.topic-item,[data-civil-native-module],.civil-module,.module';
  const state = { stage:'choose', subject:'', moduleKey:'', moduleTitle:'', moduleNumber:'' };
  let scheduled = false, selection = 0;
  const $ = (id) => document.getElementById(id);
  const home = () => $('homeView');
  const root = () => $('subjects');
  const current = () => [...(root()?.children || [])].find(el => el.classList.contains('subject') && el.dataset.id === state.subject);
  const compact = (s) => String(s || '').replace(/\s+/g,' ').trim();
  const text = (node, val) => { if (node && node.textContent !== val) node.textContent = val; };
  const focusScroll = () => {
    const el = $('bcFocusHeader') || $('disciplinasHome');
    if (el && home() && !home().classList.contains('hidden')) {
      requestAnimationFrame(() => el.scrollIntoView({behavior:'instant',block:'start'}));
    }
  };
  function titleOf(subject) {
    return compact(subject?.querySelector(':scope > .subject-head .subject-name')?.textContent)
      || compact(subject?.dataset.id) || 'Disciplina';
  }
  function moduleNodes(subject) {
    if (!subject) return [];
    const id=subject.dataset.id;
    if (global.CentralDisciplineLoader?.isReady(id)===false && global.CentralModuleCatalog?.[id]) {
      if (state.loadingModule || global.CentralDisciplineLoader.hasError(id)) return [];
      return global.CentralModuleCatalog[id].map(m=>({key:String(m.number),label:m.title,count:'MÓDULO '+String(m.number).padStart(2,'0'),meta:'',progress:'',catalog:true}));
    }
    const seen = new Set();
    // Alguns módulos (ex.: ADM) têm cabeçalho nativo e controle de tópico no mesmo bloco.
    // Priorizar a abertura real do tópico; contar cada módulo apenas uma vez.
    const heads=[...subject.querySelectorAll(SELECTORS)].filter(head=>{
      const box=head.closest(BOX_SELECTOR);
      return !(box?.matches('.topic-item') && box.querySelector('.open-topic') && !head.matches('.open-topic'));
    });
    return heads.map((head, index) => {
      const box = head.closest(BOX_SELECTOR);
      if (!box || seen.has(box)) return null;
      seen.add(box);
      const rawCount = compact(head.querySelector('.cf-module-no,.cv-module-no,.cv-module-num,.ds-module-no,.pt-module-no,[class*="module-no"]')?.textContent)
        || 'Módulo ' + String(index + 1).padStart(2, '0');
      const count=/^M[ÓO]DULO\s+\d+$/i.test(rawCount)?'MÓDULO '+rawCount.match(/\d+/)[0].padStart(2,'0'):rawCount;
      const label = compact(head.querySelector('.cf-module-title,.cv-module-title,.cv-module-head > span > b,.ds-module-title,.pt-module-title,[class*="module-title"]')?.textContent)
        || compact(box.querySelector('.topic-title')?.textContent)
        || compact(head.textContent).replace(count, '').trim()
        || 'Conteúdo do módulo';
      const key = compact(box.dataset.cf || box.dataset.ptnModule || box.dataset.module || box.dataset.uid || box.dataset.id || String(index));
      const meta=compact(head.querySelector('.cv-module-head > span > small,.cf-module-meta,.ds-module-meta,.pt-module-meta')?.textContent);
      const progress=compact(head.querySelector('.cv-pct,.cf-module-pct,.cf-module-stat,.ds-module-pct,.pt-module-pct')?.textContent).match(/\d+(?:[.,]\d+)?%/)?.[0]||'';
      return { head,box,key,label,count,meta,progress };
    }).filter(Boolean);
  }
  // O estado provisório depende do carregador real, nunca de um tempo artificial.
  function modulePhase(subject, modules) {
    if (modules.length) return 'ready';
    const loader=global.CentralDisciplineLoader;
    if (loader?.hasError?.(state.subject)) return 'error';
    if (subject?.classList.contains('central-subject-pending') ||
        loader?.isLoading?.(state.subject) ||
        loader?.isReady?.(state.subject)===false) return 'loading';
    return 'empty';
  }
  function loadingPanel(subject) {
    const panel=document.createElement('section');
    panel.className='bc-focus-loading';
    panel.setAttribute('role','status');
    panel.setAttribute('aria-live','polite');
    panel.setAttribute('aria-busy','true');
    panel.innerHTML='<div class="bc-focus-loading-emblem" aria-hidden="true"><span class="bc-focus-loading-spinner"></span><img src="/assets/base-completa-symbol.webp" alt=""></div>'+
      '<h2></h2><p>Organizando os conteúdos e preparando seus módulos de estudo.</p>'+
      '<div class="bc-focus-loading-track" aria-hidden="true"><span></span></div>'+
      '<div class="bc-focus-loading-preview" aria-hidden="true"><span></span><span></span><span></span></div>';
    panel.querySelector('h2').textContent='Preparando '+titleOf(subject);
    return panel;
  }
  function failurePanel() {
    const panel=document.createElement('section');
    panel.className='bc-focus-load-error';
    panel.setAttribute('role','alert');
    const title=document.createElement('h2');title.textContent='Não foi possível carregar os módulos';
    const message=document.createElement('p');message.textContent='Confira sua conexão e tente novamente. Seu progresso está preservado.';
    const retry=document.createElement('button');retry.type='button';retry.className='bc-focus-retry';retry.textContent='Tentar novamente';
    retry.addEventListener('click',()=>{global.CentralDisciplineLoader?.open?.(state.subject);schedule();});
    panel.append(title,message,retry);
    return panel;
  }
  function nodes() {
    const h=home(),s=root();
    if (!h || !s) return null;
    const column=s.parentElement;
    if (!column) return null;
    let header=$('bcFocusHeader'), list=$('bcFocusModules');
    if (!header) {
      header=document.createElement('nav');
      header.id='bcFocusHeader';
      header.className='bc-focus-header';
      header.setAttribute('aria-label','Navegação de disciplinas e módulos');
      header.innerHTML='<button type="button" class="bc-focus-back" data-bc-back="subjects" aria-label="Voltar às disciplinas">‹ <span>Disciplinas</span></button><div class="bc-focus-breadcrumb"><small id="bcFocusSubjectLabel"></small><strong id="bcFocusModuleLabel"></strong></div><button type="button" class="bc-focus-back-modules" data-bc-back="modules" hidden>Módulos</button>';
      column.insertBefore(header,s);
    }
    if (!list) {
      list=document.createElement('div');
      list.id='bcFocusModules';
      list.className='bc-focus-modules';
      list.setAttribute('aria-label','Módulos da disciplina selecionada');
      column.insertBefore(list,s);
    }
    return {h,s,header,list};
  }
  function render() {
    const obj=nodes(); if(!obj)return;
    const {h,s,header,list}=obj;
    const visible=!h.classList.contains('hidden');
    h.classList.toggle('bc-focus-choice',state.stage==='choose');
    h.classList.toggle('bc-focus-modules-stage',state.stage==='modules');
    h.classList.toggle('bc-focus-reading',state.stage==='reading');
    h.classList.toggle('bc-focus-has-module',state.stage==='reading' && !!state.moduleKey);
    header.hidden=state.stage==='choose'||!visible;
    list.hidden=state.stage!=='modules'||!visible;
    for(const el of s.children) {
      if (el.classList.contains('subject')) el.classList.toggle('bc-focus-selected-subject',el.dataset.id===state.subject);
    }
    const subject=current(), modules=moduleNodes(subject), phase=modulePhase(subject,modules);
    text($('bcFocusSubjectLabel'),titleOf(subject));
    text($('bcFocusModuleLabel'),state.stage==='reading'?state.moduleNumber+' · '+state.moduleTitle:(state.stage==='modules'&&phase==='loading'?'Carregando módulos…':'Escolha um módulo'));
    const back=header.querySelector('[data-bc-back="modules"]');
    if(back)back.hidden=state.stage!=='reading';
    header.classList.toggle('bc-focus-sticky',state.stage==='reading');
    if(state.stage==='modules' && phase==='ready' && !state.measured){state.measured=true;try{performance.measure('bc:modules-visible-ms','bc:modules-start')}catch(_){}}
    if(state.stage==='modules') {
      const signature=JSON.stringify([state.subject,phase,modules.map(m=>[m.key,m.label,m.count,m.meta,m.progress])]);
      if(list.dataset.signature!==signature) {
        list.dataset.signature=signature;
        list.replaceChildren();
        if(phase==='loading'){
          // Nada de botão de fallback ou lista incompleta enquanto o download roda.
          list.appendChild(loadingPanel(subject));
        } else if(phase==='error'){
          list.appendChild(failurePanel());
        } else {
          const intro=document.createElement('div');
          intro.className='bc-focus-modules-intro';
          intro.innerHTML='<h2>Escolha um módulo</h2><p>Selecione o assunto para acessar a teoria, a revisão e as questões.</p>';
          list.appendChild(intro);
          if(phase==='empty'){
            const empty=document.createElement('div');empty.className='bc-focus-empty';
            empty.textContent='Os módulos ainda não estão disponíveis. Você pode tentar abrir o conteúdo original.';
            list.appendChild(empty);
            const fallback=document.createElement('button');
            fallback.type='button';fallback.className='bc-focus-module-card bc-focus-fallback';
            const label=document.createElement('strong');label.textContent='Abrir conteúdo completo desta disciplina';
            fallback.appendChild(label);
            fallback.addEventListener('click',()=>openOriginal());
            list.appendChild(fallback);
          } else {
            modules.forEach((m,index)=>{
              const button=document.createElement('button');button.type='button';button.className='bc-focus-module-card';
              button.setAttribute('aria-label',m.count+': '+m.label+(m.progress?' · '+m.progress+' concluído':''));
              const number=document.createElement('span');number.className='bc-focus-module-number';number.textContent=m.count;
              const copy=document.createElement('span');copy.className='bc-focus-module-copy';
              const name=document.createElement('strong');name.textContent=m.label;copy.appendChild(name);
              const progress=document.createElement('span');progress.className='bc-focus-module-progress';progress.textContent=m.progress;progress.hidden=!m.progress;
              const arrow=document.createElement('span');arrow.className='bc-focus-arrow';arrow.textContent='›';arrow.setAttribute('aria-hidden','true');
              button.append(number,copy,progress,arrow);
              button.addEventListener('click',()=>openModule(index));
              list.appendChild(button);
            });
          }
        }
      }
    }
    const activeModule=state.stage==='reading' ? (modules.find(m=>m.key===state.moduleKey)||modules.find(m=>m.label===state.moduleTitle))?.box : null;
    s.querySelectorAll('.bc-focus-current-module').forEach(el=>{
      if(el!==activeModule)el.classList.remove('bc-focus-current-module');
    });
    if(activeModule&&!activeModule.classList.contains('bc-focus-current-module'))activeModule.classList.add('bc-focus-current-module');
  }
  function schedule(){
    if (scheduled)return;
    scheduled=true;
    requestAnimationFrame(()=>{scheduled=false;render()});
  }
  function chooseSubject(id){
    selection++;
    const s=[...(root()?.children||[])].find(el=>el.dataset.id===id);
    if(!s)return;
    try{performance.mark('bc:modules-start')}catch(_){}
    state.measured=false;state.loadingModule=false;state.subject=id;state.stage='modules';state.moduleKey='';state.moduleTitle='';state.moduleNumber='';
    if(!s.classList.contains('open') && !(global.CentralModuleCatalog?.[id] && global.CentralDisciplineLoader?.isReady(id)===false)){
      if(typeof global.toggleSubject==='function')global.toggleSubject(id);
      else s.querySelector('.subject-head')?.click();
    }
    const list=$('bcFocusModules');if(list)list.dataset.signature='';
    schedule();
    requestAnimationFrame(focusScroll);
  }
  function openOriginal(){
    state.stage='reading';state.moduleKey='';state.moduleNumber='';state.moduleTitle='Conteúdo da disciplina';
    schedule();setTimeout(focusScroll,30);
  }
  async function openModule(index){
    const ticket=selection;
    const subjectId=state.subject;
    if(global.CentralDisciplineLoader?.isReady(subjectId)===false){
      if(state.loadingModule)return;
      state.loadingModule=true;schedule();
      try{await global.CentralDisciplineLoader.load(subjectId);}
      catch(_){if(ticket===selection){state.loadingModule=false;schedule();}return;}
      if(ticket!==selection)return;
      state.loadingModule=false;
      // A slow download must not reopen a discipline the student has left.
      if(state.subject!==subjectId||state.stage!=='modules')return;
    }
    // The catalog does not expand the legacy subject. Materialize its real module
    // DOM only after authorization/loading, before resolving the selected index.
    if(current() && !current().classList.contains('open')) global.toggleSubject?.(subjectId);
    // Civil/CPP replace the legacy body through their native observers. Resolve
    // the module only after that replacement, never from the transient markup.
    await new Promise(resolve=>requestAnimationFrame(resolve));
    if(ticket!==selection||state.subject!==subjectId||state.stage!=='modules')return;
    const modules=moduleNodes(current()),m=modules[index];
    if(!m)return;
    state.stage='reading';state.moduleKey=m.key;state.moduleTitle=m.label;state.moduleNumber=m.count;
    const alreadyOpen=m.box.classList.contains('open')||m.box.open===true||m.head.getAttribute('aria-expanded')==='true';
    if(!alreadyOpen)m.head.click();
    schedule();setTimeout(()=>{schedule();focusScroll()},100);setTimeout(schedule,500);
  }
  // Resolve only an existing module; do not silently fall back to a different module.
  async function openByModuleId(subjectId,moduleId){
    if(typeof moduleId!=='string'||!moduleId||!subjectId)return false;
    global.openHome?.();
    chooseSubject(subjectId);
    if(state.subject!==subjectId||state.stage!=='modules')return false;
    const ticket=selection;
    try{
      if(global.CentralDisciplineLoader?.isReady(subjectId)===false)await global.CentralDisciplineLoader.load(subjectId);
      if(ticket!==selection)return false;
      if(current()&&!current().classList.contains('open'))global.toggleSubject?.(subjectId);
      const expected=moduleId.match(/^pt-(\d{2})$/);
      for(let attempt=0;attempt<12;attempt++){
        await new Promise(resolve=>setTimeout(resolve,80));
        if(ticket!==selection||state.subject!==subjectId||state.stage!=='modules')return false;
        const modules=moduleNodes(current());
        const index=modules.findIndex(m=>m.key===moduleId||Array.from(m.box?.attributes||[]).some(a=>a.name.startsWith('data-')&&a.value===moduleId)||
          (subjectId==='pt'&&expected&&Number(m.count.match(/\d+/)?.[0])===Number(expected[1])));
        if(index>=0){await openModule(index);return state.stage==='reading'&&state.subject===subjectId;}
      }
    }catch(error){console.warn('[Edital] Módulo indisponível',error);}
    return false;
  }
  function backToModules(){
    state.stage='modules';state.moduleKey='';state.moduleTitle='';state.moduleNumber='';
    const list=$('bcFocusModules');if(list)list.dataset.signature='';
    schedule();setTimeout(focusScroll,30);
  }
  function backToSubjects(){
    selection++;
    state.loadingModule=false;state.stage='choose';state.subject='';state.moduleKey='';state.moduleTitle='';state.moduleNumber='';
    schedule();setTimeout(()=> $('disciplinasHome')?.scrollIntoView({behavior:'instant',block:'start'}),30);
  }
  function lastDestination(last){
    if(!last||typeof last!=='object'||global.CentralDisciplineAvailability?.isRemovedRecord(last))return null;
    for(const [field,subject] of Object.entries({cppModule:'cpp',civilModule:'civil',cfWeek:'cf',penalWeek:'penal',cpcWeek:'cpc',ptAutoModule:'pt',ptModule:'pt',rlmModule:'rlm'})){
      if(last[field])return {subject,module:String(last[field])};
    }
    const topic=last.topicUid&&global.topicByUid?.(last.topicUid);
    return topic?{subject:topic.s.id,module:last.topicUid,number:topic.s.topics.indexOf(topic.t)+1}:null;
  }
  async function resumeLast(){
    let last;try{last=JSON.parse(localStorage.getItem('central-v6:last')||'null')}catch(_){}
    const destination=lastDestination(last);
    if(!destination){
      if(last&&(last.url||last.tool))return legacyResume?.();
      global.openHome?.();backToSubjects();return false;
    }
    global.openHome?.();chooseSubject(destination.subject);
    try{
      await global.CentralDisciplineLoader?.load(destination.subject);
      const modules=moduleNodes(current());
      const exact=modules.findIndex(m=>m.key===destination.module||[...m.box.attributes].some(a=>a.name.startsWith('data-')&&a.value===destination.module));
      const number=destination.number||Number(destination.module.match(/(\d+)$/)?.[1]);
      const index=exact>=0?exact:(Number.isInteger(number)&&number>0&&number<=modules.length?number-1:-1);
      if(index<0){schedule();return false;}
      openModule(index);
      // Preserve native readers and their saved scroll position after revealing the module.
      legacyResume?.();
      return true;
    }catch(_){schedule();return false;}
  }
  const legacyResume=global.centralResumeLast;
  global.centralResumeLast=resumeLast;
  function init(){
    if(!home()||!root())return;
    nodes();render();
    new MutationObserver(mutations=>{
      if(state.stage==='choose'||home().classList.contains('hidden'))return;
      if(mutations.some(m=>m.target.isConnected && (m.target===root()||m.target.closest?.('.subject')?.dataset.id===state.subject)))schedule();
    }).observe(root(),{childList:true,subtree:true});
    // Concluir a animação imediatamente quando a disciplina estiver pronta.
    // A falha real é comunicada pelo carregador, para exibir uma ação de repetição.
    ['central:discipline-loading','central:discipline-ready','central:discipline-error'].forEach(eventName=>{
      document.addEventListener(eventName,event=>{
        if(event.detail?.id!==state.subject)return;
        const list=$('bcFocusModules');if(list)list.dataset.signature='';
        schedule();
      });
    });

    let wasHidden=home().classList.contains('hidden');
    new MutationObserver(()=>{
      const hidden=home().classList.contains('hidden');
      if(hidden!==wasHidden){
        wasHidden=hidden;
        if(hidden){state.loadingModule=false;state.stage='choose';state.subject='';state.moduleKey='';state.moduleTitle='';state.moduleNumber='';}
        schedule();
      }
    }).observe(home(),{attributes:true,attributeFilter:['class']});
    document.addEventListener('click',event=>{
      const target=event.target instanceof Element?event.target:event.target?.parentElement;
      if(!target)return;
      const back=target.closest('[data-bc-back]');
      if(back){
        event.preventDefault();event.stopPropagation();
        if(back.dataset.bcBack==='modules')backToModules();else backToSubjects();
        return;
      }
      // Links já existentes (objetivos, cartões e atalhos) também abrem a lista real de módulos.
      const external=target.closest('[data-study-open-subject],#disciplineGrid .disc-card[data-id]');
      if(external){
        const id=external.dataset.studyOpenSubject||external.dataset.id;
        if(id){
          event.preventDefault();event.stopImmediatePropagation();
          global.openHome?.();chooseSubject(id);
        }
      }
      const head=target.closest('#homeView #subjects > .subject > .subject-head');
      if(head && state.stage==='choose'){
        event.preventDefault();event.stopImmediatePropagation();
        chooseSubject(head.closest('.subject')?.dataset.id);
      }
    },true);
    global.addEventListener('popstate',schedule);
  }
  global.BaseCompletaFocusNavigation={state,chooseSubject,backToModules,backToSubjects,openModule,openByModuleId,resumeLast};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});
  else init();
})(window);
