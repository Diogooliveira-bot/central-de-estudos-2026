# Base Completa — execução da missão final e decisão de publicação

**Data:** 29/10/2026 (Fortaleza). **Decisão:** **PUBLICAÇÃO BLOQUEADA** para cadastro público e vendas. A PR #187 continua em Preview; este relatório não certifica material jurídico nem substitui teste de compra. A autorização do proprietário para publicar após os gates está registrada na missão recebida, mas os gates abaixo ainda não foram satisfeitos.

## 1. Resultado efetivo desta passagem

- Inspecionados GitHub, PR #187, seis workflows no HEAD inicial `db850d1`, deployments e aliases Vercel, branches e snapshot Neon, documentos de gate, código, testes e catálogo. Nenhum merge, migração produtiva, compra ou ativação de checkout foi feito.
- Corrigido `tests/universal-reader-inventory.mjs`, que falhava porque ainda tentava ler 18 módulos de Direito do Trabalho removidos do catálogo. O inventário agora termina com 134 entradas de leitores jurídicos/Português, sem fontes ausentes; 89 pares resumo/completo confirmados diretamente, 20 teorias completas de Administrativo dependentes do runtime legado, e 25 entradas de Português (24 módulos e revisão final) em pacote integral. RLM é tratado separadamente como 16 tópicos da home, não como leitor desse script.
- Executados `npm test`: **177 passaram, 1 ignorado, 0 falhas**. Executados 22 testes focados de conteúdo/padrão/disciplinas removidas: **22 passaram**. `npm run test:lei-adm`: **25 passaram**. Esses testes são de código/local; não equivalem a aluno autenticado na Preview nem a compra Hotmart.
- Conferidos os dois checkouts públicos da Hotmart com país Brasil, sem compra: `o4y1mlg9` apresentou **R$ 97,00 à vista** e 6 parcelas de R$ 18,20; `gh4ajvj1` apresentou **R$ 179,00 à vista** e 12 parcelas de R$ 18,51. Parcelas com taxas elevam o total. O checkout anual **não exibiu “12 meses” no texto visível** na inspeção; o semestral exibiu “6 meses”. Exigir correção/validação da descrição anual no painel antes de abrir vendas. A interface pública não prova ausência de recorrência, configuração de webhook ou concessão após pagamento.
- O Neon recusou novo snapshot com `snapshots limit exceeded` (HTTP 422). Criada a branch isolada **`backup/pre-lancamento-20261029`**, ID `br-icy-fog-b7n783qy`, a partir da `main` `br-blue-sunset-b7jcts9i` no LSN `0/2258C68`. Consultas agregadas compararam `main` e cópia: **16 tabelas, 6 usuários, 5 assinaturas, 3 preferências, 2 estados de sincronização, 2 linhas de progresso e 21 backups de usuário em ambas**. A cópia não recebeu o endpoint produtivo. O snapshot manual anterior `snap-red-lake-b7ytcuk2` permanece, expira em 04/11/2026 23:59:59 UTC. Esta branch é ponto de recuperação interno ao mesmo projeto, não backup externo independente nem ensaio completo de rollback.
- O alias `central-de-estudos-ecru.vercel.app` aponta para um deployment Preview antigo da integração, `dpl_CRNXhAJdzN2pD9dGAjShtX3Z1SW1`, SHA `26739f9`; a Production Git da `main` está no deployment `dpl_8nzB9PbftGVY2JFGzC3XzuGEuXCX`, SHA `53eb8b2`. O alias de Preview da branch aponta para `dpl_DMRgKdsVEZS8V43yz6iniSKU8bnG`, SHA `b6e915f`. O HEAD inicial `db850d1` tinha seis workflows `completed/success`, mas **não havia deployment daquele SHA** na consulta Vercel. Não confundir `READY` com publicação final.

## 2. Disciplinas e materiais

Inventário estático no HEAD inicial, sem atribuir publicação efetiva a um arquivo apenas porque existe. “Resumo/completo” conta fontes não vazias, não auditoria editorial/jurídica integral. A Central apresenta oito disciplinas ativas; Informática consta como preparação e não foi reinserida. Trabalho e Processo do Trabalho permanecem removidos.

| Disciplina | Temas da home / módulos | Fontes de resumo/completo verificadas | Questões e imagens verificadas | Estado de publicação |
|---|---:|---|---|---|
| Constitucional | 15 / 15 | 15 / 15 | 15 pares de questões no dado nativo; 15 mapas com arquivo presente | Existência no código; contagem publicada por módulo não comprovada nesta passagem |
| Administrativo | 20 / 20 | 20 resumos; teoria completa usa runtime legado, exige abertura autenticada | Metadados 5+10 por módulo; sprite presente | Mesmo limite |
| Civil | 15 / 15 | 15 / 15 no pacote | 15 conjuntos 5+10; 15 imagens embutidas em `civil-native-images.js` | Mesmo limite |
| Processo Civil | 20 / 20 | 20 / 20 | M01–M06: 5+10 no sistema; M07–M17: banco de 15 questões por módulo validado; M18–M20 não contados como 5+10; mapas não certificados por módulo | Mesmo limite |
| Penal | 17 / 17 | 17 resumos nativos / 17 teorias integrais no pacote legado | 17 conjuntos 5+10; imagens não contadas nesta verificação | Mesmo limite |
| Processo Penal | 16 temas / 22 módulos | 22 / 22 no pacote | Metadados 5+10 e sprite de 22 recortes; exercício real por módulo não executado | Mesmo limite |
| Português | catálogo separado / 24 módulos + revisão | pacote integral de 25 entradas; não há 24 resumos independentes certificados | 24 arquivos de infográfico; questões por módulo não auditadas aqui | Mesmo limite |
| RLM | 16 temas / módulos não equiparados | leitor de 70 capítulos coberto por teste local; não contado como 16 pares 5+10 | testes de lógica, tabelas e gráficos passaram; imagens/questões por módulo não auditadas | Mesmo limite |

Testes locais específicos confirmaram CPC M08 integral, banco M07–M17, estrutura dos 20 CPC, renderização dos 20 Administrativo, 22 CPP, Penal, remoção de Trabalho, Vade Mecum sem CLT e manifesto offline sem referências ausentes. Ainda falta abrir cada módulo com aluno Free/Premium no deployment final, em desktop e celular, e registrar os contadores realmente publicados.

## 3. Jurídico e Lei em Dia

- Não foi localizada exportação identificável da conversa específica do Claude nos arquivos do repositório ou na busca de arquivos salvos. Há auditorias em `audits/`, mas não é possível atribuir sua autoria ou conclusões àquela conversa sem a fonte original.
- A branch `revisao/adm-leis-principais-lei-em-dia-20261029` já é **ancestral** da integração atual (`21296bd` está incorporado). Portanto, não foi mesclada de novo. Seu relatório registra 440 itens administrativos revistos, 426 classificados como conferidos no texto e 14 com ressalva; esses números são do relatório existente, não certificação independente desta passagem.
- Amostra oficial conferida: art. 33 do Decreto 11.462/2023 veda a adesão federal à ata estadual/distrital/municipal; o item correspondente na base tem gabarito compatível. O Informativo STF 1136/2024 da ADI 7.331 confirma a constitucionalidade das vedações do art. 17, §2º, I e II, da Lei 13.303/2016. Isso não homologa as demais milhares de questões nem substitui revisão do material publicado.
- Fontes oficiais consultadas: [Decreto 11.462/2023](https://www.planalto.gov.br/ccivil_03/_ato2023-2026/2023/decreto/d11462.htm), [Informativo STF 1136/2024](https://www.stf.jus.br/arquivo/informativo/documento/informativo1136.htm), [Decreto 7.962/2013](https://bibliotecadigital.mj.gov.br/bitstream/1/8424/2/DEC_PR_2013_7962.htm), [CDC compilado](https://presidencia.gov.br/ccivil_03/leis/l8078compilado.htm) e [orientação da ANPD sobre cookies](https://www.gov.br/anpd/pt-br/assuntos/noticias-periodo-eleitoral/anpd-lanca-guia-orientativo-201ccookies-e-protecao-de-dados-pessoais201d).
- `Lei em Dia` permanece ferramenta de estudo ativo; o limite Free de 20 questões/dia e bloqueio TEC/QC têm testes SQL anteriores no Neon TEST e testes locais. `Vade Mecum` tem teste local de catálogo/offline. O fluxo real hospedado autenticado e a auditoria jurídica completa permanecem pendentes.

## 4. Cadastro, documentos e operação

- Preview da integração: `/api/auth?action=free-signup-status` respondeu `enabled=true` com site key Turnstile; alias público da Central respondeu `enabled=false`. Há checkpoint anterior de cadastro sintético com Turnstile/Gmail reais no Neon TEST e relato do proprietário de recuperação de senha. Não foi repetida a jornada hospedada completa nesta passagem.
- O backend e formulário ainda usam `v24-draft-2026-10-28`; a guarda de Production bloqueia cadastro com Termos draft. Termos, Privacidade e Cookies do site V25 são minutas de pré-lançamento e a home mantém `noindex`. Não reaproveitar aceites de teste como definitivos.
- O Decreto 7.962/2013 exige identificação e informações de localização e contato do fornecedor na oferta eletrônica. A atuação como pessoa física foi definida, mas CPF/endereço e formato seguro de divulgação, procedimentos reais de atendimento, retenção, cookies e versão final de aceites ainda não estão comprovados. Não inserir dados pessoais em GitHub.
- O Neon `main` tem uma conta admin ativa, sem bloqueio vigente; `last_login` está vazio para essa conta. Isso não comprova que a senha administrativa funcione. Não foi alterada credencial nem acesso do proprietário.
- A URL pública estável da Central precisa ser definida e aceita pela validação `BC_PUBLIC_APP_URL`; o alias ecru é rejeitado pelo código de Production. O domínio `basecompleta.com.br` ainda não foi comprado. Não alterar alias antes do teste final.

## 5. Comercial, segurança e rollback

- Código de webhook, idempotência, ativação Premium, renovação manual, reembolso e retorno Free foi testado anteriormente com eventos sintéticos/Neon TEST. **Nenhum evento Hotmart Live ou compra real foi homologado.** O painel de produtor requer sessão autenticada para confirmar produto, modalidade, webhook e recuperação de acesso; a tela pública de checkout não os prova.
- Backup anterior preservado; nova branch isolada conferida por esquema e contagens. Falta backup externo recente e teste de restauração completo, especialmente porque o limite de snapshots bloqueou nova cópia. Em eventual rollback, reatribuir apenas o deployment anterior após confirmar compatibilidade de schema; migrações de banco não revertem automaticamente e a branch `main` não deve receber uma cópia antiga às cegas.
- Se houver falha de cadastro, entitlements, compra, estorno, conexão Preview→Production ou dados legais, manter cadastro e checkout fechados. Não usar aluno real como teste.

## 6. Links e evidências

| Recurso | URL / estado |
|---|---|
| Vitrine V25 | https://base-completa-vitrine-estatica-2026.vercel.app/ — pública, pré-lançamento, CTAs fechados |
| Central no alias atual | https://central-de-estudos-ecru.vercel.app/ — cadastro público desativado; alias de Preview antiga |
| Cadastro / login / recuperação | `/cadastro-gratuito.html`, `/login.html`, `/recuperar-senha.html` no alias da Central; cadastro público não liberado |
| Termos / Privacidade / Cookies | `/termos-de-uso.html`, `/politica-de-privacidade.html`, `/politica-de-cookies.html` na vitrine V25; minutas, não versões finais |
| PR de integração | https://github.com/Diogooliveira-bot/central-de-estudos-2026/pull/187 — aberta, draft, mergeável no início desta passagem |
| CI do HEAD inicial | https://github.com/Diogooliveira-bot/central-de-estudos-2026/actions/runs/40894870838 — workflow de integração success; outros cinco workflows também success |
| Preview conferida | https://central-de-estudos-git-integration-lancamento-b-28e944-estudotd.vercel.app/ — protegida, deployment `dpl_DMRgKdsVEZS8V43yz6iniSKU8bnG`, SHA `b6e915f` |

Os links de compra foram verificados no checkout público sem finalizar pagamento. URLs geradas pela Hotmart contêm identificadores de sessão, por isso este relatório registra apenas os códigos de oferta, sem publicar links com parâmetros transitórios.

## 7. Bloqueios objetivos e próxima sequência mínima

1. **Fornecedor/documentos:** concluir identificação e localização legal por canal seguro, operação de atendimento, auditoria de privacidade/cookies e versões finais coordenadas dos três textos e aceite; manter guarda `draft` até lá.
2. **Hotmart:** confirmar no painel compra única das duas ofertas, descrição anual com 12 meses, webhook Live, autenticação e teste oficial sem cobrança real; corrigir a descrição anual antes de ativar CTA.
3. **Segurança:** obter backup externo recente ou capacidade de snapshot restaurável, ensaiar restauração isolada/rollback sem mover endpoint de Production, confirmar `BC_PUBLIC_APP_URL` e segregação de envs.
4. **Homologação:** criar deployment no SHA final da PR, testar UI hospedada com contas sintéticas em desktop/celular e os quatro perfis, incluindo admin, 21ª questão, TEC/QC, tokens, progresso, 5/10 questões, imagens, e-mails e fluxo de reembolso.
5. Somente com esses gates aprovados, atualizar PR #187, mesclar e publicar com verificação pós-deploy. O domínio próprio pode esperar; usar URL Vercel controlada que passe na guarda do código.

**Classificação obrigatória: PUBLICAÇÃO BLOQUEADA.** O bloqueio é comprovado pelos Termos draft, identificação/operação legal incompleta, Hotmart Live não homologada, falta de backup externo recente/restore final e ausência de E2E hospedado no SHA final. Não declarar lançamento nem abrir cobrança a partir dos testes sintéticos.
