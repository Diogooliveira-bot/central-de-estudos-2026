// Teste de navegador do visual das questões internas (faixa fixa, alvos de toque, botões acima da barra do celular,
// sem rolagem lateral). Usa um /api/questoes de mentira e conta fictícia. Rode: node tests/questoes-visual-browser.mjs
// Para ver como ficou: QA_SHOTS=/pasta node tests/questoes-visual-browser.mjs
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { readFileSync } from 'node:fs';
import { resolve, extname, join } from 'node:path';
import vm from 'node:vm';
import { chromium } from 'playwright';

const root = resolve(new URL('..', import.meta.url).pathname);
const mime = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.webp': 'image/webp', '.png': 'image/png' };
const banco = (disc, n) => { const w = { window: { BC_QUESTOES: {} } }; vm.runInNewContext(readFileSync(join(root, `content/questoes/${disc}/m${String(n).padStart(2, '0')}.js`), 'utf8'), w); return w.window.BC_QUESTOES[disc][n]; };
const uso = { plan: 'premium', limit: null, used: 0, remaining: null, answeredToday: [] };
const server = createServer(async (req, res) => {
  const u = new URL(req.url, 'http://x'); const path = u.pathname;
  const json = (b) => { res.writeHead(200, { 'content-type': 'application/json' }); res.end(JSON.stringify(b)); };
  if (path === '/api/auth') return json({ authenticated: true, user: { id: 'f', name: 'Aluno Fictício', role: 'aluno', plan: 'premium' } });
  if (path === '/api/sync') return json(req.method === 'POST' ? { revision: 1 } : { exists: false });
  if (path === '/api/plans') return json({ role: 'aluno', plan: 'premium', status: 'active', isStaff: false, entitlements: {} });
  if (path === '/api/questoes') {
    const action = u.searchParams.get('action');
    if (action === 'uso') return json({ usage: uso });
    if (action === 'modulo') return json({ items: banco(u.searchParams.get('disc'), Number(u.searchParams.get('n'))).map((q) => ({ id: q.id, q: q.q, options: q.options.slice(), origem: q.origem })), usage: uso });
    if (action === 'responder') { let body = ''; for await (const c of req) body += c; const b = JSON.parse(body); const q = banco(b.disc, Number(b.n)).find((x) => x.id === b.id); return json({ id: q.id, choice: b.choice, correct: b.choice === q.answer, answer: q.answer, explanation: q.explanation, lawRef: q.lawRef, usage: uso }); }
  }
  if (path.startsWith('/api/')) return json({});
  const file = resolve(root, '.' + (path === '/' ? '/central-v119.html' : decodeURIComponent(path)));
  try { const d = await readFile(file); res.writeHead(200, { 'content-type': mime[extname(file)] || 'application/octet-stream' }); res.end(d); } catch { res.writeHead(404); res.end(); }
});
await new Promise((r) => server.listen(0, '127.0.0.1', r));
const base = `http://127.0.0.1:${server.address().port}`;
const browser = await chromium.launch({ headless: true, args: ['--no-sandbox'] });
try {
  for (const [nome, viewport] of [['tablet', { width: 1000, height: 700 }], ['celular', { width: 390, height: 844 }]]) {
    const ctx = await browser.newContext({ viewport, serviceWorkers: 'block' });
    const page = await ctx.newPage(); const erros = []; page.on('pageerror', (e) => erros.push(e.message));
    await page.goto(`${base}/central-v119.html?view=home`);
    await page.waitForFunction(() => document.documentElement.dataset.centralReady === 'true', { timeout: 60000 });
    await page.waitForTimeout(600);
    await page.evaluate(() => { document.querySelectorAll('*').forEach((e) => { if (/Bem-vindo à Base Completa/.test(e.textContent || '') && getComputedStyle(e).position === 'fixed') e.remove(); }); });
    await page.evaluate(() => window.BCQuestoesArea.openModule('pt', 3));
    await page.waitForSelector('.bcqa-q', { timeout: 15000 }); await page.waitForTimeout(300);
    const shot = async (n) => { if (process.env.QA_SHOTS) await page.screenshot({ path: join(process.env.QA_SHOTS, `${nome}-${n}.png`) }); };
    await shot('1-inicio');

    // faixa fixa (sticky), sem rolagem lateral e alvos de toque confortáveis
    const m = await page.evaluate(() => {
      const r = (s) => document.querySelector(s)?.getBoundingClientRect();
      return { sticky: getComputedStyle(document.querySelector('.bcqa-strip')).position, strike: r('.bcqa-strike'), opt: r('.bcqa-option'), overflow: document.documentElement.scrollWidth > innerWidth + 1, h3: getComputedStyle(document.querySelector('.bcqa-q h3')).fontWeight };
    });
    assert.equal(m.sticky, 'sticky', nome + ': faixa fixa');
    assert.ok(m.strike.width >= 43 && m.strike.height >= 43, nome + ': botão de riscar com 44px');
    assert.ok(m.opt.height >= 50, nome + ': alternativa com altura de toque');
    assert.equal(m.overflow, false, nome + ': sem rolagem lateral');
    assert.ok(Number(m.h3) <= 600, nome + ': enunciado sem negrito pesado');

    // responder pelo teclado e ver a correção
    await page.keyboard.press('c'); await page.keyboard.press('Enter');
    await page.waitForSelector('.bcqa-q[data-i="0"] .bcqa-feedback'); await page.waitForTimeout(500);
    await shot('2-corrigida');
    assert.ok(await page.evaluate(() => document.querySelector('.bcqa-dot[data-goto="0"]').classList.contains('ok') || document.querySelector('.bcqa-dot[data-goto="0"]').classList.contains('err')));

    // Foco: botões fixos visíveis e acima da barra inferior da Central
    await page.click('[data-modo="foco"]'); await page.waitForTimeout(400);
    await shot('3-foco');
    const pos = await page.evaluate(() => {
      const nav = document.querySelector('.bcqa-nav').getBoundingClientRect(), bar = document.querySelector('.student-nav-scroll')?.getBoundingClientRect();
      return { navBottom: nav.bottom, barTop: bar && bar.top > innerHeight / 2 ? bar.top : innerHeight, vis: nav.top >= 0 };
    });
    assert.ok(pos.navBottom <= pos.barTop + 1 && pos.vis, `${nome}: Anterior/Avançar visíveis (fim ${pos.navBottom} · barra ${pos.barTop})`);

    await page.click('[data-modo="rolagem"]');
    for (let i = 1; i < 10; i++) { await page.click(`.bcqa-q[data-i="${i}"] [data-op="${i % 5}"]`); await page.click(`.bcqa-q[data-i="${i}"] [data-responder]`); await page.waitForSelector(`.bcqa-q[data-i="${i}"] .bcqa-feedback`); }
    await page.evaluate(() => { document.querySelector('[data-bcqa-corpo]').scrollTop = 0; }); await page.waitForTimeout(300);
    await shot('4-resultado');
    assert.ok(await page.$('.bcqa-result .bcqa-ring'), nome + ': resultado com anel');
    assert.deepEqual(erros, [], nome + ': sem erros de script');
    await ctx.close();
  }
  console.log('questoes-visual-browser: ok');
} finally { await browser.close(); server.close(); }
