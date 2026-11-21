import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import zlib from 'node:zlib';

const html = fs.readFileSync(new URL('../tools/vade.html', import.meta.url), 'utf8');
const encoded = html.match(/<script id="vm-offline-law-data" type="text\/plain">([^<]+)<\/script>/)?.[1];
assert.ok(encoded, 'base jurídica incorporada deve existir');
const laws = JSON.parse(zlib.gunzipSync(Buffer.from(encoded, 'base64')));
const audit = JSON.parse(fs.readFileSync(new URL('../data/vade-legal-audit-2026-11-18.json', import.meta.url), 'utf8'));

test('inventário jurídico preserva as 31 legislações e amplia somente conteúdo comprovado', () => {
  assert.equal(Object.keys(laws).length, 31);
  assert.equal(Object.values(laws).reduce((sum, law) => sum + law.articles.length, 0), 6407);
  assert.equal(Object.values(laws).filter((law) => law.verification.status === 'verified').length, 9);
  assert.deepEqual(audit.summary, {
    lawsInventoried: 31,
    lawsVerified: 9,
    lawsPendingFullVerification: 22,
    articlesBefore: 5854,
    articlesAfter: 6407,
    correctedDevices: 56,
    addedArticlesAndDevices: 560
  });
});

test('EC 140/2026 foi incorporada exatamente nos arts. 40, 198 e 201', () => {
  const article = (id) => laws.cf.articles.find((item) => item.id === id).paragraphs;
  assert.ok(article('40-1').includes('§ 5º-A. O requisito de idade a que se refere o inciso III do § 1º deste artigo será de 57 (cinquenta e sete) anos de idade, se mulher, e 60 (sessenta) anos de idade, se homem, para o agente comunitário de saúde e o agente de combate às endemias que comprovem o mínimo de 25 (vinte e cinco) anos de tempo de contribuição e de efetivo exercício na respectiva atividade profissional.'));
  assert.ok(article('198-1').includes('IV – atuação obrigatória e permanente de agentes comunitários de saúde e de agentes de combate às endemias, cuja atividade é essencial ao sistema único de saúde e exclusiva de Estado.'));
  assert.ok(article('198-1').some((text) => text.startsWith('§ 4º-A. É vedada a contratação temporária')));
  assert.ok(article('198-1').some((text) => text.startsWith('§ 4º-B. Os agentes de que trata')));
  assert.ok(article('201-1').some((text) => text.startsWith('§ 8º-A. O requisito de idade')));
});

test('EC 141/2026 respeita vigência imediata, transição e inciso XV futuro', () => {
  const paragraphs = laws.cf.articles.find((item) => item.id === '7-1').paragraphs;
  assert.ok(paragraphs.includes('XIII – duração do trabalho normal não superior a 8 (oito) horas diárias e 40 (quarenta) horas semanais, facultada a compensação de horários e a redução da jornada, mediante acordo ou convenção coletiva de trabalho;'));
  assert.ok(paragraphs.includes('XV - repouso semanal remunerado, preferencialmente aos domingos;'), 'redação ainda vigente do inciso XV deve permanecer até 16/12/2026');
  assert.ok(paragraphs.some((text) => text.startsWith('§ 1º São assegurados')));
  assert.ok(paragraphs.some((text) => text.startsWith('§ 2º Excepcionalmente')));
  assert.ok(paragraphs.some((text) => text.startsWith('§ 3º Lei poderá dispor')));
  assert.ok(laws.cf.legalNotes.some((note) => note.includes('16/12/2026')));
});

test('oito recortes resumidos foram substituídos por textos integrais oficiais', () => {
  const expected = { l13869:46, l9613:28, l9099crim:99, l10259:27, l7210:219, l13019:100, l13709:79, l7960:7 };
  for (const [id, count] of Object.entries(expected)) {
    const law = laws[id];
    assert.equal(law.articles.length, count, id);
    assert.equal(law.verification.status, 'verified', id);
    assert.equal(law.verification.verifiedAt, '2026-11-18', id);
    const text = law.articles.flatMap((article) => article.paragraphs).join('\n');
    assert.doesNotMatch(text, /RECORTE DE REVISÃO|Base já existente no Anki|O art\. 112 disciplina|A lei estabelece impedimentos/i, id);
    assert.doesNotMatch(text, /[ęăşőŕ]/, `mojibake em ${id}`);
    assert.ok(law.verification.sources.every((url) => url.startsWith('https://')));
  }
});

test('Lei da Prisão Temporária contém dispositivos antes omitidos', () => {
  const art1 = laws.l7960.articles.find((article) => article.id === '1-1').paragraphs.join('\n');
  const art2 = laws.l7960.articles.find((article) => article.id === '2-1').paragraphs.join('\n');
  assert.match(art1, /a\) homicídio doloso/);
  assert.match(art1, /p\) crimes previstos na Lei de Terrorismo/);
  assert.match(art2, /§ 3º O Juiz poderá/);
  assert.match(art2, /§ 4º-A\. O mandado de prisão/);
  assert.match(art2, /§ 6º Efetuada a prisão/);
});

test('artigos não ficam duplicados após a importação consolidada', () => {
  for (const [id, law] of Object.entries(laws)) {
    const ids = law.articles.map((article) => article.id);
    assert.equal(new Set(ids).size, ids.length, `IDs duplicados em ${id}`);
  }
});

test('interface mostra conferência e separa observações da lei seca', () => {
  assert.match(html, /function vmLegalStatus\(law\)/);
  assert.match(html, /Observações de vigência e jurisprudência/);
  assert.match(html, /Inventariado em/);
  assert.match(html, /Fonte oficial ↗/);
});

test('controle jurídico é restrito a administrador e mantém eventos imutáveis', () => {
  const api = fs.readFileSync(new URL('../lib/vade-audit.js', import.meta.url), 'utf8');
  const admin = fs.readFileSync(new URL('../vade-admin.html', import.meta.url), 'utf8');
  assert.match(api, /requireSession\(req, \['admin'\]\)/);
  assert.match(api, /central_vade_legal_events/);
  assert.match(api, /sameOriginRequest\(req\)/);
  assert.match(admin, /me\.user\?\.role!=='admin'/);
  assert.doesNotMatch(admin, /password|token|DATABASE_URL/i);
});
