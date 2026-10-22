import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';
import { renderGuidedM01 } from './render-cf-m01-guided.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = p => fs.readFileSync(path.join(root, p), 'utf8');
const source = read('content/cf/editorial/m01-didatico.md');
const between = (start, end) => {
  const a = source.indexOf(start);
  const b = end ? source.indexOf(end, a + start.length) : source.length;
  if (a < 0 || b < 0) throw new Error(`Seção ausente: ${start} / ${end}`);
  return source.slice(a, b).trim();
};
function native(markdown) {
  const lines = markdown.split('\n'), out = [];
  let parent = 0, sub = 0;
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line.startsWith('|')) {
      const rows = [];
      while (i < lines.length && lines[i].trim().startsWith('|')) {
        const cells = lines[i].trim().slice(1, -1).split('|').map(c => c.trim());
        if (!cells.every(c => /^:?-+:?$/.test(c))) rows.push(cells);
        i++;
      }
      i--;
      rows.forEach(row => out.push(row.join('   ')));
      out.push('');
    } else if (/^#{1,3} /.test(line)) {
      const title = line.replace(/^#{1,3} /, '').toUpperCase();
      if (line.startsWith('# ')) {
        parent = Number(title.match(/^(\d+)\./)?.[1] || 0);
        sub = 0;
        out.push(title);
      } else out.push(`${parent ? parent + '.' : ''}${++sub}. ${title}`);
    }
    else if (line.startsWith('- [ ] ')) out.push('• ☐ ' + line.slice(6));
    else if (line.startsWith('- ')) out.push('• ' + line.slice(2));
    else if (/^https:/.test(line)) out.push('Fonte oficial: ' + line);
    else out.push(line);
  }
  return out.join('\n').replace(/\n{3,}/g, '\n\n').trim();
}
function questions(start, end, review = false) {
  const section = between(start, end);
  const regex = review
    ? /## Revisão (\d+) — (Fácil|Média|Difícil)\n\n([\s\S]*?)(?=\n## Revisão|$)/g
    : /## Questão (\d+) — (Fácil|Média|Difícil)\n\n([\s\S]*?)(?=\n## Questão|$)/g;
  return [...section.matchAll(regex)].map(m => {
    const [body, answer] = m[3].trim().split('\n\nResposta: ');
    if (!answer) throw new Error(`Questão sem resposta: ${m[1]}`);
    if (review) {
      const [_, choice, explanation] = answer.match(/^(Certo|Errado)\. ([\s\S]*)$/);
      return {n: Number(m[1]), difficulty: m[2], q: body.trim(), options: ['Certo.', 'Errado.'], answer: choice === 'Certo' ? 0 : 1, explanation: explanation.trim()};
    }
    const first = body.indexOf('\n\nA) ');
    if (first < 0) throw new Error('Alternativas ausentes');
    const options = [...body.slice(first).matchAll(/^[A-D]\) (.*)$/gm)].map(v => v[1]);
    const [_, choice, explanation] = answer.match(/^([A-D])\. ([\s\S]*)$/);
    return {n: Number(m[1]), difficulty: m[2], q: body.slice(0, first).trim(), options, answer: choice.charCodeAt(0) - 65, explanation: explanation.trim()};
  });
}

const context = {window: {}};
vm.runInNewContext(read('content/cf/m01-native-data.js'), context);
const original = context.window.BASE_NATIVE_CONTENT.cf.m01;
const checklist = between('# Checklist de domínio');
const review = between('# 15. Revisão ativa', '# 16. Referências');
const references = between('# 16. Referências', '# Checklist de domínio');
const module = {...original,
  complete: native(between('# Leitura orientada', '# 12. Dez questões') + '\n\n' + review.replace('# 15.', '# 12.') + '\n\n' + references.replace('# 16.', '# 13.') + '\n\n' + checklist),
  summary: native(between('# 13. Conteúdo resumido', '# 14. Cinco questões').replace('# 13.', '#') + '\n\n' + review.replace('# 15.', '#') + '\n\n' + references.replace('# 16.', '#') + '\n\n' + checklist),
  questions: {
    complete: questions('# 12. Dez questões', '# 13. Conteúdo resumido'),
    summary: questions('# 14. Cinco questões', '# 15. Revisão ativa', true),
  },
  lawTopicId: 'cf-m01', lawLabel: 'CF, arts. 1º a 4º e fundamentos associados',
};
const dataScript = `(function(g){'use strict';g.BASE_NATIVE_CONTENT=g.BASE_NATIVE_CONTENT||{};g.BASE_NATIVE_CONTENT.cf=g.BASE_NATIVE_CONTENT.cf||{};g.BASE_NATIVE_CONTENT.cf.m01=${JSON.stringify(module)};})(window);\n`;
fs.writeFileSync(path.join(root, 'content/cf/m01-native-data.js'), dataScript);

// Deliverable is self-contained. No login bypass, API calls, or deployment.
// The Central keeps using the native renderer and the existing progress IDs.
const html = renderGuidedM01({source, module, css: read('content/cf/editorial/guided-m02.css')});
const out = process.env.CF_M01_OUTPUT_DIR;
if (out) {
  fs.mkdirSync(out, {recursive: true});
  fs.writeFileSync(path.join(out, 'CF-M01-Apostila-didatica-interativa.html'), html);
  fs.writeFileSync(path.join(out, 'CF-M01-Teoria-completa.txt'), module.complete);
  fs.writeFileSync(path.join(out, 'CF-M01-Teoria-resumida.txt'), module.summary);
}
console.log(JSON.stringify({completeChars: module.complete.length, summaryChars: module.summary.length, completeQuestions: module.questions.complete.length, summaryQuestions: module.questions.summary.length, output: out || 'native data only'}));
