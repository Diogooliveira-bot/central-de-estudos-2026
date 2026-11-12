import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, statSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
import { protectedAsset } from '../lib/protected-content.js';

const read = filename => readFileSync(filename, 'utf8');
const pdfPath = (subject, number) =>
  '/apostilas/' + (subject === 'pt' ? 'portugues/pt' : 'rlm/rlm')
  + '-m' + String(number).padStart(2, '0') + '.pdf';

test('Português M01–M24 e RLM M01–M15: todos os 39 arquivos são PDFs válidos', () => {
  let total = 0;
  for (const [subject, max] of [['pt', 24], ['rlm', 15]]) {
    for (let number = 1; number <= max; number++) {
      const file = pdfPath(subject, number);
      const disk = '.' + file;
      const bytes = readFileSync(disk);
      assert.equal(bytes.subarray(0, 5).toString(), '%PDF-', file);
      assert.ok(statSync(disk).size > 5000, 'arquivo incompleto ' + file);
      assert.equal(protectedAsset(file)?.feature, 'theory.summary', 'resumo acessível a aluno gratuito: ' + file);
      total++;
    }
  }
  assert.equal(total, 39);
});

test('Não amplia acesso a outras apostilas ou materiais Premium', () => {
  assert.equal(protectedAsset('/outros/conteudo-completo.pdf')?.feature, 'premium.reviews');
  assert.equal(protectedAsset('/content/rlm-tjce-2026/aulas-logica.js')?.feature, 'theory.complete');
  assert.equal(protectedAsset('/portugues-autodidata-data.txt')?.feature, 'theory.complete');
});

test('Leitor de PDF abre apenas módulos válidos, sem alterar estado do curso', () => {
  const window = {};
  runInNewContext(read('ui/apostilas-pdf-v1.js'), { window });
  const reader = window.BaseApostilasPdf;
  assert.ok(reader);
  for (let n = 1; n <= 24; n++) assert.equal(reader.path('pt', n), pdfPath('pt', n));
  for (let n = 1; n <= 15; n++) assert.equal(reader.path('rlm', n), pdfPath('rlm', n));
  for (const [sub,n] of [['pt',0],['pt',25],['rlm',0],['rlm',16],['other',1]]) {
    assert.equal(reader.path(sub,n),null);
  }
});

test('Cards de Português e RLM oferecem PDF sem substituir aulas, questões e progresso', () => {
  const pt = read('ui/current-courses.js');
  const rlm = read('ui/rlm-native-v1.js');
  const index = read('index.html');
  assert.match(pt, /type==='pdf'/);
  assert.match(pt, /BaseApostilasPdf\.open/);
  assert.match(pt, /CentralPortugueseReader\.open/);
  assert.match(pt, /review\?'':card\(m\.id,'pdf'/);
  assert.match(rlm, /stage==='pdf'/);
  assert.match(rlm, /BaseApostilasPdf\.open/);
  assert.match(rlm, /RlmNative\.open/);
  assert.match(rlm, /<strong>15<\/strong> apostilas/);
  assert.match(index, /\/ui\/apostilas-pdf-v1\.js/);
  assert.match(index, /\/ui\/current-courses\.js\?v=20261111-apostilas-pt-rlm-v1/);
  assert.match(index, /\/ui\/rlm-native-v1\.js\?v=20261112nomaps1/);
});
