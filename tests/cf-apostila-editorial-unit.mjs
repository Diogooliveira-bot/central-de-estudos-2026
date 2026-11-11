import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import {fileURLToPath} from 'node:url';

const ROOT=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const read=p=>fs.readFileSync(path.join(ROOT,p),'utf8');
const context=vm.createContext({window:{}});
const run=p=>new vm.Script(read(p),{filename:p}).runInContext(context);
run('content/cf/cf-teoria-guiada-lei-seca.js');
run('ui/cf-apostila-reading-v1.js');
for(let n=1;n<=15;n++)run('content/cf/m'+String(n).padStart(2,'0')+'-native-data.js');

test('CF: os 15 módulos mantêm texto completo e receberam renderização sem cards repetitivos',()=>{
 const engine=context.window.CfApostilaReading;
 assert.ok(engine&&typeof engine.render==='function');
 for(let n=1;n<=15;n++){
  const data=context.window.BASE_NATIVE_CONTENT.cf['m'+String(n).padStart(2,'0')];
  assert.ok(data.complete.length>10000,'texto completo ausente M'+n);
  const html=engine.render(data.complete,n);
  assert.match(html,/class="cf-apostila"/,'falta leitor editorial M'+n);
  assert.match(html,/<h2>/,'falta capítulo principal M'+n);
  assert.match(html,/<p>/,'falta explicação M'+n);
  assert.doesNotMatch(html,/class="cf-native-callout/,'cards antigos na completa M'+n);
  assert.ok(!html.includes('<script'),'conteúdo HTML inesperado M'+n);
  assert.ok(!html.includes('undefined'),'dado ausente M'+n);
  if(n>=8)assert.doesNotMatch(html,/Esta apostila reescreve o texto original/,'texto editorial M'+n);
 }
});

test('CF M01: capítulos, subcapítulos e legislação permanecem acessíveis',()=>{
 const e=context.window.CfApostilaReading;
 const d=context.window.BASE_NATIVE_CONTENT.cf.m01;
 const html=e.render(d.complete,1);
 assert.match(html,/<h2>1\. PARA QUE EXISTE UMA CONSTITUIÇÃO<\/h2>/);
 assert.match(html,/<h3>1\.1\. O PROBLEMA VEM ANTES DO CONCEITO<\/h3>/);
 assert.match(html,/Constitucionalismo é o movimento/);
 assert.match(html,/class="cf-apostila-law"/);
 assert.ok(d.questions?.complete?.length===10);
 assert.ok(d.questions?.summary?.length===5);
});

test('CF M12: linhas numeradas da tabela não viram cabeçalhos',()=>{
 const e=context.window.CfApostilaReading;
 const d=context.window.BASE_NATIVE_CONTENT.cf.m12;
 const html=e.render(d.complete,12);
 assert.match(html,/<div class="cf-apostila-table-scroll"/);
 assert.match(html,/<h3>/,'subtítulos precisam ser distintos de capítulos');
 assert.match(html,/<td>1<\/td>/);
 assert.doesNotMatch(html,/<h2>1<\/h2>/);
 assert.match(html,/Controle de constitucionalidade|controle de constitucionalidade/i);
 assert.ok(d.questions?.complete?.length===10);
});

test('CF: código da central adia o carregamento junto com a disciplina e mantém controle de progresso',()=>{
 const index=read('index.html');
 const central=read('central-v119.html');
 const ui=read('ui/cf-native-study-v2.js');
 const guided=read('content/cf/cf-teoria-guiada-reader-v1.js');
 const css=read('ui/cf-apostila-reading-v1.css');
 assert.ok(index.includes('ui/cf-apostila-reading-v1.js?v=20261109cf15a'));
 assert.ok(central.includes("path==='ui/cf-apostila-reading-v1.js'"));
 assert.ok(ui.includes('g.CfApostilaReading.render(d.complete,n)'));
 assert.ok(ui.includes("stdMark(100)")&&ui.includes("completeRead:true"));
 assert.ok(guided.includes('bc-apostila-v20261111'));
 assert.ok(!guided.includes('data-bc-guided-mode="review"'));
 assert.ok(guided.includes('apostilaSintese'));
 assert.ok(guided.includes("markSummaryRead(n)"));
 assert.ok(css.includes('.cf-apostila-law'));
 assert.ok(css.includes('.cf-m01')===false);
});
