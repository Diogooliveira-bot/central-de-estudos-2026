import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { JSDOM } from 'jsdom';

const script = readFileSync('ui/disciplinas-foco-v1.js','utf8');
const css = readFileSync('ui/disciplinas-foco-v1.css','utf8');
const pause = ms => new Promise(resolve => setTimeout(resolve,ms));

async function setup() {
  const dom=new JSDOM(`<!doctype html><html><body>
    <main id="homeView"><div class="home-grid"><div>
      <div id="disciplinasHome"></div>
      <div id="subjects"><section class="subject central-subject-pending" data-id="cf">
        <button class="subject-head" type="button"><span class="subject-name">Direito Constitucional</span></button>
        <div class="subject-body"></div>
      </section></div>
    </div></div></main>
  </body></html>`,{
    url:'https://example.test/central',runScripts:'outside-only',pretendToBeVisual:true,
  });
  const {window:win}=dom;
  const state={loading:true,ready:false,error:false,retryCount:0};
  win.CentralDisciplineLoader={
    isLoading:id=>id==='cf'&&state.loading,
    isReady:id=>id==='cf'&&state.ready,
    hasError:id=>id==='cf'&&state.error,
    open:id=>{if(id==='cf')state.retryCount++;},
  };
  win.toggleSubject=id=>win.document.querySelector(`[data-id="${id}"]`)?.classList.add('open');
  const ready=new Promise(resolve=>{
    if(win.document.readyState==='loading')win.document.addEventListener('DOMContentLoaded',resolve,{once:true});
    else resolve();
  });
  win.eval(script);
  await ready;
  const subject=win.document.querySelector('.subject');
  subject.querySelector('.subject-head').click();
  const list=()=>win.document.getElementById('bcFocusModules');
  return {win,dom,subject,list,state};
}

test('exibe loading animado sem fallback durante download de disciplina',async t=>{
  const c=await setup();t.after(()=>c.win.close());
  await pause(45);
  const panel=c.list().querySelector('.bc-focus-loading');
  assert.ok(panel,'Painel de carregamento exibido');
  assert.equal(panel.getAttribute('role'),'status');
  assert.equal(panel.getAttribute('aria-busy'),'true');
  assert.match(panel.querySelector('h2').textContent,/Preparando Direito Constitucional/);
  assert.ok(panel.querySelector('.bc-focus-loading-spinner'));
  assert.equal(c.list().querySelector('.bc-focus-fallback'),null,'Não exibir botão antigo e estreito durante a espera');
  assert.equal(c.list().querySelector('.bc-focus-modules-intro'),null,'Não exibir título de módulos antes da lista ficar pronta');
});

test('substitui loading pelos módulos automaticamente após evento de prontidão',async t=>{
  const c=await setup();t.after(()=>c.win.close());
  await pause(45);
  c.state.loading=false;c.state.ready=true;
  c.subject.classList.remove('central-subject-pending');
  c.subject.querySelector('.subject-body').innerHTML=
    '<div class="cf-module" data-cf="w1"><button class="cf-module-head" type="button"><span class="cf-module-no">MÓDULO 01</span><span class="cf-module-title">Princípios fundamentais</span></button></div>';
  c.win.document.dispatchEvent(new c.win.CustomEvent('central:discipline-ready',{detail:{id:'cf'}}));
  await pause(45);
  assert.equal(c.list().querySelector('.bc-focus-loading'),null);
  assert.equal(c.list().querySelectorAll('.bc-focus-module-card').length,1);
  assert.match(c.list().textContent,/Princípios fundamentais/);
  assert.equal(c.list().querySelector('.bc-focus-fallback'),null);
});

test('falha real mostra recuperação sem spinner infinito',async t=>{
  const c=await setup();t.after(()=>c.win.close());
  await pause(45);
  c.state.loading=false;c.state.error=true;
  c.subject.classList.remove('central-subject-pending');
  c.win.document.dispatchEvent(new c.win.CustomEvent('central:discipline-error',{detail:{id:'cf'}}));
  await pause(45);
  assert.equal(c.list().querySelector('.bc-focus-loading'),null);
  const failure=c.list().querySelector('.bc-focus-load-error');
  assert.ok(failure,'Falha precisa ser comunicada');
  assert.equal(failure.getAttribute('role'),'alert');
  const button=failure.querySelector('.bc-focus-retry');
  assert.equal(button.textContent,'Tentar novamente');
  button.click();assert.equal(c.state.retryCount,1,'Reutiliza o carregador real');
});

test('ausência definitiva de módulos não cria botão espremido',async t=>{
  const c=await setup();t.after(()=>c.win.close());
  await pause(45);
  c.state.loading=false;c.state.ready=true;
  c.subject.classList.remove('central-subject-pending');
  c.win.document.dispatchEvent(new c.win.CustomEvent('central:discipline-ready',{detail:{id:'cf'}}));
  await pause(45);
  const fallback=c.list().querySelector('.bc-focus-fallback');
  assert.ok(fallback);
  assert.equal(fallback.querySelector('strong').textContent,'Abrir conteúdo completo desta disciplina');
  assert.equal(c.list().querySelector('.bc-focus-loading'),null);
});

test('estilos acessíveis e cache versionado',()=>{
  const boot=readFileSync('central-v119.html','utf8');
  const manifest=readFileSync('central-offline-files-v66172.json','utf8');
  assert.match(css,/@keyframes bc-focus-spin/);
  assert.match(css,/@media\(prefers-reduced-motion:reduce\)/);
  assert.match(css,/\.bc-focus-module-card\.bc-focus-fallback/);
  assert.match(script,/central:discipline-ready/);
  assert.match(script,/central:discipline-error/);
  assert.match(readFileSync('central-discipline-loader.js','utf8'),/new CustomEvent\('central:discipline-error'/);
  const files=JSON.parse(manifest).files;
  for(const file of ['ui/disciplinas-foco-v1.js','ui/disciplinas-foco-v1.css','central-discipline-loader.js']){
    const asset=files.find(value=>value.startsWith('/'+file+'?v='));
    assert.ok(asset,file+' manifesto versionado');
    assert.ok(boot.includes(asset.slice(1)),file+' boot e manifesto usam a mesma versão');
  }
});


test('módulo em foco usa título apenas no cabeçalho superior, mantendo controles originais',()=>{
  const clean=readFileSync('ui/module-clean-v1.css','utf8');
  const civil=readFileSync('ui/civil-native-study-v1.js','utf8');
  const cpp=readFileSync('ui/cpp-native-study-v1.js','utf8');
  const boot=readFileSync('central-v119.html','utf8');
  const files=JSON.parse(readFileSync('central-offline-files-v66172.json','utf8')).files;
  const version='/ui/module-clean-v1.css?v=20261112nographic1';
  assert.ok(boot.includes(version));
  assert.ok(files.includes(version));
  assert.match(clean,/\.cv-module\.bc-focus-current-module\s*>\s*\.cv-module-head\s*\{/);
  assert.match(clean,/\.cv-module\.bc-focus-current-module\s*>\s*\.cv-module-head\s*>\s*:not\(\.cv-chevron\)/);
  assert.match(clean,/\.cv-module\.bc-focus-current-module\s+\.cv-zone-head\s*\{\s*display:none!important/);
  assert.match(clean,/\.cv-module\.bc-focus-current-module\s*>\s*\.cv-module-head::before/);
  assert.match(clean,/\.topic-item\.bc-focus-current-module\s*>\s*\.topic-row\s*>\s*:not\(\.open-topic\)/);
  assert.match(civil,/onclick="CivilNative\.toggle\(\$\{n\}\)"/);
  assert.match(cpp,/onclick="CppNative\.toggle\('/);
  assert.match(civil,/function progressPanel\(n\)/);
  assert.match(cpp,/function progressPanel\(n\)/);
  assert.doesNotMatch(clean,/\.cv-module-body\s*\{\s*display:none/);
});


test('ADM no módulo em foco não repete título ou percentual além da barra de leitura',()=>{
  const clean=readFileSync('ui/module-clean-v1.css','utf8');
  const adm=readFileSync('ui/adm-native-layer.js','utf8');
  const css=clean.slice(clean.indexOf('12/11 — ADM: título'));
  assert.ok(css.length>300,'limpeza de ADM deve existir');
  assert.match(css,/\.subject\[data-id="adm"\] \.topic-item\.adm-native-module-row\.bc-focus-current-module/);
  assert.match(css,/\.topic-row > :not\(\.open-topic\) \{\s*display:none!important/);
  assert.match(css,/\.adm-native-zone > \.adm-native-zone-head \{\s*display:none!important/);
  assert.match(css,/\.adm-native-progress-panel \{\s*grid-template-columns:minmax\(0,1fr\)!important/);
  assert.match(css,/\.topic-row::before \{\s*content:"Recolher módulo"/);
  assert.match(adm,/function progressPanel\(uid\)/);
  assert.match(adm,/data-adm-theory-bar/);
  assert.match(adm,/function moduleProgress\(uid\)/);
  assert.match(adm,/function updateSubject\(\)/);
  assert.doesNotMatch(css,/\.adm-native-progress-line\s*\{\s*display:none/);
});
