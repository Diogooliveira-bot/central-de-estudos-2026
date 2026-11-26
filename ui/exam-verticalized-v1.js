/* Editais TJPB e TRT-8: instâncias isoladas por aluno e por concurso. */
(function (global) {
  'use strict';
  if (global.CentralExamVerticalized) return;
  const OBJECTIVES = global.CentralStudyObjectives;
  const MARKERS = [['studied','Estudei'],['reviewed','Revisei'],['questions','Fiz questões']];
  if (!OBJECTIVES) return;
  function createExam(DATA,GOAL_ID,dialogId,entryId) {
  if (!DATA) return null;
  const markers = DATA.singleCheck ? [['studied','Concluído']] : MARKERS;
  const isActive = () => OBJECTIVES.getActive() === GOAL_ID || (DATA.singleCheck && global.GmfStudyObjective?.current?.() === 'gmf-fortaleza');
  const visibleSubjects = () => DATA.subjects.filter(subject => !['trab','ptra'].includes(subject.disciplineId));
  const EXAM_ID = DATA.examId || 'tjp-2026-aj-area-judiciaria';
  const examQuery = '/api/objective?resource=exam-progress&examId=' + encodeURIComponent(EXAM_ID);

  const identity = () => String(global.__BASE_COMPLETA_USER_ID__ || 'local-student');
  const storageKey = () => 'central-v6:exam-progress:' + DATA.examId + ':' + identity();
  const pendingKey = () => storageKey() + ':pending';
  let state = {};
  let syncTimer = 0;
  let loaded = false;
  let syncing = false;
  let localVersion = 0;

  function parseSaved() {
    try { const raw = JSON.parse(localStorage.getItem(storageKey()) || '{}'); return raw && typeof raw === 'object' && !Array.isArray(raw) ? raw : {}; }
    catch (_) { return {}; }
  }
  function saveLocal() {
    localVersion++;
    localStorage.setItem(storageKey(), JSON.stringify(state));
    localStorage.setItem(pendingKey(), '1');
    scheduleSync();
  }
  function isGuest() { return global.__BASE_COMPLETA_PREVIEW_GUEST__ === true; }
  function merge(left, right) {
    const out = JSON.parse(JSON.stringify(left || {}));
    for (const [topicId, topicMarkers] of Object.entries(right || {})) {
      out[topicId] ||= {};
      for (const [marker, incoming] of Object.entries(topicMarkers || {})) {
        if (!markers.some(([key]) => key === marker) || !incoming || typeof incoming.value !== 'boolean') continue;
        const current = out[topicId][marker];
        if (!current || Date.parse(incoming.at || 0) >= Date.parse(current.at || 0)) {
          out[topicId][marker] = { value:incoming.value, at:incoming.at || new Date().toISOString() };
        }
      }
    }
    return out;
  }
  function changes() {
    return Object.entries(state).flatMap(([topicId, values]) => Object.entries(values || {}).filter(([marker, v]) => markers.some(([key]) => key === marker) && v && typeof v.value === 'boolean').map(([marker,v]) => ({topicId,marker,value:v.value,at:v.at})));
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
      const sentVersion = localVersion;
      const remoteState = remote.progress || {};
      const payload = changes().filter(c=>{const before=remoteState[c.topicId]?.[c.marker];return !before || (Date.parse(c.at)>Date.parse(before.at) && (c.value!==before.value || c.at!==before.at));});
      if (payload.length) {
        const saved = await fetch(examQuery, {method:'PUT',cache:'no-store',headers:{'Content-Type':'application/json'},body:JSON.stringify({changes:payload})});
        if (!saved.ok) throw new Error('Não foi possível sincronizar as marcações.');
      }
      if(sentVersion===localVersion){localStorage.removeItem(pendingKey());setSyncStatus('Progresso sincronizado na sua conta.');}
      else scheduleSync();
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
    const possible = topics.length * markers.length;
    const done = topics.reduce((sum,item) => sum + markers.reduce((n,[marker]) => n + (state[item.id]?.[marker]?.value === true ? 1 : 0),0),0);
    return possible ? Math.round(done * 1000 / possible) / 10 : 0;
  }
  function overall() {
    const topics = visibleSubjects().flatMap(subjectTopics);
    const possible = topics.length * markers.length;
    const done = topics.reduce((sum,item) => sum + markers.reduce((n,[marker]) => n + (state[item.id]?.[marker]?.value === true ? 1 : 0),0),0);
    return possible ? Math.round(done * 1000 / possible) / 10 : 0;
  }
  function esc(text) { return String(text).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }
  function topicMarkup(subject,item) {
    if (item.organizational) return '<div class="exam-topic-heading"><span>'+(item.number ? esc(item.number)+' ' : '')+esc(item.text)+'</span></div>';
    const coverage = DATA.singleCheck ? (item.moduleIds?.length ? 'Material relacionado · vínculo em auditoria' : 'Vínculo em preparação') : item.coverage === 'complete' ? 'Cobertura completa' : item.coverage === 'partial' ? 'Cobertura parcial' : 'Em preparação';
    const checks = markers.map(([marker,label]) => '<label class="exam-check"><input type="checkbox" data-exam-topic="'+esc(item.id)+'" data-exam-marker="'+marker+'"'+(state[item.id]?.[marker]?.value ? ' checked' : '')+'><span>'+label+'</span></label>').join('');
    const links = (item.moduleIds || []).map(id => '<button type="button" class="exam-module-link" data-exam-module="'+esc(id)+'" data-exam-discipline="'+esc(subject.disciplineId || '')+'">Abrir módulo</button>').join('');
    return '<article class="exam-topic" data-exam-topic-row="'+esc(item.id)+'"><div class="exam-topic-copy"><span class="exam-topic-number">'+esc(item.number || String(item.ordinal || ''))+'</span><span>'+esc(item.text)+'</span><small>'+coverage+'</small>'+links+'</div><div class="exam-checks">'+checks+'</div></article>';
  }
  function render() {
    const host = document.getElementById(dialogId);
    if (!host || host.hidden) return;
    const syncMessage = host.querySelector('[data-exam-sync-status]')?.textContent || '';
    const opened = new Set(Array.from(host.querySelectorAll('.exam-subject[open]'), node => node.dataset.examSubject));
    const subjectMarkup = visibleSubjects().map(subject => {
      const percent = progressFor(subject);
      return '<details class="exam-subject" data-exam-subject="'+esc(subject.id)+'"'+(opened.has(subject.id)?' open':'')+'><summary><span><b>'+esc(subject.title)+'</b><small>'+subjectTopics(subject).length+' assuntos · '+(DATA.singleCheck?'Vínculos em auditoria':subject.coverage==='complete'?'Cobertura completa':subject.coverage==='partial'?'Cobertura parcial':'Em preparação')+'</small></span><span class="exam-subject-progress"><b>'+percent+'%</b><i><em style="width:'+percent+'%"></em></i></span></summary><div class="exam-topic-list">'+subject.items.map(item=>topicMarkup(subject,item)).join('')+'</div></details>';
    }).join('');
    const headerLabel = DATA.headerLabel || (DATA.cargoCode === '01' && DATA.examId?.startsWith('trt8') ? 'EDITAL 01/2026 + RETIFICAÇÃO · TRT-8' : 'EDITAL 01/2026 · TJPB');
    host.innerHTML = '<section class="exam-verticalized-panel" role="dialog" aria-modal="true" aria-labelledby="examVerticalizedTitle"><header class="exam-screen-header"><button type="button" data-exam-close aria-label="Fechar edital">← Voltar</button><span>'+esc(headerLabel)+'</span><h1 id="examVerticalizedTitle">Edital Verticalizado</h1><p>'+esc(DATA.cargoLabel || 'Analista Judiciário · Área Judiciária')+'</p></header><section class="exam-overview"><div><span>Progresso do edital</span><b>'+overall()+'%</b></div><i><em style="width:'+overall()+'%"></em></i><small>'+(DATA.singleCheck?'Avanço pessoal por assunto, independente da cobertura dos materiais.':'Avanço pessoal nas marcações de estudo, revisão e questões.')+'</small></section><p class="exam-source">'+esc(DATA.source)+'</p>'+(DATA.sourceUrl?'<p class="exam-source"><a href="'+esc(DATA.sourceUrl)+'" target="_blank" rel="noopener noreferrer">Consultar edital oficial de referência</a></p>':'')+ (visibleSubjects().length !== DATA.subjects.length ? '<p class="exam-source">Visualização parcial: somente disciplinas mantidas na Central. Consulte o edital oficial para o programa integral.</p>' : '') +'<p class="exam-sync-status" data-exam-sync-status></p><div class="exam-subject-list">'+subjectMarkup+'</div></section>';
    host.querySelector('[data-exam-sync-status]').textContent = syncMessage;
    host.hidden = false;
    host.querySelector('[data-exam-close]').addEventListener('click', close);
    host.querySelectorAll('[data-exam-topic]').forEach(input => input.addEventListener('change', () => {
      state[input.dataset.examTopic] ||= {};
      state[input.dataset.examTopic][input.dataset.examMarker] = {value:input.checked,at:new Date().toISOString()};
      saveLocal(); render();
    }));
    host.querySelectorAll('[data-exam-module]').forEach(button => button.addEventListener('click', () => openModule(button.dataset.examDiscipline,button.dataset.examModule)));
  }
  function close() { const host=document.getElementById(dialogId); if(host)host.hidden=true; if(!document.querySelector('.exam-verticalized-backdrop:not([hidden])'))document.documentElement.classList.remove('exam-verticalized-open'); }
  function open() {
    if (!isActive()) return false;
    let host=document.getElementById(dialogId);
    if (!host) { host=document.createElement('div'); host.id=dialogId; host.className='exam-verticalized-backdrop'; document.body.appendChild(host); }
    host.hidden=false; document.documentElement.classList.add('exam-verticalized-open');
    if (!loaded) { state=parseSaved(); render(); if (!isGuest()) syncNow(); else {loaded=true; render();} }
    else render();
    return true;
  }
  async function openModule(disciplineId,moduleId) {
    // A Central usa expansores nativos (.open e estado persistido), não <details>.
    // CentralStudyNavigation já conhece os módulos de CF, ADM, Civil, CPC, Penal e CPP.
    const navigation = global.CentralStudyNavigation;
    if (!disciplineId || !moduleId || typeof navigation?.openContext !== 'function') {
      console.warn('[Edital verticalizado] Navegação para módulo indisponível', disciplineId, moduleId);
      return false;
    }
    close();
    if(DATA.singleCheck && typeof global.BaseCompletaFocusNavigation?.openByModuleId === 'function') {
      const opened = await global.BaseCompletaFocusNavigation.openByModuleId(disciplineId,moduleId);
      if(!opened){open();setSyncStatus('Não foi possível localizar este módulo. Tente novamente ou consulte a disciplina.');}
      return opened;
    }
    navigation.openContext({ subject:disciplineId, module:moduleId });
    return true;
  }
  function ensureEntry() {
    const current=OBJECTIVES.getActive();
    const grid=DATA.singleCheck ? (document.getElementById('gmfGoalGrid') || document.getElementById('disciplineGrid')) : document.getElementById('disciplineGrid');
    if (!grid || !isActive()) { document.getElementById(entryId)?.remove(); if (!isActive()) close(); return; }
    let button=document.getElementById(entryId);
    if (!button) { button=document.createElement('button'); button.id=entryId; button.type='button'; button.className='exam-verticalized-entry'; button.textContent=DATA.singleCheck?'Abrir edital verticalizado · GMF':'Abrir Edital Verticalizado'; button.addEventListener('click',open); }
    if (grid.previousElementSibling!==button) grid.before(button);
  }
  document.addEventListener('central:study-objective-changed',ensureEntry);
  document.addEventListener('central:discipline-ready',ensureEntry);
  if(DATA.singleCheck) global.setTimeout(ensureEntry,0);
  global.addEventListener('online',()=>{if(localStorage.getItem(pendingKey())==='1')syncNow();});
  document.addEventListener('click',event=>{if(event.target===document.getElementById(dialogId))close();});
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',ensureEntry,{once:true});else ensureEntry();
  return {open,close,data:DATA,progressFor,overall,getState:()=>JSON.parse(JSON.stringify(state))};
  }
  global.CentralExamVerticalized=createExam(global.TJPB2026Verticalized,'exam-tjpb-2026-analista-judiciaria','examVerticalizedDialog','examVerticalizedEntry');
  global.CentralGMFVerticalized=createExam({"examId":"gmf-2023-guarda-municipal","headerLabel":"EDITAL DE REFERÊNCIA 01/2023 · GMF","cargoLabel":"Guarda Municipal de Fortaleza","source":"Roteiro de preparação baseado no Anexo I (pp. 46–47) do edital de 27/03/2023. Referência histórica; não é novo edital. Vínculos iniciais por assunto, ainda em auditoria. Atualidades requer atualização no período da próxima prova.","sourceUrl":"https://fortaleza.ce.gov.br/images/0001/27_03_2023_GMF.pdf","singleCheck":true,"subjects":[{"id":"gmf-pt","disciplineId":"pt","title":"Língua Portuguesa","coverage":"partial","items":[{"id":"gmf23-pt-01","text":"Interpretação e compreensão de textos","number":"1","organizational":false,"moduleIds":["pt-24"],"coverage":"partial"},{"id":"gmf23-pt-02","text":"Organização textual e parágrafos","number":"2","organizational":false,"moduleIds":["pt-22","pt-23"],"coverage":"partial"},{"id":"gmf23-pt-03","text":"Coesão: referenciação, conectivos e sequenciação","number":"3","organizational":false,"moduleIds":["pt-07","pt-09","pt-22"],"coverage":"partial"},{"id":"gmf23-pt-04","text":"Sentido contextual","number":"4","organizational":false,"moduleIds":["pt-21"],"coverage":"partial"},{"id":"gmf23-pt-05","text":"Equivalência e transformação de estruturas","number":"5","organizational":false,"moduleIds":["pt-14","pt-21"],"coverage":"partial"},{"id":"gmf23-pt-06","text":"Coordenação e subordinação","number":"6","organizational":false,"moduleIds":["pt-14"],"coverage":"partial"},{"id":"gmf23-pt-07","text":"Tempos e modos verbais","number":"7","organizational":false,"moduleIds":["pt-08","pt-13"],"coverage":"partial"},{"id":"gmf23-pt-08","text":"Pontuação","number":"8","organizational":false,"moduleIds":["pt-16"],"coverage":"partial"},{"id":"gmf23-pt-09","text":"Estrutura e formação de palavras","number":"9","organizational":false,"moduleIds":["pt-04"],"coverage":"partial"},{"id":"gmf23-pt-10","text":"Classes de palavras e suas funções","number":"10","organizational":false,"moduleIds":["pt-05","pt-06","pt-07","pt-08","pt-09"],"coverage":"partial"},{"id":"gmf23-pt-11","text":"Flexões nominais e verbais","number":"11","organizational":false,"moduleIds":["pt-05","pt-06","pt-08","pt-13"],"coverage":"partial"},{"id":"gmf23-pt-12","text":"Pronomes, tratamento e colocação","number":"12","organizational":false,"moduleIds":["pt-07","pt-15"],"coverage":"partial"},{"id":"gmf23-pt-13","text":"Concordância nominal","number":"13","organizational":false,"moduleIds":["pt-18"],"coverage":"partial"},{"id":"gmf23-pt-14","text":"Concordância verbal","number":"14","organizational":false,"moduleIds":["pt-17"],"coverage":"partial"},{"id":"gmf23-pt-15","text":"Regência nominal e verbal","number":"15","organizational":false,"moduleIds":["pt-19"],"coverage":"partial"},{"id":"gmf23-pt-16","text":"Ortografia","number":"16","organizational":false,"moduleIds":["pt-04"],"coverage":"partial"},{"id":"gmf23-pt-17","text":"Acentuação","number":"17","organizational":false,"moduleIds":["pt-03"],"coverage":"partial"}]},{"id":"gmf-rlm","disciplineId":"rlm","title":"Raciocínio Lógico","coverage":"partial","items":[{"id":"gmf23-rlm-01","text":"Relações lógicas e dedução","number":"1","organizational":false,"moduleIds":["M02","M04","M06"],"coverage":"partial"},{"id":"gmf23-rlm-02","text":"Raciocínio verbal e formação de conceitos","number":"2","organizational":false,"moduleIds":["M07"],"coverage":"partial"},{"id":"gmf23-rlm-03","text":"Raciocínio matemático","number":"3","organizational":false,"moduleIds":["M10","M11","M12"],"coverage":"partial"},{"id":"gmf23-rlm-04","text":"Sequências e padrões","number":"4","organizational":false,"moduleIds":["M08"],"coverage":"partial"},{"id":"gmf23-rlm-05","text":"Orientação espacial e temporal","number":"5","organizational":false,"moduleIds":["M09"],"coverage":"partial"},{"id":"gmf23-rlm-06","text":"Discriminação de elementos","number":"6","organizational":false,"moduleIds":["M06"],"coverage":"partial"},{"id":"gmf23-rlm-07","text":"Operações com conjuntos","number":"7","organizational":false,"moduleIds":["M05"],"coverage":"partial"},{"id":"gmf23-rlm-08","text":"Problemas aritméticos","number":"8","organizational":false,"moduleIds":["M10","M11","M12"],"coverage":"partial"},{"id":"gmf23-rlm-09","text":"Problemas geométricos e matriciais (material relacionado: matrizes; geometria a conferir)","number":"9","organizational":false,"moduleIds":["M08"],"coverage":"partial"}]},{"id":"gmf-info","disciplineId":"info","title":"Noções de Informática","coverage":"partial","items":[{"id":"gmf23-info-01","text":"Hardware, armazenamento, memória e periféricos","number":"1","organizational":false,"moduleIds":["info-m01"],"coverage":"partial"},{"id":"gmf23-info-02","text":"Windows: arquivos, pastas, atalhos e aplicativos","number":"2","organizational":false,"moduleIds":["info-m02"],"coverage":"partial"},{"id":"gmf23-info-03","text":"Linux: arquivos, pastas, atalhos e aplicativos","number":"3","organizational":false,"moduleIds":["info-m03"],"coverage":"partial"},{"id":"gmf23-info-04","text":"Writer (LibreOffice/Apache OpenOffice)","number":"4","organizational":false,"moduleIds":["info-m08"],"coverage":"partial"},{"id":"gmf23-info-05","text":"Calc (LibreOffice/Apache OpenOffice)","number":"5","organizational":false,"moduleIds":["info-m08"],"coverage":"partial"},{"id":"gmf23-info-06","text":"E-mail, Thunderbird e webmail","number":"6","organizational":false,"moduleIds":["info-m11"],"coverage":"partial"},{"id":"gmf23-info-07","text":"Comunicação e reuniões virtuais","number":"7","organizational":false,"moduleIds":["info-m08"],"coverage":"partial"},{"id":"gmf23-info-08","text":"Internet, intranet, extranet, protocolos, pesquisa e nuvem","number":"8","organizational":false,"moduleIds":["info-m09","info-m10","info-m11"],"coverage":"partial"},{"id":"gmf23-info-09","text":"Firefox, Chrome, redes sociais e navegação","number":"9","organizational":false,"moduleIds":["info-m09"],"coverage":"partial"},{"id":"gmf23-info-10","text":"Segurança, assinatura digital, backup, malware e ataques","number":"10","organizational":false,"moduleIds":["info-m12"],"coverage":"partial"},{"id":"gmf23-info-11","text":"Extensões de arquivos","number":"11","organizational":false,"moduleIds":["info-m01","info-m02"],"coverage":"partial"}]},{"id":"gmf-atual","disciplineId":"atual","title":"Atualidades","coverage":"partial","items":[{"id":"gmf23-atual-01","text":"Fatos políticos e administrativos nacionais","number":"1","organizational":false,"moduleIds":["gmf-atual-m01"],"coverage":"partial"},{"id":"gmf23-atual-02","text":"Economia e finanças","number":"2","organizational":false,"moduleIds":["gmf-atual-m02"],"coverage":"partial"},{"id":"gmf23-atual-03","text":"Temas sociais","number":"3","organizational":false,"moduleIds":["gmf-atual-m03"],"coverage":"partial"},{"id":"gmf23-atual-04","text":"Cultura e artes","number":"4","organizational":false,"moduleIds":["gmf-atual-m04"],"coverage":"partial"},{"id":"gmf23-atual-05","text":"Ciência e acontecimentos jurídicos","number":"5","organizational":false,"moduleIds":["gmf-atual-m05"],"coverage":"partial"},{"id":"gmf23-atual-06","text":"Revisão de notícias dos seis meses anteriores à prova","number":"6","organizational":false,"moduleIds":["gmf-atual-m06"],"coverage":"partial"}]},{"id":"gmf-fortaleza","disciplineId":"fortaleza","title":"Conhecimentos sobre Fortaleza","coverage":"partial","items":[{"id":"gmf23-fortaleza-01","text":"Localização e limites","number":"1","organizational":false,"moduleIds":["gmf-fortaleza-m01"],"coverage":"partial"},{"id":"gmf23-fortaleza-02","text":"Hidrografia","number":"2","organizational":false,"moduleIds":["gmf-fortaleza-m02"],"coverage":"partial"},{"id":"gmf23-fortaleza-03","text":"População","number":"3","organizational":false,"moduleIds":["gmf-fortaleza-m03"],"coverage":"partial"},{"id":"gmf23-fortaleza-04","text":"Aspectos políticos e administrativos","number":"4","organizational":false,"moduleIds":["gmf-fortaleza-m04"],"coverage":"partial"},{"id":"gmf23-fortaleza-05","text":"Economia e cultura","number":"5","organizational":false,"moduleIds":["gmf-fortaleza-m05"],"coverage":"partial"},{"id":"gmf23-fortaleza-06","text":"Pontos turísticos","number":"6","organizational":false,"moduleIds":["gmf-fortaleza-m06"],"coverage":"partial"},{"id":"gmf23-fortaleza-07","text":"Patrimônio cultural","number":"7","organizational":false,"moduleIds":["gmf-fortaleza-m07"],"coverage":"partial"},{"id":"gmf23-fortaleza-08","text":"Clima e vegetação","number":"8","organizational":false,"moduleIds":["gmf-fortaleza-m08"],"coverage":"partial"},{"id":"gmf23-fortaleza-09","text":"Ocupação geográfica","number":"9","organizational":false,"moduleIds":["gmf-fortaleza-m08"],"coverage":"partial"},{"id":"gmf23-fortaleza-10","text":"História da cidade","number":"10","organizational":false,"moduleIds":["gmf-fortaleza-m09"],"coverage":"partial"}]},{"id":"gmf-adm","disciplineId":"adm","title":"Noções de Direito Administrativo","coverage":"partial","items":[{"id":"gmf23-adm-01","text":"Estado, governo e administração: elementos, poderes, natureza, fins e princípios","number":"1","organizational":false,"moduleIds":["adm-01-01-regime-juridico-e-principios","adm-02-02-organizacao-administrativa"],"coverage":"partial"},{"id":"gmf23-adm-02","text":"Conceito, fontes e princípios administrativos","number":"2","organizational":false,"moduleIds":["adm-01-01-regime-juridico-e-principios"],"coverage":"partial"},{"id":"gmf23-adm-03","text":"Atos: conceito, requisitos, atributos, classificação e espécies","number":"3","organizational":false,"moduleIds":["adm-03-03-atos-administrativos"],"coverage":"partial"},{"id":"gmf23-adm-04","text":"Invalidação, anulação e revogação","number":"4","organizational":false,"moduleIds":["adm-03-03-atos-administrativos"],"coverage":"partial"},{"id":"gmf23-adm-05","text":"Prescrição administrativa","number":"5","organizational":false,"moduleIds":["adm-03-03-atos-administrativos"],"coverage":"partial"}]},{"id":"gmf-cf","disciplineId":"cf","title":"Noções de Direito Constitucional","coverage":"partial","items":[{"id":"gmf23-cf-01","text":"Princípios fundamentais (CF, arts. 1–4)","number":"1","organizational":false,"moduleIds":["w1"],"coverage":"partial"},{"id":"gmf23-cf-02","text":"Direitos e garantias fundamentais (CF, arts. 5–11)","number":"2","organizational":false,"moduleIds":["w2","w3"],"coverage":"partial"},{"id":"gmf23-cf-03","text":"Direitos políticos (CF, arts. 14–16)","number":"3","organizational":false,"moduleIds":["w3"],"coverage":"partial"},{"id":"gmf23-cf-04","text":"Organização do Estado (CF, arts. 18–31)","number":"4","organizational":false,"moduleIds":["w4"],"coverage":"partial"},{"id":"gmf23-cf-05","text":"Administração pública (CF, arts. 37–41)","number":"5","organizational":false,"moduleIds":["w5"],"coverage":"partial"},{"id":"gmf23-cf-06","text":"Segurança pública (CF, art. 144)","number":"6","organizational":false,"moduleIds":[],"coverage":"preparation"},{"id":"gmf23-cf-07","text":"Política urbana (CF, arts. 182–183)","number":"7","organizational":false,"moduleIds":[],"coverage":"preparation"},{"id":"gmf23-cf-08","text":"Família, criança, adolescente, jovem e idoso (CF, arts. 226–230)","number":"8","organizational":false,"moduleIds":["w15"],"coverage":"partial"}]},{"id":"gmf-dh","disciplineId":"dh","title":"Direitos Humanos","coverage":"partial","items":[{"id":"gmf23-dh-01","text":"Conceito","number":"1","organizational":false,"moduleIds":["gmf-dh-m01"],"coverage":"partial"},{"id":"gmf23-dh-02","text":"Características","number":"2","organizational":false,"moduleIds":["gmf-dh-m02"],"coverage":"partial"},{"id":"gmf23-dh-03","text":"Categorias","number":"3","organizational":false,"moduleIds":["gmf-dh-m03"],"coverage":"partial"},{"id":"gmf23-dh-04","text":"Gerações ou dimensões","number":"4","organizational":false,"moduleIds":["gmf-dh-m04"],"coverage":"partial"}]},{"id":"gmf-penal","disciplineId":"penal","title":"Noções de Direito Penal","coverage":"partial","items":[{"id":"gmf23-penal-01","text":"Teoria do crime (CP, arts. 13–25)","number":"1","organizational":false,"moduleIds":["p3","p4","p5"],"coverage":"partial"},{"id":"gmf23-penal-02","text":"Crimes contra a pessoa (faixa conjunta dos arts. 121–183 do CP)","number":"2","organizational":false,"moduleIds":["p9"],"coverage":"partial"},{"id":"gmf23-penal-03","text":"Crimes contra o patrimônio (faixa conjunta dos arts. 121–183 do CP)","number":"3","organizational":false,"moduleIds":["p10"],"coverage":"partial"},{"id":"gmf23-penal-04","text":"Crimes contra a dignidade sexual (CP, arts. 213–218-C)","number":"4","organizational":false,"moduleIds":["p12"],"coverage":"partial"},{"id":"gmf23-penal-05","text":"Crimes contra a fé pública (CP, arts. 212–311, conforme referência do edital)","number":"5","organizational":false,"moduleIds":["p11"],"coverage":"partial"},{"id":"gmf23-penal-06","text":"Crimes contra a administração pública (CP, arts. 312–337-A)","number":"6","organizational":false,"moduleIds":["p13"],"coverage":"partial"}]},{"id":"gmf-cpp","disciplineId":"cpp","title":"Noções de Direito Processual Penal","coverage":"partial","items":[{"id":"gmf23-cpp-01","text":"Inquérito policial (CPP, arts. 4–23)","number":"1","organizational":false,"moduleIds":["cpp-m03"],"coverage":"partial"},{"id":"gmf23-cpp-02","text":"Provas: disposições gerais (CPP, arts. 155–157)","number":"2","organizational":false,"moduleIds":["cpp-m12"],"coverage":"partial"},{"id":"gmf23-cpp-03","text":"Corpo de delito, cadeia de custódia e perícias (CPP, arts. 158–184)","number":"3","organizational":false,"moduleIds":["cpp-m12"],"coverage":"partial"},{"id":"gmf23-cpp-04","text":"Busca e apreensão (CPP, arts. 240–250)","number":"4","organizational":false,"moduleIds":["cpp-m12"],"coverage":"partial"},{"id":"gmf23-cpp-05","text":"Prisão, cautelares, liberdade provisória e flagrante (CPP, arts. 282–310)","number":"5","organizational":false,"moduleIds":["cpp-m13","cpp-m14"],"coverage":"partial"}]},{"id":"gmf-legesp","disciplineId":"legesp","title":"Legislação Extravagante","coverage":"partial","items":[{"id":"gmf23-legesp-01","text":"Estatuto Geral das Guardas Municipais — Lei 13.022/2014","number":"1","organizational":false,"moduleIds":["gmf-legesp-m01"],"coverage":"partial"},{"id":"gmf23-legesp-02","text":"Lei de Drogas — Lei 11.343/2006","number":"2","organizational":false,"moduleIds":["gmf-legesp-m02"],"coverage":"partial"},{"id":"gmf23-legesp-03","text":"Crimes de preconceito — Lei 7.716/1989","number":"3","organizational":false,"moduleIds":["gmf-legesp-m03"],"coverage":"partial"},{"id":"gmf23-legesp-04","text":"ECA — Lei 8.069/1990","number":"4","organizational":false,"moduleIds":["gmf-legesp-m04"],"coverage":"partial"},{"id":"gmf23-legesp-05","text":"Crimes ambientais — Lei 9.605/1998","number":"5","organizational":false,"moduleIds":["gmf-legesp-m05"],"coverage":"partial"},{"id":"gmf23-legesp-06","text":"CTB — Lei 9.503/1997","number":"6","organizational":false,"moduleIds":["gmf-legesp-m06"],"coverage":"partial"},{"id":"gmf23-legesp-07","text":"Estatuto do Desarmamento — Lei 10.826/2003","number":"7","organizational":false,"moduleIds":["gmf-legesp-m07"],"coverage":"partial"},{"id":"gmf23-legesp-08","text":"Lei Maria da Penha — Lei 11.340/2006","number":"8","organizational":false,"moduleIds":["gmf-legesp-m08"],"coverage":"partial"},{"id":"gmf23-legesp-09","text":"Abuso de autoridade — Lei 13.869/2019","number":"9","organizational":false,"moduleIds":["gmf-legesp-m09"],"coverage":"partial"},{"id":"gmf23-legesp-10","text":"Lei Orgânica de Fortaleza, arts. 1–9 e 98–123","number":"10","organizational":false,"moduleIds":["gmf-legesp-m10"],"coverage":"partial"},{"id":"gmf23-legesp-11","text":"Estatuto dos Servidores de Fortaleza — Lei 6.794/1990","number":"11","organizational":false,"moduleIds":["gmf-legesp-m11"],"coverage":"partial"}]}]},'exam-catalog-gmf-fortaleza-monitoramento-cargo-1','gmfVerticalizedDialog','gmfVerticalizedEntry');
  global.CentralTRT8Verticalized=createExam(global.TRT82026Verticalized,'exam-trt8-2026-analista-judiciaria','trt8VerticalizedDialog','trt8VerticalizedEntry');
})(window);

