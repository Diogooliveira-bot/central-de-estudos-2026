import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = relative => fs.readFileSync(path.join(ROOT, relative), 'utf8');

test('CF: teorias guiadas M02–M10 estão íntegras e didáticas', () => {
  const context = { window: {} };
  for (let n = 2; n <= 10; n++) {
    const nn = String(n).padStart(2, '0');
    const source = read('content/cf/m' + nn + '-teoria-guiada-data.js');
    vm.runInNewContext(source, context, { filename: nn + '-teoria-guiada-data.js' });
    const module = context.window.BC_CF_GUIDED_MODULES?.[n];
    assert.ok(module, 'módulo ausente: ' + nn);
    assert.equal(module.module, n);
    assert.ok(Array.isArray(module.topics) && module.topics.length >= 10, 'poucos assuntos em ' + nn);
    for (const topic of module.topics) {
      assert.equal(topic.length, 8, '8 campos pedagógicos esperados em ' + nn);
      assert.ok(topic.every(s => typeof s === 'string' && s.trim().length > 10), 'campo vazio em ' + nn);
    }
  }
});

test('CF: índices carregam apenas M01–M10 do piloto e preservam leitor original', () => {
  const html = read('index.html');
  assert.ok(html.includes('ui/cf-native-study-v2.js'));
  for (let n=1; n<=10; n++) {
    const nn=String(n).padStart(2,'0');
    assert.ok(html.includes('/content/cf/m'+nn+'-native-data.js'), 'arquivo original M'+nn+' deve permanecer');
    assert.ok(html.includes('/content/cf/m'+nn+'-teoria-guiada-'), 'piloto M'+nn+' deve estar vinculado');
  }
  assert.ok(html.includes('/content/cf/m02-m10-teoria-guiada-runtime.js'));
  assert.equal(html.includes('m02-m05-teoria-guiada-runtime.js'), false);
});

test('CF: leitores experimentais sem cabeçalho e sem alterar o progresso oficial', () => {
  const m01 = read('content/cf/m01-teoria-guiada-preview.js');
  const runtime = read('content/cf/m02-m10-teoria-guiada-runtime.js');
  new vm.Script(m01);
  new vm.Script(runtime);
  assert.ok(runtime.includes('const MIN=2,MAX=10'));
  assert.ok(runtime.includes('data-view="study"'));
  assert.ok(runtime.includes('data-bc-guided-mode="review"'));
  assert.ok(runtime.includes('bc-m01-checklist'));
  assert.equal(runtime.includes('<header'), false);
  assert.equal(runtime.includes('<h1'), false);
  assert.equal(runtime.includes('central-v6:cf-native-v2'), false);
  assert.equal(m01.includes('central-v6:cf-native-v2'), false);
  assert.ok(runtime.includes('Nova teoria guiada · testar'));
  assert.ok(m01.includes('Nova teoria guiada · testar'));
});
