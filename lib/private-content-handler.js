import { readFile } from 'node:fs/promises';
import path from 'node:path';
import vm from 'node:vm';
import { gunzipSync, gzipSync } from 'node:zlib';
import { requireSession } from './auth.js';
import { canAccessFeature, getEffectivePlan } from './plan-access.js';
import { adminSummaryScript, cppSummaryScript, freeSummaryScript, portugueseSummaryScript, projectPackedSummary, projectPortugueseAutodidataSummary, protectedAsset } from './protected-content.js';

function send(res, status, body, type = 'application/json; charset=utf-8') {
  res.statusCode = status;
  res.setHeader('Content-Type', type);
  res.setHeader('Cache-Control', 'private, no-store, no-cache, max-age=0');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Vary', 'Cookie');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Cross-Origin-Resource-Policy', 'same-origin');
  res.end(typeof body === 'string' || Buffer.isBuffer(body) ? body : JSON.stringify(body));
}

async function readAsset(asset) {
  const relative = String(asset || '').replace(/^\/+/, '');
  const root = path.resolve(process.cwd());
  const target = path.resolve(root, relative);
  if (!target.startsWith(root + path.sep)) return null;
  return readFile(target);
}

function executeDataScript(source) {
  const sandbox = {};
  sandbox.window = sandbox;
  sandbox.global = sandbox;
  try {
    new vm.Script(String(source), { filename: 'private-native-content.js' })
      .runInNewContext(sandbox, { timeout: 150 });
    return sandbox;
  } catch (_) {
    return null;
  }
}

export default async function handler(req, res) {
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    res.setHeader('Allow', 'GET, HEAD');
    return send(res, 405, { error: 'Método não permitido' });
  }
  const asset = String(req.query?.asset || '');
  const policy = protectedAsset(asset);
  if (!policy || policy.kind === 'lei-em-dia' || policy.kind === 'blocked') return send(res, 404, { error: 'Conteúdo não encontrado' });

  try {
    const session = await requireSession(req, ['admin', 'editor', 'aluno']);
    if (!session.ok) return send(res, session.status, { error: session.error });
    const plan = await getEffectivePlan(session.sql, session.user.id);
    if (plan.status === 'inactive') return send(res, 401, { error: 'Conta inativa' });

    const data = await readAsset(asset);
    if (!data) return send(res, 404, { error: 'Conteúdo não encontrado' });

    if (policy.kind === 'portuguese-native' && plan.plan === 'free') {
      if (!(await canAccessFeature(session.sql, session.user, 'theory.summary'))) {
        return send(res, 403, { error: 'Resumo indisponível no plano atual' });
      }
      const sandbox = executeDataScript(data.toString('utf8'));
      const record = sandbox?.PT_NATIVE_DATA?.[policy.moduleId];
      const projected = portugueseSummaryScript(policy.moduleId, record);
      if (!projected) return send(res, 503, { error: 'Resumo de Português indisponível para este módulo' });
      return send(res, 200, projected, 'application/javascript; charset=utf-8');
    }

    if (policy.kind === 'portuguese-course-data' && plan.plan === 'free') {
      if (!(await canAccessFeature(session.sql, session.user, 'theory.summary'))) {
        return send(res, 403, { error: 'Resumo indisponível no plano atual' });
      }
      const records = JSON.parse(gunzipSync(Buffer.from(data.toString('utf8').trim(), 'base64')).toString('utf8'));
      const summary = projectPortugueseAutodidataSummary(records);
      if (!summary) return send(res, 503, { error: 'Resumo gratuito de Português indisponível' });
      return send(res, 200, gzipSync(Buffer.from(JSON.stringify(summary), 'utf8')).toString('base64'), 'text/plain; charset=utf-8');
    }

    if (policy.kind === 'packed-native' && plan.plan === 'free') {
      if (!(await canAccessFeature(session.sql, session.user, 'theory.summary'))) {
        return send(res, 403, { error: 'Resumo indisponível no plano atual' });
      }
      const sandbox = executeDataScript(data.toString('utf8'));
      const variable = policy.discipline === 'civil' ? 'CIVIL_NATIVE_PACKED_B64' : 'CPP_NATIVE_PACKED_B64';
      const packed = sandbox?.[variable];
      if (typeof packed !== 'string') return send(res, 503, { error: 'Resumo indisponível para este módulo' });
      const records = JSON.parse(gunzipSync(Buffer.from(packed, 'base64')).toString('utf8'));
      const safe = projectPackedSummary(records);
      if (!safe) return send(res, 503, { error: 'Resumo indisponível para este módulo' });
      const compressed = gzipSync(Buffer.from(JSON.stringify(safe), 'utf8')).toString('base64');
      return send(res, 200, `window.${variable}=${JSON.stringify(compressed)};`, 'application/javascript; charset=utf-8');
    }

    if (policy.kind === 'file' && !plan.isStaff && !(await canAccessFeature(session.sql, session.user, policy.feature))) {
      if (asset === '/content/tec-cadernos-data.js') {
        return send(res, 200, "window.TEC_CADERNOS_DATA={schemaVersion:1,pastaTec:'',planejados:0,vinculados:0,cadernos:[],locked:true};", 'application/javascript; charset=utf-8');
      }
      if (asset === '/content/qc-sharing-links.json') {
        return send(res, 200, { schemaVersion: 1, locked: true, items: [] });
      }
      if (asset === '/content/qc-sharing-links.js') {
        return send(res, 200, 'window.QC_CENTRAL_SHARING_LINKS={schemaVersion:1,locked:true,items:[]};', 'application/javascript; charset=utf-8');
      }
      if (asset === '/content/qc-notebook-catalog.js') {
        return send(res, 200, 'window.QC_NOTEBOOK_CATALOG={schemaVersion:1,locked:true,notebooks:[]};', 'application/javascript; charset=utf-8');
      }
      if (asset === '/content/cpc/cpc-sharing-links.js') {
        return send(res, 200, 'window.CPC_SHARING_LINKS={schemaVersion:1,locked:true,modules:{}};', 'application/javascript; charset=utf-8');
      }
      if (asset === '/content/cpp/cpp-native-index.js') {
        const sandbox = executeDataScript(data.toString('utf8'));
        const index = sandbox?.CPP_NATIVE_INDEX;
        if (!index || !Array.isArray(index.modules)) return send(res, 503, { error: 'Índice indisponível' });
        const safe = { ...index, modules: index.modules.map(({ tec, tecs, url, ...module }) => module) };
        delete safe.tecs;
        return send(res, 200, 'window.CPP_NATIVE_INDEX=' + JSON.stringify(safe) + ';', 'application/javascript; charset=utf-8');
      }
      return send(res, 403, { error: 'Este material é exclusivo do Base Completa Premium' });
    }

    if (['native', 'admin-lite', 'cpp-course'].includes(policy.kind) && plan.plan === 'free') {
      if (!(await canAccessFeature(session.sql, session.user, 'theory.summary'))) {
        return send(res, 403, { error: 'Resumo indisponível no plano atual' });
      }
      const sandbox = executeDataScript(data.toString('utf8'));
      const projected = policy.kind === 'native'
        ? sandbox && freeSummaryScript(policy.discipline, policy.moduleKey, sandbox.BASE_NATIVE_CONTENT?.[policy.discipline]?.[policy.moduleKey])
        : policy.kind === 'admin-lite'
          ? sandbox && adminSummaryScript(sandbox.ADM_NATIVE_CONTENT)
          : sandbox && cppSummaryScript(sandbox.CPP_COURSE_MODULES);
      if (!projected) return send(res, 503, { error: 'Resumo indisponível para este módulo' });
      return send(res, 200, projected, 'application/javascript; charset=utf-8');
    }

    if (!plan.isStaff && !(await canAccessFeature(session.sql, session.user, policy.feature))) {
      return send(res, 403, { error: 'Este material é exclusivo do Base Completa Premium' });
    }
    if (req.method === 'HEAD') return send(res, 200, '', 'application/octet-stream');
    const extension = path.extname(asset).toLowerCase();
    const contentType = extension === '.json' ? 'application/json; charset=utf-8'
      : extension === '.pdf' ? 'application/pdf'
        : extension === '.html' ? 'text/html; charset=utf-8'
          : extension === '.zip' ? 'application/zip'
        : 'application/javascript; charset=utf-8';
    if (extension === '.pdf') res.setHeader('Content-Disposition', 'inline');
    return send(res, 200, data, contentType);
  } catch (error) {
    console.error('private content delivery failed', error);
    return send(res, 503, { error: 'Conteúdo protegido temporariamente indisponível' });
  }
}
