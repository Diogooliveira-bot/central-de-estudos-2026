import { requireSession, readJsonBody } from '../lib/auth.js';

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

function sanitizePayload(payload) {
  if (!payload || typeof payload !== 'object' || Array.isArray(payload)) return {};
  return Object.fromEntries(Object.entries(payload).filter(([key]) => !isPortugueseDataKey(key)));
}

async function ensureTable(sql) {
  await sql`
    CREATE TABLE IF NOT EXISTS central_user_sync_state (
      user_id TEXT PRIMARY KEY REFERENCES central_users(user_id) ON DELETE CASCADE,
      revision BIGINT NOT NULL DEFAULT 0,
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      device_id TEXT,
      content_hash TEXT,
      payload JSONB NOT NULL DEFAULT '{}'::jsonb,
      payload_bytes INTEGER NOT NULL DEFAULT 0
    )
  `;
}

function rowToState(row, includePayload = true) {
  if (!row) return { exists: false, revision: 0 };
  const state = {
    exists: true,
    revision: Number(row.revision || 0),
    updatedAt: row.updated_at,
    deviceId: row.device_id || '',
    hash: row.content_hash || '',
    bytes: Number(row.payload_bytes || 0),
  };
  if (includePayload) state.payload = sanitizePayload(row.payload || {});
  return state;
}

export default async function handler(req, res) {
  const session = await requireSession(req, ['admin','editor','aluno']);
  if (!session.ok) return send(res, session.status, { error: session.error });

  try {
    const sql = session.sql;
    const userId = session.user.id;
    await ensureTable(sql);

    if (req.method === 'GET') {
      const rows = await sql`
        SELECT revision,updated_at,device_id,content_hash,payload,payload_bytes
        FROM central_user_sync_state
        WHERE user_id=${userId}
        LIMIT 1
      `;
      return send(res, 200, { ...rowToState(rows[0]), userId });
    }

    if (req.method === 'POST') {
      const body = await readJsonBody(req);
      if (!body?.payload || typeof body.payload !== 'object' || Array.isArray(body.payload)) {
        return send(res, 400, { error: 'Estado de sincronização inválido' });
      }
      const cleanPayload = sanitizePayload(body.payload);
      const raw = JSON.stringify(cleanPayload);
      const bytes = Buffer.byteLength(raw, 'utf8');
      if (bytes > 4_000_000) {
        return send(res, 413, { error: 'Dados acima de 4 MB; reduza anexos locais antes de sincronizar' });
      }

      const baseRevision = Math.max(0, Math.trunc(Number(body.baseRevision || 0)));
      const deviceId = String(body.deviceId || '').slice(0, 120);
      const contentHash = String(body.hash || '').slice(0, 120);
      const rows = await sql`
        INSERT INTO central_user_sync_state
          (user_id,revision,updated_at,device_id,content_hash,payload,payload_bytes)
        VALUES
          (${userId},1,NOW(),${deviceId},${contentHash},${raw}::jsonb,${bytes})
        ON CONFLICT (user_id) DO UPDATE SET
          revision=central_user_sync_state.revision+1,
          updated_at=NOW(),
          device_id=EXCLUDED.device_id,
          content_hash=EXCLUDED.content_hash,
          payload=EXCLUDED.payload,
          payload_bytes=EXCLUDED.payload_bytes
        WHERE central_user_sync_state.revision=${baseRevision}
        RETURNING revision,updated_at,device_id,content_hash,payload_bytes
      `;

      if (!rows.length) {
        const current = await sql`
          SELECT revision,updated_at,device_id,content_hash,payload_bytes
          FROM central_user_sync_state
          WHERE user_id=${userId}
          LIMIT 1
        `;
        return send(res, 409, {
          error: 'Existe uma alteração mais recente na nuvem',
          current: rowToState(current[0], false)
        });
      }

      return send(res, 200, { ...rowToState(rows[0], false), userId });
    }

    res.setHeader('Allow', 'GET, POST');
    return send(res, 405, { error: 'Método não permitido' });
  } catch (error) {
    console.error('central user sync error', error);
    return send(res, 500, { error: error?.message || 'Falha interna na sincronização do usuário' });
  }
}
