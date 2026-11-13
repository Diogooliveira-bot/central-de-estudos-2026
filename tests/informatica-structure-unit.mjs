/* Informática — valida a preparação estrutural sem conteúdo ou links fictícios. */
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";
const read=path=>fs.readFileSync(new URL("../"+path,import.meta.url),"utf8");

test("Informática registra 13 módulos em produção sem questões/links publicados",()=>{
  const subjects=[];
  const html={querySelector:()=>null};
  const global={
    document:html,
    localStorage:{getItem:()=>null,setItem:()=>{}},
    renderSubjects:()=>{},
    renderDisciplineGrid:()=>{},
    renderAll:()=>{},
    subjStats:s=>({total:s.topics.length,done:0,pct:0,unit:"metas"})
  };
  const source=read("ui/informatica-structure-v1.js");
  new vm.Script(source,{filename:"ui/informatica-structure-v1.js"});
  vm.runInNewContext(source,{window:global,SUBJECTS:subjects,console});
  assert.equal(subjects.length,1);
  assert.equal(subjects[0].id,"info");
  assert.equal(subjects[0].topics.length,13);
  assert.equal(global.subjStats(subjects[0]).unit,"módulos");
  assert.equal(global.subjStats(subjects[0]).total,13);
  assert.equal(global.subjStats(subjects[0]).pct,0);
  assert.deepEqual(Array.from(global.BaseInformatica.modules,m=>m.id),Array.from({length:13},(_,i)=>"m"+String(i+1).padStart(2,"0")));
  assert.ok(global.BaseInformatica.modules.every(m=>m.status==="in_production" && !m.theory.summary && !m.theory.complete));
  assert.ok(global.BaseInformatica.modules.every(m=>m.questions.authorial===null && m.questions.qc===null));
  assert.equal(global.BaseInformatica.hasPublishedTheory("m01"),false);
  vm.runInNewContext(source,{window:global,SUBJECTS:subjects,console});
  assert.equal(subjects.length,1,"não duplicar cadastro em recarregamentos");
});

test("A Central carrega o catálogo e estrutura em ordem adequada",()=>{
  const boot=read("central-v119.html");
  assert.match(boot,/ui\/informatica-structure-v1\.css\?v=/);
  assert.match(boot,/ui\/informatica-structure-v1\.js\?v=/);
  assert.ok(boot.indexOf("ui/current-courses.js?v=")<boot.indexOf("ui/informatica-structure-v1.js?v="));
  assert.match(read("ui/study-objectives-catalog-v1.js"),/info:\s*\{\s*id:'info',\s*name:'Informática'/);
  assert.doesNotMatch(read("ui/informatica-structure-v1.js"),/tecconcursos\.com\.br|qconcursos\.com\/questoes/);
});
