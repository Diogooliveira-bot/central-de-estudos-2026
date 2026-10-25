import crypto from 'node:crypto';
import {
  clearSessionCookie,
  createSessionToken,
  database,
  ensureUsersTable,
  hashPassword,
  normalizeEmail,
  publicUser,
  readJsonBody,
  requireSession,
  safeSecretEqual,
  sessionCookie,
  sameOriginRequest,
  validatePassword,
  verifyPassword,
} from '../lib/auth.js';
import handleInviteAction from '../lib/invite-handler.js';
import handlePasswordReset from '../lib/password-reset.js';
import handleLeiEmDiaQuestions from '../lib/lei-em-dia-questions-handler.js';
import handlePlans from '../lib/plans-handler.js';
import handlePrivateContent from '../lib/private-content-handler.js';

function send(res, status, body, extraHeaders = {}) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  for (const [key, value] of Object.entries(extraHeaders)) res.setHeader(key, value);
  res.end(JSON.stringify(body));
}

function cleanName(value) {
  return String(value || '').trim().replace(/\s+/g, ' ').slice(0, 120);
}

function validEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

async function bootstrapStatus(res) {
  const sql = database();
  await ensureUsersTable(sql);
  const rows = await sql`SELECT COUNT(*)::int AS count FROM central_users WHERE role='admin' AND active=TRUE`;
  return send(res, 200, { needsBootstrap: Number(rows[0]?.count || 0) === 0 });
}

/**
 * Preview-only synthetic identity. It has no database account, admin access,
 * or permission to call any other API (middleware rejects guest requests).
 */
function isPreviewGuest(req) {
  const secret = String(process.env.BC_PREVIEW_GUEST_TOKEN || '');
  if (process.env.VERCEL_ENV !== 'preview' || secret.length < 40) return false;
  const encoded = String(req.headers?.cookie || '').split(';').map(s => s.trim())
    .find(s => s.startsWith('bc_preview_guest='));
  if (!encoded) return false;
  let supplied;
  try { supplied = decodeURIComponent(encoded.slice('bc_preview_guest='.length)); }
  catch (_) { return false; }
  if (supplied.length < 40 || supplied.length > 128) return false;
  const actualHash = crypto.createHash('sha256').update(supplied).digest();
  const expectedHash = crypto.createHash('sha256').update(secret).digest();
  return crypto.timingSafeEqual(actualHash, expectedHash);
}

async function currentUser(req, res) {
  if (isPreviewGuest(req)) {
    return send(res, 200, {
      authenticated: true,
      previewGuest: true,
      user: {
        id: 'base-completa-preview-guest',
        name: 'Modo de testes',
        email: 'preview@local.invalid',
        role: 'aluno',
        active: true,
      },
    });
  }
  const session = await requireSession(req);
  if (!session.ok) return send(res, 200, { authenticated: false });
  return send(res, 200, { authenticated: true, user: session.user });
}

async function login(req, res) {
  const body = await readJsonBody(req);
  const email = normalizeEmail(body.email);
  const password = String(body.password || '');
  const remember = body.remember === true;
  if (!email || !password) return send(res, 400, { error: 'Informe e-mail e senha' });

  const sql = database();
  await ensureUsersTable(sql);
  const rows = await sql`
    SELECT user_id,name,email,role,password_hash,active,failed_attempts,locked_until,session_version,created_at,updated_at,last_login
    FROM central_users
    WHERE LOWER(email)=${email}
    LIMIT 1
  `;
  const row = rows[0];

  if (!row) {
    await new Promise((resolve) => setTimeout(resolve, 350));
    return send(res, 401, { error: 'E-mail ou senha inválidos' });
  }
  if (row.active === false) return send(res, 403, { error: 'Este usuário está desativado' });
  if (row.locked_until && new Date(row.locked_until).getTime() > Date.now()) {
    return send(res, 429, { error: 'Muitas tentativas. Aguarde alguns minutos e tente novamente' });
  }

  const passwordOk = verifyPassword(password, row.password_hash);
  if (!passwordOk) {
    const attempts = Number(row.failed_attempts || 0) + 1;
    const shouldLock = attempts >= 5;
    await sql`
      UPDATE central_users
      SET failed_attempts=${shouldLock ? 0 : attempts},
          locked_until=${shouldLock ? new Date(Date.now() + 10 * 60 * 1000).toISOString() : null},
          updated_at=NOW()
      WHERE user_id=${row.user_id}
    `;
    return send(res, 401, { error: shouldLock ? 'Muitas tentativas. A conta foi bloqueada por 10 minutos' : 'E-mail ou senha inválidos' });
  }

  await sql`
    UPDATE central_users
    SET failed_attempts=0, locked_until=NULL, last_login=NOW(), updated_at=NOW()
    WHERE user_id=${row.user_id}
  `;
  row.last_login = new Date().toISOString();
  const ttl = remember ? 30 * 24 * 60 * 60 : undefined;
  const token = createSessionToken(row, ttl);
  return send(res, 200, { ok: true, user: publicUser(row), remembered: remember }, { 'Set-Cookie': sessionCookie(token, ttl) });
}

async function logout(res) {
  return send(res, 200, { ok: true }, { 'Set-Cookie': clearSessionCookie() });
}

async function bootstrap(req, res) {
  const expected = String(process.env.BACKUP_SECRET || '');
  if (!expected) return send(res, 503, { error: 'BACKUP_SECRET não configurado no Vercel' });
  const body = await readJsonBody(req);
  const received = req.headers['x-backup-key'] || body.backupSecret;
  if (!safeSecretEqual(received, expected)) return send(res, 401, { error: 'Chave administrativa inválida' });

  const name = cleanName(body.name);
  const email = normalizeEmail(body.email);
  const password = String(body.password || '');
  const passwordError = validatePassword(password);
  if (!name) return send(res, 400, { error: 'Informe o nome do administrador' });
  if (!validEmail(email)) return send(res, 400, { error: 'Informe um e-mail válido' });
  if (passwordError) return send(res, 400, { error: passwordError });

  const sql = database();
  await ensureUsersTable(sql);
  const admins = await sql`SELECT COUNT(*)::int AS count FROM central_users WHERE role='admin' AND active=TRUE`;
  if (Number(admins[0]?.count || 0) > 0) return send(res, 409, { error: 'O administrador inicial já foi criado' });

  const userId = crypto.randomUUID();
  const passwordHash = hashPassword(password);
  const rows = await sql`
    INSERT INTO central_users(user_id,name,email,role,password_hash,active)
    VALUES(${userId},${name},${email},'admin',${passwordHash},TRUE)
    RETURNING user_id,name,email,role,active,session_version,created_at,updated_at,last_login
  `;
  const token = createSessionToken(rows[0]);
  return send(res, 201, { ok: true, user: publicUser(rows[0]) }, { 'Set-Cookie': sessionCookie(token) });
}

export default async function handler(req, res) {
  try {
    const premiumApi = String(req.query?.bc_api || '').toLowerCase();
    if (premiumApi === 'plans') return handlePlans(req, res);
    if (premiumApi === 'private-content') return handlePrivateContent(req, res);
    if (premiumApi === 'lei-em-dia-questions') return handleLeiEmDiaQuestions(req, res);

    const action = String(req.query?.action || '').toLowerCase();
    if (req.method === 'POST' && !sameOriginRequest(req)) return send(res, 403, { error: 'Origem da requisição não permitida' });

    if (action.startsWith('invite-')) return handleInviteAction(req, res, action.slice('invite-'.length));
    if (action.startsWith('password-reset-')) return handlePasswordReset(req, res, action.slice('password-reset-'.length));

    if (req.method === 'GET' && action === 'me') return currentUser(req, res);
    if (req.method === 'GET' && action === 'bootstrap-status') return bootstrapStatus(res);

    if (req.method === 'POST' && action === 'login') return login(req, res);
    if (req.method === 'POST' && action === 'logout') return logout(res);
    if (req.method === 'POST' && action === 'bootstrap') return bootstrap(req, res);

    res.setHeader('Allow', 'GET, POST');
    return send(res, 404, { error: 'Ação de autenticação inválida' });
  } catch (error) {
    console.error('auth error', error);
    return send(res, 500, { error: error?.message || 'Falha interna de autenticação' });
  }
}
