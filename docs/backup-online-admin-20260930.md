# Backup online — notas de administração

Este arquivo concentra as instruções técnicas que não precisam aparecer na interface da BASE COMPLETA.

## Variáveis do ambiente

No projeto da Vercel, o histórico de backups online depende das variáveis:

- `DATABASE_URL`: conexão do banco usado pela API de backups.
- `BACKUP_SECRET`: chave privada exigida pelas rotas de backup.

A `BACKUP_SECRET` não deve ser escrita no código-fonte, exibida na interface ou incluída em arquivos públicos. A Central solicita a chave apenas quando uma operação de histórico online exige autenticação e mantém esse valor somente na sessão do navegador.

## O que permanece disponível sem banco online

O botão de baixar backup geral continua funcionando localmente. Ele exporta os dados persistentes da Central sem exigir `DATABASE_URL` ou `BACKUP_SECRET`.

## Regra de manutenção

Alterações de interface não devem limpar `localStorage`, trocar chaves persistentes nem invalidar dados de progresso, agenda, anotações ou registros de questões. Mudanças de formato precisam ser compatíveis com os dados existentes.
