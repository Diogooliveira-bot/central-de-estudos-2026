(function (global) {
  'use strict';
  const UX = global.CentralStudentUX;
  if (!UX || global.__centralStudentPlanV3) return;
  global.__centralStudentPlanV3 = true;
  const { byId, setText, localDate, escapeHTML } = UX;

  function ensureStudyPath() {
    // CF has its own native study flow; do not duplicate the general suggested sequence.
    document.querySelectorAll('#subjects > .subject[data-id="cf"] > .subject-body > .student-study-path').forEach(guide => guide.remove());
    document.querySelectorAll('#subjects > .subject.open:not([data-id="rlm"]):not([data-id="cf"])').forEach((section) => {
      const body = section.querySelector(':scope > .subject-body');
      if (!body || body.querySelector(':scope > .student-study-path')) return;
      const guide = document.createElement('aside');
      guide.className = 'student-study-path'; guide.setAttribute('aria-label', 'Sequência sugerida de estudo');
      guide.innerHTML = '<div><small>Sequência sugerida</small><b>Avance uma etapa por vez</b></div><ol><li class="active"><span>1</span>Leia</li><li><span>2</span>Pratique</li><li><span>3</span>Revise erros</li><li><span>4</span>Conclua</li></ol>';
      const bar = body.querySelector(':scope > .subject-bar');
      if (bar?.nextSibling) body.insertBefore(guide, bar.nextSibling); else body.prepend(guide);
    });
  }
  function agendaDayLabel(date, short = false) {
    const options = short ? { weekday:'short', day:'2-digit', month:'short' } : { weekday:'long', day:'2-digit', month:'long' };
    return new Intl.DateTimeFormat('pt-BR', options).format(new Date(`${date}T12:00:00`)).replace('.', '');
  }
  function tasksFor(date) { return global.CentralAgenda?.read?.(date) || []; }
  function renderAgendaWeek() {
    const host = byId('studentAgendaWeek'); const selected = byId('agendaDate')?.value || localDate(); if (!host) return;
    const days = Array.from({ length:7 }, (_, offset) => {
      const date = localDate(offset); const tasks = tasksFor(date); const done = tasks.filter((task) => task.done).length;
      return { date, tasks, done, preview:tasks.find((task) => !task.done) || tasks[0] };
    });
    const signature = `${selected}|${days.map(({ date, tasks }) => `${date}:${tasks.map((task) => `${task.id}:${task.done}:${task.task}`).join(',')}`).join('|')}`;
    if (host.dataset.signature !== signature) {
      host.dataset.signature = signature;
      host.innerHTML = days.map(({ date, tasks, done, preview }) => `<button type="button" class="student-agenda-day${date === selected ? ' active' : ''}" data-student-agenda-date="${date}" aria-pressed="${date === selected}">
        <span>${agendaDayLabel(date, true)}</span><b>${tasks.length ? `${done}/${tasks.length} feitas` : 'Livre'}</b><small>${preview ? escapeHTML(preview.task || '') : 'Sem tarefa planejada'}</small></button>`).join('');
    }
    const tasks = tasksFor(selected);
    setText(byId('studentAgendaDayTitle'), agendaDayLabel(selected, false).replace(/^./, (char) => char.toUpperCase()));
    setText(byId('studentAgendaDayCount'), tasks.length ? `${tasks.filter((task) => !task.done).length} pendente(s)` : 'Dia livre');
    const empty = byId('agendaEditor')?.querySelector('.agenda-empty,.student-agenda-empty');
    if (empty && !empty.classList.contains('student-agenda-empty')) {
      empty.className = 'student-agenda-empty';
      empty.innerHTML = '<span aria-hidden="true">＋</span><b>Este dia está livre</b><small>Adicione uma leitura, bloco de questões ou revisão.</small><button type="button" class="btn">Adicionar tarefa</button>';
      empty.querySelector('button').onclick = () => toggleForm(true);
    }
  }
  function toggleForm(forceOpen) {
    const card = document.querySelector('.student-agenda-form-card'); const button = byId('studentAgendaAddToggle'); if (!card || !button) return;
    const open = forceOpen === true || card.hidden;
    card.hidden = !open; button.setAttribute('aria-expanded', String(open)); button.textContent = open ? 'Fechar formulário' : '+ Adicionar tarefa';
    if (open) setTimeout(() => byId('agendaTask')?.focus(), 0);
  }
  function ensureAgenda() {
    const view = byId('agendaView'); const formGrid = view?.querySelector('.form-grid'); const formCard = formGrid?.closest('.card'); const editor = byId('agendaEditor');
    if (!view || !formCard || !editor) return;
    view.classList.add('student-agenda-view');
    setText(view.querySelector('.hero h1'), 'Plano de estudos');
    setText(view.querySelector('.hero p'), 'Veja a semana primeiro e ajuste uma tarefa quando precisar.');
    formCard.classList.add('student-agenda-form-card');
    if (!byId('studentAgendaToolbar')) {
      const toolbar = document.createElement('div'); toolbar.id = 'studentAgendaToolbar'; toolbar.className = 'student-agenda-toolbar';
      toolbar.innerHTML = '<div><small>Organização simples</small><h2>Próximos 7 dias</h2></div><button id="studentAgendaAddToggle" type="button" class="btn primary" aria-expanded="false">+ Adicionar tarefa</button>';
      formCard.parentNode.insertBefore(toolbar, formCard); byId('studentAgendaAddToggle').addEventListener('click', () => toggleForm()); formCard.hidden = true;
    }
    if (!byId('studentAgendaWeek')) {
      const week = document.createElement('div'); week.id = 'studentAgendaWeek'; week.className = 'student-agenda-week'; week.setAttribute('aria-label', 'Próximos sete dias');
      formCard.parentNode.insertBefore(week, formCard);
      week.addEventListener('click', (event) => {
        const button = event.target.closest('[data-student-agenda-date]'); if (!button) return;
        const date = byId('agendaDate'); if (date) { date.value = button.dataset.studentAgendaDate; date.dispatchEvent(new Event('change', { bubbles:true })); }
        global.CentralAgenda?.render?.(); renderAgendaWeek();
      });
    }
    let dayCard = byId('studentAgendaDayCard');
    if (!dayCard) {
      dayCard = document.createElement('section'); dayCard.id = 'studentAgendaDayCard'; dayCard.className = 'card student-agenda-day-card';
      dayCard.innerHTML = '<div class="card-head"><div><small>Tarefas do dia</small><h2 id="studentAgendaDayTitle"></h2></div><span id="studentAgendaDayCount"></span></div>';
      formCard.parentNode.insertBefore(dayCard, formCard); dayCard.appendChild(editor);
    } else if (editor.parentElement !== dayCard) dayCard.appendChild(editor);
    if (!byId('agendaDate')?.dataset.studentWeekBound) {
      const date = byId('agendaDate');
      if (date) { date.dataset.studentWeekBound = '1'; date.addEventListener('change', () => setTimeout(renderAgendaWeek, 0)); }
      byId('agendaAddButton')?.addEventListener('click', () => setTimeout(() => { renderAgendaWeek(); UX.schedule(); global.dispatchEvent(new Event('central:student-data-changed')); }, 0));
      editor.addEventListener('change', () => setTimeout(() => { renderAgendaWeek(); UX.schedule(); global.dispatchEvent(new Event('central:student-data-changed')); }, 0));
    }
    renderAgendaWeek();
  }
  function ensureLoadStates() {
    document.querySelectorAll('#subjects > .subject.central-subject-pending:not([data-id="rlm"])').forEach((section) => {
      const placeholder = section.querySelector('.subject-body'); if (!placeholder) return;
      placeholder.setAttribute('aria-busy', 'true'); placeholder.setAttribute('aria-live', 'polite');
    });
    const grid = byId('disciplineGrid');
    if (grid && !grid.children.length) {
      grid.setAttribute('aria-busy', 'true');
      grid.innerHTML = '<div class="student-loading-card" role="status"><span></span><span></span><span></span><b>Organizando suas disciplinas…</b></div>';
    } else grid?.removeAttribute('aria-busy');
  }
  function enhance() { ensureStudyPath(); ensureAgenda(); ensureLoadStates(); }
  global.CentralStudentPlan = { renderAgendaWeek, toggleForm };
  UX.register('plan', enhance);
})(window);
