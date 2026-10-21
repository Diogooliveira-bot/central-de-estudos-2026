import { next } from '@vercel/functions';

const COOKIE_NAME = 'bc_session';

/**
 * Preview-only bearer-link access for visual testing.
 * BC_PREVIEW_GUEST_TOKEN is configured ONLY for the Vercel Preview target.
 * A token never grants database privileges or an authenticated site account.
 */
const PREVIEW_GUEST_COOKIE = 'bc_preview_guest';
const PREVIEW_GUEST_QUERY = 'bc_preview';
const PREVIEW_GUEST_MAX_AGE = 7 * 24 * 60 * 60;
const PREVIEW_GUEST_SECRET = String(process.env.BC_PREVIEW_GUEST_TOKEN || '');
const PREVIEW_GUEST_ENABLED = process.env.VERCEL_ENV === 'preview' && PREVIEW_GUEST_SECRET.length >= 40;

async function previewTokenMatches(token) {
  if (!PREVIEW_GUEST_ENABLED || typeof token !== 'string' || token.length < 40 || token.length > 128) return false;
  try {
    const [given, expected] = await Promise.all(
      [token, PREVIEW_GUEST_SECRET].map(value =>
        crypto.subtle.digest('SHA-256', new TextEncoder().encode(value))
          .then(buffer => new Uint8Array(buffer))
      )
    );
    return safeEqualBytes(given, expected);
  } catch (_) {
    return false;
  }
}

async function hasPreviewGuestCookie(request) {
  try {
    return await previewTokenMatches(parseCookie(request.headers.get('cookie'), PREVIEW_GUEST_COOKIE));
  } catch (_) {
    return false;
  }
}

function previewForbidden() {
  return new Response(JSON.stringify({ error: 'Modo de teste: ação indisponível sem login de usuário real.' }), {
    status: 403,
    headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' },
  });
}

const PUBLIC_PATHS = new Set([
  '/login.html',
  '/convite.html',
  '/recuperar-senha.html',
  '/favicon.ico',
  '/robots.txt',
  '/assets/base-completa-symbol.webp',
  '/manifest.webmanifest',
  '/sw.js',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
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

  // End the synthetic Preview session without calling any API or touching a
  // student account. Re-entering through the private preview link starts it again.
  if (PREVIEW_GUEST_ENABLED && url.searchParams.get('bc_preview_logout') === '1') {
    if (request.method !== 'GET' || !(await hasPreviewGuestCookie(request))) return previewForbidden();
    return new Response(null, {
      status:303,
      headers:{
        Location:new URL('/login.html', request.url).toString(),
        'Set-Cookie':PREVIEW_GUEST_COOKIE + '=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0',
        'Cache-Control':'no-store',
        'Referrer-Policy':'no-referrer',
      },
    });
  }

  // Preview links grant a read-only, browser-local demonstration.
  // The query token is exchanged once for a secure cookie and then removed
  // from the address bar so it is not forwarded as a Referer.
  if (PREVIEW_GUEST_ENABLED && url.searchParams.has(PREVIEW_GUEST_QUERY)) {
    const entryPathAllowed = path === '/' || path === '/central-v119.html' || path === '/index.html';
    const token = url.searchParams.get(PREVIEW_GUEST_QUERY) || '';
    if (request.method !== 'GET' || !entryPathAllowed || !(await previewTokenMatches(token))) {
      return previewForbidden();
    }
    const cleanUrl = new URL(request.url);
    cleanUrl.searchParams.delete(PREVIEW_GUEST_QUERY);
    return new Response(null, {
      status: 303,
      headers: {
        Location: cleanUrl.toString(),
        'Set-Cookie': PREVIEW_GUEST_COOKIE + '=' + encodeURIComponent(token) +
          '; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=' + PREVIEW_GUEST_MAX_AGE,
        'Cache-Control': 'no-store',
        'Referrer-Policy': 'no-referrer',
      },
    });
  }

  if (await hasPreviewGuestCookie(request)) {
    if (path.startsWith('/api/')) {
      // The synthetic identity is deliberately the ONLY API allowed.
      // In particular, guest users cannot read/sync/write real database data.
      if (request.method === 'GET' && path === '/api/auth' &&
          url.searchParams.get('action') === 'me') return next();
      return previewForbidden();
    }
    if (path === '/usuarios.html' || path === '/update-central.html') return previewForbidden();
    if (path === '/login.html') return Response.redirect(new URL('/central-v119.html', request.url), 302);
    return next();
  }

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
