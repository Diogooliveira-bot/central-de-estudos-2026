import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {runInNewContext} from 'node:vm';
const source=await readFile(new URL('../central-question-stability-v66137.js',import.meta.url),'utf8');
test('alternativas distintas consecutivas nao sao ignoradas',()=>{
 const calls=[];const w={answerCfQuestion:(...args)=>calls.push(args)};
 runInNewContext(source,{window:w,document:{addEventListener(){}},setTimeout(){}});
 w.answerCfQuestion(1,'A');w.answerCfQuestion(1,'B');w.answerCfQuestion(1,'B');
 assert.deepEqual(calls,[[1,'A'],[1,'B']]);
});
