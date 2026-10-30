# Base Completa — Etapa 4.5 — Homologação final, portões de liberação (27/10/2026)

**DECISÃO: NÃO LIBERAR CADASTRO PÚBLICO NESTA ETAPA.**

## Ambiente e isolamento verificados
- Repositório: Diogooliveira-bot/central-de-estudos-2026
- Branch comercial: commercial/etapa-4-5-20261027, separada das branches da Etapa 4.4 e da main.
- Neon TEST: projeto shiny-hall-19564809, branch br-late-band-b7lzjsyi.
- Vercel: variável `DATABASE_URL` Sensitive escopada à Preview da branch comercial.
- Vercel: variável `AUTH_SECRET` Sensitive **exclusiva da Preview da branch comercial**; segredo criptograficamente gerado e criado diretamente pela integração, não registrado neste documento.
- Vercel: Deployment Protection/SsoProtection `enabled=true` para Previews.
- `BC_PUBLIC_FREE_SIGNUP_ENABLED`, `BC_FREE_SIGNUP_PREVIEW_ISOLATED` e `BC_PUBLIC_FREE_SIGNUP_PRODUCTION_APPROVED`: não criadas/não habilitadas.
- Código da Main, Neon Production e domínio de produção: não modificados.

## Evidências reais versus simulação
| Eixo | Resultado | Natureza |
|---|---|---|
| CI 40564083838 | PASSOU: Chrome desktop/celular | Navegador real, API simulada |
| CI 40566691026 | PASSOU: cadastro, login, recuperação | Chromium real com login/recuperação simulados |
| CI 40571432567 | PASSOU: **41 testes unitários, 0 falhas** | Testes em GitHub Actions, sem banco de Production |
| Mailpit em CI | PASSOU: SMTP local realmente entregou confirmação e recuperação | SMTP real local, banco fictício |
| Neon TEST: confirmação com SQL atômico | PASSOU: 1 aluno, 1 assinatura Free, 1 auditoria | Banco real de homologação; sem navegador |
| Neon TEST: 2 resgates simultâneos | PASSOU: somente 1 criou conta Free | Banco real; corrida real |
| Neon TEST: quota Lei em Dia | PASSOU: 20 permitidas/21ª bloqueada; questão repetida não desconta | Banco real |
| Neon TEST: TEC/QC/teoria completa | PASSOU: entitlements Free desabilitados | Banco real; não houve navegação em área Premium |
| Neon TEST: limpeza de token vencido | PASSOU: antes 1 vencido; deletado 1; depois 0 | Banco real; operação manual de manutenção |
| Externo Gmail/Outlook | NÃO REALIZADO | Sem SMTP novo de homologação e destinatário autorizado |
| Navegador + API REAL + Neon TEST + SMTP | NÃO REALIZADO | Preview protegida, SMTP externo não configurado e cadastro desligado |
| Login e recuperação COM CONEXÃO REAL | NÃO REALIZADO | Testado isoladamente com navegador e banco, mas não simultaneamente |

## Segurança de cadastro reforçada somente na branch
- `lib/free-signup-security.js`: limite de corpo (12 KiB), extração de IP de cabeçalho Vercel, validação Turnstile **servidor** (Siteverify) por ação e hostname, falha fechada, limite de resposta, timeout.
- `lib/free-signup-handler.js`: Turnstile obrigatório quando par chave pública/privada de CAPTCHA configurado; em Production **sempre obrigatório**; habilitação Production exige também `BC_SIGNUP_PRIVACY_APPROVED=YES`.
- `api/auth.js`: a rota pública de status devolve apenas site key de Turnstile quando a funcionalidade está habilitada; nunca o segredo.
- `cadastro-gratuito.html`: captura token Turnstile com script carregado conforme a API de status; token enviado apenas para validação pelo backend.
- `tests/public-free-signup-4-5-unit.mjs`: casos de falha fechada sem CAPTCHA, host incorreto, ação incorreta, falha no provedor, excesso de payload e privacidade pendente.
- Nenhuma chave Turnstile criada (exige conta Cloudflare do proprietário). Nenhum domínio externo autorizado na Cloudflare; o código não significa CAPTCHA ativo.

## Limpeza e retenção
- `scripts/free-signup-prune-expired-4-5.sql`: comando limitado às tabelas `central_free_signup_pending` e `central_free_signup_limits`. Não altera contas, assinaturas ou dados existentes.
- Limpeza de token vencido efetivamente executada somente no Neon TEST; confirmado saldo 0 expirados após operação.
- `db/migrations/004_public_free_signup.sql`: adicionado índice de suporte à limpeza dos limites; índice aplicado **somente Neon TEST**.
- **Agendamento periódico ainda pendente**. Política de retenção e periodicidade dependem de revisão e automação de manutenção antes da abertura.

## Privacidade
- Minuta NÃO publicável: `docs/MINUTA_PRIVACIDADE_CADASTRO_4_5_NAO_PUBLICAR.md`.
- Revisão ainda precisa: identificação de fornecedor, canal de solicitações do titular, bases legais, transferências, fornecedores Vercel/Neon/e-mail/Turnstile, prazo de retenção, fluxo de menores e política de cookies.
- Código impede habilitação Production sem flag de aprovação de privacidade; a flag só deve ser criada mediante revisão verdadeira.

## Procedimento futuro de homologação EXTERNA (sem segredos no chat)
1. Proprietário cria conta **exclusivamente de testes** para envio SMTP, diferente de Gmail Production. O código atual aceita Gmail com senha de aplicativo. Não copiar senha para ChatGPT ou repositório.
2. Credenciais `GMAIL_USER` e `GMAIL_APP_PASSWORD` devem ser adicionadas **exclusivamente como Sensitive** na Preview da branch comercial, não como variáveis globais ou de Production.
3. Criar chaves de Turnstile gratuitas próprias para hostname exato da Preview, cadastrando pública e privada somente em variável da branch comercial; exigirá teste de validação real.
4. Somente então ligar `BC_PUBLIC_FREE_SIGNUP_ENABLED=true` e `BC_FREE_SIGNUP_PREVIEW_ISOLATED=YES` **na Preview protegida e isolada**, nunca Production.
5. Realizar no Chromium uma solicitação de cadastro usando endereço de e-mail de testes autorizado, clicar link externo recebido, confirmar usuário Free, login, recuperar senha, verificar quota e bloqueios. Não usar endereços de alunos reais.
6. Confirmar limpeza programada e publicar textos legais revisados **antes** de abrir cadastro ao público.
7. Após Etapa 4.4 e aprovação separada: migração 004 e flags Production serão avaliadas em outra decisão, **independente** da publicação Premium.

## Não executado
- Nenhum merge, deploy Production, Hotmart, dados de aluno real, webhook real ou alteração em Neon Production.
- Não aplicar a migração 004 em Production.
- Não divulgar como aprovado o teste externo ou o fluxo integrado de navegador/API/Neon/SMTP até existir evidência.

**Conclusão simples:** a engenharia e os testes isolados estão bem avançados; a homologação externa de ponta a ponta ainda depende de uma caixa de envio dedicada, credenciais de Preview e navegador autorizado. Não liberar cadastros públicos.
