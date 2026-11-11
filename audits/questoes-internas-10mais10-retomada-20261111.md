# Base Completa — questões internas 10 + 10 — auditoria de retomada
Data da revisão: 10/11/2026 (noite, horário do Ceará).

## Regra aprovada
Para cada módulo, as **10 questões autorais** da versão resumida ficam em um questionário independente, fora da leitura. A versão completa reserva **10 questões de bancas reais**, ainda não cadastradas; até lá apresenta apenas **“Questões de bancas reais — em breve”**. Uma questão de origem autoral não pode ser identificada como questão oficial de banca.

## Situação técnica por disciplina (na PR #254, sem publicação)
| Disciplina | Módulos | Estrutura 10 + 10 | Origem atual do banco autoral |
|---|---:|---|---|
| Direito Constitucional | 15 | Adaptada | Questões internas autorais preexistentes, reaproveitadas e deduplicadas |
| Direito Civil | 15 | Adaptada | Questões internas preexistentes, com verificação editorial ainda necessária |
| Raciocínio Lógico | 15 | Adaptada | M01 possui dez novas; M02–M15 reutilizam baterias atuais |
| Direito Penal | 17 | Adaptada | 170 questões autorais preexistentes em baterias separadas |
| Direito Administrativo | 20 | Adaptada | M03 recebeu dez questões objetivas originais comentadas; outros usam fonte interna ou questões abertas derivadas da teoria |
| Direito Processual Penal | 22 | Adaptada | Bateria externa à leitura; banco original de 330 questões não excluído nem recadastrado como oficial |
| Direito Processual Civil | 20 | Adaptada | M01 recebeu dez questões objetivas originais comentadas; M02–M20 ainda usam perguntas abertas de recuperação de teoria |
| Português | 24 | Adaptada | M01–M24 têm perguntas abertas geradas da leitura; **ainda não há dez questões objetivas editorialmente revisadas por módulo** |

**Total: 148 módulos.** O fato de o mecanismo conseguir apresentar dez itens por módulo **não equivale à aprovação pedagógica de 1.480 questões**.

## Melhorias desta rodada
1. Atualizada a branch da PR #254 com a `main` em `2184e727`, preservando as vinte apostilas autorais recém-publicadas de Administrativo e as automações de e-mail.
2. Corrigido o conflito de integração em `ui/adm-native-layer.js`: a versão nova das apostilas segue intacta e o componente de questões separado permanece funcional.
3. Corrigida a referência do leitor ADM no manifesto offline.
4. Revisados testes de Processo Penal: 330 itens legados preservados na fonte, sem questões intercaladas, e questionário independente com respostas e armazenamento próprios.
5. Criadas e conferidas **10 questões objetivas novas** em `content/adm/m03-authorial10-v1.js` (atos administrativos), com comentários e referências aos arts. 2º, 11, 50, 53–55 da Lei 9.784/1999 e institutos doutrinários.
6. Criadas e conferidas **10 questões objetivas novas** em `content/cpc/m01-authorial10-v1.js` (normas fundamentais), com comentários baseados nos arts. 2º–14 do CPC.
7. Corrigido o diagnóstico de navegação para reconhecer `MÓDULO 01` sem erro de caixa; não altera a numeração apresentada ao aluno.

## Validações
No commit `0ca9c39f1b90c9190c72ca2f9687dd594c306baf`, nove workflows do GitHub Actions chegaram a **success**: Penal V3 (incluindo a regressão de questões das oito disciplinas), Administrativo Apostilas, Administrativo Revisão, Navegador Aluno Gratuito, PWA, Resend, Editor Premium, Integração Controlada e Lei em Dia ADM.

## Pendências que impedem publicação
- **Questões ainda não revisadas editorialmente em todos os módulos**: muitos conjuntos são derivados automaticamente de títulos e parágrafos e não são equivalentes a exercícios autorais cuidadosamente redigidos.
- Rever individualmente pertinência do conteúdo, correção jurídica/gramatical, enunciado, alternativas plausíveis, resposta única, justificativa e ausência de repetição.
- Verificar em Preview isolada, especialmente em mobile, que cada botão abre o questionário correto e que não aparecem questões no meio da leitura.
- Conferir proteção de Premium: o aviso de questões reais não deve liberar conteúdo completo.
- As 10 questões reais de banca ficam **somente reservadas**, sem inventar origem, banca, ano ou enunciados.

**Status: PR #254 EM RASCUNHO — NÃO PUBLICAR NA PRODUÇÃO.**
