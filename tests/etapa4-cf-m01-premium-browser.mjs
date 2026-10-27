/* Etapa 4 — primeiro piloto de expansão: Constitucional M01.
 * Testa o leitor REAL com a fonte aprovada em Chromium, em ambiente local isolado.
 * Não testa autenticação Vercel, banco de dados nem produção.
 */
import assert from 'node:assert/strict';
import { readFile, mkdir, writeFile } from 'node:fs/promises';
import { createServer } from 'node:http';
import { chromium } from 'playwright';

const read = path => readFile(new URL('../' + path, import.meta.url), 'utf8');
const [premiumCss, readingCss, readerData, cfReader, themeActivator, readingJs] = await Promise.all([
  read('ui/legal-complete-premium-v1.css'),
  read('ui/reading-appearance-v1.css'),
  read('content/cf/m01-native-data.js'),
  read('ui/cf-native-study-v2.js'),
  read('ui/legal-complete-premium-v1.js'),
  read('ui/reading-appearance-v1.js')
]);
await mkdir('artifacts/etapa4-cf-m01-premium', { recursive: true });
const server = createServer((_req, res) => {
  res.writeHead(200, {'content-type': 'text/html; charset=utf-8'});
  res.end('<!doctype html><html lang="pt-BR" class="bc-ui-v1"><head><meta name="viewport" content="width=device-width,initial-scale=1"></head><body><main id="subjects"></main></body></html>');
});
await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
const url = 'http://127.0.0.1:' + server.address().port;
let browser;
const results = [];
try {
  browser = await chromium.launch({ headless: true, args: ['--no-sandbox'] });
  for (const width of [390, 768, 1366]) {
    const height = width === 390 ? 844 : width === 768 ? 1024 : 768;
    const page = await browser.newPage({ viewport: { width, height }, deviceScaleFactor: 1 });
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    try {
      await page.goto(url);
      await page.evaluate(() => {
        window.CF_WEEKS = [{ num: 1, id: 'w1', read: '' }];
        window.renderSubjects = () => {};
        window.renderAll = () => {};
      });
      await page.addStyleTag({ content: premiumCss });
      await page.addStyleTag({ content: readingCss });
      for (const source of [readingJs, themeActivator, readerData, cfReader]) {
        await page.addScriptTag({ content: source });
      }
      await page.evaluate(() => window.CfNativeStudy.openReader(1, 'complete'));
      await page.waitForFunction(() => document.getElementById('cfNativeOverlay')?.classList.contains('bc-apostila-v1'));
      await page.waitForTimeout(120);

      const metrics = await page.evaluate(() => {
        const overlay = document.getElementById('cfNativeOverlay');
        const article = overlay.querySelector('.cf-native-reader article');
        const h2 = article.querySelector('h2');
        const tables = [...article.querySelectorAll('table')];
        const checkboxes = [...article.querySelectorAll('input[data-cf-check]')];
        return {
          premium: overlay.classList.contains('bc-apostila-v1'),
          readingAppearance: overlay.classList.contains('bc-reading-appearance'),
          label: overlay.querySelector('.cf-native-shell header small')?.textContent,
          headings: article.querySelectorAll('h2').length,
          sectionBorder: h2 ? getComputedStyle(h2).borderLeftWidth : null,
          tables: tables.length,
          semanticTables: tables.every(t => !!t.tHead && !!t.tBodies.length),
          tableWrappers: article.querySelectorAll('.cf-native-table-wrap').length,
          callouts: article.querySelectorAll('.cf-native-callout').length,
          checkboxes: checkboxes.length,
          viewportOverflow: document.documentElement.scrollWidth > window.innerWidth + 2
        };
      });
      assert.equal(metrics.premium, true, 'Tema Premium não ativou');
      assert.equal(metrics.readingAppearance, true, 'Controles de leitura ausentes');
      assert.ok(metrics.headings >= 3, 'Hierarquia de títulos insuficiente');
      assert.equal(metrics.sectionBorder, '5px', 'Aparência do H2 não corresponde ao padrão');
      assert.equal(metrics.viewportOverflow, false, 'Rolagem horizontal da página');
      assert.equal(metrics.semanticTables, true, 'Tabelas perderam semântica');
      assert.ok(metrics.callouts > 0, 'Caixas pedagógicas não renderizaram');
      const base = 'artifacts/etapa4-cf-m01-premium/cf-m01-' + width;
      await page.locator('#cfNativeOverlay .cf-native-shell').screenshot({ path: base + '-completa.png' });
      if (metrics.tables) await page.locator('#cfNativeOverlay .cf-native-table-wrap').first().screenshot({ path: base + '-tabela.png' });
      if (metrics.checkboxes) {
        await page.locator('#cfNativeOverlay input[data-cf-check]').first().check();
        await page.evaluate(() => window.CfNativeStudy.close());
        await page.evaluate(() => window.CfNativeStudy.openReader(1, 'complete'));
        assert.equal(await page.locator('#cfNativeOverlay input[data-cf-check]').first().isChecked(), true, 'Checkbox não persistiu');
      }
      await page.evaluate(() => window.CfNativeStudy.openReader(1, 'summary'));
      await page.waitForTimeout(90);
      assert.equal(await page.locator('#cfNativeOverlay').evaluate(o => o.classList.contains('bc-apostila-v1')), false, 'Resumo recebeu tema exclusivo');
      assert.deepEqual(errors, [], 'Erros JavaScript no Chromium ' + width);
      results.push({ width, ...metrics, checkboxPersisted: metrics.checkboxes ? true : null, summaryExcluded: true, errors });
    } finally {
      await page.close();
    }
  }
  await writeFile('artifacts/etapa4-cf-m01-premium/metricas.json', JSON.stringify(results, null, 2) + '\n');
  console.log('ETAPA4_CF_M01_CHROMIUM=' + JSON.stringify(results));
} finally {
  if (browser) await browser.close();
  server.close();
}
