# Relatório — Revisão Guiada de Direito Constitucional, M3

**Data:** 18/11/2026
**Escopo:** exclusivamente módulo M3, “Direitos sociais, nacionalidade e direitos políticos”.

## Mapeamento e artes

Foram identificados 12 capítulos na Revisão Guiada real do M3. Foram produzidas 12 artes em PNG de 1229 × 1536 px, com os títulos originais e numeração de capítulo correspondente.

1. Direitos sociais: por que a Constituição os protege
2. Direitos dos trabalhadores e a EC 141/2026
3. Liberdade sindical, greve e representação
4. Nacionalidade: brasileiro nato e naturalizado
5. Cargos privativos e extradição
6. Perda de nacionalidade e EC 131/2023
7. Soberania popular e formas de participação
8. Quem vota: obrigatório, facultativo e inalistável
9. Elegibilidade e idades mínimas
10. Reeleição, desincompatibilização e inelegibilidades
11. Perda, suspensão e anualidade eleitoral
12. Partidos políticos: criação, registro e coligações

As imagens reutilizam recortes da logomarca, do personagem e dos ícones visíveis nas referências anexadas. O layout foi montado por template SVG programático e conteúdo separado em JSON; não foram criadas ilustrações novas por IA. A Central recebe WebP otimizados, com carregamento `lazy` e dimensões declaradas.

## Revisão jurídica

Os resumos foram conferidos com o conteúdo vigente da Constituição Federal. O capítulo 2 registra a EC 141/2026: etapa de 42 horas e dois repousos semanais a partir de 16/12/2026 e limite de 40 horas a partir de 16/12/2027. Após revisão final, a arte também passou a mencionar a liminar do STF de 12/11/2026, sujeita a referendo do Plenário: na falta de ACT/CCT até 15/12, admite distribuir as 42 horas em cinco dias de até 8h24 durante a transição.

A legislação original da Revisão Guiada não foi editada; a atualização incorpora somente as imagens após cada capítulo.

## Validação

- 12 títulos comparados com `content/cf/m03-teoria-guiada-data.js`.
- 12 PNGs conferidos em 1229 × 1536 px.
- Logomarca, personagem e ícones conferidos visualmente.
- Ortografia, títulos, margens, legibilidade e encaixe de texto conferidos visualmente.
- Migração executada contra cópia de teste do HTML real do M3: atualização para revisão 6, 12 figuras encontradas e um registro de histórico criado.
- `npm test`: 452 testes executados, 451 aprovados, 0 falhas, 1 ignorado.
- Teste dedicado de M3: 3 aprovados, 0 falhas.

## Integração e publicação

A migração `migrations/cf-m03-guided-infographics-20261118.sql` altera somente `reader:19pwkh3`, condicionado à revisão 5 sem figuras e à existência dos 12 capítulos. Cada arte é inserida no fechamento do capítulo correspondente, imediatamente antes do capítulo seguinte; a arte 12 é inserida antes da síntese final. Os outros módulos e os textos/questões do M3 não são atualizados.

Publicação concluída em 18/11/2026:

- Código e imagens estáticas enviados à branch `main` do repositório; deploy final da Vercel concluído no ambiente de produção.
- A arte C02 foi atualizada para incluir a liminar do STF de 12/11/2026 e republicada junto aos demais arquivos do M3.
- Deploy da Vercel concluído com status `READY` no ambiente de produção.
- Migração aplicada na branch de produção do Neon. `reader:19pwkh3` passou da revisão 5 para a 6 e recebeu 12 figuras; a revisão anterior foi preservada no histórico.
- Conferência pós-publicação: 12 seções de capítulo e 12 artes no conteúdo do M3. Os arquivos estão sob autenticação da Central e são carregados na sessão dos alunos.
- Nenhum outro módulo foi alterado pela migração.

Fontes oficiais para a atualização do capítulo 2:

- [Constituição Federal — Portal da Legislação](https://www4.planalto.gov.br/legislacao/legis-federal/constituicao)
- [Emenda Constitucional nº 141/2026 — Câmara dos Deputados](https://www2.camara.leg.br/legin/fed/emecon/2026/emendaconstitucional-141-16-outubro-2026-800062-publicacaooriginal-181622-pl.html)
- [Decisão liminar do STF sobre a transição](https://noticias.stf.jus.br/postsnoticias/stf-mantem-regra-de-transicao-para-implementacao-da-jornada-5x2/)

