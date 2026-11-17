import { execFileSync } from 'node:child_process';
import { readFileSync, statSync } from 'node:fs';

const files = execFileSync('git', ['ls-files'], { encoding: 'utf8' }).trim().split('\n').filter(Boolean);
const checks = [
  ['chave privada', /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/],
  ['token GitHub', /\b(?:ghp|gho|ghu|ghs|ghr)_[A-Za-z0-9]{30,}\b|\bgithub_pat_[A-Za-z0-9_]{30,}\b/],
  ['URL PostgreSQL com credencial literal', /\bpostgres(?:ql)?:\/\/[^\s:@/]+:[^\s@/]+@[^\s/]+\//i],
  ['segredo JWT comum', /\b(?:AUTH_SECRET|JWT_SECRET)\s*=\s*["']?[A-Za-z0-9_\-+/=]{32,}/],
  ['token Hotmart literal', /\b(?:HOTTOK|HOTMART_HOTTOK)\s*=\s*["']?[A-Za-z0-9_\-]{20,}/],
];
const findings = [];
for (const file of files) {
  let info;
  try { info = statSync(file); } catch { continue; }
  if (!info.isFile() || info.size > 2_000_000) continue;
  let source;
  try { source = readFileSync(file, 'utf8'); } catch { continue; }
  if (source.includes('\u0000')) continue;
  for (const [label, pattern] of checks) {
    if (pattern.test(source)) findings.push(`${file}: ${label}`);
  }
}
if (findings.length) {
  console.error('Possíveis segredos encontrados em arquivos versionados:');
  for (const finding of findings) console.error(`- ${finding}`);
  process.exitCode = 1;
} else {
  console.log(`Verificação estática: ${files.length} arquivos versionados, nenhum segredo de alto risco detectado.`);
}
