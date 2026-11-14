// Textos públicos coerentes com o produto: só Qconcursos, 8 disciplinas, questões inéditas e versão única dos Termos.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync, readdirSync } from 'node:fs';
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
  assert.match(v, /até 5 questões inéditas por dia/i, 'vitrine cita o limite do plano gratuito');
  assert.match(v, /Premium não tem limite diário/i);
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
  assert.match(t, /até 5 questões inéditas por dia/i);
  assert.match(t, /filtros e links externos do QConcursos[^.]*exclusivos dos assinantes Premium/i);
  assert.doesNotMatch(t, /TEC Concursos/);
  assert.doesNotMatch(texto('politica-de-cookies.html'), /TEC Concursos/);
});

test('Política de Privacidade cita o provedor de e-mail em uso (Resend) e a Hotmart', () => {
  const t = texto('politica-de-privacidade.html');
  assert.match(t, /Resend \(envio de mensagens essenciais/);
  assert.match(t, /Hotmart intermedeia a venda/);
});

test('vitrine: botões Premium levam ao checkout da Hotmart (links exatos, nova aba, sem texto de "indisponível")', () => {
  const SEM = 'https://pay.hotmart.com/B108186453Y?off=o4y1mlg9', ANU = 'https://pay.hotmart.com/B108186453Y?off=gh4ajvj1';
  for (const f of ['vitrine/index.html', 'conheca.html']) {
    const h = read(f);
    for (const [id, url] of [['cta-premium-97', SEM], ['cta-premium-179', ANU]]) {
      const a = h.match(new RegExp('<a [^>]*id="' + id + '"[^>]*>'))?.[0] || '';
      assert.ok(a.includes('href="' + url + '"'), f + ' ' + id + ': href');
      assert.match(a, /target="_blank"/); assert.match(a, /rel="noopener noreferrer"/);
      assert.doesNotMatch(a, /aria-disabled|data-preview-only/);
    }
    assert.doesNotMatch(texto(f), /indisponível até a liberação|Checkout aguardando|botões de compra permanecem desativados|nenhum checkout está integrado/i);
    // só pode haver links de pagamento para o produto e as duas ofertas aprovadas
    const todos = [...h.matchAll(/https:\/\/pay\.hotmart\.com[^"'\s<]*/g)].map(m => m[0]);
    assert.ok(todos.length >= 2 && todos.every(u => u === SEM || u === ANU), f + ': ' + todos.join(' '));
  }
  assert.match(read('vitrine/index.html'), /const PREMIUM=\{semestral:'https:\/\/pay\.hotmart\.com\/B108186453Y\?off=o4y1mlg9',anual:'https:\/\/pay\.hotmart\.com\/B108186453Y\?off=gh4ajvj1'\}/);
});

test('imagens usadas nos e-mails são públicas (sem login) e existem no repositório', async () => {
  const mw = read('middleware.js');
  const urls = new Set();
  for (const f of ['lib/transactional-email-templates.js', ...fsLs('lib/email-packs'), 'lib/hotmart-webhook.js'])
    for (const m of read(f).matchAll(/https:\/\/app\.basecompleta\.com\.br(\/icons\/email\/[A-Za-z0-9._-]+)|'\/icons\/email\/([A-Za-z0-9._-]+)'|\/icons\/email\/([A-Za-z0-9._-]+\.webp)/g))
      urls.add(m[1] || '/icons/email/' + (m[2] || m[3]));
  assert.ok(urls.size >= 2, 'logo e mascote');
  for (const u of urls) {
    assert.ok(mw.includes("'" + u + "'"), 'middleware deve liberar ' + u + ' sem login');
    assert.ok(existsSync(new URL('..' + u.replace('/icons/', '/icons/'), import.meta.url)), 'arquivo ausente: ' + u);
  }
});
function fsLs(d) { return readdirSync(new URL('../' + d + '/', import.meta.url)).map(x => d + '/' + x); }
