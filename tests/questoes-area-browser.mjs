// Navegador real: área Questões (menu → disciplina → módulo → responder) e cartão dentro do módulo.
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { resolve, extname } from 'node:path';
import { chromium } from 'playwright';
import { openModule } from './helpers/focus-navigation.mjs';
const root = process.cwd();
const mime = { '.html': 'text/html', '.js': 'application/javascript', '.css': 'text/css', '.json': 'application/json' };
const server = createServer(async (req, res) => {
  const url = new URL(req.url, 'http://localhost'), path = url.pathname;
  const json = (b, s = 200) => { res.writeHead(s, { 'content-type': 'application/json' }); res.end(JSON.stringify(b)); };
  if (path === '/api/auth') return json({ authenticated: true, user: { id: 'fictional-free', name: 'Aluno Fictício', role: 'aluno', plan: 'free' } });
  if (path === '/api/sync') return json(req.method === 'POST' ? { revision: 1 } : { exists: false });
  if (path === '/api/plans') return json({ role: 'aluno', plan: 'free', status: 'active', isStaff: false, entitlements: {} });
  if (path === '/api/objective') return json({ objectiveId: 'career-tribunais-analista' });
  if (path.startsWith('/api/')) return json({});
  const file = resolve(root, '.' + (path === '/' ? '/central-v119.html' : decodeURIComponent(path)));
  try { const d = await readFile(file); res.writeHead(200, { 'content-type': mime[extname(file)] || 'application/octet-stream' }); res.end(d); } catch (e) { res.writeHead(404); res.end(); }
});
await new Promise(r => server.listen(0, '127.0.0.1', r));
const base = 'http://127.0.0.1:' + server.address().port;
const browser = await chromium.launch({ headless: true, args: ['--no-sandbox'] });
const failures = [];
const errors = [];
async function novaPagina(width = 1200) {
  const ctx = await browser.newContext({ viewport: { width, height: 900 }, serviceWorkers: 'block' });
  const page = await ctx.newPage();
  page.on('pageerror', e => errors.push(e.message.slice(0, 200)));
  await page.goto(base + '/central-v119.html?view=home');
  await page.waitForFunction(() => document.documentElement.dataset.centralReady === 'true', { timeout: 30000 });
  return page;
}
// 1) Área Questões pelo menu
{
  const page = await novaPagina();
  await page.locator('[data-bcqa-rail]').click();
  await page.waitForSelector('[data-bc-questoes-area] [data-disc]');
  const discs = await page.locator('[data-bc-questoes-area] [data-disc]').count();
  if (discs !== 8) failures.push('hub: esperava 8 disciplinas, veio ' + discs);
  await page.locator('[data-bc-questoes-area] [data-disc="adm"]').click();
  await page.waitForSelector('[data-mod]');
  if (await page.locator('[data-mod]').count() !== 20) failures.push('adm: esperava 20 módulos');
  await page.locator('[data-mod="3"]').click();
  await page.waitForSelector('.bcqa-q');
  if (await page.locator('.bcqa-q').count() !== 10) failures.push('quiz: esperava 10 questões');
  if (await page.locator('.bcqa-q').first().locator('.bcqa-option').count() !== 5) failures.push('quiz: esperava 5 alternativas');
  // responde a 1ª errando de propósito e a 2ª acertando
  const q = await page.evaluate(async () => (await window.BCQuestoes.get('adm', 3)).slice(0, 2).map(x => x.answer));
  const errada = q[0] === 0 ? 1 : 0;
  await page.locator('.bcqa-q').nth(0).locator('[data-op="' + errada + '"]').click();
  await page.locator('.bcqa-q').nth(1).locator('[data-op="' + q[1] + '"]').click();
  const stats = await page.locator('[data-stats]').textContent();
  if (!/2\/10 respondidas · 1 acertos/.test(stats)) failures.push('placar: ' + stats);
  if (!(await page.locator('.bcqa-feedback').first().textContent()).includes('Resposta incorreta')) failures.push('feedback da errada');
  // refazer só os erros libera a 1ª
  await page.locator('[data-erros]').click();
  if (await page.locator('.bcqa-q').nth(0).locator('[data-op]:not([disabled])').count() !== 5) failures.push('refazer erros não liberou a questão');
  // progresso salvo e Esc fecha
  await page.keyboard.press('Escape');                       // volta à lista de módulos
  await page.waitForSelector('[data-mod]');
  await page.keyboard.press('Escape');                       // volta às disciplinas
  await page.waitForSelector('[data-bc-questoes-area] [data-disc]');
  await page.keyboard.press('Escape');                       // fecha
  if (await page.locator('[data-bc-questoes-area].bcqa-overlay').count()) failures.push('Esc não fechou a área');
  await page.context().close();
}
// 2) Cartão "Questões do módulo" dentro de cada disciplina
const casos = [['adm', 4, 5], ['penal', 2, 3], ['cpc', 2, 3], ['civil', 6, 7], ['cf', 7, 8], ['cpp', 4, 5], ['rlm', 2, 3], ['pt', 4, 5]];
for (const [id, idx, n] of casos) {
  const page = await novaPagina();
  try {
    await page.evaluate(() => window.openDisciplines());
    await page.locator('#disciplineGrid [data-study-open-subject="' + id + '"]').first().click();
    await page.waitForFunction(id => window.CentralDisciplineLoader.isReady(id), id, { timeout: 30000 });
    await openModule(page, id, idx, '.cf-module-head');
    const card = page.locator('.subject[data-id="' + id + '"] [data-bcqa-module-card="' + id + ':' + n + '"]').first();
    await card.waitFor({ state: 'attached', timeout: 15000 });
    await card.locator('[data-bcqa-abrir]').evaluate(e => e.click());
    await page.waitForSelector('.bcqa-q', { timeout: 15000 });
    const total = await page.locator('.bcqa-q').count();
    const sub = await page.locator('[data-bcqa-sub]').textContent();
    if (total !== 10) failures.push(id + ': ' + total + ' questões');
    console.log('QUESTOES_MODULO ' + id + ' M' + n + ' ok · ' + sub);
  } catch (e) { failures.push(id + ' M' + n + ': ' + String(e.message).split('\n')[0].slice(0, 160)); }
  await page.context().close();
}
// 3) As questões antigas continuam fora e o Lei em Dia/QC/TEC continuam
{
  const page = await novaPagina();
  await page.evaluate(() => window.openDisciplines());
  await page.locator('#disciplineGrid [data-study-open-subject="adm"]').first().click();
  await page.waitForFunction(() => window.CentralDisciplineLoader.isReady('adm'), null, { timeout: 30000 });
  await openModule(page, 'adm', 4, '.cf-module-head');
  const txt = await page.evaluate(() => document.body.innerText);
  if (/Resolver 5 questões|Resolver 10 questões\b(?! autorais)/.test(txt)) failures.push('ainda aparecem botões das questões antigas');
  if (!/Lei em Dia/i.test(txt)) failures.push('Lei em Dia sumiu do módulo');
  await page.context().close();
}
if (errors.length) failures.push('erros de página: ' + JSON.stringify([...new Set(errors)].slice(0, 3)));
await browser.close(); server.close();
if (failures.length) { console.error('QUESTOES_AREA_FALHOU=' + JSON.stringify(failures, null, 1)); process.exit(1); }
console.log('QUESTOES_AREA_OK');
