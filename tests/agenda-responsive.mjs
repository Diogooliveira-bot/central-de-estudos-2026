import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, resolve } from 'node:path';
import assert from 'node:assert/strict';
import { chromium } from 'playwright';

const root = resolve('.');
const mime = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.webmanifest': 'application/manifest+json', '.webp': 'image/webp', '.png': 'image/png', '.svg': 'image/svg+xml', '.ico': 'image/x-icon' };
const server = createServer(async (request, response) => {
  const path = new URL(request.url, 'http://localhost').pathname;
  if (path.startsWith('/api/')) {
    response.writeHead(200, { 'Content-Type': 'application/json' });
    response.end(JSON.stringify(path === '/api/auth' ? { authenticated: true, user: { id: 'agenda-layout-test', name: 'Teste', role: 'aluno' } } : {}));
    return;
  }
  const file = resolve(root, '.' + (path === '/' ? '/central-v119.html' : path));
  if (!file.startsWith(root + '/')) { response.writeHead(403); response.end(); return; }
  try {
    const body = await readFile(file);
    response.writeHead(200, { 'Content-Type': mime[extname(file)] || 'application/octet-stream' });
    response.end(body);
  } catch { response.writeHead(404); response.end(); }
});

await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
const browser = await chromium.launch({ headless: true, executablePath: process.env.CHROMIUM_PATH || '/usr/bin/chromium', args: ['--no-sandbox'] });
try {
  const results = [];
  for (const width of [360, 390, 600, 800, 850, 900, 1024, 1440]) {
    const context = await browser.newContext({ viewport: { width, height: 900 }, serviceWorkers: 'block' });
    const page = await context.newPage();
    await page.goto(`http://127.0.0.1:${server.address().port}/central-v119.html`, { waitUntil: 'domcontentloaded' });
    await page.waitForFunction(() => document.documentElement.dataset.centralReady === 'true' && window.CentralAgenda?.renderHomeSummary);
    const result = await page.evaluate(() => {
      const date = new Date();
      const today = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
      localStorage.setItem(`central-v6:agenda:${today}`, JSON.stringify([
        { id: 'agenda-layout-test', time: '08:30', discipline: 'Direito Processual do Trabalho', task: 'Revisar questões e comentários extensos sem perder os botões de ação', done: false },
      ]));
      CentralAgenda.renderHomeSummary();
      const card = document.querySelector('.home-today-card');
      const row = card.querySelector('.agenda-row');
      const copy = row.querySelector('.agenda-copy');
      const buttons = [...row.querySelectorAll('button')].filter(button => getComputedStyle(button).display !== 'none');
      const headerButton = card.querySelector('.card-head > .btn');
      const bounds = element => { const r = element.getBoundingClientRect(); return { left: r.left, right: r.right, top: r.top, bottom: r.bottom, width: r.width }; };
      return { card: bounds(card), row: bounds(row), copy: bounds(copy), buttons: buttons.map(bounds), headerButton: bounds(headerButton), cardScroll: card.scrollWidth, cardClient: card.clientWidth, rowScroll: row.scrollWidth, rowClient: row.clientWidth, pageScroll: document.documentElement.scrollWidth, rowDisplay: getComputedStyle(row).display, copyFlex: getComputedStyle(copy).flex, cardBoxSizing: getComputedStyle(card).boxSizing, buttonShrink: buttons.map(button => getComputedStyle(button).flexShrink) };
    });
    results.push({ width, ...result });
    if (process.env.AGENDA_SCREENSHOT_DIR && [390, 850, 1440].includes(width)) await page.screenshot({ path: `${process.env.AGENDA_SCREENSHOT_DIR}/agenda-${width}.png` });
    assert.equal(result.buttons.length, 1, `Ação de estudo ausente em ${width}px`);
    assert.ok(result.cardScroll <= result.cardClient + 1, `Overflow no card em ${width}px: ${JSON.stringify(result)}`);
    assert.ok(result.rowScroll <= result.rowClient + 1, `Overflow na tarefa em ${width}px`);
    assert.ok(result.row.left >= result.card.left - 1 && result.row.right <= result.card.right + 1, `Tarefa fora do card em ${width}px`);
    assert.ok([...result.buttons, result.headerButton].every(button => button.right <= result.card.right + 1), `Botão fora do card em ${width}px`);
    assert.ok(result.pageScroll <= width + 1, `Overflow horizontal da página em ${width}px`);
    if (width <= 390) assert.ok(result.buttons[0].top >= result.copy.bottom - 1, `Ações não quebraram para a segunda linha em ${width}px`);
    if (width <= 1100) {
      assert.equal(result.cardBoxSizing, 'border-box');
      assert.ok(result.copyFlex.startsWith('1 '), `Texto sem flex:1 em ${width}px`);
      assert.deepEqual(result.buttonShrink, ['0']);
    }
    if (width === 1440) assert.equal(result.rowDisplay, 'grid', 'Visual desktop alterado');
    await context.close();
  }
  console.log(JSON.stringify(results, null, 2));
} finally {
  await browser.close();
  server.close();
}
