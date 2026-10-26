import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import { JSDOM } from 'jsdom';

const script = await readFile(new URL('../ui/legal-complete-premium-v1.js', import.meta.url), 'utf8');
const css = await readFile(new URL('../ui/legal-complete-premium-v1.css', import.meta.url), 'utf8');
const bootstrap = await readFile(new URL('../central-v119.html', import.meta.url), 'utf8');
const nativeSession = await readFile(new URL('../ui/native-reading-session.js', import.meta.url), 'utf8');
const cfReader = await readFile(new URL('../ui/cf-native-study-v2.js', import.meta.url), 'utf8');
const cpcReader = await readFile(new URL('../ui/cpc-m08-native-study-reader.js', import.meta.url), 'utf8');
const penalReader = await readFile(new URL('../ui/native-study-reader-m09.js', import.meta.url), 'utf8');

function native({ id = '', classes = 'bc-native-reader-overlay', title = 'Título', subtitle = 'Conteúdo completo' }) {
  return `<div id="${id}" class="${classes}"><section class="bc-native-reader" role="dialog" aria-label="${subtitle}"><header class="bc-native-reader-head"><div class="bc-native-reader-title"><b>${title}</b><small>${subtitle}</small></div></header></section></div>`;
}
function cf({ subtitle = 'Teoria completa' } = {}) {
  return `<div class="cf-native-overlay"><section class="cf-native-shell"><header><div><b>CF M01 — Constituição</b><small>${subtitle}</small></div></header></section></div>`;
}
async function flush(dom) { await new Promise(resolve => dom.window.setTimeout(resolve, 0)); }
function setup(html) {
  const dom = new JSDOM(`<!doctype html><html><body>${html}</body></html>`, { runScripts: 'outside-only' });
  dom.window.eval(script);
  return dom;
}

test('reconhece as seis estruturas reais autorizadas, sem depender de título de conteúdo', () => {
  const dom = setup([
    native({ classes: 'bc-native-reader-overlay adm-native-overlay', subtitle: 'DIREITO ADMINISTRATIVO · MÓDULO 01 · COMPLETO' }),
    cf(),
    native({ id: 'bcNativeReaderOverlayM09', title: 'PEN M09 — Teoria do Crime' }),
    native({ id: 'cpcM08NativeReaderOverlay', title: 'Processo Civil' }),
    native({ classes: 'bc-native-reader-overlay civil-native-overlay', subtitle: 'DIREITO CIVIL · MÓDULO 03 · COMPLETA' }),
    native({ classes: 'bc-native-reader-overlay cpp-native-overlay', subtitle: 'DIREITO PROCESSUAL PENAL · MÓDULO 13 · COMPLETO' }),
    native({ classes: 'bc-native-reader-overlay pt-native-reader', subtitle: 'Conteúdo completo' }),
    native({ classes: 'bc-native-reader-overlay bc-rlm-overlay', subtitle: 'Conteúdo completo' }),
    native({ subtitle: 'Conteúdo completo' })
  ].join(''));
  const overlays = dom.window.document.querySelectorAll('.bc-native-reader-overlay,.cf-native-overlay');
  assert.equal([...overlays].filter(node => node.classList.contains('bc-apostila-v1')).length, 6);
  assert.equal(overlays[6].classList.contains('bc-apostila-v1'), false);
  assert.equal(overlays[7].classList.contains('bc-apostila-v1'), false);
  assert.equal(overlays[8].classList.contains('bc-apostila-v1'), false);
});

test('remove o tema quando o mesmo leitor passa a mostrar versão resumida ou conteúdo excluído', async () => {
  const dom = setup(native({ classes: 'bc-native-reader-overlay adm-native-overlay', subtitle: 'DIREITO ADMINISTRATIVO · MÓDULO 01 · COMPLETO' }));
  const overlay = dom.window.document.querySelector('.bc-native-reader-overlay');
  const subtitle = overlay.querySelector('small');
  assert.equal(overlay.classList.contains('bc-apostila-v1'), true);
  subtitle.textContent = 'DIREITO ADMINISTRATIVO · MÓDULO 01 · RESUMIDO';
  await flush(dom);
  assert.equal(overlay.classList.contains('bc-apostila-v1'), false);
  subtitle.textContent = 'DIREITO ADMINISTRATIVO · MÓDULO 08 · COMPLETO';
  await flush(dom);
  assert.equal(overlay.classList.contains('bc-apostila-v1'), true);
  overlay.className = 'bc-native-reader-overlay pt-native-reader';
  await flush(dom);
  assert.equal(overlay.classList.contains('bc-apostila-v1'), false);
});

test('fecha e reabre sem transportar o tema para um elemento reutilizado', async () => {
  const dom = setup('');
  dom.window.document.body.insertAdjacentHTML('beforeend', native({ classes: 'bc-native-reader-overlay cpp-native-overlay', subtitle: 'DIREITO PROCESSUAL PENAL · MÓDULO 01 · COMPLETO' }));
  let overlay = dom.window.document.querySelector('.bc-native-reader-overlay');
  await flush(dom);
  assert.equal(overlay.classList.contains('bc-apostila-v1'), true);
  overlay.remove();
  overlay.querySelector('small').textContent = 'DIREITO PROCESSUAL PENAL · MÓDULO 01 · RESUMIDO';
  dom.window.document.body.append(overlay);
  await flush(dom);
  assert.equal(overlay.classList.contains('bc-apostila-v1'), false);
  overlay.remove();
  dom.window.document.body.insertAdjacentHTML('beforeend', native({ id: 'cpcM20NativeReaderOverlay', subtitle: 'Conteúdo completo' }));
  overlay = dom.window.document.querySelector('.bc-native-reader-overlay');
  await flush(dom);
  assert.equal(overlay.classList.contains('bc-apostila-v1'), true);
});

test('não confunde tela de questões ou texto genérico com apostila completa', () => {
  const dom = setup([
    cf({ subtitle: 'Fixação da completa • 4 fáceis • 4 médias' }),
    native({ id: 'cpcM20NativeReaderOverlay', subtitle: 'Conteúdo resumido' }),
    native({ id: 'bcNativeReaderOverlayM17', subtitle: 'Revisão ativa' })
  ].join(''));
  for (const overlay of dom.window.document.querySelectorAll('.bc-native-reader-overlay,.cf-native-overlay')) {
    assert.equal(overlay.classList.contains('bc-apostila-v1'), false);
  }
});

test('os contratos dos leitores reais expõem identificadores estruturais e rótulos de modo', () => {
  assert.match(nativeSession, /options\.subject \+ '-native-overlay'/);
  assert.match(cfReader, /o\.className='cf-native-overlay'/);
  assert.match(cfReader, /mode==='summary'\?'Teoria resumida/);
  assert.match(cpcReader, /OVERLAY_ID='cpcM08NativeReaderOverlay'/);
  assert.match(cpcReader, /label=mode==='summary'\?'Conteúdo resumido':'Conteúdo completo'/);
  assert.match(penalReader, /OVERLAY_ID='bcNativeReaderOverlayM09'/);
  assert.match(penalReader, /label=mode==='summary'\?'Conteúdo resumido':'Conteúdo completo'/);
});

test('tema preserva tabela semântica e carregamento da aplicação sem seletores globais', () => {
  assert.match(css, /\.bc-apostila-v1 \.bc-native-article table/);
  assert.match(css, /overflow-x:auto/);
  assert.match(css, /\.bc-apostila-v1 \.bc-native-article h1/);
  assert.doesNotMatch(css, /(^|\n)body\s*\{/);
  assert.doesNotMatch(css, /\.pt-native-reader\s*\{/);
  assert.doesNotMatch(css, /\.bc-rlm-overlay\s*\{/);
  assert.match(bootstrap, /legal-complete-premium-v1\.css/);
  assert.match(bootstrap, /tag\('ui\/legal-complete-premium-v1\.js\?v='/);
});
