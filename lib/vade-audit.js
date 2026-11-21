import seed from '../data/vade-legal-audit-2026-11-18.json' with { type: 'json' };
import { readJsonBody, requireSession, sameOriginRequest } from './auth.js';

const STATUSES = new Set(['inventory', 'verified', 'pending', 'conflict']);
const LAW_IDS = new Set(seed.laws.map((law) => law.id));

function send(res, status, body) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'private, no-store');
  res.end(JSON.stringify(body));
}

async function ensureTables(sql) {
  await sql`
    CREATE TABLE IF NOT EXISTS central_vade_legal_status (
      law_id TEXT PRIMARY KEY,
      status TEXT NOT NULL CHECK (status IN ('inventory','verified','pending','conflict')),
      last_verified_at DATE,
      devices_updated INTEGER NOT NULL DEFAULT 0 CHECK (devices_updated >= 0),
      devices_added INTEGER NOT NULL DEFAULT 0 CHECK (devices_added >= 0),
      source_urls JSONB NOT NULL DEFAULT '[]'::jsonb,
      notes TEXT NOT NULL DEFAULT '',
      updated_by TEXT NOT NULL,
      updated_by_name TEXT NOT NULL,
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;
  await sql`
    CREATE TABLE IF NOT EXISTS central_vade_legal_events (
      event_id BIGSERIAL PRIMARY KEY,
      law_id TEXT NOT NULL,
      action TEXT NOT NULL,
      before_state JSONB,
      after_state JSONB NOT NULL,
      actor_id TEXT NOT NULL,
      actor_name TEXT NOT NULL,
      at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;
  await sql`CREATE INDEX IF NOT EXISTS central_vade_legal_events_recent ON central_vade_legal_events(at DESC,event_id DESC)`;
}

function publicRow(row) {
  return {
    id: row.law_id,
    status: row.status,
    lastVerifiedAt: row.last_verified_at || null,
    devicesUpdated: Number(row.devices_updated || 0),
    devicesAdded: Number(row.devices_added || 0),
    sourceUrls: Array.isArray(row.source_urls) ? row.source_urls : [],
    notes: String(row.notes || ''),
    updatedBy: row.updated_by_name || null,
    updatedAt: row.updated_at || null
  };
}

function normalizeUrl(value) {
  try {
    const url = new URL(String(value || '').trim());
    if (url.protocol !== 'https:') return '';
    return url.href.slice(0, 1000);
  } catch (_) {
    return '';
  }
}

export default async function handler(req, res) {
  try {
    const auth = await requireSession(req, ['admin']);
    if (!auth.ok) return send(res, auth.status, { error: auth.error });
    const sql = auth.sql;
    await ensureTables(sql);

    if (req.method === 'GET') {
      const [rows, events] = await Promise.all([
        sql`SELECT * FROM central_vade_legal_status ORDER BY law_id`,
        sql`SELECT event_id,law_id,action,actor_name,at,after_state FROM central_vade_legal_events ORDER BY event_id DESC LIMIT 150`
      ]);
      const overrides = new Map(rows.map((row) => [row.law_id, publicRow(row)]));
      const laws = seed.laws.map((law) => ({
        ...law,
        ...(overrides.get(law.id) || {}),
        sourceUrls: overrides.get(law.id)?.sourceUrls?.length ? overrides.get(law.id).sourceUrls : law.sourceUrls
      }));
      return send(res, 200, {
        generatedAt: seed.generatedAt,
        summary: {
          total: laws.length,
          verified: laws.filter((law) => law.status === 'verified').length,
          pending: laws.filter((law) => law.status !== 'verified').length
        },
        laws,
        events: events.map((event) => ({
          id: Number(event.event_id), lawId: event.law_id, action: event.action,
          by: event.actor_name, at: event.at, state: event.after_state
        }))
      });
    }

    if (req.method !== 'POST') {
      res.setHeader('Allow', 'GET, POST');
      return send(res, 405, { error: 'Método não permitido' });
    }
    if (!sameOriginRequest(req)) return send(res, 403, { error: 'Origem não permitida' });
    const body = await readJsonBody(req);
    const lawId = String(body?.lawId || '').trim();
    const status = String(body?.status || '').trim();
    if (!LAW_IDS.has(lawId) || !STATUSES.has(status)) return send(res, 400, { error: 'Legislação ou situação inválida' });
    const date = body?.lastVerifiedAt ? String(body.lastVerifiedAt) : null;
    if (date && !/^\d{4}-\d{2}-\d{2}$/.test(date)) return send(res, 400, { error: 'Data de conferência inválida' });
    const devicesUpdated = Math.max(0, Math.min(100000, Number(body?.devicesUpdated) || 0));
    const devicesAdded = Math.max(0, Math.min(100000, Number(body?.devicesAdded) || 0));
    const sourceUrls = [...new Set((Array.isArray(body?.sourceUrls) ? body.sourceUrls : []).map(normalizeUrl).filter(Boolean))].slice(0, 12);
    if (status === 'verified' && (!date || !sourceUrls.length)) return send(res, 400, { error: 'Uma conferência precisa de data e fonte oficial' });
    const notes = String(body?.notes || '').trim().slice(0, 4000);
    const beforeRows = await sql`SELECT * FROM central_vade_legal_status WHERE law_id=${lawId} LIMIT 1`;
    const before = beforeRows[0] ? publicRow(beforeRows[0]) : null;
    const after = { id: lawId, status, lastVerifiedAt: date, devicesUpdated, devicesAdded, sourceUrls, notes };

    await sql`
      WITH saved AS (
        INSERT INTO central_vade_legal_status
          (law_id,status,last_verified_at,devices_updated,devices_added,source_urls,notes,updated_by,updated_by_name)
        VALUES (${lawId},${status},${date},${devicesUpdated},${devicesAdded},${JSON.stringify(sourceUrls)}::jsonb,${notes},${auth.user.id},${auth.user.name})
        ON CONFLICT (law_id) DO UPDATE SET
          status=EXCLUDED.status,last_verified_at=EXCLUDED.last_verified_at,
          devices_updated=EXCLUDED.devices_updated,devices_added=EXCLUDED.devices_added,
          source_urls=EXCLUDED.source_urls,notes=EXCLUDED.notes,
          updated_by=EXCLUDED.updated_by,updated_by_name=EXCLUDED.updated_by_name,updated_at=NOW()
        RETURNING *
      )
      INSERT INTO central_vade_legal_events(law_id,action,before_state,after_state,actor_id,actor_name)
      SELECT ${lawId},'status_update',${before ? JSON.stringify(before) : null}::jsonb,${JSON.stringify(after)}::jsonb,${auth.user.id},${auth.user.name}
      FROM saved
    `;
    return send(res, 200, { ok: true, item: after });
  } catch (error) {
    console.error('vade audit error', String(error?.code || error?.name || 'UNKNOWN').slice(0, 40));
    return send(res, 500, { error: 'Não foi possível consultar ou registrar a auditoria jurídica' });
  }
}
