import fs from 'node:fs';
import vm from 'node:vm';
import {leiRuntime} from './lei-em-dia-runtime.mjs';
const root=new URL('../',import.meta.url);
const read=p=>fs.readFileSync(new URL(p,root),'utf8');
const ctx=leiRuntime(root);
const data=vm.runInContext('DATA',ctx);
const approved=vm.runInContext('DATA_LED_APPROVED',ctx);
const idx=vm.runInContext('CENTRAL_LAW_MODULES',ctx);
const modules=[...idx.modules,...idx.complement];
const byId=new Map(data.map(q=>[q.id,q]));
const refs=new Map();
for(const m of modules)for(const id of m.questionIds){if(!refs.has(id))refs.set(id,[]);refs.get(id).push(m.id);}
const missing=[...refs].filter(([id])=>!byId.has(id));
const wrong=[...modules].flatMap(m=>m.questionIds.filter(id=>byId.has(id)&&byId.get(id).discipline!==m.discipline).map(id=>({id,module:m.id,expected:m.discipline,actual:byId.get(id).discipline})));
const uncovered=data.filter(q=>!refs.has(q.id));
console.log('DIAGNOSTIC_RESULT',JSON.stringify({
dataCount:data.length, approvedCount:approved.length, indexVersion:idx.version,
modulesCount:idx.modules.length,complementCount:idx.complement.length,
disciplineCounts:Object.entries(Object.groupBy(data,q=>q.discipline)).map(([k,v])=>[k,v.length]),
missingCount:missing.length,missingByDiscipline:Object.entries(Object.groupBy(missing,([id])=>id.split('-')[0])).map(([k,v])=>[k,v.length]),
missingSamples:missing.slice(0,14).map(([id,m])=>({id,modules:m})),wrongCount:wrong.length,wrongSamples:wrong.slice(0,12),
uncoveredCount:uncovered.length,uncoveredSamples:uncovered.slice(0,8).map(q=>({id:q.id,discipline:q.discipline})),
reportModules:JSON.parse(read('audits/lei-em-dia-sincronizacao-20261009.json')).modules.length,
currentOfflineModuleManifest:JSON.parse(read('central-offline-files-v66172.json')).files.filter(x=>x.includes('decorando-data-modulos')),
availableManifestEntries:JSON.parse(read('central-offline-files-v66172.json')).files.filter(x=>x.includes('decorando')).length
}));
for(const m of idx.modules){
 const c=leiRuntime(root);
 vm.runInContext('centralOpenModule('+JSON.stringify(m.id)+','+JSON.stringify(m.discipline)+',true)',c);
 const got=vm.runInContext('visible()',c).map(q=>q.id);
 const expect=m.questionIds;
 const actualSet=new Set(got),expectedSet=new Set(expect);
 const missingM=expect.filter(id=>!actualSet.has(id)),extraM=got.filter(id=>!expectedSet.has(id));
 if(missingM.length||extraM.length)console.log('MODULE_DIFF',JSON.stringify({id:m.id,expected:expect.length,actual:got.length,missing:missingM.slice(0,8),extra:extraM.slice(0,8)}));
}
