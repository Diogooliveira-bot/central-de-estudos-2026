import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import { JSDOM } from 'jsdom';
import { installFakeQuestoesApi } from './helpers/fake-questoes-api.mjs';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = p => fs.readFileSync(path.join(root, p), 'utf8');

function fixture(opts) {
  const dom = new JSDOM('<!doctype html><html><body><nav id="centralSidebar"><div class="nav"><button data-central-native="disciplines">Disciplinas</button></div></nav><div class="student-nav-scroll"><button class="student-quick-nav">Lei em Dia</button><button class="student-quick-nav">Vade Mecum</button></div><section id="studentMorePanel"><div class="student-more-grid"><button data-student-more-action="settings">Config</button></div></section></body></html>', { url: 'https://t.local/', runScripts: 'outside-only', pretendToBeVisual: true });
  const w = dom.window;
  for (const f of ['content/questoes/index.js', 'content/questoes/titulos.js', 'content/questoes/adm/m03.js', 'ui/questoes-bank-v1.js', 'ui/questoes-area-v1.js']) w.eval(read(f));
  dom.api = installFakeQuestoesApi(w, opts);
  return dom;
}
const tick = (ms = 80) => new Promise(r => setTimeout(r, ms));

test('menu: entrada "Questões" antes da Lei em Dia e no menu Mais', async () => {
  const dom = fixture(), d = dom.window.document;
  await tick();
  const rail = d.querySelector('.student-nav-scroll');
  const labels = [...rail.children].map(b => b.textContent.trim());
  assert.deepEqual(labels.slice(0, 2), ['Questões', 'Lei em Dia']);
  assert.ok(d.querySelector('#studentMorePanel [data-bcqa-more]'));
  dom.window.close();
});

const responder = async (d, i, j) => { d.querySelector('.bcqa-q[data-i="' + i + '"] [data-op="' + j + '"]').click(); d.querySelector('.bcqa-q[data-i="' + i + '"] [data-responder]').click(); await tick(30); };

test('área: hub → disciplina → módulo; selecionar e só então responder', async () => {
  const dom = fixture(), w = dom.window, d = w.document;
  w.BCQuestoesArea.openHub();
  assert.equal(d.querySelectorAll('[data-bc-questoes-area] [data-disc]').length, 9);
  d.querySelector('[data-disc="adm"]').click();
  assert.equal(d.querySelectorAll('[data-mod]').length, 20);
  d.querySelector('[data-mod="3"]').click();
  await tick();
  assert.equal(d.querySelectorAll('.bcqa-q').length, 10);
  const banco = w.BC_QUESTOES.adm[3];
  // selecionar não responde: o botão Responder só habilita depois da escolha
  assert.equal(d.querySelector('.bcqa-q[data-i="0"] [data-responder]').disabled, true);
  d.querySelector('.bcqa-q[data-i="0"] [data-op="2"]').click();
  assert.equal(d.querySelector('.bcqa-q[data-i="0"] [data-responder]').disabled, false);
  assert.match(d.querySelector('[data-stats]').textContent, /0\/10 respondidas/);
  assert.equal(d.querySelector('.bcqa-q[data-i="0"] .bcqa-feedback'), null);
  // responder: erra a 1ª e acerta a 2ª
  const errada = (banco[0].answer + 1) % 5;
  d.querySelector('.bcqa-q[data-i="0"] [data-op="' + errada + '"]').click();
  d.querySelector('.bcqa-q[data-i="0"] [data-responder]').click(); await tick(30);
  await responder(d, 1, banco[1].answer);
  assert.match(d.querySelector('[data-stats]').textContent, /2\/10 respondidas · 1 acertos/);
  assert.match(d.querySelector('.bcqa-q[data-i="0"] .bcqa-feedback').textContent, /Resposta incorreta/);
  assert.match(d.querySelector('.bcqa-q[data-i="1"] .bcqa-feedback').textContent, /Base:/);
  // refazer só os erros libera a 1ª e mantém a 2ª
  d.querySelector('[data-erros]').click();
  assert.equal(d.querySelectorAll('.bcqa-q[data-i="0"] [data-op]:not([disabled])').length, 5);
  assert.equal(d.querySelectorAll('.bcqa-q[data-i="1"] [data-op]:not([disabled])').length, 0);
  d.querySelector('[data-zerar]').click();
  assert.match(d.querySelector('[data-stats]').textContent, /0\/10 respondidas/);
  dom.window.close();
});

test('riscar alternativa: risco visual, não responde e desfaz a seleção', async () => {
  const dom = fixture(), w = dom.window, d = w.document;
  w.BCQuestoesArea.openModule('adm', 3); await tick();
  d.querySelector('.bcqa-q[data-i="0"] [data-op="1"]').click();
  d.querySelector('.bcqa-q[data-i="0"] [data-strike="1"]').click();
  const op = () => d.querySelector('.bcqa-q[data-i="0"] [data-op="1"]');
  assert.ok(op().classList.contains('struck'));
  assert.ok(!op().classList.contains('selected'), 'riscar tira a seleção');
  assert.equal(d.querySelector('.bcqa-q[data-i="0"] [data-responder]').disabled, true);
  d.querySelector('.bcqa-q[data-i="0"] [data-strike="1"]').click();
  assert.ok(!op().classList.contains('struck'));
  dom.window.close();
});

test('histórico: mostra se errou ou acertou da última vez; cada abertura começa zerada', async () => {
  const dom = fixture(), w = dom.window, d = w.document;
  w.BCQuestoesArea.openModule('adm', 3); await tick();
  const banco = w.BC_QUESTOES.adm[3];
  assert.match(d.querySelector('.bcqa-q[data-i="0"] .bcqa-hist').textContent, /Ainda não respondida/);
  d.querySelector('.bcqa-q[data-i="0"] [data-op="' + ((banco[0].answer + 1) % 5) + '"]').click();
  d.querySelector('.bcqa-q[data-i="0"] [data-responder]').click(); await tick(30);
  await responder(d, 1, banco[1].answer);
  d.querySelector('[data-bcqa-voltar]').click();
  w.BCQuestoesArea.openModule('adm', 3); await tick();
  // zerou a sessão, mas o histórico lembra
  assert.match(d.querySelector('[data-stats]').textContent, /0\/10 respondidas/);
  assert.equal(d.querySelectorAll('.bcqa-feedback').length, 0);
  assert.match(d.querySelector('.bcqa-q[data-i="0"] .bcqa-hist').textContent, /Errou da última vez · 1 erro/);
  assert.match(d.querySelector('.bcqa-q[data-i="1"] .bcqa-hist').textContent, /Acertou da última vez · 1 acerto/);
  // o hub mostra o que já foi respondido
  d.querySelector('[data-bcqa-voltar]').click();
  w.BCQuestoesArea.openHub();
  assert.match(d.querySelector('[data-disc="adm"]').textContent, /2 já respondidas/);
  dom.window.close();
});

test('modo Foco: uma questão por vez, Avançar só depois de responder; modo é lembrado', async () => {
  const dom = fixture(), w = dom.window, d = w.document;
  w.BCQuestoesArea.openModule('adm', 3); await tick();
  assert.equal(d.querySelectorAll('.bcqa-q').length, 10, 'padrão: rolagem');
  d.querySelector('[data-modo="foco"]').click();
  assert.equal(d.querySelectorAll('.bcqa-q').length, 1);
  assert.match(d.querySelector('.bcqa-meta').textContent, /QUESTÃO 01 DE 10/);
  assert.equal(d.querySelector('[data-prox]').disabled, true);
  await responder(d, 0, w.BC_QUESTOES.adm[3][0].answer);
  assert.equal(d.querySelector('[data-prox]').disabled, false);
  d.querySelector('[data-prox]').click();
  assert.match(d.querySelector('.bcqa-meta').textContent, /QUESTÃO 02 DE 10/);
  d.querySelector('[data-ant]').click();
  assert.match(d.querySelector('.bcqa-meta').textContent, /QUESTÃO 01 DE 10/);
  assert.equal(w.localStorage.getItem('central-v6:questoes:modo'), 'foco');
  d.querySelector('[data-bcqa-fechar]').click();
  w.BCQuestoesArea.openModule('adm', 3); await tick();
  assert.equal(d.querySelectorAll('.bcqa-q').length, 1, 'continua em Foco');
  dom.window.close();
});

test('abrir pelo módulo: Voltar fecha a janela; Esc fecha', async () => {
  const dom = fixture(), w = dom.window, d = w.document;
  w.BCQuestoesArea.openModule('adm', 3);
  await tick();
  assert.equal(d.querySelectorAll('.bcqa-q').length, 10);
  d.querySelector('[data-bcqa-voltar]').click();
  assert.equal(d.querySelector('.bcqa-overlay'), null);
  w.BCQuestoesArea.openModule('adm', 3); await tick();
  d.dispatchEvent(new w.KeyboardEvent('keydown', { key: 'Escape' }));
  assert.equal(d.querySelector('.bcqa-overlay'), null);
  dom.window.close();
});

test('ligação na Central: scripts e estilos no bootstrap; banco atrás do login e fora do manifesto offline público', async () => {
  const { protectedAsset } = await import('../lib/protected-content.js');
  const boot = read('central-v119.html');
  const man = JSON.parse(read('central-offline-files-v66172.json'));
  for (const f of ['ui/questoes-area-v1.js', 'ui/questoes-modulo-card-v1.js', 'ui/questoes-bank-v1.js', 'content/questoes/index.js', 'content/questoes/titulos.js', 'ui/questoes-area-v1.css']) {
    assert.ok(boot.includes(f + '?v='), 'bootstrap sem ' + f);
  }
  for (const f of ['ui/questoes-area-v1.js', 'ui/questoes-modulo-card-v1.js', 'ui/questoes-bank-v1.js', 'ui/questoes-area-v1.css']) {
    assert.ok(man.files.some(x => x.startsWith('/' + f + '?v=')), 'manifesto offline sem ' + f);
  }
  const arquivos = fs.readdirSync(path.join(root, 'content/questoes')).filter(d => fs.statSync(path.join(root, 'content/questoes', d)).isDirectory())
    .flatMap(d => fs.readdirSync(path.join(root, 'content/questoes', d)).map(f => `/content/questoes/${d}/${f}`));
  assert.equal(arquivos.length, 161);
  // Índice e títulos (sem gabarito) valem para todo aluno logado. Os arquivos de módulo trazem o GABARITO:
  // o Gratuito não os baixa (enunciados e correção saem de /api/questoes, que aplica o limite diário).
  for (const a of ['/content/questoes/index.js', '/content/questoes/titulos.js']) assert.equal(protectedAsset(a)?.feature, 'theory.summary', a);
  for (const a of arquivos.filter(x => /\/m\d{2}\.js$/.test(x))) assert.equal(protectedAsset(a)?.feature, 'premium.reviews', 'módulo só pelo servidor: ' + a);
  for (const a of ['/content/questoes/index.js', '/content/questoes/titulos.js', ...arquivos]) assert.ok(!man.files.some(x => x.split('?')[0] === a), 'manifesto público não pode listar ' + a);
});

test('todo módulo do banco tem título para exibir', () => {
  const w = {}; new Function('window', read('content/questoes/titulos.js'))(w);
  const idx = {}; new Function('window', read('content/questoes/index.js'))(idx);
  for (const [d, mods] of Object.entries(idx.BC_QUESTOES_INDICE)) for (const n of mods) assert.ok(w.BC_QUESTOES_TITULOS[d]?.[n], `${d} M${n} sem título`);
});

test('módulo com mais de 10 questões: tudo acompanha a quantidade real', async () => {
  const dom = fixture(), w = dom.window, d = w.document;
  const banco = w.BC_QUESTOES.adm[3];
  banco.push({ ...banco[0], id: 'adm-m03-autoral-11' }, { ...banco[1], id: 'adm-m03-autoral-12' });
  w.BC_QUESTOES_QTD.adm[3] = 12;
  w.BCQuestoesArea.openModule('adm', 3);
  await tick();
  assert.equal(d.querySelectorAll('.bcqa-q').length, 12);
  assert.match(d.querySelector('.bcqa-q[data-i="11"] .bcqa-meta').textContent, /QUESTÃO 12 DE 12/);
  assert.match(d.querySelector('[data-stats]').textContent, /0\/12 respondidas/);
  w.BCQuestoesArea.openHub();
  assert.match(d.querySelector('[data-disc="adm"]').textContent, /202 questões/);
  assert.doesNotMatch(d.body.textContent, /Dez questões|10 questões inéditas/);
  dom.window.close();
});

test('Gratuito: faixa "X de 5", 5 respostas liberadas e a 6ª bloqueada com aviso (sem gabarito)', async () => {
  const dom = fixture({ plan: 'free', limit: 5 }), w = dom.window, d = w.document;
  w.BCQuestoesArea.openModule('adm', 3); await tick();
  const banco = w.BC_QUESTOES.adm[3];
  assert.match(d.querySelector('[data-uso]').textContent, /0 de 5 questões respondidas hoje · restam 5/);
  for (let i = 0; i < 5; i++) await responder(d, i, banco[i].answer);
  assert.equal(dom.api.chamadas.responder, 5);
  assert.match(d.querySelector('[data-uso]').textContent, /Você usou as 5 questões gratuitas de hoje/);
  assert.match(d.querySelector('[data-uso]').textContent, /meia-noite/);
  // a 6ª: seleção possível, mas Responder fica desligado e explica o motivo; não há chamada ao servidor
  d.querySelector('.bcqa-q[data-i="5"] [data-op="1"]').click();
  assert.equal(d.querySelector('.bcqa-q[data-i="5"] [data-responder]').disabled, true);
  assert.match(d.querySelector('.bcqa-q[data-i="5"] .bcqa-dica-limite').textContent, /Limite diário atingido/);
  assert.equal(dom.api.chamadas.responder, 5);
  assert.equal(d.querySelector('.bcqa-q[data-i="5"] .bcqa-feedback'), null);
  // as já respondidas hoje continuam visíveis com correção
  assert.match(d.querySelector('.bcqa-q[data-i="0"] .bcqa-feedback').textContent, /Resposta correta/);
  dom.window.close();
});

test('Gratuito: o servidor recusa (429) mesmo sem o cliente saber; a questão fica sem resposta e o aviso aparece', async () => {
  const outras = Array.from({ length: 5 }, (_, i) => 'outro-modulo-' + i);
  const dom = fixture({ plan: 'free', limit: 5 }), w = dom.window, d = w.document;
  w.BCQuestoesArea.openModule('adm', 3); await tick();
  dom.api.usados.clear(); outras.forEach(x => dom.api.usados.add(x));   // outro aparelho gastou a cota depois de abrir
  await responder(d, 0, 1);
  assert.match(d.querySelector('.bcqa-q[data-i="0"] .bcqa-erro').textContent, /já usou as questões gratuitas de hoje/);
  assert.equal(d.querySelector('.bcqa-q[data-i="0"] .bcqa-feedback'), null);
  assert.match(d.querySelector('[data-uso]').textContent, /Você usou as 5 questões gratuitas de hoje/);
  assert.match(d.querySelector('[data-stats]').textContent, /0\/10 respondidas/);
  dom.window.close();
});

test('modo Foco: sem cota o aluno ainda consegue avançar para rever as já respondidas', async () => {
  const dom = fixture({ plan: 'free', limit: 1 }), w = dom.window, d = w.document;
  w.BCQuestoesArea.openModule('adm', 3); await tick();
  d.querySelector('[data-modo="foco"]').click();
  await responder(d, 0, w.BC_QUESTOES.adm[3][0].answer);
  d.querySelector('[data-prox]').click();
  assert.match(d.querySelector('.bcqa-meta').textContent, /QUESTÃO 02 DE 10/);
  assert.equal(d.querySelector('[data-responder]').disabled, true);
  assert.equal(d.querySelector('[data-prox]').disabled, false, 'Avançar liberado: a questão está sem cota');
  dom.window.close();
});

test('Premium: sem faixa de limite e sem bloqueio', async () => {
  const dom = fixture({ plan: 'premium' }), w = dom.window, d = w.document;
  w.BCQuestoesArea.openModule('adm', 3); await tick();
  const banco = w.BC_QUESTOES.adm[3];
  for (let i = 0; i < 8; i++) await responder(d, i, banco[i].answer);
  assert.equal(d.querySelector('[data-uso]'), null);
  assert.equal(d.querySelectorAll('.bcqa-feedback').length, 8);
  dom.window.close();
});

test('hub mostra a faixa de limite do Gratuito', async () => {
  const dom = fixture({ plan: 'free', limit: 5, answered: ['a', 'b'] }), w = dom.window, d = w.document;
  w.BCQuestoesArea.openHub(); await tick();
  assert.match(d.querySelector('[data-uso]').textContent, /2 de 5 questões respondidas hoje · restam 3/);
  dom.window.close();
});

test('falhas do servidor viram mensagens claras (sessão expirada, sem conexão) e a correção nunca é inventada no cliente', async () => {
  for (const [falhar, esperado] of [[401, /sessão expirou/i], ['rede', /Sem conexão/i], [503, /temporariamente indisponíveis/i]]) {
    const dom = fixture({ falhar }), w = dom.window, d = w.document;
    w.BCQuestoesArea.openModule('adm', 3); await tick();
    assert.match(d.querySelector('.bcqa-empty').textContent, esperado);
    assert.equal(d.querySelectorAll('.bcqa-q').length, 0);
    dom.window.close();
  }
  const dom = fixture(), w = dom.window, d = w.document;
  w.BCQuestoesArea.openModule('adm', 3); await tick();
  const html = d.body.innerHTML;
  assert.ok(!/gabarito|Resposta correta/.test(html), 'nada de correção antes de responder');
  assert.equal(dom.api.chamadas.responder, 0);
  dom.window.close();
});
