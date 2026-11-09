/* Base Completa · Política de questões internas (10 + 10).
 * O resumo usa exclusivamente o banco autoral já presente na plataforma
 * (até sua substituição por dez itens novos criados e auditados).
 * A teoria completa reserva dez vagas para questões reais de bancas.
 * NUNCA apresenta questões autorais como se fossem oficiais.
 */
(function(g){
 'use strict';
 if(g.CentralInternalQuestionPolicy)return;
 const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const TARGET=10;
 function key(q){return String(q?.q??q?.prompt??q?.stem??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/\s+/g,' ').trim()}
 function authorial(summary,legacy,options={}){
  const allow=q=>q&&typeof q==='object'&&!q.banca&&!q.board&&!q.exam&&!q.concurso&&!q.sourceUrl&&!q.source_url&&!q.official;
  const list=[],seen=new Set();
  for(const q of [...(summary||[]),...(legacy||[])]){
   if(!allow(q))continue;
   const k=key(q);if(!k||seen.has(k))continue;
   list.push(q);seen.add(k);
   if(list.length===TARGET)break;
  }
  return list;
 }
 function missing(count){return Math.max(0,TARGET-Math.max(0,Number(count)||0))}
 function noticeHtml(){
  return '<section class="bc-bank-pending" role="status" aria-live="polite">'+
   '<span class="bc-bank-pending-label">VERSÃO COMPLETA · 10 QUESTÕES</span>'+
   '<h2>Questões de bancas reais — em breve</h2>'+
   '<p>Esta bateria terá <strong>10 questões oficiais de concursos</strong>, selecionadas e conferidas antes de serem disponibilizadas.</p>'+
   '<p>Por enquanto, não há questões nesta seção. A teoria completa permanece disponível para leitura.</p>'+
   '</section>';
 }
 function modal(subject='Base Completa',moduleTitle=''){
  const prior=document.getElementById('bc-internal-pending-modal');if(prior)prior.remove();
  const overlay=document.createElement('div');overlay.id='bc-internal-pending-modal';
  overlay.className='bc-bank-pending-overlay';overlay.setAttribute('role','presentation');
  overlay.innerHTML='<section role="dialog" aria-modal="true" aria-label="Questões oficiais em breve" tabindex="-1" class="bc-bank-pending-dialog">'+
   '<header><div><b>'+esc(subject)+'</b><small>'+esc(moduleTitle)+'</small></div><button type="button" data-bank-close aria-label="Fechar">×</button></header>'+
   noticeHtml()+'<footer><button type="button" data-bank-close>Voltar ao módulo</button></footer></section>';
  const prev=document.activeElement;
  const dismiss=()=>{overlay.remove();document.removeEventListener('keydown',onKey);if(prev?.isConnected)prev.focus()};
  const onKey=e=>{if(e.key==='Escape')dismiss()};
  overlay.querySelectorAll('[data-bank-close]').forEach(b=>b.addEventListener('click',dismiss));
  overlay.addEventListener('mousedown',e=>{if(e.target===overlay)dismiss()});
  document.addEventListener('keydown',onKey);
  document.body.appendChild(overlay);
  overlay.querySelector('[data-bank-close]')?.focus();
  return false;
 }
 g.CentralInternalQuestionPolicy=Object.freeze({target:TARGET,authorial,missing,noticeHtml,modal});
})(window);
