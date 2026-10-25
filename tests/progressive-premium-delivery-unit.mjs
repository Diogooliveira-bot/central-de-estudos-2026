import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';
import middleware from '../middleware.js';
import authApi from '../api/auth.js';
import leiApi from '../lib/lei-em-dia-questions-handler.js';
import privateApi from '../lib/private-content-handler.js';
import { portugueseSummaryScript, projectPortugueseAutodidataSummary, projectPortugueseSummary, protectedAsset } from '../lib/protected-content.js';
import zlib from 'node:zlib';

const root = new URL('../', import.meta.url);
const read = file => readFile(new URL(file, root), 'utf8');

test('premium files, question source files, TEC and QC catalogues are routed through private delivery', async () => {
  for (const path of [
    '/lei-em-dia-aprovadas-20261012.js',
    '/tools/decorando-data-led-aprovadas.js',
    '/content/qc-sharing-links.json',
    '/content/qc-sharing-links.js',
    '/content/qc-notebook-catalog.js',
    '/content/cpc/cpc-sharing-links.js',
    '/content/tec-cadernos-data.js',
    '/portugues-native-data/m1.js',
    '/content/civil/m01-native-data.js',
    '/assets/revisao-premium.pdf',
  ]) assert.ok(protectedAsset(path), `${path} must be intercepted`);
  assert.equal(protectedAsset('/ui/qc-sharing-links.js'), null, 'renderer contains no secret URLs and must render the lock state');
  const middleware = await read('middleware.js');
  const vercel = JSON.parse(await read('vercel.json'));
  assert.match(middleware, /matcher:\s*'\/:path\*'/);
  assert.match(middleware, /privateAsset\.kind === 'lei-em-dia' \? '\/api\/lei-em-dia-questions\?mode=catalog'/);
  assert.match(middleware, /\/api\/private-content/);
  assert.match(vercel.functions['api/auth.js'].includeFiles, /\*\*\/\*\.pdf/);
  assert.match(vercel.functions['api/auth.js'].includeFiles, /portugues-\*/);
  assert.deepEqual(
    vercel.rewrites.slice(0, 3).map(rule => rule.source),
    ['/api/plans', '/api/private-content', '/api/lei-em-dia-questions'],
  );
});

test('free Portuguese projection is authored review-only and excludes full lesson HTML and quizzes', async () => {
  const source = await read('portugues-native-data/m1.js');
  const sandbox = { window: {} };
  vm.runInNewContext(source, sandbox, { timeout: 500 });
  const original = sandbox.window.PT_NATIVE_DATA.m1;
  const free = projectPortugueseSummary(original);
  assert.ok(free && free.sections.length > 0);
  assert.equal(free.summaryOnly, true);
  assert.ok(free.sections.some(section => section.remember.length > 0), 'summary should reuse existing authored review bullets');
  assert.equal(free.sections.some(section => section.html), false);
  assert.equal('questions' in free, false);
  assert.equal('review' in free, false);
  const serialized = JSON.stringify(free);
  assert.equal(serialized.includes(original.sections.find(section => section.html)?.html || 'FULL_CONTENT_SENTINEL'), false);
  const script = portugueseSummaryScript('m1', original);
  assert.match(script, /summaryOnly/);
  const reader = await read('portugues-native-v1.js');
  assert.match(reader, /data\.summaryOnly&&tab!=='teoria'/);
  assert.match(reader, /Conhecer o Premium/);
});

test('Português Autodidata free view is a compact projection of existing authored summaries', async () => {
  const encoded = (await read('portugues-autodidata-data.txt')).trim();
  const records = JSON.parse(zlib.gunzipSync(Buffer.from(encoded, 'base64')).toString('utf8'));
  const sourceSize = Buffer.byteLength(JSON.stringify(records));
  const summary = projectPortugueseAutodidataSummary(records);
  const output = JSON.stringify(summary);
  assert.equal(Object.keys(summary).filter(key => /^m\d{2}$/.test(key)).length, 24);
  assert.ok(summary.review, 'the standalone cumulative review should render a Premium lock instead of failing');
  assert.ok(Buffer.byteLength(output) < sourceSize * 0.05, 'free projection must remain a small summary, not a repackaged course');
  assert.doesNotMatch(output, /data-answer|quiz-opt|https?:\/\//i);
  assert.match(output, /Resumo gratuito/);
});

test('public offline manifest excludes premium assets and PWA bypasses cache for them', async () => {
  const manifest = JSON.parse(await read('central-offline-files-v66172.json'));
  const sw = await read('sw.js');
  const boot = await read('central-v119.html');
  assert.equal(manifest.build, '20261024-premium-progressive-v2');
  assert.match(sw, new RegExp(`var CACHE='central-${manifest.build}'`));
  assert.match(boot, new RegExp(`var BUILD='${manifest.build}'`));
  assert.ok(!manifest.files.some(file => protectedAsset(String(file).split(/[?#]/)[0])));
  assert.match(sw, /if\(protectedContentPath\(url\.pathname\)\)\{\s*event\.respondWith\(fetch\(request,\{cache:'no-store'\}\)/);
  assert.match(sw, /await purgeProtectedOfflineContent\(\)/);
  assert.match(sw, /if\(response&&response\.ok\)await clearOfflineAuth\(\)/);
  assert.doesNotMatch(sw, /localStorage\.clear\(\)|indexedDB\.deleteDatabase/);
});

test('free TEC/QC responses are lock-only projections, never real link catalogs', async () => {
  const api = await read('lib/private-content-handler.js');
  const qcUi = await read('ui/qc-sharing-links.js');
  const cpcUi = await read('ui/cpc-sharing-links.js');
  assert.match(api, /QC_CENTRAL_SHARING_LINKS=\{schemaVersion:1,locked:true,items:\[\]\}/);
  assert.match(api, /CPC_SHARING_LINKS=\{schemaVersion:1,locked:true,modules:\{\}\}/);
  assert.match(qcUi, /if \(locked\)/);
  assert.match(qcUi, /Conhecer o Premium/);
  assert.match(cpcUi, /map\?\.locked === true/);
  assert.match(cpcUi, /Conhecer o Premium/);
  assert.doesNotMatch(api.match(/asset === '\/content\/qc-sharing-links\.js'[\s\S]*?return send\(res, 200, ([^;]+);/)?.[1] || '', /https?:/i);
});

test('HTTP handlers deny unauthenticated direct asset and question requests without returning private payloads', async () => {
  async function call(handler, req) {
    const response = { statusCode: 200, headers: {}, body: '', setHeader(k, v) { this.headers[k] = v; }, end(body = '') { this.body = String(body); } };
    await handler(req, response);
    return response;
  }
  const direct = await middleware(new Request('https://unit.test/lei-em-dia-aprovadas-20261012.js'));
  assert.equal(direct.status, 307);
  assert.match(direct.headers.get('location'), /\/api\/lei-em-dia-questions\?mode=catalog/);

  const asset = await call(privateApi, { method: 'GET', query: { asset: '/assets/revisao-premium.pdf' }, headers: {} });
  assert.equal(asset.statusCode, 401);
  assert.doesNotMatch(asset.body, /PDF|base64|gabarito/i);

  const question = await call(leiApi, {
    method: 'GET', query: { mode: 'catalog' },
    headers: { 'sec-fetch-site': 'same-origin' },
  });
  assert.equal(question.statusCode, 401);
  assert.doesNotMatch(question.body, /statement|answer|explanation/i);

  const routedAsset = await call(authApi, {
    method: 'GET', query: { bc_api: 'private-content', asset: '/assets/revisao-premium.pdf' }, headers: {},
  });
  assert.equal(routedAsset.statusCode, 401);
  assert.doesNotMatch(routedAsset.body, /PDF|base64|gabarito/i);

  const routedQuestion = await call(authApi, {
    method: 'GET', query: { bc_api: 'lei-em-dia-questions', mode: 'catalog' },
    headers: { 'sec-fetch-site': 'same-origin' },
  });
  assert.equal(routedQuestion.statusCode, 401);
  assert.doesNotMatch(routedQuestion.body, /statement|answer|explanation/i);
});
