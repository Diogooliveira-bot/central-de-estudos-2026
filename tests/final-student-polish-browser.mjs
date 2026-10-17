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
  await page.waitForFunction(() => document.documentElement.dataset.centralReady === 'true' && typeof openPerformance === 'function' && window.CentralStudentUX?.version === '3');
  await page.waitForSelector('#performanceView:not(.hidden)');
  assert.equal(new URL(page.url()).searchParams.get('view'), 'performance');
  assert.equal(await page.locator('meta[name="central-source-version"]').getAttribute('content'), '6.6.134');
  assert.match(await page.locator('.central-version-v41').innerText(), /6\.6\.126/);
  assert.equal(await page.locator('html').evaluate((node) => node.classList.contains('student-experience-v3')), true);
  assert.deepEqual(await page.locator('#centralSidebar [data-student-primary-nav] .nav-text').allTextContents(), ['Hoje','Plano','Disciplinas','Progresso','Mais']);
  assert.equal(await page.locator('#mapaEstudos').evaluate((node) => getComputedStyle(node.closest('.card')).display), 'none');
  assert.equal(await page.locator('#studentPerformanceInsight').count(), 1);
  assert.equal(await page.locator('#studentProgressWeek').count(), 1);
  assert.equal(await page.locator('#studentSkipLink').innerText(), 'Pular para o conteúdo');

  await page.locator('#centralSidebar .nav button').filter({ hasText:'Hoje' }).click();
  await page.waitForSelector('#homeView:not(.hidden)');
  assert.equal(new URL(page.url()).searchParams.get('view'), 'home');
  assert.equal(await page.locator('#subjects > .subject.open').count(), 0);
  await page.evaluate(() => {
    localStorage.setItem('central-v6:last', JSON.stringify({ url:'folder:decorando', title:'decorando', at:Date.now() }));
    renderContinue();
  });
  assert.match(await page.locator('#continueBox').innerText(), /Lei em Dia/);
  assert.equal(await page.locator('#studentNextStep').count(), 1);
  assert.equal(await page.locator('#studentWeekSummary').count(), 1);
  assert.equal(await page.locator('#subjects > .subject').count(), 10);
  assert.equal(await page.locator('#subjects > .subject .student-subject-summary').count(), 9);
  assert.equal(await page.locator('#subjects > .subject[data-id="rlm"] .student-subject-summary').count(), 0);
  assert.match(await page.locator('#subjects > .subject[data-id="cpp"] .subject-count').innerText(), /\/22 módulos/);
  assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1));

  await page.locator('#studentMoreButton').click();
  assert.equal(await page.locator('#studentMorePanel').getAttribute('hidden'), null);
  assert.deepEqual(await page.locator('#studentMorePanel [data-student-more-action] b').allTextContents(), ['Cadernos TEC','Lei em Dia','Vade Mecum','Meu plano','Configurações','Sair da conta']);
  await page.keyboard.press('Escape');
  assert.notEqual(await page.locator('#studentMorePanel').getAttribute('hidden'), null);
  await page.evaluate(() => window.CentralStudentOnboarding.open());
  await page.waitForSelector('[data-student-onboarding]');
  assert.match(await page.locator('#studentOnboardingTitle').innerText(), /organizar seus estudos/i);
  assert.equal(await page.locator('input[name="priorities"]:checked').count(), 3);
  await page.locator('[data-onboarding-close]').first().click();

  await page.locator('[data-central-agenda]').click();
  await page.waitForSelector('#agendaView:not(.hidden)');
  assert.equal(new URL(page.url()).searchParams.get('view'), 'agenda');
  assert.equal(await page.locator('#agendaDisc option[value="pt"]').innerText(), 'Português');
  assert.equal(await page.locator('#studentAgendaWeek .student-agenda-day').count(), 7);
  assert.notEqual(await page.locator('.student-agenda-form-card').getAttribute('hidden'), null);
  await page.locator('#studentAgendaAddToggle').click();
  assert.equal(await page.locator('.student-agenda-form-card').getAttribute('hidden'), null);
  await page.locator('#agendaDisc').selectOption('pt');
  await page.locator('#agendaTask').fill('Leitura de teste');
  await page.locator('#agendaAddButton').click();
  assert.match(await page.locator('#agendaEditor').innerText(), /Português/);
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
  assert.equal(await page.locator('#mapaEstudosDisc').evaluate((node) => getComputedStyle(node.closest('.card')).display), 'none');
  assert.equal(await page.locator('#disciplineGrid .student-discipline-details').count(), 9);
  assert.equal(await page.locator('#disciplineGrid .disc-card[data-id="rlm"] .student-discipline-details').count(), 0);
  const topCpp = await page.locator('.disc-card[data-id="cpp"] .disc-meta').innerText();
  const mapCpp = await page.locator('#mapaEstudosDisc .mp-card[data-sid="cpp"] .mp-badge').innerText();
  assert.match(topCpp, /2\/22 módulos/);
  assert.match(topCpp, new RegExp(`${mapCpp.replace('%','')}%`));

  await page.goBack();
  await page.waitForSelector('#agendaView:not(.hidden)');
  assert.equal(new URL(page.url()).searchParams.get('view'), 'agenda');

  await page.evaluate(() => {
    const overlay = document.createElement('div');
    overlay.id = 'student-reader-test';
    overlay.className = 'bc-native-reader-overlay';
    overlay.innerHTML = '<div class="bc-native-reader"><header class="bc-native-reader-head"><div class="bc-native-reader-title"><b>Leitura teste</b></div><button class="bc-native-reader-close">×</button></header><div class="bc-native-reader-tools"><input type="search"></div><div class="bc-native-reader-body"><main class="bc-native-scroll"><article class="bc-native-article">Conteúdo</article></main></div></div>';
    document.body.appendChild(overlay);
  });
  await page.waitForSelector('#student-reader-test .student-reader-options-toggle');
  assert.equal(await page.locator('html').evaluate((node) => node.classList.contains('student-reader-active')), true);
  assert.equal(await page.locator('#centralSidebar').evaluate((node) => getComputedStyle(node).display), 'none');
  await page.locator('#student-reader-test .student-reader-options-toggle').click();
  assert.equal(await page.locator('#student-reader-test .bc-native-reader-tools').evaluate((node) => getComputedStyle(node).display), 'flex');
  await page.evaluate(() => document.getElementById('student-reader-test')?.remove());
  await page.waitForFunction(() => !document.documentElement.classList.contains('student-reader-active'));

  await page.setViewportSize({ width:320, height:700 });
  assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1));
  await page.setViewportSize({ width:1280, height:800 });
  assert.ok(await page.locator('#centralSidebar .nav').evaluate((node) => node.scrollWidth <= node.clientWidth + 1));

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

  const firstAccessContext = await browser.newContext({ viewport:{ width:390, height:844 }, serviceWorkers:'block' });
  const firstAccess = await firstAccessContext.newPage();
  await firstAccess.goto(`${base}/central-v119.html?view=home`, { waitUntil:'domcontentloaded' });
  await firstAccess.waitForFunction(() => window.CentralStudentUX?.version === '3');
  await firstAccess.waitForSelector('[data-student-onboarding]', { timeout:5000 });
  await firstAccess.locator('input[name="objective"]').fill('TJCE — teste de entrada');
  await firstAccess.locator('#studentOnboardingForm button[type="submit"]').click();
  await firstAccess.waitForSelector('[data-student-onboarding]', { state:'detached' });
  const firstPlan = await firstAccess.evaluate(() => ({
    profile:JSON.parse(localStorage.getItem('central-v6:student-profile-v1') || 'null'),
    taskDays:Array.from({ length:localStorage.length }, (_, index) => localStorage.key(index)).filter((key) => key?.startsWith('central-v6:agenda:')).filter((key) => JSON.parse(localStorage.getItem(key) || '[]').length > 0).length,
  }));
  assert.equal(firstPlan.profile.objective, 'TJCE — teste de entrada');
  assert.equal(firstPlan.profile.priorities.length, 3);
  assert.ok(firstPlan.taskDays >= 4 && firstPlan.taskDays <= 5, JSON.stringify(firstPlan));
  await firstAccessContext.close();
  console.log(JSON.stringify({ mapCounts, topCpp, mapCpp, firstPlan, errors }));
} finally {
  await browser.close();
  server.close();
}
