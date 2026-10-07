# Auditoria técnica — BASE COMPLETA

**Data:** 2026-10-07 (UTC)

**Branch:** `fix/auditoria-base-completa-final`

**Base inicial (`main`):** `b709b6feb087e38da0eafd95e005f8c8305a71aa`

**Versão declarada:** `6.6.121`

**SHA de implementação antes deste relatório:** `ce14d5b1f4e8358053f055c4d40d311e8c1d8dc4` (o SHA final incluindo este relatório consta no PR).

**PR anterior:** #52 continua Draft e parte de uma base antiga; esta branch foi criada diretamente do `main` atual.
**Publicação:** **Nenhum deploy de produção foi executado.** Nenhum merge em `main`, migração destrutiva ou escrita em dados reais de usuários foi executado.

## 1. Escopo e inventário atual

O repositório não contém `README.md` nem `AGENTS.md`. Foram lidos `package.json`, `vercel.json`, `manifest.webmanifest`, `sw.js`, a auditoria anexada pelo solicitante, a branch `audit/base-completa-20261007` e o PR #52. `git fetch --all --prune`, `git status`, `git branch -vv` e os 20 commits recentes foram verificados antes das alterações. As mudanças posteriores do `main`, inclusive os infográficos de Penal, foram preservadas.

| Item | Quantidade atual | Local principal |
|---|---:|---|
| HTML | 66 | raiz, `modules/`, `tools/` |
| JavaScript do projeto | 557 | raiz, `ui/`, `content/`, `api/`, `lib/` |
| CSS | 27 | raiz, `ui/`, `fixes/` |
| PDF | 79 | `modules/`, `assets/` e conteúdo |
| APIs serverless | 8 | `api/` (inclui `spellcheck.js`) |
| Arquivos do catálogo offline | 400 | `central-offline-files-v66172.json` |

Contagens excluem `node_modules` e `.git`. `audits/base-completa-20261007/browser-results.json` guarda os resultados detalhados do navegador; os PNGs na mesma pasta são evidência visual. O teste não acessou Neon nem usou contas de produção.

## 2. Matriz de aceite

| Área | Status | Evidência e limite |
|---|---|---|
| Isolamento A/B local | **CORRIGIDO + RETESTADO** | Chromium, mesma origem e IndexedDB, A → B → A → B, reload, reabertura, offline e reconexão; API de sync simulada. |
| Ordem da proteção no login | **CORRIGIDO + RETESTADO** | Em entrada real por `central-v119.html`, o proprietário já é B antes de `document.write` montar a aplicação. |
| Seis correções visuais pedidas | **CORRIGIDO + RETESTADO** | Matriz de 66 HTML × cinco larguras; 0 overflow. |
| Link local e Anki | **CORRIGIDO + RETESTADO** | Varredura estática de referências locais sem faltantes; último sweep sem 404 de assets. |
| JavaScript, JSON, prepare, unitários, whitespace | **APROVADO** | 557 `node --check`; JSON válidos; `npm run prepare`, `npm test`, `git diff --check`. |
| Sete temas e três nomes legados | **CORRIGIDO + RETESTADO** | Atributo, armazenamento e reload; folha de temas recomposta na home e cores escuras reais em Dark Premium/OLED; sete escolhas persistem na navegação. |
| PWA e offline em Chromium | **APROVADO** | SW real com auth simulada; página já aberta recarregou offline; chave de progresso persistiu; atualização simulada limpou cache antigo. |
| Sanitização no fluxo atual | **PENDENTE** | Seis payloads testados no servidor e no editor cliente; sem execução no DOM do editor. Regex server-side deixa `href=javascript:` sem aspas; hardening pendente. |
| Autorizações com banco real | **BLOQUEADO** | Sem credenciais e banco de teste próprios; análise de código e testes unitários de token/origem, sem alterar dados reais. |
| Instalação Android física | **BLOQUEADO** | Requer aparelho para instalação, rotação, teclado virtual e retomada após encerramento do processo. |
| WCAG completa e performance com profiler | **PENDENTE** | Smoke automatizado objetivo executado; fluxos manuais e medições contínuas não substituídos por ausência de erro. |

## 3. Achados, correções e retestes

### A. Isolamento entre usuários — severidade **ALTA**

**Reprodução:** A deixa progresso no `localStorage`; depois do logout, B entra no mesmo navegador. O código anterior coletava o armazenamento compartilhado sem proprietário, com risco de associar dados de A à sincronização de B. O backend já usa `user_id`, mas essa fronteira não existia antes da coleta local.

**Causa:** `sync-client.js` usava `localStorage` global. **Correção:** `sync-local-state.js` registra `central-v6:local-owner`, guarda snapshots em `u:<userId>:local-snapshot` no IndexedDB existente e remove/restaura apenas chaves que já participavam do sync. O proprietário, duas chaves de probe e as chaves de Português explicitamente excluídas continuam fora do payload. `central-v119.html` executa a preparação após autenticar e antes de carregar o HTML principal; `sync-client.js` usa o mesmo módulo. O catálogo offline inclui o novo módulo e o cache SW recebeu versão nova. Dados legados sem proprietário são atribuídos à primeira conta autenticada, preservando o estado existente; como não há metadado anterior, não é possível inferir com segurança quem usou dados legados antes desse primeiro login. As chaves de Português explicitamente excluídas do sync continuam fora dessa troca e podem permanecer visíveis no mesmo navegador; isolá-las exige tratar o armazenamento próprio dessa funcionalidade sem apagar dados, fora do escopo desta correção de sync.

**Reteste com mock de API e navegador real:**

```json
{"bSeesA":null,"aRestored":"A-only","bRestored":"B-only","pass":true,"offline":true,"reconnected":true,"cloudB":"B-only"}
```

O teste também confirmou preservação de dado legado e chave fora do sync. No fluxo de boot, `ownerAtWrite` foi `B` e `bSeesA` foi `null`. Uma reconexão disparada enquanto a restauração de B estava atrasada também não enviou dados de A, pois o sync só inicia após a preparação local terminar. O teste usa contas A/B simuladas; a sincronização com Neon real continua bloqueada.

### B. M03 de Direito do Trabalho — severidade **BAIXA**

**Reprodução/causa:** `modules/trabalho/base-completa/m03.html` carregava `m3_auditado.css`, inexistente. **Correção:** apenas o `<link>` quebrado foi removido. **Reteste:** página presente na matriz de cinco larguras, sem 404 do CSS. Texto jurídico intacto.

### C. M04, M08 e M17 no mobile — severidade **MÉDIA**

**Reprodução/causa:** M04 tinha tabela com largura mínima de 520 px; M08 tinha `code/pre` longos; M17 tinha `pre` que ultrapassava o viewport. **Correção:** regras mobile locais permitem tabela dentro do viewport com rolagem interna e quebra de linhas longas em `code/pre`. **Reteste:** 360/390/768/1024/1440 px, 0 overflow; capturas dos três módulos. Conteúdo das apostilas não foi editado.

### D. Cronograma e Update Central no mobile — severidade **MÉDIA/BAIXA**

**Reprodução/causa:** filhos do grid e cabeçalho do cronograma não encolhiam; `.box` de atualização somava largura, padding e borda além de 100%. **Correção:** limites de largura/min-width no breakpoint do cronograma e `box-sizing:border-box` da `.box`. **Reteste:** matriz sem overflow; screenshot do cronograma a 390 px e inspeção visual do título do dia, pendências, minutos, barra, tarefas, botões e cards. Não foi usado `body{overflow-x:hidden}`.

### E. Anki e link de retorno — severidade **BAIXA**

**Reprodução:** três 404 para `/anki-deck-manager-v6681.js` foram atribuídos, em execução isolada, a `tools/anki.html`. O script de compatibilidade em `tools/tools/` resolvia o caminho relativo à página, chegando à raiz errada. **Correção:** caminho absoluto inequívoco para `/tools/anki-deck-manager-v6681.js`; link `index.html` de `tools/anki.html` apontava a `tools/index.html` inexistente e agora aponta a `/index.html`. **Reteste:** varredura posterior sem 404. O 404 da auditoria anterior associado a `tools/cpc-m01-mapa.html` não motivou remoção de scripts dessa página.

### F. Editor antigo e rótulos administrativos — severidade **BAIXA**

`ui/block-editor-v2.js` continha uma chave ausente em `addBlock`, detectada por `node --check`; o fechamento do bloco `image` foi corrigido. `usuarios.html` tinha busca e filtro sem nome acessível; receberam `aria-label`, assim como o seletor de perfil criado dinamicamente. Reteste: todos os JavaScript passam em sintaxe e o smoke das cinco páginas principais achou 0 botão sem nome, 0 link vazio e 0 input sem rótulo visível no estado testado.

### G. Temas escuros na home — severidade **MÉDIA**

**Reprodução:** a escolha de Dark Premium ou OLED atualizava o atributo do HTML e o armazenamento, mas a home ainda aparecia clara na captura. **Causa:** o boot descartava a folha de temas ao trocar o documento, e a camada de navegação mais recente fixava cores claras com seletores fortes. **Correção:** a folha de temas existente é incluída ao final do HTML montado; regras restritas aos dois temas escuros traduzem os tokens atuais para os cards, título, progresso e fundo da home. O catálogo offline e a versão do cache foram atualizados para a folha nova. **Reteste:** screenshots Dark Premium e OLED após o estado `centralReady`; fundo e cards escuros, títulos legíveis, persistência após reload e navegação. O modo claro mantém a aparência anterior.

## 4. Navegador e responsividade

Foi usado Chromium real servido por HTTP local, com endpoints de autenticação/sync simulados e service worker bloqueado **somente na matriz responsiva** para não contaminar a medição entre páginas. Cada página foi aberta em contexto de navegação novo, com `DOMContentLoaded` e janela curta para scripts, registrando resposta principal, 404 de assets locais, exceções JS e `scrollWidth` horizontal. Isso é um smoke de carregamento e layout, não prova cada ação funcional de cada tela.

| Páginas | Larguras | Carregamentos | Rota principal 404 | Assets 404 | Erros JS | Overflows |
|---:|---|---:|---:|---:|---:|---:|
| 66 | 360, 390, 768, 1024, 1440 px | 330 | 0 | 0 | 0 | 0 |

A matriz final foi repetida após a correção do Anki e após os ajustes no boot e na tela de usuários. Testes adicionais em seis páginas representativas cobriram mobile portrait/landscape, tablet portrait/landscape e zoom CSS equivalente a 200%: **30 carregamentos, 0 overflow**. Esses testes não reproduzem teclado virtual ou rotação física.

## 5. Temas, acessibilidade e desempenho

Temas atuais: `paper-yellow`, `paper-white`, `sage-study`, `editorial-gray`, `legal-mist`, `dark-premium`, `oled-black`. Os aliases `light`, `dark` e `oled` migraram no harness. Na home real, a troca de cada tema pela função da interface alterou `data-central-theme` e a chave `central-v6:appearance`; o valor persistiu após recarga e navegação até o cronograma e retorno. Foram produzidas capturas Dark Premium e OLED após carregamento completo; o teste também verificou fundo e cards escuros (OLED com fundo preto). O teste não mede contraste WCAG de todos os componentes, modais ou infográficos.

Acessibilidade: smoke das páginas `central-v119.html`, `login.html`, `usuarios.html`, `tools/cronograma.html` e M04 a 390 px: zero botões sem nome, links vazios ou inputs sem label no estado testado. Verificação manual de ordem de tabulação, foco visível, Escape em todos os modais, leitor de tela e tamanho de toque em todos os fluxos permanece pendente. Cabeçalhos foram inventariados; sem redesign.

Desempenho: a matriz não registrou exceções JS nem requisição local 404 após correção. Não foi executado profiler longitudinal de CPU/memória nem medição em tablet Android/PC fraco. Portanto não há alegação de ausência de loops, observers custosos ou regressões de desempenho sob uso prolongado.

## 6. PWA e offline

`manifest.webmanifest` declara `start_url` `/`, `scope` `/`, `display` `standalone` e dois ícones WebP existentes. Os 400 caminhos do catálogo offline existem. O novo módulo de isolamento foi incluído no catálogo e o cache do SW foi versionado. Em Chromium com SW real e API de auth simulada: uma página já visitada respondeu HTTP 200 após desligar a rede, a chave de progresso local continuou após reload e uma troca de URL/versionamento do worker removeu um cache antigo de teste sem apagar o progresso. O teste A/B offline e a sincronização após reconexão ocorreram em harness com API simulada. A instalação física e a política de expiração/desativação de conta enquanto completamente offline não foram verificadas em Android.

## 7. APIs, autorização e sanitização

**Análise de código:** `api/users.js` e `api/admin-dashboard.js` exigem `admin`; escrita em `api/content-editor.js` exige `admin/editor`, leitura aceita conta autenticada; `api/sync.js`, `api/backups.js` e `api/progress-summary.js` usam o `user.id` da sessão nas consultas e mutações relevantes. `lib/auth.js` valida HMAC, expiração, `active`, `session_version` e papel, e diferencia 401/403; cookies têm `HttpOnly`, `Secure`, `SameSite=Lax`; mutações das APIs listadas verificam origem, e respostas JSON protegidas usam `Cache-Control:no-store`. Os testes unitários cobriram token válido/adulterado/expirado, papéis, senha, origem e atributos do cookie. **Não foi executado E2E real de aluno/editor/admin contra Neon**, nem teste real de revogação/desativação, porque não foram fornecidas contas e banco de teste.

**HTML do editor:** seis entradas foram aplicadas ao `cleanHtml` server-side e à renderização real de `ui/visual-editor-v1.js`: `script`, `img onerror`, dois formatos de `javascript:` em link, `iframe srcdoc` e `svg onload`. Não houve execução no DOM renderizado. Formatação válida com `h2`, tabela e figura foi preservada. O servidor ainda deixa passar `href=javascript:` sem aspas, mas o cliente analisado remove esse atributo antes de inserir o HTML. Não foi demonstrado bypass explorável no fluxo atual. A substituição do regex por parser/allowlist no servidor fica **PENDENTE** de política de tags e validação dos conteúdos existentes. A API não recebeu mudança especulativa que poderia apagar formatação de apostilas.

## 8. Conteúdo e referências

Referências literais locais em `href`, `src` e `url(...)` de HTML/CSS foram varridas, ignorando URLs externas, fragmentos, `data:`, placeholders e templates. Após os ajustes de M03 e Anki, não restou arquivo literal local faltante nessa varredura. O teste de existência do catálogo offline não garante que todo PDF/infográfico tenha sido lido visualmente. Módulos de Direito do Trabalho e páginas estáticas foram carregados na matriz; a estrutura de leitura orientada, questões, revisão, decorar, pegadinhas, checklist e infográficos varia por módulo e não foi preenchida artificialmente. Nenhuma questão, alternativa, gabarito, texto jurídico, PDF ou infográfico foi reescrito por inferência.

## 9. Comandos e resultados

```text
git fetch --all --prune                 OK
npm install                            OK (Playwright em devDependency; lockfile criado)
node --check em 557 *.js               OK (0 erro)
parse JSON do projeto                  OK
npm run prepare                        OK (Progress identifiers generated)
npm test                               OK (3 testes unitários)
node tests/audit-browser.mjs isolation OK (A/B e reconexão simulada)
node tests/audit-browser.mjs boot      OK (proprietário B antes de document.write)
node tests/audit-browser.mjs themes    OK (7 + 3 aliases em harness)
node tests/audit-browser.mjs real-themes OK (7 na home real, reload e navegação)
node tests/audit-browser.mjs sanitization OK (6 payloads)
node tests/audit-browser.mjs pwa       OK (offline e limpeza de cache)
node tests/audit-browser.mjs accessibility OK (5 páginas, 0 achados simples após correção)
node tests/audit-browser.mjs layouts   OK (6 páginas × 5 cenários = 30; 0 overflow)
node tests/audit-browser.mjs sweep     OK (66 × 5 = 330; 0/0/0/0)
node tests/audit-browser.mjs all       OK (execução integrada final em 2026-10-07 09:07 UTC)
git diff --check                       OK
```

Não existem scripts `lint` ou `typecheck` no `package.json`, portanto são **N/A**. A matriz usa mock de autenticação; não deve ser confundida com teste de produção.

## 10. Capturas

- `audits/base-completa-20261007/m04-mobile.png`
- `audits/base-completa-20261007/m08-mobile.png`
- `audits/base-completa-20261007/m17-mobile.png`
- `audits/base-completa-20261007/cronograma-mobile.png`
- `audits/base-completa-20261007/home-390.png`
- `audits/base-completa-20261007/home-1440.png`
- `audits/base-completa-20261007/dark-premium.png`
- `audits/base-completa-20261007/oled.png`

## 11. Antes do merge

- Revisar o diff e os testes do PR Draft, especialmente a atribuição conservadora de dados legados sem proprietário local conhecido.
- Executar smoke autenticado com **contas e banco próprios de teste** para aluno/editor/admin, sessão revogada/inativa, sync e backup.
- Fazer aceite físico no Android para instalação PWA, offline, rotação, teclado, atualização e retomada.
- Definir política de tags do editor para hardening server-side e medir contraste/foco com leitor de tela.

**Nenhum deploy de produção foi executado. Nenhum merge ou auto-merge foi feito.**
