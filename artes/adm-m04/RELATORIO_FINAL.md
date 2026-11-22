# Relatório final — Direito Administrativo M04

## Estrutura usada

O arquivo de revisão do aluno `content/adm/autor-20261110/adm-m04-submitted-review.js` contém nove capítulos. Os quatro blocos de `content/adm/adm-review-didactic-m01-m05.js` são agrupamentos didáticos e não coincidem com os capítulos mostrados ao aluno. A produção e a associação foram conferidas contra os nove títulos reais da Revisão Guiada:

1. A ideia de poder-dever e seus limites
2. Poder hierárquico: organizar e coordenar
3. Delegação, avocação e distribuição de competências
4. Poder disciplinar: apurar e responsabilizar
5. Poder regulamentar e poder normativo
6. Poder de polícia administrativa
7. Discricionariedade, vinculação e controle
8. Abuso de poder: excesso e desvio
9. Como identificar o poder em situações concretas

## Artes e integração

- 9 PNG verticais (1229 × 1536), numerados `ADM-M04-C01.png` a `ADM-M04-C09.png`.
- 9 WebP otimizados para carregamento, usados pela Central na pasta `assets/adm/revisao-guiada/m04/`.
- Cada arte contém logomarca e mascote oficiais do projeto, faixas de disciplina/capítulo/assunto, ponto central, quatro quadros com ícones temáticos e dica de prova.
- Os SVGs editáveis, dados de conteúdo e scripts de montagem foram preservados nesta pasta.
- O carregador só injeta as imagens no resumo (`mode === 'summary'`) e valida a ordem e os nove títulos esperados. O ramo do Conteúdo Completo retorna o original antes da chamada de integração.
- Os caminhos das imagens M04 foram incluídos no manifesto offline. O CSS existente restringe a arte ao contêiner de leitura, usa largura fluida e preserva a proporção vertical.
- Nenhum arquivo de teoria completa, texto de capítulo, questão ou outro módulo foi alterado.

## Revisão jurídica

O texto foi mantido curto e alinhado à Revisão Guiada. A conferência legal usou as fontes oficiais:

- [Constituição Federal — arts. 49, V, e 84, IV e VI](https://www.planalto.gov.br/ccivil_03/constituicao/constituicao.htm)
- [Lei 9.784/1999 — arts. 11 a 15](https://www.planalto.gov.br/ccivil_03/leis/l9784.htm)
- [Código Tributário Nacional — art. 78](https://www.planalto.gov.br/ccivil_03/leis/l5172compilado.htm)
- [Lei 13.869/2019 — art. 1º, §§ 1º e 2º](https://www.planalto.gov.br/ccivil_03/_ato2019-2022/2019/lei/l13869.htm)

## Verificações

- Renderização validada por limites de texto, dimensões, abertura dos nove PNGs e inspeção do painel geral e das artes com mais texto. Não foram observados cortes, sobreposições ou desalinhamentos.
- Testes automatizados ADM M02/M03/M04: 4 passaram, 0 falharam. A cobertura confirma a posição de cada arte, a associação pelo título e a ausência de imagens no Conteúdo Completo.
- `node --check` passou para os scripts alterados e JSONs validados.
- A suíte `npm test` foi iniciada, mas não pôde ser concluída neste checkout esparso: testes não relacionados ao M04 tentam ler arquivos fora das pastas disponíveis, por exemplo `api/content-editor.js` e `api/objective.js`. Os testes específicos de ADM acima passaram.
- O teste visual de imagens em contexto autenticado não foi realizado. A validação de layout responsivo foi feita pelo CSS compartilhado (`width: 100%`, `height: auto`, limite de largura e regra para telas de até 640 px) e pela inspeção das artes renderizadas.

## Publicação

- Publicado em produção pela Vercel no domínio [app.basecompleta.com.br](https://app.basecompleta.com.br).
- Deploy: `dpl_C1q1Dsu49CxYQ7mcW2eUhPAXTwez` (READY), associado ao commit `646cd4aa7ad0acac62c5d1a2c90ab767597b82c6`.
- Deploy de produção: https://central-de-estudos-qkjyuajz9-estudotd.vercel.app
