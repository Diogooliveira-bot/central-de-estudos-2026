# Artes de Revisão Guiada — Direito Constitucional M11

O conteúdo e os títulos são mapeados diretamente de `content/cf/m11-teoria-guiada-data.js`. A renderização reutiliza o template programático do M10 e os arquivos originais de logomarca e mascote. Os quatro pictogramas de cada arte são vetoriais, variam por capítulo e representam o assunto dos quadros.

## Gerar

```sh
node artes/cf-m11/build.mjs
python3 artes/cf-m11/render.py
```

Gera 12 PNGs de 1229 × 1536 em `artes/cf-m11/png/` e versões WebP otimizadas em `assets/cf/revisao-guiada/m11/`.
