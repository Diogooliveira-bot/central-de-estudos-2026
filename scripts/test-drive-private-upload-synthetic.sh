#!/usr/bin/env bash
# Testa acesso ao Google Drive sem conectar ou consultar o Neon.
# O conteúdo enviado é FICTÍCIO e criptografado; não apagamos outros arquivos.
set -Eeuo pipefail
set +x
umask 077
die(){ printf 'DRIVE_SMOKE_BLOQUEADO: %s\n' "$1" >&2; exit 1; }
[[ "$(printenv BC_DRIVE_TEST_APPROVED 2>/dev/null || true)" == YES ]] || die 'Smoke não autorizado.'
[[ -n "$(printenv BC_RCLONE_CONFIG_B64 2>/dev/null || true)" ]] || die 'OAuth não configurado.'
for tool in rclone gpg python3 base64 sha256sum mktemp; do
  command -v "$tool" >/dev/null || die "Ferramenta ausente: $tool"
done
tmp="$(mktemp -d)"
cleanup(){ rm -rf -- "$tmp"; }
trap cleanup EXIT
export RCLONE_CONFIG="$tmp/rclone.conf"
printf '%s' "$BC_RCLONE_CONFIG_B64" | base64 -d > "$RCLONE_CONFIG" || die 'OAuth inválido.'
chmod 600 "$RCLONE_CONFIG"
python3 - "$RCLONE_CONFIG" <<'PY'
import configparser,json,sys
p=configparser.ConfigParser(interpolation=None)
with open(sys.argv[1],encoding='utf8') as f:p.read_file(f)
assert set(p.sections())=={'bcdrive'},'Somente bcdrive permitido'
v=p['bcdrive']
assert v.get('type')=='drive' and v.get('scope')=='drive.file','Drive requer OAuth mínimo'
assert not v.get('root_folder_id') and not v.get('service_account_file'),'Não usar identidades/destinos globais'
assert v.get('client_id') and v.get('client_secret') and v.get('token'),'OAuth incompleto'
json.loads(v['token'])
PY
mkdir -m 700 "$tmp/gnupg"
export GNUPGHOME="$tmp/gnupg"
gpg --batch --pinentry-mode loopback --passphrase '' \
  --quick-generate-key 'TESTE APENAS FICTICIO <ci-drive@example.invalid>' rsa2048 encr 1d >/dev/null 2>&1
recipient="$(gpg --batch --with-colons --fingerprint ci-drive@example.invalid | awk -F: '$1=="fpr"{print $10;exit}')"
[[ -n "$recipient" ]] || die 'Chave sintética não gerada.'
printf 'BC TESTE FICTICIO SEM DADOS PESSOAIS\n' > "$tmp/hello.txt"
name="bc-drive-test-$RANDOM-$(date -u +%Y%m%d%H%M%S).gpg"
gpg --batch --trust-model always --recipient "$recipient" \
  --output "$tmp/$name" --encrypt "$tmp/hello.txt" || die 'Criptografia sintética falhou.'
dest="bcdrive:Base Completa - Backup Neon PG18/$name"
rclone --config "$RCLONE_CONFIG" copyto "$tmp/$name" "$dest" \
  --stats 0 --log-level ERROR > "$tmp/upload.err" 2>&1 || die 'Upload de teste falhou.'
local_hash="$(sha256sum "$tmp/$name" | awk '{print $1}')"
remote_hash="$(rclone --config "$RCLONE_CONFIG" cat "$dest" 2>"$tmp/readback.err" | sha256sum | awk '{print $1}')"
[[ "$local_hash" == "$remote_hash" ]] || die 'Readback do Drive falhou.'
echo 'DRIVE_PRIVATE_OAUTH_SYNTHETIC_UPLOAD_READBACK_SHA256_OK'
echo 'A pasta Google Drive criada por rclone deve ser checada quanto a compartilhamento antes do backup real.'
