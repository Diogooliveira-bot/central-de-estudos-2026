# Artes de Revisão Guiada — CF M04

Pacote para os 14 capítulos reais de **Organização do Estado** na Revisão Guiada de Direito Constitucional.

- `png/CF-M04-C01.png` a `png/CF-M04-C14.png`: artes finais em 1229 × 1536 px.
- `data.json`: títulos e textos compactos derivados dos tópicos reais do M4.
- `template.html` e `template-assets/`: base visual, logomarca, mascote e ícones reaproveitados do template já existente.
- `../../scripts/generate-cf-m04-infographics.py`: renderizador SVG programático do mesmo layout.
- `../../assets/cf/revisao-guiada/m04/`: WebP usados pela Central para carregamento responsivo e eficiente.

## Regenerar

Na raiz do repositório, execute `python scripts/generate-cf-m04-infographics.py`.

O gerador substitui apenas os dados textuais e mantém dimensões, cores, tipografia, personagem, logomarca, ícones, posições e quadros. Os SVGs intermediários são gerados localmente; os PNGs são os arquivos finais.

## Revisão jurídica

Os artigos e conceitos foram conferidos com a Constituição Federal vigente, incluindo a EC 139/2026 (arts. 31 e 75) e a LC 230/2026 (art. 18, § 4º). A síntese da ADI 2650 segue o entendimento do STF de consulta a toda a população do Estado envolvido. O quadro sobre símbolos religiosos incorpora a tese do Tema 1086 do STF, com a condição relativa à manifestação da tradição cultural brasileira.

Fontes oficiais:

- [Constituição Federal — Planalto](https://www4.planalto.gov.br/legislacao/legis-federal/constituicao)
- [Emenda Constitucional nº 139/2026 — Câmara dos Deputados](https://www2.camara.leg.br/legin/fed/emecon/2026/emendaconstitucional-139-5-maio-2026-799072-publicacaooriginal-179182-pl.html)
- [Lei Complementar nº 230/2026 — Câmara dos Deputados](https://www2.camara.leg.br/legin/fed/leicom/2026/leicomplementar-230-15-abril-2026-798953-norma-pl.html)
- [ADI 2650 — STF](https://portal.stf.jus.br/peticaoInicial/verPeticaoInicial.asp?base=ADI&numProcesso=2650)
- [Tema 1086 — STF](https://portal.stf.jus.br/processos/detalhe.asp?incidente=5827249)

