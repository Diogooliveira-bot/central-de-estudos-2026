# Lei seca ao lado da explicação — Direito Civil e Processo Civil (módulos completos)

Mesmo modelo já usado no Direito Constitucional (`ui/cf-apostila-reading-v1.js`): quando um parágrafo cita um artigo,
logo abaixo dele aparece uma caixa recolhível **"Lei seca — CC, art. X"** (ou **"CPC, art. X"**) com o texto do artigo.

## Como funciona
- **Só na teoria completa** ("Estudar conteúdo"). A "Versão de revisão" não muda.
- O conteúdo salvo não é alterado: a caixa é montada na hora de abrir o módulo, a partir do texto da lei que já existia
  nos blocos antigos (Civil: `data-law-key` da apostila e `BC_CIV_GUIDED_LAW`; CPC: `CPC_READING_LAWS_B64`).
- Se o parágrafo cita só um pedaço ("art. 489, § 1º, IV"), aparece só esse pedaço. Citação sem detalhe: artigo inteiro
  (até 14 linhas); artigo maior mostra o começo e `[…]`, com o link para a fonte oficial.
- Não repete o mesmo artigo na mesma seção. Os blocos agrupados antigos ("Lei seca · N artigos") ficam só com o que
  não foi citado no parágrafo da mesma seção — nenhum artigo some.
- Lista, tabela e quadro: uma caixa depois do bloco (até 4 artigos); parágrafo solto: até 3 artigos por caixa.
- Títulos, intervalos longos ("arts. 40 a 78") e artigos de outras leis sem texto no catálogo não geram caixa.

## Arquivos
- Novo: `ui/law-inline-v1.js` (leitura de "art./§/inciso" e escolha do trecho).
- Civil: `ui/civil-law-disclosure-v1.js` (`inline`), `ui/civil-visual-apostila-v1.js`/`.css`, `ui/civil-native-study-v1.js`.
- CPC: `ui/cpc-apostila-reading-v1.js`/`.css` e os 20 carregadores `ui/cpc-*native-study-reader*.js`.
- Versões: `?v=20261120leiseca1`; lista offline `central-offline-files-v66172.json` atualizada.
- Testes: `tests/law-inline-unit.mjs` (4 testes; Civil M01–M15 sem perda de artigo e com texto literal; CPC; idempotência).

## Medições (offline, texto de hoje)
- Civil: de 300 citações de artigo nos 15 módulos, 300 têm texto de lei no catálogo; surgem 17, 19, 13, 45… caixas
  contextuais por módulo (ex.: M01 17, M05 39, M11 27).
- CPC: as caixas contextuais aparecem em todos os módulos que citam artigos; o catálogo tem 667 artigos do CPC.

## Pendências
- Na teoria completa do CPC M06 (e possivelmente outros), alguns quadros aparecem como texto corrido (problema de
  formatação anterior a esta mudança; as tabelas já corrigidas foram as dos resumos).
- Nada foi publicado: depende de "pode publicar" do proprietário.
