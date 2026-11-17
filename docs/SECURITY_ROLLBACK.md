# Reversão segura de publicação

## Aplicação Vercel

1. Identificar o primeiro deployment afetado e o último deployment saudável pelo ID e SHA.
2. Preservar logs e horário do incidente sem registrar segredos.
3. Preferir rollback/promote do deployment saudável existente; não apagar deployments antigos.
4. Confirmar login, conta Gratuita, Premium, painel administrativo, disciplinas, questões e recuperação de senha.
5. Corrigir a causa em nova branch e Pull Request. Não reaplicar o deployment defeituoso.

## Banco Neon

Migrações de segurança devem ser aditivas. Se uma migração falhar, interromper a publicação e manter o código anterior. Não executar `DROP`, truncamento, substituição da branch principal ou restauração final sem autorização específica.

## Critério de conclusão

A reversão só termina quando a versão saudável responde, os fluxos críticos passam e não há aumento de erros. O relatório deve registrar deployment, SHA, janela afetada, validações e pendências.

