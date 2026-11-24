// Manual preview homologation. Run only against the isolated PR #398 Vercel Preview
// with synthetic accounts in the empty pr398_concursos_ficticios Neon database.
import assert from 'node:assert/strict';
import { chromium } from 'playwright';

const preview = new URL(process.env.PR398_PREVIEW_URL || 'https://invalid.invalid');
assert.match(preview.hostname, /^central-de-estudos-[a-z0-9]+-estudotd\.vercel\.app$/);
const suffix = String(process.env.PR398_TEST_SUFFIX || '');
assert.match(suffix, /^[a-z0-9]{8,20}$/);
const credentials = Object.fromEntries(['admin', 'free', 'premium'].map(role => {
  const password = process.env[`PR398_${role.toUpperCase()}_PASSWORD`];
  assert.ok(password?.length >= 20, `Senha fictícia ${role} ausente`);
  return [role, {email:`pr398-e2e-${role}-${suffix}@basecompleta.invalid`,password}];
}));
const contestId = `pr398-browser-${suffix}-${Date.now().toString(36)}`;
const browser = await chromium.launch({headless:true,args:['--no-sandbox']});
const log = (stage, detail={}) => console.log(JSON.stringify({stage,...detail}));
function pdfFixture() {
  const stream='BT /F1 12 Tf 72 720 Td (Internet e intranet) Tj ET';
  const objects=['<< /Type /Catalog /Pages 2 0 R >>','<< /Type /Pages /Kids [3 0 R] /Count 1 >>','<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>','<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>',`<< /Length ${stream.length} >>\nstream\n${stream}\nendstream`];
  let content='%PDF-1.4\n'; const offsets=[0];
  for(const [i,object] of objects.entries()){offsets.push(content.length);content+=`${i+1} 0 obj\n${object}\nendobj\n`;}
  const start=content.length;
  content+=`xref\n0 ${objects.length+1}\n0000000000 65535 f \n`+offsets.slice(1).map(n=>String(n).padStart(10,'0')+' 00000 n \n').join('')+`trailer\n<< /Size ${objects.length+1} /Root 1 0 R >>\nstartxref\n${start}\n%%EOF`;
  return Buffer.from(content);
}
async function login(role,viewport={width:1440,height:900}) {
  const context=await browser.newContext({viewport,serviceWorkers:'allow'});
  const page=await context.newPage(); const errors=[];
  page.on('pageerror',error=>errors.push(error.message));
  await page.goto(preview.href,{waitUntil:'domcontentloaded',timeout:45000});
  await page.locator('#email').fill(credentials[role].email);
  await page.locator('#password').fill(credentials[role].password);
  await page.locator('button[type="submit"]').first().click();
  await page.locator('[data-student-primary-nav="edital"]').waitFor({timeout:45000});
  // O primeiro acesso abre o orientador; acessos seguintes restauram o objetivo remoto.
  await page.waitForTimeout(2000);
  if(await page.locator('#studyObjectiveDialog').isVisible()) {
    await page.locator('[data-study-free]').click();
    await page.locator('label.study-free-choice').first().click();
    await page.locator('[data-study-save-free]').click();
    await page.locator('#studyObjectiveDialog').waitFor({state:'detached',timeout:30000});
  }
  return {context,page,errors};
}
async function catalog(page){
  await page.locator('[data-student-primary-nav="edital"]').click();
  await page.locator('.contest-catalog-head h1').waitFor({timeout:30000});
  assert.equal(await page.locator('.contest-catalog-head h1').innerText(),'Editais e Concursos');
}
async function adminFlow(){
  const {context,page,errors}=await login('admin');
  try {
    await catalog(page);
    assert.ok(await page.locator('[data-contest-new]').isVisible());
    await page.locator('[data-contest-open="prf-2021-policial-rodoviario-federal"]').click();
    assert.ok((await page.locator('.contest-detail').innerText()).includes('Em preparação'));
    await page.locator('[data-contest-back]').first().click();
    await page.locator('[data-contest-new]').click();
    await page.locator('[data-field="id"]').fill(contestId);
    await page.locator('[data-field="name"]').fill('Concurso fictício de homologação');
    await page.locator('[data-field="organ"]').fill('Órgão fictício');
    await page.locator('[data-field="sources.0.title"]').fill('Edital fictício');
    await page.locator('[data-field="sources.0.url"]').fill('https://example.org/edital-ficticio.pdf');
    await page.locator('[data-add-cargo]').click();
    await page.locator('[data-field="cargos.0.name"]').fill('Cargo fictício');
    await page.locator('[data-add-subject]').click();
    await page.locator('[data-field="subjects.0.name"]').fill('Informática');
    await page.locator('[data-field="subjects.0.centralId"]').selectOption('info');
    await page.locator('[data-import-target="0"]').click();
    await page.locator('[data-pdf]').setInputFiles({name:'edital-ficticio.pdf',mimeType:'application/pdf',buffer:pdfFixture()});
    await page.locator('[data-pdf-status]').getByText(/1 páginas lidas/).waitFor({timeout:30000});
    assert.match(await page.locator('[data-pdf-lines]').inputValue(),/Internet e intranet/);
    await page.locator('[data-pdf-lines]').fill('Internet e intranet\nAssunto fictício sem cobertura');
    await page.locator('[data-import-lines]').click();
    assert.equal(await page.locator('.contest-form-topic').count(),2);
    await page.locator('[data-suggest-topic="0.0"]').click();
    const suggestionCount=await page.locator('.contest-form-topic').first().locator('.contest-form-link').count();
    assert.ok(suggestionCount>0,'Assunto deve produzir sugestão pendente');
    await page.locator('[data-field="subjects.0.syllabus.0.links.0.chapterId"]').selectOption('info-09-c01');
    await page.locator('[data-field="subjects.0.syllabus.0.links.0.evidence"]').fill('Homologação fictícia: seção existente, alcance parcial.');
    await page.locator('[data-review-link="0.0.0.approved"]').click();
    assert.match(await page.locator('.contest-form-topic').first().innerText(),/Parcial/);
    assert.match(await page.locator('.contest-form-topic').nth(1).innerText(),/Sem cobertura/);
    await page.locator('[data-contest-save="create"]').click();
    await page.locator('.contest-detail h2').getByText('Concurso fictício de homologação').waitFor({timeout:30000});
    assert.match(await page.locator('.contest-detail').innerText(),/Em preparação/);
    const response=await page.evaluate(async id=>{let r=await fetch('/api/concursos?admin=1',{credentials:'same-origin'});let b=await r.json();return {status:r.status,item:b.items.find(x=>x.id===id)}},contestId);
    assert.equal(response.status,200);
    assert.equal(response.item.subjects[0].syllabus.length,2);
    assert.equal(response.item.subjects[0].syllabus[0].links[0].chapterId,'info-09-c01');
    assert.equal(response.item.subjects[0].syllabus[0].links[0].status,'approved');
    assert.ok(response.item.coverage.percent<100);
    await page.locator(`[data-contest-edit="${contestId}"]`).click();
    await page.locator('[data-field="summary"]').fill('Conferido no navegador isolado.');
    await page.locator('[data-contest-save="update"]').click();
    await page.locator('.contest-detail .lead').first().getByText('Conferido no navegador isolado.').waitFor({timeout:30000});
    assert.deepEqual(errors,[]);
    log('admin-pdf-cadastro-vinculo-edicao', {coverage:response.item.coverage.percent,suggestionCount,topics:2});
  } finally { await context.close(); }
}
async function studentFlow(role,viewport){
  const {context,page,errors}=await login(role,viewport);
  try {
    await catalog(page);
    assert.equal(await page.locator('[data-contest-new]').count(),0);
    assert.equal(await page.locator(`[data-contest-open="${contestId}"]`).count(),0,'Rascunho fictício não é visível aos alunos');
    const privateInventory=await page.evaluate(async()=>{const r=await fetch('/api/concursos?library=1');return r.status;});
    assert.equal(privateInventory,403);
    if(role==='free') {
      const blocked=await page.evaluate(async()=>{const r=await fetch('/api/objective?resource=exam-progress&examId=trt8-2026-aj-area-judiciaria');return r.status;});
      assert.equal(blocked,403,'Plano Gratuito não pode sincronizar checklist Premium');
    }
    await page.locator('[data-contest-open="prf-2021-policial-rodoviario-federal"]').click();
    assert.match(await page.locator('.contest-detail').innerText(),/Em preparação/);
    await page.locator('[data-contest-back]').first().click();
    for(const id of ['trt8-2026','tjpb-2026']) {
      await page.locator(`[data-contest-open="${id}"]`).click();
      assert.equal(await page.locator('[data-contest-follow]').count(),1,`Seleção ausente em ${id}`);
      const selected=await page.evaluate(contest=>window.CentralStudyObjectives?.selectedContestIds?.().some(id=>id.includes(contest)),id);
      if(!selected){
        await page.locator('[data-contest-follow]').click();
        await page.locator('.contest-toast').last().getByText('Seleção de editais atualizada.').waitFor({timeout:30000});
      }
      await page.locator('[data-contest-back]').first().click();
    }
    const selection=await page.evaluate(async()=>{const r=await fetch('/api/objective');const b=await r.json();return {status:r.status,ids:b.selectedContestIds,local:window.CentralStudyObjectives?.selectedContestIds?.()};});
    assert.equal(selection.status,200);
    assert.equal(selection.ids.length,2);
    assert.deepEqual(selection.ids,selection.local);
    assert.ok(selection.ids.some(id=>id.includes('trt8')));
    assert.ok(selection.ids.some(id=>id.includes('tjpb')));
    const width=await page.locator('.contest-catalog-overlay').evaluate(el=>({viewport:innerWidth,scroll:el.scrollWidth,client:el.clientWidth}));
    assert.ok(width.scroll <= width.viewport+10,`Transbordamento horizontal ${JSON.stringify(width)}`);
    await page.locator('[data-contest-close]').click();
    assert.deepEqual(errors,[]);
    log(`${role}-selecao-permissoes-responsivo`,{viewport:viewport.width,selected:selection.ids,libraryStatus:privateInventory});
  } finally { await context.close(); }
}
async function premiumProgressAndOffline(){
  const {context,page,errors}=await login('premium',{width:1366,height:900});
  try {
    async function choose(id){
      await page.evaluate(()=>window.CentralStudyObjectives.open());
      await page.locator('[data-study-exams]').click();
      await page.locator(`[data-study-exam="${id}"]`).click();
      await page.locator('#studyObjectiveDialog').waitFor({state:'detached',timeout:30000});
    }
    await choose('exam-trt8-2026-analista-judiciaria');
    await page.evaluate(()=>window.centralHardOpen('disciplines'));
    await page.locator('#trt8VerticalizedEntry').click();
    await page.locator('#trt8VerticalizedDialog .exam-subject summary').first().click();
    const marker=page.locator('#trt8VerticalizedDialog input[data-exam-marker="studied"]').first();
    const topicId=await marker.getAttribute('data-exam-topic');
    await marker.locator('..').click();
    await page.waitForTimeout(5000);
    const syncStatus=await page.locator('#trt8VerticalizedDialog [data-exam-sync-status]').innerText();
    const trt=await page.evaluate(async()=>{const r=await fetch('/api/objective?resource=exam-progress&examId=trt8-2026-aj-area-judiciaria');return {status:r.status,body:await r.json()};});
    log('progresso-diagnostico',{syncStatus,online:await page.evaluate(()=>navigator.onLine),remote:trt.body.progress?.[topicId]||null});
    assert.match(syncStatus,/sincronizado na sua conta/);
    assert.equal(trt.status,200);
    assert.equal(trt.body.progress[topicId].studied.value,true);
    await page.locator('#trt8VerticalizedDialog [data-exam-close]').click();
    await choose('exam-tjpb-2026-analista-judiciaria');
    await page.evaluate(()=>window.centralHardOpen('disciplines'));
    await page.locator('#examVerticalizedEntry').click();
    const tjp=await page.evaluate(async()=>{const r=await fetch('/api/objective?resource=exam-progress&examId=tjp-2026-aj-area-judiciaria');return {status:r.status,body:await r.json()};});
    assert.equal(tjp.status,200);
    assert.deepEqual(tjp.body.progress,{},'Checklist de outro edital continua independente');
    await page.locator('#examVerticalizedDialog [data-exam-close]').click();
    await choose('exam-trt8-2026-analista-judiciaria');
    await page.evaluate(()=>window.centralHardOpen('disciplines'));
    await page.locator('#trt8VerticalizedEntry').click();
    await page.locator('#trt8VerticalizedDialog .exam-subject summary').first().click();
    assert.equal(await page.locator(`#trt8VerticalizedDialog input[data-exam-topic="${topicId}"][data-exam-marker="studied"]`).isChecked(),true);
    await page.locator('#trt8VerticalizedDialog [data-exam-close]').click();
    log('premium-progresso-por-edital', {topicId,trtStatus:trt.status,tjpbStatus:tjp.status});

    await page.evaluate(async()=>{const sw=await navigator.serviceWorker.ready;sw.active.postMessage({type:'PREPARE_OFFLINE'});});
    await page.waitForFunction(async()=>{const keys=await caches.keys();for(const key of keys){const cache=await caches.open(key);const reqs=await cache.keys();if(reqs.some(r=>r.url.includes('/central-offline-ready.json')))return true;}return false;},null,{timeout:90000});
    await context.setOffline(true);
    await page.goto(new URL('/central-v119.html',preview),{waitUntil:'domcontentloaded',timeout:30000});
    await page.locator('[data-student-primary-nav="edital"]').waitFor({timeout:30000});
    assert.match(await page.locator('body').innerText(),/Central de Estudos/);
    log('premium-offline', {shell:true});
    await context.setOffline(false);
    assert.deepEqual(errors,[]);
  } finally { await context.close(); }
}
try {
  await adminFlow();
  await studentFlow('free',{width:390,height:844});
  await studentFlow('premium',{width:820,height:1180});
  await premiumProgressAndOffline();
}
finally { await browser.close(); }
