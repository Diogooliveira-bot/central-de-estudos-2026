/* Banco de questões — Raciocínio Lógico-Matemático, módulo 02. Questões autorais (não são de banca).
 * Para acrescentar questões, veja content/questoes/LEIAME.md e rode "npm run questoes:check". */
window.BC_QUESTOES=window.BC_QUESTOES||{};
(window.BC_QUESTOES.rlm=window.BC_QUESTOES.rlm||{})[2]=[
 {
  "id": "rlm-m02-autoral-01",
  "origem": "autoral-ia",
  "q": "Considere as sentenças abaixo.\nI. O número 91 é primo.\nII. Quantos processos foram distribuídos hoje?\nIII. x + 7 = 12.\nIV. Existe um número natural n tal que n + 7 = 12.\nV. Arquive o processo.\nVI. Para todo número real x, x² − 4 = 0.\nVII. Que sessão demorada!\nNa lógica proposicional clássica, há nessa lista:",
  "options": [
   "uma proposição, que é verdadeira",
   "duas proposições, das quais uma é verdadeira",
   "três proposições, das quais duas são verdadeiras",
   "três proposições, das quais apenas uma é verdadeira",
   "quatro proposições, das quais duas são verdadeiras"
  ],
  "answer": 3,
  "explanation": "Proposição é toda sentença declarativa com valor lógico definido (V ou F); perguntas (II), ordens (V) e exclamações (VII) ficam de fora. A sentença III é aberta: sem valor fixado para x, não é V nem F. Já as sentenças I, IV e VI são proposições, pois, mesmo quando falam de \"existe\" ou \"para todo\", têm valor definido: I é falsa (91 = 7 × 13, logo não é primo); IV é verdadeira (n = 5); VI é falsa (x = 0 dá −4, e não zero). Há, portanto, 3 proposições e só uma verdadeira. Quem dá a III o status de proposição chega a quatro; quem não aceita as sentenças com \"existe/para todo\" como proposições chega a duas; e quem toma 91 por primo conta duas verdadeiras.",
  "lawRef": "Proposição e sentença aberta — valor lógico"
 },
 {
  "id": "rlm-m02-autoral-02",
  "origem": "autoral-ia",
  "q": "São verdadeiras as premissas: (1) \"O processo é distribuído se, e somente se, o protocolo não é suspenso\"; (2) \"O protocolo é suspenso se, e somente se, o sistema está fora do ar\". É falsa a premissa (3): \"Se o processo é distribuído, então o sistema está fora do ar\". Com base nesses dados, é verdadeira a proposição:",
  "options": [
   "Se o sistema está fora do ar, então o processo não é distribuído.",
   "O processo é distribuído e o sistema está fora do ar.",
   "Se o processo é distribuído, então o protocolo é suspenso.",
   "O protocolo é suspenso ou o sistema está fora do ar.",
   "O processo é distribuído se, e somente se, o sistema está fora do ar."
  ],
  "answer": 0,
  "explanation": "Sejam D = o processo é distribuído, S = o protocolo é suspenso e F = o sistema está fora do ar. A condicional D → F só é falsa quando D é V e F é F; logo D = V e F = F. Pela premissa (1), D ↔ ¬S: como D é V, ¬S é V, ou seja, S = F. A premissa (2), S ↔ F, é então F ↔ F, verdadeira, o que confirma a única atribuição possível: D = V, S = F, F = F. Avaliando as alternativas: a condicional \"F → ¬D\" tem antecedente falso e é verdadeira. \"D ∧ F\" é falsa (F é falso); \"D → S\" é V → F, falsa; \"S ∨ F\" é F ∨ F, falsa; \"D ↔ F\" é V ↔ F, falsa. Erro comum: achar que condicional de antecedente falso é falsa.",
  "lawRef": "Condicional e bicondicional — valoração por eliminação"
 },
 {
  "id": "rlm-m02-autoral-03",
  "origem": "autoral-ia",
  "q": "Uma proposição composta é tautologia quando é sempre verdadeira, contradição quando é sempre falsa e contingência nos demais casos. Classifique, nessa ordem, as proposições I. (P → Q) ∨ (Q → P); II. (P ∧ Q) ↔ (¬P ∨ ¬Q); III. P → (P ∧ Q).",
  "options": [
   "contingência, contradição, tautologia",
   "tautologia, contingência, contradição",
   "tautologia, tautologia, contingência",
   "contingência, contingência, contingência",
   "tautologia, contradição, contingência"
  ],
  "answer": 4,
  "explanation": "I: se P é F, P → Q é V; se P é V e Q é V, P → Q é V; se P é V e Q é F, então Q → P é V (antecedente falso). Em todas as quatro linhas a disjunção é V: tautologia. II: ¬P ∨ ¬Q é exatamente a negação de P ∧ Q (De Morgan), e uma bicondicional entre uma proposição e a sua negação tem sempre valores opostos nos dois lados, logo é sempre F: contradição. III: P → (P ∧ Q) é F somente na linha P = V, Q = F, e é V nas demais: contingência. Quem classifica II como tautologia confunde a bicondicional com a equivalência de De Morgan, que seria ¬(P ∧ Q) ↔ (¬P ∨ ¬Q).",
  "lawRef": "Tabela-verdade — tautologia, contradição e contingência"
 },
 {
  "id": "rlm-m02-autoral-04",
  "origem": "autoral-ia",
  "q": "Em um edital, constam duas regras: (1) apresentar documentação completa é condição necessária para o deferimento da inscrição; (2) pagar a taxa é condição suficiente para o deferimento da inscrição. Com base exclusivamente nessas regras, é correto afirmar que:",
  "options": [
   "toda pessoa que pagou a taxa apresentou documentação completa",
   "toda pessoa com documentação completa teve a inscrição deferida",
   "toda pessoa com inscrição deferida pagou a taxa",
   "toda pessoa que não pagou a taxa teve a inscrição indeferida",
   "toda pessoa com documentação completa pagou a taxa"
  ],
  "answer": 0,
  "explanation": "Sejam T = pagar a taxa, I = inscrição deferida e D = documentação completa. Em P → Q, P é suficiente e Q é necessária. A regra (1) diz que D é necessária para I, isto é, I → D. A regra (2) diz que T é suficiente para I, isto é, T → I. Encadeando: T → I → D, logo T → D: quem pagou a taxa tem documentação completa. A segunda alternativa trata a necessária (D) como suficiente (D → I). A terceira é a recíproca de T → I (I → T). A quarta é a inversa de T → I (¬T → ¬I). A quinta é a recíproca da conclusão (D → T). Nenhuma delas é consequência das duas regras: recíproca e inversa não decorrem da condicional original.",
  "lawRef": "Condição necessária e suficiente — encadeamento"
 },
 {
  "id": "rlm-m02-autoral-05",
  "origem": "autoral-ia",
  "q": "Sabe-se que é verdadeira a proposição \"Se Lia foi nomeada, então ela tomou posse\". Com base apenas nessa informação, é correto concluir que:",
  "options": [
   "Lia foi nomeada.",
   "Lia tomou posse.",
   "Lia não foi nomeada ou tomou posse.",
   "Lia não foi nomeada.",
   "Se Lia tomou posse, então foi nomeada."
  ],
  "answer": 2,
  "explanation": "A verdade de uma condicional P → Q não prova que P ocorreu nem que Q ocorreu: ela apenas proíbe o caso \"P verdadeiro e Q falso\". Por isso \"Lia foi nomeada\" e \"Lia tomou posse\" afirmam fatos que a informação não garante, e \"Lia não foi nomeada\" nega a nomeação sem base (Lia pode ter sido nomeada e tomado posse). \"Se Lia tomou posse, então foi nomeada\" é a recíproca (Q → P), que não decorre da condicional original: ela pode ter tomado posse por outra via. Resta a alternativa que escreve P → Q como ¬P ∨ Q: se a condicional é verdadeira, então ou o antecedente é falso (Lia não foi nomeada) ou o consequente é verdadeiro (tomou posse). Confirma-se por tabela: nas três linhas em que P → Q é V, ¬P ∨ Q também é V.",
  "lawRef": "Condicional — equivalência com ¬P ∨ Q"
 },
 {
  "id": "rlm-m02-autoral-06",
  "origem": "autoral-ia",
  "q": "Sejam R = \"o réu compareceu\", J = \"o advogado justificou a ausência\" e A = \"a audiência foi realizada\". A simbolização correta de \"Nem o réu compareceu nem o advogado justificou a ausência, e a audiência foi realizada\" é:",
  "options": [
   "(¬R ∨ ¬J) ∧ A",
   "(¬R ∧ ¬J) ∧ A",
   "¬(R ∧ J ∧ A)",
   "(¬R ∧ ¬J) → A",
   "¬R ∧ (¬J → A)"
  ],
  "answer": 1,
  "explanation": "\"Nem R nem J\" significa que as duas coisas deixaram de ocorrer: ¬R ∧ ¬J (equivale a ¬(R ∨ J) por De Morgan). A conjunção final \"e a audiência foi realizada\" acrescenta A, de modo que a forma é (¬R ∧ ¬J) ∧ A. (¬R ∨ ¬J) ∧ A troca o \"e\" por \"ou\" (bastaria uma das ausências); ¬(R ∧ J ∧ A) nega a conjunção de três fatos, o que é verdadeiro até quando o réu compareceu e a audiência não ocorreu; (¬R ∧ ¬J) → A transforma a afirmação em promessa condicional, verdadeira sempre que as ausências não ocorrerem; ¬R ∧ (¬J → A) mistura uma condicional dentro da conjunção. Confira por tabela: só a forma correta é verdadeira apenas na linha R = F, J = F, A = V.",
  "lawRef": "Tradução para a linguagem simbólica — \"nem...nem\""
 },
 {
  "id": "rlm-m02-autoral-07",
  "origem": "autoral-ia",
  "q": "Em uma tabela-verdade da proposição (P ∨ Q) → (R ∧ S), construída com as quatro proposições simples P, Q, R e S, o número de linhas em que a proposição composta é verdadeira é:",
  "options": [
   "3",
   "4",
   "7",
   "9",
   "12"
  ],
  "answer": 2,
  "explanation": "Com 4 proposições simples, a tabela tem 2⁴ = 16 linhas. A condicional só é falsa quando o antecedente é V e o consequente é F. Antecedente P ∨ Q é V em 3 das 4 combinações de (P, Q); consequente R ∧ S é F em 3 das 4 combinações de (R, S). Linhas falsas: 3 × 3 = 9. Linhas verdadeiras: 16 − 9 = 7. Conferindo diretamente: com P e Q ambos F (4 linhas, uma para cada combinação de R e S) a condicional é V por antecedente falso; com P ∨ Q verdadeiro (3 combinações) é preciso R e S verdadeiros, 1 combinação: 3 linhas. Total 4 + 3 = 7. As respostas 9 (linhas falsas), 3 e 4 (contar só uma das parcelas) e 12 (3 × 4) são os erros típicos.",
  "lawRef": "Tabela-verdade — contagem de linhas"
 },
 {
  "id": "rlm-m02-autoral-08",
  "origem": "autoral-ia",
  "q": "Assinale a única alternativa que contém uma proposição composta falsa.",
  "options": [
   "Se 17 é par, então 17 é múltiplo de 3.",
   "17 é primo ou 17 é par.",
   "17 é primo se, e somente se, 17 é ímpar.",
   "17 é ímpar e, se 17 é par, então 17 é negativo.",
   "Ou 17 é primo, ou 17 é ímpar, mas não ambos."
  ],
  "answer": 4,
  "explanation": "Considere os valores: \"17 é primo\" é V, \"17 é ímpar\" é V, \"17 é par\" é F. A disjunção exclusiva \"ou P, ou Q, mas não ambos\" só é verdadeira quando P e Q têm valores diferentes; aqui ambos são V, logo é falsa. As demais são verdadeiras: a condicional \"Se 17 é par, então 17 é múltiplo de 3\" tem antecedente falso, logo é V; a disjunção inclusiva \"17 é primo ou 17 é par\" tem uma parcela V; a bicondicional \"17 é primo se, e somente se, 17 é ímpar\" liga duas proposições V, logo é V; e na última, a condicional interna tem antecedente falso (V) e a conjunção com \"17 é ímpar\" (V) é verdadeira. O erro frequente é ler a condicional de antecedente falso como falsa, ou esquecer que o \"ou...ou\" exclusivo exige valores diferentes.",
  "lawRef": "Disjunção exclusiva, condicional e bicondicional — valor lógico"
 },
 {
  "id": "rlm-m02-autoral-09",
  "origem": "autoral-ia",
  "q": "Uma regra interna estabelece: \"O candidato será aprovado somente se obtiver nota igual ou superior a 6 e frequência igual ou superior a 75%\". Uma situação que revela o descumprimento dessa regra é a de um candidato com:",
  "options": [
   "nota 8, frequência de 90% e reprovado",
   "nota 5, frequência de 80% e aprovado",
   "nota 7, frequência de 70% e reprovado",
   "nota 6, frequência de 75% e aprovado",
   "nota 6, frequência de 80% e reprovado"
  ],
  "answer": 1,
  "explanation": "\"A somente se B\" traduz-se por A → B, em que A = \"ser aprovado\" e B = \"nota ≥ 6 e frequência ≥ 75%\". Essa condicional só é falsa quando A é V e B é F, isto é, quando alguém é aprovado sem cumprir ao mesmo tempo as duas exigências. O candidato com nota 5, frequência de 80% e aprovado é exatamente esse caso: foi aprovado sem ter nota mínima. As alternativas com candidatos reprovados (nota 8 e frequência 90%; nota 7 e frequência 70%; nota 6 e frequência 80%) não violam a regra, porque ela não promete aprovação a quem cumpre as exigências (isso seria \"se\", e não \"somente se\"). O candidato com nota 6 e frequência 75% aprovado cumpre as duas exigências.",
  "lawRef": "\"Somente se\" — condicional P → Q e seu único caso falso"
 },
 {
  "id": "rlm-m02-autoral-10",
  "origem": "autoral-ia",
  "q": "Sabe-se que a proposição (P ∧ Q) → R é verdadeira e que R é falsa. Nessas condições, é necessariamente verdadeira a proposição:",
  "options": [
   "¬P",
   "¬Q",
   "¬(P ∨ Q)",
   "P → ¬Q",
   "P ↔ Q"
  ],
  "answer": 3,
  "explanation": "Se R é F e a condicional (P ∧ Q) → R é V, o antecedente P ∧ Q precisa ser F (uma condicional com consequente falso só é verdadeira se o antecedente é falso). Uma conjunção falsa admite três combinações de (P, Q): FF, FV e VF. Nenhuma de P, Q isoladamente é necessariamente falsa (primeira e segunda alternativas), pois P pode ser V (com Q = F) e Q pode ser V (com P = F). A disjunção P ∨ Q pode ser verdadeira (FV ou VF), logo ¬(P ∨ Q) não é necessária. A bicondicional P ↔ Q é falsa nas linhas FV e VF, portanto também não é necessária. Já P → ¬Q é falsa apenas quando P e Q são ambos V, linha excluída: é verdadeira nas três combinações possíveis, ou seja, é equivalente a ¬(P ∧ Q).",
  "lawRef": "Condicional com consequente falso — antecedente falso"
 },
 {
  "id": "rlm-m02-autoral-11",
  "origem": "autoral-ia",
  "q": "Em um comunicado do tribunal constam as sentenças abaixo. Qual delas é uma proposição lógica, isto é, uma sentença declarativa à qual se pode atribuir o valor verdadeiro ou falso?",
  "options": [
   "Protocole a petição até as 17 horas.",
   "Que horas começa a sessão?",
   "x + 1 = 4, sem que se saiba quanto vale x.",
   "O número 8 é par.",
   "Tomara que o expediente termine cedo."
  ],
  "answer": 3,
  "explanation": "Proposição é toda sentença declarativa que pode ser classificada, sem ambiguidade, como verdadeira ou falsa. \"O número 8 é par\" é declarativa e verdadeira, logo é proposição. As demais não têm valor lógico: \"Protocole a petição\" é uma ordem (imperativa); \"Que horas começa a sessão?\" é uma pergunta; \"Tomara que o expediente termine cedo\" expressa desejo; e \"x + 1 = 4\" é uma sentença aberta, pois, sem fixar x, não se pode dizer se é V ou F.",
  "lawRef": "Conceito de proposição (sentença declarativa com valor lógico)"
 },
 {
  "id": "rlm-m02-autoral-12",
  "origem": "autoral-ia",
  "q": "Sejam P e Q proposições simples. A conjunção P ∧ Q (\"P e Q\") é verdadeira somente quando:",
  "options": [
   "P e Q são ambas verdadeiras.",
   "P é verdadeira, qualquer que seja o valor de Q.",
   "Q é verdadeira, qualquer que seja o valor de P.",
   "P e Q são ambas falsas.",
   "P e Q têm valores lógicos diferentes."
  ],
  "answer": 0,
  "explanation": "A conjunção exige as duas parcelas verdadeiras ao mesmo tempo. Na tabela-verdade de P ∧ Q, as quatro linhas dão: VV → V; VF → F; FV → F; FF → F. Portanto só a linha com P e Q verdadeiras torna a conjunção verdadeira. As alternativas que exigem apenas P ou apenas Q verdadeira descrevem condições insuficientes (parecem a disjunção); \"ambas falsas\" é a única linha em que a disjunção também falha; e \"valores diferentes\" descreve o ou exclusivo, não a conjunção.",
  "lawRef": "Tabela-verdade da conjunção"
 },
 {
  "id": "rlm-m02-autoral-13",
  "origem": "autoral-ia",
  "q": "Para analisar a proposição composta (P ∧ Q) → R, construída com três proposições simples P, Q e R, monta-se a tabela-verdade completa. Quantas linhas ela terá?",
  "options": [
   "4",
   "6",
   "8",
   "9",
   "12"
  ],
  "answer": 2,
  "explanation": "O número de linhas de uma tabela-verdade completa é 2ⁿ, em que n é a quantidade de proposições simples distintas, pois cada uma pode ser V ou F de forma independente. Aqui n = 3 (P, Q e R), então 2³ = 2 × 2 × 2 = 8 linhas. O valor 4 corresponderia a apenas duas proposições (2²); 6 e 12 vêm de somar ou multiplicar de modo errado (3 × 2, 3 × 4); e 9 vem de calcular 3² em vez de 2³, trocando base e expoente.",
  "lawRef": "Número de linhas da tabela-verdade (2ⁿ)"
 },
 {
  "id": "rlm-m02-autoral-14",
  "origem": "autoral-ia",
  "q": "Sejam P: \"o prazo foi cumprido\" e Q: \"o recurso foi admitido\". Sabe-se que P é verdadeira e Q é falsa. O valor lógico da condicional P → Q é:",
  "options": [
   "Verdadeiro.",
   "Indeterminado, pois depende de outras proposições.",
   "Verdadeiro, pois o antecedente P é verdadeiro.",
   "Verdadeiro, pois a disjunção Q ∨ P é verdadeira.",
   "Falso."
  ],
  "answer": 4,
  "explanation": "A condicional P → Q só é falsa em uma situação: antecedente verdadeiro e consequente falso. Com P = V e Q = F, estamos exatamente nessa linha, logo P → Q é falsa (F). Erram quem pensa que antecedente verdadeiro basta para tornar a condicional verdadeira (exige-se também Q verdadeiro), quem acha o valor indeterminado (os dois valores são dados) e quem confunde a condicional com a disjunção Q ∨ P: ela é verdadeira, mas isso não altera o valor de P → Q, que é uma operação diferente.",
  "lawRef": "Tabela-verdade da condicional (P → Q)"
 },
 {
  "id": "rlm-m02-autoral-15",
  "origem": "autoral-ia",
  "q": "A sentença \"Vou ao fórum somente se houver expediente\" é simbolizada, com F: \"vou ao fórum\" e E: \"há expediente\", por:",
  "options": [
   "E → F",
   "F → E",
   "F ∧ E",
   "F ↔ E",
   "¬E → F"
  ],
  "answer": 1,
  "explanation": "A expressão \"A somente se B\" indica que B é condição necessária para A, ou seja, A → B. Ir ao fórum só é possível se houver expediente: F → E. A forma E → F (\"se há expediente, vou\") inverte a condicional e afirmaria que o expediente basta para eu ir, o que a frase não diz. F ∧ E afirma que ambos ocorrem de fato; F ↔ E exigiria também a volta (ir sempre que houver expediente); e ¬E → F diria que sem expediente eu vou, o contrário do pretendido.",
  "lawRef": "Condicional: \"somente se\" indica condição necessária"
 },
 {
  "id": "rlm-m02-autoral-16",
  "origem": "autoral-ia",
  "q": "Qual expressão simboliza a sentença \"Não é verdade que Paulo trabalha e estuda\", com T: \"Paulo trabalha\" e E: \"Paulo estuda\"?",
  "options": [
   "¬T ∧ E",
   "T ∨ E",
   "¬(T ∧ E)",
   "T → E",
   "T ↔ E"
  ],
  "answer": 2,
  "explanation": "A expressão \"Não é verdade que ...\" nega a sentença inteira que vem depois, aqui a conjunção \"Paulo trabalha e estuda\" (T ∧ E). Logo a simbolização é ¬(T ∧ E), que, por De Morgan, equivale a ¬T ∨ ¬E. A opção ¬T ∧ E nega só a primeira parcela e mantém a segunda; T ∨ E nem contém negação; T → E e T ↔ E são condicional e bicondicional, conectivos que não aparecem na frase.",
  "lawRef": "Simbolização e negação de proposição composta"
 },
 {
  "id": "rlm-m02-autoral-17",
  "origem": "autoral-ia",
  "q": "Sabendo que P e Q são ambas falsas, o valor lógico da disjunção inclusiva P ∨ Q é:",
  "options": [
   "Falso.",
   "Verdadeiro.",
   "Verdadeiro, pois ¬P é verdadeira.",
   "Verdadeiro, pois ao menos uma das parcelas é falsa.",
   "Indeterminado, pois depende do contexto."
  ],
  "answer": 0,
  "explanation": "A disjunção inclusiva \"P ou Q\" é verdadeira quando pelo menos uma parcela é verdadeira, e só é falsa quando as duas são falsas. Com P = F e Q = F, temos F ∨ F = F. Dizer que ¬P é verdadeira não ajuda: ¬P é outra proposição e não entra em P ∨ Q. Ter ao menos uma parcela falsa é o critério da conjunção, não da disjunção. E o valor não é indeterminado, pois ambos os valores foram informados.",
  "lawRef": "Tabela-verdade da disjunção inclusiva"
 },
 {
  "id": "rlm-m02-autoral-18",
  "origem": "autoral-ia",
  "q": "Em quais valores de P e Q a fórmula (P → Q) ∧ P é verdadeira?",
  "options": [
   "P = V e Q = F",
   "P = F e Q = V",
   "P = F e Q = F",
   "P = V e Q = V",
   "Em nenhuma atribuição, pois a fórmula é contradição."
  ],
  "answer": 3,
  "explanation": "Uma conjunção só é verdadeira se as duas parcelas o forem. Exigir P verdadeira (segunda parcela) já elimina P = F. Com P = V, a primeira parcela P → Q só é verdadeira se Q = V. Teste: VV → (V→V)=V e P=V, logo V; VF → (V→F)=F, logo F; FV → P=F, logo F; FF → P=F, logo F. A fórmula é verdadeira somente em VV, portanto é contingência (não contradição). Esta fórmula é o núcleo do modus ponens.",
  "lawRef": "Tabela-verdade de fórmula composta"
 },
 {
  "id": "rlm-m02-autoral-19",
  "origem": "autoral-ia",
  "q": "Considere a frase: \"Se Renato não viaja, então Carla trabalha\". O antecedente dessa condicional é:",
  "options": [
   "Carla trabalha.",
   "Renato não viaja.",
   "Renato viaja.",
   "Carla não trabalha.",
   "Carla viaja."
  ],
  "answer": 1,
  "explanation": "Em uma condicional \"se A, então B\", o antecedente é A, a parte introduzida pelo \"se\"; o consequente é B. Aqui o \"se\" introduz \"Renato não viaja\", que é o antecedente (¬R, com R: Renato viaja). \"Carla trabalha\" é o consequente. \"Renato viaja\" é a negação do antecedente e \"Carla não trabalha\" é a negação do consequente, ambas partes da contrapositiva. \"Carla viaja\" nem aparece na frase.",
  "lawRef": "Partes da condicional: antecedente e consequente"
 },
 {
  "id": "rlm-m02-autoral-20",
  "origem": "autoral-ia",
  "q": "Sobre a bicondicional P ↔ Q (\"P se e somente se Q\"), é correto afirmar que ela é:",
  "options": [
   "Verdadeira somente quando P é V e Q é F.",
   "Verdadeira somente quando P é F e Q é V.",
   "Falsa apenas quando P e Q são ambas falsas.",
   "Equivalente à disjunção inclusiva P ∨ Q.",
   "Verdadeira exatamente quando P e Q têm o mesmo valor lógico."
  ],
  "answer": 4,
  "explanation": "A bicondicional equivale a (P → Q) ∧ (Q → P): vale quando a ida e a volta valem. Isso ocorre em VV (V↔V = V) e em FF (F↔F = V), isto é, quando P e Q coincidem; nas linhas VF e FV ela é falsa. Por isso estão erradas as que a restringem a VF ou FV (são exatamente as linhas em que ela é falsa) e a que diz ser falsa em FF. Também não é equivalente a P ∨ Q, que é verdadeira em VF e falsa só em FF.",
  "lawRef": "Tabela-verdade da bicondicional"
 }
];
