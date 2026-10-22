import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import vm from 'node:vm';
import { JSDOM } from 'jsdom';

const root = path.resolve(import.meta.dirname, '..');
const read = relative => fs.readFileSync(path.join(root, relative), 'utf8');
const version = '20261022cfm01m05apostila1';

function loadModules() {
  const window = {};
  for (let number = 1; number <= 5; number += 1) {
    vm.runInNewContext(read(`content/cf/m${String(number).padStart(2, '0')}-native-data.js`), { window });
  }
  return window.BASE_NATIVE_CONTENT.cf;
}

test('CF M01–M05 entregam apostilas completas, atualizadas e com checklist', () => {
  const modules = loadModules();
  const minimumLength = { 1:45_000, 2:70_000, 3:35_000, 4:29_000, 5:29_000 };
  const expectedTerms = {
    1: ['constitucionalismo', 'Mutação', 'CHECKLIST DE DOMÍNIO'],
    2: ['HABEAS CORPUS', 'Teste de compreensão', 'CHECKLIST DE DOMÍNIO'],
    3: ['EC 131/2023', 'Tema 935', 'CHECKLIST DE DOMÍNIO'],
    4: ['art. 22', 'art. 23', 'art. 24', 'CHECKLIST DE DOMÍNIO'],
    5: ['EC 138/2025', 'EC 140/2026', 'ADI 2.135', 'CHECKLIST DE DOMÍNIO'],
  };

  for (let number = 1; number <= 5; number += 1) {
    const data = modules[`m${String(number).padStart(2, '0')}`];
    assert.equal(data.number, number);
    assert.ok(data.complete.length > minimumLength[number], `M${number}: conteúdo curto`);
    for (const term of expectedTerms[number]) assert.ok(data.complete.includes(term), `M${number}: ${term}`);
    assert.ok((data.complete.match(/[•]\s*[☐□]/g) || []).length >= 10, `M${number}: checklist insuficiente`);
  }
});

test('CF M01–M05 mantêm 10 + 5 questões válidas e equilibradas', () => {
  const modules = loadModules();
  for (let number = 1; number <= 5; number += 1) {
    const questions = modules[`m${String(number).padStart(2, '0')}`].questions;
    assert.deepEqual(Array.from(questions.complete, q => q.difficulty), ['Fácil','Fácil','Fácil','Fácil','Média','Média','Média','Média','Difícil','Difícil']);
    assert.deepEqual(Array.from(questions.summary, q => q.difficulty), ['Fácil','Fácil','Média','Média','Difícil']);
    for (const list of Object.values(questions)) {
      for (const question of list) {
        assert.ok(question.q.trim().length > 20);
        assert.ok(question.explanation.trim().length > 30);
        assert.ok(question.options.length >= 2);
        assert.ok(Number.isInteger(question.answer));
        assert.ok(question.answer >= 0 && question.answer < question.options.length);
        for (const option of question.options) assert.ok(option.trim().length > 2);
      }
    }
  }
});

test('integração oferece tabelas responsivas, checklist persistente, guia e Lei em Dia', () => {
  assert.match(read('ui/cf-native-study-v2.js'), /\.cf-native-shell,.cf-native-reader article,.cf-native-quiz article\{color:var\(--text\)\}/);
  const dom = new JSDOM('<!doctype html><html><head></head><body></body></html>', { url:'https://preview.example/' });
  const w = dom.window;
  w.CF_WEEKS = Array.from({ length:5 }, (_, index) => ({
    id:`w${index + 1}`, num:index + 1, title:`M${index + 1}`, read:'Leitura', read_focus:[],
  }));
  w.renderSubjects = () => {};
  w.renderAll = () => {};
  const context = vm.createContext(w);
  for (let number = 1; number <= 5; number += 1) {
    const pad = String(number).padStart(2, '0');
    vm.runInContext(read(`content/cf/m${pad}-native-data.js`), context);
    vm.runInContext(read(`content/cf/m${pad}-teoria-guiada-data.js`), context);
  }
  vm.runInContext(read('content/cf/cf-teoria-guiada-reader-v1.js'), context);
  vm.runInContext(read('ui/cf-native-study-v2.js'), context);

  const markup = w.renderConstitutionalMaster();
  assert.match(markup, /Teoria guiada/);
  assert.match(markup, /Lei em Dia/);

  w.CfNativeStudy.openReader(3, 'complete');
  assert.ok(w.document.querySelectorAll('.cf-native-table').length >= 8);
  const checks = w.document.querySelectorAll('[data-cf-check]');
  assert.ok(checks.length >= 10);
  checks[0].click();
  const key = 'central-v6:cf-reader-checks:3:complete';
  assert.ok(w.localStorage.getItem(key));
  w.CfNativeStudy.close();
  w.CfNativeStudy.openReader(3, 'complete');
  assert.equal(w.document.querySelector('[data-cf-check]').checked, true);

  w.CfNativeStudy.openReader(3, 'summary');
  assert.ok(w.document.querySelector('.bc-guided-overlay'));
  const guidedCheck = w.document.querySelector('[data-bc-guided-check]');
  guidedCheck.click();
  assert.ok(w.localStorage.getItem('bc:cf:m03:teoria-guiada:checklist:v1'));
  w.BcCfGuidedReader.close();
  w.close();
});

test('index e pacote offline usam os mesmos recursos versionados', () => {
  const html = read('index.html');
  const offline = JSON.parse(read('central-offline-files-v66172.json')).files;
  const assets = [
    ...Array.from({ length:5 }, (_, index) => `/content/cf/m${String(index + 1).padStart(2, '0')}-native-data.js?v=${version}`),
    ...Array.from({ length:15 }, (_, index) => `/content/cf/m${String(index + 1).padStart(2, '0')}-teoria-guiada-data.js?v=20261022cf-guided-release1`),
    '/content/cf/cf-teoria-guiada-reader-v1.js?v=20261022cf-guided-release1',
    '/ui/cf-native-study-v2.js?v=20261022cfm08m15apostila1',
  ];
  for (const asset of assets) {
    assert.ok(html.includes(`src="${asset}"`), `index: ${asset}`);
    assert.ok(offline.includes(asset), `offline: ${asset}`);
  }
});
