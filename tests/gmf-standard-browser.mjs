// Teste de navegador: as disciplinas do GMF seguem o MESMO padrão visual das demais (grade "Escolha um módulo",
// página do módulo com cartões, barra da trilha), sem a janela flutuante antiga. Conta e API fictícias; nenhum dado real.
// Para ver: QA_SHOTS=/pasta node tests/gmf-standard-browser.mjs
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { resolve, extname, join } from 'node:path';
import { chromium } from 'playwright';

const root = resolve(new URL('..', import.meta.url).pathname);
const mime = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.webp': 'image/webp', '.png': 'image/png' };
const server = createServer(async (req, res) => {
  const u = new URL(req.url, 'http://x'); const p = u.pathname;
  const json = (b) => { res.writeHead(200, { 'content-type': 'application/json' }); res.end(JSON.stringify(b)); };
  if (p === '/api/auth') return json({ authenticated: true, user: { id: 'f', name: 'Aluno Fictício', role: 'aluno', plan: 'premium' } });
  if (p === '/api/sync') return json({ exists: false });
  if (p === '/api/plans') return json({ role: 'aluno', plan: 'premium', status: 'active', isStaff: false, entitlements: {} });
  if (p === '/api/objective') return json({ objectiveId: 'free-study', freeSubjectIds: null, selectedContestIds: [] });
  if (p === '/api/private-content') {
    const asset = u.searchParams.get('asset') || '';
    try { const d = await readFile(resolve(root, '.' + asset)); res.writeHead(200, { 'content-type': 'application/javascript' }); return res.end(d); } catch { res.writeHead(404); return res.end(); }
  }
  if (p.startsWith('/api/')) return json({});
  const file = resolve(root, '.' + (p === '/' ? '/central-v119.html' : decodeURIComponent(p)));
  try { const d = await readFile(file); res.writeHead(200, { 'content-type': mime[extname(file)] || 'application/octet-stream' }); res.end(d); } catch { res.writeHead(404); res.end(); }
});
await new Promise((r) => server.listen(0, '127.0.0.1', r));
const base = `http://127.0.0.1:${server.address().port}`;
const browser = await chromium.launch({ headless: true, args: ['--no-sandbox'] });
const shot = async (page, nome) => { if (process.env.QA_SHOTS) await page.screenshot({ path: join(process.env.QA_SHOTS, nome + '.png') }); };
try {
  for (const [nome, viewport] of [['tablet', { width: 1250, height: 1600 }], ['celular', { width: 390, height: 844 }]]) {
    const ctx = await browser.newContext({ viewport, screen: viewport, hasTouch: true, serviceWorkers: 'block' });
    const page = await ctx.newPage(); const erros = [];
    page.on('pageerror', (e) => erros.push(e.message));
    await page.goto(`${base}/central-v119.html?view=home`);
    await page.waitForFunction(() => document.documentElement.dataset.centralReady === 'true', { timeout: 60000 });
    await page.waitForTimeout(1800);
    await page.evaluate(() => { document.querySelectorAll('#studyObjectiveDialog,.study-objective-backdrop').forEach((e) => e.remove()); window.GmfStudyObjective.choose('gmf-fortaleza'); });
    await page.waitForTimeout(900);

    // cartões do GMF recebem a mesma marca de trilha das outras disciplinas
    const trilha = await page.evaluate(() => ['cf', 'info', 'atual', 'fortaleza', 'legesp', 'dh'].map((id) => {
      const el = document.querySelector(`#subjects .subject[data-id="${id}"]`); return [id, el?.dataset.studyTrail, el && getComputedStyle(el.querySelector(':scope > .subject-head')).boxShadow];
    }));
    for (const [id, marca, sombra] of trilha) { assert.equal(marca, '1', `${nome}: ${id} sem marca de trilha`); assert.match(String(sombra), /inset/, `${nome}: ${id} sem a barra verde`); }

    // abre a disciplina: grade padrão, sem janela flutuante
    await page.locator('#subjects .subject, [data-study-open-subject]').filter({ hasText: 'Conhecimentos sobre Fortaleza' }).first().click();
    await page.waitForSelector('.bc-focus-module-card', { timeout: 10000 });
    assert.equal(await page.locator('.bc-focus-module-card').count(), 9, `${nome}: 9 módulos de Fortaleza na grade padrão`);
    assert.equal(await page.locator('.gmf-course-browser-overlay').count(), 0, `${nome}: sem janela flutuante`);
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false, `${nome}: grade sem rolagem lateral`);
    await shot(page, `gmf-${nome}-1-grade`);

    // página do módulo: mesmos cartões do Direito Constitucional
    await page.locator('.bc-focus-module-card').first().click();
    await page.waitForSelector('.gmf-std-module.open .cf-study-card', { timeout: 10000 });
    const pagina = await page.evaluate(() => {
      const box = document.querySelector('.gmf-std-module.open');
      const card = box.querySelector('.cf-study-card'); const botao = box.querySelector('.cf-study-open');
      return {
        cartoes: box.querySelectorAll('.cf-study-card').length, questoes: box.querySelector('.bcmc-questions .bcmc-primary')?.disabled,
        orient: !!box.querySelector('.bc-orient'), display: getComputedStyle(card).display, bg: getComputedStyle(botao).backgroundImage,
        botaoAltura: botao.getBoundingClientRect().height, overflow: document.documentElement.scrollWidth > innerWidth,
        foco: box.querySelector('.bc-orient-body p')?.textContent || '',
      };
    });
    assert.equal(pagina.cartoes, 2, `${nome}: cartões de revisão e teoria`);
    assert.equal(pagina.questoes, true, `${nome}: questões em preparação (desligadas)`);
    assert.ok(pagina.orient, `${nome}: bloco "Como estudar este módulo"`);
    assert.equal(pagina.display, 'grid', `${nome}: cartão com o estilo padrão`);
    assert.match(pagina.bg, /gradient/, `${nome}: botão azul padrão`);
    assert.ok(pagina.botaoAltura >= 44, `${nome}: botão com altura de toque`);
    assert.equal(pagina.overflow, false, `${nome}: página sem rolagem lateral`);
    assert.doesNotMatch(pagina.foco, /\.;/, `${nome}: texto de foco sem pontuação duplicada`);
    await shot(page, `gmf-${nome}-2-modulo`);

    // os botões abrem o leitor do GMF
    await page.locator('.gmf-std-module.open button[data-gmf-action="review"]').click();
    await page.waitForSelector('.gmf-reader-overlay .gmf-reader-chapter', { timeout: 10000 });
    await shot(page, `gmf-${nome}-3-leitor`);
    assert.deepEqual(erros, [], `${nome}: sem erros de JavaScript`);
    await ctx.close();
  }
  console.log('ok: GMF no padrão das demais disciplinas (tablet e celular)');
} finally { await browser.close(); server.close(); }
