# Relatório — Direito Administrativo M07: LINDB

## Escopo e capítulos reais

A fonte principal foi `content/adm/autor-20261110/adm-m07-submitted-review.js`, o conteúdo da Revisão Guiada efetivamente carregado ao aluno. Ela contém dez capítulos numerados. O arquivo `content/adm/adm-review-didactic-m06-m10.js` apresenta cinco blocos de estudo, que agrupam temas e não correspondem um a um aos títulos apresentados ao aluno. O índice `adm-session-index.js` lista 13 sessões do Conteúdo Completo e foi usado somente para confirmar que se trata de outra estrutura.

| Blocos da Revisão Didática | Capítulos da Revisão Guiada usados nas artes |
|---|---|
| Consequências práticas | C01 introduz os limites da LINDB; C02 aborda o art. 20; C03, o art. 21 |
| Art. 22 | C04 |
| Arts. 23 e 24 | C05 |
| Arts. 26 a 30 | C06 a C09 |
| Mapa de memorização | Consolida sobretudo C02 a C09; C10 é o capítulo real adicional sobre o Decreto 9.830/2019 |

Títulos preservados literalmente: (01) Por que a LINDB importa para a Administração?; (02) Art. 20 — consequências práticas e motivação; (03) Art. 21 — invalidação e regularização; (04) Art. 22 — dificuldades reais da gestão pública; (05) Arts. 23 e 24 — segurança diante de mudanças; (06) Art. 26 — compromisso para resolver problemas; (07) Art. 27 — compensações por efeitos injustos; (08) Art. 28 — responsabilização por dolo ou erro grosseiro; (09) Arts. 29 e 30 — participação e previsibilidade; (10) Como o Decreto nº 9.830/2019 complementa a LINDB.

## Produção e integração

- 10 artes PNG, em 1229 × 1536 px, com 10 versões WebP otimizadas.
- Logo e mascote reaproveitados de `artes/adm-m05/template-assets/`, já usados nas artes aprovadas de Direito Administrativo.
- Cada arte contém Ponto Central, quatro quadros e Dica de Prova, com pictogramas vetoriais relacionados ao tema.
- As WebP são associadas ao fim dos dez capítulos numerados no modo Revisão Guiada, com carregamento lazy. O leitor devolve o HTML original do Conteúdo Completo antes de qualquer lógica de artes.
- O manifesto offline inclui apenas os dez arquivos M07 e a versão atualizada do leitor.

## Revisão jurídica e visual

O conteúdo das artes foi conferido contra o Decreto-Lei 4.657/1942 (LINDB) e o Decreto 9.830/2019, em suas páginas oficiais do Planalto. Foram preservadas estas distinções: consequência não afasta legalidade; invalidação exige motivar efeitos e pode demandar regularização; contexto do gestor não é imunidade; art. 23 trata de transição e art. 24 da orientação geral da época; a responsabilidade pessoal do art. 28 exige dolo ou erro grosseiro; consulta do art. 29 não é automaticamente obrigatória; e instrumentos do art. 30 vinculam o órgão até revisão.

Fontes oficiais: [LINDB — Decreto-Lei 4.657/1942](https://www.planalto.gov.br/ccivil_03/decreto-lei/del4657compilado.htm) e [Decreto 9.830/2019](https://www.planalto.gov.br/ccivil_03/_ato2019-2022/2019/decreto/d9830.htm).

A arte C10 registra que o art. 18 do Decreto 9.830/2019 foi revogado em 2024 e distingue essa revogação do art. 29 da LINDB, que prevê consulta pública. O art. 25 da LINDB não foi apresentado como vigente.

As dez imagens renderizadas foram conferidas em folha de contato e em resolução integral (incluindo C05 e C10). O renderizador calcula quebras por largura de fonte e interrompe se qualquer bloco exceder o limite de linhas. Todas as dimensões são conferidas após renderização. Não foram observados texto cortado, sobreposição, desalinhamento ou ícone sem relação com o assunto.

## Testes e publicação

- `node artes/adm-m07/build.mjs`: inventário validado contra os dez títulos da revisão real.
- `python artes/adm-m07/render.py`: 10 PNG e 10 WebP renderizados com sucesso.
- Teste M07: 3 verificações aprovadas — ordem/títulos/imagens, isolamento do Conteúdo Completo e manifesto offline.
- Regressão didática e do guia ADM: 6 verificações aprovadas.
- Regressão do ADM (`npm run test:adm-didatico`): 16 testes aprovados; responsividade (`npm run test:responsive`): 20 testes aprovados. O teste M07 também confirma a regra CSS de largura fluida, altura proporcional e breakpoint para telas estreitas.
- O teste abrangente `adm-apostila-reading-unit.mjs` tem uma falha em um recurso preexistente fora do M07: `assets/adm/revisao-guiada/m02/ADM-M02-C01.png` não possui assinatura PNG. Nenhum arquivo M02 foi alterado; as verificações M07 e de isolamento passaram.
- Acesso autenticado à Central: não usado. As dez artes foram inspecionadas em prévia local; as regras de adaptação por largura foram verificadas nos testes, sem alegar uma sessão real em navegador autenticado.
- Publicação de produção: pendente da consolidação e checagem de deployment no Vercel.
