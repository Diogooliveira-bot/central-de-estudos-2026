/* Base Completa — exportacao de infograficos em arquivos individuais ou ZIP. */
(function(w){
'use strict';
if(w.__baseImageExportV1)return;w.__baseImageExportV1=true;
if(w.BASE_COMPLETA_USER?.role!=='admin')return;
const COURSES=[['cf','Direito Constitucional',15],['civil','Direito Civil',15],['cpp','Direito Processual Penal',22],['adm','Direito Administrativo',20]];
const pad=n=>String(n).padStart(2,'0');
const tidy=s=>String(s).normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/gi,'-').replace(/^-|-$/g,'').slice(0,65);
const ext=m=>(m||'image/png').split(';')[0].split('/').pop().replace('svg+xml','svg').replace('jpeg','jpg')||'png';
async function loadScript(src){return new Promise((ok,err)=>{const s=document.createElement('script');s.src=src;s.onload=ok;s.onerror=()=>err(Error('Falha: '+src));document.head.append(s)})}
async function ready(id){
 if(w.CentralDisciplineLoader?.load&&!w.CentralDisciplineLoader.isReady(id))await w.CentralDisciplineLoader.load(id);
}
async function civilImage(n){
 if(!w.CIVIL_NATIVE_IMAGES)await loadScript('/content/civil/civil-native-images.js?v=20261005civil1');
 const uri=w.CIVIL_NATIVE_IMAGES?.['m'+pad(n)];
 if(!uri)throw Error('Imagem Civil M'+pad(n)+' indisponível');
 const response=await fetch(uri);if(!response.ok)throw Error('Falha na imagem incorporada');
 return response.blob();
}
async function spriteCrop(path,x,y,width,height){
 const response=await fetch(path);if(!response.ok)throw Error('Imagem de origem HTTP '+response.status);
 const blob=await response.blob();
 const img=await createImageBitmap(blob);
 const canvas=document.createElement('canvas');canvas.width=width;canvas.height=height;
 const ctx=canvas.getContext('2d');if(!ctx){img.close?.();throw Error('Canvas indisponível')}
 ctx.drawImage(img,x,y,width,height,0,0,width,height);img.close?.();
 return new Promise((ok,err)=>canvas.toBlob(b=>b?ok(b):err(Error('Falha ao recortar infográfico')),'image/png'));
}
async function imageFor(id,n){
 n=Number(n);if(!Number.isInteger(n)||n<1)throw Error('Módulo inválido');
 await ready(id);
 if(id==='civil'){
  const row=w.CIVIL_NATIVE_INDEX?.modules?.find(m=>m.number===n);
  if(!row)throw Error('Civil M'+pad(n)+' não localizado');
  return {blob:await civilImage(n),title:row.title};
 }
 if(id==='cf'){
  const data=w.BASE_NATIVE_CONTENT?.cf?.['m'+pad(n)];
  const path=data?.mapUrl||'/assets/cf/m'+pad(n)+'-infografico.webp';
  const res=await fetch(path);if(!res.ok)throw Error('Infográfico CF M'+pad(n)+' indisponível (HTTP '+res.status+')');
  return {blob:await res.blob(),title:data?.title||'Módulo '+n};
 }
 if(id==='cpp'){
  const index=w.CPP_NATIVE_INDEX,mod=index?.modules?.find(m=>m.number===n),sprite=index?.sprite;
  if(!mod||!sprite)throw Error('Infográfico CPP M'+pad(n)+' indisponível');
  return {blob:await spriteCrop(sprite.src,mod.spriteX||0,mod.spriteY||0,mod.spriteWidth||sprite.width,mod.spriteHeight),title:mod.title};
 }
 if(id==='adm'){
  const index=w.ADM_NATIVE_INDEX,mod=Object.values(index?.modules||{}).find(m=>m.number===n),sprite=index?.sprite;
  if(!mod||!sprite)throw Error('Infográfico Administrativo M'+pad(n)+' indisponível');
  return {blob:await spriteCrop(sprite.src,0,mod.spriteY,sprite.width,mod.spriteHeight),title:mod.title};
 }
 throw Error('Disciplina sem infográfico estático integrado: '+id);
}
function filename(id,n,blob){return 'BASE_COMPLETA_'+id.toUpperCase()+'_M'+pad(n)+'_INFOGRAFICO.'+ext(blob.type)}
function save(name,blob){const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=name;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),30000)}
function crc(bytes){let c=-1;for(const b of bytes){c^=b;for(let i=0;i<8;i++)c=(c>>>1)^((c&1)?0xedb88320:0)}return (c^-1)>>>0}
async function zip(files){
 const enc=new TextEncoder(),out=[],central=[];let offset=0,size=0;
 for(const file of files){
  const name=enc.encode(file.name),bytes=new Uint8Array(await file.blob.arrayBuffer()),check=crc(bytes);
  const local=new Uint8Array(30+name.length),v=new DataView(local.buffer);
  v.setUint32(0,0x04034b50,true);v.setUint16(4,20,true);v.setUint16(6,0x0800,true);
  v.setUint32(14,check,true);v.setUint32(18,bytes.length,true);v.setUint32(22,bytes.length,true);v.setUint16(26,name.length,true);local.set(name,30);
  const center=new Uint8Array(46+name.length),c=new DataView(center.buffer);
  c.setUint32(0,0x02014b50,true);c.setUint16(4,20,true);c.setUint16(6,20,true);c.setUint16(8,0x0800,true);
  c.setUint32(16,check,true);c.setUint32(20,bytes.length,true);c.setUint32(24,bytes.length,true);c.setUint16(28,name.length,true);c.setUint32(42,offset,true);center.set(name,46);
  out.push(local,bytes);central.push(center);size+=center.length;offset+=local.length+bytes.length;
 }
 if(files.length>65535)throw Error('Arquivos demais para ZIP');
 const end=new Uint8Array(22),v=new DataView(end.buffer);v.setUint32(0,0x06054b50,true);v.setUint16(8,files.length,true);v.setUint16(10,files.length,true);v.setUint32(12,size,true);v.setUint32(16,offset,true);
 return new Blob([...out,...central,end],{type:'application/zip'});
}
function dialog(){
 if(document.querySelector('#bc-image-download-dialog'))return;
 const root=document.createElement('div');root.id='bc-image-download-dialog';
 root.innerHTML='<section role="dialog" aria-modal="true" aria-label="Baixar infográficos"><h2>Baixar imagens dos módulos</h2><p>Exporte os infográficos de uma disciplina ou de um módulo. As imagens de Processo Penal e Administrativo são recortadas automaticamente dos arquivos originais.</p><label>Disciplina<select data-discipline>'+COURSES.map(d=>'<option value="'+d[0]+'">'+d[1]+'</option>').join('')+'</select></label><label>Módulo (opcional)<input data-number type="number" min="1" placeholder="Todos os módulos"></label><div class="bc-image-actions"><button data-do-download type="button">Baixar imagens</button><button data-close type="button">Fechar</button></div><p role="status" aria-live="polite"></p></section>';
 document.body.append(root);
 const discipline=root.querySelector('[data-discipline]'),number=root.querySelector('[data-number]'),action=root.querySelector('[data-do-download]'),status=root.querySelector('[role=status]');
 function close(){root.remove();document.removeEventListener('keydown',key)}
 function key(e){if(e.key==='Escape')close()}
 document.addEventListener('keydown',key);root.querySelector('[data-close]').onclick=close;
 root.addEventListener('click',e=>{if(e.target===root)close()});
 action.onclick=async()=>{
  const d=COURSES.find(d=>d[0]===discipline.value),n=number.value?Number(number.value):null;
  if(n&&(!Number.isInteger(n)||n<1||n>d[2])){status.textContent='Escolha um módulo entre 1 e '+d[2]+'.';return}
  action.disabled=true;const files=[],warnings=[],nums=n?[n]:Array.from({length:d[2]},(_,i)=>i+1);
  for(let i=0;i<nums.length;i++){
   const num=nums[i];status.textContent='Preparando '+d[1]+' M'+pad(num)+' ('+(i+1)+'/'+nums.length+')...';
   try{const result=await imageFor(d[0],num);files.push({name:filename(d[0],num,result.blob),blob:result.blob})}
   catch(e){warnings.push('M'+pad(num)+': '+e.message)}
  }
  if(!files.length){status.textContent='Nenhuma imagem encontrada.\n'+warnings.join('\n');action.disabled=false;return}
  try{
   if(files.length===1&&!warnings.length)save(files[0].name,files[0].blob);
   else{
    const txt='BASE COMPLETA — RELATÓRIO DE IMAGENS\nDisciplina: '+d[1]+'\nImagens geradas: '+files.length+'\n\n'+(warnings.join('\n')||'Sem falhas detectadas.')+'\n';
    files.push({name:'RELATORIO_EXPORTACAO.txt',blob:new Blob(['\uFEFF'+txt],{type:'text/plain;charset=utf-8'})});
    save('BASE_COMPLETA_'+d[0].toUpperCase()+'_INFOGRAFICOS.zip',await zip(files));
   }
   status.textContent=files.length+' arquivo(s) preparado(s). '+warnings.length+' aviso(s).';
  }catch(e){status.textContent='Falha ao preparar download: '+e.message}
  action.disabled=false;
 };
}
function singleButtons(){
 const configs=[
  ['#civil-native-image-viewer','civil','#cv-img','[data-civil-native-module].open'],
  ['#cpp-native-image-viewer','cpp','svg','[data-cpp-native-module].open'],
  ['#adm-native-image-viewer','adm','svg','[data-adm-native]'],
  ['#cfNativeOverlay','cf','.cf-native-map img','.subject[data-id="cf"] .cf-module.open']
 ];
 // No ambiguous module guesses: resolve image numbers from titles or active module.
 configs.forEach(([selector,id,content])=>{
  const overlay=document.querySelector(selector);if(!overlay||overlay.hidden||overlay.querySelector('[data-bc-image-single]')||!overlay.querySelector(content))return;
  const heading=overlay.querySelector('header'),title=heading?.textContent||overlay.textContent.slice(0,90);
  const match=title.match(/\bM(?:ÓDULO\s*)?0?(\d{1,2})\b/i);
  if(!match)return;
  const n=Number(match[1]),btn=document.createElement('button');btn.type='button';btn.dataset.bcImageSingle='1';btn.textContent='↓ Baixar imagem';
  btn.onclick=async()=>{btn.disabled=true;try{const result=await imageFor(id,n);save(filename(id,n,result.blob),result.blob)}catch(e){alert(e.message)}finally{btn.disabled=false}};
  heading?.append(btn);
 });
}
const style=document.createElement('style');
style.textContent='#bc-image-download-dialog{position:fixed;inset:0;background:#020d21c9;z-index:210000;display:grid;place-items:center;padding:14px}#bc-image-download-dialog section{width:min(480px,100%);padding:22px;border-radius:15px;background:#12253d;color:#f5f8ff;border:1px solid #4b6b85;max-height:90vh;overflow:auto}#bc-image-download-dialog h2{font-size:20px;margin:0 0 9px}#bc-image-download-dialog p{font-size:12px;line-height:1.6;white-space:pre-line}#bc-image-download-dialog label{display:block;margin:14px 0;font-size:12px;font-weight:700}#bc-image-download-dialog input,#bc-image-download-dialog select{display:block;margin-top:6px;padding:10px;width:100%;box-sizing:border-box;border-radius:8px;background:#263d55;color:white;border:1px solid #63809e}.bc-image-actions{display:flex;gap:10px}.bc-image-actions button,#bc-image-download-dialog button{padding:9px 12px;cursor:pointer;border-radius:8px}#bc-image-download-dialog [data-do-download]{background:#0d82a4;color:white;border:1px solid #0d82a4}[data-bc-image-single]{margin-left:8px;padding:8px;border:1px solid #3c91b5;border-radius:8px;background:#133a54;color:white;cursor:pointer}';
document.head.append(style);
let queued=false;
function scan(){
 if(queued)return;queued=true;
 requestAnimationFrame(()=>{
  queued=false;
  const nav=document.querySelector('#centralSidebar .nav');
  if(nav&&!nav.querySelector('[data-bc-image-export]')){
   const b=document.createElement('button');b.type='button';b.dataset.bcImageExport='1';b.setAttribute('data-i','⬇');
   b.innerHTML='<span class="nav-icon">▧</span><span class="nav-text">Baixar imagens</span>';
   b.onclick=()=>{dialog();w.closeMobileSidebar?.()};
   const text=nav.querySelector('[data-bc-export-nav]');
   if(text)text.insertAdjacentElement('afterend',b);
   else nav.insertBefore(b,nav.querySelector('.nav-settings')||null);
  }
  singleButtons();
 });
}
function boot(){scan();new MutationObserver(scan).observe(document.body,{childList:true,subtree:true})}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
w.BaseCompletaImageExport={imageFor,zip,dialog};
})(window);
