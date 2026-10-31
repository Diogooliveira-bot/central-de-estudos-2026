// Simula, para testes de navegador, a entrega de conteúdo protegido ao plano
// gratuito exatamente com as projeções de lib/protected-content.js usadas por
// lib/private-content-handler.js em Production (sem sessão nem banco).
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import vm from 'node:vm';
import { gunzipSync, gzipSync } from 'node:zlib';
import { adminSummaryScript, cppSummaryScript, freeSummaryScript, portugueseSummaryScript, projectPackedSummary, projectPortugueseAutodidataSummary, protectedAsset } from '../../lib/protected-content.js';

const JS = 'application/javascript; charset=utf-8';
const LOCKED_FILES = {
  '/content/tec-cadernos-data.js': "window.TEC_CADERNOS_DATA={schemaVersion:1,pastaTec:'',planejados:0,vinculados:0,cadernos:[],locked:true};",
  '/content/qc-sharing-links.js': 'window.QC_CENTRAL_SHARING_LINKS={schemaVersion:1,locked:true,items:[]};',
  '/content/qc-notebook-catalog.js': 'window.QC_NOTEBOOK_CATALOG={schemaVersion:1,locked:true,notebooks:[]};',
  '/content/cpc/cpc-sharing-links.js': 'window.CPC_SHARING_LINKS={schemaVersion:1,locked:true,modules:{}};',
};

function run(source) {
  const sandbox = {};
  sandbox.window = sandbox;
  sandbox.global = sandbox;
  try {
    new vm.Script(String(source)).runInNewContext(sandbox, { timeout: 1500 });
    return sandbox;
  } catch (_) {
    return null;
  }
}

/** Returns null for public assets, or {status,type,body} as Production would answer a free student. */
export async function freePlanAsset(root, path) {
  const policy = protectedAsset(path);
  if (!policy) return null;
  if (policy.kind === 'lei-em-dia' || policy.kind === 'blocked') return { status: 404, type: 'application/json', body: '{}' };
  let data;
  try { data = await readFile(resolve(root, '.' + path)); } catch (_) { return { status: 404, type: 'application/json', body: '{}' }; }
  const ok = body => body ? { status: 200, type: JS, body } : { status: 503, type: 'application/json', body: '{}' };
  if (policy.kind === 'portuguese-native') {
    const sandbox = run(data.toString('utf8'));
    return ok(portugueseSummaryScript(policy.moduleId, sandbox?.PT_NATIVE_DATA?.[policy.moduleId]));
  }
  if (policy.kind === 'portuguese-course-data') {
    const records = JSON.parse(gunzipSync(Buffer.from(data.toString('utf8').trim(), 'base64')).toString('utf8'));
    const summary = projectPortugueseAutodidataSummary(records);
    return summary ? { status: 200, type: 'text/plain; charset=utf-8', body: gzipSync(Buffer.from(JSON.stringify(summary))).toString('base64') } : ok('');
  }
  if (policy.kind === 'packed-native') {
    const variable = policy.discipline === 'civil' ? 'CIVIL_NATIVE_PACKED_B64' : 'CPP_NATIVE_PACKED_B64';
    const packed = run(data.toString('utf8'))?.[variable];
    if (typeof packed !== 'string') return ok('');
    const safe = projectPackedSummary(JSON.parse(gunzipSync(Buffer.from(packed, 'base64')).toString('utf8')));
    return ok(safe && `window.${variable}=${JSON.stringify(gzipSync(Buffer.from(JSON.stringify(safe))).toString('base64'))};`);
  }
  if (policy.kind === 'file') {
    if (LOCKED_FILES[path]) return ok(LOCKED_FILES[path]);
    if (path === '/content/qc-sharing-links.json') return { status: 200, type: 'application/json', body: '{"schemaVersion":1,"locked":true,"items":[]}' };
    if (path === '/content/cpp/cpp-native-index.js') {
      const index = run(data.toString('utf8'))?.CPP_NATIVE_INDEX;
      if (!index || !Array.isArray(index.modules)) return ok('');
      const safe = { ...index, modules: index.modules.map(({ tec, tecs, url, ...module }) => module) };
      delete safe.tecs;
      return ok('window.CPP_NATIVE_INDEX=' + JSON.stringify(safe) + ';');
    }
    return { status: 403, type: 'application/json', body: '{"error":"Este material é exclusivo do Base Completa Premium"}' };
  }
  if (['native', 'admin-lite', 'cpp-course'].includes(policy.kind)) {
    const sandbox = run(data.toString('utf8'));
    return ok(policy.kind === 'native'
      ? sandbox && freeSummaryScript(policy.discipline, policy.moduleKey, sandbox.BASE_NATIVE_CONTENT?.[policy.discipline]?.[policy.moduleKey])
      : policy.kind === 'admin-lite'
        ? sandbox && adminSummaryScript(sandbox.ADM_NATIVE_CONTENT)
        : sandbox && cppSummaryScript(sandbox.CPP_COURSE_MODULES));
  }
  return { status: 403, type: 'application/json', body: '{"error":"Este material é exclusivo do Base Completa Premium"}' };
}
