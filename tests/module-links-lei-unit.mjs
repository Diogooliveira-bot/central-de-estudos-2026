import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { JSDOM } from 'jsdom';

const read = path => fs.readFileSync(new URL('../' + path, import.meta.url), 'utf8');
const panel = key => `<div class="bcq-module-panels" data-bcq-module-panel="${key}"><a href="https://www.tecconcursos.com.br/s/abc">TEC</a></div>`;

function setup(html) {
  const dom = new JSDOM('<!doctype html><div id="subjects">' + html + '</div>', { url: 'https://study.test/', runScripts: 'dangerously' });
  dom.window.requestAnimationFrame = callback => callback();
  dom.window.eval(read('ui/module-links-lei-v1.js'));
  dom.window.CentralModuleLinksLei.refresh();
  return dom;
}
function order(container) {
  return [...container.children].map(node =>
    node.matches('[data-bc-module-links]') ? 'links'
      : /lei em dia/i.test(node.textContent) && !node.matches('.notes') ? 'lei'
        : node.dataset.role || node.className.split(' ')[0]);
}

test('Constitucional: revisão, teoria completa, Lei em Dia do módulo e links', () => {
  const dom = setup('<section class="subject" data-id="cf"><section class="cf-module" data-cf="w1"><div class="cf-module-body">'
    + '<section class="cf-native-cards"><article class="cf-study-card cf-study-review" data-role="review">Versão de revisão</article><article class="cf-study-card cf-study-primary" data-role="complete">Teoria completa</article><article class="cf-study-card cf-study-law"><b>Lei em Dia</b><button onclick="CfNativeStudy.openDecorando(1)">Abrir Lei em Dia</button></article></section>'
    + '<section class="cf-native-note notes">Anotações</section>' + panel('constitucional:M01')
    + '<section class="ds-module-footer"><section class="resource ds-footer-tools"><div class="chips"><button>📖 Lei em Dia</button><button>⚖ Vade Mecum</button></div></section></section>'
    + '</div></section></section>');
  const d = dom.window.document;
  const cards = d.querySelector('.cf-native-cards');
  assert.deepEqual(order(cards), ['review', 'complete', 'lei', 'links']);
  assert.ok(d.querySelector('[data-bc-module-links] [data-bcq-module-panel="constitucional:M01"]'));
  assert.equal(d.querySelectorAll('[data-bcq-module-panel]').length, 1);
  assert.ok(d.querySelector('.ds-footer-tools button').classList.contains('bc-law-relocated'));
  assert.ok(!d.querySelectorAll('.ds-footer-tools button')[1].classList.contains('bc-law-relocated'));
  dom.window.CentralModuleLinksLei.refresh();
  assert.deepEqual(order(cards), ['review', 'complete', 'lei', 'links'], 'reaplicar não altera a ordem');
  assert.equal(d.querySelectorAll('[data-bc-module-links]').length, 1);
  dom.window.close();
});

test('Processo Civil: preserva o painel de Lei em Dia com o botão de conclusão', () => {
  const dom = setup('<section class="subject" data-id="cpc"><section class="cf-module" data-cf="w1"><div class="cf-module-body">'
    + '<section class="bc-native-materials" data-role="theory">Teoria completa · Versão de revisão</section>'
    + '<div class="cpc-bottom-grid"><section class="cpc-mini-panel"><h4>⚖️ Lei em Dia</h4><button onclick="openLeiSecaEnxuta(null,\'cpc\',\'cpc-m01\')">Abrir Lei em Dia</button><button>Marcar concluído</button></section></div>'
    + panel('processual-civil:M01') + '</div></section></section>');
  const body = dom.window.document.querySelector('.cf-module-body');
  assert.deepEqual(order(body), ['theory', 'lei', 'links']);
  assert.match(body.querySelector('.cpc-bottom-grid').textContent, /Marcar concluído/);
  dom.window.close();
});

test('Penal, Civil e Administrativo ganham cartão de Lei em Dia ligado ao botão do módulo', () => {
  const dom = setup(
    '<section class="subject" data-id="penal"><section class="cf-module" data-cf="p1"><div class="cf-module-body">'
    + '<section class="bc-native-materials" data-role="theory">Teorias</section>'
    + '<section class="ds-module-footer"><section class="ds-notes">Notas</section>' + panel('penal:M01')
    + '<div class="cf-resource-box penal-approved-extra"><h4>Lei em Dia</h4><button onclick="window.opened=\'pen-m01\'">Abrir questões deste módulo</button></div></section>'
    + '</div></section></section>'
    + '<section class="subject" data-id="civil"><article class="cv-module" data-civil-native-module="1"><div class="cv-module-body"><section class="cv-zone">'
    + '<div class="cv-cards" data-role="theory">Teorias</div><section class="cv-panel cv-native-notes">Notas</section>' + panel('civil:M01')
    + '<div class="cv-tools"><div><button onclick="CivilNative.tool(1,\'decorando\')">📖 Lei em Dia</button><button>⚖ Vade Mecum</button></div></div>'
    + '</section></div></article></section>'
    + '<section class="subject" data-id="adm"><article class="topic-item"><div class="detail-panel"><section class="adm-native-zone" data-adm-native="adm-01">'
    + '<div class="adm-cf-cards" data-role="theory">Teorias</div><section class="adm-native-notes">Notas</section>' + panel('administrativo:M01')
    + '<div class="adm-native-module-tools"><div><button onclick="AdmNative.tool(\'adm-01\',\'decorando\')">📖 Lei em Dia</button></div></div>'
    + '</section></div></article></section>');
  const w = dom.window, d = w.document;
  w.CivilNative = { tool: (n, kind) => { w.opened = kind === 'decorando' ? 'civil-' + n : null; } };
  w.AdmNative = { tool: (uid, kind) => { w.opened = kind === 'decorando' ? uid : null; } };
  for (const [selector, expected] of [['.subject[data-id="penal"] .cf-module-body', 'pen-m01'], ['.subject[data-id="civil"] .cv-zone', 'civil-1'], ['.subject[data-id="adm"] .adm-native-zone', 'adm-01']]) {
    const body = d.querySelector(selector);
    assert.deepEqual(order(body).slice(0, 3), ['theory', 'lei', 'links'], selector);
    assert.equal(body.querySelectorAll('[data-bc-module-law]').length, 1);
    w.opened = null;
    body.querySelector('[data-bc-module-law] button').click();
    assert.equal(w.opened, expected, 'abre a Lei em Dia do próprio módulo');
  }
  assert.ok(d.querySelector('.penal-approved-extra').classList.contains('bc-law-relocated'));
  assert.ok(d.querySelector('.cv-tools button').classList.contains('bc-law-relocated'));
  dom.window.close();
});

test('sem filtros publicados o espaço de links fica oculto e a Lei em Dia continua logo após as teorias', () => {
  const dom = setup('<section class="subject" data-id="civil"><article class="cv-module" data-civil-native-module="2"><div class="cv-module-body"><section class="cv-zone">'
    + '<div class="cv-cards" data-role="theory">Teorias</div><div class="cv-tools"><button onclick="return CivilNative.tool(2,\'decorando\')">📖 Lei em Dia</button></div>'
    + '</section></div></article></section>');
  const zone = dom.window.document.querySelector('.cv-zone');
  assert.deepEqual(order(zone).slice(0, 3), ['theory', 'lei', 'links']);
  assert.equal(zone.querySelector('[data-bc-module-links]').hidden, true);
  dom.window.close();
});

test('Central carrega o organizador com versão de cache própria', () => {
  const central = read('central-v119.html');
  assert.match(central, /ui\/module-links-lei-v1\.js\?v=20261106links2/);
  assert.match(central, /ui\/module-links-lei-v1\.css\?v=20261106links2/);
  assert.match(read('ui/external-question-filters-v1.js'), /data-bcq-module-slot/);
});

test('Constitucional sem cartão próprio de Lei em Dia ganha o cartão ligado ao módulo', () => {
  const dom = setup('<section class="subject" data-id="cf"><section class="cf-module" data-cf="w4"><div class="cf-module-body">'
    + '<section class="cf-native-cards"><article class="cf-study-card cf-study-review" data-role="review">Versão de revisão</article><article class="cf-study-card cf-study-primary" data-role="complete">Teoria completa</article><article class="cf-study-card cf-study-map" data-role="map">Infográfico</article></section>'
    + panel('constitucional:M04') + '</div></section></section>');
  const w = dom.window;
  w.CfNativeStudy = { openDecorando: n => { w.opened = n; } };
  const cards = w.document.querySelector('.cf-native-cards');
  assert.deepEqual(order(cards), ['review', 'complete', 'lei', 'links', 'map']);
  cards.querySelector('[data-bc-module-law] button').click();
  assert.equal(w.opened, 4);
  dom.window.close();
});

test('atalho "Cadernos do TEC" das ferramentas some quando o módulo já mostra os filtros', () => {
  const footer = '<section class="ds-module-footer"><section class="resource ds-footer-tools"><div class="chips"><button>⚖ Vade Mecum</button><button>▤ Cadernos do TEC</button></div></section></section>';
  const dom = setup('<section class="subject" data-id="cpc">'
    + '<section class="cf-module" data-cf="w1"><div class="cf-module-body"><section class="bc-native-materials">Teorias</section><div class="cpc-bottom-grid"><section class="cpc-mini-panel"><h4>Lei em Dia</h4><button>Abrir</button></section></div>' + panel('processual-civil:M01') + footer + '</div></section>'
    + '<section class="cf-module" data-cf="w2"><div class="cf-module-body"><section class="bc-native-materials">Teorias</section><div class="cpc-bottom-grid"><section class="cpc-mini-panel"><h4>Lei em Dia</h4><button>Abrir</button></section></div>' + footer + '</div></section>'
    + '</section>'
    + '<section class="subject" data-id="cpp"><article data-cpp-native-module="1"><section class="cpp-native-links" data-cpp-links-slot="1">' + panel('processual-penal:M01') + '</section><div class="adm-native-module-tools"><div><button>⚖ Vade Mecum</button><button>▤ Cadernos TEC</button></div></div></article></section>');
  const d = dom.window.document;
  const [withLinks, withoutLinks] = [...d.querySelectorAll('.subject[data-id="cpc"] .cf-module')];
  assert.ok(withLinks.querySelectorAll('.ds-footer-tools button')[1].classList.contains('bc-tool-relocated'));
  assert.ok(!withLinks.querySelectorAll('.ds-footer-tools button')[0].classList.contains('bc-tool-relocated'), 'Vade Mecum continua');
  assert.ok(!withoutLinks.querySelectorAll('.ds-footer-tools button')[1].classList.contains('bc-tool-relocated'), 'sem filtros, o atalho continua');
  assert.ok(d.querySelectorAll('.adm-native-module-tools button')[1].classList.contains('bc-tool-relocated'));
  dom.window.close();
});

test('Voltar do navegador fecha a Central de Questões e o Vade Mecum oferece retorno visível', () => {
  const filters = read('ui/external-question-filters-v1.js');
  assert.match(filters, /addEventListener\('popstate'[\s\S]{0,400}classList\.contains\('hidden'\)\) leavePage\(\);/);
  const vade = read('tools/vade.html');
  assert.match(vade, /class="vm-return" onclick="vmGoCentral\(\)"/);
  assert.match(vade, /central-v6:tool-return/);
});
