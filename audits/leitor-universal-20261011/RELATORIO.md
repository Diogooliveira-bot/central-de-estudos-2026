# Relatório técnico — Leitor Universal da Base Completa
**Data:** 11/10/2026  
**Branch isolada:** `feat/leitor-universal-base-completa-20261011`  
**Status:** prévia implantada, **produção não alterada**.

## Objetivo e limites da intervenção
Padronizar exclusivamente a apresentação dos materiais em apostilas digitais, conservando fontes jurídicas e mecanismos já existentes. Foi adotada uma camada universal de CSS e JavaScript, em vez de substituir os sistemas de leitura de cada disciplina ou migrar registros de alunos. A transformação de texto pré-formatado é uma **projeção visual**: o conteúdo original permanece no DOM, sem gravação/revisão da redação jurídica.

Esta é uma **auditoria de integridade técnica e exibição**, não uma nova auditoria de atualização legislativa, jurisprudencial ou comparação integral com PDFs externos.

## Inventário individual conferido
O arquivo [inventario.csv](./inventario.csv) apresenta as 152 entradas individualizadas, com disciplina, módulo, extensão das fontes e forma de verificação.

| Disciplina | Módulos | Verificação |
|---|---:|---|
| Direito Penal | 17 (M01–M17) | Resumida + completa, incluindo as fontes integrais separadas `penal-full-theory-data-01..04.js` |
| Direito Processual Civil | 20 (M01–M20) | Resumida + completa, inclusive dados integrais do M08 |
| Direito Constitucional | 15 (M01–M15) | Resumida + completa |
| Direito Administrativo | 20 (M01–M20) | Resumida + completa: conteúdo integral recuperado pelo renderizador legado e **40 aberturas bem-sucedidas** no navegador de teste |
| Direito Civil | 15 (M01–M15) | Resumida + completa, extraídas dos pacotes nativos |
| Direito Processual Penal | 22 (M01–M22) | Resumida + completa, extraídas dos pacotes nativos |
| Direito do Trabalho | 18 (M01–M18) | Documentos HTML originais; não possuem necessariamente duas fontes independentes |
| Português | 24 (M01–M24) | Material integral e revisão no leitor próprio; mais **uma revisão cumulativa final** |

**Total: 151 módulos + 1 revisão cumulativa = 152 entradas.**  
As **109 duplas de teoria** das seis disciplinas jurídicas estruturadas foram verificadas: 89 diretamente a partir de dados estáticos e as 20 de Administrativo pelo carregamento real da interface com autenticação simulada. Os 18 HTML de Trabalho e as 25 entradas de Português seguem formatos próprios; não foram convertidos artificialmente em arquivos “resumido/completo” que não existiam.

## Correções realizadas
1. Adicionados `ui/universal-reader-v1.js` e `ui/universal-reader-v1.css`, integrados em `index.html` (fonte da aplicação autenticada).
2. Padronizados corpo de leitura, títulos H1–H4, subtítulos, parágrafos, listas, tabelas, figuras, citações, dispositivos e avisos jurídicos, quebra de linha e foco de teclado.
3. Estendida a apresentação para o leitor independente da Teoria Completa de Penal, além dos leitores nativos e material português dentro da Central.
4. Adicionados os recursos universais aos 18 HTML de Direito do Trabalho.
5. Nos módulos **Trabalho M03 e M09**, os documentos originais não traziam `<main>`; a nova camada monta uma região de leitura sem eliminar ou reescrever os nós de texto.
6. No **Trabalho M17**, o material era exibido em um extenso `<pre>` semelhante a bloco de notas: agora são projetados títulos, parágrafos, listas e dispositivos jurídicos a partir do texto, mantendo o `<pre>` original intacto e oculto durante a leitura.
7. Incluídos CSS/JS universais no manifesto de arquivos offline existentes, **sem substituir a estratégia de autenticação/cache do PWA**.

## Evidências e testes
- `npm test`: **17/17 testes aprovados**, incluindo autenticação, integridade de publicação, questões de fixação, estabilidade do clique, exportação e manifesto offline.
- `node tests/universal-reader-browser.mjs`: **57/57 cenários aprovados** — 18 módulos Trabalho × celular (390 px), tablet (768 px) e computador (1366 px), além do leitor de referência nos três tamanhos. Verificados ausência de overflow, estilos ativos e carregamento dos recursos universais.
- Leitor de referência: original textual preservado, projeção semântica visível, índice abrindo, questão clicável e anotação/localStorage inalterados.
- `node tests/universal-reader-central-browser.mjs`: bootstrap real da Central carregou o Leitor Universal nas **três larguras**, sem faltar CSS/JS. A autenticação usada foi simulada, nunca a conta de um aluno real.
- Direito Administrativo: **20 renderizações legadas completas** e **40/40 aberturas de teoria** (resumida e completa) aprovadas.
- `node tests/universal-reader-inventory.mjs`: auditoria reprodutível de **152 entradas**. O CPC M08 e os pacotes compactados de Civil e CPP foram processados.
- Comparação GitHub `main...branch`: nenhum arquivo dos diretórios de **fontes jurídicas**, bancos de perguntas, arquivos de imagens, dados de progresso ou sincronização foi modificado. As alterações anteriores estão restritas a folhas de estilo, camada JS, inserção de recursos HTML, manifesto offline, testes e este relatório.

## Preservação
**Sem migração nem exclusão** de anotações, marcações, questões de fixação, imagens, infográficos ou progresso. Os nomes de armazenamento existentes não foram renomeados. O conteúdo jurídico original não foi corrigido editorialmente para obter a padronização visual. **Preservar arquivos e contratos não equivale a provar a ausência de qualquer problema preexistente em cada conta ou imagem**.

## Pendências para aceite antes de qualquer produção
1. **Homologação com uma conta real autorizada**, sem editar dados do aluno, verificando sincronização remota, anotações antigas, marcações e retomada do progresso; testes realizados usaram autenticação simulada.
2. **Conferência visual manual** de figuras/infográficos complexos e de todos os caminhos de navegação em dispositivos físicos; os testes de navegador cobrem os tamanhos citados, mas não substituem inspeção presencial em iOS/Android/tablet.
3. **Teste offline/PWA real** após instalação e pré-carregamento autenticado, inclusive reconexão; os novos recursos constam no manifesto, mas não foi atestado funcionamento em modo avião.
4. Comparação do conteúdo jurídico com os **arquivos de origem externos** e revisão legal substantiva, se exigida para uma nova certificação; não faz parte desta padronização e não foi presumida.
5. Aprovação expressa da prévia antes de qualquer merge ou implantação de produção.

## Reproduzir
```bash
npm ci
npm test
AUDIT_COMPACT=1 node tests/universal-reader-inventory.mjs
node tests/universal-reader-browser.mjs
node tests/universal-reader-central-browser.mjs
```
Os testes Playwright requerem Chromium e suas dependências de sistema.

**Controle de publicação:** branch independente; nenhuma alteração aplicada a `main` ou promovida para produção.
