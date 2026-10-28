# Base Completa — Etapa 3.1, Hotmart com renovação manual

Data: 28/10/2026. **Homologação isolada; NÃO habilitar em Production.**

## Decisões comerciais consolidadas
- Gratuito permanente, sujeito a recursos limitados (20 questões/dia Lei em Dia; TEC/QC externos Premium exclusivos).
- Premium Semestral: R$ 97,00 por 6 meses; Premium Anual: R$ 194,00 por 12 meses (lançamento).
- Sem período de teste Premium.
- Compra individual por período fixo. **Não haverá cobranças recorrentes / renovação automática.**
- Ao vencer, acesso Premium expira e o plano efetivo volta a FREE preservando conta e progresso.
- Renovação depende de nova compra voluntária.
- Avisos operacionais previstos: 7 dias antes e no vencimento (ainda NÃO implementados).
- Reembolso principal pela Hotmart; retorno ao FREE após estorno confirmado, respeitadas obrigações legais.

## O que já existia antes desta etapa
- Roteamento de webhook: `/api/hotmart-webhook`, com validação `X-HOTMART-HOTTOK` e gate `HOTMART_LIVE_ENABLED` para produção.
- Validação do ID de produto e dos códigos distintos das ofertas de seis e doze meses.
- Funções SQL de aplicação idempotente e reconciliação; compra aprovada ativa PREMIUM para conta elegível existente, ou gera convite de ativação de senha e criação de conta nova.
- Tratamento de estornos/cancelamentos/chargebacks e página administrativa para pedidos Hotmart.
- Resolução de acesso dinâmico: após `ends_at`, o plano efetivo passa a FREE mesmo sem alterar a linha do banco.

## Alterações efetuadas (branch de homologação)
1. `lib/hotmart-webhook.js` recusa, antes do acesso ao banco, eventos de **aprovação** que tragam `subscription`, `recurrence_number>0`, `date_next_charge` ou compra de antecipação de recorrência. Retorna erro 422 para tornar a incompatibilidade visível na origem; **não cancela cobranças na Hotmart**.
2. O filtro NÃO impede processar eventos de reembolso, cancelamento ou chargeback de uma compra anteriormente ativada.
3. Dois testes unitários específicos confirmam não concessão de Premium a aprovações recorrentes; compra avulsa permanece elegível.

## Evidência e bloqueios atuais
- Na branch Neon de homologação `br-late-band-b7lzjsyi`, não foram encontradas as tabelas `central_hotmart_%` ou funções `central_hotmart_%` em consulta somente leitura. **Migração 003 NÃO foi aplicada nesta etapa.**
- Não há teste ponta a ponta Hotmart -> webhook -> banco TEST -> ativação -> revogação concluído.
- Oferta semestral conhecida em histórico: `o4y1mlg9` e produto histórico `8805543`, mas **nenhum dos dois foi validado ao vivo no painel Hotmart nesta etapa**; a oferta anual e o tipo de produto também precisam ser confirmados. Não assumir que são adequados para Production.
- Atenção: assinaturas Hotmart de pagamento recorrente cobram novamente por padrão, o que contraria o contrato aprovado. Antes de vender é obrigatório verificar que as ofertas são de **pagamento único e acesso por prazo fixo** na Hotmart; rejeitar webhook na Central NÃO impede eventual cobrança da plataforma de pagamentos.
- `HOTMART_HOTTOK`, `HOTMART_PRODUCT_ID`, `HOTMART_OFFER_6M_CODE`, `HOTMART_OFFER_12M_CODE` são configurações privadas; nunca incluí-las em commits, prints ou chat.
- Confirmar no checkout: valor, modalidade de pagamento, prazos, prazo legal de arrependimento e termos de atendimento antes de abrir vendas.

## Próximos passos técnicos autorizáveis em homologação
1. Validar as duas ofertas como avulsas sem recorrência no painel Hotmart sem alterar condições comerciais automaticamente.
2. Revisar migração 003, simular rollback/backup, aplicar **somente no Neon TEST quando houver autorização apropriada**.
3. Executar testes de banco e notificações simuladas reais; confirmar idempotência, renovação voluntária, estorno proporcional, FREE após vencimento, proteção TEC/QC, e nenhum efeito em contas administrativas.
4. Somente após validação ponta a ponta, preparar envio de avisos 7 dias antes e no vencimento, sem marketing agregado, com rotina controlada e deduplicação.
5. Manter `main`, Vercel Production, Neon Production e cobrança de verdade inalterados até liberação expressa.

Fonte técnica de payload: https://developers.hotmart.com/docs/pt-BR/2.0.0/webhook/purchase-webhook/
