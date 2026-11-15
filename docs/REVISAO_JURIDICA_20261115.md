# Revisão jurídica do material de revisão — iniciada em 15/11/2026

Situação: **branch de trabalho, não publicada**. Conteúdo jurídico só vai para produção com autorização expressa do proprietário.

## Objetivo
O material de revisão é o primeiro contato do aluno com a matéria e também serve para revisar. A revisão busca, módulo a módulo:
1. erros jurídicos ou imprecisões;
2. desatualizações (lei, emenda, súmula, tese) até novembro/2026;
3. lacunas de alto rendimento em concurso (pontos muito cobrados que faltavam);
4. frases confusas a ponto de prejudicar o entendimento.

## Método
Para cada módulo: um revisor jurídico propõe até 12 edições pontuais (cada uma com fundamento), só as de alta confiança; o que não pôde ser confirmado vira **pendência** e não é aplicado. As edições são aplicadas com checagem de trecho único e de estrutura HTML; um **aprovador independente** confere cada mudança. Só módulos aprovados entram no commit.

Limitação: os sites oficiais (Planalto, STF) não abrem no ambiente de trabalho; a conferência usou busca na web e o conhecimento consolidado dos revisores. Itens recentes ou duvidosos ficaram como pendência para o proprietário decidir.

Arquivos de origem da revisão por disciplina:

| Disciplina | Arquivo |
|---|---|
| Administrativo | `content/adm/autor-20261110/adm-mNN-submitted-review.js` (HTML compactado) |
| Constitucional | `content/cf/mNN-teoria-guiada-data.js` |
| Civil | `content/civil/mNN-teoria-guiada-data.js` |
| Processo Civil | `content/cpc/cpc-review-didactic-*.js` |
| Penal | `content/penal/mNN-teoria-guiada-data.js` |
| Processo Penal | `content/cpp/leituras-20261111-*.js` |

Observação: se algum texto tiver sido alterado pelo editor da Central em produção, a versão salva no banco prevalece sobre o arquivo.

## Módulos revisados


### Administrativo M01 — Regime Jurídico e Princípios

Veredito do aprovador: **APROVADO**. Material juridicamente correto e muito didático: não há erro conceitual grave, as ressalvas são cuidadosas (supremacia com limites, publicidade x proteção de dados, art. 54 como regra não universal) e a progressão do concreto ao normativo funciona bem para primeiro contato. As fragilidades são de precisão e de densidade para prova: algumas citações são parafraseadas de forma vaga (art. 37, § 1º; termo inicial do art. 54; "controle judicial" na tabela de anulação) e faltam pontos clássicos muito cobrados, como EC 19/1998, conteúdo da SV 13, efeitos ex tunc/ex nunc, motivos determinantes, interesse primário x secundário e as SV 5 e 21.

- **Acréscimo** (E1): Distinção clássica do regime jurídico-administrativo, ausente no material e diretamente ligada ao trecho "interesse público não é o interesse do governante". A supremacia só se justifica pelo interesse primário. _Fonte: Doutrina clássica (Renato Alessi; Celso Antônio Bandeira de Mello, Curso de Direito Administrativo, cap. I)._
- **Correção** (E2): A paráfrase omitia "programas" e substituía a vedação literal ("nomes, símbolos ou imagens") por expressão genérica. A redação literal é a exigida em prova e conecta-se ao exemplo inicial da fotografia do prefeito no anúncio da obra. _Fonte: CF/1988, art. 37, § 1º._
- **Acréscimo** (E3): O material cita a SV 13 sem dizer o que ela proíbe. Os elementos (grau de parentesco até o 3º inclusive, cargos alcançados, nepotismo cruzado) e a desnecessidade de lei formal são o núcleo cobrado. Não se incluiu a ressalva dos cargos políticos porque o Tema 1000 da repercussão… _Fonte: STF, Súmula Vinculante 13; STF, RE 579.951 (Tema 66 da repercussão geral: a vedação do nepotismo não exige lei formal, decorrendo do art. 37, caput, da CF)._
- **Acréscimo** (E4): Completa a ideia de que publicidade não é absoluta com a regra legal (publicidade como regra, sigilo como exceção) e com o precedente vinculante mais cobrado sobre publicidade x intimidade. _Fonte: Lei 12.527/2011, art. 3º, I; STF, ARE 652.777, Tema 483 da repercussão geral ("É legítima a publicação, inclusive em sítio eletrônico mantido pela Administração_
- **Acréscimo** (E5): A origem da eficiência como princípio expresso (EC 19/1998) é um dos pontos mais recorrentes sobre o LIMPE e não aparece no material. _Fonte: CF/1988, art. 37, caput, com redação dada pela Emenda Constitucional 19/1998._
- **Didática** (E6): O texto descreve o fenômeno sem nomeá-lo. "Desvio de finalidade/desvio de poder" é a expressão técnica cobrada e caracteriza vício de nulidade do ato. _Fonte: Lei 4.717/1965 (Lei da Ação Popular), art. 2º, "e", e parágrafo único, "e" (desvio de finalidade: ato praticado visando a fim diverso do previsto na regra de co_
- **Acréscimo** (E7): Teoria central do tema motivação, ausente no material, e complemento natural da distinção motivo x motivação já apresentada. _Fonte: Doutrina consolidada (Hely Lopes Meirelles; Celso Antônio Bandeira de Mello); Lei 4.717/1965, art. 2º, "d" (inexistência dos motivos); jurisprudência pacífica d_
- **Acréscimo** (E8): Dá base legal concreta à afirmação genérica sobre mudança de entendimento; é a principal expressão positivada da segurança jurídica na lei de processo administrativo federal. _Fonte: Lei 9.784/1999, art. 2º, parágrafo único, XIII ("interpretação da norma administrativa da forma que melhor garanta o atendimento do fim público a que se dirige,_
- **Correção** (E9): O art. 54 exige má-fé "comprovada" (ônus da Administração), e o termo inicial, antes vago ("conforme as condições legais"), é cobrado literalmente. A Súmula 633 do STJ completa a ressalva de que a lei é federal. _Fonte: Lei 9.784/1999, art. 54, caput e § 1º; STJ, Súmula 633 ("A Lei n. 9.784/1999, especialmente no que diz respeito ao prazo decadencial para a revisão de atos admi_
- **Correção** (E10): "Pode ser objeto de controle judicial" não distingue anulação de revogação (a revogação também se submete a controle judicial de legalidade, conforme a parte final da Súmula 473); o contraste correto é quem pode desfazer. Acrescenta-se a linha dos efeitos (ex tunc x ex nunc),… _Fonte: STF, Súmulas 346 e 473; Lei 9.784/1999, art. 53; doutrina pacífica sobre efeitos da anulação (ex tunc) e da revogação (ex nunc)._
- **Acréscimo** (E11): O texto fala em "interrupções legalmente previstas" sem indicá-las; a hipótese legal do art. 6º, § 3º, é o ponto mais cobrado sobre continuidade. _Fonte: Lei 8.987/1995, art. 6º, § 3º, I e II._
- **Acréscimo** (E12): Súmulas vinculantes clássicas sobre contraditório e ampla defesa no processo administrativo, ausentes no material. _Fonte: STF, Súmula Vinculante 5; STF, Súmula Vinculante 21._

Pendências (não aplicadas):
- PEC 38/2025 (Reforma Administrativa) e novos princípios no caput do art. 37 — A proposta acrescenta novos princípios expressos ao caput do art. 37 (ex.: transparência, motivação, consensualidade, digitalização). Pelas fontes encontradas, até meados de 2026 não havia sido votada no Plenário da Câma
- Possível alteração da Lei 9.784/1999 em 2026 e PL 2.481/2022 (extensão a estados e municípios) — Uma fonte secundária indica atualização do texto consolidado em junho de 2026, sem dizer qual. O PL 2.481/2022, que estenderia a lei a estados, DF e municípios, constava pendente na Câmara. Não consegui conferir no Plana
- Sentidos subjetivo (orgânico/formal) e objetivo (material/funcional) de Administração Pública — Lacuna de alto rendimento na seção "O que é a Administração Pública?" (o texto descreve os dois sentidos sem nomeá-los). Não aplicada por causa do limite de 12 edições. Sugestão: "Daí os dois sentidos clássicos: subjetiv
- Art. 2º, caput, da Lei 9.784/1999 não lista impessoalidade nem publicidade — Pegadinha recorrente (esses princípios aparecem só nos critérios do parágrafo único, incisos III e V). Não aplicada por limite de edições; cabe no módulo de Processo Administrativo ou na leitura comentada dos arts. 1º e 
- Tema 138 da repercussão geral (RE 594.296): desfazimento de ato que já produziu efeitos exige processo administrativo prévio — Complementaria a seção de autotutela. Não aplicada por limite de edições.
- Moralidade e ação popular (CF, art. 5º, LXXIII; Tema 836 da repercussão geral, ARE 824.781: não é preciso provar prejuízo material ao erário) — Não aplicada por limite de edições.
- Supremacia x indisponibilidade: princípios implícitos ("pedras de toque"); a supremacia atua nas relações verticais, a indisponibilidade acompanha toda a atuação administrativa, inclusive sob regime d — Não aplicada por limite de edições.
- Lei 8.987/1995, art. 6º, § 4º (incluído pela Lei 14.015/2020): o corte por inadimplência não pode começar em sexta, sábado, domingo, feriado ou véspera de feriado — Confirmado, mas omitido para não alongar a seção de continuidade (o tema tem módulo próprio de Serviços Públicos).
- **Ajustes do aprovador (aplicados):** ressalva de que a aplicação da SV 13 a cargos políticos é objeto do Tema 1000, ainda sem tese; lista de fontes completada com EC 19/1998, Lei 12.527/2011, Lei 8.987/1995, SV 5/13/21, Temas 66 e 483 e Súmula 633/STJ.
