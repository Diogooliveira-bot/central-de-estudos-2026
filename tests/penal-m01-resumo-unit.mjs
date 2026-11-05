// Penal M01: resumo reacentuado e leitura sem capa, rodapés ou quadros vazios do PDF.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

const read = f => readFileSync(new URL('../' + f, import.meta.url), 'utf8');
const strip = s => s.normalize('NFD').replace(/[̀-ͯ]/g, '');
function summary() {
  const ctx = { window: {} }; ctx.global = ctx.window;
  vm.runInNewContext(read('content/penal/m01-native-data.js'), ctx);
  return ctx.window.BASE_NATIVE_CONTENT.penal.m01.summary;
}
function parser() {
  const src = read('ui/native-study-reader.js');
  const body = src.slice(src.indexOf('function norm('), src.indexOf('function buildHtml'));
  return vm.runInNewContext('(function(global){' + body + ';return {parse,cleanLines};})({})');
}

test('resumo do M01 tem acentuação e mantém as quebras de linha do original', () => {
  const s = summary();
  assert.ok((s.match(/[áéíóúãõçâêô]/gi) || []).length > 300);
  for (const wrong of [/\bnao\b/i, /\bvoce\b/i, /\bmodulo\b/i, /\binterpretacao\b/i, /\bprincipios\b/i, /\bjuridicos\b/i]) assert.doesNotMatch(s, wrong);
  assert.match(s, /quando a ofensa é irrelevante/);
  assert.match(s, /respeito à integridade física e moral/);
  assert.match(s, /ultima ratio/i, 'expressão latina sem acento');
  assert.doesNotMatch(s, /[Úú]ltima ratio/);
  assert.ok(s.includes('\r\n'));
});

test('leitura do resumo começa na visão geral, sem capa, rodapé ou quadro vazio', () => {
  const { parse } = parser();
  const blocks = parse(summary(), 'summary');
  assert.equal(blocks[0].type, 'h');
  assert.match(blocks[0].text, /^1 VISÃO GERAL$/);
  const text = blocks.map(b => (b.label || '') + ' ' + (b.text || '') + (b.items || []).join(' ')).join(' ');
  assert.doesNotMatch(text, /Conteúdo restrito ao PEN M1|BASE COMPLETA \| DIREITO PENAL|^PEN M1$/m);
  assert.equal(blocks.filter(b => b.type === 'callout' && !b.text).length, 0);
  assert.deepEqual([...blocks.filter(b => b.type === 'lp').map(b => b.label)],
    ['Legalidade', 'Interpretação', 'Analogia', 'Princípios limitadores', 'Insignificância', 'Conflito aparente']);
  assert.ok(blocks.some(b => b.type === 'h' && b.level === 3 && b.text === '1. Mínima ofensividade'));
});

test('o texto sem acento continua sendo lido do mesmo jeito (filtros aceitam as duas formas)', () => {
  const { cleanLines } = parser();
  const plain = strip(summary());
  const a = cleanLines(plain, 'summary').map(strip), b = cleanLines(summary(), 'summary').map(strip);
  assert.deepEqual([...a], [...b]);
});
