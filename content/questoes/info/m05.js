/* Banco de questões — Noções de Informática, módulo 05. Questões autorais (não são de banca).
 * Para acrescentar questões, veja content/questoes/LEIAME.md e rode "npm run questoes:check". */
window.BC_QUESTOES=window.BC_QUESTOES||{};
(window.BC_QUESTOES.info=window.BC_QUESTOES.info||{})[5]=[
 {
  "id": "info-m05-autoral-01",
  "origem": "autoral-ia",
  "q": "Em uma planilha do Excel, o intervalo A1:C5 foi selecionado para aplicar uma formatação. Quantas células fazem parte desse intervalo?",
  "options": [
   "8 células, somando as 3 colunas e as 5 linhas do intervalo",
   "12 células, pois a coluna C não entra na contagem do intervalo",
   "20 células, pois o intervalo vai da coluna A até a coluna D",
   "15 células: 3 colunas (A a C) por 5 linhas (1 a 5)",
   "2 células, pois só os cantos A1 e C5 pertencem ao intervalo"
  ],
  "answer": 3,
  "explanation": "O operador dois pontos representa todas as células entre os cantos do intervalo, incluindo as das extremidades. De A a C são 3 colunas (A, B e C) e de 1 a 5 são 5 linhas, logo 3 × 5 = 15 células. Somar colunas e linhas (3 + 5 = 8) confunde soma com produto. Excluir a coluna C (resultando em 12) ignora que o último endereço também faz parte do intervalo. Chegar a 20 supõe uma coluna D que não está no endereço. Considerar apenas os cantos A1 e C5 (2 células) desconsidera que o intervalo cobre toda a região retangular entre eles.",
  "lawRef": "Excel — intervalos e endereços de células"
 },
 {
  "id": "info-m05-autoral-02",
  "origem": "autoral-ia",
  "q": "Nas células B2 a B6 de uma planilha estão os valores 8, 6, 10, 4 e 7. Qual é o resultado de =MÁXIMO(B2:B6)-MÍNIMO(B2:B6)+MÉDIA(B2:B6)?",
  "options": [
   "6",
   "13",
   "21",
   "17",
   "7"
  ],
  "answer": 1,
  "explanation": "Os valores somam 8 + 6 + 10 + 4 + 7 = 35, e a média é 35 ÷ 5 = 7. O maior valor é 10 e o menor é 4. A fórmula calcula 10 − 4 + 7 = 13. O resultado 6 considera só a amplitude (10 − 4) e esquece de somar a média. O resultado 21 soma o mínimo em vez de subtraí-lo (10 + 4 + 7). O resultado 17 omite o mínimo e soma apenas máximo e média (10 + 7). O resultado 7 é somente a média, desconsiderando as outras duas funções da expressão. Em fórmulas com várias funções, calcule cada uma separadamente antes de combinar.",
  "lawRef": "Excel (pt-BR) — funções MÁXIMO, MÍNIMO e MÉDIA"
 },
 {
  "id": "info-m05-autoral-03",
  "origem": "autoral-ia",
  "q": "Na célula D2 de uma planilha do Excel foi digitada a fórmula =$A2+B$1. Ela é copiada para a célula E4 (uma coluna à direita e duas linhas abaixo). Como fica a fórmula em E4?",
  "options": [
   "=$A4+C$1",
   "=A4+C1",
   "=$B4+C$3",
   "=$A2+C$1",
   "=$A4+B$3"
  ],
  "answer": 0,
  "explanation": "Na cópia há deslocamento de 1 coluna e 2 linhas, calculados separadamente. Em $A2, a coluna está fixa (continua A) e a linha é relativa (2 passa a 4), resultando em $A4. Em B$1, a linha está fixa (continua 1) e a coluna é relativa (B passa a C), resultando em C$1. A fórmula fica =$A4+C$1. Escrever =A4+C1 trata tudo como relativo e ignora os cifrões. Em =$B4+C$3, o $ foi desrespeitado nas duas referências. Em =$A2+C$1, a linha de $A2 não acompanhou o deslocamento. Em =$A4+B$3, a coluna e a linha de B$1 foram trocadas de forma indevida. O cifrão fixa coordenadas, não indica moeda.",
  "lawRef": "Excel (pt-BR) — referências relativas, absolutas e mistas"
 },
 {
  "id": "info-m05-autoral-04",
  "origem": "autoral-ia",
  "q": "Na coluna A, as células A1 a A6 contêm: 5; 10; o texto pendente; uma célula vazia; 7; e o texto n/d. Qual é o resultado de =CONT.VALORES(A1:A6)-CONT.NÚM(A1:A6)?",
  "options": [
   "0",
   "1",
   "3",
   "5",
   "2"
  ],
  "answer": 4,
  "explanation": "CONT.VALORES conta células não vazias, incluindo textos: A1, A2, A3, A5 e A6, ou seja, 5 células (a vazia A4 fica de fora). CONT.NÚM conta somente células com números: A1, A2 e A5, ou seja, 3. A diferença é 5 − 3 = 2, que corresponde exatamente aos dois textos. O resultado 0 supõe que as duas funções contam o mesmo conjunto. O resultado 3 é apenas o valor de CONT.NÚM, e 5 é apenas o de CONT.VALORES, sem a subtração. O resultado 1 desconsidera um dos dois textos. As duas contagens são distintas, e células vazias não são tratadas como texto preenchido.",
  "lawRef": "Excel (pt-BR) — CONT.NÚM versus CONT.VALORES"
 },
 {
  "id": "info-m05-autoral-05",
  "origem": "autoral-ia",
  "q": "Na célula C2 do Excel foi digitada a fórmula =A2/B2, com A2 igual a 10 e a célula B2 vazia. Qual é o resultado exibido em C2?",
  "options": [
   "0",
   "#VALOR!",
   "#DIV/0!",
   "#REF!",
   "#NOME?"
  ],
  "answer": 2,
  "explanation": "Uma célula vazia usada em operação aritmética é tratada como zero, e a divisão de 10 por zero produz o erro #DIV/0!. O resultado 0 seria correto apenas se o numerador fosse zero, o que não é o caso. O erro #VALOR! aparece quando tipos ou argumentos são incompatíveis, como somar um texto que não pode ser convertido em número. #REF! indica referência inválida, por exemplo quando a coluna referenciada é excluída depois da escrita da fórmula. #NOME? surge quando um identificador ou nome de função não é reconhecido, como ao digitar errado o nome de uma função. Nenhuma dessas situações ocorre aqui.",
  "lawRef": "Excel (pt-BR) — erros de fórmula: #DIV/0!, #VALOR!, #REF! e #NOME?"
 },
 {
  "id": "info-m05-autoral-06",
  "origem": "autoral-ia",
  "q": "Em A1 está armazenado o valor 0,25, formatado como Porcentagem (a célula exibe 25%). Em B1 digita-se =A1*200. Qual é o valor numérico calculado em B1?",
  "options": [
   "5.000",
   "25",
   "50",
   "0,5",
   "500"
  ],
  "answer": 2,
  "explanation": "A formatação percentual altera somente a exibição: o valor armazenado em A1 continua sendo 0,25, apenas mostrado como 25%. A fórmula usa o valor armazenado, e 0,25 × 200 = 50. O resultado 5.000 usaria o 25 exibido (25 × 200), como se a formatação multiplicasse o valor por 100. O resultado 25 é apenas o número mostrado na tela. O resultado 0,5 corresponde a 0,25 × 2, errando o fator da fórmula. O resultado 500 seria 2,5 × 200, sem relação com o valor armazenado. Formatar não muda o valor; é preciso diferenciar o que se vê do que está guardado na célula.",
  "lawRef": "Excel — formatação percentual e valor armazenado"
 },
 {
  "id": "info-m05-autoral-07",
  "origem": "autoral-ia",
  "q": "Uma pessoa precisa decidir em que formato salvar uma planilha do Excel. Sobre os formatos de arquivo .xlsx, .xls e .csv, é correto afirmar que:",
  "options": [
   ".csv guarda dados em texto separados por delimitadores e não preserva todos os recursos de uma pasta .xlsx",
   ".csv preserva várias planilhas, gráficos e formatações, como uma pasta de trabalho no formato .xlsx",
   ".xls é o formato padrão das pastas de trabalho atuais e foi substituído pelo formato .csv",
   ".xlsx armazena somente texto puro, sem fórmulas, gráficos ou qualquer tipo de formatação",
   ".xlsx e .csv são o mesmo formato, e a diferença está apenas no nome da extensão do arquivo"
  ],
  "answer": 0,
  "explanation": "O .csv armazena dados textuais separados por delimitadores e não preserva nativamente todos os recursos de uma pasta de trabalho, como múltiplas planilhas e gráficos. O .xlsx é o formato usual atual e pode conter planilhas, fórmulas, gráficos, tabelas e filtros. Dizer que o .csv preserva todos esses recursos inverte a relação. O .xls é um formato legado, e não o padrão atual, e não foi substituído pelo .csv. O .xlsx não é texto puro: guarda fórmulas, gráficos e formatações. Também não são o mesmo formato: trocar a extensão não converte o conteúdo, pois a estrutura interna dos dois arquivos é diferente.",
  "lawRef": "Excel — formatos .xlsx, .xls e .csv"
 },
 {
  "id": "info-m05-autoral-08",
  "origem": "autoral-ia",
  "q": "Em relação a recursos de formatação, ordenação, filtro e exibição de linhas e colunas de dados no Excel, é INCORRETO afirmar que:",
  "options": [
   "a formatação condicional muda a aparência das células segundo regras, sem alterar os valores",
   "filtrar exibe somente os registros que atendem ao critério, sem excluir os demais registros",
   "classificar reorganiza as linhas de uma lista conforme os critérios de ordenação escolhidos",
   "congelar painéis protege contra edição as linhas e colunas que ficam fixas na tela",
   "um número armazenado como texto pode afetar fórmulas, ordenação e outras operações"
  ],
  "answer": 3,
  "explanation": "Congelar painéis apenas mantém linhas ou colunas determinadas visíveis durante a rolagem; não impede a edição das células, que depende do recurso de proteção da planilha. Portanto, a afirmação é incorreta. As demais são corretas: a formatação condicional aplica aparência por regras sem alterar os valores; o filtro oculta temporariamente os registros que não atendem ao critério, sem apagá-los; a classificação reordena as linhas, devendo-se selecionar o intervalo corretamente para não desalinhar registros; e um número armazenado como texto pode atrapalhar cálculos e ordenações.",
  "lawRef": "Excel — congelar painéis, formatação condicional, filtro e classificação"
 },
 {
  "id": "info-m05-autoral-09",
  "origem": "autoral-ia",
  "q": "Em A1 há uma data válida, 28/02/2026 (valor de data, não texto). Em B1, formatada como data, digita-se =A1+7. Qual data a célula B1 exibe?",
  "options": [
   "06/03/2026",
   "07/03/2026",
   "35/02/2026",
   "28/09/2026",
   "#VALOR!"
  ],
  "answer": 1,
  "explanation": "As datas são números seriais com formatação especial, então somar 7 a uma data avança sete dias. Em 2026, fevereiro tem 28 dias; do dia 28/02, um dia depois é 01/03 e sete dias depois é 07/03/2026. A data 06/03/2026 erra a contagem por um dia. A data 35/02/2026 não existe: o Excel não escreve dia 35. A data 28/09/2026 corresponde a somar sete meses, o que exigiria outra função, e não sete dias. O erro #VALOR! apareceria se A1 fosse um texto que o Excel não reconhecesse como data, mas o enunciado diz que é um valor de data válido.",
  "lawRef": "Excel — datas como números seriais e aritmética de datas"
 },
 {
  "id": "info-m05-autoral-10",
  "origem": "autoral-ia",
  "q": "Em A1 está o número 4 e em B1, o número 2. Considerando a precedência dos operadores, qual é o resultado de =A1&B1*2 no Excel?",
  "options": [
   "84",
   "8",
   "6",
   "#VALOR!",
   "44"
  ],
  "answer": 4,
  "explanation": "Na precedência dos operadores, a multiplicação é executada antes da concatenação com &. Primeiro B1*2 = 4; depois A1&4 une os textos 4 e 4, resultando em 44. O resultado 84 supõe que a concatenação ocorra primeiro (4&2 = 42) e depois 42 × 2, invertendo a ordem. O resultado 8 trata o & como soma e calcula 4 + 2 × 2. O resultado 6 é simplesmente A1 + B1. O erro #VALOR! não ocorre, pois concatenar números é permitido; o & apenas une os conteúdos. Parênteses poderiam alterar a ordem, mas não existem nesta fórmula.",
  "lawRef": "Excel (pt-BR) — precedência de operadores e concatenação com &"
 }
];
