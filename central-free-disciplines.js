/* Plano gratuito: mesma interface do Premium, com os recursos exclusivos bloqueados.
   O servidor já entrega ao Gratuito apenas os resumos (lib/private-content-handler.js);
   aqui apenas identificamos o plano, deixamos o carregador ignorar arquivos 403 e
   sinalizamos os recursos Premium com um aviso de bloqueio. */
(function(g){
'use strict';
const loader=g.CentralDisciplineLoader;if(!loader)return;
let plan=null,known=false;
const isFree=()=>plan?.plan==='free'&&plan?.isStaff!==true;
const ready=fetch('/api/plans?action=me',{cache:'no-store',credentials:'same-origin'})
 .then(async r=>{if(!r.ok)throw Error('Plano indisponível');plan=await r.json();return plan})
 .catch(e=>{console.warn('[Plano] ',e);return null})
 .then(p=>{known=true;if(isFree())document.documentElement.classList.add('bc-plan-free');return p});
g.CentralPlanAccess={ready,isFree,isKnown:()=>known};

// O carregador precisa saber o plano antes de baixar a disciplina: só no Gratuito
// um 403 de arquivo Premium é ignorado em vez de interromper a abertura.
const originalOpen=loader.open.bind(loader),originalLoad=loader.load.bind(loader);
loader.open=function(id,after){
 if(known)return originalOpen(id,after);
 ready.then(()=>originalOpen(id,after));
 return false;
};
loader.load=function(id){return known?originalLoad(id):ready.then(()=>originalLoad(id))};

const PREMIUM_TEXT='Este recurso é exclusivo do Base Completa Premium.';
const style=document.createElement('style');
style.textContent='.bc-plan-lock-dialog{position:fixed;inset:0;z-index:2147483000;display:grid;place-items:center;padding:16px;background:rgba(10,30,45,.55)}'
 +'.bc-plan-lock-box{max-width:420px;width:100%;background:#fff;color:#12384e;border-radius:16px;padding:24px;box-shadow:0 18px 50px rgba(0,0,0,.25);font:15px/1.55 system-ui,-apple-system,Segoe UI,sans-serif;text-align:center}'
 +'.bc-plan-lock-box h2{font-size:20px;margin:6px 0 8px}.bc-plan-lock-box p{margin:0 0 16px;color:#4b6475}'
 +'.bc-plan-lock-box .bc-plan-lock-icon{font-size:34px}.bc-plan-lock-box button{font:600 15px system-ui;border:0;border-radius:10px;padding:11px 18px;background:#133c54;color:#fff;cursor:pointer}'
 +'html.bc-plan-free .bc-plan-locked{opacity:.78;cursor:pointer}'
 +'html.bc-plan-free .bc-plan-locked::before{content:"🔒 ";font-style:normal}';
document.head.appendChild(style);

// Botões dos recursos Premium nas seis disciplinas jurídicas (mesmos rótulos em
// todos os leitores): teoria completa, questões internas, cadernos TEC/QC e
// infográficos/mapas mentais, que seguem indisponíveis no Gratuito.
const PREMIUM_LABEL=/^(?:Estudar conteúdo|Abrir sessão|Resolver \d+ questões|Questões(?: internas)? indisponíveis|▤ Cadernos (?:do )?(?:TEC|QC)|Visualizar (?:infográfico|mapa mental))$/;
function isPremiumControl(el){
 if(!el||!el.closest('.subject'))return false;
 return PREMIUM_LABEL.test(el.textContent.replace(/\s+/g,' ').trim());
}
function mark(root){
 if(!isFree())return;
 root.querySelectorAll?.('.subject button').forEach(el=>{
  if(!el.classList.contains('bc-plan-locked')&&isPremiumControl(el)){el.classList.add('bc-plan-locked');el.setAttribute('aria-description','Recurso do Premium')}
 });
}
document.addEventListener('click',event=>{
 if(!isFree())return;
 const el=event.target.closest?.('button');
 if(!isPremiumControl(el))return;
 event.preventDefault();event.stopImmediatePropagation();showLock();
},true);
ready.then(()=>{
 if(!isFree())return;
 mark(document);
 let queued=false;
 new MutationObserver(()=>{if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;mark(document)})})
  .observe(document.body,{childList:true,subtree:true});
});

function showLock(){
 if(document.querySelector('.bc-plan-lock-dialog'))return;
 const box=document.createElement('div');box.className='bc-plan-lock-dialog';
 box.innerHTML='<div class="bc-plan-lock-box" role="dialog" aria-modal="true" aria-label="Recurso do Premium"><div class="bc-plan-lock-icon" aria-hidden="true">🔒</div><h2>Recurso do Premium</h2><p>'+PREMIUM_TEXT+' No plano Gratuito você continua com os resumos, o Vade Mecum e até 20 questões por dia no Lei em Dia.</p><button type="button">Entendi</button></div>';
 const close=()=>box.remove();
 box.addEventListener('click',e=>{if(e.target===box||e.target.tagName==='BUTTON')close()});
 document.addEventListener('keydown',function esc(e){if(e.key==='Escape'){close();document.removeEventListener('keydown',esc)}});
 document.body.appendChild(box);box.querySelector('button').focus();
}
g.CentralPlanAccess.showLock=showLock;
})(window);
