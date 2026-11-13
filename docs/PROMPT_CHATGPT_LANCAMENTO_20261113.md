# Comando para o ChatGPT (modo agente/navegador) — pendências externas do lançamento

Cole o texto abaixo no ChatGPT com o navegador/agente ligado e **com você logado** na Hotmart, Vercel e Cloudflare. Ele só faz levantamento (leitura) e as poucas alterações marcadas como "PODE ALTERAR". Devolva o relatório final ao Claude Code.

---

Você é meu assistente de lançamento da **Base Completa** (plataforma de estudos para concursos, app em https://app.basecompleta.com.br, vitrine em https://basecompleta.com.br, suporte basecompleta.estudos@gmail.com). Vou deixar você usar meu navegador já logado. Execute a lista abaixo e **entregue um relatório** no formato da seção "ENTREGA".

## REGRAS (obrigatórias)
1. **Nunca escreva no relatório, no chat ou em capturas** senhas, tokens, HOTTOK, chaves de API, segredos do Turnstile, `DATABASE_URL`, cookies ou valores de variáveis de ambiente. Para variáveis, informe **apenas o nome e se existe** (sim/não). Exceção: `BC_EMAIL_PROVIDER` (pode informar o valor).
2. **Não faça compras**, não peça reembolso, não crie cadastros de alunos, não envie e-mails a terceiros.
3. **Não altere preços, ofertas, nomes de oferta, status do produto, DNS, planos nem variáveis de ambiente.** Só altere o que estiver marcado **PODE ALTERAR**.
4. Se pedir login, 2FA ou captcha que você não consiga resolver, **pare nesse item**, marque BLOQUEADO e siga para o próximo.
5. Se algo estiver diferente do esperado, **não corrija por conta própria**: descreva o que viu e o que recomenda.
6. Tire capturas de tela como evidência (sem dados sensíveis) e cite onde está cada uma.

## A. HOTMART (produto 8805543)
A1. Confirme: "Vendas ativas" ligado? Quais ofertas existem e seus códigos/nome/preço/parcelamento? Esperado: **Semestral `o4y1mlg9` R$ 97,00** (6 meses) e **Anual `gh4ajvj1` R$ 179,00** (12 meses), pagamento único (sem assinatura recorrente), reembolso/garantia de **7 dias**. Aponte qualquer diferença (principalmente nome da oferta anual e descrições vazias).
A2. **Copie o link público de pagamento (checkout) de cada oferta** e coloque no relatório (links de checkout não são segredo).
A3. Abra cada checkout como visitante (sem comprar) e verifique: preço, "pagamento único", parcelamento/juros exibidos, e-mail de suporte, links/aceite de Termos e Privacidade, texto de reembolso de 7 dias, ausência de promessas incorretas. **PODE ALTERAR** apenas: descrição da página de pagamento e e-mail de suporte exibido, usando este texto, e liste exatamente o que mudou:
   - Descrição Semestral: "Acesso Premium à Base Completa por 6 meses. Pagamento único, sem renovação automática. Garantia legal de 7 dias."
   - Descrição Anual: "Acesso Premium à Base Completa por 12 meses. Pagamento único, sem renovação automática. Garantia legal de 7 dias."
   - Suporte: basecompleta.estudos@gmail.com
A4. Webhook ("Base Completa — Teste de pagamentos"): confirme URL (esperada `https://central-de-estudos-ecru.vercel.app/api/hotmart-webhook` ou `https://app.basecompleta.com.br/api/hotmart-webhook`), versão 2.0.0 e eventos ativos (compra aprovada, completa, cancelada, reembolsada, expirada, chargeback, cancelamento de assinatura). **PODE** acionar o **envio de teste oficial** da Hotmart e informar o resultado (esperado: 7 eventos "200 - Processado"). Não revele o HOTTOK.

## B. VERCEL (projeto central-de-estudos, time estudotd)
B1. Situação do último deploy de Production (deve ser o merge mais recente da `main`; estado READY) e do domínio `app.basecompleta.com.br`.
B2. **PODE ALTERAR**: configurar notificações/alertas por e-mail para o dono em: deploy com falha e erros de função/execução (o que o plano Hobby permitir). Diga o que foi ativado e o que o plano não oferece.
B3. Variáveis de ambiente de **Production**: informe só presença (sim/não) de: `DATABASE_URL`, `AUTH_SECRET`, `BC_PUBLIC_FREE_SIGNUP_ENABLED`, `BC_PUBLIC_FREE_SIGNUP_PRODUCTION_APPROVED`, `BC_SIGNUP_PRIVACY_APPROVED`, `BC_SIGNUP_TERMS_FINAL_APPROVED`, chaves do Turnstile (site e secreta), `BC_EMAIL_PROVIDER` (informe o valor), credenciais de e-mail do provedor atual, `HOTMART_LIVE_ENABLED`, `HOTMART_HOTTOK`, `HOTMART_PRODUCT_ID`, `HOTMART_OFFER_6M_CODE`, `HOTMART_OFFER_12M_CODE`, `HOTMART_ALERT_EMAIL`, `CRON_SECRET`.
B4. Cota de deploys do plano (Hobby) e uso recente; avise se houver risco de bloqueio em dia de lançamento.
B5. Os domínios `basecompleta.com.br` e `app.basecompleta.com.br`: DNS "Valid Configuration" e certificado ativo?

## C. CLOUDFLARE TURNSTILE
C1. O widget usado no cadastro autoriza os hostnames `app.basecompleta.com.br` (e `basecompleta.com.br`)? Modo (gerenciado/invisível)? Há erros recentes (ex.: 110200) no painel?

## D. E-MAIL
D1. Provedor atual de Production (Gmail ou Resend). Se Resend estiver configurado: domínio remetente verificado (SPF/DKIM/DMARC)? **Não ative o Resend.**
D2. Verifique a caixa basecompleta.estudos@gmail.com: há mensagens não respondidas de alunos? Resposta automática de recebimento está configurada? (Os Termos prometem confirmação imediata de recebimento e resposta em até 5 dias.) **PODE ALTERAR**: criar resposta automática com o texto "Recebemos sua mensagem na Base Completa e responderemos em até 5 dias. — Equipe Base Completa".

## E. CHECKLISTS PARA EU EXECUTAR (apenas prepare, não execute)
E1. Roteiro passo a passo para **eu** fazer uma compra real do Semestral com meu e-mail e conferir: e-mail de convite/ativação, liberação do Premium, `/vendas-hotmart.html` sem falhas abertas, e depois o reembolso dentro de 7 dias e a revogação do Premium.
E2. Roteiro para **eu** criar uma conta gratuita de teste em https://app.basecompleta.com.br/cadastro-gratuito.html com e-mail meu: confirmação por e-mail, login, recuperação de senha.

## ENTREGA (relatório em Markdown, em português)
1. **Resumo em 5 linhas** e um semáforo geral (VERDE = pode abrir vendas; AMARELO = pequenos ajustes; VERMELHO = bloqueio).
2. **Tabela** com colunas: Item (A1…E2) | Status (OK / DIFERENTE / BLOQUEADO / ALTERADO) | O que vi (sem segredos) | Evidência (captura) | Quem age (Você / Dono / Claude Code).
3. **Dados para o Claude Code ligar na vitrine:** link de checkout Semestral, link de checkout Anual, nomes finais das ofertas, preços e texto de parcelamento exibidos.
4. **Alterações feitas por você** (lista exata, com antes/depois).
5. **Bloqueios e riscos** em ordem de gravidade e o que recomenda fazer antes de abrir as vendas.
6. **O que eu preciso fazer pessoalmente** (curta lista numerada).
