import { requireSession } from './auth.js';

export const PLAN_FEATURES = Object.freeze([
  'theory.summary',
  'theory.complete',
  'vade_mecum',
  'lei_em_dia',
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

export async function canAccessFeature(sql, user, featureCode) {
  if (!user || user.active === false) return false;
  // Staff permissions remain role-based and never turn a student into Premium.
  if (STAFF_ROLES.has(String(user.role || '').toLowerCase())) return true;
  const current = await getEffectivePlan(sql, user.id || user.user_id);
  if (current.plan !== 'free' && current.plan !== 'premium') return false;
  const rows = await sql`
    SELECT enabled FROM central_plan_entitlements
     WHERE plan_code=${current.plan} AND feature_code=${String(featureCode)}
     LIMIT 1
  `;
  return rows[0]?.enabled === true;
}

export async function requirePlanFeature(req, featureCode, allowedRoles = ['admin', 'editor', 'aluno']) {
  const session = await requireSession(req, allowedRoles);
  if (!session.ok) return session;
  const current = await getEffectivePlan(session.sql, session.user.id);
  if (current.status === 'inactive') return { ok: false, status: 401, error: 'Conta inativa' };
  const allowed = await canAccessFeature(session.sql, session.user, featureCode);
  if (!allowed) return {
    ok: false,
    status: current.status === 'unassigned' ? 403 : 403,
    error: 'Este recurso não está incluído no seu plano atual',
    plan: current,
  };
  return { ...session, plan: current };
}
