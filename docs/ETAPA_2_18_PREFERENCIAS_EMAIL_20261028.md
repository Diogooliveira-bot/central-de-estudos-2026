# Base Completa — Etapa 2.18 | Consentimento comercial por e-mail

**Situação:** implementação concluída em branch isolada em 28/10/2026, sem ChatGPT Work. **Não publicada em produção.**

## Decisão aprovada
- O cadastro gratuito oferece duas opções opcionais e **independentes**: receber ofertas por e-mail e receber ofertas pelo WhatsApp.
- Ambas começam **desmarcadas**. A recusa não impede o cadastro, o login nem os e-mails transacionais necessários para a conta e assinatura.
- Marketing por WhatsApp permanece sem automação ativada.
- **Não há qualquer automação ou disparo de marketing por e-mail nesta etapa.**

## Implementação
- Branch: `commercial/email-marketing-consent-20261028`, derivada da branch isolada de maioridade/Termos V24.
- Cadastro: `cadastro-gratuito.html` mostra checkbox opcional para ofertas por e-mail separadamente do WhatsApp.
- Servidor: `lib/free-signup-handler.js` registra o aceite do e-mail com versão do aviso `signup-email-v1-2026-10-28`; persiste valor e versão no pedido pendente e em `central_free_signup_contacts` apenas após confirmar o e-mail. Valores não expressos (inclusive a string `"true"`) não autorizam marketing.
- Banco: `db/migrations/006_email_marketing_preferences.sql` acrescenta campos `email_marketing_opt_in`, `email_marketing_consent_at`, `email_marketing_notice_version`, `email_marketing_revoked_at`; não altera a regra anterior de WhatsApp.
- Preferências autenticadas: `preferencias-contato.html` e `lib/free-signup-contact-preferences.js` permitem **ativar mediante nova escolha expressa** ou **revogar** e-mails; as ações de WhatsApp permanecem independentes.
- GET da API devolve somente flags e versão do aviso; não devolve telefone cifrado, e-mail, senha ou tokens de autenticação.
- A política de privacidade V24 já descreve e-mails promocionais com autorização facultativa e revogação. A revisão jurídica definitiva continua pendente.
- Backend permanece limitado por controles de origem/sessão e cadastro público não é ativado por estas alterações.

## Testes
- GitHub Actions: https://github.com/Diogooliveira-bot/central-de-estudos-2026/actions/runs/40717287365
- **39 testes unitários aprovados, 0 falhas.**
- Chromium headless em desktop e celular, com API simulada, conferindo checkbox opcional, envio independente das duas flags, autorização/revogação por e-mail e isolamento das ações WhatsApp.
- Nenhuma prova E2E real com banco, SMTP, Cloudflare ou alunos reais realizada aqui.

## Pendências antes do lançamento
1. Revisar e aprovar os textos legais da V24, ainda identificados como minutas.
2. Preparar backup e validar **somente em Neon TEST** as migrações 004, 005 e 006 na ordem; nenhuma migração foi executada nesta etapa.
3. Testar cadastro completo em Preview com Neon e e-mail de teste autorizados, verificando logs e versões de consentimento.
4. **Ao criar o futuro serviço de campanhas:** filtrar destinatários apenas com `email_marketing_opt_in=TRUE`, fornecer mecanismo simples de descadastro em cada mensagem e consultar a preferência atual antes de cada envio. Revogação não afeta notificações transacionais.
5. Não enviar campanhas, não editar produção, não fazer merge em `main` nem ativar cadastro público antes da homologação.
6. Não misturar esta branch com a branch de Hotmart `commercial/hotmart-manual-renewal-20261028` sem revisão de integração.

## Segurança
Nenhum segredo colocado no GitHub ou chat. Nenhuma cobrança, cadastro público, banco real ou conta de aluno alterada. Sem uso de Work.
