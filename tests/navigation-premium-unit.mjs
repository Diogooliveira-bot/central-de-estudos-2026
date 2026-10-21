import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { JSDOM } from 'jsdom';

const read = (path) => readFile(new URL('../' + path, import.meta.url), 'utf8');

async function setup(role, previewGuest = false) {
  const dom = new JSDOM('<!doctype html><html><body><div id="centralSidebar"><div class="nav"></div></div><main id="appRoot"></main></body></html>', {
    url: 'https://preview.example.test/', runScripts: 'outside-only', pretendToBeVisual: true,
  });
  const win = dom.window;
  win.BASE_COMPLETA_USER = { id:'test', role };
  win.__BASE_COMPLETA_USER_ROLE__ = role;
  win.__BASE_COMPLETA_PREVIEW_GUEST__ = previewGuest;
  let enhance;
  win.CentralStudentUX = {
    byId: (id) => win.document.getElementById(id),
    setText: (node, text) => { node.textContent = text; },
    failures: new Set(),
    register: (name, fn) => { if (name === 'shell') enhance = fn; },
    schedule: () => enhance?.(),
  };
  win.eval(await read('ui/student-shell-v3.js'));
  assert.ok(enhance, 'O shell deve se registrar no sistema UX');
  enhance();
  return { win, dom, enhance };
}

test('menu Mais não duplica Cadernos TEC e mantém acesso à Central de Questões', async () => {
  const { win } = await setup('aluno');
  const panel = win.document.getElementById('studentMorePanel');
  assert.ok(panel);
  assert.doesNotMatch(panel.textContent, /Cadernos TEC/);
  assert.equal(panel.querySelector('[data-student-more-action="tec"]'), null);
  assert.equal(panel.querySelector('[data-student-more-action="admin"]'), null);
  assert.ok(panel.querySelector('[data-student-more-action="law"]'));
  assert.ok(panel.querySelector('[data-student-more-action="settings"]'));
  win.close();
});

test('admin enxerga acesso administrativo único e estudante nunca recebe esse link', async () => {
  const { win, enhance } = await setup('admin');
  const grid = win.document.querySelector('.student-more-grid');
  assert.equal(grid.querySelectorAll('[data-student-more-action="admin"]').length, 1);
  assert.match(grid.textContent, /Administração/);
  assert.match(grid.textContent, /Usuários, convites e acessos/);
  enhance();
  assert.equal(grid.querySelectorAll('[data-student-more-action="admin"]').length, 1);
  win.BASE_COMPLETA_USER.role = 'aluno';
  win.__BASE_COMPLETA_USER_ROLE__ = 'aluno';
  enhance();
  assert.equal(grid.querySelector('[data-student-more-action="admin"]'), null);
  win.close();
});

test('visitante de prévia nunca recebe o menu administrativo', async () => {
  const { win } = await setup('admin', true);
  assert.equal(win.document.querySelector('[data-student-more-action="admin"]'), null);
  win.close();
});

test('o visual desktop é compacto e o menu móvel continua responsivo', async () => {
  const css = await read('ui/student-experience-v3.css');
  assert.match(css, /--bc-nav-height:74px!important/);
  assert.match(css, /\.student-more-admin/);
  assert.match(css, /@media \(max-width:800px\)/);
  assert.match(css, /student-bottom-nav/);
});

test('recursos editados estão no carregador e no manifesto offline', async () => {
  const boot = await read('central-v119.html');
  const offline = await read('central-offline-files-v66172.json');
  assert.match(boot, /student-shell-v3\.js\?v=20261021nav2/);
  assert.match(offline, /student-shell-v3\.js\?v=20261021nav2/);
});
