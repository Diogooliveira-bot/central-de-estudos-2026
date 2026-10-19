# Implementação do catálogo e integração segura dos 170 cadernos QC

**Branch:** `audit/qc-integral-20261019`
**Base:** auditoria integral dos 416 cadernos e matriz `matriz-qc-central.csv`
**Produção:** não publicada

## Resultado nesta branch

Os **416 cadernos** agora estão em `content/qc-notebook-catalog.js`, com IDs e URLs originais preservados. O catálogo administrativo da Central de Questões mostra os itens existentes nos mapas e os **170 sem correspondência temática confirmada**. A disciplina e o módulo derivados da matriz aparecem somente como sugestão de conferência.

| Situação | Quantidade | Tratamento |
|---|---:|---|
| IDs já presentes em mapas QC existentes | 246 | Mantidos nos módulos e na Central de Questões; destino autenticado não revalidado nesta etapa |
| Cadernos sem correspondência confirmada | 170 | Inventariados na área administrativa; não apresentados como filtros ao aluno |
| Pendências de filtro exclusivo | 64 | Mantidas no estado Pendente |
| Módulos/códigos sem caderno localizado no inventário | 11 | Permanecem sem QC |

Os 170 distribuem-se assim:

| Disciplina | Cadernos sem vínculo confirmado |
|---|---:|
| Direito Civil | 61 |
| Língua Portuguesa | 27 |
| Direito Constitucional | 19 |
| Direito do Trabalho | 18 |
| Direito Processual do Trabalho | 18 |
| Raciocínio Lógico-Matemático | 17 |
| Direito Administrativo | 10 |
| **Total** | **170** |

Os dez cadernos de Administrativo compartilham códigos com dez pendências específicas (M04.1, M04.3, M05.5, M06.3, M08.1, M08.3, M14.3, M15.1, M15.2 e M16.5). Eles aparecem no catálogo administrativo como candidatos à revisão. Os mapas de aluno continuam sem esses links, pois o inventário não traz contagem nem evidência do filtro interno. Assim, as 64 pendências não foram rebaixadas por inferência.

Os dois cadernos de RLM M08 e os dois de RLM M09 continuam preservados no inventário, sem escolha automática de principal. A integração não altera os IDs QC existentes, mapas TEC, filtros internos ou conteúdo teórico.

## Códigos ainda sem caderno localizado

- Direito Civil: M03, M10.
- Raciocínio Lógico-Matemático: M07, RF.
- Direito Processual do Trabalho: M01, M06, M11.
- Língua Portuguesa: M01, M13, M17, M18.

## Alterações realizadas

- Adicionado o catálogo completo dos 416 IDs/URLs e a fonte de captura mantida em `fontes/qc_todos_cadernos_416.json`.
- Criado gerador reproduzível do catálogo administrativo a partir da captura e da matriz.
- Adicionada seção pesquisável de conferência à aba “Meus filtros” da Central de Questões. Ela só aparece para administradores e separa status do mapa de sugestão estrutural.
- Corrigida a apresentação dos títulos com mojibake recuperável no catálogo; o título bruto permanece no campo `sourceTitle` e a fonte original não é alterada.
- Incluído o arquivo no carregamento da Central e no manifesto offline; atualizada a chave de build/cache.
- Atualizada a matriz: cadernos não integrados passaram a “Sem correspondência confirmada”.
- Nenhum filtro QC ou TEC novo foi ativado para alunos; nenhum dos 64 registros pendentes foi alterado.

## Validação pendente no QC

Não foi feita abertura autenticada dos 416 cadernos. Os URLs no catálogo correspondem aos URLs da captura, mas isso não prova que cada página aplique o caderno ou o filtro esperado. A conferência do conteúdo/quantidade no QC e a ativação de links novos permanecem pendentes de evidência. A prévia local e os testes automatizados verificam o catálogo e a interface administrativa, não a conta nem a resposta final do QC.

## Testes

`npm test`: **99 aprovados, 0 falhas e 1 ignorado**. O caso ignorado requer Chromium no teste de navegador. `tests/qc-notebook-catalog-unit.mjs` valida os 416 IDs únicos, URLs ligados ao mesmo ID, totais 246/170, os dez candidatos de Administrativo e a visibilidade administrativa do catálogo; também verifica que a camada de módulos não recebe itens sem vínculo confirmado. Os testes existentes da Central, CPC, TEC, filtros e integridade do manifesto também passaram. A navegação efetiva dos links externos dentro do QC ainda depende de sessão autenticada e não foi declarada verificada.
