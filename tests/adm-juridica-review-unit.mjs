import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

const root = process.cwd();
const contentDir = path.join(root, 'content', 'adm');
const moduleFiles = Array.from({ length: 20 }, (_, i) => `m${String(i + 1).padStart(2, '0')}-native-data-lite.js`);

function load(file) {
  const context = { window: { ADM_NATIVE_CONTENT: {} } };
  vm.runInNewContext(fs.readFileSync(path.join(contentDir, file), 'utf8'), context, { filename: file });
  const rows = Object.values(context.window.ADM_NATIVE_CONTENT);
  assert.equal(rows.length, 1, `${file} deve registrar exatamente um módulo`);
  return rows[0];
}

function answerCount(html) {
  return (String(html).match(/Gabarito/gi) || []).length;
}

test('ADM student-visible package loads all 20 modules with the advertised question contract', () => {
  for (const [index, file] of moduleFiles.entries()) {
    const data = load(file);
    assert.ok(answerCount(data.summaryHtml) >= 5, `${file}: resumo deve conter ao menos 5 gabaritos visíveis`);
    assert.ok(answerCount(data.completeAppendHtml) >= 10, `${file}: apêndice completo deve conter ao menos 10 gabaritos visíveis`);
    assert.equal(data.completeSource, 'legacy');
    assert.match(data.summaryHtml, /<h[1-4][^>]*>/, `${file}: resumo sem título visível`);
    assert.match(data.completeAppendHtml, /<h[1-4][^>]*>/, `${file}: apêndice sem título visível`);
    assert.equal(data.uid.startsWith(`adm-${String(index + 1).padStart(2, '0')}-`), true);
  }
});

test('M13 registra o status processual das ADIs 7156/7236 e evita tratar notícia como acórdão final', () => {
  const data = load('m13-native-data-lite.js');
  const visible = `${data.summaryHtml}\n${data.completeAppendHtml}`;
  assert.match(visible, /julgamento conjunto ainda não foi encerrado/);
  assert.match(visible, /maiorias divulgados oficialmente pelo STF/);
  assert.match(visible, /três níveis federativos/);
  assert.doesNotMatch(visible, /o STF retirou limitações/);
  assert.doesNotMatch(visible, /declarado inconstitucional;\\n/);
});

test('ADM cache keys point to the reviewed package', () => {
  const files = ['ui/adm-native-layer.js', 'central-lazy-theory-v66119.js', 'central-offline-files-v66172.json', 'content/adm/adm-native-index.js'];
  for (const file of files) {
    const text = fs.readFileSync(path.join(root, file), 'utf8');
    assert.match(text, /20261018admjur1|adm-native-prod-20261018jur1/, `${file}: cache/version marker desatualizado`);
  }
});
