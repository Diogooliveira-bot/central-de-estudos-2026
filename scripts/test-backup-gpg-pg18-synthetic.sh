#!/usr/bin/env bash
# Reproduz: pg_dump PG18 fictício -> GPG -> cópia -> exclusão do original ->
# descriptografia -> sha256 -> pg_restore PG18 sem rede.
set -Eeuo pipefail
set +x
umask 077
tmp="$(mktemp -d)"
source_container="bc-synthetic-pg18-$RANDOM-$$"
cleanup() {
  docker rm -f "$source_container" >/dev/null 2>&1 || true
  rm -rf -- "$tmp"
}
trap cleanup EXIT
mkdir -p "$tmp/private" "$tmp/gnupg"
chmod 700 "$tmp/gnupg"
export GNUPGHOME="$tmp/gnupg"
docker run -d --name "$source_container" --network none \
  -e POSTGRES_PASSWORD=synthetic-only postgres:18 >/dev/null
ready=0
for n in $(seq 1 45); do
  if docker exec "$source_container" pg_isready -U postgres >/dev/null 2>&1; then ready=1; break; fi
  sleep 1
done
[[ "$ready" == 1 ]] || { echo 'SYNTHETIC_ERROR: banco inicial'; exit 1; }
docker exec "$source_container" psql -U postgres -d postgres -v ON_ERROR_STOP=1 \
  -c "CREATE TABLE backup_demo(id INTEGER PRIMARY KEY, valor TEXT); INSERT INTO backup_demo VALUES(1,'APENAS FICTICIO');" >/dev/null
docker exec "$source_container" pg_dump -U postgres -d postgres -Fc > "$tmp/database.dump"
docker run --rm -i postgres:18 pg_restore --list < "$tmp/database.dump" > "$tmp/archive.list"
(cd "$tmp" && sha256sum database.dump > database.dump.sha256)
tar -C "$tmp" -cf "$tmp/archive.tar" database.dump database.dump.sha256 archive.list

gpg --batch --pinentry-mode loopback --passphrase '' \
  --quick-generate-key 'CI DADOS FICTICIOS <ci-backup@example.invalid>' rsa2048 encr 1d >/dev/null 2>&1
fingerprint="$(gpg --batch --with-colons --fingerprint 'ci-backup@example.invalid' | awk -F: '$1=="fpr"{print $10;exit}')"
[[ -n "$fingerprint" ]] || { echo 'SYNTHETIC_ERROR: GPG'; exit 1; }
name="synthetic-pg18.tar.gpg"
gpg --batch --trust-model always --recipient "$fingerprint" \
  --output "$tmp/$name" --encrypt "$tmp/archive.tar"
(cd "$tmp" && sha256sum "$name" > "$name.sha256")
cp "$tmp/$name" "$tmp/$name.sha256" "$tmp/private/"
# Para forçar o teste a usar apenas o arquivo cifrado, removemos tudo em claro.
rm -f "$tmp/database.dump" "$tmp/database.dump.sha256" "$tmp/archive.list" "$tmp/archive.tar" "$tmp/$name" "$tmp/$name.sha256"
bash scripts/verify-backup-pg18-offline.sh "$tmp/private/$name"
echo 'SYNTHETIC_GPG_DOWNLOAD_DECRYPT_PG18_RESTORE_OK'
