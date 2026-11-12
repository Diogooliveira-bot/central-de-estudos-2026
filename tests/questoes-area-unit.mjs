import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import { JSDOM } from 'jsdom';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = p => fs.readFileSync(path.join(root, p), 'utf8');

function fixture() {
  const dom = new JSDOM('<!doctype html><html><body><nav id="centralSidebar"><div class="nav"><button data-central-native="disciplines">Disciplinas</button></div></nav><div class="student-nav-scroll"><button class="student-quick-nav">Lei em Dia</button><button class="student-quick-nav">Vade Mecum</button></div><section id="studentMorePanel"><div class="student-more-grid"><button data-student-more-action="settings">Config</button></div></section></body></html>', { url: 'https://t.local/', runScripts: 'outside-only', pretendToBeVisual: true });
  const w = dom.window;
  for (const f of ['content/questoes/index.js', 'content/questoes/titulos.js', 'content/questoes/adm/m03.js', 'ui/questoes-bank-v1.js', 'ui/questoes-area-v1.js']) w.eval(read(f));
  return dom;
}
const tick = (ms = 80) => new Promise(r => setTimeout(r, ms));

test('menu: entrada "Questões" antes da Lei em Dia e no menu Mais', async () => {
  const dom = fixture(), d = dom.window.document;
  await tick();
  const rail = d.querySelector('.student-nav-scroll');
  const labels = [...rail.children].map(b => b.textContent.trim());
  assert.deepEqual(labels.slice(0, 2), ['Questões', 'Lei em Dia']);
  assert.ok(d.querySelector('#studentMorePanel [data-bcqa-more]'));
  dom.window.close();
});

test('área: hub → disciplina → módulo, responder, placar, refazer erros e salvar progresso', async () => {
  const dom = fixture(), w = dom.window, d = w.document;
  w.BCQuestoesArea.openHub();
  assert.equal(d.querySelectorAll('[data-bc-questoes-area] [data-disc]').length, 8);
  d.querySelector('[data-disc="adm"]').click();
  assert.equal(d.querySelectorAll('[data-mod]').length, 20);
  d.querySelector('[data-mod="3"]').click();
  await tick();
  assert.equal(d.querySelectorAll('.bcqa-q').length, 10);
  const banco = w.BC_QUESTOES.adm[3];
  const errada = (banco[0].answer + 1) % 5;
  d.querySelector('.bcqa-q[data-i="0"] [data-op="' + errada + '"]').click();
  d.querySelector('.bcqa-q[data-i="1"] [data-op="' + banco[1].answer + '"]').click();
  assert.match(d.querySelector('[data-stats]').textContent, /2\/10 respondidas · 1 acertos/);
  assert.match(d.querySelector('.bcqa-q[data-i="0"] .bcqa-feedback').textContent, /Resposta incorreta/);
  assert.match(d.querySelector('.bcqa-q[data-i="1"] .bcqa-feedback').textContent, /Base:/);
  // progresso salvo
  const salvo = JSON.parse(w.localStorage.getItem('central-v6:questoes:v1'));
  assert.equal(Object.keys(salvo.r['adm:3']).length, 2);
  // refazer só os erros libera a questão 1 e mantém a 2
  d.querySelector('[data-erros]').click();
  assert.equal(d.querySelectorAll('.bcqa-q[data-i="0"] [data-op]:not([disabled])').length, 5);
  assert.equal(d.querySelectorAll('.bcqa-q[data-i="1"] [data-op]:not([disabled])').length, 0);
  // refazer o módulo zera tudo
  d.querySelector('[data-zerar]').click();
  assert.match(d.querySelector('[data-stats]').textContent, /0\/10 respondidas/);
  dom.window.close();
});

test('abrir pelo módulo: Voltar fecha a janela; Esc fecha', async () => {
  const dom = fixture(), w = dom.window, d = w.document;
  w.BCQuestoesArea.openModule('adm', 3);
  await tick();
  assert.equal(d.querySelectorAll('.bcqa-q').length, 10);
  d.querySelector('[data-bcqa-voltar]').click();
  assert.equal(d.querySelector('.bcqa-overlay'), null);
  w.BCQuestoesArea.openModule('adm', 3); await tick();
  d.dispatchEvent(new w.KeyboardEvent('keydown', { key: 'Escape' }));
  assert.equal(d.querySelector('.bcqa-overlay'), null);
  dom.window.close();
});

test('ligação na Central: scripts, estilos e arquivos offline do banco', () => {
  const boot = read('central-v119.html');
  const man = JSON.parse(read('central-offline-files-v66172.json'));
  for (const f of ['ui/questoes-area-v1.js', 'ui/questoes-modulo-card-v1.js', 'ui/questoes-bank-v1.js', 'content/questoes/index.js', 'content/questoes/titulos.js', 'ui/questoes-area-v1.css']) {
    assert.ok(boot.includes(f + '?v='), 'bootstrap sem ' + f);
    assert.ok(man.files.some(x => x.startsWith('/' + f + '?v=')), 'manifesto offline sem ' + f);
  }
  const arquivos = fs.readdirSync(path.join(root, 'content/questoes')).filter(d => fs.statSync(path.join(root, 'content/questoes', d)).isDirectory())
    .flatMap(d => fs.readdirSync(path.join(root, 'content/questoes', d)).map(f => `/content/questoes/${d}/${f}`));
  assert.equal(arquivos.length, 148);
  for (const a of arquivos) assert.ok(man.files.some(x => x.startsWith(a + '?v=')), 'manifesto offline sem ' + a);
  // a versão do carregador é a mesma usada no manifesto
  const v = /const VERSION = '([^']+)'/.exec(read('ui/questoes-bank-v1.js'))[1];
  for (const a of arquivos) assert.ok(man.files.includes(a + '?v=' + v), 'versão do banco diferente no manifesto: ' + a);
});

test('todo módulo do banco tem título para exibir', () => {
  const w = {}; new Function('window', read('content/questoes/titulos.js'))(w);
  const idx = {}; new Function('window', read('content/questoes/index.js'))(idx);
  for (const [d, mods] of Object.entries(idx.BC_QUESTOES_INDICE)) for (const n of mods) assert.ok(w.BC_QUESTOES_TITULOS[d]?.[n], `${d} M${n} sem título`);
});

test('módulo com mais de 10 questões: tudo acompanha a quantidade real', async () => {
  const dom = fixture(), w = dom.window, d = w.document;
  const banco = w.BC_QUESTOES.adm[3];
  banco.push({ ...banco[0], id: 'adm-m03-autoral-11' }, { ...banco[1], id: 'adm-m03-autoral-12' });
  w.BC_QUESTOES_QTD.adm[3] = 12;
  w.BCQuestoesArea.openModule('adm', 3);
  await tick();
  assert.equal(d.querySelectorAll('.bcqa-q').length, 12);
  assert.match(d.querySelector('.bcqa-q[data-i="11"] .bcqa-meta').textContent, /QUESTÃO 12 DE 12/);
  assert.match(d.querySelector('[data-stats]').textContent, /0\/12 respondidas/);
  w.BCQuestoesArea.openHub();
  assert.match(d.querySelector('[data-disc="adm"]').textContent, /202 questões/);
  assert.doesNotMatch(d.body.textContent, /Dez questões|10 questões inéditas/);
  dom.window.close();
});
