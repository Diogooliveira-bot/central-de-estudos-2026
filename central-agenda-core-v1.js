(function (root) {
  'use strict';

  var PREFIX = 'central-v6:agenda:';

  function text(value) {
    return String(value == null ? '' : value).trim();
  }

  function parseTasks(raw) {
    if (raw == null || raw === '') return { ok: true, tasks: [], raw: raw };
    try {
      var parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) throw new Error('A Agenda antiga não contém uma lista.');
      return { ok: true, tasks: parsed.map(normalizeTask), raw: raw };
    } catch (error) {
      return { ok: false, tasks: [], raw: String(raw), error: String(error && error.message || error) };
    }
  }

  function normalizeTask(task, index) {
    var source = task && typeof task === 'object' && !Array.isArray(task) ? task : {};
    var result = Object.assign({}, source);
    var description = text(source.task || source.description || source.text);
    result.id = source.id == null || source.id === '' ? 'legacy-' + String(index || 0) : source.id;
    result.task = description;
    result.done = Boolean(source.done);
    result.time = text(source.time);
    if (source.note != null || source.observation != null) result.note = text(source.note || source.observation);
    return result;
  }

  function serializeTasks(tasks) {
    return JSON.stringify((Array.isArray(tasks) ? tasks : []).map(normalizeTask));
  }

  function createTask(input, now) {
    input = input || {};
    var stamp = Number(now || Date.now());
    return {
      id: String(stamp) + '-' + Math.random().toString(36).slice(2, 8),
      time: text(input.time),
      discipline: text(input.discipline),
      task: text(input.task || input.description || input.text),
      note: text(input.note || input.observation),
      done: false,
      createdAt: new Date(stamp).toISOString()
    };
  }

  function findIndex(tasks, id) {
    return (Array.isArray(tasks) ? tasks : []).findIndex(function (item) {
      return String(item && item.id) === String(id);
    });
  }

  function updateTask(tasks, id, patch) {
    var next = (Array.isArray(tasks) ? tasks : []).map(function (item) { return Object.assign({}, item); });
    var index = findIndex(next, id);
    if (index < 0) return next;
    next[index] = normalizeTask(Object.assign({}, next[index], patch || {}), index);
    return next;
  }

  function removeTask(tasks, id) {
    return (Array.isArray(tasks) ? tasks : []).filter(function (item) {
      return String(item && item.id) !== String(id);
    }).map(normalizeTask);
  }

  function toggleTask(tasks, id, done) {
    return updateTask(tasks, id, { done: Boolean(done) });
  }

  function moveTask(tasks, id, direction) {
    var next = (Array.isArray(tasks) ? tasks : []).map(function (item) { return Object.assign({}, item); });
    var from = findIndex(next, id);
    if (from < 0) return next.map(normalizeTask);
    var to = Math.max(0, Math.min(next.length - 1, from + Number(direction || 0)));
    if (to === from) return next.map(normalizeTask);
    var item = next.splice(from, 1)[0];
    next.splice(to, 0, item);
    return next.map(normalizeTask);
  }

  function moveTaskTo(tasks, id, targetIndex) {
    var next = (Array.isArray(tasks) ? tasks : []).map(function (item) { return Object.assign({}, item); });
    var from = findIndex(next, id);
    if (from < 0) return next.map(normalizeTask);
    var to = Math.max(0, Math.min(next.length - 1, Number(targetIndex || 0)));
    var item = next.splice(from, 1)[0];
    next.splice(to, 0, item);
    return next.map(normalizeTask);
  }

  function duplicateTask(task, now) {
    var copy = normalizeTask(task || {}, 0);
    copy.id = String(Number(now || Date.now())) + '-' + Math.random().toString(36).slice(2, 8);
    copy.done = false;
    copy.createdAt = new Date(Number(now || Date.now())).toISOString();
    delete copy.completedAt;
    return copy;
  }

  function agendaKey(date) {
    return PREFIX + String(date || '');
  }

  function dateFromKey(key) {
    var value = String(key || '');
    if (value.indexOf(PREFIX) !== 0) return '';
    var date = value.slice(PREFIX.length);
    return /^\d{4}-\d{2}-\d{2}$/.test(date) ? date : '';
  }

  function pendingCount(tasks) {
    return (Array.isArray(tasks) ? tasks : []).filter(function (task) { return !task.done; }).length;
  }

  var api = {
    PREFIX: PREFIX,
    agendaKey: agendaKey,
    createTask: createTask,
    dateFromKey: dateFromKey,
    duplicateTask: duplicateTask,
    moveTask: moveTask,
    moveTaskTo: moveTaskTo,
    normalizeTask: normalizeTask,
    parseTasks: parseTasks,
    pendingCount: pendingCount,
    removeTask: removeTask,
    serializeTasks: serializeTasks,
    toggleTask: toggleTask,
    updateTask: updateTask
  };

  root.BaseAgendaCore = api;
})(typeof window !== 'undefined' ? window : globalThis);
