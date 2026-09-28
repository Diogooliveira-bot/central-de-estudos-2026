(function () {
  'use strict';
  if (window.__baseAgendaSimpleV1) return;
  window.__baseAgendaSimpleV1 = true;

  var core = window.BaseAgendaCore;
  if (!core) {
    console.error('[Agenda simples] Núcleo de dados não carregado.');
    return;
  }

  var memory = new Map();
  var invalidByDate = new Map();
  var state = {
    date: todayISO(),
    month: startOfMonth(todayISO()),
    optionsId: '',
    optionsDate: '',
    dragId: ''
  };

  function storage() {
    try {
      var candidate = window.localStorage;
      var probe = '__central_agenda_simple_probe__';
      candidate.setItem(probe, '1');
      candidate.removeItem(probe);
      return candidate;
    } catch (_) {
      return {
        get length() { return memory.size; },
        key: function (index) { return Array.from(memory.keys())[Number(index)] || null; },
        getItem: function (key) { return memory.has(String(key)) ? memory.get(String(key)) : null; },
        setItem: function (key, value) { memory.set(String(key), String(value)); },
        removeItem: function (key) { memory.delete(String(key)); }
      };
    }
  }

  var store = storage();

  function todayISO() {
    var date = new Date();
    return [date.getFullYear(), String(date.getMonth() + 1).padStart(2, '0'), String(date.getDate()).padStart(2, '0')].join('-');
  }

  function parseLocalDate(iso) {
    var parts = String(iso || '').split('-').map(Number);
    return new Date(parts[0] || 1970, (parts[1] || 1) - 1, parts[2] || 1, 12, 0, 0, 0);
  }

  function isoDate(date) {
    return [date.getFullYear(), String(date.getMonth() + 1).padStart(2, '0'), String(date.getDate()).padStart(2, '0')].join('-');
  }

  function startOfMonth(iso) {
    var date = parseLocalDate(iso);
    date.setDate(1);
    return isoDate(date);
  }

  function addMonths(iso, amount) {
    var date = parseLocalDate(iso);
    date.setDate(1);
    date.setMonth(date.getMonth() + Number(amount || 0));
    return isoDate(date);
  }

  function longDate(iso) {
    var value = parseLocalDate(iso).toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' });
    return value.charAt(0).toUpperCase() + value.slice(1);
  }

  function shortDate(iso) {
    return parseLocalDate(iso).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
  }

  function escapeHtml(value) {
    return String(value == null ? '' : value).replace(/[&<>"']/g, function (char) {
      return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char];
    });
  }

  function disciplineLabel(value) {
    var labels = {
      pt: 'Português', cf: 'Direito Constitucional', adm: 'Direito Administrativo',
      civil: 'Direito Civil', cpc: 'Direito Processual Civil', penal: 'Direito Penal',
      cpp: 'Direito Processual Penal', rlm: 'Raciocínio Lógico-Matemático',
      trab: 'Direito do Trabalho', ptra: 'Direito Processual do Trabalho'
    };
    return labels[String(value || '')] || String(value || '');
  }

  function setStatus(message, kind) {
    var host = document.getElementById('agendaSimpleStatus');
    if (!host) return;
    host.textContent = message || '';
    host.className = 'agenda-simple-status' + (kind ? ' ' + kind : '');
  }

  function read(date, quiet) {
    var raw = null;
    try { raw = store.getItem(core.agendaKey(date)); } catch (_) {}
    var parsed = core.parseTasks(raw);
    if (!parsed.ok) {
      invalidByDate.set(String(date), parsed.raw);
      if (!quiet) setStatus('Existe um registro antigo inválido neste dia. Ele foi preservado e não será apagado.', 'warning');
      return [];
    }
    invalidByDate.delete(String(date));
    return parsed.tasks;
  }

  function preserveInvalid(date) {
    if (!invalidByDate.has(String(date))) return;
    var raw = invalidByDate.get(String(date));
    var recoveryKey = 'central-v6:agenda-recovery:' + date + ':' + Date.now();
    store.setItem(recoveryKey, raw);
    invalidByDate.delete(String(date));
  }

  function write(date, tasks) {
    try {
      preserveInvalid(date);
      store.setItem(core.agendaKey(date), core.serializeTasks(tasks));
      return true;
    } catch (error) {
      setStatus('Não foi possível salvar esta alteração neste navegador.', 'error');
      console.warn('[Agenda simples] Falha ao salvar', error);
      return false;
    }
  }

  function storedDates() {
    var dates = [];
    try {
      for (var index = 0; index < store.length; index += 1) {
        var date = core.dateFromKey(store.key(index));
        if (date) dates.push(date);
      }
    } catch (_) {}
    return Array.from(new Set(dates)).sort();
  }

  function overdueTasks(referenceDate) {
    var output = [];
    storedDates().filter(function (date) { return date < referenceDate; }).forEach(function (date) {
      read(date, true).forEach(function (task) {
        if (!task.done) output.push({ date: date, task: task });
      });
    });
    return output.sort(function (a, b) { return b.date.localeCompare(a.date); }).slice(0, 100);
  }

  function calendarHtml() {
    var monthDate = parseLocalDate(state.month);
    var year = monthDate.getFullYear();
    var month = monthDate.getMonth();
    var label = monthDate.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
    label = label.charAt(0).toUpperCase() + label.slice(1);
    var firstOffset = (new Date(year, month, 1).getDay() + 6) % 7;
    var days = new Date(year, month + 1, 0).getDate();
    var cells = [];
    for (var blank = 0; blank < firstOffset; blank += 1) cells.push('<span class="agenda-cal-empty" aria-hidden="true"></span>');
    for (var day = 1; day <= days; day += 1) {
      var date = isoDate(new Date(year, month, day, 12));
      var count = read(date, true).length;
      cells.push('<button type="button" class="agenda-cal-day' + (date === state.date ? ' selected' : '') + (date === todayISO() ? ' today' : '') + '" data-action="select-date" data-date="' + date + '" aria-label="' + escapeHtml(longDate(date)) + '"><span>' + day + '</span>' + (count ? '<small>' + count + '</small>' : '') + '</button>');
    }
    return '<div class="agenda-calendar-head"><button type="button" data-action="month-prev" aria-label="Mês anterior">‹</button><b>' + escapeHtml(label) + '</b><button type="button" data-action="month-next" aria-label="Próximo mês">›</button></div>' +
      '<div class="agenda-calendar-week"><span>Seg</span><span>Ter</span><span>Qua</span><span>Qui</span><span>Sex</span><span>Sáb</span><span>Dom</span></div>' +
      '<div class="agenda-calendar-grid">' + cells.join('') + '</div>';
  }

  function taskOptions(task, date) {
    if (String(state.optionsId) !== String(task.id) || state.optionsDate !== date) return '';
    return '<div class="agenda-task-options" data-task-options>' +
      '<label><span>Horário</span><input type="time" data-edit-time value="' + escapeHtml(task.time || '') + '"></label>' +
      '<label class="wide"><span>Observação</span><textarea data-edit-note rows="2" placeholder="Opcional">' + escapeHtml(task.note || '') + '</textarea></label>' +
      '<label class="wide"><span>Tarefa</span><input type="text" data-edit-task value="' + escapeHtml(task.task || '') + '"></label>' +
      '<div class="agenda-option-actions wide"><button type="button" data-action="save-edit" data-id="' + escapeHtml(task.id) + '" data-date="' + date + '">Salvar edição</button></div>' +
      '<label><span>Outra data</span><input type="date" data-target-date value="' + state.date + '"></label>' +
      '<div class="agenda-option-actions"><button type="button" data-action="duplicate" data-id="' + escapeHtml(task.id) + '" data-date="' + date + '">Duplicar</button><button type="button" data-action="reschedule" data-id="' + escapeHtml(task.id) + '" data-date="' + date + '">Remarcar</button></div>' +
      '<div class="agenda-option-actions wide"><button type="button" class="danger" data-action="delete" data-id="' + escapeHtml(task.id) + '" data-date="' + date + '">Excluir tarefa</button></div>' +
      '</div>';
  }

  function taskRow(task, index, date, overdue) {
    var context = disciplineLabel(task.discipline);
    var detail = [task.time || '', context].filter(Boolean).join(' · ');
    return '<article class="agenda-simple-task' + (task.done ? ' done' : '') + (overdue ? ' overdue' : '') + '" draggable="' + (!overdue ? 'true' : 'false') + '" data-task-id="' + escapeHtml(task.id) + '" data-task-date="' + date + '">' +
      '<label class="agenda-task-check"><input type="checkbox" data-action="toggle" data-id="' + escapeHtml(task.id) + '" data-date="' + date + '" ' + (task.done ? 'checked' : '') + '><span></span></label>' +
      '<div class="agenda-task-copy"><b>' + escapeHtml(task.task || 'Tarefa sem descrição') + '</b>' + (detail ? '<small>' + escapeHtml(detail) + '</small>' : '') + (task.note ? '<p>' + escapeHtml(task.note) + '</p>' : '') + (overdue ? '<em>' + escapeHtml(shortDate(date)) + '</em>' : '') + '</div>' +
      (!overdue ? '<div class="agenda-task-order"><button type="button" data-action="move-up" data-id="' + escapeHtml(task.id) + '" aria-label="Mover para cima" ' + (index === 0 ? 'disabled' : '') + '>↑</button><button type="button" data-action="move-down" data-id="' + escapeHtml(task.id) + '" aria-label="Mover para baixo">↓</button></div>' : '') +
      '<button type="button" class="agenda-task-more" data-action="options" data-id="' + escapeHtml(task.id) + '" data-date="' + date + '" aria-label="Opções da tarefa">•••</button>' +
      taskOptions(task, date) +
      '</article>';
  }

  function renderHome() {
    var host = document.getElementById('agendaSimpleHome');
    if (!host) return;
    var tasks = read(todayISO(), true);
    var pending = core.pendingCount(tasks);
    var overdue = overdueTasks(todayISO());
    var disciplines = Array.from(document.querySelectorAll('#disciplineGrid .disc-card')).map(function (card) {
      return {
        id: card.dataset.id || '',
        title: (card.querySelector('b') || {}).textContent || 'Disciplina',
        detail: (card.querySelector('small') || {}).textContent || ''
      };
    });
    if (!disciplines.length) disciplines = [
      { id: 'cf', title: 'Direito Constitucional', detail: 'Curso por módulos' },
      { id: 'adm', title: 'Direito Administrativo', detail: 'Tópicos do edital' },
      { id: 'civil', title: 'Direito Civil', detail: 'Curso por módulos' },
      { id: 'cpc', title: 'Direito Processual Civil', detail: 'Curso por módulos' },
      { id: 'penal', title: 'Direito Penal', detail: 'Curso por módulos' },
      { id: 'cpp', title: 'Direito Processual Penal', detail: 'Tópicos do edital' }
    ];
    function brief(item, date, isOverdue) {
      var task = item.task || item;
      var detail = [task.time || '', disciplineLabel(task.discipline)].filter(Boolean).join(' · ');
      return '<label class="agenda-home-task' + (task.done ? ' done' : '') + (isOverdue ? ' overdue' : '') + '">' +
        '<input type="checkbox" data-action="home-toggle" data-id="' + escapeHtml(task.id) + '" data-date="' + escapeHtml(date) + '" ' + (task.done ? 'checked' : '') + '>' +
        '<span><b>' + escapeHtml(task.task || 'Tarefa sem descrição') + '</b>' +
        (detail ? '<small>' + escapeHtml(detail) + '</small>' : '') +
        (isOverdue ? '<em>' + escapeHtml(shortDate(date)) + '</em>' : '') +
        '</span></label>';
    }
    var todayHtml = tasks.length ? tasks.map(function (task) { return brief(task, todayISO(), false); }).join('') : '<div class="agenda-home-empty">Nenhuma tarefa para hoje.</div>';
    var overdueHtml = overdue.length ? overdue.slice(0, 6).map(function (item) { return brief(item, item.date, true); }).join('') : '<div class="agenda-home-empty">Nenhuma pendência anterior.</div>';
    var disciplineHtml = disciplines.map(function (item) {
      return '<button type="button" class="agenda-home-discipline" data-action="open-discipline" data-id="' + escapeHtml(item.id) + '"><b>' + escapeHtml(item.title) + '</b><small>' + escapeHtml(item.detail) + '</small><span>Abrir disciplina</span></button>';
    }).join('');
    host.innerHTML = '<div class="agenda-home-heading"><div><span>INÍCIO</span><h1>Meu estudo de hoje</h1><p>' + escapeHtml(longDate(todayISO())) + '</p></div><button type="button" data-action="open-agenda">Abrir Agenda</button></div>' +
      '<div class="agenda-home-summary"><div><small>Para hoje</small><b>' + tasks.length + '</b><span>tarefas</span></div><div><small>Pendentes hoje</small><b>' + pending + '</b><span>tarefas</span></div><div><small>Pendências anteriores</small><b>' + overdue.length + '</b><span>tarefas</span></div></div>' +
      '<div class="agenda-home-grid"><section class="agenda-home-panel"><div class="agenda-home-panel-head"><h2>Hoje</h2><span>' + pending + ' pendente' + (pending === 1 ? '' : 's') + '</span></div><div class="agenda-home-list">' + todayHtml + '</div></section>' +
      '<section class="agenda-home-panel"><div class="agenda-home-panel-head"><h2>Pendências</h2><span>dias anteriores</span></div><div class="agenda-home-list">' + overdueHtml + '</div></section></div>' +
      '<section class="agenda-home-disciplines"><div class="agenda-home-panel-head"><h2>Disciplinas</h2><button type="button" data-action="open-disciplines">Ver todas</button></div><div class="agenda-home-discipline-grid">' + disciplineHtml + '</div></section>';
  }

  function render() {
    var view = document.getElementById('agendaView');
    if (!view || !view.classList.contains('agenda-simple-ready')) return false;
    var tasks = read(state.date);
    var done = tasks.filter(function (task) { return task.done; }).length;
    var editor = document.getElementById('agendaEditor');
    var calendar = document.getElementById('agendaSimpleCalendar');
    var title = document.getElementById('agendaSelectedDate');
    var progress = document.getElementById('agendaDayProgress');
    var dateInput = document.getElementById('agendaDate');
    if (dateInput) dateInput.value = state.date;
    if (title) title.textContent = longDate(state.date);
    if (progress) progress.textContent = done + ' de ' + tasks.length + ' concluída' + (tasks.length === 1 ? '' : 's');
    if (calendar) calendar.innerHTML = calendarHtml();
    if (editor) editor.innerHTML = tasks.length ? tasks.map(function (task, index) { return taskRow(task, index, state.date, false); }).join('') : '<div class="agenda-simple-empty">Nenhuma tarefa neste dia.</div>';
    var overdue = overdueTasks(state.date);
    var overdueSection = document.getElementById('agendaOverdueSection');
    var overdueHost = document.getElementById('agendaOverdue');
    if (overdueSection) overdueSection.hidden = overdue.length === 0;
    if (overdueHost) overdueHost.innerHTML = overdue.map(function (item, index) { return taskRow(item.task, index, item.date, true); }).join('');
    renderHome();
    return true;
  }

  function add() {
    var taskInput = document.getElementById('agendaTask');
    var value = String(taskInput && taskInput.value || '').trim();
    if (!value) {
      setStatus('Digite uma tarefa.', 'warning');
      if (taskInput) taskInput.focus();
      return false;
    }
    var tasks = read(state.date);
    tasks.push(core.createTask({ task: value, time: document.getElementById('agendaTime') && document.getElementById('agendaTime').value, note: document.getElementById('agendaNote') && document.getElementById('agendaNote').value }));
    if (write(state.date, tasks)) {
      taskInput.value = '';
      var note = document.getElementById('agendaNote');
      var time = document.getElementById('agendaTime');
      if (note) note.value = '';
      if (time) time.value = '';
      setStatus('Tarefa adicionada.', 'success');
      render();
      taskInput.focus();
    }
    return false;
  }

  function toggle(date, id, done) {
    var tasks = core.toggleTask(read(date), id, done);
    var index = tasks.findIndex(function (task) { return String(task.id) === String(id); });
    if (index >= 0) tasks[index].completedAt = done ? new Date().toISOString() : null;
    if (write(date, tasks)) render();
    return false;
  }

  function remove(date, id) {
    if (!window.confirm('Excluir esta tarefa?')) return false;
    if (write(date, core.removeTask(read(date), id))) {
      state.optionsId = '';
      setStatus('Tarefa excluída.', 'success');
      render();
    }
    return false;
  }

  function targetDateFor(button) {
    var options = button.closest('[data-task-options]');
    var input = options && options.querySelector('[data-target-date]');
    return input && input.value || state.date;
  }

  function duplicate(button) {
    var sourceDate = button.dataset.date;
    var targetDate = targetDateFor(button);
    var source = read(sourceDate).find(function (task) { return String(task.id) === String(button.dataset.id); });
    if (!source) return;
    var target = read(targetDate);
    target.push(core.duplicateTask(source));
    if (write(targetDate, target)) {
      setStatus('Tarefa duplicada para ' + shortDate(targetDate) + '.', 'success');
      state.date = targetDate;
      state.month = startOfMonth(targetDate);
      state.optionsId = '';
      render();
    }
  }

  function reschedule(button) {
    var sourceDate = button.dataset.date;
    var targetDate = targetDateFor(button);
    if (targetDate === sourceDate) return;
    var sourceTasks = read(sourceDate);
    var task = sourceTasks.find(function (item) { return String(item.id) === String(button.dataset.id); });
    if (!task) return;
    var targetTasks = read(targetDate);
    targetTasks.push(Object.assign({}, task, { rescheduledFrom: sourceDate }));
    if (!write(targetDate, targetTasks)) return;
    if (!write(sourceDate, core.removeTask(sourceTasks, task.id))) return;
    setStatus('Tarefa remarcada para ' + shortDate(targetDate) + '.', 'success');
    state.date = targetDate;
    state.month = startOfMonth(targetDate);
    state.optionsId = '';
    render();
  }

  function saveEdit(button) {
    var options = button.closest('[data-task-options]');
    var patch = {
      task: String(options.querySelector('[data-edit-task]').value || '').trim(),
      time: options.querySelector('[data-edit-time]').value || '',
      note: String(options.querySelector('[data-edit-note]').value || '').trim()
    };
    if (!patch.task) return setStatus('A descrição da tarefa não pode ficar vazia.', 'warning');
    if (write(button.dataset.date, core.updateTask(read(button.dataset.date), button.dataset.id, patch))) {
      state.optionsId = '';
      setStatus('Tarefa atualizada.', 'success');
      render();
    }
  }

  function move(id, direction) {
    if (write(state.date, core.moveTask(read(state.date), id, direction))) render();
  }

  function reorder(dragId, targetId) {
    var tasks = read(state.date);
    var target = tasks.findIndex(function (task) { return String(task.id) === String(targetId); });
    if (target < 0) return;
    if (write(state.date, core.moveTaskTo(tasks, dragId, target))) render();
  }

  function setActive(button) {
    document.querySelectorAll('#centralSidebar .nav button').forEach(function (item) { item.classList.remove('active'); item.removeAttribute('aria-current'); });
    if (button) { button.classList.add('active'); button.setAttribute('aria-current', 'page'); }
    if (typeof window.closeMobileSidebar === 'function') window.closeMobileSidebar();
  }

  function hideAllViews() {
    document.querySelectorAll('.workspace > .view').forEach(function (view) { view.classList.add('hidden'); view.classList.remove('central-view-visible'); });
  }

  function showView(id, label, button) {
    hideAllViews();
    var view = document.getElementById(id);
    if (!view) return null;
    view.classList.remove('hidden');
    view.classList.add('central-view-visible');
    var crumb = document.getElementById('crumb');
    if (crumb) crumb.textContent = label;
    setActive(button);
    try { window.scrollTo(0, 0); } catch (_) {}
    return view;
  }

  function open(button) {
    state.date = todayISO();
    state.month = startOfMonth(state.date);
    state.optionsId = '';
    showView('agendaView', 'Agenda', button || document.querySelector('[data-central-agenda]'));
    setStatus('');
    render();
    setTimeout(function () { var input = document.getElementById('agendaTask'); if (input) input.focus(); }, 0);
    return false;
  }

  function openHome(button) {
    showView('homeView', 'Início', button || document.querySelector('[data-simple-nav="home"]'));
    try { if (typeof window.renderAll === 'function') window.renderAll(); } catch (_) {}
    renderHome();
    return false;
  }

  function openDisciplines(button) {
    showView('disciplinesView', 'Disciplinas', button || document.querySelector('[data-simple-nav="disciplines"]'));
    setTimeout(function () { try { if (typeof window.renderDisciplineGrid === 'function') window.renderDisciplineGrid(); } catch (_) {} }, 0);
    return false;
  }

  function errorSources() {
    var list = [];
    try { if (typeof CF_WEEKS !== 'undefined' && typeof cfModuleErrors === 'function') list.push({ key: 'cf', label: 'Direito Constitucional', weeks: CF_WEEKS, errors: cfModuleErrors, open: openCfLast, start: startCfGlobalErrors }); } catch (_) {}
    try { if (typeof PENAL_WEEKS !== 'undefined' && typeof penalModuleErrors === 'function') list.push({ key: 'penal', label: 'Direito Penal', weeks: PENAL_WEEKS, errors: penalModuleErrors, open: openPenalLast, start: startPenalGlobalErrors }); } catch (_) {}
    try { if (typeof CPC_WEEKS !== 'undefined' && typeof cpcModuleErrors === 'function') list.push({ key: 'cpc', label: 'Direito Processual Civil', weeks: CPC_WEEKS, errors: cpcModuleErrors, open: openCpcLast, start: startCpcGlobalErrors }); } catch (_) {}
    return list.map(function (source) {
      source.modules = source.weeks.map(function (week) { return { id: week.id, num: week.num, title: week.title, count: source.errors(week).length }; }).filter(function (module) { return module.count > 0; });
      source.count = source.modules.reduce(function (sum, module) { return sum + module.count; }, 0);
      return source;
    });
  }

  function renderErrors(kind) {
    var host = document.getElementById(kind === 'review' ? 'reviewErrorsContent' : 'errorNotebookContent');
    if (!host) return;
    var sources = errorSources();
    var total = sources.reduce(function (sum, source) { return sum + source.count; }, 0);
    if (!total) {
      host.innerHTML = '<div class="agenda-simple-empty"><b>Nenhum erro pendente.</b><span>Quando uma questão for errada, ela aparecerá aqui sem criar uma nova cópia dos dados.</span></div>';
      return;
    }
    host.innerHTML = sources.map(function (source) {
      if (!source.count) return '';
      var modules = source.modules.map(function (module) {
        return '<button type="button" class="error-module-row" data-error-open="' + source.key + '" data-module="' + escapeHtml(module.id) + '"><span><b>Módulo ' + escapeHtml(module.num) + '</b><small>' + escapeHtml(module.title) + '</small></span><em>' + module.count + ' erro' + (module.count === 1 ? '' : 's') + '</em></button>';
      }).join('');
      return '<section class="error-source-card"><div><span>' + escapeHtml(source.label) + '</span><b>' + source.count + ' pendente' + (source.count === 1 ? '' : 's') + '</b></div>' + (kind === 'review' ? '<button type="button" data-error-review="' + source.key + '">Revisar agora</button>' : '') + '<div class="error-module-list">' + modules + '</div></section>';
    }).join('');
  }

  function openErrors(kind, button) {
    var id = kind === 'review' ? 'reviewErrorsView' : 'errorNotebookView';
    showView(id, kind === 'review' ? 'Revisar meus erros' : 'Caderno de Erros', button);
    renderErrors(kind);
    return false;
  }

  function sourceFor(key) {
    return errorSources().find(function (source) { return source.key === key; });
  }

  function openErrorModule(key, moduleId, startReview) {
    var source = sourceFor(key);
    if (!source) return;
    var module = source.modules.find(function (item) { return String(item.id) === String(moduleId); }) || source.modules[0];
    if (!module) return;
    source.open(module.id);
    if (startReview) setTimeout(function () { try { source.start(); } catch (error) { console.warn('[Erros] Não foi possível iniciar a revisão.', error); } }, 60);
  }

  function installViews() {
    var agenda = document.getElementById('agendaView');
    if (!agenda) return;
    agenda.classList.add('agenda-simple-ready');
    agenda.innerHTML = '<div class="agenda-simple-header"><div><span class="eyebrow">AGENDA</span><h1 id="agendaSelectedDate"></h1><p>O que eu preciso fazer hoje?</p></div><button type="button" data-action="today">Hoje</button></div>' +
      '<div class="agenda-simple-layout"><aside class="agenda-calendar-card"><div id="agendaSimpleCalendar"></div></aside><main>' +
      '<section class="agenda-quick-add"><div class="agenda-add-line"><input id="agendaTask" type="text" autocomplete="off" placeholder="Adicionar tarefa e pressionar Enter"><button id="agendaAddButton" type="button" data-action="add">Adicionar</button></div><button type="button" class="agenda-more-fields-button" data-action="toggle-more">+ Horário e observação</button><div id="agendaMoreFields" class="agenda-more-fields" hidden><label><span>Horário</span><input id="agendaTime" type="time"></label><label><span>Observação</span><input id="agendaNote" type="text" placeholder="Opcional"></label></div><input id="agendaDate" type="hidden"><div id="agendaSimpleStatus" class="agenda-simple-status" aria-live="polite"></div></section>' +
      '<section id="agendaOverdueSection" class="agenda-overdue-section" hidden><div class="agenda-section-title"><div><span>PENDENTES</span><small>De dias anteriores</small></div></div><div id="agendaOverdue" class="agenda-simple-list"></div></section>' +
      '<section><div class="agenda-section-title"><h2>Tarefas</h2><span id="agendaDayProgress"></span></div><div id="agendaEditor" class="agenda-simple-list"></div></section>' +
      '</main></div>';

    var workspace = document.querySelector('.workspace');
    if (workspace && !document.getElementById('reviewErrorsView')) {
      var review = document.createElement('section');
      review.className = 'view hidden agenda-errors-view'; review.id = 'reviewErrorsView';
      review.innerHTML = '<div class="agenda-simple-header"><div><span class="eyebrow">REVISÃO</span><h1>Revisar meus erros</h1><p>Retome apenas as questões que continuam pendentes.</p></div></div><div id="reviewErrorsContent" class="agenda-error-grid"></div>';
      workspace.appendChild(review);
      var notebook = document.createElement('section');
      notebook.className = 'view hidden agenda-errors-view'; notebook.id = 'errorNotebookView';
      notebook.innerHTML = '<div class="agenda-simple-header"><div><span class="eyebrow">ERROS</span><h1>Caderno de Erros</h1><p>Visão consolidada dos erros já registrados nos módulos.</p></div></div><div id="errorNotebookContent" class="agenda-error-grid"></div>';
      workspace.appendChild(notebook);
    }
  }

  function makeNavButton(label, action, path) {
    var button = document.createElement('button');
    button.type = 'button';
    button.dataset.simpleNav = action;
    button.innerHTML = '<span class="nav-icon"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="' + path + '"></path></svg></span><span class="nav-text">' + label + '</span>';
    button.setAttribute('aria-label', label);
    button.title = label;
    return button;
  }

  function installNavigation() {
    var nav = document.querySelector('#centralSidebar .nav');
    if (!nav) return;
    var buttons = Array.from(nav.querySelectorAll(':scope > button'));
    function byLabel(pattern) { return buttons.find(function (button) { return pattern.test((button.textContent || '').trim()); }); }
    var home = byLabel(/^Início$/i);
    var disciplines = byLabel(/^Disciplinas$/i);
    var agenda = byLabel(/^Agenda$/i);
    var decorando = byLabel(/^Decorando a Lei Seca$/i);
    var vade = byLabel(/^Vade Mecum$/i);
    buttons.forEach(function (button) { button.hidden = ![home, disciplines, agenda, decorando, vade].includes(button); });
    nav.querySelectorAll(':scope > .label').forEach(function (label) { label.hidden = true; });
    if (home) { home.dataset.simpleNav = 'home'; home.onclick = function () { return openHome(home); }; }
    if (disciplines) { disciplines.dataset.simpleNav = 'disciplines'; disciplines.onclick = function () { return openDisciplines(disciplines); }; }
    if (agenda) { agenda.dataset.simpleNav = 'agenda'; agenda.onclick = function () { return open(agenda); }; }
    var review = makeNavButton('Revisar meus erros', 'review-errors', 'M4 5h16v14H4zM8 9h8M8 13h8M8 17h5M18 3v4M16 5h4');
    review.onclick = function () { return openErrors('review', review); };
    [home, disciplines, agenda, decorando, review, vade].forEach(function (button) { if (button) nav.appendChild(button); });
  }

  function installHome() {
    var home = document.getElementById('homeView');
    if (!home) return;
    var hero = home.querySelector('.hero');
    if (hero) {
      hero.classList.add('agenda-simple-home-legacy');
    }
    var legacy = home.querySelector('.home-grid');
    if (legacy) legacy.classList.add('agenda-simple-home-legacy');
    if (!document.getElementById('agendaSimpleHome')) {
      var card = document.createElement('section');
      card.id = 'agendaSimpleHome';
      card.className = 'agenda-simple-home-dashboard';
      card.addEventListener('click', function (event) {
        var action = event.target.closest('[data-action]');
        if (!action) return;
        if (action.dataset.action === 'open-agenda') open();
        if (action.dataset.action === 'open-disciplines') openDisciplines(action);
        if (action.dataset.action === 'open-discipline' && typeof window.centralHardSubject === 'function') window.centralHardSubject(action.dataset.id);
      });
      card.addEventListener('change', function (event) {
        var input = event.target.closest('input[data-action="home-toggle"]');
        if (input) toggle(input.dataset.date, input.dataset.id, input.checked);
      });
      if (legacy) legacy.parentNode.insertBefore(card, legacy); else home.appendChild(card);
    }
    renderHome();
  }

  function bindAgenda() {
    var view = document.getElementById('agendaView');
    if (!view || view.dataset.agendaSimpleBound) return;
    view.dataset.agendaSimpleBound = '1';
    view.addEventListener('click', function (event) {
      var button = event.target.closest('[data-action]');
      if (!button) return;
      var action = button.dataset.action;
      if (action === 'add') add();
      else if (action === 'today') { state.date = todayISO(); state.month = startOfMonth(state.date); state.optionsId = ''; render(); }
      else if (action === 'select-date') { state.date = button.dataset.date; state.month = startOfMonth(state.date); state.optionsId = ''; render(); }
      else if (action === 'month-prev') { state.month = addMonths(state.month, -1); render(); }
      else if (action === 'month-next') { state.month = addMonths(state.month, 1); render(); }
      else if (action === 'toggle-more') { var fields = document.getElementById('agendaMoreFields'); fields.hidden = !fields.hidden; }
      else if (action === 'options') { state.optionsId = String(state.optionsId) === String(button.dataset.id) && state.optionsDate === button.dataset.date ? '' : button.dataset.id; state.optionsDate = button.dataset.date; render(); }
      else if (action === 'move-up') move(button.dataset.id, -1);
      else if (action === 'move-down') move(button.dataset.id, 1);
      else if (action === 'save-edit') saveEdit(button);
      else if (action === 'duplicate') duplicate(button);
      else if (action === 'reschedule') reschedule(button);
      else if (action === 'delete') remove(button.dataset.date, button.dataset.id);
    });
    view.addEventListener('change', function (event) {
      var input = event.target.closest('input[data-action="toggle"]');
      if (input) toggle(input.dataset.date, input.dataset.id, input.checked);
    });
    view.addEventListener('keydown', function (event) {
      if (event.target && event.target.id === 'agendaTask' && event.key === 'Enter' && !event.shiftKey) { event.preventDefault(); add(); }
    });
    view.addEventListener('dragstart', function (event) {
      var row = event.target.closest('.agenda-simple-task[draggable="true"]');
      if (!row) return;
      state.dragId = row.dataset.taskId;
      row.classList.add('dragging');
      if (event.dataTransfer) event.dataTransfer.effectAllowed = 'move';
    });
    view.addEventListener('dragend', function () { state.dragId = ''; view.querySelectorAll('.dragging').forEach(function (row) { row.classList.remove('dragging'); }); });
    view.addEventListener('dragover', function (event) { if (event.target.closest('.agenda-simple-task[draggable="true"]')) event.preventDefault(); });
    view.addEventListener('drop', function (event) { var row = event.target.closest('.agenda-simple-task[draggable="true"]'); if (row && state.dragId) { event.preventDefault(); reorder(state.dragId, row.dataset.taskId); } });
  }

  function bindErrors() {
    document.querySelectorAll('.agenda-errors-view').forEach(function (view) {
      if (view.dataset.errorBound) return;
      view.dataset.errorBound = '1';
      view.addEventListener('click', function (event) {
        var review = event.target.closest('[data-error-review]');
        if (review) { var source = sourceFor(review.dataset.errorReview); openErrorModule(review.dataset.errorReview, source && source.modules[0] && source.modules[0].id, true); return; }
        var openButton = event.target.closest('[data-error-open]');
        if (openButton) openErrorModule(openButton.dataset.errorOpen, openButton.dataset.module, false);
      });
    });
  }

  function boot() {
    installViews();
    installNavigation();
    installHome();
    bindAgenda();
    bindErrors();
    window.openHome = openHome;
    window.openDisciplines = openDisciplines;
    window.openAgenda = open;
    window.CentralAgenda = { open: open, add: add, toggle: toggle, remove: remove, render: render, read: read };
    window.addAgenda = add;
    window.toggleAgenda = toggle;
    window.deleteAgenda = remove;
    window.renderAgendaEditor = render;
    render();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot, { once: true });
  else boot();
})();
