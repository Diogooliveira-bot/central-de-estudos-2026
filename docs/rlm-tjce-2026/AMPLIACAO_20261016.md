# RLM — edição ampliada para revisão

A teoria dos módulos M02–M15 foi ampliada mantendo os capítulos, o treino original M01, as 140 questões autorais, a revisão cumulativa e o banco legado. As correções anteriores de conceitos foram preservadas.

## Entrega

- 70 capítulos com desenvolvimento adicional, método em três etapas, exemplo guiado com resposta oculta e erro comum explicado.
- 70 novos exemplos guiados, além dos exemplos rápidos anteriores.
- 36 tabelas com cabeçalhos e legendas semânticas.
- 10 ilustrações vetoriais: conjuntos, matriz de setas, direções, trajeto, linha do tempo e gráficos estatísticos.
- Um novo ponto de revisão e um ramo de método aplicado em cada módulo.
- Leituras de apoio identificadas ao final de cada módulo.
- Aproximadamente 19,6 mil palavras na teoria, incluindo títulos, exposição, métodos e exemplos; a contagem não inclui tabelas, resumos, mapas ou questões.

Os arquivos originais de aulas são carregados primeiro. O complemento é aplicado uma vez e adiciona campos de desenvolvimento, métodos, exemplos e recursos visuais sem substituir as perguntas. O renderizador compartilhado é usado no leitor nativo e nas duas prévias existentes.

## Recorte didático

Lógica recebe tabelas-verdade completas, negações, contraexemplos e argumentos. Conjuntos recebe diagramas e contagem por regiões. Associação recebe tabelas completas e teste de cenários. Raciocínio verbal recebe critérios e universos explícitos. Sequências recebe recorrência, posições, ciclos e matriz visual. Orientação recebe referenciais, trajeto, reflexão, calendário gregoriano e linha do tempo. Matemática recebe operações, frações, equações e bases sucessivas. Proporcionalidade e porcentagem recebem exemplos diretos, inversos e reversos. Estatística recebe gráficos, frequências, medidas de posição e dispersão com todas as contas intermediárias.

## Fontes de apoio

As explicações e exemplos novos são autorais e não são apresentados como questões oficiais da FCC. As referências orientam o estudo dos conceitos; não implicam auditoria de cada questão antiga ou validação de filtros de plataformas.

- [IMPA/OBMEP — Introdução à Lógica Matemática](https://portaldaobmep.impa.br/index.php/modulo/ver?modulo=153&tipo=7).
- [IMPA/OBMEP — Conjuntos](https://portaldaobmep.impa.br/index.php/modulo/ver?modulo=87).
- [IMPA/OBMEP — Progressões Aritméticas](https://portaldaobmep.impa.br/index.php/modulo/ver?modulo=79) e [Recorrências](https://portaldaobmep.impa.br/index.php/modulo/ver?modulo=82).
- [OBMEP — Divisibilidade e calendário](https://portaldosaber.obmep.org.br/uploads/material_teorico/cplxkreoksp4.pdf).
- [IMPA/OBMEP — Operações básicas](https://portaldaobmep.impa.br/index.php/modulo/ver?modulo=60).
- [IMPA/OBMEP — Razões e Proporções](https://portaldaobmep.impa.br/index.php/modulo/ver?modulo=57&tipo=7).
- [IMPA/OBMEP — Porcentagem e Juros, recorte percentual](https://portaldaobmep.impa.br/index.php/modulo/ver?modulo=26).
- [IMPA/OBMEP — Noções Básicas de Estatística](https://portaldaobmep.impa.br/index.php/modulo/ver?modulo=64&tipo=7) e [Estatística Básica I](https://portaldaobmep.impa.br/index.php/modulo/ver?modulo=99&tipo=7).

## Validação

Os testes específicos verificam preservação das questões e do treino, carga idempotente dos complementos, tabelas-verdade, restrições numéricas de conjuntos e gráficos, cálculos de exemplos, escape de texto e carga dos scripts nas três entradas. Os seis testes existentes de integridade de publicação também passaram.

A suíte geral foi executada sobre a integração com o commit `e5c61b3` da Central: **80 testes aprovados, sem falhas**. A integração conserva as atualizações recentes da Central de Questões.

Uma simulação de DOM com JSDOM carregou a prévia integrada e abriu os 14 módulos. Foram conferidos os 70 exemplos guiados, a abertura por clique, as 36 tabelas, as 10 figuras e o feedback persistente de uma questão após fechar e reabrir o leitor. Isso não substitui um teste visual de layout.

O Chromium local não pôde ser instalado: o download retornou arquivo inválido. A tentativa de abrir o navegador remoto excedeu o tempo de resposta. Por isso, não foi certificada a aparência em celular ou computador, nem a experiência de impressão. A prévia autenticada está preparada para essa revisão antes de publicar na Central principal.
