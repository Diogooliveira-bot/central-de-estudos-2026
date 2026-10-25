import { cp, mkdir, readdir, rm } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { protectedAsset } from '../lib/protected-content.js';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const defaultOutput = path.join(projectRoot, 'dist');
const excludedDirectories = new Set([
  '.git', '.vercel', '.next', 'node_modules', 'api', 'lib', 'db', 'tests',
  'scripts', 'docs', 'audits', 'merge', 'upstream', 'dist', 'coverage',
]);
const excludedFiles = new Set([
  'vercel.json', 'package.json', 'package-lock.json', 'README.md', 'LEIA-ME.txt',
]);

function within(parent, child) {
  const relative = path.relative(parent, child);
  return relative === '' || (!relative.startsWith(`..${path.sep}`) && relative !== '..' && !path.isAbsolute(relative));
}

function excludedFile(relativePath) {
  const normalized = relativePath.split(path.sep).join('/');
  const basename = path.posix.basename(normalized);
  if (excludedFiles.has(basename) || basename.startsWith('.env') || basename === '.DS_Store') return true;
  if (/\.(?:zip|tar|tgz|gz|log|sql)$/i.test(basename)) return true;
  return Boolean(protectedAsset(`/${normalized}`));
}

async function copyPublicTree(source, destination, relative = '') {
  await mkdir(destination, { recursive: true });
  const entries = await readdir(source, { withFileTypes: true });
  for (const entry of entries) {
    const nextRelative = relative ? path.join(relative, entry.name) : entry.name;
    const sourcePath = path.join(source, entry.name);
    const destinationPath = path.join(destination, entry.name);
    if (entry.isDirectory()) {
      if (excludedDirectories.has(entry.name) || entry.name.startsWith('.')) continue;
      await copyPublicTree(sourcePath, destinationPath, nextRelative);
      continue;
    }
    if (!entry.isFile() || excludedFile(nextRelative)) continue;
    await cp(sourcePath, destinationPath);
  }
}

/**
 * Build the public static tree while leaving protected source files available
 * only to their authenticated Vercel Function via functions.includeFiles.
 * A custom output path is accepted only outside the project tree (for tests).
 */
export async function buildStaticOutput(outputDirectory = defaultOutput) {
  const output = path.resolve(outputDirectory);
  if (output === projectRoot || (within(projectRoot, output) && output !== defaultOutput)) {
    throw new Error('Diretório de saída inseguro');
  }
  await rm(output, { recursive: true, force: true });
  await copyPublicTree(projectRoot, output);
  return output;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const output = await buildStaticOutput();
  console.log(`Saída pública gerada em ${path.relative(projectRoot, output)}; materiais protegidos ficaram fora da árvore estática.`);
}
