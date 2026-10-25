# Etapa 11 — atendente comercial no WhatsApp

## O que faz

- Atende mensagens recebidas pelo WhatsApp Cloud API oficial da Meta.
- Responde com fatos aprovados sobre a Base Completa, plano Gratuito e Premium.
- Não informa preços ainda não confirmados e não afirma aprovação de pagamento.
- Quando alguém pede cadastro, gera um convite individual da Central e envia a página `/convite.html`. O convite vale por sete dias e permite um cadastro.
- Mantém até quatro pares de mensagens no contexto, cifrados no Neon. O número do contato é salvo apenas como HMAC.
- Remove e-mails, CPFs, telefones e números longos antes de enviar texto ao Claude ou salvar contexto.
- Interrompe respostas com `SAIR`; `VOLTAR` reativa a conversa quando o interessado solicita.
- Não consulta registros de alunos nem chama APIs administrativas da Lia. O convite é inserido diretamente na tabela de convites somente após o contato pedir cadastro.

## Fatos comerciais utilizados

Gratuito: materiais resumidos, Vade Mecum, até 20 questões diárias no Lei em Dia e edital verticalizado para marcar estudo sem sincronização com a Central. Os links/cadernos do TEC Concursos e QConcursos (QC) são exclusivos do Premium. A lista completa de benefícios Premium e o preço não estão confirmados no código.

O preço de R$ 97 por semestre foi tratado como uma ideia anterior, não como preço aprovado. O checkout do Mercado Pago não está ligado.

## Arquitetura

- `api/whatsapp-sales.js`: endpoint Vercel; verifica o desafio GET e assinatura HMAC SHA-256 dos POSTs Meta.
- `lib/whatsapp-sales-handler.js`: deduplicação, limites, opt-out, geração do convite e respostas.
- `lib/whatsapp-sales-meta.js`: parser de mensagens e envio pela Graph API da Meta.
- `lib/whatsapp-sales-assistant.js`: respostas determinísticas e chamadas Claude apenas para perguntas abertas.
- `lib/whatsapp-sales-store.js`: Neon, convite e contexto cifrado.
- `migrations/001_whatsapp_sales.sql`: SQL preparado e **não executado** para as novas tabelas de contexto, dedupe e limites.
- `tests/whatsapp-sales*.mjs`: testes unitários sem rede, credenciais ou banco real.

## Limites e privacidade

Os limites iniciais configuráveis são 12 mensagens por contato/dia, 100 chamadas Claude/dia e 180 tokens de saída por resposta. Perguntas conhecidas e pedidos de cadastro não consomem chamadas Claude. Configure também um teto de gastos e alerta no Console Anthropic.

O contexto expira em 30 dias; a remoção física acontece quando chegam novas mensagens. Para remoção exatamente no prazo mesmo sem tráfego, configurar depois uma limpeza agendada. A integração só responde dentro de uma conversa iniciada pelo usuário; não faz marketing nem recontato.

## Variáveis necessárias em Preview

`META_APP_SECRET`, `META_WEBHOOK_VERIFY_TOKEN`, `WHATSAPP_ACCESS_TOKEN`, `WHATSAPP_PHONE_NUMBER_ID`, `WHATSAPP_GRAPH_VERSION`, `SALES_ANTHROPIC_API_KEY`, `SALES_ANTHROPIC_MODEL`, `DATABASE_URL`, `SALES_HASH_KEY`, `SALES_CONTEXT_ENCRYPTION_KEY`, `SALES_BASE_URL`, `SALES_SUPPORT_EMAIL`, `SALES_MAX_MESSAGES_PER_CONTACT_PER_DAY`, `SALES_MAX_CLAUDE_CALLS_PER_DAY` e `SALES_CONTEXT_TTL_DAYS`.

Os segredos de vendas são separados da Lia. `SALES_BASE_URL` precisa apontar para a mesma implantação que usa o banco de teste. No Preview, não usar o domínio nem a conexão de Production.

## Estado

O código fica na branch `homologacao` para revisão e prévia. Criar a prévia não configura segredos, não executa o SQL e não conecta o telefone de teste. Até esses itens serem configurados, o webhook responde `403` à verificação e não envia mensagens.

Para validar com WhatsApp, usar o número de teste da Meta, os destinatários de teste permitidos e o `SALES_BASE_URL` da prévia. O telefone definitivo e Production continuam fora desta etapa.
