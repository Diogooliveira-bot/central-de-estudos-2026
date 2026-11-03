# Base Completa — PDF inteligente único (importação preferencial)

**Versão:** PDF-XMP v1 + JSON Schema v1.0.0. **Disponibilidade:** somente Preview, sem merge na produção.

## Experiência do aluno

O aluno recebe pelo WhatsApp **um único PDF**. Na Central, abre **Meus Planos de Estudo**, seleciona esse PDF, verifica a prévia e confirma. O cronograma aparece no calendário; pode marcar tarefas e abrir o PDF original.

Não precisa extrair ZIP, enviar JSON separado, instalar outro app, nem permitir que o Léo acesse sua conta.

## Como gerar o PDF no Léo

O Léo continuará produzindo *internamente*:
1. PDF oficial Base Completa, com visual e logomarca personalizada.
2. JSON estruturado v1.0.0, validado pelo [schema-v1.0.0.json](schema-v1.0.0.json).

O Léo **combina os dois em um PDF inteligente**. O aluno recebe somente o resultado. A Central não usa OCR, análise das páginas ou inteligência artificial para inferir atividades.

Exemplo de geração:

    pip install pymupdf
    python scripts/study-plan-embed-xmp.py --pdf plano-oficial.pdf --json plano.json --out Plano-Inteligente-Base-Completa.pdf

Enviar pelo WhatsApp **somente** o PDF de saída.

### Metadados internos

O gerador acrescenta um objeto XMP com um elemento XML:

    <bc:studyPlan version="1.0.0" sha256="HASH_SHA256">JSON_UTF8_EM_BASE64</bc:studyPlan>

O namespace é https://basecompleta.com.br/ns/study-plan/1.0.0. O gerador oficial escreve o elemento em XML não compactado e verifica o resultado. O importador exige exatamente um elemento dessa versão; verifica base64, tamanho, SHA-256 do JSON e schema.

O PDF visual permanece normal, sem alterar as páginas impressas.

### Limites e segurança

- PDF até 2.600.000 bytes, JSON embutido até 250.000 bytes e até 800 atividades.
- PDFs convencionais sem metadados **não geram calendário com segurança**. A Central orienta o aluno a pedir ao Léo uma versão inteligente. Não há OCR nem inferência.
- PDFs com ações ativas comuns são rejeitados; o arquivo não é executado no servidor. Autenticação e visualização usam endpoint privado e sandbox.
- Dados persistem isolados por conta; reimportações e marcações não alteram progresso existente da Central.
- ZIP antigo segue aceito como opção de compatibilidade, não como fluxo preferencial.
- SHA-256 garante integridade do JSON incorporado, **não prova** que o conteúdo visível do PDF corresponde aos dados. Por isso, a prévia exige confirmação do aluno.
- Na homologação, usar apenas dados e contas fictícios.

## Testes e publicação

- Executar testes PDF, ZIP e interface em CI: tests/study-plan-pdf-unit.mjs, tests/study-plan-import-unit.mjs, tests/study-plan-ui-unit.mjs.
- Testar login, upload e acesso entre duas contas fictícias em Preview antes de liberar alunos.
- PR #218 permanece em rascunho; não efetuar merge ou deploy em Production sem aprovação.
