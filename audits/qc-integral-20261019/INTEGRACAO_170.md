# Integração QC — validação autenticada dos 170 candidatos

**Branch:** `audit/qc-integral-20261019`
**Produção:** não publicada
**Base de cadernos:** captura existente de 416 itens; não houve nova coleta.

## Resultado

- **163 novos filtros integrados** após abrir os cadernos em sessão autenticada e conferir a matéria das questões.
- **409 cadernos/links QC disponíveis aos alunos** contando os 335 do mapa principal e os 74 de Processo Civil, mantidos no mapa específico.
- **7 cadernos sem correspondência confirmada** permanecem apenas no catálogo administrativo.
- **58 pendências sem filtro exclusivo** continuam sem link de aluno (64 iniciais menos seis resolvidas com correspondência comprovada).
- O catálogo continua com os **416 IDs e URLs originais**; 409 estão vinculados e sete não são exibidos como filtro validado.

| Disciplina | Candidatos analisados | Novos filtros integrados |
|---|---:|---:|
| Direito Civil | 61 | 61 |
| Português | 27 | 27 |
| Direito Constitucional | 19 | 19 |
| Direito do Trabalho | 18 | 18 |
| Processo do Trabalho | 18 | 18 |
| Raciocínio Lógico | 17 | 14 |
| Direito Administrativo | 10 | 6 |
| **Total** | **170** | **163** |

## Sem correspondência confirmada

| Disciplina | ID | Motivo resumido |
|---|---:|---|
| Raciocínio Lógico | 15293311 | Etiquetas das questões são de fundamentos/negações lógicas; não correspondem a M08 (sequências). |
| Raciocínio Lógico | 15292720 | Questões de argumentação lógica; não correspondem a M09 (orientação espacial/temporal). |
| Raciocínio Lógico | 15292598 | Caderno amplo de M06; as questões amostradas não isolam com segurança o subtema de associação esperado. |
| Administrativo | 15285197 | Resultado concentra fases do processo licitatório, não impugnações/recursos de M16.5. |
| Administrativo | 15285176 | Resultado concentra sistema de registro de preços; vínculo com planejamento setorial M15.2 não ficou demonstrado. |
| Administrativo | 15285086 | Filtro amplo de aspectos da Lei 9.784/99, sem isolar extinção/revisão de M06.3. |
| Administrativo | 15285069 | Mistura responsabilidades e tópicos de agentes públicos; não confirma exclusivamente M05.5. |

Em RLM, os IDs corretos 15313089 (M08) e 15313108 (M09) foram integrados com base nos tópicos mostrados pelo QC. Os dois IDs históricos conflitantes acima foram preservados no catálogo, sem associação incorreta.

## Pendências e módulos sem QC confirmado

As seis pendências administrativas M04.1, M04.3, M08.1, M08.3, M14.3 e M15.1 foram resolvidas com filtro compatível. Permanecem 58 entradas pendentes no mapa, incluindo filtros específicos para os quais nenhum caderno exclusivo foi confirmado.

Módulos sem QC confirmado no inventário: Administrativo M07, M11, M19 e M20; Civil M03 e M10; Penal M01, M14 e M17; Processo Penal M02, M09 e M18; RLM M07 e RF; Processo do Trabalho M01, M06 e M11; Português M01, M13, M17 e M18. As pendências por submódulo continuam sinalizadas separadamente na matriz completa.

## Interface, links e preservação

Os 163 links novos usam os IDs e URLs capturados do QC. A camada comum de filtros lê o mapa QC para os módulos e a Central de Questões; os itens sem confirmação não entram no registro de aluno. Os filtros TEC e o mapa separado de CPC foram preservados. Os títulos QC com codificação corrompida recuperável foram corrigidos para exibição, mantendo a captura bruta no inventário.

A lista completa dos links está em `links-qc-integrados-novos.csv`. A matriz `matriz-qc-central.csv` e o catálogo administrativo derivam dos mesmos 416 registros; a seção administrativa conserva os sete não confirmados.

## Testes

Foram executados os testes unitários da Central de Questões, catálogo, mapa QC, Central de filtros externos e os testes gerais do repositório. A navegação para cada caderno foi aberta na sessão autenticada do QC; quantidade exibida e assuntos das questões foram conferidos. A navegação até uma página de questão, que pode depender de permissões e disponibilidade do QC, não foi usada como promessa de acessibilidade universal. Nenhum deploy de produção foi feito.
