# Base Completa — Etapa 10.4.5 | Correção do bootstrap Gratuito e integração CPC

**Data:** 28/10/2026  
**Escopo:** somente branch `preview/legal-complete-premium-v1-20261025`. Prévia privada alvo `base-completa-teste-visual`, não Production. **Status: código aprovado, publicação privada aguardando autorização; E2E real atualizado pendente.**

## 1. Falha real constatada em Chromium local

Os primeiros ensaios em contas reais de homologação demonstraram `authenticated:true` para Gratuito e Premium e direitos do banco corretos. O Gratuito não conseguia concluir a inicialização, e o Premium era confundido pela mudança intencional de rota `/central-v119.html` → `/`.

A navegação correta é **Disciplinas → Direito Processual Civil → M05**. Existe um modal obrigatório para escolha de objetivo no primeiro acesso; ele deve ser concluído antes do menu.

Em Chromium com fonte integral e sessões simuladas, quando os arquivos de baterias Premium foram excluídos para o Gratuito, o `central-structural-v66119/runtime.js` ainda consultava as variáveis legadas `CF_QUESTIONS`, `PENAL_QUESTIONS` e `CPC_QUESTIONS`, ocasionando falha de inicialização/erros de renderização.

## 2. Alterações seguras

- `central-v119.html`: só no bootstrap de plano **Gratuito** (confirmado pela API de planos), inicializa `CF_QUESTIONS`, `PENAL_QUESTIONS` e `CPC_QUESTIONS` como **arrays vazios** se não existirem. Nunca baixa ou injeta enunciados Premium. O plano Premium mantém os bancos autorizados.
- O carregador `central-discipline-loader.js`, corrigido em commit anterior, só tolera um eventual `403` para o recurso específico `/content/cpc/cpc-fixation-questions-v1.js` depois de confirmar no servidor o plano Gratuito e `premium.reviews=false`. Nenhum outro `403`/erro de rede/500 é ignorado.
- `tests/etapa10-4-free-bootstrap-unit.mjs`: protege os três arrays vazios e a separação dos scripts Premium.
- `tests/etapa10-4-cpc-home-flow-browser.mjs`: novo Chromium de fluxo completo na Central em dois perfis simulados (Gratuito e Premium), concluindo escolha de estudo livre, Disciplinas e abertura de CPC. O Gratuito não requisita automaticamente a bateria paga; uma requisição HTTP **simulada em localhost** retorna `403`.
- Nenhum conteúdo jurídico original, texto, indexação, ID, progressos persistidos, banco ou checkout foi alterado.

## 3. Verificação automatizada

[GitHub Actions 40740525439](https://github.com/Diogooliveira-bot/central-de-estudos-2026/actions/runs/40740525439): **completed/success**, commit exato de código `7584a48e72c94a3650ca5fb021c3cbfc4412517d`.

| Teste | Resultado | Local |
|---|---|---|
| Auditoria CPC M01–M20 em Chromium | **60/60** | Localhost, 390/768/1366 |
| Navegação Central → CPC M05 → marcação → reabertura | **3/3**; persistência local confirmada | Localhost, 390/768/1366 |
| Bootstrap completo e abertura CPC, Gratuito/Premium | **2/2**, ambos carregaram | Localhost |
| Gratuito: tentativa direta de banco de questões pago | **HTTP 403** no mock de servidor; sem download automático do banco | Localhost |
| Unidades autenticação, direitos Premium e bootstrap Free | **Sucesso** | Fixtures sem Neon |
| Evidências capturas/JSON | [artefato 12838069616](https://github.com/Diogooliveira-bot/central-de-estudos-2026/actions/runs/40740525439/artifacts/12838069616) | Retenção prevista até 11/11/2026 |

**Ressalva:** a fixture Free ainda registra `Unexpected end of JSON input` em evento JS não fatal, sem bloquear bootstrap/CPC; pode decorrer de simulação incompleta de endpoints. Não foi diagnosticado como erro da Preview real. A única resposta 403 incluída em capturas veio do **servidor falso do teste**, não do endpoint do Vercel.

## 4. Publicação privada controlada

- Workflow `.github/workflows/deploy-private-visual-preview.yml` foi repinado para **`7584a48e72c94a3650ca5fb021c3cbfc4412517d`** com checkout imutável, verificações de segurança e testes antes de executar `vercel deploy` sem `--prod`.
- [Execução de deploy 40740988534](https://github.com/Diogooliveira-bot/central-de-estudos-2026/actions/runs/40740988534) está em **waiting** para aprovação de `bc-preview-private`. **Não contornar a aprovação obrigatória**.
- A última Preview READY verificada ainda é `dpl_H3XSoKBuzMh1wZrTe5PoAhstRJjn` no código antigo `f5dc763b...`, sem as correções Gratuito.
- Após o revisor aprovar, exigir READY com commit `7584a48e...` antes de autenticar os perfis reais de homologação, validar 403 em URL paga, abrir M05 Premium, reabrir leitura e confirmar progresso no próprio deployment.

**Não atestar Etapa 10.4 completamente encerrada** até os ensaios autenticados na nova Preview. O saldo insuficiente do navegador automatizado externo impede executar esse E2E no chat até reconectar um navegador disponível; GitHub e Vercel não disponibilizam as senhas sensíveis de forma recuperável. Sem produção, `main` ou Neon real modificados.
