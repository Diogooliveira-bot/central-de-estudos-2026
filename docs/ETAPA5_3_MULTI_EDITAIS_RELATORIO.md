# Base Completa 7.0 — Etapa 5.3: multi-editais TJPB + TRT-8

**Branch:** `feature/multi-editais-trt8-2026` (NÃO é `main`). **Status:** integração técnica preparada, **homologação real pendente**.

## Escopo implementado

- Novo objetivo **TRT-8 2026 — Analista Judiciário, Área Judiciária (cargo 01)** no catálogo, com 12 blocos, oito disciplinas existentes marcadas *Cobertura parcial* e quatro sem disciplina própria marcadas *Em preparação*. Os 10 blocos do TJPB não foram substituídos.
- Checklist em **duas instâncias independentes**: o TJPB permanece em `CentralExamVerticalized` e o TRT-8 em `CentralTRT8Verticalized`, com três marcações (Estudei, Revisei, Fiz questões), progresso por disciplina e total, persistência local e sincronização por edital.
- Backend `api/objective.js`: `examId` obrigatório para TRT-8 e opcional para o TJPB, com *default* para o TJPB legado; identificadores de edital e de tópico passam por lista explícita gerada a partir dos catálogos. O progresso continua em `central_exam_topic_progress`, chave (`user_id,exam_id,topic_id,marker`), sem alteração destrutiva.
- Mantida restrição de banco isolado para Preview: `EXAM_PROGRESS_PREVIEW_DB_ISOLATED=true`. **NÃO foi habilitado nenhum teste de autenticação contra produção.**
- `CentralStudyNavigation.openContext` aproveitado como mecanismo de entrada nos módulos. Correções adicionais para módulo nativo de **Trabalho** (`.bc-trabalho-module`) e **RLM** (`[data-rlm-module="M07"]` etc.).
- Novo manifesto PWA, carregamento das duas fontes de edital e versionamento do cache.

## Auditoria editorial

Base: Edital FCC nº 01/2026, Anexo II cargo 01, com Edital de retificação DOU nº 02/2026.

| Indicador | Valor |
|---|---:|
| Blocos programáticos | 12 |
| Assuntos segmentados editorialmente | 300 |
| Sugestões iniciais de correspondência por títulos | 100 |
| Assuntos com vínculo temático conservador ativo | **34** |
| Links para destinos de módulos reais nesses assuntos | **39** |
| Assuntos que seguem sem vínculo auditado | **266** |
| Assuntos com cobertura integral comprovada | **0** |
| Blocos sem disciplina canônica própria | **4** |

**ATENÇÃO:** O mapeamento é deliberadamente **parcial**, não cobertura integral; uma correspondência de título prova que há material tematicamente relacionado, não que o assunto do edital foi exaurido. `candidateModules` registra as hipóteses não liberadas; `moduleIds` contém só destinos selecionados e validados contra controles nativos de abertura. Os 266 assuntos restantes aparecem como *Em preparação*, sem links fictícios. Os vínculos foram ajustados para o ID verdadeiro da tela de RLM (`Mnn`) em vez dos IDs do catálogo prévio.

## Preservação da versão do TJPB

O JSON/JS legado TJPB foi preservado. No frontend original, `DATA.examId` está ausente e o armazenamento local existente usa a chave `central-v6:exam-progress:undefined:<aluno>`; a nova instância **preserva explicitamente essa chave legada** para não perder marcações anteriores. No backend, chamadas sem `examId` continuam direcionadas ao identificador `tjp-2026-aj-area-judiciaria`. Isso requer migração controlada futura caso se normalize o campo no catálogo TJPB.

## Itens pendentes para Etapa 5.4

1. Confirmar se a nova branch Preview aponta **exclusivamente** para banco Neon de homologação, segredos Preview separados e duas contas fictícias (jamais usar banco de produção em Preview).
2. Validar com navegador autenticado: seleção TRT-8, troca TRT-8↔TJPB, 3 marcações, recarga, logout/login, isolamentos aluno 1/aluno 2 e por edital.
3. Validar offline/PWA e sincronização entre sessões: aba anônima ou aparelho diferente.
4. Validar abertura de módulos **RLM, CF, ADM, Civil, CPC, Trabalho e Processo do Trabalho**, além dos recursos existentes TEC/QC, Lei em Dia, teoria e infográficos onde disponíveis.
5. Continuar auditoria editorial dos 266 assuntos pendentes, conferir aprofundamento teórico e complementações das 4 disciplinas não existentes; **não declarar edital completo** até revisão.
6. Testes automatizados finais, revisar status da implantação Preview, corrigir falhas e apresentar relatório de homologação.

**Restrições:** sem `merge`, sem tocar produção e sem dados reais de alunos em homologação. Publicação somente mediante autorização expressa posterior.
