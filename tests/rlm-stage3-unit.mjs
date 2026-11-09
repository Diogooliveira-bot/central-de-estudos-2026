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
 const spec=[['M02',4],['M03',4],['M04',4],['M05',4],['M06',4],['M07',4],['M08',4],['M09',4],['M10',4],['M11',4],['M12',4],['M13',4],['M14',4],['M15',4],['M03',7],['M04',7],['M05',7],['M11',7],['M12',7],['M14',7]];
 let refreshes=0;
 g.RlmNative={reviewSpec:spec,refreshBody(){refreshes++}};
 vm.runInContext(read('ui/rlm-exam-v1.js'),c,{filename:'rlm-exam-v1.js'});
 return {g,storage,refreshes:()=>refreshes,course:g.RLM_CURSO_AULAS,exam:g.RlmExam};
}

test('140 itens autorais: cinco alternativas distintas, comentário, dificuldade e gabarito válido',()=>{
 const {course}=fixture();assert.equal(Object.keys(course).length,14);
 let total=0;
 for(const [id,d] of Object.entries(course)){
  assert.equal(d.questions.length,10,id);
  const counts={fácil:0,médio:0,difícil:0},prompts=new Set();
  for(const [index,q] of d.questions.entries()){
   total++;
   assert.equal(q.options.length,5,id+'-'+index);
   assert.equal(new Set(q.options).size,5,id+'-'+index);
   assert.ok(Number.isInteger(q.answer)&&q.answer>=0&&q.answer<5,id+'-'+index);
   assert.ok(q.options[q.answer].trim().length>0,id+'-'+index);
   assert.ok(q.explanation.trim().length>=20,id+'-'+index);
   assert.ok(!prompts.has(q.prompt.trim()),id+'-'+index);
   prompts.add(q.prompt.trim());counts[q.level]++;
  }
  assert.deepEqual(counts,{fácil:3,médio:4,difícil:3},id);
 }
 assert.equal(total,140);
});

test('Verificações matemáticas independentes em questões de matemática, lógica e estatística',()=>{
 const {course}=fixture();
 const checks=[
 ['M05',0,18],['M05',3,27],['M05',6,10],['M05',7,13],['M05',9,34],
 ['M08',4,27],['M08',8,3*2**7],
 ['M10',0,8-3*2],['M10',3,-3*-5+2],['M10',7,2+3*(5-2)**2-4],
 ['M11',0,35*3/7],['M11',4,8*15/12],['M11',9,540/(9*6)*12*5],
 ['M12',0,200*.25],['M12',3,150/.75],['M12',4,100*1.2*.8],
 ['M12',7,32.25],['M12',8,240*1.25*.8],
 ['M13',0,100*10/40],['M13',1,360*.5],['M13',3,3+7],['M13',5,100*72/360],
 ['M14',0,(4+6+8)/3],['M14',3,(6*2+9)/3],['M14',7,(10*7+30*9)/40],['M14',8,5*4-(1+2+3+4)],
 ['M15',0,12-3],['M15',3,8/3],['M15',4,1],['M15',7,8/2],['M15',8,9*2**2],['M15',9,Math.sqrt(16/4)]
 ];
 for(const [id,index,expected] of checks){
  const q=course[id].questions[index],s=q.options[q.answer].replace('R$','').replace('%','').replace('°','').trim().replace(',','.');
  const fraction=/^(-?\d+)\/(\d+)$/.exec(s),actual=fraction?Number(fraction[1])/Number(fraction[2]):Number(s);
  assert.ok(Number.isFinite(actual)&&Math.abs(actual-expected)<.0001,id+'-'+(index+1)+': '+s+' versus '+expected);
 }
});

test('Simulado reúne 20 itens válidos de todos os 14 módulos, sem duplicar questões',()=>{
 const {g,course}=fixture(),spec=g.RlmNative.reviewSpec;
 assert.equal(spec.length,20);
 assert.equal(new Set(spec.map(x=>x.join('-'))).size,20);
 assert.equal(new Set(spec.map(x=>x[0])).size,14);
 for(const [id,i] of spec)assert.ok(course[id].questions[i]);
});

test('Simulado não revela gabarito antes da entrega, e persiste respostas',()=>{
 const {g,exam,storage,refreshes}=fixture();
 let page=exam.renderExam();
 assert.equal((page.match(/bc-rlm-exam-question/g)||[]).length,20);
 assert.doesNotMatch(page,/Gabarito: /);
 assert.doesNotMatch(page,/class="bc-rlm-feedback/);
 const [id,i]=g.RlmNative.reviewSpec[0],wrong=(g.RLM_CURSO_AULAS[id].questions[i].answer+1)%5;
 exam.select(0,wrong);
 assert.equal(exam.summary().answered,1);assert.ok(refreshes()>0);
 assert.equal(JSON.parse(storage.get('central-v6:rlm-tjce2026:exam:v1')).draft[id+'-'+i],wrong);
 page=exam.renderExam();assert.match(page,/1\/20 respondidas/);
 assert.doesNotMatch(page,/Gabarito: /);
});

test('Correção na entrega, histórico, reinício e caderno de erros não apagam prática',()=>{
 const {g,exam,storage}=fixture();
 const [id,index]=g.RlmNative.reviewSpec[0],q=g.RLM_CURSO_AULAS[id].questions[index],wrong=(q.answer+1)%5;
 storage.set('central-v6:rlm-tjce2026:answers:'+id,JSON.stringify({[index]:wrong,[index+1]:g.RLM_CURSO_AULAS[id].questions[index+1].answer}));
 storage.set('central-v6:rlm-tjce2026:answers:RF',JSON.stringify({['R'+id+'-'+index]:wrong}));
 exam.select(0,wrong);exam.submit();
 assert.equal(exam.summary().submitted,true);
 assert.equal(exam.summary().correct,0);
 assert.match(exam.renderExam(),/Gabarito: /);
 assert.equal(exam.mistakes().filter(x=>x.id===id&&x.index===index).length,1);
 assert.equal(exam.mistakes().find(x=>x.id===id&&x.index===index).sources.length,3);
 assert.match(exam.renderErrors(),/Origem: /);
 exam.retry();assert.equal(exam.summary().answered,0);
 assert.equal(exam.summary().submitted,false);
 assert.equal(exam.summary().attempts,1);
 assert.equal(exam.mistakes().filter(x=>x.id===id&&x.index===index).length,1,'erro do simulado continua no caderno após novo começo');
 assert.equal(JSON.parse(storage.get('central-v6:rlm-tjce2026:answers:'+id))[index],wrong);
 exam.markReviewed(id,index);
 assert.equal(exam.mistakes().filter(x=>x.id===id&&x.index===index).length,0,'questão revisada sai das pendências');
 exam.select(0,wrong);exam.submit();
 assert.equal(exam.mistakes().filter(x=>x.id===id&&x.index===index).length,1,'novo erro volta ao caderno');
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

test('Leitor mantém o simulado instantâneo e o treino M01 sem mudar gabaritos',()=>{
 const s=read('ui/rlm-native-v1.js'),html=read('index.html');
 assert.match(s,/function review\(\)/);
 assert.match(s,/function speed\(\)/);
 assert.match(s,/stage==='exam'/);
 assert.match(s,/stage==='errors'/);
 assert.match(s,/reviewSpec,refreshBody/);
 assert.match(html,/ui\/rlm-exam-v1\.js\?v=20261109etapas3/);
});
