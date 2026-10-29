# Base Completa — relatório final de homologação técnica

**Data:** 29/10/2026 (Fortaleza)  
**Classificação:** **HOMOLOGAÇÃO PARCIALMENTE CONCLUÍDA**  
**PR:** [#187](https://github.com/Diogooliveira-bot/central-de-estudos-2026/pull/187), ainda em `draft` e sem merge  
**Branch:** `integration/lancamento-base-completa-20261028`  
**Código funcional homologado:** `15d547a9300d3b56a6eb951e5f9d84ce92635780`  
**Preview estável:** `central-de-estudos-git-integration-lancamento-b-28e944-estudotd.vercel.app`  
**Deployment homologado:** `dpl_2D6RMJ7AHdNfpJq9vbkybsNsXXMc` (`READY`)

Esta passagem executou a homologação técnica no Preview e no Neon TEST. Não houve merge, promoção para Production, alteração do checkout, compra, evento Hotmart, uso de aluno real, troca de senha, migração ou escrita na branch produtiva.

## 1. Disciplinas e conteúdo

Foi criado um acesso convidado privado, somente no Preview da branch, protegido por segredo longo em variável criptografada `BC_PREVIEW_GUEST_TOKEN`. O segredo não é registrado neste relatório. A sessão sintética se identifica como `previewGuest`, não possui conta de banco, não é admin e recebe `403` em `/api/sync` e nos demais endpoints de dados. O único transporte adicional liberado é a leitura de arquivos protegidos por `/api/private-content`; os materiais continuam fora da árvore estática pública.

Durante a validação, foi encontrado e corrigido um defeito real em duas etapas: inicialmente o middleware devolvia `403` aos bundles de disciplinas; após liberar leitura estática, o Vercel devolvia `404` porque esses bundles são deliberadamente excluídos de `dist`. A correção final encaminha o convidado validado ao transporte privado, sem consultar ou alterar dados de alunos. Produção e o fluxo de entitlement de contas reais não foram alterados.

| Disciplina | Evidência no Preview estável | Materiais e questões | Situação |
|---|---|---|---|
| Português | 24 módulos e revisão; M01 abriu o leitor integral “Português Autodidata” | Ação `Estudar conteúdo` comprovada; testes locais cobrem atividades e persistência | Parcialmente homologada; não foram abertas as 25 entradas uma a uma no servidor |
| Direito Constitucional | 15 módulos renderizados; M01 abriu a apostila integral no leitor | `Estudar conteúdo`, teoria guiada, 10 + 5 questões, infográfico, Lei em Dia, QC e TEC visíveis | Representante hospedado aprovado; demais módulos cobertos por integridade local, não por abertura remota individual |
| Direito Administrativo | 20 módulos renderizados; primeiro módulo abriu as ações | `Estudar conteúdo`, `Revisar conteúdo`, 10 + 5 questões e infográfico visíveis | Estrutura hospedada aprovada; CI local abre 40/40 leituras em celular, tablet e desktop |
| Direito Civil | 15 módulos renderizados; M01 abriu o leitor integral com conteúdo e capítulos | `Estudar conteúdo`, teoria guiada, 10 + 5 questões e infográfico visíveis | Representante hospedado aprovado; pacote e estrutura dos 15 têm testes locais |
| Direito Processual Civil | 20 módulos renderizados; M01 abriu ações de estudo e revisão | No M01 hospedado, as questões internas aparecem como indisponíveis. M18–M20 mantêm 5 + 10 questões e mapas HTML em testes de integridade | **Lacuna funcional real**: não declarar questões internas disponíveis em todos os 20 módulos |
| Direito Penal | 17 módulos renderizados; M01 abriu estudo e revisão | Ações `Estudar conteúdo` e `Revisar conteúdo` presentes; a inspeção representativa não comprovou botões 5 + 10 | **Lacuna de evidência hospedada** para questões e infográficos em todos os módulos |
| Direito Processual Penal | 22 módulos renderizados; M01 abriu o cartão completo | `Estudar conteúdo`, `Revisar conteúdo`, 10 + 5 questões e infográfico visíveis | Representante hospedado aprovado; teste local confirma os 22 pares e contagens |
| Raciocínio Lógico-Matemático | 15 módulos + revisão final; M01 abriu o treino nativo dentro do leitor | Treino de velocidade, histórico e filtro QC visíveis; testes locais cobrem 70 capítulos do leitor amplo | Parcialmente homologada; não equiparar 15 módulos + revisão a 16 módulos padronizados de 5 + 10 |

Informática permanece em preparação. Direito do Trabalho e Processo do Trabalho continuam fora do catálogo ativo. Não foi criada disciplina nem proclamado conteúdo publicado apenas por existir no repositório.

O navegador hospedado usado nesta passagem foi desktop. A responsividade em celular e tablet foi validada pelo workflow de integração com Chromium local e servidor simulado; ela não substitui um E2E remoto autenticado nesses dois viewports.

## 2. Cadastro, login e perfis

- O alias estável autorizado pelo widget carregou o Turnstile sem o erro `110200`. O erro anterior ocorria no hostname imutável de deployment, que não precisa ser autorizado quando o fluxo oficial usa o alias estável. Nenhuma configuração Cloudflare foi alterada. A tentativa de entrar no painel Cloudflare com a conta Google salva terminou na mensagem “Unable to sign in”; como o alias funcionou, não houve nova tentativa nem mudança de widget.
- O status da Preview informa cadastro gratuito isolado habilitado e a página de cadastro exibe o desafio. Produção continua com cadastro público fechado.
- Não foi criado novo usuário pelo formulário nesta passagem. O envio final aceitaria Termos de Uso e exigiria resolução do Turnstile; essas ações exigem confirmação no momento da execução e uma caixa de e-mail sintética acessível. Portanto, cadastro → e-mail → confirmação → login não foi repetido no SHA final.
- Sem uma conta sintética confirmada, não foram executados como E2E hospedado os perfis Free, Premium e admin, a 21ª questão, bloqueio/liberação TEC/QC, sincronização entre sessões, recuperação completa de senha, expiração/renovação Premium ou retorno automático ao Free.
- O modo convidado não substitui esses perfis: ele serve apenas para inspeção visual e leitura dos bundles, com APIs de dados bloqueadas.

Conclusão desta seção: o bloqueio de hostname do Turnstile foi resolvido pelo uso correto do alias estável, mas a jornada real de conta e os perfis continuam pendentes. Não há base para declarar cadastro, login, Premium ou admin homologados de ponta a ponta.

## 3. Execução, testes e segurança

| Evidência | Resultado |
|---|---|
| `npm test` | 184 testes: **183 aprovados, 1 ignorado, 0 falhas** |
| `npm run test:premium-protection` | **27 aprovados, 0 falhas** |
| Testes focados do convidado Preview e transporte privado | **10 aprovados, 0 falhas** |
| GitHub Actions no SHA `15d547a` | **6 workflows concluídos com `success`**: PWA, diagnóstico Free, integração controlada, Lei ADM, auditoria Lei em Dia e Penal V3 |
| Vercel | `dpl_2D6RMJ7AHdNfpJq9vbkybsNsXXMc` em `READY`; alias estável apontando para ele |
| Identidade convidada | `/api/auth?action=me`: `authenticated:true`, `previewGuest:true`, papel `aluno` sintético |
| Isolamento convidado | `/api/sync`: `403`; escritas, rotas administrativas e APIs de dados continuam bloqueadas |

A nova cobertura automatizada verifica: troca do link privado por cookie `HttpOnly/Secure/SameSite=Lax`; roteamento `GET/HEAD` de bundle protegido para o transporte privado; bloqueio de `POST`; bloqueio de `/api/sync`; preservação do roteamento de entitlement sem cookie; validação criptográfica do cookie; leitura do bundle no Preview sem acesso ao banco; ausência dos bundles na saída estática pública.

## 4. Banco, backup e rollback

- Projeto Neon da Central: `shiny-hall-19564809`.
- Production: `main` = `br-blue-sunset-b7jcts9i`, ainda `primary/default` e `ready`. Não foi consultada com escrita nem modificada nesta passagem.
- TEST: `br-sweet-waterfall-b7ry8jlw`, `ready`, filha da `main`. Consulta somente leitura confirmou 23 tabelas públicas, 11 usuários de teste, 13 assinaturas de teste, 28 entitlements, 0 cadastros pendentes e 4 resets. Esses totais refletem dados sintéticos acumulados e não autorizam uso como alunos reais.
- Branch interna de segurança: `backup/pre-lancamento-20261029` = `br-icy-fog-b7n783qy`, `ready`.
- Ensaio isolado anterior: `test/restore-snapshot-isolado-20261029` = `br-jolly-sunset-b7512mfn`, `ready`, `restore_status=restored`. O snapshot manual anterior é `snap-red-lake-b7ytcuk2`, com expiração registrada para 04/11/2026 23:59:59 UTC.
- O backup externo independente não foi produzido: faltam destino aprovado, credenciais/chave de criptografia e ferramenta disponível. A branch e o snapshot dentro do mesmo projeto são salvaguardas internas, não substitutos de `pg_dump` criptografado fora do provedor.

Rollback do app: manter os deployments públicos atuais e só reatribuir alias após conferir alvo e SHA. Rollback do banco: restaurar primeiro em branch isolada, comparar esquema e dados essenciais, validar a aplicação e somente então planejar troca coordenada. Reverter deployment não reverte gravações.

## 5. Publicação e pendências finais

**Produção permaneceu intacta.** A `main` do repositório continua no SHA `53eb8b2`; a PR #187 segue `draft`; não houve promoção de deployment, merge, checkout, oferta, webhook ou evento Hotmart. Cadastro público e vendas continuam fechados.

Pendências que impedem homologação integral:

1. executar, com confirmação no momento e e-mail sintético acessível, cadastro completo, confirmação, login e fluxos negativos de token;
2. executar E2E hospedado com contas Free, Premium e admin, inclusive 21ª questão, TEC/QC, sincronização, recuperação de senha, expiração, renovação e retorno Free;
3. corrigir ou documentar a indisponibilidade de questões internas em módulos de Processo Civil e comprovar as questões/infográficos de Penal;
4. abrir representativamente a Preview hospedada em celular e tablet, além da cobertura de CI local;
5. produzir backup externo criptografado e ensaiar restauração da aplicação contra ele;
6. confirmar acesso administrativo do proprietário sem redefinir credenciais às cegas;
7. manter Hotmart, jurídico, checkout e abertura pública como gates independentes.

**Decisão técnica:** o Preview estável está apto para continuação de QA privado, com CI verde, transporte privado corrigido e oito disciplinas carregando. Ainda **não está apto para publicação integral em Production** nem para abertura de cadastro/vendas. A próxima etapa segura é fechar os E2E de conta/perfis e as lacunas de questões, mantendo a PR em `draft` e Produção intocada.
