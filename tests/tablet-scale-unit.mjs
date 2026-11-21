import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {JSDOM} from 'jsdom';
const source=readFileSync('ui/tablet-scale-v1.js','utf8');
function boot(t,{width=390,saved=null,storageFails=false,touch=false,screenWidth=0,screenHeight=0}={}){
 const dom=new JSDOM('<!doctype html><html><head><meta name="viewport" content="width=device-width,initial-scale=1"></head><body><div id="centralSettingsBackdrop"><div class="central-settings-body"></div></div></body></html>',{url:'https://central.test',runScripts:'outside-only'});
 const w=dom.window;t.after(()=>w.close());
 Object.defineProperty(w,'innerWidth',{value:width,writable:true});
 Object.defineProperty(w.screen,'width',{configurable:true,value:screenWidth});
 Object.defineProperty(w.screen,'height',{configurable:true,value:screenHeight});
 w.matchMedia=query=>({matches:touch && /pointer:coarse/.test(query)});
 if(saved!==null)w.localStorage.setItem('central-v6:ui-scale:v1',saved);
 if(storageFails)Object.defineProperty(w,'localStorage',{get(){throw Error('disabled')}});
 w.eval(source);return w;
}
const scale=w=>Number(w.document.documentElement.style.getPropertyValue('--bc-ui-scale'));
test('Automático cresce também no celular, mantendo o viewport real',t=>{
 for(const width of [360,390,430,768,820,1024,1366,1920,2560]){
  const w=boot(t,{width});assert.equal(w.BCUiScale.get(),0);assert.ok(scale(w)>1);
  assert.equal(w.document.querySelector('meta').content,'width=device-width,initial-scale=1');
 }
});
test('cada escolha aplica uma escala distinta e preserva valores antigos',t=>{
 for(const saved of [0,1,1.15,1.3]){const w=boot(t,{saved});assert.equal(w.BCUiScale.get(),saved);assert.equal(scale(w),saved||1.0625);}
 const w=boot(t);const sizes=[0,1,1.15,1.3].map(s=>{w.BCUiScale.set(s);return scale(w)});assert.equal(new Set(sizes).size,4);
 assert.equal(w.localStorage.getItem('central-v6:ui-scale:v1'),'1.3');
});
test('valores desconhecidos voltam ao Automático',t=>{const w=boot(t,{saved:'abc'});assert.equal(w.BCUiScale.get(),0);w.BCUiScale.set(7);assert.equal(w.BCUiScale.get(),0);});
test('armazenamento bloqueado mantém escolha durante a sessão',t=>{const w=boot(t,{storageFails:true});w.BCUiScale.set(1.3);assert.equal(w.BCUiScale.get(),1.3);assert.equal(scale(w),1.3);});
test('resize, orientação e restauração recalculam sem recarregar',async t=>{
 const w=boot(t);w.innerWidth=1920;w.dispatchEvent(new w.Event('resize'));await new Promise(r=>setTimeout(r,110));assert.equal(scale(w),1.2);
 w.BCUiScale.set(1.15);w.innerWidth=820;w.dispatchEvent(new w.Event('orientationchange'));await new Promise(r=>setTimeout(r,110));assert.equal(scale(w),1.15);
 w.dispatchEvent(new w.Event('pageshow'));assert.equal(scale(w),1.15);
});
test('preferência alterada em outra aba atualiza o controle',t=>{const w=boot(t);w.BCUiScale.set(1.15);w.localStorage.setItem('central-v6:ui-scale:v1','1.3');w.dispatchEvent(new w.StorageEvent('storage',{key:'central-v6:ui-scale:v1'}));assert.equal(scale(w),1.3);});
test('controle tem quatro opções, opera imediatamente e informa a opção ativa',async t=>{
 const w=boot(t);await new Promise(r=>setTimeout(r,20));const block=w.document.querySelector('#bcUiScale');assert.ok(block);assert.equal(block.querySelectorAll('button').length,4);
 block.querySelector('[data-bc-ui-scale="1.3"]').click();assert.equal(scale(w),1.3);assert.equal(block.querySelector('.is-active').getAttribute('aria-pressed'),'true');
});
test('tipografia compartilhada não depende de zoom ou alteração dinâmica de viewport',()=>{
 const css=readFileSync('ui/auto-scale-v1.css','utf8');assert.doesNotMatch(css,/\bzoom\s*:/);assert.doesNotMatch(source,/setAttribute\('content'/);
 assert.match(css,/--bc-ui-scale/);assert.match(css,/student-reader-active/);assert.match(css,/minmax\(min\(100%,27rem\)/);
 assert.match(readFileSync('sync-local-state.js','utf8'),/central-v6:ui-scale/);
});

test('tablet em retrato recebe escala própria e classe sem confundir com telefone',t=>{
 const tab=boot(t,{width:1024,screenWidth:800,screenHeight:1280,touch:true});
 assert.equal(tab.BCUiScale.isTablet(),true);
 assert.equal(scale(tab),1.36);
 assert.ok(tab.document.documentElement.classList.contains('bc-tablet-device'));
 assert.ok(tab.document.documentElement.classList.contains('bc-tablet-portrait'));
 const mobile=boot(t,{width:430,screenWidth:430,screenHeight:900,touch:true});
 assert.equal(mobile.BCUiScale.isTablet(),false);
 assert.equal(scale(mobile),1.0625);
 assert.equal(mobile.document.documentElement.classList.contains('bc-tablet-device'),false);
 const desktop=boot(t,{width:1440,screenWidth:1440,screenHeight:900,touch:false});
 assert.equal(desktop.BCUiScale.isTablet(),false);
 assert.equal(scale(desktop),1.125);
});

test('modo desktop no navegador do tablet não comprime novamente a interface',t=>{
 const tab=boot(t,{width:1440,screenWidth:800,screenHeight:1280,touch:true});
 assert.equal(tab.BCUiScale.isTablet(),true);
 assert.equal(scale(tab),1.46);
 assert.equal(tab.document.documentElement.style.getPropertyValue('zoom'),'');
 assert.equal(tab.document.querySelector('meta').content,'width=device-width,initial-scale=1');
});

test('escala manual e rotação continuam funcionais no tablet',async t=>{
 const tab=boot(t,{width:1180,screenWidth:800,screenHeight:1280,touch:true});
 tab.BCUiScale.set(1.15);
 assert.equal(scale(tab),1.15);
 assert.equal(tab.document.documentElement.classList.contains('bc-tablet-portrait'),true);
 Object.defineProperty(tab.screen,'width',{configurable:true,value:1280});
 Object.defineProperty(tab.screen,'height',{configurable:true,value:800});
 tab.dispatchEvent(new tab.Event('orientationchange'));
 await new Promise(resolve=>setTimeout(resolve,110));
 assert.equal(tab.document.documentElement.classList.contains('bc-tablet-portrait'),false);
 assert.equal(tab.document.documentElement.classList.contains('bc-tablet-device'),true);
 assert.equal(scale(tab),1.15);
});

test('CSS responsivo de tablet é isolado e chega depois do estilo geral',()=>{
 const css=readFileSync('ui/tablet-legibility-v1.css','utf8');
 const boot=readFileSync('central-v119.html','utf8');
 const manifest=JSON.parse(readFileSync('central-offline-files-v66172.json','utf8'));
 assert.match(css,/html\.bc-tablet-device/);
 assert.match(css,/grid-template-columns:repeat\(2,minmax\(0,1fr\)\)/);
 assert.match(css,/bc-tablet-portrait/);
 assert.doesNotMatch(css,/\bzoom\s*:/);
 assert.ok(boot.indexOf('ui/tablet-scale-v1.js?v=20261117tablet1')>0);
 assert.ok(boot.indexOf('ui/tablet-legibility-v1.css?v=20261121r1')>boot.indexOf('ui/auto-scale-v1.css?v=20261115responsive1'));
 for(const p of ['/ui/tablet-scale-v1.js?v=20261117tablet1','/ui/tablet-legibility-v1.css?v=20261121r1']){
  assert.ok(manifest.files.includes(p),p+' não incluído no pacote offline');
 }
});


test('login detecta tablet em retrato mesmo com viewport desktop, sem ampliar celular ou notebook',t=>{
 const html=readFileSync('login.html','utf8');
 const match=html.match(/<script id="bc-login-tablet-detect">([\s\S]*?)<\/script>/);
 assert.ok(match,'faltou detecção independente da tela de login');
 function loginDevice(width,height,touches){
  const dom=new JSDOM('<!doctype html><html><head></head><body></body></html>',{url:'https://app.basecompleta.com.br/login.html',runScripts:'outside-only'});
  t.after(()=>dom.window.close());
  const w=dom.window;
  Object.defineProperty(w.screen,'width',{configurable:true,value:width});
  Object.defineProperty(w.screen,'height',{configurable:true,value:height});
  Object.defineProperty(w.navigator,'maxTouchPoints',{configurable:true,value:touches});
  w.matchMedia=()=>({matches:touches>=2});
  w.eval(match[1]);return w.document.documentElement.classList.contains('bc-login-tablet');
 }
 assert.equal(loginDevice(800,1280,5),true,'tablet Samsung vertical');
 assert.equal(loginDevice(1280,800,5),true,'tablet horizontal');
 assert.equal(loginDevice(390,860,5),false,'celular em modo desktop');
 assert.equal(loginDevice(1440,900,0),false,'computador com mouse');
});

test('login de tablet tem card, campos e textos maiores sem zoom nem alteração de autenticação',()=>{
 const html=readFileSync('login.html','utf8');
 const css=html.slice(html.indexOf('/* Legibilidade real no tablet'),html.indexOf('</style>',html.indexOf('/* Legibilidade real no tablet')));
 assert.match(html,/<meta name="viewport" content="width=device-width,initial-scale=1">/);
 assert.match(css,/html\.bc-login-tablet \.card/);
 assert.match(css,/width:min\(680px,calc\(100vw - 48px\)\)/);
 assert.match(css,/html\.bc-login-tablet input:not\(\[type="checkbox"\]\)\{min-height:56px;font-size:17px/);
 assert.match(css,/html\.bc-login-tablet \.access-help/);
 assert.match(css,/html\.bc-login-tablet \.logo/);
 assert.doesNotMatch(css,/\bzoom\s*:|\btransform\s*:\s*scale/);
 assert.match(html,/id="loginForm"/);
 assert.match(html,/id="togglePassword"/);
 assert.match(html,/action=login/);
});
