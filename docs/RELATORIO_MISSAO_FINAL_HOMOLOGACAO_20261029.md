# Base Completa — missão final de homologação e lançamento

Estado: **NÃO LIBERADO PARA VENDER**. Relatório de 29/10/2026 (Fortaleza).

## Prioridade: incidente de restauração Neon

Durante esta execução, foi usado `restore_snapshot` com `finalize:true` e sem `target_branch_id`. A intenção era testar a recuperação em uma nova branch. A finalização também moveu o endpoint produtivo e o vínculo Vercel da branch original para a cópia do snapshot. **Foi um erro de execução; não é correto afirmar que a produção permaneceu intocada.** Não houve merge em `main` nem publicação de uma nova versão do site em Production.

- Projeto: `shiny-hall-19564809`.
- Original preservada: `br-blue-sunset-b7jcts9i`, novamente chamada `main`, `default=true`.
- Cópia do snapshot: `br-shy-sound-b754sfmz`, chamada `test/restore-lancamento-20261028`.
- Endpoint produtivo estável: `ep-curly-haze-b7ea2u0n`, ainda ligado à cópia do snapshot no último estado observado.
- Compute adicional: `ep-calm-wind-b70hjyc6`, devolvido à branch original após cancelamento da tentativa de recuperação.
- Espelho de recuperação preservado, sem compute: `br-dry-fire-b74n3v8s`, `recovery/endpoint-parking-20261029`.

### Preservação e reconciliação executadas

A comparação das 16 tabelas públicas encontrou diferenças somente em `central_users`, `central_user_preferences`, `central_user_sync_state` e `central_user_progress_summary`. Os dados originais não foram apagados. As identidades, hashes de senha e versões de sessão das seis contas eram iguais entre original e cópia; as diferenças de autenticação eram horários de acesso.

O progresso escrito depois do redirecionamento foi recuperado para a original, com atualização condicional por `updated_at`:

- Estado de sincronização mais recente: 28 chaves; todas as 21 chaves anteriores estavam presentes.
- Sete chaves adicionais preservadas; três valores de navegação/atividade atualizados.
- Resumo de estudo mais recente preservado, incluindo 660 segundos registrados.
- Preferência atual preservada sem eliminar a preferência adicional que existia somente na original.
- Horário de login mais recente reconciliado, mantendo credenciais e versões de sessão.

O espelho auxiliar foi atualizado com esses mesmos registros. Uma comparação de contagens e checksums de todas as 16 tabelas confirmou identidade com a original reconciliada. Nenhuma tabela, conta ou branch foi excluída. Original, cópia e espelho permanecem preservados.

### Recuperação ainda bloqueada

A API Neon impede mover o endpoint da branch vinculada à produção Vercel. O proprietário autenticou o painel Neon por fluxo seguro. Foi preparada a troca temporária da configuração de produção para o espelho verificado, para permitir devolver o endpoint estável à original e então restabelecer a seleção `main`.

A revisão automática rejeitou essa troca por considerá-la uma alteração consequente de produção por uma branch temporária, inicialmente por risco de gravações recentes e depois por exigir autorização específica para esse caminho. A alteração bloqueada **não foi confirmada**, nem executada por API ou outro contorno. O compute adicional foi devolvido à original. O painel continua mostrando a cópia do snapshot como Production branch.

**É necessária autorização específica antes de prosseguir com esse procedimento.** Revalidar gravações recentes e espelhos imediatamente antes da troca. O movimento do compute pode reiniciar conexões e causar breve indisponibilidade. Não publicar novos deploys nem permitir lançamento comercial enquanto o vínculo não estiver corrigido e verificado.

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

Em andamento nesta atualização. Usa a identidade exata de branch antes de qualquer gravação, contas sintéticas únicas e captura de e-mail sem envio externo. Não constitui validação de Turnstile, SMTP externo ou UI hospedada. O resultado final será acrescentado antes de encerrar a etapa.

## Backup, rollback e próximos critérios

Snapshot disponível: `snap-red-lake-b7ytcuk2`, criado em 28/10/2026, com expiração em 04/11/2026 às 23:59:59Z. A recuperação dos dados foi comprovada; **a forma usada não foi um ensaio seguro**, pois a finalização mudou a produção. Novos testes de snapshot devem usar explicitamente `finalize:false`; nunca finalizar um ensaio de restauração produtiva.

Antes de lançamento:

1. Autorizar e concluir a correção do vínculo/endpoint Neon, revalidando dados atuais e origens da Vercel.
2. Publicar a versão exata da integração em Preview quando houver quota e revalidar o isolamento.
3. Configurar Turnstile e SMTP TEST; concluir cadastro, confirmação, recuperação, sessão e revogação de consentimentos reais.
4. Autenticar a Hotmart e conferir ofertas únicas de R$97/R$194, eventos e webhook atual.
5. Finalizar identificação/documentos legais e endereço público funcional.
6. Repetir E2E hospedado desktop/celular, com quotas, compra sintética, reversão e progresso.
7. Só então preparar migrations e rollout produtivo com rollback e backup atual.

Não há autorização técnica para declarar **PRONTO PARA VENDER** neste estado.
