# Base Completa — Etapa Final 4.5 — Relatório comercial (27/10/2026)

**Modo:** verificação read-only + página de apresentação exclusivamente em branch isolada. Sem Production, sem merge, sem pagamentos e sem consultas/modificações de contas reais. Não mexe no backup da Etapa 4.4.

## A. Experiência do aluno
- **CONFIRMADO NO CÓDIGO MAIN:** /central-v119.html redireciona não autenticados para /login.html; /login.html tem formulário de login, link /recuperar-senha.html, e instrui expressamente que o PRIMEIRO ACESSO requer um link de convite do responsável. Isso não equivale a cadastro público autônomo.
- **CONFIRMADO NO CÓDIGO MAIN:** recuperação de senha contém solicitação e redefinição; testes dedicados anteriores preveem validações. Entrega real de e-mail para pessoa real não foi testada.
- **CONFIRMADO NO CÓDIGO MAIN:** testes de plano cobrem Premium ativo, expirado, cancelado com validade até data final, e bloqueio gratuito de TEC/QConcursos.
- **NÃO CONFIRMADO NESTA ETAPA:** onboarding real de visitante, criação automática de plano gratuito após cadastro, navegação autenticada em navegador real, limite diário sob carga; **não** inventar teste manual desses fluxos.
- **CRÍTICO:** a home pública atual funciona como gateway para o estudo/login, sem landing clara antes da autenticação. Evidenciado também pela abertura web do domínio com redirecionamento para central-v119.html.
- **IMPORTANTE:** telas de login não oferecem botão de registro gratuito aberto: usam fluxo de convites. O produto ainda necessita uma decisão de estratégia (autoinscrição protegida ou distribuição controlada de convites).

## B. Hotmart
- **CONFIGURAÇÃO CONFIRMADA NA VERCEL (METADADOS, NÃO VALORES):** existem nomes das variáveis em Production: HOTMART_PRODUCT_ID, HOTMART_OFFER_6M_CODE, HOTMART_OFFER_12M_CODE, HOTMART_HOTTOK (sensitive), HOTMART_LIVE_ENABLED. NÃO foi lido/decriptado nenhum segredo; a mera existência NÃO comprova que o webhook está habilitado, configurado corretamente ou que pagamentos reais sejam processados.
- **DOCUMENTAÇÃO HISTÓRICA DO REPOSITÓRIO:** produto 8805543, relatado em 25/10 como rascunho; havia um outro produto de mesmo nome 8805554 a não confundir. Ofertas relatadas: 6 meses R$97 código o4y1mlg9, 12 meses R$194 código gh4ajvj1. NÃO houve acesso ao painel Hotmart nesta verificação; status e preços atuais NÃO confirmados.
- **CONFIRMADO NO CÓDIGO:** /api/hotmart-webhook roteado por vercel.json, exigência de X-HOTMART-HOTTOK, match de produto/oferta, evento PURCHASE_APPROVED para ativar, possibilidade de cancelamento/reembolso/chargeback/expiração. Há lógica de idempotência no SQL (central_hotmart_apply_event e pedidos), mas ela não foi exercida contra Neon real.
- **TESTE SIMULADO APROVADO NA CI NOVA:** testes/hotmart-webhook-unit.mjs executados no job de comercial 4.5, sem conexão à Hotmart nem pagamento. Incluem caminho de ativação por claim, falha de e-mail e validações de eventos. Não implica entrega de e-mail real.
- **TESTE REAL PENDENTE:** configuração e publicação de produto/ofertas dentro da Hotmart; correspondência preço/código; webhook real capturado em histórico; SMTP efetivo; compra real/teste oficial com conciliação financeira autorizado futuramente. Não realizar antes de liberar.
- **PONTO DE DECISÃO:** formato jurídico comercial semestral/anual como acesso por período fixo ou assinatura com renovação automática? Código calcula meses de direito, mas renovação comercial efetiva depende da configuração Hotmart. Não prometer renovação automática sem confirmação.

## C. Página comercial
- **IMPLEMENTAÇÃO NOVA (ISOLADA):** conheca.html com tipografia legível, visual branco/azul-marinho, responsive CSS, benefícios claros, como funciona, comparação Gratuito/Premium, destaque semestral R$97 e anual R$194, FAQ e CTA apenas para login já existente. Não tem checkout, coleta de dados nem formulário, com meta noindex,nofollow.
- Preços são valores de LANÇAMENTO planejados e expressamente dependem de confirmação Hotmart.
- Não prometer aprovação em concurso.
- **PENDENTE:** screenshots de navegador real desktop/mobile; conferir texto/capturas reais da plataforma; considerar futuro domínio próprio. Não vincular página isolada como home antes da autorização e homologação.

## D. Documentos e atendimento
- **REVISÃO DO REPOSITÓRIO:** arquivos públicos da raiz incluem login.html, recuperar-senha.html e planos.html (este último é painel ADMINISTRATIVO, não página pública de preços!). Não foram identificadas páginas públicas inequívocas de termos de uso, política de privacidade, política de reembolso ou identificação do fornecedor na raiz listada.
- **CRÍTICO:** validar disponibilização adequada de termos, política de privacidade, fornecedor/contato e condições de contratação ANTES de ativar um checkout. Não inventar CNPJ, endereço, política, garantia ou canal de suporte.
- **ATENDIMENTO:** respostas-base abaixo; regras de reembolso específicas ainda precisam ser fornecidas pelo responsável e confrontadas com a Hotmart e legislação.
- Resposta sobre Gratuito: acesso a recursos gratuitos, com até 20 questões diárias no Lei em Dia; TEC/QC exclusivos Premium.
- Resposta sobre Premium: materiais/ferramentas de acesso conforme catálogo; semestral de lançamento R$97/6 meses e anual de lançamento R$194/12 meses, condicionados à validação na Hotmart.
- Resposta sobre acesso: hoje o primeiro acesso comum depende de convite; recuperação pela tela /recuperar-senha.html.
- Resposta sobre cancelamento: regras exatas do checkout/política devem ser apresentadas antes de contratação. A regra técnica de cancelamento preserva acesso até término contratado em determinadas modalidades. Não garantir operacionalmente antes de testar.
- Resposta sobre suporte: canal comercial ainda não foi confirmado; não oferecer número de WhatsApp inexistente.

## E. Registro de problemas e prioridade
1. **CRÍTICO:** backup real recuperável da Etapa 4.4 pendente. Bloqueio já conhecido, não interferido.
2. **CRÍTICO:** inexistência de comprovação de jornada paga Hotmart ponta a ponta em ambiente real; preços/status do produto não foram reconfirmados.
3. **CRÍTICO:** documentos públicos essenciais e identificação do fornecedor não confirmados.
4. **IMPORTANTE:** cadastro público gratuito não disponível na tela login; requer convite.
5. **IMPORTANTE:** site inicial não explica a plataforma ao visitante; landing isolada preparada.
6. **IMPORTANTE:** e-mail real de primeiro acesso e recuperação e fluxo de assistência ao comprador ainda não testados externamente.
7. **MELHORIA:** fotos/capturas reais da plataforma, SEO, domínio próprio, analytics privativo, explicações simples por disciplina, FAQ expandido.

## F. Alterações e testes
- Main de partida 9ef6ec22974b2a90090a7ec1ae6d61f6cb621d57.
- Branch EXCLUSIVA: commercial/etapa-4-5-20261027 (criada exatamente da main).
- Arquivo adicionado: conheca.html.
- Teste adicionado: tests/commercial-journey-4-5-unit.mjs.
- CI dedicada adicionada: .github/workflows/etapa-4-5-commercial-validation.yml.
- CI GitHub Actions run 40557063116: **SUCESSO**. Executou somente testes/commercial-journey-4-5-unit.mjs, tests/hotmart-webhook-unit.mjs, tests/plan-access-unit.mjs, tests/password-reset-unit.mjs.
- Não foi criada Preview manual nem confirmada isolação do banco da Preview para esta branch; não anunciar link de Preview enquanto não for verificado o isolamento.
- Nenhuma mudança nos scripts da Etapa 4.4, em Neon, Vercel Production ou main.

## G. Checklist de publicação
- [x] Código de login, recuperação de senha, planos, regras Hotmart e proteção Premium presentes.
- [x] Simulações dirigidas da jornada comercial no GitHub Actions aprovadas (sem dinheiro real).
- [x] Página de apresentação revisável preparada em branch isolada.
- [ ] Concluir backup real recuperável (Etapa 4.4).
- [ ] Confirmar na Hotmart o produto correto, status, oferta 6 meses R$97, oferta 12 meses R$194, links e natureza renovável ou por prazo fixo.
- [ ] Confirmar sem revelar segredos valores e escopos relevantes das variáveis Production, domínio e SMTP; aprovar procedimentos comerciais reais.
- [ ] Decidir e implementar cadastro gratuito sem convite, ou definir estratégia documentada de convites; testar navegador real em ambiente isolado.
- [ ] Produzir/revisar termos, privacidade, política de cancelamento/reembolso, fornecedor e contato.
- [ ] Executar fluxo de compra em sandbox oficial / ambiente de testes com entrega e conciliação, depois teste real SOMENTE COM NOVA AUTORIZAÇÃO.
- [ ] Verificar Preview isolada e telas em telefone e computador antes de qualquer publicação.
- [ ] Definir suporte comercial real e como tratar compras sem e-mail entregue.
- [ ] Autorizar expressamente merge/publicação controlada após aprovação de todos os portões.
- [ ] Após lançamento: domínio próprio, imagens reais, SEO e melhorias de marketing.

## Resumo para o proprietário
Sua Central tem grande parte do funcionamento interno implementado e testes de simulação bem-sucedidos. Mas o visitante que chega hoje pode não entender imediatamente a proposta e não encontra autoinscrição gratuita; o comprador ainda não tem um fluxo comercial real validado. Preparei uma apresentação comercial, sem liberar compras ou fazer alterações no site oficial. Para vender com segurança, primeiro são indispensáveis backup real, confirmação da Hotmart, política/contato e jornada de cadastro e ativação comprovada. Recursos cosméticos e otimizações de marketing podem esperar.
