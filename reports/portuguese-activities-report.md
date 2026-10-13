# Inventário — Atividades Interativas de Português

Gerado a partir de `portugues-autodidata-data.txt`. A interface exibe no máximo 10 questões de cada bloco por módulo. Total exibido: **664 atividades**.

| Módulo | Total | Questões guiadas | Estilo prova | Revisão do módulo | Correção automática | Sem resposta original |
|---|---:|---:|---:|---:|---:|---:|
| m01 | 28 | 8 | 10 | 10 | 10 | 0 |
| m02 | 21 | 5 | 6 | 10 | 6 | 0 |
| m03 | 22 | 4 | 8 | 10 | 8 | 0 |
| m04 | 26 | 6 | 10 | 10 | 10 | 0 |
| m05 | 30 | 10 | 10 | 10 | 10 | 0 |
| m06 | 26 | 6 | 10 | 10 | 10 | 0 |
| m07 | 30 | 10 | 10 | 10 | 10 | 0 |
| m08 | 27 | 7 | 10 | 10 | 10 | 0 |
| m09 | 27 | 7 | 10 | 10 | 10 | 0 |
| m10 | 28 | 8 | 10 | 10 | 10 | 0 |
| m11 | 28 | 8 | 10 | 10 | 10 | 0 |
| m12 | 23 | 3 | 10 | 10 | 10 | 0 |
| m13 | 21 | 10 | 1 | 10 | 1 | 0 |
| m14 | 30 | 10 | 10 | 10 | 10 | 0 |
| m15 | 28 | 8 | 10 | 10 | 10 | 0 |
| m16 | 30 | 10 | 10 | 10 | 10 | 0 |
| m17 | 30 | 10 | 10 | 10 | 10 | 0 |
| m18 | 30 | 10 | 10 | 10 | 10 | 0 |
| m19 | 28 | 8 | 10 | 10 | 10 | 0 |
| m20 | 30 | 10 | 10 | 10 | 10 | 0 |
| m21 | 29 | 9 | 10 | 10 | 10 | 0 |
| m22 | 26 | 6 | 10 | 10 | 10 | 0 |
| m23 | 28 | 8 | 10 | 10 | 10 | 0 |
| m24 | 28 | 8 | 10 | 10 | 10 | 0 |
| review | 10 | 0 | 0 | 10 | 0 | 0 |

## Três blocos exibidos ao aluno

- Questões guiadas: 189
- Questões estilo prova: 225
- Questões de revisão do módulo: 250

## Situação editorial

- Respostas associadas: 664
- Correção objetiva automática: 225
- Sem resposta-modelo no original: 0
- Autoavaliações/checklists exibidos: 0

## Implementação e segurança

- Um único componente reutilizável atende M01–M24 e a revisão cumulativa.
- Questões estilo prova são exclusivamente objetivas, com alternativas.
- Revisões ativas exibem apenas a pergunta e uma resposta inicialmente oculta, vinculada à teoria do próprio módulo.
- A numeração visível é reorganizada de 1 até o total de cada bloco, sem alterar os IDs persistentes.
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
- Limite de 10 itens por bloco, prova somente objetiva e resposta de revisão inicialmente oculta.
- Associação dos 10 itens exibidos na revisão cumulativa.
- Suíte completa do repositório: 37 testes aprovados.

## Limitações do conteúdo original

- Questões sem resposta segura localizada na teoria: 0.
- Os testes de saída em formato de checklist permanecem preservados na fonte, mas não são exibidos como atividades.
- Módulos com menos de 10 práticas guiadas ou menos de 10 questões objetivas mantêm apenas os itens existentes; nenhum exercício novo foi inventado.
