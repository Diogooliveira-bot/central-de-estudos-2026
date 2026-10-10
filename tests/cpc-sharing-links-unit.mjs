import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const mapSource = fs.readFileSync(path.join(root, 'content/cpc/cpc-sharing-links.js'), 'utf8');
const context = { window: {}, URL, setTimeout() {} };
vm.runInNewContext(mapSource, context, { filename: 'cpc-sharing-links.js' });
const map = context.window.CPC_SHARING_LINKS;

function allItems() {
  return Object.values(map.modules).flatMap(module => [module.general, ...module.subdivisions]);
}

test('mapa tem exatamente 20 gerais, 54 subdivisões e cobre M01–M20', () => {
  const modules = Object.values(map.modules);
  assert.equal(modules.length, 20);
  assert.equal(modules.filter(module => module.general).length, 20);
  assert.equal(modules.reduce((total, module) => total + module.subdivisions.length, 0), 54);
  assert.deepEqual(modules.map(module => module.code), Array.from({ length: 20 }, (_, index) => `M${String(index + 1).padStart(2, '0')}`));
  assert.equal(allItems().length, 74);
});

test('os 74 destinos são públicos, únicos e apontam para o ID real do caderno', () => {
  const items = allItems();
  const ids = new Set();
  const links = new Set();
  for (const item of items) {
    const url = new URL(item.link);
    assert.equal(item.public, true, item.code);
    assert.equal(url.origin, 'https://www.qconcursos.com', item.code);
    assert.equal(url.pathname, '/questoes-de-concursos/questoes', item.code);
    assert.equal(url.searchParams.get('notebook_ids[]'), item.id, item.code);
    assert.ok(Number.isInteger(item.count) && item.count > 0, item.code);
    assert.ok(item.validation, item.code);
    assert.ok(!ids.has(item.id), `ID duplicado: ${item.id}`);
    assert.ok(!links.has(item.link), `link duplicado: ${item.code}`);
    ids.add(item.id);
    links.add(item.link);
  }
});

test('M08 mantém associação e contagens verificadas da teoria corrigida', () => {
  assert.equal(map.modules.M08.general.title, 'PC M08 Geral');
  assert.equal(map.modules.M08.general.count, 138);
  assert.deepEqual(JSON.parse(JSON.stringify(map.modules.M08.subdivisions.map(item => [item.code, item.title, item.count]))), [
    ['M08.1', 'PC M08.1 Citação e cartas', 80],
    ['M08.2', 'PC M08.2 Intimação/nulidades', 52]
  ]);
});

test('o render associa cada link ao código do módulo e imprime título e quantidade', () => {
  const uiContext = { window: { CPC_SHARING_LINKS: map, setTimeout() {} }, URL, setTimeout() {} };
  vm.runInNewContext(fs.readFileSync(path.join(root, 'ui/cpc-sharing-links.js'), 'utf8'), uiContext, { filename: 'cpc-sharing-links.js' });
  for (const module of Object.values(map.modules)) {
    const html = uiContext.window.CpcSharingLinks.renderModule(module.code);
    assert.ok(html.includes(`data-cpc-sharing-code="${module.code}"`), module.code);
    for (const item of [module.general, ...module.subdivisions]) {
      assert.ok(html.includes(`data-cpc-qc-link="${item.code}"`), item.code);
      assert.ok(html.includes(`data-cpc-qc-count="${item.count}"`), item.code);
      assert.ok(html.includes(item.link), item.code);
      assert.ok(html.includes(`${item.count} questões`), item.code);
    }
  }
});
