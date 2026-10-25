import { requireSession, readJsonBody, sameOriginRequest } from '../lib/auth.js';
import { requirePlanFeature } from '../lib/plan-access.js';

const IS_PREVIEW = process.env.VERCEL_ENV !== 'production';
const TABLE = IS_PREVIEW ? 'external_question_filter_overrides_preview' : 'external_question_filter_overrides';

function send(res, status, body) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'private, no-store');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.end(JSON.stringify(body));
}

async function ensureTable(sql) {
  if (IS_PREVIEW) {
    await sql`CREATE TABLE IF NOT EXISTS external_question_filter_overrides_preview (
      stable_key TEXT PRIMARY KEY,
      platform TEXT NOT NULL CHECK (platform IN ('qc','tec')),
      filter_id TEXT NOT NULL,
      data JSONB NOT NULL,
      revision INTEGER NOT NULL DEFAULT 1,
      editor_id TEXT NOT NULL,
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )`;
    return;
  }
  await sql`CREATE TABLE IF NOT EXISTS external_question_filter_overrides (
    stable_key TEXT PRIMARY KEY,
    platform TEXT NOT NULL CHECK (platform IN ('qc','tec')),
    filter_id TEXT NOT NULL,
    data JSONB NOT NULL,
    revision INTEGER NOT NULL DEFAULT 1,
    editor_id TEXT NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  )`;
}

function validPlatformUrl(value, platform) {
  try {
    const url = new URL(String(value || ''));
    const allowed = platform === 'qc' ? /(^|\.)qconcursos\.com$/ : /(^|\.)tecconcursos\.com\.br$/;
    return url.protocol === 'https:' && allowed.test(url.hostname);
  } catch (_) {
    return false;
  }
}

export function validateFilterOverride(body) {
  const stableKey = String(body?.stableKey || '').trim();
  const match = stableKey.match(/^(qc|tec):([a-zA-Z0-9_.:-]{1,180})$/);
  if (!match) return 'Identificador estável inválido';
  const data = body?.data;
  if (!data || typeof data !== 'object' || Array.isArray(data)) return 'Dados do filtro inválidos';
  const allowed = ['title', 'count', 'url', 'status'];
  if (Object.keys(data).some((key) => !allowed.includes(key))) return 'Campo de edição não permitido';
  if (typeof data.title !== 'string' || data.title.trim().length < 2 || data.title.length > 300) return 'Título inválido';
  if (!Number.isSafeInteger(data.count) || data.count < 1 || data.count > 100000) return 'Quantidade de questões inválida';
  if (!validPlatformUrl(data.url, match[1])) return 'O link precisa pertencer à plataforma do filtro';
  if (!['available', 'unavailable'].includes(data.status)) return 'Status de disponibilidade inválido';
  if (!Number.isSafeInteger(body.revision) || body.revision < 0) return 'Revisão inválida';
  return '';
}

export default async function handler(req, res) {
  if (!['GET', 'PUT'].includes(req.method)) {
    res.setHeader('Allow', 'GET, PUT');
    return send(res, 405, { error: 'Método não permitido' });
  }
  if (req.method !== 'GET' && !sameOriginRequest(req)) return send(res, 403, { error: 'Origem não autorizada' });
  const session = req.method === 'GET'
    ? await requirePlanFeature(req, 'tec.question_books_filters', ['admin', 'editor', 'aluno'])
    : await requireSession(req, ['admin']);
  if (!session.ok) return send(res, session.status || 403, { error: session.error || 'Acesso não autorizado' });

  try {
    const sql = session.sql;
    await ensureTable(sql);
    if (req.method === 'GET') {
      const rows = IS_PREVIEW
        ? await sql`SELECT stable_key,data,revision,updated_at FROM external_question_filter_overrides_preview ORDER BY stable_key`
        : await sql`SELECT stable_key,data,revision,updated_at FROM external_question_filter_overrides ORDER BY stable_key`;
      return send(res, 200, {
        canManage: session.user.role === 'admin',
        overrides: rows.map((row) => ({
          stableKey: row.stable_key,
          data: row.data,
          revision: Number(row.revision || 0),
          updatedAt: row.updated_at
        }))
      });
    }

    const body = await readJsonBody(req);
    const validation = validateFilterOverride(body);
    if (validation) return send(res, 400, { error: validation });
    const stableKey = String(body.stableKey).trim();
    const { data, revision } = body;
    const [platform, filterId] = stableKey.split(':');
    const encoded = JSON.stringify({
      title: data.title.trim(),
      count: data.count,
      url: data.url,
      status: data.status
    });
    const rows = IS_PREVIEW
      ? await sql`INSERT INTO external_question_filter_overrides_preview(stable_key,platform,filter_id,data,revision,editor_id)
          VALUES(${stableKey},${platform},${filterId},${encoded}::jsonb,1,${session.user.id})
          ON CONFLICT(stable_key) DO UPDATE SET data=EXCLUDED.data,revision=external_question_filter_overrides_preview.revision+1,
            editor_id=EXCLUDED.editor_id,updated_at=NOW()
          WHERE external_question_filter_overrides_preview.revision=${revision}
          RETURNING stable_key,data,revision,updated_at`
      : await sql`INSERT INTO external_question_filter_overrides(stable_key,platform,filter_id,data,revision,editor_id)
          VALUES(${stableKey},${platform},${filterId},${encoded}::jsonb,1,${session.user.id})
          ON CONFLICT(stable_key) DO UPDATE SET data=EXCLUDED.data,revision=external_question_filter_overrides.revision+1,
            editor_id=EXCLUDED.editor_id,updated_at=NOW()
          WHERE external_question_filter_overrides.revision=${revision}
          RETURNING stable_key,data,revision,updated_at`;
    if (!rows.length) return send(res, 409, { error: 'O filtro foi alterado em outra sessão. Recarregue antes de salvar.' });
    return send(res, 200, {
      ok: true,
      override: {
        stableKey: rows[0].stable_key,
        data: rows[0].data,
        revision: Number(rows[0].revision),
        updatedAt: rows[0].updated_at
      }
    });
  } catch (error) {
    console.error(`external question filters (${TABLE})`, error);
    return send(res, 500, { error: 'Não foi possível acessar as configurações dos filtros' });
  }
}
