#!/usr/bin/env node
// Pré-homologação: verifica estrutura; NÃO certifica mérito jurídico.
'use strict';
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const base=path.resolve(__dirname,'../modules/trabalho/native');
const seen=new Set();let count=0,pages=0;
for(let n=1;n<=18;n++){
 const id='m'+String(n).padStart(2,'0');
 const file=path.join(base,'modules',id+'.json');
 const d=JSON.parse(fs.readFileSync(file,'utf8'));
 assert.equal(d.id,id);assert.equal(d.numero,n);assert.equal(d.homologado,false,'Não liberar módulos sem auditoria');
 for(const [name,expected] of [['resumida',5],['completa',10]]){
  const section=d.tipos[name],qs=d.questoes[name];
  assert(Array.isArray(section.paginas)&&section.paginas.length>0,id+' '+name+' sem páginas');
  assert.equal(section.numero_paginas,section.paginas.length,id+' contagem incorreta');
  assert(Array.isArray(qs)&&qs.length===expected,id+' '+name+' contagem de questões');
  for(const q of qs){
   assert(q.id&&!seen.has(q.id),id+' questão duplicada');seen.add(q.id);
   assert(q.enunciado&&q.comentario,id+' questão sem texto ou comentário');
   assert.deepEqual(Object.keys(q.alternativas).sort(),['A','B','C','D','E'],id+' alternativas inválidas');
   assert(Object.hasOwn(q.alternativas,q.gabarito),id+' gabarito inválido');count++;
  }
  pages+=section.paginas.length;
 }
 const image=path.resolve(base,'modules',d.infografico);
 assert(image.startsWith(path.resolve(base,'infograficos')+path.sep),'Caminho inseguro no '+id);
 assert(fs.existsSync(image),'Infográfico ausente '+id);
}
assert.equal(count,270);console.log('PASS: 18 módulos, '+pages+' páginas de teoria, '+count+' questões estruturais, 18 infográficos. Mérito jurídico NÃO certificado.');
