# Banco de questões — como acrescentar

Cada módulo tem um arquivo: `content/questoes/<disciplina>/mNN.js` (disciplinas: `adm`, `cpc`, `pt`, `penal`, `cpp`, `cf`, `civil`, `rlm`, `info`; Informática tem os 13 módulos com 10 questões cada).

## Acrescentar questões a um módulo existente
1. Abra o arquivo do módulo e inclua novos objetos no fim da lista, com `id` seguindo a numeração (`adm-m03-autoral-11`, `-12`, …).
2. Rode `npm run questoes:check`. Ele confere o formato e as regras abaixo e diz exatamente o que corrigir.
3. Rode `npm test` e faça o commit. O teste do projeto também roda essa conferência.

## Módulo novo
Crie `content/questoes/<disciplina>/mNN.js` copiando o formato de outro módulo e rode `npm run questoes:index` (atualiza `content/questoes/index.js`, que é gerado; não edite à mão).

## Formato de cada questão
```js
{ id: 'adm-m03-autoral-11',
  origem: 'autoral-ia',
  q: 'Enunciado…',
  options: ['A…', 'B…', 'C…', 'D…', 'E…'],   // 5 alternativas diferentes
  answer: 2,                        // índice da correta: 0=A … 4=E
  explanation: 'Comentário: por que a certa está certa e onde está o erro das principais erradas.',
  lawRef: 'Lei 9.784/1999 (Lei do Processo Administrativo Federal), art. 54' }
```

## Regras (a conferência barra o que descumprir)
- 5 alternativas diferentes, gabarito de 0 a 4, comentário completo (mín. 150 caracteres; 100 em Português e Raciocínio Lógico).
- Cada letra A–E correta em 10% a 30% das questões do módulo; a certa só pode ser a mais longa em até 30%.
- Toda lei citada vem com o nome (`Lei 9.784/1999 (Lei do Processo Administrativo Federal)`). Todo artigo citado no comentário vem com o que ele diz.
- Questão **autoral** nunca recebe banca, ano, órgão, cargo ou prova. Este banco não tem questões de banca real.

## Como o aluno vê
- Menu **Questões** (atalho do topo e menu "Mais" no celular): disciplina → módulo → questões do módulo (quantas houver).
- Em cada módulo, o cartão **Questões do módulo** (depois da Lei em Dia) abre as mesmas questões já no módulo.
- Títulos dos módulos: `content/questoes/titulos.js`. O progresso fica no aparelho do aluno.


## Entrega no servidor (desde 13/11/2026)
Os arquivos `content/questoes/<disciplina>/mNN.js` agora são lidos **só pelo servidor** (`lib/questoes-handler.js`):
o navegador recebe os enunciados sem gabarito e a correção só depois que o aluno responde. O plano Gratuito tem
limite diário (veja `docs/QUESTOES_LIMITE_DIARIO_20261113.md`). O formato dos arquivos não mudou: continue
acrescentando questões como antes e rode `npm run questoes:check` e `npm run questoes:index`.
