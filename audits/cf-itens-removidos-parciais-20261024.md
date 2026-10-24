# Remoção dos itens parciais de Constitucional (Lei em Dia) | 24/10/2026

**Decisão:** o responsável autorizou eliminar as 25 questões de `tools/decorando-data-cf.js` que continuavam como "certificado-parcial", porque dependiam de textos legais que a Central não possui e que não foram fornecidos.

## Resultado

| Indicador | Antes | Depois |
|---|---:|---:|
| Questões em `DATA_CF` | 3.034 | 3.009 |
| Certificadas | 3.005 | 3.005 |
| Certificadas parcialmente | 25 | 0 |
| Pendentes (gabarito em revisão) | 4 | 4 |
| Gabaritos alterados | 0 | 0 |

Nenhuma questão certificada ou pendente foi tocada. As 98 questões de `DATA_CF_LEIS` não mudaram (total geral do banco: 12.044 → 12.019).

## O que cada item exigiria para voltar

- Código de Processo Penal: 5
- Código Penal: 3
- Código Civil: 2
- Constituição do Estado de Alagoas: 1
- Constituição do Estado de Goiás: 2
- Constituição do Estado de Santa Catarina: 1
- Constituição do Estado de São Paulo: 1
- Lei 14.601/2023: 1
- Lei 10.101/2000: 1
- Precedente Normativo 86 do TST e art. 543 da CLT: 1
- Código Eleitoral: 1
- Lei 9.504/1997: 1
- Lei Complementar 64/1990: 1
- Lei 9.717/1998: 1
- Lei 8.625/1993: 1
- Lei 11.372/2006: 1
- Lei Complementar 230/2026: 1

## Itens removidos

| Id | Subtópico | Gabarito | Dependia de | Módulo |
|---|---|---|---|---|
| `cf-dcfb3f927e1b` | Direitos e deveres individuais e coletivos | Certo | Código de Processo Penal | cf-m02 |
| `cf-ad774baf7afe` | Direitos e deveres individuais e coletivos | Certo | Código de Processo Penal | cf-m02 |
| `cf-843c5ed026b4` | Direitos e deveres individuais e coletivos | Certo | Código de Processo Penal | cf-m02 |
| `cf-af7974bf6c22` | Direitos e deveres individuais e coletivos | Certo | Código Penal | cf-m02 |
| `cf-f7a7e4777133` | Direitos e deveres individuais e coletivos | Certo | Código Civil | cf-m02 |
| `cf-9eba988043e2` | Direitos e deveres individuais e coletivos | Errado | Código de Processo Penal | cf-m02 |
| `cf-f0b57bcdea2b` | Direitos e deveres individuais e coletivos | Errado | Código Penal | cf-m02 |
| `cf-3b24907ec744` | Direitos sociais | Certo | Lei 14.601/2023 | cf-m03 |
| `cf-e400f2a7f7b4` | Direitos sociais | Certo | Lei 10.101/2000 | cf-m03 |
| `cf-69ec1592fbf9` | Direitos sociais | Certo | Precedente Normativo 86 do TST e art. 543 da CLT | cf-m03 |
| `cf-c8840f78e505` | Direitos políticos | Certo | Código Eleitoral | cf-m03 |
| `cf-d4700f20d96f` | Direitos políticos | Certo | Lei 9.504/1997 | cf-m03 |
| `cf-43829bdca749` | Direitos políticos | Errado | Lei Complementar 64/1990 | cf-m03 |
| `cf-fd1d16eeae2d` | Organização político-administrativa | Errado | Constituição do Estado de Alagoas | cf-m04 |
| `cf-e4cde63866b9` | Estados Federados | Certo | Constituição do Estado de São Paulo | cf-m04 |
| `cf-79e0a8180fe5` | Municípios | Certo | Constituição do Estado de Goiás | cf-m04 |
| `cf-e5232872601e` | Administração Pública — disposições gerais e servidores | Certo | Constituição do Estado de Goiás | cf-m05 |
| `cf-af1317932caf` | Administração Pública — disposições gerais e servidores | Certo | Lei 9.717/1998 | cf-m05 |
| `cf-d3d95f74a647` | Organização dos Poderes; Congresso Nacional | Certo | Constituição do Estado de Santa Catarina | cf-m06 |
| `cf-a478078e783e` | Atribuições do Congresso, Câmara e Senado | Certo | Código Penal | cf-m06 |
| `cf-41dc5ccf953a` | Poder Judiciário — disposições gerais | Certo | Código Civil | cf-m09 |
| `cf-b216ff641364` | Ministério Público | Certo | Código de Processo Penal | cf-m11 |
| `cf-6c39e824c741` | Ministério Público | Errado | Lei 8.625/1993 | cf-m11 |
| `cf-5ebc99634c2a` | Ministério Público | Errado | Lei 11.372/2006 | cf-m11 |
| `cf-autoral-inedita-w4-03` | Municípios | Errado | Lei Complementar 230/2026 | cf-m04 |

## Arquivos alterados além dos dados

- `tools/decorando-data-modulos.js`: 25 ids saíram de `questionIds` e os contadores `laws[].questions` foram ajustados (edição direta; o gerador `scripts/build-lei-module-index.mjs` não foi rodado porque hoje produziria também as questões LED e mudaria outros vínculos).
- `audits/lei-em-dia-sincronizacao-20261009.json` e `audits/lei-em-dia-auditoria-20261012-inventario.json`: totais ajustados (12.044 → 12.019; 3.034 → 3.009).
- `tests/lei-em-dia-constitucional.mjs` e `tests/lei-em-dia-sincronizacao.mjs`: contagens esperadas atualizadas (3.034 → 3.009; 3.132 → 3.107; 12.044 → 12.019).
- Cache `?v=` de `decorando-data-cf.js` e `decorando-data-modulos.js` em `tools/decorando.html` e `central-offline-files-v66172.json`.

## Como restaurar

Os 25 objetos completos, com posição original e módulo, estão em `audits/cf-itens-removidos-parciais-20261024.json`. Reverter o commit da remoção restaura tudo de uma vez.

## Efeito para alunos

O progresso é guardado no aparelho por id de questão. Tentativas, notas e destaques dos 25 ids continuam salvos, mas deixam de aparecer porque as questões saem do banco; o percentual de avanço passa a considerar 25 questões a menos em Constitucional.

## Limites

- Sem teste visual da página nesta etapa.
