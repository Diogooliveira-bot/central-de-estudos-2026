import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

await import('../central-agenda-core-v1.js');
const core = globalThis.BaseAgendaCore;
const fixture = JSON.parse(readFileSync(new URL('./fixtures/before-state.json', import.meta.url), 'utf8'));

test('lê tarefas legadas sem perder campos desconhecidos', () => {
  const parsed = core.parseTasks(fixture.localStorage['central-v6:agenda:2026-09-28']);
  assert.equal(parsed.ok, true);
  assert.equal(parsed.tasks.length, 2);
  assert.equal(parsed.tasks[1].legacyExtra, 'preservar');
  assert.equal(JSON.parse(core.serializeTasks(parsed.tasks))[1].legacyExtra, 'preservar');
});

test('operações CRUD, ordem e duplicação preservam o formato compatível', () => {
  let tasks = core.parseTasks(fixture.localStorage['central-v6:agenda:2026-09-28']).tasks;
  const added = core.createTask({ task: 'Nova tarefa', time: '08:30', note: 'observação' }, 1695890000000);
  tasks = tasks.concat(added);
  tasks = core.toggleTask(tasks, added.id, true);
  tasks = core.updateTask(tasks, added.id, { task: 'Tarefa editada' });
  tasks = core.moveTask(tasks, added.id, -1);
  const duplicate = core.duplicateTask(tasks.find((item) => item.id === added.id), 1695891000000);
  tasks.push(duplicate);
  tasks = core.removeTask(tasks, 1695887400000);

  assert.equal(tasks.some((item) => item.task === 'Tarefa editada' && item.done), true);
  assert.equal(duplicate.done, false);
  assert.equal(tasks.some((item) => item.id === 1695887400000), false);
  assert.doesNotThrow(() => JSON.parse(core.serializeTasks(tasks)));
});

test('mudanças da Agenda não alteram progresso, preferências nem IndexedDB', () => {
  const before = structuredClone(fixture);
  const storage = new Map(Object.entries(fixture.localStorage));
  const date = '2026-09-28';
  const key = core.agendaKey(date);
  const tasks = core.parseTasks(storage.get(key)).tasks;
  tasks.push(core.createTask({ task: 'Persistir com segurança' }, 1695892000000));
  storage.set(key, core.serializeTasks(tasks));

  for (const [name, value] of Object.entries(before.localStorage)) {
    if (name !== key) assert.equal(storage.get(name), value, `chave alterada: ${name}`);
  }
  assert.deepEqual(fixture.indexedDB, before.indexedDB);
});

test('registro inválido é detectado sem conversão destrutiva', () => {
  const raw = '{registro-incompleto';
  const parsed = core.parseTasks(raw);
  assert.equal(parsed.ok, false);
  assert.equal(parsed.raw, raw);
  assert.deepEqual(parsed.tasks, []);
});

test('somente chaves de data válidas entram no calendário', () => {
  assert.equal(core.dateFromKey('central-v6:agenda:2026-09-28'), '2026-09-28');
  assert.equal(core.dateFromKey('central-v6:agenda-recovery:2026-09-28:1'), '');
  assert.equal(core.dateFromKey('central-v6:agenda:config'), '');
});
