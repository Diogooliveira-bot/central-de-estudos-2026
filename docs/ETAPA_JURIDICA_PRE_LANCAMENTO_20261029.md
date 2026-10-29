# Base Completa — Etapa jurídica/comercial pré-lançamento

**Data:** 29/10/2026 · **Ambiente:** branch `integration/lancamento-base-completa-20261028`, PR #187 (draft). **Não é aprovação jurídica final nem autorização de publicação.**

## 1. Evidências revalidadas

- Site público de apresentação V25 em projeto Vercel separado: https://base-completa-vitrine-estatica-2026.vercel.app/ .
- Termos de Uso, Política de Privacidade e Política de Cookies respondem HTTP 200 no site V25. Permanecem marcados como **pré-lançamento** e têm `noindex`; NÃO substituir por textos supostamente aprovados.
- Os Termos informam plano Gratuito com limite de até 20 questões/dia no Lei em Dia e exclusividade de TEC/QConcursos no Premium; ofertam, ainda sujeito a checkout verificado, **R$ 97/6 meses** e **R$ 194/12 meses**, pagamento único e renovação manual. Direito de arrependimento e reembolso são descritos, mas checkout Hotmart real está pendente.
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
| Compra Hotmart | Confirmar produto 8805543 e ofertas semestral/anual, pagamento único e sem renovação automática, valores, impostos/taxas aplicáveis, entrega, canais de reembolso e links definitivos no painel autenticado. | **PENDENTE** |
| Política de privacidade | Auditar o fluxo exato de dados, prestadores/suboperadores, retenção por categoria, transferências internacionais, direitos do titular e resposta a solicitações. | **PENDENTE** |
| Política de cookies | Confirmar cookies/armazenamentos e requests no navegador móvel e desktop da vitrine, cadastro, login, Central e checkout de terceiro; verificar ausência de marketing não autorizado e necessidade de banner conforme categorias efetivamente usadas. | **PENDENTE** |
| Versão legal | Finalizar Termos e Políticas revisados, registrar versão imutável e fazer update **coordenado** do aceite: `FREE_SIGNUP_TERMS_VERSION`, `cadastro-gratuito.html` `termsVersion`, rótulos/data e testes. Não reaproveitar aceites `draft` como aceites da versão final. | **PENDENTE** |
| DNS e operação pública | Validar `basecompleta.com.br` e `app.basecompleta.com.br` (DNS externo, HTTPS), linkagem, CTA e checkout antes de remover `noindex` e abrir cadastro público. | **PENDENTE** |
| Segurança do lançamento | Concluir testes negativos de token/replay e orçamento de rate limit, confirmação do backup/rollback e homologação controlada da integração (sem tocar `main` antes do GO). | **PENDENTE** |

## 4. Requisitos públicos de referência

- Decreto 7.962/2013, arts. 2 a 5, identificação do fornecedor, endereço físico e eletrônico, condições integrais da oferta, atendimento facilitado e direito de arrependimento: https://www.planalto.gov.br/ccivil_03/_ato2011-2014/2013/decreto/d7962.htm
- ANPD — direitos do titular: https://www.gov.br/anpd/pt-br/assuntos/titular-de-dados/direito-dos-titulares
- ANPD — Guia Orientativo Cookies e Proteção de Dados Pessoais: https://www.gov.br/anpd/pt-br/centrais-de-conteudo/materiais-educativos-e-publicacoes/guia-orientativo-cookies-e-protecao-de-dados-pessoais.pdf

**Não classificar como conformidade jurídica certificada:** é um checkpoint técnico e de requisitos para revisão final profissional quando necessária.

## 5. Decisão do proprietário e execução fiscal como pessoa física

**Confirmado pelo proprietário em 29/10/2026:** a Base Completa iniciará a comercialização como **pessoa física, utilizando CPF**, sem MEI ou pessoa jurídica por enquanto. Isso define a modalidade de cadastro pretendida, mas **não equivale a regularidade fiscal comprovada nem à aprovação final da oferta**.

- **Hotmart:** a plataforma aceita produtores pessoa física e solicita validação cadastral, documento com foto/CPF e biometria conforme regras da conta, além de titularidade bancária compatível. A efetiva situação cadastral da conta do produtor, a capacidade de receber e sacar valores e as ofertas comerciais ainda dependem de verificação autenticada. Fonte: https://suportehotmart.zendesk.com/hc/pt-br/articles/216440217-Como-cadastrar-meus-documentos-na-Hotmart
- **Informação ao consumidor:** o art. 2º, I e II, do Decreto 7.962/2013 prevê identificação do fornecedor com CPF/CNPJ quando aplicável e endereço físico e eletrônico, em local de destaque e fácil acesso. Não presumir que somente nome e e-mail preencham essa obrigação. **Não publicar CPF ou endereço pessoal automaticamente**, nem adicioná-los a commits, mas **não suprimir obrigação de transparência**: escolher com orientação jurídica/contábil um canal e formato adequados de divulgação ao consumidor, antes de permitir venda pública.
- **Tributos/obrigações locais:** consultar contabilidade quanto à tributação de recebimentos de pessoas físicas/pela plataforma, emissão de documento fiscal quando exigível e regras municipais pertinentes ao tipo de serviço ou produto digital; não presumir que a condição de PF dispensa recolhimento ou licenças. Referência geral Receita Federal: https://www.gov.br/receitafederal/pt-br/assuntos/meu-imposto-de-renda/pagamento/carne-leao/rendimentos/
- **Documentos públicos:** manter rótulo de **minuta** até conferência jurídica. Não colocar a identificação civil nem dados fiscais no GitHub. As páginas de lançamento deverão refletir a modalidade PF e os dados legais aprovados no canal de publicação apropriado, com controle de acesso até o GO.
- **Hotmart e DNS:** verificações comerciais podem continuar em paralelo, sem abrir produção.

**A forma PF/CPF está DECIDIDA.** Os campos de identificação, atendimento, versão final dos Termos, tributos e checkout continuam **PENDENTES**.

**Decisão: NO-GO para Production**, com edições restritas à Preview da integração e CI obrigatória após qualquer mudança.
