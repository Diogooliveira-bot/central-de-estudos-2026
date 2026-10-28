# Base Completa — Etapa 2.19: avisos de vencimento
Data: 28/10/2026. Branch isolada. Não ativada em produção.

## Implementado
- Avisos 7 dias antes e no dia do vencimento da assinatura Premium.
- Verificação da data no fuso America/Fortaleza e da assinatura Hotmart ativa.
- Renovação sempre manual, sem cobrança ou propaganda.
- Endpoint autenticado de cron diário, bloqueado por padrão.
- Controle para não repetir um aviso para a mesma assinatura e vencimento.
- Banco: migration 007 preparada, ainda não aplicada.
- E-mail e banco de dados totalmente simulados nos testes.

## Para liberar
- Homologar a migration 007 no Neon TEST.
- Testar SMTP em caixa autorizada, sem disparos massivos.
- Validar URL da Central, segurança e demais requisitos de lançamento.
- Habilitar variáveis de ambiente somente depois da homologação completa.

GitHub Actions: https://github.com/Diogooliveira-bot/central-de-estudos-2026/actions/runs/40756698874
Resultado: 14 testes aprovados, 0 falhas.
Sem alterações na produção e sem envio real de e-mails.
