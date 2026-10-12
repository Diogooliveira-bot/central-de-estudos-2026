# Lei em Dia — continuação da PR #86 sem revisão de comentários

**Data:** 12/10/2026  
**Branch:** `audit/lei-em-dia-integral-20261012`  
**Escopo autorizado nesta continuação:** corrigir gabaritos comprovadamente errados, referências legislativas, ortografia, interface e responsividade. **A revisão e a reescrita dos comentários explicativos ficam adiadas.**

## Intervenções realizadas

1. **Referências de Direito Administrativo** em `tools/decorando-data-adm-pack2.js`: corrigido `Lei 13.303/2026` para `Lei 13.303/2016` (uma ocorrência); `Lei 1\`3.848/19` para `Lei 13.848/19` (duas ocorrências); `3º Região` para `3ª Região` (quatro ocorrências) e dois parênteses excedentes. Apenas campos de referência e identificação foram alterados.
2. **Metadado de Direito Processual Penal** em `tools/decorando-data-cpp.js`: duas referências da origem corrigidas de `3º Região` para `3ª Região`. O texto da questão, sua resposta e o comentário permanecem intactos.
2-A. **Metadados de outras disciplinas** em `tools/decorando-data-restantes.js`: corrigidas mais seis ocorrências de `3º Região` para `3ª Região` nos campos de origem da banca, preservando enunciados, gabaritos e comentários.
3. **Interface** em `tools/decorando.html`: Foco e Scroll agora compartilham a função `answerButtons`, evitando implementações divergentes; botões com acessibilidade (`aria-pressed`, `role="group"`, `type="button"`), fonte/tamanho de toque adequados, foco de teclado e melhor adaptação a larguras pequenas.
4. **Avisos jurídicos**: mensagens de gabarito ainda pendente deixam de ser rotuladas indevidamente como mera atualização legislativa.
5. **Testes**: ajustados os testes do leitor e preservada a cadeia de rastreabilidade entre o SHA original dos arquivos, no inventário, e o SHA após correções. Criado `tests/lei-em-dia-catalogo-integridade.mjs` e incluído no workflow da PR.

## Verificações e limites

- Inspeção programática dos cinco grandes bancos principais (`cf`, `civil`, `penal`, `cpc`, `cpp`): **10.446 questões**, com enunciados não vazios, respostas booleanas, fontes preenchidas, fundamentos em `parts` e **nenhum ID duplicado entre essas bases**. Houve registro de anos não informados; nenhuma data foi inventada.
- A nova suíte percorre os arquivos enumerados no inventário e verifica o conjunto completo de **12.408 registros estimados**: contagem por arquivo, IDs, estrutura de gabarito, fontes e referências conhecidamente incorretas. **Essas verificações não certificam a correção jurídica individual dos gabaritos.**
- Nenhum gabarito foi alterado nesta continuação. Correções de respostas dependem de confronto com legislação oficial, jurisprudência quando cabível, e prova/gabarito de origem.
- **Confronto independente de banca**: na prova do CRQ-XIX/PB (Quadrix, 2024), item 51, o gabarito definitivo de 23/09/2024 é **E (errado)** para ambos os cargos; a questão `adm-9784-20261008-q003` já está com `answer: false`. Evidência institucional: https://crq19.org.br/wp-content/uploads/2025/02/1_CRQ-XIX_concurso_publico_2024_gabarito_definitivo_prova_objetiva.pdf (primeira página, quadros de itens 41–60). **Não houve troca de resposta; a observação de ambiguidade redacional e o comentário permanecem pendentes para outra etapa.**
- Os três IDs do piloto (`adm-9784-20261008-q003`, `adm-9784-20261008-q032`, `adm-9784-20261008-q048`) continuam explicitamente pendentes de certificação individual; seus gabaritos anteriores não foram trocados por suposição.
- **Comentários explicativos:** não reescritos nesta continuação. As pendências antes registradas (295 genéricos e 813 reproduções literais) permanecem para uma etapa futura.
- **Integridade:** sem alterações de IDs, chaves de armazenamento local, histórico, progresso ou dados persistidos. Sem mudanças deliberadas no conteúdo de prova ou nos fundamentos legais dos registros.
- **Produção:** `main` não foi alterada nem houve merge. Esta PR continua em rascunho.
- **Preview:** a Vercel havia informado um preview READY para um commit anterior da PR às 21h51 UTC, mas commits posteriores receberam limitação de implantação. Não considerar aquela prévia como validação desta continuação; validar a implantação correspondente ao SHA final antes de qualquer publicação.

## Fontes oficiais para correções das referências

- Lei nº 13.303, de **30/06/2016**: https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2016/lei/l13303.htm
- Lei nº 13.848, de **25/06/2019**: https://www.planalto.gov.br/ccivil_03/_ato2019-2022/2019/lei/l13848.htm
- Lei nº 9.784/1999, texto consolidado: https://www2.camara.leg.br/legin/fed/lei/1999/lei-9784-29-janeiro-1999-322239-normaatualizada-pl.html

## Pendente antes de aprovar a publicação

Certificar juridicamente os gabaritos das oito disciplinas, conferir alterações legislativas e jurisprudência pertinente, resolver as questões ambíguas, revisar enunciados integralmente e realizar teste visual autenticado no dispositivo real. A revisão individualizada dos **comentários** está expressamente fora desta fase. Não fazer merge sem autorização do responsável.
