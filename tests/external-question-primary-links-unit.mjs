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

test('um caderno geral supera subdivisões, mesmo com menos questões', () => {
  const dom = setup();
  const { selectPreferredModuleFilters: select } = dom.window.ExternalQuestionFilters;
  const general = filter('qc', 'penal', 'M03', 'M03', '100', 12, 'Teoria do Crime');
  const subdivision = filter('qc', 'penal', 'M03', 'M03.1', '101', 300, 'Conceito de crime');
  assert.deepEqual(select([subdivision, general]).map((item) => item.id), ['100']);
  dom.window.close();
});

test('exceção de duas partes distintas, mas nunca mais de duas por plataforma/módulo', () => {
  const dom = setup();
  const { selectPreferredModuleFilters: select } = dom.window.ExternalQuestionFilters;
  const items = [
    filter('tec', 'penal', 'M07', 'M07.1', '101', 11, 'Concurso de crimes | Parte 1: Concurso de Crimes', 'tec-penal-cpp-curated'),
    filter('tec', 'penal', 'M07', 'M07.2', '102', 43, 'Concurso de crimes | Parte 2: Penas', 'tec-penal-cpp-curated'),
    filter('tec', 'penal', 'M07', 'M07.3', '103', 50, 'Outro assunto', 'tec-penal-cpp-curated'),
    filter('qc', 'penal', 'M07', 'M07', '201', 200, 'Concurso de crimes', 'qc-central'),
    filter('qc', 'penal', 'M07', 'M07.1', '202', 500, 'Penas', 'qc-central')
  ];
  const selected = select(items);
  assert.deepEqual(selected.filter((item) => item.platform === 'tec').map((item) => item.id), ['101', '102']);
  assert.deepEqual(selected.filter((item) => item.platform === 'qc').map((item) => item.id), ['201']);
  dom.window.close();
});

test('RLM preserva duas áreas editoriais comprovadas; demais subdivisões sem geral ficam em uma', () => {
  const dom = setup();
  const { selectPreferredModuleFilters: select } = dom.window.ExternalQuestionFilters;
  const items = [
    filter('tec', 'rlm', 'M04', 'M04', '1', 214, 'Argumentação', 'tec-rlm-curated'),
    filter('tec', 'rlm', 'M04', 'M04', '2', 46, 'Problemas especiais', 'tec-rlm-curated'),
    filter('qc', 'rlm', 'M04', 'M04.1', '3', 9, 'Parte temática A'),
    filter('qc', 'rlm', 'M04', 'M04.2', '4', 20, 'Parte temática B')
  ];
  const selected = select(items);
  assert.deepEqual(selected.filter((item) => item.platform === 'tec').map((item) => item.id), ['1', '2']);
  assert.deepEqual(selected.filter((item) => item.platform === 'qc').map((item) => item.id), ['4']);
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
