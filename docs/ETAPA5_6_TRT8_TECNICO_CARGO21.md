# BASE COMPLETA — ETAPA 5.6 | TRT-8 Técnico Judiciário — Área Administrativa

**Estado:** EM DESENVOLVIMENTO NA BRANCH `feature/trt8-2026-tecnico-administrativo`. **NÃO publicado.**
**Cargo oficial:** **21 — Técnico Judiciário — Área Administrativa**, do **Edital TRT-8 nº 01/2026** da FCC.
**Fontes:** https://www.concursosfcc.com.br/concursos/trt8r126/trt8r126_edital_de_abertura.pdf (Anexo II, pp. 47–48, 73–74); retificação DOU 08/10/2026: https://www.in.gov.br/web/dou/-/edital-n-2-de-7-de-outubro-de-2026-737300524

## Conteúdo do cargo 21: 11 blocos, 176 assuntos

**Conhecimentos Gerais (6):** Língua Portuguesa (13); Matemática e Raciocínio lógico (12); Noções de Legislação (8); Noções de Direitos Humanos (10); Direitos das pessoas com deficiência (7); Noções de Informática (15).

**Conhecimentos Específicos (5):** Noções de Direito Constitucional (18); Noções de Direito Administrativo (35); Noções de Administração Pública (13); Noções de Direito do Trabalho (32); Noções de Direito Processual do Trabalho (13).

Os números entre parênteses são divisões editoriais para o checklist. **Não correspondem a uma contagem de tópicos oficialmente numerados pela FCC.**

## Cobertura e integração

| Grupo | Disciplinas | Situação |
|---|---|---|
| 6 blocos com disciplina correspondente | Português; RLM; Constitucional; Administrativo; Direito do Trabalho; Processo do Trabalho | Base existente; **sem equivalência tópico↔módulo auditada** |
| 5 blocos sem disciplina própria | Legislação específica; Direitos Humanos; Pessoas com Deficiência; Informática; Administração Pública | Conteúdo em preparação |

- O texto da Resolução TRT-8 nº **065/2025 alterada pela nº 23/2026** substituiu a referência anterior nº 067/2021, conforme retificação oficial.
- Dataset de preparação: `content/trt8-2026-tecnico-administrativo.json`.
- Dataset browser: `content/trt8-2026-tecnico-administrativo.js`.
- Novo objetivo `exam-trt8-2026-tecnico-administrativa`, sem alterar `career-tribunais-tecnico`.
- Identificador único do edital `trt8-2026-tecnico-administrativa-21`, IDs de assunto exclusivos, isolados dos exames TJPB Analista e TRT-8 Analista.
- Checklist com 3 marcadores por tópico e API de progresso com lista de tópicos permitidos por edital.
- **Todos os 176 `moduleIds` estão vazios** até a revisão editorial; não apresentar como conteúdo completamente coberto nem atribuir links por analogia.
- Os cargos TRT-8 **22 (Enfermagem), 23 (TI) e 24 (Agente da Polícia Judicial)** são diferentes, com programas distintos: não reutilizar indevidamente o cargo 21. Podem ser mapeados em etapas futuras.
- **TJPB 2026:** o edital oficial da FGV publicado em 20/10/2026 prevê Analistas, não Técnico. Preservar a trilha geral `career-tribunais-tecnico` como estudo por carreira e não fabricar um edital de Técnico TJPB 2026.

## Gates restantes

1. Rodar suíte automatizada completa em branch de desenvolvimento.
2. Auditar 176 divisões OCR/assuntos e indicar links reais aos módulos (título não é suficiente para declarar cobertura integral).
3. Testar 3 editais no navegador com dois alunos, sincronização de progresso e troca entre editais, usando Neon homologação isolado.
4. Homologar navegação, marcações e cache PWA da nova branch.
5. Solicitar autorização específica **antes de publicar Técnico**. A publicação Multi-Editais Analista de 21/10/2026 permanece intocada.
