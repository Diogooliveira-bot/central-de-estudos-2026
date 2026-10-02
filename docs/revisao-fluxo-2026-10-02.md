# Revisão do fluxo da Central — 02/10/2026

## Problemas reproduzidos e correções

- **Continuar após abrir uma ferramenta:** o registro `folder:vade` era enviado ao carregador de páginas, produzindo uma tela vazia. O retorno agora usa o roteador da ferramenta e preserva as opções de lei, disciplina e tópico. Registros inválidos têm retorno seguro ao início.
- **Atalhos de estudo:** o carregador descartava `study` e `subject`. Agora mantém parâmetros e fragmentos, abre as disciplinas e usa os identificadores nativos de cada curso.
- **Voltar ao módulo:** Vade Mecum, Decorando e RLM preservam o contexto na sessão da aba. O link de retorno reabre a disciplina e o módulo de origem; entradas independentes continuam com retorno ao início.
- **Agenda até o estudo:** tarefas vinculadas às disciplinas ganham um botão Estudar. A descrição fica visível. O início usa a mesma renderização da agenda atual, inclusive após atualizar um módulo.
- **Primeiro acesso:** a leitura da agenda deixa de criar automaticamente tarefas fictícias. Tarefas e registros existentes são preservados.
- **Celular:** tarefas em uma coluna, descrições visíveis e controles legíveis; sem rolagem horizontal da página em 390 × 844.

## Validação

No navegador local: retorno ao mesmo módulo, Continuar com um registro antigo de ferramenta, atalho do segundo módulo de Constitucional, criação de tarefa e acesso à disciplina pela agenda, Agenda, Disciplinas, Cadernos TEC, Desempenho, abertura e fechamento das Configurações, menu móvel e layout móvel. Nenhum erro JavaScript ou resposta de recurso estático com status de erro nesses fluxos.

A verificação de links encontrou **262 endereços únicos** presentes na interface e em seus botões. **219 responderam HTTP 200**. Outros **43 não foram confirmados**: 37 endereços de cadernos TEC responderam HTTP 405 e seis endereços do STF responderam HTTP 403. Esses resultados não comprovam link quebrado: exigem validação manual no navegador com o acesso apropriado. Não foram encontrados HTTP 404 nesta amostra. A checagem HTTP não valida o conteúdo de cada caderno nem a existência de cada fragmento de artigo.

Esta revisão não inclui validação jurídica do conteúdo, backup online ou sincronização entre aparelhos.
