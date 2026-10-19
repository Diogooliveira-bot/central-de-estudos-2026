import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import zlib from 'node:zlib';

const root = path.resolve(import.meta.dirname, '..');
const outDir = path.join(root, 'audits', 'cf-rlm-portugues-20261018');

function cfUnits() {
  const window = { BASE_NATIVE_CONTENT: { cf: {} } };
  const context = vm.createContext({ window });
  for (let number = 1; number <= 15; number += 1) {
    const id = `m${String(number).padStart(2, '0')}`;
    vm.runInContext(fs.readFileSync(path.join(root, `content/cf/${id}-native-data.js`), 'utf8'), context);
  }
  return Object.entries(window.BASE_NATIVE_CONTENT.cf).flatMap(([id, module]) => [
    { subject: 'cf', unit: `${id}.summary`, text: module.summary },
    { subject: 'cf', unit: `${id}.complete`, text: module.complete }
  ]);
}

function rlmUnits() {
  const window = {};
  const context = vm.createContext({ window, URL });
  for (const name of ['estrutura', 'aulas-logica', 'aulas-raciocinio', 'aulas-matematica', 'aulas-estatistica', 'complementos-teoria']) {
    vm.runInContext(fs.readFileSync(path.join(root, `content/rlm-tjce-2026/${name}.js`), 'utf8'), context);
  }
  const strings = value => {
    if (typeof value === 'string') return [value];
    if (Array.isArray(value)) return value.flatMap(strings);
    if (value && typeof value === 'object') return Object.values(value).flatMap(strings);
    return [];
  };
  return Object.entries(window.RLM_CURSO_AULAS).flatMap(([id, module]) => [
    { subject: 'rlm', unit: `${id}.summary`, text: strings(module.summary).join('\n') },
    { subject: 'rlm', unit: `${id}.theory`, text: strings(module.theory).join('\n') }
  ]);
}

function decodeEntities(text) {
  const named = { nbsp: ' ', amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", ndash: '–', mdash: '—', hellip: '…', laquo: '«', raquo: '»' };
  return text
    .replace(/&#(x[0-9a-f]+|\d+);/gi, (_, token) => String.fromCodePoint(token[0].toLowerCase() === 'x' ? Number.parseInt(token.slice(1), 16) : Number.parseInt(token, 10)))
    .replace(/&([a-z]+);/gi, (all, name) => named[name.toLowerCase()] ?? ' ');
}

function portugueseUnits() {
  const encoded = fs.readFileSync(path.join(root, 'portugues-autodidata-data.txt'), 'utf8').trim();
  const modules = JSON.parse(zlib.gunzipSync(Buffer.from(encoded, 'base64')).toString('utf8'));
  return Object.entries(modules).map(([id, html]) => ({
    subject: 'portugues',
    unit: id,
    text: decodeEntities(html
      .replace(/<(script|style)\b[^>]*>[\s\S]*?<\/\1>/gi, ' ')
      .replace(/<br\s*\/?>/gi, '\n')
      .replace(/<\/(p|div|li|h[1-6]|section|article|tr)>/gi, '\n')
      .replace(/<[^>]+>/g, ''))
      .replace(/[ \t]+/g, ' ')
      .replace(/\n{3,}/g, '\n\n')
      .trim()
  }));
}

function localFindings(unit) {
  const patterns = [
    ['replacement-character', /�/g],
    ['mojibake', /(?:Ã[\u0080-\u00bf]|Â[\u0080-\u00bf]|â€|ðŸ)/g],
    ['repeated-word', /\b([\p{L}]{3,})\s+\1\b/giu],
    ['space-before-punctuation', /[ \t]+[,.!?;:](?!\d)/g],
    ['common-typo', /\b(?:excessão|excessões|previlégio|previlégios|beneficiente|beneficientes|concerteza|enchergar|reinvindicar|reinvindicação|paralização|analizar|analisei|atravez|derrepente|menas|seje|esteje|provalvelmente|provalvemente|exclarecer|comprensão|entitade|execessivo|indentificar|impecilho|subjulgar|discurssiva|asserção|exceçãoo)\b/giu]
  ];
  return patterns.flatMap(([rule, regex]) => [...unit.text.matchAll(regex)].map(match => ({
    subject: unit.subject,
    unit: unit.unit,
    rule,
    offset: match.index,
    excerpt: unit.text.slice(Math.max(0, match.index - 90), Math.min(unit.text.length, match.index + match[0].length + 90)).replace(/\s+/g, ' ')
  })));
}

const units = [...cfUnits(), ...rlmUnits(), ...portugueseUnits()];
const local = units.flatMap(localFindings);
const report = {
  generatedAt: new Date().toISOString(),
  scope: {
    cf: '15 módulos; campos summary e complete; questões excluídas',
    rlm: 'M02–M15; campos summary e theory; questões e banco FCC legado excluídos',
    portugues: 'M01–M24 e revisão final; texto visível extraído do HTML'
  },
  counts: {
    units: units.length,
    characters: units.reduce((sum, unit) => sum + unit.text.length, 0),
    localFindings: local.length
  },
  local
};

fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(path.join(outDir, 'triagem-ortografica.json'), `${JSON.stringify(report, null, 2)}\n`);
console.log(JSON.stringify(report.counts));
