# Como atualizar e revisar a Central sem quebrar nada

Guia do proprietário, em linguagem simples. Resumo: **dá para atualizar com segurança** se o caminho abaixo for seguido.
Quase todo problema vem de 3 coisas: um erro de digitação num arquivo, esquecer de trocar a "versão" do arquivo, ou
mexer no que o aluno já salvou. Existem verificações automáticas para as duas primeiras.

## O caminho seguro (5 passos)
1. **Trabalhar sempre em uma branch**, nunca direto na `main`. (O agente já faz isso.)
2. **Depois de alterar um arquivo, trocar a versão dele:** `npm run nova-versao -- caminho/do/arquivo.js`
   (ele troca a versão em todos os lugares de uma vez: abertura, index, pacote offline e testes).
3. **Rodar a verificação:** `npm run verificar -- --base origin/main` → deve terminar com "pode seguir".
4. **Rodar os testes:** `npm test` e ver a prévia (link de teste) no celular.
5. **Só publicar com o seu "pode publicar".** Se algo der errado depois, voltar é simples (reverter o commit).

> O agente roda os passos 2 a 4 sozinho e te diz só o resultado. O GitHub também roda a verificação em todo PR.

## O que pode quebrar (e o que protege)
| Risco | O que acontece | Proteção |
|---|---|---|
| Erro de sintaxe (vírgula, aspas, chave) num arquivo `.js` | Uma disciplina ou a Central inteira não abre | `npm run verificar` confere todos os arquivos; testes de navegador |
| Esqueceu de trocar a versão (`?v=`) | Parte dos alunos continua vendo o conteúdo antigo | `npm run nova-versao` + `verificar --base` avisa "mudou, mas a versão não" |
| Versões diferentes do mesmo arquivo (abertura × index × offline) | Alunos veem mistura de versões | `npm run verificar` e `npm run nova-versao -- --alinhar` |
| Texto estranho colado numa página (ex.: "truncated output") | Aparece texto no topo da Central | `npm run verificar` e teste `public-html-integrity` |
| Chave/senha escrita num arquivo público | Vazamento | `npm run verificar` procura padrões de chave |
| Arquivo novo de conteúdo **Premium** sem regra de proteção | Poderia ficar aberto a todos | Regras em `lib/protected-content.js` + testes de plano gratuito |

## Cuidados que nenhum teste substitui
- **Revisar um módulo que já foi editado no Editor Premium:** o texto salvo no editor **vence** o do repositório. Se você
  corrigir o módulo no código e alguém já editou esse módulo no editor, o aluno continua vendo a versão do editor até alguém
  clicar em "Restaurar". Antes de revisar um módulo no código, confira se ele tem edição salva no editor.
- **Mudar o título ou a identidade de um módulo** pode "soltar" a edição salva no editor dele (ela deixa de aparecer).
- **Não renomear ids de módulos** (ex.: `cf-m01`): o progresso do aluno é guardado por esse id; mudar apaga o avanço dele.
- **Conteúdo jurídico:** o código não confere se a lei está certa. A revisão jurídica continua sendo humana.
- **Muito texto de uma vez** (vários módulos juntos) dificulta achar o erro. Prefira lotes pequenos.

## Se der problema depois de publicar
Avise o agente: ele reverte o commit (o app volta ao estado anterior em poucos minutos) e investiga com calma.

## Comandos (referência)
- `npm run verificar` — confere o repositório inteiro (9 s). Com `-- --base origin/main` também confere versões trocadas.
- `npm run nova-versao -- <arquivo>` — troca a versão do arquivo em todos os lugares. `-- --ver <arquivo>` só mostra.
- `npm run nova-versao -- --alinhar` — iguala arquivos que estão com versões diferentes.
- `npm test` — testes automáticos.
