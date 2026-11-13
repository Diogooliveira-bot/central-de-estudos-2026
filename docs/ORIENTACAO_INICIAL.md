# Orientação inicial dos módulos

Bloco único e curto exibido na abertura de cada módulo, com três linhas: **Foco**, **Atenção** e **Como estudar**.

- Cobre 137 módulos: ADM (20), CF (15), Civil (15), CPC (20), Penal (17), CPP (22), RLM (15) e Informática (13).
- Renderizador compartilhado: `ui/orientation-v1.js` (`BCOrientation.html('<disciplina>:<n>')`). Textos padrão: `ui/orientation-defaults-v1.js`.
- Substitui os painéis antigos (🎯 objetivos, 📖 dica, ⚠️ atenção, ✅ conferência e listas “pontos para observar”). Progresso, “Marcar concluída”, materiais e questões não foram alterados.

## Edição pelo proprietário
Perfis `admin` e `editor` veem o botão **Editar** no próprio bloco. A edição vale para todos os alunos e fica em `central_content_overrides` com id `orient:<disciplina>:<n>` (texto simples, até 400 caracteres por campo, histórico de revisões e controle de concorrência).
**Restaurar texto padrão** remove a edição. Alunos leem via `GET /api/content-editor?action=orientations`; sem rede ou na Prévia sem login vale o texto padrão.

## Revisão recomendada
Os textos padrão foram redigidos a partir dos títulos e resumos dos módulos. Penal e CPP em especial merecem uma leitura jurídica rápida antes de publicar (o editor permite ajustar na hora).
