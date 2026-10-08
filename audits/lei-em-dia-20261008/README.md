# Auditoria da ferramenta Lei em Dia — 08/10/2026

Base inicial: `d56b7c21cdce0aef7e022f505bbe09250251c3a3` (`origin/main`). Branch: `fix/lei-em-dia-20261008`. Versão do projeto: `6.6.121`. A ferramenta permanece em `tools/decorando.html` e usa a mesma chave de armazenamento para preservar progresso anterior.

## Achados e correções

| Achado | Impacto | Correção e reteste |
| --- | --- | --- |
| Rótulo antigo em atalhos, cursos e módulos | Nome inconsistente | Textos visíveis alterados para **Lei em Dia**; IDs, rotas, chaves e nomes de arquivos mantidos por compatibilidade. Rótulos de fonte dos bancos de questões foram preservados como metadados de origem. |
| Texto legal em `<button>` | Impedia selecionar palavras para destacar | Trechos passaram a aceitar seleção com mouse, teclado e evento de seleção por toque. Barra flutuante permite quatro cores, troca de cor e remoção. O toque no parágrafo ainda marca o trecho inteiro. Explicações das respostas aceitam seleção parcial. Testado no Chromium com arrasto real, recarga e persistência. |
| Filtro por histórico sem efeito | Não permitia separar questões vistas, não vistas ou erradas | Filtros visíveis na página inicial: Todas, Não vistas, Vistas, Errei por último e Dominadas. Contagens e estudo foram testados. A questão recém-respondida permanece na tela até a navegação, inclusive no modo Scroll. |
| Domínio após apenas dois acertos | Status de domínio prematuro | Uma questão é dominada após cinco acertos consecutivos; um erro reinicia a sequência. Tentativas anteriores são preservadas. Testado com acertos, erro e nova sequência. |
| Filtros de ano, cargo e origem declarados sem aplicação | Seleções não afetavam o caderno | Filtros aplicados ao conjunto de questões. Campo de cargo fica oculto quando a disciplina não possui esse metadado. Filtro, limpeza e contagens testados. |
| Excluir questão sem ação visível | Função de restauração difícil de usar | Botão Excluir adicionado nos modos Foco e Scroll; restauração pela Auditoria testada. |
| `ui/m17-header-fix.js` já continha `\n` literais fora de strings | Script do Penal M17 falhava na análise sintática | Apenas as quebras de linha inválidas foram corrigidas; `node --check` passou. |

Nenhuma questão, alternativa ou gabarito foi modificado. As substituições em textos de conteúdo são apenas referências ao nome da ferramenta.

## Testes executados

- `node tests/lei-em-dia-browser.mjs`: aprovado em Chromium real, contextos de teste locais e dados simulados. Cobriu seleção por arrasto, destaque, recoloração, remoção, notas, importância, histórico, domínio, filtros, opções, ordem aleatória, exclusão/restauração, temas claro/escuro, recarga, modo Foco/Scroll e offline/reconexão.
- Larguras: **360, 390, 800, 900 e 1440 px**. **23 verificações de layout**, zero overflow horizontal, zero 404 locais e zero erros JavaScript capturados.
- Offline da ferramenta: recarga HTTP **200**, conteúdo carregado e estado local preservado antes e depois da reconexão. O smoke test geral `node tests/audit-browser.mjs pwa` também passou com mock de autenticação e cache `central-20261008-lei1`.
- `npm test`: 3 testes de autenticação aprovados.
- `npm run prepare`: aprovado.
- `node --check`: **557 arquivos `.js`**, zero erros após a correção do M17.
- Parse JSON: **9 arquivos**, zero erros.
- `git diff --check`: aprovado.

Resultados detalhados: [browser-results.json](browser-results.json). Capturas: [filtros-configurados-mobile.png](filtros-configurados-mobile.png), [destaque-resposta-mobile.png](destaque-resposta-mobile.png), [resposta-tablet.png](resposta-tablet.png), [resposta-desktop.png](resposta-desktop.png) e [filtros-mobile.png](filtros-mobile.png).

## Limitações

Os testes usaram Chromium local e sessão simulada; não acessaram contas nem dados reais. Seleção por toque e instalação PWA em Android físico continuam pendentes de aceite no aparelho. A regra de domínio é calculada a partir do histórico existente, sem migração destrutiva. IDs e nomes de arquivos legados com `decorando` permanecem para compatibilidade.

Nenhum deploy de produção foi executado durante esta auditoria.
