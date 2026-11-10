# Base Completa — inclusão das apostilas autorais na revisão de ADM

Origem: pacote enviado em 10/11/2026, composto de 20 arquivos Word e 20 PDFs correspondentes. Os Word são a fonte de edição e os PDFs, versões de leitura.

## Revisão
- Foram inspecionados os 20 Word, com cerca de 65.535 palavras de texto didático após remover capas/sumários.
- Verificações normativas pontuais sobre EC 138/2025 (acumulação), EC 139/2026 (Tribunais de Contas), Lei 15.352/2026 (ANPD), Lei 15.364/2026 (OSCIP), Lei 8.429/1992, Lei 11.079/2004, Decreto 12.807/2025 (2026).
- Correções pontuais de redação em M01, M05 e M17.
- HTML sem scripts incorporados, com 43 tabelas preservadas e 20 arquivos JS comprimidos e individuais.

## Destino
- `content/adm/autor-20261110/adm-m01-submitted-review.js` até `adm-m20-submitted-review.js`.
- A alteração é **somente da leitura resumo**; manter a teoria completa e as questões internas existentes sem alterar suas chaves de progresso.
- Trocar `ui/adm-apostila-reading-v1.js` pelo leitor de importação incluído no pacote gerado para este projeto.
- Acrescentar CSS editorial responsivo contido no pacote.

## TESTES DE ACEITAÇÃO ANTES DE MERGE
1. Os 20 arquivos autorais devem existir de fato no repositório, não apenas o manifesto.
2. O leitor deve conseguir descompactar os 20 documentos e renderizar títulos, parágrafos, links e as 43 tabelas.
3. A parte de questões do resumo tem de permanecer literalmente idêntica ao conteúdo original de `mXX-apostila-summary.js`.
4. Os 20 textos completos têm de permanecer idênticos.
5. Revalidar limites legais de 2026 e vigência ao publicar.
6. Testar prévia sem login para verificar desktop/mobile, sem exposição de dados privados.
7. Executar CI e confirmar implantação `READY` da versão aprovada.

## Estado
**EM PREPARAÇÃO.** Os arquivos convertidos foram gerados no ambiente de artefatos do ChatGPT, mas ainda não foram enviados binariamente ao repositório pelo conector GitHub disponível nesta conversa. Não efetuar merge nem anunciar a publicação antes desse envio e dos testes.
