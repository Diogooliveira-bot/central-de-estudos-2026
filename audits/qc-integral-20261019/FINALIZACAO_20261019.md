# Finalização QC — 19/10/2026

**Branch:** `audit/qc-integral-20261019`  
**Produção:** não publicada  
**Base inventariada:** os mesmos 416 cadernos capturados em 19/10/2026. Esta atualização não repetiu a coleta.

## Resultado

| Indicador | Resultado |
|---|---:|
| Cadernos QC contabilizados | 416 |
| Links QC disponíveis aos alunos | 410 (336 no mapa principal e 74 no mapa separado de Processo Civil) |
| Novos links integrados nesta etapa | 1 |
| Integrações QC autenticadas acumuladas no mapa principal | 164 |
| Pendências resolvidas nesta etapa | 1 |
| Pendências restantes | 57 (Administrativo 37, Penal 11, Processo Penal 9) |
| Módulos sem QC confirmado | 21 |
| Cadernos sem correspondência confirmada | 6 |
| Testes automatizados aprovados | 100 |
| Testes falhos / ignorados | 0 / 1 |

O link novo foi `15285069`, Direito Administrativo M05.5 — Responsabilidades e regime disciplinar. A página autenticada do QC carregou 30 questões. Os assuntos vistos nas questões incluíram “Responsabilidades do servidor” e “Inquérito Administrativo - PAD”, compatíveis com o submódulo. O registro passou de pendente para validado e fica disponível pelo mapa do módulo e pela Central de Questões.

Os 409 links do checkpoint anterior foram preservados, assim como os filtros TEC e os conteúdos teóricos. A Central de Questões continua usando o catálogo compartilhado. Nenhum caderno ou filtro interno do QC foi criado ou alterado.

## Módulos que continuam sem QC confirmado

Não há caderno correspondente por disciplina/código no inventário retido; os títulos de candidatos não foram usados como prova. Permanecem sem link validado:

| Disciplina | Módulos | Motivo |
|---|---|---|
| Direito Administrativo | M07, M11, M19, M20 | Nenhum caderno desses módulos no inventário; as 21 pendências específicas desses módulos continuam sem filtro exclusivo. |
| Direito Civil | M03, M10 | Nenhum caderno do módulo correspondente no inventário. |
| Direito Penal | M01, M14, M17 | Nenhum caderno desses módulos no inventário; 10 pendências específicas permanecem sem filtro exclusivo. |
| Direito Processual Penal | M02, M09, M18 | Nenhum caderno desses módulos no inventário; 7 pendências específicas permanecem sem filtro exclusivo. |
| Raciocínio Lógico-Matemático | M07, RF | Nenhum caderno correspondente no inventário. |
| Direito Processual do Trabalho | M01, M06, M11 | Nenhum caderno correspondente no inventário. |
| Língua Portuguesa | M01, M13, M17, M18 | Nenhum caderno correspondente no inventário. |

São 21 módulos sem QC confirmado. Dentro deles, há 38 filtros/submódulos pendentes sem caderno exclusivo (21 em Administrativo, 10 em Penal e 7 em Processo Penal). As outras 19 pendências estão em subdivisões de módulos com algum QC integrado, mas continuam sem filtro exclusivo confirmado. Os mapas mantêm seu status Pendente, sem links gerais substitutos.

## Cadernos ainda sem correspondência confirmada

Esses seis IDs continuam no catálogo administrativo dos 416 itens e não são exibidos como filtros validados aos alunos:

| Disciplina | ID | Tratamento |
|---|---:|---|
| Raciocínio Lógico-Matemático | 15293311 | Conteúdo conferido como fundamentos/negações lógicas; não é M08 (sequências). |
| Raciocínio Lógico-Matemático | 15292720 | Conteúdo conferido como argumentação lógica; não é M09 (orientação espacial/temporal). |
| Raciocínio Lógico-Matemático | 15292598 | Caderno amplo de M06; os assuntos observados não confirmam o filtro específico esperado. |
| Direito Administrativo | 15285197 | Resultados observados concentram fases do processo licitatório, sem confirmar M16.5 (impugnações/recursos). |
| Direito Administrativo | 15285176 | Resultados observados concentram registro de preços, sem confirmar M15.2. |
| Direito Administrativo | 15285086 | Filtro amplo da Lei 9.784/99, sem isolar M06.3. |

Para o conflito RLM, os cadernos confirmados `15313089` (M08, sequências) e `15313108` (M09, espacial/temporal) seguem vinculados. Os IDs históricos `15293311` e `15292720` permanecem no catálogo sem associação incorreta.

## Testes e conferências

- `npm ci` instalou as dependências previstas no repositório.
- `npm test`: 100 aprovados, 0 falhas, 1 teste de navegador ignorado pelo próprio teste porque Chromium estava ausente.
- O teste direcionado da integração (mapa QC, catálogo dos 416, Central de Questões, filtros externos e mapa de CPC) passou após a atualização dos totais.
- O link QC `15285069` foi aberto em sessão autenticada: título do filtro e 30 resultados foram exibidos; amostras de questões e assuntos confirmaram o tema de M05.5.
- `npm run test:questions-browser` não iniciou porque não havia executável Chromium. A instalação Playwright foi tentada; o servidor de distribuição entregou arquivo ZIP incompleto (0 MiB), então a verificação automatizada no Chromium local segue bloqueada.
- Não foi possível executar a jornada autenticada da Central nesta sessão; a prévia Vercel exige autenticação da própria Central. Não houve tentativa de contornar o login. A navegação dos links QC não foi generalizada para todos os IDs; fora o link novo, a validação permanece conforme os checkpoints prévios.

## Arquivos atualizados

- `content/qc-sharing-links.json` e seu espelho `content/qc-sharing-links.js`.
- `content/qc-notebook-catalog.js` e gerador correspondente: 416 inventariados, 410 integrados em mapas e seis sem correspondência confirmada.
- `audits/qc-integral-20261019/matriz-qc-central.csv`: 188 módulos/submódulos, 416 cadernos e 57 filtros pendentes.
- `audits/qc-integral-20261019/links-qc-integrados-novos.csv`: 164 integrações acumuladas na etapa dos 170 candidatos, incluindo o novo M05.5.
- Testes de contagem e regressão da integração.

A prévia será disponibilizada na branch `audit/qc-integral-20261019` após o commit. Não foi feito deploy de produção.
