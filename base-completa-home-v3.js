/* Base Completa — home visual v3
   Decoração e rearranjo exclusivamente visual. Mantém IDs, dados e funções originais. */
(function(){
  'use strict';

  function byId(id){ return document.getElementById(id); }

  function subjectMeta(section){
    if(!section) return;
    const pctEl = section.querySelector('.subject-pct');
    if(pctEl){
      const m = String(pctEl.textContent||'').match(/(\d+(?:[.,]\d+)?)\s*%/);
      const pct = m ? Math.max(0,Math.min(100,Number(String(m[1]).replace(',','.'))||0)) : 0;
      section.style.setProperty('--bc-pct', String(pct));
      pctEl.setAttribute('data-bc-pct', Math.round(pct)+'%');
    }

    const head = section.querySelector('.subject-head');
    const name = section.querySelector('.subject-name');
    if(head && name && !head.querySelector('.bc-home-submeta')){
      const sid = section.getAttribute('data-id') || '';
      let total = '';
      let label = 'Curso Integrado';
      try{
        const s = Array.isArray(window.SUBJECTS) ? window.SUBJECTS.find(x=>x&&x.id===sid) : null;
        if(s && typeof window.subjStats==='function') total = String(window.subjStats(s).total);
        else if(s && Array.isArray(s.topics)) total = String(s.topics.length);
        if(sid==='trab' || sid==='ptra') label = 'Curso Integrado';
      }catch(_){}
      if(!total){
        const count = section.querySelector('.subject-count')?.textContent || '';
        const mm = count.match(/\/(\d+)/);
        if(mm) total = mm[1];
      }
      const meta = document.createElement('span');
      meta.className = 'bc-home-submeta';
      meta.textContent = (total ? total+' módulos · ' : '') + label;
      name.insertAdjacentElement('afterend', meta);
    }
  }

  function decorateSubjects(){
    const host = byId('subjects');
    if(!host) return;
    host.querySelectorAll('.subject[data-id]').forEach(subjectMeta);
  }


  function compactDesktopHome(){
    const home = byId('homeView');
    if(!home) return;

    const grid = home.querySelector('.home-grid');
    const left = grid?.querySelector(':scope > div:first-child');
    const side = grid?.querySelector(':scope > .side-col');
    const intro = byId('disciplinasHome');
    const todayCard = home.querySelector('.home-today-card');
    const progressCard = byId('dayCount')?.closest('.card');
    const pendingCard = byId('homePending')?.closest('.card');
    const continueCard = byId('continueBox')?.closest('.card');
    let quickToolsCard = null;

    if(side){
      quickToolsCard = Array.from(side.querySelectorAll(':scope > .card')).find(card=>{
        const title=(card.querySelector('.card-head h3')?.textContent||'').trim().toLowerCase();
        return title.includes('lei em dia');
      }) || null;
    } else {
      quickToolsCard = home.querySelector('.home-quick-tools-card');
    }

    if(grid){
      grid.style.setProperty('display','block','important');
      grid.style.setProperty('grid-template-columns','none','important');
      grid.style.setProperty('gap','0','important');
    }

    if(left){
      let dash = left.querySelector(':scope > .home-dashboard-row');
      if(!dash){
        dash=document.createElement('div');
        dash.className='home-dashboard-row';
        left.insertBefore(dash,left.firstChild);
      }
      if(todayCard && todayCard.parentElement!==dash) dash.appendChild(todayCard);
      if(progressCard){
        progressCard.classList.add('home-progress-card');
        if(progressCard.parentElement!==dash) dash.appendChild(progressCard);
      }
      if(pendingCard){
        pendingCard.classList.add('home-pending-card');
        if(pendingCard.parentElement!==dash) dash.appendChild(pendingCard);
      }

      let secondary = left.querySelector(':scope > .home-secondary-row');
      if(!secondary){
        secondary=document.createElement('div');
        secondary.className='home-secondary-row';
        if(intro) left.insertBefore(secondary,intro);
        else left.appendChild(secondary);
      }
      if(continueCard){
        continueCard.classList.add('home-continue-card');
        if(continueCard.parentElement!==secondary) secondary.appendChild(continueCard);
      }
      if(quickToolsCard){
        quickToolsCard.classList.add('home-quick-tools-card');
        if(quickToolsCard.parentElement!==secondary) secondary.appendChild(quickToolsCard);
      }
    }

    if(side){
      side.style.setProperty('display','none','important');
      side.setAttribute('aria-hidden','true');
    }
  }

  function hideDecorandoSidebar(){
    document.querySelectorAll('#centralSidebar .nav button').forEach(button=>{
      if(!(button.getAttribute('onclick')||'').includes("openEmbeddedTool('decorando'"))return;
      button.removeAttribute('data-bc-hide-decorando');
      button.style.removeProperty('display');
      button.removeAttribute('aria-hidden');
      button.tabIndex=0;
      const label=button.querySelector('.nav-text');if(label&&label.textContent!=='Lei em Dia')label.textContent='Lei em Dia';
    });
  }


  function tidyHomeV5(){
    const home=byId('homeView');
    if(!home) return;

    const todayCard=home.querySelector('.home-today-card');
    const progressCard=byId('dayCount')?.closest('.card');
    const pendingCard=byId('homePending')?.closest('.card');
    const quickCard=home.querySelector('.home-quick-tools-card');

    if(todayCard && progressCard){
      progressCard.classList.add('home-progress-card');
      if(progressCard.parentElement!==todayCard) todayCard.appendChild(progressCard);
    }

    if(pendingCard){
      pendingCard.classList.add('home-pending-card');
      pendingCard.style.setProperty('display','none','important');
      pendingCard.setAttribute('aria-hidden','true');
    }

    if(quickCard){
      quickCard.style.setProperty('display','none','important');
      quickCard.setAttribute('aria-hidden','true');
    }

    const dash=home.querySelector('.home-dashboard-row');
    if(dash && todayCard && todayCard.parentElement!==dash) dash.appendChild(todayCard);
  }

  function decorateHome(){
    const home = byId('homeView');
    if(!home) return;

    document.documentElement.classList.add('bc-home-v3-active');
    hideDecorandoSidebar();
    compactDesktopHome();
    tidyHomeV5();

    const todayCard = home.querySelector('.home-today-card');
    if(todayCard){
      const button = todayCard.querySelector('.card-head > .btn');
      if(button && button.textContent.trim() !== 'Ver agenda →') button.textContent = 'Ver agenda →';
    }

    const left = home.querySelector('.home-grid > div:first-child');
    const intro = byId('disciplinasHome');
    const continueBox = byId('continueBox');
    const continueCard = continueBox?.closest('.card');
    if(left && intro && continueCard && !continueCard.classList.contains('home-continue-card')){
      continueCard.classList.add('home-continue-card');
      left.insertBefore(continueCard, intro);
    }

    if(intro){
      const eyebrow = intro.querySelector('.eyebrow');
      const h2 = intro.querySelector('h2');
      const p = intro.querySelector('p');
      if(eyebrow && eyebrow.textContent !== 'Disciplinas') eyebrow.textContent = 'Disciplinas';
      if(h2 && h2.textContent.trim() !== 'Disciplinas') h2.textContent = 'Disciplinas';
      if(p && p.textContent.trim() !== 'Escolha uma disciplina e continue direto do seu progresso.'){
        p.textContent = 'Escolha uma disciplina e continue direto do seu progresso.';
      }
      let sum = intro.querySelector('.bc-home-summary');
      if(!sum){
        sum = document.createElement('span');
        sum.className = 'bc-home-summary';
        intro.appendChild(sum);
      }
      try{
        const list = Array.isArray(window.SUBJECTS) ? window.SUBJECTS : [];
        let total = 0;
        list.forEach(s=>{
          try{
            if(typeof window.subjStats === 'function'){
              const st = window.subjStats(s);
              total += Number(st?.total)||0;
            }else total += Array.isArray(s?.topics)?s.topics.length:0;
          }catch(_){ total += Array.isArray(s?.topics)?s.topics.length:0; }
        });
        const summary = list.length ? list.length+' disciplinas · '+total+' módulos' : '';
        if(sum.textContent !== summary) sum.textContent = summary;
      }catch(_){ if(sum.textContent) sum.textContent=''; }
    }

    decorateSubjects();
  }

  let queued = false;
  function schedule(){
    if(queued) return;
    queued = true;
    requestAnimationFrame(function(){
      queued = false;
      decorateHome();
    });
  }

  function init(){
    decorateHome();
    const host = byId('subjects');
    if(host){
      new MutationObserver(schedule).observe(host,{childList:true,subtree:true,characterData:true});
    }
    const home = byId('homeView');
    if(home){
      new MutationObserver(schedule).observe(home,{childList:true,subtree:true});
    }
    window.addEventListener('storage',schedule);
    setTimeout(decorateHome,120);
    setTimeout(decorateHome,500);
  }

  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',init,{once:true});
  else init();
})();

