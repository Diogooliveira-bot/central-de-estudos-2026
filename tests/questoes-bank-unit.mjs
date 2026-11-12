import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import { validarTudo, validarModulo, DISCIPLINAS, MODULOS } from '../tools/questoes-lib.mjs';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

test('banco de questões: 148 módulos, 10 questões cada, todas conferidas', () => {
  const { erros, indice, total } = validarTudo(root);
  assert.deepEqual(erros, []);
  for (const d of Object.keys(DISCIPLINAS)) assert.equal(indice[d].length, MODULOS[d], `${d}: faltam módulos`);
  assert.equal(total, 1480);
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

test('carregador: devolve as questões do módulo e [] quando não há arquivo', async () => {
  const w = { document: undefined };
  const ctx = { window: w };
  vm.createContext(ctx);
  vm.runInContext(fs.readFileSync(path.join(root, 'content/questoes/index.js'), 'utf8'), ctx);
  vm.runInContext(fs.readFileSync(path.join(root, 'content/questoes/adm/m03.js'), 'utf8'), ctx);
  vm.runInContext(fs.readFileSync(path.join(root, 'ui/questoes-bank-v1.js'), 'utf8'), ctx);
  const B = w.BCQuestoes;
  assert.equal(B.has('adm', 3), true);
  assert.equal(B.has('adm', 21), false);
  assert.equal(B.modulos('rlm').length, 15);
  assert.equal((await B.get('adm', 3)).length, 10);
  assert.equal((await B.get('adm', 21)).length, 0);
});
