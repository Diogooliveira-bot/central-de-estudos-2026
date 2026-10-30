import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';
import { JSDOM } from 'jsdom';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const source = fs.readFileSync(path.join(root, 'ui/discipline-standard.js'), 'utf8');
const readFocus = ['Distinguir a regra geral', 'Observar a exceção aplicável'];
const weeks = Array.from({ length:20 }, (_, index) => ({
  id:`cpc${index+1}`, num:index+1, title:`Módulo ${index+1}`, read:`Leitura legal M${index+1}`,
  read_focus:readFocus
}));

function fixture(emptyQuestions = false, questionLabelsWithoutTotals = false, validatedPoolSize = 0) {
  const modules = weeks.map((week, index) => {
    const n = String(index+1).padStart(2, '0');
    const id = week.id;
    const summary = index === 0 ? 'w1' : id;
    return `<section class="cf-module" data-cf="${id}"><div class="cf-module-body">
      <div class="cf-module-bar"><span></span></div><section class="bc-native-metrics"></section>
      <section class="bc-native-materials"><div class="bc-native-materials-head">Materiais</div><div class="bc-native-material-grid">
        <button class="bc-native-material-card" onclick="Reader${n}.open('summary')"><span>⚡</span><span><strong>Conteúdo resumido</strong><small>5 capítulos</small></span><span class="bc-native-material-action">5/5 →</span></button>
        <button class="bc-native-material-card" onclick="Reader${n}.open('complete')"><span>📚</span><span><strong>Conteúdo completo</strong><small>Teoria integral do módulo</small></span><span class="bc-native-material-action">10/12 →</span></button>
        ${index === 7 ? '' : `<button class="bc-native-material-card" onclick="Map${n}.open()"><span>🧠</span><span><strong>Mapa mental</strong><small>Carrossel real do módulo</small></span><span class="bc-native-material-action">Abrir →</span></button>`}
      </div></section>
        <section class="cpc-study-intro"><button onclick="${index >= 6 && index <= 16 ? `startCpcQuiz('${id}','intermediate',5)` : `Quiz${n}.open('${summary}','summary')`}">5 do resumido · ${emptyQuestions ? '0/0' : questionLabelsWithoutTotals ? '' : '5/5'}</button><button onclick="${index >= 6 && index <= 16 ? `startCpcQuiz('${id}','fixation',10)` : `Quiz${n}.open('${summary}','full')`}">10 do completo · ${emptyQuestions ? '0/0' : questionLabelsWithoutTotals ? '' : '10/10'}</button></section>
      <div class="cpc-bottom-grid"><button>Lei em Dia</button><section class="cpc-mini-panel"><h3>Questões externas</h3><div class="cpc-external-form"><label>Feitas<input id="cpc-ext-done-w${index+1}" value="4"></label><label>Acertos<input id="cpc-ext-correct-w${index+1}" value="3"></label><button>Salvar</button></div></section></div><details class="cf-resources"><div class="cf-resource-box"><textarea id="cf-note-${id}">Nota preservada ${index+1}</textarea></div></details>
    </div></section>`;
  }).join('');
  const dom = new JSDOM(`<!doctype html><html><body><main id="subjects"><section class="subject" data-id="cpc"><div class="subject-body">${modules}</div></section></main></body></html>`, {
    url:'https://central.test/central-v119.html', runScripts:'outside-only', pretendToBeVisual:true
  });
  const { window } = dom;
  window.__CPC_WEEKS = weeks;
  if (validatedPoolSize) {
    window.__cpcPool = () => Array.from({length:validatedPoolSize}, (_,i) => ({
      id:'verified-'+i, q:'Pergunta validada '+i, o:['A','B','C','D'], a:0
    }));
  }
  window.cpcWeekState = id => ({ reading:window.readingState?.[id] || false });
  window.readingState = {};
  window.cpcUpdateWeek = (id, patch) => { window.readingState[id] = patch.reading; };
  window.openLeiSecaEnxuta = () => {};
  vm.runInContext(source, dom.getInternalVMContext(), { filename:'discipline-standard.js' });
  for (const module of dom.window.document.querySelectorAll('.cf-module[data-cf]')) dom.window.CentralDisciplineStandard.cpcApprovedLayout(module);
  return dom;
}

test('padroniza os 20 módulos CPC sem duplicar a leitura e preserva conteúdo e funções', async () => {
  const dom = fixture();
  await new Promise(resolve => dom.window.requestAnimationFrame(() => dom.window.requestAnimationFrame(resolve)));
  const modules = [...dom.window.document.querySelectorAll('.subject[data-id="cpc"] .cf-module')];
  assert.equal(modules.length, 20);
  for (const [index, module] of modules.entries()) {
    const cards = [...module.querySelectorAll('.cpc-approved-card')];
    assert.deepEqual(cards.map(card => card.dataset.cpcApprovedCard), index === 7 ? ['complete','summary'] : ['complete','summary','map']);
    assert.equal(cards[0].querySelector('h3').textContent, 'Teoria completa');
    assert.equal(cards[0].querySelector('.cpc-approved-primary').textContent, 'Estudar conteúdo');
    assert.equal(cards[0].querySelector('.cpc-approved-secondary').textContent, 'Resolver 10 questões');
    assert.equal(cards[1].querySelector('h3').textContent, 'Versão de revisão');
    assert.equal(cards[1].querySelector('.cpc-approved-primary').textContent, 'Revisar conteúdo');
    assert.equal(cards[1].querySelector('.cpc-approved-secondary').textContent, 'Resolver 5 questões');
    assert.match(cards[0].querySelector('.cpc-approved-primary').getAttribute('onclick'), /complete/);
    assert.match(cards[1].querySelector('.cpc-approved-primary').getAttribute('onclick'), /summary/);
    if (index !== 7) {
      assert.match(cards[2].querySelector('.cpc-approved-primary').textContent, /mapa mental/i);
      assert.match(cards[2].querySelector('.cpc-approved-primary').getAttribute('onclick'), /Map/);
    }
    assert.equal(module.querySelectorAll('.cpc-approved-reading').length, 1);
    assert.equal(module.querySelectorAll('.cpc-study-intro').length, 0);
    assert.equal(module.querySelector('.bc-native-metrics'), null, 'o painel nativo duplicado não aparece no corpo do módulo');
    const progress = module.querySelector('.cpc-approved-progress');
    assert.ok(progress, 'as duas barras de progresso CPC aparecem no módulo');
    assert.equal(progress.querySelectorAll('[role="progressbar"]').length, 2);
    assert.match(progress.textContent, /Progresso da teoria/);
    assert.match(progress.textContent, /Questões externas/);
    assert.equal(module.querySelector('.cpc-mini-panel .cpc-external-form'), null, 'o formulário manual externo é removido da interface');
    assert.equal(module.querySelectorAll('.cpc-bottom-grid button').length, 1, 'Lei em Dia continua acessível');
    assert.equal(module.querySelector('.cpc-approved-reading [data-cpc-law]'), null, 'o link de Lei em Dia permanece no card próprio, sem duplicar na leitura');
    assert.equal(module.querySelector('.cpc-bottom-grid button').textContent, 'Lei em Dia', 'o vínculo nativo de Lei em Dia permanece disponível');
    assert.equal(module.querySelector('.cpc-approved-reading p').textContent, `Leitura legal M${index+1}`);
    assert.equal(module.querySelector('#cf-note-cpc' + (index+1)).value, `Nota preservada ${index+1}`);
    module.querySelector('[data-cpc-reading-toggle]').click();
    assert.equal(dom.window.readingState['cpc' + (index+1)], true);
  }
  dom.window.CentralDisciplineStandard.refresh();
  assert.equal(dom.window.document.querySelectorAll('.cpc-approved-reading').length, 20);
  dom.window.close();
});

test('não anuncia quantidades quando a bateria real não tem questões', async () => {
  const dom = fixture(true);
  await new Promise(resolve => dom.window.requestAnimationFrame(() => dom.window.requestAnimationFrame(resolve)));
  const questions = [...dom.window.document.querySelectorAll('.cpc-approved-card .cpc-approved-secondary')];
  assert.equal(questions.length, 40);
  assert.ok(questions.every(button => button.disabled && button.textContent === 'Questões internas indisponíveis'));
  dom.window.close();
});

test('usa o banco validado para habilitar as baterias CPC M07–M17 sem depender do rótulo 0/0', async () => {
  const dom = fixture(false,true);
  await new Promise(resolve => dom.window.requestAnimationFrame(() => dom.window.requestAnimationFrame(resolve)));
  for (let index=0;index<20;index++) {
    const module=dom.window.document.querySelector(`.cf-module[data-cf="cpc${index+1}"]`);
    const buttons=[...module.querySelectorAll('.cpc-approved-card .cpc-approved-secondary')];
    const available=index>=6&&index<=16;
    assert.equal(buttons[0].textContent,available?'Resolver 10 questões':'Questões internas indisponíveis');
    assert.equal(buttons[1].textContent,available?'Resolver 5 questões':'Questões internas indisponíveis');
    assert.equal(buttons.every(button=>button.disabled),!available);
  }
  dom.window.close();
});

test('reconhece banco CPC validado apesar de contador visual inicial 0/0', async () => {
  const dom = fixture(true,false,15);
  await new Promise(resolve => dom.window.requestAnimationFrame(() => dom.window.requestAnimationFrame(resolve)));
  const module = dom.window.document.querySelector('.cf-module[data-cf="cpc1"]');
  const buttons = [...module.querySelectorAll('.cpc-approved-card .cpc-approved-secondary')];
  assert.deepEqual(buttons.map(button => button.textContent), ['Resolver 10 questões','Resolver 5 questões']);
  assert.ok(buttons.every(button => !button.disabled));
  dom.window.close();
});

test('não habilita questionário completo com banco validado insuficiente', async () => {
  const dom = fixture(true,false,5);
  await new Promise(resolve => dom.window.requestAnimationFrame(() => dom.window.requestAnimationFrame(resolve)));
  const module = dom.window.document.querySelector('.cf-module[data-cf="cpc1"]');
  const buttons = [...module.querySelectorAll('.cpc-approved-card .cpc-approved-secondary')];
  assert.deepEqual(buttons.map(button => button.textContent), ['Questões internas indisponíveis','Resolver 5 questões']);
  assert.equal(buttons[0].disabled,true);
  assert.equal(buttons[1].disabled,false);
  dom.window.close();
});
