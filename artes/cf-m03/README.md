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

Os resumos foram conferidos com a Constituição Federal, a Emenda Constitucional nº 141/2026 e a liminar do STF de 12/11/2026, sujeita a referendo do Plenário. A arte do capítulo 2 registra as datas da transição constitucional e a decisão provisória sobre a distribuição das 42 horas na falta de ACT/CCT; não altera a redação original da Revisão Guiada.

Fontes oficiais:

- [Constituição Federal — Portal da Legislação](https://www4.planalto.gov.br/legislacao/legis-federal/constituicao)
- [Resenha diária da legislação — outubro de 2026](https://www4.planalto.gov.br/legislacao/legislacao/portal-legis/resenha-diaria/outubro-resenha-diaria.html)
- [Emenda Constitucional nº 141/2026 — publicação original](https://www2.camara.leg.br/legin/fed/emecon/2026/emendaconstitucional-141-16-outubro-2026-800062-publicacaooriginal-181622-pl.html)
- [Liminar do STF sobre a transição](https://noticias.stf.jus.br/postsnoticias/stf-mantem-regra-de-transicao-para-implementacao-da-jornada-5x2/)
