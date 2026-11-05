// Mede o carregamento da Central para um aluno fictício Premium, sem dados reais.
// Servidor local imita a Vercel: HTTP/2 (com TLS), compressão Brotli, ETag/304,
// cabeçalhos do vercel.json e conteúdo protegido "private, no-store".
// Rede lenta é simulada no próprio servidor (vale também para o service worker).
//
// Uso (Git Bash), fora do repositório para o certificado de teste:
//   openssl req -x509 -newkey rsa:2048 -nodes -keyout $D/key.pem -out $D/cert.pem -days 30 -subj /CN=localhost
//   openssl x509 -in $D/cert.pem -pubkey -noout | openssl pkey -pubin -outform der \
//     | openssl dgst -sha256 -binary | base64 > $D/spki.txt
//   CERT_DIR=$D DEVICE=mobile NET=fast3g node scripts/measure-student-load.mjs
// Variáveis: ROOT (pasta servida, padrão "."), DEVICE=desktop|mobile, NET=none|4g|fast3g,
//   SUBJECTS=penal,civil (vazio = só abertura), CERT_DIR (sem ele usa HTTP/1.1, menos fiel),
//   TRACE=1 (ordem dos pedidos), OUT (arquivo JSON com o resultado).
// Roteiro: login (instala o service worker, como no site) → abrir a Central → abrir
// disciplina e teoria completa do 1º módulo → reabrir a Central → reabrir as disciplinas.
import { createServer as createHttp } from 'node:http';
import { createSecureServer } from 'node:http2';
import { readFile, stat, writeFile } from 'node:fs/promises';
import { resolve, extname, join } from 'node:path';
import { createHash } from 'node:crypto';
import { brotliCompressSync, constants as zlib } from 'node:zlib';
import { pathToFileURL } from 'node:url';
import { chromium } from 'playwright';

const root = resolve(process.env.ROOT || '.');
const DEVICE = process.env.DEVICE || 'desktop';
const NET = process.env.NET || 'none';
const SUBJECTS = (process.env.SUBJECTS ?? 'penal,civil').split(',').filter(Boolean);
const { protectedAsset } = await import(pathToFileURL(join(root, 'lib/protected-content.js')).href);
const vercel = JSON.parse(await readFile(join(root, 'vercel.json'), 'utf8'));
const NETS = { none: null, '4g': { latency: 170, bps: 1.125e6 }, fast3g: { latency: 562.5, bps: 188743 } };
const net = NETS[NET];
const mime = { '.html': 'text/html; charset=utf-8', '.js': 'application/javascript; charset=utf-8', '.mjs': 'application/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.json': 'application/json', '.webmanifest': 'application/manifest+json', '.webp': 'image/webp', '.png': 'image/png', '.svg': 'image/svg+xml', '.ico': 'image/x-icon', '.txt': 'text/plain; charset=utf-8', '.avif': 'image/avif', '.woff2': 'font/woff2' };
const compressible = /\.(?:html|m?js|css|json|webmanifest|svg|txt)$/i;
const ent = Object.fromEntries(['theory.summary', 'theory.complete', 'vade_mecum', 'lei_em_dia', 'tec.links', 'qc.links', 'premium.reviews', 'progress.advanced_sync'].map(k => [k, { enabled: true }]));

// Cabeçalhos do vercel.json (regras posteriores sobrescrevem a mesma chave, como na Vercel).
const headerRules = (vercel.headers || []).map(rule => ({
  re: new RegExp('^' + rule.source.replace(/\(\.\*\)/g, '.*').replace(/:path\*/g, '.*') + '$'),
  has: rule.has || [], headers: rule.headers,
}));
function vercelHeaders(path, query) {
  const out = {};
  for (const rule of headerRules) {
    if (!rule.re.test(path)) continue;
    if (!rule.has.every(h => h.type === 'query' ? query.has(h.key) : true)) continue;
    for (const h of rule.headers) out[h.key.toLowerCase()] = h.value;
  }
  return out;
}

// Contadores por fase.
let phase = 'setup';
const trace = [];
const stats = {};
function count(kind, bytes, status, path) {
  const s = stats[phase] ||= { requests: 0, notModified: 0, bytes: 0, files: {} };
  s.requests++; s.bytes += bytes;
  if (status === 304) s.notModified++;
  s.files[path] = (s.files[path] || 0) + bytes;
}

// Fila única de banda (como um único enlace de rede do aparelho).
let linkFreeAt = 0;
async function throttle(bytes) {
  if (!net) return;
  const now = Date.now(), start = Math.max(now, linkFreeAt), dur = bytes / net.bps * 1000;
  linkFreeAt = start + dur;
  await new Promise(r => setTimeout(r, linkFreeAt - now));
}
const wait = ms => new Promise(r => setTimeout(r, ms));

const fileCache = new Map();
async function loadFile(file) {
  const info = await stat(file);
  const hit = fileCache.get(file);
  if (hit && hit.mtime === info.mtimeMs) return hit;
  const raw = await readFile(file);
  const entry = { mtime: info.mtimeMs, raw, etag: '"' + createHash('sha1').update(raw).digest('hex').slice(0, 20) + '"',
    br: compressible.test(file) ? brotliCompressSync(raw, { params: { [zlib.BROTLI_PARAM_QUALITY]: 5 } }) : null };
  fileCache.set(file, entry);
  return entry;
}

async function handler(req, res) {
  const url = new URL(req.url, 'https://localhost'), path = url.pathname;
  if (net) await wait(net.latency);
  const send = async (status, headers, body) => {
    const buf = body ? Buffer.from(body) : Buffer.alloc(0);
    await throttle(buf.length + 200);
    count('', buf.length, status, path);
    res.writeHead(status, headers); res.end(buf);
  };
  if (process.env.TRACE && /^[13]_/.test(phase)) trace.push([Date.now(), phase[0] + ' ' + path]);
  const json = (b, status = 200) => send(status, { 'content-type': 'application/json', 'cache-control': 'no-store' }, JSON.stringify(b));
  if (path === '/api/auth') return json({ authenticated: true, user: { id: 'perf-ficticio', name: 'Aluno Fictício', role: 'aluno', plan: 'premium' } });
  if (path === '/api/plans') return json({ role: 'aluno', plan: 'premium', status: 'active', isStaff: false, entitlements: ent });
  if (path === '/api/sync') return json(req.method === 'POST' ? { revision: 1 } : { exists: false });
  if (path === '/api/objective') return json({ objectiveId: 'career-tribunais-analista' });
  if (path.startsWith('/api/')) return json({});
  const file = resolve(root, '.' + (path === '/' ? '/central-v119.html' : decodeURIComponent(path)));
  if (!file.startsWith(root)) return send(403, {}, '');
  let entry;
  try { entry = await loadFile(file); } catch (_) { return send(404, { 'content-type': 'text/plain' }, 'NOT_FOUND'); }
  const headers = { 'content-type': mime[extname(file).toLowerCase()] || 'application/octet-stream', etag: entry.etag, vary: 'Accept-Encoding', ...vercelHeaders(path, url.searchParams) };
  if (protectedAsset(path)) headers['cache-control'] = 'private, no-store, max-age=0';
  if (!headers['cache-control']) headers['cache-control'] = 'public, max-age=0, must-revalidate';
  if (req.headers['if-none-match'] === entry.etag && !/no-store/.test(headers['cache-control'])) return send(304, headers, '');
  let body = entry.raw;
  if (entry.br && /\bbr\b/.test(String(req.headers['accept-encoding'] || ''))) { body = entry.br; headers['content-encoding'] = 'br'; }
  return send(200, headers, body);
}

let server, base;
const certDir = process.env.CERT_DIR;
if (certDir) {
  server = createSecureServer({ key: await readFile(join(certDir, 'key.pem')), cert: await readFile(join(certDir, 'cert.pem')), allowHTTP1: true }, (q, s) => handler(q, s).catch(e => { try { s.writeHead(500); s.end(String(e)); } catch (_) {} }));
} else {
  server = createHttp((q, s) => handler(q, s).catch(e => { try { s.writeHead(500); s.end(String(e)); } catch (_) {} }));
}
await new Promise(r => server.listen(0, '127.0.0.1', r));
base = (certDir ? 'https://localhost:' : 'http://127.0.0.1:') + server.address().port;

// Com SPKI confiável o Chrome trata o certificado local como válido e usa o cache HTTP
// normalmente (com --ignore-certificate-errors ele não guarda nada em cache).
let spki = '';
if (certDir) { try { spki = (await readFile(join(certDir, 'spki.txt'), 'utf8')).trim(); } catch (_) {} }
const browser = await chromium.launch({ args: spki ? ['--ignore-certificate-errors-spki-list=' + spki] : ['--ignore-certificate-errors'] });
const mobile = DEVICE === 'mobile';
const context = await browser.newContext({
  viewport: mobile ? { width: 390, height: 844 } : { width: 1366, height: 900 },
  isMobile: mobile, hasTouch: mobile, deviceScaleFactor: mobile ? 3 : 1,
  ignoreHTTPSErrors: !spki, serviceWorkers: 'allow',
});
const page = await context.newPage();
const errors = [];
page.on('pageerror', e => errors.push(e.message.slice(0, 200)));
if (mobile) { const cdp = await context.newCDPSession(page); await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 }); }

const snap = name => { const s = stats[name] || {}; return { requests: s.requests || 0, notModified: s.notModified || 0, kb: Math.round((s.bytes || 0) / 1024) }; };
const result = { root, device: DEVICE, net: NET, http2: !!certDir, phases: {} };

async function boot(name) {
  phase = name; linkFreeAt = 0;
  const t0 = Date.now();
  await page.goto(base + '/central-v119.html?view=home', { waitUntil: 'commit', timeout: 300000 });
  // A Central desiste e mostra "Tentar novamente" se não ficar pronta em 60 s.
  await page.waitForFunction(() => document.documentElement.dataset.centralReady === 'true' || document.getElementById('retry')?.hidden === false, null, { timeout: 300000, polling: 100 });
  const readyMs = Date.now() - t0;
  const nav = await page.evaluate(() => ({ sw: !!navigator.serviceWorker?.controller, failed: document.documentElement.dataset.centralReady !== 'true' }));
  result.phases[name] = { readyMs, failedRetryScreen: nav.failed, swControlled: nav.sw, ...snap(name) };
  if (nav.failed) { console.log(name, JSON.stringify(result.phases[name])); throw Error(name + ': tela de erro "Tentar novamente" após ' + readyMs + ' ms'); }
  console.log(name, JSON.stringify(result.phases[name]));
}

async function openTheory(name, id) {
  phase = name; linkFreeAt = 0;
  await page.evaluate(() => window.openDisciplines());
  await page.waitForTimeout(300);
  const t0 = Date.now();
  await page.locator('#disciplineGrid [data-study-open-subject="' + id + '"]').first().click({ timeout: 90000 });
  await page.waitForFunction(id => window.CentralDisciplineLoader.isReady(id) || window.CentralDisciplineLoader.hasError(id), id, { timeout: 300000, polling: 100 });
  const disciplineMs = Date.now() - t0;
  if (await page.evaluate(id => window.CentralDisciplineLoader.hasError(id), id)) throw Error(id + ': erro ao carregar disciplina');
  const disciplineSnap = snap(name);
  const cards = page.locator('#bcFocusModules .bc-focus-module-card');
  await cards.first().waitFor({ state: 'visible', timeout: 60000 });
  await cards.nth(id === 'cpc' ? 1 : 0).click();
  await page.waitForFunction(() => window.BaseCompletaFocusNavigation?.state.stage === 'reading', null, { timeout: 60000 });
  const btn = page.locator('.subject[data-id="' + id + '"] button:visible').filter({ hasText: /^Estudar conteúdo/ }).first();
  await btn.waitFor({ state: 'visible', timeout: 60000 });
  const t1 = Date.now();
  await btn.click();
  await page.waitForFunction(() => { const a = [...document.querySelectorAll('.bc-native-reader-overlay .bc-native-article')].pop(); return a && a.innerText.length > 800; }, null, { timeout: 300000, polling: 100 });
  const theoryMs = Date.now() - t1;
  result.phases[name] = { disciplineMs, theoryMs, totalMs: Date.now() - t0, disciplineOnly: disciplineSnap, ...snap(name) };
  console.log(name, JSON.stringify(result.phases[name]));
  await page.keyboard.press('Escape');
}

try {
  // Como o aluno real: a página de login já instala o service worker antes da Central.
  phase = '0_login';
  await page.goto(base + '/login.html', { waitUntil: 'load', timeout: 300000 });
  for (let i = 0; i < 50; i++) {
    try { if (await page.evaluate(() => navigator.serviceWorker.getRegistration().then(r => !!r?.active))) break; } catch (_) {}
    await page.waitForTimeout(200);
  }
  await boot('1_primeira_visita');
  for (const id of SUBJECTS) await openTheory('2_abrir_' + id, id);
  await boot('3_visita_retorno');
  for (const id of SUBJECTS) await openTheory('4_retorno_abrir_' + id, id);
} catch (e) {
  result.error = String(e.message || e).slice(0, 400);
  console.error('ERRO', result.error);
  process.exitCode = 1;
} finally {
  result.pageErrors = [...new Set(errors)].slice(0, 15);
  result.topFiles = Object.fromEntries(Object.entries(stats).map(([name, st]) => [name, Object.entries(st.files || {}).sort((a, b) => b[1] - a[1]).slice(0, 25).map(([p, b]) => [p, Math.round(b / 1024)])]));
  if (trace.length) result.trace = trace.map(([t, p]) => [t - trace[0][0], p]);  // tempos desde o 1º pedido
  if (process.env.OUT) await writeFile(process.env.OUT, JSON.stringify(result, null, 1));
  console.log('RESULT=' + JSON.stringify({ ...result, topFiles: undefined }));
  await browser.close(); server.close();
}
