// Banco de questões: leitura e validação (usado por tools/validate-questoes.mjs e pelos testes).
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
export const DISCIPLINAS = {
  adm: 'Direito Administrativo', cpc: 'Direito Processual Civil', pt: 'Português', penal: 'Direito Penal',
  cpp: 'Direito Processual Penal', cf: 'Direito Constitucional', civil: 'Direito Civil', rlm: 'Raciocínio Lógico-Matemático',
  info: 'Noções de Informática'
};
export const MODULOS = { adm: 20, cpc: 20, pt: 24, penal: 17, cpp: 22, cf: 15, civil: 15, rlm: 15, info: 13 };
export const ORIGENS = ['autoral-ia', 'banca'];
const LETRAS = 'ABCDE';
const SEM_LEI = new Set(['pt', 'rlm']); // não citam lei: regras de lei/artigo não se aplicam

export function lerArquivo(file) {
  const ctx = { window: {} };
  vm.createContext(ctx);
  vm.runInContext(fs.readFileSync(file, 'utf8'), ctx, { filename: file });
  return ctx.window.BC_QUESTOES;
}

export function validarModulo(disc, n, items, origemEsperada = 'autoral-ia') {
  const erros = [];
  const E = (i, msg) => erros.push(`${disc} M${String(n).padStart(2, '0')}${i == null ? '' : ' Q' + (i + 1)}: ${msg}`);
  if (!Array.isArray(items) || items.length < 10) { E(null, 'precisa de ao menos 10 questões'); return erros; }
  const cont = Object.fromEntries([...LETRAS].map(l => [l, 0]));
  let maisLonga = 0;
  const vistos = new Set();
  items.forEach((x, i) => {
    const idOk = new RegExp(`^${disc}-m${String(n).padStart(2, '0')}-(autoral|banca)-\\d{2,3}$`).test(x.id || '');
    if (!idOk) E(i, `id inválido (use ${disc}-mNN-autoral-NN): ${x.id}`);
    if (vistos.has(x.id)) E(i, 'id repetido'); vistos.add(x.id);
    if (!ORIGENS.includes(x.origem)) E(i, 'origem deve ser autoral-ia ou banca');
    if (x.origem !== origemEsperada) E(i, `origem ${x.origem} não pertence a este arquivo (${origemEsperada})`);
    if (x.origem === 'banca') for (const k of ['banca', 'ano', 'orgao', 'cargo']) if (!x[k]) E(i, `questão de banca exige o campo ${k}`);
    if (x.origem === 'autoral-ia') for (const k of ['banca', 'ano', 'orgao', 'cargo', 'prova']) if (x[k]) E(i, `questão autoral não pode ter ${k} (não é de banca)`);
    if (typeof x.q !== 'string' || x.q.trim().length < 25) E(i, 'enunciado curto ou ausente');
    if (!Array.isArray(x.options) || x.options.length !== 5 || new Set(x.options).size !== 5 || x.options.some(o => typeof o !== 'string' || !o.trim())) E(i, 'precisa de 5 alternativas diferentes e não vazias');
    if (!Number.isInteger(x.answer) || x.answer < 0 || x.answer > 4) E(i, 'answer deve ser 0 a 4'); else cont[LETRAS[x.answer]]++;
    const minExp = SEM_LEI.has(disc) ? 100 : 150;
    if (typeof x.explanation !== 'string' || x.explanation.length < minExp) E(i, `comentário com menos de ${minExp} caracteres`);
    if (typeof x.lawRef !== 'string' || !x.lawRef.trim()) E(i, 'lawRef (base legal ou regra) obrigatório');
    if (Array.isArray(x.options) && x.options.length === 5 && Number.isInteger(x.answer)) {
      const s = x.options.map(o => o.length), mx = Math.max(...s);
      if (s[x.answer] === mx && s.filter(v => v === mx).length === 1) maisLonga++;
    }
    if (/\b(FCC|FGV|Cebraspe|CESPE|Vunesp|concurso de \d{4}|prova de \d{4})\b/i.test(x.q || '') && x.origem === 'autoral-ia') E(i, 'não atribuir questão autoral a banca ou prova real');
    if (!SEM_LEI.has(disc)) {
      for (const campo of ['q', 'explanation', 'lawRef']) {
        const t = String(x[campo] || '');
        for (const lei of new Set(t.match(/Lei \d[\d.]*\/\d{4}/g) || [])) {
          const pos = [...t.matchAll(new RegExp(lei.replace(/[.\/]/g, '\\$&'), 'g'))].map(m => m.index);
          if (!pos.some(k => t.slice(k + lei.length, k + lei.length + 2) === ' (' || /\([^()]*$/.test(t.slice(Math.max(0, k - 60), k)))) E(i, `"${lei}" citada sem o nome da lei (campo ${campo})`);
        }
      }
      if (/\bart(s)?\.\s*\d/.test(x.explanation || '') && !/\bdiz\b|"/.test(x.explanation || '')) E(i, 'comentário cita artigo sem dizer o que ele diz');
    }
  });
  const n10 = items.length, teto = Math.ceil(n10 * 0.3), piso = Math.floor(n10 * 0.1);
  for (const [l, v] of Object.entries(cont)) if (v > teto || v < piso) E(null, `gabarito desequilibrado: letra ${l} aparece ${v} vez(es) em ${n10} questões (de ${piso} a ${teto})`);
  if (maisLonga > teto) E(null, `a alternativa correta é a mais longa em ${maisLonga} de ${n10} questões (máximo ${teto})`);
  return erros;
}

// Percorre content/questoes/<disc>/mNN.js e devolve { erros, indice }.
export function validarTudo(root) {
  const base = path.join(root, 'content/questoes');
  const erros = [];
  const indice = {};
  const qtd = {};
  const ids = new Set();
  for (const disc of Object.keys(DISCIPLINAS)) {
    indice[disc] = [];
    qtd[disc] = {};
    const dir = path.join(base, disc);
    if (!fs.existsSync(dir)) continue;
    for (const f of fs.readdirSync(dir).sort()) {
      const m = /^m(\d{2})\.js$/.exec(f);
      if (!m) { erros.push(`${disc}/${f}: nome inválido (use mNN.js)`); continue; }
      const n = Number(m[1]);
      if (n < 1 || n > MODULOS[disc]) { erros.push(`${disc}/${f}: módulo fora do intervalo 1–${MODULOS[disc]}`); continue; }
      let banco;
      try { banco = lerArquivo(path.join(dir, f)); } catch (e) { erros.push(`${disc}/${f}: erro ao ler: ${e.message}`); continue; }
      const items = banco?.[disc]?.[n];
      if (!items) { erros.push(`${disc}/${f}: não define BC_QUESTOES.${disc}[${n}]`); continue; }
      erros.push(...validarModulo(disc, n, items));
      for (const x of items) { if (ids.has(x.id)) erros.push(`${disc} M${n}: id repetido no banco inteiro: ${x.id}`); ids.add(x.id); }
      indice[disc].push(n);
      qtd[disc][n] = items.length;
    }
  }
  return { erros, indice, qtd, total: ids.size };
}
