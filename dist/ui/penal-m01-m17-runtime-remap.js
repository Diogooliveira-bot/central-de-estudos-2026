(function(global){
'use strict';
function clone(x){return x?JSON.parse(JSON.stringify(x)):null}
function uniq(a){return Array.from(new Set((a||[]).filter(Boolean)))}
function apply(){
 try{
  if(typeof PENAL_WEEKS==='undefined'||!Array.isArray(PENAL_WEEKS))return false;
  const by=id=>PENAL_WEEKS.find(x=>x.id===id);
  const old={};for(let n=1;n<=17;n++)old['p'+n]=clone(by('p'+n));
  if(Object.values(old).some(x=>!x))return false;
  const meta={
   p1:{num:1,title:'Princípios, interpretação, analogia e conflito aparente',subtitle:'Princípios penais; interpretação; analogia; conflito aparente',base:'p1',read:'CF, art. 5º, XXXIX a XLVII; CP, arts. 1º e 12.'},
   p2:{num:2,title:'Aplicação da Lei Penal',subtitle:'Lei penal no tempo e no espaço',base:'p2',read:'CP, arts. 1º a 12; CF, art. 5º, XXXIX e XL.'},
   p3:{num:3,title:'Teoria do Crime',subtitle:'Fato típico; conduta; causalidade; tentativa; dolo e culpa',base:'p3',read:'CP, arts. 13 a 22.'},
   p4:{num:4,title:'Ilicitude',subtitle:'CP, arts. 23 a 25',base:'p3',read:'CP, arts. 23 a 25; STF, ADPF 779.'},
   p5:{num:5,title:'Culpabilidade e Teoria do Erro',subtitle:'CP, arts. 20 a 22 e 26 a 28',base:'p4',read:'CP, arts. 20 a 22 e 26 a 28.'},
   p6:{num:6,title:'Concurso de Pessoas',subtitle:'CP, arts. 29 a 31',base:'p5',read:'CP, arts. 29 a 31.'},
   p7:{num:7,title:'Concurso de Crimes e Penas',subtitle:'Concurso de crimes; penas; regimes; dosimetria; medidas de segurança',base:'p6',read:'CP, arts. 32 a 95, com foco em penas e concurso de crimes.'},
   p8:{num:8,title:'Punibilidade e Prescrição',subtitle:'Ação penal; extinção da punibilidade; prescrição',base:'p7',read:'CP, arts. 100 a 120.'},
   p9:{num:9,title:'Crimes contra a Pessoa',subtitle:'CP, arts. 121 a 154-B',base:'p8',read:'CP, arts. 121 a 154-B.'},
   p10:{num:10,title:'Crimes contra o Patrimônio',subtitle:'CP, arts. 155 a 183-A',base:'p9',read:'CP, arts. 155 a 183-A.'},
   p11:{num:11,title:'Crimes contra a Fé Pública',subtitle:'CP, arts. 289 a 311-A',base:'p10',read:'CP, arts. 289 a 311-A.'},
   p12:{num:12,title:'Crimes contra a Dignidade Sexual',subtitle:'CP, arts. 213 a 234-B',base:'p11',read:'CP, arts. 213 a 234-B.'},
   p13:{num:13,title:'Crimes contra a Administração Pública',subtitle:'CP, arts. 312 a 359-H',base:'p12',read:'CP, arts. 312 a 359-H.'},
   p14:{num:14,title:'Abuso de Autoridade',subtitle:'Lei 13.869/2019',base:'p13',read:'Lei 13.869/2019.'},
   p15:{num:15,title:'Lavagem de Dinheiro',subtitle:'Lei 9.613/1998',base:'p14',read:'Lei 9.613/1998.'},
   p16:{num:16,title:'Crimes em Licitações e Contratos',subtitle:'CP, arts. 337-E a 337-P',base:'p16',read:'CP, arts. 337-E a 337-P; Lei 14.133/2021 como contexto.'},
   p17:{num:17,title:'Constituição Penal, Responsabilidade Penal da Pessoa Jurídica, Súmulas e Consolidação',subtitle:'CF, art. 5º; CF, art. 225, §3º; Lei 9.605/1998; súmulas STF/STJ',base:'p15',read:'CF, art. 5º; CF, art. 225, §3º; Lei 9.605/1998; súmulas STF/STJ.'}
  };
  Object.entries(meta).forEach(([id,m])=>{
   const target=by(id),base=clone(old[m.base]);
   const topics=id==='p13'?uniq([...(old.p12.topics||[]),...(old.p17.topics||[])]):uniq(base.topics||[]);
   const next={...base,id,num:m.num,title:m.title,subtitle:m.subtitle,read:m.read,topics,editalModule:'pen-m'+String(m.num).padStart(2,'0')};
   Object.keys(target).forEach(k=>delete target[k]);Object.assign(target,next);
  });
  try{
   if(typeof PENAL_ANKI!=='undefined'){
    const names={
     p1:'01 PRINCÍPIOS, INTERPRETAÇÃO, ANALOGIA E CONFLITO APARENTE',p2:'02 APLICAÇÃO DA LEI PENAL',p3:'03 TEORIA DO CRIME',p4:'04 ILICITUDE',
     p5:'05 CULPABILIDADE E TEORIA DO ERRO',p6:'06 CONCURSO DE PESSOAS',p7:'07 CONCURSO DE CRIMES E PENAS',p8:'08 PUNIBILIDADE E PRESCRIÇÃO',
     p9:'09 CRIMES CONTRA A PESSOA',p10:'10 CRIMES CONTRA O PATRIMÔNIO',p11:'11 CRIMES CONTRA A FÉ PÚBLICA',p12:'12 CRIMES CONTRA A DIGNIDADE SEXUAL',
     p13:'13 CRIMES CONTRA A ADMINISTRAÇÃO PÚBLICA',p14:'14 ABUSO DE AUTORIDADE - LEI 13.869',p15:'15 LAVAGEM DE DINHEIRO - LEI 9.613',
     p16:'16 CRIMES EM LICITAÇÕES E CONTRATOS',p17:'17 CONSTITUIÇÃO PENAL, PESSOA JURÍDICA E SÚMULAS'
    };
    Object.entries(names).forEach(([id,name])=>PENAL_ANKI[id]='05 DIREITO PENAL::'+name);
   }
  }catch(_){}
  if(typeof renderSubjects==='function')renderSubjects();
  function visible(){
   for(let n=1;n<=17;n++){
    const el=document.querySelector('#subjects .subject[data-id="penal"] .cf-module[data-cf="p'+n+'"]');
    if(!el)continue;el.hidden=false;el.style.removeProperty('display');
    const h=el.querySelector('.cf-module-head');if(h){h.hidden=false;h.style.removeProperty('display')}
   }
  }
  visible();setTimeout(visible,80);setTimeout(visible,350);setTimeout(visible,900);
  global.__penalM01M17CanonicalRemapApplied=true;
  return true;
 }catch(err){console.error('[Penal M01-M17 canonical remap]',err);return false}
}
if(!apply())setTimeout(()=>{if(!apply())setTimeout(apply,150)},60);
})(window);
