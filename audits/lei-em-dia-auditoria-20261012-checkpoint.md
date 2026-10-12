# Base Completa — Auditoria Lei em Dia | checkpoint 12/10/2026

**Escopo:** somente `tools/decorando*` e documentação/testes da auditoria. Branch `audit/lei-em-dia-integral-20261012`; produção `main` preservada.

## Situação verificada

| Indicador | Resultado |
|---|---:|
| Objetos de questões no inventário inicial | 12.408 (estimativa; inclui contagens herdadas dos testes para 5 arquivos grandes) |
| Questões examinadas individualmente nesta execução | 26 |
| Conferidas pela literalidade dos arts. 1º e 2º da Lei 9.784/1999 | 23 |
| Pendências de interpretação no lote | 3 |
| Gabaritos alterados | 0 |
| Comentários explicativos reescritos após confronto legal | 23 |
| Comentários genéricos trocados por aviso explícito de pendência | 3 |
| Enunciados com ajustes ortográficos/pontuação | 4 |
| Trechos legais com ajustes de apresentação (numeração/espaço; sem alterar substância) | 9 |
| Outras questões com comentário genérico identificado e aviso automático de pendência na interface | 295 |
| Comentários identificados como mera transcrição do artigo nos arquivos lidos | 813 (145 Civil, 142 CPC, 98 CF, 428 disciplinas restantes) |
| Erros de gabarito definitivamente comprovados neste lote | 0 |
| Testes estáticos efetuados na branch | PASSOU: 26 IDs únicos, 23/3 status, zero comentários-padrão no piloto, tipos de gabarito, fontes e encaixe dos avisos no HTML |
| Testes Node automatizados existentes executados | NÃO: execução remota indisponível nesta sessão; teste novo foi versionado |
| Testes visuais do Lei em Dia autenticado | NÃO: URL publicada redireciona para login |
| Prévia Vercel gerada | NÃO: API `402 api-deployments-free-per-day`, limite diário de 100 deployments atingido |
| Produção modificada | NÃO |

## Questões da Lei 9.784/1999 com comentário individualizado

Referência para todos os IDs desta seção: `tools/decorando-data-adm-9784.js`. Em cada item, resposta anterior mantida e comentário substituído por justificativa objetiva do dispositivo indicado no próprio registro.

- `Direito Administrativo | tools/decorando-data-adm-9784.js | adm-9784-20261008-q001`
- `Direito Administrativo | tools/decorando-data-adm-9784.js | adm-9784-20261008-q006`
- `Direito Administrativo | tools/decorando-data-adm-9784.js | adm-9784-20261008-q007`
- `Direito Administrativo | tools/decorando-data-adm-9784.js | adm-9784-20261008-q012`
- `Direito Administrativo | tools/decorando-data-adm-9784.js | adm-9784-20261008-q013`
- `Direito Administrativo | tools/decorando-data-adm-9784.js | adm-9784-20261008-q015`
- `Direito Administrativo | tools/decorando-data-adm-9784.js | adm-9784-20261008-q016`
- `Direito Administrativo | tools/decorando-data-adm-9784.js | adm-9784-20261008-q019`
- `Direito Administrativo | tools/decorando-data-adm-9784.js | adm-9784-20261008-q021`
- `Direito Administrativo | tools/decorando-data-adm-9784.js | adm-9784-20261008-q026`
- `Direito Administrativo | tools/decorando-data-adm-9784.js | adm-9784-20261008-q027`
- `Direito Administrativo | tools/decorando-data-adm-9784.js | adm-9784-20261008-q031`
- `Direito Administrativo | tools/decorando-data-adm-9784.js | adm-9784-20261008-q033`
- `Direito Administrativo | tools/decorando-data-adm-9784.js | adm-9784-20261008-q034`
- `Direito Administrativo | tools/decorando-data-adm-9784.js | adm-9784-20261008-q035`
- `Direito Administrativo | tools/decorando-data-adm-9784.js | adm-9784-20261008-q036`
- `Direito Administrativo | tools/decorando-data-adm-9784.js | adm-9784-20261008-q037`
- `Direito Administrativo | tools/decorando-data-adm-9784.js | adm-9784-20261008-q038`
- `Direito Administrativo | tools/decorando-data-adm-9784.js | adm-9784-20261008-q040`
- `Direito Administrativo | tools/decorando-data-adm-9784.js | adm-9784-20261008-q041`
- `Direito Administrativo | tools/decorando-data-adm-9784.js | adm-9784-20261008-q042`
- `Direito Administrativo | tools/decorando-data-adm-9784.js | adm-9784-20261008-q043`
- `Direito Administrativo | tools/decorando-data-adm-9784.js | adm-9784-20261008-q050`

## Questões revisadas mas NÃO certificadas

- `Direito Administrativo | tools/decorando-data-adm-9784.js | adm-9784-20261008-q003` — PENDENTE DE REVISÃO: o enunciado menciona apenas a Administração Federal direta, mas não afirma expressamente que a lei se aplica exclusivamente a ela. Embora o art. 1º inclua direta e indireta, a omissão isolada pode tornar o item semanticamente ambíguo. Necessário conferir enunciado e gabarito da banca original.
- `Direito Administrativo | tools/decorando-data-adm-9784.js | adm-9784-20261008-q032` — PENDENTE DE REVISÃO: o inciso V do parágrafo único do art. 2º remete expressamente ao sigilo previsto na Constituição, enquanto o item emprega 'previstas na Lei'. A interpretação da ressalva e o contexto da prova exigem conferência antes de confirmar o gabarito.
- `Direito Administrativo | tools/decorando-data-adm-9784.js | adm-9784-20261008-q048` — PENDENTE DE REVISÃO: a assertiva sobre informalismo, concursos e licitações envolve limites próprios dos procedimentos competitivos e possível jurisprudência pertinente. O art. 2º, parágrafo único, VIII, isoladamente, não basta para certificar o gabarito.

## Comentários genéricos ainda sem validação jurídica individual

Há 295 questões de Direito Administrativo em `tools/decorando-data-adm-pack1.js` e `tools/decorando-data-adm-pack2.js` com a mensagem 'Gabarito reproduzido do arquivo fornecido. A validação jurídica está pendente.' Seus IDs e gabaritos foram preservados. Os avisos passaram a ser detectados visualmente pelo Leitor (Foco/Scroll), sem declarar os itens como corretos.

- `adm-8112-pdf53-q001` — `53.pdf · questão 1 · Art. 1°, Lei n° 8.112/90`
- `adm-8112-pdf53-q003` — `53.pdf · questão 3 · Art. 2º, Lei 8.112/90`
- `adm-8112-pdf53-q004` — `53.pdf · questão 4 · Art. 2º, Lei 8.112/90`
- `adm-8112-pdf53-q006` — `53.pdf · questão 6 · Art. 3°, Lei n° 8.112/90`
- `adm-8112-pdf53-q007` — `53.pdf · questão 7 · Art. 3º, § único, Lei 8.112/90`
- `adm-8112-pdf53-q008` — `53.pdf · questão 8 · Art. 3º, Lei 8.112/90`
- `adm-8112-pdf53-q011` — `53.pdf · questão 11 · Art. 3º, § único, Lei 8.112/90`
- `adm-8112-pdf53-q012` — `53.pdf · questão 12 · Art. 4°, Lei 8.112/90`
- `adm-8112-pdf53-q013` — `53.pdf · questão 13 · Art. 4º, Lei 8.112/90`
- `adm-8112-pdf53-q014` — `53.pdf · questão 14 · Art. 5º, Lei 8.112/90`
- `adm-8112-pdf53-q017` — `53.pdf · questão 17 · Art. 5º, Lei 8.112/90`
- `adm-8112-pdf53-q020` — `53.pdf · questão 20 · Art. 5º, I, Lei 8.112/90`
- `adm-8112-pdf53-q021` — `53.pdf · questão 21 · Art. 5º, I, Lei 8.112/90`
- `adm-8112-pdf53-q024` — `53.pdf · questão 24 · Art. 5º, II, Lei 8.112/90`
- `adm-8112-pdf53-q025` — `53.pdf · questão 25 · Art. 5º, II, Lei 8.112/90`
- `adm-8112-pdf53-q026` — `53.pdf · questão 26 · Art. 5º, III, Lei 8.112/90`
- `adm-8112-pdf53-q027` — `53.pdf · questão 27 · Art. 5º, V, Lei 8.112/90`
- `adm-8112-pdf53-q028` — `53.pdf · questão 28 · Art. 5º, § 1º, Lei 8.112/90`
- `adm-8112-pdf53-q031` — `53.pdf · questão 31 · Art. 5º, § 2º, Lei 8.112/90`
- `adm-8112-pdf53-q032` — `53.pdf · questão 32 · Art. 5º, § 2º, Lei 8.112/90`
- `adm-8112-pdf53-q035` — `53.pdf · questão 35 · Art. 5º, § 3º, Lei 8.112/90`
- `adm-8112-pdf53-q036` — `53.pdf · questão 36 · Art. 6º, Lei 8.112/90`
- `adm-8112-pdf53-q037` — `53.pdf · questão 37 · Art. 7º, Lei 8.112/90`
- `adm-8112-pdf53-q041` — `53.pdf · questão 41 · Art. 7º, Lei 8.112/90`
- `adm-8112-pdf53-q044` — `53.pdf · questão 44 · Art. 8º, Lei 8.112/90`
- `adm-8112-pdf53-q049` — `53.pdf · questão 49 · Art. 8º, Lei 8.112/90`
- `adm-8429-pdf57-q001` — `57.pdf · questão 1 · Art. 1ª, Lei 8.429/1992`
- `adm-8429-pdf57-q002` — `57.pdf · questão 2 · Art. 1º, Lei 8.429/92`
- `adm-8429-pdf57-q004` — `57.pdf · questão 4 · Art. 1º, § 1º, Lei 8.429/92`
- `adm-8429-pdf57-q014` — `57.pdf · questão 14 · Art. 1º, § 1º, Lei 8.429/92`
- `adm-8429-pdf57-q030` — `57.pdf · questão 30 · Art. 1º, § 3º, Lei 8.429/92`
- `adm-8429-pdf57-q037` — `57.pdf · questão 37 · Art. 1º, § 2º, Lei 8.429/92`
- `adm-8429-pdf57-q043` — `57.pdf · questão 43 · Art. 1º, § 2º, Lei 8.429/92`
- `adm-8429-pdf57-q050` — `57.pdf · questão 50 · Art. 1º, § 3º, Lei 8.429/92`
- `adm-12527-pdf20-q002` — `20.pdf · questão 2 · Art. 1º, § único, Lei 12.527/2011`
- `adm-12527-pdf20-q003` — `20.pdf · questão 3 · Art. 1º, § único, I, Lei 12.527/2011`
- `adm-12527-pdf20-q004` — `20.pdf · questão 4 · Art. 1º, § único, II, Lei 12.527/2011`
- `adm-12527-pdf20-q005` — `20.pdf · questão 5 · Art. 1º, § único, II, Lei 12.527/2011`
- `adm-12527-pdf20-q009` — `20.pdf · questão 9 · Art. 2º, Lei 12.527/2011`
- `adm-12527-pdf20-q011` — `20.pdf · questão 11 · Art. 2º, Lei 12.527/2011`
- `adm-12527-pdf20-q012` — `20.pdf · questão 12 · Art. 3º, I, Lei 12.527/2011`
- `adm-12527-pdf20-q013` — `20.pdf · questão 13 · Art. 3º, I, Lei 12.527/2011`
- `adm-12527-pdf20-q014` — `20.pdf · questão 14 · Art. 3º, II, Lei 12.527/2011`
- `adm-12527-pdf20-q018` — `20.pdf · questão 18 · Art. 3º, II, Lei 12.527/2011`
- `adm-12527-pdf20-q019` — `20.pdf · questão 19 · Art. 4º, I, Lei 12.527/2011`
- `adm-12527-pdf20-q020` — `20.pdf · questão 20 · Art. 4º, III, Lei 12.527/2011`
- `adm-12527-pdf20-q021` — `20.pdf · questão 21 · Art. 4º, III, Lei 12.527/2011`
- `adm-12527-pdf20-q022` — `20.pdf · questão 22 · Art. 4º, V, Lei 12.527/2011`
- `adm-12527-pdf20-q024` — `20.pdf · questão 24 · Art. 5º, Lei 12.527/2011`
- `adm-12527-pdf20-q025` — `20.pdf · questão 25 · Art. 5º, Lei 12.527/2011`
- `adm-12527-pdf20-q027` — `20.pdf · questão 27 · Art. 7º, II, Lei 12.527/2011`
- `adm-12527-pdf20-q028` — `20.pdf · questão 28 · Art. 7º, II, Lei 12.527/2011`
- `adm-12527-pdf20-q029` — `20.pdf · questão 29 · Art. 7º, III, Lei 12.527/2011`
- `adm-12527-pdf20-q030` — `20.pdf · questão 30 · Art. 7º, III, Lei 12.527/2011`
- `adm-12527-pdf20-q031` — `20.pdf · questão 31 · Art. 7º, VII, b, Lei 12.527/2011`
- `adm-12527-pdf20-q032` — `20.pdf · questão 32 · Art. 7º, VII, b, Lei 12.527/2011`
- `adm-12527-pdf20-q033` — `20.pdf · questão 33 · Art. 7º, § 1º, Lei 12.527/2011`
- `adm-12527-pdf20-q034` — `20.pdf · questão 34 · Art. 7º, § 1º, Lei 12.527/2011`
- `adm-12527-pdf20-q039` — `20.pdf · questão 39 · Art. 7º, § 2º, Lei 12.527/2011`
- `adm-12527-pdf20-q041` — `20.pdf · questão 41 · Art. 7º, § 2º, LAI`
- `adm-12527-pdf20-q044` — `20.pdf · questão 44 · Art. 7º, § 3º, Lei 12.527/2011`
- `adm-12527-pdf20-q045` — `20.pdf · questão 45 · Art. 7º, § 3º, Lei 12.527/2011`
- `adm-12527-pdf20-q046` — `20.pdf · questão 46 · Art. 7º, § 4º, Lei 12.527/2011`
- `adm-12527-pdf20-q047` — `20.pdf · questão 47 · Art. 7º, § 5º, Lei 12.527/2011`
- `adm-12527-pdf20-q048` — `20.pdf · questão 48 · Art. 7º, § 5º, Lei 12.527/2011`
- `adm-12527-pdf20-q049` — `20.pdf · questão 49 · Art. 8º, Lei 12.527/2011`
- `adm-12527-pdf20-q050` — `20.pdf · questão 50 · Art. 8º, Lei 12.527/2011`
- `adm-13709-pdf31-q005` — `31.pdf · questão 5 · Art. 1º, LGPD`
- `adm-13709-pdf31-q010` — `31.pdf · questão 10 · Art. 1º, LGPD`
- `adm-13709-pdf31-q012` — `31.pdf · questão 12 · Art. 2º, I, LGPD`
- `adm-13709-pdf31-q013` — `31.pdf · questão 13 · Art. 2º, I, LGPD`
- `adm-13709-pdf31-q014` — `31.pdf · questão 14 · Art. 2º, I e IV, LGPD`
- `adm-13709-pdf31-q017` — `31.pdf · questão 17 · Art. 2º, II, LGPD`
- `adm-13709-pdf31-q018` — `31.pdf · questão 18 · Art. 2º, II, LGPD`
- `adm-13709-pdf31-q019` — `31.pdf · questão 19 · Art. 2º, II e III, LGPD`
- `adm-13709-pdf31-q021` — `31.pdf · questão 21 · Art. 2º, III, LGPD`
- `adm-13709-pdf31-q022` — `31.pdf · questão 22 · Art. 2º, III, LGPD`
- `adm-13709-pdf31-q025` — `31.pdf · questão 25 · Art. 2º, IV, LGPD`
- `adm-13709-pdf31-q026` — `31.pdf · questão 26 · Art. 2º, IV, LGPD`
- `adm-13709-pdf31-q029` — `31.pdf · questão 29 · Art. 2º, V, LGPD`
- `adm-13709-pdf31-q033` — `31.pdf · questão 33 · Art. 2º, V, LGPD`
- `adm-13709-pdf31-q038` — `31.pdf · questão 38 · Art. 2º, VI, LGPD`
- `adm-13709-pdf31-q040` — `31.pdf · questão 40 · Art. 2º, VI, LGPD`
- `adm-13709-pdf31-q041` — `31.pdf · questão 41 · Art. 2º, VII, LGPD`
- `adm-13709-pdf31-q042` — `31.pdf · questão 42 · Art. 2º, VII, LGPD`
- `adm-13709-pdf31-q044` — `31.pdf · questão 44 · Art. 3º, I, LGPD`
- `adm-13709-pdf31-q045` — `31.pdf · questão 45 · Art. 3º, II, LGPD`
- `adm-13709-pdf31-q047` — `31.pdf · questão 47 · Art. 3º, II, LGPD`
- `adm-13709-pdf31-q048` — `31.pdf · questão 48 · Art. 3º, III, Lei 13.709/2018`
- `adm-13709-pdf31-q050` — `31.pdf · questão 50 · Art. 3º, III, LGPD`
- `adm-dl200-pdf1-q002` — `1.pdf · questão 2 · Art. 4º, I, DEL 200/67`
- `adm-dl200-pdf1-q003` — `1.pdf · questão 3 · Art. 4º, § único, DEL 200/67`
- `adm-dl200-pdf1-q004` — `1.pdf · questão 4 · Art. 5º, Decreto-Lei 200/1967`
- `adm-dl200-pdf1-q005` — `1.pdf · questão 5 · Art. 5º, I, DEL 200/67`
- `adm-dl200-pdf1-q006` — `1.pdf · questão 6 · Art. 5°, I, DEL 200/1967`
- `adm-dl200-pdf1-q007` — `1.pdf · questão 7 · Art. 5°, II, DEL 200/1967`
- `adm-dl200-pdf1-q008` — `1.pdf · questão 8 · Art. 5°, II, DEL 200/1967`
- `adm-dl200-pdf1-q009` — `1.pdf · questão 9 · Art. 5°, III, DEL 200/1967`
- `adm-dl200-pdf1-q010` — `1.pdf · questão 10 · Art. 5º, IV, DEL 200/67`
- `adm-dl200-pdf1-q015` — `1.pdf · questão 15 · Art. 6°, I e II, DEL 200/1967`
- `adm-dl200-pdf1-q016` — `1.pdf · questão 16 · Art. 6°, IV, DEL 200/1967`
- `adm-dl200-pdf1-q017` — `1.pdf · questão 17 · Art. 10, § 1º, c), Decreto-Lei 200/1967`
- `adm-dl200-pdf1-q018` — `1.pdf · questão 18 · Art. 12, DEL 200/1967`
- `adm-dl200-pdf1-q019` — `1.pdf · questão 19 · Art. 13, DEL 200/1967`
- `adm-dl200-pdf1-q022` — `1.pdf · questão 22 · Art. 17, Decreto-Lei 200/1967`
- `adm-dl200-pdf1-q023` — `1.pdf · questão 23 · Art. 18, Decreto-Lei 200/1967`
- `adm-dl200-pdf1-q024` — `1.pdf · questão 24 · Art. 25, VII, DEL 200/1967`
- `adm-dl200-pdf1-q025` — `1.pdf · questão 25 · Art. 36, DEL 200/1967`
- `adm-dl200-pdf1-q026` — `1.pdf · questão 26 · Art. 47, DEL 200/1967`
- `adm-dl200-pdf1-q027` — `1.pdf · questão 27 · Art. 72, DEL 200/1967`
- `adm-dl200-pdf1-q028` — `1.pdf · questão 28 · Art. 73, DEL 200/1967`
- `adm-dl200-pdf1-q029` — `1.pdf · questão 29 · Art. 89, DEL 200/1967`
- `adm-dl200-pdf1-q030` — `1.pdf · questão 30 · Art. 94, X, DEL 200/1967`
- `adm-dl200-pdf1-q031` — `1.pdf · questão 31 · Art. 183, DEL 200/1967`
- `adm-dl200-pdf1-q033` — `1.pdf · questão 33 · Art. 4º, II, DEL 200/67`
- `adm-dl200-pdf1-q034` — `1.pdf · questão 34 · Art. 5º, IV, DEL 200/67`
- `adm-dl200-pdf1-q035` — `1.pdf · questão 35 · Art. 5º, DEL 200/67`
- `adm-dl200-pdf1-q036` — `1.pdf · questão 36 · Art. 6º, DEL 200/67`
- `adm-dl200-pdf1-q037` — `1.pdf · questão 37 · Art. 22, Decreto Lei 200/1967`
- `adm-8987-pdf59-q001` — `59.pdf · questão 1 · Art. 1º, § único, Lei 8.987/95`
- `adm-8987-pdf59-q003` — `59.pdf · questão 3 · Art. 2º, I, Lei 8.987/95`
- `adm-8987-pdf59-q004` — `59.pdf · questão 4 · Art. 2º, I, Lei 8.987/95`
- `adm-8987-pdf59-q023` — `59.pdf · questão 23 · Art. 2º, II, Lei 8.987/95`
- `adm-8987-pdf59-q044` — `59.pdf · questão 44 · Art. 2º, II, Lei 8.987/95`
- `adm-8987-pdf59-q047` — `59.pdf · questão 47 · Art. 2º, II e IV, Lei 8.987/95`
- `adm-8987-pdf59-q048` — `59.pdf · questão 48 · Art. 2º, II e IV, Lei 8.987/95`
- `adm-12846-pdf22-q001` — `22.pdf · questão 1 · Art. 1º, Lei 12.846/2013`
- `adm-12846-pdf22-q002` — `22.pdf · questão 2 · Art. 1º, Lei 12.846/2013`
- `adm-12846-pdf22-q011` — `22.pdf · questão 11 · Art. 1º, § único, Lei 12.846/2013`
- `adm-12846-pdf22-q018` — `22.pdf · questão 18 · Art. 1º, parágrafo único, Lei 12.846/2013`
- `adm-12846-pdf22-q035` — `22.pdf · questão 35 · Art. 2º, Lei 12.846/2013`
- `adm-12846-pdf22-q036` — `22.pdf · questão 36 · Art. 2º, Lei 12.846/2013`
- `adm-13019-pdf24-q002` — `24.pdf · questão 2 · Art. 2º, I, a, Lei 13.019/2014`
- `adm-13019-pdf24-q006` — `24.pdf · questão 6 · Art. 2º, I, “c”, Lei 13.019/2014`
- `adm-13019-pdf24-q010` — `24.pdf · questão 10 · Art. 2º, III, Lei 13.019/2014`
- `adm-13019-pdf24-q012` — `24.pdf · questão 12 · Art. 2º, III-A, Lei 13.019/2014`
- `adm-13019-pdf24-q013` — `24.pdf · questão 13 · Art. 2º, IV, Lei 13.019/2014`
- `adm-13019-pdf24-q015` — `24.pdf · questão 15 · Art. 2º, VII, Lei 13.019/2014`
- `adm-13019-pdf24-q016` — `24.pdf · questão 16 · Art. 2º, VII, Lei 13.019/14`
- `adm-13019-pdf24-q017` — `24.pdf · questão 17 · Art. 2º, VIII, Lei 13.019/2014`
- `adm-13019-pdf24-q025` — `24.pdf · questão 25 · Art. 2º, VIII, Lei 13.019/2014`
- `adm-13019-pdf24-q028` — `24.pdf · questão 28 · Art. 2º, VIII-A, Lei 13.019/2014`
- `adm-13019-pdf24-q041` — `24.pdf · questão 41 · Art. 2º, IX, Lei 13.019/2014`
- `adm-13019-pdf24-q042` — `24.pdf · questão 42 · Art. 2º, X, Lei 13.019/2014`
- `adm-13019-pdf24-q045` — `24.pdf · questão 45 · Art. 2º, XII, Lei 13.019/2014`
- `adm-13019-pdf24-q046` — `24.pdf · questão 46 · Art. 2º, XII, Lei 13.019/2014`
- `adm-13019-pdf24-q048` — `24.pdf · questão 48 · Art. 3º, IX, Lei 13.019/2014`
- `adm-13019-pdf24-q049` — `24.pdf · questão 49 · Art. 5º, Lei 13.019/2014`
- `adm-13019-pdf24-q050` — `24.pdf · questão 50 · Art. 5º, IX, Lei 13.019/2014`
- `adm-11107-pdf9-q001` — `9.pdf · questão 1 · Art. 1º, Lei 11.107/2005`
- `adm-11107-pdf9-q002` — `9.pdf · questão 2 · Art. 1º, Lei 11.107/2005`
- `adm-11107-pdf9-q006` — `9.pdf · questão 6 · Art. 1º, § 1º, Lei 11.107/2005`
- `adm-11107-pdf9-q013` — `9.pdf · questão 13 · Art. 1º, § 1º, Lei 11.107/2005`
- `adm-11107-pdf9-q026` — `9.pdf · questão 26 · Art. 1º, § 2º, Lei 11.107/2005`
- `adm-11107-pdf9-q031` — `9.pdf · questão 31 · Art. 1º, § 2º, Lei 11.107/2005`
- `adm-11107-pdf9-q035` — `9.pdf · questão 35 · Art. 1º, § 3º, Lei 11.107/2005`
- `adm-11107-pdf9-q036` — `9.pdf · questão 36 · Art. 1º, § 3º, Lei 11.107/2005`
- `adm-11107-pdf9-q038` — `9.pdf · questão 38 · Art. 1º, § 4º, Lei 11.107/2005`
- `adm-11107-pdf9-q039` — `9.pdf · questão 39 · Art. 2º, Lei 11.107/2005`
- `adm-11107-pdf9-q040` — `9.pdf · questão 40 · Art. 2º, Lei 11.107/2005`
- `adm-11107-pdf9-q041` — `9.pdf · questão 41 · Art. 2º, § 1º, I, Lei 11.107/2005`
- `adm-11107-pdf9-q042` — `9.pdf · questão 42 · Art. 2º, § 1º, Lei 11.107/2005`
- `adm-11107-pdf9-q043` — `9.pdf · questão 43 · Art. 2º, § 1º, I, Lei 11.107/2005`
- `adm-11107-pdf9-q045` — `9.pdf · questão 45 · Art. 2º, § 1º, I e III, Lei 11.107/2005`
- `adm-11107-pdf9-q046` — `9.pdf · questão 46 · Art. 2º, § 1º, II, Lei 11.107/2005`
- `adm-11107-pdf9-q049` — `9.pdf · questão 49 · Art. 2º, § 1º, II, Lei 11.107/2005`
- `adm-11079-pdf8-q001` — `8.pdf · questão 1 · Art. 1º, § único, Lei 11.079/2004`
- `adm-11079-pdf8-q002` — `8.pdf · questão 2 · Art. 1º, § único, Lei 11.079/2004`
- `adm-11079-pdf8-q003` — `8.pdf · questão 3 · Art. 1º, Lei 11.079/2004`
- `adm-11079-pdf8-q004` — `8.pdf · questão 4 · Art. 1º, Lei 11.079/2004`
- `adm-11079-pdf8-q011` — `8.pdf · questão 11 · Art. 2º, Lei 11.079/2004`
- `adm-11079-pdf8-q015` — `8.pdf · questão 15 · Art. 2º, Lei 11.079/2004`
- `adm-11079-pdf8-q032` — `8.pdf · questão 32 · Art. 2º, § 1º, Lei 11.079/2004`
- `adm-11079-pdf8-q033` — `8.pdf · questão 33 · Art. 2º, § 1º, Lei 11.079/2004`
- `adm-13303-pdf28-q001` — `28.pdf · questão 1 · Art. 1º, Lei 13.303/2016`
- `adm-13303-pdf28-q002` — `28.pdf · questão 2 · Art. 2°, Lei 13.303/2016`
- `adm-13303-pdf28-q003` — `28.pdf · questão 3 · Art. 2º, § 2º, Lei 13.303/2016`
- `adm-13303-pdf28-q005` — `28.pdf · questão 5 · Art. 3º, Lei 13.303/2016`
- `adm-13303-pdf28-q007` — `28.pdf · questão 7 · Art. 3º, Lei 13.303/2016`
- `adm-13303-pdf28-q009` — `28.pdf · questão 9 · Art. 3º, § único, Lei 13.303/2016`
- `adm-13303-pdf28-q013` — `28.pdf · questão 13 · Art. 4º, Lei 13.303/2016`
- `adm-13303-pdf28-q014` — `28.pdf · questão 14 · Arts. 4º, Lei 13.303/2016`
- `adm-13303-pdf28-q015` — `28.pdf · questão 15 · Art. 6º, Lei 13.303/2016`
- `adm-13303-pdf28-q016` — `28.pdf · questão 16 · Art. 6º, Lei 13.303/2016`
- `adm-13303-pdf28-q017` — `28.pdf · questão 17 · Art. 7º, Lei 13.303/2016`
- `adm-13303-pdf28-q019` — `28.pdf · questão 19 · Art. 8º, I, Lei 13.303/16`
- `adm-13303-pdf28-q020` — `28.pdf · questão 20 · Art. 8º, I, Lei 13.303/16`
- `adm-13303-pdf28-q021` — `28.pdf · questão 21 · Art. 8º, III, Lei 13.303/2016`
- `adm-13303-pdf28-q022` — `28.pdf · questão 22 · Art. 8º, IV, V e VII, Lei 13.303/2016`
- `adm-13303-pdf28-q023` — `28.pdf · questão 23 · Art. 8º, V, Lei 13.303/2016`
- `adm-13303-pdf28-q024` — `28.pdf · questão 24 · Art. 8º, VI, Lei 13.303/2016`
- `adm-13303-pdf28-q025` — `28.pdf · questão 25 · Art. 8º, VII, Lei 13.303/2016`
- `adm-13303-pdf28-q026` — `28.pdf · questão 26 · Art. 8º, VII, Lei 13.303/2016`
- `adm-13303-pdf28-q027` — `28.pdf · questão 27 · Art. 8º, VIII, Lei 13.303/16`
- `adm-13303-pdf28-q028` — `28.pdf · questão 28 · Art. 8º, IX, Lei 13.303/2016`
- `adm-13303-pdf28-q029` — `28.pdf · questão 29 · Art 8º, X, Lei 13.303/2016`
- `adm-13303-pdf28-q030` — `28.pdf · questão 30 · Art. 9º, § 1º, VI, Lei 13.303/2016`
- `adm-13303-pdf28-q031` — `28.pdf · questão 31 · Art. 9º, § 3º, II, Lei 13.303/2016`
- `adm-13303-pdf28-q032` — `28.pdf · questão 32 · Art. 11, Lei 13.303/2026`
- `adm-13303-pdf28-q033` — `28.pdf · questão 33 · Art. 11, I, Lei 13.303/2016`
- `adm-13303-pdf28-q035` — `28.pdf · questão 35 · Art. 11, I, Lei 13.303/2016`
- `adm-13303-pdf28-q036` — `28.pdf · questão 36 · Art. 11, II, Lei 13.303/2016`
- `adm-13303-pdf28-q037` — `28.pdf · questão 37 · Art. 15, § 1°, Lei 13.303/2016`
- `adm-13303-pdf28-q038` — `28.pdf · questão 38 · Art. 17, I, c, III, Lei 13.303/2016`
- `adm-13303-pdf28-q040` — `28.pdf · questão 40 · Art. 17, § 2º, I, Lei 13.303/2016`
- `adm-13303-pdf28-q041` — `28.pdf · questão 41 · Art. 17, § 2º, I, Lei 13.303/2016`
- `adm-13303-pdf28-q042` — `28.pdf · questão 42 · Art. 17, § 2º, II, Lei 13.303/2016`
- `adm-13303-pdf28-q043` — `28.pdf · questão 43 · Art. 17, § 2º, II, Lei 13.303/2016`
- `adm-13303-pdf28-q044` — `28.pdf · questão 44 · Art. 18, I, Lei 13.303/2016`
- `adm-13303-pdf28-q045` — `28.pdf · questão 45 · Art. 18, III, Lei 13.303/16`
- `adm-13303-pdf28-q046` — `28.pdf · questão 46 · Art 19-A, Lei 13.303/2016`
- `adm-13303-pdf28-q047` — `28.pdf · questão 47 · Art. 22, IV, Lei 13.303/2016`
- `adm-13303-pdf28-q048` — `28.pdf · questão 48 · Art. 24, Lei 13.303/2016`
- `adm-13303-pdf28-q049` — `28.pdf · questão 49 · Art. 24, § 1º, I, Lei 13.303/16`
- `adm-13303-pdf28-q050` — `28.pdf · questão 50 · Art. 24, § 1º, II, Lei 13.303/16`
- `adm-13848-pdf32-q001` — `32.pdf · questão 1 · Art. 2º, III e IV, Lei 13.848/2019`
- `adm-13848-pdf32-q002` — `32.pdf · questão 2 · Art. 2º, XII, Lei 13.848/2019`
- `adm-13848-pdf32-q003` — `32.pdf · questão 3 · Art. 2º, § único, Lei 13.848/2019`
- `adm-13848-pdf32-q004` — `32.pdf · questão 4 · Art. 2º, § único, Lei 13.848/2019`
- `adm-13848-pdf32-q012` — `32.pdf · questão 12 · Art. 3º, Lei 13.848/2019`
- `adm-13848-pdf32-q013` — `32.pdf · questão 13 · Art. 3º, Lei 13.848/2019`
- `adm-13848-pdf32-q014` — `32.pdf · questão 14 · Art. 3º, § 2º, I, “a”, Lei 13.848/2019`
- `adm-13848-pdf32-q015` — `32.pdf · questão 15 · Art. 3º, § 2º, I, a, b, Lei 1`3.848/19`
- `adm-13848-pdf32-q016` — `32.pdf · questão 16 · Art. 3º, § 2º, III, Lei 13.848/2019`
- `adm-13848-pdf32-q017` — `32.pdf · questão 17 · Art. 3º, § 3º, Lei 13.848/2019`
- `adm-13848-pdf32-q020` — `32.pdf · questão 20 · Art. 3º, § 3º, Lei 13.848/2019`
- `adm-13848-pdf32-q021` — `32.pdf · questão 21 · Art. 4º, Lei 13.848/2019`
- `adm-13848-pdf32-q022` — `32.pdf · questão 22 · Art. 5º, Lei 13.848/2019`
- `adm-13848-pdf32-q023` — `32.pdf · questão 23 · Art. 5º, Lei 13.848/2019`
- `adm-13848-pdf32-q024` — `32.pdf · questão 24 · Art. 6º, Lei 13.848/2019`
- `adm-13848-pdf32-q025` — `32.pdf · questão 25 · Art. 6º, Lei 1`3.848/19`
- `adm-13848-pdf32-q027` — `32.pdf · questão 27 · Art. 6º, § 1º, Lei 13.848/2019`
- `adm-13848-pdf32-q028` — `32.pdf · questão 28 · Art. 6º, § 3º, Lei 13.848/2019`
- `adm-13848-pdf32-q030` — `32.pdf · questão 30 · Art. 6º, § 4º, Lei 13.848/2019`
- `adm-13848-pdf32-q031` — `32.pdf · questão 31 · Art. 7º, Lei 13.848/2019`
- `adm-13848-pdf32-q032` — `32.pdf · questão 32 · Art. 7º, Lei 13.848/2019`
- `adm-13848-pdf32-q033` — `32.pdf · questão 33 · Art. 7º, § 2º, Lei 13.848/2019`
- `adm-13848-pdf32-q034` — `32.pdf · questão 34 · Art. 7º, § 2º, Lei 13.848/2019`
- `adm-13848-pdf32-q035` — `32.pdf · questão 35 · Art. 8º, Lei 13.848/2019`
- `adm-13848-pdf32-q036` — `32.pdf · questão 36 · Art. 8º, § 1º, Lei 13.848/2019`
- `adm-13848-pdf32-q037` — `32.pdf · questão 37 · Art. 8º, § 1º, Lei 13.848/2019`
- `adm-13848-pdf32-q038` — `32.pdf · questão 38 · Art. 8º, § 6º, Lei 13.848/2019`
- `adm-13848-pdf32-q039` — `32.pdf · questão 39 · Art. 9º, Lei 13.848/2019`
- `adm-13848-pdf32-q041` — `32.pdf · questão 41 · Art. 9º, Lei 13.848/2019`
- `adm-13848-pdf32-q042` — `32.pdf · questão 42 · Art. 9º, § 4º, Lei 13.848/2019`
- `adm-13848-pdf32-q043` — `32.pdf · questão 43 · Art. 9º, § 5º, Lei 13.848/2019`
- `adm-13848-pdf32-q044` — `32.pdf · questão 44 · Art. 9º, § 7º, Lei 13.848/2019`
- `adm-13848-pdf32-q045` — `32.pdf · questão 45 · Art. 10, § 2º, Lei 13.848/2019`
- `adm-13848-pdf32-q046` — `32.pdf · questão 46 · Art. 11, Lei 13.848/2019`
- `adm-13848-pdf32-q047` — `32.pdf · questão 47 · Art. 13, Lei 13.848/2019`
- `adm-13848-pdf32-q049` — `32.pdf · questão 49 · Art. 14, Lei 13.848/2019`
- `adm-13848-pdf32-q050` — `32.pdf · questão 50 · Art. 14, Lei 13.848/2019`
- `adm-8443-pdf58-q002` — `58.pdf · questão 2 · Art. 1°, VI, Lei 8.443/92`
- `adm-8443-pdf58-q003` — `58.pdf · questão 3 · Art. 5°, I, Lei 8.443/92`
- `adm-8443-pdf58-q004` — `58.pdf · questão 4 · Art. 5°, V, Lei 8.443/92`
- `adm-8443-pdf58-q006` — `58.pdf · questão 6 · Art. 5°, IX, Lei 8.443/92`
- `adm-8443-pdf58-q007` — `58.pdf · questão 7 · Art. 5°, Lei 8.443/92`
- `adm-8443-pdf58-q008` — `58.pdf · questão 8 · Art. 1°, I, Lei 8.443/92`
- `adm-8443-pdf58-q009` — `58.pdf · questão 9 · Art. 3°, Lei 8.443/92`
- `adm-8443-pdf58-q010` — `58.pdf · questão 10 · Art. 7°, § único, Lei 8.443/92`
- `adm-8443-pdf58-q011` — `58.pdf · questão 11 · Art. 9°, III, Lei 8.443/92`
- `adm-8443-pdf58-q012` — `58.pdf · questão 12 · Art. 10, § 2°, Lei 8.443/92`
- `adm-8443-pdf58-q013` — `58.pdf · questão 13 · Art. 10, § 2°, Lei 8.443/92`
- `adm-8443-pdf58-q014` — `58.pdf · questão 14 · Art. 10, § 3°, Lei 8.443/92`
- `adm-8443-pdf58-q015` — `58.pdf · questão 15 · Art. 12, I, Lei 8.443/92`
- `adm-8443-pdf58-q016` — `58.pdf · questão 16 · Art. 12, II, Lei 8443/92`
- `adm-8443-pdf58-q017` — `58.pdf · questão 17 · Art. 12, II e III, Lei 8.443/92`
- `adm-8443-pdf58-q018` — `58.pdf · questão 18 · Art. 16, Lei 8.443/92`
- `adm-8443-pdf58-q019` — `58.pdf · questão 19 · Art. 16, III, a, Lei 8.443/92`
- `adm-8443-pdf58-q020` — `58.pdf · questão 20 · Art. 16, III, b, Lei 8.443/92`
- `adm-8443-pdf58-q022` — `58.pdf · questão 22 · Art. 16, § 1°, Lei 8.443/92`
- `adm-8443-pdf58-q023` — `58.pdf · questão 23 · Art. 20, Lei 8.443/92`
- `adm-8443-pdf58-q024` — `58.pdf · questão 24 · Art. 32, Lei 8.443/92`
- `adm-8443-pdf58-q025` — `58.pdf · questão 25 · Art. 48, Lei 8.443/92`
- `adm-8443-pdf58-q026` — `58.pdf · questão 26 · Art. 60, Lei 8.443/92`
- `adm-8443-pdf58-q028` — `58.pdf · questão 28 · Art. 10, Lei 8.443/92`
- `adm-8443-pdf58-q029` — `58.pdf · questão 29 · Art. 7°, § único, Lei 8.443/92`
- `adm-8443-pdf58-q030` — `58.pdf · questão 30 · Art. 10, § 3°, Lei 8.443/92`
- `adm-8443-pdf58-q031` — `58.pdf · questão 31 · Art. 16, II, Lei 8.443/92`
- `adm-8443-pdf58-q032` — `58.pdf · questão 32 · Art. 46, Lei 8.443/92`
- `adm-8443-pdf58-q033` — `58.pdf · questão 33 · Art. 61, Lei 8.443/92`
- `adm-8443-pdf58-q034` — `58.pdf · questão 34 · Art. 44, Lei 8.443/92`
- `adm-8443-pdf58-q035` — `58.pdf · questão 35 · Art. 57, Lei 8.443/92`
- `adm-8443-pdf58-q036` — `58.pdf · questão 36 · Art. 9°, III, Lei 8.443/92`
- `adm-8443-pdf58-q037` — `58.pdf · questão 37 · Art. 8°, Lei 8.443/92`
- `adm-8443-pdf58-q038` — `58.pdf · questão 38 · Art. 23, III, b, Lei 8.443/92`
- `adm-8443-pdf58-q039` — `58.pdf · questão 39 · Art. 24, Lei 8.443/92`
- `adm-8443-pdf58-q040` — `58.pdf · questão 40 · Art. 55, § 2°, Lei 8.443/92`
- `adm-8443-pdf58-q041` — `58.pdf · questão 41 · Art. 17, Lei 8.443/92`
- `adm-8443-pdf58-q042` — `58.pdf · questão 42 · Art. 60, Lei 8.443/92`
- `adm-8443-pdf58-q043` — `58.pdf · questão 43 · Art. 12, II, Lei 8.443/92`
- `adm-8443-pdf58-q044` — `58.pdf · questão 44 · Art. 57, Lei 8.443/92`
- `adm-8443-pdf58-q045` — `58.pdf · questão 45 · Art. 47, Lei 8.443/92`
- `adm-8443-pdf58-q046` — `58.pdf · questão 46 · Art. 69, Lei 8.443/92`
- `adm-d11462-pdf34-q001` — `34.pdf · questão 1 · Art. 33, Decreto 11.462/2023`

## Questões restantes, lacunas e restrições

- O inventário cobre oito disciplinas, mas esta etapa não equivale à conferência individual dos 12.408 objetos nem ao total único após filtros.
- Os bancos originais `cf`, `civil`, `penal`, `cpc` e `cpp` excederam o conteúdo retornado pelo conector; suas quantidades foram extraídas das asserções preexistentes dos testes. Não alegar revisão desses bancos.
- Os 813 comentários que reproduzem somente o artigo ainda requerem explicação individualizada, sem que isso, por si só, prove gabarito errado.
- Consultar revogações, alterações, entendimento do STF, STJ e TST antes de certificar cada questão aplicável.
- O resultado de exercícios com gabarito pendente continua no histórico para preservar progresso; a interface identifica o resultado como provisório. As estatísticas históricas não foram recalculadas.
- Não se alteraram identificadores, alternativas nem gabaritos.
- O código foi alterado para aviso jurídico e regras CSS pontuais. Os defeitos visuais não podem ser declarados resolvidos sem inspeção autenticada da prévia.

## Fontes jurídicas efetivamente usadas

- Lei 9.784/1999, arts. 1º e 2º, texto do Planalto: https://www.planalto.gov.br/ccivil_03/leis/l9784.htm
- Texto atualizado da Câmara dos Deputados, consulta em 12/10/2026: https://www2.camara.leg.br/legin/fed/lei/1999/lei-9784-29-janeiro-1999-322239-normaatualizada-pl.html
- Nenhum precedente do STF/STJ/TST foi invocado como fundamento das 23 questões conferidas.

## Checkpoint técnico e continuidade

1. Inventário imutável dos blobs originais: `audits/lei-em-dia-auditoria-20261012-inventario.json`.
2. Primeira intervenção: `tools/decorando-data-adm-9784.js` com 23 fundamentações e 3 pendências.
3. Leitor: `tools/decorando.html` com avisos antes das alternativas e layout responsivo pontual.
4. Teste Node versionado: `tests/lei-em-dia-auditoria-20261012.mjs` (não executado em CI nesta sessão).
5. Próxima etapa: executar `node --test tests/lei-em-dia-auditoria-20261012.mjs` e scripts do `package.json` (incluindo `test:lei-adm`, `test:lei-cf`, `test:lei-civil`, `test:lei-restantes`, `test:lei-sync`); continuar questão por questão, usando fontes oficiais atuais.
6. Após desbloqueio da quota Vercel: implantar branch em preview, validar interação, tablets/celular/desktop, manter produção intocada.
