import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import { validarTudo, validarModulo, DISCIPLINAS, MODULOS } from '../tools/questoes-lib.mjs';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

test('banco de questões: 161 módulos, 10 questões cada, todas conferidas', () => {
  const { erros, indice, total } = validarTudo(root);
  assert.deepEqual(erros, []);
  for (const d of Object.keys(DISCIPLINAS)) assert.equal(indice[d].length, MODULOS[d], `${d}: faltam módulos`);
  assert.equal(total, 1610);
});

test('índice do banco confere com os arquivos (rode "npm run questoes:index" se falhar)', () => {
  const { indice } = validarTudo(root);
  const ctx = { window: {} };
  vm.runInNewContext(fs.readFileSync(path.join(root, 'content/questoes/index.js'), 'utf8'), ctx);
  assert.equal(JSON.stringify(ctx.window.BC_QUESTOES_INDICE), JSON.stringify(indice));
});

test('a conferência barra questões mal formadas', () => {
  const ok = Array.from({ length: 10 }, (_, i) => ({ id: `adm-m03-autoral-${String(i + 1).padStart(2, '0')}`, origem: 'autoral-ia', q: 'Enunciado de teste com tamanho suficiente ' + i, options: ['a1', 'b2', 'c3', 'd4', 'e5'].map(x => x + ' alternativa ' + i), answer: [0, 1, 2, 3, 4, 0, 1, 2, 3, 4][i], explanation: 'Comentário completo. '.repeat(10), lawRef: 'Lei 9.784/1999 (Lei do Processo Administrativo Federal)' }));
  assert.deepEqual(validarModulo('adm', 3, ok), []);
  const ruins = structuredClone(ok);
  ruins[0].options[1] = ruins[0].options[0];            // alternativas repetidas
  ruins[1].origem = 'banca';                              // banca sem metadados
  ruins[2].explanation = 'Segundo a Lei 9.784/1999 isso vale.'.repeat(6); // lei sem nome
  ruins[3].banca = 'FGV';                                 // autoral com banca
  const erros = validarModulo('adm', 3, ruins).join('\n');
  assert.match(erros, /alternativas diferentes/);
  assert.match(erros, /exige o campo banca/);
  assert.match(erros, /sem o nome da lei/);
  assert.match(erros, /não pode ter banca/);
});

test('carregador: enunciados e correção vêm do servidor; sem gabarito no cliente', async () => {
  const w = {};
  const ctx = { window: w, URL };
  vm.createContext(ctx);
  vm.runInContext(fs.readFileSync(path.join(root, 'content/questoes/index.js'), 'utf8'), ctx);
  vm.runInContext(fs.readFileSync(path.join(root, 'content/questoes/adm/m03.js'), 'utf8'), ctx);
  const { installFakeQuestoesApi } = await import('./helpers/fake-questoes-api.mjs');
  const api = installFakeQuestoesApi(w, { plan: 'free', limit: 2 });
  ctx.fetch = w.fetch;
  vm.runInContext(fs.readFileSync(path.join(root, 'ui/questoes-bank-v1.js'), 'utf8'), ctx);
  const B = w.BCQuestoes;
  assert.equal(B.has('adm', 3), true);
  assert.equal(B.has('adm', 21), false);
  assert.equal(B.modulos('rlm').length, 15);
  assert.equal(B.modulos('info').length, 13);
  const itens = await B.get('adm', 3);
  assert.equal(itens.length, 10);
  assert.ok(!JSON.stringify(itens).match(/"answer"|"explanation"|"lawRef"/), 'sem gabarito antes de responder');
  assert.equal(B.usage().remaining, 2);
  assert.equal((await B.get('adm', 3)).length, 10);
  assert.equal(api.chamadas.modulo, 1, 'segunda abertura usa o cache do enunciado');
  assert.equal((await B.get('adm', 21)).length, 0);
  const ok = await B.answer('adm', 3, itens[0].id, 0);
  assert.equal(ok.ok, true);
  assert.equal(typeof ok.correct, 'boolean');
  assert.ok(ok.explanation.length > 50);
  assert.equal(B.usage().used, 1);
  await B.answer('adm', 3, itens[1].id, 0);
  const negada = await B.answer('adm', 3, itens[2].id, 0);
  assert.equal(negada.ok, false);
  assert.equal(negada.status, 429);
  assert.equal(B.usage().remaining, 0);
  assert.ok(!('answer' in negada) && !('explanation' in negada));
});
