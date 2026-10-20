import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { webcrypto } from 'node:crypto';
import { authorizeAdminOnlyInfographicRequest } from '../middleware.js';
import { isAdminOnlyInfographicPath, normalizeAdminInfographicPath } from '../lib/admin-infographics.js';
import { createAdminInfographicHandler } from '../lib/admin-infographic-handler.js';
import { shouldRunInfographicMigration } from '../scripts/migrate-admin-infographics-preview.mjs';

if (!globalThis.crypto) Object.defineProperty(globalThis, 'crypto', { value: webcrypto });
const secret = 'unit-test-only-auth-secret-that-is-long-enough';
process.env.AUTH_SECRET = secret;
const read = (file) => fs.readFileSync(new URL('../' + file, import.meta.url), 'utf8');

async function cookieFor(role) {
  const payload = Buffer.from(JSON.stringify({
    v: 1, uid: 'unit-user', role, sv: 1, exp: Math.floor(Date.now() / 1000) + 3600
  })).toString('base64url');
  const key = await webcrypto.subtle.importKey('raw', new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const signature = await webcrypto.subtle.sign('HMAC', key, new TextEncoder().encode(payload));
  return 'bc_session=' + payload + '.' + Buffer.from(signature).toString('base64url');
}

test('classifica arquivos estáticos e pacote de imagens como material visual protegido', () => {
  const paths = [
    '/assets/adm/infograficos-sprite.avif',
    '/assets/cf/m01-infografico.webp',
    '/assets/cf/m07-infografico-v2.svg',
    '/assets/portugues-infograficos/m24.webp',
    '/assets/ptra/m21/infografico.avif',
    '/modules/trabalho/native/infograficos/m18.webp',
    '/content/civil/civil-native-images.js'
  ];
  for (const path of paths) assert.equal(isAdminOnlyInfographicPath(path), true, path);
  assert.equal(isAdminOnlyInfographicPath('/content/civil/civil-native-content-packed.js'), false);
  assert.equal(isAdminOnlyInfographicPath('/assets/base-completa-symbol.webp'), false);
});

test('sem sessão, aluno e editor recebem 403 no verificador de permissão', async () => {
  const noSession = await authorizeAdminOnlyInfographicRequest(new Request('https://preview.test/assets/cf/m01-infografico.webp'));
  assert.equal(noSession.status, 403);
  assert.match(noSession.headers.get('cache-control'), /no-store/);
  for (const role of ['aluno', 'editor']) {
    const cookie = await cookieFor(role);
    const denied = await authorizeAdminOnlyInfographicRequest(new Request('https://preview.test/assets/cf/m01-infografico.webp', {
      headers: { cookie }
    }));
    assert.equal(denied.status, 403, role);
  }
});

test('administrador autenticado é aceito pelo verificador do servidor', async () => {
  const cookie = await cookieFor('admin');
  const result = await authorizeAdminOnlyInfographicRequest(new Request('https://preview.test/assets/cf/m01-infografico.webp', {
    headers: { cookie }
  }));
  assert.equal(result, null);
});

test('a interface oculta cards, visualizadores, mapas e controles antes do login', () => {
  const css = read('ui/admin-infographics-access-v1.css');
  const js = read('ui/admin-infographics-access-v1.js');
  assert.match(css, /html:not\(\[data-bc-role="admin"\]\)/);
  for (const selector of ['.adm-cf-card-map', '.cf-study-map', '.cv-card-infographic', '[data-kind="infographic"]', '[data-native-kind="mindmap"]', '[data-ptra-image]']) {
    assert.ok(css.includes(selector) || js.includes(selector), selector);
  }
  assert.match(js, /base-completa-auth-ready/);
  assert.match(js, /stopImmediatePropagation/);
  assert.doesNotMatch(js, /\.cf-study-card,\.cv-standard-card,\.ptra-native-card,article,figure/);
  assert.match(js, /bcAdminInfographicWasHidden/);
});

test('o PWA não guarda nem serve cópias offline de infográficos', () => {
  const sw = read('sw.js');
  assert.match(sw, /function isAdminOnlyInfographicPath/);
  assert.match(sw, /purgeInfographicCacheEntries/);
  assert.match(sw, /skippedProtected/);
  assert.match(sw, /if\(request\.method==='GET'&&isAdminOnlyInfographicPath\(url\.pathname\)\)/);
});

test('a Central carrega a camada visual e o offline mantém seus arquivos', () => {
  const central = read('central-v119.html');
  const manifest = JSON.parse(read('central-offline-files-v66172.json'));
  assert.match(central, /admin-infographics-access-v1\.css\?v=20261020admininfographics1/);
  assert.match(central, /admin-infographics-access-v1\.js\?v=20261020admininfographics1/);
  assert.ok(manifest.files.includes('/ui/admin-infographics-access-v1.css?v=20261020admininfographics1'));
  assert.ok(manifest.files.includes('/ui/admin-infographics-access-v1.js?v=20261020admininfographics1'));
});

test('rotas dos infográficos só normalizam caminhos catalogados', () => {
  assert.equal(normalizeAdminInfographicPath('/assets/cf/m01-infografico.webp'), 'assets/cf/m01-infografico.webp');
  assert.equal(normalizeAdminInfographicPath('/content/civil/civil-native-images.js'), 'content/civil/civil-native-images.js');
  assert.equal(normalizeAdminInfographicPath('/api/auth?action=me'), null);
  assert.equal(normalizeAdminInfographicPath('/assets/../api/auth'), null);
});

test('API nega aluno antes de buscar dados e transmite bytes somente a administrador', async () => {
  let reads = 0;
  const deniedResponse = { headers:{}, setHeader(k,v){this.headers[k]=v}, end(body){this.body=body} };
  const deniedHandler = createAdminInfographicHandler({
    authorize: async () => ({ok:false,status:403,error:'Você não tem permissão'}),
    readAsset: async () => { reads++; return [] }
  });
  await deniedHandler({method:'GET',query:{path:'/assets/cf/m01-infografico.webp'}},deniedResponse);
  assert.equal(deniedResponse.statusCode,403);
  assert.equal(reads,0);
  assert.match(deniedResponse.headers['Cache-Control'],/no-store/);

  const payload = Buffer.from([0,1,2,250,255]);
  const allowedResponse = { headers:{}, setHeader(k,v){this.headers[k]=v}, end(body){this.body=body} };
  const allowedHandler = createAdminInfographicHandler({
    authorize: async () => ({ok:true,sql:{}}),
    readAsset: async (_sql,key) => { reads++; assert.equal(key,'assets/cf/m01-infografico.webp'); return [{content_type:'image/webp',content:payload,byte_length:payload.length}] }
  });
  await allowedHandler({method:'GET',query:{path:'/assets/cf/m01-infografico.webp'}},allowedResponse);
  assert.equal(allowedResponse.statusCode,200);
  assert.deepEqual(allowedResponse.body,payload);
  assert.equal(allowedResponse.headers['Content-Type'],'image/webp');
  assert.match(allowedResponse.headers['Cache-Control'],/no-store/);
  assert.equal(reads,1);
});

test('a carga automática só pode escrever na Preview da branch e no Neon de homologação', () => {
  const preview = {
    VERCEL_ENV:'preview',
    VERCEL_GIT_COMMIT_REF:'integration/objetivos-prod-20261020',
    VERCEL_GIT_REPO_OWNER:'Diogooliveira-bot',
    VERCEL_GIT_REPO_SLUG:'central-de-estudos-2026'
  };
  assert.equal(shouldRunInfographicMigration(preview),true);
  assert.equal(shouldRunInfographicMigration({...preview,VERCEL_ENV:'production'}),false);
  assert.equal(shouldRunInfographicMigration({...preview,VERCEL_GIT_COMMIT_REF:'main'}),false);
  assert.equal(shouldRunInfographicMigration({...preview,VERCEL_GIT_REPO_OWNER:'attacker'}),false);
});

test('manifest inventoriza 82 imagens e o pacote adicional de imagens civis', () => {
  const manifest = JSON.parse(read('content/admin-infographics-manifest.json'));
  const staticImages = manifest.assets.filter(asset => asset.path !== 'content/civil/civil-native-images.js');
  assert.equal(staticImages.length, 82);
  assert.equal(manifest.assets.length, 83);
  assert.equal(manifest.assets.reduce((sum,asset)=>sum+asset.size,0),13668895);
  assert.ok(manifest.assets.every(asset => isAdminOnlyInfographicPath('/'+asset.path)), 'cada arquivo precisa estar coberto pela barreira do servidor');
});

test('o PWA mantém a política sem cache para os novos caminhos de imagens protegidos', () => {
  const sw = read('sw.js');
  assert.match(sw, /if\(request\.method==='GET'&&isAdminOnlyInfographicPath\(url\.pathname\)\)/);
  assert.match(sw, /event\.respondWith\(fetch\(request,\{cache:'no-store'\}\)\.catch\(function\(\)\{return Response\.error\(\)\}\)\)/);
});

test('a migração rejeita ambiente errado antes de qualquer gravação', () => {
  const script = read('scripts/migrate-admin-infographics-preview.mjs');
  assert.match(script, /current_setting\('neon\.project_id'/);
  assert.match(script, /current_setting\('neon\.branch_id'/);
  assert.match(script, /identity\.project_id!==manifest\.expectedNeonProject/);
  assert.match(script, /identity\.branch_id!==manifest\.expectedNeonBranch/);
  assert.match(script, /fromGitBlobSha\(bytes\)!==asset\.gitBlobSha/);
});
