import { createServer } from 'node:http';
import { readFile, mkdir } from 'node:fs/promises';
import { extname, resolve } from 'node:path';
import assert from 'node:assert/strict';
import { chromium } from 'playwright';

const root = resolve('.');
const output = resolve('test-results/central-questoes');
const mime = { '.html':'text/html', '.js':'text/javascript', '.css':'text/css', '.json':'application/json', '.webmanifest':'application/manifest+json', '.webp':'image/webp', '.png':'image/png', '.svg':'image/svg+xml', '.ico':'image/x-icon' };
const server = createServer(async (request, response) => {
  const url = new URL(request.url, 'http://localhost');
  if (url.pathname === '/api/auth') {
    response.writeHead(200, { 'Content-Type':'application/json' });
    response.end(JSON.stringify({ authenticated:true, user:{ id:'central-questoes-browser', name:'Aluno teste', role:'aluno' } }));
    return;
  }
  if (url.pathname === '/api/sync') {
    response.writeHead(200, { 'Content-Type':'application/json' });
    response.end(request.method === 'POST' ? JSON.stringify({ revision:1 }) : JSON.stringify({ exists:false }));
    return;
  }
  if (url.pathname === '/api/external-question-filters') {
    response.writeHead(200, { 'Content-Type':'application/json' });
    response.end(JSON.stringify({ canManage:false, overrides:[] }));
    return;
  }
  if (url.pathname.startsWith('/api/')) {
    response.writeHead(200, { 'Content-Type':'application/json' });
    response.end('{}');
    return;
  }
  const pathname = url.pathname === '/' || url.pathname === '/central-de-questoes' ? '/central-v119.html' : decodeURIComponent(url.pathname);
  const file = resolve(root, `.${pathname}`);
  if (!file.startsWith(`${root}/`)) { response.writeHead(403); response.end(); return; }
  try {
    const body = await readFile(file);
    response.writeHead(200, { 'Content-Type':mime[extname(file)] || 'application/octet-stream' });
    response.end(body);
  } catch (_) {
    response.writeHead(404); response.end();
  }
});

await mkdir(output, { recursive:true });
await new Promise((resolveListen) => server.listen(0, '127.0.0.1', resolveListen));
const base = `http://127.0.0.1:${server.address().port}`;
const browser = await chromium.launch({ headless:true, executablePath:chromium.executablePath(), args:['--no-sandbox'] });

try {
  const sizes = [
    { name:'desktop', width:1366, height:900 },
    { name:'tablet', width:768, height:1024 },
    { name:'mobile', width:390, height:844 }
  ];
  for (const size of sizes) {
    const context = await browser.newContext({ viewport:size, serviceWorkers:'block' });
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', (error) => errors.push(error.message));
    await page.goto(`${base}/central-de-questoes`, { waitUntil:'domcontentloaded' });
    await page.waitForFunction(() => document.documentElement.dataset.centralReady === 'true' && window.ExternalQuestionFilters?.buildRegistry().length === 609, null, { timeout:30000 });
    await page.waitForSelector('#questionFiltersView:not(.hidden)');
    assert.equal(new URL(page.url()).pathname, '/central-de-questoes');
    assert.equal(await page.locator('[data-bcq-tab]').count(), 5);
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1));
    await page.locator('[data-bcq-tab="filters"]').click();
    await page.waitForSelector('[data-bcq-page-list] .bcq-page-filter');
    assert.equal(await page.locator('[data-bcq-page-list] .bcq-page-filter').count(), 609);
    const href = await page.locator('[data-bcq-detail] a[href]').first().getAttribute('href');
    assert.match(href, /^https:\/\/(?:www\.)?(?:qconcursos\.com|tecconcursos\.com\.br)\//);
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1));

    if (size.name === 'desktop') {
      await page.locator('[data-bcq-detail] [data-bcq-add]').click();
      await page.locator('#bcqSessionModal input[name="answered"]').fill('20');
      await page.locator('#bcqSessionModal input[name="correct"]').fill('15');
      assert.equal(await page.locator('[data-bcq-calculated]').innerText(), '75%');
      await page.locator('#bcqSessionModal button[type="submit"]').click();
      await page.locator('[data-bcq-tab="history"]').click();
      await page.waitForSelector('.bcq-center-history-row');
      assert.match(await page.locator('.bcq-center-history-row').first().innerText(), /20 respondidas/);
      assert.match(await page.locator('.bcq-center-history-row').first().innerText(), /75%/);
      await page.locator('.bcq-center-history-row [data-bcq-history-edit]').first().click();
      await page.locator('#bcqSessionModal input[name="correct"]').fill('16');
      await page.locator('#bcqSessionModal button[type="submit"]').click();
      await page.locator('[data-bcq-tab="history"]').click();
      assert.match(await page.locator('.bcq-center-history-row').first().innerText(), /80%/);
      page.once('dialog', (dialog) => dialog.accept());
      await page.locator('.bcq-center-history-row [data-bcq-history-delete]').first().click();
      await page.waitForSelector('.bcq-center-history-row', { state:'detached' });
    }

    await page.screenshot({ path:resolve(output, `${size.name}.png`), fullPage:true });
    assert.deepEqual(errors, []);
    await context.close();
  }
  console.log(JSON.stringify({ ok:true, viewports:sizes.map(({ name, width, height }) => ({ name, width, height })), filters:609 }));
} finally {
  await browser.close();
  server.close();
}
