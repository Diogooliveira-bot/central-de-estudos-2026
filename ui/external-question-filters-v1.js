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
    matematica: 'Matemática',
    portugues: 'Língua Portuguesa'
  };
  const SUBJECT_DISCIPLINE = {
    pt: 'portugues', port: 'portugues', portugues: 'portugues',
    adm: 'administrativo', cf: 'constitucional', civil: 'civil', cpc: 'processual-civil',
    penal: 'penal', cpp: 'processual-penal', trab: 'trabalho', ptra: 'processual-trabalho',
    rlm: 'rlm', mat: 'matematica'
  };
  const DISCIPLINE_ALIASES = {
    pt: 'portugues', port: 'portugues', portugues: 'portugues',
    português: 'portugues', 'língua portuguesa': 'portugues'
  };
  const canonicalDisciplineKey = (value) => {
    const key = String(value || '').trim().toLowerCase();
    return DISCIPLINE_ALIASES[key] || key;
  };
  const CATALOG_DISCIPLINE_LABELS = {
    'Direito Administrativo': 'Administrativo',
    'Direito Constitucional': 'Constitucional',
    'Direito Civil': 'Civil',
    'Direito Empresarial': 'Empresarial',
    'Direito Processual Civil': 'Processo Civil',
    'Direito Penal': 'Penal',
    'Direito Processual Penal': 'Processo Penal',
    'Direito do Trabalho': 'Trabalho',
    'Direito Processual do Trabalho': 'Processo do Trabalho',
    'Raciocínio Lógico-Matemático': 'Raciocínio Lógico',
    'Raciocínio Lógico': 'Raciocínio Lógico',
    'Língua Portuguesa': 'Português',
    'Português': 'Português'
  };

  let registry = [];
  let registrySignature = '';
  let selectedKey = '';
  let activeTab = 'overview';
  let sharedOverrides = new Map();
  let canManageFilters = false;
  let overridesLoaded = false;
  let modalFilter = null;
  let modalSession = null;
  let modalReturnFocus = null;
  let adminFilter = null;
  let scheduled = false;
  const disciplineOpenState = new Map();
  const moduleOpenState = new Map();
  const ROUTE = '/central-de-questoes';
  const TABS = new Set(['overview', 'disciplines', 'filters', 'history', 'review']);

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
  function simpleCatalogTitle(value) {
    let text = String(value || '').replace(/\s+/g, ' ').trim();
    const parts = text.split('|').map((part) => part.trim()).filter(Boolean);
    if (parts.length > 1) {
      const partTitle = parts.find((part) => /^parte\s*\d+\s*:/i.test(part));
      if (partTitle) text = partTitle.replace(/^parte\s*\d+\s*:\s*/i, '');
      else {
        const moduleIndex = parts.findIndex((part) => /^M\d{1,2}(?:\.\d+)?$/i.test(part));
        text = moduleIndex >= 0 && parts[moduleIndex + 1] ? parts[moduleIndex + 1] : parts[parts.length - 1];
      }
    }
    text = text
      .replace(/^base completa\s*[-–—:|·]*\s*/i, '')
      .replace(/^(?:direito\s+)?(?:administrativo|constitucional|civil|empresarial|penal|processual\s+civil|processual\s+penal|processual\s+do\s+trabalho|do\s+trabalho|processo\s+civil|adm|cf|civ|cpc|pc|pen|cpp|ptra|trab|port|rlm|matem[aá]tica)\s*[-–—:|·]*\s*/i, '')
      .replace(/^M?0*\d{1,2}(?:\.\d+)?\s*[-–—:|·]*\s*/i, '')
      .replace(/^geral\s*[-–—:|·]*\s*/i, '')
      .trim();
    return text;
  }
  const catalogFilterTitle = (filter) => (filter.revision > 0 ? simpleCatalogTitle(filter.title) : '') || simpleCatalogTitle(filter.displayTitle) || simpleCatalogTitle(filter.title) || simpleCatalogTitle(filter.moduleTitle) || filter.title;
  function catalogModuleTitle(rows) {
    const explicit = rows.map((row) => simpleCatalogTitle(row.moduleTitle)).find(Boolean);
    if (explicit) return explicit;
    for (const row of rows) {
      const parts = String(row.title || '').split('|').map((part) => part.trim()).filter(Boolean);
      const moduleIndex = parts.findIndex((part) => part.toUpperCase() === row.module);
      const title = moduleIndex >= 0 ? simpleCatalogTitle(parts[moduleIndex + 1]) : simpleCatalogTitle(row.title);
      if (title) return title;
    }
    return 'Conteúdo do módulo';
  }
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
    const disciplineKey = canonicalDisciplineKey(input.disciplineKey);
    if (!url || !id || !module || !disciplineKey) return null;
    return {
      platform,
      platformLabel: PLATFORM_LABEL[platform],
      stableKey: `${platform}:${id}`,
      disciplineKey,
      discipline: input.discipline || DISCIPLINES[disciplineKey] || disciplineKey,
      module,
      code: String(input.code || module).toUpperCase(),
      title: String(input.title || input.code || id).trim(),
      displayTitle: String(input.displayTitle || '').trim(),
      moduleTitle: String(input.moduleTitle || '').trim(),
      id,
      count: Math.max(0, Number(input.count) || 0),
      url,
      status: input.status === 'unavailable' ? 'unavailable' : 'available',
      revision: Math.max(0, Number(input.revision) || 0),
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
        displayTitle: item.title,
        moduleTitle: item.kind === 'general' ? item.title : item.moduleTitle,
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
          title: row.title, displayTitle: row.title, moduleTitle: item.title, id: row.id, count: row.count, url: row.link, source: 'qc-cpc'
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
        displayTitle: item.titulo, moduleTitle: item.moduloTitulo,
        id: item.idCaderno, count: item.quantidade, url: item.link, source: 'tec-adm-curated'
      });
    });

    (global.CIVIL_SHARING_LINKS?.items || []).forEach((item) => {
      if (!(item.status === 'Validado' && item.idCaderno && Number(item.quantidade) > 0 && item.link)) return;
      pushFilter(list, seen, {
        platform: 'tec', disciplineKey: 'civil', module: item.modulo,
        code: item.subdivisao || item.modulo, title: item.cadernoTitulo || item.titulo,
        displayTitle: item.titulo, moduleTitle: item.moduloTitulo,
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
          moduleTitle: module.title,
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
    const catalog = [];
    const catalogSeen = new Set();
    const sources = [
      ...(Array.isArray(global.PT_TEC_CADERNOS) ? global.PT_TEC_CADERNOS : []),
      ...(global.TEC_CADERNOS_DATA?.cadernos || [])
    ];
    sources.forEach((item) => {
      const key = String(item?.id || item?.url || '');
      if (key && catalogSeen.has(key)) return;
      if (key) catalogSeen.add(key);
      catalog.push(item);
    });
    catalog.forEach((item) => {
      const disciplineKey = canonicalDisciplineKey(item?.grupo);
      const codeMatch = String(item?.id || '').match(/-(\d{1,2})$/);
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
    const resolved = list.map((filter) => {
      const override = sharedOverrides.get(filter.stableKey);
      if (!override?.data) return filter;
      const url = safeUrl(override.data.url, filter.platform) || filter.url;
      return {
        ...filter,
        title: String(override.data.title || filter.title).trim(),
        count: Math.max(1, Number(override.data.count) || filter.count),
        url,
        status: override.data.status === 'unavailable' ? 'unavailable' : 'available',
        revision: Math.max(0, Number(override.revision) || 0),
        overrideUpdatedAt: override.updatedAt || ''
      };
    });
    resolved.sort((a, b) => a.discipline.localeCompare(b.discipline, 'pt-BR') || a.module.localeCompare(b.module, 'pt-BR', { numeric: true }) || a.platform.localeCompare(b.platform) || a.code.localeCompare(b.code, 'pt-BR', { numeric: true }));
    return resolved;
  }

  function refreshRegistry() {
    const next = buildRegistry();
    const signature = next.map((item) => `${item.disciplineKey}|${item.module}|${item.stableKey}|${item.title}|${item.count}|${item.url}|${item.status}|${item.revision}`).join(';');
    if (signature === registrySignature) return false;
    registry = next;
    registrySignature = signature;
    return true;
  }

  async function loadSharedOverrides() {
    try {
      const response = await fetch('/api/external-question-filters', { credentials: 'same-origin', cache: 'no-store' });
      if (!response.ok) throw new Error('Falha ao carregar configurações');
      const data = await response.json();
      sharedOverrides = new Map((Array.isArray(data.overrides) ? data.overrides : []).map((item) => [item.stableKey, item]));
      canManageFilters = data.canManage === true && global.BASE_COMPLETA_USER?.role === 'admin';
      overridesLoaded = true;
      registrySignature = '';
      refreshAll();
    } catch (_) {
      overridesLoaded = true;
      canManageFilters = false;
      renderPage();
    }
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
    const title = catalogFilterTitle(filter);
    return `<article class="bcq-card" data-bcq-platform="${filter.platform}" data-bcq-key="${attr(filter.stableKey)}">
      ${filter.status === 'available' ? `<a class="bcq-card-copy" href="${attr(filter.url)}" target="_blank" rel="noopener noreferrer" title="Abrir filtro original">` : '<span class="bcq-card-copy" aria-disabled="true">'}
        <b title="${attr(title)}">${esc(title)}</b>
        <small>ID ${esc(filter.id)} · ${filter.count.toLocaleString('pt-BR')} questões${filter.status === 'unavailable' ? ' · indisponível' : ''}</small>
      ${filter.status === 'available' ? '</a>' : '</span>'}
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
    const unique = new Map();
    registry.filter((item) => item.disciplineKey === canonicalDisciplineKey(disciplineKey) && item.module === code)
      .forEach((item) => {
        const key = `${item.platform}|${item.id || item.url}`;
        if (!unique.has(key)) unique.set(key, item);
      });
    return Array.from(unique.values());
  }

  function inferModuleNumber(element) {
    const raw = [
      element.getAttribute('data-adm-native'), element.getAttribute('data-cpp-native-module'),
      element.getAttribute('data-ptra-module'), element.getAttribute('data-rlm-module'),
      element.getAttribute('data-civil-native-module'), element.getAttribute('data-civil-analista'), element.getAttribute('data-civil'),
      element.getAttribute('data-cf'), element.getAttribute('data-uid'),
      element.getAttribute('data-module-card')
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
    if (element.matches('.pt-module-card[data-module-card]')) disciplineKey = 'portugues';
    if (element.hasAttribute('data-adm-native')) disciplineKey = 'administrativo';
    else if (element.hasAttribute('data-cpp-native-module')) disciplineKey = 'processual-penal';
    else if (element.hasAttribute('data-ptra-module')) disciplineKey = 'processual-trabalho';
    else if (element.hasAttribute('data-rlm-module')) disciplineKey = 'rlm';
    else if (element.hasAttribute('data-civil-native-module') || element.hasAttribute('data-civil-analista') || element.hasAttribute('data-civil')) disciplineKey = 'civil';
    const number = inferModuleNumber(element);
    return disciplineKey && number ? { disciplineKey, module: `M${pad(number)}` } : null;
  }
  function moduleBody(element) {
    if (element.matches('[data-civil-native-module]')) return element.querySelector(':scope > .cv-module-body > .cv-zone');
    return element.matches('[data-adm-native]') ? element : element.querySelector(':scope > .cf-module-body,:scope > .detail-panel,:scope > .topic-detail > .detail-panel,:scope > .ptra-native-mod-body,:scope > .civil-module-body,:scope > .pt-module-body') || element;
  }
  function moduleTargetPriority(element) {
    if (element.matches('[data-adm-native],[data-civil-native-module]')) return 60;
    if (element.matches('[data-cpp-native-module],[data-ptra-module],[data-rlm-module]')) return 50;
    if (element.matches('.pt-module-card[data-module-card]')) return 45;
    if (element.matches('.civil-module[data-civil-analista],.civil-module[data-civil]')) return 40;
    if (element.matches('.cf-module[data-cf]')) return 30;
    return 10;
  }
  function moduleTargets() {
    const selectors = [
      '[data-adm-native]', '[data-civil-native-module]', '[data-cpp-native-module]', '[data-ptra-module]', '[data-rlm-module]',
      '.civil-module[data-civil-analista]', '.civil-module[data-civil]',
      '#subjects .subject[data-id="penal"] .cf-module[data-cf]',
      '#subjects .subject[data-id="cpc"] .cf-module[data-cf]',
      '#subjects .subject[data-id="cf"] .cf-module[data-cf]',
      '#subjects .topic-item[data-uid]',
      '.pt-module-card[data-module-card]'
    ];
    const selected = new Map();
    Array.from(new Set(document.querySelectorAll(selectors.join(',')))).forEach((element) => {
      const identity = identityFor(element);
      if (!identity) return;
      const key = `${identity.disciplineKey}:${identity.module}`;
      const current = selected.get(key);
      if (!current || moduleTargetPriority(element) > moduleTargetPriority(current)) selected.set(key, element);
    });
    return Array.from(selected.values());
  }
  const ORIGINAL_PANEL_SELECTOR = '.qc-platform-sharing,.cpc-sharing-panel,.tec-validated-panel,.tec-context-panel,.adm-native-sharing,.adm-native-tec-filter,.cpp-native-tec-panel,.civil-native-sharing,.cv-sharing,.cv-tec-panel,.ptra-native-panel.ptra-native-tec,.adm-native-external-entry,.csp-tec-panel';
  function hideOriginalPanels(body) {
    body.querySelectorAll(ORIGINAL_PANEL_SELECTOR).forEach((node) => node.setAttribute('data-bcq-original', '1'));
    body.setAttribute('data-bcq-module-host', '1');
  }
  function showOriginalPanels(body) {
    body.removeAttribute('data-bcq-module-host');
    body.querySelectorAll(ORIGINAL_PANEL_SELECTOR).forEach((node) => node.removeAttribute('data-bcq-original'));
  }
  function restoreMissingModuleFallbacks(root) {
    const hosts = [];
    if (root?.matches?.('[data-bcq-module-host="1"]')) hosts.push(root);
    root?.querySelectorAll?.('[data-bcq-module-host="1"]').forEach((node) => hosts.push(node));
    hosts.forEach((body) => {
      if (!body.querySelector(':scope > [data-bcq-module-panel]')) showOriginalPanels(body);
    });
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
      if (element.matches('.pt-module-card[data-module-card]') && body.dataset.loaded !== '1') return;
      const mountedPanels = Array.from(body.querySelectorAll('[data-bcq-module-panel]'));
      let panel = mountedPanels.shift() || null;
      mountedPanels.forEach((duplicate) => duplicate.remove());
      if (!filters.length) {
        panel?.remove(); showOriginalPanels(body);
        return;
      }
      try {
        const signature = `approved-v1|${filters.map((filter) => { const stats = statsFor(filter); return `${filter.stableKey}:${filter.title}:${filter.count}:${filter.url}:${filter.status}:${filter.revision}:${stats.answered}:${stats.correct}`; }).join('|')}`;
        if (panel && panel.dataset.bcqSignature === signature) {
          hideOriginalPanels(body); updateModuleMetric(element, filters); return;
        }
        const markup = `<div class="bcq-module-panels" data-bcq-module-panel="${identity.disciplineKey}:${identity.module}" data-bcq-signature="${attr(signature)}">${platformPanel(filters, 'qc')}${platformPanel(filters, 'tec')}</div>`;
        const template = document.createElement('template');
        template.innerHTML = markup.trim();
        const replacement = template.content.firstElementChild;
        if (!replacement?.matches('[data-bcq-module-panel]')) throw new Error('Painel compacto inválido');
        if (panel) panel.replaceWith(replacement);
        else {
          const notes = body.querySelector('.cms-note-final,.adm-native-notes,.ptra-native-notes,.cv-native-notes');
          if (notes) notes.after(replacement); else body.append(replacement);
        }
        if (!replacement.isConnected) throw new Error('Painel compacto não foi inserido');
        hideOriginalPanels(body);
        updateModuleMetric(element, filters);
      } catch (reason) {
        panel = body.querySelector('[data-bcq-module-panel]');
        if (panel) hideOriginalPanels(body); else showOriginalPanels(body);
        console.warn('[Central de Questões] Mantendo os filtros originais do módulo.', reason);
      }
    });
  }

  function uniqueFilters() {
    return Array.from(new Map(registry.map((filter) => [filter.stableKey, filter])).values());
  }
  function allSessionEntries() {
    return uniqueFilters().flatMap((filter) => sessionsFor(filter).map((session) => ({ filter, session })))
      .sort((a, b) => String(b.session.date).localeCompare(String(a.session.date)) || String(b.session.createdAt || '').localeCompare(String(a.session.createdAt || '')));
  }
  function aggregateFilters(filters) {
    return filters.reduce((total, filter) => {
      const stats = statsFor(filter);
      total.answered += stats.answered;
      total.correct += stats.correct;
      total.errors += stats.errors;
      total.sessions += stats.sessions.length;
      return total;
    }, { answered: 0, correct: 0, errors: 0, sessions: 0 });
  }
  function tabFromLocation() {
    const value = new URLSearchParams(global.location.search).get('aba') || 'overview';
    return TABS.has(value) ? value : 'overview';
  }
  function routeForTab(tab) {
    return ROUTE + (tab === 'overview' ? '' : `?aba=${encodeURIComponent(tab)}`);
  }

  function injectNavigation() {
    const nav = document.querySelector('#centralSidebar .nav');
    nav?.querySelector('[data-bcq-nav]:not([data-bcq-more-nav])')?.remove();
    const moreGrid = document.querySelector('#studentMorePanel .student-more-grid');
    if (moreGrid && !moreGrid.querySelector('[data-bcq-more-nav]')) {
      const moreButton = document.createElement('button');
      moreButton.type = 'button'; moreButton.dataset.bcqMoreNav = '1'; moreButton.dataset.bcqNav = '1';
      moreButton.innerHTML = '<span aria-hidden="true">Q</span><span><b>Central de Questões</b><small>Filtros, histórico e revisão</small></span>';
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
      <div class="bcq-page-head"><div><span>ACOMPANHAMENTO DE ESTUDOS</span><h1>Central de Questões</h1><p>Seus filtros, resultados e evolução em um só lugar.</p></div><div class="bcq-page-total" data-bcq-page-total>—</div></div>
      <nav class="bcq-center-tabs" role="tablist" aria-label="Seções da Central de Questões">
        <button type="button" role="tab" data-bcq-tab="overview">Visão geral</button>
        <button type="button" role="tab" data-bcq-tab="disciplines">Disciplinas</button>
        <button type="button" role="tab" data-bcq-tab="filters">Meus filtros</button>
        <button type="button" role="tab" data-bcq-tab="history">Histórico</button>
        <button type="button" role="tab" data-bcq-tab="review">Revisão</button>
      </nav>
      <div class="bcq-center-content">
        <section data-bcq-panel="overview"></section>
        <section data-bcq-panel="disciplines" hidden></section>
        <section data-bcq-panel="filters" hidden>
          <div class="bcq-toolbar"><label><span>Pesquisar</span><input type="search" data-bcq-search placeholder="Disciplina, módulo, título ou ID"></label><label><span>Disciplina</span><select data-bcq-discipline><option value="">Todas</option></select></label><label><span>Plataforma</span><select data-bcq-platform-select><option value="">QC e TEC</option><option value="qc">QConcursos</option><option value="tec">TEC Concursos</option></select></label></div>
          <div class="bcq-page-layout"><div class="bcq-page-list" data-bcq-page-list></div><aside class="bcq-detail" data-bcq-detail><div class="bcq-detail-empty"><b>Selecione um filtro</b><span>O histórico completo aparecerá aqui.</span></div></aside></div>
        </section>
        <section data-bcq-panel="history" hidden></section>
        <section data-bcq-panel="review" hidden></section>
      </div>`;
    workspace.appendChild(page);
    page.querySelector('[data-bcq-home]').addEventListener('click', leavePage);
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
  function injectAdminModal() {
    if (document.getElementById('bcqAdminModal')) return;
    const wrap = document.createElement('div');
    wrap.id = 'bcqAdminModal'; wrap.className = 'bcq-modal'; wrap.hidden = true;
    wrap.innerHTML = `<div class="bcq-modal-backdrop" data-bcq-admin-close></div><section class="bcq-modal-card bcq-admin-card" role="dialog" aria-modal="true" aria-labelledby="bcqAdminTitle">
      <header><div><span>ADMINISTRAÇÃO</span><h2 id="bcqAdminTitle">Gerenciar filtro</h2><p>As alterações serão compartilhadas entre os módulos e a Central de Questões.</p></div><button type="button" data-bcq-admin-close aria-label="Fechar">×</button></header>
      <form data-bcq-admin-form novalidate><label>Identificador estável<input name="stableKey" readonly></label><label>Título do filtro<input name="title" maxlength="300" required></label><div class="bcq-modal-grid"><label>Quantidade de questões<input name="count" type="number" min="1" max="100000" step="1" required></label><label>Disponibilidade<select name="status"><option value="available">Disponível</option><option value="unavailable">Indisponível</option></select></label></div><label>Link original<input name="url" type="url" required></label><p class="bcq-form-error" data-bcq-admin-error role="alert"></p><button class="bcq-save" type="submit">Salvar alterações</button></form>
    </section>`;
    document.body.appendChild(wrap);
    wrap.querySelectorAll('[data-bcq-admin-close]').forEach((button) => button.addEventListener('click', closeAdminModal));
    wrap.querySelector('[data-bcq-admin-form]').addEventListener('submit', submitAdminModal);
  }

  function switchTab(tab, updateRoute = true) {
    if (!TABS.has(tab)) tab = 'overview';
    activeTab = tab;
    const page = document.getElementById('questionFiltersView');
    page?.querySelectorAll('[data-bcq-tab]').forEach((button) => {
      const active = button.dataset.bcqTab === tab;
      button.classList.toggle('active', active);
      button.setAttribute('aria-selected', String(active));
      button.setAttribute('tabindex', active ? '0' : '-1');
    });
    page?.querySelectorAll('[data-bcq-panel]').forEach((panel) => { panel.hidden = panel.dataset.bcqPanel !== tab; });
    if (updateRoute && global.location.pathname === ROUTE) global.history.replaceState({ centralQuestions: true, tab }, '', routeForTab(tab));
    renderPage();
  }
  function leavePage() {
    const page = document.getElementById('questionFiltersView');
    if (page) {
      page.classList.add('hidden');
      page.classList.remove('central-view-visible');
    }
    if (global.location.pathname === ROUTE) global.history.replaceState({ centralQuestions: false }, '', '/');
    if (typeof global.openHome === 'function') global.openHome();
    else {
      document.getElementById('homeView')?.classList.remove('hidden');
      const crumb = document.getElementById('crumb');
      if (crumb) crumb.textContent = 'Início';
    }
  }
  function openPage(button, options = {}) {
    refreshRegistry(); injectPage();
    document.querySelectorAll('.view').forEach((view) => view.classList.add('hidden'));
    const page = document.getElementById('questionFiltersView');
    page.classList.remove('hidden'); page.classList.add('central-view-visible');
    document.querySelectorAll('#centralSidebar .nav button').forEach((item) => item.classList.toggle('active', item === button || item.id === 'studentMoreButton'));
    const crumb = document.getElementById('crumb'); if (crumb) crumb.textContent = 'Central de Questões';
    global.closeMobileSidebar?.();
    activeTab = TABS.has(options.tab) ? options.tab : (global.location.pathname === ROUTE ? tabFromLocation() : activeTab);
    if (global.location.pathname !== ROUTE) global.history.pushState({ centralQuestions: true, tab: activeTab }, '', routeForTab(activeTab));
    else if (options.replace === true) global.history.replaceState({ centralQuestions: true, tab: activeTab }, '', routeForTab(activeTab));
    switchTab(activeTab, false);
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
  function filterListButton(filter, simple = false) {
    const stats = statsFor(filter);
    const title = simple ? catalogFilterTitle(filter) : `${filter.code} · ${filter.title}`;
    const content = `<span class="bcq-page-platform" data-platform="${filter.platform}">${filter.platform === 'qc' ? 'QC' : 'TEC'}</span><span><b>${esc(title)}</b><small>${filter.count.toLocaleString('pt-BR')} questões · ID ${esc(filter.id)}${filter.status === 'unavailable' ? ' · indisponível' : ''}</small></span><strong aria-label="${stats.percent == null ? 'Sem resultados registrados' : stats.percent + '% de acertos'}">${stats.percent == null ? '—' : `${stats.percent}%`}</strong>`;
    if (simple) {
      return filter.status === 'available'
        ? `<a class="bcq-page-filter" href="${attr(filter.url)}" target="_blank" rel="noopener noreferrer" title="Abrir filtro no ${filter.platform === 'qc' ? 'QConcursos' : 'TEC Concursos'}">${content}</a>`
        : `<span class="bcq-page-filter" aria-disabled="true">${content}</span>`;
    }
    return `<button type="button" class="bcq-page-filter${selectedKey === filter.stableKey ? ' active' : ''}" data-bcq-select="${attr(filter.stableKey)}">${content}</button>`;
  }
  function historyRow(entry) {
    const { filter, session } = entry;
    return `<article class="bcq-center-history-row"><span class="bcq-page-platform" data-platform="${filter.platform}">${filter.platform === 'qc' ? 'QC' : 'TEC'}</span><div><b>${esc(filter.code)} · ${esc(filter.title)}</b><small>${esc(filter.discipline)} · ${esc(filter.module)} · ${fmtDate(session.date)}</small></div><span>${session.answered} respondidas</span><span>${session.correct} acertos</span><span>${session.answered - session.correct} erros</span><strong>${percent(session.answered, session.correct)}%</strong><div><button type="button" data-bcq-history-edit="${attr(session.id)}" data-bcq-history-key="${attr(filter.stableKey)}">Editar</button><button type="button" data-bcq-history-delete="${attr(session.id)}" data-bcq-history-key="${attr(filter.stableKey)}">Excluir</button></div></article>`;
  }
  function renderOverview(page) {
    const filters = uniqueFilters();
    const totals = aggregateFilters(filters);
    const sessions = allSessionEntries();
    const qc = filters.filter((filter) => filter.platform === 'qc');
    const tec = filters.filter((filter) => filter.platform === 'tec');
    const overview = page.querySelector('[data-bcq-panel="overview"]');
    overview.innerHTML = `<div class="bcq-center-stats"><article><span>Questões resolvidas</span><b>${totals.answered.toLocaleString('pt-BR')}</b><small>Em ${totals.sessions} sessões</small></article><article><span>Acertos</span><b>${totals.correct.toLocaleString('pt-BR')}</b><small>${totals.errors.toLocaleString('pt-BR')} erros</small></article><article><span>Aproveitamento</span><b>${percent(totals.answered, totals.correct) == null ? '—' : `${percent(totals.answered, totals.correct)}%`}</b><small>Média acumulada</small></article><article><span>Cadernos únicos</span><b>${filters.filter((filter) => filter.status === 'available').length}</b><small>${registry.length} vínculos nos módulos</small></article></div>
      <div class="bcq-overview-grid"><section class="bcq-center-panel"><header><div><span>DESEMPENHO</span><h2>Evolução das sessões</h2></div><button type="button" data-bcq-go-tab="history">Ver histórico</button></header>${evolutionSvg(sessions.map((entry) => entry.session), 'all')}</section><section class="bcq-center-panel"><header><div><span>PLATAFORMAS</span><h2>Biblioteca de filtros</h2></div></header><div class="bcq-platform-summary"><article data-platform="qc"><b>${qc.length}</b><span>QConcursos</span><small>${aggregateFilters(qc).sessions} sessões</small></article><article data-platform="tec"><b>${tec.length}</b><span>TEC Concursos</span><small>${aggregateFilters(tec).sessions} sessões</small></article></div></section></div>
      <section class="bcq-center-panel"><header><div><span>ATIVIDADE RECENTE</span><h2>Últimas sessões</h2></div><button type="button" data-bcq-go-tab="history">Ver todas</button></header>${sessions.length ? `<div class="bcq-center-history">${sessions.slice(0, 5).map(historyRow).join('')}</div>` : '<div class="bcq-empty">Nenhuma sessão registrada. Use o botão + em um filtro para começar.</div>'}</section>`;
  }
  function disciplineDetails(host) {
    return Array.from(host?.querySelectorAll('.bcq-discipline') || []);
  }
  function syncDisciplineToggle(host) {
    const toggle = host?.querySelector('[data-bcq-toggle-disciplines]');
    if (!toggle) return;
    const expanded = disciplineDetails(host).some((item) => item.open);
    toggle.textContent = expanded ? 'Recolher disciplinas' : 'Expandir disciplinas';
    toggle.setAttribute('aria-expanded', String(expanded));
  }
  function setDisciplinesExpanded(host, expanded) {
    disciplineDetails(host).forEach((item) => { item.open = expanded; disciplineOpenState.set(item.dataset.bcqDiscipline, expanded); });
    syncDisciplineToggle(host);
  }
  function bindDisciplineControls(host) {
    const toggle = host.querySelector('[data-bcq-toggle-disciplines]');
    toggle?.addEventListener('click', (event) => {
      event.preventDefault();
      event.stopPropagation();
      setDisciplinesExpanded(host, !disciplineDetails(host).some((item) => item.open));
    });
    host.querySelectorAll('.bcq-discipline > summary,.bcq-discipline-module > summary').forEach((summary) => {
      summary.addEventListener('click', (event) => {
        event.preventDefault();
        event.stopPropagation();
        const details = summary.parentElement;
        details.open = !details.open;
        if (details.classList.contains('bcq-discipline')) disciplineOpenState.set(details.dataset.bcqDiscipline, details.open);
        if (details.classList.contains('bcq-discipline-module')) moduleOpenState.set(details.dataset.bcqModule, details.open);
        summary.setAttribute('aria-expanded', String(details.open));
        syncDisciplineToggle(host);
      });
    });
  }
  function renderDisciplines(page) {
    const groups = new Map();
    registry.forEach((filter) => {
      if (!groups.has(filter.disciplineKey)) groups.set(filter.disciplineKey, { label: filter.discipline, modules: new Map() });
      const modules = groups.get(filter.disciplineKey).modules;
      if (!modules.has(filter.module)) modules.set(filter.module, []);
      modules.get(filter.module).push(filter);
    });
    const host = page.querySelector('[data-bcq-panel="disciplines"]');
    host.innerHTML = `<section class="bcq-center-panel"><header><div><span>CATÁLOGO COMPLETO</span><h2>Disciplinas e módulos</h2><p>Os mesmos filtros exibidos no final de cada módulo.</p></div><button type="button" data-bcq-toggle-disciplines aria-expanded="true">Recolher disciplinas</button></header><div class="bcq-discipline-list">${Array.from(groups.values()).map((group, index) => {
      const filters = Array.from(group.modules.values()).flat();
      const unique = new Map(filters.map((filter) => [filter.stableKey, filter]));
      const totals = Array.from(unique.values()).reduce((sum, filter) => {
        const stats = statsFor(filter);
        sum.answered += stats.answered;
        sum.correct += stats.correct;
        return sum;
      }, { answered: 0, correct: 0 });
      const accuracy = percent(totals.answered, totals.correct);
      return `<details class="bcq-discipline" data-bcq-discipline="${esc(Array.from(groups.keys())[index])}"${(disciplineOpenState.has(Array.from(groups.keys())[index]) ? disciplineOpenState.get(Array.from(groups.keys())[index]) : index === 0) ? ' open' : ''}><summary><span><b>${esc(CATALOG_DISCIPLINE_LABELS[group.label] || group.label)}</b><small>${group.modules.size} módulos com filtros</small></span><strong>${accuracy === null ? "—" : accuracy + "%"} acertos <span aria-hidden="true">·</span> ${filters.length} filtros</strong></summary><div>${Array.from(group.modules.entries()).map(([module, rows]) => {
        const qc = rows.filter((row) => row.platform === 'qc');
        const tec = rows.filter((row) => row.platform === 'tec');
        const platformColumn = (platform, items) => `<section class="bcq-discipline-platform" data-platform="${platform}"><header><span class="bcq-page-platform" data-platform="${platform}">${platform === 'qc' ? 'QC' : 'TEC'}</span><div><b>${platform === 'qc' ? 'QConcursos' : 'TEC Concursos'}</b><small>${items.length} ${items.length === 1 ? 'filtro' : 'filtros'}</small></div></header><div class="bcq-discipline-platform-list">${items.length ? items.map((item) => filterListButton(item, true)).join('') : '<p class="bcq-discipline-platform-empty">Nenhum filtro neste módulo.</p>'}</div></section>`;
        return `<details class="bcq-discipline-module" data-bcq-module="${esc(Array.from(groups.keys())[index] + "|" + module)}"${moduleOpenState.get(Array.from(groups.keys())[index] + "|" + module) ? " open" : ""}><summary><div class="bcq-discipline-module-title"><b>${esc(module)}</b><strong>${esc(catalogModuleTitle(rows))}</strong></div><span>${qc.length} QC · ${tec.length} TEC</span></summary><div class="bcq-discipline-columns">${platformColumn('qc', qc)}${platformColumn('tec', tec)}</div></details>`;
      }).join('')}</div></details>`;
    }).join('')}</div></section>`;
    bindDisciplineControls(host);
    syncDisciplineToggle(host);
  }
  function renderFilterLibrary(page) {
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
    if (!selectedKey || !items.some((item) => item.stableKey === selectedKey)) selectedKey = items[0].stableKey;
    host.innerHTML = Array.from(groups.values()).map((group) => `<section class="bcq-page-group"><header><b>${esc(group.discipline)}</b><span>${esc(group.module)}</span></header><div>${group.filters.map(filterListButton).join('')}</div></section>`).join('');
    renderDetail(items.find((item) => item.stableKey === selectedKey) || items[0]);
  }
  function renderHistory(page) {
    const sessions = allSessionEntries();
    page.querySelector('[data-bcq-panel="history"]').innerHTML = `<section class="bcq-center-panel"><header><div><span>EVOLUÇÃO</span><h2>Desempenho por sessão</h2><p>Percentual das últimas tentativas em ordem cronológica.</p></div></header>${evolutionSvg(sessions.map((entry) => entry.session), 'all')}</section><section class="bcq-center-panel"><header><div><span>SESSÕES REGISTRADAS</span><h2>Histórico completo</h2><p>Somente os resultados do usuário autenticado.</p></div></header>${sessions.length ? `<div class="bcq-center-history">${sessions.map(historyRow).join('')}</div>` : '<div class="bcq-empty">Seu histórico aparecerá após o primeiro registro.</div>'}</section>`;
  }
  function renderReview(page) {
    const rows = uniqueFilters().map((filter) => ({ filter, stats: statsFor(filter) })).filter((item) => item.stats.answered > 0).sort((a, b) => a.stats.percent - b.stats.percent || b.stats.answered - a.stats.answered);
    page.querySelector('[data-bcq-panel="review"]').innerHTML = `<section class="bcq-center-panel"><header><div><span>PRIORIDADE DE ESTUDO</span><h2>Revisão por desempenho</h2><p>Filtros com menor aproveitamento aparecem primeiro.</p></div></header>${rows.length ? `<div class="bcq-review-list">${rows.map(({ filter, stats }) => `<article data-platform="${filter.platform}"><span class="bcq-page-platform" data-platform="${filter.platform}">${filter.platform === 'qc' ? 'QC' : 'TEC'}</span><div><b>${esc(filter.code)} · ${esc(filter.title)}</b><small>${esc(filter.discipline)} · ${stats.answered} respondidas · ${stats.errors} erros</small></div>${ringMarkup(stats.percent)}<div><a${filter.status === 'available' ? ` href="${attr(filter.url)}" target="_blank" rel="noopener noreferrer"` : ' aria-disabled="true"'}>${filter.status === 'available' ? 'Abrir filtro ↗' : 'Indisponível'}</a><button type="button" data-bcq-add="${attr(filter.stableKey)}">+</button></div></article>`).join('')}</div>` : '<div class="bcq-empty">Registre sessões para que a Central identifique suas prioridades de revisão.</div>'}</section>`;
  }
  function renderPage() {
    const page = document.getElementById('questionFiltersView');
    if (!page || page.classList.contains('hidden')) return;
    syncDisciplineOptions();
    const filters = uniqueFilters();
    const total = page.querySelector('[data-bcq-page-total]');
    if (total) total.innerHTML = `<b>${registry.length}</b><span>vínculos de filtros</span>`;
    if (activeTab === 'overview') renderOverview(page);
    else if (activeTab === 'disciplines') renderDisciplines(page);
    else if (activeTab === 'filters') renderFilterLibrary(page);
    else if (activeTab === 'history') renderHistory(page);
    else if (activeTab === 'review') renderReview(page);
    page.querySelectorAll('[data-bcq-tab]').forEach((button) => {
      const active = button.dataset.bcqTab === activeTab;
      button.classList.toggle('active', active);
      button.setAttribute('aria-selected', String(active));
      button.setAttribute('tabindex', active ? '0' : '-1');
    });
    page.querySelectorAll('[data-bcq-panel]').forEach((panel) => { panel.hidden = panel.dataset.bcqPanel !== activeTab; });
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
    host.innerHTML = `<header class="bcq-detail-head"><span>${filter.platformLabel}${filter.status === 'unavailable' ? ' · INDISPONÍVEL' : ''}</span><h2>${esc(filter.code)} · ${esc(filter.title)}</h2><p>${esc(filter.discipline)} · ${esc(filter.module)} · ID ${esc(filter.id)} · ${filter.count.toLocaleString('pt-BR')} questões</p><div>${filter.status === 'available' ? `<a href="${attr(filter.url)}" target="_blank" rel="noopener noreferrer">Abrir caderno original ↗</a>` : '<span class="bcq-unavailable">Link temporariamente indisponível</span>'}<button type="button" data-bcq-add="${attr(filter.stableKey)}">+ Registrar resultado</button>${canManageFilters ? `<button type="button" class="bcq-manage" data-bcq-manage="${attr(filter.stableKey)}">Gerenciar filtro</button>` : ''}</div></header>
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

  function openAdminModal(filter) {
    if (!canManageFilters || !filter) return;
    injectAdminModal(); adminFilter = filter;
    const modal = document.getElementById('bcqAdminModal');
    const form = modal.querySelector('[data-bcq-admin-form]');
    form.elements.stableKey.value = filter.stableKey;
    form.elements.title.value = filter.title;
    form.elements.count.value = filter.count;
    form.elements.url.value = filter.url;
    form.elements.status.value = filter.status;
    form.querySelector('[data-bcq-admin-error]').textContent = '';
    modal.hidden = false; document.documentElement.classList.add('bcq-modal-open');
    setTimeout(() => form.elements.title.focus(), 0);
  }
  function closeAdminModal() {
    const modal = document.getElementById('bcqAdminModal');
    if (!modal) return;
    modal.hidden = true; adminFilter = null;
    if (document.getElementById('bcqSessionModal')?.hidden !== false) document.documentElement.classList.remove('bcq-modal-open');
  }
  async function submitAdminModal(event) {
    event.preventDefault();
    if (!canManageFilters || !adminFilter) return;
    const form = event.currentTarget;
    const error = form.querySelector('[data-bcq-admin-error]');
    const count = Number(form.elements.count.value);
    const data = {
      title: String(form.elements.title.value || '').trim(),
      count,
      url: String(form.elements.url.value || '').trim(),
      status: form.elements.status.value
    };
    if (data.title.length < 2) { error.textContent = 'Informe um título válido.'; return; }
    if (!Number.isSafeInteger(count) || count < 1) { error.textContent = 'Informe uma quantidade válida.'; return; }
    if (!safeUrl(data.url, adminFilter.platform)) { error.textContent = `Use um link válido do ${adminFilter.platformLabel}.`; return; }
    const submit = form.querySelector('button[type="submit"]');
    submit.disabled = true; submit.textContent = 'Salvando…'; error.textContent = '';
    try {
      const response = await fetch('/api/external-question-filters', {
        method: 'PUT', credentials: 'same-origin', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stableKey: adminFilter.stableKey, revision: adminFilter.revision || 0, data })
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.error || 'Não foi possível salvar o filtro.');
      sharedOverrides.set(result.override.stableKey, result.override);
      registrySignature = '';
      closeAdminModal(); refreshAll();
    } catch (reason) {
      error.textContent = reason?.message || 'Não foi possível salvar o filtro.';
    } finally {
      submit.disabled = false; submit.textContent = 'Salvar alterações';
    }
  }

  function onClick(event) {
    const tab = event.target.closest('[data-bcq-tab]');
    if (tab) { switchTab(tab.dataset.bcqTab); return; }
    const goTab = event.target.closest('[data-bcq-go-tab]');
    if (goTab) { switchTab(goTab.dataset.bcqGoTab); return; }
    const toggleDisciplines = event.target.closest('[data-bcq-toggle-disciplines]');
    if (toggleDisciplines) {
      const host = toggleDisciplines.closest('[data-bcq-panel="disciplines"]');
      setDisciplinesExpanded(host, !disciplineDetails(host).some((item) => item.open));
      return;
    }
    const add = event.target.closest('[data-bcq-add]');
    if (add) { event.preventDefault(); openModal(filterByKey(add.getAttribute('data-bcq-add')), null); return; }
    const select = event.target.closest('[data-bcq-select]');
    if (select) { selectedKey = select.getAttribute('data-bcq-select'); switchTab('filters'); return; }
    const manage = event.target.closest('[data-bcq-manage]');
    if (manage) { openAdminModal(filterByKey(manage.getAttribute('data-bcq-manage'))); return; }
    const edit = event.target.closest('[data-bcq-edit]');
    if (edit) {
      const filter = filterByKey(selectedKey); const session = filter && sessionsFor(filter).find((row) => row.id === edit.getAttribute('data-bcq-edit'));
      if (filter && session) openModal(filter, session); return;
    }
    const remove = event.target.closest('[data-bcq-delete]');
    if (remove) {
      const filter = filterByKey(selectedKey); const session = filter && sessionsFor(filter).find((row) => row.id === remove.getAttribute('data-bcq-delete'));
      if (filter && session && global.confirm(`Excluir o registro de ${fmtDate(session.date)}?`)) { deleteSession(filter, session); refreshAll(); }
      return;
    }
    const historyEdit = event.target.closest('[data-bcq-history-edit]');
    if (historyEdit) {
      const filter = filterByKey(historyEdit.getAttribute('data-bcq-history-key'));
      const session = filter && sessionsFor(filter).find((row) => row.id === historyEdit.getAttribute('data-bcq-history-edit'));
      if (filter && session) { selectedKey = filter.stableKey; openModal(filter, session); }
      return;
    }
    const historyDelete = event.target.closest('[data-bcq-history-delete]');
    if (historyDelete) {
      const filter = filterByKey(historyDelete.getAttribute('data-bcq-history-key'));
      const session = filter && sessionsFor(filter).find((row) => row.id === historyDelete.getAttribute('data-bcq-history-delete'));
      if (filter && session && global.confirm(`Excluir o registro de ${fmtDate(session.date)}?`)) deleteSession(filter, session);
    }
  }
  function refreshAll() {
    refreshRegistry(); injectNavigation(); injectPage(); injectAdminModal(); mountModules(); renderPage();
    if (selectedKey) renderDetail(filterByKey(selectedKey));
  }
  function scheduleRefresh() {
    if (scheduled) return;
    scheduled = true;
    global.requestAnimationFrame(() => { scheduled = false; refreshAll(); });
  }
  function init() {
    ensureLegacyTecIds(); refreshRegistry(); injectNavigation(); injectPage(); injectModal(); injectAdminModal(); mountModules();
    document.addEventListener('click', (event) => {
      const target = event.target instanceof Element ? event.target : event.target?.parentElement;
      if (!target || !document.getElementById('questionFiltersView') || document.getElementById('questionFiltersView').classList.contains('hidden')) return;
      const outsideNav = target.closest('#centralSidebar .nav button, #studentMorePanel button, .top-actions button[onclick*="openHome"]');
      if (!outsideNav || outsideNav.matches('[data-bcq-nav]')) return;
      // Liberar a rota e ocultar a Central de Questões antes da navegação original.
      document.getElementById('questionFiltersView').classList.add('hidden');
      document.getElementById('questionFiltersView').classList.remove('central-view-visible');
      if (global.location.pathname === ROUTE) global.history.replaceState({ centralQuestions: false }, '', '/');
    }, true);
    document.addEventListener('click', onClick);
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && !document.getElementById('bcqSessionModal')?.hidden) closeModal();
      if (event.key === 'Escape' && !document.getElementById('bcqAdminModal')?.hidden) closeAdminModal();
    });
    document.addEventListener('central:discipline-ready', scheduleRefresh);
    global.addEventListener('central-cloud-applied', scheduleRefresh);
    global.addEventListener('central:external-filter-catalog-ready', scheduleRefresh);
    global.addEventListener('central:external-filter-history-changed', scheduleRefresh);
    global.addEventListener('popstate', () => {
      if (global.location.pathname === ROUTE) openPage(document.querySelector('[data-bcq-nav]'), { replace: true, tab: tabFromLocation() });
      else if (!document.getElementById('questionFiltersView')?.classList.contains('hidden')) global.openHome?.();
    });
    new MutationObserver((records) => {
      records.forEach((record) => restoreMissingModuleFallbacks(record.target instanceof Element ? record.target : record.target.parentElement));
      const externalMutation = records.some((record) => {
        const target = record.target instanceof Element ? record.target : record.target.parentElement;
        return !target?.closest('#questionFiltersView,#bcqSessionModal,#bcqAdminModal,[data-bcq-module-panel]');
      });
      if (externalMutation) scheduleRefresh();
    }).observe(document.documentElement, { childList: true, subtree: true });
    if (typeof global.fetch === 'function') loadSharedOverrides(); else overridesLoaded = true;
    if (global.location.pathname === ROUTE) setTimeout(() => openPage(document.querySelector('[data-bcq-nav]'), { replace: true, tab: tabFromLocation() }), 0);
  }

  global.ExternalQuestionFilters = {
    buildRegistry, refresh: refreshAll, openPage, openModal,
    sessionsFor, statsFor, saveSession, deleteSession,
    get canManage() { return canManageFilters; },
    get overridesReady() { return overridesLoaded; },
    validate(values) {
      const answered = Number(values?.answered), correct = Number(values?.correct);
      return validDate(values?.date) && Number.isInteger(answered) && answered > 0 && Number.isInteger(correct) && correct >= 0 && correct <= answered;
    },
    keys: { store: STORE_KEY, legacyTec: LEGACY_TEC_KEY }
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
  else init();
})(window);
