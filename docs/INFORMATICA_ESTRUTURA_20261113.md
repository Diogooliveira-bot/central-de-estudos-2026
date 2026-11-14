# Informática — estrutura inicial | Base Completa
Data: 13/11/2026  
Situação: **somente estrutura em branch de trabalho**. Publicação depende de aprovação do proprietário.

## Escopo aprovado
- Cadastrar Informática como disciplina independente, com **13 módulos**.
- Mostrar sumário de assuntos, sem transformar um sumário em teoria publicada.
- Preparar áreas de **conteúdo resumido** e **conteúdo completo**, inicialmente "Em produção".
- Questões no **novo padrão da Central**: somente questões próprias na área "Questões" e um link do Qconcursos por módulo, excepcionalmente dois quando o conteúdo exigir.
- **Não** cadastrar questões de bancas manualmente; **não** reintegrar o TEC.
- Não fornecer links fictícios do QC, não tornar as pendências clicáveis e não contabilizá-las em progresso.
- Manter conteúdos, módulos, progresso e planos existentes das demais disciplinas inalterados.

## Ordem editorial (13 módulos)
1. Fundamentos de Informática.
2. Windows 10 e 11.
3. Linux.
4. Microsoft Word.
5. Microsoft Excel I — Fundamentos.
6. Microsoft Excel II — Funções e Recursos.
7. Microsoft PowerPoint.
8. LibreOffice e Ferramentas Online.
9. Internet, Navegadores e Pesquisa.
10. Redes de Computadores.
11. Correio Eletrônico e Nuvem.
12. Segurança da Informação.
13. Inteligência Artificial e Tecnologias Digitais (conteúdo complementar, condicionado ao edital).

## Critérios de liberação de cada módulo
1. Produzir e revisar o texto **resumido** e a **teoria completa**.
2. Validar exemplos, comandos, versões de software, imagens demonstrativas e coerência com editais; nenhum conteúdo deve ser rotulado como completo enquanto estiver incompleto.
3. Liberar progressivamente a teoria revisada; somente depois ativar seu indicador de conclusão.
4. Em etapa posterior, criar e revisar questões autorais no banco de questões do sistema, sem embuti-las na leitura.
5. Em etapa posterior, adicionar link QC real validado, com no mínimo 20 questões, preferencialmente um filtro por módulo. Respeitar a restrição Premium já existente.
6. Verificar interface mobile, carregamento, histórico de progresso e ausência de interferência em outras disciplinas.

## Status deste lote — teoria M01 a M13
- Disciplina e 13 módulos: cadastrados na branch de trabalho.
- **Teoria completa:** textos autorais em seções para os 13 módulos, com situações de prova e distinções conceituais.
- **Modo de revisão:** sínteses e recuperação ativa para os 13 módulos.
- **Leitor:** abertura por módulo, índice, navegação entre seções e progresso de leitura por modo salvo localmente.
- **Carregamento sob demanda:** arquivos `content/informatica/mNN.js` baixados somente quando a leitura é aberta.
- **Questões autorais:** 130 questões (10 por módulo, M01–M13) no banco `content/questoes/info/mNN.js`, no mesmo padrão das demais disciplinas (5 alternativas, gabarito 2 por letra, comentário que explica cada alternativa errada, sem banca/ano/órgão). Entregues por `/api/questoes` (limite diário do plano Gratuito). Conferidas por validador automático e por resolução independente às cegas (2 rodadas).
- **Qconcursos:** em produção; nenhum URL externo novo foi inventado.
- **TEC:** nenhum link foi adicionado à disciplina.
- **Progresso global:** módulos não são contados como concluídos sem as futuras etapas de questões; percentual das seções corresponde apenas à leitura.
- **Dados reais dos alunos / Neon:** não alterados.
- **Produção oficial:** não publicada; PR em rascunho e deploy da branch em Preview.

## Revisão técnica e atualização
- M02: ciclo de suporte comum do Windows 10 encerrado em 14/10/2025; programas de suporte estendido são exceção.
- M05/M06: exemplos de referências, fórmulas e funções consideram Excel em pt-BR.
- M08: extensões ODF de Writer/Calc/Impress verificadas na documentação oficial do LibreOffice.
- M10: HTTPS pode usar HTTP/3/QUIC, portanto não se afirma que depende exclusivamente de TCP.
- M12: funções do NIST CSF 2.0 incluem **Governar** além das cinco funções anteriores.
- M13: modelo generativo não é tratado como fonte confiável automática, conforme riscos descritos pelo NIST.

## Próximas publicações editoriais
1. Revisão humana de linguagem, profundidade e pertinência ao edital antes de disponibilizar como conteúdo final aos alunos.
2. Publicar questões próprias na seção de Questões após revisão de gabaritos e comentários.
3. Cadastrar filtros reais do QC por módulo quando validados (mínimo 20 questões; preferencialmente um por módulo).
4. Publicar em produção somente mediante autorização do proprietário.

## Barreira de segurança para publicação em produção
- Os 13 arquivos `content/informatica/mNN.js` são classificados como `theory.complete` e excluídos do diretório estático da Vercel.
- Para o plano Gratuito, o servidor projeta somente `review`; não entrega `full`, gabaritos ou links protegidos.
- Para Premium, o servidor verifica a permissão antes de disponibilizar o arquivo integral.
- O service worker não salva os arquivos protegidos em cache público/offline.
- No plano Gratuito, o cartão Teoria completa permanece visível; ao abrir, informa que é exclusivo do Premium.
