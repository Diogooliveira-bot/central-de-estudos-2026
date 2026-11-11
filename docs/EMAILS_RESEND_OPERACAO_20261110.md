# Base Completa — Resend e e-mails aprovados (10/11/2026)

## Situação

Todos os **13 modelos** aprovados estão versionados no repositório. A integração Resend foi testada com e-mails reais em uma **branch isolada do Neon**, sem dados de alunos de produção.

**Publicação em produção:** NÃO executada nesta branch. O PR #256 permanece em rascunho.

### Disparos conectados ao fluxo real (4)

| Gatilho | Modelo | Código | Status |
| --- | --- | --- | --- |
| Solicitação de cadastro | Confirmação | `lib/free-signup-handler.js` | Conectado ao provedor selecionado |
| Cadastro confirmado e conta Free criada | Boas-vindas | `lib/free-signup-handler.js` | Pós-confirmação, envio não bloqueante |
| Solicitação de recuperação | Recuperação de senha | `lib/password-reset.js` | Conectado ao provedor selecionado |
| Troca de senha persistida | Senha alterada | `lib/password-reset.js` | Pós-atualização, envio não bloqueante |

A confirmação e a redefinição exigem tokens de 30 minutos e uso único. Os modelos não geram credenciais nem concedem Premium.

### Modelos preservados e prontos para conectar a eventos futuros (9)

| Evento | Modelo aprovado | Requisito para disparo |
| --- | --- | --- |
| Assinatura validada | Premium ativado | Confirmação de pagamento/assinatura |
| Vencimento próximo | Premium perto do vencimento | Assinatura e data reais, deduplicação |
| Fim de validade | Premium expirado | Vencimento efetivo, sem acesso pago |
| Reembolso confirmado | Reembolso confirmado | Evento financeiro confirmado |
| Cancelamento registrado | Cancelamento registrado | Estado e data corretos |
| Primeiro estudo ainda não realizado | Primeiro estudo | Atividade real; consentimento de relacionamento |
| Resumo semanal | Resumo semanal | Indicadores reais; consentimento de relacionamento |
| Material publicado | Novos materiais | Publicação e permissão do plano; consentimento |
| Atendimento aberto | Suporte recebido | Protocolo real do atendimento |

Arquivos originais foram recuperados da coleção HTML de 30/10/2026 (Pacotes 2 e 3), mantendo a redação e substituindo imagens CID por imagens hospedadas da marca para compatibilidade com o transporte de e-mail.

O catálogo `lib/approved-email-packs.js` valida campos obrigatórios, porcentagens, URLs HTTPS autorizadas e escapa valores no HTML. O dispatcher `lib/approved-email-dispatcher.js` exige evento verificado e consentimento para relacionamento. Ele **não tem endpoint público, cron, fila ou disparos automáticos**. Para ativar cada evento, conectar a origem real de dados após deduplicação e testar.

## Ambientes e segurança

- **Preview Resend:** `BC_EMAIL_PROVIDER=resend`, `RESEND_API_KEY` e `DATABASE_URL` da branch TEST, sem contaminar outras prévias.
- **Production:** continua com provedor existente, sem merge ou alteração de variáveis.
- Nunca armazenar senhas, tokens de reset, chaves API, destinatários ou corpos de mensagens em logs.
- Envio transacional não equivale a autorização para mensagens comerciais.
- O Turnstile real gerou erro 110200 no hostname temporário Vercel, pois não está autorizado no Cloudflare; não remover a proteção para contornar isso.
- O plano Hobby Vercel limitou novas implantações à cota diária; a publicação da versão final precisa ser verificada quando houver cota.

## Validação executada

- E-mail Resend real para Gmail confirmado.
- Cadastro real na branch Neon TEST: solicitação, mensagem recebida, confirmação, plano Free, consentimento e uso único do token.
- Recuperação na mesma conta fictícia: mensagem recebida, redefinição, token consumido e sessão anterior invalidada.
- `npm run test:emails`: modelo HTML, fornecedor, fluxos de cadastro/recuperação, catálogo Premium/relacionamento, consentimento e injeção.
- Workflows gerais (PWA, Penal V3, editor, ADM, integração de lançamento) devem estar verdes no commit final antes de merge.

## Passos de publicação controlada

1. Verificar que PR #256 inclui somente as alterações de e-mail aprovadas e a correção de teste Civil.
2. Confirmar CI do último commit e revisar o diff.
3. Manter Gmail em Production como padrão durante a primeira publicação do código.
4. Em janela de mudança, selecionar `BC_EMAIL_PROVIDER=resend` em Production, reimplantar e testar somente endereços controlados.
5. Acompanhar entrega, erros, taxas, duplicações e logs, com rollback por variável de ambiente para Gmail.
6. Ativar cada pacote Premium e relacionamento separadamente, somente com eventos confirmados e consentimento.

**Não usar o dispatcher isolado para enviar mensagens sem fonte de dados verificada.**
