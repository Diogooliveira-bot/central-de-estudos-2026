# Base Completa — Etapa 10.3 | Revisão editorial residual de CPC M01–M20

**Data:** 28/10/2026  
**Branch isolada:** `preview/legal-complete-premium-v1-20261025`  
**Escopo realizado:** revisão dirigida de trechos colados no CPC M05, verificação de capítulos/questões, triagem dos módulos de menor extensão e inventário dos riscos editoriais que permanecem. Sem publicar em Production, alterar `main`, banco Neon, conteúdo jurídico original, planos ou pagamentos.

## 1. Correção confirmada — teste final do M05

Duas junções indevidas adicionais foram encontradas nos dados extraídos do PDF, e corrigidas apenas na apresentação do leitor:

- **Questão 1 → Questão 2:** a sequência `mérito.2. O requerimento...` foi separada visualmente em resposta da questão 1, enunciado da questão 2 e respectivo gabarito, **sem inventar respostas**.
- **Questão 15 → Parte VIII:** a sequência `Gabarito: CERTO. Art. 129.PARTE VIII - ROTEIRO DE REVISÃO` foi separada em resposta da questão 15 e divisor de seção.

A interface do teste final agora distingue visualmente as **15 questões**. A questão nº 2 está em parágrafo de revisão, mantendo-se os 14 cabeçalhos H2 que já existiam para as outras questões. Essa opção **conserva os 69 H2 originais** do leitor e evita alterar as posições e os identificadores usados no índice e no progresso de leitura. O divisor **PARTE VIII** não ganhou ID de capítulo.

A rotina `repairM05FinalQuiz` é deliberadamente restrita a **duas correspondências literais verificadas na fonte**. Se a fonte mudar, não se faz divisão inferida. Arquivos `content/cpc/` e resumos permaneceram intactos; estilos específicos ficam em `ui/legal-complete-premium-v1.css` apenas para a apostila completa M05.

## 2. Testes e evidências

| Verificação | Resultado |
|---|---|
| [Auditoria editorial CPC M01–M20, run 40616347534](https://github.com/Diogooliveira-bot/central-de-estudos-2026/actions/runs/40616347534) | **60/60 cenários aprovados** (20 módulos × 390, 768 e 1366 px) |
| [Regressão CPC M02–M20, run 40616082342](https://github.com/Diogooliveira-bot/central-de-estudos-2026/actions/runs/40616082342) | **57/57 cenários aprovados**, com os mesmos leitores e mudanças visuais |
| [Capturas e métricas da auditoria, artefato 12784913993](https://github.com/Diogooliveira-bot/central-de-estudos-2026/actions/runs/40616347534/artifacts/12784913993) | ~2,74 MB; captura da questão 2, divisores e `metricas.json` |
| [Capturas e métricas da regressão, artefato 12785395982](https://github.com/Diogooliveira-bot/central-de-estudos-2026/actions/runs/40616082342/artifacts/12785395982) | ~7,82 MB, retenção prevista até 11/11/2026 |

A auditoria verifica a presença das questões nº 1 e 15 em H2, questão 2 em bloco separado e com fonte de 18 px, gabaritos 1/2/15 íntegros, os dois divisores corretos, capítulo 45 preservado, ausência das sequências coladas na renderização, ausência de novo ID de capítulo, tabela semântica existente, ausência de overflow da página e de erros de script. A regressão confirma preservação do resumo e dos capítulos marcados após reabrir.

**Histórico de ajustes no teste:** verificações e captura do divisor da Parte IV precisaram distinguir o novo divisor da Parte VIII; essa mudança foi limitada ao código de auditoria. A execução final é `40616347534`; execuções anteriores com testes desatualizados **não** devem ser consideradas aprovadas.

## 3. Triagem dos demais problemas e risco residual

- **CPC M05, outro limite colado:** foi detectada na fonte a junção `direito material.26. QUEM PODE REQUER - ART. 133`. A criação automática de um H2 alteraria a numeração de seções e poderia afetar checkpoints de alunos. **Não corrigida nesta execução**; requer projeto de migração de identificadores ou reparo visual sem novo H2 e validação específica.
- **M05 e outros módulos longos:** a ausência ou escassez de H3 pode refletir a estrutura de origem, não necessariamente um defeito. Não houve renivelamento automático de capítulos.
- **Quadros originais remanescentes:** apesar de existirem 20/20 módulos com ao menos uma tabela HTML de consulta, **essa cobertura não certifica que todos os demais quadros dos PDFs foram reconstruídos**. A revisão célula a célula de quadros adicionais continua pendente.
- **Módulos de texto curto:** M09 (4.572 caracteres), M10 (4.428), M15 (3.424) e M17 (3.131) têm teoria `complete` comparativamente curta. Isso **não demonstra, por si só, omissão**; cabe confrontar sua extensão com o programa editorial e com as fontes jurídicas de origem. O teste de presença textual devolveu zero linhas ausentes nesses módulos, mas não testa suficiência doutrinária.
- **Atualização jurídica e jurisprudencial:** requer revisão independente dos materiais completos, principalmente prazos, exceções, revogações, leis e precedentes referidos como recentes. **Não foi certificada pela auditoria de HTML**.

## 4. Próxima fase e critérios de aceite

**Etapa 10.4 — Homologação integrada de Preview privada:** antes de avançar para qualquer publicação, confirmar o SHA implantado, testar com aluno Premium e Gratuito de homologação, verificar que a apostila completa e as tabelas não são expostas indevidamente ao plano Gratuito, além de conferir leitura móvel e progresso real. Respeitar Vercel Deployment Protection, autenticação e autorização para qualquer atualização da Preview.

**Etapa 10.5 — Se necessária:** resolver pendências efetivas da validação integrada, o caso ainda sinalizado do título 26 do M05, os demais quadros e o aceite editorial humano. Essa etapa não substitui revisão jurídica atualizada nem representa autorização de publicação em Production.

**Conclusão:** melhorias do M05 tecnicamente aprovadas em Chromium. Revisão editorial/jurídica total **não encerrada** e Preview autenticada **não testada nesta etapa**. Não houve merge, publicação em Production ou alteração Neon.
