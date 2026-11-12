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

test('Raciocínio Lógico: com o arquivo de questões de IA, a aba de questões do módulo usa as 10 novas', async () => {
  const storage = new Map(), nodes = new Map();
  const localStorage = {getItem:k => storage.has(k) ? storage.get(k) : null, setItem:(k, v) => storage.set(k, String(v)), removeItem:k => storage.delete(k)};
  const classSet = () => ({values:new Set(), add(x){this.values.add(x)}, remove(x){this.values.delete(x)}, toggle(x, on){if(on === undefined) on = !this.values.has(x); on ? this.values.add(x) : this.values.delete(x); return on}, contains(x){return this.values.has(x)}, get value(){return [...this.values].join(' ')}});
  const make = id => ({id, style:{}, dataset:{}, classList:classSet(), innerHTML:'', scrollHeight:500, clientHeight:150, scrollTop:0, isConnected:true, setAttribute(k, v){this[k] = v}, addEventListener(){}, querySelector(){return null}, querySelectorAll(){return []}, remove(){nodes.delete(id)}, focus(){}});
  const body = {classList:classSet(), appendChild(el){nodes.set(el.id, el)}};
  const doc = {body, activeElement:{isConnected:true, focus(){}}, readyState:'loading', addEventListener(){}, getElementById(id){if(nodes.has(id)) return nodes.get(id); if(id.startsWith('bcRlm')){const n = make(id); nodes.set(id, n); return n} return null}, createElement(name){return make(name)}};
  const g = {}, c = {window:g, document:doc, localStorage, URL, console, requestAnimationFrame(){}, setTimeout(){}};
  vm.createContext(c);
  for (const name of ['estrutura', 'aulas-logica', 'aulas-raciocinio', 'aulas-matematica', 'aulas-estatistica', 'complementos-teoria']) new vm.Script(read('content/rlm-tjce-2026/' + name + '.js')).runInContext(c);
  new vm.Script(read('ui/rlm-theory-resources.js')).runInContext(c);
  new vm.Script(read('ui/central-authorial-bank-v1.js')).runInContext(c);
  new vm.Script(read('content/rlm-tjce-2026/m02-authorial10-v1.js')).runInContext(c);
  new vm.Script(read('ui/rlm-native-v1.js')).runInContext(c);
  const bank = g.BC_RLM_AUTHORIAL_OVERRIDES[2];
  const antes = g.RLM_CURSO_AULAS.M02.questions[0].prompt;
  assert.notEqual(antes, bank[0].q);
  localStorage.setItem('central-v6:rlm-tjce2026:answers:M02', JSON.stringify({0:1}));
  g.RlmNative.open('M02', 'quiz');
  await new Promise(r => setImmediate(r));
  assert.equal(g.RLM_CURSO_AULAS.M02.questions.length, 10);
  assert.equal(g.RLM_CURSO_AULAS.M02.questions[0].prompt, bank[0].q);
  assert.equal(localStorage.getItem('central-v6:rlm-tjce2026:answers:M02'), null, 'respostas antigas (de outras questões) zeradas');
  assert.match(nodes.get('bcRlmReaderOverlay').innerHTML, /Questão 01/);
  g.RlmNative.close();
});
