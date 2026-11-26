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

    // o botão abre o MESMO leitor das demais disciplinas (fábrica compartilhada + padrão único do leitor)
    await page.locator('.gmf-std-module.open button[data-gmf-action="review"]').click();
    await page.waitForSelector('#gmf-native-reader .bc-native-article h2', { timeout: 15000 });
    await page.waitForFunction(() => document.getElementById('gmf-native-reader')?.classList.contains('bc-std-reader'), { timeout: 5000 });
    const leitor = await page.evaluate(() => {
      const o = document.getElementById('gmf-native-reader'); const tools = o.querySelector('.bc-native-reader-tools');
      return {
        classes: o.className, fixo: getComputedStyle(o).position, titulo: o.querySelector('.bc-native-reader-title b').textContent,
        sub: o.querySelector('.bc-native-reader-title small').textContent,
        busca: !!tools.querySelector('input[type="search"]'), justificar: !!tools.querySelector('.bc-std-justify'),
        capitulos: !!tools.querySelector('.bc-reading-chapters-toggle'), concluir: !!tools.querySelector('[data-finish-reading], .bc-std-finish'),
        h1: o.querySelector('.bc-native-article h1')?.textContent, capas: o.querySelectorAll('.bc-native-article h2').length,
        antigo: !!document.querySelector('.gmf-reader-overlay'), overflow: document.documentElement.scrollWidth > innerWidth,
      };
    });
    assert.equal(leitor.fixo, 'fixed', `${nome}: leitor em tela cheia`);
    assert.match(leitor.classes, /bc-native-reader-overlay/, `${nome}: estrutura padrão do leitor`);
    assert.match(leitor.classes, /bc-rev-cf/, `${nome}: visual padrão da revisão`);
    assert.equal(leitor.titulo, 'Localização e limites', `${nome}: título do módulo no topo`);
    assert.match(leitor.sub, /CONHECIMENTOS SOBRE FORTALEZA · MÓDULO 01 · VERSÃO DE REVISÃO/, `${nome}: linha de apoio no padrão`);
    assert.equal(leitor.h1, 'Localização e limites', `${nome}: título do módulo na abertura`);
    for (const k of ['busca', 'justificar', 'capitulos', 'concluir']) assert.equal(leitor[k], true, `${nome}: ferramenta ${k} da barra padrão`);
    assert.ok(leitor.capas >= 3, `${nome}: capítulos com título padrão`);
    assert.equal(leitor.antigo, false, `${nome}: sem o leitor antigo`);
    assert.equal(leitor.overflow, false, `${nome}: leitor sem rolagem lateral`);
    await shot(page, `gmf-${nome}-3-leitor`);

    // progresso: marcar uma seção atualiza "% lido" e a contagem; o progresso salvo usa a mesma chave de antes
    await page.locator('#gmf-native-reader [data-mark="0"]').click();
    const lido = await page.evaluate(() => ({ pct: document.querySelector('#gmf-native-reader .bc-native-reader-meta').textContent, feitas: document.querySelector('#gmf-native-reader [data-done]').textContent, pressed: document.querySelector('#gmf-native-reader [data-mark="0"]').getAttribute('aria-pressed'), chave: Array.from({ length: window.localStorage.length }, (_, i) => window.localStorage.key(i)).filter((k) => /^central-v6:gmf:.*:fortaleza:m01:review:read:0$/.test(k) && window.localStorage.getItem(k) === '1').length }));
    assert.match(lido.pct, /^33% lido/, `${nome}: % lido após marcar 1 de 3`);
    assert.equal(lido.feitas, '1'); assert.equal(lido.pressed, 'true'); assert.equal(lido.chave, 1, `${nome}: progresso salvo na mesma chave de antes`);
    // no celular as ferramentas ficam atrás do botão "Aa" (igual aos outros leitores)
    if (!(await page.locator('#gmf-native-reader [data-finish-reading]').isVisible())) await page.locator('#gmf-native-reader .student-reader-options-toggle').click();
    await page.locator('#gmf-native-reader [data-finish-reading]').click();
    assert.match(await page.locator('#gmf-native-reader .bc-native-reader-meta').textContent(), /^100% lido/, `${nome}: "Concluir leitura" marca tudo`);

    // trocar para a teoria completa e para o próximo módulo, dentro do mesmo leitor
    await page.locator('#gmf-native-reader [data-mode="complete"]').click();
    await page.waitForFunction(() => /TEORIA COMPLETA/.test(document.querySelector('#gmf-native-reader .bc-native-reader-title small')?.textContent || ''), { timeout: 10000 });
    await page.locator('#gmf-native-reader .gmf-native-modules button:not([disabled])').last().click();
    await page.waitForFunction(() => /MÓDULO 02/.test(document.querySelector('#gmf-native-reader .bc-native-reader-title small')?.textContent || ''), { timeout: 10000 });
    await page.keyboard.press('Escape');
    assert.equal(await page.locator('#gmf-native-reader').count(), 0, `${nome}: Esc fecha o leitor`);
    assert.deepEqual(erros, [], `${nome}: sem erros de JavaScript`);
    await ctx.close();
  }
  console.log('ok: GMF no padrão das demais disciplinas (tablet e celular)');
} finally { await browser.close(); server.close(); }
