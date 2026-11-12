(function(){
'use strict';

const KEY='central-v6:pt:m8:v1';
let state={};
try{state=JSON.parse(localStorage.getItem(KEY)||'{}')||{}}catch(_){state={}}
state.read=state.read||{};
state.activeSession=state.activeSession||'s1';

function save(){
  try{localStorage.setItem(KEY,JSON.stringify(state))}catch(e){console.warn('[PT M8 save]',e)}
  updateProgress();
  notifyResize();
}

function esc(v){
  return String(v==null?'':v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}

function notifyResize(){
  try{
    if(window.parent&&window.frameElement&&window.parent.PtM6V1&&typeof window.parent.PtM6V1.resize==='function'){
      window.parent.PtM6V1.resize(window.frameElement);
    }
  }catch(_){}
}

function renderTheory(){
  const host=document.getElementById('m8Theory');
  if(!host||!Array.isArray(window.PT_M8_SESSIONS))return;
  host.innerHTML=window.PT_M8_SESSIONS.map((s,i)=>
    '<details class="session" data-session="'+esc(s.id)+'" '+(state.activeSession===s.id?'open':'')+'>'+ 
      '<summary><span class="session-no">'+String(i+1).padStart(2,'0')+'</span><span>'+esc(s.title)+'</span></summary>'+ 
      '<div class="body">'+s.html+
        '<label class="check"><input type="checkbox" data-read="'+esc(s.id)+'"> <span>Li e entendi esta sessão</span></label>'+ 
      '</div>'+ 
    '</details>'
  ).join('');

  host.querySelectorAll('.session').forEach(d=>{
    d.addEventListener('toggle',()=>{
      if(d.open){
        state.activeSession=d.dataset.session;
        try{localStorage.setItem(KEY,JSON.stringify(state))}catch(_){}
        setTimeout(notifyResize,40);
      }
    });
  });
  host.querySelectorAll('[data-read]').forEach(b=>{
    b.checked=!!state.read[b.dataset.read];
    b.addEventListener('change',()=>{
      state.read[b.dataset.read]=b.checked;
      save();
    });
  });
  updateProgress();
  setTimeout(notifyResize,80);
}

function updateProgress(){
  const total=Array.isArray(window.PT_M8_SESSIONS)?window.PT_M8_SESSIONS.length:8;
  const done=Object.keys(state.read).filter(k=>state.read[k]).length;
  const pct=total?Math.round(done/total*100):0;
  const p=document.getElementById('pct'), bar=document.getElementById('bar'), c=document.getElementById('readCount');
  if(p)p.textContent=pct+'%';
  if(bar)bar.style.width=pct+'%';
  if(c)c.textContent=done+' de '+total+' sessões';
}

function parentWindow(){
  try{return window.parent&&window.parent!==window?window.parent:null}catch(_){return null}
}

function tecData(){
  const p=parentWindow();
  try{
    const data=p&&p.TEC_CADERNOS_DATA;
    return data&&Array.isArray(data.cadernos)?data.cadernos:[];
  }catch(_){return []}
}

function scoreTec(c){
  const grupo=String(c&&c.grupoNome||'');
  if(grupo&&grupo!=='Língua Portuguesa'&&grupo!=='Português')return -100;
  const nome=String(c&&c.nome||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
  let score=0;
  if(/sintaxe/.test(nome))score+=100;
  if(/analise sintatica|funcoes sintaticas|funcao sintatica/.test(nome))score+=80;
  if(/termos da oracao|estrutura da oracao/.test(nome))score+=60;
  if(/sujeito|complementos/.test(nome))score+=20;
  if(String(c&&c.id)==='port-10')score+=25;
  return score;
}

function resolveTec(){
  const list=tecData();
  if(!list.length)return null;
  const ranked=list.map(c=>({c,score:scoreTec(c)})).filter(x=>x.score>0).sort((a,b)=>b.score-a.score);
  if(ranked.length)return ranked[0].c;
  return list.find(c=>String(c.id)==='port-10')||null;
}

function renderTec(){
  const host=document.getElementById('m8Tec');
  if(!host)return;
  const c=resolveTec();
  if(c){
    const qtd=Number(c.questoes)||0;
    host.innerHTML=
      '<div class="tec-card">'+
        '<div><span class="eyebrow">Caderno localizado na Central</span>'+ 
        '<h2>'+esc(String(c.id||'').toUpperCase().replace(/-(\d+)$/,(_,n)=>' '+String(n).padStart(2,'0')))+' — '+esc(c.nome||'Sintaxe da Oração')+'</h2>'+ 
        '<p>'+ (qtd?esc(new Intl.NumberFormat('pt-BR').format(qtd))+' questões no caderno já cadastrado. ':'') +'O endereço é reutilizado da própria Central; nenhum link novo foi criado.</p></div>'+ 
        '<button class="tec-open" id="m8OpenTec">Abrir questões no TEC ↗</button>'+ 
      '</div>'+ 
      '<div class="tec-guide"><b>Ordem sugerida de treino</b><p>Sujeito e ordem inversa → complementos verbais → CN × AA → predicativos → SE/QUE → análise sintática completa.</p></div>';
    const btn=document.getElementById('m8OpenTec');
    if(btn)btn.onclick=openTec;
  }else{
    host.innerHTML=
      '<div class="tec-card"><div><span class="eyebrow">Questões</span><h2>Sintaxe da Oração — TEC</h2>'+ 
      '<p>Abra este módulo pela Central para que o caderno já cadastrado seja localizado automaticamente.</p></div>'+ 
      '<button class="tec-open" id="m8OpenTec">Abrir Cadernos TEC</button></div>';
    const btn=document.getElementById('m8OpenTec');
    if(btn)btn.onclick=openTec;
  }
  notifyResize();
}

function openTec(){
  const p=parentWindow();
  const c=resolveTec();
  try{
    if(c&&c.url){
      if(p&&typeof p.tecAbrirCaderno==='function'){p.tecAbrirCaderno(c.url);return false}
      window.open(c.url,'_blank','noopener');
      return false;
    }
    if(p&&typeof p.centralSidebarAction==='function'){
      p.centralSidebarAction('tec-cadernos');
      setTimeout(()=>{
        try{
          const q=p.document.getElementById('tecBusca');
          if(q){q.value='sintaxe';if(typeof p.tecCadernosRender==='function')p.tecCadernosRender()}
        }catch(_){}
      },120);
      return false;
    }
    if(p&&typeof p.openTecCadernos==='function'){p.openTecCadernos();return false}
  }catch(e){console.warn('[PT M8 TEC]',e)}
  alert('Abra “Cadernos TEC” na Central e pesquise por Sintaxe.');
  return false;
}

function bindTabs(){
  document.querySelectorAll('.tab').forEach(btn=>{
    btn.addEventListener('click',()=>{
      document.querySelectorAll('.tab').forEach(x=>x.classList.remove('active'));
      document.querySelectorAll('.panel').forEach(x=>x.classList.remove('active'));
      btn.classList.add('active');
      const panel=document.getElementById(btn.dataset.tab);
      if(panel)panel.classList.add('active');
      if(btn.dataset.tab==='tec')renderTec();
      setTimeout(notifyResize,50);
    });
  });
}

window.PtM8Runtime={openTec,renderTec};
renderTheory();
renderTec();
bindTabs();
updateProgress();
setTimeout(renderTec,500);
setTimeout(renderTec,1500);
})();
