import { next } from '@vercel/functions';

const COOKIE_NAME = 'bc_session';

/* Temporary access to the CF visual-testing preview.
 * Never used in production, and never creates an authenticated app session.
 * Remove this branch to revoke this capability.
 */
const CF_PREVIEW_BRANCH = 'test/cf-preview-no-login-20261018';
const CF_PREVIEW_ENABLED = process.env.VERCEL_ENV === 'preview' && process.env.VERCEL_GIT_COMMIT_REF === CF_PREVIEW_BRANCH;
const CF_PREVIEW_COOKIE = 'bc_cf_preview_token';
const CF_PREVIEW_QUERY = 'bc_cf_preview';
const CF_PREVIEW_SHA256 = 'a578690e8c9960d119327657e0180968fa127841fc1a93460f861c5dcfb1c21c';
async function validCFPreviewToken(raw) {
  if (!CF_PREVIEW_ENABLED || !raw || raw.length > 128) return false;
  try {
    const hash = new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(raw)));
    const expected = new Uint8Array(CF_PREVIEW_SHA256.match(/../g).map(v => parseInt(v, 16)));
    return safeEqualBytes(hash, expected);
  } catch (_) { return false; }
}

const PUBLIC_PATHS = new Set([
  '/login.html',
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


  // A unique one-click link establishes a browser-only testing capability.
  // Its 256-bit token is never committed; only the one-way hash is in code.
  if (CF_PREVIEW_ENABLED && url.searchParams.has(CF_PREVIEW_QUERY)) {
    const token = url.searchParams.get(CF_PREVIEW_QUERY) || '';
    if (request.method !== 'GET' || !(await validCFPreviewToken(token))) {
      return new Response('Link de teste inválido.', {
        status: 403, headers: { 'Cache-Control': 'no-store', 'Content-Type': 'text/plain; charset=utf-8' }
      });
    }
    const cleanUrl = new URL(request.url);
    cleanUrl.searchParams.delete(CF_PREVIEW_QUERY);
    return new Response(null, {
      status: 302,
      headers: {
        'Location': cleanUrl.toString(),
        'Set-Cookie': CF_PREVIEW_COOKIE + '=' + encodeURIComponent(token) +
          '; Path=/; Max-Age=604800; HttpOnly; Secure; SameSite=Lax',
        'Cache-Control': 'no-store',
        'Referrer-Policy': 'no-referrer'
      }
    });
  }
  if (CF_PREVIEW_ENABLED && await validCFPreviewToken(parseCookie(request.headers.get('cookie'), CF_PREVIEW_COOKIE))) {
    // API endpoints keep their own authentication requirements. Only the
    // /api/auth?action=me action returns a synthetic preview user.
    if (path.startsWith('/api/')) return next();
    if (path === '/usuarios.html' || path === '/update-central.html') {
      return Response.redirect(new URL('/central-v119.html',request.url),302);
    }
    if (path === '/login.html') return Response.redirect(new URL('/central-v119.html',request.url),302);
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
