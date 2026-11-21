# Auditoria pré-lançamento — Base Completa

**Data:** 21/11/2026  
**Base examinada:** main em cc40f7e92b6a7e48d0cfcd74774a9855781880c6  
**Branch isolada:** audit/prelaunch-2026-11-21  
**Produção:** não alterada; nenhuma migração ou escrita em dados reais.

## 1. Saúde geral

**Classificação: Regular.** A suíte principal, os testes de segurança, o build e as verificações estáticas passam. Há, porém, uma verificação específica de imagens de Direito Administrativo que falha, erros recentes de autenticação sem causa classificável nos registros disponíveis e não foi possível completar o fluxo interativo de um aluno por falta de acesso de teste utilizável.

Não foi confirmado incidente crítico de exposição de dados, perda de progresso ou indisponibilidade atual.

## 2. Problemas encontrados

| Gravidade | Evidência | Impacto e situação |
|---|---|---|
| P2 | O Vercel selecionava Node 26.x apesar de o projeto estar configurado em 24.x, por causa de engines.node >=20. | Pode introduzir mudanças de runtime sem validação. Corrigido nesta branch para >=22 <25; a prévia confirmou Node 24.x. |
| P2 | npm run test:adm-autoral falha em tests/adm-apostila-reading-unit.mjs: artes/adm-m02/png/ADM-M02-C01.png não tem a assinatura PNG esperada (59aae78a… em vez de 89504e470d0a1a0a). A mesma falha ocorre no GitHub Actions. | Bloqueia o check dedicado de apostilas autorais de Administrativo. O teste aponta a imagem WebP de integração separada como válida; não foi constatado que o arquivo PNG inválido seja servido ao aluno. Não alterei artes nem conteúdo. |
| P2 | Vercel agrupou 12 erros auth error em /api/auth, afetando 3 usuários entre 17 e 20/11. | O texto do evento não identifica a causa. Não houve log de erro nos 30 minutos consultados; o plano retém logs detalhados por apenas 1 hora. Não é possível concluir se foram falhas de banco, requisições inválidas ou outro motivo. |
| P2 histórico | Duas tentativas de deploy de produção associadas ao commit 83e88a7 falharam com exceeded_serverless_functions_per_deployment (limite Hobby de 12). | A pasta api/ no estado atual tem 12 funções e o limite está coberto pelo teste function-count-unit. O evento foi de um commit anterior; nenhuma função foi adicionada nesta auditoria. |
| P3 | O build ainda avisa que middleware.js usa o runtime edge depreciado. | Não há falha de execução associada. Migração de runtime fica pendente de análise compatível com os testes de autenticação; não foi feita nesta auditoria. |

## 3. Correções realizadas

- Alterado somente engines.node em package.json e package-lock.json, de >=20 para >=22 <25. Node 22 continua atendendo ao CI e Node 24 respeita a configuração da Vercel.
- Os testes foram executados antes e depois dessa alteração. Não houve mudança em identidade visual, mascote, disciplinas, módulos, conteúdo, APIs, permissões, contratos comerciais ou banco.

## 4. Testes e otimizações

### Testes concluídos

- npm test: 505 aprovados, 0 falhas, 1 ignorado.
- npm run test:security: 71 aprovados.
- npm run security:static: 2.453 arquivos versionados verificados; nenhum segredo de alto risco detectado.
- npm audit --audit-level=high: zero vulnerabilidades reportadas.
- npm run build:vercel-output: concluído; os testes confirmam que arquivos protegidos ficam fora da saída estática.
- npm run verificar: 1.284 arquivos JavaScript com sintaxe válida; 439 referências locais existentes; pacote offline consistente; nenhuma chave/senha detectada em arquivos públicos.
- GitHub Actions no PR: suíte completa, segurança, CodeQL, verificação da Central, recuperação de cache PWA, lançamento, Penal V3, editor e CPC passaram. O check específico Administrativo — apostilas autorais M01–M20 falhou pela assinatura do PNG descrita acima; 9 dos 10 casos desse check passaram.
- Prévia Vercel READY; log confirmou mudança de Node 26.x para 24.x.

### Desempenho

Não foi aplicada otimização de carregamento: não foi identificado um gargalo localizado com medição comparável antes/depois. Os testes existentes de carregamento progressivo de disciplinas e escala responsiva passaram, mas isso não representa ganho de velocidade medido em dispositivos reais. A alteração de Node melhora previsibilidade de execução e build, não foi apresentada como ganho de velocidade.

## 5. Pendências e limites

- Recuperar ou validar, a partir da fonte original, o PNG de M02 que falha no teste. Não regenerar nem substituir a arte sem conferir que ela preserva exatamente a imagem aprovada.
- Acompanhar /api/auth com registros de erro que permitam diferenciar falha interna de entrada inválida sem registrar senha, token ou conteúdo pessoal. Os logs retidos não permitem diagnóstico retroativo.
- Revisar a migração do middleware edge em uma alteração própria, com regressão explícita de autenticação e acesso.
- A variável BC_PREVIEW_GUEST_TOKEN apareceu como criptografada e sem valor descriptografado na integração disponível. Sem essa credencial e sem conta de homologação autorizada, não foi possível executar cadastro, confirmação de e-mail, login, plano, sincronização ou painel administrativo de ponta a ponta. Nenhuma conta real foi usada.
- Não houve acesso ao banco Neon durante a auditoria; esquema e dados não foram alterados.

## 6. Preparação para lançamento

Antes da abertura comercial, corrigir o PNG de origem e obter um resultado verde no check específico de Administrativo. Depois, executar o fluxo completo com conta de homologação e e-mail de teste, inclusive sincronização de progresso e funções administrativas. Confirmar os erros de /api/auth com observabilidade suficiente e decidir, em revisão separada, a migração do middleware. As mudanças mais recentes em main devem continuar sendo lançadas somente no ciclo de release autorizado.

## 7. Publicação

- PR #389 aberto como rascunho para revisão: https://github.com/Diogooliveira-bot/central-de-estudos-2026/pull/389
- Prévia Vercel da branch: https://central-de-estudos-3hf6tfe93-estudotd.vercel.app/ (requer acesso de demonstração ou login; o link privado de visitante não pôde ser montado sem a variável descriptografada).
- Sem merge ou publicação em produção.
