import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile,readdir} from 'node:fs/promises';
const root=new URL('../',import.meta.url);
test('carregador principal nao referencia bancos removidos',async()=>{
 const html=await readFile(new URL('index.html',root),'utf8');
 assert.doesNotMatch(html,/\/(?:central-structural-v66119)\/(?:cf|cpc|penal)-questions-(?!000-init)\d+\.js/);
 for(const name of ['cf','cpc','penal'])assert.match(html,new RegExp(name+'-questions-000-init\\.js'));
});
test('leitores de fixacao permanecem registrados',async()=>{
 const reader=await readFile(new URL('ui/cf-native-study-v2.js',root),'utf8');
 assert.match(reader,/function openQuiz\(/);
 const civil=await readFile(new URL('ui/civil-native-study-v1.js',root),'utf8');
 assert.match(civil,/function openQuestions\(/);
});
test('bancos removidos nao existem como arquivos',async()=>{
 const entries=await readdir(new URL('central-structural-v66119/',root));
 assert.equal(entries.filter(s=>/^(?:cf|penal|cpc)-questions-(?!000-init)\d{3}\.js$/.test(s)).length,0);
});
