import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync, readdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const read=p=>readFileSync(path.join(root,p),'utf8');
const modules=[
 'ui/current-courses.js','ui/civil-native-study-v1.js','ui/adm-native-layer.js',
 'ui/cpp-native-study-v1.js','ui/cf-native-study-v2.js','ui/rlm-native-v1.js',
 'ui/approved-cpc-layout-v1.js','ui/discipline-standard.js',
 'ui/native-study-reader.js','ui/native-module-m01-shell.js',
 'ui/native-module-m02-shell.js','ui/portuguese-reader.js',
 'base-completa-visual-v1.js','central-structural-v66119/runtime.js'
];
test('os geradores principais não oferecem cartões, atalhos ou telas de infográficos',()=>{
 for(const file of modules){
  const code=read(file);
  assert.doesNotMatch(code,/infogr[aá]fic|mapa mental|mindmap|BaseMindMap|openMap\(/i,file);
 }
});
test('nenhuma imagem de infográfico é publicada como arquivo do projeto',()=>{
 for(const dir of ['assets/cf','assets/cpp','assets/adm','assets/portugues-infograficos']){
  const base=path.join(root,dir);
  if(!existsSync(base))continue;
  assert.equal(readdirSync(base).some(x=>/infograf/i.test(x)),false,dir);
 }
});
test('a conclusão de CF não depende da etapa de mapa e RLM segue das questões ao próximo módulo',()=>{
 const cf=read('ui/cf-native-study-v2.js'),rlm=read('ui/rlm-native-v1.js');
 assert.match(cf,/Math\.round\(done\/6\*100\)/);
 assert.match(rlm,/const order=\['theory','recap','quiz'\]/);
});
