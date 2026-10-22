import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import vm from 'node:vm';
import { JSDOM } from 'jsdom';
import { renderGuidedM01 } from '../scripts/render-cf-m01-guided.mjs';

const root = path.resolve(import.meta.dirname, '..');
const read = p => fs.readFileSync(path.join(root, p), 'utf8');
function data() {
  const window = {};
  vm.runInNewContext(read('content/cf/m01-native-data.js'), {window});
  return window.BASE_NATIVE_CONTENT.cf.m01;
}
test('M01 conserva identidade, temas, mapa e destino explícito do Lei em Dia', () => {
  const d = data();
  assert.equal(d.moduleId, 'w1');
  assert.equal(d.number, 1);
  assert.equal(d.lawTopicId, 'cf-m01');
  assert.equal(d.mapUrl, '/assets/cf/m01-infografico.webp?v=20261004cfg07v2');
  assert.ok(d.complete.length > 45000);
  assert.ok(d.summary.length > 8000);
  for (const term of ['constitucionalismo', 'Lassalle', 'Schmitt', 'Kelsen', 'Socioideológico', 'Dogmática', 'Supremacia', 'Vigência', 'efetividade', 'eficácia limitada', 'originário', 'decorrente', 'recepção', 'Repristinação', 'Desconstitucionalização', 'Concordância prática', 'Mutação', 'Preâmbulo', 'SO-CI-DI-VA-PLU', 'asilo político']) {
    assert.ok(d.complete.toLowerCase().includes(term.toLowerCase()), term);
  }
  assert.match(d.complete, /CTN/);
  assert.match(d.complete, /ADI 815/);
  assert.match(d.complete, /ADI 2\.076/);
  assert.match(d.complete, /não permanece como uma segunda via ordinária/);
  assert.match(d.complete, /não há sanção ou veto presidencial/);
  assert.match(d.summary, /dignidade|Dignidade/);
});
test('questões de M01 respeitam 4F/4M/2D e 2F/2M/1D, com comentário de cada opção', () => {
  const d = data();
  assert.deepEqual(Array.from(d.questions.complete, q=>q.difficulty), ['Fácil','Fácil','Fácil','Fácil','Média','Média','Média','Média','Difícil','Difícil']);
  assert.deepEqual(Array.from(d.questions.summary, q=>q.difficulty), ['Fácil','Fácil','Média','Média','Difícil']);
  for (const [mode, list] of Object.entries(d.questions)) {
    for (const q of list) {
      assert.ok(q.q.length > 70);
      assert.equal(q.options.length, mode === 'complete' ? 4 : 2);
      assert.ok(q.answer >= 0 && q.answer < q.options.length);
      assert.ok(q.explanation.length > 100);
      assert.doesNotMatch(q.q + q.options.join(' '), /BASE COMPLETA|�/);
      // The native reader shuffles choices. Comments refer to their content,
      // never to fixed display letters that would become incorrect after shuffling.
      assert.doesNotMatch(q.explanation, /\b[A-D] (?:confunde|cria|inventa|troca|muda|atribui|ignora|retira|exige|usa|substitui|exclui|inverte)\b/);
    }
  }
});
test('leitor M01 apresenta comparações legíveis e checklist persistente, isolado de M02', () => {
  const dom = new JSDOM('<!doctype html><head></head><body></body>', {url: 'https://offline.test'});
  const w = dom.window;
  w.CF_WEEKS = [{id:'w1',num:1,title:'M01',read_focus:[]}];
  w.renderSubjects = () => {};
  w.renderAll = () => {};
  let lawArgs;
  w.openLeiSecaEnxuta = (...args) => lawArgs = args;
  const ctx = vm.createContext(w);
  vm.runInContext(read('content/cf/m01-native-data.js'), ctx);
  vm.runInContext(read('ui/cf-native-study-v2.js'), ctx);
  w.CfNativeStudy.openReader(1, 'complete');
  const doc = w.document;
  assert.ok(doc.querySelectorAll('.cf-native-table').length >= 8);
  assert.ok(doc.querySelectorAll('.cf-native-callout.question').length >= 10);
  assert.ok(doc.querySelectorAll('.cf-native-callout.deep').length >= 8);
  for (const table of doc.querySelectorAll('.cf-native-table')) {
    const width = table.querySelectorAll('thead th').length;
    for (const row of table.querySelectorAll('tbody tr')) {
      assert.equal(row.children.length, width);
      for (const cell of row.children) assert.ok(cell.dataset.label && cell.textContent.trim() !== '—');
    }
  }
  const checks = [...doc.querySelectorAll('[data-cf-check]')];
  assert.equal(checks.length, 10);
  checks[0].click();
  assert.equal(doc.querySelector('[data-check-progress]').textContent, '1/10 concluídos');
  assert.ok(w.localStorage.getItem('central-v6:cf-reader-checks:1:complete'));
  assert.equal(w.localStorage.getItem('central-v6:cf-reader-checks:2:complete'), null);
  w.CfNativeStudy.close();
  w.CfNativeStudy.openReader(1, 'complete');
  assert.ok(doc.querySelector('[data-cf-check]').checked);
  for (const box of doc.querySelectorAll('[data-cf-check]:not(:checked)')) box.click();
  assert.equal(doc.querySelector('[data-check-progress]').textContent, '10/10 concluídos');
  assert.ok(doc.querySelector('[data-checklist]').classList.contains('complete'));
  doc.querySelector('[data-cf-check]').click();
  assert.equal(doc.querySelector('[data-check-progress]').textContent, '9/10 concluídos');
  w.CfNativeStudy.openReader(1, 'summary');
  assert.equal(doc.querySelectorAll('[data-cf-check]').length, 10);
  assert.equal(doc.querySelectorAll('[data-cf-check]:checked').length, 0);
  w.CfNativeStudy.openDecorando(1);
  assert.deepEqual(lawArgs, [null, 'cf', 'cf-m01']);
  w.close();
});
test('M01 não perde referências de cache na integração local', () => {
  const asset = '/content/cf/m01-native-data.js?v=20261022cfm01m05apostila1';
  assert.ok(read('index.html').includes(`src="${asset}"`));
  assert.ok(JSON.parse(read('central-offline-files-v66172.json')).files.includes(asset));
});

function guided(seed = {}) {
  const html = renderGuidedM01({source:read('content/cf/editorial/m01-didatico.md'),module:data(),css:read('content/cf/editorial/guided-m02.css')});
  return new JSDOM(html, {url:'https://offline.test',runScripts:'dangerously',beforeParse(w){for(const [k,v] of Object.entries(seed))w.localStorage.setItem(k,v)}});
}
test('M01 repete o design e a sequência pedagógica do M02 guiado', () => {
  const dom=guided(),d=dom.window.document;
  assert.ok(d.querySelector('style').textContent.startsWith(read('content/cf/editorial/guided-m02.css').replaceAll('CF M02','CF M01')));
  assert.equal(d.querySelectorAll('.chapter').length,10);
  for(const theme of d.querySelectorAll('.chapter')) {
    assert.deepEqual([...theme.querySelectorAll(':scope > .box')].map(b=>b.className), ['box core','box explain','box example','box law','box deep','box trap','box recap','box test']);
    assert.ok(theme.querySelector('.test details summary'));
    assert.equal(theme.querySelector('.test details').open,false);
    assert.ok(theme.querySelector('.chaptercheck'));
  }
  assert.equal(d.querySelectorAll('.extraCheck').length,10);
  assert.equal(d.querySelectorAll('[data-question]').length,15);
  assert.equal(d.querySelectorAll('.cf-native-overlay').length,0);
  assert.equal(d.querySelectorAll('script[src]').length,0);
  dom.window.close();
});
test('reorganização visual conserva cada parágrafo das aulas e da leitura jurídica', () => {
  const dom=guided(),body=dom.window.document.body.textContent.replace(/\s+/g,' ');
  const source=read('content/cf/editorial/m01-didatico.md');
  const core=source.slice(source.indexOf('# 1. Para'),source.indexOf('# 12. Dez'));
  for(const block of core.split(/\n\n+/)) {
    if(!block.trim()||block.startsWith('#'))continue;
    const plain=block.replace(/^(Exemplo explicado|Caso de comparação|Caso resolvido|Aprofundamento|Teste de compreensão|Resposta comentada|Guarde o essencial)\.\s*/,'');
    if(plain.startsWith('|')) {
      for(const row of plain.split('\n'))for(const cell of row.split('|').map(c=>c.trim()).filter(c=>c&&!/^:?-+:?$/.test(c)))assert.ok(body.includes(cell),cell);
    } else assert.ok(body.includes(plain.replace(/\s+/g,' ')),plain.slice(0,100));
  }
  dom.window.close();
});
test('primeira leitura e revisão rápida mantêm as marcações e não alteram M02', () => {
  let dom=guided({'basecompleta-cf-m02-piloto-v1':'{"tema-01":true}'}),w=dom.window,d=w.document;
  d.querySelector('.chaptercheck').click();d.querySelector('.extraCheck').click();
  d.querySelector('#modeReview').click();
  assert.ok(d.body.classList.contains('review-only'));
  assert.equal(w.getComputedStyle(d.querySelector('.chapter .explain')).display,'none');
  assert.notEqual(w.getComputedStyle(d.querySelector('.chapter .law')).display,'none');
  assert.equal(d.querySelector('#progressLabel').textContent,'1 de 10 temas concluídos');
  assert.equal(d.querySelector('#finalLabel').textContent,'1 de 10 marcados no checklist');
  const saved=w.localStorage.getItem('basecompleta-cf-m01-guiada-v2');
  assert.equal(w.localStorage.getItem('basecompleta-cf-m02-piloto-v1'),'{"tema-01":true}');
  w.close();dom=guided({'basecompleta-cf-m01-guiada-v2':saved});d=dom.window.document;
  assert.ok(d.querySelector('.chaptercheck').checked);
  assert.ok(d.querySelector('.extraCheck').checked);
  assert.ok(d.body.classList.contains('review-only'));
  d.querySelector('#modeFull').click();
  assert.equal(d.body.classList.contains('review-only'),false);
  dom.window.close();
});
test('questões continuam respondíveis e comentários não exigem letras embaralhadas', () => {
  const dom=guided(),d=dom.window.document;
  const q=d.querySelector('[data-question]');
  q.querySelector('[data-verify]').click();
  assert.match(q.querySelector('[data-feedback]').textContent,/Escolha/);
  q.querySelector(`input[value="${q.dataset.answer}"]`).click();
  q.querySelector('[data-verify]').click();
  assert.match(q.querySelector('[data-feedback]').textContent,/Correto/);
  assert.ok(q.querySelector('details').open);
  assert.match(dom.window.localStorage.getItem('basecompleta-cf-m01-guiada-v2'),/answer-complete-0/);
  dom.window.close();
});
