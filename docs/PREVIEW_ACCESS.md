# Prévia sem login — Base Completa

## Padrão de acesso a TODAS as próximas prévias

A Central mantém autenticação real em **produção**. Apenas as implantações da
**Vercel Preview** podem ser abertas sem e-mail/senha por meio de um **link privado
de demonstração**. O link converte uma chave em cookie seguro no navegador, remove
a chave da barra de endereço e abre a Central com o usuário fictício
`base-completa-preview-guest`. A validade do cookie é de 7 dias em **cada
hostname de prévia**.

Para criar uma nova prévia, siga estes passos:

1. Crie uma branch a partir de `main` (ou de uma branch que já inclua esta
   configuração), implemente as alterações e aguarde o deploy Vercel `READY`.
2. Consulte na Vercel a variável de projeto `BC_PREVIEW_GUEST_TOKEN`
   (ambiente **Preview**, tipo encrypted), **somente quando necessário para montar
   o link privado**. Nunca coloque esse valor em Git, PR, arquivos de testes,
   comentários, logs ou mensagens em texto puro.
3. Entregue ao usuário um link no formato
   `https://<deployment-da-preview>.vercel.app/central-v119.html?bc_preview=<token>`.
   No primeiro acesso, o link converte o token em cookie e leva à Central sem
   tela de login. Novas prévias com host diferente precisam do link especial
   uma vez; continuar no mesmo host não exige nova autenticação por 7 dias.
4. Identifique o endereço como **prévia somente para testes**, não produção;
   mantenha a aprovação explícita para publicar alterações de conteúdo e layout.

### Como obter o token quando outra conversa do ChatGPT assumir o trabalho

Use o conector Vercel autorizado para o projeto
`prj_oXErTD4bsnVtGFZCwIn73dThf8Qx`:
`filter_project_envs({idOrName: <project>, decrypt: "true"})`.
Procure exclusivamente a variável `BC_PREVIEW_GUEST_TOKEN` com target
`preview`. Não repita o valor em relatórios; use-o somente no link de
acesso entregue ao proprietário. Se a variável estiver indisponível,
**não invente um token**: comunique que a integração de acesso de testes
precisa ser restabelecida.

### Limites de segurança e revisão

- `VERCEL_ENV === 'preview'` **e** chave entre 40 e 2.048 caracteres são verificações
  obrigatórias nos arquivos `middleware.js` e `api/auth.js`. A produção não
  libera o modo visitante mesmo que alguém acrescente `bc_preview` à URL.
- O visitante **não recebe conta no banco**, perfil de administrador,
  permissões de publicação ou sessão real.
- No modo visitante, **todas as APIs são bloqueadas**, exceto
  `GET /api/auth?action=me`, que retorna identidade fictícia. Portanto,
  recursos que dependem de gravação ou consulta no servidor devem ser
  testados separadamente com autenticação apropriada e banco de homologação.
- O progresso e as anotações da demonstração ficam somente no navegador de
  teste; não validam sincronização de dados entre dispositivos.
- As variáveis `DATABASE_URL` e `AUTH_SECRET` existentes podem também estar
  configuradas para Preview. Não presuma isolamento de banco: o bloqueio de
  APIs para visitantes é essencial para evitar acesso a dados de produção.
- Não coloque a chave no código-fonte ou parâmetros de deploy públicos.
  Trate o link completo como credencial e compartilhe apenas com o dono.
- Para revogar o acesso, **troque ou exclua** a variável
  `BC_PREVIEW_GUEST_TOKEN` no ambiente Preview e efetue um novo deploy.
  URLs antigas/deploys antigos só deixam de funcionar quando deixam de
  servir a chave anterior; não basta mudar a variável nos novos builds.
  Para revogação imediata de todos os links já gerados, desative/remova
  os deployments anteriores ou revogue seu acesso via configurações
  da Vercel.

### Testes de regressão obrigatórios

1. Deploy Preview com link válido: abre a Central; `/api/auth?action=me`
   retorna `authenticated:true, previewGuest:true`.
2. Deploy Preview sem link/cookie: mantém o login normal.
3. Token incorreto: retorna HTTP 403.
4. Visitante: `/api/*` diferente de `GET /api/auth?action=me`
   retorna HTTP 403 e nenhuma operação no banco é realizada.
5. Visitante: `/usuarios.html` e `/update-central.html` indisponíveis.
6. Produção: o link `?bc_preview=` **não funciona**; login obrigatório.
7. Nenhum valor da variável secreta pode estar nos commits.
