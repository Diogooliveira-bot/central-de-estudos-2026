#!/usr/bin/env node
/* Troca a versão (?v=) de um ou mais arquivos em TODOS os lugares de uma vez (abertura, index, pacote offline e testes).
 * Faça isso sempre que alterar o conteúdo de um arquivo: sem versão nova, parte dos alunos continua vendo o antigo.
 *
 *   npm run nova-versao -- ui/visual-editor-v1.js content/cf/arquivo.js     (troca só esses arquivos)
 *   npm run nova-versao -- --alinhar                                        (iguala arquivos com versões diferentes)
 *   npm run nova-versao -- --ver ui/arquivo.js                              (só mostra as versões atuais)
 * A versão nova tem o formato AAAAMMDD + "r" + número (ex.: 20261118r1). */
import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';

const args = process.argv.slice(2);
const align = args.includes('--alinhar');
const only = args.includes('--ver');
const targets = args.filter((a) => !a.startsWith('--')).map((a) => a.replace(/^\.?\//, '').replace(/\?.*$/, ''));
if (!align && !targets.length) {
  console.log('Uso: npm run nova-versao -- <arquivo> [<arquivo>...]   |   npm run nova-versao -- --alinhar   |   --ver <arquivo>');
  process.exit(2);
}

const tracked = execFileSync('git', ['ls-files'], { encoding: 'utf8' }).split('\n').filter(Boolean);
const holders = tracked.filter((f) => /\.(?:html|json|js|mjs)$/.test(f) && !/^(?:node_modules|content|docs)\//.test(f) && !/\.min\./.test(f));
const texts = new Map(holders.map((f) => [f, readFileSync(f, 'utf8')]));

const today = new Date();
const stamp = String(today.getFullYear()) + String(today.getMonth() + 1).padStart(2, '0') + String(today.getDate()).padStart(2, '0');
const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const versionsOf = (path) => {
  const out = new Map();
  const re = new RegExp('(?<![A-Za-z0-9_\\-./])/?' + esc(path) + '\\?v=([A-Za-z0-9_.\\-]+)', 'g');
  for (const [f, t] of texts) for (const m of t.matchAll(re)) { if (!out.has(m[1])) out.set(m[1], new Set()); out.get(m[1]).add(f); }
  return out;
};
const nextVersion = (path) => {
  const used = new Set([...versionsOf(path).keys()]);
  for (let n = 1; n < 100; n++) { const v = `${stamp}r${n}`; if (!used.has(v)) return v; }
  return `${stamp}r${Date.now() % 1000}`;
};

let list = targets;
if (align) {
  const all = new Set();
  for (const t of texts.values()) for (const m of t.matchAll(/\/?([A-Za-z0-9_\-./]+\.(?:js|css|mjs))\?v=[A-Za-z0-9_.\-]+(?![A-Za-z0-9_.\-]*['"]\s*\+)/g)) all.add(m[1]);
  list = [...all].filter((p) => versionsOf(p).size > 1);
  if (!list.length) { console.log('Nada a alinhar: todos os arquivos têm uma versão só.'); process.exit(0); }
}

let changedFiles = new Set();
for (const path of list) {
  if (!existsSync(path)) { console.log(`ATENÇÃO  ${path}: arquivo não existe (confira o nome).`); continue; }
  const vers = versionsOf(path);
  if (!vers.size) { console.log(`ATENÇÃO  ${path}: não encontrei nenhum "?v=" para ele (nada a trocar).`); continue; }
  if (only) { console.log(`${path}: ` + [...vers.entries()].map(([v, w]) => `${v} (${[...w].join(', ')})`).join(' | ')); continue; }
  const nova = nextVersion(path);
  const re = new RegExp('((?<![A-Za-z0-9_\\-./])/?' + esc(path) + '\\?v=)[A-Za-z0-9_.\\-]+', 'g');
  let trocas = 0;
  for (const [f, t] of texts) {
    const novo = t.replace(re, (_, p1) => { trocas++; return p1 + nova; });
    if (novo !== t) { texts.set(f, novo); changedFiles.add(f); }
  }
  console.log(`OK       ${path}: ${[...vers.keys()].join(' / ')} → ${nova}  (${trocas} lugares)`);
}
if (!only) {
  for (const f of changedFiles) writeFileSync(f, texts.get(f));
  console.log(changedFiles.size ? `\nArquivos atualizados: ${[...changedFiles].join(', ')}\nPróximo passo: npm run verificar -- --base origin/main  e  npm test` : '\nNenhum arquivo precisou mudar.');
}
