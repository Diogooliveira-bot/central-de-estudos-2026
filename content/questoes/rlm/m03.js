/* Banco de questões — Raciocínio Lógico-Matemático, módulo 03. Questões autorais (não são de banca).
 * Para acrescentar questões, veja content/questoes/LEIAME.md e rode "npm run questoes:check". */
window.BC_QUESTOES=window.BC_QUESTOES||{};
(window.BC_QUESTOES.rlm=window.BC_QUESTOES.rlm||{})[3]=[
 {
  "id": "rlm-m03-autoral-01",
  "origem": "autoral-ia",
  "q": "Assinale a alternativa que apresenta a negação lógica da proposição: \"O réu foi citado, foi intimado e não compareceu à audiência\".",
  "options": [
   "O réu não foi citado, não foi intimado e compareceu à audiência.",
   "O réu não foi citado, ou não foi intimado, ou compareceu à audiência.",
   "O réu foi citado, ou foi intimado, ou não compareceu à audiência.",
   "O réu foi citado, foi intimado e compareceu à audiência.",
   "O réu não foi citado, ou não foi intimado, ou não compareceu à audiência."
  ],
  "answer": 1,
  "explanation": "Sejam C = \"foi citado\", I = \"foi intimado\" e N = \"compareceu\"; a proposição é C ∧ I ∧ ¬N. Pelas Leis de De Morgan, a negação de uma conjunção é a disjunção das negações: ¬(C ∧ I ∧ ¬N) = ¬C ∨ ¬I ∨ ¬(¬N) = ¬C ∨ ¬I ∨ N, ou seja, \"não foi citado, ou não foi intimado, ou compareceu\". Erros típicos: manter a conjunção e negar todas as parcelas (\"não foi citado, não foi intimado e compareceu\"), o que exige as três falhas ao mesmo tempo; trocar apenas o conectivo sem negar as parcelas (\"foi citado, ou foi intimado, ou não compareceu\"); negar só a última parcela (\"foi citado, foi intimado e compareceu\"); e negar as três parcelas esquecendo que a última já vinha negada, de modo que ¬(¬N) volta a ser N (\"não foi citado, ou não foi intimado, ou não compareceu\").",
  "lawRef": "Negação de proposição composta — Leis de De Morgan"
 },
 {
  "id": "rlm-m03-autoral-02",
  "origem": "autoral-ia",
  "q": "Considere a proposição: \"Se o edital for publicado e o prazo for aberto, então haverá inscrições ou o certame será adiado\". A negação lógica dessa proposição é:",
  "options": [
   "O edital foi publicado, o prazo foi aberto, e não há inscrições ou o certame não foi adiado.",
   "Se houver inscrições ou o certame for adiado, então o edital foi publicado e o prazo foi aberto.",
   "O edital não foi publicado ou o prazo não foi aberto, e não há inscrições nem adiamento do certame.",
   "Se o edital não for publicado ou o prazo não for aberto, então não haverá inscrições e o certame não será adiado.",
   "O edital foi publicado, o prazo foi aberto, não há inscrições e o certame não foi adiado."
  ],
  "answer": 4,
  "explanation": "Uma condicional A → B só é falsa quando A é V e B é F; logo, ¬(A → B) equivale a A ∧ ¬B. Aqui A = (E ∧ P) e B = (I ∨ D). A negação fica (E ∧ P) ∧ ¬(I ∨ D) e, por De Morgan, ¬(I ∨ D) = ¬I ∧ ¬D. Resultado: edital publicado, prazo aberto, sem inscrições e certame não adiado, tudo ao mesmo tempo. A primeira alternativa nega a disjunção sem aplicar De Morgan completamente (usa \"ou\" onde deveria haver \"e\"); a segunda é a recíproca da condicional; a terceira nega o antecedente em vez de mantê-lo; a quarta é a inversa (nega antecedente e consequente), que também não contradiz a promessa original. Negar uma condicional nunca produz outra condicional.",
  "lawRef": "Negação da condicional — ¬(A → B) = A ∧ ¬B, com De Morgan"
 },
 {
  "id": "rlm-m03-autoral-03",
  "origem": "autoral-ia",
  "q": "Considere a afirmação: \"Márcia só viaja se houver verba e o chefe autorizar\". Qual das proposições seguintes é logicamente equivalente a ela?",
  "options": [
   "Se não houver verba ou o chefe não autorizar, Márcia não viaja.",
   "Se houver verba e o chefe autorizar, Márcia viaja.",
   "Márcia não viaja ou há verba.",
   "Se não houver verba e o chefe não autorizar, Márcia não viaja.",
   "Se Márcia viaja, há verba ou o chefe autoriza."
  ],
  "answer": 0,
  "explanation": "\"Márcia só viaja se houver verba e o chefe autorizar\" é \"viaja somente se...\", ou seja, M → (V ∧ C). A equivalente é a contrapositiva: ¬(V ∧ C) → ¬M. Por De Morgan, ¬(V ∧ C) = ¬V ∨ ¬C, e então: \"se não houver verba ou o chefe não autorizar, Márcia não viaja\". A alternativa \"se houver verba e o chefe autorizar, Márcia viaja\" é a recíproca (V ∧ C → M): ter verba e autorização é necessário, não suficiente. \"Márcia não viaja ou há verba\" (¬M ∨ V) é mais fraca: não exige a autorização. \"Se não houver verba e o chefe não autorizar...\" troca \"ou\" por \"e\" ao negar a conjunção (falha em De Morgan) e deixa de cobrir o caso em que falta só uma das condições. \"Se viaja, há verba ou o chefe autoriza\" enfraquece o consequente (V ∨ C no lugar de V ∧ C).",
  "lawRef": "Contrapositiva e Leis de De Morgan — equivalência da condicional"
 },
 {
  "id": "rlm-m03-autoral-04",
  "origem": "autoral-ia",
  "q": "Assinale a negação lógica de: \"Todo servidor do setor possui pelo menos uma certificação\".",
  "options": [
   "Nenhum servidor do setor possui certificação.",
   "Algum servidor do setor possui no máximo uma certificação.",
   "Algum servidor do setor não possui nenhuma certificação.",
   "Algum servidor do setor possui certificação.",
   "Todo servidor do setor possui menos de uma certificação."
  ],
  "answer": 2,
  "explanation": "A negação de \"Todo A é B\" é \"Algum A não é B\": basta um servidor que contrarie a regra. A propriedade B, aqui, é \"possuir pelo menos uma certificação\", cuja negação é \"não possuir nenhuma certificação\" (zero certificações). Logo, a negação é \"algum servidor do setor não possui nenhuma certificação\". \"Nenhum servidor possui certificação\" nega demais (troca \"todo\" por \"nenhum\", que é a contrária, não a contraditória). \"Possui no máximo uma\" inclui quem tem exatamente uma, que satisfaz a regra original, e portanto não a contradiz. \"Algum servidor possui certificação\" é compatível com a regra original (pode até ser que todos possuam). \"Todo servidor possui menos de uma certificação\" repete o erro de generalizar a negação para todos.",
  "lawRef": "Negação de quantificador universal — \"todo\" vira \"algum...não\""
 },
 {
  "id": "rlm-m03-autoral-05",
  "origem": "autoral-ia",
  "q": "Considere a afirmação: \"Se não há recurso, então o réu cumpre a pena\". Uma afirmação logicamente equivalente a ela é:",
  "options": [
   "Não há recurso ou o réu cumpre a pena.",
   "Há recurso e o réu cumpre a pena.",
   "Não há recurso e o réu não cumpre a pena.",
   "Há recurso ou o réu cumpre a pena.",
   "Se há recurso, então o réu não cumpre a pena."
  ],
  "answer": 3,
  "explanation": "Sejam R = \"há recurso\" e C = \"o réu cumpre a pena\". A frase é ¬R → C. A regra P → Q ≡ ¬P ∨ Q aplicada com P = ¬R dá ¬(¬R) ∨ C = R ∨ C, isto é, \"há recurso ou o réu cumpre a pena\". O ponto de atenção é a dupla negação: o antecedente já era negado, de modo que, ao reescrever, o \"não há recurso\" vira \"há recurso\". Quem não percebe isso escolhe \"Não há recurso ou o réu cumpre a pena\" (que equivale a R → C). \"Há recurso e o réu cumpre a pena\" e \"não há recurso e o réu não cumpre a pena\" são conjunções, que afirmam mais do que a condicional. \"Se há recurso, então o réu não cumpre a pena\" é a inversa (R → ¬C), não equivalente.",
  "lawRef": "Condicional como disjunção — P → Q ≡ ¬P ∨ Q, com dupla negação"
 },
 {
  "id": "rlm-m03-autoral-06",
  "origem": "autoral-ia",
  "q": "A negação lógica de \"Não existe candidato que não tenha estudado\" é:",
  "options": [
   "Algum candidato não estudou.",
   "Todo candidato estudou.",
   "Nenhum candidato estudou.",
   "Algum candidato estudou.",
   "Exatamente um candidato não estudou."
  ],
  "answer": 0,
  "explanation": "Passo a passo: \"Não existe candidato que não tenha estudado\" significa que não há ninguém sem ter estudado, isto é, \"todo candidato estudou\". A negação disso é \"algum candidato não estudou\" (basta um contraexemplo). Outro caminho: a afirmação original tem a forma ¬(existe x que não estudou); negá-la é remover a negação externa e obter \"existe x que não estudou\". \"Todo candidato estudou\" é a própria afirmação original reescrita, não sua negação. \"Nenhum candidato estudou\" é a contrária de \"todo\", mais forte que a negação. \"Algum candidato estudou\" é compatível com a original. \"Exatamente um candidato não estudou\" é um caso particular da negação (\"algum não estudou\"), mas a negação lógica é mais ampla: vale com um, dois ou todos sem estudar.",
  "lawRef": "Negação de quantificadores e dupla negação"
 },
 {
  "id": "rlm-m03-autoral-07",
  "origem": "autoral-ia",
  "q": "Considere as proposições: I. ¬P ∨ Q; II. ¬Q → ¬P; III. Q → P; IV. ¬P → ¬Q; V. ¬(P ∧ ¬Q). São equivalentes a \"P → Q\" apenas:",
  "options": [
   "I e II",
   "I, II e III",
   "I, II e V",
   "III e IV",
   "I, II, IV e V"
  ],
  "answer": 2,
  "explanation": "P → Q só é falsa quando P é V e Q é F. I (¬P ∨ Q) é F exatamente nessa linha: equivalente. II (¬Q → ¬P) é a contrapositiva: equivalente. V (¬(P ∧ ¬Q)) é a negação do único caso falso: equivalente (De Morgan dá ¬P ∨ Q). III (Q → P) é a recíproca e IV (¬P → ¬Q) é a inversa: ambas são falsas na linha P = F, Q = V, em que P → Q é verdadeira; logo, não são equivalentes (e, aliás, são equivalentes entre si). Assim, as equivalentes são I, II e V. Os erros típicos: esquecer que V também é equivalente (primeira alternativa) ou confundir a recíproca e a inversa com a contrapositiva (demais alternativas).",
  "lawRef": "Equivalências da condicional — contrapositiva, recíproca e inversa"
 },
 {
  "id": "rlm-m03-autoral-08",
  "origem": "autoral-ia",
  "q": "A negação lógica da proposição \"Todos os técnicos foram aprovados e algum técnico foi nomeado\" é:",
  "options": [
   "Nenhum técnico foi aprovado e nenhum técnico foi nomeado.",
   "Algum técnico não foi aprovado e nenhum técnico foi nomeado.",
   "Algum técnico não foi aprovado ou algum técnico não foi nomeado.",
   "Nenhum técnico foi aprovado ou nenhum técnico foi nomeado.",
   "Algum técnico não foi aprovado ou nenhum técnico foi nomeado."
  ],
  "answer": 4,
  "explanation": "A proposição tem a forma (Todo T é A) ∧ (Algum T é N). Por De Morgan, a negação da conjunção é a disjunção das negações. A negação de \"Todo T é A\" é \"Algum T não é A\"; a negação de \"Algum T é N\" é \"Nenhum T é N\". Logo: \"algum técnico não foi aprovado ou nenhum técnico foi nomeado\". Erros comuns: manter a conjunção (duas alternativas usam \"e\"); trocar \"todo\" por \"nenhum\" (nega demais); e dizer que a negação de \"algum foi nomeado\" é \"algum não foi nomeado\", o que é falso: se algum técnico não foi nomeado, isso não impede que outro tenha sido, então a afirmação original continua verdadeira.",
  "lawRef": "Negação de quantificadores combinados com Leis de De Morgan"
 },
 {
  "id": "rlm-m03-autoral-09",
  "origem": "autoral-ia",
  "q": "Considere a afirmação: \"O candidato é aprovado se, e somente se, obtém nota igual ou superior a 6\". Uma afirmação logicamente equivalente à negação dessa afirmação é:",
  "options": [
   "O candidato não é aprovado se, e somente se, obtém nota inferior a 6.",
   "O candidato é aprovado se, e somente se, obtém nota inferior a 6.",
   "Se o candidato é aprovado, então obtém nota inferior a 6.",
   "O candidato é aprovado e obtém nota inferior a 6.",
   "O candidato não é aprovado ou obtém nota inferior a 6."
  ],
  "answer": 1,
  "explanation": "Sejam A = \"é aprovado\" e N = \"nota ≥ 6\"; a afirmação é A ↔ N, que é V quando A e N têm o mesmo valor. Sua negação é V quando A e N têm valores diferentes, o que equivale a A ↔ ¬N (negar apenas um dos lados): \"é aprovado se, e somente se, a nota é inferior a 6\" (¬N = nota < 6). Se os dois lados fossem negados, ¬A ↔ ¬N, obter-se-ia de novo a afirmação original (dupla troca de valores), que é o erro mais comum (\"não é aprovado se, e somente se, a nota é inferior a 6\"). As demais não equivalem à negação: \"se é aprovado, então a nota é inferior a 6\" (A → ¬N) é verdadeira na linha A = F, N = F, em que A ↔ N é V e, portanto, a negação é F; \"é aprovado e obtém nota inferior a 6\" (A ∧ ¬N) deixa de fora a linha A = F, N = V, que torna a negação verdadeira; \"não é aprovado ou obtém nota inferior a 6\" (¬A ∨ ¬N) é verdadeira na linha A = F, N = F, em que a negação é falsa.",
  "lawRef": "Negação da bicondicional — ¬(P ↔ Q) ≡ P ↔ ¬Q"
 },
 {
  "id": "rlm-m03-autoral-10",
  "origem": "autoral-ia",
  "q": "Considere a afirmação: \"Nenhum servidor estável foi exonerado sem processo administrativo\". Uma afirmação logicamente equivalente é:",
  "options": [
   "Todo servidor estável foi exonerado após processo administrativo.",
   "Todo servidor estável foi submetido a processo administrativo.",
   "Algum servidor estável exonerado foi submetido a processo administrativo.",
   "Todo servidor estável exonerado foi submetido a processo administrativo.",
   "Nenhum servidor estável foi submetido a processo administrativo e exonerado."
  ],
  "answer": 3,
  "explanation": "Entre os servidores estáveis, a afirmação diz que não há quem tenha sido exonerado e não tenha tido processo. \"Nenhum (X e não-Y)\" equivale a \"Todo X é Y\": é a negação de \"algum servidor estável foi exonerado sem processo\". Restringindo o universo ao subconjunto dos exonerados, resulta que todo servidor estável exonerado foi submetido a processo. Os outros enunciados: \"todo servidor estável foi exonerado após processo\" afirma que todos foram exonerados (a original nada diz sobre quantos o foram); \"todo servidor estável foi submetido a processo\" estende a exigência a quem nem foi exonerado; \"algum exonerado foi submetido a processo\" afirma existência, que a original não garante; e \"nenhum foi submetido a processo e exonerado\" afirma o contrário do processo.",
  "lawRef": "Equivalência de quantificadores — \"nenhum (A e não-B)\" = \"todo A é B\""
 },
 {
  "id": "rlm-m03-autoral-11",
  "origem": "autoral-ia",
  "q": "Uma servidora afirma: \"Ana estuda e Bruno trabalha\". A negação lógica dessa afirmação é:",
  "options": [
   "Ana não estuda e Bruno não trabalha.",
   "Ana estuda ou Bruno trabalha.",
   "Ana não estuda ou Bruno não trabalha.",
   "Ana não estuda e Bruno trabalha.",
   "Ana estuda e Bruno não trabalha."
  ],
  "answer": 2,
  "explanation": "Pela lei de De Morgan, ¬(P ∧ Q) ≡ ¬P ∨ ¬Q: nega-se cada parcela e troca-se \"e\" por \"ou\". Com P: Ana estuda e Q: Bruno trabalha, a negação é \"Ana não estuda ou Bruno não trabalha\". Basta uma das duas ser falsa para a conjunção original ser falsa. A opção com \"e\" entre as duas negações é mais forte que o necessário (nega ambas); as demais mantêm uma parcela afirmada e trocam o conectivo de modo incorreto, não sendo a negação.",
  "lawRef": "Leis de De Morgan (negação da conjunção)"
 },
 {
  "id": "rlm-m03-autoral-12",
  "origem": "autoral-ia",
  "q": "A negação da proposição \"P ∨ Q\" (\"P ou Q\", no sentido inclusivo) é equivalente a:",
  "options": [
   "¬P ∨ ¬Q",
   "P ∧ Q",
   "P ∧ ¬Q",
   "¬P → Q",
   "¬P ∧ ¬Q"
  ],
  "answer": 4,
  "explanation": "De Morgan: ¬(P ∨ Q) ≡ ¬P ∧ ¬Q. Para um \"ou\" inclusivo ser falso, as duas parcelas precisam ser falsas, e isso é dito por ¬P ∧ ¬Q. Conferindo na tabela: P ∨ Q só é falso em FF, e ¬P ∧ ¬Q só é verdadeira em FF. A opção ¬P ∨ ¬Q é a negação da conjunção, não da disjunção. P ∧ Q e P ∧ ¬Q não coincidem com ¬(P ∨ Q) em nenhuma linha que o torna falso, e ¬P → Q equivale a P ∨ Q, ou seja, à própria proposição.",
  "lawRef": "Leis de De Morgan (negação da disjunção)"
 },
 {
  "id": "rlm-m03-autoral-13",
  "origem": "autoral-ia",
  "q": "Uma chefia afirma: \"Todos os servidores foram pontuais\". A negação lógica dessa afirmação é:",
  "options": [
   "Nenhum servidor foi pontual.",
   "Pelo menos um servidor não foi pontual.",
   "Todos os servidores foram impontuais.",
   "Algum servidor foi pontual.",
   "Alguns servidores foram pontuais."
  ],
  "answer": 1,
  "explanation": "Negar uma proposição universal (\"todos são...\") exige apenas um contraexemplo: existe pelo menos um que não é. Logo a negação é \"Pelo menos um servidor não foi pontual\". \"Nenhum foi pontual\" e \"todos foram impontuais\" são contrárias, mais fortes que a negação: a frase original poderia ser falsa com apenas um atrasado, sem que ninguém tenha sido pontual. \"Algum foi pontual\" e \"alguns foram pontuais\" podem ser verdadeiras mesmo quando a original é verdadeira, portanto não a negam.",
  "lawRef": "Negação de proposição categórica universal"
 },
 {
  "id": "rlm-m03-autoral-14",
  "origem": "autoral-ia",
  "q": "Qual das expressões a seguir é logicamente equivalente à condicional P → Q?",
  "options": [
   "¬P ∨ Q",
   "P ∧ Q",
   "P ∨ ¬Q",
   "Q → P",
   "¬P ∧ Q"
  ],
  "answer": 0,
  "explanation": "A condicional é falsa apenas quando P = V e Q = F, e ¬P ∨ Q também é falsa apenas nessa linha (¬P = F e Q = F), logo P → Q ≡ ¬P ∨ Q. Conferindo: P ∧ Q é falsa com P = F e Q = V, onde P → Q é verdadeira; P ∨ ¬Q é falsa nessa mesma linha; ¬P ∧ Q é falsa com P = V e Q = V, onde a condicional é verdadeira. Assim nenhuma delas coincide com a condicional em todas as linhas. Q → P é a recíproca, que não é equivalente.",
  "lawRef": "Equivalência da condicional (P → Q ≡ ¬P ∨ Q)"
 },
 {
  "id": "rlm-m03-autoral-15",
  "origem": "autoral-ia",
  "q": "Qual é a negação lógica da sentença \"Se o servidor corre, então ele treina\"?",
  "options": [
   "Se o servidor não corre, então não treina.",
   "Se o servidor treina, então corre.",
   "O servidor não corre ou treina.",
   "O servidor corre e não treina.",
   "O servidor corre e treina."
  ],
  "answer": 3,
  "explanation": "A negação da condicional é ¬(P → Q) ≡ P ∧ ¬Q: a condicional só é falsa quando o antecedente é verdadeiro e o consequente é falso. Assim, nega-se \"se corre, treina\" afirmando que \"corre e não treina\". As condicionais \"se não corre, não treina\" (inversa) e \"se treina, corre\" (recíproca) não são negações. \"Não corre ou treina\" é a equivalente ¬P ∨ Q da própria condicional, logo é a mesma proposição, não a negação. \"Corre e treina\" torna a condicional verdadeira.",
  "lawRef": "Negação da condicional (P ∧ ¬Q)"
 },
 {
  "id": "rlm-m03-autoral-16",
  "origem": "autoral-ia",
  "q": "A contrapositiva da condicional \"Se A, então B\" é:",
  "options": [
   "Se B, então A.",
   "Se não A, então não B.",
   "A e não B.",
   "A ou B.",
   "Se não B, então não A."
  ],
  "answer": 4,
  "explanation": "A contrapositiva de A → B é ¬B → ¬A, que é logicamente equivalente à condicional original (mesma tabela-verdade: falsa só com A = V e B = F). \"Se B, então A\" é a recíproca; \"Se não A, então não B\" é a inversa; ambas são equivalentes entre si, mas não à original. \"A e não B\" é a negação da condicional, tem valor oposto ao dela. \"A ou B\" é outra proposição: com A = F e B = F é falsa, enquanto a condicional é verdadeira.",
  "lawRef": "Contrapositiva (equivalência de P → Q com ¬Q → ¬P)"
 },
 {
  "id": "rlm-m03-autoral-17",
  "origem": "autoral-ia",
  "q": "Em uma reunião, a gestora disse: \"Nenhum aluno faltou\". Se essa afirmação for falsa, é correto concluir que:",
  "options": [
   "Pelo menos um aluno faltou.",
   "Todos os alunos faltaram.",
   "Nenhum aluno compareceu.",
   "Todos os alunos compareceram.",
   "Alguns alunos compareceram."
  ],
  "answer": 0,
  "explanation": "\"Nenhum aluno faltou\" é uma universal negativa. Sua negação é \"existe pelo menos um aluno que faltou\", pois basta um contraexemplo para que \"nenhum\" seja falso. Por isso, se a frase é falsa, concluímos apenas que pelo menos um faltou. \"Todos faltaram\" e \"nenhum compareceu\" são mais fortes do que o necessário. \"Todos compareceram\" é equivalente à própria frase original, logo seria verdadeira, e não falsa. \"Alguns compareceram\" pode ocorrer com a frase verdadeira ou falsa, não sendo consequência obrigatória.",
  "lawRef": "Negação de proposição categórica universal negativa"
 },
 {
  "id": "rlm-m03-autoral-18",
  "origem": "autoral-ia",
  "q": "Qual é a negação lógica da proposição (P ∨ Q) → R?",
  "options": [
   "¬P ∧ ¬Q ∧ R",
   "(P ∨ Q) ∧ ¬R",
   "(P ∧ Q) ∧ ¬R",
   "¬(P ∨ Q) ∧ R",
   "¬P ∨ ¬Q ∨ R"
  ],
  "answer": 1,
  "explanation": "A negação de uma condicional A → B é A ∧ ¬B. Tomando A = (P ∨ Q) e B = R, obtém-se (P ∨ Q) ∧ ¬R: mantém-se o antecedente inteiro (sem aplicar De Morgan sobre ele) e nega-se apenas o consequente. A opção (P ∧ Q) ∧ ¬R altera o antecedente de \"ou\" para \"e\"; ¬P ∧ ¬Q ∧ R e ¬(P ∨ Q) ∧ R negam o antecedente e mantêm o consequente; ¬P ∨ ¬Q ∨ R não corresponde à negação (é próxima de ¬(P ∧ Q) ∨ R, equivalente a outra condicional).",
  "lawRef": "Negação da condicional com antecedente composto"
 },
 {
  "id": "rlm-m03-autoral-19",
  "origem": "autoral-ia",
  "q": "Qual frase é logicamente equivalente a \"Não é verdade que, se estudo, então sou aprovado\"?",
  "options": [
   "Não estudo e sou aprovado.",
   "Se não estudo, então não sou aprovado.",
   "Não estudo ou sou aprovado.",
   "Estudo e não sou aprovado.",
   "Estudo se e somente se sou aprovado."
  ],
  "answer": 3,
  "explanation": "A frase nega uma condicional: ¬(E → A) ≡ E ∧ ¬A, isto é, \"estudo e não sou aprovado\" (o único caso em que \"se estudo, sou aprovado\" falha). \"Não estudo e sou aprovado\" troca a negação de lugar. \"Se não estudo, não sou aprovado\" é a inversa da condicional original e não a sua negação. \"Não estudo ou sou aprovado\" é equivalente à própria condicional (¬E ∨ A), portanto tem valor oposto ao da frase. A bicondicional é outra operação.",
  "lawRef": "Negação da condicional"
 },
 {
  "id": "rlm-m03-autoral-20",
  "origem": "autoral-ia",
  "q": "Em uma auditoria, afirmou-se: \"Todo processo analisado está regular ou arquivado\". Se essa afirmação for falsa (considere \"ou\" inclusivo), então:",
  "options": [
   "existe processo analisado que não está regular ou não está arquivado.",
   "nenhum processo analisado está regular ou arquivado.",
   "existe processo analisado que não está regular e não está arquivado.",
   "todo processo analisado não está regular.",
   "todo processo analisado está regular e arquivado."
  ],
  "answer": 2,
  "explanation": "Seja o universo dos processos analisados, com B: regular e C: arquivado. A afirmação é \"para todo x, B(x) ∨ C(x)\". Sua negação é \"existe x tal que ¬(B(x) ∨ C(x))\", e por De Morgan ¬(B ∨ C) ≡ ¬B ∧ ¬C. Logo existe um processo que não é regular e não é arquivado, ao mesmo tempo. A opção com \"ou\" entre as negações é fraca demais (ocorre também quando o processo é regular e não arquivado, caso em que a afirmação original seria verdadeira para ele). As demais universais são fortes demais ou trocam o conectivo.",
  "lawRef": "Negação de quantificador universal com De Morgan"
 }
];
