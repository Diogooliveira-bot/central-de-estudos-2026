# Base Completa — Etapa 4.5 — Homologação consolidada do cadastro gratuito
**Data:** 27/10/2026  
**Status:** componentes e proteções aprovados nos testes executados; **ponta a ponta externo ainda pendente**. Cadastro público não habilitado.

## 1. Isolamento e identidade dos ambientes
- GitHub: `Diogooliveira-bot/central-de-estudos-2026`
- Branch de trabalho: `commercial/etapa-4-5-20261027`, independente de `main`, `backup/setup-safe-4-4-20261027` e `prelaunch/etapa-4-4-20261027`.
- Neon de testes: projeto `shiny-hall-19564809`, branch `br-late-band-b7lzjsyi`, criado somente para a Etapa 4.5.
- Vercel: `DATABASE_URL` do Neon TEST configurada como segredo com escopo exato de Preview para a branch comercial. Não divulgar o valor.
- Não modificar Neon Production `solitary-dust-76502943`.
- Migração `db/migrations/004_public_free_signup.sql`: executada somente na ramificação Neon de testes.
- **Cadastro público desativado:** não foram ativadas `BC_PUBLIC_FREE_SIGNUP_ENABLED`, `BC_FREE_SIGNUP_PREVIEW_ISOLATED` ou `BC_PUBLIC_FREE_SIGNUP_PRODUCTION_APPROVED` no projeto Vercel.

## 2. Evidências — testes executados
| Teste | Componente real utilizado | Resultado | Limite de comprovação |
|---|---|---|---|
| GitHub Actions original `40564083838` | Chromium real desktop 1366 e celular 390, API simulada | **PASSOU** | Não acessou Neon |
| GitHub Actions `40565652302` | SMTP REAL em Mailpit local (localhost:1025), API e banco fictícios | **PASSOU; 38 unitários, 0 falhas** | Não envia para provedor externo |
| GitHub Actions `40566208899` | SMTP local real do e-mail de recuperação de senha, Mailpit | **PASSOU** | Banco fictício |
| GitHub Actions `40566691026` | Chromium real com cadastro, login e recuperação simulados, e SMTP Mailpit local | **PASSOU** | APIs de navegador simuladas; Neon não conectado ao executor |
| Banco real Neon TEST: confirmação de token | PostgreSQL 18 na branch exclusiva; escrita de conta fictícia, assinatura e auditoria | **PASSOU** | Não foi via formulário público |
| Banco real Neon TEST: concorrência com mesmo token | 2 instruções SQL simultâneas `DELETE RETURNING` / CTE atômica | **1 conta Free criada, outra requisição 0** | Apenas ramo de testes |
| Banco real Neon TEST: rate-limit | 5 operações com teto 3 | **3 aceitas, 2 bloqueadas** | Simulou a mesma identidade com janela de teste |
| Banco real Neon TEST: quota Lei em Dia | 21 reivindicações distintas por aluno fictício | **20 permitidas, 21ª bloqueada** | Chamou função do banco, não o catálogo via browser |
| Banco real Neon TEST: idempotência Lei em Dia | Reabertura da mesma questão fictícia | **Permitida sem novo débito** | Somente função SQL |
| Banco real Neon TEST: matriz de permissões Free | Entitlements da assinatura do aluno fictício | **TEC/QC e teoria completa bloqueados; Lei em Dia habilitado com limite 20** | Não clicou em links pelo browser autenticado |
| Banco real Neon TEST: link vencido ou reutilizado | Operações SQL com tokens fictícios | **Bloqueados** | Somente ramo de testes |
| SMTP indisponível | Injeção de falha no servidor local de teste | **HTTP 503 e nenhuma sessão** | Teste automatizado, não falha de provedor externo |
| Privilege escalation e cross-site | API em teste controlado | **Admin/Premium não concedidos; origem cruzada rejeitada** | Teste de API, não pentest externo |

## 3. Mailpit gratuito configurado
- Workflow `.github/workflows/etapa-4-5-commercial-validation.yml` inicia `axllent/mailpit:latest` com portas SMTP 1025 e HTTP 8025 **restritas a 127.0.0.1** no runner efêmero.
- Script `tests/free-signup-mailpit-4-5.mjs`: injeta transporte SMTP `nodemailer` no handler existente, envia e recupera a mensagem por `/view/latest.txt`, lê o link, confirma em banco simulado, comprova papel `aluno`/plano `free` e impede token reutilizado.
- Script também envia e lê uma mensagem real SMTP de **recuperação de senha** na mesma caixa local.
- Endereços `example.invalid` e credenciais de SMTP em testes são **fictícios**, jamais do Gmail Production.
- O Mailpit não comprova entrega ao Gmail, Outlook ou caixa externa; a caixa é local ao GitHub Actions e encerra ao fim do job.

## 4. Correções realizadas nesta continuação
- `tests/free-signup-browser-4-5.mjs`: adicionadas navegação de login e recuperação, com APIs simuladas, em Chromium. Corrigido teste de navegação por `#token` (recarregamento explícito). Corrigido teste de redirecionamento após login usando `?next=/central-v119.html`. **Nenhuma correção em Production.**
- `tests/free-signup-mailpit-4-5.mjs`: novo teste SMTP local efetivo com captura real da mensagem e e-mail de recuperação.
- `.github/workflows/etapa-4-5-commercial-validation.yml`: novo container Mailpit vinculado apenas a loopback, instalação Chromium headless.
- Nenhuma mudança em API de produção, preços, Hotmart ou migração 004 nessa continuação.

## 5. Checklist de pré-liberação — decisão SEPARADA do Premium
- [x] Branch exclusiva comercial sem merge.
- [x] Banco Neon de testes isolado.
- [x] Migração 004 aplicada SOMENTE nesse banco.
- [x] Cadastro Free e consumo de token testados no banco.
- [x] Concorrência e bloqueio de reutilização comprovados.
- [x] Quota 20/21 e TEC/QC Free bloqueados comprovados no banco de testes.
- [x] SMTP Mailpit gratuito: mensagem de confirmação e recuperação recebida.
- [x] Chromium real: telas desktop/celular com API simulada.
- [ ] **Falta** executar Chromium em Preview com API REAL conectada ao Neon TEST e testar login/recuperação reais. Não houve acesso seguro da CI às credenciais do banco; a variável da Vercel não foi exportada para Actions.
- [ ] **Falta** confirmar entrega externa real para caixa de e-mail de testes própria/autorizada, usando SMTP de teste distinto do Gmail Production.
- [ ] **Falta** habilitar autenticação SMTP de teste e flags apenas na Preview da branch comercial, após comprovar isolamento e sem expor senhas.
- [ ] **Falta** validar tratamento de bots, política de privacidade, retenção e exclusão das solicitações expiradas.
- [ ] **Falta** concluir backup real recuperável (Etapa 4.4).
- [ ] **Falta autorização SEPARADA** para migração 004 em Production, habilitação de cadastro gratuito e publicação da versão aprovada. Não vincular automaticamente à publicação Premium.

## 6. Preparação para entrega externa posterior (sem pedir senhas no chat)
1. Criar ou selecionar uma **conta SMTP exclusivamente de homologação**, distinta da conta usada em Production. Pode ser conta Gmail dedicada gratuita com senha de aplicativo se elegível, ou provedor SMTP de testes compatível.
2. Guardar credenciais somente em variáveis **Sensitive** da Vercel na **Preview da branch comercial**. No código atual, `emailConfig` usa `GMAIL_USER` e `GMAIL_APP_PASSWORD`; provedores SMTP não Gmail precisam de um adaptador **específico de Preview**, a implementar e homologar antes de usar.
3. Usar e-mail de destino de propriedade do responsável pela homologação; nenhum endereço pessoal nem senha deve ser colocado em chat, GitHub ou logs.
4. Ligar a função somente depois de testar que `DATABASE_URL` pertence à branch Neon TEST e de ativar os gates **da Preview**, nunca `BC_PUBLIC_FREE_SIGNUP_PRODUCTION_APPROVED`.
5. Testar confirmação, login, recuperação, quota 20/21 e acesso Premium negado no mesmo navegador autenticado. Preservar evidência técnica sem mensagens ou tokens em claro.
6. Somente depois do backup e de autorização expressa discutir publicação do cadastro gratuito — decisão independente do lançamento Premium.

**Conclusão:** os controles principais passaram em testes reais isolados e simulações, mas o caminho completo com e-mail externo + navegador + Neon ao mesmo tempo não foi validado. **NÃO PUBLICAR AINDA.**
