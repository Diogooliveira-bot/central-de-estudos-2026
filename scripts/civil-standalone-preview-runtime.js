/* Standalone owner preview: no authentication, network calls, or student data. */
const civilModules=JSON.parse(document.getElementById('data').textContent);
const civilMain=document.querySelector('main'),civilNav=document.querySelector('nav'),civilSelect=document.getElementById('module');
let civilSize=innerWidth<560?17:18;
function civilPreviewOpen(n){
 const m=civilModules[n];civilSelect.value=n;
 const hero=document.createElement('section');hero.className='hero';
 const eyebrow=document.createElement('p');eyebrow.className='eyebrow';eyebrow.textContent='DIREITO CIVIL · MÓDULO '+String(n).padStart(2,'0');
 const h1=document.createElement('h1');h1.textContent=m.title;
 const meta=document.createElement('div');meta.className='meta';meta.textContent='TEORIA COMPLETA · PRÉVIA PARA AVALIAÇÃO';
 hero.append(eyebrow,h1,meta);civilMain.innerHTML=m.html;civilMain.prepend(hero);window.CivilLawDisclosure?.enhance(civilMain);
 const label=document.createElement('p');label.textContent='NESTE MÓDULO';civilNav.replaceChildren(label);
 for(const h of civilMain.querySelectorAll('h2,h3')){
  if(h.closest('.overview,.synthesis'))continue;
  const link=document.createElement('a');link.className=h.tagName==='H3'?'sub':'';link.href='#'+h.id;link.textContent=h.textContent;
  link.onclick=()=>{document.body.classList.remove('menu-open');document.getElementById('menu').setAttribute('aria-expanded','false');};civilNav.append(link);
 }
 window.scrollTo(0,0);
}
civilSelect.onchange=()=>civilPreviewOpen(civilSelect.value);
document.getElementById('menu').onclick=()=>{const on=document.body.classList.toggle('menu-open');document.getElementById('menu').setAttribute('aria-expanded',String(on));};
document.getElementById('plus').onclick=()=>{civilSize=Math.min(24,civilSize+1);document.documentElement.style.setProperty('--size',civilSize+'px');};
document.getElementById('minus').onclick=()=>{civilSize=Math.max(15,civilSize-1);document.documentElement.style.setProperty('--size',civilSize+'px');};
civilPreviewOpen(1);
