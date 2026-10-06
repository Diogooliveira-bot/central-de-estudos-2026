import crypto from 'node:crypto';
import { neon } from '@neondatabase/serverless';

export const COOKIE_NAME = 'bc_session';
export const ROLES = ['admin', 'editor', 'aluno'];
export const SESSION_TTL_SECONDS = 2 * 60 * 60;

export function database() {
  if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL não configurado no Vercel');
  return neon(process.env.DATABASE_URL);
}

export async function ensureUsersTable(sql) {
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
  if (req.body && typeof req.body === 'object') return req.body;
  if (typeof req.body === 'string') return JSON.parse(req.body || '{}');
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  const raw = Buffer.concat(chunks).toString('utf8');
  return raw ? JSON.parse(raw) : {};
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
