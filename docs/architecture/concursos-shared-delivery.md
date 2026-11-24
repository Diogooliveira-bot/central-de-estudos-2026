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

- Em 24/11/2026, `npm test` após a correção final: **563 testes, 562 aprovados, 0 falhas, 1 ignorado**. `npm run test:concursos`: **22/22**. `node scripts/verificar-central.mjs --base origin/main`, verificação estática de segurança e sintaxe passaram. O teste ignorado na suíte padrão já existia. No runner sem as primitivas gráficas opcionais de Node, a extração de PDF fica explicitamente ignorada; ela passou no ambiente local e no Chromium real.
- A CI de `6128a93` terminou com **16/17 fluxos aprovados**, incluindo Testes completos, PWA, CodeQL, segurança, navegador do aluno gratuito e quatro jobs de comparação visual/desempenho. O fluxo de apostilas ADM falhou por `artes/adm-m02/png/ADM-M02-C01.png`, com assinatura inválida já presente na `main`; não houve alteração desse material no PR de concursos. Conferir novamente a CI do commit final de homologação.
- `tests/contest-neon-integration.mjs` passou no banco **exclusivo de testes** `pr398_concursos_ficticios`: inventário e seed PRF, cadastro/edição, conflito de revisão, capítulo inexistente rejeitado, permissão de administrador, seleção de dois editais, isolamento entre contas, bloqueio da sincronização Premium no Gratuito e checklist independente por edital. Só foram usadas identidades `@basecompleta.invalid`.
- Navegação Chromium real na Preview Vercel de `0f930ae`: conta administrativa criou e editou um concurso fictício inativo, importou um PDF de uma página pelo `pdf.js` publicado, conferiu a linha extraída, recebeu uma sugestão, aprovou somente o vínculo parcial `info-09-c01` com evidência e deixou outro assunto sem cobertura. A API persistiu os dois assuntos com **25%** calculados no concurso fictício. O mesmo capítulo já estava referenciado parcialmente pela PRF; não houve cópia de conteúdo. Contas Gratuita (390 px) e Premium (820 px) visualizaram a PRF “Em preparação”, selecionaram TRT-8 e TJPB simultaneamente e não tiveram acesso ao inventário de administrador (HTTP 403). O Gratuito recebeu 403 no checklist avançado.
- Na Preview `0f930ae`, o Premium (1366 px) marcou um tópico TRT-8 pela interface; a marcação apareceu no Neon (HTTP 200), continuou após alternar para TJPB e voltar, enquanto o checklist de TJPB permaneceu vazio. A navegação revelou que a mensagem de sincronização desaparecia após a renderização; o estado estava salvo. A correção preserva o texto e passou em teste de regressão e em nova navegação Chromium.
- A Preview `6128a93` confirmou a preparação PWA e abertura da Central offline depois de armazenar **336/336 arquivos, 0 falhas**. O catálogo ainda mostrava “Failed to fetch” sem rede. A correção adicionou apenas uma cópia local do **catálogo público já visitado**, por até 72 horas, sem rascunhos administrativos e sem permitir alterar a seleção offline. O teste JSDOM passou; em um servidor temporário dentro de Vercel Sandbox, servindo o código de `6128a93` e depois a correção final com o mesmo Neon isolado, o Chromium repetiu todo o fluxo administrativo, Gratuito/Premium, 390/820/1366 px, progresso, cache PWA **336/336** e abriu o catálogo público offline com aviso apropriado. O servidor estava limitado a `127.0.0.1`, e os scripts exigem o host e o nome exatos do banco fictício.
- O PDF oficial PRF nº 1/2021 (100 páginas, 1.306.391 bytes) foi extraído localmente pelo mesmo `pdf.js` nas páginas 37–39. O navegador testou uma importação completa com PDF **fictício**; não houve gravação automática do texto integral oficial nem aprovação automática de vínculos.
- A Preview mais recente ficou **READY**, mas o link de revisão passou a redirecionar o navegador automatizado para o SSO da Vercel, inclusive em uma Preview anterior que já havia funcionado. A correção final de cache/formulário foi testada no servidor temporário com navegador real e Neon isolado, **não** na URL Vercel protegida. A proteção externa impede afirmar que todo o fluxo visual final passou no endereço Vercel.
- A branch Neon `pr398-concursos-isolado-20261124` (`br-twilight-fire-b850bhvu`) contém o banco novo `pr398_concursos_ficticios`, criado vazio. A branch foi derivada da branch padrão do projeto de homologação, mas nenhum teste acessou o banco padrão com dados copiados. A organização gerenciada pela Vercel rejeitou a criação de um projeto totalmente novo. As variáveis Preview foram limitadas à branch do PR. Nenhuma migração foi aplicada à produção.

## PRF 2021: cobertura inicial

O Edital nº 1/2021 é uma referência histórica. Os 78 assuntos são uma subdivisão preliminar dos 14 blocos cadastrados; **não equivalem à verticalização integral de cada subitem do PDF oficial**. Seis vínculos de seção foram conferidos nos arquivos existentes e nos subitens do item 24.2.1 do PDF: RLM razão e conjuntos; Informática internet/intranet e Windows; Administrativo organização; Constitucional direitos e garantias. Todos foram marcados **parciais** com evidência e ID de seção; nenhum assunto ou disciplina foi declarado completo. Restam 43 sugestões sem aprovação e assuntos sem referência. A cobertura aproximada é **3%** pelo cálculo por assunto ponderado por disciplina, sem equivaler a auditoria integral do edital. Português, RLM e Informática agora integram o inventário, mas disponibilidade de arquivo não comprova cobertura de todo o edital. Física, Ética, Geopolítica, Língua Estrangeira, Trânsito, Legislação Especial e Direitos Humanos seguem “Em preparação”. Nenhuma questão foi associada à PRF nesta etapa.

## Pendências antes de considerar a missão integralmente concluída

1. Conferir o PDF oficial e retificações subitem por subitem; revisar as sugestões por seção. O inventário de títulos não substitui a auditoria de conteúdo pedagógico.
2. Auditar os demais vínculos da PRF, associar questões pertinentes e implementar a correção certo/errado no motor de questões. A produção de complementações pedagógicas está fora do escopo autorizado nesta missão.
3. Repetir o roteiro visual final na URL Vercel protegida quando o SSO voltar a permitir o acesso por link de revisão; o mesmo roteiro passou em Chromium no servidor temporário com Neon isolado. Conferir estados offline com contas antigas reais apenas por testes não destrutivos autorizados em ambiente seguro; nenhum dado real foi usado nesta homologação.
4. Reavaliar a CI do commit final e resolver fora deste PR o PNG inválido preexistente em apostilas ADM. Não foi feita publicação em produção.

**Decisão de homologação:** os fluxos implementados passaram no banco fictício e no navegador temporário. O conjunto completo ainda **não está pronto para publicação oficial**: PRF e questões seguem incompletas, há um check externo reprovado e a última revisão visual diretamente na URL Vercel ficou bloqueada pelo SSO.

## Como cadastrar outro concurso

1. Na Preview isolada, entre com conta administrativa fictícia e abra **Editais e Concursos → Novo concurso**.
2. Preencha os campos, inclua pelo menos uma fonte oficial HTTPS e mantenha o cadastro inativo enquanto o programa for revisado.
3. Adicione cargos e disciplinas. Envie o PDF, selecione apenas o conteúdo programático, organize uma linha por assunto e escolha a disciplina de destino.
4. Use **Sugerir módulos existentes** ou informe o módulo verificado. Confira o conteúdo e anote o alcance da correspondência antes de **Aprovar**. Registre as lacunas como complementações pendentes.
5. Salve; revise a cobertura calculada e só ative o concurso quando o conteúdo e a apresentação ao aluno estiverem conferidos.

O PR continua em rascunho para revisão. Não publicar nem fazer merge sem autorização do proprietário.
