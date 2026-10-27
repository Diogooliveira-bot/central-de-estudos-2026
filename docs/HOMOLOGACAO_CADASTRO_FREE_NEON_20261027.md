# Homologação do cadastro Gratuito — 27/10/2026

## Operações reais realizadas, somente em testes
- Repositório/branch: Diogooliveira-bot/central-de-estudos-2026, commercial/etapa-4-5-20261027.
- Neon TEST projeto shiny-hall-19564809, branch **nova** br-late-band-b7lzjsyi (test/commercial-free-signup-4-5-20261027), criada a partir da branch de testes br-blue-sunset-b7jcts9i. Não é a branch principal desse projeto e não é o Neon Production.
- Migração 004 aplicada somente na branch nova: central_free_signup_pending + índice exp + central_free_signup_limits.
- Na Vercel, variável DATABASE_URL de tipo sensitive configurada somente para target=preview e gitBranch=commercial/etapa-4-5-20261027, apontando para a branch Neon TEST nova. Não incluir o segredo neste documento, no GitHub ou em logs.
- Flags de ativação do cadastro **não foram configuradas**, mantendo a funcionalidade desativada (fail closed). Ainda não houve teste SMTP real de verificação de e-mail nem login autenticado no browser.

## Teste SQL real com dados fictícios
- Criação de um usuário fictício em CTE atômica junto com assinatura Free e auditoria: **PASSOU**, 1 assinatura Free, 1 auditoria, papel aluno.
- Tabela pending recebeu token fictício de homologação; a CTE real de confirmação usou DELETE ... RETURNING para consumir token, criou outro aluno de teste, atribuiu única assinatura Free e gravou auditoria: **PASSOU**.
- Verificação subsequente: token pendente = 0, assinatura Free ativa = 1, Premium = 0.
- Credenciais de teste são marcadores inválidos (não servem para login); nenhuma senha de aluno real ou segredo de produção foi utilizado.
- Registros de teste permanecem na branch exclusiva para inspeção; limpeza pode ser feita depois de concluir a bateria de homologação. Não apagar nem alterar contas fora da branch exclusiva.

## Itens ainda pendentes antes de habilitar funcionalidade
1. Credenciais SMTP de teste em ambiente isolado e confirmação de entrega real para e-mail de teste autorizado; ou solução de sandbox e-mail que não exponha contas reais.
2. Testar em navegador real com base e segredos de homologação, inclusive sessão, login, recuperação, responsividade e limites free.
3. Confirmar Preview HTTPS vinculada ao commit comercial atual; qualquer deployment anterior à criação da variável DATABASE_URL específica da branch pode estar ligado a outra base: **não realizar operações que gravem dados nele**.
4. Fazer teste antirreplay negativo, cadastros concorrentes, limite de solicitações e retorno 503 com SMTP indisponível.
5. Revisar termos e política de privacidade antes de qualquer cadastro público de verdade.
6. Após backup real recuperável da Etapa 4.4, autorização específica para produção, migração e publicação.

## Garantia de escopo
- Não tocou no projeto Neon Production solitary-dust-76502943, em dados reais de alunos, nem na branch do backup.
- Não alterou main, não publicou Production, não fez pagamentos, não enviou webhooks reais.

## Continuação — 18h45 UTC de 27/10/2026
- Vercel confirmou deployment **READY** `dpl_5P7nr2bW1XxmKg8aL6tE8LzoUh7U`, commit `90502f006f41`, branch comercial. Preview não é Production.
- URL da Preview é protegida por acesso da Vercel; não foi possível percorrer a interface como visitante público. Nenhuma afirmação de teste em navegador real.
- Validada por metadata Vercel: DATABASE_URL tipo sensitive, alvo preview, escopo exato da branch `commercial/etapa-4-5-20261027`. Isolamento da branch Neon de teste confirmado pela própria criação e uso da conexão da branch `br-late-band-b7lzjsyi`.
- **Teste real de expiração:** token fictício já expirado não foi consumido; `activated_count=0`, nenhuma conta criada para o e-mail de teste.
- **Teste real de reutilização:** token fictício anteriormente consumido não pôde ser reutilizado (`reuse_successes=0`).
- **Premium indevido:** nenhuma assinatura Premium concedida pelos testes.
- Cadastro continua desativado; faltam serviço de e-mail de homologação e browser autenticado. Não reutilizar Gmail Production para teste.
