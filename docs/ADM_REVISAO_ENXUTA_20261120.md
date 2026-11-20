# Direito Administrativo — "Versão de revisão" mais enxuta (20/11/2026)

Pedido do proprietário: o texto de revisão de ADM estava completo demais; deixar mais enxuto, **sem jurisprudência e sem doutrina pesada**.

## O que foi feito (M01–M20)
- Arquivos: `content/adm/autor-20261110/adm-mNN-submitted-review.js` (só o texto de revisão). A teoria completa e as questões internas
  (`mNN-apostila-summary/complete.js`) **não foram alteradas**; a parte de questões do resumo continua idêntica.
- Cada módulo teve um editor (corte) e um aprovador independente (conferência jurídica, restos de jurisprudência, costura).
- Redução de texto por módulo (palavras): M01 −33%, M02 −32%, M03 −33%, M04 −32%, M05 −30%, M06 −33%, M07 −30%, M08 −27%,
  M09 −32%, M10 −30%, M11 −30%, M12 −33%, M13 −30%, M14 −29%, M15 −29%, M16 −27%, M17 −15% (já era curto), M18 −28%, M19 −29%, M20 −29%.
  Total: cerca de 76 mil para cerca de 53 mil palavras.
- Saíram: súmulas (comuns e vinculantes), temas de repercussão geral/repetitivos, ADI/ADPF/ADC, RE/REsp/MS/HC, informativos,
  acórdãos do TCU, links de jurisprudência, as linhas de jurisprudência de "Fontes normativas e jurisprudenciais" (agora "Fontes normativas"),
  nomes de autores, "a doutrina diverge…", classificações extensas, repetições e exemplos redundantes.
- Mantidos: todos os capítulos (`<h2>`), as 43 tabelas, definições, regras da lei com artigo e "Lei nº X/AAAA", exemplos curtos.
- Quando uma regra consolidada vinha só de súmula/decisão e era essencial, ela ficou explicada em palavras simples, sem citar a decisão
  (ex.: nepotismo no M01). Detalhes de origem puramente jurisprudencial **não** foram repostos (ex.: falta de advogado no PAD, execução de decisão do TCU,
  divulgação de nome e remuneração, subsidiariedade da Lei 9.784 em estados e municípios).
- Os aprovadores também recolocaram regras de lei que o corte havia tirado por engano (ex.: ressalva do art. 42 da Lei 9.784 no M06; art. 13, III;
  art. 41, § 2º, da CF no M05; prescrição do art. 73 da Lei 13.019 e art. 37, § 5º, da CF no M11; limites do art. 12 da Lei 8.429 no M13).
- Dados voláteis cortados: valores em reais dos limites de dispensa (M17), alguns decretos recentes (M11, M17).

## Títulos alterados
- "Fontes normativas e jurisprudenciais" → "Fontes normativas" (M01–M09).
- M13: "08 Prescrição: o prazo e a mudança decidida em 2026" → "08 Prescrição: prazo, suspensão, interrupção e ressarcimento";
  "09 Aplicação no tempo e outras decisões do STF" → "09 Aplicação no tempo e independência das esferas".
- M17: "05 Dispensa por valor: os limites vigentes em 2026" → "05 Dispensa por valor".
- Os identificadores internos (âncoras) dos títulos não mudaram.

## Testes
- `tests/adm-autoral-m01-m20-unit.mjs`: o piso de palavras do conjunto passou de 60 mil para 45 mil (a regra anterior pedia material completo); demais exigências
  (capítulos, seções, tabelas, perguntas e gabarito idênticos, teoria completa idêntica) continuam.

## Pendências
- Planalto e STF não abrem neste ambiente; a conferência foi em fontes secundárias. Conferir no texto oficial antes de publicar: EC 138/2025 e EC 139/2026,
  Lei nº 15.352/2026 (ANPD), Lei nº 15.364/2026 (OSCIP), Lei nº 15.391/2026 (MROSC; não incluída), Lei nº 14.965/2024 (concursos), Lei 13.019 art. 73.
- A Lei nº 15.391/2026 (parcerias emergenciais em calamidade) ficou de fora por ser recente; pode ser incluída depois.
- Publicação depende de "pode publicar" do proprietário.
