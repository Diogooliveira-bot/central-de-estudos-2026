# Base Completa — revisão das teorias completas e resumidas

**Data de referência: 15/10/2026 · Relatório histórico.**

**Atualização de 16/10/2026:** as pendências J03–J06 receberam correções coordenadas nos textos. Veja [a rodada jurídica seguinte](../teorias-20261016/RELATORIO.md), que também incorpora ADC 80, prazos, jornada e gabaritos. Os estados abaixo retratam a rodada de 15/10.

A varredura alcançou as fontes textuais das 10 disciplinas. Foram preparados 26 ajustes pontuais em 12 arquivos, em uma branch de trabalho. Nenhuma alteração foi publicada em produção. A revisão jurídica integral de todas as frases, módulos e questões ainda não foi concluída. Os resultados abaixo distinguem erros confirmados, correções preparadas, verificações pontuais e trabalho pendente.

## 1. Escopo conferido

Repositório: `Diogooliveira-bot/central-de-estudos-2026`. Base: `6abe89a3deeef5f607c89334e5d2cc40eca3a941`. O levantamento partiu dos leitores atuais, inclusive pacotes compactados de Civil, CPP e Processo do Trabalho e a teoria completa legada de Administrativo. Arquivos antigos não foram contados automaticamente como conteúdo ativo.

| Disciplina | Unidades textuais | Textos/modos extraídos | Cobertura desta rodada |
|---|---:|---:|---|
| Direito Constitucional | 15 | 30 | Triagem textual + conferências jurídicas pontuais |
| Direito Administrativo | 20 | 40 | Triagem textual + conferências jurídicas pontuais |
| Direito Civil | 15 | 30 | Triagem textual + conferências jurídicas pontuais |
| Direito Processual Civil | 20 | 40 | Triagem textual + conferências jurídicas pontuais |
| Direito Penal | 17 | 34 | Triagem textual + conferências jurídicas pontuais |
| Direito Processual Penal | 22 | 44 | Triagem textual + conferências jurídicas pontuais |
| Direito do Trabalho | 18 | 36 | Triagem textual + conferências jurídicas pontuais |
| Direito Processual do Trabalho | 21 | 42 | Triagem textual + conferências jurídicas pontuais |
| Português | 25 | 25 | Triagem lexical; exemplos didáticos preservados |
| Raciocínio Lógico e Matemática | 14 | 28 | Triagem + leitura dos 14 resumos; M01 é treino |

Foram extraídos 349 textos/modos, somando aproximadamente 1,17 milhão de palavras com títulos, tabelas e exercícios incorporados. São 187 unidades textuais; considerando o treino de velocidade de RLM M01, a estrutura tem 188 itens. Português possui 24 módulos mais revisão final, com teoria e revisão no mesmo documento. RLM M02–M15 possui duas trilhas textuais; M01 é ferramenta de treino.

**Limite da conclusão:** localizar um texto e executar uma busca não significa revisar juridicamente o módulo inteiro. Nenhum módulo recebeu certificado de revisão integral nesta rodada. As fórmulas dos resumos de RLM foram examinadas; não houve auditoria completa dos exercícios. A análise jurídica se aplica às oito disciplinas de Direito.

## 2. Correções preparadas

| Ajuste | Quantidade | Situação |
|---|---:|---|
| Acumulação de professor: atualização da EC 138/2025 em Constitucional e Administrativo | 7 ocorrências | Corrigidas na branch |
| Verbros → Verbos; licítante → licitante | 2 ocorrências | Corrigidas na branch |
| Caractere U+0002 → hífen nas palavras identificadas | 7 ocorrências | Corrigidas na branch |
| in mellius → in melius nas fontes de Penal | 10 ocorrências | Corrigidas na branch |

As 26 ocorrências contam alterações em arquivos-fonte, inclusive a fonte completa de Penal e o dado nativo que podem conter o mesmo trecho. Não representam 26 erros jurídicos distintos. Não foram alterados IDs de módulos, armazenamento do aluno, links de filtros ou gabaritos. A edição de CPP M19 e a recomposição ampla de acentos ficaram registradas como pendências.

## 3. Achados jurídicos e de completude

### J01 — Acumulação de professor: regra constitucional anterior à EC 138/2025

**Prioridade:** alta. **Local:** cf-5-summary, cf-5-complete. **Estado:** corrigido na branch.

Resumo, teoria completa e revisão ativa restringiam professor + outro cargo a técnico/científico.

**Correção/revisão necessária:** Atualizar para professor + outro cargo de qualquer natureza; manter compatibilidade de horários e regras constitucionais sobre teto. A mudança é anterior ao edital indicado no material.

- [Fonte oficial](https://www.planalto.gov.br/ccivil_03/constituicao/emendas/emc/emc138.htm)

### J02 — A mesma restrição antiga aparece em Administrativo

**Prioridade:** alta. **Local:** adm-5-complete. **Estado:** corrigido na branch.

Regra do art. 37, XVI, quadro comparativo e revisão final repetiam técnico/científico.

**Correção/revisão necessária:** Aplicar a redação da EC 138/2025 também nas três ocorrências da teoria completa.

- [Fonte oficial](https://www.planalto.gov.br/ccivil_03/constituicao/emendas/emc/emc138.htm)

### J03 — ADI 5766: alcance da inconstitucionalidade simplificado em excesso

**Prioridade:** alta. **Local:** ptra-4-summary, ptra-4-complete. **Estado:** pendente — requer edição coordenada do pacote e da questão associada.

O M04 apresenta o art. 791-A, §4º, como inconstitucional sem delimitar a expressão atingida. O M11 da própria disciplina explica a condição suspensiva de exigibilidade, criando divergência entre módulos.

**Correção/revisão necessária:** Explicar que a decisão não elimina automaticamente toda condenação em honorários: distinguir condenação, vedação à compensação automática de créditos e suspensão de exigibilidade pelo prazo legal. Revisar simultaneamente a teoria, o quadro de revisão e a questão 5 do resumido que reproduz a leitura da fonte. A responsabilidade por perícia exige tratamento próprio.

- [Fonte oficial](https://www.trt3.jus.br/publicacoes_ej/revista_111/files/basic-html/page863.html)

### J04 — Honorários periciais: referência normativa revogada mantida como lacuna

**Prioridade:** alta. **Local:** ptra-10-summary, ptra-10-complete. **Estado:** pendente — referência revogada confirmada; consolidar disciplina atual antes de reescrever.

A teoria preserva a Resolução CSJT 66/2010 e o parâmetro de R$ 1.000,00, expressamente marcados como verificação futura.

**Correção/revisão necessária:** Encerrar a lacuna com a Resolução CSJT 247/2019 consolidada e atos posteriores. A ficha oficial confirma a revogação da 66/2010; o TRT11 informa reajuste para R$ 1.500 em 2026. A consolidação de julho/2026 e a Resolução 450/2026 também precisam ser consideradas. Não substituir o teto geral de qualquer perícia por esse valor: a referência é assistência custeada pelo orçamento da União.

- [Fonte oficial](https://juslaboris.tst.jus.br/handle/20.500.12178/164654)
- [Fonte oficial](https://portal.trt11.jus.br/index.php/comunicacao/11021-csjt-altera-resolucao-n-247-2019-e-reajusta-honorarios-periciais-para-ate-r-1-5-mil-em-2026)
- [Fonte oficial](https://juslaboris.tst.jus.br/handle/20.500.12178/267856)

### J05 — Recurso de revista: fluxo denegado → AI precisa das exceções atuais

**Prioridade:** alta. **Local:** ptra-15-summary, ptra-15-complete, ptra-16-summary, ptra-16-complete. **Estado:** pendente — fluxo atual confirmado; editar M15/M16 de forma conjunta.

M15 descreve a denegação no TRT seguida de agravo de instrumento. M16 associa agravo interno à decisão monocrática do relator, sem integrar o regime atual da IN40 ao fluxo do M15.

**Correção/revisão necessária:** Distinguir o fundamento de cada capítulo da negativa: precedentes qualificados do TST podem exigir agravo interno no Regional; precedente vinculante do STF tem disciplina de AIRR na Resolução 226/2026. Decisão mista pode exigir os dois recursos, cada qual para o seu capítulo. Atualizar o esquema, não apenas acrescentar nota isolada.

- [Fonte oficial](https://portal.trt11.jus.br/index.php/comunicacao/11409-trt-11-orienta-sobre-novos-procedimentos-do-tst-para-recursos-de-revista)
- [Fonte oficial](https://juslaboris.tst.jus.br/handle/20.500.12178/81842?locale-attribute=fr)

### J06 — Tribunais de Contas: falta integração expressa da EC 139/2026

**Prioridade:** média. **Local:** cf-7-summary, cf-7-complete. **Estado:** pendente.

O M07 aborda arts.70–75 e controle externo, mas não explicita a nova permanência/essencialidade e a disciplina do art.75. Administrativo M08 já contém essa atualização.

**Correção/revisão necessária:** Acrescentar a atualização com os limites exatos do texto constitucional, harmonizando os dois cursos. Classificação: omissão relevante no tema estudado, e não afirmação de que toda a exposição do módulo é falsa.

- [Fonte oficial](https://www.planalto.gov.br/ccivil_03/constituicao/emendas/emc/emc139.htm)

## 4. Ortografia, acentuação e extração

Erros de extração são tratados separadamente de afirmações jurídicas erradas. Palavras podem estar cortadas no fim da linha, sem acento ou com caracteres invisíveis; a recomposição deve considerar a frase inteira.

| ID | Local | Problema | Situação |
|---|---|---|---|
| E01 | cf-1-complete | Erro de digitação: Verbros | corrigido na branch |
| E02 | penal-13-complete | Acento indevido em licitante | corrigido na branch |
| E03 | penal-2-summary, penal-2-complete, cpp-19-complete | Grafia latina: melius | parcial — Penal corrigido; CPP pendente |
| E04 | penal-1-complete, penal-7-summary, cpc-1-complete, cpc-4-complete, cpc-6-summary, cpc-6-complete | Sete caracteres de controle no lugar de hífen | corrigido na branch |
| E05 | penal-1-summary | Resumo com perda extensa de acentos | pendente |
| E06 | ptra-13-summary, ptra-13-complete | Recursos I: muitas palavras sem acentos | pendente |
| E07 | trabalho-12-summary, trabalho-12-complete | Salário e remuneração: perda extensa de acentos | pendente |
| E08 | trabalho-4-summary, trabalho-4-complete | Palavras cortadas na extração | pendente |
| E09 | trabalho-15-summary | Fragmentos de palavras em Rescisão | pendente |
| E10 | trabalho-8-summary, trabalho-8-complete | Endereço de fonte deformado | pendente |

**E03 — evidência:** Ocorrências de in mellius em novatio legis/reformatio.

**Tratamento:** Padronizar in melius. Dez ocorrências foram ajustadas nas fontes de Penal; o pacote compactado de CPP M19 permanece para edição coordenada.

**E05 — evidência:** Exemplos localizados: PRINCIPIOS, INTERPRETACAO, Visao, juridicos, intervencao, criterios.

**Tratamento:** Revisar o texto completo do resumo e reconstruir acentos com leitura contextual. A ausência de acento não pode ser corrigida por regras gerais para palavras como e/é, esta/está e analise/análise.

**E06 — evidência:** Exemplos: decisao, remuneracao, inexistencia, jurisprudencia, merito, representacao, desercao.

**Tratamento:** Revisão contextual das duas versões; preservar números, prazos, nomes de precedentes e opções das questões. A data-base declarada de 2022 também exige revisão jurídica própria.

**E07 — evidência:** Exemplos: remuneracao, comissoes, equiparacao, funcao, jurisprudencia, rescisao.

**Tratamento:** Reconstruir a acentuação nas duas versões sem modificar o conteúdo jurídico por substituição automática. Revisar as relações entre a teoria e os quadros.

**E08 — evidência:** No resumido aparecem fragmentos como dependên e automaticamen; no completo também existem separações no meio de palavras.

**Tratamento:** Confrontar a frase e o PDF correspondente antes de recompor a palavra; não unir todos os finais de linha indiscriminadamente.

**E09 — evidência:** Fragmentos traba e resci aparecem no material extraído.

**Tratamento:** Cotejar os blocos com a fonte e reconstituir a leitura integral de cada frase.

**E10 — evidência:** Referência LC123 contém normas.receisulta/link.action; endereço do Tema1389 fica partido entre linhas.

**Tratamento:** Revalidar os destinos em fontes oficiais e armazenar os links completos em campos próprios. Não corrigir a URL por aproximação sem conferir o destino.

O arquivo técnico de candidatos de acentuação contém propostas, não uma lista de substituições autorizadas para uso cego. O dicionário produziu falsas associações; elas foram descartadas ou corrigidas no inventário de propostas. Palavras válidas como “analise”, e exemplos propositalmente errados em Português, exigem contexto.

## 5. Lacunas e divergências editoriais

**D01 — MEI/pejotização constam do título, mas têm cobertura substantiva pendente.** O material declara que a fonte Gran71461710 não foi recuperada e que os blocos ficaram fora da teoria substantiva. Completar o conteúdo e conferir legislação/jurisprudência aplicáveis; a nota existente não equivale a uma revisão jurídica concluída. O status atual do Tema1389 não foi validado integralmente nesta rodada.

**D02 — M08 de Processo do Trabalho declarado parcial.** O índice do curso e o conteúdo mantêm a sinalização de lacuna da fonte principal. Resolver a fonte e a cobertura da teoria completa antes de classificar o módulo como integralmente revisado.

**D03 — Notas internas ainda presentes no texto de estudo.** Há frases como NÃO HOMOLOGADO PARA PUBLICAÇÃO, documento de controle, versão validada nesta conversa e material OFFLINE não publicado/não integrado. Separar o histórico editorial do conteúdo do aluno e harmonizar os metadados com o estado real da publicação. Isso não demonstra ausência de autorização do usuário para publicação; aponta uma divergência editorial.

## 6. Pontos conferidos que já possuem atualização

Esta tabela evita refazer correções que já existem. Cada resultado se limita ao ponto indicado.

| Disciplina / trecho | Resultado da conferência |
|---|---|
| Direito Constitucional — M03 — aquisição de outra nacionalidade não implica perda automática | O material já diferencia o regime da EC 131/2023. Conferência pontual do tema; não homologação do módulo. [Fonte](https://www.planalto.gov.br/ccivil_03/constituicao/constituicao.htm) |
| Direito Administrativo — M18 — contrato verbal de pronto pagamento | O valor de R$ 13.098,41 indicado para 2026 coincide com o Decreto 12.807/2025. [Fonte](https://planalto.gov.br/ccivil_03/_ato2023-2026/2025/decreto/d12807.htm) |
| Direito Administrativo — M20 — ANPD | O material já menciona a Agência Nacional de Proteção de Dados e a Lei 15.352/2026. [Fonte](https://www.planalto.gov.br/ccivil_03/_ato2023-2026/2026/lei/l15352.htm) |
| Direito Civil — M06 — juros e atualização monetária | O material não usa 1% ao mês como regra geral e identifica o novo regime do art. 406. [Fonte](https://www.planalto.gov.br/ccivil_03/_ato2023-2026/2024/lei/l14905.htm) |
| Direito Civil — M08 — seguro privado | Já registra a Lei 15.040/2024 e a revogação dos arts. 757–802 do Código Civil. [Fonte](https://www.planalto.gov.br/ccivil_03/_ato2023-2026/2024/lei/l15040.htm) |
| Direito Processual Civil — M01/M15/M20 — relevância do REsp | O curso já incorpora a Lei 15.484/2026; não foi classificado como erro por manter a explicação constitucional anterior em trecho histórico. [Fonte](https://www.planalto.gov.br/ccivil_03/_ato2023-2026/2026/lei/l15484.htm) |
| Direito Penal — M09 — feminicídio | Já está apresentado como tipo autônomo do art.121-A, com faixa de 20–40 anos; não foi necessário reintroduzir correção já existente. [Fonte](https://www.planalto.gov.br/ccivil_03/_ato2023-2026/2024/lei/l14994.htm) |
| Direito Penal — M10 — crimes patrimoniais | Já considera mudanças da Lei 15.397/2026, inclusive pena básica de roubo e repouso noturno. [Fonte](https://www.planalto.gov.br/ccivil_03/_ato2023-2026/2026/lei/l15397.htm) |
| Direito Processual Penal — M01/M13 — audiência de custódia | O texto registra a alteração legislativa de2026 e diferencia a controvérsia constitucional. Foi conferida a existência da alteração legal; não foi encerrada a revisão dos andamentos das ADIs. [Fonte](https://www.planalto.gov.br/ccivil_03/_ato2023-2026/2026/lei/l15358.htm) |
| Direito do Trabalho — M07 — licença-paternidade | O material sinaliza corretamente que a Lei 15.371/2026 entra em vigor em 1º/1/2027; não se deve aplicar antecipadamente o regime futuro. [Fonte](https://www.planalto.gov.br/ccivil_03/_ato2023-2026/2026/lei/l15371.htm) |
| Raciocínio Lógico e Matemática — M02–M15 — resumos | Leitura dos 14 resumos: conectivos, negações, argumentos, conjuntos, sequências, aritmética, percentuais, gráficos, medidas de posição e dispersão. Não foi constatado erro nas fórmulas expressamente examinadas. Teorias completas e exercícios não receberam validação integral. |
| Português — M01–M24 e revisão final — triagem | Foram localizadas todas as25 unidades. Exemplos propositalmente errados em ortografia e flexão foram mantidos como exemplos; a triagem lexical não equivale a erro confirmado. Revisão pedagógica linha a linha permanece pendente. |

## 7. Verificação técnica

- `npm test`: 64 testes aprovados, sem falhas, na execução final após todas as alterações.
- Extração das 349 trilhas sem resultado vazio; Administrativo completo foi reconstruído com o mesmo encadeamento de conteúdo e runtime das fontes, em DOM isolado.
- Os 12 arquivos alterados passaram na checagem de sintaxe, no diff e na comparação exata com as 26 substituições pontuais registradas.
- Estes testes verificam integridade técnica. Não substituem validação jurídica, revisão editorial ou teste visual autenticado de todas as telas.

## 8. Próxima fila de revisão, sem repetir o que está pronto

1. Reescrever PTRA M04, M10 e M15/M16 de forma coordenada, incluindo os quadros e perguntas diretamente dependentes das regras identificadas.
2. Integrar EC 139/2026 ao Constitucional M07, alinhando com Administrativo M08.
3. Reconstituir a acentuação e as palavras fragmentadas em PENM01, PTRAM13 e TRABM04/M12/M15; conferir a imagem/PDF onde houver corte.
4. Resolver as lacunas de TRABM08 e PTRAM08 e retirar notas internas somente depois de reconciliar seu conteúdo e o histórico de publicação.
5. Continuar a leitura jurídica integral, módulo por módulo e nas duas versões, registrando dispositivo, fonte, vigência, exceções e contradições. O inventário individual continua marcado como pendente.
6. Antes de publicar, revisar as referências em PDFs/infográficos correspondentes e atualizar o build/cache da versão a publicar. A branch é um rascunho de auditoria; não está homologada para uma publicação integral.

Arquivos técnicos no repositório: `audits/teorias-20261015/inventario.json`, `achados.json`, `candidatos-acentuacao.json` e `scripts/inventory-theory-review.mjs`. Eles preservam a cobertura, os achados e as correções para retomar sem apresentar triagem como revisão concluída.
