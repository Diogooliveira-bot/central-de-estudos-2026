import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { JSDOM } from 'jsdom';
import { validateFilterOverride } from '../api/external-question-filters.js';

const root = path.resolve(import.meta.dirname, '..');
const source = fs.readFileSync(path.join(root, 'ui/external-question-filters-v1.js'), 'utf8');

function filterData() {
  return {
    qc: { items: [{
      discipline: 'Direito Penal', disciplineKey: 'penal', code: 'M03', status: 'VALIDADO', public: true,
      moduleTitle: 'Teoria do Crime', title: 'Teoria do Crime', kind: 'general',
      id: '15288411', quantity: 127,
      link: 'https://www.qconcursos.com/questoes-de-concursos/questoes?notebook_ids%5B%5D=15288411',
      notebookTitle: 'PEN M03 Teor. Crim.'
    }] },
    tec: { records: [{
      discipline: 'penal', module: 'M03', part: 1, title: 'PENAL M03 Teoria do Crime', id: '105849634',
      quantity: 39, url: 'https://www.tecconcursos.com.br/s/Q7A8KA', status: 'VALIDADO_NA_CONTA_CRIADORA'
    }] }
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

test('rodapé do módulo usa um único título e nomes curtos sem repetir códigos', async () => {
  const dom = setup();
  await settle(dom.window);
  const panel = dom.window.document.querySelector('[data-bcq-module-panel="penal:M03"]');
  const heading = panel.querySelector('.bcq-module-filter-head h3').textContent;
  assert.match(heading, /Direito Penal.*M03.*Teoria do Crime/);
  assert.equal(panel.querySelectorAll('.bcq-module-filter-head').length, 1);
  assert.equal(panel.querySelector('[data-bcq-platform="qc"] .bcq-card-copy b').textContent, 'Filtro geral');
  assert.equal(panel.querySelector('[data-bcq-platform="tec"] .bcq-card-copy b').textContent, 'Filtro geral');
  assert.doesNotMatch(Array.from(panel.querySelectorAll('.bcq-card-copy b')).map((node) => node.textContent).join(' '), /PENAL M03|PEN M03/);
  assert.equal(panel.querySelectorAll('[data-bcq-key="qc:15288411"]').length, 1);
  assert.equal(dom.window.document.querySelector('[data-test-original]').getAttribute('data-bcq-original'), '1');
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
  assert.equal(columns[0].querySelectorAll('[data-bcq-select]').length, 1);
  assert.equal(columns[1].querySelectorAll('[data-bcq-select]').length, 1);
  assert.match(module.querySelector('.bcq-discipline-module-title').textContent, /M03.*Teoria do Crime/);
  assert.equal(columns[0].querySelector('.bcq-page-filter b').textContent, 'Teoria do Crime');
  assert.doesNotMatch(columns[0].querySelector('.bcq-page-filter b').textContent, /M03|PEN/);
  assert.equal(module.open, false);
  module.querySelector(':scope > summary').click();
  assert.equal(module.open, true);
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
