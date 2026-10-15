import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, resolve } from 'node:path';
import assert from 'node:assert/strict';
import { chromium } from 'playwright';

const root = resolve('.');
const mime = { '.html':'text/html', '.js':'text/javascript', '.css':'text/css', '.json':'application/json', '.webmanifest':'application/manifest+json', '.webp':'image/webp', '.png':'image/png', '.svg':'image/svg+xml', '.ico':'image/x-icon' };
const server = createServer(async (request, response) => {
  const url = new URL(request.url, 'http://localhost');
  if (url.pathname === '/api/auth') {
    response.writeHead(200, { 'Content-Type':'application/json' });
    response.end(JSON.stringify({ authenticated:true, user:{ id:'student-polish', name:'Aluno teste', role:'aluno' } }));
    return;
  }
  if (url.pathname === '/api/sync') {
    response.writeHead(200, { 'Content-Type':'application/json' });
    response.end(request.method === 'POST' ? JSON.stringify({ revision:1 }) : JSON.stringify({ exists:false }));
    return;
  }
  if (url.pathname.startsWith('/api/')) {
    response.writeHead(200, { 'Content-Type':'application/json' });
    response.end('{}');
    return;
  }
  const path = url.pathname === '/' ? '/central-v119.html' : decodeURIComponent(url.pathname);
  const file = resolve(root, `.${path}`);
  if (!file.startsWith(`${root}\\`) && !file.startsWith(`${root}/`)) { response.writeHead(403); response.end(); return; }
  try {
    const body = await readFile(file);
    response.writeHead(200, { 'Content-Type':mime[extname(file)] || 'application/octet-stream' });
    response.end(body);
  } catch {
    response.writeHead(404); response.end();
  }
});

await new Promise((resolveListen) => server.listen(0, '127.0.0.1', resolveListen));
const base = `http://127.0.0.1:${server.address().port}`;
const browser = await chromium.launch({ headless:true, executablePath:process.env.CHROMIUM_PATH, args:['--no-sandbox'] });

try {
  const context = await browser.newContext({ viewport:{ width:390, height:844 }, serviceWorkers:'block' });
  await context.addInitScript(() => {
    localStorage.setItem('central-v6:last', JSON.stringify({ url:'folder:decorando', title:'decorando', at:Date.now() }));
    localStorage.setItem('central-v6:open:pt', '1');
    localStorage.setItem('central-v6:open:trab', '1');
    localStorage.setItem('central-v6:cpp:curso22:v1', JSON.stringify({ modules:{ 1:{ reading:true }, 2:{ reading:true } } }));
  });
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto(`${base}/central-v119.html?view=performance`, { waitUntil:'domcontentloaded' });
  await page.waitForFunction(() => document.documentElement.dataset.centralReady === 'true' && typeof openPerformance === 'function');
  await page.waitForSelector('#performanceView:not(.hidden)');
  assert.equal(new URL(page.url()).searchParams.get('view'), 'performance');
  assert.equal(await page.locator('meta[name="central-source-version"]').getAttribute('content'), '6.6.122');
  assert.match(await page.locator('.central-version-v41').innerText(), /6\.6\.122/);

  await page.locator('#centralSidebar .nav button').filter({ hasText:'Início' }).click();
  await page.waitForSelector('#homeView:not(.hidden)');
  assert.equal(new URL(page.url()).searchParams.get('view'), 'home');
  assert.equal(await page.locator('#subjects > .subject.open').count(), 0);
  await page.evaluate(() => {
    localStorage.setItem('central-v6:last', JSON.stringify({ url:'folder:decorando', title:'decorando', at:Date.now() }));
    renderContinue();
  });
  assert.match(await page.locator('#continueBox').innerText(), /Lei em Dia/);
  assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1));

  await page.locator('[data-central-agenda]').click();
  await page.waitForSelector('#agendaView:not(.hidden)');
  assert.equal(new URL(page.url()).searchParams.get('view'), 'agenda');
  assert.equal(await page.locator('#agendaDisc option[value="pt"]').innerText(), 'Português');
  await page.evaluate(() => {
    localStorage.setItem('central-v6:cpp:curso22:v1', JSON.stringify({ modules:{ 1:{ reading:true }, 2:{ reading:true } } }));
  });

  await page.locator('[data-central-native="disciplines"]').click();
  await page.waitForSelector('#disciplinesView:not(.hidden)');
  await page.waitForFunction(() => document.querySelectorAll('#mapaEstudosDisc .mp-card').length > 5);
  await page.evaluate(() => window.renderDisciplineGrid());
  await page.waitForTimeout(250);
  const mapCounts = await page.evaluate(() => ({
    total:document.querySelectorAll('#mapaEstudosDisc .mp-card').length,
    collapsed:document.querySelectorAll('#mapaEstudosDisc .mp-card.collapsed').length,
    visibleButtons:[...document.querySelectorAll('#disciplinesView button')].filter((button) => button.getClientRects().length).length,
  }));
  assert.equal(mapCounts.collapsed, mapCounts.total);
  assert.ok(mapCounts.visibleButtons < 50, `Disciplinas ainda está densa: ${JSON.stringify(mapCounts)}`);
  const topCpp = await page.locator('.disc-card[data-id="cpp"] .disc-meta').innerText();
  const mapCpp = await page.locator('#mapaEstudosDisc .mp-card[data-sid="cpp"] .mp-badge').innerText();
  assert.match(topCpp, /2\/22 módulos/);
  assert.match(topCpp, new RegExp(`${mapCpp.replace('%','')}%`));

  await page.goBack();
  await page.waitForSelector('#agendaView:not(.hidden)');
  assert.equal(new URL(page.url()).searchParams.get('view'), 'agenda');

  await page.goto(`${base}/tools/vade.html`, { waitUntil:'domcontentloaded' });
  await page.waitForFunction(() => document.querySelector('.vm-brand'));
  assert.equal((await page.locator('#vmSyncStatus').innerText()).trim(), 'Somente local');
  await page.locator('.vm-brand').click();
  await page.waitForURL(/\?view=home/);

  await page.goto(`${base}/tools/decorando.html`, { waitUntil:'domcontentloaded' });
  await page.waitForFunction(() => typeof DATA !== 'undefined' && DATA.length > 0);
  assert.equal(await page.locator('.admin-edit-button:visible').count(), 0);
  assert.deepEqual(errors, []);
  await context.close();
  console.log(JSON.stringify({ mapCounts, topCpp, mapCpp, errors }));
} finally {
  await browser.close();
  server.close();
}
