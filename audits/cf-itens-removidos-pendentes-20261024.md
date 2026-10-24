# Remoção dos itens pendentes de Constitucional (Lei em Dia) | 24/10/2026

**Decisão:** o responsável autorizou eliminar as 4 questões de `tools/decorando-data-cf.js` que estavam com gabarito em revisão (status "pendente"), concluindo a revisão jurídica de Constitucional.

## Resultado

| Indicador | Antes | Depois |
|---|---:|---:|
| Questões em `DATA_CF` | 3.009 | 3.005 |
| Certificadas | 3.005 | 3.005 |
| Certificadas parcialmente | 0 | 0 |
| Pendentes (gabarito em revisão) | 4 | 0 |
| Gabaritos alterados | 0 | 0 |

Depois desta etapa, **todas as questões restantes de `DATA_CF` estão certificadas** com o texto compilado do Planalto. O total geral do banco passa de 12.019 para 12.015; as 98 questões de `DATA_CF_LEIS` não mudaram.

## Itens removidos

| Id | Subtópico | Gabarito | Dispositivo | Módulo |
|---|---|---|---|---|
| `cf-ae45dc411d82` | Administração Pública — disposições gerais e servidores | Errado | Art. 37, XI, CF | cf-m05 |
| `cf-13d9de2748cb` | Administração Pública — disposições gerais e servidores | Errado | Art. 37, § 6º, CF | cf-m05 |
| `cf-574a6c7226e3` | Fiscalização contábil, financeira e orçamentária | Errado | Art. 70, § único, CF | cf-m07 |
| `cf-autoral-inedita-app-012` | Aplicabilidade, interpretação, vigência e eficácia | Errado | Autoral • Força normativa da Constituição | cf-m01 |

## Situação registrada de cada um no momento da remoção

- `cf-ae45dc411d82`: Em revisão. O inciso XI do art. 37 aplica expressamente o limite dos Desembargadores "aos Defensores Públicos", o que parece contrariar o gabarito oficial (Errado). A diferença pode estar entre membros e servidores da Defensoria, e precisa de conferência.
- `cf-13d9de2748cb`: Em revisão. Pelo Tema 940 do STF, a ação de indenização por dano causado por agente público deve ser proposta contra o Estado ou a prestadora de serviço público, e o agente é parte ilegítima. O gabarito oficial (Errado) parece divergir dessa tese e precisa de conferência.
- `cf-574a6c7226e3`: Em revisão. O parágrafo único do art. 70 obriga a prestar contas qualquer pessoa física ou jurídica, pública ou privada, que gerencie recursos públicos, sem critério de nacionalidade; a afirmação isolada não contradiz o texto, e o gabarito "Errado" parece depender das demais alternativas da prova.
- `cf-autoral-inedita-app-012`: Em revisão. A afirmação descreve corretamente o princípio da força normativa, mas o gabarito registrado é "errado"; a própria explicação original reconhece que a descrição é correta. O enunciado parece ter perdido, na conversão, a negação da questão de origem.

## Arquivos alterados além dos dados

- `tools/decorando-data-modulos.js`: 4 ids saíram de `questionIds` e os contadores `laws[].questions` foram ajustados.
- `audits/lei-em-dia-sincronizacao-20261009.json` e `audits/lei-em-dia-auditoria-20261012-inventario.json`: totais ajustados (12.019 → 12.015; 3.009 → 3.005).
- `tests/lei-em-dia-constitucional.mjs` e `tests/lei-em-dia-sincronizacao.mjs`: contagens esperadas atualizadas (3.009 → 3.005; 3.107 → 3.103; 12.019 → 12.015).
- Cache `?v=` de `decorando-data-cf.js` e `decorando-data-modulos.js` em `tools/decorando.html` e `central-offline-files-v66172.json`.

## Como restaurar

Os 4 objetos completos, com posição original e módulo, estão em `audits/cf-itens-removidos-pendentes-20261024.json`. Reverter o commit da remoção restaura tudo de uma vez.

## Efeito para alunos

Tentativas, notas e destaques dos 4 ids continuam salvos no aparelho, mas deixam de aparecer porque as questões saem do banco.

## Limites

- Sem teste visual da página nesta etapa.
