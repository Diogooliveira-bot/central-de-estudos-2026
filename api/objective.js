import { requireSession, readJsonBody, sameOriginRequest } from '../lib/auth.js';
import { requirePlanFeature } from '../lib/plan-access.js';
import { EXAM_TOPIC_IDS } from '../lib/exam-progress-topic-ids.js';

function validObjectiveId(value) {
  const id = String(value || '');
  return id === 'free-study' || (id.length <= 120 && /^(career|exam)-[a-z0-9]+(?:-[a-z0-9]+)*$/.test(id));
}

const FREE_STUDY_SUBJECT_IDS = new Set(['pt','cf','adm','civil','cpc','penal','cpp','rlm','info']);

function validFreeSubjectIds(value) {
  return Array.isArray(value) && value.length >= 1 && value.length <= FREE_STUDY_SUBJECT_IDS.size &&
    value.every((id) => typeof id === 'string' && FREE_STUDY_SUBJECT_IDS.has(id)) &&
    new Set(value).size === value.length;
}

function send(res, status, body) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  res.end(JSON.stringify(body));
}

// A verificação/migração é executada no máximo uma vez por instância da função.
let preferencesReadyPromise = null;
function ensureTable(sql) {
  if (!preferencesReadyPromise) {
    preferencesReadyPromise = (async () => {
      await sql`
        CREATE TABLE IF NOT EXISTS central_user_preferences (
          user_id TEXT PRIMARY KEY REFERENCES central_users(user_id) ON DELETE CASCADE,
          study_objective_id TEXT,
          updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        )
      `;
      await sql`ALTER TABLE central_user_preferences ADD COLUMN IF NOT EXISTS free_subject_ids JSONB`;
      await sql`ALTER TABLE central_user_preferences ADD COLUMN IF NOT EXISTS requested_exam TEXT`;
      await sql`ALTER TABLE central_user_preferences ADD COLUMN IF NOT EXISTS requested_exam_at TIMESTAMPTZ`;
    })().catch((error) => {
      preferencesReadyPromise = null;
      throw error;
    });
  }
  return preferencesReadyPromise;
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
  const session = await requirePlanFeature(req, 'edital.sync', ['admin','editor','aluno']);
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

// Pedido de edital: texto simples digitado pelo aluno (um pedido por aluno; o mais recente vale).
export function cleanExamRequest(value) {
  const text = String(value ?? '').replace(/[\u0000-\u001f\u007f<>]/g, ' ').replace(/\s+/g, ' ').trim();
  return text.length >= 3 && text.length <= 120 ? text : '';
}
export function examRequestKey(value) {
  return String(value || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
}

async function handleExamRequest(req, res, session, sql) {
  if (req.method !== 'PUT') {
    res.setHeader('Allow', 'PUT');
    return send(res, 405, { error:'Método não permitido' });
  }
  const body = await readJsonBody(req);
  const text = cleanExamRequest(body?.text);
  if (!text) return send(res, 400, { error:'Informe o nome do edital (de 3 a 120 caracteres).' });
  await sql`
    INSERT INTO central_user_preferences (user_id, requested_exam, requested_exam_at, updated_at)
    VALUES (${session.user.id}, ${text}, NOW(), NOW())
    ON CONFLICT (user_id) DO UPDATE SET requested_exam=EXCLUDED.requested_exam, requested_exam_at=NOW()
  `;
  return send(res, 200, { ok:true, text });
}

// Lista para o administrador: pedidos agrupados pelo mesmo texto (sem acentos/caixa).
async function handleExamRequestsAdmin(req, res, session, sql) {
  if (session.user.role !== 'admin') return send(res, 403, { error:'Somente o administrador acessa os pedidos de edital' });
  if (req.method === 'PUT') {
    const body = await readJsonBody(req);
    const key = examRequestKey(cleanExamRequest(body?.text));
    if (!key || body?.resolved !== true) return send(res, 400, { error:'Pedido inválido' });
    const rows = await sql`SELECT user_id, requested_exam FROM central_user_preferences WHERE requested_exam IS NOT NULL`;
    const ids = rows.filter((r) => examRequestKey(r.requested_exam) === key).map((r) => r.user_id);
    for (const id of ids) {
      await sql`UPDATE central_user_preferences SET requested_exam=NULL, requested_exam_at=NULL WHERE user_id=${id}`;
    }
    return send(res, 200, { ok:true, cleared:ids.length });
  }
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET, PUT');
    return send(res, 405, { error:'Método não permitido' });
  }
  const rows = await sql`
    SELECT p.requested_exam, p.requested_exam_at, u.name, u.email
    FROM central_user_preferences p JOIN central_users u ON u.user_id = p.user_id
    WHERE p.requested_exam IS NOT NULL
    ORDER BY p.requested_exam_at DESC LIMIT 500
  `;
  const groups = new Map();
  for (const row of rows) {
    const key = examRequestKey(row.requested_exam);
    if (!key) continue;
    const group = groups.get(key) || { text:row.requested_exam, count:0, lastAt:row.requested_exam_at, students:[] };
    group.count += 1;
    if (group.students.length < 20) group.students.push({ name:row.name || '', email:row.email || '', at:row.requested_exam_at });
    groups.set(key, group);
  }
  return send(res, 200, { requests:[...groups.values()].sort((a, b) => b.count - a.count || String(b.lastAt).localeCompare(String(a.lastAt))) });
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
    if (req.query?.resource === 'exam-request') return handleExamRequest(req, res, session, sql);
    if (req.query?.resource === 'exam-requests') return handleExamRequestsAdmin(req, res, session, sql);

    if (req.method === 'GET') {
      const rows = await sql`
        SELECT study_objective_id, free_subject_ids, updated_at
        FROM central_user_preferences WHERE user_id=${session.user.id} LIMIT 1
      `;
      const row = rows[0];
      return send(res, 200, {
        objectiveId:row?.study_objective_id || null,
        freeSubjectIds:validFreeSubjectIds(row?.free_subject_ids) ? row.free_subject_ids : null,
        updatedAt:row?.updated_at || null,
      });
    }

    const body = await readJsonBody(req);
    const objectiveId = String(body?.objectiveId || '');
    if (!validObjectiveId(objectiveId)) return send(res, 400, { error:'Objetivo inválido' });
    const hasFreeSelection = Object.prototype.hasOwnProperty.call(body || {}, 'freeSubjectIds');
    const freeSubjectIds = body?.freeSubjectIds;
    if (hasFreeSelection && (objectiveId !== 'free-study' || !validFreeSubjectIds(freeSubjectIds))) {
      return send(res, 400, { error:'Selecione de 1 a 9 disciplinas válidas, sem repetições, para o Estudo livre' });
    }
    // Sem seleção enviada: preservar o que o aluno já escolheu quando alternar de carreira.
    const freeSubjectJson = hasFreeSelection ? JSON.stringify(freeSubjectIds) : null;
    const rows = await sql`
      INSERT INTO central_user_preferences (user_id, study_objective_id, free_subject_ids, updated_at)
      VALUES (${session.user.id}, ${objectiveId}, ${freeSubjectJson}::jsonb, NOW())
      ON CONFLICT (user_id) DO UPDATE SET
        study_objective_id=EXCLUDED.study_objective_id,
        free_subject_ids=CASE WHEN ${hasFreeSelection} THEN EXCLUDED.free_subject_ids ELSE central_user_preferences.free_subject_ids END,
        updated_at=NOW()
      RETURNING study_objective_id, free_subject_ids, updated_at
    `;
    const row = rows[0];
    return send(res, 200, {
      ok:true, objectiveId:row.study_objective_id,
      freeSubjectIds:validFreeSubjectIds(row.free_subject_ids) ? row.free_subject_ids : null,
      updatedAt:row.updated_at,
    });
  } catch (error) {
    console.error('study objective preference error', error);
    return send(res, 500, { error:error?.message || 'Falha ao salvar o objetivo' });
  }
}
