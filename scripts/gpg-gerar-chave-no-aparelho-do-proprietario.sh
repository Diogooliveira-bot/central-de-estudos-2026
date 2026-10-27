#!/usr/bin/env bash
# EXECUTAR SOMENTE EM DISPOSITIVO PRIVADO DO PROPRIETARIO, NUNCA NO GITHUB ACTIONS.
# A chave PRIVADA nao sai do dispositivo por esta rotina.
set -Eeuo pipefail
set +x
umask 077
die(){ printf 'GPG_NAO_CRIADO: %s\n' "$1" >&2; exit 1; }
[[ -t 0 && -t 1 ]] || die 'Use um terminal interativo num computador seu (nao GitHub Actions).'
[[ -n "$(printenv HOME 2>/dev/null || true)" ]] || die 'HOME nao definido.'
command -v gpg >/dev/null || die 'Instale GnuPG no seu dispositivo.'
[[ -z "$(printenv CI 2>/dev/null || true)" && -z "$(printenv GITHUB_ACTIONS 2>/dev/null || true)" ]] || die 'Geracao de chave privada bloqueada no CI.'
export GPG_TTY="$(tty)"
folder="$HOME/.base-completa-chave-privada"
mkdir -p "$folder"
chmod 700 "$folder"
id="Base Completa Backup Neon PG18 - $(date -u +%Y%m%dT%H%M%SZ)"
printf '\nA seguir, o GPG pedira que voce escolha uma SENHA FORTE no seu proprio dispositivo.\n'
printf 'Nao informe a senha nesta conversa ou em servicos online.\n'
gpg --quick-generate-key "$id" rsa4096 encr 3y || die 'Geracao nao concluida.'
fingerprint="$(gpg --batch --with-colons --fingerprint "$id" 2>/dev/null | awk -F: '$1=="fpr"{print $10;exit}')"
[[ "$fingerprint" =~ ^[[:xdigit:]]{40}$ ]] || die 'Fingerprint nao encontrado.'
public="$folder/BC-GPG-CHAVE-PUBLICA.asc"
private="$folder/BC-GPG-CHAVE-PRIVADA-GUARDE-OFFLINE.asc"
[[ ! -e "$public" && ! -e "$private" ]] || die 'Arquivos anteriores encontrados; nao sobrescrever.'
gpg --batch --armor --export "$fingerprint" > "$public" || die 'Falha na exportacao da chave publica.'
gpg --batch --armor --export-secret-keys "$fingerprint" > "$private" || die 'Falha na exportacao da chave privada.'
chmod 600 "$public" "$private"
[[ -s "$public" && -s "$private" ]] || die 'Exportacao incompleta.'
printf '\nCHAVE_GPG_CRIADA_NO_SEU_DISPOSITIVO.\nFingerprint (identificador PUBLICO): %s\n' "$fingerprint"
printf 'Arquivo da chave PUBLICA: %s\n' "$public"
printf 'Arquivo da chave PRIVADA: %s\n' "$private"
printf '\nIMPORTANTE:\n'
printf '1. Guarde DUAS copias da chave PRIVADA em locais privados diferentes; ao menos uma offline.\n'
printf '2. Conserve a senha da chave em lugar separado. Sem chave privada + senha, backup sera irrecuperavel.\n'
printf '3. Nunca carregue esse arquivo privado ao GitHub, nem cole no chat, nem o deixe em pastas sincronizadas.\n'
printf '4. O arquivo PUBLICO pode ser usado no Environment protegido do GitHub.\n'
