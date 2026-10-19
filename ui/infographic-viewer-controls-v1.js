(function (global) {
  'use strict';
  if (global.BaseCompletaInfographicControls) return;

  const selectors = [
    '.cf-native-overlay .cf-native-map img',
    '.cv-image-viewer img',
    '.adm-native-image-viewer svg',
    '.cpp-native-image-viewer svg',
    '.ptra-native-image-viewer img',
  ].join(',');
  const clamp = (value) => Math.max(0.5, Math.min(3, value));

  function filename(graphic) {
    const label = graphic.getAttribute('alt') || graphic.getAttribute('aria-label') ||
      graphic.closest('[role="dialog"]')?.getAttribute('aria-label') ||
      document.querySelector('.cv-image-viewer header b, .adm-native-image-viewer header b, .cpp-native-image-viewer header b')?.textContent ||
      'infografico';
    return label.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()
      .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 72) || 'infografico';
  }

  async function svgDownload(svg, name) {
    const copy = svg.cloneNode(true);
    copy.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    for (const image of copy.querySelectorAll('image')) {
      const href = image.getAttribute('href') || image.getAttributeNS('http://www.w3.org/1999/xlink', 'href');
      if (!href || href.startsWith('data:')) continue;
      const response = await fetch(new URL(href, document.baseURI).href, { credentials: 'same-origin' });
      if (!response.ok) throw new Error('Não foi possível preparar a imagem para download.');
      const blob = await response.blob();
      const bytes = new Uint8Array(await blob.arrayBuffer());
      let binary = '';
      for (let offset = 0; offset < bytes.length; offset += 0x8000) {
        binary += String.fromCharCode(...bytes.subarray(offset, offset + 0x8000));
      }
      image.setAttribute('href', 'data:' + (blob.type || 'application/octet-stream') + ';base64,' + btoa(binary));
    }
    const blob = new Blob([new XMLSerializer().serializeToString(copy)], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url; link.download = name + '.svg'; link.hidden = true;
    document.body.appendChild(link); link.click(); link.remove();
    global.setTimeout(() => URL.revokeObjectURL(url), 30000);
  }

  function enhance(graphic) {
    const host = graphic.closest('.cf-native-overlay, .cv-image-viewer, .adm-native-image-viewer, .cpp-native-image-viewer, .ptra-native-image-viewer');
    if (!host || host.querySelector('[data-bc-infographic-controls]')) return;
    host.classList.add('bc-infographic-viewer');
    graphic.classList.add('bc-infographic-graphic');
    const stage = graphic.closest('.cf-native-map, .cv-image-viewer>div, #adm-native-image-host, #cpp-native-image-host, .ptra-native-image-viewer') || graphic.parentElement;
    stage?.classList.add('bc-infographic-stage');

    let zoom = 1;
    const applyZoom = () => {
      graphic.style.setProperty('--bc-infographic-zoom', String(zoom));
      graphic.setAttribute('data-bc-zoom', String(zoom));
    };
    const toolbar = document.createElement('nav');
    toolbar.className = 'bc-infographic-controls';
    toolbar.dataset.bcInfographicControls = '1';
    toolbar.setAttribute('aria-label', 'Controles do infográfico');
    toolbar.innerHTML = '<button type="button" data-bc-zoom="out" aria-label="Diminuir zoom">−</button>' +
      '<span data-bc-zoom-value aria-live="polite">100%</span>' +
      '<button type="button" data-bc-zoom="in" aria-label="Aumentar zoom">+</button>' +
      '<button type="button" data-bc-zoom="fit">Ajustar</button>' +
      '<button type="button" data-bc-download>Baixar imagem</button>';
    const header = host.querySelector(':scope > header, .cf-native-shell > header');
    if (header) header.insertAdjacentElement('afterend', toolbar);
    else host.insertAdjacentElement('afterbegin', toolbar);
    applyZoom();

    toolbar.addEventListener('click', (event) => {
      const button = event.target.closest('button');
      if (!button) return;
      if (button.dataset.bcZoom === 'out') zoom = clamp(zoom - 0.25);
      else if (button.dataset.bcZoom === 'in') zoom = clamp(zoom + 0.25);
      else if (button.dataset.bcZoom === 'fit') zoom = 1;
      else if (button.hasAttribute('data-bc-download')) {
        if (graphic instanceof global.SVGElement) {
          button.disabled = true;
          svgDownload(graphic, filename(graphic)).catch((error) => {
            const value = toolbar.querySelector('[data-bc-zoom-value]');
            if (value) value.textContent = error.message;
          }).finally(() => { button.disabled = false; });
        }
        else {
          const link = document.createElement('a');
          link.href = graphic.currentSrc || graphic.src;
          link.download = filename(graphic) + (new URL(link.href, document.baseURI).pathname.match(/\.[a-z0-9]{2,5}$/i)?.[0] || '.png');
          link.hidden = true; document.body.appendChild(link); link.click(); link.remove();
        }
        return;
      } else return;
      const value = toolbar.querySelector('[data-bc-zoom-value]');
      if (value) value.textContent = Math.round(zoom * 100) + '%';
      applyZoom();
    });
  }

  function scan(root = document) {
    root.querySelectorAll?.(selectors).forEach(enhance);
  }

  global.BaseCompletaInfographicControls = { scan };
  scan();
  new MutationObserver((records) => {
    for (const record of records) for (const node of record.addedNodes) {
      if (node.nodeType !== 1) continue;
      if (node.matches?.(selectors)) enhance(node);
      scan(node);
    }
  }).observe(document.documentElement, { childList: true, subtree: true });
})(window);
