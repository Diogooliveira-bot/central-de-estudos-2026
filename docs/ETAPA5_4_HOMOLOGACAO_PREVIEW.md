# Etapa 5.4 — Homologação funcional multi-editais

**Situação**: testes em Preview, exclusivamente na branch `feature/multi-editais-trt8-2026`. **Sem merge ou publicação em produção.**

## Configuração do ambiente

- Neon homologação: projeto `raspy-pond-46403448`, banco `neondb`, branch `br-mute-king-b8kcbx4r`.
- Neon produção separado: projeto `solitary-dust-76502943`, fora de escopo, **não modificar**.
- Vercel Preview: `DATABASE_URL`, `AUTH_SECRET`, `BACKUP_SECRET`, `EXAM_PROGRESS_PREVIEW_DB_ISOLATED=true` restritas à branch `feature/multi-editais-trt8-2026`. Seus valores são segredos: não registrar aqui.
- 3 alunos de teste ativos no banco isolado, existentes antes desta etapa. Não expor credenciais.
- Como esta branch poderá herdar variáveis de produção usadas por outras rotas, **verificar cada rota autenticada**: `lib/auth.js` depende de `DATABASE_URL` e `AUTH_SECRET` especificamente, que possuem overrides de Preview por branch.
- O TJPB anterior tem progressos no banco de homologação; **não apagar/desativar alunos** antes de finalizar o teste.

## Critérios de aceitação

| ID | Teste | Esperado |
|---|---|---|
| H01 | Página de login/Bootstrap Preview | HTTP 200; código da branch correta |
| H02 | API de progresso sem autenticação | HTTP 401 (não 503), com isolamento configurado |
| H03 | Aluno A seleciona TRT-8 | 12 disciplinas; 300 assuntos; 3 marcações |
| H04 | Alternância TRT-8 ⇄ TJPB | Progresso de ambos preservado |
| H05 | Salvar + atualizar página | Marcações persistem |
| H06 | Logout/login | Marcações recuperadas |
| H07 | Aluno B faz login | Não enxerga marcações de A |
| H08 | Offline/PWA + reconectar | Fila local e sincronização pela nuvem |
| H09 | Outro navegador/sessão | Marcações aparecem ao fazer login no mesmo aluno |
| H10 | Abrir módulo de CF, ADM, Civil, CPC, Trabalho, RLM | Módulo nativo expandido, sem abrir disciplina errada |
| H11 | Links TEC/QC, Lei em Dia, infográficos | Recursos correspondentes são acessíveis onde existentes |
| H12 | Tópicos sem cobertura | "Em preparação"; nenhum link imaginário |
| H13 | Proteção de produção | Confirmação de branch e banco de Preview isolados |

## Bloqueios até homologação

Aprovação da suíte automatizada **não substitui H03–H11**, que dependem de testes autenticados em navegador. Não afirmar que foram aprovados sem executá-los.

## Execução em 21/10/2026 — resultado parcial

- **Aprovado — Isolamento de configuração:** quatro variáveis criadas e novamente lidas com `gitBranch=feature/multi-editais-trt8-2026` e `target=['preview']`, sem alterar as globais de produção.
- **Aprovado — banco separado:** credenciais `DATABASE_URL` herdadas da Preview anterior verificadas como referentes ao projeto Neon de homologação `raspy-pond-46403448`, distinto da produção.
- **Aprovado — contas artificiais disponíveis:** 8 contas no total no banco isolado; 3 alunos de teste ativos. Não foram criadas contas reais.
- **Aprovado — estrutura dos dados:** chave primária da tabela `central_exam_topic_progress` é `(user_id,exam_id,topic_id,marker)`. Há 24 marcações existentes do edital TJPB associadas a 1 aluno no banco isolado, sem alterações.
- **Aprovado — testes automatizados anteriores:** 122 aprovados, 0 falhas, 1 ignorado (suíte da Etapa 5.3); sem validação autenticada de ponta a ponta nesta etapa.
- **BLOQUEADO — nova Preview:** Vercel respondeu `402 payment_required`, `api-deployments-free-per-day`, limite de mais de 100 deployments nas últimas 24 horas. Não é possível confirmar a branch atual online; nenhuma build deste período deve ser declarada testada. Não há Vercel CLI autenticada disponível no ambiente para alternativa.
- **PENDENTES:** H01–H12 no navegador com dois alunos. H13 (isolamento de configuração/banco) foi parcialmente verificado, mas precisa de smoke test do deployment efetivo.
- **Segurança:** não foi feita chamada SQL contra o projeto Neon de produção, nenhuma conta foi desativada, nenhum merge/publicação foi executado.

**Próxima ação permitida:** após o limite da Vercel ser liberado, construir nova Preview especificamente no SHA da branch, confirmar `READY`, verificar HTTP 401 para API não autenticada (em vez de 503), autenticar as contas fictícias e executar H03–H12. Não publicar produção sem autorização.
