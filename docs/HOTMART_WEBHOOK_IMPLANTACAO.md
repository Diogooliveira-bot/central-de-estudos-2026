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
**CONFIRMADO pelo proprietário em 25/10/2026:** o produto que contém as duas ofertas é `8805543`, atualmente em rascunho. O produto `8805554` não deve ser integrado.
`HOTMART_PRODUCT_ID=8805543` foi configurado somente como variável Preview da branch de testes. Não publicar nem ativar vendas antes de finalizar o cadastro do produto e validar o Webhook autenticado.

Os **códigos de oferta** foram lidos diretamente da captura de tela do proprietário
(e já estão configurados exclusivamente no ambiente de Preview desta branch):
- Semestral — R$ 97,00: `HOTMART_OFFER_6M_CODE=o4y1mlg9`;
- Anual — R$ 194,00: `HOTMART_OFFER_12M_CODE=gh4ajvj1`.

A vinculação das ofertas ao produto em rascunho foi confirmada pelo proprietário.

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

## Acompanhamento do proprietário
- `/planos.html`: atribuição manual e consulta de planos;
- `/vendas-hotmart.html`: vendas da Hotmart e reenvio de links de ativação;
- `/ativar-acesso.html#token=...`: primeiro acesso do comprador;
- `/api/hotmart-webhook`: retorno autenticado, ativado apenas quando as
  variáveis de ambiente específicas forem configuradas;
- `/api/hotmart-claim?action=check|redeem`: link verificado e cadastro seguro.

## Revisão e segurança adicionais
Verificar antes da publicação: confirmação do produto na Hotmart; legislação de
proteção de dados pessoais (LGPD), base legal e retenção de dados de comprador;
política de cancelamento e reembolso; teste de SMTP e dados bancários do produtor.
Não enviar Hottok, DATABASE_URL ou senha de aplicativo Gmail para o chat.

## Auditoria das bibliotecas
A verificação de segurança detectou versões vulneráveis de Nodemailer e Zod.
As atualizações são restritas à branch de testes e devem passar por npm audit e
pela bateria completa antes de compor um release.

### Correção de dependências (branch de testes)
O workflow isolado atualizou Nodemailer para ^10.1.4 e aplicou override
Zod ^4.6.6; a auditoria de produção passou nesse workflow.
Reexecutar o pipeline principal da branch antes da publicação.

## Atualização: configuração do ambiente isolado em 25/10/2026
Apenas no ambiente Vercel Preview da branch `feature/hotmart-ativacao-automatica-20261025`:
- HOTMART_PRODUCT_ID=8805543, códigos 6M/12M conforme as duas ofertas;
- HOTMART_HOTTOK definido como segredo Sensitive pelo proprietário (valor não lido);
- DATABASE_URL apontando para Neon isolado `br-hidden-scene-awp0le5e`;
- AUTH_SECRET específico da branch de testes, não herdado da produção;
- HOTMART_TEST_RECEIVER_ENABLED=true.
O código segue sem HOTMART_LIVE_ENABLED em produção.
**Nunca mesclar este PR sem verificar migração de produção e teste real de notificação.**
