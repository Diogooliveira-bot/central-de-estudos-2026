// Progresso no primeiro uso: convite no topo enquanto não há atividade; tela completa depois.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { JSDOM } from 'jsdom';

const SCRIPT = readFileSync(new URL('../ui/progress-first-use-v1.js', import.meta.url), 'utf8');
const CSS = readFileSync(new URL('../ui/theme-consistency-v1.css', import.meta.url), 'utf8');

function mount(values) {
  const stats = values.map((v, i) => `<div class="sum bc-stat"><span>Item ${i}</span><b>${v}</b></div>`).join('');
  const dom = new JSDOM(`<!doctype html><body><section id="performanceView" class="view">
    <div class="card"><div class="summary bc-stat-strip">${stats}</div></div>
    <section id="studentPerformanceInsight" class="card"><div><h2>Faça seu primeiro bloco de questões</h2></div><button>Escolher disciplina</button></section>
  </section></body>`, { runScripts: 'outside-only' });
  const w = dom.window;
  w.MutationObserver = class { observe() {} };
  w.opened = 0;
  w.CentralAgenda = { open: () => { w.opened++; } };
  w.eval(SCRIPT);
  w.BCProgressFirstUse.update();
  return w;
}

test('sem sessões nem questões: tela de primeiro uso com "Montar meu plano" que abre a Agenda', () => {
  const w = mount(['0', '0', '0', '—']);
  const view = w.document.getElementById('performanceView');
  assert.ok(view.classList.contains('bc-progress-empty'));
  const plan = w.document.querySelector('[data-bc-first-plan]');
  assert.ok(plan && !plan.hidden);
  plan.click();
  assert.equal(w.opened, 1);
});

test('com atividade registrada a tela volta ao formato completo', () => {
  const w = mount(['3', '20', '15', '75%']);
  assert.equal(w.document.getElementById('performanceView').classList.contains('bc-progress-empty'), false);
  assert.equal(w.document.querySelector('[data-bc-first-plan]'), null);
});

test('estilo do primeiro uso esconde gráfico vazio e zeros e põe o convite no topo', () => {
  assert.match(CSS, /#performanceView\.bc-progress-empty > #studentPerformanceInsight \{ order: -1/);
  assert.match(CSS, /#performanceView\.bc-progress-empty \.student-week-chart/);
  assert.match(CSS, /#performanceView\.bc-progress-empty \.card:has\(> \.bc-stat-strip\) \{ display: none/);
});

test('a reorganização do primeiro uso só vale com o Progresso aberto (não reaparece quando oculto)', () => {
  assert.match(CSS, /#performanceView\.bc-progress-empty:not\(\.hidden\) \{ display: flex/);
  assert.doesNotMatch(CSS, /#performanceView\.bc-progress-empty \{ display: flex/);
});
