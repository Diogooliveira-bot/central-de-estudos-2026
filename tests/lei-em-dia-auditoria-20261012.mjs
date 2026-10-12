import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';

const root = new URL('../', import.meta.url);
const sandbox = {};
vm.runInNewContext(readFileSync(new URL('tools/decorando-data-adm-9784.js', root), 'utf8') +
 '\n;globalThis.auditData=DATA_ADM;', sandbox);
const data=sandbox.auditData;
const html=readFileSync(new URL('tools/decorando.html', root), 'utf8');
const originals = {
 '001':true,'003':false,'006':false,'007':false,'012':true,'013':false,
 '015':true,'016':false,'019':true,'021':false,'026':true,'027':true,
 '031':true,'032':false,'033':false,'034':true,'035':false,'036':true,
 '037':false,'038':true,'040':true,'041':true,'042':false,'043':true,
 '048':false,'050':true
};
test('Inventário: 26 IDs únicos e gabaritos preexistentes preservados',()=>{
 assert.equal(data.length,26);
 assert.equal(new Set(data.map(q=>q.id)).size,26);
 for(const q of data){
  const key=q.id.slice(-3);
  assert.equal(q.question.answer,originals[key],q.id);
  assert.ok(q.question.source);
  assert.ok(q.parts[0].length>20);
 }
});
test('Conferência documental de 23 itens e 3 pendências explícitas',()=>{
 const reviewed=data.filter(q=>q.question.legalAudit?.status==='conferido_na_literalidade');
 const pending=data.filter(q=>q.question.legalAudit?.status==='pendente');
 assert.equal(reviewed.length,23);assert.equal(pending.length,3);
 assert.deepEqual(Array.from(pending,q=>q.id.slice(-3)).sort(),['003','032','048']);
 assert.ok(reviewed.every(q=>q.question.legalAudit.referenceDate==='2026-10-12'));
 assert.ok(reviewed.every(q=>q.question.explanation.length>70));
 assert.ok(pending.every(q=>q.question.updateWarning.includes('PENDENTE DE REVISÃO')));
 assert.ok(data.every(q=>!q.question.explanation.includes('Gabarito conforme PDF de origem')));
});
test('Interface sinaliza pendências nos dois modos e não muda chave de progresso',()=>{
 assert.ok(html.includes('legalAuditBanner(article)'));
 assert.ok(html.includes('Gabarito em revisão'));
 assert.ok(html.includes('min-height:46px'));
 assert.ok(html.includes('const STORAGE_KEY = "lei-seca-enxuta-state"'));
 assert.ok(html.includes('${legalAuditBanner(article)}\n      ${answerButtons'));
 assert.ok(html.includes('${legalAuditBanner(article)}\n        ${(()=>{const opts'));
});
