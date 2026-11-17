# Segurança da Base Completa

## Comunicação responsável

Relate uma possível vulnerabilidade de forma privada para `basecompleta.estudos@gmail.com`. Não abra uma issue pública com credenciais, dados pessoais, detalhes exploráveis ou capturas de alunos.

Inclua, quando possível: componente afetado, impacto, passos mínimos para reprodução e uma forma segura de contato. Não teste com dados de terceiros, não execute carga agressiva e não tente manter acesso.

## Versões mantidas

A versão em produção e a branch `main` recebem correções de segurança. Correções devem passar por Pull Request, pela suíte `Segurança contínua` e por uma prévia isolada antes da publicação.

## Princípios operacionais

- Segredos existem somente nos cofres dos provedores; nunca no repositório, nos logs ou em relatórios.
- Nenhuma Preview pode usar banco sem `BC_PREVIEW_NEON_GUARD=YES` e sem o host Neon de homologação fixado.
- Permissões Premium e administrativas são verificadas no servidor.
- Mudanças em produção exigem autorização do proprietário e plano de reversão.
- Incidentes seguem [docs/SECURITY_INCIDENT_RESPONSE.md](docs/SECURITY_INCIDENT_RESPONSE.md).

