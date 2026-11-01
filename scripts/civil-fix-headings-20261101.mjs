// Corrige frases que a importação de Civil marcou como subtítulo (h2/h3).
// Só muda a marcação: o texto é o mesmo (verificação de palavras antes de gravar);
// apenas espaços repetidos dentro do trecho são normalizados.
// Uso: node scripts/civil-fix-headings-20261101.mjs [--write]
import fs from 'node:fs';
import vm from 'node:vm';
import zlib from 'node:zlib';

const FILE = 'content/civil/civil-native-content-packed.js';
const sb = {}; sb.window = sb; vm.runInNewContext(fs.readFileSync(FILE, 'utf8'), sb);
const data = JSON.parse(zlib.gunzipSync(Buffer.from(sb.CIVIL_NATIVE_PACKED_B64, 'base64')).toString());
const plain = s => s.replace(/<[^>]+>/g, ' ').replace(/&gt;/g, '>').replace(/&lt;/g, '<').replace(/&amp;/g, '&').replace(/\s+/g, ' ').trim();
const words = s => plain(s).split(' ').sort().join(' ');

// Junta <p>anterior</p> + <hN>falso título</hN> (+ <p>seguinte</p>, se a frase continua).
function mergeAround(html, headingStart, withNext) {
  const esc = headingStart.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const re = new RegExp('<p>((?:(?!<p>)[\\s\\S])*?)</p>\\s*<(h[23])>(' + esc + '[\\s\\S]*?)</\\2>' + (withNext ? '\\s*<p>([\\s\\S]*?)</p>' : ''));
  const m = html.match(re);
  if (!m) throw new Error('não encontrado: ' + headingStart);
  const joined = '<p>' + [m[1], m[3], withNext ? m[4] : null].filter(x => x != null).map(x => x.trim()).join(' ').replace(/\s+/g, ' ') + '</p>';
  return html.replace(m[0], joined);
}
// <hN>início</hN> + <p>continuação</p> = um parágrafo (listas de artigos em quadro).
function mergeWithNext(html, headingStart) {
  const esc = headingStart.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const m = html.match(new RegExp('<(h[23])>(' + esc + '[\\s\\S]*?)</\\1>\\s*<p>([\\s\\S]*?)</p>'));
  if (!m) throw new Error('não encontrado: ' + headingStart);
  return html.replace(m[0], '<p>' + (m[2].trim() + ' ' + m[3].trim()).replace(/\s+/g, ' ') + '</p>');
}

const fixes = [
  ['civil-m04', 'completeHtml', h => mergeAround(h, '124 há assimetria decisiva', true)],
  ['civil-m08', 'completeHtml', h => mergeAround(h, '5 anos, pela solidez e segurança', true)],
  ['civil-m09', 'completeHtml', h => mergeAround(h, '930 preservam a reparação', true)],
  ['civil-m13', 'completeHtml', h => mergeAround(h, '1.404 e seguintes.', false)],
  ['civil-m15', 'completeHtml', h => mergeAround(h, '1.814. Tradicionalmente', true)],
  ['civil-m11', 'completeHtml', h => mergeWithNext(h, '1.196 conceito •')],
  ['civil-m15', 'completeHtml', h => mergeWithNext(h, '1.784')],
  // Revisão do M08: a pergunta 9 volta para a lista de perguntas (une as duas listas).
  ['civil-m08', 'summaryHtml', h => {
    const m = h.match(/<\/ol>\s*<h3>(9\. O que a seguradora[\s\S]*?)<\/h3>\s*<p>([\s\S]*?)<\/p>\s*<ol>/);
    if (!m) throw new Error('M08 resumo: pergunta 9 não encontrada');
    return h.replace(m[0], '<li>' + m[1].trim() + ' ' + m[2].trim() + '</li>');
  }],
  // M09: os 7 passos de "Como resolver questões" eram títulos; viram lista de passos.
  ['civil-m09', 'completeHtml', h => {
    const m = h.match(/(<h2>9\. COMO RESOLVER QUESTÕES<\/h2>)\s*((?:<h2>\d\. [\s\S]*?<\/h2>\s*)+)(?=<h2>10\.)/);
    if (!m) throw new Error('M09: passos não encontrados');
    const steps = [...m[2].matchAll(/<h2>([\s\S]*?)<\/h2>/g)].map(x => x[1].trim());
    if (steps.length !== 7) throw new Error('M09: esperava 7 passos, achei ' + steps.length);
    return h.replace(m[0], m[1] + '\n' + steps.map(s => '<p>' + s + '</p>').join('\n') + '\n');
  }]
];

for (const [mod, key, fix] of fixes) {
  const before = data[mod][key];
  const after = fix(before);
  if (words(before) !== words(after)) throw new Error(mod + ' ' + key + ': o texto mudou');
  if (after === before) throw new Error(mod + ' ' + key + ': nada alterado');
  data[mod][key] = after;
  console.log('ok', mod, key);
}
// Nenhum título suspeito restante.
for (const [mod, m] of Object.entries(data)) for (const key of ['summaryHtml', 'completeHtml'])
  for (const x of (m[key] || '').matchAll(/<(h[23])>([\s\S]*?)<\/\1>/g)) {
    const t = plain(x[2]);
    if (t.length > 90 || /•|\s{3,}/.test(x[2]) || /^\d\.\d{3}/.test(t) || /^[a-zà-ÿ]/.test(t)) console.log('AINDA SUSPEITO:', mod, key, t.slice(0, 80));
  }
if (process.argv.includes('--write')) {
  fs.writeFileSync(FILE, 'window.CIVIL_NATIVE_PACKED_B64="' + zlib.gzipSync(Buffer.from(JSON.stringify(data)), { level: 9 }).toString('base64') + '";');
  console.log('gravado em', FILE);
}
