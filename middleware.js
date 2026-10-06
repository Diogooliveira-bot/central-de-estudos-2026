import { next } from '@vercel/functions';

const COOKIE_NAME = 'bc_session';
const PUBLIC_PATHS = new Set([
  '/login.html',
  '/favicon.ico',
  '/robots.txt',
  '/assets/base-completa-symbol.webp',
]);

function parseCookie(header, name) {
  const prefix = name + '=';
  for (const piece of String(header || '').split(';')) {
    const value = piece.trim();
    if (value.startsWith(prefix)) return decodeURIComponent(value.slice(prefix.length));
  }
  return '';
}

function fromBase64Url(value) {
  value = String(value || '').replace(/-/g, '+').replace(/_/g, '/');
  while (value.length % 4) value += '=';
  const binary = atob(value);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

function decodePayload(part) {
  try {
    return JSON.parse(new TextDecoder().decode(fromBase64Url(part)));
  } catch (_) {
    return null;
  }
}

function safeEqualBytes(a, b) {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a[i] ^ b[i];
  return diff === 0;
}

async function verifyToken(token) {
  try {
    const secret = String(process.env.AUTH_SECRET || '');
    if (secret.length < 32) return null;
    const [part, sig] = String(token || '').split('.');
    if (!part || !sig) return null;
    const key = await crypto.subtle.importKey(
      'raw',
      new TextEncoder().encode(secret),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    );
    const expected = new Uint8Array(await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(part)));
    const actual = fromBase64Url(sig);
    if (!safeEqualBytes(expected, actual)) return null;
    const payload = decodePayload(part);
    if (!payload || payload.v !== 1 || !payload.uid || !['admin','editor','aluno'].includes(payload.role) || !Number.isFinite(Number(payload.sv))) return null;
    if (!Number.isFinite(payload.exp) || payload.exp <= Math.floor(Date.now() / 1000)) return null;
    return payload;
  } catch (_) {
    return null;
  }
}

function redirectToLogin(request) {
  const url = new URL('/login.html', request.url);
  const current = new URL(request.url);
  if (current.pathname !== '/') url.searchParams.set('next', current.pathname + current.search);
  return Response.redirect(url, 302);
}

export const config = {
  matcher: '/:path*',
};

export default async function middleware(request) {
  const url = new URL(request.url);
  const path = url.pathname;

  if (request.method === 'OPTIONS') return next();
  if (path.startsWith('/api/')) return next();
  if (PUBLIC_PATHS.has(path)) return next();

  const token = parseCookie(request.headers.get('cookie'), COOKIE_NAME);
  const session = await verifyToken(token);
  if (!session) return redirectToLogin(request);

  if ((path === '/usuarios.html' || path === '/update-central.html') && session.role !== 'admin') {
    return Response.redirect(new URL('/', request.url), 302);
  }

  if (path === '/login.html') return Response.redirect(new URL('/', request.url), 302);
  return next();
}
