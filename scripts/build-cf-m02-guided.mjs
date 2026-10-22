import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';
import { renderGuidedM01 } from './render-cf-m01-guided.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = p => fs.readFileSync(path.join(root, p), 'utf8');
const window = {};
vm.runInNewContext(read('content/cf/m02-native-data.js'), {window});
const module = window.BASE_NATIVE_CONTENT.cf.m02;
const complete = module.complete;

const specs = [
  ['Direitos fundamentais e suas características','Direitos, garantias, dimensões e características','Direitos indicam o bem protegido; garantias tornam sua proteção efetiva.', 'O art. 5º reúne direitos e garantias, mas o catálogo constitucional é aberto e seus limites precisam ser justificados.', '“Se um direito é relativo, a Administração pode proibir qualquer crítica.” Errado: limites exigem base jurídica e compatibilidade constitucional.', 'Direito é o bem protegido; garantia é o instrumento. Relatividade não significa ausência de proteção.'],
  ['Aplicação dos direitos e tratados de direitos humanos','Eficácia subjetiva, objetiva, vertical e horizontal','Direitos fundamentais orientam tanto pretensões individuais quanto o funcionamento do sistema.', 'O art. 5º, §§ 1º a 3º, combina aplicação imediata, catálogo aberto e rito qualificado para tratados de direitos humanos.', '“Aplicação imediata torna toda norma completa e dispensa regulamentação.” Errado: efetividade e regulamentação podem coexistir.', 'Subjetiva: o que o titular exige. Objetiva: como o sistema deve proteger. Tratado qualificado equivale a emenda.'],
  ['Titulares, igualdade e legalidade','Quem titulariza direitos e como a igualdade funciona','Titularidade, igualdade e legalidade dependem do direito analisado e de suas condições.', 'O caput e os incisos do art. 5º protegem brasileiros e estrangeiros sob jurisdição brasileira; igualdade formal não elimina a análise material.', '“Legalidade geral e reserva legal específica são a mesma exigência.” Errado: a extensão da reserva muda conforme o tema.', 'Pergunte quem é titular, qual desigualdade existe e qual espécie de reserva legal incide.'],
  ['Vida, liberdade e personalidade','Expressão, crença, intimidade, honra e locomoção','Liberdades convivem com personalidade, igualdade e proteção contra abusos.', 'O art. 5º protege vida, liberdade de expressão, crença, intimidade, honra, imagem e locomoção, com condições e responsabilidades.', '“Anonimato e sigilo da fonte são equivalentes.” Errado: são institutos diferentes e produzem consequências distintas.', 'Liberdade não é licença para violar honra, imagem ou privacidade. Classifique o conflito antes de concluir.'],
  ['Inviolabilidade do domicílio','Consentimento, mandado, flagrante, desastre e socorro','O fundamento do ingresso e o horário são perguntas diferentes.', 'Art. 5º, XI: mandado judicial durante o dia; flagrante, desastre e socorro são exceções autônomas. O Tema 280 exige razões anteriores.', '“A descoberta do ilícito depois da entrada cria o fundamento que faltava.” Errado: a justificativa posterior deve explicar razões prévias.', 'Domicílio: fundamento primeiro; horário depois. Busca válida exige respeitar ambos.'],
  ['Sigilos e proteção de dados','Comunicação em curso, dados armazenados e registros','O objeto do sigilo define a proteção e o regime jurídico aplicável.', 'O art. 5º, XII, protege comunicações e dados; não trate interceptação, mensagem guardada e registro como sinônimos.', '“Todo sigilo é interceptação telefônica.” Errado: identifique o objeto e o momento da captação.', 'Interceptação capta conversa em curso. Dados guardados e registros exigem classificação própria.'],
  ['Reunião e associação','Liberdade coletiva, aviso, autonomia e dissolução','Reunião e associação protegem formas coletivas diferentes.', 'Reunião exige fins pacíficos, sem armas, local aberto, prévio aviso e ausência de frustração de reunião anterior; associação tem regime próprio.', '“Aviso prévio é uma licença administrativa.” Errado: aviso informa; não transforma a reunião em atividade dependente de autorização.', 'Reunião é episódica; associação é organização estável. Suspensão e dissolução não têm o mesmo requisito.'],
  ['Propriedade e segurança jurídica','Função social, intervenção estatal e direito adquirido','Propriedade é protegida, mas cumpre função social e convive com intervenções constitucionais.', 'Desapropriação e requisição têm pressupostos e indenizações distintos; direito adquirido não se confunde com expectativa.', '“Toda intervenção no bem particular é desapropriação.” Errado: perigo público iminente pode caracterizar requisição.', 'Compare sempre motivo, titularidade, transferência, momento e indenização.'],
  ['Acesso à justiça e garantias processuais','Devido processo, contraditório, defesa, provas e publicidade','Garantias processuais organizam um procedimento justo, não apenas uma decisão final.', 'O art. 5º, XXXV a LVI, protege acesso à justiça, juiz natural, devido processo, contraditório, ampla defesa e provas lícitas.', '“Contraditório é apenas receber uma intimação.” Errado: envolve informação e possibilidade real de influência.', 'Devido processo é o conjunto; contraditório informa e permite influenciar; defesa usa meios juridicamente admitidos.'],
  ['Garantias penais e direitos do preso','Legalidade, penas, presunção, prisão e integridade','A resposta penal constitucional depende de legalidade, necessidade e proteção da pessoa presa.', 'O art. 5º diferencia fiança, prescrição, prisão cautelar, prisão civil e execução da condenação; a SV 25 afasta depositário infiel.', '“Crime inafiançável é sempre imprescritível e exige prisão.” Errado: fiança, prescrição e necessidade da prisão são perguntas diferentes.', 'Classifique a prisão e o efeito jurídico antes de aplicar qualquer rótulo penal.'],
  ['Petição, certidões e informação','Providência, documento e conhecimento de dados públicos','O pedido concreto indica o instrumento constitucional de partida.', 'O art. 5º, XXXIV e XXXIII, separa petição, certidão, informação pública e acesso a dados próprios.', '“Toda informação em poder do Estado pode ser pedida por habeas data.” Errado: HD tem objeto pessoal e requisitos próprios.', 'Petição provoca; certidão documenta; informação esclarece; HD trata de dados pessoais do impetrante.'],
  ['Remédios constitucionais','Escolha do instrumento pelo bem jurídico','A sigla correta é consequência da análise do direito, do ato e da prova.', 'HC protege locomoção; HD dados pessoais; MS direito líquido e certo; MI omissão normativa; ação popular ato lesivo com legitimidade própria.', '“Qualquer ilegalidade cabe em mandado de segurança.” Errado: o remédio é residual e exige direito líquido e certo.', 'Comece pelo bem jurídico, depois conduta/omissão, legitimidade e prova disponível.'],
];

function tableLines(text) {
  const lines = text.split('\n');
  return lines.map(line => {
    if (!/\S {3,}\S/.test(line) || /^\s*(Fonte oficial|https?:)/.test(line)) return line;
    const cells = line.trim().split(/ {3,}/).map(c => c.trim()).filter(Boolean);
    return cells.length >= 2 ? '| ' + cells.join(' | ') + ' |' : line;
  }).join('\n');
}

function headingPositions() {
  const out = [];
  const re = /^(\d+)\. ([^\n]+)$/gm;
  let match;
  while ((match = re.exec(complete))) {
    const number = Number(match[1]);
    if (number >= 1 && number <= 12 && match[2] === match[2].toUpperCase()) out.push({number, title: match[2], start: match.index, end: re.lastIndex});
  }
  return out;
}

const topics = headingPositions();
if (topics.length !== 12) throw new Error(`Esperados 12 temas, encontrados ${topics.length}`);
const firstTopic = topics[0].start;
const lawStart = complete.indexOf('\n13. LEI SECA E JURISPRUDÊNCIA EXPLICADAS');
const reviewStart = complete.indexOf('\n14. REVISÃO ATIVA');
const checklistStart = complete.indexOf('\nCHECKLIST DE DOMÍNIO');
const referencesStart = complete.indexOf('\n15. REFERÊNCIAS E FONTES DE CONSULTA');
if ([lawStart, reviewStart, checklistStart, referencesStart].some(v => v < 0)) throw new Error('Seções finais do M02 não encontradas');

const intro = complete.slice(0, firstTopic).replace(/^LEITURA ORIENTADA\s*\n/, '').replace(/\nPERCURSO DO MÓDULO[\s\S]*$/, '').trim();
const percurso = complete.slice(complete.indexOf('PERCURSO DO MÓDULO') + 'PERCURSO DO MÓDULO'.length, firstTopic).trim();
let source = '# Leitura orientada\n\n' + intro + '\n\n# Percurso do módulo\n\n' + percurso + '\n\n';
for (let i = 0; i < topics.length; i++) {
  const current = topics[i];
  const next = topics[i + 1]?.start ?? lawStart;
  const body = complete.slice(current.end, next).trim();
  source += `# ${current.number}. ${specs[i][0]}\n\n${tableLines(body)}\n\n`;
}
source += '# 13. Lei seca\n\n' + tableLines(complete.slice(lawStart + 1, reviewStart).trim()) + '\n\n';
source += '# 14. Revisão ativa\n\n' + complete.slice(reviewStart + 1, checklistStart).trim() + '\n\n';
const checklist = complete.slice(checklistStart + 1, referencesStart).trim().split('\n').filter(line => line.trim().startsWith('• ☐')).map(line => '- [ ] ' + line.replace(/^\s*• ☐\s*/, '').trim()).join('\n');
const references = complete.slice(referencesStart + 1).trim();
source += '# 15. Referências\n\n' + references + '\n\n# Checklist de domínio\n\n' + checklist + '\n';

const html = renderGuidedM01({
  source,
  module,
  css: read('content/cf/editorial/guided-m02.css'),
  config: {
    code: 'M02',
    title: 'Direitos e deveres individuais e coletivos',
    subtitle: 'Teoria guiada + revisão inteligente. Entenda o art. 5º por casos, requisitos, exceções e instrumentos de proteção.',
    introCopy: 'O mesmo conteúdo do M02 agora está organizado em blocos de aprendizagem e revisão, com tabelas responsivas e marcações independentes.',
    storage: 'basecompleta-cf-m02-guiada-v2',
    topicWord: 'temas orientados',
    specs,
    sections: {intro:'# Leitura orientada', percurso:'# Percurso do módulo', law:'# 13. Lei seca', lawEnd:'# 14. Revisão ativa', review:'# 14. Revisão ativa', reviewEnd:'# 15. Referências', references:'# 15. Referências', referencesEnd:'# Checklist de domínio'},
    questionTitle: 'Dez questões de aplicação · 4F / 4M / 2D',
    reviewTitle: 'Cinco questões de revisão · 2F / 2M / 1D',
    pairs: [['Direito × garantia','Bem jurídico protegido × instrumento de proteção.'],['Subjetiva × objetiva','Pretensão do titular × orientação de toda a ordem jurídica.'],['Vertical × horizontal','Indivíduo e Estado × relações entre particulares.'],['Reunião × associação','Encontro episódico × organização estável.'],['Desapropriação × requisição','Intervenção com pressupostos e indenização próprios.'],['Fiança × prescrição','Regimes diferentes que não se confundem.'],['HC × HD','Locomoção × dados pessoais do impetrante.'],['MS × MI','Ato ilegal com prova pré-constituída × omissão normativa impeditiva.']],
    essential: 'Comece pelo direito atingido. Verifique titular, destinatário, conduta ou omissão, requisitos e exceções. Domicílio exige fundamento e horário; reunião exige aviso, não licença; desapropriação e requisição têm regimes distintos; fiança, prescrição e prisão são perguntas diferentes; remédio constitucional se escolhe pelo bem jurídico.',
  },
});

const out = process.env.CF_M02_OUTPUT_DIR;
if (out) {
  fs.mkdirSync(out, {recursive:true});
  fs.writeFileSync(path.join(out, 'CF-M02-Apostila-didatica-interativa.html'), html);
  fs.writeFileSync(path.join(out, 'CF-M02-Teoria-completa.txt'), module.complete);
  fs.writeFileSync(path.join(out, 'CF-M02-Teoria-resumida.txt'), module.summary);
  fs.writeFileSync(path.join(out, 'CF-M02-Fonte-editorial-normalizada.md'), source);
}
console.log(JSON.stringify({completeChars:module.complete.length,summaryChars:module.summary.length,topics:topics.length,completeQuestions:module.questions.complete.length,summaryQuestions:module.questions.summary.length,output:out||'guided html only'}));
