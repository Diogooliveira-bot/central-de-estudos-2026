// Processo Civil: a teoria completa importada do PDF vira subtítulos, listas e parágrafos
// (sem marcadores soltos nem blocos gigantes). Roda o mesmo parser dos 20 leitores.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import vm from 'node:vm';

const read = f => readFileSync(new URL('../' + f, import.meta.url), 'utf8');
function parser(file) {
  const src = read(file);
  const body = src.slice(src.indexOf('function esc('), src.indexOf('function buildFromHtml'));
  return vm.runInNewContext('(function(global){' + body + ';return {parse,build};})({})');
}
function content(n) {
  const ctx = { window: {} }; ctx.global = ctx.window;
  vm.runInNewContext(read('content/cpc/m' + n + '-native-data.js'), ctx);
  return ctx.window.BASE_NATIVE_CONTENT.cpc['m' + n];
}

test('os 20 leitores de Processo Civil usam o mesmo parser', () => {
  const files = readdirSync(new URL('../ui/', import.meta.url)).filter(f => /^cpc-(?:m\d\d-)?native-study-reader\.js$/.test(f));
  assert.equal(files.length, 20);
  const block = f => { const s = read('ui/' + f); return s.slice(s.indexOf('function cleanLines'), s.indexOf('function build(raw)')); };
  const ref = block(files[0]);
  files.forEach(f => assert.equal(block(f), ref, f));
});

test('M02: subtítulo "2.1. Conceito", lista de objetivos e nenhum marcador solto', () => {
  const { parse } = parser('ui/cpc-m02-native-study-reader.js');
  const blocks = parse(content('02').complete);
  assert.ok(blocks.some(b => b.type === 'h' && b.level === 3 && b.text === '2.1. Conceito'));
  assert.ok(blocks.some(b => b.type === 'h' && b.level === 4 && /^b\) Substitutividade$/.test(b.text)));
  const list = blocks.find(b => b.type === 'ul' && b.items[0].startsWith('jurisdição: conceito'));
  assert.ok(list && list.items.length >= 15, 'objetivos do módulo em lista');
  assert.ok(list.items.includes('litispendência internacional;'));
  const text = blocks.map(b => b.text || (b.items || []).join(' ')).join(' ');
  assert.doesNotMatch(text, /(?:•\s*){2,}/);
  assert.doesNotMatch(text, /(?:^|\s)\d\.\s+\d\.\s/);
  assert.ok(blocks.filter(b => b.type === 'p').every(b => b.text.length < 1100), 'sem parágrafos gigantes');
});

test('M01 a M08: nenhum bloco de marcadores soltos e capítulos continuam localizáveis', () => {
  for (const n of ['02', '03', '04', '05', '06', '07', '08']) {
    const { parse } = parser('ui/cpc-m' + n + '-native-study-reader.js');
    const data = content(n);
    const blocks = parse(data.complete);
    const text = blocks.map(b => b.text || (b.items || []).join(' ')).join(' ');
    assert.doesNotMatch(text, /(?:•\s*){3,}/, 'M' + n);
    const heads = blocks.filter(b => b.type === 'h').map(b => b.text.toLowerCase());
    // Capítulos com título numerado ("2.2.1. Medidas…") precisam virar título na página.
    for (const ch of (data.chapters?.complete || []).filter(c => /^\d/.test(c.match || ''))) {
      const key = String(ch.match || ch.title).toLowerCase().slice(0, 12);
      assert.ok(heads.some(h => h.includes(key) || key.includes(h.slice(0, 12))), 'M' + n + ': capítulo ' + ch.title);
    }
  }
});
