import { requireSession, readJsonBody, sameOriginRequest } from '../lib/auth.js';

function send(res, status, body) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  res.end(JSON.stringify(body));
}

function isPortugueseDataKey(key) {
  const value = String(key || '');
  return /^central-v6:pt(?::|-)/.test(value) || /^dominio_portugues/i.test(value);
}
function sanitizeDataMap(data) {
  if (!data || typeof data !== 'object' || Array.isArray(data)) return {};
  return Object.fromEntries(Object.entries(data).filter(([key]) => !isPortugueseDataKey(key)));
}
function sanitizeBackup(backup) {
  if (!backup || typeof backup !== 'object' || Array.isArray(backup)) return backup;
  const clean = { ...backup };
  if (clean.dados && typeof clean.dados === 'object' && !Array.isArray(clean.dados)) clean.dados = sanitizeDataMap(clean.dados);
  return clean;
}

async function ensureTable(sql) {
  await sql`
    CREATE TABLE IF NOT EXISTS central_user_backups (
      id BIGSERIAL PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES central_users(user_id) ON DELETE CASCADE,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      app_version TEXT,
      note TEXT,
      payload JSONB NOT NULL,
      payload_bytes INTEGER NOT NULL DEFAULT 0
    )
  `;
  await sql`CREATE INDEX IF NOT EXISTS central_user_backups_user_created_idx ON central_user_backups (user_id, created_at DESC)`;
}

export default async function handler(req, res) {
  if (req.method !== 'GET' && !sameOriginRequest(req)) return send(res, 403, { error: 'Origem da requisição não permitida' });
  const session = await requireSession(req, ['admin','editor','aluno']);
  if (!session.ok) return send(res, session.status, { error: session.error });

  try {
    const sql = session.sql;
    const userId = session.user.id;
    await ensureTable(sql);

    if (req.method === 'GET') {
      const id = Number(req.query?.id || 0);
      if (id) {
        const rows = await sql`SELECT id,payload FROM central_user_backups WHERE id=${id} AND user_id=${userId} LIMIT 1`;
        if (!rows.length) return send(res, 404, { error: 'Backup não encontrado' });
        return send(res, 200, { id: Number(rows[0].id), backup: sanitizeBackup(rows[0].payload) });
      }
      const rows = await sql`
        SELECT id,created_at,app_version,note,payload_bytes
        FROM central_user_backups
        WHERE user_id=${userId}
        ORDER BY created_at DESC
        LIMIT 30
      `;
      return send(res, 200, {
        backups: rows.map((r) => ({
          id: Number(r.id), createdAt: r.created_at, version: r.app_version,
          note: r.note, bytes: Number(r.payload_bytes || 0)
        }))
      });
    }

    if (req.method === 'POST') {
      const body = await readJsonBody(req);
      if (body?.action !== 'save' || !body.backup || typeof body.backup !== 'object') {
        return send(res, 400, { error: 'Payload de backup inválido' });
      }
      const cleanBackup = sanitizeBackup(body.backup);
      const raw = JSON.stringify(cleanBackup);
      const bytes = Buffer.byteLength(raw, 'utf8');
      if (bytes > 4_000_000) return send(res, 413, { error: 'Backup maior que 4 MB' });

      const version = String(cleanBackup.versao || '').slice(0, 50);
      const note = body.note ? String(body.note).slice(0, 300) : null;
      const rows = await sql`
        INSERT INTO central_user_backups(user_id,app_version,note,payload,payload_bytes)
        VALUES(${userId},${version},${note},${raw}::jsonb,${bytes})
        RETURNING id,created_at
      `;
      await sql`
        DELETE FROM central_user_backups
        WHERE user_id=${userId} AND id IN (
          SELECT id FROM central_user_backups
          WHERE user_id=${userId}
          ORDER BY created_at DESC
          OFFSET 30
        )
      `;
      return send(res, 201, { id: Number(rows[0].id), createdAt: rows[0].created_at, bytes });
    }

    if (req.method === 'DELETE') {
      const id = Number(req.query?.id || 0);
      if (!id) return send(res, 400, { error: 'ID do backup não informado' });
      const rows = await sql`DELETE FROM central_user_backups WHERE id=${id} AND user_id=${userId} RETURNING id`;
      if (!rows.length) return send(res, 404, { error: 'Backup não encontrado' });
      return send(res, 200, { ok: true, id });
    }

    res.setHeader('Allow', 'GET, POST, DELETE');
    return send(res, 405, { error: 'Método não permitido' });
  } catch (error) {
    console.error('central user backups error', error);
    return send(res, 500, { error: error?.message || 'Falha interna no backup do usuário' });
  }
}
