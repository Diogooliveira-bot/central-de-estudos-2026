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

## Como trabalhar com o proprietário (preferência dele)
- O proprietário não é técnico e quer **simplificar o trabalho dele**: o agente faz toda a parte lógica/técnica
  (investigar, corrigir, testar, abrir PR, conferir deploy) e **facilita a vida dele**.
- Explicar em **português simples**, sem jargão, em poucas frases; dizer o que mudou, o que foi testado e o que
  falta **dele** (só o que realmente exigir a conta/permissão dele).
- Não devolver tarefas técnicas ao proprietário nem pedir que ele repasse comandos a outros chats; resolver aqui.
- Quando precisar de algo dele, pedir **uma coisa de cada vez**, com o passo a passo curto.
- Publicar na `main`/produção **somente** com um "pode publicar/mesclar" explícito dele (isso não muda).
