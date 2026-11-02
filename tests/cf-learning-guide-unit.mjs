import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';

const paths = [1, 2, 3].map(n => `central-structural-v66119/cf-weeks-00${n}.js`);
const weeks = [];
for (const path of paths) {
  runInNewContext(readFileSync(path, 'utf8'), { CF_WEEKS: weeks }, { filename: path, timeout: 2000 });
}

test('os quinze módulos CF têm guia pedagógico completo', () => {
  assert.equal(weeks.length, 15);
  assert.deepEqual(weeks.map(w => w.num), Array.from({ length: 15 }, (_, i) => i + 1));
  for (const w of weeks) {
    assert.equal(w.learning_goals.length, 3, `CF M${w.num}: objetivos`);
    assert.ok(w.learning_goals.every(x => typeof x === 'string' && x.trim().length > 15));
    assert.ok(typeof w.study_tip === 'string' && w.study_tip.length > 40, `CF M${w.num}: dica`);
    assert.ok(typeof w.exam_pitfall === 'string' && w.exam_pitfall.length > 35, `CF M${w.num}: alerta`);
    assert.equal(w.learning_check.length, 2, `CF M${w.num}: conferência`);
    assert.ok(w.learning_check.every(x => x.endsWith('?')));
  }
});

test('leitura jurídica e roteiro preexistentes foram preservados', () => {
  for (const w of weeks) {
    assert.ok(w.read.length > 35, `CF M${w.num}: leitura inicial`);
    assert.ok(w.read_focus.length >= 4, `CF M${w.num}: pontos da lei`);
    assert.ok(typeof w.editalModule === 'string' && w.editalModule.length > 5, `CF M${w.num}: referência ao edital preservada`);
  }
});

test('interface mostra guia e mantém ações de leitura e questões', () => {
  const ui = readFileSync('ui/cf-native-study-v2.js', 'utf8');
  const html = readFileSync('index.html', 'utf8');
  for (const section of ['O que você vai aprender', 'Como estudar', 'Atenção na prova', 'Confira se aprendeu']) {
    assert.ok(ui.includes(section), `Seção ausente: ${section}`);
  }
  assert.ok(ui.includes('learningGuide(w)'), 'Guia precisa estar vinculado aos módulos');
  assert.ok(ui.includes('toggleLegacyReading'), 'Marcação de leitura preservada');
  assert.ok(ui.includes('Resolver 10 questões') && ui.includes('Resolver 5 questões'), 'Exercícios preservados');
  for (const name of ['cf-weeks-001.js', 'cf-weeks-002.js', 'cf-weeks-003.js', 'cf-native-study-v2.js']) {
    assert.ok(html.includes(`${name}?v=20261101cfguide1`), `Cache não renovado: ${name}`);
  }
});
