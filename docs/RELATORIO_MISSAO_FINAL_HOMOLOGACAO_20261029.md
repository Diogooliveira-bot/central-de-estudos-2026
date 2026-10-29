# Base Completa — missão final de homologação e lançamento

Estado: **NÃO LIBERADO PARA VENDER**. Relatório de 29/10/2026 (Fortaleza).

## Incidente de restauração Neon — corrigido

Durante esta execução, foi usado `restore_snapshot` com `finalize:true` e sem `target_branch_id`. A intenção era testar a recuperação em uma nova branch. A finalização também moveu o endpoint produtivo e o vínculo Vercel da branch original para a cópia do snapshot. **Foi um erro de execução; não é correto afirmar que a produção permaneceu intocada.** Não houve merge em `main` nem publicação de uma nova versão do site em Production por esta execução.

O proprietário autorizou expressamente em 29/10/2026 o procedimento de recuperação com troca temporária para o espelho verificado. A correção foi concluída e verificada aproximadamente às **07h29 de Fortaleza (10h29Z)**.

| Recurso | Estado final confirmado |
|---|---|
| Projeto Neon | `shiny-hall-19564809` |
| Banco original | `br-blue-sunset-b7jcts9i`, nome `main`, default=true |
| Vínculo Neon → Vercel Production branch | `main` original |
| Endpoint estável original | `ep-curly-haze-b7ea2u0n`, devolvido à `main` |
| Cópia do snapshot preservada | `br-shy-sound-b754sfmz`, `test/restore-lancamento-20261028` |
| Compute adicional | `ep-calm-wind-b70hjyc6`, ligado à cópia do snapshot |
| Espelho de recuperação preservado | `br-dry-fire-b74n3v8s`, `recovery/endpoint-parking-20261029`, sem compute |

### Preservação, reconciliação e verificações

A comparação das 16 tabelas públicas encontrou diferenças somente em `central_users`, `central_user_preferences`, `central_user_sync_state` e `central_user_progress_summary`. Os dados originais não foram apagados. As identidades, hashes de senha e versões de sessão das seis contas eram iguais entre original e cópia; as diferenças de autenticação eram horários de acesso.

O progresso escrito depois do redirecionamento foi recuperado para a original, com atualização condicional por `updated_at`:

- Estado de sincronização e resumo de estudo mais recentes preservados.
- Todas as 21 chaves anteriores estavam presentes no primeiro estado reconciliado, além de sete chaves adicionais; navegação/atividade atuais foram mantidas.
- Preferência atual preservada sem eliminar a preferência adicional que existia somente na original.
- Horários de login reconciliados pelo mais recente, mantendo credenciais e versões de sessão.
- Antes da troca autorizada, foram encontradas novas gravações: sincronização às 10:09:17Z, resumo às 10:24:27Z e login às 10:07:18Z. Esses registros também foram incorporados à original e ao espelho.

A cópia e a original foram relidas após a troca: não restavam gravações mais recentes na cópia a incorporar. As diferenças restantes entre as duas eram somente a preferência adicional original e um horário de login mais recente preservado na original.

**Evidências finais:**

- Contagens e checksums das 16 tabelas da original reconciliada e do espelho eram idênticos antes da troca e permaneceram idênticos na verificação posterior às 10:28Z.
- Consulta SQL dirigida explicitamente ao endpoint `ep-curly-haze-b7ea2u0n` retornou `neon.branch_id=br-blue-sunset-b7jcts9i`, banco `neondb`, às 10:28:04Z.
- Checksum das seis identidades completas, excluindo apenas horários de atualização/login, coincidiu entre original e cópia, incluindo hashes de senha e versões de sessão.
- Painel Neon mostrou `main` como Production branch, com Save desabilitado; a API confirmou as restrições de branch produtiva na original.
- API de endpoints confirmou o endpoint estável na original e o adicional na cópia.
- O alias antigo `central-de-estudos-ecru.vercel.app` continuou no mesmo deployment `dpl_CRNXhAJdzN2pD9dGAjShtX3Z1SW1`, commit `26739f95be0aa2faf87336bc76e5dc279165ffa2`.
- Consulta HTTP ao alias antigo retornou 200 para o status de cadastro, ainda `enabled:false` e `siteKey:null`. Não foi realizado login com conta real de aluno nesta etapa.

Nenhuma tabela, conta ou branch foi excluída. Original, cópia e espelho permanecem preservados. A troca de compute pode interromper conexões brevemente; não foi medida a duração de eventual interrupção.

### Procedimento e revisão automática

A revisão automática havia rejeitado duas tentativas anteriores por exigir autorização específica para a troca temporária e por risco de gravações recentes. Essas alterações bloqueadas não foram executadas nem contornadas.

Após a autorização expressa do proprietário, foram executadas, em sequência: reconciliação e verificação; vínculo temporário com o espelho; devolução do endpoint estável à original; restabelecimento do vínculo definitivo com `main`; devolução do compute adicional à cópia; verificação final de dados e mapeamentos. Nenhum novo deploy Production foi solicitado para essa correção.

O incidente de mapeamento está **resolvido**. Isso não libera o lançamento comercial: continuam pendentes os demais critérios de homologação descritos neste relatório.

## Código e integração

Repositório: https://github.com/Diogooliveira-bot/central-de-estudos-2026

PR principal, aberto em draft: https://github.com/Diogooliveira-bot/central-de-estudos-2026/pull/187

Branch: `integration/lancamento-base-completa-20261028`.

- Base inspecionada: `649c3061e79284fa3b2d81aa21f263c2fbe02520`.
- Correção do teste SMTP e ampliação dos gates: `d8cd9f68d90ba459a615ec708e5725eb6d5dfe79`.
- Integração da página comercial V24: `f1dd2b8926123eb564e62d840f4fcd6d0e79b4cd`.
- Foram preservadas alterações concorrentes: acesso público aos três documentos legais, commit `1e176110f5646b30c8f3802606fc029f1c8e8533`, e proteção de isolamento da Preview no commit `b7390e9122dd04a5964223d47ffba9eccc9ff05a`.
- PRs #188 e #189 foram inspecionados, ambos fechados, e as implementações correspondentes foram encontradas na integração.

Nenhuma alteração de código foi mesclada em `main` nesta execução.

## Previews e publicação

| Commit | Deployment | Estado verificado |
|---|---|---|
| `649c3061` | `dpl_7PpZjhU4YkJV8Z2rnPQ2YfEy38V4` | READY |
| `d8cd9f68` | `dpl_HDviBvGM23fg72DjC19Ye7NL2Z9o` | READY |

Preview com login/API verificados: https://central-de-estudos-1t7i61p59-estudotd.vercel.app/

O deployment da V24 atualizada foi recusado pela Vercel: HTTP 402, `api-deployments-free-per-day`, mais de 100 implantações diárias; retry informado de 24 horas. Não houve contratação de plano ou tentativa de contornar o limite. A V24 está integrada e testada no GitHub, mas **não foi homologada em uma nova Preview hospedada**.

O alias antigo `central-de-estudos-ecru.vercel.app` foi inspecionado e ainda apontava para `dpl_CRNXhAJdzN2pD9dGAjShtX3Z1SW1`, commit `26739f95be0aa2faf87336bc76e5dc279165ffa2`. Ele não foi movido, preservando o endereço antigo usado pela Hotmart.

## Isolamento da homologação

- Neon TEST: `br-sweet-waterfall-b7ry8jlw`, `test/codex-lancamento-20261028`.
- Compute TEST: `ep-royal-wind-b7kya942`.
- `DATABASE_URL` específica da branch de integração foi mantida; não foi substituída.
- Foram adicionados segredo de sessão e chave de cifragem independentes, somente para essa branch Preview.
- Um usuário sintético foi criado somente em TEST. O login HTTP na Preview retornou 200; sessão e plano Gratuito foram consultados com sucesso.
- A consulta ao Neon confirmou `neon.branch_id=br-sweet-waterfall-b7ry8jlw` e o horário desse login gravado na conta sintética. Esta é evidência de runtime, além da simples presença da variável.
- TEC/QConcursos retornaram scripts bloqueados, sem links externos, para o Gratuito; sincronização Premium retornou 403.

Uma tentativa posterior de testar 21 questões por HTTP recebeu 401 da **proteção Vercel**, antes da aplicação. Ela não valida nem reprova a quota da aplicação. Não foi reportada como E2E aprovado. O teste integrado adicional com o banco TEST está registrado separadamente abaixo.

## Cadastro gratuito e e-mails

O cadastro público continua desativado. A Preview retornou `enabled:false` e `siteKey:null`. Não anunciar cadastro disponível nem ativar flags produtivas.

Foi corrigido um erro comprovado no teste SMTP: o fixture não enviava a maioridade e o aceite versionado dos Termos, agora obrigatórios. O teste passou a enviar os mesmos aceites exigidos pela aplicação.

Validações aprovadas em CI:

- Formulário, aceites obrigatórios, WhatsApp opcional e consentimentos separados.
- Confirmação de e-mail com token de uso único, conta Gratuita e tentativa de reutilização bloqueada, em banco simulado com transporte SMTP local Mailpit.
- Mensagem de recuperação recebida pelo SMTP local de captura.
- Preferências de e-mail e WhatsApp independentes no Chromium.
- Tela de recuperação e login com APIs simuladas.
- Templates e gates de avisos de vencimento em testes automatizados.

O Gmail `basecompleta.estudos@gmail.com` e a senha de app existem em Production, mas não foi encontrada configuração SMTP equivalente na Preview de integração. Credenciais produtivas não foram copiadas nem expostas. Não foram enviados e-mails externos de teste ou mensagens comerciais. Avisos produtivos não foram ativados nesta execução.

Faltam: serviço transacional real em homologação, Turnstile real, cadastro/recuperação completos na Preview com e-mail recebido e documentos legais finais.

## Hotmart

Configuração Production consultada, sem alteração:

- `HOTMART_LIVE_ENABLED=true`.
- Produto `8805543`.
- Oferta semestral configurada: `o4y1mlg9`.
- Oferta anual configurada: `gh4ajvj1`.

A variável Live da Preview permanece desativada. Foram preparadas variáveis branch-scoped de receptor e ofertas **sintéticas**, com segredo exclusivo, para a próxima Preview da integração; essas variáveis não habilitam cobranças reais.

Os testes automatizados cobrem autenticação do webhook, idempotência, rejeição de eventos recorrentes, ativação, renovação manual e reversões. A Hotmart abriu tela de login, sem sessão autenticada. Portanto, **não foram confirmados no painel** os preços, o pagamento único das duas ofertas, a ausência de recorrência e a URL real do webhook. Não houve compra paga, estorno financeiro real ou alteração do alias/webhook.

## Site V24 e documentos legais

Foi recuperado o arquivo aprovado `base-completa-v24-apresentacao.html` e integrado a `conheca.html`, mantendo imagens, identidade, estrutura e demonstrações interativas.

Correções técnicas:

- Links de cadastro/login usam o próprio ambiente, removendo dependência do domínio futuro e do alias antigo.
- Disponibilidade do cadastro é consultada na API; indisponibilidade abre o aviso de homologação, sem prometer cadastro liberado.
- Plano Gratuito, preços de R$97/6 meses e R$194/12 meses e contratação manual permanecem apresentados.
- Checkout permanece bloqueado até homologação comercial.
- Links para Termos, Privacidade, Cookies e recuperação estão presentes.
- Chromium validou 1366×768, 768×1024 e 390×844, sem overflow horizontal, e gerou seis capturas.

Os três documentos continuam como minutas de pré-lançamento. Não foram inventados CPF/CNPJ, endereço ou outros dados ausentes. Falta a identificação comercial exigível e a conclusão da revisão com os serviços realmente ativos.

## Domínios

`basecompleta.com.br` e `app.basecompleta.com.br`: consulta Vercel retornou DNS externo no Registro.br, sem A/CNAME e `misconfigured=true`. A associação verificada na Vercel não prova funcionamento de DNS ou HTTPS.

O repositório registra que o domínio ainda não havia sido adquirido. Nenhum domínio foi comprado, nenhuma titularidade alterada e nenhum DNS externo foi editado. Os endereços Vercel continuam necessários para a homologação.

## Testes e evidências

- Suíte geral local: 177 aprovados, 0 falhas, 1 ignorado.
- Suíte comercial/autenticação/URLs/avisos local: 77 aprovados, 0 falhas.
- Proteção de conteúdo Premium: 27 aprovados, 0 falhas.
- Verificações locais após V24/acesso legal: 35 aprovados, 0 falhas.
- Build estático local concluído; materiais protegidos fora da árvore estática pública.

Execução CI inicial corrigida: https://github.com/Diogooliveira-bot/central-de-estudos-2026/actions/runs/40806319550

CI V24 com SMTP local e Chromium desktop/tablet/celular: https://github.com/Diogooliveira-bot/central-de-estudos-2026/actions/runs/40807062431

Os sete workflows encontrados para o commit `f1dd2b89` terminaram com sucesso. As capturas estão no artefato `launch-commercial-browser` dessa execução, ID `12868318829`, retenção até 12/11/2026.

### Teste integrado adicional: handlers + Neon TEST

Teste opt-in concluído com código de saída 0 em 29/10/2026. A identidade `br-sweet-waterfall-b7ry8jlw` é conferida antes de qualquer gravação. Contas sintéticas únicas foram usadas e a conta criada pelo teste foi desativada ao término. E-mails foram capturados em memória, sem envio externo.

Resultados aprovados com banco real de TESTE:

- Cadastro, aceites legais versionados, WhatsApp omitido, confirmação e token reutilizado bloqueado.
- Sessão real, plano Gratuito, bloqueios TEC/QC e revogação independente do consentimento de e-mail.
- Quota concorrente: 20 solicitações permitidas e a 21ª bloqueada.
- Webhook com segredo inválido rejeitado; eventos recorrentes incompatíveis rejeitados.
- Ativação Premium, idempotência e renovação manual por nova transação.
- Progresso armazenado e recuperado.
- Estornos, chargebacks e vencimento retornam ao Gratuito; progresso permanece armazenado.
- Reaprovação de transação estornada não restaura Premium.

Isso valida handlers + SQL real em TESTE; não constitui E2E de UI hospedada, Cloudflare ou SMTP externo. O harness teve uma correção de comparação de datas retornadas pelo driver antes de completar a execução; nenhum teste foi desativado.

Código reutilizável: `tests/launch-neon-integration.mjs`, commit `fe431f4209d93d09b27116b08ec811c61a9117ba`.

## Backup, rollback e próximos critérios

Snapshot disponível: `snap-red-lake-b7ytcuk2`, criado em 28/10/2026, com expiração em 04/11/2026 às 23:59:59Z. A recuperação dos dados foi comprovada; **a forma usada não foi um ensaio seguro**, pois a finalização mudou a produção. Novos testes de snapshot devem usar explicitamente `finalize:false`; nunca finalizar um ensaio de restauração produtiva.

Antes de lançamento:

1. **Concluído em 29/10 às 07h29:** corrigir o vínculo/endpoint Neon e verificar dados reconciliados e endpoint original. Manter os recursos de recuperação preservados.
2. Publicar a versão exata da integração em Preview quando houver quota e revalidar o isolamento.
3. Configurar Turnstile e SMTP TEST; concluir cadastro, confirmação, recuperação, sessão e revogação de consentimentos reais.
4. Autenticar a Hotmart e conferir ofertas únicas de R$97/R$194, eventos e webhook atual.
5. Finalizar identificação/documentos legais e endereço público funcional.
6. Repetir E2E hospedado desktop/celular, com quotas, compra sintética, reversão e progresso.
7. Só então preparar migrations e rollout produtivo com rollback e backup atual.

A correção do incidente Neon está concluída. Os demais gates ainda impedem declarar **PRONTO PARA VENDER**.
