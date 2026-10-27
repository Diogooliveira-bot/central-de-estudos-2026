import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
const read=p=>readFileSync(new URL('../'+p,import.meta.url),'utf8');
const penal=read('ui/native-study-reader.js');
const cpc=read('ui/cpc-native-study-reader.js');
const premium=read('ui/legal-complete-premium-v1.css');
const a=read('ui/legal-complete-premium-v1.js');
const legacy=read('content/adm/m03-approved-complete.js');
test('Penal M01 completo utiliza leitor existente e atributo apenas transitório',()=>{
 assert.match(penal,/const OVERLAY_ID='bcNativeReaderOverlay'/);
 assert.match(penal,/if\(mode==='complete'\)ov\.dataset\.bcPremiumPilot='penal-m01'/);
 assert.match(penal,/setChapterDone\(mode,id,!chapterDone\(mode,id\)\)/);
 assert.match(penal,/localStorage\.setItem\(storageKey\('chapter:/);
});
test('CPC M01 completo utiliza leitor existente e atributo apenas transitório',()=>{
 assert.match(cpc,/const OVERLAY_ID='cpcNativeReaderOverlay'/);
 assert.match(cpc,/if\(mode==='complete'\)ov\.dataset\.bcPremiumPilot='cpc-m01'/);
 assert.match(cpc,/setChapterDone\(mode,id,!chapterDone\(mode,id\)\)/);
 assert.match(cpc,/localStorage\.setItem\(key\('chapter:/);
});
test('CSS exclusivo dos dois pilotos e ativa quando Premium autorizado',()=>{
 const suffix=premium.split('/* ETAPA-3-PILOTOS-PENAL-CPC-20261027 */')[1];
 assert.ok(suffix?.length>500,'CSS de pilotos não encontrado');
 assert.match(suffix,/#bcNativeReaderOverlay\.bc-apostila-v1\[data-bc-premium-pilot="penal-m01"\]/);
 assert.match(suffix,/#cpcNativeReaderOverlay\.bc-apostila-v1\[data-bc-premium-pilot="cpc-m01"\]/);
 assert.doesNotMatch(suffix,/adm-native-reader|adm-m03|pt-native-reader|rlm/i);
 assert.match(a,/readerMode\(overlay\) === 'complete'/);
 assert.match(a,/if \(!overlay \|\| overlay\.nodeType !== 1 \|\| overlay\.matches\('\.pt-native-reader,\.bc-rlm-overlay'\)\)/);
});
test('ADM M03 visual aprovado preservado byte-a-byte',()=>{
 // O bloco original termina com uma quebra de linha. Os pilotos foram anexados, sem reescrita.
 const old=premium.split('/* ETAPA-3-PILOTOS-PENAL-CPC-20261027 */')[0].trimEnd()+'\n';
 const hash=createHash('sha1').update('blob '+Buffer.byteLength(old)+'\0').update(old).digest('hex');
 assert.equal(hash,'1c5a69dab65b17506cbd6aa99f1d07bd7b026b03');
 assert.match(legacy,/DIREITO ADMINISTRATIVOMÓDULO 03/);
});
test('bust de cache explicitamente carregado e sem edição de conteúdos jurídicos',()=>{
 assert.match(read('central-v119.html'),/ui\/native-study-reader\.js\?v=20261027pilotPenalCpc1/);
 assert.match(read('central-v119.html'),/ui\/legal-complete-premium-v1\.css\?v=20261027cpcM01reflow1/);
 assert.match(read('index.html'),/ui\/cpc-native-study-reader\.js\?v=20261027cpcM01reflow1/);
 for(const p of ['content/penal/m01-native-data.js','content/cpc/m01-native-data.js'])assert.ok(read(p).length>30000);
});