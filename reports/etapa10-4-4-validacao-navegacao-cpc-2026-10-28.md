# Base Completa — Etapa 10.4.4 | Validação da navegação CPC e progresso no Chromium

**Data:** 28/10/2026  
**Branch:** `preview/legal-complete-premium-v1-20261025`  
**Commit aprovado:** `97d3a51566ae584fc57f7b80d3e7d3f922f43d63`  
**Classificação:** teste integrado em **fixture local autenticado por mock** concluído; homologação de ponta a ponta da Preview com sessão real **ainda não encerrada**.

## 1. Achados dos testes realizados com contas reais de homologação

- Acesso à aplicação confirmado para contas fictícias `free` e `premium` por `/api/auth?action=me`: `authenticated:true`, `role:aluno`, sem uso de conta produtiva.
- `/api/plans?action=me` confirmou planos efetivos. Gratuito: `theory.summary=true`, `theory.complete=false`, `tec.links=false`, `qc.links=false`, Lei em Dia com limite de **20/dia**. Premium: `theory.complete=true` e recursos Premium previstos.
- As execuções de browser com perfis salvos não chegaram às apostilas: a sessão Gratuita registrou mensagem de falha de carregamento; a Premium encontrou dashboard mas tentou rotas SPA que não são usadas pelo frontend. **Não foi possível atestar 403 de asset premium diretamente na sessão nem progresso real no deployment.**
- O arquivo `central-v119.html` executa `history.replaceState(...,'/')` intencionalmente após o bootstrap; a URL `/` é **normal**, não sinal de falha.
- Na primeira entrada, a janela obrigatória **"Como você quer estudar?"** (classe `study-objective-open`) bloqueia corretamente ações de fundo até selecionar um objetivo. No teste foi selecionado **"Estudo livre"**. Posteriormente, o modal de onboarding pode ser dispensado por botão próprio.
- A marcação automática de capítulos pode voltar a marcar uma seção desmarcada quando o leitor reabre sobre ela; a persistência foi testada corretamente marcando **uma seção inicialmente pendente**, em vez de desmarcar a primeira já lida.

## 2. Cenários aprovados em Chromium — Central completa com mock de sessão

GitHub Actions [40686290633](https://github.com/Diogooliveira-bot/central-de-estudos-2026/actions/runs/40686290633) — `completed/success`. Teste novo `tests/etapa10-4-cpc-central-navigation-browser.mjs` e suíte preexistente `tests/etapa10-cpc-editorial-audit-browser.mjs`.

| Evidência (fixture Chromium) | 390 px | 768 px | 1366 px |
|---|---|---|---|
| Bootstrap Central pronto e URL normalizada para `/` | **OK** | **OK** | **OK** |
| Seleção inicial `Estudo livre` | **OK** | **OK** | **OK** |
| Clique real no menu `Disciplinas` | **OK** | **OK** | **OK** |
| Abertura do Direito Processual Civil | **OK** | **OK** | **OK** |
| Carregamento dos 20 módulos CPC | **OK** | **OK** | **OK** |
| Abertura do leitor M05 completo | **OK** | **OK** | **OK** |
| Divisores editoriais Partes IV/VIII, questões em destaque | **OK** | **OK** | **OK** |
| Abrir índice de Capítulos; marcar seção pendente | **OK** | **OK** | **OK** |
| Fechar/reabrir mantendo marcação de capítulo | **OK** | **OK** | **OK** |
| Erros JS | **0** | **0** | **0** |

A auditoria editorial independente dos 20 módulos em Chromium repetiu **60/60 cenários**, conforme saída `ETAPA10_CPC_AUDIT`. A suíte de segurança `npm run test:premium-and-auth` também passou. Artefato de métricas e capturas: [12815675693](https://github.com/Diogooliveira-bot/central-de-estudos-2026/actions/runs/40686290633/artifacts/12815675693), expiração prevista para 11/11/2026.

### Método e limites

O fixture local usa servidor HTTP Node e responde `/api/auth` e `/api/plans` por **mock Premium**, servindo o conteúdo-fonte local. Ele não substitui o middleware do Vercel nem a autenticação, a rede, o banco, os cookies ou a entrega dos arquivos protegidos do deployment. A persistência demonstrada decorre do **localStorage** na mesma sessão de navegador, não de uma rodada autentificada de sincronização Neon após logout/outro dispositivo.

Nenhum conteúdo jurídico, ID de capítulo, banco, autenticação produtiva ou configuração de produção foi modificado. As mudanças desta rodada foram **apenas novos testes e workflow CI** na branch de Preview.

## 3. Estado do deployment e condição para encerrar 10.4

Deployment privado que contém o material editorial aprovado: `dpl_H3XSoKBuzMh1wZrTe5PoAhstRJjn`, commit de código `f5dc763b...`, projeto `base-completa-teste-visual`, com Vercel Authentication ativa. A regressão nova foi executada contra a **branch posterior**, não publicada automaticamente nesse deployment. O teste de navegação da versão local não é evidência de publicação de novo código.

**Pendências de homologação E2E real:**
1. Entrar no deployment privado com os dois perfis fictícios existentes, selecionar **Estudo livre** se solicitado e clicar **Disciplinas → Direito Processual Civil**.
2. Com Gratuito, confirmar resumo e bloqueio HTTP do conteúdo completo/TEC/QC **com sessão autenticada**, inclusive endpoint de dados CPC.
3. Com Premium, abrir M05 completo na Preview e conferir tabelas, Partes IV/VIII, questões e persistência de uma marcação entre reabertura/recarga; se necessário, verificar sincronização em segundo dispositivo.
4. Só então registrar aceite e decidir necessidade de correção da Etapa 10.5. Não publicar em Production sem uma rodada própria de liberação.

**Conclusão:** cenário integrado **local** de navegação e leitura **3/3 aprovado**. Integração real com Preview protegida **parcialmente homologada**: login e planos comprovados, fluxo completo de leitura e persistência no ambiente publicado ainda pendentes.
