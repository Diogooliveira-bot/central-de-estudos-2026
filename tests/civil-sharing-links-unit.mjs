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

test('bootstrap real seleciona a camada Civil atual e o carregador renderiza os 66 destinos', async () => {
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
  assert(boot.includes('ui/civil-native-study-v1.js?v=20261009civilsharing2'));
  assert(boot.includes('ui/civil-native-study-v1.css?v=20261009civilsharing2'));
  assert(lazy.includes('content/civil/civil-sharing-links.js?v=20261009civilsharing2'));
  assert(lazy.includes('ui/civil-native-study-v1.js?v=20261009civilsharing2'));
  assert(boot.includes('groups.civil=groups.civil.filter('), 'Bootstrap deve retirar primeiro os scripts antigos do mesmo caminho.');
  assert(loader.includes('const path=new URL(src,location.origin).pathname') && loader.includes('seen.has(path)'), 'O teste precisa cobrir a deduplicação real do carregador.');
  for (const asset of [
    '/content/civil/civil-sharing-links.js?v=20261009civilsharing2',
    '/ui/civil-native-study-v1.js?v=20261009civilsharing2',
    '/ui/civil-native-study-v1.css?v=20261009civilsharing2',
  ]) assert(manifest.files.includes(asset), `${asset}: ausente no pacote offline.`);
  assert(serviceWorker.includes('central-offline-files-v66172.json?v=20261009civilsharing2'));

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
    'content/civil/civil-native-index.js?v=20261005civil1',
    'content/civil/civil-sharing-links.js?v=20261009civilsharing2',
    'ui/civil-native-study-v1.js?v=20261009civilsharing2',
  ];
  for (const src of bootCivilFiles) assert(boot.includes(src));
  const rawCivilFiles = [...originalCivilFiles,
    'content/civil/civil-native-index.js?v=20261005civil1',
    'ui/civil-native-study-v1.js?v=20261005civil1',
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
  assert(effectiveCivilFiles.indexOf('content/civil/civil-sharing-links.js?v=20261009civilsharing2') < effectiveCivilFiles.indexOf('ui/civil-native-study-v1.js?v=20261009civilsharing2'));

  const server = createServer((req, res) => {
    const pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
    if (pathname === '/') {
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end('<!doctype html><html><head></head><body><main id="subjects"><section class="subject" data-id="civil"><div class="subject-body"><div class="subject-bar"><span></span></div></div></section></main></body></html>');
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
  const browser = await chromium.launch({ headless: true });
  try {
    const page = await browser.newPage();
    const pageErrors = [];
    page.on('pageerror', (error) => pageErrors.push(error.message));
    await page.goto(`http://127.0.0.1:${address.port}/`);
    await page.evaluate(() => {
      localStorage.setItem('central-v6:civil-native:m01:summary:read', '37');
      localStorage.setItem('central-v6:civil-native:m01:complete:read', '64');
      localStorage.setItem('central-v6:civil-native:m01:notes:history', JSON.stringify([{ id: 1, text: 'nota preservada' }]));
    });
    await page.evaluate((files) => { window.__centralDisciplineFiles = { civil: files }; }, effectiveCivilFiles);
    await page.addScriptTag({ path: path.join(root, 'central-discipline-loader.js') });
    await page.evaluate(() => CentralDisciplineLoader.load('civil'));

    const actual = await page.locator('a[data-civil-share]').evaluateAll((anchors) => anchors.map((anchor) => ({
      key: anchor.dataset.civilShare,
      href: anchor.href,
      label: anchor.querySelector('b')?.textContent || '',
      detail: anchor.querySelector('small')?.textContent || '',
      module: anchor.closest('[data-civil-native-module]')?.dataset.civilNativeModule,
      target: anchor.target,
      rel: anchor.rel,
    })));
    assert.equal(actual.length, 66, 'A interface não renderizou os 66 links.');
    for (const item of data.items) {
      const code = item.subdivisao || item.modulo;
      const row = actual.find((x) => x.key === code);
      assert(row, `${code}: link não apareceu no painel.`);
      assert.equal(row.href, item.link, `${code}: URL divergente.`);
      assert.equal(Number(row.module), Number(item.modulo.slice(1)), `${code}: associação ao módulo incorreta.`);
      assert(row.label.includes(item.titulo), `${code}: título divergente.`);
      assert(row.detail.includes(String(item.quantidade)), `${code}: quantidade não exibida.`);
      assert.equal(row.target, '_blank');
      assert(row.rel.includes('noopener') && row.rel.includes('noreferrer'));
    }

    await page.evaluate(() => {
      window.__civilClicked = [];
      document.addEventListener('click', (event) => {
        const anchor = event.target.closest('a[data-civil-share]');
        if (anchor) {
          event.preventDefault();
          window.__civilClicked.push({ key: anchor.dataset.civilShare, href: anchor.href });
        }
      }, true);
    });
    const beforeLinks = await page.evaluate(() => Object.fromEntries(Object.entries(localStorage)));
    await page.locator('a[data-civil-share]').evaluateAll((anchors) => anchors.forEach((anchor) => anchor.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))));
    const destinations = await page.evaluate(() => window.__civilClicked);
    assert.equal(destinations.length, 66, 'Nem todos os destinos foram acionados no interceptador local.');
    for (const item of data.items) {
      const code = item.subdivisao || item.modulo;
      assert(destinations.some((x) => x.key === code && x.href === item.link), `${code}: destino não foi interceptado com a URL correta.`);
    }
    assert.deepEqual(await page.evaluate(() => Object.fromEntries(Object.entries(localStorage))), beforeLinks,
      'Abrir links alterou progresso, notas ou estado de estudo.');
    assert.deepEqual(pageErrors, []);
    console.log(JSON.stringify({ loadedThrough: 'CentralDisciplineLoader.load(civil)', rendered: actual.length, interceptedDestinations: destinations.length, modules: 15, general: 15, subdivisions: 51, studyStorage: 'unchanged' }, null, 2));
  } finally {
    await browser.close();
    await new Promise((resolve) => server.close(resolve));
  }
});

function codeOf(item) { return item.subdivisao || item.modulo; }
