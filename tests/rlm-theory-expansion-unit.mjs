import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
const root=new URL('../',import.meta.url);
const read=p=>fs.readFileSync(new URL(p,root),'utf8');
function course(expanded=true){
 const c={window:{},URL};vm.createContext(c);
 for(const f of ['estrutura','aulas-logica','aulas-raciocinio','aulas-matematica','aulas-estatistica','banco-fcc-legado'])vm.runInContext(read(`content/rlm-tjce-2026/${f}.js`),c);
 if(expanded)vm.runInContext(read('content/rlm-tjce-2026/complementos-teoria.js'),c);
 vm.runInContext(read('ui/rlm-theory-resources.js'),c);
 return c;
}
const plain=x=>JSON.parse(JSON.stringify(x));
test('a ampliação cobre os 70 capítulos sem alterar questões, banco legado ou treino',()=>{
 const original=course(false).window,c=course(),current=c.window;
 assert.equal(current.RLM_AMPLIACAO_COBERTURA.length,14);
 assert.equal(new Set(current.RLM_AMPLIACAO_COBERTURA).size,14);
 for(const [id,m]of Object.entries(original.RLM_CURSO_AULAS)){
  const next=current.RLM_CURSO_AULAS[id];
  assert.deepEqual(plain(next.questions),plain(m.questions),id);
  assert.equal(next.theory.length,m.theory.length);
  next.theory.forEach((ch,i)=>{
   assert.deepEqual(plain(ch.paragraphs),plain(m.theory[i].paragraphs),`${id} preserva a exposição anterior`);
   assert.equal(ch.workedExamples.length,1);
   assert.equal(ch.method.length,3);
   assert.ok(ch.development[0].length>100);
   ch.tables.forEach(t=>t.rows.forEach(r=>assert.equal(r.length,t.headers.length)));
  });
 }
 assert.deepEqual(plain(current.RLM_FCC_LEGADO),plain(original.RLM_FCC_LEGADO));
 assert.deepEqual(plain(current.RLM_TJCE_STRUCTURE.modulos[0]),plain(original.RLM_TJCE_STRUCTURE.modulos[0]));
 const snapshot=JSON.stringify(current.RLM_CURSO_AULAS);
 vm.runInContext(read('content/rlm-tjce-2026/complementos-teoria.js'),c);
 assert.equal(JSON.stringify(current.RLM_CURSO_AULAS),snapshot,'carregar duas vezes não duplica o material');
});
test('tabelas-verdade conferem com os conectivos e a validade do argumento',()=>{
 const d=course().window.RLM_CURSO_AULAS;
 const bool=x=>x==='V',vf=x=>x?'V':'F';
 for(const [p,q,and,or,imp,iff]of d.M02.theory[1].tables[0].rows){
  const a=bool(p),b=bool(q);assert.deepEqual([and,or,imp,iff],[vf(a&&b),vf(a||b),vf(!a||b),vf(a===b)]);
 }
 for(const [p,q,r,and,imp]of d.M02.theory[2].tables[0].rows){
  assert.equal(and,vf(bool(p)&&bool(q)));assert.equal(imp,vf(!(bool(p)&&bool(q))||bool(r)));
 }
 for(const [p,q,imp,or,notIff]of d.M03.theory[3].tables[0].rows){
  assert.equal(imp,or);assert.equal(notIff,vf(bool(p)!==bool(q)));
 }
 const admitted=d.M04.theory[3].tables[0].rows.filter(r=>r[2]==='V'&&r[3]==='V');
 assert.equal(admitted.length,1);assert.equal(admitted[0][1],'V');
});
test('regiões de Venn, associação e histogramas preservam as restrições numéricas',()=>{
 const d=course().window.RLM_CURSO_AULAS;
 const r=d.M05.theory[4].figure.values;
 assert.equal(r.reduce((a,b)=>a+b,0),60);
 assert.equal(r[0]+r[3]+r[4]+r[6],30);
 assert.equal(r[1]+r[3]+r[5]+r[6],28);
 assert.equal(r[2]+r[4]+r[5]+r[6],20);
 assert.equal(r[3]+r[4]+r[5],15);
 const rows=d.M06.theory[0].tables[0].rows;
 assert.deepEqual(plain(rows),[['Ana','Azul','10h'],['Bruno','Verde','9h'],['Carla','Vermelha','8h']]);
 for(const bin of d.M13.theory[3].figure.bins){assert.ok(bin.hi>bin.lo);assert.ok(bin.f>=0)}
 assert.equal(d.M13.theory[2].figure.values.reduce((s,r)=>s+r[1],0),100);
});
test('recuperação percentual, posições, média e dispersão têm resultados coerentes',()=>{
 assert.ok(Math.abs(48/(1-2/5)/(1-1/3)-120)<1e-10);
 assert.equal((20*6+30*8)/50,7.2);
 assert.equal(7+(20-1)*4,83);assert.equal(20*(7+83)/2,900);
 assert.equal(0.8*1.25,1);
 const values=[2,4,4,6],mean=values.reduce((a,b)=>a+b,0)/values.length;
 const variance=values.reduce((s,x)=>s+(x-mean)**2,0)/values.length;
 assert.equal(mean,4);assert.equal(variance,2);
 assert.equal(values.reduce((s,x)=>s+Math.abs(x-mean),0)/values.length,1);
 assert.equal(Math.sqrt(4)*Math.abs(-3),6);
});
test('renderização escapa textos, restringe links e oferece alternativas textuais às figuras',()=>{
 const {RlmTheoryResources:r,RLM_CURSO_AULAS:d}=course().window;
 const ch=plain(d.M06.theory[0]);ch.workedExamples[0].prompt='<img src=x onerror=alert(1)>';
 assert.ok(!r.chapter(ch).includes('<img src=x'));
 assert.ok(r.chapter(ch).includes('&lt;img'));
 assert.equal(r.references({references:[{title:'inválido',url:'javascript:alert(1)'}]}),'');
 for(const m of Object.values(d))for(const c of m.theory){
  const html=r.chapter(c);assert.ok(html.includes('Exemplo guiado:'));
  if(c.figure){assert.ok(html.includes('role="img"'));assert.ok(html.includes('<figcaption>'))}
  if(c.tables.length){assert.ok(html.includes('<caption>'));assert.ok(html.includes('scope="col"'))}
 }
});
test('as três entradas carregam dados e renderizador antes do leitor e compilam seus scripts',()=>{
 for(const path of ['index.html','preview-central-rlm-integrada.html','preview-rlm-tjce-2026.html']){
  const html=read(path);
  assert.ok(html.indexOf('aulas-estatistica.js')<html.indexOf('complementos-teoria.js'));
  assert.ok(html.includes('rlm-theory-resources.js'));
  for(const match of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)){
   if(/\bsrc\s*=|application\/ld\+json|application\/json/i.test(match[1]))continue;
   new vm.Script(match[2],{filename:path});
  }
 }
});
