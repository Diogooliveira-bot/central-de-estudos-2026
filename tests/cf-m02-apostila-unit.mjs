import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import vm from 'node:vm';
import { JSDOM } from 'jsdom';
import { protectedAsset } from '../lib/protected-content.js';

const root = path.resolve(import.meta.dirname, '..');
const read = relative => fs.readFileSync(path.join(root, relative), 'utf8');

function moduleData() {
  const window = {};
  vm.runInNewContext(read('content/cf/m02-native-data.js'), { window });
  return window.BASE_NATIVE_CONTENT.cf.m02;
}

test('CF M02 mantém identidade e oferece a nova apostila didática', () => {
  const module = moduleData();
  assert.equal(module.moduleId, 'w2');
  assert.equal(module.number, 2);
  assert.equal(module.lawTopicId, 'cf-m02');
  assert.equal(module.lawLabel, 'CF, art. 5º');
  assert.ok(module.complete.length > 70_000);
  assert.ok(module.summary.length > 7_000);
  assert.match(module.complete, /Teste de compreensão/i);
  assert.match(module.complete, /Exemplo explicado/i);
  assert.match(module.complete, /Aprofundamento/i);
  assert.match(module.complete, /HABEAS CORPUS/);
  assert.match(module.summary, /REVISÃO EM CINCO MINUTOS/);
});

test('CF M02 preserva 5 + 10 questões com alternativas limpas', () => {
  const module = moduleData();
  assert.equal(module.questions.summary.length, 5);
  assert.equal(module.questions.complete.length, 10);
  for (const [group, questions] of Object.entries(module.questions)) {
    for (const question of questions) {
      assert.ok(question.q.length > 30, `${group} Q${question.n}: enunciado curto`);
      assert.ok(question.explanation.length > 40, `${group} Q${question.n}: comentário curto`);
      assert.ok(question.options.length >= 2, `${group} Q${question.n}: sem alternativas`);
      assert.ok(Number.isInteger(question.answer) && question.answer >= 0 && question.answer < question.options.length);
      for (const option of question.options) {
        assert.ok(option.trim().length > 2, `${group} Q${question.n}: alternativa vazia`);
        assert.doesNotMatch(option, /BASE COMPLETA|Direito Constitucional\s*[•|]\s*M0?2|Teoria (?:Completa|Resumida)/i);
      }
    }
  }
});

test('botão Lei em Dia usa o filtro explícito do módulo e mantém as chaves de progresso', () => {
  const ui = read('ui/cf-native-study-v2.js');
  assert.match(ui, /data\(n\)\?\.lawTopicId/);
  assert.match(ui, /openLeiSecaEnxuta\(null,'cf',topic\)/);
  assert.match(ui, /Abrir Lei em Dia/);
  assert.match(ui, /central-v6:cf-native-v2/);
  assert.match(ui, /central-v6:cf-note:/);

  const index = read('index.html');
  const offline = JSON.parse(read('central-offline-files-v66172.json'));
  for (const asset of [
    '/content/cf/m02-native-data.js?v=20261022cfm01m05apostila1',
    '/ui/cf-native-study-v2.js?v=20261031readerstd1',
  ]) {
    assert.ok(index.includes(`src="${asset}"`), asset);
    assert.equal(offline.files.includes(asset), !protectedAsset(new URL(asset, 'https://unit.test').pathname), asset);
  }
});

test('CF M02 renderiza o material didático e abre o filtro correto do Lei em Dia', () => {
  const dom = new JSDOM('<!doctype html><html><head></head><body></body></html>', { url:'https://preview.example/' });
  const context = vm.createContext(dom.window);
  dom.window.CF_WEEKS = [{ id:'w2', num:2, title:'Direitos e deveres individuais e coletivos', read:'CF, art. 5º', read_focus:[] }];
  dom.window.renderSubjects = () => {};
  dom.window.renderAll = () => {};
  let lawArgs;
  dom.window.openLeiSecaEnxuta = (...args) => { lawArgs = args; };
  vm.runInContext(read('content/cf/m02-native-data.js'), context);
  vm.runInContext(read('ui/cf-native-study-v2.js'), context);

  const markup = dom.window.renderConstitutionalMaster();
  assert.match(markup, /<b>Lei em Dia<\/b>/);
  assert.match(markup, /CF, art\. 5º/);
  assert.match(markup, /Abrir Lei em Dia/);

  dom.window.CfNativeStudy.openReader(2, 'complete');
  assert.equal(dom.window.document.querySelector('.cf-native-shell header b').textContent, 'CF M02 — Direitos e deveres individuais e coletivos');
  assert.equal(dom.window.document.querySelector('.cf-native-callout.question strong').textContent, 'Teste de compreensão.');
  assert.ok(dom.window.document.querySelectorAll('.cf-native-callout').length >= 20);
  assert.ok(dom.window.document.querySelectorAll('.cf-native-table').length >= 8);
  assert.equal(dom.window.document.querySelector('.cf-native-table td').dataset.label, 'Dimensão');

  const checks = dom.window.document.querySelectorAll('[data-cf-check]');
  assert.equal(checks.length, 10);
  checks[0].click();
  assert.equal(dom.window.document.querySelector('[data-check-progress]').textContent, '1/10 concluídos');
  assert.equal(checks[0].closest('label').classList.contains('done'), true);
  const savedChecks = JSON.parse(dom.window.localStorage.getItem('central-v6:cf-reader-checks:2:complete'));
  assert.equal(savedChecks[checks[0].dataset.cfCheck], true);

  dom.window.CfNativeStudy.close();
  dom.window.CfNativeStudy.openReader(2, 'complete');
  assert.equal(dom.window.document.querySelector('[data-cf-check]').checked, true);

  dom.window.CfNativeStudy.openDecorando(2);
  assert.deepEqual(lawArgs, [null, 'cf', 'cf-m02']);
  dom.window.close();
});
