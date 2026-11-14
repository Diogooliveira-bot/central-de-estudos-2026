# Base Completa — guia dos e-mails (para o dono)

Atualizado em 14/11/2026. Resume **quem envia, quem recebe, quando dispara e o que diz** cada e-mail do sistema, e como você recebe reclamações, pedidos de reembolso e avisos de venda.

## 1. As duas caixas (o ponto mais importante)

| Endereço | Para que serve | Recebe e-mail? |
| --- | --- | --- |
| `notificacoes@basecompleta.com.br` | **Remetente** de todos os e-mails automáticos (via Resend). | **Não.** O domínio não tem caixa de entrada (não há registro MX). |
| `basecompleta.estudos@gmail.com` | **Sua caixa de atendimento**: dúvidas, reclamações, pedidos de reembolso, avisos de venda e alertas. | **Sim.** É o único endereço divulgado nos Termos, na Privacidade e nos e-mails. |

Como as duas se ligam: todo e-mail automático sai com **Reply-To = `basecompleta.estudos@gmail.com`** (corrigido em 14/11). Se o aluno clicar em "Responder", a mensagem cai no seu Gmail, e não num endereço sem caixa. Antes dessa correção, a resposta ia para `notificacoes@` e se perdia.

## 2. E-mails que o ALUNO recebe (automáticos)

| # | Quando dispara | Assunto | O que diz | Observações |
| --- | --- | --- | --- | --- |
| 1 | Aluno pede cadastro gratuito | "Seu acesso está quase pronto" | Botão para confirmar o e-mail e criar a conta. | Link de uso único, vale 30 min. |
| 2 | Cadastro confirmado | "Sua conta está pronta. Bem-vindo à Base Completa!" | Boas-vindas e como começar. | Só uma vez. |
| 3 | Aluno pede "esqueci a senha" | "Recupere seu acesso" | Botão para criar nova senha. | Uso único, 30 min. |
| 4 | Senha trocada | "Sua senha foi alterada" | Aviso de segurança: sessões antigas foram encerradas; se não foi o aluno, deve pedir nova recuperação e falar com o suporte. | |
| 5 | **Compra aprovada e o e-mail ainda não tem conta** | "Ative seu Premium \| Base Completa" | "Seu pagamento foi aprovado", botão **Ativar meu acesso**, 3 passos, explica que o link vale 7 dias e uma vez. | Se expirar: você reenvia em `/vendas-hotmart.html` → "Reenviar link de ativação". |
| 6 | **Compra aprovada e o aluno já tem conta** (novo) | "Seu Premium está ativo" | Plano (Semestral/Anual), data de início, data de vencimento, número do pedido, link da Central. | Antes o aluno só recebia o e-mail da Hotmart. |
| 7 | Aluno abre chamado pelo botão de suporte da Central (novo) | "Recebemos sua solicitação #PROTOCOLO" | Confirma o recebimento, mostra protocolo e assunto. | Cumpre o que os Termos prometem (confirmação imediata; resposta em até 5 dias). |
| 8 | 7 dias antes do Premium vencer | "Seu Premium vence em 7 dias" | Data de vencimento e como renovar (compra nova; **sem renovação automática**). | Rotina diária (12h UTC). 1 vez por assinatura. |
| 9 | Premium venceu | "Seu plano Premium terminou" | Conta volta ao plano Gratuito; convite a renovar. | Idem. |
| 10 | Segunda-feira, 9h (Fortaleza) | "Seu resumo semanal de estudos" | Questões, tempo de estudo e disciplinas que avançaram na semana. | **Só para quem aceitou receber e-mails de relacionamento** no cadastro. |
| 11 | Aluno clica em "Gerar relatório de estudos" | "Seu relatório de estudos" | Relatório por disciplina/módulo. | Máx. 3 por dia e 1 a cada 5 min. Sai pelo Gmail. |

**O que o sistema NÃO envia ao aluno:** confirmação de reembolso, cancelamento ou estorno. Quem faz isso é a **Hotmart** (e-mail oficial de pagamento, recibo e reembolso). O nosso sistema apenas **retira o Premium** (ver seção 4) e **te avisa**.

## 3. E-mails que VOCÊ recebe (no Gmail de atendimento)

| Origem | Assunto | Quando | O que fazer |
| --- | --- | --- | --- |
| Nosso sistema (novo) | `[Base Completa] Venda aprovada · Semestral` (ou Anual) | Cada compra aprovada. | Só conferir. Mostra transação, comprador mascarado (`m***@gmail.com`) e se o Premium já foi liberado ou se o link de ativação foi enviado. |
| Nosso sistema (novo) | `[Base Completa] Reembolso · Semestral` | Quando a Hotmart avisa que a compra foi reembolsada. | Nada a fazer: o Premium já foi retirado sozinho. |
| Nosso sistema (novo) | `[Base Completa] Chargeback · …` / `Compra cancelada` / `Compra expirada` | Idem, para estorno no cartão, cancelamento ou expiração. | Chargeback: acompanhe a disputa no painel da Hotmart. |
| Nosso sistema | `[Base Completa] Alerta webhook Hotmart: …` | Só quando algo **falha** (ex.: venda de oferta desconhecida, erro ao processar). Máx. 1 a cada 30 min por motivo. | Abra `/vendas-hotmart.html` e use **Reprocessar liberação**. |
| Nosso sistema (novo formato) | `Suporte Base Completa #PROTOCOLO · assunto` | Aluno abriu chamado pela Central. | **Clique em "Responder"**: a resposta vai direto para o e-mail do aluno (o sistema define o Reply-To como o aluno). O chamado também aparece no painel de administrador. |
| Hotmart (próprios dela) | Venda realizada, reembolso solicitado, etc. | Conforme as notificações do seu perfil Hotmart. | Veja a seção 6 (conferir que estão ligadas). |
| Alunos escrevendo direto | (qualquer) | Quem usa o endereço dos Termos. | Responda do próprio Gmail. |

Destino dos avisos 2–5 acima: o e-mail da variável `HOTMART_ALERT_EMAIL`, ou, se não existir, o Gmail de atendimento.

## 4. Como funcionam reclamação e reembolso, passo a passo

**Reclamação / dúvida**
1. O aluno escreve para `basecompleta.estudos@gmail.com` **ou** usa o botão de suporte dentro da Central (recebe um protocolo no mesmo instante e um e-mail de confirmação).
2. Você recebe no Gmail. Responda normalmente: se veio do formulário, o "Responder" já endereça o aluno.
3. Prazo prometido nos Termos: confirmação imediata e resposta em até **5 dias**.

**Reembolso (garantia legal de 7 dias, art. 49 do CDC)**
1. O comprador pede o reembolso pela Hotmart (pelo comprovante/área do comprador) ou por e-mail para você. Se pedir por e-mail, oriente a pedir também pela Hotmart, ou faça o reembolso você mesmo no painel da Hotmart (área de vendas; confirme o caminho exato no seu painel, que a Hotmart muda de vez em quando).
2. A **Hotmart** devolve o dinheiro e manda o e-mail oficial ao comprador.
3. A Hotmart avisa nosso sistema (evento `PURCHASE_REFUNDED`). O sistema **retira o Premium sozinho** e a conta volta ao plano Gratuito (os dados de estudo ficam).
4. Você recebe `[Base Completa] Reembolso · …` confirmando que o acesso foi retirado. Se não chegar em alguns minutos, olhe `/vendas-hotmart.html`.

**Link de ativação que não chegou ou expirou**
1. Comprador avisa por e-mail (o texto do e-mail de compra já orienta isso).
2. Você abre `/vendas-hotmart.html`, acha a venda e clica **Reenviar link de ativação** (ou **Reprocessar liberação**).

## 5. Variáveis de ambiente (Vercel, Production)

| Variável | Função |
| --- | --- |
| `BC_EMAIL_PROVIDER=resend` | E-mails automáticos saem pelo Resend. Voltar para o Gmail: apagar esta variável e reimplantar. |
| `RESEND_API_KEY` | Chave do Resend (não aparece em lugar nenhum do código ou dos logs). |
| `GMAIL_USER` / `GMAIL_APP_PASSWORD` | Ainda usados para o **relatório de estudos** do aluno e como alternativa (fallback). Não remover. |
| `HOTMART_ALERT_EMAIL` | Quem recebe avisos de venda/alertas. Sem ela: Gmail de atendimento. |
| `BC_PREMIUM_EMAIL_AUTOMATION_ENABLED=YES` | Liga os e-mails de 7 dias antes e de vencimento. |
| `BC_WEEKLY_STUDY_EMAIL_ENABLED=YES` + `BC_STUDY_EMAIL_SNAPSHOTS_ENABLED=YES` | Ligam o resumo semanal. |
| `CRON_SECRET` | Protege a rotina diária (12h UTC). |

## 6. Situação técnica verificada em 14/11/2026

- **Resend / DKIM:** registro `resend._domainkey.basecompleta.com.br` publicado ✔.
- **Resend / retorno (SPF + bounces):** `send.basecompleta.com.br` com SPF e MX do Resend ✔.
- **DMARC:** **não existe** (`_dmarc.basecompleta.com.br`). Recomendado criar: TXT `_dmarc` com `v=DMARC1; p=none; rua=mailto:basecompleta.estudos@gmail.com`. Melhora a entrega no Gmail/Outlook e mostra relatórios de abuso. Precisa ser feito no Cloudflare (DNS).
- **MX do domínio principal:** não existe; por isso `notificacoes@` não recebe nada (resolvido com o Reply-To).
- **Gmail de atendimento:** conferir se há resposta automática (texto sugerido: "Recebemos sua mensagem na Base Completa e responderemos em até 5 dias. — Equipe Base Completa").
- **Hotmart:** conferir, nas configurações de notificações do seu perfil de produtor (o caminho varia na Hotmart), que "venda aprovada", "reembolso solicitado" e "chargeback" estão ligadas para o Gmail de atendimento.

## 7. Código (para o desenvolvedor)

- Transporte: `lib/transactional-email.js` → `lib/resend-email.js` (Reply-To fixo) ou Gmail (`lib/password-reset.js`).
- Modelos aprovados: `lib/email-packs/*.js`, catálogo em `lib/approved-email-packs.js`, disparo em `lib/approved-email-dispatcher.js`.
- Compra: `lib/hotmart-webhook.js` (`sendHotmartWelcome`, `sendHotmartSaleNotice`, `sendPremiumActivatedNotice`, `notifyHotmartOutcome`). Os avisos só rodam em Production e **nunca alteram a resposta à Hotmart** (falha de e-mail vai só para o log).
- Suporte: `lib/study-communication.js` (`notifyTicket`).
- Histórico mínimo de entregas (sem conteúdo nem endereço): tabela `central_email_audit`.
- Testes: `tests/email-operacao-unit.mjs`, `npm run test:emails`, `npm run test:hotmart-webhook`.
