import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import { existsSync, readFileSync, statSync } from 'node:fs';

const read = (file) => readFileSync(file, 'utf8');
const VERSION = '20261115leo1';

/** Carrega o script isolado, com um localStorage em memória (mesma interface do isolado por usuário). */
function load() {
  const data = new Map();
  const localStorage = {
    getItem: (k) => (data.has(String(k)) ? data.get(String(k)) : null),
    setItem: (k, v) => { data.set(String(k), String(v)); },
    removeItem: (k) => { data.delete(String(k)); },
    key: (i) => [...data.keys()][i] ?? null,
    get length() { return data.size; },
  };
  const ctx = { console, localStorage, Promise, Date, Math, Object, Array, Uint8Array, String, Number, JSON, Error, RegExp, isFinite, Map, Set };
  ctx.globalThis = ctx;
  vm.createContext(ctx);
  vm.runInContext(read('ui/agenda-pdf-leo-v1.js'), ctx);
  const api = ctx.BCAgendaPdfLeo;
  const store = api.defaultStore();
  return { api, store, data };
}
const plain = (value) => JSON.parse(JSON.stringify(value));

// ---- construção de itens iguais aos do pdf.js (str, transform[4]=x, transform[5]=y, width) ----
const item = (str, x, y, w = str.length * 3.6) => ({ str, transform: [8, 0, 0, 8, x, y], width: w });
/** Uma linha do cronograma: disciplina (coluna da direita), título, duração; instrução na linha de baixo. */
function activity(y, discipline, title, minutes, instruction) {
  const items = [item(discipline, 140 - discipline.length * 3.6, y), item(' ', 140, y, 43), item(title, 183, y), item(`${minutes} min`, 517, y, 25)];
  if (instruction) items.push(item(instruction, 183, y - 10));
  return items;
}
function dayHeader(y, text, meta) { return [item(text, 53, y), item(' ', 137, y, 343), item(meta, 480, y, 63)]; }
const CHROME = [item('BASE COMPLETA', 79, 802), item('Aluno Fictício', 466, 802), item('Central de Estudos', 79, 791), item('Plano de estudos · Teste', 346, 791), item('Base Completa · Central de Estudos · Plano personalizado', 43, 31), item('3', 548, 31)];

function pageOne() {
  return [
    ...CHROME,
    item('02 · CRONOGRAMA', 43, 746),
    item('Semana 01', 43, 722),
    item('16/11/2026 a 22/11/2026 · 6h00 planejadas · marque cada atividade concluída.', 43, 703),
    ...dayHeader(669, 'Segunda-feira, 16/11', '3h00 · 2 atividades'),
    ...activity(647, 'Português', 'M01 Como a língua se organiza', 90, 'Ler o resumo da aula M01 e anotar 3 pontos principais.'),
    ...activity(619, 'Raciocínio Lógico', 'M02 Fundamentos da lógica — Ler o resumo da aula M02 e anotar as dúvidas.', 90),
    ...dayHeader(592, 'Domingo, 22/11', '3h00 · 2 atividades'),
    ...activity(571, 'Português', 'Revisão da semana', 90, 'Revisar o que anotou e marcar na Agenda'),
    item('o que ficou pendente.', 183, 551),
    ...activity(530, 'Direito Processual Civil', 'Revisão M02 a M07', 90, 'Revisar as dúvidas.'),
    item('DICA DO LÉO', 60, 480), item('Constância vence intensidade.', 60, 470),
    item('03 · MÉTODO E PRIORIZAÇÃO', 43, 420), item('Teoria 35%', 43, 400),
  ];
}

test('script, estilo e arquivos do pdf.js estão registrados; pdf.js não entra no pacote offline', () => {
  const boot = read('central-v119.html');
  const offline = JSON.parse(read('central-offline-files-v66172.json')).files;
  assert.ok(boot.includes(`/ui/agenda-pdf-leo-v1.css?v=20261115responsive1`));
  assert.ok(boot.includes(`ui/agenda-pdf-leo-v1.js?v=${VERSION}`));
  assert.ok(offline.includes(`/ui/agenda-pdf-leo-v1.css?v=20261115responsive1`));
  assert.ok(offline.includes(`/ui/agenda-pdf-leo-v1.js?v=${VERSION}`));
  for (const file of ['vendor/pdfjs/pdf.min.mjs', 'vendor/pdfjs/pdf.worker.min.mjs', 'vendor/pdfjs/LICENSE.txt', 'vendor/pdfjs/VERSION.txt']) assert.ok(existsSync(file), file);
  assert.match(read('vendor/pdfjs/LICENSE.txt'), /Apache License/);
  assert.ok(statSync('vendor/pdfjs/pdf.worker.min.mjs').size > 500000);
  // 1,5 MB só é baixado por quem escolhe o PDF: nunca no pré-carregamento offline.
  assert.ok(!offline.some((f) => f.includes('/vendor/pdfjs/')), 'pdf.js não é pré-carregado');
  const js = read('ui/agenda-pdf-leo-v1.js');
  assert.ok(js.includes(`'/vendor/pdfjs/pdf.min.mjs?v=' + VERSION`));
  assert.ok(js.includes(`VERSION = '${read('vendor/pdfjs/VERSION.txt').match(/(\d+\.\d+\.\d+)/)[1]}'`), 'versão do script = versão do vendor');
});

test('o texto do PDF nunca vira HTML e o armazenamento usa o localStorage isolado por usuário', () => {
  const js = read('ui/agenda-pdf-leo-v1.js');
  assert.ok(!/innerHTML|insertAdjacentHTML|outerHTML|document\.write/.test(js), 'sem HTML montado a partir do PDF');
  assert.ok(/typeof localStorage !== 'undefined' \? localStorage : global\.localStorage/.test(js), 'usa o identificador solto (conta do aluno)');
  assert.ok(!/window\.localStorage/.test(js), 'não grava fora do espaço do usuário');
});

test('lê o cronograma: semanas, dias, disciplinas, duração, instrução, quebra de linha e descrição na mesma linha', () => {
  const { api } = load();
  const plan = api.parseRows(api.rowsFromItems(pageOne()));
  assert.equal(plan.ok, true);
  assert.deepEqual(plain(plan.weeks.map((w) => [w.number, w.start.iso, w.end.iso])), [[1, '2026-11-16', '2026-11-22']]);
  assert.equal(plan.days.length, 2);
  assert.equal(plan.start, '2026-11-16');
  assert.equal(plan.end, '2026-11-22');
  assert.equal(plan.generatedAt, null);
  const [mon, sun] = plan.days;
  assert.equal(mon.weekday, 'Segunda');
  assert.deepEqual(plain(mon.expected), { minutes: 180, count: 2 });
  assert.deepEqual(plain(mon.activities.map((a) => [a.disciplineId, a.title, a.minutes])), [['pt', 'M01 Como a língua se organiza', 90], ['rlm', 'M02 Fundamentos da lógica', 90]]);
  assert.equal(mon.activities[0].instruction, 'Ler o resumo da aula M01 e anotar 3 pontos principais.');
  assert.equal(mon.activities[1].instruction, 'Ler o resumo da aula M02 e anotar as dúvidas.', 'descrição após o travessão');
  assert.equal(sun.activities[0].instruction, 'Revisar o que anotou e marcar na Agenda o que ficou pendente.', 'instrução em duas linhas');
  assert.equal(sun.activities[1].disciplineId, 'cpc', '"Processual Civil" não vira "Civil"');
  assert.equal(plan.activities, 4);
  assert.equal(plan.minutes, 360);
  assert.deepEqual(plain(plan.warnings), [], 'contagens batem com o cabeçalho de cada dia');
});

test('avisa quando a contagem do dia não bate e rejeita arquivo que não é plano do Léo', () => {
  const { api } = load();
  const items = pageOne().filter((i) => i.str !== 'Revisão M02 a M07' && i.str !== 'Revisar as dúvidas.' && i.str !== 'Direito Processual Civil');
  const plan = api.parseRows(api.rowsFromItems(items));
  assert.ok(plan.warnings.some((w) => /22\/11: o PDF diz 2 atividades e encontrei 1/.test(w)), plan.warnings.join('|'));
  const outro = api.parseRows(api.rowsFromItems([item('Contrato de prestação de serviços', 50, 700), item('Cláusula 1', 50, 680)]));
  assert.equal(outro.ok, false);
  assert.equal(outro.activities, 0);
});

test('resolve o ano pela semana (virada de ano) e a etiqueta Premium não vira coluna', () => {
  const { api } = load();
  const items = [
    item('02 · CRONOGRAMA', 43, 746), item('Semana 05', 43, 722),
    item('28/12/2026 a 03/01/2027 · 3h00 planejadas', 43, 703),
    ...dayHeader(669, 'Quinta-feira, 31/12', '1h30 · 1 atividade'),
    item('Português', 105, 647), item('M09 Crase', 183, 647), item('Premium', 470, 647, 30), item('90 min', 517, 647, 25),
    ...dayHeader(620, 'Segunda-feira, 28/12', '1h30 · 1 atividade'),
    ...activity(600, 'Direito Penal', 'M01 Princípios', 90),
    ...dayHeader(560, 'Domingo, 03/01', '1h30 · 1 atividade'),
    ...activity(540, 'Direito Processual Penal', 'M02 Inquérito', 90),
  ];
  const plan = api.parseRows(api.rowsFromItems(items));
  assert.deepEqual(plain(plan.days.map((d) => d.date)), ['2026-12-28', '2026-12-31', '2027-01-03']);
  const crase = plan.days[1].activities[0];
  assert.equal(crase.premium, true);
  assert.equal(crase.title, 'M09 Crase');
  assert.equal(plan.days[0].activities[0].disciplineId, 'penal');
  assert.equal(plan.days[2].activities[0].disciplineId, 'cpp');
  assert.deepEqual(plain(plan.warnings), []);
});

test('importar grava no formato da Agenda, sem duplicar, preservando o que foi feito e as tarefas manuais', () => {
  const { api, store, data } = load();
  const plan = api.parseRows(api.rowsFromItems(pageOne()));
  const first = api.planMerge(plan, store);
  assert.deepEqual([first.add, first.update, first.keep, first.remove], [4, 0, 0, 0]);
  assert.equal(data.size, 0, 'a prévia não grava nada');

  const applied = api.applyMerge(plan, store);
  assert.equal(applied.add, 4);
  const monday = JSON.parse(store.get('central-v6:agenda:2026-11-16'));
  assert.equal(monday.length, 2);
  assert.deepEqual(plain(Object.keys(monday[0]).sort()), ['discipline', 'done', 'id', 'minutes', 'source', 'task', 'time']);
  assert.equal(monday[0].discipline, 'pt');
  assert.equal(monday[0].source, 'leo-pdf');
  assert.equal(monday[0].task, 'M01 Como a língua se organiza — Ler o resumo da aula M01 e anotar 3 pontos principais. (90 min)');
  assert.match(monday[0].id, /^leo-2026-11-16-[0-9a-z]+$/);
  assert.equal(new Set(monday.map((t) => t.id)).size, 2);
  const meta = JSON.parse(store.get('central-v6:leo-plan:v1'));
  assert.deepEqual([meta.start, meta.end, meta.total, meta.minutes], ['2026-11-16', '2026-11-22', 4, 360]);

  // o aluno marca uma como feita e adiciona uma tarefa própria
  monday[0].done = true; monday.push({ id: 'manual-1', time: '07:00', discipline: 'Português', task: 'Minha tarefa', done: false });
  store.set('central-v6:agenda:2026-11-16', JSON.stringify(monday));

  const again = api.planMerge(plan, store);
  assert.deepEqual([again.add, again.update, again.keep, again.remove, again.writes.length], [0, 0, 4, 0, 0], 'mesmo PDF: nada muda');
  api.applyMerge(plan, store);
  assert.equal(JSON.parse(store.get('central-v6:agenda:2026-11-16')).length, 3);

  // plano atualizado: texto do título muda (mesmo código M01) e uma atividade sai do plano
  const changed = plain(plan);
  changed.days[0].activities[0].title = 'M01 Como a língua se organiza (revisado)';
  changed.days[1].activities.pop();
  changed.activities = 3;
  const diff = api.planMerge(changed, store);
  assert.deepEqual([diff.add, diff.update, diff.keep, diff.remove], [0, 1, 2, 1]);
  api.applyMerge(changed, store);
  const after = JSON.parse(store.get('central-v6:agenda:2026-11-16'));
  assert.equal(after.length, 3);
  assert.match(after[0].task, /revisado/);
  assert.equal(after[0].done, true, 'o que foi feito continua feito');
  assert.equal(after[2].id, 'manual-1', 'tarefa manual intacta');
  assert.equal(JSON.parse(store.get('central-v6:agenda:2026-11-22')).length, 1);

  const stats = api.leoStats(store);
  assert.deepEqual(plain(stats), { total: 3, done: 1, start: '2026-11-16', end: '2026-11-22' });
  assert.equal(api.removeAll(store), 3);
  assert.deepEqual(JSON.parse(store.get('central-v6:agenda:2026-11-16')).map((t) => t.id), ['manual-1']);
  assert.equal(store.get('central-v6:leo-plan:v1'), null);
});

test('atividade já feita que saiu do plano é mantida como histórico', () => {
  const { api, store } = load();
  const plan = api.parseRows(api.rowsFromItems(pageOne()));
  api.applyMerge(plan, store);
  const sunday = JSON.parse(store.get('central-v6:agenda:2026-11-22'));
  sunday[1].done = true; store.set('central-v6:agenda:2026-11-22', JSON.stringify(sunday));
  const smaller = plain(plan); smaller.days[1].activities.pop();
  const diff = api.planMerge(smaller, store);
  assert.equal(diff.remove, 0);
  api.applyMerge(smaller, store);
  assert.equal(JSON.parse(store.get('central-v6:agenda:2026-11-22')).length, 2);
});

test('arquivos inválidos geram mensagens claras e nenhuma exceção solta', async () => {
  const { api } = load();
  await assert.rejects(() => api.extractRows(new TextEncoder().encode('isto não é pdf')), (e) => e.code === 'not-pdf');
  await assert.rejects(() => api.extractRows(new Uint8Array(16 * 1024 * 1024)), (e) => e.code === 'too-big');
  assert.match(api.friendlyError({ code: 'not-pdf' }), /não é um PDF/);
  assert.match(api.friendlyError({ name: 'PasswordException' }), /senha/);
  assert.match(api.friendlyError({ code: 'not-leo' }), /Plano de Estudos/);
  assert.match(api.friendlyError(new Error('rede')), /Não consegui ler/);
  api.setLoader(async () => ({ getDocument: () => ({ promise: Promise.resolve({ numPages: 1, getPage: async () => ({ getTextContent: async () => ({ items: [item('Receita de bolo', 50, 700)] }), cleanup() {} }), destroy() {} }) }) }));
  await assert.rejects(() => api.readPlan(new TextEncoder().encode('%PDF-1.7 fictício')), (e) => e.code === 'not-leo');
});
