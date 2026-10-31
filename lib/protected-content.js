const DISCIPLINES = new Set(['adm', 'cf', 'civil', 'cpc', 'cpp', 'penal', 'portugues', 'rlm']);
const LED_ASSETS = new Set([
  '/lei-em-dia-aprovadas-20261012.js',
  '/tools/decorando-data-led-aprovadas.js',
]);
const QC_ASSETS = new Set([
  '/content/cpc/cpc-sharing-links.js',
  '/ui/cpc-sharing-links.js',
  '/content/qc-sharing-links.json',
  '/content/qc-sharing-links.js',
  '/content/qc-notebook-catalog.js',
]);
const TEC_ASSETS = new Set([
  '/content/penal-cpp-tec-links.js',
  '/ui/tec-penal-cpp-links.js',
  '/portugues-tec-data-v1.js',
  '/content/tec-cadernos-data.js',
  '/content/adm/adm-sharing-links.js',
  '/content/civil/civil-sharing-links.js',
  '/content/cpp/cpp-native-index.js',
  '/cpp-course-core-v1.js',
  '/portugues-m2-tec-link-v1.js',
  '/portugues-m11-runtime-v1.js',
  '/portugues-m11-runtime-v2.js',
  '/tools/cronograma.html',
  '/tools/rlm.html',
  '/portugues-m3-preview-v1.html',
  '/audits/qc-integral-20261019/PROGRESSO_CRIACAO_57.json',
  '/audits/qc-integral-20261019/fontes/qc_todos_cadernos_416.json',
]);

/** Returns the server-side authorization class for a known paid asset. */
export function protectedAsset(pathname) {
  let path = String(pathname || '').split('?')[0];
  try { path = decodeURIComponent(path); } catch (_) { return null; }
  if (path === '/Central_de_Estudos_v6.6.75_PLANO_6_MESES.zip' || path.startsWith('/Central_de_Estudos_OFFLINE_FUNCIONAL/')) {
    return { kind: 'blocked' };
  }
  if (LED_ASSETS.has(path)) return { kind: 'lei-em-dia', feature: 'lei_em_dia' };
  if (QC_ASSETS.has(path)) return { kind: 'file', feature: 'qc.links' };
  if (TEC_ASSETS.has(path)) return { kind: 'file', feature: 'tec.links' };
  if (/^\/content\/(?:[^/]+\/)?[^/]*sharing-links\.js$/i.test(path)) {
    return { kind: 'file', feature: /qc|cpc/i.test(path) ? 'qc.links' : 'tec.links' };
  }
  // Legacy ADM bundle contains full course modules 9–20 and must never be public.
  if (/^\/adm-m9-m20-bundle-v\d+\.js$/i.test(path)) return { kind: 'file', feature: 'theory.complete' };
  if (/^\/central-structural-v\d+\/civil-course-\d+\.js$/i.test(path)) {
    return { kind: 'file', feature: 'theory.complete' };
  }
  if (/^\/portugues-m\d+-runtime-v\d+\.js$/i.test(path) && /^(?:\/portugues-m1[1-7]-runtime-v\d+\.js)$/i.test(path)) {
    return { kind: 'file', feature: 'tec.links' };
  }

  const native = path.match(/^\/content\/([a-z0-9-]+)\/(m\d{2})-native-data(?:-part\d+)?\.js$/i);
  if (native && DISCIPLINES.has(native[1].toLowerCase())) {
    return { kind: 'native', feature: 'theory.complete', discipline: native[1].toLowerCase(), moduleKey: native[2].toLowerCase() };
  }
  // The twenty new, long-form ADM apostilas are Premium-only at source, not just in UI.
  if (/^\/content\/adm\/m(?:0[1-9]|1\d|20)-approved-complete\.js$/i.test(path)) {
    return { kind: 'file', feature: 'theory.complete' };
  }
  const adminLite = path.match(/^\/content\/adm\/(m\d{2})-native-data-lite\.js$/i);
  if (adminLite) return { kind: 'admin-lite', feature: 'theory.complete', moduleKey: adminLite[1].toLowerCase() };
  const cppCourse = path.match(/^\/cpp-course-data-\d+\.js$/i);
  if (cppCourse) return { kind: 'cpp-course', feature: 'theory.complete' };
  if (path === '/content/civil/civil-native-content-packed.js' || path === '/content/cpp/cpp-native-content-packed.js') {
    return { kind: 'packed-native', feature: 'theory.complete', discipline: path.includes('/civil/') ? 'civil' : 'cpp' };
  }
  if (/^\/content\/(?:cf|civil)\/m\d{2}-teoria-guiada-data\.js$/i.test(path)) {
    return { kind: 'file', feature: 'premium.reviews' };
  }
  if (/^\/content\/cf\/editorial\/m\d{2}-(?:apostila\.txt|didatico\.md|questions\.json)$/i.test(path)) {
    return { kind: 'file', feature: 'premium.reviews' };
  }
  if (/^\/content\/penal\/m\d{2}-teoria-guiada-data\.js$/i.test(path)) {
    return { kind: 'file', feature: 'premium.reviews' };
  }
  if (/^\/content\/rlm-tjce-2026\/(?:aulas-[a-z-]+\.js|complementos-teoria\.js)$/i.test(path)) {
    return { kind: 'file', feature: 'theory.complete' };
  }
  if (/^\/content\/(?:civil\/civil-native-images\.js|civil\/civil-teoria-guiada-lei-seca\.js)$/i.test(path)) {
    return { kind: 'file', feature: 'premium.reviews' };
  }
  if (/^\/tools\/decorando-data-(?!led-aprovadas)[a-z0-9-]+\.js$/i.test(path)) {
    return { kind: 'file', feature: 'premium.reviews' };
  }
  if ((/^\/content\/.+\.(?:js|json)$/i.test(path) || /^\/central-structural-v\d+\/.+\.js$/i.test(path)) && /(?:question|questoes|questões|notebook|catalog)/i.test(path)) {
    return { kind: 'file', feature: 'premium.reviews' };
  }
  if (/^\/(?:penal-full-theory-data-\d+\.js|penal-full-theory-ui-v\d+\.js)$/i.test(path)
      || /^\/(?:civil-theory-module\d+(?:-part\d+|-runtime)?-v\d+\.js|cpc-theory-module\d+-v\d+\.js|adm-m\d+-theory-v\d+\.js)$/i.test(path)
      || /^\/adm-m\d+-content-p\d+-v\d+\.js$/i.test(path)
      || /^\/central-structural-v\d+\/(?:cf|penal|cpc)-questions-\d+-init\.js$/i.test(path)
      ) {
    return { kind: 'file', feature: 'theory.complete' };
  }
  const ptNative = path.match(/^\/portugues-native-data\/(m\d+)\.js$/i);
  if (ptNative) return { kind: 'portuguese-native', feature: 'theory.complete', moduleId: ptNative[1].toLowerCase() };
  if (path === '/portugues-autodidata-data.txt') return { kind: 'portuguese-course-data', feature: 'theory.complete' };
  if (/\.pdf$/i.test(path) && !path.startsWith('/assets/vademecum-pdf/')) {
    return { kind: 'file', feature: 'premium.reviews' };
  }
  return null;
}

const SAFE_SUMMARY_FIELDS = Object.freeze([
  'moduleId', 'number', 'title', 'updatedAt', 'summary', 'summaryHtml', 'mapUrl', 'lawTopicId', 'lawLabel',
]);

/** Strip full theory, local quiz banks, internal questions, and other paid fields. */
export function projectFreeSummary(record) {
  if (!record || typeof record !== 'object' || Array.isArray(record)) return null;
  const summary = {};
  for (const key of SAFE_SUMMARY_FIELDS) {
    const value = record[key];
    if (typeof value === 'string' || typeof value === 'number') summary[key] = value;
  }
  if (typeof summary.summary !== 'string' || summary.summary.length === 0) return null;
  summary.complete = 'Este recurso é exclusivo do Base Completa Premium. A teoria resumida continua disponível neste módulo.';
  return summary;
}

/** A Portuguese free-tier summary built only from authored review fields. */
export function projectPortugueseSummary(record) {
  if (!record || typeof record !== 'object' || Array.isArray(record) || !Array.isArray(record.sections)) return null;
  const sections = record.sections.map(section => {
    if (!section || typeof section !== 'object') return null;
    const remember = Array.isArray(section.remember)
      ? section.remember.filter(item => typeof item === 'string' && item.trim()).map(item => item.trim())
      : [];
    return {
      id: String(section.id || ''),
      title: String(section.title || ''),
      priority: String(section.priority || ''),
      goal: String(section.goal || ''),
      remember,
      html: '',
    };
  }).filter(section => section && section.id && (section.remember.length || section.priority || section.goal));
  if (!sections.length) return null;
  return { id: String(record.id || ''), title: String(record.title || ''), sections, summaryOnly: true };
}

export function portugueseSummaryScript(moduleId, record) {
  const safe = projectPortugueseSummary(record);
  return safe ? 'window.PT_NATIVE_DATA=window.PT_NATIVE_DATA||{};window.PT_NATIVE_DATA[' + JSON.stringify(moduleId) + ']=' + JSON.stringify(safe) + ';' : '';
}

function plainAuthoredText(value) {
  return String(value || '').replace(/<(script|style|button|form)\b[^>]*>[\s\S]*?<\/\1>/gi, ' ')
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;|&#160;/gi, ' ')
    .replace(/&amp;/gi, '&').replace(/&lt;/gi, '<').replace(/&gt;/gi, '>')
    .replace(/&quot;|&#34;/gi, '"').replace(/&#39;|&apos;/gi, "'")
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
    .replace(/https?:\/\/\S+/gi, '')
    .replace(/\s+/g, ' ').trim();
}

/** Derive compact free summaries from explicit course recap headings/objectives. */
export function projectPortugueseAutodidataSummary(records) {
  if (!records || typeof records !== 'object' || Array.isArray(records)) return null;
  const output = {};
  for (const [key, markup] of Object.entries(records)) {
    if (!/^m\d{2}$/.test(key) || typeof markup !== 'string') continue;
    const title = plainAuthoredText(markup.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/i)?.[1] || key);
    const rules = [];
    const headings = [...markup.matchAll(/<h([2-5])\b[^>]*>([\s\S]*?)<\/h\1>/gi)];
    for (let i = 0; i < headings.length && rules.length < 4; i++) {
      const heading = plainAuthoredText(headings[i][2]);
      if (!/(?:regra de bolso|quadro[- ]síntese|síntese|ideia central|resumo)/i.test(heading)) continue;
      const start = headings[i].index + headings[i][0].length;
      const end = headings[i + 1]?.index ?? Math.min(markup.length, start + 1800);
      const block = markup.slice(start, Math.min(end, start + 1800));
      const candidates = [...block.matchAll(/<(p|li)\b[^>]*>([\s\S]*?)<\/\1>/gi)]
        .map(match => plainAuthoredText(match[2]))
        .filter(text => text.length >= 35 && text.length <= 360);
      if (candidates[0] && !rules.includes(candidates[0])) rules.push(candidates[0]);
    }
    if (!rules.length) {
      const objective = markup.match(/<p\b[^>]*>[\s\S]{0,1200}?(?:Objetivo do módulo|Ao terminar este módulo)[\s\S]*?<\/p>/i)?.[0];
      const text = plainAuthoredText(objective || '');
      if (text.length >= 30) rules.push(text.slice(0, 320));
    }
    const safeRules = rules.slice(0, 4).map(text => '<li>' + text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;') + '</li>').join('');
    output[key] = '<article class="pt-doc pt-free-summary" data-module="' + key + '"><header class="pt-doc-header"><h1>'
      + title.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      + '</h1></header><section><h2>Resumo gratuito</h2>'
      + (safeRules ? '<ul>' + safeRules + '</ul>' : '<p>O resumo específico deste módulo ainda está sendo preparado. O material completo permanece disponível no Premium.</p>')
      + '</section><p class="pt-premium-note">Aulas completas, exercícios e revisão cumulativa são exclusivos do Base Completa Premium.</p></article>';
  }
  if (records.review) output.review = '<article class="pt-doc pt-premium-lock"><h1>Revisão cumulativa final</h1><p>Este material é exclusivo do Base Completa Premium.</p></article>';
  return Object.keys(output).length ? output : null;
}

export function freeSummaryScript(discipline, moduleKey, record) {
  const safe = projectFreeSummary(record);
  if (!safe) return '';
  return '(function(g){g.BASE_NATIVE_CONTENT=g.BASE_NATIVE_CONTENT||{};g.BASE_NATIVE_CONTENT[' + JSON.stringify(discipline) + ']=g.BASE_NATIVE_CONTENT[' + JSON.stringify(discipline) + ']||{};g.BASE_NATIVE_CONTENT[' + JSON.stringify(discipline) + '][' + JSON.stringify(moduleKey) + ']=' + JSON.stringify(safe) + ';})(window);';
}

export function projectAdminSummary(records) {
  if (!records || typeof records !== 'object' || Array.isArray(records)) return null;
  const projected = {};
  for (const [key, record] of Object.entries(records)) {
    if (!record || typeof record !== 'object' || typeof record.summaryHtml !== 'string') continue;
    projected[key] = {
      uid: String(record.uid || key),
      number: Number(record.number || 0),
      title: String(record.title || ''),
      summaryHtml: record.summaryHtml,
      completeSource: null,
    };
  }
  return Object.keys(projected).length ? projected : null;
}

export function adminSummaryScript(records) {
  const safe = projectAdminSummary(records);
  // Mescla no objeto existente: o leitor ADM mantém referência a window.ADM_NATIVE_CONTENT.
  return safe ? 'window.ADM_NATIVE_CONTENT=Object.assign(window.ADM_NATIVE_CONTENT||{},' + JSON.stringify(safe) + ');' : '';
}

export function projectCppSummary(modules) {
  if (!Array.isArray(modules)) return null;
  return modules.map(module => ({
    num: Number(module?.num || 0),
    title: String(module?.title || ''),
    summary: String(module?.summary || ''),
  })).filter(module => module.num > 0 && module.summary.length > 0);
}

export function cppSummaryScript(modules) {
  const safe = projectCppSummary(modules);
  return safe?.length ? 'window.CPP_COURSE_MODULES=' + JSON.stringify(safe) + ';' : '';
}

/** Free projection of the packed Civil/CPP course: summary only, no quizzes or full theory. */
export function projectPackedSummary(records) {
  if (!records || typeof records !== 'object' || Array.isArray(records)) return null;
  const projected = {};
  for (const [key, record] of Object.entries(records)) {
    if (!record || typeof record !== 'object' || typeof record.summaryHtml !== 'string' || !record.summaryHtml) continue;
    projected[key] = {
      ...(typeof record.uid === 'string' ? { uid: record.uid } : {}),
      ...(Number.isFinite(Number(record.number)) ? { number: Number(record.number) } : {}),
      title: String(record.title || ''),
      summaryHtml: record.summaryHtml,
      completeHtml: 'Este recurso é exclusivo do Base Completa Premium.',
      summaryQuestions: [],
      completeQuestions: [],
    };
  }
  return Object.keys(projected).length ? projected : null;
}

export function isProtectedAssetPath(pathname) {
  return protectedAsset(pathname) !== null;
}
