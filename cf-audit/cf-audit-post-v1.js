/* CF M1-M12 audit UI/runtime patch */
(function(){'use strict';
try{
 if(typeof cfPool==='function'){window.__cfPoolPreAudit=cfPool;cfPool=function(w){return CF_QUESTIONS.filter(q=>!q.auditArchived&&w.topics.includes(q.t));};}
 if(typeof cfStats==='function'){window.__cfStatsPreAudit=cfStats;cfStats=function(){const st=cfState();let answered=0,correct=0,wrongIds=[];CF_QUESTIONS.filter(q=>!q.auditArchived).forEach(q=>{const a=st.answers?.[q.id];if(a?.attempts){answered++;if(a.lastCorrect)correct++;if(a.everWrong&&!a.lastCorrect)wrongIds.push(q.id)}});return {answered,correct,wrongIds,accuracy:answered?Math.round(correct/answered*1000)/10:0};};}
 if(typeof renderCfModule==='function'){
  const original=renderCfModule;window.__renderCfModulePreAudit=original;
  renderCfModule=function(w){let out=original(w);const cards=[];
   const box=(label,arr)=>Array.isArray(arr)&&arr.length?`<details class="cf-syllabus cf-audit-block"><summary>${label} • ${arr.length}</summary><div class="cf-theory-grid" style="margin-top:9px">${arr.map(x=>`<div class="cf-theory"><details><summary>${esc(x[0]||label)}</summary><div class="cf-theory-text">${esc(x[1]||'')}</div></details></div>`).join('')}</div></details>`:'';
   cards.push(box('🛟 Porto Seguro FCC',w.portoSeguro));cards.push(box('🧠 Decorar',w.decorar));cards.push(box('⚠ Pegadinhas FCC',w.pegadinhas));
   const extra=cards.join('');if(extra)out=out.replace('<details class="cf-resources">',extra+'<details class="cf-resources">');return out;
  };
 }
 if(typeof renderAll==='function'){setTimeout(()=>{try{renderAll()}catch(e){}},0)}
}catch(e){console.warn('CF audit UI patch',e)}
})();
