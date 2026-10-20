import { requireSession, readJsonBody, sameOriginRequest } from '../lib/auth.js';

const EXAM_ID = 'tjp-2026-aj-area-judiciaria';
const MARKERS = new Set(['studied','reviewed','questions']);
const TOPIC_ID = /^tjp-[a-z0-9]+(?:-[a-z0-9]+)*$/;

function send(res, status, body) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  res.end(JSON.stringify(body));
}

async function ensureTable(sql) {
  await sql`
    CREATE TABLE IF NOT EXISTS central_exam_topic_progress (
      user_id TEXT NOT NULL REFERENCES central_users(user_id) ON DELETE CASCADE,
      exam_id TEXT NOT NULL,
      topic_id TEXT NOT NULL,
      marker TEXT NOT NULL CHECK (marker IN ('studied','reviewed','questions')),
      completed BOOLEAN NOT NULL DEFAULT FALSE,
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      PRIMARY KEY (user_id, exam_id, topic_id, marker)
    )
  `;
  await sql`CREATE INDEX IF NOT EXISTS central_exam_topic_progress_exam_user_idx ON central_exam_topic_progress (exam_id, user_id)`;
}

function safeTimestamp(value) {
  const time = Date.parse(value);
  const now = Date.now();
  return Number.isFinite(time) && time <= now + 300000 ? new Date(Math.max(0, time)).toISOString() : new Date(now).toISOString();
}

export default async function handler(req, res) {
  // Preview deployments inherit shared project variables unless a branch-specific
  // database has been verified. Fail closed before session lookup can touch SQL.
  if (process.env.VERCEL_ENV === 'preview' && process.env.EXAM_PROGRESS_PREVIEW_DB_ISOLATED !== 'true') {
    return send(res, 503, { error:'Sincronização do edital indisponível nesta prévia até configurar o banco isolado de homologação' });
  }
  if (req.method !== 'GET' && !sameOriginRequest(req)) return send(res, 403, { error:'Origem da requisição não permitida' });
  if (req.method !== 'GET' && req.method !== 'PUT') {
    res.setHeader('Allow', 'GET, PUT');
    return send(res, 405, { error:'Método não permitido' });
  }
  const session = await requireSession(req, ['admin','editor','aluno']);
  if (!session.ok) return send(res, session.status, { error:session.error });
  try {
    const sql = session.sql;
    await ensureTable(sql);
    if (req.method === 'GET') {
      const rows = await sql`SELECT topic_id,marker,completed,updated_at FROM central_exam_topic_progress WHERE user_id=${session.user.id} AND exam_id=${EXAM_ID}`;
      const progress = {};
      for (const row of rows) {
        progress[row.topic_id] ||= {};
        progress[row.topic_id][row.marker] = { value:row.completed === true, at:new Date(row.updated_at).toISOString() };
      }
      return send(res, 200, { examId:EXAM_ID, progress });
    }
    const body = await readJsonBody(req);
    if (!body || !Array.isArray(body.changes) || body.changes.length > 1200) return send(res, 400, { error:'Lista de marcações inválida' });
    for (const change of body.changes) {
      if (!change || !TOPIC_ID.test(String(change.topicId || '')) || !MARKERS.has(change.marker) || typeof change.value !== 'boolean') {
        return send(res, 400, { error:'Marcação de assunto inválida' });
      }
    }
    for (const change of body.changes) {
      const updatedAt = safeTimestamp(change.at);
      await sql`
        INSERT INTO central_exam_topic_progress (user_id,exam_id,topic_id,marker,completed,updated_at)
        VALUES (${session.user.id},${EXAM_ID},${change.topicId},${change.marker},${change.value},${updatedAt}::timestamptz)
        ON CONFLICT (user_id,exam_id,topic_id,marker) DO UPDATE SET
          completed=EXCLUDED.completed, updated_at=EXCLUDED.updated_at
        WHERE central_exam_topic_progress.updated_at < EXCLUDED.updated_at
      `;
    }
    return send(res, 200, { ok:true, examId:EXAM_ID, saved:body.changes.length });
  } catch (error) {
    console.error('exam topic progress error', error);
    return send(res, 500, { error:error?.message || 'Falha ao sincronizar o progresso do edital' });
  }
}
