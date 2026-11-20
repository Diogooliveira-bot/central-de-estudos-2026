# Artes de Revisão Guiada — Direito Constitucional M8

O pacote gera uma arte para cada capítulo real do M8, extraindo títulos e texto completo de `content/cf/m08-teoria-guiada-data.js`.

## Template e figuras

- Template programático reutilizável, em 1229 × 1536 px, derivado do padrão visual aprovado no M6.
- Usa os arquivos originais do mascote e da logo, sem redesenhá-los.
- Os quatro marcadores alinhados dos quadros são 1, 2, 3 e !, conforme o padrão aplicado no M6.
- `art-content.json` mantém separados o resumo visual e o conteúdo fonte completo guardado em `data.json`.

## Gerar

Na raiz do repositório:

```sh
node artes/cf-m08/build.mjs
python3 artes/cf-m08/render.py
```

O processo gera os PNGs em `artes/cf-m08/png/` e os WebPs otimizados em `assets/cf/revisao-guiada/m08/`.
