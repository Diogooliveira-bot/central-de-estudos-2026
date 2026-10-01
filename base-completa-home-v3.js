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
        if(s && Array.isArray(s.topics)) total = String(s.topics.length);
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

  function decorateHome(){
    const home = byId('homeView');
    if(!home) return;

    document.documentElement.classList.add('bc-home-v3-active');

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
      if(eyebrow) eyebrow.textContent = 'Disciplinas';
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
        sum.textContent = list.length ? list.length+' disciplinas · '+total+' módulos' : '';
      }catch(_){ sum.textContent=''; }
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