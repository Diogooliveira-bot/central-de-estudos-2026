// "Excluir minha conta" na Central: Configurações › Minha conta › confirmação com senha
// e EXCLUIR; servidor simulado (nenhuma conta real).
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { resolve, extname } from 'node:path';
import assert from 'node:assert/strict';
import { chromium } from 'playwright';
const root = resolve('.');
const mime = { '.html': 'text/html', '.js': 'application/javascript', '.css': 'text/css', '.json': 'application/json', '.webp': 'image/webp', '.png': 'image/png', '.svg': 'image/svg+xml' };
const posts = [];
const server = createServer(async (req, res) => {
  const url = new URL(req.url, 'http://l'); const path = url.pathname;
  const json = (b, s = 200) => { res.writeHead(s, { 'content-type': 'application/json' }); res.end(JSON.stringify(b)); };
  if (path === '/api/auth' && url.searchParams.get('action') === 'delete-account') {
    let raw = ''; for await (const c of req) raw += c; const body = JSON.parse(raw || '{}'); posts.push(body);
    return body.password === 'SenhaCerta#2026' ? json({ ok: true }) : json({ error: 'Senha incorreta.' }, 401);
  }
  if (path === '/api/auth') return json({ authenticated: true, user: { id: 'fict', name: 'Aluno Fictício', role: 'aluno', plan: 'free' } });
  if (path === '/api/plans') return json({ role: 'aluno', plan: 'free', status: 'active', isStaff: false, entitlements: {} });
  if (path === '/api/sync') return json({ exists: false }); if (path === '/api/objective') return json({ objectiveId: 'career-tribunais-analista' });
  if (path.startsWith('/api/')) return json({});
  try { const f = resolve(root, '.' + (path === '/' ? '/central-v119.html' : decodeURIComponent(path))); const d = await readFile(f); res.writeHead(200, { 'content-type': mime[extname(f)] || 'application/octet-stream' }); res.end(d); }
  catch { res.writeHead(404); res.end('NF'); }
});
await new Promise(r => server.listen(0, '127.0.0.1', r)); const base = 'http://127.0.0.1:' + server.address().port;
const browser = await chromium.launch(); const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
const errs = []; page.on('pageerror', e => errs.push(e.message));
try {
  await page.goto(base + '/central-v119.html?view=home'); await page.waitForFunction(() => document.documentElement.dataset.centralReady === 'true', { timeout: 40000 });
  // Como o aluno: menu "Mais" › Configurações.
  await page.evaluate(() => { const b = document.querySelector('[data-student-more-action="settings"]'); if (b) b.click(); else window.openCentralSettings?.(); });
  await page.waitForTimeout(600);
  const btn = page.locator('[data-account-delete]').first();
  await btn.waitFor({ state: 'visible', timeout: 10000 });
  await btn.click();
  const dlg = page.locator('#bc-account-delete');
  await dlg.waitFor({ timeout: 5000 });
  assert.match(await dlg.innerText(), /definitiva/);
  // Sem EXCLUIR: não envia.
  await dlg.locator('input[name=password]').fill('SenhaCerta#2026');
  await dlg.locator('button[type=submit]').click();
  assert.match(await dlg.locator('.bc-acc-del-msg').innerText(), /EXCLUIR/);
  assert.equal(posts.length, 0);
  // Senha errada: mostra o erro do servidor.
  await dlg.locator('input[name=password]').fill('errada');
  await dlg.locator('input[name=confirmation]').fill('excluir');
  await dlg.locator('button[type=submit]').click();
  await page.waitForTimeout(500);
  assert.match(await dlg.locator('.bc-acc-del-msg').innerText(), /Senha incorreta/);
  // Esc fecha só a janela.
  await page.keyboard.press('Escape'); assert.equal(await page.locator('#bc-account-delete').count(), 0);
  // Fluxo completo.
  await btn.click();
  await dlg.locator('input[name=password]').fill('SenhaCerta#2026');
  await dlg.locator('input[name=confirmation]').fill('EXCLUIR');
  await dlg.locator('button[type=submit]').click();
  await page.waitForFunction(() => /Conta excluída/.test(document.getElementById('bc-account-delete')?.innerText || ''), null, { timeout: 5000 });
  assert.deepEqual(posts.at(-1), { password: 'SenhaCerta#2026', confirmation: 'EXCLUIR' });
  await page.waitForURL(/\/login\.html/, { timeout: 6000 });
  assert.deepEqual(errs, []);
  console.log('ACCOUNT_DELETION_BROWSER_OK');
} finally { await browser.close(); server.close(); }
