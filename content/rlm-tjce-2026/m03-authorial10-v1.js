/* Base Completa | Raciocínio Lógico-Matemático M03 (Negações e Equivalências Lógicas): dez questões originais autorais e comentadas.
 * Não são questões reais de bancas. Escritas em 11/11/2026 no nível de prova (5 alternativas),
 * com gabarito equilibrado (A–E, duas vezes cada); cada lei citada traz o nome e cada artigo, o que ele diz.
 * Fontes: Lógica proposicional e de quantificadores: negação de proposições compostas, Leis de De Morgan, negação da condicional, contrapositiva, recíproca, inversa e negação de "todo", "algum" e "nenhum". Questões autorais.
 */
window.BC_RLM_AUTHORIAL_OVERRIDES=window.BC_RLM_AUTHORIAL_OVERRIDES||{};
window.BC_RLM_AUTHORIAL_OVERRIDES[3]=[
  {
    "id": "rlm-m03-autoral-01",
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
    "lawRef": "Negação de proposição composta — Leis de De Morgan",
    "provenance": "questao-autoral-IA-revisada"
  },
  {
    "id": "rlm-m03-autoral-02",
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
    "lawRef": "Negação da condicional — ¬(A → B) = A ∧ ¬B, com De Morgan",
    "provenance": "questao-autoral-IA-revisada"
  },
  {
    "id": "rlm-m03-autoral-03",
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
    "lawRef": "Contrapositiva e Leis de De Morgan — equivalência da condicional",
    "provenance": "questao-autoral-IA-revisada"
  },
  {
    "id": "rlm-m03-autoral-04",
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
    "lawRef": "Negação de quantificador universal — \"todo\" vira \"algum...não\"",
    "provenance": "questao-autoral-IA-revisada"
  },
  {
    "id": "rlm-m03-autoral-05",
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
    "lawRef": "Condicional como disjunção — P → Q ≡ ¬P ∨ Q, com dupla negação",
    "provenance": "questao-autoral-IA-revisada"
  },
  {
    "id": "rlm-m03-autoral-06",
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
    "lawRef": "Negação de quantificadores e dupla negação",
    "provenance": "questao-autoral-IA-revisada"
  },
  {
    "id": "rlm-m03-autoral-07",
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
    "lawRef": "Equivalências da condicional — contrapositiva, recíproca e inversa",
    "provenance": "questao-autoral-IA-revisada"
  },
  {
    "id": "rlm-m03-autoral-08",
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
    "lawRef": "Negação de quantificadores combinados com Leis de De Morgan",
    "provenance": "questao-autoral-IA-revisada"
  },
  {
    "id": "rlm-m03-autoral-09",
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
    "lawRef": "Negação da bicondicional — ¬(P ↔ Q) ≡ P ↔ ¬Q",
    "provenance": "questao-autoral-IA-revisada"
  },
  {
    "id": "rlm-m03-autoral-10",
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
    "lawRef": "Equivalência de quantificadores — \"nenhum (A e não-B)\" = \"todo A é B\"",
    "provenance": "questao-autoral-IA-revisada"
  }
];
