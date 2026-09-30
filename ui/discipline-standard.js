/* Shared presentation based on Direito Civil. Native content, handlers and storage stay authoritative. */
(function () {
  'use strict';
  if (window.CentralDisciplineStandard) return;
  const MODULES = '.civil-module[data-civil-analista],.cf-module[data-cf],.cf-module[data-penal],.cf-module[data-cpc],.cf-module[data-ptn-module],.cpp-mod[data-cpp-num],.topic-item[data-uid]';
  let observer, scheduled = false;
  const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const read = key => { try { return JSON.parse(localStorage.getItem(key) || 'null'); } catch (_) { return null; } };
  const meter = value => Number.isFinite(value) ? '<div class="csp-meter" aria-hidden="true"><span style="width:' + Math.max(0, Math.min(100, value)) + '%"></span></div>' : '';
  function identity(module) {
    const subject = module.closest('.subject').dataset.id;
    const id = module.dataset.civilAnalista || module.dataset.ptnModule || module.dataset.cf || module.dataset.penal || module.dataset.cpc || module.dataset.cppNum || module.dataset.uid;
    return { subject, id, key: subject + ':' + id };
  }
  function bodyOf(module) { return module.querySelector('.civil-module-body,.cf-module-body,.cpp-mod-body,.detail-panel'); }
  function readingStats(module, meta) {
    if (meta.subject === 'cpp' && window.CppCourseV1) {
      const state = window.CppCourseV1.state().modules[meta.id];
      return { pct: state?.reading ? 100 : 0, text: state?.reading ? 'Leitura concluída' : 'Marque a leitura ao terminar o conteúdo' };
    }
    const fn = {cf:'cfWeekState',penal:'penalWeekState',cpc:'cpcWeekState'}[meta.subject];
    if (fn && typeof window[fn] === 'function') {
      const state = window[fn](meta.id), done = ['reading','theory','deep'].filter(k => state[k]).length;
      return { pct: Math.round(done / 3 * 100), text: done + '/3 etapas de leitura concluídas' };
    }
    const boxes = Array.from(module.querySelectorAll('[data-ptn-done]'));
    if (boxes.length) {
      const done = boxes.filter(x => x.checked).length;
      return { pct: Math.round(done / boxes.length * 100), text: done + '/' + boxes.length + ' sessões concluídas' };
    }
    if (meta.subject === 'pt') {
      const state = read('base-completa:pt:v1:module:' + meta.id + ':progress');
      const done = Object.values(state?.sections || {}).filter(Boolean).length;
      return { pct: null, text: done + ' sessões concluídas · confira a teoria' };
    }
    const goal = module.querySelector('.topic-row input[type=checkbox]');
    if (goal) return { pct: goal.checked ? 100 : 0, text: 'Conclusão manual do módulo' };
    return { pct: null, text: 'Use os controles de conclusão no conteúdo' };
  }
  function questionStats(module, meta) {
    const course = meta.subject === 'cf' && typeof CF_WEEKS !== 'undefined' ? { weeks:CF_WEEKS, pool:window.cfPool, state:window.cfState } :
      meta.subject === 'penal' && typeof PENAL_WEEKS !== 'undefined' ? { weeks:PENAL_WEEKS, pool:window.penalPool, state:window.penalState } :
      meta.subject === 'cpc' && typeof CPC_WEEKS !== 'undefined' ? { weeks:CPC_WEEKS, pool:window.cpcPool, state:window.cpcState } : null;
    if (course && typeof course.pool === 'function' && typeof course.state === 'function') {
      const week = course.weeks.find(w => w.id === meta.id);
      if (week) {
        const answers = course.state().answers || {};
        const answered = course.pool(week).map(q => answers[q.id]).filter(a => a?.attempts);
        const correct = answered.filter(a => a.lastCorrect).length;
        return { total:answered.length, correct, text:answered.length + ' questões respondidas · ' + correct + ' acertos na última resposta' };
      }
    }
    if (meta.subject === 'cpp' && window.CppCourseV1) {
      const rounds = window.CppCourseV1.state().modules[meta.id]?.rounds || [];
      const valid = rounds.reduce((n,r) => n + Math.max(0,Number(r.valid)||0),0);
      const correct = rounds.reduce((n,r) => n + Math.max(0,Number(r.correct)||0),0);
      return { total: valid, correct, text: valid + ' questões · ' + correct + ' acertos' };
    }
    if (meta.subject === 'pt') {
      const state = read('base-completa:pt:v1:module:' + meta.id + ':progress');
      const answers = Object.values(state?.answers || {});
      // Native Portuguese stores selected alternatives, not correctness. Its own question UI owns the result.
      return { total: answers.length, correct: null, text: answers.length + ' questões respondidas · resultado na área de prática' };
    }
    if (module.dataset.uid && typeof window.getPerf === 'function') {
      const rounds = window.getPerf(meta.id);
      const total = rounds.reduce((n,r) => n + (Number(r.q)||0),0);
      const correct = rounds.reduce((n,r) => n + (Number(r.c)||0),0);
      return { total, correct, text: total + ' questões · ' + rounds.length + ' rodadas' };
    }
    return { total: 0, correct: 0, text: 'Use as questões e os cadernos vinculados abaixo' };
  }
  function percentage(module) {
    const text = module.querySelector('.civil-pct,.cf-module-stat,.cpp-mpct')?.textContent || '';
    const match = text.match(/(\d+)\s*%/);
    if (match) return Number(match[1]);
    const goal = module.querySelector('.topic-row input[type=checkbox]');
    return goal ? (goal.checked ? 100 : 0) : 0;
  }
  function progressPanel(module, meta) {
    const reading = readingStats(module, meta), questions = questionStats(module, meta), overall = percentage(module);
    const law = module.querySelector('button[onclick*="openLeiSeca"],button[onclick*="decorando"],a[onclick*="openLeiSeca"]');
    const label = law ? 'Decorando' : (meta.subject === 'pt' ? 'Revisão' : 'Materiais');
    const description = law ? 'Artigos e exercícios vinculados ao módulo' : (meta.subject === 'pt' ? 'Pontos de revisão disponíveis no módulo' : 'Consulte os materiais e recursos vinculados');
    return '<section class="csp-panel ds-progress" data-ds-summary><div class="csp-panel-head"><div><span>PROGRESSO DE ESTUDO</span><b>' + overall + '% do módulo</b></div><div class="csp-panel-note">Conclusão conforme os critérios desta disciplina</div></div>' + meter(overall) + '<div class="csp-grid">' +
      '<article class="csp-stage-card"><div class="csp-stage-head"><div><b>Leitura</b><small>' + esc(reading.text) + '</small></div><strong>' + (reading.pct === null ? '—' : reading.pct + '%') + '</strong></div>' + meter(reading.pct) + '</article>' +
      '<article class="csp-stage-card"><div class="csp-stage-head"><div><b>' + label + '</b><small>' + description + '</small></div></div><button type="button" class="ds-action" data-ds-action="' + (meta.subject === 'pt' ? 'review' : 'resources') + '">Abrir ' + (law ? 'Decorando' : label.toLowerCase()) + '</button></article>' +
      '<article class="csp-stage-card csp-tec"><div class="csp-stage-head"><div><b>Questões / TEC</b><small>' + esc(questions.text) + '</small></div><strong>' + (questions.total && questions.correct !== null ? Math.round(questions.correct / questions.total * 100) + '% de acertos' : questions.total ? '—' : 'Sem registro') + '</strong></div><div class="ds-actions"><button type="button" class="ds-action" data-ds-action="questions">Abrir questões e registros</button></div></article></div></section>';
  }
  function notes(module, body, meta) {
    const native = body.querySelector('.notes,.cpp-note,.cf-resource-box:has(textarea),[data-ds-notes]');
    if (native) {
      native.classList.add('ds-notes');
      if (native.parentElement !== body || body.lastElementChild !== native) body.appendChild(native);
      const heading = native.querySelector('label,h4,.resource-label');
      if (heading && heading.textContent !== 'Anotações do módulo') heading.textContent = 'Anotações do módulo';
      return;
    }
    const note = document.createElement('section');
    note.className = 'ds-notes'; note.dataset.dsNotes = meta.key;
    const id = 'ds-note-' + meta.key.replace(/[^a-zA-Z0-9_-]/g,'-');
    let value = ''; try {
      const current = localStorage.getItem('central-v6:module-notes:' + meta.key);
      const oldId = meta.subject === 'cpp' ? 'cpp-' + meta.id : meta.id;
      value = current ?? localStorage.getItem('central-v6:module-standard-notes:v1:' + oldId) ??
        (meta.subject === 'civil' ? localStorage.getItem('central-v6:civil-note:' + meta.id) : null) ?? '';
    } catch (_) {}
    note.innerHTML = '<label for="' + id + '">Anotações do módulo</label><textarea id="' + id + '" placeholder="Regra, artigo, pegadinha ou dúvida…">' + esc(value) + '</textarea><div class="ds-actions"><button type="button" class="ds-action" data-ds-save-note>Salvar anotação</button><span role="status" aria-live="polite" class="ds-note-status"></span></div>';
    body.appendChild(note);
  }
  function enhance(module) {
    const body = bodyOf(module); if (!body) return;
    const meta = identity(module);
    module.classList.add('ds-module'); body.classList.add('ds-module-body');
    const head = module.querySelector('.civil-module-head,.cf-module-head,.cpp-mod-head,.topic-row');
    if (head) {
      head.classList.add('ds-module-head');
      const toggle = head.matches('button') ? head : head.querySelector('.open-topic');
      if (toggle) { toggle.setAttribute('aria-expanded',String(module.classList.contains('open'))); toggle.setAttribute('aria-controls','ds-body-' + meta.key.replace(/[^a-zA-Z0-9_-]/g,'-')); }
      body.id = 'ds-body-' + meta.key.replace(/[^a-zA-Z0-9_-]/g,'-');
      const goal = head.querySelector('input[type=checkbox]');
      if (goal) goal.setAttribute('aria-label','Marcar módulo concluído: ' + (head.querySelector('.topic-title')?.textContent || '').trim());
      const toggleOnly = head.querySelector('.open-topic');
      if (toggleOnly) toggleOnly.setAttribute('aria-label',(module.classList.contains('open') ? 'Recolher' : 'Abrir') + ' módulo');
    }
    if (!module.classList.contains('open') || !module.closest('.subject').classList.contains('open')) return;
    if (!body.querySelector('.csp-panel')) body.insertAdjacentHTML('afterbegin',progressPanel(module,meta));
    else {
      const panel = body.querySelector('[data-ds-summary]');
      if (panel) { const html = progressPanel(module,meta); if (panel.outerHTML !== html) panel.outerHTML = html; }
    }
    if (!body.querySelector(':scope > .ds-module-nav')) {
      const nav = document.createElement('nav'); nav.className = 'ds-module-nav'; nav.setAttribute('aria-label','Navegação do módulo');
      nav.innerHTML = '<button type="button" data-ds-action="content">Conteúdo</button><button type="button" data-ds-action="questions">Questões / TEC</button><button type="button" data-ds-action="resources">Ferramentas</button><button type="button" data-ds-action="notes">Anotações</button>';
      const panel = body.querySelector('.csp-panel'); if (panel) panel.after(nav); else body.prepend(nav);
    }
    notes(module,body,meta);
  }
  function refresh() {
    scheduled = false;
    const root = document.getElementById('subjects'); if (!root) return;
    observer?.disconnect();
    try {
      root.querySelectorAll('.subject').forEach(subject => {
        const body = subject.querySelector('.subject-body');
        if (!body) return;
        if (subject.dataset.id === 'civil') { body.querySelector('.civil-master-intro')?.classList.add('ds-course-intro'); return; }
        let intro = body.querySelector(':scope > .ds-course-intro');
        if (!intro) {
          intro = document.createElement('header'); intro.className = 'ds-course-intro';
          intro.innerHTML = '<h3></h3><p></p>';
          body.prepend(intro);
        }
        const title = subject.querySelector('.subject-name')?.textContent || '';
        const count = subject.querySelector('.subject-count')?.textContent || '';
        if (intro.querySelector('h3').textContent !== title) intro.querySelector('h3').textContent = title;
        if (intro.querySelector('p').textContent !== count) intro.querySelector('p').textContent = count;
      });
      root.querySelectorAll(MODULES).forEach(module => { try { enhance(module); } catch (error) { console.warn('Apresentação do módulo',error); } });
    }
    finally { observer?.observe(root,{childList:true,subtree:true}); }
  }
  function schedule() { if (!scheduled) { scheduled = true; requestAnimationFrame(refresh); } }
  function navigate(module, action) {
    const body = bodyOf(module), meta = identity(module);
    if (action === 'notes') { const area = body.querySelector('.ds-notes textarea'); area?.scrollIntoView({block:'center'}); area?.focus({preventScroll:true}); return; }
    if (meta.subject === 'pt' && typeof window.ptNativeTab === 'function') {
      window.ptNativeTab(meta.id,action === 'questions' ? 'questoes' : action === 'review' ? 'revisao' : action === 'resources' ? 'tec' : 'teoria'); return;
    }
    if (action === 'resources') {
      const button = body.querySelector('button[onclick*="openLeiSeca"],button[onclick*="decorando"],a[onclick*="openLeiSeca"]');
      if (button) { button.click(); return; }
    }
    const selector = action === 'questions' ? '.csp-tec:not(.ds-progress .csp-tec),.perf-form,.cpp-rounds,.cf-step,.cf-resources' : action === 'resources' ? '.cpp-actions,.resource,.cf-resources' : '.civil-a-section,.cf-steps,[data-ptn-host],.cpp-summary,.prestudy';
    let target = body.querySelector(selector) || body;
    if (action === 'questions' && meta.subject !== 'civil') {
      const stages = Array.from(body.querySelectorAll('.cf-step'));
      target = stages.find(x => /diagnóstico|bateria|questões/i.test(x.querySelector('.cf-step-copy b')?.textContent || '')) || body.querySelector('.cf-resources') || target;
    }
    const details = target.closest('details'); if (details) details.open = true;
    target.scrollIntoView({block:'start'});
  }
  document.addEventListener('click',function (event) {
    const action = event.target.closest('[data-ds-action]');
    if (action) { const module = action.closest('.ds-module'); if (module) navigate(module,action.dataset.dsAction); }
    const save = event.target.closest('[data-ds-save-note]');
    if (save) {
      const box = save.closest('[data-ds-notes]');
      try { localStorage.setItem('central-v6:module-notes:' + box.dataset.dsNotes,box.querySelector('textarea').value); box.querySelector('[role=status]').textContent = 'Anotação salva'; }
      catch (_) { box.querySelector('[role=status]').textContent = 'Não foi possível salvar. Copie o texto para preservá-lo.'; }
    }
    if (event.target.closest('#subjects')) schedule();
  });
  document.addEventListener('change',function(event) { if (event.target.closest('#subjects')) schedule(); });
  // Keep new-note drafts during native re-renders without touching the original note stores.
  document.addEventListener('input',function(event) {
    const box = event.target.closest('[data-ds-notes]');
    if (box && event.target.matches('textarea')) {
      try { localStorage.setItem('central-v6:module-notes:' + box.dataset.dsNotes,event.target.value); box.querySelector('[role=status]').textContent = 'Anotação salva'; }
      catch (_) { box.querySelector('[role=status]').textContent = 'Não foi possível salvar'; }
    }
  });
  window.CentralDisciplineStandard = { refresh, version:'1.0.0' };
  function start() { observer = new MutationObserver(schedule); refresh(); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded',start,{once:true}); else start();
})();
