import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import vm from "node:vm";
import {createHash} from "node:crypto";
const root=new URL("../",import.meta.url);
const FILES=[["tools/decorando-data-adm-pack1.js","DATA_ADM_PACK1"],["tools/decorando-data-adm-pack2.js","DATA_ADM_PACK2"],["tools/decorando-data-adm-pack3.js","DATA_ADM_PACK3"],["tools/decorando-data-adm-pack4.js","DATA_ADM_PACK4"],["tools/decorando-data-adm-pack5.js","DATA_ADM_PACK5"],["tools/decorando-data-adm-8112-extra.js","DATA_ADM_8112_EXTRA"],["tools/decorando-data-adm-8429-extra.js","DATA_ADM_8429_EXTRA"],["tools/decorando-data-adm-12527-expansao.js","DATA_ADM_12527_EXPANSAO"],["tools/decorando-data-adm-14133-extra.js","DATA_ADM_14133_EXTRA"]];
const LAWS={"adm-lei-8112":71,"adm-lei-8429":57,"adm-lei-12527":52,"adm-lei-dl200":29,"adm-lei-8987":29,"adm-lei-12846":25,"adm-lei-11079":24,"adm-lei-13303":41,"adm-lei-14133":67,"adm-lei-lindb20":15,"adm-lei-13460":15,"adm-lei-12813":14,"adm-lei-d11462":1};
const audit=JSON.parse(readFileSync(new URL("audits/adm-leis-principais-revisao-juridica-20261029.json",root),"utf8"));
const html=readFileSync(new URL("tools/decorando.html",root),"utf8");
const all=[];
for(const [f,n] of FILES){
  const ctx=vm.createContext({});
  vm.runInContext(readFileSync(new URL(f,root),"utf8"),ctx,{filename:f});
  for(const q of vm.runInContext(n,ctx))all.push({...q,__file:f});
}
const rev=all.filter(q=>q.question.legalAudit&&q.topicId in LAWS&&audit.itens.some(i=>i.id===q.id));
test("440 itens das 12 leis principais e do Decreto 11.462 revisados, por lei",()=>{
  assert.equal(audit.total,440);
  assert.equal(rev.length,440);
  assert.equal(new Set(rev.map(q=>q.id)).size,440);
  for(const [t,n] of Object.entries(LAWS)){
    assert.equal(rev.filter(q=>q.topicId===t).length,n,t);
    assert.equal(audit.porTopico[t],n,t);
  }
  assert.equal(audit.gabaritosAlterados,0);
  assert.equal(audit.itensForaDaRevisaoAlterados,0);
});
test("nenhum item das 12 leis ficou sem revisão",()=>{
  const sem=all.filter(q=>q.topicId in LAWS&&!(q.question.legalAudit&&audit.itens.some(i=>i.id===q.id)));
  assert.deepEqual(sem.map(q=>q.id),[]);
});
test("status, explicação e gabarito são coerentes e batem com a auditoria",()=>{
  const byId=new Map(audit.itens.map(i=>[i.id,i]));
  const status={};
  for(const q of rev){
    const a=q.question.legalAudit,ex=q.question.explanation,i=byId.get(q.id);
    assert.ok(["certificado","certificado-parcial","pendente"].includes(a.status),q.id);
    assert.equal(a.status,i.status,q.id);
    assert.equal(q.question.answer?"C":"E",i.gabarito,q.id);
    assert.match(a.date,/^2026-10-\d\d$/,q.id);
    assert.ok(a.basis&&a.source,q.id);
    assert.ok(a.source.includes("29/10/2026"),q.id);
    if(a.status==="pendente")assert.match(ex,/^Em revisão\. /,q.id);
    else assert.equal(ex.startsWith(q.question.answer?"Correta. ":"Errada. "),true,q.id);
    assert.ok(!/não foi conferido|não conferid|\[\.\.\.\]|\[…\]|\|/i.test(ex),q.id);
    assert.ok(Array.isArray(q.parts)&&q.parts.length>=1&&q.parts[0].length>=25&&q.parts.every(p=>p.trim().length>0),q.id);
    status[a.status]=(status[a.status]||0)+1;
  }
  assert.deepEqual(status,audit.porStatus);
  assert.equal(status.pendente||0,0);
});
test("itens parciais por anotação de ADI citam a limitação na explicação",()=>{
  const adi=rev.filter(q=>/Vide ADI/.test(q.question.explanation));
  assert.equal(adi.length,5);
  for(const q of adi)assert.equal(q.question.legalAudit.status,"certificado-parcial",q.id);
});
test("dispositivos revogados não foram usados e enunciados mantêm a pergunta",()=>{
  for(const q of rev){
    assert.ok(q.question.statement.length>=25,q.id);
    assert.ok(!q.parts.some(p=>/\(Revogad/i.test(p)),q.id);
  }
  for(const c of audit.cabecalhosCorrigidos){
    const q=rev.find(x=>x.id===c.id);
    assert.ok(q.question.meta.includes(c.trecho),c.id);
    assert.ok(!q.question.statement.startsWith(c.trecho),c.id);
  }
});
test("blobs dos arquivos de dados conferem com a auditoria e o HTML aponta versão nova",()=>{
  for(const [f] of FILES){
    const content=Buffer.from(readFileSync(new URL(f,root),"utf8").replace(/\r\n/g,"\n"),"utf8");
    const sha=createHash("sha1").update("blob "+content.length).update(Buffer.from([0])).update(content).digest("hex");
    assert.equal(sha,audit.datasetBlobShas[f],f);
    assert.match(html,new RegExp(f.replace("tools/","").replace(/\./g,"\\.")+"\\?v=20261029adm2"),f);
  }
});
