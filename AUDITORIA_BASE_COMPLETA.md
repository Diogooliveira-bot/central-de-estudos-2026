# AUDITORIA BASE COMPLETA

Data da execução: 2026-10-06/07  
Branch de revisão: `audit/base-completa-20261007`  
Base auditada: `261ba6fe3ae35d74d634d52695acce9e2e97e5a1`  
Versão declarada no `package.json`: `6.6.121`  
Publicação em produção: **NÃO realizada**.

## 1. Escopo e método

A auditoria combinou análise estática do repositório, leitura das APIs serverless, inspeção de autenticação e sincronização, verificação de manifest/service worker, testes de sintaxe, execução do comando de preparação e testes reais em Chromium/Playwright em ambiente isolado. As APIs foram simuladas nos testes de interface para não tocar dados reais. Nenhuma migração destrutiva e nenhuma alteração de produção foi executada.

Inventário observado no repositório durante a auditoria: 780 arquivos, 66 HTML, 554 JavaScript, 79 PDF, 26 CSS e 7 endpoints serverless em `api/` (`admin-dashboard`, `auth`, `backups`, `content-editor`, `progress-summary`, `sync`, `users`).

Arquitetura: frontend majoritariamente estático com persistência local/PWA e APIs serverless Vercel/Neon para autenticação, usuários, sincronização, backups, progresso, painel administrativo e editor de conteúdo.

## 2. Resumo executivo

### Corrigido e retestado — ALTO

**Isolamento de dados locais entre usuários no mesmo aparelho.** O backend já restringia sincronização por `user_id`, mas `sync-client.js` coletava o `localStorage` compartilhado sem identificar seu proprietário local. Em troca de conta no mesmo navegador, o estado deixado pela conta A poderia ser coletado pela conta B e posteriormente sincronizado com a nuvem de B.

Correção preparada diretamente na branch: `sync-client.js` agora registra o proprietário local, guarda snapshot por usuário no IndexedDB já existente, limpa apenas chaves sincronizáveis ao trocar de usuário, restaura o snapshot da conta de destino e exclui a chave de proprietário do payload remoto.

Reteste em Chromium, mesma origem/navegador, sequência A → B → A → B:

```json
{"bSeesA":null,"aRestored":"A-only","bRestored":"B-only","pass":true}
```

Resultado: **aprovado após correção**.

### Corrigido e retestado — MÉDIO/BAIXO

Foram reproduzidos cinco overflows horizontais a 390 px. As causas identificadas foram tabela com `min-width`, blocos `code/pre` sem quebra suficiente, min-content de grid e box model de tela utilitária. As correções foram testadas no sandbox e zeraram os overflows na varredura de 330 casos. Arquivos ajustados no sandbox de auditoria:

- `modules/trabalho/base-completa/m04.html`: tabela adaptada ao viewport no mobile.
- `modules/trabalho/base-completa/m08.html`: quebra segura de `code/pre` no mobile.
- `modules/trabalho/base-completa/m17.html`: quebra segura de `pre` no mobile.
- `tools/cronograma.html`: filhos do grid podem encolher no breakpoint mobile.
- `update-central.html`: `.box` passa a usar `box-sizing:border-box`.

Também foi removida no sandbox uma referência inexistente em `modules/trabalho/base-completa/m03.html` para `m3_auditado.css`. O arquivo não existe no repositório e a página já era renderizada sem ele; após a remoção, o 404 desapareceu.

**Nota operacional:** as seis alterações visuais acima foram validadas no sandbox e ficaram em um commit local de auditoria (`198c8c0`), mas o sandbox não possuía credencial Git para empurrar esse commit diretamente ao GitHub. A branch remota contém a correção de isolamento e este relatório; as correções visuais estão documentadas aqui para revisão/aplicação controlada antes de merge. Nenhuma delas foi publicada.

## 3. Cobertura executada

| Área | Método | Resultado |
|---|---|---|
| JavaScript | `node --check` em 554 arquivos | Aprovado |
| JSON | parse dos JSON inspecionados | Aprovado |
| Preparação do projeto | `npm run prepare` | Aprovado (`Progress identifiers generated`) |
| Git whitespace | `git diff --check` | Aprovado nas alterações auditadas |
| Todas as páginas HTML | 66 páginas em Chromium | 0 rota HTML 404 |
| Responsividade | 66 páginas × 360/390/768/1024/1440 = 330 carregamentos | Após correções no sandbox: 0 overflow horizontal |
| Temas | 7 temas em harness Chromium a 390 px | Todos aplicam, persistem após reload e sem overflow |
| Troca de usuário local | Chromium + localStorage + IndexedDB, A/B/A/B | Aprovado após correção |
| Manifest PWA | parse + existência dos ícones | Aprovado |
| Ícone PWA | arquivo real | WebP 640×640, presente |
| Service worker | análise estática de rotas/cache/offline auth | Estrutura presente; ver limitações |
| Auth/API | análise estática + `/api/auth?action=me` em produção sem sessão | `authenticated:false`, `cache-control:no-store` |
| APIs protegidas | análise de `requireSession`/papel/user_id | Proteções presentes no código auditado |
| Editor HTML | análise de sanitização server/client | Hardening recomendado; exploração final não demonstrada no caminho auditado |

## 4. Responsividade e evidências

Antes das correções do sandbox, a varredura de todas as páginas em 390 e 1440 px encontrou 5 páginas com overflow. Depois das correções, a matriz completa em 360, 390, 768, 1024 e 1440 px produziu:

```json
{"pages":66,"cases":330,"main404":0,"overflow":0,"errors":0}
```

Uma requisição 404 para `anki-deck-manager-v6681.js` apareceu uma vez na varredura sequencial, associada a `tools/cpc-m01-mapa.html`. A página foi repetida isoladamente em contextos novos de 390 e 1440 px e retornou **zero requisições 4xx**, indicando efeito assíncrono herdado da navegação anterior no teste sequencial, não falha reproduzível dessa página.

Capturas produzidas no sandbox depois das correções:

- `audits/base-completa-20261007/m04-mobile.png`
- `audits/base-completa-20261007/m08-mobile.png`
- `audits/base-completa-20261007/m17-mobile.png`
- `audits/base-completa-20261007/cronograma-mobile.png`

Esses PNGs ficaram no commit local do sandbox citado acima e não foram enviados automaticamente ao repositório remoto por falta de credencial Git do sandbox.

## 5. Temas

Temas encontrados e testados: `paper-yellow`, `paper-white`, `sage-study`, `editorial-gray`, `legal-mist`, `dark-premium`, `oled-black`.

Em todos os sete casos, `data-central-theme` recebeu o tema correto, o valor permaneceu após reload e o harness de 390 px não apresentou overflow. A migração dos nomes antigos `light`, `dark` e `oled` também está prevista no código.

## 6. Autenticação, autorização e separação de usuários

Pontos positivos confirmados por análise de código:

- senha com scrypt;
- sessão assinada/HMAC e cookie `HttpOnly`, `Secure`, `SameSite=Lax`;
- versionamento de sessão;
- APIs de usuários/admin exigem papel apropriado;
- sincronização, backups e progresso vinculam consultas ao usuário autenticado;
- mudanças sensíveis em usuário incrementam `session_version`;
- proteção contra remoção do último administrador e auto-desativação/rebaixamento em fluxos administrativos;
- respostas de autenticação usam política sem cache.

Correção necessária encontrada: o estado **local** não possuía fronteira por usuário, mesmo com o backend corretamente segmentado. Essa é a correção de maior prioridade da auditoria e está na branch de revisão.

## 7. PWA/offline

`manifest.webmanifest` foi validado como JSON e contém `display: standalone`, escopo `/`, `start_url: /` e ícones existentes. O ícone declarado é um WebP real de 640×640 e serve aos propósitos `any` e `maskable`.

`sw.js` possui boot da Central, manifest offline, cache dinâmico, lógica específica de autenticação offline e restrição de páginas protegidas sem autenticação offline válida.

O teste de instalação física como app Android, fechamento completo do sistema operacional e reabertura do ícone instalado **não foi executado no sandbox headless**. Da mesma forma, expiração/desativação de conta enquanto totalmente offline exige decisão de produto e teste em dispositivo real. Esses itens permanecem como verificação de aceite em aparelho.

## 8. Editor de conteúdo e segurança de HTML

O endpoint `api/content-editor.js` faz sanitização server-side por expressões regulares. O frontend `ui/visual-editor-v1.js` ainda sanitiza novamente antes de inserir snapshots no DOM, removendo elementos perigosos, atributos `on*` e URLs `javascript:` em `href/src`.

A sanitização por regex no servidor é menos robusta que um parser/allowlist de HTML. Como a escrita no endpoint é restrita a `admin/editor` e o caminho de renderização auditado reaplica sanitização no cliente, não foi classificada como exploração comprovada contra aluno nesta rodada. Recomenda-se, em hardening futuro, substituir a sanitização server-side por biblioteca/parser com allowlist explícita, preservando as tags do editor.

## 9. Conteúdo, arquivos e links

A auditoria automatizada carregou os 66 HTML existentes e não encontrou rota HTML principal 404. O M03 de Direito do Trabalho tinha uma folha `m3_auditado.css` inexistente; a referência foi retirada no sandbox, sem alterar teoria, questões, gabaritos ou conteúdo jurídico.

Nenhuma divergência de teoria jurídica ou gabarito foi modificada por inferência. PDFs, imagens e conteúdo legal não foram reescritos nesta auditoria.

## 10. Limitações e itens bloqueados

Não foram fornecidas credenciais de teste para contas reais `admin`, `editor` e `student`. Assim, criação/edição/desativação real de usuários, sessão expirada real, sincronização real contra Neon e backup real foram analisados no código e simulados na interface, mas não executados contra dados reais. Isso evita risco de alteração de dados de produção.

O sandbox não possui credencial GitHub para `git push`; por isso o commit visual local não foi enviado diretamente. A integração final dessas seis alterações deve ocorrer de forma controlada na branch após revisão.

Não houve teste físico de instalação PWA em Android, rotação de aparelho instalado, teclado virtual nativo ou retomada após processo encerrado pelo sistema operacional.

A verificação de acessibilidade desta rodada cobriu estrutura/inspeção e comportamento visual básico, mas não substitui auditoria WCAG completa com leitor de tela e navegação manual por teclado em todos os fluxos.

## 11. Arquivos alterados/preparados

Enviado à branch:

- `sync-client.js` — isolamento local por usuário.
- `AUDITORIA_BASE_COMPLETA.md` — este relatório.

Validado no sandbox e pendente de transferência controlada para a branch:

- `modules/trabalho/base-completa/m03.html`
- `modules/trabalho/base-completa/m04.html`
- `modules/trabalho/base-completa/m08.html`
- `modules/trabalho/base-completa/m17.html`
- `tools/cronograma.html`
- `update-central.html`
- quatro PNGs de evidência em `audits/base-completa-20261007/`

## 12. Critério para merge/publicação

Antes de merge para `main`, revisar a alteração de isolamento e incorporar as seis correções visuais já retestadas. Depois, executar novamente `node --check`, `npm run prepare`, a matriz de 330 carregamentos e um smoke test autenticado com contas de teste. Para publicação PWA, completar o aceite em Android real: instalar, abrir offline, reconectar, atualizar versão e confirmar preservação de progresso.

**Nenhuma publicação automática foi realizada por esta auditoria.**
