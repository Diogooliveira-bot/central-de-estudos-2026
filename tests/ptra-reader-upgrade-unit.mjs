import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';
import vm from 'node:vm';
const root=path.resolve('.');
const get=pathName=>fs.readFileSync(path.join(root,pathName),'utf8');
function reader(){
  const context={window:{}};
  vm.runInNewContext(get('ui/ptra-reader-upgrade-v1.js'),context,{timeout:8000});
  return context.window.PtraReaderUpgrade;
}
function index(){
  const context={window:{}};
  vm.runInNewContext(get('content/ptra/ptra-native-index.js'),context,{timeout:8000});
  return context.window.PTRA_NATIVE_INDEX;
}
function packed(){
  const buffers=Array.from({length:12},(_,i)=>fs.readFileSync(path.join(root,'content/ptra/packed/ptra-pack-'+String(i+1).padStart(2,'0')+'.bin')));
  return JSON.parse(zlib.gunzipSync(Buffer.concat(buffers)).toString('utf8'));
}
const esc=value=>String(value).replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
test('PTRA: 21 módulos, duas versões e questões interativas geradas de dados reais',()=>{
  const metadata=index(),data=packed(),upgrade=reader();
  assert.equal(metadata.modules.length,21);
  assert.equal(data.modules.length,21);
  let totalQuestions=0,totalCharacters=0,splitCount=0;const unsplit=[];
  for(const meta of metadata.modules){
    const module=data.modules.find(x=>Number(x.number)===Number(meta.number));
    assert.ok(module,'Falta M'+meta.number);
    for(const [kind,expected] of [['resumido',5],['completo',10]]){
      const part=module[kind];
      assert.ok(part,'Falta versão '+kind+' M'+meta.number);
      assert.ok(Array.isArray(part.pages)&&part.pages.length>0,'Faltam páginas '+kind+' M'+meta.number);
      assert.ok(Array.isArray(part.questions),'Faltam questões '+kind+' M'+meta.number);
      assert.equal(part.questions.length,expected,'Quantidade de questões '+kind+' M'+meta.number);
      totalQuestions+=part.questions.length;
      const split=upgrade.splitTheory(part.pages,part.questions);
      if(split.questionsText)splitCount++;
      else {
        const candidates=part.pages.join('\n\n').split('\n')
          .map(x=>x.trim()).filter(x=>/quest[oõ]es|fixa[cç][aã]o|gabarito|exerc[ií]cios/i.test(x)).slice(-6).map(x=>x.slice(0,110));
        unsplit.push({m:meta.number,kind,candidates});
      }
      const html=upgrade.render(meta,part,kind);
      assert.match(html,/ptra-book-flow/);
      assert.match(html,/bc-universal-sheet/);
      assert.match(html,/ptra-book-review/);
      assert.doesNotMatch(html,/ptra-native-page-text|ptra-native-page-no/,'Estrutura de páginas antigas não deve existir');
      assert.equal((html.match(/data-ptra-question="/g)||[]).length,expected,'Cards de questões '+kind+' M'+meta.number);
      assert.equal((html.match(/data-ptra-option="/g)||[]).length,
        part.questions.reduce((a,q)=>a+(q.options?.length||0),0),'Botões de alternativas '+kind+' M'+meta.number);
      for(const q of part.questions){
        assert.ok(q.stem&&q.options?.length>=2,'Questão sem enunciado ou alternativas M'+meta.number);
        assert.ok(q.options.some(option=>String(option.letter).toUpperCase()===String(q.answer).toUpperCase()),'Gabarito ausente entre alternativas M'+meta.number);
        assert.ok(html.includes(esc(q.stem)),'Enunciado não preservado M'+meta.number);
      }
      const original=part.pages.join('\n\n');
      assert.ok(html.includes('<pre>'+esc(original)+'</pre>'),'Transcrição integral não preservada M'+meta.number);
      totalCharacters+=original.length;
    }
  }
  assert.equal(totalQuestions,315);
  assert.ok(totalCharacters>100000);
  console.log('PTRA AUDIT OK: 21 módulos / 42 versões / '+totalQuestions+' questões / '+totalCharacters+' caracteres de fontes originais');
  console.log('PTRA SECTION SPLIT',JSON.stringify({splitCount,unsplit}));
  assert.equal(splitCount,42,'Todas as versões devem mover a seção textual de questões para a revisão interativa');
});
test('PTRA: transcrição segura, hierarquia editorial e seção de questões separada',()=>{
  const upgrade=reader();
  const meta={number:1,title:'Fundamentos <script>alert(1)</script>'};
  const part={
    pages:['INTRODUÇÃO\nTexto original & mais.\nArt. 1º - Norma jurídica.\n\n1. Competência\nRegra aplicável\n\nQUESTÕES DE FIXAÇÃO\nQuestão impressa'],
    questions:[{n:1,stem:'Enunciado <img src=x>',options:[{letter:'A',text:'Sim & não'},{letter:'B',text:'Não'}],answer:'A',comment:'Comentário'}]
  };
  const html=upgrade.render(meta,part,'resumido');
  assert.ok(html.includes('Fundamentos &lt;script&gt;'));
  assert.ok(html.includes('Enunciado &lt;img src=x&gt;'));
  assert.ok(html.includes('Sim &amp; não'));
  assert.ok(html.includes('class="ptra-book-law"'));
  assert.ok(html.includes('data-ptra-jump'));
  assert.ok(!html.slice(html.indexOf('ptra-book-flow'),html.indexOf('ptra-book-source')).includes('Questão impressa'));
  assert.ok(html.includes('Questão impressa'));
  assert.equal(upgrade.formatTheory('1. Tema\nConteúdo\n').chapters.length,1);
});
test('PTRA: integração no bootstrap, andamento e histórico existentes preservados',()=>{
  const bootstrap=get('central-v119.html');
  const native=get('ui/ptra-native-study-v1.js');
  const css=get('ui/ptra-reader-upgrade-v1.css');
  assert.ok(bootstrap.includes('ui/ptra-reader-upgrade-v1.js?v=20261012ptra1'));
  assert.ok(bootstrap.includes('ui/ptra-reader-upgrade-v1.css?v=20261012ptra1'));
  assert.ok(native.includes('PtraReaderUpgrade.render(meta,mat,kind)'));
  assert.ok(native.includes('PtraReaderUpgrade.mount(c,n,kind,mat)'));
  assert.ok(native.includes("function updateRead(force)"),'A leitura do aluno permanece na implementação existente');
  assert.ok(native.includes("function qHistory(n,kind)"),'Histórico anterior permanece disponível');
  assert.ok(css.includes('@media(max-width:680px)'),'Adaptação para celular disponível');
});