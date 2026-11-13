// Textos públicos coerentes com o produto: só Qconcursos, 8 disciplinas, questões inéditas e versão única dos Termos.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { FREE_SIGNUP_TERMS_VERSION } from '../lib/free-signup-handler.js';
const read = f => readFileSync(new URL('../' + f, import.meta.url), 'utf8');
const texto = f => read(f).replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/g, ' ').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');

test('vitrine e página "Conheça" não prometem TEC nem Informática e mostram 8 disciplinas', () => {
  for (const f of ['vitrine/index.html', 'conheca.html']) {
    const t = texto(f);
    assert.doesNotMatch(t, /\bTEC\b/, f + ': TEC foi retirado dos alunos');
    assert.doesNotMatch(t, /Informática/, f + ': a Central não tem Informática');
    assert.match(read(f), /<strong>08<\/strong> disciplinas/, f + ': 8 disciplinas');
  }
  const v = texto('vitrine/index.html');
  assert.match(v, /questões inéditas/i, 'vitrine cita as questões inéditas');
  assert.doesNotMatch(v, /Questões internas/);
  assert.doesNotMatch(read('vitrine/index.html'), /data-provider="TEC"/);
});

test('Termos, Privacidade, Cookies, formulário e backend usam a mesma versão', () => {
  const v = FREE_SIGNUP_TERMS_VERSION;
  assert.match(v, /^terms-\d{4}-\d{2}-\d{2}-v\d+$/);
  assert.doesNotMatch(v, /draft|minuta|pre/i);
  for (const f of ['termos-de-uso.html', 'politica-de-privacidade.html', 'politica-de-cookies.html', 'cadastro-gratuito.html'])
    assert.ok(read(f).includes(v), f + ' deve citar ' + v);
});

test('Termos descrevem o plano gratuito e o Qconcursos como Premium, sem TEC', () => {
  const t = texto('termos-de-uso.html');
  assert.match(t, /questões inéditas por módulo/i);
  assert.match(t, /filtros e links externos do QConcursos[^.]*exclusivos dos assinantes Premium/i);
  assert.doesNotMatch(t, /TEC Concursos/);
  assert.doesNotMatch(texto('politica-de-cookies.html'), /TEC Concursos/);
});

test('Política de Privacidade cita o provedor de e-mail em uso (Resend) e a Hotmart', () => {
  const t = texto('politica-de-privacidade.html');
  assert.match(t, /Resend \(envio de mensagens essenciais/);
  assert.match(t, /Hotmart intermedeia a venda/);
});
