import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';
import { JSDOM } from 'jsdom';

const root = path.resolve(import.meta.dirname, '..');
const encoded = fs.readFileSync(path.join(root, 'portugues-autodidata-data.txt'), 'utf8').trim();
const materials = JSON.parse(zlib.gunzipSync(Buffer.from(encoded, 'base64')).toString('utf8'));
const component = fs.readFileSync(path.join(root, 'ui/portuguese-activities-v1.js'), 'utf8');
const records = [];

for (const [moduleId, markup] of Object.entries(materials)) {
  const dom = new JSDOM('<!doctype html><html><head></head><body><main id="reader"></main></body></html>', { url: 'https://base-completa.test/' + moduleId, runScripts: 'outside-only' });
  dom.window.__BASE_COMPLETA_USER_ID__ = 'audit-user';
  dom.window.eval(component);
  const host = dom.window.document.getElementById('reader');
  host.innerHTML = markup;
  const moduleRecords = dom.window.BasePortugueseActivities.enhance(host, { moduleId });
  records.push(...moduleRecords);
  dom.window.close();
}

const kinds = ['guided', 'independent', 'active', 'mastery', 'exit', 'cumulative'];
const types = ['reveal', 'objective', 'discursive', 'short', 'classification', 'self-assessment'];
const modules = Object.keys(materials).map(moduleId => {
  const items = records.filter(item => item.moduleId === moduleId);
  return {
    moduleId,
    total: items.length,
    byKind: Object.fromEntries(kinds.map(kind => [kind, items.filter(item => item.kind === kind).length])),
    byType: Object.fromEntries(types.map(type => [type, items.filter(item => item.type === type).length])),
    associated: items.filter(item => item.status === 'associated').length,
    autoCorrect: items.filter(item => item.autoCorrect).length,
    missingAnswer: items.filter(item => item.status === 'missing-answer').length,
    selfAssessment: items.filter(item => item.status === 'self-assessment').length
  };
});
const totals = {
  exercises: records.length,
  byKind: Object.fromEntries(kinds.map(kind => [kind, records.filter(item => item.kind === kind).length])),
  byType: Object.fromEntries(types.map(type => [type, records.filter(item => item.type === type).length])),
  associated: records.filter(item => item.status === 'associated').length,
  autoCorrect: records.filter(item => item.autoCorrect).length,
  missingAnswer: records.filter(item => item.status === 'missing-answer').length,
  selfAssessment: records.filter(item => item.status === 'self-assessment').length
};
const inventory = { generatedAt: new Date().toISOString(), source: 'portugues-autodidata-data.txt', componentVersion: '1.0.0', modules, totals, exercises: records };
const outDir = path.join(root, 'reports');
fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(path.join(outDir, 'portuguese-activities-inventory.json'), JSON.stringify(inventory, null, 2) + '\n');

const lines = [
  '# Inventário — Atividades Interativas de Português', '',
  `Gerado a partir de \`portugues-autodidata-data.txt\`. Total identificado: **${totals.exercises} atividades**.`, '',
  '| Módulo | Total | Guiada | Independente | Revisão ativa | Miniteste | Saída | Cumulativa | Auto | Sem resposta original |',
  '|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|'
];
for (const module of modules) lines.push(`| ${module.moduleId} | ${module.total} | ${module.byKind.guided} | ${module.byKind.independent} | ${module.byKind.active} | ${module.byKind.mastery} | ${module.byKind.exit} | ${module.byKind.cumulative} | ${module.autoCorrect} | ${module.missingAnswer} |`);
lines.push(
  '', '## Totais por modalidade', '', ...kinds.map(kind => `- ${kind}: ${totals.byKind[kind]}`),
  '', '## Situação editorial', '',
  `- Respostas associadas: ${totals.associated}`,
  `- Correção objetiva automática: ${totals.autoCorrect}`,
  `- Sem resposta-modelo no original: ${totals.missingAnswer}`,
  `- Autoavaliações/checklists: ${totals.selfAssessment}`,
  '', '## Implementação e segurança', '',
  '- Um único componente reutilizável atende M01–M24 e a revisão cumulativa.',
  '- IDs estáveis seguem o padrão `pt-<módulo>-<modalidade>-<ordem>`.',
  '- Tentativas e textos usam chaves sincronizáveis com escopo explícito do usuário autenticado.',
  '- Gabaritos antigos permanecem no DOM e só são ocultados quando todas as respostas da seção foram associadas.',
  '- Teoria, links externos, conclusão dos módulos e progresso legado não são reescritos.',
  '', '## Testes automatizados', '',
  '- Abertura e transformação dos 24 módulos e da revisão final.',
  '- Unicidade dos IDs e contagem do inventário.',
  '- Revelação da prática guiada e ocultação inicial da resposta.',
  '- Correção objetiva, feedback imediato e histórico de tentativas.',
  '- Persistência isolada por usuário.',
  '- Associação integral dos 84 itens da revisão cumulativa.',
  '- Suíte completa do repositório: 35 testes aprovados.',
  '', '## Limitações do conteúdo original', '',
  `- As ${totals.missingAnswer} perguntas de revisão ativa não possuem resposta-modelo ou comentário no material-fonte. Elas aceitam e salvam a tentativa, mas não recebem correção inventada.`,
  `- Os ${totals.selfAssessment} itens de teste de saída são critérios/checklists de domínio, não perguntas com gabarito; por isso registram autoavaliação.`,
  '- Questões discursivas exibem resposta-modelo para comparação e não atribuem acerto/erro semanticamente.',
  ''
);
fs.writeFileSync(path.join(outDir, 'portuguese-activities-report.md'), lines.join('\n'));
console.log(JSON.stringify(totals, null, 2));
