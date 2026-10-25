import { readFile } from 'node:fs/promises';
import path from 'node:path';
import vm from 'node:vm';
import { readJsonBody, requireSession, sameOriginRequest } from './auth.js';
import { getEffectivePlan } from './plan-access.js';

const BANK_FILE = 'lei-em-dia-aprovadas-20261012.js';
const FREE_DAILY_LIMIT = 20;
let bankPromise;

function send(res, status, body, type = 'application/json; charset=utf-8') {
  res.statusCode = status;
  res.setHeader('Content-Type', type);
  res.setHeader('Cache-Control', 'private, no-store, no-cache, max-age=0');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Vary', 'Cookie');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Cross-Origin-Resource-Policy', 'same-origin');
  res.end(typeof body === 'string' ? body : JSON.stringify(body));
}

function sameSiteRead(req) {
  const fetchSite = String(req.headers?.['sec-fetch-site'] || '').toLowerCase();
  if (fetchSite === 'cross-site') return false;
  const origin = String(req.headers?.origin || '').trim();
  if (origin) return sameOriginRequest(req);
  // Legacy browsers may omit both metadata headers on a same-origin script GET.
  // This route returns filtering metadata only; question content is POST-only.
  return true;
}

async function approvedBank() {
  if (!bankPromise) {
    bankPromise = (async () => {
      const source = await readFile(path.join(process.cwd(), BANK_FILE), 'utf8');
      const questions = new vm.Script(`${source}\n;DATA_LED_APPROVED`, { filename: BANK_FILE })
        .runInNewContext({}, { timeout: 1000 });
      if (!Array.isArray(questions) || questions.length < 1) throw new Error('Banco de questões inválido');
      const unique = new Map();
      for (const question of questions) {
        const id = String(question?.id || '');
        if (id && id.length <= 200 && !unique.has(id)) unique.set(id, question);
      }
      return [...unique.values()];
    })().catch(error => { bankPromise = null; throw error; });
  }
  return bankPromise;
}

function questionById(bank, id) {
  return bank.find(question => String(question.id) === id) || null;
}

async function claimQuestion(session, id) {
  const rows = await session.sql`SELECT * FROM central_claim_lei_em_dia_question(${session.user.id},${id})`;
  return rows[0] || { allowed: false, used_count: 0, daily_limit: FREE_DAILY_LIMIT };
}

function projectCatalogQuestion(question) {
  // Filtering metadata only. Never include the prompt, choices, answer,
  // explanation, quoted legal text, or source URL in the catalog response.
  const q = question?.question || {};
  return {
    id: String(question.id),
    discipline: String(question.discipline || ''),
    topicId: String(question.topicId || ''),
    subtopic: String(question.subtopic || ''),
    number: String(question.number || ''),
    title: String(question.title || ''),
    origin: String(question.origin || ''),
    question: {
      bank: String(q.bank || ''),
      year: Number.isFinite(Number(q.year)) ? Number(q.year) : null,
      role: String(q.role || ''),
      origin: String(q.origin || ''),
    },
  };
}

export default async function handler(req, res) {
  try {
    const isCatalog = req.method === 'GET' && req.query?.mode === 'catalog';
    const isLegacy = req.method === 'GET' && req.query?.mode === 'legacy';
    const isQuestion = req.method === 'POST' && req.query?.action === 'question';
    if (isLegacy) return send(res, 410, { error: 'Entrega legada desativada; carregue o catálogo progressivo.' });
    if (!isCatalog && !isQuestion) {
      res.setHeader('Allow', 'GET, POST');
      return send(res, 405, { error: 'Ação não permitida' });
    }
    if (isCatalog && !sameSiteRead(req)) return send(res, 403, { error: 'Origem não autorizada' });
    if (isQuestion && !sameOriginRequest(req)) return send(res, 403, { error: 'Origem não autorizada' });

    const session = await requireSession(req, ['admin', 'editor', 'aluno']);
    if (!session.ok) return send(res, session.status, { error: session.error });
    const plan = await getEffectivePlan(session.sql, session.user.id);
    if (plan.status === 'inactive') return send(res, 401, { error: 'Conta inativa' });
    if (!plan.isStaff && !['free', 'premium'].includes(plan.plan)) {
      return send(res, 403, { error: 'Atribua um plano antes de acessar o Lei em Dia' });
    }
    const bank = await approvedBank();

    if (isCatalog) {
      if (!plan.isStaff && !['free', 'premium'].includes(plan.plan)) return send(res, 403, { error: 'Plano sem acesso ao Lei em Dia' });
      const catalog = bank.map(projectCatalogQuestion);
      return send(res, 200, `const DATA_LED_APPROVED = ${JSON.stringify(catalog)};`, 'application/javascript; charset=utf-8');
    }

    const body = await readJsonBody(req);
    const id = String(body?.id || '').trim();
    if (!id || id.length > 200) return send(res, 400, { error: 'Questão inválida' });
    const question = questionById(bank, id);
    if (!question) return send(res, 404, { error: 'Questão não encontrada' });
    if (!plan.isStaff && plan.plan === 'free') {
      const claim = await claimQuestion(session, id);
      if (claim.allowed !== true) return send(res, 429, {
        error: 'Você já utilizou as 20 questões gratuitas de hoje',
        used: Number(claim.used_count || 0),
        dailyLimit: Number(claim.daily_limit || FREE_DAILY_LIMIT),
        resetsAt: '00:00 America/Sao_Paulo',
      });
    }
    return send(res, 200, { question, plan: plan.isStaff ? 'staff' : plan.plan });
  } catch (error) {
    console.error('Lei em Dia delivery failed', error);
    return send(res, 503, { error: 'Questões temporariamente indisponíveis. Tente novamente.' });
  }
}

export { approvedBank, claimQuestion, projectCatalogQuestion, questionById };
