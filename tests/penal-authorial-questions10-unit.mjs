import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
const root=new URL('../',import.meta.url);
const read=name=>fs.readFileSync(new URL(name,root),'utf8');
function extractObject(text,key){
 const p=text.indexOf(key);if(p<0)return null;const start=text.indexOf('{',p+key.length);
 let level=0,quoted=false,escaped=false;
 for(let i=start;i<text.length;i++){
  const ch=text[i];
  if(quoted){if(escaped)escaped=false;else if(ch==='\\')escaped=true;else if(ch==='"')quoted=false;continue}
  if(ch==='"'){quoted=true;continue}
  if(ch==='{')level++;
  if(ch==='}'&&!--level)return JSON.parse(text.slice(start,i+1));
 }return null;
}
function policies(){
 const w={};const context=vm.createContext({window:w,document:{addEventListener(){}},console});
 vm.runInContext(read('ui/central-internal-question-policy-v1.js'),context);
 vm.runInContext(read('ui/central-authorial-quiz-v1.js'),context);
 return w;
}
test('Os 17 módulos de Penal têm dez questões autorais válidas e independentes',()=>{
 const w=policies();let total=0;
 for(let n=1;n<=17;n++){
  const name='content/penal/m'+String(n).padStart(2,'0')+'-native-data.js',text=read(name);
  const q=extractObject(text,'internalQuestions:')||extractObject(text,'internalQuestions":');
  assert.ok(q,name+' sem dados');
  assert.equal(q.summary.length,5,name+' resumo');assert.equal(q.complete.length,10,name+' completo anterior');
  const list=w.CentralAuthorialQuiz.lesson(q);
  assert.ok(list,name+' bateria inválida');
  assert.equal(list.length,10,name);
  const key=x=>x.q.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().trim();
  assert.equal(new Set(list.map(key)).size,10,name+' contém enunciados repetidos');
  for(const item of list)assert.ok(w.CentralAuthorialQuiz.valid(item),name+' contém item inválido');
  total+=list.length;
 }
 assert.equal(total,170);
});
test('Questões não aparecem mais dentro dos 17 leitores Penal; históricos permanecem nas fontes',()=>{
 for(let n=1;n<=17;n++){
  const key=String(n).padStart(2,'0'),path='ui/native-study-reader'+(n===1?'':'-m'+key)+'.js';
  const reader=read(path),shell=read('ui/native-module-m'+key+'-shell.js');
  assert.match(reader,/function modeQuestions\(data,mode\)\{[\s\S]*?return \[\];[\s\S]*?\}/,path);
  assert.match(shell,/data-native-kind="authorial10"/,key);
  assert.match(shell,/data-native-kind="official10"/,key);
  assert.match(shell,/CentralAuthorialQuiz\?\.openPenal/,key);
  assert.match(shell,/CentralInternalQuestionPolicy\?\.modal/,key);
  assert.doesNotMatch(shell,/Checks dos capítulos \+ questões internas/,key);
  new vm.Script(reader,{filename:path});
  new vm.Script(shell,{filename:'shell-'+key});
 }
});
test('Motor de questões não tem acesso às alternativas oficiais futuras e protege texto HTML',()=>{
 const w=policies(),p=w.CentralInternalQuestionPolicy;
 assert.match(p.noticeHtml(),/Questões de bancas reais — em breve/);
 assert.equal(p.target,10);
 const original=[{q:'Questão autoral',options:['A','B'],answer:0,explanation:'Justificativa adequada.'}];
 assert.equal(w.CentralAuthorialQuiz.lesson({summary:original,complete:[]}),null);
 assert.equal(p.authorial(original,[{...original,q:'Questão <script>alert(1)</script>',official:true}]).length,1);
});
test('Scripts e CSS do leitor independente carregam antes dos módulos',()=>{
 const html=read('index.html');
 const policy=html.indexOf('/ui/central-internal-question-policy-v1.js'),
   engine=html.indexOf('/ui/central-authorial-quiz-v1.js'),
   shell=read('central-v119.html').indexOf('ui/native-module-m01-shell.js');
 assert.ok(policy>=0&&engine>policy,'motor carregado depois da política no index');
 assert.ok(shell>=0,'leitores Penal injetados pelo bootstrap central-v119');
 assert.match(html,/central-authorial-quiz-v1\.css/);
});
