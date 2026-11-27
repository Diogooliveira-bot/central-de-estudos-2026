/* Banco de questões — Raciocínio Lógico-Matemático, módulo 13. Questões autorais (não são de banca).
 * Para acrescentar questões, veja content/questoes/LEIAME.md e rode "npm run questoes:check". */
window.BC_QUESTOES=window.BC_QUESTOES||{};
(window.BC_QUESTOES.rlm=window.BC_QUESTOES.rlm||{})[13]=[
 {
  "id": "rlm-m13-autoral-01",
  "origem": "autoral-ia",
  "q": "Uma central de atendimento registrou a duração de 250 ligações e organizou os dados em classes de minutos, em que cada intervalo inclui o limite inferior e exclui o superior:\n\nDuração (min) | Ligações\n[0, 10) | 30\n[10, 20) | 70\n[20, 30) | 85\n[30, 40) | 45\n[40, 50) | 20\n\nO percentual de ligações com duração inferior a 30 minutos é:",
  "options": [
   "26%",
   "34%",
   "74%",
   "40%",
   "92%"
  ],
  "answer": 2,
  "explanation": "Duração inferior a 30 minutos corresponde às três primeiras classes, pois [20, 30) exclui o 30: 30 + 70 + 85 = 185 ligações. A frequência relativa é 185/250 = 0,74 = 74%. A alternativa de 26% é o complemento (45 + 20 = 65 ligações, ou seja, 65/250), que responde \"30 minutos ou mais\". A de 34% é só a frequência relativa da classe [20, 30) (85/250). A de 40% soma apenas as duas primeiras classes (100/250). A de 92% erra o limite do intervalo: inclui a classe [30, 40) (230/250), o que só valeria se a pergunta fosse \"inferior a 40 minutos\".",
  "lawRef": "Frequência relativa e acumulada; intervalos fechados à esquerda [a, b)"
 },
 {
  "id": "rlm-m13-autoral-02",
  "origem": "autoral-ia",
  "q": "Em um gráfico de setores que representa 480 processos distribuídos em quatro tipos, o setor \"Cível\" mede 135°, o \"Criminal\" corresponde a 25% do total, o de \"Família\" mede 54°, e o restante é \"Trabalhista\". Quantos processos são trabalhistas?",
  "options": [
   "108",
   "153",
   "81",
   "120",
   "72"
  ],
  "answer": 0,
  "explanation": "Em um gráfico de setores, o círculo completo tem 360° e representa 100% do total. Cível: 135°/360° = 37,5%, ou 180 processos. Criminal: 25% de 480 = 120. Família: 54°/360° = 15%, ou 72 processos. Soma: 180 + 120 + 72 = 372; logo, os trabalhistas são 480 − 372 = 108 (22,5% do total, ou 81°). A alternativa 153 resulta de subtrair do total os ângulos em graus (480 − 135 − 120 − 72), tratando graus como quantidades. A de 81 é o ângulo do setor trabalhista, não a quantidade. As de 120 e 72 são as quantidades dos setores Criminal e Família, e não do trabalhista.",
  "lawRef": "Gráfico de setores: ângulo = proporção × 360°"
 },
 {
  "id": "rlm-m13-autoral-03",
  "origem": "autoral-ia",
  "q": "Os tempos de tramitação de 100 processos foram agrupados em um histograma com classes de larguras diferentes:\n\nClasse (meses) | Processos\n[0, 10) | 20\n[10, 20) | 30\n[20, 40) | 36\n[40, 60) | 14\n\nO histograma foi construído de modo que a área de cada barra seja proporcional à frequência da classe, e a barra da primeira classe tem 4 cm de altura. A altura da barra da classe [20, 40), em cm, é:",
  "options": [
   "7,2",
   "1,8",
   "8,0",
   "2,0",
   "3,6"
  ],
  "answer": 4,
  "explanation": "Quando as classes têm larguras diferentes, a área da barra (base × altura) é que representa a frequência; a altura deve ser proporcional à densidade de frequência, isto é, frequência dividida pela largura da classe. Primeira classe: 20/10 = 2 por mês, desenhada com 4 cm, de modo que 1 unidade de densidade vale 2 cm. Classe [20, 40): 36/20 = 1,8 por mês, que corresponde a 1,8 × 2 = 3,6 cm. A alternativa de 7,2 cm faz a altura proporcional à frequência (36/20 × 4), o que só valeria com classes de mesma largura. A de 1,8 é a densidade sem a escala do desenho. A de 2,0 é a densidade da primeira classe. A de 8,0 dobra a altura apenas porque a largura é o dobro, ignorando que a frequência também mudou.",
  "lawRef": "Histograma com classes desiguais: altura = frequência ÷ largura"
 },
 {
  "id": "rlm-m13-autoral-04",
  "origem": "autoral-ia",
  "q": "Um relatório mostra, em gráfico de barras, os processos julgados por uma vara: 84 em 2022 e 96 em 2023. O eixo vertical começa em 80, de modo que a barra de 2022 mede 4 cm e a de 2023 mede 16 cm. A leitura correta do aumento de 2022 para 2023 é:",
  "options": [
   "aumento de 300%, pois a barra de 2023 é quatro vezes a de 2022",
   "aumento de aproximadamente 14,3%, calculado com os valores e não com as alturas",
   "aumento de 12,5%, pois a diferença de 12 processos é calculada sobre 96",
   "aumento de 400%, pois a barra de 2023 mede 16 cm contra 4 cm",
   "aumento de 12 pontos percentuais, pois o eixo começa em 80"
  ],
  "answer": 1,
  "explanation": "O eixo truncado distorce a comparação visual: as alturas (4 cm e 16 cm) medem apenas o que excede 80, não os valores reais. A variação correta usa os dados: (96 − 84)/84 = 12/84 ≈ 0,1429, ou seja, cerca de 14,3%. A alternativa de 300% compara as alturas (16/4 − 1 = 3), e a de 400% toma a razão 16/4 como se fosse a variação. A de 12,5% divide a diferença pelo valor final (12/96), e não pelo valor inicial, que é a base da variação. A de 12 pontos percentuais confunde diferença absoluta (12 processos) com diferença entre percentuais.",
  "lawRef": "Eixo truncado; variação percentual = (final − inicial) ÷ inicial"
 },
 {
  "id": "rlm-m13-autoral-05",
  "origem": "autoral-ia",
  "q": "A tabela mostra os atendimentos mensais de uma ouvidoria:\n\nMês | Janeiro | Fevereiro | Março | Abril | Maio\nAtendimentos | 200 | 260 | 330 | 410 | 480\n\nConsiderando a variação de cada mês em relação ao mês anterior (de fevereiro a maio), o mês de maior aumento absoluto e o de maior aumento percentual foram, respectivamente:",
  "options": [
   "fevereiro e abril",
   "abril e abril",
   "fevereiro e fevereiro",
   "abril e fevereiro",
   "maio e maio"
  ],
  "answer": 3,
  "explanation": "Aumentos absolutos: fevereiro 260 − 200 = 60; março 330 − 260 = 70; abril 410 − 330 = 80; maio 480 − 410 = 70. O maior é o de abril (80). Aumentos percentuais, sempre sobre o mês anterior: fevereiro 60/200 = 30%; março 70/260 ≈ 26,9%; abril 80/330 ≈ 24,2%; maio 70/410 ≈ 17,1%. O maior é o de fevereiro (30%), porque a base é menor. A alternativa \"abril e abril\" ignora que o percentual depende da base; \"fevereiro e fevereiro\" olha só o percentual; \"fevereiro e abril\" inverte os critérios; e \"maio e maio\" confunde o maior volume mensal com o maior crescimento.",
  "lawRef": "Variação absoluta x variação percentual em séries"
 },
 {
  "id": "rlm-m13-autoral-06",
  "origem": "autoral-ia",
  "q": "A tabela de dupla entrada mostra o resultado do julgamento de 500 processos, por área:\n\nÁrea | Procedentes | Improcedentes | Extintos\nCível | 90 | 100 | 50\nCriminal | 45 | 75 | 30\nFamília | 65 | 25 | 20\n\nEntre os processos que não foram julgados procedentes, o percentual de processos criminais é:",
  "options": [
   "35%",
   "70%",
   "21%",
   "30%",
   "45%"
  ],
  "answer": 0,
  "explanation": "O universo da pergunta são os processos não procedentes, isto é, improcedentes e extintos: (100 + 50) + (75 + 30) + (25 + 20) = 150 + 105 + 45 = 300. Os criminais nesse grupo são 75 + 30 = 105. O percentual é 105/300 = 35%. A alternativa de 70% divide pelo total de processos criminais (105/150), o que responde a outra pergunta: \"entre os criminais, quantos não foram procedentes\". A de 21% divide pelo total geral (105/500). A de 30% é o percentual de criminais em todo o universo de 500 (150/500). A de 45% é o percentual de processos cíveis entre os procedentes (90/200), que é outro grupo e outra área.",
  "lawRef": "Tabela de dupla entrada: frequência relativa condicional"
 },
 {
  "id": "rlm-m13-autoral-07",
  "origem": "autoral-ia",
  "q": "A distribuição das idades de um grupo foi dividida em quatro classes. Sabe-se que as frequências relativas acumuladas são 10%, 35%, 75% e 100% e que a terceira classe tem 48 observações. A frequência absoluta da segunda classe é:",
  "options": [
   "25",
   "42",
   "30",
   "48",
   "12"
  ],
  "answer": 2,
  "explanation": "Se a terceira classe tem frequência relativa 75% − 35% = 40% e 48 observações, o total é 48/0,40 = 120. A segunda classe tem frequência relativa 35% − 10% = 25%, ou seja, 0,25 × 120 = 30 observações. A alternativa 25 trata o percentual como se fosse contagem. A de 42 aplica 35% (o acumulado) ao total, quando o valor pedido é a diferença entre acumuladas consecutivas. A de 48 é a frequência da terceira classe, dada no enunciado. A de 12 é a frequência da primeira classe (10% de 120).",
  "lawRef": "Frequência acumulada e relativa: f_i = F_i − F_(i−1)"
 },
 {
  "id": "rlm-m13-autoral-08",
  "origem": "autoral-ia",
  "q": "Uma pesquisa de satisfação ouviu 50 usuários do Tribunal X, dos quais 80% se disseram satisfeitos, e 400 usuários do Tribunal Y, dos quais 70% se disseram satisfeitos. Com base apenas nesses dados, a conclusão sustentada é:",
  "options": [
   "o Tribunal X teve mais usuários satisfeitos, porque seu percentual é maior",
   "o Tribunal Y teve mais usuários satisfeitos em número absoluto, apesar do menor percentual",
   "no conjunto dos dois tribunais, 75% dos entrevistados se disseram satisfeitos",
   "o Tribunal X presta serviço melhor, pois o percentual mais alto comprova a causa da satisfação",
   "a diferença entre os tribunais é de 10%, pois 80% − 70% = 10% do total de entrevistados"
  ],
  "answer": 1,
  "explanation": "Percentual não mostra volume. Satisfeitos em X: 0,80 × 50 = 40; em Y: 0,70 × 400 = 280. Logo, Y teve mais usuários satisfeitos, embora o percentual seja menor, e a alternativa B está correta. No conjunto, são (40 + 280)/450 ≈ 71,1% de satisfeitos, e não 75%, que seria a média simples dos percentuais (ignora os tamanhos das amostras). A afirmação de que X presta serviço melhor extrapola os dados: a pesquisa descreve a satisfação declarada, não prova causa nem compara qualidade. Por fim, 80% − 70% é diferença de 10 pontos percentuais, que não equivale a 10% do total de entrevistados.",
  "lawRef": "Interpretação responsável: percentual x valor absoluto"
 },
 {
  "id": "rlm-m13-autoral-09",
  "origem": "autoral-ia",
  "q": "Em 2024, o gráfico de setores das 600 ações de um órgão mostrava o setor \"Consumidor\" com 30% do total. Em 2025, o total subiu para 800 ações, e o setor \"Consumidor\" passou a medir 135°. O aumento percentual do número de ações do setor \"Consumidor\" de 2024 para 2025 foi de:",
  "options": [
   "7,5%",
   "25%",
   "40%",
   "166,7%",
   "66,7%"
  ],
  "answer": 4,
  "explanation": "Em 2024: 30% de 600 = 180 ações. Em 2025: 135°/360° = 37,5% de 800 = 300 ações. A variação é (300 − 180)/180 = 120/180 ≈ 66,7%. A alternativa de 7,5% é a variação da participação (37,5% − 30%), em pontos percentuais, e não do número de ações. A de 25% compara só os ângulos (135° contra 108°, que seria 30% de 360°), ignorando que o total também cresceu. A de 40% divide a diferença pelo valor final (120/300). A de 166,7% é a razão 300/180 apresentada como se fosse o aumento.",
  "lawRef": "Gráfico de setores em dois períodos; variação percentual"
 },
 {
  "id": "rlm-m13-autoral-10",
  "origem": "autoral-ia",
  "q": "Em uma amostra de 20 tempos de espera, em minutos, obtiveram-se os valores: 4, 8, 9, 10, 12, 15, 17, 18, 20, 20, 20, 21, 23, 25, 27, 29, 30, 30, 32 e 35. Os dados foram agrupados nas classes [0, 10), [10, 20), [20, 30) e [30, 40), cada uma incluindo o limite inferior e excluindo o superior. A frequência relativa da classe [20, 30) é:",
  "options": [
   "8%",
   "25%",
   "35%",
   "40%",
   "50%"
  ],
  "answer": 3,
  "explanation": "Pela convenção [a, b), a classe [20, 30) contém os valores maiores ou iguais a 20 e menores que 30: 20, 20, 20, 21, 23, 25, 27 e 29, ou seja, 8 observações, que são 8/20 = 40% do total. A alternativa de 35% resulta de usar o intervalo aberto à esquerda e fechado à direita, (20, 30], que perde os três valores 20 e ganha os dois valores 30. A de 50% inclui também os dois valores 30, que pertencem à classe seguinte. A de 25% exclui os dois limites (apenas 21, 23, 25, 27 e 29). A de 8% confunde a frequência absoluta com a relativa.",
  "lawRef": "Limites de classe [a, b); frequência relativa"
 },
 {
  "id": "rlm-m13-autoral-11",
  "origem": "autoral-ia",
  "q": "Em uma pesquisa de satisfação com 40 respostas, 10 usuários escolheram a opção \"Regular\". Na tabela de frequências, a frequência relativa percentual dessa opção é:",
  "options": [
   "25%",
   "10%",
   "20%",
   "30%",
   "40%"
  ],
  "answer": 0,
  "explanation": "A frequência relativa é a frequência absoluta dividida pelo total: 10/40 = 0,25, ou seja, 25%. A alternativa de 10% confunde a frequência absoluta (10 respostas) com um percentual. A de 40% é o próprio total de respostas, que não é percentual. As de 20% e 30% corresponderiam a 8 e a 12 respostas, respectivamente (0,20 × 40 e 0,30 × 40), e não a 10. Confira sempre multiplicando o percentual pelo total: 0,25 × 40 = 10.",
  "lawRef": "Frequência relativa = frequência absoluta ÷ total"
 },
 {
  "id": "rlm-m13-autoral-12",
  "origem": "autoral-ia",
  "q": "O orçamento de um tribunal é representado em um gráfico de setores. O setor \"Pessoal\" corresponde a 50% do orçamento. O ângulo central desse setor, em graus, é:",
  "options": [
   "45°",
   "90°",
   "120°",
   "180°",
   "270°"
  ],
  "answer": 3,
  "explanation": "No gráfico de setores, o círculo inteiro (360°) representa 100% do total, então o ângulo de cada setor é proporção × 360°. Para 50%, 0,5 × 360° = 180°, isto é, meio círculo. As demais alternativas correspondem a outras frações: 90° é 25% (um quarto), 270° é 75% (três quartos), 120° é um terço (cerca de 33,3%) e 45° é 12,5%. Uma verificação rápida é lembrar que metade do círculo é sempre meia-volta, 180°.",
  "lawRef": "Gráfico de setores: ângulo = proporção × 360°"
 },
 {
  "id": "rlm-m13-autoral-13",
  "origem": "autoral-ia",
  "q": "Os tempos de espera de usuários de um fórum foram agrupados em classes de minutos, como [0, 10), [10, 20) e [20, 30), e se deseja representar visualmente a distribuição das frequências por classe. Qual representação gráfica é a mais adequada para dados quantitativos agrupados em intervalos?",
  "options": [
   "Gráfico de setores",
   "Histograma",
   "Diagrama de dispersão",
   "Pictograma",
   "Cartograma"
  ],
  "answer": 1,
  "explanation": "O histograma é o gráfico próprio para variáveis quantitativas agrupadas em classes: as barras são contíguas, pois os intervalos são contínuos, e a área (ou a altura, com classes de mesma largura) representa a frequência. O gráfico de setores serve para partes de um todo em categorias, não para intervalos numéricos ordenados. O diagrama de dispersão relaciona duas variáveis quantitativas, e não a distribuição de uma só. O pictograma usa figuras para representar quantidades de categorias, e o cartograma mostra dados sobre mapas.",
  "lawRef": "Histograma: distribuição de variável quantitativa em classes"
 },
 {
  "id": "rlm-m13-autoral-14",
  "origem": "autoral-ia",
  "q": "Em uma tabela de frequências absolutas, as três classes de duração de audiências têm 3, 7 e 10 ocorrências, nessa ordem. A frequência absoluta acumulada até a segunda classe é:",
  "options": [
   "3",
   "7",
   "17",
   "20",
   "10"
  ],
  "answer": 4,
  "explanation": "A frequência acumulada até uma classe é a soma das frequências da primeira classe até ela. Até a segunda classe: 3 + 7 = 10. A alternativa 3 é apenas a frequência da primeira classe, e a 7 é apenas a da segunda, sem acumular. A de 17 soma a segunda e a terceira classes (7 + 10), em vez de começar pela primeira. A de 20 é o total (3 + 7 + 10), isto é, a acumulada até a terceira classe, que é a última.",
  "lawRef": "Frequência absoluta acumulada"
 },
 {
  "id": "rlm-m13-autoral-15",
  "origem": "autoral-ia",
  "q": "Em um dia, uma central registrou 60 atendimentos, dos quais 18 foram do setor A. O percentual dos atendimentos que correspondem ao setor A é:",
  "options": [
   "20%",
   "25%",
   "30%",
   "35%",
   "40%"
  ],
  "answer": 2,
  "explanation": "O percentual é a razão entre a parte e o total: 18/60 = 0,30 = 30%. Para conferir as demais, calcule quanto cada uma representaria em 60 atendimentos: 20% seriam 12, 25% seriam 15, 35% seriam 21 e 40% seriam 24. Nenhum desses valores é 18, de modo que só 30% (0,30 × 60 = 18) reproduz a parte informada. Outra forma é simplificar a fração: 18/60 = 3/10.",
  "lawRef": "Porcentagem como razão parte ÷ total"
 },
 {
  "id": "rlm-m13-autoral-16",
  "origem": "autoral-ia",
  "q": "Em um gráfico de setores sobre os processos de uma vara, o setor \"Execução fiscal\" ocupa 72° do círculo. Esse setor representa que porcentagem do total?",
  "options": [
   "20%",
   "10%",
   "15%",
   "25%",
   "30%"
  ],
  "answer": 0,
  "explanation": "O círculo completo mede 360° e equivale a 100%. A proporção do setor é 72/360 = 0,20, ou seja, 20%. Conferindo as outras opções com a conversão inversa (percentual × 360°): 10% daria 36°, 15% daria 54°, 25% daria 90° e 30% daria 108°. Nenhum deles é 72°, e apenas 20% × 360° = 72° fecha a conta. Também vale notar que 72° é um quinto de 360°, o que equivale a 20%.",
  "lawRef": "Gráfico de setores: porcentagem = ângulo ÷ 360°"
 },
 {
  "id": "rlm-m13-autoral-17",
  "origem": "autoral-ia",
  "q": "Um gráfico de barras compara a arrecadação de dois meses: R$ 90 mil e R$ 100 mil. O eixo vertical começa em R$ 80 mil, e por isso a barra do segundo mês aparece com o dobro da altura da barra do primeiro (20 contra 10 unidades de altura). Sobre esse gráfico, é correto afirmar que:",
  "options": [
   "o gráfico está correto, pois a altura das barras é sempre proporcional ao valor, qualquer que seja o início do eixo",
   "o segundo mês arrecadou o dobro do primeiro, como mostram as alturas das barras",
   "o aumento de arrecadação foi de 10%, pois a diferença de R$ 10 mil é dividida por R$ 100 mil",
   "o eixo truncado exagera a diferença visual: o aumento real do primeiro para o segundo mês é de cerca de 11,1%",
   "o gráfico é inválido, pois barras só podem ser usadas quando o eixo vertical começa em R$ 100 mil"
  ],
  "answer": 3,
  "explanation": "Com o eixo começando em 80, as alturas representam apenas o que excede 80 (10 e 20), e não os valores reais (90 e 100), o que dobra a aparência da diferença. O aumento real é (100 − 90)/90 = 10/90 ≈ 11,1%, calculado sobre o valor inicial. A alternativa que fala em proporcionalidade independente do eixo é falsa, justamente por causa do truncamento. A que afirma o dobro lê as alturas e não os valores. A de 10% divide pelo valor final (100) em vez do inicial. E não há regra que exija eixo começando em 100.",
  "lawRef": "Eixo truncado; variação percentual sobre o valor inicial"
 },
 {
  "id": "rlm-m13-autoral-18",
  "origem": "autoral-ia",
  "q": "Três categorias de processos têm frequências absolutas 12, 18 e 30 em uma tabela. A frequência relativa conjunta das duas primeiras categorias é:",
  "options": [
   "30%",
   "50%",
   "20%",
   "70%",
   "80%"
  ],
  "answer": 1,
  "explanation": "O total é 12 + 18 + 30 = 60. As duas primeiras categorias somam 12 + 18 = 30, e a frequência relativa conjunta é 30/60 = 0,50 = 50%. As demais opções correspondem a outras combinações: 20% é só a primeira categoria (12/60), 30% é só a segunda (18/60), 70% é a primeira mais a terceira (42/60) e 80% é a segunda mais a terceira (48/60). O erro típico é esquecer de incluir a terceira categoria no total ao calcular a divisão.",
  "lawRef": "Frequência relativa de classes agrupadas"
 },
 {
  "id": "rlm-m13-autoral-19",
  "origem": "autoral-ia",
  "q": "Em um histograma em que a área de cada barra é proporcional à frequência, uma classe tem largura 4 e frequência 20, e outra tem largura 10 e frequência 30. A razão entre a altura da primeira barra e a da segunda é:",
  "options": [
   "2:3",
   "2:5",
   "1:1",
   "5:2",
   "5:3"
  ],
  "answer": 4,
  "explanation": "Quando a área representa a frequência, a altura é a densidade de frequência: frequência ÷ largura. Primeira classe: 20/4 = 5. Segunda classe: 30/10 = 3. A razão entre as alturas é 5:3. A razão 2:3 compara as frequências (20:30) e ignora a largura. A 2:5 é a razão entre as larguras (4:10), e a 5:2 é essa mesma razão invertida. A razão 1:1 só ocorreria se as densidades fossem iguais, o que não é o caso.",
  "lawRef": "Histograma com classes desiguais: altura = frequência ÷ largura"
 },
 {
  "id": "rlm-m13-autoral-20",
  "origem": "autoral-ia",
  "q": "Um infográfico informa que, na cidade A, 70% dos 10 casos analisados são da categoria X e que, na cidade B, 50% dos 40 casos analisados são dessa mesma categoria. Qual cidade tem mais casos da categoria X em número absoluto?",
  "options": [
   "A cidade A, porque seu percentual (70%) é maior que o de B (50%)",
   "As duas cidades têm o mesmo número de casos, pois 70% de 10 e 50% de 40 se equivalem",
   "A cidade B, com 20 casos contra 7 da cidade A",
   "A cidade A, pois o percentual 70% indica 70 casos, contra 50 de B",
   "Não é possível comparar, pois os percentuais têm bases diferentes"
  ],
  "answer": 2,
  "explanation": "Percentual não informa o volume: é preciso aplicar cada porcentagem ao seu total. Cidade A: 0,70 × 10 = 7 casos. Cidade B: 0,50 × 40 = 20 casos. Logo, B tem mais casos, embora o percentual seja menor. A primeira alternativa compara só os percentuais. A segunda é falsa, pois 7 e 20 são diferentes. A quarta trata o percentual como se fosse a contagem. A última está errada porque, conhecendo os totais, a comparação em números absolutos é perfeitamente possível.",
  "lawRef": "Percentual x valor absoluto"
 }
];
