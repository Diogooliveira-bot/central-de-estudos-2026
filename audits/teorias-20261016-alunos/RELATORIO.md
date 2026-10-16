# Revisão do conteúdo acessível aos alunos — continuidade de 16/10/2026

Esta rodada corrige **prescrição em Processo do Trabalho M07 e M17**, nas versões completa e resumida, nos comentários e nas questões diretamente dependentes. Há correções textuais exibidas junto aos dois infográficos. A base é o commit `8145f11baf4559204b601211920a41c82680dc83` do PR #99. Não houve merge ou publicação em produção.

## Resultado

| Achado | Material acessível | Correção |
|---|---|---|
| J11 — Lei 14.010/2020 | M07 completa/resumida e questão 10 completa | Corrigido o início do intervalo de 10/06 para **12/06/2020**, publicação e entrada em vigor da lei. Intervalo até 30/10/2020: 141 dias. Tema 46/TST confirma aplicação às prescrições bienal e quinquenal, sem prova de dificuldade de acesso ao Judiciário. Não aplicar acréscimo indiscriminado fora dos prazos alcançados pelo intervalo. |
| J12 — Protesto judicial | M07 completa/resumida | Retirada a pendência antiga sobre OJ 392: Tema 170/TST confirma efeito interruptivo do protesto judicial mesmo depois da Reforma. |
| J13 — Prescrição de ofício | M07 completa/resumida | Integrada a tese divulgada para o Tema 91/TST em 24/9/2026: arguição pela parte beneficiada, na instância ordinária; exceção expressa para intercorrente. Não presumido trânsito em julgado dos julgamentos recentes. |
| J14 — Prescrição intercorrente | M07 e M17, ambas as versões; M07 resumo Q4 e M17 completa Q6 | Tema 39/TST, divulgado em 22/9/2026: inércia qualificada após ordem expedida desde 11/11/2017, independentemente do trânsito do título; intimação específica, com advertência e contextualizada; pessoal ao credor, sem prejuízo do advogado; oitiva antes do reconhecimento, sob pena de nulidade. Fluxos e questões harmonizados. |
| J15 — Enunciados cancelados | M07 e referência histórica do M17 | Identificado o cancelamento das Súmulas 114, 268, 294 e 452 pela Resolução TST 225/2025. A regra dos pedidos idênticos é ensinada pelo art. 11, § 3º, da CLT. A OJ 375 não foi confundida com a Súmula 375. |

As três questões alteradas mantêm os IDs e as respostas corretas. No M07 completa Q10, também foi corrigida a data da alternativa B. O arquivo `alteracoes-conteudo.diff` permite ler as mudanças do pacote binário; `alteracoes.json` registra 50 substituições pontuais de texto, além da sincronização dos dados interativos e das datas.

## Infográficos acessíveis

Foram inspecionadas as imagens efetivamente abertas em `assets/ptra/m07/infografico.avif` e `assets/ptra/m17/infografico.avif`. A imagem M07 apresenta a data errada e a afirmação de interrupção somente por reclamação; seu fluxo intercorrente também omite garantias importantes. A imagem M17 resume o prazo de dois anos sem os requisitos posteriores.

As imagens originais não foram redesenhadas. Ao abri-las, o aluno passa a ver um bloco de correções jurídicas **antes da imagem**, com indicação de que devem ser aplicadas ao original. Os demais módulos não recebem esse bloco. O zoom continua disponível. Esta solução corrige o contexto de consulta na central; o arquivo de imagem isolado continua sendo a edição original.

## Cobertura e próximo ponto de retomada

São **quatro trilhas com revisão pontual nesta rodada**. Somadas às 14 da rodada anterior de 16/10, são 18 trilhas em nove módulos com correções identificadas. Isso não representa revisão integral de nenhum módulo ou disciplina. O inventário atualizado conserva os estados individuais e os hashes dos 349 textos extraídos, sem vazios.

Foram lidos os textos do M07 e examinados os trechos dependentes do M17. A leitura não foi convertida em certificação de todos os precedentes, situações especiais ou prazos. Os módulos M01, M03, M05 e M06 tiveram leitura e pesquisa preliminares; não estão encerrados. Retomar especialmente:

- M03: competência e andamento atual do Tema 1389/STF; contratos temporários administrativos; alcance territorial do art. 651, § 3º; conflitos de competência. Pesquisas oficiais já indicaram levantamento parcial da suspensão em junho/2026 e esclarecimento sobre esgotamento da jurisdição regional. Falta concluir o cotejo e harmonizar o material.
- M05/M06: DJEN e Domicílio Judicial Eletrônico, distinção entre citação e intimação pessoal, saneamento de feriado local após a Lei 14.939/2024. Não foram aplicadas substituições genéricas a prazos de dez dias.
- M01: negócios processuais e IN 39; tentativas de conciliação; alcance da identidade física do juiz.
- Demais disciplinas e infográficos: continuar a revisão individual. `triagem-sumulas.json` contém 179 ocorrências em 28 textos, encontradas automaticamente a partir de números de enunciados da Resolução 225/2025. São pistas: há referências históricas, cancelamentos já sinalizados e possíveis enunciados de outro tribunal. Não são 179 erros confirmados.

O escopo permanece exclusivamente o que o aluno acessa: teoria completa e resumida, questões/comentários e infográficos exibidos. PDFs usados apenas como fonte, ZIPs, versões antigas e administração não integram os entregáveis.

## Fontes e validação

Fontes oficiais e forma de consulta constam em `fontes.json`. A resolução foi baixada e lida integralmente; dispositivos legais e teses foram conferidos em fontes institucionais. Alguns portais recusaram abertura direta; nesses casos foram consultados trechos indexados das próprias páginas oficiais e registros de precedentes de tribunais. Não há afirmação de leitura integral dos acórdãos recentes nem de trânsito em julgado quando não confirmado.

Validação final em `validacao.json`: pacote decodificado, 19 módulos não alterados nesta rodada preservados por hash, 315 questões e identificadores de progresso preservados, 300 gabaritos escritos comparados com os interativos. Testes verificam os pontos jurídicos corrigidos e a abertura dos infográficos com notas, zoom e histórico preservado. O teste em DOM não certifica a aparência em navegador; permanece a limitação anterior de Chromium indisponível.
