import test from 'node:test';import assert from 'node:assert/strict';import{references}from'../scripts/penal-law-references.mjs';
test('Reconhece listas, intervalos, diplomas distintos e artigos com letras',()=>{
 const keys=(t,n=2)=>references(t,n).map(r=>r.key);
 assert.deepEqual(keys('CP, arts. 29 e 30'),['cp:29','cp:30']);
 assert.deepEqual(keys('arts. 2º a 4º do Código Penal'),['cp:2','cp:3','cp:4']);
 assert.deepEqual(keys('arts. 337-E a 337-G do CP'),['cp:337-E','cp:337-F','cp:337-G']);
 assert.deepEqual(keys('CP art. 150 × Lei 13.869 art. 22',14),['cp:150','l13869:22']);
 assert.deepEqual(keys('SV 24: art. 1º, I a IV, da Lei 8.137/1990',17),['l8137:1']);
 assert.deepEqual(keys('LEI SECA — art. 26, parágrafo único',5),['cp:26']);
 assert.deepEqual(keys('A Lei 15.358/2026 alterou o art. 91-A',7),['cp:91-A']);
});
