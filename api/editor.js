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

function writeAuthorized(req) {
  const expected = process.env.EDITOR_SECRET || process.env.BACKUP_SECRET;
  if (!expected) return { ok: false, status: 503, error: 'EDITOR_SECRET/BACKUP_SECRET não configurado no Vercel' };
  if (!safeEqual(req.headers['x-editor-key'], expected)) {
    return { ok: false, status: 401, error: 'Chave do editor inválida' };
  }
  return { ok: true };
}

function database() {
  if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL não configurado no Vercel');
  return neon(process.env.DATABASE_URL);
}

async function ensureTable(sql) {
  await sql`
    CREATE TABLE IF NOT EXISTS central_editor_state (
      id SMALLINT PRIMARY KEY DEFAULT 1 CHECK (id = 1),
      revision BIGINT NOT NULL DEFAULT 0,
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
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

function normalizePayload(payload) {
  if (!payload || typeof payload !== 'object' || Array.isArray(payload)) return {};
  const clean = {};
  for (const [key, value] of Object.entries(payload)) {
    const safeKey = String(key || '').slice(0, 260);
    if (!safeKey || !value || typeof value !== 'object' || Array.isArray(value)) continue;
    const item = {};
    if (typeof value.text === 'string') item.text = value.text.slice(0, 20000);
    if (value.styles && typeof value.styles === 'object' && !Array.isArray(value.styles)) {
      const allowed = ['fontSize','fontWeight','textAlign','color','backgroundColor','padding','marginTop','marginBottom','borderRadius','display'];
      item.styles = {};
      for (const prop of allowed) {
        if (typeof value.styles[prop] === 'string') item.styles[prop] = value.styles[prop].slice(0, 120);
      }
    }
    if (value.locator && typeof value.locator === 'object' && !Array.isArray(value.locator)) {
      item.locator = {
        id: typeof value.locator.id === 'string' ? value.locator.id.slice(0, 180) : '',
        path: typeof value.locator.path === 'string' ? value.locator.path.slice(0, 500) : '',
        tag: typeof value.locator.tag === 'string' ? value.locator.tag.slice(0, 40) : '',
        classes: Array.isArray(value.locator.classes) ? value.locator.classes.slice(0, 8).map(x => String(x).slice(0, 80)) : [],
        originalText: typeof value.locator.originalText === 'string' ? value.locator.originalText.slice(0, 1000) : ''
      };
    }
    if (Number.isInteger(value.orderDelta)) item.orderDelta = Math.max(-50, Math.min(50, value.orderDelta));
    clean[safeKey] = item;
  }
  return clean;
}

export default async function handler(req, res) {
  try {
    const sql = database();
    await ensureTable(sql);

    if (req.method === 'GET') {
      const rows = await sql`
        SELECT revision, updated_at, payload, payload_bytes
        FROM central_editor_state WHERE id = 1 LIMIT 1
      `;
      if (!rows.length) return send(res, 200, { exists: false, revision: 0, payload: {} });
      const row = rows[0];
      return send(res, 200, {
        exists: true,
        revision: Number(row.revision || 0),
        updatedAt: row.updated_at,
        bytes: Number(row.payload_bytes || 0),
        payload: normalizePayload(row.payload || {})
      });
    }

    if (req.method === 'POST') {
      const auth = writeAuthorized(req);
      if (!auth.ok) return send(res, auth.status, { error: auth.error });

      const body = await readJsonBody(req);
      const payload = normalizePayload(body.payload);
      const raw = JSON.stringify(payload);
      const bytes = Buffer.byteLength(raw, 'utf8');
      if (bytes > 1_500_000) return send(res, 413, { error: 'Editor acima do limite de 1,5 MB' });

      const baseRevision = Math.max(0, Math.trunc(Number(body.baseRevision || 0)));
      const rows = await sql`
        INSERT INTO central_editor_state (id, revision, updated_at, payload, payload_bytes)
        VALUES (1, 1, NOW(), ${raw}::jsonb, ${bytes})
        ON CONFLICT (id) DO UPDATE SET
          revision = central_editor_state.revision + 1,
          updated_at = NOW(),
          payload = EXCLUDED.payload,
          payload_bytes = EXCLUDED.payload_bytes
        WHERE central_editor_state.revision = ${baseRevision}
        RETURNING revision, updated_at, payload_bytes
      `;
      if (!rows.length) {
        const current = await sql`
          SELECT revision, updated_at, payload_bytes
          FROM central_editor_state WHERE id = 1 LIMIT 1
        `;
        return send(res, 409, { error: 'Existe uma alteração mais recente no editor', current: current[0] || null });
      }
      return send(res, 200, {
        ok: true,
        revision: Number(rows[0].revision || 0),
        updatedAt: rows[0].updated_at,
        bytes: Number(rows[0].payload_bytes || 0)
      });
    }

    res.setHeader('Allow', 'GET, POST');
    return send(res, 405, { error: 'Método não permitido' });
  } catch (error) {
    console.error('central editor error', error);
    return send(res, 500, { error: error?.message || 'Falha interna no editor' });
  }
}
