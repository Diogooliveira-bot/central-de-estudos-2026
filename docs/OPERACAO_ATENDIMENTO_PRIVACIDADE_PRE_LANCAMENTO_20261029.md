# Base Completa — operação de atendimento, cancelamento e proteção de dados

**Data:** 29/10/2026. **Estado:** procedimento preparado para homologação; **NÃO** certificação jurídica, implementação da caixa de entrada ou abertura de vendas. **Ambiente:** PR #187; não alterar `main`, Neon Production ou checkout.

## 1. Canal central, governança e limites

- **Canal oficial de atendimento:** `basecompleta.estudos@gmail.com`. Único endereço público para dúvidas pré-compra, suporte, cancelamentos, reembolsos e privacidade. O endereço consta das três páginas legais e há link de contato na vitrine interna. **Atualização de 30/10/2026:** o proprietário confirmou o recebimento de mensagem externa e o acompanhamento diário da caixa oficial. Isso **não** comprova a confirmação imediata de recebimento das demandas no mesmo canal, ainda pendente de procedimento testado. A resposta automática do Gmail permanece adiada por decisão do proprietário; não apresentá-la como implementada.
- Escopo de atendimento: dúvida antes da compra; acesso/conta; erro de cobrança; arrependimento; reembolso; suspensão/cancelamento; acesso após pagamento; privacidade e exclusão de dados; denúncia de segurança.
- Cada demanda precisa ter identificador interno único, data/hora de entrada, categoria, estado, responsável, confirmação de recebimento, próxima providência, manifestação e data de resolução. Guardar somente dados mínimos; **nunca registrar senha, token, cartão completo, CPF ou endereço pessoal em GitHub, tickets públicos ou planilhas compartilhadas**.
- A manifestação sobre pedidos do consumidor será encaminhada em **até cinco dias**, nos termos do art. 4º, parágrafo único, do Decreto 7.962/2013. Para controle interno, fixar prazo conservador de **até cinco dias corridos** e antecipar casos urgentes. **Confirmar imediatamente o recebimento no mesmo canal**, conforme art. 4º, VI, e art. 5º, §4º. Validar tecnicamente a automação/operacionalização antes do GO.
- Um retorno automático de recebimento **não** é uma solução substantiva. Deve existir triagem monitorada; nenhum pedido pode se perder em spam ou fila. Analisar se Gmail suportará o volume comercial ou se será necessário serviço de atendimento formal.
- O suporte deve permitir contato antes e depois da compra e ser acessível sem login, especialmente para recuperação de senha.

## 2. Fluxo operacional por solicitação

| Entrada | Ação imediata | Tratamento | Critério de conclusão |
|---|---|---|---|
| Cadastro ou login | Acusar recebimento e orientar uso do fluxo seguro | Verificar status sem solicitar senha/token | Acesso restabelecido ou impedimento documentado |
| Compra aprovada sem Premium | Registrar pedido e transação mínima, nunca dados de cartão | Conciliar evento com Hotmart e ambiente correto, sem duplicar crédito | Plano correto por 6/12 meses, comprovado e comunicado |
| Arrependimento até sete dias, quando aplicável | Confirmar recebimento imediatamente e preservar data do pedido | Encaminhar providência ao intermediador, acompanhar estorno sem impedir canal direto | Estorno/restituição com confirmação; revogação somente do benefício correspondente |
| Cancelamento/suspensão | Confirmar imediatamente e identificar tipo de cancelamento | Diferenciar término natural de acesso, reembolso, correção de cobrança, fraude e exclusão de conta | Decisão e efeito explicados ao aluno sem suprimir direitos |
| Reembolso/chargeback | Confirmar quando o consumidor demandar | Conciliar transação idempotente e status financeiro; não tratar mera solicitação como estorno concluído | Registro do resultado e acesso Premium reconciliado |
| Direitos LGPD e exclusão | Acusar recebimento, verificar identidade de modo proporcional | Classificar direito, base de retenção e sistemas afetados; não pedir segredo de acesso | Resposta adequada e evidência mínima, sem divulgar dados de terceiros |
| Incidente de segurança | Isolar canal e adotar tratamento urgente | Encaminhar para diagnóstico, contenção, avaliação de risco e comunicações legais quando cabíveis | Registro de providências e fechamento responsável |

## 3. Regras de reembolso e conta

1. **Arrependimento legal:** quando aplicável à compra à distância, observar art. 49 do CDC — prazo de **sete dias** a partir da assinatura/recebimento nos termos legais. Não impor justificativa ou somente um canal como condição para exercer esse direito. Preservar comprovante da data em que o pedido chegou.
2. **Hotmart permanece pendente**, por decisão do proprietário, até retomar o Work. A documentação comercial não substitui verificação real de checkout, credenciais, pagamento, estorno, prazos ou notificações.
3. **Compra única não é assinatura recorrente**: R$ 97 para 6 meses e R$ 179 para 12 meses; possibilidade de parcelamento com taxas explicitadas antes do pagamento. Não renovar automaticamente.
4. **Fim da vigência** sem reembolso: retirar apenas os recursos Premium e manter o plano Gratuito e o progresso permitido pela política.
5. **Reembolso/chargeback confirmado**: garantir que somente a compra correspondente seja revertida; conflitos entre renovações e estornos deverão ser conciliados e testados no Neon TEST antes do GO.
6. **Exclusão de conta não se confunde com cancelamento da compra**: separar pedidos de eliminação de dados, devolução de valores e suspensão técnica; reter dados apenas quando houver fundamento legal.

## 4. Direitos do titular (LGPD)

- Solicitações por `basecompleta.estudos@gmail.com`; confirmar recebimento e fazer verificação de identidade proporcional ao risco. Não exigir documento completo por padrão; nunca solicitar senha ou código de autenticação.
- Tratamento de confirmação de existência e acesso: seguir art. 19 da LGPD, com declaração simplificada imediata quando cabível ou declaração completa em até **15 dias**, consideradas as exceções legais.
- Para correção, exclusão, revogação de consentimento, oposição e demais direitos, usar prazos legais/regulatórios pertinentes; **não inventar prazo universal de 15 dias para todos os pedidos**.
- Registrar data, categoria e decisão, sem copiar dados sensíveis para tickets públicos. Impedir que exclusão inviabilize prova fiscal/contratual legitimamente necessária.
- Marketing por WhatsApp fica **desativado**; e-mail promocional e comunicação comercial por WhatsApp exigem consentimentos opt-in próprios e revogáveis, separados do aceite contratual.

## 5. Inventário mínimo e retenção — pendências de validação

| Categoria | Finalidade | Sistemas previstos | Retenção/eliminação |
|---|---|---|---|
| Nome, e-mail, login e senha protegida | Contrato, identificação e segurança | Neon/Vercel | Durante necessidade da conta; após término conforme bases legais específicas (**prazo numérico a definir**) |
| Token de confirmação de cadastro | Confirmação da identidade | Neon + mensagem Gmail | Token com validade técnica **30 minutos**, uso único; prazo da linha de auditoria/expurgo pendente |
| Token de recuperação | Recuperar acesso com segurança | Neon + Gmail | Token com validade técnica **30 minutos**, uso único; expurgo de logs/linhas pendente |
| WhatsApp opcional e consentimentos | Contato opcional e rastreabilidade do consentimento | Neon | Até revogação/necessidade legítima; exceções de prova e conservação a definir |
| Progresso e anotações | Continuidade do estudo entre planos | Neon/armazenamento do app | Preservar na mudança Premium→Gratuito, critérios de exclusão a definir |
| IP, sessões e logs técnicos | Segurança e antifraude | Vercel/Neon/Turnstile | Seguir necessidade de segurança; período específico a auditar |
| Dados de pagamentos e eventos | Plano Premium e obrigações | Hotmart/Neon | Observar regras legais, contratuais e fiscais; prazo numérico a validar |
| Solicitações de suporte | Resolução e exercício de direitos | Gmail/registro de atendimento | Critérios de minimização, necessidade, prazo e segurança a definir |

**Importante:** o TTL técnico de 30 minutos não prova exclusão da linha de banco, de e-mail ou de backup. Cada regra de descarte e prazo legal deve ser validada sem apagar evidência exigida por lei.

## 6. Mensagens padrão para o atendimento (somente roteiros, não enviadas)

**Recebimento:** “Recebemos sua solicitação à Base Completa e a registramos para atendimento. Não envie senhas nem códigos de confirmação por e-mail. Caso seu pedido seja sobre arrependimento ou reembolso, consideraremos a data de recebimento desta mensagem. Você terá uma manifestação de atendimento dentro do prazo legal.”

**Pedido de arrependimento:** “Recebemos seu pedido de arrependimento em [data]. Vamos analisar a contratação à luz dos direitos previstos no CDC e informar as providências de restituição pelo meio de pagamento utilizado. Você não precisa informar senha ou dados completos do cartão.”

**Privacidade:** “Recebemos seu pedido relativo aos seus dados pessoais. Para proteger sua conta, poderemos solicitar uma confirmação proporcional de identidade por canal seguro. Informaremos o andamento conforme os prazos aplicáveis.”

**Acesso Premium:** “Registramos sua solicitação de acesso após compra. Vamos conferir a confirmação do pagamento e a vigência da oferta sem solicitar número completo de cartão, senha ou código de autenticação.”

## 7. Critérios para considerar esta operação ativa

- [x] Proprietário confirmou recebimento de e-mail externo no Gmail oficial e acompanhamento diário. A triagem de spam/filtros e a operação com pedidos reais continuam pendentes de teste.
- [ ] Implementar e testar **confirmação imediata no mesmo canal** e registro do pedido; não presumir que apenas possuir Gmail cumpra a obrigação.
- [ ] Confirmar responsável e rotina de monitoramento da caixa, procedimentos de contingência e **resposta em até cinco dias**.
- [ ] Ensaiar pedidos simulados de arrependimento, reembolso, privacidade e acesso sem pagar/transacionar dinheiro de verdade.
- [ ] Completar identificação do fornecedor PF e endereço conforme norma, em canal de publicação seguro **fora do repositório**; revisar com orientação jurídica/contábil. Não inserir CPF ou endereço residencial aqui.
- [ ] Auditar cookies/requests em V25, cadastro, login, Central e checkout, inclusive terceiros; decidir necessidade de consentimento de tecnologias não essenciais.
- [ ] Conferir efetivos prestadores, transferência internacional, base legal, limites de retenção e rotina de expurgo antes de substituir o rótulo *pré-lançamento*.
- [ ] Revisar versões e aceites de Termos/Políticas, inclusive histórico de consentimentos, antes de ativar cadastro público.

## Referências normativas

- Decreto 7.962/2013, arts. 2º, 4º e 5º: https://www.planalto.gov.br/ccivil_03/_ato2011-2014/2013/decreto/d7962.htm
- CDC, art. 49: https://www.planalto.gov.br/ccivil_03/leis/l8078compilado.htm
- LGPD, arts. 18 e 19: https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/l13709.htm
- ANPD, FAQ sobre direitos e prazos: https://www.gov.br/anpd/pt-br/acesso-a-informacao/perguntas-frequentes
- ANPD, Guia de cookies: https://www.gov.br/anpd/pt-br/centrais-de-conteudo/materiais-educativos-e-publicacoes/guia-orientativo-cookies-e-protecao-de-dados-pessoais.pdf

**Este documento fecha o preparo de processo e deixa itens operacionais explicitamente abertos. Não é aprovação jurídica final nem autorização para abrir vendas.**
