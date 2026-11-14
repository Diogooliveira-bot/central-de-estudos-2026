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
test('bootstrap e cache ativam a retirada das antigas sem tocar nas rotas da Lei em Dia e do QC/TEC',()=>{
 const index=read('index.html'),boot=read('central-v119.html'),sw=read('sw.js');
 const man=JSON.parse(read('central-offline-files-v66172.json'));
 const vercel=JSON.parse(read('vercel.json'));
 assert.match(index,/ui\/old-questions-removed-v1\.js\?v=20261114-mascote-v9/);
 assert.match(index,/ui\/old-questions-removed-v1\.css\?v=20261114-mascote-v9/);
 assert.equal(man.build,'20261114-mascote-v9');
 assert(man.files.includes('/ui/old-questions-removed-v1.js?v=20261114-mascote-v9'));
 assert(boot.includes("var BUILD='20261114-mascote-v9'"));
 assert(sw.includes("var CACHE='central-20261114-mascote-v9'"));
 for(const route of ['/central-de-questoes','/tools/decorando.html','/tools/lei-em-dia-gratis.html'])
  assert(!(vercel.redirects||[]).some(x=>x.source===route),'rota preservada: '+route);
 assert.match(read('ui/cf-native-study-v2.js'),/function openDecorando\(n\)\{const topic=/);
 assert.match(read('ui/cpp-native-study-v1.js'),/\+leiEmDia\(n\)\+linksSlot\(n\)\+/);
});
