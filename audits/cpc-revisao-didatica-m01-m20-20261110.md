# Processo Civil M01–M20 — auditoria pedagógica e prévia narrativa
Data-base: 10/11/2026. Estado: **prévia, sem publicação em produção**.

## Problema pedagógico detectado
Os módulos de revisão anteriores apresentavam conceitos, leis e diferenças sem construção suficiente do raciocínio. A primeira tentativa acrescentava explicações, mas ainda tinha listas conceituais. A segunda tentativa separou assuntos em etapas, porém não resolvia a lógica interna de ensino.

## Nova proposta implementada
Cada **um dos 20 módulos** possui agora:
1. Um **caso concreto inicial** com conflito realista e dúvida central.
2. **Cinco etapas causais**: cada uma apresenta uma decisão ou pergunta necessária para resolver o caso. A terminologia só surge depois da necessidade prática.
3. **Explicações em linguagem simples** com transições entre as etapas, em vez de definições independentes.
4. Uma **pergunta de compreensão por etapa**; resposta recolhível sob “Conferir o raciocínio”, para tentar responder antes da explicação.
5. Uma **conclusão que amarra o caso** e o percurso aprendido.
6. Seções opcionais e recolhíveis de **“Agora, o que memorizar”** e **“Consultar legislação”**.
7. A antiga revisão integral fica recolhida em **“Consulta avançada: resumo original e artigos”**, para quem precisa da consulta detalhada.

A tela abre somente a primeira etapa. O botão “Concluir esta etapa” aciona as chaves existentes de progresso e abre a próxima. Os 20 leitores nativos ignoram a rolagem de capítulos antigos ocultos para não marcá-los automaticamente. Nenhum capítulo ou pergunta é excluído do repositório.

## Arquivos modificados
- `content/cpc/cpc-review-didactic-m01-m04.js`, `m05-m08.js`, `m09-m14.js`, `m15-m20.js`: narrativas autorais e checkpoints para 20 módulos, mantendo resumo anterior na fonte.
- `ui/cpc-apostila-reading-v1.js`: apresentação de história, perguntas recolhíveis e progressão.
- `ui/cpc-apostila-reading-v1.css`: layout editorial minimalista.
- `ui/cpc-native-study-reader.js` e `ui/cpc-m02-native-study-reader.js` até `m20`: preservação do progresso dos capítulos ocultos e atualização de versão do JS compartilhado.
- `tests/cpc-review-didactic-unit.mjs` e `tests/cpc-apostila-reading-unit.mjs`: cobertura textual dos 20 casos e testes dos leitores, checkpoints, avanço de etapa e preservação de completos.
- `.github/workflows/cpc-revisao-didatica.yml`: validações automáticas.

## Limites importantes
- Esta intervenção melhora a **versão de revisão/primeiro contato**. A teoria completa e suas fontes originais não foram reescritas.
- As versões completas, questões, gabaritos, artigos e registros de progresso existentes permanecem conservados.
- Exige validar o novo percurso na prévia verdadeira da Central, pelo menos nos M01, M08, M09, M15 e M20 em desktop/móvel.
- O teste automatizado por navegador de terceiros não pôde ser executado nesta rodada, por indisponibilidade de saldo no serviço opcional. JSDOM e checks CI não substituem integralmente a inspeção visual.
- A prévia deverá abrir sem login, por mecanismo temporário de visitante e sem acesso aos dados reais de estudantes, conforme `docs/PREVIA_SEM_LOGIN_PADRAO.md`.
- **Não fazer merge em `main` ou publicar na produção sem aprovação expressa do usuário.**
