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


test('pré-carrega só scripts essenciais e preserva os scripts das disciplinas', () => {
  const boot = readFileSync('central-v119.html', 'utf8');
  const start = boot.indexOf(' function addScriptPreloads(html){');
  const end = boot.indexOf('\n try{\n  var authResponse=', start);
  assert.ok(start >= 0 && end > start, 'Encontrar o carregador usado na produção');
  const preload = new Function('html', boot.slice(start, end) + '\nreturn addScriptPreloads(html);');

  const critical = [
    '/central-home-progress-data.js', '/central-discipline-loader.js',
    '/central-free-disciplines.js', '/central-structural-v66119/runtime.js',
    '/ui/shell.js', '/ui/discipline-standard.js', '/ui/home-topnav-v1.js',
    '/ui/student-ux-core-v3.js', '/ui/student-shell-v3.js',
    '/ui/student-dashboard-v3.js', '/ui/disciplinas-foco-v1.js',
  ];
  const optional = [
    '/content/penal/m01-native-data.js',
    '/content/cpc/m03-native-data.js',
    '/content/adm/m08-native-data.js',
    '/ui/editor-premium-v1.js',
    '/ui/visual-editor-v1.js',
    ...Array.from({length: 65}, (_, i) => '/content/cf/m' + i + '-native-data.js'),
  ];
  const srcs = [...critical, ...optional, critical[0]].map(path => path + '?v=teste');
  const html = '<!doctype html><html><head><title>Central</title></head><body>'
    + srcs.map(src => '<script defer src="' + src + '"></script>').join('')
    + '</body></html>';
  const result = preload(html);
  const hints = Array.from(result.matchAll(/<link rel="preload" as="script" href="([^"]+)">/g), m => m[1]);

  assert.deepEqual(hints, critical.map(path => path + '?v=teste'), 'Só a home deve ter prioridade');
  assert.equal((result.match(/<script defer src=/g) || []).length, srcs.length,
    'Todos os scripts permanecem na página, com ordem de execução intacta');
  assert.ok(!hints.some(src => src.includes('native-data') || src.includes('editor-')),
    'Não antecipar apostilas privadas nem editor');
});
