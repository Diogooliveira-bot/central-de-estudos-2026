# Base Completa — e-mails transacionais (Etapa 1)

**Escopo:** substituir modelos simples por HTML responsivo aprovado em 30/10/2026, preservar autenticação existente e acrescentar eventos de boas-vindas/segurança.

## Integrações realizadas na branch

| Evento | Origem | Ação |
| --- | --- | --- |
| Pedido de cadastro | `lib/free-signup-handler.js` / `request` | Mensagem HTML de confirmação com token individual de 30 minutos |
| Conta gratuita criada | `lib/free-signup-handler.js` / `confirm` | Boas-vindas via tarefa não bloqueante após a transação atômica de criação |
| Pedido de recuperação | `lib/password-reset.js` / `request` | E-mail de recuperação com o mesmo token de uso único e validade de 30 minutos |
| Senha efetivamente alterada | `lib/password-reset.js` / `confirm` | Notificação de segurança via tarefa não bloqueante, sem expor senha nem token |

O conteúdo visual de cadastro e boas-vindas reaproveita os modelos aprovados (layout em tabelas, azul-marinho, cartões, logomarca/mascote). As imagens estão no endereço estável do site comercial, com `alt` e texto que funciona mesmo se imagens forem bloqueadas. A recuperação/alteração de senha segue o mesmo sistema visual.

## Invariantes de segurança

- Não alterar esquema Neon, assinatura, sessão, prazo de token, captcha, senhas, painel ou permissões.
- A confirmação é enviada para o e-mail inserido **após** validação e limites de taxa. A confirmação de conta e a troca de senha continuam transacionais/atômicas.
- Boas-vindas é mensagem de serviço e é agendada **somente** após a criação real do aluno com plano `free`. Usa `waitUntil` da Vercel; falhas de SMTP não revogam a conta.
- Aviso de senha alterada é enviado **somente** após a mudança persistida, não inclui token nem senha; a sessão anterior permanece invalidada.
- Nenhum e-mail promocional novo, WhatsApp, rotina de cobrança, Hotmart ou CRON ativado.
- Não registrar tokens, corpo do e-mail, endereço do aluno ou segredos em logs.

## Homologação obrigatória antes de produção

1. `npm ci` e `npm run test:emails`; rodar a suíte geral e CI no commit final.
2. Verificar que a Preview da branch usa **Neon TEST isolado**, ou testar apenas a renderização sem efetuar cadastro.
3. Validar com conta fictícia: solicitação de cadastro, e-mail recebido, link válido em 30 minutos/uso único, resposta no navegador, atribuição Free, envio de boas-vindas; repetir link não deve emitir segundo e-mail.
4. Verificar recuperação e alteração de senha por conta fictícia; validar a notificação e bloqueio das sessões antigas.
5. Conferir Gmail/Outlook/celular, inclusive imagens desativadas; testar `mailto` e URLs estáveis. Confirmar dados de fornecedor e conteúdo legal aprovados.
6. Acompanhamento de logs sem informações pessoais; testar erro SMTP sem perda de acesso e erros sem duplicação.
7. **Apenas após aprovação:** integrar a branch à release produtiva e acompanhar deployment/rollback. Confirmar que os e-mails estão sendo entregues antes de avisar os alunos.

**Limitação desta etapa:** o envio pós-ativação é best-effort por `waitUntil`, sem fila persistente de reenvio. A implementação de outbox, observabilidade, agendamentos, Premium e relacionamento (Pacotes 2 e 3) será tratada separadamente; não confundir modelos prontos com automação publicada.

## URLs

- Site comercial: https://base-completa-vitrine-estatica-2026.vercel.app/
- Central estável: https://central-de-estudos-ecru.vercel.app/
- Repositório: https://github.com/Diogooliveira-bot/central-de-estudos-2026
