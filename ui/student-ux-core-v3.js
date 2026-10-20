(function (global) {
  'use strict';
  if (global.CentralStudentUX?.version === '3') return;

  const SUBJECT_LABELS = {
    pt: 'Português', cf: 'Direito Constitucional', adm: 'Direito Administrativo',
    civil: 'Direito Civil', cpc: 'Direito Processual Civil', penal: 'Direito Penal',
    cpp: 'Direito Processual Penal', trab: 'Direito do Trabalho',
    ptra: 'Direito Processual do Trabalho', rlm: 'Raciocínio Lógico-Matemático',
  };
  const enhancers = new Map();
  const failures = new Map();
  let queued = false;
  let started = false;

  function byId(id) { return document.getElementById(id); }
  function setText(element, value) {
    const text = String(value ?? '');
    if (element && element.textContent !== text) element.textContent = text;
  }
  function localDate(offset = 0) {
    const date = new Date();
    date.setHours(12, 0, 0, 0);
    date.setDate(date.getDate() + offset);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  }
  function readJSON(key, fallback = null) {
    try {
      const value = JSON.parse(localStorage.getItem(key) || 'null');
      return value == null ? fallback : value;
    } catch (_) { return fallback; }
  }
  function writeJSON(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); return true; }
    catch (error) { report('storage', error); return false; }
  }
  function subjects() {
    try {
      const list = Array.isArray(SUBJECTS) ? SUBJECTS : [];
      const objective = global.CentralStudyObjectives;
      if (!objective?.hasActiveObjective?.()) return list;
      const allowed = new Set(objective.activeSubjectIds());
      return list.filter((subject) => allowed.has(subject.id));
    } catch (_) { return []; }
  }
  function subjectId(value) {
    const text = String(value || '').trim().toLocaleLowerCase('pt-BR');
    return Object.keys(SUBJECT_LABELS).find((id) => id === text || SUBJECT_LABELS[id].toLocaleLowerCase('pt-BR') === text) || '';
  }
  function subjectProgress(subject) {
    if (!subject || subject.id === 'rlm') return null;
    const values = global.CentralDisciplineLoader?.percentages(subject);
    const topics = Array.isArray(subject.topics) ? subject.topics : [];
    const normalized = Array.isArray(values) && values.length
      ? values.map((value) => Math.max(0, Math.min(100, Number(value) || 0)))
      : topics.map((topic) => {
        try { return localStorage.getItem(`central-v6:done:${topic.uid}`) === '1' ? 100 : 0; }
        catch (_) { return 0; }
      });
    if (!normalized.length) return null;
    const total = normalized.length;
    const done = normalized.filter((value) => value === 100).length;
    const startedIndex = normalized.findIndex((value) => value > 0 && value < 100);
    const nextIndex = startedIndex >= 0 ? startedIndex : normalized.findIndex((value) => value < 100);
    const percent = Math.round(normalized.reduce((sum, value) => sum + value, 0) / total);
    return {
      values, total, done, percent,
      current: nextIndex >= 0 ? nextIndex + 1 : total,
      status: percent === 100 ? 'done' : percent > 0 ? 'active' : 'new',
    };
  }
  function escapeHTML(value) {
    return String(value ?? '').replace(/[&<>"']/g, (char) => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[char]));
  }
  function report(name, error) {
    const message = String(error?.message || error || 'Falha inesperada');
    failures.set(name, message);
    console.warn(`[Central Student UX: ${name}]`, error);
    global.dispatchEvent(new CustomEvent('central:student-ux-error', { detail:{ name, message } }));
  }
  function clearFailure(name) { failures.delete(name); }
  function run() {
    queued = false;
    document.documentElement.classList.remove('student-experience-v2');
    document.documentElement.classList.add('student-experience-v3');
    for (const [name, enhance] of enhancers) {
      try { enhance(); clearFailure(name); } catch (error) { report(name, error); }
    }
  }
  function schedule() {
    if (queued) return;
    queued = true;
    requestAnimationFrame(run);
  }
  function register(name, enhance) {
    if (!name || typeof enhance !== 'function') return;
    enhancers.set(name, enhance);
    if (started) schedule();
  }
  function relevantMutation(mutation) {
    if (mutation.type === 'childList') return mutation.addedNodes.length > 0 || mutation.removedNodes.length > 0;
    const target = mutation.target;
    return target instanceof Element && target.matches('.view,.subject,.bc-native-reader-overlay,.cf-native-overlay,#studentMorePanel,[data-student-onboarding]');
  }
  function start() {
    if (started) return;
    started = true;
    setTimeout(run, 0);
    const observer = new MutationObserver((mutations) => {
      if (mutations.some(relevantMutation)) schedule();
    });
    observer.observe(document.body, {
      childList:true, subtree:true, attributes:true,
      attributeFilter:['class', 'hidden', 'aria-hidden'],
    });
    document.addEventListener('central:discipline-ready', schedule);
    document.addEventListener('central:student-data-changed', schedule);
    global.addEventListener('central-cloud-applied', schedule);
    global.addEventListener('storage', schedule);
    global.addEventListener('online', schedule);
    global.addEventListener('offline', schedule);
    [150, 600, 1400].forEach((delay) => setTimeout(schedule, delay));
  }

  global.CentralStudentUX = {
    version:'3', SUBJECT_LABELS, byId, setText, localDate, readJSON, writeJSON,
    subjects, subjectId, subjectProgress, escapeHTML, register, run, schedule,
    failures, report,
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, { once:true });
  else start();
})(window);
