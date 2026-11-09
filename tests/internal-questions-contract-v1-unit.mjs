import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
const root=new URL('../',import.meta.url),read=p=>fs.readFileSync(new URL(p,root),'utf8');
function policy(){
 const w={},context=vm.createContext({window:w});
 vm.runInContext(read('ui/central-internal-question-policy-v1.js'),context);
 return w.CentralInternalQuestionPolicy;
}
test('Contrato: 10 autorais no resumo, 10 oficiais futuras na teoria completa',()=>{
 const p=policy();assert.equal(p.target,10);
 const summary=Array.from({length:5},(_,i)=>({q:'Questão '+i,answer:i%2}));
 const other=Array.from({length:10},(_,i)=>({q:'Questão complementar '+i,answer:i%2}));
 assert.equal(p.authorial(summary,other).length,10);
 assert.equal(p.authorial(summary,summary).length,5);
 assert.equal(p.missing(5),5);
 assert.match(p.noticeHtml(),/10 questões oficiais de concursos/);
 assert.match(p.noticeHtml(),/Por enquanto, não há questões/);
 assert.equal(p.authorial([{q:'oficial',banca:'FGV'}],other).length,10,'não deve utilizar questões de banca no banco autoral');
});
test('Os 15 módulos de Constitucional oferecem 10 autorais sem enunciados duplicados',()=>{
 const p=policy();
 for(let i=1;i<=15;i++){
  const filename='content/cf/m'+String(i).padStart(2,'0')+'-native-data.js',s=read(filename);
  const m=s.match(/\.m\d\d\s*=\s*(\{[\s\S]*\})\s*;\s*\}\)\(window\)/);
  assert.ok(m,filename+' não possui fonte parseável');
  const d=JSON.parse(m[1]),quiz=p.authorial(d.questions.summary,d.questions.complete);
  assert.equal(quiz.length,10,filename);
  assert.equal(new Set(quiz.map(x=>x.q)).size,10,filename);
  quiz.forEach((q,j)=>{
   assert.ok(Array.isArray(q.options)&&q.options.length>=4,filename+' '+j);
   assert.ok(Number.isInteger(q.answer)&&q.answer>=0&&q.answer<q.options.length,filename+' '+j);
   assert.ok(q.explanation?.trim(),filename+' '+j);
  });
 }
});
test('Leitores alterados não expõem as questões antigas da teoria completa',()=>{
 const cf=read('ui/cf-native-study-v2.js'),civil=read('ui/civil-native-study-v1.js'),rlm=read('ui/rlm-native-v1.js'),home=read('index.html');
 for(const s of [cf,civil,rlm])assert.match(s,/CentralInternalQuestionPolicy/);
 assert.match(cf,/mode==='complete'\)return g.CentralInternalQuestionPolicy/);
 assert.match(civil,/kind==='complete'\)return g.CentralInternalQuestionPolicy/);
 assert.match(rlm,/stage==='banca'/);
 assert.match(home,/central-internal-question-policy-v1\.js/);
 assert.match(home,/central-internal-question-policy-v1\.css/);
 assert.match(cf,/Resolver 10 questões autorais/);
 assert.match(civil,/Resolver 10 questões autorais/);
 assert.match(rlm,/10 questões autorais/);
});
