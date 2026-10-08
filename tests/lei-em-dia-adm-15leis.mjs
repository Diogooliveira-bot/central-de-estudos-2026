import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import vm from "node:vm";
const root=new URL("../",import.meta.url),ctx=vm.createContext({});
for(const p of ["tools/decorando-data-adm-9784.js","tools/decorando-data-adm-pack1.js","tools/decorando-data-adm-pack2.js","tools/decorando-data-adm-pack3.js","tools/decorando-data-adm-pack4.js"]){
  const src=readFileSync(new URL(p,root),"utf8");
  vm.runInContext(src,ctx,{filename:p});
}
const data=vm.runInContext("[...DATA_ADM,...DATA_ADM_PACK1,...DATA_ADM_PACK2,...DATA_ADM_PACK3,...DATA_ADM_PACK4]",ctx);
const topics=vm.runInContext("[...TOPICS_ADM,...TOPICS_ADM_PACK1,...TOPICS_ADM_PACK2,...TOPICS_ADM_PACK3,...TOPICS_ADM_PACK4]",ctx);
const html=readFileSync(new URL("tools/decorando.html",root),"utf8");
const offline=JSON.parse(readFileSync(new URL("central-offline-files-v66172.json",root),"utf8"));
test("25 conjuntos e 462 questões com IDs únicos",()=>{
  assert.equal(topics.length,25);
  assert.equal(data.length,462);
  assert.equal(new Set(data.map(x=>x.id)).size,data.length);
  assert.equal(new Set(topics.map(x=>x.id)).size,topics.length);
});
test("nenhuma referência contém mais de duas questões",()=>{
  const count=new Map();
  for(const q of data){
    const k=q.topicId+"|"+q.subtopic;
    count.set(k,(count.get(k)||0)+1);
  }
  for(const [k,n] of count)assert.ok(n<=2,k+" -> "+n);
});
test("gabarito, fundamento e filtro são coerentes com os dados",()=>{
  const signatures=new Set();
  for(const q of data){
    assert.equal(q.discipline,"adm");
    assert.equal(typeof q.question.answer,"boolean");
    assert.ok(q.question.statement.length>=25,q.id);
    assert.ok(q.parts.length===1 && q.parts[0].length>=25,q.id);
    assert.ok(q.question.bank && q.question.meta && q.question.source,q.id);
    const t=topics.find(t=>t.id===q.topicId);
    assert.ok(t?.subtopics.includes(q.subtopic),q.id);
    const signature=q.topicId+"|"+q.question.statement.normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().replace(/[^a-z0-9]/g,"");
    assert.ok(!signatures.has(signature),"enunciado duplicado: "+q.id);
    signatures.add(signature);
    assert.ok(!/decorandoaleiseca\.app\/vade-mecum-de-questoes|Gabarito:\s*(?:Verdadeiro|Falso)/i.test(q.parts[0]+" "+q.question.statement),q.id);
  }
});
test("Lei em Dia e PWA carregam os três datasets sem alterar o progresso",()=>{
  for(const name of ["decorando-data-adm-9784.js","decorando-data-adm-pack1.js","decorando-data-adm-pack2.js","decorando-data-adm-pack3.js","decorando-data-adm-pack4.js"]){
    assert.ok(html.includes(name));
    assert.ok(offline.files.some(x=>x.includes(name)));
  }
  assert.ok(html.includes("...DATA_ADM_PACK1,...DATA_ADM_PACK2,...DATA_ADM_PACK3,...DATA_ADM_PACK4"));
  assert.ok(html.includes("...TOPICS_ADM_PACK1,...TOPICS_ADM_PACK2,...TOPICS_ADM_PACK3,...TOPICS_ADM_PACK4"));
  assert.ok(html.includes('const STORAGE_KEY = "lei-seca-enxuta-state"'));
});


test("pacote complementar contem 6 conjuntos autorais e 83 itens legalmente identificados",()=>{
  const supplement=data.filter(q=>q.id.includes("-autoral-")&&["adm-lei-13460","adm-lei-14129","adm-lei-8745","adm-lei-12813","adm-lei-4717","adm-lei-7347"].includes(q.topicId));
  assert.equal(supplement.length,83);
  assert.equal(new Set(supplement.map(q=>q.topicId)).size,6);
  for(const q of supplement){
    assert.equal(q.origin,"authorial",q.id);
    assert.equal(q.question.origin,"authorial",q.id);
    assert.ok(q.question.source.includes("https://"),q.id);
    assert.ok(q.question.source.includes(q.number),q.id);
    assert.ok(!/Decorando a Lei Seca|CESPE|FGV|VUNESP/i.test(q.question.meta),q.id);
  }
});
