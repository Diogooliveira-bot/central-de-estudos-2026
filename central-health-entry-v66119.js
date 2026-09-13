(function(){
'use strict';
if(window.__centralHealthEntryV66119)return;
window.__centralHealthEntryV66119=true;
function add(){
 var body=document.querySelector('.central-settings-body');
 if(!body||document.getElementById('centralHealthEntry'))return;
 var block=document.createElement('div');
 block.id='centralHealthEntry';
 block.className='central-settings-note';
 block.style.marginTop='10px';
 block.innerHTML='<b>Saúde da Central</b><br><span>Verifique armazenamento, versão, ferramentas e funcionamento offline sem alterar seus dados.</span><div style="margin-top:9px"><a href="/tools/diagnostico.html" class="central-btn-sec" style="display:inline-flex;text-decoration:none">Verificar saúde da Central</a></div>';
 body.appendChild(block);
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',add,{once:true});else add();
})();
