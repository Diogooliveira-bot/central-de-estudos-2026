# Auditoria integral QC × Central de Estudos

**Data da verificação:** 19/10/2026  
**Repositório/base:** `Diogooliveira-bot/central-de-estudos-2026`, versão 6.6.134, base `089589ce891afeb5a3472dd5fc222601aa433b4d`  
**Branch de trabalho:** `audit/qc-integral-20261019`

## Escopo e critério

Esta continuação reutiliza o inventário já coletado de 416 cadernos, sem repetir sua coleta. O inventário agrega dez disciplinas; os 74 cadernos de Processo Civil vêm do cadastro QC separado. A matriz lista todos os módulos/submódulos presentes nos índices atuais da Central, cada caderno capturado e cada filtro pendente. O arquivo CSV anexo é a relação registro a registro.

Correspondência por código/assunto no título do caderno serve somente para encontrar candidatos. Não comprova que o filtro interno do QC trate do tema do módulo. Por isso, os 246 IDs presentes nos dois mapas de integração são classificados como **Necessita de validação manual** quanto ao funcionamento e à correspondência temática até verificação autenticada.

Os arquivos `content/adm/adm-sharing-links.js` e `content/civil/civil-sharing-links.js` são mapas TEC, não QC. A leitura da integração QC considerou `content/qc-sharing-links.json` e `content/cpc/cpc-sharing-links.js` (o mapa separado de Processo Civil).

## Cobertura por disciplina

| Disciplina | Módulos/submódulos na Central | Cadernos no inventário QC | IDs QC no mapa do código | Cadernos existentes, não integrados | Pendências sem filtro exclusivo | Códigos sem caderno localizado no inventário |
|---|---:|---:|---:|---:|---:|---|
| Direito Constitucional | 15 | 19 | 0 | 19 | 0 | — |
| Direito Administrativo | 20 | 64 | 54 | 10 | 44 | — |
| Direito Civil | 15 | 61 | 0 | 61 | 0 | M03, M10 |
| Direito Processual Civil | 20 | 74 | 74 | 0 | 0 | — |
| Direito Penal | 17 | 53 | 53 | 0 | 11 | — |
| Direito Processual Penal | 22 | 65 | 65 | 0 | 9 | — |
| Raciocínio Lógico-Matemático | 16 | 17 | 0 | 17 | 0 | M07, RF |
| Direito do Trabalho | 18 | 18 | 0 | 18 | 0 | — |
| Direito Processual do Trabalho | 21 | 18 | 0 | 18 | 0 | M01, M06, M11 |
| Língua Portuguesa | 24 | 27 | 0 | 27 | 0 | M01, M13, M17, M18 |
| **Total** | **188** | **416** | **246** | **170** | **64** | **11 códigos** |

“Códigos sem caderno localizado” significa que nenhum dos 416 registros capturados correspondeu ao código, não que uma busca exaustiva em todo o QC prove inexistência de questões. Os 64 itens pendentes são registros de filtro esperado, sem URL/ID QC exclusivo. Os 170 registros existentes mas não integrados distribuem-se por Constitucional (19), Administrativo (10), Civil (61), RLM (17), Trabalho (18), Processo do Trabalho (18) e Português (27).

## Resultado da reconciliação

- **246 registros** aparecem nos mapas QC do código e no inventário. O código do módulo coincide nos 246 casos. Isso valida a associação estrutural, não a temática do filtro, sua visibilidade em sessão real nem o destino público.
- **Zero associação incorreta confirmada** pelo código. Nenhum registro foi classificado como “Integrado incorretamente”.
- **Zero ID duplicado** entre os 246 registros integrados; as chaves disciplina/código também não têm duplicidade indevida nos mapas verificados.
- **170 cadernos** constam do inventário, mas não dos mapas de integração QC atuais. Estão marcados “Existente no QC, mas não integrado”; não foram ligados automaticamente a módulos.
- **64 filtros pendentes** continuam sem link exclusivo: Administrativo 44, Penal 11 e Processo Penal 9. Não foi criado link amplo ou inventado para preencher lacunas.
- Os arquivos de compartilhamento do TEC foram preservados e não foram contados como QC.

### Candidatos de Administrativo

Os dez itens abaixo são candidatos apenas pela disciplina/código do inventário, não por correspondência temática confirmada. Permanecem fora do mapa e não substituem as 44 pendências.

| ID QC | Código | Título capturado |
|---|---|---|
| 15285197 | M16.5 | ADM M16.5 Impugnações, escla… |
| 15285176 | M15.2 | ADM M15.2 Planejamento setoria… |
| 15285175 | M15.1 | ADM M15.1 Fase preparatória,… |
| 15285159 | M14.3 | ADM M14.3 Definições, objeto… |
| 15285103 | M08.3 | ADM M08.3 Controle jurisdicion… |
| 15285091 | M08.1 | ADM M08.1 Controle administrat… |
| 15285086 | M06.3 | ADM M06.3 Extinção, revisão… |
| 15285069 | M05.5 | ADM M05.5 Responsabilidades e… |
| 15285041 | M04.3 | ADM M04.3 Poder de polícia,… |
| 15285036 | M04.1 | ADM M04.1 Discricionariedade… |

Os reticências representam títulos truncados no inventário de origem; não foram completados por inferência.

### Possíveis conflitos de RLM

| Código | Caderno mais específico | Registro genérico/mais antigo | Tratamento |
|---|---|---|---|
| M08 | `15313089` — RLM-M08 Sequências e Padrões | `15293311` — RLM M08 | module | Nenhum integrado; seleção manual pendente |
| M09 | `15313108` — RLM-M09 Espacial/Temporal | `15292720` — RLM M09 | module | Nenhum integrado; seleção manual pendente |

## Verificação funcional e limites

Um link QC de Processo Civil foi aberto sem sessão. A página mostrou uma listagem geral de 2.877.914 questões, sem evidência visível do caderno solicitado. Isso não permite concluir que o link esteja quebrado, nem que seja público/funcional. A URL da Central de produção redirecionou para login; a execução autenticada do fluxo não foi possível.

O acesso à tela de login do QC foi encontrado, mas a revisão automática bloqueou uma tentativa de iniciar autenticação por exigir credenciais que não foram explicitamente autorizadas. Nenhuma credencial foi solicitada ou inserida, e nenhum mecanismo de contorno foi usado. A comprovação final de cada destino requer validação autenticada autorizada.

Os testes de unidade da Central verificaram a rota da Central de Questões, suas cinco abas, renderização por módulo, separação QC/TEC, destinos/IDs catalogados, histórico, fallback e estabilidade de montagem. Eles passam. O teste de navegador Playwright não pôde rodar: Chromium não estava instalado, e a distribuição do binário falhou com arquivo incompleto (0 MiB). Um teste browser de Civil foi, portanto, ignorado. A página real autenticada também não pôde ser testada.

## Codificação dos títulos

O mapa principal tinha 65 `moduleTitle` corrompidos; os títulos gerais legíveis do próprio mapa permitiram regenerar esse campo sem alterar IDs, URLs, filtros, status ou contagens. Os espelhos JSON/JS foram mantidos sincronizados. A interface agora prioriza `title` limpo antes de `notebookTitle`, pois 14 valores de `notebookTitle` continuam corrompidos/truncados na fonte. O inventário preservado contém 19 títulos com mojibake; não foi editado nem “corrigido” por suposição. Há um título geral com marcador de codificação a revisar manualmente.

## Alterações nesta branch

- Corrigidos os 65 títulos de módulo exibidos no catálogo QC e atualizado seu espelho JS.
- Ajustada a prioridade de exibição da interface para preferir o título legível sem modificar o dado original do QC.
- Atualizado teste da Central de Questões: os filtros QC/TEC são links de abertura (`<a>`), não botões de seleção; a expectativa antiga estava desatualizada.
- Renomeadas as alegações nos testes: formato coerente/registro catalogado não equivale a destino público ou funcional confirmado.
- Adicionada esta auditoria e a matriz completa em CSV.

Não foram criados cadernos, alterados filtros internos, selecionados candidatos, substituídos links, alterados filtros TEC, modificados conteúdos teóricos ou publicados arquivos em produção.

## Testes executados

`npm ci` concluiu com sucesso. O conjunto direcionado executado foi:

```text
node --test tests/qc-sharing-links-unit.mjs tests/cpc-sharing-links-unit.mjs tests/external-question-filters-unit.mjs tests/external-question-center-unit.mjs tests/question-click-stability-unit.mjs tests/penal-modulos-visiveis-unit.mjs tests/civil-sharing-links-unit.mjs tests/work-ptra-standardization-unit.mjs
```

Resultado: **28 passaram, 0 falharam, 1 ignorado** (browser de Civil, por falta de Chromium). O teste de navegador `npm run test:questions-browser` não passou da inicialização do Chromium por indisponibilidade do binário, não por falha funcional do código.

## Legenda da matriz anexa

O CSV contém 668 linhas: 188 linhas de módulos da Central, 416 linhas de cadernos QC e 64 linhas de filtros pendentes. Cada linha identifica disciplina, módulo, submódulo, ID/título do caderno, origem, comparação estrutural e status. Os estados aplicados incluem “Validado e integrado” somente para estrutura de código (com nota de validação funcional pendente), “Necessita validação manual”, “Existente no QC, mas não integrado”, “Pendente sem filtro exclusivo” e “Não localizado”. Nenhum caso foi presumido integrado funcionalmente apenas por `public: true`.
