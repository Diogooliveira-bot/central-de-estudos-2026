import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
const read=path=>readFile(new URL('../'+path,import.meta.url),'utf8');
test('o painel de planos é administrativo e não cobra automaticamente',async()=>{
 const [page,middleware,users]=await Promise.all([read('planos.html'),read('middleware.js'),read('usuarios.html')]);
 assert.match(page,/api\/plans\?action=admin/);
 assert.match(page,/6 meses/);
 assert.match(page,/12 meses/);
 assert.match(page,/não realiza cobranças/);
 assert.match(page,/planCode:'free'/);
 assert.match(page,/planCode:'premium'/);
 assert.match(page,/identity\.user\?\.role!=='admin'/);
 assert.match(middleware,/planos\.html/);
 assert.match(users,/href="\/planos\.html"/);
});
