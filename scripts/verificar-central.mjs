#!/usr/bin/env node
/* Verificador da Central: acha, antes de publicar, os erros que mais quebram a Central quando se atualiza ou
 * revisa conteúdo. Uso:  npm run verificar            (confere o repositório inteiro)
 *                        npm run verificar -- --base origin/main   (também confere se o que mudou teve a versão trocada)
 * Saída em português simples: ERRO = não publique; ATENÇÃO = vale olhar; OK = tudo certo. Não altera nenhum arquivo. */
import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { basename } from 'node:path';
import vm from 'node:vm';

const args = process.argv.slice(2);
const baseIdx = args.indexOf('--base');
const BASE = baseIdx >= 0 ? args[baseIdx + 1] : '';
const read = (file) => readFileSync(file, 'utf8');
const git = (...a) => execFileSync('git', a, { encoding: 'utf8', maxBuffer: 256 * 1024 * 1024 });
const tracked = git('ls-files').split('\n').filter(Boolean);

const found = { erro: [], atencao: [] };
const erro = (titulo, detalhe, comoCorrigir) => found.erro.push({ titulo, detalhe, comoCorrigir });
const atencao = (titulo, detalhe, comoCorrigir) => found.atencao.push({ titulo, detalhe, comoCorrigir });
const ok = [];

/* 1) Todo arquivo JavaScript precisa ter sintaxe válida (um erro derruba a Central inteira). */
{
  const files = tracked.filter((f) => /\.(?:js|mjs)$/.test(f) && !f.startsWith('node_modules/'));
  const bad = [];
  const modulo = (f, code) => f.endsWith('.mjs') || /^(?:api|lib|scripts|tests|tools|db)\//.test(f) || /^\s*(?:import|export)\s/m.test(code);
  for (const f of files) {
    const code = read(f);
    if (modulo(f, code)) {
      try { execFileSync(process.execPath, ['--check', f], { stdio: 'pipe' }); }
      catch (e) { bad.push(f + ': ' + (String(e.stderr || e.message).split('\n').find((l) => /Error/.test(l)) || 'erro de sintaxe')); }
    } else {
      try { new vm.Script(code, { filename: f }); } catch (e) { bad.push(f + ': ' + String(e.message).split('\n')[0]); }
    }
  }
  if (bad.length) erro('Arquivo JavaScript com erro de sintaxe', bad.slice(0, 20).join('\n  '), 'Abra o arquivo citado e corrija (ou volte a versão anterior com "git checkout origin/main -- arquivo").');
  else ok.push(`${files.length} arquivos JavaScript com sintaxe válida`);
}

/* 2) Páginas públicas: começam com <!doctype>, sem texto de ferramenta/marcas de conflito, scripts inline válidos. */
const PAGES = ['index.html', 'central-v119.html', 'login.html'].filter(existsSync);
{
  const problems = [];
  for (const page of PAGES) {
    const text = read(page);
    if (!/^\s*<!doctype html>/i.test(text)) problems.push(`${page}: não começa com <!doctype html> (algo foi colado antes do início)`);
    if (/^Warning: truncated output|^Total output lines:/m.test(text)) problems.push(`${page}: contém texto de ferramenta ("truncated output")`);
    if (/^(?:<{7}|={7}|>{7})( |$)/m.test(text)) problems.push(`${page}: contém marcas de conflito do git`);
    for (const m of text.matchAll(/<script(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/gi)) {
      const code = m[1];
      if (!code.trim() || /type\s*=\s*["'](?:application\/json|module|text\/template)/i.test(m[0].slice(0, 120))) continue;
      try { new vm.Script(code); } catch (e) { problems.push(`${page}: script inline com erro (${String(e.message).split('\n')[0]}) perto de: ${code.trim().slice(0, 50).replace(/\s+/g, ' ')}`); }
    }
  }
  if (problems.length) erro('Página principal quebrada', problems.join('\n  '), 'Não publique. Corrija o arquivo da página ou volte a versão anterior.');
  else ok.push(`${PAGES.length} páginas principais íntegras`);
}

/* 3) Arquivos referenciados (com ?v=) existem; versões coerentes entre abertura, index e pacote offline. */
const manifest = JSON.parse(read('central-offline-files-v66172.json')).files || [];
const refs = new Map(); // caminho -> Map(versão -> onde)
{
  const addRef = (file, where, path, version) => {
    const key = path.replace(/^\//, '');
    if (!refs.has(key)) refs.set(key, new Map());
    const m = refs.get(key); if (!m.has(version)) m.set(version, new Set()); m.get(version).add(where);
  };
  for (const page of PAGES) {
    for (const m of read(page).matchAll(/['"(=]\s*\/?([A-Za-z0-9_\-./]+\.(?:js|css|mjs|json|webp|png|svg))\?v=([A-Za-z0-9_.\-]+)/g)) addRef(page, page, m[1], m[2]);
  }
  for (const f of manifest) { const m = /^\/?([^?]+)\?v=([A-Za-z0-9_.\-]+)$/.exec(f); if (m) addRef('manifest', 'pacote offline', m[1], m[2]); }

  const missing = [...refs.keys()].filter((p) => !existsSync(p));
  const missingManifest = manifest.map((f) => f.split('?')[0].replace(/^\//, '')).filter((p) => p && !existsSync(p));
  const miss = [...new Set([...missing, ...missingManifest])];
  if (miss.length) erro('A Central pede arquivos que não existem', miss.slice(0, 25).join('\n  '), 'Crie o arquivo, ou tire a linha que o chama (em central-v119.html, index.html ou central-offline-files-v66172.json).');
  else ok.push(`${refs.size} arquivos referenciados existem (e as ${manifest.length} linhas do pacote offline também)`);

  const split = [...refs.entries()].filter(([, v]) => v.size > 1);
  if (split.length) atencao('Mesmo arquivo com versões diferentes', split.slice(0, 15).map(([p, v]) => `${p}: ` + [...v.entries()].map(([ver, w]) => `${ver} (${[...w].join(', ')})`).join(' ≠ ')).join('\n  '),
    'Use a MESMA versão (?v=) na abertura (central-v119.html), no index.html e em central-offline-files-v66172.json. Versão diferente = parte dos alunos vê a versão antiga.');
  else ok.push('Versões (?v=) coerentes entre abertura, index e pacote offline');
}

/* 4) A versão geral (BUILD) é a mesma em todos os lugares. */
{
  const builds = new Map();
  for (const f of ['central-v119.html', 'sw.js', 'index.html', 'central-offline-files-v66172.json']) {
    if (!existsSync(f)) continue;
    for (const m of read(f).matchAll(/\b(20\d{6}-[a-z0-9]+(?:-[a-z0-9]+)*?-v\d+)\b/g)) { if (!builds.has(m[1])) builds.set(m[1], new Set()); builds.get(m[1]).add(f); }
  }
  const boot = /var BUILD='([^']+)'/.exec(read('central-v119.html'));
  const current = boot && boot[1];
  const outros = [...builds.keys()].filter((b) => current && b !== current && /^20\d{6}-/.test(b));
  const swBuild = /BUILD\s*=\s*'([^']+)'/.exec(read('sw.js'));
  const manifestBuild = (JSON.parse(read('central-offline-files-v66172.json')).build) || '';
  if (current && manifestBuild !== current) erro('Versão geral do pacote offline diferente da abertura', `abertura=${current} · central-offline-files-v66172.json "build"=${manifestBuild}`, 'Troque o campo "build" do central-offline-files-v66172.json para a mesma versão geral (os testes do pacote offline e o cache dependem disso).');
  if (current && swBuild && swBuild[1] !== current) erro('Versão geral diferente entre a abertura e o service worker', `abertura=${current} · sw.js=${swBuild[1]}`, 'Troque a versão geral em todos os arquivos juntos (central-v119.html, sw.js, index.html e o pacote offline).');
  else ok.push(`Versão geral única: ${current || 'não encontrada'}`);
  if (outros.length && swBuild) atencao('Sobraram versões gerais antigas em arquivos', outros.slice(0, 6).map((b) => `${b} em ${[...builds.get(b)].join(', ')}`).join('\n  '), 'Se for resto da versão anterior, troque para a atual.');
}

/* 5) Conteúdo que mudou precisa ter a versão trocada (senão o aluno continua vendo o arquivo antigo em cache). */
if (BASE) {
  try {
    git('rev-parse', '--verify', BASE);
    const changed = new Set(git('diff', '--name-only', BASE + '...HEAD').split('\n').filter(Boolean));
    const baseText = (f) => { try { return git('show', `${BASE}:${f}`); } catch (_) { return ''; } };
    const baseVersions = new Map();
    for (const f of [...PAGES, 'central-offline-files-v66172.json']) {
      for (const m of baseText(f).matchAll(/\/?([A-Za-z0-9_\-./]+\.(?:js|css|mjs|json|webp|png|svg))\?v=([A-Za-z0-9_.\-]+)/g)) baseVersions.set(m[1], (baseVersions.get(m[1]) || new Set()).add(m[2]));
    }
    const stale = [];
    for (const f of changed) {
      if (!baseVersions.has(f) || !refs.has(f)) continue;
      // Se a única diferença do arquivo são números de versão (?v=) de OUTROS arquivos, o conteúdo dele não mudou.
      const semVersao = (t) => t.replace(/\?v=[A-Za-z0-9_.\-]+/g, '?v=');
      if (existsSync(f) && semVersao(read(f)) === semVersao(baseText(f))) continue;
      const nowVersions = new Set(refs.get(f).keys());
      const same = [...nowVersions].every((v) => baseVersions.get(f).has(v));
      if (same) stale.push(`${f} (versão ainda ${[...nowVersions].join('/')})`);
    }
    if (stale.length) erro('Arquivo mudou, mas a versão (?v=) não foi trocada', stale.slice(0, 25).join('\n  '), 'Troque o ?v= desse arquivo em central-v119.html e central-offline-files-v66172.json. Sem isso, alunos continuam vendo a versão antiga.');
    else ok.push(`Conteúdo alterado desde ${BASE} tem versão nova (${changed.size} arquivos mudaram)`);
  } catch (e) { atencao('Não consegui comparar com ' + BASE, String(e.message).split('\n')[0], 'Rode "git fetch origin main" e tente de novo.'); }
}

/* 6) Conteúdo de revisão (lei seca por módulo): formato esperado. */
{
  const bad = [];
  for (const f of tracked.filter((x) => /^content\/(?:penal|cpp|adm)\/lei-revisao\/m\d+\.js$/.test(x))) {
    const code = read(f);
    if (!/g\.BC_LEI_REVISAO\["(?:penal|cpp|adm)"\]\[\d+\]\s*=\s*\[/.test(code)) bad.push(f + ': não define a lista de leis do módulo (BC_LEI_REVISAO)');
  }
  if (bad.length) erro('Arquivo de lei seca fora do formato', bad.slice(0, 15).join('\n  '), 'Gere de novo com "node scripts/build-lei-revisao.mjs".');
  else ok.push('Arquivos de lei seca por módulo no formato esperado');
}

/* 7) Segredos acidentais em arquivos públicos. */
{
  const hits = [];
  for (const f of tracked.filter((x) => /\.(?:js|html|json|css)$/.test(x) && !/^(?:tests|scripts|docs|node_modules|lib|api)\//.test(x))) {
    const t = read(f);
    if (/(?:sk_live_|AKIA[0-9A-Z]{16}|-----BEGIN (?:RSA |EC )?PRIVATE KEY-----|postgres(?:ql)?:\/\/[^\s'"]+:[^\s'"@]+@)/.test(t)) hits.push(f);
  }
  if (hits.length) erro('Possível senha/chave dentro de arquivo público', hits.join('\n  '), 'Remova na hora, troque a chave no serviço correspondente e avise o suporte.');
  else ok.push('Nenhuma chave/senha em arquivos públicos');
}

/* 8) Disciplinas extras (GMF e futuras): tudo derivado do catálogo; acusa esquecimentos e conteúdo publicado sem qualidade. */
{
  try {
    const { conferir } = await import('./disciplinas-extras.mjs');
    const problemas = await conferir();
    if (problemas.length) erro('Disciplinas extras com problema', problemas.slice(0, 20).join('\n  '), 'Veja docs/NOVA_DISCIPLINA.md e rode: npm run nova-disciplina -- conferir');
    else ok.push('Disciplinas extras (GMF) coerentes: proteção, questões bloqueadas e conteúdo publicado');
  } catch (e) { atencao('Não foi possível conferir as disciplinas extras', String(e.message || e).slice(0, 200), 'Rode: npm run nova-disciplina -- conferir'); }
}

/* ---- relatório ---- */
const linha = '─'.repeat(60);
console.log(`\nVerificação da Central — ${new Date().toLocaleString('pt-BR')}\n${linha}`);
for (const o of ok) console.log('  OK       ' + o);
for (const a of found.atencao) console.log(`\n  ATENÇÃO  ${a.titulo}\n  ${a.detalhe}\n  → Como corrigir: ${a.comoCorrigir}`);
for (const e of found.erro) console.log(`\n  ERRO     ${e.titulo}\n  ${e.detalhe}\n  → Como corrigir: ${e.comoCorrigir}`);
console.log(`\n${linha}\nResultado: ${found.erro.length ? 'NÃO PUBLIQUE — ' + found.erro.length + ' erro(s)' : 'pode seguir'}${found.atencao.length ? ` · ${found.atencao.length} atenção(ões)` : ''}\n`);
process.exit(found.erro.length ? 1 : 0);
