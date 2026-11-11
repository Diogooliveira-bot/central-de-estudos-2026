import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {resolve} from 'node:path';
import {protectedAsset} from '../lib/protected-content.js';
import {freePlanAsset} from './helpers/free-plan-content.mjs';

const root=resolve('.');

test('32 revisões guiadas de Constitucional e Penal chegam ao aluno gratuito autenticado',async()=>{
  const disciplines=[['cf',15,'BC_CF_GUIDED_MODULES'],['penal',17,'BC_PEN_GUIDED_MODULES']];
  let verified=0;
  for(const [discipline,count,variable] of disciplines)for(let n=1;n<=count;n++){
    const path='/content/'+discipline+'/m'+String(n).padStart(2,'0')+'-teoria-guiada-data.js';
    const policy=protectedAsset(path);
    assert.equal(policy?.kind,'file',path+': exige sessão para acessar a revisão');
    assert.equal(policy.feature,'theory.summary',path+': não deve exigir assinatura Premium');
    const response=await freePlanAsset(root,path);
    assert.equal(response?.status,200,path+': acesso gratuito ao texto da revisão');
    const sandbox={};
    sandbox.window=sandbox;
    new vm.Script(response.body,{filename:path}).runInNewContext(sandbox,{timeout:800});
    const record=sandbox[variable]?.[n];
    assert(record && Array.isArray(record.topics) && record.topics.length>=5,path+': aula da revisão presente');
    for(const field of ['questions','answerKey','correctAnswers','internalQuestions','completeHtml','complete']){
      assert.equal(Object.hasOwn(record,field),false,path+': campo Premium vazando '+field);
    }
    verified++;
  }
  assert.equal(verified,32);
});

test('regras Premium anteriores de Constitucional e Penal não são relaxadas',async()=>{
  for(const asset of [
    '/content/cf/editorial/m01-apostila.txt',
    '/content/penal/m01-native-data.js',
    '/content/penal/penal-teoria-guiada-questions-v3.js',
    '/content/penal/penal-visual-law.js',
    '/content/civil/civil-native-images.js'
  ]){
    const policy=protectedAsset(asset);
    assert(policy,asset+': arquivo protegido');
    assert.notEqual(policy.feature,'theory.summary',asset+': não se deve tornar Gratuito');
    const result=await freePlanAsset(root,asset);
    if(result?.status===404)continue; // Arquivo legado não distribuído neste build.
    if(policy.kind==='file') assert.equal(result?.status,403,asset+': acesso Premium negado');
    else assert.equal(result?.status,200,asset+': projeção autorizada do resumo antigo');
  }
});
