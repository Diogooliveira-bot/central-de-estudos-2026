# Direito Penal — Código Penal e módulos m01–m24: revisão jurídica

Data da conferência: 2026-10-24 (relatório gerado em 2026-10-28)

Foram revisadas 1769 questões: 1763 em `tools/decorando-data-penal.js` (módulos m01–m24, sem m19, que não existe) e 6 itens LED do Código Penal em `tools/decorando-data-led-aprovadas.js` (cópia espelhada em `lei-em-dia-aprovadas-20261012.js`, o arquivo servido pela API). Nenhum gabarito foi alterado.

## Método

- Cada questão foi comparada com o texto compilado do Código Penal (Planalto) e, nos itens autorais, com a lei de origem do Vade Mecum da Central.
- A explicação foi reescrita ("Correta." ou "Errada." conforme o gabarito, citando o dispositivo; "Em revisão." nos pendentes).
- O campo `parts` foi refeito com trechos literais do texto oficial; uma checagem automática garante que cada trecho existe no texto da lei.
- Conferido objeto a objeto contra a `main`: só `parts`, `question.explanation` e `question.legalAudit` mudaram; nenhum gabarito foi alterado.
- `certificado-parcial`: a verdade do item depende de classificação doutrinária, jurisprudência ou lei extravagante ainda não conferidas em fonte oficial. `pendente`: gabarito possivelmente divergente, enunciado sem proposição julgável ou fatos essenciais ausentes.

## Resultado

| Status | Questões |
|---|---|
| certificado | 1547 |
| certificado-parcial | 198 |
| pendente | 24 |

| Módulo | Questões | Certificadas | Parciais | Pendentes |
|---|---:|---:|---:|---:|
| led-penal-cp-2848 | 6 | 6 | 0 | 0 |
| pen-m01 | 6 | 3 | 2 | 1 |
| pen-m02 | 171 | 164 | 6 | 1 |
| pen-m03 | 62 | 56 | 5 | 1 |
| pen-m04 | 100 | 85 | 15 | 0 |
| pen-m05 | 49 | 41 | 8 | 0 |
| pen-m06 | 301 | 265 | 35 | 1 |
| pen-m07 | 150 | 133 | 16 | 1 |
| pen-m08 | 167 | 136 | 26 | 5 |
| pen-m09 | 147 | 117 | 28 | 2 |
| pen-m10 | 80 | 70 | 8 | 2 |
| pen-m11 | 67 | 54 | 13 | 0 |
| pen-m12 | 220 | 197 | 17 | 6 |
| pen-m13 | 2 | 2 | 0 | 0 |
| pen-m14 | 3 | 3 | 0 | 0 |
| pen-m15 | 5 | 4 | 0 | 1 |
| pen-m16 | 23 | 22 | 0 | 1 |
| pen-m17 | 9 | 7 | 2 | 0 |
| pen-m18 | 132 | 116 | 15 | 1 |
| pen-m20 | 18 | 18 | 0 | 0 |
| pen-m21 | 3 | 3 | 0 | 0 |
| pen-m22 | 9 | 8 | 0 | 1 |
| pen-m23 | 26 | 26 | 0 | 0 |
| pen-m24 | 13 | 11 | 2 | 0 |

## Pendentes (publicar como pendente)

Gabarito mantido em todos; explicação começa com "Em revisão." (24 itens).

- `decorando-pen-autoral-003` (pen-m01, Conflito aparente de normas, gab. C): O enunciado ("Sobre Conflito aparente, julgue a afirmação: consunção.") não traz uma proposição completa que possa ser julgada. Na consunção, o fato-meio é absorvido pelo fato-fim, e o conflito aparente de normas também se resolve por especialidade, subsidiariedade e alternatividade. Gabarito mantido (Certo) e sujeito à revisão.
- `decorando-penal-dls-20260827-0119` (pen-m02, Art. 7º, I, b, CP, gab. C): O enunciado reproduz o art. 7º, I, b, do CP, mas aplicá-lo ao caso exige tratar a lavagem de dinheiro, praticada em banco no exterior, como crime contra o patrimônio ou a fé pública de Município, o que não decorre diretamente do texto legal. Gabarito mantido (Certo) e sujeito à revisão.
- `decorando-penal-dls-20260827-0380` (pen-m03, Art. 23, § único, CP, gab. E): O art. 23, parágrafo único, do CP trata apenas do excesso doloso e do culposo; as figuras do excesso acidental e do exculpante são construções doutrinárias, e a equiparação do "excesso inconsciente" ao "exculpante" não tem respaldo no texto legal e varia entre os autores (fontes secundárias descrevem o excesso exculpante como decorrente de medo, surpresa ou perturbação de ânimo, e o excesso involuntário como gênero mais amplo). Gabarito mantido (Errado) e sujeito à revisão.
- `decorando-penal-dls-20260827-0648` (pen-m06, Art. 64, I, CP, gab. C): O enunciado estima o término do prazo de cinco anos do art. 64, I, do CP em abril de 2012, contando a pena de dois anos a partir da condenação definitiva (abril de 2005); se o tempo de prisão provisória desde fevereiro de 2005 for computado (art. 42), o prazo terminaria em fevereiro de 2012, antes do novo crime (março de 2012), e a reincidência não subsistiria. O enunciado não informa a data efetiva de término do cumprimento. Gabarito mantido (Certo) e sujeito à revisão.
- `decorando-penal-dls-20260827-0831` (pen-m07, Art. 106, I c/c Art. 140, CP, gab. C): O art. 106, I, do CP determina que o perdão concedido a qualquer dos querelados a todos aproveita, mas o inciso III dispõe que, se o querelado o recusa, não produz efeito. O enunciado afirma que o perdão concedido a Sérgio se aplica, "obrigatoriamente", a João e a Paulo, sem ressalvar a possibilidade de recusa; por isso o gabarito (Certo) permanece em revisão. A tipificação como injúria (art. 140) é compatível com o texto.
- `decorando-penal-dls-20260827-1000` (pen-m08, Art. 121, § 6º, CP, gab. C): O enunciado não traz dados que permitam concluir que a causa de aumento foi a do § 6º do art. 121 do CP: o homicídio simples doloso pode ter a pena aumentada também pelo § 4º (vítima menor de 14 ou maior de 60 anos). O texto parece truncado; o gabarito (Certo) permanece em revisão.
- `decorando-penal-dls-20260827-1047` (pen-m08, Art. 136, CP, gab. E): O art. 136 do CP exige que a vítima esteja sob a autoridade, guarda ou vigilância do agente, para fim de educação, ensino, tratamento ou custódia, o que restringe o sujeito ativo, em contrariedade com a afirmação de que "qualquer pessoa" pode ser sujeito ativo. Entretanto, a questão consta com a indicação "Anulada" na fonte, e a classificação como crime de forma vinculada depende da doutrina; o gabarito (Errado) permanece em revisão.
- `decorando-penal-dls-20260827-1060` (pen-m08, Art. 139, CP, gab. C): O excerto atribui à vítima condutas genéricas ("atrocidade atrás de atrocidades") e qualificações ofensivas, e não permite concluir, apenas com o texto do CP, se a condenação foi por difamação (imputação de fato ofensivo à reputação, art. 139) ou por injúria (ofensa à dignidade ou ao decoro, art. 140); o gabarito (Certo) depende da sentença e permanece em revisão.
- `decorando-penal-dls-20260827-1123` (pen-m08, Art. 149-A, II, § 1º, II, CP, gab. C): O enunciado transcrito descreve o transporte de João, adolescente, com a finalidade de submetê-lo a trabalho em condições análogas às de escravo, mas não menciona o meio executório exigido pelo caput do art. 149-A do CP (grave ameaça, violência, coação, fraude ou abuso); com os dados disponíveis não é possível confirmar o gabarito (Certo), que supõe a causa de aumento do § 1º, II (vítima adolescente) e a inaplicabilidade da redução do § 2º, que exige agente primário.
- `decorando-penal-dls-20260827-1139` (pen-m08, Art. 121, § 2º-B, I, CP, gab. C): O art. 121, § 2º-B, I, do CP aumenta de um terço até a metade a pena do homicídio contra menor de 14 anos se a vítima é pessoa com deficiência ou com doença que implique o aumento de sua vulnerabilidade, mas o enunciado transcrito não informa que a vítima tinha deficiência ou doença, nem qual causa de aumento foi reconhecida (o § 2º-B prevê também os incisos II e III); com os dados disponíveis não é possível confirmar o gabarito (Certo).
- `decorando-penal-dls-20260827-1163` (pen-m09, Art 155, § 4º, V, CP, gab. C): O art. 155, § 4º, V, do CP comina reclusão, de 2 a 8 anos, e multa, ao furto cometido contra quaisquer bens que comprometam o funcionamento de órgãos da União, de Estado, do Distrito Federal ou de Município ou de estabelecimentos públicos ou privados que prestem serviços essenciais; o enunciado fala em "serviços públicos essenciais", expressão que consta do art. 157, § 1º-A, do CP (roubo), e não do inciso V do furto. Como o texto legal difere do enunciado, o gabarito (Certo) permanece em revisão.
- `decorando-penal-dls-20260827-1246` (pen-m09, Art. 171, § 3°, CP, gab. C): O art. 171, § 3º, do CP prevê causa de aumento de um terço (e não qualificadora) se o crime é cometido em detrimento de entidade de direito público; o enunciado fala em "estelionato qualificado" e se apoia no entendimento do STJ sobre o servidor que registra o ponto e se ausenta do serviço, sem confirmação em fonte oficial. Como o termo do enunciado difere do texto legal e a premissa jurisprudencial está sem confirmação, o gabarito (Certo) permanece em revisão.
- `decorando-penal-dls-20260827-1458` (pen-m10, Art. 298, § único, CP, gab. C): O enunciado transcrito informa apenas que Caio foi condenado por falsificação de documento particular (art. 298 do CP), sem indicar o objeto falsificado; o parágrafo único equipara o cartão de crédito ou débito a documento particular, mas o enunciado não permite deduzir que foi esse o objeto. O gabarito (Certo) permanece em revisão.
- `decorando-penal-dls-20260827-1461` (pen-m10, Art. 299, CP, gab. C): O enunciado descreve funcionário que insere dados falsos em sistema eletrônico oficial de emissão de atestados, com o fim de permitir a terceiros obter licenças remuneradas. Além da falsidade ideológica do art. 299 do CP, o art. 313-A pune o funcionário autorizado que insere dados falsos em sistemas informatizados ou bancos de dados da Administração Pública com o fim de obter vantagem indevida para si ou para outrem ou para causar dano. Como o enunciado não esclarece se o agente era funcionário autorizado nem qual tipo o gabarito adotou, o gabarito (Certo) permanece em revisão.
- `decorando-penal-dls-20260827-1527` (pen-m12, Art. 312, §§ 2º e 3º, CP, gab. C): O enunciado não informa qual foi o tipo penal que resultou da readequação da acusação (diz apenas que a conduta de Julius "se amoldava a outro tipo penal"), de modo que não é possível afirmar, só com esses dados, que se trate de peculato culposo. A reparação do dano antes da sentença irrecorrível extingue a punibilidade no peculato culposo (art. 312, § 3º, do CP), mas o enunciado não descreve fatos que levem ao § 2º. O gabarito (Certo) permanece em revisão.
- `decorando-penal-dls-20260827-1530` (pen-m12, Art. 312, § 3º, CP, gab. E): O § 3º do art. 312 extingue a punibilidade do peculato culposo se a reparação do dano precede a sentença irrecorrível. O enunciado diz que há extinção se o ressarcimento ocorrer "antes da denúncia", hipótese que está abrangida pelo § 3º, embora o marco legal seja a sentença irrecorrível, e não a denúncia. Como o enunciado, lido literalmente, não contraria o texto e o gabarito (Errado) o trata como falso por apontar marco diverso, o gabarito permanece em revisão.
- `decorando-penal-dls-20260827-1627` (pen-m12, Art. 327, § 2º, CP, gab. E): O enunciado reproduz regra de aumento de pena para ocupantes de cargo em comissão ou função de confiança em órgãos e entidades da administração (inclusive autarquia), apresentada para os crimes de licitação. No CP compilado, o aumento de um terço do art. 327, § 2º, refere-se aos crimes "previstos neste Capítulo" (crimes praticados por funcionário público contra a administração em geral), com rol de entidades diverso, e o capítulo dos crimes em licitações e contratos administrativos não traz regra equivalente. A afirmação de que o fato "não interfere na pena" parece verdadeira diante do CP atual, e o gabarito (Errado) pode corresponder a regime anterior, sem conferência em fonte oficial. O gabarito permanece em revisão.
- `decorando-penal-dls-20260827-1637` (pen-m12, Art. 330, CP, gab. C): O art. 330 do CP pune quem desobedece a ordem legal de funcionário público. O enunciado é genérico: não informa se a ordem era legal nem as circunstâncias da fuga, e a tipicidade da simples fuga após ordem de parada depende de análise do caso e de entendimento de jurisprudência, sem conferência em fonte oficial nesta revisão. O gabarito (Certo) permanece em revisão.
- `decorando-penal-dls-20260827-1640` (pen-m12, Art. 332, CP, gab. C): A secretária alegou prestígio junto a magistrados do Tribunal de Justiça para influenciar sentenças. O art. 357 do CP (exploração de prestígio) pune solicitar ou receber dinheiro ou utilidade a pretexto de influir em juiz, jurado, órgão do Ministério Público, funcionário de justiça, perito, tradutor, intérprete ou testemunha, enquanto o art. 332 (tráfico de influência) trata da influência em ato de funcionário público em geral. Como a influência alegada recai sobre juízes, a conduta parece se amoldar ao art. 357, e o gabarito (Certo), que aponta tráfico de influência, permanece em revisão.
- `decorando-penal-dls-20260827-1659` (pen-m12, Art. 334, § 1º, I, CP, gab. C): O enunciado diz apenas que Caio foi condenado por descaminho, a dois anos de reclusão em regime aberto, sem informar qual conduta praticou. O art. 334 pune o descaminho no caput e, com a mesma pena, no § 1º, I a IV, incluindo a navegação de cabotagem fora dos casos permitidos (inciso I). A condenação por descaminho, por si, não permite concluir que Caio praticou a navegação de cabotagem do inciso I. O gabarito (Certo) permanece em revisão.
- `decorando-pen-autoral-025` (pen-m15, STJ, Súmula 444, gab. C): A Súmula 444 do STJ, conferida em fonte secundária, estabelece que "é vedada a utilização de inquéritos policiais e ações penais em curso para agravar a pena-base". O enunciado do item traz apenas o complemento ("inquéritos policiais e ações penais em curso para agravar a pena-base") e omite o verbo da súmula (é vedada a utilização); lido isoladamente, sem o verbo, pode ser entendido em sentido contrário ao da súmula. O gabarito (Certo) corresponde ao conteúdo da súmula, mas permanece em revisão por causa do enunciado truncado.
- `decorando-penal-dls-20260827-1682` (pen-m16, Art. 337-N, CP, gab. C): O enunciado atribui o crime de impedimento indevido (art. 337-N do CP) a Ricardo, que é o interessado prejudicado pela conduta. O tipo pune obstar, impedir ou dificultar injustamente a inscrição de qualquer interessado nos registros cadastrais, e o autor da conduta narrada seria o servidor Maurilio, que retardou propositadamente a análise do cadastro. Como o enunciado aponta o sujeito errado, o gabarito (Certo) permanece em revisão.
- `decorando-penal-dls-20260827-0253` (pen-m18, Arts. 16, CP, gab. E): O enunciado diz que não há, na Parte Geral do CP, causa especial de diminuição de pena, prevista apenas na Parte Especial. Pelo art. 16 do CP (arrependimento posterior) e pelo art. 14, parágrafo único (tentativa), a Parte Geral contém causas de diminuição de pena; na terminologia usual, porém, as causas "gerais" estão na Parte Geral e as "especiais", na Parte Especial, de modo que, tomada ao pé da letra, a afirmação seria correta, em contradição com o gabarito (Errado). O gabarito permanece em revisão por causa dessa ambiguidade terminológica.
- `decorando-penal-dls-20260827-1377` (pen-m22, Art. 244, CP, gab. C): O art. 244 do CP (abandono material) tem como beneficiários o cônjuge, o filho menor de 18 anos ou inapto para o trabalho e o ascendente inválido ou maior de 60 anos. O enunciado informa apenas que João, de 65 anos, foi vítima de um crime, sem dizer que ele é ascendente do agente nem que o crime foi o de abandono material; a idade, por si só, não preenche a elementar do tipo. Por faltar contexto essencial, o gabarito (Certo) permanece em revisão.

## Pontos de atenção

- **rotulo** — `decorando-penal-dls-20260827-1515`: O rótulo do item cita "Art. 312, VI", dispositivo que não existe no art. 312 do CP (o art. 312 tem caput e §§ 1º a 3º, sem incisos). O rótulo foi mantido para não alterar índices; a explicação cobre o texto correto.
- **rotulo** — `decorando-penal-dls-20260827-1653`: Enunciado inicia com "Anulada" (marcação da banca), mantido; item certificado de forma parcial.
- **rotulo** — `decorando-penal-dls-20260827-1655`: Enunciado inicia com "Anulada" (marcação da banca), mantido; item certificado de forma parcial.
- **duplicado** — `decorando-penal-dls-20260827-1725 / decorando-penal-dls-20260827-1726`: Os dois itens trazem o mesmo caso (fuga de preso por particulares em concurso de pessoas); o primeiro tem o prefixo "(MPU)". Ambos foram mantidos.
- **sem-fonte-oficial** — `decorando-penal-dls-20260827-1343`: O enunciado ("O crime de sedução foi revogado do Código Penal") foi mantido com o texto da Lei 11.106/2005 (inclusive um erro de digitação "221 222" no texto copiado); a revogação não foi verificada em fonte oficial. Status parcial.
- **enunciado-truncado** — `decorando-pen-autoral-006`: Enunciado autoral truncado ("Sobre Decadência • atualização 2026, julgue a afirmação: 30 dias."); mantido como está, status parcial.
- **prefixos-de-banca** — `-`: Prefixos como "dos Campos - SP De acordo…", "Judicial (STM)", "Campos (SP)", "(MPU)" e "(AGU)" foram mantidos nos enunciados; não fazem parte do conteúdo jurídico.

## Novidades do texto compilado e ajustes de texto

- Art. 155 (pena de 1 a 6 anos e novo § 4º) e art. 266 (pena de 2 a 4 anos, § 2º com incisos I e II), ambos com a redação da Lei 15.397/2026.
- Art. 183-A (Lei 14.967/2024); art. 288, §§ 1º e 2º (Lei 15.245/2025); art. 338-A (Lei 15.280/2025); art. 359-M-B (Lei 15.402/2026).
- Art. 218: pena de reclusão de 6 a 14 anos, e multa (redação da Lei 15.280/2025).
- Art. 334, caput: o texto compilado não traz os dois-pontos finais antes dos incisos; mantido literal.
- Art. 147-A, § 1º, II: o texto compilado remete ao "§ 2º-A do art. 121", que não existe no art. 121 do CP; remissão desatualizada mantida literal.
- Lei 9.613/1998: redação dada pela Lei 15.358/2026 considerada nos itens de lavagem.
- Correções de acentuação do texto do CP no parser: "alguém", "fútil", "impossível", "incurável"; remoção de resíduos como "Vigência", "Vide Lei nº …" e "Incluído pela Lei nº …", e junção de linhas continuadas (arts. 234-A, IV, 234-B e §§).

## Conferências em fonte secundária

Os itens abaixo, marcados como certificados com "jurisprudência/doutrina", tiveram o precedente conferido em páginas jurídicas secundárias (não no site do tribunal):

- Súmulas 659, 567, 582, 17, 522, 599, 444 e 231 do STJ
- Súmula 497 do STF
- STF, Tema 158 (via Dizer o Direito)
- excesso exculpante (art. 23, parágrafo único, do CP), em fontes doutrinárias secundárias
- STJ, AREsp 2.589.697/DF
- STF, ADPF 496

Itens com essa base (11): `decorando-penal-dls-20260827-0693`, `decorando-penal-dls-20260827-0696`, `decorando-penal-dls-20260827-1175`, `decorando-penal-dls-20260827-1186`, `decorando-penal-dls-20260827-1189`, `decorando-penal-dls-20260827-1243`, `decorando-penal-dls-20260827-1487`, `decorando-penal-dls-20260827-1490`, `decorando-penal-dls-20260827-1511`, `decorando-penal-dls-20260827-1638`, `decorando-pen-autoral-026`

## Parciais

198 itens (ids na tabela abaixo, status `certificado-parcial`).

## Itens

| Id | Módulo | Dispositivo | Gab. | Status |
|---|---|---|---|---|
| decorando-penal-pdf-001 | pen-m01 | Art. 1º, CP | C | certificado |
| decorando-penal-pdf-002 | pen-m01 | Art. 1º, CP | E | certificado |
| decorando-penal-pdf-003 | pen-m01 | Art. 1º, CP | C | certificado |
| decorando-pen-autoral-001 | pen-m01 | CF, art. 5º, XXXIX; CP, art. 1º | C | certificado-parcial |
| decorando-pen-autoral-002 | pen-m01 | Legalidade penal | E | certificado-parcial |
| decorando-pen-autoral-003 | pen-m01 | Conflito aparente de normas | C | pendente |
| decorando-penal-pdf-005 | pen-m02 | Art. 2º, CP | E | certificado |
| decorando-penal-pdf-006 | pen-m02 | Art. 2º, CP | C | certificado |
| decorando-penal-pdf-007 | pen-m02 | Art. 2º, CP | E | certificado |
| decorando-penal-pdf-008 | pen-m02 | Art. 2º, CP | E | certificado |
| decorando-penal-pdf-009 | pen-m02 | Art. 2º, CP | E | certificado |
| decorando-penal-pdf-010 | pen-m02 | Art. 2º, CP | E | certificado |
| decorando-penal-pdf-011 | pen-m02 | Art. 2º, CP | C | certificado |
| decorando-penal-pdf-012 | pen-m02 | Art. 2º, CP | E | certificado |
| decorando-penal-pdf-013 | pen-m02 | Art. 2º, CP | E | certificado |
| decorando-penal-pdf-014 | pen-m02 | Art. 2º, CP | C | certificado |
| decorando-penal-pdf-015 | pen-m02 | Art. 2º, § único, CP | E | certificado |
| decorando-penal-pdf-016 | pen-m02 | Art. 2º, parágrafo único, CP | E | certificado |
| decorando-penal-pdf-017 | pen-m02 | Art. 2º, § único, CP | C | certificado |
| decorando-penal-pdf-018 | pen-m02 | Art. 2º, § único, CP | E | certificado |
| decorando-penal-pdf-019 | pen-m02 | Art. 2º, § único, CP | E | certificado |
| decorando-penal-pdf-020 | pen-m02 | Art. 2º, § único, CP | E | certificado |
| decorando-penal-pdf-021 | pen-m02 | Art. 2º, § único, CP | C | certificado |
| decorando-penal-pdf-022 | pen-m02 | Art. 2°, § único, CP | C | certificado |
| decorando-penal-pdf-023 | pen-m02 | Art. 2º, § único, CP | E | certificado |
| decorando-penal-pdf-024 | pen-m02 | Art. 2º, § único, CP | C | certificado |
| decorando-penal-pdf-025 | pen-m02 | Art. 2º, § único, CP | E | certificado |
| decorando-penal-pdf-026 | pen-m02 | Art. 2º, § único, CP | E | certificado |
| decorando-penal-pdf-027 | pen-m02 | Art. 2º, § único, CP | C | certificado |
| decorando-penal-pdf-028 | pen-m02 | Art. 2º, § único, CP | C | certificado-parcial |
| decorando-penal-pdf-029 | pen-m02 | Art. 2º, § único, CP | E | certificado |
| decorando-penal-pdf-030 | pen-m02 | Art. 2º, § único, CP | E | certificado |
| decorando-penal-pdf-031 | pen-m02 | Art. 2º, § único, CP | E | certificado |
| decorando-penal-pdf-032 | pen-m02 | Art. 2º, § único, CP | E | certificado |
| decorando-penal-pdf-033 | pen-m02 | Art. 2º, § único, CP | E | certificado |
| decorando-penal-pdf-034 | pen-m02 | Art. 2º, § único, CP | C | certificado |
| decorando-penal-pdf-035 | pen-m02 | Art. 2º, parágrafo único, CP | E | certificado |
| decorando-penal-pdf-036 | pen-m02 | Art. 2º, § único, CP | C | certificado |
| decorando-penal-pdf-037 | pen-m02 | Art. 3º, CP | C | certificado |
| decorando-penal-pdf-045 | pen-m02 | Art. 3º, CP | C | certificado |
| decorando-penal-pdf-039 | pen-m02 | Art. 3º, CP | E | certificado |
| decorando-penal-pdf-040 | pen-m02 | Art. 3º, CP | C | certificado |
| decorando-penal-pdf-041 | pen-m02 | Art. 3º, CP | C | certificado |
| decorando-penal-pdf-042 | pen-m02 | Art. 3º, CP | C | certificado |
| decorando-penal-pdf-043 | pen-m02 | Art. 3º, CP | C | certificado |
| decorando-penal-pdf-044 | pen-m02 | Art. 3º, CP | C | certificado |
| decorando-penal-pdf-046 | pen-m02 | Art. 3º, CP | C | certificado |
| decorando-penal-pdf-047 | pen-m02 | Art. 3º, CP | C | certificado |
| decorando-penal-pdf-048 | pen-m02 | Art. 3°, CP | C | certificado |
| decorando-penal-pdf-049 | pen-m02 | Art. 3º, CP | C | certificado |
| decorando-penal-pdf-050 | pen-m02 | Art. 3º, CP | E | certificado |
| decorando-pen-autoral-004 | pen-m02 | CP, art. 4º | E | certificado |
| decorando-pen-autoral-005 | pen-m02 | CP, art. 6º | C | certificado |
| decorando-penal-dls-20260827-0016 | pen-m02 | Art. 2º, parágrafo único, CP | E | certificado |
| decorando-penal-dls-20260827-0018 | pen-m02 | Art. 2º, § único, CP | E | certificado |
| decorando-penal-dls-20260827-0035 | pen-m02 | Art. 2º, § único, CP | C | certificado |
| decorando-penal-dls-20260827-0050 | pen-m02 | Art. 3º, CP | C | certificado |
| decorando-penal-dls-20260827-0051 | pen-m02 | Art. 3º, CP | C | certificado |
| decorando-penal-dls-20260827-0052 | pen-m02 | Art. 3º, CP | C | certificado |
| decorando-penal-dls-20260827-0053 | pen-m02 | Art. 3º, CP | E | certificado |
| decorando-penal-dls-20260827-0054 | pen-m02 | Art. 3º, CP | C | certificado |
| decorando-penal-dls-20260827-0055 | pen-m02 | Art. 4º, CP | E | certificado |
| decorando-penal-dls-20260827-0056 | pen-m02 | Art. 4º, CP | C | certificado |
| decorando-penal-dls-20260827-0057 | pen-m02 | Art. 4º, CP | C | certificado |
| decorando-penal-dls-20260827-0058 | pen-m02 | Art. 4º, CP | C | certificado |
| decorando-penal-dls-20260827-0059 | pen-m02 | Art. 4º, CP | E | certificado |
| decorando-penal-dls-20260827-0060 | pen-m02 | Art. 4º, CP | C | certificado |
| decorando-penal-dls-20260827-0061 | pen-m02 | Art. 4º, CP | C | certificado |
| decorando-penal-dls-20260827-0062 | pen-m02 | Art. 4º, CP | C | certificado |
| decorando-penal-dls-20260827-0063 | pen-m02 | Art. 4º, CP | E | certificado |
| decorando-penal-dls-20260827-0075 | pen-m02 | Art. 4º, CP | E | certificado |
| decorando-penal-dls-20260827-0065 | pen-m02 | Art. 4º, CP | C | certificado |
| decorando-penal-dls-20260827-0066 | pen-m02 | Art. 4º, CP | C | certificado |
| decorando-penal-dls-20260827-0067 | pen-m02 | Art. 4º, CP | C | certificado |
| decorando-penal-dls-20260827-0068 | pen-m02 | Art. 4º, CP | E | certificado |
| decorando-penal-dls-20260827-0069 | pen-m02 | Art. 4º, CP | E | certificado |
| decorando-penal-dls-20260827-0070 | pen-m02 | Art. 4º, CP | C | certificado |
| decorando-penal-dls-20260827-0071 | pen-m02 | Art. 4º, CP | E | certificado |
| decorando-penal-dls-20260827-0072 | pen-m02 | Art. 4º, CP | E | certificado |
| decorando-penal-dls-20260827-0073 | pen-m02 | Art. 4º, CP | C | certificado |
| decorando-penal-dls-20260827-0074 | pen-m02 | Art. 4º, CP | E | certificado |
| decorando-penal-dls-20260827-0076 | pen-m02 | Art. 4º, CP | C | certificado |
| decorando-penal-dls-20260827-0077 | pen-m02 | Arts. 4º e 6º, CP | C | certificado |
| decorando-penal-dls-20260827-0078 | pen-m02 | Arts. 4º e 6º, CP | E | certificado |
| decorando-penal-dls-20260827-0079 | pen-m02 | Art. 5º, CP | E | certificado-parcial |
| decorando-penal-dls-20260827-0080 | pen-m02 | Art. 5º, CP | C | certificado |
| decorando-penal-dls-20260827-0081 | pen-m02 | Art. 5º, § 1º, CP | C | certificado |
| decorando-penal-dls-20260827-0082 | pen-m02 | Art. 5º, § 1º, CP | C | certificado |
| decorando-penal-dls-20260827-0083 | pen-m02 | Art. 5º, § 1º, CP | C | certificado |
| decorando-penal-dls-20260827-0084 | pen-m02 | Art. 5º, § 1º, CP | C | certificado |
| decorando-penal-dls-20260827-0085 | pen-m02 | Art. 5º, § 1º CP | C | certificado |
| decorando-penal-dls-20260827-0086 | pen-m02 | Art. 5º, § 1º, CP | C | certificado |
| decorando-penal-dls-20260827-0087 | pen-m02 | Art. 5º, caput e § 1º, CP | E | certificado |
| decorando-penal-dls-20260827-0088 | pen-m02 | Art. 5º, § 1º, CP | C | certificado |
| decorando-penal-dls-20260827-0089 | pen-m02 | Art. 5º, §§ 1º e 2º, CP | E | certificado |
| decorando-penal-dls-20260827-0090 | pen-m02 | Art. 5º, § 2º, CP | C | certificado |
| decorando-penal-dls-20260827-0091 | pen-m02 | Art. 5º, § 2º, CP | C | certificado |
| decorando-penal-dls-20260827-0092 | pen-m02 | Art. 5º, § 2º, CP | C | certificado |
| decorando-penal-dls-20260827-0093 | pen-m02 | Art. 5º, § 2º, CP | C | certificado |
| decorando-penal-dls-20260827-0094 | pen-m02 | Art. 5º, § 2º, CP | C | certificado |
| decorando-penal-dls-20260827-0095 | pen-m02 | Art. 5º, § 2º, CP | E | certificado |
| decorando-penal-dls-20260827-0096 | pen-m02 | Art. 6º, CP | C | certificado |
| decorando-penal-dls-20260827-0097 | pen-m02 | Art. 6º, CP | C | certificado-parcial |
| decorando-penal-dls-20260827-0098 | pen-m02 | Art. 6º, CP | E | certificado-parcial |
| decorando-penal-dls-20260827-0099 | pen-m02 | Art. 6º, CP | E | certificado |
| decorando-penal-dls-20260827-0100 | pen-m02 | Art. 6º, CP | C | certificado |
| decorando-penal-dls-20260827-0101 | pen-m02 | Art. 6º, CP | E | certificado |
| decorando-penal-dls-20260827-0102 | pen-m02 | Art. 6º, CP | E | certificado |
| decorando-penal-dls-20260827-0103 | pen-m02 | Art. 6º, CP | C | certificado |
| decorando-penal-dls-20260827-0104 | pen-m02 | Art. 7º, CP | E | certificado |
| decorando-penal-dls-20260827-0105 | pen-m02 | Art. 7º, CP | E | certificado |
| decorando-penal-dls-20260827-0106 | pen-m02 | Art. 7º, CP | E | certificado |
| decorando-penal-dls-20260827-0107 | pen-m02 | Art. 7º, CP | C | certificado |
| decorando-penal-dls-20260827-0108 | pen-m02 | Art. 7º, I, CP | C | certificado |
| decorando-penal-dls-20260827-0109 | pen-m02 | Art. 7º, I, CP | E | certificado |
| decorando-penal-dls-20260827-0110 | pen-m02 | Art. 7º, I, CP | C | certificado |
| decorando-penal-dls-20260827-0111 | pen-m02 | Art. 7º, I, CP | E | certificado |
| decorando-penal-dls-20260827-0112 | pen-m02 | Art. 7°, I, a, CP | C | certificado |
| decorando-penal-dls-20260827-0113 | pen-m02 | Art. 7º, I, a, CP | E | certificado |
| decorando-penal-dls-20260827-0114 | pen-m02 | Art. 7º, I, a, CP | E | certificado |
| decorando-penal-dls-20260827-0115 | pen-m02 | Art. 7º, I, CP | C | certificado |
| decorando-penal-dls-20260827-0116 | pen-m02 | Art. 7º, I, CP | E | certificado |
| decorando-penal-dls-20260827-0117 | pen-m02 | Art. 7º, I, CP | E | certificado |
| decorando-penal-dls-20260827-0118 | pen-m02 | Art. 7º, I, "b", CP | C | certificado |
| decorando-penal-dls-20260827-0119 | pen-m02 | Art. 7º, I, b, CP | C | pendente |
| decorando-penal-dls-20260827-0120 | pen-m02 | Art. 7º, I, b, CP | C | certificado |
| decorando-penal-dls-20260827-0121 | pen-m02 | Art. 7º, I, b, CP | C | certificado |
| decorando-penal-dls-20260827-0122 | pen-m02 | Art. 7º, I, c, CP | E | certificado |
| decorando-penal-dls-20260827-0123 | pen-m02 | Art. 7º, I, c, CP | C | certificado |
| decorando-penal-dls-20260827-0124 | pen-m02 | Art. 7º, I, “d”, CP | C | certificado |
| decorando-penal-dls-20260827-0125 | pen-m02 | Art. 7º, I, d, § 1º, CP | C | certificado |
| decorando-penal-dls-20260827-0126 | pen-m02 | Art. 7º, I e § 1º, CP | E | certificado |
| decorando-penal-dls-20260827-0127 | pen-m02 | Art. 7º, I e § 1º, CP | E | certificado |
| decorando-penal-dls-20260827-0128 | pen-m02 | Art. 7º, I e § 1º, CP | C | certificado |
| decorando-penal-dls-20260827-0129 | pen-m02 | Art. 7º, I e § 1º, CP | E | certificado |
| decorando-penal-dls-20260827-0130 | pen-m02 | Art. 7º, I e § 1º, CP | E | certificado |
| decorando-penal-dls-20260827-0131 | pen-m02 | Art. 7º, I e § 1º, CP | C | certificado |
| decorando-penal-dls-20260827-0132 | pen-m02 | Art. 7º, I, b e § 1º, CP | E | certificado |
| decorando-penal-dls-20260827-0133 | pen-m02 | Art. 7º, I, d, § 1º, CP | C | certificado |
| decorando-penal-dls-20260827-0134 | pen-m02 | Art. 7º, § 1º, CP | E | certificado |
| decorando-penal-dls-20260827-0135 | pen-m02 | Art. 7º, II, CP | C | certificado |
| decorando-penal-dls-20260827-0136 | pen-m02 | Art. 7º, II, CP | C | certificado |
| decorando-penal-dls-20260827-0137 | pen-m02 | Art. 7º, II, “a”, CP | C | certificado-parcial |
| decorando-penal-dls-20260827-0138 | pen-m02 | Art. 7º, II, a, § 2º, b, c, CP | C | certificado-parcial |
| decorando-penal-dls-20260827-0139 | pen-m02 | Art. 7º, II, b, CP | C | certificado |
| decorando-penal-dls-20260827-0140 | pen-m02 | Art. 7º, II, “c”, CP | C | certificado |
| decorando-penal-dls-20260827-0141 | pen-m02 | Art. 7º, II e § 2º, CP | E | certificado |
| decorando-penal-dls-20260827-0142 | pen-m02 | Art. 7º, II e § 2º, CP | C | certificado |
| decorando-penal-dls-20260827-0143 | pen-m02 | Art. 7º, II e § 2º, CP | E | certificado |
| decorando-penal-dls-20260827-0144 | pen-m02 | Art. 7º, § 2º, CP | C | certificado |
| decorando-penal-dls-20260827-0145 | pen-m02 | Art. 7º, II e § 2º, CP | C | certificado |
| decorando-penal-dls-20260827-0146 | pen-m02 | Art. 7º, § 2º, b, CP | C | certificado |
| decorando-penal-dls-20260827-0147 | pen-m02 | Art. 6º e 7º, § 3º, CP | E | certificado |
| decorando-penal-dls-20260827-0148 | pen-m02 | Art. 7º, § 3º, b, CP | E | certificado |
| decorando-penal-dls-20260827-0149 | pen-m02 | Art. 8º, CP | C | certificado |
| decorando-penal-dls-20260827-0150 | pen-m02 | Art. 8º, CP | E | certificado |
| decorando-penal-dls-20260827-0151 | pen-m02 | Art. 8º, CP | E | certificado |
| decorando-penal-dls-20260827-0152 | pen-m02 | Art. 8º, CP | E | certificado |
| decorando-penal-dls-20260827-0153 | pen-m02 | Art. 8º, CP | E | certificado |
| decorando-penal-dls-20260827-0154 | pen-m02 | Art. 9º, CP | E | certificado |
| decorando-penal-dls-20260827-0155 | pen-m02 | Art. 9º, CP | E | certificado |
| decorando-penal-dls-20260827-0156 | pen-m02 | Art. 10, CP | E | certificado |
| decorando-penal-dls-20260827-0157 | pen-m02 | Art. 10, CP | E | certificado |
| decorando-penal-dls-20260827-0158 | pen-m02 | Art. 10, CP | C | certificado |
| decorando-penal-dls-20260827-0159 | pen-m02 | Art. 10, CP | E | certificado |
| decorando-penal-dls-20260827-0160 | pen-m02 | Art. 10, CP | C | certificado |
| decorando-penal-dls-20260827-0161 | pen-m02 | Art. 10, CP | C | certificado |
| decorando-penal-dls-20260827-0162 | pen-m02 | Art. 10, CP | E | certificado |
| decorando-penal-dls-20260827-0163 | pen-m02 | Art. 10, CP | E | certificado |
| decorando-penal-dls-20260827-0164 | pen-m02 | Art. 10, CP | E | certificado |
| decorando-penal-dls-20260827-0165 | pen-m02 | Art. 10, CP | C | certificado |
| decorando-penal-dls-20260827-0166 | pen-m02 | Art. 10 e 11, CP | E | certificado |
| decorando-penal-dls-20260827-0167 | pen-m02 | Art. 11, CP | E | certificado |
| decorando-penal-dls-20260827-0168 | pen-m02 | Art. 11, CP | E | certificado |
| decorando-penal-dls-20260827-0169 | pen-m02 | Art. 11, CP | E | certificado |
| decorando-penal-dls-20260827-0170 | pen-m02 | Art. 12, CP | E | certificado |
| decorando-penal-dls-20260827-0171 | pen-m02 | Art. 12, CP | C | certificado |
| decorando-pen-autoral-037 | pen-m03 | CP, art. 23 | C | certificado |
| decorando-penal-dls-20260827-0359 | pen-m03 | Art. 23, CP | C | certificado |
| decorando-penal-dls-20260827-0360 | pen-m03 | Art. 23, CP | C | certificado |
| decorando-penal-dls-20260827-0361 | pen-m03 | Art. 23, CP | C | certificado |
| decorando-penal-dls-20260827-0362 | pen-m03 | Art. 23, CP | C | certificado |
| decorando-penal-dls-20260827-0363 | pen-m03 | Art. 23, CP | E | certificado |
| decorando-penal-dls-20260827-0364 | pen-m03 | Art. 23, CP | E | certificado |
| decorando-penal-dls-20260827-0365 | pen-m03 | Art. 23, CP | C | certificado-parcial |
| decorando-penal-dls-20260827-0366 | pen-m03 | Art. 23, CP | E | certificado |
| decorando-penal-dls-20260827-0367 | pen-m03 | Arts. 23, CP | C | certificado |
| decorando-penal-dls-20260827-0368 | pen-m03 | Art. 23, CP | E | certificado |
| decorando-penal-dls-20260827-0369 | pen-m03 | Art. 23, I, CP | C | certificado |
| decorando-penal-dls-20260827-0370 | pen-m03 | Art. 23, II, CP | C | certificado |
| decorando-penal-dls-20260827-0371 | pen-m03 | Arts. 23, II e 25, CP | C | certificado |
| decorando-penal-dls-20260827-0372 | pen-m03 | Art. 23, III, CP | C | certificado |
| decorando-penal-dls-20260827-0373 | pen-m03 | Art. 23, III, CP | C | certificado |
| decorando-penal-dls-20260827-0374 | pen-m03 | Art. 23, § único, CP | E | certificado |
| decorando-penal-dls-20260827-0375 | pen-m03 | Art. 23, § único, CP | E | certificado |
| decorando-penal-dls-20260827-0376 | pen-m03 | Art. 23, § único, CP | C | certificado |
| decorando-penal-dls-20260827-0377 | pen-m03 | Art. 23, § único, CP | E | certificado |
| decorando-penal-dls-20260827-0378 | pen-m03 | Art. 23, § único, CP | E | certificado |
| decorando-penal-dls-20260827-0379 | pen-m03 | Art. 23, § único, CP | C | certificado |
| decorando-penal-dls-20260827-0380 | pen-m03 | Art. 23, § único, CP | E | pendente |
| decorando-penal-dls-20260827-0381 | pen-m03 | Arts. 23, III e 28, § 1º, CP | C | certificado-parcial |
| decorando-penal-dls-20260827-0382 | pen-m03 | Art. 24, CP | E | certificado |
| decorando-penal-dls-20260827-0383 | pen-m03 | Art. 24, CP | E | certificado |
| decorando-penal-dls-20260827-0384 | pen-m03 | Art. 24, CP | C | certificado |
| decorando-penal-dls-20260827-0385 | pen-m03 | Art. 24, CP | C | certificado |
| decorando-penal-dls-20260827-0386 | pen-m03 | Art. 24, CP | E | certificado |
| decorando-penal-dls-20260827-0387 | pen-m03 | Art. 24, CP | E | certificado |
| decorando-penal-dls-20260827-0388 | pen-m03 | Art. 24, CP | E | certificado |
| decorando-penal-dls-20260827-0389 | pen-m03 | Art. 24, CP | E | certificado |
| decorando-penal-dls-20260827-0390 | pen-m03 | Art. 24, CP | C | certificado |
| decorando-penal-dls-20260827-0392 | pen-m03 | Art. 24, CP | E | certificado |
| decorando-penal-dls-20260827-0393 | pen-m03 | Art. 24, CP | E | certificado-parcial |
| decorando-penal-dls-20260827-0394 | pen-m03 | Art. 24, CP | E | certificado |
| decorando-penal-dls-20260827-0395 | pen-m03 | Art. 24, § 1º, CP | C | certificado |
| decorando-penal-dls-20260827-0396 | pen-m03 | Art. 24, § 1º, CP | C | certificado |
| decorando-penal-dls-20260827-0397 | pen-m03 | Art. 24, § 1º, CP | E | certificado |
| decorando-penal-dls-20260827-0398 | pen-m03 | Art. 24, § 1º, CP | C | certificado |
| decorando-penal-dls-20260827-0399 | pen-m03 | Art. 24, § 1º, CP | E | certificado |
| decorando-penal-dls-20260827-0400 | pen-m03 | Art. 24, § 2º, CP | C | certificado |
| decorando-penal-dls-20260827-0401 | pen-m03 | Art. 24, § 2º, CP | E | certificado |
| decorando-penal-dls-20260827-0402 | pen-m03 | Art. 24, § 2º, CP | E | certificado |
| decorando-penal-dls-20260827-0403 | pen-m03 | Art. 24, § 2º, CP | C | certificado |
| decorando-penal-dls-20260827-0404 | pen-m03 | Art. 24, § 2º, CP | E | certificado |
| decorando-penal-dls-20260827-0405 | pen-m03 | Art. 24, § 2º, CP | E | certificado |
| decorando-penal-dls-20260827-0406 | pen-m03 | Arts. 24 e 25, CP | E | certificado |
| decorando-penal-dls-20260827-0407 | pen-m03 | Art. 25, CP | C | certificado |
| decorando-penal-dls-20260827-0408 | pen-m03 | Art. 25, CP | E | certificado |
| decorando-penal-dls-20260827-0409 | pen-m03 | Art. 25, CP | C | certificado |
| decorando-penal-dls-20260827-0410 | pen-m03 | Art. 25, CP | C | certificado |
| decorando-penal-dls-20260827-0411 | pen-m03 | Art. 25, CP | C | certificado |
| decorando-penal-dls-20260827-0412 | pen-m03 | Art. 25, CP | C | certificado-parcial |
| decorando-penal-dls-20260827-0413 | pen-m03 | Art. 25 CP | E | certificado |
| decorando-penal-dls-20260827-0414 | pen-m03 | Art. 25, CP | C | certificado |
| decorando-penal-dls-20260827-0415 | pen-m03 | Art. 25, § único, CP | E | certificado |
| decorando-penal-dls-20260827-0416 | pen-m03 | Art. 25, § único, CP | C | certificado-parcial |
| decorando-penal-dls-20260827-0417 | pen-m03 | Art. 25, § único, CP | E | certificado |
| decorando-penal-dls-20260827-0418 | pen-m03 | Art. 25, § único, CP | C | certificado |
| decorando-penal-dls-20260827-0419 | pen-m03 | Art. 25, § único, CP | E | certificado |
| decorando-penal-dls-20260827-0437 | pen-m03 | Arts. 23, 27 e 28, § 1º, CP | E | certificado |
| decorando-pen-autoral-038 | pen-m04 | CP, art. 21 | E | certificado |
| decorando-penal-dls-20260827-0196 | pen-m04 | Art. 20, § 3º, CP | E | certificado |
| decorando-penal-dls-20260827-0305 | pen-m04 | Art. 20, CP | E | certificado |
| decorando-penal-dls-20260827-0306 | pen-m04 | Art. 20, CP | C | certificado-parcial |
| decorando-penal-dls-20260827-0312 | pen-m04 | Art. 20, CP | C | certificado |
| decorando-penal-dls-20260827-0308 | pen-m04 | Art. 20, CP | C | certificado |
| decorando-penal-dls-20260827-0309 | pen-m04 | Art. 20, CP | C | certificado |
| decorando-penal-dls-20260827-0310 | pen-m04 | Art. 20, CP | C | certificado-parcial |
| decorando-penal-dls-20260827-0311 | pen-m04 | Art. 20, CP | E | certificado |
| decorando-penal-dls-20260827-0313 | pen-m04 | Art. 20, CP | E | certificado |
| decorando-penal-dls-20260827-0314 | pen-m04 | Art. 20, CP | C | certificado |
| decorando-penal-dls-20260827-0315 | pen-m04 | Art. 20, CP | E | certificado |
| decorando-penal-dls-20260827-0316 | pen-m04 | Art. 20, CP | C | certificado |
| decorando-penal-dls-20260827-0317 | pen-m04 | Art. 20, § 1º, CP | C | certificado |
| decorando-penal-dls-20260827-0318 | pen-m04 | Art. 20, § 1º, CP | C | certificado |
| decorando-penal-dls-20260827-0319 | pen-m04 | Art. 20, § 1º, CP | C | certificado-parcial |
| decorando-penal-dls-20260827-0320 | pen-m04 | Art. 20, § 1º, CP c/c Art. 386, VI, CPP | C | certificado-parcial |
| decorando-penal-dls-20260827-0321 | pen-m04 | Art. 20, § 1°, CP | C | certificado-parcial |
| decorando-penal-dls-20260827-0322 | pen-m04 | Art. 20, § 2º, CP | C | certificado |
| decorando-penal-dls-20260827-0323 | pen-m04 | Art. 20, § 2º, CP | C | certificado |
| decorando-penal-dls-20260827-0324 | pen-m04 | Art. 20, § 2º, CP | E | certificado |
| decorando-penal-dls-20260827-0325 | pen-m04 | Art. 20, § 3º, CP | C | certificado |
| decorando-penal-dls-20260827-0326 | pen-m04 | Art. 20, § 3º, CP | C | certificado |
| decorando-penal-dls-20260827-0327 | pen-m04 | Art. 20, § 3º, CP | C | certificado |
| decorando-penal-dls-20260827-0328 | pen-m04 | Art. 20, § 3º, CP | E | certificado |
| decorando-penal-dls-20260827-0329 | pen-m04 | Art. 20, § 3º, CP | E | certificado |
| decorando-penal-dls-20260827-0330 | pen-m04 | Art. 20, § 3º, CP | E | certificado |
| decorando-penal-dls-20260827-0331 | pen-m04 | Art. 20, § 3º, CP | E | certificado |
| decorando-penal-dls-20260827-0332 | pen-m04 | Art. 20, § 3º, CP | E | certificado |
| decorando-penal-dls-20260827-0333 | pen-m04 | Art. 20, § 3º, CP | E | certificado |
| decorando-penal-dls-20260827-0334 | pen-m04 | Art. 20 e 21, CP | E | certificado |
| decorando-penal-dls-20260827-0335 | pen-m04 | Art. 21, CP | C | certificado |
| decorando-penal-dls-20260827-0336 | pen-m04 | Art. 21, CP | E | certificado |
| decorando-penal-dls-20260827-0337 | pen-m04 | Art. 21, CP | C | certificado |
| decorando-penal-dls-20260827-0338 | pen-m04 | Art. 21, CP | C | certificado |
| decorando-penal-dls-20260827-0339 | pen-m04 | Art. 21, CP | E | certificado |
| decorando-penal-dls-20260827-0340 | pen-m04 | Art. 21, CP | C | certificado |
| decorando-penal-dls-20260827-0341 | pen-m04 | Art. 21, CP | C | certificado |
| decorando-penal-dls-20260827-0342 | pen-m04 | Art. 21, CP | E | certificado |
| decorando-penal-dls-20260827-0343 | pen-m04 | Art. 21 e 23, CP | E | certificado |
| decorando-penal-dls-20260827-0344 | pen-m04 | Art. 21, CP | C | certificado |
| decorando-penal-dls-20260827-0345 | pen-m04 | Art. 21, CP | E | certificado |
| decorando-penal-dls-20260827-0346 | pen-m04 | Art. 21, CP | C | certificado-parcial |
| decorando-penal-dls-20260827-0347 | pen-m04 | Art. 21, CP | C | certificado |
| decorando-penal-dls-20260827-0348 | pen-m04 | Art. 22, CP | C | certificado |
| decorando-penal-dls-20260827-0349 | pen-m04 | Art. 22, CP | C | certificado-parcial |
| decorando-penal-dls-20260827-0350 | pen-m04 | Art. 22, CP | E | certificado |
| decorando-penal-dls-20260827-0351 | pen-m04 | Art. 22, CP | C | certificado |
| decorando-penal-dls-20260827-0353 | pen-m04 | Art. 22, CP | C | certificado-parcial |
| decorando-penal-dls-20260827-0354 | pen-m04 | Art. 22, CP | E | certificado-parcial |
| decorando-penal-dls-20260827-0355 | pen-m04 | Art. 22, CP | E | certificado |
| decorando-penal-dls-20260827-0356 | pen-m04 | Art. 22, CP | C | certificado |
| decorando-penal-dls-20260827-0357 | pen-m04 | Art. 22, CP | E | certificado |
| decorando-penal-dls-20260827-0358 | pen-m04 | Art. 22 e 23, CP | E | certificado |
| decorando-penal-dls-20260827-0420 | pen-m04 | Art. 26, CP | E | certificado |
| decorando-penal-dls-20260827-0421 | pen-m04 | Art. 26, CP | C | certificado-parcial |
| decorando-penal-dls-20260827-0422 | pen-m04 | Art. 26, § único, CP | E | certificado |
| decorando-penal-dls-20260827-0423 | pen-m04 | Art. 26, § único, CP | C | certificado-parcial |
| decorando-penal-dls-20260827-0424 | pen-m04 | Art. 26, § único, CP | E | certificado |
| decorando-penal-dls-20260827-0425 | pen-m04 | Art. 26, CP | C | certificado |
| decorando-penal-dls-20260827-0426 | pen-m04 | Art. 26, CP | C | certificado |
| decorando-penal-dls-20260827-0427 | pen-m04 | Art. 26, § único, CP | C | certificado-parcial |
| decorando-penal-dls-20260827-0428 | pen-m04 | Art. 26, § único, CP | E | certificado |
| decorando-penal-dls-20260827-0429 | pen-m04 | Art. 26, § único, CP | C | certificado |
| decorando-penal-dls-20260827-0430 | pen-m04 | Art. 26, § único, CP | C | certificado-parcial |
| decorando-penal-dls-20260827-0431 | pen-m04 | Art. 26, § único, CP | C | certificado |
| decorando-penal-dls-20260827-0432 | pen-m04 | Art. 27, CP | C | certificado |
| decorando-penal-dls-20260827-0433 | pen-m04 | Art. 27, CP | C | certificado |
| decorando-penal-dls-20260827-0434 | pen-m04 | Art. 27, CP | E | certificado-parcial |
| decorando-penal-dls-20260827-0435 | pen-m04 | Art. 27, CP | C | certificado |
| decorando-penal-dls-20260827-0436 | pen-m04 | Art. 27, CP | C | certificado |
| decorando-penal-dls-20260827-0438 | pen-m04 | Arts. 26, 27 e 28, § 1º, CP | C | certificado-parcial |
| decorando-penal-dls-20260827-0439 | pen-m04 | Art. 28, CP | E | certificado |
| decorando-penal-dls-20260827-0440 | pen-m04 | Art. 28, § 1º, CP | E | certificado |
| decorando-penal-dls-20260827-0441 | pen-m04 | Art. 28, CP | E | certificado |
| decorando-penal-dls-20260827-0442 | pen-m04 | Art. 28, I, CP | C | certificado |
| decorando-penal-dls-20260827-0443 | pen-m04 | Art. 28, I, CP | C | certificado |
| decorando-penal-dls-20260827-0444 | pen-m04 | Art. 28, I, CP | E | certificado |
| decorando-penal-dls-20260827-0445 | pen-m04 | Art. 28, I, CP | E | certificado |
| decorando-penal-dls-20260827-0446 | pen-m04 | Art. 28, I, CP | C | certificado |
| decorando-penal-dls-20260827-0447 | pen-m04 | Art. 28, II, CP | C | certificado |
| decorando-penal-dls-20260827-0448 | pen-m04 | Art. 28, II, CP | C | certificado |
| decorando-penal-dls-20260827-0450 | pen-m04 | Art. 28, II, CP | E | certificado |
| decorando-penal-dls-20260827-0451 | pen-m04 | Art. 28, II, CP | C | certificado |
| decorando-penal-dls-20260827-0452 | pen-m04 | Art. 28, II, CP | C | certificado |
| decorando-penal-dls-20260827-0453 | pen-m04 | Art. 28, II, CP | C | certificado |
| decorando-penal-dls-20260827-0454 | pen-m04 | Art. 28, II, CP | E | certificado |
| decorando-penal-dls-20260827-0455 | pen-m04 | Art. 28, II, CP | E | certificado |
| decorando-penal-dls-20260827-0456 | pen-m04 | Art. 28, §§ 1º e 2º, CP | E | certificado |
| decorando-penal-dls-20260827-0457 | pen-m04 | Art. 28, § 1º, CP | C | certificado |
| decorando-penal-dls-20260827-0458 | pen-m04 | Art. 28, § 1º, CP | E | certificado |
| decorando-penal-dls-20260827-0459 | pen-m04 | Art. 28, § 1º, CP | C | certificado |
| decorando-penal-dls-20260827-0460 | pen-m04 | Art. 28, § 1º, CP | E | certificado |
| decorando-penal-dls-20260827-0461 | pen-m04 | Art. 28, § 1º, CP | C | certificado |
| decorando-penal-dls-20260827-0462 | pen-m04 | Art. 28, § 1º, CP | C | certificado |
| decorando-penal-dls-20260827-0463 | pen-m04 | Art. 28, § 2º, CP | C | certificado |
| decorando-penal-dls-20260827-0464 | pen-m04 | Art. 28, § 2º, CP | E | certificado |
| decorando-penal-dls-20260827-0466 | pen-m04 | Art. 28, § 2º, CP | E | certificado |
| decorando-penal-dls-20260827-0467 | pen-m04 | Art. 28, § 2º c/c Art. 61, II, "l" c/c Art. 155, § 4º, IV, CP | C | certificado |
| decorando-penal-dls-20260827-1141 | pen-m04 | Arts. 20, § 2º e 155, CP | C | certificado |
| decorando-pen-autoral-039 | pen-m05 | CP, art. 30 | C | certificado |
| decorando-penal-dls-20260827-0468 | pen-m05 | Art. 29, § 1º, CP | E | certificado |
| decorando-penal-dls-20260827-0469 | pen-m05 | Art. 29, CP | C | certificado-parcial |
| decorando-penal-dls-20260827-0470 | pen-m05 | Art. 29, CP | C | certificado |
| decorando-penal-dls-20260827-0471 | pen-m05 | Art. 29, CP | E | certificado-parcial |
| decorando-penal-dls-20260827-0472 | pen-m05 | Art. 29, CP | C | certificado |
| decorando-penal-dls-20260827-0473 | pen-m05 | Art. 29, CP | E | certificado-parcial |
| decorando-penal-dls-20260827-0474 | pen-m05 | Art. 29, CP | E | certificado |
| decorando-penal-dls-20260827-0475 | pen-m05 | Art. 29, CP | E | certificado-parcial |
| decorando-penal-dls-20260827-0476 | pen-m05 | Art. 29, CP | E | certificado-parcial |
| decorando-penal-dls-20260827-0477 | pen-m05 | Art. 29, CP | C | certificado |
| decorando-penal-dls-20260827-0478 | pen-m05 | Art. 29, § 1º, CP | C | certificado |
| decorando-penal-dls-20260827-0479 | pen-m05 | Art. 29, § 1º, CP | E | certificado |
| decorando-penal-dls-20260827-0480 | pen-m05 | Art. 29, § 1º, CP | C | certificado |
| decorando-penal-dls-20260827-0481 | pen-m05 | Art. 29, § 1º, CP | E | certificado |
| decorando-penal-dls-20260827-0482 | pen-m05 | Art. 29, § 1º, § 2º, CP | C | certificado |
| decorando-penal-dls-20260827-0483 | pen-m05 | Art. 29, § 2º, CP | E | certificado |
| decorando-penal-dls-20260827-0484 | pen-m05 | (Art. 29, § 2º, CP) | C | certificado |
| decorando-penal-dls-20260827-0485 | pen-m05 | Art. 29, § 2º, CP | E | certificado |
| decorando-penal-dls-20260827-0486 | pen-m05 | Art. 29, § 2º, CP | C | certificado |
| decorando-penal-dls-20260827-0487 | pen-m05 | Art. 29, § 2º, CP | C | certificado |
| decorando-penal-dls-20260827-0488 | pen-m05 | Art. 29, § 2º, CP | C | certificado |
| decorando-penal-dls-20260827-0489 | pen-m05 | Art. 29, § 2º, CP | E | certificado |
| decorando-penal-dls-20260827-0490 | pen-m05 | Art. 29, § 2º, CP | C | certificado |
| decorando-penal-dls-20260827-0491 | pen-m05 | Art. 29, § 2º, CP | E | certificado |
| decorando-penal-dls-20260827-0492 | pen-m05 | Art. 29, § 2º, CP | C | certificado |
| decorando-penal-dls-20260827-0493 | pen-m05 | Art. 29, § 2º, CP | E | certificado |
| decorando-penal-dls-20260827-0494 | pen-m05 | Art. 29, § 2°, CP | C | certificado |
| decorando-penal-dls-20260827-0495 | pen-m05 | Art. 29, § 2º, CP | E | certificado |
| decorando-penal-dls-20260827-0496 | pen-m05 | Art. 29 caput e § 2º, CP | E | certificado |
| decorando-penal-dls-20260827-0513 | pen-m05 | Art. 30, CP | E | certificado |
| decorando-penal-dls-20260827-0498 | pen-m05 | Art. 30, CP | E | certificado |
| decorando-penal-dls-20260827-0499 | pen-m05 | Art. 30, CP | E | certificado |
| decorando-penal-dls-20260827-0500 | pen-m05 | Art. 30, CP | E | certificado |
| decorando-penal-dls-20260827-0501 | pen-m05 | Art. 30, CP | C | certificado-parcial |
| decorando-penal-dls-20260827-0502 | pen-m05 | Art. 30, CP | E | certificado |
| decorando-penal-dls-20260827-0503 | pen-m05 | Art. 30, CP | C | certificado-parcial |
| decorando-penal-dls-20260827-0505 | pen-m05 | Art. 30, CP | E | certificado |
| decorando-penal-dls-20260827-0507 | pen-m05 | Art. 30, CP | C | certificado |
| decorando-penal-dls-20260827-0508 | pen-m05 | Art. 30 c/c 312, CP | C | certificado |
| decorando-penal-dls-20260827-0509 | pen-m05 | Art. 30 c/c Art. 312, CP | C | certificado |
| decorando-penal-dls-20260827-0510 | pen-m05 | Art. 30, CP | E | certificado |
| decorando-penal-dls-20260827-0511 | pen-m05 | Art. 30, CP | C | certificado |
| decorando-penal-dls-20260827-0512 | pen-m05 | Art. 30, CP | C | certificado |
| decorando-penal-dls-20260827-0514 | pen-m05 | Art. 31, CP | C | certificado |
| decorando-penal-dls-20260827-0515 | pen-m05 | Art. 31, CP | E | certificado |
| decorando-penal-dls-20260827-0516 | pen-m05 | Art. 31, CP | E | certificado |
| decorando-penal-dls-20260827-0517 | pen-m05 | Art. 30 c/c Art. 61, II, f, CP | E | certificado-parcial |
| decorando-penal-dls-20260827-1364 | pen-m05 | Arts. 29 e 226, I , CP | C | certificado |
| decorando-pen-autoral-040 | pen-m06 | CP, art. 32 | E | certificado |
| decorando-penal-dls-20260827-0518 | pen-m06 | Art. 32, CP | E | certificado |
| decorando-penal-dls-20260827-0519 | pen-m06 | Art. 32, I, II, III, CP | C | certificado |
| decorando-penal-dls-20260827-0520 | pen-m06 | Art. 32, III, CP | C | certificado |
| decorando-penal-dls-20260827-0521 | pen-m06 | Art. 33, CP | E | certificado |
| decorando-penal-dls-20260827-0522 | pen-m06 | Art. 33, CP | E | certificado |
| decorando-penal-dls-20260827-0523 | pen-m06 | Art. 33, CP | C | certificado |
| decorando-penal-dls-20260827-0524 | pen-m06 | Art. 33, CP | E | certificado |
| decorando-penal-dls-20260827-0525 | pen-m06 | Art. 33, CP | E | certificado |
| decorando-penal-dls-20260827-0526 | pen-m06 | Art. 33, CP | E | certificado |
| decorando-penal-dls-20260827-0527 | pen-m06 | Art. 33, § 1º, CP | E | certificado |
| decorando-penal-dls-20260827-0528 | pen-m06 | Art. 33, § 1º, c, CP | E | certificado |
| decorando-penal-dls-20260827-0529 | pen-m06 | Art. 33, § 1º, “b”, CP | E | certificado |
| decorando-penal-dls-20260827-0530 | pen-m06 | Art. 33, § 1º, c, CP | E | certificado |
| decorando-penal-dls-20260827-0531 | pen-m06 | Art. 33, § 2º, CP | E | certificado |
| decorando-penal-dls-20260827-0532 | pen-m06 | Art. 33, § 2º, CP | E | certificado |
| decorando-penal-dls-20260827-0533 | pen-m06 | Art. 33, § 2º, CP e S. 269, STJ | C | certificado-parcial |
| decorando-penal-dls-20260827-0534 | pen-m06 | Art. 33, caput e § 2º, a, CP | C | certificado-parcial |
| decorando-penal-dls-20260827-0535 | pen-m06 | Art. 33, § 2º, a, CP | E | certificado |
| decorando-penal-dls-20260827-0536 | pen-m06 | Art. 33, § 2º, a, CP | E | certificado |
| decorando-penal-dls-20260827-0537 | pen-m06 | Art. 33, § 2º, “b”, CP | C | certificado-parcial |
| decorando-penal-dls-20260827-0538 | pen-m06 | Art. 33, § 2º, b, CP | C | certificado |
| decorando-penal-dls-20260827-0539 | pen-m06 | Art. 33, § 2º, c, CP | C | certificado |
| decorando-penal-dls-20260827-0540 | pen-m06 | Art. 33, § 4º, CP | C | certificado |
| decorando-penal-dls-20260827-0541 | pen-m06 | Art. 33, § 4º, CP | C | certificado |
| decorando-penal-dls-20260827-0542 | pen-m06 | Art. 33, § 4º, CP | C | certificado |
| decorando-penal-dls-20260827-0543 | pen-m06 | Art. 33, § 4º, CP | C | certificado |
| decorando-penal-dls-20260827-0544 | pen-m06 | Art. 33, § 4º, CP | C | certificado |
| decorando-penal-dls-20260827-0545 | pen-m06 | Art. 33, § 4º, CP | C | certificado |
| decorando-penal-dls-20260827-0546 | pen-m06 | Art. 33, §4º, CP | C | certificado |
| decorando-penal-dls-20260827-0547 | pen-m06 | Art. 34, § 1°, CP | C | certificado |
| decorando-penal-dls-20260827-0548 | pen-m06 | Art. 34, § 1º, CP | C | certificado |
| decorando-penal-dls-20260827-0549 | pen-m06 | Art. 34, § 2º, CP | C | certificado |
| decorando-penal-dls-20260827-0550 | pen-m06 | Art. 34, § 3º, CP | E | certificado |
| decorando-penal-dls-20260827-0551 | pen-m06 | Art. 34, § 3º, CP | E | certificado |
| decorando-penal-dls-20260827-0552 | pen-m06 | Art. 39, CP | E | certificado |
| decorando-penal-dls-20260827-0553 | pen-m06 | Art. 39, CP | C | certificado |
| decorando-penal-dls-20260827-0554 | pen-m06 | Art. 41, CP c/c Art. 183, LEP | C | certificado-parcial |
| decorando-penal-dls-20260827-0555 | pen-m06 | Art. 42, CP | E | certificado |
| decorando-penal-dls-20260827-0556 | pen-m06 | Art. 43, CP | E | certificado |
| decorando-penal-dls-20260827-0557 | pen-m06 | Art. 43, CP | C | certificado |
| decorando-penal-dls-20260827-0558 | pen-m06 | Art. 43, CP | E | certificado |
| decorando-penal-dls-20260827-0559 | pen-m06 | Art. 43, CP | C | certificado |
| decorando-penal-dls-20260827-0560 | pen-m06 | Art. 43, VI c/c Art. 48, CP | C | certificado |
| decorando-penal-dls-20260827-0561 | pen-m06 | Art. 44, CP | C | certificado |
| decorando-penal-dls-20260827-0562 | pen-m06 | Art. 44, CP | E | certificado |
| decorando-penal-dls-20260827-0563 | pen-m06 | (Art. 44, CP) | C | certificado |
| decorando-penal-dls-20260827-0564 | pen-m06 | Art. 44, I, CP | C | certificado |
| decorando-penal-dls-20260827-0565 | pen-m06 | Art. 44, I, CP | E | certificado |
| decorando-penal-dls-20260827-0566 | pen-m06 | Art. 44, I, CP | E | certificado |
| decorando-penal-dls-20260827-0567 | pen-m06 | Art. 44, I, CP | C | certificado |
| decorando-penal-dls-20260827-0568 | pen-m06 | Art. 44, I c/c 157, CP | C | certificado |
| decorando-penal-dls-20260827-0569 | pen-m06 | Art. 44, I a III, CP | C | certificado |
| decorando-penal-dls-20260827-0571 | pen-m06 | Art. 44, § 2°, CP | E | certificado |
| decorando-penal-dls-20260827-0572 | pen-m06 | Art. 44, § 2°, CP | E | certificado |
| decorando-penal-dls-20260827-0573 | pen-m06 | Art. 44, § 2º, CP | C | certificado |
| decorando-penal-dls-20260827-0574 | pen-m06 | Art. 44, § 2º, CP | C | certificado |
| decorando-penal-dls-20260827-0575 | pen-m06 | Art. 44, § 2º c/c Art. 92, I, a, CP | C | certificado |
| decorando-penal-dls-20260827-0576 | pen-m06 | Art. 44, § 3º, CP | C | certificado |
| decorando-penal-dls-20260827-0577 | pen-m06 | Art. 44, § 3º, CP | E | certificado |
| decorando-penal-dls-20260827-0578 | pen-m06 | Art. 44, § 3º, CP | E | certificado-parcial |
| decorando-penal-dls-20260827-0579 | pen-m06 | Art. 44, § 3º, CP | C | certificado |
| decorando-penal-dls-20260827-0580 | pen-m06 | Art. 44, § 3°, CP | C | certificado |
| decorando-penal-dls-20260827-0581 | pen-m06 | Art. 44, § 3º, CP | C | certificado |
| decorando-penal-dls-20260827-0582 | pen-m06 | Art. 44, § 4º, CP | C | certificado |
| decorando-penal-dls-20260827-0583 | pen-m06 | Art. 44, § 4º, CP | C | certificado |
| decorando-penal-dls-20260827-0584 | pen-m06 | Art. 44, § 4º, CP | C | certificado-parcial |
| decorando-penal-dls-20260827-0585 | pen-m06 | (Art. 44 § 4º, CP) | C | certificado |
| decorando-penal-dls-20260827-0586 | pen-m06 | Arts. 44, § 4°, e 51, CP | E | certificado |
| decorando-penal-dls-20260827-0587 | pen-m06 | Arts. 44 e 49, § 1°, CP | E | certificado |
| decorando-penal-dls-20260827-0588 | pen-m06 | Art. 45, CP | E | certificado |
| decorando-penal-dls-20260827-0589 | pen-m06 | Art. 45, § 1º, § 2º, CP | C | certificado |
| decorando-penal-dls-20260827-0590 | pen-m06 | Art. 45, § 1º e § 2º, CP | C | certificado |
| decorando-penal-dls-20260827-0591 | pen-m06 | Art. 45, § 3º, CP | C | certificado-parcial |
| decorando-penal-dls-20260827-0592 | pen-m06 | (Art. 45, § 3º, CP) CS-UFG 2012 - Escrevente Judiciário (TJ-GO) | E | certificado |
| decorando-penal-dls-20260827-0593 | pen-m06 | Art. 45, § 3º, CP | E | certificado |
| decorando-penal-dls-20260827-0594 | pen-m06 | Art. 46, CP | C | certificado |
| decorando-penal-dls-20260827-0595 | pen-m06 | Art. 46, CP | C | certificado |
| decorando-penal-dls-20260827-0596 | pen-m06 | Art. 46, CP | E | certificado |
| decorando-penal-dls-20260827-0597 | pen-m06 | Art. 46, CP | E | certificado |
| decorando-penal-dls-20260827-0598 | pen-m06 | Art. 46, CP | E | certificado |
| decorando-penal-dls-20260827-0599 | pen-m06 | Art. 46, CP | E | certificado |
| decorando-penal-dls-20260827-0600 | pen-m06 | Art. 46, § 2º, CP | E | certificado |
| decorando-penal-dls-20260827-0601 | pen-m06 | Art. 46, § 4°, CP | E | certificado |
| decorando-penal-dls-20260827-0602 | pen-m06 | (Art. 47, CP) | C | certificado |
| decorando-penal-dls-20260827-0603 | pen-m06 | Art. 47, CP | C | certificado-parcial |
| decorando-penal-dls-20260827-0604 | pen-m06 | Art. 47, I, III e V, CP | C | certificado |
| decorando-penal-dls-20260827-0605 | pen-m06 | Art. 48, CP | C | certificado |
| decorando-penal-dls-20260827-0606 | pen-m06 | Art. 48, § único, CP | C | certificado |
| decorando-penal-dls-20260827-0607 | pen-m06 | Art. 49, CP | C | certificado |
| decorando-penal-dls-20260827-0608 | pen-m06 | Art. 49, § 1º, CP | E | certificado |
| decorando-penal-dls-20260827-0609 | pen-m06 | Art. 50, CP | E | certificado |
| decorando-penal-dls-20260827-0610 | pen-m06 | Art. 51, CP | E | certificado |
| decorando-penal-dls-20260827-0611 | pen-m06 | Art. 51, CP | E | certificado |
| decorando-penal-dls-20260827-0612 | pen-m06 | Art. 49, CP | C | certificado |
| decorando-penal-dls-20260827-0613 | pen-m06 | Art. 49, CP | C | certificado |
| decorando-penal-dls-20260827-0614 | pen-m06 | Art. 49, § 1° c/c Art. 60, § 1°, CP | E | certificado |
| decorando-penal-dls-20260827-0615 | pen-m06 | Art. 49, § 2°, CP | E | certificado |
| decorando-penal-dls-20260827-0616 | pen-m06 | Art. 50, CP | E | certificado |
| decorando-penal-dls-20260827-0617 | pen-m06 | Art. 50, § 1º, b, § 2º, CP | C | certificado |
| decorando-penal-dls-20260827-0618 | pen-m06 | Art. 50, § 1º, CP | E | certificado |
| decorando-penal-dls-20260827-0619 | pen-m06 | Art. 51, CP | E | certificado |
| decorando-penal-dls-20260827-0620 | pen-m06 | Art. 51, CP | C | certificado-parcial |
| decorando-penal-dls-20260827-0621 | pen-m06 | Art. 51, CP | E | certificado |
| decorando-penal-dls-20260827-0622 | pen-m06 | Art. 51, CP | E | certificado-parcial |
| decorando-penal-dls-20260827-0623 | pen-m06 | Art. 52, CP | E | certificado |
| decorando-penal-dls-20260827-0624 | pen-m06 | Arts. 47, II, e 56, CP | C | certificado |
| decorando-penal-dls-20260827-0625 | pen-m06 | Art. 59, CP | C | certificado-parcial |
| decorando-penal-dls-20260827-0626 | pen-m06 | Art. 59, CP | C | certificado |
| decorando-penal-dls-20260827-0627 | pen-m06 | Art. 59, § 2º, CP | E | certificado |
| decorando-penal-dls-20260827-0628 | pen-m06 | Arts. 59, 61 e 63, CP | C | certificado-parcial |
| decorando-penal-dls-20260827-0629 | pen-m06 | Art. 60, CP | E | certificado |
| decorando-penal-dls-20260827-0630 | pen-m06 | Art. 61, I, CP | C | certificado |
| decorando-penal-dls-20260827-0631 | pen-m06 | Arts. 61, I, ¨¨65, I, III, "d" e 68, CP | C | certificado |
| decorando-penal-dls-20260827-0632 | pen-m06 | Art. 61, II, f c/c Art. 121-A, § 1º, CP | E | certificado |
| decorando-penal-dls-20260827-0633 | pen-m06 | Art. 61, II, j, CP | C | certificado |
| decorando-penal-dls-20260827-0634 | pen-m06 | Art. 61, II, “j” e “m”, CP | E | certificado |
| decorando-penal-dls-20260827-0635 | pen-m06 | Art. 61, II “l”, CP | C | certificado |
| decorando-penal-dls-20260827-0636 | pen-m06 | Art. 61, II, "l", CP | E | certificado |
| decorando-penal-dls-20260827-0637 | pen-m06 | Art. 61, II, m, CP | C | certificado |
| decorando-penal-dls-20260827-0638 | pen-m06 | Art. 62, CP | C | certificado |
| decorando-penal-dls-20260827-0639 | pen-m06 | Art. 62, II, CP | C | certificado-parcial |
| decorando-penal-dls-20260827-0640 | pen-m06 | Art. 63, CP | E | certificado |
| decorando-penal-dls-20260827-0641 | pen-m06 | Art. 63, CP | E | certificado-parcial |
| decorando-penal-dls-20260827-0642 | pen-m06 | Art. 63, CP | E | certificado |
| decorando-penal-dls-20260827-0643 | pen-m06 | Art. 63, CP | E | certificado |
| decorando-penal-dls-20260827-0644 | pen-m06 | Arts. 63 e 64, I, CP | C | certificado |
| decorando-penal-dls-20260827-0645 | pen-m06 | Arts. 63 e 64, II, CP | E | certificado |
| decorando-penal-dls-20260827-0646 | pen-m06 | Art. 64, CP | E | certificado |
| decorando-penal-dls-20260827-0647 | pen-m06 | Art. 64, I, CP | E | certificado |
| decorando-penal-dls-20260827-0648 | pen-m06 | Art. 64, I, CP | C | pendente |
| decorando-penal-dls-20260827-0649 | pen-m06 | Art. 64, I, CP | E | certificado |
| decorando-penal-dls-20260827-0650 | pen-m06 | Art. 64, II, CP | E | certificado |
| decorando-penal-dls-20260827-0651 | pen-m06 | Art. 64, II, CP | E | certificado |
| decorando-penal-dls-20260827-0652 | pen-m06 | Art. 64, II, CP | E | certificado |
| decorando-penal-dls-20260827-0653 | pen-m06 | Art. 64, II, CP | E | certificado-parcial |
| decorando-penal-dls-20260827-0654 | pen-m06 | Art. 65, CP | E | certificado |
| decorando-penal-dls-20260827-0655 | pen-m06 | Art. 65, e, CP | E | certificado |
| decorando-penal-dls-20260827-0656 | pen-m06 | Art. 65, I, CP | E | certificado |
| decorando-penal-dls-20260827-0657 | pen-m06 | Art. 65, I, CP | E | certificado |
| decorando-penal-dls-20260827-0658 | pen-m06 | Arts. 65, I e 68, CP | E | certificado |
| decorando-penal-dls-20260827-0659 | pen-m06 | Art. 65, II, CP | C | certificado |
| decorando-penal-dls-20260827-0660 | pen-m06 | Art. 65, II, CP | C | certificado |
| decorando-penal-dls-20260827-0661 | pen-m06 | Art. 65, III, “b”, CP | E | certificado |
| decorando-penal-dls-20260827-0662 | pen-m06 | Art. 65, III, b, CP | C | certificado |
| decorando-penal-dls-20260827-0663 | pen-m06 | Art. 65, III, c, CP | E | certificado |
| decorando-penal-dls-20260827-0664 | pen-m06 | Art. 65, III, “c”, CP | E | certificado |
| decorando-penal-dls-20260827-0665 | pen-m06 | Art. 65, III, d, CP | E | certificado-parcial |
| decorando-penal-dls-20260827-0666 | pen-m06 | Art. 65, III, “d”, CP | C | certificado |
| decorando-penal-dls-20260827-0667 | pen-m06 | Art. 65, III, “e”, CP | C | certificado |
| decorando-penal-dls-20260827-0668 | pen-m06 | Art. 65, III, d, CP | C | certificado |
| decorando-penal-dls-20260827-0669 | pen-m06 | Art. 66, CP | E | certificado |
| decorando-penal-dls-20260827-0670 | pen-m06 | (Art. 67, CP) | E | certificado |
| decorando-penal-dls-20260827-0671 | pen-m06 | Art. 67, CP | E | certificado |
| decorando-penal-dls-20260827-0672 | pen-m06 | Art. 67, CP | C | certificado |
| decorando-penal-dls-20260827-0673 | pen-m06 | Art. 67, CP | C | certificado |
| decorando-penal-dls-20260827-0674 | pen-m06 | Art. 67, CP | C | certificado-parcial |
| decorando-penal-dls-20260827-0675 | pen-m06 | Art. 68, CP | C | certificado |
| decorando-penal-dls-20260827-0676 | pen-m06 | Art. 68, § único, CP | C | certificado |
| decorando-penal-dls-20260827-0677 | pen-m06 | Art. 68, § único, CP | E | certificado |
| decorando-penal-dls-20260827-0678 | pen-m06 | Art. 68, § único, CP | C | certificado-parcial |
| decorando-penal-dls-20260827-0679 | pen-m06 | Art. 69, CP | C | certificado |
| decorando-penal-dls-20260827-0680 | pen-m06 | Art. 69, CP | E | certificado |
| decorando-penal-dls-20260827-0681 | pen-m06 | Art. 70, CP | C | certificado |
| decorando-penal-dls-20260827-0682 | pen-m06 | Art. 70, CP | C | certificado |
| decorando-penal-dls-20260827-0683 | pen-m06 | Art. 70, CP | C | certificado-parcial |
| decorando-penal-dls-20260827-0684 | pen-m06 | Art. 70, CP | C | certificado |
| decorando-penal-dls-20260827-0685 | pen-m06 | Art. 70, CP | E | certificado |
| decorando-penal-dls-20260827-0687 | pen-m06 | Art. 70, CP | C | certificado |
| decorando-penal-dls-20260827-0688 | pen-m06 | Art. 70, CP | E | certificado |
| decorando-penal-dls-20260827-0689 | pen-m06 | Art. 70, CP | C | certificado |
| decorando-penal-dls-20260827-0690 | pen-m06 | Art. 70, CP | C | certificado-parcial |
| decorando-penal-dls-20260827-0691 | pen-m06 | Arts. 70 e 71, CP | C | certificado |
| decorando-penal-dls-20260827-0692 | pen-m06 | Arts. 70 e 71, CP | C | certificado-parcial |
| decorando-penal-dls-20260827-0693 | pen-m06 | Art. 71, CP c/c S. 659, STJ | C | certificado |
| decorando-penal-dls-20260827-0694 | pen-m06 | (Art. 71, CP) NUCEPE 2017 - Agente Penitenciário (SEJUS-PI) | E | certificado |
| decorando-penal-dls-20260827-0695 | pen-m06 | Art. 71, CP | C | certificado |
| decorando-penal-dls-20260827-0696 | pen-m06 | Art. 71, CP, c/c S. 497, STF | C | certificado |
| decorando-penal-dls-20260827-0697 | pen-m06 | Art. 71, § único, CP | E | certificado |
| decorando-penal-dls-20260827-0698 | pen-m06 | Art. 72, CP | C | certificado-parcial |
| decorando-penal-dls-20260827-0699 | pen-m06 | Art. 72, CP | C | certificado |
| decorando-penal-dls-20260827-0700 | pen-m06 | Art. 72, CP | C | certificado-parcial |
| decorando-penal-dls-20260827-0701 | pen-m06 | Art. 72, CP | C | certificado |
| decorando-penal-dls-20260827-0702 | pen-m06 | Art. 72, CP | E | certificado |
| decorando-penal-dls-20260827-0703 | pen-m06 | Art. 72, CP | E | certificado |
| decorando-penal-dls-20260827-0704 | pen-m06 | Art. 72, CP | C | certificado |
| decorando-penal-dls-20260827-0705 | pen-m06 | Art. 73, CP | E | certificado |
| decorando-penal-dls-20260827-0706 | pen-m06 | Arts. 73 e 121, § 5º, CP | E | certificado |
| decorando-penal-dls-20260827-0707 | pen-m06 | Art. 74, CP | C | certificado |
| decorando-penal-dls-20260827-0708 | pen-m06 | Art. 73, CP | C | certificado-parcial |
| decorando-penal-dls-20260827-0709 | pen-m06 | Arts. 73 e 74, CP | E | certificado |
| decorando-penal-dls-20260827-0710 | pen-m06 | Art. 74, CP | C | certificado-parcial |
| decorando-penal-dls-20260827-0711 | pen-m06 | Art. 75, CP | E | certificado |
| decorando-penal-dls-20260827-0712 | pen-m06 | Art. 75, CP | C | certificado |
| decorando-penal-dls-20260827-0713 | pen-m06 | Art. 75, CP | C | certificado |
| decorando-penal-dls-20260827-0714 | pen-m06 | Art. 75, CP | E | certificado |
| decorando-penal-dls-20260827-0715 | pen-m06 | Art. 75, § 1º, CP | C | certificado |
| decorando-penal-dls-20260827-0716 | pen-m06 | Art. 75, § 1°, CP | C | certificado |
| decorando-penal-dls-20260827-0717 | pen-m06 | Art. 75, § 2°, CP | C | certificado |
| decorando-penal-dls-20260827-0718 | pen-m06 | Art. 75, § 2º, CP | C | certificado-parcial |
| decorando-penal-dls-20260827-0719 | pen-m06 | Art. 76, CP | E | certificado |
| decorando-penal-dls-20260827-0720 | pen-m06 | Arts. 70 e 72, CP | C | certificado |
| decorando-penal-dls-20260827-0721 | pen-m06 | Art. 67, CP | C | certificado |
| decorando-penal-dls-20260827-0722 | pen-m06 | Art. 77, CP | E | certificado |
| decorando-penal-dls-20260827-0723 | pen-m06 | Art. 77, I, CP | C | certificado |
| decorando-penal-dls-20260827-0724 | pen-m06 | Art. 77, I, CP | E | certificado |
| decorando-penal-dls-20260827-0725 | pen-m06 | Art. 77, § 2º, CP | E | certificado |
| decorando-penal-dls-20260827-0726 | pen-m06 | Art. 77, I, CP | E | certificado |
| decorando-penal-dls-20260827-0727 | pen-m06 | Art. 77, CP | C | certificado |
| decorando-penal-dls-20260827-0728 | pen-m06 | Art. 79, CP | C | certificado |
| decorando-penal-dls-20260827-0729 | pen-m06 | Art. 81, CP | C | certificado |
| decorando-penal-dls-20260827-0730 | pen-m06 | Art. 81, I, CP | E | certificado |
| decorando-penal-dls-20260827-0731 | pen-m06 | Art. 81, I, § 1º, CP | E | certificado |
| decorando-penal-dls-20260827-0732 | pen-m06 | Art. 81, II, CP | C | certificado |
| decorando-penal-dls-20260827-0733 | pen-m06 | Art. 81, III, CP | C | certificado |
| decorando-penal-dls-20260827-0734 | pen-m06 | Art. 80, CP | E | certificado |
| decorando-penal-dls-20260827-0735 | pen-m06 | Art. 81, § 1º, CP | E | certificado |
| decorando-penal-dls-20260827-0736 | pen-m06 | Art. 82, CP | E | certificado-parcial |
| decorando-penal-dls-20260827-0737 | pen-m06 | Art. 77, CP | C | certificado |
| decorando-penal-dls-20260827-0738 | pen-m06 | Art. 77, II, CP | C | certificado-parcial |
| decorando-penal-dls-20260827-0739 | pen-m06 | Art. 83, CP | C | certificado |
| decorando-penal-dls-20260827-0740 | pen-m06 | Art. 83, CP | E | certificado |
| decorando-penal-dls-20260827-0741 | pen-m06 | Art. 83, CP | C | certificado |
| decorando-penal-dls-20260827-0742 | pen-m06 | Art. 83, II, CP | C | certificado |
| decorando-penal-dls-20260827-0743 | pen-m06 | Art. 83, III, b, CP | E | certificado |
| decorando-penal-dls-20260827-0744 | pen-m06 | Art. 83, IV, CP | C | certificado |
| decorando-penal-dls-20260827-0745 | pen-m06 | Art. 83, V, CP | C | certificado-parcial |
| decorando-penal-dls-20260827-0746 | pen-m06 | Art. 83, V, CP | E | certificado |
| decorando-penal-dls-20260827-0747 | pen-m06 | Art. 83, V, CP | C | certificado |
| decorando-penal-dls-20260827-0748 | pen-m06 | Art. 84, CP | E | certificado |
| decorando-penal-dls-20260827-0749 | pen-m06 | Art. 84, CP | E | certificado |
| decorando-penal-dls-20260827-0750 | pen-m06 | Art. 84, CP | E | certificado |
| decorando-penal-dls-20260827-0751 | pen-m06 | Arts. 86, II, e 88, CP | E | certificado |
| decorando-penal-dls-20260827-0752 | pen-m06 | Art. 87, CP | C | certificado |
| decorando-penal-dls-20260827-0753 | pen-m06 | Art. 88, CP | C | certificado |
| decorando-penal-dls-20260827-0754 | pen-m06 | Art. 89, CP | C | certificado |
| decorando-penal-dls-20260827-0755 | pen-m06 | Art. 91, CP | C | certificado |
| decorando-penal-dls-20260827-0756 | pen-m06 | Art. 91, I, CP | C | certificado-parcial |
| decorando-penal-dls-20260827-0757 | pen-m06 | Art. 91, I, CP | C | certificado-parcial |
| decorando-penal-dls-20260827-0758 | pen-m06 | Art. 91, II, a, CP | C | certificado |
| decorando-penal-dls-20260827-0759 | pen-m06 | Art. 91, § 1º, CP | E | certificado-parcial |
| decorando-penal-dls-20260827-0760 | pen-m06 | Art. 91-A, § 1º, I, CP | E | certificado |
| decorando-penal-dls-20260827-0761 | pen-m06 | Art. 91, § 1º, CP | E | certificado |
| decorando-penal-dls-20260827-0762 | pen-m06 | Art. 91, § 1º, CP | C | certificado |
| decorando-penal-dls-20260827-0763 | pen-m06 | Art. 91, § 1º, CP | E | certificado |
| decorando-penal-dls-20260827-0764 | pen-m06 | Art. 91, § 2º, CP | E | certificado |
| decorando-penal-dls-20260827-0765 | pen-m06 | Art. 91-A, CP | E | certificado |
| decorando-penal-dls-20260827-0766 | pen-m06 | Art. 91-A, CP | E | certificado |
| decorando-penal-dls-20260827-0767 | pen-m06 | Art. 91-A, CP | E | certificado |
| decorando-penal-dls-20260827-0768 | pen-m06 | Art. 91-A, CP | E | certificado |
| decorando-penal-dls-20260827-0769 | pen-m06 | Art. 91-A, CP | C | certificado |
| decorando-penal-dls-20260827-0770 | pen-m06 | Art. 91-A, CP | E | certificado |
| decorando-penal-dls-20260827-0771 | pen-m06 | Art. 91-A, CP | C | certificado |
| decorando-penal-dls-20260827-0772 | pen-m06 | Art. 91-A, CP | C | certificado |
| decorando-penal-dls-20260827-0773 | pen-m06 | Art. 91-A, § 1º, CP | E | certificado |
| decorando-penal-dls-20260827-0774 | pen-m06 | Art. 91-A, § 1º, II, CP | C | certificado |
| decorando-penal-dls-20260827-0775 | pen-m06 | Art. 91-A, § 1º, II, CP | C | certificado |
| decorando-penal-dls-20260827-0776 | pen-m06 | Art. 91-A, § 2º, CP | C | certificado |
| decorando-penal-dls-20260827-0777 | pen-m06 | Art. 91-A, § 2º, CP | C | certificado |
| decorando-penal-dls-20260827-0778 | pen-m06 | Art. 91-A, § 3º, CP | E | certificado |
| decorando-penal-dls-20260827-0779 | pen-m06 | Art. 91-A, § 3º, CP | E | certificado |
| decorando-penal-dls-20260827-0780 | pen-m06 | Art. 91-A, §§ 3º e 4º, CP | C | certificado |
| decorando-penal-dls-20260827-0781 | pen-m06 | Art. 91-A, § 3º, CP | E | certificado |
| decorando-penal-dls-20260827-0782 | pen-m06 | Art. 91-A, § 3º, CP | E | certificado |
| decorando-penal-dls-20260827-0783 | pen-m06 | Art. 91-A, § 3º, CP | E | certificado |
| decorando-penal-dls-20260827-0784 | pen-m06 | Art. 91-A, § 4º, CP | C | certificado |
| decorando-penal-dls-20260827-0785 | pen-m06 | Art. 91-A, § 4º, CP | C | certificado |
| decorando-penal-dls-20260827-0786 | pen-m06 | Art. 91-A, § 4º, CP | C | certificado |
| decorando-penal-dls-20260827-0787 | pen-m06 | Art. 91-A, § 5º, CP | E | certificado |
| decorando-penal-dls-20260827-0788 | pen-m06 | Art. 92, CP | C | certificado |
| decorando-penal-dls-20260827-0789 | pen-m06 | Art. 92, I, a, § 1º, CP | E | certificado |
| decorando-penal-dls-20260827-0790 | pen-m06 | Art. 92, II, CP | E | certificado |
| decorando-penal-dls-20260827-0791 | pen-m06 | Art. 92, II, § 1º, CP | E | certificado |
| decorando-penal-dls-20260827-0792 | pen-m06 | Art. 92, IV, CP | E | certificado |
| decorando-penal-dls-20260827-0793 | pen-m06 | Art. 92, § 1º, CP | E | certificado |
| decorando-penal-dls-20260827-0794 | pen-m06 | Art. 92, § 2º, II, CP | C | certificado |
| decorando-penal-dls-20260827-0795 | pen-m06 | Art. 92, § 3º, CP | E | certificado |
| decorando-penal-dls-20260827-0796 | pen-m06 | Art. 92, § 4º, CP | E | certificado |
| decorando-penal-dls-20260827-0797 | pen-m06 | Arts. 93 e 94, CP | C | certificado |
| decorando-penal-dls-20260827-0798 | pen-m06 | Art. 94, I, CP | C | certificado |
| decorando-penal-dls-20260827-0799 | pen-m06 | Art. 94, III, CP | C | certificado-parcial |
| decorando-penal-dls-20260827-0800 | pen-m06 | Art. 94, III, CP | C | certificado |
| decorando-penal-dls-20260827-0801 | pen-m06 | Art. 94, § único, CP | C | certificado |
| decorando-penal-dls-20260827-0802 | pen-m06 | Art. 95, CP | C | certificado |
| decorando-penal-dls-20260827-0803 | pen-m06 | Art. 95, CP | E | certificado |
| decorando-penal-dls-20260827-0804 | pen-m06 | Art. 96, CP | C | certificado |
| decorando-penal-dls-20260827-0805 | pen-m06 | Art. 96, CP | C | certificado |
| decorando-penal-dls-20260827-0806 | pen-m06 | (Art. 97, CP) | E | certificado |
| decorando-penal-dls-20260827-0807 | pen-m06 | Art. 97, CP | E | certificado |
| decorando-penal-dls-20260827-0808 | pen-m06 | Art. 97, § 1º, CP | E | certificado-parcial |
| decorando-penal-dls-20260827-0809 | pen-m06 | Art. 97, § 1º, CP | C | certificado-parcial |
| decorando-penal-dls-20260827-0810 | pen-m06 | Art. 97, § 1°, CP | C | certificado |
| decorando-penal-dls-20260827-0811 | pen-m06 | Art. 97, § 2°, CP | E | certificado |
| decorando-penal-dls-20260827-0812 | pen-m06 | Art. 97, § 3º, CP | C | certificado |
| decorando-penal-dls-20260827-0813 | pen-m06 | Art. 97, § 3º, CP | E | certificado |
| decorando-penal-dls-20260827-0814 | pen-m06 | Art. 97, § 3º, CP | C | certificado |
| decorando-penal-dls-20260827-0815 | pen-m06 | Art. 97, § 3º, CP | C | certificado |
| decorando-penal-dls-20260827-0816 | pen-m06 | Art. 97, § 3º, CP | C | certificado |
| decorando-penal-dls-20260827-0817 | pen-m06 | Art. 97, § 3°, CP | C | certificado |
| decorando-penal-dls-20260827-0818 | pen-m06 | Art. 97, § 1º, CP | E | certificado |
| decorando-penal-dls-20260827-0819 | pen-m06 | Art. 99, CP | E | certificado |
| decorando-pen-autoral-006 | pen-m07 | CP, art. 103, parágrafo único | E | certificado-parcial |
| decorando-penal-dls-20260827-0820 | pen-m07 | Art. 100, CP | E | certificado |
| decorando-penal-dls-20260827-0821 | pen-m07 | Art. 100, § 3º, CP c/c 29, CPP | C | certificado-parcial |
| decorando-penal-dls-20260827-0822 | pen-m07 | Art. 101, CP | C | certificado |
| decorando-penal-dls-20260827-0823 | pen-m07 | Art. 102, CP | E | certificado |
| decorando-penal-dls-20260827-0824 | pen-m07 | Art. 103, CP | E | certificado-parcial |
| decorando-penal-dls-20260827-0825 | pen-m07 | Art. 104, CP | E | certificado |
| decorando-penal-dls-20260827-0826 | pen-m07 | Art. 104, CP | E | certificado |
| decorando-penal-dls-20260827-0827 | pen-m07 | Art. 104, § único, CP | E | certificado |
| decorando-penal-dls-20260827-0828 | pen-m07 | Art. 105, CP | E | certificado |
| decorando-penal-dls-20260827-0829 | pen-m07 | Art. 105, CP | E | certificado |
| decorando-penal-dls-20260827-0830 | pen-m07 | Art. 106, CP | E | certificado |
| decorando-penal-dls-20260827-0831 | pen-m07 | Art. 106, I c/c Art. 140, CP | C | pendente |
| decorando-penal-dls-20260827-0832 | pen-m07 | Art. 106, III, CP | C | certificado |
| decorando-penal-dls-20260827-0833 | pen-m07 | Art. 103, § único, CP | E | certificado |
| decorando-penal-dls-20260827-0834 | pen-m07 | Art. 107, CP | C | certificado |
| decorando-penal-dls-20260827-0835 | pen-m07 | Art. 107, CP | E | certificado |
| decorando-penal-dls-20260827-0836 | pen-m07 | Art. 107, CP | E | certificado |
| decorando-penal-dls-20260827-0837 | pen-m07 | Art. 107, CP | E | certificado |
| decorando-penal-dls-20260827-0838 | pen-m07 | Art. 107, CP | E | certificado |
| decorando-penal-dls-20260827-0839 | pen-m07 | Art. 107, CP | E | certificado |
| decorando-penal-dls-20260827-0840 | pen-m07 | Art. 107, CP | C | certificado-parcial |
| decorando-penal-dls-20260827-0841 | pen-m07 | Art. 107, IV, CP | C | certificado |
| decorando-penal-dls-20260827-0842 | pen-m07 | Arts. 107 e 121, § 5º, CP | C | certificado |
| decorando-penal-dls-20260827-0843 | pen-m07 | Art. 107, I, CP | C | certificado |
| decorando-penal-dls-20260827-0844 | pen-m07 | Art. 107, I, CP c/c Art. 5º, XLV, CF | C | certificado-parcial |
| decorando-penal-dls-20260827-0846 | pen-m07 | Art. 107, II, CP | E | certificado-parcial |
| decorando-penal-dls-20260827-0847 | pen-m07 | Art. 107, II, CP | C | certificado |
| decorando-penal-dls-20260827-0848 | pen-m07 | Art. 107, II e V, CP | C | certificado |
| decorando-penal-dls-20260827-0849 | pen-m07 | Art. 107, III, CP | C | certificado |
| decorando-penal-dls-20260827-0850 | pen-m07 | Art. 107, IV, CP | E | certificado |
| decorando-penal-dls-20260827-0851 | pen-m07 | Art. 107, IV, CP | E | certificado |
| decorando-penal-dls-20260827-0852 | pen-m07 | Art. 107, V, CP | E | certificado |
| decorando-penal-dls-20260827-0853 | pen-m07 | Art. 107, VI, CP | E | certificado |
| decorando-penal-dls-20260827-0854 | pen-m07 | Art. 107, IV e V, CP | E | certificado-parcial |
| decorando-penal-dls-20260827-0855 | pen-m07 | Art. 107, IX, CP | C | certificado |
| decorando-penal-dls-20260827-0856 | pen-m07 | Art. 108, CP | E | certificado |
| decorando-penal-dls-20260827-0857 | pen-m07 | Art. 108, CP | C | certificado |
| decorando-penal-dls-20260827-0858 | pen-m07 | Art. 108, CP | C | certificado |
| decorando-penal-dls-20260827-0859 | pen-m07 | Art. 108, CP | E | certificado |
| decorando-penal-dls-20260827-0860 | pen-m07 | Art. 108, CP | E | certificado |
| decorando-penal-dls-20260827-0861 | pen-m07 | Art. 108, CP | C | certificado |
| decorando-penal-dls-20260827-0862 | pen-m07 | Art. 108, CP | C | certificado |
| decorando-penal-dls-20260827-0863 | pen-m07 | Art. 108, CP | C | certificado |
| decorando-penal-dls-20260827-0864 | pen-m07 | Art. 108, CP | C | certificado |
| decorando-penal-dls-20260827-0865 | pen-m07 | Art. 109, CP | E | certificado |
| decorando-penal-dls-20260827-0866 | pen-m07 | Art. 109, CP | C | certificado |
| decorando-penal-dls-20260827-0867 | pen-m07 | Art. 109, III, CP | C | certificado |
| decorando-penal-dls-20260827-0868 | pen-m07 | Arts. 109, IV e 115, CP | C | certificado-parcial |
| decorando-penal-dls-20260827-0869 | pen-m07 | Art. 109, V, CP | C | certificado |
| decorando-penal-dls-20260827-0870 | pen-m07 | Art. 109, VI, CP | C | certificado |
| decorando-penal-dls-20260827-0871 | pen-m07 | Arts. 109 e 110, CP | C | certificado |
| decorando-penal-dls-20260827-0872 | pen-m07 | Arts. 109 e 110, CP | C | certificado |
| decorando-penal-dls-20260827-0873 | pen-m07 | Arts. 109, II, 115, 117, I e 333, CP | C | certificado |
| decorando-penal-dls-20260827-0874 | pen-m07 | Art. 109, § único, CP | E | certificado |
| decorando-penal-dls-20260827-0875 | pen-m07 | Art. 109, § único, CP | E | certificado |
| decorando-penal-dls-20260827-0876 | pen-m07 | Art. 110, CP | C | certificado |
| decorando-penal-dls-20260827-0877 | pen-m07 | Art. 110, CP | C | certificado |
| decorando-penal-dls-20260827-0878 | pen-m07 | Art. 110, CP | E | certificado-parcial |
| decorando-penal-dls-20260827-0879 | pen-m07 | Art. 110, CP | E | certificado |
| decorando-penal-dls-20260827-0880 | pen-m07 | Art. 110, CP | C | certificado |
| decorando-penal-dls-20260827-0881 | pen-m07 | Art. 110, § 1º, CP | E | certificado |
| decorando-penal-dls-20260827-0882 | pen-m07 | Art. 110, § 1º, CP | C | certificado |
| decorando-penal-dls-20260827-0883 | pen-m07 | Art. 110, § 1º, CP | E | certificado |
| decorando-penal-dls-20260827-0885 | pen-m07 | Art. 110, § 1º, CP | C | certificado |
| decorando-penal-dls-20260827-0886 | pen-m07 | Art. 110, §1º, CP | E | certificado |
| decorando-penal-dls-20260827-0887 | pen-m07 | Art. 111, CP | E | certificado |
| decorando-penal-dls-20260827-0888 | pen-m07 | Art. 111, CP | E | certificado |
| decorando-penal-dls-20260827-0889 | pen-m07 | Art. 111, I, CP | E | certificado-parcial |
| decorando-penal-dls-20260827-0890 | pen-m07 | Art. 111, III, CP | E | certificado |
| decorando-penal-dls-20260827-0891 | pen-m07 | Art. 111, III, CP | C | certificado |
| decorando-penal-dls-20260827-0892 | pen-m07 | Art. 111, III, CP | C | certificado |
| decorando-penal-dls-20260827-0893 | pen-m07 | Art. 111, III, CP | E | certificado |
| decorando-penal-dls-20260827-0894 | pen-m07 | Art. 111, IV e 235, CP | C | certificado |
| decorando-penal-dls-20260827-0895 | pen-m07 | Art. 111, V, CP | E | certificado |
| decorando-penal-dls-20260827-0896 | pen-m07 | Art. 111, V, CP | C | certificado |
| decorando-penal-dls-20260827-0897 | pen-m07 | Art. 111, V, CP | C | certificado |
| decorando-penal-dls-20260827-0898 | pen-m07 | Art. 111, V, CP | E | certificado |
| decorando-penal-dls-20260827-0899 | pen-m07 | Art. 111, V, CP | C | certificado |
| decorando-penal-dls-20260827-0900 | pen-m07 | Art. 113, CP | C | certificado |
| decorando-penal-dls-20260827-0901 | pen-m07 | Art. 113, CP | E | certificado |
| decorando-penal-dls-20260827-0902 | pen-m07 | Art. 113, CP | E | certificado |
| decorando-penal-dls-20260827-0903 | pen-m07 | Art. 113, CP | C | certificado |
| decorando-penal-dls-20260827-0904 | pen-m07 | Art. 113, CP | C | certificado |
| decorando-penal-dls-20260827-0905 | pen-m07 | Art. 114, CP | E | certificado |
| decorando-penal-dls-20260827-0906 | pen-m07 | Art. 114, CP | E | certificado |
| decorando-penal-dls-20260827-0907 | pen-m07 | Art. 114, CP | E | certificado |
| decorando-penal-dls-20260827-0908 | pen-m07 | Art. 114, CP | E | certificado |
| decorando-penal-dls-20260827-0909 | pen-m07 | Art. 114, I, CP | E | certificado |
| decorando-penal-dls-20260827-0910 | pen-m07 | Art. 114, I, CP | E | certificado |
| decorando-penal-dls-20260827-0911 | pen-m07 | Art. 114, I, CP | E | certificado |
| decorando-penal-dls-20260827-0912 | pen-m07 | Art. 114, I, II, CP | C | certificado |
| decorando-penal-dls-20260827-0913 | pen-m07 | Art. 114, I, II, CP | E | certificado |
| decorando-penal-dls-20260827-0914 | pen-m07 | Art. 114, II, CP | E | certificado |
| decorando-penal-dls-20260827-0915 | pen-m07 | Art. 114, II, CP | C | certificado |
| decorando-penal-dls-20260827-0916 | pen-m07 | Art. 114, I, II, CP | E | certificado |
| decorando-penal-dls-20260827-0917 | pen-m07 | Art. 114, II, CP | C | certificado |
| decorando-penal-dls-20260827-0918 | pen-m07 | Art. 115, CP | E | certificado |
| decorando-penal-dls-20260827-0919 | pen-m07 | Art. 115, CP | E | certificado |
| decorando-penal-dls-20260827-0920 | pen-m07 | Art. 115, CP | C | certificado |
| decorando-penal-dls-20260827-0921 | pen-m07 | Art. 115, CP | C | certificado-parcial |
| decorando-penal-dls-20260827-0922 | pen-m07 | Art. 115, CP | E | certificado |
| decorando-penal-dls-20260827-0923 | pen-m07 | Art. 115, CP | C | certificado-parcial |
| decorando-penal-dls-20260827-0924 | pen-m07 | Art. 115, CP | E | certificado |
| decorando-penal-dls-20260827-0925 | pen-m07 | Art. 115, CP | E | certificado |
| decorando-penal-dls-20260827-0926 | pen-m07 | Art. 115, CP | E | certificado |
| decorando-penal-dls-20260827-0927 | pen-m07 | Arts. 115, CP e 30, Lei 11.343/06 | C | certificado-parcial |
| decorando-penal-dls-20260827-0928 | pen-m07 | Art. 115 c/c 117, I, CP | C | certificado |
| decorando-penal-dls-20260827-0929 | pen-m07 | Art. 116, CP | C | certificado |
| decorando-penal-dls-20260827-0930 | pen-m07 | Art. 116, CP | E | certificado |
| decorando-penal-dls-20260827-0932 | pen-m07 | Art. 116, I, CP | C | certificado |
| decorando-penal-dls-20260827-0933 | pen-m07 | Art. 116, II, CP | C | certificado |
| decorando-penal-dls-20260827-0934 | pen-m07 | Art. 116, II, CP | C | certificado |
| decorando-penal-dls-20260827-0935 | pen-m07 | Art. 116, II, CP | E | certificado |
| decorando-penal-dls-20260827-0936 | pen-m07 | Art. 116, II, CP | C | certificado |
| decorando-penal-dls-20260827-0937 | pen-m07 | Art. 116, II, CP | C | certificado |
| decorando-penal-dls-20260827-0938 | pen-m07 | Art. 116, III, CP | C | certificado |
| decorando-penal-dls-20260827-0939 | pen-m07 | Art. 116, III, CP | C | certificado |
| decorando-penal-dls-20260827-0940 | pen-m07 | Art. 116, III, CP | C | certificado |
| decorando-penal-dls-20260827-0941 | pen-m07 | Art. 116, IV, CP | C | certificado |
| decorando-penal-dls-20260827-0942 | pen-m07 | Art. 116, IV, CP | E | certificado |
| decorando-penal-dls-20260827-0943 | pen-m07 | Art. 116, IV, CP | E | certificado |
| decorando-penal-dls-20260827-0944 | pen-m07 | Art. 116, § único, CP | E | certificado |
| decorando-penal-dls-20260827-0945 | pen-m07 | Art. 116, § único, CP | E | certificado |
| decorando-penal-dls-20260827-0946 | pen-m07 | Art. 117, CP | C | certificado |
| decorando-penal-dls-20260827-0947 | pen-m07 | Art. 117, CP | E | certificado |
| decorando-penal-dls-20260827-0948 | pen-m07 | Art. 117, CP | C | certificado |
| decorando-penal-dls-20260827-0949 | pen-m07 | Art. 117, CP | E | certificado |
| decorando-penal-dls-20260827-0950 | pen-m07 | Art. 117, CP | E | certificado |
| decorando-penal-dls-20260827-0951 | pen-m07 | Art. 117, I, CP | E | certificado |
| decorando-penal-dls-20260827-0952 | pen-m07 | Art. 117, I, CP | E | certificado |
| decorando-penal-dls-20260827-0953 | pen-m07 | Art. 117, I e II, CP | E | certificado |
| decorando-penal-dls-20260827-0954 | pen-m07 | Art. 117, I, II e IV, CP | C | certificado |
| decorando-penal-dls-20260827-0955 | pen-m07 | Art. 117, IV, CP | C | certificado-parcial |
| decorando-penal-dls-20260827-0956 | pen-m07 | Art. 117, IV, CP | C | certificado-parcial |
| decorando-penal-dls-20260827-0957 | pen-m07 | Art. 117, VI, CP | C | certificado-parcial |
| decorando-penal-dls-20260827-0958 | pen-m07 | Art. 117, I, § 1º, CP | C | certificado |
| decorando-penal-dls-20260827-0959 | pen-m07 | Art. 117, I, § 1º, CP | C | certificado |
| decorando-penal-dls-20260827-0960 | pen-m07 | Art. 117, VI, § 1º, CP | E | certificado |
| decorando-penal-dls-20260827-0961 | pen-m07 | Art. 117, § 1º, CP | E | certificado |
| decorando-penal-dls-20260827-0962 | pen-m07 | Art. 117, § 1º, CP | C | certificado |
| decorando-penal-dls-20260827-0963 | pen-m07 | Art. 117, § 1º, CP | C | certificado |
| decorando-penal-dls-20260827-0964 | pen-m07 | Art. 117, § 2°, CP | E | certificado |
| decorando-penal-dls-20260827-0965 | pen-m07 | Art. 119, CP | E | certificado |
| decorando-penal-dls-20260827-0966 | pen-m07 | Art. 119, CP | C | certificado |
| decorando-penal-dls-20260827-0967 | pen-m07 | Art. 119, CP | E | certificado |
| decorando-penal-dls-20260827-0968 | pen-m07 | Art. 119, CP | E | certificado |
| decorando-penal-dls-20260827-0969 | pen-m07 | Art. 120, CP | E | certificado |
| decorando-penal-dls-20260827-0970 | pen-m07 | Art. 120, CP | C | certificado |
| decorando-penal-dls-20260827-0971 | pen-m07 | Art. 117, I e II, CP | C | certificado |
| decorando-pen-autoral-007 | pen-m08 | CP, art. 121-B | C | certificado |
| decorando-pen-autoral-008 | pen-m08 | CP, art. 121-B | E | certificado |
| decorando-penal-dls-20260827-0972 | pen-m08 | Art. 121, CP c/c Art. 305, CTB | C | certificado-parcial |
| decorando-penal-dls-20260827-0973 | pen-m08 | Art. 121, § 1º, CP | E | certificado |
| decorando-penal-dls-20260827-0974 | pen-m08 | Art. 121, § 1º, CP | E | certificado |
| decorando-penal-dls-20260827-0975 | pen-m08 | Art. 121, § 1º, CP | E | certificado |
| decorando-penal-dls-20260827-0976 | pen-m08 | Art. 121, § 2º, CP | C | certificado-parcial |
| decorando-penal-dls-20260827-0977 | pen-m08 | Art. 121, § 1º, CP | E | certificado |
| decorando-penal-dls-20260827-0978 | pen-m08 | Art. 121, § 1º, CP | C | certificado |
| decorando-penal-dls-20260827-0979 | pen-m08 | Art. 121, § 2º, CP | E | certificado |
| decorando-penal-dls-20260827-0980 | pen-m08 | Art. 121, § 2º, CP | E | certificado |
| decorando-penal-dls-20260827-0981 | pen-m08 | Art. 121, § 2º, CP | C | certificado |
| decorando-penal-dls-20260827-0982 | pen-m08 | Art. 121, § 2°, I, CP | C | certificado-parcial |
| decorando-penal-dls-20260827-0983 | pen-m08 | Art. 121, § 2°, II, IV, VIII, X, CP | C | certificado |
| decorando-penal-dls-20260827-0984 | pen-m08 | Art. 121, § 2º-D, CP | C | certificado |
| decorando-penal-dls-20260827-0985 | pen-m08 | Art. 121, § 2º, III, CP | C | certificado |
| decorando-penal-dls-20260827-0986 | pen-m08 | Art. 121, § 2°, III, e § 3°, CP | C | certificado-parcial |
| decorando-penal-dls-20260827-0987 | pen-m08 | Art. 121, § 2º, VIII, CP | E | certificado |
| decorando-penal-dls-20260827-0988 | pen-m08 | Art. 121, § 2°, IV, CP | C | certificado-parcial |
| decorando-penal-dls-20260827-0989 | pen-m08 | Art. 121, § 2°, VIII, CP | E | certificado |
| decorando-penal-dls-20260827-0990 | pen-m08 | Art. 121, § 2º-C, I, CP | E | certificado |
| decorando-penal-dls-20260827-0991 | pen-m08 | Art. 121, § 2º-B, II, CP | C | certificado |
| decorando-penal-dls-20260827-0993 | pen-m08 | Art. 121, § 2º, IX e § 2º-B, I, CP | C | certificado |
| decorando-penal-dls-20260827-0994 | pen-m08 | Art. 121, § 3º, CP | E | certificado |
| decorando-penal-dls-20260827-0995 | pen-m08 | Art. 121, § 5º, CP | E | certificado |
| decorando-penal-dls-20260827-0996 | pen-m08 | Art. 121, § 5º, CP | E | certificado |
| decorando-penal-dls-20260827-0997 | pen-m08 | Art. 121, § 5º, CP | C | certificado |
| decorando-penal-dls-20260827-0998 | pen-m08 | Arts. 121, § 5º e 129, 8º, CP | C | certificado |
| decorando-penal-dls-20260827-0999 | pen-m08 | Art. 121, § 6º, CP | E | certificado |
| decorando-penal-dls-20260827-1000 | pen-m08 | Art. 121, § 6º, CP | C | pendente |
| decorando-penal-dls-20260827-1001 | pen-m08 | Art. 121, § 6º, CP | E | certificado |
| decorando-penal-dls-20260827-1002 | pen-m08 | Art. 121, § 6º, CP | E | certificado |
| decorando-penal-dls-20260827-1003 | pen-m08 | Art. 121-A, CP | C | certificado |
| decorando-penal-dls-20260827-1004 | pen-m08 | Art. 121-A, § 1º, I, CP | C | certificado |
| decorando-penal-dls-20260827-1005 | pen-m08 | Art. 121-A, § 2º, III, CP | E | certificado |
| decorando-penal-dls-20260827-1006 | pen-m08 | Art. 121-A, § 3º, CP | C | certificado-parcial |
| decorando-penal-dls-20260827-1007 | pen-m08 | Art. 121-A, § 3º, CP | C | certificado |
| decorando-penal-dls-20260827-1008 | pen-m08 | Art. 121-B, CP | E | certificado |
| decorando-penal-dls-20260827-1009 | pen-m08 | Art. 121-B, CP | C | certificado-parcial |
| decorando-penal-dls-20260827-1010 | pen-m08 | Art. 121-B, CP | C | certificado |
| decorando-penal-dls-20260827-1011 | pen-m08 | Art. 121-B, § único, II, CP | C | certificado |
| decorando-penal-dls-20260827-1012 | pen-m08 | Art. 121-B, § único, I, CP | E | certificado |
| decorando-penal-dls-20260827-1013 | pen-m08 | Art. 122, CP | C | certificado |
| decorando-penal-dls-20260827-1014 | pen-m08 | Art. 122, § 1º, CP | E | certificado |
| decorando-penal-dls-20260827-1015 | pen-m08 | Art. 122, § 2º, CP | C | certificado |
| decorando-penal-dls-20260827-1016 | pen-m08 | Art. 122, § 3º, CP | C | certificado |
| decorando-penal-dls-20260827-1017 | pen-m08 | Art. 122, § 3º, CP | E | certificado |
| decorando-penal-dls-20260827-1018 | pen-m08 | Art. 122, § 3º, I, CP | C | certificado |
| decorando-penal-dls-20260827-1019 | pen-m08 | Art. 122, § 7º, CP | C | certificado |
| decorando-penal-dls-20260827-1020 | pen-m08 | Art. 123, CP | E | certificado |
| decorando-penal-dls-20260827-1021 | pen-m08 | Art. 123, CP | C | certificado |
| decorando-penal-dls-20260827-1022 | pen-m08 | Art. 123, CP | E | certificado |
| decorando-penal-dls-20260827-1023 | pen-m08 | Art. 124, CP | C | certificado |
| decorando-penal-dls-20260827-1024 | pen-m08 | Arts, 124, 126 e 127, CP | C | certificado-parcial |
| decorando-penal-dls-20260827-1025 | pen-m08 | Art. 125, CP | E | certificado |
| decorando-penal-dls-20260827-1026 | pen-m08 | Art. 128, CP | C | certificado |
| decorando-penal-dls-20260827-1027 | pen-m08 | Art. 128, I e II, CP | E | certificado |
| decorando-penal-dls-20260827-1028 | pen-m08 | Art. 128, II, CP | E | certificado |
| decorando-penal-dls-20260827-1029 | pen-m08 | Art. 129, CP | E | certificado |
| decorando-penal-dls-20260827-1030 | pen-m08 | (Art. 129, CP) | C | certificado |
| decorando-penal-dls-20260827-1031 | pen-m08 | Art. 129, § 1°, I, CP | C | certificado-parcial |
| decorando-penal-dls-20260827-1032 | pen-m08 | Art. 129, § 1º, I, CP | E | certificado |
| decorando-penal-dls-20260827-1033 | pen-m08 | Art. 129, § 1º, II, CP | C | certificado |
| decorando-penal-dls-20260827-1034 | pen-m08 | Art. 129, § 1°, III, CP | E | certificado |
| decorando-penal-dls-20260827-1035 | pen-m08 | Arts. 129, § 2º, V, CP | C | certificado |
| decorando-penal-dls-20260827-1036 | pen-m08 | Art. 129, § 3º, CP | C | certificado |
| decorando-penal-dls-20260827-1037 | pen-m08 | Art. 129, § 3º-A, CP | E | certificado |
| decorando-penal-dls-20260827-1038 | pen-m08 | Art. 129, § 5º, II, CP | C | certificado-parcial |
| decorando-penal-dls-20260827-1039 | pen-m08 | Art. 129, § 7º, CP | E | certificado |
| decorando-penal-dls-20260827-1040 | pen-m08 | Art. 129, § 8º-A, CP | E | certificado |
| decorando-penal-dls-20260827-1041 | pen-m08 | Art. 129, § 12, I, CP | C | certificado |
| decorando-penal-dls-20260827-1042 | pen-m08 | Art. 130, § 2º, CP | E | certificado |
| decorando-penal-dls-20260827-1043 | pen-m08 | Art. 131, CP | E | certificado |
| decorando-penal-dls-20260827-1044 | pen-m08 | Art. 132, CP | C | certificado |
| decorando-penal-dls-20260827-1045 | pen-m08 | (Art. 133, CP) PM-MG 2015 - Soldado da Polícia Militar | C | certificado |
| decorando-penal-dls-20260827-1046 | pen-m08 | Art. 135, § único, CP | C | certificado |
| decorando-penal-dls-20260827-1047 | pen-m08 | Art. 136, CP | E | pendente |
| decorando-penal-dls-20260827-1048 | pen-m08 | Art. 136, § 1º, CP | E | certificado |
| decorando-penal-dls-20260827-1049 | pen-m08 | Art. 138, CP | E | certificado |
| decorando-penal-dls-20260827-1050 | pen-m08 | Arts 138 e 141, § 1º, CP | C | certificado |
| decorando-penal-dls-20260827-1051 | pen-m08 | Arts. 138 e 145, CP | C | certificado |
| decorando-penal-dls-20260827-1052 | pen-m08 | Arts. 138 e 141, II, CP | C | certificado |
| decorando-penal-dls-20260827-1053 | pen-m08 | Art. 138, § 2º, CP | E | certificado |
| decorando-penal-dls-20260827-1054 | pen-m08 | Art. 138, § 3º, III, CP | C | certificado |
| decorando-penal-dls-20260827-1055 | pen-m08 | Art. 138, CP | E | certificado-parcial |
| decorando-penal-dls-20260827-1056 | pen-m08 | Arts. 138 e 139, CP | E | certificado |
| decorando-penal-dls-20260827-1057 | pen-m08 | Art. 139, CP | C | certificado-parcial |
| decorando-penal-dls-20260827-1058 | pen-m08 | Art. 139, CP | E | certificado |
| decorando-penal-dls-20260827-1059 | pen-m08 | Art. 139, CP | E | certificado-parcial |
| decorando-penal-dls-20260827-1060 | pen-m08 | Art. 139, CP | C | pendente |
| decorando-penal-dls-20260827-1061 | pen-m08 | Art. 139, § único, CP | E | certificado |
| decorando-penal-dls-20260827-1062 | pen-m08 | Art. 139, § único, CP | C | certificado |
| decorando-penal-dls-20260827-1063 | pen-m08 | Art. 139, § único, CP | C | certificado |
| decorando-penal-dls-20260827-1064 | pen-m08 | Art. 140, CP | C | certificado-parcial |
| decorando-penal-dls-20260827-1065 | pen-m08 | Art. 140, § 1º, CP | C | certificado |
| decorando-penal-dls-20260827-1066 | pen-m08 | Art. 140, § 2º, CP | E | certificado |
| decorando-penal-dls-20260827-1067 | pen-m08 | Art. 141, IV, CP | C | certificado |
| decorando-penal-dls-20260827-1068 | pen-m08 | Art. 140, § 3º, CP | E | certificado |
| decorando-penal-dls-20260827-1069 | pen-m08 | Art. 141, II, CP | E | certificado |
| decorando-penal-dls-20260827-1070 | pen-m08 | Art. 141, III, CP | C | certificado |
| decorando-penal-dls-20260827-1071 | pen-m08 | Art. 142, CP | C | certificado |
| decorando-penal-dls-20260827-1072 | pen-m08 | Art. 142, I, CP | E | certificado |
| decorando-penal-dls-20260827-1073 | pen-m08 | Art. 142, I, CP | E | certificado |
| decorando-penal-dls-20260827-1074 | pen-m08 | Art. 142, I, e § único, CP | E | certificado |
| decorando-penal-dls-20260827-1075 | pen-m08 | Art. 142, § único, CP | E | certificado |
| decorando-penal-dls-20260827-1076 | pen-m08 | Art. 143, CP | C | certificado |
| decorando-penal-dls-20260827-1077 | pen-m08 | Art. 143, CP | E | certificado |
| decorando-penal-dls-20260827-1078 | pen-m08 | Art. 143, CP | E | certificado |
| decorando-penal-dls-20260827-1079 | pen-m08 | Art. 143, CP | E | certificado |
| decorando-penal-dls-20260827-1080 | pen-m08 | Art. 143, CP | E | certificado |
| decorando-penal-dls-20260827-1081 | pen-m08 | Art. 143, CP | E | certificado |
| decorando-penal-dls-20260827-1082 | pen-m08 | Art. 143, CP | C | certificado |
| decorando-penal-dls-20260827-1083 | pen-m08 | Art. 144, CP | C | certificado |
| decorando-penal-dls-20260827-1084 | pen-m08 | Art. 144, CP | E | certificado |
| decorando-penal-dls-20260827-1085 | pen-m08 | Art. 145, CP | E | certificado |
| decorando-penal-dls-20260827-1086 | pen-m08 | Art. 143, CP | C | certificado |
| decorando-penal-dls-20260827-1087 | pen-m08 | Art. 143, § único, CP | E | certificado |
| decorando-penal-dls-20260827-1088 | pen-m08 | Art. 145, CP | E | certificado |
| decorando-penal-dls-20260827-1089 | pen-m08 | Art. 146-A, CP | C | certificado-parcial |
| decorando-penal-dls-20260827-1090 | pen-m08 | Art. 146-A, caput e § único, CP | C | certificado |
| decorando-penal-dls-20260827-1091 | pen-m08 | 146-A, § único, CP | C | certificado |
| decorando-penal-dls-20260827-1093 | pen-m08 | Art. 147, CP | E | certificado |
| decorando-penal-dls-20260827-1094 | pen-m08 | Art. 147, CP | C | certificado |
| decorando-penal-dls-20260827-1095 | pen-m08 | Art. 147, CP | C | certificado |
| decorando-penal-dls-20260827-1096 | pen-m08 | Art. 147-A, CP | E | certificado-parcial |
| decorando-penal-dls-20260827-1097 | pen-m08 | Art. 147-A, Art. 147-B, CP | C | certificado |
| decorando-penal-dls-20260827-1098 | pen-m08 | Art. 147-A, CP | C | certificado |
| decorando-penal-dls-20260827-1099 | pen-m08 | Art. 147-A, § 1º, I, CP | C | certificado |
| decorando-penal-dls-20260827-1100 | pen-m08 | Art. 147-A, CP | C | certificado-parcial |
| decorando-penal-dls-20260827-1101 | pen-m08 | Art. 147-A, § 1º, CP | C | certificado |
| decorando-penal-dls-20260827-1102 | pen-m08 | Art. 147-A, § 1º, II, CP | C | certificado-parcial |
| decorando-penal-dls-20260827-1103 | pen-m08 | Art. 147-A, § 1º, II, CP | C | certificado |
| decorando-penal-dls-20260827-1104 | pen-m08 | 147-A e 147-B, CP | C | certificado |
| decorando-penal-dls-20260827-1105 | pen-m08 | Art. 147-A, CP | E | certificado |
| decorando-penal-dls-20260827-1106 | pen-m08 | Art. 147-A, CP | C | certificado |
| decorando-penal-dls-20260827-1107 | pen-m08 | Art. 147-A, §§ 1º e 3º, CP | C | certificado-parcial |
| decorando-penal-dls-20260827-1108 | pen-m08 | Art. 147-B, CP | C | certificado-parcial |
| decorando-penal-dls-20260827-1109 | pen-m08 | Art. 147-B, parágrafo único, CP | E | certificado |
| decorando-penal-dls-20260827-1110 | pen-m08 | Art. 147-B, § único, CP | C | certificado |
| decorando-penal-dls-20260827-1111 | pen-m08 | Art. 147-C, CP | C | certificado |
| decorando-penal-dls-20260827-1112 | pen-m08 | Art. 147-B, § único, CP | E | certificado |
| decorando-penal-dls-20260827-1113 | pen-m08 | Art. 147-B, CP | C | certificado-parcial |
| decorando-penal-dls-20260827-1114 | pen-m08 | Art. 149, CP | C | certificado |
| decorando-penal-dls-20260827-1115 | pen-m08 | Art. 149, CP | C | certificado-parcial |
| decorando-penal-dls-20260827-1116 | pen-m08 | Art. 149, CP | C | certificado-parcial |
| decorando-penal-dls-20260827-1117 | pen-m08 | Art. 149, § 1º, I, CP | C | certificado |
| decorando-penal-dls-20260827-1118 | pen-m08 | Art. 149, § 2°, CP | E | certificado |
| decorando-penal-dls-20260827-1119 | pen-m08 | Art. 149, § 2º, I, CP | C | certificado |
| decorando-penal-dls-20260827-1120 | pen-m08 | Art. 149, § 2º, CP | C | certificado |
| decorando-penal-dls-20260827-1121 | pen-m08 | Art. 149-A, I, CP | C | certificado |
| decorando-penal-dls-20260827-1122 | pen-m08 | Art. 149-A, II, CP | C | certificado |
| decorando-penal-dls-20260827-1123 | pen-m08 | Art. 149-A, II, § 1º, II, CP | C | pendente |
| decorando-penal-dls-20260827-1124 | pen-m08 | Art. 149-A, II, CP | C | certificado-parcial |
| decorando-penal-dls-20260827-1125 | pen-m08 | Art. 149-A, § 1º, IV e § 2º, CP | C | certificado-parcial |
| decorando-penal-dls-20260827-1126 | pen-m08 | Art. 149-A, § 1º, CP | E | certificado |
| decorando-penal-dls-20260827-1128 | pen-m08 | Art. 150, § 1º, CP | C | certificado |
| decorando-penal-dls-20260827-1129 | pen-m08 | Art. 150, § 4º, III, CP | E | certificado |
| decorando-penal-dls-20260827-1130 | pen-m08 | Art. 150, § 4º, III, CP | C | certificado-parcial |
| decorando-penal-dls-20260827-1131 | pen-m08 | Art. 154-A, CP | C | certificado |
| decorando-penal-dls-20260827-1132 | pen-m08 | Art. 154-A, CP | E | certificado |
| decorando-penal-dls-20260827-1133 | pen-m08 | Arts. 154-A, § 2º e 154-B, CP | C | certificado |
| decorando-penal-dls-20260827-1134 | pen-m08 | Art. 154-A, § 3º, CP | C | certificado |
| decorando-penal-dls-20260827-1135 | pen-m08 | Art. 154-A, §3º e § 4º, CP | C | certificado |
| decorando-penal-dls-20260827-1136 | pen-m08 | Art. 154-B, CP | E | certificado |
| decorando-penal-dls-20260827-1137 | pen-m08 | Art. 154-B, CP | C | certificado |
| decorando-penal-dls-20260827-1138 | pen-m08 | Art. 129, § 9º, CP | C | certificado |
| decorando-penal-dls-20260827-1139 | pen-m08 | Art. 121, § 2º-B, I, CP | C | pendente |
| decorando-pen-autoral-009 | pen-m09 | CP, art. 155, caput | C | certificado |
| decorando-pen-autoral-010 | pen-m09 | CP, art. 155, §1º | E | certificado |
| decorando-pen-autoral-011 | pen-m09 | CP, art. 157, caput | C | certificado |
| decorando-pen-autoral-012 | pen-m09 | CP, art. 180, caput | E | certificado |
| decorando-penal-dls-20260827-1140 | pen-m09 | Art. 155, CP | C | certificado |
| decorando-penal-dls-20260827-1142 | pen-m09 | Arts. 155 e 181, CP | C | certificado-parcial |
| decorando-penal-dls-20260827-1143 | pen-m09 | Art. 155, § 1º, CP | C | certificado |
| decorando-penal-dls-20260827-1144 | pen-m09 | Art. 155, § 2º, CP | C | certificado |
| decorando-penal-dls-20260827-1145 | pen-m09 | Art. 155, § 2º, CP | E | certificado |
| decorando-penal-dls-20260827-1146 | pen-m09 | Art. 155, § 2º, CP | C | certificado |
| decorando-penal-dls-20260827-1147 | pen-m09 | Art. 155, § 2º, CP | C | certificado-parcial |
| decorando-penal-dls-20260827-1148 | pen-m09 | Art. 155, § 2º, CP | C | certificado-parcial |
| decorando-penal-dls-20260827-1149 | pen-m09 | Art. 155, § 2º, CP | E | certificado-parcial |
| decorando-penal-dls-20260827-1150 | pen-m09 | Art. 155, §§ 2° e 4°, I, CP | C | certificado-parcial |
| decorando-penal-dls-20260827-1151 | pen-m09 | Art. 155, § 2º e § 4º, I, CP | C | certificado |
| decorando-penal-dls-20260827-1152 | pen-m09 | Art. 155, § 3º, CP | C | certificado |
| decorando-penal-dls-20260827-1153 | pen-m09 | Art. 155, § 3º, CP | E | certificado |
| decorando-penal-dls-20260827-1154 | pen-m09 | Art. 155, § 3º, CP | E | certificado |
| decorando-penal-dls-20260827-1155 | pen-m09 | Art. 155, § 4º, CP | C | certificado |
| decorando-penal-dls-20260827-1156 | pen-m09 | Art. 155, § 4º, CP | E | certificado |
| decorando-penal-dls-20260827-1157 | pen-m09 | Art. 155, § 4º, CP | C | certificado |
| decorando-penal-dls-20260827-1158 | pen-m09 | Art. 155, § 4º, II, CP | C | certificado-parcial |
| decorando-penal-dls-20260827-1159 | pen-m09 | Art. 155, § 4º, II, CP | E | certificado-parcial |
| decorando-penal-dls-20260827-1160 | pen-m09 | Art. 155, § 4º, II, CP | E | certificado |
| decorando-penal-dls-20260827-1161 | pen-m09 | Art. 155, § 4º, IV, CP | C | certificado |
| decorando-penal-dls-20260827-1162 | pen-m09 | Art. 155, § 4º, IV, CP | C | certificado |
| decorando-penal-dls-20260827-1163 | pen-m09 | Art 155, § 4º, V, CP | C | pendente |
| decorando-penal-dls-20260827-1164 | pen-m09 | Art. 155, § 4º-B, CP | C | certificado-parcial |
| decorando-penal-dls-20260827-1165 | pen-m09 | Art. 155, § 4º-B, CP | E | certificado |
| decorando-penal-dls-20260827-1166 | pen-m09 | Art. 155, § 4º-C, CP | C | certificado |
| decorando-penal-dls-20260827-1167 | pen-m09 | Art. 155, § 5º, CP | E | certificado |
| decorando-penal-dls-20260827-1168 | pen-m09 | Art. 155, § 5º, CP | E | certificado |
| decorando-penal-dls-20260827-1169 | pen-m09 | Art. 155, § 6º, CP | E | certificado |
| decorando-penal-dls-20260827-1170 | pen-m09 | Art. 155, § 6º, I, CP | C | certificado |
| decorando-penal-dls-20260827-1171 | pen-m09 | Art. 155, § 8º, CP | C | certificado |
| decorando-penal-dls-20260827-1172 | pen-m09 | Art 155, § 8º, CP | E | certificado |
| decorando-penal-dls-20260827-1173 | pen-m09 | Art. 155, § 9º, CP | C | certificado |
| decorando-penal-dls-20260827-1174 | pen-m09 | Art. 155, § 9º, CP | E | certificado |
| decorando-penal-dls-20260827-1175 | pen-m09 | Art. 155, c/c Súmula 567, STJ | C | certificado |
| decorando-penal-dls-20260827-1176 | pen-m09 | Art. 156, § 2º, CP | E | certificado |
| decorando-penal-dls-20260827-1177 | pen-m09 | Art. 157, CP | C | certificado |
| decorando-penal-dls-20260827-1178 | pen-m09 | Art. 157 c/c Art. 49, CP | C | certificado |
| decorando-penal-dls-20260827-1179 | pen-m09 | Art. 157, § 1º, CP | C | certificado |
| decorando-penal-dls-20260827-1180 | pen-m09 | Art. 157, § 1º, CP | C | certificado-parcial |
| decorando-penal-dls-20260827-1181 | pen-m09 | Art. 157, § 1°, CP | E | certificado |
| decorando-penal-dls-20260827-1182 | pen-m09 | Art 157, § 1º-A, CP | E | certificado |
| decorando-penal-dls-20260827-1183 | pen-m09 | Art. 157, § 1º-A, CP | C | certificado |
| decorando-penal-dls-20260827-1184 | pen-m09 | Art. 157, § 1º, CP | C | certificado |
| decorando-penal-dls-20260827-1185 | pen-m09 | Art. 157, § 2º, CP | C | certificado |
| decorando-penal-dls-20260827-1186 | pen-m09 | Art. 157, § 2º, VII, CP c/c AREsp n. 2.589.697-DF - Direito Penal | C | certificado |
| decorando-penal-dls-20260827-1187 | pen-m09 | Art. 157, § 2º, II, III, CP | C | certificado-parcial |
| decorando-penal-dls-20260827-1188 | pen-m09 | Art. 157, § 2°, VII, CP | E | certificado |
| decorando-penal-dls-20260827-1189 | pen-m09 | Art. 157, § 2º, VII, CP c/c S. 582, STJ | C | certificado |
| decorando-penal-dls-20260827-1190 | pen-m09 | Art 157, § 2º, VIII, CP | C | certificado |
| decorando-penal-dls-20260827-1191 | pen-m09 | Art. 157, § 2º-A, CP | C | certificado |
| decorando-penal-dls-20260827-1192 | pen-m09 | Art. 157, § 2º-A, CP | C | certificado |
| decorando-penal-dls-20260827-1193 | pen-m09 | Art. 157, § 2º-A, I, CP | E | certificado |
| decorando-penal-dls-20260827-1194 | pen-m09 | Art. 157, § 2°-A, I, e § 2-B°, CP | C | certificado |
| decorando-penal-dls-20260827-1195 | pen-m09 | Art. 157, § 2º-A, I, CP c/c Arts. 394, § 1º, I, e 400 CPP | C | certificado-parcial |
| decorando-penal-dls-20260827-1196 | pen-m09 | Art. 157, § 2°-A, II, CP | C | certificado |
| decorando-penal-dls-20260827-1197 | pen-m09 | Art. 157, § 3º, II, CP | E | certificado |
| decorando-penal-dls-20260827-1198 | pen-m09 | Art. 157, § 3º, II, § 5º, CP | E | certificado |
| decorando-penal-dls-20260827-1199 | pen-m09 | Art. 157, § 4º, CP | C | certificado-parcial |
| decorando-penal-dls-20260827-1200 | pen-m09 | Art. 158, CP | E | certificado-parcial |
| decorando-penal-dls-20260827-1201 | pen-m09 | Art. 158, CP | C | certificado-parcial |
| decorando-penal-dls-20260827-1202 | pen-m09 | Arts. 158 e 218-C, CP | C | certificado-parcial |
| decorando-penal-dls-20260827-1203 | pen-m09 | Arts. 158, 181 e 183, I, CP | E | certificado |
| decorando-penal-dls-20260827-1204 | pen-m09 | Art. 158 c/c Art. 316, CP | C | certificado |
| decorando-penal-dls-20260827-1205 | pen-m09 | Art. 158, § 1º, CP | E | certificado |
| decorando-penal-dls-20260827-1206 | pen-m09 | Art. 158, § 1º, CP | C | certificado |
| decorando-penal-dls-20260827-1207 | pen-m09 | Art. 158, § 1º, CP | E | certificado-parcial |
| decorando-penal-dls-20260827-1208 | pen-m09 | Art. 158, §§ 1º e § 3º, CP | C | certificado-parcial |
| decorando-penal-dls-20260827-1209 | pen-m09 | Art. 158, § 4º, CP | E | certificado |
| decorando-penal-dls-20260827-1210 | pen-m09 | Art. 159, CP | C | certificado |
| decorando-penal-dls-20260827-1211 | pen-m09 | Art. 159, CP | E | certificado |
| decorando-penal-dls-20260827-1212 | pen-m09 | Art. 159, § 1º, CP | E | certificado |
| decorando-penal-dls-20260827-1213 | pen-m09 | Art. 159, § 1º, CP | E | certificado |
| decorando-penal-dls-20260827-1214 | pen-m09 | Art. 159, § 1º, CP | E | certificado |
| decorando-penal-dls-20260827-1215 | pen-m09 | Art. 159, § 2º, CP | C | certificado |
| decorando-penal-dls-20260827-1216 | pen-m09 | Art. 159, § 4º, CP | C | certificado |
| decorando-penal-dls-20260827-1217 | pen-m09 | Art. 159, § 4°, CP | E | certificado |
| decorando-penal-dls-20260827-1218 | pen-m09 | Art. 159, § 4º, CP | C | certificado-parcial |
| decorando-penal-dls-20260827-1219 | pen-m09 | Art. 159, § 4º, CP | C | certificado |
| decorando-penal-dls-20260827-1220 | pen-m09 | Art. 160, CP | C | certificado |
| decorando-penal-dls-20260827-1221 | pen-m09 | Art. 160, CP | C | certificado |
| decorando-penal-dls-20260827-1222 | pen-m09 | Art. 161, § 1º c/c Art. 288, CP | C | certificado-parcial |
| decorando-penal-dls-20260827-1223 | pen-m09 | Art. 163, III, CP | C | certificado |
| decorando-penal-dls-20260827-1224 | pen-m09 | Art. 163, IV, CP | C | certificado |
| decorando-penal-dls-20260827-1225 | pen-m09 | Arts. 163, III, IV e 167, CP | C | certificado |
| decorando-penal-dls-20260827-1226 | pen-m09 | Arts. 163, IV, e 167, CP | E | certificado |
| decorando-penal-dls-20260827-1227 | pen-m09 | Art. 163, § único, III, CP | C | certificado |
| decorando-penal-dls-20260827-1228 | pen-m09 | Arts. 164 e 167, CP | E | certificado |
| decorando-penal-dls-20260827-1229 | pen-m09 | Art. 167, CP | C | certificado |
| decorando-penal-dls-20260827-1230 | pen-m09 | Art. 168, CP | C | certificado |
| decorando-penal-dls-20260827-1231 | pen-m09 | Art. 168, CP | C | certificado |
| decorando-penal-dls-20260827-1232 | pen-m09 | Art. 168, § 1º, II, CP | C | certificado |
| decorando-penal-dls-20260827-1233 | pen-m09 | Art. 168-A, CP | C | certificado |
| decorando-penal-dls-20260827-1234 | pen-m09 | Art. 168-A, CP | E | certificado |
| decorando-penal-dls-20260827-1235 | pen-m09 | Art. 168-A, CP | C | certificado |
| decorando-penal-dls-20260827-1236 | pen-m09 | Art. 168-A, CP | C | certificado |
| decorando-penal-dls-20260827-1237 | pen-m09 | Art. 168-A, § 2º, CP | C | certificado-parcial |
| decorando-penal-dls-20260827-1238 | pen-m09 | Art. 168-A, § 3º, CP | C | certificado |
| decorando-penal-dls-20260827-1239 | pen-m09 | Art. 171, CP | E | certificado |
| decorando-penal-dls-20260827-1240 | pen-m09 | Art. 171, CP | C | certificado |
| decorando-penal-dls-20260827-1241 | pen-m09 | Art. 171, CP | C | certificado-parcial |
| decorando-penal-dls-20260827-1242 | pen-m09 | Art. 171, CP | C | certificado-parcial |
| decorando-penal-dls-20260827-1243 | pen-m09 | S. 17, STJ c/c Art. 171, CP | C | certificado |
| decorando-penal-dls-20260827-1244 | pen-m09 | Art. 171, § 2º-A, CP | C | certificado |
| decorando-penal-dls-20260827-1245 | pen-m09 | Art. 171, § 2º-A, CP | E | certificado |
| decorando-penal-dls-20260827-1246 | pen-m09 | Art. 171, § 3°, CP | C | pendente |
| decorando-penal-dls-20260827-1247 | pen-m09 | Art. 171, § 3°, CP | C | certificado-parcial |
| decorando-penal-dls-20260827-1248 | pen-m09 | Art. 171, § 4º, CP | E | certificado |
| decorando-penal-dls-20260827-1249 | pen-m09 | Art. 171, § 4º, CP | E | certificado |
| decorando-penal-dls-20260827-1250 | pen-m09 | Art. 171, § 4º, CP | C | certificado-parcial |
| decorando-penal-dls-20260827-1251 | pen-m09 | Art. 172, CP | E | certificado |
| decorando-penal-dls-20260827-1252 | pen-m09 | Art. 173, CP | C | certificado |
| decorando-penal-dls-20260827-1253 | pen-m09 | Art. 180, CP | E | certificado |
| decorando-penal-dls-20260827-1254 | pen-m09 | Art. 180, CP | E | certificado |
| decorando-penal-dls-20260827-1255 | pen-m09 | Art. 180, § 1º, CP | C | certificado |
| decorando-penal-dls-20260827-1256 | pen-m09 | Art. 180, § 1º, CP | C | certificado-parcial |
| decorando-penal-dls-20260827-1257 | pen-m09 | Art. 180, § 4º, CP | C | certificado |
| decorando-penal-dls-20260827-1258 | pen-m09 | Art. 180, § 4º, CP | C | certificado |
| decorando-penal-dls-20260827-1259 | pen-m09 | Art. 180, § 4º, CP | E | certificado |
| decorando-penal-dls-20260827-1260 | pen-m09 | Art. 180, § 6º, CP | C | certificado |
| decorando-penal-dls-20260827-1261 | pen-m09 | Art. 180-A, CP | E | certificado |
| decorando-penal-dls-20260827-1262 | pen-m09 | Art. 181, CP | C | certificado |
| decorando-penal-dls-20260827-1263 | pen-m09 | Art. 181, CP | C | certificado |
| decorando-penal-dls-20260827-1264 | pen-m09 | Art. 181, I, CP | C | certificado |
| decorando-penal-dls-20260827-1265 | pen-m09 | Art. 181, II, CP | C | certificado-parcial |
| decorando-penal-dls-20260827-1266 | pen-m09 | Art. 181, II, CP | E | certificado |
| decorando-penal-dls-20260827-1267 | pen-m09 | Arts. 181, II e 183, III, CP | C | certificado |
| decorando-penal-dls-20260827-1268 | pen-m09 | Art. 181, II c/c 183, III, CP | E | certificado |
| decorando-penal-dls-20260827-1269 | pen-m09 | Arts. 181 e 183, CP | C | certificado |
| decorando-penal-dls-20260827-1270 | pen-m09 | Art. 181 c/c 183, I, CP | E | certificado |
| decorando-penal-dls-20260827-1271 | pen-m09 | Art. 182, CP | C | certificado |
| decorando-penal-dls-20260827-1272 | pen-m09 | Art. 182, I, CP | C | certificado |
| decorando-penal-dls-20260827-1273 | pen-m09 | Art. 182, II, CP | E | certificado |
| decorando-penal-dls-20260827-1274 | pen-m09 | Art. 182, II, CP | C | certificado |
| decorando-penal-dls-20260827-1275 | pen-m09 | Arts. 182, II, e 183, III, CP | E | certificado |
| decorando-penal-dls-20260827-1276 | pen-m09 | Art. 182, III, CP | C | certificado-parcial |
| decorando-penal-dls-20260827-1277 | pen-m09 | Arts. 182, III, e 183, II, CP | E | certificado |
| decorando-penal-dls-20260827-1278 | pen-m09 | Art. 183, CP | E | certificado |
| decorando-penal-dls-20260827-1279 | pen-m09 | Art. 183, CP | C | certificado |
| decorando-penal-dls-20260827-1280 | pen-m09 | Art. 183, I, CP | E | certificado |
| decorando-penal-dls-20260827-1281 | pen-m09 | Art. 183, I, CP | E | certificado |
| decorando-penal-dls-20260827-1282 | pen-m09 | Art. 183, III, CP | E | certificado-parcial |
| decorando-penal-dls-20260827-1283 | pen-m09 | Art. 183, III, CP | C | certificado |
| decorando-pen-autoral-041 | pen-m10 | CP, art. 299 | C | certificado-parcial |
| decorando-penal-dls-20260827-1419 | pen-m10 | Art. 289, CP | C | certificado |
| decorando-penal-dls-20260827-1420 | pen-m10 | Art. 289, CP | C | certificado |
| decorando-penal-dls-20260827-1422 | pen-m10 | Art. 289, § 1º, CP | C | certificado-parcial |
| decorando-penal-dls-20260827-1423 | pen-m10 | Art. 289, § 2º, CP | C | certificado |
| decorando-penal-dls-20260827-1424 | pen-m10 | Art. 289, § 2º, CP | E | certificado |
| decorando-penal-dls-20260827-1425 | pen-m10 | Art. 289, § 3º, I, CP | E | certificado |
| decorando-penal-dls-20260827-1426 | pen-m10 | Art. 289, § 4º, CP | E | certificado |
| decorando-penal-dls-20260827-1427 | pen-m10 | Art. 289, § 4º, CP | E | certificado |
| decorando-penal-dls-20260827-1428 | pen-m10 | Art. 291, CP | C | certificado-parcial |
| decorando-penal-dls-20260827-1429 | pen-m10 | Art. 292, CP | C | certificado |
| decorando-penal-dls-20260827-1430 | pen-m10 | Art. 292, CP | E | certificado |
| decorando-penal-dls-20260827-1431 | pen-m10 | Art. 293, I, CP | C | certificado |
| decorando-penal-dls-20260827-1432 | pen-m10 | Art. 293, VI, CP | C | certificado |
| decorando-penal-dls-20260827-1433 | pen-m10 | Art. 293, IV, § 2º, CP | C | certificado |
| decorando-penal-dls-20260827-1434 | pen-m10 | Art. 293, § 1º, II, CP | C | certificado |
| decorando-penal-dls-20260827-1435 | pen-m10 | Art. 296, II, CP | C | certificado |
| decorando-penal-dls-20260827-1436 | pen-m10 | Art. 296, § 1º, CP | C | certificado-parcial |
| decorando-penal-dls-20260827-1437 | pen-m10 | Art. 296, § 1º, III, CP | C | certificado |
| decorando-penal-dls-20260827-1438 | pen-m10 | Art. 297, CP | C | certificado |
| decorando-penal-dls-20260827-1439 | pen-m10 | Art. 297, CP | C | certificado-parcial |
| decorando-penal-dls-20260827-1440 | pen-m10 | Art. 297, CP | C | certificado |
| decorando-penal-dls-20260827-1441 | pen-m10 | Art. 297, § 2°, CP | C | certificado |
| decorando-penal-dls-20260827-1442 | pen-m10 | Art. 297, § 1º, CP | E | certificado |
| decorando-penal-dls-20260827-1443 | pen-m10 | Art. 297, § 1º, CP | E | certificado |
| decorando-penal-dls-20260827-1444 | pen-m10 | Art. 297, § 1º, CP | E | certificado |
| decorando-penal-dls-20260827-1445 | pen-m10 | Art. 297, § 2º, CP | C | certificado |
| decorando-penal-dls-20260827-1446 | pen-m10 | Art. 297, § 2º, CP | E | certificado |
| decorando-penal-dls-20260827-1447 | pen-m10 | Art. 297, § 2º, CP | C | certificado |
| decorando-penal-dls-20260827-1448 | pen-m10 | Art. 297, § 2º, CP | E | certificado |
| decorando-penal-dls-20260827-1449 | pen-m10 | Art. 297, § 2º, CP | C | certificado |
| decorando-penal-dls-20260827-1450 | pen-m10 | Art. 297, § 2º, CP | E | certificado |
| decorando-penal-dls-20260827-1451 | pen-m10 | Art. 297, § 2º, CP | C | certificado |
| decorando-penal-dls-20260827-1452 | pen-m10 | Art. 297, § 2º, CP | E | certificado |
| decorando-penal-dls-20260827-1453 | pen-m10 | Art. 297, § 3º, II, CP | C | certificado-parcial |
| decorando-penal-dls-20260827-1454 | pen-m10 | Arts. 297, 298 e 299, CP | E | certificado |
| decorando-penal-dls-20260827-1455 | pen-m10 | Art. 298, CP | C | certificado-parcial |
| decorando-penal-dls-20260827-1456 | pen-m10 | Art. 298, § único, CP | C | certificado |
| decorando-penal-dls-20260827-1457 | pen-m10 | Art. 298, § único, CP | C | certificado |
| decorando-penal-dls-20260827-1458 | pen-m10 | Art. 298, § único, CP | C | pendente |
| decorando-penal-dls-20260827-1459 | pen-m10 | Art. 299, CP | E | certificado |
| decorando-penal-dls-20260827-1460 | pen-m10 | Art. 299, CP | C | certificado |
| decorando-penal-dls-20260827-1461 | pen-m10 | Art. 299, CP | C | pendente |
| decorando-penal-dls-20260827-1462 | pen-m10 | Art. 299, CP | C | certificado |
| decorando-penal-dls-20260827-1463 | pen-m10 | Art. 299, CP | C | certificado |
| decorando-penal-dls-20260827-1464 | pen-m10 | Art. 299, CP | C | certificado |
| decorando-penal-dls-20260827-1465 | pen-m10 | Art. 299, § único, CP | E | certificado |
| decorando-penal-dls-20260827-1467 | pen-m10 | Art. 299, § único, CP | C | certificado |
| decorando-penal-dls-20260827-1468 | pen-m10 | Art. 299, § único, CP | E | certificado |
| decorando-penal-dls-20260827-1469 | pen-m10 | Art. 300, CP | E | certificado |
| decorando-penal-dls-20260827-1470 | pen-m10 | Art. 300, CP | E | certificado |
| decorando-penal-dls-20260827-1471 | pen-m10 | Art. 300, CP | C | certificado |
| decorando-penal-dls-20260827-1472 | pen-m10 | Art. 300, CP | E | certificado |
| decorando-penal-dls-20260827-1473 | pen-m10 | Art. 301, CP | E | certificado |
| decorando-penal-dls-20260827-1475 | pen-m10 | Art. 301, CP | C | certificado |
| decorando-penal-dls-20260827-1477 | pen-m10 | Art. 301, § 1º, CP | E | certificado |
| decorando-penal-dls-20260827-1478 | pen-m10 | Art. 301, § 1º, CP | C | certificado |
| decorando-penal-dls-20260827-1479 | pen-m10 | Art. 302, CP | E | certificado |
| decorando-penal-dls-20260827-1480 | pen-m10 | Art. 302, CP | C | certificado |
| decorando-penal-dls-20260827-1481 | pen-m10 | Art. 302, caput e parágrafo único, CP | C | certificado |
| decorando-penal-dls-20260827-1482 | pen-m10 | Art. 304, CP | E | certificado |
| decorando-penal-dls-20260827-1483 | pen-m10 | Art. 304, CP | E | certificado |
| decorando-penal-dls-20260827-1484 | pen-m10 | Art. 305, CP | C | certificado |
| decorando-penal-dls-20260827-1485 | pen-m10 | Art. 305, CP | C | certificado |
| decorando-penal-dls-20260827-1486 | pen-m10 | Art. 306, CP | E | certificado |
| decorando-penal-dls-20260827-1487 | pen-m10 | Art. 307, CP | E | certificado |
| decorando-penal-dls-20260827-1488 | pen-m10 | Art. 307, CP | E | certificado |
| decorando-penal-dls-20260827-1489 | pen-m10 | Art. 307, CP | E | certificado |
| decorando-penal-dls-20260827-1490 | pen-m10 | Art. 307, CP, c/c S. 522, STJ | C | certificado |
| decorando-penal-dls-20260827-1491 | pen-m10 | Art. 307, CP | E | certificado |
| decorando-penal-dls-20260827-1492 | pen-m10 | Art. 307, CP | C | certificado |
| decorando-penal-dls-20260827-1493 | pen-m10 | Art. 308, CP | E | certificado |
| decorando-penal-dls-20260827-1494 | pen-m10 | Art. 311, CP | C | certificado-parcial |
| decorando-penal-dls-20260827-1495 | pen-m10 | Art. 311, § 1º, CP | E | certificado |
| decorando-penal-dls-20260827-1496 | pen-m10 | Art. 311, § 2º, CP | C | certificado |
| decorando-penal-dls-20260827-1497 | pen-m10 | Art. 311, § 2º, III, CP | C | certificado |
| decorando-penal-dls-20260827-1498 | pen-m10 | Art. 311-A, CP | E | certificado |
| decorando-penal-dls-20260827-1499 | pen-m10 | Art. 311-A, CP | C | certificado |
| decorando-penal-dls-20260827-1500 | pen-m10 | Art. 311-A, § 2º, CP | C | certificado |
| decorando-penal-dls-20260827-1501 | pen-m10 | Art. 311-A, § 3º, CP | E | certificado |
| decorando-pen-autoral-013 | pen-m11 | CP, art. 217-A, caput | C | certificado |
| decorando-pen-autoral-014 | pen-m11 | CP, art. 217-A, §§4º-A e 5º | E | certificado |
| decorando-pen-autoral-015 | pen-m11 | CP, art. 217-A, §4º | C | certificado |
| decorando-penal-dls-20260827-1305 | pen-m11 | Art. 213, CP | E | certificado |
| decorando-penal-dls-20260827-1306 | pen-m11 | Art. 213, CP | E | certificado |
| decorando-penal-dls-20260827-1307 | pen-m11 | Art. 213, CP | C | certificado |
| decorando-penal-dls-20260827-1308 | pen-m11 | Art. 213, CP | E | certificado |
| decorando-penal-dls-20260827-1309 | pen-m11 | Art. 213, CP | E | certificado |
| decorando-penal-dls-20260827-1310 | pen-m11 | Art. 213, CP | C | certificado-parcial |
| decorando-penal-dls-20260827-1311 | pen-m11 | Art. 213 c/c 226, II, CP | C | certificado |
| decorando-penal-dls-20260827-1312 | pen-m11 | Art. 213, § 1º, CP | C | certificado |
| decorando-penal-dls-20260827-1313 | pen-m11 | Art. 213, § 1º, CP | C | certificado |
| decorando-penal-dls-20260827-1314 | pen-m11 | Art. 213 c/c art. 226, II e IV, b, CP | C | certificado |
| decorando-penal-dls-20260827-1315 | pen-m11 | Art. 215, CP | C | certificado |
| decorando-penal-dls-20260827-1316 | pen-m11 | Art. 215, CP | E | certificado |
| decorando-penal-dls-20260827-1317 | pen-m11 | Art. 215-A, CP | C | certificado |
| decorando-penal-dls-20260827-1318 | pen-m11 | Art. 215-A, CP | C | certificado |
| decorando-penal-dls-20260827-1319 | pen-m11 | Art. 215-A, CP | C | certificado |
| decorando-penal-dls-20260827-1320 | pen-m11 | Art. 215-A, CP | E | certificado |
| decorando-penal-dls-20260827-1321 | pen-m11 | Art. 215-A, CP | C | certificado-parcial |
| decorando-penal-dls-20260827-1323 | pen-m11 | Art. 215-A, CP | C | certificado |
| decorando-penal-dls-20260827-1324 | pen-m11 | Art. 215-A, CP | C | certificado |
| decorando-penal-dls-20260827-1325 | pen-m11 | Art. 215-A, CP | C | certificado |
| decorando-penal-dls-20260827-1326 | pen-m11 | Art. 215-A e 233, CP | E | certificado |
| decorando-penal-dls-20260827-1327 | pen-m11 | Art. 215-A c/c Arts. 225 e 226, II, CP | C | certificado |
| decorando-penal-dls-20260827-1328 | pen-m11 | Art. 216-A. CP | C | certificado |
| decorando-penal-dls-20260827-1329 | pen-m11 | Art. 216-A, CP | C | certificado |
| decorando-penal-dls-20260827-1330 | pen-m11 | Art. 216-A, CP | E | certificado |
| decorando-penal-dls-20260827-1331 | pen-m11 | Art. 216-A, CP | C | certificado |
| decorando-penal-dls-20260827-1332 | pen-m11 | Art. 216-A, CP | C | certificado |
| decorando-penal-dls-20260827-1333 | pen-m11 | Art. 216-A, CP | C | certificado-parcial |
| decorando-penal-dls-20260827-1334 | pen-m11 | Art. 216-A, CP | C | certificado |
| decorando-penal-dls-20260827-1335 | pen-m11 | Art. 216-A, CP | C | certificado-parcial |
| decorando-penal-dls-20260827-1336 | pen-m11 | Art. 216-A, CP | C | certificado |
| decorando-penal-dls-20260827-1337 | pen-m11 | Art. 216-A, CP | C | certificado-parcial |
| decorando-penal-dls-20260827-1338 | pen-m11 | Art. 216-A, CP | E | certificado-parcial |
| decorando-penal-dls-20260827-1339 | pen-m11 | Art. 216-B, CP | E | certificado |
| decorando-penal-dls-20260827-1340 | pen-m11 | Art. 216-A, § 2º, CP | C | certificado |
| decorando-penal-dls-20260827-1341 | pen-m11 | Art. 216-B, § único, CP | C | certificado |
| decorando-penal-dls-20260827-1342 | pen-m11 | Art. 216-B, § único, CP | E | certificado |
| decorando-penal-dls-20260827-1343 | pen-m11 | Arts. 217, CP, e 5º, Lei 11.106/2005 | C | certificado-parcial |
| decorando-penal-dls-20260827-1344 | pen-m11 | Art. 217-A, CP | E | certificado |
| decorando-penal-dls-20260827-1345 | pen-m11 | Art. 217-A, CP | C | certificado |
| decorando-penal-dls-20260827-1346 | pen-m11 | Art. 217-A c/c Art. 226, II, IV, b, CP | C | certificado |
| decorando-penal-dls-20260827-1347 | pen-m11 | Art. 217-A, § 1° c/c Art. 225, CP | C | certificado |
| decorando-penal-dls-20260827-1348 | pen-m11 | Art. 217-A, § 1º, CP | C | certificado-parcial |
| decorando-penal-dls-20260827-1349 | pen-m11 | Art. 217-A, § 3º c/c Art. 226, II, CP | C | certificado |
| decorando-penal-dls-20260827-1350 | pen-m11 | Art. 217-A, § 4º, CP | C | certificado |
| decorando-penal-dls-20260827-1351 | pen-m11 | Art. 217-A, § 4º-A, CP | E | certificado |
| decorando-penal-dls-20260827-1352 | pen-m11 | Art. 218, CP | C | certificado |
| decorando-penal-dls-20260827-1353 | pen-m11 | Art. 218-A, CP | E | certificado |
| decorando-penal-dls-20260827-1354 | pen-m11 | Art. 218-A, CP | C | certificado-parcial |
| decorando-penal-dls-20260827-1355 | pen-m11 | Art. 218-B, CP | E | certificado |
| decorando-penal-dls-20260827-1356 | pen-m11 | Art. 218-B, § 2º, CP | C | certificado-parcial |
| decorando-penal-dls-20260827-1357 | pen-m11 | Art. 218-C, CP | C | certificado |
| decorando-penal-dls-20260827-1358 | pen-m11 | Art. 218-C, § 2º, CP | C | certificado-parcial |
| decorando-penal-dls-20260827-1359 | pen-m11 | Art. 218-C, § 2º, CP | C | certificado-parcial |
| decorando-penal-dls-20260827-1360 | pen-m11 | Art. 225, CP | E | certificado |
| decorando-penal-dls-20260827-1361 | pen-m11 | Art. 225, CP | E | certificado |
| decorando-penal-dls-20260827-1362 | pen-m11 | Art. 225, CP | E | certificado |
| decorando-penal-dls-20260827-1363 | pen-m11 | Art. 225, CP | C | certificado-parcial |
| decorando-penal-dls-20260827-1365 | pen-m11 | Art. 226, IV, a, CP | C | certificado |
| decorando-penal-dls-20260827-1366 | pen-m11 | Art. 226, IV, CP | E | certificado |
| decorando-penal-dls-20260827-1367 | pen-m11 | Art. 229, CP | E | certificado |
| decorando-penal-dls-20260827-1368 | pen-m11 | Art. 229, CP | E | certificado |
| decorando-penal-dls-20260827-1369 | pen-m11 | Art. 230, § 1º, CP | C | certificado |
| decorando-penal-dls-20260827-1370 | pen-m11 | Art. 234, § único, CP | C | certificado |
| decorando-pen-autoral-016 | pen-m12 | CP, art. 338-A | E | certificado |
| decorando-penal-dls-20260827-1502 | pen-m12 | Art. 312, CP | C | certificado |
| decorando-penal-dls-20260827-1503 | pen-m12 | Art. 312, CP | E | certificado |
| decorando-penal-dls-20260827-1504 | pen-m12 | Art. 312, CP | C | certificado |
| decorando-penal-dls-20260827-1505 | pen-m12 | Art. 312, CP | C | certificado |
| decorando-penal-dls-20260827-1506 | pen-m12 | Art. 312, CP | E | certificado |
| decorando-penal-dls-20260827-1507 | pen-m12 | Art. 312, CP | E | certificado |
| decorando-penal-dls-20260827-1508 | pen-m12 | Art. 312, CP | C | certificado |
| decorando-penal-dls-20260827-1509 | pen-m12 | Art. 312, CP | E | certificado |
| decorando-penal-dls-20260827-1510 | pen-m12 | Art. 312, CP | E | certificado |
| decorando-penal-dls-20260827-1511 | pen-m12 | Art. 312, CP e S. 599, STJ | C | certificado |
| decorando-penal-dls-20260827-1512 | pen-m12 | Art. 312, CP | C | certificado-parcial |
| decorando-penal-dls-20260827-1513 | pen-m12 | Art. 312, CP | C | certificado |
| decorando-penal-dls-20260827-1514 | pen-m12 | Art. 312, CP | C | certificado-parcial |
| decorando-penal-dls-20260827-1515 | pen-m12 | Art. 312, VI, CP | C | certificado |
| decorando-penal-dls-20260827-1516 | pen-m12 | Art. 312, § 1º, CP | C | certificado |
| decorando-penal-dls-20260827-1517 | pen-m12 | Art. 312, § 1º CP | C | certificado |
| decorando-penal-dls-20260827-1518 | pen-m12 | Art. 312, § 1º CP | C | certificado |
| decorando-penal-dls-20260827-1519 | pen-m12 | Art. 312, § 1º, CP | E | certificado |
| decorando-penal-dls-20260827-1520 | pen-m12 | Art. 312, § 2º, § 3º, CP | C | certificado |
| decorando-penal-dls-20260827-1521 | pen-m12 | Art. 312, § 2°, CP | E | certificado |
| decorando-penal-dls-20260827-1522 | pen-m12 | Art. 312, § 2º, CP | C | certificado-parcial |
| decorando-penal-dls-20260827-1523 | pen-m12 | Art. 312, §§ 2° e 3°, CP | E | certificado |
| decorando-penal-dls-20260827-1524 | pen-m12 | Art. 312, § 2º, § 3º, CP | C | certificado |
| decorando-penal-dls-20260827-1525 | pen-m12 | Art. 312, § 2º, § 3º, CP | C | certificado |
| decorando-penal-dls-20260827-1526 | pen-m12 | Art. 312, § 2º, § 3º, CP | C | certificado |
| decorando-penal-dls-20260827-1527 | pen-m12 | Art. 312, §§ 2º e 3º, CP | C | pendente |
| decorando-penal-dls-20260827-1528 | pen-m12 | Art. 312, § 3º CP | C | certificado |
| decorando-penal-dls-20260827-1529 | pen-m12 | Art. 312, § 3º, CP | C | certificado |
| decorando-penal-dls-20260827-1530 | pen-m12 | Art. 312, § 3º, CP | E | pendente |
| decorando-penal-dls-20260827-1531 | pen-m12 | Art. 312, § 3º, CP | E | certificado |
| decorando-penal-dls-20260827-1532 | pen-m12 | Art. 313, CP | E | certificado |
| decorando-penal-dls-20260827-1533 | pen-m12 | Art. 313-A, CP | C | certificado |
| decorando-penal-dls-20260827-1534 | pen-m12 | Art. 313-A c/c 16, CP | C | certificado |
| decorando-penal-dls-20260827-1535 | pen-m12 | Art. 313-A, CP | C | certificado |
| decorando-penal-dls-20260827-1536 | pen-m12 | Art. 313-A, CP | E | certificado |
| decorando-penal-dls-20260827-1537 | pen-m12 | Art. 313-B, CP | C | certificado |
| decorando-penal-dls-20260827-1538 | pen-m12 | Art. 314, CP | C | certificado |
| decorando-penal-dls-20260827-1539 | pen-m12 | Art. 315, CP | E | certificado |
| decorando-penal-dls-20260827-1540 | pen-m12 | Art. 316, CP | C | certificado |
| decorando-penal-dls-20260827-1541 | pen-m12 | Art. 316, CP | C | certificado |
| decorando-penal-dls-20260827-1542 | pen-m12 | Art. 316, CP | C | certificado |
| decorando-penal-dls-20260827-1543 | pen-m12 | Art. 316, CP | E | certificado |
| decorando-penal-dls-20260827-1544 | pen-m12 | Art. 316, CP | C | certificado |
| decorando-penal-dls-20260827-1545 | pen-m12 | Art. 316, CP | C | certificado |
| decorando-penal-dls-20260827-1546 | pen-m12 | Art. 316, CP | E | certificado |
| decorando-penal-dls-20260827-1547 | pen-m12 | Art. 316, CP | E | certificado |
| decorando-penal-dls-20260827-1548 | pen-m12 | Art. 316, CP | E | certificado |
| decorando-penal-dls-20260827-1549 | pen-m12 | Art. 316, CP | C | certificado |
| decorando-penal-dls-20260827-1550 | pen-m12 | Art. 316, CP | C | certificado |
| decorando-penal-dls-20260827-1551 | pen-m12 | Art. 316, CP | C | certificado |
| decorando-penal-dls-20260827-1552 | pen-m12 | Art. 316, CP | C | certificado |
| decorando-penal-dls-20260827-1553 | pen-m12 | Art. 316, CP | C | certificado |
| decorando-penal-dls-20260827-1554 | pen-m12 | Art. 316, § 1º, CP | C | certificado |
| decorando-penal-dls-20260827-1555 | pen-m12 | Art. 316, § 1º, CP | C | certificado |
| decorando-penal-dls-20260827-1556 | pen-m12 | Art. 316, § 1º, CP | E | certificado-parcial |
| decorando-penal-dls-20260827-1557 | pen-m12 | Art. 316, § 1º, CP | E | certificado |
| decorando-penal-dls-20260827-1558 | pen-m12 | Art. 316, § 1º, CP | E | certificado |
| decorando-penal-dls-20260827-1559 | pen-m12 | Art. 316, § 1º, CP | C | certificado |
| decorando-penal-dls-20260827-1560 | pen-m12 | Art. 316, § 1º, CP | C | certificado |
| decorando-penal-dls-20260827-1561 | pen-m12 | Art. 316, § 2°, CP | C | certificado |
| decorando-penal-dls-20260827-1562 | pen-m12 | Art. 316, § 2º, CP | C | certificado |
| decorando-penal-dls-20260827-1563 | pen-m12 | Art. 316, § 2º, CP | C | certificado |
| decorando-penal-dls-20260827-1564 | pen-m12 | Arts. 316 e 317, CP | E | certificado |
| decorando-penal-dls-20260827-1565 | pen-m12 | Arts. 316 e 327, CP | C | certificado-parcial |
| decorando-penal-dls-20260827-1566 | pen-m12 | Art. 317, CP | E | certificado |
| decorando-penal-dls-20260827-1567 | pen-m12 | Art. 317, CP | E | certificado |
| decorando-penal-dls-20260827-1568 | pen-m12 | Art. 317, CP | C | certificado |
| decorando-penal-dls-20260827-1569 | pen-m12 | Art. 317, CP | C | certificado |
| decorando-penal-dls-20260827-1570 | pen-m12 | Art. 317, CP | C | certificado |
| decorando-penal-dls-20260827-1571 | pen-m12 | Art. 317, CP | E | certificado |
| decorando-penal-dls-20260827-1572 | pen-m12 | Art. 317, CP | C | certificado |
| decorando-penal-dls-20260827-1573 | pen-m12 | Art. 317, CP | C | certificado |
| decorando-penal-dls-20260827-1574 | pen-m12 | Art. 317, CP | C | certificado-parcial |
| decorando-penal-dls-20260827-1575 | pen-m12 | Art. 317, CP | E | certificado |
| decorando-penal-dls-20260827-1576 | pen-m12 | Art. 317, CP | C | certificado |
| decorando-penal-dls-20260827-1577 | pen-m12 | Arts. 317 e 319, CP | C | certificado |
| decorando-penal-dls-20260827-1578 | pen-m12 | Art. 317, § 1º, CP | E | certificado |
| decorando-penal-dls-20260827-1579 | pen-m12 | Art. 317, § 2º, CP | C | certificado |
| decorando-penal-dls-20260827-1580 | pen-m12 | Art. 317, § 2º, CP | C | certificado |
| decorando-penal-dls-20260827-1581 | pen-m12 | Art. 317, § 2º, CP | E | certificado |
| decorando-penal-dls-20260827-1582 | pen-m12 | Arts. 317, § 2º e 319, CP | E | certificado |
| decorando-penal-dls-20260827-1583 | pen-m12 | Arts. 317 e 327, § 1º, CP | C | certificado |
| decorando-penal-dls-20260827-1584 | pen-m12 | Arts. 317 e 327, § 2º, CP | C | certificado |
| decorando-penal-dls-20260827-1585 | pen-m12 | Arts. 317 e 327, § 2º, CP | C | certificado |
| decorando-penal-dls-20260827-1586 | pen-m12 | Art. 317 c/c 333, CP | C | certificado |
| decorando-penal-dls-20260827-1587 | pen-m12 | Art. 318, CP | C | certificado-parcial |
| decorando-penal-dls-20260827-1588 | pen-m12 | Arts. 318 e 319, CP | E | certificado |
| decorando-penal-dls-20260827-1589 | pen-m12 | Art. 319, CP | E | certificado |
| decorando-penal-dls-20260827-1590 | pen-m12 | Art. 319, CP | C | certificado |
| decorando-penal-dls-20260827-1591 | pen-m12 | Art. 319, CP | C | certificado |
| decorando-penal-dls-20260827-1592 | pen-m12 | Art. 319, CP | C | certificado |
| decorando-penal-dls-20260827-1593 | pen-m12 | Art. 319, CP | E | certificado |
| decorando-penal-dls-20260827-1594 | pen-m12 | Art. 319, CP | C | certificado |
| decorando-penal-dls-20260827-1595 | pen-m12 | Art. 319, CP | C | certificado |
| decorando-penal-dls-20260827-1596 | pen-m12 | Art. 319-A, CP | E | certificado |
| decorando-penal-dls-20260827-1597 | pen-m12 | Art. 319-A, CP | C | certificado |
| decorando-penal-dls-20260827-1598 | pen-m12 | Art. 320, CP | C | certificado-parcial |
| decorando-penal-dls-20260827-1599 | pen-m12 | Art. 320, CP | C | certificado |
| decorando-penal-dls-20260827-1600 | pen-m12 | Art. 320, CP | C | certificado |
| decorando-penal-dls-20260827-1601 | pen-m12 | Art. 320, CP | E | certificado |
| decorando-penal-dls-20260827-1602 | pen-m12 | Art. 320, CP | C | certificado |
| decorando-penal-dls-20260827-1603 | pen-m12 | Art. 320, CP | C | certificado |
| decorando-penal-dls-20260827-1604 | pen-m12 | Art. 320, CP | E | certificado |
| decorando-penal-dls-20260827-1605 | pen-m12 | Art. 321, CP | E | certificado |
| decorando-penal-dls-20260827-1606 | pen-m12 | Art. 321, CP | C | certificado |
| decorando-penal-dls-20260827-1607 | pen-m12 | Art. 321, CP | C | certificado |
| decorando-penal-dls-20260827-1608 | pen-m12 | Art. 322, CP | C | certificado |
| decorando-penal-dls-20260827-1609 | pen-m12 | Art. 323, CP | C | certificado |
| decorando-penal-dls-20260827-1610 | pen-m12 | Art. 323, CP | E | certificado |
| decorando-penal-dls-20260827-1611 | pen-m12 | Art 324, CP | E | certificado |
| decorando-penal-dls-20260827-1612 | pen-m12 | Art. 325, CP | C | certificado |
| decorando-penal-dls-20260827-1613 | pen-m12 | Art. 325, caput e § 1º, I, CP | C | certificado |
| decorando-penal-dls-20260827-1614 | pen-m12 | Art. 325, CP | E | certificado |
| decorando-penal-dls-20260827-1615 | pen-m12 | Art. 325, § 1º, II, CP | C | certificado |
| decorando-penal-dls-20260827-1616 | pen-m12 | Art. 327, CP | C | certificado |
| decorando-penal-dls-20260827-1617 | pen-m12 | Art. 327, CP | E | certificado |
| decorando-penal-dls-20260827-1618 | pen-m12 | Art. 327, CP | E | certificado |
| decorando-penal-dls-20260827-1619 | pen-m12 | Art. 327, CP | E | certificado-parcial |
| decorando-penal-dls-20260827-1620 | pen-m12 | Art. 327, § 1º, CP | C | certificado |
| decorando-penal-dls-20260827-1621 | pen-m12 | Art. 327, § 1º, CP | C | certificado |
| decorando-penal-dls-20260827-1622 | pen-m12 | Art. 327, § 1º, CP | E | certificado |
| decorando-penal-dls-20260827-1623 | pen-m12 | Art. 327, § 1º, CP | C | certificado |
| decorando-penal-dls-20260827-1624 | pen-m12 | Art. 327, § 1°, CP | C | certificado-parcial |
| decorando-penal-dls-20260827-1625 | pen-m12 | Art. 327, § 1º, CP | C | certificado-parcial |
| decorando-penal-dls-20260827-1626 | pen-m12 | Art. 327, § 2º, CP | E | certificado |
| decorando-penal-dls-20260827-1627 | pen-m12 | Art. 327, § 2º, CP | E | pendente |
| decorando-penal-dls-20260827-1628 | pen-m12 | Art. 329, CP | C | certificado |
| decorando-penal-dls-20260827-1629 | pen-m12 | Art. 329, CP | E | certificado |
| decorando-penal-dls-20260827-1630 | pen-m12 | Art. 329, CP | E | certificado |
| decorando-penal-dls-20260827-1631 | pen-m12 | Art. 329, CP | E | certificado |
| decorando-penal-dls-20260827-1632 | pen-m12 | Art. 329, § 1º, CP | C | certificado |
| decorando-penal-dls-20260827-1633 | pen-m12 | Art. 329, § 1º, CP | E | certificado |
| decorando-penal-dls-20260827-1634 | pen-m12 | Art. 329, § 2º, CP | C | certificado |
| decorando-penal-dls-20260827-1635 | pen-m12 | Art. 330, CP | C | certificado |
| decorando-penal-dls-20260827-1636 | pen-m12 | Art. 330, CP | E | certificado |
| decorando-penal-dls-20260827-1637 | pen-m12 | Art. 330, CP | C | pendente |
| decorando-penal-dls-20260827-1638 | pen-m12 | Art. 331 c/c Art. 28, I, CP | C | certificado |
| decorando-penal-dls-20260827-1639 | pen-m12 | Art. 332, CP | C | certificado |
| decorando-penal-dls-20260827-1640 | pen-m12 | Art. 332, CP | C | pendente |
| decorando-penal-dls-20260827-1641 | pen-m12 | Art. 332, CP | C | certificado |
| decorando-penal-dls-20260827-1642 | pen-m12 | Art. 332, CP | C | certificado |
| decorando-penal-dls-20260827-1643 | pen-m12 | Art. 332, CP | C | certificado |
| decorando-penal-dls-20260827-1644 | pen-m12 | Art. 332, CP | E | certificado |
| decorando-penal-dls-20260827-1645 | pen-m12 | Art. 332, caput c/c parágrafo único, CP | C | certificado |
| decorando-penal-dls-20260827-1646 | pen-m12 | Art. 332, § único, CP | C | certificado |
| decorando-penal-dls-20260827-1647 | pen-m12 | Art. 333, CP | E | certificado |
| decorando-penal-dls-20260827-1648 | pen-m12 | Art. 333, CP | C | certificado |
| decorando-penal-dls-20260827-1649 | pen-m12 | Art. 333, CP | C | certificado |
| decorando-penal-dls-20260827-1650 | pen-m12 | Art. 333, CP | C | certificado |
| decorando-penal-dls-20260827-1651 | pen-m12 | Art. 333, CP | C | certificado |
| decorando-penal-dls-20260827-1652 | pen-m12 | Art. 333, CP | C | certificado-parcial |
| decorando-penal-dls-20260827-1653 | pen-m12 | Art. 333, CP | C | certificado-parcial |
| decorando-penal-dls-20260827-1654 | pen-m12 | Art. 333, CP | C | certificado |
| decorando-penal-dls-20260827-1655 | pen-m12 | Art. 333, CP | E | certificado-parcial |
| decorando-penal-dls-20260827-1656 | pen-m12 | Art. 333, CP | E | certificado |
| decorando-penal-dls-20260827-1657 | pen-m12 | Arts. 333, 334, 334-A, CP | E | certificado |
| decorando-penal-dls-20260827-1658 | pen-m12 | Art. 334, CP | C | certificado |
| decorando-penal-dls-20260827-1659 | pen-m12 | Art. 334, § 1º, I, CP | C | pendente |
| decorando-penal-dls-20260827-1660 | pen-m12 | Art. 334-A, § 3º, CP | C | certificado |
| decorando-penal-dls-20260827-1661 | pen-m12 | Art. 335, § único, CP | C | certificado |
| decorando-penal-dls-20260827-1662 | pen-m12 | Art. 336, CP | E | certificado |
| decorando-penal-dls-20260827-1663 | pen-m12 | Art. 337, CP | C | certificado |
| decorando-penal-dls-20260827-1664 | pen-m12 | Art. 337-A, § 2º, II, CP | E | certificado |
| decorando-penal-dls-20260827-1665 | pen-m12 | Art. 337-D, CP | E | certificado |
| decorando-penal-dls-20260827-1685 | pen-m12 | Art. 338, CP | C | certificado |
| decorando-penal-dls-20260827-1686 | pen-m12 | Art. 338, CP | C | certificado |
| decorando-penal-dls-20260827-1687 | pen-m12 | Art. 338, CP | C | certificado-parcial |
| decorando-penal-dls-20260827-1688 | pen-m12 | Art. 338-A, § 1º CP | E | certificado |
| decorando-penal-dls-20260827-1689 | pen-m12 | Art. 338-A, CP | C | certificado |
| decorando-penal-dls-20260827-1690 | pen-m12 | Art. 338-A, § 2º CP | C | certificado |
| decorando-penal-dls-20260827-1691 | pen-m12 | Art. 339, CP | C | certificado |
| decorando-penal-dls-20260827-1692 | pen-m12 | Arts. 339, CP | C | certificado |
| decorando-penal-dls-20260827-1693 | pen-m12 | Art. 339, CP | C | certificado |
| decorando-penal-dls-20260827-1694 | pen-m12 | Art. 339, CP | C | certificado |
| decorando-penal-dls-20260827-1695 | pen-m12 | Art. 339, § 1º, CP | C | certificado |
| decorando-penal-dls-20260827-1696 | pen-m12 | Art. 339, § 1º, CP | C | certificado |
| decorando-penal-dls-20260827-1697 | pen-m12 | Art. 339, § 2º, CP | C | certificado |
| decorando-penal-dls-20260827-1698 | pen-m12 | Art. 339, § 2º, CP | E | certificado |
| decorando-penal-dls-20260827-1699 | pen-m12 | Art. 340, CP | C | certificado |
| decorando-penal-dls-20260827-1700 | pen-m12 | Art. 340, CP | C | certificado |
| decorando-penal-dls-20260827-1701 | pen-m12 | Art. 341, CP | C | certificado |
| decorando-penal-dls-20260827-1702 | pen-m12 | Art. 341, CP | E | certificado |
| decorando-penal-dls-20260827-1703 | pen-m12 | Art. 342, CP | E | certificado |
| decorando-penal-dls-20260827-1704 | pen-m12 | Art. 342, CP | C | certificado |
| decorando-penal-dls-20260827-1705 | pen-m12 | Art. 342, CP | E | certificado |
| decorando-penal-dls-20260827-1706 | pen-m12 | Art. 342, CP | C | certificado |
| decorando-penal-dls-20260827-1707 | pen-m12 | Art. 342, CP | C | certificado |
| decorando-penal-dls-20260827-1708 | pen-m12 | Art. 342, §2º, CP | C | certificado |
| decorando-penal-dls-20260827-1709 | pen-m12 | Art. 342, § 2º, CP | C | certificado |
| decorando-penal-dls-20260827-1711 | pen-m12 | Art. 342, CP | E | certificado |
| decorando-penal-dls-20260827-1712 | pen-m12 | Art. 344, CP | E | certificado |
| decorando-penal-dls-20260827-1713 | pen-m12 | Art. 344, CP | C | certificado |
| decorando-penal-dls-20260827-1714 | pen-m12 | Art. 344, CP | C | certificado |
| decorando-penal-dls-20260827-1715 | pen-m12 | Art. 344, § único, CP | C | certificado |
| decorando-penal-dls-20260827-1716 | pen-m12 | Art. 344, § único c/c Art. 342, § 1º, CP | E | certificado |
| decorando-penal-dls-20260827-1717 | pen-m12 | Art. 345, CP | C | certificado |
| decorando-penal-dls-20260827-1718 | pen-m12 | Art. 345, § único, CP | E | certificado |
| decorando-penal-dls-20260827-1719 | pen-m12 | Art. 345, § único, CP | C | certificado |
| decorando-penal-dls-20260827-1720 | pen-m12 | Art. 347, CP | C | certificado |
| decorando-penal-dls-20260827-1721 | pen-m12 | Art. 347, CP | C | certificado |
| decorando-penal-dls-20260827-1722 | pen-m12 | Art. 348, § 2º, CP | C | certificado |
| decorando-penal-dls-20260827-1723 | pen-m12 | Art. 349, CP | E | certificado |
| decorando-penal-dls-20260827-1724 | pen-m12 | Art. 351, CP | E | certificado |
| decorando-penal-dls-20260827-1725 | pen-m12 | Art. 351, § 2º, CP | C | certificado |
| decorando-penal-dls-20260827-1726 | pen-m12 | Art. 351, § 2º, CP | C | certificado |
| decorando-penal-dls-20260827-1727 | pen-m12 | Art. 355, CP | C | certificado |
| decorando-penal-dls-20260827-1728 | pen-m12 | Art. 357, CP | E | certificado |
| decorando-penal-dls-20260827-1729 | pen-m12 | Art. 357, CP | E | certificado |
| decorando-penal-dls-20260827-1730 | pen-m12 | Art. 357, CP | C | certificado-parcial |
| decorando-penal-dls-20260827-1731 | pen-m12 | Art. 357, CP | E | certificado |
| decorando-penal-dls-20260827-1732 | pen-m12 | Art. 357, § único, CP | C | certificado |
| decorando-penal-dls-20260827-1733 | pen-m12 | Art. 359, CP | C | certificado |
| decorando-penal-dls-20260827-1737 | pen-m12 | Art. 359-K, § 2º, CP | C | certificado |
| decorando-penal-dls-20260827-1738 | pen-m12 | Art. 359-M-B, CP | C | certificado |
| decorando-penal-dls-20260827-1739 | pen-m12 | Art. 359-N, CP | C | certificado |
| decorando-penal-dls-20260827-1740 | pen-m12 | Art. 359-P, CP | C | certificado |
| decorando-penal-dls-20260827-1741 | pen-m12 | Art. 337-B, § único, CP | C | certificado |
| decorando-penal-dls-20260827-1742 | pen-m12 | Art. 328, CP | C | certificado |
| decorando-penal-dls-20260827-1745 | pen-m12 | Art. 319, CP c/c AgRg nos EDcl no AREsp 2.693.820-SP - Direito Penal | C | certificado-parcial |
| decorando-pen-autoral-017 | pen-m13 | Lei 13.869/2019, art. 1º, §1º | C | certificado |
| decorando-pen-autoral-018 | pen-m13 | Lei 13.869/2019, art. 1º, §2º | E | certificado |
| decorando-pen-autoral-019 | pen-m14 | Lei 9.613/1998, art. 1º | C | certificado |
| decorando-pen-autoral-020 | pen-m14 | Lei 9.613/1998, art. 2º | E | certificado |
| decorando-pen-autoral-021 | pen-m14 | Lei 9.613/1998, arts. 4º-A e 7º, com Lei 15.358/2026 | C | certificado |
| decorando-pen-autoral-022 | pen-m15 | CF, art. 5º, XL | E | certificado |
| decorando-pen-autoral-023 | pen-m15 | CF, art. 5º, XLV | C | certificado |
| decorando-pen-autoral-024 | pen-m15 | CF, art. 5º, XLVII | E | certificado |
| decorando-pen-autoral-025 | pen-m15 | STJ, Súmula 444 | C | pendente |
| decorando-pen-autoral-026 | pen-m15 | STJ, Súmula 231 | E | certificado |
| decorando-pen-autoral-027 | pen-m16 | CP, art. 337-E | C | certificado |
| decorando-pen-autoral-028 | pen-m16 | CP, art. 337-F | E | certificado |
| decorando-pen-autoral-029 | pen-m16 | CP, art. 337-L | C | certificado |
| decorando-pen-autoral-030 | pen-m16 | CP, art. 337-P | E | certificado |
| decorando-penal-dls-20260827-1666 | pen-m16 | Art. 337-E, CP | C | certificado |
| decorando-penal-dls-20260827-1667 | pen-m16 | Art. 337-E, CP | E | certificado |
| decorando-penal-dls-20260827-1668 | pen-m16 | Art. 337–G, CP | E | certificado |
| decorando-penal-dls-20260827-1669 | pen-m16 | Art. 337–I, CP | E | certificado |
| decorando-penal-dls-20260827-1670 | pen-m16 | Art. 337-J, CP c/c 89, Lei 9.099/95 | C | certificado |
| decorando-penal-dls-20260827-1671 | pen-m16 | Art. 337-J, CP | C | certificado |
| decorando-penal-dls-20260827-1672 | pen-m16 | Art. 337-L, CP | C | certificado |
| decorando-penal-dls-20260827-1673 | pen-m16 | Art. 337-L, CP | E | certificado |
| decorando-penal-dls-20260827-1674 | pen-m16 | Art. 337-L, Lei 14.133/2021 | C | certificado |
| decorando-penal-dls-20260827-1675 | pen-m16 | Art. 337-L, III, CP | C | certificado |
| decorando-penal-dls-20260827-1676 | pen-m16 | Art. 337-M, CP | C | certificado |
| decorando-penal-dls-20260827-1677 | pen-m16 | Art. 337–M, § 1º, CP | C | certificado |
| decorando-penal-dls-20260827-1678 | pen-m16 | Art. 337-M, § 2º, CP | E | certificado |
| decorando-penal-dls-20260827-1679 | pen-m16 | Art. 337-M, § 2º, CP | C | certificado |
| decorando-penal-dls-20260827-1680 | pen-m16 | Art. 337-M, § 1º e § 2º, CP | E | certificado |
| decorando-penal-dls-20260827-1681 | pen-m16 | Art. 337-N, CP | C | certificado |
| decorando-penal-dls-20260827-1682 | pen-m16 | Art. 337-N, CP | C | pendente |
| decorando-penal-dls-20260827-1683 | pen-m16 | Art. 337-P, CP | C | certificado |
| decorando-penal-dls-20260827-1684 | pen-m16 | Art. 337–P, CP | E | certificado |
| decorando-pen-autoral-031 | pen-m17 | LC 101/2000, art. 1º, §1º | C | certificado |
| decorando-pen-autoral-032 | pen-m17 | LC 101/2000, art. 42 | E | certificado |
| decorando-pen-autoral-033 | pen-m17 | Lei 1.079/1950 | C | certificado-parcial |
| decorando-pen-autoral-034 | pen-m17 | CP, art. 359-A | E | certificado |
| decorando-pen-autoral-035 | pen-m17 | CP, art. 359-D | C | certificado |
| decorando-pen-autoral-036 | pen-m17 | Lei 10.028/2000 | E | certificado |
| decorando-penal-dls-20260827-1734 | pen-m17 | Art. 359-C, CP | C | certificado |
| decorando-penal-dls-20260827-1735 | pen-m17 | Art. 359-C, CP | E | certificado-parcial |
| decorando-penal-dls-20260827-1736 | pen-m17 | Art. 359-H, CP | C | certificado |
| decorando-penal-dls-20260827-0172 | pen-m18 | Art. 13, CP | E | certificado |
| decorando-penal-dls-20260827-0173 | pen-m18 | Art. 13, CP | C | certificado |
| decorando-penal-dls-20260827-0174 | pen-m18 | Art. 13, CP | C | certificado |
| decorando-penal-dls-20260827-0175 | pen-m18 | Art. 13, CP | E | certificado |
| decorando-penal-dls-20260827-0176 | pen-m18 | Art. 13, § 1º, CP | E | certificado |
| decorando-penal-dls-20260827-0177 | pen-m18 | Art. 13, § 1º, CP | C | certificado-parcial |
| decorando-penal-dls-20260827-0178 | pen-m18 | Art. 13, § 1º, CP | E | certificado |
| decorando-penal-dls-20260827-0179 | pen-m18 | Art. 13, § 1º, CP | E | certificado |
| decorando-penal-dls-20260827-0180 | pen-m18 | Art. 13, § 1º, CP | E | certificado |
| decorando-penal-dls-20260827-0181 | pen-m18 | Art. 13, § 1º, CP | E | certificado |
| decorando-penal-dls-20260827-0182 | pen-m18 | Art. 13, § 1º, CP | C | certificado |
| decorando-penal-dls-20260827-0183 | pen-m18 | Art. 13, § 1º, CP | C | certificado-parcial |
| decorando-penal-dls-20260827-0184 | pen-m18 | Art. 13, § 1º, CP | C | certificado-parcial |
| decorando-penal-dls-20260827-0185 | pen-m18 | Art. 13, § 1º, CP | C | certificado-parcial |
| decorando-penal-dls-20260827-0186 | pen-m18 | Art. 13, § 1º, CP | C | certificado |
| decorando-penal-dls-20260827-0187 | pen-m18 | Art. 13, § 1º, CP | E | certificado |
| decorando-penal-dls-20260827-0188 | pen-m18 | Art. 13, § 2º, a, b, c, CP | C | certificado |
| decorando-penal-dls-20260827-0189 | pen-m18 | Art. 13, § 2º, “c”, CP | E | certificado |
| decorando-penal-dls-20260827-0190 | pen-m18 | Art. 13, § 2º, CP | C | certificado |
| decorando-penal-dls-20260827-0191 | pen-m18 | Art. 13, § 2º, CP | E | certificado-parcial |
| decorando-penal-dls-20260827-0192 | pen-m18 | Art. 13, § 2º, CP | E | certificado |
| decorando-penal-dls-20260827-0193 | pen-m18 | Art. 13, § 2º, CP | E | certificado |
| decorando-penal-dls-20260827-0194 | pen-m18 | Art. 13, § 2º, CP | C | certificado |
| decorando-penal-dls-20260827-0195 | pen-m18 | Art. 13, § 2º, CP | C | certificado |
| decorando-penal-dls-20260827-0197 | pen-m18 | Art. 13, § 2º, a, CP | C | certificado |
| decorando-penal-dls-20260827-0198 | pen-m18 | Art. 13, § 2º, "b", CP | C | certificado |
| decorando-penal-dls-20260827-0199 | pen-m18 | Art. 14, CP | C | certificado |
| decorando-penal-dls-20260827-0200 | pen-m18 | Art. 14, CP | E | certificado |
| decorando-penal-dls-20260827-0201 | pen-m18 | Art. 14, I, CP | C | certificado |
| decorando-penal-dls-20260827-0202 | pen-m18 | Art. 14, I, CP | E | certificado |
| decorando-penal-dls-20260827-0203 | pen-m18 | Art. 14, I, CP | C | certificado |
| decorando-penal-dls-20260827-0204 | pen-m18 | Art. 14, I, CP | C | certificado |
| decorando-penal-dls-20260827-0205 | pen-m18 | Art. 14, I, II, CP | C | certificado |
| decorando-penal-dls-20260827-0206 | pen-m18 | Art. 14, II, CP | E | certificado |
| decorando-penal-dls-20260827-0207 | pen-m18 | Art. 14, II, CP | E | certificado |
| decorando-penal-dls-20260827-0208 | pen-m18 | Art. 14, II, CP | E | certificado |
| decorando-penal-dls-20260827-0209 | pen-m18 | Art. 14, II, CP | C | certificado |
| decorando-penal-dls-20260827-0210 | pen-m18 | Art. 14, II, CP | E | certificado |
| decorando-penal-dls-20260827-0211 | pen-m18 | Art. 14, § único, CP | C | certificado |
| decorando-penal-dls-20260827-0212 | pen-m18 | Art. 14, § único, CP | E | certificado |
| decorando-penal-dls-20260827-0213 | pen-m18 | Art. 14, § único, CP | E | certificado |
| decorando-penal-dls-20260827-0214 | pen-m18 | Art. 14, § único, CP | E | certificado |
| decorando-penal-dls-20260827-0215 | pen-m18 | Art. 14, § único, CP | C | certificado |
| decorando-penal-dls-20260827-0217 | pen-m18 | Art. 14, § único, CP | E | certificado |
| decorando-penal-dls-20260827-0218 | pen-m18 | Art. 14, § único, CP) | C | certificado |
| decorando-penal-dls-20260827-0219 | pen-m18 | Art. 15, CP | C | certificado |
| decorando-penal-dls-20260827-0220 | pen-m18 | Art. 15, CP | E | certificado |
| decorando-penal-dls-20260827-0221 | pen-m18 | Art. 15, CP | E | certificado |
| decorando-penal-dls-20260827-0222 | pen-m18 | Art. 15, CP | E | certificado |
| decorando-penal-dls-20260827-0223 | pen-m18 | Art. 15, CP | C | certificado-parcial |
| decorando-penal-dls-20260827-0224 | pen-m18 | Art. 15, CP | E | certificado |
| decorando-penal-dls-20260827-0225 | pen-m18 | Art. 15, CP | C | certificado-parcial |
| decorando-penal-dls-20260827-0226 | pen-m18 | Art. 15, CP | C | certificado |
| decorando-penal-dls-20260827-0227 | pen-m18 | Art. 15, CP | E | certificado |
| decorando-penal-dls-20260827-0228 | pen-m18 | Art. 15, CP | C | certificado |
| decorando-penal-dls-20260827-0229 | pen-m18 | Art. 15, CP | C | certificado |
| decorando-penal-dls-20260827-0230 | pen-m18 | Art. 15, CP | C | certificado |
| decorando-penal-dls-20260827-0231 | pen-m18 | Art. 15, CP | C | certificado |
| decorando-penal-dls-20260827-0232 | pen-m18 | Art. 15, CP | E | certificado |
| decorando-penal-dls-20260827-0233 | pen-m18 | Art. 15, CP | C | certificado |
| decorando-penal-dls-20260827-0234 | pen-m18 | Art. 15, CP | E | certificado |
| decorando-penal-dls-20260827-0235 | pen-m18 | Art. 15, CP | E | certificado |
| decorando-penal-dls-20260827-0236 | pen-m18 | Art. 15, CP | C | certificado |
| decorando-penal-dls-20260827-0237 | pen-m18 | Art. 15, CP | C | certificado |
| decorando-penal-dls-20260827-0238 | pen-m18 | Art. 15, CP | C | certificado |
| decorando-penal-dls-20260827-0239 | pen-m18 | Art. 15, CP | E | certificado |
| decorando-penal-dls-20260827-0240 | pen-m18 | Art. 15, CP | E | certificado |
| decorando-penal-dls-20260827-0241 | pen-m18 | Art. 15, CP | C | certificado |
| decorando-penal-dls-20260827-0242 | pen-m18 | Art. 15, CP | E | certificado |
| decorando-penal-dls-20260827-0243 | pen-m18 | Art. 15, CP | E | certificado |
| decorando-penal-dls-20260827-0244 | pen-m18 | Art. 15, CP | C | certificado |
| decorando-penal-dls-20260827-0245 | pen-m18 | Art. 15, CP | E | certificado |
| decorando-penal-dls-20260827-0246 | pen-m18 | Art. 15 c/c Art. 129, § 1º, II, CP | C | certificado |
| decorando-penal-dls-20260827-0247 | pen-m18 | Art. 16, CP | E | certificado |
| decorando-penal-dls-20260827-0248 | pen-m18 | Art. 16, CP | C | certificado |
| decorando-penal-dls-20260827-0249 | pen-m18 | Art. 16, CP | C | certificado |
| decorando-penal-dls-20260827-0250 | pen-m18 | Art. 16, CP | E | certificado |
| decorando-penal-dls-20260827-0251 | pen-m18 | Art. 16, CP | C | certificado |
| decorando-penal-dls-20260827-0252 | pen-m18 | Art. 16, CP | E | certificado |
| decorando-penal-dls-20260827-0253 | pen-m18 | Arts. 16, CP | E | pendente |
| decorando-penal-dls-20260827-0254 | pen-m18 | Art. 16, CP | C | certificado |
| decorando-penal-dls-20260827-0255 | pen-m18 | Art. 16, CP | E | certificado |
| decorando-penal-dls-20260827-0256 | pen-m18 | Art. 16, CP | C | certificado |
| decorando-penal-dls-20260827-0257 | pen-m18 | Art. 16, CP | E | certificado |
| decorando-penal-dls-20260827-0258 | pen-m18 | Art. 16, CP | E | certificado |
| decorando-penal-dls-20260827-0259 | pen-m18 | Art. 16, CP | E | certificado |
| decorando-penal-dls-20260827-0260 | pen-m18 | Art. 16, CP | E | certificado |
| decorando-penal-dls-20260827-0261 | pen-m18 | Art. 16, CP | C | certificado |
| decorando-penal-dls-20260827-0262 | pen-m18 | Art. 16, CP | E | certificado |
| decorando-penal-dls-20260827-0263 | pen-m18 | Art. 16, CP | E | certificado |
| decorando-penal-dls-20260827-0264 | pen-m18 | Art. 16, CP | E | certificado |
| decorando-penal-dls-20260827-0265 | pen-m18 | Art. 16, CP | E | certificado |
| decorando-penal-dls-20260827-0266 | pen-m18 | Art. 16, CP | E | certificado |
| decorando-penal-dls-20260827-0267 | pen-m18 | Art. 16, CP | E | certificado |
| decorando-penal-dls-20260827-0268 | pen-m18 | Art. 16, CP | E | certificado |
| decorando-penal-dls-20260827-0269 | pen-m18 | Art. 16, CP | E | certificado |
| decorando-penal-dls-20260827-0270 | pen-m18 | Art. 16, CP | C | certificado |
| decorando-penal-dls-20260827-0271 | pen-m18 | Art. 16, CP | E | certificado |
| decorando-penal-dls-20260827-0272 | pen-m18 | Art. 16, CP | E | certificado |
| decorando-penal-dls-20260827-0273 | pen-m18 | Art. 16, CP | E | certificado |
| decorando-penal-dls-20260827-0274 | pen-m18 | Art. 16, CP | E | certificado-parcial |
| decorando-penal-dls-20260827-0275 | pen-m18 | Art. 16, CP | E | certificado-parcial |
| decorando-penal-dls-20260827-0276 | pen-m18 | Art. 16, c/c 65, III, CP | C | certificado |
| decorando-penal-dls-20260827-0277 | pen-m18 | Arts, 16 e 30, CP | C | certificado-parcial |
| decorando-penal-dls-20260827-0278 | pen-m18 | Art. 16 c/c Art. 312, CP | C | certificado-parcial |
| decorando-penal-dls-20260827-0279 | pen-m18 | Art. 17, CP | E | certificado |
| decorando-penal-dls-20260827-0280 | pen-m18 | Art. 17, CP | E | certificado |
| decorando-penal-dls-20260827-0281 | pen-m18 | Art. 17, CP | E | certificado |
| decorando-penal-dls-20260827-0282 | pen-m18 | Art. 17, CP | E | certificado |
| decorando-penal-dls-20260827-0283 | pen-m18 | Art. 17, CP | C | certificado-parcial |
| decorando-penal-dls-20260827-0284 | pen-m18 | Art. 17, CP | C | certificado |
| decorando-penal-dls-20260827-0285 | pen-m18 | Art. 17, CP | E | certificado-parcial |
| decorando-penal-dls-20260827-0286 | pen-m18 | Art. 17, CP | C | certificado |
| decorando-penal-dls-20260827-0287 | pen-m18 | Art. 17, CP | E | certificado |
| decorando-penal-dls-20260827-0288 | pen-m18 | Art. 17, CP | C | certificado |
| decorando-penal-dls-20260827-0289 | pen-m18 | Art. 17, CP | C | certificado |
| decorando-penal-dls-20260827-0290 | pen-m18 | Art. 17, CP | C | certificado |
| decorando-penal-dls-20260827-0291 | pen-m18 | Art. 17, CP | E | certificado |
| decorando-penal-dls-20260827-0292 | pen-m18 | Art. 17, CP | C | certificado |
| decorando-penal-dls-20260827-0293 | pen-m18 | Art. 18, CP | E | certificado |
| decorando-penal-dls-20260827-0294 | pen-m18 | Art. 18, I, CP | C | certificado |
| decorando-penal-dls-20260827-0295 | pen-m18 | Art. 18, CP | E | certificado |
| decorando-penal-dls-20260827-0296 | pen-m18 | Art. 18, I, CP | C | certificado |
| decorando-penal-dls-20260827-0297 | pen-m18 | Art. 18, I c/c Art. 121, § 3º, CP | C | certificado-parcial |
| decorando-penal-dls-20260827-0298 | pen-m18 | Art. 18, § único, CP | C | certificado |
| decorando-penal-dls-20260827-0299 | pen-m18 | Art. 18, § único, CP | C | certificado |
| decorando-penal-dls-20260827-0300 | pen-m18 | Art. 19, CP | E | certificado |
| decorando-penal-dls-20260827-0301 | pen-m18 | Art. 19, CP | E | certificado |
| decorando-penal-dls-20260827-0302 | pen-m18 | Art. 19, CP | C | certificado |
| decorando-penal-dls-20260827-0303 | pen-m18 | Art. 19, CP | E | certificado |
| decorando-penal-dls-20260827-0304 | pen-m18 | Art. 19, CP | C | certificado |
| decorando-penal-dls-20260827-0992 | pen-m18 | Arts. 18, II e 121, § 3º, CP | C | certificado-parcial |
| decorando-penal-dls-20260827-1284 | pen-m20 | Art. 197, I, CP | C | certificado |
| decorando-penal-dls-20260827-1285 | pen-m20 | Art. 197, II, CP | C | certificado |
| decorando-penal-dls-20260827-1286 | pen-m20 | Art. 197, II, CP | C | certificado |
| decorando-penal-dls-20260827-1287 | pen-m20 | Arts. 197 e 199, CP | E | certificado |
| decorando-penal-dls-20260827-1288 | pen-m20 | Art. 199, CP | E | certificado |
| decorando-penal-dls-20260827-1289 | pen-m20 | Art. 199, CP | C | certificado |
| decorando-penal-dls-20260827-1290 | pen-m20 | Art. 200, CP | C | certificado |
| decorando-penal-dls-20260827-1291 | pen-m20 | Art. 201, CP | C | certificado |
| decorando-penal-dls-20260827-1292 | pen-m20 | Art. 202, CP | E | certificado |
| decorando-penal-dls-20260827-1293 | pen-m20 | Art. 203, § 2º, CP | C | certificado |
| decorando-penal-dls-20260827-1294 | pen-m20 | Art. 203, CP | E | certificado |
| decorando-penal-dls-20260827-1295 | pen-m20 | Art. 203, CP | E | certificado |
| decorando-penal-dls-20260827-1296 | pen-m20 | Art. 203, CP | E | certificado |
| decorando-penal-dls-20260827-1297 | pen-m20 | Art. 204, CP | C | certificado |
| decorando-penal-dls-20260827-1298 | pen-m20 | Art. 205, CP | C | certificado |
| decorando-penal-dls-20260827-1299 | pen-m20 | Arts. 206 e 207, § 2º, CP | E | certificado |
| decorando-penal-dls-20260827-1300 | pen-m20 | Art. 206, CP | E | certificado |
| decorando-penal-dls-20260827-1301 | pen-m20 | Art. 207, § 1º, CP | C | certificado |
| decorando-penal-dls-20260827-1302 | pen-m21 | Art. 208, CP | E | certificado |
| decorando-penal-dls-20260827-1303 | pen-m21 | Art. 212, CP | E | certificado |
| decorando-penal-dls-20260827-1304 | pen-m21 | Art. 212, CP | C | certificado |
| decorando-penal-dls-20260827-1371 | pen-m22 | Art. 235, CP | E | certificado |
| decorando-penal-dls-20260827-1372 | pen-m22 | Art. 235, § 2º, CP | C | certificado |
| decorando-penal-dls-20260827-1373 | pen-m22 | Art. 236, parágrafo único, CP | E | certificado |
| decorando-penal-dls-20260827-1374 | pen-m22 | Art. 241, CP | E | certificado |
| decorando-penal-dls-20260827-1375 | pen-m22 | Art. 242, CP | E | certificado |
| decorando-penal-dls-20260827-1376 | pen-m22 | Art. 244, CP | E | certificado |
| decorando-penal-dls-20260827-1377 | pen-m22 | Art. 244, CP | C | pendente |
| decorando-penal-dls-20260827-1378 | pen-m22 | Art. 249, § 1º, CP | E | certificado |
| decorando-penal-dls-20260827-1379 | pen-m22 | Art. 249, § 1º, CP | E | certificado |
| decorando-penal-dls-20260827-1380 | pen-m23 | Art. 250, CP | E | certificado |
| decorando-penal-dls-20260827-1381 | pen-m23 | Art. 250 c/c 258, CP | C | certificado |
| decorando-penal-dls-20260827-1382 | pen-m23 | Art. 250, § 1º, I, CP | E | certificado |
| decorando-penal-dls-20260827-1383 | pen-m23 | Art. 250, § 1º, II, CP | C | certificado |
| decorando-penal-dls-20260827-1384 | pen-m23 | Art. 250, § 1º, II, b, CP | C | certificado |
| decorando-penal-dls-20260827-1385 | pen-m23 | Arts. 255 e 260, § 2º, CP | E | certificado |
| decorando-penal-dls-20260827-1386 | pen-m23 | Art. 256, CP | C | certificado |
| decorando-penal-dls-20260827-1387 | pen-m23 | Art. 258, CP | E | certificado |
| decorando-penal-dls-20260827-1388 | pen-m23 | Art 266, § 2º, CP | C | certificado |
| decorando-penal-dls-20260827-1389 | pen-m23 | Art. 267, CP | C | certificado |
| decorando-penal-dls-20260827-1390 | pen-m23 | Art. 267, § 1º, CP | C | certificado |
| decorando-penal-dls-20260827-1391 | pen-m23 | Art. 267, § 1º, CP | E | certificado |
| decorando-penal-dls-20260827-1392 | pen-m23 | Art. 268, § único, CP | C | certificado |
| decorando-penal-dls-20260827-1393 | pen-m23 | Art. 269, CP | C | certificado |
| decorando-penal-dls-20260827-1394 | pen-m23 | Art. 269, CP | E | certificado |
| decorando-penal-dls-20260827-1395 | pen-m23 | Art. 270, § 2º, CP | E | certificado |
| decorando-penal-dls-20260827-1396 | pen-m23 | Art. 275, CP | E | certificado |
| decorando-penal-dls-20260827-1397 | pen-m23 | Art. 280, CP | E | certificado |
| decorando-penal-dls-20260827-1398 | pen-m23 | Art. 280, § único, CP | C | certificado |
| decorando-penal-dls-20260827-1399 | pen-m23 | Art. 282, CP | E | certificado |
| decorando-penal-dls-20260827-1400 | pen-m23 | Art. 282, § 3º, CP | C | certificado |
| decorando-penal-dls-20260827-1401 | pen-m23 | Art. 282, § 5º, CP | C | certificado |
| decorando-penal-dls-20260827-1402 | pen-m23 | Art. 283, CP | E | certificado |
| decorando-penal-dls-20260827-1403 | pen-m23 | Art. 283, CP | C | certificado |
| decorando-penal-dls-20260827-1404 | pen-m23 | Art. 283, CP | E | certificado |
| decorando-penal-dls-20260827-1405 | pen-m23 | Art. 285 c/c 258 e 267, CP | C | certificado |
| decorando-penal-dls-20260827-1406 | pen-m24 | Art. 286, § único, CP | C | certificado |
| decorando-penal-dls-20260827-1407 | pen-m24 | Art. 287, CP | E | certificado |
| decorando-penal-dls-20260827-1408 | pen-m24 | Art. 288, CP | C | certificado |
| decorando-penal-dls-20260827-1409 | pen-m24 | Art. 288, CP | E | certificado |
| decorando-penal-dls-20260827-1410 | pen-m24 | Art. 288, CP | E | certificado-parcial |
| decorando-penal-dls-20260827-1411 | pen-m24 | Art. 288, CP | C | certificado |
| decorando-penal-dls-20260827-1412 | pen-m24 | Art. 288, CP | C | certificado-parcial |
| decorando-penal-dls-20260827-1413 | pen-m24 | Arts. 288 e 288-A, CP c/c Art. 2º, Lei 12.850/2013 | C | certificado |
| decorando-penal-dls-20260827-1414 | pen-m24 | Art. 288, § 1º, CP | E | certificado |
| decorando-penal-dls-20260827-1415 | pen-m24 | Art. 288, § 1º, CP | C | certificado |
| decorando-penal-dls-20260827-1416 | pen-m24 | Art. 288, § 1º, CP | E | certificado |
| decorando-penal-dls-20260827-1417 | pen-m24 | Art. 288, § 2º, CP | E | certificado |
| decorando-penal-dls-20260827-1418 | pen-m24 | Art. 288-A, CP | C | certificado |
| LED-20261009-0288 | led-penal-cp-2848 | Art. 337-H, caput e pena | C | certificado |
| LED-20261009-0289 | led-penal-cp-2848 | Art. 337-K, caput e pena | E | certificado |
| LED-20261009-0290 | led-penal-cp-2848 | Art. 337-K, parágrafo único | C | certificado |
| LED-20261009-0291 | led-penal-cp-2848 | Art. 337-O, caput e pena | E | certificado |
| LED-20261009-0292 | led-penal-cp-2848 | Art. 337-O, § 1º | C | certificado |
| LED-20261009-0293 | led-penal-cp-2848 | Art. 337-O, § 2º | E | certificado |
