# Artes de Revisão Guiada — CF M03

Pacote programático para os 12 capítulos reais da Revisão Guiada de Direito Constitucional, módulo M3.

## Conteúdo

- `png/CF-M03-C01.png` a `CF-M03-C12.png`: artes finais em 1229 × 1536 px.
- `data.json`: conteúdo resumido das artes e títulos originais dos capítulos.
- `template-assets/`: recortes da logomarca, do personagem e dos quatro ícones usados nas referências anexadas.
- `scripts/generate-cf-m03-infographics.py`: template SVG programático e renderização em lote via Inkscape.
- `assets/cf/revisao-guiada/m03/`: WebP otimizados, usados pela Central.
- `migrations/cf-m03-guided-infographics-20261118.sql`: atualização segura do HTML da Revisão Guiada.

## Regenerar

Na raiz do repositório, execute:

```bash
python scripts/generate-cf-m03-infographics.py
```

O script gera os SVGs de trabalho e os PNGs finais. O texto de cada arte vem de `artes/cf-m03/data.json`; a estrutura, as cores, as posições, os quadros, os ícones e a tipografia são definidos pelo mesmo template SVG no script.

## Precisão jurídica

Os resumos foram conferidos com a Constituição Federal e a Emenda Constitucional nº 141, de 16 de outubro de 2026. A arte do capítulo 2 registra a fase de transição prevista para começar em 16 de dezembro de 2026; não altera a redação original da Revisão Guiada.

Fontes oficiais:

- [Constituição Federal — Portal da Legislação](https://www4.planalto.gov.br/legislacao/legis-federal/constituicao)
- [Resenha diária da legislação — outubro de 2026](https://www4.planalto.gov.br/legislacao/legislacao/portal-legis/resenha-diaria/outubro-resenha-diaria.html)
