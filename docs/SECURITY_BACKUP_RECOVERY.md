# Backup e recuperação — Neon

## Estado verificado em 17/11/2026

- Projeto: `neon-beige-arrow` (`solitary-dust-76502943`).
- Branch principal: `br-gentle-rice-aw5a3i2i`.
- Recuperação pontual disponível por 21.600 segundos (6 horas).
- Snapshot manual existente: `snap-blue-wildflower-awwiooux`, criado em 27/10/2026.
- A criação de um snapshot novo e de uma branch isolada foi recusada por limite de recursos do plano. Nenhum snapshot ou branch existente foi apagado para contornar o limite.

## Teste seguro de restauração

1. Confirmar que há vaga de branch/snapshot sem excluir recursos que ainda possam ser necessários.
2. Criar um snapshot atual da branch principal.
3. Restaurar com `finalize=false` para uma nova branch temporária; nunca substituir a branch principal no primeiro teste.
4. Conectar apenas a conta de homologação à branch restaurada.
5. Verificar contagens, migrações, login sintético, planos, quotas e integridade referencial, sem copiar dados para outro serviço.
6. Registrar evidências e remover o recurso temporário somente após aprovação específica.

## Recuperação real

Uma recuperação real exige autorização do proprietário, janela de manutenção, snapshot prévio do estado atual e plano de reversão. A operação de finalizar/substituir branch é destrutiva e não deve ser automatizada.

