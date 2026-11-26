// Sistema de disciplinas extras (GMF e futuras): uma disciplina nova nasce de UM catálogo e tudo o mais é derivado.
// O teste cria uma disciplina de verdade numa CÓPIA temporária e confere cada etapa, sem tocar nos arquivos reais.
import test from 'node:test';
import assert from 'node:assert/strict';
import { cpSync, mkdtempSync, mkdirSync, readFileSync, writeFileSync, symlinkSync, existsSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const real = resolve(new URL('..', import.meta.url).pathname);
const lib = await import('../scripts/disciplinas-extras.mjs');
const read = (p) => readFileSync(join(real, p), 'utf8');

function copiaTemporaria() {
  const root = mkdtempSync(join(tmpdir(), 'disciplinas-'));
  cpSync(join(real, 'lib'), join(root, 'lib'), { recursive: true });
  cpSync(join(real, 'scripts'), join(root, 'scripts'), { recursive: true });
  mkdirSync(join(root, 'content'), { recursive: true });
  cpSync(join(real, 'content/gmf'), join(root, 'content/gmf'), { recursive: true });
  writeFileSync(join(root, 'package.json'), '{"type":"module"}');
  symlinkSync(join(real, 'node_modules'), join(root, 'node_modules'));
  return root;
}
const texto = (n) => '<p>' + Array.from({ length: n }, (_, i) => 'palavra' + i).join(' ') + '</p>';
const conteudo = (mode, id, moduleId, titulo) => {
  const capitulos = Array.from({ length: mode === 'full' ? 4 : 3 }, (_, i) => ({ title: `Capítulo ${i + 1}`, html: texto(mode === 'full' ? 130 + i : 60 + i) }));
  const r = { subject: id, module: moduleId, title: titulo, resources: [{ title: 'Fonte oficial', url: 'https://www.gov.br/' }], chapters: capitulos };
  return `window.${mode === 'full' ? 'GMF_MODULE_FULL' : 'GMF_MODULE_REVIEW'}=${JSON.stringify(r)};`;
};

test('as disciplinas atuais passam na conferência completa (nada esquecido nos pontos de registro)', async () => {
  assert.deepEqual(await lib.conferir(real), []);
});

test('criar -> modelo não publica -> preencher -> publicar -> protegida e bloqueada nas questões', async () => {
  const root = copiaTemporaria();
  try {
    const dir = lib.criar({ id: 'transito', name: 'Legislação de Trânsito', reference: 'Edital hipotético', modules: ['Infrações e penalidades', 'Crimes de trânsito'] }, root);
    assert.ok(existsSync(join(dir, 'm01-full-v1.js')) && existsSync(join(dir, 'm02-review-v1.js')), 'modelos criados');
    const catalogo = lib.readCatalog(root).data;
    assert.equal(catalogo.subjects.length, 5);
    assert.deepEqual(catalogo.availableModules.transito, [], 'nasce sem nenhum módulo publicado');
    assert.deepEqual(await lib.conferir(root), [], 'em preparação é um estado válido');

    // o modelo não pode ser publicado
    assert.throws(() => lib.publicar('transito', 'm01', root), (e) => /Ainda não dá para publicar/.test(e.message) && e.problems.some((p) => p.includes(lib.PLACEHOLDER)));

    // preenche o conteúdo e o "focus" do catálogo; agora publica
    writeFileSync(join(dir, 'm01-full-v1.js'), conteudo('full', 'transito', 'm01', 'Completo'));
    writeFileSync(join(dir, 'm01-review-v1.js'), conteudo('review', 'transito', 'm01', 'Revisão'));
    const c = lib.readCatalog(root);
    c.data.subjects.find((s) => s.id === 'transito').modules[0].focus = ['Infrações leves, médias, graves e gravíssimas.', 'Pontuação e suspensão do direito de dirigir.'];
    lib.writeCatalog(c, root);
    lib.publicar('transito', 'm01', root);
    assert.deepEqual(lib.readCatalog(root).data.availableModules.transito, ['m01']);
    assert.deepEqual(await lib.conferir(root), []);

    // publicado com conteúdo ruim é apontado pela conferência
    writeFileSync(join(dir, 'm01-review-v1.js'), conteudo('review', 'transito', 'm01', 'Revisão').replace(/palavra\d+ /g, ''));
    assert.ok((await lib.conferir(root)).some((p) => /"transito"\/m01 \(revisão\)/.test(p)));

    // derivados do catálogo: proteção do conteúdo e bloqueio das questões nascem automaticamente
    const { protectedAsset } = await import(pathToFileURL(join(root, 'lib/protected-content.js')).href);
    assert.equal(protectedAsset('/content/gmf/transito/m01-full-v1.js')?.feature, 'theory.complete');
    assert.equal(protectedAsset('/content/gmf/transito/m01-review-v1.js')?.feature, 'theory.summary');
    const { gmfDisciplineIds } = await import(pathToFileURL(join(root, 'lib/questoes-handler.js')).href);
    assert.ok(gmfDisciplineIds(root).has('transito'));
  } finally { rmSync(root, { recursive: true, force: true }); }
});

test('recusa códigos repetidos, de disciplinas originais ou inválidos', () => {
  const root = copiaTemporaria();
  try {
    const base = { name: 'X', modules: ['A'] };
    assert.throws(() => lib.criar({ ...base, id: 'atual' }, root), /já existe/);
    assert.throws(() => lib.criar({ ...base, id: 'pt' }, root), /original/);
    assert.throws(() => lib.criar({ ...base, id: 'Trânsito 1' }, root), /só letras minúsculas/);
    assert.throws(() => lib.criar({ ...base, id: 'novo', modules: [] }, root), /módulos/);
  } finally { rmSync(root, { recursive: true, force: true }); }
});

test('conferência acusa disciplina publicada sem arquivo e códigos fora de ordem', async () => {
  const root = copiaTemporaria();
  try {
    const c = lib.readCatalog(root);
    c.data.availableModules.fortaleza.push('m10');
    c.data.subjects.find((s) => s.id === 'dh').modules[1].id = 'm09';
    lib.writeCatalog(c, root);
    const problemas = await lib.conferir(root);
    assert.ok(problemas.some((p) => /m10/.test(p)));
    assert.ok(problemas.some((p) => /deveria ter o código "m02"/.test(p)));
  } finally { rmSync(root, { recursive: true, force: true }); }
});

test('o aplicativo deriva cores, ordem, objetivo e leitor do catálogo (nada de lista escrita à mão)', () => {
  const objective = read('ui/gmf-study-objective-v1.js');
  assert.match(objective, /global\.GmfCourseCatalog\?\.subjects/);
  assert.doesNotMatch(objective, /const EXTRA=new Set\(\['atual'/);
  assert.match(read('ui/gmf-disciplines-v1.js'), /function accentRule\(course, index\)/);
  assert.match(read('ui/questoes-area-v1.js'), /GmfCourseCatalog\?\.subjects/);
  assert.match(read('ui/gmf-course-reader-v2.js'), /usesBundle\(subject,module\)/);
  const index = read('index.html');
  assert.ok(index.indexOf('/content/gmf/course-catalog-v1.js') < index.indexOf('/ui/gmf-study-objective-v1.js'), 'o catálogo carrega antes do objetivo GMF');
  assert.match(read('lib/protected-content.js'), /\/content\\\/gmf\\\/\(\[a-z\]\{2,12\}\)\\\/\(m\\d\{2\}\)/);
  assert.match(read('lib/questoes-handler.js'), /export function gmfDisciplineIds/);
});
