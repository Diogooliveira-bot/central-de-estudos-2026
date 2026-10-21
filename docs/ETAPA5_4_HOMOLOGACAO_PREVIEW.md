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
