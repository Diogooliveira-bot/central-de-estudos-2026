# Hotmart → Base Completa — plano técnico de implantação (25/10/2026)

## Estado desta entrega
A lógica de ativação automática e de cancelamento foi implementada **somente** na
branch `feature/hotmart-ativacao-automatica-20261025`. Nada foi publicado na `main`.
O Webhook na produção fica bloqueado até `HOTMART_LIVE_ENABLED=true`,
independentemente da existência do código. Não divulgar ofertas enquanto o checkout
não estiver integrado e conferido de ponta a ponta.

## Dados de Hotmart
Na conta Hotmart existem **dois produtos com o mesmo nome**: rascunho
`8805543` e produto com vendas ativas `8805554` (conforme captura).
É obrigatório confirmar **qual ID contém as duas ofertas de R$ 97 e R$ 194**.
Não atribuir `HOTMART_PRODUCT_ID` por suposição.
Os códigos das ofertas vêm do quadro de preços em Hotmart: copiar exatamente os
valores exibidos e conferir os dois nomes antes de ativar. Não mapear por preço
pago, pois cupons e parcelamento mudam valores.

## Regras implementadas
- Hottok no cabeçalho `X-HOTMART-HOTTOK`; rejeitar desconhecidos antes do banco.
- Produto e oferta exatos. Pagamento aprovado fornece 6 ou 12 meses.
- Mesmo ID de transação não credita duas vezes. Assinatura Hotmart vigente
  pode ser prolongada numa compra posterior.
- Estorno, chargeback, cancelamento e expiração retiram o crédito específico
  e nunca reativam transações revogadas, mesmo com webhooks fora de ordem.
- Não altera assinaturas Premium criadas manualmente; precisa de tratamento
  administrativo se o aluno já possui Premium manual.
- Novo comprador recebe link de uso único no e-mail, cria nome e senha.
- Comprador já cadastrado como aluno ativo recebe Premium sem nova conta.
- Quedas ou falhas de SMTP são comunicadas à Hotmart como HTTP 503 para
  tentar novamente. Pedido com e-mail inexistente entra em revisão manual.
- Eventos `PURCHASE_COMPLETE` não geram Premium; é exigido
  `PURCHASE_APPROVED`.

## Variáveis na Vercel
Não cole segredo em chat, repositório, captura ou documento.
Configure apenas nos **segredos da Vercel**, depois de verificar o produto:
`HOTMART_PRODUCT_ID`, `HOTMART_OFFER_6M_CODE`,
`HOTMART_OFFER_12M_CODE`, `HOTMART_HOTTOK`.
Para Preview: `HOTMART_TEST_RECEIVER_ENABLED=true` e
`DATABASE_URL` apontando exclusivamente para a ramificação Neon de testes,
nunca banco de produção. Para entrega por e-mail, o Gmail precisa estar
configurado nesse ambiente, inclusive `GMAIL_USER` e
`GMAIL_APP_PASSWORD`, antes do teste de ponta a ponta.
Para produção, `HOTMART_LIVE_ENABLED=true` somente após validação e publicação
com aprovação específica. Senão a rota responde 503 (fail-closed).
`BC_PUBLIC_URL` é opcional (HTTPS, domínio próprio futuro).
A função Hotmart na Vercel usa `api/auth.js` e recebe pela URL
`/api/hotmart-webhook`. A URL de preview é
`https://<deployment-preview>.vercel.app/api/hotmart-webhook`.
O link de primeiro acesso é `/ativar-acesso.html#token=...`;
o fragmento não é enviado ao servidor na requisição de página.

## Banco e testes
1. Criar backup/branch Neon isolada, conferir IDs sem expor dados de alunos.
2. Executar `db/migrations/002_hotmart_webhook_inbox.sql`.
3. Revisar e autorizar especificamente a migração
`db/migrations/003_hotmart_automatic_access.sql`, pois ela altera a
constraint de origem das assinaturas para incluir 'hotmart'.
4. Conferir que não houve alteração em contas, assinaturas ou outros recursos.
5. Testar 6/12 meses, mesma notificação duplicada, pagamento posterior,
   duas compras, refund, chargeback anterior à aprovação, usuário novo
   e existente, funcionário e conta desativada, expiração, erro de SMTP.
6. Webhook real: Hotmart → Ferramentas → Webhook → Cadastrar Webhook;
   produto correto, versão 2.0.0, eventos: compra aprovada, reembolsada,
   chargeback, cancelada e expirada. A autenticação precisa ser verificada
   com `X-HOTMART-HOTTOK`; não publicar chave em público.
7. Confirmar captura da Hotmart em Histórico e só então ativar checkout.
8. Registrar as URLs de pagamento correspondentes às duas ofertas no site
   comercial e garantir que o aluno não receba acesso gratuito indevido.
9. Criar painel de conciliação/admin para compras que exigem revisão manual,
   reenvio de link expirado e operação em caso de falha da Hotmart.

## Fatos ainda não verificados
- Chave Hottok da conta Hotmart (não fornecida).
- ID exato do produto a operar e código definitivo de cada oferta.
- Token/Credencial Hotmart capaz de consultar status diretamente,
  se desejada reconciliação adicional com API de vendas.
- Testes E2E reais de aquisição e entrega do e-mail por Gmail.
- Vigência contratual/garantia/política de cancelamento da Hotmart.

**Sem todos esses itens validados, não anunciar sistema automático como ativo.**
