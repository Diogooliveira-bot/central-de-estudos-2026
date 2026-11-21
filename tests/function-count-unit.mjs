// A Vercel (plano Hobby) recusa o deploy inteiro se houver mais de 12 funções de servidor (um arquivo por função em api/).
// Para uma API nova, coloque o código em lib/ e ligue-o na api/auth.js (?bc_api=...), com um rewrite no vercel.json.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync, readFileSync } from 'node:fs';

const LIMITE = 12;
const arquivos = (dir) => readdirSync(dir, { withFileTypes: true }).flatMap((e) => e.isDirectory() ? arquivos(`${dir}/${e.name}`) : /\.(?:js|mjs|ts)$/.test(e.name) ? [`${dir}/${e.name}`] : []);

test(`api/ tem no máximo ${LIMITE} funções (limite do plano Hobby da Vercel)`, () => {
  const lista = arquivos('api');
  assert.ok(lista.length <= LIMITE, `há ${lista.length} funções em api/ (${lista.join(', ')}). Mova a nova para lib/ e use api/auth.js com bc_api.`);
});

test('/api/vade-audit continua existindo por redirecionamento interno para a api/auth.js', () => {
  const vercel = JSON.parse(readFileSync('vercel.json', 'utf8'));
  const regra = vercel.rewrites.find((r) => r.source === '/api/vade-audit');
  assert.equal(regra?.destination, '/api/auth?bc_api=vade-audit');
  assert.match(readFileSync('api/auth.js', 'utf8'), /premiumApi === 'vade-audit'/);
});
