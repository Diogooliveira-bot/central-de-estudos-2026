// Teste de navegador: no tablet em pé (inclusive "versão para computador" ~1250 px, letra ampliada) todas as
// ferramentas do menu do topo precisam estar visíveis dentro da tela, sem rolagem lateral. Conta fictícia.
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { resolve, extname } from 'node:path';
import { chromium } from 'playwright';

const root = resolve(new URL('..', import.meta.url).pathname);
const mime = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.webp': 'image/webp', '.png': 'image/png' };
const server = createServer(async (req, res) => {
  const p = new URL(req.url, 'http://x').pathname;
  const j = (b) => { res.writeHead(200, { 'content-type': 'application/json' }); res.end(JSON.stringify(b)); };
  if (p === '/api/auth') return j({ authenticated: true, user: { id: 'f', name: 'Aluno Fictício', role: 'aluno', plan: 'premium' } });
  if (p === '/api/sync') return j(req.method === 'POST' ? { revision: 1 } : { exists: false });
  if (p === '/api/plans') return j({ role: 'aluno', plan: 'premium', status: 'active', isStaff: false, entitlements: {} });
  if (p.startsWith('/api/')) return j({});
  const f = resolve(root, '.' + (p === '/' ? '/central-v119.html' : decodeURIComponent(p)));
  try { const d = await readFile(f); res.writeHead(200, { 'content-type': mime[extname(f)] || 'application/octet-stream' }); res.end(d); } catch { res.writeHead(404); res.end(); }
});
await new Promise((r) => server.listen(0, '127.0.0.1', r));
const base = `http://127.0.0.1:${server.address().port}`;
const browser = await chromium.launch({ headless: true, args: ['--no-sandbox'] });
try {
  for (const [nome, viewport] of [['tablet 1250', { width: 1250, height: 2000 }], ['tablet 1000', { width: 1000, height: 1600 }], ['tablet 834', { width: 834, height: 1300 }]]) {
    const ctx = await browser.newContext({ viewport, screen: viewport, hasTouch: true, serviceWorkers: 'block' });
    const page = await ctx.newPage();
    await page.goto(`${base}/central-v119.html?view=home`);
    await page.waitForFunction(() => document.documentElement.dataset.centralReady === 'true', { timeout: 60000 });
    await page.waitForTimeout(600);
    const m = await page.evaluate(() => [...document.querySelectorAll('#centralSidebar [data-student-primary-nav]')].map((e) => { const r = e.getBoundingClientRect(); return { k: e.dataset.studentPrimaryNav, l: r.left, r: r.right, w: r.width, h: r.height }; }));
    const keys = m.map((x) => x.k);
    for (const k of ['agenda', 'progress', 'questoes', 'law', 'vade', 'edital', 'more']) assert.ok(keys.includes(k), `${nome}: falta ${k}`);
    for (const x of m) {
      assert.ok(x.l >= 0 && x.r <= viewport.width + 1, `${nome}: ${x.k} fora da tela (${Math.round(x.l)}–${Math.round(x.r)})`);
      assert.ok(x.w >= 60 && x.w < viewport.width / 2, `${nome}: ${x.k} com largura estranha (${Math.round(x.w)})`);
      assert.ok(x.h >= 44, `${nome}: ${x.k} pequeno para toque`);
    }
    await ctx.close();
  }
  console.log('ok: menu do topo completo em tablet 1250/1000/834');
} finally { await browser.close(); server.close(); }
