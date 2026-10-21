/* Editais TJPB e TRT-8: instâncias isoladas por aluno, concurso e cargo. */
(function (global) {
  'use strict';
  if (global.CentralExamVerticalized) return;
  const OBJECTIVES = global.CentralStudyObjectives;
  const MARKERS = [['studied','Estudei'],['reviewed','Revisei'],['questions','Fiz questões']];
  if (!OBJECTIVES) return;
  function createExam(DATA,GOAL_ID,dialogId,entryId) {
  if (!DATA) return null;
  const EXAM_ID = DATA.examId || 'tjp-2026-aj-area-judiciaria';
  const examQuery = '/api/objective?resource=exam-progress&examId=' + encodeURIComponent(EXAM_ID);

  const identity = () => String(global.__BASE_COMPLETA_USER_ID__ || 'local-student');
  const storageKey = () => 'central-v6:exam-progress:' + DATA.examId + ':' + identity();
  const pendingKey = () => storageKey() + ':pending';
  let state = {};
  let syncTimer = 0;
  let loaded = false;
  let syncing = false;

  function parseSaved() {
    try { const raw = JSON.parse(localStorage.getItem(storageKey()) || '{}'); return raw && typeof raw === 'object' && !Array.isArray(raw) ? raw : {}; }
    catch (_) { return {}; }
  }
  function saveLocal() {
    localStorage.setItem(storageKey(), JSON.stringify(state));
    localStorage.setItem(pendingKey(), '1');
    scheduleSync();
  }
  function isGuest() { return global.__BASE_COMPLETA_PREVIEW_GUEST__ === true; }
  function merge(left, right) {
    const out = JSON.parse(JSON.stringify(left || {}));
    for (const [topicId, markers] of Object.entries(right || {})) {
      out[topicId] ||= {};
      for (const [marker, incoming] of Object.entries(markers || {})) {
        if (!MARKERS.some(([key]) => key === marker) || !incoming || typeof incoming.value !== 'boolean') continue;
        const current = out[topicId][marker];
        if (!current || Date.parse(incoming.at || 0) >= Date.parse(current.at || 0)) {
          out[topicId][marker] = { value:incoming.value, at:incoming.at || new Date().toISOString() };
        }
      }
    }
    return out;
  }
  function changes() {
    return Object.entries(state).flatMap(([topicId, values]) => Object.entries(values || {}).filter(([marker, v]) => MARKERS.some(([key]) => key === marker) && v && typeof v.value === 'boolean').map(([marker,v]) => ({topicId,marker,value:v.value,at:v.at})));
  }
  async function syncNow() {
    if (syncing || isGuest() || !navigator.onLine) return false;
    syncing = true;
    try {
      const response = await fetch(examQuery, {cache:'no-store'});
      if (!response.ok) throw new Error('Não foi possível carregar o progresso do edital.');
      const remote = await response.json();
      const local = parseSaved();
      state = merge(remote.progress, local);
      localStorage.setItem(storageKey(), JSON.stringify(state));
      const payload = changes();
      if (payload.length) {
        const saved = await fetch(examQuery, {method:'PUT',cache:'no-store',headers:{'Content-Type':'application/json'},body:JSON.stringify({changes:payload})});
        if (!saved.ok) throw new Error('Não foi possível sincronizar as marcações.');
      }
      localStorage.removeItem(pendingKey());
      setSyncStatus('Progresso sincronizado na sua conta.');
      loaded = true;
      render();
      return true;
    } catch (_) {
      localStorage.setItem(pendingKey(), '1');
      setSyncStatus('Salvo neste aparelho. A sincronização será retomada quando houver conexão.');
      return false;
    } finally { syncing = false; }
  }
  function scheduleSync() {
    setSyncStatus(navigator.onLine ? 'Salvo neste aparelho; sincronizando…' : 'Salvo neste aparelho. Sincronizará quando houver conexão.');
    if (isGuest() || !navigator.onLine) return;
    global.clearTimeout(syncTimer);
    syncTimer = global.setTimeout(syncNow, 350);
  }
  function setSyncStatus(text) {
    const node = document.getElementById(dialogId)?.querySelector('[data-exam-sync-status]');
    if (node) node.textContent = isGuest() ? 'Prévia: marcações armazenadas apenas neste navegador.' : text;
  }
  const subjectTopics = subject => subject.items.filter(item => !item.organizational);
  function progressFor(subject) {
    const topics = subjectTopics(subject);
    const possible = topics.length * MARKERS.length;
    const done = topics.reduce((sum,item) => sum + MARKERS.reduce((n,[marker]) => n + (state[item.id]?.[marker]?.value === true ? 1 : 0),0),0);
    return possible ? Math.round(done * 1000 / possible) / 10 : 0;
  }
  function overall() {
    const topics = DATA.subjects.flatMap(subjectTopics);
    const possible = topics.length * MARKERS.length;
    const done = topics.reduce((sum,item) => sum + MARKERS.reduce((n,[marker]) => n + (state[item.id]?.[marker]?.value === true ? 1 : 0),0),0);
    return possible ? Math.round(done * 1000 / possible) / 10 : 0;
  }
  function esc(text) { return String(text).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }
  function topicMarkup(subject,item) {
    if (item.organizational) return '<div class="exam-topic-heading"><span>'+(item.number ? esc(item.number)+' ' : '')+esc(item.text)+'</span></div>';
    const coverage = item.coverage === 'complete' ? 'Cobertura completa' : item.coverage === 'partial' ? 'Cobertura parcial' : 'Em preparação';
    const checks = MARKERS.map(([marker,label]) => '<label class="exam-check"><input type="checkbox" data-exam-topic="'+esc(item.id)+'" data-exam-marker="'+marker+'"'+(state[item.id]?.[marker]?.value ? ' checked' : '')+'><span>'+label+'</span></label>').join('');
    const links = (item.moduleIds || []).map(id => '<button type="button" class="exam-module-link" data-exam-module="'+esc(id)+'" data-exam-discipline="'+esc(subject.disciplineId || '')+'">Abrir módulo</button>').join('');
    const warnings = (item.moduleEvidence || []).filter(e => e && e.warning).map(e => e.warning).concat(item.uncoveredSubtopics || []);
    const disclaimer = warnings.length ? '<details class="exam-topic-audit-note"><summary>ATUALIZAÇÃO JURÍDICA / CONTEÚDO PENDENTE</summary><p>'+warnings.map(esc).join(' ')+'</p></details>' : '';
    return '<article class="exam-topic" data-exam-topic-row="'+esc(item.id)+'"><div class="exam-topic-copy"><span class="exam-topic-number">'+esc(item.number || String(item.ordinal || ''))+'</span><span>'+esc(item.text)+'</span><small>'+coverage+'</small>'+disclaimer+links+'</div><div class="exam-checks">'+checks+'</div></article>';
  }
  function render() {
    const host = document.getElementById(dialogId);
    if (!host || host.hidden) return;
    const opened = new Set(Array.from(host.querySelectorAll('.exam-subject[open]'), node => node.dataset.examSubject));
    const subjectMarkup = DATA.subjects.map(subject => {
      const percent = progressFor(subject);
      return '<details class="exam-subject" data-exam-subject="'+esc(subject.id)+'"'+(opened.has(subject.id)?' open':'')+'><summary><span><b>'+esc(subject.title)+'</b><small>'+subjectTopics(subject).length+' assuntos · '+(subject.coverage==='complete'?'Cobertura completa':subject.coverage==='partial'?'Cobertura parcial':'Em preparação')+'</small></span><span class="exam-subject-progress"><b>'+percent+'%</b><i><em style="width:'+percent+'%"></em></i></span></summary><div class="exam-topic-list">'+subject.items.map(item=>topicMarkup(subject,item)).join('')+'</div></details>';
    }).join('');
    const headerLabel = DATA.examId?.startsWith('trt8') ? 'EDITAL 01/2026 + RETIFICAÇÃO · TRT-8 · CARGO ' + esc(DATA.cargoCode || '') : 'EDITAL 01/2026 · TJPB';
    const cargoLabel = DATA.cargoCode === '21' ? 'Técnico Judiciário · Área Administrativa' : 'Analista Judiciário · Área Judiciária';
    host.innerHTML = '<section class="exam-verticalized-panel" role="dialog" aria-modal="true" aria-labelledby="examVerticalizedTitle"><header class="exam-screen-header"><button type="button" data-exam-close aria-label="Fechar edital">← Voltar</button><span>'+esc(headerLabel)+'</span><h1 id="examVerticalizedTitle">Edital Verticalizado</h1><p>'+esc(cargoLabel)+'</p></header><section class="exam-overview"><div><span>Progresso do edital</span><b>'+overall()+'%</b></div><i><em style="width:'+overall()+'%"></em></i><small>Avanço pessoal nas marcações de estudo, revisão e questões.</small></section><p class="exam-source">'+esc(DATA.source)+'</p><p class="exam-sync-status" data-exam-sync-status></p><div class="exam-subject-list">'+subjectMarkup+'</div></section>';
    host.hidden = false;
    host.querySelector('[data-exam-close]').addEventListener('click', close);
    host.querySelectorAll('[data-exam-topic]').forEach(input => input.addEventListener('change', () => {
      state[input.dataset.examTopic] ||= {};
      state[input.dataset.examTopic][input.dataset.examMarker] = {value:input.checked,at:new Date().toISOString()};
      saveLocal(); render();
    }));
    host.querySelectorAll('[data-exam-module]').forEach(button => button.addEventListener('click', () => openModule(button.dataset.examDiscipline,button.dataset.examModule)));
  }
  function close() { const host=document.getElementById(dialogId); if(host)host.hidden=true; document.documentElement.classList.remove('exam-verticalized-open'); }
  function open() {
    if (OBJECTIVES.getActive() !== GOAL_ID) return false;
    let host=document.getElementById(dialogId);
    if (!host) { host=document.createElement('div'); host.id=dialogId; host.className='exam-verticalized-backdrop'; document.body.appendChild(host); }
    host.hidden=false; document.documentElement.classList.add('exam-verticalized-open');
    if (!loaded) { state=parseSaved(); render(); if (!isGuest()) syncNow(); else {loaded=true; render();} }
    else render();
    return true;
  }
  function openModule(disciplineId,moduleId) {
    // A Central usa expansores nativos (.open e estado persistido), não <details>.
    // CentralStudyNavigation já conhece os módulos de CF, ADM, Civil, CPC, Penal e CPP.
    const navigation = global.CentralStudyNavigation;
    if (!disciplineId || !moduleId || typeof navigation?.openContext !== 'function') {
      console.warn('[Edital verticalizado] Navegação para módulo indisponível', disciplineId, moduleId);
      return false;
    }
    close();
    navigation.openContext({ subject:disciplineId, module:moduleId });
    return true;
  }
  function ensureEntry() {
    const current=OBJECTIVES.getActive();
    const grid=document.getElementById('disciplineGrid');
    if (!grid || current!==GOAL_ID) { document.getElementById(entryId)?.remove(); if (current!==GOAL_ID) close(); return; }
    let button=document.getElementById(entryId);
    if (!button) { button=document.createElement('button'); button.id=entryId; button.type='button'; button.className='exam-verticalized-entry'; button.textContent='Abrir Edital Verticalizado'; button.addEventListener('click',open); }
    if (grid.previousElementSibling!==button) grid.before(button);
  }
  document.addEventListener('central:study-objective-changed',ensureEntry);
  document.addEventListener('central:discipline-ready',ensureEntry);
  global.addEventListener('online',()=>{if(localStorage.getItem(pendingKey())==='1')syncNow();});
  document.addEventListener('click',event=>{if(event.target===document.getElementById(dialogId))close();});
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',ensureEntry,{once:true});else ensureEntry();
  return {open,close,data:DATA,progressFor,overall,getState:()=>JSON.parse(JSON.stringify(state))};
  }
  global.CentralExamVerticalized=createExam(global.TJPB2026Verticalized,'exam-tjpb-2026-analista-judiciaria','examVerticalizedDialog','examVerticalizedEntry');
  global.CentralTRT8Verticalized=createExam(global.TRT82026Verticalized,'exam-trt8-2026-analista-judiciaria','trt8VerticalizedDialog','trt8VerticalizedEntry');
  global.CentralTRT8TecnicoVerticalized=createExam(global.TRT82026TecnicoVerticalized,'exam-trt8-2026-tecnico-administrativa','trt8TecnicoVerticalizedDialog','trt8TecnicoVerticalizedEntry');
})(window);
