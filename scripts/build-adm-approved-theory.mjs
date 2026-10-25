import { readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const sourceDir = resolve(root, 'content/adm/approved-text');
const files = readdirSync(sourceDir).filter(name => /DIREITO-ADMINISTRATIVO-MODULO-\d{2}-COMPLETO\.txt$/.test(name));
const byNumber = new Map(files.map(name => [Number(name.match(/MODULO-(\d{2})/)[1]), name]));
// Esses quatro arquivos foram salvos com o bloco de respostas incompleto.
// Suas dez questões com respostas já constam do pacote nativo da Central.
const incompleteQuestionBlocks = new Set([1, 2, 5, 11]);
if (files.length !== 20 || [...Array(20)].some((_, i) => !byNumber.has(i + 1))) {
  throw new Error('A fonte aprovada precisa ter exatamente M01 a M20.');
}

const escapeHtml = value => value.replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);
function render(text) {
  const blocks = text.replace(/^\uFEFF/, '').replace(/\r\n?/g, '\n').trim().split(/\n\s*\n/);
  let checkNumber = 0;
  let nextCheckBlock = false;
  const checkLine = (value, force = false) => {
    const item = value.trim().replace(/^•\s*/, '');
    const marked = /[□☐]/.test(item);
    const label = item.replace(/[□☐]/g, '').replace(/^Check manual\s*[:—-]?\s*/i, '').trim();
    return (marked || force)
      ? `<label class="adm-reading-check"><input type="checkbox" data-adm-check="${++checkNumber}"><span>${escapeHtml(label)}</span></label>`
      : escapeHtml(item);
  };
  const tableHtml = lines => {
    const rows = lines.map(line => line.split(' | ').map(cell => escapeHtml(cell.trim())));
    const columns = rows[0].length;
    const row = (cells, tag) => `<tr>${cells.map(cell => `<${tag}${tag==='th'?' scope="col"':''}>${cell}</${tag}>`).join('')}</tr>`;
    return `<div class="adm-table-scroll" role="region" aria-label="Tabela comparativa" tabindex="0"><table class="adm-reading-table" style="--adm-table-columns:${columns}"><thead>${row(rows[0],'th')}</thead><tbody>${rows.slice(1).map(cells => row(cells,'td')).join('')}</tbody></table></div>`;
  };
  const body = blocks.map((block, index) => {
    const lines = block.trim().split('\n');
    const pendingCheck = nextCheckBlock;
    nextCheckBlock = false;
    if (block.trim() === '---') return '<hr>';
    const line = lines[0].trim();
    if (index === 0) return `<h1>${escapeHtml(line)}</h1>`;
    const columns = lines.map(value => value.split(' | ').length);
    if (lines.length > 1 && columns[0] >= 2 && columns[0] <= 6 && columns.every(count => count === columns[0])) {
      return tableHtml(lines);
    }
    if (/^(?:SESSÃO\s+\d+|S\d+\s*[—-])/i.test(line) || /^\d+\s+Questões Internas/i.test(line) || /^REVISÃO FINAL/i.test(line)) {
      return `<h2>${lines.map(escapeHtml).join(' · ')}</h2>`;
    }
    if (/^Check manual$/i.test(line)) {nextCheckBlock = true;return '<h3>Check da leitura</h3>'}
    if (lines.length === 1 && /^(?:Check manual|Check final do módulo)/i.test(line)) return `<p>${checkLine(line,true)}</p>`;
    if (lines.length === 1 && (/^\d+\.\s+/.test(line) || /^Q\d+\s*[—-]/.test(line) || /^(Como estudar|Como cai|O que decorar|Artigos para ler|Check manual)/i.test(line))) {
      return `<h3>${escapeHtml(line)}</h3>`;
    }
    if (lines.every(value => /^\s*(?:•\s*)?[□☐]\s*/.test(value))) return `<ul class="adm-reading-check-list">${lines.map(value => `<li>${checkLine(value)}</li>`).join('')}</ul>`;
    if (pendingCheck && lines.every(value => /^\s*•/.test(value))) return `<ul class="adm-reading-check-list">${lines.map(value => `<li>${checkLine(value,true)}</li>`).join('')}</ul>`;
    if (lines.every(value => /^\s*•/.test(value))) return `<ul>${lines.map(value => `<li>${checkLine(value)}</li>`).join('')}</ul>`;
    if (lines.length === 1 && /^[□☐]\s*/.test(line)) return `<p>${checkLine(line)}</p>`;
    return `<p>${lines.map(escapeHtml).join('<br>')}</p>`;
  });
  return body.join('\n');
}

const sectionIndex = {};
for (let number = 1; number <= 20; number++) {
  const file = byNumber.get(number);
  const source = readFileSync(resolve(sourceDir, file), 'utf8');
  if (!/10\s+QUESTÕES|QUESTÃO\s*10|Q(?:C)?10/i.test(source)) throw new Error(`Questões completas ausentes no M${number}`);
  const theory = incompleteQuestionBlocks.has(number)
    ? source.split(/\n\s*10\s+questões internas(?:\s+de fixação)?(?:\s*[—·-]\s*conteúdo completo|\s*[·-]\s*completo)?\s*\n/i)[0]
    : source;
  if (incompleteQuestionBlocks.has(number) && theory.length === source.length) throw new Error(`Limite de questões do M${number} não encontrado`);
  const path = resolve(root, `content/adm/m${String(number).padStart(2, '0')}-approved-complete.js`);
  const html = render(theory);
  const sessions = [...html.matchAll(/<h2>(.*?)<\/h2>(?:\n<p>([^<]*)<\/p>)?/g)];
  sectionIndex[number] = sessions.filter(match => /^(?:SESSÃO\s+\d+|S\d+\s*[—-])/i.test(match[1]))
    .map(([,title,subtitle]) => /^SESSÃO\s+\d+$/i.test(title) && subtitle?.length < 110
      ? `${title} · ${subtitle}` : title);
  if (sectionIndex[number].length < 5) throw new Error(`Sessões ausentes no M${number}`);
  const data = `window.ADM_APPROVED_COMPLETE=window.ADM_APPROVED_COMPLETE||{};window.ADM_APPROVED_COMPLETE[${number}]=${JSON.stringify(html)};\n`;
  writeFileSync(path, data);
}
writeFileSync(resolve(root, 'content/adm/adm-session-index.js'),
  `window.ADM_SESSION_INDEX=${JSON.stringify(sectionIndex)};\n`);
