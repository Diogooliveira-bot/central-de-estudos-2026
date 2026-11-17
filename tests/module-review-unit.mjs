import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {JSDOM} from 'jsdom';
import {normalizeReviewKey,keyFromLabel,statusView} from '../lib/module-review.js';

const read=path=>readFileSync(new URL('../'+path,import.meta.url),'utf8');
const delay=(ms=25)=>new Promise(resolve=>setTimeout(resolve,ms));

test('chaves de revisão são válidas e não dependem do título completo do módulo',()=>{
 assert.equal(normalizeReviewKey('CF:01'),'cf:01');
 assert.equal(normalizeReviewKey('penal:17'),'penal:17');
 assert.equal(normalizeReviewKey('cf:00'),'');
 assert.equal(normalizeReviewKey('outro:01'),'');
 assert.equal(keyFromLabel('/central-v119.html|Direito Constitucional|Módulo 01 — Normas Constitucionais'),'cf:01');
 assert.equal(keyFromLabel('/central-v119.html|Direito Administrativo|Módulo 13 — Licitações'),'adm:13');
 assert.equal(keyFromLabel('/central-v119.html|Processo Penal|Módulo 04'),'cpp:04');
 assert.equal(keyFromLabel('/central-v119.html|Português|Módulo 24'),'pt:24');
 assert.equal(keyFromLabel('/central-v119.html|PEN M01 — Teoria do Crime|Teoria completa'),'penal:01');
 assert.equal(keyFromLabel('/central-v119.html|RLM M03 — Negação lógica|Revisão'),'rlm:03');
});
test('status não confunde revisão pendente com revisão concluída',()=>{
 assert.equal(statusView(null,'cf:01').reviewed,false);
 const value=statusView({module_key:'cf:01',reviewed:true,version:'2',reviewed_by_name:'ADM 2',last_edit_by_name:'ADM 1',last_revision:'3'},'cf:01');
 assert.equal(value.reviewed,true);
 assert.equal(value.reviewedBy,'ADM 2');
 assert.equal(value.lastEditedBy,'ADM 1');
 assert.equal(value.lastRevision,3);
});

function fixture(role='admin'){
 const dom=new JSDOM('<!doctype html><html><body><aside id="centralSidebar"><div class="nav"></div></aside><div id="studentMorePanel"><div class="student-more-grid"><button data-student-more-action="logout">Sair</button></div></div><main id="homeView"><div id="disciplinasHome"><h2>Disciplinas</h2></div><section id="bcFocusModules"><button class="bc-focus-module-card"><span class="bc-focus-module-number">Módulo 01</span><strong>Título 1</strong></button><button class="bc-focus-module-card"><span class="bc-focus-module-number">Módulo 02</span><strong>Título 2</strong></button></section></main><div class="bc-native-reader-overlay"><div class="bc-native-reader-title"><b>Direito Constitucional</b><small>Módulo 01 — Normas</small></div><div class="bc-native-reader-tools"></div></div></body></html>',{url:'https://app.basecompleta.com.br/central-v119.html',runScripts:'outside-only',pretendToBeVisual:true});
 const win=dom.window;win.requestAnimationFrame=fn=>fn();win.MutationObserver=class{observe(){}disconnect(){}};
 win.BaseCompletaFocusNavigation={state:{stage:'modules',subject:'cf'}};
 const calls=[];
 win.fetch=async(path,opts={})=>{
  calls.push({path,opts});
  if(String(path).includes('/api/auth'))return{ok:true,json:async()=>({authenticated:true,user:{role,name:'ADM 1'}})};
  if(opts.method==='POST')return{ok:true,json:async()=>({ok:true,item:{key:'cf:01',reviewed:true,version:3,reviewedBy:'ADM 1',reviewedAt:'2026-11-17T12:00:00Z'}})};
  return{ok:true,json:async()=>({items:[{key:'cf:01',reviewed:false,version:2,lastEditedBy:'ADM 2',lastEditedAt:'2026-11-17T10:00:00Z'}],events:[]})};
 };
 win.eval(read('ui/module-review-v1.js'));
 win.document.dispatchEvent(new win.Event('DOMContentLoaded'));
 return{win,calls,close:()=>dom.window.close()};
}
test('aluno não recebe check editorial nem acesso ao painel',async()=>{
 const app=fixture('aluno');await delay();
 assert.equal(app.win.document.querySelector('.bc-module-review-control'),null);
 assert.equal(app.win.document.querySelector('.bc-module-review-menu-button'),null);
 assert.equal(app.win.document.querySelector('.bc-review-card-wrap'),null);app.close();
});
test('administrador vê autor da edição e pode aprovar a revisão com controle de versão',async()=>{
 const app=fixture();await delay(40);
 const d=app.win.document,checkbox=d.querySelector('.bc-module-review-control input');
 assert.ok(checkbox);assert.equal(checkbox.checked,false);
 assert.match(d.querySelector('.bc-module-review-meta').textContent,/ADM 2/);
 assert.ok(d.querySelector('button.bc-module-review-menu-button'));
 assert.ok(d.querySelector('a.bc-review-home-link')?.href.endsWith('/tools/painel-revisao.html'));
 assert.equal(d.querySelectorAll('.bc-review-card-wrap').length,2);
 assert.equal(d.querySelectorAll('.bc-review-card-wrap input[type=checkbox]').length,2);
 checkbox.checked=true;checkbox.dispatchEvent(new app.win.Event('change',{bubbles:true}));await delay(40);
 const post=app.calls.find(c=>c.opts.method==='POST');assert.ok(post);
 assert.deepEqual(JSON.parse(post.opts.body),{key:'cf:01',reviewed:true,expectedVersion:2});
 app.close();
});
test('API autentica dois responsáveis no servidor e evita aprovação de revisão antiga',()=>{
 const api=read('api/content-review.js'),editor=read('api/content-editor.js');
 assert.match(api,/requireSession\(req,\['admin'\]\)/);
 assert.match(api,/sameOriginRequest\(req\)/);
 assert.match(api,/version=\$\{expected\}/);
 assert.match(api,/auth\.user\.id/);
 assert.match(api,/auth\.user\.name/);
 assert.match(editor,/last_edit_by=EXCLUDED\.last_edit_by/);
 assert.match(editor,/reviewed=FALSE/);
 assert.match(editor,/central_module_review_events/);
 assert.match(editor,/ensureReviewTables/);
});
test('painel lista catálogo completo e não recebe dados pessoais de alunos',()=>{
 const content=read('ui/review-catalog-v1.js');
 const cat={};
 new Function('window',content)(cat);
 assert.equal(cat.BCReviewCatalog.cf.length,15);
 assert.equal(cat.BCReviewCatalog.info.length,13);
 assert.equal(cat.BCReviewCatalog.pt.length,24);
 assert.equal(cat.BCReviewCatalog.rlm.length,15);
 assert.match(read('tools/painel-revisao.html'),/ui\/review-panel-v1\.js/);
});

test('reconhece número e siglas dos leitores nativos, com fallback no módulo aberto',async()=>{
 const app=fixture();await delay(30);
 const w=app.win,doc=w.document,reader=doc.querySelector('.bc-native-reader-overlay');
 reader.querySelector('.bc-native-reader-title b').textContent='PEN M01 — Teoria do Crime';
 reader.querySelector('.bc-native-reader-title small').textContent='Teoria completa';
 assert.equal(w.BCModuleReview.keyOf(reader),'penal:01');
 reader.querySelector('.bc-native-reader-title b').textContent='RLM M03 — Negação de proposições';
 assert.equal(w.BCModuleReview.keyOf(reader),'rlm:03');
 reader.querySelector('.bc-native-reader-title b').textContent='Português • Sons e letras';
 w.BaseCompletaFocusNavigation.state={stage:'reading',subject:'pt',moduleNumber:'Módulo 02'};
 assert.equal(w.BCModuleReview.keyOf(reader),'pt:02');
 assert.equal(w.BCModuleReview.keyForList('info','Módulo 13',0),'info:13');
 app.close();
});
test('os botões de marcar revisão não abrem a leitura do módulo',async()=>{
 const app=fixture();await delay(40);
 const doc=app.win.document,card=doc.querySelector('.bc-review-card-wrap>.bc-focus-module-card');
 let clicks=0;card.addEventListener('click',()=>clicks++);
 const check=doc.querySelector('.bc-review-card-wrap input[type=checkbox]');
 check.click();await delay(20);
 assert.equal(clicks,0);
 const posts=app.calls.filter(c=>c.opts.method==='POST');
 assert.equal(posts.length,1);
 assert.equal(JSON.parse(posts[0].opts.body).key,'cf:01');
 app.close();
});
test('o menu administrativo é exibido em Mais, não na navegação escondida dos alunos',async()=>{
 const app=fixture();await delay(30);
 const doc=app.win.document;
 const btn=doc.querySelector('#studentMorePanel .student-more-grid>.bc-module-review-menu-button');
 assert.ok(btn);
 assert.equal(doc.querySelector('#centralSidebar .nav>.bc-module-review-entry'),null);
 assert.equal(doc.querySelectorAll('.bc-module-review-menu-button').length,1);
 app.close();
});
