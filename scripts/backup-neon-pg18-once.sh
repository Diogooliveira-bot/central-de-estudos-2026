#!/usr/bin/env bash
# PG18 -> arquivo cifrado para a chave PUBLICA do proprietário -> Google Drive privado.
# SOMENTE com autorizações explícitas e segredos de ambiente protegido.
set -Eeuo pipefail
set +x
umask 077
die(){ printf 'BACKUP_BLOQUEADO: %s\n' "$1" >&2; exit 1; }
for key in BC_BACKUP_APPROVED BC_PRIVATE_DESTINATION_APPROVED BC_DRIVE_PREFLIGHT_VERIFIED; do
  [[ "$(printenv "$key" 2>/dev/null || true)" == YES ]] || die "Falta aprovação: $key"
done
for key in PGHOST PGPORT PGDATABASE PGUSER PGPASSWORD BC_GPG_PUBLIC_KEY_B64 BC_GPG_RECIPIENT_FPR BC_RCLONE_CONFIG_B64; do
  [[ -n "$(printenv "$key" 2>/dev/null || true)" ]] || die "Configuração privada ausente: $key"
done
[[ "$PGHOST" == ep-wild-math-awuoq9pk.c-12.us-east-1.aws.neon.tech ]] || die 'Endpoint não aprovado.'
[[ "$PGDATABASE" == neondb && "$PGPORT" == 5432 ]] || die 'Banco/porta inesperados.'
[[ "$BC_GPG_RECIPIENT_FPR" =~ ^[[:xdigit:]]{40}$ ]] || die 'Fingerprint GPG inválido.'
for tool in docker gpg sha256sum rclone python3 base64 tar mktemp; do
  command -v "$tool" >/dev/null || die "Ferramenta ausente: $tool"
done
tmp="$(mktemp -d)"
container="bc-pg18-restore-$RANDOM-$$"
cleanup(){
  docker rm -f "$container" >/dev/null 2>&1 || true
  rm -rf -- "$tmp"
}
trap cleanup EXIT
mkdir -m 700 "$tmp/gnupg"
export GNUPGHOME="$tmp/gnupg"
export RCLONE_CONFIG="$tmp/rclone.conf"
(umask 077; printf '%s' "$BC_GPG_PUBLIC_KEY_B64" | base64 -d > "$tmp/public.asc") || die 'Chave pública inválida.'
(umask 077; printf '%s' "$BC_RCLONE_CONFIG_B64" | base64 -d > "$RCLONE_CONFIG") || die 'Configuração Drive inválida.'
chmod 600 "$RCLONE_CONFIG"
python3 - "$RCLONE_CONFIG" <<'PY'
import configparser, sys, json
p=configparser.ConfigParser(interpolation=None)
with open(sys.argv[1],encoding='utf8') as f: p.read_file(f)
if set(p.sections())!={'bcdrive'}: raise SystemExit('Somente remote bcdrive autorizado.')
v=p['bcdrive']
if v.get('type')!='drive' or v.get('scope')!='drive.file':
  raise SystemExit('Integração deve usar Drive com escopo limitado drive.file.')
if v.get('root_folder_id') or v.get('service_account_file') or v.get('service_account_credentials'):
  raise SystemExit('Destino ou identidade não permitida.')
if not v.get('client_id') or not v.get('client_secret') or not v.get('token'):
  raise SystemExit('OAuth do Google Drive incompleto.')
json.loads(v['token'])
PY
gpg --batch --quiet --import "$tmp/public.asc" >/dev/null 2>&1 || die 'Importação da chave pública falhou.'
actual="$(gpg --batch --with-colons --fingerprint "$BC_GPG_RECIPIENT_FPR" 2>/dev/null | awk -F: '$1=="fpr"{print $10;exit}')"
expected="$(printf '%s' "$BC_GPG_RECIPIENT_FPR" | tr '[:lower:]' '[:upper:]')"
[[ "$actual" == "$expected" ]] || die 'Fingerprint não corresponde à chave importada.'
export PGSSLMODE=verify-full PGSSLROOTCERT=/etc/ssl/certs/ca-certificates.crt PGCONNECT_TIMEOUT=15
pg18(){
  docker run --rm --network host \
    --env PGHOST --env PGPORT --env PGDATABASE --env PGUSER \
    --env PGPASSWORD --env PGSSLMODE --env PGSSLROOTCERT --env PGCONNECT_TIMEOUT \
    postgres:18 "$@"
}
pg18 pg_dump --version | grep -Eq '^pg_dump \(PostgreSQL\) 18\.' || die 'pg_dump não é PostgreSQL 18.'
version="$(pg18 psql --no-psqlrc -Atqc "SELECT current_setting('server_version_num')" 2>"$tmp/pg-connect.err" || true)"
[[ "$version" =~ ^18[0-9]{4}$ ]] || die 'Servidor/SSL/usuário não validado como PostgreSQL 18.'
if ! pg18 pg_dump --format=custom --blobs --compress=6 \
  --lock-wait-timeout=10000 --dbname=neondb > "$tmp/database.dump" 2>"$tmp/dump.err"; then
  die 'pg_dump falhou: não foi enviado nenhum backup. Verificar permissões em canal privado.'
fi
[[ -s "$tmp/database.dump" ]] || die 'Dump vazio.'
docker run --rm -i postgres:18 pg_restore --list < "$tmp/database.dump" > "$tmp/archive.list" 2>/dev/null \
  || die 'Índice de dump ilegível.'
[[ -s "$tmp/archive.list" ]] || die 'Dump sem índice.'
(cd "$tmp" && sha256sum database.dump > database.dump.sha256 && sha256sum -c database.dump.sha256 >/dev/null)

# Verificação preliminar em Postgres18 local, isolado SEM REDE.
docker run -d --name "$container" --network none \
  -e POSTGRES_PASSWORD=local-test-only postgres:18 >/dev/null
ready=0
for n in $(seq 1 45); do
  if docker exec "$container" pg_isready -U postgres >/dev/null 2>&1; then ready=1; break; fi
  sleep 1
done
[[ "$ready" == 1 ]] || die 'Postgres de restauração não inicializou.'
docker exec "$container" createdb -U postgres restore_check >/dev/null || die 'Banco de teste não inicializado.'
if ! docker exec -i "$container" pg_restore -U postgres -d restore_check \
  --no-owner --no-privileges --exit-on-error < "$tmp/database.dump" >"$tmp/restore.out" 2>"$tmp/restore.err"; then
  die 'Restauração isolada não passou. Não liberar produção.'
fi

tar -C "$tmp" -cf "$tmp/backup.tar" database.dump database.dump.sha256 archive.list
stamp="$(date -u +%Y%m%dT%H%M%SZ)"
name="base-completa-neon-pg18-$stamp-$RANDOM.tar.gpg"
encrypted="$tmp/$name"
gpg --batch --yes --quiet --trust-model always --recipient "$BC_GPG_RECIPIENT_FPR" \
  --output "$encrypted" --encrypt "$tmp/backup.tar" || die 'Criptografia falhou.'
[[ -s "$encrypted" ]] || die 'Arquivo criptografado vazio.'
sha256sum "$encrypted" > "$encrypted.sha256"

# O escopo drive.file cria o próprio diretório no Drive. NÃO lê arquivos pessoais.
remote="bcdrive:Base Completa - Backup Neon PG18/$name"
rclone --config "$RCLONE_CONFIG" copyto "$encrypted" "$remote" \
  --retries 3 --low-level-retries 3 --stats 0 --log-level ERROR >"$tmp/upload.err" 2>&1 \
  || die 'Envio criptografado ao Drive falhou.'
rclone --config "$RCLONE_CONFIG" copyto "$encrypted.sha256" "$remote.sha256" \
  --retries 3 --stats 0 --log-level ERROR >"$tmp/upload-sha.err" 2>&1 \
  || die 'Envio de checksum ao Drive falhou.'
original="$(sha256sum "$encrypted" | awk '{print $1}')"
received="$(rclone --config "$RCLONE_CONFIG" cat "$remote" 2>"$tmp/download.err" | sha256sum | awk '{print $1}')"
[[ "$original" == "$received" ]] || die 'Hash da cópia no Drive diverge.'
printf 'BACKUP_REAL_CRIPTOGRAFADO_ENVIADO_AO_DRIVE_E_HASH_VERIFICADO.\n'
printf 'RESTAURACAO_PRELIMINAR_PG18_OK; RESTAURACAO_APOS_DESCRIPTOGRAFIA PELO PROPRIETARIO AINDA PENDENTE.\n'
printf 'Sem dados de Production em logs ou artefatos do GitHub.\n'
