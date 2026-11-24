import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import vm from 'node:vm';

const read = f => readFileSync(f, 'utf8');
const VERSION = '20261123check1';

test('Revisão no padrão do Constitucional está carregada e no pacote offline', () => {
  const boot = read('central-v119.html');
  const offline = JSON.parse(read('central-offline-files-v66172.json')).files;
  assert.ok(boot.includes('/ui/revisao-padrao-cf-v1.css?v=20261123check1'));
  assert.ok(boot.includes("ui/revisao-padrao-cf-v1.js?v=" + VERSION));
  assert.ok(offline.includes('/ui/revisao-padrao-cf-v1.css?v=20261123check1'));
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


test('checklists jurídicos: 62 revisões reais têm checagem final, sem importar conteúdo completo', async () => {
  const { JSDOM } = await import('jsdom');
  const { gunzipSync } = await import('node:zlib');
  const dom = new JSDOM('<!doctype html><body></body>', {url:'https://example.org',runScripts:'outside-only'});
  const w = dom.window;
  w.eval(read('ui/revisao-padrao-cf-v1.js'));
  const api = w.BCRevisaoPadraoCF;
  const mod = (disc,n,html,mode='RESUMIDO') => {
    const el = w.document.createElement('div');
    el.className='bc-native-reader-overlay';
    el.innerHTML='<div class="bc-native-reader-title"><small>DIREITO '+disc+' · MÓDULO '+n+' · '+mode+'</small></div><article class="bc-native-article">'+html+'</article>';
    return el;
  };
  let covered=0;
  function verify(el,count,disc,n) {
    const article=el.querySelector('article');
    const previous=article.innerHTML;
    assert.ok(api.attachChecklist(el),disc+' M'+n);
    const box=article.lastElementChild;
    assert.equal(box.dataset.bcReviewComprehension,disc+':'+n);
    assert.equal(box.querySelectorAll('input[type=checkbox]').length,count,disc+' M'+n);
    assert.ok([...box.querySelectorAll('label span')].every(x=>/^(Sei|Distingo|Reconheço|Identifico|Consigo|Conheço|Relaciono)/.test(x.textContent)),disc+' M'+n);
    assert.ok(api.attachChecklist(el));
    assert.equal(article.querySelectorAll('[data-bc-review-comprehension]').length,1);
    const input=box.querySelector('input');input.checked=true;input.dispatchEvent(new w.Event('change',{bubbles:true}));
    const other=mod('ADMINISTRATIVO',99,'','COMPLETO');
    assert.equal(api.attachChecklist(other),false);
    box.remove();
    assert.equal(article.innerHTML,previous);
    assert.ok(api.attachChecklist(el));
    assert.equal(article.lastElementChild.querySelector('input').checked,true);
    covered++;
  }
  for(let n=1;n<=20;n++){
    const p=String(n).padStart(2,'0');
    const box={window:{}};
    vm.runInNewContext(read('content/adm/autor-20261110/adm-m'+p+'-submitted-review.js'),box);
    const html=gunzipSync(Buffer.from(box.window.ADM_SUBMITTED_REVIEW[n],'base64')).toString('utf8');
    const el=mod('ADMINISTRATIVO',n,'<section class="adm-author-reading">'+html+'</section>');
    const count=[...el.querySelectorAll('.adm-author-reading h2')].filter(h=>/^\s*\d{1,2}(?:[.)]|\s|—|–)/.test(h.textContent)).length;
    assert.ok(count>=6);
    verify(el,count,'adm',n);
  }
  const cpp={window:{}};
  for(const range of ['01-05','06-10','11-15','16-20','21-22'])vm.runInNewContext(read('content/cpp/leituras-20261111-'+range+'.js'),cpp);
  for(let n=1;n<=22;n++){
    const html=cpp.window.BASE_CPP_APOSTILAS_20261111['cpp-m'+String(n).padStart(2,'0')];
    verify(mod('PROCESSUAL PENAL',n,html),5,'cpp',n);
  }
  const cpc={window:{}};
  for(const range of ['m01-m04','m05-m08','m09-m14','m15-m20'])vm.runInNewContext(read('content/cpc/cpc-review-didactic-'+range+'.js'),cpc);
  for(let n=1;n<=20;n++){
    const data=cpc.window.CPC_DIDACTIC_REVIEW[n];
    const steps=data.story?.steps?.length?data.story.steps:data.sections;
    const el=mod('PROCESSUAL CIVIL',n,'<div data-cpc-apostila="summary"><section class="cpc-didactic-review" data-cpc-review="'+n+'"></section><details class="cpc-original-reference"><h2>ASSUNTO NÃO ENSINADO NA REVISÃO</h2></details></div>');
    for(const [title] of steps){
      const step=w.document.createElement('details');step.className='cpc-study-step';
      const summary=w.document.createElement('summary'), strong=w.document.createElement('strong');
      strong.textContent=title;summary.append(strong);step.append(summary);el.querySelector('.cpc-didactic-review').append(step);
    }
    verify(el,steps.length,'cpc',n);
    assert.ok(!el.querySelector('[data-bc-review-comprehension]').textContent.includes('ASSUNTO NÃO ENSINADO'));
  }
  const full=mod('ADMINISTRATIVO',1,'<section class="adm-author-reading"><h2>01 Conteúdo completo</h2></section>','COMPLETO');
  const before=full.innerHTML;assert.equal(api.attachChecklist(full),false);assert.equal(full.innerHTML,before);
  const other=mod('INFORMÁTICA',1,'<section class="bc-apostila-teoria"><h2>01 Tema</h2></section>');
  assert.equal(api.attachChecklist(other),false);
  assert.equal(covered,62);
  dom.window.close();
});
test('os 47 módulos guiados de CF, Civil e Penal mantêm itens ligados a seus tópicos',()=>{
  for(const [disc,prefix,max] of [['cf','CF',15],['civil','CIV',15],['penal','PEN',17]]){
    const box={window:{}};
    for(let n=1;n<=max;n++){
      vm.runInNewContext(read('content/'+disc+'/m'+String(n).padStart(2,'0')+'-teoria-guiada-data.js'),box);
      const data=box.window['BC_'+prefix+'_GUIDED_MODULES'][n];
      assert.ok(data.topics.length);
      for(const topic of data.topics)assert.ok(typeof topic[7]==='string'&&topic[7].trim(),disc+' M'+n+' '+topic[0]);
    }
    assert.match(read('content/'+disc+'/'+disc+'-teoria-guiada-reader-v1.js'),/Minha checagem de compreensão/);
  }
});
