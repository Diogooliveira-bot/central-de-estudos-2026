import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { JSDOM } from 'jsdom';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const parseAssignedJson = (file, expression) => {
  const source = read(file);
  const match = source.match(expression);
  assert.ok(match, `${file}: JSON atribuído não encontrado`);
  return JSON.parse(match[1]);
};

test('Direito do Trabalho usa o renderer próprio e mantém dados e links pendentes corretos', async () => {
  const workStyles = read('ui/discipline-standard.css');
  assert.match(workStyles, /subject\[data-id="trab"\] \.work-approved-card\.penal-approved-complete/);
  assert.match(workStyles, /subject\[data-id="trab"\] \.work-approved-card\.penal-approved-review/);
  assert.match(workStyles, /subject\[data-id="trab"\] \.work-approved-card\.penal-approved-visual/);
  assert.match(workStyles, /@media\(max-width:700px\)\s*\{[^}]*subject\[data-id="trab"\] \.work-approved-card/s);
  const modulesDir = path.join(root, 'modules/trabalho/native/modules');
  const moduleFiles = fs.readdirSync(modulesDir).filter((name) => /^m\d+\.json$/.test(name));
  assert.equal(moduleFiles.length, 18);
  for (const file of moduleFiles) {
    const data = JSON.parse(fs.readFileSync(path.join(modulesDir, file), 'utf8'));
    assert.equal(data.questoes.resumida.length, 5, `${file}: questões de revisão`);
    assert.equal(data.questoes.completa.length, 10, `${file}: questões completas`);
    assert.ok(data.infografico, `${file}: infográfico real`);
  }

  const dom = new JSDOM('<!doctype html><html class="bc-ui-v1"><body><main id="subjects"><section class="subject open" data-id="trab"><div class="subject-body"><section class="bc-trabalho-master"><section class="bc-trabalho-module open" data-uid="trab-m01"><button class="bc-trabalho-module-head"><span class="bc-trabalho-module-n">M01</span><span class="bc-trabalho-module-name">Regime Jurídico</span></button><div class="bc-trabalho-module-body"><p class="bc-trabalho-module-hint">Conteúdo legado</p><div class="bc-trabalho-materials"><div>cards legados</div></div></div></section><section class="bc-trabalho-module open" data-uid="trab-m04"><button class="bc-trabalho-module-head"><span class="bc-trabalho-module-n">M04</span><span class="bc-trabalho-module-name">Jornada</span></button><div class="bc-trabalho-module-body"><div class="bc-trabalho-materials">cards legados</div></div></section></section></div></section></main></body></html>', {
    url: 'https://preview.example/central-v119.html', runScripts: 'outside-only', pretendToBeVisual: true,
  });
  const { window } = dom;
  const calls = [];
  window.todayISO = () => '2026-10-19';
  window.formatDate = (date) => date;
  window.key = (uid, field) => `central-v6:${uid}:${field}`;
  window.getPerf = () => [{ q: 20, c: 16, pct: 80 }];
  window.getNotes = (uid) => JSON.parse(window.localStorage.getItem(`central-v6:${uid}:notes`) || '[]');
  window.ExternalQuestionFilters = { openPage: (...args) => calls.push(['center', ...args]) };
  window.openEmbeddedTool = (...args) => calls.push(['tool', ...args]);
  window.tecAbrirListaContexto = (...args) => calls.push(['tec-list', ...args]);
  window.localStorage.setItem('central-v6:trab-m01:notes', JSON.stringify([{ id: 7, text: 'Anotação anterior', at: '2026-01-01' }]));
  window.localStorage.setItem('central-v6:trab-m01:perf', JSON.stringify([{ id: 4, q: 20, c: 16 }]));
  window.eval(read('ui/discipline-standard.js'));
  window.CentralDisciplineStandard.refresh();
  await new Promise((resolve) => window.setTimeout(resolve, 0));

  const m01 = window.document.querySelector('[data-uid="trab-m01"]');
  const body = m01.querySelector('.bc-trabalho-module-body');
  const layout = body.querySelector(':scope > .work-approved-layout');
  assert.ok(layout, 'adapter alcança o módulo de Direito do Trabalho');
  assert.deepEqual([...layout.children].map((node) => node.matches('.work-approved-progress') ? 'progress' : node.matches('.work-approved-reading') ? 'reading' : node.dataset.workCard), ['progress', 'reading', 'complete', 'review', 'infographic']);
  assert.deepEqual([...body.querySelectorAll('.work-approved-card h3')].map((node) => node.textContent), ['Teoria completa', 'Versão de revisão', 'Infográfico']);
  assert.deepEqual([...body.querySelectorAll('[data-work-card="complete"] .penal-approved-card-actions button')].map((node) => node.textContent), ['Estudar conteúdo', 'Resolver 10 questões']);
  assert.deepEqual([...body.querySelectorAll('[data-work-card="review"] .penal-approved-card-actions button')].map((node) => node.textContent), ['Revisar conteúdo', 'Resolver 5 questões']);
  assert.equal(body.querySelectorAll('.ds-notes').length, 1);
  assert.match(body.querySelector('.ds-notes').textContent, /Anotação anterior/);
  assert.equal(window.localStorage.getItem('central-v6:trab-m01:perf'), '[{"id":4,"q":20,"c":16}]');
  assert.deepEqual([...body.querySelectorAll('.work-approved-filter-links .work-approved-pending')].map((node) => node.textContent), ['TEC deste módulo · Pendente', 'QConcursos · Pendente']);
  assert.equal(body.querySelector('.work-approved-tools .work-approved-pending').textContent, '📖 Lei em Dia · Pendente');
  assert.equal(body.querySelector('.work-approved-tools [data-work-action="law"]'), null);

  // The reader is deferred in the real app. Cards must render before it loads,
  // then hydrate the progress text when its API becomes available.
  window.CentralTrabalhoUniversal = {
    open: (...args) => calls.push(['open', ...args]),
    openQuestions: (...args) => calls.push(['questions', ...args]),
    stats: async () => ({ summaryPct: 25, completePct: 50, theoryPct: 38 }),
  };
  window.CentralDisciplineStandard.refresh();
  await new Promise((resolve) => window.setTimeout(resolve, 0));
  assert.equal(body.querySelector('[data-work-overall]').textContent, '38% concluído');
  assert.equal(body.querySelector('[data-work-complete-pct]').textContent, '50% lido');

  const m04 = window.document.querySelector('[data-uid="trab-m04"]');
  assert.ok(m04.querySelector('.work-approved-tools [data-work-action="law"]'), 'Lei em Dia segue ativo nos módulos com vínculo real');
  m01.querySelector('[data-work-action="read-complete"]').click();
  m01.querySelector('[data-work-action="quiz-review"]').click();
  m01.querySelector('.work-approved-center').click();
  assert.equal(JSON.stringify(calls.slice(0, 3)), JSON.stringify([['open', 1, 'completa'], ['questions', 1, 'resumida'], ['center', null, { tab: 'disciplines' }]]));
  dom.window.close();
});

test('Processo do Trabalho mantém 21 módulos, cards verticais, mapas e lacunas identificadas', async () => {
  const index = parseAssignedJson('content/ptra/ptra-native-index.js', /^window\.PTRA_NATIVE_INDEX=(.*);\s*$/s);
  assert.equal(index.modules.length, 21);
  assert.ok(index.modules.every((module) => module.summaryQuestions === 5 && module.completeQuestions === 10));
  assert.equal(index.modules.filter((module) => module.infographic).length, 21);
  assert.deepEqual(index.modules.filter((module) => !module.tec.length).map((module) => module.number), [6, 12]);
  assert.ok(index.modules[0].tec.length > 0, 'associação TEC real preservada nos dados do módulo');
  assert.deepEqual(index.modules.filter((module) => module.warning).map((module) => module.number), [8, 10, 13]);

  const dom = new JSDOM('<!doctype html><html class="bc-ui-v1"><body><main id="subjects"><section class="subject open" data-id="ptra"><div class="subject-body"></div></section></main></body></html>', {
    url: 'https://preview.example/central-v119.html', runScripts: 'outside-only', pretendToBeVisual: true,
  });
  const { window } = dom;
  for (const module of index.modules) window.localStorage.setItem(`base-completa:ptra:v2:open:m${String(module.number).padStart(2, '0')}`, '1');
  window.localStorage.setItem('base-completa:ptra:v2:m01:notes', JSON.stringify([{ text: 'Nota preservada', at: 1 }]));
  window.localStorage.setItem('base-completa:ptra:v2:m01:tec:rounds', JSON.stringify([{ done: 12, correct: 9, note: 'rodada antiga' }]));
  window.PTRA_NATIVE_INDEX = index;
  window.renderSubjects = () => {};
  window.eval(read('ui/ptra-native-study-v1.js'));
  const host = window.document.querySelector('.subject[data-id="ptra"] .subject-body');
  host.innerHTML = window.PtraNative.renderMaster();

  const modules = [...host.querySelectorAll('[data-ptra-module]')];
  assert.equal(modules.length, 21);
  for (const module of modules) {
    assert.deepEqual([...module.querySelectorAll('.ptra-native-card h3')].map((node) => node.textContent), ['Teoria completa', 'Versão de revisão', 'Infográfico']);
    assert.deepEqual([...module.querySelectorAll('.ptra-native-card[data-kind="complete"] .penal-approved-card-actions button')].map((node) => node.textContent), ['Estudar conteúdo', 'Resolver 10 questões']);
    assert.deepEqual([...module.querySelectorAll('.ptra-native-card[data-kind="summary"] .penal-approved-card-actions button')].map((node) => node.textContent), ['Revisar conteúdo', 'Resolver 5 questões']);
    assert.equal(module.querySelectorAll('.ptra-native-notes').length, 1);
    assert.ok([...module.querySelectorAll('.ptra-native-tools .ptra-native-pending-link')].some((node) => node.textContent === '📖 Lei em Dia · Pendente'));
    assert.ok([...module.querySelectorAll('.ptra-native-tools .ptra-native-pending-link')].some((node) => node.textContent === 'QConcursos · Pendente'));
  }
  for (const n of [6, 12]) assert.match(modules[n - 1].querySelector('.ptra-native-tools').textContent, /TEC deste módulo · Pendente/);
  assert.equal(modules[0].querySelector('.ptra-native-filters'), null, 'o painel duplicado de filtros e links é removido');
  assert.ok(modules[0].querySelector('.ptra-native-tools [data-ptra-tool="questions"]'), 'Central de Questões continua acessível');
  assert.ok(modules[0].querySelector('.ptra-native-tools .ptra-native-pending-link'), 'links sem integração ficam identificados como pendentes');
  assert.match(modules[0].querySelector('.ptra-native-notes').textContent, /Nota preservada/);
  assert.match(modules[0].querySelector('.ptra-native-tools .ptra-native-history').textContent, /12 feitas · 9 acertos/);
  for (const n of [8, 10, 13]) assert.ok(modules[n - 1].querySelector('.ptra-native-warning'));

  let revoked = [];
  window.fetch = async () => ({ ok: true, blob: async () => new window.Blob(['image'], { type: 'image/avif' }) });
  window.URL.createObjectURL = () => 'blob:https://preview.example/ptra-infographic';
  window.URL.revokeObjectURL = (url) => revoked.push(url);
  await window.PtraNative.openImage(1);
  const overlay = window.document.getElementById('ptra-native-overlay');
  const download = overlay.querySelector('.ptra-native-img-download');
  assert.equal(download.href, 'blob:https://preview.example/ptra-infographic');
  assert.match(download.download, /processo-do-trabalho-m01-infografico\.avif/);
  const image = overlay.querySelector('.ptra-native-image-viewer img');
  assert.equal(image.style.objectFit, 'contain');
  overlay.querySelector('[data-img-plus]').click();
  assert.equal(image.style.width, '125%');
  overlay.querySelector('[data-img-fit]').click();
  assert.equal(image.style.width, '100%');
  overlay.querySelector('[data-ptra-close]').click();
  assert.deepEqual(revoked, ['blob:https://preview.example/ptra-infographic']);
  dom.window.close();
});
