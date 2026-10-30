# Base Completa — Etapa 2.17, cadastro e regras legais V24
**Execução:** 28/10/2026, no chat, sem ChatGPT Work.

## Escopo concluído
- Branch isolada `commercial/cadastro-legal-v24-20261028` criada a partir da branch de homologação do cadastro `commercial/etapa-4-5-20261027`; nenhuma mudança em `main`.
- `cadastro-gratuito.html`: declaração de **18 anos ou mais** e aceite dos Termos de Uso como checkboxes obrigatórios distintos, com links para as minutas; marketing por WhatsApp continua opcional e desmarcado.
- `lib/free-signup-handler.js`: valida as duas declarações no **servidor**, valida `termsVersion` contra `v24-draft-2026-10-28`, registra horário da declaração no pedido pendente e salva, na confirmação de e-mail, um aceite auditável, com a criação da conta em SQL atômico.
- Produção exige agora a flag adicional `BC_SIGNUP_TERMS_FINAL_APPROVED=YES`, além das proteções já previstas. Esta flag **não foi ativada**; V24 é minuta. Ao aprovar o documento final, atualizar sua versão no front/backend e solicitar o aceite da versão definitiva.
- `db/migrations/005_free_signup_legal_acceptance.sql`: adição **planejada e não executada** de colunas na tabela de pendências e tabela de aceites por usuário/versão. Requer migração 004 previamente.
- As três páginas de minutas V24 estão presentes na branch para testes de navegação: `termos-de-uso.html`, `politica-de-privacidade.html`, `politica-de-cookies.html`. O site V24 comercial **ainda depende de publicação**; não presumir que estas páginas já estão publicadas no site de marketing.

## Validação automática
- GitHub Actions: https://github.com/Diogooliveira-bot/central-de-estudos-2026/actions/runs/40712234256
- **SUCCESS:** 29 testes unitários; 0 falhas.
- **SUCCESS:** navegador Chromium real nos viewports de desktop e celular, com API simulada, conferindo que sem as duas marcações não há pedido de cadastro, que as marcações são transmitidas e que o formulário fechado não coleta dados.
- Estes testes **não são** uma homologação integrada com banco Neon REAL, SMTP externo nem Cloudflare real.

## Próximas pendências
1. Publicação comercial V24 bloqueada por limite diário de Vercel; lembrete programado para 29/10/2026. Não fazer deploy manual além do limite e não pagar plano.
2. Revisar documentos V24 com fonte responsável; completar exigências de identificação do fornecedor e confirmar dados dos subprocessadores. Não publicar os textos como versão final sem revisão.
3. Avaliar e aplicar migração 005 **somente em Neon TEST** (com backup e autorização apropriada), depois executar cadastro real de homologação; não aplicar migração em Production.
4. A configuração do Turnstile está programada para o Work em 29/10/2026 às 16h, mas o proprietário informou não ter créditos no Work; não presumir execução.
5. Separar consentimento promocional por **e-mail** do WhatsApp: preferência definida pelo proprietário, ainda não implementada. Não ativar disparos.
6. Preservar os ajustes da padronização visual realizados em outras branches. Não mesclar alterações em main automaticamente.
7. Hotmart/renovação manual está em branch isolada `commercial/hotmart-manual-renewal-20261028`; proprietário pediu adiamento por falta de créditos Work.

## Segurança
Nenhum banco real modificado. Nenhum segredo enviado ao repositório. Nenhum cadastro ou pagamento público habilitado. Não criar ou compartilhar credenciais reais de teste.
