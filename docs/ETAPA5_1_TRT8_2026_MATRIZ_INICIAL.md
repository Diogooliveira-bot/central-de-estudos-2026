# BASE COMPLETA 7.0 — ETAPA 5.1 | TRT-8 2026 — ANALISTA JUDICIÁRIO, ÁREA JUDICIÁRIA

**Status:** levantamento inicial e arquitetura; NÃO publicado; NÃO iniciar migração nem criar dados de progresso até aprovação do mapeamento completo.
**Branch:** `feature/multi-editais-trt8-2026`
**Cargo oficial:** 01 — Analista Judiciário, Área Judiciária (não confundir com cargo 02, Oficial de Justiça).
**Banca:** Fundação Carlos Chagas — FCC.
**Prova:** 20 questões de conhecimentos gerais, 40 de conhecimentos específicos e 1 estudo de caso (edital, item 9).
**Fonte primária consultada:** Edital 01/2026 FCC, Anexo II, pp. 45–51 na paginação impressa (arquivo PDF de 80 páginas), URL:
https://www.concursosfcc.com.br/concursos/trt8r126/trt8r126_edital_de_abertura.pdf

## 1. Retificação imprescindível antes da verticalização definitiva

Há referência ao **Edital 02/2026, de 07/10/2026 (DOU 08/10/2026)**, que retifica o 01/2026.
Fontes secundárias relatam substituição em **Noções de Legislação**:
- versão inicial: Resolução TRT8 nº 067/2021;
- versão retificada: Resolução TRT8 nº 065/2025, alterada pela Resolução TRT8 nº 23/2026;
- referências à Resolução CNJ 351/2020 e CSJT 360/2023 permanecem citadas.

**PENDENTE DE CONFERÊNCIA NO ORIGINAL DA RETIFICAÇÃO:** obter/anexar o Edital 02/2026 no domínio FCC/DOU; comparar redação do Anexo II e demais alterações. NÃO publicar o texto antigo nem afirmar que a transcrição do TRT-8 já está validada enquanto isso não acontecer.
Fontes auxiliares (não substituir pelo documento oficial):
https://dicionariodoconcurseiro.com.br/retificacao-concurso-trt-8-pa-ap-2026-edital-02-2026-altera-lotacao-e-conteudo-programatico/
https://proximoedital.com.br/concursos/trt-8-2026/o-que-cai

## 2. Inventário de disciplinas — Cargo 01

O Anexo II contém **6 blocos de conhecimentos gerais** e **6 de específicos**. A coluna “Base existente” significa que a Central já possui uma disciplina correspondente, **não** que tenha sido validada a cobertura integral dos tópicos.

| Grupo | Disciplina/bloco literal do edital | ID da Central | Triagem |
| --- | --- | --- | --- |
| Gerais | Língua Portuguesa | pt | Base existente; validar assunto a assunto |
| Gerais | Matemática e Raciocínio lógico | rlm | Base existente; validar assuntos e estatística |
| Gerais | Noções de Legislação | — | Conteúdo próprio TRT8/CNJ/CSJT; mapear sem inventar disciplina pronta |
| Gerais | Noções de Direitos Humanos | — | Ausente como disciplina própria; avaliar vínculos com CF |
| Gerais | Noções sobre direitos das pessoas com deficiência | — | Ausente como disciplina própria; mapear legislação específica |
| Gerais | Noções de Informática | — | Ausente como disciplina própria |
| Específicos | Direito Constitucional | cf | Base existente; validar conteúdo TRTs/TST/CSJT |
| Específicos | Direito Administrativo | adm | Base existente; validar LINDB, servidores, licitações e LGPD |
| Específicos | Direito do Trabalho | trab | Base existente; conferir tópicos recentes e precedentes |
| Específicos | Direito Processual do Trabalho | ptra | Base existente; conferir PJe, precedentes e execução |
| Específicos | Direito Civil | civil | Base existente; verificar obrigações, coisas, família e sucessões |
| Específicos | Direito Processual Civil | cpc | Base existente; validar execução, recursos e precedentes |

**Triagem:** 8 blocos possuem disciplina correspondente; 4 blocos ainda não têm disciplina própria. Isso NÃO é percentual de cobertura do edital; o percentual verdadeiro exige auditoria tópico a tópico.

## 3. Auditoria técnica da Central atual

Arquivos verificados na main em 21/10/2026:
- `ui/study-objectives-catalog-v1.js`: objetivos por carreira, edital TJPB e estudo livre. A adição do TRT-8 deve usar ID próprio, sem alterar os IDs existentes.
- `ui/study-objectives-v1.js`: objetivo selecionado e filtros da Central; preservar seleção/progresso e lista de disciplinas permitidas.
- `ui/exam-verticalized-v1.js`: **fortemente acoplado ao TJPB** (`TJPB2026Verticalized` e `GOAL_ID` fixo); requer seleção por edital ou instância parametrizada. Não substituir a versão funcional sem testes.
- `api/objective.js`: `EXAM_ID='tjp-2026-aj-area-judiciaria'` e regex `^tjp-` fixos; requer exam_id validado server-side e tópicos pertencentes ao edital correspondente, com consulta/alteração restrita ao aluno autenticado.
- `content/tjpb-2026-verticalized.json` e `.js`: fonte TJPB com IDs estáveis; manter intocada.

## 4. Contrato de implementação da Etapa 5

1. **FONTE OFICIAL.** Conferir Edital 01 e retificações da FCC/DOU; preservar ordem do Anexo II, cabeçalhos, tópicos, notas e referências normativas. Não usar nomenclatura do TJPB por engano.
2. **MAPEAMENTO.** Transcrever o programa do cargo 01 em dados separados `content/trt8-2026-verticalized.json`. Cada bloco/assunto receberá ID imutável e links a módulos canônicos SOMENTE quando equivalência for validada.
3. **COBERTURA.** Usar categorias `complete`, `partial`, `preparation`, com justificativa rastreável por tópico; não inferir cobertura pela existência da disciplina.
4. **PLATAFORMA MULTI-EDITAIS.** Refatorar editor/tela e API para aceitar `examId` por lista confiável/registro no servidor. Não concatenar SQL a partir de input nem permitir acesso cruzado a progresso.
5. **PERSISTÊNCIA.** Chave de progresso no banco (`user_id`, `exam_id`, `topic_id`, `marker`), sem migração destrutiva. Manter compatibilidade TJPB existente, inclusive offline/PWA.
6. **INTEGRAÇÃO.** Links diretos abrem disciplina e módulo com expansor nativo; filtros TEC/QC e Lei em Dia só onde vinculados. Ausências ficam explicitamente “Em preparação”.
7. **HOMOLOGAÇÃO.** Preview e Neon isolados; dois alunos fictícios; testar troca TJPB↔TRT8, logout/login, offline, dados isolados e navegação desktop/tablet/mobile. Sem merge/produção antes de autorização específica.

## 5. Entrega da Etapa 5.1

- [x] Cargo 01 confirmado no edital oficial da FCC;
- [x] Estrutura de 12 blocos de disciplinas levantada no Anexo II;
- [x] Disciplinas da Central identificadas por seus IDs atuais;
- [x] Acoplamentos TJPB-only identificados no frontend e backend;
- [ ] Texto da retificação conferido diretamente em fonte oficial;
- [ ] Conteúdo programático totalmente transcrito e mapeado por assunto;
- [ ] Contagem objetiva de módulos cobertos/parciais/ausentes auditada;
- [ ] Interface multi-editais e backend implementados;
- [ ] Testes automatizados e homologação;
- [ ] Publicação expressamente autorizada.

**Regra:** nunca extrapolar “8 disciplinas com base existente” para “8 disciplinas completas”.
