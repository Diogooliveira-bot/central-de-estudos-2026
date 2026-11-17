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
 // Os dois checkouts são os mesmos já anunciados na vitrine oficial.
 // Manter os destinos em HTTPS da Hotmart; não iniciar pagamento sem um clique explícito.
const PURCHASE_LINKS=Object.freeze({
 semestral:'https://pay.hotmart.com/B108186453Y?off=o4y1mlg9',
 anual:'https://pay.hotmart.com/B108186453Y?off=gh4ajvj1'
});
const style=document.createElement('style');
style.textContent='.bc-plan-lock-dialog{position:fixed;inset:0;z-index:2147483000;display:grid;place-items:center;padding:16px;background:rgba(10,30,45,.55)}'
 +'.bc-plan-lock-box{max-width:420px;width:100%;background:#fff;color:#12384e;border-radius:16px;padding:24px;box-shadow:0 18px 50px rgba(0,0,0,.25);font:15px/1.55 system-ui,-apple-system,Segoe UI,sans-serif;text-align:center}'
 +'.bc-plan-lock-box h2{font-size:20px;margin:6px 0 8px}.bc-plan-lock-box p{margin:0 0 16px;color:#4b6475}'
 +'.bc-plan-lock-box .bc-plan-lock-icon{font-size:29px}.bc-plan-lock-box button{font:600 14px system-ui;border:1px solid #c8d9e8;border-radius:10px;padding:10px 18px;background:#fff;color:#133c54;cursor:pointer}'
 +'.bc-plan-lock-plans{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin:14px 0 12px}'
 +'.bc-plan-lock-plans a{display:flex;align-items:center;justify-content:center;min-height:48px;padding:10px 12px;border-radius:10px;background:#0d6576;color:#fff;font:700 14px/1.35 system-ui;text-decoration:none;text-align:center;word-break:normal}'
 +'.bc-plan-lock-plans a:hover,.bc-plan-lock-plans a:focus-visible{background:#0b5260;color:#fff;outline-offset:2px}'
 +'.bc-plan-lock-plans a:first-child{background:#0c4968}'
 +'.bc-plan-lock-box .bc-plan-lock-note{display:block;margin:0 0 14px;font-size:12px;line-height:1.4;color:#5c7382}'
 +'@media(max-width:420px){.bc-plan-lock-box{padding:20px 16px}.bc-plan-lock-plans{grid-template-columns:1fr}}'
 +'html.bc-plan-free .bc-plan-locked{opacity:.78;cursor:pointer}'
 +'html.bc-plan-free .bc-plan-locked::before{content:"🔒 ";font-style:normal}';
document.head.appendChild(style);

// Botões dos recursos Premium nas seis disciplinas jurídicas (mesmos rótulos em
// todos os leitores): teoria completa, questões internas, cadernos TEC/QC e
// infográficos/mapas mentais, que seguem indisponíveis no Gratuito.
const PREMIUM_LABEL=/^(?:Estudar conteúdo|(?:Abrir|Estudar|Acessar) (?:o )?conteúdo completo|Abrir sessão|Resolver \d+ questões|Questões(?: internas)? indisponíveis|▤ Cadernos (?:do )?(?:TEC|QC)|Visualizar (?:infográfico|mapa mental))$/i;
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
 if(!el)return;
 const explicitLock=el.matches('.qc-premium-cta,[data-cpc-premium-cta],.ptn-review-card .ptn-btn.primary,[data-bc-premium-cta],[data-student-primary-nav="filters"]');
 if(!explicitLock&&!isPremiumControl(el))return;
 event.preventDefault();event.stopImmediatePropagation();showLock();
},true);
ready.then(()=>{
 if(!isFree())return;
 mark(document);
 let queued=false;
 // A resposta do plano pode chegar antes do <body>: observa o documento inteiro.
 new MutationObserver(()=>{if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;mark(document)})})
  .observe(document.body||document.documentElement,{childList:true,subtree:true});
});

function showLock(){
 // Mantém uma única janela. Não altera a assinatura e não abre nenhum checkout automaticamente.
 if(document.querySelector('.bc-plan-lock-dialog'))return;
 const previous=document.activeElement;
 const box=document.createElement('div');box.className='bc-plan-lock-dialog';
 const content=document.createElement('div');
 content.className='bc-plan-lock-box';
 content.setAttribute('role','dialog');content.setAttribute('aria-modal','true');
 content.setAttribute('aria-labelledby','bc-plan-lock-title');
 const icon=document.createElement('div');icon.className='bc-plan-lock-icon';
 icon.setAttribute('aria-hidden','true');icon.textContent='🔒';
 const heading=document.createElement('h2');heading.id='bc-plan-lock-title';heading.textContent='Recurso exclusivo do Premium';
 const description=document.createElement('p');description.textContent=PREMIUM_TEXT+
  ' Você pode continuar usando os recursos gratuitos ou escolher uma das opções abaixo para liberar o acesso completo.';
 const links=document.createElement('div');links.className='bc-plan-lock-plans';
 for(const [key,label] of [['semestral','Premium 6 meses · R$ 97'],['anual','Premium 12 meses · R$ 179']]){
  const link=document.createElement('a');link.textContent=label;link.href=PURCHASE_LINKS[key];
  link.target='_blank';link.rel='noopener noreferrer';
  link.setAttribute('aria-label',label+' — abrir pagamento seguro na Hotmart em outra aba');
  links.appendChild(link);
 }
 const note=document.createElement('small');note.className='bc-plan-lock-note';
 note.textContent='Pagamento único pela Hotmart. O acesso Premium é liberado após a confirmação da compra.';
 const closeButton=document.createElement('button');closeButton.type='button';
 closeButton.textContent='Continuar no plano gratuito';
 content.append(icon,heading,description,links,note,closeButton);box.appendChild(content);
 const onKey=e=>{if(e.key==='Escape')close()};
 function close(){
  box.remove();document.removeEventListener('keydown',onKey);
  if(previous&&typeof previous.focus==='function')previous.focus();
 }
 closeButton.addEventListener('click',close);
 box.addEventListener('click',e=>{if(e.target===box)close()});
 document.addEventListener('keydown',onKey);
 document.body.appendChild(box);closeButton.focus();
}
g.CentralPlanAccess.showLock=showLock;
})(window);
