# Correção Editorial Global V2 — relatório

Data: 01/11/2026 · Branch: `ccr-d45efe46-x2251q` · Base: `main` 698c04be (Produção)

## A. Causas confirmadas

| Problema | Causa | Onde |
|---|---|---|
| Quebras no meio da frase | Linhas do material de origem (PDF/Word) unidas com `\n` e exibidas com `white-space: pre-wrap` | `ui/universal-reader-v1.js` (`para.join('\n')`) + `ui/universal-reader-v1.css` |
| Parágrafos cortados | Linha iniciada por ATENÇÃO/PEGADINHA/Art. virava parágrafo isolado; a continuação abria outro parágrafo | `ui/universal-reader-v1.js` (`legal()`) |
| Palavras partidas | `hyphens: auto` no modo justificado e no leitor universal | `ui/reader-standard-v1.js`, `ui/universal-reader-v1.css` |
| Tabelas de Civil ilegíveis | Na importação, 42 tabelas foram gravadas como texto de largura fixa (`<pre class="civil-source-table">`); o leitor universal as achatava em parágrafos | dados de Civil + `ui/universal-reader-v1.js` |
| Tabelas cortadas no celular | Tabelas com 3+ colunas (e largura mínima de 650 px em Penal) sem adaptação | CSS das disciplinas |
| Quadrados no lugar de marcadores | Caractere U+F0B7 (marcador da fonte Symbol do Word) — 43 em Civil, 36 em CF, 80 em CPC | dados importados |
| Siglas sem significado no celular | O significado só existia em `title` (não funciona por toque/teclado) | `ui/acronyms-v1.js` |
| Botão Aa sem efeito no celular | Regra móvel fixava `font-size: 18px !important` no artigo (defeito já existente em Produção) | `ui/student-experience-v3.css:187` |

## B. Correções

- `ui/universal-reader-v1.js` / `.css`: `reflow()` une as linhas por espaço (linha terminada em hífen é unida sem espaço, preservando palavras compostas); alertas/dispositivos continuados formam um só parágrafo; sem `pre-wrap` nos parágrafos; sem hifenização; blocos `*-source-table` não são achatados.
- `ui/reader-standard-v1.js`: modo justificado sem hifenização automática.
- **Novo** `ui/editorial-reading-v2.js` (apresentação; o conteúdo salvo não muda):
  - reúne parágrafos cortados no meio da frase (texto idêntico);
  - reconstrói tabelas de largura fixa como `<table>` — só quando todo caractere cai numa coluna e o conjunto de palavras é idêntico ao original; o texto que vinha depois da tabela no mesmo bloco volta como texto comum; blocos de uma coluna viram lista;
  - tabelas simples (1 linha de cabeçalho, sem mesclas, 2–6 colunas, linhas completas) viram **cartões** até 640 px, com o rótulo da coluna em cada campo; no computador continuam tabela; tabelas complexas ficam em área com rolagem horizontal acessível por teclado (`role="region"`, `tabindex="0"`);
  - marcador U+F0B7 exibido como “•”;
  - **Entenda o termo**: 9 termos curados (nascituro, comoriência, curatela, preclusão, coisa julgada, prescrição, decadência, legitimidade, jurisprudência) com significado simples, explicação jurídica com dispositivo e exemplo quando seguro; primeira ocorrência por leitura; toque, clique, Enter/Espaço; Esc fecha só a explicação.
- `ui/acronyms-v1.js`: sigla focável (`role="button"`, `tabindex="0"`, `aria-label`), significado por toque/clique/Enter; novas siglas (ARP, PMI, EP, PJ, EIRELI, LCP, RSE, CPM, LEF, JEC, JECRIM, TCO, MPF, DPU, AGU, PGR, CGU); siglas ambíguas (MP, PF, SEM, TR, CR) só quando o próprio texto define o sentido; links e código não são alterados; vale também na revisão guiada.
- `ui/student-experience-v3.css`: o artigo usa `var(--bc-reading-size, 18px)` — o botão Aa volta a funcionar no celular.

Nenhum texto jurídico, questão, gabarito, progresso, anotação, autenticação ou pagamento foi alterado.

## C. Cobertura verificada (navegador, aluno Premium fictício)

- Teoria completa: Administrativo, Constitucional, Civil, Processo Civil, Penal e Processo Penal — módulos 1, 2, 3 e 5 (amostra) a 390 px; módulo de referência de cada disciplina a 360, 390, 768 e 1366 px.
- Versão de revisão (inclusive a revisão guiada de CF, Penal e Civil): módulos 1 e 3.
- Tabelas de largura fixa de Civil: as 42 do material (32 reconstruídas; 4 eram listas; 6 com alinhamento irregular ficam com rolagem).

## D. Testes

- `tests/editorial-reading-v2-unit.mjs` (10 testes) — passou.
- `tests/editorial-reading-browser.mjs` (6 disciplinas × 360/390/768/1366 px, glossário por toque e teclado, Entenda o termo, botão Aa, sem erros de JavaScript) — passou.
- `tests/editorial-audit-browser.mjs` — auditoria (relatório, sem asserções).
- `npm test` — 189/189. Navegador existentes (leitor padrão, questões interativas, Gratuito, questões internas, cadastro) — passaram.

## E. Comparação visual (celular, 390 px)

`antes-*.png` (Produção atual) e `depois-*.png` nesta pasta: início da teoria de Penal (palavras partidas × inteiras), tabela de Penal (cortada × cartões), tabela de Civil (texto embaralhado × cartões), tabela de Administrativo.

## H. Limitações e pendências

- Português e RLM não usam estes leitores jurídicos e não fizeram parte da auditoria.
- 6 tabelas de Civil com alinhamento irregular no material de origem ficam como bloco com rolagem; a correção definitiva é refazê-las como tabela no conteúdo.
- O texto justificado sem hifenização pode deixar alguns espaços maiores em linhas curtas no celular; o aluno pode desligar a justificação no botão “☰ Justificado”.
- As explicações de “Entenda o termo” (9 termos) foram revisadas e **aprovadas pelo proprietário em 01/11/2026**, na versão publicada (commit 280d16a1).
