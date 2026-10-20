import { requireSession, readJsonBody, sameOriginRequest } from '../lib/auth.js';

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

export default async function handler(req, res) {
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
