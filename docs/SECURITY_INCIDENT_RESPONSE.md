# Resposta a incidentes — Base Completa

## Objetivo

Conter, investigar e recuperar a Central sem divulgar dados pessoais ou segredos. Este procedimento não autoriza exclusão de dados, restauração do banco ou publicação em produção sem a decisão do proprietário.

## Classificação

| Gravidade | Exemplo | Prazo inicial |
|---|---|---|
| Crítica | segredo de produção exposto, acesso administrativo indevido, alteração massiva de dados | contenção imediata |
| Alta | acesso entre alunos, bypass Premium, fraude de assinatura ou quota | mesmo dia |
| Média | abuso limitado, informação interna exposta, proteção preventiva ausente | até 3 dias |
| Baixa | endurecimento sem exploração prática confirmada | próximo ciclo |

## Procedimento

1. Registrar data/hora, serviço, rota e versão/deployment afetado. Não copiar tokens, cookies, senhas nem o corpo integral de registros pessoais.
2. Preservar evidências: ID do deployment, SHA, códigos de erro, IDs internos e janela de tempo. Redigir e-mails, nomes, IPs e dados de alunos.
3. Conter pelo mecanismo menos destrutivo: revogar a credencial comprometida, pausar a integração afetada ou reverter o deployment. Não desligar controles de segurança.
4. Determinar alcance consultando logs Vercel, auditoria administrativa e eventos de assinatura. Usar apenas consultas de leitura durante a triagem.
5. Corrigir em branch isolada, testar autorização, regressão e reversão, abrir Pull Request e publicar somente após aprovação.
6. Recuperar conforme [SECURITY_BACKUP_RECOVERY.md](SECURITY_BACKUP_RECOVERY.md). Nunca restaurar diretamente sobre produção como primeiro teste.
7. Encerrar com causa raiz, impacto comprovado, correções, pendências e prevenção. Notificar pessoas afetadas somente com orientação jurídica quando aplicável.

## Contatos e dados mínimos nos alertas

Alertas podem conter: serviço, ambiente, gravidade, rota, status, SHA e ID técnico. Não podem conter: senha, token, cookie, string de conexão, resposta integral de webhook, e-mail completo, nome ou conteúdo de aluno.

