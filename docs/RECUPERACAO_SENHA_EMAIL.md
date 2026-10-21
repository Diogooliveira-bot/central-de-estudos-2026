# Base Completa — Recuperação de senha por e-mail

## Status de ativação

Implementação de aplicação concluída na branch `feature/recuperacao-senha-email-20261021`.
A entrega REAL por e-mail só está ativa após a configuração de Resend com domínio
remetente verificado. Não confundir testes de e-mail mockado com entrega real.

**Não fazer merge/publicação sem homologação do envio real.**

## Envio

1. Criar uma conta em https://resend.com.
2. Validar um domínio próprio na área Domains (DKIM/SPF conforme o painel).
   O subdomínio `vercel.app` da Central NÃO é um domínio próprio de envio.
3. Gerar uma chave de API com permissão de envio.
4. Em Vercel → projeto central-de-estudos → Environment Variables, definir
   `RESEND_API_KEY` (secreto) e
   `PASSWORD_RESET_FROM` com um remetente verificado, exemplo:
   `Base Completa <acesso@seudominio.com.br>`.
5. Na Preview, restringir as variáveis à branch de homologação e enviar para
   endereço de teste sob controle do administrador.
6. Depois de comprovar entrega, conteúdo, expiração, troca de senha e login,
   configurar as variáveis **separadamente** em Production e publicar.
7. Jamais enviar chave, senha ou token pelo chat, GitHub ou logs.

API existente da aplicação:
- `POST /api/auth?action=password-reset-request`: recebe `{email}` e responde
  mensagem genérica, sem confirmar se o aluno existe.
- `POST /api/auth?action=password-reset-check`: recebe `{token}`, devolve
  `{valid:true|false}`.
- `POST /api/auth?action=password-reset-confirm`: recebe `{token,password}`.

Páginas públicas: `/login.html` e `/recuperar-senha.html`.

## Proteções
- 256 bits de aleatoriedade criptográfica; somente SHA-256 do token no PostgreSQL.
- Uso único, 30 minutos; token apenas no fragmento `#token`, removido do endereço
  pelo navegador; respostas marcadas `no-store`.
- Apenas contas ativas com perfil `aluno` podem solicitar recuperação.
  Administradores mantêm a rotina administrativa atual.
- Rate limit persistente por identidade HMAC (3/h e espaçamento de 60s);
  proteção adicional por IP (15/h, espaçamento de 15s).
- A conta só é alterada após consumo atômico do token no banco.
- Incremento de `session_version` revoga cookies anteriores no servidor na
  próxima requisição ONLINE; conteúdos já sincronizados offline dependem da
  reconexão para uma nova verificação de sessão.
- Mensagem idêntica para e-mail existente ou inexistente.
- Sem fallback que exponha token ou link em log, API pública ou URL de query.
- Se o serviço de e-mail não estiver configurado, a API falha explicitamente
  com HTTP 503; nenhuma resposta afirma que o envio aconteceu.

## Critérios de homologação
- Visitar página de recuperação sem autenticação e validar responsividade.
- A API retorna indisponível antes de configurar o remetente.
- Com remetente válido, enviar para conta de teste, abrir link no e-mail recebido.
- Testar token válido, token vencido, token reutilizado, token malformado.
- Testar segundo pedido invalidando o primeiro token entregue.
- Confirmar login com nova senha; login com senha antiga deve falhar.
- Confirmar conta sem perfil `aluno` não recebe redefinição.
- Confirmar progresso e anotações não são alterados.
- Confirmar sessão antiga rejeitada após a redefinição.
- Rodar `npm test` e smoke test em Preview antes de merge.
