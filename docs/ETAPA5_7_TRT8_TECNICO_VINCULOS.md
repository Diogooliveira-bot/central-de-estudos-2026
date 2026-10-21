# BASE COMPLETA 7.0 — ETAPA 5.7 | Mapeamento Técnico TRT-8 — Cargo 21

**Ambiente:** `feature/trt8-2026-tecnico-administrativo`, branch separada da produção. **Status:** pré-mapeamento conservador concluído; validação jurídica e Preview final pendentes. **Não publicar.**

## Auditoria de tópicos e rotas (21/10/2026)

Fonte: FCC Edital nº 01/2026, Anexo II — **Técnico Judiciário, Área Administrativa, cargo 21**; retificação oficial Edital nº 02/2026 do DOU (08/10/2026), já aplicada no JSON da Etapa 5.6.

| Área | Tópicos editoriais | Com link de módulo | Sem link |
|---|---:|---:|---:|
| Língua Portuguesa | 13 | 0 | 13 |
| Matemática e Raciocínio Lógico | 12 | 10 | 2 |
| Noções de Legislação TRT-8 | 8 | 0 | 8 |
| Direitos Humanos | 10 | 0 | 10 |
| Pessoa com Deficiência | 7 | 0 | 7 |
| Informática | 15 | 0 | 15 |
| Noções de Direito Constitucional | 18 | 17 | 1 |
| Noções de Direito Administrativo | 35 | 30 | 5 |
| Administração Pública/Gestão | 13 | 0 | 13 |
| Noções de Direito do Trabalho | 32 | 22 | 10 |
| Noções de Direito Processual do Trabalho | 13 | 12 | 1 |
| **Total** | **176** | **91** | **85** |

**114 relações tópico→módulo** distribuídas pelos 91 tópicos. Isso NÃO significa 114 módulos distintos nem cobertura integral da teoria.

### O que significa “vínculo auditado” aqui

Os links foram verificados **contra os IDs e os títulos do catálogo canônico da Central**, incluindo a estrutura nativa de Processo do Trabalho (21 módulos). A seleção é conservadora: tópico e título do destino tratam diretamente do mesmo assunto. Os estados são:

- `thematic_title_matched_content_review_pending`: rota selecionada; `coverage=partial`; ainda é necessária conferência do corpo da teoria, legislação e questões.
- `pending_content_review`: módulo NÃO vinculado; `coverage=to_audit`, apresentado como “Em preparação”.

**Não afirmar que 91 tópicos estão completamente cobertos.** Não inventar links nem preencher lacunas externas sem fontes.

### Ajustes técnicos realizados

- `content/trt8-2026-tecnico-administrativo.json` contém `moduleIds`, `moduleEvidence`, `mappingEvidence`, avisos e o resumo dos 91 tópicos vinculados.
- `content/trt8-2026-tecnico-administrativo.js` sincronizado com o JSON.
- Navegação nativa `ui/study-navigation.js`: adicionou seletor `.ptra-native-mod`, atributo `data-ptra-module` e cabeçalho `.ptra-native-mod-head`, para abrir os módulos com números reais M01–M21 em vez dos IDs de um catálogo antigo de apenas 11 agrupamentos.
- Atualizada a versão do cache PWA para `20261021-multiexam-tech21-v2`.
- Progresso mantém IDs separados por `user_id`, `exam_id` e `topic_id`, sem mexer no TJPB/Analista.

### Pendências editoriais prioritárias

1. **Português — 13 tópicos sem links:** a Central possui curso atual de 24 módulos, mas o arquivo do catálogo genérico não corresponde de forma verificável aos IDs do curso atual. Não reutilizar links antigos de Português por suposição. Auditar os nomes e IDs atuais de `CentralPortugueseCourse`.
2. **Administração Pública (Gestão) — 13 tópicos:** disciplina específica não existe atualmente; não confundir gestão pública com Direito Administrativo.
3. **Legislação do TRT-8, Direitos Humanos, PcD e Informática:** construir materiais específicos a partir de fontes oficiais aprovadas, sem apresentar como prontos.
4. **Processo do Trabalho:** o próprio `content/ptra/ptra-native-index.js` contém advertências editoriais em M08, M10 e M13. Os vínculos relevantes mantêm `moduleEvidence.warning`, inclusive indicações de fonte parcial ou referência legal/quantitativa para verificar. **ATUALIZAÇÃO JURÍDICA NECESSÁRIA** antes de certificar a teoria integral.
5. **Ortografia do texto extraído do PDF:** há segmentações e espaços indevidos de OCR (ex.: “tra balho”, “organiza cional”), além de itens fracionados por pontuação. Preservar `originalProgram` e cotejar as 176 divisões com o PDF oficial antes de marcar o edital como editorialmente definitivo. Não inventar uma numeração oficial que a FCC não publicou.

## Validação

- GitHub Actions: https://github.com/Diogooliveira-bot/central-de-estudos-2026/actions/runs/39640835013 — **134 testes: 133 aprovados, 0 falhas, 1 ignorado**.
- As primeiras execuções falharam por expectativas antigas de seletores de navegação; os testes foram atualizados para abranger os seletores adicionais, e a execução acima concluiu sem falhas.
- A branch possui variáveis de **Preview** separadas para o Neon de homologação, sem tocar produção.
- A Vercel retornou **402 `api-deployments-free-per-day`** quando foi solicitada manualmente a implantação desta branch. Existem Previews **anteriores** de commits incompletos, mas **NENHUMA deve ser usada para homologar os 91 vínculos** sem verificar que contém o commit final de Etapa 5.7.
- **Teste real de navegador dos links e sincronização ainda NÃO executado nesta etapa.** Requer Preview `READY` no commit final.

## Próximo gate

**Etapa 5.8:** obter Preview do SHA atual quando liberada pela Vercel, autenticar com alunos fictícios no banco Neon de homologação, confirmar 91 vínculos/11 blocos/176 tópicos, testar navegação PTRA/CF/ADM/RLM/Trabalho, marcadores e alternância entre três editais, verificar offline/PWA e reportar. **Sem merge/publicação sem autorização expressa.**
