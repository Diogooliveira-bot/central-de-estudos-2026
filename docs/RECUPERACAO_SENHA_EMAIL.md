# Base Completa — recuperação de senha por Gmail

## Status de ativação

O fluxo foi desenvolvido na branch `feature/recuperacao-senha-email-20261021`.
A entrega REAL só deve ser declarada ativa depois que uma senha de app de
`basecompleta.estudos@gmail.com` for cadastrada na Vercel e o envio for
verificado em homologação, sem contas de produção.

**Não publicar sem validar envio e redefinição ponta a ponta.**

## Configuração sem expor a senha em chat

1. O usuário cria uma senha de app em https://myaccount.google.com/apppasswords
   com verificação em duas etapas habilitada. A senha de app não é a senha normal da conta.
2. No projeto Vercel `central-de-estudos`, em **Settings → Environment Variables**,
   configurar as seguintes variáveis para a branch de Preview
   `feature/recuperacao-senha-email-20261021`:
   - `GMAIL_USER` = `basecompleta.estudos@gmail.com`
   - `GMAIL_APP_PASSWORD` = senha de app (16 caracteres), marcada como **Sensitive/Encrypted**.
3. Não passar a senha por mensagem, GitHub, PR, print ou terminal compartilhado.
4. Após salvar, fazer um novo deploy da mesma branch para o ambiente Preview
   receber as variáveis. Mudanças em variáveis não afetam deploys anteriores.
5. Usar um aluno fictício em `base-completa-homologacao` e um endereço
   de e-mail sob controle do usuário para verificar recebimento.
6. Testar login com a nova senha, expiração, reutilização, senha anterior e
   integridade de progresso antes de considerar publicar.
7. Somente depois de tudo aprovado, configurar as MESMAS variáveis no
   **Production** e publicar após autorização do responsável.

O código conecta ao `smtp.gmail.com:465` sobre TLS (Nodemailer).
A Vercel bloqueia a porta de saída 25, mas permite 465/587.
O Gmail pessoal pode bloquear logins de origens incomuns e não é solução de
e-mail transacional recomendada para escala. Para crescimento comercial,
preferir domínio próprio e provedor transacional com API.

### Variáveis
```
GMAIL_USER=basecompleta.estudos@gmail.com
GMAIL_APP_PASSWORD=(senha de app de 16 caracteres, cadastrada diretamente no painel)
```
Não adicionar valores reais ao código ou ao `.env` versionado.

## Rotas públicas
- `GET /login.html` — botão **Esqueci minha senha**.
- `GET /recuperar-senha.html` — formulário de pedido e nova senha.
- `POST /api/auth?action=password-reset-request` — corpo `{email}`.
- `POST /api/auth?action=password-reset-check` — corpo `{token}`.
- `POST /api/auth?action=password-reset-confirm` — corpo `{token,password}`.

## Proteções

- Token de 256 bits, SHA-256 em PostgreSQL; TTL de 30 minutos e resgate atômico único.
- Não incluir token em query string, log ou resposta API. Token no hash da página, depois apagado da URL.
- Rate limit persistente por email/IP com HMAC, resposta genérica para emails existentes/inexistentes.
- Apenas contas ativas `aluno`; administradores usam a rotina própria.
- Nova senha revoga sessões no servidor com aumento de `session_version`.
  Sessões offline PWA podem conservar dados já sincronizados até reconexão.
- Provedor de e-mail ausente: HTTP 503, sem fingir envio. Falha na entrega: log sem dados sensíveis, resposta genérica.
- A senha da conta Gmail nunca é enviada ao usuário, ao navegador ou exposta no front-end.

## Critérios de homologação
- [x] Testes unitários e regressão (sem Gmail real).
- [ ] E-mail Gmail/Senha de app configurados somente na Preview.
- [ ] Mensagem efetivamente recebida.
- [ ] Link recebido expira e não pode ser reutilizado.
- [ ] Nova senha permite login; antiga falha; sessões antigas são revogadas.
- [ ] Nenhuma alteração no banco de produção e progresso preservado.
- [ ] Revisão e aprovação para publicar em produção.
