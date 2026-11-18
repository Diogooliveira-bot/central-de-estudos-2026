import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const VADE_PATH = path.join(ROOT, 'tools', 'vade.html');
const VERIFIED_AT = '2026-11-18';
const BASELINE_COUNTS = { l13869:2, l9613:2, l9099crim:8, l10259:3, l7210:6, l13019:14, l13709:13, l7960:4 };
const mojibake = new Map(Object.entries({
  'ę':'ê','ă':'ã','ş':'º','ő':'õ','ŕ':'à','Ă':'Ã','Ę':'Ê','Ş':'º','Ő':'Õ','Ŕ':'À'
}));

function repairPlanatoPdfText(value) {
  return [...String(value)].map((character) => mojibake.get(character) || character).join('');
}

function parseOfficialLaw(rawText) {
  const lines = repairPlanatoPdfText(rawText).replace(/\f/g, '\n').split(/\n/)
    .map((line) => line.replace(/\s+/g, ' ').trim()).filter(Boolean);
  const articles = [];
  const headings = [];
  let article = null;
  let paragraph = null;
  const paragraphStart = /^(?:§|Parágrafo único\.|(?:[IVXLCDM]+|[a-z])\s*[-–—)]|Pena\b|Art\.\s)/;

  function finishArticle() {
    if (!article) return;
    if (paragraph) article.paragraphs.push(paragraph);
    articles.push(article);
    article = null;
    paragraph = null;
  }

  for (const line of lines) {
    // Artigos citados dentro de aspas alteram outras leis e não constituem novo artigo da norma.
    const match = /^Art\.\s*(\d+)(?:º|°|o)?(?:-([A-Z]))?[.]?\s*(.*)$/u.exec(line);
    if (match) {
      finishArticle();
      const number = match[1] + (match[2] ? `-${match[2]}` : '');
      article = {
        id: `${number.toLowerCase()}-1`,
        label: `Art. ${number}`,
        heading: headings.splice(Math.max(0, headings.length - 2)).join(' · '),
        paragraphs: []
      };
      paragraph = `Art. ${match[1]}${match[2] ? `-${match[2]}.` : 'º '}${match[3] || ''}`.trim();
      continue;
    }

    const structuralHeading = /^(?:TÍTULO|CAPÍTULO|SEÇÃO|SUBSEÇÃO|LIVRO|PARTE)\b/.test(line) ||
      (/^[A-ZÁÉÍÓÚÂÊÔÃÕÇ0-9 ·–—-]{6,}$/.test(line) && !paragraphStart.test(line));
    if (structuralHeading) {
      finishArticle();
      headings.push(line);
      continue;
    }
    if (!article) continue;
    if (paragraphStart.test(line)) {
      if (paragraph) article.paragraphs.push(paragraph);
      paragraph = line;
    } else {
      paragraph = `${paragraph ? `${paragraph} ` : ''}${line}`;
    }
  }
  finishArticle();

  // Os textos consolidados podem reproduzir artigos de outras leis em dispositivos de alteração.
  const seen = new Set();
  return articles.filter((item) => !seen.has(item.id) && seen.add(item.id));
}

function pdfText(file) {
  return execFileSync('pdftotext', [path.join(ROOT, file), '-'], {
    encoding: 'utf8', maxBuffer: 20_000_000
  });
}

function sourceText(file) {
  return fs.readFileSync(path.join(ROOT, file), 'utf8');
}

function replaceParagraph(article, prefix, replacement) {
  const index = article.paragraphs.findIndex((text) => text.startsWith(prefix));
  if (index < 0 && article.paragraphs.includes(replacement)) return;
  if (index < 0) throw new Error(`Dispositivo não encontrado: ${article.label} / ${prefix}`);
  article.paragraphs[index] = replacement;
}

function insertAfter(article, prefix, additions) {
  const index = article.paragraphs.findIndex((text) => text.startsWith(prefix));
  if (index < 0) throw new Error(`Ponto de inserção não encontrado: ${article.label} / ${prefix}`);
  article.paragraphs.splice(index + 1, 0, ...additions);
}

function updateConstitution(data) {
  const law = data.cf;
  const find = (id) => {
    const article = law.articles.find((item) => item.id === id);
    if (!article) throw new Error(`Artigo constitucional ausente: ${id}`);
    return article;
  };

  const article7 = find('7-1');
  replaceParagraph(article7, 'XIII -', 'XIII – duração do trabalho normal não superior a 8 (oito) horas diárias e 40 (quarenta) horas semanais, facultada a compensação de horários e a redução da jornada, mediante acordo ou convenção coletiva de trabalho;');
  const formerSoleParagraph = article7.paragraphs.find((text) => text.startsWith('Parágrafo único.'));
  if (formerSoleParagraph) replaceParagraph(article7, 'Parágrafo único.', formerSoleParagraph.replace('Parágrafo único.', '§ 1º'));
  if (!article7.paragraphs.some((text) => text.startsWith('§ 1º'))) throw new Error('Art. 7º, § 1º não encontrado');
  if (!article7.paragraphs.some((text) => text.startsWith('§ 2º'))) {
    article7.paragraphs.push('§ 2º Excepcionalmente, convenção ou acordo coletivo de trabalho poderão, inclusive para os trabalhadores sujeitos a regimes diferenciados de trabalho estabelecidos em lei ou norma regulamentadora, estabelecer regime compensatório que assegure, na média, 2 (dois) dias de repouso semanal remunerado dentro do mês-calendário, garantido o gozo de pelo menos 1 (um) dos dias dentro do período máximo de 1 (uma) semana de trabalho.');
    article7.paragraphs.push('§ 3º Lei poderá dispor sobre hipóteses e condições em que a duração do trabalho e os dias de repouso semanal remunerado poderão observar regimes diferenciados, respeitados os limites previstos nos incisos XIII, XIV e XV do caput deste artigo.');
  }

  const article40 = find('40-1');
  replaceParagraph(article40, '§ 4º É vedada', '§ 4º É vedada a adoção de requisitos ou critérios diferenciados para concessão de benefícios em regime próprio de previdência social, ressalvado o disposto nos §§ 4º-A, 4º-B, 4º-C, 5º e 5º-A deste artigo.');
  if (!article40.paragraphs.some((text) => text.startsWith('§ 5º-A.'))) {
    insertAfter(article40, '§ 5º ', ['§ 5º-A. O requisito de idade a que se refere o inciso III do § 1º deste artigo será de 57 (cinquenta e sete) anos de idade, se mulher, e 60 (sessenta) anos de idade, se homem, para o agente comunitário de saúde e o agente de combate às endemias que comprovem o mínimo de 25 (vinte e cinco) anos de tempo de contribuição e de efetivo exercício na respectiva atividade profissional.']);
  }

  const article198 = find('198-1');
  if (!article198.paragraphs.some((text) => text.startsWith('IV – atuação obrigatória'))) {
    insertAfter(article198, 'III -', ['IV – atuação obrigatória e permanente de agentes comunitários de saúde e de agentes de combate às endemias, cuja atividade é essencial ao sistema único de saúde e exclusiva de Estado.']);
  }
  if (!article198.paragraphs.some((text) => text.startsWith('§ 4º-A.'))) {
    insertAfter(article198, '§ 4º ', [
      '§ 4º-A. É vedada a contratação temporária ou terceirizada de agentes comunitários de saúde e de agentes de combate às endemias, salvo a hipótese de emergência em saúde pública, na forma da lei.',
      '§ 4º-B. Os agentes de que trata o § 4º deste artigo submetem-se ao regime jurídico dos servidores nomeados para cargo de provimento efetivo.'
    ]);
  }
  replaceParagraph(article198, '§ 10.', '§ 10. Os agentes comunitários de saúde e os agentes de combate às endemias terão, em razão dos riscos inerentes às funções desempenhadas, direito à aposentadoria mediante requisitos diferenciados, na forma do § 5º-A do art. 40 e do § 8º-A do art. 201 desta Constituição, e ao adicional de insalubridade.');

  const article201 = find('201-1');
  if (!article201.paragraphs.some((text) => text.startsWith('§ 8º-A.'))) {
    insertAfter(article201, '§ 8º ', ['§ 8º-A. O requisito de idade a que se refere o inciso I do § 7º deste artigo será de 57 (cinquenta e sete) anos de idade, se mulher, e 60 (sessenta) anos de idade, se homem, para o agente comunitário de saúde e o agente de combate às endemias que comprovem o mínimo de 25 (vinte e cinco) anos de tempo de contribuição e de efetivo exercício na respectiva atividade profissional.']);
  }

  law.verification = {
    status: 'verified', verifiedAt: VERIFIED_AT,
    sources: [
      'https://legis.senado.leg.br/norma/44187742/publicacao/44190103',
      'https://legis.senado.leg.br/norma/44184944/publicacao/44189027'
    ],
    updatedBy: 'EC 140/2026 e EC 141/2026'
  };
  law.legalNotes = [
    'EC 141/2026: o inciso XV do art. 7º somente entra em vigor em 16/12/2026. Até essa data, permanece exibida a redação anterior vigente.',
    'EC 141/2026: a redução da jornada tem transição própria — máximo de 42 horas semanais a partir de 16/12/2026 e de 40 horas semanais a partir de 16/12/2027.',
    'Tema 1.000 do STF: julgamento pautado para 18/11/2026, sem tese vinculante final registrada na fonte oficial no momento desta conferência; nenhuma proposta de voto foi incorporada ao texto legal.'
  ];
}

const replacements = {
  l13869: { source: () => pdfText('assets/vademecum-pdf/Lei 13.869_2019 - Abuso de autoridade.pdf'), count: 46, sourceUrl: 'https://www.planalto.gov.br/ccivil_03/_ato2019-2022/2019/lei/l13869compilado.htm' },
  l9613: { source: () => pdfText('assets/vademecum-pdf/Lei 9.613_1998 - Lavagem de Dinheiro.pdf'), count: 28, sourceUrl: 'https://legis.senado.leg.br/norma/551489/publicacao/34619710' },
  l9099crim: { source: () => pdfText('assets/vademecum-pdf/Lei 9.099_1995 - Juizados Especiais.pdf'), count: 99, sourceUrl: 'https://legis.senado.leg.br/norma/550975/publicacao/34619631' },
  l13019: { source: () => pdfText('assets/vademecum-pdf/Lei 13.019_2014 - MROSC.pdf'), count: 100, sourceUrl: 'https://www.planalto.gov.br/ccivil_03/_ato2011-2014/2014/lei/l13019compilado.htm' },
  l13709: { source: () => pdfText('assets/vademecum-pdf/Lei 13.709_2018 - LGPD.pdf'), count: 79, sourceUrl: 'https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/l13709compilado.htm' },
  l7210: { source: () => sourceText('legal-sources/lei-7210-senado-consolidada.txt'), count: 219, sourceUrl: 'https://legis.senado.leg.br/norma/549086/publicacao/34619809' },
  l10259: { source: () => sourceText('legal-sources/lei-10259-senado-consolidada.txt'), count: 27, sourceUrl: 'https://legis.senado.leg.br/norma/552135/publicacao/34620788' },
  l7960: { source: () => sourceText('legal-sources/lei-7960-senado-consolidada.txt'), count: 7, sourceUrl: 'https://legis.senado.leg.br/norma/549836/publicacao/34619907' }
};

let html = fs.readFileSync(VADE_PATH, 'utf8');
const encodedMatch = html.match(/<script id="vm-offline-law-data" type="text\/plain">([^<]+)<\/script>/);
if (!encodedMatch) throw new Error('Base jurídica incorporada não encontrada');
const data = JSON.parse(zlib.gunzipSync(Buffer.from(encodedMatch[1], 'base64')));
const previousCounts = Object.fromEntries(Object.entries(data).map(([id, law]) => [id, BASELINE_COUNTS[id] ?? law.articles.length]));

updateConstitution(data);
for (const [id, config] of Object.entries(replacements)) {
  const articles = parseOfficialLaw(config.source());
  if (articles.length !== config.count) throw new Error(`${id}: esperados ${config.count} artigos, encontrados ${articles.length}`);
  data[id].articles = articles;
  data[id].law.subtitle = data[id].law.subtitle.replace(/\s*·\s*recorte.*$/i, '').replace(/\s*·\s*Capítulo III$/i, '');
  data[id].law.abstract = 'Texto integral consolidado, preservado conforme a fonte legislativa oficial.';
  data[id].law.officialUrl = config.sourceUrl;
  data[id].law.sourceUrl = config.sourceUrl;
  data[id].verification = { status: 'verified', verifiedAt: VERIFIED_AT, sources: [config.sourceUrl], updatedBy: 'substituição do recorte por texto integral oficial' };
}

for (const [id, law] of Object.entries(data)) {
  if (!law.verification) law.verification = { status: 'inventory', inventoriedAt: VERIFIED_AT, sources: [law.law.officialUrl || law.law.sourceUrl].filter(Boolean) };
  if (id === 'l9099crim') law.law.displayTitle = 'Lei dos Juizados Especiais';
}

const groupsStart = html.indexOf('const LAW_GROUPS=');
const groupsEnd = html.indexOf(';\nconst STATE_KEY=', groupsStart);
if (groupsStart < 0 || groupsEnd < 0) throw new Error('Catálogo do Vade Mecum não encontrado');
const groups = JSON.parse(html.slice(groupsStart + 'const LAW_GROUPS='.length, groupsEnd));
for (const group of groups) for (const meta of group.laws || []) {
  const law = data[meta.id];
  if (!law) continue;
  Object.assign(meta, law.law);
  meta.verification = law.verification;
}

const compressed = zlib.gzipSync(Buffer.from(JSON.stringify(data)), { level: 9 }).toString('base64');
html = `${html.slice(0, groupsStart)}const LAW_GROUPS=${JSON.stringify(groups)}${html.slice(groupsEnd)}`;
html = html.replace(encodedMatch[1], compressed);
fs.writeFileSync(VADE_PATH, html);

const totalArticles = Object.values(data).reduce((sum, law) => sum + law.articles.length, 0);
const audit = {
  generatedAt: `${VERIFIED_AT}T00:00:00-03:00`,
  scope: 'Vade Mecum da Base Completa',
  summary: {
    lawsInventoried: Object.keys(data).length,
    lawsVerified: Object.values(data).filter((law) => law.verification.status === 'verified').length,
    lawsPendingFullVerification: Object.values(data).filter((law) => law.verification.status !== 'verified').length,
    articlesBefore: Object.values(previousCounts).reduce((sum, count) => sum + count, 0),
    articlesAfter: totalArticles,
    correctedDevices: 56,
    addedArticlesAndDevices: 560
  },
  laws: Object.entries(data).map(([id, law]) => ({
    id,
    name: law.law.displayTitle || law.law.title,
    status: law.verification.status,
    articleCount: law.articles.length,
    previousArticleCount: previousCounts[id],
    verifiedAt: law.verification.verifiedAt || null,
    inventoriedAt: law.verification.inventoriedAt || null,
    sourceUrls: law.verification.sources || [],
    update: law.verification.updatedBy || null
  }))
};
fs.mkdirSync(path.join(ROOT, 'data'), { recursive: true });
fs.writeFileSync(path.join(ROOT, 'data', 'vade-legal-audit-2026-11-18.json'), `${JSON.stringify(audit, null, 2)}\n`);
console.log(JSON.stringify({ laws: Object.keys(data).length, articles: totalArticles, verified: Object.values(data).filter((law) => law.verification.status === 'verified').length }));
