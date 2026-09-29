import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import test from 'node:test';
import vm from 'node:vm';

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');

test('pacote editorial contém exatamente os módulos CPC M01 a M20', () => {
  const files = readdirSync(new URL('../cpc-final-20260928/', import.meta.url))
    .filter((name) => /^M\d{2}\.html$/u.test(name))
    .sort();
  const expected = Array.from({ length: 20 }, (_, index) => `M${String(index + 1).padStart(2, '0')}.html`);

  assert.deepEqual(files, expected);
  for (const file of files) {
    const html = read(`cpc-final-20260928/${file}`);
    assert.equal((html.match(/<h1\b/giu) || []).length, 1, `${file}: quantidade de H1`);
    assert.match(html, /parent\.postMessage\(\{type:'base-cpc-doc-height'/u, `${file}: ajuste de altura`);
    assert.doesNotMatch(html, /30\/07\/2027|\bM21\b/u, `${file}: conteúdo fora do pacote`);
  }
});

test('entrada carrega a integração e não reinsere a decoração legada do M01', () => {
  const index = read('index.html');
  const entry = read('central-v119.html');
  const worker = read('sw.js');

  assert.match(index, /cpc-final-integration-20260928\.js\?v=20260929editorial5/u);
  assert.match(entry, /66169-cpc-editorial-20260929/u);
  assert.doesNotMatch(entry, /cpc-m1-apostila-v66121\.js/u);
  assert.match(worker, /central-v66169-cpc-editorial-v7/u);
  assert.match(worker, /cpcNo<=20/u);
  assert.match(worker, /cpc-final-integration-20260928\.js\?v=20260929editorial5/u);
});

test('adaptador troca somente a teoria de CPC e preserva os demais módulos', () => {
  const listeners = {};
  const context = {
    console,
    window: {
      renderCpcModule() {
        return '<main>30/07/2027<div class="cf-theory-grid"><p>legado</p></div><div class="cf-actions">ações</div></main>';
      },
      addEventListener(type, listener) {
        listeners[type] = listener;
      },
      renderAll() {
        this.rendered = true;
      }
    },
    localStorage: {
      getItem(key) { return key === 'central-v6:cpc-open:cpc1' ? '1' : null; }
    },
    cpcModuleOpenKey(id) { return `central-v6:cpc-open:${id}`; },
    document: {
      addEventListener(type, listener) {
        listeners[type] = listener;
      },
      querySelectorAll() {
        return [];
      }
    }
  };
  context.window.window = context.window;
  vm.runInNewContext(read('cpc-final-integration-20260928.js'), context);

  const cpc1 = context.window.renderCpcModule({ id: 'cpc1', num: 1 });
  const cpc20 = context.window.renderCpcModule({ id: 'cpc20', num: 20 });
  const civil = context.window.renderCpcModule({ id: 'civil1', num: 1 });

  assert.match(cpc1, /31\/07\/2027/u);
  assert.match(cpc1, /data-cpc-src="\/cpc-final-20260928\/M01\.html"/u);
  assert.doesNotMatch(cpc1, /legado/u);
  assert.match(cpc20, /M20\.html/u);
  assert.match(civil, /legado/u);
  assert.doesNotMatch(civil, /cpc-final-20260928/u);
  assert.equal(context.window.rendered, true);
});

// preview build marker: full audited CPC theory surfaced
