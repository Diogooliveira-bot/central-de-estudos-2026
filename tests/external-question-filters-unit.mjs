import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { JSDOM } from 'jsdom';

const root = path.resolve(import.meta.dirname, '..');
const source = fs.readFileSync(path.join(root, 'ui/external-question-filters-v1.js'), 'utf8');
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');

function setup() {
  const dom = new JSDOM(`<!doctype html><html><body>
    <div id="centralSidebar"><div class="nav"><button>Início</button><button>Cadernos TEC</button><div class="label">Ferramentas</div></div></div>
    <div class="workspace"><section id="homeView" class="view"></section></div><span id="crumb"></span>
    <section id="studentMorePanel"><div class="student-more-grid"></div></section>
    <section id="subjects"><article class="subject" data-id="penal"><div class="cf-module open" data-cf="p3"><div class="cf-module-body"><section class="qc-platform-sharing"></section><article class="bc-native-metric-card"><div class="bc-native-ring" data-native-ring="external"><div class="bc-native-ring-inner"><b data-ring-value>64%</b></div></div><strong data-native-metric-detail="external">Histórico legado preservado</strong><span data-native-metric-meta="external">Registro anterior</span></article></div></div></article></section>
  </body></html>`, { url: 'https://preview.example.test/central-v119.html', runScripts: 'outside-only', pretendToBeVisual: true });
  const { window } = dom;
  window.confirm = () => true;
  window.scrollTo = () => {};
  window.QC_CENTRAL_SHARING_LINKS = { items: [{
    discipline: 'Direito Penal', disciplineKey: 'penal', code: 'M03', status: 'VALIDADO',
    public: true, id: '15288411', quantity: 127, link: 'https://www.qconcursos.com/questoes-de-concursos/questoes?notebook_ids%5B%5D=15288411',
    notebookTitle: 'PEN M03 Teoria do Crime'
  }] };
  window.TEC_PENAL_CPP_LINKS = { records: [{
    discipline: 'penal', module: 'M03', part: 1, title: 'PENAL M03 Teoria do Crime',
    id: '105849634', quantity: 39, url: 'https://www.tecconcursos.com.br/s/Q7A8KA', status: 'VALIDADO_NA_CONTA_CRIADORA'
  }] };
  window.eval(source);
  window.document.dispatchEvent(new window.Event('DOMContentLoaded'));
  return dom;
}

const settle = (window) => new Promise((resolve) => window.requestAnimationFrame(() => window.requestAnimationFrame(resolve)));

test('catálogo reúne QC e TEC sem inventar filtros pendentes', async () => {
  const dom = setup();
  const rows = dom.window.ExternalQuestionFilters.buildRegistry();
  assert.equal(rows.length, 2);
  assert.equal(rows.map((row) => row.platform).sort().join(','), 'qc,tec');
  assert.equal(rows.find((row) => row.platform === 'qc').count, 127);
  assert.equal(rows.find((row) => row.platform === 'tec').id, '105849634');
  await settle(dom.window);
});

test('catálogo real cobre todas as disciplinas com filtros publicados', () => {
  const dom = new JSDOM('<!doctype html><html><body></body></html>', {
    url: 'https://preview.example.test/central-v119.html', runScripts: 'outside-only', pretendToBeVisual: true
  });
  const files = [
    'content/qc-sharing-links.js', 'content/cpc/cpc-sharing-links.js',
    'content/adm/adm-sharing-links.js', 'content/civil/civil-sharing-links.js',
    'content/penal-cpp-tec-links.js'
  ];
  files.forEach((file) => dom.window.eval(read(file)));
  const tecSource = read('content/tec-cadernos-data.js');
  assert.ok(tecSource.includes('window.TEC_CADERNOS_DATA='), 'o catálogo TEC deve permanecer no arquivo de entrega privada');
  dom.window.eval(tecSource);
  dom.window.eval(source);
  const rows = dom.window.ExternalQuestionFilters.buildRegistry();
  const disciplines = new Set(rows.map((row) => row.discipline));
  assert.ok(rows.some((row) => row.platform === 'qc' && row.id === '15351620'));
  assert.ok(rows.some((row) => row.platform === 'qc' && row.id === '15352286' && row.count === 2));
  assert.ok(rows.some((row) => row.platform === 'qc' && row.id === '15352419' && row.count === 2));
  assert.ok(rows.some((row) => row.platform === 'qc' && row.id === '15352451' && row.count === 2));
  // Os 7 cadernos TEC de RLM com numeração antiga (rlm-01…07) não entram mais nos módulos atuais.
  assert.equal(rows.length, 747);
  assert.equal(rows.filter((row) => row.platform === 'qc').length, 431);
  assert.equal(rows.filter((row) => row.platform === 'tec').length, 316);
  assert.ok(!rows.some((row) => row.platform === 'tec' && row.disciplineKey === 'rlm'));
  assert.deepEqual(Array.from(disciplines).sort((a, b) => a.localeCompare(b, 'pt-BR')), [
    'Direito Administrativo', 'Direito Civil', 'Direito Constitucional',
    'Direito Empresarial', 'Direito Penal', 'Direito Processual Civil',
    'Direito Processual Penal', 'Matemática', 'Português', 'Raciocínio Lógico'
  ].sort((a, b) => a.localeCompare(b, 'pt-BR')));
  assert.ok(rows.every((row) => row.id && row.count > 0 && row.url.startsWith('https://')));
});

test('RLM recebe os cadernos TEC indicados para cada módulo atual', () => {
  const dom = new JSDOM('<!doctype html><html><body></body></html>', {
    url: 'https://preview.example.test/central-v119.html', runScripts: 'outside-only', pretendToBeVisual: true
  });
  dom.window.eval(read('content/qc-sharing-links.js'));
  dom.window.eval(read('content/rlm-tjce-2026/estrutura.js'));
  const tecSource = read('content/tec-cadernos-data.js');
  dom.window.eval(tecSource);
  dom.window.eval(source);
  const rows = dom.window.ExternalQuestionFilters.buildRegistry().filter((row) => row.disciplineKey === 'rlm');
  const tec = rows.filter((row) => row.platform === 'tec');
  assert.ok(tec.some((row) => row.module === 'M02' && row.url.endsWith('/101791585')), 'M02 usa RLM 01 (proposições)');
  assert.ok(tec.some((row) => row.module === 'M11' && row.url.endsWith('/101890577')), 'M11 usa MAT 04 (proporcionalidade)');
  assert.ok(!tec.some((row) => row.module === 'M01'), 'M01 (treino) não recebe caderno antigo');
  assert.ok(rows.some((row) => row.platform === 'qc' && row.module === 'M02' && row.id === '15312990'));
});

test('validação rejeita acertos superiores às respondidas', async () => {
  const dom = setup();
  const api = dom.window.ExternalQuestionFilters;
  assert.equal(api.validate({ date: '2026-10-15', answered: 20, correct: 16 }), true);
  assert.equal(api.validate({ date: '2026-10-15', answered: 10, correct: 11 }), false);
  assert.equal(api.validate({ date: '2026-10-15', answered: 0, correct: 0 }), false);
  assert.equal(api.validate({ date: '2026-02-31', answered: 10, correct: 8 }), false);
  await settle(dom.window);
});

test('sessões ficam isoladas pelo identificador estável do filtro e acumulam corretamente', async () => {
  const dom = setup();
  const api = dom.window.ExternalQuestionFilters;
  const [qc, tec] = api.buildRegistry();
  const qcFilter = qc.platform === 'qc' ? qc : tec;
  const tecFilter = qc.platform === 'tec' ? qc : tec;
  api.saveSession(qcFilter, { date: '2026-10-14', answered: 20, correct: 10 });
  api.saveSession(qcFilter, { date: '2026-10-15', answered: 30, correct: 25 });
  api.saveSession(tecFilter, { date: '2026-10-15', answered: 10, correct: 9 });
  const qcStats = api.statsFor(qcFilter);
  assert.equal(qcStats.sessions.length, 2);
  assert.equal(qcStats.answered, 50);
  assert.equal(qcStats.correct, 35);
  assert.equal(qcStats.errors, 15);
  assert.equal(qcStats.percent, 70);
  assert.equal(api.statsFor(tecFilter).percent, 90);
  assert.notEqual(qcFilter.stableKey, tecFilter.stableKey);
  await settle(dom.window);
});

test('componente compartilhado substitui a apresentação antiga no módulo', async () => {
  const dom = setup();
  dom.window.ExternalQuestionFilters.refresh();
  await new Promise((resolve) => dom.window.requestAnimationFrame(resolve));
  const body = dom.window.document.querySelector('[data-cf="p3"] .cf-module-body');
  assert.equal(body.querySelector('.qc-platform-sharing').getAttribute('data-bcq-original'), '1');
  assert.equal(body.querySelectorAll('[data-bcq-module-panel] .bcq-platform').length, 1);
  assert.equal(body.querySelector('[data-bcq-platform="qc"] .bcq-add').textContent, '+');
  assert.equal(body.querySelector('[data-bcq-platform="tec"]'), null, 'TEC não aparece para alunos');
  assert.equal(dom.window.document.querySelector('[data-bcq-nav]'), null);
  assert.equal(dom.window.document.querySelector('[data-bcq-more-nav]'), null);
  assert.equal(typeof dom.window.ExternalQuestionFilters.openPage, 'function');
  assert.ok(dom.window.document.getElementById('questionFiltersView'));
  assert.equal(body.querySelector('[data-native-metric-detail="external"]').textContent, 'Histórico legado preservado');
  await settle(dom.window);
});


test('Português: legado TEC fica no registro, mas não aparece dentro do módulo', async () => {
  const dom = new JSDOM(`<!doctype html><html><body>
    <div id="centralSidebar"><div class="nav"></div></div><div class="workspace"><section id="homeView" class="view"></section></div>
    <section id="subjects"><article class="subject" data-id="pt">
      <section class="cf-module pt-cf-module open" data-pt-current="m04"><button class="cf-module-head"><span class="cf-module-no">MÓDULO 4</span></button><div class="cf-module-body"><div class="pt-cf-module-inside"><section class="pt-cf-cards"></section><section data-bcq-module-slot="1" data-bc-module-links="1"></section></div></div></section>
      <section class="cf-module pt-cf-module" data-pt-current="review"><button class="cf-module-head"><span class="cf-module-no">REVISÃO FINAL</span></button><div class="cf-module-body"></div></section>
    </article></section></body></html>`, { url: 'https://preview.example.test/central-v119.html', runScripts: 'outside-only', pretendToBeVisual: true });
  const { window } = dom;
  window.scrollTo = () => {};
  const caderno = (n, nome, id) => ({ id: `port-${n}`, grupo: 'portugues', grupoNome: 'Português', nome, questoes: 100, url: `https://www.tecconcursos.com.br/questoes/cadernos/${id}` });
  window.PT_TEC_CADERNOS = [caderno('01', 'PORT 01 - Interpretação de textos', 1), caderno('04', 'PORT 04 - Ortografia, acentuação e fonética', 4), caderno('16', 'PORT 16 - Questões mescladas', 16)];
  window.eval(source);
  window.document.dispatchEvent(new window.Event('DOMContentLoaded'));
  await settle(window);
  const rows = window.ExternalQuestionFilters.buildRegistry().filter((row) => row.disciplineKey === 'portugues');
  const where = (code) => JSON.parse(JSON.stringify(rows.filter((row) => row.legacyCid === code.replace('PORT ', 'port-')).map((row) => row.module).sort()));
  assert.deepEqual(where('PORT 01'), ['M24'], 'Interpretação de textos → M24');
  assert.deepEqual(where('PORT 04'), ['M02', 'M03', 'M04'], 'Ortografia, acentuação e fonética → M02 a M04');
  assert.deepEqual(where('PORT 16'), ['M25'], 'Questões mescladas → Revisão final');
  const panel = window.document.querySelector('[data-bcq-module-panel="portugues:M04"]');
  assert.equal(panel, null, 'módulo sem QC não reexibe o TEC antigo');
  assert.equal(window.ExternalQuestionFilters.visibleModuleFilters().filter(row => row.disciplineKey === 'portugues').length, 0);
  await settle(window);
});
