import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { JSDOM } from 'jsdom';

const source = await readFile(new URL('../ui/discipline-standard.js', import.meta.url), 'utf8');

function setup() {
  const dom = new JSDOM(`<!doctype html><html><body><section id="subjects">
    <section class="subject" data-id="civil"><header class="subject-name">Direito Civil</header><div class="subject-body"><article class="cv-module" data-civil-native-module="1"><button class="cv-module-head">M01</button><div class="cv-module-body"><div class="cv-cards"><article class="cv-card" id="summary">Versão resumida</article><article class="cv-card" id="complete">Versão completa</article><article class="cv-card" id="map">Infográfico</article></div></div></article></div></section>
    <section class="subject" data-id="adm"><header class="subject-name">Direito Administrativo</header><div class="subject-body"><article class="topic-item" data-uid="M01"><button class="topic-row">M01</button><div class="detail-panel"><section class="adm-native-zone"><div class="adm-native-module-tools" id="adm-tools">Recursos adicionais</div><div class="adm-native-material-grid"><article class="adm-native-card" id="adm-summary">RESUMO</article><article class="adm-native-card" id="adm-complete">TEORIA COMPLETA</article><article class="adm-native-card" id="adm-map">VISUAL REAL Infográfico</article></div><section class="adm-native-sharing" id="adm-valid-sharing">Links válidos</section></section><section class="adm-native-preserved" id="adm-legacy-tec">Filtro do TEC deste módulo</section><section class="adm-native-preserved adm-native-external-entry" id="adm-legacy-form">Registrar questões externas</section><section class="adm-native-notes" id="adm-notes">Anotações preservadas</section></div></article></div></section>
    <section class="subject" data-id="ptra"><header class="subject-name">Direito Processual do Trabalho</header><div class="subject-body"><div class="ptra-native-intro">Trilha oficial preservada</div><header class="ds-course-intro"><h3>Introdução duplicada</h3></header><section class="ptra-native-mod" data-ptra-module="1"><button class="ptra-native-mod-head">M01</button><div class="ptra-native-mod-body"><div class="ptra-native-zone"><div class="ptra-native-card-grid"><article class="ptra-native-card" id="ptra-summary">VERSÃO RESUMIDA</article><article class="ptra-native-card" id="ptra-complete">VERSÃO COMPLETA</article><article class="ptra-native-card" id="ptra-map">INFOGRÁFICO / MAPA VISUAL</article></div></div></div></section></div></section>
    <section class="subject" data-id="rlm"><header class="subject-name">RLM</header><div class="subject-body"><div class="bc-rlm-intro">Matriz TJCE preservada</div><header class="ds-course-intro"><h3>Introdução duplicada</h3></header><section class="cf-module" data-rlm-module="M01"><button class="cf-module-head">M01</button><div class="cf-module-body"><div class="bc-native-material-grid"><button id="speed" class="bc-native-material-card">Treino de velocidade</button><button id="rlm-complete" class="bc-native-material-card">Teoria completa</button></div></div></section><section class="cf-module" data-rlm-module="M02"><button class="cf-module-head">M02</button><div class="cf-module-body"><div class="bc-native-material-grid"><button id="rlm-summary" class="bc-native-material-card">Conteúdo resumido</button><button id="rlm-main" class="bc-native-material-card">Teoria completa</button></div></div></section></div></section>
  </section></body></html>`, { url: 'https://preview.example.test/central-v119.html', runScripts: 'outside-only', pretendToBeVisual: true });
  dom.window.BASE_COMPLETA_USER = { id:'preview-guest', role:'aluno' };
  dom.window.requestAnimationFrame = (fn) => dom.window.setTimeout(fn, 0);
  dom.window.eval(source);
  dom.window.CentralDisciplineStandard.refresh();
  return dom;
}

test('cartões dos renderizadores adicionais ficam em ordem comum sem trocar seus elementos', () => {
  const dom = setup();
  const { document } = dom.window;
  for (const selector of ['.cv-cards','.adm-native-material-grid','.ptra-native-card-grid','.subject[data-id="rlm"] [data-rlm-module="M02"] .bc-native-material-grid']) {
    const container = document.querySelector(selector);
    assert.ok(container.classList.contains('ds-study-material-grid'));
    const cards = Array.from(container.children);
    assert.equal(cards[0].dataset.dsMaterialKind, 'complete');
    assert.equal(cards[1].dataset.dsMaterialKind, 'summary');
    if (cards[2]) assert.equal(cards[2].dataset.dsMaterialKind, 'infographic');
  }
  assert.equal(document.querySelector('#complete'), document.querySelector('.cv-cards').firstElementChild);
  assert.equal(document.querySelector('#adm-complete'), document.querySelector('.adm-native-material-grid').firstElementChild);
  assert.equal(document.querySelector('#ptra-complete'), document.querySelector('.ptra-native-card-grid').firstElementChild);
  dom.window.close();
});

test('RLM M01 mantém ordem e handlers originais', () => {
  const dom = setup();
  const container = dom.window.document.querySelector('[data-rlm-module="M01"] .bc-native-material-grid');
  assert.equal(container.classList.contains('ds-study-material-grid'), false);
  assert.equal(container.firstElementChild.id, 'speed');
  const m02 = dom.window.document.querySelector('[data-rlm-module="M02"] .bc-native-material-grid');
  let clicked = false;
  const complete = dom.window.document.getElementById('rlm-main');
  complete.addEventListener('click', () => { clicked = true; });
  complete.click();
  assert.equal(clicked, true);
  assert.equal(m02.firstElementChild, complete);
  assert.equal(dom.window.document.querySelector('[data-rlm-module="M02"] .ds-module-footer'), null);
  assert.equal(dom.window.document.querySelector('[data-rlm-module="M02"] .ds-module-nav'), null);
  dom.window.close();
});

test('introduções nativas de RLM e PTRA substituem a faixa genérica duplicada', () => {
  const dom = setup();
  for (const id of ['rlm','ptra']) {
    const subject = dom.window.document.querySelector(`.subject[data-id="${id}"]`);
    assert.equal(subject.querySelector('.ds-course-intro'), null);
  }
  assert.ok(dom.window.document.querySelector('.ptra-native-intro'));
  assert.ok(dom.window.document.querySelector('.bc-rlm-intro'));
  dom.window.close();
});

test('ADM remove painéis legados duplicados e mantém filtro vinculado, nota e dados armazenados', () => {
  const dom = setup();
  const { document, localStorage } = dom.window;
  localStorage.setItem('central-v6:module-rounds:adm:M01', JSON.stringify([{valid:8,correct:6}]));
  assert.equal(document.getElementById('adm-legacy-tec'), null);
  assert.equal(document.getElementById('adm-legacy-form'), null);
  assert.ok(document.getElementById('adm-valid-sharing'));
  assert.ok(document.getElementById('adm-notes'));
  const order = Array.from(document.querySelector('.adm-native-zone').children).map(node => node.id || node.className);
  assert.ok(order.indexOf('adm-native-material-grid') < order.indexOf('adm-notes'));
  assert.ok(order.indexOf('adm-notes') < order.indexOf('adm-valid-sharing'));
  assert.ok(order.indexOf('adm-valid-sharing') < order.indexOf('adm-tools'));
  assert.equal(localStorage.getItem('central-v6:module-rounds:adm:M01'), JSON.stringify([{valid:8,correct:6}]));
  dom.window.close();
});
