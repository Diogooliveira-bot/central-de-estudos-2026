/* Aprofundamento autoral de RLM (exemplos resolvidos, explicações e capítulos novos) — conteúdo de ensino, não são itens oficiais de banca. Deve carregar depois de complementos-teoria.js. */
(function(g){
'use strict';
if(g.__RLM_APROFUNDAMENTO_20261127)return;
const A=g.RLM_CURSO_AULAS;if(!A)return;
const D={
 "M02": {
  "extras": [
   {
    "capitulo": 1,
    "development": [
     "Algumas frases parecem proposições, mas dependem de algo que o texto não fixa. “Ele é analista judiciário” traz um pronome sem referência; “hoje é sexta-feira” depende do dia em que alguém a lê; “este processo foi arquivado” depende de qual processo está sendo apontado. Enquanto a referência não for fixada, trate a frase como aberta. Se o enunciado do exercício já identifica a pessoa, o dia ou o processo, a mesma frase passa a ser uma proposição, e você só precisa decidir se ela é verdadeira ou falsa. Quando você não sabe a resposta, isso não importa para a classificação.",
     "Há também frases declarativas que ficam fora do conceito por falta de um critério objetivo. “O novo sistema do tribunal é bonito” expressa uma opinião: não existe um teste que a torne claramente V ou F. “Que o prazo seja prorrogado!” exprime um desejo e “Protocole a petição” é uma ordem; nenhuma das duas é declarativa. Já “2 + 2 = 5” é declarativa, tem termos fixados e é falsa, logo é proposição. Ao classificar, pergunte nesta ordem: é declarativa? há variável ou referência solta? existe critério objetivo para V ou F?"
    ],
    "workedExamples": [
     {
      "prompt": "Classifique cada frase como proposição ou não proposição (sentença aberta, pergunta, ordem ou opinião) e, quando for proposição, diga o valor lógico: (1) “Quantos processos foram distribuídos hoje?”; (2) “O número 17 é primo e par.”; (3) “n + 4 > 10”; (4) “Protocole o documento até sexta-feira.”; (5) “Todo número primo é ímpar.”",
      "steps": [
       "Frase (1): é uma pergunta, não afirma nada; não é proposição.",
       "Frase (2): é declarativa e composta. “17 é primo” é V, “17 é par” é F; a conjunção V ∧ F é F. É uma proposição falsa.",
       "Frase (3): depende de n, que não foi fixado; para n = 7 é V (11 > 10) e para n = 5 é F (9 > 10 é falso). É sentença aberta.",
       "Frase (4): é uma ordem; não é proposição.",
       "Frase (5): é declarativa e fechada (a variável está ligada por “todo”). O número 2 é primo e par, portanto é um contraexemplo e a frase é F. É uma proposição falsa."
      ],
      "answer": "(1) não; (2) proposição F; (3) sentença aberta; (4) não; (5) proposição F."
     },
     {
      "prompt": "No universo U = {1, 2, 3, 4, 5, 6}, seja S(x) a sentença aberta x^2 − 5x + 6 = 0. Dê o valor lógico das proposições: (a) “existe x em U tal que S(x)”; (b) “para todo x em U, S(x)”; (c) “existe x em U tal que x é par e S(x)”; (d) “para todo x em U, se S(x) então x < 4”.",
      "steps": [
       "Teste cada elemento de U em x^2 − 5x + 6: x=1 dá 2; x=2 dá 0; x=3 dá 0; x=4 dá 2; x=5 dá 6; x=6 dá 12. Só x = 2 e x = 3 satisfazem S(x).",
       "(a) Existe pelo menos um elemento que satisfaz (x = 2): V.",
       "(b) Para ser V, os seis elementos teriam de satisfazer; x = 1 não satisfaz: F.",
       "(c) O elemento x = 2 é par e satisfaz S(x): V.",
       "(d) Só precisamos olhar onde S(x) é V (antecedente verdadeiro): x = 2 e x = 3, ambos menores que 4. Nos demais, o antecedente é F e a condicional é V. Logo, V."
      ],
      "answer": "(a) V; (b) F; (c) V; (d) V."
     }
    ],
    "tables": []
   },
   {
    "capitulo": 2,
    "development": [
     "Na linguagem comum, o “e” muitas vezes traz uma ordem no tempo (“abriu o processo e o distribuiu”), mas na lógica ele só junta duas afirmações: P ∧ Q e Q ∧ P têm sempre o mesmo valor. O “ou” também costuma ser inclusivo: em “o candidato pode apresentar certidão ou declaração”, apresentar as duas não viola nada. Só leia como exclusivo quando o texto trouxer “ou … ou” ou acrescentar “mas não ambos”. Adotamos, portanto, a leitura inclusiva sempre que o enunciado não disser o contrário.",
     "Guarde cada conectivo por um único caso decisivo, que é o que você precisa memorizar de verdade. A conjunção só é V na linha VV. A disjunção inclusiva só é F na linha FF. A condicional só é F na linha VF. A bicondicional é V quando os valores são iguais e F quando são diferentes; o ou exclusivo é o contrário, V quando são diferentes. Quando o exercício informa o valor de algumas letras, esse caso decisivo permite calcular sem montar a tabela inteira. Treine até responder de imediato: P ∧ Q com uma parcela F é F; P ∨ Q com uma parcela V é V; P → Q com consequente V é V; P ↔ Q com valores iguais é V."
    ],
    "workedExamples": [
     {
      "prompt": "Sejam P = “o prazo foi prorrogado” (V), Q = “o recurso foi indeferido” (F) e R = “a parte foi intimada” (V). Determine o valor lógico de (¬P ∨ Q) ↔ (R ∧ ¬Q).",
      "steps": [
       "Calcule o lado esquerdo: ¬P = ¬V = F; então ¬P ∨ Q = F ∨ F = F.",
       "Calcule o lado direito: ¬Q = ¬F = V; então R ∧ ¬Q = V ∧ V = V.",
       "O conectivo principal é a bicondicional: F ↔ V. Os valores são diferentes, logo o resultado é F."
      ],
      "answer": "A proposição é falsa (F)."
     },
     {
      "prompt": "Sabe-se que P ∧ Q é falsa, que P ∨ Q é verdadeira, que P ↔ R é verdadeira e que R → Q é verdadeira. Determine os valores de P, Q e R.",
      "steps": [
       "P ∧ Q falsa e P ∨ Q verdadeira: exatamente uma das duas, P ou Q, é verdadeira. Restam dois casos.",
       "Caso 1: P = V e Q = F. Como P ↔ R é V, R = V. Então R → Q = V → F = F, o que contradiz a informação de que R → Q é V. Caso descartado.",
       "Caso 2: P = F e Q = V. Como P ↔ R é V, R = F. Então R → Q = F → V = V, de acordo com o dado. Confira: P ∧ Q = F e P ∨ Q = V, também de acordo.",
       "Não há outro caso, logo a solução é única."
      ],
      "answer": "P = F, Q = V e R = F."
     }
    ],
    "tables": []
   },
   {
    "capitulo": 3,
    "development": [
     "Por que a condicional é verdadeira quando o antecedente é falso? Pense em uma promessa: “Se o processo for urgente, ele será despachado no mesmo dia.” A promessa só é descumprida quando o processo é urgente e não é despachado no mesmo dia. Se o processo não é urgente, a regra nada exige, e ela não foi violada, qualquer que seja o destino do processo. A tabela da condicional apenas registra quando a regra é quebrada (linha VF) e quando não é (as outras três). Por isso, negar “se P, então Q” é afirmar P ∧ ¬Q: o único cenário que contraria a regra.",
     "Duas observações ajudam a economizar tempo. Primeiro, ao calcular uma condicional com várias letras, olhe o consequente: se ele for V, a condicional é V; olhe o antecedente: se ele for F, a condicional é V. Só é preciso fazer a conta completa quando o antecedente é V e o consequente é F. Segundo, uma condicional com antecedente em forma de “ou” equivale a várias condicionais separadas, uma para cada parcela, como mostra o último exemplo guiado deste capítulo. Já com antecedente em forma de “e”, isso não vale, e a diferença aparece em duas linhas da tabela."
    ],
    "workedExamples": [
     {
      "prompt": "A regra do cartório é: “Se o processo é urgente (U), então ele é despachado no mesmo dia (D).” Quatro processos foram observados: (i) urgente e despachado no mesmo dia; (ii) urgente e não despachado no mesmo dia; (iii) não urgente e despachado no mesmo dia; (iv) não urgente e não despachado no mesmo dia. Em quais casos a regra foi violada?",
      "steps": [
       "A regra é U → D. Ela é falsa apenas quando U = V e D = F.",
       "(i) U = V, D = V: V → V = V; regra cumprida.",
       "(ii) U = V, D = F: V → F = F; regra violada.",
       "(iii) U = F, D = V: F → V = V; regra cumprida (a regra não proíbe despachar o não urgente).",
       "(iv) U = F, D = F: F → F = V; regra cumprida (a regra não exige nada do não urgente).",
       "A negação da regra é U ∧ ¬D, que é verdadeira justamente no caso (ii)."
      ],
      "answer": "Somente no caso (ii): processo urgente que não foi despachado no mesmo dia."
     },
     {
      "prompt": "Compare as fórmulas (P ∨ R) → Q e (P → Q) ∧ (R → Q) montando a tabela completa. Depois compare também (P ∧ R) → Q com (P → Q) ∧ (R → Q).",
      "steps": [
       "As letras são P, R e Q; são 8 linhas. Na ordem P, Q, R: VVV, VVF, VFV, VFF, FVV, FVF, FFV, FFF.",
       "(P ∨ R) → Q é F só quando P ∨ R é V e Q é F: linhas VFV, VFF e FFV. Nas outras cinco é V.",
       "(P → Q) ∧ (R → Q) é F quando alguma das condicionais é F: P→Q é F em VFV e VFF; R→Q é F em VFV e FFV. Logo, a conjunção é F em VFV, VFF e FFV. Nas outras cinco é V. As duas colunas coincidem nas oito linhas, então têm o mesmo significado.",
       "Para (P ∧ R) → Q, o único caso F é P = V, R = V e Q = F (linha VFV). Na linha VFF (P = V, Q = F, R = F), P ∧ R é F e a condicional (P ∧ R) → Q é V, mas P → Q é F e, portanto, (P → Q) ∧ (R → Q) é F. Na linha FFV acontece o mesmo, com R → Q = F. As colunas diferem em VFF e FFV (duas linhas): as fórmulas não são equivalentes."
      ],
      "answer": "(P ∨ R) → Q equivale a (P → Q) ∧ (R → Q); (P ∧ R) → Q não equivale (difere em duas linhas)."
     }
    ],
    "tables": [
     {
      "caption": "Comparação em oito linhas",
      "headers": [
       "P",
       "Q",
       "R",
       "(P∨R)→Q",
       "(P→Q)∧(R→Q)",
       "(P∧R)→Q"
      ],
      "rows": [
       [
        "V",
        "V",
        "V",
        "V",
        "V",
        "V"
       ],
       [
        "V",
        "V",
        "F",
        "V",
        "V",
        "V"
       ],
       [
        "V",
        "F",
        "V",
        "F",
        "F",
        "F"
       ],
       [
        "V",
        "F",
        "F",
        "F",
        "F",
        "V"
       ],
       [
        "F",
        "V",
        "V",
        "V",
        "V",
        "V"
       ],
       [
        "F",
        "V",
        "F",
        "V",
        "V",
        "V"
       ],
       [
        "F",
        "F",
        "V",
        "F",
        "F",
        "V"
       ],
       [
        "F",
        "F",
        "F",
        "V",
        "V",
        "V"
       ]
      ]
     }
    ]
   },
   {
    "capitulo": 4,
    "development": [
     "As expressões de condição aparecem em muitas versões e todas se reduzem a uma seta. “Basta que”, “é suficiente”, “se” e “caso” apontam para o antecedente (o fato suficiente). “É necessário”, “somente se”, “apenas se” e “só se” apontam para o consequente (o fato necessário). Para conferir, imagine o único cenário proibido: o fato suficiente ocorrendo sem o necessário. Se uma tradução não proíbe exatamente esse cenário, ela está errada. “Condição necessária e suficiente” junta as duas setas e equivale a “se e somente se”.",
     "Necessário não é o mesmo que causa, nem que cronologia. Em “para ser nomeado, é necessário ter sido aprovado”, a aprovação não produz a nomeação: pode haver aprovados que nunca serão nomeados. A frase apenas diz que não existe nomeado sem aprovação. Do mesmo modo, uma condição necessária pode ser pouca coisa: ter CPF é necessário para ser nomeado e está longe de ser suficiente. Em cadeias do tipo P → Q e Q → R, a seta se encadeia: P → R, e cada elo só vale no sentido em que foi escrito."
    ],
    "workedExamples": [
     {
      "prompt": "Considere que N = “o candidato é nomeado” e A = “o candidato foi aprovado”. Dentre as frases a seguir, quais têm o mesmo significado de “Ser nomeado é condição suficiente para ter sido aprovado”? (S2) “Ter sido aprovado é condição necessária para ser nomeado.” (S3) “O candidato é nomeado somente se foi aprovado.” (S4) “O candidato é nomeado se foi aprovado.” (S5) “O candidato foi aprovado, caso seja nomeado.” (S6) “Ser aprovado é condição suficiente para ser nomeado.” (S7) “Só se o candidato foi aprovado, ele é nomeado.”",
      "steps": [
       "A frase de referência diz que N basta para A: N → A.",
       "S2: a aprovação é necessária para a nomeação; o necessário é o consequente: N → A. Mesmo significado.",
       "S3: “N somente se A” é N → A. Mesmo significado.",
       "S4: “N se A” significa que A basta para N: A → N. É a recíproca. Significado diferente.",
       "S5: “A, caso N” equivale a “se N, então A”: N → A. Mesmo significado.",
       "S6: A é suficiente para N: A → N. Recíproca; significado diferente.",
       "S7: “Só se A, N”: N só ocorre se A ocorrer, N → A. Mesmo significado.",
       "Confirme na tabela: N → A é F apenas em N = V, A = F; A → N é F apenas em N = F, A = V. Nas linhas VF e FV os dois valores são opostos."
      ],
      "answer": "S2, S3, S5 e S7 têm o mesmo significado; S4 e S6 expressam a recíproca (A → N)."
     },
     {
      "prompt": "Regras: “Para assumir a função (F), é necessário ter sido aprovado (A); para ser aprovado, é necessário ter feito a inscrição (I).” Maria não fez a inscrição. Pedro foi aprovado. O que se pode concluir sobre Maria assumir a função e sobre Pedro?",
      "steps": [
       "Traduza: F → A (assumir exige aprovação) e A → I (aprovação exige inscrição). Encadeando, F → I.",
       "Maria: I = F. Como A → I, se A fosse V, I teria de ser V; logo A = F. Como F → A, se F fosse V, A teria de ser V; logo F = F. Maria não assumiu.",
       "Pedro: A = V. Como A → I, I = V: Pedro fez a inscrição.",
       "Sobre Pedro assumir: F → A com A = V é V quando F é V e também quando F é F. Nada se conclui; a aprovação é necessária, mas não suficiente.",
       "Conferência por tabela: das oito combinações (F, A, I), as que respeitam as duas regras e têm A = V são VVV e FVV; nelas I = V sempre, e F varia."
      ],
      "answer": "Maria não assumiu a função; Pedro fez a inscrição, mas nada se conclui sobre ele ter assumido a função."
     }
    ],
    "tables": [
     {
      "caption": "Formas equivalentes de P → Q",
      "headers": [
       "Frase",
       "Leitura",
       "Seta"
      ],
      "rows": [
       [
        "Se P, então Q",
        "condicional direta",
        "P → Q"
       ],
       [
        "Q, se P / Q, caso P / sempre que P, Q",
        "o “se” marca o antecedente",
        "P → Q"
       ],
       [
        "P somente se Q / P apenas se Q",
        "o “somente se” marca o consequente",
        "P → Q"
       ],
       [
        "P é suficiente para Q",
        "P basta",
        "P → Q"
       ],
       [
        "Q é necessária para P",
        "Q é exigida",
        "P → Q"
       ],
       [
        "Q se P e P se Q",
        "as duas setas",
        "P ↔ Q"
       ]
      ]
     }
    ]
   },
   {
    "capitulo": 5,
    "development": [
     "Monte sempre uma legenda antes de simbolizar. Escreva, por exemplo, A = “Ana estuda”, B = “Bruno revisa”, C = “Carla trabalha”, com as letras em forma afirmativa. “Bruno não revisa” vira ¬B, nunca uma nova letra. Se você criar uma letra D para “Bruno não revisa”, a tabela perderá a relação entre B e D, e você poderá chegar a conclusões impossíveis (B e D ambos V). Para frases longas, a vírgula e o ponto e vírgula costumam indicar onde a frase se divide em blocos; o conectivo que liga os blocos é o principal.",
     "Terminada a tradução, releia a fórmula em português, em voz alta, e compare com a frase original: se o caso que a torna falsa não for o mesmo, a tradução está errada. Depois escolha o instrumento: se o exercício dá valores às letras, calcule direto; se pede uma propriedade geral (quando é falsa, se é tautologia), use a tabela ou o teste do valor falso. Evite o cálculo mental de fórmulas com mais de dois conectivos: escreva cada subfórmula, pois um único valor trocado muda a resposta final e é muito difícil de enxergar depois."
    ],
    "workedExamples": [
     {
      "prompt": "Traduza “Se Ana estuda e Bruno não revisa, então Carla não trabalha”. Dê o valor dessa proposição quando as três afirmações simples são verdadeiras (A = V, B = V, C = V) e identifique em que combinação ela é falsa.",
      "steps": [
       "Legenda: A = Ana estuda, B = Bruno revisa, C = Carla trabalha. Letras sempre afirmativas.",
       "O conectivo principal é o “se … então”. O antecedente é “Ana estuda e Bruno não revisa” = A ∧ ¬B. O consequente é “Carla não trabalha” = ¬C. Fórmula: (A ∧ ¬B) → ¬C.",
       "Com A = V, B = V, C = V: ¬B = F, então A ∧ ¬B = V ∧ F = F. Antecedente F, logo a condicional é V.",
       "Para ser F, o antecedente precisa ser V (A = V e B = F) e o consequente F (¬C = F, ou seja, C = V). Há uma única combinação: A = V, B = F, C = V. Conferência: (V ∧ V) → F = V → F = F."
      ],
      "answer": "(A ∧ ¬B) → ¬C; com A, B e C verdadeiras vale V; só é falsa em A = V, B = F, C = V."
     },
     {
      "prompt": "Seja P = “o prazo foi prorrogado”, S = “o processo foi suspenso” e N = “o servidor foi notificado”. Compare as frases: X = “O prazo foi prorrogado ou o processo foi suspenso, e o servidor não foi notificado” e Y = “O prazo foi prorrogado, ou o processo foi suspenso e o servidor não foi notificado”. Elas dizem a mesma coisa?",
      "steps": [
       "Em X, a vírgula antes do “e” isola o bloco “P ou S”; o conectivo principal é “e”: X = (P ∨ S) ∧ ¬N.",
       "Em Y, a vírgula antes do “ou” isola P; o conectivo principal é “ou”: Y = P ∨ (S ∧ ¬N).",
       "Tabela, na ordem P, S, N, com os valores de X e Y: VVV: F e V; VVF: V e V; VFV: F e V; VFF: V e V; FVV: F e F; FVF: V e V; FFV: F e F; FFF: F e F.",
       "As colunas diferem em VVV e VFV, isto é, quando P = V e N = V. Exemplo concreto: prazo prorrogado e servidor notificado. X exige que o servidor não tenha sido notificado, então é F; Y é V, pois basta o prazo prorrogado."
      ],
      "answer": "Não. X = (P ∨ S) ∧ ¬N e Y = P ∨ (S ∧ ¬N) diferem nas duas linhas em que P e N são V."
     }
    ],
    "tables": [
     {
      "caption": "X e Y em oito linhas",
      "headers": [
       "P",
       "S",
       "N",
       "X=(P∨S)∧¬N",
       "Y=P∨(S∧¬N)"
      ],
      "rows": [
       [
        "V",
        "V",
        "V",
        "F",
        "V"
       ],
       [
        "V",
        "V",
        "F",
        "V",
        "V"
       ],
       [
        "V",
        "F",
        "V",
        "F",
        "V"
       ],
       [
        "V",
        "F",
        "F",
        "V",
        "V"
       ],
       [
        "F",
        "V",
        "V",
        "F",
        "F"
       ],
       [
        "F",
        "V",
        "F",
        "V",
        "V"
       ],
       [
        "F",
        "F",
        "V",
        "F",
        "F"
       ],
       [
        "F",
        "F",
        "F",
        "F",
        "F"
       ]
      ]
     }
    ]
   }
  ],
  "novosCapitulos": [
   {
    "title": "Traduzindo frases para a linguagem simbólica",
    "paragraphs": [
     "Traduzir bem é metade da questão de lógica. O primeiro passo é separar as proposições simples, isto é, as afirmações que não podem ser divididas em partes menores com valor lógico próprio, e dar uma letra a cada uma, sempre na forma afirmativa. Se a frase diz “o processo não foi arquivado”, a proposição simples é “o processo foi arquivado” (A) e a frase vira ¬A. Depois procure as palavras que ligam as partes e decida qual é o conectivo principal. Quanto mais cuidado nessa etapa, menos conta você terá de fazer depois, porque um erro de tradução contamina todo o restante, e nenhuma tabela, por mais bem feita que seja, corrige uma fórmula mal escrita.",
     "Algumas palavras do português escondem conectivos. “E”, “mas”, “porém”, “contudo”, “embora”, “todavia” e “no entanto” expressam contraste, mas, para a tabela-verdade, todas valem como conjunção (∧): a frase só é verdadeira se as duas partes forem verdadeiras. “Nem P nem Q” significa que as duas coisas não ocorrem: ¬P ∧ ¬Q. “Ou” é inclusivo (P ∨ Q): vale V também quando as duas partes ocorrem. Só “ou P ou Q” e “P ou Q, mas não ambos” pedem o ou exclusivo (⊕). “Não é verdade que …” nega toda a frase que vem depois, e não apenas a primeira parte dela.",
     "As condicionais têm muitas formas e todas se reduzem a P → Q: “se P, então Q”, “se P, Q”, “Q, se P”, “Q, caso P”, “sempre que P, Q”, “quando P, Q”, “P implica Q”, “P somente se Q”, “P apenas se Q”, “P é suficiente para Q”, “Q é necessária para P” e “só se Q, P”. Atenção à ordem: nas formas “Q, se P” e “sempre que P, Q” o antecedente é o que vem depois de “se” ou “sempre que”; já em “somente se Q” o consequente é o que vem depois. “P a menos que Q” e “P, exceto se Q” serão lidos como “se não Q, então P” (¬Q → P), que equivale a Q ∨ P. Esta é a leitura adotada: quando Q ocorre, a frase nada diz sobre P."
    ],
    "example": "Exemplo resolvido: “Nem o autor nem o réu compareceram.” Com A = “o autor compareceu” e R = “o réu compareceu”, a frase é ¬A ∧ ¬R. Ela só é verdadeira se os dois faltaram; se apenas um tiver comparecido, ela é falsa.",
    "development": [
     "“A menos que” merece atenção. Em “O processo é arquivado, a menos que haja nova manifestação das partes”, a leitura adotada é ¬M → A, equivalente a M ∨ A. O único cenário que contraria a frase é o processo não ser arquivado sem que tenha havido manifestação. Se houver manifestação, a frase nada determina sobre o arquivamento. Uma leitura mais forte (“arquivado exatamente quando não há manifestação”) seria uma bicondicional; se um enunciado quiser essa força, ele usará “se e somente se” ou “exatamente quando”. “Desde que” é ambíguo em muitos textos: se aparecer, prefira a leitura que o contexto deixar clara e não acrescente informação que a frase não traz.",
     "Cuidado com negações disfarçadas e com palavras que mudam a posição do “não”. “Nunca”, “jamais”, “nenhum”, “tampouco” e “sem que” carregam uma negação. “Não há quórum” é ¬Q, onde Q = “há quórum”. “Ana ou Bruno compareceu” é A ∨ B; “nem Ana nem Bruno compareceu” é ¬A ∧ ¬B. E atenção ao “só se” no início da frase: “Só se há quórum, a sessão é aberta” significa que a sessão aberta exige quórum, ou seja, Aberta → Quórum, e não o contrário."
    ],
    "method": [
     "Liste as proposições simples e dê uma letra a cada uma, sempre em forma afirmativa; a negação fica no símbolo ¬.",
     "Sublinhe as palavras de ligação (e, mas, embora, nem, ou, se, somente se, a menos que, sempre que) e traduza cada uma pela tabela de palavras-chave.",
     "Decida o conectivo principal, normalmente o que está na vírgula ou no ponto e vírgula que divide a frase em dois blocos, e escreva a fórmula com parênteses.",
     "Releia a fórmula em português e imagine o caso que a deixaria falsa; se esse caso não combinar com a frase original, a tradução está errada."
    ],
    "workedExamples": [
     {
      "prompt": "Sejam P = “o prazo venceu” e A = “o recurso foi aceito”. Traduza: (a) “Embora o prazo tenha vencido, o recurso foi aceito”; (b) “Nem o prazo venceu, nem o recurso foi aceito”; (c) “Não é verdade que o prazo venceu ou o recurso foi aceito”. Em seguida, calcule os três valores nas quatro combinações de P e A.",
      "steps": [
       "(a) “Embora” expressa contraste e vale como conjunção: P ∧ A.",
       "(b) “Nem … nem” indica que as duas coisas não ocorrem: ¬P ∧ ¬A.",
       "(c) “Não é verdade que” nega o bloco inteiro: ¬(P ∨ A).",
       "Linha P = V, A = V: (a) V ∧ V = V; (b) F ∧ F = F; (c) ¬V = F.",
       "Linha P = V, A = F: (a) F; (b) ¬V ∧ ¬F = F ∧ V = F; (c) ¬(V ∨ F) = F.",
       "Linha P = F, A = V: (a) F; (b) V ∧ F = F; (c) ¬(F ∨ V) = F.",
       "Linha P = F, A = F: (a) F; (b) V ∧ V = V; (c) ¬(F ∨ F) = V.",
       "As colunas (b) e (c) coincidem nas quatro linhas: dizem a mesma coisa (só é V quando as duas coisas deixam de ocorrer)."
      ],
      "answer": "(a) P ∧ A; (b) ¬P ∧ ¬A; (c) ¬(P ∨ A). Valores em VV, VF, FV, FF: (a) V, F, F, F; (b) F, F, F, V; (c) F, F, F, V."
     },
     {
      "prompt": "Sejam S = “a sessão é aberta” e Q = “há quórum”. Traduza e agrupe as frases que dizem a mesma coisa: (i) “A sessão é aberta somente se há quórum”; (ii) “Só se há quórum, a sessão é aberta”; (iii) “Sempre que há quórum, a sessão é aberta”; (iv) “A sessão é aberta, caso haja quórum”; (v) “Havendo quórum, a sessão é aberta”. Depois, diga quais são verdadeiras no cenário em que há quórum e a sessão não foi aberta.",
      "steps": [
       "(i) “S somente se Q”: o que vem depois de “somente se” é o consequente: S → Q.",
       "(ii) “Só se Q, S”: a sessão aberta exige quórum, S → Q. Mesmo significado de (i).",
       "(iii) “Sempre que Q, S”: o antecedente é Q: Q → S.",
       "(iv) “S, caso Q”: o que vem depois de “caso” é o antecedente: Q → S.",
       "(v) “Havendo quórum, a sessão é aberta” equivale a “se há quórum, a sessão é aberta”: Q → S.",
       "Grupos: {(i), (ii)} = S → Q; {(iii), (iv), (v)} = Q → S.",
       "Cenário Q = V, S = F: S → Q = F → V = V; Q → S = V → F = F. Logo (i) e (ii) são verdadeiras; (iii), (iv) e (v) são falsas."
      ],
      "answer": "(i) e (ii) são S → Q; (iii), (iv) e (v) são Q → S. No cenário dado, (i) e (ii) são V; (iii), (iv) e (v) são F."
     },
     {
      "prompt": "Sejam A = “o processo é arquivado”, M = “há nova manifestação das partes” e S = “o prazo é suspenso”. Traduza “O processo é arquivado, a menos que haja nova manifestação das partes; e o prazo não é suspenso”, adotando “a menos que” como “se não …, então …”, e diga em quais das oito combinações de valores a frase é verdadeira.",
      "steps": [
       "O ponto e vírgula e o “e” dividem a frase em dois blocos ligados por conjunção. Primeiro bloco: “A, a menos que M” = ¬M → A. Segundo bloco: “o prazo não é suspenso” = ¬S. Fórmula: (¬M → A) ∧ ¬S.",
       "A conjunção exige ¬S verdadeiro, ou seja, S = F. Ficam 4 linhas, na ordem (A, M, S): VVF, VFF, FVF, FFF.",
       "Em cada uma, calcule ¬M → A: em VVF, ¬M = F, condicional V. Em VFF, ¬M = V e A = V, condicional V. Em FVF, ¬M = F, condicional V. Em FFF, ¬M = V e A = F, condicional F.",
       "Logo, a frase é V em VVF, VFF e FVF e F em FFF. Em todas as outras quatro linhas (S = V) é F.",
       "Conferência: ¬M → A equivale a M ∨ A, que só é F com M = F e A = F, exatamente a linha FFF. A tabela completa de 8 linhas confirma 3 linhas verdadeiras."
      ],
      "answer": "(¬M → A) ∧ ¬S; verdadeira em exatamente 3 das 8 combinações: (A, M, S) = (V, V, F), (V, F, F) e (F, V, F)."
     }
    ],
    "pitfall": "Traduzir “só se” e “se” do mesmo jeito, ou esquecer que “nem … nem” carrega duas negações. Para evitar, depois de escrever a fórmula, identifique o único caso que a torna falsa e confira se esse caso é o que a frase realmente proíbe. Outro erro frequente é incluir o “não” dentro da letra (criar uma letra para “não compareceu”), o que impede o cálculo correto.",
    "tables": [
     {
      "caption": "Palavras-chave e tradução",
      "headers": [
       "Expressão",
       "Símbolos",
       "Observação"
      ],
      "rows": [
       [
        "P e Q; P, mas Q; embora P, Q; P, porém Q",
        "P ∧ Q",
        "o contraste não muda a tabela"
       ],
       [
        "nem P nem Q",
        "¬P ∧ ¬Q",
        "as duas coisas não ocorrem"
       ],
       [
        "P ou Q",
        "P ∨ Q",
        "inclusivo, salvo indicação"
       ],
       [
        "ou P ou Q; P ou Q, mas não ambos",
        "P ⊕ Q",
        "exatamente uma das duas"
       ],
       [
        "se P, Q; Q, se P; Q, caso P; sempre que P, Q",
        "P → Q",
        "o antecedente vem após se, caso, sempre que"
       ],
       [
        "P somente se Q; só se Q, P; P apenas se Q",
        "P → Q",
        "o consequente vem após somente se"
       ],
       [
        "P a menos que Q; P, exceto se Q",
        "¬Q → P (equivale a Q ∨ P)",
        "leitura adotada neste curso"
       ],
       [
        "P se e somente se Q",
        "P ↔ Q",
        "valores iguais"
       ],
       [
        "não é verdade que P e Q",
        "¬(P ∧ Q)",
        "nega o bloco inteiro"
       ]
      ]
     }
    ],
    "resumo": {
     "title": "Tradução de frases",
     "text": "Dê uma letra afirmativa a cada proposição simples, traduza as palavras de ligação (mas e embora são ∧; nem…nem é ¬∧¬; só se e sempre que mudam o lado da seta) e confira o caso que torna a fórmula falsa.",
     "bizu": "Antecedente vem depois de se, caso e sempre que; consequente vem depois de somente se."
    }
   },
   {
    "title": "Tabela-verdade com três proposições e colunas auxiliares",
    "paragraphs": [
     "Com três proposições simples (P, Q e R), a tabela tem 2^3 = 8 linhas. Para não esquecer nem repetir nenhuma combinação, use sempre a mesma ordem: P recebe quatro V e depois quatro F; Q alterna em blocos de dois (VVFF VVFF); R alterna linha a linha (VFVF VFVF). As linhas, de cima para baixo, ficam VVV, VVF, VFV, VFF, FVV, FVF, FFV e FFF. Com a ordem fixa, você compara tabelas com facilidade, localiza linhas pelo número e confere a contagem: se encontrou sete ou nove linhas, algo saiu errado. Com quatro letras seriam 16 linhas, e por isso, daí em diante, vale a pena recorrer a atalhos.",
     "A precedência indica o que calcular primeiro. Adote esta ordem: negação (¬), conjunção (∧), disjunção (∨), condicional (→) e, por último, bicondicional (↔). A negação atinge apenas o que está imediatamente à direita: a letra ou o parêntese seguinte. Assim, ¬P ∧ Q significa (¬P) ∧ Q e não ¬(P ∧ Q). Nem todo texto segue exatamente a mesma prioridade entre os conectivos; por isso, um enunciado bem escrito usa parênteses, e nos exemplos deste curso eles estão sempre presentes, exceto na negação de uma letra. Diante de qualquer dúvida, acrescente parênteses antes de calcular e releia o resultado em português para ver se faz sentido.",
     "As colunas auxiliares guardam os resultados intermediários. Cada subfórmula ganha uma coluna, calculada de dentro para fora. Em (P ∧ ¬Q) ∨ (¬P ∧ R), você precisa das colunas ¬Q, P ∧ ¬Q, ¬P e ¬P ∧ R e, só no fim, da disjunção. Complete uma coluna inteira, de cima a baixo, antes de passar à seguinte, e dê um título claro a cada coluna; assim você usa a mesma regra em todas as linhas e erra menos. A coluna final, à direita, é a única que responde à pergunta; as outras servem para chegar nela. Se uma coluna auxiliar parecer estranha, volte à linha correspondente e refaça só aquela conta, sem apagar o resto."
    ],
    "example": "Exemplo resolvido: construa a tabela de P ∨ ¬R. Como Q não aparece, só há duas letras e 2^2 = 4 linhas. Em P, R: VV, VF, FV, FF. A coluna ¬R vale F, V, F, V. A disjunção P ∨ ¬R vale V, V, F, V. A fórmula só é falsa quando P é falsa e R é verdadeira.",
    "development": [
     "Conte apenas as letras que aparecem. Uma fórmula com P e R tem 4 linhas, mesmo que o enunciado cite Q em outra parte. Se o exercício pede para comparar duas fórmulas, use a união das letras: comparar (P ∨ R) → Q com P → Q exige as três letras (8 linhas), porque o resultado da primeira depende de R. E, quando o enunciado já fixa o valor de uma letra, restrinja a tabela: com P = V, apenas as quatro primeiras linhas (VVV, VVF, VFV, VFF) importam.",
     "Leia a coluna final com a pergunta em mente. “Em quantas linhas é falsa?” pede uma contagem; “para quais valores é verdadeira?” pede a lista das linhas; “é tautologia?” pede a verificação de que todas as linhas são V. Releia também as linhas a partir do caso decisivo do conectivo principal: uma condicional só é F nas linhas em que o antecedente é V e o consequente é F; uma disjunção só é F onde as duas parcelas são F. Isso permite confirmar a coluna final por outro caminho e flagrar erros de cópia."
    ],
    "method": [
     "Conte as letras distintas n e escreva 2^n linhas na ordem VVV, VVF, VFV, VFF, FVV, FVF, FFV, FFF (para três letras).",
     "Marque a ordem de cálculo (negações, parênteses internos, ∧, ∨, →, ↔) e crie uma coluna auxiliar para cada subfórmula.",
     "Preencha coluna por coluna, de cima a baixo, sem pular linhas.",
     "Aplique o conectivo principal às duas colunas imediatamente anteriores, usando o caso decisivo dele para conferir.",
     "Leia a coluna final e responda exatamente à pergunta: quantas linhas, quais linhas ou se é tautologia, contradição ou contingência."
    ],
    "workedExamples": [
     {
      "prompt": "Em um setor, valem as letras P = “o processo é urgente”, Q = “o processo envolve pessoa idosa” e R = “o processo tem prioridade”. Monte a tabela de (P ∨ Q) → R e diga em quais linhas ela é falsa.",
      "steps": [
       "São três letras; 8 linhas, na ordem VVV, VVF, VFV, VFF, FVV, FVF, FFV, FFF (P, Q, R).",
       "Coluna auxiliar P ∨ Q: V, V, V, V, V, V, F, F (só é F nas duas linhas em que P e Q são F).",
       "Conectivo principal: (P ∨ Q) → R. A condicional é F só com antecedente V e consequente F. O antecedente é V nas seis primeiras linhas; nelas R é F nas linhas 2, 4 e 6 (VVF, VFF, FVF).",
       "Nas linhas 7 e 8 o antecedente é F, logo a condicional é V; nas linhas 1, 3 e 5 o consequente é V, logo é V.",
       "Coluna final: V, F, V, F, V, F, V, V."
      ],
      "answer": "Falsa em VVF, VFF e FVF (3 linhas); verdadeira nas outras 5. É uma contingência."
     },
     {
      "prompt": "Monte a tabela de (P ∧ ¬Q) ∨ (¬P ∧ R) com colunas auxiliares e indique as linhas verdadeiras.",
      "steps": [
       "Colunas: P, Q, R, ¬Q, P ∧ ¬Q, ¬P, ¬P ∧ R e a fórmula. Oito linhas na ordem usual.",
       "¬Q: F, F, V, V, F, F, V, V.",
       "P ∧ ¬Q: V só quando P = V e Q = F, isto é, nas linhas 3 (VFV) e 4 (VFF): F, F, V, V, F, F, F, F.",
       "¬P: F, F, F, F, V, V, V, V. ¬P ∧ R: V só quando P = F e R = V, isto é, nas linhas 5 (FVV) e 7 (FFV): F, F, F, F, V, F, V, F.",
       "Disjunção das duas colunas: V nas linhas 3, 4, 5 e 7; F nas linhas 1, 2, 6 e 8."
      ],
      "answer": "Verdadeira em VFV, VFF, FVV e FFV (4 linhas); falsa em VVV, VVF, FVF e FFF. Se P é V, a fórmula coincide com ¬Q; se P é F, coincide com R."
     },
     {
      "prompt": "Monte a tabela de [(P ∨ Q) ∧ ¬R] ↔ P e conte as linhas verdadeiras.",
      "steps": [
       "Colunas: P ∨ Q, ¬R, (P ∨ Q) ∧ ¬R e a bicondicional com P. Ordem P, Q, R.",
       "P ∨ Q: V, V, V, V, V, V, F, F.",
       "¬R: F, V, F, V, F, V, F, V.",
       "(P ∨ Q) ∧ ¬R: V só quando as duas colunas são V: linhas 2, 4 e 6; coluna: F, V, F, V, F, V, F, F.",
       "Compare com P (V, V, V, V, F, F, F, F) pela bicondicional (V quando os valores são iguais): L1: F e V, F; L2: V e V, V; L3: F e V, F; L4: V e V, V; L5: F e F, V; L6: V e F, F; L7: F e F, V; L8: F e F, V.",
       "Coluna final: F, V, F, V, V, F, V, V."
      ],
      "answer": "Verdadeira em VVF, VFF, FVV, FFV e FFF (5 linhas); falsa em VVV, VFV e FVF. Contingência."
     }
    ],
    "pitfall": "Escrever as linhas fora de ordem, esquecer uma combinação ou aplicar o conectivo principal às colunas erradas (por exemplo, ligar a condicional diretamente a P e R, saltando a coluna auxiliar). Para evitar, escreva primeiro a coluna de P (VVVVFFFF), depois Q e R, confira que há 8 linhas diferentes e só então calcule as colunas auxiliares uma de cada vez.",
    "tables": [
     {
      "caption": "Exemplo guiado 1: (P∨Q)→R",
      "headers": [
       "P",
       "Q",
       "R",
       "P∨Q",
       "(P∨Q)→R"
      ],
      "rows": [
       [
        "V",
        "V",
        "V",
        "V",
        "V"
       ],
       [
        "V",
        "V",
        "F",
        "V",
        "F"
       ],
       [
        "V",
        "F",
        "V",
        "V",
        "V"
       ],
       [
        "V",
        "F",
        "F",
        "V",
        "F"
       ],
       [
        "F",
        "V",
        "V",
        "V",
        "V"
       ],
       [
        "F",
        "V",
        "F",
        "V",
        "F"
       ],
       [
        "F",
        "F",
        "V",
        "F",
        "V"
       ],
       [
        "F",
        "F",
        "F",
        "F",
        "V"
       ]
      ]
     },
     {
      "caption": "Exemplo guiado 2: (P∧¬Q)∨(¬P∧R)",
      "headers": [
       "P",
       "Q",
       "R",
       "¬Q",
       "P∧¬Q",
       "¬P",
       "¬P∧R",
       "fórmula"
      ],
      "rows": [
       [
        "V",
        "V",
        "V",
        "F",
        "F",
        "F",
        "F",
        "F"
       ],
       [
        "V",
        "V",
        "F",
        "F",
        "F",
        "F",
        "F",
        "F"
       ],
       [
        "V",
        "F",
        "V",
        "V",
        "V",
        "F",
        "F",
        "V"
       ],
       [
        "V",
        "F",
        "F",
        "V",
        "V",
        "F",
        "F",
        "V"
       ],
       [
        "F",
        "V",
        "V",
        "F",
        "F",
        "V",
        "V",
        "V"
       ],
       [
        "F",
        "V",
        "F",
        "F",
        "F",
        "V",
        "F",
        "F"
       ],
       [
        "F",
        "F",
        "V",
        "V",
        "F",
        "V",
        "V",
        "V"
       ],
       [
        "F",
        "F",
        "F",
        "V",
        "F",
        "V",
        "F",
        "F"
       ]
      ]
     },
     {
      "caption": "Exemplo guiado 3: [(P∨Q)∧¬R]↔P",
      "headers": [
       "P",
       "Q",
       "R",
       "P∨Q",
       "¬R",
       "(P∨Q)∧¬R",
       "fórmula"
      ],
      "rows": [
       [
        "V",
        "V",
        "V",
        "V",
        "F",
        "F",
        "F"
       ],
       [
        "V",
        "V",
        "F",
        "V",
        "V",
        "V",
        "V"
       ],
       [
        "V",
        "F",
        "V",
        "V",
        "F",
        "F",
        "F"
       ],
       [
        "V",
        "F",
        "F",
        "V",
        "V",
        "V",
        "V"
       ],
       [
        "F",
        "V",
        "V",
        "V",
        "F",
        "F",
        "V"
       ],
       [
        "F",
        "V",
        "F",
        "V",
        "V",
        "V",
        "F"
       ],
       [
        "F",
        "F",
        "V",
        "F",
        "F",
        "F",
        "V"
       ],
       [
        "F",
        "F",
        "F",
        "F",
        "V",
        "F",
        "V"
       ]
      ]
     }
    ],
    "resumo": {
     "title": "Tabela com três letras",
     "text": "São 2^3 = 8 linhas na ordem VVV a FFF; calcule de dentro para fora, com uma coluna auxiliar para cada subfórmula, e leia só a coluna final.",
     "bizu": "Só contam as letras que aparecem; na dúvida de precedência, ponha parênteses."
    }
   },
   {
    "title": "Tautologia, contradição, ou exclusivo e atalhos de valor lógico",
    "paragraphs": [
     "Uma proposição composta é uma tautologia quando é verdadeira em todas as linhas da tabela, quaisquer que sejam os valores das letras; é uma contradição quando é falsa em todas; e é uma contingência quando tem pelo menos uma linha V e pelo menos uma linha F. P ∨ ¬P é tautologia (ou P ocorre ou não ocorre); P ∧ ¬P é contradição; P → ¬P é contingência, falsa com P = V e verdadeira com P = F. A tautologia é verdadeira pela forma, não pelo assunto: se ela vale para P, Q e R, vale para quaisquer frases colocadas no lugar.",
     "O ou exclusivo P ⊕ Q é verdadeiro quando exatamente uma das duas é verdadeira, isto é, quando P e Q têm valores diferentes. Sua tabela é VV = F, VF = V, FV = V e FF = F. Ele é a negação da bicondicional: P ⊕ Q equivale a ¬(P ↔ Q). Aparece em “ou … ou …” e em “P ou Q, mas não ambos”. A única diferença para o ou inclusivo está na linha VV: o inclusivo dá V; o exclusivo dá F. Com três opções, “ou P ou Q ou R” será lido aqui como exatamente uma delas; o ⊕ encadeado (P ⊕ Q ⊕ R) daria V sempre que um número ímpar delas fosse V, o que inclui VVV, e é outra coisa.",
     "Muitas vezes não é preciso montar a tabela. Se o enunciado dá os valores das simples, substitua e calcule de dentro para fora. Se informa que uma composta é V ou F, procure o conectivo que força valores: conjunção V obriga as duas partes V; disjunção F obriga as duas partes F; condicional F obriga antecedente V e consequente F. Já a bicondicional e o ⊕ apenas relacionam dois valores sem fixá-los. Para classificar uma fórmula, use o teste do valor falso: suponha que ela seja F e tente atribuir valores. Se for impossível, é tautologia. Se for possível, você achou um contraexemplo e ela não é tautologia."
    ],
    "example": "Exemplo resolvido: P → (Q → P) é tautologia? Suponha que seja F. Uma condicional F exige P = V e Q → P = F. Mas, com P = V, Q → P é V, seja qual for Q. Contradição; logo, a fórmula nunca é F: é tautologia.",
    "development": [
     "A negação de uma tautologia é uma contradição, e vice-versa. Se a coluna final de uma fórmula é toda V, a coluna de sua negação é toda F. Duas fórmulas são equivalentes quando a bicondicional entre elas é uma tautologia, isto é, quando suas colunas finais coincidem. Assim, P ⊕ Q ≡ ¬(P ↔ Q), e (P ∨ R) → Q ≡ (P → Q) ∧ (R → Q). Uma fórmula pode ser tautologia sem que isso seja evidente à primeira vista: (P ∧ Q) → P é V sempre, pois, se P ∧ Q é V, P é V.",
     "O teste do valor falso precisa ser completo. Se a suposição “a fórmula é F” leva a mais de uma atribuição possível (uma disjunção F obriga as duas parcelas a serem F, mas uma conjunção F ou uma condicional V admitem várias atribuições), explore todas antes de concluir. Se ao menos uma atribuição for consistente, a fórmula não é tautologia, e essa atribuição é o seu contraexemplo. Já a prova de tautologia exige que todas as tentativas colidam com uma contradição. O raciocínio inverso funciona para contradição: suponha a fórmula V e tente chegar a algo impossível."
    ],
    "method": [
     "Identifique o que o enunciado pede: o valor de uma fórmula com valores dados, os valores das letras a partir de pistas ou a classificação (tautologia, contradição, contingência).",
     "Se há valores dados para as letras, substitua e calcule de dentro para fora, escrevendo cada subfórmula.",
     "Se uma composta é dita V ou F, use o conectivo que força valores: ∧ verdadeira, ∨ falsa e → falsa. Propague cada valor encontrado para as outras fórmulas.",
     "Confira todas as informações dadas com os valores encontrados e verifique se a solução é única.",
     "Para classificar, suponha a fórmula falsa; se for impossível, é tautologia. Suponha-a verdadeira; se for impossível, é contradição. Se ambas as suposições forem possíveis, é contingência."
    ],
    "workedExamples": [
     {
      "prompt": "Classifique como tautologia, contradição ou contingência, montando a tabela: (a) (P ∧ Q) → P; (b) P ∧ ¬(P ∨ Q); (c) P → ¬P.",
      "steps": [
       "(a) Linhas P, Q: VV, VF, FV, FF. P ∧ Q: V, F, F, F. A condicional com P: V → V = V; F → V = V; F → F = V; F → F = V. Coluna final: V, V, V, V.",
       "(b) P ∨ Q: V, V, V, F. ¬(P ∨ Q): F, F, F, V. P ∧ ¬(P ∨ Q): V ∧ F = F; V ∧ F = F; F ∧ F = F; F ∧ V = F. Coluna final: F, F, F, F.",
       "(c) Linhas de P: V e F. ¬P: F e V. P → ¬P: V → F = F; F → V = V. Coluna final: F, V.",
       "Classificação: (a) só tem V; (b) só tem F; (c) tem F e V."
      ],
      "answer": "(a) tautologia; (b) contradição; (c) contingência."
     },
     {
      "prompt": "Considere P = “o laudo foi juntado”, Q = “a audiência foi marcada” e R = “a sentença foi proferida”. Sabe-se que Q → R é falsa e que “ou P ou Q” (exclusivo, P ⊕ Q) é verdadeira. Determine o valor de (P ∨ R) ↔ ¬Q.",
      "steps": [
       "Q → R é falsa: a condicional só é F com antecedente V e consequente F. Logo Q = V e R = F.",
       "P ⊕ Q é V e Q = V: o exclusivo é V quando os valores são diferentes, então P = F.",
       "Substitua: P ∨ R = F ∨ F = F. ¬Q = ¬V = F.",
       "A bicondicional compara F com F, valores iguais: V.",
       "Conferência: Q → R = V → F = F (dado) e P ⊕ Q = F ⊕ V = V (dado). A solução é única, pois cada passo foi forçado."
      ],
      "answer": "P = F, Q = V, R = F; a proposição (P ∨ R) ↔ ¬Q é verdadeira (V)."
     },
     {
      "prompt": "Use o teste do valor falso para decidir se são tautologias: (a) [(P → Q) ∧ (Q → R)] → (P → R); (b) [(P → Q) ∧ (R → Q)] → (P → R).",
      "steps": [
       "(a) Suponha a fórmula F. A condicional F exige antecedente V e consequente F. P → R = F obriga P = V e R = F.",
       "Antecedente V exige P → Q = V e Q → R = V. Com P = V, P → Q = V obriga Q = V. Mas, com Q = V e R = F, Q → R = F. Contradição: a fórmula não pode ser F, então (a) é tautologia.",
       "(b) Suponha a fórmula F. De novo, P → R = F obriga P = V e R = F.",
       "Antecedente V: P → Q = V exige Q = V (pois P = V). R → Q = F → V = V, de acordo. Nenhuma contradição.",
       "Contraexemplo: P = V, Q = V, R = F. Conferência: P → Q = V e R → Q = V, então a conjunção é V; P → R = V → F = F; a condicional final é V → F = F. A tabela completa de 8 linhas tem exatamente uma linha F, a linha VVF; nas outras sete é V."
      ],
      "answer": "(a) é tautologia; (b) não é: é contingência, falsa só com P = V, Q = V e R = F."
     }
    ],
    "pitfall": "Confundir ou inclusivo com ou exclusivo (ou o contrário) e, no teste do valor falso, parar ao achar um caminho sem explorar os outros. Também é comum chamar de contradição o que é contingência: contradição não tem nenhuma linha V; contingência tem V e F. Para evitar, escreva ao lado de cada conectivo o caso que o torna falso e confira todos os ramos antes de concluir.",
    "tables": [
     {
      "caption": "Inclusivo, exclusivo e bicondicional",
      "headers": [
       "P",
       "Q",
       "P ∨ Q",
       "P ⊕ Q",
       "P ↔ Q"
      ],
      "rows": [
       [
        "V",
        "V",
        "V",
        "F",
        "V"
       ],
       [
        "V",
        "F",
        "V",
        "V",
        "F"
       ],
       [
        "F",
        "V",
        "V",
        "V",
        "F"
       ],
       [
        "F",
        "F",
        "F",
        "F",
        "V"
       ]
      ]
     },
     {
      "caption": "Classificação das fórmulas dos exemplos",
      "headers": [
       "Fórmula",
       "Colunas finais",
       "Classificação"
      ],
      "rows": [
       [
        "(P∧Q)→P",
        "V, V, V, V",
        "tautologia"
       ],
       [
        "P∧¬(P∨Q)",
        "F, F, F, F",
        "contradição"
       ],
       [
        "P→¬P",
        "F, V",
        "contingência"
       ],
       [
        "[(P→Q)∧(Q→R)]→(P→R)",
        "oito V",
        "tautologia"
       ],
       [
        "[(P→Q)∧(R→Q)]→(P→R)",
        "F só na linha VVF",
        "contingência"
       ]
      ]
     }
    ],
    "resumo": {
     "title": "Tautologia, contradição e ⊕",
     "text": "Tautologia é sempre V, contradição é sempre F e contingência tem V e F; P ⊕ Q é V quando P e Q diferem. Para valores dados, force os conectivos (∧ V, ∨ F, → F); para classificar, suponha a fórmula falsa.",
     "bizu": "Se supor falsa dá contradição, é tautologia; se der um caso possível, é o contraexemplo."
    }
   }
  ]
 },
 "M03": {
  "extras": [
   {
    "capitulo": 1,
    "development": [
     "Na linguagem comum, o 'não' costuma aparecer escondido em prefixos e em palavras como 'nunca', 'nenhum' e 'sem'. Em 'Não é verdade que o processo não foi protocolado', há duas negações: a primeira incide sobre a frase inteira e a segunda sobre o verbo. Cancelando as duas, resta 'O processo foi protocolado'. Por isso o método mais seguro é escrever a frase em forma neutra, aplicar o 'não' na frente de tudo e só depois reescrever em português natural. Atenção a palavras que parecem opostas, mas não são complementares: 'desprotocolado' ou 'indeferido' afirmam algo a mais, enquanto 'não protocolado' e 'não deferido' apenas dizem que o fato não ocorreu. Nem todo oposto de vocabulário é uma negação lógica.",
     "A natureza da grandeza decide como escrever a fronteira. Se você conta unidades inteiras (processos, servidores, audiências), 'menos de 5' é o mesmo que 'no máximo 4', porque não existe nada entre 4 e 5. Se você mede algo contínuo (tempo, valor em reais, taxa), existe sempre um valor entre dois números: a negação de 'mais de 2,5%' é 'no máximo 2,5%', e escrever 'no máximo 2,4%' deixaria 2,45% sem classificação. Antes de negar uma comparação, pergunte: isto é contado ou medido? Depois, decida de que lado fica o número citado na frase, e coloque-o no lado oposto na negação."
    ],
    "workedExamples": [
     {
      "prompt": "Em um relatório de qualidade, lê-se: 'A taxa de erro mensal da seção é superior a 2,5%'. Escreva a negação e confira com os valores 1,0%; 2,45%; 2,5% e 3,1%. Depois explique por que 'no máximo 2,4%' e 'inferior a 2,5%' não servem como negação.",
      "steps": [
       "A frase original é x > 2,5, em que x é a taxa de erro, uma grandeza medida (contínua).",
       "A negação deve ser verdadeira exatamente nos casos em que a original é falsa. A original falha quando x ≤ 2,5, incluindo o valor 2,5, pois 2,5 não é maior que 2,5. Negação: x ≤ 2,5.",
       "Conferência por valores. x = 1,0: original F, negação V. x = 2,45: original F, negação V. x = 2,5: original F, negação V. x = 3,1: original V, negação F. Em todos os casos os valores são opostos.",
       "Tentativa 'no máximo 2,4%' (x ≤ 2,4): para x = 2,45 a original é F e esta tentativa também é F; o valor 2,45 ficou sem classificação, então ela não é a negação.",
       "Tentativa 'inferior a 2,5%' (x < 2,5): para x = 2,5 a original é F e esta tentativa também é F; o valor 2,5 fica de fora, então ela também não é a negação. A negação exige que cada valor possível torne exatamente uma das duas frases verdadeira."
      ],
      "answer": "A taxa de erro mensal da seção é no máximo 2,5% (menor ou igual a 2,5%)."
     },
     {
      "prompt": "Uma avaliação interna chama de 'nota extrema' aquela que é menor que 4 ou maior ou igual a 7, em uma escala de 0 a 10 com casas decimais. Escreva a negação de 'A nota é extrema' e confira com as notas 0; 3,9; 4; 5,5; 6,99; 7 e 10.",
      "steps": [
       "Escreva em símbolos: E = (n < 4) ∨ (n ≥ 7), em que n é a nota.",
       "Aplicando a negação ao bloco inteiro: ¬E = ¬(n < 4) ∧ ¬(n ≥ 7). A disjunção virou conjunção e cada parcela foi negada.",
       "Negando cada comparação: ¬(n < 4) é n ≥ 4; ¬(n ≥ 7) é n < 7. Então ¬E = (n ≥ 4) ∧ (n < 7), isto é, 4 ≤ n < 7.",
       "Conferência: n = 0: E é V, ¬E é F. n = 3,9: E V, ¬E F. n = 4: E F, ¬E V (o 4 pertence à negação). n = 5,5: E F, ¬E V. n = 6,99: E F, ¬E V. n = 7: E V, ¬E F (o 7 pertence à original). n = 10: E V, ¬E F.",
       "Todos os pares são opostos, e as fronteiras 4 e 7 ficaram em lados opostos aos da frase original, como deve ser."
      ],
      "answer": "A nota não é extrema quando é pelo menos 4 e menor que 7 (4 ≤ n < 7)."
     }
    ],
    "tables": [
     {
      "caption": "Negações úteis de comparações (para valores medidos, como tempo, nota ou taxa)",
      "headers": [
       "Frase original",
       "Negação",
       "Observação de fronteira"
      ],
      "rows": [
       [
        "Maior que 10",
        "Menor ou igual a 10 (no máximo 10)",
        "O 10 pertence à negação"
       ],
       [
        "Pelo menos 10 (10 ou mais)",
        "Menor que 10",
        "O 10 pertence à original"
       ],
       [
        "No máximo 10 (10 ou menos)",
        "Maior que 10",
        "O 10 pertence à original"
       ],
       [
        "Menor que 10",
        "Pelo menos 10",
        "O 10 pertence à negação"
       ],
       [
        "Igual a 10",
        "Diferente de 10 (menor ou maior)",
        "Duas regiões na negação"
       ],
       [
        "Menor que 10, em contagem de inteiros",
        "No máximo 9",
        "A troca por 9 só vale para inteiros"
       ]
      ]
     }
    ]
   },
   {
    "capitulo": 2,
    "development": [
     "A razão das leis de De Morgan está na exigência de cada conectivo. Uma conjunção é exigente: só é verdadeira quando todas as parcelas são verdadeiras. Logo, ela é falsa quando pelo menos uma parcela falha, e esse 'pelo menos uma falha' é justamente uma disjunção de negações. Já a disjunção inclusiva é tolerante: basta uma parcela verdadeira. Ela só é falsa quando todas falham, e 'todas falham' é uma conjunção de negações. Com três ou mais parcelas o raciocínio é o mesmo: ¬(P∧Q∧R) é ¬P∨¬Q∨¬R, e ¬(P∨Q∨R) é ¬P∧¬Q∧¬R. Não há limite de parcelas; o que importa é trocar o conectivo e negar cada uma.",
     "Na linguagem natural, o 'e' pode vir disfarçado de 'mas', 'porém', 'embora' ou de uma simples vírgula, e todos entram como conjunção. Já 'nem' junta duas negações: 'nem P nem Q' é ¬P∧¬Q. Cuidado também com a posição do 'não'. 'Não é verdade que Ana veio e Bruno assinou' nega o bloco todo e vira 'Ana não veio ou Bruno não assinou'. Em contraste, 'Ana não veio e Bruno não assinou' é outra frase, que nega cada parcela mas mantém o 'e'. Antes de aplicar De Morgan, localize o alcance do 'não': ele vale para a frase inteira ou só para uma parte?"
    ],
    "workedExamples": [
     {
      "prompt": "Em um protocolo, a regra de aceitação diz: 'O servidor protocolou a petição, juntou o comprovante e recolheu a taxa'. Escreva a negação, monte a tabela-verdade completa com P = protocolou, Q = juntou o comprovante e R = recolheu a taxa, e confira que a original e a negação são sempre opostas.",
      "steps": [
       "Em símbolos: P ∧ Q ∧ R. Negando o bloco todo e trocando o conectivo: ¬P ∨ ¬Q ∨ ¬R.",
       "Em português: 'O servidor não protocolou a petição, ou não juntou o comprovante, ou não recolheu a taxa'. Basta uma falha para a regra de aceitação não ser cumprida.",
       "Tabela completa (8 linhas): P=V, Q=V, R=V: original V; negação F | P=V, Q=V, R=F: original F; negação V | P=V, Q=F, R=V: original F; negação V | P=V, Q=F, R=F: original F; negação V | P=F, Q=V, R=V: original F; negação V | P=F, Q=V, R=F: original F; negação V | P=F, Q=F, R=V: original F; negação V | P=F, Q=F, R=F: original F; negação V.",
       "Contagem: a original é V em 1 linha (P=V, Q=V, R=V) e F nas outras 7; a negação é F em 1 linha e V nas 7 restantes. Em cada uma das 8 linhas os valores são diferentes."
      ],
      "answer": "Não protocolou a petição, ou não juntou o comprovante, ou não recolheu a taxa (basta que pelo menos uma das três ações falte)."
     },
     {
      "prompt": "A concessão de um benefício exige: 'Há parecer favorável ou aval da chefia, e não há pendência documental'. Sejam P = há parecer favorável, Q = há aval da chefia e R = há pendência documental. Negue a frase, passo a passo, e confira na tabela-verdade completa.",
      "steps": [
       "Em símbolos: (P ∨ Q) ∧ ¬R.",
       "O conectivo mais externo é a conjunção. Negação: ¬(P ∨ Q) ∨ ¬¬R.",
       "Aplicando De Morgan ao primeiro bloco e a dupla negação ao segundo: (¬P ∧ ¬Q) ∨ R.",
       "Em português: 'Não há parecer favorável e não há aval da chefia, ou há pendência documental'.",
       "Tabela completa (8 linhas): P=V, Q=V, R=V: original F; negação V | P=V, Q=V, R=F: original V; negação F | P=V, Q=F, R=V: original F; negação V | P=V, Q=F, R=F: original V; negação F | P=F, Q=V, R=V: original F; negação V | P=F, Q=V, R=F: original V; negação F | P=F, Q=F, R=V: original F; negação V | P=F, Q=F, R=F: original F; negação V.",
       "A original é V em 3 linhas e a negação em 5; nenhuma linha tem valores iguais, o que confirma que ¬[(P∨Q)∧¬R] é equivalente a (¬P∧¬Q)∨R."
      ],
      "answer": "Não há parecer favorável nem aval da chefia, ou há pendência documental: (¬P ∧ ¬Q) ∨ R."
     }
    ],
    "tables": [
     {
      "caption": "De Morgan com três parcelas: as duas formas lado a lado",
      "headers": [
       "Original",
       "Negação",
       "Em quantas das 8 linhas a original é verdadeira"
      ],
      "rows": [
       [
        "P ∧ Q ∧ R",
        "¬P ∨ ¬Q ∨ ¬R",
        "1 (só com as três verdadeiras)"
       ],
       [
        "P ∨ Q ∨ R",
        "¬P ∧ ¬Q ∧ ¬R",
        "7 (só falha com as três falsas)"
       ]
      ]
     }
    ]
   },
   {
    "capitulo": 3,
    "development": [
     "Uma condicional é uma promessa, e só se quebra uma promessa em um caso: a condição ocorreu e o resultado não veio. Se a condição não ocorreu, a promessa continua intacta, seja qual for o resultado; por isso 'Se P, então Q' é verdadeira quando P é falsa, mesmo que Q seja verdadeira ou falsa. Esse efeito costuma assustar quem estuda: 'Se 2 for maior que 5, então hoje é feriado' é verdadeira, porque o antecedente é falso. Na lógica clássica, ninguém consegue provar que a promessa foi violada, e a única forma de falsificá-la é exibir um caso com antecedente verdadeiro e consequente falso. A negação é exatamente a descrição desse caso.",
     "Muitas frases do dia a dia escondem a condicional: 'Quando há audiência, a sala é aberta', 'Sempre que o prazo vence, o processo é arquivado', 'Todo processo urgente é despachado em 24 horas' (aqui há um quantificador) e 'O processo é despachado em 24 horas se for urgente'. Em todas, o antecedente é a condição e o consequente é o resultado prometido. A negação de cada uma é do tipo 'a condição ocorreu e o resultado não'. Se o antecedente ou o consequente for composto, nega-se apenas o consequente e se mantém o antecedente inteiro: ¬[(P∧Q)→R] = P∧Q∧¬R. Nunca troque o conectivo do antecedente."
    ],
    "workedExamples": [
     {
      "prompt": "A regra de um cartório é: 'Se o processo é urgente, então é despachado em até 24 horas'. Quatro processos foram observados: o processo 1 é urgente e foi despachado em até 24 horas; o 2 é urgente e não foi despachado em até 24 horas; o 3 não é urgente e foi despachado em até 24 horas; o 4 não é urgente e não foi despachado em até 24 horas. Em quais processos a regra é verdadeira? Em qual a sua negação é verdadeira?",
      "steps": [
       "Sejam P = o processo é urgente e Q = é despachado em até 24 horas. A regra é P → Q; a negação é P ∧ ¬Q.",
       "Processo 1: P=V, Q=V. Regra V; negação (V ∧ F) = F.",
       "Processo 2: P=V, Q=F. Regra F; negação (V ∧ V) = V. Aqui a promessa foi quebrada: a condição ocorreu e o resultado não.",
       "Processo 3: P=F, Q=V. Regra V; negação (F ∧ F) = F.",
       "Processo 4: P=F, Q=F. Regra V; negação (F ∧ V) = F. Um processo não urgente e não despachado não viola nada: a regra não dizia o que acontece com os não urgentes.",
       "Regra verdadeira nos processos 1, 3 e 4. Negação verdadeira só no processo 2. Em cada processo, regra e negação têm valores opostos."
      ],
      "answer": "A regra é verdadeira nos processos 1, 3 e 4 e falsa no 2; a negação 'é urgente e não foi despachado em até 24 horas' é verdadeira apenas no processo 2."
     },
     {
      "prompt": "Considere a frase: 'Se o requerimento é assinado e instruído, então é aceito'. Sejam P = é assinado, Q = é instruído e R = é aceito. Escreva sua negação, mostre que ela também é a negação de P → (Q → R) e confirme na tabela-verdade completa.",
      "steps": [
       "Em símbolos: (P ∧ Q) → R. Como a condicional é falsa apenas com antecedente verdadeiro e consequente falso, a negação é (P ∧ Q) ∧ ¬R, isto é, P ∧ Q ∧ ¬R.",
       "Em português: 'O requerimento é assinado, é instruído e não é aceito'. Observe que o antecedente 'e' foi mantido inteiro; não se trocou por 'ou'.",
       "Para P → (Q → R): a negação é P ∧ ¬(Q → R) = P ∧ (Q ∧ ¬R) = P ∧ Q ∧ ¬R, que é a mesma expressão.",
       "Tabela completa (8 linhas): P=V, Q=V, R=V: ¬[(P∧Q)→R] F; P∧Q∧¬R F; ¬[P→(Q→R)] F | P=V, Q=V, R=F: ¬[(P∧Q)→R] V; P∧Q∧¬R V; ¬[P→(Q→R)] V | P=V, Q=F, R=V: ¬[(P∧Q)→R] F; P∧Q∧¬R F; ¬[P→(Q→R)] F | P=V, Q=F, R=F: ¬[(P∧Q)→R] F; P∧Q∧¬R F; ¬[P→(Q→R)] F | P=F, Q=V, R=V: ¬[(P∧Q)→R] F; P∧Q∧¬R F; ¬[P→(Q→R)] F | P=F, Q=V, R=F: ¬[(P∧Q)→R] F; P∧Q∧¬R F; ¬[P→(Q→R)] F | P=F, Q=F, R=V: ¬[(P∧Q)→R] F; P∧Q∧¬R F; ¬[P→(Q→R)] F | P=F, Q=F, R=F: ¬[(P∧Q)→R] F; P∧Q∧¬R F; ¬[P→(Q→R)] F.",
       "Em todas as 8 linhas, as três colunas coincidem entre si, e a negação é verdadeira em apenas 1 linha (P=V, Q=V, R=F). Além disso, em cada linha a negação tem valor oposto ao da condicional original (P∧Q)→R, que é falsa só nessa linha."
      ],
      "answer": "O requerimento é assinado e instruído, mas não é aceito: P ∧ Q ∧ ¬R."
     }
    ],
    "tables": [
     {
      "caption": "Onde a condicional é falsa (tabela completa)",
      "headers": [
       "P",
       "Q",
       "P → Q",
       "¬(P → Q)",
       "P ∧ ¬Q"
      ],
      "rows": [
       [
        "V",
        "V",
        "V",
        "F",
        "F"
       ],
       [
        "V",
        "F",
        "F",
        "V",
        "V"
       ],
       [
        "F",
        "V",
        "V",
        "F",
        "F"
       ],
       [
        "F",
        "F",
        "V",
        "F",
        "F"
       ]
      ]
     }
    ]
   },
   {
    "capitulo": 4,
    "development": [
     "Vale dominar o vocabulário das condicionais. 'Se P, então Q', 'Quando P, Q', 'Q, se P', 'P somente se Q', 'P implica Q' e 'P é suficiente para Q' exprimem a mesma coisa: P → Q. Também 'Q é necessária para P' e 'Todo P é Q' (com quantificador) caem na mesma estrutura. O truque está em 'se' e 'somente se': o que vem depois de 'se' é o antecedente, e o que vem depois de 'somente se' é o consequente. 'O servidor toma posse somente se apresenta os documentos' é Posse → Documentos, e não o contrário. Ler errado essa ordem é o erro mais comum nesse tema.",
     "As quatro formas da condicional formam dois pares de equivalentes. A original P→Q é equivalente à sua contrapositiva ¬Q→¬P. A recíproca Q→P é equivalente à inversa ¬P→¬Q, pois cada uma é a contrapositiva da outra. Mas o primeiro par não é equivalente ao segundo: eles só coincidem quando P e Q têm o mesmo valor. A razão é intuitiva: a contrapositiva olha o mesmo caso proibido (P verdadeiro e Q falso) por outro ângulo, enquanto recíproca e inversa proíbem outro caso (Q verdadeiro e P falso). Por isso, ao reescrever, troque a ordem e negue as duas, jamais só uma das ações."
    ],
    "workedExamples": [
     {
      "prompt": "Uma norma diz: 'O candidato toma posse somente se apresenta os documentos exigidos'. Sejam P = toma posse e Q = apresenta os documentos. Escreva a condicional correspondente, sua contrapositiva e sua recíproca, e mostre na tabela-verdade que apenas a contrapositiva é equivalente à norma.",
      "steps": [
       "'Somente se' introduz o consequente: a norma é P → Q (toma posse → apresenta os documentos).",
       "Contrapositiva: ¬Q → ¬P, 'Se não apresenta os documentos, então não toma posse'. Recíproca: Q → P, 'Se apresenta os documentos, então toma posse'.",
       "Tabela (P, Q, P→Q, Q→P, ¬Q→¬P): P=V, Q=V: V, V, V | P=V, Q=F: F, V, F | P=F, Q=V: V, F, V | P=F, Q=F: V, V, V.",
       "A coluna de P→Q (V, F, V, V) coincide com a de ¬Q→¬P (V, F, V, V) nas quatro linhas. A coluna de Q→P (V, V, F, V) difere na terceira linha: P=F e Q=V, o candidato apresentou os documentos, mas não tomou posse (talvez porque a nomeação foi tornada sem efeito). Isso não viola a norma, mas viola a recíproca."
      ],
      "answer": "A contrapositiva 'Se não apresenta os documentos, então não toma posse' é equivalente à norma; a recíproca 'Se apresenta os documentos, então toma posse' não é."
     },
     {
      "prompt": "Considere a regra: 'Se o prazo está vencido e não há justificativa, então o recurso é negado ou arquivado'. Sejam P = o prazo está vencido, Q = há justificativa, R = o recurso é negado e S = o recurso é arquivado. Escreva a contrapositiva em palavras e confirme a equivalência na tabela-verdade completa, de 16 linhas.",
      "steps": [
       "Em símbolos: (P ∧ ¬Q) → (R ∨ S).",
       "Contrapositiva: nega-se o consequente e o antecedente, trocando a ordem: ¬(R ∨ S) → ¬(P ∧ ¬Q).",
       "De Morgan no primeiro bloco: ¬(R∨S) = ¬R ∧ ¬S. De Morgan e dupla negação no segundo: ¬(P∧¬Q) = ¬P ∨ Q. Resultado: (¬R ∧ ¬S) → (¬P ∨ Q).",
       "Em palavras: 'Se o recurso não é negado nem arquivado, então o prazo não está vencido ou há justificativa'.",
       "Tabela com 16 linhas: P=V, Q=V, R=V, S=V: original V; contrapositiva V | P=V, Q=V, R=V, S=F: original V; contrapositiva V | P=V, Q=V, R=F, S=V: original V; contrapositiva V | P=V, Q=V, R=F, S=F: original V; contrapositiva V | P=V, Q=F, R=V, S=V: original V; contrapositiva V | P=V, Q=F, R=V, S=F: original V; contrapositiva V | P=V, Q=F, R=F, S=V: original V; contrapositiva V | P=V, Q=F, R=F, S=F: original F; contrapositiva F | P=F, Q=V, R=V, S=V: original V; contrapositiva V | P=F, Q=V, R=V, S=F: original V; contrapositiva V | P=F, Q=V, R=F, S=V: original V; contrapositiva V | P=F, Q=V, R=F, S=F: original V; contrapositiva V | P=F, Q=F, R=V, S=V: original V; contrapositiva V | P=F, Q=F, R=V, S=F: original V; contrapositiva V | P=F, Q=F, R=F, S=V: original V; contrapositiva V | P=F, Q=F, R=F, S=F: original V; contrapositiva V.",
       "A original só é falsa quando P=V, Q=F, R=F e S=F (1 linha dentre 16); a contrapositiva é falsa nessa mesma linha e verdadeira nas outras 15. As duas colunas coincidem nas 16 linhas, portanto são equivalentes."
      ],
      "answer": "Se o recurso não é negado nem arquivado, então o prazo não está vencido ou há justificativa: (¬R ∧ ¬S) → (¬P ∨ Q)."
     }
    ],
    "tables": [
     {
      "caption": "Expressões que significam P → Q",
      "headers": [
       "Como aparece na frase",
       "Antecedente (P)",
       "Consequente (Q)"
      ],
      "rows": [
       [
        "Se P, então Q",
        "P",
        "Q"
       ],
       [
        "Quando P, Q / Sempre que P, Q",
        "P",
        "Q"
       ],
       [
        "Q, se P",
        "P",
        "Q"
       ],
       [
        "P somente se Q",
        "P",
        "Q"
       ],
       [
        "P é condição suficiente para Q",
        "P",
        "Q"
       ],
       [
        "Q é condição necessária para P",
        "P",
        "Q"
       ]
      ]
     },
     {
      "caption": "As quatro formas da condicional com P → Q (tabela completa)",
      "headers": [
       "P",
       "Q",
       "P→Q",
       "Q→P (recíproca)",
       "¬P→¬Q (inversa)",
       "¬Q→¬P (contrapositiva)"
      ],
      "rows": [
       [
        "V",
        "V",
        "V",
        "V",
        "V",
        "V"
       ],
       [
        "V",
        "F",
        "F",
        "V",
        "V",
        "F"
       ],
       [
        "F",
        "V",
        "V",
        "F",
        "F",
        "V"
       ],
       [
        "F",
        "F",
        "V",
        "V",
        "V",
        "V"
       ]
      ]
     }
    ]
   },
   {
    "capitulo": 5,
    "development": [
     "Uma tabela-verdade bem montada tem 2^n linhas, em que n é o número de proposições simples diferentes: 2 proposições dão 4 linhas, 3 dão 8 e 4 dão 16. A ordem usual começa com todas verdadeiras e vai alternando, de modo que nenhuma combinação seja esquecida ou repetida. Depois, calcule as colunas intermediárias da parte mais interna dos parênteses para a mais externa, e deixe a coluna final para o conectivo principal. Escrever só a coluna final, de cabeça, é a principal causa de erro. Para comparar duas fórmulas, basta ver se as colunas finais são idênticas, linha por linha: uma única diferença já derruba a equivalência.",
     "Ao ler a coluna final, você pode classificar a fórmula. Se for toda V, é uma tautologia; se for toda F, é uma contradição; se tiver V e F, é uma contingência (depende dos valores das proposições). Uma abreviação útil para condicionais: como P→Q só é falsa em um caso, basta procurar a linha em que o antecedente é V e o consequente é F; se não houver, a condicional é sempre verdadeira. Com três ou mais variáveis, essa busca pelo único caso falso poupa tempo. Mas, quando o enunciado pedir 'a tabela completa' ou a comparação de várias fórmulas, não pule linhas."
    ],
    "workedExamples": [
     {
      "prompt": "Mostre, com a tabela-verdade completa, que (P ∨ Q) → (P ∧ Q) é equivalente à bicondicional P ↔ Q. Depois traduza para uma frase sobre dois servidores, em que P = Ana trabalha hoje e Q = Bruno trabalha hoje.",
      "steps": [
       "Há duas proposições, logo 2^2 = 4 linhas.",
       "Cálculo, linha a linha: P=V, Q=V: P∨Q V; P∧Q V; (P∨Q)→(P∧Q) V; P↔Q V | P=V, Q=F: P∨Q V; P∧Q F; (P∨Q)→(P∧Q) F; P↔Q F | P=F, Q=V: P∨Q V; P∧Q F; (P∨Q)→(P∧Q) F; P↔Q F | P=F, Q=F: P∨Q F; P∧Q F; (P∨Q)→(P∧Q) V; P↔Q V.",
       "As colunas (P∨Q)→(P∧Q) e P↔Q coincidem nas quatro linhas: V, F, F, V.",
       "Interpretação: (P∨Q)→(P∧Q) afirma 'se pelo menos um trabalha, então os dois trabalham'. Isso só é verdadeiro quando os dois trabalham ou nenhum trabalha, ou seja, quando ambos têm o mesmo estado, que é a bicondicional."
      ],
      "answer": "(P∨Q)→(P∧Q) é equivalente a P↔Q: 'Ana e Bruno trabalham hoje, ou nenhum dos dois trabalha hoje'."
     },
     {
      "prompt": "Verifique, pela tabela-verdade completa, se P → (Q ∨ R) é equivalente a (P ∧ ¬Q) → R. Depois diga em quantas linhas a condicional P → (Q ∨ R) é falsa e em quais valores.",
      "steps": [
       "Há três proposições, logo 2^3 = 8 linhas.",
       "Tabela: P=V, Q=V, R=V: P→(Q∨R) V; P∧¬Q F; (P∧¬Q)→R V | P=V, Q=V, R=F: P→(Q∨R) V; P∧¬Q F; (P∧¬Q)→R V | P=V, Q=F, R=V: P→(Q∨R) V; P∧¬Q V; (P∧¬Q)→R V | P=V, Q=F, R=F: P→(Q∨R) F; P∧¬Q V; (P∧¬Q)→R F | P=F, Q=V, R=V: P→(Q∨R) V; P∧¬Q F; (P∧¬Q)→R V | P=F, Q=V, R=F: P→(Q∨R) V; P∧¬Q F; (P∧¬Q)→R V | P=F, Q=F, R=V: P→(Q∨R) V; P∧¬Q F; (P∧¬Q)→R V | P=F, Q=F, R=F: P→(Q∨R) V; P∧¬Q F; (P∧¬Q)→R V.",
       "As colunas P→(Q∨R) e (P∧¬Q)→R coincidem nas 8 linhas, portanto são equivalentes: ambas são falsas apenas em P=V, Q=F, R=F.",
       "A condicional P→(Q∨R) é verdadeira em 7 linhas e falsa em 1: a linha com P verdadeiro e Q e R falsos, em que o antecedente é V e o consequente Q∨R é F."
      ],
      "answer": "São equivalentes. P → (Q ∨ R) é falsa em exatamente 1 das 8 linhas: P=V, Q=F e R=F."
     }
    ],
    "tables": [
     {
      "caption": "Classificação pela coluna final da tabela-verdade",
      "headers": [
       "Coluna final",
       "Nome",
       "Exemplo"
      ],
      "rows": [
       [
        "Todas V",
        "Tautologia",
        "P ∨ ¬P"
       ],
       [
        "Todas F",
        "Contradição",
        "P ∧ ¬P"
       ],
       [
        "Mistura de V e F",
        "Contingência",
        "P → Q"
       ]
      ]
     }
    ]
   }
  ],
  "novosCapitulos": [
   {
    "title": "Negação em linguagem natural: quantidades, quantificadores e frases longas",
    "paragraphs": [
     "Na linguagem do dia a dia, negar uma frase é mais escorregadio do que parece, porque as palavras de quantidade escondem uma comparação. 'Pelo menos 3' significa 3 ou mais; a negação é 'menos de 3', que, ao contar pessoas ou documentos, equivale a 'no máximo 2'. 'No máximo 5' significa 5 ou menos; a negação é 'mais de 5'. 'Mais de 4' não inclui o 4; a negação é 'no máximo 4'. O que une todos os casos é uma regra de fronteira: o número citado na frase pertence a um dos lados e a apenas um. Antes de escrever a negação, descubra em que lado ele está e coloque-o do outro lado.",
     "Os quatro quantificadores clássicos formam pares de negação que precisam ser memorizados. A negação de 'Todo A é B' é 'Algum A não é B' (existe pelo menos um A que não é B). A negação de 'Nenhum A é B' é 'Algum A é B'. A negação de 'Algum A é B' é 'Nenhum A é B'. E a negação de 'Algum A não é B' é 'Todo A é B'. Em lógica, 'algum' significa 'pelo menos um', podendo ser todos. Atenção: 'Todo A é B' e 'Nenhum A é B' são contrárias, e não negações: as duas podem ser falsas ao mesmo tempo, quando parte dos A é B e parte não é.",
     "Palavras de tempo e de exclusão seguem o mesmo molde. 'Sempre' quer dizer 'em todas as ocasiões'; sua negação é 'em pelo menos uma ocasião não'. 'Nunca' quer dizer 'em nenhuma ocasião'; sua negação é 'em pelo menos uma ocasião sim'. 'Nem P nem Q' é ¬P ∧ ¬Q; sua negação, pela lei de De Morgan, é P ∨ Q, isto é, 'pelo menos um dos dois'. Esse padrão se estende a frases com três parcelas: 'nem P, nem Q, nem R' é negada por 'P ou Q ou R', e 'P e Q e R' é negada por 'não P ou não Q ou não R'. O segredo é nunca responder com o oposto extremo."
    ],
    "example": "Exemplo resolvido: a negação de 'Nem Ana, nem Bruno, nem Carla assinaram a ata' é 'Pelo menos um dos três assinou a ata'. Com A, B, C = assinou, a original é ¬A∧¬B∧¬C e a negação é A∨B∨C. Nas 8 combinações possíveis, a original é verdadeira em 1 (ninguém assinou) e a negação em 7; nunca coincidem.",
    "development": [
     "Frases com 'sempre', 'nunca', 'todo' e 'nenhum' são universais: um único contraexemplo as derruba. Por isso, para negá-las, você procura um caso que as contrarie, e não uma frase de sentido oposto. 'O sistema sempre responde em até 2 segundos' é negado por 'houve ao menos uma resposta com mais de 2 segundos', e não por 'o sistema nunca responde em até 2 segundos'. A segunda frase é mais forte: exige que todas as respostas fiquem acima de 2 segundos. O elaborador de um enunciado costuma oferecer justamente esse 'oposto extremo' como isca.",
     "Em frases com 'e' ou 'ou' dentro de quantificadores, aplique os dois processos em sequência: troque o quantificador e, no predicado, aplique De Morgan. 'Todos os processos são digitais e algum é urgente' tem dois blocos ligados por 'e'; sua negação liga os blocos negados por 'ou'. Já 'Ou ... ou ...' exclusivo é negado por 'ou ambos ou nenhum', isto é, a bicondicional. Se a frase vier com 'mas', 'porém' ou 'embora', trate como 'e'. Se houver 'a menos que', trate como 'ou'. Em todos os casos, escreva em símbolos antes de negar."
    ],
    "method": [
     "Identifique o tipo de palavra: quantidade (pelo menos, no máximo, mais de), quantificador (todo, algum, nenhum), tempo (sempre, nunca) ou conectivo (e, ou, nem, se...então).",
     "Escreva a frase em forma de faixa de valores ou em símbolos, deixando clara a fronteira e o alcance de cada 'não'.",
     "Aplique a regra: troque o lado da fronteira; troque o quantificador e negue o predicado; troque 'e' por 'ou' e vice-versa, negando cada parcela.",
     "Teste a resposta com um caso concreto: ela deve ser verdadeira exatamente quando a original for falsa. Verifique o valor da fronteira.",
     "Reescreva em português natural, mantendo o mesmo significado, e confira se não surgiu um 'oposto extremo' (como 'nunca' no lugar de 'nem sempre')."
    ],
    "workedExamples": [
     {
      "prompt": "Em um lote de 10 processos, a frase é: 'Pelo menos 4 processos estão com a documentação incompleta'. Escreva a negação e verifique, para cada quantidade k de processos incompletos (de 0 a 10), que as duas frases têm valores opostos.",
      "steps": [
       "A original é k ≥ 4, verdadeira para k = 4, 5, 6, 7, 8, 9 e 10: são 7 valores.",
       "A negação deve ser verdadeira nos valores restantes: k = 0, 1, 2 e 3, ou seja, k < 4: são 4 valores. Como se conta processos inteiros, k < 4 equivale a k ≤ 3.",
       "Conferência: 7 + 4 = 11, o número de valores possíveis de 0 a 10. Cada valor pertence a exatamente uma das duas frases; nenhum fica sem classificação nem em ambas.",
       "Fronteira: o valor 4 satisfaz a original e não a negação; o valor 3 satisfaz a negação e não a original."
      ],
      "answer": "No máximo 3 processos estão com a documentação incompleta (menos de 4)."
     },
     {
      "prompt": "Cinco consultas a um sistema judicial tiveram os tempos de resposta de 1,2; 1,8; 2,0; 2,4 e 1,1 segundos. Considere a frase: 'O sistema sempre responde em até 2 segundos'. Diga o valor lógico da frase, escreva a negação e mostre por que 'o sistema nunca responde em até 2 segundos' não é uma negação correta.",
      "steps": [
       "A frase diz que, em todas as consultas, o tempo é menor ou igual a 2 s. Teste consulta a consulta: 1,2 ≤ 2 V; 1,8 ≤ 2 V; 2,0 ≤ 2 V; 2,4 ≤ 2 F; 1,1 ≤ 2 V.",
       "Como a frase exige todas V e a quarta consulta é F, a frase é falsa.",
       "A negação de 'sempre' é 'em pelo menos uma ocasião não': 'em pelo menos uma consulta o tempo foi maior que 2 segundos'. Teste: 2,4 > 2 é V, logo a negação é verdadeira. Original F e negação V: valores opostos.",
       "A tentativa 'nunca responde em até 2 segundos' exigiria que todas as cinco consultas tivessem tempo maior que 2: os resultados V, V, V, F, V mostram que 4 consultas têm tempo menor ou igual a 2, logo a tentativa é falsa.",
       "Como a original e a tentativa são ambas falsas, elas não podem ser negações uma da outra: uma negação sempre tem valor oposto."
      ],
      "answer": "A frase é falsa. A negação correta é 'em pelo menos uma consulta o tempo de resposta foi maior que 2 segundos', que é verdadeira."
     },
     {
      "prompt": "Negue a frase: 'Todos os processos do lote são digitais e algum processo do lote é urgente'. Verifique sua resposta em um lote com 3 processos cujos dados (digital; urgente) são: processo 1 (sim; não), processo 2 (sim; sim) e processo 3 (não; não).",
      "steps": [
       "Seja D(x) = x é digital e U(x) = x é urgente. A frase é: [Todo x, D(x)] ∧ [Existe x, U(x)].",
       "Negação do 'e' (De Morgan): ¬[Todo x, D(x)] ∨ ¬[Existe x, U(x)].",
       "Negando cada bloco: ¬[Todo x, D(x)] = Existe x, ¬D(x) = 'algum processo não é digital'; ¬[Existe x, U(x)] = Todo x, ¬U(x) = 'nenhum processo é urgente'.",
       "Resultado: 'Algum processo do lote não é digital ou nenhum processo do lote é urgente'.",
       "Teste no lote: 'todos são digitais' é F (o processo 3 não é digital); 'algum é urgente' é V (processo 2). Original: F ∧ V = F. Negação: 'algum não é digital' é V; logo a negação é V. Opostas.",
       "Verificação geral: em todos os 64 conjuntos possíveis de dados para um lote de 3 processos, a original e esta negação sempre têm valores opostos. A versão errada 'algum não é digital E nenhum é urgente' falha em vários desses conjuntos."
      ],
      "answer": "Algum processo do lote não é digital ou nenhum processo do lote é urgente."
     }
    ],
    "pitfall": "Responder com o 'oposto extremo' em vez da negação: dizer 'nenhum' para negar 'todo', ou 'nunca' para negar 'sempre'. A negação de 'todo' é 'algum não' e a de 'sempre' é 'pelo menos uma vez não'. Teste: se as duas frases podem ser falsas ao mesmo tempo, você não achou a negação.",
    "tables": [
     {
      "caption": "Negações em linguagem natural",
      "headers": [
       "Frase original",
       "Negação",
       "Cuidado"
      ],
      "rows": [
       [
        "Pelo menos 3",
        "Menos de 3 (no máximo 2, se for contagem)",
        "O 3 fica na original"
       ],
       [
        "No máximo 5",
        "Mais de 5",
        "O 5 fica na original"
       ],
       [
        "Mais de 4",
        "No máximo 4",
        "O 4 vai para a negação"
       ],
       [
        "Todo A é B",
        "Algum A não é B",
        "Não é \"Nenhum A é B\""
       ],
       [
        "Nenhum A é B",
        "Algum A é B",
        "Não é \"Todo A é B\""
       ],
       [
        "Algum A é B",
        "Nenhum A é B",
        "Algum inclui \"todos\""
       ],
       [
        "Algum A não é B",
        "Todo A é B",
        "Não é \"Nenhum A é B\""
       ],
       [
        "Sempre",
        "Pelo menos uma vez não",
        "Não é \"nunca\""
       ],
       [
        "Nunca",
        "Pelo menos uma vez sim",
        "Não é \"sempre\""
       ],
       [
        "Nem P nem Q",
        "P ou Q (pelo menos um)",
        "Não é \"P e Q\""
       ]
      ]
     },
     {
      "caption": "Nem com três parcelas e sua negação: tabela completa",
      "headers": [
       "P",
       "Q",
       "R",
       "Nem P nem Q nem R",
       "P ∨ Q ∨ R (negação)"
      ],
      "rows": [
       [
        "V",
        "V",
        "V",
        "F",
        "V"
       ],
       [
        "V",
        "V",
        "F",
        "F",
        "V"
       ],
       [
        "V",
        "F",
        "V",
        "F",
        "V"
       ],
       [
        "V",
        "F",
        "F",
        "F",
        "V"
       ],
       [
        "F",
        "V",
        "V",
        "F",
        "V"
       ],
       [
        "F",
        "V",
        "F",
        "F",
        "V"
       ],
       [
        "F",
        "F",
        "V",
        "F",
        "V"
       ],
       [
        "F",
        "F",
        "F",
        "V",
        "F"
       ]
      ]
     }
    ],
    "resumo": {
     "title": "Negação no dia a dia",
     "text": "Pelo menos ↔ menos de; no máximo ↔ mais de; todo ↔ algum não; nenhum ↔ algum; sempre ↔ pelo menos uma vez não; nem P nem Q ↔ P ou Q.",
     "bizu": "Negar é achar o contraexemplo, não o oposto extremo. Teste o valor da fronteira."
    }
   },
   {
    "title": "Equivalências em frases do dia a dia",
    "paragraphs": [
     "Duas frases são equivalentes quando têm o mesmo valor lógico em todos os casos possíveis. A equivalência mais cobrada é a da condicional: 'Se P, então Q' equivale a '¬P ou Q' e à contrapositiva 'Se não Q, então não P'. A razão é simples: a condicional só é falsa quando P é verdadeira e Q é falsa; '¬P ∨ Q' só é falsa nesse mesmo caso (¬P falso e Q falso); e a contrapositiva só é falsa quando ¬Q é verdadeira e ¬P é falsa, isto é, de novo com P verdadeiro e Q falso. Como as três frases falham no mesmo e único caso, elas são intercambiáveis. Por exemplo, 'Se o prazo vence, o processo é arquivado' equivale a 'O prazo não vence ou o processo é arquivado'.",
     "O 'ou' também se reescreve como condicional: 'P ou Q' equivale a 'se não P, então Q' e a 'se não Q, então P'. Em outras palavras, se uma das duas falhar, a outra precisa valer. É a mesma regra de 'P ∨ Q ≡ ¬¬P ∨ Q ≡ ¬P → Q'. A expressão 'a menos que' funciona igual: 'P a menos que Q' equivale a 'se não Q, então P' e a 'P ou Q'. Já 'nem P nem Q' é ¬P ∧ ¬Q, que é diferente de 'se P, então não Q'. A segunda frase só proíbe os dois juntos; a primeira exige que os dois faltem. Não confunda as duas.",
     "A bicondicional 'P se e somente se Q' equivale a '(P → Q) ∧ (Q → P)', a '(P ∧ Q) ∨ (¬P ∧ ¬Q)' e a 'P e Q têm o mesmo valor'. O ou exclusivo 'ou P ou Q' (um ou outro, mas não ambos) é a negação da bicondicional: equivale a '(P ∨ Q) ∧ ¬(P ∧ Q)', a '(P ∧ ¬Q) ∨ (¬P ∧ Q)' e a 'P ↔ ¬Q'. Por fim, a recíproca (Q → P) e a inversa (¬P → ¬Q) de P → Q não são equivalentes a P → Q; elas são equivalentes entre si. Esse é o ponto de armadilha clássico em frases do cotidiano."
    ],
    "example": "Exemplo resolvido: 'Nem o recurso foi protocolado nem o prazo foi prorrogado' não é equivalente a 'Se o recurso foi protocolado, o prazo não foi prorrogado'. Com P = protocolado e Q = prorrogado, tome P=F e Q=V: 'nem P nem Q' é F, mas P → ¬Q é V (antecedente falso). Valores diferentes em uma linha bastam para derrubar a equivalência.",
    "development": [
     "Vale saber traduzir as expressões comuns. 'P se Q' é Q → P. 'P somente se Q' é P → Q. 'P se e somente se Q' é P ↔ Q. 'P a menos que Q' é ¬Q → P (leitura clássica adotada: se Q não ocorre, P vale; nada se afirma sobre o caso em que Q ocorre). 'P e Q' tem os sinônimos 'mas', 'porém', 'embora'. 'Não P nem Q' é ¬P ∧ ¬Q. 'Ou P ou Q' (com 'ou' repetido) costuma ser lido como exclusivo. Quando uma frase 'se... então' vier com uma negação escondida, escreva-a em símbolos antes de reescrever. Evite copiar as palavras da frase; a estrutura é o que importa.",
     "Ao procurar a frase equivalente, resista à tentação de procurar a negação. Equivalente e negação são coisas opostas: a equivalente mantém os casos de verdade; a negação os inverte. Um caminho confiável é converter tudo para ¬P ∨ Q, que é uma forma-base. Dali você gera a contrapositiva (permutando e negando) e a forma com 'ou'. Para testar uma candidata, procure um caso que torne a original falsa e veja se a candidata também fica falsa nesse mesmo caso; depois, procure um caso que a torne verdadeira. Se a candidata falhar em um deles, não é equivalente."
    ],
    "method": [
     "Traduza a frase para símbolos, identificando antecedente e consequente (se houver condicional) ou as parcelas (se houver 'ou', 'e' ou 'nem').",
     "Converta para uma forma-base: P → Q vira ¬P ∨ Q; 'P ou Q' vira ¬P → Q; 'nem P nem Q' vira ¬P ∧ ¬Q; bicondicional vira (P→Q)∧(Q→P).",
     "Gere as formas equivalentes: contrapositiva (inverte a ordem e nega os dois lados), ou, e condicional equivalente. Descarte recíproca e inversa.",
     "Teste a candidata com a tabela-verdade, ou procurando um caso em que as duas frases difiram.",
     "Escreva a resposta em português natural, preservando o significado e sem inventar condições novas."
    ],
    "workedExamples": [
     {
      "prompt": "Considere a regra: 'Se o prazo vence, então o processo é arquivado'. Escreva duas frases equivalentes (uma com 'ou' e uma contrapositiva) e confirme na tabela-verdade completa, com P = o prazo vence e Q = o processo é arquivado.",
      "steps": [
       "A regra é P → Q.",
       "Forma com 'ou': ¬P ∨ Q, 'O prazo não vence ou o processo é arquivado'.",
       "Contrapositiva: ¬Q → ¬P, 'Se o processo não é arquivado, então o prazo não vence'.",
       "Tabela completa: P=V, Q=V: P→Q V; ¬P∨Q V; ¬Q→¬P V | P=V, Q=F: P→Q F; ¬P∨Q F; ¬Q→¬P F | P=F, Q=V: P→Q V; ¬P∨Q V; ¬Q→¬P V | P=F, Q=F: P→Q V; ¬P∨Q V; ¬Q→¬P V.",
       "As três colunas coincidem nas quatro linhas (V, F, V, V). As três frases são equivalentes e falham apenas quando o prazo vence e o processo não é arquivado."
      ],
      "answer": "Equivalentes: 'O prazo não vence ou o processo é arquivado' e 'Se o processo não é arquivado, então o prazo não vence'."
     },
     {
      "prompt": "Uma norma afirma: 'O recurso foi protocolado ou o prazo foi prorrogado'. Reescreva-a como condicional de duas maneiras, confirmando na tabela-verdade completa. Depois traduza a frase 'O servidor será multado a menos que justifique' e diga a que ela equivale.",
      "steps": [
       "Sejam P = o recurso foi protocolado e Q = o prazo foi prorrogado. A norma é P ∨ Q.",
       "Condicionais equivalentes: ¬P → Q, 'Se o recurso não foi protocolado, então o prazo foi prorrogado', e ¬Q → P, 'Se o prazo não foi prorrogado, então o recurso foi protocolado'.",
       "Tabela completa: P=V, Q=V: P∨Q V; ¬P→Q V; ¬Q→P V | P=V, Q=F: P∨Q V; ¬P→Q V; ¬Q→P V | P=F, Q=V: P∨Q V; ¬P→Q V; ¬Q→P V | P=F, Q=F: P∨Q F; ¬P→Q F; ¬Q→P F.",
       "As colunas coincidem nas quatro linhas (V, V, V, F): a única linha falsa é P=F e Q=F, quando nenhuma das duas coisas aconteceu.",
       "Na outra frase, sejam M = o servidor é multado e J = o servidor justifica. 'M a menos que J' se traduz por ¬J → M, isto é, 'Se não justifica, é multado'. Pela mesma equivalência de 'ou', ela é a disjunção 'É multado ou justifica' (M ∨ J)."
      ],
      "answer": "'Se o recurso não foi protocolado, então o prazo foi prorrogado' e 'Se o prazo não foi prorrogado, então o recurso foi protocolado'; 'a menos que' equivale a 'ou'."
     },
     {
      "prompt": "Em um setor, afirma-se: 'Ou o processo é urgente ou é sigiloso (mas não os dois)'. Sejam P = é urgente e Q = é sigiloso. Verifique, na tabela-verdade completa, quais das formas a seguir são equivalentes a essa frase (o ou exclusivo P ⊕ Q): ¬(P ↔ Q); (P ∨ Q) ∧ ¬(P ∧ Q); (P ∧ ¬Q) ∨ (¬P ∧ Q); P ↔ ¬Q; e P ∨ Q.",
      "steps": [
       "P ⊕ Q é verdadeira quando exatamente um deles é verdadeiro.",
       "Tabela completa: P=V, Q=V: P⊕Q F; ¬(P↔Q) F; (P∨Q)∧¬(P∧Q) F; (P∧¬Q)∨(¬P∧Q) F; P↔¬Q F; P∨Q V | P=V, Q=F: P⊕Q V; ¬(P↔Q) V; (P∨Q)∧¬(P∧Q) V; (P∧¬Q)∨(¬P∧Q) V; P↔¬Q V; P∨Q V | P=F, Q=V: P⊕Q V; ¬(P↔Q) V; (P∨Q)∧¬(P∧Q) V; (P∧¬Q)∨(¬P∧Q) V; P↔¬Q V; P∨Q V | P=F, Q=F: P⊕Q F; ¬(P↔Q) F; (P∨Q)∧¬(P∧Q) F; (P∧¬Q)∨(¬P∧Q) F; P↔¬Q F; P∨Q F.",
       "P⊕Q tem a coluna F, V, V, F. As colunas de ¬(P↔Q), (P∨Q)∧¬(P∧Q), (P∧¬Q)∨(¬P∧Q) e P↔¬Q também são F, V, V, F nas quatro linhas: são equivalentes ao ou exclusivo.",
       "A coluna de P∨Q é V, V, V, F, que difere da do ou exclusivo na primeira linha (P=V, Q=V): o ou inclusivo aceita os dois verdadeiros, o exclusivo não. Uma linha divergente basta: P∨Q não é equivalente.",
       "Conclusão: o ou exclusivo é a negação da bicondicional, 'um ou outro, mas não ambos', e também 'P tem o valor oposto de Q'."
      ],
      "answer": "São equivalentes: ¬(P↔Q), (P∨Q)∧¬(P∧Q), (P∧¬Q)∨(¬P∧Q) e P↔¬Q. A forma P∨Q não é, pois diverge na linha em que ambos são verdadeiros."
     }
    ],
    "pitfall": "Tratar a recíproca (Q → P) ou a inversa (¬P → ¬Q) como se fossem a mesma regra. Elas só coincidem com P → Q quando P e Q têm o mesmo valor. Na dúvida, confira o caso 'P falso e Q verdadeiro': a original é V, mas a recíproca é F.",
    "tables": [
     {
      "caption": "Frases e suas equivalentes (e as armadilhas)",
      "headers": [
       "Frase",
       "Equivalentes comuns",
       "Não equivalentes (armadilhas)"
      ],
      "rows": [
       [
        "Se P, então Q",
        "¬P ∨ Q; ¬Q → ¬P",
        "Q → P (recíproca); ¬P → ¬Q (inversa)"
       ],
       [
        "P ou Q",
        "¬P → Q; ¬Q → P",
        "P → Q"
       ],
       [
        "P a menos que Q",
        "¬Q → P; P ∨ Q",
        "Q → P"
       ],
       [
        "Nem P nem Q",
        "¬P ∧ ¬Q; ¬(P ∨ Q)",
        "P → ¬Q; ¬P → ¬Q"
       ],
       [
        "P se e somente se Q",
        "(P→Q)∧(Q→P); (P∧Q)∨(¬P∧¬Q)",
        "P → Q sozinha"
       ],
       [
        "Ou P ou Q (exclusivo)",
        "¬(P↔Q); (P∧¬Q)∨(¬P∧Q); P ↔ ¬Q",
        "P ∨ Q (inclusivo)"
       ]
      ]
     }
    ],
    "resumo": {
     "title": "Equivalências no cotidiano",
     "text": "P→Q ≡ ¬P∨Q ≡ ¬Q→¬P; P∨Q ≡ ¬P→Q; nem P nem Q ≡ ¬P∧¬Q; ou exclusivo ≡ negação da bicondicional. Recíproca e inversa não são equivalentes à original.",
     "bizu": "Para achar a equivalente, vá para ¬P ∨ Q e reescreva; recíproca e inversa são iscas."
    }
   },
   {
    "title": "Tautologias úteis e como provar uma equivalência",
    "paragraphs": [
     "Uma tautologia é uma fórmula que é verdadeira em todos os casos possíveis; uma contradição é falsa em todos; e uma contingência é verdadeira em uns e falsa em outros. Duas fórmulas P e Q são equivalentes quando a bicondicional P ↔ Q é uma tautologia, isto é, quando têm a mesma coluna final na tabela-verdade. Algumas tautologias aparecem tanto que vale memorizá-las: o terceiro excluído, P ∨ ¬P; a não contradição, ¬(P ∧ ¬P); a simplificação, (P ∧ Q) → P; a adição, P → (P ∨ Q); o modus ponens, [P ∧ (P → Q)] → Q; o modus tollens, [(P → Q) ∧ ¬Q] → ¬P; e o silogismo hipotético, [(P → Q) ∧ (Q → R)] → (P → R).",
     "Há três maneiras de provar uma equivalência ou uma tautologia. A primeira é a tabela-verdade: segura e mecânica, boa até 3 variáveis (8 linhas). A segunda é a tentativa de contraexemplo: supõe-se que a fórmula é falsa e procura-se uma linha que a torne falsa; se for impossível sem contradição, a fórmula é tautologia; se houver essa linha, ela é um contraexemplo. É muito eficiente para condicionais, que só são falsas em um caso, e poupa o trabalho de preencher a tabela inteira quando você já sabe qual linha procurar. A terceira é por equivalências conhecidas: transforma-se uma fórmula na outra, passo a passo, citando a lei usada a cada passo.",
     "As leis mais usadas são: dupla negação (¬¬P ≡ P); De Morgan (¬(P∧Q) ≡ ¬P∨¬Q e ¬(P∨Q) ≡ ¬P∧¬Q); distributivas (P∧(Q∨R) ≡ (P∧Q)∨(P∧R) e P∨(Q∧R) ≡ (P∨Q)∧(P∨R)); absorção (P∧(P∨Q) ≡ P e P∨(P∧Q) ≡ P); condicional (P→Q ≡ ¬P∨Q); comutativa e associativa; idempotência (P∧P ≡ P); complemento (P∧¬P é sempre falsa e P∨¬P é sempre verdadeira); e identidade (P∧V ≡ P; P∨F ≡ P). A álgebra poupa tempo quando há 4 ou mais variáveis, pois a tabela teria 16 linhas ou mais. Em contrapartida, ela exige disciplina: cada passo deve aplicar exatamente uma lei, e a justificativa deve estar escrita ao lado, para que um erro de sinal ou de parênteses seja percebido logo."
    ],
    "example": "Exemplo resolvido: [P ∧ (P → Q)] → Q é uma tautologia. Para ser falsa, o consequente Q teria de ser F e o antecedente P ∧ (P → Q) teria de ser V. Mas P ∧ (P → Q) verdadeiro exige P = V, e então P → Q é V só se Q = V, contradição com Q = F. Logo a fórmula nunca é falsa.",
    "development": [
     "A tentativa de contraexemplo tem um roteiro: escreva a fórmula, force o valor final F e propague as consequências para as proposições simples. Em P → Q, ficar falsa obriga P = V e Q = F. Em A ∧ B, falsa obriga pelo menos um F; em A ∨ B, falsa obriga os dois F. Se as imposições se contradisserem (uma proposição teria de ser V e F ao mesmo tempo), a fórmula é tautologia. Se houver uma atribuição consistente, ela é um contraexemplo e a fórmula não é tautologia. O mesmo vale para equivalência: para mostrar que A ≢ B, basta uma linha em que A e B diferem.",
     "Duas fórmulas que coincidem em algumas linhas podem não ser equivalentes. Muitos erros de demonstração vêm de testar apenas um caso e concluir. Um único caso só serve para refutar (basta uma linha divergente), nunca para provar. Outra cautela: troque variáveis com cuidado. A lei da distributiva vale para P∧(Q∨R), mas não para a condicional, onde (P∨Q)→R é equivalente a (P→R)∧(Q→R), e não a (P→R)∨(Q→R). Ao usar a álgebra, anote a lei de cada passo; se não souber justificá-lo, volte à tabela."
    ],
    "method": [
     "Decida o que provar: tautologia (sempre V) ou equivalência (mesma coluna final). Para equivalência de A e B, lembre que isso é o mesmo que A ↔ B ser tautologia.",
     "Conte as proposições. Com até 3, monte a tabela-verdade completa e compare as colunas finais linha por linha.",
     "Se a fórmula é uma condicional, tente falsificá-la: force antecedente V e consequente F e propague. Contradição prova tautologia; atribuição consistente fornece um contraexemplo.",
     "Com 4 ou mais variáveis, use equivalências conhecidas, justificando cada passo (De Morgan, distributiva, absorção, condicional).",
     "Conclua com uma frase clara: 'são equivalentes' ou 'não são equivalentes, pois na linha tal os valores diferem'."
    ],
    "workedExamples": [
     {
      "prompt": "Prove, pela tabela-verdade, as leis de absorção P ∧ (P ∨ Q) ≡ P e P ∨ (P ∧ Q) ≡ P. Interprete com P = o servidor assina e Q = o chefe aprova.",
      "steps": [
       "Duas proposições dão 2^2 = 4 linhas.",
       "Tabela completa: P=V, Q=V: P∧(P∨Q) V; P∨(P∧Q) V; P V | P=V, Q=F: P∧(P∨Q) V; P∨(P∧Q) V; P V | P=F, Q=V: P∧(P∨Q) F; P∨(P∧Q) F; P F | P=F, Q=F: P∧(P∨Q) F; P∨(P∧Q) F; P F.",
       "As colunas P∧(P∨Q), P∨(P∧Q) e P são todas V, V, F, F nas quatro linhas: as três fórmulas são equivalentes.",
       "Interpretação: 'O servidor assina e (assina ou o chefe aprova)' diz o mesmo que 'O servidor assina', pois a parte 'assina ou o chefe aprova' já é verdadeira quando ele assina. Do mesmo modo, 'O servidor assina ou (assina e o chefe aprova)' é equivalente a 'O servidor assina', pois a segunda parte só reforça a primeira."
      ],
      "answer": "P ∧ (P ∨ Q) ≡ P e P ∨ (P ∧ Q) ≡ P: as duas fórmulas têm sempre o valor de P."
     },
     {
      "prompt": "Pelo método do contraexemplo, decida se cada fórmula é uma tautologia: (a) [P ∧ (P → Q)] → Q; (b) (P → Q) → (Q → P). Para (b), dê uma atribuição que a falsifique.",
      "steps": [
       "(a) Para ser falsa, a condicional exige antecedente V e consequente F: Q = F e P ∧ (P → Q) = V.",
       "Se P ∧ (P → Q) é V, então P = V e (P → Q) = V. Com P = V e Q = F, P → Q é F: contradição com a exigência de P → Q = V.",
       "Não existe atribuição que falsifique (a): é uma tautologia (modus ponens). Conferência por força bruta nas 4 linhas: nenhuma tem antecedente V e Q = F ao mesmo tempo.",
       "(b) Para ser falsa, exige-se (P → Q) = V e (Q → P) = F. Q → P = F exige Q = V e P = F.",
       "Testando P=F e Q=V: P → Q = V (antecedente falso), Q → P = V → F = F, e a fórmula é V → F = F. Existe um contraexemplo.",
       "Portanto (b) não é tautologia. Em linguagem natural: o caso 'P falso e Q verdadeiro' (por exemplo, P = há sessão e Q = há ata; não houve sessão, mas há ata) torna P → Q verdadeira e Q → P falsa, e por isso a fórmula inteira falha."
      ],
      "answer": "(a) é tautologia (modus ponens). (b) não é: P=F e Q=V a tornam falsa."
     },
     {
      "prompt": "Prove, com as equivalências conhecidas e depois com a tabela-verdade, que (P → Q) ∧ (P → ¬Q) é equivalente a ¬P. Em seguida, mostre que P → (Q → R) equivale a (P ∧ Q) → R, mas não equivale a (P → Q) → R.",
      "steps": [
       "Passo a passo: (P→Q)∧(P→¬Q) = (¬P∨Q)∧(¬P∨¬Q) (condicional). Pela distributiva, = ¬P ∨ (Q ∧ ¬Q). Como Q ∧ ¬Q é sempre falsa (complemento), = ¬P ∨ F = ¬P (identidade).",
       "Conferência com a tabela de 4 linhas: (P=V, Q=V): V∧F = F e ¬P = F; (V, F): F∧V = F e ¬P = F; (F, V): V∧V = V e ¬P = V; (F, F): V∧V = V e ¬P = V. Colunas iguais.",
       "Exportação: P → (Q → R) = ¬P ∨ (¬Q ∨ R) = (¬P ∨ ¬Q) ∨ R (associativa) = ¬(P ∧ Q) ∨ R (De Morgan) = (P ∧ Q) → R (condicional). Conferência: ambas são falsas apenas em P=V, Q=V e R=F, e verdadeiras nas outras 7 linhas.",
       "Contra (P → Q) → R: tome P=F e R=F, com Q qualquer, por exemplo Q=V. Então P → (Q → R) é V (antecedente falso). Já (P → Q) → R é (V) → F = F. As duas diferem nessa linha.",
       "Conclusão: a primeira equivalência e a exportação valem; os parênteses mudam o significado quando a condicional está encadeada."
      ],
      "answer": "(P→Q)∧(P→¬Q) ≡ ¬P; P→(Q→R) ≡ (P∧Q)→R; mas P→(Q→R) não é equivalente a (P→Q)→R (contraexemplo P=F, Q=V, R=F)."
     }
    ],
    "pitfall": "Concluir uma equivalência a partir de um ou dois casos favoráveis. Um caso só serve para refutar; para provar, é preciso a tabela completa, a impossibilidade de contraexemplo ou uma cadeia de equivalências conhecidas, com cada passo justificado.",
    "tables": [
     {
      "caption": "Tautologias úteis (todas verdadeiras em todas as linhas)",
      "headers": [
       "Nome",
       "Fórmula",
       "Leitura"
      ],
      "rows": [
       [
        "Terceiro excluído",
        "P ∨ ¬P",
        "Ou vale, ou não vale"
       ],
       [
        "Não contradição",
        "¬(P ∧ ¬P)",
        "Não vale e não vale ao mesmo tempo"
       ],
       [
        "Simplificação",
        "(P ∧ Q) → P",
        "De \"P e Q\" conclui-se P"
       ],
       [
        "Adição",
        "P → (P ∨ Q)",
        "De P conclui-se \"P ou Q\""
       ],
       [
        "Modus ponens",
        "[P ∧ (P → Q)] → Q",
        "Condição cumprida: resultado vale"
       ],
       [
        "Modus tollens",
        "[(P → Q) ∧ ¬Q] → ¬P",
        "Resultado ausente: condição ausente"
       ],
       [
        "Silogismo hipotético",
        "[(P → Q) ∧ (Q → R)] → (P → R)",
        "Encadeamento de condicionais"
       ],
       [
        "Silogismo disjuntivo",
        "[(P ∨ Q) ∧ ¬P] → Q",
        "Uma falha obriga a outra"
       ]
      ]
     },
     {
      "caption": "Leis de equivalência para transformar fórmulas",
      "headers": [
       "Lei",
       "Forma"
      ],
      "rows": [
       [
        "Dupla negação",
        "¬¬P ≡ P"
       ],
       [
        "De Morgan",
        "¬(P∧Q) ≡ ¬P∨¬Q; ¬(P∨Q) ≡ ¬P∧¬Q"
       ],
       [
        "Distributiva",
        "P∧(Q∨R) ≡ (P∧Q)∨(P∧R); P∨(Q∧R) ≡ (P∨Q)∧(P∨R)"
       ],
       [
        "Absorção",
        "P∧(P∨Q) ≡ P; P∨(P∧Q) ≡ P"
       ],
       [
        "Condicional",
        "P→Q ≡ ¬P∨Q ≡ ¬Q→¬P"
       ],
       [
        "Exportação",
        "P→(Q→R) ≡ (P∧Q)→R"
       ],
       [
        "Complemento",
        "P∧¬P é sempre F; P∨¬P é sempre V"
       ]
      ]
     }
    ],
    "resumo": {
     "title": "Provar equivalência",
     "text": "Equivalência é mesma coluna final; tautologia é coluna toda V. Use tabela (até 3 variáveis), contraexemplo (condicionais) ou leis conhecidas (4 ou mais variáveis).",
     "bizu": "Um caso refuta, mas só a tabela completa ou a cadeia de leis prova."
    }
   }
  ]
 },
 "M04": {
  "extras": [
   {
    "capitulo": 1,
    "development": [
     "Existem quatro combinações entre a verdade das premissas e a validade do argumento, e só uma é proibida: um argumento válido com premissas verdadeiras e conclusão falsa. Um argumento válido pode ter premissas falsas e conclusão falsa, ou premissas falsas e conclusão verdadeira; um argumento inválido pode ter premissas verdadeiras e até conclusão verdadeira, só que sem que ela esteja garantida. Quando o enunciado pergunta se a conclusão “decorre” ou “se segue” das premissas, ele quer saber da ligação lógica, não da verdade no mundo real. Por isso, o primeiro movimento é aceitar as premissas como dadas, mesmo que pareçam absurdas, e perguntar apenas se a conclusão fica garantida em todos os cenários possíveis.",
     "Preste atenção na força da palavra que introduz a conclusão. “Necessariamente”, “obrigatoriamente” e “com certeza” exigem que a conclusão valha em todos os cenários compatíveis com as premissas; “pode ser” e “é possível” pedem apenas um cenário. Uma mesma frase pode ser possível e não necessária: se só sabemos que todo servidor em estágio probatório é avaliado e que Paulo é avaliado, é possível que Paulo esteja em estágio probatório, mas isso não é necessário. Também é comum o enunciado trazer detalhes irrelevantes, como datas, nomes e valores, que não participam da dedução. Ignore-os ao montar o esquema, mas confira se a pergunta final não depende deles."
    ],
    "workedExamples": [
     {
      "prompt": "Considere o argumento: “Todo processo urgente é analisado em até 24 horas. O processo 105 foi analisado em até 24 horas. Logo, o processo 105 é urgente.” Ele é válido?",
      "steps": [
       "Chame de U a classe dos processos urgentes e de A a classe dos processos analisados em até 24 horas. A primeira premissa diz que U está inteiramente dentro de A. A segunda diz que o processo 105 está em A.",
       "Procure um cenário que mantenha as duas premissas verdadeiras e torne a conclusão falsa. Exemplo: o processo 105 é um processo comum que, por falta de fila na secretaria, foi analisado em 23 horas. Ele está em A e fora de U, e a regra sobre processos urgentes continua respeitada.",
       "Em símbolos, com P = “o processo é urgente” e Q = “é analisado em até 24 horas”, o argumento é P→Q; Q; logo P. Na linha P = F e Q = V, as duas premissas são V e a conclusão é F. Há contraexemplo, portanto o argumento é inválido."
      ],
      "answer": "Inválido: ser analisado em 24 horas é consequência da urgência, mas não prova a urgência (afirmação do consequente)."
     },
     {
      "prompt": "Classifique cada argumento quanto à validade e quanto à verdade no mundo real: (I) “Todo servidor do tribunal tem três cabeças. Marta é servidora do tribunal. Logo, Marta tem três cabeças.” (II) “Se o protocolo foi registrado, então ele tem número. O protocolo tem número. Logo, foi registrado.” (III) “Todo analista é servidor. Todo servidor é cidadão. Logo, todo analista é cidadão.”",
      "steps": [
       "(I) A forma é: todo S é T; Marta é S; logo Marta é T. Se as premissas fossem verdadeiras, a conclusão seria obrigatória, então o argumento é válido. A primeira premissa, porém, é falsa no mundo real e a conclusão também. É um argumento válido com premissa falsa.",
       "(II) A forma é P→Q; Q; logo P. Contraexemplo: P = F e Q = V, isto é, um protocolo que recebeu número sem ter sido registrado (por exemplo, por erro de sistema). A condicional continua verdadeira, Q é verdadeira e P é falsa. O argumento é inválido, ainda que na prática o protocolo possa ter sido registrado.",
       "(III) Analistas estão dentro de servidores, que estão dentro de cidadãos; logo analistas estão dentro de cidadãos. Não há cenário com premissas verdadeiras e conclusão falsa. É válido, e premissas e conclusão são verdadeiras.",
       "Resumo: validade (a forma garante a conclusão) e verdade (o fato é real) são avaliações independentes; só a combinação “premissas V, conclusão F, forma válida” é impossível."
      ],
      "answer": "(I) válido, com premissa falsa; (II) inválido; (III) válido, com tudo verdadeiro."
     }
    ]
   },
   {
    "capitulo": 2,
    "development": [
     "Cada regra de inferência é um atalho para uma tabela-verdade. Lembre-se de que P→Q só é falsa quando P é V e Q é F. Por isso, na única situação em que P→Q e P são ambas verdadeiras, Q também é verdadeira (modus ponens). Do mesmo modo, se Q é falsa e P→Q é verdadeira, P não pode ser verdadeira, pois isso tornaria a condicional falsa (modus tollens). Já quando P é falsa a condicional é verdadeira seja qual for o valor de Q, e quando Q é verdadeira a condicional também é verdadeira seja qual for P. É exatamente por isso que negar o antecedente ou afirmar o consequente não leva a nada: essas linhas não distinguem o valor da outra proposição.",
     "O maior obstáculo na prova é traduzir a frase para a seta na direção certa. “Só há sessão se houver quórum” é Sessão→Quórum, não o contrário: a palavra “só” e a expressão “somente se” apontam para o que é necessário. Já “basta que haja quórum para haver sessão” é Quórum→Sessão. A tabela abaixo reúne os modos mais cobrados de dizer P→Q. Guarde a regra prática: o que é suficiente fica antes da seta, e o que é necessário fica depois."
    ],
    "workedExamples": [
     {
      "prompt": "Em um cartório, sabe-se que: se o prazo foi prorrogado, a parte foi intimada; a parte não foi intimada; o prazo foi prorrogado ou o juiz indeferiu o pedido. O que se conclui sobre o pedido? (Em todo o enunciado, “ou” é inclusivo.)",
      "steps": [
       "Simbolize: P = “o prazo foi prorrogado”, Q = “a parte foi intimada”, R = “o juiz indeferiu o pedido”. As premissas são P→Q, ¬Q e P∨R.",
       "De P→Q e ¬Q, o modus tollens dá ¬P: o prazo não foi prorrogado.",
       "De P∨R e ¬P, o silogismo disjuntivo dá R: o juiz indeferiu o pedido.",
       "Conferência pela tabela com 8 linhas (P, Q, R): só a linha P = F, Q = F, R = V torna as três premissas verdadeiras. Nela, R é V, logo a conclusão é necessária."
      ],
      "answer": "O juiz indeferiu o pedido (e o prazo não foi prorrogado)."
     },
     {
      "prompt": "Em uma secretaria, vale o seguinte: (1) se a certidão é emitida, o processo segue para o gabinete; (2) se o processo é arquivado, o prazo é encerrado; (3) a certidão é emitida ou o processo é arquivado; (4) o prazo não foi encerrado. O que se pode afirmar? (Em todo o enunciado, “ou” é inclusivo.)",
      "steps": [
       "Simbolize: A = certidão emitida, B = processo segue ao gabinete, C = processo arquivado, D = prazo encerrado. Premissas: A→B; C→D; A∨C; ¬D.",
       "Comece pelo fato simples, ¬D. De C→D e ¬D, o modus tollens dá ¬C: o processo não foi arquivado.",
       "De A∨C e ¬C, o silogismo disjuntivo dá A: a certidão foi emitida.",
       "De A→B e A, o modus ponens dá B: o processo seguiu para o gabinete.",
       "Conferência pela tabela com 16 linhas (A, B, C, D): apenas A = V, B = V, C = F, D = F satisfaz as quatro premissas ao mesmo tempo, então todos os quatro valores estão determinados."
      ],
      "answer": "A certidão foi emitida, o processo seguiu para o gabinete, não foi arquivado e o prazo não foi encerrado."
     }
    ],
    "tables": [
     {
      "caption": "Modos de dizer P→Q (todos equivalentes)",
      "headers": [
       "Forma em português",
       "Antecedente (P)",
       "Consequente (Q)"
      ],
      "rows": [
       [
        "Se P, então Q",
        "P",
        "Q"
       ],
       [
        "Q, se P",
        "P",
        "Q"
       ],
       [
        "P somente se Q",
        "P",
        "Q"
       ],
       [
        "Só há P se há Q",
        "P",
        "Q"
       ],
       [
        "P é suficiente para Q",
        "P",
        "Q"
       ],
       [
        "Q é necessário para P",
        "P",
        "Q"
       ],
       [
        "Todo P é Q (tratando P e Q como propriedades)",
        "P",
        "Q"
       ]
      ]
     }
    ]
   },
   {
    "capitulo": 3,
    "development": [
     "Para encadear, o consequente de uma regra precisa ser idêntico ao antecedente da seguinte. Quando as premissas vêm desalinhadas, a contraposição é a ferramenta que conserta: P→Q equivale a ¬Q→¬P, de modo que uma frase escrita como “se não é julgado no mérito, não foi conhecido” (¬R→¬Q) pode ser reescrita como Q→R e encaixada na cadeia P→Q→R. Cada regra pode ser usada nas duas formas, a original e a contrapositiva, mas nunca na recíproca. Antes de propagar valores, vale reescrever todas as condicionais em uma lista e conferir quais podem ser ligadas pelas pontas.",
     "A prova por contradição segue uma disciplina. Você acrescenta uma hipótese provisória, por exemplo “suponha que a perita compareça”, e tira consequências usando apenas as premissas dadas. Se chegar a T e ¬T ao mesmo tempo, a hipótese está descartada, mas as premissas originais não foram abaladas: o que ficou provado é a negação da hipótese. Se, ao contrário, as contradições aparecerem sem nenhuma hipótese adicional, é o próprio conjunto de premissas que é inconsistente. Um erro frequente é chamar de contradição o simples fato de uma suposição parecer improvável; só vale a contradição explícita."
    ],
    "workedExamples": [
     {
      "prompt": "Sabe-se que: se o recurso é protocolado no prazo, ele é conhecido; se um recurso não é julgado no mérito, então ele não foi conhecido; o recurso 77 foi protocolado no prazo. O recurso 77 foi julgado no mérito?",
      "steps": [
       "Simbolize: P = “protocolado no prazo”, Q = “conhecido”, R = “julgado no mérito”. As premissas são P→Q, ¬R→¬Q e P.",
       "A segunda premissa está desalinhada. Sua contrapositiva é Q→R (de ¬R→¬Q, nega-se e inverte: ¬¬Q→¬¬R, ou seja, Q→R).",
       "Agora há a cadeia P→Q e Q→R, que gera P→R. Com P verdadeira, o modus ponens dá R.",
       "Conferência pela tabela com 8 linhas (P, Q, R): a única linha com as três premissas verdadeiras é P = V, Q = V, R = V."
      ],
      "answer": "Sim: o recurso 77 foi necessariamente julgado no mérito."
     },
     {
      "prompt": "Para uma audiência, sabe-se: (1) se a perita comparece, o assistente técnico também comparece; (2) se o assistente técnico comparece, a testemunha não comparece; (3) a testemunha comparece ou o oficial comparece; (4) o oficial não comparece. A perita comparece? (Em todo o enunciado, “ou” é inclusivo.)",
      "steps": [
       "Simbolize: A = perita, B = assistente, C = testemunha, D = oficial. Premissas: A→B; B→¬C; C∨D; ¬D.",
       "De C∨D e ¬D, o silogismo disjuntivo dá C: a testemunha comparece.",
       "De B→¬C e C, o modus tollens dá ¬B: o assistente não comparece. De A→B e ¬B, o modus tollens dá ¬A: a perita não comparece.",
       "Pela contradição: suponha que a perita compareça (A). Por (1), o assistente comparece; por (2), a testemunha não comparece; então, por (3), o oficial comparece, o que contradiz (4). A hipótese A é incompatível com as premissas.",
       "Conferência pela tabela com 16 linhas: a única linha com as quatro premissas verdadeiras é A = F, B = F, C = V, D = F."
      ],
      "answer": "Não: a perita não comparece, e isso é necessário."
     }
    ]
   },
   {
    "capitulo": 4,
    "development": [
     "A tabela completa tem 2^n linhas para n proposições simples (4 linhas para duas, 8 para três, 16 para quatro), e o teste de validade só olha para as linhas em que todas as premissas são V. Uma linha com alguma premissa falsa não é um cenário permitido pelo enunciado e, portanto, nunca pode servir de contraexemplo. Quando a conclusão é uma condicional P→R, ela só é falsa na linha P = V e R = F. Isso permite um atalho: já parta de P = V e R = F e procure valores para as demais proposições que mantenham todas as premissas verdadeiras. Se nenhum valor funcionar, o argumento é válido.",
     "A tabela ajuda ainda a classificar conclusões candidatas. Depois de marcar as linhas admissíveis, olhe para cada proposição: se ela é V em todas essas linhas, é conclusão necessária; se é F em todas, sua negação é necessária; se varia, é indeterminada. Uma conclusão pode ser válida mesmo sendo mais fraca do que se esperava, como “não ocorreram ambos”, que não diz qual dos dois deixou de ocorrer. A resposta correta pode exigir exatamente essa conclusão fraca, e escolher uma mais forte é o erro típico de quem lê a premissa com mais informação do que ela traz."
    ],
    "workedExamples": [
     {
      "prompt": "Um servidor sabe que: se um pedido é deferido, ele é cumprido por mandado ou por carta; o pedido 31 não foi cumprido por mandado. É válido concluir que, se o pedido 31 foi deferido, então foi cumprido por carta?",
      "steps": [
       "Simbolize: P = deferido, Q = cumprido por mandado, R = cumprido por carta. Premissas: P→(Q∨R) e ¬Q. Conclusão: P→R.",
       "Monte as 8 linhas (tabela abaixo) e marque as linhas em que ambas as premissas são V: são as de Q = F em que P→(Q∨R) é V, isto é, (V,F,V), (F,F,V) e (F,F,F). A linha (V,F,F) tem P→(Q∨R) falsa e fica de fora.",
       "Nas três linhas admissíveis, a conclusão P→R vale V, V e V. Não existe linha com premissas V e conclusão F.",
       "Confirmação pelo atalho: para falsificar P→R é preciso P = V e R = F; então P→(Q∨R) exige Q = V, o que contradiz ¬Q. Logo não há contraexemplo."
      ],
      "answer": "Sim, o argumento é válido (não há linha com premissas V e conclusão F)."
     },
     {
      "prompt": "Sabe-se: se a parte autora comparece e apresenta o documento, a audiência prossegue; a audiência não prosseguiu. Conclui-se que a parte autora não compareceu. O argumento é válido? Se não for, o que se pode concluir de fato?",
      "steps": [
       "Simbolize: P = a parte comparece, Q = a parte apresenta o documento, R = a audiência prossegue. Premissas: (P∧Q)→R e ¬R. Conclusão: ¬P.",
       "Suponha a conclusão falsa (P = V) e as premissas verdadeiras. De ¬R, R = F. Para (V∧Q)→F ser verdadeira, V∧Q precisa ser F, isto é, Q = F.",
       "A linha P = V, Q = F, R = F tem as duas premissas verdadeiras ((V∧F)→F é V, e ¬R é V) e a conclusão ¬P falsa. É um contraexemplo: o argumento é inválido.",
       "Das mesmas premissas, o modus tollens dá ¬(P∧Q), que equivale a ¬P∨¬Q. Conferindo as 8 linhas, as três linhas admissíveis (P,Q,R) = (V,F,F), (F,V,F), (F,F,F) têm ¬P∨¬Q verdadeira em todas."
      ],
      "answer": "Inválido. O que decorre é que a parte não compareceu ou não apresentou o documento (¬P∨¬Q)."
     }
    ],
    "tables": [
     {
      "caption": "Argumento P→(Q∨R); ¬Q; logo P→R (todas as 8 linhas)",
      "headers": [
       "P",
       "Q",
       "R",
       "P→(Q∨R)",
       "¬Q",
       "P→R (conclusão)",
       "Premissas todas V?"
      ],
      "rows": [
       [
        "V",
        "V",
        "V",
        "V",
        "F",
        "V",
        "Não"
       ],
       [
        "V",
        "V",
        "F",
        "V",
        "F",
        "F",
        "Não"
       ],
       [
        "V",
        "F",
        "V",
        "V",
        "V",
        "V",
        "Sim"
       ],
       [
        "V",
        "F",
        "F",
        "F",
        "V",
        "F",
        "Não"
       ],
       [
        "F",
        "V",
        "V",
        "V",
        "F",
        "V",
        "Não"
       ],
       [
        "F",
        "V",
        "F",
        "V",
        "F",
        "V",
        "Não"
       ],
       [
        "F",
        "F",
        "V",
        "V",
        "V",
        "V",
        "Sim"
       ],
       [
        "F",
        "F",
        "F",
        "V",
        "V",
        "V",
        "Sim"
       ]
      ]
     }
    ]
   },
   {
    "capitulo": 5,
    "development": [
     "Cada afirmação categórica tem uma negação que também é categórica, e saber trocar uma pela outra evita muitos erros. A negação de “Todo A é B” é “Algum A não é B”; a negação de “Nenhum A é B” é “Algum A é B”. Em linguagem comum, “nem todo A é B” significa o mesmo que “algum A não é B”. Já “Todo A é B” e “Nenhum A é B” não são negações uma da outra: ambas podem ser falsas ao mesmo tempo (quando só parte de A está em B). Em diagramas de círculos, a negação de uma afirmação sobre a existência de elementos é sempre o aparecimento de uma região vazia, e vice-versa. Lembre também a convenção do texto: “Todo A é B” não garante que A tenha elementos; se A for vazio, “Todo A é B” e “Nenhum A é B” são ambas verdadeiras ao mesmo tempo.",
     "Descreva o diagrama em palavras antes de decidir. Para “Todo A é B”, o círculo A fica dentro do círculo B. Para “Nenhum A é B”, os círculos ficam separados. Para “Algum A é B”, escreve-se um X na zona comum. Para “Algum A não é B”, escreve-se um X na parte de A que está fora de B. Quando um X puder estar em duas zonas sem que as premissas escolham, coloque-o sobre a linha entre elas: essa posição significa “ou numa, ou noutra”. Uma conclusão só é necessária se, mesmo com o X na posição menos favorável, ela continuar verdadeira."
    ],
    "workedExamples": [
     {
      "prompt": "Sabe-se que nenhum documento sigiloso é público e que todo documento publicado no portal é público. Conclui-se que nenhum documento sigiloso foi publicado no portal. O argumento é válido?",
      "steps": [
       "Chame de S os documentos sigilosos, B os públicos e P os publicados no portal. As premissas são: S e B não têm elemento em comum; P está inteiramente dentro de B.",
       "Descreva o diagrama: o círculo S está afastado do círculo B, e o círculo P está desenhado dentro de B. Como S está fora de B e P está dentro de B, S e P não podem se tocar.",
       "Em termos de elementos: se existisse um documento em S e em P, ele estaria em P, logo em B, e também em S, o que a primeira premissa proíbe. Não há contraexemplo; a conclusão é necessária.",
       "Verificação por modelos: nos 256 modelos possíveis de três classes, todos os que satisfazem as duas premissas deixam S e P sem elementos em comum."
      ],
      "answer": "Válido: nenhum documento sigiloso foi publicado no portal."
     },
     {
      "prompt": "Sabe-se que todo recurso admitido é tempestivo e que algum recurso do lote 8 não é tempestivo. Examine as conclusões: (I) algum recurso do lote 8 não foi admitido; (II) algum recurso do lote 8 foi admitido; (III) nenhum recurso do lote 8 foi admitido.",
      "steps": [
       "Chame de A os recursos admitidos, T os tempestivos e L os do lote 8. Premissas: A está dentro de T; existe x em L fora de T.",
       "Teste (I): o recurso x não é tempestivo. Se x fosse admitido, estaria em A e, portanto, em T, o que é impossível. Logo x é um recurso do lote que não foi admitido. A conclusão (I) vale em todos os cenários.",
       "Teste (II): é possível que todos os recursos do lote 8 sejam não tempestivos, e nesse caso nenhum seria admitido. Existe cenário compatível com as premissas em que (II) é falsa, então (II) não é necessária.",
       "Teste (III): é possível que o lote 8 contenha, além de x, um recurso admitido e tempestivo. Então (III) é falsa nesse cenário e também não é necessária."
      ],
      "answer": "Somente (I) é necessária; (II) e (III) são apenas possíveis."
     }
    ],
    "tables": [
     {
      "caption": "Afirmações categóricas e suas negações",
      "headers": [
       "Afirmação",
       "Negação",
       "Observação"
      ],
      "rows": [
       [
        "Todo A é B",
        "Algum A não é B",
        "Não é a mesma coisa que “Nenhum A é B”"
       ],
       [
        "Nenhum A é B",
        "Algum A é B",
        "Não é a mesma coisa que “Todo A é B”"
       ],
       [
        "Algum A é B",
        "Nenhum A é B",
        "A afirmação original equivale a “Algum B é A”"
       ],
       [
        "Algum A não é B",
        "Todo A é B",
        "Não equivale a “Algum B não é A”"
       ]
      ]
     }
    ]
   }
  ],
  "novosCapitulos": [
   {
    "title": "Formas de argumento válidas e falácias clássicas",
    "paragraphs": [
     "Alguns formatos de argumento aparecem tantas vezes que vale a pena memorizá-los, porque cada um traz consigo a garantia de validade: sempre que as premissas tiverem exatamente aquela forma, a conclusão decorre, qualquer que seja o assunto. Os principais são o modus ponens (P→Q; P; logo Q), o modus tollens (P→Q; ¬Q; logo ¬P), o silogismo hipotético (P→Q; Q→R; logo P→R), o silogismo disjuntivo (P∨Q; ¬P; logo Q) e o dilema construtivo (P→Q; R→S; P∨R; logo Q∨S). Você não precisa montar tabela para eles. Precisa reconhecer a forma por trás das palavras e conferir se as premissas encaixam sem sobra nem troca.",
     "Reconhecer a forma exige tradução. As palavras “se”, “caso”, “quando”, “sempre que”, “basta que” e “somente se” marcam condicionais, mas em direções diferentes: “P somente se Q” é P→Q, enquanto “P se Q” é Q→P. O “ou” isolado é inclusivo, ou seja, admite que as duas coisas aconteçam; só “ou… ou…” indica que exatamente uma ocorre. Outro cuidado é a negação: a negação de “o prazo foi cumprido” é “o prazo não foi cumprido”, e não “o prazo foi descumprido por má-fé”. Troque as frases por letras e deixe cada letra com um único significado do começo ao fim do raciocínio.",
     "Duas formas parecem o modus ponens e o modus tollens com uma troca sutil, e são inválidas: a afirmação do consequente (P→Q; Q; logo P) e a negação do antecedente (P→Q; ¬P; logo ¬Q). Há também o uso indevido do silogismo disjuntivo, quando de P∨Q e P se conclui ¬Q, o que só valeria com o ou exclusivo. A razão do erro é sempre a mesma: a condicional P→Q proíbe apenas a combinação P verdadeira com Q falsa. As outras três combinações continuam possíveis, e a linha P falsa com Q verdadeira derruba as duas falácias de uma só vez."
    ],
    "example": "Exemplo resolvido: “Se o edital foi publicado, as inscrições abriram. As inscrições não abriram.” A forma é P→Q; ¬Q, portanto vale o modus tollens: o edital não foi publicado.",
    "development": [
     "O dilema construtivo é o mais difícil de reconhecer porque combina duas condicionais e uma disjunção. De “se o servidor opta pelo regime A, recebe adicional; se opta pelo B, recebe gratificação” e “optou por A ou por B”, conclui-se “recebe adicional ou gratificação”. Repare que a conclusão é uma disjunção: o dilema não diz qual dos dois ocorre, a menos que uma informação adicional elimine um dos lados. Existe ainda o dilema destrutivo (P→Q; R→S; ¬Q∨¬S; logo ¬P∨¬R), que é uma espécie de modus tollens aplicado a duas condicionais ao mesmo tempo. Ambos são válidos e podem ser conferidos na tabela com quatro proposições.",
     "Outras equivalências ajudam a converter frases. P→Q equivale a ¬P∨Q (basta que a condicional seja verdadeira para que “P é falsa ou Q é verdadeira”), e equivale também à contrapositiva ¬Q→¬P. Já a recíproca Q→P e a inversa ¬P→¬Q não são equivalentes à condicional original: são equivalentes entre si, mas isso não ajuda. É comum a armadilha ser justamente a recíproca ou a inversa da conclusão correta. Antes de marcar, pergunte: a forma que estou usando é uma das cinco válidas, ou é uma das falácias?"
    ],
    "method": [
     "Traduza cada frase para símbolos, com uma letra por ideia e a direção da seta conferida (“somente se”, “basta que”).",
     "Compare as premissas com as formas válidas: modus ponens, modus tollens, silogismo hipotético, silogismo disjuntivo e dilema.",
     "Se a forma coincide, a conclusão é necessária. Se parece com uma delas, mas a confirmação ou negação está no lado errado, desconfie de falácia.",
     "Para ter certeza, procure o contraexemplo com P falsa e Q verdadeira, ou monte a tabela das linhas em que todas as premissas são verdadeiras."
    ],
    "workedExamples": [
     {
      "prompt": "Sabe-se que: se o requerimento foi protocolado até sexta, ele é analisado na segunda; se é analisado na segunda, o parecer sai na terça; o requerimento foi protocolado até sexta. Que se conclui?",
      "steps": [
       "Simbolize: P = protocolado até sexta, Q = analisado na segunda, R = parecer na terça. Premissas: P→Q, Q→R e P.",
       "Aplique o modus ponens a P→Q e P: obtém-se Q.",
       "Aplique o modus ponens a Q→R e Q: obtém-se R. (O mesmo resultado sai do silogismo hipotético: P→R, e depois P dá R.)",
       "Na tabela com 8 linhas (P, Q, R), apenas a linha P = V, Q = V, R = V torna as três premissas verdadeiras; R é V nela."
      ],
      "answer": "O parecer sai na terça."
     },
     {
      "prompt": "Um servidor argumenta: “Se o ofício foi assinado, ele foi enviado ao setor. O ofício foi enviado ao setor. Logo, foi assinado.” Mostre, por tabela, que o argumento é inválido, e verifique também se “Se o ofício foi assinado, ele foi enviado. O ofício não foi assinado. Logo, não foi enviado” é válido.",
      "steps": [
       "Simbolize: P = “o ofício foi assinado”, Q = “foi enviado ao setor”. A tabela completa tem 4 linhas (veja abaixo).",
       "Primeiro argumento (P→Q; Q; logo P): as premissas são ambas V nas linhas (V,V) e (F,V). Em (V,V) a conclusão P é V, mas em (F,V) a conclusão P é F. Essa linha é um contraexemplo: um ofício que, por engano, foi enviado sem assinatura.",
       "Segundo argumento (P→Q; ¬P; logo ¬Q): as premissas são ambas V nas linhas (F,V) e (F,F). Em (F,F) a conclusão ¬Q é V, mas em (F,V) é F. A mesma linha (F,V) é o contraexemplo.",
       "Portanto, a afirmação do consequente e a negação do antecedente falham pelo mesmo motivo: a premissa condicional não impede Q verdadeira com P falsa."
      ],
      "answer": "Os dois argumentos são inválidos; o contraexemplo é P = F e Q = V."
     },
     {
      "prompt": "Classifique cada argumento (em todos, “ou” é inclusivo) como válido ou inválido e nomeie a forma: (I) “Se o edital foi publicado, as inscrições abriram. As inscrições não abriram. Logo, o edital não foi publicado.” (II) “Se o edital foi publicado, as inscrições abriram. O edital não foi publicado. Logo, as inscrições não abriram.” (III) “A multa foi paga em dinheiro ou por boleto. Foi paga em dinheiro. Logo, não foi paga por boleto.” (IV) “Se o servidor opta pelo regime A, recebe adicional; se opta pelo B, recebe gratificação. Optou por A ou por B. Logo, recebe adicional ou gratificação.”",
      "steps": [
       "(I) P→Q; ¬Q; ¬P. Na tabela, a única linha com as duas premissas V é P = F, Q = F, e nela a conclusão é V. Modus tollens, válido.",
       "(II) P→Q; ¬P; ¬Q. A linha P = F, Q = V tem as duas premissas V e a conclusão F. Negação do antecedente, inválido.",
       "(III) P∨Q; P; ¬Q. A linha P = V, Q = V tem as duas premissas V e a conclusão F, pois o “ou” é inclusivo: a multa pode ter sido paga parte em dinheiro e parte por boleto. Inválido (só valeria com “ou… ou…”).",
       "(IV) P→Q; R→S; P∨R; Q∨S. Das 16 linhas de (P,Q,R,S), 5 têm as três premissas V, e em todas elas Q∨S é V. Dilema construtivo, válido."
      ],
      "answer": "(I) válido (modus tollens); (II) inválido (negação do antecedente); (III) inválido (ou inclusivo); (IV) válido (dilema construtivo)."
     }
    ],
    "pitfall": "Aceitar como válido um argumento só porque ele “soa” parecido com o modus ponens ou o tollens. Confira sempre qual lado da seta foi afirmado ou negado: afirmar o antecedente e negar o consequente é seguro; afirmar o consequente e negar o antecedente não é.",
    "tables": [
     {
      "caption": "Formas válidas e falácias",
      "headers": [
       "Nome",
       "Forma",
       "Situação"
      ],
      "rows": [
       [
        "Modus ponens",
        "P→Q; P; logo Q",
        "Válida"
       ],
       [
        "Modus tollens",
        "P→Q; ¬Q; logo ¬P",
        "Válida"
       ],
       [
        "Silogismo hipotético",
        "P→Q; Q→R; logo P→R",
        "Válida"
       ],
       [
        "Silogismo disjuntivo",
        "P∨Q; ¬P; logo Q",
        "Válida"
       ],
       [
        "Dilema construtivo",
        "P→Q; R→S; P∨R; logo Q∨S",
        "Válida"
       ],
       [
        "Afirmação do consequente",
        "P→Q; Q; logo P",
        "Inválida"
       ],
       [
        "Negação do antecedente",
        "P→Q; ¬P; logo ¬Q",
        "Inválida"
       ],
       [
        "Disjunção com afirmação",
        "P∨Q; P; logo ¬Q",
        "Inválida (ou inclusivo)"
       ]
      ]
     },
     {
      "caption": "As duas falácias na mesma tabela (premissa P→Q)",
      "headers": [
       "P",
       "Q",
       "P→Q",
       "Q (2ª premissa da 1ª falácia)",
       "¬P (2ª premissa da 2ª falácia)",
       "P→Q é V?"
      ],
      "rows": [
       [
        "V",
        "V",
        "V",
        "V",
        "F",
        "Sim: P é V e Q é V"
       ],
       [
        "V",
        "F",
        "F",
        "F",
        "F",
        "Não"
       ],
       [
        "F",
        "V",
        "V",
        "V",
        "V",
        "Sim: P é F e Q é V (derruba as duas falácias)"
       ],
       [
        "F",
        "F",
        "V",
        "F",
        "V",
        "Sim: P é F e Q é F"
       ]
      ]
     }
    ],
    "resumo": {
     "title": "Formas válidas e falácias",
     "text": "Modus ponens, modus tollens, silogismo hipotético, silogismo disjuntivo e dilema são sempre válidos. Afirmar o consequente e negar o antecedente são falácias.",
     "bizu": "Afirme o antecedente ou negue o consequente; o resto é armadilha."
    }
   },
   {
    "title": "Testar a validade na prática: tabela, suposição e contraexemplo",
    "paragraphs": [
     "Existem três caminhos para testar um argumento, e todos respondem à mesma pergunta: é possível que todas as premissas sejam verdadeiras e a conclusão falsa? O primeiro é a tabela-verdade completa. Ela lista todas as linhas possíveis, marca aquelas em que todas as premissas são verdadeiras e olha o valor da conclusão nelas. É infalível, mas cresce depressa: duas proposições dão 4 linhas, três dão 8, quatro dão 16. O segundo caminho é supor a conclusão falsa e as premissas verdadeiras e ver se os valores se sustentam. O terceiro é o contraexemplo concreto, uma situação possível que satisfaz as premissas e nega a conclusão.",
     "Na tabela, só interessam as linhas em que todas as premissas são V; as demais são cenários que o enunciado não permite. Se em alguma dessas linhas a conclusão for F, o argumento é inválido, e essa linha é o contraexemplo. Se em todas for V, o argumento é válido. Um caso curioso: se nenhuma linha tornar todas as premissas verdadeiras, as premissas são inconsistentes e o argumento é, tecnicamente, válido, porque não existe cenário que o refute. Em prova, esse caso é raro, e o mais comum é o enunciado trazer premissas compatíveis e perguntar se a conclusão é obrigatória.",
     "O método da suposição faz o caminho inverso e economiza linhas. Você escreve a conclusão como falsa e as premissas como verdadeiras, e vai deduzindo os valores que isso obriga. Se chegar a um conflito (uma letra que precisaria ser V e F), não existe contraexemplo e o argumento é válido. Se os valores se fecharem sem conflito, esses valores são o contraexemplo e o argumento é inválido. Ajuda saber quais fórmulas forçam valores quando falsas: uma condicional falsa obriga o antecedente V e o consequente F; uma disjunção falsa obriga os dois lados F; já uma conjunção falsa permite três combinações e exige ramificar."
    ],
    "example": "Exemplo resolvido: P→Q; Q→R; logo P→R. Suponha a conclusão falsa: P = V e R = F. Para P→Q ser V é preciso Q = V; para Q→R ser V é preciso R = V. Isso conflita com R = F, logo não há contraexemplo e o argumento é válido.",
    "development": [
     "Em enunciados escritos em português, o contraexemplo costuma ser uma cena. Para derrubar “se há sessão, há ata; há ata; logo há sessão”, basta imaginar uma ata lavrada em reunião interna que não foi sessão. A cena precisa respeitar todas as premissas ao pé da letra, e cada premissa deve ser relida contra ela. O erro típico é inventar uma cena que viola uma premissa sem perceber. Quando a conclusão é uma conjunção, o argumento é válido se cada parte for conclusão válida separadamente. Quando a conclusão é uma disjunção, só há contraexemplo se ambas as partes forem F, o que reduz bastante a busca.",
     "Outro uso da tabela é contar. Depois de marcar as linhas admissíveis, você consegue dizer em quantos cenários a conclusão falha, o que é útil para comparar situações. Também ajuda checar equivalências: duas fórmulas são equivalentes quando têm o mesmo valor em todas as linhas. Por fim, lembre que a tabela e a suposição não competem. Use a tabela quando há duas ou três letras e você quer ver tudo; use a suposição quando há quatro ou mais letras ou quando a conclusão é uma condicional ou disjunção, formas que forçam muitos valores quando falsas."
    ],
    "method": [
     "Escreva as premissas e a conclusão em símbolos, listando as proposições simples.",
     "Escolha o método: tabela se há até 3 letras; suposição (conclusão F e premissas V) se há mais letras ou se a conclusão força valores.",
     "Propague os valores obrigados e procure um conflito. Conflito: válido. Valores consistentes: inválido, e eles formam o contraexemplo.",
     "Confira o contraexemplo relendo cada premissa e a conclusão com os valores achados."
    ],
    "workedExamples": [
     {
      "prompt": "Sabe-se: se o pedido é urgente, ele é despachado hoje; o pedido é urgente ou é despachado hoje. Pelo método da tabela, é válido concluir que o pedido é despachado hoje? (Em todo o enunciado, “ou” é inclusivo.)",
      "steps": [
       "Simbolize: P = urgente, Q = despachado hoje. Premissas: P→Q e P∨Q. Conclusão: Q. São 4 linhas (tabela abaixo).",
       "Linha (V,V): P→Q é V, P∨Q é V, Q é V. Linha (V,F): P→Q é F, descartada. Linha (F,V): P→Q é V, P∨Q é V, Q é V. Linha (F,F): P→Q é V, mas P∨Q é F, descartada.",
       "Nas duas linhas em que todas as premissas são V, a conclusão Q é V. Não há contraexemplo.",
       "Verificação pela suposição: com Q = F, P→Q exige P = F, e P∨Q exige P = V. O conflito mostra que não há contraexemplo."
      ],
      "answer": "Sim: o pedido é despachado hoje, pois o argumento é válido."
     },
     {
      "prompt": "Sabe-se: (1) se a perícia é deferida, o laudo é juntado; (2) se a oitiva é designada, a ata é lavrada; (3) o laudo não é juntado ou a ata não é lavrada (pelo menos um dos dois não ocorre). É válido concluir que a perícia não é deferida ou a oitiva não é designada?",
      "steps": [
       "Simbolize: P = perícia deferida, Q = laudo juntado, R = oitiva designada, S = ata lavrada. Premissas: P→Q; R→S; ¬Q∨¬S. Conclusão: ¬P∨¬R.",
       "Suponha a conclusão falsa: ¬P∨¬R é F apenas se P = V e R = V.",
       "Com P = V, a premissa (1) exige Q = V. Com R = V, a premissa (2) exige S = V. Então ¬Q∨¬S fica F∨F = F, contrariando (3).",
       "Conflito: não há contraexemplo. Pela tabela com 16 linhas (P,Q,R,S), 5 linhas têm as três premissas V e, em todas elas, ¬P∨¬R é V."
      ],
      "answer": "Sim: o argumento é válido (dilema destrutivo)."
     },
     {
      "prompt": "Sabe-se: (1) se o ofício é assinado ou o requerimento é protocolado, o expediente é autuado; (2) se o expediente é autuado, ele é distribuído; (3) o expediente foi distribuído. Conclui-se que o ofício foi assinado. O argumento é válido? Em quantas das 16 linhas há contraexemplo?",
      "steps": [
       "Simbolize: P = ofício assinado, Q = requerimento protocolado, R = expediente autuado, S = expediente distribuído. Premissas: (P∨Q)→R; R→S; S. Conclusão: P.",
       "Suponha a conclusão falsa: P = F. Por (3), S = V, e então R→S é V qualquer que seja R. Resta (P∨Q)→R, que com P = F vira Q→R.",
       "Escolha, por exemplo, Q = F e R = F: (F∨F)→F é V (antecedente falso), R→S é V e S é V. As três premissas são V e a conclusão P é F. Contraexemplo: o argumento é inválido.",
       "Contagem: das 16 linhas (P,Q,R,S), 5 têm as três premissas V (S = V e (P∨Q)→R). Em 3 delas P é F: (Q,R,S) = (V,V,V), (F,V,V) e (F,F,V), sempre com P = F. Nas outras duas, P = V e a conclusão se mantém."
      ],
      "answer": "Inválido; há 3 linhas de contraexemplo (todas com P = F, S = V e Q→R verdadeira)."
     }
    ],
    "pitfall": "Escolher como contraexemplo uma linha em que alguma premissa é falsa. Ela não é um cenário permitido. Antes de declarar o argumento inválido, releia todas as premissas com os valores achados e confirme que todas são verdadeiras.",
    "tables": [
     {
      "caption": "Valores que a falsidade ou a verdade de cada fórmula obriga",
      "headers": [
       "Fórmula",
       "Quando é V",
       "Quando é F"
      ],
      "rows": [
       [
        "P∧Q",
        "P = V e Q = V (os dois são obrigados)",
        "Três casos: (V,F), (F,V), (F,F); é preciso ramificar"
       ],
       [
        "P∨Q",
        "Três casos: (V,V), (V,F), (F,V); é preciso ramificar",
        "P = F e Q = F (os dois são obrigados)"
       ],
       [
        "P→Q",
        "Três casos: (V,V), (F,V), (F,F)",
        "P = V e Q = F (os dois são obrigados)"
       ],
       [
        "¬P",
        "P = F",
        "P = V"
       ],
       [
        "P↔Q",
        "P e Q com o mesmo valor",
        "P e Q com valores diferentes"
       ]
      ]
     },
     {
      "caption": "Argumento P→Q; P∨Q; logo Q",
      "headers": [
       "P",
       "Q",
       "P→Q",
       "P∨Q",
       "Q (conclusão)",
       "Premissas todas V?"
      ],
      "rows": [
       [
        "V",
        "V",
        "V",
        "V",
        "V",
        "Sim"
       ],
       [
        "V",
        "F",
        "F",
        "V",
        "F",
        "Não"
       ],
       [
        "F",
        "V",
        "V",
        "V",
        "V",
        "Sim"
       ],
       [
        "F",
        "F",
        "V",
        "F",
        "F",
        "Não"
       ]
      ]
     }
    ],
    "resumo": {
     "title": "Testar validade",
     "text": "Um argumento só é inválido se existir linha com todas as premissas V e a conclusão F. A tabela mostra todas as linhas; a suposição procura direto essa linha.",
     "bizu": "Suponha a conclusão falsa e as premissas verdadeiras: conflito significa válido."
    }
   },
   {
    "title": "Deduzir de um conjunto de premissas e argumentos categóricos com diagramas",
    "paragraphs": [
     "Muitos problemas entregam um bloco de premissas e perguntam o que “necessariamente” decorre ou qual valor lógico cada proposição assume. Em vez de testar um único argumento, você deve resolver o sistema: descobrir os cenários compatíveis com todas as premissas. A estratégia é sempre a mesma. Procure primeiro um fato simples, isto é, uma proposição afirmada ou negada sem condição. Depois propague: o fato ativa um modus ponens, um modus tollens ou um silogismo disjuntivo, que gera novos fatos, até que nada mais seja forçado. Se não houver fato simples, abra casos (por exemplo, “suponha que Lúcia seja nomeada” e “suponha que não seja”) e veja quais casos sobrevivem.",
     "No fim, cada proposição cai em uma de três classes. É necessária (ou determinada V) se vale em todos os cenários compatíveis; é impossível (determinada F) se falha em todos; é contingente ou indeterminada se vale em alguns e falha em outros. Uma conclusão “que se segue necessariamente” é a primeira classe. Uma que “pode ocorrer” é a primeira ou a terceira. Se as premissas deixam mais de um cenário, a resposta correta costuma ser uma proposição verdadeira em todos eles, como “Nara é nomeada se, e somente se, Lúcia não é”, e não uma proposição que só vale em um deles.",
     "Quando as premissas usam todo, nenhum e algum, o raciocínio muda de ferramenta: você pensa em classes e desenha círculos. Descreva em palavras: “Todo A é B” coloca A dentro de B; “Nenhum A é B” separa os dois círculos; “Algum A é B” põe um X na região comum; “Algum A não é B” põe um X na parte de A fora de B. Desenhe primeiro as premissas universais (todo e nenhum), depois marque os X. Se um X puder ficar em duas regiões, coloque-o na linha entre elas. Uma conclusão é necessária apenas se vale com o X na pior posição possível."
    ],
    "example": "Exemplo resolvido: sabe-se que o laudo foi juntado, que se o laudo foi juntado o perito foi pago, e que o perito foi pago ou a vistoria foi cancelada. O pagamento do perito é necessário, mas o cancelamento da vistoria fica indeterminado, porque o “ou” inclusivo já está satisfeito.",
    "development": [
     "A forma como o enunciado dá as informações varia, e ajuda saber converter. “Mas”, “embora” e “além disso” funcionam como conjunção. “Nem P nem Q” é ¬P∧¬Q. A negação de uma conjunção é uma disjunção (¬(P∧Q) equivale a ¬P∨¬Q), e a negação de uma disjunção é uma conjunção (¬(P∨Q) equivale a ¬P∧¬Q): essas são as leis de De Morgan. Quando todas as premissas são condicionais e nenhum fato simples aparece, vale tentar a cadeia pelas contrapositivas ou abrir casos, o que costuma revelar que dois valores andam sempre juntos, como Mário e Lúcia no exemplo desenvolvido a seguir.",
     "Nos argumentos categóricos, lembre que “Algum A é B” equivale a “Algum B é A” e que “Nenhum A é B” equivale a “Nenhum B é A”, mas “Todo A é B” não pode ser invertido. Além disso, “algum” significa “pelo menos um”, e uma premissa com “algum” traz uma testemunha de existência que pode ser levada a outras classes por inclusões válidas. Já duas premissas com “algum” podem falar de elementos diferentes. Por fim, premissas só com “todo” e “nenhum” nunca garantem que exista algum elemento na classe, então a conclusão “algum” exige uma premissa com “algum”."
    ],
    "method": [
     "Liste as premissas e, para cada uma, anote em símbolos ou em círculos o que ela diz.",
     "Localize os fatos simples e use-os para disparar modus ponens, modus tollens e silogismo disjuntivo; se não houver, abra casos.",
     "Registre os cenários compatíveis (por exemplo, em uma pequena tabela). Marque cada proposição como necessária, impossível ou indeterminada.",
     "Nos categóricos, desenhe universais primeiro, marque os X depois e teste a conclusão com o X na pior posição.",
     "Responda apenas o que foi perguntado: necessário, possível ou impossível."
    ],
    "workedExamples": [
     {
      "prompt": "Em um setor, sabe-se: (1) se o ofício é assinado, ele é enviado; (2) se o ofício é enviado, ele não fica no arquivo; (3) o ofício fica no arquivo ou é devolvido; (4) o ofício não foi devolvido. Qual é a situação do ofício? (Em todo o enunciado, “ou” é inclusivo.)",
      "steps": [
       "Simbolize: P = assinado, Q = enviado, R = fica no arquivo, S = devolvido. Premissas: P→Q; Q→¬R; R∨S; ¬S.",
       "O fato simples é ¬S. De R∨S e ¬S, o silogismo disjuntivo dá R: o ofício fica no arquivo.",
       "De Q→¬R e R (isto é, ¬¬R), o modus tollens dá ¬Q: o ofício não foi enviado.",
       "De P→Q e ¬Q, o modus tollens dá ¬P: o ofício não foi assinado.",
       "Conferência pela tabela com 16 linhas (P,Q,R,S): apenas P = F, Q = F, R = V, S = F satisfaz as quatro premissas."
      ],
      "answer": "O ofício não foi assinado, não foi enviado, fica no arquivo e não foi devolvido."
     },
     {
      "prompt": "Uma comissão decide nomear três candidatos: Lúcia (L), Mário (M) e Nara (N). Sabe-se: (1) se Lúcia é nomeada, Mário também é; (2) se Mário é nomeado, Nara não é; (3) pelo menos uma entre Lúcia e Nara é nomeada. Classifique como necessária, impossível ou indeterminada cada afirmação: (I) Mário é nomeado; (II) Lúcia e Nara são ambas nomeadas; (III) Nara é nomeada se, e somente se, Lúcia não é; (IV) Lúcia é nomeada.",
      "steps": [
       "Premissas: L→M; M→¬N; L∨N. Não há fato simples, então abra casos sobre L.",
       "Caso L = V: por (1), M = V; por (2), N = F. A premissa (3) é V porque L é V. Cenário 1: L = V, M = V, N = F.",
       "Caso L = F: por (3), N = V. Por (2), se M fosse V, N seria F, o que contradiz N = V; logo M = F. A premissa (1) é V porque L é F. Cenário 2: L = F, M = F, N = V.",
       "Pela tabela com 8 linhas (L,M,N), só esses dois cenários satisfazem as três premissas. Em ambos, M tem o mesmo valor de L, e N tem valor oposto.",
       "(I) M vale V no cenário 1 e F no 2: indeterminada. (II) L e N nunca são V juntas: impossível. (III) N é V exatamente quando L é F, nos dois cenários: necessária. (IV) L é V no cenário 1 e F no 2: indeterminada."
      ],
      "answer": "(I) indeterminada; (II) impossível; (III) necessária; (IV) indeterminada."
     },
     {
      "prompt": "Sabe-se: todo analista é concursado; nenhum concursado é terceirizado; algum servidor do setor é analista. Examine as conclusões: (i) algum servidor do setor não é terceirizado; (ii) algum servidor do setor é concursado; (iii) todo servidor do setor é analista; (iv) nenhum analista é terceirizado.",
      "steps": [
       "Chame de A os analistas, C os concursados, T os terceirizados e S os servidores do setor. Desenho em palavras: o círculo A está dentro de C; o círculo T está separado de C; coloca-se um X na região comum de S e A.",
       "O X está em A, logo em C (pois A está dentro de C), e portanto fora de T (pois C e T estão separados). Esse mesmo X está em S.",
       "(i) O X é um servidor do setor fora de T: necessária. (ii) O X é um servidor do setor dentro de C: necessária. (iv) A está dentro de C, que está separado de T; então A e T estão separados: necessária.",
       "(iii) Nada impede que existam servidores do setor que não sejam analistas (por exemplo, técnicos concursados que não sejam analistas): é possível, mas não é necessária.",
       "Verificação por modelos: nos 65.536 modelos possíveis com quatro classes, (i), (ii) e (iv) valem em todos os que satisfazem as premissas, e (iii) falha em ao menos um."
      ],
      "answer": "(i), (ii) e (iv) são necessárias; (iii) não é necessária."
     }
    ],
    "pitfall": "Ler uma premissa do tipo “todo A é B” como se fosse “todo B é A”, ou concluir existência (“algum”) apenas de premissas com “todo” e “nenhum”. Em ambos os casos, desenhe a situação mínima e veja se há cenário em que a conclusão falha.",
    "tables": [
     {
      "caption": "Cenários compatíveis do exemplo da comissão (L, M, N)",
      "headers": [
       "Cenário",
       "Lúcia (L)",
       "Mário (M)",
       "Nara (N)"
      ],
      "rows": [
       [
        "1",
        "V",
        "V",
        "F"
       ],
       [
        "2",
        "F",
        "F",
        "V"
       ]
      ]
     },
     {
      "caption": "Classificação de uma proposição",
      "headers": [
       "Classe",
       "Valor nos cenários compatíveis",
       "Como aparece na pergunta"
      ],
      "rows": [
       [
        "Necessária",
        "V em todos",
        "“necessariamente”, “com certeza”, “obrigatoriamente”"
       ],
       [
        "Impossível",
        "F em todos",
        "“nunca pode”, “é incompatível”"
       ],
       [
        "Indeterminada",
        "V em alguns e F em outros",
        "“pode ser”, “é possível”, mas não “necessariamente”"
       ]
      ]
     }
    ],
    "resumo": {
     "title": "Deduzir de premissas",
     "text": "Ache os fatos simples, propague com as regras e abra casos quando preciso; classifique cada proposição como necessária, impossível ou indeterminada. Nos categóricos, desenhe universais primeiro e marque os X depois.",
     "bizu": "Se o X pode cair em duas regiões, ponha-o na linha: só vale o que resiste à pior posição."
    }
   }
  ]
 },
 "M05": {
  "extras": [
   {
    "capitulo": 1,
    "development": [
     "Um conjunto pode ser apresentado de duas maneiras: por listagem, como {2, 4, 6}, ou por propriedade, como “os números pares de 1 a 6”. Nos enunciados, a segunda forma costuma exigir que você mesmo monte a lista antes de contar. Faça isso com calma e confira os extremos: “de 1 a 30” inclui o 1 e o 30; se o enunciado disser “entre 1 e 30”, só vale incluir os extremos se ele disser que sim. Repetição não conta e ordem não importa: {1, 2, 2, 3} e {3, 1, 2} são o mesmo conjunto, com 3 elementos. Escrever os elementos um por um, mesmo que dê trabalho, evita o erro mais comum de contagem: esquecer o primeiro ou o último número.",
     "Quando os elementos de um conjunto também podem ser conjuntos, a diferença entre pertencer e estar contido fica decisiva. Em A = {1, 2, {3}}, o objeto {3} é um dos elementos de A, e por isso {3} ∈ A; mas o número 3 sozinho não é elemento de A, de modo que {3} ⊆ A é falso. Outra consequência útil: um conjunto com n elementos tem 2^n subconjuntos, porque cada elemento tem duas escolhas independentes, entrar ou não entrar no subconjunto. Com 3 elementos, são 2 × 2 × 2 = 8 subconjuntos, incluindo o vazio e o próprio conjunto; sem contar o próprio conjunto, são 7 (os chamados subconjuntos próprios)."
    ],
    "workedExamples": [
     {
      "prompt": "Em um setor, os processos estão numerados de 1 a 30. Seja A o conjunto dos processos de número múltiplo de 3 e B o conjunto dos processos de número par. Determine A∩B, A−B, A∪B e quantos processos ficam fora de A∪B.",
      "steps": [
       "Liste cada conjunto. A = {3, 6, 9, 12, 15, 18, 21, 24, 27, 30}, com 10 elementos. B = {2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30}, com 15 elementos.",
       "Interseção: números que estão nas duas listas, ou seja, múltiplos de 3 e pares ao mesmo tempo (múltiplos de 6): A∩B = {6, 12, 18, 24, 30}, com 5 elementos.",
       "Diferença: de A, retire os que também estão em B. Sobram os múltiplos de 3 que são ímpares: A−B = {3, 9, 15, 21, 27}, com 5 elementos. Confira: 10 − 5 = 5.",
       "União: 10 + 15 − 5 = 20 elementos. Fora da união, entre os 30 processos: 30 − 20 = 10 (são os ímpares que não são múltiplos de 3: 1, 5, 7, 11, 13, 17, 19, 23, 25, 29)."
      ],
      "answer": "A∩B = {6, 12, 18, 24, 30}; A−B = {3, 9, 15, 21, 27}; A∪B tem 20 elementos; ficam fora 10 processos."
     },
     {
      "prompt": "Considere A = {1, 2, {3}}. Classifique como verdadeira ou falsa cada afirmação: (i) 2 ∈ A; (ii) {2} ⊆ A; (iii) {3} ∈ A; (iv) {3} ⊆ A; (v) 3 ∈ A; (vi) o conjunto vazio está contido em A. Depois, diga quantos subconjuntos de A têm exatamente 2 elementos e quantos subconjuntos A possui no total.",
      "steps": [
       "Os elementos de A são exatamente três objetos: o número 1, o número 2 e o conjunto {3}. Tudo se decide olhando para esses três.",
       "(i) 2 é um dos três elementos: verdadeira. (ii) {2} é um conjunto cujo único elemento, 2, está em A: logo está contido em A, verdadeira. (iii) {3} é um dos três elementos: verdadeira.",
       "(iv) {3} ⊆ A exigiria que o número 3 fosse elemento de A; ele não é (o que está em A é o conjunto {3}, não o número 3): falsa. (v) 3 ∈ A: falsa, pelo mesmo motivo. (vi) o vazio está contido em qualquer conjunto: verdadeira.",
       "Subconjuntos com 2 elementos: escolhem-se 2 dos 3 elementos, de 3 maneiras: {1, 2}, {1, {3}} e {2, {3}}. Total de subconjuntos: 2^3 = 8 (1 vazio + 3 de um elemento + 3 de dois elementos + 1 com os três = 8)."
      ],
      "answer": "Verdadeiras: (i), (ii), (iii) e (vi); falsas: (iv) e (v). Há 3 subconjuntos com 2 elementos e 8 subconjuntos no total."
     }
    ],
    "tables": [
     {
      "caption": "Pertinência e inclusão com A = {1, 2, {3}}",
      "headers": [
       "Afirmação",
       "Relaciona",
       "Vale?"
      ],
      "rows": [
       [
        "2 ∈ A",
        "elemento e conjunto",
        "Sim"
       ],
       [
        "{2} ⊆ A",
        "conjunto e conjunto",
        "Sim"
       ],
       [
        "{3} ∈ A",
        "elemento e conjunto",
        "Sim"
       ],
       [
        "{3} ⊆ A",
        "conjunto e conjunto",
        "Não, pois 3 ∉ A"
       ],
       [
        "∅ ⊆ A",
        "conjunto e conjunto",
        "Sim"
       ]
      ]
     }
    ]
   },
   {
    "capitulo": 2,
    "development": [
     "Há dois estilos de desenho. No diagrama de Venn, você desenha todas as regiões possíveis (4 regiões com dois conjuntos, 8 com três) e depois marca quais estão vazias e quais têm elemento. No diagrama de Euler, desenham-se apenas as relações que o texto informa: um círculo dentro do outro, dois círculos separados. Para resolver questões de “conclui-se necessariamente”, o estilo de Venn é o mais seguro, porque nada fica escondido: se você tinha esquecido que dois círculos poderiam se cruzar, a região da interseção está lá, esperando ser analisada. Como não dá para desenhar no texto, o hábito útil é numerar as regiões e descrevê-las por palavras, como “só A” ou “A e B, não C”.",
     "Cada região precisa de um destes três estados. Vazia: uma premissa do tipo “todo” ou “nenhum” proibiu elementos ali. Ocupada: uma premissa do tipo “algum” garantiu pelo menos um elemento ali. Livre: nada foi dito, então ela pode ter ou não ter elementos. Uma conclusão só é necessária quando, em todas as maneiras de preencher as regiões livres, ela continua verdadeira. Para refutá-la, basta uma única maneira de preencher que a torne falsa. É esse raciocínio de “existe um jeito de dar errado?” que separa o que é certo do que é apenas provável."
    ],
    "workedExamples": [
     {
      "prompt": "Premissas: “Todo processo digitalizado está arquivado no sistema” e “Algum processo urgente é digitalizado”. Podemos concluir necessariamente que algum processo urgente está arquivado no sistema?",
      "steps": [
       "Chame de D os digitalizados, S os arquivados no sistema e U os urgentes. Premissa 1: D⊆S, ou seja, a região “só D” e a região “D e U, não S” estão vazias (não há D fora de S).",
       "Premissa 2: existe pelo menos um elemento em U∩D. Esse elemento só pode estar nas regiões em que há D e U. Como D fora de S é proibido, a região de “D e U, não S” está vazia; sobra a região “D, U e S”. Marque ali um elemento.",
       "Esse elemento é urgente e está arquivado no sistema, portanto U∩S não é vazio.",
       "Teste de contraexemplo: tentei montar uma situação em que as duas premissas valem e a conclusão falha, e não existe nenhuma."
      ],
      "answer": "Sim, a conclusão é necessária: algum processo urgente está arquivado no sistema."
     },
     {
      "prompt": "Premissas: “Todo A é B”, “Nenhum B é C” e “Algum D é A”. Avalie as conclusões: (1) algum D não é C; (2) algum D é B; (3) nenhum D é C; (4) algum D é C.",
      "steps": [
       "Do primeiro e do segundo enunciados: A⊆B e B∩C é vazio. Logo, A∩C é vazio: nenhum elemento de A pode estar em C.",
       "Da terceira premissa: existe pelo menos um elemento x em D∩A. Como x está em A, está em B (A⊆B) e não está em C (B e C separados).",
       "(1) algum D não é C: o elemento x é D e não é C. Necessária. (2) algum D é B: x é D e é B. Necessária.",
       "(3) nenhum D é C: nada impede que outro elemento de D, fora de A e fora de B, esteja em C. Contraexemplo: um elemento só em A, B e D e outro só em C e D. As três premissas valem e “nenhum D é C” é falsa. Logo, (3) não é necessária. (4) algum D é C: em uma situação em que todos os D estão em A e B, “algum D é C” é falsa; logo (4) também não é necessária.",
       "Verificação por enumeração das 65.536 combinações possíveis de regiões ocupadas com quatro conjuntos: (1) e (2) valem em todas as combinações que respeitam as premissas; (3) e (4) falham em pelo menos uma."
      ],
      "answer": "São necessárias (1) e (2); (3) e (4) não são necessárias."
     }
    ],
    "tables": [
     {
      "caption": "As oito regiões de um diagrama com três conjuntos",
      "headers": [
       "Nº",
       "Região",
       "Está em"
      ],
      "rows": [
       [
        "1",
        "Fora dos três",
        "nenhum dos três"
       ],
       [
        "2",
        "Só A",
        "A"
       ],
       [
        "3",
        "Só B",
        "B"
       ],
       [
        "4",
        "Só C",
        "C"
       ],
       [
        "5",
        "A e B, não C",
        "A, B"
       ],
       [
        "6",
        "A e C, não B",
        "A, C"
       ],
       [
        "7",
        "B e C, não A",
        "B, C"
       ],
       [
        "8",
        "Os três (A, B e C)",
        "A, B, C"
       ]
      ]
     }
    ]
   },
   {
    "capitulo": 3,
    "development": [
     "A mesma ideia pode ser escrita de várias formas, e os enunciados gostam de trocar a roupagem. “Todo A é B” equivale a “Nenhum A é não B” (não existe A fora de B) e também à contrapositiva “Todo não B é não A” (quem está fora de B está fora de A). Por outro lado, não equivale a “Todo B é A” (a recíproca) nem a “Algum A é B”. Para ter segurança, leia a frase como uma regra de proibição: “todo A é B” proíbe a região “A, não B” e só isso. Qualquer frase que proíba exatamente essa região é equivalente; qualquer outra que proíba mais ou menos é diferente.",
     "A troca de posições entre sujeito e predicado, chamada conversão, só funciona em dois casos: “Algum A é B” é equivalente a “Algum B é A”, e “Nenhum A é B” é equivalente a “Nenhum B é A”, porque ambas falam apenas da interseção, que é simétrica. “Todo A é B” e “Algum A não é B” não podem ser invertidas, porque falam de uma parte de A em relação a B, e o inverso fala de uma parte de B em relação a A, que é outra coisa."
    ],
    "workedExamples": [
     {
      "prompt": "Considere a frase “Todo analista concursado é servidor efetivo”. Quais destas frases são equivalentes a ela? (1) Nenhum analista concursado é servidor não efetivo; (2) Todo servidor não efetivo é não analista concursado; (3) Todo servidor efetivo é analista concursado; (4) Algum analista concursado é servidor efetivo.",
      "steps": [
       "Chame de A os analistas concursados e de E os servidores efetivos. A frase original proíbe uma única região: “A, não E” (analista concursado que não é efetivo).",
       "(1) “Nenhum A é não E” proíbe a região em que há A e não E: é a mesma região. Equivalente.",
       "(2) “Todo não E é não A” proíbe a região “não E e A”, a mesma de novo. Equivalente (é a contrapositiva).",
       "(3) “Todo E é A” proíbe “E, não A”, que é outra região; não é equivalente. (4) “Algum A é E” exige que exista alguém em “A e E”; a original, que só proíbe, não garante isso (A pode ser vazio). Não é equivalente; nem mesmo é consequência.",
       "Conferência por enumeração das combinações de regiões ocupadas: (1) e (2) coincidem com a original em todas elas; (3) e (4) divergem em pelo menos uma."
      ],
      "answer": "São equivalentes à frase original (1) e (2)."
     },
     {
      "prompt": "Avalie as conclusões, uma de cada vez. (1) “Nenhum A é B” e “algum C é A” permitem concluir que algum C não é B? (2) “Todo A é B” e “algum A não é C” permitem concluir que algum B não é C? (3) “Algum A não é B” e “todo B é C” permitem concluir que algum A não é C?",
      "steps": [
       "(1) Seja x um C que está em A. Como A e B não têm elemento em comum, x não está em B. Logo, x é um C que não é B. Conclusão necessária.",
       "(2) Seja y um A que não está em C. Como todo A é B, y está em B. Então y é um B que não está em C. Conclusão necessária.",
       "(3) Seja z um A que não está em B. Sabemos que B está dentro de C, mas z está fora de B e nada o impede de estar em C. Contraexemplo: um único elemento que está em A e em C, mas não em B. Premissas: algum A não é B (é esse elemento) e todo B é C (B é vazio, então a inclusão vale). Conclusão: algum A não é C é falsa, pois esse elemento está em C.",
       "Conferência por enumeração das combinações de regiões: (1) e (2) valem em todas as combinações compatíveis com as premissas; para (3), a única região ocupada ‘A e C, não B’ já basta como contraexemplo."
      ],
      "answer": "(1) necessária; (2) necessária; (3) não é necessária."
     }
    ],
    "tables": [
     {
      "caption": "O que pode ser invertido",
      "headers": [
       "Frase",
       "Inverso (sujeito e predicado trocados)",
       "Equivalente?"
      ],
      "rows": [
       [
        "Todo A é B",
        "Todo B é A",
        "Não"
       ],
       [
        "Nenhum A é B",
        "Nenhum B é A",
        "Sim"
       ],
       [
        "Algum A é B",
        "Algum B é A",
        "Sim"
       ],
       [
        "Algum A não é B",
        "Algum B não é A",
        "Não"
       ]
      ]
     }
    ]
   },
   {
    "capitulo": 4,
    "development": [
     "Duas frases são contraditórias quando uma é verdadeira exatamente quando a outra é falsa: nunca as duas verdadeiras, nunca as duas falsas. É isso que a negação exige. Já “Todo A é B” e “Nenhum A é B” parecem opostas à primeira vista, mas não são contraditórias: podem ser falsas ao mesmo tempo: basta que A tenha um elemento em B e outro fora de B. Por isso, quando o enunciado pede a negação de “Todo A é B”, a resposta correta é “Algum A não é B”, e “Nenhum A é B” é uma armadilha clássica. Outras expressões equivalentes a “algum A não é B” são “nem todo A é B” e “existe A que não é B”.",
     "Fique atento às formas indiretas. “Não existe A que não seja B” equivale a “Todo A é B”, porque a dupla negação se cancela. “Só os efetivos votam” equivale a “Todo que vota é efetivo” (e não ao contrário): a palavra “só” aponta para o predicado. “Todos os A são B, exceto os C” exige separar dois casos. Antes de negar qualquer frase longa, reescreva-a em uma das quatro formas básicas; só então aplique a troca. Negar o que ainda está em linguagem corrida é o caminho mais curto para erro."
    ],
    "workedExamples": [
     {
      "prompt": "Dê a negação de “Não existe técnico que não tenha concluído o treinamento”.",
      "steps": [
       "Reescreva a frase original. “Não existe técnico que não concluiu” é a negação de “existe técnico que não concluiu”; logo, equivale a “Todo técnico concluiu o treinamento”.",
       "Negue essa forma básica: a negação de “Todo T é C” é “Algum T não é C”.",
       "Em palavras: “Existe pelo menos um técnico que não concluiu o treinamento”. Note que a negação da frase original é, simplesmente, a frase que ela mesma negava: tirar duas negações devolve o enunciado interno.",
       "Verificação: em todas as 16 combinações possíveis de regiões ocupadas com dois conjuntos (técnicos e concluintes), “algum técnico não concluiu” é verdadeira exatamente quando “todo técnico concluiu” é falsa."
      ],
      "answer": "Existe pelo menos um técnico que não concluiu o treinamento."
     },
     {
      "prompt": "Dê a negação de “Todo servidor da unidade é concursado e algum concursado é técnico”.",
      "steps": [
       "A frase é uma conjunção (∧) de duas proposições: P = “Todo servidor é concursado” e Q = “Algum concursado é técnico”. A negação de P∧Q é ¬P∨¬Q (lei de De Morgan).",
       "¬P: negação de “Todo S é C” é “Algum servidor não é concursado”. ¬Q: negação de “Algum C é T” é “Nenhum concursado é técnico”.",
       "Juntando com ‘ou’: “Algum servidor da unidade não é concursado ou nenhum concursado é técnico”.",
       "Verificação: com três conjuntos (S, C, T) há 256 combinações de regiões ocupadas; em todas elas a frase original e a negação encontrada têm valores opostos, nunca iguais."
      ],
      "answer": "Algum servidor da unidade não é concursado ou nenhum concursado é técnico."
     }
    ],
    "tables": [
     {
      "caption": "Pares de frases com os mesmos conjuntos A e B",
      "headers": [
       "Par",
       "Podem ser as duas verdadeiras?",
       "Podem ser as duas falsas?",
       "Relação"
      ],
      "rows": [
       [
        "Todo A é B / Algum A não é B",
        "Não",
        "Não",
        "Contraditórias"
       ],
       [
        "Nenhum A é B / Algum A é B",
        "Não",
        "Não",
        "Contraditórias"
       ],
       [
        "Todo A é B / Nenhum A é B",
        "Sim, se A for vazio",
        "Sim, se A tiver elementos dentro e fora de B",
        "Não são contraditórias"
       ],
       [
        "Algum A é B / Algum A não é B",
        "Sim",
        "Sim, se A for vazio",
        "Não são contraditórias"
       ]
      ]
     }
    ]
   },
   {
    "capitulo": 5,
    "development": [
     "Ao ler dados de contagem, lembre que “30 falam inglês” significa 30 no total do conjunto, incluindo os que também falam outra língua. Para falar de quem só faz uma coisa, o texto usa “apenas”, “somente” ou “exclusivamente”. O valor dado para uma interseção também costuma ser total: “14 falam inglês e espanhol” inclui os que falam as duas e mais uma terceira. Quando só há dois conjuntos, vale |A∩B| = |A| + |B| − |A∪B|, que é a mesma fórmula da união lida ao contrário. Isso permite achar a interseção a partir do total e do “nenhum”.",
     "Quando a interseção não é informada, ela pode ser limitada. Com dois conjuntos num universo de N elementos, a interseção é no máximo o menor dos dois (min(|A|, |B|)), situação em que um conjunto fica dentro do outro. E é no mínimo |A| + |B| − N se esse valor for positivo, ou zero caso contrário, situação em que a união ocupa o universo inteiro ou os conjuntos podem ficar totalmente separados. Esses limites aparecem em enunciados com “no mínimo” e “no máximo”: o extremo sempre corresponde a juntar ao máximo ou a espalhar ao máximo os elementos."
    ],
    "workedExamples": [
     {
      "prompt": "Em um grupo de 48 servidores, 30 falam inglês, 20 falam espanhol e 12 não falam nenhum dos dois idiomas. Quantos falam os dois? Quantos falam apenas inglês?",
      "steps": [
       "Quem fala pelo menos um dos idiomas: 48 − 12 = 36.",
       "Usando |I∪E| = |I| + |E| − |I∩E|: 36 = 30 + 20 − |I∩E|, ou seja, |I∩E| = 50 − 36 = 14.",
       "Apenas inglês: 30 − 14 = 16. Apenas espanhol: 20 − 14 = 6.",
       "Conferência pelas regiões: 16 + 14 + 6 + 12 = 48, que é o total do grupo. (Verificado com conjuntos reais de números: 30 e 20 elementos, 14 comuns, união com 36.)"
      ],
      "answer": "14 servidores falam os dois idiomas e 16 falam apenas inglês."
     },
     {
      "prompt": "Numa pesquisa com 90 pessoas sobre três serviços (A, B e C), obteve-se: 20 usam apenas A, 15 apenas B e 10 apenas C; 14 usam A e B (incluindo quem usa também C), 11 usam A e C, 9 usam B e C e 5 usam os três. Quantas usam exatamente dois serviços? Quantas não usam nenhum? Quantas usam o serviço A?",
      "steps": [
       "Retire a região tripla das interseções duplas. Só A e B: 14 − 5 = 9. Só A e C: 11 − 5 = 6. Só B e C: 9 − 5 = 4.",
       "Exatamente dois serviços: 9 + 6 + 4 = 19.",
       "Soma das regiões: 20 + 15 + 10 + 9 + 6 + 4 + 5 = 69 usam pelo menos um serviço. Nenhum: 90 − 69 = 21.",
       "Usuários de A: some todas as regiões que contêm A (só A, A e B, A e C e os três): 20 + 9 + 6 + 5 = 40.",
       "Conferência: com conjuntos reais montados a partir dessas regiões, |A|=40, |B|=33, |C|=25 e a união tem 69 pessoas."
      ],
      "answer": "19 usam exatamente dois serviços; 21 não usam nenhum; 40 usam o serviço A."
     }
    ],
    "tables": [
     {
      "caption": "Dois conjuntos: como ler cada expressão",
      "headers": [
       "Expressão no texto",
       "Região",
       "Conta"
      ],
      "rows": [
       [
        "Os dois",
        "A∩B",
        "|A| + |B| − |A∪B|"
       ],
       [
        "Apenas A",
        "A − B",
        "|A| − |A∩B|"
       ],
       [
        "Pelo menos um",
        "A∪B",
        "|A| + |B| − |A∩B|"
       ],
       [
        "Nenhum dos dois",
        "fora da união",
        "N − |A∪B|"
       ],
       [
        "Exatamente um",
        "(A−B) e (B−A)",
        "|A| + |B| − 2|A∩B|"
       ]
      ]
     }
    ]
   }
  ],
  "novosCapitulos": [
   {
    "title": "Operações com conjuntos e inclusão-exclusão",
    "paragraphs": [
     "As quatro operações básicas respondem a perguntas em português. A união A∪B reúne quem está em A ou em B, ou nos dois (o “ou” da lógica inclui os dois). A interseção A∩B reúne quem está em A e em B ao mesmo tempo. A diferença A−B reúne quem está em A e não está em B. O complementar de A, escrito A^c (o c lembra “complementar”), reúne todos os elementos do universo U que não estão em A. Traduzir a pergunta do enunciado para uma dessas operações é o primeiro passo de qualquer contagem: “fizeram pelo menos um curso” é união, “fizeram os dois” é interseção, “só o primeiro” é diferença, “nenhum” é complementar da união.",
     "A contagem dessas operações segue duas ideias. A primeira: quando dois grupos não têm elemento em comum, o número de elementos da união é a soma. A segunda: quando têm, a soma conta duas vezes quem está nos dois, e é preciso descontar uma vez. Daí |A∪B| = |A| + |B| − |A∩B|. Com três conjuntos o argumento continua: um elemento que está nos três entra três vezes na soma |A|+|B|+|C|; ao subtrair as três interseções duplas, ele sai três vezes e passa a contar zero; por isso soma-se de volta a interseção tripla uma vez. O resultado é |A∪B∪C| = |A|+|B|+|C| − |A∩B| − |A∩C| − |B∩C| + |A∩B∩C|, e cada elemento, esteja onde estiver, é contado exatamente uma vez.",
     "O complementar liga tudo ao universo: |A^c| = |U| − |A|. As leis de De Morgan para conjuntos dizem que o complementar de (A∪B) é A^c ∩ B^c (quem não está em nenhum dos dois não está em A e não está em B) e que o complementar de (A∩B) é A^c ∪ B^c (quem não está nos dois está fora de pelo menos um). Na prática, “nenhum dos conjuntos” é sempre |U| menos a união, e a conta é feita em duas etapas: primeiro a união por inclusão-exclusão, depois a subtração do total."
    ],
    "example": "Exemplo resolvido: em um grupo de 50 servidores, 30 fizeram o curso de redação oficial, 24 fizeram o de arquivamento e 12 fizeram os dois. Fizeram pelo menos um: 30 + 24 − 12 = 42. Não fizeram nenhum: 50 − 42 = 8.",
    "development": [
     "A união pode ser decomposta em partes que não se sobrepõem: A∪B = (A−B) ∪ (A∩B) ∪ (B−A). Daí vem uma segunda forma da fórmula: |A∪B| = |A−B| + |A∩B| + |B−A|. Também vale |A−B| = |A| − |A∩B|, resultado de tirar de A quem também está em B. Para contar quem está “em exatamente um dos dois”, isto é, a diferença simétrica, some as duas diferenças: |A−B| + |B−A| = |A| + |B| − 2|A∩B|. Repare no 2: os que estão nos dois foram retirados de ambos os conjuntos. Essa fórmula é a que mais aparece em enunciados com “apenas um dos dois”.",
     "Fórmulas inversas são tão importantes quanto a direta. Se o enunciado dá a união e as interseções, a incógnita pode ser a interseção tripla: |A∩B∩C| = |A∪B∪C| − (|A|+|B|+|C|) + (|A∩B|+|A∩C|+|B∩C|). Se dá o universo e o “nenhum”, a união é a diferença entre os dois. Antes de substituir, diga em voz alta o que cada número representa e se ele é total do conjunto ou apenas a parte exclusiva; essa checagem evita a maior parte dos erros de sinal."
    ],
    "method": [
     "Escreva o universo e os conjuntos com nomes curtos, anotando quais números são totais de conjunto e quais são interseções.",
     "Traduza a pergunta do enunciado para uma operação: união, interseção, diferença ou complementar.",
     "Aplique a fórmula de inclusão-exclusão adequada (dois ou três conjuntos), mostrando cada soma e cada subtração.",
     "Se for pedido “nenhum”, subtraia a união do universo; se for pedido “só um”, tire dos totais as interseções.",
     "Confira somando as regiões exclusivas: o resultado deve ser igual ao universo."
    ],
    "workedExamples": [
     {
      "prompt": "Em um grupo de 40 servidores, 25 fizeram o curso de atendimento, 18 fizeram o curso de gestão de processos e 9 fizeram os dois. Quantos fizeram pelo menos um dos cursos? Quantos não fizeram nenhum? Quantos fizeram apenas o curso de atendimento?",
      "steps": [
       "Seja A o conjunto de atendimento e G o de gestão: |A| = 25, |G| = 18, |A∩G| = 9.",
       "Pelo menos um: |A∪G| = 25 + 18 − 9 = 34.",
       "Nenhum: 40 − 34 = 6.",
       "Apenas atendimento: 25 − 9 = 16. Apenas gestão: 18 − 9 = 9. Conferência: 16 + 9 + 9 + 6 = 40.",
       "Verificação por conjuntos reais (numerando os 40 servidores): união com 34, fora com 6, só atendimento com 16."
      ],
      "answer": "34 fizeram pelo menos um curso; 6 não fizeram nenhum; 16 fizeram apenas o curso de atendimento."
     },
     {
      "prompt": "Em 60 processos de um lote, 35 têm pedido de liminar, 28 têm recurso pendente e 13 têm as duas coisas. Quantos processos têm exatamente uma dessas características? Quantos não têm nenhuma?",
      "steps": [
       "Sejam L os processos com liminar e R os com recurso: |L| = 35, |R| = 28, |L∩R| = 13.",
       "Só liminar: 35 − 13 = 22. Só recurso: 28 − 13 = 15.",
       "Exatamente uma: 22 + 15 = 37. Pela fórmula da diferença simétrica: 35 + 28 − 2 × 13 = 63 − 26 = 37 (mesmo resultado).",
       "União: 22 + 15 + 13 = 50 (ou 35 + 28 − 13 = 50). Nenhuma: 60 − 50 = 10."
      ],
      "answer": "37 processos têm exatamente uma das características; 10 não têm nenhuma."
     },
     {
      "prompt": "De 100 processos, 15 não estão em nenhuma das três filas A, B e C. Sabe-se que |A| = 45, |B| = 38, |C| = 30, que 15 estão em A e B, 12 em A e C e 10 em B e C (esses números incluem quem está nas três filas). Quantos processos estão nas três filas? Quantos estão apenas na fila A?",
      "steps": [
       "Pelo menos uma fila: 100 − 15 = 85.",
       "Inclusão-exclusão: 85 = 45 + 38 + 30 − 15 − 12 − 10 + x, onde x = |A∩B∩C|. Somando os totais: 45 + 38 + 30 = 113; somando as interseções duplas: 15 + 12 + 10 = 37.",
       "Então 85 = 113 − 37 + x = 76 + x, e x = 85 − 76 = 9.",
       "Apenas A: |A| − |A∩B| − |A∩C| + |A∩B∩C| = 45 − 15 − 12 + 9 = 27. (Retira-se a tripla duas vezes ao subtrair as duplas, por isso soma-se uma vez de volta.)",
       "Conferência com as regiões: só A 27; só B 22 (38 − 15 − 10 + 9); só C 17 (30 − 12 − 10 + 9); só A e B 6; só A e C 3; só B e C 1; as três 9: 27 + 22 + 17 + 6 + 3 + 1 + 9 = 85. Verificado com conjuntos reais."
      ],
      "answer": "9 processos estão nas três filas; 27 estão apenas na fila A."
     }
    ],
    "pitfall": "Usar |A| + |B| como se fosse a união, ou subtrair a interseção tripla quando a fórmula pede somá-la. Antes de fechar a conta, pergunte se algum elemento foi contado duas vezes (falta subtrair) ou se foi retirado vezes demais (falta somar de volta).",
    "tables": [
     {
      "caption": "Operações e sua leitura",
      "headers": [
       "Operação",
       "Leitura em português",
       "Contagem"
      ],
      "rows": [
       [
        "A∪B",
        "pelo menos um dos dois",
        "|A|+|B|−|A∩B|"
       ],
       [
        "A∩B",
        "os dois ao mesmo tempo",
        "dado ou deduzido"
       ],
       [
        "A−B",
        "só A, não B",
        "|A|−|A∩B|"
       ],
       [
        "A^c",
        "fora de A, no universo U",
        "|U|−|A|"
       ],
       [
        "(A∪B)^c",
        "nenhum dos dois",
        "|U|−|A∪B|"
       ],
       [
        "exatamente um dos dois",
        "só A ou só B",
        "|A|+|B|−2|A∩B|"
       ]
      ]
     }
    ],
    "resumo": {
     "title": "Inclusão-exclusão",
     "text": "Para dois conjuntos, |A∪B| = |A|+|B|−|A∩B|; para três, some as três interseções duplas com sinal de menos e some de volta a tripla. Nenhum = universo menos união.",
     "bizu": "Cada elemento deve ser contado exatamente uma vez."
    }
   },
   {
    "title": "Problemas de pesquisa com três conjuntos",
    "paragraphs": [
     "Pesquisas costumam informar, para três categorias, os totais de cada uma, as interseções duas a duas e a tripla, e perguntam por grupos como “exatamente um”, “exatamente dois” ou “nenhum”. O diagrama de Venn de três conjuntos tem oito regiões, e é útil numerá-las: 1 fora dos três; 2 só A; 3 só B; 4 só C; 5 A e B, não C; 6 A e C, não B; 7 B e C, não A; 8 os três. Todo problema se resolve descobrindo quantas pessoas existem em cada uma dessas regiões. As oito somam o universo, e é essa soma que serve de conferência final.",
     "A ordem de preenchimento é de dentro para fora. Primeiro a região 8, a interseção tripla. Depois as regiões duplas exclusivas: o total de “A e B” menos a tripla dá a região 5, e assim para 6 e 7. Em seguida, as regiões exclusivas de cada conjunto: o total de A menos as regiões 5, 6 e 8 dá a região 2, e assim por diante. Por fim, a região 1 é o universo menos tudo o que já foi preenchido. Se o enunciado trouxer números já exclusivos (“apenas A”), anote-os diretamente na região correspondente e pule a etapa de subtração.",
     "As perguntas finais são somas de regiões. “Pelo menos um” é de 2 a 8. “Exatamente um” é 2 + 3 + 4. “Exatamente dois” é 5 + 6 + 7. “Pelo menos dois” é 5 + 6 + 7 + 8. “No máximo um” é 1 + 2 + 3 + 4. “Nenhum” é a região 1. Há ainda um resultado auxiliar elegante: a soma |A|+|B|+|C| conta cada pessoa tantas vezes quantos conjuntos ela integra, ou seja, é igual a (exatamente um) + 2 × (exatamente dois) + 3 × (os três). Isso resolve, de uma só vez, enunciados que dão o “total de respostas” em vez de totais individuais."
    ],
    "example": "Exemplo resolvido: em 50 pessoas, as regiões têm: só A 10, só B 8, só C 6, A e B 5, A e C 4, B e C 3 e os três 2. Pelo menos um: 10+8+6+5+4+3+2 = 38. Nenhum: 50 − 38 = 12. Exatamente dois: 5+4+3 = 12.",
    "development": [
     "Cuidado com a leitura das palavras. “Pelo menos dois” inclui quem está nos três; “exatamente dois” não inclui. “Somente A e B” exclui C; “A e B” sem mais nada normalmente inclui os que também estão em C, e o enunciado costuma avisar quando é o caso. Se a frase diz “usam A, mas não B”, a região é a soma de 2 e 6: só A mais A e C. Escreva a pergunta em termos de números de regiões antes de começar as contas. Quando o enunciado não é claro sobre ser total ou exclusivo, adote o total e informe isso na resolução.",
     "Há dois tipos de problemas com incógnitas. No primeiro, uma região desconhecida é determinada pela soma total, como no exemplo da interseção tripla com a união conhecida. No segundo, o enunciado dá o número de pessoas em “no mínimo k grupos” ou a soma de respostas, e é preciso montar equações com as variáveis “exatamente um”, “exatamente dois” e “os três”. Em ambos, resista à tentação de chutar valores: escreva o sistema, resolva-o e depois confira se todas as regiões são números inteiros não negativos."
    ],
    "method": [
     "Numere as oito regiões e escreva ao lado o que cada uma significa.",
     "Anote a interseção tripla (região 8) e subtraia-a de cada interseção dupla para obter as regiões 5, 6 e 7.",
     "Calcule as regiões exclusivas 2, 3 e 4 tirando do total de cada conjunto as regiões em que ele aparece com outros.",
     "Calcule a região 1 (nenhum) como o universo menos a soma das regiões de 2 a 8.",
     "Responda somando as regiões correspondentes à pergunta e confira se as oito somam o universo."
    ],
    "workedExamples": [
     {
      "prompt": "Em um órgão com 120 servidores, 60 usam o sistema X, 50 usam o sistema Y e 40 usam o sistema Z. Dos servidores, 20 usam X e Y, 15 usam X e Z, 18 usam Y e Z e 8 usam os três (os números de interseção incluem quem usa também o terceiro sistema). Quantos usam exatamente um sistema? Exatamente dois? Pelo menos dois? Nenhum?",
      "steps": [
       "Região 8 (três sistemas): 8. Região 5 (X e Y, não Z): 20 − 8 = 12. Região 6 (X e Z, não Y): 15 − 8 = 7. Região 7 (Y e Z, não X): 18 − 8 = 10.",
       "Região 2 (só X): 60 − 12 − 7 − 8 = 33. Região 3 (só Y): 50 − 12 − 10 − 8 = 20. Região 4 (só Z): 40 − 7 − 10 − 8 = 15.",
       "Exatamente um: 33 + 20 + 15 = 68. Exatamente dois: 12 + 7 + 10 = 29. Pelo menos dois: 29 + 8 = 37.",
       "Pelo menos um sistema: 68 + 29 + 8 = 105. Nenhum: 120 − 105 = 15.",
       "Conferência: a soma dos totais, 60 + 50 + 40 = 150, deve ser igual a (exatamente um) + 2 × (exatamente dois) + 3 × (os três) = 68 + 58 + 24 = 150. Confere, e a conta foi verificada com conjuntos reais."
      ],
      "answer": "68 usam exatamente um sistema; 29 exatamente dois; 37 pelo menos dois; 15 não usam nenhum."
     },
     {
      "prompt": "Em um grupo de 100 servidores, 10 não fizeram nenhum dos cursos X, Y e Z. Entre os demais, 38 fizeram exatamente dois cursos. A soma das matrículas, contando cada servidor uma vez para cada curso feito, é 150. Quantos fizeram exatamente um curso? Quantos fizeram os três?",
      "steps": [
       "Sejam u = quantos fizeram exatamente um, t = quantos fizeram os três. Quem fez pelo menos um curso: 100 − 10 = 90, logo u + 38 + t = 90, ou seja, u + t = 52.",
       "Cada pessoa conta uma vez por curso: u + 2 × 38 + 3t = 150, isto é, u + 3t = 150 − 76 = 74.",
       "Subtraindo a primeira equação da segunda: (u + 3t) − (u + t) = 74 − 52, logo 2t = 22 e t = 11. Então u = 52 − 11 = 41.",
       "Conferência: 41 + 2 × 38 + 3 × 11 = 41 + 76 + 33 = 150, e 41 + 38 + 11 + 10 = 100. Foi confirmado por busca em todas as possibilidades inteiras: a única solução é essa, e existe distribuição pelas regiões que a realiza."
      ],
      "answer": "41 servidores fizeram exatamente um curso e 11 fizeram os três."
     },
     {
      "prompt": "Em um grupo de 100 servidores, 80 usam o sistema A, 70 usam o sistema B e 60 usam o sistema C. Qual é o menor número possível de servidores que usam os três sistemas? E o maior?",
      "steps": [
       "Raciocínio do mínimo: quem não usa A são 100 − 80 = 20; quem não usa B, 100 − 70 = 30; quem não usa C, 100 − 60 = 40. No máximo, 20 + 30 + 40 = 90 servidores deixam de usar pelo menos um sistema (se os grupos de ‘não usam’ não se sobrepuserem).",
       "Os demais usam os três: pelo menos 100 − 90 = 10. Esse mínimo é alcançável: 40 usam só A e B, 30 só A e C, 20 só B e C e 10 usam os três. Conferência: A = 40 + 30 + 10 = 80; B = 40 + 20 + 10 = 70; C = 30 + 20 + 10 = 60; total 40 + 30 + 20 + 10 = 100.",
       "Raciocínio do máximo: os três juntos não podem ser mais que o menor conjunto, 60. Alcançável: 60 usam os três, 20 usam só A, 10 só B e 10 não usam nenhum. Conferência: A = 60 + 20 = 80; B = 60 + 10 = 70; C = 60.",
       "Verificação por busca exaustiva em todas as divisões possíveis das oito regiões: o menor valor da região tripla é 10 e o maior é 60."
      ],
      "answer": "No mínimo 10 e no máximo 60 servidores usam os três sistemas."
     }
    ],
    "pitfall": "Somar os totais das interseções duplas sem descontar a região tripla e, com isso, contar de mais os que estão nos três. Sempre subtraia a tripla de cada dupla antes de falar em “exatamente dois”.",
    "tables": [
     {
      "caption": "Perguntas comuns e regiões somadas (numeração: 1 fora; 2 só A; 3 só B; 4 só C; 5 A e B; 6 A e C; 7 B e C; 8 os três)",
      "headers": [
       "Pergunta",
       "Regiões",
       "O que entra"
      ],
      "rows": [
       [
        "Nenhum dos três",
        "1",
        "só quem está fora"
       ],
       [
        "Exatamente um",
        "2 + 3 + 4",
        "só A, só B ou só C"
       ],
       [
        "Exatamente dois",
        "5 + 6 + 7",
        "três tipos de dupla, sem a tripla"
       ],
       [
        "Pelo menos um",
        "2 a 8",
        "tudo menos o fora"
       ],
       [
        "Pelo menos dois",
        "5 + 6 + 7 + 8",
        "as duplas e a tripla"
       ],
       [
        "No máximo um",
        "1 + 2 + 3 + 4",
        "fora ou só um"
       ],
       [
        "A, mas não B",
        "2 + 6",
        "só A e A com C"
       ]
      ]
     }
    ],
    "resumo": {
     "title": "Pesquisa com três conjuntos",
     "text": "Numere as oito regiões, preencha da tripla para fora, subtraindo sempre as regiões já ocupadas, e responda somando as regiões da pergunta.",
     "bizu": "Total de respostas = um + 2×dois + 3×três."
    }
   },
   {
    "title": "Silogismos categóricos e contraexemplos",
    "paragraphs": [
     "Um silogismo categórico tem duas premissas e uma conclusão, todas nas formas “todo”, “nenhum”, “algum” ou “algum não”. Há três termos: o de sujeito da conclusão (S), o de predicado da conclusão (P) e o termo médio (M), que aparece nas duas premissas e some na conclusão. A pergunta típica é sempre a mesma: a conclusão decorre necessariamente das premissas? Isso quer dizer que, em qualquer situação em que as premissas são verdadeiras, a conclusão também é. Não basta ser plausível nem ser verdadeira no mundo real: o conteúdo do exemplo (juízes, processos, servidores) é irrelevante; só importa a forma.",
     "O teste mais confiável é procurar um contraexemplo, isto é, uma situação com elementos concretos em que as premissas são verdadeiras e a conclusão é falsa. Se você acha um, a conclusão não é necessária e o raciocínio acaba. Se, mesmo tentando, nenhuma situação possível consegue tornar a conclusão falsa mantendo as premissas, o argumento é válido. Para três conjuntos, a procura é feita nas oito regiões do diagrama: marque quais regiões as premissas esvaziam, marque as que elas obrigam a ter elemento, e tente ocupar ou esvaziar as demais regiões para derrubar a conclusão.",
     "Há um padrão que explica a maior parte dos erros. Quando as duas premissas afirmam que S e P estão dentro de M (“todo S é M” e “todo P é M”), M é um grupo grande que contém os dois, mas S e P podem estar em partes diferentes dele: não há conclusão. O termo médio precisa funcionar como ponte de verdade, isto é, uma das premissas deve dizer algo sobre todo o M (como “todo M é P” ou “nenhum M é P”). Por isso são válidos os argumentos em cadeia (“todo S é M, todo M é P, logo todo S é P”) e inválidos os que usam o termo médio apenas como destino de ambas as premissas."
    ],
    "example": "Exemplo resolvido: “Todo analista é servidor” e “todo oficial é servidor” não permitem concluir que todo analista é oficial. Contraexemplo: servidores = {1, 2, 3, 4}, analistas = {1, 2}, oficiais = {3, 4}. As premissas valem e a conclusão é falsa.",
    "development": [
     "Os argumentos com premissa existencial (“algum”) exigem cuidado extra: duas premissas “algum” não se combinam. De “algum M é P” e “algum S é M” não se conclui “algum S é P”, porque o M do primeiro “algum” pode ser diferente do M do segundo. Em contraste, uma premissa universal junto a uma existencial funciona bem se a universal fala do termo que a existencial já garantiu: “todo M é P” e “algum S é M” dão “algum S é P”, pois o elemento garantido está em M e, por ser M, está em P. Observe que uma premissa universal sozinha nunca garante existência.",
     "Esse último ponto aparece com “todo M é P” e “todo M é S”: seria tentador concluir “algum S é P”, mas, na leitura adotada aqui (a de que “todo” não obriga a existir algum elemento), M pode ser vazio, e a conclusão falha. Se o enunciado afirmar que existe pelo menos um M (por exemplo, “há ao menos um processo M”), o argumento passa a valer. Resolva sempre perguntando: “o texto me deu a existência de alguém?”. Se não, nenhuma conclusão do tipo “algum” pode sair apenas de premissas “todo” e “nenhum”."
    ],
    "method": [
     "Identifique S, P e M e escreva cada premissa e a conclusão nas formas básicas (todo, nenhum, algum, algum não).",
     "Esvazie as regiões proibidas pelas premissas “todo” e “nenhum” e marque com um elemento as regiões garantidas pelas premissas “algum”.",
     "Tente criar um contraexemplo: ocupe regiões livres de modo a manter as premissas verdadeiras e tornar a conclusão falsa.",
     "Se encontrar o contraexemplo, descreva-o com elementos concretos e conclua que o argumento não é válido; se nenhuma tentativa funcionar, mostre por que a conclusão vale em todos os casos.",
     "Quando houver mais de duas premissas, faça a análise por pares, usando cada conclusão intermediária como nova premissa."
    ],
    "workedExamples": [
     {
      "prompt": "Premissas: “Todo oficial é servidor” e “nenhum servidor é estagiário”. Conclusão proposta: “Nenhum oficial é estagiário”. O argumento é válido?",
      "steps": [
       "Sejam O = oficiais, S = servidores e E = estagiários. Premissas: O⊆S e S∩E = ∅.",
       "Se um oficial fosse estagiário, ele estaria em O e em E. Mas todo oficial está em S, então esse elemento estaria em S e em E, o que a segunda premissa proíbe.",
       "Logo, a região “O e E” está vazia em qualquer situação compatível com as premissas. A conclusão “nenhum O é E” é necessária.",
       "Verificação por enumeração das 256 combinações de regiões com três conjuntos: não há nenhuma que torne as premissas verdadeiras e a conclusão falsa."
      ],
      "answer": "Sim, é válido: nenhum oficial é estagiário."
     },
     {
      "prompt": "Premissas: “Todo A é B” e “todo C é B”. Conclusão proposta: “Todo A é C”. O argumento é válido? Se não for, apresente um contraexemplo concreto.",
      "steps": [
       "Forma do argumento: o termo médio B aparece como predicado nas duas premissas, o que é o padrão que não gera conclusão.",
       "Procure o contraexemplo: tome o universo {1, 2, 3, 4}, B = {1, 2, 3, 4}, A = {1, 2} e C = {3, 4}.",
       "Teste das premissas: A está inteiro em B (verdadeiro); C está inteiro em B (verdadeiro). Teste da conclusão: todo A é C? O elemento 1 está em A e não está em C. A conclusão é falsa.",
       "Descrição por regiões: as regiões ocupadas são “A e B, não C” e “B e C, não A”. Um contraexemplo ainda mais simples também serve: um único elemento em A e B, com C vazio (as duas premissas valem e “todo A é C” é falsa)."
      ],
      "answer": "Não é válido; contraexemplo: B = {1, 2, 3, 4}, A = {1, 2}, C = {3, 4}."
     },
     {
      "prompt": "Premissas: (1) “Algum A é B”; (2) “todo B é C”; (3) “nenhum C é D”. Avalie as conclusões: (1) algum A é C; (2) algum A não é D; (3) algum C é A; (4) todo A é C; (5) algum D é B; (6) nenhum D é B.",
      "steps": [
       "Cadeia principal: seja x um elemento de A e B (premissa 1). Como x ∈ B e todo B é C, x ∈ C. Como nenhum C é D, x ∉ D. Em resumo, x está em A, B e C e fora de D.",
       "(1) algum A é C: x serve. Necessária. (2) algum A não é D: x serve. Necessária. (3) algum C é A: x está em C e em A. Necessária.",
       "(4) todo A é C: a premissa 1 fala só de um A. Contraexemplo: universo com dois elementos, x em A, B e C, e y em A apenas. Todas as premissas valem e “todo A é C” é falsa por causa de y. Não é necessária.",
       "(5) algum D é B: se algum D fosse B, estaria em C (todo B é C), mas nenhum C é D. Impossível: “algum D é B” é necessariamente falsa. Logo, não é necessária (e não pode ser verdadeira). (6) nenhum D é B: pelo mesmo raciocínio, é necessária.",
       "Conferência por enumeração das 65.536 combinações de regiões com quatro conjuntos: (1), (2), (3) e (6) valem sempre; (4) e (5) falham em pelo menos uma."
      ],
      "answer": "São necessárias (1), (2), (3) e (6); (4) não é necessária e (5) é necessariamente falsa."
     }
    ],
    "pitfall": "Aceitar uma conclusão porque ela parece razoável, ou porque os elementos reais combinam (por exemplo, “todo analista é servidor”). A validade depende só da forma: se existe uma situação em que as premissas valem e a conclusão não, o argumento é inválido. Teste sempre com um contraexemplo antes de aceitar a conclusão.",
    "tables": [
     {
      "caption": "Argumentos de duas premissas (S, M e P)",
      "headers": [
       "Premissas",
       "Conclusão",
       "Vale necessariamente?"
      ],
      "rows": [
       [
        "Todo M é P; todo S é M",
        "Todo S é P",
        "Sim"
       ],
       [
        "Nenhum M é P; todo S é M",
        "Nenhum S é P",
        "Sim"
       ],
       [
        "Todo M é P; algum S é M",
        "Algum S é P",
        "Sim"
       ],
       [
        "Nenhum M é P; algum S é M",
        "Algum S não é P",
        "Sim"
       ],
       [
        "Todo P é M; todo S é M",
        "Todo S é P",
        "Não"
       ],
       [
        "Algum M é P; algum S é M",
        "Algum S é P",
        "Não"
       ],
       [
        "Todo M é P; todo M é S",
        "Algum S é P",
        "Não"
       ]
      ]
     }
    ],
    "resumo": {
     "title": "Silogismos e contraexemplo",
     "text": "Uma conclusão é necessária só se nenhuma situação possível torna as premissas verdadeiras e ela falsa; um único contraexemplo derruba o argumento.",
     "bizu": "Duas premissas “algum”, ou termo médio sempre como predicado, não geram conclusão."
    }
   }
  ]
 },
 "M06": {
  "extras": [
   {
    "capitulo": 1,
    "development": [
     "O primeiro cuidado em qualquer problema de associação é descobrir que tipo de relação o enunciado descreve. Se aparece “cada um ocupa um cargo diferente” e há tantos cargos quanto pessoas, a relação é um a um: cada escolha confirmada elimina o resto da linha e da coluna. Se o texto diz apenas “cada setor funciona em um de dois turnos”, vários setores podem dividir o mesmo turno, e a eliminação por linha e coluna deixa de valer; nesse caso você trabalha casa a casa e usa as pistas de contagem. Há ainda o caso de haver mais itens do que pessoas: então alguns itens ficam sem dono, e nenhuma pessoa pode ser forçada a receber o item “que sobrou”.",
     "Depois de resolver, faça sempre a conferência final: releia as pistas na ordem do enunciado e teste cada uma na distribuição encontrada. Esse hábito pega dois tipos de erro: a pista que você esqueceu de usar e a pista que você leu de forma mais forte do que ela é (por exemplo, “antes” entendido como “imediatamente antes”). Se, ao conferir, uma pista falhar, a solução está errada, mesmo que tenha “fechado” bonito. Se todas passarem e o problema afirmar que a solução é única, você terminou."
    ],
    "workedExamples": [
     {
      "prompt": "Quatro setores do tribunal (Protocolo, Arquivo, Cartório e Distribuição) funcionam, cada um, em um de dois turnos: manhã ou tarde. Mais de um setor pode funcionar no mesmo turno. Sabe-se que: (1) Arquivo e Cartório funcionam no mesmo turno; (2) a Distribuição funciona de manhã; (3) exatamente dois dos quatro setores funcionam de manhã. Em que turno funciona cada setor?",
      "steps": [
       "O enunciado permite repetição de turno, então não vale eliminar linha e coluna: cada setor recebe um de dois valores, ao todo 2^4 = 16 combinações possíveis. A tabela serve só para registrar o que já é certo.",
       "Já é certo: Distribuição = manhã. Falta decidir o Protocolo e o par Arquivo/Cartório, que anda junto pela pista 1.",
       "Hipótese: o par Arquivo/Cartório funciona de manhã. Então haveria três setores de manhã (Arquivo, Cartório e Distribuição), contra a pista 3, que diz exatamente dois. Hipótese descartada: o par funciona à tarde.",
       "Com o par à tarde, de manhã só há a Distribuição. Para chegar a exatamente dois setores de manhã, o Protocolo também funciona de manhã.",
       "Conferência: manhã = Protocolo e Distribuição (dois setores, pista 3); Arquivo e Cartório juntos à tarde (pista 1); Distribuição de manhã (pista 2)."
      ],
      "answer": "Protocolo e Distribuição funcionam de manhã; Arquivo e Cartório funcionam à tarde."
     },
     {
      "prompt": "Os servidores Marta, Nuno, Olga e Paulo ocupam, cada um, um cargo diferente (Analista, Técnico, Oficial e Auxiliar) e uma sala diferente entre 101, 102, 103 e 104. Sabe-se que: (1) Paulo ocupa sala de número menor que a do Técnico; (2) Paulo ocupa sala de número menor que a do Auxiliar; (3) o Analista ocupa sala de número menor que a de Paulo; (4) Nuno não ocupa a sala 104; (5) Marta não é a Analista; (6) Marta ocupa sala de número menor que a do Auxiliar. Determine o cargo e a sala de cada um.",
      "steps": [
       "As três categorias (pessoa, cargo, sala) são exclusivas. Comparar salas exige duas pessoas diferentes: pelas pistas 1, 2 e 3, Paulo não é o Técnico, nem o Auxiliar, nem o Analista. Sobra o cargo de Oficial: Paulo é o Oficial.",
       "Cadeia de salas: Analista < Paulo < Técnico e Auxiliar. Abaixo de Paulo só cabe o Analista, e acima dele cabem o Técnico e o Auxiliar. Logo, Analista = 101, Paulo = 102, e o Técnico e o Auxiliar ficam com 103 e 104, em ordem ainda desconhecida.",
       "Pista 6: a sala de Marta é menor que a do Auxiliar, então Marta não é a Auxiliar. Pela pista 5 ela também não é a Analista, e o cargo de Oficial é de Paulo. Marta é a Técnica.",
       "Pela pista 6, a sala de Marta é menor que a do Auxiliar; as salas livres são 103 e 104. Marta fica com a 103 e o Auxiliar com a 104.",
       "Restam Nuno e Olga para os cargos de Analista (101) e Auxiliar (104). Pela pista 4, Nuno não ocupa a 104; logo Nuno é o Analista e Olga é a Auxiliar."
      ],
      "answer": "Marta: Técnico, sala 103. Nuno: Analista, sala 101. Olga: Auxiliar, sala 104. Paulo: Oficial, sala 102."
     }
    ],
    "tables": [
     {
      "caption": "Como ler o enunciado: tipo de relação e consequência para a tabela",
      "headers": [
       "Expressão no enunciado",
       "Tipo de relação",
       "O que fazer na tabela"
      ],
      "rows": [
       [
        "“cada um … diferente”, com tantos itens quanto pessoas",
        "um a um",
        "Um “sim” elimina o resto da linha e da coluna."
       ],
       [
        "“cada um … em um de …”, sem a palavra “diferente”",
        "repetição permitida",
        "Não elimine a coluna; use as pistas de contagem e de igualdade."
       ],
       [
        "mais itens do que pessoas",
        "nem todos os itens têm dono",
        "Não force o último item a ter dono; só a linha da pessoa se completa."
       ]
      ]
     }
    ]
   },
   {
    "capitulo": 2,
    "development": [
     "Além de marcar “sim” e “não”, a tabela ensina duas regras de ouro. A primeira é a regra do último que sobra: se, em uma linha ou coluna de correspondência exclusiva, todas as casas menos uma já receberam “não”, a casa restante vira “sim”, ainda que nenhuma pista a tenha mencionado. A segunda é a transitividade entre tabelas: se Rita é a pessoa do processo Criminal e o Criminal foi analisado na terça, então Rita analisou na terça, e você marca “sim” na tabela pessoa × dia sem que haja pista direta. Combinada com a regra do último, a transitividade costuma desatar problemas que pareciam travados.",
     "As pistas de comparação (“antes de”, “menor que”, “depois de”) não permitem marcar “sim” ou “não” de imediato, mas dão duas informações valiosas. Primeiro, as duas descrições se referem a pessoas diferentes, o que gera “não” entre elas. Segundo, limitam as posições: quem “analisou antes do Criminal” não pode ter analisado no último dia, e o Criminal não pode ter ficado no primeiro. Anote esses limites ao lado da tabela (por exemplo, “Sérgio: seg ou ter”) e volte a eles quando as faixas se estreitarem. Muitas vezes a pista de comparação só fecha o problema no fim, quando restam duas casas livres."
    ],
    "workedExamples": [
     {
      "prompt": "Rita, Sérgio e Tânia analisaram, cada um, um processo de tipo diferente (Cível, Criminal e Trabalhista), em dias diferentes: segunda, terça e quarta-feira. Sabe-se que: (1) Sérgio analisou antes do processo Criminal; (2) o processo Criminal foi analisado na terça; (3) o processo Trabalhista foi analisado antes de Rita; (4) Tânia não analisou na terça. Quem analisou qual processo e em que dia?",
      "steps": [
       "Pista 2: Criminal = terça. Pista 1: Sérgio atuou antes da terça, então só pode ter sido na segunda. Marque: Sérgio = segunda (e, por ser antes do Criminal, Sérgio não é a pessoa do Criminal).",
       "Pista 3: o Trabalhista foi antes de Rita; portanto Rita não é a pessoa do Trabalhista e não atuou na segunda (nada vem antes da segunda). Como a segunda já é de Sérgio, isso confirma o resultado.",
       "Pista 4: Tânia não atuou na terça, e a segunda é de Sérgio. Tânia atuou na quarta. Pela regra do último que sobra, Rita atuou na terça.",
       "Transitividade: o Criminal foi na terça e Rita atuou na terça; logo Rita analisou o Criminal.",
       "O Trabalhista foi antes de Rita (terça): só pode ter sido na segunda, que é de Sérgio. Sérgio analisou o Trabalhista e Tânia, o Cível. Conferência: Sérgio (segunda) antes do Criminal (terça) e Trabalhista (segunda) antes de Rita (terça)."
      ],
      "answer": "Sérgio: Trabalhista, segunda. Rita: Criminal, terça. Tânia: Cível, quarta."
     },
     {
      "prompt": "Quatro servidores (Lúcio, Mirela, Nélson e Odete) cuidaram, cada um, de um processo de tipo diferente (Cível, Criminal, Trabalhista e Tributário), em dias diferentes, de segunda a quinta-feira, um por dia. Sabe-se que: (1) o processo Criminal foi tratado na terça; (2) Odete não cuidou do Trabalhista; (3) Odete atuou antes do Tributário; (4) o Cível foi tratado antes do dia de Odete; (5) Mirela não atuou na quinta; (6) Lúcio não cuidou do Cível; (7) Lúcio atuou antes do Tributário. Descubra o processo e o dia de cada um.",
      "steps": [
       "Pistas 3 e 4 formam uma cadeia de dias: Cível < Odete < Tributário. Em comparações “antes”, as duas descrições são de pessoas diferentes; logo Odete não é a do Cível nem a do Tributário. Pela pista 2, não é a do Trabalhista. Odete cuidou do Criminal e, pela pista 1, atuou na terça.",
       "O Cível foi antes da terça: segunda. O Tributário foi depois da terça: quarta ou quinta.",
       "Lúcio: não cuidou do Cível (pista 6), então não atuou na segunda; a terça é de Odete; atuou antes do Tributário (pista 7). Lúcio só pode ter atuado na quarta, e o Tributário foi na quinta.",
       "Dias e processos confirmados: segunda = Cível, terça = Criminal, quinta = Tributário. O processo da quarta é o que sobra: Trabalhista. Lúcio cuidou do Trabalhista.",
       "Mirela e Nélson ficam com a segunda (Cível) e a quinta (Tributário). Pista 5: Mirela não atuou na quinta; então Mirela atuou na segunda (Cível) e Nélson, na quinta (Tributário). Conferência: todas as sete pistas se verificam."
      ],
      "answer": "Mirela: Cível, segunda. Odete: Criminal, terça. Lúcio: Trabalhista, quarta. Nélson: Tributário, quinta."
     }
    ],
    "tables": [
     {
      "caption": "Grade final do segundo exemplo (servidor × dia)",
      "headers": [
       "Servidor",
       "segunda",
       "terça",
       "quarta",
       "quinta"
      ],
      "rows": [
       [
        "Lúcio",
        "não",
        "não",
        "sim",
        "não"
       ],
       [
        "Mirela",
        "sim",
        "não",
        "não",
        "não"
       ],
       [
        "Nélson",
        "não",
        "não",
        "não",
        "sim"
       ],
       [
        "Odete",
        "não",
        "sim",
        "não",
        "não"
       ]
      ]
     }
    ]
   },
   {
    "capitulo": 3,
    "development": [
     "Três palavras parecidas escondem condições diferentes. “Antes” só exige menor posição: pode haver gente no meio. “Imediatamente antes” exige posições consecutivas. “Entre” significa que um elemento está em posição intermediária em relação a outros dois, em qualquer um dos dois sentidos, a menos que o enunciado indique o sentido; e também não exige contato, a menos que diga “logo entre” ou “imediatamente entre”. Por fim, “vizinho” e “ao lado” indicam posições consecutivas em qualquer sentido. Se o texto der um sentido (“à esquerda de”, “abaixo de”), siga-o rigorosamente e anote qual é a posição 1.",
     "Em mesas redondas, girar todos os participantes uma cadeira para o lado não cria um arranjo novo: continuam as mesmas vizinhanças e o mesmo sentido. Por isso se fixa uma pessoa na cadeira 0 e se numera o resto no sentido dado pelo enunciado. Duas informações bastam para a maior parte dos problemas: o sentido (horário ou anti-horário) e a noção de “em frente”, que numa mesa de seis cadeiras é uma diferença de três lugares e relaciona duas cadeiras de modo único. Já “vizinho” deixa duas possibilidades, uma de cada lado, e é aí que costuma sobrar a dúvida que a pista seguinte resolve. Em fila linear, ao contrário, as pontas não são vizinhas entre si; em mesa redonda, são."
    ],
    "workedExamples": [
     {
      "prompt": "Cinco servidores (Aline, Bruno, Cíntia, Davi e Elisa) aguardam atendimento em uma fila única, nas posições 1 (primeira) a 5 (última). Sabe-se que: (1) Aline está imediatamente antes de Bruno; (2) Bruno está antes de Davi, não necessariamente colados; (3) Cíntia não ocupa nenhuma das extremidades; (4) Elisa ocupa uma extremidade; (5) Cíntia e Davi não são vizinhos. Qual é a ordem da fila?",
      "steps": [
       "Pelas pistas 1 e 2, forme o bloco Aline-Bruno e coloque Davi depois dele. A cadeia Aline, Bruno, Davi está em ordem fixa, e Aline e Bruno são consecutivos.",
       "Pista 4: Elisa está na posição 1 ou na 5. Teste as duas hipóteses.",
       "Hipótese Elisa = 5. Aline, Bruno, Cíntia e Davi ocupam 1 a 4, com Cíntia fora da posição 1 (pista 3). As ordens que respeitam as pistas 1 e 2 são Aline-Bruno-Cíntia-Davi e Aline-Bruno-Davi-Cíntia (o bloco em 2-3 obrigaria Davi a ir para a 4 e Cíntia para a 1, uma extremidade; o bloco em 3-4 não deixa lugar para Davi depois de Bruno). Em ambas Cíntia e Davi ficam vizinhos, contra a pista 5. Hipótese descartada.",
       "Hipótese Elisa = 1. Aline, Bruno, Cíntia e Davi ocupam 2 a 5, com Cíntia fora da posição 5. Se o bloco ocupar 2-3, Cíntia e Davi ficam com 4 e 5: ou Cíntia = 4, Davi = 5 (vizinhos) ou Cíntia = 5 (extremidade). Ambas falham. Se o bloco ocupar 3-4, Davi fica com a 5 e Cíntia, com a 2: Cíntia e Davi não são vizinhos. Se o bloco ocupar 4-5, não sobra posição para Davi depois de Bruno.",
       "Fila: Elisa, Cíntia, Aline, Bruno, Davi. Conferência das cinco pistas: Aline (3) imediatamente antes de Bruno (4); Bruno (4) antes de Davi (5); Cíntia na 2; Elisa na 1; Cíntia (2) e Davi (5) não são vizinhos."
      ],
      "answer": "Posição 1: Elisa; 2: Cíntia; 3: Aline; 4: Bruno; 5: Davi."
     },
     {
      "prompt": "Seis conselheiros (Fábio, Gisele, Heitor, Irene, Jorge e Karen) sentam-se em uma mesa redonda com seis cadeiras igualmente espaçadas, sem lugares marcados: só importa quem está ao lado de quem e em que sentido. Considerando o sentido horário (visto de cima), sabe-se que: (1) Gisele senta logo depois de Fábio, no sentido horário; (2) Irene senta exatamente em frente a Gisele; (3) Heitor é vizinho de Irene; (4) Karen senta exatamente em frente a Fábio. Descreva a disposição, a partir de Fábio, no sentido horário.",
      "steps": [
       "Como a mesa pode ser girada, fixe Fábio na cadeira 0 e numere as outras de 1 a 5 no sentido horário. “Em frente” é uma diferença de 3 cadeiras.",
       "Pista 1: Gisele está na cadeira 1. Pista 2: Irene está em frente a Gisele, isto é, na cadeira 1 + 3 = 4. Pista 4: Karen está em frente a Fábio, na cadeira 0 + 3 = 3.",
       "Pista 3: Heitor é vizinho de Irene (cadeira 4). Os vizinhos dessa cadeira são as cadeiras 3 e 5. A 3 pertence a Karen, logo Heitor ocupa a 5.",
       "Resta Jorge, na cadeira 2 (a única livre).",
       "Conferência: Gisele (1) logo depois de Fábio (0); Gisele (1) e Irene (4) em frente; Heitor (5) e Irene (4) vizinhos; Fábio (0) e Karen (3) em frente."
      ],
      "answer": "Sentido horário a partir de Fábio: Fábio, Gisele, Jorge, Karen, Irene, Heitor (e de volta a Fábio)."
     }
    ],
    "tables": [
     {
      "caption": "Palavras de posição e o que elas exigem",
      "headers": [
       "Expressão",
       "Exige",
       "Não exige"
      ],
      "rows": [
       [
        "A antes de B",
        "posição de A menor que a de B",
        "que sejam consecutivos"
       ],
       [
        "A imediatamente antes de B",
        "posição de B = posição de A + 1",
        "nada além disso"
       ],
       [
        "A entre B e C",
        "posição intermediária, em um dos dois sentidos",
        "que A esteja colado a B ou a C"
       ],
       [
        "A e B vizinhos",
        "posições consecutivas, em qualquer ordem",
        "um sentido específico"
       ]
      ]
     }
    ]
   },
   {
    "capitulo": 4,
    "development": [
     "Há dois modelos de enunciado que parecem iguais, mas se resolvem de modos diferentes. No modelo dos habitantes de tipo fixo (cavaleiros e mentirosos), a incógnita é o tipo de cada pessoa e há uma regra única: a fala é verdadeira se e somente se o falante é cavaleiro. No modelo dos testemunhos com regra global (“só um diz a verdade”, “apenas o culpado mente”), a incógnita é um fato do mundo, como quem é o culpado, e a regra diz como as falas se distribuem. Em ambos o método é o mesmo: suponha um valor para a incógnita, calcule a verdade de cada fala e confira se a regra do enunciado se cumpre.",
     "Duas falas que se contradizem (uma afirma P, a outra afirma não P) dão uma pista valiosa: exatamente uma das duas é verdadeira. Se a regra global admite uma só fala verdadeira, as demais falas são necessariamente falsas, e você poda hipóteses de uma vez. Em sentido contrário, se duas falas são equivalentes, elas são ambas verdadeiras ou ambas falsas. Para negar uma fala, lembre as equivalências: negar “A e B” dá “não A ou não B”; negar “A ou B” dá “não A e não B”; negar “se A então B” dá “A e não B”."
    ],
    "workedExamples": [
     {
      "prompt": "Em uma ilha, cada habitante é cavaleiro (sempre diz a verdade) ou mentiroso (sempre mente). Ana diz: “Bruno é mentiroso.” Bruno diz: “Carla e eu somos do mesmo tipo.” Carla diz: “Ana é mentirosa.” Quem é cavaleiro e quem é mentiroso?",
      "steps": [
       "Hipótese 1: Ana é cavaleira. Sua fala é verdadeira, então Bruno é mentiroso. A fala de Carla (“Ana é mentirosa”) é falsa, pois Ana é cavaleira; logo Carla é mentirosa.",
       "Teste da hipótese 1: Bruno e Carla são ambos mentirosos, então “Carla e eu somos do mesmo tipo” é verdadeira. Mas Bruno é mentiroso e não pode dizer uma verdade. Contradição: a hipótese 1 cai.",
       "Hipótese 2: Ana é mentirosa. Sua fala é falsa, então Bruno não é mentiroso: é cavaleiro. A fala de Carla (“Ana é mentirosa”) é verdadeira, então Carla é cavaleira.",
       "Teste da hipótese 2: Bruno (cavaleiro) diz que Carla e ele são do mesmo tipo; ambos são cavaleiros, a fala é verdadeira, como deve ser. Nenhuma contradição."
      ],
      "answer": "Ana é mentirosa; Bruno e Carla são cavaleiros."
     },
     {
      "prompt": "Uma sala do arquivo foi deixada destrancada por exatamente um dos quatro servidores: Dora, Egon, Flávia ou Gil. No interrogatório, cada um fez uma declaração. Dora: “Foi o Egon ou o Gil.” Egon: “Não fui eu.” Flávia: “Foi o Gil.” Gil: “A Dora está mentindo.” Sabe-se que exatamente uma das quatro declarações é verdadeira. Quem deixou a sala destrancada?",
      "steps": [
       "A incógnita é o culpado. Teste cada hipótese e conte as declarações verdadeiras (V) e falsas (F). “A Dora está mentindo” é verdadeira exatamente quando a declaração de Dora é falsa.",
       "Culpado = Dora: Dora F (nem Egon nem Gil), Egon V (não foi ele), Flávia F, Gil V (Dora mente). Duas verdadeiras: descartado.",
       "Culpado = Egon: Dora V (foi o Egon), Egon F (foi ele), Flávia F (não foi o Gil), Gil F (Dora diz a verdade, então não está mentindo). Uma verdadeira: confere.",
       "Culpado = Flávia: Dora F, Egon V, Flávia F, Gil V. Duas verdadeiras: descartado.",
       "Culpado = Gil: Dora V, Egon V, Flávia V, Gil F. Três verdadeiras: descartado. Só a hipótese Egon cumpre a regra."
      ],
      "answer": "Egon deixou a sala destrancada."
     }
    ],
    "tables": [
     {
      "caption": "Segundo exemplo: valor de cada declaração, hipótese por hipótese",
      "headers": [
       "Culpado",
       "Dora",
       "Egon",
       "Flávia",
       "Gil",
       "Verdadeiras"
      ],
      "rows": [
       [
        "Dora",
        "F",
        "V",
        "F",
        "V",
        "2"
       ],
       [
        "Egon",
        "V",
        "F",
        "F",
        "F",
        "1"
       ],
       [
        "Flávia",
        "F",
        "V",
        "F",
        "V",
        "2"
       ],
       [
        "Gil",
        "V",
        "V",
        "V",
        "F",
        "3"
       ]
      ]
     }
    ]
   },
   {
    "capitulo": 5,
    "development": [
     "Quando o problema não tem solução única, a pergunta quase nunca é “qual é a configuração?”, e sim “o que se pode afirmar com certeza?”. Se as configurações possíveis são poucas, liste todas e passe cada afirmação por elas: valendo em todas, é necessária; em algumas, é possível; em nenhuma, é impossível. Essa tabela de afirmação × configuração é rápida e à prova de intuição. Se as configurações são muitas, a saída é a contraprova: para derrubar uma necessidade, basta uma configuração legítima em que a afirmação falhe; para provar uma impossibilidade, é preciso mostrar que todas as tentativas de realizá-la violam alguma pista.",
     "Cuidado com a linguagem das perguntas. “Pode ser” e “é possível” pedem pelo menos uma configuração; “deve ser”, “necessariamente” e “com certeza” pedem todas. “Não é necessário que A” equivale a “é possível que não A”. E uma afirmação impossível é o mesmo que uma necessidade escondida: se é impossível que Raul ocupe o segundo lugar, então é necessário que Raul não ocupe o segundo lugar. Por fim, “possível” não quer dizer “provável”: uma configuração que aparece em uma entre quatro conta tanto quanto as demais para decidir o que é possível."
    ],
    "workedExamples": [
     {
      "prompt": "Quatro servidores (Lara, Mário, Nina e Otávio) formam uma fila nas posições 1 a 4. Sabe-se que Lara está imediatamente antes de Mário, que Nina não é a primeira e que Otávio não é o último. Classifique cada afirmação como necessária (vale em todas as filas possíveis), possível (vale em algumas, mas não em todas) ou impossível: (a) Mário não é o primeiro; (b) Lara é a primeira; (c) Otávio é vizinho de Lara; (d) Mário é o primeiro; (e) Otávio está antes de Nina.",
      "steps": [
       "O bloco Lara-Mário ocupa as posições 1-2, 2-3 ou 3-4. Examine cada caso.",
       "Bloco em 1-2: restam as posições 3 e 4 para Nina e Otávio; Otávio não pode ser o último, então Otávio = 3 e Nina = 4. Fila: Lara, Mário, Otávio, Nina.",
       "Bloco em 2-3: restam as posições 1 e 4; Nina não é a primeira, então Nina = 4 e Otávio = 1. Fila: Otávio, Lara, Mário, Nina.",
       "Bloco em 3-4: restam as posições 1 e 2; Nina não é a primeira, então Nina = 2 e Otávio = 1. Fila: Otávio, Nina, Lara, Mário. Há três filas possíveis.",
       "Classificação: (a) Mário ocupa as posições 2, 3 e 4 nas três filas: necessária. (b) Lara é a primeira só na primeira fila: possível. (c) Otávio é vizinho de Lara só na segunda fila (Otávio 1, Lara 2): possível. (d) Mário nunca é o primeiro: impossível. (e) Otávio está antes de Nina nas três filas (3 antes de 4, 1 antes de 4, 1 antes de 2): necessária."
      ],
      "answer": "(a) necessária; (b) possível; (c) possível; (d) impossível; (e) necessária."
     },
     {
      "prompt": "Cinco servidores (Pedro, Quitéria, Raul, Sônia e Tales) ocupam, um em cada, as posições 1 a 5 de uma fila. Sabe-se que: (1) Pedro está imediatamente antes de Quitéria; (2) Quitéria está antes de Raul; (3) Sônia não está em nenhuma das extremidades; (4) Tales e Raul não são vizinhos. Classifique como necessária, possível ou impossível: (a) Raul ocupa a 2ª posição; (b) Pedro está antes de Raul; (c) Raul é o último; (d) Tales é o primeiro; (e) Pedro e Sônia são vizinhos.",
      "steps": [
       "O bloco Pedro-Quitéria vem antes de Raul, então só pode ocupar as posições 1-2, 2-3 ou 3-4. Sônia só pode estar nas posições 2, 3 ou 4.",
       "Bloco em 1-2: restam 3, 4 e 5 para Raul, Sônia e Tales. Sônia não é a 5ª. Se Sônia = 3, Raul e Tales ficam em 4 e 5 e seriam vizinhos: falha. Se Sônia = 4, Raul e Tales ficam em 3 e 5 (não vizinhos): duas filas, Pedro-Quitéria-Raul-Sônia-Tales e Pedro-Quitéria-Tales-Sônia-Raul.",
       "Bloco em 2-3: restam 1, 4 e 5. Sônia = 4. Raul vem depois de Quitéria, então Raul = 5 e Tales = 1: Tales-Pedro-Quitéria-Sônia-Raul.",
       "Bloco em 3-4: restam 1, 2 e 5. Sônia = 2; Raul = 5 e Tales = 1: Tales-Sônia-Pedro-Quitéria-Raul. Há quatro filas possíveis (veja a tabela).",
       "Classificação: (a) Raul nunca fica na 2ª posição (ele vem depois de Pedro e de Quitéria, então ocupa a 3ª posição ou além): impossível. (b) Pedro está antes de Quitéria e esta antes de Raul: necessária. (c) Raul é o último em 3 das 4 filas, mas não na primeira: possível. (d) Tales é o primeiro na terceira e na quarta filas: possível. (e) Pedro e Sônia são vizinhos apenas na quarta fila (Sônia 2, Pedro 3): possível."
      ],
      "answer": "(a) impossível; (b) necessária; (c) possível; (d) possível; (e) possível."
     }
    ],
    "tables": [
     {
      "caption": "As quatro filas possíveis do segundo exemplo (posições 1 a 5)",
      "headers": [
       "Fila",
       "1ª",
       "2ª",
       "3ª",
       "4ª",
       "5ª"
      ],
      "rows": [
       [
        "I",
        "Pedro",
        "Quitéria",
        "Raul",
        "Sônia",
        "Tales"
       ],
       [
        "II",
        "Pedro",
        "Quitéria",
        "Tales",
        "Sônia",
        "Raul"
       ],
       [
        "III",
        "Tales",
        "Pedro",
        "Quitéria",
        "Sônia",
        "Raul"
       ],
       [
        "IV",
        "Tales",
        "Sônia",
        "Pedro",
        "Quitéria",
        "Raul"
       ]
      ]
     }
    ]
   }
  ],
  "novosCapitulos": [
   {
    "title": "Montando a tabela de possibilidades",
    "paragraphs": [
     "Quando um problema distribui várias características entre as mesmas pessoas, a memória não dá conta de segurar todas as combinações ao mesmo tempo. A solução é externalizar: montar uma grade na qual cada casa responde a uma única pergunta, como “Ana trabalha no Arquivo?”. Escolha uma categoria como âncora, quase sempre as pessoas, e coloque as outras categorias como colunas. Com três categorias (pessoa, setor e turno) usam-se duas ou três grades: pessoa × setor, pessoa × turno e, se preciso, setor × turno. Com quatro categorias, as grades ancoradas na pessoa e uma ou duas grades auxiliares costumam bastar.",
     "Cada casa tem três estados: “sim” (a ligação é certa), “não” (é impossível) e vazia (ainda desconhecida). Uma casa vazia nunca significa “não”. Quatro regras fazem a grade avançar. Primeira: pista positiva vira “sim”. Segunda: pista negativa vira “não”. Terceira: quando a correspondência é exclusiva, um “sim” enche de “não” o resto da linha e da coluna. Quarta: se uma linha ou coluna ficou com uma única casa vazia, essa casa é “sim”. Essas regras valem em cada grade, e a quinta regra liga as grades: se Ana é do Arquivo e o Arquivo é à tarde, Ana trabalha à tarde; se Ana é do Arquivo e o Arquivo não é à noite, Ana não trabalha à noite.",
     "A ordem de ataque importa. Comece pelas pistas diretas (“sim”), passe às negativas e deixe por último as pistas em que aparece “ou” ou uma comparação. Pistas de duas possibilidades, como “Beto trabalha de manhã ou à tarde”, anotam-se na margem e viram “não” nas outras colunas; a segunda possibilidade costuma cair quando outra pista ocupa uma das casas. Quando a grade travar, releia as pistas que você guardou: quase sempre alguma delas ganhou força com o que foi preenchido depois. Ao final, confira todas as pistas na solução completa."
    ],
    "example": "Exemplo resolvido: Lia e Rui ocupam as mesas 1 e 2, uma para cada. Pista: Lia não ocupa a mesa 1. Marca-se “não” em Lia × mesa 1. Como só há duas mesas, a última casa livre da linha de Lia, mesa 2, vira “sim”. Pela regra da coluna, Rui × mesa 2 é “não” e, sobrando uma única casa, Rui × mesa 1 é “sim”.",
    "development": [
     "As pistas negativas aparecem em formas variadas. “Nem A nem B” gera dois “não”. “A ou B, mas não os dois” gera uma casa “sim” em uma das duas colunas e “não” na outra, sem que se saiba qual. “Quem usa o carro azul não trabalha no Cartório” liga duas colunas, não a pessoa; marque o “não” na grade setor × cor, ou anote que a pessoa de azul está fora do Cartório. Um bom hábito é traduzir cada pista para pares de categoria antes de preencher, perguntando “que duas categorias esta pista relaciona?”.",
     "Com quatro categorias, o número de casas cresce, mas o método é o mesmo. Escolha uma pista que fixe a pessoa em duas categorias ao mesmo tempo e use a pessoa como ponte entre as demais. As pistas de ordem (“antes de”) pertencem à grade que tem a categoria ordenada, por exemplo o dia, e não geram “sim” até que os limites se encontrem. Se, depois de preencher tudo, alguma linha ficar com duas casas “sim” ou uma coluna ficar sem nenhuma, houve erro de leitura em alguma pista; refaça a partir da pista que causou o conflito."
    ],
    "method": [
     "Liste as categorias e os elementos de cada uma; escolha a âncora (normalmente as pessoas) e desenhe as grades necessárias, indicando se a correspondência é exclusiva.",
     "Traduza cada pista para uma relação entre duas categorias: positiva (“sim”), negativa (“não”), de ordem ou de escolha entre possibilidades (“ou”).",
     "Marque as pistas positivas e propague: um “sim” enche de “não” a linha e a coluna (se exclusiva), e a última casa vazia de uma linha ou coluna vira “sim”.",
     "Transporte as conclusões entre as grades por meio da âncora: “sim” com “sim” gera “sim”; “sim” com “não” gera “não”.",
     "Releia as pistas de ordem e de escolha entre possibilidades, complete o que faltar e confira todas as pistas na solução final."
    ],
    "workedExamples": [
     {
      "prompt": "Ana, Beto e Carla trabalham, cada um, em um setor diferente (Protocolo, Arquivo e Cartório) e em um turno diferente (manhã, tarde e noite). Sabe-se que: (1) o Cartório não funciona à noite; (2) o Arquivo funciona à tarde; (3) Ana não trabalha no Protocolo; (4) Beto trabalha no Cartório. Descubra o setor e o turno de cada um.",
      "steps": [
       "Comece pela grade setor × turno. Pista 2: Arquivo × tarde é “sim”; então Arquivo × manhã e Arquivo × noite são “não”, e Protocolo × tarde e Cartório × tarde também são “não”.",
       "Pista 1: Cartório × noite é “não”. Na linha do Cartório sobra uma só casa vazia, a manhã: Cartório × manhã é “sim”. Na coluna da noite sobra uma só casa, o Protocolo: Protocolo × noite é “sim”.",
       "Passe para a grade servidor × setor. Pista 4: Beto × Cartório é “sim”; então Ana × Cartório e Carla × Cartório são “não”, e Beto × Arquivo e Beto × Protocolo também.",
       "Pista 3: Ana × Protocolo é “não”. Na linha de Ana, só resta o Arquivo: Ana × Arquivo é “sim”. Na coluna do Protocolo sobra Carla: Carla × Protocolo é “sim”.",
       "Transporte pelos setores: Ana está no Arquivo, que é à tarde; Beto está no Cartório, que é de manhã; Carla está no Protocolo, que é à noite. Conferência: as quatro pistas se verificam."
      ],
      "answer": "Ana: Arquivo, tarde. Beto: Cartório, manhã. Carla: Protocolo, noite."
     },
     {
      "prompt": "Ivo, Joana, Kléber e Lia trabalham, cada um, em um setor diferente (Protocolo, Arquivo, Cartório e Distribuição) e em um turno diferente (manhã, tarde, noite e plantão). Sabe-se que: (1) a Distribuição não funciona à noite; (2) o Cartório também não funciona à noite; (3) Joana não trabalha à noite; (4) o Protocolo funciona no plantão; (5) Joana não trabalha à tarde; (6) Kléber não está na Distribuição; (7) Ivo está no Cartório; (8) Kléber não está no Arquivo. Determine o setor e o turno de cada um.",
      "steps": [
       "Grade setor × turno. Pista 4: Protocolo × plantão é “sim”; os outros setores recebem “não” no plantão, e o Protocolo recebe “não” nos demais turnos. Pistas 1 e 2: Distribuição e Cartório não são à noite. Na coluna da noite, só o Arquivo está livre: Arquivo × noite é “sim”.",
       "Grade servidor × setor. Pista 7: Ivo × Cartório é “sim”; Ivo recebe “não” nos outros setores e os demais recebem “não” no Cartório.",
       "Kléber: “não” na Distribuição (pista 6), “não” no Arquivo (pista 8) e “não” no Cartório (é de Ivo). Na linha de Kléber só sobra o Protocolo: Kléber × Protocolo é “sim”.",
       "Joana e Lia dividem o Arquivo e a Distribuição. O Arquivo funciona à noite e Joana não trabalha à noite (pista 3), então Joana × Arquivo é “não”. Joana está na Distribuição e Lia, no Arquivo.",
       "Turnos por transporte: Lia (Arquivo) à noite; Kléber (Protocolo) no plantão. Restam manhã e tarde para Joana (Distribuição) e Ivo (Cartório). Pista 5: Joana não trabalha à tarde; Joana de manhã e Ivo à tarde. Conferência: as oito pistas se verificam."
      ],
      "answer": "Ivo: Cartório, tarde. Joana: Distribuição, manhã. Kléber: Protocolo, plantão. Lia: Arquivo, noite."
     },
     {
      "prompt": "Quatro servidores (Ivo, Joana, Kléber e Lia) atuam, cada um, em um setor diferente (Protocolo, Arquivo, Cartório e Distribuição), cuidam de um tipo de processo diferente (Cível, Criminal, Trabalhista e Tributário) e fazem plantão em um dia diferente, de segunda a quinta-feira. Sabe-se que: (1) o servidor da Distribuição cuida do Cível; (2) quem faz plantão na segunda não cuida do Tributário; (3) Ivo faz plantão antes de quem trabalha no Arquivo; (4) Kléber cuida do Criminal; (5) Ivo não está na Distribuição; (6) Lia faz plantão antes de quem cuida do Cível; (7) Kléber faz plantão antes de quem trabalha no Cartório; (8) Ivo faz plantão antes de quem cuida do Trabalhista. Determine o setor, o processo e o dia de cada um.",
      "steps": [
       "Quatro categorias: servidor (âncora), setor, processo e dia. Pistas com “antes de” ligam duas descrições de pessoas diferentes; por isso, nas pistas 3, 6, 7 e 8, o falante nunca é a pessoa descrita pela segunda parte (por exemplo, Lia não cuida do Cível e Ivo não trabalha no Arquivo).",
       "Quem está na Distribuição cuida do Cível (pista 1). Não é Kléber (cuida do Criminal), não é Ivo (pista 5) e não é Lia (pista 6). Logo Joana está na Distribuição e cuida do Cível.",
       "Ivo não cuida do Cível (Joana), do Criminal (Kléber) nem do Trabalhista (pista 8). Resta o Tributário. Lia fica com o Trabalhista. Já Ivo não está na Distribuição nem no Arquivo (pista 3): seu setor é Protocolo ou Cartório.",
       "Dias: pista 8, Ivo antes de Lia (Trabalhista); pista 6, Lia antes de Joana (Cível). A cadeia é Ivo < Lia < Joana. Ivo precisa de dois dias depois dele, então só pode ser segunda ou terça; pista 2: o plantão da segunda não é do Tributário, e Ivo cuida do Tributário. Ivo = terça, Lia = quarta, Joana = quinta e Kléber = segunda.",
       "Setores: o Arquivo é de alguém que plantona depois de Ivo (pista 3) e que não seja Joana (Distribuição): é Lia. Pista 7: Kléber (segunda) antes de quem trabalha no Cartório; Kléber não trabalha no Cartório. Então o Cartório é de Ivo e o Protocolo, de Kléber. Conferência: as oito pistas se verificam."
      ],
      "answer": "Ivo: Cartório, Tributário, terça. Joana: Distribuição, Cível, quinta. Kléber: Protocolo, Criminal, segunda. Lia: Arquivo, Trabalhista, quarta."
     }
    ],
    "pitfall": "Marcar “sim” por exclusão onde o enunciado permite repetição, ou esquecer de transportar as conclusões de uma grade para outra. A primeira falha cria uma certeza que não existe; a segunda deixa a solução escondida na grade vizinha. Antes de eliminar linha e coluna, confirme a palavra “diferente” no enunciado; depois de cada nova certeza, pergunte “o que isso me diz nas outras grades?”.",
    "tables": [
     {
      "caption": "Legenda das marcas na grade",
      "headers": [
       "Situação",
       "Marca",
       "Consequência"
      ],
      "rows": [
       [
        "Pista afirma a ligação",
        "sim",
        "Elimina o resto da linha e da coluna, se a correspondência é exclusiva."
       ],
       [
        "Pista nega a ligação",
        "não",
        "Reduz as possibilidades da linha e da coluna."
       ],
       [
        "Todas as casas de uma linha, menos uma, são “não”",
        "sim na casa restante",
        "Regra do último que sobra."
       ],
       [
        "Casa ainda sem informação",
        "vazia",
        "Não significa “não”; deixe aberta até haver pista."
       ]
      ]
     }
    ],
    "resumo": {
     "title": "Tabela de possibilidades",
     "text": "Cada casa da grade responde “sim”, “não” ou fica vazia; um “sim” elimina o resto da linha e da coluna, e a última casa vazia vira “sim”.",
     "bizu": "Casa vazia não é “não”: só elimine linha e coluna quando o enunciado disser “diferente”."
    }
   },
   {
    "title": "Ordenação, posições e restrições",
    "paragraphs": [
     "Problemas de ordenação pedem a posição de cada elemento em uma fila, em andares, em dias da semana ou em cadeiras. O vocabulário é o ponto crítico, porque cada expressão vira uma condição diferente. “A está antes de B” significa que a posição de A é menor que a de B, sem exigir contato. “A está imediatamente antes de B” significa que a posição de B é a de A mais um. “A está entre B e C” coloca A em posição intermediária, em um dos dois sentidos, sem exigir contato. “A e B são vizinhos” pede posições consecutivas em qualquer ordem. “A não é vizinho de B” impede que as posições sejam consecutivas.",
     "Dois instrumentos organizam o raciocínio. O primeiro é o bloco: quando dois ou mais elementos são consecutivos, trate-os como uma peça única, lembrando a ordem interna. O segundo é a cadeia: várias pistas de “antes” podem se encadear (A antes de B, B antes de C) e formar uma sequência de ordem fixa, na qual os demais elementos se encaixam. Para contar quantas ordens existem, lembre: n elementos livres geram n! ordens; um bloco rígido de k elementos reduz o problema a n − k + 1 peças; e uma cadeia de k elementos em ordem fixa entre n elementos divide o total por k!, ou seja, n!/k!.",
     "O método de busca aproveita as restrições mais fortes. Posições fixas e extremidades (que têm um só vizinho) reduzem o número de casos. Depois, liste, para cada elemento, as posições que ainda podem ser ocupadas; riscando as que as pistas proíbem, restam poucas, e uma posição que só um elemento pode ocupar fica determinada. Quando restam dois ou três casos, teste cada um em pista após pista. Na conferência final, releia as pistas de ordem com atenção: um erro frequente é aceitar um arranjo que respeita “antes” por acaso, mas viola “imediatamente antes”."
    ],
    "example": "Exemplo resolvido: em uma fila de quatro pessoas (Ana, Bia, Caio e Davi), Ana está imediatamente antes de Bia. Forma-se o bloco AB; com Caio e Davi, há três peças, e 3! = 6 ordens: AB-C-D, AB-D-C, C-AB-D, D-AB-C, C-D-AB e D-C-AB.",
    "development": [
     "Nos andares de um edifício, convencione o térreo como posição 1, salvo indicação contrária, e interprete “acima” como número maior. Nos dias da semana, segunda a sexta-feira formam cinco posições; “dias consecutivos” são posições seguidas, e sexta e segunda, por estarem em semanas diferentes, não são consecutivas. Quando a pista trata de “um dia depois” ou “dois dias antes”, calcule a posição diretamente. Uma pista “A está entre B e C” funciona por simetria: se o problema não fixa o sentido, duplique os casos e deixe as outras pistas decidirem qual vale.",
     "Muitos enunciados pedem apenas contar as ordens que respeitam certas pistas. Nesse caso, combine as pistas de modo a revelar uma estrutura: blocos, cadeias, posições fixas. Conte as ordens da estrutura, e depois aplique as restrições que sobraram. Outras vezes basta listar os casos: se a estrutura deixa no máximo seis ou sete arranjos, escrever todos é mais seguro do que um cálculo apressado. E, se o enunciado afirma que a ordem é única, use essa informação como verificação: se você achou duas ordens, uma pista foi mal lida."
    ],
    "method": [
     "Defina as posições (1 a n), o sentido de contagem e se a estrutura é linear ou circular (neste caso, fixe um elemento).",
     "Traduza cada pista: “antes”, “imediatamente antes”, “entre”, “vizinho”, “extremidade”, posição fixa ou proibida.",
     "Una pistas em blocos e cadeias; marque posições proibidas para cada elemento e posições fixas.",
     "Teste os casos restantes (por exemplo, as duas extremidades possíveis para um elemento) até restar uma ordem, ou conte as ordens da estrutura.",
     "Confira todas as pistas na ordem encontrada, distinguindo “antes” de “imediatamente antes”."
    ],
    "workedExamples": [
     {
      "prompt": "Quatro servidores (Ruth, Saulo, Telma e Ubirajara) formam uma fila nas posições 1 a 4. Sabe-se que: (1) Ruth está imediatamente antes de Saulo; (2) Telma não é a última; (3) Ubirajara está antes de Saulo; (4) Telma não é a primeira. Conte quantas filas respeitam apenas a pista 1, depois as pistas 1 e 2, depois as pistas 1 a 3, e determine a fila final.",
      "steps": [
       "Só a pista 1: Ruth e Saulo formam o bloco R-S. Com Telma e Ubirajara há três peças, então 3! = 6 filas: RS-T-U, RS-U-T, T-RS-U, U-RS-T, T-U-RS e U-T-RS.",
       "Pistas 1 e 2: Telma não é a última, o que elimina RS-U-T e U-RS-T. Sobram 4 filas: RS-T-U, T-RS-U, T-U-RS e U-T-RS.",
       "Pistas 1 a 3: Ubirajara precisa estar antes de Saulo. Em RS-T-U e em T-RS-U, Ubirajara é o último, depois de Saulo: caem. Sobram T-U-RS e U-T-RS: 2 filas.",
       "Pista 4: Telma não é a primeira; T-U-RS cai. Resta U-T-RS, isto é, Ubirajara, Telma, Ruth, Saulo. Conferência: Ruth (3) imediatamente antes de Saulo (4); Telma na 2; Ubirajara (1) antes de Saulo; Telma não é a primeira."
      ],
      "answer": "Com as pistas acumuladas há 6, 4, 2 e 1 filas, respectivamente. A fila final é Ubirajara, Telma, Ruth, Saulo."
     },
     {
      "prompt": "Cinco setores (Protocolo, Arquivo, Cartório, Diretoria e Tesouraria) ocupam, um por andar, os andares 1 a 5 de um edifício (o 1 é o térreo). Sabe-se que: (1) o Cartório fica em um andar intermediário entre os andares do Arquivo e da Diretoria (não necessariamente colados); (2) o Arquivo fica abaixo da Diretoria; (3) a Tesouraria ocupa o térreo ou o último andar; (4) o Protocolo fica imediatamente abaixo da Tesouraria. Em que andar fica cada setor?",
      "steps": [
       "Pistas 1 e 2: o “entre” ganha sentido pela pista 2, e a cadeia é Arquivo < Cartório < Diretoria, em andares crescentes.",
       "Pista 4: o Protocolo está um andar abaixo da Tesouraria, então a Tesouraria não é o térreo (não haveria andar abaixo). Pela pista 3, a Tesouraria ocupa o 5º andar e o Protocolo, o 4º.",
       "Restam os andares 1, 2 e 3 para a cadeia Arquivo < Cartório < Diretoria. Com ordem fixa, só há uma forma: Arquivo no 1º, Cartório no 2º e Diretoria no 3º.",
       "Conferência: o Cartório (2º) está entre o Arquivo (1º) e a Diretoria (3º); a Tesouraria está no último andar; o Protocolo (4º) está imediatamente abaixo dela."
      ],
      "answer": "1º andar: Arquivo; 2º: Cartório; 3º: Diretoria; 4º: Protocolo; 5º: Tesouraria."
     },
     {
      "prompt": "Cinco audiências (Conciliação, Instrução, Julgamento, Mediação e Saneamento) serão realizadas em uma semana, uma por dia, de segunda a sexta-feira. Sabe-se que: (1) a Instrução ocorre em algum dia antes do Saneamento; (2) a Mediação ocorre em algum dia antes da Instrução; (3) a Conciliação e o Saneamento não ocorrem em dias consecutivos; (4) o Saneamento ocorre em um dia entre os da Conciliação e da Instrução. Determine a ordem. Depois diga quantas ordens seriam possíveis usando apenas as pistas 1, 2 e 4.",
      "steps": [
       "Sem nenhuma pista, as cinco audiências podem ser ordenadas de 5! = 120 modos.",
       "Pistas 1 e 4: Instrução está antes do Saneamento, e o Saneamento está entre a Conciliação e a Instrução. Como a Instrução vem antes do Saneamento, a Conciliação vem depois dele: Instrução < Saneamento < Conciliação. Com a pista 2, a cadeia completa é Mediação < Instrução < Saneamento < Conciliação.",
       "O Julgamento é a única audiência fora da cadeia e pode ocupar qualquer um dos 5 lugares: Julgamento no começo, depois da Mediação, depois da Instrução, depois do Saneamento ou no fim. São 5 ordens com as pistas 1, 2 e 4 (confere com 5!/4! = 5).",
       "As cinco ordens, com Me, In, Sa, Co e Ju: Ju-Me-In-Sa-Co; Me-Ju-In-Sa-Co; Me-In-Ju-Sa-Co; Me-In-Sa-Ju-Co; Me-In-Sa-Co-Ju.",
       "Pista 3: a Conciliação e o Saneamento não são consecutivos. Só a quarta ordem (Me-In-Sa-Ju-Co) tem alguém entre Saneamento e Conciliação; nas outras, os dois ficam colados. Conferência: as quatro pistas se verificam."
      ],
      "answer": "Segunda: Mediação; terça: Instrução; quarta: Saneamento; quinta: Julgamento; sexta: Conciliação. Com apenas as pistas 1, 2 e 4, seriam 5 ordens possíveis."
     }
    ],
    "pitfall": "Ler “antes” como “imediatamente antes” (ou “entre” como “colado”) e descartar arranjos legítimos, ou o contrário: aceitar uma ordem que respeita “antes” por acaso, mas viola “imediatamente antes”. Marque, na pista, a palavra decisiva (“imediatamente”, “algum dia”, “vizinho”) e confira-a na ordem final.",
    "tables": [
     {
      "caption": "Tradução das expressões de ordem",
      "headers": [
       "Expressão",
       "Condição",
       "Exemplo na fila 1 a 5"
      ],
      "rows": [
       [
        "A antes de B",
        "pos(A) < pos(B)",
        "A na 2 e B na 5 serve"
       ],
       [
        "A imediatamente antes de B",
        "pos(B) = pos(A) + 1",
        "A na 2 e B na 3 serve; B na 5 não serve"
       ],
       [
        "A entre B e C",
        "pos(B) < pos(A) < pos(C), ou o inverso",
        "B na 1, A na 3, C na 5 serve"
       ],
       [
        "A e B vizinhos",
        "diferença de posições igual a 1",
        "2 e 3 servem; 2 e 4 não servem"
       ],
       [
        "A não é vizinho de B",
        "diferença de posições diferente de 1",
        "2 e 4 servem; 2 e 3 não servem"
       ]
      ]
     }
    ],
    "resumo": {
     "title": "Ordenação e posições",
     "text": "Cada expressão de ordem tem uma condição própria; una pistas em blocos e cadeias e teste os poucos casos que sobrarem.",
     "bizu": "“Antes” aceita gente no meio; “imediatamente antes” não. Teste as extremidades primeiro."
    }
   },
   {
    "title": "Verdade e mentira",
    "paragraphs": [
     "Nos problemas de verdade e mentira, ninguém é confiável por aparência; só a lógica decide. O primeiro modelo é o das ilhas de cavaleiros e mentirosos: cada habitante é cavaleiro, que sempre diz a verdade, ou mentiroso, que sempre mente. A regra fundamental é uma equivalência: a fala de um habitante é verdadeira se e somente se ele é cavaleiro. Assim, toda fala dá uma equação entre o tipo do falante e o conteúdo da fala. O método é supor o tipo de uma pessoa, propagar o que isso exige das outras e procurar contradição: se a fala calculada não combina com o tipo suposto, a hipótese cai.",
     "O segundo modelo é o dos testemunhos com regra global: “só um diz a verdade”, “exatamente dois mentem”, “o culpado mente e os inocentes dizem a verdade”. A incógnita deixa de ser o tipo de cada um e passa a ser um fato do mundo (quem é o culpado, qual caixa tem o documento). Teste cada valor possível do fato, avalie todas as falas e conte quantas resultam verdadeiras; a única hipótese cuja contagem obedece à regra é a resposta. A tabela com uma linha para cada hipótese e uma coluna para cada fala é a ferramenta natural.",
     "Em ambos os modelos, saber negar é indispensável. Quando um mentiroso afirma “A e B”, só se pode concluir “não A ou não B”, isto é, ao menos uma das partes é falsa. Quando afirma “A ou B”, as duas são falsas. Quando afirma “se A então B”, A é verdadeira e B é falsa, a única situação em que a condicional é falsa. Em contrapartida, um mentiroso nunca pode dizer uma condicional cujo antecedente seja falso, pois ela seria verdadeira. Este último detalhe, a condicional com antecedente falso, é onde mais se erra."
    ],
    "example": "Exemplo resolvido: Ari diz “Bia e eu somos do mesmo tipo”. Se Ari é cavaleiro, a fala é verdadeira, e Bia é cavaleira. Se Ari é mentiroso, a fala é falsa, e Bia é de tipo diferente do dele, isto é, cavaleira. Nos dois casos Bia é cavaleira.",
    "development": [
     "Algumas falas são atalhos, válidos para dois falantes. Quem diz “somos ambos mentirosos” só pode ser mentiroso, pois um cavaleiro não poderia dizê-lo com verdade; e, sendo falsa a fala, o outro é cavaleiro. Quem diz “pelo menos um de nós é mentiroso” só pode ser cavaleiro: um mentiroso, ao dizê-lo, tornaria a fala falsa, exigindo que ninguém fosse mentiroso, o que contradiz o fato de ele mesmo ser mentiroso. A fala “somos do mesmo tipo” prova que o interlocutor é cavaleiro, e “somos de tipos diferentes” prova que é mentiroso, como no exemplo resolvido deste capítulo, em que o primeiro caso vale para o cavaleiro e o segundo para o mentiroso. Esses padrões economizam hipóteses.",
     "Nos testemunhos contraditórios, explore o par de falas opostas: se uma afirma P e outra afirma não P, exatamente uma delas é verdadeira; as demais, se a regra permite só uma verdadeira, serão falsas. Conhecidos os valores de verdade de algumas falas, descubra o que elas implicam sobre os fatos. Enunciados com relacionamentos (“se Davi é culpado, então Bruno é cúmplice”) combinam o mesmo raciocínio com a condicional: avalie o antecedente primeiro, e só depois o consequente. Um raciocínio com mais de três pessoas deve usar a tabela de hipóteses, para não se perder em cadeias de “se ele é cavaleiro, então…”."
    ],
    "method": [
     "Defina o tipo de problema: tipos fixos (cavaleiro ou mentiroso) ou testemunhos com regra global, e escreva essa regra.",
     "Escolha a incógnita que gera menos hipóteses: o tipo de uma pessoa muito citada ou o fato central (culpado).",
     "Para cada hipótese, calcule o valor de cada fala; no modelo de tipos, compare com o tipo do falante; no modelo global, conte as falas verdadeiras.",
     "Descarte as hipóteses com contradição e confirme que sobrou exatamente uma.",
     "Releia o enunciado com a resposta encontrada e confira cada fala, com atenção às condicionais."
    ],
    "workedExamples": [
     {
      "prompt": "Em uma ilha, cada habitante é cavaleiro (só diz a verdade) ou mentiroso (só diz mentira). Três habitantes se manifestam. Dante: “Elis é mentirosa.” Elis: “Fausto é cavaleiro.” Fausto: “Dante e Elis são de tipos diferentes.” Determine o tipo de cada um.",
      "steps": [
       "Escolha a incógnita: o tipo de Elis, citada por Dante e autora de uma fala sobre Fausto.",
       "Hipótese 1: Elis é cavaleira. Sua fala é verdadeira, então Fausto é cavaleiro. A fala de Fausto é verdadeira: Dante e Elis têm tipos diferentes, e como Elis é cavaleira, Dante é mentiroso. Teste: Dante, mentiroso, diz “Elis é mentirosa”, o que é falso (Elis é cavaleira), como deve ser. Sem contradição.",
       "Hipótese 2: Elis é mentirosa. Sua fala é falsa, então Fausto não é cavaleiro: é mentiroso. A fala de Fausto é falsa, então Dante e Elis têm o mesmo tipo: Dante é mentiroso. Teste: Dante, mentiroso, diz “Elis é mentirosa”, o que é verdadeiro (Elis é mentirosa). Um mentiroso disse uma verdade: contradição, a hipótese cai.",
       "Só a hipótese 1 sobrevive, e ela determina os três tipos."
      ],
      "answer": "Dante é mentiroso; Elis e Fausto são cavaleiros."
     },
     {
      "prompt": "Alguém deixou uma janela do cartório aberta: foi exatamente um entre Gabi, Hugo, Íris e Jonas. No depoimento, o culpado mentiu e os três inocentes disseram a verdade. Gabi: “Foi o Hugo ou o Jonas.” Hugo: “Foi a Íris ou o Jonas.” Íris: “Não foi o Jonas.” Jonas: “Foi o Hugo.” Quem deixou a janela aberta?",
      "steps": [
       "A incógnita é o culpado. A regra exige que a fala do culpado seja falsa e as outras três sejam verdadeiras. Avalie cada fala em cada hipótese.",
       "Culpado = Gabi: Gabi F (não foi Hugo nem Jonas), Hugo F (não foi Íris nem Jonas), Íris V, Jonas F. Hugo, inocente, teria de dizer a verdade: descartado.",
       "Culpado = Hugo: Gabi V (foi o Hugo), Hugo F (não foi Íris nem Jonas), Íris V (não foi o Jonas), Jonas V (foi o Hugo). Só o culpado falou falsidade: confere.",
       "Culpado = Íris: Gabi F; mas Gabi, inocente, deveria dizer a verdade: descartado. Culpado = Jonas: Íris F (foi o Jonas), mas Íris é inocente: descartado.",
       "Apenas Hugo satisfaz a regra. Conferência: as quatro falas se avaliam como na hipótese do Hugo, acima."
      ],
      "answer": "Hugo deixou a janela aberta."
     },
     {
      "prompt": "Em uma ilha, cada habitante é cavaleiro ou mentiroso. Quatro deles falam. Ana: “Se Davi é cavaleiro, então Bruno é mentiroso.” Bruno: “Ana e Davi são de tipos diferentes.” Carla: “Bruno ou Davi é cavaleiro.” Davi: “Bruno é cavaleiro.” Determine o tipo de cada um.",
      "steps": [
       "A fala de Davi liga Davi a Bruno e aparece na condicional de Ana; escolha o tipo de Davi como incógnita.",
       "Hipótese 1: Davi é cavaleiro. Sua fala é verdadeira: Bruno é cavaleiro. Ana diz “se Davi é cavaleiro, então Bruno é mentiroso”: o antecedente é verdadeiro e o consequente é falso, então a condicional é falsa; Ana é mentirosa. Bruno, cavaleiro, diz que Ana e Davi têm tipos diferentes: Ana é mentirosa e Davi é cavaleiro, verdadeiro. Carla diz “Bruno ou Davi é cavaleiro”: verdadeiro, logo Carla é cavaleira. Nenhuma contradição.",
       "Hipótese 2: Davi é mentiroso. Sua fala é falsa: Bruno não é cavaleiro, é mentiroso. A fala de Bruno é falsa: Ana e Davi têm o mesmo tipo, então Ana é mentirosa. Ana diz “se Davi é cavaleiro, então Bruno é mentiroso”: o antecedente é falso, então a condicional é verdadeira. Uma mentirosa disse uma verdade: contradição, a hipótese cai.",
       "Só a hipótese 1 sobrevive, e Carla é cavaleira por consequência da fala dela."
      ],
      "answer": "Ana é mentirosa; Bruno, Carla e Davi são cavaleiros."
     }
    ],
    "pitfall": "Tratar a condicional com antecedente falso como se fosse falsa. “Se A então B” só é falsa quando A é verdadeira e B é falsa; com A falsa ela é verdadeira, e por isso um mentiroso nunca poderia dizê-la. Outro deslize comum é negar “A e B” como “não A e não B”: a negação correta é “não A ou não B”.",
    "tables": [
     {
      "caption": "O que cada fala exige do falante",
      "headers": [
       "Fala",
       "Se o falante é cavaleiro",
       "Se o falante é mentiroso"
      ],
      "rows": [
       [
        "“Somos do mesmo tipo.”",
        "o outro é cavaleiro",
        "o outro é cavaleiro (tipos diferentes)"
       ],
       [
        "“Somos de tipos diferentes.”",
        "o outro é mentiroso",
        "o outro é mentiroso (mesmo tipo)"
       ],
       [
        "“Pelo menos um de nós é mentiroso.”",
        "possível, com outro mentiroso",
        "impossível"
       ],
       [
        "“Todos nós somos mentirosos.”",
        "impossível",
        "possível, com algum cavaleiro entre nós"
       ],
       [
        "“Se A então B.”",
        "A é falsa, ou B é verdadeira",
        "A é verdadeira e B é falsa"
       ]
      ]
     }
    ],
    "resumo": {
     "title": "Verdade e mentira",
     "text": "A fala é verdadeira se e somente se o falante é cavaleiro; teste uma hipótese, calcule as falas e descarte a que gerar contradição.",
     "bizu": "Condicional com antecedente falso é verdadeira: mentiroso nunca a diz."
    }
   }
  ]
 },
 "M07": {
  "extras": [
   {
    "capitulo": 1,
    "development": [
     "Um texto curto pode ser mal lido de duas maneiras: dando a ele menos do que diz ou mais do que diz. Dar menos é ignorar uma restrição expressa, como o 'somente' ou o 'nenhum'. Dar mais é completar a lacuna com o que você acha que acontece na vida real. A regra de trabalho é simples: a conclusão precisa decorrer das frases escritas, e não do que seria razoável esperar. Quando a informação não basta, a resposta correta é que nada se pode concluir, e isso também é um resultado do raciocínio. Em analogias vale o mesmo cuidado: o par escolhido deve repetir a relação do primeiro, e não apenas pertencer ao mesmo assunto.",
     "Palavras de restrição mudam a direção de uma frase. 'Todo servidor do setor usa crachá' diz que ser do setor basta para usar crachá. 'Somente quem usa crachá entra na sala' diz o contrário: usar crachá é necessário para entrar, mas não garante a entrada. Duas frases com os mesmos termos podem, portanto, autorizar conclusões diferentes. Antes de concluir, reescreva a frase na forma 'se ..., então ...' e confira qual termo vem depois do 'então'. Esse termo é o que fica garantido; o que vem antes é apenas a condição."
    ],
    "workedExamples": [
     {
      "prompt": "Complete pela relação parte–todo: dedo : mão :: pétala : ?",
      "steps": [
       "Frase de relação do primeiro par: 'o dedo é parte da mão'.",
       "Transportando a frase para o segundo par, a lacuna deve ser o todo do qual a pétala é parte: 'a pétala é parte da ...'.",
       "Termos como 'perfume' (algo associado à pétala) ou 'jardim' (lugar onde há pétalas) mantêm só o assunto, não a relação; e 'caule' é outra parte, não o todo."
      ],
      "answer": "Flor."
     },
     {
      "prompt": "Somente quem tem crachá entra na sala de arquivo. Paulo entrou na sala. Carla tem crachá. Ana não tem crachá. O que se pode concluir sobre cada um?",
      "steps": [
       "Escreva a regra como condicional: entrou na sala → tem crachá. O crachá é condição necessária, não suficiente.",
       "Paulo entrou; logo, tem crachá (afirma-se o antecedente, garante-se o consequente).",
       "Ana não tem crachá. Pela contrapositiva (não tem crachá → não entrou), Ana não entrou.",
       "Carla tem crachá, mas isso é o consequente da regra: ter crachá não garante a entrada. Nada se conclui sobre Carla."
      ],
      "answer": "Paulo tem crachá e Ana não entrou; sobre Carla, não se pode concluir se entrou ou não."
     }
    ],
    "tables": []
   },
   {
    "capitulo": 2,
    "development": [
     "Um critério bem formulado funciona como uma pergunta de resposta sim ou não que pode ser feita a cada objeto do universo. 'É múltiplo de 5?' é um bom critério; 'é um número interessante?' não é. A definição também fixa os casos de fronteira: 'maior que 10' exclui o 10, 'maior ou igual a 10' o inclui, e 'positivo' exclui o zero, enquanto 'não negativo' o inclui. Quando um enunciado diz 'menor que 15', o número 15 está fora, mesmo que pareça natural incluí-lo. Por isso, antes de listar elementos, escreva o universo e os limites com as palavras do enunciado.",
     "Muitos conceitos aritméticos são definidos por contagem, e não por uma fórmula visível. 'Número primo' é o que tem exatamente dois divisores positivos; 'quadrado perfeito' é o que tem raiz inteira. Quando o critério é a quantidade de divisores, a saída é raciocinar sobre a estrutura: um número com exatamente três divisores tem divisores 1, p e p^2, ou seja, n é o quadrado de um primo p. Esse tipo de raciocínio é mais seguro do que testar número por número, porque explica por que os candidatos aparecem e por que os demais ficam de fora."
    ],
    "workedExamples": [
     {
      "prompt": "No universo dos inteiros de 1 a 50, quais números são quadrados perfeitos e também ímpares?",
      "steps": [
       "Quadrados perfeitos até 50: 1^2=1, 2^2=4, 3^2=9, 4^2=16, 5^2=25, 6^2=36 e 7^2=49. O próximo, 8^2=64, passa de 50.",
       "Mantenha só os ímpares: 1, 9, 25 e 49. O quadrado de um número ímpar é ímpar, o que explica por que são justamente os quadrados de 1, 3, 5 e 7.",
       "Conferência: 4, 16 e 36 são pares e saem."
      ],
      "answer": "1, 9, 25 e 49 (quatro números)."
     },
     {
      "prompt": "No universo dos inteiros de 1 a 30, quais números têm exatamente três divisores positivos?",
      "steps": [
       "Um número com exatamente três divisores positivos tem divisores 1, d e n. Se d tivesse outro divisor além de 1 e d, esse divisor também dividiria n, e haveria mais de três; logo d é primo e n = d^2.",
       "Quadrados de primos até 30: 2^2=4, 3^2=9, 5^2=25. O próximo, 7^2=49, passa de 30.",
       "Conferência: 4 tem divisores 1, 2, 4; 9 tem 1, 3, 9; 25 tem 1, 5, 25. Já 16 tem cinco divisores (1, 2, 4, 8, 16) e 6 tem quatro (1, 2, 3, 6); o 1 tem apenas um divisor e os primos têm dois."
      ],
      "answer": "4, 9 e 25."
     }
    ],
    "tables": [
     {
      "caption": "Quantidade de divisores positivos de alguns números",
      "headers": [
       "Número",
       "Divisores",
       "Quantidade"
      ],
      "rows": [
       [
        "1",
        "1",
        "1"
       ],
       [
        "7",
        "1, 7",
        "2"
       ],
       [
        "4",
        "1, 2, 4",
        "3"
       ],
       [
        "6",
        "1, 2, 3, 6",
        "4"
       ],
       [
        "16",
        "1, 2, 4, 8, 16",
        "5"
       ]
      ]
     }
    ]
   },
   {
    "capitulo": 3,
    "development": [
     "O elemento discrepante só existe quando o grupo se divide em um contra todos. Se um critério separa quatro itens de um, o item isolado é o intruso. Se separa três de dois, não há intruso único e o critério não serve. Essa contagem evita um erro comum: encontrar uma propriedade que 'explica' o item escolhido e não conferir se ela também separa outros. Um atributo útil precisa ser compartilhado por todos os itens restantes e ausente exatamente no escolhido. Testar também um segundo atributo é prudente: se ele isolar o mesmo item, a resposta fica reforçada; se isolar outro, o enunciado precisa dizer qual critério vale.",
     "Itens numéricos admitem atributos de natureza diferente: divisibilidade, paridade, ser quadrado perfeito, ser primo, ou relação entre pares de números. Na falta de declaração, prefira atributos que pertencem ao conceito (por exemplo, ser múltiplo de 6) a coincidências de apresentação, como o número de algarismos ou o fato de ser o menor da lista. Qualquer lista tem algum item que é o menor, o maior ou o primeiro; essas posições não são um critério lógico, a menos que o enunciado as nomeie. Em conjuntos de pares, a relação interna (por exemplo, 'o segundo é o quadrado do primeiro') tem a mesma força de um atributo."
    ],
    "workedExamples": [
     {
      "prompt": "Entre 12, 18, 24, 30 e 35, qual é o único que não tem uma propriedade que os outros quatro têm?",
      "steps": [
       "Monte a tabela de atributos para cada número: 12, 18, 24 e 30 são pares e múltiplos de 3 e de 6; o 35 não é par, não é múltiplo de 3 e não é múltiplo de 6.",
       "O atributo 'múltiplo de 4' não separa um item dos demais: só 12 e 24 o têm (divisão 2 contra 3), então não serve como critério.",
       "Os atributos 'par', 'múltiplo de 3' e 'múltiplo de 6' isolam o mesmo item, o 35, o que torna a resposta segura.",
       "Atenção ao sentido do critério: propriedades que só um item possui (por exemplo, 'múltiplo de 9', só o 18, ou 'múltiplo de 8', só o 24) isolam outros itens, mas não são propriedades compartilhadas pelos demais; por isso o critério pedido é o que os quatro têm em comum."
      ],
      "answer": "35, o único que não é múltiplo de 6 (nem par, nem múltiplo de 3)."
     },
     {
      "prompt": "Entre os pares (4, 16), (3, 9), (5, 25), (6, 30) e (7, 49), qual não segue a relação que os outros quatro pares têm em comum?",
      "steps": [
       "Teste a relação do primeiro par: 4^2 = 16. A relação candidata é 'o segundo número é o quadrado do primeiro'.",
       "Teste em todos: 3^2 = 9, 5^2 = 25, 7^2 = 49. Os quatro confirmam.",
       "No par (6, 30), 6^2 = 36, e não 30. O par viola a relação (30 é o produto de 6 por 5, uma regra que não serve aos demais pares).",
       "Outras regras simples, como multiplicar sempre pelo mesmo número, não descrevem os quatro pares ao mesmo tempo (4 para 16 é vezes 4, mas 3 para 9 é vezes 3); só a relação do quadrado cobre quatro dos cinco."
      ],
      "answer": "O par (6, 30)."
     }
    ],
    "tables": [
     {
      "caption": "Tabela de atributos para 12, 18, 24, 30 e 35",
      "headers": [
       "Número",
       "Par",
       "Múltiplo de 3",
       "Múltiplo de 4",
       "Múltiplo de 6"
      ],
      "rows": [
       [
        "12",
        "sim",
        "sim",
        "sim",
        "sim"
       ],
       [
        "18",
        "sim",
        "sim",
        "não",
        "sim"
       ],
       [
        "24",
        "sim",
        "sim",
        "sim",
        "sim"
       ],
       [
        "30",
        "sim",
        "sim",
        "não",
        "sim"
       ],
       [
        "35",
        "não",
        "não",
        "não",
        "não"
       ]
      ]
     }
    ]
   },
   {
    "capitulo": 4,
    "development": [
     "Relações de ordem têm propriedades que decidem o que se pode concluir. 'Ser mais velho que' e 'chegar antes de' são transitivas e assimétricas: se A vem antes de B e B antes de C, então A vem antes de C, e B não pode vir antes de A. Já 'ser vizinho de' e 'ser colega de' são simétricas e não transitivas: de A vizinho de B e B vizinho de C não decorre que A seja vizinho de C. Para ordenar elementos, parta das relações dadas e una as cadeias; só conclua o que a cadeia garante. Se duas posições não se ligam por nenhuma cadeia, a ordem entre elas é indeterminada.",
     "Por isso, em problemas de ordenação há três respostas possíveis para cada pergunta: sim, necessariamente; não, necessariamente; ou não se pode determinar. A terceira é a mais frequente quando o enunciado é pouco informativo e é a que mais pega o aluno apressado. Para descobrir se uma ordem é necessária, procure uma disposição compatível com todos os dados em que a afirmação falhe. Se existir, a afirmação não é necessária. Se todas as disposições compatíveis a confirmarem, ela é necessária. Esse teste do contraexemplo vale para qualquer relação de ordem: de tamanho, de idade, de data ou de posição em uma fila."
    ],
    "workedExamples": [
     {
      "prompt": "Dora é mais velha que Ana; Ana é mais velha que Beto; Carla é mais nova que Beto. Dispondo as quatro do mais velho para o mais novo, qual é a ordem? Quem é a segunda mais nova?",
      "steps": [
       "Una as cadeias: Dora > Ana, Ana > Beto e Beto > Carla (Carla é mais nova que Beto).",
       "Pela transitividade, Dora > Ana > Beto > Carla. Todas as relações são consecutivas, de modo que a ordem é única.",
       "A mais nova é Carla; a segunda mais nova é Beto."
      ],
      "answer": "Dora, Ana, Beto, Carla; a segunda mais nova é Beto."
     },
     {
      "prompt": "Em uma semana, a reunião de planejamento ocorre antes da de revisão, e a de revisão antes da de fechamento. A reunião de orçamento ocorre antes da de fechamento, sem nenhuma outra informação. Necessariamente a de planejamento ocorre antes da de orçamento?",
      "steps": [
       "Sejam P, R, F e O as reuniões de planejamento, revisão, fechamento e orçamento. Dados: P antes de R, R antes de F, O antes de F. Pela transitividade, P antes de F.",
       "Liste as ordens possíveis (as quatro reuniões, com F por último): P R O F, P O R F e O P R F.",
       "Na ordem O P R F, a reunião de orçamento vem antes da de planejamento; logo, a afirmação falha em ao menos uma ordem compatível.",
       "Só é necessário que P, R e O venham antes de F; a posição de O em relação a P e R não é determinada."
      ],
      "answer": "Não é necessário: as ordens P R O F, P O R F e O P R F são todas compatíveis."
     }
    ],
    "tables": [
     {
      "caption": "Propriedades de algumas relações",
      "headers": [
       "Relação",
       "Simétrica",
       "Transitiva"
      ],
      "rows": [
       [
        "ser mais velho que",
        "não",
        "sim"
       ],
       [
        "chegar antes de",
        "não",
        "sim"
       ],
       [
        "ser vizinho de",
        "sim",
        "não"
       ],
       [
        "ser maior que (números)",
        "não",
        "sim"
       ]
      ]
     }
    ]
   },
   {
    "capitulo": 5,
    "development": [
     "As palavras 'e', 'ou' e 'não' mudam muito a lista de candidatos. 'E' exige as duas condições (interseção); 'ou' exige ao menos uma (união) e, por padrão, inclui quem cumpre as duas; 'não' retira da lista quem cumpre a condição. Em um critério como 'múltiplo de 4 ou de 6, mas não de 12', os parênteses estão implícitos: primeiro se forma a união (múltiplo de 4 ou de 6) e só depois se retira o que é múltiplo de 12. Inverter essa ordem mudaria o resultado. Quando o texto vem em frase corrida, leia-o como se tivesse parênteses e escreva a ordem de aplicação.",
     "Para conferir o resultado, use a contagem. A união de dois grupos tem tantos elementos quanto a soma dos grupos menos a interseção, pois os elementos comuns foram contados duas vezes. Se a lista final tiver um número diferente do que a contagem prevê, há erro de filtragem. Esse recurso serve também para descobrir quantos elementos sobrevivem a uma restrição, sem precisar listar tudo, desde que se saiba quantos são os múltiplos de cada número no universo. Quanto mais condições o enunciado empilha, mais vale registrar, em uma linha, o que cada filtro retirou e por quê."
    ],
    "workedExamples": [
     {
      "prompt": "No universo dos inteiros de 1 a 60, quais números são múltiplos de 4 ou de 6, mas não são múltiplos de 12? Quantos são?",
      "steps": [
       "Múltiplos de 4 até 60: 15 números (4, 8, ..., 60). Múltiplos de 6: 10 números (6, 12, ..., 60). Múltiplos de 12: 5 números (12, 24, 36, 48, 60), que estão nos dois grupos.",
       "União: 15 + 10 − 5 = 20 números. Como todo múltiplo de 12 é múltiplo de 4 e de 6, os 5 estão na união; retirando-os, restam 20 − 5 = 15.",
       "Lista final: 4, 6, 8, 16, 18, 20, 28, 30, 32, 40, 42, 44, 52, 54 e 56. São 15 números, o que confere com a contagem."
      ],
      "answer": "4, 6, 8, 16, 18, 20, 28, 30, 32, 40, 42, 44, 52, 54 e 56 (15 números)."
     },
     {
      "prompt": "Entre os números de dois algarismos, quais são pares, têm soma dos algarismos igual a 9 e não são múltiplos de 4?",
      "steps": [
       "Seja t o algarismo das dezenas e u o das unidades, com t + u = 9. Como o número deve ser par, u é par; então t = 9 − u é ímpar. Com t = 1, 3, 5, 7, 9: 18, 36, 54, 72, 90.",
       "A soma dos algarismos ser 9 faz o número ser múltiplo de 9 (e de 3), mas isso não ajuda aqui: o filtro é 'não múltiplo de 4'.",
       "Teste: 18 ÷ 4 = 4,5 (fica); 36 ÷ 4 = 9 (sai); 54 ÷ 4 = 13,5 (fica); 72 ÷ 4 = 18 (sai); 90 ÷ 4 = 22,5 (fica)."
      ],
      "answer": "18, 54 e 90."
     }
    ],
    "tables": [
     {
      "caption": "Como ler os conectivos em critérios",
      "headers": [
       "Palavra",
       "Operação",
       "Efeito na lista"
      ],
      "rows": [
       [
        "e",
        "interseção",
        "mantém só quem cumpre as duas condições"
       ],
       [
        "ou",
        "união",
        "mantém quem cumpre ao menos uma"
       ],
       [
        "não",
        "complemento",
        "retira quem cumpre a condição"
       ],
       [
        "ou ... ou",
        "exclusivo",
        "mantém quem cumpre exatamente uma"
       ]
      ]
     }
    ]
   }
  ],
  "novosCapitulos": [
   {
    "title": "Analogias: tipos de relação e a frase de relação",
    "paragraphs": [
     "Uma analogia 'A : B :: C : D' lê-se 'A está para B assim como C está para D'. O que se repete de um par para o outro não são as palavras nem o assunto, e sim a relação. Por isso o primeiro trabalho é dar nome à relação entre A e B. Os tipos mais cobrados são: parte–todo (roda : carro), causa–efeito (chuva forte : enchente), gênero–espécie (veículo : ônibus), instrumento–função (tesoura : cortar), agente–ação (motorista : dirigir), antonímia (subir : descer), grau ou intensidade (morno : quente) e sequência (segunda-feira : terça-feira). Cada tipo tem um verbo característico, e é esse verbo que você usará para testar os pares.",
     "O método mais seguro é a frase de relação: escreva uma frase curta, com verbo, que una o primeiro par, como 'o dedo é parte da mão', e teste essa mesma frase, sem mudar uma palavra, no segundo par. Se a frase continuar verdadeira, a relação foi mantida. Uma frase vaga, como 'tem a ver com', serve para qualquer par e por isso não ajuda. A frase deve ser tão específica quanto a relação permitir: 'é um tipo de', 'é parte de', 'serve para', 'produz', 'é o contrário de'. Evite, por exemplo, 'está perto de', que descreve circunstância e não uma relação lógica estável. Se a sua frase não puder ser dita de forma natural no segundo par, ou a frase ou o candidato estão errados.",
     "Há uma armadilha que derruba muita gente: a relação invertida. Se o primeiro par é 'espécie : gênero' (cadeira : móvel), o segundo precisa ser 'espécie : gênero' também (ônibus : veículo); 'veículo : ônibus' usa a mesma relação, mas no sentido contrário, e por isso não forma uma analogia. A inversão é possível nas relações com direção (parte–todo, causa–efeito, gênero–espécie, agente–ação). Já a antonímia é simétrica: 'alto : baixo' e 'baixo : alto' dizem o mesmo. Ao ler uma analogia, pergunte primeiro se a relação tem direção; se tiver, a ordem dos termos faz parte da resposta."
    ],
    "example": "Exemplo resolvido: cadeira : móvel :: ônibus : ? A frase de relação é 'a cadeira é um tipo de móvel' (espécie : gênero). No segundo par, 'o ônibus é um tipo de veículo'. A resposta é veículo; 'motorista' (agente) ou 'estrada' (lugar) apenas estão no mesmo assunto.",
    "development": [
     "As variações de enunciado mudam só o ponto em que a lacuna aparece. Pode faltar o quarto termo ('A : B :: C : ?'), o primeiro ('? : B :: C : D') ou pode pedir o par que mantém a relação. O método é o mesmo: escreva a frase com o par completo e depois preencha a lacuna. Se faltar o primeiro termo, a frase do segundo par diz que papel ele desempenha: em '? : mão :: pétala : flor', a pétala é parte da flor, logo o termo ausente é uma parte da mão. Em relações numéricas (metro : quilômetro :: grama : ?), a frase pode ser quantitativa: 'o segundo é mil vezes o primeiro'; o termo ausente é o quilograma.",
     "Quando dois candidatos parecem ajustar-se, compare a especificidade das frases. 'Serve para' é mais larga do que 'mede'. Se o primeiro par é termômetro : temperatura, a frase 'o termômetro mede a temperatura' exclui candidatos que apenas 'servem para' outra coisa. Procure também palavras com mais de um sentido; escolha o sentido que mantém a relação do primeiro par e descarte o outro. Em exercícios desse tipo, as relações costumam ser básicas, e a dificuldade está em manter a direção, e não em conhecimento especializado."
    ],
    "method": [
     "Dê nome aos papéis: diga o que cada termo do primeiro par é em relação ao outro (parte, todo, causa, efeito, espécie, gênero, instrumento, função...).",
     "Escreva a frase de relação do primeiro par, com verbo e direção.",
     "Teste a mesma frase no segundo par, sem mudar uma palavra; só vale o candidato que torna a frase verdadeira.",
     "Confirme a direção: se invertesse os termos, a frase continuaria verdadeira? Se não, a relação é direcional e a inversão é um erro.",
     "Descarte candidatos apenas ligados ao assunto e, se restarem dois, fique com o da frase mais específica."
    ],
    "workedExamples": [
     {
      "prompt": "Complete pela relação agente–produto típico do ofício: pedreiro : parede :: marceneiro : ? (responda com o termo geral).",
      "steps": [
       "Papéis: o pedreiro é o agente (o profissional); a parede é o que ele produz.",
       "Frase de relação: 'o pedreiro constrói a parede'.",
       "Teste no segundo par: 'o marceneiro constrói o ...'. O produto geral do ofício é o móvel. 'Madeira' é matéria-prima e 'serra' é instrumento: relações diferentes."
      ],
      "answer": "Móvel."
     },
     {
      "prompt": "Complete pela relação espécie–gênero usual: mesa : móvel :: ônibus : ?  Em seguida, explique por que 'ônibus : veículo' e 'veículo : ônibus' não formam a mesma analogia com a primeira.",
      "steps": [
       "Frase de relação: 'a mesa é um tipo de móvel' (espécie : gênero).",
       "No segundo par: 'o ônibus é um tipo de ...' → veículo.",
       "Inversão: 'veículo : ônibus' diria 'o veículo é um tipo de ônibus', o que é falso (nem todo veículo é ônibus). A relação gênero–espécie tem direção, e o segundo par deve repeti-la."
      ],
      "answer": "Veículo; 'ônibus : veículo' mantém espécie : gênero, enquanto 'veículo : ônibus' inverte a direção."
     },
     {
      "prompt": "Complete pela relação de operação inversa: dobro : metade :: triplo : ?",
      "steps": [
       "Frase de relação: dobro de x é 2 vezes x (multiplicar por 2); metade de x é x dividido por 2 (dividir por 2). O segundo termo desfaz o primeiro: 'a metade é a operação inversa do dobro'.",
       "No segundo par, o triplo é multiplicar por 3; a operação inversa é dividir por 3, isto é, a terça parte (o terço).",
       "Teste numérico: 3 × 6 = 18 e 18 ÷ 3 = 6; já 'quádruplo' (multiplicar por 4) repetiria a mesma direção do primeiro termo, e não a inversa."
      ],
      "answer": "Terço (a terça parte)."
     }
    ],
    "pitfall": "Escolher o termo que 'combina com o assunto' sem escrever a frase de relação, ou aceitar o par com a relação certa, mas na direção invertida. Antes de responder, diga a frase em voz alta com os termos do segundo par.",
    "tables": [
     {
      "caption": "Tipos de relação, frase de teste e exemplo",
      "headers": [
       "Tipo",
       "Frase de teste",
       "Exemplo"
      ],
      "rows": [
       [
        "Parte–todo",
        "X é parte de Y",
        "roda : carro"
       ],
       [
        "Causa–efeito",
        "X provoca Y",
        "chuva forte : enchente"
       ],
       [
        "Gênero–espécie",
        "X é um tipo de Y",
        "ônibus : veículo"
       ],
       [
        "Instrumento–função",
        "X serve para Y",
        "tesoura : cortar"
       ],
       [
        "Agente–ação",
        "X executa Y",
        "motorista : dirigir"
       ],
       [
        "Antonímia",
        "X é o contrário de Y",
        "subir : descer"
       ],
       [
        "Grau",
        "X é mais fraco que Y",
        "morno : quente"
       ],
       [
        "Sequência",
        "X vem antes de Y",
        "segunda-feira : terça-feira"
       ]
      ]
     }
    ],
    "resumo": {
     "title": "Frase de relação",
     "text": "Escreva a relação do primeiro par em uma frase com verbo e direção e teste a mesma frase no segundo par.",
     "bizu": "Relação invertida é o erro clássico: confira quem é parte, causa ou espécie."
    }
   },
   {
    "title": "Classificação, agrupamento e elemento discrepante",
    "paragraphs": [
     "Classificar é distribuir itens em grupos a partir de um critério, que pode ser de quatro tipos: categoria (a que classe pertence: profissão, ferramenta, figura geométrica), função (para que serve), característica (uma propriedade observável ou numérica, como ser par ou múltiplo de 5) e ordem (posição numa sequência, como alfabética ou crescente). Um bom critério é uma pergunta que pode ser feita a todos os itens e que tem resposta clara. 'Serve para escrever?' funciona; 'é bonito?' não. Antes de qualquer cálculo ou escolha, decida qual dos quatro tipos de critério está em jogo, porque ele indica onde procurar a diferença entre os itens.",
     "Uma boa classificação tem categorias exaustivas e excludentes. Exaustivas: todo item cabe em ao menos uma categoria. Excludentes: nenhum item cabe em duas. Os grupos 'primo' e 'composto', aplicados aos números de 1 a 20, não são exaustivos, porque o 1 não é primo nem composto (são 8 primos, 11 compostos e o 1, no total de 20). Já 'par' e 'múltiplo de 3', aplicados aos de 1 a 30, não são excludentes, porque 6, 12, 18, 24 e 30 pertencem aos dois. A correção é criar categorias que combinem os critérios: par e múltiplo de 3, par e não múltiplo de 3, ímpar e múltiplo de 3, ímpar e não múltiplo de 3.",
     "O elemento discrepante (o intruso) é o item que não tem a propriedade que todos os outros têm. O método é uma tabela de atributos: nas linhas, os itens; nas colunas, os atributos candidatos, com 'sim' ou 'não'. Um atributo vale como critério quando um único item destoa dos demais. Se mais de um atributo isola o mesmo item, a resposta está reforçada. Se atributos diferentes isolam itens diferentes, o enunciado precisa declarar o critério, e a resposta só vale com ele. Em todos os casos, a justificativa deve citar um único critério, e não uma mistura de motivos."
    ],
    "example": "Exemplo resolvido: caneta, lápis, giz, marcador e caderno. Critério de função: quatro itens servem para escrever ou marcar; o caderno é o suporte em que se escreve. O caderno é o intruso. O atributo 'contém tinta' (caneta e marcador sim; lápis, giz e caderno não) separa dois contra três e não serve.",
    "development": [
     "As variações de enunciado incluem 'qual não pertence ao grupo', 'qual par destoa', 'quantos grupos distintos há' e 'em que grupo se encaixa o item X'. Em todas, o ponto de partida é identificar o critério. O critério pode combinar dois atributos ('múltiplo de 3 e par'), e nesse caso a tabela deve ter uma coluna para cada atributo e outra para a combinação. Quando o critério é de ordem, como 'alfabética crescente', o intruso é o item que quebra a sequência. Lembre-se de que o grupo é definido pelo que os demais têm em comum, e não pelo que o intruso tem de especial: dizer 'só o 12 tem dois algarismos' não é um critério se os outros itens não compartilham uma propriedade.",
     "Há uma regra de segurança importante: se o critério divide o grupo em três e dois, não há intruso único. E se mais de um atributo razoável isola itens diferentes, é preciso desconfiar. Com os meses janeiro, março, maio, junho e julho, o número de dias isola junho (30 dias, contra 31 dos demais), mas a contagem de letras (7, 5, 4, 5 e 5) destaca dois itens diferentes (janeiro e maio) e não um só. Conferir esse segundo atributo é o que impede o erro de escolher o intruso pelo motivo errado. Atributos gráficos (letra inicial, comprimento da palavra) só valem quando o enunciado os declara."
    ],
    "method": [
     "Liste os atributos candidatos nos quatro tipos de critério: categoria, função, característica e ordem.",
     "Monte a tabela de itens por atributos, com 'sim' ou 'não' em cada célula.",
     "Procure a coluna em que um único item difere de todos os demais (um contra todos, e não dois contra três).",
     "Se várias colunas isolam o mesmo item, a resposta é segura; se isolam itens diferentes, só vale o critério declarado no enunciado.",
     "Escreva a justificativa em uma frase: 'todos os outros ...; só X não ...', e diga por que ao menos um outro atributo não separa."
    ],
    "workedExamples": [
     {
      "prompt": "Entre caneta, lápis, giz, marcador e caderno, qual destoa pelo critério de função (para que serve)? Mostre que 'contém tinta' não separa um único item.",
      "steps": [
       "Tabela, critério 'serve para escrever ou marcar': caneta sim, lápis sim, giz sim, marcador sim, caderno não. Um item contra quatro.",
       "Critério 'contém tinta': caneta sim, lápis não, giz não, marcador sim, caderno não. Dois contra três: não é critério.",
       "Critério 'tem folhas de papel': só o caderno. Isola o mesmo item, o que reforça a resposta.",
       "Outros atributos, como 'deixa pó' (só o giz) ou 'pode ser apagado com borracha' (só o lápis), isolariam outros itens; por isso o critério precisa ser declarado, aqui o de função."
      ],
      "answer": "Caderno: é o único que não serve para escrever ou marcar (é suporte)."
     },
     {
      "prompt": "Considere os meses janeiro, março, maio, junho e julho, em ano comum. Pelo critério 'número de dias do mês', qual destoa? A contagem de letras daria um critério melhor?",
      "steps": [
       "Dias: janeiro 31, março 31, maio 31, junho 30, julho 31. Quatro meses têm 31 dias; um tem 30.",
       "Letras: janeiro 7, março 5, maio 4, junho 5, julho 5. Os valores 5 aparecem três vezes, e 7 e 4 uma vez cada: dois itens diferem, então a contagem de letras não isola um item.",
       "O critério do número de dias é o único dos dois que isola exatamente um mês."
      ],
      "answer": "Junho (30 dias, contra 31 dos demais); a contagem de letras não gera um intruso único."
     },
     {
      "prompt": "Os números de 1 a 30 foram divididos em dois grupos: 'pares' e 'múltiplos de 3'. Mostre que a classificação não é excludente. Corrija-a com quatro categorias excludentes e exaustivas e confira a contagem.",
      "steps": [
       "Há números nos dois grupos: 6, 12, 18, 24 e 30 são pares e múltiplos de 3. Logo, os grupos não são excludentes. Há ainda números que ficam fora dos dois (1, 5, 7...), então a divisão original também não é exaustiva.",
       "Categorias corrigidas: (a) pares e não múltiplos de 3: 2, 4, 8, 10, 14, 16, 20, 22, 26, 28 (10 números); (b) ímpares e múltiplos de 3: 3, 9, 15, 21, 27 (5 números); (c) pares e múltiplos de 3, ou seja, múltiplos de 6: 6, 12, 18, 24, 30 (5 números); (d) ímpares e não múltiplos de 3: 1, 5, 7, 11, 13, 17, 19, 23, 25, 29 (10 números).",
       "Soma: 10 + 5 + 5 + 10 = 30. Todos os números de 1 a 30 aparecem uma única vez."
      ],
      "answer": "Quatro categorias com 10, 5, 5 e 10 elementos, totalizando 30, sem sobreposição."
     }
    ],
    "pitfall": "Escolher o intruso pela característica mais chamativa (o item mais curto, o único com acento, o maior número) sem testar se o critério vale para todos os outros, ou sem conferir se outro critério isolaria outro item. Exija sempre que a tabela de atributos mostre um contra todos.",
    "tables": [
     {
      "caption": "Quatro tipos de critério de classificação",
      "headers": [
       "Critério",
       "Pergunta",
       "Exemplo"
      ],
      "rows": [
       [
        "Categoria",
        "A que classe pertence?",
        "juiz, promotor, advogado: profissões"
       ],
       [
        "Função",
        "Para que serve?",
        "caneta, lápis, giz: escrever"
       ],
       [
        "Característica",
        "Que propriedade tem?",
        "12, 18, 24: múltiplos de 6"
       ],
       [
        "Ordem",
        "Que posição ocupa?",
        "A, B, C, D: ordem alfabética"
       ]
      ]
     },
     {
      "caption": "Atributos dos itens do exemplo guiado de escrita",
      "headers": [
       "Item",
       "Serve para escrever ou marcar",
       "Contém tinta",
       "Tem folhas de papel"
      ],
      "rows": [
       [
        "caneta",
        "sim",
        "sim",
        "não"
       ],
       [
        "lápis",
        "sim",
        "não",
        "não"
       ],
       [
        "giz",
        "sim",
        "não",
        "não"
       ],
       [
        "marcador",
        "sim",
        "sim",
        "não"
       ],
       [
        "caderno",
        "não",
        "não",
        "sim"
       ]
      ]
     }
    ],
    "resumo": {
     "title": "Intruso e categorias",
     "text": "Monte a tabela de atributos, ache o critério em que um único item destoa e confira se as categorias são exaustivas e excludentes.",
     "bizu": "Um contra todos: se o critério separa três de dois, não há intruso."
    }
   },
   {
    "title": "Formação de conceitos e interpretação lógica de textos curtos",
    "paragraphs": [
     "Definir um conceito é dizer o que ele é, sem ambiguidade. A forma clássica é a definição por gênero próximo e diferença específica: o conceito é colocado dentro de um gênero mais amplo e separado das demais espécies por uma diferença. 'Quadrado é um retângulo que tem os quatro lados iguais': o gênero é retângulo e a diferença é lados iguais. Uma boa definição não é larga demais (que inclua o que não é do conceito), nem estreita demais (que exclua o que é) e nem circular (que use o próprio termo na explicação).",
     "Todo conceito tem duas faces. A compreensão é o conjunto de propriedades que o definem; a extensão é o conjunto dos objetos aos quais ele se aplica. Elas variam em sentidos opostos dentro de uma hierarquia: quanto mais propriedades se exigem, menos objetos satisfazem. Entre os números de 1 a 60, 'múltiplo de 6' tem 10 objetos; acrescentando 'e múltiplo de 5' (isto é, múltiplo de 30), restam 2. A espécie tem mais compreensão e menos extensão que o gênero; o que vale para o gênero vale para a espécie, mas não o contrário.",
     "A partir de um texto curto, uma conclusão pode ser necessária (verdadeira em todos os cenários compatíveis com o texto), possível (verdadeira em alguns, mas não em todos) ou impossível. Só a conclusão necessária é uma inferência permitida. Para testar, tente construir um cenário que obedeça ao texto e contrarie a conclusão: se ele existir, a conclusão não é necessária. O conhecimento do mundo não preenche lacunas: se o texto não diz, a resposta é que nada se pode concluir. Na linguagem lógica, 'alguns' significa pelo menos um, podendo ser todos."
    ],
    "example": "Exemplo resolvido: 'Todo ofício da seção é numerado. O documento 5 é numerado.' Não se conclui que o documento 5 é um ofício da seção, porque 'todo ofício é numerado' não implica 'todo documento numerado é ofício'. Seria a generalização indevida pela inversão da frase.",
    "development": [
     "Os termos de quantidade mudam a conclusão. 'Todo A é B' garante que quem não é B não é A (contrapositiva), mas não garante que todo B seja A. 'Algum A é B' garante que existe ao menos um A e que algum B é A, mas não garante que todo A seja B nem que algum A não seja B. 'Nenhum A é B' garante que nenhum B é A, mas não garante que existam objetos A. 'Somente A é B' equivale a 'todo B é A'. 'Nem todo A é B' equivale a 'algum A não é B'. Treine a tradução desses termos para a forma padrão antes de raciocinar.",
     "Para definições, aplique o teste do contraexemplo em duas direções. Procure um objeto que cumpra a definição sem ser do conceito (definição larga demais) e um objeto do conceito que não cumpra a definição (estreita demais). 'Quadrilátero com quatro ângulos retos' define o retângulo; ela é larga demais para definir o quadrado, pois deixa entrar retângulos de lados diferentes. 'Quadrilátero com quatro lados iguais e quatro ângulos retos' é boa para o quadrado. A hierarquia, por sua vez, é transitiva: se todo quadrado é retângulo e todo retângulo é quadrilátero, todo quadrado é quadrilátero."
    ],
    "method": [
     "Traduza cada frase do texto para a forma padrão: todo, algum, nenhum, somente ou nem todo.",
     "Para cada conclusão proposta, procure um cenário que obedeça ao texto e a contrarie (contraexemplo).",
     "Se existir esse cenário, a conclusão não é necessária; se existir um cenário em que ela é verdadeira, é possível; se nenhum a permite, é impossível.",
     "Para definições, identifique o gênero e a diferença e teste a definição com um contraexemplo largo e um estreito.",
     "Responda com a palavra exata do enunciado (necessariamente, possivelmente) e não use conhecimento externo."
    ],
    "workedExamples": [
     {
      "prompt": "No universo dos inteiros de 1 a 60, compare as extensões de 'múltiplo de 6' e de 'múltiplo de 6 e de 5'. Qual conceito é espécie do outro? Como compreensão e extensão se relacionam?",
      "steps": [
       "Múltiplos de 6 de 1 a 60: 6, 12, 18, 24, 30, 36, 42, 48, 54 e 60 (10 números).",
       "Múltiplos de 6 e de 5 são múltiplos de 30 (pois MMC(6, 5) = 30): 30 e 60 (2 números).",
       "Todo múltiplo de 30 é múltiplo de 6 (30 = 6 × 5), então 'múltiplo de 6 e de 5' é espécie de 'múltiplo de 6'. A espécie tem mais propriedades exigidas (maior compreensão) e menos objetos (10 contra 2: menor extensão)."
      ],
      "answer": "'Múltiplo de 6 e de 5' é espécie de 'múltiplo de 6'; a extensão cai de 10 para 2 quando a compreensão aumenta."
     },
     {
      "prompt": "Texto: 'Todo processo distribuído à 2ª Vara foi sentenciado. Algum processo sentenciado foi arquivado.' Classifique cada conclusão como necessária ou apenas possível: (i) todo processo da 2ª Vara foi sentenciado; (ii) algum processo da 2ª Vara foi arquivado; (iii) todo processo não sentenciado não é da 2ª Vara; (iv) todo processo sentenciado é da 2ª Vara; (v) algum processo sentenciado não é da 2ª Vara.",
      "steps": [
       "(i) repete a primeira frase: necessária.",
       "(ii) o texto não liga a 2ª Vara ao arquivamento: o processo arquivado pode ser de outra vara. É possível, mas não necessária.",
       "(iii) é a contrapositiva de 'todo da 2ª Vara foi sentenciado': necessária.",
       "(iv) é a inversão da primeira frase. Pode haver processo sentenciado em outra vara: possível, mas não necessária.",
       "(v) o texto não diz que há sentenciados de outras varas, mas tampouco exclui: possível, mas não necessária."
      ],
      "answer": "(i) e (iii) são necessárias; (ii), (iv) e (v) são apenas possíveis."
     },
     {
      "prompt": "Texto: 'Todo requerimento protocolado recebe número. Nenhum documento sem número é juntado ao processo.' O que se pode afirmar necessariamente sobre: (i) todo documento juntado tem número; (ii) todo requerimento protocolado foi juntado; (iii) algum requerimento protocolado foi juntado; (iv) todo documento sem número não foi juntado; (v) todo documento numerado foi juntado?",
      "steps": [
       "Traduza: R (requerimento protocolado) → N (tem número); J (juntado) → N. As duas frases têm N como consequência e nada ligam diretamente R a J.",
       "(i) é a segunda frase dita de outro modo: necessária. (iv) é sua contrapositiva (sem número → não juntado): necessária.",
       "(ii) falha no cenário em que o requerimento 11 foi protocolado, numerado e não juntado. (v) falha no cenário em que existe um documento numerado e não juntado.",
       "(iii) é verdadeira no cenário em que o requerimento 10 foi protocolado, numerado e juntado, mas é falsa no cenário em que o único requerimento, o 11, foi numerado e não juntado. Logo, é apenas possível."
      ],
      "answer": "Somente (i) e (iv) são necessárias; (ii), (iii) e (v) são apenas possíveis."
     }
    ],
    "pitfall": "Tratar 'possível' como 'necessário', ou usar o que se sabe da vida real para completar o texto. Outro erro é inverter a frase ('todo A é B' virar 'todo B é A'). Sempre procure o cenário em que a conclusão falha.",
    "tables": [
     {
      "caption": "O que cada forma de texto permite concluir",
      "headers": [
       "Texto",
       "Permitido concluir",
       "Não permitido concluir"
      ],
      "rows": [
       [
        "Todo A é B",
        "todo não B é não A (contrapositiva)",
        "todo B é A"
       ],
       [
        "Algum A é B",
        "existe A; algum B é A",
        "todo A é B; algum A não é B"
       ],
       [
        "Nenhum A é B",
        "nenhum B é A",
        "que existam objetos A"
       ],
       [
        "Somente A é B",
        "todo B é A",
        "todo A é B"
       ]
      ]
     },
     {
      "caption": "Compreensão e extensão (inteiros de 1 a 60)",
      "headers": [
       "Conceito",
       "Propriedades exigidas",
       "Elementos",
       "Quantidade"
      ],
      "rows": [
       [
        "múltiplo de 6",
        "1",
        "6, 12, 18, 24, 30, 36, 42, 48, 54, 60",
        "10"
       ],
       [
        "múltiplo de 6 e de 5",
        "2",
        "30, 60",
        "2"
       ]
      ]
     }
    ],
    "resumo": {
     "title": "Conceitos e inferências",
     "text": "Defina por gênero e diferença, lembre que mais compreensão significa menos extensão e só aceite como inferência o que vale em todos os cenários do texto.",
     "bizu": "Procure o contraexemplo: se a conclusão falha em algum cenário, ela não é necessária."
    }
   }
  ]
 },
 "M08": {
  "extras": [
   {
    "capitulo": 1,
    "development": [
     "Por que a regra precisa estar declarada? Porque uma lista finita de termos nunca determina sozinha o que vem depois. Dados 1, 2, 4, 8, 16, o critério natural é dobrar a cada passo, e o sexto termo seria 32. Contudo, a fórmula (n^4 − 6n^3 + 23n^2 − 18n + 24)/24 também fornece 1, 2, 4, 8, 16 nas cinco primeiras posições e entrega 31 na sexta. Nenhuma das duas está errada como matemática; o que decide é o critério informado. Por isso, quando o enunciado não trouxer a regra, adote a mais simples que explique todos os termos e escreva-a antes de calcular, em uma frase como 'cada termo é o dobro do anterior'.",
     "Outro cuidado é separar três coisas que parecem iguais: a posição (n), o valor do termo (a_n) e o número de passos dados desde o início (n − 1). O quinto termo está a quatro passos do primeiro, não a cinco. Em recorrências, monte uma tabela de duas colunas, posição e valor, e preencha de cima para baixo sem pular linhas: um erro de conta na terceira linha contamina todas as seguintes. Se o enunciado pedir a posição de um valor, o caminho é inverso: você descobre o valor e depois responde em que linha da tabela ele aparece."
    ],
    "workedExamples": [
     {
      "prompt": "Em uma sequência, o primeiro termo é 3 e cada termo seguinte é o dobro do anterior menos 1. Qual é o sexto termo?",
      "steps": [
       "A regra é a(n+1) = 2·a(n) − 1, com a1 = 3.",
       "a2 = 2×3 − 1 = 5; a3 = 2×5 − 1 = 9; a4 = 2×9 − 1 = 17.",
       "a5 = 2×17 − 1 = 33; a6 = 2×33 − 1 = 65.",
       "Conferência de posição: do a1 ao a6 foram aplicadas 5 atualizações (n − 1), e o valor pedido é o do sexto termo, não o da sexta conta."
      ],
      "answer": "65."
     },
     {
      "prompt": "Uma sequência começa com a1 = 1 e a2 = 3. A partir do terceiro termo, cada termo é igual ao anterior somado ao dobro do termo que está duas posições antes dele. Quais são os valores de a7 e da soma a5 + a7?",
      "steps": [
       "A regra é a(n) = a(n−1) + 2·a(n−2), com a1 = 1 e a2 = 3.",
       "a3 = 3 + 2×1 = 5.",
       "a4 = 5 + 2×3 = 11.",
       "a5 = 11 + 2×5 = 21.",
       "a6 = 21 + 2×11 = 43.",
       "a7 = 43 + 2×21 = 85.",
       "Soma pedida: a5 + a7 = 21 + 85 = 106."
      ],
      "answer": "a7 = 85 e a5 + a7 = 106."
     }
    ],
    "tables": [
     {
      "caption": "Posição e valor em a1 = 3 e a(n+1) = 2·a(n) − 1",
      "headers": [
       "Posição n",
       "Termo a(n)",
       "Atualizações desde o início (n − 1)"
      ],
      "rows": [
       [
        1,
        3,
        0
       ],
       [
        2,
        5,
        1
       ],
       [
        3,
        9,
        2
       ],
       [
        4,
        17,
        3
       ],
       [
        5,
        33,
        4
       ],
       [
        6,
        65,
        5
       ]
      ]
     }
    ]
   },
   {
    "capitulo": 2,
    "development": [
     "Uma pergunta frequente é quantos termos de uma PA estão entre dois valores. O raciocínio é contar degraus: do primeiro ao último valor há (último − primeiro)/r intervalos, e o número de termos é esse resultado mais 1, porque cada intervalo termina em um termo novo e o primeiro termo já estava de pé. A divisão só é válida se der exata; se não der, o valor não pertence à progressão. Nos problemas de múltiplos 'entre 100 e 500', ache primeiro o menor e o maior múltiplo que realmente estão dentro do intervalo, e só então aplique a fórmula. Atenção a 'inclusive' e 'exclusive': eles decidem se as pontas entram na contagem.",
     "Mais duas ferramentas aceleram as contas. Em uma PA, cada termo é a média dos vizinhos: se a, b, c são consecutivos, b = (a + c)/2. Em uma PG, cada termo é a média geométrica dos vizinhos: b^2 = a·c. Para a soma dos n primeiros termos de uma PG com razão q diferente de 1, use S = a1·(q^n − 1)/(q − 1); ela vem de multiplicar a soma por q e subtrair a original, o que cancela quase todos os termos. Com q = 2, os cálculos ficam leves: 2^8 = 256, 2^9 = 512, 2^10 = 1.024. Vale decorar essas potências."
    ],
    "workedExamples": [
     {
      "prompt": "Quantos números múltiplos de 7 existem entre 100 e 500, contando as extremidades caso sejam múltiplos? E qual é a soma deles?",
      "steps": [
       "O menor múltiplo de 7 maior ou igual a 100: 7×14 = 98 é pequeno demais; 7×15 = 105 serve.",
       "O maior múltiplo de 7 menor ou igual a 500: 7×71 = 497; 7×72 = 504 passa de 500.",
       "Os termos formam uma PA de razão 7, com primeiro termo 105 e último 497.",
       "Número de termos: (497 − 105)/7 + 1 = 392/7 + 1 = 56 + 1 = 57.",
       "Soma: 57×(105 + 497)/2 = 57×602/2 = 57×301 = 17.157."
      ],
      "answer": "57 múltiplos, com soma 17.157."
     },
     {
      "prompt": "Um sistema recebe 5 petições no primeiro dia e, a cada dia seguinte, o dobro das petições do dia anterior. Quantas petições chegam ao todo nos 8 primeiros dias? Em qual dia, pela primeira vez, a chegada diária ultrapassa 1.000?",
      "steps": [
       "Chegadas diárias: 5, 10, 20, ... formam uma PG com a1 = 5 e q = 2.",
       "Soma dos 8 primeiros: S8 = 5×(2^8 − 1)/(2 − 1) = 5×255 = 1.275.",
       "Chegada no dia n: 5×2^(n−1). Queremos 5×2^(n−1) > 1.000, ou seja, 2^(n−1) > 200.",
       "Como 2^7 = 128 (insuficiente) e 2^8 = 256 (suficiente), n − 1 = 8 e n = 9.",
       "Conferência: no dia 8 chegam 5×128 = 640; no dia 9, 5×256 = 1.280, que supera 1.000."
      ],
      "answer": "1.275 petições nos 8 primeiros dias; a chegada diária passa de 1.000 no 9º dia (1.280 petições)."
     }
    ],
    "tables": [
     {
      "caption": "Comparação entre PA e PG",
      "headers": [
       "Item",
       "PA (diferença r)",
       "PG (razão q)"
      ],
      "rows": [
       [
        "Termo geral",
        "a1 + (n − 1)·r",
        "a1·q^(n−1)"
       ],
       [
        "Termo do meio entre a e c",
        "(a + c)/2",
        "raiz de a·c (termos positivos)"
       ],
       [
        "Soma dos n primeiros",
        "n·(a1 + an)/2",
        "a1·(q^n − 1)/(q − 1)"
       ],
       [
        "Número de termos de a1 a an",
        "(an − a1)/r + 1",
        "precisa de potências: q^(n−1) = an/a1"
       ]
      ]
     }
    ]
   },
   {
    "capitulo": 3,
    "development": [
     "A ideia de separar pares e ímpares vale para qualquer número k de grupos intercalados. Se a sequência tem k subsequências alternadas, o termo de posição n pertence ao grupo cujo número é o resto de n por k (resto zero significa o grupo k), e ocupa dentro dele a posição m = (n dividido por k, arredondado para cima). Com k = 3, as posições 1, 4, 7 vão para o grupo 1; as posições 2, 5, 8, para o grupo 2; e as posições 3, 6, 9, para o grupo 3. Depois de achar o grupo e a posição interna, basta aplicar a fórmula da PA ou da PG daquele grupo. Essa conversão é o coração dos problemas de 'termo de ordem 50' ou 'ordem 100'.",
     "Existe ainda uma segunda forma de alternância, em que a mesma sequência aplica operações diferentes em passos alternados. Em 1, 3, 9, 11, 33, 35, ..., somamos 2 e depois multiplicamos por 3, repetidamente: 1+2 = 3, 3×3 = 9, 9+2 = 11, 11×3 = 33, 33+2 = 35. Nesse caso não existem duas listas separadas; existe uma única lista com um passo de duas fases. O teste para distinguir os dois casos é simples: se os termos de índice par só dependem dos pares anteriores, são subsequências intercaladas; se cada termo depende do imediatamente anterior com a operação mudando, é alternância de operações."
    ],
    "workedExamples": [
     {
      "prompt": "Na sequência 5, 1, 8, 3, 11, 5, 14, 7, ..., os termos de posição ímpar formam uma progressão e os de posição par formam outra, ambas aritméticas. Qual é a soma do 21º com o 30º termos?",
      "steps": [
       "Posições ímpares: 5, 8, 11, 14, ... (razão 3). Posições pares: 1, 3, 5, 7, ... (razão 2).",
       "O 21º termo é ímpar: posição interna (21 + 1)/2 = 11. Valor: 5 + 10×3 = 35.",
       "O 30º termo é par: posição interna 30/2 = 15. Valor: 1 + 14×2 = 29.",
       "Soma: 35 + 29 = 64."
      ],
      "answer": "64."
     },
     {
      "prompt": "Considere a sequência 2, 7, 1, 4, 9, 3, 6, 11, 5, ..., formada por três progressões intercaladas, nesta ordem: primeira posição do bloco, segunda e terceira. Qual é o 50º termo e qual é o 100º termo?",
      "steps": [
       "Separe por posição módulo 3: grupo 1 (posições 1, 4, 7): 2, 4, 6, ... razão 2; grupo 2 (posições 2, 5, 8): 7, 9, 11, ... razão 2; grupo 3 (posições 3, 6, 9): 1, 3, 5, ... razão 2.",
       "50 dividido por 3 dá 16 e resto 2: grupo 2, posição interna 17 (50/3 arredondado para cima). Valor: 7 + 16×2 = 39.",
       "100 dividido por 3 dá 33 e resto 1: grupo 1, posição interna 34. Valor: 2 + 33×2 = 68.",
       "Conferência com a lista: o 8º termo (resto 2, interna 3) é 7 + 2×2 = 11, igual ao mostrado."
      ],
      "answer": "50º termo: 39. 100º termo: 68."
     }
    ],
    "tables": [
     {
      "caption": "Conversão de posição para grupo (k = 3)",
      "headers": [
       "Posição n",
       "Resto de n por 3",
       "Grupo",
       "Posição interna"
      ],
      "rows": [
       [
        1,
        1,
        1,
        1
       ],
       [
        2,
        2,
        2,
        1
       ],
       [
        3,
        0,
        3,
        1
       ],
       [
        4,
        1,
        1,
        2
       ],
       [
        5,
        2,
        2,
        2
       ],
       [
        6,
        0,
        3,
        2
       ],
       [
        7,
        1,
        1,
        3
       ],
       [
        50,
        2,
        2,
        17
       ]
      ]
     }
    ]
   },
   {
    "capitulo": 4,
    "development": [
     "Antes de contar letras, confirme qual alfabeto vale. No português do dia a dia usamos 26 letras (A a Z, incluindo K, W e Y); em alguns enunciados o alfabeto de 23 letras é indicado expressamente. Mudar de 26 para 23 muda o resultado, pois o retorno de Z para A ocorre em outro ponto. Quando o enunciado não disser, trabalhe com 26 e deixe isso escrito na resolução. A regra do retorno é: se a posição passar de 26, subtraia 26 até cair entre 1 e 26. Por exemplo, a posição 29 corresponde à letra de posição 3, que é C.",
     "Os mesmos restos resolvem calendários. Uma semana tem 7 dias, então andar 100 dias à frente equivale a andar 100 mod 7 = 2 dias, pois 98 dias são 14 semanas completas e não mudam o dia da semana. Para voltar no tempo, subtraia o resto em vez de somar. Quando uma sequência combina duas regras cíclicas ao mesmo tempo, como letras de 26 em 26 e números de 5 em 5, trate cada componente separadamente: calcule o resto para a letra e o resto para o número. O par só se repete por inteiro depois de um número de posições que seja múltiplo de ambos os ciclos."
    ],
    "workedExamples": [
     {
      "prompt": "Uma audiência é marcada para daqui a 100 dias corridos, contados a partir de uma quarta-feira (o dia da marcação é o dia zero). Em que dia da semana cairá a audiência?",
      "steps": [
       "Uma semana tem 7 dias; só importa o resto de 100 por 7.",
       "100 = 7×14 + 2, logo o resto é 2 (98 dias são 14 semanas completas).",
       "Andar 2 dias a partir de quarta-feira: quinta-feira (1), sexta-feira (2)."
      ],
      "answer": "Sexta-feira."
     },
     {
      "prompt": "Uma sequência de códigos é A1, B2, C3, D4, E5, F1, G2, H3, ..., em que as letras seguem o alfabeto de 26 letras, voltando ao A depois do Z, e os números se repetem no ciclo 1, 2, 3, 4, 5. Qual é o código na posição 60 e na posição 137?",
      "steps": [
       "Letra: posição n corresponde à letra de ordem ((n − 1) mod 26) + 1. Número: ((n − 1) mod 5) + 1.",
       "Posição 60: (59 mod 26) + 1 = 7 + 1 = 8, que é a letra H. Número: (59 mod 5) + 1 = 4 + 1 = 5.",
       "Código da posição 60: H5.",
       "Posição 137: (136 mod 26) + 1 = 6 + 1 = 7, que é a letra G (136 = 26×5 + 6). Número: (136 mod 5) + 1 = 1 + 1 = 2 (136 = 5×27 + 1).",
       "Código da posição 137: G2."
      ],
      "answer": "Posição 60: H5. Posição 137: G2."
     }
    ],
    "tables": [
     {
      "caption": "Posição das letras de A a M no alfabeto de 26 letras",
      "headers": [
       "A",
       "B",
       "C",
       "D",
       "E",
       "F",
       "G",
       "H",
       "I",
       "J",
       "K",
       "L",
       "M"
      ],
      "rows": [
       [
        1,
        2,
        3,
        4,
        5,
        6,
        7,
        8,
        9,
        10,
        11,
        12,
        13
       ]
      ]
     },
     {
      "caption": "Posição das letras de N a Z no alfabeto de 26 letras",
      "headers": [
       "N",
       "O",
       "P",
       "Q",
       "R",
       "S",
       "T",
       "U",
       "V",
       "W",
       "X",
       "Y",
       "Z"
      ],
      "rows": [
       [
        14,
        15,
        16,
        17,
        18,
        19,
        20,
        21,
        22,
        23,
        24,
        25,
        26
       ]
      ]
     }
    ]
   },
   {
    "capitulo": 5,
    "development": [
     "Em sequências de figuras descritas por texto, o primeiro passo é transformar a figura em números. Se a figura 1 tem 3 palitos, a 2 tem 5 e a 3 tem 7, conte o que cresce: aumentam 2 palitos a cada figura, uma PA. O termo geral é então 3 + (n − 1)×2 = 2n + 1. Depois que você tem a fórmula, a figura de número 20 não precisa ser desenhada: 2×20 + 1 = 41. Esse caminho evita a armadilha de desenhar até a figura pedida e errar a contagem no meio do desenho. Sempre teste a fórmula nas figuras já conhecidas antes de usá-la na pedida.",
     "Nas matrizes numéricas, vale o mesmo cuidado de regra única e testada em todas as linhas disponíveis. Se duas linhas completas obedecem a 'o terceiro número é o produto dos dois primeiros', mas a terceira linha tem apenas dois números, a lacuna é calculada pelo produto. Se uma regra funciona para uma linha e falha em outra, ela não é a regra correta, mesmo que seja simples. Por fim, descreva o que muda e o que fica igual de uma figura para a seguinte: o que fica igual não precisa de conta, e o que muda é o que deve ser traduzido em números ou em transformações."
    ],
    "workedExamples": [
     {
      "prompt": "Uma fileira de triângulos é montada com palitos: a figura 1 tem um triângulo (3 palitos), a figura 2 tem dois triângulos lado a lado compartilhando um palito (5 palitos), a figura 3 tem três triângulos na mesma fileira (7 palitos), e assim por diante, sempre adicionando um triângulo que compartilha um lado. Quantos palitos tem a figura 20 e qual figura tem 101 palitos?",
      "steps": [
       "Cada nova figura acrescenta 2 palitos (um triângulo novo usa 3 palitos, mas um é compartilhado). É uma PA com a1 = 3 e r = 2.",
       "Termo geral: a_n = 3 + (n − 1)×2 = 2n + 1. Teste: n = 1, 2, 3 dá 3, 5, 7, como mostrado.",
       "Figura 20: 2×20 + 1 = 41 palitos.",
       "Quantos palitos 101? 2n + 1 = 101, logo 2n = 100 e n = 50. Conferência: 2×50 + 1 = 101."
      ],
      "answer": "A figura 20 tem 41 palitos; a figura com 101 palitos é a 50."
     },
     {
      "prompt": "Em uma matriz 3 por 3, as duas primeiras linhas são (2, 3, 6) e (4, 5, 20). A terceira linha é (3, 6, ?). Admitindo a regra explícita 'em cada linha, o terceiro número é o produto dos dois primeiros', qual é o número que falta? Qual é a soma de todos os nove números da matriz completa?",
      "steps": [
       "Testando a regra: linha 1 dá 2×3 = 6; linha 2 dá 4×5 = 20. Ambas confirmam.",
       "Terceira linha: 3×6 = 18.",
       "Soma dos três primeiros: 2 + 3 + 6 = 11; da segunda linha: 4 + 5 + 20 = 29; da terceira: 3 + 6 + 18 = 27.",
       "Soma total: 11 + 29 + 27 = 67."
      ],
      "answer": "O número que falta é 18, e a soma dos nove números é 67."
     }
    ],
    "tables": [
     {
      "caption": "Palitos na fileira de triângulos",
      "headers": [
       "Figura n",
       "Triângulos",
       "Palitos 2n + 1"
      ],
      "rows": [
       [
        1,
        1,
        3
       ],
       [
        2,
        2,
        5
       ],
       [
        3,
        3,
        7
       ],
       [
        4,
        4,
        9
       ],
       [
        20,
        20,
        41
       ],
       [
        50,
        50,
        101
       ]
      ]
     }
    ]
   }
  ],
  "novosCapitulos": [
   {
    "title": "Progressões aritmética e geométrica: termo geral e somas",
    "paragraphs": [
     "Uma progressão aritmética (PA) é uma sequência em que cada termo, a partir do segundo, é o anterior mais um valor fixo r, a razão. Se o primeiro termo é a1, o segundo é a1 + r, o terceiro é a1 + 2r, e o n-ésimo é a1 + (n − 1)r. O fator é n − 1 e não n porque, para chegar ao termo de posição n, você dá n − 1 passos a partir do primeiro. Esse é o erro de contagem mais frequente em provas; por isso, em qualquer dúvida, teste a fórmula com n = 1 (deve devolver a1) e n = 2 (deve devolver a1 + r).",
     "Já a progressão geométrica (PG) multiplica por uma razão fixa q a cada passo: o termo de posição n é a1·q^(n−1). A razão pode ser fracionária (cada termo é metade do anterior, q = 1/2) ou negativa (os sinais se alternam). Quando você conhece dois termos de uma PA, a razão é a diferença dividida pelo número de passos entre eles: (a_p − a_k)/(p − k). Em uma PG, divide-se um termo pelo outro e extrai-se a raiz do número de passos, cuidando do sinal quando os passos são pares.",
     "Para somar, a PA tem um truque de emparelhamento: o primeiro termo e o último somam o mesmo que o segundo e o penúltimo, e assim por diante. Com n termos há n/2 pares iguais, e a soma é S = n·(a1 + an)/2. Na PG finita, S = a1·(q^n − 1)/(q − 1), para q diferente de 1. Ambas as fórmulas só fazem sentido com a conta feita sobre o número correto de termos; por isso, quando a pergunta fornece valores extremos e não o número de termos, calcule primeiro quantos termos há."
    ],
    "example": "Exemplo resolvido: na PA 4, 9, 14, ..., a razão é 5 e o décimo termo é a10 = 4 + 9×5 = 49.",
    "development": [
     "Há problemas que fornecem relações em vez de termos. Por exemplo: 'três números em PA somam 36'. Escolha as incógnitas de forma simétrica: x − r, x e x + r. Ao somar, os r se cancelam e sobra 3x = 36, logo x = 12. Essa escolha poupa um sistema de equações. Na PG, a mesma ideia vale com x/q, x e x·q, cujo produto vale x^3. Fique atento ao termo central: ele é sempre a média aritmética (PA) ou geométrica (PG) dos vizinhos, e isso permite testar se três números dados formam ou não uma progressão com uma única conta.",
     "Também é comum a progressão aparecer disfarçada de contexto: um servidor protocola 12 processos no primeiro dia e 3 a mais a cada dia (PA de razão 3), ou uma pilha de documentos dobra de tamanho a cada semana (PG de razão 2). Traduza a história em a1 e razão logo no início. Quando o enunciado fala em 'a cada dia a mais', é soma de valor fixo (PA); quando fala em 'dobra', 'triplica' ou 'cresce 10%' sobre o anterior, é multiplicação por fator fixo (PG, com fator 1,10 no último caso). A soma de n dias pode então ser calculada pela fórmula adequada, desde que n seja contado corretamente."
    ],
    "method": [
     "Identifique se a regra é soma de valor fixo (PA) ou multiplicação por fator fixo (PG), conferindo pelo menos três termos consecutivos.",
     "Anote a1, a razão (r ou q) e o que a pergunta pede: um termo, o número de termos ou uma soma.",
     "Para achar um termo ou a razão, conte os passos entre posições (diferença das posições) e aplique a fórmula.",
     "Se a pergunta der valores extremos, descubra o número de termos com (último − primeiro)/r + 1 antes de somar.",
     "Confira o resultado com um caso pequeno: n = 1 deve devolver o primeiro termo."
    ],
    "workedExamples": [
     {
      "prompt": "Em uma PA, o terceiro termo é 11 e o oitavo termo é 31. Calcule a razão, o primeiro termo, o 20º termo e a soma dos 20 primeiros termos.",
      "steps": [
       "Entre o 3º e o 8º há 8 − 3 = 5 passos, e a diferença dos valores é 31 − 11 = 20.",
       "Razão: r = 20/5 = 4.",
       "Primeiro termo: a3 = a1 + 2r, então a1 = 11 − 2×4 = 3.",
       "20º termo: a20 = 3 + 19×4 = 3 + 76 = 79.",
       "Soma: S20 = 20×(3 + 79)/2 = 10×82 = 820.",
       "Conferência: a8 = 3 + 7×4 = 31, igual ao dado."
      ],
      "answer": "r = 4; a1 = 3; a20 = 79; S20 = 820."
     },
     {
      "prompt": "Protocolos são numerados de 5 em 5, começando no número 12 e terminando no 407. Quantos protocolos há nessa lista e qual é a soma de todos os números? Em uma PA diferente, a razão é 3 e a soma dos 10 primeiros termos é 215. Qual é o primeiro termo dessa segunda PA?",
      "steps": [
       "Primeira lista: PA com a1 = 12, r = 5, último termo 407. Intervalos: (407 − 12)/5 = 395/5 = 79 (divisão exata, logo 407 pertence à PA).",
       "Número de termos: 79 + 1 = 80.",
       "Soma: 80×(12 + 407)/2 = 40×419 = 16.760.",
       "Segunda PA: S10 = 10×(2a1 + 9r)/2 = 5×(2a1 + 27) = 215.",
       "Então 2a1 + 27 = 43 e 2a1 = 16, logo a1 = 8.",
       "Conferência: termos de 8 a 8 + 9×3 = 35; soma = 10×(8 + 35)/2 = 215."
      ],
      "answer": "Há 80 protocolos, somando 16.760. O primeiro termo da segunda PA é 8."
     },
     {
      "prompt": "Em uma PG, o segundo termo é 6 e o quinto termo é 162, com todos os termos positivos. Calcule a razão, o primeiro termo e a soma dos 6 primeiros termos. Em seguida, diga se 54, 162, 486 estão em PG.",
      "steps": [
       "Entre o 2º e o 5º termos há 5 − 2 = 3 passos: a5 = a2·q^3, então 162 = 6·q^3.",
       "q^3 = 162/6 = 27, logo q = 3 (positivo, como exigido).",
       "Primeiro termo: a1 = a2/q = 6/3 = 2.",
       "Termos: 2, 6, 18, 54, 162, 486. A soma dos 6 primeiros é S6 = 2×(3^6 − 1)/(3 − 1) = 2×728/2 = 728.",
       "Conferência somando: 2 + 6 + 18 + 54 + 162 + 486 = 728.",
       "Teste de PG para 54, 162, 486: 162/54 = 3 e 486/162 = 3, razões iguais; ou 162^2 = 26.244 e 54×486 = 26.244."
      ],
      "answer": "q = 3; a1 = 2; S6 = 728. Os números 54, 162 e 486 estão em PG de razão 3."
     }
    ],
    "pitfall": "Usar n em vez de n − 1 na fórmula do termo geral, ou contar os termos de uma lista subtraindo sem somar 1. Evite o erro testando n = 1 e conferindo se o resultado é o primeiro termo, e lembrando que em n termos existem n − 1 intervalos.",
    "tables": [
     {
      "caption": "Quantos termos? O erro da cerca",
      "headers": [
       "Lista",
       "Intervalos entre pontas",
       "Termos"
      ],
      "rows": [
       [
        "2, 4, 6, 8, 10",
        "(10 − 2)/2 = 4",
        "4 + 1 = 5"
       ],
       [
        "12, 17, ..., 407 (razão 5)",
        "(407 − 12)/5 = 79",
        "79 + 1 = 80"
       ],
       [
        "105, 112, ..., 497 (razão 7)",
        "(497 − 105)/7 = 56",
        "56 + 1 = 57"
       ]
      ]
     }
    ],
    "resumo": {
     "title": "PA e PG",
     "text": "PA soma sempre o mesmo valor: a_n = a1 + (n − 1)r e S = n(a1 + an)/2. PG multiplica sempre pelo mesmo fator: a_n = a1·q^(n−1) e S = a1(q^n − 1)/(q − 1).",
     "bizu": "Número de termos = (último − primeiro)/r + 1: some o 1 da cerca."
    }
   },
   {
    "title": "Sequências de segunda ordem e recorrentes",
    "paragraphs": [
     "Algumas sequências não são PA nem PG, mas escondem uma PA nas diferenças. Veja 3, 4, 7, 12, 19: as diferenças entre termos vizinhos são 1, 3, 5, 7, e elas próprias crescem de 2 em 2. Quando as diferenças formam uma PA, dizemos que a sequência é de segunda ordem, e os termos seguem uma fórmula quadrática em n. O método é o das diferenças sucessivas: calcule as diferenças; se não forem constantes, calcule as diferenças das diferenças; quando ficarem constantes, estenda esse último nível e retorne somando para o nível de cima.",
     "Existem sequências famosas que valem reconhecer rapidamente. Os quadrados (1, 4, 9, 16, 25) têm diferenças que são os ímpares consecutivos; os triangulares (1, 3, 6, 10, 15) são somas 1, 1 + 2, 1 + 2 + 3, ...; os cubos (1, 8, 27, 64) crescem mais rápido, e suas diferenças só ficam constantes na terceira ordem; e os fatoriais (1, 2, 6, 24, 120) multiplicam por 2, 3, 4, 5. Reconhecer a família ajuda, mas confirme sempre contra todos os termos dados.",
     "Há ainda as recorrências, nas quais o termo é construído com os anteriores. A mais conhecida é a de Fibonacci, em que cada termo é a soma dos dois anteriores. Aqui os termos iniciais fazem parte do problema: com 1, 1 você obtém 1, 1, 2, 3, 5, 8, mas com 2, 3 obtém 2, 3, 5, 8, 13. Em recorrências não há fórmula direta simples para o termo de ordem 30, e a tática é calcular passo a passo, ou procurar um truque de soma, como a soma dos n primeiros termos de uma sequência de Fibonacci igual ao termo de posição n + 2 menos o segundo termo."
    ],
    "example": "Exemplo resolvido: 1, 3, 6, 10, 15 são triangulares. As diferenças são 2, 3, 4, 5, logo a próxima diferença é 6 e o termo seguinte é 15 + 6 = 21.",
    "development": [
     "Em sequências quadráticas, existe um atalho: o termo de ordem n é a1 mais a soma das n − 1 primeiras diferenças. Em 3, 4, 7, 12, 19, 28, as diferenças são 1, 3, 5, 7, 9; para chegar ao sétimo termo, somam-se as seis primeiras diferenças (1, 3, 5, 7, 9, 11, a soma dos seis primeiros ímpares, que é 6^2 = 36) ao 3 inicial. Resultado: 39. Lembre que a soma dos k primeiros números ímpares vale k^2 e que a soma dos k primeiros naturais vale k(k + 1)/2. Essas duas somas aparecem sem parar nas diferenças de segunda ordem.",
     "Convém desconfiar de padrões numéricos que parecem bonitos mas se apoiam em poucos termos. A lista 2, 4, 8 pode ser lida como dobrar (próximo 16) ou como diferenças 2, 4 que crescem 2 a cada vez (próximo 8 + 6 = 14). As duas regras explicam os três termos e levam a respostas diferentes. Quando o enunciado não decide, escolha a regra mais simples que concorde com todos os termos fornecidos e declare-a. Um enunciado bem formulado costuma trazer termos suficientes ou a regra de formação por extenso, como 'cada termo é a soma dos dois anteriores'."
    ],
    "method": [
     "Calcule as diferenças consecutivas; se forem constantes, trata-se de PA.",
     "Se não forem, calcule as diferenças das diferenças; constantes aqui indicam sequência quadrática.",
     "Reconheça famílias conhecidas (quadrados, triangulares, cubos, fatoriais) e confirme contra todos os termos.",
     "Em recorrência, anote os termos iniciais e a regra, e calcule termo a termo em tabela, sem saltos.",
     "Escreva a regra adotada e confira se ela reproduz os termos que o enunciado mostra."
    ],
    "workedExamples": [
     {
      "prompt": "A sequência 3, 4, 7, 12, 19, ... tem como regra: a diferença entre termos vizinhos aumenta 2 a cada passo (as diferenças são 1, 3, 5, 7, ...). Qual é o sétimo termo?",
      "steps": [
       "Diferenças: 4 − 3 = 1; 7 − 4 = 3; 12 − 7 = 5; 19 − 12 = 7. Elas crescem de 2 em 2.",
       "Continuando as diferenças: 9 e depois 11.",
       "a6 = 19 + 9 = 28.",
       "a7 = 28 + 11 = 39.",
       "Conferência por fórmula: a_n = (n − 1)^2 + 3; com n = 7: 6^2 + 3 = 39."
      ],
      "answer": "39."
     },
     {
      "prompt": "Uma sequência começa com 2 e 3, e cada termo seguinte é a soma dos dois anteriores. Calcule o 10º termo e a soma dos 10 primeiros termos. Use também o fato de que essa soma é igual ao 12º termo menos o 2º termo.",
      "steps": [
       "Termos: a1 = 2; a2 = 3; a3 = 5; a4 = 8; a5 = 13; a6 = 21; a7 = 34; a8 = 55; a9 = 89; a10 = 144.",
       "Soma direta: 2 + 3 + 5 + 8 + 13 + 21 + 34 + 55 + 89 + 144 = 374.",
       "Para usar o truque: a11 = 89 + 144 = 233; a12 = 144 + 233 = 377.",
       "Soma pelo atalho: a12 − a2 = 377 − 3 = 374, igual à soma direta."
      ],
      "answer": "10º termo: 144. Soma dos 10 primeiros: 374."
     },
     {
      "prompt": "Em uma sequência, o primeiro termo é 5 e cada termo é igual ao anterior somado ao número da sua própria posição (o 2º termo é o 1º mais 2, o 3º é o 2º mais 3, e assim por diante). Calcule o 30º termo.",
      "steps": [
       "Termos iniciais: a1 = 5; a2 = 5 + 2 = 7; a3 = 7 + 3 = 10; a4 = 10 + 4 = 14; a5 = 14 + 5 = 19.",
       "Diferenças 2, 3, 4, 5, ...: o termo de ordem 30 é a1 mais a soma das parcelas 2 + 3 + ... + 30.",
       "Soma de 1 a 30: 30×31/2 = 465. Sem a parcela 1: 465 − 1 = 464.",
       "a30 = 5 + 464 = 469.",
       "Fórmula conferida: a_n = n(n + 1)/2 + 4; para n = 5: 15 + 4 = 19, igual ao termo obtido; para n = 30: 465 + 4 = 469."
      ],
      "answer": "469."
     }
    ],
    "pitfall": "Aceitar a primeira regra que 'parece certa' com apenas três ou quatro termos, sem conferir os demais, ou esquecer os termos iniciais em recorrências. Evite listando a regra por extenso e testando-a contra todos os termos mostrados.",
    "tables": [
     {
      "caption": "Famílias de sequências que aparecem com frequência",
      "headers": [
       "Família",
       "Primeiros termos",
       "Como cresce"
      ],
      "rows": [
       [
        "Quadrados",
        "1, 4, 9, 16, 25, 36",
        "diferenças são os ímpares 3, 5, 7, 9, 11"
       ],
       [
        "Triangulares",
        "1, 3, 6, 10, 15, 21",
        "soma de 1 a n; diferenças 2, 3, 4, 5, 6"
       ],
       [
        "Cubos",
        "1, 8, 27, 64, 125",
        "diferenças 7, 19, 37, 61"
       ],
       [
        "Fatoriais",
        "1, 2, 6, 24, 120, 720",
        "multiplica por 2, 3, 4, 5, 6"
       ],
       [
        "Fibonacci (1, 1)",
        "1, 1, 2, 3, 5, 8",
        "soma dos dois anteriores"
       ]
      ]
     }
    ],
    "resumo": {
     "title": "Segunda ordem e recorrência",
     "text": "Se as diferenças não são constantes, calcule as diferenças das diferenças; se o termo depende dos anteriores, use os termos iniciais e calcule passo a passo.",
     "bizu": "Declare a regra adotada: 2, 4, 8 pode seguir com 16 ou com 14."
    }
   },
   {
    "title": "Ciclos, restos e posições",
    "paragraphs": [
     "Quando um padrão se repete de k em k posições, a pergunta típica é qual elemento ocupa a posição 100 ou 1.000. Calcular os elementos um por um é inviável; o resto da divisão resolve. Numerando as posições a partir de 1, o resto de n dividido por k indica qual elemento do ciclo aparece: resto 1 é o primeiro, resto 2 é o segundo, e assim por diante; o resto 0 aponta para o último elemento do ciclo. A fórmula ((n − 1) mod k) + 1 evita o caso especial do resto zero e devolve sempre uma posição de 1 a k.",
     "A mesma ideia vale para o calendário. Como a semana repete de 7 em 7 dias, o dia da semana depois de N dias depende só do resto de N por 7. Se hoje é segunda-feira e passam 1.000 dias, o resto de 1.000 por 7 é 6 (pois 7×142 = 994), e seis dias depois de segunda é domingo. A diferença com as posições de um ciclo é que o dia zero (hoje) está parado em uma posição: andar 0 dia mantém o dia da semana, por isso o resto 0 devolve o mesmo dia.",
     "O cuidado central é com a origem. Se a contagem começa na posição 1, vale a regra do resto 1 para o primeiro elemento; se o enunciado conta o dia da marcação como dia 0, o resto indica quantas casas andar a partir dele. Leia o texto para saber qual das duas convenções ele adota e escreva-a na resolução. Também é útil lembrar quantas vezes um elemento aparece em n posições: com ciclo de k elementos, o elemento da posição p do ciclo aparece (n − p)/k, arredondado para baixo, mais 1 vezes, desde que p seja no máximo n."
    ],
    "example": "Exemplo resolvido: em um ciclo de cores vermelho, azul, verde repetido desde a posição 1, a posição 100 tem resto 100 mod 3 = 1, logo é vermelho.",
    "development": [
     "Padrões figurais descritos em texto também são cíclicos. Uma seta que gira 90° no sentido horário a cada figura volta à posição inicial depois de 4 figuras. Assim, a direção na figura n depende de (n − 1) mod 4: resto 0 é a direção inicial, 1 é uma volta de 90°, 2 é 180° e 3 é 270°. Outros atributos podem ter ciclos diferentes, como uma cor que alterna a cada figura (ciclo 2). O padrão completo da figura só se repete depois do múltiplo comum dos ciclos, mas, para responder sobre uma posição, basta calcular o resto de cada atributo.",
     "Existem atributos que não são cíclicos, e sim crescentes: uma seta que gira e ainda ganha uma bolinha a cada figura. Nesse caso o ciclo cuida da direção, e a quantidade de bolinhas segue uma PA, que você calcula diretamente por n. Outra variação frequente pergunta quantas vezes um elemento aparece até certa posição. Nesse caso, divida o total de posições pelo tamanho do ciclo para saber os ciclos completos e examine as posições restantes, que formam um ciclo incompleto. Cada ciclo completo contribui com uma ocorrência do elemento; o resto pode ou não acrescentar mais uma."
    ],
    "method": [
     "Defina o tamanho k do ciclo e liste os elementos na ordem, numerando de 1 a k.",
     "Confirme a origem da contagem: a primeira figura é a posição 1 ou o dia zero?",
     "Divida a posição n por k e use o resto (resto 0 significa o último elemento do ciclo; ou use ((n − 1) mod k) + 1).",
     "Para atributos que crescem junto (quantidade, tamanho), calcule-os por fórmula de PA em n, separadamente do ciclo.",
     "Releia a pergunta: elemento, quantidade de ocorrências ou dia da semana, e responda só o que foi pedido."
    ],
    "workedExamples": [
     {
      "prompt": "Uma faixa é pintada repetindo, desde a primeira posição, o padrão vermelho, azul, verde. Qual é a cor da posição 100? Em quantas das 100 primeiras posições aparece o vermelho?",
      "steps": [
       "Ciclo de 3 elementos: 1 vermelho, 2 azul, 3 verde.",
       "100 = 3×33 + 1, então o resto é 1: a posição 100 é vermelha.",
       "Posições vermelhas: 1, 4, 7, ..., 100, que formam uma PA de razão 3.",
       "Número de termos: (100 − 1)/3 + 1 = 33 + 1 = 34.",
       "Conferência: 33 ciclos completos (99 posições) têm 33 vermelhos, e a posição 100 inicia um novo ciclo com mais um vermelho: 34."
      ],
      "answer": "A posição 100 é vermelha; o vermelho aparece 34 vezes nas 100 primeiras posições."
     },
     {
      "prompt": "Uma segunda-feira é o dia zero de um prazo. Em que dia da semana cairá o 1.000º dia depois dessa segunda-feira? E em que dia da semana caiu o dia que está 100 dias antes dela?",
      "steps": [
       "Para frente: só importa 1.000 mod 7. Como 7×142 = 994, o resto é 1.000 − 994 = 6.",
       "Seis dias depois de segunda: terça (1), quarta (2), quinta (3), sexta (4), sábado (5), domingo (6).",
       "Para trás: 100 mod 7 = 2 (98 = 14 semanas). Voltar 2 dias a partir de segunda: domingo (1), sábado (2).",
       "Conferência do sentido: voltar 2 dias equivale a andar 7 − 2 = 5 dias para frente a partir de segunda: terça, quarta, quinta, sexta, sábado; o mesmo resultado."
      ],
      "answer": "Daqui a 1.000 dias será domingo; 100 dias antes era sábado."
     },
     {
      "prompt": "Uma sequência de figuras segue esta regra: a figura 1 é uma seta apontando para cima com 1 bolinha; a cada figura seguinte, a seta gira 90° no sentido horário e acrescenta-se uma bolinha, de modo que a figura n tem n bolinhas. Qual é a direção da seta e o número de bolinhas na figura 250? Quantas bolinhas há ao todo nas figuras de 1 a 250?",
      "steps": [
       "Direção: ciclo de 4 direções, com resto 1 → cima, 2 → direita, 3 → baixo, 0 → esquerda (após uma volta horária).",
       "250 = 4×62 + 2, o resto é 2, portanto a figura 250 aponta para a direita.",
       "Bolinhas: figura 250 tem 250.",
       "Total de bolinhas: 1 + 2 + ... + 250 = 250×251/2 = 125×251 = 31.375.",
       "Conferência da direção com figuras pequenas: figura 2 (resto 2) aponta para a direita, coerente com a regra de girar 90° a partir da figura 1."
      ],
      "answer": "Seta para a direita, com 250 bolinhas; o total até a figura 250 é 31.375 bolinhas."
     }
    ],
    "pitfall": "Tratar o resto 0 como se não houvesse elemento, ou ignorar a origem da contagem (posição 1 versus dia zero). Evite confirmando com uma posição pequena que você conhece: a posição k (resto 0) deve ser o último elemento do ciclo.",
    "tables": [
     {
      "caption": "Ciclo de 3 cores: resto e elemento",
      "headers": [
       "Posição n",
       "Resto de n por 3",
       "Elemento"
      ],
      "rows": [
       [
        1,
        1,
        "vermelho"
       ],
       [
        2,
        2,
        "azul"
       ],
       [
        3,
        0,
        "verde"
       ],
       [
        4,
        1,
        "vermelho"
       ],
       [
        99,
        0,
        "verde"
       ],
       [
        100,
        1,
        "vermelho"
       ]
      ]
     }
    ],
    "resumo": {
     "title": "Ciclos e restos",
     "text": "Em um ciclo de k elementos, o resto de n por k localiza a posição e o resto 0 é o último elemento; no calendário, o resto por 7 desloca o dia da semana.",
     "bizu": "Teste a regra com uma posição pequena conhecida e declare de onde a contagem começa."
    }
   }
  ]
 },
 "M09": {
  "extras": [
   {
    "capitulo": 1,
    "development": [
     "Uma forma segura de controlar giros longos é usar o azimute: o ângulo medido a partir do norte, no sentido horário. Norte vale 0°, leste 90°, sul 180° e oeste 270°; as diagonais ficam no meio: nordeste 45°, sudeste 135°, sudoeste 225° e noroeste 315°. Giro à direita soma o ângulo; giro à esquerda subtrai. Se o resultado passar de 360°, desconte 360°; se ficar negativo, some 360°. Assim, voltado para o sul (180°), um giro de 135° à esquerda leva a 180−135=45°, isto é, nordeste. Convenção adotada aqui: giro à direita é sentido horário e giro à esquerda é anti-horário, sempre vistos de cima, como em um mapa.",
     "A lateralidade é onde mais se erra. Direita e esquerda pertencem a quem está olhando, e não ao mapa. Quando duas pessoas ficam frente a frente, as lateralidades se invertem: a direita de uma é a esquerda da outra. Por isso, diante de 'Carlos está à esquerda de Bruno', pergunte sempre: esquerda de quem e olhando para onde? Uma verificação rápida: voltado para o norte, a direita é o leste; voltado para o sul, a direita é o oeste; voltado para o leste, a direita é o sul; voltado para o oeste, a direita é o norte. Em todos os casos, a direita fica 90° à frente no sentido horário."
    ],
    "workedExamples": [
     {
      "prompt": "Um oficial de justiça está voltado para o sul. Ele gira 135° no sentido anti-horário, depois 270° no sentido horário e, por fim, 45° no sentido anti-horário. Para qual direção ele fica voltado?",
      "steps": [
       "Use o azimute: sul = 180°. Anti-horário subtrai e horário soma.",
       "Primeiro giro: 180−135=45°, que é nordeste.",
       "Segundo giro: 45+270=315°, que é noroeste.",
       "Terceiro giro: 315−45=270°, que é oeste.",
       "Conferência pelo total: a soma com sinais é −135+270−45=+90°, isto é, 90° no sentido horário a partir do sul; 180+90=270°, oeste."
      ],
      "answer": "Oeste."
     },
     {
      "prompt": "Ana e Bruno estão frente a frente, um de cada lado de uma mesa. Bruno olha para o norte. Carlos está sentado do lado esquerdo de Bruno. Em relação a Ana, Carlos está do lado esquerdo ou do direito?",
      "steps": [
       "Bruno olha para o norte; a esquerda de quem olha para o norte é o oeste. Logo, Carlos está a oeste de Bruno.",
       "Ana está de frente para Bruno, então olha para o sul.",
       "Para quem olha para o sul, a direita é o oeste.",
       "Carlos está a oeste, portanto fica à direita de Ana.",
       "Confirmação do princípio: frente a frente, a esquerda de um é a direita do outro."
      ],
      "answer": "Carlos está à direita de Ana."
     }
    ]
   },
   {
    "capitulo": 2,
    "development": [
     "Dois números descrevem qualquer trajeto: a distância percorrida e o deslocamento. A distância percorrida é a soma de todos os trechos, sem sinal; ela depende do caminho escolhido. O deslocamento liga o ponto inicial ao final e depende apenas desses dois pontos. Se uma pessoa vai 9 km a leste e volta 9 km a oeste, percorreu 18 km, mas o deslocamento é zero. A distância em linha reta nunca é maior que a distância percorrida; elas só coincidem quando o trajeto inteiro é em linha reta, sem retornos.",
     "Para comparar duas pessoas que partem do mesmo ponto, calcule a posição final de cada uma em coordenadas e subtraia: a diferença em x e a diferença em y são os catetos de um triângulo retângulo, e a distância entre elas é a hipotenusa. Reconhecer ternos pitagóricos acelera a conta: 3-4-5, 5-12-13, 8-15-17, 7-24-25 e seus múltiplos, como 6-8-10 e 9-12-15. Se a diferença em x ou em y for zero, não há triângulo: a distância é simplesmente o valor que sobrou, sem Pitágoras."
    ],
    "workedExamples": [
     {
      "prompt": "A partir do fórum, um oficial de justiça anda 9 km a leste, 14 km ao norte, 4 km a oeste e 2 km ao sul. Calcule a distância percorrida e a distância em linha reta até o fórum no final.",
      "steps": [
       "Adote leste como +x e norte como +y. Posição inicial (0, 0).",
       "Componente x: +9−4=+5. Componente y: +14−2=+12. Posição final: (5, 12).",
       "Distância percorrida: 9+14+4+2=29 km.",
       "Linha reta: √(5^2+12^2)=√(25+144)=√169=13 km.",
       "Observe que 13 é bem menor que 29: o trajeto teve idas e voltas."
      ],
      "answer": "Percorreu 29 km; a distância em linha reta até o fórum é 13 km."
     },
     {
      "prompt": "Dois servidores saem juntos de um mesmo ponto. O primeiro anda 10 km a leste e depois 6 km ao norte. O segundo anda 4 km a leste, 3 km a oeste e 6 km ao sul. Qual é a distância em linha reta entre os dois no final?",
      "steps": [
       "Primeiro servidor: x=10 e y=+6, isto é, (10, 6).",
       "Segundo servidor: x=+4−3=1 e y=−6, isto é, (1, −6).",
       "Diferença em x: 10−1=9. Diferença em y: 6−(−6)=12.",
       "Distância: √(9^2+12^2)=√(81+144)=√225=15 km (terno 3-4-5 multiplicado por 3).",
       "Confira o sinal de y: um está 6 km ao norte e o outro 6 km ao sul; a separação vertical é 12, e não 0."
      ],
      "answer": "15 km."
     }
    ]
   },
   {
    "capitulo": 3,
    "development": [
     "Filas e posições relativas pedem contagem cuidadosa. Se uma pessoa é a 7ª a partir da frente e a 12ª a partir do final, ela foi contada nas duas listas; por isso o total é 7+12−1=18 pessoas. Para saber quantas pessoas ficam entre duas posições a e b (com a menor que b), use b−a−1: entre a 3ª e a 7ª há 7−3−1=3 pessoas. Contar posições e contar pessoas entre elas são tarefas diferentes, e a diferença de 1 é a armadilha clássica.",
     "Em coordenadas, um giro de 90° no sentido anti-horário em torno da origem leva (x, y) a (−y, x); no sentido horário, leva (x, y) a (y, −x). O giro de 180° leva a (−x, −y). Já a reflexão não é um giro: ela inverte a orientação da figura, como um espelho. Uma sequência de transformações pode resultar em outra mais simples, e a melhor forma de descobrir é acompanhar dois pontos de teste, como (1, 0) e (0, 1), passo a passo."
    ],
    "workedExamples": [
     {
      "prompt": "Em uma fila para atendimento, Marta é a 7ª a partir da frente e a 12ª a partir do final. Paulo é o 3º a partir da frente. Quantas pessoas há na fila e quantas estão entre Paulo e Marta?",
      "steps": [
       "Marta aparece nas duas contagens: total = 7+12−1 = 18 pessoas.",
       "Paulo está na posição 3 e Marta na posição 7, ambas a partir da frente.",
       "Entre elas ficam as posições 4, 5 e 6: 7−3−1 = 3 pessoas.",
       "Verificação: depois de Marta restam 18−7=11 pessoas, e Marta é a 12ª do final (11+1=12), o que bate."
      ],
      "answer": "18 pessoas na fila e 3 entre Paulo e Marta."
     },
     {
      "prompt": "O ponto P=(3, −2) sofre, nesta ordem: giro de 90° no sentido anti-horário em torno da origem, reflexão no eixo horizontal e giro de 90° no sentido horário em torno da origem. Qual é a posição final? Essa sequência equivale a qual transformação única?",
      "steps": [
       "Regras: anti-horário (x, y)→(−y, x); reflexão no eixo horizontal (x, y)→(x, −y); horário (x, y)→(y, −x).",
       "Giro anti-horário: (3, −2)→(−(−2), 3)=(2, 3).",
       "Reflexão no eixo horizontal: (2, 3)→(2, −3).",
       "Giro horário: (2, −3)→(−3, −2).",
       "Teste com (1, 0): anti-horário (0, 1); reflexão (0, −1); horário (−1, 0). Teste com (0, 1): (−1, 0); (−1, 0); (0, 1). Em ambos, o resultado troca apenas o sinal de x.",
       "Logo, a sequência é uma reflexão no eixo vertical, (x, y)→(−x, y); aplicada a (3, −2) dá (−3, −2), como encontrado."
      ],
      "answer": "Posição final (−3, −2); a sequência equivale a uma reflexão no eixo vertical."
     }
    ]
   },
   {
    "capitulo": 4,
    "development": [
     "Para trabalhar com meses inteiros, guarde o resto de cada mês na divisão por 7: um mês de 28 dias deixa resto 0; de 29 dias, resto 1; de 30 dias, resto 2; de 31 dias, resto 3. Isso significa que o dia 1 do mês seguinte cai 0, 1, 2 ou 3 dias da semana depois do dia 1 do mês atual. Um mês de 31 dias que começa numa quinta-feira tem cinco quintas, cinco sextas e cinco sábados (os três primeiros dias da semana do mês), e quatro de cada um dos demais; o mês seguinte começa no domingo, três dias depois da quinta.",
     "Ao comparar a mesma data em anos seguidos, o dia da semana avança 1 se o intervalo não inclui 29 de fevereiro e 2 se inclui. Por exemplo, 5 de março de 2027 foi uma sexta-feira; 5 de março de 2028, depois do 29 de fevereiro de 2028, caiu em domingo (avanço de 2). Já 5 de março de 2027 em relação a 5 de março de 2026 avançou 1. Cuidado: o que importa é se o dia extra está dentro do intervalo contado, e não se o ano de partida ou o de chegada é bissexto isoladamente."
    ],
    "workedExamples": [
     {
      "prompt": "Um processo foi protocolado em uma sexta-feira, 13 de março de 2026. A lei concede prazo de 90 dias corridos, contados a partir do dia seguinte ao protocolo, isto é, a data final é o protocolo mais 90 dias. Em que data e em que dia da semana termina o prazo?",
      "steps": [
       "Convenção: o dia 14 de março é o dia 1; a data final é 13 de março + 90 dias.",
       "Restam de março após o dia 13: 31−13=18 dias (até 31/03). Abril tem 30 dias: 18+30=48 (até 30/04). Maio tem 31: 48+31=79 (até 31/05).",
       "Faltam 90−79=11 dias em junho: a data final é 11 de junho de 2026.",
       "Dia da semana: 90 = 12×7+6, resto 6. Sexta-feira mais 6 dias: sábado (1), domingo (2), segunda (3), terça (4), quarta (5), quinta (6)."
      ],
      "answer": "11 de junho de 2026, quinta-feira."
     },
     {
      "prompt": "Uma audiência foi marcada para 5 de março de 2027, uma sexta-feira, e remarcada para a mesma data e mês de 2028. Em que dia da semana cai 5 de março de 2028? E 25 de dezembro de 2028, sabendo que 25 de dezembro de 2027 caiu em um sábado?",
      "steps": [
       "De 5/03/2027 a 5/03/2028 há 366 dias, pois o período inclui 29/02/2028.",
       "366 = 52×7+2, resto 2. Sexta-feira mais 2 dias: sábado, domingo.",
       "Portanto, 5 de março de 2028 caiu em um domingo.",
       "Para 25/12: de 25/12/2027 a 25/12/2028 também há 366 dias (inclui 29/02/2028), resto 2. Sábado mais 2 dias: domingo, segunda.",
       "Confira os dois resultados contando os dias de fevereiro de 2028: ele tem 29 dias, e é por isso que o avanço foi de 2 e não de 1."
      ],
      "answer": "5 de março de 2028 é domingo; 25 de dezembro de 2028 é segunda-feira."
     }
    ]
   },
   {
    "capitulo": 5,
    "development": [
     "Controle de jornada é um bom campo para treinar horários. Para calcular a permanência, subtraia o horário de entrada do de saída (em minutos) e depois desconte o intervalo. Entrando às 7h50 e saindo às 17h05, o servidor permanece 17h05−7h50=9h15, ou 555 minutos. Se o almoço foi de 1h15 (75 minutos), o trabalho efetivo é 555−75=480 minutos, isto é, 8 horas. Na hora de somar vários dias, some primeiro os minutos totais e só depois converta em horas, evitando acumular transportes de base 60 a cada dia.",
     "Quando o período cruza a meia-noite, calcule o trecho até as 24h e o trecho após as 0h, ou adicione 24 horas ao horário final. Das 19h45 às 6h20, o intervalo é (24h−19h45)+6h20=4h15+6h20=10h35. Ao descontar pausas, desconte-as uma única vez do total, mesmo que estejam dentro de trechos diferentes. Outro cuidado: 10h35 não é 10,35 horas. Para converter em decimais, 35 minutos valem 35/60 de hora, e 10h35 correspondem a 635/60 horas, aproximadamente 10,58."
    ],
    "workedExamples": [
     {
      "prompt": "Um servidor entra às 7h50 e sai às 17h05, com 1h15 de intervalo para almoço, de segunda a sexta-feira. Calcule o tempo efetivo por dia e na semana de 5 dias.",
      "steps": [
       "Permanência: das 7h50 às 17h05. Convertendo em minutos: 17×60+5=1025 e 7×60+50=470; 1025−470=555 minutos.",
       "Intervalo: 1h15=75 minutos. Trabalho efetivo: 555−75=480 minutos=8 horas.",
       "Semana: 5×480=2400 minutos=40 horas.",
       "Conferência por horas e minutos: 17h05−7h50 = 9h15; 9h15−1h15 = 8h00."
      ],
      "answer": "8 horas por dia e 40 horas na semana."
     },
     {
      "prompt": "Um plantão noturno vai das 19h45 às 6h20 do dia seguinte e tem duas pausas de 25 minutos cada, ambas dentro do plantão. Um servidor cumpre 4 plantões iguais em uma semana. Quantas horas efetivas ele trabalha na semana?",
      "steps": [
       "Duração bruta: de 19h45 até 24h são 4h15 (255 minutos); de 0h até 6h20 são 380 minutos; total 255+380=635 minutos (10h35).",
       "Pausas: 2×25=50 minutos, descontadas uma vez.",
       "Efetivo por plantão: 635−50=585 minutos=9h45.",
       "Quatro plantões: 4×585=2340 minutos; 2340÷60=39 horas.",
       "Verificação: 4×9h45 = 36h + 4×45min = 36h+180min = 36h+3h = 39h."
      ],
      "answer": "39 horas efetivas na semana."
     }
    ]
   }
  ],
  "novosCapitulos": [
   {
    "title": "Pontos cardeais, azimutes e distância final",
    "paragraphs": [
     "Para se orientar em problemas de trajeto, você precisa de duas ferramentas: uma regra para saber para onde está voltado e outra para saber onde está. A primeira é o azimute, o ângulo contado a partir do norte no sentido horário. Norte é 0°, nordeste 45°, leste 90°, sudeste 135°, sul 180°, sudoeste 225°, oeste 270° e noroeste 315°. Esses oito pontos formam a rosa dos ventos, com 45° entre vizinhos. Girar à direita é somar; girar à esquerda é subtrair; o resultado sempre volta para o intervalo de 0° a 360°.",
     "A segunda ferramenta é o plano cartesiano alinhado com o mapa: norte é +y, sul é −y, leste é +x e oeste é −x. Cada trecho reto na direção N, S, L ou O muda apenas uma das coordenadas. Ao final, a posição (x, y) diz tudo: o valor absoluto de x e de y são as distâncias de cada eixo, o sinal de x diz se está a leste ou a oeste do ponto de partida, e o sinal de y diz se está ao norte ou ao sul. Para saber em que direção fica o ponto de partida, olhe o sinal contrário.",
     "Quando o enunciado pede a distância final em linha reta, aplique Pitágoras sobre as coordenadas: d = √(x^2+y^2). Ela é diferente da distância percorrida, que soma todos os trechos. Os ternos pitagóricos 3-4-5, 5-12-13, 8-15-17 e 7-24-25, assim como seus múltiplos (por exemplo, 9-12-15 e 15-20-25), aparecem com frequência. Convenção adotada: trechos de deslocamento só ocorrem nas quatro direções cardeais; as diagonais da rosa dos ventos servem para dizer para onde a pessoa olha."
    ],
    "example": "Exemplo resolvido: uma pessoa voltada para sudeste (135°) gira 90° no sentido anti-horário: 135−90=45°, nordeste. Se girar mais 180°, passa a 45+180=225°, sudoeste.",
    "development": [
     "Há três variações de enunciado que convém reconhecer. Na primeira, os giros vêm em graus (45°, 90°, 135°, 180°, 225°, 270°, 315°); basta usar azimute e somar ou subtrair. Na segunda, os giros vêm como 'vire à direita' ou 'vire à esquerda' sem ângulo; cada um vale 90°. Na terceira, o enunciado pede a direção do ponto de partida em relação à posição final: como o ponto de partida é a origem, ele está do lado contrário ao sinal das coordenadas finais. Se a posição final é (7, −24), a origem fica 7 unidades a oeste e 24 ao norte do ponto final.",
     "Casos de fronteira: se uma das coordenadas finais é zero, a pessoa está exatamente sobre um eixo e a distância em linha reta é o valor da outra coordenada, sem Pitágoras. Se as duas forem zero, ela voltou ao ponto de partida: o deslocamento é nulo, embora a distância percorrida possa ser grande. Quando há dúvida entre distância 'percorrida' e 'em linha reta', releia o verbo: 'quanto andou' pede soma dos trechos; 'a que distância está' pede linha reta; 'quanto precisa andar pelas ruas para voltar' pede a soma de |x| e |y|."
    ],
    "method": [
     "Escreva o azimute inicial e o ponto (0, 0).",
     "Para cada comando, atualize o azimute (se for giro) ou a posição (se for trecho), usando norte=+y e leste=+x.",
     "Ao final, anote a posição (x, y), a distância percorrida e a orientação final.",
     "Se pedir linha reta, aplique √(x^2+y^2) e procure um terno pitagórico; se pedir caminho de volta pelas ruas, some |x|+|y|."
    ],
    "workedExamples": [
     {
      "prompt": "Voltado para o noroeste, um segurança gira 225° no sentido horário e, em seguida, 90° no sentido anti-horário. Para qual direção fica voltado?",
      "steps": [
       "Noroeste = 315°.",
       "Giro de 225° no sentido horário: 315+225=540°; como passa de 360°, subtraia 360°: 540−360=180°, sul.",
       "Giro de 90° no sentido anti-horário: 180−90=90°, leste.",
       "Conferência pelo total com sinais: +225−90=+135° no sentido horário; 315+135=450°, 450−360=90°, leste."
      ],
      "answer": "Leste."
     },
     {
      "prompt": "Um oficial parte de um ponto voltado para o norte e executa: anda 14 m; vira à direita e anda 8 m; vira à direita e anda 2 m; vira à direita e anda 3 m. Determine a posição final, a distância percorrida, a distância em linha reta até o ponto de partida e a direção em que o oficial fica voltado ao final.",
      "steps": [
       "Início: (0, 0), azimute 0° (norte).",
       "Anda 14 m para o norte: (0, 14). Vira à direita: 90°, leste.",
       "Anda 8 m para o leste: (8, 14). Vira à direita: 180°, sul.",
       "Anda 2 m para o sul: (8, 12). Vira à direita: 270°, oeste.",
       "Anda 3 m para o oeste: (5, 12). Orientação final: oeste.",
       "Percorrido: 14+8+2+3=27 m. Linha reta: √(5^2+12^2)=√169=13 m.",
       "O ponto de partida está 5 m a oeste e 12 m ao sul da posição final."
      ],
      "answer": "Posição final (5, 12); percorreu 27 m; 13 m em linha reta; voltado para o oeste."
     },
     {
      "prompt": "Um oficial parte de um ponto voltado para o sul e executa: anda 30 m; vira à esquerda e anda 10 m; vira à esquerda e anda 6 m; vira à esquerda e anda 3 m. Qual é a distância em linha reta até o ponto de partida? Para voltar usando apenas corredores nos sentidos norte-sul e leste-oeste, quantos metros ele precisa andar?",
      "steps": [
       "Início: (0, 0), voltado para o sul (180°). Esquerda subtrai 90°.",
       "Anda 30 m ao sul: (0, −30). Vira à esquerda: 90°, leste.",
       "Anda 10 m a leste: (10, −30). Vira à esquerda: 0°, norte.",
       "Anda 6 m ao norte: (10, −24). Vira à esquerda: 270°, oeste.",
       "Anda 3 m a oeste: (7, −24).",
       "Linha reta: √(7^2+24^2)=√(49+576)=√625=25 m (terno 7-24-25).",
       "Caminho de volta pelos corredores: |7|+|−24|=31 m. A diferença entre 25 e 31 mostra que a linha reta é o menor caminho possível.",
       "Percorrido na ida: 30+10+6+3=49 m."
      ],
      "answer": "25 m em linha reta; 31 m pelos corredores."
     }
    ],
    "pitfall": "Aplicar o giro à esquerda como se fosse à direita, ou esquecer de atualizar a orientação depois de cada giro. Para evitar, escreva o azimute ao lado de cada trecho e lembre que direita soma, esquerda subtrai.",
    "tables": [
     {
      "caption": "Rosa dos ventos com azimutes",
      "headers": [
       "Direção",
       "Sigla",
       "Azimute (a partir do norte, sentido horário)",
       "Direita de quem olha nessa direção"
      ],
      "rows": [
       [
        "Norte",
        "N",
        "0°",
        "Leste"
       ],
       [
        "Nordeste",
        "NE",
        "45°",
        "Sudeste"
       ],
       [
        "Leste",
        "L",
        "90°",
        "Sul"
       ],
       [
        "Sudeste",
        "SE",
        "135°",
        "Sudoeste"
       ],
       [
        "Sul",
        "S",
        "180°",
        "Oeste"
       ],
       [
        "Sudoeste",
        "SO",
        "225°",
        "Noroeste"
       ],
       [
        "Oeste",
        "O",
        "270°",
        "Norte"
       ],
       [
        "Noroeste",
        "NO",
        "315°",
        "Nordeste"
       ]
      ]
     }
    ],
    "resumo": {
     "title": "Azimute e distância final",
     "text": "O azimute parte do norte e cresce no sentido horário: direita soma e esquerda subtrai. Com norte=+y e leste=+x, a posição final dá a distância em linha reta por Pitágoras.",
     "bizu": "Ternos 3-4-5, 5-12-13, 8-15-17 e 7-24-25 poupam a raiz."
    }
   },
   {
    "title": "Calendário, meses e dias da semana",
    "paragraphs": [
     "A semana tem 7 dias e se repete sem parar, por isso a ferramenta central do calendário é o resto da divisão por 7. Para saber o dia da semana de N dias depois de hoje, divida N por 7 e use somente o resto: o quociente representa semanas completas, que não mudam o dia. Se hoje é quinta-feira e passam 100 dias, 100 = 14×7+2, resto 2; dois dias depois de quinta é sábado. Para N dias antes, o raciocínio é o mesmo, mas o resto é contado para trás: 100 dias antes de quinta-feira é terça-feira.",
     "Os meses têm 28 ou 29 dias (fevereiro), 30 dias (abril, junho, setembro e novembro) ou 31 dias (os demais). Um ano comum tem 365 dias e um bissexto tem 366. É bissexto o ano divisível por 4, exceto os anos terminados em 00, que só são bissextos se forem divisíveis por 400: 2024 e 2028 são bissextos, 1900 não foi, 2000 foi. Como 365 = 52×7+1, um ano comum faz a mesma data avançar 1 dia da semana, e o bissexto, 2, desde que o intervalo inclua 29 de fevereiro.",
     "O maior cuidado de leitura é a convenção de contagem. Aqui, 'daqui a N dias' significa hoje mais N, com o dia de hoje não contado: dia 10 mais 5 é dia 15. Já em 'do dia 10 ao dia 15, inclusive', contam-se as duas pontas, resultando em 6 dias (15−10+1). Quando o enunciado não disser, adote a contagem por intervalos (final menos inicial). Prazos 'a partir do dia seguinte' também se resolvem por intervalo: protocolo mais N dias."
    ],
    "example": "Exemplo resolvido: hoje é quinta-feira. Daqui a 100 dias será sábado, pois 100 mod 7 = 2 e quinta mais 2 dias é sábado. Há 100 dias foi terça-feira, pois quinta menos 2 dias é terça.",
    "development": [
     "Variações de enunciado comuns: 'em que dia da semana cai o dia 1º do mês seguinte', 'quantas sextas-feiras tem o mês', 'quantos dias faltam entre duas datas' e 'daqui a quantas semanas'. Em todas elas, converta o intervalo em dias, divida por 7 e use quociente (semanas) ou resto (deslocamento na semana). Para contar quantas vezes um dia da semana aparece em um intervalo de N dias, use o quociente N÷7: cada dia aparece pelo menos esse número de vezes, e os primeiros (N mod 7) dias da semana, a partir do primeiro dia do intervalo, aparecem uma vez a mais.",
     "Casos de fronteira: o resto zero significa o mesmo dia da semana (exatamente semanas completas), não 'nenhum dia'; um intervalo de 365 dias em ano comum cai um dia da semana à frente; e o dia 29 de fevereiro só existe em anos bissextos. Ao subtrair datas em meses diferentes, some os dias que faltam para o fim do mês de partida, os meses completos no meio e os dias do mês de chegada. Uma conferência útil: refaça a conta de outra forma, por exemplo contando de trás para a frente a partir da data final."
    ],
    "method": [
     "Defina a convenção: intervalo (hoje+N) ou contagem inclusiva das duas pontas.",
     "Converta o período em número de dias, atravessando os meses e conferindo se fevereiro tem 28 ou 29 dias.",
     "Divida o total por 7 e guarde o resto (para dias futuros) ou o resto contado para trás (para dias passados).",
     "Avance ou recue esse resto a partir do dia da semana conhecido e confirme listando os dias, se o resto for pequeno."
    ],
    "workedExamples": [
     {
      "prompt": "Uma citação foi expedida na quinta-feira, 20 de janeiro de 2028. O prazo para resposta é de 45 dias corridos, contados a partir do dia seguinte, isto é, a data final é a expedição mais 45 dias. Qual é a data final e em que dia da semana ela cai? Em que data cairia se o ano não fosse bissexto?",
      "steps": [
       "Janeiro tem 31 dias: de 20 a 31 de janeiro são 11 dias.",
       "Fevereiro de 2028 tem 29 dias, pois 2028 é bissexto (divisível por 4 e não termina em 00): 11+29=40 dias até 29/02.",
       "Faltam 45−40=5 dias em março: a data final é 5 de março de 2028.",
       "Dia da semana: 45 = 6×7+3, resto 3. Quinta mais 3 dias: sexta, sábado, domingo.",
       "Se fevereiro tivesse 28 dias: 11+28=39 dias até 28/02 e faltariam 6 dias, resultando em 6 de março."
      ],
      "answer": "5 de março de 2028, domingo; em um ano comum seria 6 de março."
     },
     {
      "prompt": "Um curso de capacitação será ministrado em todos os dias corridos de 15 a 30 de março de 2026, inclusive as duas datas. Quantos dias de curso há? Se o dia 15 foi um domingo, em que dia da semana cai o dia 30 e quantos domingos há no período?",
      "steps": [
       "Contagem inclusiva: 30−15+1=16 dias.",
       "Dias entre 15 e 30 (intervalo): 30−15=15; 15 = 2×7+1, resto 1. Domingo mais 1 dia: segunda-feira, dia 30.",
       "Os domingos do período: dias 15, 22 e 29.",
       "Conferência: 16 = 2×7+2, isto é, 2 semanas completas mais 2 dias; os dois primeiros dias do período (domingo e segunda) aparecem 3 vezes e os demais, 2 vezes."
      ],
      "answer": "16 dias; o dia 30 é segunda-feira; há 3 domingos (15, 22 e 29)."
     },
     {
      "prompt": "Em 2029, o dia 1º de janeiro cai em uma segunda-feira (ano comum, 365 dias). Determine: (a) quantas segundas-feiras e quantas sextas-feiras há em 2029; (b) o dia da semana de 1º de março de 2029; (c) o dia da semana de 1º de janeiro de 2030.",
      "steps": [
       "(a) 365 = 52×7+1: há 52 semanas completas, cada dia da semana aparece 52 vezes, e o dia que sobra (o primeiro, segunda-feira) aparece uma 53ª vez. Segundas: 53; sextas: 52.",
       "(b) De 1º de janeiro a 1º de março, passam 31 (janeiro) + 28 (fevereiro, ano comum) = 59 dias. 59 = 8×7+3, resto 3. Segunda mais 3: terça, quarta, quinta.",
       "(c) 31 de dezembro de 2029 é o dia 365 do ano, ou seja, 364 dias depois de 1º de janeiro; 364 = 52×7, resto 0, logo 31/12/2029 é segunda-feira e 1º/01/2030 é terça-feira.",
       "Conferência de (c): ano comum desloca a mesma data em 1 dia da semana: segunda mais 1 é terça."
      ],
      "answer": "(a) 53 segundas e 52 sextas; (b) quinta-feira; (c) terça-feira."
     }
    ],
    "pitfall": "Confundir contagem por intervalo com contagem inclusiva, ou esquecer o 29 de fevereiro ao cruzar um ano bissexto. Para evitar, escreva a convenção antes de contar e verifique se a data de fevereiro está dentro do período.",
    "tables": [
     {
      "caption": "Meses e restos por 7",
      "headers": [
       "Duração do mês",
       "Meses",
       "Resto na divisão por 7",
       "Efeito no dia 1 do mês seguinte"
      ],
      "rows": [
       [
        "28 dias",
        "Fevereiro (ano comum)",
        "0",
        "Mesmo dia da semana"
       ],
       [
        "29 dias",
        "Fevereiro (ano bissexto)",
        "1",
        "Avança 1 dia"
       ],
       [
        "30 dias",
        "Abril, junho, setembro, novembro",
        "2",
        "Avança 2 dias"
       ],
       [
        "31 dias",
        "Janeiro, março, maio, julho, agosto, outubro, dezembro",
        "3",
        "Avança 3 dias"
       ]
      ]
     }
    ],
    "resumo": {
     "title": "Calendário e módulo 7",
     "text": "Dias da semana repetem de 7 em 7: use o resto da divisão por 7. Meses de 28, 29, 30 e 31 dias deixam restos 0, 1, 2 e 3, e o ano bissexto exige divisibilidade por 4, com exceção dos séculos não divisíveis por 400.",
     "bizu": "Escreva a convenção (intervalo ou inclusiva) antes de qualquer conta."
    }
   },
   {
    "title": "Horários, relógios e linha do tempo",
    "paragraphs": [
     "Horários seguem a base 60: uma hora tem 60 minutos e um minuto tem 60 segundos. Por isso, ao somar 3h50 e 2h35 não se escreve 5h85: 50+35=85 minutos, que viram 1h25, resultando em 6h25. O caminho mais seguro é converter tudo para minutos, fazer a conta e converter de volta com a divisão por 60. Para somar horários de um dia só, vale também o transporte: 60 minutos viram 1 hora; 24 horas viram 1 dia.",
     "Intervalos que cruzam a meia-noite exigem atenção. Se um turno começa às 22h30 e termina às 5h15 do dia seguinte, some o trecho até a meia-noite (1h30) ao trecho depois (5h15), obtendo 6h45; ou calcule 5h15+24h−22h30=6h45. Em fusos horários, trate a diferença como horas a mais ou a menos: se a cidade B está 3 horas à frente da cidade A, quando é 9h em A são 12h em B. A duração real de um voo ou evento não muda; só muda o horário em que a hora local é lida.",
     "O relógio analógico tem uma regra própria. O ponteiro dos minutos gira 360° em 60 minutos, ou seja, 6° por minuto. O ponteiro das horas gira 360° em 12 horas, ou seja, 30° por hora ou 0,5° por minuto. Às h horas e m minutos, o ponteiro das horas está a 30h+0,5m graus, e o dos minutos a 6m graus; a diferença é 30h+0,5m−6m = 30h−5,5m. O ângulo entre os ponteiros é o valor absoluto dessa diferença; se passar de 180°, subtraia de 360° para obter o menor ângulo."
    ],
    "example": "Exemplo resolvido: às 4h20, o ponteiro das horas está a 30×4+0,5×20=130° e o dos minutos a 6×20=120°; o ângulo entre eles é 10°. A fórmula 30h−5,5m dá |120−110|=10°.",
    "development": [
     "Variações frequentes de enunciado: horário de chegada dado o de saída mais duração; duração dada a partida e a chegada em fusos diferentes; diferença entre dois horários em dias diferentes; ângulo para determinado horário; ou o minuto em que os ponteiros formam certo ângulo. Para linhas do tempo, desenhe uma reta, marque cada horário e escreva as durações entre os pontos. Termos como 'antes', 'depois' e 'ao mesmo tempo' só dão ordem: não invente durações que o enunciado não forneceu.",
     "Casos especiais no relógio: em horários cheios (m=0), a fórmula se reduz a 30h; assim, às 12h, 3h, 6h e 9h os ângulos são 0°, 90°, 180° e 90°, e às 5h é 150°. Ao usar a fórmula, se o resultado for maior que 180°, o ângulo menor é o complemento até 360°; por exemplo, às 9h15, |30×9−5,5×15|=|270−82,5|=187,5° e o menor ângulo é 360−187,5=172,5°. Em problemas inversos (dado o ângulo, achar os minutos), lembre que o menor ângulo de 130° pode corresponder a uma diferença de 130° ou de 230° (360−130), com os dois sinais. Resolva 30h−5,5m = ±130 e 30h−5,5m = ±230 e descarte as soluções com minutos fora do intervalo de 0 a 60; se o enunciado exigir minuto inteiro, descarte também as frações."
    ],
    "method": [
     "Converta horários e durações para minutos (ou use transporte de base 60 com cuidado).",
     "Se houver fuso, converta todos os horários para um mesmo fuso antes de comparar ou subtrair; se cruzar a meia-noite, some 24 horas ao horário final.",
     "Para relógios, calcule 30h−5,5m, tome o valor absoluto e, se passar de 180°, subtraia de 360°.",
     "Confira o resultado por outro caminho (por exemplo, simulando os ponteiros em graus ou somando as durações por trechos)."
    ],
    "workedExamples": [
     {
      "prompt": "Três etapas de um serviço duram 3h50, 2h35 e 1h45, uma depois da outra. Se a primeira começa às 8h40, a que horas termina a última etapa, e qual é a duração total?",
      "steps": [
       "Em minutos: 3h50=230; 2h35=155; 1h45=105.",
       "Soma: 230+155+105=490 minutos; 490÷60=8 e resto 10, ou seja, 8h10.",
       "Término: 8h40+8h10=16h50 (40+10=50 minutos e 8+8=16 horas).",
       "Conferência por trechos: 8h40+3h50=12h30; 12h30+2h35=15h05; 15h05+1h45=16h50."
      ],
      "answer": "Duração total de 8h10; término às 16h50."
     },
     {
      "prompt": "Qual é o menor ângulo entre os ponteiros do relógio às 4h20 e às 10h40? Confirme o primeiro por simulação dos dois ponteiros.",
      "steps": [
       "Fórmula: ângulo = |30h−5,5m|, reduzido a menos de 180°.",
       "4h20: |30×4−5,5×20|=|120−110|=10°.",
       "Simulação: 4h20 = 4×60+20=260 minutos desde 0h00 (ciclo de 12 h); o ponteiro das horas anda 0,5° por minuto: 260×0,5=130°; o dos minutos fica em 20×6=120°; diferença 130−120=10°.",
       "10h40: |30×10−5,5×40|=|300−220|=80°.",
       "Simulação: 10×60+40=640 minutos; 640×0,5=320°; minutos: 40×6=240°; 320−240=80°. Como 80° é menor que 180°, é o ângulo procurado."
      ],
      "answer": "10° às 4h20 e 80° às 10h40."
     },
     {
      "prompt": "Entre 8h e 9h, os ponteiros de um relógio formam um ângulo de 130° (o menor entre eles) em um instante com minuto inteiro. Qual é o horário?",
      "steps": [
       "Fórmula: |30×8−5,5m|=|240−5,5m|. O menor ângulo vale 130° quando essa diferença é 130° ou 230° (=360−130), com qualquer sinal.",
       "Diferença +130: 240−5,5m=130, então 5,5m=110 e m=20.",
       "Diferença −130: 5,5m−240=130, então 5,5m=370 e m≈67,3, fora do intervalo de 0 a 60; descarte.",
       "Diferença +230: 240−5,5m=230, então m=10/5,5≈1,82, que não é minuto inteiro; descarte. Diferença −230: m≈85,5, fora do intervalo.",
       "Verificação: às 8h20, o ponteiro das horas está a 8×30+20×0,5=250° e o dos minutos a 20×6=120°; 250−120=130°."
      ],
      "answer": "8h20."
     },
     {
      "prompt": "Um voo parte de Fortaleza às 21h40 (hora local) e dura 8h35. A cidade de destino está 3 horas à frente de Fortaleza. A que horas, no relógio de Fortaleza, e a que horas, no relógio do destino, e em que dia o voo chega, se partiu em uma segunda-feira?",
      "steps": [
       "Em minutos: 21h40=1300; 8h35=515. Chegada em horário de Fortaleza: 1300+515=1815 minutos.",
       "Como 1815 passa de 1440 (24 h), subtraia 1440: 1815−1440=375 minutos = 6h15 do dia seguinte (terça-feira).",
       "Relógio do destino: 6h15+3h=9h15, também na terça-feira.",
       "Conferência: das 21h40 até a meia-noite são 2h20; 8h35−2h20=6h15 depois da meia-noite, o que bate com o horário de Fortaleza."
      ],
      "answer": "Chega às 6h15 pelo relógio de Fortaleza (9h15 no destino), na terça-feira."
     }
    ],
    "pitfall": "Somar ou subtrair horários como se os minutos fossem decimais (por exemplo, 2h50+1h30=3h80), ou esquecer de converter o fuso antes de comparar horários. Para evitar, converta tudo para minutos e use um único fuso na conta.",
    "tables": [
     {
      "caption": "Velocidades dos ponteiros e fórmula do ângulo",
      "headers": [
       "Ponteiro",
       "Giro completo",
       "Velocidade",
       "Posição às h horas e m minutos"
      ],
      "rows": [
       [
        "Minutos",
        "60 minutos",
        "6° por minuto",
        "6m"
       ],
       [
        "Horas",
        "12 horas",
        "30° por hora, ou 0,5° por minuto",
        "30h+0,5m"
       ],
       [
        "Diferença entre eles",
        "—",
        "5,5° por minuto",
        "|30h−5,5m| (se maior que 180°, subtrair de 360°)"
       ]
      ]
     }
    ],
    "resumo": {
     "title": "Horários e relógios",
     "text": "Horários usam base 60: converta para minutos, trabalhe em um único fuso e some 24 horas quando cruzar a meia-noite. O ângulo entre os ponteiros é |30h−5,5m|.",
     "bizu": "10h35 não é 10,35 horas; use minutos."
    }
   }
  ]
 },
 "M10": {
  "extras": [
   {
    "capitulo": 1,
    "development": [
     "A ordem das operações é uma convenção, e não uma lei da natureza: todos concordamos em segui-la para que uma mesma expressão tenha um único valor. Por isso, quando há operações de mesma prioridade em sequência, a leitura é sempre da esquerda para a direita. Em 10−4−3, o resultado é 6−3=3, e não 10−(4−3)=9. Em 100÷5÷2, o resultado é 20÷2=10, e não 100÷(5÷2)=40. Subtração e divisão não são associativas, ou seja, mudar o agrupamento muda o resultado; já a soma e a multiplicação podem ser reagrupadas sem alterar o valor.",
     "Outro ponto de atenção é o sinal depois de um expoente ou antes de uma subtração. Em −2^4, a potência é calculada primeiro e depois se toma o oposto: −16. Em (−2)^4, o sinal faz parte da base: 16. Com expoente par, a base negativa produz resultado positivo; com expoente ímpar, o resultado mantém o sinal negativo, como em (−2)^3=−8. Quando aparecem colchetes e chaves, trate-os como parênteses de nível mais externo: resolva do mais interno para o mais externo, sempre conferindo se cada sinal foi levado junto do seu número."
    ],
    "workedExamples": [
     {
      "prompt": "Calcule 5×(−3)² − 24÷(−4)×2 + (−2)³.",
      "steps": [
       "Potências primeiro: (−3)²=9 e (−2)³=−8. A expressão fica 5×9 − 24÷(−4)×2 + (−8).",
       "Multiplicações e divisões da esquerda para a direita: 5×9=45; 24÷(−4)=−6 e depois −6×2=−12.",
       "Agora as somas e subtrações: 45 − (−12) + (−8) = 45 + 12 − 8 = 49."
      ],
      "answer": "49."
     },
     {
      "prompt": "Calcule 20 − [3×(−4) + 2×(5−8)²] ÷ (−3).",
      "steps": [
       "Resolva o parêntese interno: 5−8=−3. Em seguida, a potência: (−3)²=9.",
       "Dentro dos colchetes: 3×(−4)=−12 e 2×9=18, então −12+18=6.",
       "O colchete vale 6, e a divisão é 6÷(−3)=−2, que ocorre antes da subtração final.",
       "Por fim, 20 − (−2) = 20 + 2 = 22."
      ],
      "answer": "22."
     }
    ],
    "tables": [
     {
      "caption": "Casos em que a ordem muda o valor",
      "headers": [
       "Expressão",
       "Leitura correta",
       "Resultado"
      ],
      "rows": [
       [
        "10−4−3",
        "(10−4)−3, da esquerda para a direita",
        "3"
       ],
       [
        "100÷5÷2",
        "(100÷5)÷2",
        "10"
       ],
       [
        "2+3×4",
        "multiplicação antes da soma",
        "14"
       ],
       [
        "−2^4",
        "oposto de 2^4",
        "−16"
       ],
       [
        "(−2)^4",
        "a base é −2",
        "16"
       ]
      ]
     }
    ]
   },
   {
    "capitulo": 2,
    "development": [
     "Comparar frações exige uma régua comum. Entre 3/7 e 4/9, multiplique em cruz: 3×9=27 e 4×7=28. Como 27 é menor que 28, conclui-se que 3/7 é menor que 4/9. Isso funciona porque equivale a levar as duas frações ao denominador comum 63: 27/63 e 28/63. Nas frações de denominadores positivos, o sentido da desigualdade é preservado; por isso, o método só deve ser usado com denominadores positivos.",
     "Dízimas periódicas também são frações. Para 0,444..., chame o número de x: 10x=4,444..., e subtrair x dá 9x=4, logo x=4/9. Quando há parte não periódica, como em 1,2333..., usa-se uma multiplicação que posiciona o período logo após a vírgula e outra que o posiciona uma casa depois: 100x=123,333... e 10x=12,333.... A diferença elimina o período: 90x=111, logo x=111/90=37/30. Dízimas são racionais; já números como a raiz quadrada de 2 têm infinitos decimais sem repetição e não são frações."
    ],
    "workedExamples": [
     {
      "prompt": "Calcule 0,75 + 2/5 − 0,125 e dê a resposta como fração irredutível e como decimal.",
      "steps": [
       "Converta os decimais: 0,75=75/100=3/4 e 0,125=125/1000=1/8.",
       "O denominador comum de 4, 5 e 8 é 40: 3/4=30/40, 2/5=16/40 e 1/8=5/40.",
       "Some e subtraia numeradores: 30+16−5=41, resultando em 41/40, que já é irredutível porque 41 é primo.",
       "Conferência em decimais: 0,75+0,4−0,125=1,025, que é igual a 41/40."
      ],
      "answer": "41/40, ou 1,025."
     },
     {
      "prompt": "Calcule 0,444... + 1,2333... e escreva o resultado como fração.",
      "steps": [
       "Para 0,444...: x=0,444..., então 10x=4,444... e 9x=4, logo x=4/9.",
       "Para 1,2333...: y=1,2333..., então 100y=123,333... e 10y=12,333...; subtraindo, 90y=111, logo y=111/90=37/30.",
       "Denominador comum 90: 4/9=40/90 e 37/30=111/90. A soma é 151/90.",
       "Conferência decimal: 0,4444...+1,2333...=1,6777..., e 151÷90=1,6777.... A fração é irredutível porque 151 é primo."
      ],
      "answer": "151/90, ou 1 inteiro e 61/90 (aproximadamente 1,678)."
     }
    ],
    "tables": [
     {
      "caption": "Dízimas e suas frações geratrizes",
      "headers": [
       "Dízima",
       "Fração",
       "Como obter"
      ],
      "rows": [
       [
        "0,333...",
        "1/3",
        "9x=3"
       ],
       [
        "0,444...",
        "4/9",
        "9x=4"
       ],
       [
        "0,4545...",
        "5/11",
        "99x=45, simplificando por 9"
       ],
       [
        "1,2333...",
        "37/30",
        "90x=111, simplificando por 3"
       ]
      ]
     }
    ]
   },
   {
    "capitulo": 3,
    "development": [
     "Para dois números naturais, vale uma relação muito útil: MDC × MMC = produto dos dois números. Com 84 e 126, o MDC é 42 e o MMC é 252, e 42×252=10.584=84×126. A relação vale apenas para dois números; com três ou mais, ela não se aplica. Ela ajuda quando o enunciado fornece o MDC, o MMC e um dos números, e pede o outro: basta dividir o produto MDC×MMC pelo número conhecido.",
     "Outra aplicação é a de restos iguais. Se um número N deixa resto r quando dividido por vários divisores, então N−r é múltiplo de todos eles, e o menor valor positivo de N−r é o MMC. Assim, N=MMC+r, desde que r seja menor que todos os divisores. Nesse tipo de enunciado, atenção ao que se pede: o menor número que deixa resto é MMC+r; o menor múltiplo comum, por si só, deixa resto zero. Se, em vez disso, faltar 1 unidade para completar cada divisão (resto igual ao divisor menos 1), o menor número é MMC−1."
    ],
    "workedExamples": [
     {
      "prompt": "O MDC de dois números naturais é 12 e o MMC é 180. Se um deles é 36, qual é o outro?",
      "steps": [
       "Use a relação MDC×MMC = produto dos dois números: 12×180=2.160.",
       "O outro número é 2.160÷36=60.",
       "Conferência: 36=2²×3² e 60=2²×3×5. O MDC usa os menores expoentes: 2²×3=12. O MMC usa os maiores: 2²×3²×5=180."
      ],
      "answer": "60."
     },
     {
      "prompt": "Qual é o menor número natural que, dividido por 8, por 12 e por 15, deixa sempre resto 5?",
      "steps": [
       "Se N deixa resto 5, então N−5 é múltiplo de 8, de 12 e de 15.",
       "Fatore: 8=2³, 12=2²×3, 15=3×5. O MMC é 2³×3×5=120.",
       "O menor valor positivo de N−5 é 120, então N=125. O resto 5 é menor que os divisores 8, 12 e 15, portanto é possível.",
       "Conferência: 125=8×15+5, 125=12×10+5 e 125=15×8+5."
      ],
      "answer": "125."
     }
    ],
    "tables": [
     {
      "caption": "MDC e MMC de 84, 126 e 210",
      "headers": [
       "Número",
       "Fator 2",
       "Fator 3",
       "Fator 5",
       "Fator 7"
      ],
      "rows": [
       [
        "84",
        "2²",
        "3¹",
        "—",
        "7¹"
       ],
       [
        "126",
        "2¹",
        "3²",
        "—",
        "7¹"
       ],
       [
        "210",
        "2¹",
        "3¹",
        "5¹",
        "7¹"
       ],
       [
        "MDC",
        "2¹",
        "3¹",
        "—",
        "7¹"
       ],
       [
        "MMC",
        "2²",
        "3²",
        "5¹",
        "7¹"
       ]
      ]
     }
    ]
   },
   {
    "capitulo": 4,
    "development": [
     "Equações com frações ficam mais simples quando se elimina o denominador. Em x/3 + x/4 = 14, multiplicar os dois lados pelo MMC dos denominadores (12) dá 4x+3x=168, ou seja, 7x=168. Essa operação é válida porque se multiplica a igualdade inteira pelo mesmo número. Outra forma é somar as frações: x/3+x/4=7x/12, e então 7x/12=14. Ambos os caminhos levam ao mesmo valor, e conferir a resposta na equação original é o jeito mais seguro de detectar erros.",
     "Em enunciados de comparação entre grupos, escolha a incógnita para a quantidade que serve de referência. Se os homens são 3 a mais que o dobro das mulheres, chame de m o número de mulheres; os homens são 2m+3. Escolher h como referência obrigaria a escrever m=(h−3)/2, expressão mais incômoda. Em geral, uma equação de primeiro grau com uma incógnita tem uma única solução; se o resultado obtido for fracionário numa contagem de pessoas, revise a tradução do texto antes de aceitar."
    ],
    "workedExamples": [
     {
      "prompt": "Dois terços de um número mais um quarto do mesmo número somam 55. Qual é o número?",
      "steps": [
       "Traduza: (2/3)x + (1/4)x = 55.",
       "Denominador comum 12: 8x/12 + 3x/12 = 11x/12.",
       "Então 11x/12 = 55, logo x = 55×12/11 = 5×12 = 60.",
       "Conferência: 2/3 de 60 é 40 e 1/4 de 60 é 15; 40+15=55."
      ],
      "answer": "60."
     },
     {
      "prompt": "Em uma seção do tribunal, o número de servidores homens é 3 a mais que o dobro do número de mulheres. Se há 36 servidores no total, quantos são homens e quantas são mulheres?",
      "steps": [
       "Seja m o número de mulheres. Os homens são 2m+3.",
       "O total é m + (2m+3) = 36, ou seja, 3m+3=36.",
       "Subtraia 3: 3m=33, e então m=11. Os homens são 2×11+3=25.",
       "Conferência: 11+25=36, e 25 é 3 a mais que o dobro de 11."
      ],
      "answer": "25 homens e 11 mulheres."
     }
    ],
    "tables": [
     {
      "caption": "Conversões de área, volume e capacidade",
      "headers": [
       "Relação",
       "Valor",
       "Observação"
      ],
      "rows": [
       [
        "1 m²",
        "10.000 cm²",
        "o fator 100 é elevado ao quadrado"
       ],
       [
        "1 km²",
        "1.000.000 m²",
        "1.000 elevado ao quadrado"
       ],
       [
        "1 ha",
        "10.000 m²",
        "hectare"
       ],
       [
        "1 m³",
        "1.000 litros",
        "volume e capacidade"
       ],
       [
        "1 litro",
        "1.000 mL",
        "1 mL equivale a 1 cm³"
       ]
      ]
     }
    ]
   },
   {
    "capitulo": 5,
    "development": [
     "Em problemas de partes e restos há duas perguntas que parecem semelhantes e levam a respostas diferentes: quanto foi retirado e quanto sobrou. Se retiramos 1/4 do total, o que sobra é 3/4. Quando se retira uma fração do que sobrou, a fração restante também age sobre o que sobrou: retirar 2/5 do restante deixa 3/5 desse restante. Para chegar à parte do total, multiplique as frações restantes: 3/4 × 3/5 = 9/20. A diferença entre usar a fração do total e a do restante é o principal ponto de variação dos enunciados.",
     "Quando o enunciado fornece uma quantidade absoluta no meio do caminho (por exemplo, 40 processos analisados na quarta-feira), organize uma equação com a fração do total. Escreva o que resta em função do total T, subtraia a quantidade absoluta e compare com a fração final dada. Se o total fosse conhecido, um quadro de antes, retirada e restante bastaria. Como é desconhecido, a equação com T traduz o mesmo quadro de forma algébrica, e a conferência final com números recupera o quadro."
    ],
    "workedExamples": [
     {
      "prompt": "Um servidor gastou 1/4 do salário com aluguel e 2/5 do que sobrou com alimentação. Restaram R$ 1.350,00. Qual é o salário?",
      "steps": [
       "Após o aluguel restam 3/4 do salário. A alimentação é 2/5 desse restante: (2/5)×(3/4)=6/20=3/10 do salário.",
       "Sobra 3/4 − 3/10 = 15/20 − 6/20 = 9/20 do salário.",
       "Se 9/20 do salário valem R$ 1.350,00, então 1/20 vale R$ 150,00 e o salário é 20×150 = R$ 3.000,00.",
       "Conferência: aluguel de R$ 750,00, restam R$ 2.250,00; alimentação de R$ 900,00, restam R$ 1.350,00."
      ],
      "answer": "R$ 3.000,00."
     },
     {
      "prompt": "Em um lote, na segunda-feira analisou-se 1/5 dos processos. Na terça-feira, 3/8 do que restava após a segunda. Na quarta-feira, mais 40 processos foram analisados e sobrou 1/4 do total. Quantos processos tinha o lote?",
      "steps": [
       "Seja T o total. Após a segunda restam 4/5 de T. Na terça, analisa-se (3/8)×(4/5)=12/40=3/10 de T.",
       "Depois da terça restam 4/5 − 3/10 = 8/10 − 3/10 = 1/2 de T.",
       "Na quarta analisam-se 40 e sobra 1/4 de T: (1/2)T − 40 = (1/4)T, então (1/4)T = 40 e T = 160.",
       "Conferência: segunda, 32 (restam 128); terça, 3/8 de 128 = 48 (restam 80); quarta, 40 (restam 40), que é 1/4 de 160."
      ],
      "answer": "160 processos."
     }
    ],
    "tables": [
     {
      "caption": "Fração restante e fração retirada",
      "headers": [
       "Retirou",
       "Restou",
       "Retirou do restante",
       "Fica do total"
      ],
      "rows": [
       [
        "1/4",
        "3/4",
        "2/5",
        "3/4 × 3/5 = 9/20"
       ],
       [
        "1/5",
        "4/5",
        "3/8",
        "4/5 × 5/8 = 1/2"
       ],
       [
        "2/5",
        "3/5",
        "1/3",
        "3/5 × 2/3 = 2/5"
       ]
      ]
     }
    ]
   }
  ],
  "novosCapitulos": [
   {
    "title": "Divisibilidade, números primos e fatoração",
    "paragraphs": [
     "Um número natural a é divisível por b quando a divisão é exata, isto é, sem resto. Os critérios de divisibilidade permitem saber isso sem fazer a conta completa. Por 2: termina em algarismo par. Por 3: a soma dos algarismos é múltipla de 3. Por 4: os dois últimos algarismos formam número divisível por 4. Por 5: termina em 0 ou 5. Por 6: é divisível por 2 e por 3 ao mesmo tempo. Por 8: os três últimos algarismos formam número divisível por 8. Por 9: a soma dos algarismos é múltipla de 9. Por 10: termina em 0. Por 11: a diferença entre a soma dos algarismos de posição ímpar e a soma dos de posição par é múltipla de 11 (inclusive zero).",
     "Número primo é o natural maior que 1 que tem exatamente dois divisores: 1 e ele mesmo. Os primeiros são 2, 3, 5, 7, 11, 13, 17, 19, 23. O número 2 é o único primo par. O número 1 não é primo, pois tem um só divisor. Um número maior que 1 que não é primo é composto. Para testar se n é primo, basta tentar dividi-lo pelos primos cujo quadrado não ultrapasse n: se nenhum divide, n é primo. Por exemplo, para 97, testam-se 2, 3, 5 e 7, porque 11² já é 121, maior que 97.",
     "O Teorema Fundamental da Aritmética afirma que todo natural maior que 1 se escreve, de um único modo (a menos da ordem), como produto de primos. É a fatoração. Ela revela tudo sobre a divisibilidade: um número só é divisível por outro se contiver todos os fatores primos deste, com expoentes iguais ou maiores. Com a fatoração, calculam-se MDC, MMC, o número de divisores e se descobre se um número é quadrado perfeito. Para fatorar, divida sucessivamente pelos menores primos possíveis até chegar ao quociente 1."
    ],
    "example": "Exemplo resolvido: 360 = 2³ × 3² × 5. O número de divisores é (3+1)×(2+1)×(1+1) = 4×3×2 = 24.",
    "development": [
     "A contagem de divisores segue da fatoração. Se N=2^a × 3^b × 5^c, cada divisor de N é formado escolhendo o expoente de 2 entre 0 e a, o de 3 entre 0 e b, e o de 5 entre 0 e c. Como as escolhas são independentes, o total é (a+1)(b+1)(c+1). Isso inclui o divisor 1 (todos os expoentes zero) e o próprio N (todos máximos). Um número que é quadrado perfeito tem todos os expoentes pares, o que implica quantidade ímpar de divisores; por exemplo, 36=2²×3² tem 3×3=9 divisores.",
     "Nos enunciados com algarismo desconhecido, como 7.3X6 divisível por 12, combine critérios. Um número é divisível por 12 quando é divisível por 3 e por 4, que são fatores sem divisor comum. Combinar critérios de números que têm fator em comum, como 2 e 4, não funciona para dizer que o número é divisível por 8: seria preciso o critério do 8. Resolva cada critério em separado, liste os valores possíveis e escolha a interseção. Por fim, confirme com a divisão real, pois é uma conta curta e evita enganos."
    ],
    "method": [
     "Identifique o que o enunciado pede: critério de divisibilidade, teste de primo, fatoração, quantidade de divisores ou quadrado perfeito.",
     "Aplique os critérios nos números pequenos (2, 3, 5, 11) e fatore dividindo sempre pelo menor primo possível, registrando os expoentes.",
     "Escreva a fatoração em forma de potências e use-a: some 1 a cada expoente e multiplique para contar divisores, ou verifique se todos os expoentes são pares para um quadrado perfeito.",
     "Confira com uma divisão ou multiplicação direta do resultado final."
    ],
    "workedExamples": [
     {
      "prompt": "Fatore 1.260 e determine quantos divisores naturais ele possui.",
      "steps": [
       "Divida por 2: 1.260÷2=630; 630÷2=315. O 315 é ímpar.",
       "Divida por 3: 315÷3=105; 105÷3=35. A soma dos algarismos de 35 é 8, que não é múltipla de 3.",
       "Divida por 5: 35÷5=7. O 7 é primo. Logo 1.260 = 2² × 3² × 5 × 7.",
       "Número de divisores: (2+1)×(2+1)×(1+1)×(1+1) = 3×3×2×2 = 36."
      ],
      "answer": "1.260 = 2² × 3² × 5 × 7, com 36 divisores."
     },
     {
      "prompt": "O número de protocolo 7.3X6, em que X é um algarismo, é divisível por 12. Qual é o valor de X?",
      "steps": [
       "Ser divisível por 12 equivale a ser divisível por 3 e por 4.",
       "Por 4: os dois últimos algarismos, X6, devem formar número divisível por 4. Servem 16, 36, 56, 76 e 96, ou seja, X pode ser 1, 3, 5, 7 ou 9.",
       "Por 3: a soma 7+3+X+6 = 16+X deve ser múltipla de 3. Isso ocorre com X = 2, 5 ou 8 (somas 18, 21, 24).",
       "A interseção entre {1, 3, 5, 7, 9} e {2, 5, 8} é X=5. Conferência: 7.356 ÷ 12 = 613."
      ],
      "answer": "X = 5, e o número é 7.356."
     },
     {
      "prompt": "Qual é o menor número natural pelo qual se deve multiplicar 588 para obter um quadrado perfeito? Qual é esse quadrado?",
      "steps": [
       "Fatore: 588 = 2² × 3 × 7². Os expoentes de 2 e de 7 já são pares; o do 3 é ímpar.",
       "Para tornar todos os expoentes pares, falta um fator 3. O menor multiplicador é 3.",
       "O novo número é 588×3 = 1.764 = 2² × 3² × 7², que é (2×3×7)² = 42².",
       "Conferência: 42×42 = 1.764."
      ],
      "answer": "Multiplicador 3; o quadrado é 1.764 (=42²)."
     }
    ],
    "pitfall": "Considerar primo um número que apenas parece primo, como 91, que é 7×13, ou tratar o 1 como primo. Teste sempre os primos até a raiz do número e lembre que o 1 não é primo nem composto.",
    "tables": [
     {
      "caption": "Critérios de divisibilidade em resumo",
      "headers": [
       "Divisor",
       "Critério",
       "Exemplo"
      ],
      "rows": [
       [
        "2",
        "termina em algarismo par",
        "4.718"
       ],
       [
        "3",
        "soma dos algarismos múltipla de 3",
        "2.115 (2+1+1+5=9)"
       ],
       [
        "4",
        "dois últimos algarismos divisíveis por 4",
        "5.316 (16)"
       ],
       [
        "9",
        "soma dos algarismos múltipla de 9",
        "7.263 (7+2+6+3=18)"
       ],
       [
        "11",
        "soma das posições ímpares menos a das pares múltipla de 11",
        "2.717 (7+7=14; 1+2=3; 14−3=11)"
       ]
      ]
     }
    ],
    "resumo": {
     "title": "Divisibilidade e primos",
     "text": "Critérios de divisibilidade e a fatoração em primos dizem quem divide quem; o número de divisores é o produto de (expoente + 1).",
     "bizu": "1 não é primo; para testar n, divida só pelos primos até a raiz de n."
    }
   },
   {
    "title": "Potências, raízes e notação científica",
    "paragraphs": [
     "A potência a^n, com n inteiro positivo, é o produto de n fatores iguais a a. As propriedades decorrem dessa definição: a^m × a^n = a^(m+n), porque se juntam m e n fatores; a^m ÷ a^n = a^(m−n), porque se cancelam n fatores; (a^m)^n = a^(m×n); e (a×b)^n = a^n × b^n. Como a^m ÷ a^m = 1 e também é a^0, define-se a^0=1 para a≠0. Da mesma forma, a^(−n) = 1/a^n: por exemplo, 2^(−3) = 1/8 e 5^(−2) = 1/25. Expoente negativo não torna o número negativo, apenas o inverte.",
     "A raiz quadrada de um número não negativo é o número não negativo que, elevado ao quadrado, dá o radicando. Assim, a raiz de 49 é 7. A raiz cúbica de 27 é 3, porque 3^3=27. Para simplificar uma raiz, fatore o radicando e retire os pares de fatores: a raiz de 72, com 72=2^3×3^2, é 2×3×raiz de 2, isto é, 6 raiz de 2. Raízes semelhantes (com o mesmo radicando) somam-se como termos semelhantes: 6 raiz de 2 + 5 raiz de 2 = 11 raiz de 2. A raiz de uma soma, porém, não é a soma das raízes.",
     "A notação científica escreve um número como m × 10^k, com m entre 1 e 10 (o 10 não incluído). É útil para números muito grandes ou muito pequenos: 72.000 = 7,2 × 10^4 e 0,00045 = 4,5 × 10^(−4). Para multiplicar, multiplicam-se as partes m e somam-se os expoentes de 10; para dividir, dividem-se as partes m e subtraem-se os expoentes. Se o produto das partes ultrapassar 10, reajuste: 30 × 10^5 = 3 × 10^6. Mover a vírgula uma casa para a esquerda aumenta o expoente em 1; para a direita, diminui em 1."
    ],
    "example": "Exemplo resolvido: 2^5 × 2^(−2) ÷ 2^1 = 2^(5−2−1) = 2^2 = 4.",
    "development": [
     "O expoente fracionário liga potências e raízes: a^(1/2) é a raiz quadrada de a, e a^(1/3) é a raiz cúbica. Em geral, a^(2/3) é a raiz cúbica de a elevada ao quadrado. Assim, 27^(1/3)=3 e 8^(2/3)=(raiz cúbica de 8)^2=2^2=4. Para operar com bases diferentes, procure escrevê-las como potências da mesma base: 4=2^2 e 8=2^3. Com isso, 4^3 = 2^6 e 8^2 = 2^6, e a comparação entre eles torna-se imediata.",
     "Cuidado com a precedência e a associação. Em (2^3)^2 os expoentes se multiplicam: 2^6=64. Já 2 elevado a (3^2) é 2^9=512. A escrita sem parênteses de uma torre de expoentes é ambígua e por isso deve ser evitada; aqui, os parênteses sempre mostram a leitura adotada. Outra fonte de erros é a distribuição: (a+b)^2 não é a^2+b^2, e sim a^2+2ab+b^2. Por exemplo, (3+4)^2=49, e não 9+16=25. A potência distribui-se sobre produtos e quocientes, nunca sobre somas e subtrações."
    ],
    "method": [
     "Reescreva todas as bases como potências de primos (4=2^2, 8=2^3, 9=3^2, 100=10^2).",
     "Aplique as propriedades: some expoentes na multiplicação, subtraia na divisão, multiplique em potência de potência.",
     "Em raízes, fatore o radicando, retire os pares de fatores e some apenas raízes com o mesmo radicando.",
     "Em notação científica, opere as partes m e os expoentes de 10 separadamente e reajuste o resultado para que m fique entre 1 e 10.",
     "Confira o resultado com um valor aproximado ou com um caso numérico simples."
    ],
    "workedExamples": [
     {
      "prompt": "Simplifique (2^5 × 4^3) ÷ 8^2.",
      "steps": [
       "Escreva tudo na base 2: 4=2^2, logo 4^3=2^6; 8=2^3, logo 8^2=2^6.",
       "O numerador fica 2^5 × 2^6 = 2^11.",
       "A divisão fica 2^11 ÷ 2^6 = 2^5 = 32.",
       "Conferência numérica: 32 × 64 ÷ 64 = 32."
      ],
      "answer": "32."
     },
     {
      "prompt": "Calcule a raiz de 72 + a raiz de 50 − a raiz de 18 e dê o resultado na forma simplificada.",
      "steps": [
       "Fatore: 72 = 2^3×3^2, então a raiz de 72 = 2×3×raiz de 2 = 6 raiz de 2.",
       "50 = 2×5^2, então a raiz de 50 = 5 raiz de 2. Já 18 = 2×3^2, então a raiz de 18 = 3 raiz de 2.",
       "Com o mesmo radicando: 6 raiz de 2 + 5 raiz de 2 − 3 raiz de 2 = 8 raiz de 2.",
       "Conferência: 8,485 + 7,071 − 4,243 = 11,313, e 8 × 1,414 = 11,31."
      ],
      "answer": "8 raiz de 2 (aproximadamente 11,31)."
     },
     {
      "prompt": "Cada consulta a um sistema consome 6×10^(−3) segundo de processamento. Em um dia ocorrem 5×10^8 consultas, distribuídas igualmente entre 2×10^2 servidores. Quanto tempo de processamento cabe a cada servidor?",
      "steps": [
       "Tempo total: (6×10^(−3)) × (5×10^8) = 30 × 10^5 = 3×10^6 segundos.",
       "Divisão entre os servidores: (3×10^6) ÷ (2×10^2) = 1,5×10^4 = 15.000 segundos.",
       "Converta em horas: 15.000 ÷ 3.600 = 4 horas e restam 15.000 − 14.400 = 600 segundos, isto é, 10 minutos.",
       "Cada servidor trabalha 4 horas e 10 minutos."
      ],
      "answer": "15.000 segundos, ou 4 h 10 min por servidor."
     }
    ],
    "pitfall": "Distribuir a potência ou a raiz sobre uma soma, escrevendo (a+b)^2 = a^2+b^2 ou a raiz de (9+16) igual a 3+4. Teste com números pequenos: a raiz de 25 é 5, e não 7.",
    "tables": [
     {
      "caption": "Propriedades das potências (a ≠ 0)",
      "headers": [
       "Propriedade",
       "Forma",
       "Exemplo"
      ],
      "rows": [
       [
        "Produto de mesma base",
        "a^m × a^n = a^(m+n)",
        "3^2 × 3^4 = 3^6 = 729"
       ],
       [
        "Quociente de mesma base",
        "a^m ÷ a^n = a^(m−n)",
        "5^6 ÷ 5^4 = 5^2 = 25"
       ],
       [
        "Potência de potência",
        "(a^m)^n = a^(m×n)",
        "(2^3)^2 = 2^6 = 64"
       ],
       [
        "Expoente zero",
        "a^0 = 1",
        "7^0 = 1"
       ],
       [
        "Expoente negativo",
        "a^(−n) = 1/a^n",
        "2^(−3) = 1/8"
       ]
      ]
     }
    ],
    "resumo": {
     "title": "Potências e raízes",
     "text": "Na mesma base, somam-se expoentes ao multiplicar e subtraem-se ao dividir; raízes se simplificam retirando pares de fatores; notação científica separa o número de seu 10^k.",
     "bizu": "Nunca distribua potência ou raiz sobre soma: (a+b)^2 não é a^2+b^2."
    }
   },
   {
    "title": "Problemas com frações e números decimais",
    "paragraphs": [
     "Nos problemas de texto, a palavra \"de\" entre uma fração e uma quantidade indica multiplicação: 3/8 de 240 é 3/8 × 240 = 90. Para evitar confusão, comece sempre perguntando qual é o todo, isto é, a quantidade que vale 100% ou 1 inteiro. Em seguida, identifique se o enunciado pede a parte (quanto foi), o complemento (quanto falta) ou o todo (quanto era no início). Se 3/8 dos processos foram arquivados, o que falta arquivar é 1−3/8=5/8; no exemplo de 240 processos, 150.",
     "Fração de fração significa multiplicar as frações. Se 2/5 dos inscritos são mulheres, e 1/3 dos homens têm mais de 40 anos, os homens são 3/5 do total, e os homens com mais de 40 anos são 1/3 × 3/5 = 1/5 do total. Note que a fração 1/3 incide sobre os homens, e não sobre o total. Aumentos e reduções fracionárias seguem a mesma lógica: aumentar 1/4 equivale a multiplicar por 5/4 (1+1/4), e reduzir 1/4 equivale a multiplicar por 3/4.",
     "Os decimais surgem principalmente em dinheiro e medidas. Para multiplicar e dividir, trabalhe como com inteiros e acerte as casas decimais no fim, ou converta para fração quando for mais cômodo. Uma fração de 1/10 é 0,1 ou 10%, 1/4 é 0,25 e 3/4 é 0,75. Tarefas que se repetem, como encher um tanque, são tratadas pela fração do trabalho por unidade de tempo: quem faz o serviço em 6 horas faz 1/6 dele por hora, e as taxas de agentes que trabalham juntos se somam."
    ],
    "example": "Exemplo resolvido: de 240 processos, 3/8 foram arquivados. Arquivados: 3/8 × 240 = 90. Falta arquivar 240 − 90 = 150, que é 5/8 de 240.",
    "development": [
     "Quando se conhece a parte e a fração que ela representa, o caminho é inverso: divida a parte pelo numerador e multiplique pelo denominador. Se 18 homens correspondem a 1/5 do total, o total é 18 × 5 = 90. Se 9/20 de algo valem 1.350, então 1/20 vale 1.350÷9=150 e o todo vale 150×20=3.000. Esse método de achar a unidade fracionária evita equações e funciona bem quando o tempo é curto.",
     "Em problemas de trabalho conjunto, as taxas se somam, mas os tempos não. Duas torneiras que enchem um tanque em 6 e em 4 horas não o enchem em 5 horas (média dos tempos): juntas fazem 1/6+1/4=5/12 do tanque por hora, e o tempo é o inverso, 12/5 de hora. Um ralo ou uma vazão contrária entra com sinal negativo. Ao final, converta a parte decimal da hora em minutos multiplicando por 60: 0,4 hora são 24 minutos."
    ],
    "method": [
     "Defina o todo e a unidade (pessoas, reais, processos, tanque inteiro) e escreva o que o enunciado pede: parte, complemento ou todo.",
     "Traduza cada \"de\" como multiplicação e atualize a base quando a fração incidir sobre um subconjunto do todo.",
     "Se a parte é conhecida e se quer o todo, ache o valor de uma unidade fracionária (parte ÷ numerador) e multiplique pelo denominador.",
     "Em decimais, calcule com cuidado nas casas e confira com uma estimativa arredondada."
    ],
    "workedExamples": [
     {
      "prompt": "Em um curso de capacitação, 2/5 dos inscritos são mulheres e, dos homens, 1/3 têm mais de 40 anos. Se 18 homens têm mais de 40 anos, quantos inscritos há ao todo e quantos são mulheres?",
      "steps": [
       "Os homens são 1−2/5 = 3/5 do total. Os homens com mais de 40 anos são 1/3 × 3/5 = 1/5 do total.",
       "Se 1/5 do total é 18, então o total é 18×5 = 90 inscritos.",
       "Mulheres: 2/5 × 90 = 36. Homens: 3/5 × 90 = 54.",
       "Conferência: 1/3 de 54 é 18, e 36+54=90."
      ],
      "answer": "90 inscritos, dos quais 36 mulheres."
     },
     {
      "prompt": "Um tribunal comprou 18 caixas de papel a R$ 32,75 cada. Como a compra foi grande, recebeu desconto de 1/10 sobre o valor total. Quanto foi pago?",
      "steps": [
       "Valor sem desconto: 18 × 32,75 = 589,50 (18×32 = 576 e 18×0,75 = 13,50).",
       "O desconto é 1/10 de 589,50 = 58,95.",
       "Valor pago: 589,50 − 58,95 = 530,55. Equivalentemente, 9/10 de 589,50 = 530,55."
      ],
      "answer": "R$ 530,55."
     },
     {
      "prompt": "Uma torneira A enche um tanque em 6 horas e uma torneira B o enche em 4 horas. (a) Funcionando juntas, em quanto tempo enchem o tanque vazio? (b) Se houver também um ralo aberto que esvazia o tanque cheio em 12 horas, quanto tempo levam as duas torneiras e o ralo juntos?",
      "steps": [
       "Taxas por hora: A faz 1/6 do tanque, B faz 1/4 e o ralo retira 1/12.",
       "(a) A+B: 1/6+1/4 = 2/12+3/12 = 5/12 do tanque por hora. O tempo é 12/5 = 2,4 horas, isto é, 2 horas e 0,4×60 = 24 minutos.",
       "(b) Com o ralo: 5/12 − 1/12 = 4/12 = 1/3 do tanque por hora.",
       "O tempo é o inverso da taxa: 3 horas."
      ],
      "answer": "(a) 2 h 24 min; (b) 3 horas."
     }
    ],
    "pitfall": "Aplicar a fração ao total quando ela incide sobre o restante, ou responder o que foi retirado quando a pergunta é o que falta. Releia a pergunta final e escreva ao lado dela se o que se pede é a parte, o complemento ou o todo.",
    "tables": [
     {
      "caption": "Tradução de expressões comuns",
      "headers": [
       "No texto",
       "Operação",
       "Exemplo com 80"
      ],
      "rows": [
       [
        "3/8 de 80",
        "multiplicar",
        "3/8 × 80 = 30"
       ],
       [
        "o que falta, se foram 3/8",
        "1 − 3/8 = 5/8",
        "5/8 × 80 = 50"
       ],
       [
        "aumento de 1/4",
        "multiplicar por 5/4",
        "80 × 5/4 = 100"
       ],
       [
        "redução de 1/4",
        "multiplicar por 3/4",
        "80 × 3/4 = 60"
       ],
       [
        "1/3 de 3/4 de 80",
        "1/3 × 3/4 × 80",
        "20"
       ]
      ]
     }
    ],
    "resumo": {
     "title": "Frações em problemas",
     "text": "Defina o todo, traduza \"de\" por multiplicação, atualize a base a cada etapa e, para achar o todo, descubra o valor de uma unidade fracionária.",
     "bizu": "Taxas de trabalho se somam; tempos não."
    }
   },
   {
    "title": "Problemas de MMC, MDC e unidades de medida",
    "paragraphs": [
     "Como saber qual dos dois, MMC ou MDC, usar? O MMC responde a perguntas sobre quando, quanto tempo depois e de quanto em quanto tempo eventos se repetem: aparece em ciclos, plantões, rodízios e vistorias. O MDC responde a perguntas sobre dividir em partes iguais, o maior tamanho possível ou quantos grupos no máximo: aparece em distribuição de itens, corte de peças, ladrilhos e lotes. Uma pergunta útil é: o resultado precisa ser maior ou igual aos dados (MMC) ou menor ou igual a eles (MDC)?",
     "Em problemas de ciclos, o MMC dá o intervalo entre coincidências, e a primeira coincidência após o início ocorre nesse intervalo. Para saber o dia da semana, divida o número de dias por 7 e use o resto: com resto 1 a partir de segunda-feira, o dia será terça. Em problemas de divisão com unidades diferentes, converta tudo para a menor unidade, para que os números sejam inteiros, antes de aplicar o MDC. Por exemplo, 4,20 m e 3,00 m viram 420 cm e 300 cm, e o MDC é 60 cm.",
     "As unidades mais cobradas são as de tempo (1 h = 60 min, 1 min = 60 s, sistema sexagesimal, e não decimal), comprimento (1 km = 1.000 m; 1 m = 100 cm), massa (1 t = 1.000 kg; 1 kg = 1.000 g) e capacidade (1 m³ = 1.000 L; 1 L = 1.000 mL). Em horários, passar de 8 h 70 min para 9 h 10 min é um ajuste típico: lembre que 60 minutos formam 1 hora. A duração entre 22 h 50 min e 6 h 35 min do dia seguinte é 1 h 10 min até a meia-noite mais 6 h 35 min, isto é, 7 h 45 min."
    ],
    "example": "Exemplo resolvido: dois sinais sonoros tocam a cada 12 e a cada 18 minutos e tocaram juntos às 8 h. MMC(12,18) = 36, então voltam a tocar juntos às 8 h 36 min.",
    "development": [
     "Há variações de enunciado que podem enganar. Se os eventos não começam juntos, o MMC sozinho não basta: é preciso procurar o primeiro instante comum, às vezes com uma tabela de ocorrências. Se a pergunta for quantas vezes os eventos coincidem num período, divida o período pelo MMC e tome a parte inteira. Se perguntarem o número de peças, divida a área total pela área de cada peça, o que dá o mesmo resultado que multiplicar as quantidades de peças por fila nos dois sentidos.",
     "Nos problemas com unidades, escolha uma unidade única no início e só converta o resultado para a unidade pedida no final. Se a conversão envolver mais de uma grandeza, como massa de papel por pacote e pacotes por caixa, avance em etapas, escrevendo cada resultado com a unidade. Esse procedimento permite verificar o sentido da conta: pacotes por caixa dá pacotes, e não quilos. E para cada resposta pergunte se faz sentido na prática: cinco servidores e meio, ou 3,5 caixas fechadas, mostram que o enunciado pedia um número inteiro."
    ],
    "method": [
     "Decida se a situação pede MMC (repetição de ciclos, coincidência) ou MDC (partilha em partes iguais, maior tamanho).",
     "Converta todas as grandezas para uma mesma unidade, de preferência a menor, para trabalhar com inteiros.",
     "Fatore os números e calcule o MDC (menores expoentes) ou o MMC (maiores expoentes).",
     "Traduza o resultado para o objeto pedido (quantidade de peças, de grupos, de dias, horário ou dia da semana) e converta para a unidade final.",
     "Confira se a divisão é exata e se o resultado faz sentido no contexto."
    ],
    "workedExamples": [
     {
      "prompt": "O piso de uma sala retangular de 4,20 m por 3,00 m será coberto com placas quadradas iguais, inteiras, do maior tamanho possível. Qual é o lado de cada placa e quantas placas serão usadas?",
      "steps": [
       "Converta para centímetros: 420 cm e 300 cm.",
       "Fatore: 420 = 2²×3×5×7 e 300 = 2²×3×5². O MDC é 2²×3×5 = 60 cm.",
       "Em cada fileira cabem 420÷60 = 7 placas, e há 300÷60 = 5 fileiras: 7×5 = 35 placas.",
       "Conferência pela área: 420×300 = 126.000 cm² e 60×60×35 = 126.000 cm²."
      ],
      "answer": "Lado de 60 cm, com 35 placas."
     },
     {
      "prompt": "Três equipes fazem vistoria a cada 6, 8 e 10 dias. Elas se encontraram em uma segunda-feira. (a) Daqui a quantos dias voltam a se encontrar? (b) Em que dia da semana isso ocorre? (c) Considerando 365 dias a partir daquela segunda-feira, quantos novos encontros ocorrem?",
      "steps": [
       "(a) Fatore: 6 = 2×3, 8 = 2³, 10 = 2×5. O MMC é 2³×3×5 = 120 dias.",
       "(b) 120 ÷ 7 = 17, com resto 1 (7×17 = 119). Uma semana completa não muda o dia; sobra 1 dia: segunda-feira mais 1 dia é terça-feira.",
       "(c) 365 ÷ 120 = 3, com resto 5. Os encontros ocorrem nos dias 120, 240 e 360, e o dia 480 já passou de 365: são 3 encontros.",
       "Conferência: 120, 240 e 360 são múltiplos de 6, de 8 e de 10."
      ],
      "answer": "(a) 120 dias; (b) terça-feira; (c) 3 novos encontros."
     },
     {
      "prompt": "Um depósito tem 0,36 m³ de um produto A e 480 litros de um produto B. Eles serão engarrafados, sem se misturar, em garrafões de mesma capacidade inteira, em litros, a maior possível, sem sobras. Qual é a capacidade e quantos garrafões serão usados?",
      "steps": [
       "Uniformize a unidade: 0,36 m³ = 360 litros (1 m³ = 1.000 L). Os volumes são 360 L e 480 L.",
       "Fatore: 360 = 2³×3²×5 e 480 = 2⁵×3×5. O MDC é 2³×3×5 = 120 litros.",
       "Garrafões de A: 360÷120 = 3. Garrafões de B: 480÷120 = 4. Total: 7 garrafões.",
       "Conferência: 7×120 = 840 litros, que é 360+480."
      ],
      "answer": "Garrafões de 120 litros; 7 garrafões (3 de A e 4 de B)."
     }
    ],
    "pitfall": "Misturar unidades (metros com centímetros, m³ com litros) e usar MMC quando se quer MDC, ou o contrário. Antes de calcular, converta tudo para a mesma unidade e pergunte-se se a resposta deve ser maior (MMC) ou menor (MDC) que os números dados.",
    "tables": [
     {
      "caption": "Quando usar MMC e quando usar MDC",
      "headers": [
       "Situação",
       "Ferramenta",
       "O resultado indica"
      ],
      "rows": [
       [
        "Eventos periódicos voltam a coincidir",
        "MMC",
        "intervalo entre coincidências"
       ],
       [
        "Dividir itens em grupos iguais, sem sobras",
        "MDC",
        "maior número de grupos"
       ],
       [
        "Ladrilho quadrado do maior lado possível",
        "MDC",
        "lado da peça"
       ],
       [
        "Menor quantidade que pode ser repartida em tamanhos diferentes",
        "MMC",
        "menor quantidade comum"
       ]
      ]
     },
     {
      "caption": "Unidades de medida frequentes",
      "headers": [
       "Grandeza",
       "Relação",
       "Exemplo"
      ],
      "rows": [
       [
        "Tempo",
        "1 h = 60 min; 1 min = 60 s",
        "2,5 h = 2 h 30 min"
       ],
       [
        "Comprimento",
        "1 km = 1.000 m; 1 m = 100 cm",
        "4,20 m = 420 cm"
       ],
       [
        "Massa",
        "1 t = 1.000 kg; 1 kg = 1.000 g",
        "2,4 t = 2.400 kg"
       ],
       [
        "Capacidade",
        "1 m³ = 1.000 L; 1 L = 1.000 mL",
        "1,8 m³ = 1.800 L"
       ]
      ]
     }
    ],
    "resumo": {
     "title": "MMC, MDC e unidades",
     "text": "MMC resolve ciclos e coincidências; MDC resolve partilhas iguais e peças do maior tamanho; antes de tudo, padronize as unidades.",
     "bizu": "O tempo é sexagesimal: 60 minutos formam 1 hora, e não 100."
    }
   }
  ]
 },
 "M11": {
  "extras": [
   {
    "capitulo": 1,
    "development": [
     "Uma razão pode aparecer no enunciado de quatro jeitos, e cada um pede uma leitura própria. O primeiro é \"A está para B como 3 está para 5\", que compara duas partes entre si. O segundo é \"A representa 3/8 do total\", que compara uma parte com o todo. O terceiro mistura unidades, como 120 km em 2 horas, e gera uma taxa de 60 km por hora. O quarto traz uma diferença, como \"A tem 12 a mais que B\". Saber só a razão nunca basta para encontrar as quantidades: 3:5 serve para 3 e 5, para 30 e 50 ou para 300 e 500. Por isso, ao ler, procure sempre duas informações: a razão e uma segunda pista (o total, a diferença ou uma das quantidades) que fixa o tamanho de cada parte.",
     "Quando duas razões compartilham uma grandeza, é possível juntá-las numa só. Se A:B=3:4 e B:C=6:5, o termo B vale 4 na primeira e 6 na segunda, então é preciso igualá-lo. Usa-se o mínimo múltiplo comum de 4 e 6, que é 12: multiplica-se a primeira razão por 3 (A:B=9:12) e a segunda por 2 (B:C=12:10), resultando em A:B:C=9:12:10. Multiplicar os dois termos de uma razão pelo mesmo número não a altera, do mesmo modo que 1/2 e 3/6 são iguais. Esse ajuste é o que permite comparar A e C mesmo sem nenhum enunciado que os coloque lado a lado."
    ],
    "workedExamples": [
     {
      "prompt": "Em um setor do tribunal, a razão entre processos digitais e processos físicos é 7:3. Sabe-se que há 48 processos digitais a mais do que físicos. Quantos processos o setor possui no total?",
      "steps": [
       "A razão 7:3 significa 7 partes iguais de digitais para 3 partes iguais de físicos.",
       "A diferença entre as partes é 7−3=4 partes, e essa diferença equivale a 48 processos.",
       "Cada parte vale 48/4=12 processos.",
       "Digitais: 7×12=84. Físicos: 3×12=36. Total: 84+36=120.",
       "Conferência: 84−36=48 e 84/36=7/3, como o enunciado pede."
      ],
      "answer": "120 processos (84 digitais e 36 físicos)."
     },
     {
      "prompt": "Em uma seção, a razão entre o número de escrivães (A) e o de técnicos (B) é 3:4, e a razão entre o número de técnicos (B) e o de auxiliares (C) é 6:5. Se a seção tem 155 pessoas no total, quantas são escrivães, técnicos e auxiliares?",
      "steps": [
       "O termo comum é B, que vale 4 na primeira razão e 6 na segunda. O MMC de 4 e 6 é 12.",
       "Primeira razão multiplicada por 3: A:B=9:12. Segunda multiplicada por 2: B:C=12:10.",
       "Logo A:B:C=9:12:10, com 9+12+10=31 partes.",
       "Cada parte vale 155/31=5 pessoas.",
       "Escrivães: 9×5=45. Técnicos: 12×5=60. Auxiliares: 10×5=50. Soma: 45+60+50=155.",
       "Conferência: 45/60=3/4 e 60/50=6/5, ambas conforme o enunciado."
      ],
      "answer": "45 escrivães, 60 técnicos e 50 auxiliares."
     }
    ],
    "tables": [
     {
      "caption": "Igualando o termo comum de duas razões",
      "headers": [
       "Razão dada",
       "Termo B",
       "Multiplicador",
       "Razão ajustada"
      ],
      "rows": [
       [
        "A:B = 3:4",
        "4",
        "3",
        "9:12"
       ],
       [
        "B:C = 6:5",
        "6",
        "2",
        "12:10"
       ],
       [
        "A:B:C",
        "12",
        "—",
        "9:12:10"
       ]
      ]
     }
    ]
   },
   {
    "capitulo": 2,
    "development": [
     "A multiplicação cruzada é uma consequência da igualdade a/b=c/d, e dela saem outras propriedades úteis. Somando 1 aos dois lados, obtém-se (a+b)/b=(c+d)/d; subtraindo, (a−b)/b=(c−d)/d. Essas formas ajudam quando o enunciado dá a soma ou a diferença de dois números e a razão entre eles. Por exemplo, se x/y=2/3 e x+y=50, então (x+y)/y=(2+3)/3, ou seja, 50/y=5/3, e y=30. Outra verificação importante: duas razões formam proporção quando o produto dos extremos é igual ao produto dos meios. Se 6/9 e 10/15 formam proporção, então 6×15=90 e 9×10=90, e a igualdade se confirma.",
     "Para classificar a relação entre duas grandezas a partir de uma tabela, calcule dois testes em todas as linhas: o quociente y/x e o produto x·y. Se o quociente for sempre o mesmo, a relação é direta; se o produto for sempre o mesmo, é inversa; se nenhum se mantiver, a relação não é proporcional, mesmo que as duas grandezas cresçam ou diminuam juntas. Basta uma linha que quebre o padrão para descartar a proporcionalidade. Quando há mais de uma grandeza envolvida, uma delas pode ser direta e outra inversa em relação ao resultado, como em y=k·x/z, em que k é uma constante fixa."
    ],
    "workedExamples": [
     {
      "prompt": "Uma tabela traz pares (x, y) de três situações. Situação P: (2, 30), (3, 45), (5, 75). Situação Q: (2, 60), (3, 40), (5, 24). Situação R: (2, 14), (4, 24), (6, 34). Classifique cada uma como diretamente proporcional, inversamente proporcional ou nenhuma das duas.",
      "steps": [
       "Situação P, quocientes y/x: 30/2=15, 45/3=15, 75/5=15. O quociente é constante, então é direta.",
       "Situação Q, produtos x·y: 2×60=120, 3×40=120, 5×24=120. O produto é constante, então é inversa. Os quocientes (30, 13,3 e 4,8) não são constantes.",
       "Situação R, quocientes: 14/2=7, 24/4=6, 34/6=5,67 (aproximadamente). Produtos: 28, 96, 204. Nenhum dos dois se mantém.",
       "Em R, y=5x+4: cresce junto com x, mas há parcela fixa de 4, o que impede a proporção direta."
      ],
      "answer": "P é direta, Q é inversa e R não é proporcional (crescem juntas, mas com parcela fixa)."
     },
     {
      "prompt": "Em um protocolo, o número de processos analisados por servidor, x+1, está para 6 assim como 4 está para x−1. Sabendo que x é um número natural maior que 1 (logo, x−1 é diferente de zero), determine x.",
      "steps": [
       "Escreva a proporção: (x+1)/6 = 4/(x−1).",
       "Multiplique em cruz: (x+1)·(x−1) = 6×4.",
       "O produto (x+1)(x−1) é igual a x^2−1, então x^2−1=24 e x^2=25.",
       "As soluções de x^2=25 são 5 e −5. Como x é natural, x=5.",
       "Conferência: (5+1)/6=1 e 4/(5−1)=1, razões iguais, com denominadores diferentes de zero."
      ],
      "answer": "x=5."
     }
    ],
    "tables": [
     {
      "caption": "Testes para classificar a relação entre grandezas",
      "headers": [
       "Teste",
       "O que se mantém",
       "Conclusão"
      ],
      "rows": [
       [
        "y/x constante",
        "Quociente",
        "Diretamente proporcional"
       ],
       [
        "x·y constante",
        "Produto",
        "Inversamente proporcional"
       ],
       [
        "Nenhum constante",
        "—",
        "Não proporcional"
       ]
      ]
     }
    ]
   },
   {
    "capitulo": 3,
    "development": [
     "Na regra de três direta, a taxa unitária é o caminho mais seguro, porque obriga você a dizer em voz alta o que está sendo dividido. Se 12 resmas duram 8 dias, a taxa é 12/8=1,5 resma por dia, e o enunciado já indica o que fazer: dividir o total desejado por 1,5 para achar o número de dias. Outra vantagem da taxa é que ela deixa claro quando a conta não faz sentido, como achar 2,3 servidores ou 4,5 processos. Nesses casos, o resultado exato do cálculo precisa ser interpretado: a pergunta pede arredondar para cima (quantos são necessários), para baixo (quantos cabem) ou deixar fracionado (quantidade medida em litros ou horas).",
     "Quando o enunciado mistura tempo de funcionamento e tempo parado, só o tempo de funcionamento entra na proporção. Uma máquina que gasta 2 segundos por página e para 3 minutos a cada 400 páginas não tem produção proporcional ao tempo total, mas é proporcional ao tempo ligada. Calcule primeiro o tempo de trabalho com a regra de três e depois some as pausas. Por fim, converta as unidades antes de montar a proporção: segundos com segundos, minutos com minutos. Resolver em segundos e converter ao final costuma ser mais seguro do que misturar horas e minutos no meio das contas."
    ],
    "workedExamples": [
     {
      "prompt": "Um tribunal consome 12 resmas de papel em 8 dias úteis. Mantido o mesmo consumo diário, em quantos dias úteis serão consumidas 45 resmas?",
      "steps": [
       "Consumo diário: 12/8=1,5 resma por dia.",
       "Dias para 45 resmas: 45/1,5=30.",
       "Pela proporção: 12/8=45/d, logo 12d=360 e d=30. Os dois caminhos coincidem.",
       "Coerência: 45 resmas é mais do que 12, então o tempo precisa ser maior do que 8 dias. Os 30 dias confirmam."
      ],
      "answer": "30 dias úteis."
     },
     {
      "prompt": "Uma impressora imprime 45 páginas em 1 minuto e 30 segundos. Para imprimir 1.200 páginas, ela faz uma pausa de 3 minutos a cada 400 páginas impressas, sem pausa depois da última. Quanto tempo leva ao todo, contando as pausas?",
      "steps": [
       "1 minuto e 30 segundos são 90 segundos. Taxa: 90/45=2 segundos por página.",
       "Tempo de impressão: 1.200×2=2.400 segundos, que são 2.400/60=40 minutos.",
       "As 1.200 páginas formam 3 blocos de 400. Há pausa depois do primeiro e do segundo bloco, e não depois do terceiro: 2 pausas.",
       "Tempo de pausas: 2×3=6 minutos.",
       "Tempo total: 40+6=46 minutos.",
       "Conferência por bloco: 400×2=800 segundos=13 min e 20 s; três blocos dão 40 minutos, e as pausas somam 6."
      ],
      "answer": "46 minutos."
     }
    ]
   },
   {
    "capitulo": 4,
    "development": [
     "Na regra de três inversa, o que fica fixo é o produto, e esse produto tem um significado concreto: é a quantidade total de serviço (em servidor-dias), a distância total (em quilômetros) ou o volume total. Quando a velocidade sobe, o tempo cai porque a distância é a mesma. Reconheça a situação inversa pela pergunta \"o que continua igual nos dois cenários?\". Se a resposta é a tarefa, a distância ou o volume, o modelo é inverso; se é o preço por unidade ou a produção por hora, é direto.",
     "Há também problemas em que o cenário muda no meio do caminho. A forma mais confiável de resolvê-los é medir o serviço em unidades de capacidade, como servidor-dia. Calcule o total necessário, subtraia o que já foi feito e divida o restante pela nova capacidade diária. Fazer uma única regra de três com os números iniciais costuma levar a resposta errada, porque a primeira parte do trabalho foi feita com um grupo e a segunda, com outro. Divida o problema em duas etapas e some os tempos no final."
    ],
    "workedExamples": [
     {
      "prompt": "Um oficial de justiça faz um trajeto em 2 horas e 40 minutos, mantendo 45 km/h. A que velocidade constante deveria andar para fazer o mesmo trajeto em 2 horas?",
      "steps": [
       "2 horas e 40 minutos valem 2+40/60=8/3 de hora.",
       "Distância: 45×8/3=120 km.",
       "Com 2 horas, a velocidade é 120/2=60 km/h.",
       "Pela regra inversa: v×2=45×(8/3), isto é, 2v=120 e v=60.",
       "Coerência: o tempo diminuiu, então a velocidade precisa aumentar, e 60 é maior que 45."
      ],
      "answer": "60 km/h."
     },
     {
      "prompt": "Um grupo de 12 servidores iguais tem 20 dias para concluir uma digitalização. Depois de 5 dias de trabalho, 3 servidores são transferidos e não são substituídos. Mantido o ritmo individual, em quantos dias, no total desde o início, o trabalho termina?",
      "steps": [
       "Trabalho total: 12×20=240 servidor-dias.",
       "Feito nos 5 primeiros dias: 12×5=60 servidor-dias.",
       "Restante: 240−60=180 servidor-dias.",
       "Servidores que continuam: 12−3=9.",
       "Dias restantes: 180/9=20.",
       "Total desde o início: 5+20=25 dias, ou seja, 5 dias além do prazo previsto."
      ],
      "answer": "25 dias no total (20 dias depois da saída dos 3 servidores)."
     }
    ]
   },
   {
    "capitulo": 5,
    "development": [
     "Dividir um valor em partes proporcionais a certos números é o mesmo que atribuir pesos. O valor por peso é o total dividido pela soma dos pesos, e cada parcela é o peso vezes esse valor. Quando o enunciado traz informação adicional em vez do total, como a diferença entre a maior e a menor parcela, ela substitui o total: a diferença de pesos corresponde à diferença em reais, e dali sai o valor por peso. Essa variação aparece com frequência e é mais rápida do que montar um sistema de equações.",
     "Os pesos nem sempre são números inteiros. Se o enunciado fala em partes proporcionais a 1/2, 2/3 e 3/4, multiplique todos pelo MMC dos denominadores (12) para obter pesos inteiros: 6, 8 e 9. Multiplicar todos os pesos pelo mesmo número não altera a divisão, apenas troca a régua. Depois da conta, confira se as parcelas somam o total e se a razão entre duas delas é a mesma razão entre os pesos originais. Verifique também se a pergunta pede a parcela de uma pessoa específica ou a diferença entre elas, para não responder com o valor errado."
    ],
    "workedExamples": [
     {
      "prompt": "Um valor será repartido entre três servidores em partes diretamente proporcionais a 3, 5 e 7. A maior parcela excede a menor em R$ 280,00. Qual é o valor total repartido e quanto recebe cada um?",
      "steps": [
       "A diferença entre o maior e o menor peso é 7−3=4.",
       "Essas 4 partes correspondem a R$ 280,00, então cada parte vale 280/4=R$ 70,00.",
       "Parcelas: 3×70=R$ 210,00; 5×70=R$ 350,00; 7×70=R$ 490,00.",
       "Total: 210+350+490=R$ 1.050,00. Conferência: 490−210=280, como o enunciado informa."
      ],
      "answer": "Total de R$ 1.050,00, divididos em R$ 210,00, R$ 350,00 e R$ 490,00."
     },
     {
      "prompt": "Repartir R$ 1.150,00 em partes diretamente proporcionais a 1/2, 2/3 e 3/4.",
      "steps": [
       "O MMC de 2, 3 e 4 é 12. Multiplicando cada peso por 12: 1/2×12=6; 2/3×12=8; 3/4×12=9.",
       "Os pesos inteiros são 6, 8 e 9, e a soma é 6+8+9=23.",
       "Valor por peso: 1.150/23=R$ 50,00.",
       "Parcelas: 6×50=R$ 300,00; 8×50=R$ 400,00; 9×50=R$ 450,00.",
       "Conferência: 300+400+450=1.150. E 300/400=3/4, igual a (1/2)/(2/3)=3/4."
      ],
      "answer": "R$ 300,00, R$ 400,00 e R$ 450,00, respectivamente."
     }
    ]
   }
  ],
  "novosCapitulos": [
   {
    "title": "Regra de três composta",
    "paragraphs": [
     "A regra de três composta aparece quando o resultado depende de mais de duas grandezas ao mesmo tempo. Em vez de \"servidores e dias\", o problema traz \"servidores, dias, horas por dia e quantidade de processos\". Ela não é mais difícil do que a simples, apenas mais longa: é uma regra de três simples repetida, uma vez para cada grandeza, com todas as outras mantidas fixas. O que muda é a organização, porque agora é preciso decidir, para cada grandeza, se ela é direta ou inversa em relação à incógnita. Pense nela como um \"efeito dominó\" de proporções: cada grandeza empurra a incógnita para cima ou para baixo, e o resultado final é o efeito de todos os empurrões juntos. Isso vale para prazos de processos, produção de relatórios e consumo de materiais.",
     "O método mais seguro é comparar cada grandeza com a incógnita, e não com as outras. Coloque os dados numa tabela, com a incógnita numa coluna. Para cada coluna, faça a pergunta: \"se só essa grandeza aumentar, a incógnita aumenta ou diminui?\". Se aumenta, a razão dessa grandeza entra como está (direta); se diminui, a razão entra invertida (inversa). Compare sempre duas grandezas por vez, ignorando as demais. Esse cuidado é o que evita o erro clássico de multiplicar todas as razões na mesma direção. Se uma coluna for confusa, isole-a: imagine todas as outras fixas e refaça a pergunta só com ela, em uma frase curta. Vale também reescrever a conta sempre com a incógnita no início, para não se perder na ordem dos fatores.",
     "Por que a conta funciona? Porque as relações se acumulam: se dobrar os servidores corta o prazo pela metade, e dobrar o número de processos dobra o prazo, fazer as duas coisas ao mesmo tempo mantém o prazo igual. O resultado é o valor original multiplicado por cada razão ajustada. Há também um atalho muito útil: calcular a taxa por unidade de capacidade, como processos por servidor-hora. Com essa taxa, o problema vira uma divisão, e a conferência é imediata. Em provas, o cálculo costuma permitir simplificações antes da multiplicação, como cancelar 8 com 8 ou 6 com 6, então não multiplique tudo de uma vez: simplifique as frações e só depois resolva."
    ],
    "example": "Exemplo resolvido: 3 servidores analisam 90 processos em 5 dias. Para 6 servidores analisarem 360 processos, o prazo é 5×(3/6)×(360/90)=5×0,5×4=10 dias, pois mais servidores diminuem o prazo (razão invertida) e mais processos o aumentam (razão direta).",
    "development": [
     "Algumas grandezas do enunciado podem não afetar a incógnita. Se o problema diz que os servidores são \"igualmente eficientes\", a eficiência é igual e fica fora da conta. Se ele informa que a jornada diária não muda, ela também fica de fora. Já quando uma grandeza muda de um cenário para o outro, ela precisa entrar. Leia atentamente expressões como \"mesmo ritmo\", \"nas mesmas condições\" e \"com a mesma jornada\", pois elas dizem o que permanece constante e, portanto, o que pode ser ignorado.",
     "Outra variação é o enunciado que pede o valor de uma grandeza que não é o prazo, como o número de servidores ou o número de horas por dia. O método continua o mesmo: coloque a incógnita na coluna correspondente e compare cada uma das demais com ela. Para conferir qualquer resposta, use a taxa por unidade: por exemplo, produção por servidor-hora. Se a taxa calculada com os dados do primeiro cenário for igual à calculada com o segundo cenário, a resposta está coerente."
    ],
    "method": [
     "Monte uma tabela com os dois cenários e marque a incógnita com x.",
     "Compare cada grandeza com a incógnita, mantendo as demais fixas: se aumentar uma, a incógnita aumenta (direta) ou diminui (inversa)?",
     "Escreva a razão de cada grandeza; inverta as razões das grandezas inversas.",
     "Resolva isolando x e confira calculando a taxa por unidade (por exemplo, por servidor-hora) nos dois cenários."
    ],
    "workedExamples": [
     {
      "prompt": "8 digitalizadores, trabalhando 6 horas por dia durante 15 dias, produzem 14.400 páginas digitalizadas. Mantido o ritmo de cada digitalizador, em quantos dias 10 digitalizadores, trabalhando 8 horas por dia, produzirão 24.000 páginas?",
      "steps": [
       "Compare cada grandeza com os dias. Mais digitalizadores: menos dias (inversa). Mais horas por dia: menos dias (inversa). Mais páginas: mais dias (direta).",
       "Monte: x=15×(8/10)×(6/8)×(24.000/14.400).",
       "Calcule: 8/10=0,8; 6/8=0,75; 24.000/14.400=5/3. Então x=15×0,8×0,75×5/3=15×0,6×5/3=15.",
       "Conferência pela taxa: no primeiro cenário, 8×6×15=720 digitalizador-horas produzem 14.400 páginas, ou 20 páginas por digitalizador-hora. Para 24.000 páginas, são 24.000/20=1.200 digitalizador-horas; com 10×8=80 digitalizador-horas por dia, resultam 1.200/80=15 dias."
      ],
      "answer": "15 dias."
     },
     {
      "prompt": "12 servidores, trabalhando 8 horas por dia durante 5 dias, elaboram 60 relatórios. Quantos servidores são necessários para elaborar 90 relatórios em 6 dias, trabalhando 5 horas por dia, no mesmo ritmo?",
      "steps": [
       "Compare cada grandeza com o número de servidores. Mais relatórios: mais servidores (direta). Mais dias: menos servidores (inversa). Mais horas por dia: menos servidores (inversa).",
       "Monte: x=12×(90/60)×(5/6)×(8/5).",
       "Calcule: 90/60=1,5; 5/6; 8/5=1,6. Então x=12×1,5×(5/6)×1,6=18×(5/6)×1,6=15×1,6=24.",
       "Conferência: taxa do primeiro cenário=60/(12×5×8)=60/480=0,125 relatório por servidor-hora. Para 90 relatórios são 90/0,125=720 servidor-horas; em 6 dias de 5 horas cada servidor trabalha 30 horas, e 720/30=24 servidores."
      ],
      "answer": "24 servidores."
     },
     {
      "prompt": "Uma equipe de 15 servidores tem 20 dias, de 6 horas cada, para arquivar 8.640 documentos. Depois de 8 dias, constata-se que apenas 2.880 documentos foram arquivados. Mantendo a jornada de 6 horas e a produtividade que a equipe vem apresentando, quantos servidores a mais são necessários para terminar no prazo?",
      "steps": [
       "Servidor-horas já trabalhadas: 15×8×6=720. Produtividade observada: 2.880/720=4 documentos por servidor-hora.",
       "Documentos restantes: 8.640−2.880=5.760. Dias restantes: 20−8=12.",
       "Cada servidor produz em 12 dias de 6 horas: 12×6×4=288 documentos.",
       "Servidores necessários: 5.760/288=20.",
       "Servidores a mais: 20−15=5.",
       "Observação: o plano original previa 8.640/(15×20×6)=4,8 documentos por servidor-hora; como a produtividade real foi menor (4), a equipe precisa de reforço."
      ],
      "answer": "5 servidores a mais (total de 20)."
     }
    ],
    "pitfall": "Multiplicar todas as razões na mesma direção, sem inverter as das grandezas inversas, ou comparar as grandezas entre si em vez de compará-las com a incógnita. Antes de calcular, faça a pergunta \"se só essa aumentar, a incógnita sobe ou desce?\" para cada coluna e confira o resultado pela taxa por unidade.",
    "tables": [
     {
      "caption": "Exemplo de organização dos dados (digitalizadores)",
      "headers": [
       "Grandeza",
       "Cenário 1",
       "Cenário 2",
       "Relação com os dias"
      ],
      "rows": [
       [
        "Digitalizadores",
        "8",
        "10",
        "Inversa"
       ],
       [
        "Horas por dia",
        "6",
        "8",
        "Inversa"
       ],
       [
        "Páginas",
        "14.400",
        "24.000",
        "Direta"
       ],
       [
        "Dias",
        "15",
        "x",
        "—"
       ]
      ]
     }
    ],
    "resumo": {
     "title": "Regra de três composta",
     "text": "É uma sequência de regras de três simples: compare cada grandeza com a incógnita, mantenha as demais fixas e inverta a razão das grandezas inversas.",
     "bizu": "Na dúvida, calcule a taxa por unidade (por servidor-hora) e confira."
    }
   },
   {
    "title": "Divisão proporcional: direta, inversa, composta e sociedade",
    "paragraphs": [
     "Dividir uma quantia em partes proporcionais é atribuir a cada pessoa um peso e distribuir o total conforme esses pesos. Na divisão direta, o peso é o próprio número dado: quem tem número maior recebe mais. Na divisão inversa, o peso é o inverso do número, de modo que quem tem número maior recebe menos. Na divisão composta, o peso é o produto de dois critérios, um direto e outro inverso, e quem sai ganhando é quem tem muito do primeiro e pouco do segundo. Ela aparece em situações reais do serviço público e do dia a dia: rateio de despesas de um prédio entre os setores, divisão de gratificações pelo desempenho, repartição de honorários e distribuição de produtos conforme a necessidade de cada unidade.",
     "O procedimento é sempre o mesmo. Primeiro, defina o peso de cada pessoa. Se houver frações, multiplique todos os pesos pelo MMC dos denominadores para trabalhar apenas com números inteiros. Depois, some os pesos, divida o total por essa soma e multiplique o resultado pelo peso de cada pessoa. A parte mais delicada é a primeira etapa, pois é nela que se erra a direção: leia se o enunciado diz \"diretamente\" ou \"inversamente\" proporcional e para qual grandeza. Pense assim: direto é \"quem tem mais, recebe mais\"; inverso é \"quem tem mais, recebe menos\"; composto é a combinação das duas ideias. Escreva essa frase ao lado do enunciado e só depois defina os pesos, para não inverter a direção.",
     "A divisão em sociedade, também chamada rateio de lucro ou prejuízo, é uma divisão proporcional composta. O peso de cada sócio é o capital multiplicado pelo tempo em que o capital ficou aplicado: quem investe mais, ou por mais tempo, recebe mais. Se todos ficam o mesmo tempo, o tempo é irrelevante e o peso é só o capital. Se os capitais são iguais, o peso é só o tempo. O prejuízo é dividido do mesmo modo que o lucro, e cada sócio arca com a sua parte. Em sociedade, o tempo deve estar na mesma unidade para todos os sócios, e o capital é o valor que de fato ficou aplicado durante aquele período. Retiradas e aportes mudam o capital, e cada mudança abre um novo período de cálculo."
    ],
    "example": "Exemplo resolvido: dois sócios investiram R$ 12.000,00 e R$ 18.000,00 pelo mesmo tempo e lucraram R$ 7.500,00. Os pesos são 12.000:18.000=2:3, com 5 partes. Cada parte vale 7.500/5=1.500, então eles recebem R$ 3.000,00 e R$ 4.500,00.",
    "development": [
     "Existe um atalho para a divisão inversa com poucos números: troque cada número pelo resultado de dividir o MMC deles pelo próprio número. Para dividir em partes inversamente proporcionais a 2, 3 e 6, o MMC é 6, e os pesos viram 6/2=3, 6/3=2 e 6/6=1. É o mesmo que usar 1/2, 1/3 e 1/6 multiplicados por 6. Na divisão composta, calcule o peso de cada pessoa como o primeiro número dividido pelo segundo (por exemplo, 15 processos e 3 dias de atraso dão peso 15/3=5) e só depois some os pesos.",
     "Em sociedades com entrada ou saída de sócios, divida o ano em períodos e calcule capital×meses para cada sócio, somando os períodos quando o capital muda. Se o capital de um sócio é o mesmo durante todo o período, basta um único produto. Cuidado também com unidades de tempo: não misture meses com dias ou anos. Por fim, o resultado de cada divisão precisa ser coerente com a soma: a soma das parcelas deve ser exatamente igual ao total repartido (lucro, prejuízo ou prêmio)."
    ],
    "method": [
     "Descubra o tipo: direta, inversa ou composta, e para quais grandezas.",
     "Defina o peso de cada pessoa (inteiro, usando o MMC se houver frações); na sociedade, peso = capital × tempo.",
     "Some os pesos e divida o total pela soma para achar o valor de cada parte.",
     "Multiplique o valor da parte pelo peso de cada pessoa e confira se as parcelas somam o total."
    ],
    "workedExamples": [
     {
      "prompt": "Três sócios obtiveram lucro de R$ 33.000,00. O sócio A investiu R$ 10.000,00 durante 12 meses; o sócio B, R$ 15.000,00 durante 8 meses; o sócio C, R$ 9.000,00 durante 10 meses. Quanto cabe a cada um?",
      "steps": [
       "Peso de cada sócio: capital × meses. A: 10.000×12=120.000. B: 15.000×8=120.000. C: 9.000×10=90.000.",
       "Simplificando por 30.000: A:B:C=4:4:3, com 4+4+3=11 partes.",
       "Valor da parte: 33.000/11=R$ 3.000,00.",
       "A: 4×3.000=R$ 12.000,00. B: 4×3.000=R$ 12.000,00. C: 3×3.000=R$ 9.000,00.",
       "Conferência: 12.000+12.000+9.000=33.000."
      ],
      "answer": "A recebe R$ 12.000,00, B recebe R$ 12.000,00 e C recebe R$ 9.000,00."
     },
     {
      "prompt": "Um prêmio de R$ 12.000,00 será dividido entre três servidores, em partes diretamente proporcionais ao número de processos relatados (15, 24 e 20) e inversamente proporcionais ao número de dias de atraso (3, 4 e 5). Quanto recebe cada um?",
      "steps": [
       "Peso = processos dividido pelos dias de atraso. Servidor 1: 15/3=5. Servidor 2: 24/4=6. Servidor 3: 20/5=4.",
       "Soma dos pesos: 5+6+4=15.",
       "Valor por peso: 12.000/15=R$ 800,00.",
       "Parcelas: 5×800=R$ 4.000,00; 6×800=R$ 4.800,00; 4×800=R$ 3.200,00.",
       "Conferência: 4.000+4.800+3.200=12.000."
      ],
      "answer": "R$ 4.000,00, R$ 4.800,00 e R$ 3.200,00, respectivamente."
     },
     {
      "prompt": "Uma sociedade teve lucro de R$ 56.000,00 em um ano. O sócio A entrou com R$ 20.000,00 e permaneceu os 12 meses. O sócio B entrou 4 meses depois, com R$ 36.000,00, e ficou os 8 meses restantes. O sócio C entrou 6 meses depois do início, com R$ 24.000,00, e ficou os 6 meses restantes. Qual é a parte do lucro de cada sócio?",
      "steps": [
       "Pesos: A: 20.000×12=240.000. B: 36.000×8=288.000. C: 24.000×6=144.000.",
       "Dividindo todos por 48.000: A=5, B=6, C=3. Soma: 5+6+3=14 partes.",
       "Valor da parte: 56.000/14=R$ 4.000,00.",
       "A: 5×4.000=R$ 20.000,00. B: 6×4.000=R$ 24.000,00. C: 3×4.000=R$ 12.000,00.",
       "Conferência: 20.000+24.000+12.000=56.000; e 20.000/24.000=5/6, igual a 240.000/288.000."
      ],
      "answer": "A recebe R$ 20.000,00, B recebe R$ 24.000,00 e C recebe R$ 12.000,00."
     }
    ],
    "pitfall": "Usar apenas o capital como peso quando os tempos são diferentes, ou dividir diretamente quando o enunciado diz \"inversamente proporcional\". Em dúvida, escreva o peso de cada pessoa antes de qualquer conta e releia o enunciado para confirmar a direção.",
    "tables": [
     {
      "caption": "Peso de cada sócio (capital × meses)",
      "headers": [
       "Sócio",
       "Capital (R$)",
       "Meses",
       "Peso",
       "Parte do lucro (R$)"
      ],
      "rows": [
       [
        "A",
        "10.000",
        "12",
        "120.000",
        "12.000"
       ],
       [
        "B",
        "15.000",
        "8",
        "120.000",
        "12.000"
       ],
       [
        "C",
        "9.000",
        "10",
        "90.000",
        "9.000"
       ]
      ]
     }
    ],
    "resumo": {
     "title": "Divisão proporcional",
     "text": "Defina o peso de cada pessoa (direto, inverso ou capital×tempo), some os pesos e distribua o total proporcionalmente.",
     "bizu": "Inversamente a 2, 3 e 6? Use MMC÷número: pesos 3, 2 e 1."
    }
   },
   {
    "title": "Escalas, velocidade média e problemas de rendimento",
    "paragraphs": [
     "Escala é a razão entre a medida no desenho e a medida real. Uma escala 1:50.000 diz que 1 unidade no mapa corresponde a 50.000 dessas mesmas unidades no terreno: 1 cm no mapa equivale a 50.000 cm, ou 500 m, na realidade. O cuidado central é manter as unidades iguais até o fim e só então converter. Como as medidas do mapa e as do terreno são grandezas diretamente proporcionais, uma regra de três simples resolve qualquer conversão. Escala, velocidade média e rendimento têm em comum a necessidade de manter coerentes as unidades e de enxergar a grandeza que fica constante: a razão do mapa, a distância total ou o serviço completo.",
     "Velocidade média é a distância total dividida pelo tempo total. Ela não é a média aritmética das velocidades, porque os trechos normalmente duram tempos diferentes. Quem anda mais devagar passa mais tempo nessa velocidade, o que puxa a média para baixo. Por isso, a forma correta é calcular o tempo de cada trecho, somar as distâncias e os tempos e só então dividir. A relação entre velocidade, tempo e distância é direta entre distância e tempo (com velocidade fixa) e inversa entre velocidade e tempo (com distância fixa). Pense na velocidade média como a velocidade constante que, sozinha, faria o mesmo percurso no mesmo tempo total. Por isso, ela depende do tempo gasto em cada trecho, e não apenas da velocidade de cada um.",
     "Em problemas de rendimento, trabalha-se com a fração do serviço feita por unidade de tempo. Quem conclui sozinho uma tarefa em 6 horas faz 1/6 do serviço por hora. Duas pessoas ou máquinas trabalhando juntas somam suas frações por hora, e quem esvazia, como um ralo, entra com sinal negativo. O tempo conjunto é o inverso da soma das frações. Essa ideia vale para torneiras, equipes de servidores, impressoras e qualquer processo que envolva uma tarefa completa dividida em unidades de tempo. Na prática, isso significa que o raciocínio de \"fração por hora\" substitui a regra de três inversa nesses problemas, e que a soma das frações de cada participante substitui a média dos tempos."
    ],
    "example": "Exemplo resolvido: em um mapa de escala 1:25.000, a distância de 6 cm corresponde a 6×25.000=150.000 cm, isto é, 1.500 m ou 1,5 km no terreno.",
    "development": [
     "Ao converter uma distância do mapa em distância real, lembre-se das mudanças de unidade: 100 cm formam 1 m, e 1.000 m formam 1 km, o que equivale a 100.000 cm por quilômetro. Um erro frequente é dividir por 1.000 o resultado em centímetros e achar que está em quilômetros. Também é comum o enunciado dar a escala na forma \"1 cm para cada 2 km\"; nesse caso, ela vale 1:200.000 e é preciso fazer a mesma conversão. Em escalas de ampliação, como 5:1, o desenho é maior do que o objeto real, e a razão é maior do que 1.",
     "Nos problemas de rendimento, o tempo conjunto não é a média dos tempos individuais. Duas pessoas, uma com 6 horas e outra com 12, não terminam em 9 horas, mas em 4 horas, porque 1/6+1/12=3/12=1/4. O tempo conjunto é sempre menor do que o menor dos tempos individuais quando todos ajudam, e pode ficar maior do que ele quando alguém atrapalha, como um ralo aberto. Quando o cenário muda no meio da tarefa, calcule a fração concluída até a mudança e use a nova taxa só para o que falta."
    ],
    "method": [
     "Identifique a grandeza (distância no mapa, tempo, trabalho) e converta tudo para as mesmas unidades.",
     "Escala: multiplique a medida do desenho pelo denominador; velocidade média: some as distâncias e some os tempos; rendimento: transforme cada tempo na fração do serviço por unidade de tempo.",
     "Some as frações de quem ajuda e subtraia as de quem atrapalha; inverta o resultado para obter o tempo.",
     "Confira unidades e a coerência do resultado (por exemplo, o tempo conjunto menor que o menor tempo individual)."
    ],
    "workedExamples": [
     {
      "prompt": "Em um mapa de escala 1:200.000, a distância entre dois fóruns mede 8,4 cm. Um oficial de justiça percorre essa distância real a 42 km/h. Qual é a distância real e quanto tempo ele leva, em minutos?",
      "steps": [
       "Distância real em centímetros: 8,4×200.000=1.680.000 cm.",
       "Converta: 1.680.000/100.000=16,8 km.",
       "Tempo: 16,8/42=0,4 hora.",
       "Em minutos: 0,4×60=24 minutos."
      ],
      "answer": "16,8 km, percorridos em 24 minutos."
     },
     {
      "prompt": "Um veículo vai da sede do tribunal até uma comarca distante 120 km a 60 km/h e volta pelo mesmo caminho a 40 km/h. Qual é a velocidade média de todo o percurso?",
      "steps": [
       "Tempo de ida: 120/60=2 horas. Tempo de volta: 120/40=3 horas.",
       "Distância total: 120+120=240 km. Tempo total: 2+3=5 horas.",
       "Velocidade média: 240/5=48 km/h.",
       "A média aritmética das velocidades seria (60+40)/2=50 km/h, que está errada, pois o veículo passa mais tempo na velocidade menor."
      ],
      "answer": "48 km/h."
     },
     {
      "prompt": "Um reservatório vazio é abastecido por duas torneiras: a torneira A o encheria sozinha em 4 horas e a B, em 12 horas. Um ralo, se ficasse aberto sozinho com o reservatório cheio, o esvaziaria em 6 horas. As duas torneiras são abertas ao mesmo tempo e o ralo só é aberto após as 2 primeiras horas. Em quanto tempo, contado desde a abertura das torneiras, o reservatório fica cheio?",
      "steps": [
       "Frações por hora: A enche 1/4; B enche 1/12; o ralo esvazia 1/6.",
       "Nas 2 primeiras horas, sem o ralo: 1/4+1/12=3/12+1/12=4/12=1/3 por hora. Em 2 horas, enchem 2/3 do reservatório.",
       "Falta 1−2/3=1/3 do reservatório.",
       "Com o ralo aberto: 1/4+1/12−1/6=3/12+1/12−2/12=2/12=1/6 por hora.",
       "Tempo para encher 1/3 com 1/6 por hora: (1/3)/(1/6)=2 horas.",
       "Tempo total: 2+2=4 horas."
      ],
      "answer": "4 horas."
     }
    ],
    "pitfall": "Tirar a média aritmética das velocidades em trechos de mesma distância, ou deixar a escala em uma unidade e a distância em outra. Para a velocidade média, calcule sempre distância total dividida por tempo total; para a escala, converta os centímetros do mapa ao final.",
    "tables": [
     {
      "caption": "Conversão de escala (1 cm no mapa)",
      "headers": [
       "Escala",
       "1 cm no mapa equivale a",
       "Em metros"
      ],
      "rows": [
       [
        "1:1.000",
        "1.000 cm",
        "10 m"
       ],
       [
        "1:25.000",
        "25.000 cm",
        "250 m"
       ],
       [
        "1:50.000",
        "50.000 cm",
        "500 m"
       ],
       [
        "1:200.000",
        "200.000 cm",
        "2.000 m"
       ]
      ]
     }
    ],
    "resumo": {
     "title": "Escala, velocidade e rendimento",
     "text": "Escala: multiplique o desenho pelo denominador. Velocidade média: distância total ÷ tempo total. Rendimento: some as frações do serviço por unidade de tempo.",
     "bizu": "Ida e volta a velocidades diferentes: nunca é a média simples das velocidades."
    }
   },
   {
    "title": "Razões especiais e leitura de enunciados",
    "paragraphs": [
     "Boa parte dos erros em razão e proporção nasce da leitura do enunciado, e não da conta. A mesma situação pode ser descrita de maneiras diferentes: \"para cada 3 homens há 5 mulheres\", \"a razão entre homens e mulheres é 3/5\", \"os homens estão na proporção de 3 para 5\". As três expressões significam a mesma razão parte a parte. Já \"os homens são 3/8 do grupo\" compara a parte com o total, e \"os homens são 60% das mulheres\" compara dois grupos com uma porcentagem. Aprenda a traduzir cada frase em uma razão antes de calcular. Treine a leitura em duas passadas: na primeira, sublinhe os números e as unidades; na segunda, escreva ao lado de cada frase a razão ou a diferença correspondente. Só depois monte a equação.",
     "A razão com porcentagem merece atenção especial por causa da base. Dizer que A é 25% maior que B significa A=1,25×B, o que dá A:B=5:4. Dizer que B é 25% menor que A significa B=0,75×A, o que dá B:A=3:4. Os dois percentuais têm bases diferentes: a base é sempre a grandeza que vem depois de \"que\" ou de \"de\". Quando a base for clara, transforme a porcentagem em razão irredutível, defina as partes e use o total ou a diferença que o enunciado fornece. Resumindo, a porcentagem só tem sentido junto com a sua base, e a mudança de base muda o valor do percentual. Por isso, o enunciado \"A é 25% maior que B\" não é equivalente a \"B é 25% menor que A\".",
     "Outra fonte de erro são as unidades. Razões entre grandezas de mesma natureza só podem ser calculadas depois de convertidas para a mesma unidade. Já as razões entre grandezas diferentes, como metros por minuto ou reais por página, são taxas e precisam ser comparadas na mesma unidade composta. Por fim, atente à variação das razões: quando se acrescenta ou retira um mesmo valor dos dois termos, a razão se altera. Somar o mesmo número às duas partes não preserva a razão, mas multiplicar as duas pelo mesmo fator preserva. Isso reforça a ideia de que a razão depende do que se compara, e não apenas dos números. Em provas, esse cuidado separa quem entende a situação de quem apenas aplica fórmulas."
    ],
    "example": "Exemplo resolvido: se as mulheres são 3/8 de um grupo, os homens são 5/8, e a razão entre homens e mulheres é (5/8)/(3/8)=5/3. Em um grupo de 40 pessoas, são 15 mulheres e 25 homens, e 25/15=5/3.",
    "development": [
     "Certas expressões têm sentido fixo e vale decorá-las. \"A razão de A para B\" é A/B. \"A está para B como 2 está para 3\" é A/B=2/3. \"A é o dobro de B\" é A/B=2. \"A excede B em 20\" é A−B=20, uma diferença, e não uma razão. \"Para cada 4 processos físicos há 7 digitais\" significa físicos:digitais=4:7. Em todas, a ordem das palavras indica a ordem dos termos; troque a ordem e você troca a razão pelo seu inverso.",
     "Existem problemas em que a razão muda depois de uma transferência ou de uma retirada. O erro típico é imaginar que as partes cresceram de forma proporcional. A solução é escrever a quantidade antes e a quantidade depois em função de uma unidade comum, geralmente o total (quando ele não muda) ou a parte que não se altera. Escreva uma equação com a nova razão e resolva. Ao final, calcule a razão nova com os valores encontrados para confirmar."
    ],
    "method": [
     "Traduza cada frase do enunciado em uma razão (parte/parte, parte/total) ou em uma diferença, respeitando a ordem dos termos.",
     "Converta unidades e transforme porcentagens em razões, identificando a base de cada uma.",
     "Escolha uma unidade comum (a parte ou o total que não muda) e escreva as quantidades em função dela.",
     "Resolva e confira refazendo a razão do enunciado com os valores encontrados."
    ],
    "workedExamples": [
     {
      "prompt": "O servidor A percorre 900 metros em 12 minutos. O servidor B percorre 1,5 quilômetro em 15 minutos, ambos em velocidade constante. Qual é a razão entre a velocidade de A e a de B?",
      "steps": [
       "Converta para a mesma unidade: 1,5 km=1.500 m.",
       "Velocidade de A: 900/12=75 metros por minuto.",
       "Velocidade de B: 1.500/15=100 metros por minuto.",
       "Razão A:B=75/100=3/4."
      ],
      "answer": "3:4 (A anda 3 metros para cada 4 de B)."
     },
     {
      "prompt": "Em um mês, o número de recursos deferidos foi 40% maior do que o de indeferidos. Sabendo que houve 360 recursos julgados, entre deferidos e indeferidos, quantos foram deferidos?",
      "steps": [
       "A base é o número de indeferidos: deferidos=1,4×indeferidos, ou 7/5 dos indeferidos.",
       "Razão deferidos:indeferidos=7:5, com 7+5=12 partes.",
       "Valor da parte: 360/12=30.",
       "Deferidos: 7×30=210. Indeferidos: 5×30=150.",
       "Conferência: 210/150=1,4, ou seja, 40% a mais; e 210+150=360."
      ],
      "answer": "210 recursos deferidos (e 150 indeferidos)."
     },
     {
      "prompt": "Em uma vara, a razão entre processos concluídos e pendentes era 2:3. Depois de mais 100 processos serem concluídos, a razão passou a 3:2. Supondo que nenhum processo novo tenha entrado, quantos processos a vara tem ao todo e quantos estavam concluídos no início?",
      "steps": [
       "Como nenhum processo novo entrou, o total T é constante.",
       "Inicialmente concluídos=2T/5. Depois, concluídos=2T/5+100.",
       "Na nova razão 3:2, os concluídos são 3/5 do total: 2T/5+100=3T/5.",
       "Então 100=3T/5−2T/5=T/5, e T=500.",
       "Concluídos no início: 2×500/5=200. Pendentes: 300.",
       "Depois: 300 concluídos e 200 pendentes, razão 300/200=3/2, como diz o enunciado."
      ],
      "answer": "Total de 500 processos, dos quais 200 estavam concluídos no início."
     }
    ],
    "pitfall": "Confundir a razão entre partes (3:5) com a fração do total (3/8), ou calcular uma porcentagem sobre a base errada. Pergunte sempre: \"comparo uma parte com a outra, ou com o todo? E o percentual é sobre quem?\".",
    "tables": [
     {
      "caption": "Traduzindo frases em razões",
      "headers": [
       "Frase do enunciado",
       "Tradução",
       "Equivalente"
      ],
      "rows": [
       [
        "A está para B como 3 para 5",
        "A/B = 3/5",
        "A:B = 3:5"
       ],
       [
        "A é 25% maior que B",
        "A = 1,25·B",
        "A:B = 5:4"
       ],
       [
        "B é 25% menor que A",
        "B = 0,75·A",
        "B:A = 3:4"
       ],
       [
        "A representa 3/8 do total",
        "A/total = 3/8",
        "A:resto = 3:5"
       ]
      ]
     }
    ],
    "resumo": {
     "title": "Leitura de razões",
     "text": "Traduza cada frase em parte/parte, parte/total ou diferença, identifique a base das porcentagens e converta as unidades antes de calcular.",
     "bizu": "25% a mais que B dá 5:4; 25% a menos que A dá 3:4. Mude a base, mude a razão."
    }
   }
  ]
 },
 "M12": {
  "extras": [
   {
    "capitulo": 1,
    "development": [
     "Antes de calcular, traduza a frase para a relação parte = taxa × base. A expressão 'A é 30% de B' coloca B como base: A = 0,30×B. Já 'A é 30% maior que B' também usa B como base, mas A inclui o próprio B mais o acréscimo: A = 1,30×B. E 'A é 30% menor que B' dá A = 0,70×B. As três frases parecem próximas, porém levam a valores bem diferentes. Note ainda que 'A é 150% de B' significa A = 1,5×B, e 'A excede B em 50%' diz a mesma coisa. Sempre que aparecer 'que', 'do', 'da' ou 'sobre', procure a palavra que vem logo depois: é ela que costuma indicar a base de cálculo.",
     "Vale decorar a correspondência entre frações simples e percentuais, porque ela acelera quase toda conta. Como 1/8 vale 12,5%, três oitavos valem 37,5%; como 1/5 vale 20%, quatro quintos valem 80%. Frações com denominador 3 e 6 geram dízimas: 1/3 é aproximadamente 33,33% e 1/6 é aproximadamente 16,67%. Nesses casos, prefira trabalhar com a fração exata durante a conta e só converter no final. Isso evita acumular arredondamentos e mantém o resultado limpo quando a base é um múltiplo do denominador, como 1/3 de 240 = 80."
    ],
    "workedExamples": [
     {
      "prompt": "Em um mês, uma secretaria judiciária recebeu 840 processos. Desse total, 35% eram cíveis, 1/4 eram criminais e o restante era de família. Quantos processos de família foram recebidos e qual é o percentual deles em relação ao total de 840?",
      "steps": [
       "Cíveis: 35% de 840 = 0,35×840 = 294 processos.",
       "Criminais: 1/4 de 840 = 840÷4 = 210 processos.",
       "Família: 840 − 294 − 210 = 336 processos.",
       "Percentual de família sobre a base de 840: 336/840 = 0,40 = 40%. Conferência: 35% + 25% + 40% = 100%."
      ],
      "answer": "336 processos de família, que correspondem a 40% do total."
     },
     {
      "prompt": "Em uma unidade, a quantidade de processos digitais é 160% da quantidade de processos físicos. Sabendo que há 1.300 processos no total, quantos são físicos e quantos são digitais? Em que percentual os digitais superam os físicos?",
      "steps": [
       "A base da comparação é o número de físicos, F. Então digitais = 1,6×F.",
       "Total: F + 1,6F = 2,6F = 1.300, logo F = 1.300/2,6 = 500.",
       "Digitais: 1,6×500 = 800. Conferência: 500 + 800 = 1.300.",
       "Os digitais excedem os físicos em 800 − 500 = 300, e 300/500 = 0,60 = 60% (base: físicos)."
      ],
      "answer": "500 físicos e 800 digitais; os digitais superam os físicos em 60%."
     }
    ],
    "tables": [
     {
      "caption": "Frações usuais e seus percentuais",
      "headers": [
       "Fração",
       "Decimal",
       "Percentual"
      ],
      "rows": [
       [
        "1/2",
        "0,5",
        "50%"
       ],
       [
        "1/4",
        "0,25",
        "25%"
       ],
       [
        "1/5",
        "0,2",
        "20%"
       ],
       [
        "1/8",
        "0,125",
        "12,5%"
       ],
       [
        "3/8",
        "0,375",
        "37,5%"
       ],
       [
        "1/3",
        "0,3333...",
        "33,33%..."
       ],
       [
        "2/3",
        "0,6667...",
        "66,67%..."
       ]
      ]
     }
    ]
   },
   {
    "capitulo": 2,
    "development": [
     "Uma técnica muito útil é decompor a taxa em partes fáceis: 10% é a base dividida por 10, 1% é a base dividida por 100, 5% é metade de 10% e 50% é metade da base. Assim, 35% de 480 vira 30% + 5%: 3×48 + 24 = 168. Outra propriedade é a simetria p% de q = q% de p, porque ambos valem p×q/100. Então 4% de 75 é igual a 75% de 4, que dá 3; escolha o lado que facilita a conta. Essa troca só vale para a conta numérica, e não para a interpretação do enunciado, pois a base descrita na frase continua sendo a original.",
     "Quando um enunciado fala em 'do que restou', a base muda a cada etapa. Se você retira 30% de um total, resta 70%; uma segunda retirada de 25% 'do restante' incide sobre esses 70%, não sobre o total inicial. Por isso, o que sobra ao final é o produto dos percentuais restantes: 0,70×0,75 = 0,525, ou 52,5% do total original. Escreva sempre, ao lado de cada percentual, qual é o valor sobre o qual ele atua. Esse hábito simples elimina a maior parte dos erros em problemas de divisão de verbas e de retiradas sucessivas."
    ],
    "workedExamples": [
     {
      "prompt": "Calcule mentalmente 35% de 480 decompondo a taxa em partes simples e confirme o resultado com a multiplicação direta.",
      "steps": [
       "Base: 480. Então 10% de 480 = 48.",
       "30% = 3×48 = 144 e 5% = 48/2 = 24.",
       "35% = 144 + 24 = 168.",
       "Conferência direta: 0,35×480 = 168."
      ],
      "answer": "168."
     },
     {
      "prompt": "Um órgão dispõe de R$ 24.000,00. Gasta 30% desse valor em material. Do que restou, destina 25% a treinamento. Do novo restante, gasta 40% em manutenção. Quanto sobra e que percentual do valor inicial isso representa?",
      "steps": [
       "Material: 30% de 24.000 = 7.200. Restam 24.000 − 7.200 = 16.800.",
       "Treinamento: 25% de 16.800 = 4.200. Restam 16.800 − 4.200 = 12.600.",
       "Manutenção: 40% de 12.600 = 5.040. Sobram 12.600 − 5.040 = 7.560.",
       "Sobre a base inicial de 24.000: 7.560/24.000 = 0,315 = 31,5%. Pelos fatores: 0,70×0,75×0,60 = 0,315."
      ],
      "answer": "Sobram R$ 7.560,00, ou 31,5% do valor inicial."
     }
    ],
    "tables": [
     {
      "caption": "Retiradas sucessivas: a base muda a cada etapa",
      "headers": [
       "Etapa",
       "Base",
       "Percentual",
       "Valor retirado",
       "Restante"
      ],
      "rows": [
       [
        "Material",
        "R$ 24.000,00",
        "30%",
        "R$ 7.200,00",
        "R$ 16.800,00"
       ],
       [
        "Treinamento",
        "R$ 16.800,00",
        "25%",
        "R$ 4.200,00",
        "R$ 12.600,00"
       ],
       [
        "Manutenção",
        "R$ 12.600,00",
        "40%",
        "R$ 5.040,00",
        "R$ 7.560,00"
       ]
      ]
     }
    ]
   },
   {
    "capitulo": 3,
    "development": [
     "Em problemas de acréscimo e desconto, existem duas perguntas diferentes: qual é o valor final e qual é o valor da diferença. O valor final usa o fator (1+i) ou (1−d); a diferença é a taxa multiplicada pela base inicial. Se o valor passa de R$ 1.250,00 para R$ 1.100,00, a diferença é de R$ 150,00, e a taxa de desconto é 150/1.250 = 12%. Quando o enunciado fala em dois ajustes aplicados um depois do outro, como desconto sobre o preço de tabela e depois taxa sobre o valor já descontado, cada taxa atua sobre uma base diferente e os fatores são multiplicados, não somados.",
     "Também é comum o enunciado dar o resultado final e pedir a base. Nesse caso, escreva a igualdade com a base como incógnita: se o valor líquido é 0,9434 do bruto, então bruto = líquido/0,9434. Resista à tentação de 'somar de volta' a taxa ao valor final: um desconto de 11% retirado de um total maior não é desfeito acrescentando 11% ao total menor. Como regra de segurança, depois de achar a base, refaça a conta no sentido direto e verifique se chega ao valor dado no enunciado."
    ],
    "workedExamples": [
     {
      "prompt": "Um lote de material custa R$ 1.250,00 na tabela. O fornecedor concede desconto de 12% sobre esse preço. Em seguida, é cobrado frete de 3% sobre o valor já descontado. Qual é o valor final a pagar e qual a diferença em relação ao preço de tabela?",
      "steps": [
       "Desconto: fator 1 − 0,12 = 0,88. Valor com desconto: 1.250×0,88 = R$ 1.100,00.",
       "Frete de 3% sobre R$ 1.100,00: fator 1,03. Valor final: 1.100×1,03 = R$ 1.133,00.",
       "Diferença para a tabela: 1.250 − 1.133 = R$ 117,00.",
       "Em taxa sobre a base de 1.250: 117/1.250 = 9,36% de redução. Pelos fatores: 0,88×1,03 = 0,9064, ou seja, 1 − 0,9064 = 9,36%."
      ],
      "answer": "R$ 1.133,00, que é R$ 117,00 (9,36%) abaixo do preço de tabela."
     },
     {
      "prompt": "O vencimento de um servidor recebeu reajuste de 6%. Sobre o valor já reajustado incide uma contribuição de 11%. Depois disso, o valor líquido é R$ 4.717,00. Qual era o vencimento antes do reajuste? O líquido ficou acima ou abaixo desse vencimento, e em que percentual?",
      "steps": [
       "Seja S o vencimento inicial. Reajuste: S×1,06. Contribuição de 11% sobre esse valor: fator 0,89.",
       "Líquido = S×1,06×0,89 = 0,9434×S = 4.717.",
       "S = 4.717/0,9434 = 5.000. Conferência: 5.000×1,06 = 5.300 e 5.300×0,89 = 4.717.",
       "Variação do líquido sobre a base de 5.000: 4.717/5.000 = 0,9434, ou seja, queda de 5,66%."
      ],
      "answer": "Vencimento inicial de R$ 5.000,00; o líquido ficou 5,66% abaixo dele."
     }
    ]
   },
   {
    "capitulo": 4,
    "development": [
     "Quando há várias mudanças percentuais em sequência, o resultado acumulado é o produto dos fatores, e a taxa total é esse produto menos 1. Três reajustes de 10%, 20% e 25% dão 1,10×1,20×1,25 = 1,65, isto é, 65% de aumento total, bem diferente da soma 10+20+25 = 55. A diferença vem do efeito de 'juros sobre juros': cada reajuste incide sobre uma base que já incorpora os anteriores. Para encontrar um dos fatores desconhecidos, divida o fator total pelos fatores conhecidos, como em 1,65/(1,10×1,20) = 1,25.",
     "Se o enunciado fornece o valor inicial e o final, a taxa total é (final − inicial)/inicial. Mas atenção: quando os percentuais são sucessivos, a taxa total não pode ser dividida por igual entre as etapas. Se dois reajustes iguais produzem 21% no total, cada um vale 10%, pois 1,10×1,10 = 1,21; e não 10,5%. A taxa média por período é a raiz do fator total, e não a divisão da taxa total pelo número de períodos. Nos exercícios, os números costumam ser escolhidos para que essa raiz seja exata, como 1,21, 1,44 ou 1,69."
    ],
    "workedExamples": [
     {
      "prompt": "O valor de um contrato é R$ 2.000,00. Ele sofre aumento de 40% e, depois, desconto de 25% sobre o valor já aumentado. Qual é o valor final e qual é a variação percentual total em relação a R$ 2.000,00?",
      "steps": [
       "Aumento de 40%: 2.000×1,40 = R$ 2.800,00.",
       "Desconto de 25% sobre R$ 2.800,00: 2.800×0,75 = R$ 2.100,00.",
       "Fator total: 1,40×0,75 = 1,05.",
       "Variação sobre a base inicial: (2.100 − 2.000)/2.000 = 5%."
      ],
      "answer": "R$ 2.100,00, com aumento total de 5%."
     },
     {
      "prompt": "Um valor passou por três reajustes sucessivos. O primeiro foi de 10%, o segundo de 20% e o terceiro, de uma taxa desconhecida, levou o valor total a crescer 65% em relação ao inicial. Qual foi a taxa do terceiro reajuste?",
      "steps": [
       "Fator total: 1 + 0,65 = 1,65.",
       "Fatores conhecidos: 1,10×1,20 = 1,32.",
       "Fator do terceiro reajuste: 1,65/1,32 = 1,25.",
       "A taxa do terceiro reajuste é 1,25 − 1 = 0,25 = 25%. Conferência: 1,10×1,20×1,25 = 1,65."
      ],
      "answer": "25%."
     }
    ],
    "tables": [
     {
      "caption": "Soma de taxas e produto de fatores",
      "headers": [
       "Reajustes sucessivos",
       "Soma das taxas",
       "Fator acumulado",
       "Variação total"
      ],
      "rows": [
       [
        "10% e 10%",
        "20%",
        "1,21",
        "21%"
       ],
       [
        "20% e 20%",
        "40%",
        "1,44",
        "44%"
       ],
       [
        "10%, 20% e 25%",
        "55%",
        "1,65",
        "65%"
       ]
      ]
     }
    ]
   },
   {
    "capitulo": 5,
    "development": [
     "Em tabelas e gráficos, cada percentual pertence a um denominador específico. A frase '30% dos homens' usa como base o número de homens; '30% do total' usa todo o grupo. Quando existem dois subgrupos com taxas diferentes, o percentual global é uma média ponderada: soma-se a parte de cada subgrupo e divide-se pelo total. Isso explica por que o percentual global fica sempre entre as duas taxas, mais perto da taxa do grupo maior. Se um grupo tem 30% e outro tem 20%, o geral só será exatamente 25% se os dois grupos tiverem o mesmo tamanho.",
     "Outro tipo frequente é o da mudança de composição: entra ou sai gente, e a taxa global muda. Como a taxa é uma razão, os dois termos precisam ser atualizados. Se foram feitas 500 respostas com 55% de aprovação e depois chegam mais 100 respostas, o total passa a 600; se a aprovação global sobe para 60%, o total de aprovações vai a 360. A diferença 360 − 275 = 85 mostra quantos aprovaram entre os novos, o que equivale a 85% desse novo grupo. Trabalhar com quantidades inteiras antes de voltar ao percentual costuma ser o caminho mais seguro."
    ],
    "workedExamples": [
     {
      "prompt": "Em um tribunal há 300 servidores: 120 homens e 180 mulheres. Teletrabalham 30% dos homens e 20% das mulheres. Qual é o percentual de servidores em teletrabalho em relação ao total de 300?",
      "steps": [
       "Homens em teletrabalho: 30% de 120 = 36.",
       "Mulheres em teletrabalho: 20% de 180 = 36.",
       "Total em teletrabalho: 36 + 36 = 72.",
       "Percentual sobre a base de 300: 72/300 = 0,24 = 24%. Note que 24% fica entre 20% e 30%, mais perto de 20%, taxa do grupo maior."
      ],
      "answer": "24%."
     },
     {
      "prompt": "Uma pesquisa interna ouviu 500 servidores e 55% aprovaram uma nova rotina. Depois, mais 100 servidores responderam, e a aprovação passou a ser de 60% do total de 600 respondentes. Quantos dos 100 novos respondentes aprovaram a rotina e qual é a taxa de aprovação nesse grupo?",
      "steps": [
       "Aprovações iniciais: 55% de 500 = 275.",
       "Aprovações no total final: 60% de 600 = 360.",
       "Aprovações entre os novos: 360 − 275 = 85.",
       "Taxa nos novos, sobre a base de 100: 85/100 = 85%."
      ],
      "answer": "85 dos novos respondentes aprovaram, o que dá 85% desse grupo."
     }
    ]
   }
  ],
  "novosCapitulos": [
   {
    "title": "Porcentagem de porcentagem e fator de multiplicação",
    "paragraphs": [
     "Porcentagem de porcentagem aparece quando uma taxa incide sobre uma parte que, por sua vez, já é uma porcentagem de outra base. Por exemplo, '45% dos servidores trabalham no atendimento, e 20% desses são estagiários'. A taxa final sobre o total de servidores é o produto das duas taxas escritas como decimais: 0,45×0,20 = 0,09, isto é, 9%. A palavra 'dos' ou 'das' indica que a segunda taxa é aplicada ao resultado da primeira, e por isso a multiplicação é a operação correta. Somar os percentuais ou calcular cada um sobre o total original é o erro mais comum nesse tipo de enunciado.",
     "O fator de multiplicação é a forma mais rápida de transformar um percentual em operação. Um acréscimo de i% vira o fator 1+i/100 e um desconto de d% vira o fator 1−d/100. Assim, acréscimo de 35% tem fator 1,35, desconto de 12,5% tem fator 0,875, acréscimo de 100% tem fator 2 e acréscimo de 0,5% tem fator 1,005. O fator responde à pergunta: 'por quanto devo multiplicar a base para chegar ao valor final?'. Com ele, não é preciso calcular o aumento separadamente e depois somar: uma única multiplicação resolve.",
     "Quando há duas ou mais operações em cadeia, os fatores se multiplicam. Se o preço de R$ 640,00 recebe desconto de 12,5% e depois imposto de 8% sobre o valor descontado, o fator total é 0,875×1,08 = 0,945. O valor final é 640×0,945 = R$ 604,80, o que equivale a uma redução de 5,5% sobre a base de R$ 640,00. Repare que o fator total, 0,945, também é um fator: ele diz que o valor final corresponde a 94,5% do inicial."
    ],
    "example": "Exemplo resolvido: 40% dos 500 servidores de uma comarca trabalham no atendimento ao público; desses, 25% são estagiários. Estagiários do atendimento = 0,40×0,25×500 = 50, o que dá 10% do total de 500.",
    "development": [
     "Vale distinguir 'x% a mais que' de 'x% de'. Se o texto diz que a quantidade A é 20% maior que B, a base é B e A = 1,20×B. Se diz que A é 20% de B, então A = 0,20×B. Quando a frase é invertida, como 'B é quantos por cento de A?', a base passa a ser A, e o resultado muda: se A = 1,20×B, então B é 1/1,20 = 83,33% de A, e não 80%. Esse cuidado com a base explica por que a mesma diferença absoluta gera percentuais diferentes conforme o ponto de vista.",
     "Quando um enunciado mistura grupos, é mais seguro trabalhar com quantidades inteiras do que com taxas: calcule quantas pessoas, processos ou reais cada percentual representa e só depois volte à taxa sobre o total. Isso é especialmente útil quando cada subgrupo possui uma taxa própria, pois o percentual global é uma soma de partes e não a soma das taxas. Escolher um total conveniente, como 100 ou 200, também ajuda quando o enunciado não fornece a base, desde que as proporções sejam mantidas."
    ],
    "method": [
     "Identifique a base de cada percentual e escreva-a ao lado da taxa.",
     "Converta cada taxa em decimal ou em fator (1+i ou 1−d).",
     "Multiplique as taxas, ou os fatores, na ordem em que o enunciado as aplica.",
     "Confira calculando também com quantidades inteiras e verifique se o resultado está entre 0 e 1 (ou maior que 1, em acréscimos)."
    ],
    "workedExamples": [
     {
      "prompt": "Em um fórum com 500 servidores, 45% trabalham no atendimento. Desses, 20% são estagiários. Quantos estagiários há no atendimento e que percentual do total de servidores eles representam?",
      "steps": [
       "Atendimento: 45% de 500 = 0,45×500 = 225 servidores.",
       "Estagiários: 20% de 225 = 0,20×225 = 45.",
       "Percentual sobre os 500: 45/500 = 0,09 = 9%.",
       "Pelas taxas: 0,45×0,20 = 0,09, que confirma o resultado."
      ],
      "answer": "45 estagiários, que correspondem a 9% do total de servidores."
     },
     {
      "prompt": "Um produto custa R$ 640,00. Recebe desconto de 12,5% e, em seguida, imposto de 8% sobre o preço já descontado. Escreva os fatores, calcule o valor final e a variação percentual total em relação a R$ 640,00.",
      "steps": [
       "Fator do desconto: 1 − 0,125 = 0,875. Preço com desconto: 640×0,875 = R$ 560,00.",
       "Fator do imposto: 1,08. Valor final: 560×1,08 = R$ 604,80.",
       "Fator total: 0,875×1,08 = 0,945; confirmação: 640×0,945 = 604,80.",
       "Variação: 604,80/640 = 0,945, ou seja, redução de 5,5% sobre a base de R$ 640,00."
      ],
      "answer": "R$ 604,80, com redução total de 5,5%."
     },
     {
      "prompt": "Uma turma de 200 candidatos é composta de 60% de mulheres. Entre as mulheres, 35% já possuem pós-graduação; entre os homens, 50% possuem. Quantos candidatos têm pós-graduação e qual é esse percentual sobre os 200?",
      "steps": [
       "Mulheres: 0,60×200 = 120; homens: 200 − 120 = 80.",
       "Mulheres com pós: 35% de 120 = 42. Homens com pós: 50% de 80 = 40.",
       "Total com pós: 42 + 40 = 82.",
       "Percentual sobre a base de 200: 82/200 = 0,41 = 41%. Pelas taxas: 0,60×0,35 + 0,40×0,50 = 0,21 + 0,20 = 0,41."
      ],
      "answer": "82 candidatos, o que equivale a 41% da turma."
     }
    ],
    "pitfall": "Aplicar a segunda porcentagem sobre o total original em vez de aplicá-la à parte já calculada, ou somar as taxas (45% + 20% = 65%) quando o enunciado pede 'porcentagem dos'. Escreva sempre a base ao lado de cada taxa antes de multiplicar.",
    "tables": [
     {
      "caption": "Fator de multiplicação",
      "headers": [
       "Mudança",
       "Conta",
       "Fator"
      ],
      "rows": [
       [
        "Acréscimo de 35%",
        "1 + 0,35",
        "1,35"
       ],
       [
        "Desconto de 12,5%",
        "1 − 0,125",
        "0,875"
       ],
       [
        "Acréscimo de 100%",
        "1 + 1",
        "2"
       ],
       [
        "Acréscimo de 0,5%",
        "1 + 0,005",
        "1,005"
       ],
       [
        "Desconto de 100%",
        "1 − 1",
        "0"
       ]
      ]
     }
    ],
    "resumo": {
     "title": "Porcentagem de porcentagem",
     "text": "Taxas em cadeia se multiplicam, e cada uma incide sobre a parte anterior. O fator 1+i ou 1−d resume o acréscimo ou desconto numa só conta.",
     "bizu": "Se o texto diz 'dos', multiplique; escreva a base ao lado de cada taxa."
    }
   },
   {
    "title": "Variações sucessivas, aumento seguido de desconto e preço inicial",
    "paragraphs": [
     "Em variações sucessivas, cada mudança percentual incide sobre o resultado da anterior. Por isso o efeito total é o produto dos fatores, e não a soma das taxas. Um aumento de 30% seguido de um desconto de 30% não devolve o valor original: 1,30×0,70 = 0,91, o que representa queda de 9%. O aumento ocorre sobre a base inicial e o desconto ocorre sobre uma base maior, de modo que retira mais em reais do que o aumento havia acrescentado. É uma pegadinha muito comum, justamente porque o aluno apressado imagina que as duas taxas se anulem.",
     "Para o caminho inverso, em que o enunciado dá o valor final e pede o inicial, divide-se o valor final pelo fator total. Se um preço passa por aumento de 20% e desconto de 15% e chega a R$ 2.040,00, o fator total é 1,20×0,85 = 1,02, e o preço inicial é 2.040/1,02 = R$ 2.000,00. Divide-se, e não se subtrai, porque o fator total é a razão entre final e inicial. Quando há mais de duas mudanças, o raciocínio é idêntico: um único fator total e uma única divisão.",
     "Existe ainda a pergunta clássica: qual percentual anula uma mudança anterior? Se o preço sobe i, o desconto que o devolve ao original é d = 1 − 1/(1+i), que também pode ser escrito como i/(1+i). Se o preço cai d, o aumento necessário é i = d/(1−d). Para aumento de 25%, o desconto é 0,25/1,25 = 20%; para queda de 20%, o aumento é 0,20/0,80 = 25%. Quanto maior a mudança, mais desigual fica a taxa de retorno, e é por isso que o retorno nunca é igual à taxa original."
    ],
    "example": "Exemplo resolvido: um preço de R$ 800,00 sobe 30% e depois cai 30%: 800×1,30 = 1.040; 1.040×0,70 = 728. Fator 1,30×0,70 = 0,91, queda de 9%.",
    "development": [
     "Quando um aumento de x% é seguido de um desconto de x%, o fator é (1+x)(1−x) = 1−x^2, que é sempre menor que 1. Com x = 0,10, o fator vale 0,99 (perda de 1%); com x = 0,30, vale 0,91 (perda de 9%); com x = 0,50, vale 0,75 (perda de 25%). A perda percentual é o quadrado da taxa, o que explica por que ela cresce depressa. Se a ordem for invertida, com desconto primeiro e aumento depois, o fator é o mesmo, pois a multiplicação comuta. Mas a base intermediária é diferente, e os valores em reais de cada etapa mudam.",
     "A comutatividade só vale para taxas percentuais. Se uma das mudanças for um valor fixo em reais, como uma taxa de R$ 50,00, a ordem altera o resultado: desconto de 10% sobre R$ 500,00 seguido de taxa fixa de R$ 50,00 resulta em R$ 500,00, enquanto a taxa antes do desconto resulta em R$ 495,00. Nos enunciados, o texto costuma indicar a ordem com palavras como 'em seguida' e 'sobre o valor já reajustado'. Siga a ordem do texto e a base indicada em cada etapa, mesmo quando o produto final for o mesmo."
    ],
    "method": [
     "Escreva um fator para cada mudança, na ordem do enunciado (1+i para aumento, 1−d para desconto).",
     "Multiplique os fatores para obter o fator total e compare com 1: maior que 1 é acréscimo, menor é redução.",
     "Para achar o valor final, multiplique o valor inicial pelo fator total; para achar o inicial, divida o final pelo fator total.",
     "Para a variação total, calcule fator total − 1 e escreva em porcentagem; confira com um valor-teste como 100."
    ],
    "workedExamples": [
     {
      "prompt": "O preço de uma licença de software era R$ 800,00. Subiu 30% e, depois, sofreu desconto de 30% sobre o preço já aumentado. Qual é o preço final e qual é a variação percentual em relação a R$ 800,00?",
      "steps": [
       "Após o aumento: 800×1,30 = R$ 1.040,00.",
       "Após o desconto de 30% sobre R$ 1.040,00: 1.040×0,70 = R$ 728,00.",
       "Fator total: 1,30×0,70 = 0,91.",
       "Variação: 728/800 = 0,91, queda de 9% sobre a base de R$ 800,00."
      ],
      "answer": "R$ 728,00, com queda de 9%."
     },
     {
      "prompt": "Um material teve aumento de 20% e, depois, desconto de 15% sobre o valor aumentado, chegando a R$ 2.040,00. Qual era o preço antes do aumento? Qual foi a variação percentual total?",
      "steps": [
       "Fator do aumento: 1,20. Fator do desconto: 0,85. Fator total: 1,20×0,85 = 1,02.",
       "Preço inicial P: P×1,02 = 2.040, logo P = 2.040/1,02 = R$ 2.000,00.",
       "Conferência: 2.000×1,20 = 2.400 e 2.400×0,85 = 2.040.",
       "Variação total sobre a base de 2.000: (2.040 − 2.000)/2.000 = 2%."
      ],
      "answer": "R$ 2.000,00 antes do aumento, com variação total de +2%."
     },
     {
      "prompt": "Um valor sofre dois aumentos sucessivos, de 10% e de 20%. Que desconto percentual único, aplicado ao valor final, o devolve ao valor inicial? Dê o resultado com duas casas decimais. Depois, confirme usando o valor inicial de R$ 100,00.",
      "steps": [
       "Fator dos aumentos: 1,10×1,20 = 1,32.",
       "Desconto d tal que 1,32×(1−d) = 1, logo 1−d = 1/1,32 ≈ 0,757576 e d ≈ 0,242424.",
       "Em porcentagem, d ≈ 24,24%.",
       "Confirmação: 100×1,32 = 132; é preciso retirar 32, e 32/132 ≈ 0,2424 = 24,24% (base: valor final de R$ 132,00)."
      ],
      "answer": "Aproximadamente 24,24%."
     }
    ],
    "pitfall": "Achar que aumento de x% seguido de desconto de x% volta ao valor original, ou calcular o valor inicial subtraindo a taxa do valor final. O desconto incide sobre uma base maior, e o inicial se obtém dividindo o final pelo fator total.",
    "tables": [
     {
      "caption": "Que mudança devolve o valor original",
      "headers": [
       "Mudança feita",
       "Fator",
       "Mudança que devolve",
       "Cálculo"
      ],
      "rows": [
       [
        "Aumento de 10%",
        "1,10",
        "Desconto de 9,09%",
        "0,10/1,10"
       ],
       [
        "Aumento de 20%",
        "1,20",
        "Desconto de 16,67%",
        "0,20/1,20"
       ],
       [
        "Aumento de 25%",
        "1,25",
        "Desconto de 20%",
        "0,25/1,25"
       ],
       [
        "Aumento de 50%",
        "1,50",
        "Desconto de 33,33%",
        "0,50/1,50"
       ],
       [
        "Aumento de 100%",
        "2",
        "Desconto de 50%",
        "1/2"
       ],
       [
        "Desconto de 20%",
        "0,80",
        "Aumento de 25%",
        "0,20/0,80"
       ]
      ]
     }
    ],
    "resumo": {
     "title": "Variações sucessivas",
     "text": "O efeito total é o produto dos fatores. Para achar o valor inicial, divide-se o final pelo fator total; um desconto de x% após aumento de x% perde x^2 em fração.",
     "bizu": "Aumento e desconto de mesma taxa nunca se anulam: +30% e −30% dão −9%."
    }
   },
   {
    "title": "Lucro e prejuízo sobre o custo e sobre a venda",
    "paragraphs": [
     "Em problemas de comércio, três valores se relacionam: custo (C), preço de venda (V) e lucro (L). A relação básica é V = C + L, e o prejuízo corresponde a L negativo. A dificuldade está na taxa: ela pode ser calculada sobre o custo ou sobre a venda. Na prática, o texto diz 'lucro de 25% sobre o custo' ou 'lucro de 20% sobre a venda', e cada frase leva a uma conta diferente. Quando o enunciado diz apenas 'lucro de 25%', o padrão usual é a base de custo, mas o ideal é que o enunciado deixe isso claro.",
     "Se o lucro é i sobre o custo, então L = i×C e V = C×(1+i); para obter o custo a partir da venda, divide-se por (1+i). Se o lucro é j sobre a venda, então L = j×V e C = V×(1−j); para obter a venda a partir do custo, divide-se por (1−j). Em ambos os casos, a conta é a de um fator: no primeiro, o fator (1+i) leva do custo à venda; no segundo, o fator (1−j) leva da venda ao custo. Isso é a mesma ideia de acréscimo e desconto, aplicada a nomes novos.",
     "Para converter entre as duas bases, use as relações j = i/(1+i) e i = j/(1−j). Um lucro de 25% sobre o custo equivale a 0,25/1,25 = 20% sobre a venda; um lucro de 20% sobre a venda equivale a 0,20/0,80 = 25% sobre o custo. Isso se vê com números: custo R$ 80,00 e venda R$ 100,00 dão lucro de R$ 20,00, que é 25% de 80 e 20% de 100. O lucro em reais é o mesmo, e só o denominador muda."
    ],
    "example": "Exemplo resolvido: custo R$ 80,00 e venda R$ 100,00. Lucro = 100 − 80 = 20. Sobre o custo: 20/80 = 25%. Sobre a venda: 20/100 = 20%.",
    "development": [
     "No prejuízo, a lógica é a mesma, com sinal trocado. Se há prejuízo de p sobre o custo, V = C×(1−p). Se o prejuízo é q sobre a venda, então C = V×(1+q), pois o custo supera a venda no valor do prejuízo. Por exemplo: vender por R$ 900,00 com prejuízo de 10% sobre a venda significa que o custo foi 900×1,10 = R$ 990,00 e o prejuízo foi R$ 90,00, que equivale a 90/990, ou 9,09%, do custo. Note como a taxa muda com a base.",
     "Quando há mais de um produto, não se pode somar nem tirar a média das taxas. Calcule o custo e a venda de cada item, some os custos e as vendas e só depois divida o lucro (ou prejuízo) total pela base pedida. Vender dois itens pelo mesmo preço, um com lucro de 20% e outro com prejuízo de 20% (ambos sobre o custo), gera prejuízo no total, porque o item com prejuízo tinha custo maior. A taxa de cada item incide sobre um custo diferente, e é isso que quebra a intuição de que 'um compensa o outro'."
    ],
    "method": [
     "Identifique a base da taxa: custo ou venda.",
     "Escreva a relação: V = C×(1+i) para lucro sobre o custo; C = V×(1−j) para lucro sobre a venda.",
     "Calcule o valor que falta (custo ou venda) e o lucro em reais (V − C).",
     "Se a pergunta pedir a outra base, divida o mesmo lucro em reais pelo custo ou pela venda, conforme o caso."
    ],
    "workedExamples": [
     {
      "prompt": "Um comerciante comprou um lote por R$ 360,00 e o revendeu com lucro de 25% sobre o custo. Qual foi o preço de venda e qual o percentual de lucro sobre a venda?",
      "steps": [
       "Venda: V = 360×1,25 = R$ 450,00.",
       "Lucro em reais: 450 − 360 = R$ 90,00.",
       "Sobre o custo: 90/360 = 25% (confere com o enunciado).",
       "Sobre a venda: 90/450 = 0,20 = 20%."
      ],
      "answer": "Venda por R$ 450,00; o lucro é 20% da venda."
     },
     {
      "prompt": "Um equipamento foi vendido por R$ 1.200,00, com lucro de 20% sobre o preço de venda. Qual foi o custo e qual o percentual de lucro sobre o custo?",
      "steps": [
       "Lucro: 20% de 1.200 = R$ 240,00.",
       "Custo: 1.200 − 240 = R$ 960,00 (equivale a 1.200×0,80).",
       "Lucro sobre o custo: 240/960 = 0,25 = 25%.",
       "Conferência pela relação i = j/(1−j) = 0,20/0,80 = 0,25."
      ],
      "answer": "Custo de R$ 960,00; o lucro é 25% do custo."
     },
     {
      "prompt": "Duas peças foram vendidas por R$ 600,00 cada. Na primeira, houve lucro de 20% sobre o custo; na segunda, prejuízo de 20% sobre o custo. Houve lucro ou prejuízo no total? De quanto, em reais, e qual o percentual sobre o custo total e sobre a venda total?",
      "steps": [
       "Primeira peça: C1×1,20 = 600, logo C1 = 600/1,20 = R$ 500,00.",
       "Segunda peça: C2×0,80 = 600, logo C2 = 600/0,80 = R$ 750,00.",
       "Custo total: 500 + 750 = R$ 1.250,00; venda total: 2×600 = R$ 1.200,00; resultado: 1.200 − 1.250 = −R$ 50,00 (prejuízo).",
       "Sobre o custo total: 50/1.250 = 4%. Sobre a venda total: 50/1.200 ≈ 4,17%."
      ],
      "answer": "Prejuízo de R$ 50,00, que equivale a 4% do custo total e a cerca de 4,17% da venda total."
     }
    ],
    "pitfall": "Trocar a base da taxa: para lucro de 25% sobre o custo, a venda é o custo × 1,25; dividir o custo por 0,75 corresponde a um lucro de 25% sobre a venda, que é outra situação (venda = custo × 1,3333...). Além disso, não some taxas de itens diferentes: some os valores em reais e divida pela base correta.",
    "tables": [
     {
      "caption": "Mesmo lucro, bases diferentes",
      "headers": [
       "Lucro sobre o custo",
       "Lucro sobre a venda",
       "Exemplo (custo → venda)"
      ],
      "rows": [
       [
        "20%",
        "16,67%",
        "R$ 100,00 → R$ 120,00"
       ],
       [
        "25%",
        "20%",
        "R$ 80,00 → R$ 100,00"
       ],
       [
        "50%",
        "33,33%",
        "R$ 100,00 → R$ 150,00"
       ],
       [
        "100%",
        "50%",
        "R$ 100,00 → R$ 200,00"
       ]
      ]
     }
    ],
    "resumo": {
     "title": "Lucro e prejuízo",
     "text": "Lucro sobre o custo: V = C×(1+i). Lucro sobre a venda: C = V×(1−j). O lucro em reais é o mesmo; muda só a base da taxa.",
     "bizu": "Primeiro ache C e V em reais; só depois calcule a taxa sobre a base pedida."
    }
   },
   {
    "title": "Comparação de taxas, juros simples e leitura de enunciados",
    "paragraphs": [
     "Comparar taxas exige distinguir ponto percentual de variação percentual. Se a taxa de pendência de processos cai de 40% para 34%, ela diminuiu 6 pontos percentuais, que é a diferença direta entre as taxas. Já a variação relativa é 6/40 = 15% de queda, pois a base da comparação é a taxa inicial. Se a taxa sobe de 34% para 40%, a diferença continua sendo de 6 pontos, mas a variação relativa agora é 6/34 ≈ 17,65%, porque a base passou a ser 34%. Por isso, sempre que alguém disser que 'subiu X%' sem mais detalhes, pergunte qual foi a base.",
     "Juros simples são uma aplicação direta de porcentagem. O juro é calculado sempre sobre o capital inicial C, com taxa i por período e t períodos: J = C×i×t, e o montante é M = C + J = C×(1 + i×t). A taxa não incide sobre os juros acumulados, de modo que o valor cresce em progressão aritmética e não em fatores sucessivos. Uma multa de R$ 2.500,00 com juros simples de 1,5% ao mês durante 4 meses rende J = 2.500×0,015×4 = R$ 150,00, e o montante é R$ 2.650,00. A taxa total do período é 1,5%×4 = 6% sobre a base de R$ 2.500,00.",
     "A leitura do enunciado é metade do problema. Observe as palavras que indicam a base: 'sobre o preço de tabela', 'do total', 'a mais que', 'em relação ao ano anterior', 'do que sobrou'. A taxa só faz sentido quando está associada a uma base, e basta trocar a base para o resultado mudar. Por isso, antes de contar, escreva a frase em forma de equação: parte = taxa × base, com a base explicitamente nomeada. E confira a razoabilidade: um desconto de 30% sobre uma base positiva nunca pode resultar em valor negativo; uma parte de um conjunto nunca excede 100% do conjunto."
    ],
    "example": "Exemplo resolvido: uma taxa passa de 40% para 46%. Diferença: 6 pontos percentuais. Variação relativa: 6/40 = 15%.",
    "development": [
     "Comparar juros simples e compostos ajuda a ver a diferença entre soma e produto. Com 2% ao mês durante 3 meses, os juros simples somam 6% sobre o capital inicial. Nos juros compostos, o fator é 1,02^3 = 1,061208, ou seja, 6,1208%. A diferença parece pequena para períodos curtos, mas cresce com o tempo. O enunciado indica o regime com expressões como 'juros simples' ou 'taxa sobre o capital inicial'. Aqui o foco é a leitura da taxa e da base, e o regime composto fica como contraste.",
     "Outros enunciados exigem escolher entre taxa mensal e total. Se o texto diz '1,5% ao mês', a taxa de 1,5% se refere a cada mês, e o prazo em meses entra na fórmula. Se o texto diz 'taxa total de 6% em 4 meses', então 6% já é o acumulado e não deve ser multiplicado novamente. Atenção também às unidades: 'ao ano' com prazo em meses exige converter o prazo para anos (por exemplo, 8 meses = 8/12 de ano) ou a taxa para meses. A conversão mais simples em juros simples é dividir a taxa anual por 12."
    ],
    "method": [
     "Nomeie a base de cada percentual do enunciado (capital, taxa inicial, total, preço de tabela).",
     "Decida se a comparação é de taxas (pontos percentuais: subtraia) ou de valores (variação relativa: diferença dividida pela base inicial).",
     "Em juros simples, calcule J = C×i×t com i e t na mesma unidade de tempo, e depois M = C + J.",
     "Confira a razoabilidade: a taxa total do período em juros simples é i×t, e o montante é maior que o capital."
    ],
    "workedExamples": [
     {
      "prompt": "A taxa de congestionamento de uma vara passou de 40% para 46% em um ano. Calcule a variação em pontos percentuais e a variação relativa. Se depois ela voltar de 46% para 40%, qual será a variação relativa dessa queda?",
      "steps": [
       "Diferença entre as taxas: 46 − 40 = 6 pontos percentuais.",
       "Variação relativa do aumento, com base de 40%: 6/40 = 0,15 = 15%.",
       "Na volta, a diferença continua sendo de 6 pontos, mas a base passa a ser 46%: 6/46 ≈ 0,1304.",
       "A queda relativa é de aproximadamente 13,04%, menor que 15% porque a base é maior."
      ],
      "answer": "Aumento de 6 pontos percentuais (15% relativos); na volta, queda de cerca de 13,04%."
     },
     {
      "prompt": "Uma multa de R$ 2.500,00 ficou em atraso por 4 meses e sofre juros simples de 1,5% ao mês, calculados sobre o valor original. Calcule os juros, o montante e a taxa total do período.",
      "steps": [
       "Juros: J = 2.500×0,015×4 = R$ 150,00.",
       "Montante: 2.500 + 150 = R$ 2.650,00.",
       "Taxa total do período: 1,5%×4 = 6%, e 6% de 2.500 = 150, o que confirma.",
       "Fator do período: 1 + 0,015×4 = 1,06, e 2.500×1,06 = 2.650."
      ],
      "answer": "Juros de R$ 150,00; montante de R$ 2.650,00; taxa total de 6%."
     },
     {
      "prompt": "Um capital foi aplicado a juros simples de 2% ao mês durante 8 meses e rendeu R$ 640,00 de juros. Qual era o capital e qual o montante? Para contraste, qual seria o juro se a mesma taxa fosse composta mensalmente no mesmo prazo? (Use duas casas decimais.)",
      "steps": [
       "Taxa total em 8 meses: 2%×8 = 16%. Então 0,16×C = 640.",
       "Capital: C = 640/0,16 = R$ 4.000,00. Montante: 4.000 + 640 = R$ 4.640,00.",
       "Contraste no regime composto: fator 1,02^8 ≈ 1,171659.",
       "Juro composto: 4.000×(1,171659 − 1) ≈ R$ 686,64, maior que os R$ 640,00 do regime simples."
      ],
      "answer": "Capital de R$ 4.000,00 e montante de R$ 4.640,00; no regime composto o juro seria de cerca de R$ 686,64."
     }
    ],
    "pitfall": "Chamar de 'aumento de 6%' uma mudança de 40% para 46% (são 6 pontos percentuais), ou aplicar a taxa de juros simples sobre o montante já acumulado. Em juros simples, a base é sempre o capital inicial.",
    "tables": [
     {
      "caption": "Que base usar em cada expressão",
      "headers": [
       "Expressão do enunciado",
       "Base de cálculo"
      ],
      "rows": [
       [
        "X% do total",
        "O total do conjunto"
       ],
       [
        "X% a mais que B",
        "O valor B (resultado = (1 + X/100) vezes B)"
       ],
       [
        "X% sobre o preço de tabela",
        "O preço de tabela"
       ],
       [
        "Variação em relação ao ano anterior",
        "O valor do ano anterior"
       ],
       [
        "Juros simples de X% ao mês",
        "O capital inicial, em todos os meses"
       ],
       [
        "X pontos percentuais",
        "Não há base: é a diferença entre duas taxas"
       ]
      ]
     }
    ],
    "resumo": {
     "title": "Taxas, juros simples e leitura",
     "text": "Ponto percentual é diferença entre taxas; variação relativa divide a diferença pela taxa inicial. Em juros simples, J = C×i×t sobre o capital inicial.",
     "bizu": "Sempre pergunte: percentual de quê? Sem a base, a taxa não tem valor."
    }
   }
  ]
 },
 "M13": {
  "extras": [
   {
    "capitulo": 1,
    "development": [
     "Uma tabela de dupla entrada guarda mais informação do que parece, porque as margens (os totais de linhas e colunas) permitem reconstruir células que faltam. Se você conhece o total geral, um total de linha e um total de coluna, e mais uma célula, as demais saem por subtração: cada célula é o total da linha menos as outras células da mesma linha. Esse raciocínio é muito cobrado quando o enunciado entrega só parte da tabela. Antes de calcular, confira se a soma das linhas fecha com a soma das colunas; se não fechar, você leu algum número errado.",
     "As expressões do enunciado indicam o denominador. “Dos processos eletrônicos, quantos são da vara X” pede a divisão pelo total da coluna dos eletrônicos. “Entre os processos da vara X, quantos são eletrônicos” pede o total da linha da vara X. “Do total de processos” pede o total geral. Sublinhe o trecho depois de “dos”, “entre os” ou “dentre os”: ele diz qual é o grupo de referência, isto é, a base de cálculo. Trocar a base muda a resposta, mesmo usando a mesma célula no numerador."
    ],
    "workedExamples": [
     {
      "prompt": "Três varas distribuíram 450 processos no mês: Cível (200), Criminal (150) e Família (100). Desse total, 120 da Cível, 90 da Criminal e 70 da Família tramitam em meio eletrônico; os demais são físicos. (a) Qual o percentual de processos eletrônicos no total? (b) Qual vara tem a maior taxa de processos eletrônicos dentro dela? (c) Dos processos eletrônicos, que percentual é da Cível?",
      "steps": [
       "Monte a tabela completa: eletrônicos 120, 90 e 70; físicos 200−120=80, 150−90=60 e 100−70=30. Total de eletrônicos: 120+90+70=280; total de físicos: 80+60+30=170; 280+170=450, igual ao total geral.",
       "(a) Base: total geral. 280/450=0,6222…, isto é, cerca de 62,2%.",
       "(b) Base: o total de cada vara. Cível: 120/200=60%; Criminal: 90/150=60%; Família: 70/100=70%. A maior taxa é a da Família.",
       "(c) Base: o total de eletrônicos (280). 120/280=0,4286, isto é, cerca de 42,9%. Note que a Cível tem taxa interna de 60%, mas responde por 42,9% dos eletrônicos, porque as bases são diferentes."
      ],
      "answer": "(a) cerca de 62,2%; (b) Família, com 70%; (c) cerca de 42,9%."
     },
     {
      "prompt": "Uma unidade tem 80 servidores, divididos por turno (manhã ou tarde) e por cargo (analista ou técnico). Sabe-se que 48 trabalham pela manhã, 50 são analistas e 30 dos analistas trabalham pela manhã. Quantos técnicos trabalham à tarde? Qual percentual dos servidores da tarde é de técnicos? E qual percentual dos técnicos trabalha à tarde?",
      "steps": [
       "Totais de linhas e colunas: manhã 48, tarde 80−48=32; analistas 50, técnicos 80−50=30.",
       "Analistas da manhã: 30 (dado). Técnicos da manhã: 48−30=18.",
       "Técnicos da tarde: total de técnicos menos técnicos da manhã, 30−18=12. Analistas da tarde: 50−30=20. Conferência: 20+12=32, igual ao total da tarde.",
       "Técnicos entre os servidores da tarde (base 32): 12/32=0,375=37,5%.",
       "Técnicos que trabalham à tarde, entre todos os técnicos (base 30): 12/30=0,40=40%."
      ],
      "answer": "12 técnicos trabalham à tarde; eles são 37,5% dos servidores da tarde e 40% de todos os técnicos."
     }
    ],
    "tables": [
     {
      "caption": "Processos distribuídos por vara e meio de tramitação",
      "headers": [
       "Vara",
       "Eletrônico",
       "Físico",
       "Total"
      ],
      "rows": [
       [
        "Cível",
        120,
        80,
        200
       ],
       [
        "Criminal",
        90,
        60,
        150
       ],
       [
        "Família",
        70,
        30,
        100
       ],
       [
        "Total",
        280,
        170,
        450
       ]
      ]
     }
    ]
   },
   {
    "capitulo": 2,
    "development": [
     "A frequência relativa é uma proporção e, por isso, vive entre 0 e 1 (ou entre 0% e 100%). Isso gera dois testes de sanidade muito úteis: nenhuma frequência relativa pode passar de 100%, e a soma de todas deve ser 100%. Quando o enunciado dá apenas algumas porcentagens, a que falta é o complemento: 100% menos a soma das conhecidas. E, se você conhece a frequência absoluta de uma categoria e a respectiva porcentagem, o total sai por divisão: n = frequência absoluta ÷ frequência relativa. Esse é o caminho inverso da definição e costuma ser o ponto de partida dos problemas de reconstrução.",
     "A frequência acumulada responde perguntas do tipo “até”, “no máximo”, “menos de” e, por complemento, “pelo menos” e “mais de”. Se a acumulada até o valor 1 é 26 em um total de 40, então “pelo menos 2” é 40−26=14, sem precisar somar as categorias restantes. Cuidado com a fronteira: “até 2 inclusive” usa a acumulada em 2; “menos de 2” usa a acumulada em 1, quando os valores são inteiros. A leitura das palavras decide qual linha da tabela você deve usar."
    ],
    "workedExamples": [
     {
      "prompt": "Em 40 processos, contou-se quantas vezes a audiência foi remarcada: 0 vez em 14 processos, 1 vez em 12, 2 vezes em 8, 3 vezes em 4 e 4 vezes em 2. Monte a tabela com frequências relativas e acumuladas e responda: quantos processos tiveram pelo menos 2 remarcações e qual a porcentagem deles?",
      "steps": [
       "Confira o total: 14+12+8+4+2=40.",
       "Frequências relativas (divida por 40): 14/40=35%; 12/40=30%; 8/40=20%; 4/40=10%; 2/40=5%. Soma: 100%.",
       "Frequências acumuladas: 14; 14+12=26; 26+8=34; 34+4=38; 38+2=40. Em porcentagem: 35%, 65%, 85%, 95% e 100%.",
       "“Pelo menos 2” é o complemento de “no máximo 1”. No máximo 1 remarcação: 26 processos. Logo, 40−26=14 processos, ou 100%−65%=35%.",
       "Conferência direta: 8+4+2=14."
      ],
      "answer": "14 processos, isto é, 35% do total."
     },
     {
      "prompt": "Em uma distribuição com 4 categorias (A, B, C e D), a frequência relativa de A é 10%, a de B é 25% e a de D é 15%. A frequência absoluta de B é 30. Determine o total de observações, as frequências absolutas de A, C e D e a frequência acumulada percentual até C, na ordem A, B, C, D.",
      "steps": [
       "Frequência relativa de C: 100%−10%−25%−15%=50%.",
       "Total: n = frequência absoluta de B ÷ frequência relativa de B = 30÷0,25=120.",
       "Absolutas: A=0,10×120=12; C=0,50×120=60; D=0,15×120=18. Conferência: 12+30+60+18=120.",
       "Acumulada percentual até C: 10%+25%+50%=85%. Em quantidade: 12+30+60=102, e 102/120=0,85."
      ],
      "answer": "n=120; A=12, C=60 e D=18; acumulada percentual até C igual a 85%."
     }
    ],
    "tables": [
     {
      "caption": "Remarcações de audiência em 40 processos",
      "headers": [
       "Remarcações",
       "Frequência",
       "Relativa",
       "Acumulada",
       "Acumulada %"
      ],
      "rows": [
       [
        0,
        14,
        "35%",
        14,
        "35%"
       ],
       [
        1,
        12,
        "30%",
        26,
        "65%"
       ],
       [
        2,
        8,
        "20%",
        34,
        "85%"
       ],
       [
        3,
        4,
        "10%",
        38,
        "95%"
       ],
       [
        4,
        2,
        "5%",
        40,
        "100%"
       ]
      ]
     }
    ]
   },
   {
    "capitulo": 3,
    "development": [
     "Variação percentual compara dois valores da mesma grandeza: (valor final − valor inicial) ÷ valor inicial. A base é sempre o valor inicial, isto é, o do período anterior. Por isso, uma alta de 20% seguida de uma queda de 20% não devolve o valor original: a queda incide sobre um valor maior. Em série com vários períodos, as variações não se somam; elas se multiplicam, na forma de fatores (1+20% vira 1,20; 1−5% vira 0,95). Somar taxas só funciona como aproximação, e apenas quando elas são pequenas.",
     "No gráfico de setores, vale a ideia de que o círculo é uma conta de proporção: 360° correspondem ao total (100%). Cada grau equivale a 1/360 do total, e cada 1% equivale a 3,6°. Dois caminhos levam ao mesmo resultado: ângulo ÷ 360° dá a fração; fração × 360° dá o ângulo. Se o total mudar de um período para o outro, o ângulo do mesmo setor pode diminuir mesmo que a quantidade aumente. Isso acontece porque o ângulo mede participação, não quantidade."
    ],
    "workedExamples": [
     {
      "prompt": "O número de processos distribuídos em um tribunal foi de 2.000 em 2021, 2.400 em 2022 e 2.280 em 2023. Calcule a variação percentual de 2021 para 2022, de 2022 para 2023 e de 2021 para 2023. Por que a última não é a soma das duas primeiras?",
      "steps": [
       "2021 para 2022: (2.400−2.000)/2.000=400/2.000=0,20, isto é, alta de 20%.",
       "2022 para 2023: (2.280−2.400)/2.400=−120/2.400=−0,05, isto é, queda de 5%.",
       "2021 para 2023: (2.280−2.000)/2.000=280/2.000=0,14, isto é, alta de 14%.",
       "Pelos fatores: 1,20×0,95=1,14, o que confirma 14%. A soma 20%−5%=15% erra porque a queda de 5% incide sobre 2.400, e não sobre 2.000."
      ],
      "answer": "+20%, −5% e +14%. A variação total é o produto dos fatores (1,20×0,95=1,14), não a soma das taxas."
     },
     {
      "prompt": "Um gráfico de setores mostra a composição das 1.200 sentenças proferidas em um ano. O setor A tem ângulo de 54°; o setor B tem ângulo igual ao dobro do de A; o setor C é o restante do círculo. (a) Quantas sentenças e que porcentagem correspondem a cada setor? (b) No ano seguinte, A passou a ter 234 sentenças em um total de 1.300. Qual o novo ângulo de A?",
      "steps": [
       "Ângulos: A=54°; B=2×54°=108°; C=360°−54°−108°=198°.",
       "Frações do círculo: A=54/360=0,15 (15%); B=108/360=0,30 (30%); C=198/360=0,55 (55%).",
       "Quantidades: A=0,15×1.200=180; B=0,30×1.200=360; C=0,55×1.200=660. Soma: 180+360+660=1.200.",
       "Ano seguinte: participação de A=234/1.300=0,18 (18%). Novo ângulo: 0,18×360°=64,8°.",
       "Observação: a quantidade de A subiu de 180 para 234, e o ângulo subiu de 54° para 64,8°, porque a participação passou de 15% para 18%."
      ],
      "answer": "(a) A=180 (15%), B=360 (30%) e C=660 (55%); (b) 64,8°."
     }
    ],
    "tables": [
     {
      "caption": "Processos distribuídos por ano",
      "headers": [
       "Ano",
       "Distribuídos",
       "Variação sobre o ano anterior"
      ],
      "rows": [
       [
        2021,
        "2.000",
        "—"
       ],
       [
        2022,
        "2.400",
        "+20%"
       ],
       [
        2023,
        "2.280",
        "−5%"
       ]
      ]
     }
    ]
   },
   {
    "capitulo": 4,
    "development": [
     "Para construir ou ler um histograma, três medidas aparecem o tempo todo. A amplitude de uma classe é o limite superior menos o inferior; o ponto médio é a média dos dois limites; e a frequência da classe é o número de observações que caem nela. O ponto médio funciona como representante da classe quando só se tem os dados agrupados: ao multiplicar cada ponto médio pela respectiva frequência e dividir por n, obtém-se uma estimativa da média, não a média exata, porque os valores originais dentro de cada classe foram perdidos.",
     "Quando as classes têm larguras diferentes, o histograma só é fiel se a área de cada barra for proporcional à frequência. A altura passa a ser a densidade: frequência dividida pela largura. Uma classe larga e baixa pode reunir mais observações do que uma classe estreita e alta. Dentro de uma classe, costuma-se supor que os valores se distribuem de modo uniforme; com essa hipótese, uma parte do intervalo contém a parte proporcional da frequência. Sempre que o enunciado autorizar essa suposição, use regra de três com as larguras."
    ],
    "workedExamples": [
     {
      "prompt": "O tempo de tramitação de 40 recursos foi agrupado em classes de 5 dias: [0,5) com 8 recursos; [5,10) com 14; [10,15) com 10; [15,20) com 6 e [20,25) com 2. Determine a classe modal, o percentual de recursos com menos de 10 dias e a estimativa da média usando os pontos médios.",
      "steps": [
       "Total: 8+14+10+6+2=40. A classe modal é a de maior frequência: [5,10), com 14 recursos.",
       "Menos de 10 dias: classes [0,5) e [5,10): 8+14=22 recursos. 22/40=0,55, isto é, 55%.",
       "Pontos médios: 2,5; 7,5; 12,5; 17,5; 22,5.",
       "Soma ponderada: 2,5×8=20; 7,5×14=105; 12,5×10=125; 17,5×6=105; 22,5×2=45. Total: 20+105+125+105+45=400.",
       "Média estimada: 400/40=10 dias. Como os valores reais dentro das classes são desconhecidos, 10 dias é uma estimativa."
      ],
      "answer": "Classe modal [5,10); 55% com menos de 10 dias; média estimada de 10 dias."
     },
     {
      "prompt": "Um histograma tem as classes [0,10) com 30 observações, [10,20) com 50, [20,40) com 60 e [40,80) com 40, desenhado com densidade de frequência (altura = frequência ÷ largura). Calcule as alturas das barras, indique qual barra é mais alta e qual classe tem mais observações, e determine a porcentagem de observações menores que 40.",
      "steps": [
       "Larguras: 10, 10, 20 e 40. Total de observações: 30+50+60+40=180.",
       "Alturas (densidades): 30/10=3; 50/10=5; 60/20=3; 40/40=1.",
       "A barra mais alta é a de [10,20), com altura 5; mas a classe com mais observações é [20,40), com 60. As duas barras de altura 3 e de largura 10 e 20 mostram que a mesma altura pode representar frequências diferentes.",
       "Observações menores que 40: 30+50+60=140. Porcentagem: 140/180=0,7778, isto é, cerca de 77,8%.",
       "Conferência pelas áreas: 3×10=30; 5×10=50; 3×20=60; 1×40=40."
      ],
      "answer": "Alturas 3, 5, 3 e 1; a barra mais alta é [10,20), mas a classe mais numerosa é [20,40); cerca de 77,8% das observações são menores que 40."
     }
    ],
    "tables": [
     {
      "caption": "Tempo de tramitação de 40 recursos",
      "headers": [
       "Classe (dias)",
       "Ponto médio",
       "Frequência",
       "Frequência × ponto médio"
      ],
      "rows": [
       [
        "[0,5)",
        "2,5",
        8,
        20
       ],
       [
        "[5,10)",
        "7,5",
        14,
        105
       ],
       [
        "[10,15)",
        "12,5",
        10,
        125
       ],
       [
        "[15,20)",
        "17,5",
        6,
        105
       ],
       [
        "[20,25)",
        "22,5",
        2,
        45
       ]
      ]
     }
    ]
   },
   {
    "capitulo": 5,
    "development": [
     "Um percentual nunca vem sozinho: ele sempre tem uma base. “60% de satisfação” significa algo muito diferente se a base são 10 ou 1.000 pessoas. Por isso, comparar percentuais de grupos de tamanhos diferentes não permite concluir sobre quantidades, e comparar quantidades não permite concluir sobre taxas. Quando a afirmação fala em “maior número”, procure a quantidade absoluta; quando fala em “maior proporção” ou “maior taxa”, procure o percentual. Se o dado necessário não aparece no gráfico, a conclusão não pode ser confirmada.",
     "Outra armadilha é confundir pontos percentuais com variação percentual. Passar de 20% para 25% é um aumento de 5 pontos percentuais (diferença simples entre as duas taxas), mas é uma variação relativa de 25% (5÷20). O inverso também vale: passar de 25% para 20% é queda de 5 pontos percentuais, mas de apenas 20% em termos relativos (5÷25). A palavra “pontos” indica subtração das taxas; a palavra “por cento” sozinha, em uma variação, indica divisão pelo valor inicial."
    ],
    "workedExamples": [
     {
      "prompt": "A Vara X tinha 150 processos em andamento e, desses, 80% estavam sem decisão há mais de 90 dias. A Vara Y tinha 400 processos em andamento e 60% estavam nessa situação. Qual vara tem a maior taxa de atraso e qual tem o maior número de processos atrasados? A conclusão “a Vara X tem mais processos atrasados” é sustentada?",
      "steps": [
       "Vara X: 0,80×150=120 processos atrasados.",
       "Vara Y: 0,60×400=240 processos atrasados.",
       "Taxa de atraso: X tem 80% e Y tem 60%; portanto, X tem a maior taxa.",
       "Quantidade: Y tem 240 contra 120 de X; Y tem o dobro de processos atrasados.",
       "Logo, a conclusão “X tem mais processos atrasados” não é sustentada, apesar de a taxa de X ser maior. Para comparar quantidades, é preciso conhecer as bases."
      ],
      "answer": "X tem a maior taxa (80%), mas Y tem o maior número de atrasados (240 contra 120). A conclusão não é sustentada."
     },
     {
      "prompt": "Em um levantamento, a proporção de recursos providos passou de 20% em 2023 para 25% em 2024. Calcule a variação em pontos percentuais e a variação percentual relativa. Em seguida, calcule as mesmas medidas supondo o caminho inverso, de 25% para 20%, e explique a diferença.",
      "steps": [
       "De 20% para 25%: diferença de 25−20=5 pontos percentuais.",
       "Variação relativa: 5/20=0,25, isto é, aumento de 25% sobre a taxa inicial.",
       "De 25% para 20%: diferença de 20−25=−5 pontos percentuais (queda de 5 pontos).",
       "Variação relativa: −5/25=−0,20, isto é, queda de 20% sobre a taxa inicial.",
       "A diferença em pontos é a mesma (5), mas a base muda (20 no primeiro caso, 25 no segundo), e por isso as variações relativas diferem (25% e 20%)."
      ],
      "answer": "Alta de 5 pontos percentuais e de 25% relativos; no caminho inverso, queda de 5 pontos percentuais e de 20% relativos."
     }
    ],
    "tables": [
     {
      "caption": "Taxa e quantidade de processos atrasados",
      "headers": [
       "Vara",
       "Em andamento",
       "Taxa de atraso",
       "Atrasados"
      ],
      "rows": [
       [
        "X",
        150,
        "80%",
        120
       ],
       [
        "Y",
        400,
        "60%",
        240
       ]
      ]
     }
    ]
   }
  ],
  "novosCapitulos": [
   {
    "title": "Tabelas de frequência: absoluta, relativa, acumulada e percentual",
    "paragraphs": [
     "Uma tabela de frequências transforma uma lista de dados brutos em uma visão organizada. Você lista os valores (ou categorias) distintos, conta quantas vezes cada um aparece e apresenta o resultado em colunas. A frequência absoluta é a contagem. A frequência relativa é a contagem dividida pelo total de observações n, e a frequência percentual é a relativa multiplicada por 100. A frequência acumulada soma as contagens da primeira linha até a linha atual. Cada coluna responde a uma pergunta diferente: quantas, qual fração, quanto por cento e quantas até aqui.",
     "Construir a tabela é um processo de contar sem deixar ninguém de fora e sem contar ninguém duas vezes. Por isso, a primeira conferência é sempre a mesma: a soma das frequências absolutas tem de ser igual a n, e a última acumulada também. Se esse teste falhar, algum dado foi perdido ou repetido. Em seguida, confira as relativas: somam 1 (ou 100%), com pequena diferença admitida quando você arredonda. Para marcar cada dado conforme conta, risque-o da lista; assim, a contagem fica rastreável.",
     "Os valores devem ser ordenados quando houver ordem natural (0, 1, 2, 3…, ou faixas de idade). Só nesse caso a frequência acumulada faz sentido. Em categorias sem ordem, como o tipo de ação, a acumulada depende de uma ordem arbitrária. Para calcular a acumulada percentual, some as frequências absolutas e divida por n no final; não some percentuais já arredondados, porque os erros de arredondamento se acumulam."
    ],
    "example": "Exemplo resolvido: de 60 protocolos, 15 foram devolvidos por falta de documento. A frequência relativa é 15/60=0,25 e o percentual é 25%; se outros 21 foram devolvidos por erro de preenchimento, a frequência acumulada das duas causas é 15+21=36, ou seja, 36/60=60% dos protocolos.",
    "development": [
     "Há duas formas de ler enunciados com “acumulada”. Na primeira, o dado já vem agrupado e você apenas soma. Na segunda, você tem os dados brutos e precisa construir a tabela do zero, ordenando e contando. Em ambos, as perguntas costumam usar as palavras “até”, “no máximo”, “menos de” e “pelo menos”. As três primeiras se resolvem pela acumulada; “pelo menos” se resolve pelo complemento: n menos a acumulada da linha anterior.",
     "Arredondamento merece atenção. Se três categorias têm a mesma frequência, cada uma é 33,33…% e, com uma casa decimal, aparecem como 33,3%, somando 99,9%. Isso não é erro de contagem: é consequência do arredondamento. Já a acumulada percentual deve ser calculada a partir das contagens exatas. Outro caso comum é a tabela com dados faltantes: use as relações n=soma das absolutas, relativa=absoluta÷n e acumulada=acumulada anterior+absoluta para preencher o que falta, de baixo para cima ou de cima para baixo, conforme o dado disponível."
    ],
    "method": [
     "Liste os valores ou categorias distintos, em ordem quando houver ordem natural, e conte quantas observações existem (n).",
     "Conte as ocorrências de cada valor, riscando os dados já contados, e confira se a soma das frequências absolutas é igual a n.",
     "Calcule a relativa dividindo cada absoluta por n e o percentual multiplicando por 100; confira se a soma é 100%.",
     "Calcule a acumulada somando linha a linha e confirme que a última é n; para “pelo menos”, use o complemento n menos a acumulada anterior."
    ],
    "workedExamples": [
     {
      "prompt": "O número de dias de atraso na entrega de 25 protocolos foi registrado: 2, 1, 0, 3, 1, 2, 2, 1, 0, 1, 4, 2, 1, 3, 2, 0, 1, 2, 2, 3, 1, 0, 2, 1, 2. Construa a tabela de frequências (absoluta, percentual e acumulada) e determine quantos protocolos tiveram atraso de no máximo 2 dias.",
      "steps": [
       "Valores distintos em ordem: 0, 1, 2, 3 e 4. Total de dados: n=25.",
       "Contagem: o 0 aparece 4 vezes; o 1, 8 vezes; o 2, 9 vezes; o 3, 3 vezes; o 4, 1 vez. Soma: 4+8+9+3+1=25.",
       "Percentuais (divida por 25): 4/25=16%; 8/25=32%; 9/25=36%; 3/25=12%; 1/25=4%. Soma: 100%.",
       "Acumuladas: 4; 4+8=12; 12+9=21; 21+3=24; 24+1=25. Em percentual: 16%, 48%, 84%, 96% e 100%.",
       "No máximo 2 dias de atraso: a acumulada até o valor 2, que é 21 protocolos, equivalente a 84%."
      ],
      "answer": "21 protocolos, isto é, 84% do total."
     },
     {
      "prompt": "Em uma pesquisa, 21 servidores foram distribuídos igualmente entre três setores (7 em cada). (a) Calcule os percentuais com uma casa decimal e some-os. (b) Calcule os percentuais acumulados. (c) Explique a diferença entre a soma dos percentuais e 100%.",
      "steps": [
       "Cada setor: 7/21=1/3=0,3333…, ou seja, 33,3% com uma casa decimal.",
       "(a) A soma dos três percentuais arredondados é 33,3%+33,3%+33,3%=99,9%.",
       "(b) Acumuladas pelas contagens exatas: 7/21=33,3%; 14/21=0,6667=66,7%; 21/21=100%. Se somássemos os arredondados, a segunda acumulada seria 66,6%, que difere do valor exato 66,7%.",
       "(c) Os 0,1% que faltam são sobra do arredondamento: 3×0,0333…%=0,1% a menos. As contagens (7+7+7=21) estão corretas."
      ],
      "answer": "Soma dos percentuais arredondados: 99,9%; acumuladas exatas: 33,3%, 66,7% e 100%. A diferença vem do arredondamento."
     },
     {
      "prompt": "Uma tabela de frequências de 80 processos por faixa de duração (A, B, C, D e E, em ordem crescente de tempo) está incompleta. Sabe-se que: a frequência relativa de A é 15%; a frequência acumulada até B é 36; a frequência relativa de C é 25%; a frequência absoluta de D é 14. Determine as frequências absolutas de todas as faixas, a acumulada percentual até C e quantos processos pertencem às faixas posteriores a C.",
      "steps": [
       "Faixa A: 0,15×80=12. Faixa B: acumulada até B menos A, 36−12=24.",
       "Faixa C: 0,25×80=20. Acumulada até C: 36+20=56. Faixa D: 14, e a acumulada até D é 56+14=70.",
       "Faixa E: o que falta para 80, isto é, 80−70=10. Soma conferida: 12+24+20+14+10=80.",
       "Acumulada percentual até C: 56/80=0,70=70%.",
       "Faixas posteriores a C (D e E): 14+10=24 processos, ou 80−56=24, que equivale a 30%."
      ],
      "answer": "A=12, B=24, C=20, D=14 e E=10; acumulada até C de 70%; 24 processos nas faixas posteriores a C."
     }
    ],
    "pitfall": "Somar frequências relativas já arredondadas para obter a acumulada, ou esquecer a conferência de que a soma das absolutas é n. Calcule a acumulada pelas contagens e só arredonde no final; use a soma como teste de erro.",
    "tables": [
     {
      "caption": "Dias de atraso em 25 protocolos",
      "headers": [
       "Dias",
       "Frequência",
       "Percentual",
       "Acumulada",
       "Acumulada %"
      ],
      "rows": [
       [
        0,
        4,
        "16%",
        4,
        "16%"
       ],
       [
        1,
        8,
        "32%",
        12,
        "48%"
       ],
       [
        2,
        9,
        "36%",
        21,
        "84%"
       ],
       [
        3,
        3,
        "12%",
        24,
        "96%"
       ],
       [
        4,
        1,
        "4%",
        25,
        "100%"
       ]
      ]
     }
    ],
    "resumo": {
     "title": "Tabela de frequências",
     "text": "Absoluta é a contagem; relativa é absoluta÷n; percentual é relativa×100; acumulada soma até a linha atual. A soma das absolutas e a última acumulada valem n.",
     "bizu": "“Pelo menos” é n menos a acumulada anterior; calcule a acumulada pelas contagens, não pelos arredondados."
    }
   },
   {
    "title": "Gráficos de barras, colunas, linhas e setores",
    "paragraphs": [
     "Cada tipo de gráfico responde a uma pergunta. Barras (horizontais) e colunas (verticais) comparam categorias: quanto cada vara, setor ou tipo de ação tem. Linhas mostram a evolução de uma grandeza em uma sequência ordenada, em geral no tempo. Setores (a “pizza”) mostram a composição de um todo: que parte cada categoria ocupa. A primeira tarefa em qualquer problema é ler o título, as unidades e os eixos, para transformar o desenho em uma tabela de números. Depois dessa tradução, o problema vira uma conta comum.",
     "Para calcular a variação percentual entre dois períodos, use sempre o valor do período anterior como base: variação = (final − inicial) ÷ inicial. O resultado é positivo quando há crescimento e negativo quando há queda. Se o gráfico de linhas mostra vários períodos, calcule cada variação separadamente, usando como base o período imediatamente anterior. Para saber a variação entre o primeiro e o último ponto, use somente os dois valores extremos, ou multiplique os fatores de cada período, mas nunca some as taxas.",
     "No gráfico de setores, a proporção de cada fatia é o seu ângulo dividido por 360°, e o ângulo é a proporção vezes 360°. Isso equivale a ângulo=porcentagem×360°÷100, ou seja, cada 1% vale 3,6°. Se o gráfico informa o total, a quantidade de cada setor sai de proporção×total. Os setores sempre pertencem a um único total e a um único período; não faz sentido comparar o ângulo de dois gráficos de totais diferentes como se fossem quantidades."
    ],
    "example": "Exemplo resolvido: um gráfico de colunas mostra 80 processos em março e 100 em abril. A variação é (100−80)/80=20/80=25%, e não 20%: a base é o valor de março.",
    "development": [
     "A leitura de valores exige atenção ao que a barra mede: pode ser quantidade, porcentagem ou média. Se o gráfico informa porcentagens, é preciso conhecer o total para obter quantidades. Em barras empilhadas, cada coluna é dividida em partes; a altura total é a soma das partes, e a leitura de cada parte exige subtrair os limites do segmento. Em linhas com duas séries, compare os valores nos mesmos instantes, e não apenas a inclinação visual.",
     "A comparação entre dois valores tem duas formas. A diferença absoluta (100−80=20) diz quanto a mais. A razão (100÷80=1,25) diz quantas vezes. Dizer que A é 25% maior que B significa A=1,25×B; dizer que B é 20% menor que A significa B=0,80×A. Essas duas afirmações descrevem a mesma situação, com bases diferentes. Quando houver participação em um setor e quantidade total, use a regra de três ou a multiplicação direta; quando só houver ângulos, trabalhe com as frações."
    ],
    "method": [
     "Leia título, unidade e eixos; transcreva os valores do gráfico para uma pequena tabela.",
     "Identifique o que a pergunta pede: valor, diferença, razão, variação percentual ou participação em um setor.",
     "Escolha a base correta: o período anterior para a variação, o total do gráfico para a participação.",
     "Calcule com os números da tabela (não com a aparência do desenho) e confira se as participações somam 100% e os ângulos somam 360°."
    ],
    "workedExamples": [
     {
      "prompt": "Um gráfico de barras mostra os processos baixados em um mês por quatro varas: Vara 1, com 120; Vara 2, com 90; Vara 3, com 60; e Vara 4, com 30. Em um gráfico de setores com esses mesmos dados, qual seria a porcentagem e o ângulo de cada vara? Quantas vezes a Vara 1 supera a Vara 4 e por quantos pontos percentuais?",
      "steps": [
       "Total: 120+90+60+30=300.",
       "Participações: 120/300=40%; 90/300=30%; 60/300=20%; 30/300=10%. Soma: 100%.",
       "Ângulos (participação×360°): 0,40×360°=144°; 0,30×360°=108°; 0,20×360°=72°; 0,10×360°=36°. Soma: 360°.",
       "Razão entre Vara 1 e Vara 4: 120/30=4 vezes (ou 40%÷10%=4).",
       "Diferença em pontos percentuais: 40%−10%=30 pontos percentuais."
      ],
      "answer": "Vara 1: 40% e 144°; Vara 2: 30% e 108°; Vara 3: 20% e 72°; Vara 4: 10% e 36°. A Vara 1 tem 4 vezes a Vara 4, diferença de 30 pontos percentuais."
     },
     {
      "prompt": "Um gráfico de linhas mostra o número de petições recebidas por trimestre em um ano: 500 no primeiro, 575 no segundo, 460 no terceiro e 506 no quarto. Calcule a variação percentual entre trimestres consecutivos e entre o primeiro e o quarto trimestre. Por que a variação total não é a soma das variações trimestrais?",
      "steps": [
       "1º para 2º: (575−500)/500=75/500=0,15, isto é, alta de 15%.",
       "2º para 3º: (460−575)/575=−115/575=−0,20, isto é, queda de 20%.",
       "3º para 4º: (506−460)/460=46/460=0,10, isto é, alta de 10%.",
       "1º para 4º: (506−500)/500=6/500=0,012, isto é, alta de 1,2%.",
       "Pelos fatores: 1,15×0,80×1,10=1,012, que confirma +1,2%. A soma 15%−20%+10%=5% erra porque cada taxa tem uma base diferente."
      ],
      "answer": "+15%, −20% e +10% nos trimestres consecutivos; +1,2% do primeiro ao quarto trimestre. As taxas se multiplicam como fatores, não se somam."
     },
     {
      "prompt": "Em 2023, uma unidade recebeu 800 recursos, dos quais 40% eram cíveis. Em 2024, recebeu 1.000 recursos, dos quais 35% eram cíveis. Em gráficos de setores dos dois anos, qual o ângulo do setor cível em cada ano? Houve aumento ou diminuição na quantidade de recursos cíveis, e de quanto?",
      "steps": [
       "Ângulo em 2023: 0,40×360°=144°. Ângulo em 2024: 0,35×360°=126°. O ângulo diminuiu 18°.",
       "Quantidade em 2023: 0,40×800=320 recursos cíveis.",
       "Quantidade em 2024: 0,35×1.000=350 recursos cíveis.",
       "Variação: (350−320)/320=30/320=0,09375, isto é, alta de 9,375%, cerca de 9,4%.",
       "O setor ficou menor porque a participação caiu (de 40% para 35%), mas a quantidade subiu porque o total de recursos cresceu de 800 para 1.000."
      ],
      "answer": "Ângulos de 144° e 126°; a quantidade de recursos cíveis aumentou de 320 para 350 (cerca de 9,4%), embora o ângulo tenha diminuído."
     }
    ],
    "pitfall": "Calcular a variação percentual usando como base o valor mais novo (ou a média) em vez do valor inicial, e somar variações de períodos diferentes. Escreva sempre “final menos inicial, dividido pelo inicial” e, para vários períodos, multiplique os fatores.",
    "tables": [
     {
      "caption": "Petições por trimestre e variação",
      "headers": [
       "Trimestre",
       "Petições",
       "Variação sobre o anterior"
      ],
      "rows": [
       [
        "1º",
        500,
        "—"
       ],
       [
        "2º",
        575,
        "+15%"
       ],
       [
        "3º",
        460,
        "−20%"
       ],
       [
        "4º",
        506,
        "+10%"
       ]
      ]
     }
    ],
    "resumo": {
     "title": "Barras, linhas e setores",
     "text": "Barras comparam categorias; linhas mostram evolução; setores mostram composição. Variação=(final−inicial)÷inicial; ângulo=participação×360°.",
     "bizu": "Variações em sequência se multiplicam (fatores); 1% de setor vale 3,6°."
    }
   },
   {
    "title": "Histogramas e distribuição em classes",
    "paragraphs": [
     "Quando a variável é quantitativa e tem muitos valores diferentes, como o tempo de tramitação em dias, não vale a pena contar valor por valor. Agrupa-se em classes (intervalos) e conta-se quantas observações caem em cada uma. A frequência da classe é essa contagem. O histograma desenha essas frequências como barras encostadas uma na outra, porque os intervalos se sucedem sem lacunas. A leitura é a de uma tabela de frequências, com a vantagem de mostrar o formato da distribuição: onde os dados se concentram e como se espalham.",
     "Três medidas organizam o trabalho. A amplitude total é o maior valor menos o menor. A amplitude de classe (largura) é a amplitude total dividida pelo número de classes desejado, arredondada para cima, de modo que as classes cubram todos os dados. O ponto médio é a soma dos limites dividida por 2 e serve de representante da classe. Por exemplo, a classe [12,21) tem largura 21−12=9 e ponto médio (12+21)/2=16,5. Na notação [a,b), o limite inferior a pertence à classe e o limite superior b não pertence; ele é o primeiro valor da classe seguinte.",
     "Para montar a distribuição, defina os limites começando no menor valor ou um pouco abaixo dele, some a largura para obter cada limite seguinte e distribua os dados. Um dado exatamente igual ao limite entre duas classes vai sempre para a classe de cima, por causa do intervalo fechado à esquerda. Depois, confira se a soma das frequências é n. A partir daí, todo o resto vale como nas outras tabelas: frequência relativa, acumulada, classe modal (a de maior frequência) e estimativas baseadas nos pontos médios."
    ],
    "example": "Exemplo resolvido: com menor valor 3, maior valor 47 e 5 classes, a amplitude total é 47−3=44 e a largura é 44/5=8,8, arredondada para 9. As classes [3,12), [12,21), [21,30), [30,39) e [39,48) cobrem todos os dados.",
    "development": [
     "A escolha do número de classes é prática: poucas classes escondem o formato, e muitas classes deixam o gráfico irregular. Costumam-se usar de 5 a 10 classes. Arredonda-se a largura para cima (e para um número fácil) para que o último limite supere o maior valor observado; por isso, o último limite pode ser maior que o máximo (48, no exemplo, acima de 47). Se a largura calculada coubesse exatamente, o maior dado cairia no limite superior aberto da última classe e ficaria de fora; nesse caso, acrescente uma classe ou aumente a largura.",
     "Quando se perde o dado bruto, sobram só as classes e frequências. Dessas, não se recupera a média exata, mas se estima. O mesmo vale para a mediana e outras medidas. Em histogramas com larguras diferentes, o raciocínio de área é obrigatório; e, dentro de uma classe, supõe-se distribuição uniforme quando o enunciado permite calcular parte do intervalo por proporção. Se a classe [20,40) tem 60 observações, então, com essa suposição, [20,30) teria metade delas (30), pois ocupa metade da largura."
    ],
    "method": [
     "Calcule a amplitude total (maior menos menor) e escolha o número de classes; divida e arredonde a largura para cima.",
     "Monte os limites no formato [a,b), somando a largura a cada limite, de modo que o último limite supere o maior valor.",
     "Conte as observações de cada classe (um valor igual ao limite vai para a classe de cima) e confira se a soma é n.",
     "Calcule frequências relativas e acumuladas, ponto médio e, se as larguras diferirem, a densidade (frequência ÷ largura)."
    ],
    "workedExamples": [
     {
      "prompt": "O tempo de resposta (em dias) a 24 requerimentos foi: 5, 12, 8, 31, 22, 17, 9, 44, 15, 27, 6, 19, 35, 10, 23, 14, 47, 3, 29, 21, 16, 38, 11, 25. Agrupe em 5 classes de mesma largura e calcule as frequências e os percentuais.",
      "steps": [
       "Menor valor: 3; maior: 47; amplitude total: 47−3=44. Largura: 44/5=8,8, arredondada para 9.",
       "Classes: [3,12), [12,21), [21,30), [30,39) e [39,48). O último limite (48) supera o maior valor (47).",
       "[3,12): 5, 8, 9, 6, 10, 3 e 11, total de 7 (o valor 12 vai para a classe seguinte). [12,21): 12, 17, 15, 19, 14 e 16, total de 6 (o 21 vai para a seguinte). [21,30): 22, 27, 23, 29, 21 e 25, total de 6. [30,39): 31, 35 e 38, total de 3. [39,48): 44 e 47, total de 2.",
       "Soma: 7+6+6+3+2=24, igual a n. Percentuais: 7/24=29,2%; 6/24=25%; 6/24=25%; 3/24=12,5%; 2/24=8,3% (com uma casa decimal; a soma 100,0% fecha pois 29,2+25+25+12,5+8,3=100,0).",
       "Classe modal: [3,12), com 7 requerimentos; pontos médios: 7,5; 16,5; 25,5; 34,5 e 43,5."
      ],
      "answer": "Frequências 7, 6, 6, 3 e 2; percentuais aproximados de 29,2%, 25%, 25%, 12,5% e 8,3%; classe modal [3,12)."
     },
     {
      "prompt": "Cem recursos foram agrupados nas classes [0,20) com 30 recursos, [20,40) com 40, [40,60) com 20 e [60,100) com 10. (a) Calcule a densidade de frequência (frequência ÷ largura) de cada classe e diga qual barra é a mais alta. (b) Quantos recursos têm valor de 60 ou mais? (c) Qual a porcentagem de recursos em [20,60)?",
      "steps": [
       "Larguras: 20, 20, 20 e 40. Soma das frequências: 30+40+20+10=100, igual a n.",
       "(a) Densidades: 30/20=1,5; 40/20=2; 20/20=1; 10/40=0,25. A barra mais alta é a de [20,40), com altura 2.",
       "(b) Valor de 60 ou mais: só a classe [60,100), com 10 recursos, isto é, 10%. A barra dessa classe é a mais baixa (0,25), mas sua largura de 40 compensa: 0,25×40=10.",
       "(c) Em [20,60): classes [20,40) e [40,60), 40+20=60 recursos, isto é, 60/100=60%.",
       "Conferência por áreas: 1,5×20=30; 2×20=40; 1×20=20; 0,25×40=10."
      ],
      "answer": "Densidades 1,5; 2; 1 e 0,25 (a mais alta é [20,40)); 10 recursos com valor de 60 ou mais; 60% em [20,60)."
     },
     {
      "prompt": "Os valores de 150 processos estão distribuídos nas classes [0,10) com 20 processos, [10,30) com 60, [30,50) com 40 e [50,100) com 30. Suponha distribuição uniforme dentro de cada classe. (a) Qual a densidade de cada classe? (b) Quantos processos têm valor menor que 40? (c) Qual a porcentagem de processos com valor de 50 ou mais?",
      "steps": [
       "Larguras: 10, 20, 20 e 50. Total: 20+60+40+30=150.",
       "(a) Densidades: 20/10=2; 60/20=3; 40/20=2; 30/50=0,6.",
       "(b) Menor que 40: as classes [0,10) e [10,30) inteiras (20+60=80) mais a metade inferior de [30,50), isto é, [30,40), com largura 10 de 20, ou 0,5×40=20. Total: 80+20=100 processos.",
       "(c) Valor de 50 ou mais: a classe [50,100) inteira, 30 processos. 30/150=0,20=20%.",
       "Conferência por áreas: 2×10=20; 3×20=60; 2×20=40; 0,6×50=30. A barra mais baixa, [50,100), tem 30 processos por causa da largura de 50."
      ],
      "answer": "Densidades 2, 3, 2 e 0,6; 100 processos com valor menor que 40; 20% com valor de 50 ou mais."
     }
    ],
    "pitfall": "Comparar a altura das barras como se fosse frequência quando as classes têm larguras diferentes, ou jogar um valor igual ao limite na classe de baixo. Calcule a densidade (frequência ÷ largura) e lembre que [a,b) inclui a e exclui b.",
    "tables": [
     {
      "caption": "Tempo de resposta a 24 requerimentos",
      "headers": [
       "Classe (dias)",
       "Ponto médio",
       "Frequência",
       "Percentual"
      ],
      "rows": [
       [
        "[3,12)",
        "7,5",
        7,
        "29,2%"
       ],
       [
        "[12,21)",
        "16,5",
        6,
        "25%"
       ],
       [
        "[21,30)",
        "25,5",
        6,
        "25%"
       ],
       [
        "[30,39)",
        "34,5",
        3,
        "12,5%"
       ],
       [
        "[39,48)",
        "43,5",
        2,
        "8,3%"
       ]
      ]
     }
    ],
    "resumo": {
     "title": "Distribuição em classes",
     "text": "Largura=amplitude total÷nº de classes (arredondada para cima); ponto médio=(limite inferior+superior)÷2; densidade=frequência÷largura.",
     "bizu": "[a,b) inclui a e exclui b; com larguras diferentes, quem manda é a área."
    }
   },
   {
    "title": "Leitura crítica: escalas, eixos truncados e limites das conclusões",
    "paragraphs": [
     "Um gráfico verdadeiro nos números pode induzir a uma impressão falsa no desenho. O caso mais comum é o eixo truncado: o eixo vertical começa em um valor maior que zero, e a altura visível das barras deixa de ser proporcional aos valores. Se as barras valem 250 e 300 e o eixo começa em 200, as partes visíveis medem 50 e 100, e a segunda parece o dobro da primeira, quando o valor real é só 20% maior. Para evitar o erro, calcule a razão com os números do gráfico (300÷250=1,2) e ignore a impressão visual.",
     "Outra fonte de confusão é a base do percentual. “Dos insatisfeitos, 75% são do atendimento presencial” e “dos atendidos presencialmente, 15% estão insatisfeitos” são frases diferentes, com a mesma célula no numerador e denominadores distintos (total dos insatisfeitos e total dos presenciais). A primeira é uma participação dentro do grupo dos insatisfeitos; a segunda é uma taxa dentro do grupo dos presenciais. Também é preciso distinguir porcentagem de quantidade: o grupo maior pode ter menor taxa e, ainda assim, maior quantidade absoluta.",
     "Por fim, existem conclusões que o gráfico não permite. Um gráfico descreve os dados apresentados: não prova causa, não garante tendência futura e não vale para além do universo pesquisado. Afirmações com “sempre”, “nunca”, “todos”, “por causa de” e “vai continuar” devem ser testadas contra os números. Há ainda o efeito de composição: uma vara pode ter melhor desempenho em cada tipo de processo e pior desempenho geral, se a mistura de tipos for diferente. Esse fenômeno, que parece paradoxal, é apenas aritmética de médias ponderadas."
    ],
    "example": "Exemplo resolvido: colunas de 480 e 510 processos em um eixo que começa em 450 mostram alturas visíveis de 30 e 60, parecendo o dobro. A variação real é (510−480)/480=6,25%.",
    "development": [
     "A escala também pode enganar de outras formas: intervalos desiguais no eixo horizontal (anos seguidos misturados com saltos de cinco anos), eixo em escala não linear, ou barras 3D que distorcem as áreas. A regra é a mesma: confie nos rótulos numéricos e refaça as contas. Se uma série tem dois eixos verticais (um à esquerda e outro à direita), cada linha deve ser lida no seu eixo; o cruzamento visual das linhas não tem significado numérico.",
     "No efeito de composição, a taxa geral é uma média ponderada das taxas dos grupos, com pesos iguais ao tamanho de cada grupo. Se uma vara recebe muitos processos de tipo difícil e a outra recebe processos de tipo fácil, a taxa geral da primeira será mais baixa mesmo que ela seja melhor em cada tipo. Para comparar, é preciso comparar dentro dos grupos ou ponderar com os mesmos pesos. A conclusão “a vara A é pior” ou “a vara A é melhor” depende da pergunta; os números não decidem sozinhos."
    ],
    "method": [
     "Leia o enunciado e o gráfico, registre os valores numéricos e verifique se o eixo começa em zero e se os intervalos são regulares.",
     "Identifique a base de cada percentual: total geral, total da linha ou total da coluna; escreva a pergunta com “dos…” ou “entre os…”.",
     "Calcule quantidades absolutas e taxas separadamente; compare cada afirmação com os números, não com o desenho.",
     "Elimine conclusões que exigem causa, projeção futura, total desconhecido ou grupo fora do universo pesquisado."
    ],
    "workedExamples": [
     {
      "prompt": "Um gráfico de colunas, com eixo vertical iniciando em 200, mostra 250 processos resolvidos em 2023 e 300 em 2024. As alturas visíveis das colunas são 50 e 100. Quantas vezes a segunda coluna parece maior que a primeira? Qual é a razão real e a variação percentual real? Com o eixo iniciando em zero, qual seria a razão visual?",
      "steps": [
       "Alturas visíveis: 250−200=50 e 300−200=100.",
       "Razão visual: 100/50=2. A coluna de 2024 parece o dobro da de 2023.",
       "Razão real: 300/250=1,2. Variação: (300−250)/250=50/250=0,20, isto é, 20%.",
       "Com o eixo iniciando em zero, as alturas seriam 250 e 300 e a razão visual seria 300/250=1,2, igual à razão real.",
       "A distorção vem do corte do eixo: o gráfico deixa de mostrar 200 dos 250 processos da primeira coluna."
      ],
      "answer": "Parece 2 vezes (o dobro), mas a razão real é 1,2, isto é, alta de 20%. Com eixo em zero, a razão visual seria 1,2."
     },
     {
      "prompt": "Uma pesquisa de satisfação ouviu 500 pessoas: 300 atendidas presencialmente e 200 por canal on-line. Ao todo, 60 pessoas se declararam insatisfeitas, sendo 45 do presencial. (a) Que percentual dos insatisfeitos foi atendido presencialmente? (b) Qual a taxa de insatisfação em cada canal? (c) O argumento “o atendimento presencial é pior porque tem mais insatisfeitos (45 contra 15)” é válido? O que os dados permitem concluir?",
      "steps": [
       "Insatisfeitos on-line: 60−45=15.",
       "(a) Base: total de insatisfeitos. 45/60=0,75, isto é, 75%.",
       "(b) Base: total de cada canal. Presencial: 45/300=0,15=15%. On-line: 15/200=0,075=7,5%.",
       "Taxa geral: 60/500=12%.",
       "(c) Ter mais insatisfeitos em quantidade (45 contra 15) não prova nada por si só: o presencial também atendeu mais pessoas (300 contra 200; 60% do total). A comparação justa usa as taxas: 15% contra 7,5%, isto é, o dobro. Portanto, os dados mostram que a insatisfação é proporcionalmente maior no presencial, mas não informam a causa."
      ],
      "answer": "(a) 75%; (b) 15% no presencial e 7,5% no on-line; (c) o argumento por quantidade não é válido (o presencial atendeu mais gente); pela taxa, a insatisfação do presencial é o dobro (15% contra 7,5%), mas os dados não mostram a causa."
     },
     {
      "prompt": "Duas varas (A e B) julgaram processos simples e complexos. A Vara A recebeu 20 processos simples e 80 complexos, e julgou no prazo 18 dos simples e 40 dos complexos. A Vara B recebeu 80 processos simples e 20 complexos, e julgou no prazo 70 dos simples e 9 dos complexos. Compare as taxas por tipo e a taxa geral de cada vara e explique o resultado.",
      "steps": [
       "Vara A: simples 18/20=90%; complexos 40/80=50%; geral (18+40)/(20+80)=58/100=58%.",
       "Vara B: simples 70/80=87,5%; complexos 9/20=45%; geral (70+9)/(80+20)=79/100=79%.",
       "Dentro de cada tipo, A é melhor: 90% contra 87,5% nos simples, 50% contra 45% nos complexos.",
       "No geral, B é melhor: 79% contra 58%.",
       "Explicação: a taxa geral é média ponderada. A tem 80% de seus processos complexos (taxa baixa), e B tem apenas 20%. A diferença de composição puxa a taxa geral de A para baixo."
      ],
      "answer": "A tem melhor taxa em cada tipo (90% e 50%, contra 87,5% e 45%), mas B tem melhor taxa geral (79% contra 58%), porque as varas receberam misturas diferentes de processos. Concluir qual é melhor depende de a pergunta ser sobre o desempenho por tipo ou sobre o resultado geral."
     }
    ],
    "pitfall": "Aceitar a impressão visual (barras que parecem o dobro, linhas que cruzam) ou trocar a base do percentual sem perceber. Refaça sempre a conta com os números e escreva qual é o grupo de referência de cada porcentagem.",
    "tables": [
     {
      "caption": "Taxa de processos julgados no prazo por vara e tipo",
      "headers": [
       "Vara",
       "Simples (no prazo/total)",
       "Complexos (no prazo/total)",
       "Geral"
      ],
      "rows": [
       [
        "A",
        "18/20 (90%)",
        "40/80 (50%)",
        "58/100 (58%)"
       ],
       [
        "B",
        "70/80 (87,5%)",
        "9/20 (45%)",
        "79/100 (79%)"
       ]
      ]
     }
    ],
    "resumo": {
     "title": "Leitura crítica de gráficos",
     "text": "Confira o início do eixo, a base de cada porcentagem e a diferença entre taxa e quantidade. O gráfico descreve; não prova causa nem futuro.",
     "bizu": "Pontos percentuais são subtração de taxas; variação relativa divide pelo valor inicial; médias gerais dependem da composição dos grupos."
    }
   }
  ]
 },
 "M14": {
  "extras": [
   {
    "capitulo": 1,
    "development": [
     "A ideia que sustenta quase todo problema de média é que a média e a soma carregam a mesma informação, desde que você conheça a quantidade de dados: soma = média × quantidade. Por isso, quando o enunciado dá médias e pede um valor perdido, você deve converter tudo em somas, fazer a conta com somas e só no fim voltar para a média. Duas propriedades ajudam a conferir resultados: se você soma uma constante a todos os valores, a média aumenta exatamente essa constante; se multiplica todos os valores por uma constante, a média fica multiplicada por ela. Use essas regras para conferir o resultado depois de calcular por soma.",
     "Retirar um elemento também segue a lógica da soma. Se o elemento retirado é igual à média, a média não muda, porque você tira da soma exatamente a parte que ele representava no equilíbrio. Se o elemento retirado é maior que a média, a média cai; se é menor, a média sobe. Esse raciocínio dá um teste rápido de plausibilidade: antes de calcular, diga em que direção a média deve se mover. Se a conta der o contrário, houve erro. Atenção também à quantidade: ao retirar um dado, a nova divisão é por n−1, e ao retirar dois dados e acrescentar um, por n−1. Escreva sempre a nova quantidade antes de dividir."
    ],
    "workedExamples": [
     {
      "prompt": "Seis servidores de uma secretaria têm idade média de 40 anos. Um deles, de 52 anos, se aposenta e deixa o grupo. Qual é a idade média dos cinco servidores que permanecem?",
      "steps": [
       "Soma das idades dos seis: 6×40=240.",
       "Retirando o servidor de 52 anos, a soma passa a ser 240−52=188, para 5 servidores.",
       "Nova média: 188/5=37,6 anos.",
       "Conferência de direção: o servidor que saiu tinha 52, acima da média de 40; retirar um valor acima da média faz a média cair, e 37,6<40 confirma."
      ],
      "answer": "37,6 anos."
     },
     {
      "prompt": "A média de 10 números é 15. Retiram-se dois deles, 8 e 22, e acrescenta-se um número x ao grupo restante, formando um conjunto de 9 números cuja média é 14. Qual é o valor de x?",
      "steps": [
       "Soma inicial dos 10 números: 10×15=150.",
       "Ao retirar 8 e 22 (soma 30), restam 8 números com soma 150−30=120.",
       "O conjunto final tem 8+1=9 números e soma 9×14=126.",
       "Como a soma final é 120+x, temos 120+x=126, logo x=6.",
       "Conferência: (120+6)/9=126/9=14, como pedido."
      ],
      "answer": "x = 6."
     }
    ]
   },
   {
    "capitulo": 2,
    "development": [
     "O peso mede a importância relativa de cada valor, e só a proporção entre os pesos importa. Se os pesos são 2, 3 e 5, o resultado é o mesmo que com 20, 30 e 50, ou com 20%, 30% e 50%, porque numerador e denominador ficam multiplicados pela mesma constante. Por isso, quando os pesos aparecem em porcentagem e somam 100%, o denominador vale 1 e a média ponderada é simplesmente a soma de valor × proporção. Quando os pesos não somam 100%, divida pela soma deles. Uma conferência útil: a média ponderada nunca fica abaixo do menor valor nem acima do maior; se o seu resultado sair dessa faixa, a conta está errada.",
     "Outra característica importante é que o resultado se aproxima do valor de maior peso. Em uma média ponderada com notas 4 e 10 e pesos 1 e 9, o resultado é 9,4, quase igual a 10. Isso explica por que, em critérios de seleção, o candidato pode ter uma nota baixa em uma etapa de peso pequeno e ainda assim ser aprovado. Nos problemas que pedem a nota necessária para atingir uma média final, trate a incógnita como mais um termo do numerador: some as contribuições conhecidas, escreva a contribuição desconhecida como nota × peso e iguale ao produto da média desejada pela soma de todos os pesos. Depois confira se a nota encontrada é possível dentro da escala."
    ],
    "workedExamples": [
     {
      "prompt": "Em um processo seletivo interno, a nota final é a média ponderada de três etapas: prova objetiva (peso 4), redação (peso 3) e análise de títulos (peso 3). Uma candidata obteve 7,0 na prova objetiva, 8,5 na redação e 6,0 nos títulos. Qual é a sua nota final?",
      "steps": [
       "Contribuições: prova objetiva 7,0×4=28,0; redação 8,5×3=25,5; títulos 6,0×3=18,0.",
       "Soma das contribuições: 28,0+25,5+18,0=71,5.",
       "Soma dos pesos: 4+3+3=10.",
       "Nota final: 71,5/10=7,15.",
       "Conferência: 7,15 está entre a menor nota (6,0) e a maior (8,5), como deve ocorrer."
      ],
      "answer": "7,15."
     },
     {
      "prompt": "Em um curso, a média final é a média ponderada de três provas com pesos 2, 3 e 5. Um aluno tirou 6,0 na primeira e 7,5 na segunda. Qual nota ele precisa tirar na terceira prova para obter média final igual a 8,0?",
      "steps": [
       "Soma dos pesos: 2+3+5=10; a soma ponderada necessária é 10×8,0=80.",
       "Contribuições já conhecidas: 6,0×2=12,0 e 7,5×3=22,5, totalizando 34,5.",
       "A terceira prova precisa contribuir com 80−34,5=45,5.",
       "Como o peso da terceira prova é 5, a nota é 45,5/5=9,1.",
       "Conferência: (12+22,5+45,5)/10=80/10=8,0, e 9,1 é uma nota possível na escala de 0 a 10."
      ],
      "answer": "9,1."
     }
    ]
   },
   {
    "capitulo": 3,
    "development": [
     "A mediana depende da posição dos valores, e não de quanto cada um vale. Por isso, se você trocar o maior valor de uma lista com três ou mais valores por outro ainda maior, a mediana não se altera, enquanto a média sobe. Essa insensibilidade é o motivo de a mediana ser usada para salários, preços de imóveis e prazos processuais, nos quais poucos valores muito distantes distorceriam a média. Em compensação, a mediana ignora a informação sobre a distância entre os dados: duas listas muito diferentes podem ter a mesma mediana. Em amostras de tamanho ímpar, a mediana é sempre um dos valores observados; em amostras de tamanho par, pode ser um valor que ninguém registrou, como 9,5 em uma lista de números inteiros.",
     "Ao acrescentar ou retirar valores, a mediana pode mudar, mas de forma limitada: ela se desloca no máximo para a posição vizinha da lista ordenada. Quando o enunciado envolve um valor desconhecido x, a técnica é considerar a posição de x na lista ordenada em cada caso possível: abaixo dos valores centrais, entre eles ou acima deles. Em muitos problemas, a mediana resultante é a mesma para uma faixa inteira de valores de x, e a resposta correta é um conjunto, como “qualquer x maior ou igual a 11”, e não um único número. Sempre reordene a lista depois de inserir o novo valor."
    ],
    "workedExamples": [
     {
      "prompt": "Em um setor, os tempos de tramitação de 12 processos, em dias, estão na tabela: 2 dias (3 processos), 5 dias (3 processos) e 9 dias (6 processos). Calcule a mediana e a média do tempo de tramitação.",
      "steps": [
       "Total de observações: 3+3+6=12, número par; as posições centrais são a 6ª e a 7ª.",
       "Acumuladas: o valor 2 ocupa as posições 1 a 3; o valor 5 ocupa as posições 4 a 6; o valor 9 ocupa as posições 7 a 12.",
       "A 6ª posição contém 5 e a 7ª contém 9, valores distintos; mediana = (5+9)/2=7 dias.",
       "Média: (2×3+5×3+9×6)/12=(6+15+54)/12=75/12=6,25 dias.",
       "Observação: a mediana, 7, não coincide com nenhum tempo registrado, o que é normal quando n é par e as posições centrais têm valores diferentes."
      ],
      "answer": "Mediana de 7 dias e média de 6,25 dias."
     },
     {
      "prompt": "Os valores 6, 8, 11 e 15 formam uma lista, cuja mediana é 9,5. Acrescenta-se a essa lista um quinto número inteiro x. Para quais valores de x a mediana da nova lista é igual a 11?",
      "steps": [
       "Com 5 valores, a mediana é o valor da 3ª posição da lista ordenada.",
       "Se x≤8, o 3º valor da lista ordenada é 8 (por exemplo, com x=3: 3, 6, 8, 11, 15); a mediana é 8, e não 11.",
       "Se 8<x<11, o 3º valor é o próprio x (por exemplo, x=10: 6, 8, 10, 11, 15); a mediana é x, menor que 11.",
       "Se x≥11, a lista fica 6, 8, 11, … com 11 na 3ª posição (por exemplo, x=11: 6, 8, 11, 11, 15; x=12: 6, 8, 11, 12, 15; x=40: 6, 8, 11, 15, 40); a mediana é 11.",
       "Conclusão: a mediana vale 11 para todo x maior ou igual a 11."
      ],
      "answer": "Para qualquer x ≥ 11."
     }
    ],
    "tables": [
     {
      "caption": "Posição central conforme o total de observações",
      "headers": [
       "Total n",
       "Posição(ões) central(is)",
       "Mediana"
      ],
      "rows": [
       [
        "7",
        "4ª",
        "valor da 4ª posição"
       ],
       [
        "8",
        "4ª e 5ª",
        "média dos dois valores"
       ],
       [
        "9",
        "5ª",
        "valor da 5ª posição"
       ],
       [
        "10",
        "5ª e 6ª",
        "média dos dois valores"
       ],
       [
        "21",
        "11ª",
        "valor da 11ª posição"
       ],
       [
        "22",
        "11ª e 12ª",
        "média dos dois valores"
       ]
      ]
     }
    ]
   },
   {
    "capitulo": 4,
    "development": [
     "A moda é a única das três medidas que funciona para qualquer tipo de variável, inclusive as qualitativas: estado civil, tipo de ação, área do tribunal. Nesses casos, a moda é a categoria mais frequente, e média e mediana simplesmente não se aplicam, pois não há soma nem ordem natural. Em variáveis numéricas, a moda é sensível a pequenas alterações: acrescentar um único dado pode criar uma moda nova, desfazer um empate ou transformar uma distribuição sem moda em uma distribuição com moda. Por isso, em exercícios com acréscimo de valores, sempre refaça a contagem de frequências inteira, e não apenas a do valor acrescentado.",
     "Cuidado com o empate no topo: se dois valores têm a maior frequência, ambos são modas, e a distribuição é bimodal, não amodal. Já a distribuição amodal, pela convenção do curso, é aquela em que nenhum valor se repete, isto é, a maior frequência é 1. Veja a diferença: em 3, 5, 5, 8, 8, as modas são 5 e 8; em 3, 5, 7, 8, não há moda. Ao descrever o resultado, escreva os valores modais, e não apenas a quantidade de modas, e indique a frequência quando o enunciado a pedir."
    ],
    "workedExamples": [
     {
      "prompt": "Os processos de uma unidade, por área, são: Cível 18, Criminal 25, Família 25, Trabalhista 12 e Tributária 7. Qual é a moda? Se chegarem mais 7 processos cíveis, o que acontece com a moda?",
      "steps": [
       "Maior frequência: 25, que ocorre em Criminal e em Família.",
       "Há empate no topo, logo a distribuição é bimodal, e as modas são as áreas Criminal e Família (a moda é a categoria, não o número 25).",
       "Com 7 processos cíveis a mais, o Cível passa a ter 18+7=25.",
       "Agora três categorias têm frequência 25: Cível, Criminal e Família; a distribuição passa a ser trimodal."
      ],
      "answer": "Bimodal (Criminal e Família); depois do acréscimo, trimodal (Cível, Criminal e Família)."
     },
     {
      "prompt": "A lista 2, 4, 4, 7, 9 recebe um sexto valor inteiro a, com 1≤a≤10. Para quais valores de a a nova lista é bimodal? O que acontece quando a=4?",
      "steps": [
       "Na lista original, 4 aparece duas vezes e os demais uma vez; a moda é 4, com frequência 2.",
       "Para a lista ser bimodal, outro valor precisa alcançar também a frequência 2, o que só ocorre se a repetir um valor que aparece uma vez: a=2, a=7 ou a=9.",
       "Para esses três valores, as modas são 4 e o próprio a (por exemplo, com a=7: 2, 4, 4, 7, 7, 9 tem modas 4 e 7).",
       "Para a=4, o 4 passa a ter frequência 3 e é a única moda (unimodal).",
       "Para qualquer outro a (1, 3, 5, 6, 8 ou 10), o valor novo aparece uma vez e a única moda continua sendo 4."
      ],
      "answer": "Bimodal para a = 2, 7 ou 9; com a = 4, a lista fica unimodal (moda 4)."
     }
    ]
   },
   {
    "capitulo": 5,
    "development": [
     "Em tabelas e gráficos, o erro mais comum não é de conta, mas de leitura. Em um gráfico de barras de uma variável numérica, a altura da barra é a frequência, e o rótulo do eixo horizontal é o valor; a moda é o valor da barra mais alta, não a altura. Em um gráfico de setores, cada fatia mostra uma proporção do total; se o enunciado informa o total de observações, converta cada percentual em frequência antes de calcular a mediana. Na média, o percentual funciona como peso e dispensa a conversão. Sempre confirme o total: some as frequências e compare com o n informado, pois uma barra mal lida desloca todas as medidas.",
     "Quando os dados vêm agrupados em classes, como 0 a 10, 10 a 20 e assim por diante, o enunciado costuma adotar a convenção de que cada classe inclui o limite inferior e exclui o superior. A média é então estimada pelo ponto médio de cada classe, que é a média dos dois limites. A mediana só pode ser localizada na classe que contém a posição central, e a moda, na classe de maior frequência, a chamada classe modal. Dizer que a média vale exatamente 19 minutos seria exagero: ela vale aproximadamente 19, sob a hipótese de que os dados se distribuem uniformemente dentro de cada classe."
    ],
    "workedExamples": [
     {
      "prompt": "O tempo de atendimento de 25 pessoas em um balcão foi agrupado em classes de minutos, com o limite inferior incluído e o superior excluído: de 0 a 10, 4 pessoas; de 10 a 20, 10 pessoas; de 20 a 30, 8 pessoas; de 30 a 40, 3 pessoas. Estime a média e identifique a classe mediana e a classe modal.",
      "steps": [
       "Pontos médios das classes: 5, 15, 25 e 35 minutos.",
       "Soma ponderada: 5×4+15×10+25×8+35×3=20+150+200+105=475; total de 25 pessoas.",
       "Média estimada: 475/25=19 minutos (aproximação, pois só conhecemos as classes).",
       "Com n=25, a posição central é a 13ª. Acumuladas: 4, 14, 22, 25; a 13ª posição cai na classe de 10 a 20.",
       "A maior frequência é 10, também na classe de 10 a 20."
      ],
      "answer": "Média estimada de 19 minutos; classe mediana e classe modal: de 10 a 20 minutos."
     },
     {
      "prompt": "Uma tabela mostra os valores 1, 2, 3 e 4 com frequências 6, 9, k e 5, respectivamente, em que k é um número natural desconhecido. Sabendo que a média é igual a 2,5, determine k e, em seguida, a mediana e a moda.",
      "steps": [
       "Soma dos produtos: 1×6+2×9+3×k+4×5=6+18+3k+20=44+3k; total de observações: 6+9+k+5=20+k.",
       "Equação da média: 44+3k=2,5×(20+k)=50+2,5k.",
       "Então 0,5k=6, e k=12.",
       "Conferência: n=32, soma=44+36=80 e 80/32=2,5.",
       "Com n=32, as posições centrais são a 16ª e a 17ª. Acumuladas: 6, 15, 27, 32; ambas as posições pertencem ao valor 3, logo a mediana é 3.",
       "A maior frequência é 12, do valor 3; a moda é 3."
      ],
      "answer": "k = 12; mediana 3; moda 3."
     }
    ],
    "tables": [
     {
      "caption": "Classes de tempo de atendimento",
      "headers": [
       "Classe (min)",
       "Ponto médio",
       "Frequência",
       "Acumulada",
       "Ponto médio × frequência"
      ],
      "rows": [
       [
        "0 a 10",
        "5",
        "4",
        "4",
        "20"
       ],
       [
        "10 a 20",
        "15",
        "10",
        "14",
        "150"
       ],
       [
        "20 a 30",
        "25",
        "8",
        "22",
        "200"
       ],
       [
        "30 a 40",
        "35",
        "3",
        "25",
        "105"
       ],
       [
        "Total",
        "—",
        "25",
        "—",
        "475"
       ]
      ]
     }
    ]
   }
  ],
  "novosCapitulos": [
   {
    "title": "Média aritmética em problemas: soma total, acréscimos e retiradas",
    "paragraphs": [
     "Os problemas de média raramente pedem só a divisão de uma soma. O enunciado costuma informar a média de um grupo e perguntar o que acontece quando um elemento entra, sai ou é substituído, ou então combina médias de grupos diferentes. Nesses casos, o caminho seguro é sempre o mesmo: transformar a média em soma total usando soma = média × quantidade, mexer na soma e na quantidade, e só então voltar para a média. Esse método evita as armadilhas de operar diretamente com médias, que dão resultados errados quando os grupos têm tamanhos diferentes.",
     "A média tem uma interpretação de equilíbrio: é o valor que cada elemento teria se a soma fosse repartida igualmente. Quando um novo elemento entra com valor maior que a média atual, ele precisa “dar” o excedente aos demais para que a distribuição volte a ser igual, e a média sobe; se entra com valor menor, a média desce. Em um grupo grande, o efeito de um único elemento é pequeno, pois o excedente é dividido entre muitos. Em um grupo pequeno, o mesmo elemento move bastante a média. Essa leitura ajuda a estimar a resposta antes da conta.",
     "Existem ainda regras de transformação. Somar uma constante a todos os valores soma essa constante à média; multiplicar todos os valores por uma constante multiplica a média pela constante. Uma sequência de reajustes, como um valor fixo seguido de um percentual, aplica-se diretamente sobre a média, na mesma ordem. Por fim, quando o enunciado dá a média de dois subgrupos e a média do grupo todo, a incógnita é a média de um dos subgrupos, e a ferramenta é a igualdade entre a soma total e a soma das somas dos subgrupos."
    ],
    "example": "Exemplo resolvido: a média de 4 números é 12 e, ao acrescentar um quinto número, a média passa a 14. A soma inicial é 4×12=48; a soma final é 5×14=70; o número acrescentado é 70−48=22, acima da média antiga, o que explica a subida.",
    "development": [
     "Algumas variações merecem atenção. Em problemas de substituição, em que um valor é trocado por outro, a quantidade de elementos não muda e a soma varia pela diferença entre o novo valor e o antigo; a média varia essa diferença dividida por n. Assim, se em um grupo de 8 pessoas uma pessoa de 30 anos dá lugar a outra de 46, a soma sobe 16 e a média sobe 16/8=2 anos. Em problemas com acréscimo de vários valores, some todos antes de dividir. E em problemas com “n números consecutivos” ou “n inteiros em progressão”, lembre-se de que, se os valores estão igualmente espaçados, a média é o valor do meio (ou a média dos dois valores do meio).",
     "O enunciado pode ainda esconder a quantidade de elementos, e o problema vira uma equação: a média de n números é 20 e, com mais um número igual a 32, passa a 22; então 20n+32=22(n+1), logo 2n=10 e n=5. Nesses casos, monte a equação com a soma antes e depois, igualando as duas expressões. Quando um dos subgrupos é descrito por porcentagem do total, converta a porcentagem em quantidade antes de usar os pesos, ou use-a diretamente como peso, desde que as porcentagens somem 100%."
    ],
    "method": [
     "Converta cada média informada em soma total: média × quantidade.",
     "Registre o que muda: valor acrescentado, valor retirado ou substituído, constante somada ou multiplicada.",
     "Calcule a nova soma e a nova quantidade juntas, na mesma linha.",
     "Divida a nova soma pela nova quantidade, ou isole a incógnita se o enunciado fornece a nova média.",
     "Verifique a direção: valor acima da média faz subir; valor abaixo faz descer; valor igual não altera."
    ],
    "workedExamples": [
     {
      "prompt": "A média salarial de 6 servidores de uma unidade é R$ 5.000,00. A unidade concede a cada um deles, nesta ordem, um acréscimo fixo de R$ 300,00 e, em seguida, um reajuste de 10% sobre o valor já acrescido. Qual é a nova média salarial e qual é o novo valor total da folha desses 6 servidores?",
      "steps": [
       "Soma inicial: 6×5.000=30.000, mas não é necessário usá-la: a transformação aplicada a todos se aplica à média.",
       "Acréscimo fixo de R$ 300,00 a todos: a média vai a 5.000+300=5.300.",
       "Reajuste de 10% sobre o valor acrescido: 5.300×1,10=5.830.",
       "Nova média: R$ 5.830,00.",
       "Folha total: 6×5.830=34.980, ou seja, R$ 34.980,00.",
       "Conferência: a folha original era R$ 30.000,00; (30.000+6×300)×1,10=31.800×1,10=34.980, mesmo resultado."
      ],
      "answer": "Média de R$ 5.830,00 e folha total de R$ 34.980,00."
     },
     {
      "prompt": "Uma equipe de 5 servidores atende, em média, 36 pessoas por dia por servidor. Um sexto servidor é incorporado à equipe e, com ele, a média da equipe passa a 38 atendimentos por servidor. Quantos atendimentos o novo servidor realiza por dia, e por que a média subiu?",
      "steps": [
       "Soma dos atendimentos da equipe original: 5×36=180.",
       "Soma da equipe com 6 servidores: 6×38=228.",
       "Atendimentos do novo servidor: 228−180=48.",
       "A média subiu porque 48 é maior que a média anterior (36): o excedente de 48−36=12 é dividido entre 6 servidores, resultando em 12/6=2, que é exatamente a alta de 36 para 38."
      ],
      "answer": "O novo servidor realiza 48 atendimentos por dia."
     },
     {
      "prompt": "Um grupo de 25 pessoas, em que 60% são homens, tem massa corporal média de 66 kg. Os homens têm média de 70 kg. Qual é a média das mulheres do grupo?",
      "steps": [
       "Quantidade de homens: 60% de 25=15; quantidade de mulheres: 25−15=10.",
       "Soma das massas do grupo: 25×66=1.650 kg.",
       "Soma das massas dos homens: 15×70=1.050 kg.",
       "Soma das massas das mulheres: 1.650−1.050=600 kg.",
       "Média das mulheres: 600/10=60 kg.",
       "Conferência: média ponderada (15×70+10×60)/25=1.650/25=66 kg; e 66 está mais perto de 70 que de 60, pois há mais homens."
      ],
      "answer": "A média das mulheres é 60 kg."
     }
    ],
    "pitfall": "Tratar a variação da média como se fosse o valor acrescentado, ou calcular a média das médias dos subgrupos sem pesos. Se a média foi de 36 para 38, o novo valor não é 2 nem 38: é a diferença entre as somas, 6×38−5×36. Sempre volte para soma e quantidade antes de operar.",
    "tables": [
     {
      "caption": "Efeito de operações sobre a média",
      "headers": [
       "Operação",
       "Efeito sobre a média"
      ],
      "rows": [
       [
        "Somar k a todos os valores",
        "a média soma k"
       ],
       [
        "Multiplicar todos por k",
        "a média fica multiplicada por k"
       ],
       [
        "Acrescentar valor igual à média",
        "a média não muda"
       ],
       [
        "Acrescentar valor maior que a média",
        "a média sobe"
       ],
       [
        "Retirar valor maior que a média",
        "a média desce"
       ],
       [
        "Substituir valor v por w (n dados)",
        "a média varia (w−v)/n"
       ]
      ]
     }
    ],
    "resumo": {
     "title": "Médias em problemas",
     "text": "Converta média em soma (média × quantidade), altere soma e quantidade e volte à média; combinações de grupos pedem pesos pelos tamanhos.",
     "bizu": "Antes da conta, diga se a média deve subir ou descer."
    }
   },
   {
    "title": "Média ponderada e dados em tabelas de frequência",
    "paragraphs": [
     "A média de uma tabela de frequência é uma média ponderada em que o peso de cada valor é o número de vezes que ele aparece. Em vez de somar 40 números um a um, você calcula, para cada linha, valor × frequência, soma esses produtos e divide pelo total de observações. O raciocínio é o mesmo da média simples, só que organizado: se o valor 3 aparece 5 vezes, a soma recebe 15 por essa linha. Montar uma coluna de produtos e outra de frequências, e conferir os totais, é o que impede erros de leitura.",
     "Quando os pesos aparecem como porcentagens, como em “20% dos servidores têm nota 4”, a frequência relativa faz o papel de peso, e a média é a soma de cada valor multiplicado pela sua proporção. Se as porcentagens somam 100%, não é preciso dividir. Se faltar uma porcentagem, descubra-a pela diferença: o complemento até 100%. Em problemas com duas porcentagens desconhecidas, são necessárias duas informações: a soma das porcentagens e a média, formando um sistema de duas equações.",
     "Em dados agrupados em classes de valores, como salários de R$ 2.000,00 a R$ 4.000,00, não se conhece cada valor individual. Adota-se, por convenção, que cada classe é representada pelo seu ponto médio, calculado como a média dos limites inferior e superior da classe. A média obtida é uma estimativa, e o enunciado deve indicar essa hipótese. A conta segue o mesmo formato: ponto médio × frequência, soma e divisão pelo total."
    ],
    "example": "Exemplo resolvido: valores 10, 20 e 30 com frequências 2, 5 e 3 têm 10 observações e soma ponderada 20+100+90=210; a média é 21.",
    "development": [
     "A frequência relativa é a frequência dividida pelo total, e a soma delas é sempre 1 (ou 100%). Por isso, ao multiplicar cada valor pela frequência relativa e somar, você obtém diretamente a média. Veja um exemplo com nota 4 (20%), nota 6 (50%) e nota 10 (30%): 0,8+3,0+3,0=6,8. Esse atalho é útil em gráficos de setores. Já a frequência acumulada, que soma as frequências até certa linha, não entra no cálculo da média: serve para a mediana. Misturar as duas colunas é um erro comum de leitura de tabela.",
     "Quando a tabela tem classes, atenção ao ponto médio de classes de largura diferente: cada classe tem o seu próprio ponto médio, calculado separadamente. Se a classe é aberta, como “acima de R$ 10.000,00”, não existe ponto médio, e o enunciado precisa informar um valor representativo. Outro cuidado é com o rótulo: em classes “de 2 a 4”, “de 4 a 6”, o valor 4 pertence a apenas uma delas, convenção que o enunciado deve indicar. Para a média, essa convenção não altera o ponto médio das classes, mas altera a contagem das frequências e deve ser seguida para classificar cada observação."
    ],
    "method": [
     "Liste os valores (ou os pontos médios das classes) e suas frequências ou porcentagens.",
     "Multiplique cada valor por sua frequência (ou por sua proporção).",
     "Some os produtos e some as frequências para obter o total de observações.",
     "Divida a soma dos produtos pelo total; se usou porcentagens que somam 100%, a soma dos produtos já é a média.",
     "Confira se a média fica entre o menor e o maior valor e diga se é exata ou estimada."
    ],
    "workedExamples": [
     {
      "prompt": "Em uma unidade, o número de dependentes declarados por 30 servidores é: 0 dependente (9 servidores), 1 dependente (12), 2 dependentes (6) e 3 dependentes (3). Qual é o número médio de dependentes por servidor?",
      "steps": [
       "Total de servidores: 9+12+6+3=30, que confere com o enunciado.",
       "Produtos: 0×9=0; 1×12=12; 2×6=12; 3×3=9.",
       "Soma dos produtos: 0+12+12+9=33 dependentes no total.",
       "Média: 33/30=1,1 dependente por servidor."
      ],
      "answer": "1,1 dependente por servidor."
     },
     {
      "prompt": "Os salários de 50 empregados de uma empresa terceirizada foram agrupados em classes (limite inferior incluído e superior excluído): de R$ 2.000,00 a R$ 4.000,00, 10 empregados; de R$ 4.000,00 a R$ 6.000,00, 20 empregados; de R$ 6.000,00 a R$ 8.000,00, 15 empregados; de R$ 8.000,00 a R$ 10.000,00, 5 empregados. Estime o salário médio usando o ponto médio de cada classe.",
      "steps": [
       "Pontos médios: R$ 3.000,00; R$ 5.000,00; R$ 7.000,00; R$ 9.000,00.",
       "Produtos: 3.000×10=30.000; 5.000×20=100.000; 7.000×15=105.000; 9.000×5=45.000.",
       "Soma dos produtos: 30.000+100.000+105.000+45.000=280.000.",
       "Média estimada: 280.000/50=5.600, ou seja, R$ 5.600,00.",
       "Como foram usados pontos médios, o valor é uma estimativa e não a média exata."
      ],
      "answer": "Aproximadamente R$ 5.600,00."
     },
     {
      "prompt": "Em um grupo de candidatos, as notas e suas proporções são: nota 4, 20% dos candidatos; nota 6, 30%; nota 8, uma proporção x; nota 10, uma proporção y. Sabe-se que x+y=50% e que a nota média é 7,0. Determine x e y.",
      "steps": [
       "Escreva a média com proporções: 4×0,20+6×0,30+8x+10y=7,0.",
       "Contribuições conhecidas: 0,8+1,8=2,6; logo 8x+10y=4,4.",
       "Como x+y=0,5, temos y=0,5−x.",
       "Substituindo: 8x+10×(0,5−x)=4,4, ou seja, 8x+5−10x=4,4, o que dá 5−2x=4,4 e x=0,3.",
       "Então y=0,5−0,3=0,2.",
       "Conferência: 0,8+1,8+2,4+2,0=7,0."
      ],
      "answer": "x = 30% e y = 20%."
     }
    ],
    "pitfall": "Dividir a soma dos produtos pelo número de linhas da tabela (quantidade de valores distintos), e não pelo total de observações. Em uma tabela com 4 linhas e 30 observações, o divisor é 30. Confira sempre a soma da coluna de frequências antes de dividir.",
    "tables": [
     {
      "caption": "Salários em classes",
      "headers": [
       "Classe (R$)",
       "Ponto médio (R$)",
       "Frequência",
       "Ponto médio × frequência (R$)"
      ],
      "rows": [
       [
        "2.000 a 4.000",
        "3.000",
        "10",
        "30.000"
       ],
       [
        "4.000 a 6.000",
        "5.000",
        "20",
        "100.000"
       ],
       [
        "6.000 a 8.000",
        "7.000",
        "15",
        "105.000"
       ],
       [
        "8.000 a 10.000",
        "9.000",
        "5",
        "45.000"
       ],
       [
        "Total",
        "—",
        "50",
        "280.000"
       ]
      ]
     }
    ],
    "resumo": {
     "title": "Tabelas de frequência",
     "text": "Média = soma de (valor × frequência) dividida pelo total de observações; em classes, use o ponto médio e lembre que o resultado é estimativa.",
     "bizu": "Divida pela soma das frequências, nunca pelo número de linhas."
    }
   },
   {
    "title": "Mediana em profundidade: pares, ímpares, tabelas e valores extremos",
    "paragraphs": [
     "A mediana divide a lista ordenada em duas metades com o mesmo número de elementos. Se n é ímpar, existe um elemento exatamente no meio, na posição (n+1)/2. Se n é par, não há elemento no meio, e a mediana é a média dos dois valores centrais, nas posições n/2 e n/2+1. Esses dois valores podem ser iguais, e então a mediana é esse valor, ou diferentes, e então a mediana é um valor intermediário que talvez ninguém tenha registrado. A etapa que mais derruba candidatos é esquecer de ordenar antes de procurar as posições.",
     "A principal vantagem da mediana é sua resistência a valores extremos. Em uma lista de salários de uma unidade, um único salário muito alto aumenta bastante a média, mas deixa a mediana praticamente onde estava, pois a mediana só olha para a posição. Assim, quando a pergunta é “quanto ganha um servidor típico?”, a mediana costuma ser mais honesta. Mas ela também tem limite: não usa a informação sobre quanto os valores se afastam, e por isso não é a medida certa quando se quer repartir um total em partes iguais.",
     "Em tabelas de frequência, a mediana é encontrada pela acumulada. Calcule n somando as frequências, determine a posição central (ou as duas) e vá somando frequências linha a linha até alcançar essa posição. Não é preciso escrever a lista inteira. Em problemas com acréscimo ou retirada de valores, o total n muda, e com ele as posições centrais: refaça sempre a contagem. O número de valores que precisam ser acrescentados para mover a mediana para outra linha da tabela pode ser calculado por desigualdades sobre a posição."
    ],
    "example": "Exemplo resolvido: em 3, 9, 4, 8, a lista ordenada é 3, 4, 8, 9 e a mediana é (4+8)/2=6; a média também é 6. Se o 9 for trocado por 90, a mediana continua 6, mas a média passa a (3+4+8+90)/4=26,25.",
    "development": [
     "Uma consequência prática da definição é que, na lista ordenada, a mediana tem sempre pelo menos metade dos valores menores ou iguais a ela e pelo menos metade maiores ou iguais. Isso permite concluir coisas sem conhecer todos os valores. Se são 9 valores e a mediana é 12, sabemos que pelo menos 5 valores são menores ou iguais a 12 e pelo menos 5 são maiores ou iguais a 12, ainda que não saibamos mais nada. Em problemas de “mediana possível”, é essa propriedade que limita as respostas.",
     "Há duas situações de fronteira para guardar. A primeira é a lista com n par cujas duas posições centrais são iguais: a mediana é um valor observado e o problema fica simples. A segunda é quando se acrescenta um valor à lista e a posição central muda de lado: nessa troca de ímpar para par, a mediana deixa de ser um elemento e passa a ser a média de dois vizinhos. Para a mediana de uma tabela com frequências muito desiguais, uma linha de frequência grande pode conter as duas posições centrais, de modo que as demais linhas não interferem."
    ],
    "method": [
     "Ordene os valores (ou confira que a tabela está em ordem crescente).",
     "Calcule n e determine a posição central: uma posição se n é ímpar, duas se n é par.",
     "Localize os valores nessas posições, usando as acumuladas em tabelas.",
     "Se n é par, calcule a média dos dois valores centrais.",
     "Em acréscimos e retiradas, atualize n, reordene e repita a busca das posições."
    ],
    "workedExamples": [
     {
      "prompt": "Os salários mensais de 7 servidores de uma unidade, em reais, são 2.000, 2.500, 3.000, 3.500, 4.000, 4.500 e 22.500. Calcule média e mediana. Depois, retire o salário de 22.500 e recalcule as duas medidas para os 6 servidores restantes.",
      "steps": [
       "Com 7 valores já ordenados, a mediana é a 4ª posição: R$ 3.500,00.",
       "Soma: 2.000+2.500+3.000+3.500+4.000+4.500+22.500=42.000; média: 42.000/7=6.000, ou seja, R$ 6.000,00.",
       "A média (6.000) é maior que seis dos sete salários, puxada pelo valor extremo de 22.500.",
       "Sem o maior salário, restam 6 valores com soma 42.000−22.500=19.500; média: 19.500/6=3.250.",
       "Mediana dos 6 valores: posições 3ª e 4ª, 3.000 e 3.500; mediana=(3.000+3.500)/2=3.250.",
       "Com o valor extremo, a média era 6.000 e a mediana 3.500; sem ele, ambas valem 3.250."
      ],
      "answer": "Com os 7: média R$ 6.000,00 e mediana R$ 3.500,00. Com os 6: média e mediana de R$ 3.250,00."
     },
     {
      "prompt": "Os tempos, em dias, para cumprimento de seis mandados, já ordenados, são 4, 6, 9, x, 15 e 20, com 9≤x≤15. A mediana desses seis tempos é 11. Qual é o valor de x? Se for acrescentado um sétimo mandado, cumprido em 2 dias, qual será a nova mediana?",
      "steps": [
       "Com n=6, as posições centrais são a 3ª e a 4ª, que contêm 9 e x.",
       "A mediana é (9+x)/2=11, então 9+x=22 e x=13.",
       "Conferência: 9≤13≤15, compatível com a ordenação dada.",
       "Lista com o novo valor: 2, 4, 6, 9, 13, 15, 20 (já ordenada); n=7, posição central: a 4ª.",
       "A 4ª posição contém 9, logo a nova mediana é 9 dias.",
       "Observação: a mediana caiu de 11 para 9, porque o valor acrescentado (2) ficou abaixo das duas posições centrais e deslocou a posição central para a esquerda."
      ],
      "answer": "x = 13 e a nova mediana é 9 dias."
     },
     {
      "prompt": "Em uma tabela, os valores 10, 20, 30 e 40 aparecem com frequências 6, 9, 4 e 3, respectivamente. Qual é a mediana? Quantos valores iguais a 40, no mínimo, precisam ser acrescentados para que a mediana passe a ser 30?",
      "steps": [
       "Total inicial: 6+9+4+3=22; posições centrais: 11ª e 12ª. Acumuladas: 6, 15, 19, 22; ambas pertencem ao valor 20, então a mediana é 20.",
       "O valor 30 ocupa as posições 16 a 19 (acumuladas 15 e 19). Acrescentar m valores 40 faz o total ser n=22+m e não altera as posições dos valores anteriores.",
       "Para a mediana ser 30 com n ímpar, a posição (n+1)/2 deve estar entre 16 e 19; com n par, as posições n/2 e n/2+1 devem estar ambas entre 16 e 19.",
       "Teste de m=8 (n=30): posições 15ª e 16ª, valores 20 e 30; mediana=(20+30)/2=25, que não é 30.",
       "Teste de m=9 (n=31): posição 16ª, que contém 30; mediana=30.",
       "Logo, o menor m é 9."
      ],
      "answer": "Mediana inicial 20; é preciso acrescentar, no mínimo, 9 valores iguais a 40."
     }
    ],
    "pitfall": "Calcular a mediana sem ordenar, ou, em tabela de frequência, fazer a média dos valores das linhas (por exemplo, a média de 10, 20, 30 e 40) em vez de buscar as posições centrais pelas frequências acumuladas. Outro erro frequente é achar que, após acrescentar um valor, a mediana é sempre o novo valor ou a mesma de antes.",
    "tables": [
     {
      "caption": "Efeito do valor extremo",
      "headers": [
       "Situação",
       "Média (R$)",
       "Mediana (R$)"
      ],
      "rows": [
       [
        "7 salários, com o de 22.500",
        "6.000,00",
        "3.500,00"
       ],
       [
        "6 salários, sem o de 22.500",
        "3.250,00",
        "3.250,00"
       ]
      ]
     }
    ],
    "resumo": {
     "title": "Mediana em profundidade",
     "text": "Ordene; com n ímpar use a posição (n+1)/2, com n par a média das posições n/2 e n/2+1; em tabelas, use a frequência acumulada.",
     "bizu": "Ao acrescentar ou retirar valores, refaça n e as posições centrais."
    }
   },
   {
    "title": "Moda e comparação das três medidas",
    "paragraphs": [
     "A moda é o valor, ou a categoria, de maior frequência. Uma lista com uma única moda é unimodal; com duas modas empatadas, bimodal; com mais de duas, multimodal. Quando nenhum valor se repete, adotamos neste curso a convenção de que a distribuição é amodal, isto é, sem moda. A palavra “moda” designa o valor mais frequente, e não quantas vezes ele aparece; se o valor 8 aparece 5 vezes, a moda é 8. Como o conceito só envolve contagem, a moda pode ser calculada também para dados qualitativos, como o tipo de ação ou o setor de lotação.",
     "Para escolher entre as três medidas, pergunte o que a situação pede. Para repartir um total igualmente ou prever uma soma, use a média. Para descrever o elemento “do meio” sem ser distorcido por valores extremos, use a mediana. Para saber qual valor ou categoria é mais frequente, como o tipo de petição mais protocolado, use a moda. Em dados qualitativos, só a moda faz sentido. Em dados numéricos com valores extremos, média e mediana se afastam, e essa distância é um sinal sobre a forma da distribuição.",
     "Em uma distribuição simétrica, média e mediana são iguais (e, em formas unimodais, também iguais à moda). Quando há alguns valores muito altos que puxam a média para cima, ela fica maior que a mediana: a distribuição é assimétrica à direita, com uma “cauda” de valores altos, e tipicamente moda < mediana < média. Quando há alguns valores muito baixos, a média fica menor que a mediana, e a assimetria é à esquerda. Mas atenção: esse é um indício, não uma regra sem exceção, e a coincidência numérica das medidas não garante simetria."
    ],
    "example": "Exemplo resolvido: em 1, 2, 2, 3, 12 a moda é 2, a mediana é 2 e a média é (1+2+2+3+12)/5=4; a média é maior que a mediana, por causa do valor 12, que forma uma cauda à direita.",
    "development": [
     "A comparação das medidas é feita de forma qualitativa e numérica. Se a média é muito maior que a mediana, procure um valor extremo alto; se é muito menor, um valor extremo baixo. Se as três coincidem, a distribuição é compatível com simetria. Ao retirar o valor extremo, é de se esperar que as medidas se aproximem, mas a mediana e a moda mudam pouco, e a média muda muito. Esse comportamento é uma boa forma de testar a sua interpretação do enunciado.",
     "Nos problemas de construção, em que se pede o maior ou o menor valor possível sob condições de média, mediana e moda, o método é montar a lista ordenada com posições e testar cada restrição. A mediana fixa o valor de uma posição; a moda obriga a repetição de um valor sem que outro a iguale; a média fixa a soma. Para maximizar um valor, os demais devem ser os menores possíveis, respeitando as condições, inclusive a de que nenhum outro valor empate com a moda. Verifique a resposta final contra todas as condições, uma por uma."
    ],
    "method": [
     "Organize os dados em ordem crescente e conte a frequência de cada valor.",
     "Identifique as modas (valores de maior frequência, se maior que 1) e a mediana (por posição).",
     "Calcule a média pela soma dos valores dividida por n.",
     "Compare as três medidas: média maior que mediana sugere cauda à direita; menor, cauda à esquerda.",
     "Escolha a medida que responde à pergunta do enunciado e justifique em uma frase."
    ],
    "workedExamples": [
     {
      "prompt": "Classifique cada lista quanto à moda e calcule a média e a mediana: A: 4, 7, 9, 12. B: 3, 3, 5, 8, 8, 9. C: 6, 6, 6, 7, 7, 10.",
      "steps": [
       "Lista A: nenhum valor se repete, então é amodal (sem moda). Mediana: (7+9)/2=8; média: 32/4=8.",
       "Lista B: 3 e 8 aparecem duas vezes, enquanto os demais aparecem uma vez; é bimodal, com modas 3 e 8. Mediana: posições 3ª e 4ª, 5 e 8, logo (5+8)/2=6,5; média: 36/6=6.",
       "Lista C: o 6 aparece três vezes e o 7 duas; moda única: 6 (unimodal). Mediana: posições 3ª e 4ª, 6 e 7, logo 6,5; média: 42/6=7.",
       "Em C, moda<mediana<média (6<6,5<7), compatível com assimetria à direita; em B, a média (6) é menor que a mediana (6,5)."
      ],
      "answer": "A: amodal, mediana 8, média 8. B: bimodal (3 e 8), mediana 6,5, média 6. C: unimodal (6), mediana 6,5, média 7."
     },
     {
      "prompt": "Os prazos, em dias, para atendimento de nove solicitações foram: 4, 5, 5, 5, 6, 7, 8, 10 e 40. Calcule moda, mediana e média, diga qual medida melhor representa o prazo típico e mostre o que muda ao retirar o prazo de 40 dias.",
      "steps": [
       "Moda: o 5 aparece três vezes e é a única moda.",
       "Mediana: com n=9, é a 5ª posição da lista ordenada: 6 dias.",
       "Média: (4+5+5+5+6+7+8+10+40)/9=90/9=10 dias.",
       "Como moda (5) < mediana (6) < média (10), a distribuição é assimétrica à direita, por causa do prazo de 40 dias. O prazo típico é melhor representado pela mediana (6) ou pela moda (5), e não pela média, que é maior do que oito dos nove prazos.",
       "Sem o valor 40, restam 8 valores com soma 50: média=50/8=6,25. Mediana: posições 4ª e 5ª, valores 5 e 6, logo 5,5. A moda continua 5.",
       "A média caiu de 10 para 6,25; a mediana, de 6 para 5,5; a moda não mudou."
      ],
      "answer": "Moda 5, mediana 6, média 10; a mediana (ou a moda) representa melhor. Sem o 40: moda 5, mediana 5,5 e média 6,25."
     },
     {
      "prompt": "Sete números inteiros positivos têm média 7, mediana 6 e moda única igual a 5. Qual é o maior valor que o maior deles pode assumir?",
      "steps": [
       "Soma dos sete números: 7×7=49. A lista ordenada é a, b, c, 6, e, f, g, com a≤b≤c≤6≤e≤f≤g.",
       "A moda 5 deve ser única: o 5 aparece pelo menos duas vezes e nenhum outro valor aparece tanto quanto ele.",
       "Se c=6, o 6 apareceria ao menos duas vezes (nas posições c e 4ª) e, como o 5 só poderia aparecer nas posições a e b, empataria com ele; logo c≤5, e o 6 aparece uma única vez, se e≥7.",
       "Para maximizar g, os outros números devem ser os menores possíveis: a=1, b=5 e c=5 (o 5 aparece duas vezes), e o 6 deve aparecer uma só vez, portanto e≥7.",
       "Além disso, e e f não podem ser iguais, senão empatariam com o 5 (dois valores repetidos duas vezes): o menor par é e=7 e f=8.",
       "Então g=49−(1+5+5+6+7+8)=49−32=17.",
       "Conferência: lista 1, 5, 5, 6, 7, 8, 17; soma 49, média 7; mediana 6; moda única 5."
      ],
      "answer": "O maior valor possível é 17."
     }
    ],
    "pitfall": "Concluir que, se média e mediana coincidem, a distribuição é necessariamente simétrica, ou dizer que a moda é “a frequência” em vez do valor. Também é erro escolher a média para descrever o “típico” em dados com valores extremos, ou calcular média e mediana de uma variável qualitativa.",
    "tables": [
     {
      "caption": "Qual medida usar",
      "headers": [
       "Situação",
       "Medida mais indicada",
       "Motivo"
      ],
      "rows": [
       [
        "Repartir um total em partes iguais",
        "Média",
        "usa todos os valores e preserva a soma"
       ],
       [
        "Descrever o valor central com extremos",
        "Mediana",
        "não é afetada pela distância dos extremos"
       ],
       [
        "Categoria mais comum (dado qualitativo)",
        "Moda",
        "só depende de contagem"
       ],
       [
        "Média maior que a mediana",
        "Cauda à direita",
        "valores altos puxam a média"
       ]
      ]
     }
    ],
    "resumo": {
     "title": "Moda e comparação",
     "text": "A moda é o valor mais frequente (sem moda se nenhum valor se repete); média maior que mediana sugere cauda à direita, média menor sugere cauda à esquerda.",
     "bizu": "Valor extremo mexe na média, não na mediana nem na moda."
    }
   }
  ]
 },
 "M15": {
  "extras": [
   {
    "capitulo": 1,
    "development": [
     "Dispersão é uma ideia de distância: quanto os valores ficam longe de um ponto de referência, em geral a média. Por isso, falar em \"mais disperso\", \"menos regular\" ou \"mais heterogêneo\" sempre pede uma comparação entre grupos e uma medida escolhida. Quando o enunciado diz apenas \"mais disperso\", a leitura natural é: os valores estão, em média, mais afastados do centro. Todas as medidas deste módulo (amplitude, desvio médio, variância e desvio padrão) zeram juntas quando os dados são todos iguais e crescem quando os dados se afastam do centro. Elas só discordam na intensidade: a amplitude olha dois valores, o desvio médio olha todos de forma linear e a variância olha todos de forma quadrática.",
     "Há ainda a pergunta sobre o que é o \"centro\". Dois grupos podem ter médias diferentes e mesmo assim ter a mesma dispersão: basta que um seja o outro deslocado para cima. Por isso, a dispersão não depende de onde os dados estão, e sim de como eles estão espalhados entre si. Em prova, o primeiro cuidado é separar as duas perguntas: \"qual grupo tem média maior?\" e \"qual grupo é mais regular?\". São perguntas independentes e podem ter respostas opostas. Guarde também que dispersão não indica qualidade: um tempo de atendimento mais disperso pode ser pior, mas um conjunto de notas mais disperso apenas mostra turmas mais desiguais."
    ],
    "workedExamples": [
     {
      "prompt": "Os tempos de atendimento, em minutos, dos quatro protocolos de cada um de dois guichês no dia foram: guichê A: 8, 10, 12 e 10; guichê B: 4, 10, 10 e 16. Esses são todos os atendimentos do dia, então trate cada conjunto como POPULAÇÃO (divisor N). Compare a amplitude, o desvio médio absoluto e a variância dos dois guichês.",
      "steps": [
       "Médias: A = (8+10+12+10)/4 = 40/4 = 10 min; B = (4+10+10+16)/4 = 40/4 = 10 min. As médias são iguais, então a comparação só depende da dispersão.",
       "Amplitude: A = 12 − 8 = 4 min; B = 16 − 4 = 12 min.",
       "Desvios de A: −2, 0, 2, 0. Desvio médio: (2+0+2+0)/4 = 4/4 = 1 min. Quadrados: 4+0+4+0 = 8; variância populacional = 8/4 = 2 min^2.",
       "Desvios de B: −6, 0, 0, 6. Desvio médio: (6+0+0+6)/4 = 12/4 = 3 min. Quadrados: 36+0+0+36 = 72; variância populacional = 72/4 = 18 min^2.",
       "As três medidas concordam: B tem amplitude 3 vezes maior, desvio médio 3 vezes maior e variância 9 vezes maior. A variância cresce mais rápido porque eleva os afastamentos ao quadrado (3^2 = 9)."
      ],
      "answer": "Médias iguais (10 min). A: amplitude 4, desvio médio 1, variância 2. B: amplitude 12, desvio médio 3, variância 18. O guichê B é mais disperso (menos regular)."
     },
     {
      "prompt": "Dois conjuntos de cinco valores, ambos tratados como POPULAÇÃO (divisor N), têm média 10. O conjunto C é 2, 6, 10, 14 e 18. O conjunto D tem os valores 8, 9, 11 e 12 e um quinto valor x desconhecido. Descubra x e diga quantas vezes a variância de C é maior que a de D.",
      "steps": [
       "Média de C: (2+6+10+14+18)/5 = 50/5 = 10, como dito.",
       "Para D, a média 10 com 5 valores exige soma 50. Os quatro valores conhecidos somam 8+9+11+12 = 40; logo x = 50 − 40 = 10.",
       "Desvios de C: −8, −4, 0, 4, 8. Quadrados: 64+16+0+16+64 = 160. Variância populacional de C = 160/5 = 32.",
       "Desvios de D (valores 8, 9, 10, 11, 12): −2, −1, 0, 1, 2. Quadrados: 4+1+0+1+4 = 10. Variância populacional de D = 10/5 = 2.",
       "Razão: 32/2 = 16. Conferência pelas amplitudes: 16 − 2 = 14 contra 12 − 8 = 4; a razão das amplitudes é 3,5, e a das variâncias é 16, bem maior, por causa do quadrado."
      ],
      "answer": "x = 10; variância de C = 32 e de D = 2; a variância de C é 16 vezes a de D."
     }
    ],
    "tables": [
     {
      "caption": "Quatro leituras da mesma pergunta \"qual é mais disperso?\"",
      "headers": [
       "Medida",
       "O que olha",
       "Sensível a valor extremo?",
       "Unidade"
      ],
      "rows": [
       [
        "Amplitude",
        "Só o maior e o menor valor",
        "Muito",
        "Mesma dos dados"
       ],
       [
        "Desvio médio absoluto",
        "Todos os valores, distância linear",
        "Pouco",
        "Mesma dos dados"
       ],
       [
        "Variância",
        "Todos os valores, distância ao quadrado",
        "Muito",
        "Unidade ao quadrado"
       ],
       [
        "Desvio padrão",
        "Raiz quadrada da variância",
        "Muito",
        "Mesma dos dados"
       ]
      ]
     }
    ]
   },
   {
    "capitulo": 2,
    "development": [
     "A amplitude tem três casos de fronteira que aparecem em enunciados. O primeiro é a tabela de frequências: a amplitude usa o maior e o menor valor que realmente aparecem, isto é, com frequência maior que zero. Uma linha com frequência 0 não conta, mesmo que esteja na tabela. O segundo caso é a inclusão de um novo valor: se ele cair entre o mínimo e o máximo, a amplitude não muda; se cair fora, a amplitude cresce até a nova distância entre os extremos. O terceiro é o conjunto com um único valor distinto, em que máximo e mínimo coincidem e a amplitude vale zero.",
     "Os valores negativos exigem atenção com os sinais: a amplitude de −3, 2 e 5 é 5 − (−3) = 8, e não 5 − 3. Temperaturas, saldos e variações costumam trazer números negativos de propósito. Outro ponto é a diferença entre amplitude total e amplitude de classe: a primeira é máximo menos mínimo dos dados; a segunda é a largura de um intervalo da tabela (limite superior menos limite inferior da classe). Em dados já agrupados em classes sem os valores originais, a amplitude total só pode ser aproximada pelos limites das classes, e o enunciado costuma dizer isso."
    ],
    "workedExamples": [
     {
      "prompt": "Os prazos de seis processos, em dias, são 12, 7, 15, 9, 7 e 20 (conjunto completo, ou seja, POPULAÇÃO). Calcule a amplitude. Depois, o processo de 20 dias é retirado do conjunto; calcule a nova amplitude e em que porcentagem ela diminuiu em relação à amplitude original.",
      "steps": [
       "Maior prazo: 20. Menor prazo: 7 (aparece duas vezes, mas conta como um só valor mínimo). Amplitude original = 20 − 7 = 13 dias.",
       "Sem o valor 20, os dados são 12, 7, 15, 9 e 7. O maior passa a ser 15 e o menor continua 7. Nova amplitude = 15 − 7 = 8 dias.",
       "Diminuição: 13 − 8 = 5 dias.",
       "Porcentagem em relação à amplitude original (base 13): 5/13 = 0,3846..., ou seja, cerca de 38,46%."
      ],
      "answer": "Amplitude original 13 dias; nova amplitude 8 dias; redução de cerca de 38,46% (base: a amplitude original)."
     },
     {
      "prompt": "Uma tabela de pontuações (conjunto completo, POPULAÇÃO) tem os valores 3 (frequência 2), 5 (frequência 0), 8 (frequência 4) e 11 (frequência 1). (a) Qual a amplitude? (b) Cada pontuação passa a ser y = −2x + 20; qual a amplitude dos novos valores? (c) Acrescentando-se UM único valor v ao conjunto original, quais valores de v fazem a amplitude ser 12?",
      "steps": [
       "(a) O valor 5 tem frequência 0 e não existe no conjunto. Os valores presentes são 3, 8 e 11. Amplitude = 11 − 3 = 8.",
       "(b) Transformando: 3 vira −2×3+20 = 14; 8 vira 4; 11 vira −2. Agora o máximo é 14 e o mínimo é −2. Amplitude = 14 − (−2) = 16 = |−2| × 8. A multiplicação por −2 inverte a ordem, mas a amplitude continua positiva.",
       "(c) Seja v o valor acrescentado. Se v estiver entre 3 e 11, a amplitude continua 8. Se v for maior que 11: v − 3 = 12, logo v = 15. Se v for menor que 3: 11 − v = 12, logo v = −1.",
       "Verificação: com 15, os extremos são 3 e 15 (diferença 12); com −1, os extremos são −1 e 11 (diferença 12)."
      ],
      "answer": "(a) 8; (b) 16; (c) o valor acrescentado pode ser 15 ou −1."
     }
    ]
   },
   {
    "capitulo": 3,
    "development": [
     "O desvio médio absoluto depende da referência escolhida. Neste curso a referência é sempre a média aritmética. Existe também o desvio médio em relação à mediana, e o enunciado precisa dizer qual deles pede; sem essa informação, adota-se a média. Um fato útil: entre todos os pontos de referência possíveis, a mediana é a que torna a soma das distâncias absolutas a menor possível. Por isso, o desvio médio em relação à mediana nunca é maior que o desvio médio em relação à média. Em conjuntos simétricos, os dois resultados coincidem.",
     "Há também uma relação de tamanho entre as medidas: o desvio médio absoluto (em torno da média) nunca é maior que o desvio padrão populacional do mesmo conjunto. Eles são iguais apenas quando todos os desvios têm o mesmo módulo, como em 4, 8, 4, 8. Na prática, isso serve de teste de sanidade: se você calculou um desvio médio maior que o desvio padrão, houve erro de conta. Por fim, o desvio médio é menos sensível a valores extremos que a variância, porque não eleva as distâncias ao quadrado; um valor muito distante aumenta a soma só na proporção da sua distância."
    ],
    "workedExamples": [
     {
      "prompt": "Os tempos de resposta de oito ofícios, em dias, estão na tabela: 4 dias (1 ofício), 8 dias (1 ofício), 10 dias (4 ofícios) e 14 dias (2 ofícios). Esses são todos os ofícios do período (POPULAÇÃO, divisor N = 8). Calcule a média e o desvio médio absoluto em torno da média.",
      "steps": [
       "Soma ponderada: 4×1 + 8×1 + 10×4 + 14×2 = 4 + 8 + 40 + 28 = 80. Média = 80/8 = 10 dias.",
       "Distâncias à média: |4−10| = 6; |8−10| = 2; |10−10| = 0; |14−10| = 4.",
       "Contribuições (distância × frequência): 6×1 = 6; 2×1 = 2; 0×4 = 0; 4×2 = 8. Soma = 16.",
       "Desvio médio = 16/8 = 2 dias. O divisor é 8 (número de ofícios), e não 4 (número de valores distintos)."
      ],
      "answer": "Média 10 dias; desvio médio absoluto 2 dias."
     },
     {
      "prompt": "Uma população de cinco servidores tem produtividade média de 8 processos por semana. Quatro deles produziram 2, 6, 8 e 12 processos. (a) Quanto produziu o quinto? (b) Calcule o desvio médio absoluto e a variância populacional (divisor N = 5). (c) Confira que o desvio médio é menor que o desvio padrão.",
      "steps": [
       "(a) Média 8 com 5 valores dá soma 40. Os quatro conhecidos somam 2+6+8+12 = 28, então o quinto produziu 40 − 28 = 12.",
       "(b) Desvios em relação a 8: −6, −2, 0, 4, 4 (a soma é 0, o que confirma a média). Distâncias absolutas: 6, 2, 0, 4, 4, somando 16. Desvio médio = 16/5 = 3,2 processos.",
       "Quadrados dos desvios: 36 + 4 + 0 + 16 + 16 = 72. Variância populacional = 72/5 = 14,4 processos^2.",
       "(c) Desvio padrão populacional = raiz quadrada de 14,4, que é aproximadamente 3,79. Como 3,2 é menor que 3,79, a relação esperada se confirma."
      ],
      "answer": "O quinto produziu 12; desvio médio 3,2; variância populacional 14,4; desvio padrão cerca de 3,79."
     }
    ]
   },
   {
    "capitulo": 4,
    "development": [
     "Por que a variância amostral divide por n−1? Quando calculamos os desvios em relação à média da própria amostra, essa média foi \"ajustada\" aos dados e fica, em geral, mais perto deles do que a verdadeira média da população. Isso faz a soma dos quadrados dos desvios ser, em média, um pouco pequena demais. Dividir por n−1 em vez de n corrige essa tendência. Outra forma de enxergar: dados os n−1 primeiros desvios e sabendo que a soma deles é zero, o último desvio já está determinado, então só n−1 desvios são \"livres\".",
     "Na leitura do enunciado, procure palavras como \"todos os servidores do setor\" ou \"conjunto completo\" (população, divisor N) e \"amostra sorteada\" ou \"estimar\" (amostra, divisor n−1). Se o texto pede a variância \"dos valores apresentados\" sem falar em estimativa, o divisor é N, a menos que o enunciado defina outra regra. Um dado importante: com n−1 no denominador, uma amostra de um único valor não tem variância definida, pois a divisão seria por zero. Já com n muito grande, os dois divisores ficam quase iguais. Uma forma segura de trabalhar é calcular sempre a soma dos quadrados dos desvios (SQ) primeiro e só depois escolher o divisor."
    ],
    "workedExamples": [
     {
      "prompt": "Os tempos, em minutos, de uma AMOSTRA sorteada de cinco atendimentos foram 6, 8, 10, 12 e 14. Calcule a variância amostral (divisor n−1) e o desvio padrão amostral. Para contraste, informe também a variância se esses cinco valores fossem a população inteira.",
      "steps": [
       "Média = (6+8+10+12+14)/5 = 50/5 = 10 min.",
       "Desvios: −4, −2, 0, 2, 4 (soma 0). Quadrados: 16, 4, 0, 4, 16. SQ = 40.",
       "Como é AMOSTRA, o divisor é n−1 = 4: s^2 = 40/4 = 10 min^2.",
       "Desvio padrão amostral s = raiz quadrada de 10, aproximadamente 3,16 min.",
       "Contraste: se fosse POPULAÇÃO, a variância seria 40/5 = 8 min^2 (desvio padrão cerca de 2,83 min). O divisor menor (n−1) produz o valor maior."
      ],
      "answer": "Amostra: s^2 = 10 min^2 e s ≈ 3,16 min. (Como população: 8 min^2.)"
     },
     {
      "prompt": "Um conjunto de seis valores tem soma 60 e soma dos quadrados 696. Calcule a variância supondo (a) POPULAÇÃO (divisor N) e (b) AMOSTRA (divisor n−1). Os valores são 2, 10, 10, 10, 14 e 14.",
      "steps": [
       "Média = 60/6 = 10.",
       "Soma dos quadrados dos desvios pelo atalho: SQ = Σx^2 − n × média^2 = 696 − 6×100 = 696 − 600 = 96.",
       "Conferência pelos desvios: −8, 0, 0, 0, 4, 4; quadrados 64+0+0+0+16+16 = 96. ✓",
       "(a) População: 96/6 = 16, e o desvio padrão é a raiz quadrada de 16, isto é, 4.",
       "(b) Amostra: 96/5 = 19,2; o desvio padrão amostral é a raiz quadrada de 19,2, aproximadamente 4,38."
      ],
      "answer": "População: variância 16 (desvio padrão 4). Amostra: variância 19,2 (desvio padrão ≈ 4,38)."
     }
    ]
   },
   {
    "capitulo": 5,
    "development": [
     "Mudar de unidade é uma transformação y = a×x. Converter minutos em horas é multiplicar por a = 1/60; converter reais em centavos é multiplicar por 100. Como o desvio padrão é multiplicado por |a|, ele acompanha a unidade: se o desvio padrão era de 6 minutos, passa a ser 6/60 = 0,1 hora, e isso descreve a mesma dispersão. A variância, porém, é multiplicada por a^2 e muda muito mais: 36 min^2 viram 36/3600 = 0,01 h^2. Em transformações lineares, o número da variância \"salta\" por a^2, e o do desvio padrão, só por |a|.",
     "A padronização é uma transformação especial: z = (x − média)/desvio padrão. Ela subtrai o centro e divide pela escala, resultando em um conjunto com média 0 e desvio padrão 1. O valor z diz quantos desvios padrão cada observação está acima (z positivo) ou abaixo (z negativo) da média. Se um servidor tem 40 processos, a média é 32 e o desvio padrão é 4, então z = (40 − 32)/4 = 2, isto é, 2 desvios padrão acima da média. Esse raciocínio é útil para comparar posições em grupos com médias e dispersões diferentes."
    ],
    "workedExamples": [
     {
      "prompt": "O tempo de tramitação, em minutos, de uma POPULAÇÃO de processos tem média 20 e desvio padrão populacional 6. Cada tempo é convertido para horas (y = x/60). Calcule a média, a variância e o desvio padrão em horas.",
      "steps": [
       "Média em horas: 20/60 = 1/3 de hora, ou 20 min.",
       "Variância original: 6^2 = 36 min^2.",
       "Fator a = 1/60. Variância nova = a^2 × 36 = 36/3600 = 0,01 h^2.",
       "Desvio padrão novo = |a| × 6 = 6/60 = 0,1 h (também é a raiz quadrada de 0,01 = 0,1). Em minutos, 0,1 h = 6 min, a mesma dispersão."
      ],
      "answer": "Média 1/3 h; variância 0,01 h^2; desvio padrão 0,1 h (= 6 min)."
     },
     {
      "prompt": "Uma POPULAÇÃO x tem média 50 e variância 64. Define-se y = −0,5x + 30. Calcule a média, a variância e o desvio padrão de y e a média dos quadrados de y (Σy^2/N).",
      "steps": [
       "Média de y: −0,5 × 50 + 30 = −25 + 30 = 5.",
       "Variância de y: a^2 × 64 = 0,25 × 64 = 16 (o 30 não altera a dispersão).",
       "Desvio padrão de y: raiz quadrada de 16 = 4, igual a |−0,5| × raiz quadrada de 64 = 0,5 × 8 = 4. ✓",
       "Pelo atalho, variância = média dos quadrados − média^2, então média dos quadrados = 16 + 5^2 = 16 + 25 = 41."
      ],
      "answer": "y tem média 5, variância 16, desvio padrão 4 e média dos quadrados 41."
     }
    ]
   }
  ],
  "novosCapitulos": [
   {
    "title": "Amplitude, quartis e leitura de dispersão em palavras",
    "paragraphs": [
     "Antes de calcular, é preciso entender o que o enunciado quer dizer com \"mais disperso\". As palavras \"disperso\", \"heterogêneo\", \"variável\", \"irregular\" e \"espalhado\" apontam para dispersão maior. Já \"regular\", \"homogêneo\", \"uniforme\", \"estável\" e \"concentrado\" apontam para dispersão menor. Em todos os casos, a resposta é uma comparação entre dois ou mais conjuntos com a mesma unidade. Se um conjunto é mais disperso que outro segundo uma medida, ele pode não ser segundo outra; por isso, o enunciado costuma indicar a medida ou o contexto (amplitude, variância, desvio padrão) em que a comparação deve ser feita. Em prova, a armadilha é trocar a medida no meio do caminho: o texto pede variância e o aluno entrega a amplitude porque ela era mais fácil. Releia a pergunta antes de responder.",
     "A amplitude total é a forma mais rápida de medir dispersão, mas só olha o maior e o menor valor. Uma medida que ignora os valores extremos é a amplitude interquartílica, AIQ = Q3 − Q1. Os quartis dividem os dados ordenados em quatro partes com a mesma quantidade de valores: Q1 deixa cerca de 25% dos dados abaixo dele, Q2 é a mediana (50%) e Q3 deixa cerca de 75% abaixo. A AIQ mede a largura da metade central dos dados, e por isso um valor muito extremo quase não a altera. Guarde a ordem de grandeza: AIQ nunca é maior que a amplitude, pois Q3 ≤ máximo e Q1 ≥ mínimo, e as duas só coincidem em conjuntos muito pequenos ou muito concentrados nas pontas.",
     "Existem várias convenções para calcular quartis. Neste curso adotamos a das metades: ordene os dados; calcule a mediana Q2; Q1 é a mediana da metade inferior e Q3 é a mediana da metade superior. Quando n é ímpar, a mediana fica fora das duas metades (não é contada em nenhuma). Se o enunciado trouxer outra regra, use a dele. A leitura \"em palavras\" fecha o raciocínio: diga qual conjunto é mais disperso, segundo qual medida, e por quê. Quem só calcula e não interpreta erra os enunciados em que a resposta precisa ser uma conclusão. Para fixar, repita o exemplo mudando um valor central e depois um extremo: você verá que a AIQ quase não se mexe com o extremo, enquanto a amplitude acompanha cada alteração nos extremos."
    ],
    "example": "Exemplo resolvido: para os dados completos (população) 2, 4, 6, 8, 10, 12, 14 e 16, a amplitude é 16 − 2 = 14. A mediana é (8+10)/2 = 9; a metade inferior (2, 4, 6, 8) tem mediana 5 = Q1; a metade superior (10, 12, 14, 16) tem mediana 13 = Q3. Logo AIQ = 13 − 5 = 8.",
    "development": [
     "A amplitude interquartílica é muito usada para detectar valores atípicos. A regra prática é: valores abaixo de Q1 − 1,5×AIQ ou acima de Q3 + 1,5×AIQ são candidatos a atípicos. No conjunto 4, 5, 6, 7, 8, 9, 10, 11 e 60, Q1 = 5,5, Q3 = 10,5 e AIQ = 5; o limite superior é 10,5 + 1,5×5 = 18, e 60 passa muito desse limite. O enunciado só aplica essa regra se a mencionar; mas a ideia de que \"um valor extremo estica a amplitude e quase não mexe na AIQ\" cai com frequência.",
     "Também aparece a comparação de conjuntos com a mesma amplitude e dispersões internas diferentes. Dois conjuntos podem ter mínimo e máximo iguais e ainda assim um ter quase todos os valores perto do centro e o outro quase todos nas pontas. Só medidas que olham todos os valores (desvio médio, variância, desvio padrão) conseguem diferenciar. E quando os dados têm unidades distintas (reais e dias, por exemplo), nenhuma dessas medidas absolutas pode ser comparada diretamente: é preciso o coeficiente de variação, visto em outro capítulo."
    ],
    "method": [
     "Identifique a medida pedida e a unidade dos conjuntos; se forem diferentes, a comparação direta não vale.",
     "Ordene os dados e encontre mínimo, máximo e mediana.",
     "Se pedir quartis, separe as metades (excluindo a mediana quando n é ímpar) e ache Q1 e Q3.",
     "Calcule a medida pedida (amplitude ou AIQ) para cada conjunto.",
     "Conclua em palavras: qual conjunto é mais disperso segundo essa medida."
    ],
    "workedExamples": [
     {
      "prompt": "As datas de entrega, em dias, de duas equipes (conjuntos completos, tratados como POPULAÇÃO) são: equipe A: 8, 9, 10, 11 e 12; equipe B: 6, 10, 10, 10 e 14. Qual equipe é mais regular? Use amplitude e variância populacional.",
      "steps": [
       "Médias: A = 50/5 = 10; B = 50/5 = 10. Iguais.",
       "Amplitudes: A = 12 − 8 = 4; B = 14 − 6 = 8.",
       "Variância de A: desvios −2, −1, 0, 1, 2; quadrados 4+1+0+1+4 = 10; 10/5 = 2.",
       "Variância de B: desvios −4, 0, 0, 0, 4; quadrados 16+0+0+0+16 = 32; 32/5 = 6,4.",
       "A tem amplitude menor e variância menor; as duas medidas apontam o mesmo lado."
      ],
      "answer": "A equipe A é mais regular (amplitude 4 e variância 2, contra 8 e 6,4 da equipe B)."
     },
     {
      "prompt": "A equipe C entregou em 6, 6, 10, 14 e 14 dias (POPULAÇÃO, divisor N). Compare C com a equipe B do exemplo anterior (6, 10, 10, 10, 14) quanto à amplitude e quanto à variância, e explique por que as conclusões diferem.",
      "steps": [
       "Médias: C = (6+6+10+14+14)/5 = 50/5 = 10; B = 10.",
       "Amplitudes: C = 14 − 6 = 8; B = 14 − 6 = 8. São iguais.",
       "Variância de C: desvios −4, −4, 0, 4, 4; quadrados 16+16+0+16+16 = 64; 64/5 = 12,8.",
       "Variância de B: 32/5 = 6,4 (calculada antes).",
       "Razão: 12,8/6,4 = 2. Apesar de a amplitude ser igual, C concentra 4 dos 5 valores nas pontas, e B concentra 3 no centro."
      ],
      "answer": "Amplitudes iguais (8), mas a variância de C (12,8) é o dobro da de B (6,4): C é mais disperso. A amplitude não distingue os dois porque só olha os extremos."
     },
     {
      "prompt": "Os valores de nove processos (população), em dias, são 4, 5, 6, 7, 8, 9, 10, 11 e 60. (a) Calcule a amplitude e a amplitude interquartílica. (b) Repita sem o valor 60. (c) Qual das duas medidas mudou mais, em proporção?",
      "steps": [
       "(a) Ordenados, n = 9; a mediana é o 5º valor, 8. Metade inferior (sem a mediana): 4, 5, 6, 7, com mediana (5+6)/2 = 5,5 = Q1. Metade superior: 9, 10, 11, 60, com mediana (10+11)/2 = 10,5 = Q3. AIQ = 10,5 − 5,5 = 5. Amplitude = 60 − 4 = 56.",
       "(b) Sem o 60, n = 8: 4, 5, 6, 7, 8, 9, 10, 11. Mediana (7+8)/2 = 7,5. Metade inferior 4, 5, 6, 7: Q1 = 5,5. Metade superior 8, 9, 10, 11: Q3 = 9,5. AIQ = 9,5 − 5,5 = 4. Amplitude = 11 − 4 = 7.",
       "(c) Amplitude: de 56 para 7, queda de 49, ou 87,5% (49/56). AIQ: de 5 para 4, queda de 1, ou 20% (1/5)."
      ],
      "answer": "Com o 60: amplitude 56 e AIQ 5. Sem ele: amplitude 7 e AIQ 4. A amplitude caiu 87,5% e a AIQ, 20%: a AIQ é muito mais resistente ao valor extremo."
     }
    ],
    "pitfall": "Concluir que \"mais disperso\" é quem tem a maior média ou o maior valor. Dispersão não tem relação com o tamanho dos números, e sim com o afastamento entre eles. Compare sempre amplitude, desvio ou variância, e nunca a média, para responder.",
    "tables": [
     {
      "caption": "Palavras do enunciado e o que elas pedem",
      "headers": [
       "Expressão no enunciado",
       "Aponta para",
       "Como decidir"
      ],
      "rows": [
       [
        "regular, homogêneo, uniforme",
        "menor dispersão",
        "vence o conjunto de menor medida"
       ],
       [
        "variável, heterogêneo, irregular",
        "maior dispersão",
        "vence o conjunto de maior medida"
       ],
       [
        "estável, constante",
        "menor variância ou desvio padrão",
        "vence o conjunto de menor medida"
       ],
       [
        "amplitude interquartílica",
        "Q3 − Q1 (metade central)",
        "compara só a metade central dos dados"
       ]
      ]
     }
    ],
    "resumo": {
     "title": "Dispersão em palavras",
     "text": "Mais disperso significa mais afastado do centro. A amplitude olha só os extremos; a amplitude interquartílica (Q3 − Q1) olha a metade central e resiste a valores atípicos.",
     "bizu": "Mesma amplitude não quer dizer mesma dispersão: olhe todos os valores."
    }
   },
   {
    "title": "Desvio médio e variância passo a passo, com tabelas de desvios",
    "paragraphs": [
     "Quase todo problema de dispersão se resolve com uma tabela de cinco colunas: o valor x, o desvio d = x − média, o desvio absoluto |d|, o quadrado d^2 e, se houver repetições, a frequência. Os passos são sempre os mesmos. Primeiro, calcule a média, que precisa ser exata; é por isso que as contas deste módulo usam médias inteiras. Depois, preencha os desvios linha a linha. Antes de continuar, some a coluna dos desvios: o resultado tem que ser zero. Se não for, a média ou algum desvio estão errados, e não adianta seguir adiante. Esse método parece lento no começo, mas ele é a defesa mais segura contra erros de conta em provas sem calculadora, pois cada coluna pode ser conferida isoladamente.",
     "Com a tabela pronta, o desvio médio absoluto é a soma da coluna |d| dividida por N, e a variância populacional é a soma da coluna d^2 dividida por N. O desvio padrão populacional é a raiz quadrada da variância. Nos conjuntos tratados como população, o divisor é sempre N, o total de observações. Com frequências, as colunas |d| e d^2 são multiplicadas pela frequência de cada linha, e o divisor é a soma das frequências, não o número de linhas da tabela. Lembre-se: a frequência entra como multiplicador das colunas, e a soma das frequências substitui N. Sem essa troca, a tabela com valores repetidos dará resultados errados mesmo com todas as contas corretas.",
     "A tabela também funciona como instrumento de verificação. Além da soma dos desvios igual a zero, vale a relação DM ≤ desvio padrão: se o desvio médio é maior que o desvio padrão, há erro. E o atalho Σx^2/N − média^2 deve dar o mesmo resultado da coluna d^2. Em prova, escolha a conta mais curta para o dado: com valores pequenos e média inteira, a tabela de desvios é a mais segura; com valores grandes, o atalho evita quadrados enormes, desde que a média seja usada sem arredondamento. Em provas, o mais comum é pedirem apenas um resultado final, mas a tabela completa é o caminho mais curto até ele e deixa visível em que linha um eventual erro aconteceu."
    ],
    "example": "Exemplo resolvido: população 5, 7, 9, 13 e 16 (N = 5). Média = 50/5 = 10. Desvios: −5, −3, −1, 3, 6 (soma 0). Valores absolutos somam 5+3+1+3+6 = 18, então DM = 18/5 = 3,6. Quadrados: 25+9+1+9+36 = 80, variância populacional = 80/5 = 16 e desvio padrão populacional = 4.",
    "development": [
     "Quando o enunciado dá a variância de uma tabela de frequências, a soma das contribuições f×d^2 é que precisa ser dividida pela soma das frequências. Confundir a soma das frequências com o número de linhas é o erro típico: uma tabela com 4 linhas e 10 observações tem N = 10. Outro cuidado é o arredondamento: se a média não for exata, mantenha frações e só arredonde no final, porque um arredondamento prévio altera todos os desvios.",
     "Existe ainda a pergunta sobre o efeito de um erro de digitação. Como a variância eleva os desvios ao quadrado, um único valor errado, e longe do resto, pode multiplicar a variância por muitas vezes, enquanto o desvio médio sobe de forma mais moderada. Isso explica por que os problemas do tipo \"corrija o dado e recalcule\" são interessantes: eles testam se você entende a sensibilidade de cada medida. Por fim, a tabela de desvios é a base para qualquer exercício de variância e é a forma mais rápida de achar erros; use-a sempre que houver dúvida."
    ],
    "method": [
     "Calcule a média exata (soma ÷ N).",
     "Monte a tabela: x, d = x − média, |d| e d^2 (com frequência, se houver).",
     "Confira: a soma dos desvios deve ser zero.",
     "DM = soma de |d| ÷ N; variância populacional = soma de d^2 ÷ N; desvio padrão = raiz quadrada da variância.",
     "Valide: DM ≤ desvio padrão e atalho Σx^2/N − média^2 igual à variância."
    ],
    "workedExamples": [
     {
      "prompt": "Os prazos, em dias, de uma POPULAÇÃO de seis processos (divisor N = 6) são 5, 6, 11, 11, 12 e 15. Monte a tabela de desvios e calcule o desvio médio absoluto, a variância e o desvio padrão.",
      "steps": [
       "Média = (5+6+11+11+12+15)/6 = 60/6 = 10.",
       "Desvios: −5, −4, 1, 1, 2, 5. Soma = −9 + 9 = 0. ✓",
       "Valores absolutos: 5, 4, 1, 1, 2, 5, soma 18. DM = 18/6 = 3 dias.",
       "Quadrados: 25, 16, 1, 1, 4, 25, soma 72. Variância populacional = 72/6 = 12 dias^2.",
       "Desvio padrão populacional = raiz quadrada de 12, aproximadamente 3,46 dias. Confere: 3 é menor que 3,46."
      ],
      "answer": "DM = 3 dias; variância populacional = 12 dias^2; desvio padrão ≈ 3,46 dias."
     },
     {
      "prompt": "Uma POPULAÇÃO de oito protocolos tem os tempos de análise, em horas: 6 (2 protocolos), 10 (4 protocolos), 12 (1 protocolo) e 16 (1 protocolo). Calcule a variância populacional pela tabela de desvios e confira pelo atalho.",
      "steps": [
       "Soma ponderada: 6×2 + 10×4 + 12×1 + 16×1 = 12 + 40 + 12 + 16 = 80. N = 2+4+1+1 = 8. Média = 80/8 = 10 h.",
       "Desvios: 6 → −4; 10 → 0; 12 → 2; 16 → 6. Soma ponderada dos desvios: −4×2 + 0×4 + 2×1 + 6×1 = −8 + 0 + 2 + 6 = 0. ✓",
       "Contribuições f×d^2: 2×16 = 32; 4×0 = 0; 1×4 = 4; 1×36 = 36. Soma = 72.",
       "Variância populacional = 72/8 = 9 h^2; desvio padrão = raiz quadrada de 9 = 3 h.",
       "Atalho: Σ f×x^2 = 2×36 + 4×100 + 144 + 256 = 72 + 400 + 144 + 256 = 872; 872/8 = 109; 109 − 10^2 = 9. ✓"
      ],
      "answer": "Variância populacional 9 h^2; desvio padrão 3 h."
     },
     {
      "prompt": "Um conjunto (POPULAÇÃO, N = 5) foi digitado como 4, 6, 8, 10 e 22, mas o último valor correto era 12. Calcule o desvio médio e a variância com o dado errado e com o dado corrigido, e compare.",
      "steps": [
       "Dado errado: média = 50/5 = 10; desvios −6, −4, −2, 0, 12 (soma 0). |d| soma 6+4+2+0+12 = 24, DM = 24/5 = 4,8. Quadrados 36+16+4+0+144 = 200, variância = 200/5 = 40.",
       "Dado corrigido (4, 6, 8, 10, 12): média = 40/5 = 8; desvios −4, −2, 0, 2, 4. |d| soma 12, DM = 12/5 = 2,4. Quadrados 16+4+0+4+16 = 40, variância = 40/5 = 8.",
       "Comparação: o DM caiu de 4,8 para 2,4 (metade). A variância caiu de 40 para 8 (um quinto). Os desvios dos outros valores também mudaram, pois a média mudou de 10 para 8."
      ],
      "answer": "Errado: DM 4,8 e variância 40. Correto: DM 2,4 e variância 8. A variância é a mais sensível ao valor errado."
     }
    ],
    "pitfall": "Calcular os desvios em relação a uma média errada e não perceber, porque não conferiu a soma dos desvios. Some sempre a coluna d antes de elevar ao quadrado; se não der zero, refaça a média.",
    "tables": [
     {
      "caption": "Tabela de desvios da população 5, 7, 9, 13 e 16 (média 10)",
      "headers": [
       "x",
       "d = x − 10",
       "|d|",
       "d^2"
      ],
      "rows": [
       [
        5,
        "−5",
        5,
        25
       ],
       [
        7,
        "−3",
        3,
        9
       ],
       [
        9,
        "−1",
        1,
        1
       ],
       [
        13,
        "3",
        3,
        9
       ],
       [
        16,
        "6",
        6,
        36
       ],
       [
        "Soma",
        "0",
        18,
        80
       ]
      ]
     }
    ],
    "resumo": {
     "title": "Tabela de desvios",
     "text": "Monte x, d, |d| e d^2; a soma de d é zero; DM = Σ|d|/N; variância populacional = Σd^2/N; desvio padrão = raiz quadrada da variância.",
     "bizu": "Soma dos desvios diferente de zero: a média está errada."
    }
   },
   {
    "title": "Propriedades: somar, multiplicar, juntar e remover valores",
    "paragraphs": [
     "As propriedades das medidas de dispersão permitem resolver sem refazer toda a tabela. Considere a transformação y = a×x + b aplicada a todos os valores. A média muda do mesmo jeito: média(y) = a×média(x) + b. Amplitude, desvio médio e desvio padrão são multiplicados por |a|, e a variância é multiplicada por a^2. A constante b desloca todos os valores juntos e não muda nenhuma medida de dispersão. Se a for negativo, os dados \"viram de cabeça para baixo\", mas as medidas de dispersão continuam positivas, porque dependem do módulo de a. Esse conjunto de propriedades é o que mais economiza tempo na prova: em vez de refazer uma tabela inteira, você aplica a regra à média, ao desvio padrão ou à variância já conhecidos.",
     "Para incluir ou remover valores, pense na soma dos quadrados dos desvios (SQ). Acrescentar um valor exatamente igual à média atual não muda a média nem a SQ, mas aumenta o N, então a variância diminui (SQ dividido por um N maior). Acrescentar valores distantes da média aumenta a SQ e a variância. Ao remover valores, a média muda, então os desvios têm de ser recalculados; só o atalho com Σx e Σx^2 permite refazer a conta sem a tabela completa. Essa mesma ideia explica por que juntar um grupo de baixa dispersão a outro de média muito diferente produz um conjunto bem mais disperso: a distância entre as médias passa a contar.",
     "Ao juntar dois grupos de populações, com N1 e N2 valores, médias m1 e m2 e variâncias v1 e v2, a média geral é M = (N1×m1 + N2×m2)/(N1+N2). A SQ total é a soma, em cada grupo, de N×(variância + (média do grupo − M)^2). Em palavras: a dispersão total é a dispersão dentro de cada grupo mais a dispersão entre as médias dos grupos. Se as médias dos grupos coincidem, a variância total é só a média ponderada das variâncias; se as médias diferem, a variância total é maior que essa média ponderada. Em enunciados com \"retirou-se\" ou \"incluiu-se\", escreva primeiro N, soma e SQ antes e depois; com esses três números a resposta sai quase mecanicamente."
    ],
    "example": "Exemplo resolvido: população 6, 7, 9, 13 e 15 (N = 5): média 10, SQ = 16+9+1+9+25 = 60, variância 60/5 = 12. Incluir um sexto valor igual a 10 mantém a média 10 e a SQ 60; a variância passa a 60/6 = 10.",
    "development": [
     "A propriedade da multiplicação também vale para operações encadeadas. Se os valores são primeiro multiplicados por 2 e depois somados de 5, e em seguida multiplicados por −3, o efeito total sobre a dispersão é multiplicar o desvio padrão por 2 × 3 = 6. A ordem importa para a média, que acumula as somas, mas não importa para o desvio padrão, que só acumula os módulos dos fatores. Isso economiza muito tempo em transformações complicadas.",
     "Em dados de tabelas de frequência, cada passo continua valendo: a frequência funciona como um \"peso\" que repete o valor. Duplicar todas as frequências não muda a média nem a variância populacional (o conjunto \"dobra\", mas a forma é igual). Multiplicar apenas uma frequência por 2 muda a média, pois aquele valor ganha mais peso. Já retirar o valor que é igual à média diminui a SQ em zero e reduz N em 1, então a variância sobe. Lembre-se sempre de recalcular N depois de incluir ou retirar observações."
    ],
    "method": [
     "Identifique o que é dado (média, variância, SQ, N) e o que foi alterado (transformação, inclusão, remoção ou junção).",
     "Para y = a×x + b: aplique a à média e b à média; |a| ao desvio padrão e à amplitude; a^2 à variância.",
     "Para incluir ou remover valores, recalcule N, a nova soma e a nova SQ.",
     "Para juntar grupos, calcule a média geral e some N×(variância + (média do grupo − M)^2) de cada grupo; divida por N total.",
     "Declare se o conjunto é população ou amostra e use o divisor correspondente."
    ],
    "workedExamples": [
     {
      "prompt": "Uma POPULAÇÃO x tem os valores 7, 9, 10, 11 e 13. Cada valor é transformado em y = −3x + 10. Calcule, para x e para y, a média, a amplitude, o desvio médio, a variância populacional e o desvio padrão, e confira as propriedades.",
      "steps": [
       "Para x: média = 50/5 = 10; amplitude = 13 − 7 = 6. Desvios −3, −1, 0, 1, 3; |d| soma 8, DM = 8/5 = 1,6. Quadrados 9+1+0+1+9 = 20; variância = 20/5 = 4; desvio padrão = 2.",
       "Valores de y: 7 → −11; 9 → −17; 10 → −20; 11 → −23; 13 → −29.",
       "Para y: média = (−11−17−20−23−29)/5 = −100/5 = −20. Confere: −3×10 + 10 = −20. Amplitude = −11 − (−29) = 18 = 3×6.",
       "Desvios de y: 9, 3, 0, −3, −9; |d| soma 24; DM = 24/5 = 4,8 = 3×1,6. Quadrados 81+9+0+9+81 = 180; variância = 180/5 = 36 = 9×4. Desvio padrão = 6 = 3×2."
      ],
      "answer": "x: média 10, amplitude 6, DM 1,6, variância 4, desvio padrão 2. y: média −20, amplitude 18, DM 4,8, variância 36, desvio padrão 6."
     },
     {
      "prompt": "O grupo A tem 4 valores (5, 7, 9 e 11) e o grupo B tem 6 valores (8, 10, 13, 14, 16 e 17). Cada grupo é uma POPULAÇÃO e os dois são reunidos em um só conjunto de 10 valores (divisor N = 10). Calcule a variância do conjunto reunido pela fórmula de decomposição e confira pela conta direta.",
      "steps": [
       "Grupo A: média 32/4 = 8; SQ = 9+1+1+9 = 20; variância 20/4 = 5.",
       "Grupo B: média 78/6 = 13; desvios −5, −3, 0, 1, 3, 4; SQ = 25+9+0+1+9+16 = 60; variância 60/6 = 10.",
       "Média geral: M = (32+78)/10 = 11.",
       "SQ total pela decomposição: A: 4×(5 + (8−11)^2) = 4×14 = 56; B: 6×(10 + (13−11)^2) = 6×14 = 84. Total 140. Variância total = 140/10 = 14.",
       "Conta direta: desvios em relação a 11 → A: −6, −4, −2, 0; B: −3, −1, 2, 3, 5, 6. Quadrados: 36+16+4+0 = 56 e 9+1+4+9+25+36 = 84. SQ = 140; 140/10 = 14. ✓"
      ],
      "answer": "Média geral 11 e variância populacional do conjunto reunido 14."
     },
     {
      "prompt": "Os tempos de dez atendimentos (conjunto completo, POPULAÇÃO, N = 10) estão na tabela: 4 (1 vez), 9 (4 vezes), 10 (3 vezes) e 15 (2 vezes). (a) Calcule a variância populacional pelo atalho. (b) Converta com y = 2x + 5 e dê a média, a variância e o desvio médio de y. (c) Acrescentam-se dois novos atendimentos de valor 10 (no conjunto x); qual a nova variância?",
      "steps": [
       "(a) Média: (4 + 36 + 30 + 30)/10 = 100/10 = 10. Σ f×x^2 = 16 + 4×81 + 3×100 + 2×225 = 16 + 324 + 300 + 450 = 1.090. Variância = 1.090/10 − 10^2 = 109 − 100 = 9. Desvio padrão = 3.",
       "Desvio médio de x: |d| = 6, 1, 0, 5; ponderados 6 + 4×1 + 0 + 2×5 = 20; DM = 20/10 = 2.",
       "(b) Média de y = 2×10 + 5 = 25. Variância de y = 2^2 × 9 = 36 (desvio padrão 6). Desvio médio de y = 2 × 2 = 4.",
       "(c) SQ original = 10 × 9 = 90. Os dois novos valores são iguais à média 10, então a média continua 10 e a SQ continua 90. Novo N = 12. Nova variância = 90/12 = 7,5."
      ],
      "answer": "(a) variância 9; (b) y: média 25, variância 36, desvio médio 4; (c) nova variância 7,5."
     }
    ],
    "pitfall": "Somar a constante ao desvio padrão ou à amplitude, ou multiplicar a variância apenas por a em vez de a^2. Lembre: constante soma na média e não toca na dispersão; fator a multiplica o desvio por |a| e a variância por a^2.",
    "tables": [
     {
      "caption": "Efeito de y = a×x + b sobre cada medida",
      "headers": [
       "Medida",
       "Em y",
       "Exemplo (a = −3, b = 10)"
      ],
      "rows": [
       [
        "Média",
        "a × média(x) + b",
        "−3×10 + 10 = −20"
       ],
       [
        "Amplitude",
        "|a| × amplitude(x)",
        "3×6 = 18"
       ],
       [
        "Desvio médio",
        "|a| × DM(x)",
        "3×1,6 = 4,8"
       ],
       [
        "Desvio padrão",
        "|a| × DP(x)",
        "3×2 = 6"
       ],
       [
        "Variância",
        "a^2 × var(x)",
        "9×4 = 36"
       ]
      ]
     }
    ],
    "resumo": {
     "title": "Propriedades da dispersão",
     "text": "Somar b não muda a dispersão; multiplicar por a multiplica amplitude, DM e DP por |a| e a variância por a^2. Incluir valores iguais à média reduz a variância; juntar grupos soma dispersão interna e entre médias.",
     "bizu": "Constante não conta; fator a vira |a| e a^2."
    }
   },
   {
    "title": "Desvio padrão amostral e coeficiente de variação",
    "paragraphs": [
     "O desvio padrão amostral s é a raiz quadrada da variância amostral: s^2 = SQ/(n−1) e s = raiz quadrada de s^2. É a medida usada quando os dados são uma AMOSTRA e o objetivo é estimar a dispersão da população. Já o desvio padrão populacional é σ = raiz quadrada de (SQ/N). Os dois têm a unidade dos dados. Para o mesmo conjunto, s é sempre um pouco maior que σ, porque n−1 é menor que n. A diferença diminui quando n cresce: com 5 valores a diferença é grande; com 500, quase não se nota. Dessa forma, a escolha entre σ e s é uma pergunta de objetivo: descrever todos os dados ou estimar o que não foi observado. Leia essa intenção no texto.",
     "Quando precisamos comparar dispersões de conjuntos com unidades diferentes (por exemplo, valores em reais e prazos em dias) ou com médias muito diferentes, o desvio padrão sozinho não serve. Para isso existe o coeficiente de variação: CV = desvio padrão/média, em geral escrito em porcentagem. O CV é um número sem unidade que mede o desvio padrão como fração da média. Ele só faz sentido quando a média é positiva (dados em escala de razão, como tempo, dinheiro e quantidade). Se o enunciado fornece o desvio padrão e a média, basta dividir. Assim, para comparar a variabilidade de tempos com a de valores, ou de salários de carreiras diferentes, o CV é a ferramenta correta, pois ele elimina a unidade.",
     "A interpretação é relativa. Um CV de 20% significa que o desvio padrão é 20% da média. Dois conjuntos com CV iguais têm \"dispersão proporcional\" igual, mesmo com desvios padrão absolutos muito diferentes. Alguns textos classificam como \"baixa dispersão\" um CV abaixo de 15% e como \"alta\" um CV acima de 30%, mas esses limites variam; use apenas o critério que o enunciado fornecer. Atenção: o CV muda se você somar uma constante aos dados, porque a média muda e o desvio padrão não; mas não muda se você multiplicar todos os valores por uma constante positiva. Em suma, o CV responde \"quanto o desvio é grande comparado ao tamanho típico dos dados\". Por isso ele é usado para comparar a regularidade de processos de naturezas diferentes."
    ],
    "example": "Exemplo resolvido: AMOSTRA de quatro prazos, em dias: 4, 12, 12 e 12. Média = 40/4 = 10; SQ = 36+4+4+4 = 48; variância amostral s^2 = 48/(4−1) = 16; s = raiz quadrada de 16 = 4 dias; CV = 4/10 = 40%.",
    "development": [
     "Duas confusões são frequentes. A primeira é tomar o desvio padrão como \"erro\" ou \"limite\": ele não é o maior afastamento possível, e sim uma espécie de afastamento típico. Um valor pode estar a mais de um desvio padrão da média sem ser raro. A segunda é comparar variâncias de conjuntos com unidades distintas, o que não faz sentido: a variância de prazos está em dias ao quadrado, e a de custos, em reais ao quadrado; essas unidades não se comparam. Por isso o CV, que é adimensional, é a comparação correta nesses casos.",
     "Em tabelas de frequência de AMOSTRA, a regra é a mesma: SQ = Σ f×(x − média)^2 e o divisor é (soma das frequências) − 1. Se o enunciado fornece Σx e Σx^2, use SQ = Σx^2 − (Σx)^2/n, que é equivalente a Σx^2 − n×média^2. Nunca use o CV quando a média está próxima de zero, pois o quociente fica enorme e perde sentido. Por fim, lembre-se de reportar o CV como porcentagem quando o enunciado assim pedir (0,2 = 20%)."
    ],
    "method": [
     "Declare se o conjunto é população (divisor N) ou amostra (divisor n−1).",
     "Calcule média e SQ (pela tabela ou por Σx e Σx^2).",
     "Calcule a variância com o divisor correto e extraia a raiz quadrada para obter o desvio padrão.",
     "Para comparar escalas, divida o desvio padrão pela média: CV = DP/média, em %.",
     "Interprete: menor CV significa dispersão relativa menor, mesmo que o desvio padrão absoluto seja maior."
    ],
    "workedExamples": [
     {
      "prompt": "Em uma AMOSTRA de cinco processos, o tempo de tramitação tem média 20 dias e desvio padrão amostral 4 dias. Em outra AMOSTRA de cinco processos, o valor da causa tem média R$ 5.000,00 e desvio padrão amostral R$ 750,00. Qual das duas variáveis é relativamente mais dispersa?",
      "steps": [
       "Os desvios padrão estão em unidades diferentes (dias e reais); não podem ser comparados diretamente.",
       "CV do tempo = 4/20 = 0,20 = 20%.",
       "CV do valor = 750/5.000 = 0,15 = 15%.",
       "Comparação: 20% > 15%."
      ],
      "answer": "O tempo de tramitação é relativamente mais disperso (CV 20% contra 15%), embora o desvio padrão do valor, R$ 750,00, seja numericamente maior."
     },
     {
      "prompt": "Uma AMOSTRA de nove valores tem soma 90 e soma dos quadrados 972. Calcule a variância amostral, o desvio padrão amostral e o coeficiente de variação. Para contraste, calcule a variância se fosse POPULAÇÃO.",
      "steps": [
       "Média = 90/9 = 10.",
       "SQ = Σx^2 − n×média^2 = 972 − 9×100 = 972 − 900 = 72.",
       "AMOSTRA: s^2 = 72/(9−1) = 72/8 = 9; s = raiz quadrada de 9 = 3.",
       "CV = 3/10 = 30%.",
       "Contraste (POPULAÇÃO): 72/9 = 8, com desvio padrão raiz quadrada de 8, aproximadamente 2,83."
      ],
      "answer": "Amostra: s^2 = 9, s = 3 e CV = 30%. (Como população: variância 8.)"
     },
     {
      "prompt": "Uma AMOSTRA x tem média 20 e desvio padrão amostral 4. Os valores são transformados em y = 2x − 10. Calcule média, variância amostral, desvio padrão amostral e CV de y e compare com o CV de x. Em seguida, mostre o que ocorre com o CV de z = 2x.",
      "steps": [
       "CV de x = 4/20 = 20%.",
       "Média de y = 2×20 − 10 = 30. Desvio padrão de y = |2|×4 = 8 (o −10 não altera). Variância amostral de y = 8^2 = 64 (também 2^2 × 4^2 = 4×16 = 64).",
       "CV de y = 8/30 ≈ 0,2667 = 26,67%. O CV aumentou de 20% para 26,67%, porque o desvio padrão dobrou (de 4 para 8), mas a média não dobrou: subiu só de 20 para 30, e não para 40.",
       "Para z = 2x: média 40, desvio padrão 8; CV = 8/40 = 20%. Multiplicar por constante positiva não muda o CV."
      ],
      "answer": "y: média 30, s^2 = 64, s = 8, CV ≈ 26,67% (diferente do de x, 20%). z = 2x mantém CV de 20%."
     }
    ],
    "pitfall": "Comparar desvios padrão de variáveis com unidades ou escalas diferentes e concluir que a de maior desvio padrão é a mais dispersa. Nesses casos use o CV (desvio padrão ÷ média) e lembre que o CV só vale com média positiva.",
    "tables": [
     {
      "caption": "População e amostra: o que muda",
      "headers": [
       "Item",
       "População",
       "Amostra"
      ],
      "rows": [
       [
        "Divisor da variância",
        "N",
        "n − 1"
       ],
       [
        "Símbolos",
        "σ^2 e σ",
        "s^2 e s"
       ],
       [
        "Para o mesmo conjunto",
        "menor valor",
        "maior valor"
       ],
       [
        "Uso",
        "conjunto completo",
        "estimar a dispersão da população"
       ]
      ]
     }
    ],
    "resumo": {
     "title": "Desvio padrão amostral e CV",
     "text": "s = raiz quadrada de SQ/(n−1) para amostra; σ = raiz quadrada de SQ/N para população. CV = desvio padrão/média, em %, compara dispersão relativa entre unidades diferentes.",
     "bizu": "Comparou unidades diferentes? Use o CV."
    }
   }
  ]
 }
};
for(const id of Object.keys(D)){
 const m=A[id];if(!m)continue;
 for(const e of (D[id].extras||[])){
  const ch=m.theory[e.capitulo-1];if(!ch)continue;
  if((e.development||[]).length)ch.development=(ch.development||[]).concat(e.development);
  if((e.workedExamples||[]).length)ch.workedExamples=(ch.workedExamples||[]).concat(e.workedExamples);
  if((e.tables||[]).length)ch.tables=(ch.tables||[]).concat(e.tables);
 }
 for(const c of (D[id].novosCapitulos||[])){
  const {resumo,...ch}=c;ch.figure=null;m.theory.push(ch);m.summary.push(resumo);
 }
}
g.__RLM_APROFUNDAMENTO_20261127=true;
g.RLM_APROFUNDAMENTO_COBERTURA=Object.keys(D);
})(window);
