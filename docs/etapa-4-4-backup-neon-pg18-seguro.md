# Base Completa - Etapa 4.4 - Backup Neon PostgreSQL 18

Estado: SEM ACESSO A DADOS REAIS. Preparação testada apenas com conteúdo fictício.

## Destino

Google Drive pessoal do proprietário, sujeito à cota de espaço disponível. Usar OAuth próprio com escopo restrito drive.file. O aplicativo rclone cria automaticamente uma nova pasta chamada Base Completa - Backup Neon PG18 na raiz do Drive. A pasta inicialmente reservada pelo ChatGPT pertence à integração do ChatGPT e não será visível a outro aplicativo com escopo drive.file; NÃO ampliar o acesso OAuth para todo o Drive por conveniência. Verificar as permissões da nova pasta após o upload de teste.

## Configuração única do proprietário (nunca enviar senhas no chat)

1. Criar par GPG num computador ou telefone de confiança, protegendo a chave privada com senha forte. Salvar duas cópias privadas de recuperação separadas, ao menos uma offline. Jamais enviar a chave privada ao GitHub, ao Drive ou ao chat. Compartilhar com o runner apenas a chave PÚBLICA e o fingerprint conferido.
2. Em um dispositivo próprio, instalar rclone da fonte oficial. Configurar um remote chamado bcdrive, tipo Google Drive, escopo drive.file (opção 3). Para começar SEM projeto Google Cloud, deixar client_id e client_secret em branco: rclone usa seu aplicativo integrado. Autorizar no Google apenas a conta correta e o escopo limitado. O arquivo rclone.conf contém um token de acesso: nunca publicá-lo nem enviá-lo no chat. É possível criar cliente OAuth próprio mais tarde, se necessário por limite de uso; isso NÃO é requisito inicial.
3. Em GitHub Settings > Environments, criar Environment bc-neon-backup-private. Exigir revisão do proprietário antes de liberar secrets. Restringir as branches de execução a backup/pg18-drive-smoke-4-4-* e backup/pg18-real-approved-4-4-*.
4. Gravar APENAS em Environment secrets: BC_RCLONE_CONFIG_B64 (config OAuth rclone isolada, em Base64; pode usar client_id/client_secret vazios); BC_GPG_PUBLIC_KEY_B64 (chave PÚBLICA GPG em Base64); BC_NEON_BACKUP_USER (usuário Neon de leitura); BC_NEON_BACKUP_PASSWORD (senha de leitura). Base64 NÃO é criptografia: tratar a configuração OAuth como segredo.
5. Gravar Environment variables: BC_GPG_RECIPIENT_FPR (40 caracteres hexadecimais); BC_DRIVE_TEST_APPROVED; BC_DRIVE_PREFLIGHT_VERIFIED; BC_PRIVATE_DESTINATION_APPROVED; BC_BACKUP_APPROVED. Manter todas as flags em NO até a etapa correspondente ser aprovada.
6. Utilizar credencial já existente com acesso completo de LEITURA ao banco neondb e nenhum privilégio de escrita ou administração. A rotina rejeita privilégios elevados. NÃO criar usuário, alterar permissões ou mexer no Neon Production sem autorização específica.
7. Somente após autorizar upload fictício, marcar BC_DRIVE_TEST_APPROVED=YES e criar branch a partir da branch isolada com nome iniciando backup/pg18-drive-smoke-4-4-. O job criado não usa nenhuma credencial do Neon, envia arquivo falso cifrado e verifica o download via SHA-256. Conferir no Google Drive que a pasta realmente utilizada é privada.
8. Somente após esse teste aprovado e autorização para leitura real, marcar BC_DRIVE_PREFLIGHT_VERIFIED=YES, BC_PRIVATE_DESTINATION_APPROVED=YES e BC_BACKUP_APPROVED=YES. Criar nova branch iniciando backup/pg18-real-approved-4-4-. Revisar a execução do GitHub Environment. Sem aprovação, o script se recusa a funcionar.
9. O script de execução real usa pg_dump 18 com TLS verificado, valida conta read-only, restaura preliminarmente em PostgreSQL 18 local sem rede, cifra o backup para a chave pública e envia apenas o arquivo cifrado ao Drive. Verifica SHA-256 lendo de volta o arquivo remoto. Nada é anexado aos artefatos do GitHub.
10. Para CERTIFICAR recuperação, o dono deve baixar o par arquivo.tar.gpg e arquivo.tar.gpg.sha256 da pasta realmente utilizada, e executar localmente scripts/verify-backup-pg18-offline.sh com o caminho do arquivo. Essa rotina, com a chave privada disponível somente no equipamento confiável, verifica SHA-256, descriptografa, compara o inventário e restaura os dados DESCRIPTOGRAFADOS no PostgreSQL 18 sem rede. Essa última etapa é obrigatória antes de dizer que o backup é recuperável.

## Automação e provas seguras

- scripts/backup-neon-pg18-once.sh: rotina REAL, travada por aprovação e configurações protegidas.
- scripts/test-backup-gpg-pg18-synthetic.sh: teste fictício GPG/PG18 com perda forçada do dump original e restauração após descriptografia.
- scripts/verify-backup-pg18-offline.sh: verificador independente do arquivo realmente guardado.
- scripts/test-drive-private-upload-synthetic.sh: upload OAuth privado somente de arquivo FICTÍCIO.
- .github/workflows/etapa-4-4-pg18-preflight.yml: testes offline e prova de recusa segura.
- .github/workflows/etapa-4-4-backup-neon-private-approved.yml: somente branches especiais e Environment protegido. Não roda em main/PR.

## Regras permanentes

Nunca incluir segredos, dados reais do banco, arquivos de backup ou chave privada em commits, logs ou GitHub Actions artifacts. Não alterar branch Neon Production, não excluir snapshots, não publicar plataforma, não usar pagamentos reais, não mexer no WhatsApp. Drive pessoal tem cota gratuita compartilhada e finita; não contratar serviços nem habilitar cobrança.

ESTADO: backup real ainda não realizado; exige credencial de leitura já existente, armazenamento OAuth autorizado e chave privada GPG sob posse do dono. Não publicar Production sem arquivo real recuperado com sucesso.

## Verificações de 27/10/2026 — sem leitura de dados pessoais

- Neon Production: listagem da API mostra apenas neondb_owner; nenhuma role exclusivamente read-only identificada. Para backup completo, metadados apontam esquemas public e neon_auth, ambos com objetos que exigem SELECT. A criação de role e GRANTs é operação em Production e continua aguardando aprovação expressa. Consulte docs/backup-4-4-neon-grants-pendente-autorizacao.sql.
- Pasta reservada do Drive continua com permissão owner e sem compartilhamento; ainda não é a pasta acessível a rclone com escopo drive.file.
- Uma branch separada backup/setup-safe-4-4-20261027 foi criada para preparar a configuração sem reabrir testes Lei em Dia.
- Script local para chave GPG: scripts/gpg-gerar-chave-no-aparelho-do-proprietario.sh. Nunca executá-lo no GitHub Actions; o arquivo privado pertence ao proprietário.
- GitHub connector não permite verificar nem configurar Environment secrets nesta sessão. Devem ser inseridos na interface protegida do GitHub pelo proprietário e nunca no chat.
- Enquanto a autorização Google e a chave privada não estiverem sob controle do dono, não iniciar teste de upload nem dump real.
