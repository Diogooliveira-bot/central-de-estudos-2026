import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import test from 'node:test';
import { JSDOM } from 'jsdom';

const read = path => fs.readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');

test('Constitucional: com o arquivo de questões de IA, a tela de questões do módulo usa as 10 novas', () => {
  const dom = new JSDOM('<!doctype html><html><head></head><body></body></html>', {url:'https://cf-bank.example/'});
  const w = dom.window;
  w.CF_WEEKS = [6].map(n => ({id:`w${n}`,num:n,title:`M${n}`,read:'Leitura',read_focus:[]}));
  w.renderSubjects = () => {};
  w.renderAll = () => {};
  const ctx = vm.createContext(w);
  vm.runInContext(read('content/cf/m06-native-data.js'), ctx);
  vm.runInContext(read('ui/central-internal-question-policy-v1.js'), ctx);
  vm.runInContext(read('ui/central-authorial-bank-v1.js'), ctx);
  vm.runInContext(read('content/cf/m06-authorial10-v1.js'), ctx);
  vm.runInContext(read('ui/cf-native-study-v2.js'), ctx);
  const bank = w.BC_CF_AUTHORIAL_OVERRIDES[6];
  assert.equal(bank.length, 10);
  w.CfNativeStudy.openQuiz(6, 'summary');
  for (const q of bank) {
    assert.match(w.document.querySelector('[data-host] h1').textContent, new RegExp(q.q.slice(0, 30).replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
    assert.equal(w.document.querySelectorAll('[data-opt]').length, 5, 'cinco alternativas na tela');
    w.document.querySelector('[data-opt="' + q.answer + '"]').click();
    assert.match(w.document.querySelector('[data-feed]').textContent, /Correto/);
    w.document.querySelector('[data-next]').click();
  }
  assert.match(w.document.querySelector('[data-host]').textContent, /10 \/ 10/);
  dom.window.close();
});
