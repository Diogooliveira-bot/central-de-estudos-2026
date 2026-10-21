# Base Completa 7.0 — Etapa 5.8 — TRT-8 Técnico Judiciário (cargo 21)

**Data:** 21/10/2026. **Branch de trabalho:** `feature/trt8-2026-tecnico-administrativo`. **Não publicado na Central oficial.**

## Objetivo e resultados

Continuação da auditoria dos 176 assuntos do cargo 21 (Técnico Judiciário, Área Administrativa) do TRT-8, programa extraído do edital FCC nº 01/2026, Anexo II, com retificação oficial do DOU nº 02/2026 já aplicada.

| Métrica | Etapa 5.7 | Etapa 5.8 |
|---|---:|---:|
| Disciplinas | 11 | 11 |
| Assuntos editoriais | 176 | 176 |
| Assuntos com vínculo temático | 91 | **101** |
| Links tópico → módulo | 114 | **134** |
| Assuntos sem módulo correspondente | 85 | **75** |

**Significado dos vínculos:** somente ID real e relação direta entre título do assunto do edital e título de módulo da Central; **cobertura parcial**. Ainda **não** foi auditado o texto integral da teoria, suas questões, referências legais ou suficiência para as cobranças da FCC.

## Português — lacuna de mapeamento corrigida

- Identificada a base autoritativa atual `portugues-site.js`, com **24 módulos**, IDs `m01` a `m24`; a fonte de teoria `portugues-autodidata-data.txt` foi descompactada **somente no CI** para comprovar títulos e conteúdo disponível, sem editar os textos da apostila.
- **10 dos 13 assuntos editoriais de Português** agora têm módulos correspondentes (20 relações de destino), entre eles Crase → M20; Interpretação de textos → M24; Concordância → M17/M18; Regência → M19; Acentuação/ortografia → M03/M04.
- Os **3 assuntos restantes** ficaram pendentes quando não havia título de módulo suficientemente específico.
- No assunto conjunto `trt8-tec-21-pt-001`, **Redação oficial ainda não possui cobertura confirmada**, mesmo com links para Acentuação e Ortografia; o checklist apresenta aviso explícito.
- Corrigidos espaços indevidos e três fragmentos de redação nos itens `-005`, `-008`, `-011` a `-013`. Cada item preserva seu ID estável e o texto extraído anterior no campo `sourceExtractedText` quando editado; `originalProgram` original da FCC não foi substituído.
- A numeração dos itens é interna e editorial; não afirmar que a FCC publicou **176 itens numerados**.

## Processo do Trabalho — ressalvas jurídicas visíveis

- Os links de PTRA se referem aos módulos nativos M01–M21 com navegação ajustada desde a Etapa 5.7.
- Alguns materiais PTRA possuem avisos próprios de cobertura parcial, fonte principal insuficiente ou referência quantitativa/jurídica a verificar. Os avisos foram preservados em `moduleEvidence.warning`.
- O leitor de editais agora mostra um **painel de aviso recolhível** (`ATUALIZAÇÃO JURÍDICA / CONTEÚDO PENDENTE`) nos assuntos com advertência ou lacuna identificada, em vez de ocultá-la.
- **ATUALIZAÇÃO JURÍDICA NECESSÁRIA** antes de afirmar que esses assuntos estão completamente cobertos; esta etapa não reescreveu fontes de Processo do Trabalho.

## Testes e integração

- CI executado na revisão `9f05d50686d09f2cc745825ff6aa26beab115fb2`: **137 testes, 136 aprovados, 0 falhas, 1 ignorado**.
- URL de CI: https://github.com/Diogooliveira-bot/central-de-estudos-2026/actions/runs/39690585322
- Verificações novas: IDs do curso atual de Português, quantidade de vínculos, preservação de 3 editais, correspondência JSON → dados JS, advertências jurídicas visíveis no DOM e cache offline versionado.
- Preview funcional da revisão acima: https://central-de-estudos-jsl0bwmnp-estudotd.vercel.app (Vercel `READY`, branch isolada).
- Workflow temporário de inspeção/validação removido após testes, gerando commit de limpeza `b2a4ad6ee7868d44d94409de8157d7d3cc57dbcf`. Isso não modifica o código funcional; uma nova Preview desse commit pode aparecer.
- Variáveis Vercel `DATABASE_URL`, `AUTH_SECRET`, `BACKUP_SECRET`, `EXAM_PROGRESS_PREVIEW_DB_ISOLATED` são restritas a esta branch e apontam para o Neon de homologação. A produção permanece em sua versão anterior.

## Etapa de homologação ainda pendente

1. **Login real com Aluno 1 e Aluno 2** na Preview atualizada, sem compartilhar senhas no chat.
2. Selecionar TRT-8 Técnico, abrir 11 disciplinas, verificar 176 tópicos, 101 assuntos com rotas e avisos de material parcial.
3. Testar abrir Português M20, PTRA M08 (aviso), RLM, CF, ADM e Trabalho, além de retornar corretamente ao edital.
4. Marcar Estudei, Revisei e Fiz questões, recarregar e alternar entre Técnico TRT-8, Analista TRT-8 e TJPB; confirmar persistência individual e sincronização offline quando possível.
5. Continuar a auditoria **dos 75 assuntos sem vínculo**, corrigir lacunas de teoria/lei seca e validar atualidade jurídica antes de qualquer alegação de cobertura integral.
6. Publicar Técnico somente com **autorização expressa posterior** — este relatório não autoriza merge nem alteração do banco de produção.

**Limitação declarada:** a abertura da tela protegida requer credenciais dos alunos fictícios; a suíte unitária automatizada e o status READY da Vercel não substituem teste manual de ponta a ponta.
