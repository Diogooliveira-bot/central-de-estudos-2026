/* Economia de banco (Neon): comandos "criar tabela/coluna se não existir" rodam UMA vez por instância do servidor,
 * e não a cada pedido do aluno. Cada instância/cliente de banco tem a sua própria memória (testes isolados).
 * Se o comando falhar, a memória é descartada e a próxima chamada tenta de novo. */
const memory = new WeakMap();

export function ensureOnce(sql, key, run) {
  if (!sql || (typeof sql !== 'function' && typeof sql !== 'object')) return Promise.resolve().then(run);
  let keys = memory.get(sql);
  if (!keys) { keys = new Map(); memory.set(sql, keys); }
  let pending = keys.get(key);
  if (!pending) {
    pending = Promise.resolve().then(run).catch((error) => { keys.delete(key); throw error; });
    keys.set(key, pending);
  }
  return pending;
}

/** Esquece o que já foi criado para este cliente (usado só em testes que recriam o banco). */
export function forgetEnsured(sql) {
  if (sql && (typeof sql === 'function' || typeof sql === 'object')) memory.delete(sql);
}
