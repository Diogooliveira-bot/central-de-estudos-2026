import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
const root=new URL('../',import.meta.url),read=p=>fs.readFileSync(new URL(p,root),'utf8');
function fixture(){
 const storage=new Map(),g={},c={window:g,URL,console,localStorage:{
  getItem(k){return storage.has(k)?storage.get(k):null;},
  setItem(k,v){storage.set(k,String(v));},
  removeItem(k){storage.delete(k);}
 }};
 vm.createContext(c);
 for(const name of ['estrutura','aulas-logica','aulas-raciocinio','aulas-matematica','aulas-estatistica','complementos-teoria'])
  vm.runInContext(read('content/rlm-tjce-2026/'+name+'.js'),c,{filename:name});
 return {g,storage,course:g.RLM_CURSO_AULAS};
}

test('As questões não ficam mais dentro da teoria: só no banco externo, com o atalho do módulo',()=>{
 const {course}=fixture();assert.equal(Object.keys(course).length,14);
 for(const [id,d] of Object.entries(course))assert.ok(!('questions' in d),id+' não deve ter questões internas');
 const lib=read('tools/questoes-lib.mjs');assert.ok(lib.includes('rlm'));
 for(let n=1;n<=15;n++){
  const file=read('content/questoes/rlm/m'+String(n).padStart(2,'0')+'.js');
  const ids=file.match(/"id":\s*"rlm-m\d\d-autoral-\d+"/g)||[];
  assert.ok(ids.length>=(n===1?10:20),'M'+n+': '+ids.length+' questões no banco');
 }
});

test('Os catálogos de cadernos mantêm vínculos verificáveis; lacunas seguem registradas',()=>{
 const qc=JSON.parse(read('content/qc-sharing-links.js').match(/window\.QC_CENTRAL_SHARING_LINKS\s*=\s*(\{[\s\S]*\})\s*;/)[1]);
 const tec=JSON.parse(read('content/tec-cadernos-data.js').match(/window\.TEC_CADERNOS_DATA\s*=\s*(\{[\s\S]*\})\s*;/)[1]);
 const mod=JSON.parse(read('content/rlm-tjce-2026/estrutura.json')).modulos;
 const filters=qc.items.filter(x=>x.disciplineKey==='rlm'&&x.status==='VALIDADO'&&x.public);
 assert.equal(filters.length,14);
 for(const x of filters)assert.match(x.link,/^https:\/\/www\.qconcursos\.com\//);
 const tecById=new Map(tec.cadernos.map(x=>[x.id,x]));
 for(const m of mod)for(const id of m.tecCandidatos||[]){
  const row=tecById.get(id);assert.ok(row,m.id+' '+id);assert.match(row.url,/^https:\/\/www\.tecconcursos\.com\.br\//);
 }
 assert.equal(filters.filter(x=>x.code==='M07').length,0);
 assert.equal(filters.find(x=>x.code==='M09').quantity,1);
 assert.equal(filters.find(x=>x.code==='M14').quantity,3);
 assert.equal(mod.find(x=>x.id==='M15').tecCandidatos.length,0);
 const audit=JSON.parse(read('audits/rlm-etapa3-questoes-filtros-20261109.json'));
 assert.equal(audit.scope.totalQuestions,140);
 assert.equal(audit.questionChecks.failures.length,0);
 assert.equal(audit.filters.originalFreePremiumAccessPolicyUnchanged,true);
});

test('Leitor de RLM não tem mais questões internas, simulado nem caderno de erros',()=>{
 const s=read('ui/rlm-native-v1.js'),html=read('index.html');
 assert.match(s,/function speed\(\)/);
 for(const dead of ['function review()','function quiz(','function cardQuestion','RlmExam','reviewSpec','renderExam','bc-rlm-exam'])assert.ok(!s.includes(dead),dead);
 assert.ok(!html.includes('rlm-exam-v1.js'));
 assert.equal(fs.existsSync(new URL('ui/rlm-exam-v1.js',root)),false);
});
