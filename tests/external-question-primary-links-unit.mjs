import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { JSDOM } from 'jsdom';

const root = path.resolve(import.meta.dirname, '..');
const script = fs.readFileSync(path.join(root, 'ui/external-question-filters-v1.js'), 'utf8');

function setup(items = []) {
  const dom = new JSDOM(
    '<!doctype html><html><body><div class="workspace"><section id="homeView" class="view"></section></div><section id="subjects"></section></body></html>',
    { url: 'https://preview.example.test/central-v119.html', runScripts: 'outside-only', pretendToBeVisual: true }
  );
  const { window } = dom;
  window.scrollTo = () => {};
  window.QC_CENTRAL_SHARING_LINKS = {
    items: items.map((item) => ({
      discipline: 'Direito Penal', disciplineKey: 'penal', code: item.code,
      title: item.title, id: item.id, quantity: item.count, kind: item.kind || 'subdivision',
      status: 'VALIDADO', public: true,
      link: 'https://www.qconcursos.com/questoes-de-concursos/questoes?notebook_ids%5B%5D=' + item.id
    }))
  };
  window.eval(script);
  window.document.dispatchEvent(new window.Event('DOMContentLoaded'));
  return dom;
}

function filter(platform, disciplineKey, module, code, id, count, title, source = 'qc-central') {
  return {
    platform, disciplineKey, module, code, id, count, title, source,
    stableKey: platform + ':' + id, status: 'available'
  };
}

test('filtro geral com 20+ questões prevalece; geral abaixo do mínimo é descartado', () => {
  const dom = setup();
  const { selectPreferredModuleFilters: select } = dom.window.ExternalQuestionFilters;
  const general = filter('qc', 'penal', 'M03', 'M03', '100', 20, 'Teoria do Crime');
  const subdivision = filter('qc', 'penal', 'M03', 'M03.1', '101', 300, 'Conceito de crime');
  assert.deepEqual(select([subdivision, general]).map((item) => item.id), ['100']);
  assert.deepEqual(select([subdivision, { ...general, count: 19 }]).map((item) => item.id), ['101']);
  dom.window.close();
});

test('somente QC com 20+ questões; 1 filtro por módulo, mesmo quando havia diversos TEC', () => {
  const dom = setup();
  const { selectPreferredModuleFilters: select } = dom.window.ExternalQuestionFilters;
  const items = [
    filter('tec', 'penal', 'M07', 'M07.1', '101', 80, 'Concurso de crimes'),
    filter('tec', 'penal', 'M07', 'M07.2', '102', 90, 'Penas'),
    filter('qc', 'penal', 'M07', 'M07', '201', 25, 'Concurso de crimes'),
    filter('qc', 'penal', 'M07', 'M07.1', '202', 500, 'Penas')
  ];
  assert.deepEqual(select(items).map((item) => item.id), ['201']);
  assert.deepEqual(select(items.map((item) => ({ ...item, count: item.platform === 'qc' ? 19 : item.count }))), []);
  dom.window.close();
});

test('exatamente dois somente quando os recortes QC complementares foram revisados', () => {
  const dom = setup();
  const { selectPreferredModuleFilters: select } = dom.window.ExternalQuestionFilters;
  const group = [
    filter('qc', 'penal', 'M05', 'M05', '100', 19, 'Culpabilidade e Teoria do Erro'),
    filter('qc', 'penal', 'M05', 'M05.1', '101', 43, 'Culpabilidade e imputabilidade'),
    filter('qc', 'penal', 'M05', 'M05.2', '102', 32, 'Erro penal'),
    filter('qc', 'penal', 'M05', 'M05.3', '103', 100, 'Outro recorte')
  ];
  assert.deepEqual(select(group).map((item) => item.id), ['101', '102']);
  assert.deepEqual(select(group.map((item) => item.id === '102' ? { ...item, count: 19 } : item)).map((item) => item.id), ['103'], 'sem o segundo complemento, prioriza somente o maior');
  assert.deepEqual(select(group.map((item) => item.id === '100' ? { ...item, count: 20 } : item)).map((item) => item.id), ['100'], 'geral adequado prevalece');
  dom.window.close();
});

test('nenhum caderno QC com menos de 20 questões é exibido, mesmo que seja o único do módulo', () => {
  const dom = setup();
  const { selectPreferredModuleFilters: select } = dom.window.ExternalQuestionFilters;
  const items = [
    filter('qc', 'rlm', 'M15', 'M15', '3', 11, 'Desvio padrão'),
    filter('qc', 'rlm', 'M11', 'M11', '4', 20, 'Proporcionalidade'),
    filter('qc', 'rlm', 'M11', 'M11.1', '5', 25, 'Regra de três')
  ];
  assert.deepEqual(select(items).map((item) => item.id), ['4']);
  dom.window.close();
});

test('registro integral e histórico antigos sobrevivem à simplificação visual', () => {
  const dom = setup([
    { code: 'M03', title: 'Teoria do Crime', id: '15288411', count: 127, kind: 'general' },
    { code: 'M03.1', title: 'Conceito de Crime', id: '15288415', count: 35 },
    { code: 'M03.2', title: 'Conduta', id: '15288419', count: 31 }
  ]);
  const { window } = dom;
  const api = window.ExternalQuestionFilters;
  const all = api.buildRegistry();
  assert.equal(all.length, 3);
  assert.deepEqual(api.visibleModuleFilters().map((item) => item.id), ['15288411']);
  api.saveSession(all[1], { date: '2026-11-12', answered: 20, correct: 15 });
  assert.equal(api.sessionsFor(all[1]).length, 1);
  assert.equal(api.statsFor(all[1]).percent, 75);
  assert.equal(api.visibleModuleFilters().length, 1);
  dom.window.close();
});

test('auditoria integral: no máximo 2 filtros por módulo, 20+ questões, títulos completos', () => {
  const dom = setup();
  const { window } = dom;
  const read = (name) => fs.readFileSync(path.join(root, name), 'utf8');
  window.eval(read('content/qc-sharing-links.js'));
  window.eval(read('content/cpc/cpc-sharing-links.js'));
  window.eval(read('content/questoes/titulos.js'));
  const api = window.ExternalQuestionFilters;
  const all = api.buildRegistry().filter((item) => item.platform === 'qc');
  assert.equal(all.length, 431, 'catálogo bruto não é eliminado');
  const chosen = api.visibleModuleFilters();
  assert.equal(chosen.length, 110);
  assert.ok(chosen.every((row) => row.platform === 'qc' && row.count >= 20 && row.status === 'available'));
  const groups = new Map();
  for (const row of chosen) {
    const key = row.disciplineKey + '|' + row.module;
    groups.set(key, (groups.get(key) || []).concat(row));
  }
  assert.equal(groups.size, 108);
  assert.ok([...groups.values()].every((rows) => rows.length <= 2));
  assert.deepEqual([...groups.entries()].filter(([, rows]) => rows.length === 2).map(([key]) => key).sort(),
    ['penal|M05', 'processual-penal|M03']);
  for (const row of chosen) {
    const title = api.catalogFilterTitle(row);
    assert.ok(title.length > 4, row.stableKey);
    assert.doesNotMatch(title, /^(?:DP|DPP|PC)\\s+M\\d+/i, row.stableKey);
    assert.doesNotMatch(title, /(?:imput|garanti|processu|recurs|descrimi|patrimô)$/, row.stableKey);
  }
  assert.equal(api.catalogFilterTitle(chosen.find((row) => row.disciplineKey === 'penal' && row.module === 'M07')), 'Concurso de Crimes e Penas');
  assert.equal(api.catalogFilterTitle(chosen.find((row) => row.disciplineKey === 'processual-civil' && row.module === 'M01')), 'Normas fundamentais, fontes, aplicação e direito intertemporal');
  assert.equal(api.catalogFilterTitle(chosen.find((row) => row.disciplineKey === 'processual-penal' && row.module === 'M15')), 'Processo Comum — Procedimentos ordinário e sumário');
  dom.window.close();
});
