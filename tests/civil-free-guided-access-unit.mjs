import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {JSDOM} from 'jsdom';
import {resolve} from 'node:path';
import {protectedAsset} from '../lib/protected-content.js';
import {freePlanAsset} from './helpers/free-plan-content.mjs';

const root=resolve('.');
const file=n=>'/content/civil/m'+String(n).padStart(2,'0')+'-teoria-guiada-data.js';

test('Civil M01–M15: revisão guiada entregue ao aluno gratuito, sem liberar teoria Premium',async()=>{
  const dom=new JSDOM('<!doctype html><html><head></head><body></body></html>',{url:'https://student.test/',runScripts:'outside-only'});
  const w=dom.window;
  for(let n=1;n<=15;n++){
    const p=file(n);
    const policy=protectedAsset(p);
    assert.equal(policy?.kind,'file','arquivo de revisão protegido por sessão M'+n);
    assert.equal(policy.feature,'theory.summary','revisão liberada ao Gratuito M'+n);
    const data=await freePlanAsset(root,p);
    assert.equal(data?.status,200,'aluno grátis recebe conteúdo guiado M'+n);
    w.eval(data.body);
    const module=w.BC_CIV_GUIDED_MODULES?.[n];
    assert(module && module.topics.length>=8,'todos os capítulos guiados recebidos M'+n);
  }
  const lei=protectedAsset('/content/civil/civil-teoria-guiada-lei-seca.js');
  assert.equal(lei?.feature,'theory.summary');
  const law=await freePlanAsset(root,'/content/civil/civil-teoria-guiada-lei-seca.js');
  assert.equal(law?.status,200);
  w.eval(law.body);
  assert(w.BC_CIV_GUIDED_LAW,'lei seca disponível no guia gratuito');

  for(const path of [
    '/content/civil/m01-native-data.js',
    '/content/civil/civil-native-content-packed.js',
    '/content/civil/civil-native-images.js',
    '/content/penal/penal-visual-law.js',
    '/content/cf/m01-teoria-guiada-data.js'
  ]){
    assert.notEqual(protectedAsset(path)?.feature,'theory.summary','outro material permanece protegido: '+path);
    const projected=await freePlanAsset(root,path);
    // A regra cobre também nomes de módulos legados que já não existem
    // como arquivo físico. Um 404 não deve ser confundido com liberação.
    if(projected?.status===404) continue;
    if(protectedAsset(path)?.kind==='file')assert.equal(projected?.status,403,'recurso Premium não liberado: '+path);
    else {
      assert.equal(projected?.status,200,'projeção gratuita preservada: '+path);
      if(protectedAsset(path)?.kind==='native'){
        const context={window:{}};vm.runInNewContext(projected.body,context);
        const mod=context.window.BASE_NATIVE_CONTENT?.civil?.m01;
        assert(mod,'resumo de Civil projetado');
        assert.match(mod.complete,/exclusivo do Base Completa Premium/);
        assert(!('questions' in mod)&&!('internalQuestions' in mod),'banco de questões não exposto');
      }
    }
  }

  const {readFileSync}=await import('node:fs');
  w.eval(readFileSync('content/civil/civil-teoria-guiada-reader-v1.js','utf8'));
  assert.equal(w.BcCivilGuidedReader.open(4),true,'revisão guiada abre para o aluno gratuito');
  const reader=w.document.querySelector('.civil-guided-reading');
  assert(reader,'leitor guiado substitui o antigo resumo');
  assert.equal(reader.querySelectorAll('[data-bc-guided-mode]').length,0,'sem abas primeira leitura / revisão rápida');
  assert(reader.querySelectorAll('.bc-m01-topic').length>=8,'texto atualizado exibido');
  assert(reader.querySelector('.bc-m01-lei-seca summary'),'lei seca recolhível exibida');
  w.BcCivilGuidedReader.close();
  dom.window.close();
});
