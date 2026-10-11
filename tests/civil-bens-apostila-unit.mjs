import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {gunzipSync} from 'node:zlib';
import {runInNewContext} from 'node:vm';

const read = async path => readFile(new URL('../' + path, import.meta.url), 'utf8');

test('M03 Bens: a apostila conserva cada caractere do conteúdo original', async () => {
  const packed = await read('content/civil/civil-native-content-packed.js');
  const match = packed.match(/CIVIL_NATIVE_PACKED_B64="([^"]+)"/);
  assert.ok(match, 'pacote original não encontrado');
  const data = JSON.parse(gunzipSync(Buffer.from(match[1], 'base64')).toString('utf8'));
  const bens = data['civil-m03'];
  assert.ok(bens, 'M03 ausente');

  const scope = {window: {}};
  runInNewContext(await read('ui/civil-bens-apostila-v1.js'), scope);
  const formatter = scope.window.CivilBensApostila;
  assert.equal(typeof formatter.enhance, 'function');

  for (const [field, mode] of [['summaryHtml', 'summary'], ['completeHtml', 'complete']]) {
    const originalHtml = bens[field];
    assert.ok(originalHtml.includes('civil-source-content'));
    const source = originalHtml.match(/<pre[^>]*>([\s\S]*?)<\/pre>/);
    assert.ok(source, field + ': texto original não encontrado');
    const lines = source[1].split('\n');
    const groups = formatter.toGroups(lines, mode);
    const rebuilt = groups.map(group => lines.slice(group.start, group.end + 1).join('\n')).join('\n');
    assert.equal(rebuilt, source[1], field + ': texto original foi modificado');
    assert.ok(groups.some(group => group.type === 'section'), field + ': sem seções');
    assert.ok(groups.some(group => group.type === 'subsection'), field + ': sem subtítulos');
    assert.ok(groups.some(group => group.type === 'paragraph'), field + ': sem parágrafos');
    assert.ok(groups.length > 10, field + ': não foi convertido em apostila');
  }

  assert.equal(bens.summaryQuestions.length, 5);
  assert.equal(bens.completeQuestions.length, 10);
  assert.ok(data['civil-m02'] && data['civil-m04'], 'módulos adjacentes ausentes');
});

test('M03 Bens: formatação é ativada somente neste módulo, sem migrar dados do aluno', async () => {
  const reader = await read('ui/civil-native-study-v1.js');
  const bootstrap = await read('central-v119.html');
  const visual = await read('ui/civil-bens-apostila-v1.js');
  assert.match(reader, /n===3 && g\.CivilBensApostila\?\.enhance\(body,kind\)/);
  assert.match(bootstrap, /ui\/civil-bens-apostila-v1\.js/);
  assert.match(visual, /output\.textContent !== original/);
  assert.match(visual, /pre\.replaceWith\(output\)/);
  assert.doesNotMatch(visual, /localStorage|indexedDB|summaryQuestions|completeQuestions/);
});
