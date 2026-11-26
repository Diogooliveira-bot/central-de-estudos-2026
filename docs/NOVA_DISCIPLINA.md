# Como criar uma disciplina nova (guia em português simples)

Vale para disciplinas "extras", como as do GMF (Atualidades, Conhecimentos sobre Fortaleza, Legislação Extravagante,
Direitos Humanos). Antes era preciso editar uns 8 arquivos com os nomes escritos à mão. Agora **tudo nasce de um só lugar**,
o catálogo `content/gmf/course-catalog-v1.js`. Cores, ordem das questões, proteção do conteúdo, bloqueio das questões e
visibilidade por concurso são calculados a partir dele.

> Para o proprietário: basta pedir ao agente, por exemplo: *"criar a disciplina Legislação de Trânsito com os módulos A, B e C"*.
> Os passos abaixo são o que o agente faz e confere.

## O caminho (4 passos)

1. **Criar o esqueleto** (os alunos veem só o roteiro, "em preparação"; nada de conteúdo ainda):
   ```
   npm run nova-disciplina -- criar transito "Legislação de Trânsito" --referencia "Edital ... — matéria" --modulos "Infrações|Crimes de trânsito|Sinalização"
   ```
   - O código (`transito`) tem só letras minúsculas, de 2 a 12, e não pode repetir nem ser de uma disciplina original.
   - Cria a pasta `content/gmf/transito/` com um modelo de **teoria completa** e **revisão guiada** por módulo.
2. **Preencher** os arquivos modelo e o campo `focus` (assuntos cobrados) de cada módulo no catálogo. Troque tudo que
   tem a palavra `PREENCHER`. Regras de qualidade: teoria completa com **4+ capítulos de 100+ palavras**; revisão guiada com
   **3+ capítulos de 45+ palavras**; **fontes oficiais com https**; sem código dentro do texto.
3. **Publicar cada módulo** quando estiver pronto e revisado:
   ```
   npm run nova-disciplina -- publicar transito m01
   ```
   O comando recusa se ainda houver `PREENCHER`, texto curto, fonte sem https etc., e explica o que falta.
4. **Conferir e testar:** `npm run nova-disciplina -- conferir`, `npm run verificar -- --base origin/main` e `npm test`.

Outros comandos: `npm run nova-disciplina -- listar` (o que está publicado e o que está em preparação).

## O que acontece sozinho (não precisa mexer)
| Item | Como é resolvido |
|---|---|
| Cartão da disciplina, grade "Escolha um módulo", página do módulo | Mesmo visual das outras disciplinas (`ui/module-page-standard-v1.css`) |
| Barra verde "na sua trilha" | Aparece quando o concurso GMF está escolhido |
| Cor de destaque | Campo opcional `accent` (ex.: `#356a9e`) no catálogo; sem ele, usa uma cor da paleta |
| Proteção do conteúdo (plano gratuito x Premium) | `lib/protected-content.js` protege qualquer `content/gmf/<código>/mNN-*.js` |
| Questões do módulo | Bloqueadas ("em preparação") para toda pasta de `content/gmf/` até liberar |
| Lista de matérias do objetivo GMF, nomes, ocultar fora do GMF | Derivados do catálogo |
| Ordem na Central de Questões | Depois das 9 disciplinas originais, na ordem do catálogo |

## Cuidados
- **Não renomear** o código da disciplina nem dos módulos depois de publicados: o progresso do aluno usa esses códigos.
- Os módulos têm de seguir a ordem `m01`, `m02`, `m03`... sem pular.
- **Conteúdo jurídico:** o sistema confere o formato e o tamanho, não se a lei está correta. A revisão jurídica é humana.
- Liberar as **questões** de uma disciplina é uma decisão à parte (`GMF_QUESTIONS_ENABLED` em `lib/questoes-handler.js`).
- Se criar uma disciplina que **não é do GMF** (outro concurso), peça ao agente: é outro catálogo, o caminho é parecido.
- A conferência roda em todo PR (`tests/disciplinas-extras-unit.mjs`) e acusa qualquer esquecimento.
