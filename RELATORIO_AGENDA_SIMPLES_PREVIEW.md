# Relatório técnico — Agenda simples (preview)

Data da validação: 28/09/2026  
Branch: `preview/agenda-simples-v1`  
Base preservada: `main` em `65844e8c22fb33b2bcf08f9130315dbd0496d813`  
Commit remoto funcional validado: `c31d6c960989d9238f2db65c92c93e142fb53881`  
Deployment validado: `dpl_HPVNCbi8opiZJwTeSG13kF4vRjHb` (`READY`)  
Preview estável: <https://central-de-estudos-git-preview-agenda-simples-v1-estudotd.vercel.app>

## Resultado

A simplificação foi implementada somente em branch e preview. A produção não foi alterada. A nova interface reutiliza o mesmo armazenamento da Agenda, preserva campos legados desconhecidos e não executa migração, limpeza global ou recriação de dados.

## Arquivos adicionados

- `central-agenda-core-v1.js`: operações puras e retrocompatíveis da Agenda.
- `central-agenda-simple-v1.js`: interface aditiva da Agenda e navegação simplificada.
- `central-agenda-simple-v1.css`: estilos desktop, tablet e celular.
- `tests/agenda-core.test.mjs`: testes de leitura, CRUD, ordem, duplicação e preservação.
- `tests/agenda-safety.test.mjs`: testes de segurança de persistência e integração offline.
- `tests/fixtures/before-state.json`: snapshot representativo do estado anterior.
- `tests/agenda-responsive-preview.html`: harness isolado para 1200, 820 e 390 px.

## Arquivos modificados

- `central-structural-v66119/runtime.js`: registro inválido da Agenda deixa de ser removido e exemplos deixam de ser criados automaticamente.
- `index.html`: registro inválido é copiado para recuperação sem apagar o original.
- `central-v119.html`: carrega a camada nova com versionamento de ativos.
- `sw.js`: inclui os novos ativos no cache offline, sem alterar localStorage ou IndexedDB.
- `package.json`: comando de testes automatizados.

## Alterações visuais

Ocultado apenas na interface:

- hero e grade antiga da Home;
- botões extras e rótulos de grupo da navegação antiga;
- apresentação antiga da Agenda.

Mantido no código e nos dados:

- disciplinas, módulos, teoria, questões, anotações e progresso;
- Vade Mecum e Caderno de Erros;
- rotinas legadas necessárias à compatibilidade;
- todas as chaves de persistência existentes.

Adicionado:

- Home focada apenas no resumo de Hoje;
- Agenda aberta no dia atual, calendário mensal e pendências anteriores;
- inclusão rápida por Enter, horário e observação opcionais;
- conclusão, edição, duplicação, remarcação e exclusão com confirmação;
- ordenação por arrastar no desktop e botões subir/descer no toque;
- progresso discreto por dia;
- navegação reduzida a Início, Disciplinas, Agenda, Revisar meus erros, Caderno de Erros e Vade Mecum;
- fallback de recuperação para JSON inválido;
- controles móveis de 44 px e calendário visível no celular.

## Persistência

Chaves que a Agenda pode gravar:

- `central-v6:agenda:YYYY-MM-DD` — mesmo formato e namespace já usados;
- `central-v6:agenda-recovery:YYYY-MM-DD:timestamp` — cópia preventiva antes de substituir manualmente um registro inválido;
- `central-v6:agenda-corrompida:timestamp` — cópia legada mantida pelo leitor independente.

Não houve renomeação de chaves, conversão em lote ou migração. Campos desconhecidos de cada tarefa são preservados nas edições.

Verificadas como não alteradas pelos testes:

- `CENTRAL_CRONOGRAMA_6M_V2`;
- `cf_tjce_fcc_guided_v23`;
- `penal_tjce_fcc_guided_v32`;
- `cpc_tjce_fcc_guided_v34`;
- `central-v6:civil-course-v1`;
- `central-v6:civil-study-progress-v1`;
- `central-v6:pt:m1:v3`;
- `central-v6:tec:registros`;
- `lei-seca-enxuta-state`;
- `vade-mecum-central-v1`;
- `vade-mecum-comments-v1`;
- preferências de aparência, fonte, barra lateral e última tela;
- IndexedDB `anki-offline-tauanne-v1` e `vade-mecum-images-v1`.

O `sync-client.js` continua sendo o mecanismo remoto existente; a mudança não cria um segundo backend nem altera seu contrato.

## Validação executada

- 10/10 testes automatizados aprovados.
- Verificação estática sem `localStorage.clear()` ou `indexedDB.deleteDatabase()`.
- Snapshot de progresso, preferências e IndexedDB idêntico antes/depois das operações de Agenda.
- Inclusão rápida, conclusão, reabertura, edição, duplicação e remarcação validadas no preview.
- Persistência após recarregar a página validada.
- Disciplinas, Revisar meus erros, Caderno de Erros e Vade Mecum abertos no preview.
- Desktop: 1196 px, duas colunas, sem overflow horizontal.
- Tablet: 816 px, uma coluna, sem overflow horizontal.
- Celular: 386 px, uma coluna, calendário visível, controles de toque em 44 px e sem overflow horizontal.
- Service worker, manifesto e ativos versionados responderam corretamente.
- Nenhum erro de runtime agrupado na Vercel durante a validação.

A exclusão destrutiva não foi acionada no navegador de validação; sua lógica e a confirmação nativa foram cobertas por inspeção e teste unitário. A produção e os dados reais não foram usados nos testes.

## Riscos residuais e próxima versão

- Recorrência fica para a v2, pois introduzi-la agora exigiria novo modelo de dados e aumentaria o risco de migração.
- A instalação PWA, o toque em hardware físico e uma desconexão real de rede devem receber uma rodada manual antes de promover para produção; o cache offline e os fallbacks foram validados por código e respostas HTTP.
- O preview contém somente tarefas sintéticas criadas no armazenamento isolado do navegador de teste.

## Rollback exato

Nenhum rollback de produção é necessário, porque a produção não foi alterada.

Rollback não destrutivo do preview atual:

```bash
git switch main
git switch -c rollback/agenda-simples-65844e8 65844e8c22fb33b2bcf08f9130315dbd0496d813
vercel --yes
```

Se a branch for mesclada no futuro, reverta o commit de merge sem apagar dados:

```bash
git switch main
git pull --ff-only
git revert -m 1 <SHA_DO_MERGE>
git push origin main
```

O rollback de código não deve remover nenhuma chave `central-v6:*`, IndexedDB ou dado sincronizado.
