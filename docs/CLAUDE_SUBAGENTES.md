# Claude Code — subagentes da Base Completa

## Escopo

Esta configuração é para **desenvolver e auditar o repositório** da Base Completa usando Claude Code. Os subagentes **não são funcionalidades da Central visíveis aos alunos**, nem robôs que monitoram produção continuamente.

| Arquivo | Especialidade | Permissões |
| --- | --- | --- |
| `.claude/agents/bc-arquiteto.md` | Mapear arquitetura e planejar | Leitura |
| `.claude/agents/bc-seguranca.md` | Auditoria de acesso e dados | Leitura |
| `.claude/agents/bc-desenvolvedor.md` | Implementar patches pontuais | Leitura e edição local |
| `.claude/agents/bc-testes.md` | Rodar testes e informar regressões | Leitura e comandos de testes |

O agente principal coordena e mantém o controle sobre commits, push, pull requests, deploy e decisões de produto. **Configurar agentes não é executar auditorias automaticamente.**

## Como ativar

1. Abra o projeto `Diogooliveira-bot/central-de-estudos-2026` no Claude Code em uma sessão que contenha estes arquivos (por exemplo, após fazer checkout desta branch ou incorporá-la).
2. Se a pasta `.claude/agents/` não existia ao iniciar a sessão, reinicie o Claude Code para que seja descoberta.
3. Peça: `Use bc-arquiteto para analisar riscos técnicos da integração de novos editais sem modificar arquivos.`
4. Peça: `Use bc-seguranca para revisar autenticação e acessos premium, sem tocar em produção.`
5. Para implementar, confirme primeiro uma branch de trabalho e peça: `Use bc-desenvolvedor para corrigir o problema identificado, preservando os módulos existentes.`
6. Depois peça: `Use bc-testes para rodar os testes focados e, se possível, npm test; apresente resultados e pendências.`

O Claude também pode selecionar automaticamente um subagente quando a solicitação corresponder à descrição, mas isso depende da sessão e do ambiente. Para conferir carregamento, consulte o Claude Code e valide que reconhece os nomes definidos aqui.

## Fluxo padrão para mudanças

**Analisar → planejar → implementar na branch → testar → revisar o diff → pedir autorização para publicar.**

- Investigações independentes (arquitetura e segurança) podem ocorrer em paralelo.
- Mudanças concorrentes nos mesmos arquivos não devem ser feitas em paralelo.
- Nunca presumir que Preview está ligado a banco separado: seguir `docs/PREVIEW_ACCESS.md`.
- Não usar login de aluno real, segredos em mensagens, nem bypass de login em produção.
- Não fazer merge ou deploy sem autorização explícita do proprietário.
- Se testes não puderem ser executados, registrar **NÃO EXECUTADO**, sem declarar aprovação.

## Observações técnicas

- Os agentes usam `model: sonnet`; o uso depende do acesso do usuário ao Claude Code e pode consumir limites/tokens.
- `bc-arquiteto` e `bc-seguranca` só recebem ferramentas de leitura; `bc-desenvolvedor` não recebe Bash; `bc-testes` recebe Bash para testes.
- As instruções em Markdown **não são um bloqueio técnico absoluto** a ações fora dos agentes. Configure proteções adicionais de branch e permissões no GitHub e Vercel para impedir publicações indevidas.
- Os comandos de testes disponíveis são os definidos em `package.json`; os testes de navegador dependem das ferramentas e credenciais de homologação realmente configuradas.
