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
  const received = req.headers['x-backup-key'];
  if (!safeEqual(received, expected)) return { ok: false, status: 401, error: 'Chave de backup inválida' };
  return { ok: true };
}

function database() {
  if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL não configurado no Vercel');
  return neon(process.env.DATABASE_URL);
}

async function ensureTable(sql) {
  await sql`
    CREATE TABLE IF NOT EXISTS central_backups (
      id BIGSERIAL PRIMARY KEY,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      app_version TEXT,
      note TEXT,
      payload JSONB NOT NULL,
      payload_bytes INTEGER NOT NULL DEFAULT 0
    )
  `;
  await sql`CREATE INDEX IF NOT EXISTS central_backups_created_at_idx ON central_backups (created_at DESC)`;
}

async function readJsonBody(req) {
  if (req.body && typeof req.body === 'object') return req.body;
  if (typeof req.body === 'string') return JSON.parse(req.body || '{}');
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  const raw = Buffer.concat(chunks).toString('utf8');
  return raw ? JSON.parse(raw) : {};
}

export default async function handler(req, res) {
  const auth = authorized(req);
  if (!auth.ok) return send(res, auth.status, { error: auth.error });

  try {
    const sql = database();
    await ensureTable(sql);

    if (req.method === 'GET') {
      const id = Number(req.query?.id || 0);
      if (id) {
        const rows = await sql`SELECT id, payload FROM central_backups WHERE id = ${id} LIMIT 1`;
        if (!rows.length) return send(res, 404, { error: 'Backup não encontrado' });
        return send(res, 200, { id: Number(rows[0].id), backup: rows[0].payload });
      }
      const rows = await sql`
        SELECT id, created_at, app_version, note, payload_bytes
        FROM central_backups
        ORDER BY created_at DESC
        LIMIT 50
      `;
      return send(res, 200, {
        backups: rows.map((r) => ({
          id: Number(r.id),
          createdAt: r.created_at,
          version: r.app_version,
          note: r.note,
          bytes: Number(r.payload_bytes || 0),
        })),
      });
    }

    if (req.method === 'POST') {
      const body = await readJsonBody(req);
      if (body?.action !== 'save' || !body.backup || typeof body.backup !== 'object') {
        return send(res, 400, { error: 'Payload de backup inválido' });
      }
      const raw = JSON.stringify(body.backup);
      const bytes = Buffer.byteLength(raw, 'utf8');
      // Mantém folga para limites de request/JSON e evita snapshots acidentalmente gigantes.
      if (bytes > 4_000_000) {
        return send(res, 413, { error: 'Backup maior que 4 MB. Baixe o arquivo localmente; para backups maiores use armazenamento de objetos.' });
      }
      const version = String(body.backup.versao || '').slice(0, 50);
      const note = body.note ? String(body.note).slice(0, 300) : null;
      const rows = await sql`
        INSERT INTO central_backups (app_version, note, payload, payload_bytes)
        VALUES (${version}, ${note}, ${raw}::jsonb, ${bytes})
        RETURNING id, created_at
      `;
      const keepRaw = Number(process.env.BACKUP_RETENTION || 30);
      const keep = Number.isFinite(keepRaw) ? Math.min(Math.max(Math.trunc(keepRaw), 5), 200) : 30;
      await sql`
        DELETE FROM central_backups
        WHERE id IN (
          SELECT id FROM central_backups
          ORDER BY created_at DESC
          OFFSET ${keep}
        )
      `;
      return send(res, 201, { id: Number(rows[0].id), createdAt: rows[0].created_at, bytes });
    }

    if (req.method === 'DELETE') {
      const id = Number(req.query?.id || 0);
      if (!id) return send(res, 400, { error: 'ID do backup não informado' });
      const rows = await sql`DELETE FROM central_backups WHERE id = ${id} RETURNING id`;
      if (!rows.length) return send(res, 404, { error: 'Backup não encontrado' });
      return send(res, 200, { ok: true, id });
    }

    res.setHeader('Allow', 'GET, POST, DELETE');
    return send(res, 405, { error: 'Método não permitido' });
  } catch (error) {
    console.error('central backups error', error);
    return send(res, 500, { error: error?.message || 'Falha interna no serviço de backup' });
  }
}
