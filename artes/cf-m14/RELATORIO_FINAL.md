# Relatório — Artes de Revisão Guiada de Direito Constitucional M14

**Projeto:** Base Completa — Central de Estudos
**Escopo:** somente M14 — Ordem Social e Seguridade Social — Saúde, Previdência e Assistência
**Fonte da revisão:** `content/cf/m14-teoria-guiada-data.js` no repositório informado.

## Mapeamento

Foram encontrados 14 capítulos na seção Revisão Guiada. Os títulos originais foram preservados e listados em `README.md`. Os textos-fonte completos, exemplos, regras, ressalvas, pegadinhas e pontos de memorização estão em `source-topics.json`. Os resumos simplificados utilizados nas imagens estão em `data.json`.

## Artes e figurinhas

Foram produzidas 14 imagens PNG de 1229 × 1536 px, uma por capítulo, com os nomes `CF-M14-C01.png` a `CF-M14-C14.png`. Cada arte utiliza a mesma logomarca e o mesmo mascote oficiais do repositório. Os quatro pictogramas vetoriais foram atualizados para acompanhar o conteúdo: ordem social e justiça; os três pilares da seguridade; proteção urbana/rural; princípios e custeio; saúde e SUS; participação privada; ACS/ACE; RGPS e previdência complementar; assistência e BPC. O ícone de alerta aparece no quadro de pegadinha.

O template é programático e reutilizável em `render.py`; o texto é editável em `data.json`. Também foram geradas 14 versões WebP para a aplicação.

## Revisão jurídica

A revisão respeitou os tópicos e títulos da fonte e conferiu as referências constitucionais dos arts. 193 a 204 e a EC 140/2026 no texto oficial vigente. A arte do capítulo 10 registra a regra permanente de aposentadoria diferenciada de ACS e ACE: 57 anos para mulheres, 60 para homens e 25 anos de contribuição e de efetivo exercício na atividade, sem estendê-la a todas as profissões da saúde. Os pontos de BPC foram mantidos condicionados aos requisitos legais.

Fontes oficiais consultadas:
- Constituição Federal compilada: https://www.planalto.gov.br/ccivil_03/constituicao/constituicao.htm
- Emenda Constitucional 140/2026: https://www.planalto.gov.br/ccivil_03/constituicao/emendas/emc/emc140.htm

## Validação

- 14 títulos comparados com a fonte atual do M14.
- 14 PNGs e 14 WebPs conferidos em 1229 × 1536 px.
- Quatro pictogramas semânticos presentes por capítulo.
- Logomarca e mascote reutilizados de arquivos oficiais versionados.
- Títulos, quebras, alinhamento e margens conferidos visualmente; títulos longos foram ajustados para caber sem sobreposição.
- Revisão de ortografia, legibilidade, ausência de texto cortado e correspondência entre conteúdo e ícones concluída.
- Teste de integridade de arquivos e referências executado em `tests/cf-m14-guided-infographics-unit.mjs`.

## Integração

O leitor da Revisão Guiada foi ajustado para acrescentar cada WebP ao final do capítulo correspondente no M14. As imagens usam `/assets/cf/revisao-guiada/m14/`, com carregamento preguiçoso, decodificação assíncrona e dimensões declaradas. A referência de cache foi atualizada também no arquivo offline. Os textos originais, questões e dados de outros módulos não foram modificados.

## Testes e publicação

Os testes focados de M12, M13 e M14 passaram: 11 aprovados, 0 falhas. As 14 PNGs e 14 WebPs foram verificadas em 1229 × 1536 px, sem duplicidade.

A suíte geral tem três falhas que foram reproduzidas na `main`: validação de cache de `cf-weeks-001.js`, referência de bancos removidos e primeira linha de `index.html`. O verificador da Central passou sintaxe, recursos, cache e ausência de segredos, mas bloqueou a publicação porque `index.html` já contém texto “truncated output” antes do doctype. Essa falha está fora do escopo exclusivo do M14.

**Status:** alterações preparadas no PR #373 e prévia criada; produção não publicada devido ao bloqueio preexistente do verificador. Não alterei o conteúdo global da página para contornar essa falha.
