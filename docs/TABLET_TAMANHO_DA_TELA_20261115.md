# Tablet: tamanho da tela e menu do topo — 15/11/2026

Situação: **branch de trabalho, não publicada**. Publicar depende de autorização do proprietário.

## Problema
Em tablet a Central usava os mesmos tamanhos do computador: a maior parte do texto ficava entre 11 e 13 px (alguns trechos em 10 px) e o menu do topo cortava atalhos (iPad em pé: só 3 visíveis; deitado: "Filtros" cortado). Tablets de 744–800 px usam o layout de celular; os de 801 px ou mais usam o menu do computador.

## O que mudou
1. **Menu do topo em tablet** (`ui/tablet-scale-v1.css`, toque, 801–1366 px de largura, ≥ 700 px de altura): 1ª linha logomarca + "Mais"; 2ª linha com os 7 atalhos em colunas iguais (ícone em cima, nome embaixo). Nada de atalho cortado. Celular e computador não mudam.
2. **Opção "Tamanho da tela"** em Configurações (`ui/tablet-scale-v1.js`), só em aparelho de toque com lado menor ≥ 700 px: **Normal** (padrão) / **Maior** (115%) / **Muito maior** (130%). Escolha vale só para o aparelho (`central-v6:ui-scale:v1`, fora da sincronização de progresso).
   - Mecanismo: reduz a largura que o navegador usa para montar a página (meta `viewport`, ex.: 820 → 713 px). Isso mantém `vh`/`dvh` e as media queries coerentes; por isso **não** se usa o CSS `zoom` (testado: com `zoom` as janelas ficavam 15% maiores que a tela na horizontal).
   - O carregador (`central-v119.html`) já monta a largura certa na 1ª carga; o módulo reajusta ao girar o aparelho.
   - Consequência de design: em "Maior" no iPad em pé a largura (713 px) cai no layout de celular (menu inferior).

## Verificações
`npm test` (382) e `test:premium-protection` passam. Testado em Chromium (iPad mini/Air/Pro, em pé e deitado; celular e computador inalterados).
**Não verificado:** Safari do iPad e navegadores Android reais (a emulação não reaplica a meta `viewport` dinamicamente). Testar em tablet real antes de recomendar a opção a todos os alunos.
