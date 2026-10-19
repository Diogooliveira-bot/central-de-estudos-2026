import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';
import { JSDOM } from 'jsdom';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const source = fs.readFileSync(path.join(root, 'ui/approved-cpc-layout-v1.js'), 'utf8');
const readFocus = ['Distinguir a regra geral', 'Observar a exceção aplicável'];
const weeks = Array.from({ length:20 }, (_, index) => ({
  id:`cpc${index+1}`, num:index+1, title:`Módulo ${index+1}`, read:`Leitura legal M${index+1}`,
  read_focus:readFocus
}));

function fixture() {
  const modules = weeks.map((week, index) => {
    const n = String(index+1).padStart(2, '0');
    const id = week.id;
    const summary = index === 0 ? 'w1' : id;
    return `<section class="cf-module" data-cf="${id}"><div class="cf-module-body">
      <div class="cf-module-bar"><span></span></div><section class="bc-native-metrics"></section>
      <section class="bc-native-materials"><div class="bc-native-materials-head">Materiais</div><div class="bc-native-material-grid">
        <button class="bc-native-material-card" onclick="Reader${n}.open('summary')"><span>⚡</span><span><strong>Conteúdo resumido</strong><small>5 capítulos</small></span><span class="bc-native-material-action">5/5 →</span></button>
        <button class="bc-native-material-card" onclick="Reader${n}.open('complete')"><span>📚</span><span><strong>Conteúdo completo</strong><small>Teoria integral do módulo</small></span><span class="bc-native-material-action">10/12 →</span></button>
        <button class="bc-native-material-card" onclick="Map${n}.open()"><span>🧠</span><span><strong>Mapa mental</strong><small>Carrossel real do módulo</small></span><span class="bc-native-material-action">Abrir →</span></button>
      </div></section>
      <section class="cpc-study-intro"><button onclick="Quiz${n}.open('${summary}','summary')">5 do resumido · 5/5</button><button onclick="Quiz${n}.open('${summary}','full')">10 do completo · 10/10</button></section>
      <div class="cpc-bottom-grid"><button>Lei em Dia</button></div><details class="cf-resources"><div class="cf-resource-box"><textarea id="cf-note-${id}">Nota preservada ${index+1}</textarea></div></details>
    </div></section>`;
  }).join('');
  const dom = new JSDOM(`<!doctype html><html><body><main id="subjects"><section class="subject" data-id="cpc"><div class="subject-body">${modules}</div></section></main></body></html>`, {
    url:'https://central.test/central-v119.html', runScripts:'outside-only', pretendToBeVisual:true
  });
  const { window } = dom;
  window.__CPC_WEEKS = weeks;
  window.cpcWeekState = id => ({ reading:window.readingState?.[id] || false });
  window.readingState = {};
  window.cpcUpdateWeek = (id, patch) => { window.readingState[id] = patch.reading; };
  window.openLeiSecaEnxuta = () => {};
  vm.runInContext(source, dom.getInternalVMContext(), { filename:'cpc-approved-layout-v1.js' });
  return dom;
}

test('padroniza os 20 módulos CPC sem duplicar a leitura e preserva conteúdo e funções', async () => {
  const dom = fixture();
  await new Promise(resolve => dom.window.requestAnimationFrame(() => dom.window.requestAnimationFrame(resolve)));
  const modules = [...dom.window.document.querySelectorAll('.subject[data-id="cpc"] .cf-module')];
  assert.equal(modules.length, 20);
  for (const [index, module] of modules.entries()) {
    const cards = [...module.querySelectorAll('.cpc-approved-card')];
    assert.deepEqual(cards.map(card => card.dataset.cpcApprovedCard), ['complete','summary','map']);
    assert.equal(cards[0].querySelector('h3').textContent, 'Teoria completa');
    assert.equal(cards[0].querySelector('.cpc-approved-primary').textContent, 'Estudar conteúdo');
    assert.equal(cards[0].querySelector('.cpc-approved-secondary').textContent, 'Resolver 10 questões');
    assert.equal(cards[1].querySelector('h3').textContent, 'Versão de revisão');
    assert.equal(cards[1].querySelector('.cpc-approved-primary').textContent, 'Revisar conteúdo');
    assert.equal(cards[1].querySelector('.cpc-approved-secondary').textContent, 'Resolver 5 questões');
    assert.match(cards[2].querySelector('.cpc-approved-primary').textContent, /mapa mental/i);
    assert.match(cards[0].querySelector('.cpc-approved-primary').getAttribute('onclick'), /complete/);
    assert.match(cards[1].querySelector('.cpc-approved-primary').getAttribute('onclick'), /summary/);
    assert.match(cards[2].querySelector('.cpc-approved-primary').getAttribute('onclick'), /Map/);
    assert.equal(module.querySelectorAll('.cpc-approved-reading').length, 1);
    assert.equal(module.querySelectorAll('.cpc-study-intro').length, 0);
    assert.equal(module.querySelector('.cpc-approved-reading p').textContent, `Leitura legal M${index+1}`);
    assert.equal(module.querySelector('#cf-note-cpc' + (index+1)).value, `Nota preservada ${index+1}`);
    module.querySelector('[data-cpc-reading-toggle]').click();
    assert.equal(dom.window.readingState['cpc' + (index+1)], true);
  }
  dom.window.CpcApprovedLayout.refresh();
  assert.equal(dom.window.document.querySelectorAll('.cpc-approved-reading').length, 20);
  dom.window.close();
});
