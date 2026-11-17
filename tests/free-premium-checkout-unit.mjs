import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { JSDOM } from 'jsdom';

const read=(file)=>readFileSync(new URL('../'+file,import.meta.url),'utf8');
const wait=()=>new Promise(resolve=>setTimeout(resolve,35));
async function setup(plan='free'){
 const html='<!doctype html><html><head></head><body><div class="subject">'+
   '<button id="premium">Estudar conteúdo</button><button id="free">Vade Mecum</button></div>'+
   '<button data-student-primary-nav="filters" id="filters">Filtros QC</button>'+ 
   '<section class="qc-platform-sharing"><button class="qc-premium-cta" id="qc">Conhecer o Premium</button></section>'+
   '<section class="cpc-sharing-panel"><button data-cpc-premium-cta id="cpc">Conhecer o Premium</button></section>'+
   '<div class="ptn-review-card"><button class="ptn-btn primary" id="pt">Conhecer o Premium</button></div>'+
   '</body></html>';
 const dom=new JSDOM(html,{url:'https://app.basecompleta.com.br/central-v119.html',
    pretendToBeVisual:true,runScripts:'outside-only'});
 const w=dom.window;
 // A observação real do DOM não é necessária neste teste e pode deixar RAFs ativos após close().
 w.MutationObserver=class {observe(){} disconnect(){}};
 w.CentralDisciplineLoader={open(){return true},load(){return Promise.resolve()}};
 w.fetch=async(url)=>{
   if(String(url).startsWith('/api/plans?action=me'))return {ok:true,json:async()=>({plan,isStaff:plan==='staff'})};
   throw new Error('API não prevista: '+url);
 };
 w.eval(read('central-free-disciplines.js'));
 await wait();
 return {w,dom,close:()=>w.close()};
}
function click(w,id){w.document.getElementById(id).click()}
function modal(w){return w.document.querySelector('.bc-plan-lock-dialog')}

test('gratuito: recurso pago abre duas ofertas da Hotmart sem compra automática',async()=>{
 const {w,close}=await setup('free');
 assert.equal(modal(w),null);
 click(w,'premium');
 const dlg=modal(w);assert.ok(dlg);
 assert.equal(dlg.querySelector('[role="dialog"]').getAttribute('aria-modal'),'true');
 const links=[...dlg.querySelectorAll('a')];
 assert.equal(links.length,2);
 assert.deepEqual(links.map(a=>a.href),[
  'https://pay.hotmart.com/B108186453Y?off=o4y1mlg9',
  'https://pay.hotmart.com/B108186453Y?off=gh4ajvj1'
 ]);
 for(const link of links){
   assert.equal(link.target,'_blank');
   assert.match(link.rel,/noopener/);assert.match(link.rel,/noreferrer/);
 }
 const site=read('vitrine/index.html');
 for(const link of links)assert.ok(site.includes(link.href),'Checkout não encontrado na vitrine oficial');
 assert.equal(w.location.pathname,'/central-v119.html');
 assert.ok(dlg.textContent.includes('6 meses · R$ 97'));
 assert.ok(dlg.textContent.includes('12 meses · R$ 179'));
 dlg.querySelector('button').click();
 assert.equal(modal(w),null);
 close();
});
test('recursos gratuitos não são bloqueados e Premium não vê a oferta',async()=>{
 const free=await setup('free');
 click(free.w,'free');assert.equal(modal(free.w),null);free.close();
 for(const plan of ['premium','staff']){
   const app=await setup(plan);
   click(app.w,'premium');
   assert.equal(modal(app.w),null);
   assert.equal(app.w.document.documentElement.classList.contains('bc-plan-free'),false);
   app.close();
 }
});
test('avisos específicos QC, CPC e Português também oferecem compra',async()=>{
 const {w,close}=await setup('free');
 for(const id of ['qc','cpc','pt','filters']){
   click(w,id);
   assert.equal(modal(w)?.querySelectorAll('a[href^="https://pay.hotmart.com/"]').length,2,id);
   click(w,id);
   assert.equal(w.document.querySelectorAll('.bc-plan-lock-dialog').length,1,'modal não duplica');
   modal(w).querySelector('button').click();
 }
 close();
});
test('o bloqueio não depende de mudar entitlement nem de expor conteúdo Premium',()=>{
 const script=read('central-free-disciplines.js');
 assert.ok(script.includes('CentralPlanAccess.showLock=showLock'));
 assert.ok(script.includes('event.stopImmediatePropagation()'));
 assert.ok(read('lib/plan-access.js').includes('canAccessFeature'));
 assert.ok(read('lib/private-content-handler.js').includes('canAccessFeature'));
 assert.ok(read('ui/cpc-sharing-links.js').includes('CentralPlanAccess?.showLock'));
 assert.ok(read('portugues-native-v1.js').includes('CentralPlanAccess?.showLock'));
});
