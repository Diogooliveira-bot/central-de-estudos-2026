import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { JSDOM } from 'jsdom';

test('editor cria, edita e salva tabelas com linhas e colunas', async () => {
  const dom = new JSDOM(`<!doctype html><html><body><div class="bc-native-reader-overlay">
    <div class="bc-native-reader-title"><b>Direito Administrativo</b><small>Módulo 04</small></div>
    <div class="bc-native-reader-tools"></div><article class="bc-native-article"><p>Texto inicial.</p></article>
    </div></body></html>`, {url:'https://example.test/central-v119.html',runScripts:'outside-only',pretendToBeVisual:true});
  const { window } = dom;
  let saved = '';
  window.fetch = async (url, options) => {
    if (String(url).startsWith('/api/auth')) return {ok:true,json:async () => ({authenticated:true,user:{role:'admin'}})};
    if (options?.method === 'POST') {saved=JSON.parse(options.body).html;return {ok:true,json:async () => ({ok:true})}}
    return {ok:true,json:async () => ({exists:false})};
  };
  window.eval(readFileSync(new URL('../ui/visual-editor-v1.js',import.meta.url),'utf8'));
  await new Promise(resolve => setTimeout(resolve,30));
  const doc = window.document;
  doc.querySelector('.bc-editor-trigger').click();
  const add = doc.querySelector('[data-add]');
  add.value='table';add.dispatchEvent(new window.Event('change',{bubbles:true}));
  const table = doc.querySelector('.bc-editor-table-wrap table');
  assert.ok(table);
  assert.equal(table.tHead.rows[0].cells.length,3);
  assert.equal(table.tBodies[0].rows.length,2);
  assert.equal(doc.querySelector('.bc-editor-table-wrap').getAttribute('contenteditable'),'true');
  table.tHead.rows[0].cells[0].textContent='Ponto';
  table.tBodies[0].rows[0].cells[0].textContent='Delegação';
  doc.querySelector('[data-table-action="row-add"]').click();
  doc.querySelector('[data-table-action="col-add"]').click();
  assert.equal(table.tBodies[0].rows.length,3);
  assert.equal(table.tHead.rows[0].cells.length,4);
  doc.querySelector('[data-table-action="row-remove"]').click();
  doc.querySelector('[data-table-action="col-remove"]').click();
  assert.equal(table.tBodies[0].rows.length,2);
  assert.equal(table.tHead.rows[0].cells.length,3);
  doc.querySelector('[data-save]').click();
  await new Promise(resolve => setTimeout(resolve,10));
  assert.match(saved, /<table class="bc-editor-table"/);
  assert.match(saved, /<th scope="col">Ponto<\/th>/);
  assert.match(saved, /<td>Delegação<\/td>/);
  const original=doc.createElement('div');original.className='adm-table-scroll';
  original.innerHTML='<table class="adm-reading-table"><thead><tr><th>A</th><th>B</th></tr></thead><tbody><tr><td>1</td><td>2</td></tr></tbody></table>';
  doc.querySelector('.bc-native-article').append(original);
  doc.querySelector('.bc-editor-trigger').click();original.click();
  const rowButton=doc.querySelector('[data-table-action="row-add"]');
  assert.equal(rowButton.hidden,false);
  rowButton.click();
  assert.equal(original.querySelector('tbody').rows.length,2);
  dom.window.close();
});
