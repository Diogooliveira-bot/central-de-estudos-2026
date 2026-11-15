// Gera os textos de lei seca da REVISÃO (liberados ao plano Gratuito), um arquivo por módulo, sem nenhum
// trecho da teoria autoral: só a redação oficial do dispositivo, o rótulo e o link da fonte.
//   node scripts/build-lei-revisao.mjs
// Fontes: content/penal/penal-visual-law.js, content/cpp/cpp-visual-law.js, content/adm/mNN-apostila-complete.js.
import fs from 'node:fs';
import vm from 'node:vm';
import zlib from 'node:zlib';
import { JSDOM } from 'jsdom';

const root = new URL('../', import.meta.url);
const read = p => fs.readFileSync(new URL(p, root), 'utf8');
const write = (p, text) => { const url = new URL(p, root); fs.mkdirSync(new URL('./', url), { recursive: true }); fs.writeFileSync(url, text); };
const parseKey = key => { const i = key.indexOf(':'); return i < 0 ? { law: '', ref: key } : { law: key.slice(0, i), ref: key.slice(i + 1) }; };
const norm = t => String(t || '').replace(/\s+/g, ' ').trim();
const file = (disc, n, items) =>
  '/* Lei seca da Revisão — redação oficial, sem texto autoral. Gerado por scripts/build-lei-revisao.mjs. */\n' +
  '(function(g){g.BC_LEI_REVISAO=g.BC_LEI_REVISAO||{};g.BC_LEI_REVISAO[' + JSON.stringify(disc) + ']=g.BC_LEI_REVISAO[' + JSON.stringify(disc) + ']||{};' +
  'g.BC_LEI_REVISAO[' + JSON.stringify(disc) + '][' + n + ']=' + JSON.stringify(items) + ';})(window);\n';

let total = 0;
for (const [disc, src, name] of [['penal', 'content/penal/penal-visual-law.js', 'PENAL_VISUAL_LAW'], ['cpp', 'content/cpp/cpp-visual-law.js', 'CPP_VISUAL_LAW']]) {
  const w = { window: {} }; w.window.window = w.window; vm.runInNewContext(read(src), w);
  const data = w.window[name];
  for (const [n, entries] of Object.entries(data.modules)) {
    const seen = new Set(), items = [];
    for (const e of entries) {
      const a = data.articles[e.key];
      if (!a || seen.has(e.key) || !Array.isArray(a.paragraphs) || !a.paragraphs.length) continue;
      seen.add(e.key);
      const k = parseKey(e.key);
      items.push({ key: e.key, law: k.law, ref: k.ref, label: String(a.label || e.key), paragraphs: a.paragraphs.map(String), url: /^https:\/\//.test(a.officialUrl || '') ? a.officialUrl : '' });
    }
    write(`content/${disc}/lei-revisao/m${String(n).padStart(2, '0')}.js`, file(disc, Number(n), items));
    total += items.length;
  }
}
for (let n = 1; n <= 20; n++) {
  const pad = String(n).padStart(2, '0');
  const w = { window: {} }; w.window.window = w.window; vm.runInNewContext(read(`content/adm/m${pad}-apostila-complete.js`), w);
  const html = zlib.gunzipSync(Buffer.from(Object.values(w.window.ADM_APOSTILA_PACKED)[0], 'base64')).toString('utf8');
  const doc = new JSDOM(html).window.document;
  const seen = new Set(), items = [];
  doc.querySelectorAll('details.law [data-law-key]').forEach(sec => {
    const key = sec.getAttribute('data-law-key');
    if (seen.has(key)) return; seen.add(key);
    const k = parseKey(key);
    const paragraphs = [...sec.querySelectorAll('p')].map(p => norm(p.textContent)).filter(Boolean);
    if (paragraphs.length) items.push({ key, law: k.law, ref: k.ref, label: norm(sec.querySelector('h4')?.textContent || key), paragraphs, url: '' });
  });
  write(`content/adm/lei-revisao/m${pad}.js`, file('adm', n, items));
  total += items.length;
}
console.log('dispositivos gravados:', total);
