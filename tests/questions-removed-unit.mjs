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
 const dom=new JSDOM('<!doctype html><html><head></head><body><nav id="centralSidebar"><div class="nav"><button>Lei em Dia</button><button>Agenda</button></div></nav><main id="subjects"><div data-civil-native-module="1"><button>Estudar conteúdo</button><button class="cv-standard-quiz">Resolver 10 questões</button><section class="bcq-module-panels">Cadernos</section><textarea id="note"></textarea></div></main><div class="bc-native-article"><h2>Teoria</h2><p>Texto de teoria jurídica preservado.</p><section><h3>Questões de fixação</h3><p>Questão 1: qual alternativa?</p><p>Gabarito: A</p></section></div></body></html>',{url:'https://app.basecompleta.com.br/central-v119.html',runScripts:'outside-only',pretendToBeVisual:true});
 dom.window.eval(read('ui/questions-removed-v1.js'));
 dom.window.document.dispatchEvent(new dom.window.Event('DOMContentLoaded'));
 return dom;
}
test('remove todos os atalhos de questões sem apagar apostilas, notas ou respostas salvas',async()=>{
 const dom=fixture(),w=dom.window,d=w.document;
 w.localStorage.setItem('BC_USER_V1:123:historico-questoes','7/10');
 await delay(90);
 assert.equal(w.BCQuestionsRemoved,true);
 assert.equal(d.querySelector('.cv-standard-quiz'),null);
 assert.equal(d.querySelector('.bcq-module-panels'),null);
 assert.equal(d.querySelector('.bc-native-article section'),null);
 assert.equal(d.getElementById('note').tagName,'TEXTAREA');
 assert.match(d.body.textContent,/Texto de teoria jurídica preservado/);
 assert.match(d.body.textContent,/Estudar conteúdo/);
 assert.match(d.body.textContent,/Agenda/);
 assert.equal(w.localStorage.getItem('BC_USER_V1:123:historico-questoes'),'7/10');
 dom.window.close();
});
test('remove questões inseridas após o primeiro carregamento',async()=>{
 const dom=fixture(),w=dom.window;await delay(60);
 const el=w.document.querySelector('[data-civil-native-module]');
 el.insertAdjacentHTML('beforeend','<button class="adm-cf-quiz">Resolver 5 questões</button><div class="cpp-native-question">Questão 1</div>');
 await delay(120);
 assert.equal(el.querySelector('.adm-cf-quiz'),null);
 assert.equal(el.querySelector('.cpp-native-question'),null);
 dom.window.close();
});
test('bootstrap, cache e rotas passam a ativar ambiente sem questões',()=>{
 const index=read('index.html'),boot=read('central-v119.html'),sw=read('sw.js');
 const man=JSON.parse(read('central-offline-files-v66172.json'));
 const vercel=JSON.parse(read('vercel.json'));
 assert.match(index,/ui\/questions-removed-v1\.js\?v=20261112-sem-questoes-v1/);
 assert.match(index,/ui\/questions-removed-v1\.css\?v=20261112-sem-questoes-v1/);
 assert.equal(man.build,'20261112-sem-questoes-v1');
 assert(man.files.includes('/ui/questions-removed-v1.js?v=20261112-sem-questoes-v1'));
 assert(man.files.includes('/ui/questions-removed-v1.css?v=20261112-sem-questoes-v1'));
 assert(boot.includes("var BUILD='20261112-sem-questoes-v1'"));
 assert(sw.includes("var CACHE='central-20261112-sem-questoes-v1'"));
 for(const route of ['/central-de-questoes','/tools/decorando.html','/tools/lei-em-dia-gratis.html'])
  assert(vercel.redirects.some(x=>x.source===route&&x.destination==='/central-v119.html'));
 assert.match(read('ui/cf-native-study-v2.js'),/if\(g\.BCQuestionsRemoved\)\{const done=\[legacyReadingDone\(n\),x\.summaryRead,x\.completeRead\]/);
});
