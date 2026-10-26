import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import vm from 'node:vm';
import assert from 'node:assert/strict';
import {projectPackedSummary,projectAdminSummary,projectFreeSummary} from '../lib/protected-content.js';
function read(path){return readFileSync(path,'utf8')}
function context(source){const g={};g.window=g;g.global=g;vm.runInNewContext(source,g,{timeout:1800});return g}
for(const id of ['cf','penal','cpc']){
  const g=context(read('content/'+id+'/m01-native-data.js'));
  const record=g.BASE_NATIVE_CONTENT?.[id]?.m01;
  assert.ok(record,'missing real native module '+id+' m01');
  const safe=projectFreeSummary(record);
  assert.ok(safe?.summary?.length>100,'missing real summary '+id);
  assert.ok(!('questions' in safe),'question data in free summary '+id);
  console.log('FREE_NATIVE_OK',id,safe.summary.length);
}
const adm=context(read('content/adm/m01-native-data-lite.js'));
const a=projectAdminSummary(adm.ADM_NATIVE_CONTENT);
assert.ok(a&&Object.values(a)[0]?.summaryHtml?.length>100,'missing real ADM summary');
console.log('FREE_ADM_OK',Object.keys(a).length);
for(const id of ['civil','cpp']){
  const name=id.toUpperCase()+'_NATIVE_PACKED_B64';
  const raw=context(read('content/'+id+'/'+id+'-native-content-packed.js'))[name];
  assert.ok(raw&&raw.length>1000,'missing compressed '+id);
  const full=JSON.parse(gunzipSync(Buffer.from(raw,'base64')).toString('utf8'));
  const projected=projectPackedSummary(full);
  const keys=Object.keys(projected||{});
  console.log('FREE_PACKED_STRUCTURE',id,Object.keys(full).slice(0,8),keys.slice(0,8));
  assert.ok(keys.length>=10,id+' packed summaries not available');
  assert.ok(keys.every(key=>projected[key]?.summaryHtml?.length>100),id+' empty free summary');
  assert.ok(keys.every(key=>!JSON.stringify(projected[key]).includes('answer:')),id+' projected answers');
  console.log('FREE_PACKED_OK',id,keys.length);
}
