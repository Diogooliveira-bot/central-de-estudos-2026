# Hotmart — integração isolada (25/10/2026)

## Situação
Etapa 1 preparada: receptor Webhook v2 autenticado somente na Vercel Preview.
**Nunca declarar pronta para vendas:** os eventos são registrados, mas não liberam Premium.
Não publicar na branch main nesta etapa. Nenhuma migração em Neon produção.

## Parâmetros na Vercel — somente Preview, sem valores no repositório
- `HOTMART_TEST_RECEIVER_ENABLED=true` (Preview)
- `HOTMART_HOTTOK` (chave secreta do webhook — guardar só como segredo Vercel)
- `HOTMART_PRODUCT_ID` (ID exato do único produto utilizado)
- `HOTMART_OFFER_6M_CODE` (código exato da oferta de R$ 97,00)
- `HOTMART_OFFER_12M_CODE` (código exato da oferta de R$ 194,00)
- `DATABASE_URL` (Neon isolado de testes; não usar o banco principal)

URL após implantação na Vercel Preview:
`https://<preview-confiavel>.vercel.app/api/hotmart-webhook`

Não utilizar o domínio público principal ainda. O receptor nega acesso em produção.
Não copiar a chave da Hotmart para mensagens, capturas de tela ou logs.

## Próxima etapa
- Confirmar o ID do produto correto, pois dois produtos semelhantes aparecem na Hotmart.
- Verificar os códigos de oferta diretamente na conta do produtor; não inferir só pelo valor.
- Aplicar `db/migrations/002_hotmart_webhook_inbox.sql` numa ramificação Neon de teste.
- Testar autenticidade, transações duplicadas, reembolsos e ordem de eventos.
- Implementar conciliação idempotente e ativação automática para contas existentes.
- Implementar primeiro acesso seguro para compradores sem conta, sem expor tokens.
- Preparar migração para `grant_source='hotmart'`, preservando assinaturas existentes.
- Só depois de homologar o fluxo completo, autorizar produção e cadastrar o webhook real.
