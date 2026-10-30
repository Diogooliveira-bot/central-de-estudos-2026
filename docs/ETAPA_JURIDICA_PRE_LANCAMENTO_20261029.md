# Base Completa — Etapa jurídica/comercial pré-lançamento

**Data:** 29/10/2026 · **Ambiente:** branch `integration/lancamento-base-completa-20261028`, PR #187 (draft). **Não é aprovação jurídica final nem autorização de publicação.**

## 1. Evidências revalidadas

- Site público de apresentação V25 em projeto Vercel separado: https://base-completa-vitrine-estatica-2026.vercel.app/ .
- Termos de Uso, Política de Privacidade e Política de Cookies respondem HTTP 200 no site V25. Permanecem marcados como **pré-lançamento** e têm `noindex`; NÃO substituir por textos supostamente aprovados.
- Os Termos informam plano Gratuito com limite de até 20 questões/dia no Lei em Dia e exclusividade de TEC/QConcursos no Premium; ofertam, ainda sujeito a checkout verificado, **R$ 97/6 meses** e **R$ 179/12 meses** (alteração de preço anual informada pelo proprietário em 29/10/2026; revalidar visualmente a Hotmart), pagamento único e renovação manual. Direito de arrependimento e reembolso são descritos, mas checkout Hotmart real está pendente.
- A homepage V25 renderizada pela Vercel tem HTML de 548.063 caracteres, sem tags `<script src>` externas nem `<iframe src>` detectadas no documento retornado, e sem ocorrência textual dos identificadores rastreadores comuns analisados (`googletagmanager`, `google-analytics`, `gtag`, `facebook.com/tr`, `fbq(`, `clarity.ms`, `hotjar`). **Inspeção estática limitada:** não substitui captura de requests/cookies pelo navegador real nem auditoria dos serviços de terceiros.
- Durante esta rodada de homologação, Turnstile Cloudflare e SMTP Gmail reais foram configurados no Preview protegido da branch, e um cadastro sintético foi concluído pelo proprietário no Neon TEST. O proprietário relatou recuperação de senha bem-sucedida. Não estender esta afirmação à Production.
- Consta no código `FREE_SIGNUP_TERMS_VERSION='v24-draft-2026-10-28'`; o formulário envia esse mesmo valor. Não chamar os aceites efetuados na homologação de aceite de Termos definitivos.

## 2. Alterações concretas nesta rodada (somente Preview da integração)

1. `politica-de-privacidade.html`: seção **Compartilhamento e prestadores** agora identifica Vercel, Neon, Gmail/Google e Cloudflare Turnstile conforme o funcionamento realmente homologado, distinguindo Hotmart como etapa de contratação ainda dependente de validação. Mantida a qualificação de minuta e a necessidade de auditoria de transferência internacional/operadores.
2. `politica-de-cookies.html`: seção **Cookies de terceiros e verificação de segurança** explicita uso do Cloudflare Turnstile e a necessidade de auditoria técnica de cookies; não afirma que o Turnstile é um serviço de marketing nem que não processa dados técnicos.
3. `lib/free-signup-handler.js`: **gate fail-closed de Production**. Ainda que um operador configure flags de aprovação, `freeSignupEnabled` não libera cadastro produtivo enquanto a versão de Termos contiver `draft`, `minuta` ou variante de pré-lançamento. É necessário aprovar documentos, atualizar versão em handler e formulário, testar novamente e só então avaliar produção.
4. `tests/public-free-signup-4-5-unit.mjs`: teste cobre reprovação de Production quando o código ainda usa Termos draft e credenciais sintáticas de Turnstile. Os testes não autorizam abrir a Production.
5. Vitrine V25 publicada, projeto Vercel de Production, banco Neon produtivo e PR `main` **NÃO foram modificados**.

## 3. Pendências que exigem informações/validações externas

| Gate | Condição de fechamento | Estado |
|---|---|---|
| Identificação do fornecedor | **Forma de atuação confirmada pelo proprietário em 29/10/2026: pessoa física (CPF), sem CNPJ por enquanto.** Falta validar identificação civil e informações de contato e localização, além de definir uma forma juridicamente adequada e segura de disponibilizá-las ao consumidor antes da venda. Não inserir número de CPF ou endereço residencial em repositório, issues ou ambientes de testes. | **FORMA DEFINIDA; DADOS E PUBLICAÇÃO LEGAL PENDENTES** |
| Procedimento de atendimento | Confirmar meio de contato efetivo, confirmação de recebimento e tratamento de reclamações, suspensão, cancelamento e arrependimento; validar SLA e fluxo. | **PENDENTE** |
| Compra Hotmart | **Print real enviado pelo proprietário em 29/10/2026:** preços e códigos visíveis das duas ofertas correspondem ao mapeamento da integração: R$ 97 / `o4y1mlg9` (6 meses na Central) e R$ 194 / `gh4ajvj1` (12 meses na Central). R$ 194 aparece como **Preço base**. Ambas exibem **Parcelado com taxas para seu cliente**. **O proprietário confirmou em 29/10/2026 que AMBAS as ofertas (semestral e anual) são COMPRAS ÚNICAS, sem renovação automática.** Essa comprovação decorre do relato dele, não de auditoria independente no painel. Também continuam pendentes preço atualizado no checkout anual, tipo de produto, custos finais do parcelamento, links de checkout, regras de reembolso e simulação do ciclo de compra. **Não é evidência de cobrança real ou de webhook Live.** | **AS DUAS OFERTAS: COMPRA ÚNICA CONFIRMADA PELO PROPRIETÁRIO; CHECKOUT A VALIDAR** |
| Política de privacidade | Auditar o fluxo exato de dados, prestadores/suboperadores, retenção por categoria, transferências internacionais, direitos do titular e resposta a solicitações. | **PENDENTE** |
| Política de cookies | Confirmar cookies/armazenamentos e requests no navegador móvel e desktop da vitrine, cadastro, login, Central e checkout de terceiro; verificar ausência de marketing não autorizado e necessidade de banner conforme categorias efetivamente usadas. | **PENDENTE** |
| Versão legal | Finalizar Termos e Políticas revisados, registrar versão imutável e fazer update **coordenado** do aceite: `FREE_SIGNUP_TERMS_VERSION`, `cadastro-gratuito.html` `termsVersion`, rótulos/data e testes. Não reaproveitar aceites `draft` como aceites da versão final. | **PENDENTE** |
| Domínio e operação pública | **O proprietário confirmou em 29/10/2026 que AINDA NÃO COMPROU `basecompleta.com.br`.** A associação administrativa desse hostname à Vercel **não comprova titularidade nem operação DNS/SSL**. Adiar compra, DNS e HTTPS próprios; não tentar ativar domínio não adquirido. Homologar jornadas e links com URLs `*.vercel.app` existentes e decidir o endereço público definitivo antes da abertura das vendas. | **DOMÍNIO PRÓPRIO ADIADO POR DECISÃO DO PROPRIETÁRIO; LINKS DO LANÇAMENTO PENDENTES** |
| Segurança do lançamento | Concluir testes negativos de token/replay e orçamento de rate limit, confirmação do backup/rollback e homologação controlada da integração (sem tocar `main` antes do GO). | **PENDENTE** |

## 4. Requisitos públicos de referência

- Decreto 7.962/2013, arts. 2 a 5, identificação do fornecedor, endereço físico e eletrônico, condições integrais da oferta, atendimento facilitado e direito de arrependimento: https://www.planalto.gov.br/ccivil_03/_ato2011-2014/2013/decreto/d7962.htm
- ANPD — direitos do titular: https://www.gov.br/anpd/pt-br/assuntos/titular-de-dados/direito-dos-titulares
- ANPD — Guia Orientativo Cookies e Proteção de Dados Pessoais: https://www.gov.br/anpd/pt-br/centrais-de-conteudo/materiais-educativos-e-publicacoes/guia-orientativo-cookies-e-protecao-de-dados-pessoais.pdf

**Não classificar como conformidade jurídica certificada:** é um checkpoint técnico e de requisitos para revisão final profissional quando necessária.

## 5. Decisão do proprietário e execução fiscal como pessoa física

**Confirmado pelo proprietário em 29/10/2026:** a Base Completa iniciará a comercialização como **pessoa física, utilizando CPF**, sem MEI ou pessoa jurídica por enquanto. Isso define a modalidade de cadastro pretendida, mas **não equivale a regularidade fiscal comprovada nem à aprovação final da oferta**.

- **Hotmart:** o proprietário **confirmou por relato em 29/10/2026 que já tem conta de produtor cadastrada como pessoa física (CPF)**. Não pedir novo cadastro. A situação de verificação de documentos, titularidade de recebimentos, capacidade de sacar valores e configuração real das ofertas comerciais **ainda não foram consultadas em sessão autenticada da Hotmart**. Referência de login do produtor: https://app.hotmart.com/ .
- **Informação ao consumidor:** o art. 2º, I e II, do Decreto 7.962/2013 prevê identificação do fornecedor com CPF/CNPJ quando aplicável e endereço físico e eletrônico, em local de destaque e fácil acesso. Não presumir que somente nome e e-mail preencham essa obrigação. **Não publicar CPF ou endereço pessoal automaticamente**, nem adicioná-los a commits, mas **não suprimir obrigação de transparência**: escolher com orientação jurídica/contábil um canal e formato adequados de divulgação ao consumidor, antes de permitir venda pública.
- **Tributos/obrigações locais:** consultar contabilidade quanto à tributação de recebimentos de pessoas físicas/pela plataforma, emissão de documento fiscal quando exigível e regras municipais pertinentes ao tipo de serviço ou produto digital; não presumir que a condição de PF dispensa recolhimento ou licenças. Referência geral Receita Federal: https://www.gov.br/receitafederal/pt-br/assuntos/meu-imposto-de-renda/pagamento/carne-leao/rendimentos/
- **Documentos públicos:** manter rótulo de **minuta** até conferência jurídica. Não colocar a identificação civil nem dados fiscais no GitHub. As páginas de lançamento deverão refletir a modalidade PF e os dados legais aprovados no canal de publicação apropriado, com controle de acesso até o GO.
- **Hotmart (evidência adicional de tela):** o produtor exibiu a lista **Precificação e Ofertas** em 29/10/2026 (mostrando 2 de 2 ofertas); `gh4ajvj1` a R$ 194,00 (Preço base) e `o4y1mlg9` a R$ 97,00 (Premium — Semestral). As duas mostram `Parcelado com taxas para seu cliente`. **O print não mostra tipo de produto, recorrência, links de checkout nem previsão de recebimento**. Solicitar apenas detalhe de uma oferta, a seguir a outra, para concluir compra única sem cobrança automática; não solicitar senhas nem realizar compra. A interface do checkout deve apresentar valor total com eventuais juros de parcelamento.
- **Hotmart e DNS:** verificações comerciais podem continuar em paralelo, sem abrir produção.

## 6. Alteração da oferta anual — 29/10/2026

O proprietário informou que **alterou o preço da oferta base/anual de R$ 194,00 para R$ 179,00 na Hotmart**. Como a comunicação decorre de relato, falta uma nova evidência visual ou leitura autorizada do checkout mostrando o preço atualizado e a preservação do código `gh4ajvj1`. A captura de tela anterior que mostrava R$ 194,00 é **evidência histórica**; não apagar nem reinterpretar seu valor. A oferta semestral permanece R$ 97,00 e código `o4y1mlg9`, salvo nova informação.

- `termos-de-uso.html` na branch de integração foi ajustado para **R$ 179,00/12 meses** como oferta planejada, ainda sujeita à confirmação no checkout. **A vitrine comercial V25 em Production não foi atualizada nesta rodada** e pode apresentar preço antigo; revisar todos os locais e publicar somente após um GO controlado.
- A lógica de webhook usa `HOTMART_OFFER_12M_CODE` para atribuir 12 meses e não contém valor R$ 194 como regra de acesso; uma mera mudança de preço em uma oferta existente **não requer** mexer no prazo de assinatura na Central. Se a Hotmart gerou código de oferta novo, atualizar a configuração da Preview somente após validar o novo código.
- **Modalidade de pagamento das duas ofertas:** o proprietário informou expressamente que **ambas são compras únicas, sem recorrência**. Registrar como **confirmação declaratória do titular**, não como prova técnica independente nem como validação do checkout. A tela anterior mostrava `Parcelado com taxas para seu cliente`, o que não contradiz uma compra única: parcelas podem ser parte de uma mesma compra. A condição da oferta semestral foi confirmada pelo proprietário em 29/10/2026; a comprovação técnica no checkout permanece pendente. Não realizar compra real para essa verificação.

**A forma PF/CPF e a existência da conta Hotmart PF estão confirmadas pelo proprietário.** Os campos de identificação pública, atendimento, versão final dos Termos, tributos, verificação da conta Hotmart e checkout continuam **PENDENTES**.

**Decisão: NO-GO para Production**, com edições restritas à Preview da integração e CI obrigatória após qualquer mudança.


## 7. Fechamento da preparação editorial e operacional — 29/10/2026 (sem GO)

**Concluído como preparação de Pré-Launch, sem publicar termos finais:**

- `termos-de-uso.html` na PR #187: detalhado procedimento de suporte e arrependimento por canal direto (sem exclusividade da Hotmart), confirmação imediata do recebimento e manifestação até cinco dias conforme Decreto 7.962/2013; explicitado que parcelamento não é recorrência, e exclusão pode ser solicitada por e-mail, sem depender de um botão futuro.
- `politica-de-privacidade.html`: explicitadas regras de verificação de identidade proporcional ao risco, atendimento de solicitações com referência ao art. 19 da LGPD, e categorias para definição de prazos reais de retenção, ainda não inventados/validados.
- `politica-de-cookies.html`: reforçado que o modelo de cookies é planejado e **não equivale a auditoria técnica de navegador concluída**.
- Procedimento operacional detalhado de suporte, cancelamento, reembolso, privacidade e retenção criado em `docs/OPERACAO_ATENDIMENTO_PRIVACIDADE_PRE_LANCAMENTO_20261029.md`.
- Gate de publicação e coordenada de versões/aceites criado em `docs/GATE_PUBLICACAO_LEGAL_E_ACEITES_20261029.md`. Backend e formulário **mantêm versão `v24-draft-2026-10-28`** e bloqueio Production; não declarar aceite definitivo.
- Adicionado teste de regressão em `tests/public-free-signup-4-5-unit.mjs` para correspondência de versões, rótulo de pré-lançamento, `noindex`, preços R$97/R$179, conteúdo de atendimento, LGPD e cautela de cookies.

**Informação temporal importante:** as afirmações anteriores deste checkpoint sobre vitrine não modificada descreviam uma rodada **anterior**. Em uma rodada posterior de 29/10/2026, o alias público de marketing `https://base-completa-vitrine-estatica-2026.vercel.app/` foi atualizado para a V25 de R$179, com os CTAs de compra desabilitados e `noindex`; o domínio próprio ainda não foi adquirido. **As alterações jurídicas desta seção, porém, existem apenas no GitHub da Central**, não necessariamente nas cópias do site comercial separado.

**Ainda bloqueiam a aprovação jurídica/operacional final:** (a) confirmação segura da identificação e localização exigíveis ao fornecedor pessoa física; (b) teste de confirmação imediata e operação real do atendimento; (c) auditoria de cookies e retenção de dados/prestadores; (d) finalização/revisão jurídica dos textos e versão final dos aceites; (e) alinhamento dos documentos da vitrine e da Central; (f) demais gates técnicos e comerciais, inclusive Hotmart, que o proprietário adiou. O e-mail de suporte já aparece nas minutas, mas **possuir uma caixa Gmail não equivale a ter atendimento homologado**.

**Status desta etapa: PREPARAÇÃO DOCUMENTAL E PROCEDIMENTAL CONCLUÍDA; APROVAÇÃO FINAL, ATIVAÇÃO E PUBLICAÇÃO AINDA PENDENTES.**
