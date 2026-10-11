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
  assert.match(reader, /if\(n===3\)/);
  assert.match(reader, /CivilBensApostila\.enhance\(body,kind\)/);
  assert.match(reader, /await import\('\/ui\/civil-bens-apostila-v1\.js/);
  assert.match(bootstrap, /ui\/civil-bens-apostila-v1\.js/);
  assert.match(visual, /output\.textContent !== original/);
  assert.match(visual, /pre\.replaceWith\(output\)/);
  assert.doesNotMatch(visual, /localStorage|indexedDB|summaryQuestions|completeQuestions/);
});


test('M03 Bens: tabela termina antes de novo tópico e antes de EXEMPLO', async () => {
  const scope={window:{}};
  runInNewContext(await read('ui/civil-bens-apostila-v1.js'),scope);
  const {toGroups}=scope.window.CivilBensApostila;
  const lines=[
    '  Elemento                               Características                    Exemplo',
    '  Fruto natural                          Renovável.                        Cria de animal, frutos de',
    '                                                                           árvore.',
    '  Produto                                Extração reduz substância.        Minério.',
    ' 2.10 Pertenças e partes integrantes — arts. 93 e 94',
    ' Pertença é bem que não compõe a estrutura.',
    '  Pertença                               Parte integrante',
    '  Mantém individualidade                 Integra a estrutura.',
    '  principal.',
    ' EXEMPLO                 Máquina autônoma destinada ao serviço.',
    '                         Não é parte integrante.',
    ' 2.11 Benfeitorias — arts. 96 e 97'
  ];
  const groups=toGroups(lines,'complete');
  const tableGroups=groups.filter(g=>g.type==='table');
  assert.equal(tableGroups.length,2);
  assert.deepEqual([tableGroups[0].start,tableGroups[0].end],[0,3]);
  assert.deepEqual([tableGroups[1].start,tableGroups[1].end],[6,8]);
  assert.ok(!tableGroups.some(g=>g.start<=9&&g.end>=9),'EXEMPLO não pode ficar dentro da tabela');
  assert.ok(!tableGroups.some(g=>g.start<=4&&g.end>=4),'título não pode ficar dentro da tabela');
});
