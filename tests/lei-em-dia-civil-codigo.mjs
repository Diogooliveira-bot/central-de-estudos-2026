import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
const root=new URL('../',import.meta.url);
const ctx=vm.createContext({});
vm.runInContext(readFileSync(new URL('tools/decorando-data-civil.js',root),'utf8'),ctx);
const data=vm.runInContext('DATA_CIVIL',ctx);
const report=JSON.parse(readFileSync(new URL('audits/civil-codigo-revisao-juridica-20261028.json',root),'utf8'));
const forbidden=/não foi conferido|não conferid|\[\.\.\.\]|\[…\]/i;
const isReviewed=q=>q.question.legalAudit&&q.question.legalAudit.date==='2026-10-28';
const reviewed=data.filter(isReviewed);
const notReviewed=data.filter(q=>!isReviewed(q));

test('Código Civil — banco íntegro e revisão de 28/10/2026 coerente com o relatório',()=>{
  assert.equal(data.length,report.totalDoBanco);
  assert.equal(new Set(data.map(q=>q.id)).size,data.length);
  assert.equal(reviewed.length,report.totalRevisado);
  assert.equal(notReviewed.length,report.totalNaoRevisado);
  assert.equal(report.totalNaoRevisado,0);
  assert.equal(reviewed.length,data.length,'todas as questões do Código Civil devem ter revisão jurídica');
  assert.equal(report.gabaritosAlterados,0);
  assert.equal(report.itensForaDaRevisaoAlterados,0);
  const status={},gab={C:0,E:0};
  for(const q of reviewed){
    status[q.question.legalAudit.status]=(status[q.question.legalAudit.status]||0)+1;
    gab[q.question.answer?'C':'E']++;
  }
  assert.deepEqual(status,report.porStatus);
  assert.deepEqual(gab,report.gabaritos);
  assert.equal(report.itens.length,reviewed.length);
  const ids=new Map(report.itens.map(i=>[i.id,i]));
  for(const q of reviewed){
    const r=ids.get(q.id);
    assert.ok(r,q.id);
    assert.equal(r.status,q.question.legalAudit.status,q.id);
    assert.equal(r.gabarito,q.question.answer?'C':'E',q.id);
  }
});

test('Código Civil — os 12 itens de Seguros foram conferidos contra a Lei 15.040/2024',()=>{
  const seguros=data.filter(q=>/^civil-autoral-analista-seguro-\d\d$/.test(q.id));
  assert.deepEqual([...seguros.map(q=>q.id)],Array.from({length:12},(_,i)=>`civil-autoral-analista-seguro-${String(i+1).padStart(2,'0')}`));
  for(const q of seguros){
    assert.equal(q.topicId,'civ-contratos-especie',q.id);
    assert.ok(isReviewed(q),q.id);
    assert.equal(q.question.legalAudit.status,'certificado',q.id);
    assert.match(q.question.legalAudit.source,/Lei 15\.040\/2024/,q.id);
  }
});

test('Código Civil — explicações coerentes com o gabarito e trechos da lei presentes',()=>{
  for(const q of reviewed){
    const audit=q.question.legalAudit,explanation=q.question.explanation;
    assert.ok(['certificado','certificado-parcial','pendente'].includes(audit.status),q.id);
    assert.ok(audit.basis&&audit.source&&/^2026-10-\d\d$/.test(audit.date),q.id);
    assert.equal(typeof q.question.answer,'boolean',q.id);
    assert.ok(Array.isArray(q.parts)&&q.parts.length>=1&&q.parts[0].length>=25,q.id);
    if(audit.status==='pendente')assert.match(explanation,/^Em revisão\. /,q.id);
    else{
      assert.match(explanation,/^(Correta|Errada)\. /,q.id);
      assert.equal(explanation.startsWith('Correta'),q.question.answer,q.id);
    }
    assert.ok(!forbidden.test(explanation)&&!q.parts.some(p=>forbidden.test(p)),q.id);
    assert.ok(!/\n|\s{2,}/.test(explanation),q.id);
  }
  assert.equal(reviewed.filter(q=>q.question.legalAudit.status==='pendente').length,report.pendentes.length);
  assert.equal(reviewed.filter(q=>q.question.legalAudit.status==='certificado-parcial').length,report.parciais.length);
});
