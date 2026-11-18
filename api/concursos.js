import { readJsonBody, requireSession, sameOriginRequest } from '../lib/auth.js';
import { CONCURSOS_2026_SEED, RESEARCH_REJECTIONS } from '../lib/concursos-seed.js';

const ID = /^[a-z0-9][a-z0-9-]{2,79}$/;
const STATUS = new Set(['publicado', 'previsto', 'encerrado']);

function send(res, status, body) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'private, no-store');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.end(JSON.stringify(body));
}

async function ensureTables(sql) {
  await sql`CREATE TABLE IF NOT EXISTS central_contests (
    contest_id TEXT PRIMARY KEY,
    data JSONB NOT NULL,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    revision INTEGER NOT NULL DEFAULT 1,
    created_by TEXT,
    updated_by TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  )`;
  await sql`CREATE TABLE IF NOT EXISTS central_contest_audit (
    audit_id BIGSERIAL PRIMARY KEY,
    contest_id TEXT NOT NULL,
    action TEXT NOT NULL CHECK(action IN ('seed','create','update','activate','deactivate')),
    actor_id TEXT,
    actor_name TEXT NOT NULL,
    revision INTEGER NOT NULL,
    snapshot JSONB NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  )`;
  await sql`CREATE INDEX IF NOT EXISTS central_contest_audit_recent_idx ON central_contest_audit(created_at DESC,audit_id DESC)`;
  for (const item of CONCURSOS_2026_SEED) {
    const encoded = JSON.stringify(item);
    const inserted = await sql`INSERT INTO central_contests(contest_id,data,active,created_by,updated_by)
      VALUES(${item.id},${encoded}::jsonb,${item.active !== false},'system-seed','system-seed')
      ON CONFLICT(contest_id) DO NOTHING RETURNING contest_id,revision,data`;
    if (inserted.length) await sql`INSERT INTO central_contest_audit(contest_id,action,actor_id,actor_name,revision,snapshot)
      VALUES(${item.id},'seed','system-seed','Catálogo oficial 2026',1,${encoded}::jsonb)`;
  }
}

function cleanText(value, max = 300) {
  return String(value || '').trim().replace(/\s+/g, ' ').slice(0, max);
}
function validHttps(value) {
  try { return new URL(String(value)).protocol === 'https:'; } catch (_) { return false; }
}
function normalizeContest(input, existing = null) {
  const data = input && typeof input === 'object' && !Array.isArray(input) ? input : {};
  const id = cleanText(data.id || existing?.id, 80).toLowerCase();
  if (!ID.test(id)) throw Object.assign(new Error('Identificador inválido'), {statusCode:400});
  const name = cleanText(data.name, 180);
  const organ = cleanText(data.organ, 180);
  const state = cleanText(data.state, 30);
  const sphere = cleanText(data.sphere, 30);
  const status = cleanText(data.status, 20).toLowerCase();
  if (!name || !organ || !state || !sphere || !STATUS.has(status)) throw Object.assign(new Error('Preencha nome, órgão, local, esfera e situação'), {statusCode:400});
  const year = Number(data.year || 2026);
  if (!Number.isInteger(year) || year < 2023 || year > 2030) throw Object.assign(new Error('Ano inválido'), {statusCode:400});
  const sources = Array.isArray(data.sources) ? data.sources.slice(0, 30).map((source) => ({
    type: cleanText(source?.type, 40) || 'oficial',
    title: cleanText(source?.title, 220),
    url: cleanText(source?.url, 1000)
  })).filter((source) => source.title && validHttps(source.url)) : [];
  if (!sources.length) throw Object.assign(new Error('Inclua ao menos uma fonte oficial HTTPS'), {statusCode:400});
  const cargos = Array.isArray(data.cargos) ? data.cargos.slice(0, 80).map((cargo) => ({
    name: cleanText(cargo?.name, 180), education: cleanText(cargo?.education, 160),
    vacancies: cargo?.vacancies == null ? null : (Number.isFinite(Number(cargo.vacancies)) ? Number(cargo.vacancies) : cleanText(cargo.vacancies, 100)),
    salary: cleanText(cargo?.salary, 120) || null
  })).filter((cargo) => cargo.name) : [];
  const subjects = Array.isArray(data.subjects) ? data.subjects.slice(0, 120).map((subject, index) => ({
    id: cleanText(subject?.id || `${id}-d${index + 1}`, 100), name: cleanText(subject?.name, 180),
    centralId: cleanText(subject?.centralId, 30) || null,
    coverage: ['complete','partial','missing'].includes(subject?.coverage) ? subject.coverage : 'missing',
    topics: Array.isArray(subject?.topics) ? subject.topics.slice(0, 120).map((topic) => cleanText(topic, 500)).filter(Boolean) : [],
    weight: Math.max(1, Math.min(1000, Number(subject?.weight) || 1)),
    moduleIds: Array.isArray(subject?.moduleIds) ? subject.moduleIds.slice(0, 80).map((module) => cleanText(module, 100)).filter(Boolean) : []
  })).filter((subject) => subject.name) : [];
  return {
    id, name, organ, state, sphere, year, status,
    noticeNumber: cleanText(data.noticeNumber, 80) || null,
    noticeDate: cleanText(data.noticeDate, 20) || null,
    board: cleanText(data.board, 180) || null,
    vacancies: data.vacancies == null || data.vacancies === '' ? null : Number(data.vacancies),
    salary: cleanText(data.salary, 200) || null,
    registrationStart: cleanText(data.registrationStart, 20) || null,
    registrationEnd: cleanText(data.registrationEnd, 20) || null,
    examDate: cleanText(data.examDate, 20) || null,
    lastVerified: cleanText(data.lastVerified, 20) || new Date().toISOString().slice(0,10),
    currentStage: cleanText(data.currentStage, 500) || null,
    currentStageDate: cleanText(data.currentStageDate, 20) || null,
    featured: data.featured === true,
    active: data.active !== false,
    summary: cleanText(data.summary, 1200),
    pending: Array.isArray(data.pending) ? data.pending.slice(0, 40).map((value) => cleanText(value, 400)).filter(Boolean) : [],
    sources, cargos, subjects
  };
}

function coverage(data) {
  const subjects = Array.isArray(data?.subjects) ? data.subjects : [];
  const total = subjects.reduce((sum, item) => sum + Math.max(1, Number(item.weight) || 1), 0);
  const points = subjects.reduce((sum, item) => sum + Math.max(1, Number(item.weight) || 1) * (item.coverage === 'complete' ? 1 : item.coverage === 'partial' ? .5 : 0), 0);
  return {percent: total ? Math.round(points * 100 / total) : 0, method:'Média ponderada por blocos do programa: completa = 100%, parcial = 50%, ausente = 0%.'};
}

export default async function handler(req, res) {
  if (!['GET','POST','PUT'].includes(req.method)) { res.setHeader('Allow','GET, POST, PUT'); return send(res,405,{error:'Método não permitido'}); }
  if (req.method !== 'GET' && !sameOriginRequest(req)) return send(res,403,{error:'Origem não autorizada'});
  const session = await requireSession(req, req.method === 'GET' ? ['admin','editor','aluno'] : ['admin']);
  if (!session.ok) return send(res, session.status, {error:session.error});
  try {
    await ensureTables(session.sql);
    if (req.method === 'GET') {
      const includeInactive = session.user.role === 'admin' && String(req.query?.admin || '') === '1';
      const rows = includeInactive
        ? await session.sql`SELECT contest_id,data,active,revision,updated_at FROM central_contests ORDER BY (data->>'featured')::boolean DESC,data->>'state',data->>'name'`
        : await session.sql`SELECT contest_id,data,active,revision,updated_at FROM central_contests WHERE active=TRUE ORDER BY (data->>'featured')::boolean DESC,data->>'state',data->>'name'`;
      const items = rows.map((row) => ({...row.data,id:row.contest_id,active:row.active,revision:Number(row.revision),updatedAt:row.updated_at,coverage:coverage(row.data)}));
      const events = includeInactive ? await session.sql`SELECT contest_id,action,actor_name,revision,created_at FROM central_contest_audit ORDER BY audit_id DESC LIMIT 120` : [];
      return send(res,200,{items,canManage:session.user.role === 'admin',researchRejections:session.user.role === 'admin' ? RESEARCH_REJECTIONS : [],events:events.map((event)=>({contestId:event.contest_id,action:event.action,by:event.actor_name,revision:Number(event.revision),at:event.created_at}))});
    }
    const body = await readJsonBody(req);
    const action = cleanText(body?.action, 30).toLowerCase();
    if (action === 'toggle') {
      const id = cleanText(body?.id,80).toLowerCase();
      const active = body?.active === true;
      if (!ID.test(id)) return send(res,400,{error:'Concurso inválido'});
      const rows = await session.sql`WITH updated AS (
        UPDATE central_contests SET active=${active},revision=revision+1,updated_by=${session.user.id},updated_at=NOW()
        WHERE contest_id=${id} AND revision=${Number(body?.revision)} RETURNING *
      ), audit AS (
        INSERT INTO central_contest_audit(contest_id,action,actor_id,actor_name,revision,snapshot)
        SELECT contest_id,${active?'activate':'deactivate'},${session.user.id},${session.user.name},revision,data FROM updated RETURNING audit_id
      ) SELECT updated.* FROM updated JOIN audit ON TRUE`;
      if (!rows.length) return send(res,409,{error:'O registro foi alterado por outro administrador. Recarregue antes de salvar.'});
      return send(res,200,{ok:true,id,active,revision:Number(rows[0].revision)});
    }
    if (!['create','update'].includes(action)) return send(res,400,{error:'Ação inválida'});
    const id = cleanText(body?.data?.id,80).toLowerCase();
    const current = action === 'update' && ID.test(id) ? await session.sql`SELECT * FROM central_contests WHERE contest_id=${id} LIMIT 1` : [];
    if (action === 'update' && !current.length) return send(res,404,{error:'Concurso não encontrado'});
    const data = normalizeContest(body?.data, current[0]?.data || null);
    const encoded = JSON.stringify(data);
    if (action === 'create') {
      const rows = await session.sql`WITH created AS (
        INSERT INTO central_contests(contest_id,data,active,created_by,updated_by)
        VALUES(${data.id},${encoded}::jsonb,${data.active},${session.user.id},${session.user.id})
        ON CONFLICT(contest_id) DO NOTHING RETURNING *
      ), audit AS (
        INSERT INTO central_contest_audit(contest_id,action,actor_id,actor_name,revision,snapshot)
        SELECT contest_id,'create',${session.user.id},${session.user.name},revision,data FROM created RETURNING audit_id
      ) SELECT created.* FROM created JOIN audit ON TRUE`;
      if (!rows.length) return send(res,409,{error:'Já existe um concurso com esse identificador'});
      return send(res,201,{ok:true,item:{...rows[0].data,revision:Number(rows[0].revision)}});
    }
    const expected = Number(body?.revision);
    const rows = await session.sql`WITH updated AS (
      UPDATE central_contests SET data=${encoded}::jsonb,active=${data.active},revision=revision+1,updated_by=${session.user.id},updated_at=NOW()
      WHERE contest_id=${data.id} AND revision=${expected} RETURNING *
    ), audit AS (
      INSERT INTO central_contest_audit(contest_id,action,actor_id,actor_name,revision,snapshot)
      SELECT contest_id,'update',${session.user.id},${session.user.name},revision,data FROM updated RETURNING audit_id
    ) SELECT updated.* FROM updated JOIN audit ON TRUE`;
    if (!rows.length) return send(res,409,{error:'O registro foi alterado por outro administrador. Recarregue antes de salvar.'});
    return send(res,200,{ok:true,item:{...rows[0].data,revision:Number(rows[0].revision)}});
  } catch (error) {
    console.error('concursos catalog', String(error?.code || error?.name || 'UNKNOWN').slice(0,60));
    return send(res, error?.statusCode || 500, {error:error?.statusCode ? error.message : 'Não foi possível acessar o catálogo de concursos'});
  }
}

export { coverage, normalizeContest };
