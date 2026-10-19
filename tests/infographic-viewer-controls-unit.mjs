import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { JSDOM } from 'jsdom';

const source = await readFile(new URL('../ui/infographic-viewer-controls-v1.js', import.meta.url), 'utf8');

function makeDom() {
  const dom = new JSDOM(`<!doctype html><html><body>
    <div class="cf-native-overlay"><section class="cf-native-shell"><header><b>Constitucional M01</b></header><div class="cf-native-map"><img alt="Infográfico M01" src="/assets/cf/m01.avif"></div></section></div>
    <div class="adm-native-image-viewer"><header><b>Administrativo M01</b></header><div id="adm-native-image-host"><svg viewBox="0 0 400 800" role="img" aria-label="Infográfico Administrativo M01"><image href="/assets/adm/sprite.webp"></image></svg></div></div>
  </body></html>`, { url: 'https://preview.example.test/central-v119.html', runScripts: 'outside-only', pretendToBeVisual: true });
  dom.window.eval(source);
  return dom;
}

test('imagem e infográfico vetorial recebem controles acessíveis de zoom e download', () => {
  const dom = makeDom();
  const { document } = dom.window;
  const imageViewer = document.querySelector('.cf-native-overlay');
  const vectorViewer = document.querySelector('.adm-native-image-viewer');
  for (const viewer of [imageViewer, vectorViewer]) {
    const controls = viewer.querySelector('[data-bc-infographic-controls]');
    assert.ok(controls, 'cada visualizador ativo recebe sua barra de controles');
    assert.equal(controls.querySelectorAll('button[data-bc-zoom]').length, 3);
    assert.ok(controls.querySelector('[data-bc-download]'));
  }
  assert.equal(imageViewer.querySelector('img').getAttribute('data-bc-zoom'), '1');
  imageViewer.querySelector('[data-bc-zoom="in"]').click();
  assert.equal(imageViewer.querySelector('img').getAttribute('data-bc-zoom'), '1.25');
  assert.equal(imageViewer.querySelector('[data-bc-zoom-value]').textContent, '125%');
  imageViewer.querySelector('[data-bc-zoom="fit"]').click();
  assert.equal(imageViewer.querySelector('img').getAttribute('data-bc-zoom'), '1');
  dom.window.close();
});

test('visualizadores carregados depois da abertura também recebem os controles', async () => {
  const dom = makeDom();
  const { document } = dom.window;
  const viewer = document.createElement('div');
  viewer.className = 'cv-image-viewer';
  viewer.innerHTML = '<header><b>Civil M01</b></header><div><img id="cv-img" alt="Infográfico Civil M01" src="/assets/civil/m01.png"></div>';
  document.body.append(viewer);
  await new Promise((resolve) => dom.window.setTimeout(resolve, 0));
  assert.ok(viewer.querySelector('[data-bc-infographic-controls]'));
  assert.equal(viewer.querySelector('img').classList.contains('bc-infographic-graphic'), true);
  dom.window.close();
});
