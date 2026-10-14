# Nova RLM — TJCE 2026 / FCC — Esqueleto editorial

> **RASCUNHO, NÃO PUBLICAR.** Este documento define arquitetura e lacunas. Ainda não é apostila completa, não aprova juridicamente/tecnicamente questões e não contém links QC novos.

## Fonte e escopo

- **Cargo:** Analista Judiciário — Área Judiciária, TJCE (FCC), edital nº 01/2026, Anexo III.
- **Fonte primária:** https://djea-con.tjce.jus.br/materias/170430
- **Estrutura final pretendida:** **15 módulos (M01 preservado de velocidade + 14 módulos teóricos) e revisão final RF**.
- **Não alterar em produção** até conclusão de teoria, materiais, testes, preservação de progresso e aprovação de prévia.

## Fluxo didático nativo para M02–M15

1. **Teoria completa**: do básico à FCC, subdividida em capítulos, casos resolvidos, exercícios resolvidos, ilustrações necessárias, atalhos fundamentados e erros comuns.
2. **Resumo estratégico + dicas e bizus**: conceitos essenciais, fórmulas contextualizadas, método de resolução, pegadinhas, mini-exemplos; **dentro do resumo**, até dez questões progressivas (3 fáceis, 4 médias, 3 difíceis), com correção imediata, explicação e registro de erros. Não preencher metas com conteúdo artificial.
3. **Mapa mental**: árvore de conceitos responsiva, navegação por ramos, impressão/exportação; construído dos mesmos tópicos da teoria e auditado quanto a terminologia.
4. **Questões de plataformas e desempenho**: mostrar TEC e QC separados; exibir links de cadernos apenas quando respectivos filtros, contagens e URLs públicos forem validados; sem inventar links.

**Interações:** múltipla escolha deve bloquear repetição involuntária e mostrar alternativa correta + raciocínio após tentativa; guiada tem resposta e resolução ocultas até revelar; questões sem comentário confiável ficam marcadas como pendentes; não manter gabarito distante.

## Preservação e inventário existente

- **Manter exclusivamente da versão antiga o treino de velocidade** (M01 novo). São seis blocos: operações; tabuada/divisibilidade/MDC/MMC; frações/decimais; proporções; porcentagem; bateria mista. Preservar motor, cronômetro, desempenho e chave `central-v6:rlm-calculo-rapido-v6638` ao migrar o leitor.
- **Banco antigo:** 200 questões FCC com alternativas e gabaritos (`tools/rlm.html`). Distribuição: 51 equivalências/negações; 84 argumentos; 65 diagramas/quantificadores. Todas têm resposta marcada no objeto original, mas **não possuem comentário individualizado** no banco de dados: escrever/validar antes da prática comentada.
- **Figuras:** 3 questões marcadas como dependentes de imagem; o HTML contém 3 recursos visuais embutidos. Validar correspondência com a questão e manter referência de página.
- **PDF-fonte:** o botão da página aponta para `RLM_QUESTOES_FCC_FONTE.pdf`. Não localizado em `tools/RLM_QUESTOES_FCC_FONTE.pdf` nem na raiz do branch `main`; antes de aproveitar material extra desse PDF, recuperar o arquivo correto. Nenhum PDF adicional foi presumido.
- **QC:** `content/qc-sharing-links.js` contém atualmente links por Administrativo, Penal e Processual Penal; **não contém mapeamento RLM**. Nova estrutura deve mostrar estado 'pendente de filtro' até criação/validação.
- **TEC:** `index.html` contém cadernos `rlm-01` a `rlm-07` e `mat-01` etc. Reaproveitamento é candidato, não validação atual do filtro por módulo. Evitar cadernos duplicados e assuntos extraprogramáticos.
- **Legado:** manter o arquivo completo `tools/rlm.html` intacto como fonte e fallback durante planejamento; depois da migração, ocultar/descontinuar acesso aos seus nove antigos cartões, sem apagar questões ou dados persistidos.

## Matriz de módulos e materiais

| Novo módulo | Conteúdo | Referência antiga | Questões FCC locais | TEC candidato | Prioridade da pesquisa |
|---|---|---|---:|---|---|
| M01 | Treino de Velocidade | Motor do treino | 0 | — | Preservar e testar |
| M02 | Fundamentos da Lógica | rlm8 | 0 | rlm-01 | Procurar fontes/questões |
| M03 | Negações e Equivalências Lógicas | rlm8 | 51 | rlm-02 | Complementar comentários |
| M04 | Argumentação e Dedução Lógica | rlm9 | 84 | rlm-03, rlm-06 | Complementar comentários |
| M05 | Conjuntos e Diagramas Lógicos | rlm6 | 65 | rlm-03, mat-01 | Complementar comentários |
| M06 | Associação de Informações | rlm6, rlm7 | 0 | rlm-04, rlm-06 | Procurar fontes/questões |
| M07 | Raciocínio Verbal e Formação de Conceitos | rlm7 | 0 | rlm-06 | Procurar fontes/questões |
| M08 | Sequências e Padrões Lógicos | rlm7 | 0 | rlm-05 | Procurar fontes/questões |
| M09 | Orientação Espacial e Temporal | rlm7 | 0 | rlm-05 | Procurar fontes/questões |
| M10 | Fundamentos Matemáticos | rlm1, rlm2, rlm3 | 0 | mat-02 | Procurar fontes/questões |
| M11 | Razão, Proporção e Regra de Três | rlm4 | 0 | mat-04 | Procurar fontes/questões |
| M12 | Porcentagem, Acréscimos e Descontos | rlm5 | 0 | mat-04 | Procurar fontes/questões |
| M13 | Tabelas e Gráficos | Novo | 0 | mat-05 | Procurar fontes/questões |
| M14 | Média, Mediana e Moda | Novo | 0 | mat-05 | Procurar fontes/questões |
| M15 | Amplitude, Desvio Médio, Variância e Desvio Padrão | Novo | 0 | — | Procurar fontes/questões |

## Fichas editoriais detalhadas — tópicos, bizus e mapa mental

### M01 — Treino de Velocidade (único legado preservado)

Manter os seis treinos existentes e seu motor; não substituir por blocos de anotações. Integrar ao leitor nativo somente na implantação. O conteúdo do M01 é uma ferramenta e não deve ser confundido com os novos 14 módulos de teoria.

### M02 — Fundamentos da Lógica

**Eixo:** Lógica (base complementar).
**Origem legada:** rlm8. **Questões FCC já no banco:** 0.

**Teoria completa — capítulos a desenvolver**
1. Proposição, frase aberta e valor lógico.
2. Conectivos e leitura em linguagem comum.
3. Operadores: e, ou, ou exclusivo, se...então, se e somente se.
4. Tradução do enunciado em símbolos.
5. Tabelas-verdade como recurso de análise.

**Resumo e bizus a produzir e conferir**
- Distinguir condição necessária e suficiente.
- Ler o 'ou' do enunciado antes de simbolizar.
- Não confundir inversa, recíproca e contrapositiva.

**Mapa mental — ramos iniciais**
- Proposições.
- Conectivos.
- Tradução.
- Tabela-verdade.

**Prática dentro do resumo:** questões 1–3 fáceis, 4–7 médias, 8–10 difíceis (alvo, não obrigação); correção imediata + justificativa; selecionar perguntas que cubram subtópicos, não apenas fórmulas.

**TEC candidato(s):** rlm-01. **QC:** pendente de filtro confirmado.

**Falta pesquisar:** Conteúdo auxiliar: verificar extensão necessária para o edital sem superdimensionar formalização.

### M03 — Negações e Equivalências Lógicas

**Eixo:** Lógica (base complementar).
**Origem legada:** rlm8. **Questões FCC já no banco:** 51.

**Teoria completa — capítulos a desenvolver**
1. Negação simples e dupla negação.
2. Leis de De Morgan.
3. Negação da condicional.
4. Contrapositiva, equivalências e bicondicional.
5. Equivalências com tabelas-verdade e exercícios FCC.

**Resumo e bizus a produzir e conferir**
- Negar 'se P então Q' resulta em P e não Q.
- Negar 'todo' exige contraexemplo.
- Provar equivalência conferindo valores de verdade.

**Mapa mental — ramos iniciais**
- Negações.
- De Morgan.
- Condicionais.
- Equivalências.

**Prática dentro do resumo:** questões 1–3 fáceis, 4–7 médias, 8–10 difíceis (alvo, não obrigação); correção imediata + justificativa; selecionar perguntas que cubram subtópicos, não apenas fórmulas.

**TEC candidato(s):** rlm-02. **QC:** pendente de filtro confirmado.

**Falta pesquisar:** Reaproveitar 51 questões do antigo rlm8; criar comentários explicativos e verificar aderência ao edital.

### M04 — Argumentação e Dedução Lógica

**Eixo:** Relações, hipóteses e conclusões.
**Origem legada:** rlm9. **Questões FCC já no banco:** 84.

**Teoria completa — capítulos a desenvolver**
1. Premissas, hipóteses e conclusão.
2. Validade e consistência de argumentos.
3. Raciocínio condicional e regras de inferência.
4. Contradição, contraexemplo e encadeamento.
5. Métodos de tabela-verdade aplicados às questões.

**Resumo e bizus a produzir e conferir**
- Validade não é o mesmo que verdade factual.
- Organizar premissas antes de concluir.
- Contraexemplo invalida dedução.

**Mapa mental — ramos iniciais**
- Premissas.
- Inferências.
- Validade.
- Conclusão.

**Prática dentro do resumo:** questões 1–3 fáceis, 4–7 médias, 8–10 difíceis (alvo, não obrigação); correção imediata + justificativa; selecionar perguntas que cubram subtópicos, não apenas fórmulas.

**TEC candidato(s):** rlm-03, rlm-06. **QC:** pendente de filtro confirmado.

**Falta pesquisar:** Reaproveitar 84 questões do antigo rlm9 com comentários e auditoria individual.

### M05 — Conjuntos e Diagramas Lógicos

**Eixo:** Relações e classificações.
**Origem legada:** rlm6. **Questões FCC já no banco:** 65.

**Teoria completa — capítulos a desenvolver**
1. Conjuntos, pertinência, inclusão e interseção.
2. Diagramas de Venn e Euler.
3. Quantificadores: todo, algum e nenhum.
4. Negação de quantificadores.
5. Relações categóricas aplicadas.

**Resumo e bizus a produzir e conferir**
- Todo A é B não implica todo B é A.
- Desenhar regiões antes de concluir.
- Negação de universal usa ao menos um contraexemplo.

**Mapa mental — ramos iniciais**
- Conjuntos.
- Diagramas.
- Quantificadores.
- Conclusões.

**Prática dentro do resumo:** questões 1–3 fáceis, 4–7 médias, 8–10 difíceis (alvo, não obrigação); correção imediata + justificativa; selecionar perguntas que cubram subtópicos, não apenas fórmulas.

**TEC candidato(s):** rlm-03, mat-01. **QC:** pendente de filtro confirmado.

**Falta pesquisar:** Reaproveitar 65 questões do antigo rlm6; revisar 3 questões com elementos visuais que requerem fonte/figura.

### M06 — Associação de Informações

**Eixo:** Estrutura lógica de relações arbitrárias.
**Origem legada:** rlm6, rlm7. **Questões FCC já no banco:** 0.

**Teoria completa — capítulos a desenvolver**
1. Associação entre pessoas, objetos, lugares e eventos.
2. Tabelas de possibilidades.
3. Ordenação, posições e restrições.
4. Problemas de verdade e mentira.
5. Inferências condicionais de relacionamentos.

**Resumo e bizus a produzir e conferir**
- Transformar enunciado em tabela.
- Registrar impossível antes de marcar possível.
- Conferir todas as restrições ao final.

**Mapa mental — ramos iniciais**
- Entidades.
- Restrições.
- Tabelas.
- Dedução.

**Prática dentro do resumo:** questões 1–3 fáceis, 4–7 médias, 8–10 difíceis (alvo, não obrigação); correção imediata + justificativa; selecionar perguntas que cubram subtópicos, não apenas fórmulas.

**TEC candidato(s):** rlm-04, rlm-06. **QC:** pendente de filtro confirmado.

**Falta pesquisar:** Desenvolver teoria integral, resumo e explicações; conferir exemplos e questões FCC do edital.

### M07 — Raciocínio Verbal e Formação de Conceitos

**Eixo:** Raciocínio verbal e discriminação.
**Origem legada:** rlm7. **Questões FCC já no banco:** 0.

**Teoria completa — capítulos a desenvolver**
1. Raciocínio verbal e interpretação lógica.
2. Analogias e relações entre conceitos.
3. Classificação e critérios de agrupamento.
4. Identificação do elemento discrepante.
5. Formação e discriminação de conceitos.

**Resumo e bizus a produzir e conferir**
- Nomear o critério antes de escolher.
- Descartar propriedades acidentais.
- Testar regra em todos os elementos.

**Mapa mental — ramos iniciais**
- Analogias.
- Critérios.
- Classificação.
- Discriminação.

**Prática dentro do resumo:** questões 1–3 fáceis, 4–7 médias, 8–10 difíceis (alvo, não obrigação); correção imediata + justificativa; selecionar perguntas que cubram subtópicos, não apenas fórmulas.

**TEC candidato(s):** rlm-06. **QC:** pendente de filtro confirmado.

**Falta pesquisar:** Desenvolver teoria integral, resumo e explicações; conferir exemplos e questões FCC do edital.

### M08 — Sequências e Padrões Lógicos

**Eixo:** Raciocínio sequencial.
**Origem legada:** rlm7. **Questões FCC já no banco:** 0.

**Teoria completa — capítulos a desenvolver**
1. Sequências aritméticas e multiplicativas.
2. Alternância e recorrência.
3. Padrões alfanuméricos.
4. Sequências figurais e matrizes.
5. Regularidades e ciclos.

**Resumo e bizus a produzir e conferir**
- Testar diferenças antes de razões.
- Analisar posições ímpares e pares separadamente.
- Ciclo e posição não são o mesmo.

**Mapa mental — ramos iniciais**
- Números.
- Letras.
- Figuras.
- Ciclos.

**Prática dentro do resumo:** questões 1–3 fáceis, 4–7 médias, 8–10 difíceis (alvo, não obrigação); correção imediata + justificativa; selecionar perguntas que cubram subtópicos, não apenas fórmulas.

**TEC candidato(s):** rlm-05. **QC:** pendente de filtro confirmado.

**Falta pesquisar:** Desenvolver teoria integral, resumo e explicações; conferir exemplos e questões FCC do edital.

### M09 — Orientação Espacial e Temporal

**Eixo:** Orientação espacial e temporal.
**Origem legada:** rlm7. **Questões FCC já no banco:** 0.

**Teoria completa — capítulos a desenvolver**
1. Pontos cardeais e deslocamentos.
2. Rotação e posição relativa.
3. Sequência de eventos e horários.
4. Dias da semana e calendários.
5. Resolução por linha do tempo e esboços.

**Resumo e bizus a produzir e conferir**
- Fixar direção inicial.
- Usar módulo 7 para dias da semana.
- Esboçar linha do tempo antes do cálculo.

**Mapa mental — ramos iniciais**
- Direções.
- Posições.
- Horários.
- Calendários.

**Prática dentro do resumo:** questões 1–3 fáceis, 4–7 médias, 8–10 difíceis (alvo, não obrigação); correção imediata + justificativa; selecionar perguntas que cubram subtópicos, não apenas fórmulas.

**TEC candidato(s):** rlm-05. **QC:** pendente de filtro confirmado.

**Falta pesquisar:** Desenvolver teoria integral, resumo e explicações; conferir exemplos e questões FCC do edital.

### M10 — Fundamentos Matemáticos

**Eixo:** Base auxiliar para raciocínio matemático.
**Origem legada:** rlm1, rlm2, rlm3. **Questões FCC já no banco:** 0.

**Teoria completa — capítulos a desenvolver**
1. Operações e hierarquia de expressões.
2. Inteiros, racionais e decimais.
3. Frações, equivalência e operações.
4. Múltiplos, divisores, MDC e MMC.
5. Expressões e problemas com unidades.

**Resumo e bizus a produzir e conferir**
- Conferir o todo de cada fração.
- Não misturar unidade antes de converter.
- MDC para agrupamento máximo; MMC para ciclos coincidentes.

**Mapa mental — ramos iniciais**
- Operações.
- Frações.
- Divisibilidade.
- Problemas.

**Prática dentro do resumo:** questões 1–3 fáceis, 4–7 médias, 8–10 difíceis (alvo, não obrigação); correção imediata + justificativa; selecionar perguntas que cubram subtópicos, não apenas fórmulas.

**TEC candidato(s):** mat-02. **QC:** pendente de filtro confirmado.

**Falta pesquisar:** Unificar a teoria dos antigos módulos 1, 2 e 3, sem duplicação.

### M11 — Razão, Proporção e Regra de Três

**Eixo:** Proporcionalidade exigida.
**Origem legada:** rlm4. **Questões FCC já no banco:** 0.

**Teoria completa — capítulos a desenvolver**
1. Conceito de razão.
2. Proporções e propriedade fundamental.
3. Grandezas direta e inversamente proporcionais.
4. Regra de três simples.
5. Problemas contextualizados e leitura das unidades.

**Resumo e bizus a produzir e conferir**
- Identificar as grandezas antes da conta.
- Diretamente proporcional cresce junto; inversa troca o sentido.
- Montar tabela das grandezas com unidades.

**Mapa mental — ramos iniciais**
- Razão.
- Grandezas.
- Regra de três.
- Aplicações.

**Prática dentro do resumo:** questões 1–3 fáceis, 4–7 médias, 8–10 difíceis (alvo, não obrigação); correção imediata + justificativa; selecionar perguntas que cubram subtópicos, não apenas fórmulas.

**TEC candidato(s):** mat-04. **QC:** pendente de filtro confirmado.

**Falta pesquisar:** Regra de três composta é complementar, não tratar como núcleo literal do edital de 2026.

### M12 — Porcentagem, Acréscimos e Descontos

**Eixo:** Porcentagem exigida.
**Origem legada:** rlm5. **Questões FCC já no banco:** 0.

**Teoria completa — capítulos a desenvolver**
1. Frações e decimais percentuais.
2. Porcentagem de uma quantidade.
3. Acréscimos e descontos simples.
4. Variações sucessivas e preço inicial.
5. Comparação de taxas e aplicações.

**Resumo e bizus a produzir e conferir**
- Usar fatores 1+p e 1-p.
- Percentuais sucessivos multiplicam, não somam.
- Taxa de retorno usa a base correta.

**Mapa mental — ramos iniciais**
- Percentual.
- Acréscimo.
- Desconto.
- Variação.

**Prática dentro do resumo:** questões 1–3 fáceis, 4–7 médias, 8–10 difíceis (alvo, não obrigação); correção imediata + justificativa; selecionar perguntas que cubram subtópicos, não apenas fórmulas.

**TEC candidato(s):** mat-04. **QC:** pendente de filtro confirmado.

**Falta pesquisar:** Desenvolver teoria integral, resumo e explicações; conferir exemplos e questões FCC do edital.

### M13 — Tabelas e Gráficos

**Eixo:** Estatística: leitura e interpretação.
**Origem legada:** conteúdo novo. **Questões FCC já no banco:** 0.

**Teoria completa — capítulos a desenvolver**
1. Tabela simples e de dupla entrada.
2. Frequência absoluta, relativa e percentual.
3. Histogramas e distribuição de frequências.
4. Gráficos de setores e infográficos.
5. Leitura crítica: escalas, eixos e conclusões.

**Resumo e bizus a produzir e conferir**
- Conferir total e unidade.
- Não confundir frequência absoluta com relativa.
- Inspecionar escala truncada de eixos.

**Mapa mental — ramos iniciais**
- Tabelas.
- Histogramas.
- Setores.
- Infográficos.

**Prática dentro do resumo:** questões 1–3 fáceis, 4–7 médias, 8–10 difíceis (alvo, não obrigação); correção imediata + justificativa; selecionar perguntas que cubram subtópicos, não apenas fórmulas.

**TEC candidato(s):** mat-05. **QC:** pendente de filtro confirmado.

**Falta pesquisar:** Não há módulo antigo de teoria específico para estatística; procurar PDF e questões FCC.

### M14 — Média, Mediana e Moda

**Eixo:** Estatística: tendência central.
**Origem legada:** conteúdo novo. **Questões FCC já no banco:** 0.

**Teoria completa — capítulos a desenvolver**
1. Média aritmética simples.
2. Média aritmética ponderada.
3. Mediana em amostras pares e ímpares.
4. Moda e distribuições sem moda ou multimodais.
5. Cálculo a partir de tabelas e gráficos.

**Resumo e bizus a produzir e conferir**
- Ordenar dados antes de achar mediana.
- Usar pesos na média ponderada.
- Média sofre influência de extremos.

**Mapa mental — ramos iniciais**
- Média simples.
- Média ponderada.
- Mediana.
- Moda.

**Prática dentro do resumo:** questões 1–3 fáceis, 4–7 médias, 8–10 difíceis (alvo, não obrigação); correção imediata + justificativa; selecionar perguntas que cubram subtópicos, não apenas fórmulas.

**TEC candidato(s):** mat-05. **QC:** pendente de filtro confirmado.

**Falta pesquisar:** Sem fonte teórica estatística explícita no arquivo legado de RLM; pesquisar.

### M15 — Amplitude, Desvio Médio, Variância e Desvio Padrão

**Eixo:** Estatística: dispersão.
**Origem legada:** conteúdo novo. **Questões FCC já no banco:** 0.

**Teoria completa — capítulos a desenvolver**
1. Amplitude total.
2. Desvios em relação à média.
3. Desvio médio absoluto.
4. Variância populacional e amostral — diferenças e contexto.
5. Desvio padrão, unidades e interpretação.

**Resumo e bizus a produzir e conferir**
- Desvio padrão tem a unidade original.
- Variância tem unidade ao quadrado.
- Verificar se o exercício usa população ou amostra.

**Mapa mental — ramos iniciais**
- Amplitude.
- Desvios.
- Variância.
- Desvio padrão.

**Prática dentro do resumo:** questões 1–3 fáceis, 4–7 médias, 8–10 difíceis (alvo, não obrigação); correção imediata + justificativa; selecionar perguntas que cubram subtópicos, não apenas fórmulas.

**TEC candidato(s):** nenhum identificado. **QC:** pendente de filtro confirmado.

**Falta pesquisar:** Pesquisar fontes completas e FCC; não há filtro TEC específico validado para essas medidas.

## Checklist de finalização antes da prévia

- [ ] Recuperar e ler o PDF-fonte ausente e outros PDFs confiáveis enviados posteriormente.
- [ ] Consolidar teoria integral dos módulos M02–M15, com revisão pedagógica e exemplos.
- [ ] Produzir resumo, bizus tecnicamente corretos, 10 questões progressivas por módulo quando houver material suficiente.
- [ ] Escrever ou auditar explicações para 200 questões antigas; conferir figuras, respostas e eventual relevância para o edital.
- [ ] Montar 14 mapas mentais coerentes com a teoria e a versão resumida.
- [ ] Mapear TEC e QConcursos por novo módulo/subassunto; só publicar links validados e sem duplicação.
- [ ] Incorporar M01 de velocidade dentro da Central preservando a chave de progresso do treino.
- [ ] Criar leitor nativo com teoria/resumo/prática/mapa e navegação, sem redirecionar para `tools/rlm.html`.
- [ ] Auditar visual celular/tablet/desktop, acessibilidade, impressão, interações e progresso; entregar PRÉVIA antes de publicar.

**Escopo deste commit:** esqueleto editorial + manifesto estruturado, sem alterar `index.html`, `runtime.js`, páginas antigas ou progressos reais.
