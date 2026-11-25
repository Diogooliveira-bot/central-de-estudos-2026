import crypto from 'node:crypto';
import { neon } from '@neondatabase/serverless';
import { ensureOnce } from './db-once.js';

export const COOKIE_NAME = 'bc_session';
export const ROLES = ['admin', 'editor', 'aluno'];
export const SESSION_TTL_SECONDS = 2 * 60 * 60;
export const MAX_JSON_BODY_BYTES = 4_000_000;

export function assertPreviewDatabaseIsolation(env = process.env) {
  // Toda Preview com banco precisa declarar explicitamente o isolamento.
  // Isso evita que uma branch nova herde por engano a conexão de produção.
  if (env.VERCEL_ENV !== 'preview' || !env.DATABASE_URL) return true;
  if (env.BC_PREVIEW_NEON_GUARD !== 'YES') {
    throw new Error('Preview bloqueada: isolamento Neon TEST não confirmado');
  }

  const expected = String(env.BC_PREVIEW_NEON_EXPECTED_HOST || '').toLowerCase();
  if (!/^[a-z0-9-]+(?:\.[a-z0-9-]+)*\.neon\.tech$/.test(expected)) {
    throw new Error('Preview bloqueada: host Neon TEST não configurado');
  }

  let actual;
  try {
    actual = new URL(String(env.DATABASE_URL || ''));
  } catch (_) {
    throw new Error('Preview bloqueada: conexão Neon inválida');
  }
  if (!['postgres:', 'postgresql:'].includes(actual.protocol) ||
      actual.hostname.toLowerCase() !== expected ||
      !actual.username || !actual.password || actual.pathname === '/') {
    throw new Error('Preview bloqueada: banco Neon diferente do TEST autorizado');
  }
  return true;
}

// Um único cliente por instância do servidor (e por endereço do banco): o cliente HTTP do Neon não guarda conexão,
// e reaproveitá-lo permite lembrar quais tabelas já foram conferidas (veja lib/db-once.js).
let sharedClient = null;
let sharedUrl = '';
let testClient = null;
/** Só para testes: troca o banco por um falso. Passe null para voltar ao normal. */
export function __setDatabaseForTests(client) { testClient = client || null; }

export function database() {
  if (testClient) return testClient;
  if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL não configurado no Vercel');
  assertPreviewDatabaseIsolation();
  if (!sharedClient || sharedUrl !== process.env.DATABASE_URL) {
    sharedClient = neon(process.env.DATABASE_URL);
    sharedUrl = process.env.DATABASE_URL;
  }
  return sharedClient;
}

async function ensureUsersTable_ddl(sql) {
  await sql`
    CREATE TABLE IF NOT EXISTS central_users (
      user_id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      role TEXT NOT NULL CHECK (role IN ('admin','editor','aluno')),
      password_hash TEXT NOT NULL,
      active BOOLEAN NOT NULL DEFAULT TRUE,
      failed_attempts INTEGER NOT NULL DEFAULT 0,
      locked_until TIMESTAMPTZ,
      last_login TIMESTAMPTZ,
      session_version INTEGER NOT NULL DEFAULT 1,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;
  await sql`ALTER TABLE central_users ADD COLUMN IF NOT EXISTS session_version INTEGER NOT NULL DEFAULT 1`;
  await sql`CREATE UNIQUE INDEX IF NOT EXISTS central_users_email_lower_idx ON central_users (LOWER(email))`;
}

export function normalizeEmail(value) {
  return String(value || '').trim().toLowerCase().slice(0, 240);
}

export function normalizeRole(value) {
  const role = String(value || '').trim().toLowerCase();
  return ROLES.includes(role) ? role : '';
}

export function validatePassword(password) {
  const value = String(password || '');
  if (value.length < 8) return 'A senha deve ter pelo menos 8 caracteres';
  if (value.length > 200) return 'Senha muito longa';
  return '';
}

export function hashPassword(password) {
  const error = validatePassword(password);
  if (error) throw new Error(error);
  const salt = crypto.randomBytes(16).toString('base64url');
  const derived = crypto.scryptSync(String(password), salt, 64).toString('base64url');
  return `scrypt$${salt}$${derived}`;
}

export function verifyPassword(password, stored) {
  try {
    const [kind, salt, expected] = String(stored || '').split('$');
    if (kind !== 'scrypt' || !salt || !expected) return false;
    const actual = crypto.scryptSync(String(password || ''), salt, 64);
    const expectedBuffer = Buffer.from(expected, 'base64url');
    return actual.length === expectedBuffer.length && crypto.timingSafeEqual(actual, expectedBuffer);
  } catch (_) {
    return false;
  }
}

function authSecret() {
  const secret = String(process.env.AUTH_SECRET || '');
  if (secret.length < 32) throw new Error('AUTH_SECRET não configurado ou muito curto no Vercel');
  return secret;
}

function signPart(part) {
  return crypto.createHmac('sha256', authSecret()).update(part).digest('base64url');
}

export function createSessionToken(user, ttlSeconds = SESSION_TTL_SECONDS) {
  const now = Math.floor(Date.now() / 1000);
  const payload = {
    v: 1,
    uid: String(user.user_id),
    email: normalizeEmail(user.email),
    name: String(user.name || '').slice(0, 120),
    role: normalizeRole(user.role),
    sv: Math.max(1, Number(user.session_version || 1)),
    iat: now,
    exp: now + ttlSeconds,
  };
  const part = Buffer.from(JSON.stringify(payload)).toString('base64url');
  return `${part}.${signPart(part)}`;
}

export function verifySessionToken(token) {
  try {
    const [part, signature] = String(token || '').split('.');
    if (!part || !signature) return null;
    const expected = signPart(part);
    const a = Buffer.from(signature);
    const b = Buffer.from(expected);
    if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null;
    const payload = JSON.parse(Buffer.from(part, 'base64url').toString('utf8'));
    if (!payload || payload.v !== 1 || !payload.uid || !ROLES.includes(payload.role) || !Number.isFinite(Number(payload.sv))) return null;
    if (!Number.isFinite(payload.exp) || payload.exp <= Math.floor(Date.now() / 1000)) return null;
    return payload;
  } catch (_) {
    return null;
  }
}

export function readCookie(req, name = COOKIE_NAME) {
  const raw = String(req.headers?.cookie || '');
  const prefix = name + '=';
  for (const piece of raw.split(';')) {
    const trimmed = piece.trim();
    if (trimmed.startsWith(prefix)) return decodeURIComponent(trimmed.slice(prefix.length));
  }
  return '';
}

export function sessionCookie(token, maxAge = SESSION_TTL_SECONDS) {
  return `${COOKIE_NAME}=${encodeURIComponent(token)}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${maxAge}`;
}

export function clearSessionCookie() {
  return `${COOKIE_NAME}=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0`;
}

export function publicUser(row) {
  return {
    id: String(row.user_id),
    name: String(row.name || ''),
    email: normalizeEmail(row.email),
    role: normalizeRole(row.role),
    active: row.active !== false,
    createdAt: row.created_at || null,
    updatedAt: row.updated_at || null,
    lastLogin: row.last_login || null,
  };
}

/**
 * Record a failed login as one atomic PostgreSQL update. Concurrent attempts
 * must not overwrite each other's counters or accidentally release a lock.
 */
export async function recordFailedLogin(sql, userId) {
  const rows = await sql`
    UPDATE central_users
    SET failed_attempts = CASE WHEN failed_attempts >= 4 THEN 0 ELSE failed_attempts + 1 END,
        locked_until = CASE WHEN failed_attempts >= 4 THEN NOW() + INTERVAL '10 minutes' ELSE NULL END,
        updated_at = NOW()
    WHERE user_id=${String(userId)} AND active=TRUE
      AND (locked_until IS NULL OR locked_until <= NOW())
    RETURNING locked_until
  `;
  return { locked: !rows.length || rows[0].locked_until != null };
}

export async function requireSession(req, allowedRoles = ROLES) {
  const token = readCookie(req);
  const payload = verifySessionToken(token);
  if (!payload) return { ok: false, status: 401, error: 'Sessão inválida ou expirada' };

  const sql = database();
  await ensureUsersTable(sql);
  const rows = await sql`
    SELECT user_id,name,email,role,active,session_version,created_at,updated_at,last_login
    FROM central_users
    WHERE user_id=${payload.uid}
    LIMIT 1
  `;
  const row = rows[0];
  if (!row || row.active === false) return { ok: false, status: 401, error: 'Usuário inativo ou inexistente' };
  if (Number(row.session_version || 1) !== Number(payload.sv || 0)) return { ok: false, status: 401, error: 'Sessão revogada. Entre novamente' };
  const role = normalizeRole(row.role);
  if (!allowedRoles.includes(role)) return { ok: false, status: 403, error: 'Você não tem permissão para esta ação' };
  return { ok: true, user: publicUser(row), sql };
}

export async function readJsonBody(req) {
  const declared = Number(req.headers?.['content-length'] || 0);
  if (Number.isFinite(declared) && declared > MAX_JSON_BODY_BYTES) {
    throw Object.assign(new Error('Corpo JSON acima do limite'), { statusCode: 413 });
  }
  if (req.body && typeof req.body === 'object') {
    if (Buffer.byteLength(JSON.stringify(req.body), 'utf8') > MAX_JSON_BODY_BYTES) {
      throw Object.assign(new Error('Corpo JSON acima do limite'), { statusCode: 413 });
    }
    return req.body;
  }
  if (typeof req.body === 'string') {
    if (Buffer.byteLength(req.body, 'utf8') > MAX_JSON_BODY_BYTES) {
      throw Object.assign(new Error('Corpo JSON acima do limite'), { statusCode: 413 });
    }
    return JSON.parse(req.body || '{}');
  }
  const chunks = [];
  let bytes = 0;
  for await (const chunk of req) {
    bytes += chunk.length;
    if (bytes > MAX_JSON_BODY_BYTES) {
      throw Object.assign(new Error('Corpo JSON acima do limite'), { statusCode: 413 });
    }
    chunks.push(chunk);
  }
  const raw = Buffer.concat(chunks).toString('utf8');
  return raw ? JSON.parse(raw) : {};
}

export function verifiedClientIp(req) {
  const raw = String(req.headers?.['x-vercel-forwarded-for'] || req.headers?.['x-forwarded-for'] || '');
  const ip = raw.split(',')[0].trim();
  return ip.length >= 3 && ip.length <= 65 && /^[0-9a-fA-F.:]+$/.test(ip) ? ip : '';
}

function authRateIdentity(kind, value) {
  return crypto.createHmac('sha256', authSecret()).update(`${kind}:${String(value)}`).digest('hex');
}

async function ensureAuthRateLimitTable_ddl(sql) {
  await sql`
    CREATE TABLE IF NOT EXISTS central_auth_rate_limits (
      identity_hash TEXT PRIMARY KEY,
      scope TEXT NOT NULL CHECK (scope IN ('login-email','login-ip')),
      window_start TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      attempt_count INTEGER NOT NULL DEFAULT 1,
      last_attempt_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;
  await sql`DELETE FROM central_auth_rate_limits WHERE last_attempt_at < NOW() - INTERVAL '24 hours'`;
}

export async function reserveAuthFailure(sql, scope, value, limit = 10, windowMinutes = 15) {
  if (!value || !['login-email', 'login-ip'].includes(scope)) return true;
  const identity = authRateIdentity(scope, value);
  const rows = await sql`
    INSERT INTO central_auth_rate_limits(identity_hash,scope,window_start,attempt_count,last_attempt_at)
    VALUES(${identity},${scope},NOW(),1,NOW())
    ON CONFLICT(identity_hash) DO UPDATE SET
      window_start=CASE
        WHEN central_auth_rate_limits.window_start < NOW() - ${windowMinutes} * INTERVAL '1 minute' THEN NOW()
        ELSE central_auth_rate_limits.window_start END,
      attempt_count=CASE
        WHEN central_auth_rate_limits.window_start < NOW() - ${windowMinutes} * INTERVAL '1 minute' THEN 1
        ELSE central_auth_rate_limits.attempt_count + 1 END,
      last_attempt_at=NOW()
    WHERE central_auth_rate_limits.window_start < NOW() - ${windowMinutes} * INTERVAL '1 minute'
       OR central_auth_rate_limits.attempt_count < ${limit}
    RETURNING attempt_count
  `;
  return rows.length > 0;
}

export async function clearAuthFailures(sql, scope, value) {
  if (!value || !['login-email', 'login-ip'].includes(scope)) return;
  const identity = authRateIdentity(scope, value);
  await sql`DELETE FROM central_auth_rate_limits WHERE identity_hash=${identity}`;
}

export function safeSecretEqual(received, expected) {
  const a = Buffer.from(String(received || ''));
  const b = Buffer.from(String(expected || ''));
  return !!a.length && a.length === b.length && crypto.timingSafeEqual(a, b);
}


export function sameOriginRequest(req) {
  if (String(req.method || 'GET').toUpperCase() === 'GET' || String(req.method || '').toUpperCase() === 'HEAD') return true;
  const site = String(req.headers?.['sec-fetch-site'] || '').toLowerCase();
  if (site === 'cross-site') return false;
  const origin = String(req.headers?.origin || '').trim();
  if (!origin) return site === '' || site === 'same-origin' || site === 'same-site' || site === 'none';
  try {
    const parsed = new URL(origin);
    const forwarded = String(req.headers?.['x-forwarded-host'] || '').split(',')[0].trim();
    const host = forwarded || String(req.headers?.host || '').trim();
    return !!host && parsed.host === host;
  } catch (_) {
    return false;
  }
}

export const ensureUsersTable = (sql) => ensureOnce(sql, 'auth.js:ensureUsersTable', () => ensureUsersTable_ddl(sql));

export const ensureAuthRateLimitTable = (sql) => ensureOnce(sql, 'auth.js:ensureAuthRateLimitTable', () => ensureAuthRateLimitTable_ddl(sql));
