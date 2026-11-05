# Conteúdo neutro em relação às bancas — 05/11/2026

Base revisada: `422dc229f23d77ee2bdbbc9a6366b02d33e65ed6` (main).

Foram ajustadas 2.115 menções em 224 arquivos de conteúdo e apresentação. A revisão cobre títulos, apostilas, dicas, revisões, simulados autorais, fontes textuais reproduzíveis de Administrativo, dados nativos de Português e conteúdos legados ainda utilizados pela Central.

Exemplos:

| Antes | Depois |
| --- | --- |
| Pegadinha FCC | Pegadinha de prova |
| Foco FCC | Foco em concursos |
| A FCC pode… | A banca examinadora pode… |
| FCC/FGV em orientações gerais | Principais bancas |
| Bateria final FCC | Bateria final de questões |
| Revisão cumulativa FCC | Revisão cumulativa |

A redação singular foi mantida quando necessária para a concordância. Menções históricas em explicações foram convertidas em orientações para resolver a questão, sem atribuir automaticamente o comportamento a todas as bancas.

## Integridade

- Fontes de questões reais, nomes de bancas nos campos de origem, gabaritos, links TEC/QC, filtros, referências factuais de editais, identificadores e chaves de progresso foram preservados.
- Comparação dos arquivos alterados contra a base: nenhuma diferença nos campos `id`, `uid`, `moduleId`, `source`, `url`, `bank`, `bankLabel`, `stageLabel`, `sourceQuestionId`, `summaryDriveId`, `completeDriveId` e `r`, inclusive nas estruturas JSON serializadas.
- Comparação de todos os endereços HTTP/HTTPS e identificadores técnicos dos arquivos alterados: nenhuma alteração.
- Os arquivos de questões reais e os catálogos/filtros não receberam substituição geral de bancas.
- A consulta somente de leitura à tabela `central_content_overrides` no banco de produção retornou zero registros. Não houve modificação no banco.
- `scripts/build-home-progress.mjs` e `scripts/build-adm-approved-theory.mjs` foram executados para manter os arquivos derivados coerentes com as fontes.

## Verificação

- Suíte existente: 248 testes aprovados, 1 ignorado, nenhuma falha.
- Quatro testes adicionais verificam os títulos neutros de Português, os capítulos de Administrativo e Penal, o simulado de RLM e a identificação das 165 questões reais do CPC. Os quatro passaram.
- Verificação de sintaxe dos JavaScript alterados e `git diff --check`.

## Limites

Esta revisão altera o conteúdo textual do código da Central. Não reescreve textos incorporados em imagens, PDFs, arquivos ZIP de distribuição nem materiais hospedados fora do repositório. Nomes de banca continuam presentes onde identificam a origem real de uma questão, o edital de referência, um filtro ou uma referência específica do material utilizado.

As alterações permanecem na branch de revisão. A publicação do conteúdo depende de aprovação do proprietário, conforme as regras do projeto e `docs/PREVIEW_ACCESS.md`.
