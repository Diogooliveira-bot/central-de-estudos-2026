import crypto from 'node:crypto';
import { readJsonBody, requireSession, sameOriginRequest } from '../lib/auth.js';
import { getEffectivePlan, getPlanEntitlements } from '../lib/plan-access.js';

function send(res, status, body) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'private, no-store');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.end(JSON.stringify(body));
}

function validDate(value, required = false) {
  if ((value == null || value === '') && !required) return null;
  const date = new Date(value);
  return Number.isFinite(date.getTime()) ? date.toISOString() : undefined;
}

async function currentPlan(req, res) {
  const session = await requireSession(req);
  if (!session.ok) return send(res, session.status, { error: session.error });
  const plan = await getEffectivePlan(session.sql, session.user.id);
  const entitlements = await getPlanEntitlements(session.sql, plan.plan);
  return send(res, 200, {
    role: session.user.role,
    plan: plan.plan,
    status: plan.status,
    startsAt: plan.startsAt || null,
    endsAt: plan.endsAt || null,
    isStaff: plan.isStaff === true,
    entitlements,
  });
}

async function listPlans(req, res, sql) {
  const userId = String(req.query?.userId || '').trim();
  if (userId) {
    const rows = await sql`
      SELECT s.subscription_id,s.user_id,s.plan_code,s.status,s.starts_at,s.ends_at,
             s.cancelled_at,s.grant_source,s.provider_subscription_id,s.granted_by,
             s.created_at,s.updated_at
        FROM central_user_subscriptions AS s
       WHERE s.user_id=${userId}
       ORDER BY s.created_at DESC
       LIMIT 100
    `;
    return send(res, 200, { subscriptions: rows });
  }
  const rows = await sql`
    SELECT u.user_id,u.name,u.email,u.role,u.active,
           s.subscription_id,s.plan_code,s.status AS subscription_status,
           s.starts_at,s.ends_at,s.cancelled_at
      FROM central_users AS u
      LEFT JOIN LATERAL (
        SELECT subscription_id,plan_code,status,starts_at,ends_at,cancelled_at
          FROM central_user_subscriptions
         WHERE user_id=u.user_id
         ORDER BY starts_at DESC,created_at DESC
         LIMIT 1
      ) AS s ON TRUE
     ORDER BY u.name ASC
     LIMIT 500
  `;
  return send(res, 200, { users: rows });
}

async function adminAction(req, res, session) {
  if (req.method !== 'POST' || !sameOriginRequest(req)) {
    return send(res, req.method === 'POST' ? 403 : 405, { error: 'Método ou origem não permitido' });
  }
  const body = await readJsonBody(req);
  const action = String(body.action || '').toLowerCase();
  if (action === 'assign') {
    const userId = String(body.userId || '').trim();
    const planCode = String(body.planCode || '').toLowerCase();
    const startsAt = validDate(body.startsAt || new Date().toISOString(), true);
    const endsAt = validDate(body.endsAt, planCode === 'premium');
    if (!userId || !['free', 'premium'].includes(planCode) || !startsAt || endsAt === undefined) {
      return send(res, 400, { error: 'Dados da atribuição inválidos' });
    }
    if (new Date(startsAt).getTime() > Date.now()) {
      return send(res, 400, { error: 'A ativação futura ainda não é suportada' });
    }
    if (planCode === 'premium' && new Date(endsAt).getTime() <= new Date(startsAt).getTime()) {
      return send(res, 400, { error: 'O vencimento deve ser posterior ao início' });
    }
    const rows = await session.sql`
      SELECT * FROM central_admin_assign_plan(
        ${session.user.id},${userId},${planCode},${crypto.randomUUID()},
        ${startsAt}::timestamptz,${endsAt}::timestamptz
      )
    `;
    if (!rows.length) return send(res, 404, { error: 'Aluno não encontrado ou não elegível' });
    return send(res, 200, { ok: true, subscription: rows[0] });
  }

  if (action === 'cancel' || action === 'expire') {
    const subscriptionId = String(body.subscriptionId || '').trim();
    if (!/^[0-9a-f-]{36}$/i.test(subscriptionId)) return send(res, 400, { error: 'Assinatura inválida' });
    const rows = action === 'cancel'
      ? await session.sql`SELECT * FROM central_admin_cancel_plan(${session.user.id},${subscriptionId})`
      : await session.sql`SELECT * FROM central_admin_expire_plan(${session.user.id},${subscriptionId})`;
    if (!rows.length) return send(res, 404, { error: 'Assinatura não encontrada' });
    return send(res, 200, { ok: true, subscription: rows[0] });
  }
  return send(res, 400, { error: 'Ação inválida' });
}

export default async function handler(req, res) {
  try {
    const action = String(req.query?.action || 'me').toLowerCase();
    if (action === 'me' && req.method === 'GET') return await currentPlan(req, res);
    if (req.method !== 'GET' && req.method !== 'POST') {
      res.setHeader('Allow', 'GET, POST');
      return send(res, 405, { error: 'Método não permitido' });
    }
    if (req.method === 'POST' && !sameOriginRequest(req)) return send(res, 403, { error: 'Origem não permitida' });
    const session = await requireSession(req, ['admin']);
    if (!session.ok) return send(res, session.status, { error: session.error });
    if (action === 'admin' && req.method === 'GET') return await listPlans(req, res, session.sql);
    if (action === 'admin' && req.method === 'POST') return await adminAction(req, res, session);
    return send(res, 404, { error: 'Ação não encontrada' });
  } catch (error) {
    console.error('plans api error', error);
    return send(res, 503, { error: 'O serviço de planos ainda não está disponível. Verifique a migração de homologação.' });
  }
}
