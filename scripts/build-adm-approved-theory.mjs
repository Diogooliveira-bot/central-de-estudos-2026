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
  const body = blocks.map((block, index) => {
    const lines = block.trim().split('\n');
    if (block.trim() === '---') return '<hr>';
    const line = lines[0].trim();
    if (index === 0) return `<h1>${escapeHtml(line)}</h1>`;
    if (/^SESSÃO\s+\d+/i.test(line) || /^\d+\s+Questões Internas/i.test(line) || /^REVISÃO FINAL/i.test(line)) {
      return `<h2>${lines.map(escapeHtml).join(' · ')}</h2>`;
    }
    if (lines.length === 1 && (/^\d+\.\s+/.test(line) || /^Q\d+\s*[—-]/.test(line) || /^(Como estudar|Como cai|O que decorar|Artigos para ler|Check manual)/i.test(line))) {
      return `<h3>${escapeHtml(line)}</h3>`;
    }
    if (lines.every(value => /^\s*[•□]/.test(value))) return `<ul>${lines.map(value => `<li>${escapeHtml(value.replace(/^\s*•\s*/, ''))}</li>`).join('')}</ul>`;
    return `<p>${lines.map(escapeHtml).join('<br>')}</p>`;
  });
  return body.join('\n');
}

for (let number = 1; number <= 20; number++) {
  const file = byNumber.get(number);
  const source = readFileSync(resolve(sourceDir, file), 'utf8');
  if (!/10\s+QUESTÕES|QUESTÃO\s*10|Q(?:C)?10/i.test(source)) throw new Error(`Questões completas ausentes no M${number}`);
  const theory = incompleteQuestionBlocks.has(number)
    ? source.split(/\n\s*10\s+questões internas(?:\s+de fixação)?(?:\s*[—·-]\s*conteúdo completo|\s*[·-]\s*completo)?\s*\n/i)[0]
    : source;
  if (incompleteQuestionBlocks.has(number) && theory.length === source.length) throw new Error(`Limite de questões do M${number} não encontrado`);
  const path = resolve(root, `content/adm/m${String(number).padStart(2, '0')}-approved-complete.js`);
  const data = `window.ADM_APPROVED_COMPLETE=window.ADM_APPROVED_COMPLETE||{};window.ADM_APPROVED_COMPLETE[${number}]=${JSON.stringify(render(theory))};\n`;
  writeFileSync(path, data);
}
