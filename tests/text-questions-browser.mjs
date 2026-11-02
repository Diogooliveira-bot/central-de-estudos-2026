// Constitucional e Administrativo: em todos os módulos, toda questão do texto tem botões
// de resposta (múltipla escolha, certo/errado ou Sim/Não) e nenhum gabarito fica à vista
// antes de responder.
// Servidor simulado e conta fictícia; nenhum dado real.
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { resolve, extname } from 'node:path';
import assert from 'node:assert/strict';
import { chromium } from 'playwright';
import { openModule, moduleCount } from './helpers/focus-navigation.mjs';
const root = resolve('.');
const mime = { '.html': 'text/html', '.js': 'application/javascript', '.css': 'text/css', '.json': 'application/json', '.webp': 'image/webp', '.png': 'image/png', '.svg': 'image/svg+xml' };
const ent = Object.fromEntries(['theory.summary', 'theory.complete', 'vade_mecum', 'lei_em_dia', 'tec.links', 'qc.links', 'premium.reviews', 'progress.advanced_sync'].map(k => [k, { enabled: true }]));
const server = createServer(async (req, res) => {
  const path = new URL(req.url, 'http://l').pathname;
  const json = b => { res.writeHead(200, { 'content-type': 'application/json' }); res.end(JSON.stringify(b)); };
  if (path === '/api/auth') return json({ authenticated: true, user: { id: 'p', name: 'Aluno Fictício', role: 'aluno', plan: 'premium' } });
  if (path === '/api/plans') return json({ role: 'aluno', plan: 'premium', status: 'active', isStaff: false, entitlements: ent });
  if (path === '/api/sync') return json({ exists: false }); if (path === '/api/objective') return json({ objectiveId: 'career-tribunais-analista' });
  if (path.startsWith('/api/')) return json({});
  try { const f = resolve(root, '.' + (path === '/' ? '/central-v119.html' : decodeURIComponent(path))); const d = await readFile(f); res.writeHead(200, { 'content-type': mime[extname(f)] || 'application/octet-stream' }); res.end(d); }
  catch { res.writeHead(404); res.end(); }
});
await new Promise(r => server.listen(0, '127.0.0.1', r)); const base = 'http://127.0.0.1:' + server.address().port;
const browser = await chromium.launch(); const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
const errs = []; page.on('pageerror', e => errs.push(e.message.slice(0, 160)));
async function openSubject(id) {
  await page.goto(base + '/central-v119.html?view=home'); await page.waitForFunction(() => document.documentElement.dataset.centralReady === 'true', { timeout: 40000 });
  await page.evaluate(() => window.openDisciplines()); await page.locator('#disciplineGrid [data-study-open-subject="' + id + '"]').first().click();
  await page.waitForFunction(id => window.CentralDisciplineLoader.isReady(id), id, { timeout: 40000 }); await page.waitForTimeout(800);
}
const EXPECT = { cf: { modules: 15, choice: 75, tf: 40 }, adm: { modules: 20, choice: 180, tf: 0 } };
for (const id of (process.env.SUBJ || 'cf,adm').split(',')) {
  await openSubject(id);
  const n = await moduleCount(page, id, '.cf-module-head');
  assert.ok(n >= EXPECT[id].modules, id + ': módulos ' + n);
  const totals = { choice: 0, tf: 0, reveal: 0 };
  for (let i = 0; i < n; i++) {
    if (i) await openSubject(id);
    await openModule(page, id, i, '.cf-module-head');
    const sec = page.locator('.subject[data-id="' + id + '"]');
    await sec.locator('button:visible').filter({ hasText: /^Estudar conteúdo$/ }).first().click(); await page.waitForTimeout(2500);
    const r = await page.evaluate(() => {
      const a = [...document.querySelectorAll('.bc-native-reader-overlay .bc-native-article')].pop();
      const vis = el => el.getClientRects().length > 0 && !el.closest('[hidden]');
      const leaves = [...a.querySelectorAll('p,li')].filter(e => !e.closest('.bc-iq, [data-bc-iq]') && vis(e));
      const answerAhead = e => { let top = e.closest('ul,ol') || e; for (let k = 0, x = top.nextElementSibling; x && k < 6; k++, x = x.nextElementSibling) { if (/^(Gabarito\s*[:.]|Resposta comentada)/.test(x.textContent.trim())) return true; if (/^H[1-6]$/.test(x.tagName)) return false; } return false; };
      return {
        choice: a.querySelectorAll('.bc-iq-choice').length, tf: a.querySelectorAll('.bc-iq-tf').length, reveal: a.querySelectorAll('.bc-iq-reveal').length,
        altsSoltas: leaves.filter(e => /^[A-E]\)\s/.test(e.textContent.trim()) && answerAhead(e)).map(e => e.textContent.trim().slice(0, 60)),
        gabaritosVisiveis: leaves.filter(e => /^(Gabarito\s*[:.]|Gabarito de controle|Resposta comentada)/i.test(e.textContent.trim())).map(e => e.textContent.trim().slice(0, 60))
      };
    });
    assert.deepEqual(r.altsSoltas, [], id + ' M' + (i + 1) + ': alternativas sem botão');
    assert.deepEqual(r.gabaritosVisiveis, [], id + ' M' + (i + 1) + ': gabarito à vista antes de responder');
    totals.choice += r.choice; totals.tf += r.tf; totals.reveal += r.reveal;
    if (r.choice && (i === 2 || i === 13)) { // responder uma questão e ver o comentário
      const q = page.locator('.bc-native-reader-overlay .bc-iq-choice').first();
      await q.scrollIntoViewIfNeeded(); await q.locator('.bc-iq-option').first().click();
      assert.ok(await q.evaluate(b => b.classList.contains('answered') && !!b.querySelector('.correct')), id + ' M' + (i + 1) + ': resposta não corrigida');
      const shown = await q.evaluate(b => { const p = b.closest('.bc-iq-item, [data-bc-iq]') || b.parentElement; return [...p.querySelectorAll('*'), ...[...b.parentElement.children]].some(e => !e.closest('[hidden]') && e.getClientRects().length && /Gabarito|Resposta comentada/.test(e.textContent) && !e.contains(b)); });
      assert.ok(shown, id + ' M' + (i + 1) + ': gabarito não apareceu após responder');
    }
  }
  assert.ok(totals.choice >= EXPECT[id].choice, id + ': múltipla escolha ' + totals.choice);
  assert.ok(totals.tf >= EXPECT[id].tf, id + ': Sim/Não ou certo/errado ' + totals.tf);
  console.log('TEXT_QUESTIONS_OK=' + id + ' ' + JSON.stringify(totals));
}
assert.deepEqual([...new Set(errs)], [], 'erros de JavaScript');
await browser.close(); server.close();
