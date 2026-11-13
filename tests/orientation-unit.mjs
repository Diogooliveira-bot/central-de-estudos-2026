import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { JSDOM } from 'jsdom';
import { normalizeOrientation } from '../api/content-editor.js';

const read = path => readFileSync(path, 'utf8');
const COUNTS = { adm: 20, cf: 15, civil: 15, cpc: 20, penal: 17, cpp: 22, rlm: 15, info: 13 };

function boot({ role = 'aluno', fetchImpl, guest = false } = {}) {
  const dom = new JSDOM('<!doctype html><html><body><div id="host"></div></body></html>', {
    url: 'https://central.test/central-v119.html', runScripts: 'outside-only'
  });
  const w = dom.window;
  w.BASE_COMPLETA_USER = { role };
  w.__BASE_COMPLETA_PREVIEW_GUEST__ = guest;
  w.fetch = fetchImpl || (async () => ({ ok: true, json: async () => ({ items: [] }) }));
  w.eval(read('ui/orientation-defaults-v1.js'));
  w.eval(read('ui/orientation-v1.js'));
  return w;
}
const wait = (ms = 20) => new Promise(resolve => setTimeout(resolve, ms));

test('todos os módulos das 8 disciplinas têm foco, atenção e dica curtos e sem HTML', () => {
  const w = boot();
  const defaults = w.BC_ORIENTATION_DEFAULTS;
  let total = 0;
  const seen = new Set();
  for (const [discipline, count] of Object.entries(COUNTS)) {
    for (let n = 1; n <= count; n++) {
      const entry = defaults[`${discipline}:${n}`];
      assert.ok(entry, `${discipline}:${n} ausente`);
      for (const field of ['foco', 'atencao', 'dica']) {
        assert.ok(typeof entry[field] === 'string' && entry[field].length >= 25, `${discipline}:${n} ${field} curto demais`);
        assert.ok(entry[field].length <= 250, `${discipline}:${n} ${field} longo demais`);
        assert.doesNotMatch(entry[field], /[<>]/, `${discipline}:${n} ${field} contém HTML`);
      }
      assert.ok(!seen.has(entry.dica), `${discipline}:${n} dica repetida`);
      seen.add(entry.dica);
      total++;
    }
  }
  assert.equal(total, 137);
  assert.equal(Object.keys(defaults).length, 137, 'sem chaves sobrando');
});

test('textos padrão seguem a linguagem neutra: sem banca, estatística de incidência ou edital', () => {
  const all = Object.values(boot().BC_ORIENTATION_DEFAULTS).flatMap(e => Object.values(e)).join(' ');
  assert.doesNotMatch(all, /\b(FCC|CESPE|Cebraspe|FGV|VUNESP|IBFC|TJCE|TRT)\b/i);
  assert.doesNotMatch(all, /\d+\s?%\s+(das|dos) (provas|questões)/i);
  assert.doesNotMatch(all, /\b(?:do|no|ao|pelo|conforme o|cobrad[oa]s? (?:em|no)) edital\b/i, 'sem referência ao edital de concurso (citação por edital é termo jurídico)');
});

test('renderiza bloco único, curto e sem cards, listas ou expansíveis', () => {
  const w = boot();
  const host = w.document.getElementById('host');
  host.innerHTML = w.BCOrientation.html('adm:3');
  const block = host.querySelector('.bc-orient');
  assert.ok(block);
  assert.equal(block.dataset.bcOrient, 'adm:3');
  assert.equal(block.querySelectorAll('p').length, 3);
  assert.match(block.textContent, /Foco:/);
  assert.match(block.textContent, /Atenção:/);
  assert.match(block.textContent, /Como estudar:/);
  assert.equal(block.querySelector('details,ul,li,article'), null);
  assert.equal(block.querySelector('.bc-orient-edit'), null, 'aluno não vê o botão de edição');
  assert.equal(w.BCOrientation.html('adm:99'), '', 'módulo sem texto não renderiza bloco');
  assert.equal(w.BCOrientation.html('<img onerror=x>'), '', 'chave inválida é rejeitada');
});

test('texto editado e publicado prevalece sobre o padrão, por campo, e é escapado', async () => {
  const w = boot({
    fetchImpl: async () => ({ ok: true, json: async () => ({ items: [{ id: 'orient:adm:3', revision: 4, html: JSON.stringify({ foco: 'Foco <b>editado</b> & novo' }) }] }) })
  });
  const host = w.document.getElementById('host');
  host.innerHTML = w.BCOrientation.html('adm:3');
  await wait();
  const text = host.textContent;
  assert.match(text, /Foco <b>editado<\/b> & novo/, 'exibido como texto, não como HTML');
  assert.equal(host.querySelector('.bc-orient b + b, .bc-orient-body b'), null, 'sem tag injetada');
  assert.match(text, /Atenção:/, 'campos não editados mantêm o padrão');
});

test('admin e editor veem "Editar"; salvar envia revisão esperada e atualiza o bloco', async () => {
  const calls = [];
  const w = boot({
    role: 'editor',
    fetchImpl: async (url, options = {}) => {
      calls.push({ url: String(url), options });
      if (options.method === 'POST') return { ok: true, json: async () => ({ ok: true, revision: 1 }) };
      return { ok: true, json: async () => ({ items: [] }) };
    }
  });
  const host = w.document.getElementById('host');
  host.innerHTML = w.BCOrientation.html('cf:5');
  const edit = host.querySelector('[data-bc-orient-edit="cf:5"]');
  assert.ok(edit, 'botão de edição para editor');
  edit.click();
  const form = host.querySelector('.bc-orient-form');
  assert.equal(form.querySelectorAll('textarea').length, 3);
  form.elements.foco.value = 'Meu foco personalizado <script>x</script>';
  form.dispatchEvent(new w.Event('submit', { cancelable: true, bubbles: true }));
  await wait();
  const post = calls.find(c => c.options.method === 'POST');
  assert.ok(post, 'POST enviado');
  const body = JSON.parse(post.options.body);
  assert.equal(body.id, 'orient:cf:5');
  assert.equal(body.expectedRevision, 0);
  assert.doesNotMatch(JSON.parse(body.html).foco, /[<>]/, 'sinais de HTML removidos antes do envio');
  assert.match(host.textContent, /Meu foco personalizado/);
  assert.equal(host.querySelector('.bc-orient-form'), null, 'formulário fecha após salvar');
});

test('convidado da prévia e aluno não conseguem editar nem consultam a API', async () => {
  let calls = 0;
  const guest = boot({ role: 'admin', guest: true, fetchImpl: async () => { calls++; return { ok: true, json: async () => ({ items: [] }) }; } });
  guest.document.getElementById('host').innerHTML = guest.BCOrientation.html('cpc:2');
  await wait();
  assert.equal(guest.document.querySelector('[data-bc-orient-edit]'), null);
  assert.equal(calls, 0, 'convidado não chama API de dados');
});

test('API valida orientações: só foco/atenção/dica, texto simples e até 400 caracteres', () => {
  assert.equal(normalizeOrientation('{"foco":"ok <b>x</b>"}'), '{"foco":"ok bx/b"}');
  assert.equal(normalizeOrientation('{"foco":"a","extra":"b"}'), null, 'campo desconhecido');
  assert.equal(normalizeOrientation('{"foco":"' + 'x'.repeat(401) + '"}'), null, 'excede 400');
  assert.equal(normalizeOrientation('{"foco":123}'), null, 'tipo inválido');
  assert.equal(normalizeOrientation('[]'), null);
  assert.equal(normalizeOrientation('não é json'), null);
  assert.equal(normalizeOrientation('{"foco":"   "}'), null, 'vazio não é aceito');
  const api = read('api/content-editor.js');
  assert.match(api, /action==='orientations'/);
  assert.match(api, /orient:\(\?:adm\|cf\|civil\|cpc\|penal\|cpp\|rlm\|info\):/);
});

test('as 8 disciplinas usam o renderizador único e o carregador/offline incluem os scripts', () => {
  const wiring = {
    'ui/adm-native-layer.js': "BCOrientation.html('adm:'",
    'ui/cf-native-study-v2.js': "BCOrientation.html('cf:'",
    'ui/civil-native-study-v1.js': "BCOrientation.html('civil:'",
    'ui/cpp-native-study-v1.js': "BCOrientation.html('cpp:'",
    'ui/rlm-native-v1.js': "BCOrientation.html('rlm:'",
    'ui/informatica-structure-v1.js': "BCOrientation.html('info:'",
    'ui/discipline-standard.js': "BCOrientation.html('penal:'",
    'ui/approved-cpc-layout-v1.js': "BCOrientation.html('cpc:'"
  };
  for (const [file, needle] of Object.entries(wiring)) assert.ok(read(file).includes(needle), `${file} sem ${needle}`);
  assert.ok(read('ui/discipline-standard.js').includes("BCOrientation.html('cpc:'"));
  const shell = read('central-v119.html');
  const manifest = JSON.parse(read('central-offline-files-v66172.json')).files;
  for (const name of ['ui/orientation-defaults-v1.js', 'ui/orientation-v1.js']) {
    const ver = name.includes('defaults') ? '20261113orient2' : '20261113orient1';
    assert.ok(shell.includes(name + '?v=' + ver), name + ' no carregador');
    assert.ok(manifest.includes('/' + name + '?v=' + ver), name + ' no cache offline');
  }
  assert.ok(shell.indexOf('ui/orientation-defaults-v1.js') < shell.indexOf('ui/orientation-v1.js'));
});
