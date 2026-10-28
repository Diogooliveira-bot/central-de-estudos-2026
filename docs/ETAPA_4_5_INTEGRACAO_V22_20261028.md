# Base Completa — Integração V22 × Cadastro Gratuito 4.5
**Data:** 28/10/2026

## Estado confirmado
- Site comercial V22 publicado separadamente em Vercel: `base-completa-vitrine-estatica-2026.vercel.app`, usando V21 como base visual.
- V22 encaminha **Entrar** ao login da Central existente `central-de-estudos-ecru.vercel.app/login.html` enquanto não há domínio próprio.
- Botões **Criar conta gratuita** da V22 permanecem deliberadamente bloqueados com explicação. **Não** liberam cadastro nem coletam dados.
- Esta branch `commercial/etapa-4-5-20261027` contém a lógica de signup e alterações de interface; `main` e Neon Production permanecem sem alterações decorrentes desta etapa.
- Projetos de domínio definitivos planejados: `basecompleta.com.br` (site) e `app.basecompleta.com.br` (app). **Domínio ainda não registrado pelo proprietário**; a associação na Vercel não substitui o registro nem o DNS.

## Melhorias implementadas nesta continuação
1. `lib/free-signup-handler.js`: `publicFreeSignupReady` exige liberação explícita **e** configuração de SMTP Gmail, AUTH_SECRET e DATABASE_URL antes que a API anuncie cadastro habilitado. Não tenta conectar ao banco nem expõe segredos.
2. `api/auth.js`: status público usa o novo gate, evitando mostrar inscrição quando falta dependência básica.
3. `login.html`: adiciona retorno à vitrine comercial; após habilitação efetiva, mostra cadastro e esconde instrução de primeiro acesso por convite. Usa URL Vercel provisória antes da aquisição do domínio.
4. `cadastro-gratuito.html`: formulário começa oculto e só é exibido após a API confirmar `enabled:true`; indisponibilidade exibe aviso sem coletar dados. Link de volta à vitrine.
5. Testes unitários cobrem dependências do gate e contratos de navegação. Playwright verifica fluxo com API habilitada e desabilitada nos navegadores desktop/celular.

## Evidência
- GitHub Actions: `https://github.com/Diogooliveira-bot/central-de-estudos-2026/actions/runs/40684333095`
- Commit validado: `e50edcba61728878683909f202aeef2c5f773c3c`.
- Job `comercial` concluído com **success**: testes unitários, e-mail via SMTP local Mailpit e Chromium de desktop/celular **com API simulada**.
- Neon TEST `shiny-hall-19564809` na branch `br-late-band-b7lzjsyi`: tabelas de usuários, assinaturas e cadastro encontradas em leitura real, sem alterar dados.
- **Não foi executado** cadastro externo integrado com API real, Neon real e e-mail externo no mesmo fluxo.

## Pendências que impedem cadastro aberto ao público
- Homologação Preview ponta a ponta usando **um remetente SMTP de testes autorizado**, separado da produção, e uma caixa externa controlada; não colocar senhas no chat.
- Configurar Turnstile real, anti-bot e validação com hostname da Preview/produção.
- Definir responsável/controlador, contato LGPD, finalidades, retenção e revisar/publicar política de privacidade e termos; incluir link verdadeiro no formulário.
- Programar e validar limpeza dos pedidos e limites expirados.
- Confirmar backup realmente restaurável, migração 004, testes de permissões FREE (quota 20/dia; TEC/QC bloqueados) e integração Premium/Hotmart.
- Registro/DNS/TLS do domínio somente após sua aquisição.
- **Não habilitar flags Production, não aplicar migração 004 em Production e não ativar cadastro comercial antes das condições acima.**

## Isolamento
Não realizadas alterações de `main`, Production Vercel do app, Production Neon, contas de alunos, Hotmart nem chaves existentes. Alterações estão em branch comercial e Previews automáticas.
