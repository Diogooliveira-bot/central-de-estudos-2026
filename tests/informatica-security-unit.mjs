import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';
import { protectedAsset, projectInformaticaSummary } from '../lib/protected-content.js';

test('Informática M01–M13 é protegida como conteúdo integral Premium',()=>{
  for(let n=1;n<=13;n++){
    const id='m'+String(n).padStart(2,'0');
    assert.deepEqual(protectedAsset('/content/informatica/'+id+'.js'),
      {kind:'informatica',feature:'theory.complete',moduleKey:id});
  }
  assert.equal(protectedAsset('/content/informatica/m14.js'),null);
});

test('Plano gratuito recebe somente a revisão, nunca a teoria completa',async()=>{
  for(let n=1;n<=13;n++){
    const id='m'+String(n).padStart(2,'0');
    const code=await readFile(new URL('../content/informatica/'+id+'.js',import.meta.url),'utf8');
    const sandbox={};sandbox.window=sandbox;
    vm.runInNewContext(code,sandbox,{timeout:150});
    const original=sandbox.BC_INFO_CONTENT[id];
    assert.ok(original.full.length>=7);
    assert.ok(original.review.length>=3);
    const safe=projectInformaticaSummary(original);
    assert.equal(safe.id,id);
    assert.equal(safe.full.length,0);
    assert.ok(safe.review.every(s=>s.title&&s.html));
    assert.equal(safe.review.length,original.review.length);
    assert.equal(safe.resources.length,0);
    const json=JSON.stringify(safe);
    assert.ok(!json.includes(original.full[0].html),'texto integral não pode vazar na projeção');
    assert.ok(!json.includes(original.full[0].title),'título integral não deve ser copiado para o resumo');
    assert.equal(safe.questions,undefined);
  }
});

test('Middleware e PWA não podem armazenar a teoria de Informática no cache público',async()=>{
 const source=await readFile(new URL('../sw.js',import.meta.url),'utf8');
 const context={URL,Response,caches:{},self:{location:{origin:'https://unit.test'},addEventListener(){}}};
 vm.runInNewContext(source,context,{timeout:500});
 assert.equal(context.protectedContentPath('/content/informatica/m01.js'),true);
 assert.equal(context.protectedContentPath('/content/informatica/m13.js'),true);
 assert.equal(context.protectedContentPath('/content/informatica/m14.js'),false);
 const middleware=await readFile(new URL('../middleware.js',import.meta.url),'utf8');
 assert.match(middleware,/protectedAsset\(path\)/);
 const backend=await readFile(new URL('../lib/private-content-handler.js',import.meta.url),'utf8');
 assert.match(backend,/projectInformaticaSummary/);
 assert.match(backend,/plan\.plan === 'free'/);
});
