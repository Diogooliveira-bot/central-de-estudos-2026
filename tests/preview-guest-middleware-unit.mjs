import assert from 'node:assert/strict';
import test from 'node:test';

const token='preview-guest-token-for-isolated-tests-0123456789abcdef';
process.env.VERCEL_ENV='preview';
process.env.BC_PREVIEW_GUEST_TOKEN=token;

const {default:middleware}=await import('../middleware.js?preview-guest-static-assets');
const headers={cookie:'bc_preview_guest='+encodeURIComponent(token)};

test('Preview guest reads course assets but cannot write or call data APIs',async()=>{
  const read=await middleware(new Request('https://preview.test/content/cf/m03-native-data.js',{
    method:'GET',headers,
  }));
  assert.notEqual(read.status,403,'Hosted discipline asset must remain readable in private Preview');

  const head=await middleware(new Request('https://preview.test/content/cpc-study-m20-lite.js',{
    method:'HEAD',headers,
  }));
  assert.notEqual(head.status,403,'HEAD is required for safe asset checks');

  const write=await middleware(new Request('https://preview.test/content/cf/m03-native-data.js',{
    method:'POST',headers,
  }));
  assert.equal(write.status,403,'Guest cannot mutate a protected path');

  const sync=await middleware(new Request('https://preview.test/api/sync',{method:'GET',headers}));
  assert.equal(sync.status,403,'Guest cannot read student data APIs');

  const me=await middleware(new Request('https://preview.test/api/auth?action=me',{method:'GET',headers}));
  assert.notEqual(me.status,403,'Synthetic identity endpoint remains the sole guest API');
});

test('Without the private Preview cookie, protected assets retain entitlement routing',async()=>{
  const response=await middleware(new Request('https://preview.test/content/cf/m03-native-data.js'));
  assert.equal(response.status,307);
  assert.match(response.headers.get('location')||'',/\/api\/private-content/);
});
