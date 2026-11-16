// Teste de navegador da importação do PDF do Léo: gera um PDF fictício (sem dados reais) com o mesmo desenho
// do "Plano de Estudos", escolhe o arquivo na Agenda, confere a prévia, a gravação, a re-importação sem duplicar
// e a remoção. Rode: node tests/agenda-pdf-leo-browser.mjs
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { readFile, writeFile, mkdtemp, rm } from 'node:fs/promises';
import { resolve, extname, join } from 'node:path';
import { tmpdir } from 'node:os';
import { chromium } from 'playwright';

const root = resolve(new URL('..', import.meta.url).pathname);
const mime = { '.html': 'text/html', '.js': 'text/javascript', '.mjs': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.webp': 'image/webp', '.png': 'image/png', '.svg': 'image/svg+xml' };

const server = createServer(async (req, res) => {
  const url = new URL(req.url, 'http://localhost'); const path = url.pathname;
  const json = (body, status = 200) => { res.writeHead(status, { 'content-type': 'application/json' }); res.end(JSON.stringify(body)); };
  if (path === '/api/auth') return json({ authenticated: true, user: { id: 'fictional-free', name: 'Aluno Fictício', role: 'aluno', plan: 'free' } });
  if (path === '/api/sync') return json(req.method === 'POST' ? { revision: 1 } : { exists: false });
  if (path === '/api/plans') return json({ role: 'aluno', plan: 'free', status: 'active', isStaff: false, entitlements: {} });
  if (path === '/api/objective') return json({ objectiveId: 'career-tribunais-analista' });
  if (path.startsWith('/api/')) return json({});
  const file = resolve(root, '.' + (path === '/' ? '/central-v119.html' : decodeURIComponent(path)));
  try { const data = await readFile(file); res.writeHead(200, { 'content-type': mime[extname(file)] || 'application/octet-stream' }); res.end(data); }
  catch (_) { res.writeHead(404); res.end(); }
});
await new Promise((ok) => server.listen(0, '127.0.0.1', ok));
const base = `http://127.0.0.1:${server.address().port}`;

const WEEKDAYS = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];
const pad = (n) => String(n).padStart(2, '0');
const dayISO = (start, offset) => { const d = new Date(Date.UTC(...start.split('-').map((v, i) => (i === 1 ? +v - 1 : +v)))); d.setUTCDate(d.getUTCDate() + offset); return d; };
const br = (d, year = false) => `${pad(d.getUTCDate())}/${pad(d.getUTCMonth() + 1)}${year ? '/' + d.getUTCFullYear() : ''}`;

/** HTML do plano fictício: 2 semanas, 2 atividades por dia (mesma estrutura do PDF real). */
function planHtml({ start = '2026-11-16', suffix = '' } = {}) {
  const pages = [];
  pages.push(`<section><div class="top"><b>BASE COMPLETA</b><span>Aluno Fictício</span></div><div class="top"><span>Central de Estudos</span><span>Plano de estudos · Teste</span></div>
    <h1>01 · DIAGNÓSTICO INDIVIDUAL</h1><p>Perfil do estudante fictício.</p><p class="foot">Base Completa · Central de Estudos · Plano personalizado</p></section>`);
  for (let week = 0; week < 2; week++) {
    const first = dayISO(start, week * 7), last = dayISO(start, week * 7 + 6);
    let html = `<section><div class="top"><b>BASE COMPLETA</b><span>Aluno Fictício</span></div><div class="top"><span>Central de Estudos</span><span>Plano de estudos · Teste</span></div>
      <h3>02 · CRONOGRAMA</h3><h2>Semana ${pad(week + 1)}</h2>
      <p>${br(first, true)} a ${br(last, true)} · 21h00 planejadas · marque cada atividade concluída.</p>`;
    for (let i = 0; i < 7; i++) {
      const d = dayISO(start, week * 7 + i); const wd = WEEKDAYS[d.getUTCDay()];
      const n = week * 7 + i + 1;
      const inline = i === 2; const wrapped = i === 6;
      html += `<div class="day"><span>${wd}, ${br(d)}</span><span>3h00 · 2 atividades</span></div>`;
      html += `<div class="act"><span class="d">Português</span><div class="t"><b>M${pad(n)} Título fictício ${n}${suffix}</b><br>Ler o resumo da aula M${pad(n)} e anotar 3 pontos principais.</div><span class="m">90 min</span></div>`;
      html += inline
        ? `<div class="act"><span class="d">Raciocínio Lógico</span><div class="t"><b>M${pad(n)} Lógica fictícia ${n} — Ler o resumo e anotar as dúvidas.</b></div><span class="m">90 min</span></div>`
        : wrapped
          ? `<div class="act"><span class="d">Raciocínio Lógico</span><div class="t"><b>Revisão M${pad(n - 5)} a M${pad(n)}</b><br>Revisar as dúvidas anotadas em Raciocínio Lógico e organizar a Agenda da próxima<br>semana.</div><span class="m">90 min</span></div>`
          : `<div class="act"><span class="d">Raciocínio Lógico</span><div class="t"><b>M${pad(n)} Raciocínio fictício ${n}</b><br>Ler o resumo da aula M${pad(n)} e anotar as dúvidas.</div><span class="m">90 min</span></div>`;
    }
    html += `<div class="tip"><b>DICA DO LÉO</b><br>Constância vence intensidade.</div><p class="foot">Base Completa · Central de Estudos · Plano personalizado</p></section>`;
    pages.push(html);
  }
  pages.push(`<section><div class="top"><b>BASE COMPLETA</b><span>Aluno Fictício</span></div><h3>03 · MÉTODO E PRIORIZAÇÃO</h3><p>Teoria 35%</p></section>`);
  return `<!doctype html><html><head><meta charset="utf-8"><style>
    @page{size:A4;margin:14mm 12mm}body{font:9pt Helvetica,Arial,sans-serif;color:#12344d;margin:0}
    section{page-break-after:always}h1{font-size:18pt}h2{font-size:15pt;margin:4pt 0}h3{font-size:8pt;margin:8pt 0}
    .top{display:flex;justify-content:space-between;font-size:8pt;margin-bottom:2pt}
    .day{display:flex;justify-content:space-between;margin:12pt 10pt 4pt;font-size:9.5pt;font-weight:700}
    .act{display:grid;grid-template-columns:150pt 1fr 60pt;column-gap:20pt;margin:0 10pt 8pt;font-size:8pt}
    .act .d{text-align:right}.act .m{text-align:right}
    .tip{margin:14pt 10pt;padding:6pt;border:1px solid #999}.foot{font-size:7pt;position:static;margin-top:12pt}
  </style></head><body>${pages.join('')}</body></html>`;
}

const browser = await chromium.launch({ headless: true, args: ['--no-sandbox'] });
const tmp = await mkdtemp(join(tmpdir(), 'leo-pdf-'));
try {
  const pdfContext = await browser.newContext();
  const pdfPage = await pdfContext.newPage();
  async function makePdf(name, options) {
    await pdfPage.setContent(planHtml(options));
    const path = join(tmp, name);
    await writeFile(path, await pdfPage.pdf({ format: 'A4', printBackground: true }));
    return path;
  }
  const planA = await makePdf('plano-a.pdf', { start: '2026-11-16' });
  const planB = await makePdf('plano-b.pdf', { start: '2026-11-16', suffix: ' (revisado)' });
  await writeFile(join(tmp, 'qualquer.pdf'), '%PDF-1.4\n1 0 obj<</Type/Catalog>>endobj\ntrailer<</Root 1 0 R>>\n%%EOF');
  await writeFile(join(tmp, 'nao-e-pdf.pdf'), 'isto é só texto');

  const [vw, vh] = (process.env.LEO_VIEWPORT || '430x900').split('x').map(Number); // para conferir telas maiores: LEO_VIEWPORT=1280x900
  const context = await browser.newContext({ viewport: { width: vw, height: vh }, serviceWorkers: 'block' });
  const page = await context.newPage();
  const errors = [];
  await page.goto(`${base}/central-v119.html?view=home`);
  await page.waitForFunction(() => document.documentElement.dataset.centralReady === 'true', { timeout: 40000 });
  await page.evaluate(() => { const keys = []; for (let i = 0; i < localStorage.length; i++) keys.push(localStorage.key(i)); keys.filter((k) => k.startsWith('central-v6:agenda:') || k === 'central-v6:leo-plan:v1').forEach((k) => localStorage.removeItem(k)); });
  await page.evaluate(() => window.CentralAgenda.open());
  await page.waitForSelector('#bcLeoCard', { timeout: 10000 });

  // Escolhe o arquivo como a pessoa faria: tocando no botão (isso também limpa a escolha anterior).
  const choose = async (path) => {
    const [chooser] = await Promise.all([page.waitForEvent('filechooser'), page.locator('#bcLeoCard [data-bc-leo-pick]').click()]);
    await chooser.setFiles(path);
  };
  // A Central usa um "localStorage" isolado por usuário (const global); por isso lemos pelo identificador solto.
  const tasksOn = (date) => page.evaluate((d) => JSON.parse(localStorage.getItem('central-v6:agenda:' + d) || '[]'), date);
  const leoCount = () => page.evaluate(() => { let n = 0; for (let i = 0; i < localStorage.length; i++) { const k = localStorage.key(i); if (k.startsWith('central-v6:agenda:')) n += JSON.parse(localStorage.getItem(k)).filter((t) => t.source === 'leo-pdf').length; } return n; });

  // 1) cartão aparece, vazio, com botão principal
  assert.match(await page.locator('#bcLeoCard h2').innerText(), /Plano do Léo em PDF/);
  assert.match(await page.locator('#bcLeoCard [data-bc-leo-pick]').innerText(), /Adicionar PDF do Léo/);

  // 2) arquivo inválido: mensagem amigável e nada gravado
  await choose(join(tmp, 'nao-e-pdf.pdf'));
  await page.waitForFunction(() => /não é um PDF/.test(document.querySelector('.bc-leo-status')?.textContent || ''));
  assert.equal(await leoCount(), 0);

  // 3) PDF do plano: prévia correta
  await choose(planA);
  await page.waitForSelector('.bc-leo-overlay', { timeout: 60000 });
  const chips = await page.locator('.bc-leo-chips').innerText();
  assert.match(chips, /16\/11 a 29\/11\/2026/);
  assert.match(chips, /14 dias/);
  assert.match(chips, /28 atividades/);
  assert.match(chips, /42h no total/);
  assert.match(await page.locator('.bc-leo-merge').innerText(), /28 novas entram/);
  assert.equal(await page.locator('.bc-leo-warn').count(), 0, 'sem avisos de leitura');
  await page.screenshot({ path: join(tmp, 'previa.png') });
  assert.equal(await leoCount(), 0, 'nada é gravado antes de confirmar');

  // 4) cancelar não grava
  await page.getByRole('button', { name: 'Cancelar' }).click();
  assert.equal(await page.locator('.bc-leo-overlay').count(), 0);
  assert.equal(await leoCount(), 0);

  // 5) confirmar grava no formato da Agenda
  await choose(planA);
  await page.waitForSelector('.bc-leo-overlay');
  await page.getByRole('button', { name: 'Importar para a Agenda' }).click();
  await page.waitForFunction(() => /Pronto!/.test(document.querySelector('.bc-leo-status')?.textContent || ''));
  assert.equal(await leoCount(), 28);
  const monday = await tasksOn('2026-11-16');
  assert.equal(monday.length, 2);
  assert.equal(monday[0].discipline, 'pt');
  assert.equal(monday[1].discipline, 'rlm');
  assert.equal(monday[0].done, false);
  assert.match(monday[0].task, /^M01 Título fictício 1 — Ler o resumo da aula M01 e anotar 3 pontos principais\. \(90 min\)$/);
  assert.equal(monday[0].source, 'leo-pdf');
  const wednesday = await tasksOn('2026-11-18');
  assert.match(wednesday[1].task, /^M03 Lógica fictícia 3 — Ler o resumo e anotar as dúvidas\. \(90 min\)$/, 'descrição na mesma linha');
  const sunday = await tasksOn('2026-11-22');
  assert.match(sunday[1].task, /^Revisão M02 a M07 — Revisar as dúvidas anotadas em Raciocínio Lógico e organizar a Agenda da próxima semana\./, 'instrução quebrada em duas linhas');
  assert.match(await page.locator('#bcLeoCard .bc-leo-current').innerText(), /16\/11 a 29\/11\/2026.*28 atividades.*0 concluídas/s);
  // aparece na Agenda no dia escolhido
  await page.evaluate(() => { const i = document.getElementById('agendaDate'); i.value = '2026-11-16'; i.dispatchEvent(new Event('change', { bubbles: true })); window.CentralAgenda.render(); });
  assert.match(await page.locator('#agendaEditor').innerText(), /M01 Título fictício 1/);
  await page.screenshot({ path: join(tmp, 'agenda-importada.png'), fullPage: false });

  // 6) marcar uma como feita e importar o MESMO PDF: nada muda, nada duplica, feito continua feito
  await page.evaluate(() => window.CentralAgenda.toggle('2026-11-16', JSON.parse(localStorage.getItem('central-v6:agenda:2026-11-16'))[0].id, true));
  await choose(planA);
  await page.waitForSelector('.bc-leo-overlay');
  assert.match(await page.locator('.bc-leo-merge').innerText(), /Nada muda|28 já estavam/);
  await page.getByRole('button', { name: /Fechar|Cancelar/ }).first().click();
  assert.equal(await leoCount(), 28);
  assert.equal((await tasksOn('2026-11-16'))[0].done, true);

  // 7) plano atualizado: títulos mudam, feito é preservado, ainda 28
  await choose(planB);
  await page.waitForSelector('.bc-leo-overlay');
  assert.match(await page.locator('.bc-leo-merge').innerText(), /atualizad/);
  await page.getByRole('button', { name: 'Importar para a Agenda' }).click();
  await page.waitForFunction(() => /Pronto!/.test(document.querySelector('.bc-leo-status')?.textContent || ''));
  assert.equal(await leoCount(), 28);
  const updated = (await tasksOn('2026-11-16'))[0];
  assert.match(updated.task, /\(revisado\)/);
  assert.equal(updated.done, true);
  assert.match(await page.locator('#bcLeoCard .bc-leo-current').innerText(), /28 atividades.*1 concluída/s);

  // 8) tarefas manuais não são tocadas; remover apaga só as do PDF
  await page.evaluate(() => { const k = 'central-v6:agenda:2026-11-16'; const list = JSON.parse(localStorage.getItem(k)); list.push({ id: 'manual-1', time: '07:00', discipline: 'Português', task: 'Minha tarefa', done: false }); localStorage.setItem(k, JSON.stringify(list)); });
  await page.getByRole('button', { name: 'Remover do plano' }).click();
  await page.getByRole('button', { name: 'Apagar atividades do PDF' }).click();
  assert.equal(await leoCount(), 0);
  const left = await tasksOn('2026-11-16');
  assert.deepEqual(left.map((t) => t.id), ['manual-1']);
  assert.match(await page.locator('#bcLeoCard [data-bc-leo-pick]').innerText(), /Adicionar PDF do Léo/);

  // Opcional (só local): confere um PDF real do Léo sem gravar nada. Ex.: LEO_REAL_PDF=/caminho/plano.pdf
  if (process.env.LEO_REAL_PDF) {
    await choose(process.env.LEO_REAL_PDF);
    await page.waitForSelector('.bc-leo-overlay', { timeout: 60000 });
    console.log('PDF real:', (await page.locator('.bc-leo-chips').innerText()).replace(/\n/g, ' | '), '|', await page.locator('.bc-leo-merge').innerText(), '| avisos:', await page.locator('.bc-leo-warn').count());
    await page.getByRole('button', { name: 'Cancelar' }).click();
    assert.equal(await leoCount(), 0);
  }

  assert.deepEqual(errors, [], 'sem erros de script');
  console.log('agenda-pdf-leo-browser: ok');
  if (process.env.LEO_SHOTS) { const { copyFile } = await import('node:fs/promises'); for (const f of ['previa.png', 'agenda-importada.png']) await copyFile(join(tmp, f), join(process.env.LEO_SHOTS, f)).catch(() => {}); }
} finally {
  await browser.close(); server.close(); await rm(tmp, { recursive: true, force: true });
}
