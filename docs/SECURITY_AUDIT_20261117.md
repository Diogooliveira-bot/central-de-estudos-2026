# Auditoria de segurança — Base Completa

**Data:** 17/11/2026  
**Escopo:** aplicação, repositório GitHub, projeto Vercel `central-de-estudos`, projeto Neon `neon-beige-arrow` e integrações identificadas no código.  
**Produção:** não alterada.  
**Classificação atual:** **NÃO APTO para lançamento antes da aprovação e publicação desta correção**. A branch corrige os riscos altos encontrados, mas a produção ainda executa a versão anterior e a migração 011 ainda não foi aplicada.

## Resumo executivo

A auditoria confirmou que a aplicação já tinha controles importantes: sessões assinadas e revogáveis, cookies `HttpOnly/Secure/SameSite`, autorização por função, entitlements Premium no servidor, recuperação de senha com token de uso único, webhook Hotmart autenticado e idempotente, quota atômica no PostgreSQL e exclusão de conta com reautenticação.

Foram encontrados dois riscos altos: a rota de questões gratuitas liberava uso ilimitado quando a migração de quota estivesse ausente; e o isolamento do Neon era obrigatório apenas para nomes antigos de branches, com dois caminhos que abriam conexão direta e ignoravam a guarda. Ambos foram corrigidos na branch. Também foram corrigidos rate limiting de login, auditoria administrativa, limites de payload, mensagens internas, permissões SQL e cabeçalhos HTTP.

## Vulnerabilidades e situação

| ID | Gravidade | Achado inicial | Correção/evidência | Situação na branch |
|---|---|---|---|---|
| BC-01 | Alta | Questões do Gratuito falhavam abertas se a migração 010, tabela ou função de quota faltasse | `lib/questoes-handler.js` agora devolve 503 sem gabarito; cenário PGlite pré/pós-migração passou | corrigida e testada |
| BC-02 | Alta | Preview arbitrária podia acessar um `DATABASE_URL` herdado sem guarda; editor e imagens abriam Neon diretamente | guarda obrigatória para toda Preview com banco; todos os caminhos usam `database()`/SQL da sessão | corrigida e testada |
| BC-03 | Alta | `main` não possui proteção de branch/status checks e publica a produção | CI e CodeQL foram preparados, mas a regra do GitHub exige permissão/configuração do proprietário | pendente; bloqueia classificação APTO |
| BC-04 | Média | Login tinha bloqueio por conta, mas não bloqueio persistente por e-mail desconhecido/IP | tabela de rate limit com identidade HMAC, janelas atômicas, limpeza e respostas genéricas | corrigida e testada |
| BC-05 | Média | Criar/alterar/excluir aluno e redefinir senha não deixavam trilha dedicada | auditoria transacional, sem e-mail/senha, e tabela sem UPDATE/DELETE para PUBLIC | corrigida e testada |
| BC-06 | Média | Função `central_claim_questao` mantinha EXECUTE implícito para PUBLIC | migração 011 revoga a permissão | corrigida; migração pendente em produção |
| BC-07 | Média | Respostas globais sem CSP anti-frame, `nosniff`, política de referência e permissões | cabeçalhos globais adicionados em `vercel.json` | corrigida e testada na configuração |
| BC-08 | Média | Alguns endpoints liam JSON sem limite ou retornavam detalhes internos de exceções | limite global de 4 MB e mensagens sanitizadas | corrigida e testada |
| BC-09 | Média | Rede pública do Neon sem allowlist de IP | compensação atual: conexão somente no servidor, TLS e segredo no cofre; restrição depende dos recursos/arquitetura do plano | pendente com compensação |
| BC-10 | Média | Firewall/eventos Vercel não puderam ser consultados pela credencial disponível (403) | CI, CodeQL e monitor semanal compensam parcialmente | pendente por permissão |
| BC-11 | Média | Ações GitHub usavam tags mutáveis | ações existentes e novas fixadas em SHA; Dependabot semanal para npm e Actions | corrigida |
| BC-12 | Baixa | Webhook registrava identificador de transação em aviso | log reduzido a presença/ausência, sem identificador | corrigida e testada |
| BC-13 | Baixa | Snapshot atual e restauração isolada não puderam ser criados por limite do plano | PITR de 6h e snapshot antigo confirmados; procedimento documentado, sem apagar recursos | pendente |

## Matriz das proteções verificadas

| Controle | Classificação | Evidência |
|---|---|---|
| Sessão assinada, expiração e revogação | implementada e testada | testes de assinatura, expiração, `session_version` e cookie |
| Separação entre alunos | implementada e testada | APIs usam `session.user.id`; testes de exclusão/cascata e contrato anti-IDOR |
| Gratuito sem Premium | implementada e testada | matriz de entitlements e entrega privada passaram |
| Usuário comum sem operações administrativas | implementada e testada | `requireSession` por função e testes de painel/operações |
| Assinatura Hotmart | implementada e testada | assinatura, produto/oferta, idempotência, atomicidade e não recorrência testados |
| Lei em Dia | implementada e testada | quota/entitlement no servidor e testes de entrega |
| Questões internas | implementada e testada após correção | gabarito somente após resposta; limite atômico e falha fechada |
| Recuperação de senha | implementada e testada | token aleatório, hash, expiração, uso único e revogação de sessões |
| Exclusão de conta | implementada e testada | senha + confirmação, função permitida e cascata isolada |
| Auditoria de ações administrativas | implementada e testada na branch | migração 011 e CTEs transacionais |
| Proteção global de branch | ausente | `main` reportada como não protegida pelo GitHub |
| Restauração atual em ambiente isolado | ausente nesta execução | limites de branch/snapshot do Neon |

## Alterações relevantes

- `lib/auth.js`: guarda universal de Preview, tamanho máximo de JSON, IP validado e rate limit HMAC.
- `api/auth.js`: bloqueio persistente de tentativas e respostas anti-enumeração.
- `lib/questoes-handler.js`: quota gratuita em modo fail-closed.
- `api/users.js`: auditoria transacional de ações administrativas.
- `api/content-editor.js`, `lib/content-image-handler.js`: conexão centralizada com proteção de Preview.
- `api/*.js`: erros sanitizados e limite 413.
- `db/migrations/011_security_hardening.sql`: tabelas de rate limit/auditoria e revogações SQL.
- `vercel.json`: cabeçalhos de segurança.
- `.github/workflows/security-ci.yml`, `.github/workflows/codeql.yml`, `.github/dependabot.yml`: monitoramento preventivo.
- `SECURITY.md` e documentos de incidente, backup e rollback.

## Testes e evidências

| Verificação | Resultado |
|---|---|
| Suíte de segurança | 71/71 aprovados |
| Guarda de Preview Neon | 7/7 aprovados |
| Cenários PostgreSQL de questões | cota 5/dia, concorrência, isolamento diário, Premium e falha fechada aprovados |
| Dependências npm | 0 vulnerabilidades conhecidas no `npm audit` |
| Segredos em arquivos versionados | 1.874 arquivos verificados, nenhum padrão de alto risco detectado |
| Build Vercel privado | aprovado; materiais protegidos ficaram fora da árvore estática |
| Testes passivos de produção | rotas de usuários, planos, questões e admin recusaram sessão ausente com 401 |
| Suíte geral existente | 408 testes: 404 aprovados, 3 falhas preexistentes de conteúdo, 1 ignorado por Chromium ausente |

As três falhas preexistentes são: cache do guia de CF não renovado, contrato de fixação procurando arquivo CF no artefato central e erro de sintaxe nos dados de teoria de RLM. Elas não foram causadas pelo hardening, mas devem ser corrigidas antes do lançamento por risco de regressão pedagógica. Um teste adicional antigo de conteúdo protegido também revelou que `index.html` versionado começa com aviso de saída truncada; a rota principal usa `central-v119.html`, porém o arquivo legado deve ser saneado em tarefa própria.

## Infraestrutura e backups

- GitHub: repositório público; branch de segurança isolada; `main` sem proteção. CI, CodeQL, Dependabot e pinagem por SHA preparados.
- Vercel: projeto e domínios preservados; produção não publicada; SSO de Preview existente; firewall/eventos não consultáveis com a permissão atual; nenhum erro de runtime observado na janela consultada.
- Neon: PG 18, branch principal preservada, PITR de 6h, snapshot manual de 27/10/2026. Nova branch, novo snapshot e teste de restauração foram bloqueados por limite; nada foi apagado.
- Monitoramento: revisão semanal automática criada para GitHub, Vercel e Neon, avisando somente quando houver risco ou ação necessária e sem dados pessoais.

## Custos

Nenhum custo adicional contratado ou autorizado. Todas as mudanças usam recursos existentes/gratuitos. Proteções que exigirem mudança de plano permanecem como recomendação, não como contratação.

## Condições para lançamento

1. Revisar e aprovar a Pull Request.
2. Aplicar a migração 011 em janela controlada e validar a execução sem erro.
3. Publicar a versão aprovada e repetir os testes de autorização na produção.
4. Proteger `main` exigindo Pull Request e os checks de segurança/testes.
5. Abrir vaga segura no Neon e executar uma restauração em branch isolada.
6. Corrigir ou aceitar formalmente as regressões pedagógicas preexistentes.

Após 1–4, a avaliação pode subir para **APTO COM RESSALVAS**; para **APTO**, também devem ser resolvidos o teste de restauração e as regressões preexistentes.

## Pull Request e prévia

- Pull Request: a preencher após envio da branch.
- Prévia Vercel: a preencher após o deployment ficar pronto.

