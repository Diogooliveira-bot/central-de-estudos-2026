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
    return { ok: false, status: 401, error: 'Chave de editor inválida' };
  }
  return { ok: true };
}

function database() {
  if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL não configurado no Vercel');
  return neon(process.env.DATABASE_URL);
}

async function ensureTable(sql) {
  await sql`
    CREATE TABLE IF NOT EXISTS central_editor_overrides (
      page_key TEXT NOT NULL,
      selector TEXT NOT NULL,
      html TEXT NOT NULL,
      revision BIGINT NOT NULL DEFAULT 1,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      PRIMARY KEY (page_key, selector)
    )
  `;
  await sql`
    CREATE INDEX IF NOT EXISTS central_editor_overrides_page_idx
    ON central_editor_overrides (page_key, updated_at DESC)
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

function cleanPage(value) {
  const page = String(value || '').trim();
  if (!page || page.length > 700) return '';
  return page;
}

function cleanSelector(value) {
  const selector = String(value || '').trim();
  if (!selector || selector.length > 1800) return '';
  return selector;
}

export default async function handler(req, res) {
  try {
    const sql = database();
    await ensureTable(sql);

    if (req.method === 'GET') {
      const page = cleanPage(req.query?.page);
      if (!page) return send(res, 400, { error: 'Página não informada' });
      const rows = await sql`
        SELECT page_key, selector, html, revision, updated_at
        FROM central_editor_overrides
        WHERE page_key = ${page}
        ORDER BY updated_at ASC
        LIMIT 1000
      `;
      return send(res, 200, {
        page,
        overrides: rows.map((row) => ({
          selector: row.selector,
          html: row.html,
          revision: Number(row.revision || 1),
          updatedAt: row.updated_at,
        })),
      });
    }

    if (req.method !== 'POST') {
      res.setHeader('Allow', 'GET, POST');
      return send(res, 405, { error: 'Método não permitido' });
    }

    const auth = authorized(req);
    if (!auth.ok) return send(res, auth.status, { error: auth.error });

    const body = await readJsonBody(req);
    if (body?.action === 'verify') return send(res, 200, { ok: true });

    if (body?.action === 'save') {
      const changes = Array.isArray(body.changes) ? body.changes : [];
      if (!changes.length) return send(res, 400, { error: 'Nenhuma alteração recebida' });
      if (changes.length > 120) return send(res, 413, { error: 'Muitas alterações em uma única gravação' });

      let saved = 0;
      for (const item of changes) {
        const page = cleanPage(item?.page);
        const selector = cleanSelector(item?.selector);
        const html = String(item?.html ?? '');
        if (!page || !selector) return send(res, 400, { error: 'Página ou seletor inválido' });
        if (Buffer.byteLength(html, 'utf8') > 120_000) {
          return send(res, 413, { error: 'Um bloco editado ultrapassou 120 KB' });
        }
        await sql`
          INSERT INTO central_editor_overrides
            (page_key, selector, html, revision, created_at, updated_at)
          VALUES
            (${page}, ${selector}, ${html}, 1, NOW(), NOW())
          ON CONFLICT (page_key, selector) DO UPDATE SET
            html = EXCLUDED.html,
            revision = central_editor_overrides.revision + 1,
            updated_at = NOW()
        `;
        saved += 1;
      }
      return send(res, 200, { ok: true, saved });
    }

    if (body?.action === 'reset') {
      const items = Array.isArray(body.items) ? body.items : [];
      if (!items.length) return send(res, 400, { error: 'Nenhum bloco informado' });
      let removed = 0;
      for (const item of items.slice(0, 120)) {
        const page = cleanPage(item?.page);
        const selector = cleanSelector(item?.selector);
        if (!page || !selector) continue;
        const rows = await sql`
          DELETE FROM central_editor_overrides
          WHERE page_key = ${page} AND selector = ${selector}
          RETURNING selector
        `;
        removed += rows.length;
      }
      return send(res, 200, { ok: true, removed });
    }

    return send(res, 400, { error: 'Ação de editor inválida' });
  } catch (error) {
    console.error('central editor error', error);
    return send(res, 500, { error: error?.message || 'Falha interna no editor' });
  }
}
