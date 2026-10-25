import test from 'node:test';
import assert from 'node:assert/strict';
import { canAccessFeature, resolveEffectivePlan } from '../lib/plan-access.js';

const now = Date.parse('2026-10-24T12:00:00.000Z');
const student = (values = {}) => ({ role: 'aluno', active: true, ...values });

test('aluno gratuito ativo recebe o plano gratuito', () => {
  const plan = resolveEffectivePlan(student({
    plan_code: 'free', subscription_status: 'active',
    starts_at: '2026-10-01T00:00:00Z', ends_at: null,
  }), now);
  assert.equal(plan.plan, 'free');
  assert.equal(plan.status, 'active');
});

test('Premium ativo libera plano Premium somente durante o período contratado', () => {
  const plan = resolveEffectivePlan(student({
    plan_code: 'premium', subscription_status: 'active',
    starts_at: '2026-10-01T00:00:00Z', ends_at: '2026-11-01T00:00:00Z',
  }), now);
  assert.equal(plan.plan, 'premium');
});

test('Premium vencido volta automaticamente ao Gratuito', () => {
  const plan = resolveEffectivePlan(student({
    plan_code: 'premium', subscription_status: 'expired',
    starts_at: '2026-09-01T00:00:00Z', ends_at: '2026-10-01T00:00:00Z',
  }), now);
  assert.equal(plan.plan, 'free');
  assert.equal(plan.status, 'fallback-free');
});

test('cancelamento mantém Premium até o fim do período pago e depois retorna ao Gratuito', () => {
  const activePeriod = resolveEffectivePlan(student({
    plan_code: 'premium', subscription_status: 'cancelled',
    starts_at: '2026-10-01T00:00:00Z', ends_at: '2026-11-01T00:00:00Z',
  }), now);
  const afterPeriod = resolveEffectivePlan(student({
    plan_code: 'premium', subscription_status: 'cancelled',
    starts_at: '2026-09-01T00:00:00Z', ends_at: '2026-10-01T00:00:00Z',
  }), now);
  assert.equal(activePeriod.plan, 'premium');
  assert.equal(afterPeriod.plan, 'free');
});

test('papel administrativo/editor não é alterado nem inferido pela assinatura', () => {
  for (const role of ['admin', 'editor']) {
    const plan = resolveEffectivePlan({
      role, active: true, plan_code: 'premium', subscription_status: 'active',
      starts_at: '2026-10-01T00:00:00Z', ends_at: '2026-11-01T00:00:00Z',
    }, now);
    assert.equal(plan.plan, null);
    assert.equal(plan.isStaff, true);
  }
});

test('aluno antigo sem plano permanece não atribuído; não ganha assinatura por inferência', () => {
  const plan = resolveEffectivePlan(student(), now);
  assert.equal(plan.plan, 'unassigned');
});

test('conta inativa nunca obtém plano comercial', () => {
  const plan = resolveEffectivePlan(student({
    active: false, plan_code: 'premium', subscription_status: 'active',
    starts_at: '2026-10-01T00:00:00Z', ends_at: '2026-11-01T00:00:00Z',
  }), now);
  assert.equal(plan.plan, 'inactive');
});

test('verificação de entitlement permite gratuito mas bloqueia links TEC/QC', async () => {
  const sql = async (parts, ...values) => {
    const query = parts.join('?');
    if (query.includes('LEFT JOIN LATERAL')) return [{
      user_id: 'fake-free', role: 'aluno', active: true,
      plan_code: 'free', subscription_status: 'active',
      starts_at: '2026-10-01T00:00:00Z', ends_at: null,
    }];
    if (query.includes('central_plan_entitlements')) {
      return [{ enabled: values.at(-1) === 'theory.summary' || values.at(-1) === 'vade_mecum' || values.at(-1) === 'lei_em_dia' || values.at(-1) === 'edital.mark.studied' }];
    }
    throw new Error('Consulta inesperada no teste');
  };
  const user = { id: 'fake-free', role: 'aluno', active: true };
  assert.equal(await canAccessFeature(sql, user, 'theory.summary'), true);
  assert.equal(await canAccessFeature(sql, user, 'tec.question_books_filters'), false);
  assert.equal(await canAccessFeature(sql, user, 'qc.question_books_filters'), false);
});
