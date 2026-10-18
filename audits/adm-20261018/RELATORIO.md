# Revisão jurídica e ortográfica — Direito Administrativo

**Data:** 18/10/2026  
**Escopo:** material que o aluno visualiza na Central: resumo, teoria completa, questões internas e elementos nativos da disciplina. Arquivos-fonte administrativos e PDFs não fazem parte desta revisão.

## Resultado da etapa

- Os 20 módulos ADM foram carregados e conferidos no pacote nativo visível.
- O contrato de leitura foi preservado: 5 questões no resumo, 10 questões no apêndice da teoria completa e teoria legada mantida como fonte da versão completa.
- Não foi encontrada falha ortográfica recorrente nos textos revisados.
- Foi corrigida a contextualização das ADIs 7.156/7.236 no M13 (improbidade): o conteúdo agora informa que o julgamento conjunto ainda não foi encerrado, identifica as notas como entendimentos/maiorias divulgados oficialmente e registra que a proibição de contratar ou receber benefícios não deve ser limitada automaticamente ao ente lesado.
- Os valores atualizados da Lei 14.133/2021 (Decreto 12.807/2025, vigentes em 2026) e a alteração do art. 75, XVI, pela Lei 15.471/2026 foram preservados porque conferem com as fontes oficiais consultadas.
- A chave de cache do pacote ADM foi atualizada para `20261018admjur1` para que os alunos recebam a revisão.

## Fontes oficiais consultadas

- STF, notícia oficial sobre o julgamento das ADIs 7.156/7.236: https://noticias.stf.jus.br/postsnoticias/stf-invalida-novos-dispositivos-da-reforma-da-lei-de-improbidade/
- STF, notícia oficial sobre o andamento das ADIs 7.156/7.236: https://noticias.stf.jus.br/postsnoticias/stf-avanca-em-discussao-sobre-mudancas-na-lei-de-improbidade-administrativa/
- MPF/PGR, síntese oficial sobre prescrição e indisponibilidade na LIA: https://www.mpf.mp.br/o-mpf/unidades/procuradoria-geral-da-republica/pgr/noticias/supremo-anula-dispositivo-que-reduzia-pela-metade-o-prazo-de-prescricao-da-acao-de-improbidade
- Planalto, Lei 8.429/1992 compilada: https://www.planalto.gov.br/ccivil_03/leis/l8429compilada.htm
- Planalto, Lei 14.133/2021: https://www.planalto.gov.br/ccivil_03/_ato2019-2022/2021/lei/l14133.htm
- Planalto, Decreto 12.807/2025: https://www.planalto.gov.br/ccivil_03/_ato2023-2026/2025/decreto/d12807.htm

## Validação

Comando: `node --test tests/adm-juridica-review-unit.mjs`

O teste verifica carga dos 20 módulos, contagem das questões visíveis, preservação da fonte legada, nota jurídica do M13 e atualização das chaves de cache.
