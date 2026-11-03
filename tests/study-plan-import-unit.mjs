import test from 'node:test';
import assert from 'node:assert/strict';
import {deflateRawSync} from 'node:zlib';
import {parseStudyPlanZip,validatePlanDocument,knownSubject,knownModule,MAX_ZIP_BYTES} from '../lib/study-plan-import.js';

const sample=()=>({
 schema_version:'1.0.0',plano_id:'leo-tjce-demo-001',
 documento:{titulo:'Plano personalizado TJCE',periodo_inicio:'2026-11-09',periodo_fim:'2026-11-22'},
 aluno:{nome:'Pessoa Fictícia',objetivo:'TJCE',cargo:'Técnico Judiciário',banca:'FGV'},
 cronograma:[{numero_semana:1,inicio:'2026-11-09',fim:'2026-11-15',atividades:[
  {dia:'segunda',disciplina:'Direito Constitucional',modulo:'CONSTITUIÇÃO, NORMAS E PRINCÍPIOS FUNDAMENTAIS',modulo_uid:'cf-m01-analista',atividade:'Teoria + 10 questões',duracao_minutos:60,horario_inicio:'07:30'},
  {dia:'quarta',disciplina:'Direito Administrativo',modulo:'Atos administrativos',atividade:'Revisão ativa',duracao_minutos:45}
 ]}]
});
const pdf=Buffer.from('%PDF-1.7\n'+('Dados fictícios; sem scripts.\n').repeat(7)+'%%EOF\n');
const crcTable=Array.from({length:256},(_,i)=>{let c=i;for(let j=0;j<8;j++)c=(c&1)?(0xEDB88320^(c>>>1)):(c>>>1);return c>>>0});
function crc32(b){let x=0xffffffff;for(const c of b)x=crcTable[(x^c)&255]^(x>>>8);return (x^0xffffffff)>>>0}
function zip(entries){
 let localOffset=0;const parts=[],central=[];
 for(const [name,payload] of entries){
  const filename=Buffer.from(name),source=Buffer.isBuffer(payload)?payload:Buffer.from(payload);
  const cmp=deflateRawSync(source),crc=crc32(source);
  const local=Buffer.alloc(30);local.writeUInt32LE(0x04034b50,0);local.writeUInt16LE(20,4);
  local.writeUInt16LE(8,8);local.writeUInt32LE(crc,14);local.writeUInt32LE(cmp.length,18);
  local.writeUInt32LE(source.length,22);local.writeUInt16LE(filename.length,26);
  parts.push(local,filename,cmp);
  const center=Buffer.alloc(46);center.writeUInt32LE(0x02014b50,0);center.writeUInt16LE(20,4);center.writeUInt16LE(20,6);
  center.writeUInt16LE(8,10);center.writeUInt32LE(crc,16);center.writeUInt32LE(cmp.length,20);
  center.writeUInt32LE(source.length,24);center.writeUInt16LE(filename.length,28);
  center.writeUInt32LE(localOffset,42);central.push(center,filename);
  localOffset+=local.length+filename.length+cmp.length;
 }
 const index=Buffer.concat(central),end=Buffer.alloc(22);end.writeUInt32LE(0x06054b50,0);
 end.writeUInt16LE(entries.length,8);end.writeUInt16LE(entries.length,10);
 end.writeUInt32LE(index.length,12);end.writeUInt32LE(localOffset,16);
 return Buffer.concat([...parts,index,end]);
}
function validZip(doc=sample(),pdfContent=pdf){
 return zip([['plano.pdf',pdfContent],['plano.json',Buffer.from(JSON.stringify(doc))]]).toString('base64');
}
test('importação válida reconhece disciplina, horário, módulo existente e tarefas',()=>{
 const result=parseStudyPlanZip(validZip());
 assert.equal(result.normalized.resumo.total,2);
 assert.equal(result.normalized.atividades[0].modulo_uid,'cf-m01-analista');
 assert.equal(result.normalized.atividades[0].data,'2026-11-09');
 assert.equal(result.normalized.atividades[0].hora,'07:30');
 assert.equal(result.normalized.atividades[1].disciplina_id,'adm');
 assert.equal(result.pdf.toString('utf8'),pdf.toString('utf8'));
});
test('catálogo de módulos não inventa correspondências aproximadas',()=>{
 assert.equal(knownSubject('Raciocínio Lógico'),'rlm');
 assert.equal(knownModule('cf','inexistente','Constituição'),null);
 const d=sample();d.cronograma[0].atividades[0].modulo_uid='cf-inexistente';
 assert.equal(validatePlanDocument(d).atividades[0].modulo_uid,null);
});
test('disciplina desconhecida exige confirmação posterior',()=>{
 const d=sample();d.cronograma[0].atividades[1].disciplina='Astronomia';
 const n=validatePlanDocument(d);
 assert.equal(n.atividades[1].vinculacao,'pendente');
 assert.equal(n.resumo.pendentes_vinculacao,1);
});
test('cronogramas com múltiplas semanas e datas distintas',()=>{
 const d=sample();d.cronograma.push({numero_semana:2,inicio:'2026-11-16',fim:'2026-11-22',atividades:[
  {dia:'terça',disciplina:'Português',modulo:'Interpretação',atividade:'Ler e revisar',duracao_minutos:80}
 ]});
 assert.equal(parseStudyPlanZip(validZip(d)).normalized.atividades[2].data,'2026-11-17');
});
test('rejeita versão desconhecida e datas incoerentes',()=>{
 const d=sample();d.schema_version='2.0.0';assert.throws(()=>parseStudyPlanZip(validZip(d)),/Versão/);
 d.schema_version='1.0.0';d.cronograma[0].atividades[0].data='2026-11-10';
 assert.throws(()=>validatePlanDocument(d),/divergentes/);
});
test('não executa conteúdo PDF e rejeita gatilhos ativos',()=>{
 const dangerous=Buffer.from('%PDF-1.7\n/JavaScript (alert 1) '+('x'.repeat(200))+' %%EOF');
 assert.throws(()=>parseStudyPlanZip(validZip(sample(),dangerous)),/ações ativas/);
});
test('rejeita arquivo com nome perigoso e entradas extras',()=>{
 assert.throws(()=>parseStudyPlanZip(zip([['../plano.pdf',pdf],['plano.json','{}']]).toString('base64')),/apenas/);
 assert.throws(()=>parseStudyPlanZip(zip([['plano.pdf',pdf],['plano.json','{}'],['evil.exe','x']]).toString('base64')),/dois arquivos/);
});
test('rejeita ZIP truncado, CRC adulterado, sem PDF e base64 inválido',()=>{
 const data=zip([['plano.pdf',pdf],['plano.json',JSON.stringify(sample())]]);
 assert.throws(()=>parseStudyPlanZip(data.subarray(0,data.length-12).toString('base64')));
 const corrupted=Buffer.from(data);corrupted[48]^=255;
 assert.throws(()=>parseStudyPlanZip(corrupted.toString('base64')));
 assert.throws(()=>parseStudyPlanZip('!!@@'),/base64/);
});
test('impede ZIP acima do limite e datas fora do período',()=>{
 assert.throws(()=>parseStudyPlanZip(Buffer.alloc(MAX_ZIP_BYTES+1).toString('base64')));
 const d=sample();d.cronograma[0].inicio='2026-11-02';
 assert.throws(()=>validatePlanDocument(d),/Datas inválidas/);
});
