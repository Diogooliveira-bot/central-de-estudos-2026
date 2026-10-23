# Base Completa — Etapa 5.15 | Complementos do TRT-8 Técnico Judiciário

**Cargo:** TRT-8 2026, Técnico Judiciário — Área Administrativa (cargo 21).
**Branch:** `feature/trt8-2026-tecnico-administrativo`.
**Estado:** **7 novas aulas produzidas**, versão editorial `draft_editorial_review`. **Sem integração, testes manuais, merge ou publicação**.

## Continuidade real do projeto

O repositório já continha as **Etapas 5.12 e 5.13 concluídas em conteúdo** e uma auditoria da **Etapa 5.14** quando esta etapa foi iniciada. Nenhum material de Legislação ou Informática foi refeito. A lista original de lacunas está em `docs/ETAPA5_14_TRT8_TECNICO_LACUNAS.json`, com **22 assuntos sem vínculo com módulo preexistente nem aula nova**.

## Novo lote

| Disciplina | Assunto do edital | Complemento | Questões comentadas |
|---|---|---|---:|
| Português | `trt8-tec-21-pt-005` | Discursos direto, indireto e indireto livre; intertextualidade, figuras e morfossintaxe | 2 |
| Português | `trt8-tec-21-pt-011` | Reconhecimento de frases corretas/incorretas | 2 |
| Português | `trt8-tec-21-pt-013` | Equivalência e transformação de estruturas | 2 |
| RLM | `trt8-tec-21-rlm-001` | Relações entre pessoas, posições e objetos | 2 |
| RLM | `trt8-tec-21-rlm-002` | Dedução necessária, possibilidades e contraexemplos | 2 |
| Direito Constitucional | `trt8-tec-21-cf-016` | Conselho Superior da Justiça do Trabalho (CSJT) | 2 |
| Processo do Trabalho | `trt8-tec-21-ptra-003` | Secretarias das Varas e distribuidores | 2 |
| **Total** | **7** | **7 aulas** | **14** |

Todos os complementos mantêm a estrutura didática: objetivo; **primeira leitura em dois blocos explicativos**; funcionamento passo a passo; exemplo concreto; aprofundamento; resumo ativo; pegadinhas; **duas questões originais com quatro alternativas, gabarito e comentários**; checklist de quatro itens. **28 itens de checklist**.

## Bases e ressalvas

- Português e RLM: complementar os cursos existentes da Base Completa, sem sobrescrever `portugues-site.js` nem as teorias já aprovadas. Em Português, a palavra **“redação”** do assunto `pt-011` foi tratada como confronto e correção de frases, **não** automaticamente como programa inteiro de redação oficial.
- CSJT: **CF art. 111-A, § 2º, II** e **Lei 14.824/2024**, que especifica competências de supervisão e composição de **12 membros**. Textos federais conferidos diretamente no Planalto. Fonte: https://www.planalto.gov.br/ccivil_03/_ato2023-2026/2024/lei/l14824.htm
- Serviços auxiliares: CLT **arts. 710–715**; cuidado explícito com a terminologia histórica de **“Juntas de Conciliação e Julgamento”** e as atuais **Varas do Trabalho** após a EC 24/1999. Fonte: https://www.planalto.gov.br/ccivil_03/decreto-lei/del5452compilado.htm
- **ATUALIZAÇÃO JURÍDICA NECESSÁRIA**: verificar alterações posteriores e regulamentações do CSJT/TRT-8; conferir a aplicabilidade atual e o processo eletrônico nos serviços auxiliares. As apostilas são explicações didáticas fundamentadas em fontes legais identificadas, **não equivalem à auditoria integral de normas locais**.
- Questões **autorais**, não copiadas nem atribuídas à FCC.

## Arquivos produzidos

1. `content/trt8-2026-tecnico-complementos-etapa5-15.json` — texto estruturado das sete aulas.
2. `content/trt8-2026-tecnico-complementos-etapa5-15.js` — serialização para integração futura, `window.TRT8TechComplementLessons`.

**A interface do Edital Verticalizado, os vínculos existentes e as marcações dos alunos não foram modificados.** O botão de teoria para estes complementos ainda não está habilitado. Os testes funcionais permanecem para o final da produção, conforme pedido do responsável.

## Balanço de produção TRT-8 Técnico

- Etapas 5.9–5.13: **53 aulas e 106 questões autorais comentadas**.
- Etapa 5.15: **7 aulas e 14 questões comentadas**.
- **Total novo produzido: 60 aulas e 120 questões comentadas**.
- Conforme a auditoria da Etapa 5.14, havia 22 assuntos pendentes. Com os 7 complementos produzidos nesta fase, **restam 15** sem módulo preexistente identificado nem apostila complementar produzida. Esta é contagem de produção, **não** de conteúdos juridicamente homologados ou publicados.

## Próxima produção — Etapa 5.16

Complementar os **15 assuntos remanescentes**, concentrados em **5 tópicos de Direito Administrativo** e **10 tópicos de Direito do Trabalho**, com verificação jurídica específica para crimes licitatórios, abuso de autoridade, Lei 11.416/2006, CLT e jurisprudência vinculante. Não inventar equivalências com cadernos TEC/QC ou afirmar atualização de súmula sem conferir os repositórios oficiais vigentes.

Depois da produção: revisão integral dos novos conteúdos, integração autorizada ao leitor da Central, homologação técnica com alunos fictícios, verificação do cache PWA e solicitação expressa de publicação.
