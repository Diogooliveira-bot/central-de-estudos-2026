#!/usr/bin/env bash
# PREPARADO, NAO EXECUTADO COM DADOS REAIS. Exige autorizacao e destino privado montado.
# Esta rotina NUNCA deve ser chamada automaticamente por workflow push/PR.
set -Eeuo pipefail
set +x
umask 077

die() { printf 'BACKUP_BLOQUEADO: %s\n' "$1" >&2; exit 1; }
[[ "${BC_BACKUP_APPROVED:-}" == "YES" ]] || die "Falta aprovacao especifica da execucao com credenciais."
[[ "${BC_PRIVATE_DESTINATION_APPROVED:-}" == "YES" ]] || die "Destino privado nao aprovado."
[[ -n "${BC_PRIVATE_OUTPUT_DIR:-}" ]] || die "Destino privado ainda nao montado."
[[ -d "$BC_PRIVATE_OUTPUT_DIR" ]] || die "Destino privado indisponivel."
[[ "$BC_PRIVATE_OUTPUT_DIR" = /* ]] || die "Destino deve ser absoluto."
case "$BC_PRIVATE_OUTPUT_DIR" in
  /tmp|/tmp/*|/home/runner/work|/home/runner/work/*|/home/runner/_work|/home/runner/_work/*) die "Caminho publico ou efemero nao permitido.";;
esac
if [[ -n "${GITHUB_WORKSPACE:-}" && "$BC_PRIVATE_OUTPUT_DIR" == "$GITHUB_WORKSPACE"* ]]; then
  die "Destino nao pode estar no checkout publico."
fi
[[ "${PGHOST:-}" == 'ep-wild-math-awuoq9pk.c-12.us-east-1.aws.neon.tech' ]] || die "Endpoint nao corresponde ao Neon Production ativo."
[[ "${PGDATABASE:-}" == 'neondb' ]] || die "Banco alvo nao corresponde ao informado."
[[ "${PGPORT:-5432}" == '5432' ]] || die "Porta inesperada."
[[ -n "${PGUSER:-}" && -n "${PGPASSWORD:-}" ]] || die "Credenciais nao configuradas."
[[ "${BC_GPG_RECIPIENT_FPR:-}" =~ ^[A-Fa-f0-9]{40}$ ]] || die "Chave PUBLICA GPG (fingerprint de 40 hex) nao informada."
command -v docker >/dev/null || die "Docker nao instalado."
command -v gpg >/dev/null || die "GPG nao instalado."
command -v sha256sum >/dev/null || die "sha256sum nao instalado."

# Nunca importar uma chave secreta no runner. Apenas chave PUBLICA validada pelo dono.
gpg --batch --with-colons --fingerprint "$BC_GPG_RECIPIENT_FPR" |
  grep -qiE "^fpr:::::::::${BC_GPG_RECIPIENT_FPR}:$" || die "Chave publica esperada indisponivel."
tmp="$(mktemp -d)"
name="bc-pg18-restore-${GITHUB_RUN_ID:-manual}-$$"
finish() {
  docker rm -f "$name" >/dev/null 2>&1 || true
  rm -rf -- "$tmp"
}
trap finish EXIT
export PGSSLMODE=verify-full
export PGSSLROOTCERT=/etc/ssl/certs/ca-certificates.crt
export PGPORT=5432
export PGCONNECT_TIMEOUT=15
image='postgres:18'
pg18() {
  docker run --rm --network host \
    --env PGHOST --env PGPORT --env PGDATABASE --env PGUSER \
    --env PGPASSWORD --env PGSSLMODE --env PGSSLROOTCERT --env PGCONNECT_TIMEOUT \
    "$image" "$@"
}
pg18 pg_dump --version | grep -Eq '^pg_dump \(PostgreSQL\) 18\.' || die "pg_dump 18 nao esta ativo."
pg18 pg_restore --version | grep -Eq '^pg_restore \(PostgreSQL\) 18\.' || die "pg_restore 18 nao esta ativo."
# Apenas leituras. Confere banco e servidor, sem exibir senha.
server_version="$(pg18 psql --no-psqlrc --tuples-only --no-align -c "SELECT current_setting('server_version_num')")"
[[ "$server_version" =~ ^18[0-9]{4}$ ]] || die "Versao do servidor nao e PostgreSQL 18."
pg18 psql --no-psqlrc --tuples-only --no-align -c 'SELECT 1' >/dev/null

# pg_dump -Fc usa snapshot consistente da base. Nao altera dados reais.
pg18 pg_dump --format=custom --blobs --compress=6 --lock-wait-timeout=10000 --dbname=neondb > "$tmp/database.dump"
[[ -s "$tmp/database.dump" ]] || die "Dump vazio."
docker run --rm -i "$image" pg_restore --list < "$tmp/database.dump" > "$tmp/archive.list"
[[ -s "$tmp/archive.list" ]] || die "Indice do dump vazio."
(cd "$tmp" && sha256sum database.dump > database.dump.sha256 && sha256sum --check database.dump.sha256 >/dev/null)

# Encripta para chave publica do proprietario, antes de mover para o destino privado.
# A chave PRIVADA nunca e enviada ao GitHub.
tar -C "$tmp" -cf "$tmp/backup.tar" database.dump database.dump.sha256 archive.list
stamp="$(date -u +%Y%m%dT%H%M%SZ)"
target="$BC_PRIVATE_OUTPUT_DIR/base-completa-neondb-pg18-${stamp}.tar.gpg"
[[ ! -e "$target" ]] || die "Arquivo de destino ja existe."
gpg --batch --yes --trust-model always --recipient "$BC_GPG_RECIPIENT_FPR" \
  --output "$target" --encrypt "$tmp/backup.tar" || die "Criptografia falhou."
[[ -s "$target" ]] || die "Copia criptografada vazia."
sha256sum "$target" > "${target}.sha256"
(cd "$BC_PRIVATE_OUTPUT_DIR" && sha256sum --check "$(basename "${target}.sha256")") || die "Checksum nao confere."

# Teste em PG18 LOCAL ISOLADO, sem tocar Production. Extensoes Neon podem bloquear a restauracao.
docker run -d --name "$name" -e POSTGRES_PASSWORD=synthetic-restore-only "$image" >/dev/null
ready=0
for n in $(seq 1 45); do
  if docker exec "$name" pg_isready -U postgres >/dev/null 2>&1; then ready=1; break; fi
  sleep 1
done
[[ "$ready" == 1 ]] || die "Banco isolado nao iniciou."
docker exec "$name" createdb -U postgres restore_check
if ! docker exec -i "$name" pg_restore --username=postgres --dbname=restore_check \
     --no-owner --no-privileges --exit-on-error < "$tmp/database.dump"; then
  die "Copia criptografada armazenada, mas teste de restauracao falhou. NAO LIBERAR PRODUCTION."
fi

printf 'BACKUP_ENCRIPTADO_CHECKSUM_OK, RESTAURACAO_PG18_ISOLADA_OK. Validar tambem decifragem usando chave privada fora do runner.\n'
printf 'Arquivo salvo somente no destino privado aprovado; nunca anexar ao job nem fazer commit.\n'
