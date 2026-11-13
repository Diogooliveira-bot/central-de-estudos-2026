// Navegador real: área Questões (menu → disciplina → módulo → responder) e cartão dentro do módulo.
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import fs from 'node:fs';
import vm from 'node:vm';
import crypto from 'node:crypto';
import { PGlite } from '@electric-sql/pglite';
import { createQuestoesHandler } from '../lib/questoes-handler.js';
import { resolve, extname } from 'node:path';
import { chromium } from 'playwright';
import { openModule } from './helpers/focus-navigation.mjs';
const root = process.cwd();
// Servidor real de questões (handler + migrações) sobre PostgreSQL em memória; um aluno fictício por página.
const db = new PGlite();
for (const f of fs.readdirSync(new URL('../db/migrations/', import.meta.url)).sort()) await db.exec(fs.readFileSync(new URL('../db/migrations/' + f, import.meta.url), 'utf8'));
const sql = (strings, ...values) => db.query(strings.reduce((a, part, i) => a + '$' + i + part), values.map(v => v instanceof Date ? v.toISOString() : v)).then(r => r.rows);
const conhecidos = new Set();
async function garantirAluno(id, plano) {
  if (conhecidos.has(id)) return; conhecidos.add(id);
  await sql`INSERT INTO central_users(user_id,name,email,role,password_hash,active) VALUES(${id},'Aluno Ficticio',${id + '@example.invalid'},'aluno','x',TRUE)`;
  await sql`INSERT INTO central_user_subscriptions(subscription_id,user_id,plan_code,status,starts_at,ends_at,grant_source)
    VALUES(${crypto.randomUUID()},${id},${plano},'active',NOW()-INTERVAL '1 day',${plano === 'premium' ? new Date(Date.now() + 90 * 86400000) : null},'manual')`;
}
const questoesApi = createQuestoesHandler({ requireSession: async req => { const id = String(req.headers['x-test-user'] || ''); await garantirAluno(id, id.startsWith('premium-') ? 'premium' : 'free'); return { ok: true, sql, user: { id } }; } });
function gabarito(disc, n) {
  const w = { window: {} };
  new vm.Script(fs.readFileSync(new URL(`../content/questoes/${disc}/m${String(n).padStart(2, '0')}.js`, import.meta.url), 'utf8')).runInNewContext(w);
  return w.window.BC_QUESTOES[disc][n].map(q => q.answer);
}
const mime = { '.html': 'text/html', '.js': 'application/javascript', '.css': 'text/css', '.json': 'application/json' };
const server = createServer(async (req, res) => {
  const url = new URL(req.url, 'http://localhost'), path = url.pathname;
  const json = (b, s = 200) => { res.writeHead(s, { 'content-type': 'application/json' }); res.end(JSON.stringify(b)); };
  if (path === '/api/questoes') { req.query = Object.fromEntries(url.searchParams); return questoesApi(req, res); }
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
async function novaPagina(width = 1200, usuario = crypto.randomUUID()) {
  const ctx = await browser.newContext({ viewport: { width, height: 900 }, serviceWorkers: 'block', extraHTTPHeaders: { 'x-test-user': usuario } });
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
  // seleciona e só então responde: a 1ª errando de propósito, a 2ª acertando
  const q = gabarito('adm', 3).slice(0, 2);
  if (await page.evaluate(() => typeof window.BC_QUESTOES !== 'undefined')) failures.push('o gabarito não pode existir no navegador');
  const errada = q[0] === 0 ? 1 : 0;
  await page.locator('.bcqa-q').nth(0).locator('[data-op="' + errada + '"]').click();
  if (await page.locator('.bcqa-q').nth(0).locator('.bcqa-feedback').count()) failures.push('selecionar não pode responder');
  await page.locator('.bcqa-q').nth(0).locator('[data-strike="' + ((errada + 1) % 5) + '"]').click();
  await page.locator('.bcqa-q').nth(0).locator('[data-responder]').click();
  await page.locator('.bcqa-q').nth(1).locator('[data-op="' + q[1] + '"]').click();
  await page.locator('.bcqa-q').nth(1).locator('[data-responder]').click();
  const stats = await page.locator('[data-stats]').textContent();
  if (!/2\/10 respondidas · 1 acertos/.test(stats)) failures.push('placar: ' + stats);
  if (!(await page.locator('.bcqa-feedback').first().textContent()).includes('Resposta incorreta')) failures.push('feedback da errada');
  // modo Foco: uma por vez
  await page.locator('[data-modo="foco"]').click();
  if (await page.locator('.bcqa-q').count() !== 1) failures.push('modo Foco deve mostrar uma questão');
  await page.locator('[data-modo="rolagem"]').click();
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
// 1b) Limite diário: Gratuito responde 5 e a 6ª fica bloqueada; Premium sem limite; reabrir não zera a cota
{
  const gab = gabarito('adm', 3);
  const page = await novaPagina(900);
  await page.evaluate(() => window.BCQuestoesArea.openModule('adm', 3));
  await page.waitForSelector('.bcqa-q');
  const uso0 = await page.locator('[data-uso]').textContent();
  if (!/0 de 5 questões respondidas hoje/.test(uso0)) failures.push('faixa de uso inicial: ' + uso0);
  for (let i = 0; i < 5; i++) {
    await page.locator('.bcqa-q').nth(i).locator('[data-op="' + gab[i] + '"]').click();
    await page.locator('.bcqa-q').nth(i).locator('[data-responder]').click();
    await page.locator('.bcqa-q').nth(i).locator('.bcqa-feedback').waitFor({ timeout: 8000 });
  }
  if (!/Você usou as 5 questões gratuitas/.test(await page.locator('[data-uso]').textContent())) failures.push('aviso de limite não apareceu');
  await page.locator('.bcqa-q').nth(5).locator('[data-op="0"]').click();
  if (!(await page.locator('.bcqa-q').nth(5).locator('[data-responder]').isDisabled())) failures.push('a 6ª questão não pode ser respondida no Gratuito');
  // fechar e reabrir: a sessão zera, mas a cota do dia continua gasta (vem do servidor)
  await page.evaluate(() => window.BCQuestoesArea.close());
  await page.evaluate(() => window.BCQuestoesArea.openModule('adm', 3));
  await page.waitForSelector('.bcqa-q');
  if (!/Você usou as 5 questões gratuitas/.test(await page.locator('[data-uso]').textContent())) failures.push('reabrir não pode devolver a cota');
  if (await page.locator('.bcqa-feedback').count()) failures.push('reabrir deve zerar as respostas da tela');
  await page.context().close();

  const premium = await novaPagina(900, 'premium-' + crypto.randomUUID());
  await premium.evaluate(() => window.BCQuestoesArea.openModule('adm', 3));
  await premium.waitForSelector('.bcqa-q');
  for (let i = 0; i < 7; i++) {
    await premium.locator('.bcqa-q').nth(i).locator('[data-op="' + gab[i] + '"]').click();
    await premium.locator('.bcqa-q').nth(i).locator('[data-responder]').click();
    await premium.locator('.bcqa-q').nth(i).locator('.bcqa-feedback').waitFor({ timeout: 8000 });
  }
  if (await premium.locator('[data-uso]').count()) failures.push('Premium não deve ver faixa de limite');
  await premium.context().close();
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
    await card.locator('.bcqa-abrir').evaluate(e => e.click());
    await page.waitForSelector('.bcqa-q', { timeout: 15000 });
    const total = await page.locator('.bcqa-q').count();
    const sub = await page.locator('[data-bcqa-sub]').textContent();
    if (total !== 10) failures.push(id + ': ' + total + ' questões');
    console.log('QUESTOES_MODULO ' + id + ' M' + n + ' ok · ' + sub);
  } catch (e) { failures.push(id + ' M' + n + ': ' + String(e.message).split('\n')[0].slice(0, 160)); }
  await page.context().close();
}
// 3) Questões antigas fora; Lei em Dia e Questões no mesmo padrão de cartão; rodapé retirado
for (const [id, idx] of [['cpc', 4], ['cf', 4], ['cpp', 4], ['adm', 4], ['civil', 6], ['penal', 2], ['pt', 4], ['rlm', 2]]) {
  const page = await novaPagina();
  await page.evaluate(() => window.openDisciplines());
  await page.locator('#disciplineGrid [data-study-open-subject="' + id + '"]').first().click();
  await page.waitForFunction(id => window.CentralDisciplineLoader.isReady(id), id, { timeout: 30000 });
  await openModule(page, id, idx, '.cf-module-head');
  await page.waitForTimeout(2200);
  const r = await page.evaluate(id => {
    const root = document.querySelector('.subject[data-id="' + id + '"]');
    const vis = el => { const b = el.getBoundingClientRect(); const cs = getComputedStyle(el); return b.width > 0 && b.height > 0 && cs.visibility !== 'hidden'; };
    const visiveis = sel => [...root.querySelectorAll(sel)].filter(vis);
    const texto = [...root.querySelectorAll('*')].filter(e => vis(e) && !e.children.length).map(e => e.textContent.trim()).join('\n');
    return {
      lei: visiveis('.bcmc-law').length, nativaDuplicada: visiveis('.bc-law-relocated').length, questoes: visiveis('.bcmc-questions').length,
      marcarNaLei: visiveis('.bcmc-law button').filter(b => /marcar conclu/i.test(b.textContent)).length + visiveis('.cpc-mini-panel').filter(p => /lei em dia/i.test(p.textContent) && /marcar conclu[íi]do/i.test(p.textContent)).length,
      ferramentas: /ferramentas do m[óo]dulo/i.test(texto), rodadas: /quest[õo]es feitas por rodadas/i.test(texto),
      antigas: /Resolver 5 quest[õo]es|Resolver 10 quest[õo]es(?! autorais)/.test(texto),
      // Ordem: revisão → teoria completa → Lei em Dia → Questões → filtros QC/TEC → anotações → agendar revisão
      ordem: (() => {
        const mod = root.querySelector('.bc-focus-current-module') || root;
        const marcas = [/^(⚡|↺)?\s*Versão de revisão$/, /^(📚|📖)?\s*Teoria completa$/, /^(⚖️)?\s*Lei em Dia$/, /^(✍️)?\s*Questões do módulo$/, /^Links do QConcursos e do TEC$|^QQConcursos/, /^Anotações( do módulo)?$|^ANOTAÇÕES DO MÓDULO$/i, /^Agendar revisão$/];
        const els = [...mod.querySelectorAll('*')].filter(e => vis(e) && !e.closest('.bc-law-relocated,.bc-footer-removed') && (e.children.length === 0 || /^(B|H3|H4|STRONG|LABEL|SPAN)$/.test(e.tagName)));
        const tops = marcas.map(re => { const e = els.find(x => re.test(x.textContent.trim().replace(/\s+/g, ' '))); return e ? e.getBoundingClientRect().top + scrollY : null; });
        const achados = tops.filter(t => t != null);
        return { tops, ok: achados.every((t, i) => i === 0 || t >= achados[i - 1]), questoes: tops[3] != null, filtros: tops[4] != null };
      })()
    };
  }, id);
  if (id !== 'pt' && id !== 'rlm' && r.lei < 1) failures.push(id + ': cartão de Lei em Dia no padrão novo não apareceu');
  if (r.questoes < 1) failures.push(id + ': cartão de Questões não apareceu');
  if (r.nativaDuplicada) failures.push(id + ': bloco antigo da Lei em Dia continua visível (duplicado)');
  if (r.marcarNaLei) failures.push(id + ': Lei em Dia ainda tem "Marcar concluído"');
  if (r.ferramentas) failures.push(id + ': "Ferramentas do módulo" ainda aparece');
  if (r.rodadas) failures.push(id + ': "Questões feitas por rodadas" ainda aparece');
  if (!r.ordem.ok) failures.push(id + ': ordem dos blocos fora do padrão ' + JSON.stringify(r.ordem.tops));
  if (r.ordem.questoes && r.ordem.filtros && r.ordem.tops[3] > r.ordem.tops[4]) failures.push(id + ': filtros QC/TEC antes de Questões');
  if (r.antigas) failures.push(id + ': ainda aparecem botões das questões antigas');
  await page.context().close();
}
if (errors.length) failures.push('erros de página: ' + JSON.stringify([...new Set(errors)].slice(0, 3)));
await browser.close(); server.close();
if (failures.length) { console.error('QUESTOES_AREA_FALHOU=' + JSON.stringify(failures, null, 1)); process.exit(1); }
console.log('QUESTOES_AREA_OK');
