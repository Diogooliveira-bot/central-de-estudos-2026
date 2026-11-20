# Artes de Revisão Guiada — Direito Constitucional M10

As 12 artes são renderizadas por SVG programático com o arranjo visual do M09. A logomarca e o mascote originais foram reutilizados dos recursos do template existente; os quatro pictogramas de cada capítulo são vetoriais e relacionados ao conteúdo daquele capítulo.

`data.json` é extraído do conteúdo real de `content/cf/m10-teoria-guiada-data.js`, preservando títulos e textos originais para conferência. `art-content.json` contém apenas os resumos editoriais exibidos nas artes.

Geração: `node artes/cf-m10/build.mjs && python3 artes/cf-m10/render.py`.

O processo grava PNGs de 1229 × 1536 em `artes/cf-m10/png/` e WebP otimizados para a aplicação em `assets/cf/revisao-guiada/m10/`.
