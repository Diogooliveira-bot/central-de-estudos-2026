import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { JSDOM } from 'jsdom';
import { validateFilterOverride } from '../api/external-question-filters.js';

const root = path.resolve(import.meta.dirname, '..');
const source = fs.readFileSync(path.join(root, 'ui/external-question-filters-v1.js'), 'utf8');
const styles = fs.readFileSync(path.join(root, 'ui/external-question-filters-v1.css'), 'utf8');

function filterData() {
  const qc = {
    discipline: 'Direito Penal', disciplineKey: 'penal', code: 'M03', status: 'VALIDADO', public: true,
    moduleTitle: 'Teoria do Crime', title: 'Teoria do Crime', kind: 'general',
    id: '15288411', quantity: 127,
    link: 'https://www.qconcursos.com/questoes-de-concursos/questoes?notebook_ids%5B%5D=15288411',
    notebookTitle: 'PEN M03 Teor. Crim.'
  };
  const tec = {
    discipline: 'penal', module: 'M03', part: 1, title: 'PENAL M03 Teoria do Crime', id: '105849634',
    quantity: 39, url: 'https://www.tecconcursos.com.br/s/Q7A8KA', status: 'VALIDADO_NA_CONTA_CRIADORA'
  };
  return {
    qc: { items: [qc, { ...qc }] },
    tec: { records: [tec, { ...tec }] }
  };
}

function setup({ role = 'aluno', overrides = [], failModuleMount = false } = {}) {
  const dom = new JSDOM(`<!doctype html><html><body>
    <div id="centralSidebar"><div class="nav"><button>Hoje</button><div class="label">Ferramentas</div></div></div>
    <div class="workspace"><section id="homeView" class="view"></section></div><span id="crumb"></span>
    <section id="studentMorePanel"><div class="student-more-grid"></div></section>
    <section id="subjects"><article class="subject" data-id="penal"><div class="cf-module open" data-cf="p3"><div class="cf-module-body"><section class="qc-platform-sharing" data-test-original>Filtro original</section></div></div></article></section>
  </body></html>`, { url: 'https://preview.example.test/central-de-questoes', runScripts: 'outside-only', pretendToBeVisual: true });
  const { window } = dom;
  const data = filterData();
  window.BASE_COMPLETA_USER = { id: `${role}-teste`, role };
  window.QC_CENTRAL_SHARING_LINKS = data.qc;
  window.TEC_PENAL_CPP_LINKS = data.tec;
  window.confirm = () => true;
  window.scrollTo = () => {};
  window.openHome = () => {};
  window.fetch = async (_url, options = {}) => {
    if (options.method === 'PUT') {
      const body = JSON.parse(options.body);
      return { ok: true, json: async () => ({ ok: true, override: { stableKey: body.stableKey, data: body.data, revision: 1 } }) };
    }
    return { ok: true, json: async () => ({ canManage: role === 'admin', overrides }) };
  };
  if (failModuleMount) {
    const append = window.Element.prototype.append;
    window.Element.prototype.append = function (...nodes) {
      if (nodes.some((node) => node?.matches?.('[data-bcq-module-panel]'))) throw new Error('Falha de montagem simulada');
      return append.apply(this, nodes);
    };
  }
  window.eval(source);
  window.document.dispatchEvent(new window.Event('DOMContentLoaded'));
  return dom;
}

const settle = (window) => new Promise((resolve) => window.setTimeout(() => window.requestAnimationFrame(resolve), 20));

test('Central de Questões possui rota nativa e exatamente cinco abas', async () => {
  const dom = setup();
  await settle(dom.window);
  const { document, location } = dom.window;
  assert.equal(location.pathname, '/central-de-questoes');
  assert.deepEqual(Array.from(document.querySelectorAll('[data-bcq-tab]')).map((button) => button.textContent.trim()), [
    'Visão geral', 'Disciplinas', 'Meus filtros', 'Histórico', 'Revisão'
  ]);
  assert.equal(document.querySelector('[data-bcq-more-nav] b').textContent, 'Central de Questões');
  assert.equal(document.querySelectorAll('[data-bcq-panel]').length, 5);
  assert.equal(document.querySelector('[data-bcq-panel="overview"]').hidden, false);
});

test('módulo, biblioteca e histórico usam o mesmo filtro e a mesma sessão', async () => {
  const dom = setup();
  await settle(dom.window);
  const api = dom.window.ExternalQuestionFilters;
  const qc = api.buildRegistry().find((filter) => filter.platform === 'qc');
  api.saveSession(qc, { date: '2026-10-15', answered: 20, correct: 15 });
  await settle(dom.window);
  dom.window.document.querySelector('[data-bcq-tab="history"]').click();
  assert.equal(dom.window.document.querySelector('[data-bcq-module-panel] [data-bcq-platform="qc"] .bcq-ring b').textContent, '75%');
  assert.match(dom.window.document.querySelector('[data-bcq-panel="history"]').textContent, /20 respondidas/);
  assert.match(dom.window.document.querySelector('[data-bcq-panel="history"]').textContent, /75%/);
  assert.ok(dom.window.document.querySelector('[data-bcq-panel="history"] .bcq-evolution-svg'));
  assert.equal(dom.window.document.querySelectorAll('[data-bcq-manage]').length, 0);
});

test('rodapé do módulo preserva o visual aprovado e não repete filtros', async () => {
  const dom = setup();
  await settle(dom.window);
  const panel = dom.window.document.querySelector('[data-bcq-module-panel="penal:M03"]');
  assert.equal(panel.querySelector('.bcq-module-filter-head'), null);
  assert.equal(panel.querySelector('[data-bcq-platform="qc"] .bcq-card-copy b').textContent, 'Teoria do Crime');
  assert.equal(panel.querySelector('[data-bcq-platform="tec"] .bcq-card-copy b').textContent, 'Teoria do Crime');
  assert.doesNotMatch(panel.querySelector('.bcq-card-copy b').textContent, /M03|PEN/);
  assert.equal(panel.querySelectorAll('[data-bcq-key="qc:15288411"]').length, 1);
  assert.equal(panel.querySelectorAll('[data-bcq-key="tec:105849634"]').length, 1);
  assert.equal(dom.window.document.querySelector('[data-test-original]').getAttribute('data-bcq-original'), '1');
  assert.equal(dom.window.document.querySelector('.cf-module-body').getAttribute('data-bcq-module-host'), '1');
  assert.match(styles, /\.bcq-card-copy b\{[^}]*white-space:normal;[^}]*overflow-wrap:anywhere/);
  assert.doesNotMatch(styles, /\.bcq-card-copy b\{[^}]*text-overflow:ellipsis/);
});

test('atualizações externas não remontam nem fazem o painel piscar', async () => {
  const dom = setup();
  await settle(dom.window);
  const firstPanel = dom.window.document.querySelector('[data-bcq-module-panel="penal:M03"]');
  dom.window.document.body.append(dom.window.document.createElement('aside'));
  await settle(dom.window);
  assert.equal(dom.window.document.querySelector('[data-bcq-module-panel="penal:M03"]'), firstPanel);
  assert.equal(dom.window.document.querySelector('[data-test-original]').getAttribute('data-bcq-original'), '1');
});

test('módulo nativo com tópico interno recebe somente um painel QC/TEC', async () => {
  const dom = setup();
  await settle(dom.window);
  dom.window.QC_CENTRAL_SHARING_LINKS.items.push({
    discipline: 'Direito Administrativo', disciplineKey: 'administrativo', code: 'M03', status: 'VALIDADO', public: true,
    moduleTitle: 'Atos Administrativos', title: 'Atos Administrativos', notebookTitle: 'ADM M03 Geral', kind: 'general', id: '15270003', quantity: 90,
    link: 'https://www.qconcursos.com/questoes-de-concursos/questoes?notebook_ids%5B%5D=15270003'
  });
  const subject = dom.window.document.createElement('article');
  subject.className = 'subject'; subject.dataset.id = 'adm';
  subject.innerHTML = '<div class="topic-item open" data-uid="adm-m03"><div class="topic-detail"><div class="detail-panel"><section class="adm-native-zone" data-adm-native="adm-m03"><section class="adm-native-sharing">Filtro original</section></section></div></div></div>';
  dom.window.document.getElementById('subjects').append(subject);
  dom.window.ExternalQuestionFilters.refresh();
  await settle(dom.window);
  assert.equal(subject.querySelectorAll('[data-bcq-module-panel="administrativo:M03"]').length, 1);
  assert.equal(subject.querySelector('[data-adm-native] > [data-bcq-module-panel]')?.dataset.bcqModulePanel, 'administrativo:M03');
  assert.equal(subject.querySelector('.topic-item > [data-bcq-module-panel]'), null);
  assert.equal(subject.querySelector('[data-bcq-platform="qc"] .bcq-card-copy b')?.textContent, 'Atos Administrativos');
});

test('mantém os filtros originais visíveis se o painel compacto não puder ser montado', async () => {
  const dom = setup({ failModuleMount: true });
  await settle(dom.window);
  assert.equal(dom.window.document.querySelector('[data-bcq-module-panel]'), null);
  assert.equal(dom.window.document.querySelector('[data-test-original]').hasAttribute('data-bcq-original'), false);
});

test('catálogo organiza QC e TEC em colunas próprias por módulo', async () => {
  const dom = setup();
  await settle(dom.window);
  dom.window.document.querySelector('[data-bcq-tab="disciplines"]').click();
  const module = dom.window.document.querySelector('.bcq-discipline-module');
  const columns = module.querySelectorAll(':scope > .bcq-discipline-columns > .bcq-discipline-platform');
  assert.equal(columns.length, 2);
  assert.equal(columns[0].dataset.platform, 'qc');
  assert.equal(columns[1].dataset.platform, 'tec');
  assert.match(columns[0].querySelector('header').textContent, /QConcursos/);
  assert.match(columns[1].querySelector('header').textContent, /TEC Concursos/);
  const qcLink = columns[0].querySelector('a.bcq-page-filter');
  const tecLink = columns[1].querySelector('a.bcq-page-filter');
  assert.ok(qcLink, 'o filtro QC deve abrir o caderno correspondente');
  assert.ok(tecLink, 'o filtro TEC deve abrir o caderno correspondente');
  assert.match(qcLink.getAttribute('href'), /notebook_ids/);
  assert.match(tecLink.getAttribute('href'), /^https:\/\/www\.tecconcursos\.com\.br\//);
  assert.equal(qcLink.getAttribute('target'), '_blank');
  assert.equal(tecLink.getAttribute('target'), '_blank');
  assert.match(module.querySelector('.bcq-discipline-module-title').textContent, /M03.*Teoria do Crime/);
  assert.equal(columns[0].querySelector('.bcq-page-filter b').textContent, 'Teoria do Crime');
  assert.doesNotMatch(columns[0].querySelector('.bcq-page-filter b').textContent, /M03|PEN/);
  assert.equal(module.open, false);
  module.querySelector(':scope > summary').click();
  assert.equal(module.open, true);
  dom.window.document.body.addEventListener('click', (event) => event.stopPropagation());
  const toggle = dom.window.document.querySelector('[data-bcq-toggle-disciplines]');
  toggle.click();
  assert.equal(dom.window.document.querySelectorAll('.bcq-discipline[open]').length, 0);
  assert.equal(toggle.textContent, 'Expandir disciplinas');
  toggle.click();
  assert.equal(dom.window.document.querySelectorAll('.bcq-discipline[open]').length, 1);
});

test('somente administrador recebe gestão e sobreposição compartilhada', async () => {
  const override = {
    stableKey: 'qc:15288411', revision: 3,
    data: {
      title: 'Título administrativo validado', count: 130,
      url: 'https://www.qconcursos.com/questoes-de-concursos/questoes?notebook_ids%5B%5D=15288411', status: 'available'
    }
  };
  const dom = setup({ role: 'admin', overrides: [override] });
  await settle(dom.window);
  const filter = dom.window.ExternalQuestionFilters.buildRegistry().find((item) => item.stableKey === override.stableKey);
  assert.equal(filter.title, 'Título administrativo validado');
  assert.equal(filter.count, 130);
  assert.equal(filter.revision, 3);
  assert.equal(dom.window.ExternalQuestionFilters.canManage, true);
  assert.match(dom.window.document.querySelector('[data-bcq-module-panel] [data-bcq-key="qc:15288411"]').textContent, /Título administrativo validado/);
  dom.window.document.querySelector('[data-bcq-tab="filters"]').click();
  assert.ok(dom.window.document.querySelector('[data-bcq-manage="qc:15288411"]'));
});

test('API administrativa valida domínio, quantidade, status e revisão', () => {
  const valid = {
    stableKey: 'qc:15288411', revision: 0,
    data: {
      title: 'Teoria do Crime', count: 127,
      url: 'https://www.qconcursos.com/questoes-de-concursos/questoes?notebook_ids%5B%5D=15288411', status: 'available'
    }
  };
  assert.equal(validateFilterOverride(valid), '');
  assert.match(validateFilterOverride({ ...valid, data: { ...valid.data, url: 'https://example.com/falso' } }), /plataforma/);
  assert.match(validateFilterOverride({ ...valid, data: { ...valid.data, count: 0 } }), /Quantidade/);
  assert.match(validateFilterOverride({ ...valid, data: { ...valid.data, status: 'apagado' } }), /Status/);
  assert.match(validateFilterOverride({ ...valid, revision: -1 }), /Revisão/);
});
