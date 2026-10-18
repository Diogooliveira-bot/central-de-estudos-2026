# Validação

Base final comparada: `d75b6543b7b096917e7f57322189674ee980e7c8`.

| Verificação | Resultado |
|---|---|
| `npm test`, incluindo os oito testes específicos desta revisão | **87 aprovados / 88 testes; 1 falha preexistente** |
| `node --test tests/external-question-center-unit.mjs` em checkout limpo da base final | **8 aprovados / 9 testes; a mesma falha** |
| Testes específicos de Penal/CPP, incluídos na execução geral | **8 aprovados / 8** |
| `node --check` em todos os JS/MJS alterados | Aprovado |
| `git diff --check origin/main` | Aprovado |

Falha reproduzida sem as alterações desta revisão: **“catálogo organiza QC e TEC em colunas próprias por módulo”**, em `tests/external-question-center-unit.mjs`. O teste encontra zero painéis onde espera conteúdo de catálogo. Não foram alterados produto ou expectativas desse teste para encobrir a falha.

A execução anterior sobre `015a485` reproduzia quatro falhas nessa suíte. Durante o trabalho, a base recebeu `d3b1e5d` (“Corrige integração dos filtros publicados”); a revisão foi reaplicada sobre ela, sem conflito. A nova execução acima substitui o resultado anterior: três das falhas foram resolvidas pela atualização da própria base.

Dois testes existentes de cache dependiam de identificadores antigos fixados no código do teste. Eles passaram a ler o identificador do manifesto e mantiveram a verificação de consistência entre os ativos. Não foi alterada a expectativa dos testes de catálogo.

Os testes jurídicos verificam a presença e a consistência das ressalvas introduzidas; não substituem leitura jurídica individual de todos os textos e gabaritos. O teste estrutural percorre 78 leituras e 585 questões internas. O teste ortográfico adicional verifica a restauração dos separadores de páginas e a grafia corrigida. Testes em DOM simulado verificaram exibição das correções e preservação de histórico/progresso previamente salvo. Não houve navegação autenticada em produção nem teste visual em Chromium, indisponível neste ambiente.
