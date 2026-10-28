import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';
import { protectedAsset } from '../lib/protected-content.js';

const root = new URL('../', import.meta.url);
const read = name => readFile(new URL(name, root), 'utf8');
const makeFilter = async () => {
  const source = await read('central-v119.html');
  const functionSource = source.match(/function isPremiumOnlyScript\(src\)\{[\s\S]*?\n \}/)?.[0];
  assert.ok(functionSource, 'Detector de scripts somente Premium deve existir na inicialização');
  const classify = vm.runInNewContext('(' + functionSource + ')');
  return { source, classify };
};
const safeProjections = new Set([
  '/content/tec-cadernos-data.js',
  '/content/qc-sharing-links.json',
  '/content/qc-sharing-links.js',
  '/content/qc-notebook-catalog.js',
  '/content/cpc/cpc-sharing-links.js',
  '/content/cpp/cpp-native-index.js',
]);
const pathOnly = src => '/' + String(src).replace(/^\/+/, '').split('?')[0];

test('free: nenhum script Premium sem versão segura é requisitado na inicialização', async () => {
  const { source, classify } = await makeFilter();
  const index = await read('index.html');
  const names = [
    ...[...index.matchAll(/<script\b[^>]*\bsrc=["']([^"']+)["']/gi)].map(x => x[1]),
    ...[...source.matchAll(/["']([^"'<>]+\.js(?:\?[^"']*)?)["']/gi)].map(x => x[1]),
  ];
  const checked = new Set();
  for (const name of names) {
    const pathname = pathOnly(name);
    const policy = protectedAsset(pathname);
    if (!policy || policy.kind !== 'file' || safeProjections.has(pathname)) continue;
    checked.add(pathname);
    assert.equal(classify(name), true, 'Plano gratuito deve omitir JS Premium: ' + pathname);
  }
  assert.ok(checked.size > 30, 'Esperada cobertura de vários scripts Premium');
  assert.equal(classify('content/cpc/m05-native-data.js?v=1'), false, 'CPC nativo deve permanecer para projeção segura do resumo');
  assert.equal(classify('content/cf/m01-native-data.js'), false, 'CF nativo deve permanecer para resumo');
  assert.equal(classify('content/qc-notebook-catalog.js'), false, 'Catálogo QC deve usar o marcador locked do servidor');
  assert.equal(classify('content/tec-cadernos-data.js'), false, 'TEC deve usar o catálogo locked do servidor');
});

test('free: bootstrap autentica plano no servidor antes de filtrar scripts e renderizar a Central', async () => {
  const { source } = await makeFilter();
  const fetchPlan = source.indexOf("fetch('/api/plans?action=me'");
  const freeFilter = source.indexOf("if(freeStudent)html=html.replace(");
  const documentWrite = source.indexOf('document.write(html)');
  assert.ok(fetchPlan >= 0 && freeFilter > fetchPlan && documentWrite > freeFilter);
  assert.match(source, /planState\.plan==='free'/);
  assert.match(source, /groups\[key\]=groups\[key\]\.filter/);
  assert.match(source, /freeStudent&&isPremiumOnlyScript\(src\)\?/);
  assert.doesNotMatch(source, /localStorage\.[\s\S]{0,50}plan\s*===/);
});

test('free: os bloqueios server-side de arquivos pagos não são relaxados', async () => {
  const [handler, middleware] = await Promise.all([read('lib/private-content-handler.js'), read('middleware.js')]);
  assert.match(handler, /return send\(res, 403, \{ error: 'Este material é exclusivo do Base Completa Premium' \}\)/);
  assert.match(middleware, /const privateAsset = protectedAsset\(path\)/);
  assert.match(middleware, /destination\.searchParams\.set\('asset', path\)/);
});


test('free: o painel legado usa somente CF_QUESTIONS vazio sem baixar questões pagas',async()=>{
 const {source}=await makeFilter();
 assert.match(source,/if\(freeStudent\)authBoot\+='<scr'\+'ipt>\["CF_QUESTIONS","PENAL_QUESTIONS","CPC_QUESTIONS"\]/);
 assert.match(source,/if\(!Array\.isArray\(window\[name\]\)\)window\[name\]=\[\]/);
 assert.match(source,/freeStudent&&isPremiumOnlyScript\(src\)/);
});
