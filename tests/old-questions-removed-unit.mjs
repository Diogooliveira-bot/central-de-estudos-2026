import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {test} from 'node:test';
import {JSDOM} from 'jsdom';
import {runInNewContext} from 'node:vm';
import {gunzipSync} from 'node:zlib';
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
 assert.doesNotMatch(article.textContent,/Questão 1|Questão 2|Gabarito: A|10 Questões Internas/);
 assert.match(article.textContent,/Teste de compreensão antigo|Resposta comentada antiga/);
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
 assert.match(index,/ui\/old-questions-removed-v1\.js\?v=20261123-theory-clean-v2/);
 assert.match(index,/ui\/old-questions-removed-v1\.css\?v=20261115-responsive-v15/);
 assert.match(man.build,/^20\d{6}-[a-z0-9-]+$/);
 assert(man.files.includes('/ui/old-questions-removed-v1.js?v=20261123-theory-clean-v2'));
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

test('pegadinha, teste de compreensão e resposta didática permanecem na teoria',async()=>{
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
 assert.ok(article.querySelector('#teste'));
 assert.ok(article.querySelector('#gabarito'));
 assert.match(article.textContent,/Pergunta interna|Questão antiga/);
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


test('ADM remove seções 3. 10 Questões Internas e preserva sínteses',async()=>{
 const dom=fixture(),d=dom.window.document;
 const article=d.createElement('article');article.className='bc-native-article';
 article.innerHTML='<h2>Teoria completa</h2><p>Conteúdo essencial.</p>'
 +'<h2>3. 10 QUESTÕES INTERNAS DE FIXAÇÃO — CONTEÚDO COMPLETO</h2>'
 +'<p>Questão 1: pergunta para retirar.</p><p>A) errada</p><p>Gabarito: B.</p>'
 +'<h2>Síntese final</h2><p>Conceito importante.</p>';
 d.body.append(article);await delay(180);
 assert.doesNotMatch(article.textContent,/10 QUESTÕES INTERNAS|pergunta para retirar|Gabarito: B/);
 assert.match(article.textContent,/Conteúdo essencial|Síntese final|Conceito importante/);
 dom.window.close();
});

test('baterias certo/errado em texto são removidas; quadros da teoria permanecem',async()=>{
 const dom=fixture(),d=dom.window.document;
 const article=d.createElement('article');article.className='bc-native-article';
 article.innerHTML='<h2>Comparação jurídica</h2><p>Definição importante.</p>'
 +'<h3>1. “A autarquia possui personalidade.” CERTO — pessoa de direito público.</h3>'
 +'<h3>2. “Toda fundação é entidade privada.” ERRADO — depende do tipo.</h3>'
 +'<h3>3. “Todo órgão possui personalidade própria.” ERRADO — órgão integra a pessoa.</h3>'
 +'<h3>Próximo assunto</h3><p>Explicação íntegra do tópico.</p>';
 d.body.append(article);await delay(180);
 assert.doesNotMatch(article.textContent,/A autarquia possui personalidade|Toda fundação é entidade privada|Todo órgão possui personalidade/);
 assert.match(article.textContent,/Definição importante|Próximo assunto|Explicação íntegra/);
 dom.window.close();
});


test('CF remove revisão ativa que contém perguntas numeradas sem apagar pegadinhas e artigos',async()=>{
 const dom=fixture(),d=dom.window.document;
 const article=d.createElement('article');article.className='bc-native-article';
 article.innerHTML='<h2>PEGADINHAS DE PROVA</h2><p>Regra jurídica preservada.</p>'
 +'<h2>REVISÃO ATIVA</h2>'
 +'<h2>1. Quais são os fundamentos da ordem econômica?</h2>'
 +'<h2>2. Como atua a fiscalização estatal?</h2>'
 +'<h2>3. Qual é a regra constitucional da atividade econômica?</h2>';
 d.body.append(article);await delay(180);
 assert.doesNotMatch(article.textContent,/REVISÃO ATIVA|Quais são os fundamentos|Como atua a fiscalização|Qual é a regra constitucional/);
 assert.match(article.textContent,/PEGADINHAS DE PROVA|Regra jurídica preservada/);
 dom.window.close();
});


function jsContent(path,selector){
 const win={};
 runInNewContext(read(path),{window:win},{timeout:2500,filename:path});
 return selector(win);
}
function escForTest(value){return String(value).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]))}
function cfReaderFixture(raw){
 return String(raw||'').split(/\r?\n/).filter(line=>line.trim()).map(line=>{
  const t=line.trim(),isHeading=/^\d+(?:\.\d+)*\.?\s+/.test(t)||
   /^[A-ZÁÀÂÃÉÊÍÓÔÕÚÇ][A-ZÁÀÂÃÉÊÍÓÔÕÚÇ0-9 /—–:()º§.,-]{5,}$/.test(t);
  return isHeading?'<h2>'+escForTest(t)+'</h2>':'<p>'+escForTest(t)+'</p>';
 }).join('');
}

test('materiais reais ADM M01-M20 não deixam seções internas de questões na leitura',async()=>{
 const dom=fixture(),w=dom.window,d=w.document,issues=[];
 for(let n=1;n<=20;n++){
  const nn=String(n).padStart(2,'0');
  const html=jsContent('content/adm/m'+nn+'-approved-complete.js',win=>win.ADM_APPROVED_COMPLETE?.[n]);
  assert.ok(html?.length>200,'apostila ADM M'+nn+' indisponível no fixture');
  const article=d.createElement('article');article.className='bc-native-article';
  article.innerHTML=html;d.body.append(article);
  w.BCQuestionsRemovedUI.sweep();
  const wrong=[...article.querySelectorAll('h2,h3,h4')].filter(h=>
   /^(?:\d+\s*[.)-]\s*){0,2}(?:\d+\s+)?quest[oõ]es?\s+internas?\b/i.test(h.textContent.trim()));
  if(wrong.length)issues.push('M'+nn+': '+wrong.map(h=>h.textContent.trim()).join(' / '));
  assert.ok(article.querySelector('h1,h2,h3'), 'Teoria ADM M'+nn+' não pode desaparecer');
  article.remove();
 }
 assert.deepEqual(issues,[],'Ainda há títulos de questões embutidos em apostilas ADM reais');
 await delay(180); // encerra a varredura agendada antes de desmontar o JSDOM
 dom.window.close();
});

test('CF M01 mantém checklist após reposicionar referências e M13-M15 removem perguntas de revisão ativa',async()=>{
 const dom=fixture(),w=dom.window,d=w.document;
 for(const n of [1,13,14,15]){
  const nn=String(n).padStart(2,'0');
  const content=jsContent('content/cf/m'+nn+'-native-data.js',win=>win.BASE_NATIVE_CONTENT?.cf?.['m'+nn]);
  assert.ok(content?.summary?.length>100);
  const mode=n===1?'complete':'summary',article=d.createElement('article');
  article.className='bc-native-article';
  article.innerHTML=cfReaderFixture(content[mode]);d.body.append(article);
  w.BCQuestionsRemovedUI.sweep();
  if(n===1){
   const text=[...article.querySelectorAll('h2')].map(e=>e.textContent);
   assert.ok(text.findIndex(s=>/REFERÊNCIAS E FONTES/.test(s))>text.findIndex(s=>/CHECKLIST DE DOMÍNIO/.test(s)),
    'A referência do CF M01 deve ficar depois do checklist, sem alterá-lo');
   assert.match(article.textContent,/CHECKLIST DE DOMÍNIO|Constituição da República/);
  }else{
   assert.doesNotMatch(article.textContent,/\bREVISÃO ATIVA\b/);
   assert.match(article.textContent,/PEGADINHAS DE PROVA/);
  }
  article.remove();
 }
 await delay(180); // evita callback de MutationObserver após o encerramento da janela
 dom.window.close();
});

function realCfComplete(n){
 const nn=String(n).padStart(2,'0');
 return jsContent('content/cf/m'+nn+'-native-data.js',win=>win.BASE_NATIVE_CONTENT.cf['m'+nn].complete);
}
function packedAdmComplete(n){
 const nn=String(n).padStart(2,'0');
 const src=read('content/adm/m'+nn+'-apostila-complete.js');
 const m=src.match(/="([A-Za-z0-9+/=]+)";?\s*$/);
 assert.ok(m,'ADM M'+nn+' sem pacote completo');
 return gunzipSync(Buffer.from(m[1],'base64')).toString('utf8');
}
test('mantém testes de compreensão, inclusive seus comentários, e retira cinco questões de revisão de CF',async()=>{
 const dom=fixture(),w=dom.window,d=w.document;
 w.eval(read('ui/cf-apostila-reading-v1.js'));
 for(const n of [1,2,3,4,5,6,7]){
  const art=d.createElement('article');art.className='bc-native-article';
  art.innerHTML=w.CfApostilaReading.render(realCfComplete(n),n);
  d.body.append(art);
  w.BCQuestionsRemovedUI.sweep();
  const text=art.textContent.replace(/\s+/g,' ');
  if(/Teste de compreensão\./i.test(realCfComplete(n))){
   assert.match(text,/Teste de compreensão\./i,'CF M'+n+' preservou o teste didático');
   assert.match(text,/Resposta comentada\./i,'CF M'+n+' preservou a explicação do teste');
  }
  assert.ok(![...art.querySelectorAll('h2,h3,h4')].some(h=>/(?:\d+\s*)?CINCO QUESTÕES DE REVISÃO/i.test(h.textContent)),'CF M'+n+' não pode apresentar seção antiga');
  if([3,4,5].includes(n))assert.doesNotMatch(text,/REVISÃO\s+1\s+FÁCIL|Certo ou errado: o voto obrigatório/i);
  art.remove();
 }
 await delay(140);dom.window.close();
});
test('ADM M04: tira o quiz final compactado sem apagar a teoria',async()=>{
 const dom=fixture(),w=dom.window,d=w.document,art=d.createElement('article');
 art.className='bc-native-article adm-apostila';
 const html=packedAdmComplete(4);
 assert.match(html,/CONTEÚDO COMPLETO\s*[—–-]\s*10 QUESTÕES/i,'verifica material real');
 art.innerHTML=html;d.body.append(art);
 const before=art.textContent.length;
 w.BCQuestionsRemovedUI.sweep();
 assert.doesNotMatch(art.textContent,/CONTEÚDO COMPLETO\s*[—–-]\s*10 QUESTÕES|1\s*[—–-]\s*FÁCIL/i);
 assert.ok(art.textContent.length>3000,'a teoria não pode ficar vazia');
 assert.ok(art.textContent.length<before,'o bloco antigo deve ser excluído');
 art.remove();await delay(140);dom.window.close();
});
test('Processual Civil M05, M06 e M08: leitor real não mostra testes antigos nem gabaritos soltos',async()=>{
 const dom=fixture(),w=dom.window,d=w.document,issues=[];
 w.CpcApostilaReading={transform:async html=>html};
 for(const n of [5,6,8]){
  const nn=String(n).padStart(2,'0');
  w.eval(read('content/cpc/m'+nn+'-native-data.js'));
  w.eval(read('ui/cpc-m'+nn+'-native-study-reader.js'));
  const api=w['CpcM'+nn+'NativeReader'];
  assert.ok(api?.open,'leitor CPC '+nn+' não carregado');
  await api.open('complete');
  const art=d.querySelector('.bc-native-reader-overlay .bc-native-article');
  assert.ok(art,'artigo CPC '+nn+' não montado');
  w.BCQuestionsRemovedUI.sweep();
  const text=art.textContent;
  if(/\bGabarito\s*:\s*(?:CERTO|ERRADO)\b/i.test(text)||/\bJULGUE CERTO OU ERRADO\b|TESTE RÁPIDO\s*[—–-]/i.test(text))issues.push('M'+nn);
  assert.ok(text.length>2500,'teoria CPC M'+nn+' preservada');
  api.close();
 }
 assert.deepEqual(issues,[],'Exercícios de certo/errado não podem sobrar no leitor');
 await delay(140);dom.window.close();
});
test('GMF Fortaleza M01: remove somente o parágrafo de fixação, sem tocar nas explicações',async()=>{
 const dom=fixture(),w=dom.window,d=w.document;
 w.eval(read('content/gmf/m01-full-v1.js'));
 const chapters=w.GMF_M01_FULL.fortaleza.chapters;
 assert.equal(chapters.length,4);
 const art=d.createElement('div');art.className='gmf-reader-prose';art.innerHTML=chapters[3].html;
 d.body.append(art);
 assert.match(art.textContent,/Fixação:\s*\(1\)/);
 w.BCQuestionsRemovedUI.sweep();
 assert.doesNotMatch(art.textContent,/Fixação:\s*\(1\)/);
 assert.match(art.textContent,/Fortaleza|município|litoral|revisão/i);
 art.remove();await delay(140);dom.window.close();
});
test('CF M01 e M06: referências vão depois do checklist mantendo todos os links',async()=>{
 const source=read('ui/cf-native-study-v2.js');
 const f=source.match(/function cfReferencesAtEnd\(raw\)\{[\s\S]*?\n\}/);
 assert.ok(f,'organização de fontes no leitor ausente');
 const organize=runInNewContext(f[0]+'\ncfReferencesAtEnd;');
 for(const n of [1,6]){
  const original=realCfComplete(n),fixed=organize(original);
  const ck=fixed.search(/^CHECKLIST DE DOMÍNIO\s*$/mi);
  const ref=[...fixed.matchAll(/^(?:\d{1,2}[.)]?\s*)?REFERÊNCIAS\s+(?:E FONTES DE CONSULTA|PARA CONFERÊNCIA)\s*$/gmi)].at(-1);
  assert.ok(ck>=0,'CF '+n+' tem checklist');
  assert.ok(ref?.index>ck,'referências devem vir depois do checklist do CF '+n);
  assert.equal(original.match(/https?:\/\/\S+/g)?.length,fixed.match(/https?:\/\/\S+/g)?.length,'todos os links preservados');
  assert.ok(fixed.length>original.length-10,'sem perda do texto original');
 }
});
