import crypto from 'node:crypto';
import { neon } from '@neondatabase/serverless';

function send(res, status, body) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  res.end(JSON.stringify(body));
}

function safeEqual(a, b) {
  const aa = Buffer.from(String(a || ''));
  const bb = Buffer.from(String(b || ''));
  if (!aa.length || aa.length !== bb.length) return false;
  return crypto.timingSafeEqual(aa, bb);
}

function authorized(req) {
  const expected = process.env.BACKUP_SECRET;
  if (!expected) return { ok: false, status: 503, error: 'BACKUP_SECRET não configurado no Vercel' };
  if (!safeEqual(req.headers['x-backup-key'], expected)) {
    return { ok: false, status: 401, error: 'Chave de sincronização inválida' };
  }
  return { ok: true };
}

function database() {
  if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL não configurado no Vercel');
  return neon(process.env.DATABASE_URL);
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
    CREATE TABLE IF NOT EXISTS central_sync_state (
      id SMALLINT PRIMARY KEY DEFAULT 1 CHECK (id = 1),
      revision BIGINT NOT NULL DEFAULT 0,
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      device_id TEXT,
      content_hash TEXT,
      payload JSONB NOT NULL DEFAULT '{}'::jsonb,
      payload_bytes INTEGER NOT NULL DEFAULT 0
    )
  `;
}

async function readJsonBody(req) {
  if (req.body && typeof req.body === 'object') return req.body;
  if (typeof req.body === 'string') return JSON.parse(req.body || '{}');
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  const raw = Buffer.concat(chunks).toString('utf8');
  return raw ? JSON.parse(raw) : {};
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
  const auth = authorized(req);
  if (!auth.ok) return send(res, auth.status, { error: auth.error });

  try {
    const sql = database();
    await ensureTable(sql);

    if (req.method === 'GET') {
      const rows = await sql`
        SELECT revision, updated_at, device_id, content_hash, payload, payload_bytes
        FROM central_sync_state WHERE id = 1 LIMIT 1
      `;
      return send(res, 200, rowToState(rows[0]));
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
        return send(res, 413, { error: 'Dados acima de 4 MB; faça um backup por arquivo antes de continuar' });
      }
      const baseRevision = Math.max(0, Math.trunc(Number(body.baseRevision || 0)));
      const deviceId = String(body.deviceId || '').slice(0, 120);
      const contentHash = String(body.hash || '').slice(0, 120);
      const rows = await sql`
        INSERT INTO central_sync_state
          (id, revision, updated_at, device_id, content_hash, payload, payload_bytes)
        VALUES
          (1, 1, NOW(), ${deviceId}, ${contentHash}, ${raw}::jsonb, ${bytes})
        ON CONFLICT (id) DO UPDATE SET
          revision = central_sync_state.revision + 1,
          updated_at = NOW(),
          device_id = EXCLUDED.device_id,
          content_hash = EXCLUDED.content_hash,
          payload = EXCLUDED.payload,
          payload_bytes = EXCLUDED.payload_bytes
        WHERE central_sync_state.revision = ${baseRevision}
        RETURNING revision, updated_at, device_id, content_hash, payload_bytes
      `;
      if (!rows.length) {
        const current = await sql`
          SELECT revision, updated_at, device_id, content_hash, payload_bytes
          FROM central_sync_state WHERE id = 1 LIMIT 1
        `;
        return send(res, 409, { error: 'Existe uma alteração mais recente na nuvem', current: rowToState(current[0], false) });
      }
      return send(res, 200, rowToState(rows[0], false));
    }

    res.setHeader('Allow', 'GET, POST');
    return send(res, 405, { error: 'Método não permitido' });
  } catch (error) {
    console.error('central sync error', error);
    return send(res, 500, { error: error?.message || 'Falha interna na sincronização' });
  }
}
