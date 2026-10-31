import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { createServer } from 'node:http';
import { fileURLToPath } from 'node:url';
import { test } from 'node:test';
import { chromium } from 'playwright';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');

function readWindowValue(file, key) {
  const context = { window: {} };
  vm.runInNewContext(read(file), context);
  return context.window[key];
}

test('bootstrap Civil preserva os 66 destinos e remove sua exibição antiga do módulo', async (t) => {
  const data = readWindowValue('content/civil/civil-sharing-links.js', 'CIVIL_SHARING_LINKS');
  const index = readWindowValue('content/civil/civil-native-index.js', 'CIVIL_NATIVE_INDEX');
  const boot = read('central-v119.html');
  const shell = read('index.html');
  const lazy = read('central-lazy-theory-v66119.js');
  const loader = read('central-discipline-loader.js');
  const manifest = JSON.parse(read('central-offline-files-v66172.json'));
  const serviceWorker = read('sw.js');
  assert.equal(data.general, 15);
  assert.equal(data.subdivision, 51);
  assert.equal(data.items.length, 66);
  assert.equal(new Set(data.items.map((x) => x.subdivisao || x.modulo)).size, 66);
  assert(boot.includes('content/civil/civil-sharing-links.js?v=20261009civilsharing2'));
  assert(boot.includes('ui/civil-native-study-v1.js?v=20261031readerstd2'));
  assert(boot.includes('ui/civil-native-study-v1.css?v=20261019civilstandard1'));
  assert(lazy.includes('content/civil/civil-sharing-links.js?v=20261009civilsharing2'));
  assert(lazy.includes('ui/civil-native-study-v1.js?v=20261031readerstd2'));
  assert(boot.includes('groups.civil=groups.civil.filter('), 'Bootstrap deve retirar primeiro os scripts antigos do mesmo caminho.');
  assert(loader.includes('const path=new URL(src,location.origin).pathname') && loader.includes('seen.has(path)'), 'O teste precisa cobrir a deduplicação real do carregador.');
  assert(!manifest.files.includes('/content/civil/civil-sharing-links.js?v=20261009civilsharing2'), 'catálogo TEC deve ficar fora do cache público');
  for (const asset of [
    '/ui/civil-native-study-v1.js?v=20261031readerstd2',
    '/ui/civil-native-study-v1.css?v=20261019civilstandard1',
  ]) assert(manifest.files.includes(asset), `${asset}: ausente no pacote offline.`);
  assert.match(serviceWorker, /central-offline-files-v66172\.json\?v=20261028singleloading1/);

  const moduleByUid = new Map(index.modules.map((m) => [m.uid, m]));
  const perModule = new Map();
  for (const item of data.items) {
    const number = Number(item.modulo.slice(1));
    const mod = moduleByUid.get(item.moduloUid);
    assert(mod, `${item.modulo}: UID não existe no índice Civil.`);
    assert.equal(mod.number, number);
    assert.equal(item.moduloTitulo, mod.title);
    assert.match(item.link, /^https:\/\/www\.tecconcursos\.com\.br\/s\/[A-Za-z0-9]+$/);
    const code = item.subdivisao || item.modulo;
    assert(item.idCaderno && item.quantidade > 0 && item.status === 'Validado');
    assert.equal(item.validacao.filtros, 'OK');
    assert.match(item.validacao.quantidade, /^OK/);
    assert(!/\/questoes\/cadernos\//.test(item.link), `${codeOf(item)}: referência interna de conta encontrada.`);
    perModule.set(item.modulo, (perModule.get(item.modulo) || 0) + 1);
  }
  assert.equal(perModule.size, 15);
  for (let n = 1; n <= 15; n++) assert.equal(perModule.get(`M${String(n).padStart(2, '0')}`), 1 + data.items.filter((x) => x.modulo === `M${String(n).padStart(2, '0')}` && x.subdivisao).length);

  // Simulate the bootstrap's script extraction from the actual shell, then
  // apply the same current-file replacement used by central-v119.html.
  const originalCivilFiles = [...shell.matchAll(/<script\b[^>]*\bsrc=["']([^"']+)["'][^>]*>/gi)]
    .map((match) => match[1])
    .filter((src) => {
      const path = src.split('?')[0].replace(/^\//, '');
      return path.startsWith('content/civil/') || path === 'ui/civil-native-study-v1.js';
    });
  const bootCivilFiles = [
    'content/civil/civil-native-index.js?v=20261018civiljur1',
    'content/civil/civil-sharing-links.js?v=20261009civilsharing2',
    'ui/civil-native-study-v1.js?v=20261031readerstd2',
  ];
  for (const src of bootCivilFiles) assert(boot.includes(src));
  const rawCivilFiles = [...originalCivilFiles,
    'content/civil/civil-native-index.js?v=20261018civiljur1',
    'ui/civil-native-study-v1.js?v=20261031readerstd2',
  ];
  const currentCivilFiles = rawCivilFiles.filter((src) => {
    const path = src.split('?')[0].replace(/^\//, '');
    return path !== 'content/civil/civil-native-index.js' && path !== 'content/civil/civil-sharing-links.js' && path !== 'ui/civil-native-study-v1.js';
  });
  const effectiveCivilFiles = [
    bootCivilFiles[0],
    ...currentCivilFiles,
    bootCivilFiles[1],
    bootCivilFiles[2],
  ];
  const uniqueCivilFiles = [];
  const seenCivilPaths = new Set();
  for (const src of effectiveCivilFiles) {
    const url = new URL(src, 'http://localhost');
    if (!seenCivilPaths.has(url.pathname)) { seenCivilPaths.add(url.pathname); uniqueCivilFiles.push(src); }
  }
  effectiveCivilFiles.splice(0, effectiveCivilFiles.length, ...uniqueCivilFiles);
  const effectivePaths = effectiveCivilFiles.map((src) => new URL(src, 'http://localhost').pathname);
  assert.equal(effectivePaths.filter((p) => p === '/ui/civil-native-study-v1.js').length, 1);
  assert.equal(effectivePaths.filter((p) => p === '/content/civil/civil-sharing-links.js').length, 1);
  assert(effectiveCivilFiles.indexOf('content/civil/civil-sharing-links.js?v=20261009civilsharing2') < effectiveCivilFiles.indexOf('ui/civil-native-study-v1.js?v=20261031readerstd2'));

  const server = createServer((req, res) => {
    const pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
    if (pathname === '/') {
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end('<!doctype html><html class="bc-ui-v1" data-bc-theme="light"><head><link rel="stylesheet" href="/ui/civil-native-study-v1.css?v=20261019civilstandard1"></head><body><main id="subjects"><section class="subject" data-id="civil"><div class="subject-body"><div class="subject-bar"><span></span></div></div></section></main></body></html>');
      return;
    }
    const filename = path.join(root, pathname.replace(/^\/+/, ''));
    if (!filename.startsWith(root) || !fs.existsSync(filename)) {
      res.writeHead(404);
      res.end('not found');
      return;
    }
    res.writeHead(200, { 'Content-Type': 'text/javascript; charset=utf-8' });
    fs.createReadStream(filename).pipe(res);
  });
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  const address = server.address();
  let browser;
  try { browser = await chromium.launch({ headless: true }); }
  catch (error) {
    await new Promise((resolve) => server.close(resolve));
    if (/Executable doesn't exist/.test(error.message)) { t.skip('Chromium do Playwright não está instalado neste ambiente; validação de navegador fica pendente.'); return; }
    throw error;
  }
  try {
    const page = await browser.newPage();
    const pageErrors = [];
    page.on('pageerror', (error) => pageErrors.push(error.message));
    await page.goto(`http://127.0.0.1:${address.port}/`);
    await page.evaluate(() => {
      localStorage.setItem('central-v6:civil-native:m01:summary:read', '37');
      localStorage.setItem('central-v6:civil-native:m01:complete:read', '64');
      localStorage.setItem('central-v6:civil-native:m01:notes:history', JSON.stringify([{ id: 1, text: 'nota preservada' }]));
      localStorage.setItem('central-v6:civil-native:external:v1', JSON.stringify({ 1: [{ done: 12, correct: 9, date: '2026-10-17' }] }));
      localStorage.setItem('central-v6:civil-native:m01:complete:questions', JSON.stringify({ attempts: [{ score: 7, total: 10 }], current: { answers: { 0: 'B' }, confirmed: { 0: true } } }));
    });
    await page.evaluate((files) => { window.__centralDisciplineFiles = { civil: files }; }, effectiveCivilFiles);
    await page.addScriptTag({ path: path.join(root, 'central-discipline-loader.js') });
    await page.evaluate(() => CentralDisciplineLoader.load('civil'));

    const moduleAudit = await page.locator('[data-civil-native-module]').evaluateAll((modules) => modules.map((module) => {
      const zone = module.querySelector('.cv-zone');
      const children = [...zone.children].map((node) => node.matches('[data-bcq-module-panel]') ? 'bcq-module-panels' : node.classList[0]);
      return {
        number: Number(module.dataset.civilNativeModule),
        children,
        complete: module.querySelector('.cv-card-complete')?.querySelector('b')?.textContent,
        review: module.querySelector('.cv-card-review')?.querySelector('b')?.textContent,
        infographic: module.querySelector('.cv-card-infographic')?.querySelector('b')?.textContent,
        completeActions: [...module.querySelector('.cv-card-complete .cv-standard-actions').querySelectorAll('button')].map((button) => button.textContent.trim()),
        reviewActions: [...module.querySelector('.cv-card-review .cv-standard-actions').querySelectorAll('button')].map((button) => button.textContent.trim()),
        notes: module.querySelectorAll('.cv-note-input').length,
        legacyManualEntry: !!module.querySelector('.cv-rounds, input[id^="cv-ext-"]'),
      };
    }));
    assert.equal(moduleAudit.length, 15, 'A auditoria deve conferir os 15 módulos reais.');
    for (const module of moduleAudit) {
      assert.deepEqual(module.children, ['cv-zone-head', 'cv-progress-grid', 'cv-oriented', 'cv-cards', 'cv-panel', 'bcq-module-panels', 'cv-tools'], `M${module.number}: ordem visual diferente do padrão.`);
      assert.equal(module.complete, 'Teoria completa', `M${module.number}: card completo ausente.`);
      assert.equal(module.review, 'Versão de revisão', `M${module.number}: card de versão de revisão ausente.`);
      assert.equal(module.infographic, 'Infográfico', `M${module.number}: card de infográfico ausente.`);
      assert(module.completeActions[0].startsWith('Estudar conteúdo'));
      assert.equal(module.completeActions[1], 'Resolver 10 questões');
      assert(module.reviewActions[0].startsWith('Revisar conteúdo'));
      assert.equal(module.reviewActions[1], 'Resolver 5 questões');
      assert.equal(module.notes, 1, `M${module.number}: notas duplicadas ou ausentes.`);
      assert.equal(module.legacyManualEntry, false, `M${module.number}: formulário manual redundante permaneceu.`);
    }
    const styleAudit = await page.locator('.cv-standard-card').first().evaluate((card) => ({
      display: getComputedStyle(card).display,
      gridColumns: getComputedStyle(card).gridTemplateColumns,
      bg: getComputedStyle(card).backgroundColor,
      actionsDirection: getComputedStyle(card.querySelector('.cv-standard-actions')).flexDirection,
    }));
    assert.equal(styleAudit.display, 'grid');
    assert.equal(styleAudit.actionsDirection, 'column');
    assert.match(styleAudit.gridColumns, /104px/);

    const oldLinks = await page.locator('a[data-civil-share], .cv-sharing, .cv-tec-panel').count();
    assert.equal(oldLinks, 0, 'Os links e painéis antigos não devem aparecer no módulo.');
    assert.equal(data.items.length, 66, 'Os destinos oficiais seguem preservados no catálogo.');
    const actual = data.items;
    const destinations = [];

    const preserved = await page.evaluate(() => ({
      note: JSON.parse(localStorage.getItem('central-v6:civil-native:m01:notes:history'))[0].text,
      questions: JSON.parse(localStorage.getItem('central-v6:civil-native:m01:complete:questions')),
      external: JSON.parse(localStorage.getItem('central-v6:civil-native:external:v1'))[1][0],
      noteCards: document.querySelectorAll('[data-civil-native-module="1"] .cv-note-input').length,
      oldRoundDataStillPresent: document.getElementById('cv-ext-d-1-0') === null,
    }));
    assert.equal(preserved.note, 'nota preservada');
    assert.equal(preserved.questions.attempts[0].score, 7);
    assert.equal(preserved.questions.current.answers[0], 'B');
    assert.equal(preserved.external.done, 12);
    assert.equal(preserved.noteCards, 1);
    assert.equal(preserved.oldRoundDataStillPresent, true);

    for (const width of [1440, 1024, 768, 390]) {
      await page.setViewportSize({ width, height: 1000 });
      const layout = await page.locator('.cv-standard-card').first().evaluate((card) => {
        const actions = card.querySelector('.cv-standard-actions').getBoundingClientRect();
        return { width: card.getBoundingClientRect().width, scrollWidth: document.documentElement.scrollWidth, actionsWidth: actions.width, direction: getComputedStyle(card.querySelector('.cv-standard-actions')).flexDirection };
      });
      assert(layout.width > 0, `${width}px: card desapareceu.`);
      assert(layout.scrollWidth <= width + 1, `${width}px: overflow horizontal ${layout.scrollWidth}px.`);
      assert(layout.actionsWidth > 0, `${width}px: botões não renderizaram.`);
      assert.equal(layout.direction, 'column');
      if (width === 390) await page.screenshot({ path: '/tmp/civil-standard-390.png', fullPage: true });
    }

    await page.evaluate(() => CivilNative.openModule(1));
    await page.locator('[data-civil-native-module="1"] .cv-oriented-done').click();
    assert.equal(await page.evaluate(() => localStorage.getItem('central-v6:civil-native:m01:summary:read')), '100');
    assert.equal(await page.evaluate(() => localStorage.getItem('central-v6:civil-native:m01:complete:read')), '100');
    await page.locator('[data-civil-native-module="1"] .cv-card-complete .cv-standard-quiz').click();
    await page.waitForFunction(() => !document.getElementById('civil-native-questions')?.hidden);
    assert.match(await page.locator('#cv-q-eye').textContent(), /COMPLETA/);
    await page.evaluate(() => CivilNative.closeQuestions());
    await page.locator('[data-civil-native-module="1"] .cv-card-infographic .cv-standard-button').click();
    await page.waitForFunction(() => !document.getElementById('civil-native-image-viewer')?.hidden && document.getElementById('cv-img')?.complete);
    const image = await page.locator('#cv-img').evaluate((img) => ({ width: img.naturalWidth, height: img.naturalHeight, src: img.src, fit: getComputedStyle(img).objectFit, download: document.getElementById('cv-img-download').download }));
    assert(image.width > 0 && image.height > 0, 'O infográfico real não abriu integralmente.');
    assert.equal(image.fit, 'contain');
    assert.match(image.download, /direito-civil-modulo-01-infografico\.webp/);
    await page.evaluate(() => { CivilNative.zoomImage(.5); });
    assert.equal(await page.locator('#civil-native-image-viewer').getAttribute('data-zoom'), '1.5');
    await page.evaluate(() => CivilNative.closeImage());
    assert.deepEqual(pageErrors, []);
    console.log(JSON.stringify({ loadedThrough: 'CentralDisciplineLoader.load(civil)', retainedFilterRecords: actual.length, oldLinksRendered: oldLinks, modules: 15, general: 15, subdivisions: 51, standardOrderAndCards: moduleAudit.length, responsiveWidths: [1440, 1024, 768, 390], infographic: `${image.width}x${image.height}`, studentData: 'preserved', browserErrors: pageErrors }, null, 2));
  } finally {
    await browser.close();
    await new Promise((resolve) => server.close(resolve));
  }
});

function codeOf(item) { return item.subdivisao || item.modulo; }
