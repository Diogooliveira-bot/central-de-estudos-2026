# Base Completa — Etapa 10.2 | Separação editorial do CPC M05

**Data:** 28/10/2026.  
**Escopo:** exclusivamente apresentação da apostila completa M05 de Direito Processual Civil e testes de regressão na branch `preview/legal-complete-premium-v1-20261025`.

## Defeito observado e correção

A extração textual do PDF continha, no contexto de **amicus curiae**, a sequência contínua:

`IRDR são exceções expressasPARTE IV - PEGADINHAS FCC`

A junção indevida fazia a divisão da **PARTE IV — PEGADINHAS FCC** parecer parte da frase anterior. O leitor `ui/cpc-m05-native-study-reader.js` agora restaura, **somente na renderização do modo completo**, duas separações de linha entre `expressas` e `PARTE IV`. O divisor de seção recebe um estilo tipográfico de identificação editorial sem virar um novo H2 (sem alterar ordem de capítulos, IDs ou progresso).

O parser também foi ajustado, **exclusivamente para a linha literal** `PARTE IV - PEGADINHAS FCC`, para não confundir a palavra `PEGADINHAS` com uma caixa de destaque. O texto da fonte `content/cpc/m05-native-data.js` permaneceu intacto, inclusive a sequência original para auditoria. A seção seguinte `41. AS 18 CONFUSÕES MAIS IMPORTANTES` continua um título H2.

A apresentação está no CSS Premium com escopo específico para o M05. A versão resumida não recebe esse reparo.

## Testes reais confirmados

| Verificação | Resultado |
|---|---|
| [Auditoria editorial CPC M01–M20 — run 40615263401](https://github.com/Diogooliveira-bot/central-de-estudos-2026/actions/runs/40615263401) | **60/60 casos aprovados** em 390, 768 e 1366 px |
| [Regressão CPC M02–M20 — run 40615263698](https://github.com/Diogooliveira-bot/central-de-estudos-2026/actions/runs/40615263698) | **57/57 casos aprovados** em 390, 768 e 1366 px |
| [Evidências da auditoria — artefato 12784812995](https://github.com/Diogooliveira-bot/central-de-estudos-2026/actions/runs/40615263401/artifacts/12784812995) | Capturas, inclusive `m05-390-parte-iv.png`, e métricas |
| [Evidências de regressão — artefato 12784902747](https://github.com/Diogooliveira-bot/central-de-estudos-2026/actions/runs/40615263698/artifacts/12784902747) | 57 capturas e métricas; expiração estimada em 11/11/2026 |

Os testes verificaram a existência de um único divisor da PARTE IV, preservação literal da cláusula precedente, ausência de título colado no DOM, presença e posição da seção 41, fonte de 16 px do divisor e ausência de novo ID de capítulo. A regressão confirmou isolamento do resumo, persistência de capítulos, tabela consultiva preservada, navegação e ausência de erros JavaScript.

A primeira execução de auditoria falhou corretamente: o parser interpretou a linha `PEGADINHAS` como callout. A correspondência exata foi adicionada à exceção do parser e a execução corrigida passou; nenhum dado jurídico foi alterado.

## Limitações e próximas fases

A aprovação é **técnica no Chromium isolado**, não revisão humana completa do texto, certificação jurídica nem homologação da conta Premium no Vercel.

Após esta etapa, estimam-se **2–3 fases** para fechar **esta frente de acabamento CPC**, condicionadas aos achados:
1. **10.3 — Revisão editorial residual:** títulos, demais quadros e suficiência de conteúdo, priorizando problemas comprovados.
2. **10.4 — Homologação privada integrada:** testar o leitor autenticado com plano Premium e comprovar isolamento do plano Gratuito. A Preview pode exigir autorização para atualização.
3. **10.5, se necessária — Correções finais e aceite editorial:** consolidar resultados e aprovar tecnicamente a versão candidata; publicação Production é etapa separada e depende de autorização.

Atualização jurídica de leis e jurisprudência e os demais componentes da plataforma seguem como frentes distintas.

**Segurança:** não houve alterações em `main`, Production, banco Neon, permissões, cobrança ou material jurídico original.
