import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {test} from 'node:test';
import {JSDOM} from 'jsdom';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const read=p=>readFileSync(path.join(root,p),'utf8');
const delay=ms=>new Promise(r=>setTimeout(r,ms));
function fixture(){
 const dom=new JSDOM('<!doctype html><html><head></head><body><nav id="centralSidebar"><div class="nav"><button>Lei em Dia</button><button>Questões</button><button>Agenda</button></div></nav><main id="subjects"><div data-civil-native-module="1"><button>Estudar conteúdo</button><button class="cv-standard-quiz">Resolver 10 questões</button><button onclick="CppNative.open(1,\'summary\',true)">Resolver 5 questões</button><button>10 questões autorais · resumido</button><section class="bcq-module-panels">Cadernos do QConcursos e do TEC</section><section class="tec-validated-panel">Filtro do TEC</section><article class="cpp-native-lei-card">Lei em Dia do módulo</article><section data-bc-questoes-area><button>Resolver 10 questões autorais</button><button class="adm-cf-quiz">Questões do módulo</button></section><textarea id="note"></textarea></div></main><div class="bc-native-article"><h2>Teoria</h2><p>Texto de teoria jurídica preservado.</p><section><h3>Questões de fixação</h3><p>Questão 1: qual alternativa?</p><p>Gabarito: A</p></section></div></body></html>',{url:'https://app.basecompleta.com.br/central-v119.html',runScripts:'outside-only',pretendToBeVisual:true});
 dom.window.eval(read('ui/old-questions-removed-v1.js'));
 dom.window.document.dispatchEvent(new dom.window.Event('DOMContentLoaded'));
 return dom;
}
test('remove só as questões internas antigas e preserva Lei em Dia, QC/TEC, notas e dados do aluno',async()=>{
 const dom=fixture(),w=dom.window,d=w.document;
 w.localStorage.setItem('BC_USER_V1:123:historico-questoes','7/10');
 await delay(90);
 assert.equal(w.BCQuestionsRemoved,true);
 assert.equal(d.querySelector('.cv-standard-quiz'),null);
 assert.doesNotMatch(d.body.textContent,/Resolver 5 questões|Resolver 10 questões(?! autorais)|10 questões autorais · resumido/);
 assert.equal(d.querySelector('.bc-native-article section'),null);
 // Lei em Dia, QC/TEC, leitura e anotações continuam
 assert.match(d.body.textContent,/Cadernos do QConcursos e do TEC/);
 assert.match(d.body.textContent,/Filtro do TEC/);
 assert.match(d.body.textContent,/Lei em Dia do módulo/);
 assert.match(d.getElementById('centralSidebar').textContent,/Lei em Dia/);
 assert.match(d.getElementById('centralSidebar').textContent,/Questões/);
 assert.equal(d.getElementById('note').tagName,'TEXTAREA');
 assert.match(d.body.textContent,/Texto de teoria jurídica preservado/);
 assert.match(d.body.textContent,/Estudar conteúdo/);
 assert.equal(w.localStorage.getItem('BC_USER_V1:123:historico-questoes'),'7/10');
 dom.window.close();
});
test('a nova área de Questões não é afetada pela retirada das antigas',async()=>{
 const dom=fixture(),d=dom.window.document;
 await delay(90);
 const area=d.querySelector('[data-bc-questoes-area]');
 assert.ok(area);
 assert.match(area.textContent,/Resolver 10 questões autorais/);
 assert.ok(area.querySelector('.adm-cf-quiz'),'o filtro não pode apagar nada dentro da nova área');
 dom.window.close();
});
test('remove questões antigas inseridas depois do primeiro carregamento',async()=>{
 const dom=fixture(),w=dom.window;await delay(60);
 const el=w.document.querySelector('[data-civil-native-module]');
 el.insertAdjacentHTML('beforeend','<button class="adm-cf-quiz">Resolver 5 questões</button><div class="cpp-native-question">Questão 1</div>');
 await delay(120);
 const fora=[...el.querySelectorAll('.adm-cf-quiz')].filter(x=>!x.closest('[data-bc-questoes-area]'));
 assert.equal(fora.length,0);
 assert.equal(el.querySelector(':scope > .cpp-native-question'),null);
 dom.window.close();
});

test('revisão e completo não exibem exercícios embutidos, sem afetar o banco independente',async()=>{
 const dom=fixture(),w=dom.window,d=w.document;
 const article=d.createElement('article');
 article.className='bc-native-article';
 article.innerHTML='<h2>Teoria completa</h2><p>Explicação jurídica preservada.</p>'
  +'<h2>10 Questões Internas</h2><p>Questão 1: teste antigo</p><p>Gabarito: A</p>'
  +'<h2>Síntese da matéria</h2><p>Resumo final preservado.</p>'
  +'<details class="question"><summary>Questão 2</summary>Enunciado antigo</details>'
  +'<aside class="cf-native-callout question">Teste de compreensão antigo</aside>'
  +'<aside class="cf-native-callout answer">Resposta comentada antiga</aside>'
  +'<section data-bc-questoes-area><h3>Questões internas</h3><button class="adm-cf-quiz">Resolver no banco novo</button></section>';
 d.body.append(article);
 await delay(160);
 assert.doesNotMatch(article.textContent,/Questão 1|Questão 2|Gabarito: A|Teste de compreensão antigo|Resposta comentada antiga|10 Questões Internas/);
 assert.match(article.textContent,/Explicação jurídica preservada|Resumo final preservado/);
 assert.match(article.textContent,/Resolver no banco novo/);
 assert.ok(article.querySelector('[data-bc-questoes-area]'));
 dom.window.close();
});

test('questões numeradas fora de um bloco são removidas, mas a explicação permanece',async()=>{
 const dom=fixture(),w=dom.window,d=w.document;
 const article=d.createElement('article');article.className='bc-native-article';
 article.innerHTML='<p>Conteúdo explicativo.</p><p>Questão 3: enunciado antigo</p>'
  +'<ol><li>Alternativa A</li><li>Alternativa B</li></ol><p>Gabarito: B</p>'
  +'<h2>Conceitos importantes</h2><p>Outro conceito preservado.</p>';
 d.body.append(article);await delay(160);
 assert.doesNotMatch(article.textContent,/Questão 3|Alternativa A|Gabarito: B/);
 assert.match(article.textContent,/Conteúdo explicativo|Outro conceito preservado/);
 dom.window.close();
});


test('M01 ADM completo remove imagens mas preserva síntese; revisão permanece com artes',async()=>{
 const dom=fixture(),w=dom.window,d=w.document;
 const overlay=d.createElement('div');overlay.id='adm-native-reader';
 overlay.innerHTML='<header><div class="bc-native-reader-title"><small>DIREITO ADMINISTRATIVO · MÓDULO 01 · COMPLETO</small></div></header>'
  +'<article class="bc-native-article adm-apostila"><h2>10 Questões Internas</h2>'
  +'<details class="question"><summary>Enunciado antigo</summary>Resposta</details>'
  +'<section class="synthesis"><h2>Resumo final</h2><p>Explicação mantida.</p><img src="/arte.jpg"></section>'
  +'<p>Teoria adicional.</p><img src="/ilustracao.png"></article>';
 d.body.append(overlay);
 const review=d.createElement('div');review.id='adm-review';
 review.innerHTML='<article class="bc-native-article"><img src="/arte-revisao.jpg" alt="arte de revisão"><p>Revisão preservada.</p></article>';
 d.body.append(review);
 await delay(160);
 assert.equal(overlay.querySelector('details.question'),null);
 assert.match(overlay.textContent,/Resumo final|Explicação mantida|Teoria adicional/);
 assert.equal(overlay.querySelectorAll('img').length,0,'nenhuma imagem no completo M01');
 assert.equal(review.querySelectorAll('img').length,1,'arte da revisão permanece');
 dom.window.close();
});

test('bootstrap e cache ativam a retirada das antigas sem tocar nas rotas da Lei em Dia e do QC/TEC',()=>{
 const index=read('index.html'),boot=read('central-v119.html'),sw=read('sw.js');
 const man=JSON.parse(read('central-offline-files-v66172.json'));
 const vercel=JSON.parse(read('vercel.json'));
 assert.match(index,/ui\/old-questions-removed-v1\.js\?v=20261123-references-end-v1/);
 assert.match(index,/ui\/old-questions-removed-v1\.css\?v=20261115-responsive-v15/);
 assert.match(man.build,/^20\d{6}-[a-z0-9-]+$/);
 assert(man.files.includes('/ui/old-questions-removed-v1.js?v=20261123-references-end-v1'));
 assert(boot.includes("var BUILD='"+man.build+"'"));
 assert(sw.includes("var CACHE='central-"+man.build+"'"));
 assert(sw.includes('central-offline-files-v66172.json?v='+man.build));
 for(const route of ['/central-de-questoes','/tools/decorando.html','/tools/lei-em-dia-gratis.html'])
  assert(!(vercel.redirects||[]).some(x=>x.source===route),'rota preservada: '+route);
 assert.match(read('ui/cf-native-study-v2.js'),/function openDecorando\(n\)\{const topic=/);
 assert.match(read('ui/cpp-native-study-v1.js'),/\+leiEmDia\(n\)\+linksSlot\(n\)\+/);
});


test('referências são deslocadas ao final sem editar ou perder nenhum trecho',async()=>{
 const dom=fixture(),d=dom.window.document;
 const article=d.createElement('article');article.className='bc-native-article';
 article.innerHTML='<h2>1. Introdução</h2><p id="teoria">Teoria intacta.</p>'
  +'<h2 id="refs">12. REFERÊNCIAS E FONTES DE CONSULTA</h2>'
  +'<p id="fonte1">[1] Constituição Federal, art. 5º.</p><p id="fonte2">[2] STF, jurisprudência.</p>'
  +'<h2 id="sintese">13. Síntese final</h2><p id="resumo">Síntese intacta.</p>'
  +'<footer id="fim">Finalizar leitura</footer>';
 const before={ref:article.querySelector('#refs'),fonte1:article.querySelector('#fonte1'),fonte2:article.querySelector('#fonte2')};
 d.body.appendChild(article);await delay(180);
 const ids=[...article.children].map(el=>el.id).filter(Boolean);
 assert.deepEqual(ids,['teoria','sintese','resumo','refs','fonte1','fonte2','fim']);
 assert.strictEqual(article.querySelector('#refs'),before.ref);
 assert.strictEqual(article.querySelector('#fonte1'),before.fonte1);
 assert.strictEqual(article.querySelector('#fonte2'),before.fonte2);
 assert.match(article.textContent,/Teoria intacta|Síntese intacta|Constituição Federal|jurisprudência/);
 dom.window.BCQuestionsRemovedUI.sweep();
 assert.deepEqual([...article.children].map(el=>el.id).filter(Boolean),ids,'nova varredura não deve deslocar novamente');
 dom.window.close();
});

test('fontes do capítulo de Português também vão ao fim, sem mexer nos exemplos',async()=>{
 const dom=fixture(),d=dom.window.document;
 const article=d.createElement('div');article.className='pt-doc';
 article.innerHTML='<h2>Concordância</h2><p>Exemplo didático mantido.</p><h3 id="bibliografia">Bibliografia</h3>'
 +'<p id="obra">Obra de consulta.</p><h3 id="revisao">Revisão teórica</h3><p id="explicacao">Explicação preservada.</p>';
 d.body.append(article);await delay(180);
 assert.deepEqual([...article.children].map(e=>e.id).filter(Boolean),['revisao','explicacao','bibliografia','obra']);
 assert.match(article.textContent,/Exemplo didático mantido|Explicação preservada|Obra de consulta/);
 dom.window.close();
});

test('pegadinha e não confundir são teoria; teste de compreensão e resposta do quiz não são',async()=>{
 const dom=fixture(),d=dom.window.document;
 const article=d.createElement('article');article.className='bc-native-article';
 article.innerHTML='<p class="cf-native-callout question" id="pegadinha"><strong>Pegadinha.</strong> Atenção ao prazo.</p>'
 +'<p class="cf-native-callout question" id="erro"><strong>Erro comum.</strong> Explicação necessária.</p>'
 +'<p class="cf-native-callout answer" id="distinguir"><strong>Não confundir.</strong> Direitos distintos.</p>'
 +'<p class="cf-native-callout question" id="teste"><strong>Teste de compreensão.</strong> Pergunta interna.</p>'
 +'<p class="cf-native-callout answer" id="gabarito"><strong>Resposta comentada.</strong> Questão antiga.</p>';
 d.body.append(article);await delay(180);
 assert.ok(article.querySelector('#pegadinha'));
 assert.ok(article.querySelector('#erro'));
 assert.ok(article.querySelector('#distinguir'));
 assert.equal(article.querySelector('#teste'),null);
 assert.equal(article.querySelector('#gabarito'),null);
 dom.window.close();
});

test('bloco de questão em parágrafos sai até o gabarito, sem eliminar teoria posterior',async()=>{
 const dom=fixture(),d=dom.window.document;
 const article=d.createElement('article');article.className='bc-native-article';
 article.innerHTML='<p>Regra teórica anterior.</p><p>Questão 7 — DIFÍCIL</p>'
 +'<p>Enunciado do exercício.</p><p>A) alternativa um</p><p>B) alternativa dois</p>'
 +'<p>Gabarito: B</p><p>Explicação: alternativa correta.</p>'
 +'<h2>Próxima parte</h2><p>Teoria posterior intocada.</p>';
 d.body.append(article);await delay(180);
 assert.doesNotMatch(article.textContent,/Questão 7|Enunciado do exercício|alternativa um|Gabarito: B|alternativa correta/);
 assert.match(article.textContent,/Regra teórica anterior|Teoria posterior intocada/);
 dom.window.close();
});
