import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = (name) => fs.readFileSync(path.join(root, name), 'utf8');
const table = JSON.parse(read('content/qc-sharing-links.json'));
const context = { window: {} };
vm.runInNewContext(read('content/qc-sharing-links.js'), context);

test('tabela preserva os totais e os registros QC catalogados', () => {
  assert.equal(table.platform, 'QConcursos');
  assert.equal(table.counts.penal.linked, 53);
  assert.equal(table.counts.processualPenal.linked, 65);
  assert.equal(table.counts.administrativo.linked, 54);
  assert.equal(table.counts.totalValidatedPublicLinks, 172);
  assert.equal(table.counts.totalPending, 64);
  assert.deepEqual(JSON.parse(JSON.stringify(context.window.QC_CENTRAL_SHARING_LINKS)), table);
});

test('cada link catalogado tem ID, quantidade e formato de URL QC; pendências não inventam URL', () => {
  const keys = new Set();
  for (const item of table.items) {
    const key = `${item.disciplineKey}|${item.code}`;
    assert.ok(!keys.has(key), `registro duplicado ${key}`);
    keys.add(key);
    if (item.status === 'VALIDADO') {
      assert.ok(item.id && Number(item.quantity) > 0 && item.public);
      const url = new URL(item.link);
      assert.equal(url.hostname, 'www.qconcursos.com');
      assert.ok(url.searchParams.has('notebook_ids[]'));
      assert.match(item.link, /notebook_ids/);
      assert.ok(!item.link.includes('tecconcursos.com.br'));
    } else {
      assert.equal(item.status, 'Pendente');
      assert.equal(item.id, null);
      assert.equal(item.quantity, null);
      assert.equal(item.link, null);
      assert.equal(item.public, false);
    }
  }
  assert.equal(keys.size, 236);
});

test('títulos dos módulos usam texto íntegro do registro geral correspondente', () => {
  const moduleTitles = new Map(table.items
    .filter((item) => ['general', 'geral'].includes(item.kind))
    .map((item) => [`${item.disciplineKey}|${item.code}`, item.title]));
  for (const item of table.items) {
    const moduleCode = item.code.match(/^M\d+/)?.[0];
    if (!moduleCode) continue;
    const expected = moduleTitles.get(`${item.disciplineKey}|${moduleCode}`);
    assert.ok(expected, `módulo sem título geral: ${item.disciplineKey} ${item.code}`);
    assert.equal(item.moduleTitle, expected, `${item.disciplineKey} ${item.code}`);
    assert.doesNotMatch(item.moduleTitle, /Ã|â€|\u00ad|\u008d/);
  }
});

test('integração mantém os painéis TEC e QConcursos separados e responsivos', () => {
  const ui = read('ui/qc-sharing-links.js');
  const central = read('central-v119.html');
  const admUi = read('ui/adm-native-layer.js');
  assert.match(ui, /QConcursos/);
  assert.match(ui, /@media\(max-width:600px\)/);
  assert.match(ui, /processual-penal/);
  assert.match(ui, /data-adm-native/);
  assert.match(ui, /data-cpp-native-module/);
  assert.match(admUi, /ADM_SHARING_LINKS/);
  assert.match(admUi, /sharingPanel\(uid\)/);
  assert.match(central, /content\/qc-sharing-links\.js\?v=20261013qclinks1/);
  assert.match(central, /ui\/qc-sharing-links\.js\?v=20261013qclinks1/);
});

test('pendências de Administrativo sem filtro exclusivo não expõem o caderno amplo', () => {
  const pending = new Set(table.items.filter(x => x.disciplineKey === 'administrativo' && x.status === 'Pendente').map(x => x.code));
  for (const code of ['M04.1','M04.3','M05.5','M06.3','M08.1','M08.3','M14.3','M15.1','M15.2','M16.5','M07','M11','M19','M20']) {
    assert.ok(pending.has(code), `${code} deve aparecer como Pendente`);
  }
});
