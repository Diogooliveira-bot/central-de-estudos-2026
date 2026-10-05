# Verificação da Central — 05/10/2026

Site: https://central-de-estudos-ecru.vercel.app/

Auditoria feita pela navegação e pelos controles da interface, em sessões isoladas do Chromium. Nenhum conteúdo definitivo, backup ou progresso de outro usuário foi alterado. As correções preservam os registros existentes e o carregamento de arquivos atuais pela rede.

## Defeitos encontrados e corrigidos

| Defeito | Efeito para o usuário | Correção |
| --- | --- | --- |
| Disciplinas e Desempenho com rolagem bloqueada | Os módulos e os registros abaixo da tela não podiam ser alcançados | As telas fixas agora têm altura limitada à área disponível e rolagem própria, inclusive quando a navegação move a tela para fora do workspace |
| Mapa de CPP com 16 módulos antigos | Lista, títulos e contagem divergiam dos 22 módulos publicados | O mapa usa os identificadores e títulos do índice atual, disponíveis sem baixar a teoria |
| Mapa abria destinos antigos ou somente a disciplina | O usuário não chegava diretamente ao módulo escolhido | O mapa usa a mesma navegação dos módulos nativos; Enter e Espaço também abrem a seleção |
| Progresso do mapa divergente das disciplinas | Leituras e atividades já realizadas podiam continuar em 0% | Os mapas consultam o progresso atual dos leitores e do curso de Civil, incluindo registros ainda não carregados na página |
| Rodadas nativas ausentes do Desempenho | Em CPP, 12 questões e 8 acertos apareciam no módulo, enquanto o painel geral permanecia zerado após recarregar | O desempenho agrega histórico dos tópicos, rodadas dos módulos, estado de CPP e registros do TEC; cada registro do TEC entra uma única vez |
| Anotação de Administrativo sem atualização imediata | O texto era salvo, mas a tela ainda dizia que não havia anotações | A lista correta é atualizada ao salvar e permanece após recarregar |
| Dois pares de controles de fonte em Português | Controles diferentes disputavam o tamanho do texto | Um único controle de leitura; preferência compartilhada com as configurações e preservada ao recarregar |
| Leitores de Administrativo, CPP e Civil sem navegação adequada pelo teclado | Esc não fechava ou o foco permanecia atrás da leitura | Foco inicial no leitor, Tab contido no diálogo, fechamento com Esc e retorno ao módulo de origem |
| Agenda usando a data UTC | Às 22h30 em São Paulo, a agenda já mostrava o dia seguinte | Agenda e revisão rápida usam o dia local do aparelho |
| CPP aceitava quantidades inválidas | Valores negativos ou fracionários podiam produzir registros incoerentes | Apenas inteiros não negativos, com acertos até o total de questões; salvar novamente atualiza a rodada |
| Pacote offline de Civil com referências da inicialização anterior | Mesmo depois de preparar o modo offline, a Central não reabria sem internet | Manifesto alinhado ao carregador atual; 397 arquivos preparados e abertura sem internet conferida |
| Campos e cabeçalhos da nova versão de Civil com visual inconsistente | Quantidades quase invisíveis e palavra “Módulo” cortada no meio | Campos com contraste, cores integradas aos temas da Central e cabeçalhos ajustados para telas pequenas |

Também foram ajustadas as descrições de Administrativo e CPP na lista de disciplinas e a numeração do cálculo rápido e dos nove módulos de RLM no mapa.

## Cobertura

- Oito áreas do menu, no computador (1280 px) e no celular (390 px): Início, Agenda, Disciplinas, Cadernos TEC, Lei em Dia, Vade Mecum, Desempenho e Configurações.
- As dez disciplinas, com enumeração dos módulos e abertura do primeiro e do último no computador e no celular. Português inclui a revisão final além dos 24 módulos; RLM inclui cálculo rápido além dos nove módulos.
- Os 20 módulos de Administrativo e os 22 de CPP têm resumo e material completo disponíveis. Nos leitores, foram conferidos índice, fonte, cores, conclusão, retomada, troca de disciplina e cancelamento da edição.
- Uma nova publicação dos 15 módulos de Civil entrou durante a auditoria e foi preservada. A integração recebeu navegação pelo mapa, retomada do leitor, os controles compartilhados de leitura, tratamento de falha de conexão e inclusão das novas rodadas no Desempenho. Foram conferidos materiais, anotações, questões internas e infográficos na versão nova.
- Cabeçalhos e cartões de Administrativo e CPP em 1280, 390 e 320 px, sem corte horizontal.
- Agenda manual: adicionar, concluir, recarregar, gerar dez tarefas automáticas e limpar somente as automáticas, preservando a tarefa manual.
- Configurações: tema e tamanho da fonte permanecem após recarregar.
- Vade Mecum: marcação, comentário, persistência após recarregar e busca sem resultados.
- Lei em Dia: seleção de CPP, abertura do caderno e navegação pela interface de questões.
- Falha de conexão simulada no carregamento de CPC: tela de erro, tentativa seguinte, ausência de declarações duplicadas, link direto e retomada.
- Preparação offline atual: 397 arquivos salvos, sem falhas. Início, leitores completos dos últimos módulos de Administrativo, CPP e Civil e abertura de CPC sem internet foram verificados.
- Leitura da API de conteúdo: HTTP 200; ausência de ID: HTTP 400. Backup e sincronização sem chave: HTTP 401, conforme a proteção esperada.
- Sintaxe dos arquivos alterados e dos 21 scripts inline da página principal validada.

## Limites da verificação

As larguras de celular foram simuladas no Chromium; não foram testes em aparelhos físicos ou no Safari. A disponibilidade de todos os materiais de Administrativo e CPP foi conferida, mas não foi feita a leitura integral de cada apostila. Gravação definitiva no editor, backup e sincronização autenticada dependem da chave administrativa e não foram exercitados; edição foi conferida pelo fluxo de cancelamento. Os cadernos externos do TEC dependem da conta do usuário.

A primeira transferência de uma disciplina extensa, especialmente CPC, ainda depende da conexão. A página inicial continua abrindo antes dessas transferências, e o carregamento da disciplina mantém a logomarca e a opção de tentar novamente quando houver falha.
