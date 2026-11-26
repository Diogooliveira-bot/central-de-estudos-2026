#!/usr/bin/env node
/* Sistema de disciplinas extras (hoje: as do GMF). Tudo nasce de UM catálogo: content/gmf/course-catalog-v1.js.
 * Cores, ordem, proteção do conteúdo, bloqueio das questões e visibilidade por concurso são derivados dele.
 *
 *   npm run nova-disciplina -- criar <id> "<Nome>" --referencia "<texto do edital>" --modulos "Título 1|Título 2|..."
 *   npm run nova-disciplina -- publicar <id> <m01>      (confere o conteúdo e libera o módulo para os alunos)
 *   npm run nova-disciplina -- listar                   (o que está publicado e o que está em preparação)
 *   npm run nova-disciplina -- conferir                 (procura erros; roda também no verificador e nos testes)
 *
 * Guia em português simples: docs/NOVA_DISCIPLINA.md */
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { execFileSync } from 'node:child_process';
import { pathToFileURL } from 'node:url';
import vm from 'node:vm';

export const CATALOG_PATH = 'content/gmf/course-catalog-v1.js';
export const BASE_IDS = ['pt', 'rlm', 'info', 'cf', 'adm', 'civil', 'cpc', 'penal', 'cpp'];
// O M01 das quatro primeiras disciplinas vive num pacote único antigo (content/gmf/m01-*-v1.js); as novas usam um arquivo por módulo.
export const LEGACY_M01 = ['atual', 'fortaleza', 'legesp', 'dh'];
export const PLACEHOLDER = 'PREENCHER';
const MIN = { full: { chapters: 4, words: 100 }, review: { chapters: 3, words: 45 } };

export function readCatalog(root = process.cwd()) {
  const text = readFileSync(join(root, CATALOG_PATH), 'utf8');
  const start = text.indexOf('Object.freeze(');
  const end = text.lastIndexOf(');\n})(window);');
  if (start < 0 || end < 0) throw new Error('Formato inesperado em ' + CATALOG_PATH);
  const objectStart = start + 'Object.freeze('.length;
  return { head: text.slice(0, objectStart), tail: text.slice(end), data: JSON.parse(text.slice(objectStart, end)) };
}

export function writeCatalog(catalog, root = process.cwd()) {
  let json = JSON.stringify(catalog.data, null, 2);
  // mantém "availableModules" numa linha só (como sempre foi), para o histórico do Git ficar limpo
  json = json.replace(/"availableModules": \{[\s\S]*?\n  \},/, '"availableModules": ' + JSON.stringify(catalog.data.availableModules) + ',');
  writeFileSync(join(root, CATALOG_PATH), catalog.head + json + catalog.tail);
}

function moduleFile(root, id, moduleId, mode) {
  return join(root, 'content', 'gmf', id, `${moduleId}-${mode}-v1.js`);
}

/** Lê um arquivo de conteúdo (window.GMF_MODULE_FULL / GMF_MODULE_REVIEW) sem executar nada fora de uma caixa isolada. */
export function readModuleRecord(root, id, moduleId, mode) {
  const file = moduleFile(root, id, moduleId, mode);
  if (!existsSync(file)) return { missing: true, file };
  const context = { window: {} };
  vm.runInNewContext(readFileSync(file, 'utf8'), context, { timeout: 1000 });
  return { file, record: context.window[mode === 'full' ? 'GMF_MODULE_FULL' : 'GMF_MODULE_REVIEW'] };
}

/** As mesmas regras de qualidade dos testes de conteúdo. Devolve a lista de problemas (vazia = pode publicar). */
export function qualityProblems(record, { id, moduleId, mode }) {
  const problems = [];
  if (!record) return ['o arquivo não define o conteúdo esperado'];
  if (record.subject !== id) problems.push(`"subject" deveria ser "${id}"`);
  if (record.module !== moduleId) problems.push(`"module" deveria ser "${moduleId}"`);
  const rule = MIN[mode];
  const chapters = Array.isArray(record.chapters) ? record.chapters : [];
  if (chapters.length < rule.chapters) problems.push(`precisa de pelo menos ${rule.chapters} capítulos (tem ${chapters.length})`);
  chapters.forEach((chapter, index) => {
    const label = `capítulo ${index + 1}`;
    const html = String(chapter?.html || '');
    const title = String(chapter?.title || '').trim();
    const words = html.replace(/<[^>]*>/g, ' ').trim().split(/\s+/).filter(Boolean).length;
    if (!title) problems.push(`${label}: sem título`);
    if (html.includes(PLACEHOLDER) || title.includes(PLACEHOLDER)) problems.push(`${label}: ainda tem o marcador ${PLACEHOLDER}`);
    if (html.length < 160 || words < rule.words) problems.push(`${label}: texto curto (${words} palavras; mínimo ${rule.words})`);
    if (!/<p>/.test(html)) problems.push(`${label}: sem parágrafos <p>`);
    if (/<script|onerror=|javascript:/i.test(html)) problems.push(`${label}: contém código não permitido`);
  });
  const resources = Array.isArray(record.resources) ? record.resources : [];
  if (!resources.length) problems.push('sem fontes oficiais (resources)');
  if (!resources.every((r) => /^https:\/\//.test(String(r?.url || '')))) problems.push('toda fonte precisa começar com https://');
  return problems;
}

export function listSubjects(root = process.cwd()) {
  const { data } = readCatalog(root);
  return data.subjects.map((subject) => ({
    id: subject.id, name: subject.name,
    modules: subject.modules.map((m) => ({ id: m.id, title: m.title, published: (data.availableModules[subject.id] || []).includes(m.id) })),
  }));
}

/** Procura esquecimentos e erros. Devolve uma lista de textos (vazia = tudo certo). */
export async function conferir(root = process.cwd()) {
  const problems = [];
  const { data } = readCatalog(root);
  const { protectedAsset } = await import(pathToFileURL(join(root, 'lib/protected-content.js')).href);
  const { gmfDisciplineIds } = await import(pathToFileURL(join(root, 'lib/questoes-handler.js')).href);
  const seen = new Set();
  for (const subject of data.subjects) {
    const where = `disciplina "${subject.id}"`;
    if (!/^[a-z]{2,12}$/.test(String(subject.id))) problems.push(`${where}: o código precisa ter só letras minúsculas (2 a 12)`);
    if (seen.has(subject.id)) problems.push(`${where}: código repetido`);
    seen.add(subject.id);
    if (BASE_IDS.includes(subject.id)) problems.push(`${where}: o código já é de uma disciplina original`);
    if (!String(subject.name || '').trim()) problems.push(`${where}: sem nome`);
    if (subject.accent && !/^#[0-9a-f]{6}$/i.test(subject.accent)) problems.push(`${where}: "accent" precisa ser uma cor como #356a9e`);
    if (!Array.isArray(subject.modules) || !subject.modules.length) { problems.push(`${where}: sem módulos`); continue; }
    subject.modules.forEach((module, index) => {
      const expected = 'm' + String(index + 1).padStart(2, '0');
      if (module.id !== expected) problems.push(`${where}: o ${index + 1}º módulo deveria ter o código "${expected}" (tem "${module.id}")`);
      if (!String(module.title || '').trim()) problems.push(`${where}/${module.id}: sem título`);
      if (!Array.isArray(module.focus) || module.focus.length < 2) problems.push(`${where}/${module.id}: "focus" precisa de pelo menos 2 itens`);
    });
    if (!protectedAsset(`/content/gmf/${subject.id}/m02-full-v1.js`) || !protectedAsset(`/content/gmf/${subject.id}/m02-review-v1.js`)) {
      problems.push(`${where}: o conteúdo dos módulos não está protegido no servidor (lib/protected-content.js)`);
    }
    if (!gmfDisciplineIds(root).has(subject.id)) problems.push(`${where}: o servidor de questões não a reconhece como GMF (crie a pasta content/gmf/${subject.id}/)`);
    for (const moduleId of data.availableModules[subject.id] || []) {
      if (!subject.modules.some((m) => m.id === moduleId)) { problems.push(`${where}: "${moduleId}" está publicado mas não existe`); continue; }
      if (moduleId === 'm01' && LEGACY_M01.includes(subject.id)) continue;
      for (const mode of ['full', 'review']) {
        const { record, missing } = readModuleRecord(root, subject.id, moduleId, mode);
        if (missing) { problems.push(`${where}/${moduleId}: publicado, mas falta o arquivo de ${mode === 'full' ? 'teoria completa' : 'revisão guiada'}`); continue; }
        for (const p of qualityProblems(record, { id: subject.id, moduleId, mode })) problems.push(`${where}/${moduleId} (${mode === 'full' ? 'completa' : 'revisão'}): ${p}`);
      }
    }
  }
  for (const id of Object.keys(data.availableModules)) if (!seen.has(id)) problems.push(`"availableModules" tem a disciplina "${id}" que não existe`);
  return problems;
}

function bumpCatalogVersion(root) {
  try { execFileSync('node', ['scripts/nova-versao.mjs', CATALOG_PATH], { cwd: root, stdio: 'pipe' }); } catch (_) { /* a conferência do verificador avisa */ }
}

function template(mode, id, moduleId, title) {
  const isFull = mode === 'full';
  const chapters = Array.from({ length: isFull ? 4 : 3 }, (_, i) => ({
    title: `${PLACEHOLDER}: título do capítulo ${i + 1}`,
    html: `<p>${PLACEHOLDER}: escreva aqui o texto do capítulo ${i + 1} de "${title}". Mínimo de ${isFull ? 100 : 45} palavras, conferido em fonte oficial.</p>`,
  }));
  const record = { subject: id, module: moduleId, title: `${isFull ? 'Conteúdo completo' : 'Revisão guiada'} — ${title}`, resources: [{ title: `${PLACEHOLDER}: fonte oficial`, url: 'https://exemplo.gov.br/' }], chapters };
  return `/* ${isFull ? 'Conteúdo completo' : 'Revisão guiada'} ${id} ${moduleId} — MODELO: troque tudo que tem ${PLACEHOLDER} e publique com: npm run nova-disciplina -- publicar ${id} ${moduleId} */\nwindow.${isFull ? 'GMF_MODULE_FULL' : 'GMF_MODULE_REVIEW'}=${JSON.stringify(record)};\n`;
}

export function criar({ id, name, reference, modules }, root = process.cwd()) {
  if (!/^[a-z]{2,12}$/.test(id || '')) throw new Error('O código da disciplina precisa ter só letras minúsculas, de 2 a 12 (ex.: transito).');
  if (BASE_IDS.includes(id)) throw new Error(`"${id}" já é uma disciplina original da Central.`);
  const catalog = readCatalog(root);
  if (catalog.data.subjects.some((s) => s.id === id)) throw new Error(`A disciplina "${id}" já existe.`);
  if (!name) throw new Error('Informe o nome da disciplina entre aspas.');
  if (!modules.length) throw new Error('Informe os módulos com --modulos "Título 1|Título 2|...".');
  catalog.data.subjects.push({
    id, name, reference: reference || `${name} — referência do edital a preencher`,
    modules: modules.map((title, index) => ({
      id: 'm' + String(index + 1).padStart(2, '0'), title,
      focus: [`${PLACEHOLDER}: primeiro assunto cobrado em "${title}".`, `${PLACEHOLDER}: segundo assunto cobrado em "${title}".`],
      attention: '',
    })),
  });
  catalog.data.availableModules[id] = [];
  writeCatalog(catalog, root);
  const dir = join(root, 'content', 'gmf', id);
  mkdirSync(dir, { recursive: true });
  modules.forEach((title, index) => {
    const moduleId = 'm' + String(index + 1).padStart(2, '0');
    for (const mode of ['full', 'review']) writeFileSync(moduleFile(root, id, moduleId, mode), template(mode, id, moduleId, title));
  });
  bumpCatalogVersion(root);
  return dir;
}

export function publicar(id, moduleId, root = process.cwd()) {
  const catalog = readCatalog(root);
  const subject = catalog.data.subjects.find((s) => s.id === id);
  if (!subject) throw new Error(`A disciplina "${id}" não existe.`);
  if (!subject.modules.some((m) => m.id === moduleId)) throw new Error(`O módulo "${moduleId}" não existe em "${id}".`);
  const found = [];
  for (const mode of ['full', 'review']) {
    const { record, missing, file } = readModuleRecord(root, id, moduleId, mode);
    if (missing) throw new Error(`Falta o arquivo ${file}`);
    for (const p of qualityProblems(record, { id, moduleId, mode })) found.push(`${mode === 'full' ? 'Teoria completa' : 'Revisão guiada'}: ${p}`);
  }
  const focusText = JSON.stringify(subject.modules.find((m) => m.id === moduleId));
  if (focusText.includes(PLACEHOLDER)) found.push(`O catálogo ainda tem ${PLACEHOLDER} em "focus" deste módulo (content/gmf/course-catalog-v1.js)`);
  if (found.length) { const e = new Error('Ainda não dá para publicar:\n - ' + found.join('\n - ')); e.problems = found; throw e; }
  const list = new Set(catalog.data.availableModules[id] || []);
  list.add(moduleId);
  catalog.data.availableModules[id] = [...list].sort();
  writeCatalog(catalog, root);
  bumpCatalogVersion(root);
}

function parseArgs(argv) {
  const positional = []; const flags = {};
  for (let i = 0; i < argv.length; i++) {
    if (argv[i].startsWith('--')) { flags[argv[i].slice(2)] = argv[i + 1]; i++; } else positional.push(argv[i]);
  }
  return { positional, flags };
}

async function main() {
  const [command, ...rest] = process.argv.slice(2);
  const { positional, flags } = parseArgs(rest);
  try {
    if (command === 'criar') {
      const [id, name] = positional;
      const dir = criar({ id, name, reference: flags.referencia, modules: String(flags.modulos || '').split('|').map((t) => t.trim()).filter(Boolean) });
      console.log(`Disciplina "${name}" criada (ainda em preparação: os alunos veem só o roteiro).\nPróximo passo: preencha os modelos em ${dir}/ e o "focus" no catálogo; depois publique cada módulo com\n  npm run nova-disciplina -- publicar ${id} m01`);
    } else if (command === 'publicar') {
      publicar(positional[0], positional[1]);
      console.log(`Módulo ${positional[1]} de "${positional[0]}" publicado. Rode: npm run verificar && npm test`);
    } else if (command === 'listar') {
      for (const s of listSubjects()) {
        const done = s.modules.filter((m) => m.published).length;
        console.log(`\n${s.name} (${s.id}) — ${done}/${s.modules.length} módulos publicados`);
        s.modules.forEach((m) => console.log(`  ${m.published ? '✔' : '·'} ${m.id}  ${m.title}`));
      }
    } else if (command === 'conferir') {
      const problems = await conferir();
      if (problems.length) { console.log('Problemas encontrados:\n - ' + problems.join('\n - ')); process.exit(1); }
      console.log('Disciplinas extras: tudo certo.');
    } else {
      console.log('Uso: npm run nova-disciplina -- criar|publicar|listar|conferir  (veja docs/NOVA_DISCIPLINA.md)');
      process.exit(2);
    }
  } catch (error) { console.error(error.message); process.exit(1); }
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) main();
