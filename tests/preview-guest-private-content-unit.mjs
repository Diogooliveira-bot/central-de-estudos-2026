import assert from 'node:assert/strict';
import test from 'node:test';

const token='preview-guest-token-for-isolated-tests-0123456789abcdef';
process.env.VERCEL_ENV='preview';
process.env.BC_PREVIEW_GUEST_TOKEN=token;

const {default:handlePrivateContent,isPreviewGuestRequest}=await import('../lib/private-content-handler.js?preview-guest-transport');

function responseRecorder(){
  const headers=new Map();
  return {
    statusCode:0, body:null,
    setHeader(name,value){headers.set(String(name).toLowerCase(),String(value));},
    getHeader(name){return headers.get(String(name).toLowerCase());},
    end(value){this.body=value;},
  };
}

test('private Preview guest cookie is validated without a database account',()=>{
  assert.equal(isPreviewGuestRequest({headers:{cookie:'bc_preview_guest='+encodeURIComponent(token)}}),true);
  assert.equal(isPreviewGuestRequest({headers:{cookie:'bc_preview_guest=invalid-token'}}),false);
});

test('private Preview transport serves a protected bundle read-only without database access',async()=>{
  const req={
    method:'GET',
    headers:{cookie:'bc_preview_guest='+encodeURIComponent(token)},
    query:{asset:'/content/cf/m01-native-data.js'},
  };
  const res=responseRecorder();
  await handlePrivateContent(req,res);
  assert.equal(res.statusCode,200);
  assert.match(res.getHeader('content-type'),/javascript/);
  assert.match(String(res.body),/BASE_NATIVE_CONTENT/);
  assert.match(res.getHeader('cache-control'),/no-store/);
});
