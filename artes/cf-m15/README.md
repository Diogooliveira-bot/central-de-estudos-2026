# Artes de Revisão Guiada — Direito Constitucional M15

O escopo usa os 13 capítulos reais de `content/cf/m15-teoria-guiada-data.js`, sem alterar a ordem ou os títulos.

## Renderizar

```bash
python3 artes/cf-m15/render.py
```

O renderer usa um template SVG programático e dados JSON, reutiliza a logomarca e o mascote originais de M13, e desenha quatro pictogramas específicos para cada capítulo. São produzidos PNGs de 1229 × 1536 px e WebPs otimizados em `assets/cf/revisao-guiada/m15/`.

## Arquivos

- `data.json`: conteúdo condensado usado nas artes.
- `icons_m15.py`: desenhos vetoriais específicos do módulo.
- `render.py`: template/renderizador reutilizável.
- `template-assets/`: logomarca e mascote originais.
- `png/`: artes PNG finais.
- `preview-contact-sheet.jpg`: prévia de todas as artes.
- `RELATORIO.md`: mapeamento dos capítulos e revisão jurídica.
