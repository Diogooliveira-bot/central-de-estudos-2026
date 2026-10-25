import crypto from 'node:crypto';
import {claimToken,hashClaimToken,sendHotmartWelcome} from './hotmart-webhook.js';
import { readJsonBody, requireSession, sameOriginRequest } from './auth.js';
import { getEffectivePlan, getPlanEntitlements } from './plan-access.js';

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


async function hotmartAdmin(req,res,session){
  const sql=session.sql;
  if(req.method==='GET'){
    const orders=await sql`
      SELECT o.transaction_id,o.product_id,o.offer_code,o.access_months,
        o.buyer_email,o.buyer_name,o.state,o.credit_applied,
        o.user_id,o.approved_at,o.revoked_at,o.claim_sent_at,
        o.claim_expires_at,o.created_at,o.updated_at,
        u.name AS student_name
      FROM public.central_hotmart_orders o
      LEFT JOIN public.central_users u ON u.user_id=o.user_id
      ORDER BY o.created_at DESC LIMIT 200
    `;
    return send(res,200,{orders});
  }
  if(req.method!=='POST'||!sameOriginRequest(req))
    return send(res,403,{error:'Origem ou método não permitido'});
  const body=await readJsonBody(req);
  if(body.action!=='resend')return send(res,400,{error:'Ação não reconhecida'});
  const transaction=String(body.transaction||'').trim();
  if(!/^[A-Za-z0-9_-]{5,120}$/.test(transaction))
    return send(res,400,{error:'Compra não identificada'});
  const token=claimToken(),hash=hashClaimToken(token);
  const expiresAt=new Date(Date.now()+7*86400000).toISOString();
  const rows=await sql`
    UPDATE public.central_hotmart_orders SET claim_token_hash=${hash},
      claim_expires_at=${expiresAt}::timestamptz,claim_sent_at=NULL,updated_at=NOW()
    WHERE transaction_id=${transaction} AND state='approved'
      AND user_id IS NULL AND credit_applied=FALSE
      AND (claim_sent_at IS NULL OR claim_sent_at<NOW()-INTERVAL '60 seconds')
    RETURNING buyer_email
  `;
  if(!rows.length)return send(res,409,{error:'Esta compra não precisa de novo convite ou já houve envio recente'});
  try{
    await sendHotmartWelcome({to:rows[0].buyer_email,token});
    await sql`
      UPDATE public.central_hotmart_orders SET claim_sent_at=NOW(),updated_at=NOW()
      WHERE transaction_id=${transaction} AND claim_token_hash=${hash}
    `;
  }catch(e){
    console.error('hotmart admin resend failed',String(e?.code||e?.name||'UNKNOWN').slice(0,20));
    return send(res,503,{error:'Não foi possível enviar o e-mail agora'});
  }
  return send(res,200,{ok:true,message:'Link de ativação reenviado ao comprador'});
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
    if (action === 'hotmart') return await hotmartAdmin(req,res,session);
    if (action === 'admin' && req.method === 'GET') return await listPlans(req, res, session.sql);
    if (action === 'admin' && req.method === 'POST') return await adminAction(req, res, session);
    return send(res, 404, { error: 'Ação não encontrada' });
  } catch (error) {
    console.error('plans api error', error);
    return send(res, 503, { error: 'O serviço de planos ainda não está disponível. Verifique a migração de homologação.' });
  }
}
