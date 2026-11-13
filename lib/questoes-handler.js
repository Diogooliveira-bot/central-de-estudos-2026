// Questões do módulo — entrega e correção feitas no servidor, com limite diário para o plano Gratuito.
//
//   GET  /api/questoes?action=modulo&disc=adm&n=3  → enunciados e alternativas (SEM gabarito/comentário)
//   POST /api/questoes?action=responder            → { disc, n, id, choice } → correção + comentário
//   GET  /api/questoes?action=uso                  → { plan, limit, used, remaining }
//
// O gabarito e o comentário só saem na resposta de "responder". No plano Gratuito cada questão
// DISTINTA respondida no dia gasta 1 da cota (central_claim_questao, migração 010); responder de
// novo a mesma questão no mesmo dia não gasta. Premium e equipe não têm limite.
// Os arquivos content/questoes/<disc>/mNN.js não são mais entregues ao navegador do aluno
// Gratuito (ver lib/protected-content.js): só este servidor os lê.
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import vm from 'node:vm';
import { readJsonBody, requireSession as realRequireSession, sameOriginRequest } from './auth.js';
import { getEffectivePlan } from './plan-access.js';

export const QUESTOES_FEATURE = 'questoes_modulo';
export const DEFAULT_FREE_DAILY_LIMIT = 5;
const DISC = /^[a-z]{2,8}$/;
const MODULE_CACHE_MAX = 64;
const cache = new Map();

function send(res, status, body) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'private, no-store, no-cache, max-age=0');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Vary', 'Cookie');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Cross-Origin-Resource-Policy', 'same-origin');
  res.end(JSON.stringify(body));
}

function sameSiteRead(req) {
  const fetchSite = String(req.headers?.['sec-fetch-site'] || '').toLowerCase();
  if (fetchSite === 'cross-site') return false;
  const origin = String(req.headers?.origin || '').trim();
  return origin ? sameOriginRequest(req) : true;
}

function parseModule(disc, n) {
  const d = String(disc || '').toLowerCase();
  const num = Number(n);
  if (!DISC.test(d) || !Number.isInteger(num) || num < 1 || num > 99) return null;
  return { disc: d, n: num };
}

/** Lê e valida um módulo do banco. Devolve a lista completa (com gabarito) — uso interno do servidor. */
export async function loadModule(disc, n, root = process.cwd()) {
  const key = `${root}|${disc}|${n}`;
  if (cache.has(key)) return cache.get(key);
  const file = path.join(root, 'content', 'questoes', disc, `m${String(n).padStart(2, '0')}.js`);
  let items = [];
  try {
    const source = await readFile(file, 'utf8');
    const sandbox = { window: {} };
    new vm.Script(source, { filename: file }).runInNewContext(sandbox, { timeout: 1000 });
    const list = sandbox.window.BC_QUESTOES?.[disc]?.[n];
    if (Array.isArray(list)) {
      items = list.filter(q => q && typeof q.id === 'string' && q.id.length <= 200
        && typeof q.q === 'string' && Array.isArray(q.options) && q.options.length === 5
        && Number.isInteger(q.answer) && q.answer >= 0 && q.answer < 5)
        .map(q => JSON.parse(JSON.stringify(q)));
    }
  } catch (error) {
    if (error?.code !== 'ENOENT') console.error('Questões: falha ao ler módulo', disc, n, error?.message);
    items = [];
  }
  if (cache.size >= MODULE_CACHE_MAX) cache.delete(cache.keys().next().value);
  cache.set(key, items);
  return items;
}

/** Projeção pública: nunca inclui gabarito, comentário nem base legal. */
export function projectStatement(q) {
  return { id: String(q.id), q: String(q.q), options: q.options.map(String), origem: String(q.origem || '') };
}

// Migração 010 ainda não aplicada (função/tabela inexistente): o recurso segue como antes, SEM limite, até que
// a migração seja aplicada — o limite liga sozinho depois. Qualquer outro erro continua sendo erro (503).
export function isMissingMigration(error) {
  const code = String(error?.code || '');
  return code === '42883' || code === '42P01' || /central_claim_questao|central_questoes_daily_usage/.test(String(error?.message || ''));
}
const SEM_LIMITE = Object.freeze({ plan: 'free', enabled: true, limit: null, used: 0, remaining: null, answeredToday: [], pendingMigration: true });

async function freeLimit(sql) {
  const rows = await sql`
    SELECT enabled, daily_limit FROM central_plan_entitlements
     WHERE plan_code = 'free' AND feature_code = ${QUESTOES_FEATURE} LIMIT 1`;
  if (!rows.length) return { enabled: true, limit: null, pendingMigration: true };   // linha ainda não criada (migração 010)
  return { enabled: rows[0].enabled === true, limit: rows[0].daily_limit == null ? null : Number(rows[0].daily_limit) };
}

async function usageOf(sql, userId, plan) {
  if (plan.isStaff) return { plan: 'staff', limit: null, used: 0, remaining: null, answeredToday: [] };
  if (plan.plan !== 'free') return { plan: plan.plan, limit: null, used: 0, remaining: null, answeredToday: [] };
  const { enabled, limit, pendingMigration } = await freeLimit(sql);
  if (pendingMigration) return { ...SEM_LIMITE, answeredToday: [] };
  let rows;
  try {
    rows = await sql`
      SELECT question_id FROM central_questoes_daily_usage
       WHERE user_id = ${userId}
         AND usage_date = (NOW() AT TIME ZONE 'America/Sao_Paulo')::DATE`;
  } catch (error) {
    if (isMissingMigration(error)) return { ...SEM_LIMITE, answeredToday: [] };
    throw error;
  }
  const answeredToday = rows.map(r => String(r.question_id));
  const used = answeredToday.length;
  return {
    plan: 'free', enabled, limit, used,
    remaining: limit == null ? null : Math.max(0, limit - used),
    answeredToday,
    resetsAt: '00:00 America/Sao_Paulo',
  };
}

export function createQuestoesHandler({ requireSession = realRequireSession, root = process.cwd() } = {}) {
  return async function handler(req, res) {
    try {
      const action = String(req.query?.action || '').toLowerCase();
      const isRead = req.method === 'GET' && (action === 'modulo' || action === 'uso');
      const isAnswer = req.method === 'POST' && action === 'responder';
      if (!isRead && !isAnswer) {
        res.setHeader('Allow', 'GET, POST');
        return send(res, 405, { error: 'Ação não permitida' });
      }
      if (isRead && !sameSiteRead(req)) return send(res, 403, { error: 'Origem não autorizada' });
      if (isAnswer && !sameOriginRequest(req)) return send(res, 403, { error: 'Origem não autorizada' });

      const session = await requireSession(req, ['admin', 'editor', 'aluno']);
      if (!session.ok) return send(res, session.status, { error: session.error });
      const plan = await getEffectivePlan(session.sql, session.user.id);
      if (plan.status === 'inactive') return send(res, 401, { error: 'Conta inativa' });
      if (!plan.isStaff && !['free', 'premium'].includes(plan.plan)) {
        return send(res, 403, { error: 'Atribua um plano antes de acessar as questões' });
      }

      if (action === 'uso') {
        const usage = await usageOf(session.sql, session.user.id, plan);
        return send(res, 200, { usage });
      }

      if (action === 'modulo') {
        const mod = parseModule(req.query?.disc, req.query?.n);
        if (!mod) return send(res, 400, { error: 'Módulo inválido' });
        const items = await loadModule(mod.disc, mod.n, root);
        if (!items.length) return send(res, 404, { error: 'Módulo sem questões' });
        const usage = await usageOf(session.sql, session.user.id, plan);
        return send(res, 200, { disc: mod.disc, n: mod.n, items: items.map(projectStatement), usage });
      }

      // ---- responder ----
      const body = await readJsonBody(req);
      const mod = parseModule(body?.disc, body?.n);
      const id = String(body?.id || '').trim();
      const choice = body?.choice;
      if (!mod || !id || id.length > 200) return send(res, 400, { error: 'Questão inválida' });
      if (!Number.isInteger(choice) || choice < 0 || choice > 4) return send(res, 400, { error: 'Alternativa inválida' });
      const items = await loadModule(mod.disc, mod.n, root);
      const question = items.find(q => q.id === id);
      if (!question) return send(res, 404, { error: 'Questão não encontrada' });

      let usage;
      if (!plan.isStaff && plan.plan === 'free') {
        let rows;
        try {
          const pendente = (await freeLimit(session.sql)).pendingMigration === true;
          rows = pendente ? [{ allowed: true, already_counted: false, used_count: 0, daily_limit: null, effective_plan: 'free' }]
            : await session.sql`SELECT * FROM central_claim_questao(${session.user.id},${id})`;
        } catch (error) {
          if (!isMissingMigration(error)) throw error;
          console.warn('Questões: migração 010 não aplicada; limite diário desligado até lá');
          rows = [{ allowed: true, already_counted: false, used_count: 0, daily_limit: null, effective_plan: 'free' }];
        }
        const claim = rows[0] || { allowed: false, used_count: 0, daily_limit: DEFAULT_FREE_DAILY_LIMIT };
        if (claim.allowed !== true) {
          const limit = claim.daily_limit == null ? null : Number(claim.daily_limit);
          if (claim.effective_plan == null) return send(res, 403, { error: 'Conta sem acesso às questões' });
          if (limit === 0) return send(res, 403, { error: 'Este recurso não está disponível no seu plano' });
          return send(res, 429, {
            error: `Você já respondeu as ${limit} questões gratuitas de hoje`,
            code: 'DAILY_LIMIT',
            used: Number(claim.used_count || 0),
            dailyLimit: limit,
            resetsAt: '00:00 America/Sao_Paulo',
          });
        }
        const limit = claim.daily_limit == null ? null : Number(claim.daily_limit);
        const used = Number(claim.used_count || 0);
        usage = { plan: 'free', limit, used, remaining: limit == null ? null : Math.max(0, limit - used), alreadyCounted: claim.already_counted === true };
      } else {
        usage = { plan: plan.isStaff ? 'staff' : plan.plan, limit: null, used: 0, remaining: null };
      }
      return send(res, 200, {
        id, choice, correct: choice === question.answer, answer: question.answer,
        explanation: String(question.explanation || ''), lawRef: String(question.lawRef || ''),
        usage,
      });
    } catch (error) {
      console.error('Questões: falha na entrega', error?.message);
      return send(res, 503, { error: 'Questões temporariamente indisponíveis. Tente novamente.' });
    }
  };
}

export default createQuestoesHandler();
