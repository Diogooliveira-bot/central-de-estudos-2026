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
run('content/cf/cf-ec141-extras.js');
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
 assert.ok(index.includes('ui/cf-apostila-reading-v1.js?v=20261119cfpremiumlaw2'));
 assert.ok(central.includes("path==='ui/cf-apostila-reading-v1.js'"));
 assert.ok(ui.includes('g.CfApostilaReading.render(d.complete,n)'));
 assert.ok(ui.includes("stdMark(100)")&&ui.includes("completeRead:true"));
 assert.ok(guided.includes('bc-apostila-v20261111'));
 assert.ok(!guided.includes('data-bc-guided-mode="review"'));
 assert.ok(guided.includes('apostilaSintese'));
 // A apostila contínua registra a leitura ao final (chamada opcional, se o módulo já carregou).
 assert.match(guided,/CfNativeStudy\?\.markSummaryRead\?\.\(n\)/);
 assert.ok(ui.includes('markSummaryRead(n){'));
 assert.ok(css.includes('.cf-apostila-law'));
 assert.ok(css.includes('.cf-m01')===false);
});


test('CF completa: dispositivo constitucional aparece junto do parágrafo, sem lei externa ou apêndice geral',()=>{
 const e=context.window.CfApostilaReading;
 const text='1. LEGALIDADE\n\nNo art. 5º, II, a Constituição limita a obrigação legal.\n\nO art. 60, § 4º, I, protege a forma federativa.\n\nA LINDB, art. 2º, trata da vigência das leis.';
 const html=e.render(text,1);
 assert.match(html,/cf-apostila-law-inline/);
 assert.match(html,/ninguém será obrigado a fazer ou deixar de fazer/);
 assert.match(html,/a forma federativa de Estado/);
 assert.doesNotMatch(html,/homens e mulheres são iguais em direitos/);
 assert.doesNotMatch(html,/Lei seca do módulo/);
 assert.doesNotMatch(html,/lei revogada não se restaura/);
 const first=html.indexOf('art. 5º, II, a Constituição limita');
 const cite=html.indexOf('ninguém será obrigado');
 const second=html.indexOf('O art. 60');
 assert.ok(first>=0&&cite>first&&second>cite,'inciso deve vir ANTES do próximo assunto');
 const n=2,full=e.render(context.window.BASE_NATIVE_CONTENT.cf.m02.complete,n);
 assert.match(full,/cf-apostila-law-inline/);
 assert.doesNotMatch(full,/Lei seca do módulo/);
 const atual=e.render('1. DIREITOS SOCIAIS\n\nO art. 7º, XIII, disciplina a duração do trabalho.',3);
 assert.match(atual,/40 \(quarenta\) horas semanais/);
 assert.doesNotMatch(atual,/44 \(quarenta e quatro\) horas semanais/);
 const novo=e.render('1. SAÚDE\n\nO art. 200 trata das competências do SUS.',14);
 assert.match(novo,/Ao sistema único de saúde compete/);

});


test('CF: conteúdo salvo em nuvem recebe novamente lei seca contextual sem substituir texto do editor',()=>{
 const reader=context.window.CfApostilaReading;
 const captured=[];
 function paragraph(text){
  return {tagName:'P',textContent:text,nextElementSibling:null,
   closest(){return null},
   insertAdjacentHTML(position,html){
    assert.equal(position,'afterend');
    captured.push(html);
    this.nextElementSibling={matches(selector){return selector==='.cf-apostila-law-inline'}};
   }};
 }
 const heading={tagName:'H2',textContent:'Direitos fundamentais'};
 const p1=paragraph('O art. 5º, II, trata da legalidade constitucional.');
 const p2=paragraph('O art. 60, § 4º, I, protege a forma federativa.');
 const p3=paragraph('A LINDB, art. 2º, § 3º, estabelece uma regra de vigência.');
 const untouched='Texto publicado pelo administrador e mantido na página';
 const p4=paragraph(untouched);
 const article={querySelector(){return null},querySelectorAll(){return [heading,p1,p2,p3,p4]}};
 assert.equal(reader.ensureInline(article),2);
 assert.equal(captured.length,2);
 assert.match(captured[0],/ninguém será obrigado a fazer ou deixar de fazer alguma coisa/);
 assert.match(captured[1],/a forma federativa de Estado/);
 assert.ok(captured.every(s=>s.includes('data-bc-cf-auto-law="1"')));
 assert.equal(reader.ensureInline(article),0,'nenhum dispositivo deve ser duplicado');
 assert.equal(p4.textContent,untouched,'as edições do administrador não podem mudar');
 const editor=read('ui/visual-editor-v1.js');
 assert.match(editor,/article\.replaceChildren\(frag\);if\(article\.closest\('#cf-native-reader'\)\)window\.CfApostilaReading\?\.ensureInline\?\.\(article\)/);
 assert.match(editor,/clone\.querySelectorAll\('\[data-bc-cf-auto-law\]'\)/,'não persistir excertos automáticos como edição manual');
 const central=read('central-v119.html');
 assert.match(central,/visual-editor-v1\.js\?v=20261119cfleisync1/);
});
