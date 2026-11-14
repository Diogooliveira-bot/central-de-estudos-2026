/* Informática — valida a preparação estrutural sem conteúdo ou links fictícios. */
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";
const read=path=>fs.readFileSync(new URL("../"+path,import.meta.url),"utf8");

test("Informática registra 13 módulos em produção com filtros Qconcursos reais (≥ 20 questões) e sem TEC",()=>{
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
  assert.ok(global.BaseInformatica.modules.every(m=>m.questions.authorial===null),"questões autorais ficam no banco /api/questoes, não na estrutura");
  assert.ok(global.BaseInformatica.modules.every(m=>Array.isArray(m.questions.qc)&&m.questions.qc.length>=1&&m.questions.qc.every(f=>f.count>=20&&String(f.url).startsWith("https://www.qconcursos.com/"))),"filtro QC real com no mínimo 20 questões");
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
  assert.doesNotMatch(read("ui/informatica-structure-v1.js"),/tecconcursos\.com\.br/,"nenhum link TEC em Informática");
});

test("M01 a M13 têm apostilas reais de teoria e revisão, sem questões fictícias",()=>{
  const subjects=[];
  const glob={};
  for(let n=1;n<=13;n++){
    const id="m"+String(n).padStart(2,"0");
    vm.runInNewContext(read("content/informatica/"+id+".js"),{window:glob,console});
    const m=glob.BC_INFO_CONTENT[id];
    assert.equal(m.id,id);
    assert.equal(m.status,"revisado");
    assert.ok(Array.isArray(m.full)&&m.full.length>=7,id+" precisa de capítulos suficientes");
    assert.ok(Array.isArray(m.review)&&m.review.length>=3,id+" precisa de revisão");
    assert.ok(m.full.every(c=>c.title&&c.html.includes("<p>")||c.html.includes("<table>")),id+" estrutura de texto");
    assert.ok(m.review.every(c=>c.title&&c.html.length>=250),id+" revisão não pode ser vazia");
    const words=m.full.map(c=>c.html.replace(/<[^>]*>/g," ")).join(" ").trim().split(/\s+/);
    assert.ok(words.length>=650,id+" teoria não pode ser somente sumário");
    assert.ok((m.resources||[]).every(r=>r.url.startsWith("https://")),id+" referência segura");
    assert.equal(m.questions,undefined,id+" material teórico não deve adicionar questões");
  }
  assert.equal(Object.keys(glob.BC_INFO_CONTENT).length,13);
});
test("Leitor registra 13 teorias e permite abri-las separadamente",()=>{
  const subjects=[];
  const glob={
    document:{querySelector:()=>null},
    localStorage:{getItem:()=>null,setItem:()=>{}},
    renderSubjects:()=>{},renderDisciplineGrid:()=>{},renderAll:()=>{},
    subjStats:s=>({total:s.topics.length,done:0,pct:0,unit:"metas"})
  };
  const context={window:glob,SUBJECTS:subjects,console};
  vm.runInNewContext(read("ui/informatica-structure-v1.js"),context);
  const reader=read("ui/informatica-reader-v1.js");
  new vm.Script(reader,{filename:"ui/informatica-reader-v1.js"});
  vm.runInNewContext(reader,context);
  assert.equal(glob.BaseInformaticaReader.available().length,13);
  assert.ok(glob.BaseInformatica.modules.every(m=>glob.BaseInformatica.hasPublishedTheory(m.id)), "teoria marcada disponível");
  assert.equal(glob.BaseInformatica.modules.filter(m=>m.questions.authorial).length,0);
  assert.equal(glob.BaseInformatica.modules.filter(m=>!m.questions.qc||!m.questions.qc.length).length,0);
});
test("Boot e CSS carregam a teoria sem alterar a produção",()=>{
  const boot=read("central-v119.html");
  assert.match(boot,/ui\/informatica-reader-v1\.js\?v=/);
  assert.match(boot,/ui\/informatica-reader-v1\.css\?v=/);
  assert.ok(boot.indexOf("ui/informatica-structure-v1.js") < boot.indexOf("ui/informatica-reader-v1.js"));
  const style=read("ui/informatica-reader-v1.css");
  assert.match(style,/max-width:780px/);
  assert.match(style,/\.bc-info-reader-overlay/);
});

test("Informática padroniza quatro cartões por módulo com avisos seguros",()=>{
 const js=read("ui/informatica-structure-v1.js");
 for(const label of ["Versão de revisão","Teoria completa","Filtro Qconcursos"])
   assert.ok(js.includes(label),"cartão ausente "+label);
 // "Questões do módulo" é inserido pelo app (questoes-modulo-card-v1.js); não há mais cartão desativado "Em construção".
 assert.ok(!/materialCard\(m,'questions'/.test(js),"sem cartão provisório de questões");
 assert.match(js,/bc-info-links/,"filtro QC vem depois do cartão de questões");
 assert.doesNotMatch(js,/Questões autorais permanecem em construção/);
 assert.match(js,/pt-cf-cards bc-info-materials/);
 assert.match(js,/pt-cf-reading/);
 assert.match(js,/BCOrientation\.html\('info:'/);
 assert.match(js,/bc-info-status">Em construção/);
 assert.match(js,/disabled aria-disabled="true"/);
 const reader=read("ui/informatica-reader-v1.js");
 assert.doesNotMatch(reader,/materials\.innerHTML=/,"não sobrescrever cartões e links");
 assert.match(reader,/bc-info-reading-value/);
 const css=read("ui/informatica-approved-layout-v1.css");
 assert.match(css,/pt-cf-card-review/);
 assert.match(css,/pt-cf-actions/);
 assert.match(css,/max-width:540px/);
 assert.match(read("central-v119.html"),/informatica-approved-layout-v1\.css/);
});
