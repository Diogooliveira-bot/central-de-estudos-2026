import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

const root = new URL('../',import.meta.url);
const boot = readFileSync(new URL('central-v119.html',root),'utf8');
const loader = readFileSync(new URL('central-discipline-loader.js',root),'utf8');
const start = boot.indexOf('function isPremiumOnlyScript(src){');
const end = boot.indexOf(' function tag(src)',start);
assert.ok(start>=0&&end>start,'filtro de arquivos protegido precisa existir no boot');
const policy = vm.runInNewContext('('+boot.slice(start,end).trim()+')');
assert.match(boot,/window\.__centralIsFreeStudent='\+JSON\.stringify\(freeStudent\)/);
assert.match(boot,/window\.__centralIsPremiumOnlyScript='\+String\(isPremiumOnlyScript\)/);

test('manifesto antigo inclui arquivos Premium e não pode ser utilizado inteiro pelo Gratuito',()=>{
 for(const path of [
  'content/civil/civil-sharing-links.js?v=x',
  'content/civil/m01-teoria-guiada-data.js?v=x',
  'cpc-theory-module1-v66119.js?v=x',
  'adm-m1-theory-v66141.js?v=x',
  'adm-m9-m20-bundle-v66160.js?v=x',
 ])assert.equal(policy(path),true,'Premium: '+path);
 for(const path of [
  'content/civil/civil-native-index.js?v=x',
  'ui/civil-native-study-v1.js?v=x',
  'content/cpc/m01-native-data.js?v=x',
  'content/adm/adm-native-index.js?v=x',
 ])assert.equal(policy(path),false,'permitido no manifesto: '+path);
});

function fixture({free=true,policyAvailable=true}={}){
 const calls=[];
 const win={
  __centralDisciplineFiles:{
   civil:['content/civil/civil-native-index.js','ui/civil-native-study-v1.js'],
   cpc:['content/cpc/m01-native-data.js'],
   adm:[],
  },
  CentralTheoryFiles:{
   civil:['content/civil/civil-native-index.js?v=legacy','content/civil/civil-sharing-links.js','ui/civil-native-study-v1.js'],
   cpc:['cpc-theory-module1-v66119.js','content/cpc/cpc-sharing-links.js'],
   adm:['adm-m1-theory-v66141.js','content/adm/adm-native-index.js','content/adm/adm-sharing-links.js'],
  },
  __centralIsFreeStudent:free,
  __centralIsPremiumOnlyScript:policyAvailable?policy:undefined,
  CivilNative:{},AdmNative:{},CpcStudyV1:{installed:true},__M08Installed:true,
 };
 for(let n=2;n<=20;n++)win['CpcStudyM'+String(n).padStart(2,'0')]={installed:true};
 const doc={
  head:{appendChild(){}},
  createElement(){return {dataset:{},remove(){},textContent:''}},
  dispatchEvent(){},
 };
 const localStorage={getItem(){return null},setItem(){}};
 const env={
  window:win,document:doc,location:{origin:'https://preview.test'},
  navigator:{serviceWorker:null},localStorage,URL,console,
  setTimeout,clearTimeout,AbortController,
  requestAnimationFrame:fn=>fn(),CustomEvent:class{constructor(type,options){this.type=type;this.detail=options?.detail}},
  fetch:async url=>{
   const path=new URL(url).pathname;calls.push(path);
   if(free&&policy(path))return {ok:false,status:403};
   return {ok:true,status:200,text:async()=>''};
  },
 };
 vm.runInNewContext(loader,env);
 return {win,calls};
}

test('Gratuito abre Civil sem solicitar sharing-links premium e elimina duplicações',async()=>{
 const {win,calls}=fixture();
 await win.CentralDisciplineLoader.load('civil');
 assert.deepEqual(calls.sort(),['/content/civil/civil-native-index.js','/ui/civil-native-study-v1.js']);
 assert.equal(win.CentralDisciplineLoader.isReady('civil'),true);
});
test('Gratuito não tenta scripts antigos pagos do CPC ou Administrativo',async()=>{
 const {win,calls}=fixture();
 await win.CentralDisciplineLoader.load('cpc');
 await win.CentralDisciplineLoader.load('adm');
 assert.ok(calls.includes('/content/cpc/m01-native-data.js'));
 assert.ok(calls.includes('/content/adm/adm-native-index.js'));
 assert.ok(!calls.some(path=>/cpc-theory-module1|adm-m1-theory|sharing-links/.test(path)),calls.join(', '));
});
test('Premium conserva acesso aos arquivos protegidos necessários',async()=>{
 const {win,calls}=fixture({free:false});
 await win.CentralDisciplineLoader.load('civil');
 assert.ok(calls.includes('/content/civil/civil-sharing-links.js'));
 assert.equal(calls.filter(x=>x==='/content/civil/civil-native-index.js').length,1);
});
test('Gratuito falha fechado se o filtro de segurança do boot estiver ausente',async()=>{
 const {win,calls}=fixture({free:true,policyAvailable:false});
 await win.CentralDisciplineLoader.load('civil');
 assert.equal(calls.includes('/content/civil/civil-sharing-links.js'),false);
 assert.equal(win.CentralDisciplineLoader.isReady('civil'),true);
});
