# Revisão visual — 30/09/2026, r2

Corrige os problemas reproduzidos na produção de commit `5bec6a3`:

- Cadernos TEC: nome e ações em linhas próprias no celular, com botões de pelo menos 44px.
- Tabelas dos módulos: contêiner com rolagem horizontal e foco por teclado. Colunas e conteúdo preservados.
- Títulos longos, incluindo revisão/restabelecimento no Administrativo M18: quebra de palavras para evitar corte.
- Grade da página inicial: colunas podem encolher em telas pequenas, mantendo os módulos dentro da tela em 320px.
- Primeira sessão pendente: utiliza o botão nativo de abertura dos módulos genéricos.
- Índice de sessões: fecha antes de calcular a rolagem; navegação anterior/próxima preservada.
- Retorno: uma única seta. Ícone da aba reutiliza a identidade do aplicativo.
- Fontes dos novos controles: 14px. Cache e recursos atualizados para `20260930r2`.

## Verificação no Chromium

- Estrutura das dez disciplinas: 162 blocos padronizados carregados.
- TEC: 229 cartões verificados em 320, 390 e 1440px; sem sobreposição entre nomes e ações.
- Administrativo M11, M15 e M18: tabelas roláveis, últimas colunas acessíveis e sem excesso de largura no corpo.
- Civil M1: índice, anterior e próxima em três larguras; destino aproximadamente 90px abaixo do topo.
- Primeira sessão: Português e Constitucional concluídos com dados de teste; botão abre o primeiro módulo pendente de Administrativo.
- Anotação de Civil, leitura de Civil/CPP e rodada de CPP preservadas após recarregar.
- Favicon responde HTTP 200, retorno exibe uma seta e nenhum erro JavaScript nas verificações.

Os cenários usam armazenamento isolado do navegador de teste. Não alteram conteúdo jurídico, chaves persistentes ou dados de usuários. Não verificam restauração online ou sincronização entre aparelhos.
