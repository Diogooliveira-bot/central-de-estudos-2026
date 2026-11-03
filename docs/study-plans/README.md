# Base Completa — contrato de importação dos planos do Léo

**Versão 1.0.0. Homologação apenas. Não publicar em produção sem autorização.**

## Arquivo entregue ao aluno

O Léo envia pelo WhatsApp um arquivo .zip contendo, **somente na raiz**:

- `plano.pdf` — PDF visual com a logomarca oficial e as seis seções do modelo aprovado em 03/11/2026.
- `plano.json` — cronograma estruturado seguindo [schema-v1.0.0.json](schema-v1.0.0.json).

O Léo não precisa se autenticar ou comunicar-se diretamente com a Central. O aluno importa o ZIP manualmente.

## Campos obrigatórios

- `schema_version` = `"1.0.0"`.
- `documento.periodo_inicio` e `documento.periodo_fim` (AAAA-MM-DD).
- `aluno.nome` e `aluno.objetivo`.
- `cronograma`: de 1 a 52 semanas; cada uma com `inicio`, `fim` e `atividades`.
- Cada atividade: `disciplina`, `atividade`, `duracao_minutos` (1 a 480) e `dia` ou `data`.
- Opcionais: `horario_inicio` (HH:mm), `modulo`, `modulo_uid` (UID real do catálogo), `cargo`, `banca`, `perfil`, `metas`, `estrategia` e `orientacoes_leo`.
- Atividades devem estar dentro das datas da semana, que por sua vez devem estar dentro do intervalo geral. O período máximo é de 370 dias.

## Exemplo mínimo

```json
{
  "schema_version": "1.0.0",
  "plano_id": "leo-tjce-ficticio-0001",
  "documento": {
    "versao_modelo": "1.0",
    "titulo": "Plano de Estudos TJCE",
    "periodo_inicio": "2026-11-09",
    "periodo_fim": "2026-11-15"
  },
  "aluno": {"nome": "Estudante Fictícia", "objetivo": "TJCE", "cargo": "Técnico Judiciário", "banca": "FGV"},
  "cronograma": [
    {
      "numero_semana": 1,
      "inicio": "2026-11-09", "fim": "2026-11-15",
      "atividades": [
        {
          "dia": "segunda",
          "horario_inicio": "07:30",
          "disciplina": "Direito Constitucional",
          "modulo": "CONSTITUIÇÃO, NORMAS E PRINCÍPIOS FUNDAMENTAIS",
          "modulo_uid": "cf-m01-analista",
          "atividade": "Teoria completa e 10 questões",
          "duracao_minutos": 60
        }
      ]
    }
  ]
}
```

ZIP com Python, após gerar o PDF no modelo oficial:

```python
from zipfile import ZipFile, ZIP_DEFLATED
with ZipFile("plano-para-aluno.zip", "w", compression=ZIP_DEFLATED) as z:
    z.write("plano-produzido.pdf", arcname="plano.pdf")
    z.write("dados-estudante.json", arcname="plano.json")
```

## Segurança e limites

- ZIP até 3.000.000 bytes; PDF até 2.600.000 bytes; JSON até 250.000 bytes; máximo 800 atividades.
- Até 20 planos por conta. Retenção por até 24 meses (exclusão pelo aluno ou exclusão da conta).
- Somente Deflate/Store, ZIP não criptografado, sem ZIP64, diretórios, symlinks, entradas sobrepostas, caminhos ou extras.
- CRC32 obrigatório, PDF com assinatura e EOF; rejeitar gatilhos de JavaScript ou execução.
- Armazenamento privado do PDF em Neon BYTEA; endpoint PDF autenticado, `Content-Security-Policy: sandbox` e sem URL pública.
- Toda leitura/mutação filtra por `user_id` autenticado. Nunca aceitar dono vindo do JSON. FKs compostas impedem atribuição de progresso a plano de outra conta.
- Dados de plano e progresso ficam em tabelas próprias; nenhum progresso de módulo, cronograma de seis meses ou sincronização antiga é modificado.

## Vinculação confiável

Os 126 módulos usados pela importação foram extraídos do catálogo real do cronograma da Central. Vínculo automático somente com ID exato pertencente à disciplina ou título normalizado exato e único. Disciplinas desconhecidas e módulos ambíguos exigem confirmação do aluno. Correções de vínculo não alteram o JSON original.

## Atualização e histórico

Reimportar o mesmo ZIP é idempotente, preservando marcações; um ZIP diferente cria novo registro sem eliminar o anterior. Alterar plano ativo não altera progresso das disciplinas. Excluir um plano elimina apenas o PDF, JSON e marcações associados a ele.

## Rotas

- GET `/api/study-plans`: lista e plano ativo.
- GET `?action=catalog`: catálogo permitido.
- POST `?action=preview`: prévia validada sem gravar.
- POST `?action=import`: grava e opcionalmente ativa.
- GET `?id=UUID`: plano e progresso.
- GET `?action=pdf&id=UUID`, opcional `download=1`: PDF privado.
- PATCH `?action=activate&id=UUID`, `?action=toggle&id=UUID`, `?action=confirm&id=UUID`.
- DELETE `?id=UUID`.

## Prévia e homologação

Branch GitHub: `feature/planos-leo-importacao-20261103`. Banco Neon separado de produção, Vercel Preview com quatro variáveis de isolamento exclusivas desta branch: `DATABASE_URL`, `BC_PREVIEW_NEON_GUARD=YES`, `BC_PREVIEW_NEON_EXPECTED_HOST` e `BC_STUDY_PLANS_PREVIEW_ISOLATED=YES`. A API retorna 503 sem o isolamento. O modo convidado da Preview não escreve nem consulta dados: testes de API exigem contas fictícias no banco TEST.

Antes do lançamento verificar ZIP válido/inválido, upload real, autenticação entre contas, persistência, reimportação, progresso intacto, PDF e navegador. Somente o proprietário pode autorizar merge e Production.
