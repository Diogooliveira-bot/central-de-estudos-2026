/* Banco de questões — Noções de Informática, módulo 06. Questões autorais (não são de banca).
 * Para acrescentar questões, veja content/questoes/LEIAME.md e rode "npm run questoes:check". */
window.BC_QUESTOES=window.BC_QUESTOES||{};
(window.BC_QUESTOES.info=window.BC_QUESTOES.info||{})[6]=[
 {
  "id": "info-m06-autoral-01",
  "origem": "autoral-ia",
  "q": "Na célula D2 está a fórmula =SE(E(B2>=60;C2>=75);\"Aprovado\";\"Revisar\"), com B2 igual a 72 (nota) e C2 igual a 70 (frequência). Qual resultado aparece em D2?",
  "options": [
   "Aprovado",
   "Revisar",
   "VERDADEIRO",
   "FALSO",
   "#VALOR!"
  ],
  "answer": 1,
  "explanation": "A função E retorna VERDADEIRO somente quando todas as condições são verdadeiras. Aqui B2>=60 é verdadeiro (72 é maior que 60), mas C2>=75 é falso (70 é menor que 75); logo E devolve FALSO, e a função SE entrega o segundo resultado, o texto Revisar. O resultado Aprovado só ocorreria com OU ou com frequência de 75 ou mais. VERDADEIRO e FALSO são valores lógicos que a função E produz internamente, mas a SE converte esse teste em um dos dois textos informados. Não há erro de tipo nem de argumentos, então #VALOR! não aparece.",
  "lawRef": "Excel (pt-BR) — funções SE e E"
 },
 {
  "id": "info-m06-autoral-02",
  "origem": "autoral-ia",
  "q": "Os valores 5; 10; 15; 20; 8; 10 estão nas células B2 a B7. Qual é o resultado de =CONT.SE(B2:B7;\">=10\")?",
  "options": [
   "2",
   "3",
   "6",
   "4",
   "5"
  ],
  "answer": 3,
  "explanation": "CONT.SE conta as células que satisfazem o critério. Com \">=10\", entram os valores 10, 15, 20 e 10, num total de 4; ficam de fora o 5 e o 8. O resultado 2 corresponderia a \">10\", que exclui os dois valores iguais a 10. O resultado 3 conta valores distintos, desprezando a repetição do 10, o que CONT.SE não faz. O resultado 6 é o total de células do intervalo, ignorando o critério. O resultado 5 seria obtido com \">=8\", incluindo o 8. O critério vai entre aspas, e o operador faz parte do texto do critério.",
  "lawRef": "Excel (pt-BR) — CONT.SE com critério entre aspas"
 },
 {
  "id": "info-m06-autoral-03",
  "origem": "autoral-ia",
  "q": "Em uma planilha, A2:A20 traz a região, B2:B20 o status e C2:C20 o valor. Qual fórmula soma os valores da região Sul com status Pago?",
  "options": [
   "=SOMASES(A2:A20;\"Sul\";B2:B20;\"Pago\";C2:C20)",
   "=SOMASE(A2:A20;\"Sul\";B2:B20;\"Pago\";C2:C20)",
   "=SOMASES(C2:C20;A2:A20;\"Sul\";B2:B20;\"Pago\")",
   "=CONT.SES(A2:A20;\"Sul\";B2:B20;\"Pago\")",
   "=SOMA(C2:C20;\"Sul\";\"Pago\")"
  ],
  "answer": 2,
  "explanation": "Com mais de um critério usa-se SOMASES, e nela o intervalo da soma vem primeiro: SOMASES(intervalo_soma; intervalo_critério1; critério1; intervalo_critério2; critério2). Por isso a fórmula correta começa por C2:C20. A versão do SOMASES que põe C2:C20 por último segue a ordem do SOMASE, e não a do SOMASES. A que usa SOMASE com dois pares de critérios passa argumentos demais, pois essa função aceita um único critério. CONT.SES conta registros e não soma valores. A que usa SOMA não aplica critérios, e trata \"Sul\" e \"Pago\" como argumentos de soma, o que não filtra nada.",
  "lawRef": "Excel (pt-BR) — SOMASES: ordem dos argumentos e múltiplos critérios"
 },
 {
  "id": "info-m06-autoral-04",
  "origem": "autoral-ia",
  "q": "Em A2:C5 há matrícula, nome e lotação: 101, Ana, RH; 102, Bruno, TI; 103, Carla, Jurídico; 104, Diego, Contábil. Com E2 igual a 103, qual o resultado de =PROCV(E2;A2:C5;3;FALSO)?",
  "options": [
   "Jurídico",
   "Carla",
   "103",
   "TI",
   "#N/D"
  ],
  "answer": 0,
  "explanation": "PROCV procura o valor de E2 (103) na primeira coluna do intervalo A2:C5 e devolve o conteúdo da coluna indicada pelo índice, contado a partir da primeira coluna da matriz. O índice 3 corresponde à terceira coluna, lotação; na linha da matrícula 103 está Jurídico. O resultado Carla viria do índice 2, que é a coluna de nomes. O resultado 103 seria a própria chave, na coluna 1. O resultado TI é a lotação da matrícula 102, linha acima da encontrada. O erro #N/D só apareceria se o valor procurado não existisse, mas 103 está presente e o argumento FALSO exige correspondência exata.",
  "lawRef": "Excel (pt-BR) — PROCV com correspondência exata"
 },
 {
  "id": "info-m06-autoral-05",
  "origem": "autoral-ia",
  "q": "A célula C2 contém =SEERRO(A2/B2;0), com A2 igual a 10 e B2 igual a 0. Sobre esse resultado, é correto afirmar que:",
  "options": [
   "C2 exibe #DIV/0!, pois SEERRO só trata erros do tipo #N/D de pesquisas",
   "C2 exibe 0 e a função corrige o valor de B2, que passa a ser maior que zero",
   "C2 exibe 5, pois a função ignora o divisor nulo e usa apenas o numerador",
   "C2 exibe VERDADEIRO, pois SEERRO devolve um valor lógico quando há erro",
   "C2 exibe 0 no lugar de #DIV/0!, mas a divisão por zero continua sem solução nos dados"
  ],
  "answer": 4,
  "explanation": "SEERRO(valor; alternativa) devolve a alternativa informada quando a expressão produz erro. Como 10 ÷ 0 gera #DIV/0!, C2 exibe 0. Isso muda apenas o que é mostrado: o problema original (divisor zero em B2) continua existindo, e usar SEERRO sem critério pode esconder dados inadequados. A função não se limita a #N/D; trata #DIV/0!, #VALOR!, #REF!, #NOME? e outros. Ela não altera B2, que permanece 0. Não ignora o divisor nem usa só o numerador, então o resultado não é 5. E o valor devolvido é o segundo argumento, o número 0, e não um valor lógico.",
  "lawRef": "Excel (pt-BR) — SEERRO e tratamento de erros"
 },
 {
  "id": "info-m06-autoral-06",
  "origem": "autoral-ia",
  "q": "Uma lista tem as colunas Região, Vendedor e Valor. Para obter o total de Valor por Região em uma Tabela Dinâmica, sem escrever fórmula em cada linha, como os campos devem ser organizados?",
  "options": [
   "Região na área Valores e Valor na área Linhas, resumido por soma dos nomes das regiões",
   "Região na área Linhas e Valor na área Valores, resumido por soma",
   "Região na área Filtros e Valor na área Colunas, sem nenhum campo na área Valores",
   "Vendedor na área Valores, e Região e Valor ambos na área Filtros do relatório",
   "Região e Valor na área Linhas, pois cada área soma automaticamente os campos"
  ],
  "answer": 1,
  "explanation": "Na Tabela Dinâmica, o campo colocado em Linhas forma os grupos exibidos e o campo em Valores é resumido, por padrão com soma quando é numérico. Com Região em Linhas e Valor em Valores, cada região aparece uma vez com seu total. Trocar as áreas faz Região ser contada em Valores e cada valor virar uma linha, sem totais por região. Filtros apenas restringem o que o relatório exibe, e sem campo em Valores não há total. Colocar Vendedor em Valores resumiria outro campo, e os dois campos em Filtros não formam linhas. Pôr Região e Valor em Linhas lista combinações, mas não soma, pois só a área Valores agrega.",
  "lawRef": "Excel — Tabela Dinâmica: áreas Linhas, Colunas, Valores e Filtros"
 },
 {
  "id": "info-m06-autoral-07",
  "origem": "autoral-ia",
  "q": "Sobre o uso de filtros, classificação, gráficos e remoção de duplicatas em listas de dados no Excel, é INCORRETO afirmar que:",
  "options": [
   "filtrar oculta os registros que não atendem ao critério, sem apagá-los da planilha",
   "classificar altera a ordem dos registros, sem excluir nenhum deles da lista",
   "Remover Duplicatas altera o conjunto de dados, eliminando linhas repetidas",
   "o gráfico de setores apresenta a composição de um todo, com limitações de legibilidade",
   "alterar o tipo de gráfico de colunas para linhas modifica os valores das células de origem"
  ],
  "answer": 4,
  "explanation": "Mudar o tipo de gráfico altera apenas a forma de representar os dados; os valores das células de origem permanecem os mesmos, e o gráfico é que acompanha a planilha, não o contrário. A afirmação é, portanto, incorreta. As outras são verdadeiras: o filtro oculta registros sem apagá-los; a classificação só muda a ordem; Remover Duplicatas altera o conjunto de dados, ao contrário de apenas filtrar; e o gráfico de setores mostra a composição de um todo, perdendo legibilidade com muitas fatias. Colunas comparam categorias e linhas mostram evolução ou tendência.",
  "lawRef": "Excel — filtro, classificação, Remover Duplicatas e tipos de gráfico"
 },
 {
  "id": "info-m06-autoral-08",
  "origem": "autoral-ia",
  "q": "A célula A2 contém uma data válida, 15/03/2026 (valor de data, não texto). Qual é o resultado de =DIA(A2)+MÊS(A2)*100?",
  "options": [
   "18",
   "1503",
   "315",
   "2026",
   "#VALOR!"
  ],
  "answer": 2,
  "explanation": "As funções DIA e MÊS extraem componentes de uma data: DIA(A2) retorna 15 e MÊS(A2) retorna 3. Pela precedência, a multiplicação vem antes da soma: 3 × 100 = 300, e 15 + 300 = 315. O resultado 18 soma 15 + 3 e desconsidera o fator 100. O resultado 1503 trata o cálculo como junção de textos (15 e 03), o que exigiria o operador &, e não a soma. O resultado 2026 é o que ANO(A2) devolveria, função que nem aparece na fórmula. O erro #VALOR! ocorreria se A2 fosse texto não reconhecido como data, mas o enunciado informa que é um valor de data válido.",
  "lawRef": "Excel (pt-BR) — funções DIA e MÊS com datas válidas"
 },
 {
  "id": "info-m06-autoral-09",
  "origem": "autoral-ia",
  "q": "A célula A2 contém o texto BRA-2026-045 (código com letras, hífens e números). Qual é o resultado de =EXT.TEXTO(A2;5;4)&\"/\"&DIREITA(A2;2)?",
  "options": [
   "2026/45",
   "BRA/45",
   "2026/04",
   "-202/45",
   "2026/045"
  ],
  "answer": 0,
  "explanation": "EXT.TEXTO(texto; posição_inicial; número_de_caracteres) extrai parte interna do texto. Em BRA-2026-045, as posições são B=1, R=2, A=3, hífen=4, 2=5, 0=6, 2=7 e 6=8. Começando na posição 5 e pegando 4 caracteres, obtém-se 2026. DIREITA(A2;2) retorna os dois últimos caracteres, 45. O operador & une 2026, a barra e 45, resultando em 2026/45. O resultado BRA/45 seria de ESQUERDA(A2;3). Em 2026/04, o trecho final está incorreto, pois os dois últimos caracteres são 45 e não 04. O resultado -202/45 começaria na posição 4. E 2026/045 usaria três caracteres à direita.",
  "lawRef": "Excel (pt-BR) — EXT.TEXTO, DIREITA e concatenação"
 },
 {
  "id": "info-m06-autoral-10",
  "origem": "autoral-ia",
  "q": "Em uma coluna Status só devem ser aceitos os valores Aberto, Em análise ou Fechado, escolhidos numa lista suspensa. Qual recurso do Excel atende diretamente a essa necessidade?",
  "options": [
   "Formatação Condicional, que colore as células conforme regras definidas",
   "Proteção de planilha, que impede a edição das células bloqueadas",
   "Remover Duplicatas, que apaga os valores repetidos existentes na coluna",
   "Validação de Dados, com critério do tipo Lista",
   "Tabela Dinâmica, que resume os valores da coluna por categoria"
  ],
  "answer": 3,
  "explanation": "A Validação de Dados, na guia Dados, restringe ou orienta o que pode ser digitado e permite, com o critério Lista, escolher entre valores predefinidos numa lista suspensa. A Formatação Condicional muda apenas a aparência das células segundo regras e não impede entradas. A Proteção de planilha restringe ações de edição, mas não oferece lista de opções nem limita o conteúdo aos três valores. Remover Duplicatas altera o conjunto de dados já existente, eliminando linhas repetidas, sem controlar o que será digitado depois. A Tabela Dinâmica resume e agrega dados, não valida entradas.",
  "lawRef": "Excel — Validação de Dados com lista suspensa"
 }
];
