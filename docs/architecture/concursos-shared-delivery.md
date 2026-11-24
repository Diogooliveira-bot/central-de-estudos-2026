# Concursos compartilhados — entrega para revisão no PR #398

Branch: `codex/concursos-compartilhados-prf-2021`. Nenhuma alteração foi aplicada à produção ou a dados reais de alunos.

## O que mudou

| Antes | Nesta branch |
| --- | --- |
| Catálogo de concursos editável por JSON | Formulário visual de concurso, fontes, cargos, disciplinas e assuntos; histórico/revisão existentes preservados |
| Cobertura declarada por disciplina | Em assuntos verticalizados, cobertura calculada somente de referências aprovadas e complementações efetivamente vinculadas |
| Um objetivo ativo salvo | Até dez editais selecionados na preferência da conta, com um objetivo ativo; o progresso de capítulos continua nas chaves existentes e o progresso por edital continua separado |
| PRF com 14 blocos e nenhuma referência | 14 blocos subdivididos em 78 linhas de trabalho; 36 sugestões de módulo em 20 assuntos, todas pendentes de auditoria; 0% aprovado |
| Cache, bootstrap e manifesto com versões distintas | Mesma versão nos três arquivos e no endereço do manifesto usado pelo service worker |

O registro do assunto armazena `links` para disciplina/módulo/capítulo, estado (`suggested`, `approved`, `rejected`), alcance (`partial` ou `full`) e evidência da conferência. O módulo aprovado precisa existir no catálogo publicado de CF, Administrativo, Civil, CPC, Penal ou CPP. O identificador de capítulo é informado pelo administrador e exige conferência humana; ainda não há inventário automático de capítulos para validá-lo. Uma complementação requer título, justificativa e arquivo sob `/content/` para contar como aprovada. Nenhum texto pedagógico foi copiado ou alterado.

O PDF é lido no navegador com o pdf.js já presente no repositório. O texto fica no aparelho até o administrador selecionar a disciplina e adicionar as linhas revisadas. A extração exige camada de texto; não há OCR. Similaridade de palavras em títulos produz somente sugestões, nunca aprovação. O modelo `right-wrong` fica registrado no concurso PRF para futura integração com questões do Cebraspe; o mecanismo de correção de questões não foi alterado.

## Testes efetivamente executados

- CI anterior no PR: 536 testes; 528 passaram, 8 falharam. Todas as oito falhas decorriam da divergência M05/M06 entre `central-v119.html`, `sw.js` e o manifesto offline. Após alinhar o bootstrap/cache, restaram duas falhas no endereço do manifesto; corrigidas em seguida.
- `npm test`: 543 testes, **542 aprovados, 0 falhas, 1 ignorado** na execução de 23/11/2026. A suíte inclui a validação de referências, cobertura conservadora, formulário visual e compatibilidade dos objetivos antigos. Repetir após o commit final e conferir a CI do PR.
- `npm run security:static`: 2567 arquivos versionados examinados, nenhum segredo de alto risco identificado.
- `node scripts/build-shared-module-catalog.mjs --check`, `node scripts/build-module-catalog.mjs --check`, `node --check` dos scripts alterados e `git diff --check`: passaram.
- Extração do pdf.js exercitada com PDF fictício gerado localmente, sem informações de alunos; as linhas foram lidas corretamente.
- Teste de browser com Chromium local **não executado**: o processo abortou neste ambiente (`ptrace: Operation not permitted`). O teste JSDOM cobre o fluxo visual de sugestão/aprovação, mas não substitui a navegação real em celular, tablet e computador.
- Não houve conexão com banco Neon nem teste com contas reais. Nenhuma migração foi executada. A coluna `selected_contest_ids` é adicionada por DDL não destrutivo na primeira execução da API, somente quando o projeto for implantado num banco autorizado. Em Preview, a API de concursos e preferências retorna 503 antes do acesso ao banco se `CONTESTS_PREVIEW_DB_ISOLATED=true` não estiver configurado.

## PRF 2021: cobertura inicial

O Edital nº 1/2021 é uma referência histórica. Os 78 assuntos são uma subdivisão preliminar dos 14 blocos cadastrados; **não equivalem à verticalização integral de cada subitem do PDF oficial**. Há 36 sugestões de módulo distribuídas por 20 assuntos; 58 assuntos não receberam sugestão automática. Todos os vínculos seguem sem aprovação e a cobertura calculada é **0%**. Português, RLM e Informática têm conteúdo na Central, mas ainda não integram o inventário de módulos verificados para aprovação automática. Física, Ética, Geopolítica, Língua Estrangeira, Trânsito, Legislação Especial e Direitos Humanos exigem auditoria ou produção específica. Nenhuma questão foi associada à PRF nesta etapa.

## Pendências antes de considerar a missão integralmente concluída

1. Conferir o PDF oficial e retificações subitem por subitem, validar os capítulos existentes e ampliar o inventário de Português, RLM e Informática sem tratar material em construção como disponível.
2. Auditar e aprovar os vínculos da PRF com registro de alcance; produzir e revisar complementações reais. Integrar questões pertinentes e implementar a correção certo/errado no motor de questões.
3. Configurar banco Neon exclusivo de homologação e variáveis da Preview; executar cadastro, edição, importação, permissões Gratuito/Premium, progresso simultâneo e isolamento entre contas fictícias em navegação autenticada.
4. Testar a aplicação em celular, tablet e computador, com rede e offline; medir carregamento e conferir compatibilidade visual dos concursos antigos.
5. Reavaliar os checks do PR e disponibilizar link de prévia se a Vercel permitir. O limite diário de builds havia bloqueado a prévia anterior; não foi feita publicação manual.

## Como cadastrar outro concurso

1. Na Preview isolada, entre com conta administrativa fictícia e abra **Editais e Concursos → Novo concurso**.
2. Preencha os campos, inclua pelo menos uma fonte oficial HTTPS e mantenha o cadastro inativo enquanto o programa for revisado.
3. Adicione cargos e disciplinas. Envie o PDF, selecione apenas o conteúdo programático, organize uma linha por assunto e escolha a disciplina de destino.
4. Use **Sugerir módulos existentes** ou informe o módulo verificado. Confira o conteúdo e anote o alcance da correspondência antes de **Aprovar**. Registre as lacunas como complementações pendentes.
5. Salve; revise a cobertura calculada e só ative o concurso quando o conteúdo e a apresentação ao aluno estiverem conferidos.

O PR continua em rascunho para revisão. Não publicar nem fazer merge sem autorização do proprietário.
