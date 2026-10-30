# Base Completa — gate de publicação legal e controle dos aceites

**Preparado em:** 29/10/2026 · **Estado:** plano de passagem controlada, **NÃO GO**. Use somente quando a documentação for efetivamente aprovada e todas as verificações de segurança do lançamento forem concluídas.

## Contexto validado

- A operação será **pessoa física (CPF)** por decisão do proprietário. O documento de identificação e informações de localização exigíveis **não devem ser colados neste repositório** nem em comentários de PR, logs ou capturas públicas. Nome civil, CPF, endereço físico e canal eletrônico precisam ser confirmados para a divulgação exigível por via adequada.
- Os documentos `termos-de-uso.html`, `politica-de-privacidade.html` e `politica-de-cookies.html` são **minutas de pré-lançamento**, mesmo quando legíveis publicamente. O rótulo `noindex,nofollow,noarchive` continua intencional.
- O aceite de cadastro ainda usa `FREE_SIGNUP_TERMS_VERSION='v24-draft-2026-10-28'` em `lib/free-signup-handler.js` e `termsVersion:'v24-draft-2026-10-28'` em `cadastro-gratuito.html`. Aceites anteriores em TEST são **somente de minuta**. O backend verifica versão no pedido e no consumo do token; não reusar esses aceites como assinatura da versão final.
- Em Production, `freeSignupEnabled` rejeita versões contendo `draft|minuta|prelaunch`, além de exigir sinais explícitos de aprovação, Turnstile e proteção de dados. **Nunca desativar esse bloqueio por conveniência.**
- Vitrine comercial V25 no alias `https://base-completa-vitrine-estatica-2026.vercel.app/` foi validada com anual **R$179** em 29/10/2026; o produto Hotmart ainda não foi homologado externamente e os CTAs de pagamento permanecem fechados.
- Os documentos de referência do marketing são do projeto Vercel separado: **não presumir que um commit na Central atualiza a vitrine automaticamente**.

## Aprovações humanas mínimas e insumos não públicos

| Tema | Critério para liberar | Estado |
|---|---|---|
| Identificação do fornecedor PF | Conferir nome legal/CPF/endereço físico e eletrônico segundo norma e canal de publicação seguro, após orientação profissional se necessário | **Pendente** |
| Atendimento eletrônico | Confirmar e-mail de suporte, monitoramento, confirmação imediata do recebimento no mesmo canal, manifestação até 5 dias, tratamento de urgências | **Pendente de operação real** |
| Reembolso e exercício de arrependimento | Fluxo acessível sem login, comprovação de data do pedido e encaminhamento/estorno pelo intermediador sem restringir canal direto | **Procedimento pronto; E2E pendente** |
| Privacidade | Confirmar bases legais efetivas, operadores, transferência internacional, critérios de retenção, tratamento de direitos e solicitações | **Aprovação final pendente** |
| Cookies | Auditoria de rede/storage em navegador real e decisão sobre cookies não essenciais/banner | **Auditoria pendente** |
| Planos | R$97/6 meses e R$179/12 meses, compra única com possíveis taxas de parcelas exibidas, sem renovação automática | **Definidos; checkout externo pendente** |
| Backup e rollback | Backup atual verificado, roteiro de reversão exercitado, dados de alunos protegidos | **Pendente da liberação final** |
| Domínio próprio | `basecompleta.com.br` ainda **não foi comprado**; continuar homologação em `*.vercel.app`, sem apontar DNS inexistente | **Adiado** |

## Sequência técnica EXATA quando os textos estiverem aprovados

1. **Congelar o texto final** dos três documentos aprovados (data, versão, URLs públicas, fornecedores, contato, LGPD). Revisar CPF/endereço em canal seguro e não commitá-los sem autorização e proteção apropriada.
2. Definir um identificador **novo e imutável**, por exemplo `terms-2026-11-XX-v1` **apenas como exemplo**, nunca como versão aprovada agora.
3. Em **um único conjunto de alterações**: atualizar `FREE_SIGNUP_TERMS_VERSION` em `lib/free-signup-handler.js`, `termsVersion` em `cadastro-gratuito.html`, metadados e texto dos Termos e respectivas políticas; garantir que o backend rejeite versões anteriores no novo cadastro.
4. Adicionar testes que comparam versão do formulário e backend e validam o fluxo de aceites: sem aceite/sem maioridade/versão antiga → rejeição; aceitar versão correta → registro auditável; token de minuta antiga não é convertido em aceite final.
5. Confirmar que os consentimentos de **e-mail promocional e WhatsApp** permanecem facultativos, independentes e desmarcados por padrão; não modificar a decisão de não ativar WhatsApp.
6. Publicar primeiro **somente Preview isolada** e executar E2E com Turnstile real e Gmail de teste, verificando banco TEST, login e opção de desistência. Preservar `noindex` e CTAs fechados até GO.
7. Atualizar **o site comercial V25 em projeto separado** com os mesmos textos finais, verificar HTTP 200, links e experiência móvel; comparar com a Central. Não usar URLs `basecompleta.com.br` até aquisição.
8. Confirmar **identificação, atendimento imediato e manifestação até 5 dias** em uso real, além de cancelamento/reembolso e direitos LGPD. Não declarar suporte ativo sem teste.
9. Conferir backup, restauração, rollback, classificação de cookies, URL do app público segura, proteção da PR, release notes e testes CI; só então solicitar GO final para Production.
10. Após GO, ativar os sinais de ambiente por alteração controlada com verificações de segurança e monitorar a jornada real. **Não habilitar apenas por atualizar versão textual.**

## Invariantes que devem sobreviver ao lançamento

- O aluno Gratuito não ganha acesso a TEC/QConcursos da Base Completa; permanece a cota do Lei em Dia.
- A cobrança Premium é única e sem renovação automática; 6/12 meses mapeados à oferta, não ao número de parcelas.
- Mudança de Premium para Gratuito não deve apagar o progresso de estudo.
- Solicitação de privacidade não equivale a cancelamento de compra, e vice-versa.
- Nenhuma chave Hotmart, credencial Gmail, segredo Turnstile, CPF ou endereço residencial em GitHub/CI ou respostas públicas.

**Critério final:** esta etapa fica **PRONTA PARA REVISÃO FINAL**, mas não legalmente aprovada nem publicada em Production. A aprovação dependerá da decisão explícita do proprietário após os gates restantes, especialmente dados legais, suporte, Hotmart e backup.

## Aprovação dos textos em 30/10/2026
O proprietário aprovou expressamente os três textos legais consolidados para uso no lançamento. Esta aprovação editorial não confirma dados identificatórios faltantes, atendimento operacional, auditoria de cookies ou homologação externa de cadastro/pagamentos. Manter os gates técnicos até validação e não expor CPF/endereço em GitHub.
