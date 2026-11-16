# Importação do PDF do Léo na Agenda

O aluno recebe o **Plano de Estudos** em PDF do Léo (WhatsApp) e adiciona o arquivo na Agenda. As atividades
do cronograma viram tarefas, dia a dia, e continuam funcionando como qualquer tarefa da Agenda (marcar como feita,
"Hoje na agenda", semana, sincronização entre aparelhos).

## Onde fica
- Cartão **"Plano do Léo em PDF"** na Agenda (logo abaixo da semana): `ui/agenda-pdf-leo-v1.js` e `.css`.
- Leitura do PDF: **pdf.js** (Apache-2.0), em `vendor/pdfjs/` (build *legacy*, versão em `VERSION.txt`).
  Só é baixado quando a pessoa escolhe um arquivo; **não** entra no pacote offline.

## Privacidade e segurança
- O PDF é lido **no aparelho**; nada é enviado ao servidor.
- O nome do aluno que aparece no PDF **não é lido nem guardado**.
- O texto do PDF só entra na tela como texto puro (sem `innerHTML`).
- Limites: 15 MB, 60 páginas, 900 atividades. PDF com senha ou que não seja o plano do Léo mostra mensagem clara.
- O armazenamento usa o `localStorage` isolado por usuário da Central (identificador solto, não `window.localStorage`).

## Como o cronograma é lido
Linhas e colunas são reconstruídas a partir das posições do texto (pdf.js). Reconhece:
`Semana NN` + período · `Segunda-feira, 16/11 … 3h00 · 2 atividades` · linhas com disciplina, título e `90 min`
· instrução na linha de baixo (ou depois de ` — ` na mesma linha) · etiqueta `Premium`. O ano de cada dia vem do
período da semana (cobre a virada de dezembro para janeiro). Conferências automáticas geram **avisos** na prévia
quando a quantidade/duração de um dia não bate com o cabeçalho do próprio PDF.

## Formato gravado (`central-v6:agenda:AAAA-MM-DD`)
```json
{ "id": "leo-2026-11-16-<hash>", "time": "", "discipline": "pt", "task": "M01 Título — instrução (90 min)",
  "done": false, "source": "leo-pdf", "minutes": 90 }
```
`discipline` usa os ids da Agenda (`pt`, `rlm`, `cf`, `adm`, `civil`, `cpc`, `penal`, `cpp`); outra disciplina fica com o nome do PDF.
O resumo do plano ativo fica em `central-v6:leo-plan:v1`. Tudo isso sincroniza com a conta como o resto da Agenda.

## Atualizar com um PDF novo (sem duplicar)
O `id` é estável: data + disciplina + código do módulo (`M01`), ou o título quando não há código. Ao importar de novo:
- mesma atividade → **mantida** (e o que foi marcado como feito continua feito);
- texto mudou → **atualizada** (feito preservado);
- nova → **adicionada**;
- saiu do plano e não estava feita → **removida** (só dentro do período do novo PDF); se já estava feita, vira histórico;
- tarefas manuais e de outros geradores (`source` diferente) **nunca** são tocadas.
"Remover do plano" apaga só as tarefas com `source: "leo-pdf"`, com confirmação.

## Testes
- `tests/agenda-pdf-leo-unit.mjs` (entra no `npm test`): parser, mesclagem, registro e segurança.
- `tests/agenda-pdf-leo-browser.mjs` (`npm run test:agenda-leo-browser`; workflow `agenda-pdf-leo.yml`): gera um PDF **fictício**
  com o mesmo desenho, escolhe o arquivo na Agenda, confere prévia, gravação, re-importação e remoção.
  Para conferir um PDF real só localmente: `LEO_REAL_PDF=/caminho/plano.pdf node tests/agenda-pdf-leo-browser.mjs` (não grava nada).
  Nunca versionar PDF real de aluno.

## Atualizar o pdf.js
`npm pack pdfjs-dist@<versão>`, copiar `legacy/build/pdf.min.mjs` e `pdf.worker.min.mjs` para `vendor/pdfjs/`, ajustar
`VERSION.txt` e a constante `VERSION` em `ui/agenda-pdf-leo-v1.js` (o teste confere as duas).

## Ideia futura
Receber o PDF direto do "Compartilhar" do WhatsApp (Web Share Target do PWA, só Android) exigiria alterar o `manifest`
e o service worker; ficou fora para não mexer na base de cache.
