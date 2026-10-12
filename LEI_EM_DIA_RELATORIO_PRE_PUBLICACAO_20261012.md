# LEI EM DIA — homologação para a Central de Estudos

Data da preparação: 10/10/2026. Projeto verificado: `Diogooliveira-bot/central-de-estudos-2026`, branch `main`, commit `d36906cb733d2713b16f7bb01b7f704d78935e81`, associado ao projeto Vercel `central-de-estudos`. A produção consultada estava em estado READY nesse commit. Nenhuma alteração foi feita no projeto nem na publicação.

## Resultado desta etapa

O CSV consolidado foi convertido para `decorando-data-led-20261010.draft.js` no contrato de dados da tela `tools/decorando.html`. Cada registro conserva o ID `LED-20261009-XXXX`, enunciado, resposta booleana, comentário, texto legal em `parts`, URL da fonte, dispositivo, nível e marcação `authorial`. O arquivo usa nomes `DATA_LED_DRAFT` e `TOPICS_LED_DRAFT` e **não está referenciado na página da Central**.

- 2.274 registros convertidos, 1.369 CERTO e 905 ERRADO; 19 conjuntos temáticos.
- 395 questões de Direito do Consumidor e tutela coletiva precisam de uma categoria `consumidor` própria: a Central hoje oferece oito disciplinas e não a inclui.
- As demais questões foram mapeadas às disciplinas atuais: Administrativo 114, Constitucional 157, Civil 13, Processo Civil 2, Processo Penal 87, Penal 123, Trabalho 772 e Processo do Trabalho 611.
- O banco atual contém 12.044 questões conforme o teste `lei-em-dia-sincronizacao.mjs`; o novo lote não foi adicionado, substituído ou usado para recalcular progresso.
- `node validar_lote.mjs` passou em contagem, IDs internos únicos, contrato de campos, tópicos, autoria, URLs e coerência estrutural entre enunciado/texto/gabarito. Essa verificação não confere a norma jurídica.

## Integração necessária após revisão jurídica

1. Receber o resultado da auditoria jurídica individual. Manter fora do arquivo público qualquer ID classificado como PENDENTE ou DESCARTAR, aplicar as correções e atualizar o mapa de cobertura. Conferir colisões literais com o banco atual de 12.044 questões; preservar IDs e histórico de tentativas existentes.
2. No repositório, adicionar o arquivo de dados aprovado em `tools/`. Em `tools/decorando.html`, carregar esse script antes do script principal e acrescentar o novo conjunto ao `DATA`. Juntar os tópicos novos aos filtros das disciplinas existentes e criar o filtro `consumidor` em `TOPICS_BY_DISCIPLINE` e `DISCIPLINES`. Incluir `consumidor` em `originBadge`, para que as novas questões apareçam como AUTORAL.
3. Atualizar `scripts/build-lei-module-index.mjs` para vincular as novas questões à matriz de módulos vigente ou a complementares de cada disciplina. Regenerar `tools/decorando-data-modulos.js` e o relatório correspondente. Não classificar questões pela simples coincidência do número de artigo em leis diferentes.
4. Atualizar manifesto offline, cache/versionamento dos scripts e os testes de sincronização que hoje exigem exatamente 12.044 questões. Verificar o total efetivamente aprovado, sem fixar 14.318 se a revisão descartar ou corrigir itens.
5. Testar filtros por disciplina, norma e dispositivo, modo Foco/Scroll, revelação do comentário e fundamento somente após a resposta, autoria, uso offline, sincronização e preservação de progresso. Fazer deploy de prévia e conferir a Central com uma conta de teste antes da promoção à produção.

## Bloqueio jurídico

A auditoria do banco original foi estrutural, não uma segunda conferência jurídica individual de todos os 2.274 gabaritos. O inventário tem 15 pendências sem gabarito e 159 exclusões justificadas. Este pacote é para homologação técnica; **não publicar as questões aos alunos até concluir a revisão jurídica e os testes da integração real**.
