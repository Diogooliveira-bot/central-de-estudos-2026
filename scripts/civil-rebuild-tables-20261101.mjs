// Reconstrução editorial das tabelas de Civil que a importação gravou como texto de
// largura fixa (<pre class="civil-source-table">) com alinhamento irregular.
// Não muda palavras: transforma a diagramação em tabela/parágrafos HTML, remove apenas
// números de página do PDF ("Página N") e reúne a palavra partida "transmiss|ão".
// A conservação do texto é verificada (mesmo conjunto de palavras) antes de gravar.
// Uso: node scripts/civil-rebuild-tables-20261101.mjs [--write]
import fs from 'node:fs';
import vm from 'node:vm';
import zlib from 'node:zlib';

const FILE = 'content/civil/civil-native-content-packed.js';
const src = fs.readFileSync(FILE, 'utf8');
const sb = {}; sb.window = sb; vm.runInNewContext(src, sb);
const data = JSON.parse(zlib.gunzipSync(Buffer.from(sb.CIVIL_NATIVE_PACKED_B64, 'base64')).toString());

const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const decode = s => s.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&amp;/g, '&');
const table = (head, rows) => '<table class="cv-rebuilt-table"><thead><tr>' + head.map(h => '<th scope="col">' + esc(h) + '</th>').join('') +
  '</tr></thead><tbody>' + rows.map(r => '<tr>' + r.map(c => '<td>' + esc(c) + '</td>').join('') + '</tr>').join('') + '</tbody></table>';
const p = t => '<p>' + esc(t) + '</p>';
const strongP = (label, rest) => '<p><strong>' + esc(label) + '</strong>' + (rest ? ' ' + esc(rest) : '') + '</p>';

// ---- Tabelas (texto copiado do original, célula a célula) ----
const T = {
  m5_tempo: table(['Instituto', 'Quando ocorre', 'Efeito sobre o tempo anterior', 'Exemplo'], [
    ['Impedimento', 'A causa existe antes de o prazo começar', 'O prazo nem começa', 'Prazo ainda não vencido; condição suspensiva'],
    ['Suspensão', 'A causa surge depois de o prazo ter começado', 'Preserva o tempo já decorrido; depois continua do ponto em que parou', 'Hipótese legal superveniente dos arts. 197-200'],
    ['Interrupção', 'Incide uma causa do art. 202', 'Desconsidera o tempo anterior e reinicia a contagem', 'Ato inequívoco do devedor reconhecendo o direito']]),
  m5_prazos: table(['Prazo', 'Núcleo de incidência mais cobrado'], [
    ['1 ano', 'Pretensões específicas do §1º ainda vigentes, como certos honorários/emolumentos; atenção às revogações legislativas'],
    ['2 anos', 'Pretensões específicas previstas no §2º, especialmente prestações alimentares vencidas, a partir do vencimento'],
    ['3 anos', 'Aluguéis; enriquecimento sem causa; reparação civil extracontratual; outras hipóteses do §3º'],
    ['4 anos', 'Pretensão relativa à tutela, a partir da aprovação das contas'],
    ['5 anos', 'Cobrança de dívidas líquidas constantes de instrumento público ou particular; honorários de profissionais liberais nas hipóteses legais; despesas judiciais do vencedor'],
    ['10 anos', 'Regra residual do art. 205, inclusive, segundo jurisprudência consolidada do STJ, pretensões indenizatórias decorrentes de inadimplemento contratual quando não houver prazo especial']]),
  m5_confundir: table(['Par de institutos', 'Diferença decisiva'], [
    ['Prescrição x decadência', 'Prescrição atinge pretensão; decadência, em regra, direito potestativo sujeito a prazo.'],
    ['Impedimento x suspensão', 'No impedimento o prazo não começa; na suspensão ele já começou e fica paralisado.'],
    ['Suspensão x interrupção', 'Suspensão conserva o tempo já corrido; interrupção zera a contagem anterior e reinicia.'],
    ['Decadência legal x convencional', 'Legal: juiz conhece de ofício e renúncia é nula. Convencional: depende de alegação da parte; juiz não supre.'],
    ['Revogação x anulação da confissão', 'Confissão é irrevogável; erro de fato ou coação podem gerar anulação.'],
    ['Documento público x verdade absoluta', 'Fé pública qualifica o que o agente público atesta, mas não transforma toda declaração das partes em verdade material incontestável.']]),
  m5_criterio: table(['Critério', 'Prescrição', 'Decadência'], [
    ['Objeto típico', 'Pretensão', 'Direito potestativo'],
    ['Fonte do prazo', 'Lei', 'Lei ou convenção'],
    ['Alteração por acordo', 'Não', 'Pode existir decadência convencional, conforme autonomia privada'],
    ['Renúncia', 'Possível após consumada, sem prejuízo de terceiro', 'Legal: nula; convencional: depende do regime pactuado'],
    ['Reconhecimento de ofício', 'Admitido no processo, com contraditório', 'Legal: sim; convencional: não'],
    ['Suspensão/interrupção', 'Aplicam-se as causas legais', 'Em regra não; ressalvas legais, especialmente art. 208']]),
  m11_mapa: table(['Bloco', 'Pergunta-chave', 'Base legal'], [
    ['Conceito e teorias', 'O que transforma um poder de fato em posse juridicamente relevante?', 'CC 1.196'],
    ['Classificações', 'Qual é o tipo de posse e quais efeitos decorrem dessa qualificação?', 'CC 1.197-1.203'],
    ['Aquisição/transmissão', 'Quando nasce a posse e como passa a outra pessoa?', 'CC 1.204-1.209'],
    ['Proteção', 'Houve ameaça, turbação ou esbulho?', 'CC 1.210-1.213 + CPC 554-568'],
    ['Efeitos patrimoniais', 'Quem fica com frutos? Quem indeniza? Há retenção?', 'CC 1.214-1.222'],
    ['Perda', 'Quando a relação fática deixa de existir juridicamente?', 'CC 1.223-1.224']]),
  m11_situacoes: table(['Situação', 'Qualificação predominante', 'Efeito de prova'], [
    ['Empregado guarda bem do empregador sob ordens', 'Detenção dependente', 'Não exerce posse em nome próprio.'],
    ['Vizinho usa passagem por mera tolerância', 'Mera permissão/tolerância', 'Não nasce posse só por esse favor.'],
    ['Invasor mantém ocupação clandestina ainda não descoberta', 'Atos clandestinos ainda não autorizam aquisição da posse', 'O vício precisa cessar para início da relação possessória juridicamente considerada.'],
    ['Locatário recebe o imóvel por contrato', 'Posse direta', 'É possuidor; pode defender sua posse inclusive contra o possuidor indireto, conforme o caso.']]) +
    strongP('JURISPRUDÊNCIA-CHAVE') +
    p('O STJ reafirma que mera detenção não supre o requisito possessório para usucapião. Também admite, em hipóteses excepcionais, interversão de posse precária, desde que haja comportamento inequívoco e publicamente oponível que revele mudança da causa possessória; a simples passagem do tempo não basta.'),
  m11_benfeitorias: table(['Possuidor', 'Necessárias', 'Úteis', 'Voluptuárias', 'Retenção'], [
    ['Boa-fé', 'Indeniza', 'Indeniza', 'Pode levantar se não pagas e sem detrimento', 'Sim, necessárias + úteis'],
    ['Má-fé', 'Indeniza', 'Não', 'Não pode levantar', 'Não']]) +
    strongP('CAI MUITO') +
    p('Direito de retenção por benfeitorias pressupõe posse de boa-fé. O STJ reafirma que detentor — e, em especial, ocupante indevido de bem público — não pode invocar retenção como se possuidor fosse.'),
  m15_aceitacao: table(['Instituto', 'Forma', 'Efeito central'], [
    ['Aceitação', 'Expressa ou tácita', 'Consolida a aquisição hereditária'],
    ['Renúncia', 'Instrumento público ou termo judicial', 'Afasta o renunciante da sucessão'],
    ['Cessão de direitos hereditários', 'Negócio jurídico formal', 'Há transmissão pelo herdeiro após aquisição']]),
  m15_indignidade: table(['Ponto', 'Indignidade', 'Deserdação'], [
    ['Quem pode ser atingido', 'Herdeiro ou legatário', 'Herdeiro necessário'],
    ['Fonte', 'Lei', 'Testamento + causa legal'],
    ['Momento', 'Reconhecida após a abertura; art. 1.815-A cria exclusão imediata com condenação penal transitada em julgado', 'Causa declarada pelo testador e provada após a morte'],
    ['Efeito sobre descendentes', 'Efeitos pessoais; descendentes podem suceder como se o excluído fosse pré-morto', 'Mesma lógica de pessoalidade']])
};

// ---- Módulo 5: o bloco traz a teoria de 2.3 em diante; reconstruída em HTML. ----
function m5Rest(lines) {
  const out = [];
  let para = null, list = null;
  const flushPara = () => { if (para) { out.push(para.label ? strongP(para.label, para.text.join(' ')) : p(para.text.join(' '))); para = null; } };
  const flushList = () => { if (list) { out.push('<ul>' + list.map(li => '<li>' + esc(li) + '</li>').join('') + '</ul>'); list = null; } };
  const flush = () => { flushPara(); flushList(); };
  const LABEL = /^(ATENÇÃO:|ATUALIZAÇÃO:|NÃO CONFUNDIR:|REGRA DE BOLSO —|ARTIGOS PARA LEMBRAR —)\s*(.*)$/;
  const LAW = /^(Arts?\. [\d.,\-A–\s]+)$/;
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (/^\d+\. [A-ZÁÉÍÓÚÂÊÔÃÕÇ0-9 —-]+$/.test(line)) { flush(); out.push('<h2>' + esc(line) + '</h2>'); continue; }
    if (/^\d+\.\d+ \S/.test(line)) { flush(); out.push('<h3>' + esc(line) + '</h3>'); continue; }
    if (/^Caso \d+ — /.test(line)) { flush(); out.push(strongP(line)); continue; }
    if (LAW.test(line)) { flush(); para = { label: line, text: [] }; continue; }
    if (/^• /.test(line)) { flushPara(); (list = list || []).push(line.slice(2)); continue; }
    if (list && !para) { list[list.length - 1] += ' ' + line; continue; }
    const lab = line.match(LABEL);
    if (lab) { flush(); para = { label: lab[1], text: lab[2] ? [lab[2]] : [] }; continue; }
    const prev = para?.text[para.text.length - 1] || '';
    const newPara = !para || (/[.:;?!”)]$/.test(prev) && !/\b(?:arts?|n[ºo])\.$/i.test(prev) && /^[A-ZÁÉÍÓÚÂÊÔÃÕÇ“"]/.test(line) && !para.label?.startsWith('Art'));
    if (newPara) { flush(); para = { text: [line] }; } else para.text.push(line);
  }
  flush();
  return out.join('\n');
}

// Localiza o n-ésimo <pre class="civil-source-table"> do texto completo de um módulo.
function preAt(html, n) {
  const re = /<pre class="civil-source-table">([\s\S]*?)<\/pre>/g;
  let m, k = 0;
  while ((m = re.exec(html))) { if (k++ === n) return { start: m.index, end: m.index + m[0].length, text: decode(m[1]) }; }
  throw new Error('bloco não encontrado: ' + n);
}

const plan = [
  ['civil-m05', 0, text => {
    const lines = text.replace(/\r/g, '').split('\n').filter(l => l.trim() && !/^\s*Página \d+\s*$/.test(l));
    const firstProse = lines.findIndex(l => /^ Os arts\. 197 a 201/.test(l));
    const prazos = lines.findIndex(l => /^\s+Prazo\s{2,}Núcleo/.test(l));
    const criterio = lines.findIndex(l => /^\s+Critério\s{2,}Prescrição/.test(l));
    const s26 = lines.findIndex(l => /^ 2\.6 Prova no Código Civil/.test(l));
    const afterPrazos = lines.findIndex(l => /^ O art\. 206-A/.test(l));
    const confundir = lines.findIndex(l => /^\s+Par de institutos\s{2,}Diferença/.test(l));
    const pegadinhas = lines.findIndex(l => /^ 6\. PEGADINHAS DE PROVA/.test(l));
    if ([firstProse, prazos, afterPrazos, criterio, s26, confundir, pegadinhas].some(x => x < 0) || !(afterPrazos < criterio && criterio < s26 && s26 < confundir)) throw new Error('M05: marcos não encontrados');
    return T.m5_tempo + '\n' + m5Rest(lines.slice(firstProse, prazos)) + '\n' + T.m5_prazos + '\n' +
      m5Rest(lines.slice(afterPrazos, criterio)) + '\n' + T.m5_criterio + '\n' + m5Rest(lines.slice(s26, confundir)) + '\n' + T.m5_confundir + '\n' + m5Rest(lines.slice(pegadinhas));
  }],
  ['civil-m11', 0, () => T.m11_mapa],
  ['civil-m11', 1, () => T.m11_situacoes],
  ['civil-m11', 4, () => T.m11_benfeitorias],
  ['civil-m15', 0, () => T.m15_aceitacao],
  ['civil-m15', 1, () => T.m15_indignidade]
];

const words = t => t.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().split(' ').filter(Boolean).sort().join(' ');
const report = [];
// Aplica de trás para frente em cada módulo para preservar os índices dos blocos.
const byModule = {};
for (const [mod, n, build] of plan) (byModule[mod] = byModule[mod] || []).push([n, build]);
for (const [mod, items] of Object.entries(byModule)) {
  let html = data[mod].completeHtml;
  for (const [n, build] of items.sort((a, b) => b[0] - a[0])) {
    const block = preAt(html, n);
    const rebuilt = build(block.text);
    // Conservação: mesmas palavras, exceto "Página N" e a palavra reunida "transmiss|ão".
    // Exceções declaradas: número de página do PDF, cabeçalho de tabela repetido após a
    // quebra de página, marcador "•" (vira item de lista) e a palavra reunida "transmissão".
    const DUP_HEADERS = { 'civil-m05': ['Instituto Quando ocorre Efeito sobre o tempo anterior Exemplo', 'Par de institutos Diferença decisiva'], 'civil-m15': ['Ponto Indignidade Deserdação'] };
    let cleaned = block.text.replace(/^\s*Página \d+\s*$/gm, '').replace(/transmiss\s*\n\s*ão/, 'transmissão').replace(/•/g, ' ');
    let pool = words(cleaned).split(' ');
    for (const h of n === (mod === 'civil-m15' ? 1 : 0) ? (DUP_HEADERS[mod] || []) : []) for (const w of h.split(' ')) { const i = pool.indexOf(w); if (i >= 0) pool.splice(i, 1); }
    // Palavra partida pela diagramação: "Aquisição/transmiss" + "ão" = "Aquisição/transmissão".
    for (const [head, tail, whole] of [['Aquisição/transmiss', 'ão', 'Aquisição/transmissão'], ['Suspensão/interrupçã', 'o', 'Suspensão/interrupção']]) {
      const a = pool.indexOf(head), b = pool.indexOf(tail);
      if (a >= 0 && b >= 0) { pool.splice(Math.max(a, b), 1); pool.splice(Math.min(a, b), 1); pool.push(whole); pool.sort(); }
    }
    const before = pool.join(' ');
    const after = words(decode(rebuilt));
    if (before !== after) {
      const a = before.split(' '), b = after.split(' ');
      const miss = a.filter(w => { const i = b.indexOf(w); if (i < 0) return true; b.splice(i, 1); return false; });
      throw new Error(mod + ' bloco ' + n + ': texto diverge. Faltando: ' + miss.slice(0, 15).join(' | ') + ' · Sobrando: ' + b.slice(0, 15).join(' | '));
    }
    html = html.slice(0, block.start) + rebuilt + html.slice(block.end);
    report.push(mod + ' bloco ' + n + ': ' + before.split(' ').length + ' palavras conservadas');
  }
  data[mod].completeHtml = html;
}
console.log(report.join('\n'));
if (process.env.SHOW) fs.writeFileSync(process.env.SHOW, data['civil-m05'].completeHtml);
if (process.argv.includes('--write')) {
  const packed = zlib.gzipSync(Buffer.from(JSON.stringify(data)), { level: 9 }).toString('base64');
  fs.writeFileSync(FILE, 'window.CIVIL_NATIVE_PACKED_B64="' + packed + '";');
  console.log('gravado em', FILE);
}
