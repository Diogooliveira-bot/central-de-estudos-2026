# Base Completa — Lançamento simples (única lista GO/NO-GO)

**Atualização:** 29/10/2026 — horário de Fortaleza.\n\n**Verificação de atendimento:** proprietário confirmou em 29/10/2026 que o e-mail enviado de outra conta chegou à caixa de entrada oficial; isso testa recebimento, não resposta automática.\n\n**CI última alteração funcional (`d5714e9`):** 6/6 GitHub Actions concluídos com sucesso; implantação Preview READY.  
**Responsável pelo código:** PR [#187](https://github.com/Diogooliveira-bot/central-de-estudos-2026/pull/187).  
**Regra:** não refazer auditorias aprovadas; retestar exclusivamente as alterações e os fluxos críticos que ainda não tiveram prova hospedada. Os relatórios históricos permanecem disponíveis como evidência.

## Objetivo: apenas DUAS entregas

**Entrega A — vitrine informativa, sem venda nem cadastro aberto:** já existe deployment **Production READY** do projeto de vitrine Vercel; manter checkout fechado e não prometer funcionamento de cadastro. Se desejar acesso pelo domínio próprio, corrigir DNS. A vitrine atual tem `noindex`; alterar isso somente após aprovar transparência comercial e políticas. Não fazer merge da Central por causa da vitrine.

**Entrega B — abertura comercial da Central:** publicar a PR #187 na Production **somente** depois dos quatro gates indispensáveis abaixo. Abrir cadastro e pagamento depois de confirmar o funcionamento do deployment final; rollback previsto.

## Quatro gates indispensáveis (e apenas eles)

| Gate | Definição objetiva de aprovação | Situação em 29/10 |
| --- | --- | --- |
| **1 — Legal + atendimento** | Dados do fornecedor e canal de suporte efetivos e adequados; Termos, Privacidade e Cookies finais publicados; aceite versionado (sem `draft`); fluxo de reembolso/arrependimento e contato verificável. Dados pessoais e segredos não vão para GitHub. | **PARCIAL**: e-mail oficial `basecompleta.estudos@gmail.com` **confirmado e recebimento verificado por relato do proprietário em 29/10/2026 (teste de outra conta)**; falta validar confirmação imediata de recebimento/rotina de atendimento, identificação legal e versão final dos Termos (`v24-draft-2026-10-28`). |
| **2 — Cadastro + acesso real** | Uma jornada hospedada com conta fictícia na Preview: cadastro, confirmação de e-mail, login, recuperação, sessão, Gratuito (Lei em Dia 20/dia, 21ª bloqueada, sem TEC/QC), Premium (recursos corretos), expiração/revogação com progresso preservado e bloqueio de acesso admin indevido. Testar em desktop e celular com o mesmo SHA final. | **PARCIAL**: código, Neon TEST e navegador simulado já testados; prova final hospedada no mesmo SHA pendente. |
| **3 — Hotmart + pagamento** | Ofertas de 6 meses R$97 e 12 meses R$179 com duração, compra única e parcelamento claros. Webhook apontando para uma **URL estável do deployment produtivo**, com credencial correta e eventos de aprovação, reembolso, chargeback e expiração; verificar evento oficial de teste sem compra real e concessão/revogação apropriadas. | **PENDENTE**: última inspeção mostra webhook em Preview antiga e eventos incompletos. [Issue #193](https://github.com/Diogooliveira-bot/central-de-estudos-2026/issues/193). |
| **4 — Recuperação + virada** | Backup externo recente **restaurável** e ensaio isolado de recuperação, ou proteção equivalente comprovada; banco TEST/Production isolados; 6 workflows CI verdes no HEAD final, Preview READY, URL estável válida, smoke e rollback documentados; promoção controlada para Production só quando os anteriores estiverem aprovados. | **PARCIAL**: CI 6/6, Preview READY e backup por branch interna; **backup externo e ensaio completo pendentes**. |

### Situação já aproveitável — não repetir sem regressão

- 6 workflows do SHA `2f13e6044b64a3df9a0c39c5cca96a451eecb0ca`: **success**.
- Preview deste SHA: **READY**, Production do aplicativo ainda permanece em `main` na versão `53eb8b2`.
- Neon TEST `br-sweet-waterfall-b7ry8jlw`: testes anteriores de aprovação Premium, renovação manual, reembolso, chargeback e expiração; sessão, idempotência, quota 20/21ª e progresso preservado. São evidências de teste integrado, **não** substituem Hotmart Live nem navegador hospedado.
- Banco de produção: permissões Free/Premium verificadas por leitura, sem alteração.
- Os dois domínios `basecompleta.com.br` e `app.basecompleta.com.br` estão **associados e verificados na Vercel**, mas **DNS misconfigured** em 29/10. DNS é **adiável** se for escolhida e validada uma URL pública estável `*.vercel.app`; não utilizar a Preview antiga como webhook.
- Vitrine em projeto separado Vercel com Production READY; não exigir publicação simultânea do site e do aplicativo.

### Mínimas ações fora do ChatGPT

1. **Titularidade e suporte:** e-mail oficial confirmado: `basecompleta.estudos@gmail.com` (não pedir novamente). Recebimento de mensagem de outra conta confirmado pelo proprietário. **O proprietário confirmou em 29/10/2026 que acompanhará o e-mail diariamente e responderá às solicitações dos alunos.** Falta validar confirmação imediata de recebimento e fornecer/validar dados legais em canal seguro. Nunca colar CPF/endereço/senhas em issue pública.
2. **Hotmart:** confirmar sessão autenticada e configurar **um** webhook correto com os eventos comerciais necessários; confirmar descrição e parcelamento das duas ofertas. Sem sessão, ninguém deve marcar esse gate como concluído.
3. **DNS (opcional para o primeiro lançamento):** se usar domínio próprio imediatamente, criar/ajustar no provedor DNS o A do domínio raiz para `76.76.21.21` e o CNAME `app` para `cname.vercel-dns.com.` conforme recomendações atuais da Vercel, retirando conflitos; aguardar confirmação técnica. Não comprar domínio novo nem mexer no DNS sem acesso apropriado.

### O que pode ficar para depois — sem bloquear o MVP

WhatsApp e automações comerciais, Informática, novos módulos, acabamento visual residual que não afete usabilidade, novas campanhas, auditorias editoriais integrais já fora do escopo do lançamento, domínio próprio se for usada URL Vercel estável. **Exceção:** erro material ou informação jurídica incorreta identificada em conteúdo publicado deve ser corrigido ou retirado antes da exposição.

## Procedimento de publicação, uma única passagem

1. Preencher a tabela acima com evidências e **GO** para os quatro gates (sem criar novos documentos/checkpoints).
2. Executar CI e testes hospedados do HEAD final da PR #187; registrar links e resultados aqui.
3. Fazer merge controlado na `main` e acompanhar deployment de Production; verificar que `DATABASE_URL`, `AUTH_SECRET`, serviços de e-mail e webhook estão no ambiente correto **sem revelar valores**.
4. Smoke em Production: cadastro, login, Free, Premium, acesso admin, status do webhook, progresso, suporte e recuperação; só então habilitar CTA/checkout, respeitando as regras legais. Se falhar, manter checkout fechado e executar rollback do código (dados exigem procedimento próprio).

**Decisão vigente:** **NO-GO para cadastro público e vendas**, mas **GO para manter a vitrine informativa já hospedada** com cobrança e cadastro fechados.  
Não confundir site READY, teste simulado ou autorização genérica com homologação comercial. 

## Evidências históricas (não duplicar auditoria)

- [Relatório final do lançamento](RELATORIO_FINAL_LANCAMENTO_BASE_COMPLETA.md).
- [Gate legal/aceites](GATE_PUBLICACAO_LEGAL_E_ACEITES_20261029.md).
- [Homologação técnica](RELATORIO_HOMOLOGACAO_TECNICA_FINAL_BASE_COMPLETA.md).
- [Pendência Hotmart](https://github.com/Diogooliveira-bot/central-de-estudos-2026/issues/193).
