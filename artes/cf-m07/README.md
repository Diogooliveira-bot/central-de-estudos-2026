# Artes de Revisão Guiada — Direito Constitucional M7

O pacote gera as artes apenas do M7 e lê os 16 capítulos diretamente de
`content/cf/m07-teoria-guiada-data.js`.

## Recursos visuais

- Template em `template.html`, com proporções, hierarquia, cores, marca e mascote do template aprovado em M6.
- Logomarca e mascote reutilizados dos arquivos originais em `template-assets/`; não foram redesenhados.
- Os quatro marcadores dos quadros seguem a sequência aprovada no M6: 1, 2, 3 e ! (pegadinha).
- `art-content.json` contém a redação resumida das caixas; `data.json` guarda o conteúdo fonte completo e os títulos originais.

## Gerar

Na raiz do repositório:

```sh
node artes/cf-m07/build.mjs
python3 artes/cf-m07/render.py
```

O script cria PNGs 1229 × 1536 em `artes/cf-m07/png/` e WebPs diretamente em
`assets/cf/revisao-guiada/m07/` para uso pela Central. Em uma cópia
fora do repositório, os WebPs são criados em `webp/`.

Os nomes seguem `CF-M07-C01.png` até `CF-M07-C16.png`.
