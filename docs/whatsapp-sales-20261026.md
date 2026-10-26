# Base Completa — WhatsApp comercial (integração segura de 26/10/2026)

## Estado de integração
- Branch exclusiva: feature/whatsapp-vendas-20261026, iniciada da main 180650d.
- Mantida separada de Production/main. Sem fusão automática com homologacao divergente.
- A rota pública para verificação da Meta será https://<DOMINIO_DA_PREVIEW>/api/whatsapp-sales.
- O POST exige assinatura X-Hub-Signature-256 do Meta App Secret; nunca desative a validação.
- Banco Preview isolado: Neon soft-dawn-40179120, neondb; migração aditiva 004.
- Segredos Preview criados apenas para esta branch: DATABASE_URL, AUTH_SECRET, SALES_PRIVACY_SECRET, META_WEBHOOK_VERIFY_TOKEN.
- Faltam o aplicativo Meta/WhatsApp de teste, token da Meta, ID do número, versão Graph e chave Anthropic de vendas (se for usar IA).

## Fatos comerciais
- Lançamento: R$ 97 / 6 meses e R$ 194 / 12 meses (sem recorrência mensal).
- Semestral: https://pay.hotmart.com/B108186453Y?off=o4y1mlg9.
- O atendente jamais confirma pagamentos; a plataforma e a Hotmart cuidam das ativações.
- Convites gratuitos únicos são emitidos a pedido do interessado, nunca por disparos em massa.
- Links do TEC/QC exclusivos Premium; contratação do TEC/QC não incluída.

## Próxima etapa humana obrigatória na Meta
1. Concluir a verificação de conta Meta Developers. O SMS de confirmação deve ser inserido pelo titular, sem compartilhar o código.
2. Criar/abrir o aplicativo de negócios com WhatsApp e obter um número de teste da Cloud API. Não migrar o número pessoal final 22 sem escolha explícita.
3. No projeto Vercel, escopo Preview e branch feature/whatsapp-vendas-20261026, configurar META_APP_SECRET, WHATSAPP_ACCESS_TOKEN, WHATSAPP_PHONE_NUMBER_ID e WHATSAPP_GRAPH_VERSION (versão suportada no painel Meta), como segredos.
4. Na Meta, definir Callback URL = endereço exato da Preview + /api/whatsapp-sales e Verify Token = META_WEBHOOK_VERIFY_TOKEN configurado na Vercel. Assinar o campo messages.
5. Configurar SALES_ANTHROPIC_API_KEY apenas na Preview para perguntas abertas; sem ela, respostas factuais automáticas continuam funcionando.
6. Enviar mensagem iniciada pelo usuário ao número de teste e validar respostas, opt-out SAIR, convite, deduplicação e gasto. Antes de produção, isolar e configurar segredos de Production, o número oficial e SALES_BASE_URL.

## Privacidade
- Contatos identificados por hash HMAC, contexto cifrado e prazo padrão de 30 dias.
- Limites: 12 mensagens por contato/dia e 100 consultas Claude/dia (se habilitado).
- Não armazenar nem copiar senhas, tokens ou documentos para o repositório.
