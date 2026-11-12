// Uso:  node tools/validate-questoes.mjs            → confere o banco
//       node tools/validate-questoes.mjs --write-index → confere e atualiza content/questoes/index.js
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { validarTudo, DISCIPLINAS } from './questoes-lib.mjs';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const { erros, indice, qtd, total } = validarTudo(root);
if (erros.length) { console.error(erros.map(e => '✗ ' + e).join('\n')); console.error(`\n${erros.length} problema(s).`); process.exit(1); }
const conteudo = `/* Índice do banco de questões. GERADO por "npm run questoes:index" — não edite à mão. */\nwindow.BC_QUESTOES_INDICE=${JSON.stringify(indice)};\nwindow.BC_QUESTOES_QTD=${JSON.stringify(qtd)};\n`;
const file = path.join(root, 'content/questoes/index.js');
if (process.argv.includes('--write-index')) { fs.writeFileSync(file, conteudo); console.log('índice atualizado.'); }
else if (!fs.existsSync(file) || fs.readFileSync(file, 'utf8') !== conteudo) { console.error('✗ content/questoes/index.js está desatualizado: rode "npm run questoes:index".'); process.exit(1); }
console.log(`✓ ${total} questões em ${Object.values(indice).reduce((a, b) => a + b.length, 0)} módulos (${Object.keys(DISCIPLINAS).map(d => d + ':' + indice[d].length).join(' ')})`);
