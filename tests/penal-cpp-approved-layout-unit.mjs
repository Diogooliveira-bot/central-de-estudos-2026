import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import { JSDOM } from 'jsdom';

const root=new URL('../',import.meta.url);
const read=path=>fs.readFileSync(new URL(path,root),'utf8');

test('Penal reaproveita os leitores, links e dados no padrão vertical aprovado',()=>{
  const dom=new JSDOM('<!doctype html>'+[
    '<div id="subjects"><section class="subject open" data-id="penal">',
    '<div class="subject-body"><section class="cf-module open" data-cf="p1">',
    '<button class="cf-module-head"></button><div class="cf-module-body">',
    '<div class="cf-module-bar"><span style="width:0%"></span></div>',
    '<div class="cf-subtitle">Aplicação da lei penal e princípios.</div>',
    '<div class="pen-full-entry"><div><strong>Teoria integral</strong><small>Conteúdo completo validado em 12 seções.</small></div><button onclick="openPenalFullTheory(&quot;p1&quot;)">Abrir teoria completa</button></div>',
    '<div class="cf-steps">',
    '<section class="cf-step"><div class="cf-step-head"><div class="cf-step-no">2</div><div class="cf-step-copy"><b>Leitura orientada</b><small>Leitura da legislação penal.</small></div></div><div class="cf-step-body"><div class="cf-reading"><strong>CP, arts. 1º a 12.</strong><ul><li>Observe a anterioridade.</li></ul></div><div class="cf-actions"><button onclick="openLeiSecaEnxuta(null,&quot;penal&quot;,&quot;pen-m01&quot;)">Lei em Dia deste módulo</button><button onclick="penalUpdateWeek(&quot;p1&quot;,{reading:true})">Marcar concluída</button></div></div></section>',
    '<section class="cf-step"><div class="cf-step-head"><div class="cf-step-no">3</div><div class="cf-step-copy"><b>Teoria completa</b><small>Resumo rápido do módulo.</small></div></div><div class="cf-step-body"><div class="cf-theory-grid"><details class="cf-theory" open><summary>Legalidade</summary><div>Conteúdo preservado.</div></details><details class="cf-theory"><summary>Anterioridade</summary><div>Conteúdo preservado.</div></details></div><div class="cf-actions"><button onclick="penalUpdateWeek(&quot;p1&quot;,{theory:true})">Marcar teoria concluída</button></div></div></section>',
    '<section class="cf-step"><div class="cf-step-head"><div class="cf-step-no">5</div><div class="cf-step-copy"><b>Aprofundamento FCC</b><small>Distinções e exceções.</small></div></div><div class="cf-step-body"><div class="cf-advanced-grid">Material avançado.</div><div class="cf-actions"><button onclick="penalUpdateWeek(&quot;p1&quot;,{deep:true})">Marcar aprofundamento concluído</button></div></div></section>',
    '</div>',
    '<details class="cf-resources" open><summary>Recursos do módulo</summary><div class="cf-resource-grid">',
    '<div class="cf-resource-box"><h4>Filtro do TEC</h4><a href="https://tec.test/filter">Filtro oficial</a><button onclick="openPenalResource(&quot;p1&quot;,&quot;qc&quot;)">Abrir QC</button><button onclick="openPenalResource(&quot;p1&quot;,&quot;tec&quot;)">+ TEC</button></div>',
    '<div class="cf-resource-box"><h4>Lei em Dia</h4><button onclick="openLeiSecaEnxuta(null,&quot;penal&quot;,&quot;pen-m01&quot;)">Abrir artigos</button></div>',
    '<div class="cf-resource-box"><h4>Vade Mecum</h4><button onclick="openEmbeddedTool(&quot;vade&quot;,{})">Abrir</button></div>',
    '<div class="cf-resource-box"><h4>Cadernos TEC</h4><button onclick="centralSidebarAction(&quot;tec-cadernos&quot;)">Abrir</button></div>',
    '<div class="cf-resource-box"><h4>Anotações do módulo</h4><textarea id="cf-note-p1">anotação preservada</textarea><button onclick="savePenalNote(&quot;p1&quot;)">Salvar anotação</button></div>',
    '<section class="bc-module-rounds"><input value="15"></section>',
    '</div></details></div></section></div></section></div>'
  ].join(''),{url:'https://study.test/',runScripts:'dangerously'});
  const w=dom.window;
  const oldRounds='[{"done":"10","correct":"8"},{"done":"5","correct":"4"}]';
  const oldResources='{"qc":"https://qconcursos.test/filter"}';
  w.localStorage.setItem('central-v6:module-rounds:penal:p1',oldRounds);
  w.localStorage.setItem('central-v6:penal-res:p1',oldResources);
  w.localStorage.setItem('central-v6:penal-note:p1','anotação preservada');
  w.PENAL_WEEKS=[{id:'p1',num:1,title:'Aplicação da lei penal'}];
  w.penalWeekState=()=>({reading:true,theory:false,deep:false});
  w.penalPool=()=>Array.from({length:12},(_,i)=>({id:'p1-'+i,real:true}));
  w.todayISO=()=> '2026-10-19';
  w.key=(uid,kind)=>'test:'+uid+':'+kind;
  w.requestAnimationFrame=callback=>callback();
  w.startPenalQuiz=(...args)=>{w.lastPenalQuiz=args};
  w.eval(read('ui/discipline-standard.js'));
  w.CentralDisciplineStandard.refresh();

  const body=w.document.querySelector('.subject[data-id="penal"] .cf-module-body');
  assert.ok(body.querySelector(':scope > .penal-approved-progress'));
  assert.ok(body.querySelector(':scope > .penal-approved-reading'));
  assert.equal(body.querySelector(':scope > .pen-full-entry .penal-approved-primary').textContent,'Estudar conteúdo');
  assert.equal(body.querySelector(':scope > .penal-approved-review .cf-step-copy b').textContent,'Versão de revisão');
  assert.equal(body.querySelector(':scope > .penal-approved-review [data-penal-approved-questions="5"]').textContent,'Resolver 5 questões');
  assert.equal(body.querySelector(':scope > .pen-full-entry [data-penal-approved-questions="10"]').textContent,'Resolver 10 questões');
  const ordered=[...body.children].filter(node=>node.matches('.penal-approved-progress,.penal-approved-reading,.pen-full-entry,.penal-approved-review,.ds-module-footer')).map(node=>node.classList.contains('pen-full-entry')?'complete':node.classList.contains('penal-approved-review')?'review':node.classList.contains('penal-approved-reading')?'reading':node.classList.contains('penal-approved-progress')?'progress':'footer');
  assert.deepEqual(ordered.slice(0,5),['progress','reading','complete','review','footer']);
  assert.equal(body.querySelectorAll('.ds-notes textarea').length,1);
  assert.equal(body.querySelector('.ds-notes textarea').value,'anotação preservada');
  assert.ok(body.querySelector('.ds-footer-tools').textContent.includes('Lei em Dia'));
  assert.ok(body.querySelector('.cf-resources a[href="https://tec.test/filter"]'));
  assert.ok(body.querySelector('.cf-resources button[onclick*="openPenalResource"]'));
  assert.equal(body.querySelector('.cf-resources button[onclick*="openPenalResource"]')?.textContent,'Abrir QC');
  assert.equal(body.querySelector('.bc-module-rounds'),null);
  assert.equal(body.querySelector('.ds-footer-questions'),null);
  assert.equal(w.localStorage.getItem('central-v6:module-rounds:penal:p1'),oldRounds);
  assert.equal(w.localStorage.getItem('central-v6:penal-res:p1'),oldResources);
  assert.equal(w.localStorage.getItem('central-v6:penal-note:p1'),'anotação preservada');
  assert.match(body.querySelector('.penal-approved-progress').textContent,/67% · 2\/3 rodadas/);
  body.querySelector('[data-penal-approved-questions="10"]').click();
  assert.deepEqual(w.lastPenalQuiz,['p1','fixation',10]);
  body.querySelector('[data-penal-approved-questions="5"]').click();
  assert.deepEqual(w.lastPenalQuiz,['p1','intermediate',5]);
  dom.window.close();
});


test('Penal transforma o renderizador nativo em cards aprovados e preserva ações',()=>{
  const dom=new JSDOM('<!doctype html>'+[
    '<div id="subjects"><section class="subject open" data-id="penal"><div class="subject-body">',
    '<section class="cf-module open" data-cf="p1"><button class="cf-module-head"></button><div class="cf-module-body">',
    '<div class="cf-subtitle">Princípios penais; interpretação; analogia.</div>',
    '<section class="bc-native-materials bc-native-materials-static" data-bc-native-m01>',
    '<section class="bc-native-metrics"><article>Indicadores redundantes</article></section>',
    '<div class="bc-native-materials-head"><b>Materiais do módulo</b></div>',
    '<div class="bc-native-material-grid">',
    '<button class="bc-native-material-card" data-native-kind="summary" onclick="BaseNativeReader.open(\'summary\')"><span><strong>Conteúdo resumido</strong><small>Primeira leitura, revisão rápida e revisão ativa.</small></span></button>',
    '<button class="bc-native-material-card" data-native-kind="complete" onclick="BaseNativeReader.open(\'complete\')"><span><strong>Conteúdo completo</strong><small>Teoria integral, índice, busca e progresso de leitura.</small></span></button>',
    '<button class="bc-native-material-card" data-native-kind="mindmap" onclick="BaseMindMap.open(\'penal\',\'p1\')">Mapa mental</button>',
    '</div></section>',
    '<div class="cf-resource-box"><h4>Lei em Dia</h4><button>Abrir questões deste módulo</button></div>',
    '</div></section></div></section></div>'
  ].join(''),{url:'https://study.test/',runScripts:'dangerously'});
  const w=dom.window;
  const readingState={reading:false,theory:false,deep:false};
  const oldRounds='[{"done":"10","correct":"8"}]';
  w.localStorage.setItem('central-v6:module-rounds:penal:p1',oldRounds);
  w.localStorage.setItem('central-v6:penal-note:p1','anotação nativa preservada');
  w.PENAL_WEEKS=[{id:'p1',num:1,title:'Princípios',read:'CF, art. 5º; CP, arts. 1º e 12.',read_focus:['Separe legalidade e anterioridade.']}];
  w.penalWeekState=()=>({...readingState});
  w.penalUpdateWeek=(id,patch)=>Object.assign(readingState,patch);
  w.penalPool=()=>Array.from({length:12},(_,i)=>({id:'p1-'+i,real:true}));
  w.startPenalQuiz=(...args)=>{w.lastPenalQuiz=args};
  w.BaseNativeReader={theoryStats:()=>({pct:25}),open:mode=>{w.lastOpenedReader=mode}};
  w.BaseMindMap={open(){}};
  w.todayISO=()=> '2026-10-19';
  w.key=(uid,kind)=>'test:'+uid+':'+kind;
  w.requestAnimationFrame=callback=>callback();
  w.eval(read('ui/discipline-standard.js'));
  w.CentralDisciplineStandard.refresh();

  const body=w.document.querySelector('.subject[data-id="penal"] .cf-module-body');
  const materials=body.querySelector(':scope > .bc-native-materials');
  assert.ok(body.querySelector(':scope > .penal-approved-progress'));
  assert.ok(body.querySelector(':scope > .penal-approved-reading'));
  assert.equal(materials.querySelector('.bc-native-metrics'),null);
  assert.equal(materials.querySelector('.bc-native-materials-head'),null);
  assert.deepEqual([...materials.querySelectorAll('.penal-approved-card')].map(card=>card.dataset.penalApprovedCard),['complete','summary']);
  assert.equal(materials.querySelector('[data-penal-approved-card="complete"] h3').textContent,'Teoria completa');
  assert.equal(materials.querySelector('[data-penal-approved-card="complete"] .penal-approved-primary').textContent,'Estudar conteúdo');
  assert.equal(materials.querySelector('[data-penal-approved-card="summary"] h3').textContent,'Versão de revisão');
  assert.equal(materials.querySelector('[data-penal-approved-card="summary"] .penal-approved-primary').textContent,'Revisar conteúdo');
  assert.equal(materials.querySelector('[data-penal-approved-card="complete"] [data-penal-approved-questions="10"]').textContent,'Resolver 10 questões');
  assert.equal(materials.querySelector('[data-penal-approved-card="summary"] [data-penal-approved-questions="5"]').textContent,'Resolver 5 questões');
  assert.ok(materials.querySelector('[data-native-kind="mindmap"]'),'recurso nativo de mapa mental preservado');
  assert.match(body.querySelector('.penal-approved-progress').textContent,/25% concluído/);
  const reading=body.querySelector('.penal-approved-reading');
  assert.match(reading.textContent,/CF, art\. 5º; CP, arts\. 1º e 12/);
  assert.match(reading.textContent,/Separe legalidade e anterioridade/);
  reading.querySelector('[data-penal-reading-toggle]').click();
  assert.equal(readingState.reading,true);
  materials.querySelector('[data-penal-approved-card="complete"] .penal-approved-primary').click();
  assert.equal(w.lastOpenedReader,'complete');
  materials.querySelector('[data-penal-approved-card="complete"] [data-penal-approved-questions="10"]').click();
  assert.deepEqual(w.lastPenalQuiz,['p1','fixation',10]);
  materials.querySelector('[data-penal-approved-card="summary"] [data-penal-approved-questions="5"]').click();
  assert.deepEqual(w.lastPenalQuiz,['p1','intermediate',5]);
  const footer=body.querySelector('.ds-module-footer');
  assert.ok(footer);
  // Repeated native renders must keep the note before optional resources and review.
  w.CentralDisciplineStandard.refresh();
  assert.equal(footer.firstElementChild,footer.querySelector('.ds-notes'));
  assert.equal(footer.querySelectorAll('.ds-notes textarea').length,1);
  const css=read('ui/discipline-standard.css');
  assert.match(css,/\.penal-approved-card\.penal-approved-review\s*\{[^}]*display:grid/s);
  assert.equal(footer.querySelector('.ds-notes textarea').value,'anotação nativa preservada');
  assert.ok(footer.querySelector('.cf-resource-box h4')?.textContent.includes('Lei em Dia'));
  assert.equal(w.localStorage.getItem('central-v6:module-rounds:penal:p1'),oldRounds);
  assert.equal(w.localStorage.getItem('central-v6:penal-note:p1'),'anotação nativa preservada');
  dom.window.close();
});

test('Processo Penal rende os 22 módulos na ordem aprovada sem formulário manual',()=>{
  const modules=Array.from({length:22},(_,i)=>({uid:'cpp-m'+String(i+1).padStart(2,'0'),number:i+1,title:'Módulo '+String(i+1).padStart(2,'0'),summaryQuestions:5,completeQuestions:10,tec:['cpp-01'],spriteX:0,spriteY:i*900,spriteWidth:600,spriteHeight:848}));
  const index={modules,tecs:{'cpp-01':{id:'cpp-01',name:'CPP 01 - Filtros oficiais',url:'https://tec.test/cpp-01',count:59}},sprite:{src:'/assets/cpp/infograficos.webp',width:1200,height:20000}};
  const storage=new Map([['central-v6:cpp:curso22:v1',JSON.stringify({modules:{1:{rounds:[{valid:'12',correct:'9'}]}}})]]);
  const localStorage={getItem:key=>storage.get(key)||null,setItem:(key,value)=>storage.set(key,String(value))};
  const bar={style:{width:''}},count={textContent:''},pct={textContent:'',classList:{toggle(){}}};
  const body={dataset:{},innerHTML:'',querySelector:selector=>selector==='.subject-bar span'?bar:null};
  const subject={querySelector:selector=>selector==='.subject-body'?body:selector==='.subject-count'?count:selector==='.subject-pct'?pct:null};
  const document={readyState:'loading',querySelector:selector=>selector==='.subject[data-id="cpp"]'?subject:null,addEventListener(){}};
  const window={CPP_NATIVE_INDEX:index,CPP_NATIVE_CONTENT:{}};
  const context={window,document,localStorage,console,MutationObserver:class{observe(){}},setTimeout(){},URL,Image:function(){}};
  vm.runInNewContext(read('ui/cpp-native-study-v1.js'),context);
  assert.equal(window.CppNative.render(),true);
  const html=body.innerHTML;
  assert.equal((html.match(/data-cpp-native-module=/g)||[]).length,22);
  const first=html.slice(html.indexOf('data-cpp-native-module="1"'),html.indexOf('data-cpp-native-module="2"'));
  const progress=first.indexOf('adm-native-progress-panel');
  const guided=first.indexOf('adm-native-guided-reading');
  const complete=first.indexOf('data-kind="complete"');
  const summary=first.indexOf('data-kind="summary"');
  const infographic=first.indexOf('data-kind="infographic"');
  const notes=first.indexOf('adm-native-notes');
  const tools=first.indexOf('adm-native-module-tools');
  const tec=first.indexOf('data-cpp-tec-panel');
  assert.ok(progress>=0&&progress<guided&&guided<complete&&complete<summary&&summary<infographic&&infographic<notes&&notes<tools&&tools<tec);
  assert.match(first,/Estudar conteúdo/);
  assert.match(first,/Resolver 10 questões/);
  assert.match(first,/Revisar conteúdo/);
  assert.match(first,/Resolver 5 questões/);
  assert.match(first,/Visualizar infográfico/);
  assert.match(first,/Lei em Dia/);
  assert.doesNotMatch(first,/Registrar questões externas|cpp-round-done|adm-native-external-entry/);
  assert.match(read('ui/cpp-native-study-v1.js'),/drawImage\(img,-m\.spriteX,-m\.spriteY\)/);
  assert.match(read('ui/cpp-native-study-v1.js'),/Baixar imagem/);
  assert.match(read('ui/cpp-native-study-v1.js'),/zoomImage,downloadImage/);
  assert.equal(localStorage.getItem('central-v6:cpp:curso22:v1'),JSON.stringify({modules:{1:{rounds:[{valid:'12',correct:'9'}]}}}));
});
