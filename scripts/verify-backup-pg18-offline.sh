#!/usr/bin/env bash
# Executar SOMENTE no computador de confiança do proprietário.
# Recebe o arquivo .tar.gpg baixado do Drive com sua chave privada GPG LOCAL.
# Restaura em Docker PostgreSQL 18 SEM REDE. Nunca acessa Production.
set -Eeuo pipefail
set +x
umask 077
die(){ printf 'VERIFICACAO_FALHOU: %s\n' "$1" >&2; exit 1; }
[[ "$#" == 1 ]] || die 'Uso: bash scripts/verify-backup-pg18-offline.sh ARQUIVO.tar.gpg'
file="$1"
[[ -f "$file" && -s "$file" && "$file" == *.tar.gpg ]] || die 'Arquivo GPG não encontrado ou vazio.'
[[ -f "$file.sha256" ]] || die 'Arquivo .sha256 correspondente não encontrado.'
for tool in docker gpg sha256sum tar cmp mktemp python3; do
  command -v "$tool" >/dev/null || die "Ferramenta ausente: $tool"
done
dir="$(dirname "$file")"
name="$(basename "$file")"
(cd "$dir" && sha256sum --check --status "$name.sha256") || die 'Hash do arquivo cifrado não confere.'
tmp="$(mktemp -d)"
container="bc-offline-restore-$RANDOM-$$"
cleanup(){ docker rm -f "$container" >/dev/null 2>&1 || true; rm -rf -- "$tmp"; }
trap cleanup EXIT
gpg --batch --yes --output "$tmp/backup.tar" --decrypt "$file" 2>"$tmp/gpg.err" \
  || die 'Descriptografia falhou. Use a chave privada do proprietário fora do GitHub.'
# Bloqueia extração de caminhos inesperados, links e entradas estranhas.
tar -tf "$tmp/backup.tar" > "$tmp/paths"
python3 - "$tmp/backup.tar" <<'PY'
import tarfile,sys
with tarfile.open(sys.argv[1]) as tar:
  items=tar.getmembers()
  required={'database.dump','database.dump.sha256','archive.list'}
  if len(items)!=3 or {x.name for x in items}!=required or not all(x.isfile() for x in items):
    raise SystemExit('Conteúdo inesperado no backup: extração bloqueada.')
PY
tar -C "$tmp" -xf "$tmp/backup.tar"
(cd "$tmp" && sha256sum --check --status database.dump.sha256) || die 'Checksum do dump interno não confere.'
docker run --rm -i postgres:18 pg_restore --list < "$tmp/database.dump" > "$tmp/archive-actual.list" 2>/dev/null \
  || die 'Formato de dump inválido.'
cmp -s "$tmp/archive.list" "$tmp/archive-actual.list" || die 'Inventário da restauração diverge.'
docker run -d --name "$container" --network none -e POSTGRES_PASSWORD=local-verification-only postgres:18 >/dev/null
ready=0
for n in $(seq 1 45); do
  if docker exec "$container" pg_isready -U postgres >/dev/null 2>&1; then ready=1; break; fi
  sleep 1
done
[[ "$ready" == 1 ]] || die 'Container PostgreSQL 18 não iniciou.'
docker exec "$container" createdb -U postgres restore_check >/dev/null || die 'Banco de teste não criado.'
docker exec -i "$container" pg_restore -U postgres -d restore_check \
  --no-owner --no-privileges --exit-on-error < "$tmp/database.dump" >"$tmp/restore.out" 2>"$tmp/restore.err" \
  || die 'Falha ao restaurar o ARQUIVO DESCRIPTOGRAFADO.'
docker exec "$container" psql -U postgres -d restore_check -Atqc 'SELECT 1' >"$tmp/check" 2>/dev/null
[[ "$(cat "$tmp/check")" == 1 ]] || die 'Banco restaurado não responde.'
printf 'PG18_RESTAURACAO_ARQUIVO_DESCRIPTOGRAFADO_OK: backup recuperável em ambiente isolado.\n'
printf 'Verificar conteúdo de negócio por amostragem em ambiente privado antes da publicação.\n'
