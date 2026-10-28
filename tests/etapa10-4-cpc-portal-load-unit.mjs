import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import vm from 'node:vm';
import {protectedAsset} from '../lib/protected-content.js';

const source=await readFile(new URL('../central-discipline-loader.js',import.meta.url),'utf8');
const boot=await readFile(new URL('../central-v119.html',import.meta.url),'utf8');
const index=await readFile(new URL('../index.html',import.meta.url),'utf8');
const questions='/content/cpc/cpc-fixation-questions-v1.js';
const theory='/content/cpc/m05-native-data.js';

function mockLoader({questionsStatus=403,questionEntitled=false,plan='free',theoryStatus=200,planStatus=200}={}){
 const requests=[],scripts=[];
 const win={
  __centralDisciplineFiles:{cpc:[questions+'?v=fixture',theory+'?v=fixture']},
  CpcStudyV1:{installed:true},__M08Installed:true
 };
 for(let n=2;n<=20;n++)if(n!==8)win['CpcStudyM'+String(n).padStart(2,'0')]=true;
 const document={
  head:{appendChild(node){if(node.tagName==='SCRIPT')scripts.push(node.textContent)}},
  createElement(tag){return {tagName:tag.toUpperCase(),dataset:{},textContent:'',remove(){}}},
  dispatchEvent(){},querySelector(){return null},documentElement:{dataset:{centralReady:'true'}}
 };
 const context={
  window:win,document,navigator:{},localStorage:{getItem(){return null}},
  location:{origin:'https://staging.example'},URL,CustomEvent:class{constructor(type,p){this.type=type;this.detail=p?.detail}},
  setTimeout,clearTimeout,requestAnimationFrame(callback){setImmediate(callback)},
  fetch:async(input)=>{
   const path=new URL(input,'https://staging.example').pathname;
   requests.push(path);
   if(path==='/api/plans')
    return {ok:planStatus===200,status:planStatus,json:async()=>({
     plan,entitlements:{'premium.reviews':{enabled:questionEntitled}}
    })};
   const status=path===questions?questionsStatus:theoryStatus;
   return {ok:status===200,status,text:async()=>path===questions
    ?'window.CPC_QUESTIONS.push({premiumOnly:true});'
    :'window.BASE_NATIVE_CONTENT={cpc:{m05:{summary:"seguro"}}};'};
  }
 };
 vm.runInNewContext(source,context,{filename:'central-discipline-loader.js'});
 return {loader:win.CentralDisciplineLoader,requests,scripts};
}

test('rota / é normal após o boot: CPC é aberto pelo menu Disciplinas, não pela URL /central',()=>{
 assert.match(boot,/fetch\('\/index\.html\?central_source='/);
 assert.match(boot,/history\.replaceState\(null,'',appPath\+entryUrl\.search\+entryUrl\.hash\)/);
 assert.match(index,/data-central-native="disciplines"/);
 assert.match(index,/window\.centralHardSubject=function\(id\)/);
 assert.match(index,/data-id="cpc"/);
 assert.equal(protectedAsset(questions)?.feature,'premium.reviews');
 assert.equal(protectedAsset(theory)?.feature,'theory.complete');
});

test('aluno Gratuito carrega o CPC resumido quando questões pagas respondem 403',async()=>{
 const m=mockLoader();
 await m.loader.load('cpc');
 assert.equal(m.loader.isReady('cpc'),true);
 assert.deepEqual(m.requests,[questions,theory,'/api/plans']);
 assert.equal(m.scripts.length,2);
 assert.equal(m.scripts.some(s=>s.includes('premiumOnly')),false);
 assert.equal(m.scripts.some(s=>s.includes('BASE_NATIVE_CONTENT')),true);
});

test('Premium recebe o banco de questões e o resumo sem consulta adicional',async()=>{
 const m=mockLoader({questionsStatus:200,questionEntitled:true,plan:'premium'});
 await m.loader.load('cpc');
 assert.equal(m.loader.isReady('cpc'),true);
 assert.deepEqual(m.requests,[questions,theory]);
 assert.equal(m.scripts.some(s=>s.includes('premiumOnly')),true);
});

test('403 para Premium nunca é escondido: falha permanece visível',async()=>{
 const m=mockLoader({questionsStatus:403,questionEntitled:true,plan:'premium'});
 await assert.rejects(m.loader.load('cpc'),/HTTP 403: \/content\/cpc\/cpc-fixation-questions-v1\.js/);
 assert.equal(m.loader.hasError('cpc'),true);
});

test('erro em apostila e outros arquivos não é ignorado',async()=>{
 const m=mockLoader({theoryStatus:403});
 await assert.rejects(m.loader.load('cpc'),/HTTP 403: \/content\/cpc\/m05-native-data\.js/);
 assert.equal(m.loader.hasError('cpc'),true);
});

test('erro de plano não permite contornar um 403',async()=>{
 const m=mockLoader({planStatus:503});
 await assert.rejects(m.loader.load('cpc'),/HTTP 403: \/content\/cpc\/cpc-fixation-questions-v1\.js/);
 assert.equal(m.loader.hasError('cpc'),true);
});

test('erro 500 no arquivo exclusivo não é mascarado',async()=>{
 const m=mockLoader({questionsStatus:500});
 await assert.rejects(m.loader.load('cpc'),/HTTP 500: \/content\/cpc\/cpc-fixation-questions-v1\.js/);
 assert.equal(m.loader.hasError('cpc'),true);
});
