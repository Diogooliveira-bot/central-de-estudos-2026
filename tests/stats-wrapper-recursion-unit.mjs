import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import { readFileSync } from 'node:fs';

// Regressão: os embrulhos de subjStats (fixes/correcoes + Informática) chamavam uns aos outros em círculo
// (500 mil+ chamadas até estourar a pilha na abertura, e totais errados em CPP/RLM).
const src = readFileSync('fixes/correcoes-20260930.js', 'utf8');
const a = src.indexOf('function installStatsWrapper(){');
const b = src.indexOf('\nfunction subjectById', a);
const installSource = src.slice(a, b);

function scenario() {
  const calls = { base: 0 };
  const ctx = { window: {}, calls };
  ctx.window.subjStats = function base() { calls.base++; return { done: 1, total: 2, pct: 50 }; };
  ctx.normalizeStats = (subject, stats) => stats;
  vm.createContext(ctx);
  vm.runInContext(installSource + '\nthis.install = installStatsWrapper;', ctx);
  return ctx;
}

test('reembrulhar subjStats depois de outro script (Informática) não cria laço infinito', () => {
  const ctx = scenario();
  ctx.install();                                   // 1º embrulho (correcoes)
  const previous = ctx.window.subjStats;           // outro script embrulha depois, sem a marca __bcCounts
  ctx.window.subjStats = function outer(subject) { return previous.apply(this, arguments); };
  ctx.install();                                   // correcoes embrulha de novo (acontece a cada "enhance")
  let result;
  assert.doesNotThrow(() => { result = ctx.window.subjStats({ id: 'cpp', topics: [] }); });
  assert.equal(ctx.calls.base, 1, 'a função original roda uma vez por chamada (sem recursão)');
  assert.equal(result.pct, 50);
});

test('a variável compartilhada que causava o laço não existe mais', () => {
  assert.ok(!/nativeSubjStats\s*=\s*window\.subjStats/.test(src));
  assert.match(installSource, /var native=window\.subjStats/);
});
