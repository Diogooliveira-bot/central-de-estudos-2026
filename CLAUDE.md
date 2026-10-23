@AGENTS.md

# Claude Code — Base Completa

Este arquivo importa as regras de segurança e prévia existentes em AGENTS.md. Não substitua nem enfraqueça essas regras.

## Trabalho por subagentes
- `bc-arquiteto`: avaliação da arquitetura, dependências e plano de mudanças (somente leitura).
- `bc-seguranca`: revisão de autenticação, papéis, dados de alunos, acesso premium e endpoints (somente leitura).
- `bc-desenvolvedor`: implementação pontual **apenas em branch de trabalho**, após escopo definido.
- `bc-testes`: testes automatizados e revisão de regressões, sem publicação nem alterações de dados reais.

Para tarefas de implementação: primeiro entenda o código existente, peça análise de risco quando necessário, faça a menor mudança viável e solicite validação do `bc-testes`. Pode delegar investigações independentes em paralelo; não execute em paralelo escritas nos mesmos arquivos.

## Limites obrigatórios
- Nunca publicar em produção, fazer merge na branch `main`, executar migrações de produção ou criar bypass de autenticação sem autorização expressa do proprietário.
- Nunca usar credenciais, dados ou sessões reais de alunos em testes; jamais imprimir segredos, cookies, tokens ou strings de conexão.
- Não recriar módulos, cadernos TEC/QC, teorias, progresso ou interfaces aprovadas; preservar compatibilidade com Vercel, Neon e PWA.
- Conferir as regras de prévia em `docs/PREVIEW_ACCESS.md`; não presumir que o banco Preview está isolado.
- As instruções são orientações operacionais, não substituem controles de permissão ou aprovação do GitHub/Vercel.

## Verificação e relato
- Para alterações no aplicativo, executar `npm test` quando o ambiente permitir e os testes focados existentes pertinentes em `package.json`.
- Para interface ou fluxo real, solicitar testes de navegador com conta fictícia no ambiente correto; não afirmar que foram executados quando não foram.
- Entregar síntese com arquivos alterados, testes executados/resultados, riscos, pendências e link de PR/Preview somente se existir.
- Detalhes de uso dos agentes: `docs/CLAUDE_SUBAGENTES.md`.
