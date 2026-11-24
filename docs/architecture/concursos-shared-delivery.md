# Concursos compartilhados — entrega para revisão no PR #398

Branch: `codex/concursos-compartilhados-prf-2021`. Nenhuma alteração foi aplicada à produção ou a dados reais de alunos.

## O que mudou

| Antes | Nesta branch |
| --- | --- |
| Catálogo de concursos editável por JSON | Formulário visual de concurso, fontes, cargos, disciplinas e assuntos; histórico/revisão existentes preservados |
| Cobertura declarada por disciplina | Em assuntos verticalizados, cobertura calculada somente de referências aprovadas e complementações efetivamente vinculadas |
| Um objetivo ativo salvo | Até dez editais selecionados na preferência da conta, com um objetivo ativo; o progresso de capítulos continua nas chaves existentes e o progresso por edital continua separado |
| PRF com 14 blocos e nenhuma referência | 14 blocos subdivididos em 78 linhas preliminares; seis seções existentes conferidas como parciais; outras referências permanecem sugestões; cobertura inicial calculada em 3% |
| Cache, bootstrap e manifesto com versões distintas | Mesma versão nos três arquivos e no endereço do manifesto usado pelo service worker |

O registro do assunto armazena `links` para disciplina/módulo/capítulo, estado (`suggested`, `approved`, `rejected`), alcance (`partial` ou `full`) e evidência da conferência. O inventário agora extrai títulos e IDs de seções existentes das nove disciplinas: CF (15 módulos/194 seções), CPC (20/101), Administrativo (20/274), Civil (15/205), CPP (22/518), Português (24/1757), RLM (15/70), Informática (13/93) e Penal (17/220). Esses números descrevem títulos estruturais, não capítulos pedagogicamente aprovados; Português inclui aulas e divisões auxiliares. Um vínculo aprovado com ID de capítulo é rejeitado se essa seção não existir no módulo. O administrador escolhe o capítulo numa lista visual. Uma complementação já publicada pode ser referenciada, mas nenhuma foi criada nesta entrega. Nenhum texto pedagógico foi copiado ou alterado.

O PDF é lido no navegador com o pdf.js já presente no repositório. O texto fica no aparelho até o administrador selecionar a disciplina e adicionar as linhas revisadas. A extração exige camada de texto; não há OCR. Similaridade de palavras em títulos produz somente sugestões, nunca aprovação. O modelo `right-wrong` fica registrado no concurso PRF para futura integração com questões do Cebraspe; o mecanismo de correção de questões não foi alterado.

## Testes efetivamente executados

- CI anterior no PR: 536 testes; 528 passaram, 8 falharam. Todas as oito falhas decorriam da divergência M05/M06 entre `central-v119.html`, `sw.js` e o manifesto offline. Após alinhar o bootstrap/cache, restaram duas falhas no endereço do manifesto; corrigidas em seguida.
- `npm test`: após integrar a `main` atual, 559 testes, **558 aprovados, 0 falhas, 1 ignorado** na execução de 23/11/2026. A suíte inclui a validação de referências, cobertura conservadora, formulário visual e compatibilidade dos objetivos antigos. Conferir também a CI do PR.
- `npm run security:static`: após integrar a `main`, 2576 arquivos versionados examinados, nenhum segredo de alto risco identificado.
- `node scripts/build-shared-module-catalog.mjs --check`, `node scripts/build-module-catalog.mjs --check`, `node --check` dos scripts alterados e `git diff --check`: passaram.
- A CI do commit integrado aprovou Testes completos, segurança contínua, CodeQL e os testes de cache PWA. O verificador da Central apontou a versão antiga de `sync-local-state.js`; os dois endereços de cache foram corrigidos e `node scripts/verificar-central.mjs --base origin/main` passou localmente. A nova CI ainda deve confirmar esse ajuste.
- O job de apostilas autorais ADM falhou ao verificar `artes/adm-m02/png/ADM-M02-C01.png`: a assinatura do arquivo é `59aae78a782daee9`, não a assinatura PNG `89504e470d0a1a0a`. O mesmo blob já está na `main`; a branch de concursos não modificou essa arte. A imagem WebP integrada existe. A origem desse PNG e os outros arquivos da série precisam de correção no trabalho de artes ADM, sem substituir o material pedagógico aqui.
- Extração do pdf.js exercitada com PDF fictício gerado localmente, sem informações de alunos; as linhas foram lidas corretamente.
- Teste de browser com Chromium local **não executado**: o processo abortou neste ambiente (`ptrace: Operation not permitted`). O teste JSDOM cobre o fluxo visual de sugestão/aprovação, mas não substitui a navegação real em celular, tablet e computador.
- Em 24/11/2026, foi criada a branch Neon `pr398-concursos-isolado-20261124` (`br-twilight-fire-b850bhvu`) e, nela, o banco vazio `pr398_concursos_ficticios`; a consulta confirmou zero tabelas públicas. A branch foi derivada da branch padrão do projeto de homologação, mas os testes usam **somente o banco novo vazio**, sem consultar ou usar os dados copiados no banco padrão. A organização Neon gerenciada pela Vercel rejeitou a criação de um projeto totalmente novo. As variáveis `DATABASE_URL`, `AUTH_SECRET`, guarda de host e flags de isolamento foram configuradas somente para a branch Preview `codex/concursos-compartilhados-prf-2021`. Nenhuma migração foi executada em produção.

## PRF 2021: cobertura inicial

O Edital nº 1/2021 é uma referência histórica. Os 78 assuntos são uma subdivisão preliminar dos 14 blocos cadastrados; **não equivalem à verticalização integral de cada subitem do PDF oficial**. Seis vínculos de seção foram conferidos nos arquivos existentes e nos subitens do item 24.2.1 do PDF: RLM razão e conjuntos; Informática internet/intranet e Windows; Administrativo organização; Constitucional direitos e garantias. Todos foram marcados **parciais** com evidência e ID de seção; nenhum assunto ou disciplina foi declarado completo. Restam 43 sugestões sem aprovação e assuntos sem referência. A cobertura aproximada é **3%** pelo cálculo por assunto ponderado por disciplina, sem equivaler a auditoria integral do edital. Português, RLM e Informática agora integram o inventário, mas disponibilidade de arquivo não comprova cobertura de todo o edital. Física, Ética, Geopolítica, Língua Estrangeira, Trânsito, Legislação Especial e Direitos Humanos seguem “Em preparação”. Nenhuma questão foi associada à PRF nesta etapa.

## Pendências antes de considerar a missão integralmente concluída

1. Conferir o PDF oficial e retificações subitem por subitem; revisar as sugestões por seção. O inventário de títulos não substitui a auditoria de conteúdo pedagógico.
2. Auditar os demais vínculos da PRF, associar questões pertinentes e implementar a correção certo/errado no motor de questões. A produção de complementações pedagógicas está fora do escopo autorizado nesta missão.
3. Testar cadastro, edição, importação, permissões Gratuito/Premium, progresso simultâneo e isolamento entre contas fictícias em navegação autenticada na Preview com o banco novo.
4. Testar a aplicação em celular, tablet e computador, com rede e offline; medir carregamento e conferir compatibilidade visual dos concursos antigos.
5. Reavaliar os checks do PR e disponibilizar link de prévia se a Vercel permitir. Os dois status da Vercel no commit integrado ainda falharam por limite de builds; não foi feita publicação manual.

## Como cadastrar outro concurso

1. Na Preview isolada, entre com conta administrativa fictícia e abra **Editais e Concursos → Novo concurso**.
2. Preencha os campos, inclua pelo menos uma fonte oficial HTTPS e mantenha o cadastro inativo enquanto o programa for revisado.
3. Adicione cargos e disciplinas. Envie o PDF, selecione apenas o conteúdo programático, organize uma linha por assunto e escolha a disciplina de destino.
4. Use **Sugerir módulos existentes** ou informe o módulo verificado. Confira o conteúdo e anote o alcance da correspondência antes de **Aprovar**. Registre as lacunas como complementações pendentes.
5. Salve; revise a cobertura calculada e só ative o concurso quando o conteúdo e a apresentação ao aluno estiverem conferidos.

O PR continua em rascunho para revisão. Não publicar nem fazer merge sem autorização do proprietário.
