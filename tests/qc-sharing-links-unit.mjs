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
  assert.equal(table.counts.penal.linked, 61);
  assert.equal(table.counts.processualPenal.linked, 65);
  assert.equal(table.counts.administrativo.linked, 86);
  assert.equal(table.counts.totalValidatedPublicLinks, 369);
  assert.equal(table.counts.totalPending, 24);
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
  assert.equal(keys.size, 393);
});

test('títulos dos módulos usam texto íntegro do registro geral correspondente', () => {
  const moduleTitles = new Map(table.items
    .filter((item) => ['general', 'geral'].includes(item.kind))
    .map((item) => [`${item.disciplineKey}|${item.code}`, item.title]));
  for (const item of table.items) {
    const moduleCode = item.code.match(/^M\d+/)?.[0];
    if (!moduleCode) continue;
    const expected = moduleTitles.get(`${item.disciplineKey}|${moduleCode}`);
    if (expected) assert.equal(item.moduleTitle, expected, `${item.disciplineKey} ${item.code}`);
    assert.ok(item.moduleTitle, `módulo sem título: ${item.disciplineKey} ${item.code}`);
    assert.doesNotMatch(item.moduleTitle, /Ã[§£¬]|â€|\u00ad|\u008d/);
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
  assert.match(central, /content\/qc-sharing-links\.js\?v=20261020qcpend24p1/);
  assert.match(central, /content\/qc-notebook-catalog\.js\?v=20261020qcpend24p1/);
  assert.match(central, /ui\/qc-sharing-links\.js\?v=20261020qcpend24p1/);
});

test('pendências de Administrativo sem filtro exclusivo não expõem o caderno amplo', () => {
  const pending = new Set(table.items.filter(x => x.disciplineKey === 'administrativo' && x.status === 'Pendente').map(x => x.code));
  for (const code of ["M19", "M20"]) {
    assert.ok(pending.has(code), `${code} deve aparecer como Pendente`);
  }
  const planning = table.items.find(x => x.disciplineKey === 'administrativo' && x.code === 'M15.2');
  assert.equal(planning.id, '15352286');
  assert.equal(planning.quantity, 2);
  assert.equal(planning.status, 'VALIDADO');
  assert.notEqual(planning.id, '15285176');
  const appeals = table.items.find(x => x.disciplineKey === 'administrativo' && x.code === 'M16.5');
  assert.equal(appeals.id, '15352419');
  assert.equal(appeals.quantity, 2);
  assert.equal(appeals.status, 'VALIDADO');
  const lindb = table.items.find(x => x.disciplineKey === 'administrativo' && x.code === 'M07.1');
  assert.equal(lindb.id, '15352451');
  assert.equal(lindb.quantity, 2);
  assert.equal(lindb.status, 'VALIDADO');
  const m055 = table.items.find(x => x.disciplineKey === 'administrativo' && x.code === 'M05.5');
  assert.equal(m055.status, 'VALIDADO');
  assert.equal(m055.id, '15285069');
  assert.equal(m055.quantity, 30);
  for (const code of ['M04.1','M04.3','M08.1','M08.3','M14.3','M15.1']) {
    assert.ok(table.items.some(x => x.disciplineKey === 'administrativo' && x.code === code && x.status === 'VALIDADO'), `${code} deve substituir a pendência por filtro conferido`);
  }
});

test('cadernos validados dos módulos auditados ficam visíveis na Central de Questões', () => {
  assert.ok(table.items.some((x) => x.disciplineKey === 'penal' && x.code === 'M01.3' && x.id === '15349881' && x.quantity === 19 && x.status === 'VALIDADO'));
  assert.ok(table.items.some((x) => x.disciplineKey === 'administrativo' && x.code === 'M19.3' && x.id === '15350419' && x.quantity === 1 && x.status === 'VALIDADO'));
  assert.ok(table.items.some((x) => x.disciplineKey === 'administrativo' && x.code === 'M06.3' && x.id === '15350502' && x.quantity === 1 && x.status === 'VALIDADO'));
  assert.ok(table.items.some((x) => x.disciplineKey === 'penal' && x.code === 'M17.1' && x.id === '15351251' && x.quantity === 1 && x.status === 'VALIDADO'));
  assert.ok(table.items.some((x) => x.disciplineKey === 'penal' && x.code === 'M17.2' && x.id === '15351442' && x.quantity === 4 && x.status === 'VALIDADO'));
  assert.ok(table.items.some((x) => x.disciplineKey === 'penal' && x.code === 'M01.2' && x.id === '15350527' && x.quantity === 1 && x.status === 'VALIDADO'));
  assert.ok(table.items.some((x) => x.disciplineKey === 'penal' && x.code === 'M14' && x.id === '15350670' && x.quantity === 1 && x.status === 'VALIDADO'));
  assert.ok(table.items.some((x) => x.disciplineKey === 'penal' && x.code === 'M17.3' && x.id === '15351070' && x.quantity === 3 && x.status === 'VALIDADO'));
  for (const [disciplineKey, expected] of Object.entries({
    civil: 61, portugues: 27, constitucional: 19, trabalho: 18,
    'processual-trabalho': 18, rlm: 14
  })) {
    assert.equal(table.items.filter(x => x.disciplineKey === disciplineKey && x.status === 'VALIDADO').length, expected);
  }
});


test('Penal M13.4 finanças públicas is validated and public', () => {
  const item = table.items.find((x) => x.disciplineKey === 'penal' && x.code === 'M13.4');
  assert.equal(item.id, '15351620');
  assert.equal(item.status, 'VALIDADO');
  assert.equal(item.public, true);
});
