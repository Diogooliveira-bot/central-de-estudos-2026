/* Base Completa — Seleção progressiva de disciplinas na versão oficial.
   Usa exclusivamente os módulos renderizados pela Central.
   Nenhum dado, autorização ou script editorial é substituído. */
(function (global) {
  'use strict';
  // Publicação: navegação ativada para alunos autenticados, sem privilégios novos.
  if (global.BaseCompletaFocusNavigation) return;
  const SELECTORS = '.cf-module > .cf-module-head, .cv-module > .cv-module-head, .ds-module > .ds-module-head, .pt-module-card > .pt-module-head, .topic-item .open-topic, [data-civil-native-module] > button, .civil-module > button, .module > .module-head';
  const BOX_SELECTOR = '.cf-module,.cv-module,.ds-module,.pt-module-card,.topic-item,[data-civil-native-module],.civil-module,.module';
  const state = { stage:'choose', subject:'', moduleKey:'', moduleTitle:'', moduleNumber:'' };
  let scheduled = false;
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
    const seen = new Set();
    return [...subject.querySelectorAll(SELECTORS)].map((head, index) => {
      const box = head.closest(BOX_SELECTOR);
      if (!box || seen.has(box)) return null;
      seen.add(box);
      const count = compact(head.querySelector('.cf-module-no,.cv-module-no,.ds-module-no,.pt-module-no,[class*="module-no"]')?.textContent)
        || 'Módulo ' + String(index + 1).padStart(2, '0');
      const label = compact(head.querySelector('.cf-module-title,.cv-module-title,.ds-module-title,.pt-module-title,[class*="module-title"]')?.textContent)
        || compact(box.querySelector('.topic-title')?.textContent)
        || compact(head.textContent).replace(count, '').trim()
        || 'Conteúdo do módulo';
      const key = compact(box.dataset.cf || box.dataset.ptnModule || box.dataset.module || box.dataset.uid || box.dataset.id || String(index));
      return { head,box,key,label,count };
    }).filter(Boolean);
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
    const subject=current(), modules=moduleNodes(subject);
    text($('bcFocusSubjectLabel'),titleOf(subject));
    text($('bcFocusModuleLabel'),state.stage==='reading'?state.moduleNumber+' · '+state.moduleTitle:'Escolha um módulo');
    const back=header.querySelector('[data-bc-back="modules"]');
    if(back)back.hidden=state.stage!=='reading';
    header.classList.toggle('bc-focus-sticky',state.stage==='reading');
    if(state.stage==='modules') {
      const signature=JSON.stringify([state.subject,modules.map(m=>[m.key,m.label,m.count])]);
      if(list.dataset.signature!==signature) {
        list.dataset.signature=signature;
        list.replaceChildren();
        const intro=document.createElement('div');
        intro.className='bc-focus-modules-intro';
        intro.innerHTML='<h2>Escolha um módulo</h2><p>Conteúdo original da Base Completa, sem alterações.</p>';
        list.appendChild(intro);
        if(modules.length===0){
          const loading=document.createElement('div');loading.className='bc-focus-loading';
          loading.textContent=subject?.classList.contains('central-subject-pending')?
            'Carregando os módulos reais desta disciplina…':'Os módulos ainda não foram carregados. Você pode abrir o conteúdo original.';
          list.appendChild(loading);
          const fallback=document.createElement('button');
          fallback.type='button';fallback.className='bc-focus-module-card';
          fallback.textContent='Abrir conteúdo completo desta disciplina';
          fallback.addEventListener('click',()=>openOriginal());
          list.appendChild(fallback);
        } else {
          modules.forEach((m,index)=>{
            const button=document.createElement('button');button.type='button';button.className='bc-focus-module-card';
            button.setAttribute('aria-label',m.count+': '+m.label);
            const number=document.createElement('span');number.className='bc-focus-module-number';number.textContent=m.count;
            const name=document.createElement('strong');name.textContent=m.label;
            const arrow=document.createElement('span');arrow.className='bc-focus-arrow';arrow.textContent='›';arrow.setAttribute('aria-hidden','true');
            button.append(number,name,arrow);
            button.addEventListener('click',()=>openModule(index));
            list.appendChild(button);
          });
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
    const s=[...(root()?.children||[])].find(el=>el.dataset.id===id);
    if(!s)return;
    state.subject=id;state.stage='modules';state.moduleKey='';state.moduleTitle='';state.moduleNumber='';
    if(!s.classList.contains('open')){
      if(typeof global.toggleSubject==='function')global.toggleSubject(id);
      else s.querySelector('.subject-head')?.click();
    }
    const list=$('bcFocusModules');if(list)list.dataset.signature='';
    schedule();
    setTimeout(()=>{const l=$('bcFocusModules');if(l)l.dataset.signature='';schedule();focusScroll()},80);
    setTimeout(()=>{const l=$('bcFocusModules');if(l)l.dataset.signature='';schedule()},900);
  }
  function openOriginal(){
    state.stage='reading';state.moduleKey='';state.moduleNumber='';state.moduleTitle='Conteúdo da disciplina';
    schedule();setTimeout(focusScroll,30);
  }
  function openModule(index){
    const modules=moduleNodes(current()),m=modules[index];
    if(!m)return;
    state.stage='reading';state.moduleKey=m.key;state.moduleTitle=m.label;state.moduleNumber=m.count;
    const alreadyOpen=m.box.classList.contains('open')||m.box.open===true||m.head.getAttribute('aria-expanded')==='true';
    if(!alreadyOpen)m.head.click();
    schedule();setTimeout(()=>{schedule();focusScroll()},100);setTimeout(schedule,500);
  }
  function backToModules(){
    state.stage='modules';state.moduleKey='';state.moduleTitle='';state.moduleNumber='';
    const list=$('bcFocusModules');if(list)list.dataset.signature='';
    schedule();setTimeout(focusScroll,30);
  }
  function backToSubjects(){
    state.stage='choose';state.subject='';state.moduleKey='';state.moduleTitle='';state.moduleNumber='';
    schedule();setTimeout(()=> $('disciplinasHome')?.scrollIntoView({behavior:'instant',block:'start'}),30);
  }
  function init(){
    if(!home()||!root())return;
    nodes();render();
    new MutationObserver(schedule).observe(root(),{childList:true,subtree:true});
    let wasHidden=home().classList.contains('hidden');
    new MutationObserver(()=>{
      const hidden=home().classList.contains('hidden');
      if(hidden!==wasHidden){
        wasHidden=hidden;
        if(hidden){state.stage='choose';state.subject='';state.moduleKey='';state.moduleTitle='';state.moduleNumber='';}
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
          state.stage='modules';state.subject=id;state.moduleKey='';state.moduleTitle='';state.moduleNumber='';
          const list=$('bcFocusModules');if(list)list.dataset.signature='';
          setTimeout(()=>{schedule();focusScroll()},150);
          setTimeout(()=>{const l=$('bcFocusModules');if(l)l.dataset.signature='';schedule()},900);
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
  global.BaseCompletaFocusNavigation={state,chooseSubject,backToModules,backToSubjects,openModule};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});
  else init();
})(window);
