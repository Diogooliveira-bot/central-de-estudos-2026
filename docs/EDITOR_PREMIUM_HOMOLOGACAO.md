# Editor Premium Base Completa — laboratório de homologação

**Situação:** implementação isolada na branch `feature/editor-premium-base-completa-20261104`. A produção não é alterada sem merge.

## O que foi implementado
- Botão **✦ Editor Premium** somente para perfis `admin` e `editor`, ao abrir módulo compatível.
- Área de edição em tela inteira: título e parágrafo separados, formatação de texto selecionado (negrito, itálico, sublinhado, destaque, fontes, tamanhos, cor), alinhamento e espaçamento.
- Inserção de parágrafos, títulos, listas, tabelas editáveis, cards ATENÇÃO/DECORE/PEGADINHA/EXEMPLO/RESUMO e imagem WebP (apenas administrador).
- Tabelas com inclusão de linhas e colunas. Cards com título e corpo independentes.
- Colagem de trechos de HTML de Word (com limpeza de estilos Office) e importação de Markdown/texto com separação em blocos.
- Reordenação, duplicação, exclusão, prévia, desfazer/refazer de snapshots.
- Rascunho automático salvo localmente; botão **Publicar conteúdo** envia ao servidor.
- Publicação com `expectedRevision` e resposta 409 para concorrência; snapshots de revisões publicadas mantidos na API; consulta e restauração como rascunho.
- Botão antigo de edição preservado na Preview para comparação/rollback.

## Integração
- `central-v119.html`: injeta `ui/editor-premium-v1.css` e `ui/editor-premium-v1.js` depois do editor anterior.
- `api/content-editor.js`: aceitar `expectedRevision` opcional; manter clientes antigos compatíveis; histórico separado por `content_id` e `revision`.
- `ui/editor-premium-v1.js`: mantém o padrão de identificador `reader:<hash>` do editor antigo e os marcadores de componentes protegidos.
- `ui/editor-premium-v1.css`: aparência de documento isolada e estilos dos novos cards no leitor.

## Verificações obrigatórias antes de produção

1. Abrir módulo de Constitucional e confirmar os dois botões: Editar (legado) e Editor Premium.
2. Abrir o Editor Premium como administrador e verificar campos/títulos do capítulo existente.
3. Colar texto Markdown grande com `##`, listas, negrito e parágrafos; confirmar blocos separados.
4. Colar HTML copiado do Word; confirmar ausência de estilos estranhos/elementos Office.
5. Aplicar fonte, tamanho, cor e destaques em seleção dentro de parágrafo.
6. Adicionar cards e editar separadamente título e corpo; mover e duplicar cards.
7. Inserir tabela, adicionar linha e coluna, editar células.
8. Inserir imagem como administrador; verificar visual e legenda. Confirmar impossibilidade para perfil editor.
9. Prévia: sem controles e sem publicação; voltar para edição.
10. Recarregar com rascunho pendente e recuperar sem publicar acidentalmente.
11. Abrir duas sessões do mesmo módulo; publicar na primeira e verificar bloqueio 409 na segunda.
12. Publicar nova revisão e recuperar revisão antiga via botão Versões.
13. Confirmar que aluno não vê botão, que módulo reproduz imagens existentes e que atividades/progresso interativos funcionam.
14. Verificar no celular a disposição da barra e do papel.
15. Testar restauração de conteúdo existente e não perder estilos ou estruturas customizadas de outras disciplinas.

## Riscos e limites ainda sujeitos à homologação
- O editor novo é uma **primeira implementação sem dependência externa**, baseada em Range/Selection e campos isolados, não um pacote Tiptap já integrado.
- Campos estruturados legados complexos têm tratamento conservador e precisam de teste visual por disciplina.
- O histórico no banco armazena as versões publicadas e faz recuperação como rascunho. Não substitui backups gerais do Neon.
- Rascunhos ficam no navegador local; não sincronizam entre dispositivos antes de publicação.
- `Ctrl+Z` reverte snapshots de documento, não possui granularidade equivalente à do Word em cada digitação.
- Não presumir homologação somente pelos testes estáticos. Exigir teste real de browser com sessão administrativa e revisão de segurança do HTML.

**Regra de release:** não mesclar a PR draft nem publicar em produção sem validar os itens acima.