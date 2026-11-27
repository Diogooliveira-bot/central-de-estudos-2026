import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { CONCURSOS_2026_SEED, RESEARCH_REJECTIONS } from '../lib/concursos-seed.js';
import { coverage, normalizeContest } from '../lib/concursos-handler.js';
import { JSDOM } from 'jsdom';

test('catálogo público previamente aberto continua legível offline sem liberar administração',async()=>{
  const dom=new JSDOM('<!doctype html><html><body></body></html>',{url:'https://preview.example.test/central-v119.html',runScripts:'outside-only'});
  const w=dom.window;
  const script=readFileSync(new URL('../ui/concursos-catalog-v1.js',import.meta.url),'utf8');
  w.BASE_COMPLETA_USER={id:'aluno-ficticio',role:'aluno'};
  w.fetch=async()=>({ok:true,json:async()=>({canManage:false,items:[{id:'teste-publico',name:'Concurso fictício',organ:'Órgão fictício',state:'CE',status:'publicado',active:true,cargos:[],subjects:[],sources:[],coverage:{percent:0}}]})});
  w.eval(script);
  await w.CentralContestCatalog.open();
  assert.equal(w.document.querySelectorAll('[data-contest-open="teste-publico"]').length,1);
  assert.equal(w.document.querySelectorAll('[data-contest-new]').length,0);
  w.CentralContestCatalog.close();
  w.CentralContestCatalog=null;
  w.fetch=async()=>{throw Error('offline')};
  w.eval(script);
  await w.CentralContestCatalog.open();
  const overlay=w.document.querySelectorAll('.contest-catalog-overlay').item(1);
  assert.match(overlay.textContent,/Catálogo salvo neste aparelho/);
  assert.equal(overlay.querySelectorAll('[data-contest-open="teste-publico"]').length,1);
  assert.equal(overlay.querySelectorAll('[data-contest-new]').length,0);
  overlay.querySelector('[data-contest-open="teste-publico"]').click();
  assert.equal(overlay.querySelectorAll('[data-contest-follow]').length,0);
  w.CentralContestCatalog.close();
  w.BASE_COMPLETA_USER={id:'admin-ficticio',role:'admin'};
  w.CentralContestCatalog=null;
  w.eval(script);
  await w.CentralContestCatalog.open();
  const adminOverlay=w.document.querySelectorAll('.contest-catalog-overlay').item(2);
  assert.match(adminOverlay.textContent,/Catálogo indisponível sem conexão/);
  assert.equal(adminOverlay.querySelectorAll('[data-contest-new]').length,0);
  dom.window.close();
});

test('pesquisa inicial possui 15 a 20 candidatos e catálogo não duplica ids', () => {
  const researched = CONCURSOS_2026_SEED.length + RESEARCH_REJECTIONS.length;
  assert.ok(researched >= 15 && researched <= 20, `foram pesquisados ${researched}`);
  assert.equal(new Set(CONCURSOS_2026_SEED.map((item) => item.id)).size, CONCURSOS_2026_SEED.length);
});

test('catálogo reutiliza função existente e respeita o limite Hobby da Vercel', () => {
  const apiFiles = readdirSync(new URL('../api/', import.meta.url)).filter((name) => name.endsWith('.js'));
  assert.ok(apiFiles.length <= 12, `foram encontradas ${apiFiles.length} funções`);
  assert.ok(!apiFiles.includes('concursos.js'));
  const config = JSON.parse(readFileSync(new URL('../vercel.json', import.meta.url), 'utf8'));
  assert.ok(config.rewrites.some((rule) => rule.source === '/api/concursos' && rule.destination === '/api/objective?resource=concursos'));
});

test('todo concurso publicado tem edital e fonte oficial HTTPS', () => {
  for (const item of CONCURSOS_2026_SEED) {
    assert.ok(item.name && item.organ && item.lastVerified);
    assert.ok(item.sources.length > 0);
    assert.ok(item.sources.every((source) => new URL(source.url).protocol === 'https:'));
    if (item.status === 'publicado') assert.ok(item.noticeNumber, `${item.id} sem número de edital`);
  }
});

test('GMF é prevista e deixa explícito que o conteúdo é referência de 2023', () => {
  const gmf = CONCURSOS_2026_SEED.find((item) => item.id === 'gmf-fortaleza-monitoramento');
  assert.equal(gmf.status, 'previsto');
  assert.equal(gmf.noticeNumber, null);
  assert.match(gmf.summary, /Edital nº 01\/2023/);
  assert.ok(gmf.sources.some((source) => source.type === 'edital-referencia' && source.url.endsWith('27_03_2023_GMF.pdf')));
  assert.ok(gmf.subjects.length >= 9);
});

test('TCE-CE fica inativo após verificação de fonte antiga; Receita e Banco Central mantêm cargos autorizados', () => {
  const tce = CONCURSOS_2026_SEED.find((item) => item.id === 'tce-ce-monitoramento');
  assert.equal(tce.active, false);
  assert.equal(tce.vacancies, null);
  assert.equal(tce.board, null);
  assert.ok(tce.sources.every((source) => !source.url.includes('1911-edital-do-concurso')));
  const receita = CONCURSOS_2026_SEED.find((item) => item.id === 'receita-federal-autorizado-2026');
  const bacen = CONCURSOS_2026_SEED.find((item) => item.id === 'bacen-autorizado-2026');
  assert.deepEqual(receita.cargos.map((cargo) => cargo.vacancies),[116,30]);
  assert.deepEqual(bacen.cargos.map((cargo) => cargo.vacancies),[100,50,20]);
  assert.equal(bacen.noticeNumber,null);
});

test('TJCE, ALECE e SEFAZ informam que as provas já foram realizadas', () => {
  for (const id of ['tjce-2026','alece-2026','sefaz-ce-2026']) {
    const item = CONCURSOS_2026_SEED.find((contest) => contest.id === id);
    assert.match(item.currentStage, /Provas realizadas/);
    assert.ok(item.examDate, `${id} sem data de prova`);
    assert.ok(item.currentStageDate, `${id} sem data de atualização da etapa`);
  }
});

test('cobertura usa pesos e não confunde quantidade de módulos com percentual', () => {
  const result = coverage({subjects:[
    {coverage:'complete',weight:2},
    {coverage:'partial',weight:2},
    {coverage:'missing',weight:6}
  ]});
  assert.equal(result.percent, 30);
  assert.match(result.method, /ponderada/);
});

test('normalização rejeita edição sem fonte oficial e preserva campos permitidos', () => {
  assert.throws(() => normalizeContest({
    id:'teste-2026',name:'Teste',organ:'Órgão',state:'CE',sphere:'Estadual',status:'publicado',year:2026,
    sources:[],cargos:[],subjects:[]
  }), /fonte oficial/);
  const item = normalizeContest({
    id:'teste-2026',name:'Teste',organ:'Órgão',state:'CE',sphere:'Estadual',status:'previsto',year:2026,currentStage:'Provas realizadas',currentStageDate:'2026-11-18',
    sources:[{title:'Página oficial',url:'https://example.gov.br/edital'}],
    cargos:[{name:'Técnico',education:'Médio',vacancies:2}],
    subjects:[{name:'Português',centralId:'pt',coverage:'complete',topics:['Interpretação'],weight:2}]
  });
  assert.equal(item.cargos[0].vacancies,2);
  assert.equal(item.subjects[0].coverage,'complete');
  assert.equal(item.currentStage,'Provas realizadas');
});


test('catálogo público não interpreta HTML/URLs maliciosos dos dados de edital',async()=>{
  const dom=new JSDOM('<!doctype html><html><body></body></html>',{url:'https://preview.example.test/central-v119.html',runScripts:'outside-only'});
  const w=dom.window;
  const attack='<img src=x onerror=alert(1)>';
  w.BASE_COMPLETA_USER={id:'ficticio',role:'aluno'};
  w.fetch=async()=>({ok:true,json:async()=>({canManage:false,items:[{
    id:'teste-seguro',name:attack,organ:attack,state:'CE',status:'publicado',active:true,
    cargos:[{name:attack,education:attack}],subjects:[{name:attack,coverage:'missing',topics:[attack]}],
    sources:[{title:attack,type:'oficial',url:'javascript:alert(1)'}],
    coverage:{percent:'0; background:url(javascript:alert(1))'},pending:[attack]
  }]})});
  w.eval(readFileSync(new URL('../ui/concursos-catalog-v1.js',import.meta.url),'utf8'));
  await w.CentralContestCatalog.open();
  const overlay=w.document.querySelector('.contest-catalog-overlay');
  assert.match(overlay.textContent,/onerror=alert/);
  assert.equal(overlay.querySelector('img'),null);
  assert.equal(overlay.querySelector('.contest-coverage i span').style.width,'0%');
  overlay.querySelector('[data-contest-open="teste-seguro"]').click();
  assert.equal(overlay.querySelector('img'),null);
  assert.match(overlay.querySelector('.contest-detail').textContent,/onerror=alert/);
  assert.equal(overlay.querySelector('.contest-detail .contest-source[href="#"]')!==null,true);
  dom.window.close();
});


test('Itaitinga oferece trilha histórica, sem inventar edital, cobertura ou vagas',()=>{
  const item=CONCURSOS_2026_SEED.find(c=>c.id==='itaitinga-agente-transito-monitoramento');
  assert.ok(item.active);
  assert.equal(item.status,'previsto');
  for(const field of ['noticeNumber','noticeDate','board','vacancies','salary','registrationStart','registrationEnd','examDate']) assert.equal(item[field],null);
  assert.match(item.summary,/001\/2015/);
  assert.equal(item.subjects.length,4);
  assert.equal(item.subjects.flatMap(s=>s.syllabus).length,62);
  assert.equal(coverage(normalizeContest(item)).percent,0);
  assert.ok(item.subjects.flatMap(s=>s.syllabus).flatMap(t=>t.links).every(l=>l.status==='suggested'));
  const dom=new JSDOM('',{runScripts:'outside-only'});
  dom.window.eval(readFileSync(new URL('../ui/study-objectives-catalog-v1.js',import.meta.url),'utf8'));
  const shortcut=dom.window.CentralStudyObjectiveCatalog.examShortcuts.find(s=>s.id==='exam-catalog-itaitinga-agente-transito-monitoramento-cargo-1');
  assert.equal(shortcut.area,'transito');
  assert.deepEqual(Array.from(shortcut.subjectIds),['pt','rlm']);
  assert.equal(shortcut.examSubjects.filter(s=>s.status==='preparation').length,2);
  dom.window.close();
});
