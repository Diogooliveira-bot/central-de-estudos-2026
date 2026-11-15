import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { gzipSync } from 'node:zlib';
import { resolve, extname } from 'node:path';
import { chromium } from 'playwright';
const root = process.cwd();
const mime = { '.html': 'text/html', '.js': 'application/javascript', '.css': 'text/css', '.json': 'application/json', '.webp': 'image/webp', '.png': 'image/png', '.svg': 'image/svg+xml' };
const server = createServer(async (req, res) => {
  const url = new URL(req.url, 'http://localhost'), path = url.pathname;
  const json = (b, s = 200) => { res.writeHead(s, { 'content-type': 'application/json' }); res.end(JSON.stringify(b)); };
  if (path === '/api/auth') return json({ authenticated: true, user: { id: 'f', name: 'Aluno', role: 'aluno', plan: 'premium' } });
  if (path === '/api/sync') return json(req.method === 'POST' ? { revision: 1 } : { exists: false });
  if (path === '/api/plans') return json({ role: 'aluno', plan: 'premium', status: 'active', isStaff: false, entitlements: {} });
  if (path === '/api/objective') return json({ objectiveId: 'career-tribunais-analista' });
  if (path.startsWith('/api/')) return json({});
  const file = resolve(root, '.' + (path === '/' ? '/central-v119.html' : decodeURIComponent(path)));
  try { const d = await readFile(file); res.writeHead(200, { 'content-type': mime[extname(file)] || 'application/octet-stream' }); res.end(d); } catch (e) { res.writeHead(404); res.end(); }
});
await new Promise(r => server.listen(0, '127.0.0.1', r));
const base = 'http://127.0.0.1:' + server.address().port;
const browser = await chromium.launch({ headless: true, args: ['--no-sandbox'] });
const ctx = await browser.newContext({ viewport: { width: 430, height: 900 }, serviceWorkers: process.env.SW ? 'allow' : 'block' });
const page = await ctx.newPage();
const cdp = await ctx.newCDPSession(page);
await cdp.send('Emulation.setCPUThrottlingRate', { rate: Number(process.env.CPU || 4) });
if (process.env.NET) await cdp.send('Network.emulateNetworkConditions', { offline: false, latency: Number(process.env.RTT || 150), downloadThroughput: Number(process.env.NET) * 1024 / 8 * 1000 / 1000 * 1000 / 1000, uploadThroughput: 750 * 1024 / 8, });
await browser.startTracing(page, { categories: ['devtools.timeline', 'v8.execute', 'disabled-by-default-devtools.timeline'] });
const reqs = [];
page.on('response', async r => { try { const b = await r.body(); reqs.push({ url: new URL(r.url()).pathname + (new URL(r.url()).search ? '?' : ''), raw: b.length, gz: gzipSync(b).length, type: r.request().resourceType(), t: Date.now() }); } catch {} });
await page.addInitScript(() => { window.__lt = []; try { new PerformanceObserver(l => l.getEntries().forEach(e => window.__lt.push([Math.round(e.startTime), Math.round(e.duration)]))).observe({ entryTypes: ['longtask'] }); } catch {} });
if (process.env.WARM) {
  await page.goto(base + '/central-v119.html?view=home');
  await page.waitForFunction(() => document.documentElement.dataset.centralReady === 'true', { timeout: 180000 });
  await page.waitForTimeout(12000);
  reqs.length = 0;
}
const t0 = Date.now();
await page.goto(base + '/central-v119.html?view=home', { waitUntil: 'commit' });
await page.waitForFunction(() => document.documentElement.dataset.centralReady === 'true', { timeout: 120000 });
const tReady = Date.now() - t0;
await page.waitForTimeout(1500);
const nav = await page.evaluate(() => { const n = performance.getEntriesByType('navigation')[0]; const fcp = performance.getEntriesByName('first-contentful-paint')[0]; return { fcp: fcp && Math.round(fcp.startTime), dcl: Math.round(n.domContentLoadedEventEnd), load: Math.round(n.loadEventEnd) }; });
const lt1 = await page.evaluate(() => window.__lt.slice());
const traceBuf = await browser.stopTracing();
const trace = JSON.parse(traceBuf.toString());
const evs = trace.traceEvents || trace;
const exec = new Map(); let evalTotal = 0, compileTotal = 0, layoutTotal = 0, styleTotal = 0, paintTotal = 0;
for (const e of evs) {
  if (e.ph !== 'X') continue;
  if (e.name === 'EvaluateScript' || e.name === 'FunctionCall') { if (e.name === 'EvaluateScript') { evalTotal += e.dur; const u = e.args?.data?.url || ''; if (u) exec.set(u, (exec.get(u) || 0) + e.dur); } }
  else if (e.name === 'v8.compile' || e.name === 'V8.CompileCode' || e.name === 'v8.compile.lazy') { compileTotal += e.dur; const u = e.args?.fileName || ''; if (u) exec.set(u, (exec.get(u) || 0) + e.dur); }
  else if (e.name === 'Layout') layoutTotal += e.dur; else if (e.name === 'UpdateLayoutTree' || e.name === 'RecalculateStyles') styleTotal += e.dur; else if (e.name === 'Paint') paintTotal += e.dur;
}
console.log('MAIN THREAD (ms, com CPU x' + (process.env.CPU || 4) + '): EvaluateScript', Math.round(evalTotal / 1000), '| compile', Math.round(compileTotal / 1000), '| layout', Math.round(layoutTotal / 1000), '| estilo', Math.round(styleTotal / 1000), '| paint', Math.round(paintTotal / 1000));
console.log('SCRIPTS MAIS CAROS (exec+compile ms):'); [...exec.entries()].sort((a, b) => b[1] - a[1]).slice(0, 10).forEach(([u, d]) => console.log('  ', String(Math.round(d / 1000)).padStart(5), 'ms', u.replace(/^https?:\/\/[^/]+/, '').slice(0, 90)));
const initial = reqs.slice();
const sum = a => a.reduce((s, r) => ({ n: s.n + 1, raw: s.raw + r.raw, gz: s.gz + r.gz }), { n: 0, raw: 0, gz: 0 });
const byType = {}; initial.forEach(r => { const k = r.url.endsWith('.js') ? 'js' : r.url.endsWith('.css') ? 'css' : r.url.endsWith('.json') ? 'json' : r.url.endsWith('.html') ? 'html' : 'outros'; (byType[k] ||= []).push(r); });
console.log('=== CARGA INICIAL (CPU', process.env.CPU || 4, 'x mais lenta) ===');
console.log('pronto (centralReady):', tReady, 'ms | FCP', nav.fcp, '| DCL', nav.dcl, '| load', nav.load);
console.log('total:', JSON.stringify(sum(initial)), '| por tipo:', Object.entries(byType).map(([k, v]) => k + ' ' + JSON.stringify(sum(v))).join(' ; '));
console.log('longtasks >100ms:', lt1.filter(x => x[1] > 100).length, 'soma ms:', lt1.reduce((s, x) => s + x[1], 0));
console.log('MAIORES (gz):'); initial.sort((a, b) => b.gz - a.gz).slice(0, 14).forEach(r => console.log('  ', String(Math.round(r.gz / 1024)).padStart(5), 'KB gz', String(Math.round(r.raw / 1024)).padStart(6), 'KB raw', r.url));
// ADM
reqs.length = 0; await page.evaluate(() => { window.__lt.length = 0; });
const t1 = Date.now();
await page.locator('#subjects .subject[data-id="adm"] .subject-head').first().click({ force: true });
await page.waitForFunction(() => window.BaseCompletaFocusNavigation?.state?.stage === 'modules', null, { timeout: 60000 });
const tAdmList = Date.now() - t1; await page.waitForTimeout(1200);
const admList = reqs.slice(); const lt2 = await page.evaluate(() => window.__lt.slice());
reqs.length = 0; const t2 = Date.now();
await page.locator('#bcFocusModules .bc-focus-module-card').nth(4).click({ timeout: 20000 });
await page.waitForFunction(() => window.BaseCompletaFocusNavigation?.state?.stage === 'reading', null, { timeout: 60000 });
const tAdmMod = Date.now() - t2; await page.waitForTimeout(1200);
const admMod = reqs.slice();
reqs.length = 0; const t3 = Date.now();
await page.getByRole('button', { name: /Revisar conteúdo/ }).first().click({ timeout: 20000 });
await page.waitForSelector('.bc-native-article h2', { timeout: 60000 }); const tRev = Date.now() - t3; await page.waitForTimeout(1500);
const admRev = reqs.slice();
console.log('\n=== ADM ==='); 
console.log('abrir lista de módulos:', tAdmList, 'ms |', JSON.stringify(sum(admList)), '| longtasks', lt2.filter(x => x[1] > 100).length);
admList.sort((a, b) => b.gz - a.gz).slice(0, 8).forEach(r => console.log('  ', String(Math.round(r.gz / 1024)).padStart(5), 'KB gz', String(Math.round(r.raw / 1024)).padStart(6), 'KB raw', r.url));
console.log('abrir módulo 5:', tAdmMod, 'ms |', JSON.stringify(sum(admMod)));
admMod.sort((a, b) => b.gz - a.gz).slice(0, 8).forEach(r => console.log('  ', String(Math.round(r.gz / 1024)).padStart(5), 'KB gz', String(Math.round(r.raw / 1024)).padStart(6), 'KB raw', r.url));
console.log('abrir Revisão do módulo 5:', tRev, 'ms |', JSON.stringify(sum(admRev)));
admRev.sort((a, b) => b.gz - a.gz).slice(0, 8).forEach(r => console.log('  ', String(Math.round(r.gz / 1024)).padStart(5), 'KB gz', String(Math.round(r.raw / 1024)).padStart(6), 'KB raw', r.url));
await browser.close(); server.close();
