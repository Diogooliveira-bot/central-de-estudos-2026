# Inventário — Atividades Interativas de Português

Gerado a partir de `portugues-autodidata-data.txt`. Total identificado: **1802 atividades**.

| Módulo | Total | Guiada | Independente | Revisão ativa | Miniteste | Saída | Cumulativa | Auto | Sem resposta original |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| m01 | 72 | 8 | 24 | 20 | 10 | 10 | 0 | 16 | 20 |
| m02 | 32 | 5 | 6 | 10 | 5 | 6 | 0 | 6 | 10 |
| m03 | 44 | 4 | 8 | 15 | 7 | 10 | 0 | 8 | 15 |
| m04 | 75 | 6 | 24 | 20 | 8 | 17 | 0 | 18 | 20 |
| m05 | 71 | 10 | 15 | 20 | 8 | 18 | 0 | 15 | 20 |
| m06 | 54 | 6 | 10 | 18 | 7 | 13 | 0 | 10 | 18 |
| m07 | 74 | 11 | 14 | 23 | 8 | 18 | 0 | 14 | 23 |
| m08 | 65 | 7 | 10 | 25 | 8 | 15 | 0 | 10 | 25 |
| m09 | 76 | 7 | 20 | 25 | 8 | 16 | 0 | 20 | 25 |
| m10 | 68 | 8 | 10 | 24 | 8 | 18 | 0 | 10 | 24 |
| m11 | 67 | 8 | 15 | 21 | 10 | 13 | 0 | 15 | 21 |
| m12 | 67 | 3 | 15 | 25 | 10 | 14 | 0 | 10 | 25 |
| m13 | 72 | 10 | 12 | 25 | 10 | 15 | 0 | 1 | 25 |
| m14 | 88 | 10 | 20 | 26 | 10 | 22 | 0 | 20 | 26 |
| m15 | 80 | 8 | 20 | 26 | 10 | 16 | 0 | 20 | 26 |
| m16 | 71 | 10 | 10 | 24 | 8 | 19 | 0 | 10 | 24 |
| m17 | 76 | 10 | 10 | 29 | 10 | 17 | 0 | 10 | 29 |
| m18 | 85 | 11 | 20 | 29 | 10 | 15 | 0 | 20 | 29 |
| m19 | 82 | 8 | 20 | 30 | 10 | 14 | 0 | 20 | 30 |
| m20 | 85 | 10 | 15 | 30 | 10 | 20 | 0 | 15 | 30 |
| m21 | 71 | 9 | 10 | 27 | 10 | 15 | 0 | 10 | 27 |
| m22 | 76 | 6 | 20 | 26 | 10 | 14 | 0 | 20 | 26 |
| m23 | 71 | 8 | 10 | 29 | 10 | 14 | 0 | 10 | 29 |
| m24 | 96 | 8 | 25 | 35 | 10 | 18 | 0 | 25 | 35 |
| review | 84 | 0 | 0 | 0 | 0 | 0 | 84 | 0 | 0 |

## Totais por modalidade

- guided: 191
- independent: 363
- active: 582
- mastery: 215
- exit: 367
- cumulative: 84

## Situação editorial

- Respostas associadas: 853
- Correção objetiva automática: 333
- Sem resposta-modelo no original: 582
- Autoavaliações/checklists: 367

## Implementação e segurança

- Um único componente reutilizável atende M01–M24 e a revisão cumulativa.
- IDs estáveis seguem o padrão `pt-<módulo>-<modalidade>-<ordem>`.
- Tentativas e textos usam chaves sincronizáveis com escopo explícito do usuário autenticado.
- Gabaritos antigos permanecem no DOM e só são ocultados quando todas as respostas da seção foram associadas.
- Teoria, links externos, conclusão dos módulos e progresso legado não são reescritos.

## Testes automatizados

- Abertura e transformação dos 24 módulos e da revisão final.
- Unicidade dos IDs e contagem do inventário.
- Revelação da prática guiada e ocultação inicial da resposta.
- Correção objetiva, feedback imediato e histórico de tentativas.
- Persistência isolada por usuário.
- Associação integral dos 84 itens da revisão cumulativa.
- Suíte completa do repositório: 35 testes aprovados.

## Limitações do conteúdo original

- As 582 perguntas de revisão ativa não possuem resposta-modelo ou comentário no material-fonte. Elas aceitam e salvam a tentativa, mas não recebem correção inventada.
- Os 367 itens de teste de saída são critérios/checklists de domínio, não perguntas com gabarito; por isso registram autoavaliação.
- Questões discursivas exibem resposta-modelo para comparação e não atribuem acerto/erro semanticamente.
