# ETAPA 5.2 — TRT-8 2026 | Cargo 01 — Verticalização e pré-mapeamento

**Status:** TRABALHO DE DESENVOLVIMENTO, NÃO publicado. **Branch:** `feature/multi-editais-trt8-2026`.

## Fontes oficiais conferidas

- Edital **01/2026 da FCC**, Anexo II (Conhecimentos Gerais aplicáveis ao cargo 01 e Conhecimentos Específicos exclusivos do cargo 01): https://www.concursosfcc.com.br/concursos/trt8r126/trt8r126_edital_de_abertura.pdf
- **Edital 02/2026 de retificação** (07/10/2026, DOU 08/10/2026, Seção 3, p. 191), lido diretamente no portal da Imprensa Nacional: https://www.in.gov.br/web/dou/-/edital-n-2-de-7-de-outubro-de-2026-737300524

A alteração oficial foi aplicada no bloco de Noções de Legislação: a política de prevenção a assédio passa da referência **Resolução TRT8 nº 067/2021** para **Resolução TRT8 nº 065/2025, alterada pela nº 23/2026**, preservando as Resoluções CNJ nº 351/2020 e CSJT nº 360/2023.

## Inventário da transcrição

- **12 blocos oficiais**: 6 de Conhecimentos Gerais e 6 Específicos.
- **300 assuntos** criados para a interface de acompanhamento, **numeração editorial interna**, NÃO numeração oficial da FCC (os blocos do Anexo II são prosa).
- **81 assuntos com sugestão de vínculo** na base atual, totalizando **100 candidaturas** (alguns assuntos sugerem mais de um módulo).
- **0 vinculações ativadas**: `moduleIds` está vazio por segurança; sugestões são **candidatos não auditados**, não são equivalência jurídica comprovada.
- **Nenhum conteúdo publicado e nenhum progresso real criado** nesta etapa.
- Fonte de dados: `content/trt8-2026-verticalized.json`.

| Grupo | Disciplina | ID da Central | Assuntos segmentados | Assuntos com candidato | Candidaturas |
|---|---|---|---:|---:|---:|
| Gerais | Língua Portuguesa | `pt` | 13 | 0 | 0 |
| Gerais | Matemática e Raciocínio lógico | `rlm` | 12 | 5 | 8 |
| Gerais | Noções de Legislação | — | 8 | 0 | 0 |
| Gerais | Noções de Direitos Humanos | — | 10 | 0 | 0 |
| Gerais | Noções sobre direitos das pessoas com deficiência | — | 7 | 0 | 0 |
| Gerais | Noções de Informática | — | 15 | 0 | 0 |
| Específicos | Direito Constitucional | `cf` | 20 | 13 | 16 |
| Específicos | Direito Administrativo | `adm` | 46 | 13 | 13 |
| Específicos | Direito do Trabalho | `trab` | 54 | 16 | 23 |
| Específicos | Direito Processual do Trabalho | `ptra` | 43 | 9 | 10 |
| Específicos | Direito Civil | `civil` | 32 | 10 | 13 |
| Específicos | Direito Processual Civil | `cpc` | 40 | 15 | 17 |

## Exemplos de correspondências que precisam de conferência antes de ativar

- **Matemática e Raciocínio lógico**: "Compreensão e elaboração da lógica das situações por meio de: raciocínio verbal, raciocínio matemático, raciocínio sequencial, ori" → rlm-tjce2026-m07 (M07 RACIOCÍNIO VERBAL E FORMAÇÃO DE CONCEITOS); rlm-tjce2026-m09 (M09 ORIENTAÇÃO ESPACIAL E TEMPORAL)
- **Matemática e Raciocínio lógico**: "porcentagem e problemas envolvendo regra de três simples, cálculos de porcenta gem, acréscimos e descontos." → rlm-tjce2026-m12 (M12 PORCENTAGEM, ACRÉSCIMOS E DESCONTOS)
- **Matemática e Raciocínio lógico**: "Noções de Estatísticas: medidas de tendência central (moda, mediana, média aritmética simples e ponderada) e de dispersão (desvio " → rlm-tjce2026-m15 (M15 AMPLITUDE, DESVIO MÉDIO, VARIÂNCIA E DESVIO PADRÃO); rlm-tjce2026-m14 (M14 MÉDIA, MEDIANA E MODA)
- **Direito Constitucional**: "Controle de constitucionalidade: sistemas difuso e concentrado" → w12 (12 CONTROLE DE CONSTITUCIONALIDADE)
- **Direito Constitucional**: "Dos direitos e garantias fundamentais: dos direitos e deveres individuais e coletivos dos direitos sociais" → w2 (02 DIREITOS E DEVERES INDIVIDUAIS E COLETIVOS)
- **Direito Constitucional**: "Da organização do Estado: da organização político administrativa: da União dos Estados Federados dos Municípios Do Distrito Federa" → w4 (04 ORGANIZAÇÃO DO ESTADO)
- **Direito Administrativo**: "Classificação dos atos administrativos. Formação e efeitos." → adm-03-03-atos-administrativos (03 ATOS ADMINISTRATIVOS)
- **Direito Administrativo**: "Processo administrativo no âmbito da Administração Pública Federal (Lei nº 9.784/1999 e suas alterações)." → adm-06-06-processo-administrativo-lei-9-784 (06 PROCESSO ADMINISTRATIVO - LEI 9.784)
- **Direito Administrativo**: "Controle da Administração Pública." → adm-08-08-controle-da-administracao (08 CONTROLE DA ADMINISTRAÇÃO)
- **Direito do Trabalho**: "Dos princípios e fontes do Direito do Trabalho." → trab-m02 (02 Fontes e Princípios do Direito do Trabalho)
- **Direito do Trabalho**: "Do contrato individual de trabalho: conceito, classificação e características." → trab-m05 (05 Contrato Individual de Trabalho)
- **Direito do Trabalho**: "Da suspensão e interrupção do contrato de trabalho: caracterização e distinção." → trab-m07 (07 Suspensão e Interrupção do Contrato de Trabalho)
- **Direito Processual do Trabalho**: "Da Justiça do Trabalho: organização e competência." → ptra-a00 (01 ORGANIZAÇÃO E COMPETÊNCIA DA JUSTIÇA DO TRABALHO)
- **Direito Processual do Trabalho**: "Do processo judiciário do trabalho: princípios gerais do processo trabalhista (aplicação subsidiária do CPC). Prescrição e decadên" → ptra-a10 (11 PRESCRIÇÃO, DECADÊNCIA E PJE)
- **Direito Processual do Trabalho**: "Dos procedimentos especiais: inquérito para apuração de falta grave, ação rescisória e mandado de segurança. Da ação civil pública" → ptra-a08 (09 RESCISÓRIA, INQUÉRITO E PROCEDIMENTOS ESPECIAIS)
- **Direito Civil**: "Da Pessoa Natural. Personalidade e Capacidade. Direitos da Personalidade. Das Pessoas Jurídicas. Domicílio Civil." → civil-m01 (01 PESSOA NATURAL E DIREITOS DA PERSONALIDADE); civil-m02 (02 PESSOAS JURÍDICAS E DOMICÍLIO)
- **Direito Civil**: "Do Negócio Jurídico: Conceito. Classificação." → civil-m04 (04 NEGÓCIO JURÍDICO)
- **Direito Civil**: "Defeitos do negócio jurídico (erro ou ignorância, dolo, coação, estado de perigo, lesão, fraude contra credores), invalidade do ne" → civil-m04 (04 NEGÓCIO JURÍDICO)
- **Direito Processual Civil**: "Dos atos processuais: da forma dos atos dos prazos da comunicação dos atos das nulidades. Preclusão." → cpc8 (08 COMUNICAÇÃO DOS ATOS E NULIDADES)
- **Direito Processual Civil**: "Da resposta d o réu: contestação, exceções e reconvenção. Da revelia. Da tutela provisória." → cpc9 (09 TUTELA PROVISÓRIA)

## Regras de segurança editorial

1. O texto `originalProgram` preserva o bloco da FCC (após normalização dos espaços e aplicação da retificação oficial); `items` é segmentação operacional para o checklist.
2. Um assunto não é considerado "coberto" só porque apareceu palavra semelhante no título de um módulo. `coverage:'to_audit'` prevalece até conferir teoria, resumo, legislação e filtros associados.
3. A disciplina **Português** usa índice próprio; o algoritmo de candidatos leu apenas o catálogo de assuntos em `central-structural-v66119/runtime.js`, portanto não encontrou seus 24 módulos. Isso é **lacuna da coleta**, não ausência de teoria.
4. **Informática, Direitos Humanos, Direitos das Pessoas com Deficiência e Legislação TRT8** não possuem disciplina canônica própria na Central. Devem aparecer como "Em preparação" ou "Cobertura parcial" somente após auditoria específica; nunca criar URL fictícia.
5. Para **TJPB**, preservar integralmente os IDs, dados e marcações em produção. A API atual `api/objective.js` está limitada a `EXAM_ID` do TJPB; o TRT8 não deve ser habilitado até refatoração multi-editais segura, inclusive os marcadores, o offline e as verificações por aluno.
6. **Direito do Trabalho** e **Processo do Trabalho** precisam de mapeamento tema→módulo com a teoria existente, sem republicar material desatualizado.

## Pendências antes de homologar

- Revisar manualmente os **300 assuntos** e confirmar/corrigir as delimitações; não omitir conteúdos introduzidos como abreviação pelo OCR.
- Conferir as **100 sugestões** contra o conteúdo efetivo dos módulos; completar os vínculos que não surgiram do algoritmo (inclusive Português).
- Classificar `complete / partial / preparation` apenas após inspeção verificável.
- Implementar frontend/API multi-editais de modo que o progresso seja indexado por `user_id`, `exam_id`, `topic_id`, `marker`.
- Montar Preview com banco Neon de homologação isolado e executar testes dos dois concursos e dois alunos.
- A publicação depende de nova autorização.

**Observação:** A fonte é oficial e a alteração normativa foi conferida. A **qualidade fina das 300 divisões e dos vínculos** ainda exige validação antes de uso por alunos.
