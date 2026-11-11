# Padrão obrigatório — prévias da Base Completa sem login

**Decisão do proprietário (10/11/2026):** todas as futuras prévias destinadas à avaliação visual ou pedagógica devem abrir sem que ele precise informar e-mail, senha ou acessar uma conta real. Esta regra aplica-se às disciplinas, módulos, editor e outras prévias da Central. A produção mantém sua autenticação normal.

## Comportamento exigido

- Entregar ao proprietário um **link direto de visitante**, pronto para abrir a prévia real. Não repassar apenas a URL padrão do deployment se ela redirecionar para `login.html`.
- Utilizar o modo `bc_preview` já implementado em `middleware.js`, `api/auth.js` e `lib/private-content-handler.js`. Ele é **somente leitura**, não cria conta, não consulta dados pessoais e bloqueia APIs de aluno/administrador e escritas.
- Criar `BC_PREVIEW_GUEST_TOKEN` aleatório, com pelo menos 40 caracteres, **criptografado e restrito ao ambiente Preview e à ramificação específica** na Vercel. Nunca configurar esse token em Production; nunca gravar token em Git, scripts públicos, exemplos ou documentos.
- Construir a URL `https://<deployment>/central-v119.html?bc_preview=<token>` — e anexar o parâmetro de compartilhamento da Vercel (`_vercel_share`) quando o deployment usar Vercel Authentication. A abertura deve trocar o token por cookie HttpOnly/Secure/SameSite e limpar a query no redirecionamento. A URL de compartilhamento é temporária; renovar quando necessário.
- Confirmar no deployment final que: (1) sem login abre a Central; (2) `/api/auth?action=me` retorna identidade sintética `previewGuest`; (3) o leitor realmente exibe os módulos; (4) `/api/sync`, operações administrativas, outras APIs pessoais e qualquer mutação continuam bloqueadas; (5) produção exige autenticação.
- Se um deployment não permitir teste de visitante, **não declarar que a prévia está acessível**; corrigir a configuração ou comunicar a limitação.
- Nunca remover a autenticação do site oficial, não usar uma conta admin real como atalho e não copiar dados de alunos para a prévia.

## Registro da prévia ADM M01–M20

- Repositório: `Diogooliveira-bot/central-de-estudos-2026`.
- Ramificação: `adm-revisao-didatica-m01-m10-20261109` (contém integração das revisões M01–M20).
- Variável Preview configurada exclusivamente para essa ramificação: `BC_PREVIEW_GUEST_TOKEN`.
- A URL com token e compartilhamento não é persistida aqui por ser credencial transitória.

## Testes de regressão existentes

- `tests/preview-guest-middleware-unit.mjs`
- `tests/preview-guest-private-content-unit.mjs`
- `tests/preview-guest-access-unit.mjs` se disponível.

**Checklist para qualquer próxima prévia:** gerar segredo por ramificação → configurar somente Preview → implantar ramificação → gerar link `bc_preview` (e Vercel Share, se necessário) → verificar acesso sem login e bloqueio de dados → entregar link.
