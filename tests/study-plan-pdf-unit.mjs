import test from 'node:test';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import {parseStudyPlanPdf} from '../lib/study-plan-import.js';

const doc=()=>({
 schema_version:'1.0.0',plano_id:'leo-ficticio-001',
 documento:{titulo:'Plano personalizado TJCE',periodo_inicio:'2026-11-09',periodo_fim:'2026-11-15'},
 aluno:{nome:'Aluno Fictício',objetivo:'TJCE',cargo:'Técnico Judiciário',banca:'FGV'},
 cronograma:[{inicio:'2026-11-09',fim:'2026-11-15',atividades:[
  {dia:'segunda',disciplina:'Direito Constitucional',modulo:'Constituição',atividade:'Ler teoria e resolver questões',duracao_minutos:60},
  {dia:'quarta',disciplina:'Português',modulo:'Interpretação',atividade:'Resolver 10 questões',duracao_minutos:45}
 ]}]
});
function pdfFixture(document=doc(),opts={}){
 const raw=Buffer.from(JSON.stringify(document),'utf8');
 const sha=opts.sha||crypto.createHash('sha256').update(raw).digest('hex');
 const version=opts.version||'1.0.0';
 const xmp='<bc:studyPlan version="'+version+'" sha256="'+sha+'">'+raw.toString('base64')+'</bc:studyPlan>';
 const source=Buffer.from('%PDF-1.4\n%Base Completa\n'+
   '1 0 obj\n<< /Type /Catalog >>\nendobj\n'+
   (opts.marker===false?'':xmp)+(opts.double?xmp:'')+'\n'+
   (opts.active?'/OpenAction (evil)\n':'')+
   '%%EOF\n');
 return source.toString('base64');
}

test('PDF único incorpora JSON, mantém cronograma e carrega PDF original',()=>{
 const result=parseStudyPlanPdf(pdfFixture());
 assert.equal(result.formato,'pdf-xmp-v1');
 assert.equal(result.normalized.nome,'Aluno Fictício');
 assert.equal(result.normalized.resumo.total,2);
 assert.equal(result.normalized.atividades[0].data,'2026-11-09');
 assert.ok(result.pdf.subarray(0,5).equals(Buffer.from('%PDF-')));
});
test('PDF antigo sem metadados recebe orientação amigável para o aluno',()=>{
 assert.throws(()=>parseStudyPlanPdf(pdfFixture(doc(),{marker:false})),/Peça ao Léo um PDF atualizado/);
});
test('metadados adulterados ou duplicados não podem ser importados',()=>{
 assert.throws(()=>parseStudyPlanPdf(pdfFixture(doc(),{sha:'0'.repeat(64)})),/integridade/);
 assert.throws(()=>parseStudyPlanPdf(pdfFixture(doc(),{double:true})),/Peça ao Léo/);
});
test('bloqueio de ações ativas no arquivo PDF',()=>{
 assert.throws(()=>parseStudyPlanPdf(pdfFixture(doc(),{active:true})),/ações ativas/);
});
test('versão XMP inválida é recusada',()=>{
 assert.throws(()=>parseStudyPlanPdf(pdfFixture(doc(),{version:'2.0.0'})),/PDF atualizado/);
});
test('não aceita datas fora do período ou esquema JSON não suportado',()=>{
 const wrong=doc();wrong.cronograma[0].atividades[0].data='2026-11-03';
 assert.throws(()=>parseStudyPlanPdf(pdfFixture(wrong)),/Data de atividade inválida/);
 const wrongVersion=doc();wrongVersion.schema_version='2.0.0';
 assert.throws(()=>parseStudyPlanPdf(pdfFixture(wrongVersion)),/Versão de importação/);
});
test('base64 inválido, arquivo acima do limite e PDF truncado são recusados',()=>{
 assert.throws(()=>parseStudyPlanPdf('@@@@'),/formato inválido/);
 const oversized=Buffer.concat([Buffer.from('%PDF-1.7\n'),Buffer.alloc(2600000),Buffer.from('%%EOF')]);
 assert.throws(()=>parseStudyPlanPdf(oversized.toString('base64')),/2,6 MB/);
 const truncated=Buffer.from('%PDF-1.4\n'+('x'.repeat(300)));
 assert.throws(()=>parseStudyPlanPdf(truncated.toString('base64')),/PDF válido/);
});
