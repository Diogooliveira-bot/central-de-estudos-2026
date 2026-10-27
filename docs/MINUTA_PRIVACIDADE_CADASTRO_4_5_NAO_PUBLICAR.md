# Base Completa — MINUTA para revisão: informações do cadastro gratuito (Etapa 4.5)
**NÃO PUBLICAR SEM REVISÃO JURÍDICA E DADOS DO CONTROLADOR.**

## Identificação e contato (preencher pelo proprietário)
- Responsável/controlador: **[IDENTIFICAÇÃO PENDENTE]**
- CPF/CNPJ e informações de identificação comercial, se aplicáveis: **[PENDENTE]**
- Canal de atendimento e solicitações LGPD: **[E-MAIL OU FORMULÁRIO PENDENTE]**
- Versão e data de vigência: **[PENDENTE]**

## O que é coletado e para quê
- Nome e e-mail: criar a conta de aluno, enviar o link de verificação, identificar o titular e permitir recuperação da senha.
- Senha: o sistema guarda apenas resultado de algoritmo de derivação de chave com salt; não guarda a senha original em texto puro.
- Identificadores técnicos protegidos por HMAC: limitar tentativas abusivas de cadastro por e-mail/endereço IP; não são exibidos ao aluno nem usados para marketing.
- Dados posteriores de acesso e estudo: poderão incluir uso dos recursos da plataforma e progresso acadêmico, conforme funcionalidades ativas e transparência ao titular.
- **Base legal:** deve ser avaliada pelo responsável jurídico para cada finalidade, como procedimentos preliminares/execução contratual e segurança. Não afirmar que o aceite genérico substitui todos os fundamentos legais.

## Antes de o aluno confirmar o e-mail
- Solicitação de cadastro guarda nome, e-mail, hash da senha, hash irreversível do token, horário de solicitação e validade.
- Link de confirmação válido por 30 minutos, de uso único.
- Solicitações vencidas precisam ser eliminadas; script de manutenção preparado em scripts/free-signup-prune-expired-4-5.sql. **Agendamento periódico ainda não configurado.**
- Limites antiabuso preservam identificadores HMAC por janela operacional; rascunho recomenda limpeza após 7 dias, pendente de aprovação da política final.
- Se o aluno não confirmar, não deve existir conta efetiva criada por este fluxo.

## Fornecedores, segurança e compartilhamento
- Hospedagem Vercel e banco Neon, além do provedor de e-mail aprovado para confirmação/recuperação; identificar corretamente bases operacionais e eventuais transferências internacionais antes da publicação.
- O bot-check previsto pode usar Cloudflare Turnstile com validação no servidor; incluir o fornecedor e informações de tratamento na política final caso seja ativado.
- Senhas, tokens e credenciais não devem ser expostos em URLs de monitoramento, logs públicos ou relatórios.
- Acesso Premium depende de compra confirmada; cadastro Gratuito não concede Premium.

## Direitos do titular e contato
O aluno deve receber informações claras sobre as finalidades, duração, agentes, segurança e eventuais transferências de dados, e ter um canal para exercer direitos de acesso, correção, exclusão e outros previstos na LGPD. Informar procedimentos e prazos realmente praticados. Não inventar prazos, endereço, CNPJ ou canal de atendimento.

## Itens obrigatórios antes de publicar
- [ ] Identificação do responsável e canal de privacidade/atendimento confirmados.
- [ ] Finalidades, base legal, prazo de conservação e fornecedores revisados.
- [ ] Fluxo de menores de idade avaliado juridicamente (inclusive art. 14 da LGPD).
- [ ] Termos de uso e informações de assinatura gratuitos/Premium coerentes com a Hotmart.
- [ ] Retenção e exclusão de pedidos vencidos automatizadas e testadas em Preview isolada.
- [ ] Proteção contra robôs ativa e validada em ambiente real; não basta colocar o widget na tela.
- [ ] Link para política revisada inserido no formulário antes da liberação.
- [ ] Aprovação específica `BC_SIGNUP_PRIVACY_APPROVED=YES` somente após concluir revisão, separada da publicação Premium.

**FONTES PARA REVISÃO:** Lei nº 13.709/2018 (LGPD) e materiais da Autoridade Nacional de Proteção de Dados (ANPD).
