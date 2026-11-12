import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const read=p=>readFileSync(path.join(root,p),'utf8');
test('exportador de imagens e mapas não são mais carregados na Central',()=>{
 const boot=read('central-v119.html'),files=JSON.parse(read('central-offline-files-v66172.json')).files;
 assert.doesNotMatch(boot,/module-image-export-v1|hide-infographics-v1/);
 for(const file of ['ui/module-image-export-v1.js','ui/mind-map.js','ui/mind-map.css','ui/hide-infographics-v1.js'])assert.equal(existsSync(path.join(root,file)),false,file);
 assert.equal(files.some(x=>/infograf|mind-map|module-image-export|hide-infographics/i.test(x)),false);
});
