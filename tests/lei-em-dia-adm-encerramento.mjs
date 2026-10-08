import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import vm from "node:vm";

const root=new URL("../",import.meta.url);
const context=vm.createContext({});
const report=JSON.parse(readFileSync(new URL("audits/lei-em-dia-adm-relatorio-final-20261008.json",root),"utf8"));
for(const name of ["9784","pack1","pack2"]){
 const path="tools/decorando-data-adm-"+name+".js";
 vm.runInContext(readFileSync(new URL(path,root),"utf8"),context,{filename:path});
}
const questions=vm.runInContext("[...DATA_ADM,...DATA_ADM_PACK1,...DATA_ADM_PACK2]",context);
const bucket=q=>{
 const year=q.question.year;
 return year==null?"notIdentified":year<2016?"before2016":year===2016?"year2016":year<=2020?"between2017And2020":"year2021To2026";
};
test("relatório de fechamento registra idade real das questões dos PDFs",()=>{
 assert.equal(questions.length,321);
 const counter=Object.fromEntries(Object.keys(report.sourceAge.categories).map(k=>[k,0]));
 for(const q of questions){
  const key=bucket(q);
  assert.ok(key in counter,q.id+" -> "+key);
  counter[key]++;
 }
 assert.deepEqual(counter,report.sourceAge.categories);
 assert.equal(counter.before2016,45);
 assert.equal(counter.notIdentified,12);
 assert.equal(counter.year2016,7);
});
test("encerramento não declara verificação jurídica ou direitos autorais inexistentes",()=>{
 assert.equal(report.validation.sourceTranscription.matchingAnswersToSource,321);
 assert.equal(report.commercialReadiness.status,"BLOCKED_PENDING_EXTERNAL_EVIDENCE");
 assert.equal(report.validation.lawSpotChecks.status,"PARTIAL_CHECK");
 const html=readFileSync(new URL("tools/decorando.html",root),"utf8");
 assert.ok(html.includes("444 questões autorais e 321 de PDFs de terceiros"));
 assert.ok(html.includes("45 são anteriores a 2016 e 12 estão sem ano"));
 assert.ok(html.includes("reprodução comercial de questões de terceiros depende de autorização ou licença"));
});
