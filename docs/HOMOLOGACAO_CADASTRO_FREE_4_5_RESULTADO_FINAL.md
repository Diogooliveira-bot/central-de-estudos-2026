# Base Completa — Etapa 4.5 — Fechamento de homologação parcial (27/10/2026)

## Critérios concluídos
- Branch comercial preservada, sem merge, sem alteração na Production ou no projeto de backup.
- `DATABASE_URL` da Preview escopada exatamente à branch comercial: banco de testes Neon `shiny-hall-19564809`, branch `br-late-band-b7lzjsyi`.
- Migração 004 aplicada **só** à ramificação de homologação, sem misturar publicação Premium.
- Teste PostgreSQL real anterior: usuário fictício, assinatura FREE única e auditoria; token consumido; Premium não concedido; link vencido e reutilizado bloqueados.
- Fluxos de frontend desktop 1366px e celular 390px com Playwright Chromium em CI **com API simulada**; não confundir com validação completa em produção.
- Testes automatizados de webhook, planos, recuperação de senha, abuso de GET/origem, tentativa de atribuir admin/Premium via corpo do request, e falha de entrega SMTP.
- Cadastro público **não habilitado**: sem `BC_PUBLIC_FREE_SIGNUP_ENABLED` e sem demais flags.
- Códigos/senhas reais e endereço de e-mail pessoal não são incluídos aqui.

## E-mail separado — decisão técnica
- Não usar `GMAIL_APP_PASSWORD` da Production nem sua conta Gmail de alunos.
- Nesta sessão não foi disponibilizado um provedor SMTP de teste com credencial e caixa postal de teste autorizada, nem um endereço de destino autorizado. Portanto nenhuma mensagem externa foi enviada e nenhuma entrega real pode ser atestada.
- Melhor opção de validação sem cobrar por e-mail: caixa SMTP local (Mailpit/MailHog) numa CI isolada, para observar mensagem efetivamente entregue por SMTP sem tráfego externo. **Isso testa a entrega à caixa de teste, não ao provedor real (Gmail/Outlook).**
- Para comprovar entrega externa real, contratar ou criar, em procedimento separado, credenciais de teste gratuitas quando disponíveis, usar e-mail de destino de titularidade autorizada e guardar credenciais exclusivamente na Vercel Preview isolada. Consultar termos/cotas e jamais cadastrar credenciais em GitHub, chat, scripts ou relatórios.

## Pendente antes de considerar cadastro pronto
1. Testar recebimento **externo real** do e-mail em caixa autorizada, sem SMTP Production.
2. Teste no navegador com API e banco de testes reais, com confirmação por e-mail e login/recuperação completos. O teste Chromium em CI usa APIs simuladas, portanto não é prova ponta a ponta.
3. Validar no backend com aluno fictício real: 20 questões/dia no Lei em Dia e bloqueio efetivo dos links TEC/QConcursos (já há testes direcionados de regra de planos, mas não revalidado pelo browser conectado ao Neon).
4. Realizar testes de concorrência transacional e quotas usando a branch Neon de testes, com limpeza controlada e sem afetar outros ramos.
5. Confirmar política de privacidade, retenção de registros de confirmação e proteção contra bots (por exemplo, mecanismo anti-automação antes de abrir registro ao público).
6. Somente após backup Etapa 4.4 e autorização individual: aplicar migração 004 em Production e habilitar cadastro. Essa decisão deve ser **separada** da publicação Premium.

## Nota sobre ferramentas de browser
- Preferir Playwright em GitHub Actions sem conectar à Production.
- A Preview Vercel está protegida e não há credenciais de navegação autenticadas nem serviço de e-mail externo de testes autorizado nesta sessão.
- Não realizar compra ou pagamento; não iniciar serviço pago de automação de browser.

## Evidências
- GitHub Actions `.github/workflows/etapa-4-5-commercial-validation.yml` com testes unitários e `tests/free-signup-browser-4-5.mjs` em Chromium.
- SQL e etapas comprovadas documentadas em `docs/HOMOLOGACAO_CADASTRO_FREE_NEON_20261027.md`.

**Decisão: NÃO LIBERAR CADASTRO PÚBLICO ainda.** A implementação permanece isolada e desligada.
