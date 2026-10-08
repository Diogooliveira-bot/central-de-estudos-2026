import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import vm from "node:vm";
const src = readFileSync(new URL("../tools/decorando-data-adm-9784.js", import.meta.url), "utf8");
const sandbox = {};
vm.runInNewContext(src+"\n;globalThis.testExport={DATA_ADM,TOPICS_ADM};", sandbox);
const {DATA_ADM:questions, TOPICS_ADM:topics} = sandbox.testExport;
test("piloto contém 26 questões distintas", () => {
  assert.equal(questions.length,26);
  assert.equal(new Set(questions.map(q=>q.id)).size,26);
  assert.equal(new Set(questions.map(q=>q.question.statement.normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().replace(/[^a-z0-9]/g,""))).size,26);
});
test("máximo de duas questões por artigo, parágrafo e inciso", () => {
  const sizes = new Map();
  for(const q of questions) sizes.set(q.subtopic,(sizes.get(q.subtopic)||0)+1);
  assert.ok([...sizes.values()].every(n=>n>=1&&n<=2));
  assert.equal(sizes.size,16);
});
test("nenhum gabarito, enunciado ou fonte está ausente", () => {
  for(const q of questions) {
    assert.equal(q.discipline,"adm");
    assert.equal(typeof q.question.answer,"boolean");
    assert.ok(q.question.statement.length>35);
    assert.ok(q.parts[0].length>35);
    assert.ok(q.question.bank && q.question.year && q.question.meta);
    assert.ok(q.question.source.includes("PDF 72.pdf"));
    assert.ok(topics[0].subtopics.includes(q.subtopic));
    assert.ok(!q.question.statement.includes("Gabarito:"));
    assert.ok(!/https?:\/\//i.test(q.parts[0]), "Texto de lei não deve conter endereço de site comercial");
  }
});
test("front-end carrega módulo administrativo sem mudar a chave de progresso", () => {
  const html=readFileSync(new URL("../tools/decorando.html",import.meta.url),"utf8");
  assert.ok(html.includes("decorando-data-adm-9784.js"));
  assert.ok(html.includes("...DATA_ADM"));
  assert.ok(html.includes("adm:TOPICS_ADM_EXTENDED") && html.includes("const TOPICS_ADM_EXTENDED"));
  assert.ok(html.includes('id:"adm",badge:"ADM"'));
  assert.ok(html.includes('const STORAGE_KEY = "lei-seca-enxuta-state"'));
});
