import test from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { protectedAsset } from '../lib/protected-content.js';

// Cache longo (7 dias, imutável) só para arquivos COM ?v= em pastas públicas. Conteúdo Premium/protegido nunca pode
// cair nessas regras (senão ficaria guardado no aparelho). A versão (?v=) é trocada por npm run nova-versao.
const vercel = JSON.parse(readFileSync('vercel.json', 'utf8'));
const longRules = vercel.headers.filter((h) => h.headers.some((x) => x.key === 'Cache-Control' && /max-age=604800, immutable/.test(x.value)));
const files = execFileSync('git', ['ls-files'], { encoding: 'utf8' }).split('\n').filter(Boolean);
const REFS = ['central-v119.html', 'index.html', 'central-offline-files-v66172.json'].map((f) => readFileSync(f, 'utf8'));
const toRegex = (source) => new RegExp('^' + source.split('(.*)').map((p) => p.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('.*') + '$');

test('regras de cache longo exigem ?v= e cobrem os arquivos esperados', () => {
  const sources = longRules.map((r) => r.source);
  for (const s of ['/ui/(.*).css', '/ui/(.*).js', '/assets/(.*)', '/central-structural-v66119/runtime.js', '/fixes/(.*).js']) assert.ok(sources.includes(s), s);
  for (const r of longRules) assert.deepEqual(r.has, [{ type: 'query', key: 'v', value: '.+' }], r.source + ' exige ?v=');
});

test('nenhum arquivo protegido/Premium cai numa regra de cache longo', () => {
  let cobertos = 0;
  for (const rule of longRules) {
    const re = toRegex(rule.source);
    for (const f of files) {
      const path = '/' + f;
      if (!re.test(path)) continue;
      cobertos++;
      // Alguns arquivos de /ui estão na lista "nunca públicos" (saem do build estático). Se a regra os alcança, a Central
      // não pode pedi-los com ?v= (o cache longo só vale com ?v=); então basta provar que ninguém os referencia assim.
      if (protectedAsset(path)) {
        const referenciado = [...REFS].some((t) => t.includes(f + '?v='));
        assert.equal(referenciado, false, `${path} é protegido, está em ${rule.source} e é pedido com ?v=`);
      }
    }
  }
  assert.ok(cobertos > 100, 'regras cobrem muitos arquivos públicos: ' + cobertos);
});

test('service worker deixa o navegador reaproveitar arquivos com ?v= (não força "no-cache")', () => {
  const sw = readFileSync('sw.js', 'utf8');
  assert.match(sw, /if\(mode==='no-cache'&&versionedAsset\(url\)\)mode='default'/);
});
