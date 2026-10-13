# Inventário — Atividades Interativas de Português

Gerado a partir de `portugues-autodidata-data.txt`. Total identificado: **1435 atividades**.

| Módulo | Total | Questões guiadas | Estilo prova | Revisão do módulo | Correção automática | Sem resposta original |
|---|---:|---:|---:|---:|---:|---:|
| m01 | 62 | 8 | 34 | 20 | 16 | 20 |
| m02 | 26 | 5 | 11 | 10 | 6 | 10 |
| m03 | 34 | 4 | 15 | 15 | 8 | 15 |
| m04 | 58 | 6 | 32 | 20 | 18 | 20 |
| m05 | 53 | 10 | 23 | 20 | 15 | 20 |
| m06 | 41 | 6 | 17 | 18 | 10 | 18 |
| m07 | 56 | 11 | 22 | 23 | 14 | 23 |
| m08 | 50 | 7 | 18 | 25 | 10 | 25 |
| m09 | 60 | 7 | 28 | 25 | 20 | 25 |
| m10 | 50 | 8 | 18 | 24 | 10 | 24 |
| m11 | 54 | 8 | 25 | 21 | 15 | 21 |
| m12 | 53 | 3 | 25 | 25 | 10 | 25 |
| m13 | 57 | 10 | 22 | 25 | 1 | 25 |
| m14 | 66 | 10 | 30 | 26 | 20 | 26 |
| m15 | 64 | 8 | 30 | 26 | 20 | 26 |
| m16 | 52 | 10 | 18 | 24 | 10 | 24 |
| m17 | 59 | 10 | 20 | 29 | 10 | 29 |
| m18 | 70 | 11 | 30 | 29 | 20 | 29 |
| m19 | 68 | 8 | 30 | 30 | 20 | 30 |
| m20 | 65 | 10 | 25 | 30 | 15 | 30 |
| m21 | 56 | 9 | 20 | 27 | 10 | 27 |
| m22 | 62 | 6 | 30 | 26 | 20 | 26 |
| m23 | 57 | 8 | 20 | 29 | 10 | 29 |
| m24 | 78 | 8 | 35 | 35 | 25 | 35 |
| review | 84 | 0 | 0 | 84 | 0 | 0 |

## Três blocos exibidos ao aluno

- Questões guiadas: 191
- Questões estilo prova: 578
- Questões de revisão do módulo: 666

## Situação editorial

- Respostas associadas: 853
- Correção objetiva automática: 333
- Sem resposta-modelo no original: 582
- Autoavaliações/checklists exibidos: 0

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
- Suíte completa do repositório: 36 testes aprovados.

## Limitações do conteúdo original

- As 582 perguntas de revisão ativa não possuem resposta-modelo ou comentário no material-fonte. Elas aceitam e salvam a tentativa, mas não recebem correção inventada.
- Os testes de saída em formato de checklist permanecem preservados na fonte, mas não são exibidos como atividades.
- Questões discursivas exibem resposta-modelo para comparação e não atribuem acerto/erro semanticamente.
