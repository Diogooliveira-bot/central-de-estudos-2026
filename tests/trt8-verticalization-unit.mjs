import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import path from 'node:path';

const root=path.resolve(import.meta.dirname,'..');
const data=JSON.parse(readFileSync(path.join(root,'content/trt8-2026-verticalized.json'),'utf8'));
const existing=JSON.parse(readFileSync(path.join(root,'content/tjpb-2026-verticalized.json'),'utf8'));
const ids=data.subjects.flatMap(s=>s.items.map(i=>i.id));
const all=data.subjects.flatMap(s=>s.items);
const norm=s=>String(s).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();

test('TRT8: transcrição específica do cargo 01 contém seis blocos gerais e seis específicos',()=>{
 assert.equal(data.examId,'trt8-2026-aj-area-judiciaria');
 assert.equal(data.cargoCode,'01');
 assert.equal(data.subjectCount,12);
 assert.equal(data.subjects.filter(s=>s.group==='general').length,6);
 assert.equal(data.subjects.filter(s=>s.group==='specific').length,6);
 assert.equal(data.itemsCount,300);
 assert.equal(all.length,data.itemsCount);
 assert.equal(new Set(ids).size,ids.length);
 assert.ok(data.subjects.every(s=>s.originalProgram.length>250),'preservar o texto fonte por disciplina');
});
test('TRT8: legislação de assédio segue a retificação oficial do DOU',()=>{
 const leg=data.subjects.find(s=>s.id==='trt8-leg');
 assert.ok(leg.rectified);
 assert.match(leg.originalProgram,/Resolução TRT8 nº 065\/2025 alterada pela Resolução TRT8 nº 23\/2026/);
 assert.match(leg.originalProgram,/Resolução CNJ nº 351\/2020/);
 assert.match(leg.originalProgram,/Resolução CSJT nº 360\/2023/);
 assert.doesNotMatch(leg.originalProgram,/067\/2021/);
 assert.ok(data.sourceUrls.some(x=>x.startsWith('https://www.in.gov.br/')));
});
test('TRT8: sugestões automáticas não se tornam links aprovados',()=>{
 assert.ok(all.some(i=>i.candidateModules.length>0));
 assert.ok(all.every(i=>i.mappingStatus==='pending_review'));
 assert.ok(all.every(i=>i.coverage==='to_audit'));
 assert.ok(all.every(i=>Array.isArray(i.moduleIds)&&i.moduleIds.length===0));
 assert.ok(all.every(i=>i.candidateModules.every(c=>c.id&&c.title&&c.score>=0&&c.score<=1)));
});
test('TRT8: mantém a separação de IDs frente ao edital TJPB existente',()=>{
 const tjpbIds=new Set(existing.subjects.flatMap(s=>s.items.map(i=>i.id)));
 assert.ok(ids.every(id=>id.startsWith('trt8-')));
 assert.ok(ids.every(id=>!tjpbIds.has(id)));
 assert.ok(data.sourceUrls.some(x=>x.includes('concursosfcc.com.br')));
 assert.ok(data.subjects.find(s=>s.id==='trt8-ptra')?.disciplineId==='ptra');
 assert.ok(norm(data.subjects.find(s=>s.id==='trt8-pt')?.title).includes('portugues'));
});
