# Relatório — ADM M05, Revisão Guiada

## Escopo e identificação

O pacote foi aplicado ao **M5 real** de Direito Administrativo, cujo tema na Central é **Agentes Públicos, Cargo, Emprego e Função Pública**. O comando recebido associa “Poderes Administrativos” ao M5, mas os índices e a Revisão Guiada do repositório apontam esse tema como **M4**; o M5 contém nove capítulos de agentes públicos. Para respeitar a regra de usar a estrutura real e executar apenas o módulo indicado, as artes foram produzidas para os nove capítulos reais de M5. Nenhum arquivo/conteúdo de M4 foi alterado.

## Capítulos identificados

1. Pessoas que atuam em nome do Estado
2. Espécies de agentes públicos
3. Cargo, emprego e função pública
4. Regimes jurídicos e concurso público
5. Da aprovação ao início do exercício
6. Provimento, movimentação e vacância
7. Estágio probatório e estabilidade
8. Direitos, deveres e responsabilidades
9. Acumulação de cargos e situações concretas

## Produção e integração

- Imagens PNG verticais criadas: **9** (1229 × 1536 px), uma por capítulo.
- Imagens WebP otimizadas e integradas: **9**, ao final do capítulo correspondente na Revisão Guiada.
- As imagens usam a logomarca e o mascote oficiais disponíveis no projeto.
- O carregador retorna o conteúdo original no modo completo antes de aplicar as artes. Portanto, a integração ocorre apenas no modo de revisão; nenhum conteúdo, questão ou sessão da teoria completa foi editado.
- Os arquivos também foram incluídos no manifesto offline do app.

## Revisão visual e jurídica

As nove imagens foram renderizadas a partir de SVG controlado e conferidas quanto a margens, cortes, sobreposições, legibilidade, alinhamento e associação título/conteúdo. A folha de contato permite comparar o conjunto; imagens individuais estão em `png/`.

O conteúdo foi revisado com base nos dispositivos vigentes pertinentes, em especial Constituição Federal (arts. 37 e 41), Lei 8.112/1990 e alteração da EC 138/2025 sobre acumulação por professores. A regra de acumulação foi atualizada para incluir um cargo de professor com outro de qualquer natureza.

Fontes oficiais:
- [Constituição Federal — Planalto](https://www.planalto.gov.br/ccivil_03/constituicao/constituicao.htm)
- [Lei 8.112/1990 — Planalto](https://www.planalto.gov.br/ccivil_03/leis/l8112cons.htm)
- [Emenda Constitucional 138/2025 — Câmara dos Deputados](https://www.camara.leg.br/legin/fed/emecon/2025/emendaconstitucional-138-19-dezembro-2025-798461-publicacaooriginal-177214-pl.html)

## Testes

- Testes automatizados completos do projeto: **532 testes; 531 aprovados, 0 falhas, 1 ignorado**.
- Testes específicos verificaram a correspondência dos nove arquivos à Revisão Guiada real e a ausência das artes no Conteúdo Completo.
- Checagens de sintaxe, JSON, dimensões/formatos e `git diff --check` aprovadas.
- A inspeção visual dos PNGs foi feita localmente. A visualização autenticada da Central e os testes em navegador real nos três tamanhos não puderam ser executados neste ambiente; o CSS do leitor aplica largura responsiva e altura automática, e os testes de escala/tablet do projeto passaram.

## Publicação

Pendente até a conclusão do push e da confirmação do deployment Vercel.
