import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import test from 'node:test';
import { protectedAsset } from '../lib/protected-content.js';
import { JSDOM } from 'jsdom';

const read = path => fs.readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');
const modules = Array.from({length:8}, (_, index) => index + 8);
const expectedChecks = new Map([[8,10],[9,10],[10,10],[11,10],[12,10],[13,8],[14,8],[15,10]]);
const expectedTables = new Map([[8,22],[9,23],[10,16],[11,20],[12,28],[13,16],[14,15],[15,12]]);
const version = '20261022cfm08m15apostila1';

function fixture() {
  const dom = new JSDOM('<!doctype html><html><head></head><body></body></html>', {url:'https://cf-m08-m15.example/'});
  const w = dom.window;
  w.CF_WEEKS = modules.map(n => ({id:`w${n}`,num:n,title:`M${n}`,read:'Leitura',read_focus:[]}));
  w.renderSubjects = () => {};
  w.renderAll = () => {};
  const ctx = vm.createContext(w);
  for (const n of modules) vm.runInContext(read(`content/cf/m${String(n).padStart(2,'0')}-native-data.js`), ctx);
  vm.runInContext(read('ui/cf-native-study-v2.js'), ctx);
  return dom;
}

test('M08 a M15 usam as fontes editoriais completas com tabelas responsivas e checklists', () => {
  const dom = fixture(), w = dom.window;
  for (const n of modules) {
    const key = `m${String(n).padStart(2,'0')}`;
    const data = w.BASE_NATIVE_CONTENT.cf[key];
    const editorial = read(`content/cf/editorial/${key}-apostila.txt`).trim();
    assert.equal(data.number, n);
    assert.equal(data.moduleId, `w${n}`);
    assert.equal(data.lawTopicId, `cf-${key}`);
    assert.equal(data.editorialVersion, version);
    assert.equal(data.complete, editorial);
    assert.ok(data.complete.length > 15000);
    assert.doesNotMatch(data.complete, /Warning: truncated output|BASE COMPLETA\s*[•|]\s*Direito Constitucional/);

    w.CfNativeStudy.openReader(n, 'complete');
    assert.equal(w.document.querySelectorAll('.cf-native-table').length, expectedTables.get(n));
    assert.equal(w.document.querySelectorAll('[data-cf-check]').length, expectedChecks.get(n));
    assert.ok(w.document.querySelectorAll('.cf-native-callout').length >= 12);
    for (const table of w.document.querySelectorAll('.cf-native-table')) {
      const columns = table.querySelectorAll('th').length;
      assert.ok(columns >= 2);
      for (const row of table.querySelectorAll('tbody tr')) {
        assert.equal(row.children.length, columns);
        for (const cell of row.children) assert.notEqual(cell.textContent.trim(), '—');
      }
    }
  }
  dom.window.close();
});

test('checklists M08 a M15 funcionam, persistem e permanecem isolados por módulo', () => {
  const dom = fixture(), w = dom.window;
  for (const n of modules) {
    w.CfNativeStudy.openReader(n, 'complete');
    let inputs = [...w.document.querySelectorAll('[data-cf-check]')];
    inputs[0].click();
    inputs.at(-1).click();
    assert.equal(w.document.querySelector('[data-check-progress]').textContent, `2/${inputs.length} concluídos`);
    w.CfNativeStudy.close();
    w.CfNativeStudy.openReader(n, 'complete');
    inputs = [...w.document.querySelectorAll('[data-cf-check]')];
    assert.equal(inputs[0].checked, true);
    assert.equal(inputs.at(-1).checked, true);
    assert.equal(inputs[1].checked, false);
  }
  const stored = modules.map(n => w.localStorage.getItem(`central-v6:cf-reader-checks:${n}:complete`));
  assert.ok(stored.every(Boolean));
  assert.equal(new Set(stored).size, modules.length);
  dom.window.close();
});

test('questões M08 a M15 preservam distribuição, alternativas limpas e funcionamento', () => {
  const dom = fixture(), w = dom.window;
  const completeDifficulty = ['Fácil','Fácil','Fácil','Fácil','Média','Média','Média','Média','Difícil','Difícil'];
  const summaryDifficulty = ['Fácil','Fácil','Média','Média','Difícil'];
  for (const n of modules) {
    const key = `m${String(n).padStart(2,'0')}`;
    const questions = w.BASE_NATIVE_CONTENT.cf[key].questions;
    assert.deepEqual(Array.from(questions.complete, item => item.difficulty), completeDifficulty);
    assert.deepEqual(Array.from(questions.summary, item => item.difficulty), summaryDifficulty);
    for (const mode of ['complete','summary']) {
      for (const item of questions[mode]) {
        assert.equal(item.options.length, 5);
        assert.equal(new Set(item.options).size, 5);
        assert.ok(item.options.every(option => option === option.trim() && option.length > 1));
        assert.doesNotMatch(item.options.join(' '), /BASE COMPLETA|Teoria Resumida/);
        assert.ok(Number.isInteger(item.answer) && item.answer >= 0 && item.answer < item.options.length);
        assert.ok(item.explanation.length >= 20);
      }
      w.CfNativeStudy.openQuiz(n, mode);
      const first = questions[mode][0];
      const answer = w.document.querySelector(`[data-opt="${first.answer}"]`);
      assert.ok(answer.textContent.includes(first.options[first.answer]));
      answer.click();
      assert.match(w.document.querySelector('[data-feed]').textContent, /Correto/);
    }
  }
  dom.window.close();
});

test('Lei em Dia e cache offline apontam para a mesma versão em M08 a M15', () => {
  const dom = fixture(), w = dom.window;
  const offline = JSON.parse(read('central-offline-files-v66172.json'));
  const manifest = offline.files;
  const index = read('index.html');
  const lawCtx = {};
  vm.runInNewContext(read('tools/decorando-data-modulos.js') + ';globalThis.modules=CENTRAL_LAW_MODULES.modules;', lawCtx);
  for (const n of modules) {
    const key = `m${String(n).padStart(2,'0')}`;
    const asset = `/content/cf/${key}-native-data.js?v=${version}`;
    assert.ok(index.includes(`src="${asset}"`));
    assert.equal(manifest.includes(asset), !protectedAsset(new URL(asset, 'https://unit.test').pathname));
    assert.ok(lawCtx.modules.some(module => module.id === `cf-${key}`));
    let law;
    w.openLeiSecaEnxuta = (...args) => law = args;
    w.CfNativeStudy.openDecorando(n);
    assert.deepEqual(law, [null,'cf',`cf-${key}`]);
  }
  const uiAsset = `/ui/cf-native-study-v2.js?v=20261031readerstd1`;
  assert.ok(index.includes(`src="${uiAsset}"`));
  assert.ok(manifest.includes(uiAsset));
  assert.ok(read('sw.js').includes(`var CACHE='central-${offline.build}'`));
  dom.window.close();
});

