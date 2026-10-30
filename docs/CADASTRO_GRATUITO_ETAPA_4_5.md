# Etapa 4.5 — Cadastro gratuito por confirmação de e-mail

## Resultado desta implementação
- **Branch isolada:** commercial/etapa-4-5-20261027, criada da main 9ef6ec2.
- Tela responsiva: /cadastro-gratuito.html (não publicada como funcionalidade oficial).
- Endpoint no /api/auth?action=free-signup aceita solicitações de confirmação por e-mail e resgate do link de uso único.
- Endpoint GET /api/auth?action=free-signup-status retorna apenas enabled true/false, sem dados pessoais; a tela /login.html só revela o botão de cadastro quando a função estiver homologada e habilitada.
- Matriz de permissões Premium e regras do Lei em Dia não foram alteradas.
- O aluno é criado com role='aluno' e assinatura de plano **free**, nunca premium, no mesmo comando SQL atômico.
- Validade do token: 30 minutos. Token puro não é salvo, apenas hash SHA-256.
- Limites de solicitação persistentes por identificador HMAC de e-mail/IP, resposta genérica para evitar enumeração de usuários.
- Não envia e-mail se SMTP Gmail não estiver configurado; em falha, retorna 503.
- SQL preparado: db/migrations/004_public_free_signup.sql. **NÃO EXECUTADO EM PRODUCTION**.

## Garantias de bloqueio (flags)

A API exige simultaneamente:
- BC_PUBLIC_FREE_SIGNUP_ENABLED=true
- Na Preview: VERCEL_ENV=preview **e** BC_FREE_SIGNUP_PREVIEW_ISOLATED=YES
- Na Production: VERCEL_ENV=production **e** BC_PUBLIC_FREE_SIGNUP_PRODUCTION_APPROVED=YES

Nenhuma dessas três flags foi configurada na Vercel nesta etapa. Não ativar flags na Production sem nova autorização expressa. Os segredos AUTH_SECRET e GMAIL_APP_PASSWORD nunca devem ser enviados ao ChatGPT, inseridos no GitHub nem impressos em logs.

## Como homologar com segurança (não realizado nesta etapa)
1. Confirmar banco Neon de **testes exclusivo**, sem tabelas com registros reais de alunos, em Preview cuja variável DATABASE_URL está restrita especificamente à branch comercial. Existe atualmente uma variável DATABASE_URL genérica de Preview; isso NÃO prova isolamento, portanto não usar.
2. Aplicar SOMENTE no banco de testes a migração 004 depois de confirmar a existência da estrutura de planos 001 e a ausência de dados reais. Não alterar Production.
3. Configurar a branch Preview para usar credenciais Gmail de testes protegidas, AUTH_SECRET de teste e flags Preview explicitamente aprovadas.
4. Validar no navegador real: criação com e-mail fictício controlado, envio de confirmação, token válido/vencido/reutilizado, login, plan=free, TEC/QC negados, 20 questões/dia, recuperar senha e celular.
5. Inspecionar logs para vazamento de tokens e e-mails; verificar limites e antibot/captcha se volume público exigir.
6. Revisar política de privacidade e termos antes da oferta ao público. Definir retenção/limpeza periódica de solicitações expiradas.
7. Somente após backup real recuperável (Etapa 4.4) e homologação, solicitar autorização específica para configurar produção, aplicar migração sob backup, habilitar as duas flags de produção e publicar a versão aprovada.

## Testes executados
CI isolada .github/workflows/etapa-4-5-commercial-validation.yml executou testes de cadastro (sem banco real), segurança de planos, webhook Hotmart e recuperação de senha. O teste é simulado; NÃO equivale a cadastro real completo em banco homologado.

## Arquivos
- api/auth.js — adicionada nova rota pública e rota de status, preservadas as anteriores.
- lib/free-signup-handler.js — confirmação e criação atômica de conta free.
- cadastro-gratuito.html — formulário e confirmação.
- login.html — link condicional, oculto até API status enabled.
- middleware.js — somente a nova página pública permitida; assets protegidos continuam bloqueados.
- db/migrations/004_public_free_signup.sql — migração test-only pendente de homologação.
- tests/public-free-signup-4-5-unit.mjs — testes dedicados.
- .github/workflows/etapa-4-5-commercial-validation.yml — CI comercial isolada.

**Importante:** não declarar o cadastro aberto aos visitantes. O código está pronto para homologação, não para publicação.
