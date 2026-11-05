// Correção editorial V2: parágrafos, tabelas, siglas e "Entenda o termo" (sem alterar o texto).
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { JSDOM } from 'jsdom';

const read = f => readFileSync(new URL('../' + f, import.meta.url), 'utf8');
function setup(html = '') {
  const dom = new JSDOM('<!doctype html><body>' + html + '</body>', { runScripts: 'outside-only', pretendToBeVisual: true });
  const w = dom.window;
  w.MutationObserver = class { observe() {} };
  w.requestAnimationFrame = f => f();
  for (const f of ['ui/universal-reader-v1.js', 'ui/acronyms-v1.js', 'ui/editorial-reading-v2.js']) w.eval(read(f));
  return w;
}
const words = t => t.split(/\s+/).filter(Boolean).join(' ');

test('leitor universal une as linhas do parágrafo por espaço e preserva hífen de palavra composta', () => {
  const w = setup();
  const { reflow } = w.CentralUniversalReader;
  assert.equal(reflow(['A sentença de mérito transitada', 'em julgado faz coisa julgada.']), 'A sentença de mérito transitada em julgado faz coisa julgada.');
  assert.equal(reflow(['fase pré-', 'processual']), 'fase pré-processual');
  assert.equal(reflow(['art. 5º, ', '  XXXVI']), 'art. 5º, XXXVI');
  const css = read('ui/universal-reader-v1.css');
  assert.doesNotMatch(css, /\.bc-universal-projection (?:p|li)\{white-space:pre-wrap/);
  assert.doesNotMatch(css + read('ui/reader-standard-v1.js'), /hyphens:\s*auto/, 'hifenização automática desligada');
});

test('parágrafo cortado no meio da frase é reunido sem mudar o texto; parágrafos legítimos ficam', () => {
  const w = setup('<div class="cv-reader"><article>' +
    '<p>A pessoa jurídica de direito privado começa a existir com o registro dos atos</p><p>constitutivos no registro peculiar.</p>' +
    '<p>Fim de frase correto.</p><p>novo parágrafo com minúscula depois de ponto.</p>' +
    '<p class="lead">Título destacado sem ponto</p><p>continuação não é unida a elementos com classe</p></article></div>');
  const a = w.document.querySelector('article');
  const before = words(a.textContent);
  w.CentralEditorialReading.process(a);
  const ps = [...a.querySelectorAll('p')].map(p => p.textContent);
  assert.equal(ps[0], 'A pessoa jurídica de direito privado começa a existir com o registro dos atos constitutivos no registro peculiar.');
  assert.equal(ps.length, 5);
  assert.equal(words(a.textContent).replace(/\s/g, ''), before.replace(/\s/g, ''), 'nenhuma palavra perdida');
});

test('tabela simples recebe rótulos de coluna para os cartões; tabela mesclada não', () => {
  const w = setup('<div class="cv-reader"><article>' +
    '<table id="s"><thead><tr><th>Dispositivo</th><th>Regra</th><th>Pegadinha</th></tr></thead><tbody>' +
    '<tr><td>CC, arts. 3º e 4º</td><td>Regime atual de incapacidade</td><td>A deficiência, isoladamente, não gera incapacidade</td></tr>' +
    '<tr><td>CC, art. 2º</td><td>Nascituro</td><td>Direitos a salvo desde a concepção</td></tr></tbody></table>' +
    '<table id="c"><tr><th colspan="2">Quadro</th></tr><tr><td>a</td><td>b</td></tr></table></article></div>');
  w.CentralEditorialReading.process(w.document.querySelector('article'));
  const simple = w.document.getElementById('s');
  assert.ok(simple.classList.contains('bc-tcards'));
  const cells = [...simple.tBodies[0].rows[0].cells].map(c => [c.dataset.label, c.textContent]);
  assert.deepEqual(cells, [['Dispositivo', 'CC, arts. 3º e 4º'], ['Regra', 'Regime atual de incapacidade'], ['Pegadinha', 'A deficiência, isoladamente, não gera incapacidade']]);
  const complex = w.document.getElementById('c');
  assert.equal(complex.classList.contains('bc-tcards'), false, 'tabela com mescla não vira cartão');
  for (const t of [simple, complex]) {
    assert.ok(t.parentElement.classList.contains('bc-table-scroll'));
    assert.equal(t.parentElement.getAttribute('role'), 'region');
    assert.equal(t.parentElement.tabIndex, 0, 'rolagem acessível por teclado');
  }
});

test('tabela importada como texto de largura fixa vira tabela sem perder palavras', () => {
  const text = [
    '  Categoria                      Quem integra                         Ponto de prova',
    '  Direito público interno        União, Estados, Distrito Federal,    Art. 41.',
    '                                 Territórios e Municípios',
    '  Direito público externo        Estados estrangeiros                 Art. 42.',
    ' 2. TEORIA COMPLETA',
    ' Texto que segue a tabela.'
  ].join('\n');
  const w = setup('<div class="cv-reader"><article><pre class="civil-source-table"></pre></article></div>');
  const pre = w.document.querySelector('pre'); pre.textContent = text;
  const data = JSON.parse(JSON.stringify(w.CentralEditorialReading.fixedWidthTable(pre)));
  assert.deepEqual(data.labels, ['Categoria', 'Quem integra', 'Ponto de prova']);
  assert.deepEqual(data.rows[0], ['Direito público interno', 'União, Estados, Distrito Federal, Territórios e Municípios', 'Art. 41.']);
  assert.equal(data.rows.length, 2);
  assert.match(data.rest, /2\. TEORIA COMPLETA/);
  w.CentralEditorialReading.process(w.document.querySelector('article'));
  const table = w.document.querySelector('table.bc-rebuilt-table');
  assert.ok(table && pre.hidden);
  assert.equal(table.tHead.rows[0].cells.length, 3);
  assert.match(w.document.querySelector('article').textContent, /Texto que segue a tabela\./, 'texto após a tabela preservado');
});

test('bloco de uma coluna (lista do Word) vira itens, com o marcador U+F0B7 exibido como •', () => {
  const w = setup('<div class="cv-reader"><article><pre class="civil-source-table"></pre></article></div>');
  w.document.querySelector('pre').textContent = '       Faixa normativa: CC, arts. 104 a 184.\n       Risco máximo: nulidade x anulabilidade; fraude contra credores x\n       simulação.';
  w.CentralEditorialReading.process(w.document.querySelector('article'));
  const items = [...w.document.querySelectorAll('.bc-rebuilt-list li')].map(li => li.textContent);
  assert.deepEqual(items, ['Faixa normativa: CC, arts. 104 a 184.', 'Risco máximo: nulidade x anulabilidade; fraude contra credores x simulação.']);
  assert.doesNotMatch(w.document.body.innerHTML.replace(/<pre[\s\S]*?<\/pre>/, ''), //);
});

test('siglas: primeira ocorrência por extenso; depois, sigla acessível por toque e teclado', () => {
  const w = setup('<div class="bc-native-reader-overlay"><article class="bc-native-article"><p>O STF julgou a ADI. Depois, o STF reafirmou.</p></article></div>');
  w.CentralAcronyms.process(w.document.querySelector('article'));
  const p = w.document.querySelector('p');
  assert.match(p.textContent, /^O Supremo Tribunal Federal \(STF\) julgou a Ação Direta de Inconstitucionalidade \(ADI\)\. Depois, o STF reafirmou\.$/);
  const later = [...p.querySelectorAll('abbr.bc-acr')].pop();
  assert.equal(later.tabIndex, 0);
  assert.equal(later.getAttribute('role'), 'button');
  assert.equal(later.getAttribute('aria-label'), 'STF: Supremo Tribunal Federal');
  later.dispatchEvent(new w.MouseEvent('click', { bubbles: true }));
  assert.match(w.document.querySelector('.bc-acr-tip')?.textContent || '', /STF — Supremo Tribunal Federal/);
  w.document.dispatchEvent(new w.KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
  assert.equal(w.document.querySelector('.bc-acr-tip'), null);
  later.dispatchEvent(new w.KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
  assert.ok(w.document.querySelector('.bc-acr-tip'), 'Enter também abre o significado');
});

test('siglas ambíguas só são explicadas quando o próprio texto define o sentido', () => {
  const run = html => {
    const w = setup('<div class="bc-native-reader-overlay"><article class="bc-native-article">' + html + '</article></div>');
    w.CentralAcronyms.process(w.document.querySelector('article'));
    return w.document.querySelector('article');
  };
  assert.match(run('<p>O Presidente pode editar MP com força de lei; a medida provisória perde eficácia.</p>').textContent, /Medida Provisória \(MP\)/);
  assert.match(run('<p>O MP oferece a denúncia na ação penal pública.</p>').textContent, /Ministério Público \(MP\)/);
  const both = run('<p>O MP pode questionar a medida provisória e oferecer denúncia.</p>');
  assert.equal(both.querySelector('abbr'), null, 'sentido duplo no mesmo texto: não arrisca');
  assert.equal(run('<p>Processo nº 0001234-56.2026.8.06.0001; art. 5º, LXIX; REsp 1.234.567/SP.</p>').textContent, 'Processo nº 0001234-56.2026.8.06.0001; art. 5º, LXIX; Recurso Especial (REsp) 1.234.567/SP.');
  const link = run('<p><a href="/x">STF</a> e <code>CPC</code>.</p>');
  assert.equal(link.querySelector('a').textContent, 'STF', 'links não mudam');
  assert.equal(link.querySelector('code').textContent, 'CPC', 'código não muda');
});

test('Entenda o termo: primeira ocorrência marcada e explicação por toque e teclado', () => {
  const w = setup('<div class="bc-native-reader-overlay"><article class="bc-native-article"><h2>Prescrição</h2><p>A prescrição atinge a pretensão. Outra prescrição.</p><p>O nascituro tem direitos.</p><p><a href="#">preclusão</a></p></article></div>');
  const original = w.document.querySelector('article').textContent;
  w.CentralEditorialReading.process(w.document.querySelector('article'));
  const terms = [...w.document.querySelectorAll('.bc-term')];
  assert.deepEqual(terms.map(t => t.dataset.term), ['prescrição', 'nascituro'], 'só a primeira ocorrência, fora de títulos e links');
  assert.equal(terms[0].getAttribute('role'), 'button');
  assert.equal(terms[0].tabIndex, 0);
  terms[1].dispatchEvent(new w.KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
  const pop = w.document.querySelector('.bc-term-pop');
  assert.match(pop.textContent, /Significado simples:.*concebido/);
  assert.match(pop.textContent, /Explicação jurídica:.*art\. 2º/);
  assert.match(pop.textContent, /não substitui a apostila/);
  w.document.dispatchEvent(new w.KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
  assert.equal(w.document.querySelector('.bc-term-pop'), null);
  assert.equal(w.document.querySelector('article').textContent, original, 'texto idêntico');
});

test('módulo editorial carregado na Central e no pacote offline com versões novas', () => {
  const boot = read('central-v119.html');
  assert.match(boot, /ui\/acronyms-v1\.js\?v=20261105fasea1'\)\+tag\('ui\/editorial-reading-v2\.js\?v=20261105fasea1'\)/);
  assert.match(read('index.html'), /ui\/universal-reader-v1\.js\?v=20261105teorias1/);
  const offline = JSON.parse(read('central-offline-files-v66172.json')).files;
  assert.ok(offline.includes('/ui/universal-reader-v1.js?v=20261105teorias1'));
});

test('alerta ou dispositivo continuado na linha seguinte forma um só parágrafo', () => {
  const lines = ['TEORIA', ...Array.from({ length: 6 }, (_, i) => 'Parágrafo de contexto número ' + i + ' com texto suficiente para a projeção.'), '',
    'PEGADINHA - “Não foram encontrados bens da empresa, logo cabe desconsideração.” Errado. A falta de',
    'bens pode motivar investigação, mas não substitui a prova de desvio de finalidade.', '',
    'Art. 50. Em caso de abuso da personalidade jurídica, caracterizado pelo desvio de finalidade',
    'ou pela confusão patrimonial, pode o juiz desconsiderá-la.'];
  const w = setup('<div class="cv-reader"><article><pre></pre></article></div>');
  const pre = w.document.querySelector('pre'); pre.textContent = lines.join('\n');
  assert.ok(w.CentralUniversalReader.formatRaw(pre));
  const law = [...w.document.querySelectorAll('.bc-universal-projection p.bc-universal-law')].map(p => p.textContent);
  assert.deepEqual(law, [
    'PEGADINHA - “Não foram encontrados bens da empresa, logo cabe desconsideração.” Errado. A falta de bens pode motivar investigação, mas não substitui a prova de desvio de finalidade.',
    'Art. 50. Em caso de abuso da personalidade jurídica, caracterizado pelo desvio de finalidade ou pela confusão patrimonial, pode o juiz desconsiderá-la.'
  ]);
});

test('tabelas de Civil reconstruídas no material (M05, M11, M15) sem bloco de largura fixa', async () => {
  const vm = await import('node:vm'); const zlib = await import('node:zlib');
  const sb = {}; sb.window = sb; vm.runInNewContext(read('content/civil/civil-native-content-packed.js'), sb);
  const data = JSON.parse(zlib.gunzipSync(Buffer.from(sb.CIVIL_NATIVE_PACKED_B64, 'base64')).toString());
  const tables = mod => (data[mod].completeHtml.match(/<table class="cv-rebuilt-table">/g) || []).length;
  assert.equal(tables('civil-m05'), 4);
  assert.equal(tables('civil-m11'), 3);
  assert.equal(tables('civil-m15'), 2);
  assert.doesNotMatch(data['civil-m05'].completeHtml, /<pre class="civil-source-table">|Página \d/, 'M05 sem bloco do PDF nem número de página');
  assert.match(data['civil-m05'].completeHtml, /<h2>10\. REVISÃO FINAL<\/h2>/);
  assert.match(data['civil-m11'].completeHtml, /<td>Aquisição\/transmissão<\/td>/);
});

test('Civil: nenhuma frase marcada como subtítulo (continuações e listas de artigos)', async () => {
  const vm = await import('node:vm'); const zlib = await import('node:zlib');
  const sb = {}; sb.window = sb; vm.runInNewContext(read('content/civil/civil-native-content-packed.js'), sb);
  const data = JSON.parse(zlib.gunzipSync(Buffer.from(sb.CIVIL_NATIVE_PACKED_B64, 'base64')).toString());
  const bad = [];
  for (const [mod, m] of Object.entries(data)) for (const key of ['summaryHtml', 'completeHtml'])
    for (const x of (m[key] || '').matchAll(/<(h[23])>([\s\S]*?)<\/\1>/g)) {
      const t = x[2].replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
      if (t.length > 90 || /•/.test(t) || /^\d\.\d{3}/.test(t) || /^[a-zà-ÿ]/.test(t)) bad.push(mod + ': ' + t.slice(0, 60));
    }
  assert.deepEqual(bad, []);
  assert.match(data['civil-m15'].completeHtml, /hipóteses legais do art\. 1\.814\. Tradicionalmente, a exclusão/);
});

const fixed = (w, lines) => { const pre = w.document.createElement('pre'); pre.textContent = lines.join('\n'); return w.CentralEditorialReading.fixedWidthTable(pre); };

test('célula que ocupa duas linhas continua na mesma linha da tabela (sem frases partidas)', () => {
  const w = setup();
  const data = JSON.parse(JSON.stringify(fixed(w, [
    '  Categoria           Regra                                 Exemplo / pegadinha',
    '  Imóvel por          Solo e o que se incorpora natural ou  Terreno e construção incorporada.',
    '  natureza/incorp.    artificialmente.',
    '  Arts. 1.239, 1.240 e   modalidades especiais              Verifique área, moradia e',
    '  1.240-A                                                   prazo.',
    '  CC 6º-8º            Morte presumida.                      extremamente provável'
  ])));
  assert.deepEqual(data.rows[0], ['Imóvel por natureza/incorp.', 'Solo e o que se incorpora natural ou artificialmente.', 'Terreno e construção incorporada.']);
  assert.equal(data.rows[1][0], 'Arts. 1.239, 1.240 e 1.240-A');
  assert.equal(data.rows[1][2], 'Verifique área, moradia e prazo.');
  assert.equal(data.rows[2][0], 'CC 6º-8º', 'nova linha que começa com rótulo próprio não é colada na anterior');
});

test('cabeçalho repetido a cada linha aparece uma vez e colunas deslocadas na quebra de página são aceitas', () => {
  const w = setup();
  const data = fixed(w, [
    '  Dispositivo    Regra                 Pegadinha',
    '  CC 1º-2º       Personalidade.        Nascituro.',
    '  Dispositivo    Regra                 Pegadinha',
    '  CC 3º-4º        Incapacidade.         Deficiência não é causa.'
  ]);
  assert.equal(data.rows.length, 2);
  assert.deepEqual([...data.rows[1]], ['CC 3º-4º', 'Incapacidade.', 'Deficiência não é causa.']);
});

test('quadro em colunas dentro do texto corrido vai para a tabela, não para um parágrafo emendado', () => {
  const w = setup('<div class="cv-reader"><article><pre></pre></article></div>');
  const pre = w.document.querySelector('pre');
  pre.textContent = ['3. LEI SECA ESSENCIAL',
    'Texto introdutório do quadro, com frase completa e várias palavras para formar parágrafo.',
    '   Dispositivo    Regra                               Pegadinha',
    '   CC 1º-2º       Capacidade de direitos/deveres e    Não confundir personalidade',
    '                  início da personalidade.            com proteção do nascituro.',
    '   Dispositivo    Regra                               Pegadinha',
    '   CC 5º          Maioridade e emancipação.           Emancipação não revoga',
    '                                                      limites de leis especiais.',
    'Depois do quadro o texto segue normalmente em parágrafo próprio, sem colunas nem recuos.',
    'Mais uma linha de texto comum para completar o tamanho mínimo do bloco de leitura.',
    'E outra linha comum, apenas para garantir o volume mínimo exigido pelo leitor universal.'].join('\n');
  w.CentralUniversalReader.formatRaw(pre);
  w.CentralEditorialReading.process(w.document.querySelector('article'));
  const table = w.document.querySelector('table.bc-rebuilt-table');
  assert.ok(table, 'quadro reconstruído como tabela');
  assert.equal(table.tBodies[0].rows.length, 2);
  assert.equal(table.tBodies[0].rows[0].cells[1].textContent, 'Capacidade de direitos/deveres e início da personalidade.');
  assert.doesNotMatch([...w.document.querySelectorAll('.bc-universal-projection p')].map(p => p.textContent).join(' '), /Dispositivo/);
});

test('cabeçalho deslocado para o meio da tabela volta ao topo e linhas repetidas somem', () => {
  const w = setup('<div class="cv-reader"><article><table><thead><tr><th>Art. 1.245</th><th>registro</th></tr></thead><tbody>' +
    '<tr><td>Art. 1.275</td><td>perda</td></tr><tr><td>Artigo</td><td>Lembre</td></tr><tr><td>Art. 1.285</td><td>passagem</td></tr></tbody></table></article></div>');
  w.CentralEditorialReading.process(w.document.querySelector('article'));
  const t = w.document.querySelector('table');
  assert.deepEqual([...t.tHead.rows[0].cells].map(c => c.textContent), ['Artigo', 'Lembre']);
  assert.equal(t.tBodies[0].rows[0].cells[0].textContent, 'Art. 1.245', 'nenhum dado perdido');
  assert.equal(t.tBodies[0].rows.length, 3);
});

test('bloco de tópicos com marcador e recuo vira lista, não quadro com rolagem', () => {
  const w = setup('<div class="cv-reader"><article><pre class="civil-source-table"></pre></article></div>');
  w.document.querySelector('pre').textContent = '•      Faixa normativa principal: CC, arts. 104 a 184.\n•      Risco máximo: nulidade x anulabilidade; fraude contra credores x\n       simulação.';
  w.CentralEditorialReading.process(w.document.querySelector('article'));
  const items = [...w.document.querySelectorAll('.bc-rebuilt-list li')].map(li => li.textContent);
  assert.deepEqual(items, ['Faixa normativa principal: CC, arts. 104 a 184.', 'Risco máximo: nulidade x anulabilidade; fraude contra credores x simulação.']);
});

test('sigla que é lista (LIMPE) não é expandida no meio da frase; nota de PDF fica oculta', () => {
  const w = setup('<div class="cv-reader"><article><p>Base: PDF “1. Princípios Administrativos” · apoio: Lei 9.784/99.</p>' +
    '<p>Do regime jurídico-administrativo ao LIMPE e aos princípios reconhecidos pela doutrina.</p></article></div>');
  const article = w.document.querySelector('article');
  w.CentralAcronyms?.process?.(article);
  w.CentralEditorialReading.process(article);
  const [note, text] = article.querySelectorAll('p');
  assert.ok(note.classList.contains('bc-source-note'));
  assert.match(text.textContent, /ao LIMPE e aos princípios/);
  assert.equal(text.querySelector('abbr.bc-acr')?.title, 'Legalidade, Impessoalidade, Moralidade, Publicidade e Eficiência');
});
