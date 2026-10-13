import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';

const runtime = readFileSync(new URL('../central-structural-v66119/runtime.js', import.meta.url), 'utf8');
const start = runtime.indexOf('function renderPenalMaster(){');
const end = runtime.indexOf('\nfunction renderPenalNativeM01Materials()', start);
assert.ok(start >= 0 && end > start, 'A função principal de Direito Penal deve existir');
const code = runtime.slice(start, end);

function render(questionCount) {
  const sandbox = {
    PENAL_QUESTIONS: Array.from({ length: questionCount }, (_, id) => ({ id, real: true })),
    PENAL_WEEKS: Array.from({ length: 17 }, (_, i) => ({ id: 'p' + (i + 1), num: i + 1 })),
    renderPenalModule: w => '<section data-penal-module="' + w.id + '"></section>',
    penalStats: () => ({ answered: 0, wrongIds: [], accuracy: 0 })
  };
  runInNewContext(code, sandbox);
  return sandbox.renderPenalMaster();
}

test('Direito Penal mostra todos os 17 módulos quando o banco legado está vazio', () => {
  const html = render(0);
  assert.equal((html.match(/data-penal-module=/g) || []).length, 17);
  assert.match(html, /data-penal-module="p1"/);
  assert.match(html, /data-penal-module="p17"/);
});

test('Direito Penal continua mostrando os módulos quando há questões legadas', () => {
  const html = render(1);
  assert.equal((html.match(/data-penal-module=/g) || []).length, 17);
  assert.match(html, /penal-session-host/);
});
