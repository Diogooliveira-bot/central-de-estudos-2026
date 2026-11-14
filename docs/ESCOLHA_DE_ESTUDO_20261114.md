# Escolha de estudo (janela inicial) — 14/11/2026

Situação: **branch de trabalho, não publicada**. Publicar depende de autorização do proprietário.

## O que o aluno vê
1. **Estudo livre** em primeiro lugar (marcar disciplinas, com "Marcar todas" e "Limpar").
2. **Perfis padrão** por área: Policial, Judiciária, Administrativa, Bancária, Fiscal, Guarda, Trânsito, Educação, Saúde.
3. **Edital específico**: editais cadastrados (hoje TJPB 2026 e TRT-8 2026) e o campo **"Seu edital não está na lista?"** para pedir um edital.

## Acesso a tudo
- Nenhuma disciplina é escondida. A escolha só **organiza**: as disciplinas da trilha vão para o topo da página inicial com uma barra verde, e todas as outras continuam logo abaixo.
- Filtros e questões não são mais restritos pelo objetivo (`questionDisciplineKeys()` devolve `null`).
- No painel do aluno (próximo passo/progresso), disciplinas fora da trilha que ele já começou continuam contando.
- Informática entra em todas as trilhas de carreira e pode ser escolhida no Estudo livre (a API a recusava antes).

## Pedidos de edital
- Aluno: `PUT /api/objective?resource=exam-request` com `{ "text": "..." }` (3 a 120 caracteres, sem `<` `>`). Um pedido por aluno; o mais recente vale.
- Armazenamento: colunas `requested_exam` e `requested_exam_at` em `central_user_preferences`, criadas na primeira chamada por `ALTER TABLE ... ADD COLUMN IF NOT EXISTS` (mesmo padrão de `free_subject_ids`; sem tabela nova).
- Administrador: painel **"Pedidos de edital dos alunos"** em `usuarios.html`, agrupado pelo mesmo nome (sem acento/caixa), mais pedidos primeiro, com botão **Marcar como atendido**. `GET/PUT /api/objective?resource=exam-requests` é exclusivo do papel `admin`.
- Na Prévia sem login o pedido fica só no navegador (a prévia não chama APIs de conta).

## Verificações
`npm test` (369) e `npm run test:premium-protection` passam. Teste visual no app real em servidor local com a API de login simulada (desktop e celular). **Falta** teste com conta fictícia no ambiente Preview/produção, inclusive a criação das colunas no Neon.
