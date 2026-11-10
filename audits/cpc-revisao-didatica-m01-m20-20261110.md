# Base Completa — Processo Civil M01–M20 | Versão didática final para aprovação
Data-base editorial: 10/11/2026.

## Escopo implementado
- M01–M04: novo roteiro autoral com explicação contextual, 5 temas, 5 exemplos, pontos de memorização e fontes.
- M05–M08: novo roteiro autoral com 5–6 temas, exemplos e fontes.
- M09–M14 e M15–M20: ampliação dos resumos curtos com explicações, distinções, 5 exemplos e fontes em cada módulo.
- O complemento didático é inserido exclusivamente na versão **resumida** pelo leitor compartilhado `ui/cpc-apostila-reading-v1.js`, antes do roteiro existente, permitindo que o aluno primeiro compreenda e depois revise.
- A leitura **completa** não recebe adições. As fontes originais dos 20 módulos, questões, gabaritos, imagens, referências legais, chaves de progresso e IDs de capítulos não são substituídos.
- Apresentação em prosa contínua, fonte limpa, sem mosaico excessivo de cartões; legislação apenas em uma seção recolhível por módulo.
- Cálculo de palavras/tempo de leitura ajustado para o texto apresentado.

## Conteúdo de cada módulo
| Módulo | Tema |
|---|---|
| 01 | Normas fundamentais, fontes e aplicação da lei |
| 02 | Jurisdição, ação e pressupostos processuais |
| 03 | Competência, conexão, continência e conflitos |
| 04 | Partes, procuradores, despesas e gratuidade |
| 05 | Litisconsórcio e intervenção de terceiros |
| 06 | Juiz, auxiliares, MP, Advocacia e Defensoria |
| 07 | Atos processuais, negócios e prazos |
| 08 | Comunicação, citação, intimação e nulidades |
| 09 | Tutela provisória de urgência e evidência |
| 10 | Formação do processo e petição inicial |
| 11 | Defesa, revelia, saneamento e julgamento |
| 12 | Provas |
| 13 | Sentença, remessa, coisa julgada e liquidação |
| 14 | Cumprimento de sentença |
| 15 | Recursos e precedentes |
| 16 | Execução: títulos e obrigações |
| 17 | Execução por quantia e penhora |
| 18 | Procedimentos especiais |
| 19 | Ações coletivas e constitucionais |
| 20 | Processos nos tribunais, IAC, IRDR e rescisória |

## Verificações
- `npm run test:cpc-didatico`: testes de cobertura textual, integração e preservação das 40 leituras (20 resumos e 20 versões completas).
- `tests/cpc-apostila-reading-unit.mjs`: integridade dos hashes dos materiais originais, fontes legais recolhíveis, preservação de capítulos, progressão e fechamento do leitor.
- `tests/cpc-review-didactic-unit.mjs`: 20 módulos com explicações, exemplos, pontos-chave e fontes.
- Validar em prévia isolada **sem login**, conforme `docs/PREVIA_SEM_LOGIN_PADRAO.md`: abertura dos M01, M08, M09, M15 e M20, texto responsivo, alternância resumido/completo e capítulos.
- Conferir vigência antes de eventual publicação: CPC compilado, Lei 14.879/2024, Lei 15.479/2026 (vacatio legis) e Lei 15.484/2026.
- Esta atualização não altera banco de dados nem ambiente de produção. A publicação ocorrerá somente mediante autorização expressa.

## Limite do escopo
A estrutura anterior de consulta/revisão permanece disponível após a explicação didática, como material complementar, para preservar integralidade e capítulos. A remoção integral desse material antigo exigiria migração explícita de âncoras e testes de progresso; não se fez essa migração.
