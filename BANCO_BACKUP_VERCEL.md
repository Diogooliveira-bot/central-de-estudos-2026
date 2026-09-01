# Backup geral no Vercel

Esta versão usa um endpoint serverless em `api/backups.js` e Postgres/Neon.

## Variáveis de ambiente

- `DATABASE_URL`: fornecida pela integração Neon/Postgres.
- `BACKUP_SECRET`: senha longa, usada apenas para autorizar os endpoints de backup.
- `BACKUP_RETENTION`: opcional; quantidade de snapshots mantidos, padrão 30 (mínimo 5, máximo 200).

A tabela `central_backups` é criada automaticamente no primeiro acesso.

## Estratégia

1. **Uso diário**: os dados atuais da Central continuam no armazenamento do navegador nesta versão.
2. **Backup por arquivo**: gera um JSON completo e portátil.
3. **Snapshot online**: grava o mesmo JSON no Postgres para manter histórico.
4. **Restauração**: substitui integralmente o estado local pelo snapshot escolhido.

## Segurança

Não coloque `BACKUP_SECRET` no código-fonte. Configure-a apenas nas Environment Variables do projeto Vercel. O navegador solicita a chave no momento do uso e a mantém somente em `sessionStorage`.

## Limite desta etapa

O snapshot online aceita até aproximadamente 4 MB. O download local não tem esse limite. Se no futuro as imagens/anotações fizerem o backup ultrapassar esse tamanho, o recomendado é mover os arquivos grandes para Vercel Blob/armazenamento de objetos e deixar no Postgres apenas metadados e referências.
