# Base Completa — homologação técnica da Central

**29/10/2026 (Fortaleza). Classificação: TÉCNICA BLOQUEADA para publicação em Production.** Esta classificação trata apenas da etapa técnica. Cadastro público e vendas permanecem fora do escopo autorizado. Não houve merge da PR #187, alteração de oferta/webhook Hotmart, promoção de Preview, migração da `main` ou uso de conta real como teste.

## 1. Disciplinas e conteúdo

As contagens abaixo distinguem arquivo existente de abertura em navegador. Não há prova de publicação de cada módulo no deployment público atual. Uma correção visual transversal removeu botões de Anki ainda visíveis nas camadas nativas de Administrativo e Processo Penal; conteúdo de apostilas não foi reescrito.

| Disciplina | Módulos/temas existentes | Fonte e questões verificadas nesta passagem | Imagens/mapas e progresso | Abertura e publicação efetiva |
|---|---:|---|---|---|
| Constitucional | 15 módulos | 15 pares resumo/completo no inventário; contagens de questões nativas anteriores | 15 mapas presentes; progresso coberto por testes locais anteriores | Por módulo no deployment final: não homologado |
| Administrativo | 20 módulos | 20 resumos; CI abriu os 20 resumos e 20 teorias completas pelo runtime legado, com assert obrigatório | Sprite presente; testes de UI local; botão Anki aposentado removido | 40 leituras em Chromium local simulado; Preview autenticada não homologada |
| Civil | 15 módulos | 15 pares no pacote; 5+10 por conjunto em auditoria anterior | 15 imagens embutidas; persistência em teste local | Por módulo no deployment final: não homologado |
| Processo Civil | 20 módulos | 20 pares; **M18–M20 têm 5 questões de resumo e 10 de completo nos arquivos `cpc-study-m18/19/20-lite.js`** | M18–M20 usam mapas HTML em `tools/`, sem `<img>`, `<svg>` ou `<canvas>` nesses arquivos; não chamar esses arquivos de imagem bitmap. Progresso em runtime local | Abertura hospedada de M18–M20 e de todos os módulos: não homologada |
| Penal | 17 módulos | 17 resumos e 17 teorias no pacote legado; 5+10 em auditoria anterior | Não houve nova contagem de imagens; testes locais de layout passaram | Por módulo no deployment final: não homologado |
| Processo Penal | 22 módulos; 16 temas antigos não equivalem a módulos | Pacote descompactado contém **22 pares**, com 5 questões no resumo e 10 no completo de **cada módulo**, comprovadas pelos marcadores de conteúdo, além dos metadados | Sprite original `assets/cpp/infograficos.webp`, 22 recortes no índice; botão Anki aposentado removido. Progresso/anotações no runtime e teste local | Abertura hospedada autenticada dos 22: não homologada |
| Português | 24 módulos e revisão | 25 entradas integrais no pacote; não há 24 arquivos independentes de resumo certificados | 24 infográficos presentes; exercícios e persistência por módulo não auditados em navegador hospedado | Por módulo no deployment final: não homologado |
| RLM | 16 temas da home; leitor de 70 capítulos | Testes locais de expansão e estrutura passaram; não equiparar temas a 16 módulos de 5+10 | Imagens/questões por tema e progresso hospedado ainda não auditados | Por tema no deployment final: não homologado |

Informática continua em preparação. Direito do Trabalho e Processo do Trabalho permanecem fora do catálogo; o inventário ativo corrigido tem **134 entradas** (seis disciplinas jurídicas e 25 entradas de Português), sem fonte ausente. O script de inventário não mede RLM. Nenhum módulo foi criado ou proclamado publicado apenas por existir no repositório.

## 2. Execução e testes

| Evidência | Resultado | Limite |
|---|---|---|
| `npm test` após a correção visual | 178 testes: **177 aprovados, 1 ignorado, 0 falhas** | Código/local |
| `npm run test:premium-protection` | **27 aprovados, 0 falhas** | Proteção em código e artefato local; não aluno hospedado |
| `npm run test:lei-adm` | **25 aprovados, 0 falhas** | Coerência do acervo sob testes, não revisão jurídica independente |
| Testes focados ADM/CPP/disciplinas removidas | **13 aprovados, 0 falhas** | Renderização em ambiente de teste |
| GitHub Actions, workflow de integração do SHA `745b43d` | Jobs `focused-regression` e `commercial-browser` **success**; o segundo instalou Chromium e executou o leitor da Central em celular, tablet e computador, exigindo 40/40 aberturas ADM | Servidor local e API simulada; não E2E no deployment Vercel |
| Playwright neste executor | Binário Chromium indisponível; instalação pelo CDN retornou arquivo inválido/0 MiB | CI tem Chromium, mas não supre autenticação remota |

A Preview protegida do SHA anterior foi aberta no navegador e redirecionou ao login real da aplicação. Um link temporário Vercel de uma hora permitiu ultrapassar a proteção de deployment, **sem bypass do login do aluno**. Não havia credencial sintética utilizável no navegador seguro: uma conta temporária criada exclusivamente no Neon TEST foi desativada sem login. Portanto **visitante e os perfis Free, Premium e admin não passaram por E2E autenticado no SHA final**. Cadastro/Turnstile/Gmail/recuperação foram comprovados em checkpoint anterior da Preview, mas não repetidos aqui; o replay real, a 21ª questão, TEC/QC, sincronização e retorno Free permanecem sem prova hospedada nesta passagem. Não confundir os testes locais com esses fluxos.

O admin da `main` e do TEST está ativo, não bloqueado e tem hash no formato `scrypt`; `last_login` segue vazio. Isso descarta bloqueio vigente/formato incompatível, mas **não confirma a senha do proprietário** nem corrige o relato de login. Nenhuma senha foi lida, redefinida ou exposta.

## 3. Banco, restauração e rollback

- Neon Production: `main` = `br-blue-sunset-b7jcts9i`, ainda `primary/default`; endpoint produtivo preservado. TEST: `br-sweet-waterfall-b7ry8jlw`. Branch interna de segurança atual: `backup/pre-lancamento-20261029` = `br-icy-fog-b7n783qy`, cópia da `main` em 29/10.
- Snapshot manual `snap-red-lake-b7ytcuk2`, de 28/10, expira em **04/11/2026 23:59:59 UTC**. Uma nova captura fora recusada anteriormente por limite do plano; não apagamos o snapshot.
- **Restauração isolada executada** com `restore_snapshot(finalize:false)` em `test/restore-snapshot-isolado-20261029` (`br-jolly-sunset-b7512mfn`). A nova branch ficou `ready`, `restore_status=restored`, com compute próprio. Não foi chamada `finalize_branch_restore`; a `main` permaneceu principal e com compute protegido.
- Esquema: as três branches (`main`, backup de 29/10 e restauração de 28/10) contêm as mesmas **16 tabelas públicas**. Contagens exatas de todas as 16 foram comparadas. Em todas: 6 usuários, 5 assinaturas, 21 backups de usuário, 28 entitlements, 2 resets, 2 estados de sincronização e 2 resumos de progresso. Preferências: **1 no snapshot restaurado**, **3 no backup de 29/10 e na `main` atual**, diferença temporal esperada; não declarar identidade completa dos dados atuais ao snapshot antigo.
- **Backup externo recente não produzido**: o fluxo protegido de `pg_dump`/GPG/Drive depende de credenciais, chave pública, destino aprovado e ferramentas do executor que não estão disponíveis nesta sessão. A restauração do snapshot no mesmo projeto é prova de recuperação parcial, não cópia externa independente; o ensaio não reatribuiu endpoint e não testou a aplicação contra o banco restaurado.
- Rollback de app: preservar o deployment público atual `dpl_CRNXhAJdzN2pD9dGAjShtX3Z1SW1` e a Production Git `dpl_8nzB9PbftGVY2JFGzC3XzuGEuXCX`; só reatribuir um alias após confirmar seu alvo. Banco: não restaurar sobre `main` às cegas; conferir schema e compatibilidade, recuperar em branch isolada, comparar contagens e dados essenciais sob acesso seguro, só então planejar uma troca coordenada. Reverter um deployment não reverte gravações/migrações.

## 4. Publicação e cadastro

- PR [#187](https://github.com/Diogooliveira-bot/central-de-estudos-2026/pull/187) continua **draft**, sem merge. Correções nesta passagem: `1e3e562` (ADM sem botão Anki), `57a1a6e` (CPP sem botão Anki), `a109802` (asserção das 40 leituras), `745b43d` (gate CI para `ui/**` e `content/**` e teste do leitor em três viewports). O inventário corrigido e relatório comercial já estavam na PR.
- A Production Git da Central permanece em `main` SHA `53eb8b2`. Não houve publicação destas quatro correções no ambiente público. **Os seis workflows do SHA `745b43d` concluíram `success`, mas a Vercel não gerou deployment para esse SHA.** O alias de Preview ainda foi observado em `dpl_HHkevNNkM5itH8ccbG6iDQ7kMxRS`, SHA `1e3e562` (somente a primeira correção visual). A tentativa autorizada de criar Preview explicitamente a partir de `745b43d` retornou **HTTP 402 `api-deployments-free-per-day` (mais de 100 deployments no dia; `retryAfter=86400`)**. Não há CLI Vercel autenticada instalada neste executor. Não reutilizar o deployment antigo para declarar o SHA final homologado; aguardar a cota ou solução do limite pelo proprietário, sem mudar plano/cobrança automaticamente.
- Cadastro público permanece desativado no alias ecru; a Preview isolada tem Turnstile/cadastro de teste conforme checkpoint, sem mudar a guarda `v24-draft-2026-10-28`. A variável `BC_PUBLIC_APP_URL` para Production ainda não foi confirmada em listagem completa, e o código rejeita `central-de-estudos-ecru.vercel.app`; URL estável compatível e links transacionais não foram homologados. Domínio próprio não é requisito nesta etapa.
- Nenhuma oferta ou webhook Hotmart foi alterado. Os documentos jurídicos continuam minutas. Esses componentes comerciais não devem entrar por merge integral da PR apenas para levar conteúdo à Production.

## 5. Decisão técnica

**TÉCNICA BLOQUEADA.** A restauração isolada e os testes locais/CI avançaram, mas a cota da Vercel impede Preview no SHA final hoje; faltam E2E autenticado nele, publicação e conferência dos módulos, backup externo ou capacidade equivalente comprovada antes de mexer em dados produtivos, URL estável de cadastro e comprovação do acesso admin. A PR comercial não deve ser mesclada integralmente para publicar uma correção visual. Se os gates técnicos forem fechados, separar alterações editoriais/técnicas verificadas em branch própria baseada na `main`, reexecutar CI, testar compatibilidade e rollback, então publicar sem abrir cadastro nem checkout. A pendência Hotmart e aprovação jurídica continuam separadas da classificação técnica.
