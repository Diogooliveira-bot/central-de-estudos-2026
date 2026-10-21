import { requireSession, readJsonBody, sameOriginRequest } from '../lib/auth.js';
import { EXAM_TOPIC_IDS } from '../lib/exam-progress-topic-ids.js';

function validObjectiveId(value) {
  const id = String(value || '');
  return id === 'free-study' || (id.length <= 120 && /^(career|exam)-[a-z0-9]+(?:-[a-z0-9]+)*$/.test(id));
}

function send(res, status, body) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  res.end(JSON.stringify(body));
}

async function ensureTable(sql) {
  await sql`
    CREATE TABLE IF NOT EXISTS central_user_preferences (
      user_id TEXT PRIMARY KEY REFERENCES central_users(user_id) ON DELETE CASCADE,
      study_objective_id TEXT,
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;
}

const DEFAULT_EXAM_ID = 'tjp-2026-aj-area-judiciaria';
const EXAM_MARKERS = new Set(['studied','reviewed','questions']);
const EXAM_TOPIC_SETS = Object.fromEntries(Object.entries(EXAM_TOPIC_IDS).map(([id, topics]) => [id,new Set(topics)]));

async function handleExamProgress(req, res) {
  // Keep the original TJPB API contract: an omitted examId selects TJPB.
  // Explicit IDs are allowlisted; never use user input as a table identifier.
  const EXAM_ID = req.query?.examId === undefined ? DEFAULT_EXAM_ID : req.query.examId;
  if (typeof EXAM_ID !== 'string' || !Object.hasOwn(EXAM_TOPIC_SETS,EXAM_ID)) {
    return send(res, 400, { error:'Edital inválido ou não cadastrado' });
  }
  const topicIds = EXAM_TOPIC_SETS[EXAM_ID];
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
      if (!change || !topicIds.has(change.topicId) || !EXAM_MARKERS.has(change.marker) || typeof change.value !== 'boolean') {
        return send(res, 400, { error:'Marcação de assunto inválida' });
      }
    }
    for (const change of body.changes) {
      const time = Date.parse(change.at);
      const now = Date.now();
      const updatedAt = Number.isFinite(time) && time <= now + 300000 ? new Date(Math.max(0,time)).toISOString() : new Date(now).toISOString();
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

export default async function handler(req, res) {
  if (req.query?.resource === 'exam-progress') return handleExamProgress(req, res);
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
      const rows = await sql`
        SELECT study_objective_id, updated_at
        FROM central_user_preferences WHERE user_id=${session.user.id} LIMIT 1
      `;
      return send(res, 200, { objectiveId:rows[0]?.study_objective_id || null, updatedAt:rows[0]?.updated_at || null });
    }

    const body = await readJsonBody(req);
    const objectiveId = String(body?.objectiveId || '');
    if (!validObjectiveId(objectiveId)) return send(res, 400, { error:'Objetivo inválido' });
    const rows = await sql`
      INSERT INTO central_user_preferences (user_id, study_objective_id, updated_at)
      VALUES (${session.user.id}, ${objectiveId}, NOW())
      ON CONFLICT (user_id) DO UPDATE SET
        study_objective_id=EXCLUDED.study_objective_id,
        updated_at=NOW()
      RETURNING study_objective_id, updated_at
    `;
    return send(res, 200, { ok:true, objectiveId:rows[0].study_objective_id, updatedAt:rows[0].updated_at });
  } catch (error) {
    console.error('study objective preference error', error);
    return send(res, 500, { error:error?.message || 'Falha ao salvar o objetivo' });
  }
}
