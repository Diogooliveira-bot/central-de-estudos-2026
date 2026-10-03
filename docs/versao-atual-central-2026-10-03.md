# Central: cursos atuais e atualização — 03/10/2026

## Problemas reproduzidos em produção

A produção estava no commit `0661abd7b70f88f8a8eb0238e4dfd6e60ab54a41`, com deploy READY. Os novos arquivos estavam publicados; a interface ainda selecionava outras implementações.

- Português M01–M24 existia em `/portugues.html`, mas a Central carregava `portugues-native-v1.js`, com 17 módulos de outro programa.
- Penal M01–M17 carregava todos os dados e leitores novos, mas `renderPenalModule` ainda produzia as etapas antigas. Após `jumpSubject('penal')`, os 17 módulos apareciam sem os cards de material nativo.
- Os leitores e shells observavam qualquer alteração no documento. Atualizações dos próprios indicadores provocavam novos ciclos de observadores e adiavam a reinjeção dos cards após uma renderização.
- O Service Worker aguardava o download do pacote offline completo antes de ativar. Além disso, o acesso principal, o manifesto e o atualizador usavam valores `direct` diferentes.
- O Service Worker buscava um boot fixo nas navegações e precisava preservar os parâmetros de estudo e retorno.

## Correções

`ui/current-courses.js` integra o manifesto real do Português Autodidata à Central e renderiza diretamente os materiais nativos de Penal. A lista de Português, os indicadores e a retomada usam a versão M01–M24 e suas próprias chaves de progresso. Os dados do curso antigo permanecem armazenados: os programas têm conteúdos diferentes e sua conclusão não foi transferida por número.

Os materiais de Penal são parte da renderização principal, com os leitores existentes, os mesmos dados e as mesmas chaves de progresso. A Central deixa de carregar a teoria legada. Os mapas mentais usam os capítulos dos dados nativos atuais, evitando o conteúdo da matriz antiga. Os observadores dos leitores e shells acompanham apenas substituições da lista de disciplinas, sem reagir às mudanças de seus próprios indicadores.

O Service Worker ativa sem esperar o pacote offline inteiro, mantém o boot para fallback e prepara os arquivos offline em segundo plano. Navegações preservam `subject`, `module`, `study` e demais parâmetros. O manifesto, a entrada principal e o atualizador usam o mesmo boot. Os recursos servidos pela Vercel exigem revalidação, e as requisições do aplicativo continuam priorizando a rede.

O Português abre o módulo escolhido, registra a retomada, volta à disciplina na Central e libera o DOM do material fechado para manter a navegação leve.

## Verificação

O roteiro de navegador verifica os 24 módulos de Português e sua revisão, persistência da conclusão e retorno à Central, conteúdo completo e resumido dos 17 módulos de Penal, estabilidade dos cards após renderização, preservação de anotações, navegação com Service Worker ativo e largura móvel. Também verifica erros de JavaScript e respostas HTTP com falha. Sintaxe dos arquivos JS e scripts inline, JSON e diferenças de whitespace são verificados antes de publicar.

Resultado local: os 24 módulos e a revisão de Português, os 17 leitores completos e resumos de Penal, os cards após renderização e o retorno com Service Worker ativo passaram. Não houve erro de JavaScript, falha HTTP ou rolagem horizontal na largura de 390 px.

## Português com apresentação integrada

Português passa a abrir módulos na própria Central, usando os cards de materiais, o leitor nativo e o rodapé compartilhado com registro de questões, revisão e anotações. O conteúdo integral M01–M24 e a revisão cumulativa permanecem no banco original, assim como suas chaves de conclusão. O leitor fornece índice, busca, fonte ajustável e acesso aos trechos de revisão. O mapa deriva dos títulos reais do módulo. Links antigos de `/portugues.html` retornam ao módulo integrado.

Verificação: os 24 materiais completos e a revisão final foram abertos no leitor integrado. Fluxos de conclusão, busca e mapas foram exercitados; as notas, os links antigos e a apresentação móvel são verificados antes de publicar.
