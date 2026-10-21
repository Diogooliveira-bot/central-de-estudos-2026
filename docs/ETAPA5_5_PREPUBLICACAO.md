# BASE COMPLETA 7.0 — ETAPA 5.5 · Pré-publicação TRT-8 2026

**STATUS: PRONTO PARA AVALIAÇÃO — NÃO PUBLICADO.**

## Integração com produção

- Branch de homologação: `feature/multi-editais-trt8-2026`.
- PR de revisão **rascunho**, sem auto-merge: https://github.com/Diogooliveira-bot/central-de-estudos-2026/pull/132
- A main recebeu `171b76baa828666d9fa48ed4ff3f3a0e26193116` (menu superior premium/Administração) depois da criação da branch TRT-8.
- Foi efetuado **merge técnico de reconciliação somente na branch**, com dois pais, preservando CSS/JS e testes novos do menu de administração, além do novo catálogo TRT-8.
- Foram conciliados os quatro arquivos sobrepostos: `central-v119.html`, `central-offline-files-v66172.json`, `package.json`, `tests/student-experience-v3-unit.mjs`.
- GitHub confirmou PR **sem conflitos**, branch à frente e 0 commits atrás da main no momento da reconciliação.

## Validação automatizada

- GitHub Actions: https://github.com/Diogooliveira-bot/central-de-estudos-2026/actions/runs/39636253830
- **130 testes totais; 129 passaram; zero falhas; um ignorado**.
- Os testes foram executados sobre o commit `7f50d220481f42fe4185436fe45e225c9a1b6c30`. Após isso, foi retirado **somente o workflow temporário de teste**, sem alterar o código funcional; a PR manteve a integração.
- Não foram realizados testes manuais adicionais após pedido do usuário para dispensá-los.

## Homologação humana efetivamente realizada

- TRT-8 selecionável e Edital Verticalizado abriu no navegador de aluno.
- Três marcações permaneceram após atualização.
- Aluno 2 não enxergou o progresso do Aluno 1.
- Ao alternar entre os objetivos TJPB e TRT-8, o progresso independente foi preservado.
- Banco Neon de homologação e variáveis da Preview isolados do banco de produção.

## Limitações ainda declaradas

1. **266 de 300 assuntos** TRT-8 ainda sem vínculo validado a módulo; não atribuir teoria completa a todos.
2. Os 34 assuntos vinculados possuem 39 destinos temáticos com classificação de **cobertura parcial**.
3. Quatro áreas sem disciplina própria: Legislação do TRT-8, Direitos Humanos, Direitos da Pessoa com Deficiência e Informática.
4. Testes de offline, nova sessão, logout/login, navegação em cada módulo e ferramentas TEC/QC/Lei em Dia foram dispensados, não homologados manualmente.
5. Verificação de integração foi automatizada; não é substituto de todos os fluxos reais.

## Critério para publicação

**Aguardando autorização específica do usuário.** Não fazer merge, deploy de produção, alteração de banco de produção ou mudança de plano na Vercel sem essa autorização.

Caso aprovada a publicação, checar novamente a HEAD de `main` e a mergeability da PR antes de mesclar; proteger o menu/admin e manter o banco Neon de produção sem migrações destrutivas; verificar o deployment READY e domínio oficial, e em seguida executar apenas conferência de saúde não invasiva.
