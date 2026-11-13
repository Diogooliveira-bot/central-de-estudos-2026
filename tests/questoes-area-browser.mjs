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
  // seleciona e só então responde: a 1ª errando de propósito, a 2ª acertando
  const q = await page.evaluate(async () => (await window.BCQuestoes.get('adm', 3)).slice(0, 2).map(x => x.answer));
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
      lei: visiveis('.bcmc-law').length, questoes: visiveis('.bcmc-questions').length,
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
