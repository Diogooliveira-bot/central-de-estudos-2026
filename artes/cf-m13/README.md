# Artes de Revisão Guiada — Direito Constitucional M13

O escopo segue os 12 tópicos reais de `content/cf/m13-teoria-guiada-data.js`, sem alterar títulos ou capítulos.

## Gerar as artes

```sh
python3 artes/cf-m13/render.py
```

O renderer reutiliza o template programático e os arquivos originais de logo e personagem copiados do padrão já usado na Central. Ele gera PNGs de 1229 × 1536 em `artes/cf-m13/png/` e WebPs otimizados para a aplicação em `assets/cf/revisao-guiada/m13/`.

Os quatro pictogramas de cada capítulo são associados aos quatro quadros informativos e usam desenhos SVG vetoriais. Os textos são substituídos por dados de `data.json`; a estrutura visual permanece fixa.
