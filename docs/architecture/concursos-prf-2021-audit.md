# Auditoria e PRF 2021 — primeira entrega da estrutura de concursos

Data: 22/11/2026

## O que o repositório já oferecia

- Disciplinas e módulos são conteúdos canônicos mantidos nos arquivos e índices existentes da Central. As rotas de conteúdo e navegação já reutilizam esses IDs.
- O catálogo de concursos usa `central_contests` e `central_contest_audit`, com CRUD de administrador, histórico, revisão otimista por `revision`, fontes HTTPS e percentual ponderado.
- A interface de concurso já permite cadastrar cargos, disciplinas, assuntos, IDs de disciplina/módulo e estado de cobertura. A edição administrativa é feita como JSON.
- Objetivos de estudo podem ser carregados do catálogo existente. A preferência de objetivo do aluno é separada do progresso de estudo.
- O progresso verticalizado já é separado por `user_id` e `exam_id`, com armazenamento local offline e sincronização autenticada. TJPB e TRT-8 demonstram IDs e progresso independentes.
- `api/objective.js` verifica plano para sincronização avançada. APIs existentes validam sessão, origem e IDs de edital; o banco não recebe identificadores de assunto arbitrários.

## Entrega desta branch

- Adiciona o Edital PRF nº 1/2021 ao catálogo existente, com fonte primária oficial do Cebraspe e página institucional da PRF.
- Registra 14 blocos do programa e associa apenas sete candidatos a IDs canônicos de disciplinas já disponíveis. Esses IDs são referências de disciplina, não prova de equivalência de capítulos.
- Todos os 14 blocos começam com cobertura `missing`, sem módulos vinculados. O percentual inicial calculado é 0%.
- A interface mantém assunto com cobertura ausente como “em preparação”, mesmo que exista uma referência à disciplina canônica.
- O editor aceita concursos históricos a partir de 2000 para que o edital de 2021 possa ser administrado.
- A rota do catálogo bloqueia prévias sem variável `CONTESTS_PREVIEW_DB_ISOLATED=true` antes de sessão/SQL. Isso evita que DDL e seed já existentes do endpoint atinjam uma conexão de prévia que compartilha banco.

## Lacunas que continuam abertas

- O catálogo administrativo ainda não importa PDF local nem extrai/organiza automaticamente o conteúdo. A fonte oficial é registrada como link HTTPS; a digitação/revisão continua manual.
- Não há sugestão automática de capítulo com fluxo formal de aprovação por assunto. Os candidatos por disciplina do PRF são apenas pistas, e permanecem sem vínculos.
- O seletor mantém um objetivo ativo por vez. O progresso dos editais já cadastrados fica separado ao alternar, mas a seleção simultânea de múltiplos objetivos não está implementada nesta entrega.
- O PRF ainda não tem checklist verticalizado individual por tópico. Nenhum progresso de aluno foi criado ou migrado.
- A classificação de questões/filtros externos por edital não foi conectada ao novo catálogo.
- Não foi preparada nem executada migração. O handler atual cria as tabelas do catálogo sob demanda; a prévia agora exige banco isolado.
- A homologação visual responsiva/offline e a compatibilidade integral precisam de execução pela CI e prévia Vercel isolada. Não foram usadas contas nem dados reais de alunos.

## Fonte do programa

Edital Concurso PRF nº 1, de 18 de janeiro de 2021, Anexo III, “Dos objetos de avaliação”, blocos I–III. O edital foi publicado pelo Cebraspe e contém o programa resumido cadastrado aqui. O conteúdo acima é uma organização resumida para catálogo, não substitui o PDF oficial:

- https://cdn.cebraspe.org.br/concursos/prf_21/arquivos/ED_1_PRF_2021_ABERTURA.PDF
- https://www.gov.br/prf/pt-br/acesso-a-informacao/servidores/concursos-e-selecoes/concurso-2021

## Resultado da primeira cobertura

| Situação | Blocos | Percentual |
| --- | ---: | ---: |
| Completo auditado | 0/14 | 0% |
| Parcial validado | 0/14 | 0% |
| Sem cobertura validada | 14/14 | 100% |
| Cobertura oficial calculada | — | 0% |

Esse resultado é deliberado: sem verificação de teoria, revisão, assuntos e questões por capítulo, o sistema não pode apresentar curso PRF como completo.
