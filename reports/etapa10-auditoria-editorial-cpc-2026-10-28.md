# Base Completa — Etapa 10 | Auditoria editorial CPC M01–M20

**Data:** 28/10/2026  
**Escopo:** leitores das apostilas jurídicas completas de Processo Civil, branch `preview/legal-complete-premium-v1-20261025`.  
**Segurança:** nenhum arquivo da fonte original `content/cpc/` editado; nenhum acesso a Neon ou aluno real; sem publicação em Production, `main` ou Preview privada.

## Resultado técnico confirmado

- **60/60 cenários aprovados:** 20 leitores originais × Chromium em 390, 768 e 1366 px.
- [Execução final — GitHub Actions 40612533828](https://github.com/Diogooliveira-bot/central-de-estudos-2026/actions/runs/40612533828), `completed/success`, testada no commit `581bdbef5a1e879e0723fe2ca83c449e497e771a`.
- [Evidências — artefato 12783393871](https://github.com/Diogooliveira-bot/central-de-estudos-2026/actions/runs/40612533828/artifacts/12783393871): capturas de leitores/tabelas e `metricas.json`, cerca de 2,70 MB; retenção até aproximadamente 11/11/2026.
- **20/20 módulos** possuem pelo menos uma tabela com corpo, colunas, cabeçalhos semânticos, legenda e contêiner de rolagem horizontal. O viewport 390 px apresentou rolagem horizontal *da tabela*, sem transbordamento da página. Menor fonte medida nas células: **14 px**.
- Cada leitor possui título H1 e pelo menos um H2; sem exceção JS no Chromium. Isto não comprova qualidade editorial de todos os outros quadros, precisão jurídica, autorização Premium integrada ou equivalência com PDFs de origem.

## Correções de apresentação aplicadas e revalidadas

| Módulo | Correção confirmada | Observação |
|---|---|---|
| CPC M01 | Legenda semântica na tabela nativa de **14 linhas × 3 colunas** | Cabeçalhos/estrutura mantidos |
| CPC M02 | Removido o prefixo espúrio de **2 títulos** na exibição | IDs, fonte e progresso preservados |
| CPC M04 | Removido o prefixo espúrio de **2 títulos** na exibição | IDs, fonte e progresso preservados |
| CPC M06 | Corrigido rótulo exibido **“4. 2.6. Responsabilidade do juiz” → “2.6. Responsabilidade do juiz”** | ID original mantido; outro ponto do M06 segue pendente |

As cinco correções de título afetam somente `textContent` dos elementos já renderizados na modalidade **completa**. O texto-fonte original continua disponível nos arquivos do repositório, e a versão resumida não foi modificada. Cada título corrigido guarda `data-bc-original-heading` para rastreabilidade. A auditoria final exige explicitamente a presença dessas cinco correções e da legenda do M01.

## Inventário de títulos, fonte e quadros — viewport 390 px

| Módulo | H2/H3 | Quadros HTML | Diagnóstico de linhas não idênticas* |
|---|---:|---:|---:|
| M01 | 62 / 37 | 1 | 16/503 (3,2%) |
| M02 | 20 / 0 | 1 | 11/479 (2,3%) |
| M03 | 19 / 32 | 1 | 7/362 (1,9%) |
| M04 | 48 / 0 | 1 | 18/533 (3,4%) |
| M05 | 69 / 0 | 1 | 3/455 (0,7%) |
| M06 | 30 / 2 | 1 | 6/495 (1,2%) |
| M07 | 34 / 0 | 1 | 3/466 (0,6%) |
| M08 | 15 / 35 | 1 | 7/349 (2,0%) |
| M09 | 15 / 0 | 1 | 0 |
| M10 | 15 / 0 | 1 | 0 |
| M11 | 17 / 0 | 1 | 0 |
| M12 | 20 / 0 | 1 | 0 |
| M13 | 20 / 0 | 1 | 0 |
| M14 | 24 / 0 | 1 | 0 |
| M15 | 26 / 0 | 1 | 0 |
| M16 | 25 / 0 | 1 | 0 |
| M17 | 40 / 0 | 1 | 0 |
| M18 | 37 / 0 | 1 | 0 |
| M19 | 44 / 0 | 1 | 0 |
| M20 | 60 / 0 | 1 | 0 |

*Linha não idêntica significa apenas que uma linha longa da fonte, após normalização de espaços, não foi localizada **literalmente** no texto renderizado. Pode decorrer da remoção intencional de cabeçalhos/rodapés de PDF, quebra/união de parágrafos, mudança de rótulos, ou transformação em caixas de destaque. **Não é prova de conteúdo perdido.** Cada divergência deve ser cotejada visualmente antes de alterar a apostila; o arquivo `metricas.json` contém exemplos das linhas.

## Pendências e prioridades para acabamento editorial

1. **Prioridade alta — fonte versus leitor (M01–M08).** Cotejar as linhas divergentes com a apostila original e as evidências do Chromium. Não converter ou excluir parágrafos automaticamente. Distinguir metadados editoriais suprimidos de frases jurídicas efetivamente afetadas.
2. **Prioridade alta — M06, item de questão de revisão.** O título `20. 10. O MP, atuando como fiscal da ordem jurídica, pode recorrer.` continua como H2 por causa da estrutura da fonte. Verificar o índice e a persistência de leitura antes de transformar em item de lista/parágrafo.
3. **Prioridade média — estrutura hierárquica.** Alguns módulos longos têm muitos H2 e nenhum H3 (M05 = 69/0; M17 = 40/0; M19 = 44/0; M20 = 60/0). Conferir a distinção real entre capítulo, subtópico e questão, sem reclassificação em massa. O índice apresenta seleção de capítulos; nem todos os H2 entram necessariamente na navegação.
4. **Prioridade média — cobertura editorial.** Existir **um** quadro HTML por módulo não prova que os demais comparativos extraídos de PDF foram restaurados. Usar amostras de tabelas e conferir cabeçalho, fidelidade de células, ordem e exceções caso a caso.
5. **Prioridade média — suficiência e atualização jurídica.** Os campos `complete` de M09 (4.572 caracteres), M10 (4.428), M15 (3.424) e M17 (3.131) são curtos em relação a outros módulos. Isso **não prova** falta de conteúdo; requer confronto com o programa editorial, fontes jurídicas e materiais originais. Verificar vigência de legislação citada e jurisprudência separadamente.
6. **Homologação integrada bloqueada:** a Preview privada requer aprovação da proteção GitHub/Vercel e confirmação do commit realmente implantado. Testes locais não verificam login ou direitos de conta Premium. Não implantar em Production sem etapa autorizada.

## Próximo passo recomendado

**Etapa 10.1 — Cotejamento editorial dirigido do CPC M01–M08**, iniciando pelo M06 e pelos trechos não idênticos, com diffs auditáveis e capturas de antes/depois. Só depois considerar a auditoria jurídica/ editorial de M09–M20 e o teste integrado autenticado.

A aprovação nesta etapa é **técnica e restrita ao Chromium de testes**, não homologação editorial total.
