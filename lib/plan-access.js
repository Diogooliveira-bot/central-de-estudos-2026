import { requireSession } from './auth.js';

export const PLAN_FEATURES = Object.freeze([
  'theory.summary',
  'theory.complete',
  'vade_mecum',
  'lei_em_dia',
  'questoes_modulo',
  'tec.links',
  'qc.links',
  'tec.question_books_filters',
  'qc.question_books_filters',
  'premium.reviews',
  'progress.advanced_sync',
  'edital.mark.studied',
  'edital.mark.reviewed',
  'edital.mark.questions',
  'edital.sync',
]);

const STAFF_ROLES = new Set(['admin', 'editor']);

function asTime(value) {
  if (value == null || value === '') return null;
  const time = value instanceof Date ? value.getTime() : new Date(value).getTime();
  return Number.isFinite(time) ? time : null;
}

/** Pure rule resolver shared by API handlers and unit tests. */
export function resolveEffectivePlan(record, now = Date.now()) {
  const role = String(record?.role || '').toLowerCase();
  if (record?.active === false) return { role, plan: 'inactive', status: 'inactive', isStaff: false };
  if (STAFF_ROLES.has(role)) return { role, plan: null, status: 'staff', isStaff: true };
  if (role !== 'aluno') return { role, plan: 'unassigned', status: 'unassigned', isStaff: false };

  const plan = String(record?.plan_code || '').toLowerCase();
  const state = String(record?.subscription_status || '').toLowerCase();
  const startsAt = asTime(record?.starts_at);
  const endsAt = asTime(record?.ends_at);
  if (!plan || !state || startsAt == null || startsAt > now) {
    return { role, plan: 'unassigned', status: 'unassigned', isStaff: false };
  }

  if (plan === 'premium') {
    const inPaidPeriod = endsAt != null && endsAt > now;
    if ((state === 'active' || state === 'cancelled') && inPaidPeriod) {
      return { role, plan: 'premium', status: state, startsAt: record.starts_at, endsAt: record.ends_at, isStaff: false };
    }
    if (state === 'expired' || state === 'cancelled' || (endsAt != null && endsAt <= now)) {
      return { role, plan: 'free', status: 'fallback-free', startsAt: record.starts_at, endsAt: record.ends_at, isStaff: false };
    }
    return { role, plan: 'unassigned', status: 'unassigned', isStaff: false };
  }

  if (plan === 'free' && state === 'active' && (endsAt == null || endsAt > now)) {
    return { role, plan: 'free', status: 'active', startsAt: record.starts_at, endsAt: record.ends_at, isStaff: false };
  }
  return { role, plan: 'unassigned', status: 'unassigned', isStaff: false };
}

export async function getEffectivePlan(sql, userId) {
  const rows = await sql`
    SELECT u.user_id,u.role,u.active,
           s.plan_code,s.status AS subscription_status,s.starts_at,s.ends_at,s.cancelled_at
      FROM central_users AS u
      LEFT JOIN LATERAL (
        SELECT plan_code,status,starts_at,ends_at,cancelled_at
          FROM central_user_subscriptions
         WHERE user_id=u.user_id AND starts_at <= NOW()
         ORDER BY starts_at DESC,created_at DESC
         LIMIT 1
      ) AS s ON TRUE
     WHERE u.user_id=${String(userId)}
     LIMIT 1
  `;
  if (!rows.length) return { role: '', plan: 'inactive', status: 'inactive', isStaff: false };
  return resolveEffectivePlan(rows[0]);
}

export async function getPlanEntitlements(sql, planCode) {
  if (!['free', 'premium'].includes(planCode)) return {};
  const rows = await sql`
    SELECT feature_code,enabled,daily_limit
      FROM central_plan_entitlements
     WHERE plan_code=${planCode}
  `;
  return Object.fromEntries(rows.map(row => [String(row.feature_code), {
    enabled: row.enabled === true,
    dailyLimit: row.daily_limit == null ? null : Number(row.daily_limit),
  }]));
}

export async function canAccessFeature(sql, user, featureCode, knownPlan = null) {
  if (!user || user.active === false) return false;
  // Staff permissions remain role-based and never turn a student into Premium.
  if (STAFF_ROLES.has(String(user.role || '').toLowerCase())) return true;
  const current = knownPlan || await getEffectivePlan(sql, user.id || user.user_id);
  if (current.plan !== 'free' && current.plan !== 'premium') return false;
  const rows = await sql`
    SELECT enabled FROM central_plan_entitlements
     WHERE plan_code=${current.plan} AND feature_code=${String(featureCode)}
     LIMIT 1
  `;
  return rows[0]?.enabled === true;
}

/**
 * Plano efetivo + permissão do recurso em UMA consulta (antes eram 4 a 5).
 * A regra de qual plano vale (vencimento, cancelamento...) continua em resolveEffectivePlan; o banco só devolve
 * a assinatura mais recente e se o recurso está ligado em cada plano.
 */
export async function getPlanAccess(sql, userId, featureCode) {
  const rows = await sql`
    SELECT u.user_id,u.role,u.active,
           s.plan_code,s.status AS subscription_status,s.starts_at,s.ends_at,s.cancelled_at,
           COALESCE((SELECT BOOL_OR(e.enabled) FROM central_plan_entitlements e
                      WHERE e.plan_code='free' AND e.feature_code=${String(featureCode)}), FALSE) AS free_enabled,
           COALESCE((SELECT BOOL_OR(e.enabled) FROM central_plan_entitlements e
                      WHERE e.plan_code='premium' AND e.feature_code=${String(featureCode)}), FALSE) AS premium_enabled
      FROM central_users AS u
      LEFT JOIN LATERAL (
        SELECT plan_code,status,starts_at,ends_at,cancelled_at
          FROM central_user_subscriptions
         WHERE user_id=u.user_id AND starts_at <= NOW()
         ORDER BY starts_at DESC,created_at DESC
         LIMIT 1
      ) AS s ON TRUE
     WHERE u.user_id=${String(userId)}
     LIMIT 1
  `;
  if (!rows.length) return { current: { role: '', plan: 'inactive', status: 'inactive', isStaff: false }, allowed: false };
  const current = resolveEffectivePlan(rows[0]);
  const allowed = current.plan === 'free' ? rows[0].free_enabled === true
    : current.plan === 'premium' ? rows[0].premium_enabled === true : false;
  return { current, allowed };
}

export async function requirePlanFeature(req, featureCode, allowedRoles = ['admin', 'editor', 'aluno']) {
  const session = await requireSession(req, allowedRoles);
  if (!session.ok) return session;
  // Administração/edição não depende de assinatura: a sessão já confirmou que a conta está ativa (0 consultas extras).
  if (STAFF_ROLES.has(String(session.user.role || '').toLowerCase())) {
    return { ...session, plan: { role: String(session.user.role).toLowerCase(), plan: null, status: 'staff', isStaff: true } };
  }
  const { current, allowed } = await getPlanAccess(session.sql, session.user.id, featureCode);
  if (current.status === 'inactive') return { ok: false, status: 401, error: 'Conta inativa' };
  if (!allowed) return {
    ok: false,
    status: 403,
    error: 'Este recurso não está incluído no seu plano atual',
    plan: current,
  };
  return { ...session, plan: current };
}
