# Base Completa — questões de IA (plano gratuito) em 148 módulos

Data: 12/11/2026. Branch de trabalho `ccr-9240fa4f-8z61nx`, destinada à branch da PR #254 (rascunho). **Nada foi publicado em produção.**

## O que existe
Cada um dos 148 módulos tem **10 questões objetivas autorais** (feitas por IA, não são de banca), em arquivos próprios `content/<matéria>/mNN-authorial10-v1.js`, carregados somente quando o aluno abre o questionário (`ui/central-authorial-bank-v1.js`). As 10 questões de bancas reais (premium) continuam reservadas, sem nenhuma cadastrada.

| Matéria | Módulos |
|---|---:|
| Direito Administrativo | 20 |
| Direito Processual Civil | 20 |
| Português | 24 |
| Direito Penal | 17 |
| Direito Processual Penal | 22 |
| Direito Constitucional | 15 |
| Direito Civil | 15 |
| Raciocínio Lógico-Matemático | 15 |

## Padrão aplicado (conferido por teste e por verificador)
- 5 alternativas; cada letra A–E é a correta exatamente 2 vezes por módulo; a alternativa certa é a mais longa em no máximo 3 de 10.
- Alternativas erradas plausíveis; casos concretos e exceções; comentários que explicam também as erradas.
- Toda lei citada traz o nome; todo artigo citado no comentário vem com o que diz.
- Nenhuma questão é atribuída a banca, órgão ou prova.
- Pontos legislativos ou jurisprudenciais de 2025/2026 que não puderam ser confirmados foram deixados de fora das questões.

## Integração
- ADM, CPC, Português, Penal, Processo Penal: questionário compartilhado (`CentralAuthorialQuiz`).
- Constitucional e Civil: mesma tela de questões de cada matéria, com as questões convertidas ao formato dela; no Civil as respostas antigas do módulo são zeradas na primeira abertura.
- Raciocínio Lógico M02–M15: substituem as questões da aula; respostas antigas zeradas na primeira abertura.

## Validação
- `npm test`: 317 de 318. A única falha, "bootstrap Civil preserva os 66 destinos…", já falhava na branch da #254 antes destas mudanças.
- `tests/internal-questions-browser.mjs` está desatualizado em relação à #254 (procura o botão "Resolver 5 questões", que a #254 trocou por "Resolver 10 questões autorais"); não foi alterado por este trabalho.
- Navegador (Chromium): ADM M01/M02/M04, Penal M01/M04/M09 e Civil M01–M04 abrem as questões novas sem erro; Constitucional e Raciocínio Lógico cobertos por teste automático dos ganchos.

## Pendências
- Revisão humana (jurídica e gramatical) das 1.480 questões; os documentos de revisão por matéria acompanham este trabalho.
- Revisar o item "ouro" da apostila de Constitucional M13 (cita arts. 180–181; o tema está no art. 153, § 5º).
- As 10 questões reais de banca por módulo (premium) continuam sem cadastro.
- Verificar em Preview isolada, em celular, antes de qualquer publicação.
