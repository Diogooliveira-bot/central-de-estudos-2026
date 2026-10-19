import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { JSDOM } from 'jsdom';

const root = path.resolve(import.meta.dirname, '..');
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const catalogScript = read('content/qc-notebook-catalog.js');
const context = { window: {} };
vm.runInNewContext(catalogScript, context);
const catalog = context.window.QC_NOTEBOOK_CATALOG;
const source = read('ui/external-question-filters-v1.js');

test('catálogo QC preserva os 416 IDs e URLs, com sete itens sem vínculo confirmado', () => {
  assert.equal(catalog.total, 416);
  assert.equal(catalog.items.length, 416);
  assert.equal(new Set(catalog.items.map((item) => item.id)).size, 416);
  assert.equal(catalog.items.filter((item) => item.linkedInExistingMap).length, 409);
  assert.equal(catalog.items.filter((item) => item.reviewStatus === 'no-confirmed-module-match').length, 7);
  for (const item of catalog.items) {
    const url = new URL(item.url);
    assert.equal(url.hostname, 'www.qconcursos.com');
    assert.equal(url.searchParams.get('notebook_ids[]'), item.id);
  }
  assert.equal(catalog.items.filter((item) => item.pendingCandidateCode).length, 4);
  assert.ok(catalog.items.some((item) => item.id === '15285197' && item.pendingCandidateCode === 'M16.5'));
  const repaired = catalog.items.find((item) => item.sourceTitle !== item.title);
  assert.ok(repaired, 'títulos recuperáveis devem ser limpos para exibição');
  assert.notEqual(repaired.sourceTitle, repaired.title, 'o título original permanece preservado');
});

function setup(role) {
  const dom = new JSDOM(`<!doctype html><html><body>
    <div id="centralSidebar"><div class="nav"><button>Hoje</button></div></div>
    <div class="workspace"><section id="homeView" class="view"></section></div><span id="crumb"></span>
    <section id="studentMorePanel"><div class="student-more-grid"></div></section>
    <section id="subjects"></section>
  </body></html>`, { url: 'https://preview.example.test/central-de-questoes?aba=filters', runScripts: 'outside-only', pretendToBeVisual: true });
  const { window } = dom;
  window.BASE_COMPLETA_USER = { id: `${role}-qc-test`, role };
  window.QC_CENTRAL_SHARING_LINKS = { items: [] };
  window.QC_NOTEBOOK_CATALOG = catalog;
  window.fetch = async () => ({ ok: true, json: async () => ({ canManage: role === 'admin', overrides: [] }) });
  window.confirm = () => true;
  window.scrollTo = () => {};
  window.openHome = () => {};
  window.eval(source);
  window.document.dispatchEvent(new window.Event('DOMContentLoaded'));
  return dom;
}

const settle = (window) => new Promise((resolve) => window.setTimeout(resolve, 50));

test('catálogo completo só aparece na seção administrativa e mantém os itens sem confirmar fora dos módulos', async () => {
  const admin = setup('admin');
  await settle(admin.window);
  const section = admin.window.document.querySelector('[data-bcq-qc-inventory]');
  assert.equal(section.hidden, false);
  assert.equal(section.querySelectorAll('[data-bcq-qc-inventory-row]').length, 416);
  assert.equal(section.querySelectorAll('[data-status="unconfirmed"]').length, 7);
  const pendingCandidate = section.querySelector('[data-bcq-qc-inventory-row][data-search*="15285197"]');
  assert.match(pendingCandidate.textContent, /candidato à pendência M16\.5/);
  assert.equal(section.querySelector('a[href*="notebook_ids%5B%5D=15285197"]')?.getAttribute('href'), catalog.items.find((item) => item.id === '15285197').url);
  assert.equal(admin.window.document.querySelectorAll('[data-bcq-module-panel] [data-status="unconfirmed"]').length, 0);

  const student = setup('aluno');
  await settle(student.window);
  assert.equal(student.window.document.querySelector('[data-bcq-qc-inventory]').hidden, true);
  assert.equal(student.window.document.querySelectorAll('[data-bcq-module-panel] [data-status="unconfirmed"]').length, 0);
});
