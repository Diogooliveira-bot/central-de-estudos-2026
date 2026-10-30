# Base Completa — Etapa 4.5 — Cadastro Gratuito para o Lançamento
**Data:** 27/10/2026
**Estado:** implementação preparada na Preview isolada; **não publicada nem liberada ao público**.

## Decisão comercial
Cadastro público gratuito fará parte do lançamento junto ao Premium, **mediante aprovação independente para a migração 004 e habilitação**. Não misturar automaticamente com a publicação Premium.

## Caminho planejado
Visitante → página pública “Conheça a Base Completa” → **Criar minha conta gratuita** → nome, e-mail, WhatsApp opcional e senha → confirmar e-mail → conta com role=aluno e plano=free → iniciar estudos → conhecer Premium quando desejar.

A home pública e o botão de cadastro são condicionais: aparecerão quando o recurso for habilitado pela API e pela configuração de lançamento. O modo de Preview protegido permanece mantido.

## WhatsApp e autorização comercial
- Campo opcional de telefone brasileiro com DDD. Não impede cadastro se não informado.
- O número é normalizado no backend e **criptografado no servidor com AES-256-GCM** (nonce aleatório por cadastro), nunca salvo como número legível na tabela de contatos.
- Variável Sensitive `BC_SIGNUP_PII_KEY` gerada e configurada **exclusivamente para a Preview comercial**; a chave de Production requer planejamento próprio e armazenamento seguro, separado.
- Checkbox **desmarcada por padrão** “Quero receber novidades e ofertas pelo WhatsApp”. Não é condição para registro, confirmação, plano Free ou compra Premium.
- Preferência e sua versão são armazenadas somente após confirmação de e-mail, em tabela diferente dos usuários e assinaturas: `central_free_signup_contacts`.
- Autorização positiva guarda data e versão do aviso; ausência de autorização guarda `marketing_opt_in=false`, sem data.
- Página autenticada `/preferencias-contato.html` permite revogar marketing ou apagar o WhatsApp; API `GET/POST /api/auth?action=free-signup-contact` atua somente sobre o usuário da sessão.
- **Nenhum envio ou integração WhatsApp** implementado.

## Verificação do remetente de e-mail
A variável `GMAIL_USER` em Vercel **Production** foi comparada ao endereço indicado `basecompleta.estudos@gmail.com`: **é a conta de Production**.
**Não utilizar como remetente exclusivo de homologação** e não reutilizar sua senha. A Preview comercial não recebeu credenciais Gmail.

## Evidências e testes
- CI comercial no GitHub Actions `40577637442`: **51 testes unitários aprovados, 0 falhas**; Mailpit SMTP real local e Chromium desktop/celular com API simulada passaram.
- Testes cobrem criptografia/normalização, consentimento opcional, preferência independente, revogação, exclusão, bloqueio Premium, quotas e lógica existente de e-mail/autenticação.
- Neon TEST `shiny-hall-19564809`, branch `br-late-band-b7lzjsyi`: migração complementar aplicada somente aqui, adicionando colunas ao pending e tabela separada de contatos.
- **SQL real no Neon TEST:** usuário fictício com preferência positiva gerou 1 conta, 1 plano Free, 1 contato e 1 evento de auditoria, 0 Premium; token pendente consumido.
- **SQL real no Neon TEST:** revogação gravou `marketing_opt_in=false`, sem timestamp de consentimento; exclusão subsequente deixou WhatsApp NULL.
- O teste de criptografia é de código e o teste de persistência SQL usa **somente um marcador fictício de ciphertext**. Não declarar que um telefone real foi cifrado pelo navegador e persistido ponta a ponta.
- **NÃO COMPROVADO ainda:** navegador/Preview protegida + API real + Neon de testes + e-mail de provedor externo em um único fluxo. Mailpit foi SMTP real local, mas usou banco simulado.

## Segurança de lançamento
- Production exige explicitamente: `BC_PUBLIC_FREE_SIGNUP_ENABLED=true`, `BC_PUBLIC_FREE_SIGNUP_PRODUCTION_APPROVED=YES`, `BC_SIGNUP_PRIVACY_APPROVED=YES`, Turnstile configurado e `BC_SIGNUP_PII_KEY` válida.
- Proteção da Preview Vercel preservada, sem chaves ou dados sensíveis no GitHub.
- Tabelas de contatos referenciam central_users com ON DELETE CASCADE. Não há alteração no Neon Production.
- Limpeza de cadastros expirados preparada separadamente; programação automática pendente.
- Minuta `docs/MINUTA_PRIVACIDADE_CADASTRO_4_5_NAO_PUBLICAR.md` atualizada com WhatsApp, consentimento e retenção. **Não é uma política publicada**.

## Pendências objetivas para aprovação antes de lançar
1. **E-mail de teste externo separado**: criar uma conta/remetente exclusiva da homologação com credenciais inseridas diretamente na Vercel **Preview** (nunca no chat); o Gmail informado já é Production.
2. **Homologação integrada ponta a ponta**: em Preview protegida + Neon TEST, realizar registro, confirmação pelo e-mail externo, login, recuperação, plano Free e bloqueios/limite no mesmo fluxo com pessoa fictícia.
3. **Privacidade e controlador**: identificar legalmente o fornecedor/controlador e atendimento, aprovar política pública e condições; inserir o link publicado no formulário. Confirmar finalidade e prazo de retenção do WhatsApp.
4. **Antibot e manutenção**: configurar Turnstile real para domínio final, validar e programar limpeza periódica de solicitações vencidas.
5. **Backup e publicação controlada**: concluir Etapa 4.4 e autorizar especificamente a migração 004 em Production, inclusão das variáveis secretas Production, lançamento do cadastro Gratuito e seu relacionamento com a publicação Premium. Não fazer merge/publicação sem esta autorização.

**Preservado:** main, Production Vercel, Neon Production, Hotmart, Etapa 4.4, preços e integrações WhatsApp.
