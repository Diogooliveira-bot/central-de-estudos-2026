import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, readdir, readFile, rm, stat } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildStaticOutput } from '../scripts/build-vercel-output.mjs';
import { protectedAsset } from '../lib/protected-content.js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

async function walk(directory, relative = '') {
  const files = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const nextRelative = relative ? `${relative}/${entry.name}` : entry.name;
    if (entry.isDirectory()) files.push(...await walk(path.join(directory, entry.name), nextRelative));
    else if (entry.isFile()) files.push(nextRelative);
  }
  return files;
}

test('Vercel static output omits protected source files but retains the public app shell', async () => {
  const temporaryRoot = await mkdtemp(path.join(os.tmpdir(), 'bc-vercel-output-'));
  const output = path.join(temporaryRoot, 'dist');
  try {
    await buildStaticOutput(output);
    const files = await walk(output);
    const paths = new Set(files.map(file => `/${file}`));

    assert.ok(paths.has('/index.html'));
    assert.ok(paths.has('/central-v119.html'));
    assert.ok(paths.has('/sw.js'));
    assert.ok(paths.has('/manifest.webmanifest'));
    assert.ok(paths.has('/central-offline-files-v66172.json'));
    assert.ok(paths.has('/content/vademecum-pdf/CF88.pdf') || files.some(file => file.startsWith('assets/vademecum-pdf/')));

    assert.equal(paths.has('/content/tec-cadernos-data.js'), false);
    assert.equal(paths.has('/content/qc-sharing-links.js'), false);
    assert.equal(paths.has('/content/civil/civil-native-content-packed.js'), false);
    assert.equal(paths.has('/content/cpc/m08-native-data-part1.js'), false);
    assert.equal(paths.has('/content/penal/m01-teoria-guiada-data.js'), false);
    assert.equal(paths.has('/lei-em-dia-aprovadas-20261012.js'), false);
    assert.equal(paths.has('/package.json'), false);
    assert.equal(paths.has('/package-lock.json'), false);
    assert.equal(paths.has('/vercel.json'), false);
    assert.equal(files.some(file => file.startsWith('api/')), false);

    const leaked = files.filter(file => protectedAsset(`/${file}`));
    assert.deepEqual(leaked, []);

    const vercelConfig = JSON.parse(await readFile(path.join(root, 'vercel.json'), 'utf8'));
    assert.equal(vercelConfig.outputDirectory, 'dist');
    assert.equal(vercelConfig.buildCommand, 'npm run build:vercel-output');
    const privateIncludes = vercelConfig.functions['api/private-content.js'].includeFiles;
    assert.match(privateIncludes, /ui\/\*\*\/\*/);
    assert.ok(privateIncludes.length <= 256, 'includeFiles must satisfy the Vercel schema limit');

    const manifest = await stat(path.join(output, 'central-offline-files-v66172.json'));
    assert.ok(manifest.size > 0);
  } finally {
    await rm(temporaryRoot, { recursive: true, force: true });
  }
});
