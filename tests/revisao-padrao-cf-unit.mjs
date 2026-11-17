import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import vm from 'node:vm';

const read = f => readFileSync(f, 'utf8');
const VERSION = '20261115rev1';

test('Revisão no padrão do Constitucional está carregada e no pacote offline', () => {
  const boot = read('central-v119.html');
  const offline = JSON.parse(read('central-offline-files-v66172.json')).files;
  assert.ok(boot.includes('/ui/revisao-padrao-cf-v1.css?v=20261115responsive1'));
  assert.ok(boot.includes("ui/revisao-padrao-cf-v1.js?v=" + VERSION));
  assert.ok(offline.includes('/ui/revisao-padrao-cf-v1.css?v=20261115responsive1'));
  assert.ok(offline.includes('/ui/revisao-padrao-cf-v1.js?v=' + VERSION));
  // a folha só pode ser carregada depois da aparência de leitura (papel/serifa), para não perder a cascata
  assert.ok(boot.indexOf('revisao-padrao-cf-v1.css') > boot.indexOf('/ui/mascote-v1.css'));
});

test('o padrão usa fundo branco, Inter, kicker e respeita o modo noturno', () => {
  const css = read('ui/revisao-padrao-cf-v1.css');
  assert.match(css, /--bc-reading-paper:#fff/);
  assert.match(css, /Inter/);
  assert.match(css, /BASE COMPLETA\s+\/\s+APOSTILA TEÓRICA/);
  assert.match(css, /data-bc-reading-mode="night"/);
  assert.ok(!/font-family:\s*Georgia/i.test(css), 'sem serifa no padrão de revisão');
  assert.match(css, /data-id="cpc"/);
});

test('só leitores em modo de revisão recebem a marca bc-rev-cf', () => {
  const classes = new Map();
  const mkOverlay = (label) => {
    const set = new Set();
    return { dataset: { bcLei: 'x' }, isConnected: false, classList: { contains: c => set.has(c), toggle: (c, on) => (on ? set.add(c) : set.delete(c)) }, querySelector: () => ({ textContent: label }), set };
  };
  const rev = mkOverlay('DIREITO PENAL · MÓDULO 01 · VERSÃO DE REVISÃO');
  const full = mkOverlay('DIREITO PENAL · MÓDULO 01 · TEORIA COMPLETA');
  const body = { querySelectorAll: () => [rev, full] };
  const ctx = { window: {}, document: { body, addEventListener() {} }, MutationObserver: class { observe() {} }, setTimeout() {} };
  ctx.window = ctx;
  vm.runInNewContext(read('ui/revisao-padrao-cf-v1.js'), ctx);
  ctx.BCRevisaoPadraoCF.mark(body);
  assert.ok(rev.set.has('bc-rev-cf'));
  assert.ok(!full.set.has('bc-rev-cf'));
});

test('lei seca por assunto: só entra o artigo que o trecho cita, com a norma certa', () => {
  const ctx = { window: {}, document: { body: null, addEventListener() {} }, MutationObserver: class { observe() {} }, setTimeout() {} };
  ctx.window = ctx;
  vm.runInNewContext(read('ui/revisao-padrao-cf-v1.js'), ctx);
  const api = ctx.BCRevisaoPadraoCF;
  const items = [
    { key: 'cp:1', law: 'cp', ref: '1', label: 'Código Penal — art. 1', paragraphs: ['Art. 1º Não há crime sem lei anterior.'], url: '' },
    { key: 'cp:12', law: 'cp', ref: '12', label: 'Código Penal — art. 12', paragraphs: ['Art. 12. As regras gerais.'], url: '' },
    { key: 'cf:5', law: 'cf', ref: '5', label: 'Constituição Federal — art. 5', paragraphs: ['Art. 5º Todos são iguais.'], url: '' },
  ];
  const keys = (text, law) => JSON.stringify(api.citedItems(text, items, law).map(i => i.key));
  assert.equal(keys('A legalidade vem do art. 1º do Código Penal e da CF, art. 5º, XXXIX.', 'cp'), JSON.stringify(['cp:1', 'cf:5']));
  assert.equal(keys('Veja o art. 12 do CP.', 'cp'), JSON.stringify(['cp:12']));
  assert.equal(keys('Sem citação de artigo aqui.', 'cp'), '[]');
  // "art. 12" na Constituição não é o art. 12 do Código Penal
  assert.equal(keys('Conforme a Constituição Federal, art. 12, define-se nacionalidade.', 'cp'), '[]');
  // sem norma por perto vale a da disciplina
  assert.equal(keys('Nos termos do art. 1º, a pena exige lei.', 'cp'), JSON.stringify(['cp:1']));
  assert.equal(keys('Nos termos do art. 1º, a pena exige lei.', ''), '[]');
  // § e incisos não viram artigos
  assert.equal(keys('No art. 5º, § 12, e inciso 1 há garantias.', 'cp'), '[]');
  const cites = api.articleCitations('arts. 3º-A a 3º-F e art. 5º, § 12');
  assert.ok(cites[0].refs.includes('3-A') && cites[0].refs.includes('3-F'));
  assert.ok(!cites.flatMap(c => c.refs).includes('12'));
});

const forEachLeiFile = fn => {
  for (const disc of ['penal', 'cpp', 'adm']) {
    for (const f of readdirSync(`content/${disc}/lei-revisao`)) fn(disc, f, read(`content/${disc}/lei-revisao/${f}`));
  }
};

test('lei seca da Revisão: arquivos por módulo, só redação oficial, liberados ao plano Gratuito', async () => {
  const { protectedAsset } = await import('../lib/protected-content.js');
  let files = 0, items = 0;
  forEachLeiFile((disc, f, src) => {
    files++;
    const box = { window: {} }; box.window.window = box.window;
    vm.runInNewContext(src, box);
    const [n, list] = Object.entries(box.window.BC_LEI_REVISAO[disc])[0];
    assert.equal(`m${String(n).padStart(2, '0')}.js`, f);
    assert.ok(Array.isArray(list));
    for (const it of list) {
      items++;
      assert.deepEqual(Object.keys(it).sort(), ['key', 'label', 'law', 'paragraphs', 'ref', 'url'], 'sem campos de teoria autoral (anchor, section…)');
      assert.ok(it.paragraphs.length && it.paragraphs.every(p => typeof p === 'string' && p.length < 6000));
      assert.ok(it.url === '' || it.url.startsWith('https://'));
    }
    assert.deepEqual(protectedAsset(`/content/${disc}/lei-revisao/${f}`), { kind: 'file', feature: 'theory.summary' });
  });
  assert.equal(files, 17 + 22 + 20);
  assert.ok(items > 2000);
  // a origem completa continua fechada ao Gratuito
  assert.equal(protectedAsset('/content/penal/penal-visual-law.js').feature, 'theory.complete');
  assert.equal(protectedAsset('/content/adm/m01-apostila-complete.js').feature, 'theory.complete');
});

test('o carregador busca o arquivo do módulo certo e não depende de arquivos Premium', () => {
  const js = read('ui/revisao-padrao-cf-v1.js');
  assert.ok(js.includes("'/lei-revisao/m'"));
  assert.ok(!/penal-visual-law|cpp-visual-law|apostila-complete|AdmApostilaReading/.test(js));
});
