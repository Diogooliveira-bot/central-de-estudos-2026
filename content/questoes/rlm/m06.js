/* Banco de questões — Raciocínio Lógico-Matemático, módulo 06. Questões autorais (não são de banca).
 * Para acrescentar questões, veja content/questoes/LEIAME.md e rode "npm run questoes:check". */
window.BC_QUESTOES=window.BC_QUESTOES||{};
(window.BC_QUESTOES.rlm=window.BC_QUESTOES.rlm||{})[6]=[
 {
  "id": "rlm-m06-autoral-01",
  "origem": "autoral-ia",
  "q": "Quatro servidores (Ana, Beto, Carla e Davi) foram escalados, cada um em um setor diferente (Protocolo, Arquivo, Cartório e Distribuição) e em um dia diferente da semana (segunda, terça, quarta e quinta-feira), de modo que cada setor e cada dia correspondem a um único servidor. Sabe-se que: (1) Ana não trabalha no Arquivo; (2) Beto atende na terça-feira; (3) Carla não trabalha na Distribuição nem no Protocolo; (4) o servidor do Arquivo atende no dia imediatamente seguinte ao do servidor do Protocolo; (5) Davi não atende na segunda nem na quinta-feira; (6) Ana atende em dia anterior ao de Carla. Com base nessas informações, é correto concluir, necessariamente, que:",
  "options": [
   "Beto trabalha no Arquivo e Davi, na Distribuição.",
   "Ana trabalha na Distribuição e Davi, no Protocolo.",
   "Carla trabalha no Cartório e Beto, no Protocolo.",
   "Ana atende na segunda-feira e Carla, na quinta-feira.",
   "Carla trabalha no Arquivo e Davi, no Protocolo."
  ],
  "answer": 3,
  "explanation": "Método da tabela com propagação de exclusões, pois a correspondência é um a um. Pela condição (2), Beto fica com a terça; pela (5), Davi não pode ficar com segunda nem quinta e a terça já é de Beto, logo Davi atende na quarta. Sobram segunda e quinta para Ana e Carla e, como Ana atende antes de Carla (6), Ana fica com a segunda e Carla com a quinta. Isso vale em todas as soluções. Já os setores admitem quatro distribuições compatíveis: (Ana, Beto, Carla, Davi) = (Protocolo, Arquivo, Cartório, Distribuição); (Cartório, Distribuição, Arquivo, Protocolo); (Distribuição, Protocolo, Cartório, Arquivo); ou (Distribuição, Cartório, Arquivo, Protocolo). Por isso as alternativas A, B e C valem em apenas uma solução cada, e a E vale em duas: são possíveis, mas não necessárias. Uma configuração que respeita o enunciado e contraria a alternativa já a descarta como conclusão necessária.",
  "lawRef": "Associação lógica — tabela de eliminação; conclusão necessária x possível"
 },
 {
  "id": "rlm-m06-autoral-02",
  "origem": "autoral-ia",
  "q": "Cinco candidatos (Lara, Marcos, Nina, Otávio e Paulo) formarão uma fila única, com posições numeradas de 1 a 5, sem empates. Sabe-se que: Lara fica imediatamente antes de Marcos; Nina não ocupa nenhuma das extremidades; Otávio fica em posição anterior à de Lara (não necessariamente imediatamente anterior); Paulo não é o último da fila. Quantas filas distintas satisfazem simultaneamente todas essas condições?",
  "options": [
   "1",
   "4",
   "6",
   "8",
   "9"
  ],
  "answer": 1,
  "explanation": "Trate \"Lara imediatamente antes de Marcos\" como um bloco de duas casas consecutivas e teste a posição do bloco. Como Otávio precisa estar antes de Lara, o bloco não pode começar na casa 1. Se o bloco ocupar as casas 2-3, Otávio fica na 1, Nina (que não pode ficar nas pontas) fica na 4 e Paulo na 5, o que viola a regra de Paulo não ser o último. Se ocupar as casas 3-4, Nina precisa ficar na 2 e Otávio na 1, restando a casa 5 para Paulo: novamente inválido. Resta o bloco nas casas 4-5. As casas 1, 2 e 3 recebem Nina, Otávio e Paulo, com Nina fora da casa 1: Nina na 2 (2 ordens para os outros dois) ou Nina na 3 (2 ordens), total 4. Quem esquece a restrição sobre Paulo obtém 6; quem ignora a de Otávio, 8; quem trata \"antes\" como \"imediatamente antes\" obtém só 1 fila.",
  "lawRef": "Associação lógica — ordenação com bloco (\"imediatamente antes\") e contagem de casos"
 },
 {
  "id": "rlm-m06-autoral-03",
  "origem": "autoral-ia",
  "q": "Quatro funcionários (Heitor, Irene, Jorge e Karla) são suspeitos de ter apagado um arquivo do sistema, e apenas um deles o fez. Cada um declarou: Heitor: \"Foi a Irene.\" Irene: \"Foi a Karla.\" Jorge: \"Não fui eu.\" Karla: \"A Irene está mentindo.\" Sabe-se que exatamente uma das quatro declarações é verdadeira. Quem apagou o arquivo?",
  "options": [
   "Heitor",
   "Irene",
   "Karla",
   "Não é possível determinar, pois mais de um funcionário é compatível com as declarações.",
   "Jorge"
  ],
  "answer": 4,
  "explanation": "Teste cada hipótese de culpado e conte as declarações verdadeiras, lembrando que o enunciado exige exatamente uma. Se Heitor fosse o culpado: a fala de Heitor (\"Foi a Irene\") é falsa; a de Irene (\"Foi a Karla\"), falsa; a de Jorge (\"Não fui eu\"), verdadeira, pois não foi ele; e a de Karla, verdadeira, pois a fala de Irene é falsa. Duas verdadeiras: hipótese descartada. Se fosse Irene: Heitor, Jorge e Karla dizem coisas verdadeiras (três), descartada. Se fosse Karla: Irene e Jorge acertam (duas), descartada. Se fosse Jorge: Heitor erra, Irene erra, Jorge mente ao negar a autoria, e apenas Karla acerta, ao dizer que Irene mente. Exatamente uma verdadeira, logo Jorge é o único culpado compatível. Existe, portanto, uma única solução, e a alternativa D é falsa. Contar \"pessoas honestas\" em vez de \"declarações verdadeiras\" leva aos erros A, B e C.",
  "lawRef": "Verdade e mentira — teste de hipóteses com contagem de afirmações verdadeiras"
 },
 {
  "id": "rlm-m06-autoral-04",
  "origem": "autoral-ia",
  "q": "Marcos, que sempre mente, fez a seguinte declaração: \"Se eu compareci à audiência, então assinei a ata ou paguei a taxa.\" Como a declaração inteira é falsa, conclui-se, necessariamente, que Marcos:",
  "options": [
   "não compareceu à audiência, não assinou a ata e não pagou a taxa.",
   "compareceu à audiência, não assinou a ata, mas pagou a taxa.",
   "compareceu à audiência e deixou de cumprir apenas uma das duas exigências: assinar a ata ou pagar a taxa.",
   "compareceu à audiência, não assinou a ata e não pagou a taxa.",
   "não compareceu à audiência, ou assinou a ata, ou pagou a taxa."
  ],
  "answer": 3,
  "explanation": "A fala de um mentiroso é falsa como proposição inteira, e não parcela por parcela. A declaração tem a forma P → (Q ∨ R), em que P é comparecer, Q é assinar a ata e R é pagar a taxa. Uma condicional só é falsa quando o antecedente é verdadeiro e o consequente é falso. Logo, P é verdadeiro (Marcos compareceu) e Q ∨ R é falso. Pela lei de De Morgan, a negação de uma disjunção exige que as duas parcelas sejam falsas: ele não assinou a ata e não pagou a taxa. Resultado: compareceu, não assinou e não pagou. A alternativa A nega também o antecedente; B e C admitem que uma das exigências foi cumprida (o \"ou\" falso exige as duas descumpridas); E é apenas a forma equivalente da própria condicional, ou seja, a declaração verdadeira que Marcos não pode ter feito.",
  "lawRef": "Negação da condicional e de De Morgan — fala de mentiroso é falsa como um todo"
 },
 {
  "id": "rlm-m06-autoral-05",
  "origem": "autoral-ia",
  "q": "Uma unidade distribui quatro processos (P1, P2, P3 e P4) entre três analistas (X, Y e Z). Cada processo é entregue a um único analista, mas um mesmo analista pode receber mais de um processo, ou nenhum. Sabe-se que: P1 não é entregue a X; P2 e P3 são entregues ao mesmo analista; P4 é entregue a analista diferente do que recebeu P1. De quantas maneiras diferentes a distribuição pode ser feita?",
  "options": [
   "6",
   "8",
   "12",
   "18",
   "36"
  ],
  "answer": 2,
  "explanation": "Aqui não há exclusividade: o enunciado permite repetição, e impor que analistas ou processos sejam distintos é o erro clássico. Conte por etapas, respeitando as restrições. P1 pode ir para Y ou Z: 2 possibilidades. P2 e P3 formam uma unidade, pois vão ao mesmo analista, que pode ser qualquer um dos três (inclusive o de P1): 3 possibilidades. P4 deve ir a analista diferente do de P1, sobrando 2 possibilidades. Total: 2 × 3 × 2 = 12. A resposta 18 (2 × 3 × 3) esquece a restrição de P4; 36 trata P2 e P3 como escolhas independentes (2 × 3 × 3 × 2); 8 supõe, sem autorização do texto, que P2 e P3 não podem ficar com o analista de P1 (2 × 2 × 2); 6 esquece de contar P4 (2 × 3).",
  "lawRef": "Associação sem exclusividade — princípio multiplicativo com restrições"
 },
 {
  "id": "rlm-m06-autoral-06",
  "origem": "autoral-ia",
  "q": "Três servidores fazem afirmações sobre a juntada de três documentos aos autos de um processo: o ofício, o parecer e o despacho. O primeiro diz: \"Se o ofício foi juntado, então o parecer foi juntado.\" O segundo diz: \"O ofício foi juntado ou o despacho foi juntado.\" O terceiro diz: \"Se o parecer foi juntado, então o despacho foi juntado.\" Sabe-se que exatamente uma dessas três afirmações é verdadeira. Conclui-se que:",
  "options": [
   "nenhum dos três documentos foi juntado.",
   "apenas o ofício foi juntado.",
   "apenas o despacho foi juntado.",
   "o ofício e o parecer foram juntados.",
   "apenas o parecer foi juntado."
  ],
  "answer": 4,
  "explanation": "Chame de X, Y e Z a juntada do ofício, do parecer e do despacho. As afirmações são I: X → Y; II: X ∨ Z; III: Y → Z. Como exatamente uma é verdadeira, teste as oito combinações. Nenhum juntado (X, Y, Z falsos): I e III verdadeiras, duas verdadeiras. Só o ofício: II e III verdadeiras (a III é verdadeira porque o antecedente é falso). Só o despacho: as três verdadeiras. Ofício e parecer: I e II verdadeiras. Só o parecer: I é verdadeira (antecedente falso), II é falsa (nem ofício nem despacho) e III é falsa (parecer juntado sem despacho): exatamente uma. As demais combinações (parecer e despacho; ofício e despacho; os três) resultam em duas ou três verdadeiras. Só resta a juntada apenas do parecer. Lembre que uma condicional com antecedente falso é verdadeira, o que explica as armadilhas das alternativas A e B.",
  "lawRef": "Exatamente uma afirmação verdadeira — tabela-verdade das condicionais"
 },
 {
  "id": "rlm-m06-autoral-07",
  "origem": "autoral-ia",
  "q": "Em uma ilha, todo habitante é veraz (sempre diz a verdade) ou mentiroso (sempre mente). Três habitantes declaram: A diz: \"B é mentiroso.\" B diz: \"A e C são do mesmo tipo.\" C diz: \"Entre nós três há exatamente um mentiroso.\" Pode-se concluir, necessariamente, que:",
  "options": [
   "C é mentiroso.",
   "A é veraz.",
   "B é veraz.",
   "A e B são do mesmo tipo.",
   "há exatamente um mentiroso entre os três."
  ],
  "answer": 0,
  "explanation": "Teste primeiro a hipótese de C ser veraz; então haveria exatamente um mentiroso entre A e B. Se A fosse veraz, B seria mentiroso e a fala de B (\"A e C são do mesmo tipo\") teria de ser falsa; mas A e C seriam ambos veracíssimos, ou seja, do mesmo tipo, e a fala seria verdadeira: contradição. Se A fosse mentiroso, B seria veraz e sua fala teria de ser verdadeira; mas A é mentiroso e C é veraz, tipos diferentes: contradição. Logo C é mentiroso, e a frase de C (\"há exatamente um mentiroso\") é falsa. Agora há duas soluções: A veraz e B mentiroso (a fala de B é falsa, pois A e C são de tipos diferentes, e a de C também é falsa, pois haveria dois mentirosos); ou A mentiroso e B veraz (a fala de B é verdadeira, pois A e C são ambos mentirosos, e a de A é falsa). Só \"C é mentiroso\" vale nas duas soluções. As alternativas B e C são apenas possíveis; D (A e B do mesmo tipo) e E (exatamente um mentiroso) são impossíveis.",
  "lawRef": "Verdade e mentira — teste de casos; conclusão necessária"
 },
 {
  "id": "rlm-m06-autoral-08",
  "origem": "autoral-ia",
  "q": "Cinco processos (P1 a P5) serão julgados, um por sessão, em cinco sessões consecutivas numeradas de 1 a 5, sem repetição de sessão. Sabe-se que: (1) P1 é julgado antes de P2, não necessariamente na sessão imediatamente anterior; (2) P3 é julgado na sessão imediatamente seguinte à de P2; (3) P4 não é julgado na 1ª nem na 5ª sessão; (4) P5 é julgado antes de P1. Assinale a afirmação que pode ser verdadeira, mas não é necessariamente verdadeira.",
  "options": [
   "P4 é julgado depois de P3.",
   "P1 é julgado na 2ª sessão.",
   "P5 é julgado na 1ª sessão.",
   "P2 é julgado na 4ª sessão.",
   "P4 é julgado antes de P2."
  ],
  "answer": 1,
  "explanation": "Como P5 vem antes de P1, e P1 antes de P2, o processo P2 só pode ser julgado da 3ª sessão em diante, e P3 vem logo depois dele. Se P2 fosse a 3ª sessão, P3 seria a 4ª, P5 e P1 ocupariam a 1ª e a 2ª, e sobraria a 5ª sessão para P4, o que a condição (3) proíbe. Logo P2 é a 4ª sessão e P3 a 5ª. Sobram as sessões 1, 2 e 3 para P5, P1 e P4, com P5 antes de P1 e P4 fora da 1ª sessão. Há exatamente duas soluções: P5, P1, P4 (P1 na 2ª sessão) ou P5, P4, P1 (P1 na 3ª sessão). Em ambas, P5 é julgado na 1ª sessão (C), P2 na 4ª (D) e P4 antes de P2 (E): essas três são necessárias. A (P4 depois de P3, que está na 5ª sessão) é impossível. A única que ocorre em uma solução e não na outra é B: P1 na 2ª sessão pode acontecer, mas não é necessário.",
  "lawRef": "Ordenação com restrições — afirmação possível x necessária"
 },
 {
  "id": "rlm-m06-autoral-09",
  "origem": "autoral-ia",
  "q": "Cinco pessoas (Alice, Bruno, Célia, Dino e Elisa) sentam-se em volta de uma mesa circular com cinco lugares iguais. Duas disposições que diferem apenas por uma rotação da mesa são consideradas iguais, mas disposições espelhadas são consideradas diferentes. Sabe-se que Alice senta-se ao lado de Bruno, que Dino senta-se ao lado de Elisa e que Bruno não se senta ao lado de Dino. De quantas maneiras as cinco pessoas podem se acomodar?",
  "options": [
   "6",
   "8",
   "24",
   "30",
   "120"
  ],
  "answer": 0,
  "explanation": "Como rotações não contam como disposições distintas, fixe Alice em um lugar; a mesa passa a ter quatro lugares livres numerados no sentido horário. Bruno senta-se imediatamente à direita ou à esquerda de Alice (2 casos, simétricos). Tome Bruno à direita de Alice e chame de 2, 3 e 4 os lugares seguintes. O lugar 2 (vizinho de Bruno) não pode ser de Dino, e Dino e Elisa precisam ser vizinhos. Dino e Elisa nos lugares 2-3: Dino não pode ficar no 2, então Elisa no 2, Dino no 3 e Célia no 4 (1 disposição). Dino e Elisa nos lugares 3-4: Célia fica no 2 e há duas ordens para o casal (2 disposições). São 3 disposições em cada caso, total 3 × 2 = 6. O valor 8 aparece quando se esquece uma das três restrições; 30 conta as rotações como diferentes (6 × 5); 24 e 120 ignoram as restrições (4! com Alice fixa, ou 5! em fila).",
  "lawRef": "Associação em mesa circular — fixar uma pessoa e contar com restrições"
 },
 {
  "id": "rlm-m06-autoral-10",
  "origem": "autoral-ia",
  "q": "Quatro candidatos (Ana, Bruno, Carla e Davi) foram aprovados e classificados do 1º ao 4º lugar, sem empates. Cada um escolheu um tribunal diferente para lotação: TJ, TRF, TRT e TRE. Sabe-se que: (1) Ana foi classificada imediatamente depois de Bruno; (2) Carla foi classificada antes de Davi; (3) Davi escolheu o TJ ou o TRE; (4) quem escolheu o TRF foi o último colocado; (5) quem escolheu o TRT foi classificado antes de quem escolheu o TRE; (6) Bruno não escolheu o TRE. Quem foi o 3º colocado e qual tribunal ele escolheu?",
  "options": [
   "Carla, TRT",
   "Davi, TRE",
   "Bruno, TJ",
   "Ana, TRF",
   "Davi, TJ"
  ],
  "answer": 2,
  "explanation": "Primeiro, a ordem. Por (1), Bruno e Ana formam o bloco \"Bruno-Ana\". Por (2), Carla vem antes de Davi. As ordens possíveis são: Carla-Davi-Bruno-Ana; Carla-Bruno-Ana-Davi; Bruno-Ana-Carla-Davi. Por (4), o último colocado escolheu o TRF; nas duas últimas ordens o último é Davi, que, por (3), só pode ficar com TJ ou TRE: contradição. Logo a ordem é Carla (1º), Davi (2º), Bruno (3º), Ana (4ª), e Ana escolheu o TRF. Agora os tribunais restantes (TJ, TRT, TRE) para Carla, Davi e Bruno. Bruno não escolheu o TRE (6) e Davi só TJ ou TRE (3). Se Davi ficasse com o TJ, o TRE iria para Carla (já que Bruno não pode) e o TRT para Bruno; mas (5) exige TRT antes de TRE, e Bruno (3º) vem depois de Carla (1ª): contradição. Então Davi escolheu o TRE; o TRT, que deve vir antes, é de Carla, e sobra o TJ para Bruno. O 3º colocado é Bruno, que escolheu o TJ.",
  "lawRef": "Associação lógica — tabela de eliminação com três categorias (pessoa, posição, tribunal)"
 },
 {
  "id": "rlm-m06-autoral-11",
  "origem": "autoral-ia",
  "q": "Três servidores — Ana, Bia e Caio — receberão crachás de cores diferentes (azul, verde e amarelo), um para cada servidor, sem repetição de cor. Sabe-se que Ana recebeu o crachá azul. Qual das afirmações é necessariamente verdadeira?",
  "options": [
   "Bia e Caio não receberam o crachá azul.",
   "Bia recebeu o crachá azul.",
   "Caio recebeu o crachá azul.",
   "Todos os servidores receberam o crachá azul.",
   "Ninguém recebeu o crachá azul."
  ],
  "answer": 0,
  "explanation": "Como cada cor foi entregue a um único servidor (não há repetição) e o azul já pertence a Ana, ele fica indisponível para os demais: nem Bia nem Caio podem tê-lo. Isso torna a alternativa A necessária. As alternativas B e C afirmam o contrário do que a exclusividade permite; D contradiz a regra de cores diferentes; E contradiz o dado de que Ana usa azul. Note que não é possível dizer qual das duas cores restantes cabe a Bia ou a Caio, mas isso não é perguntado: a pergunta é o que vale em todas as distribuições possíveis.",
  "lawRef": "Associação lógica — exclusividade (correspondência um a um)"
 },
 {
  "id": "rlm-m06-autoral-12",
  "origem": "autoral-ia",
  "q": "Em uma fila de atendimento, o enunciado informa que \"Lia está imediatamente antes de Caio\". Qual das conclusões abaixo decorre dessa informação?",
  "options": [
   "Há exatamente uma pessoa entre Lia e Caio.",
   "Lia ocupa necessariamente o primeiro lugar da fila.",
   "Caio ocupa necessariamente o último lugar da fila.",
   "Não há ninguém entre os dois, e Lia vem antes de Caio.",
   "Lia e Caio podem trocar de lugar sem que a informação deixe de valer."
  ],
  "answer": 3,
  "explanation": "A expressão \"imediatamente antes\" fixa duas coisas: as posições são consecutivas (não há ninguém no meio) e a ordem é Lia, depois Caio. Por isso a alternativa D está correta. A alternativa A confunde com \"uma pessoa entre eles\"; B e C impõem extremidades que o texto não menciona (a dupla pode estar no meio da fila); E é falsa porque, ao trocar, Caio ficaria antes de Lia e a informação deixaria de valer. Ao resolver, trate \"imediatamente antes\" como um bloco de duas casas em ordem fixa.",
  "lawRef": "Ordenação — \"imediatamente antes\" (posições consecutivas e ordem fixa)"
 },
 {
  "id": "rlm-m06-autoral-13",
  "origem": "autoral-ia",
  "q": "Três cargos distintos (chefia, secretaria e arquivo) serão distribuídos entre três servidores — Ana, Bruno e Carla —, um cargo para cada servidor. Quantos cargos Bruno receberá?",
  "options": [
   "Nenhum, necessariamente.",
   "Exatamente um.",
   "Dois.",
   "Três.",
   "Um ou dois, conforme o sorteio."
  ],
  "answer": 1,
  "explanation": "O modelo é de correspondência um a um: três cargos, três servidores, um cargo para cada. Logo cada servidor, inclusive Bruno, recebe exatamente um cargo, o que torna correta a alternativa B. Se Bruno recebesse nenhum cargo, sobraria cargo para outro servidor, que teria dois, contra a regra; se recebesse dois ou três, faltaria cargo para os demais. A alternativa E tenta inventar uma variação que o enunciado exclui. Sempre que o texto diz \"um para cada\", a quantidade por pessoa está fixada em um.",
  "lawRef": "Associação lógica — correspondência um a um"
 },
 {
  "id": "rlm-m06-autoral-14",
  "origem": "autoral-ia",
  "q": "Ana, Bia e Caio ocupam, sem empate, o 1º, o 2º e o 3º lugares em uma classificação. Sabe-se que Caio é o 3º colocado e que Ana foi classificada antes de Bia. Quem é o 2º colocado?",
  "options": [
   "Ana",
   "Caio",
   "Não é possível determinar.",
   "Ana ou Caio.",
   "Bia"
  ],
  "answer": 4,
  "explanation": "Caio ocupa o 3º lugar, restando o 1º e o 2º para Ana e Bia. Como Ana foi classificada antes de Bia, Ana tem o 1º lugar e Bia, o 2º. Só há uma classificação possível, de modo que é possível determinar o 2º colocado: Bia (alternativa E). As alternativas A e D trocam a ordem exigida pelo enunciado; B contradiz o fato de Caio ser o 3º; C erra porque a informação é suficiente. Em ordenação, comece pela posição já dada e preencha o que sobra com a regra de precedência.",
  "lawRef": "Ordenação — eliminação de casos"
 },
 {
  "id": "rlm-m06-autoral-15",
  "origem": "autoral-ia",
  "q": "Davi, Eva e Fábio têm, cada um, uma caneta de cor diferente: vermelha, azul ou preta. Sabe-se que Eva tem a caneta azul e que Davi não tem a vermelha. Qual é a cor da caneta de Davi?",
  "options": [
   "Azul",
   "Vermelha",
   "Preta",
   "Azul ou preta.",
   "Não há distribuição possível."
  ],
  "answer": 2,
  "explanation": "Monte a tabela com pessoas e cores. Eva fica com o azul, e isso elimina o azul para Davi e Fábio. Davi também não tem o vermelho; restando apenas o preto, Davi tem a caneta preta e, por consequência, Fábio fica com a vermelha. A distribuição é única e compatível com todas as condições, o que descarta a alternativa E. A alternativa A contradiz o dado sobre Eva, B contradiz o dado sobre Davi e D inclui a cor azul, já ocupada. Em quadros de associação, cada cor usada elimina as demais casas da mesma linha e coluna.",
  "lawRef": "Associação lógica — tabela de eliminação"
 },
 {
  "id": "rlm-m06-autoral-16",
  "origem": "autoral-ia",
  "q": "Um declarante que sempre mente afirmou: \"O réu foi citado e o prazo foi cumprido.\" Conclui-se, necessariamente, que:",
  "options": [
   "o réu não foi citado ou o prazo não foi cumprido (ao menos um dos dois fatos não ocorreu).",
   "o réu não foi citado e o prazo não foi cumprido.",
   "o réu não foi citado.",
   "o prazo não foi cumprido.",
   "os dois fatos têm valores lógicos diferentes."
  ],
  "answer": 0,
  "explanation": "Quem sempre mente produz afirmações falsas como um todo. A afirmação tem a forma P ∧ Q (conjunção), que só é verdadeira quando as duas parcelas são verdadeiras; portanto, para ser falsa, basta que pelo menos uma seja falsa. Isso é a negação da conjunção (De Morgan): ¬(P ∧ Q) ≡ ¬P ∨ ¬Q. Assim, a única conclusão segura é a alternativa A. A alternativa B exige que as duas sejam falsas, o que é possível, mas não necessário; C e D escolhem uma parcela sem base; E exige que uma seja verdadeira e outra falsa, deixando de fora o caso em que as duas são falsas.",
  "lawRef": "Negação da conjunção — Leis de De Morgan"
 },
 {
  "id": "rlm-m06-autoral-17",
  "origem": "autoral-ia",
  "q": "Em uma fila para sustentação oral, Marcos está antes de Nina e Nina está antes de Olga. Então, necessariamente:",
  "options": [
   "Olga está antes de Marcos.",
   "Nina é a primeira da fila.",
   "Marcos e Olga estão em posições adjacentes.",
   "a fila tem exatamente três pessoas.",
   "Marcos está antes de Olga."
  ],
  "answer": 4,
  "explanation": "A relação \"estar antes de\" é transitiva: se M precede N e N precede O, então M precede O. Isso garante a alternativa E. A alternativa A é o oposto do que a transitividade exige. B é falsa, pois Marcos vem antes de Nina; C não é obrigatória, já que Nina pode estar entre eles ou outras pessoas podem separá-los; D é falsa porque a fila pode ter mais gente (o enunciado só ordena três). Evite acrescentar informações que o texto não dá, como o total de pessoas ou a adjacência.",
  "lawRef": "Ordenação — transitividade da precedência"
 },
 {
  "id": "rlm-m06-autoral-18",
  "origem": "autoral-ia",
  "q": "Quatro servidores — A, B, C e D — ocupam as cadeiras numeradas de 1 a 4 de uma sala de espera, uma por servidor. A ocupa a cadeira 1, C ocupa a cadeira 4 e B ocupa a cadeira de número imediatamente superior à de D. Quem ocupa a cadeira 2?",
  "options": [
   "A",
   "D",
   "B",
   "C",
   "Não é possível determinar."
  ],
  "answer": 1,
  "explanation": "Com A na cadeira 1 e C na cadeira 4, sobram as cadeiras 2 e 3 para B e D. A condição \"B ocupa a cadeira de número imediatamente superior à de D\" significa B = D + 1. Se D ficasse na 3, B teria de ficar na 4, que é de C: impossível. Logo D ocupa a 2 e B ocupa a 3. A solução é única, então a alternativa E é falsa. As alternativas A e C se referem a pessoas que já têm cadeiras fixadas (1 e 4); a B só teria a cadeira 2 se a regra fosse lida ao contrário (D na cadeira imediatamente superior à de B), mas aí D iria para a cadeira 3 e B para a 2, o que inverte o enunciado. Cuidado com essa leitura invertida.",
  "lawRef": "Ordenação — posições consecutivas com ordem fixa"
 },
 {
  "id": "rlm-m06-autoral-19",
  "origem": "autoral-ia",
  "q": "Três caixas de arquivo — A, B e C — contêm, cada uma, exatamente um dos objetos X, Y ou Z, todos diferentes entre si. Sabe-se que A não contém X nem Z, e que B não contém Z. O que há na caixa C?",
  "options": [
   "X",
   "Y",
   "X ou Z.",
   "Z",
   "Não é possível determinar."
  ],
  "answer": 3,
  "explanation": "A caixa A não contém X nem Z, logo contém Y. Sobram X e Z para B e C. Como B não contém Z, B contém X e, por exclusão, C contém Z (alternativa D). A solução é única, o que afasta a alternativa E. A alternativa A (X) é o objeto de B; a B (Y) é o objeto de A, já ocupado; a C (\"X ou Z\") sugeriria duas possibilidades, mas a restrição sobre B elimina uma delas. Em tabelas de eliminação, comece sempre pela linha que tem mais negativas.",
  "lawRef": "Associação lógica — tabela de eliminação"
 },
 {
  "id": "rlm-m06-autoral-20",
  "origem": "autoral-ia",
  "q": "O cronograma de um treinamento prevê três sessões — P, Q e R —, uma por dia, em três dias consecutivos, sem repetição. P não ocorre no primeiro dia, e Q ocorre depois de P. Qual é a ordenação das sessões?",
  "options": [
   "P-Q-R",
   "P-R-Q",
   "R-P-Q",
   "Q-P-R",
   "R-Q-P"
  ],
  "answer": 2,
  "explanation": "Há seis ordenações possíveis; teste cada uma contra as duas regras. P-Q-R e P-R-Q colocam P no primeiro dia: eliminadas. Q-P-R e R-Q-P colocam Q antes de P: eliminadas. Resta R-P-Q, em que P não é o primeiro e Q vem depois de P. Raciocinando pela posição, P não pode ocupar o 1º dia (regra 1) nem o 3º (Q teria de vir depois), então P é o 2º, Q é o 3º e R é o 1º. A ordenação é única, portanto, R-P-Q (alternativa C).",
  "lawRef": "Ordenação — eliminação de casos"
 }
];
