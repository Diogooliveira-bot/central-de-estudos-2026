(function (global) {
  'use strict';

  if (global.ExternalQuestionFilters) return;

  const STORE_KEY = 'central-v6:external-filter-sessions:v1';
  const LEGACY_TEC_KEY = 'central-v6:tec:registros';
  const PLATFORM_LABEL = { qc: 'QConcursos', tec: 'TEC Concursos' };
  const DISCIPLINES = {
    administrativo: 'Direito Administrativo',
    constitucional: 'Direito Constitucional',
    civil: 'Direito Civil',
    empresarial: 'Direito Empresarial',
    'processual-civil': 'Direito Processual Civil',
    penal: 'Direito Penal',
    'processual-penal': 'Direito Processual Penal',
    trabalho: 'Direito do Trabalho',
    'processual-trabalho': 'Direito Processual do Trabalho',
    rlm: 'Raciocínio Lógico-Matemático',
    matematica: 'Matemática'
  };
  const SUBJECT_DISCIPLINE = {
    adm: 'administrativo', cf: 'constitucional', civil: 'civil', cpc: 'processual-civil',
    penal: 'penal', cpp: 'processual-penal', trab: 'trabalho', ptra: 'processual-trabalho',
    rlm: 'rlm', mat: 'matematica'
  };

  let registry = [];
  let registrySignature = '';
  let selectedKey = '';
  let modalFilter = null;
  let modalSession = null;
  let modalReturnFocus = null;
  let scheduled = false;

  const esc = (value) => String(value ?? '').replace(/[&<>"']/g, (character) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  })[character]);
  const attr = esc;
  const pad = (value) => String(Math.max(0, Number(value) || 0)).padStart(2, '0');
  const moduleCode = (value) => {
    const match = String(value || '').toUpperCase().match(/M?0*(\d{1,2})/);
    return match ? 'M' + pad(match[1]) : '';
  };
  const baseModule = (value) => String(value || '').toUpperCase().match(/^M\d{2}/)?.[0] || moduleCode(value);
  const safeUrl = (value, platform) => {
    try {
      const url = new URL(String(value || ''), location.href);
      const allowed = platform === 'qc' ? /(^|\.)qconcursos\.com$/ : /(^|\.)tecconcursos\.com\.br$/;
      return url.protocol === 'https:' && allowed.test(url.hostname) ? url.href : '';
    } catch (_) { return ''; }
  };
  const notebookIdFromUrl = (value) => {
    try {
      const url = new URL(String(value || ''), location.href);
      const queryId = url.searchParams.get('notebook_ids[]');
      if (queryId) return queryId;
      const match = url.pathname.match(/\/(?:cadernos|s)\/([^/]+)/);
      return match ? match[1] : '';
    } catch (_) { return ''; }
  };
  const today = () => {
    const date = new Date();
    const offset = date.getTimezoneOffset() * 60000;
    return new Date(date.getTime() - offset).toISOString().slice(0, 10);
  };
  const sessionId = () => global.crypto?.randomUUID?.() || ('sess-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 10));
  const percent = (answered, correct) => answered > 0 ? Math.round((correct / answered) * 100) : null;
  const fmtDate = (value) => {
    const match = String(value || '').match(/^(\d{4})-(\d{2})-(\d{2})$/);
    return match ? `${match[3]}/${match[2]}/${match[1]}` : String(value || '—');
  };
  const validDate = (value) => {
    const match = String(value || '').match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (!match) return false;
    const date = new Date(Date.UTC(Number(match[1]), Number(match[2]) - 1, Number(match[3])));
    return date.getUTCFullYear() === Number(match[1]) && date.getUTCMonth() === Number(match[2]) - 1 && date.getUTCDate() === Number(match[3]);
  };

  function readStore() {
    try {
      const data = JSON.parse(localStorage.getItem(STORE_KEY) || 'null');
      if (data && data.version === 1 && data.filters && typeof data.filters === 'object') return data;
    } catch (_) { /* start with a clean compatible envelope */ }
    return { version: 1, filters: {} };
  }
  function writeStore(data) {
    localStorage.setItem(STORE_KEY, JSON.stringify(data));
    notifyChange();
  }
  function readLegacyTec() {
    try {
      const data = JSON.parse(localStorage.getItem(LEGACY_TEC_KEY) || '[]');
      return Array.isArray(data) ? data : [];
    } catch (_) { return []; }
  }
  function ensureLegacyTecIds() {
    const rows = readLegacyTec();
    let changed = false;
    rows.forEach((row) => {
      if (!row || row._bcSessionId) return;
      row._bcSessionId = sessionId();
      changed = true;
    });
    if (changed) localStorage.setItem(LEGACY_TEC_KEY, JSON.stringify(rows));
  }
  function notifyChange() {
    try { global.dispatchEvent(new CustomEvent('central:external-filter-history-changed')); } catch (_) { /* no-op */ }
  }

  function makeFilter(input) {
    const platform = input.platform === 'qc' ? 'qc' : 'tec';
    const url = safeUrl(input.url, platform);
    const id = String(input.id || notebookIdFromUrl(url) || input.legacyCid || '').trim();
    const module = baseModule(input.module);
    if (!url || !id || !module || !input.disciplineKey) return null;
    return {
      platform,
      platformLabel: PLATFORM_LABEL[platform],
      stableKey: `${platform}:${id}`,
      disciplineKey: input.disciplineKey,
      discipline: input.discipline || DISCIPLINES[input.disciplineKey] || input.disciplineKey,
      module,
      code: String(input.code || module).toUpperCase(),
      title: String(input.title || input.code || id).trim(),
      id,
      count: Math.max(0, Number(input.count) || 0),
      url,
      legacyCid: input.legacyCid ? String(input.legacyCid) : '',
      source: input.source || ''
    };
  }

  function pushFilter(list, seen, input) {
    const filter = makeFilter(input);
    if (!filter) return;
    const placement = `${filter.disciplineKey}|${filter.module}|${filter.stableKey}`;
    if (seen.has(placement)) return;
    seen.add(placement);
    list.push(filter);
  }

  function collectQc(list, seen) {
    const root = global.QC_CENTRAL_SHARING_LINKS;
    (root?.items || []).forEach((item) => {
      if (!(item.status === 'VALIDADO' && item.public === true && item.id && Number(item.quantity) > 0 && item.link)) return;
      pushFilter(list, seen, {
        platform: 'qc', disciplineKey: item.disciplineKey, discipline: item.discipline,
        module: item.code, code: item.code, title: item.notebookTitle || item.title,
        id: item.id, count: item.quantity, url: item.link, source: 'qc-central'
      });
    });

    const cpc = global.CPC_SHARING_LINKS?.modules || {};
    Object.entries(cpc).forEach(([code, item]) => {
      const rows = [item?.general].concat(item?.subdivisions || []).filter(Boolean);
      rows.forEach((row) => {
        if (!(row.public === true && row.id && Number(row.count) > 0 && row.link)) return;
        pushFilter(list, seen, {
          platform: 'qc', disciplineKey: 'processual-civil', module: code, code: row.code,
          title: row.title, id: row.id, count: row.count, url: row.link, source: 'qc-cpc'
        });
      });
    });
  }

  function collectCuratedTec(list, seen) {
    (global.ADM_SHARING_LINKS?.items || []).forEach((item) => {
      if (!(item.status === 'Validado' && item.idCaderno && Number(item.quantidade) > 0 && item.link)) return;
      pushFilter(list, seen, {
        platform: 'tec', disciplineKey: 'administrativo', module: item.modulo,
        code: item.subdivisao || item.modulo, title: item.cadernoTitulo || item.titulo,
        id: item.idCaderno, count: item.quantidade, url: item.link, source: 'tec-adm-curated'
      });
    });

    (global.CIVIL_SHARING_LINKS?.items || []).forEach((item) => {
      if (!(item.status === 'Validado' && item.idCaderno && Number(item.quantidade) > 0 && item.link)) return;
      pushFilter(list, seen, {
        platform: 'tec', disciplineKey: 'civil', module: item.modulo,
        code: item.subdivisao || item.modulo, title: item.cadernoTitulo || item.titulo,
        id: item.idCaderno, count: item.quantidade, url: item.link, source: 'tec-civil-curated'
      });
    });

    (global.TEC_PENAL_CPP_LINKS?.records || []).forEach((item) => {
      if (!(['VALIDADO_NA_CONTA_CRIADORA', 'REUTILIZADO'].includes(item.status) && item.id && Number(item.quantity) > 0 && item.url)) return;
      const disciplineKey = item.discipline === 'cpp' ? 'processual-penal' : 'penal';
      if (item.module === 'GERAL') return;
      pushFilter(list, seen, {
        platform: 'tec', disciplineKey, module: item.module,
        code: item.part ? `${item.module}.${item.part}` : item.module,
        title: item.title || item.subtitle, id: item.id, count: item.quantity,
        url: item.url, source: 'tec-penal-cpp-curated'
      });
    });

    const ptra = global.PTRA_NATIVE_INDEX;
    (ptra?.modules || []).forEach((module) => {
      (module.tec || []).forEach((tecId) => {
        const item = ptra.tecs?.[tecId];
        if (!item) return;
        pushFilter(list, seen, {
          platform: 'tec', disciplineKey: 'processual-trabalho', module: `M${pad(module.number)}`,
          code: String(tecId).toUpperCase().replace('PROC-TRAB-', 'M'), title: item.name,
          id: notebookIdFromUrl(item.url) || tecId, count: item.count, url: item.url,
          legacyCid: tecId, source: 'tec-ptra-native'
        });
      });
    });
  }

  function curatedModuleSet(list) {
    return new Set(list.filter((item) => /^tec-.*-curated$/.test(item.source) || item.source === 'tec-ptra-native').map((item) => `${item.disciplineKey}|${item.module}`));
  }

  function collectGeneralTec(list, seen) {
    const curated = curatedModuleSet(list);
    (global.TEC_CADERNOS_DATA?.cadernos || []).forEach((item) => {
      const disciplineKey = String(item.grupo || '');
      const codeMatch = String(item.id || '').match(/-(\d{1,2})$/);
      const module = codeMatch ? `M${pad(codeMatch[1])}` : '';
      if (!module || curated.has(`${disciplineKey}|${module}`)) return;
      pushFilter(list, seen, {
        platform: 'tec', disciplineKey, discipline: item.grupoNome, module, code: module,
        title: item.nome, id: notebookIdFromUrl(item.url) || item.id, count: item.questoes,
        url: item.url, legacyCid: item.id, source: 'tec-general'
      });
    });
  }

  function buildRegistry() {
    const list = [], seen = new Set();
    collectQc(list, seen);
    collectCuratedTec(list, seen);
    collectGeneralTec(list, seen);
    list.sort((a, b) => a.discipline.localeCompare(b.discipline, 'pt-BR') || a.module.localeCompare(b.module, 'pt-BR', { numeric: true }) || a.platform.localeCompare(b.platform) || a.code.localeCompare(b.code, 'pt-BR', { numeric: true }));
    return list;
  }

  function refreshRegistry() {
    const next = buildRegistry();
    const signature = next.map((item) => `${item.disciplineKey}|${item.module}|${item.stableKey}`).join(';');
    if (signature === registrySignature) return false;
    registry = next;
    registrySignature = signature;
    return true;
  }

  function legacySessions(filter) {
    if (!filter.legacyCid) return [];
    return readLegacyTec().map((row, index) => ({ row, index })).filter(({ row }) => row && String(row.cid) === filter.legacyCid).map(({ row, index }) => ({
      id: String(row._bcSessionId || `legacy-${index}`),
      date: String(row.dt || ''), answered: Math.max(0, Number(row.f) || 0),
      correct: Math.max(0, Number(row.a) || 0), legacy: true, legacyIndex: index,
      createdAt: row.createdAt || '', updatedAt: row.updatedAt || ''
    }));
  }
  function storedSessions(filter) {
    const data = readStore();
    const rows = data.filters[filter.stableKey];
    return Array.isArray(rows) ? rows.map((row) => ({ ...row, legacy: false })) : [];
  }
  function sessionsFor(filter) {
    return storedSessions(filter).concat(legacySessions(filter)).filter((row) => row.answered > 0 && row.correct >= 0 && row.correct <= row.answered)
      .sort((a, b) => String(b.date).localeCompare(String(a.date)) || String(b.createdAt || '').localeCompare(String(a.createdAt || '')));
  }
  function statsFor(filter) {
    const sessions = sessionsFor(filter);
    const answered = sessions.reduce((sum, row) => sum + row.answered, 0);
    const correct = sessions.reduce((sum, row) => sum + row.correct, 0);
    return { sessions, answered, correct, errors: Math.max(0, answered - correct), percent: percent(answered, correct) };
  }

  function saveSession(filter, values, existing) {
    const record = {
      id: existing?.id || sessionId(), date: values.date,
      answered: values.answered, correct: values.correct,
      createdAt: existing?.createdAt || new Date().toISOString(), updatedAt: new Date().toISOString()
    };
    if (existing?.legacy || (!existing && filter.legacyCid)) {
      const rows = readLegacyTec();
      const index = existing?.legacy ? rows.findIndex((row) => row && row._bcSessionId === existing.id) : -1;
      const legacy = {
        cid: filter.legacyCid, dt: record.date, f: record.answered, a: record.correct,
        _bcSessionId: record.id, createdAt: record.createdAt, updatedAt: record.updatedAt
      };
      if (index >= 0) rows[index] = { ...rows[index], ...legacy };
      else rows.push(legacy);
      localStorage.setItem(LEGACY_TEC_KEY, JSON.stringify(rows));
    } else {
      const data = readStore();
      const rows = Array.isArray(data.filters[filter.stableKey]) ? data.filters[filter.stableKey] : [];
      const index = rows.findIndex((row) => row.id === record.id);
      if (index >= 0) rows[index] = record; else rows.push(record);
      data.filters[filter.stableKey] = rows;
      writeStore(data);
    }
    notifyChange();
    return record;
  }

  function deleteSession(filter, session) {
    if (session.legacy) {
      const rows = readLegacyTec().filter((row) => !(row && row._bcSessionId === session.id));
      localStorage.setItem(LEGACY_TEC_KEY, JSON.stringify(rows));
    } else {
      const data = readStore();
      data.filters[filter.stableKey] = (data.filters[filter.stableKey] || []).filter((row) => row.id !== session.id);
      if (!data.filters[filter.stableKey].length) delete data.filters[filter.stableKey];
      writeStore(data);
    }
    notifyChange();
  }

  function ringMarkup(value) {
    const pct = value == null ? 0 : value;
    return `<span class="bcq-ring" style="--bcq-pct:${pct}" aria-label="${value == null ? 'Sem histórico' : `${value}% de acertos`}"><span><b>${value == null ? '—' : `${value}%`}</b><small>acertos</small></span></span>`;
  }
  function filterCard(filter) {
    const stats = statsFor(filter);
    return `<article class="bcq-card" data-bcq-platform="${filter.platform}" data-bcq-key="${attr(filter.stableKey)}">
      <a class="bcq-card-copy" href="${attr(filter.url)}" target="_blank" rel="noopener noreferrer" title="Abrir filtro original">
        <b>${esc(filter.code)} · ${esc(filter.title)}</b>
        <small>ID ${esc(filter.id)} · ${filter.count.toLocaleString('pt-BR')} questões</small>
      </a>
      ${ringMarkup(stats.percent)}
      <button type="button" class="bcq-add" data-bcq-add="${attr(filter.stableKey)}" aria-label="Registrar resultado em ${attr(filter.title)}">+</button>
    </article>`;
  }
  function platformPanel(filters, platform) {
    const rows = filters.filter((item) => item.platform === platform);
    if (!rows.length) return '';
    const name = PLATFORM_LABEL[platform];
    const icon = platform === 'qc' ? 'Q' : 'T';
    return `<section class="bcq-platform" data-bcq-platform="${platform}">
      <header class="bcq-platform-head"><span class="bcq-platform-icon" aria-hidden="true">${icon}</span><span><b>${name}</b><small>Selecione um filtro para praticar questões.</small></span><em>${rows.length} filtro${rows.length === 1 ? '' : 's'} disponíve${rows.length === 1 ? 'l' : 'is'}</em></header>
      <div class="bcq-card-grid">${rows.map(filterCard).join('')}</div>
    </section>`;
  }

  function filtersForModule(disciplineKey, module) {
    const code = baseModule(module);
    return registry.filter((item) => item.disciplineKey === disciplineKey && item.module === code)
      .filter((item) => !(disciplineKey === 'rlm' && item.source === 'tec-general' && global.RLM_TJCE_STRUCTURE));
  }

  function inferModuleNumber(element) {
    const raw = [
      element.getAttribute('data-adm-native'), element.getAttribute('data-cpp-native-module'),
      element.getAttribute('data-ptra-module'), element.getAttribute('data-rlm-module'),
      element.getAttribute('data-civil-analista'), element.getAttribute('data-civil'),
      element.getAttribute('data-cf'), element.getAttribute('data-uid')
    ].filter(Boolean).join(' ');
    if (/^p\d+$/i.test(raw)) return Number(raw.slice(1));
    if (/^cpc\d+$/i.test(raw)) return Number(raw.slice(3));
    const match = raw.match(/(?:^|[-_:])m?0*(\d{1,2})(?:[-_:]|$)/i) || raw.match(/^(\d{1,2})$/);
    if (match) return Number(match[1]);
    const heading = element.querySelector('.cf-module-no,.ptra-native-no,.topic-origin,.civil-module-no')?.textContent || '';
    return Number(heading.match(/(?:módulo\s*)?0*(\d{1,2})/i)?.[1] || 0);
  }
  function identityFor(element) {
    let subjectId = element.closest('.subject[data-id]')?.getAttribute('data-id') || '';
    let disciplineKey = SUBJECT_DISCIPLINE[subjectId] || '';
    if (element.hasAttribute('data-adm-native')) disciplineKey = 'administrativo';
    else if (element.hasAttribute('data-cpp-native-module')) disciplineKey = 'processual-penal';
    else if (element.hasAttribute('data-ptra-module')) disciplineKey = 'processual-trabalho';
    else if (element.hasAttribute('data-rlm-module')) disciplineKey = 'rlm';
    else if (element.hasAttribute('data-civil-analista') || element.hasAttribute('data-civil')) disciplineKey = 'civil';
    const number = inferModuleNumber(element);
    return disciplineKey && number ? { disciplineKey, module: `M${pad(number)}` } : null;
  }
  function moduleBody(element) {
    return element.matches('[data-adm-native]') ? element : element.querySelector(':scope > .cf-module-body,:scope > .detail-panel,:scope > .ptra-native-mod-body,:scope > .civil-module-body') || element;
  }
  function moduleTargets() {
    const selectors = [
      '[data-adm-native]', '[data-cpp-native-module]', '[data-ptra-module]', '[data-rlm-module]',
      '.civil-module[data-civil-analista]', '.civil-module[data-civil]',
      '#subjects .subject[data-id="penal"] .cf-module[data-cf]',
      '#subjects .subject[data-id="cpc"] .cf-module[data-cf]',
      '#subjects .topic-item[data-uid]'
    ];
    return Array.from(new Set(document.querySelectorAll(selectors.join(','))));
  }
  function hideOriginalPanels(body) {
    body.querySelectorAll('.qc-platform-sharing,.cpc-sharing-panel,.tec-validated-panel,.tec-context-panel,.adm-native-sharing,.adm-native-tec-filter,.cpp-native-tec-panel,.civil-native-sharing,.ptra-native-panel.ptra-native-tec,.adm-native-external-entry,.csp-tec-panel').forEach((node) => node.setAttribute('data-bcq-original', '1'));
  }
  function updateModuleMetric(element, filters) {
    const unique = new Map();
    filters.forEach((filter) => unique.set(filter.stableKey, filter));
    const totals = Array.from(unique.values()).reduce((out, filter) => {
      const stats = statsFor(filter); out.answered += stats.answered; out.correct += stats.correct; return out;
    }, { answered: 0, correct: 0 });
    // O histórico legado por módulo não identifica o filtro que o originou.
    // Sem uma sessão nova associável com segurança, preserve a métrica existente.
    if (!totals.answered) return;
    const pct = percent(totals.answered, totals.correct);
    const ring = element.querySelector('[data-native-ring="external"]');
    const value = ring?.querySelector('[data-ring-value],.bc-native-ring-inner b');
    if (ring && ring.style.getPropertyValue('--pct') !== String(pct == null ? 0 : pct)) ring.style.setProperty('--pct', pct == null ? 0 : pct);
    const setText = (node, text) => { if (node && node.textContent !== text) node.textContent = text; };
    setText(value, pct == null ? '—' : `${pct}%`);
    const detail = element.querySelector('[data-native-metric-detail="external"]');
    const meta = element.querySelector('[data-native-metric-meta="external"]');
    setText(detail, totals.answered ? `${totals.correct} acertos em ${totals.answered}` : 'Nenhuma questão externa respondida');
    setText(meta, totals.answered ? `${totals.answered - totals.correct} erros · histórico por filtro` : 'Use o botão + em um filtro para registrar');
  }
  function mountModules() {
    moduleTargets().forEach((element) => {
      const identity = identityFor(element);
      if (!identity) return;
      const filters = filtersForModule(identity.disciplineKey, identity.module);
      const body = moduleBody(element);
      if (!body) return;
      hideOriginalPanels(body);
      let panel = body.querySelector(':scope > [data-bcq-module-panel]');
      if (!filters.length) {
        panel?.remove();
        return;
      }
      const signature = filters.map((filter) => { const stats = statsFor(filter); return `${filter.stableKey}:${stats.answered}:${stats.correct}`; }).join('|');
      const markup = `<div class="bcq-module-panels" data-bcq-module-panel="${identity.disciplineKey}:${identity.module}" data-bcq-signature="${attr(signature)}">${platformPanel(filters, 'qc')}${platformPanel(filters, 'tec')}</div>`;
      if (panel && panel.dataset.bcqSignature === signature) { updateModuleMetric(element, filters); return; }
      if (panel) panel.outerHTML = markup;
      else {
        const notes = body.querySelector('.cms-note-final,.adm-native-notes,.ptra-native-notes');
        if (notes) notes.insertAdjacentHTML('beforebegin', markup); else body.insertAdjacentHTML('beforeend', markup);
      }
      updateModuleMetric(element, filters);
    });
  }

  function injectNavigation() {
    const nav = document.querySelector('#centralSidebar .nav');
    if (nav && !nav.querySelector('[data-bcq-nav]')) {
      const button = document.createElement('button');
      button.type = 'button'; button.dataset.i = 'Q'; button.dataset.bcqNav = '1';
      button.setAttribute('aria-label', 'Filtros de questões');
      button.setAttribute('title', 'Filtros de questões');
      button.innerHTML = '<span class="nav-icon nav-badge">Q</span><span class="nav-text">Filtros de questões</span>';
      button.addEventListener('click', () => openPage(button));
      const tec = Array.from(nav.children).find((node) => /Cadernos TEC/i.test(node.textContent || ''));
      nav.insertBefore(button, tec || nav.querySelector('.label'));
    }
    const moreGrid = document.querySelector('#studentMorePanel .student-more-grid');
    if (moreGrid && !moreGrid.querySelector('[data-bcq-more-nav]')) {
      const moreButton = document.createElement('button');
      moreButton.type = 'button'; moreButton.dataset.bcqMoreNav = '1'; moreButton.dataset.bcqNav = '1';
      moreButton.innerHTML = '<span aria-hidden="true">Q</span><span><b>Filtros de questões</b><small>QC, TEC e histórico</small></span>';
      moreButton.addEventListener('click', () => {
        const panel = document.getElementById('studentMorePanel');
        if (panel) panel.hidden = true;
        document.documentElement.classList.remove('student-more-open');
        document.getElementById('studentMoreButton')?.setAttribute('aria-expanded', 'false');
        openPage(moreButton);
      });
      moreGrid.prepend(moreButton);
    }
  }
  function injectPage() {
    if (document.getElementById('questionFiltersView')) return;
    const workspace = document.querySelector('.workspace');
    if (!workspace) return;
    const page = document.createElement('section');
    page.className = 'view hidden'; page.id = 'questionFiltersView';
    page.innerHTML = `<button type="button" class="central-view-back" data-bcq-home>‹ Central</button>
      <div class="bcq-page-head"><div><span>QUESTÕES EXTERNAS</span><h1>Filtros de questões</h1><p>Abra seus cadernos e acompanhe o aproveitamento de cada filtro.</p></div><div class="bcq-page-total" data-bcq-page-total>—</div></div>
      <div class="bcq-toolbar"><label><span>Pesquisar</span><input type="search" data-bcq-search placeholder="Disciplina, módulo, título ou ID"></label><label><span>Disciplina</span><select data-bcq-discipline><option value="">Todas</option></select></label><label><span>Plataforma</span><select data-bcq-platform-select><option value="">QC e TEC</option><option value="qc">QConcursos</option><option value="tec">TEC Concursos</option></select></label></div>
      <div class="bcq-page-layout"><div class="bcq-page-list" data-bcq-page-list></div><aside class="bcq-detail" data-bcq-detail><div class="bcq-detail-empty"><b>Selecione um filtro</b><span>O histórico completo aparecerá aqui.</span></div></aside></div>`;
    workspace.appendChild(page);
    page.querySelector('[data-bcq-home]').addEventListener('click', () => global.openHome?.());
    page.querySelectorAll('[data-bcq-search],[data-bcq-discipline],[data-bcq-platform-select]').forEach((field) => field.addEventListener(field.tagName === 'INPUT' ? 'input' : 'change', renderPage));
  }
  function injectModal() {
    if (document.getElementById('bcqSessionModal')) return;
    const wrap = document.createElement('div');
    wrap.id = 'bcqSessionModal'; wrap.className = 'bcq-modal'; wrap.hidden = true;
    wrap.innerHTML = `<div class="bcq-modal-backdrop" data-bcq-close></div><section class="bcq-modal-card" role="dialog" aria-modal="true" aria-labelledby="bcqModalTitle">
      <header><div><span data-bcq-modal-platform></span><h2 id="bcqModalTitle">Registrar resultado</h2><p data-bcq-modal-filter></p></div><button type="button" data-bcq-close aria-label="Fechar">×</button></header>
      <form data-bcq-form novalidate><label>Data da sessão<input name="date" type="date" required></label><div class="bcq-modal-grid"><label>Questões respondidas<input name="answered" type="number" min="1" step="1" inputmode="numeric" required></label><label>Acertos<input name="correct" type="number" min="0" step="1" inputmode="numeric" required></label></div><div class="bcq-modal-result"><span>Percentual calculado</span><b data-bcq-calculated>—</b></div><p class="bcq-form-error" data-bcq-error role="alert"></p><button class="bcq-save" type="submit">Salvar</button></form>
    </section>`;
    document.body.appendChild(wrap);
    wrap.querySelectorAll('[data-bcq-close]').forEach((button) => button.addEventListener('click', closeModal));
    const form = wrap.querySelector('[data-bcq-form]');
    form.addEventListener('input', updateCalculated);
    form.addEventListener('submit', submitModal);
  }

  function openPage(button) {
    refreshRegistry(); injectPage();
    document.querySelectorAll('.view').forEach((view) => view.classList.add('hidden'));
    const page = document.getElementById('questionFiltersView');
    page.classList.remove('hidden'); page.classList.add('central-view-visible');
    document.querySelectorAll('#centralSidebar .nav button').forEach((item) => item.classList.toggle('active', item === button || item.hasAttribute('data-bcq-nav')));
    const crumb = document.getElementById('crumb'); if (crumb) crumb.textContent = 'Filtros de questões';
    global.closeMobileSidebar?.();
    renderPage();
    try { global.scrollTo(0, 0); page.scrollTop = 0; } catch (_) { /* no-op */ }
    return false;
  }

  function pageFilters() {
    const page = document.getElementById('questionFiltersView');
    if (!page) return [];
    const search = String(page.querySelector('[data-bcq-search]')?.value || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
    const discipline = page.querySelector('[data-bcq-discipline]')?.value || '';
    const platform = page.querySelector('[data-bcq-platform-select]')?.value || '';
    return registry.filter((filter) => !discipline || filter.disciplineKey === discipline).filter((filter) => !platform || filter.platform === platform).filter((filter) => {
      if (!search) return true;
      return `${filter.discipline} ${filter.module} ${filter.code} ${filter.title} ${filter.id} ${filter.platformLabel}`.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().includes(search);
    });
  }
  function syncDisciplineOptions() {
    const select = document.querySelector('[data-bcq-discipline]');
    if (!select) return;
    const value = select.value;
    const options = Array.from(new Map(registry.map((filter) => [filter.disciplineKey, filter.discipline])).entries()).sort((a, b) => a[1].localeCompare(b[1], 'pt-BR'));
    select.innerHTML = '<option value="">Todas</option>' + options.map(([key, label]) => `<option value="${attr(key)}">${esc(label)}</option>`).join('');
    if (options.some(([key]) => key === value)) select.value = value;
  }
  function renderPage() {
    const page = document.getElementById('questionFiltersView');
    if (!page || page.classList.contains('hidden')) return;
    syncDisciplineOptions();
    const items = pageFilters();
    const total = page.querySelector('[data-bcq-page-total]');
    if (total) total.innerHTML = `<b>${items.length}</b><span>filtros encontrados</span>`;
    const host = page.querySelector('[data-bcq-page-list]');
    if (!items.length) {
      host.innerHTML = '<div class="bcq-empty">Nenhum filtro corresponde à pesquisa.</div>';
      renderDetail(null); return;
    }
    const groups = new Map();
    items.forEach((filter) => {
      const key = `${filter.disciplineKey}|${filter.module}`;
      if (!groups.has(key)) groups.set(key, { discipline: filter.discipline, module: filter.module, filters: [] });
      groups.get(key).filters.push(filter);
    });
    host.innerHTML = Array.from(groups.values()).map((group) => `<section class="bcq-page-group"><header><b>${esc(group.discipline)}</b><span>${esc(group.module)}</span></header><div>${group.filters.map((filter) => {
      const stats = statsFor(filter);
      return `<button type="button" class="bcq-page-filter${selectedKey === filter.stableKey ? ' active' : ''}" data-bcq-select="${attr(filter.stableKey)}"><span class="bcq-page-platform" data-platform="${filter.platform}">${filter.platform === 'qc' ? 'QC' : 'TEC'}</span><span><b>${esc(filter.code)} · ${esc(filter.title)}</b><small>${filter.count.toLocaleString('pt-BR')} questões · ID ${esc(filter.id)}</small></span><strong>${stats.percent == null ? '—' : `${stats.percent}%`}</strong></button>`;
    }).join('')}</div></section>`).join('');
    if (!selectedKey || !items.some((item) => item.stableKey === selectedKey)) selectedKey = items[0].stableKey;
    renderDetail(items.find((item) => item.stableKey === selectedKey) || items[0]);
  }

  function evolutionSvg(sessions, platform) {
    const ordered = sessions.slice().sort((a, b) => String(a.date).localeCompare(String(b.date))).slice(-12);
    if (!ordered.length) return '<div class="bcq-evolution-empty">A evolução aparecerá após a primeira sessão.</div>';
    const width = 520, height = 150, padding = 18;
    const points = ordered.map((session, index) => {
      const x = ordered.length === 1 ? width / 2 : padding + index * ((width - padding * 2) / (ordered.length - 1));
      const y = height - padding - (percent(session.answered, session.correct) || 0) * ((height - padding * 2) / 100);
      return { x, y, pct: percent(session.answered, session.correct) || 0 };
    });
    const line = points.map((point) => `${point.x},${point.y}`).join(' ');
    return `<svg class="bcq-evolution-svg" viewBox="0 0 ${width} ${height}" role="img" aria-label="Evolução percentual das últimas ${ordered.length} sessões"><line x1="${padding}" y1="${height - padding}" x2="${width - padding}" y2="${height - padding}"/><line x1="${padding}" y1="${padding}" x2="${padding}" y2="${height - padding}"/><polyline data-platform="${platform}" points="${line}"/>${points.map((point) => `<circle data-platform="${platform}" cx="${point.x}" cy="${point.y}" r="4"><title>${point.pct}%</title></circle>`).join('')}</svg>`;
  }
  function renderDetail(filter) {
    const host = document.querySelector('[data-bcq-detail]');
    if (!host) return;
    if (!filter) { host.innerHTML = '<div class="bcq-detail-empty"><b>Selecione um filtro</b><span>O histórico completo aparecerá aqui.</span></div>'; return; }
    const stats = statsFor(filter);
    host.dataset.platform = filter.platform;
    host.innerHTML = `<header class="bcq-detail-head"><span>${filter.platformLabel}</span><h2>${esc(filter.code)} · ${esc(filter.title)}</h2><p>${esc(filter.discipline)} · ${esc(filter.module)} · ID ${esc(filter.id)} · ${filter.count.toLocaleString('pt-BR')} questões</p><div><a href="${attr(filter.url)}" target="_blank" rel="noopener noreferrer">Abrir caderno original ↗</a><button type="button" data-bcq-add="${attr(filter.stableKey)}">+ Registrar resultado</button></div></header>
      <div class="bcq-detail-stats"><article><b>${stats.answered}</b><span>respondidas</span></article><article><b>${stats.correct}</b><span>acertos</span></article><article><b>${stats.errors}</b><span>erros</span></article><article><b>${stats.percent == null ? '—' : `${stats.percent}%`}</b><span>acumulado</span></article></div>
      <section class="bcq-evolution"><h3>Evolução do desempenho</h3>${evolutionSvg(stats.sessions, filter.platform)}</section>
      <section class="bcq-history"><h3>Histórico de sessões</h3>${stats.sessions.length ? `<div class="bcq-history-list">${stats.sessions.map((session) => `<article><time>${fmtDate(session.date)}</time><span>${session.answered} respondidas</span><span>${session.correct} acertos</span><span>${session.answered - session.correct} erros</span><b>${percent(session.answered, session.correct)}%</b><div><button type="button" data-bcq-edit="${attr(session.id)}" aria-label="Editar sessão">Editar</button><button type="button" data-bcq-delete="${attr(session.id)}" aria-label="Excluir sessão">Excluir</button></div></article>`).join('')}</div>` : '<div class="bcq-history-empty">Nenhuma sessão registrada neste filtro.</div>'}</section>`;
  }

  function filterByKey(key) { return registry.find((filter) => filter.stableKey === key) || null; }
  function openModal(filter, session) {
    if (!filter) return;
    modalReturnFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    injectModal(); modalFilter = filter; modalSession = session || null;
    const modal = document.getElementById('bcqSessionModal');
    const form = modal.querySelector('[data-bcq-form]');
    modal.querySelector('[data-bcq-modal-platform]').textContent = filter.platformLabel;
    modal.querySelector('[data-bcq-modal-filter]').textContent = `${filter.code} · ${filter.title}`;
    modal.querySelector('h2').textContent = session ? 'Editar resultado' : 'Registrar resultado';
    form.elements.date.value = session?.date || today();
    form.elements.answered.value = session?.answered || '';
    form.elements.correct.value = session?.correct ?? '';
    modal.querySelector('[data-bcq-error]').textContent = '';
    modal.hidden = false; document.documentElement.classList.add('bcq-modal-open');
    updateCalculated();
    setTimeout(() => form.elements.answered.focus(), 0);
  }
  function closeModal() {
    const modal = document.getElementById('bcqSessionModal'); if (!modal) return;
    modal.hidden = true; document.documentElement.classList.remove('bcq-modal-open'); modalFilter = null; modalSession = null;
    if (modalReturnFocus?.isConnected) modalReturnFocus.focus({ preventScroll: true });
    modalReturnFocus = null;
  }
  function updateCalculated() {
    const modal = document.getElementById('bcqSessionModal'); if (!modal || modal.hidden) return;
    const form = modal.querySelector('[data-bcq-form]');
    const answered = Number(form.elements.answered.value), correct = Number(form.elements.correct.value);
    const valid = Number.isInteger(answered) && answered > 0 && Number.isInteger(correct) && correct >= 0 && correct <= answered;
    modal.querySelector('[data-bcq-calculated]').textContent = valid ? `${percent(answered, correct)}%` : '—';
  }
  function submitModal(event) {
    event.preventDefault();
    const form = event.currentTarget, date = form.elements.date.value;
    const answered = Number(form.elements.answered.value), correct = Number(form.elements.correct.value);
    const error = form.querySelector('[data-bcq-error]');
    let message = '';
    if (!validDate(date)) message = 'Informe uma data válida.';
    else if (!Number.isInteger(answered) || answered < 1) message = 'Informe ao menos 1 questão respondida.';
    else if (!Number.isInteger(correct) || correct < 0) message = 'Informe uma quantidade válida de acertos.';
    else if (correct > answered) message = 'Os acertos não podem superar as questões respondidas.';
    if (message) { error.textContent = message; return; }
    saveSession(modalFilter, { date, answered, correct }, modalSession);
    selectedKey = modalFilter.stableKey;
    closeModal(); refreshAll();
  }

  function onClick(event) {
    const add = event.target.closest('[data-bcq-add]');
    if (add) { event.preventDefault(); openModal(filterByKey(add.getAttribute('data-bcq-add')), null); return; }
    const select = event.target.closest('[data-bcq-select]');
    if (select) { selectedKey = select.getAttribute('data-bcq-select'); renderPage(); return; }
    const edit = event.target.closest('[data-bcq-edit]');
    if (edit) {
      const filter = filterByKey(selectedKey); const session = filter && sessionsFor(filter).find((row) => row.id === edit.getAttribute('data-bcq-edit'));
      if (filter && session) openModal(filter, session); return;
    }
    const remove = event.target.closest('[data-bcq-delete]');
    if (remove) {
      const filter = filterByKey(selectedKey); const session = filter && sessionsFor(filter).find((row) => row.id === remove.getAttribute('data-bcq-delete'));
      if (filter && session && global.confirm(`Excluir o registro de ${fmtDate(session.date)}?`)) { deleteSession(filter, session); refreshAll(); }
    }
  }
  function refreshAll() {
    refreshRegistry(); injectNavigation(); injectPage(); mountModules(); renderPage();
    if (selectedKey) renderDetail(filterByKey(selectedKey));
  }
  function scheduleRefresh() {
    if (scheduled) return;
    scheduled = true;
    global.requestAnimationFrame(() => { scheduled = false; refreshAll(); });
  }
  function init() {
    ensureLegacyTecIds(); refreshRegistry(); injectNavigation(); injectPage(); injectModal(); mountModules();
    document.addEventListener('click', onClick);
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && !document.getElementById('bcqSessionModal')?.hidden) closeModal();
    });
    document.addEventListener('central:discipline-ready', scheduleRefresh);
    global.addEventListener('central-cloud-applied', scheduleRefresh);
    global.addEventListener('central:external-filter-history-changed', scheduleRefresh);
    new MutationObserver(scheduleRefresh).observe(document.documentElement, { childList: true, subtree: true });
  }

  global.ExternalQuestionFilters = {
    buildRegistry, refresh: refreshAll, openPage, openModal,
    sessionsFor, statsFor, saveSession, deleteSession,
    validate(values) {
      const answered = Number(values?.answered), correct = Number(values?.correct);
      return validDate(values?.date) && Number.isInteger(answered) && answered > 0 && Number.isInteger(correct) && correct >= 0 && correct <= answered;
    },
    keys: { store: STORE_KEY, legacyTec: LEGACY_TEC_KEY }
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
  else init();
})(window);
