# BASE COMPLETA — MISSÃO ÚNICA DE EXECUÇÃO INTEGRAL PELO CHATGPT WORK
**Data da consolidação:** 28/10/2026  
**Solicitante:** proprietário da Base Completa — Central de Estudos  
**Modo de trabalho:** execução autônoma, prioritariamente por ferramentas conectadas e computador/navegador do Work, com mínima intervenção do proprietário.  
**Estado inicial:** lançamento comercial NÃO homologado; não pressupor que funcionalidades presentes no código estejam operantes em produção.

## COMANDO PRINCIPAL

Atue como líder técnico, engenheiro full-stack, QA, responsável por infraestrutura, segurança, produto, conteúdo jurídico, UX, operações de assinatura e lançamento digital da Base Completa. Sua missão é CONCLUIR AS PENDÊNCIAS EXISTENTES, INTEGRAR OS TRABALHOS PARALELOS E PREPARAR A OPERAÇÃO COMERCIAL REAL, NÃO APENAS ESCREVER UM PLANO.

**Não recomece o projeto e não construa infraestrutura duplicada.** Procure e reutilize código, branches, Previews, relatórios, migrações, testes, backups, artefatos e configurações já criados. Trabalhe no máximo de autonomia e prossiga nas tarefas independentes se encontrar um bloqueio.

Não pedir aprovações para operações rotineiras, ajustes seguros, commits em branches, criação de Previews protegidas, testes automatizados, auditorias e correções reversíveis. O proprietário não quer executar operações técnicas manualmente. Quando precisar interagir com um painel, use o navegador/computador do Work, respeitando as permissões da sessão conectada.

**NÃO** comprar domínio, alterar plano pago, aumentar faturamento, fazer compra-teste real, enviar campanha comercial, criar despesa, publicar anúncio pago, modificar dados bancários ou conceder acesso a terceiros sem aprovação específica. Não inventar informações jurídicas/fiscais. Não solicitar ou publicar segredos no chat, no GitHub ou em logs. Se houver login, MFA/2FA, compra, prova de titularidade, dado jurídico indispensável ou outra barreira humana inevitável, agrupar as solicitações em UMA lista objetiva ao final e continuar tudo que não depende disso.

**Produção:** o proprietário já autorizou em conversas anteriores publicação controlada SOMENTE depois de backups restauráveis, revisão de segurança, testes integrados conclusivos, conformidade legal mínima e plano de rollback. Se faltar qualquer condição crítica, manter NO-GO e não alterar produção. Preservar contas, progresso dos alunos, dados e serviços atuais.

## 1. FONTES OFICIAIS E INVENTÁRIO

### Repositório e branches
- GitHub: https://github.com/Diogooliveira-bot/central-de-estudos-2026
- Branch padrão: `main` — verificar SHA atual e deployment em produção antes de qualquer ação.
- Cadastro Gratuito 4.5 (base): `commercial/etapa-4-5-20261027`.
- Cadastro + maioridade + minutas V24: `commercial/cadastro-legal-v24-20261028`.
- Consentimentos separados de e-mail e WhatsApp, derivada da anterior: `commercial/email-marketing-consent-20261028`.
- Hotmart com proteção contra recorrência: `commercial/hotmart-manual-renewal-20261028`.
- Padronização editorial jurídica: `preview/legal-complete-premium-v1-20261025`.
- Referência adicional de homologação premium, se ainda pertinente: `release/premium-final-homologacao-20261026`.
- Verificar outras branches/PRs mais recentes antes de escolher a base de integração. **Essas branches divergem de main. NUNCA mesclar indiscriminadamente.**
- Conferir documentação de cada trilha no diretório `docs/` da branch correspondente.

### Projetos externos
- Site comercial hospedado na Vercel: `base-completa-vitrine-estatica-20261027`; alias conhecido: https://base-completa-vitrine-estatica-2026.vercel.app/
- Central de Estudos na Vercel: `central-de-estudos`; endereço provisório conhecido: https://central-de-estudos-ecru.vercel.app/
- Projeto Neon de TESTE informado anteriormente: `shiny-hall-19564809`; branch TEST `br-late-band-b7lzjsyi`. **Confirmar projeto, branch, endpoint, credenciais e isolamento lendo o estado atual, pois houve relatos de associação inesperada após restauração.**
- Futuro domínio comercial: `basecompleta.com.br`; app futura: `app.basecompleta.com.br`. **Não presumir domínio registrado/comprado só porque existe alias associado à Vercel. Verificar a titularidade e DNS no Registro.br.**
- E-mail oficial informado: `basecompleta.estudos@gmail.com` (suporte/privacidade e testes somente quando devidamente autorizado).
- Hotmart: produto histórico `8805543`; checkout de referência histórica `https://pay.hotmart.com/B108186453Y?off=o4y1mlg9`. **NÃO presumir que esta oferta esteja ativa, correta, não recorrente ou adequada ao lançamento.**
- Arquivo V24 do site comercial foi preparado em conversa: `base-completa-v24-documentos-legais.zip`, com `index.html`, Termos, Privacidade e Cookies. Se o artefato não estiver disponível no Work, recuperar a V23 publicada e as três páginas legais presentes na branch de cadastro, preservando o layout aprovado.

### Estado comprovado em testes anteriores
- Etapa 2.17, cadastro maioridade/Termos: 29 testes unitários e navegador desktop/celular aprovados com API simulada. https://github.com/Diogooliveira-bot/central-de-estudos-2026/actions/runs/40712234256
- Etapa 2.18, consentimento comercial de e-mail independente do WhatsApp: 39 testes unitários + navegador aprovados com API simulada. https://github.com/Diogooliveira-bot/central-de-estudos-2026/actions/runs/40717287365
- Hotmart, filtro de aprovação de recorrência: 20 testes unitários aprovados. https://github.com/Diogooliveira-bot/central-de-estudos-2026/actions/runs/40703395224
- **Esses testes NÃO provam integração real com Neon, SMTP externo, Cloudflare, checkout nem produção.**
- O site V23 foi relatado como publicado; a V24 com documentos legais ficou bloqueada por limite diário gratuito de deployments na Vercel. Reconfirmar Vercel antes de publicar; não pagar nem duplicar projetos para contornar o limite.
- Existem lembretes de 29/10/2026: retomar site/cadastro e Turnstile. Lembretes não representam execução.

## 2. REGRAS DE PRODUTO E NEGÓCIO — NÃO NEGOCIÁVEIS

1. Marca: **Base Completa — Central de Estudos**. Plataforma de **formação básica para diversos concursos públicos**, organizada para construir a base de conhecimentos e tornar o estudante competitivo; NÃO posicionar exclusivamente para tribunais.
2. Site: identidade previamente aprovada, azul-marinho/branco, visual premium e natural, fontes editoriais maiores, logo ORIGINAL da marca, fotos/capturas REAIS quando disponíveis. Remover ornamentos artificiais, bolinhas decorativas, fundos genéricos e cards reprovados. Não reintroduzir mascote modificado sem solicitação.
3. Conteúdos: destacar Português, Raciocínio Lógico, Informática, Constitucional, Administrativo, Civil e Processo Civil, Penal e Processo Penal e demais disciplinas realmente existentes. A lista exata deve vir do catálogo atual. **Direito do Trabalho e Processo do Trabalho foram removidos por decisão do proprietário; não restaurá-los.**
4. Plano **Gratuito permanente**: manter os recursos definidos e até **20 questões por dia no Lei em Dia**. Links, filtros e cadernos externos do TEC Concursos e QConcursos são **exclusivos do Premium**; não confundir link externo com acesso pago ao próprio TEC/QC.
5. Premium de lançamento: **R$ 97,00 / 6 meses** e **R$ 194,00 / 12 meses**. Não divulgar período gratuito de teste Premium. A **renovação é manual, nunca automaticamente recorrente**, e a duração deve corresponder à oferta comprada.
6. Após vencimento ou reembolso confirmado: plano efetivo FREE, com preservação permitida de conta e progresso. Não reduzir direitos legais de consumidores. Reembolso pela Hotmart com suporte por e-mail; respeitar o arrependimento legal de 7 dias nos casos aplicáveis.
7. Contas individuais com acesso em diversos dispositivos sem bloqueios arbitrários. Uso pessoal dos materiais protegidos, respeitados direitos autorais de terceiros e legislação.
8. Cadastro para **18 anos ou mais**; declaração de maioridade obrigatória; aceite da versão válida dos Termos separado do consentimento comercial; não coletar data de nascimento completa sem necessidade.
9. WhatsApp opcional, protegido e nunca em texto puro. Consentimentos comerciais independentes e **desmarcados por padrão** para WhatsApp e e-mail. Oferecer revogação gratuita em cada canal. E-mails de segurança/cadastro/vencimento são transacionais e não exigem consentimento de publicidade.
10. **Não ativar Meta Pixel, Google Analytics nem rastreamento não essencial** nesta fase. Auditar cookies de terceiros e atualizar políticas antes do lançamento.
11. Não ativar, por conta própria, bots comerciais WhatsApp/Claude ou campanha paga; essas iniciativas podem ser preparadas após o lançamento mediante integração e autorizações necessárias.

## 3. EXECUTAR EM FASES, SEM PARAR POR BLOQUEIOS INDEPENDENTES

### Fase 0 — Inventário técnico e trilha de auditoria
- Inspecionar GitHub, branches/PRs, deployments Vercel, variáveis por ambiente **sem expor valores**, Neon, provedores de e-mail, Hotmart, backups Drive, releases e relatórios.
- Produzir quadro `feito / pendente / risco / ação / evidência / bloqueio`.
- Confirmar configurações reais e mapear caminhos de produção vs homologação. Diagnosticar riscos relatados: associação branch/endpoint Neon, permissões PWA, erros de integridade de módulos, conteúdos ausentes, migrações não aplicadas.
- Criar branch de integração controlada a partir da base segura escolhida. Revisar commits e conflitos um a um; preservar branches originais e trabalho editorial aprovado.
- Registrar SHA e estado de produção ANTES de qualquer modificação; tornar rollback verificável.

### Fase 1 — Backup, restauração e segurança
- Identificar backups já criptografados, verificar integridade, registro de chave pública, localizações e retenção. **Não copiar a chave privada do pendrive, não expor senhas e não apagar backups existentes.**
- Fazer teste de restauração em ambiente inteiramente isolado com dados sintéticos ou backup autorizado e chave disponível de maneira segura. Caso dependa de chave física ou acesso ausente, não fingir que restaurou: registrar bloqueio e executar ações independentes.
- Verificar segregação de Neon Production / TEST / Previews e cadeia de deploy; revisar variáveis de ambiente, CSRF, sessão, cookies, rate-limits, quotas FREE, isolamento de conteúdo Premium e logs sem PII.
- Testes de restore e rollback são critério de GO. Nenhuma operação destrutiva autônoma.

### Fase 2 — Site comercial V24 e domínio
- Recuperar arquivos V24, preservar estética aprovada V21/V23 e publicar Termos de Uso, Política de Privacidade e Política de Cookies com links funcionais no rodapé.
- Confirmar que o site mostra APENAS Gratuito, Semestral R$97 e Anual R$194, sem preço na primeira dobra se assim aprovado e sem teste Premium de 7 dias.
- Otimizar textos de venda, velocidade, mobile/tablet, acessibilidade, imagens reais, SEO técnico e CTA. Cadastro gratuito só pode ser aberto depois de homologação; até lá, oferecer estado informativo seguro.
- Verificar se `basecompleta.com.br` pertence ao proprietário, DNS, TLS e aliases. Conectar comercial e subdomínio app quando isso for realmente viável, SEM comprar domínio ou modificar titularidade sem aprovação. Se não registrado, manter endereços Vercel e seguir.
- Quando Vercel Hobby atingir limite de deployments, aguardar disponibilidade normal e avançar outras fases; não contratar upgrade.

### Fase 3 — Documentos e cadastro Free
- Revisar minutas V24 juridicamente e tecnicamente. Responsável definido como pessoa física, localização Fortaleza/CE, suporte `basecompleta.estudos@gmail.com`. Confirmar identificação fiscal/endereço legal publicável por meio seguro — **não inventar endereço, CPF ou identificação**.
- Integrar branch `commercial/email-marketing-consent-20261028` e suas antecessoras. Preservar UI e regras que já passaram nos testes.
- Verificar e planejar as migrações `004_public_free_signup.sql`, `005_free_signup_legal_acceptance.sql` e `006_email_marketing_preferences.sql`, nesta ordem. Fazer backup e aplicar **primeiro somente em Neon TEST**. Conferir esquema, constraints, scripts de limpeza, indices, dados retrocompatíveis e idempotência.
- Testar de ponta a ponta: nome/e-mail/senha/WhatsApp opcional; maioridade; aceite versionado; confirmação por e-mail com link de uso único; conta FREE; login; logout; recuperação de senha; exclusão/solicitação de dados; isolamento de marketing; atualização das preferências autenticadas; casos de erro.
- Configurar Cloudflare Turnstile na Preview com hostname correto e validação server-side; modo não interativo se for compatível e seguro, sem habilitar produção antecipadamente.
- Testar SMTP real em homologação, com conta autorizada e sem disparos comerciais. Nunca salvar senha/segredo em código, documentação ou chat.
- Não ativar flag de cadastro público até todos os testes de integração + documentos finais + segurança estarem aprovados.

### Fase 4 — Hotmart, Premium e direitos de acesso
- Revisar implementação já existente do webhook Hotmart, Hottok/autenticação, transações idempotentes, preço/oferta correspondentes e integração com contas existentes/novas.
- Incorporar com revisão a proteção da branch `commercial/hotmart-manual-renewal-20261028`.
- Verificar no painel Hotmart que as ofertas **semestral e anual são de pagamento único**, e não de assinatura com cobrança recorrente. Se forem recorrentes, NÃO liberar venda. O bloqueio no webhook não impede a Hotmart de cobrar.
- Revisar migração `003_hotmart_automatic_access.sql`, aplicar apenas a Neon TEST após backup; reconciliar com migrações de cadastro e estrutura atual. Nunca aplicar migrações às cegas.
- Testar notificações simuladas assinadas/autenticadas para pagamento aprovado, repetição, reordenação, compra com e-mail de usuário já cadastrado, ativação de nova conta com link único, nova compra voluntária, reembolso, estorno, chargeback, cancelamento, vencimento e acesso FREE pós-vencimento. Conferir que TEC/QC e conteúdo privado não vazam para FREE.
- Checkout REAL e Hotmart Live somente após testes e identificação legal concluídos. Não executar compra de teste paga nem simular aprovação como compra real.

### Fase 5 — E-mails transacionais automatizados
- Implementar rotina programada uma vez por dia, compatível com limites do plano gratuito atual da Vercel (verificar regras vigentes e `vercel.json`).
- Enviar aviso **7 dias antes do vencimento** e **no vencimento**, com assunto profissional, marca Base Completa, data exata, acesso à Central e link de renovação MANUAL somente quando a oferta estiver validada.
- Consultar vigência real no Neon; aplicar janela temporal por timezone definido, idempotência e ledger para evitar reenvios; tratar retries, falhas SMTP, dupla execução e remarcação após compra nova.
- Manter e-mails transacionais separados de promoções. Nunca usar opt-in comercial como pré-requisito para notificações de serviço e nunca enviar publicidade por esses gatilhos.
- Implementar proteção do endpoint de cron e observabilidade sem expor dados pessoais. Testar com banco e remetente de homologação, sem disparos em massa.
- Revisar SPF/DKIM/DMARC e remetente somente depois de existir domínio efetivamente controlado; respeitar quotas do provedor.

### Fase 6 — Conteúdo, padronização e qualidade editorial
- Retomar a branch `preview/legal-complete-premium-v1-20261025` e conferir os resultados das etapas 3.x a 10.4 do CPC e das demais disciplinas. Não sobrescrever visual editorial aprovado.
- Garantir tabelas legíveis, títulos e espaçamentos profissionais, links internos, marcadores de leitura por seção, checks persistentes e uso correto dos leitores já existentes; não transformar tudo em cards artificiais.
- Investigar e corrigir inconsistências previamente apontadas: versões conflitantes do CPC M08, questões de M07–M17 inoperantes, índices sem destino, referências a aproximadamente 24 arquivos de pacote offline não existentes; validar se tais problemas ainda persistem antes de agir.
- Verificar Direito Administrativo M01–M20, Civil e Processo Civil, Penal e Processo Penal, Constitucional, Português, RLM e Informática; comparar catálogo publicado vs arquivos aprovados. Não reintroduzir Direito do Trabalho e Processo do Trabalho.
- Executar Chromium real desktop/celular/tablet (e testes autenticados com perfis de teste autorizados), validações visuais, integridade das tabelas, PDFs, PWA e persistência, priorizando bloqueadores da venda.
- Publicar conteúdos em lote pequeno e reversível somente após validação e com backups, mantendo o restante isolado até seguro.

### Fase 7 — Homologação integrada e lançamento controlado
- Criar matriz final: visitante → site → cadastro gratuito → confirmação → login → recursos FREE → compra Hotmart aprovada simulada → Premium → renovação voluntária → aviso de vencimento → volta ao FREE → reembolso/exclusão; testar segurança e isolamento.
- Testar especificamente a 21ª questão diária, links TEC/QC bloqueados para FREE, páginas privadas sem sessão, documentos legais, cadastro de 18+, aceites registrados, preferência de e-mail e WhatsApp, tentativas de abuso.
- Verificar novamente backups recuperáveis, DNS/TLS, variáveis corretas, segredos, webhooks, relatórios GitHub Actions, status de deployment, rollback e monitoração.
- Somente com todos critérios críticos GO: executar publicação controlada em produção com monitoramento e teste de fumaça; registrar URLs, SHA, versão e screenshots. **Se NO-GO, deixar produção como está e encerrar com relatório de pendências exatas.** Não declarar lançamento sem verificar funcionamento real.

### Fase 8 — Preparação comercial sem gasto
- Revisar a jornada de venda: navegação clara, destaque para Premium Semestral, recursos de FREE x Premium, perguntas frequentes, suporte e links de aquisição apenas quando ativos.
- Aproveitar os materiais publicitários do projeto (capturas reais, logo original, mascote original, artes educativas de criação de conta, plano de estudos, teoria, questões internas e links externos Premium). Se os arquivos estiverem acessíveis, preparar conteúdo orgânico e materiais para Instagram, sem publicar campanhas pagas ou realizar disparos de marketing não autorizados.
- Projeto de atendimento automatizado por WhatsApp/Claude fica em backlog técnico até validação do número Meta, custos, consentimentos e permissões; **não o ativar nesta missão sem requisitos completos**.
- Entregar checklist de operação com orientações mínimas para o proprietário (apenas quando efetivamente indispensáveis) e plano de continuidade de baixo esforço.

## 4. CRITÉRIOS DE ACEITAÇÃO E FORMATO DO RELATÓRIO

Não basta alegar que “está pronto”: cada item entregue deve possuir **código/commit/branch, testes, deployment/Preview quando aplicável e evidência verificável**.

Ao concluir, apresentar, em português simples:
1. O que estava pronto antes e foi reaproveitado.
2. O que foi efetivamente alterado agora, com links de commit, PR, Previews e GitHub Actions.
3. O que está 100% validado versus apenas preparado/simulado.
4. Estado e URLs do site e da Central; cadastro e checkout abertos ou não; plano GO/NO-GO.
5. Pendências humanas inevitáveis **consolidadas em uma única lista curta** (MFA, pagamento/titularidade de domínio, dados jurídicos, Hotmart etc.), sem pedir ao proprietário executar tarefas que o Work pode fazer.
6. Próxima ação objetiva e rollback.

**NÃO:** inventar validação, omitir risco, usar banco/conta real como ambiente de teste, abrir acesso público antes das travas, expor segredos, anunciar venda não funcional, modificar conta ou plataforma sem permissão apropriada.

**Prioridade:** finalizar o lançamento comercial de forma segura e com o mínimo de esforço manual do proprietário, sem perder os aprimoramentos editoriais feitos paralelamente.
