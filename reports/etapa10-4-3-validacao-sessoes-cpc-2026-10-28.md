# Base Completa — Etapa 10.4.3 | Contas autenticadas e matriz de planos

**Data:** 28/10/2026. **Projeto de teste:** Vercel `base-completa-teste-visual`, deployment `dpl_H3XSoKBuzMh1wZrTe5PoAhstRJjn`, código-fonte aprovado `f5dc763b6fcd0f995e2a44ff98e0f03ef3d630e9`. Banco Neon **`shiny-hall-19564809`**.

## Verificações comprovadas

- O proprietário informou ter criado as duas senhas e salvo dois perfis de navegador independentes.
- Consulta **somente leitura** ao Neon confirmou usuários sintéticos ativos, sem bloqueios e com registros de login da aplicação no dia 28/10/2026. Premium último login: **10:28:32 UTC**. Gratuito: **10:30:25 UTC**. Estes são registros históricos do banco; isoladamente não provam que a sessão atual do navegador continua válida.
- As contas têm assinatura `active` e permissão prevista:

| Recurso | Gratuito | Premium |
|---|---|---|
| Teoria resumida | Habilitado | Habilitado |
| Teoria completa | Bloqueado por entitlement | Habilitado |
| Links TEC | Bloqueado por entitlement | Habilitado |
| Links QConcursos | Bloqueado por entitlement | Habilitado |

- Nenhuma consulta alterou senha, plano, progressos, pagamentos ou contas.
- A Preview publicada, seu banco isolado e os testes do Chromium da Etapa 10.4.1 permanecem aprovados.

## Limitações e ensaios não certificados

Foram submetidas duas execuções de browser com os perfis persistidos, uma para Gratuito e outra para Premium, com instrução para comprovar sessão, plano, navegação e progresso, **sem inserir senhas**. No último retorno disponível, as execuções **estavam `pending` (passo 0, sem resultado observável)**:

- Gratuito: execução `adcac97b-feac-4065-8acb-d7bfe1d659cd`.
- Premium: execução `926eefdb-5fab-499b-a5f7-7af025d33f43`.

O perfil de navegador registrou autenticação em Google, mas a leitura do banco indica que as contas da Base também fizeram login. **Não tratar isso como prova da persistência de cookie no navegador.**

**Ainda falta aferir por sessão real** a resposta HTTP de bloqueio de `/content/cpc/mXX-native-data.js` para Gratuito, o acesso Premium ao M01–M20 na Preview, as tabelas e a persistência da marcação de leitura. A auditoria local de 60/60 cenários e os 40/40 testes de autenticação e autorização de código já foram aprovados em etapa anterior, mas não substituem E2E autenticado no deployment.

**Conclusão:** perfis de teste existentes, contas com histórico de login e permissões do banco corretas. **Etapa 10.4 não pode ser marcada como homologada integralmente.** Não houve modificação em Production, `main`, banco real ou qualquer configuração de segurança.
