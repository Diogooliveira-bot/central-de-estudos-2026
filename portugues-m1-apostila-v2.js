/* Português M1 — modo apostila v2
 * Camada visual/pedagógica segura sobre o PtM1V3.
 * Não altera a chave de progresso nem marca etapas automaticamente.
 */
(function(){
  'use strict';
  if(window.__PT_M1_APOSTILA_V2__)return;
  window.__PT_M1_APOSTILA_V2__=true;

  var CRITERIA={
    s1:{goal:'Entender a base sonora da ortografia sem confundir letra, fonema, dígrafo e encontro consonantal.',prove:['Explicar por que duas letras podem representar um único fonema.','Distinguir dígrafo de encontro consonantal em uma palavra.','Decidir se QU/GU formam dígrafo pela pronúncia do U.'],tip:'FCC e outras bancas gostam de misturar conceitos na mesma palavra. Não conte letras: identifique os sons.'},
    s2:{goal:'Reconhecer ditongo, tritongo e hiato pela relação entre vogal, semivogal e separação silábica.',prove:['Distinguir pais de país pela separação silábica.','Reconhecer ditongo crescente e decrescente quando isso for necessário.','Não confundir dígrafo nasal com ditongo nasal em final de palavra.'],tip:'Antes de classificar, separe as sílabas. Hiato depende de duas vogais em sílabas diferentes.'},
    s3:{goal:'Resolver acentuação começando pela tonicidade e pela terminação, sem decorar listas soltas.',prove:['Classificar uma palavra como oxítona, paroxítona ou proparoxítona.','Justificar o acento de uma palavra pela regra correta.','Distinguir a regra geral das paroxítonas da regra específica do ditongo oral.'],tip:'Se duas palavras têm tonicidades diferentes, em regra não são acentuadas pela mesma regra. A exceção importante é a regra do hiato.'},
    s4:{goal:'Aplicar a regra do hiato e suas exceções mais cobradas.',prove:['Aplicar I/U tônico em hiato, sozinho ou com S.','Lembrar que NH bloqueia o acento do hiato.','Distinguir feiura de Piauí e reconhecer Guaíba/Guaíra.'],tip:'Não tente decorar a teoria inteira de ditongos aqui. Grave os contrastes que o próprio material destaca.'},
    s5:{goal:'Dominar os poucos acentos diferenciais que permaneceram após a nova ortografia.',prove:['Distinguir pôde/pode e pôr/por.','Distinguir tem/têm e vem/vêm.','Aplicar singular/plural em mantém/mantêm e intervém/intervêm.'],tip:'O material recomenda não reviver a ortografia antiga: memorize apenas o que continua válido e os facultativos.'},
    s6:{goal:'Decidir o uso do hífen por padrões, não por uma lista impossível de palavras.',prove:['Aplicar letras iguais x diferentes na união com prefixos.','Aplicar a duplicação de R/S após prefixo terminado em vogal.','Reconhecer as regras especiais de H, bem/mal, pré/pró/pós, re/co e prefixos com hífen obrigatório.'],tip:'Comece pela regra geral e só depois procure exceções. Isso reduz muito a carga de memorização.'},
    s7:{goal:'Usar família lexical e padrões de formação para reduzir erros de grafia.',prove:['Distinguir -ês/-esa de -ez/-eza.','Distinguir -isar de -izar pela palavra-base quando possível.','Reconhecer famílias recorrentes com -cess-, -press-, -gress- e -miss-/-mess-.'],tip:'Ortografia é convenção: regra ajuda, mas leitura e questões consolidam a memória visual.'},
    s8:{goal:'Aplicar as convenções de siglas, abreviações, maiúsculas/minúsculas e regras complementares.',prove:['Grafar plural de siglas com s minúsculo.','Distinguir região geográfica de direção nos pontos cardeais.','Lembrar onde o trema ainda pode aparecer.'],tip:'Aqui a cobrança é mais literal. Faça revisão curta e objetiva.'},
    s9:{goal:'Eliminar confusões de grafia e sentido que geram erro fácil em prova.',prove:['Resolver mal/mau, há/a e os quatro porquês.','Resolver onde/aonde, a fim/afim e cessão/sessão/seção.','Resolver de encontro/ao encontro, senão/se não e pares de vocabulário.'],tip:'Troque a expressão por um sinônimo de teste. Ex.: mal↔bem; mau↔bom; porquê↔motivo.'},
    s10:{goal:'Usar as questões finais do PDF como teste de saída e diagnóstico, não como nova teoria.',prove:['Resolver antes de abrir o comentário.','Registrar o subtópico e a causa de cada erro real.','Voltar somente ao trecho teórico ligado ao erro.'],tip:'A meta do teste de saída é ≥80% sem erro crítico repetido; o domínio final continua dependendo do TEC.'}
  };

  function esc(v){return String(v==null?'':v).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}

  function injectStyle(){
    if(document.getElementById('pt-m1-apostila-v2-style'))return;
    var style=document.createElement('style');
    style.id='pt-m1-apostila-v2-style';
    style.textContent=`
      .ptm1.ptm1-apostila{max-width:1280px;margin:0 auto;padding:0 10px 40px;gap:0}
      .ptm1-apostila .ptm1-top{grid-template-columns:minmax(0,1fr) 150px 150px;margin-bottom:14px}
      .ptm1-apostila .ptm1-card{border-radius:8px;box-shadow:none}
      .ptm1-apostila .ptm1-warning{margin:8px 0 18px;border-radius:6px}
      .ptm1-route{margin:2px 0 22px;padding:14px 0 16px;border-top:1px solid var(--line);border-bottom:1px solid var(--line)}
      .ptm1-route-title{font-weight:800;font-size:13px;margin-bottom:9px}
      .ptm1-route-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:8px}
      .ptm1-route-step{padding:9px 10px;border-left:2px solid var(--line2);min-height:58px}
      .ptm1-route-step b{display:block;font-size:10.5px;margin-bottom:3px}.ptm1-route-step span{display:block;color:var(--muted);font-size:9.5px;line-height:1.45}
      .ptm1-apostila .ptm1-section{border:0;border-bottom:1px solid var(--line);border-radius:0;background:transparent}
      .ptm1-apostila .ptm1-head{padding:16px 4px;grid-template-columns:42px minmax(0,1fr) auto 28px}
      .ptm1-apostila .ptm1-head:hover{background:transparent}
      .ptm1-apostila .ptm1-n{border-radius:5px}
      .ptm1-apostila .ptm1-head span:nth-child(2)>b{font-size:14px;letter-spacing:-.01em}
      .ptm1-apostila .ptm1-head span:nth-child(2)>small{font-size:9.5px;margin-top:3px}
      .ptm1-apostila .ptm1-body{padding:0 4px 26px}
      .ptm1-apostila .ptm1-note{border-radius:5px;margin:0 0 12px}
      .ptm1-apostila .ptm1-theory{border:0;border-radius:0;background:transparent;overflow:visible;margin:0 auto 10px;max-width:1080px}
      .ptm1-apostila .ptm1-theory-head{background:transparent;padding:4px 0 12px;border-bottom:1px solid var(--line)}
      .ptm1-apostila .ptm1-theory-head b{font-size:16px;letter-spacing:-.015em}
      .ptm1-apostila .ptm1-theory-head small{font-size:10px;margin-top:4px}
      .ptm1-apostila .ptm1-theory-body{padding:18px 0 6px;display:block}
      .ptm1-apostila .ptm1-lesson{padding:0 0 18px;margin:0 0 18px;border-bottom:1px solid color-mix(in srgb,var(--line) 70%,transparent)}
      .ptm1-apostila .ptm1-lesson:last-of-type{border-bottom:0}
      .ptm1-apostila .ptm1-lesson h4{font-size:14px;margin:0 0 8px;letter-spacing:-.01em}
      .ptm1-apostila .ptm1-lesson p{font-size:var(--central-reading-font-large,16px)!important;line-height:1.75!important;max-width:none;color:var(--text)}
      .ptm1-apostila .ptm1-memory{margin:8px 0 0;padding:13px 16px;border-radius:4px;border-left:3px solid var(--purple);background:color-mix(in srgb,var(--panel2) 72%,transparent)}
      .ptm1-apostila .ptm1-memory b{font-size:11px}.ptm1-apostila .ptm1-memory li{font-size:var(--central-reading-font-medium,13px)!important;line-height:1.6!important}
      .ptm1-old-outline{display:none!important}
      .ptm1-teacher{max-width:1080px;margin:0 auto 14px;padding:15px 0;border-top:1px solid var(--line)}
      .ptm1-teacher-label{font-size:9px;font-weight:850;text-transform:uppercase;letter-spacing:.1em;color:var(--muted);margin-bottom:6px}
      .ptm1-teacher h4{font-size:14px;margin:0 0 6px}.ptm1-teacher p{font-size:var(--central-reading-font-medium,13px)!important;line-height:1.65;margin:0;color:var(--text)}
      .ptm1-teacher-tip{margin-top:10px;padding-left:12px;border-left:2px solid var(--yellow)}
      .ptm1-exit{max-width:1080px;margin:8px auto 14px;padding:14px 16px;border:1px solid var(--line);border-radius:6px;background:color-mix(in srgb,var(--panel) 70%,transparent)}
      .ptm1-exit b{font-size:11px}.ptm1-exit ul{margin:8px 0 0;padding-left:19px}.ptm1-exit li{font-size:var(--central-reading-font-medium,13px)!important;line-height:1.6;margin:5px 0}
      .ptm1-apostila .ptm1-actions,.ptm1-apostila .ptm1-mini{max-width:1080px;margin-left:auto;margin-right:auto}
      .ptm1-apostila .ptm1-list{display:none}
      .ptm1-apostila .ptm1-revs{gap:8px}.ptm1-apostila .ptm1-rev{border-radius:6px}
      @media(max-width:780px){
        .ptm1.ptm1-apostila{padding-left:4px;padding-right:4px}.ptm1-route-grid{grid-template-columns:1fr 1fr}.ptm1-apostila .ptm1-top{grid-template-columns:1fr 1fr}.ptm1-apostila .ptm1-top .ptm1-card:first-child{grid-column:1/-1}.ptm1-apostila .ptm1-theory-head b{font-size:15px}.ptm1-apostila .ptm1-head{grid-template-columns:38px minmax(0,1fr) 24px}.ptm1-apostila .ptm1-done{display:none}
      }
      @media(max-width:520px){.ptm1-route-grid{grid-template-columns:1fr}.ptm1-apostila .ptm1-top{grid-template-columns:1fr}.ptm1-apostila .ptm1-top .ptm1-card:first-child{grid-column:auto}}
    `;
    document.head.appendChild(style);
  }

  function removeAnki(root){
    root.querySelectorAll('.ptm1-section').forEach(function(section){
      var head=section.querySelector('.ptm1-head');
      if(head && /Anki seletivo/i.test(head.textContent||''))section.remove();
    });
    root.querySelectorAll('[data-ptm1] .ptm1-head small').forEach(function(el){
      el.textContent=(el.textContent||'').replace(/\s*·\s*Anki-base:\s*[^·]+/ig,'').trim();
    });
    root.querySelectorAll('[data-ptm1] li').forEach(function(li){
      if(/\bAnki\b/i.test(li.textContent||''))li.remove();
    });
    root.querySelectorAll('.ptm1-rev small').forEach(function(el){
      var text=(el.textContent||'').trim();
      if(/5–10 min/i.test(text))el.textContent='5–10 min, pontos marcados + revisão dirigida da teoria.';
      else if(/caderno de erros/i.test(text))el.textContent='Caderno de erros + cerca de 10 questões do TEC.';
      else el.textContent=text.replace(/Anki\s*\+?\s*/gi,'').trim();
    });
  }

  function routeHtml(){
    return '<section class="ptm1-route" aria-label="Rota do módulo">'+
      '<div class="ptm1-route-title">Rota do M1 — Ortografia e Acentuação</div>'+
      '<div class="ptm1-route-grid">'+
      '<div class="ptm1-route-step"><b>1 · Base</b><span>S1–S3: fonologia, encontros vocálicos e regras gerais.</span></div>'+
      '<div class="ptm1-route-step"><b>2 · Diagnóstico</b><span>TEC R1: 20 questões sem consulta para localizar lacunas.</span></div>'+
      '<div class="ptm1-route-step"><b>3 · Consolidação</b><span>S4–S9 + TEC R2: exceções, hífen, grafia e expressões.</span></div>'+
      '<div class="ptm1-route-step"><b>4 · Saída</b><span>S10 + TEC final + caderno de erros + revisões 24h/7d/30d.</span></div>'+
      '</div></section>';
  }

  function decorateSession(section,id){
    var c=CRITERIA[id];
    if(!c)return;
    var body=section.querySelector('.ptm1-body');
    if(!body||body.querySelector('.ptm1-teacher'))return;
    var theory=body.querySelector('.ptm1-theory');
    var teacher=document.createElement('section');
    teacher.className='ptm1-teacher';
    teacher.innerHTML='<div class="ptm1-teacher-label">Objetivo da sessão</div><h4>'+esc(c.goal)+'</h4><div class="ptm1-teacher-tip"><div class="ptm1-teacher-label">Olhar de prova</div><p>'+esc(c.tip)+'</p></div>';
    if(theory)theory.insertAdjacentElement('afterend',teacher);else body.insertBefore(teacher,body.firstChild);

    var exit=document.createElement('section');
    exit.className='ptm1-exit';
    exit.innerHTML='<b>Antes de marcar “concluída”, confirme que você consegue:</b><ul>'+c.prove.map(function(x){return '<li>'+esc(x)+'</li>'}).join('')+'</ul>';
    var actions=body.querySelector('.ptm1-actions,.ptm1-mini');
    if(actions)body.insertBefore(exit,actions);else body.appendChild(exit);
  }

  function transform(html){
    injectStyle();
    var host=document.createElement('div');
    host.innerHTML=html;
    var root=host.querySelector('.ptm1');
    if(!root)return html;
    root.classList.add('ptm1-apostila');
    removeAnki(root);
    root.querySelectorAll('.ptm1-old-outline').forEach(function(x){x.remove()});
    if(!root.querySelector('.ptm1-route')){
      var warning=root.querySelector('.ptm1-warning');
      if(warning)warning.insertAdjacentHTML('afterend',routeHtml());
      else root.insertAdjacentHTML('afterbegin',routeHtml());
    }
    Object.keys(CRITERIA).forEach(function(id){var s=root.querySelector('[data-ptm1="'+id+'"]');if(s)decorateSession(s,id)});
    return host.innerHTML;
  }

  function install(){
    if(typeof window.renderPortugueseMaster!=='function')return setTimeout(install,80);
    if(window.renderPortugueseMaster.__apostilaV2)return;
    var base=window.renderPortugueseMaster;
    var wrapped=function(){return transform(base())};
    wrapped.__apostilaV2=true;
    window.renderPortugueseMaster=wrapped;
    try{if(typeof window.renderSubjects==='function')window.renderSubjects()}catch(e){console.warn('[PT M1 APOSTILA V2]',e)}
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',install,{once:true});
  else install();
})();
