# Base Completa — Etapa 10.1 | Cotejamento editorial CPC M01–M08

**Data:** 28/10/2026  
**Branch:** `preview/legal-complete-premium-v1-20261025`  
**Escopo:** comparações textuais entre a fonte original das apostilas completas e o DOM do leitor; recuperação da apresentação das questões do M06. Sem alterações nos arquivos de conteúdo, banco Neon, `main` ou Production.

## Resultado confirmado

- Auditoria integral CPC M01–M20 em Chromium: **60/60 verificações aprovadas** (20 módulos × 390, 768 e 1366 px), no commit `10dc48e1129da674228f064615a3f5f198812c22`.
- [Execução aprovada — 40613918617](https://github.com/Diogooliveira-bot/central-de-estudos-2026/actions/runs/40613918617).
- [Artefato 12784721204 — métricas e capturas](https://github.com/Diogooliveira-bot/central-de-estudos-2026/actions/runs/40613918617/artifacts/12784721204), cerca de 2,7 MB, com expiração prevista em 11/11/2026.
- Regressão independente CPC M02–M20 também aprovada no [workflow 40613898570](https://github.com/Diogooliveira-bot/central-de-estudos-2026/actions/runs/40613898570) sobre as alterações do leitor e estilo do M06; verificação separada de M01 aprovada no [workflow 40613918842](https://github.com/Diogooliveira-bot/central-de-estudos-2026/actions/runs/40613918842).

## Cotejamento dos trechos antes sinalizados

As **72 linhas** que a comparação textual anterior não encontrava literalmente foram classificadas por comparação normalizada de sequência de caracteres, com acentos, espaços e pontuação desconsiderados apenas para fins de diagnóstico. Essas categorias são **evidência de equivalência estrutural aproximada, não validação jurídica independente**.

| Módulo | Linhas sinalizadas | Texto presente com reformatação | Rótulos intencionalmente corrigidos | Metadados editoriais filtrados |
|---|---:|---:|---:|---:|
| CPC M01 | 16 | 14 | 0 | 2 |
| CPC M02 | 11 | 7 | 2 | 2 |
| CPC M03 | 7 | 7 | 0 | 0 |
| CPC M04 | 18 | 15 | 2 | 1 |
| CPC M05 | 3 | 3 | 0 | 0 |
| CPC M06 | 7 | 5 | 2 | 0 |
| CPC M07 | 3 | 3 | 0 | 0 |
| CPC M08 | 7 | 7 | 0 | 0 |
| **Total** | **72** | **61** | **6** | **5** |

**Conclusão limitada:** a inspeção automática não identificou lacuna textual adicional entre as 72 diferenças. As 61 linhas com reformatação aparecem no texto renderizado quando se desconsideram espaços e pontuação; as seis diferenças de títulos mantêm o rótulo original como atributo `data-bc-original-heading`, e cinco linhas são metadados de apresentação deliberadamente filtrados. A existência de palavras em sequência não garante, isoladamente, fidelidade de todos os parágrafos ao original: confrontação humana ainda recomendada, principalmente onde há quadros e citações longas.

## Correção executada no CPC M06

O texto extraído de PDF continha a questão de revisão nº 10 com prefixo duplicado `20. 10. O MP, atuando como fiscal da ordem jurídica, pode recorrer.`. O leitor **agora exibe somente** `10. O MP, atuando como fiscal da ordem jurídica, pode recorrer.`, conservando a frase jurídica.

O bloco `12. TESTE RÁPIDO — CERTO OU ERRADO` recebeu apresentação de perguntas consistente: **15 questões** identificadas, fonte de **18 px**, cartão visual discreto no padrão Premium. Foram preservados os elementos `h2`, seus IDs, posições de capítulo, número de itens, `localStorage` e textos originais, para não invalidar marcações de leitura. A conversão semântica de H2 para itens de lista exige revisão separada do índice e não foi realizada nesta etapa.

A primeira execução encontrou um conflito real com a tipografia global (27 px na questão); a regra foi corrigida com escopo específico para o M06, e a **segunda execução passou**. Os testes exigem explicitamente fonte de 18 px, 15 questões e ausência de prefixos numéricos duplicados.

## Pendências editoriais após a Etapa 10.1

1. **M01–M08:** realizar uma revisão visual humana das passagens com alto risco de fragmentação por PDF, especialmente M05, que contém na fonte uma sequência textual `IRDR são exceções expressasPARTE IV - PEGADINHAS FCC`. A auditoria de presença de caracteres não garante a correta separação entre os parágrafos.
2. **M06:** a revisão semântica de títulos no bloco de perguntas continua pendente. A apresentação foi corrigida preservando o sistema de progresso, mas as perguntas ainda são elementos H2 por compatibilidade com o leitor atual.
3. **M01–M20:** revisar se todas as tabelas originais e cabeçalhos estão editorialmente adequados, e não apenas as tabelas piloto que foram adicionadas.
4. **M09–M20:** avaliar suficiência de teoria, organização por capítulos e atualização legislativa/jurisprudencial; a contagem de texto não é parecer jurídico.
5. **Homologação:** conferir leitores reais com conta Premium autenticada em Preview protegida **após autorização e confirmação do commit implantado**. Testes Chromium atuais usam fixture isolada em localhost.

**Próxima etapa recomendada:** investigar a colagem entre seções em CPC M05, com correção exclusivamente visual e regressão segura; depois selecionar outros problemas comprovados da revisão de M01–M08. Não publicar nesta etapa.
