(function(global){
'use strict';

const SUBJECT='penal';
const MODULE_SELECTOR='#subjects .subject[data-id="penal"] .cf-module[data-cf]';
const ENTRY_CLASS='bc-mindmap-entry';
const OVERLAY_ID='bcMindMapOverlay';
const registry=new Map();
let current=null;
let observer=null;

function esc(value){
  return String(value==null?'':value).replace(/[&<>"']/g,function(c){
    return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];
  });
}
function cleanText(value){
  return String(value||'').replace(/\s+/g,' ').replace(/^[#•·\-–—\s]+/,'').trim();
}
function key(subject,moduleId){ return String(subject)+':'+String(moduleId); }

function theoryData(moduleId){
  const data=global.PENAL_FULL_THEORY||{};
  return data[moduleId]||null;
}
function moduleTitle(module){
  return cleanText(
    module.querySelector('.cf-module-title,.civil-module-title,.cpp-mod-title,.topic-title')?.textContent ||
    theoryData(module.dataset.penal)?.title ||
    'Mapa mental'
  );
}
function moduleNumber(module,moduleId){
  const data=theoryData(moduleId);
  return data?.module || cleanText(module.querySelector('.cf-module-no')?.textContent).replace(/\D+/g,'') || '';
}

function makeNode(label,depth){
  return {
    id:'mm-'+Math.random().toString(36).slice(2,10),
    label:cleanText(label),
    depth:depth||0,
    children:[],
    expanded:(depth||0)<2
  };
}

function extractTreeFromTheory(moduleId,fallbackTitle){
  const custom=registry.get(key(SUBJECT,moduleId));
  if(custom) return cloneTree(custom);

  const d=theoryData(moduleId);
  const root=makeNode(d?.title || fallbackTitle || 'Mapa mental',0);
  root.expanded=true;
  if(!d?.html){
    root.children.push(makeNode('Conteúdo do mapa ainda não disponível',1));
    return root;
  }

  const host=document.createElement('div');
  host.innerHTML=d.html;
  const headings=Array.from(host.querySelectorAll('h1,h2,h3,h4'))
    .map(function(el){ return {level:Number(el.tagName.slice(1)), text:cleanText(el.textContent), el:el}; })
    .filter(function(x){ return x.text && !/^(sumário|sumario|índice|indice)$/i.test(x.text); });

  while(headings.length && cleanText(headings[0].text).toLocaleLowerCase('pt-BR') === cleanText(root.label).toLocaleLowerCase('pt-BR')){
    headings.shift();
  }

  if(!headings.length){
    const fallback=Array.from(host.querySelectorAll('strong,b'))
      .map(function(el){return cleanText(el.textContent);})
      .filter(function(t){return t.length>3 && t.length<100;})
      .slice(0,10);
    fallback.forEach(function(t){ root.children.push(makeNode(t,1)); });
    return root;
  }

  const minLevel=Math.min.apply(null,headings.map(function(h){return h.level;}));
  const stack=[{level:minLevel-1,node:root}];

  headings.forEach(function(h){
    const normalized=Math.max(1,h.level-minLevel+1);
    while(stack.length>1 && stack[stack.length-1].level>=h.level) stack.pop();
    const parent=stack[stack.length-1]?.node || root;
    const node=makeNode(h.text,normalized);
    parent.children.push(node);
    stack.push({level:h.level,node:node});
  });

  // Se a teoria só trouxer poucos títulos, aproveita listas curtas como folhas,
  // sempre derivadas do próprio conteúdo do módulo.
  if(root.children.length<3){
    const bullets=Array.from(host.querySelectorAll('li'))
      .map(function(el){return cleanText(el.textContent);})
      .filter(function(t){return t.length>=8 && t.length<=125;})
      .slice(0,12);
    bullets.forEach(function(t){ root.children.push(makeNode(t,1)); });
  }

  return root;
}

function cloneTree(input,depth){
  depth=depth||0;
  const node=makeNode(input.label||input.title||'Tópico',depth);
  node.expanded = input.expanded!==undefined ? !!input.expanded : depth<2;
  (input.children||[]).forEach(function(child){ node.children.push(cloneTree(child,depth+1)); });
  return node;
}

function walk(node,fn){
  fn(node);
  node.children.forEach(function(ch){walk(ch,fn);});
}
function setExpanded(node,value,rootOnly){
  walk(node,function(n){
    if(n===node && rootOnly) n.expanded=true;
    else n.expanded=!!value;
  });
  node.expanded=true;
}
function visibleChildren(node){
  return node.expanded ? node.children : [];
}
function leafWeight(node){
  const kids=visibleChildren(node);
  if(!kids.length) return 1;
  return kids.reduce(function(sum,ch){return sum+leafWeight(ch);},0);
}
function maxVisibleDepth(node,depth){
  depth=depth||0;
  const kids=visibleChildren(node);
  if(!kids.length) return depth;
  return Math.max.apply(null,kids.map(function(ch){return maxVisibleDepth(ch,depth+1);}));
}

function layoutTree(root){
  const row=74;
  const col=278;
  const nodeW=218;
  const nodeH=54;
  const top=42;
  const left=42;
  let cursor=0;
  const nodes=[];
  const edges=[];

  function place(node,depth,parent){
    const kids=visibleChildren(node);
    let y;
    if(!kids.length){
      y=top+(cursor*row);
      cursor+=1;
    }else{
      const childPoints=[];
      kids.forEach(function(ch){
        childPoints.push(place(ch,depth+1,node));
      });
      y=(childPoints[0].y+childPoints[childPoints.length-1].y)/2;
    }
    const x=left+depth*col;
    const placed={node:node,x:x,y:y,w:nodeW,h:nodeH,depth:depth};
    nodes.push(placed);
    if(parent){
      const p=nodes.find(function(n){return n.node===parent;});
      // parent pode ainda não estar em nodes; arestas são resolvidas numa segunda passagem.
    }
    return placed;
  }

  place(root,0,null);
  const byId=new Map(nodes.map(function(n){return [n.node.id,n];}));
  nodes.forEach(function(p){
    visibleChildren(p.node).forEach(function(ch){
      const c=byId.get(ch.id);
      if(c) edges.push({from:p,to:c});
    });
  });

  const leaves=Math.max(1,leafWeight(root));
  const depth=maxVisibleDepth(root,0);
  return {
    nodes:nodes,
    edges:edges,
    width:left*2+(depth+1)*col,
    height:Math.max(260,top*2+leaves*row)
  };
}

function nodeSvg(p){
  const n=p.node;
  const has=n.children.length>0;
  const markerX=p.w-18;
  const sign=n.expanded?'−':'+';
  return '<g class="bc-mindmap-node '+(p.depth===0?'root ':'')+'level-'+p.depth+'" data-mm-node="'+esc(n.id)+'" tabindex="0" role="button" aria-label="'+esc(n.label)+(has ? (n.expanded?' — recolher':' — abrir') : '')+'" transform="translate('+p.x+','+p.y+')">'+
    '<rect class="bc-mindmap-node-rect" width="'+p.w+'" height="'+p.h+'"></rect>'+
    '<foreignObject x="0" y="0" width="'+(has?p.w-30:p.w)+'" height="'+p.h+'"><div xmlns="http://www.w3.org/1999/xhtml" class="bc-mindmap-node-text" title="'+esc(n.label)+'">'+esc(n.label)+'</div></foreignObject>'+
    (has?'<circle class="bc-mindmap-toggle-dot" cx="'+markerX+'" cy="'+(p.h/2)+'" r="9"></circle><text class="bc-mindmap-toggle-mark" x="'+markerX+'" y="'+(p.h/2+4)+'" text-anchor="middle">'+sign+'</text>':'')+
    '</g>';
}
function edgeSvg(e){
  const x1=e.from.x+e.from.w;
  const y1=e.from.y+e.from.h/2;
  const x2=e.to.x;
  const y2=e.to.y+e.to.h/2;
  const bend=Math.max(44,(x2-x1)*.46);
  return '<path class="bc-mindmap-edge" d="M '+x1+' '+y1+' C '+(x1+bend)+' '+y1+', '+(x2-bend)+' '+y2+', '+x2+' '+y2+'"></path>';
}

function findNode(root,id){
  if(root.id===id) return root;
  for(const ch of root.children){
    const found=findNode(ch,id);
    if(found) return found;
  }
  return null;
}

function render(){
  if(!current) return;
  const layout=layoutTree(current.root);
  current.layout=layout;
  const svg=current.svg;
  svg.setAttribute('width',layout.width);
  svg.setAttribute('height',layout.height);
  svg.setAttribute('viewBox','0 0 '+layout.width+' '+layout.height);
  svg.innerHTML=
    '<g aria-hidden="true">'+layout.edges.map(edgeSvg).join('')+'</g>'+
    '<g>'+layout.nodes.map(nodeSvg).join('')+'</g>';

  svg.querySelectorAll('[data-mm-node]').forEach(function(el){
    function toggle(){
      const n=findNode(current.root,el.dataset.mmNode);
      if(!n || !n.children.length) return;
      n.expanded=!n.expanded;
      render();
    }
    el.addEventListener('click',function(ev){ev.stopPropagation();toggle();});
    el.addEventListener('keydown',function(ev){
      if(ev.key==='Enter'||ev.key===' '){ev.preventDefault();toggle();}
    });
  });
}

function updateTransform(){
  if(!current) return;
  current.world.style.transform='translate('+current.tx+'px,'+current.ty+'px) scale('+current.scale+')';
  const label=document.getElementById('bcMindMapZoomLabel');
  if(label) label.textContent=Math.round(current.scale*100)+'%';
}
function fit(){
  if(!current) return;
  const stage=current.stage;
  const layout=current.layout||layoutTree(current.root);
  const pad=36;
  const sx=(stage.clientWidth-pad*2)/Math.max(1,layout.width);
  const sy=(stage.clientHeight-pad*2)/Math.max(1,layout.height);
  current.scale=Math.max(.18,Math.min(1.15,sx,sy));
  current.tx=(stage.clientWidth-layout.width*current.scale)/2;
  current.ty=(stage.clientHeight-layout.height*current.scale)/2;
  updateTransform();
}
function center(){
  if(!current) return;
  const stage=current.stage;
  const layout=current.layout||layoutTree(current.root);
  current.tx=(stage.clientWidth-layout.width*current.scale)/2;
  current.ty=(stage.clientHeight-layout.height*current.scale)/2;
  updateTransform();
}
function zoom(delta){
  if(!current) return;
  const stage=current.stage;
  const old=current.scale;
  const next=Math.max(.18,Math.min(2.5,old+delta));
  const cx=stage.clientWidth/2;
  const cy=stage.clientHeight/2;
  const worldX=(cx-current.tx)/old;
  const worldY=(cy-current.ty)/old;
  current.scale=next;
  current.tx=cx-worldX*next;
  current.ty=cy-worldY*next;
  updateTransform();
}
function actual(){
  if(!current) return;
  current.scale=1;
  center();
}
async function fullscreen(){
  const ov=document.getElementById(OVERLAY_ID);
  if(!ov) return;
  try{
    if(!document.fullscreenElement) await ov.requestFullscreen();
    else await document.exitFullscreen();
  }catch(_){}
}
function close(){
  const ov=document.getElementById(OVERLAY_ID);
  if(ov) ov.remove();
  document.body.style.overflow='';
  current=null;
}

function bindPanZoom(){
  if(!current) return;
  const stage=current.stage;
  let dragging=false;
  let pointerId=null;
  let sx=0,sy=0,tx=0,ty=0;

  stage.addEventListener('pointerdown',function(ev){
    if(ev.target.closest && ev.target.closest('.bc-mindmap-node')) return;
    dragging=true;
    pointerId=ev.pointerId;
    sx=ev.clientX;sy=ev.clientY;tx=current.tx;ty=current.ty;
    stage.classList.add('dragging');
    try{stage.setPointerCapture(pointerId);}catch(_){}
  });
  stage.addEventListener('pointermove',function(ev){
    if(!dragging || ev.pointerId!==pointerId) return;
    current.tx=tx+(ev.clientX-sx);
    current.ty=ty+(ev.clientY-sy);
    updateTransform();
  });
  function end(ev){
    if(!dragging) return;
    dragging=false;
    stage.classList.remove('dragging');
    try{stage.releasePointerCapture(pointerId);}catch(_){}
  }
  stage.addEventListener('pointerup',end);
  stage.addEventListener('pointercancel',end);

  stage.addEventListener('wheel',function(ev){
    ev.preventDefault();
    if(ev.ctrlKey||ev.metaKey){
      zoom(ev.deltaY<0?.08:-.08);
    }else{
      current.tx-=ev.deltaX;
      current.ty-=ev.deltaY;
      updateTransform();
    }
  },{passive:false});
}

function open(subject,moduleId,sourceModule){
  const d=subject===SUBJECT ? theoryData(moduleId) : null;
  const title=d?.title || (sourceModule ? moduleTitle(sourceModule) : 'Mapa mental');
  const number=sourceModule ? moduleNumber(sourceModule,moduleId) : (d?.module||'');
  const root=extractTreeFromTheory(moduleId,title);

  close();
  const ov=document.createElement('div');
  ov.id=OVERLAY_ID;
  ov.className='bc-mindmap-overlay';
  ov.setAttribute('role','dialog');
  ov.setAttribute('aria-modal','true');
  ov.setAttribute('aria-label','Mapa mental interativo');
  ov.innerHTML=
    '<section class="bc-mindmap-shell">'+
      '<header class="bc-mindmap-head">'+
        '<div class="bc-mindmap-title"><b>🧠 '+esc(number?'PEN M'+number+' — '+title:title)+'</b><small>Mapa mental interativo • clique nos nós para abrir ou recolher ramos</small></div>'+
        '<button type="button" class="bc-mindmap-close" data-mm-action="close" aria-label="Fechar">×</button>'+
      '</header>'+
      '<div class="bc-mindmap-toolbar" aria-label="Controles do mapa mental">'+
        '<button type="button" data-mm-action="zoomout" aria-label="Diminuir zoom">−</button>'+
        '<span class="bc-mindmap-zoom-label" id="bcMindMapZoomLabel">100%</span>'+
        '<button type="button" data-mm-action="zoomin" aria-label="Aumentar zoom">+</button>'+
        '<button type="button" class="bc-mindmap-tool-primary" data-mm-action="fit">Ajustar</button>'+
        '<button type="button" data-mm-action="actual">100%</button>'+
        '<button type="button" data-mm-action="center">Centralizar</button>'+
        '<button type="button" data-mm-action="expand">Expandir tudo</button>'+
        '<button type="button" data-mm-action="collapse">Recolher tudo</button>'+
        '<button type="button" data-mm-action="fullscreen">Tela cheia</button>'+
        '<span class="bc-mindmap-hint">Arraste para mover • Ctrl + roda para zoom</span>'+
      '</div>'+
      '<div class="bc-mindmap-stage" id="bcMindMapStage">'+
        '<div class="bc-mindmap-world" id="bcMindMapWorld"><svg class="bc-mindmap-svg" id="bcMindMapSvg" xmlns="http://www.w3.org/2000/svg"></svg></div>'+
      '</div>'+
    '</section>';

  document.body.appendChild(ov);
  document.body.style.overflow='hidden';

  current={
    subject:subject,
    moduleId:moduleId,
    root:root,
    overlay:ov,
    stage:ov.querySelector('#bcMindMapStage'),
    world:ov.querySelector('#bcMindMapWorld'),
    svg:ov.querySelector('#bcMindMapSvg'),
    scale:1,tx:0,ty:0,layout:null
  };

  render();
  bindPanZoom();

  ov.querySelectorAll('[data-mm-action]').forEach(function(btn){
    btn.addEventListener('click',function(){
      const action=btn.dataset.mmAction;
      if(action==='close') close();
      else if(action==='zoomout') zoom(-.1);
      else if(action==='zoomin') zoom(.1);
      else if(action==='fit') fit();
      else if(action==='actual') actual();
      else if(action==='center') center();
      else if(action==='expand'){setExpanded(current.root,true);render();fit();}
      else if(action==='collapse'){
        walk(current.root,function(n){n.expanded=false;});
        current.root.expanded=true;
        current.root.children.forEach(function(n){n.expanded=false;});
        render();fit();
      }
      else if(action==='fullscreen') fullscreen();
    });
  });

  ov.addEventListener('click',function(ev){if(ev.target===ov)close();});
  requestAnimationFrame(function(){requestAnimationFrame(fit);});
}

function injectForModule(module){
  if(!module || module.querySelector('.'+ENTRY_CLASS) || module.querySelector('[data-native-kind="mindmap"]')) return;
  const moduleId=module.dataset.cf;
  if(!moduleId) return;
  const d=theoryData(moduleId);
  if(!d && !registry.has(key(SUBJECT,moduleId))) return;

  const body=module.querySelector('.cf-module-body,.ds-module-body');
  if(!body) return;

  const entry=document.createElement('div');
  entry.className=ENTRY_CLASS;
  const num=moduleNumber(module,moduleId);
  entry.innerHTML=
    '<div class="bc-mindmap-entry-copy">'+
      '<strong>🧠 Mapa mental'+(num?' — PEN M'+esc(num):'')+' <span class="bc-mindmap-badge">Interativo</span></strong>'+
      '<small>Revisão visual do módulo. Clique nos nós para abrir ou recolher ramos, use zoom e arraste o mapa.</small>'+
    '</div>'+
    '<button type="button" class="bc-mindmap-open">Abrir mapa mental</button>';

  entry.querySelector('.bc-mindmap-open').addEventListener('click',function(){
    open(SUBJECT,moduleId,module);
  });

  const theoryEntry=body.querySelector('.pen-full-entry');
  const subtitle=body.querySelector('.cf-subtitle');
  if(theoryEntry) theoryEntry.insertAdjacentElement('afterend',entry);
  else if(subtitle) subtitle.insertAdjacentElement('afterend',entry);
  else body.insertAdjacentElement('afterbegin',entry);
}

function scan(){
  document.querySelectorAll(MODULE_SELECTOR).forEach(function(module){
    const moduleId=module.dataset.cf;
    if(!moduleId) return;
    if(!theoryData(moduleId) && !registry.has(key(SUBJECT,moduleId))) return;
    injectForModule(module);
  });
}

function install(){
  scan();
  observer=new MutationObserver(function(){
    clearTimeout(install._t);
    install._t=setTimeout(scan,40);
  });
  observer.observe(document.getElementById('subjects'),{childList:true});
}

function register(subject,moduleId,tree){
  registry.set(key(subject,moduleId),cloneTree(tree));
  scan();
}

global.BaseMindMap={
  open:function(subject,moduleId){ open(subject,moduleId,document.querySelector('#subjects .subject[data-id="'+subject+'"] [data-cf="'+moduleId+'"]')); },
  close:close,
  register:register,
  version:'2026.10.01-preview1'
};

document.addEventListener('keydown',function(ev){
  if(ev.key==='Escape' && document.getElementById(OVERLAY_ID)) close();
});

if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',install);
else install();

})(window);
