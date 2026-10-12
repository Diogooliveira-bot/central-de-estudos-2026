#!/usr/bin/env node
'use strict';
// Compara o inventário de cotejo documental com o banco instalado.
// NÃO substitui certificação de mérito ou aprovação editorial.
const fs=require('node:fs'),assert=require('node:assert/strict'),path=require('node:path');
const root=path.resolve(__dirname,'..');
const audit=JSON.parse(fs.readFileSync(path.join(__dirname,'trabalho-251-triagem-individual-20261012.json'),'utf8'));
const map=new Map();
for(let n=1;n<=18;n++){
 const id=String(n).padStart(2,'0');
 const mod=JSON.parse(fs.readFileSync(path.join(root,'modules/trabalho/native/modules/m'+id+'.json'),'utf8'));
 for(const q of [...mod.questoes.resumida,...mod.questoes.completa]){assert(!map.has(q.id),'ID duplicado '+q.id);map.set(q.id,q)}
}
const norm=x=>String(x??'').replace(/\s+/g,' ').trim();
assert.equal(map.size,270,'Banco incompleto');
assert.equal(audit.registros.length,251,'Inventário incompleto');
for(const a of audit.registros){
 const q=map.get(a.id);assert(q,'Questão não encontrada: '+a.id);
 assert.equal(a.gabarito,q.gabarito,'Gabarito divergente: '+a.id);
 assert.equal(norm(a.enunciado),norm(q.enunciado),'Enunciado divergente: '+a.id);
 assert.equal(norm(a.textoGabarito),norm(q.alternativas[q.gabarito]),'Alternativa correta divergente: '+a.id);
}
assert.equal(audit.estatisticas.homologacao,false,'Homologação indevida');
console.log('PASS: 251 cotejos correspondem ao banco de 270 questões. Mérito jurídico final PENDENTE.');
