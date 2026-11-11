import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {JSDOM} from 'jsdom';
const read=x=>fs.readFileSync(new URL('../'+x,import.meta.url),'utf8');
function fresh(){
 const dom=new JSDOM('<!doctype html><html><body><main id="subjects"></main></body></html>',{runScripts:'outside-only',url:'https://test.local'});
 const w=dom.window;
 for(const f of ['ui/central-internal-question-policy-v1.js','ui/central-authorial-quiz-v1.js','ui/grounded-authorial-questions-v1.js','ui/adm-authorial-source-v1.js','content/adm/m03-authorial10-v1.js'])w.eval(read(f));
 return dom;
}
test('ADM M01–M20: 10 questões autorais no resumo, usando banco seguro ou revisão ancorada',()=>{
 const dom=fresh(),w=dom.window,summary=[];
 for(let n=1;n<=20;n++){
  const code=String(n).padStart(2,'0');
  w.eval(read('content/adm/m'+code+'-native-data-lite.js'));
  const lesson=Object.values(w.ADM_NATIVE_CONTENT).find(x=>x.number===n);
  assert.ok(lesson,'M'+n+' conteúdo');
  const old=w.BcAdmAuthorialSource.select(lesson.summaryHtml,lesson.completeAppendHtml,n);
  const generated=w.BcGroundedQuestions.build({html:lesson.summaryHtml,title:lesson.title});
  const result=old.ready?old.items:generated;
  summary.push({module:n,objective:old.items.length,generated:generated.length,ready:result.length===10});
  assert.equal(result.length,10,'ADM M'+code+' sem 10 itens: '+JSON.stringify(summary.at(-1)));
  assert.ok(result.every(w.CentralAuthorialQuiz.valid),'ADM M'+code+' questões inválidas');
 }
 console.log('ADM_AUDIT='+JSON.stringify(summary));
 dom.window.close();
});
test('CPP M01–M22: 10 itens autorais separados da leitura e sem perda do banco antigo',()=>{
 const dom=fresh(),w=dom.window,summary=[];
 w.eval(read('content/cpp/cpp-native-index.js'));
 w.CPP_NATIVE_PACKED_B64=null;
 const packed=read('content/cpp/cpp-native-content-packed.js');
 const b64=packed.match(/CPP_NATIVE_PACKED_B64="([^"]+)"/)?.[1];
 assert.ok(b64,'CPP pacote não encontrado');
 const data=JSON.parse(gunzipSync(Buffer.from(b64,'base64')).toString('utf8'));
 w.CPP_NATIVE_CONTENT=data;
 w.eval(read('ui/cpp-native-study-v1.js'));
 assert.equal(w.CPP_NATIVE_INDEX.modules.length,22);
 for(const mod of w.CPP_NATIVE_INDEX.modules){
  const lesson=data[mod.uid];
  assert.ok(lesson,'CPP M'+mod.number+' fonte');
  const a=w.CppNative.extractAuthorial(lesson.summaryHtml),b=w.CppNative.extractAuthorial(lesson.completeHtml);
  const objective=w.CentralInternalQuestionPolicy.authorial(a,b);
  const grounded=w.BcGroundedQuestions.build({html:lesson.summaryHtml,title:mod.title});
  const all=objective.slice(),seen=new Set(all.map(z=>z.q.trim().toLowerCase()));
  for(const q of grounded){if(all.length>=10)break;if(!seen.has(q.q.trim().toLowerCase())){all.push(q);seen.add(q.q.trim().toLowerCase())}}
  summary.push({module:mod.number,objective:objective.length,generated:grounded.length,total:all.length});
  assert.equal(all.length,10,'CPP M'+mod.number+': '+JSON.stringify(summary.at(-1)));
  assert.ok(all.every(w.CentralAuthorialQuiz.valid),'CPP M'+mod.number+' questões inválidas');
 }
 console.log('CPP_AUDIT='+JSON.stringify(summary));
 dom.window.close();
});
test('CPC M01–M20: dez questões autorais derivadas da teoria, sem utilizar banco FCC',()=>{
 const dom=fresh(),w=dom.window,summary=[];
 w.BASE_NATIVE_CONTENT={cpc:{}};
 for(let n=1;n<=20;n++){
  const code=String(n).padStart(2,'0');
  w.eval(read('content/cpc/m'+code+'-native-data.js'));
  const d=w.BASE_NATIVE_CONTENT.cpc['m'+code];assert.ok(d,'CPC M'+n);
  const qs=w.BcGroundedQuestions.build({html:d.summaryHtml||'',text:d.summary||'',title:d.title});
  summary.push({n,count:qs.length});
  assert.equal(qs.length,10,'CPC M'+code+' sem 10: '+JSON.stringify(summary.at(-1)));
  assert.ok(qs.every(w.CentralAuthorialQuiz.valid),'CPC M'+code+' dados inválidos');
  assert.ok(qs.every(q=>q.type==='open'&&!q.bank&&!q.real),'CPC sem questão real reclassificada');
 }
 console.log('CPC_AUDIT='+JSON.stringify(summary));dom.window.close();
});
test('Português M01–M24: dez questões novas baseadas em cada apostila, separado de exercícios existentes',()=>{
 const dom=fresh(),w=dom.window;
 const data=JSON.parse(gunzipSync(Buffer.from(read('portugues-autodidata-data.txt').trim(),'base64')).toString('utf8'));
 const summary=[];
 for(let n=1;n<=24;n++){
  const id='m'+String(n).padStart(2,'0'),markup=data[id];
  assert.ok(markup?.length>200,'Português '+id+' falta leitura');
  const qs=w.BcGroundedQuestions.build({html:markup,discipline:'Português',module:id});
  summary.push({id,count:qs.length});
  assert.equal(qs.length,10,'Português '+id+': '+JSON.stringify(summary.at(-1)));
  assert.ok(qs.every(w.CentralAuthorialQuiz.valid),id+' itens inválidos');
  assert.equal(new Set(qs.map(q=>q.q)).size,10,id+' duplicação');
 }
 console.log('PT_AUDIT='+JSON.stringify(summary));dom.window.close();
});
test('Leitores das 4 disciplinas isolam questões e preservam teoria e bancos originais',()=>{
 const adm=read('ui/adm-native-layer.js'),cpp=read('ui/cpp-native-study-v1.js'),pt=read('ui/portuguese-reader.js'),cpc=read('ui/cpc-authorial10-v1.js');
 assert.match(adm,/BcAdmAuthorialSource\?\.strip/);
 assert.match(cpp,/stripInternalQuestions\(body\)/);
 assert.doesNotMatch(cpp,/^\s+bindQuestions\(body,n,kind\);/m);
 assert.match(pt,/BcPortugueseAuthorial\.strip\(article\)/);
 assert.match(cpc,/questões FCC reais/i);
 for(const f of ['ui/adm-authorial-source-v1.js','ui/grounded-authorial-questions-v1.js','ui/cpc-authorial10-v1.js','ui/portuguese-authorial10-v1.js'])assert.match(read('index.html'),new RegExp(f.split('/').at(-1).replaceAll('.','\\.')));
});
