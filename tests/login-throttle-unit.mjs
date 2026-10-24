import test from 'node:test';
import assert from 'node:assert/strict';

process.env.AUTH_SECRET = 'throttle-test-secret-only-for-unit-tests-20261024';
process.env.DATABASE_URL = 'postgresql://test:test@ep-unit-test.us-east-2.aws.neon.tech/test';
delete process.env.VERCEL_ENV;

const {
  THROTTLE_LIMITS, clientIp, normalizeIp, throttleKeys, createLoginThrottle, throttleMessage,
} = await import('../lib/login-throttle.js');
const { hashPassword } = await import('../lib/auth.js');

const SECRET = process.env.AUTH_SECRET;
const MIN = 60 * 1000;

/* ------------------------------------------------------------------ */
/* Armazenamento em memória com a mesma regra de janela do SQL        */
/* ------------------------------------------------------------------ */

function fakeClock() {
  let t = 5_000_000;
  return { now: () => t, advance: (ms) => { t += ms; } };
}

function memoryStore(clock) {
  const rows = new Map();
  const view = (entry) => ({ count: entry.count, ageMs: clock.now() - entry.start });
  return {
    rows,
    async peek(keys) {
      const out = new Map();
      for (const key of keys) if (rows.has(key)) out.set(key, view(rows.get(key)));
      return out;
    },
    async hit(key, windowMs) {
      const entry = rows.get(key);
      if (!entry || clock.now() - entry.start >= windowMs) rows.set(key, { count: 1, start: clock.now() });
      else entry.count++;
      return view(rows.get(key));
    },
    async touch(key) { rows.set(key, { count: 1, start: clock.now() }); },
    async clear(key) { rows.delete(key); },
  };
}

function setup() {
  const clock = fakeClock();
  const store = memoryStore(clock);
  const throttle = createLoginThrottle({ store, log: () => {} });
  const keysFor = (email, ip) => throttleKeys({ ip, email, secret: SECRET });
  /** Uma tentativa errada, do jeito que o handler faz: check -> recordFailure. */
  async function wrongAttempt(email, ip) {
    const keys = keysFor(email, ip);
    const gate = await throttle.check(keys);
    if (gate.blocked) return { ...gate, counted: false };
    return { ...(await throttle.recordFailure(keys, { trusted: gate.trusted })), counted: true };
  }
  return { clock, store, throttle, keysFor, wrongAttempt };
}

/* ------------------------------------------------------------------ */
/* 1. Desenho do limite                                               */
/* ------------------------------------------------------------------ */

test('5 erros bloqueiam só o par conta+IP; o aluno em outra rede continua entrando', async () => {
  const { throttle, keysFor, wrongAttempt } = setup();
  for (let i = 1; i <= 4; i++) assert.equal((await wrongAttempt('aluno@x.test', '203.0.113.9')).blocked, false);
  const fifth = await wrongAttempt('aluno@x.test', '203.0.113.9');
  assert.equal(fifth.blocked, true);
  assert.equal(fifth.scope, 'pair');

  assert.equal((await throttle.check(keysFor('aluno@x.test', '203.0.113.9'))).blocked, true, 'atacante segue bloqueado');
  assert.equal((await throttle.check(keysFor('aluno@x.test', '198.51.100.7'))).blocked, false, 'dono da conta, em outra rede, não é afetado');
  assert.equal((await throttle.check(keysFor('outra@x.test', '203.0.113.9'))).blocked, false, 'outra conta na mesma rede ainda não é afetada');
});

test('o bloqueio expira sozinho depois de 15 minutos (nunca é indefinido)', async () => {
  const { clock, throttle, keysFor, wrongAttempt } = setup();
  for (let i = 0; i < 5; i++) await wrongAttempt('aluno@x.test', '203.0.113.9');
  const blocked = await throttle.check(keysFor('aluno@x.test', '203.0.113.9'));
  assert.equal(blocked.blocked, true);
  assert.ok(blocked.retryAfterSec > 0 && blocked.retryAfterSec <= 15 * 60);

  clock.advance(14 * MIN);
  assert.equal((await throttle.check(keysFor('aluno@x.test', '203.0.113.9'))).blocked, true);
  clock.advance(1 * MIN + 1000);
  assert.equal((await throttle.check(keysFor('aluno@x.test', '203.0.113.9'))).blocked, false);
});

test('20 erros de uma mesma rede, em contas diferentes, bloqueiam a rede inteira', async () => {
  const { throttle, keysFor, wrongAttempt } = setup();
  let last;
  for (let i = 0; i < THROTTLE_LIMITS.perIp; i++) last = await wrongAttempt('conta' + i + '@x.test', '203.0.113.50');
  assert.equal(last.blocked, true);
  assert.equal(last.scope, 'ip');
  assert.equal((await throttle.check(keysFor('nova@x.test', '203.0.113.50'))).blocked, true);
  assert.equal((await throttle.check(keysFor('nova@x.test', '203.0.113.51'))).blocked, false);
});

test('ataque distribuído: 30 redes diferentes passam a exigir rede conhecida, sem trancar o dono', async () => {
  const { clock, throttle, keysFor, wrongAttempt } = setup();
  const victim = 'aluno@x.test';

  // O dono já entrou com sucesso da rede de casa antes do ataque.
  await throttle.recordSuccess(keysFor(victim, '198.51.100.7'));

  // 30 redes diferentes erram 1 vez cada: nenhuma é bloqueada por IP ou por par.
  for (let i = 0; i < THROTTLE_LIMITS.perAccountAny; i++) {
    const r = await wrongAttempt(victim, '192.0.2.' + (i + 1));
    assert.equal(r.counted, true);
  }

  // Rede nova (mesmo com a senha certa, a tentativa nem chega a ser avaliada) é barrada.
  const attacker = await throttle.check(keysFor(victim, '192.0.2.200'));
  assert.equal(attacker.blocked, true);
  assert.equal(attacker.scope, 'account');

  // O dono, na rede conhecida, continua entrando.
  const owner = await throttle.check(keysFor(victim, '198.51.100.7'));
  assert.equal(owner.blocked, false);
  assert.equal(owner.trusted, true);

  // Custo assumido: o dono numa rede NOVA espera a janela passar, e só isso.
  const ownerNewNetwork = await throttle.check(keysFor(victim, '198.51.100.99'));
  assert.equal(ownerNewNetwork.blocked, true);
  clock.advance(15 * MIN + 1000);
  assert.equal((await throttle.check(keysFor(victim, '198.51.100.99'))).blocked, false);
});

test('login correto zera o contador do par e marca a rede como conhecida', async () => {
  const { throttle, keysFor, wrongAttempt, store } = setup();
  for (let i = 0; i < 4; i++) await wrongAttempt('aluno@x.test', '203.0.113.9');
  await throttle.recordSuccess(keysFor('aluno@x.test', '203.0.113.9'));
  assert.equal(store.rows.has(keysFor('aluno@x.test', '203.0.113.9').pair), false);
  for (let i = 0; i < 4; i++) assert.equal((await wrongAttempt('aluno@x.test', '203.0.113.9')).blocked, false);
  assert.equal((await throttle.check(keysFor('aluno@x.test', '203.0.113.9'))).trusted, true);
});

test('rede conhecida NÃO escapa do limite por par nem do limite por IP', async () => {
  const { throttle, keysFor, wrongAttempt } = setup();
  await throttle.recordSuccess(keysFor('aluno@x.test', '203.0.113.9'));
  for (let i = 0; i < 5; i++) await wrongAttempt('aluno@x.test', '203.0.113.9');
  const gate = await throttle.check(keysFor('aluno@x.test', '203.0.113.9'));
  assert.equal(gate.blocked, true);
  assert.equal(gate.scope, 'pair');
});

/* ------------------------------------------------------------------ */
/* 2. Falha aberta, chaves e IP                                       */
/* ------------------------------------------------------------------ */

test('se o controle falhar, o login continua e o erro é registrado', async () => {
  const logs = [];
  const broken = {
    peek: async () => { throw new Error('tabela indisponível'); },
    hit: async () => { throw new Error('tabela indisponível'); },
    touch: async () => { throw new Error('tabela indisponível'); },
    clear: async () => { throw new Error('tabela indisponível'); },
  };
  const throttle = createLoginThrottle({ store: broken, log: (...a) => logs.push(a.join(' ')) });
  const keys = throttleKeys({ ip: '203.0.113.9', email: 'a@x.test', secret: SECRET });
  assert.equal((await throttle.check(keys)).blocked, false);
  assert.equal((await throttle.recordFailure(keys)).blocked, false);
  await throttle.recordSuccess(keys);
  assert.equal(logs.length, 3);
});

test('chaves são hash: sem e-mail nem IP em claro, estáveis e dependentes do segredo', () => {
  const keys = throttleKeys({ ip: '203.0.113.9', email: 'Aluno@X.test', secret: SECRET });
  const joined = Object.values(keys).join(' ');
  assert.equal(/aluno|x\.test|203\.0\.113/i.test(joined), false);
  assert.deepEqual(keys, throttleKeys({ ip: '203.0.113.9', email: ' aluno@x.TEST ', secret: SECRET }));
  assert.notDeepEqual(keys, throttleKeys({ ip: '203.0.113.9', email: 'aluno@x.test', secret: SECRET + 'x' }));
  assert.equal(new Set(Object.values(keys)).size, 4);
  assert.throws(() => throttleKeys({ ip: '1.1.1.1', email: 'a@x.test', secret: 'curto' }));
});

test('IP do cliente: prioridade dos cabeçalhos, IPv6 por /64, lixo vira "unknown"', () => {
  const req = (headers, remote) => ({ headers, socket: { remoteAddress: remote } });
  assert.equal(clientIp(req({ 'x-vercel-forwarded-for': '203.0.113.9', 'x-forwarded-for': '1.2.3.4' })), '203.0.113.9');
  assert.equal(clientIp(req({ 'x-real-ip': '203.0.113.8' })), '203.0.113.8');
  assert.equal(clientIp(req({ 'x-forwarded-for': '203.0.113.7, 10.0.0.1' })), '203.0.113.7');
  assert.equal(clientIp(req({}, '203.0.113.6')), '203.0.113.6');
  assert.equal(clientIp(req({ 'x-forwarded-for': ['203.0.113.5, 10.0.0.1'] })), '203.0.113.5');
  assert.equal(clientIp(req({ 'x-forwarded-for': 'não-é-ip' })), 'unknown');
  assert.equal(clientIp(req({})), 'unknown');

  // Dois endereços do mesmo /64 são a mesma "rede"; /64 diferentes, não.
  const a = normalizeIp('2001:db8:abcd:12:1111:2222:3333:4444');
  const b = normalizeIp('2001:DB8:abcd:12::9');
  const c = normalizeIp('2001:db8:abcd:13::9');
  assert.equal(a, '2001:0db8:abcd:0012::/64');
  assert.equal(a, b);
  assert.notEqual(a, c);
  assert.equal(normalizeIp('::ffff:203.0.113.4'), '203.0.113.4');
  assert.equal(normalizeIp('203.0.113.4:5050'), '203.0.113.4');
  assert.equal(normalizeIp('[2001:db8::1]'), '2001:0db8:0000:0000::/64');
  assert.equal(normalizeIp('::1'), '0000:0000:0000:0000::/64');
  assert.equal(normalizeIp('999.1.1.1'), '');
});

test('mensagem de bloqueio orienta sem revelar se a conta existe', () => {
  assert.match(throttleMessage(45), /Aguarde 1 minuto e/);
  assert.match(throttleMessage(15 * 60), /Aguarde 15 minutos e/);
  assert.match(throttleMessage(600), /administrador/);
  assert.equal(/conta (foi )?bloqueada|não existe/i.test(throttleMessage(600)), false);
});

/* ------------------------------------------------------------------ */
/* 3. Handler real (api/auth.js) contra um Neon simulado              */
/* ------------------------------------------------------------------ */

const PASSWORD = 'senha-correta-123';
const HASH = hashPassword(PASSWORD);
const sim = { users: new Map(), throttle: new Map(), brokenThrottle: false };

function addUser(email) {
  sim.users.set(email, { user_id: 'id-' + email, name: 'Aluno', email, role: 'aluno', password_hash: HASH, active: true, session_version: 1 });
}

function neonReply(columns, rows) {
  return new Response(JSON.stringify({
    command: 'SELECT',
    rowCount: rows.length,
    fields: columns.map(([name, dataTypeID]) => ({ name, dataTypeID })),
    rows,
  }), { status: 200, headers: { 'content-type': 'application/json' } });
}

const THROTTLE_COLS = [['key', 25], ['count', 23], ['age_ms', 701]];
const entryRow = (key, e) => [key, String(e.count), String(Date.now() - e.start)];

globalThis.fetch = async (_url, init) => {
  const { query, params } = JSON.parse(init.body);
  const q = query.replace(/\s+/g, ' ').trim();
  const touchesThrottle = q.includes('central_login_throttle');

  if (touchesThrottle && sim.brokenThrottle) return new Response('boom', { status: 500 });

  if (/^(CREATE|ALTER)/i.test(q)) return neonReply([], []);

  if (q.startsWith('SELECT key, count')) {
    const keys = String(params[0]).replace(/^\{|\}$/g, '').split(',').map((k) => k.replace(/^"|"$/g, ''));
    return neonReply(THROTTLE_COLS, keys.filter((k) => sim.throttle.has(k)).map((k) => entryRow(k, sim.throttle.get(k))));
  }
  if (q.startsWith('INSERT INTO central_login_throttle AS t')) {
    const key = params[0];
    const e = sim.throttle.get(key);
    if (!e || Date.now() - e.start >= Number(params[1]) * 1000) sim.throttle.set(key, { count: 1, start: Date.now() });
    else e.count++;
    return neonReply(THROTTLE_COLS.slice(1), [[String(sim.throttle.get(key).count), '0']]);
  }
  if (q.startsWith('INSERT INTO central_login_throttle (key')) {
    sim.throttle.set(params[0], { count: 1, start: Date.now() });
    return neonReply([], []);
  }
  if (q.startsWith('DELETE FROM central_login_throttle WHERE key')) {
    sim.throttle.delete(params[0]);
    return neonReply([], []);
  }
  if (q.startsWith('DELETE FROM central_login_throttle')) return neonReply([], []);

  if (q.startsWith('SELECT user_id,name,email,role,password_hash')) {
    const u = sim.users.get(params[0]);
    return neonReply(
      [['user_id', 25], ['name', 25], ['email', 25], ['role', 25], ['password_hash', 25], ['active', 16], ['session_version', 23]],
      u ? [[u.user_id, u.name, u.email, u.role, u.password_hash, u.active ? 't' : 'f', String(u.session_version)]] : [],
    );
  }
  if (q.startsWith('UPDATE central_users')) return neonReply([], []);
  throw new Error('consulta não prevista no simulador: ' + q.slice(0, 80));
};

const { default: authHandler } = await import('../api/auth.js');

async function login(email, password, ip) {
  const headers = { host: 'central.example.test', 'sec-fetch-site': 'same-origin' };
  if (ip) headers['x-vercel-forwarded-for'] = ip;
  const req = { method: 'POST', query: { action: 'login' }, headers, body: { email, password } };
  const out = { status: 0, headers: {}, body: null };
  const res = {
    statusCode: 200,
    setHeader(name, value) { out.headers[name.toLowerCase()] = value; },
    end(text) { out.status = this.statusCode; out.body = JSON.parse(text); },
  };
  await authHandler(req, res);
  return out;
}

test.beforeEach(() => {
  sim.users.clear();
  sim.throttle.clear();
  sim.brokenThrottle = false;
});

test('handler: errar a senha de outra pessoa não a tranca fora da própria rede', async () => {
  addUser('vitima@x.test');
  const attackerIp = '203.0.113.66';
  const homeIp = '198.51.100.7';

  for (let i = 1; i <= 4; i++) {
    const r = await login('vitima@x.test', 'errada', attackerIp);
    assert.equal(r.status, 401);
    assert.equal(r.body.error, 'E-mail ou senha inválidos');
  }
  const fifth = await login('vitima@x.test', 'errada', attackerIp);
  assert.equal(fifth.status, 429);
  assert.ok(Number(fifth.headers['retry-after']) > 0);
  assert.match(fifth.body.error, /Muitas tentativas de login/);

  // Mesmo com a senha certa, a rede do atacante segue barrada ...
  assert.equal((await login('vitima@x.test', PASSWORD, attackerIp)).status, 429);
  // ... e o dono da conta entra normalmente pela rede dele.
  const owner = await login('vitima@x.test', PASSWORD, homeIp);
  assert.equal(owner.status, 200);
  assert.match(owner.headers['set-cookie'], /bc_session=.*HttpOnly; Secure; SameSite=Lax/);
});

test('handler: e-mail inexistente e senha errada respondem igual e contam do mesmo jeito', async () => {
  addUser('existe@x.test');
  const ip = '203.0.113.70';
  const unknown = await login('naoexiste@x.test', 'errada', ip);
  const wrong = await login('existe@x.test', 'errada', ip);
  assert.equal(unknown.status, 401);
  assert.deepEqual(unknown.body, wrong.body);

  for (let i = 0; i < 3; i++) await login('naoexiste@x.test', 'errada', ip);
  const blocked = await login('naoexiste@x.test', 'errada', ip);
  assert.equal(blocked.status, 429, 'também bloqueia contas que não existem, sem revelar nada');
});

test('handler: 20 erros de uma rede em contas diferentes bloqueiam a rede, não as outras', async () => {
  for (let i = 0; i < THROTTLE_LIMITS.perIp; i++) addUser('c' + i + '@x.test');
  addUser('novo@x.test');
  const ip = '203.0.113.80';
  let last;
  for (let i = 0; i < THROTTLE_LIMITS.perIp; i++) last = await login('c' + i + '@x.test', 'errada', ip);
  assert.equal(last.status, 429);
  assert.equal((await login('novo@x.test', PASSWORD, ip)).status, 429);
  assert.equal((await login('novo@x.test', PASSWORD, '203.0.113.81')).status, 200);
});

test('handler: ataque de 30 redes barra rede nova, mas o dono (rede conhecida) entra', async () => {
  addUser('dono@x.test');
  const home = '198.51.100.7';
  assert.equal((await login('dono@x.test', PASSWORD, home)).status, 200);

  // As 29 primeiras falhas (uma por rede) respondem 401; a 30ª atinge o limite da conta
  // e já recebe o aviso de espera, do mesmo jeito que a 5ª falha de um par.
  const last = THROTTLE_LIMITS.perAccountAny;
  for (let i = 1; i < last; i++) {
    assert.equal((await login('dono@x.test', 'errada', '192.0.2.' + i)).status, 401, 'falha ' + i);
  }
  assert.equal((await login('dono@x.test', 'errada', '192.0.2.' + last)).status, 429, 'a falha que atinge o limite');

  assert.equal((await login('dono@x.test', PASSWORD, '192.0.2.250')).status, 429, 'rede desconhecida barrada, até com a senha certa');
  assert.equal((await login('dono@x.test', 'errada', home)).status, 401, 'um erro de digitação do dono, em rede conhecida, não vira bloqueio');
  assert.equal((await login('dono@x.test', PASSWORD, home)).status, 200, 'rede conhecida continua entrando');
});

test('handler: se a tabela de controle falhar, quem tem a senha certa ainda entra', async () => {
  addUser('aluno@x.test');
  sim.brokenThrottle = true;
  assert.equal((await login('aluno@x.test', PASSWORD, '203.0.113.90')).status, 200);
  assert.equal((await login('aluno@x.test', 'errada', '203.0.113.90')).status, 401);
});

test('handler: conta desativada continua recebendo a mensagem própria', async () => {
  addUser('off@x.test');
  sim.users.get('off@x.test').active = false;
  const r = await login('off@x.test', PASSWORD, '203.0.113.95');
  assert.equal(r.status, 403);
});
